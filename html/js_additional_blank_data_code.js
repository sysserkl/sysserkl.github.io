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

function import_as_js_blank_data(is_append=false){
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
        if (is_append){
            blank_data_global=blank_data_global.concat(eval('['+list_t.join('\n')+']'));        
        } else {
            blank_data_global=eval('['+list_t.join('\n')+']');
        }
        raw_data_len_jscm_global=blank_data_global.length;
    } catch (error){
        var info=array_check_b(list_t);
        if (info==''){
            alert(error);
        } else {
            alert(info);
        }
        console.log(error);
    }
    document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
}

function form_blank_data(){
    var blbuttons='<p>';
    blbuttons=blbuttons+'<span class="aclick" onclick="import_as_js_blank_data();">清除旧记录并作为js导入</span>';
    blbuttons=blbuttons+'<span class="aclick" onclick="import_as_js_blank_data(true);">添加到旧记录尾部并作为js导入</span>';
    
    if (!is_file_type_b()){
        var option_list=['<option></option>'];
        if (typeof blank_js_file_list_pb_global !== 'undefined' ){
            for (let item of blank_js_file_list_pb_global){
                option_list.push('<option>p_'+item+'</option>');
            }
        }
        if (typeof blank_js_file_list_kl_global !== 'undefined' ){
            for (let item of blank_js_file_list_kl_global){
                option_list.push('<option>k_'+item+'</option>');
            }
        }    
        blbuttons=blbuttons+' <select id="select_import_js_file_blank_data">'+option_list.join('\n')+'</select> ';
        blbuttons=blbuttons+'<span class="aclick" onclick="import_js_file_to_textarea_blank_data();">import file to textarea</span>';    
    }
    
    blbuttons=blbuttons+textarea_buttons_b('textarea_blank_data','清空,复制,导入temp_txt_share,导入 txt 文件');        
    blbuttons=blbuttons+close_button_b('div_form_common','','aclick');
    blbuttons=blbuttons+'</p>';
    var odiv=document.getElementById('div_form_common');

    var blstr='<textarea id="textarea_blank_data" style="height:20rem;"></textarea>';
    odiv.innerHTML=blstr+blbuttons;
    odiv.scrollIntoView();
}

function import_js_file_to_textarea_blank_data(){
    var oselect=document.getElementById('select_import_js_file_blank_data');
    if (!oselect){return;}
    var blvalue=oselect.value;
    if (blvalue==''){return;}
    
    var otextarea=document.getElementById('textarea_blank_data');
    if (!otextarea){return;}
    
    var blstr='';
    var bltype=blvalue.slice(0,1);
    blvalue=blvalue.substring(2,);
    if (bltype=='p'){
        var selepath=klbase_sele_path_b()[1]+'/jsdata/blank_data_pb/';
        blstr=read_txt_file_b(selepath+blvalue+'_data.js');
    } else {
        var klwebphp_path=klwebphp_path_b('data/blank_data_kl/'+blvalue+'_data.js');
        console.log(klwebphp_path);
        if (klwebphp_path!==false){
            blstr=read_txt_file_b(klwebphp_path);    
        }
    }
    if (blstr!==''){
        otextarea.value=blstr;
    }
}

function file_load_blank_data(){
    var file_list=klbase_addons_import_js_b([],[],['blank_data_pb/blank_js_file_list_pb_data.js'],['../../../../data/blank_data_kl/blank_js_file_list_kl_data.js'],false,false);
    file_dom_create_b(file_list,true,'js');
}


function menu_more_blank_data(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_url_title_mode_blank_data" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ url title mode</span>',        
    '<span class="span_menu" onclick="'+str_t+'form_blank_data();">导入数据</span>',    
    ];
    return klmenu_b(klmenu1,'🧰','12rem','1rem','1rem','30rem');    
}
