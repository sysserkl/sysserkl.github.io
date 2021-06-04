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
    mobile_style_kltxt_b();
    menu_reader_idb();
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.7rem':'1.4rem'));
    center_reader_idb('list');
}

function menu_reader_idb(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'jsdoc_no_change_reader_idb(this);">jsdoc no: 1</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'bookmarks_get_kltxt_b(false,false,\'reader_idb_lastbook\');">读取最新书签</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'bookmarks_set_kltxt_b(\'reader_idb_lastbook\');">添加书签</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'reading_mode_kltxt_b();">进入阅读状态</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'bookname_set_reader_idb();">当前书籍书名修改</span>',
    ];

    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'center_reader_idb(\'clear_all\');">清空所有书籍</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'reader_idb\');}">更新版本</span>',        
    ];

    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','12rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','10rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function jsdoc_no_change_reader_idb(ospan){
    var old_value=ospan.innerText.split(':').slice(-1)[0].trim();
    var blkey=(prompt('输入jsdoc no (1-3)：',old_value) || '').trim();
    if (blkey==''){return;}
    if (isNaN(blkey)){return;}
    blkey=parseInt(blkey);
    if (blkey<1 || blkey>3){return;}
    csbooklist_sub_global_b[csbookno_global_b][3]=blkey.toString();
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
    if (file_check_reader_idb(ofile)==false){return;}
        
    var txtFile = new FileReader();
    txtFile.readAsText(ofile);
    txtFile.onload = function () {
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
                }
                catch (error) {
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
    if (file_check_reader_idb(ofile)==false){return;}
        
    var txtFile = new FileReader();
    txtFile.readAsText(ofile);
    txtFile.onload = function () {
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
                }
                catch (error) {
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
        document.getElementById('span_filename').innerHTML=blfname;
        document.getElementById('span_filelength').innerHTML='('+filelist.length+')';
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
    for (let item of idbfilename_list_global){
        result_t.push('<span class="oblong_box" onclick="javascript:choose_reader_idb('+item[0]+');">'+item[2]+'</span>');
    }
    
    var odiv=document.getElementById('span_idbbooklist');
    odiv.innerHTML=result_t.join(' ');
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function choose_reader_idb(bookid){
    document.getElementById('input_lineno').value=1;
    center_reader_idb('read','',bookid);
}

function filename_list_reader_idb(db){
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(['reader_txt_dbf'], "readonly");
        transaction.onerror = function(event) {
            console.log('transaction error');
        };

        var otable = transaction.objectStore('reader_txt_dbf');
        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }
        
        var fname_bookname_list=local_storage_get_b('reader_idb_filename_bookname',-1,true);
        for (let blxl=0;blxl<fname_bookname_list.length;blxl++){
            fname_bookname_list[blxl]=fname_bookname_list[blxl].split(' /// ');
        }
        idbfilename_list_global=[];
        otable.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.type=='n'){
                    var bookname_t=cursor.value.content;
                    for (let item of fname_bookname_list){
                        if (item[0]==cursor.value.content && item.length>1){
                            bookname_t=item[1];
                            break;
                        }
                    }
                    idbfilename_list_global.push([cursor.value.id,cursor.value.content,bookname_t]);
                }
                cursor.continue();
            }
            else {     
                refresh_book_list_reader_idb();
                var current_idb_book_id=args_reader_idb();
                if (current_idb_book_id>=0){
                    center_reader_idb('read','',current_idb_book_id);
                }
                resolve(true);
            }
        };
    });
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
    
    for (let blxl=0;blxl<idbfilename_list_global.length;blxl++){
        if (idbfilename_list_global[blxl][1]==csbookname_global){
            idbfilename_list_global[blxl][2]=new_bookname;
            break;
        }
    }
    refresh_book_list_reader_idb();
}

function one_book_reader_idb(db,bookid){
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(['reader_txt_dbf'], "readonly");
        transaction.onerror = function(event) {
            console.log('transaction error');
        };

        var otable = transaction.objectStore('reader_txt_dbf');
        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }

        var bookname_t='';
        for (let item of idbfilename_list_global){
            if (item[0]==bookid){
                csbookname_global=item[1];
                bookname_t=item[2];
                break;
            }
        }
        
        filelist=[];
        otable.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.id==bookid && cursor.value.type==''){
                    filelist.push(cursor.value.content);
                }
                cursor.continue();
            }
            else {
                document.getElementById('span_filename').innerHTML=bookname_t;
                document.getElementById('span_filelength').innerHTML='('+filelist.length+')';     
                csbooklist_sub_global_b[csbookno_global_b][0]=csbookname_global;
                csbooklist_sub_global_b[csbookno_global_b][1]='《'+csbookname_global+'》';
                digest_temp_load_kltxt_b();
                getlines_kltxt_b();
                resolve(true);
            }
        };
    });
}

