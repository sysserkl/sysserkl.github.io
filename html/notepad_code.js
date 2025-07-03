function init_notepad(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    input_with_x_b('input_search',11);
    recent_notepad();

    var postpath=postpath_b();
    document.getElementById('form_notepad').setAttribute('action',postpath+'temp_txt_share.php');
    
    var buttons=textarea_buttons_b('textarea_content_notepad','清空,复制,导入 txt 文件,发送到临时记事本,发送地址,save as txt file,↑,↓');
    document.getElementById('p_edit_buttons_notepad').insertAdjacentHTML('afterbegin',buttons);
    
    character_2_icon_b('N');    
    mouseover_mouseout_oblong_span_b(document.getElementById('p_search_buttons_notepad').querySelectorAll('span.oblong_box'));      
    close_window_alert_b();
}

function new_notepad(){
    current_id_notepad_global=false;
    show_hide_notepad(true);
    
    if (klmenu_check_b('span_new_empty_notepad',false)){
        document.getElementById('textarea_content_notepad').value='';
    }
}

function menu_notepad(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_reg_notepad" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',    
    '<span id="span_new_empty_notepad" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 新建时自动清空</span>',    
    '<span id="span_edit_show_wiki_notepad" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 添加或修改时自动展示wiki效果</span>',    

    '<span class="span_menu" onclick="'+str_t+'idb_notepad(\'read\',false,false,\'form\');">导入导出</span>',
    '<span class="span_menu" onclick="'+str_t+'idb_notepad(\'clear\');">清空数据库</span>',
    ];
        
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'notepad\');">更新版本</span>',
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    ]);

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🗐','19rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_notepad',true);
    klmenu_check_b('span_new_empty_notepad',true);
    klmenu_check_b('span_edit_show_wiki_notepad',true);

    //-----------------------
    var klmenu_sort=sort_menu_klr_b('textarea_content_notepad',str_t);
    var klmenu_blank=blank_rows_add_remove_klr_b('menu','textarea_content_notepad',str_t);
    
    var buttons=edit_buttons_b('edit_tools_click_notepad','notepad','oblong_box');
    buttons=buttons+' 替换 <input type="text" id="input_rep1_notepad" /> <span class="span_box" onclick="find_in_textarea_notepad(1);" title="从编辑框指定位置开始查找字符串">📍</span> 为 <input type="text" id="input_rep2_notepad" /> <span class="span_box" onclick="find_in_textarea_notepad(2);" title="从编辑框指定位置开始查找字符串">📍</span> <span class="oblong_box" onclick="replace_str_notepad();">执行</span>';
    var dom_show_hide='<span class="oblong_box" onclick="wiki_style_notepad();">wiki</span> <span class="oblong_box" onclick="diff_notepad();">diff</span> <span class="oblong_box" onclick="popup_show_hide_b(\'span_edit_buttons_notepad\',\'\');">🖊</span> ';
    var op=document.getElementById('p_menu_notepad');
    op.insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu_sort,'↕','10rem','1rem','1rem','30rem')+klmenu_b(klmenu_blank,'','15rem','1rem','1rem','30rem'),'','0rem')+' '+dom_show_hide+'<span id="span_edit_buttons_notepad" style="display:none;">'+buttons+'</span>');
    
    var input_list=[
    ['input_rep1_notepad',10,0.9],
    ['input_rep2_notepad',10,0.9],
    ];
    input_size_b(input_list,'id');    
    mouseover_mouseout_oblong_span_b(op.querySelectorAll('span.oblong_box'));
}

function find_in_textarea_notepad(csno){
    var blstr=document.getElementById('input_rep'+csno+'_notepad').value;
    //var otextarea=document.getElementById('textarea_content_notepad'); //此行保留 - 保留注释
    //var startPos = otextarea.selectionStart; //此行保留 - 保留注释
    textarea_top_bottom_b('textarea_content_notepad',blstr,-1);
}

function replace_str_notepad(){
    var blstr1=document.getElementById('input_rep1_notepad').value;
    if (blstr1==''){return;}
    var blstr2=document.getElementById('input_rep2_notepad').value;
    replace_strs_klr_b(blstr1,blstr2,'textarea_content_notepad');
}

