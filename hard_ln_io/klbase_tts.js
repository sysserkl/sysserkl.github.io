function add_button_temp_txt_share_b(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length==0){return;}
    
    for (let item of cskeys){
        if (item.substring(0,5)=='type='){
            var bltype=item.substring(5,);
            if (bltype in temp_txt_share_type_dict_global){
                var blstr=' <span class="aclick" onclick="update_temp_txt_share_b(\''+bltype+'\');">更新'+temp_txt_share_type_dict_global[bltype][0]+'</span>';
                document.getElementById('span_update').insertAdjacentHTML('afterend',blstr);
            }
            break;
        }
    }
}

function textarea_diff_txt_share_b(id1,id2){
    var diff_str=two_list_diff_b(false,false,id1,id2,'','','旧版','新版')[1];

    var buttons='<p>'+close_button_b('div_status','')+'</p>';

    var odiv=document.getElementById('div_status');
    odiv.innerHTML=diff_str+buttons;
    odiv.scrollIntoView();
}

function update_temp_txt_share_b(csid,textarea_id='textarea_temp_txt_share'){
    var otextarea=document.getElementById(textarea_id);
    if (!otextarea){return false;}
    
    var cscaption=temp_txt_share_type_dict_global[csid][0];
    var blfound=false;
    if (temp_txt_share_type_dict_global[csid].length>=2){
        var blkey=temp_txt_share_type_dict_global[csid][1];
        var is_reg=false;
        [blkey,is_reg]=str_reg_check_b(blkey,is_reg);
        blfound=str_reg_search_b(otextarea.value.trim(),blkey,is_reg);
    }
    
    if (blfound){
        if (confirm('是否更新 '+cscaption+'？')===false){return false;}
    } else {
        var rndstr=randstr_b(4,true,false);
        if ((prompt('输入 '+rndstr+' 确认更新 '+cscaption) || '').trim()!==rndstr){return false;}
    }
    
    switch (csid){
        case 'fav_lines_bible':
        case 'enwords_temp':
            var list_t=otextarea.value.trim().split('\n');
            list_t=array_unique_b(list_t);
            localStorage.setItem(csid,list_t.join('\n'));
            break;
        default:
            localStorage.setItem(csid,otextarea.value.trim());
            break;
    }
    return true;
}

function temp_save_temp_txt_share_b(cstype=''){
    var old_len=temp_save_table_b(cstype,'temp_txt_share_save','textarea_temp_txt_share','div_temp_save',200,'',false);
    if (cstype=='write' && old_len===false){
        alert('超出最大数目，未添加');
    }
}

function var_generate_temp_txt_share_b(){
    temp_txt_share_type_dict_global={   //全局变量 - 保留注释
    //id: caption,搜索验证关键词 - 保留注释
    'done_routines': ['routines完成项','\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\s[a-z]{3},(:r)'],
    'done_todolist': ['todolist完成项','\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}\\s[a-z]{3},(:r)'],
    'enwords_queue': ['暂存单词'],
    'enwords_temp': ['最近记忆单词','===\\s\\d{4}-\\d{2}-\\d{2}\\s🔼\\s===(:r)'],
    'fav_lines_bible': ['Bible Fav','#\\d+#(:r)'],
    'keywords_selenium': ['ReadLater Tags'],
    'list_klmemo': ['Memo'],
    'list_long_term_plans': ['Long Term Plans'],
    'list_routines': ['routines事项','[^\\s]+\\s[^\\s]+\\s[^\\s]+(:r)'],
    'list_todolist': ['todolist事项','[^\\s]+\\s[^\\s]+\\s[^\\s]+(:r)'],
    'reader_lastbook': ['电子书阅读书签','[^&]+&[^&]+&\\d+&\\d+&\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}(:r)'],
    };
}

function form_generate_temp_txt_share_js_b(){
    var left_str='<p>';
    left_str=left_str+'<span id="span_update"></span><span style="color:#b0b0b0;font-size:0.8rem;"><i id="i_client_info"></i></span>';
    var right_str='</p>';

    var blstr=textarea_with_form_generate_b('textarea_temp_txt_share','height:'+(ismobile_b()?'10':'20')+'rem;',left_str,'',right_str);
    document.getElementById('div_temp_txt_share').insertAdjacentHTML('afterbegin',blstr);
}

