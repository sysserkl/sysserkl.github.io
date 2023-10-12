function init_notepad(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),false,false,2);
    input_with_x_b('input_search',11);
    recent_notepad();
    character_2_icon_b('N');    
}

function menu_notepad(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_reg_notepad" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',    
    '<span class="span_menu" onclick="'+str_t+'current_id_notepad_global=false;show_hide_notepad(true);">新建</span>',
    ];
        
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'notepad\');}">更新版本</span>',        
    ]);

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🗐','14rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_notepad',true);
}

function recent_notepad(csstr=''){
    recent_search_b('recent_search_notepad',csstr,'search_notepad','div_recent_search',[],25,false); //此行保留 - 保留注释
}

function search_notepad(cskey=false){
    idb_notepad('read',cskey);
}

function page_notepad(csno){
    var cslen=current_result_notepad_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_notepad_global,csno,'page_notepad','locate_notepad',false,1,10);  
    //-------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_notepad_global,cslen);
    var blno=0;

    for (let blxl=csno-1;blxl<blend;blxl++){
        var item=current_result_notepad_global[blxl][0];
        result_t.push('<li id="li_notepad_'+item[0]+'" onclick="change_notepad(this);">'+specialstr92_b(item[1].substring(0,100))+' <span style="font-size:0.8rem;color:'+scheme_global['memo']+';">('+item[2]+')</span>');
    }
    
    var odiv=document.getElementById('divhtml');

    if (result_t.length==0){
        odiv.innerHTML='';
    }
    else {
        odiv.innerHTML=bljg+'<ol>'+result_t.join('\n')+'</ol>\n'+bljg;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));        
    }
}

function change_notepad(oli){
    current_id_notepad_global=parseInt(oli.getAttribute('id').split('li_notepad_')[1]);
    show_hide_notepad(true);
}

function locate_notepad(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_notepad((blno-1)*rows_per_page_notepad_global+1,rows_per_page_notepad_global);
    }
}

function show_hide_notepad(is_edit=true){
    var otextarea=document.getElementById('textarea_content_notepad');
    if (is_edit){
        if (current_id_notepad_global!==false){
            for (let item of raw_data_notepad_global){
                if (item[0]==current_id_notepad_global){
                    otextarea.value=item[1];
                    break;
                }
            }
            document.getElementById('span_append_or_edit_notepad').innerText='修改';
            document.getElementById('span_delete_notepad').style.display='';
        }
        else {
            document.getElementById('span_append_or_edit_notepad').innerText='添加';
            document.getElementById('span_delete_notepad').style.display='none';
        }
    }
    otextarea.style.display=(is_edit?'':'none');
    document.getElementById('p_buttons_notepad').style.display=(is_edit?'':'none');
    document.getElementById('divhtml').style.display=(is_edit?'none':'');
}

function delete_notepad(){
    if (current_id_notepad_global===false){return;}
    
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认删除该记录') || '').trim()!==rndstr){return;}    
    
    idb_notepad('edit',false,true);
}
function idb_edit_notepad(db,is_delete=false){
    function sub_idb_edit_notepad_append(otable){
        var objectStoreRequest = otable.add({'id':current_id_notepad_global,'content':blcontent,'date':new Date().toLocaleString()});
        
        objectStoreRequest.onsuccess = function(event){
            console.log('objectStoreRequest success');
            search_notepad();
        };
        objectStoreRequest.onerror = function(event){
            console.log('objectStoreRequest error');        
        };
    }

    function sub_idb_edit_notepad_onsuccess(otable){
        if (current_id_notepad_global===false){
            otable.openCursor().onsuccess = function (event){
                var cursor = event.target.result;
                if (cursor){
                    old_id_set.add(cursor.value.id);
                    cursor.continue();
                }
                else {
                    current_id_notepad_global=Math.max(-1,Math.max(...old_id_set))+1;
                    sub_idb_edit_notepad_append(otable);
                }
            };
        }
        else {        
            otable.openCursor().onsuccess = function (event){
                var cursor = event.target.result;
                if (cursor){
                    if (cursor.value.id==current_id_notepad_global){
                        if (is_delete){
                            var request=cursor.delete();
                        }
                        else {
                            var updateData = cursor.value;
                            updateData.content = blcontent;
                            updateData.date=new Date().toLocaleString();
                            var request = cursor.update(updateData);                            
                        }
                        request.onsuccess = () => {
                            console.log('updated');
                            search_notepad();
                        };
                        request.onerror = () => {
                            console.log('error');
                        };                    
                    }
                    else {
                        cursor.continue();
                    }
                }
            };
        }
    }
    //---------------
    var blcontent=document.getElementById('textarea_content_notepad').value;
    var old_id_set=new Set();
    return new Promise((resolve, reject) => {
        if (is_delete){
            if (current_id_notepad_global!==false){
                idb_write_b(db,'notepad_dbf',false,false,sub_idb_edit_notepad_onsuccess,false);
            }
        }
        else {
            if (blcontent.length>100*1024*1024){
                alert('尺寸太大');
            }
            else {
                idb_write_b(db,'notepad_dbf',false,false,sub_idb_edit_notepad_onsuccess,false);
            }
        }
        resolve(true);
    });
}

