function menu_more_rmrb_online(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];
    var flist=flist_get_rmrb_online();
    for (let item of flist){
        klmenu1.push([item[1],'🖫','rmrb online '+item[0],'rmrb_online_global','rmrb_online','']);
    }

    klmenu1=js_file_links_common(klmenu1);
    
    klmenu1=klmenu1.concat([
    '<span id="span_merge_show_rmrb_online_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 合并展示</span>',
    ]);
    
    if (flist.length>1){
        if (data_file_jscm_global==flist[0][1]){
            klmenu1.push('<span class="span_menu" onclick="'+str_t+'merge_data_rmrb_online(this);">合并数据</span>');
        }
    }
    return klmenu_b(klmenu1,'📚','18rem','1rem','1rem','30rem');
}

function flist_get_rmrb_online(){
    var list_t=['194605_196612','196701_198712','198801_200312'];
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=[list_t[blxl],'../jsdata/rmrb_online/rmrb_online_'+list_t[blxl]+'_data.js'];
    }
    return list_t;
}

function col_rearrange_rmrb_online(){    
    var is_merge=klmenu_check_b('span_merge_show_rmrb_online_common',false);
    if (!is_merge){return js_data_current_common_search_global;}
    
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        var bllink='https://rmrb.online/simple/?'+arow[0][0];
        var bldate=arow[0][1].substring(0,4)+'年'+arow[0][1].slice(-2,)+'月';
        list_t.push([[bldate,'<a href="'+bllink+'" target=_blank>'+arow[0][2]+'</a>'],arow[1]]);
    }
    return list_t;
}

function merge_data_rmrb_online(ospan){    
    var flist=flist_get_rmrb_online();
    flist=flist.slice(1,);
    
    for (let blxl=0;blxl<flist.length;blxl++){
        flist[blxl]=flist[blxl][1];
    }

    merge_data_common('rmrb_online_global',flist,ospan);
}
