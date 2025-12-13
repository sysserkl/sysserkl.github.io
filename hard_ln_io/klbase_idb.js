function idb_read_b(odb,dbf_name,fn_onsuccess=false,other_var1=false,other_var2=false){
    return new Promise((resolve, reject) => {
        var transaction = odb.transaction([dbf_name], 'readonly');
        
        transaction.oncomplete = function(event){
            console.log('transaction ok');
            resolve(true);
        };
            
        transaction.onerror = function(event){
            console.log('transaction error:',dbf_name);
            reject(event.target.error);
        };

        var otable = transaction.objectStore(dbf_name);
        
        otable.openCursor().onsuccess = function (event){
            if (fn_onsuccess!==false){
                fn_onsuccess(resolve, reject, event, other_var1,other_var2);
            }
        };
    });
}

function idb_count_b(odb,dbf_name,fn_onsuccess=false){
    return new Promise((resolve, reject) => {
        var blcount=0;    
        var transaction = odb.transaction([dbf_name], 'readonly');
        
        transaction.oncomplete = function(event){
            console.log('transaction ok',blcount);
            resolve(blcount);
        };
        
        transaction.onerror = function(event){
            console.log('transaction error');
            reject(event.target.error);
        };

        var otable = transaction.objectStore(dbf_name);

        var ocount=otable.count();
        ocount.onsuccess = function(){
            blcount=ocount.result;
            if (fn_onsuccess!==false){
                fn_onsuccess(blcount);
            }
        }
        ocount.onerror = function(event){
            reject(event.target.error);
        }
    });
}

function idb_write_b(odb,dbf_name,fn_count1,fn_count2,fn_onsuccess=false,do_clear=true){
    //fn_count1,fn_count2 仅用于清除记录时 - 保留注释
    return new Promise((resolve, reject) => {
        var transaction = odb.transaction([dbf_name], 'readwrite');
        
        transaction.oncomplete = function(event){
            console.log('transaction ok');
            resolve(true);
        };
        
        transaction.onerror = function(event){
            console.log('transaction error');
            reject(event.target.error);
        };

        var otable = transaction.objectStore(dbf_name);
        //idb_table_success_error_b(otable,dbf_name); - 此行保留 - 保留注释
        //idb_table_success_error_b 函数，它为 otable 设置了 onsuccess 和 onerror 事件监听器。然而，在 idb_write_b 函数中，事务（transaction）层面已经设置了错误处理和完成回调，对于对象存储表（object store）级别的打开成功或失败通常不需要单独处理。
        //实际上，在调用 transaction.objectStore(dbf_name) 的时候就已经打开了对应的 object store，如果此时 object store 打开失败，整个事务会立即触发错误事件，而在 transaction.onerror 中已经对此进行了处理。
        //因此，idb_table_success_error_b 函数在这里可能是冗余的。
        //以下部分保留 - 保留注释
        //function idb_table_success_error_b(otable,dbf_name){
            //otable.onsuccess = function (event){
                //console.log('dbf 打开成功:',dbf_name);
            //};
            //otable.onerror = function (event){
                //console.log('dbf 打开失败:',dbf_name);
            //}
        //}    
        
        //otable.onsuccess 事件处理器并不是必要的，因为 transaction.objectStore(dbf_name) 是一个同步操作，它不会触发任何异步成功或错误事件。当调用 db.transaction() 并获取到对象存储引用时，这个对象存储就已经准备好了使用，无需等待额外的“打开成功”事件。
        //在 IndexedDB 中，通常只有那些涉及网络请求（例如事务提交）或者执行异步查询（如 openCursor() 或 get() 等方法）的操作才会触发相应的成功或错误事件。而直接访问事务中的对象存储并不涉及这些异步操作，所以不需要为其设置 onsuccess 事件处理器。        
        
        if (do_clear){
            var ocount1=otable.count();
            ocount1.onsuccess = async function(){
                if (fn_count1!==false){
                    fn_count1(ocount1.result);
                }
                console.log('清除前记录数：',ocount1.result);

                var oclear = otable.clear();
                //.clear() 方法用于清除对象存储中的所有数据。这个方法是同步的，意味着它在执行时不会立即返回一个 Promise，而是立即完成其操作（当然，在事务提交之前，数据实际上并未从数据库中删除）。因此，调用 .clear() 后不需要等待异步结果。
                //oclear 不是一个 Promise，而是一个 IDBCursorDeleteRequest 对象，它有 onsucces 和 onerror 回调函数，可以用来监听清除操作的成功或失败。
                
                oclear.onerror= function(event){
                    console.log('数据清除失败');
                    reject(event.target.error);
                };

                oclear.onsuccess = async function(event){
                    console.log('数据清除成功');
                       
                    var ocount2=otable.count();
                    ocount2.onsuccess = function(){
                        if (fn_count2!==false){
                            fn_count2(ocount2.result);
                        }
                        console.log('清除后记录数：',ocount2.result);
                        // 确保在清除和计数完成后执行 fn_onsuccess
                        if (fn_onsuccess !== false){
                            fn_onsuccess(otable);
                        }
                    }
                }
            }
        } else if (fn_onsuccess!==false){
            fn_onsuccess(otable);
        }
    });
}

