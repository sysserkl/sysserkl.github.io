function idb_table_success_error_b(otable,dbf_name){
    otable.onsuccess = function (event){
        console.log('dbf 打开成功:',dbf_name);
    };
    otable.onerror = function (event){
        console.log('dbf 打开失败:',dbf_name);
    }
}

function idb_read_b(odb,dbf_name,fn_onsuccess=false,other_var1=false,other_var2=false){
    return new Promise((resolve, reject) => {
        var transaction = odb.transaction([dbf_name], 'readonly');
        
        transaction.oncomplete = function(event){
            console.log('transaction ok');
            resolve(true);
        };
            
        //以下几行不起作用
        transaction.onerror = function(event){
            console.log('transaction error:',dbf_name);
        };

        var otable = transaction.objectStore(dbf_name);
        idb_table_success_error_b(otable,dbf_name);
        //以上几行不起作用
        
        otable.openCursor().onsuccess = function (event){fn_onsuccess(event,other_var1,other_var2);};
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
            reject(err);
        };

        var otable = transaction.objectStore(dbf_name);
        idb_table_success_error_b(otable,dbf_name);

        var ocount=otable.count();
        ocount.onsuccess = function(){
            blcount=ocount.result;
            if (fn_onsuccess!==false){
                fn_onsuccess(blcount);
            }
        }
        ocount.onerror = function(){
            reject(err);
        }
    });
}

function idb_write_b(odb,dbf_name,fn_count1,fn_count2,fn_onsuccess=false,do_clear=true){
    return new Promise((resolve, reject) => {
        var transaction = odb.transaction([dbf_name], 'readwrite');
        
        transaction.oncomplete = function(event){
            console.log('transaction ok');
            resolve(true);
        };
        
        transaction.onerror = function(event){
            console.log('transaction error');
        };

        var otable = transaction.objectStore(dbf_name);
        idb_table_success_error_b(otable,dbf_name);

        if (do_clear){
            var ocount1=otable.count();
            ocount1.onsuccess = function(){
                if (fn_count1!==false){
                    fn_count1(ocount1.result);
                }
                console.log('清除前记录数：',ocount1.result);
            }

            var oclear = otable.clear();
            oclear.onsuccess = function(event){
                console.log('数据清除成功');
            };
            oclear.onerror= function(event){
                console.log('数据清除失败');
            };

            var ocount2=otable.count();
            ocount2.onsuccess = function(){
                if (fn_count2!==false){
                    fn_count2(ocount2.result);
                }
                console.log('清除后记录数：',ocount2.result);
            }
        }
        
        if (fn_onsuccess!==false){
            fn_onsuccess(otable);
        }
    });
}

function idb_main_b(cstype='',dbc_name,dbf_name,switch_fn,other_var1=false,other_var2=false,other_var3=false){
    return new Promise((resolve, reject) => {
        var blcount=0;
        var db;
        var DBOpenRequest = window.indexedDB.open(dbc_name);
        DBOpenRequest.onerror = function (event){
            console.log(dbc_name+' 数据库打开报错');
        };

        DBOpenRequest.onsuccess = function (event){
            db = DBOpenRequest.result;
            console.log(dbc_name+' 数据库打开成功');
            
            if (!db.objectStoreNames.contains(dbf_name)){
                db.createObjectStore(dbf_name, { autoIncrement: true });
                console.log('new table: '+dbf_name);
            }
            switch_fn(cstype, db, resolve, blcount, other_var1,other_var2,other_var3);
            db.close();
        };

        //文心一言：检查数据库中是否存在一个名为 dbf_name 的对象存储（Object Store）。如果该对象存储不存在，那么它会在数据库中创建一个新的对象存储，并命名为 dbf_name 。这个新的对象存储还被设置为自动递增（autoIncrement），这意味着每当你向对象存储添加新数据时，每个新数据的键都会自动递增。 - 保留注释
        DBOpenRequest.onupgradeneeded = function (event){
            var db = event.target.result;
            if (!db.objectStoreNames.contains(dbf_name)){
                db.createObjectStore(dbf_name, { autoIncrement: true });
            }
            console.log('onupgradeneeded');
        }
    });
}
