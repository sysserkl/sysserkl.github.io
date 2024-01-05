function menu_more_kltxt_klwiki_main(){
    var ospan=document.getElementById('span_for_more_menu_kltxt');
    if (!ospan){return;}

    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'yymmdd_kltxt_klwiki_main();">联合早报yymmdd不一致检索</span>',    
    '<span class="span_menu" onclick="'+str_t+'weixin_kltxt_klwiki_main();">微信sharer_shareid</span>',    
    ];

    var blstr=klmenu_b(klmenu1,'W','18rem','1rem','1rem','30rem');
    ospan.outerHTML=blstr;
}

function yymmdd_kltxt_klwiki_main(){
    txtsearch_kltxt_b('+zaobao +\\d{8}.*\\d{8}\\s*\\| -(\\d{8})-[^\\s]*\\s*\\1\\s*\\|',true,false,false);
}

function weixin_kltxt_klwiki_main(){
    txtsearch_kltxt_b('sharer_shareid',false,false,false);
}
