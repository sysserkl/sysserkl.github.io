function init_reader_idb(){
    mobile_style_kltxt_b();
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.7rem':'1.4rem'));
    center_reader_idb('list');
}

function upload_txt_reader_idb(){
    var ofile=document.getElementById('input_upload_txt').files[0];
    if (ofile.type!=='application/x-javascript' && ofile.type!=='text/plain'){
        alert('非txt文件：'+ofile.type+'\n'+ofile.name);  
        return;
    }
    if (ofile.size>50*1024*1024){
        alert('文件太大：'+ofile.name+' '+ofile.size);  
        return;
    }
        
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
        generate_list_reader_idb(ofile.name,filelist);
        document.getElementById('span_filename').innerHTML=ofile.name;
        document.getElementById('span_filelength').innerHTML='('+filelist.length+')';
    }
}

function generate_list_reader_idb(bookname,cslist){
    filelist=cslist;
    center_reader_idb('write',bookname,-1,filelist);
}

function refresh_book_list_reader_idb(){
    var result_t=[];
    for (let item of idbbookname_list_global){
        result_t.push('<span class="oblong_box" onclick="javascript:center_reader_idb(\'read\',\'\','+item[0]+');">'+item[1]+'</span>');
    }
    
    var odiv=document.getElementById('span_idbbooklist');
    odiv.innerHTML=result_t.join(' ');
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function bookname_list_reader_idb(db){
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
        
        idbbookname_list_global=[];
        otable.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.content.substring(0,11)=='//bookname:'){
                    idbbookname_list_global.push([cursor.value.id,cursor.value.content.substring(11,)]);
                }
                cursor.continue();
            }
            else {     
                refresh_book_list_reader_idb();
                resolve(true);
            }
        };
    });
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
    
        filelist=[];
        otable.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.id==bookid){
                    filelist.push(cursor.value.content);
                }
                cursor.continue();
            }
            else {        
                getlines_kltxt_b();
                resolve(true);
            }
        };
    });
}

function write_reader_idb(db,bookname,cslist){
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
            for (let item of idbbookname_list_global){
                id_set.add(item[0]);
                if (item[1]==bookname){
                    blfound=true;
                    break;
                }
            }
            
            if (blfound===false){
                var maxid=Math.max(...id_set)+1;    //会自动将字符型数字转化为数值型 - 保留注释
                otable.add({'id':maxid,'content':'//bookname:'+bookname});
                for (let item of cslist){
                    otable.add({'id':maxid,'content':item});
                }
                
                var ocount3=otable.count();
                ocount3.onsuccess = function() {
                    console.log(new Date().toLocaleTimeString(),'添加后记录数：',ocount3.result);
                    document.title='IDB数据写入完毕，现有记录 '+ocount3.result+' 条';
                }
                idbbookname_list_global.push([maxid,bookname]);
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

function clear_reader_idb(db){
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

function center_reader_idb(cstype='',bookname='',bookid=-1,cslist=[]){
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
                        await bookname_list_reader_idb(db);
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
                        await write_reader_idb(db,bookname,cslist);
                        resolve(true);
                    }
                    center_reader_idb_write();
                    break;
                case 'clear':
                    async function center_reader_idb_clear() {
                        console.log('center_reader_idb_clear()');
                        await clear_reader_idb(db);
                        resolve(true);
                    }
                    center_reader_idb_clear();
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