function idb_main_b(cstype='',dbc_name,dbf_name,switch_fn,other_var1=false,other_var2=false,other_var3=false,cskeypath=false){
    //删除数据库：indexedDB.deleteDatabase(数据库名称); - 保留注释
    return new Promise((resolve, reject) => {
        var db;
        var DBOpenRequest = window.indexedDB.open(dbc_name);
        var switchFnCalled = false;

        DBOpenRequest.onerror = function (event){
            console.log(dbc_name+' 数据库打开报错');
            reject(new Error('数据库打开报错'));
        };

        //检查查数据库中是否存在一个名为 dbf_name 的对象存储（Object Store）。如果该对象存储不存在，那么它会在数据库中创建一个新的对象存储，并命名为 dbf_name 。这个新的对象存储还被设置为自动递增（autoIncrement），这意味着每当你向对象存储添加新数据时，每个新数据的键都会自动递增。 - 保留注释
        DBOpenRequest.onupgradeneeded = function (event){
            var db = event.target.result;
            if (!db.objectStoreNames.contains(dbf_name)){
                //以下几行保留 - 保留注释
                //db.createObjectStore(dbf_name, { autoIncrement: true })  
                //.onerror = function(event){  
                    //console.log('升级时创建对象存储失败: ', event.target.errorCode);  
                    //reject(new Error('升级时创建对象存储失败'));  
                //};
                            
                try {
                    if (cskeypath==false){
                        db.createObjectStore(dbf_name, { autoIncrement: true });
                    } else {
                        console.log('keyPath',cskeypath);
                        db.createObjectStore(dbf_name, { keyPath: cskeypath });
                    }
                } catch (error){
                    console.log('升级时创建对象存储失败: ' + error);
                    reject(new Error('升级时创建对象存储失败'));
                } finally {  
                    if (!switchFnCalled){  
                        console.log('onupgradeneeded');  
                        switchFnCalled = true;  

                        try {
                            switch_fn(cstype, db, resolve, reject, other_var1,other_var2,other_var3);  
                        } catch (error){  
                            reject(error); // Reject the promise if switch_fn throws an error  
                        }
                    }
                }
            }
        };

        DBOpenRequest.onsuccess = function (event){
            db = DBOpenRequest.result;
            console.log(dbc_name+' 数据库打开成功');
            //创建对象存储通常应该只在 onupgradeneeded 事件中进行，因为在 onsuccess 回调中创建已存在的对象存储可能会引发错误（虽然在大多数浏览器中不会报错）。

            //if (!switchFnCalled && db.readyState === 'complete'){ //此行保留 - 保留注释

            if (!switchFnCalled){
                switchFnCalled = true;
                try {  
                    switch_fn(cstype, db, resolve, reject, other_var1,other_var2,other_var3);  
                } catch (error){  
                    reject(error); // Reject the promise if switch_fn throws an error  
                }
            }
        };
    });
}

