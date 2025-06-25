function data_load_dp_rank(array_name){
    eval(array_name).sort(function (a,b){return a[3]<b[3] ? 1 : -1;});
    eval(array_name).sort(function (a,b){return a[2]<b[2] ? 1 : -1;});
    eval(array_name).sort(function (a,b){return zh_sort_b(a,b,false,0);});
}

function col_rearrange_dp_rank(){
    var result_t=[];
    for (let item of js_data_current_common_search_global){
        var list_t=item[0].slice(0,6);
        list_t.push('<small>'+item[0][6].join(' ')+'</small>');
        result_t.push([list_t,item[1]]);
    }
    return result_t;
}

function menu_more_dp_rank(){
    var str_t=klmenu_hide_b('');

    table_th_jscm_global={'城市':'','店名':'','评论人数':'right','人均消费￥':'right','类型':'','地址':'','推荐菜':''};
    
    var col_name_list=Object.keys(table_th_jscm_global);

    var klmenu1=[    
    klmenu_select_sort_b('select_sort_type_jsad_dp_rank',col_name_list,str_t,'sort_dp_rank'),
    '<span class="span_menu" onclick="statistics_type_dp_rank(0);">当前条件餐馆城市统计</span>',
    '<span class="span_menu" onclick="statistics_type_dp_rank(4);">当前条件餐馆类型统计</span>',
    '<span class="span_menu" onclick="statistics_type_dp_rank(5);">当前条件餐馆地址统计</span>',
    '<span class="span_menu" onclick="statistics_type_dp_rank(4,true);">当前条件分城市餐馆类型统计</span>',
    '<span class="span_menu" onclick="statistics_type_dp_rank(5,true);">当前条件分城市餐馆地址统计</span>',
    ];
    return klmenu_b(klmenu1,'🍿','16rem','1rem','1rem','30rem');
}

function statistics_type_dp_rank(csno=4,add_city=false,sort_no=1){
    function sub_statistics_type_dp_rank_style(csarray,cshead=''){
        var result_t=object2array_b(csarray,false,2);
        result_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
        result_t.sort(function (a,b){return a[sort_no]<b[sort_no] ? 1 : -1;});
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            result_t[blxl]='<tr><td>'+(blxl+1)+'</td><td>'+result_t[blxl][0]+'</td><td align=right>'+result_t[blxl][1]+'</td><td align=right>'+result_t[blxl][2]+'</td></tr>';
        }
        if (cshead!==''){
            cshead='<tr><th colspan=4>'+cshead+'</th></tr>';
        }
        return '<table class="table_common">'+cshead+th_str+result_t.join('\n')+'</table>';
    }
    //-----------------------
    var city_dict={};        
    var type_dict={};
    for (let item of js_data_current_common_search_global){
        var blkey='t_'+item[0][csno];
        if (add_city){
            var city_name='c_'+item[0][0];
            if (city_dict[city_name]==undefined){
                city_dict[city_name]={};
            }
            if (city_dict[city_name][blkey]==undefined){
                city_dict[city_name][blkey]=[item[0][csno],0,0];
            }
            city_dict[city_name][blkey][1]=city_dict[city_name][blkey][1]+1;
            city_dict[city_name][blkey][2]=city_dict[city_name][blkey][2]+item[0][2];
        } else {
            if (type_dict[blkey]==undefined){
                type_dict[blkey]=[item[0][csno],0,0];
            }
            type_dict[blkey][1]=type_dict[blkey][1]+1;        
            type_dict[blkey][2]=type_dict[blkey][2]+item[0][2];
        }
    }

    var caption=(csno==4?'类型':'地址');
    var th_str='<tr><th>No.</th><th>'+caption+'</th><th style="cursor:pointer;" onclick="statistics_type_dp_rank('+csno+','+add_city+',1);">店数</th><th style="cursor:pointer;" onclick="statistics_type_dp_rank('+csno+','+add_city+',2);">评论人数</th></tr>';
    var result_t=[];
    if (add_city){
        for (let key in city_dict){          
            result_t.push(sub_statistics_type_dp_rank_style(city_dict[key],key.substring(2,)));
        }
        result_t=result_t.join('\n');
    } else {
        result_t=sub_statistics_type_dp_rank_style(type_dict);
    }
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML=result_t;
    odiv.scrollIntoView();
}

function sort_dp_rank(is_desc=false){
    var rank_no=parseInt(document.getElementById('select_sort_type_jsad_dp_rank').value);
    
    if (rank_no >=2 && rank_no <=3){
        if (is_desc){
            dp_rank_global.sort(function (a,b){return a[rank_no]<b[rank_no] ? 1 : -1;});
        } else {
            dp_rank_global.sort(function (a,b){return a[rank_no]>b[rank_no] ? 1 : -1;});    
        }
    } else {
        if (rank_no==6){
            dp_rank_global.sort(function (a,b){return zh_sort_b(a[6].toString(),b[6].toString(),is_desc);});
        } else {
            dp_rank_global.sort(function (a,b){return zh_sort_b(a,b,is_desc,rank_no);});            
        }    
    }
}