function diff_notepad(){
    var result_t1=current_id_content_get_notepad().split('\n');
    var result_t2=document.getElementById('textarea_content_notepad').value.split('\n');

    var diff_str=two_list_diff_b(result_t1,result_t2,false,false,'','','旧版','新版')[1];

    var buttons='<p>'+close_button_b('div_status','')+'</p>';

    var odiv=document.getElementById('div_status');
    odiv.innerHTML=diff_str+buttons;
    odiv.scrollIntoView();
    key_location_diff_b([[2,'textarea_content_notepad']]); 
}

function wiki_style_notepad(){
    var odiv=document.getElementById('div_status');
    var blstr=document.getElementById('textarea_content_notepad').value.replace(/\n/g,'\n<p>'); //不能使用<br /> - 保留注释
    var buttons=close_button_b('div_status','');
    buttons=buttons+'<span class="aclick" onclick="wiki_copy_text_notepad();">copy text</span>';
    odiv.innerHTML='<div id="div_sub_wiki_text_notepad">'+wiki_all_format_b(blstr)+'</div><p>'+buttons+'</p>';
    odiv.scrollIntoView();
}

function wiki_copy_text_notepad(){
    var odiv=document.getElementById('div_sub_wiki_text_notepad');
    if (odiv){
        copy_2_clipboard_b(odiv.innerText);
    } else {
        alert('未发现 id: div_sub_wiki_text_notepad');
    }
}

function edit_tools_click_notepad(obutton){
    var otextarea=document.getElementById('textarea_content_notepad');
    if (!otextarea){
        console.log('not find id: textarea_content_notepad');
        return;
    }
    
    var blstr=obutton.innerHTML;
    var every_line=(blstr=='*' || blstr=='#');
    var list_t=blstr.replace(/&lt;/g,'<').replace(/&gt;/g,'>').split('+');
    list_t.push('');
    if (every_line){
        list_t[0]=list_t[0]+' ';
    }
    dom_insert_str_b(otextarea,list_t[0],list_t[1],false,every_line);
}

function recent_notepad(csstr=''){
    recent_search_b('recent_search_notepad',csstr,'search_notepad','div_recent_search',[],25,false); //此行保留 - 保留注释
}

function search_notepad(cskey=false){
    idb_notepad('read',cskey);
}

function append_or_edit_notepad(ospan){
    if (!confirm('是否'+ospan.innerText+'？')){return;}
    if (klmenu_check_b('span_edit_show_wiki_notepad',false)){
        wiki_style_notepad();
    }
    idb_notepad('edit');
}

function page_notepad(csno){
    var cslen=current_result_notepad_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_notepad_global,csno,'page_notepad','locate_notepad',false,1,10);  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_notepad_global,cslen);
    var blno=0;

    for (let blxl=csno-1;blxl<blend;blxl++){
        var item=current_result_notepad_global[blxl][0];
        result_t.push('<li id="li_notepad_'+item[0]+'" onclick="change_notepad(this);">'+specialstr92_b(item[1].substring(0,100))+' <span style="font-size:0.8rem;color:'+scheme_global['memo']+';">('+item[2]+')</span></li>');
    }
    
    var odiv=document.getElementById('divhtml');

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
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

function wikiuploads_count_notepad(){
    var otextarea=document.getElementById('textarea_export_notepad');
    if (!otextarea){return;}
    var blstr=otextarea.value;
    var attach_list=blstr.match(/^.*{{wikiuploads}}.*$/mg) || [];
    attach_list.sort();
    var ext_dict={};
    for (let item of attach_list){
        let blext=file_path_name_b(item)[2];
        if (ext_dict['e_'+blext]==undefined){
            ext_dict['e_'+blext]=0;
        }
        ext_dict['e_'+blext]=ext_dict['e_'+blext]+1;
    }
    
    ext_dict=object2array_b(ext_dict,true,2);
    ext_dict.sort();
    
    var title_list=blstr.match(/^=== \[.*\] ===/mg) || [];
    var without_date=[];
    for (let one_title of title_list){
        if (one_title.match(/^=== \[http[^\s]+ \d{8} \| .*\] ===/)){continue;}
        without_date.push(one_title);
    }
    return '<h4>附件列表('+attach_list.length+')</h4>'+array_2_li_b(attach_list)+'<h4>扩展名统计('+ext_dict.length+')</h4>'+array_2_li_b(ext_dict)+'<h4>无日期标题('+without_date.length+')</h4>'+array_2_li_b(without_date);
}