function idb_close_b(db){  
    if (db && db.readyState === 'done'){  //确保数据库已打开且处于可交互状态 - 保留注释
        db.close();  
    }  
}  

//-----------------------
function idb_bigfile_b(crud_type='',do_type='',cskey='',run_fn=false){
    async function sub_idb_bigfile_b_switch(crud_type, db, resolve, reject){
        var sub_operation;    
        switch (crud_type){
            case 'read':
                sub_operation=idb_read_bigfile_b(db,do_type,cskey,run_fn);
                break;
            case 'edit':
                sub_operation=idb_edit_bigfile_b(db,do_type,cskey,run_fn);
                break;
            case 'clear':
                sub_operation=idb_clear_bigfile_b(db,do_type,cskey,run_fn);
                break;
            case 'count':
                sub_operation=idb_count_bigfile_b(db);
                break;
            default:
                console.error('Invalid operation type:', crud_type);
                idb_close_b(db);
                reject(new Error(`Unsupported operation: ${crud_type}`));
                break;
        }

        try {
            var bljg=await sub_operation;
            resolve(bljg);
        } catch (error){
            reject(error);
        } finally {
            idb_close_b(db);
        }
    }
    //-----------------------
    return idb_main_b(crud_type,'bigfile_dbc','bigfile_dbf',sub_idb_bigfile_b_switch);
    //idb_bigfile_b('count').then(value => {console.log('行数：',value);}); //此行保留 - 保留注释    
}