function write_reader_idb(db,filename,cslist){
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(['reader_txt_dbf'], "readwrite");
        transaction.oncomplete = function(event) {
            console.log('transaction ok');
            resolve(true);
        };
        transaction.onerror = function(event) {
            console.log('transaction error');
        };

        var otable = transaction.objectStore('reader_txt_dbf');

        var ocount1=otable.count();
        ocount1.onsuccess = function() {
            console.log('写入前记录数：',ocount1.result);
        }

        otable.openCursor().onsuccess = function (event) {      
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
            
            if (blfound===false){
                var maxid=Math.max(...id_set)+1;    //会自动将字符型数字转化为数值型 - 保留注释
                otable.add({'id':maxid,'content':filename,'type':'n'});   //n: book file name - 保留注释
                for (let item of cslist){
                    otable.add({'id':maxid,'content':item,'type':''});
                }
                
                var ocount3=otable.count();
                ocount3.onsuccess = function() {
                    console.log(new Date().toLocaleTimeString(),'添加后记录数：',ocount3.result);
                    document.title='IDB数据写入完毕，现有记录 '+ocount3.result+' 条';
                }
                
                var bookname_t=filename;
                var fname_bookname_list=local_storage_get_b('reader_idb_filename_bookname',-1,true);
                for (let item of fname_bookname_list){
                    if (!item.includes(' /// ')){continue;}
                    var list_t=item.split(' /// ');
                    if (list_t[0]==filename){
                        bookname_t=list_t[1];
                    }
                }
                idbfilename_list_global.push([maxid,filename,bookname_t]);
                refresh_book_list_reader_idb();
            }
            else {
                console.log(new Date().toLocaleTimeString(),'书籍已存在');
                document.title='书籍已存在';            
            }
            resolve(true);
        };
        
        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }
    });
}

function count_reader_idb(db){
    return new Promise((resolve, reject) => {
        var blcount=0;
        var transaction = db.transaction(['reader_txt_dbf'], "readonly");
        transaction.oncomplete = function(event) {
            console.log('transaction ok',blcount);
        };
        transaction.onerror = function(event) {
            console.log('transaction error');
            reject(err);
        };

        var otable = transaction.objectStore('reader_txt_dbf');

        var ocount=otable.count();
        ocount.onsuccess = function() {
            blcount=ocount.result;
            document.title='IDB现有记录 '+blcount+' 条';
            resolve(blcount);
        }
        ocount.onerror = function() {
            reject(err);
        }

        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }
    });
}

function clear_all_reader_idb(db){
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(['reader_txt_dbf'], "readwrite");
        transaction.oncomplete = function(event) {
            console.log('transaction ok');
            resolve(true);
        };
        transaction.onerror = function(event) {
            console.log('transaction error');
        };

        var otable = transaction.objectStore('reader_txt_dbf');

        var ocount1=otable.count();
        ocount1.onsuccess = function() {
            console.log('清除前记录数：',ocount1.result);
        }

        var oclear = otable.clear();
        oclear.onsuccess = function(event) {
            console.log('数据清除成功');
        };
        oclear.onerror= function(event) {
            console.log('数据清除失败');
        };

        var ocount2=otable.count();
        ocount2.onsuccess = function() {
            console.log('清除后记录数：',ocount2.result);
            document.title='IDB数据清除完毕，现有记录 '+ocount2.result+' 条';
        }
        
        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }
    });
}

function center_reader_idb(cstype='',filename='',bookid=-1,cslist=[]){
    return new Promise((resolve, reject) => {
        var bljg=0;
        var db;
        var DBOpenRequest = window.indexedDB.open('reader_txt_dbc');
        DBOpenRequest.onerror = function (event) {
            console.log('reader_txt_dbc 数据库打开报错');
        };

        DBOpenRequest.onsuccess = function (event) {
            db = DBOpenRequest.result;
            console.log('reader_txt_dbc 数据库打开成功');
            
            if (!db.objectStoreNames.contains('reader_txt_dbf')) {
                db.createObjectStore('reader_txt_dbf', { autoIncrement: true });
                console.log('new table: reader_txt_dbf');
            }
            switch (cstype){
                case 'list':
                    async function center_reader_idb_list() {
                        console.log('center_reader_idb_list()');
                        await filename_list_reader_idb(db);
                        resolve(true);
                    }
                    center_reader_idb_list();
                    break;
                case 'read':
                    async function center_reader_idb_read() {
                        console.log('center_reader_idb_read()');
                        await one_book_reader_idb(db,bookid);
                        resolve(true);
                    }
                    center_reader_idb_read();
                    break;                    
                case 'write':
                    async function center_reader_idb_write() {
                        console.log('center_reader_idb_write()');
                        await write_reader_idb(db,filename,cslist);
                        resolve(true);
                    }
                    center_reader_idb_write();
                    break;
                case 'clear_all':
                    var rndstr=randstr_b(4,true,false);
                    if ((prompt('输入 '+rndstr+' 确认清空全部书籍') || '').trim()!==rndstr){break;}
                    
                    async function center_reader_idb_clear_all() {
                        console.log('center_reader_idb_clear_all()');
                        await clear_all_reader_idb(db);
                        resolve(true);
                    }
                    center_reader_idb_clear_all();
                    break;
                case 'count':
                    async function center_reader_idb_count() {
                        console.log('center_reader_idb_count()');
                        bljg = await count_reader_idb(db);
                        resolve(bljg);
                    }
                    center_reader_idb_count();
                    break;
            }
            db.close();
        };

        DBOpenRequest.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains('reader_txt_dbf')) {
                db.createObjectStore('reader_txt_dbf', { autoIncrement: true });
            }
            console.log('onupgradeneeded');
        }
    });
}