function idb_read_notepad(db,cskey=false){
    function sub_idb_read_notepad_search(){
        show_hide_notepad(false);
        
        var oinput=document.getElementById('input_search');
        if (cskey===false){
            cskey=oinput.value.trim();
        }
        oinput.value=cskey;

        recent_notepad(cskey);
        var isreg=klmenu_check_b('span_reg_notepad',false);
        [cskey,isreg]=str_reg_check_b(cskey,isreg,true);
        
        current_result_notepad_global=[];
        is_all_result_notepad_global=true;

        [current_result_notepad_global,is_all_result_notepad_global]=common_search_b(cskey,isreg,raw_data_notepad_global,-1);
        
        result_percent_b('span_count',current_result_notepad_global.length,raw_data_notepad_global.length);
        
        page_notepad(1);
    }
    
    function sub_idb_read_notepad_onsuccess(event){
        var cursor = event.target.result;
        if (cursor){
            raw_data_notepad_global.push([cursor.value.id,cursor.value.content,cursor.value.date]);
            cursor.continue();
        }
        else {
            sub_idb_read_notepad_search();
        }
    }
    //-----------------------
    raw_data_notepad_global=[];
    return new Promise((resolve, reject) => {
        idb_read_b(db,'notepad_dbf',sub_idb_read_notepad_onsuccess);
        resolve(true);
    });
}

function idb_count_notepad(db){
    function sub_idb_count_notepad_onsuccess(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB现有记录 '+cscount+' 条';
    }

    return new Promise((resolve, reject) => {
        var blcount=idb_count_b(db,'notepad_dbf',sub_idb_count_notepad_onsuccess);
        resolve(blcount);
    });
}

function idb_clear_notepad(db){
    function sub_idb_clear_notepad_count1(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB 清除前记录数：'+cscount;
    }

    function sub_idb_clear_notepad_count2(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB数据清除完毕，现有记录 '+cscount+' 条';
    }
    
    function sub_idb_clear_notepad_onsuccess(otable){
        //
    }
    
    return new Promise((resolve, reject) => {
        idb_write_b(db,'notepad_dbf',sub_idb_clear_notepad_count1,sub_idb_clear_notepad_count2,sub_idb_clear_notepad_onsuccess);
        resolve(true);
    });
}

function idb_notepad(cstype='',cskey=false,is_delete=false){
    async function sub_idb_notepad_switch(cstype, db, resolve, blcount){
        switch (cstype){
            case 'read':
                async function sub_idb_notepad_read(){
                    console.log('sub_idb_notepad_read()');
                    await idb_read_notepad(db,cskey);
                    resolve(true);
                }
                sub_idb_notepad_read();
                break;
            case 'edit':
                async function sub_idb_notepad_edit(){
                    console.log('sub_idb_notepad_edit()');
                    await idb_edit_notepad(db,is_delete);
                    //await idb_read_notepad(db);
                    resolve(true);
                }
                sub_idb_notepad_edit();
                break;
            case 'clear':
                async function sub_idb_notepad_clear(){
                    console.log('sub_idb_notepad_clear()');
                    await idb_clear_notepad(db);
                    resolve(true);
                }
                sub_idb_notepad_clear();
                break;
            case 'count':
                async function sub_idb_notepad_count(){
                    console.log('sub_idb_notepad_count()');
                    blcount=await idb_count_notepad(db);
                    resolve(blcount);
                }
                sub_idb_notepad_count();
                break;
        }
    }
    //-------------------------
    return new Promise((resolve, reject) => {
        var bljg=idb_main_b(cstype,'notepad_dbc','notepad_dbf',sub_idb_notepad_switch);
        resolve(bljg);
    });
    //idb_notepad('count').then(value => {console.log('行数：',value);}); //此行保留 - 保留注释    
}