function idb_read_bigfile_b(db,do_type='',cskey='',run_fn=false){
    function sub_idb_read_bigfile_b_search(){
        //current_result_bigfile_global 每个元素为：[id,name,content,datetime] - 保留注释
        if (do_type!=='eval'){
            if (typeof run_fn == 'function'){
                run_fn(raw_data_bigfile);
            }
        }
    }
    
    function sub_idb_read_bigfile_b_is_book_data_file(fname,cscontent){
        //与 txtbook_standalone_terminal.py 对应 - 保留注释
        if (!fname.endsWith('_data.js')){return '';}
        var list_t=cscontent.split('\n').slice(0,4);
        if (list_t.length<4){return '';}
        var book_name='';
        if (!list_t[0].startsWith('//')){
            return '';
        } else {
            book_name=list_t[0].slice(2,);
        }
        
        if (!list_t[1].startsWith('csbookname_global')){return '';}
        if (!list_t[2].startsWith('csbooklist_sub_global')){return '';}
        if (!list_t[3].startsWith('csbookno_global')){return '';}
        
        return book_name;
    }
    
    function sub_idb_read_bigfile_b_title(){
        record_count=record_count+1;
        document.title=record_count+' - '+old_title;    
    }
    
    function sub_idb_read_bigfile_b_onsuccess(resolve, reject, event, other_var1,other_var2){
        var cursor = event.target.result;
        if (cursor){
            if (do_type=='filedict'){   //根据文件名称，获取文件内容，返回字典 - 保留注释
                if (cskey.includes(cursor.value.name)){
                    raw_data_bigfile['f_'+cursor.value.name]=cursor.value.content;
                    sub_idb_read_bigfile_b_title();
                }
            } else if (cskey=='' || cursor.value.name==cskey){
                switch (do_type){
                    case 'eval':
                        style_generate_b(cursor.value.content,true,'script');
                        //var odom = document.createElement('script');
                        //document.head.appendChild(odom);    
                        //odom.src=cursor.value.content; //此行保留 - 保留注释
                        //odom.innerHTML=cursor.value.content; //此行保留 - 保留注释       
                        sub_idb_read_bigfile_b_title();             
                        break;
                    case 'content':
                        raw_data_bigfile=cursor.value.content;
                        sub_idb_read_bigfile_b_title();
                        break;
                    case 'booklist':
                        var book_name=sub_idb_read_bigfile_b_is_book_data_file(cursor.value.name,cursor.value.content);
                        //返回文件名、书籍名称 - 保留注释
                        if (book_name!==''){
                            raw_data_bigfile.push([cursor.value.name,book_name]);
                            sub_idb_read_bigfile_b_title();
                        }
                        break;
                    case 'gpxlist':
                        if (cursor.value.name.endsWith('.gpx')){
                            raw_data_bigfile.push(cursor.value.name);
                            sub_idb_read_bigfile_b_title();
                        }                        
                        break;
                    case 'readlaterlist':
                        if (cursor.value.name.match(/^readlater_data_.+\.js$/)){
                            raw_data_bigfile.push(cursor.value.name);
                            sub_idb_read_bigfile_b_title();
                        }
                        break;
                    case 'lsmlist':
                        if (cursor.value.name.match(/^lsm.*\.txt$/)){
                            raw_data_bigfile.push(cursor.value.name);
                            sub_idb_read_bigfile_b_title();
                        }
                        break;
                    default:
                        //返回文件序号、名称、起始部分、大小(M)、日期等 - 保留注释
                        var bllen=cursor.value.content.length;
                        raw_data_bigfile.push([cursor.value.id,cursor.value.name,cursor.value.content.slice(0,100)+(bllen>200?'……'+cursor.value.content.slice(-100,):''),(cursor.value.content.length/1024/1024).toFixed(3)+'M',cursor.value.date]);
                        sub_idb_read_bigfile_b_title();
                        break;
                }
            }
            cursor.continue();
        } else {
            document.title=old_title;
            sub_idb_read_bigfile_b_search();
        }
    }
    //-----------------------
    if (do_type=='filedict'){
        var raw_data_bigfile={};
    } else if (do_type=='content'){
        var raw_data_bigfile='';
    } else {
        var raw_data_bigfile=[];
    }
    
    var old_title=document.title;
    var record_count=0;  //不能放在 sub_idb_read_bigfile_b_onsuccess 函数中 - 保留注释
    return idb_read_b(db,'bigfile_dbf',sub_idb_read_bigfile_b_onsuccess);
}


function idb_count_bigfile_b(db){
    function sub_idb_count_bigfile_b_onsuccess(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB现有记录 '+cscount+' 条';
    }
    //-----------------------
    return idb_count_b(db,'bigfile_dbf',sub_idb_count_bigfile_b_onsuccess);
}

function idb_menu_generate_bigfile_b(cstype,select_id_name,csparent,import_fn_name){
    console.log(csparent,import_fn_name);
    return '<span class="span_menu"><span class="span_link" onclick="window.open(\'bigfile.htm\');">bigfile</span>: <input type="text" class="input_filter_idb_menu_bigfile" title="筛选" placeholder="筛选" style="width:11rem;" value="" onkeyup="if (event.key==\'Enter\'){idb_option_clear_bigfile_b(\''+cstype+'\',\''+select_id_name+'\',true);}" /><br /><select id="'+select_id_name+'" style="width:12rem;height:2rem;" onclick="idb_option_generate_bigfile_b(\''+cstype+'\',this);" onchange="idb_option_clear_bigfile_b(\''+cstype+'\',this);"></select> <span class="aclick" onclick="if (idb_menu_import_bigfile_b(\''+select_id_name+'\')){'+csparent+'} '+import_fn_name+'();">导入</span></span>';
}

function idb_menu_import_bigfile_b(select_id_name){
    return document.getElementById(select_id_name).value!=='重新载入';
}

