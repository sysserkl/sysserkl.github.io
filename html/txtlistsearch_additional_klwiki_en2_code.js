function menu_more_kltxt(){
    var ospan=document.getElementById('span_for_more_menu_kltxt');
    if (!ospan){return;}

    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'sentence01_words_kltemplate();">单词批量查找</span>',
    ];
    
    var blstr=klmenu_b(klmenu1,'测','16rem','1rem','1rem','30rem');
    ospan.outerHTML=blstr;
}
