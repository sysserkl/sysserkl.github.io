function menu_more_zj_gpsp(){
    table_th_jscm_global={'名称':'','大类':'','中类':'','经度':'','纬度':'','区域':''};
    var col_name_list=Object.keys(table_th_jscm_global);

    var str_t=klmenu_hide_b('');

    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'lat_lon_get_zj_gpsp();">获取当前结果坐标</span>',    
    klmenu_select_sort_b('select_sort_type_jsad_zj_gpsp',col_name_list,str_t,'sort_zj_gpsp',true,true,[],0,'当前结果 '),

    ];

    return klmenu_b(klmenu1,'🌏','16rem','1rem','1rem','30rem');
}

function sort_zj_gpsp(is_desc=false){
    var t0 = performance.now();

    var rank_no=parseInt(document.getElementById('select_sort_type_jsad_zj_gpsp').value);
    if ([3,4].includes(rank_no)){
        if (is_desc){
            js_data_current_common_search_global.sort(function (a,b){return parseFloat(a[0][rank_no])>parseFloat(b[0][rank_no])?-1:1;});
        } else {
            js_data_current_common_search_global.sort(function (a,b){return parseFloat(a[0][rank_no])<parseFloat(b[0][rank_no])?-1:1;});    
        }
    } else {  
        js_data_current_common_search_global.sort(function (a,b){return zh_sort_b(a[0],b[0],is_desc,rank_no);});
    }
    page_common();
    console.log('sort_zj_gpsp() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function lat_lon_get_zj_gpsp(){
    var result_t1=[];
    var result_t2=[];
    for (let item of js_data_current_common_search_global){
        result_t1.push(item[0][4]+','+item[0][3]);
        result_t2.push('"","","'+item[0][0]+'","","","'+item[0][3]+'","'+item[0][4]+'"');
    }

    var left_strings1='<p>';
    left_strings1=left_strings1+close_button_b('div_form_common','')+' ';        
    var right_strings1='</p>';
    
    var blstr=textarea_with_form_generate_b('textarea_lat_lon_zj_simple','height:20rem;',left_strings1,'清空,复制,发送到临时记事本,发送地址,save as txt file',right_strings1,'','','',result_t1.join('\n'));

    var left_strings2='<p>';
    var right_strings2='</p>';
    
    blstr=blstr+textarea_with_form_generate_b('textarea_lat_lon_zj_news','height:20rem;',left_strings2,'清空,复制,发送到临时记事本,发送地址,save as txt file',right_strings2,'','','',result_t2.join('\n'));
    
    var odiv=document.getElementById('div_form_common');
    odiv.innerHTML=blstr;
    odiv.scrollIntoView();
}
