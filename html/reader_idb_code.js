function args_reader_idb(){
    var cskeys=href_split_b(location.href);
    for (let bltmpstr of cskeys){
        bltmpstr=bltmpstr.trim();
        if (bltmpstr.substring(0,5)=='line='){
            var blno_lines=bltmpstr.substring(5,).split('_'); //30_20
            document.getElementById('input_lines').value=parseInt(blno_lines[1]);
            if (blno_lines.length>1){
                document.getElementById('input_lineno').value=parseInt(blno_lines[0]);
            }
            break;
        }
    }
    
    for (let item of idbfilename_list_global){
        if (item[1]==cskeys[0]){
            return item[0];
            break;
        }
    }
    return -1;
}

function init_reader_idb(){
    character_2_icon_b('📗️️');
    mobile_style_kltxt_b();
    menu_reader_idb();
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.7rem':'1.4rem'));
    center_reader_idb('list');
}

function menu_reader_idb(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'jsdoc_no_change_reader_idb(this);">jsdoc no: 1</span>',    
    '<span class="span_menu" onclick="'+str_t+'bookmarks_get_kltxt_b(false,false,\'reader_idb_lastbook\');">读取最新书签</span>',
    '<span class="span_menu" onclick="'+str_t+'bookmarks_set_kltxt_b(\'reader_idb_lastbook\');">添加书签</span>',
    '<span class="span_menu" onclick="'+str_t+'reading_mode_kltxt_b();">进入阅读状态</span>',    
    ];

    var blhref=location.href;
    if (blhref.substring(0,5)!=='file:'){
        klmenu1.push('<span class="span_menu" onclick="'+str_t+'remote_book_list_reader_idb();">读取远程书籍</span>');
    }
    
    var klmenu2=[
    '<span class="span_menu" onclick="'+str_t+'popup_show_hide_b(\'div_upload_buttons\');">上传书籍</span>',            
    '<span class="span_menu" onclick="'+str_t+'remove_current_book_reader_idb();">移除当前书籍</span>',    
    '<span class="span_menu" onclick="'+str_t+'center_reader_idb(\'clear_all\');">清空所有书籍</span>',    
    '<span class="span_menu" onclick="'+str_t+'bookname_set_reader_idb();">当前书籍书名修改</span>',    
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'reader_idb\');">更新版本</span>',        
    ];

    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','10rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','12rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function remove_current_book_reader_idb(){
    if (csbookname_global==''){return;}
    var blid=-1;
    var bookname='';
    for (let item of idbfilename_list_global){
        if (item[1]==csbookname_global){
            blid=item[0];
            bookname=item[2];
            break;
        }
    }
    
    if (!confirm('是否移除当前书籍：'+bookname+'？')){return;}

    center_reader_idb('delete','',blid);
}

function remote_book_list_reader_idb(){
    var odiv=document.getElementById('divhtml2');
    var oinput=document.getElementById('input_remote_book_filter');
    if (oinput){
        odiv.innerHTML='';
        return;
    }
    var bljg='<hr />\n';
    bljg=bljg+'<p style="margin:0.5rem;">';
    bljg=bljg+'<input type="text" id="input_remote_book_filter" placeholder="远程书籍筛选" onkeyup="if (event.key==\'Enter\'){remote_book_filter_reader_idb(this.value);}"> ';
    bljg=bljg+close_button_b('divhtml2','');
    bljg=bljg+'</p>\n';
    bljg=bljg+'<hr />\n';
    
    var list_t=[];
    for (let item of csbooklist_source_global){
        list_t.push('<span class="span_link" onclick="remote_book_import_reader_idb(\''+specialstr_j(item[0],false)+'\',\''+item[3]+'\');">'+item[1]+'</span>');
    }
    odiv.innerHTML=bljg+'<div style="margin:0.5rem;'+(ismobile_b()?'':'column-count:2;')+'">'+array_2_li_b(list_t,'li','ol','ol_remote_book_list')+'</div>';
    input_with_x_b('input_remote_book_filter',16);
    odiv.scrollIntoView();
}