function init_temp_txt_share_b(is_php=true,menu_more='',do_add=true,is_simple=false,buttons_more=''){
    if (!is_php){
        form_generate_temp_txt_share_js_b();
    }
    
    var_generate_temp_txt_share_b();
    
    if (do_add){
        add_button_temp_txt_share_b();
    }
    
    if (buttons_more!==''){
        document.getElementById('span_update').insertAdjacentHTML('afterend',buttons_more);
    }
    
    var ospan=document.getElementById('span_character_count');
    if (ospan){
        ospan.innerHTML=document.getElementById('textarea_temp_txt_share').value.length;
    }

    var buttons='';
    if (is_php){
        buttons=buttons+'<span class="aclick" onclick="location.reload();">🔄</span> ';
    }
    buttons=buttons+'<span class="aclick" onclick="temp_save_temp_txt_share_b(\'write\');">暂存</span> ';
    buttons=buttons+'<span class="aclick" onclick="popup_show_hide_b(\'span_checkboxes\',\'\');">⚙</span> ';
    buttons=buttons+'<span id="span_checkboxes" style="display:none;">';
    buttons=buttons+buttons_txt_klr_b('textarea_temp_txt_share',true);
    buttons=buttons+'</span>';
    
    document.getElementById('span_update').insertAdjacentHTML('beforebegin',buttons+textarea_buttons_b('textarea_temp_txt_share','清空,复制,↑,↓,加密,解密,save as txt file,导入 txt 文件'+(is_php?'':',发送到临时记事本,发送地址,➕')));
    
    if (!is_simple){
        top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
        menu_temp_txt_share_b(is_php,menu_more);
        character_2_icon_b(is_php?'📗':'📙');
    }
    document.getElementById('i_client_info').insertAdjacentHTML('beforeend',' userAgent: '+navigator.userAgent);
    temp_save_temp_txt_share_b('read');
}

function spilt_rows_temp_txt_share_b(separation='\n'){
    var list_t=document.getElementById('textarea_temp_txt_share').value.trim().split(separation);
    if (list_t[0]==''){return;}
    var result_t=[];
    var blxl=0;
    for (let item of list_t){
        if (item.trim()==''){continue;}
        blxl=blxl+1;
        result_t.push('<p>'+blxl+'</p>'+'<textarea style="width:80%;padding:0.2rem;" onclick="this.select();document.execCommand(\'copy\');">'+item+'</textarea>');
        if (blxl>1000){break;}
    }
    var blbuttons='<p>'+close_button_b('div_status','')+'</p>\n';
    document.getElementById('div_status').innerHTML=result_t.join('\n')+blbuttons;
}

function share_style_temp_txt_share_b(){
    function sub_share_style_temp_txt_share_transform(csstr,add_day=true){
        var list_t=csstr.split('\n');
        var is_remove=(list_t[0].substring(0,2)=='# ');
        if (is_remove){
            for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                list_t[blxl]=list_t[blxl].replace(/^# (\d+日，)?/g,'');
            }
        } else if (add_day==false){
            for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                list_t[blxl]='# '+list_t[blxl];
            }
        } else {
            var today=date2str_b('').slice(-2,);
            for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                list_t[blxl]='# '+today+'日，'+list_t[blxl];
            }
        }
        return list_t;
    }
    //-----------------------
    var otextarea=document.getElementById('textarea_temp_txt_share');
    var blold=otextarea.value.trim();
    var list_t=sub_share_style_temp_txt_share_transform(blold);
    
    var test_str1=sub_share_style_temp_txt_share_transform(list_t.join('\n')).join('\n');
    if (test_str1!==blold){
        var test_str2=sub_share_style_temp_txt_share_transform(list_t.join('\n'),false).join('\n');    
        if (test_str2!==blold){
            console.log(test_str);
            console.log(blold);
            if (confirm('是否替换？')===false){return;}
        }
    }
    
    otextarea.value=list_t.join('\n');
}

function js2link_temp_txt_share_b(){
    strquick_klr_b('js2href','textarea_temp_txt_share');

    var blbuttons='<p>'+close_button_b('div_status','')+'</p>\n';
    var odiv=document.getElementById('div_status');
    odiv.innerHTML=document.getElementById('textarea_temp_txt_share').value+blbuttons;
    var oas=odiv.querySelectorAll('a');
    for (let one_a of oas){
        one_a.insertAdjacentHTML('afterend','<table width=100%><tr><td><textarea onclick="this.select();document.execCommand(\'copy\');">'+specialstr92_b(one_a.innerText)+'</textarea></td><td><textarea onclick="this.select();document.execCommand(\'copy\');">'+specialstr92_b(one_a.href)+'</textarea></td></tr></table>');
    }
    odiv.scrollIntoView();
}

function local_js_file_load_txt_share_b(is_php=true){
    if (is_local_b()){
        var data_file='data/klwiki/klwiki_page_position_data.js';
        if (!is_php){
            data_file='../../../../'+data_file;
        }
        klbase_addons_import_js_b(['rlater'],[],[],[data_file]);
    }
}

