function file_load_shopping(){
    flot_load_common(['flot'],['pie','symbol']);
}

function menu_more_shopping(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'number_occurrence_shopping();">当前条件首位数字占比</span>',    
    '<span class="span_menu" onclick="'+str_t+'number_occurrence_shopping(false,false,1);">当前条件第2位数字占比</span>',    
    '<span class="span_menu" onclick="'+str_t+'number_occurrence_shopping(true);">当前条件末位数字占比</span>',    
    '<span class="span_menu" onclick="'+str_t+'number_occurrence_shopping(true,true);">当前条件末位数字占比（移除小数部分）</span>',    

    ];
    return klmenu_b(klmenu1,'🪙','20rem','1rem','1rem','30rem');    
}

function number_occurrence_shopping(is_last=false,remove_dot=false,start_col=0){
    var col_no=0;
    switch (title_name_jscm_global){
        case '京东到家':
            col_no=1;
            break;
    }
    
    var result_t={};
    var scatter_list=[];
    var log_list=[];
    for (let item of js_data_current_common_search_global){
        var price=(item[0][col_no].match(/[0-9\.]+/) || [''])[0];
        if (is_last){
            if (remove_dot){
                blvalue=price.split('.')[0];
            } else {
                blvalue=price;
            }
            blvalue=blvalue.slice(-1);
        } else {
            blvalue=price.slice(start_col,start_col+1);
        }

        scatter_list.push([parseFloat(price),0]);
        log_list.push([Math.log(parseFloat(price)),1]);
        var blkey='v_'+blvalue;
        if (result_t[blkey]==undefined){
            result_t[blkey]=0;
        }
        result_t[blkey]=result_t[blkey]+1;
    }
    
    result_t=object2array_b(result_t,true,2);
    result_t.sort(function (a,b){return a[0]<b[0]?-1:1;});  //由少到多 - 保留注释
    
    var pie_list=[];
    for (let item of result_t){
        pie_list.push({'label':item[0],'data':item[1]});
    }

    var odiv=document.getElementById('div_status_common');
    var blbutton=close_button_b('div_status_common','','aclick');
    var flot_dom='<div id="div_status_common_sub_line" style="width:100%; height:600px;"></div>';
    flot_dom=flot_dom+'<div id="div_status_common_sub_pie" style="width:100%; height:600px;"></div>';
    flot_dom=flot_dom+'<div id="div_status_common_sub_scatter1" style="width:100%; height:200px;"></div>';
    flot_dom=flot_dom+'<div id="div_status_common_sub_scatter2" style="width:100%; height:200px;"></div>';

    odiv.innerHTML=flot_dom+'<p>'+blbutton+'</p>';
    odiv.scrollIntoView();
    //flot_lines_b([['数字出现次数#points:false#'].concat(result_t)],'div_status_common_sub_line','se',false);    //此行保留 - 保留注释    

    $.plot('#div_status_common_sub_line', [ result_t ], {
        series: {
            bars: {show: true, barWidth: 0.6, align: 'center'},
            label: title_name_jscm_global+' '+js_data_current_common_search_global.length+' 件物品单价'+(is_last?'末尾':'第 '+(start_col+1)+' 个')+'数字出现次数'+(remove_dot?'(忽略小数部分)':''),
        },
        xaxis: {mode: 'categories', tickLength: 0,'tickDecimals': 0},
    });    

    const dataSeries1 = {
        label: '原始值分布', data: scatter_list,
        points: { show: true, radius: 5, symbol: 'circle' },
    };

    const dataSeries2 = {
        label: 'log分布', data: log_list,
        points: { show: true, radius: 5, symbol: 'triangle' }, color: 'blue',
    };

    $.plot('#div_status_common_sub_scatter1', [dataSeries1], { xaxis: { mode: null, tickDecimals: 0}, yaxis: {show: false,} });
    $.plot('#div_status_common_sub_scatter2', [dataSeries2], { xaxis: { mode: null, tickDecimals: 0}, yaxis: {show: false,} });

    flot_pie_b(pie_list,'div_status_common_sub_pie');
}
