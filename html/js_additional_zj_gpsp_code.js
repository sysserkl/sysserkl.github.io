function menu_more_zj_gpsp(){
    table_th_jscm_global={'名称':'','大类':'','中类':'','经度':'','纬度':'','区域':''};

    var str_t=klmenu_hide_b('');

    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'lat_lon_get_zj_gpsp();">获取当前结果坐标</span>',    
    ];

    return klmenu_b(klmenu1,'🌏','12rem','1rem','1rem','30rem');
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