function menu_temp_txt_share_b(is_php=true,menu_more=''){
    var str_t=klmenu_hide_b('');
    var klwebphp,sele_path;
    [klwebphp,sele_path]=klbase_sele_path_b();
    var klmenu0=[
    '<span class="span_menu" onclick="'+str_t+'multi_rows_2_one_column_temp_txt_share_b();">multl rows to one column</span>',
    '<span class="span_menu" onclick="'+str_t+'spilt_rows_temp_txt_share_b();">one textarea with one row</span>',
    '<span class="span_menu" onclick="'+str_t+'spilt_rows_temp_txt_share_b(\'\\n-----\\n\');">split rows by -----</span>',
    '<span class="span_menu" onclick="'+str_t+'clear_copy_tab_title_url_klr_b(\'textarea_temp_txt_share\');">clear copy tab title url</span>',
    '<span class="span_menu" onclick="'+str_t+'js2link_temp_txt_share_b();">JavaScript 数组 => 网址链接</span>',    
    ];
    
    var klmenu_share=[
    '<span class="span_menu" onclick="'+str_t+'encrypt_textarea_quick_transform_klr_b(\'textarea_temp_txt_share\',\'textarea_temp_txt_share\');">encrypt with unicode characters</span>',    
    '<span class="span_menu" onclick="'+str_t+'share_style_temp_txt_share_b();">wx wb share style</span>',    
    ];    
    
    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'sort_rows_klr_b(\'textarea_temp_txt_share\',\'\');">sort</span> ',
    '<span class="span_menu" onclick="'+str_t+'blank_rows_remove_klr_b(\'textarea_temp_txt_share\');">remove blank rows</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_import_b(\'textarea_temp_txt_share\',true);">import data to localStorage</span>',    
    '<span class="span_menu" onclick="'+str_t+'remove_notepad_mark_temp_txt_share_b();">清除notepad标记和日期</span>',    
    '<span class="span_menu" onclick="'+str_t+'remove_notepad_tag_b(\'textarea_temp_txt_share\');">清除tag标记</span>',    
    ];
    
    var klmenu_link=[
    '<a href="'+klwebphp+'temp_txt_append.php" onclick="'+str_t+'" target=_blank>➕ temp txt append</a>',
    '<a href="'+sele_path+'/html/rows.htm" onclick="'+str_t+'" target=_blank>kl rows</a>',
    '<a href="'+klwebphp+'file_share_list.php" onclick="'+str_t+'" target=_blank>file share list</a>',
    ];
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu0,(is_php?'📗':'📙'),'16rem','1rem','1rem','60rem')+klmenu_b(klmenu_share,'🫂','19rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','18rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','12rem','1rem','1rem','60rem')+menu_more,'','0rem')+' ';
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg);
}

function remove_notepad_mark_temp_txt_share_b(){
    var otextarea=document.getElementById('textarea_temp_txt_share');
    var list_t=otextarea.value.split('\n');
    var tag_list=new Set();
    //格式如下：
    //5/29/2024, 11:01:22 AM
    //=== notepad ===
    for (let blxl=1,lent=list_t.length;blxl<lent;blxl++){
        if (list_t[blxl]=='=== notepad ==='){
            if (list_t[blxl-1].match(/^\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)$/)){
                tag_list.add(blxl-1);
                tag_list.add(blxl);
            }
        }
    }

    var content_list=[];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        if (tag_list.has(blxl)){continue;}
        content_list.push(list_t[blxl]);
    }
    
    if (confirm('共有行数 '+list_t.length+' 行，其中内容 '+content_list.length+' 行，notepad tag '+tag_list.size+' 行，是否清除？')===false){return;}
    otextarea.value=content_list.join('\n');
}

function multi_rows_2_one_column_temp_txt_share_b(){
    var rows=parseInt(prompt('每多少行转为为一列？','4') || '');
    if (isNaN(rows)){return;}
    if (rows<=1){return;}
    if (confirm('是否执行行列转换？')===false){return;}
    var otextarea=document.getElementById('textarea_temp_txt_share');
    var list_t=otextarea.value.trim().split('\n');
    
    var result_t=[];
    var new_row=[];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        if (blxl % rows == 0){
            if (new_row.length>0){
                result_t.push(new_row.join('\t'));
                new_row=[];
            }
        }
        new_row.push(list_t[blxl]);
    }
    if (new_row.length>0){
        result_t.push(new_row.join('\t'));
    }
    otextarea.value=result_t.join('\n');
}
