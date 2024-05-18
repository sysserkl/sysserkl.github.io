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

function update_temp_txt_share_b(csid){
    var otextarea=document.getElementById('textarea_temp_txt_share');
    if (!otextarea){return;}
    
    var cscaption=temp_txt_share_type_dict_global[csid][0];
    var blfound=false;
    if (temp_txt_share_type_dict_global[csid].length>=2){
        var blkey=temp_txt_share_type_dict_global[csid][1];
        var is_reg=false;
        [blkey,is_reg]=str_reg_check_b(blkey,is_reg);
        blfound=str_reg_search_b(otextarea.value.trim(),blkey,is_reg);
    }
    
    if (blfound){
        if (confirm('是否更新 '+cscaption+'？')===false){return;}
    } else {
        var rndstr=randstr_b(4,true,false);
        if ((prompt('输入 '+rndstr+' 确认更新 '+cscaption) || '').trim()!==rndstr){return;}
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
}

function temp_save_temp_txt_share_b(cstype=''){
    var old_len=temp_save_table_b(cstype,'temp_txt_share_save','textarea_temp_txt_share','div_temp_save',200,'',false);
    if (cstype=='write' && old_len===false){
        alert('超出最大数目，未添加');
    }
}

function init_temp_txt_share_b(is_php=true){
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
        
    add_button_temp_txt_share_b();
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
    
    document.getElementById('span_update').insertAdjacentHTML('beforebegin',buttons+textarea_buttons_b('textarea_temp_txt_share','清空,复制,save as txt file'+(is_php?'':',发送到临时记事本,发送地址,➕')));
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    menu_temp_txt_share_b(is_php);
    document.getElementById('i_client_info').insertAdjacentHTML('beforeend',' userAgent: '+navigator.userAgent);
    temp_save_temp_txt_share_b('read');
    character_2_icon_b(is_php?'📗':'📙');
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
            for (let blxl=0;blxl<list_t.length;blxl++){
                list_t[blxl]=list_t[blxl].replace(/^# (\d+日，)?/g,'');
            }
        } else if (add_day==false){
            for (let blxl=0;blxl<list_t.length;blxl++){
                list_t[blxl]='# '+list_t[blxl];
            }
        } else {
            var today=date2str_b('').slice(-2,);
            for (let blxl=0;blxl<list_t.length;blxl++){
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

function menu_temp_txt_share_b(is_php=true){
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
    '<span class="span_menu" onclick="'+str_t+'encrypt_content_temp_txt_share_b();">encrypt with unicode characters</span>',    
    '<span class="span_menu" onclick="'+str_t+'share_style_temp_txt_share_b();">wx wb share style</span>',    
    ];    
    
    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'sort_rows_klr_b(\'textarea_temp_txt_share\',\'\');">sort</span> ',
    '<span class="span_menu" onclick="'+str_t+'blank_rows_remove_klr_b(\'textarea_temp_txt_share\');">remove blank rows</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_import_b(\'textarea_temp_txt_share\',true);">import data to localStorage</span>',    
    ];
    
    if (is_local_b()){
        klmenu_config.push('<span class="span_menu" onclick="'+str_t+'wiki_page_name_temp_txt_share_b();">wiki page name</span>');
    }
    
    if (!is_php){
        klmenu_config.push('<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>');
        klmenu_config.push(load_sentence_menu_b(str_t));
    }
    
    var klmenu_link=[
    '<a href="'+klwebphp+'temp_txt_append.php" onclick="'+str_t+'" target=_blank>➕ temp txt append</a>',
    '<a href="'+sele_path+'/html/rows.htm" onclick="'+str_t+'" target=_blank>kl rows</a>',
    '<a href="'+klwebphp+'file_share_list.php" onclick="'+str_t+'" target=_blank>file share list</a>',
    '<span class="span_menu" onclick="'+str_t+'sync_pages_batch_open_temp_txt_share_b();">批量打开需同步页面</span>',    
    ];
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu0,(is_php?'📗':'📙'),'16rem','1rem','1rem','60rem')+klmenu_b(klmenu_share,'🫂','19rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','18rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','12rem','1rem','1rem','60rem'),'','0rem')+' ';
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg);
}

function sync_pages_batch_open_temp_txt_share_b(){
    function sub_sync_pages_batch_open_temp_txt_share_b_one_page(){
        if (blxl>=bllen){return;}
        window.open(sele_path+'/html/'+list_t[blxl]);
        blxl=blxl+1;
        setTimeout(sub_sync_pages_batch_open_temp_txt_share_b_one_page,2000);
    }
    
    var sele_path=klbase_sele_path_b()[1];
    var list_t=[
    'enwords.htm',
    'reader.htm?_tagNONE',
    'selenium_enwords.htm',
    'readlater.htm',
    'notepad.htm',
    ];
    
    var blxl=0;
    var bllen=list_t.length;
    sub_sync_pages_batch_open_temp_txt_share_b_one_page();
}

function wiki_page_name_temp_txt_share_b(){
    var otextarea=document.getElementById('textarea_temp_txt_share');
    var list_t=otextarea.value.match(/^=+\s*(.+)\s*=+$/mg) ||[];
    var result_t=title_key_rlater_b(list_t.join(' '),false);
    
    document.getElementById('div_status').innerHTML=result_t.join(' ')+' '+close_button_b('div_status','');
}

function encrypt_content_temp_txt_share_b(){
    var blold=document.getElementById('textarea_temp_txt_share').value;
    var result_t=encrypt_content_quick_transform_klr_b(blold,true);
    if (result_t!==false){
        document.getElementById('textarea_temp_txt_share').value=result_t;
    }
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
    for (let blxl=0;blxl<list_t.length;blxl++){
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
