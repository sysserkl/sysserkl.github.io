function col_rearrange_cn_medicine_nl(){    
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        var new_row=[].concat(arow[0]);
        new_row[0]=img_replace_cn_medicine_nl(new_row[0]);
        var blkey=encodeURIComponent(new_row[0]);
        new_row[1]='<a href="https://ydz.chp.org.cn/#/item?entryId='+new_row[1]+'" target=_blank>'+new_row[1]+'</a>';
        new_row.push('<a href="https://www.bing.com/search?q='+blkey+'" target=_blank>B</a>');
        new_row.push('<a href="https://www.baidu.com/s?wd='+blkey+'" target=_blank>百</a>');
        list_t.push([new_row,arow[1]]);
    }
    return list_t;
}

function img_replace_cn_medicine_nl(csstr){
    while (true){
        var blfound=false;
        var list_t=csstr.match(/<img\b.*?\bsrc=".*?\/(.*?)".*?"\/>/) || [];
        if (list_t.length==2){
            if (cn_medicine_img_2cn_global[list_t[1]]!==undefined){
                csstr=csstr.replace(/<img\b.*?\bsrc=".*?\/(.*?)".*?"\/>/,cn_medicine_img_2cn_global[list_t[1]]);
                blfound=true;
            }
        }
        if (!blfound){break;}
    }
    return csstr;
}

function menu_more_cn_medicine_nl(){    
    var str_t=klmenu_hide_b('');

    table_th_jscm_global={'名称':'','链接':'right','Bing':'center','Baidu':'center'};

    var col_name_list=Object.keys(table_th_jscm_global);
    var klmenu1=[
    klmenu_select_sort_b('select_sort_type_jsad_cn_medicine_nl',col_name_list,str_t,'sort_cn_medicine_nl'),
    ];
    return klmenu_b(klmenu1,'🏥','14rem','1rem','1rem','30rem');
}

function sort_cn_medicine_nl(is_desc=false){
    var rank_no=parseInt(document.getElementById('select_sort_type_jsad_cn_medicine_nl').value);
    if (rank_no==0){
        cn_medicine_name_link_global.sort(function (a,b){return zh_sort_b(a[rank_no],b[rank_no],is_desc);});
    } else {
        if (is_desc){
            cn_medicine_name_link_global.sort(function (a,b){return a[rank_no]<b[rank_no] ? 1 : -1;});
        }
        else {
            cn_medicine_name_link_global.sort(function (a,b){return a[rank_no]>b[rank_no] ? 1 : -1;});
        }
    }
}

function img_replace_cn_medicine_nl(csstr){
    while (true){
        var blfound=false;
        var list_t=csstr.match(/<img\b.*?\bsrc=".*?\/(.*?)".*?"\/>/) || [];
        if (list_t.length==2){
            if (cn_medicine_img_2cn_global[list_t[1]]!==undefined){
                csstr=csstr.replace(/<img\b.*?\bsrc=".*?\/(.*?)".*?"\/>/,cn_medicine_img_2cn_global[list_t[1]]);
                blfound=true;
            }
        }
        if (!blfound){break;}
    }
    return csstr;
}
