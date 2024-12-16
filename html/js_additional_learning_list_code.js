function menu_more_learning_list(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];

    var flist=flist_get_learning_list();
    for (let item of flist){
        klmenu1.push([item[1],'🖫',item[0],'learning_list_global','learning_list','','1']);
    }
    klmenu1=js_file_links_common(klmenu1);
    
    if (data_file_jscm_global=='../jsdata/learning_links/learning_links_1_data.js'){
        klmenu1.push('<span class="span_menu" onclick="'+str_t+'merge_data_learning_list(this);">合并数据</span>');
    }
            
    return klmenu_b(klmenu1,'📚','12rem','1rem','1rem','30rem');
}

function flist_get_learning_list(){
    var list_t=[];
    for (let blxl=1;blxl<=12;blxl++){
        list_t.push(['learning links '+blxl,'../jsdata/learning_links/learning_links_'+blxl+'_data.js']);
    }
    return list_t;
}

function merge_data_learning_list(ospan){    
    var flist=flist_get_learning_list();
    flist=flist.slice(1,);
    
    for (let blxl=0,lent=flist.length;blxl<lent;blxl++){
        flist[blxl]=flist[blxl][1];
    }

    merge_data_common(flist,ospan);
}
