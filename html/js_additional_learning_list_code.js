function menu_more_learning_list(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];
    for (let blxl=1;blxl<=12;blxl++){
        klmenu1.push(['../jsdata/learning_links/learning_links_'+blxl+'_data.js','🖫','learning links '+blxl,'learning_list_global','learning_list','']);
    }
    klmenu1=js_file_links_common(klmenu1);
    return klmenu_b(klmenu1,'📚','12rem','1rem','1rem','30rem');
}
