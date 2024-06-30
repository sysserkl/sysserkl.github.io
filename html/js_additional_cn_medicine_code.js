function col_rearrange_cn_medicine(){    
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        var new_row=['<a href="https://ydz.chp.org.cn/#/item?entryId='+arow[0][1]+'" target=_blank>'+arow[0][0]+'</a>'].concat(arow[0].slice(2,));
        list_t.push([new_row,arow[1]]);
    }
    return list_t;
}

function col_name_get_cn_medicine(){
    var col_names=new Set();
    for (let arow of cn_medicine_raw_global){
        for (let key in arow[1]){
            col_names.add(key);
        }
    }
    console.log(col_names); //此行保留 - 保留注释
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
        var tr_list=[arow[0],arow[1]['link_id']];
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
    var blparent=menu_parent_node_b(str_t);

    var col_name_list=Object.keys(table_th_jscm_global);
    for (let blxl=0,lent=col_name_list.length;blxl<lent;blxl++){
        col_name_list[blxl]='<option value="'+blxl+'">'+col_name_list[blxl]+'</option>';
    }
    var klmenu1=[
    '<span class="span_menu"><select id="select_sort_type_jsad_cn_medicine" style="height:2rem;">'+col_name_list.join('\n')+'</select> <span class="aclick" onclick="'+blparent+'sort_cn_medicine();">↑</span><span class="aclick" onclick="'+blparent+'sort_cn_medicine(true);">↓</span></span>',    
    '<span class="span_menu" onclick="'+str_t+'statistics_ingredient_cn_medicine();">当前条件处方用药统计</span>',    
    ];
    return klmenu_b(klmenu1,'🏥','14rem','1rem','1rem','30rem');
}

function sort_cn_medicine(is_desc=false){
    var rank_no=parseInt(document.getElementById('select_sort_type_jsad_cn_medicine').value);
    if (rank_no==0){
        cn_medicine_raw_global.sort(function (a,b){return zh_sort_b(a[rank_no],b[rank_no],is_desc);});    
    } else {
        rank_no=rank_no+1; //第2个元素是 link_id - 保留注释;
        cn_medicine_raw_global.sort(function (a,b){return zh_sort_b(a[rank_no],b[rank_no],is_desc);});
    }
}

function statistics_ingredient_cn_medicine(sort_no=1,is_desc=true){
    var ingredient_t={};
    for (let arow of js_data_current_common_search_global){
        var name_list=arow[0][1].replace(/（或相当于/g,'').replace(/（或/g,'').replace(/\s+/g,'1').split(/\d+(g|ml)?/);
        for (let one_name of name_list){
            if (one_name==undefined){continue;}
            one_name=one_name.split('（')[0].trim();
            if (['','）','g','ml','.'].includes(one_name)){continue;}
            if (ingredient_t['i_'+one_name]==undefined){
                ingredient_t['i_'+one_name]=0;
            }
            ingredient_t['i_'+one_name]=ingredient_t['i_'+one_name]+1;
        }
    }
    
    ingredient_t=object2array_b(ingredient_t,true,2);
    
    if (sort_no==0){
        ingredient_t.sort(function (a,b){return zh_sort_b(a,b,is_desc,sort_no);});
    } else {
        ingredient_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});    
        if (is_desc){
            ingredient_t.sort(function (a,b){return a[sort_no]<b[sort_no] ? 1 : -1;});
        } else {
            ingredient_t.sort(function (a,b){return a[sort_no]>b[sort_no] ? 1 : -1;});    
        }
    }
    
    for (let blxl=0,lent=ingredient_t.length;blxl<lent;blxl++){
        ingredient_t[blxl]='<tr><td>'+(blxl+1)+'</td><td>'+ingredient_t[blxl][0]+'</td><td align=right>'+ingredient_t[blxl][1]+'</td></tr>';
    }
    
    var blth='<tr><th>No.</th><th style="cursor:pointer;" onclick="statistics_ingredient_cn_medicine(0,'+!is_desc+');">成分</th><th style="cursor:pointer;" onclick="statistics_ingredient_cn_medicine(1,'+!is_desc+');">次数</th></tr>';
    
    var blbuttons='<p>';
    blbuttons=blbuttons+close_button_b('div_status_common');
    blbuttons=blbuttons+'</p>';
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML='<table class="table_common">'+blth+ingredient_t.join('\n')+'</table>'+blbuttons;
    odiv.scrollIntoView();
}
