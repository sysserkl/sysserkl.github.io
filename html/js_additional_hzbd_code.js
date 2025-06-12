function col_rearrange_hzbd(){
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        var new_row=[arow[0][0],'<a href="https://zts.5618.co/h5/#/pages/planning/detail?id='+arow[0][1]+'" target=_blank>'+arow[0][2]+'</a>'].concat(arow[0].slice(3,));
        
        list_t.push([new_row,arow[1]]);
    }
    return list_t;
}

function menu_more_hzbd(){
    table_th_jscm_global={'地区':'','名称':'','介绍':''};

    var str_t=klmenu_hide_b('');
    
    var klmenu1=[
    '<a href="https://zts.5618.co/h5/#/pages/planning/list" onclick="'+str_t+'" target=_blank>打开环浙步道网址，再复制链接到打开的页面</a>',
    ];

    return klmenu_b(klmenu1,'🪨','22rem','1rem','1rem','30rem');
}