function remote_book_filter_reader_idb(cskey){
    var olis=document.querySelectorAll('ol#ol_remote_book_list li');
    var blreg=false;
    if (cskey.slice(-4,)=='(:r)'){
        blreg=true;
        cskey=cskey.slice(0,-4).trim();
    }
    obj_search_show_hide_b(olis,'',cskey,blreg);
}

function remote_book_import_reader_idb(filename,jsdoc_num){
    var bookname=filename_2_bookname_b(filename);
    if (!confirm("是否载入文件："+bookname+"？")){return;}
    
    var blpath_name=book_path_b(jsdoc_num)+filename+'.js';
    var allText=read_txt_file_b(blpath_name);

    try {
        eval(allText);  //var filelist 此时是局部变量 - 保留注释
        if (filelist.length==0){
            alert('远程文件无适合内容：'+blpath_name);  
            return;                        
        }
        generate_list_reader_idb(filename,filelist);
    } catch (error){
        alert('解读错误：'+blpath_name);  
        return;
    }
}

function jsdoc_no_change_reader_idb(ospan){
    var old_value=ospan.innerText.split(':').slice(-1)[0].trim();
    var blkey=(prompt('输入jsdoc no (1-3)：',old_value) || '').trim();
    if (blkey==''){return;}
    if (isNaN(blkey)){return;}
    blkey=parseInt(blkey);
    if (blkey<1 || blkey>3){return;}
    csbooklist_sub_global[csbookno_global][3]=blkey.toString();
    ospan.innerText='jsdoc no: '+blkey;
}

function file_check_reader_idb(ofile){
    if (ofile.type!=='application/x-javascript' && ofile.type!=='text/plain'){
        alert('非txt文件：'+ofile.type+'\n'+ofile.name);  
        return false;
    }
    if (ofile.size>50*1024*1024){
        alert('文件太大：'+ofile.name+' '+ofile.size);  
        return false;
    }
    return confirm("是否载入文件："+ofile.name+"？");
}

function upload_digest_reader_idb(){
    var ofile=document.getElementById('input_upload_txt').files[0];
    if (!ofile){return;}
    
    if (file_check_reader_idb(ofile)==false){return;}
        
    var txtFile = new FileReader();
    txtFile.readAsText(ofile);
    txtFile.onload = function (){
        var digest_global=[];   //此处其实是局部变量 - 保留注释
        switch (ofile.type){
            case 'application/x-javascript':
                if (this.result.trim().split('\n')[0]!=='var digest_global=`'){
                    alert('js文件内容类型错误：'+ofile.name+' '+ofile.size);  
                    return;
                }
                try {
                    eval(this.result);
                    if (digest_global.length==0){
                        alert('js文件无适合内容：'+ofile.name+' '+ofile.size);  
                        return;                        
                    }
                } catch (error){
                    alert('解读错误：'+ofile.name+' '+ofile.size);  
                    return;
                } 
                break;
            case 'text/plain':
                var list_t=this.result.trim().split('\n');
                for (let item of list_t){
                    if (item.trim()==''){continue;}
                    digest_global.push(item);
                }
                break;
        }
        generate_digest_reader_idb(digest_global);
    }
}

function upload_txt_reader_idb(){
    var ofile=document.getElementById('input_upload_txt').files[0];
    if (!ofile){return;}
        
    if (file_check_reader_idb(ofile)==false){return;}
        
    var txtFile = new FileReader();
    txtFile.readAsText(ofile);
    txtFile.onload = function (){
        var filelist=[];
        switch (ofile.type){
            case 'application/x-javascript':
                if (this.result.trim().split('\n')[0]!=='var filelist=['){
                    alert('js文件内容类型错误：'+ofile.name+' '+ofile.size);  
                    return;
                }
                try {
                    eval(this.result);
                    if (filelist.length==0){
                        alert('js文件无适合内容：'+ofile.name+' '+ofile.size);  
                        return;                        
                    }
                } catch (error){
                    alert('解读错误：'+ofile.name+' '+ofile.size);  
                    return;
                } 
                break;
            case 'text/plain':
                var list_t=this.result.trim().split('\n');
                for (let item of list_t){
                    if (item.trim()==''){continue;}
                    filelist.push(item);
                }
                break;
        }
        var blfname=ofile.name.substring(0,ofile.name.lastIndexOf('.'));
        generate_list_reader_idb(blfname,filelist);
    }
}

