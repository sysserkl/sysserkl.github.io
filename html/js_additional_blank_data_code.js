function col_rearrange_blank_data(){
    var is_url_title=klmenu_check_b('span_url_title_mode_blank_data',false);        
    if (!is_url_title || js_data_current_common_search_global.length==0){return js_data_current_common_search_global;}
    
    if (!Array.isArray(js_data_current_common_search_global[0][0])){return js_data_current_common_search_global;}

    if (js_data_current_common_search_global[0][0].length<2){return js_data_current_common_search_global;}
    
    var list_t=[];
    var blstyle='onclick="this.style.color=\''+scheme_global['memo']+'\';"';
    for (let arow of js_data_current_common_search_global){
        list_t.push(['<a href="'+arow[0][0]+'" '+blstyle+' target=_blank>'+arow[0][1]+'</a>',arow[1]]);
    }
    return list_t;
}

function import_as_js_blank_data(){
    if (!confirm('是否导入js数据？')){return;}
    var otextarea=document.getElementById('textarea_blank_data');
    var list_t=otextarea.value.trim().split('\n');
    if (list_t[0].trim().substring(0,4).toLowerCase()=='var '){
        list_t.splice(0,1);
    }
    if (list_t.length==0){return;}
    if (list_t.slice(-1)[0].trim()=='];'){
        list_t=list_t.slice(0,-1);
    }
    try {
        blank_data_global=eval('['+list_t.join('\n')+']');
        raw_data_len_jscm_global=blank_data_global.length;
    }
    catch (error){
        alert(error);
    }
    document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
}

function form_blank_data(){
    var blbuttons='<p>';
    blbuttons=blbuttons+'<span class="aclick" onclick="import_as_js_blank_data();">import as js</span>';
    blbuttons=blbuttons+close_button_b('div_form_common','','aclick');
    blbuttons=blbuttons+'</p>';
    var odiv=document.getElementById('div_form_common');

    var blstr='<textarea id="textarea_blank_data" style="height:20rem;"></textarea>';
    odiv.innerHTML=blstr+blbuttons;
    odiv.scrollIntoView();
}

function menu_more_blank_data(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_url_title_mode_blank_data" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ url title mode</span>',        
    '<span class="span_menu" onclick="'+str_t+'form_blank_data();">导入数据</span>',    
    ];
    return klmenu_b(klmenu1,'🧰','12rem','1rem','1rem','30rem');    
}