function textarea_info_count_notepad(ospan=false,otextarea=false){
    if (otextarea===false){
        otextarea=document.getElementById('textarea_content_notepad');
    }
    var blstr=otextarea.value;
    
    if (ospan===false){
        ospan=document.getElementById('span_textarea_info_notepad');
    }
    ospan.innerHTML='行数：'+blstr.split('\n').length+'；字数：'+blstr.length;
}

function current_id_content_get_notepad(){
    var blstr=false;
    if (current_id_notepad_global!==false){
        for (let item of raw_data_notepad_global){
            if (item[0]==current_id_notepad_global){
                blstr=item[1];
                break;
            }
        }
    }
    return blstr;
}

function show_hide_notepad(is_edit=true){
    var otextarea=document.getElementById('textarea_content_notepad');
    if (is_edit){
        if (current_id_notepad_global!==false){
            var blstr=current_id_content_get_notepad();
            if (blstr!==false){
                otextarea.value=blstr;
                textarea_info_count_notepad(false,otextarea);                
            }
            document.getElementById('span_append_or_edit_notepad').innerText='修改';
            document.getElementById('span_delete_notepad').style.display='';
        } else {
            document.getElementById('span_append_or_edit_notepad').innerText='添加';
            document.getElementById('span_delete_notepad').style.display='none';
        }
    }
    
    var bldisplay=(is_edit?'':'none');
    otextarea.style.display=bldisplay;
    document.getElementById('p_edit_buttons_notepad').style.display=bldisplay;
    document.getElementById('p_menu_notepad').style.display=bldisplay;
    
    document.getElementById('divhtml').style.display=(is_edit?'none':'');
}

function delete_notepad(){
    if (current_id_notepad_global===false){return;}
    
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认删除该记录') || '').trim()!==rndstr){return;}    
    
    idb_notepad('edit',false,true);
}

function export_form_notepad(){
    var result_t=[];
    for (let arow of current_result_notepad_global){
        result_t.push(arow[0][1]+'\n'+arow[0][2]);
    }

    var odiv=document.getElementById('div_status');
    
    var left_str='<p><b>当前数据项：'+result_t.length+'个</b> '+close_button_b('div_status','');
    left_str=left_str+'<span class="aclick" onclick="idb_notepad(\'import\');">import to database</span>';
    var right_str='</p>';
    
    var blstr=textarea_with_form_generate_b('textarea_export_notepad','height:20rem;',left_str,'清空,复制,导入 txt 文件,发送到临时记事本,发送地址,save as txt file',right_str);
    odiv.innerHTML=blstr;

    odiv.querySelector('textarea').value=result_t.join('\n=== notepad ===\n');  //textarea.value 和 '<textarea>'+value+'</textarea>' //效果不同，后者会转换 &amp; 为 & - 保留注释
    odiv.insertAdjacentHTML('beforeend',wikiuploads_count_notepad());
    odiv.scrollIntoView();
}

