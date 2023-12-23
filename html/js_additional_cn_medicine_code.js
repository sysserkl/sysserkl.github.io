function col_name_get_cn_medicine(){
    var col_names=new Set();
    for (let arow of cn_medicine_raw_global){
        for (let key in arow[1]){
            col_names.add(key);
        }
    }
    console.log(col_names);
}

function img_replace_cn_medicine(csstr){
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

function data_load_cn_medicine(){
    col_name_get_cn_medicine(); //供验证用 - 保留注释
    
    table_th_jscm_global={'药名':'','处方':'','功能与主治':'','用法与用量':'','贮藏':'','性味与归经':'','性味':'','禁忌':''};
    var col_names=new Set(Object.keys(table_th_jscm_global));
    col_names.delete('药名');
    
    cn_medicine_raw_global.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    var result_t=[];
    for (let arow of cn_medicine_raw_global){
        var tr_list=['<a href="https://ydz.chp.org.cn/#/item?entryId='+arow[1]['link_id']+'" target=_blank>'+arow[0]+'</a>'];
        for (let key of col_names){
            if (arow[1][key]==undefined){
                tr_list.push('');
            } else {
                tr_list.push(img_replace_cn_medicine(arow[1][key].join(' ')));
            }
        }
        result_t.push(tr_list);
    }
    cn_medicine_raw_global=result_t;
}

function menu_more_cn_medicine(){    
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'ingredient_cn_medicine();">处方用药统计</span>',    
    ];
    return klmenu_b(klmenu1,'🏥','12rem','1rem','1rem','30rem');
}

function ingredient_cn_medicine(){

}
