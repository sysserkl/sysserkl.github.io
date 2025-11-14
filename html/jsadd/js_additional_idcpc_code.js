function file_load_idcpc(){
    flot_load_common(['date','flot'],['time','symbol']);
}

function col_rearrange_idcpc(){
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        var new_row=['<a href="https://www.idcpc.org.cn/bzhd/wshd/'+arow[0][0]+'" target=_blank>'+arow[0][1]+'</a>',arow[0][2]];
        
        list_t.push([new_row,arow[1]]);
    }
    return list_t;
}

function menu_more_idcpc(){
    table_th_jscm_global={'事项':'','日期':''};

    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a onclick="'+str_t+'" href="https://www.idcpc.org.cn/bzhd/wshd/index.html" target=_blank>中共中央对外联络部</a>',
    '<span class="span_menu" onclick="'+str_t+'statistics_idcpc();">当前条件新闻条数按日统计</span>',    
    '<span class="span_menu" onclick="'+str_t+'zero_days_rank_idcpc();">空白期排行</span>',    

    ];
    return klmenu_b(klmenu1,'🇨🇳','17rem','1rem','1rem','30rem');    
}

function zero_days_rank_idcpc(){
    function sub_zero_days_rank_idcpc_slice(csarr){
        let bllen=csarr.length;
        if (bllen==1){
            csarr.push(csarr[0]);
        }
        return [date2str_b('-',csarr[0][0])+'～'+date2str_b('-',csarr[csarr.length-1][0]),bllen];
    }
    
    var date_dict=statistics_idcpc(true,true)[0];
    var result_t=[];
    
    var blspan=[];
    for (let arow of date_dict){
        if (arow[1]==0){
            blspan.push(arow);
        } else {
            if (blspan.length>0){
                result_t.push(sub_zero_days_rank_idcpc_slice(blspan));
            }
            blspan=[];
        }
    }
    if (blspan.length>0){
        result_t.push(sub_zero_days_rank_idcpc_slice(blspan));
    }
    
    result_t.sort();
    result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});
    var blbutton=close_button_b('div_status_common','','aclick');
    var odiv=document.getElementById('div_status_common');
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]='<tr><td>'+result_t[blxl][0]+'</td><td align=right>'+result_t[blxl][1]+'</td></tr>';
    }
    odiv.innerHTML='<table class="table_common"><tr><th colspan=2>中联部  部长活动 外事会见 神隐记录</th></tr><tr><th>时间段</th><th>神隐天数</th></tr>'+result_t.join('\n')+'</table><p>'+blbutton+'</p>';
    odiv.scrollIntoView();
}

function statistics_idcpc(only_date=false,date_add_zero=false,month_add_zero=true){
    var caption='中联部  部长活动 外事会见 '+document.getElementById('input_search').value;
    var date_dict={};
    var month_dict={};
    for (let arow of js_data_current_common_search_global){
        let blkey='d_'+arow[0][1];
        if (date_dict[blkey]==undefined){
            date_dict[blkey]=0;
        }
        date_dict[blkey]=date_dict[blkey]+1;
        
        blkey='m_'+arow[0][1].split('-').slice(0,2).join('-')+'-01';
        if (month_dict[blkey]==undefined){
            month_dict[blkey]=0;
        }
        month_dict[blkey]=month_dict[blkey]+1;
    }
    
    //let blkey='d_'+date2str_b();
    //if (date_dict[blkey]==undefined){
        //date_dict[blkey]=0;
    //}
    
    date_dict=object2array_b(date_dict,true,2);
    for (let blxl=0,lent=date_dict.length;blxl<lent;blxl++){
        date_dict[blxl][0]=validdate_b(date_dict[blxl][0]);
    }

    date_dict.sort(function (a,b){return a[0]>b[0]?-1:1;});
    if (date_add_zero){
        date_dict=date_list_insert_zero_b(date_dict);
    }
    
    month_dict=object2array_b(month_dict,true,2);
    for (let blxl=0,lent=month_dict.length;blxl<lent;blxl++){
        month_dict[blxl][0]=validdate_b(month_dict[blxl][0]);
    }
    month_dict.sort(function (a,b){return a[0]>b[0]?-1:1;});
    if (month_add_zero){
        month_dict=date_list_insert_zero_b(month_dict,false,false,[],['01']);
    }
    
    if (only_date){
        return [date_dict,month_dict];
    }
    
    date_dict=[caption+' 逐日新闻条数#show:false#'].concat(date_dict);
    month_dict=[caption+' 逐月新闻条数'].concat(month_dict);
   
    var blbutton=close_button_b('div_status_common','','aclick');
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML='<div id="div_status_common_date" style="width:100%;height:600px;"></div><div id="div_status_common_month" style="width:100%;height:600px;"></div><p>'+blbutton+'</p>';
    flot_lines_b([date_dict],'div_status_common_date','nw',true);
    flot_lines_b([month_dict],'div_status_common_month','nw',true);

    odiv.scrollIntoView();
}