function idb_import_notepad(db){
    function sub_idb_import_notepad_check(){
        var otextarea=document.getElementById('textarea_export_notepad');
        if (!otextarea){return false;}
        var blstr=otextarea.value;
        if (blstr==''){return false;}
        
        var repeated_count=0;
        var big_found=false;
        var list_t=blstr.split('\n=== notepad ===\n');
        
        for (let item of list_t){
            var repeated_found=false;
            for (let arow of current_result_notepad_global){
                if (item==arow[0][1]+'\n'+arow[0][2]){
                    repeated_count=repeated_count+1;
                    repeated_found=true;
                    break;
                }
            }
            if (repeated_found==false){
                if (item.length>100*1024*1024){
                    alert('尺寸太大：'+item.substring(1,200)+'...');
                    big_found=true;
                    break;
                } else {
                    import_list.push(item);
                }
            }
            if (big_found){break;}
        }
        if (big_found){return false;}
        
        alert('发现已存在项目 '+repeated_count+' 个，可导入项目 '+import_list.length+' 个');
        if (import_list.length==0){return false;}
        return confirm('是否执行导入操作？');
    }

    async function sub_idb_import_notepad_batch(otable){
        if (sub_idb_import_notepad_check()==false){return;}
        
        for (let blxl=0,lent=import_list.length;blxl<lent;blxl++){
            var list_t=import_list[blxl].split('\n');
            var bldate=list_t.slice(-1)[0];
            if (bldate.match(/^\d+\/\d+\/\d+\s(上午|下午)\d+:\d+:\d+$/)){
                if (bldate.includes('上午')){
                    bldate=bldate.replace('上午','')+' AM';
                } else if (bldate.includes('下午')){
                    bldate=bldate.replace('下午','')+' PM';                
                }
            }

            if (validdate_b(bldate)===false){
                bldate=new Date().toLocaleString();
            } else {
                list_t=list_t.slice(0,-1);
            }
            
            try {
                const objectStoreRequest = otable.add({
                'id': current_id_notepad_global,
                'content': list_t.join('\n'),
                'date': bldate
                });

                await new Promise((resolve, reject) => {
                    objectStoreRequest.onsuccess = () => {
                        console.log(blxl, 'objectStoreRequest success');
                        resolve();
                    };
                    objectStoreRequest.onerror = (event) => {
                        console.log(blxl, 'objectStoreRequest error');
                        reject(event.target.error);
                    };
                });

                if (blxl === import_list.length - 1){
                    alert('导入完成');
                }
            } catch (error){
                console.error('Error importing item at index:', blxl, error);
            } finally {
                current_id_notepad_global = current_id_notepad_global + 1;
            }
        }
    }

    function sub_idb_import_notepad_onsuccess(otable){            
        otable.openCursor().onsuccess = function (event){
            var cursor = event.target.result;
            if (cursor){
                raw_data_notepad_global.push([cursor.value.id,cursor.value.content,cursor.value.date]);
                old_id_set.add(cursor.value.id);
                cursor.continue();
            } else {
                current_id_notepad_global=Math.max(-1,Math.max(...old_id_set))+1;
                sub_idb_import_notepad_batch(otable);
            }
        };
    }
    //-----------------------
    raw_data_notepad_global=[];
    var old_id_set=new Set();
    var import_list=[];
    return idb_write_b(db,'notepad_dbf',false,false,sub_idb_import_notepad_onsuccess,false);
}

function idb_edit_notepad(db,is_delete=false){
    async function sub_idb_edit_notepad_append(otable){
        try {
            var objectStoreRequest = otable.add({
            'id': current_id_notepad_global, 
            'content': blcontent, 
            'date': new Date().toLocaleString()
            });

            await new Promise((resolve, reject) => {
                objectStoreRequest.onsuccess = () => {
                    console.log('objectStoreRequest success');
                    resolve();
                };
                objectStoreRequest.onerror = (event) => {
                    console.log('objectStoreRequest error');
                    reject(event.target.error);
                };
            });
            search_notepad();  
        } catch (error){
            console.error('Error appending to notepad:', error);
            throw error;
        }        
    }

    async function sub_idb_edit_notepad_onsuccess(otable){
        otable.openCursor().onsuccess = function (event){
            var cursor = event.target.result;
            if (current_id_notepad_global === false){
                if (cursor){
                    old_id_set.add(cursor.value.id);
                    cursor.continue();
                } else {
                    current_id_notepad_global = Math.max(-1, Math.max(...old_id_set)) + 1;
                    sub_idb_edit_notepad_append(otable);
                }
            } else {
                if (cursor){
                    if (cursor.value.id === current_id_notepad_global){
                        if (is_delete){
                            const deleteRequest = cursor.delete();
                            new Promise((resolve, reject) => {
                                deleteRequest.onsuccess = () => {
                                    console.log('deleted');
                                    resolve();
                                };
                                deleteRequest.onerror = (event) => {
                                    console.log('delete error:', event.target.error);
                                    reject(event.target.error);
                                };
                            });
                        } else {
                            const updateData = cursor.value;
                            updateData.content = blcontent;
                            updateData.date = new Date().toLocaleString();
                            const updateRequest = cursor.update(updateData);

                            new Promise((resolve, reject) => {
                                updateRequest.onsuccess = () => {
                                    console.log('updated');
                                    search_notepad();
                                    resolve();
                                };
                                updateRequest.onerror = (event) => {
                                    console.log('update error:', event.target.error);
                                    reject(event.target.error);
                                };
                            });
                            //search_notepad();
                        }
                    } else {
                        cursor.continue();
                    }
                }
            }
        }
    }
    //-----------------------
    var blcontent=document.getElementById('textarea_content_notepad').value;
    var old_id_set=new Set();
    
    var do_write=false;
    if (is_delete){
        if (current_id_notepad_global !== false){
            do_write=true;
        }
    } else {
        if (blcontent.length > 100 * 1024 * 1024){
            alert('尺寸太大');
        } else {
            do_write=true;
        }
    }
    
    if (do_write){
        return idb_write_b(db, 'notepad_dbf', false, false, sub_idb_edit_notepad_onsuccess, false);        
    } else {
        return Promise.resolve(false);
    }
}