function idb_option_clear_bigfile_b(cstype,oselect,do_refresh=false){
    if (typeof oselect=='string'){
        oselect=document.getElementById(oselect);
    }

    if (oselect.value=='重新载入'){
        oselect.innerHTML='';
        idb_option_generate_bigfile_b(cstype,oselect);
    } else if (do_refresh){
        idb_option_generate_bigfile_b(cstype,oselect);
    }
}

function idb_option_generate_bigfile_b(cstype,oselect){
    function sub_idb_option_generate_bigfile_b_style(arow){
        let blfound=str_reg_search_b(arow,filter_str,is_reg);
        if (filter_str=='' || blfound){
            return '';
        } else {
            return 'none';
        }
    }
    
    function sub_idb_option_generate_bigfile_b_filter(){
        for (let blxl=0,lent=ooptions.length;blxl<lent-2;blxl++){
            let one_option=ooptions[blxl];
            let blstr=one_option.innerText;
            let blstyle=sub_idb_option_generate_bigfile_b_style(blstr);
            one_option.style.display=blstyle;
        }
        select_first_visible_option_b(oselect,ooptions);
    }
    
    function sub_idb_option_generate_bigfile_b_html(csarr){
        csarr.sort(zh_sort_b);
        if (cstype=='book'){
            for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
                let blstyle=sub_idb_option_generate_bigfile_b_style(csarr[blxl]);
                csarr[blxl]='<option value="'+csarr[blxl][0]+'" style="display:'+blstyle+'">'+csarr[blxl][1]+'</option>';
            }
        } else {
            for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
                let blstyle=sub_idb_option_generate_bigfile_b_style(csarr[blxl]);
                csarr[blxl]='<option style="display:'+blstyle+'">'+csarr[blxl]+'</option>';
            }
        }
        
        csarr=['<option>重新载入</option>','<option>手动输入 bigfile '+cstype+' 文件名</option>'].concat(csarr);

        oselect.innerHTML=csarr.join('\n');
        ooptions=oselect.querySelectorAll('option');    //刷新option数组 - 保留注释
        oselect.removeAttribute('onclick');
        select_first_visible_option_b(oselect,ooptions);
    }
    
    var filter_str=oselect.parentNode.querySelector('input.input_filter_idb_menu_bigfile').value.trim();
    var is_reg=false;
    [filter_str,is_reg]=str_reg_check_b(filter_str,is_reg);
    
    var ooptions=oselect.querySelectorAll('option');
    if (ooptions.length==0){
        idb_bigfile_b('read',cstype+'list','',sub_idb_option_generate_bigfile_b_html);  //此处自动在类型后添加 list - 保留注释
    } else {
        sub_idb_option_generate_bigfile_b_filter();
    }
}