function generate_list_reader_idb(filename,cslist){
    filelist=cslist;
    center_reader_idb('write',filename,-1,filelist);
}

function generate_digest_reader_idb(cslist){
    digest_global=cslist;
    digest_temp_load_kltxt_b();
}

function refresh_book_list_reader_idb(){
    var result_t=[];
    idbfilename_list_global.sort(function (a,b){return zh_sort_b(a,b,false,2);});
    for (let item of idbfilename_list_global){
        result_t.push('<span class="oblong_box" onclick="choose_reader_idb('+item[0]+');">'+item[2]+'</span>');
    }
    
    var odiv=document.getElementById('span_idbbooklist');
    odiv.innerHTML=result_t.join(' ');
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function choose_reader_idb(bookid){
    digest_global=[];
    document.getElementById('input_lineno').value=1;
    center_reader_idb('read','',bookid);
}

function idb_count_rlater(db){
    function sub_idb_count_rlater_onsuccess(cscount){
        document.getElementById('span_idb_status').innerHTML='IDB现有记录 '+cscount+' 条';
    }
    //-----------------------
    return idb_count_b(db, 'rlater_dbf', sub_idb_count_rlater_onsuccess);
}

function filename_list_reader_idb(db){
    function sub_filename_list_reader_idb_onsuccess(resolve, reject, event, other_var1,other_var2){
        var cursor = event.target.result;
        if (cursor){
            if (cursor.value.type=='n'){
                var bookname_t='';
                for (let item of fname_bookname_list){
                    if (item[0]==cursor.value.content && item.length>1){
                        bookname_t=item[1];
                        break;
                    }
                }
                if (bookname_t==''){
                    bookname_t=filename_2_bookname_b(cursor.value.content);
                }
                idbfilename_list_global.push([cursor.value.id,cursor.value.content,bookname_t]);
            }
            cursor.continue();
        } else {
            refresh_book_list_reader_idb();
            var current_idb_book_id=args_reader_idb();
            if (current_idb_book_id>=0){
                center_reader_idb('read','',current_idb_book_id);
            } else if (idbfilename_list_global.length>0){
                center_reader_idb('read','',idbfilename_list_global[0][0]);
            } else {  //不能使用 locaiton.reload()  或 location.href='?' - 保留注释
                document.getElementById('divhtml').innerHTML='';
                document.getElementById('span_filename').innerHTML='';
                document.getElementById('span_filelength').innerHTML='';  
                document.title='';
                csbooklist_sub_global[csbookno_global][0]='';
                csbooklist_sub_global[csbookno_global][1]='';        
            }
            resolve(true);
        }
    }
    //-----------------------
    var fname_bookname_list=local_storage_get_b('reader_idb_filename_bookname',-1,true);
    for (let blxl=0,lent=fname_bookname_list.length;blxl<lent;blxl++){
        fname_bookname_list[blxl]=fname_bookname_list[blxl].split(' /// ');
    }
    idbfilename_list_global=[];

    return idb_read_b(db,'reader_txt_dbf',sub_filename_list_reader_idb_onsuccess);
}

function bookname_set_reader_idb(){
    if (csbookname_global==''){
        alert('未指定书籍');
        return;
    }
    var name_list=local_storage_get_b('reader_idb_filename_bookname',50,true);
    var old_bookname='';
    var new_list=[];
    for (let item of name_list){
        if (!item.includes(' /// ')){continue;}
        var list_t=item.split(' /// ');
        if (list_t[0]==csbookname_global){
            old_bookname=list_t[1];
            continue;
        }
        new_list.push(item);
    }
    var new_bookname=(prompt('输入新的书籍名称',old_bookname) || '').trim();
    if (new_bookname=='' || new_bookname==old_bookname){return;}
    new_list.push(csbookname_global+' /// '+new_bookname);
    localStorage.setItem('reader_idb_filename_bookname',new_list.join('\n'));
    
    for (let blxl=0,lent=idbfilename_list_global.length;blxl<lent;blxl++){
        if (idbfilename_list_global[blxl][1]==csbookname_global){
            idbfilename_list_global[blxl][2]=new_bookname;
            break;
        }
    }
    refresh_book_list_reader_idb();
}

function one_book_reader_idb(db,bookid){
    function sub_one_book_reader_idb_onsuccess(resolve, reject, event, other_var1,other_var2){
        var cursor = event.target.result;
        if (cursor){
            if (cursor.value.id==bookid && cursor.value.type==''){
                filelist.push(cursor.value.content);
            }
            cursor.continue();
        } else {
            document.getElementById('span_filename').innerHTML=bookname_t;
            document.getElementById('span_filelength').innerHTML='('+filelist.length+')';     
            document.title=bookname_t;
            csbooklist_sub_global[csbookno_global][0]=csbookname_global;
            csbooklist_sub_global[csbookno_global][1]='《'+csbookname_global+'》';
            digest_temp_load_kltxt_b();
            getlines_kltxt_b();
        }
    }
    //-----------------------
    var bookname_t='';
    for (let item of idbfilename_list_global){
        if (item[0]==bookid){
            csbookname_global=item[1];
            bookname_t=item[2];
            break;
        }
    }
    
    filelist=[];
    return idb_read_b(db,'reader_txt_dbf',sub_one_book_reader_idb_onsuccess);
}

function delete_reader_idb(db,bookid){
    async function sub_delete_reader_idb_cursor(cursor){
        if (cursor && cursor.value.id === bookid){
            var blcontent = cursor.value.content;
            var delete_request = cursor.delete();

            try {
                await new Promise((resolveDelete, rejectDelete) => {
                    delete_request.onsuccess = () => {
                        resolveDelete();
                    };
                    delete_request.onerror = (event) => {
                        console.log('delete error:', bookid, cursor.value.content);
                        rejectDelete(event.target.error);
                    };
                });
            } catch (error){
                // 处理错误（如果需要）
            }
        }
        return cursor.continue();
    }
    
    function sub_delete_reader_idb_onsuccess(otable){
        otable.openCursor().onsuccess = function (event){
            let cursor = event.target.result;
            if (cursor){
                sub_delete_reader_idb_cursor(cursor).then(() => {
                    if (!cursor){ // 遍历结束
                        center_reader_idb('list');
                        //resolve(true);
                    }
                });
            } else {
                // 如果一开始就无数据，则可以直接 resolve
                center_reader_idb('list');
                //resolve(true);
            }        
        };
    }
    //-----------------------
    var bookname_t='';
    for (let item of idbfilename_list_global){
        if (item[0]==bookid){
            csbookname_global=item[1];
            bookname_t=item[2];
            break;
        }
    }
            
    return idb_write_b(db,'reader_txt_dbf',false,false,sub_delete_reader_idb_onsuccess,false); 
}

function write_reader_idb(db,filename,cslist){    
    function sub_write_reader_idb_onsuccess(otable){
        var ocount1=otable.count();
        ocount1.onsuccess = function(){
            console.log(new Date().toLocaleTimeString(), '写入前记录数：',ocount1.result);
            
            var maxid=Math.max(...id_set)+1;    //会自动将字符型数字转化为数值型 - 保留注释
            otable.add({'id':maxid,'content':filename,'type':'n'});   //n: book file name - 保留注释
            for (let item of cslist){
                otable.add({'id':maxid,'content':item,'type':''});
            }
            
            var ocount2=otable.count();
            ocount2.onsuccess = function(){
                console.log(new Date().toLocaleTimeString(),'添加后记录数：',ocount2.result);
                document.title='IDB数据写入完毕，现有记录 '+ocount2.result+' 条';
            
                var bookname_t='';
                var fname_bookname_list=local_storage_get_b('reader_idb_filename_bookname',-1,true);
                for (let item of fname_bookname_list){
                    if (!item.includes(' /// ')){continue;}
                    var list_t=item.split(' /// ');
                    if (list_t[0]==filename){
                        bookname_t=list_t[1];
                    }
                }
                if (bookname_t==''){
                    bookname_t=filename_2_bookname_b(filename);
                }      
                idbfilename_list_global.push([maxid,filename,bookname_t]);
                refresh_book_list_reader_idb();
                choose_reader_idb(maxid);
            }
        }
    }
    //-----------------------
    var id_set=new Set();
    id_set.add(-1);
    
    var blfound=false;
    for (let item of idbfilename_list_global){
        id_set.add(item[0]);
        if (item[1]==filename){
            blfound=true;
            break;
        }
    }
    
    if (blfound){
        console.log(new Date().toLocaleTimeString(),'书籍已存在');
        document.title='书籍已存在';    
        return Promise.resolve(false);
        //使用了Promise的静态方法resolve。这个方法接收一个参数，并基于该参数创建并返回一个新的Promise实例。当传入的是原始值（如false）、另一个Promise实例或具有.then方法的对象时，它会立即返回一个已解决状态（resolved）的Promise对象，并且其最终结果即为传入的false。
        
        //return new Promise((resolve, reject) => {resolve(false);});
        //直接构造了一个新的Promise实例，并通过传递给Promise构造函数一个executor函数来定义异步操作逻辑。在这个executor函数中，调用了resolve(false)来显式地将Promise的状态设置为已解决，并将结果设为false。尽管这里的executor函数是同步执行的，但这种写法通常用来处理异步操作，比如网络请求或者定时器等。
        //在当前语境下，两者效果相同，都是为了生成一个已完成并且结果为false的Promise对象。然而，在更复杂的场景下，Promise.resolve更适合用于快速包装已存在的同步结果或Promise，而构造函数则适合构建涉及异步过程的Promise。如果仅是为了返回一个简单的预定义值，那么Promise.resolve是一个更简洁、更推荐的方式。
    } else {
        return idb_write_b(db,'reader_txt_dbf',false,false,sub_write_reader_idb_onsuccess,false);
    }
}

function count_reader_idb(db){
    function sub_count_reader_idb_onsuccess(cscount){
        document.title='IDB现有记录 '+cscount+' 条';
    }
    //-----------------------
    return idb_count_b(db,'reader_txt_dbf',sub_count_reader_idb_onsuccess);
}

function clear_all_reader_idb(db){
    function sub_idb_write_rlater_count1(cscount){
        document.title='IDB 清除前记录数 '+cscount+' 条';    
    }

    function sub_idb_write_rlater_count2(cscount){
        document.title='IDB数据清除完毕，现有记录 '+cscount+' 条';
    }
    //-----------------------
    var rndstr = randstr_b(4, true, false);    
    if ((prompt('输入 ' + rndstr + ' 确认清空全部书籍') || '').trim() === rndstr){
        return idb_write_b(db,'reader_txt_dbf',sub_idb_write_rlater_count1,sub_idb_write_rlater_count2,false);
    } else {
        return new Promise((resolve, reject) => {reject(new Error('User did not confirm data clearing.'));});    
    }   
}

function center_reader_idb(cstype='',filename='',bookid=-1,cslist=[]){
    async function sub_center_reader_idb_switch(cstype, db, resolve, reject, filename,bookid,cslist){
        var sub_operation;    
        switch (cstype){
            case 'list':
                sub_operation=filename_list_reader_idb(db);
                break;
            case 'read':
                sub_operation=one_book_reader_idb(db,bookid);
                break;                    
            case 'write':
                sub_operation=write_reader_idb(db,filename,cslist);
                break;
            case 'delete':
                sub_operation=delete_reader_idb(db,bookid);
                break;                                        
            case 'clear_all':
                sub_operation=clear_all_reader_idb(db);
                break;
            case 'count':
                sub_operation=count_reader_idb(db);
                break;
            default:
                console.error('Invalid operation type:', cstype);
                idb_close_b(db);
                reject(new Error(`Unsupported operation: ${cstype}`));
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
    return idb_main_b(cstype,'reader_txt_dbc','reader_txt_dbf',sub_center_reader_idb_switch,filename,bookid,cslist);
    //center_reader_idb('count').then(value => {console.log('行数：',value);}); //此行保留 - 保留注释    
}
