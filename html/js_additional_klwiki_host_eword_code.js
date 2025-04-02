function menu_more_klwiki_host_eword(){
    table_th_jscm_global={'host':'','文章数':'right','eword数':'right','eword数/文章数(%)':'right'};
    var col_name_list=Object.keys(table_th_jscm_global);
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    klmenu_select_sort_b('select_sort_type_jsad_klwiki_host_eword',col_name_list,str_t,'sort_klwiki_host_eword',true,true),
    '<span class="span_menu" onclick="'+str_t+'efull_search_klwiki_host_eword();">EFULL 网址搜索</span>',        
    ];
    return klmenu_b(klmenu1,'🌎','12rem','1rem','1rem','30rem');
}

function sort_klwiki_host_eword(is_desc=false,rank_no=false){
    if (rank_no===false){
        rank_no=parseInt(document.getElementById('select_sort_type_jsad_klwiki_host_eword').value);
    }

    if (is_desc){
        klwiki_host_eword_global.sort(function (a,b){return a[rank_no]>b[rank_no]?-1:1;});    
    } else {
        klwiki_host_eword_global.sort(function (a,b){return a[rank_no]<b[rank_no]?-1:1;});            
    }
}

function file_load_klwiki_host_eword(){
    function sub_file_load_klwiki_host_eword_done(is_ok,cssrc){
        blxl=blxl+1;
        console.log(blxl,bllen,is_ok,cssrc);        
        if (blxl==bllen){
            efull_get_websites_b(function (efull_set){efull_set_klwiki_host_eword_global=efull_set;});
        }
    }
    
    var file_list=klbase_addons_import_js_b(['websites'],[],[],[],false,false);
    var bllen=file_list.length;
    var blxl=0;
    file_dom_create_b(file_list,true,'js',sub_file_load_klwiki_host_eword_done);
}

function efull_search_klwiki_host_eword(){
    search_common('\\b('+Array.from(efull_set_klwiki_host_eword_global).join('|').replace(/\./g,'\\.')+')\\b');
}

function col_rearrange_klwiki_host_eword(){
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        var row_tmp=arow[0].slice(0,3);
        row_tmp.push(arow[0][3].toFixed(2));
        list_t.push([row_tmp,arow[1]]);
    }
    return list_t;
}