function idb_edit_bigfile_b(db,do_type='',cskey='',run_fn=false){
    function sub_idb_edit_bigfile_b_run(){
        idb_bigfile_b('read',do_type,cskey,run_fn);
    }
    
    async function sub_idb_edit_bigfile_b_append(otable){
        try {
            var objectStoreRequest = otable.add({
            'id': 0, //无效字段，以免出现 undefined - 保留注释
            'name': file_name_bigfile_global, 
            'content': file_content_bigfile_global, 
            'date': new Date().toLocaleString(),
            });

            await new Promise((resolve, reject) => {
                objectStoreRequest.onsuccess = () => {
                    console.log('objectStoreRequest success');
                    sub_idb_edit_bigfile_b_run();
                    resolve();
                };
                objectStoreRequest.onerror = (event) => {
                    console.log('objectStoreRequest error');
                    sub_idb_edit_bigfile_b_run();
                    reject(event.target.error);
                };
            });
            //idb_bigfile_b('read',do_type,cskey,run_fn);
        } catch (error){
            console.error('Error appending to bigfile:', error);
            throw error;
        }        
    }

    async function sub_idb_edit_bigfile_b_onsuccess(otable){
        otable.openCursor().onsuccess = function (event){
            var cursor = event.target.result;
            if (do_type=='append'){
                if (cursor){
                    cursor.continue();
                } else {
                    sub_idb_edit_bigfile_b_append(otable);
                }
            } else {
                if (cursor){
                    if (cursor.value.name === file_name_bigfile_global){
                        found_old_data=true;
                        if (do_type=='delete'){
                            const deleteRequest = cursor.delete();
                            new Promise((resolve, reject) => {
                                deleteRequest.onsuccess = () => {
                                    console.log('deleted');
                                    sub_idb_edit_bigfile_b_run();
                                    resolve();
                                };
                                deleteRequest.onerror = (event) => {
                                    console.log('delete error:', event.target.error);
                                    reject(event.target.error);
                                };
                            });
                        } else {
                            const updateData = cursor.value;
                            updateData.content = file_content_bigfile_global;
                            updateData.date = new Date().toLocaleString();
                            const updateRequest = cursor.update(updateData);

                            new Promise((resolve, reject) => {
                                updateRequest.onsuccess = () => {
                                    console.log('updated');
                                    sub_idb_edit_bigfile_b_run();
                                    resolve();
                                };
                                updateRequest.onerror = (event) => {
                                    console.log('update error:', event.target.error);
                                    reject(event.target.error);
                                };
                            });
                        }
                    } else {
                        cursor.continue();
                    }
                } else {
                    if (!found_old_data){
                        idb_edit_bigfile_b(db,'append',cskey,run_fn);
                    }
                }
            }
        }
    }
    //-----------------------
    var found_old_data=false;
    var do_write=false;
    if (do_type=='delete'){
        if (file_name_bigfile_global !== ''){
            do_write=true;
        }
    } else {
        do_write=true;
    }
    if (do_write){
        return idb_write_b(db, 'bigfile_dbf', false, false, sub_idb_edit_bigfile_b_onsuccess, false);        
    } else {
        return Promise.resolve(false);
    }
}

function idb_clear_bigfile_b(db,do_type='',cskey='',run_fn=false){
    function sub_idb_clear_bigfile_b_count1(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB 清除前记录数：'+cscount;
    }

    function sub_idb_clear_bigfile_b_count2(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB数据清除完毕，现有记录 '+cscount+' 条';
    }
    
    function sub_idb_clear_bigfile_b_onsuccess(otable){
        idb_bigfile_b('read',do_type,cskey,run_fn);
    }
    //-----------------------
    var rndstr = Math.floor(Math.random()*(1000 - (9999+1)) +9999+1);
    
    if ((prompt('输入 ' + rndstr + ' 确认清除全部数据') || '').trim() == rndstr){
        return idb_write_b(db, 'bigfile_dbf', sub_idb_clear_bigfile_b_count1, sub_idb_clear_bigfile_b_count2, sub_idb_clear_bigfile_b_onsuccess);
    } else {
        return new Promise((resolve, reject) => {reject(new Error('User did not confirm data clearing.'));});    
    } 
}

function read_bigfile_standalone_from_idb_b(run_fn=false){
    function read_bigfile_standalone_from_idb_b_htm(csstr){
        if (csstr==''){
            alert('未获得 '+fname+' .htm');
        } else {
            cslist.push(['.htm',csstr]);
            if (typeof run_fn == 'function'){
                run_fn(cslist);
            }
        }
    }
    
    function read_bigfile_standalone_from_idb_b_js(csstr){
        if (csstr==''){
            alert('未获得 '+fname+' .js');
        } else {
            cslist.push(['.js',csstr]);
            idb_bigfile_b('read','content',fname+'.htm',read_bigfile_standalone_from_idb_b_htm);
        }
    }
    
    var fname='bigfile_standalone';
    var cslist=[];
    idb_bigfile_b('read','content',fname+'.js',read_bigfile_standalone_from_idb_b_js);
}