function idb_read_notepad(db,cskey=false,do_type=''){
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
        current_result_notepad_global.reverse();
        //current_result_notepad_global 每个元素为：[idno,content,datetime] - 保留注释
        
        result_percent_b('span_count',current_result_notepad_global.length,raw_data_notepad_global.length);
        page_notepad(1);
        switch (do_type){
            case 'form':
                export_form_notepad();
                break;
        }
    }
    
    function sub_idb_read_notepad_onsuccess(resolve, reject, event, other_var1,other_var2){
        var cursor = event.target.result;
        if (cursor){
            raw_data_notepad_global.push([cursor.value.id,cursor.value.content,cursor.value.date]);
            cursor.continue();
        } else {
            sub_idb_read_notepad_search();
        }
    }
    //-----------------------
    raw_data_notepad_global=[];
    return idb_read_b(db,'notepad_dbf',sub_idb_read_notepad_onsuccess);
}

function idb_count_notepad(db){
    function sub_idb_count_notepad_onsuccess(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB现有记录 '+cscount+' 条';
    }
    //-----------------------
    return idb_count_b(db,'notepad_dbf',sub_idb_count_notepad_onsuccess);
}

function idb_clear_notepad(db){
    function sub_idb_clear_notepad_count1(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB 清除前记录数：'+cscount;
    }

    function sub_idb_clear_notepad_count2(cscount){
        //document.getElementById('span_idb_status').innerHTML='IDB数据清除完毕，现有记录 '+cscount+' 条';
    }
    
    function sub_idb_clear_notepad_onsuccess(otable){ /* ... */ }
    //-----------------------
    var rndstr = randstr_b(4, true, false);    
    if ((prompt('输入 ' + rndstr + ' 确认清除全部数据') || '').trim() === rndstr){
        return idb_write_b(db, 'notepad_dbf', sub_idb_clear_notepad_count1, sub_idb_clear_notepad_count2, sub_idb_clear_notepad_onsuccess);
    } else {
        return new Promise((resolve, reject) => {reject(new Error('User did not confirm data clearing.'));});    
    } 
}

function idb_notepad(cstype='',cskey=false,is_delete=false,do_type=''){
    async function sub_idb_notepad_switch(cstype, db, resolve, reject){
        var sub_operation;    
        switch (cstype){
            case 'read':
                sub_operation=idb_read_notepad(db,cskey,do_type);
                break;
            case 'edit':
                sub_operation=idb_edit_notepad(db,is_delete);
                break;
            case 'clear':
                sub_operation=idb_clear_notepad(db);
                break;
            case 'count':
                sub_operation=idb_count_notepad(db);
                break;
            case 'import':
                sub_operation=idb_import_notepad(db);
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
    return idb_main_b(cstype,'notepad_dbc','notepad_dbf',sub_idb_notepad_switch);
    //idb_notepad('count').then(value => {console.log('行数：',value);}); //此行保留 - 保留注释    
}
