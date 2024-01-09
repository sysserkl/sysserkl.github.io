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
            
        transaction.onerror = function(event){
            console.log('transaction error:',dbf_name);
            reject(event.target.error);
        };

        var otable = transaction.objectStore(dbf_name);
        //idb_table_success_error_b(otable,dbf_name);
        
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
        //idb_table_success_error_b(otable,dbf_name);

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

        if (do_clear){
            var ocount1=otable.count();
            ocount1.onsuccess = async function(){
                if (fn_count1!==false){
                    fn_count1(ocount1.result);
                }
                console.log('清除前记录数：',ocount1.result);

                var oclear = otable.clear();

                oclear.onerror= function(event){
                    console.log('数据清除失败');
                    reject(event.target.error);
                };

                oclear.onsuccess = async function(event) {
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

function idb_main_b(cstype='',dbc_name,dbf_name,switch_fn,other_var1=false,other_var2=false,other_var3=false){
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
                    db.createObjectStore(dbf_name, { autoIncrement: true });
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
