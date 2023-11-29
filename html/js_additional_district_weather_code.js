function menu_more_district_weather(){
    var str_t=klmenu_hide_b('');
    
    table_th_jscm_global={'日期':'','最高气温℃':'right','最低气温℃':'right','天气':'','风向':''};
    
    var col_name_list=Object.keys(table_th_jscm_global);
    for (let blxl=0;blxl<col_name_list.length;blxl++){
        col_name_list[blxl]='<option value="'+blxl+'">'+col_name_list[blxl]+'</option>';
    }
    
    var bllink='https://m.tianqi.com/lishi/'+title_name_jscm_global.split(' ').slice(-1)[0]+'/'+today_str_b('d','').substring(0,6)+'.html';
    var blparent=menu_parent_node_b(str_t);
    var klmenu1=[
    '<a href="'+bllink+'" onclick="'+str_t+'" target=_blank>天气网</a>',        
    '<span class="span_menu"><select id="select_sort_type_jsad_dweather" style="height:2rem;">'+col_name_list.join('')+'</select> <span class="aclick" onclick="'+blparent+'sort_district_weather();">↑</span><span class="aclick" onclick="'+blparent+'sort_district_weather(true);">↓</span></span>',
    '<span class="span_menu">图形日期格式：<select id="select_flot_date_type_jsad_dweather" style="height:2rem;"><option>y</option><option>m</option><option selected>d</option></select></span>',
    '<span class="span_menu">温度选择：<select id="select_temperature_range_jsad_dweather" style="height:2rem;"><option>全部</option><option>最高温度</option><option>最低温度</option></select></span>',
    '<span class="span_menu">温度和颜色范围：<input type="text" id="input_temperature_color_range_jsad_dweather" value="-10,45,8,blue,red" style="width:10rem;" /></span>',  
    ];

    var group_list=[
    ['⚪ 折线图分年','klmenu_check_b(this.id,true);',false,'span_multi_year_lines_jsad_dweather'],
    ['⚪ 点状热力图月份补足','klmenu_check_b(this.id,true);',false,'span_zero_month_jsad_dweather'],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['格式检查','check_district_weather();',true],
    ['缺失日期温度填补','integrity_district_weather();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['折线图','flot_line_temperature_district_weather();',true],
    ['散点图','flot_line_temperature_district_weather(true);',true],
    ['温度数据导出','export_temperature_district_weather();',true],
    ['点状热力图','dots_district_weather();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'当前条件每日温度：'));
    
    klmenu1=klmenu1.concat([
    '<span class="span_menu" onclick="'+str_t+'statistics_temperature_district_weather();">当前条件温度数据统计</span>',    
    '<span class="span_menu" onclick="'+str_t+'month_average_temperature_district_weather();">当前条件月均温</span>',
    ]);
    
    var search_list=['+^(2[89]|[3-9]\\d)$'];
    var klmenu2=[];
    for (let item of search_list){
        klmenu2.push('<span class="span_menu" onclick="'+str_t+'search_common(\''+specialstr_j(item)+'\');">'+item+'</span>');
    }
    return klmenu_b(klmenu1,'🌀','30rem','1rem','1rem','30rem')+klmenu_b(klmenu2,'🔍','16rem','1rem','1rem','30rem');
}

function statistics_temperature_district_weather(){
    var ht=[];
    var lt=[];
    for (let item of js_data_current_common_search_global){
        ht.push(item[0][1]);
        lt.push(item[0][2]);
    }
    var odiv=document.getElementById('div_status_common');
    var bljg='<p>最高温度：</p><textarea>'+ht.join(',')+'</textarea><p>'+object2array_b(describe_b(ht),true)+'</p><p>最低温度：</p><textarea>'+lt.join(',')+'</textarea><p>'+object2array_b(describe_b(lt),true)+'</p>';
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
}

function file_load_district_weather(){
    flot_load_common(['date','flot','math'],['time','symbol']);
}

function export_temperature_district_weather(){
    function sub_export_temperature_district_weather_flotarr(csdict,cscaption){
        for (let key in csdict){            
            csdict[key]=['"'+key+cscaption+'"'].concat(csdict[key]);
            flot_arr.push(csdict[key].join(','));
        } 
    }
    //-----------------------
    var ht=[];
    var lt=[];
        
    var temperature_range=document.getElementById('select_temperature_range_jsad_dweather').value;
    js_data_current_common_search_global.sort(function (a,b){return a[0][0]>b[0][0];});
    if (klmenu_check_b('span_multi_year_lines_jsad_dweather',false)){
        var year_h_dict={};
        var year_l_dict={};
        for (let item of js_data_current_common_search_global){
            var bldate=item[0][0];
            var blkey=bldate.substring(0,4)+'年';
            
            if (year_h_dict[blkey]==undefined){
                year_h_dict[blkey]=[];
            }
            if (year_l_dict[blkey]==undefined){
                year_l_dict[blkey]=[];
            }
            
            year_h_dict[blkey].push('["2000'+bldate.substring(4,)+'",'+item[0][1]+']');
            year_l_dict[blkey].push('["2000'+bldate.substring(4,)+'",'+item[0][2]+']');
        }
        
        var flot_arr=[];
        if (temperature_range=='全部' || temperature_range=='最高温度'){
            sub_export_temperature_district_weather_flotarr(year_h_dict,'最高温度');
        }
        if (temperature_range=='全部' || temperature_range=='最低温度'){        
            sub_export_temperature_district_weather_flotarr(year_l_dict,'最低温度');
        }
    }
    else {
        for (let item of js_data_current_common_search_global){
            var bldate=item[0][0];
            ht.push('["'+bldate+'",'+item[0][1]+']');
            lt.push('["'+bldate+'",'+item[0][2]+']');
        }
        ht=['"最高温度"'].concat(ht);
        lt=['"最低温度"'].concat(lt);
        switch (temperature_range){
            case '全部':
                var flot_arr=[ht,lt];
                break;
            case '最高温度':
                var flot_arr=[ht];
                break;
            case '最低温度':
                var flot_arr=[lt];
                break;
        }
    }    
    
    var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';
    var odiv=document.getElementById('div_status_common');
    
    odiv.innerHTML='<textarea>'+flot_arr.join('\n')+'</textarea>'+blbutton;    
    odiv.scrollIntoView();        
}

function month_average_temperature_district_weather(only_dot=false){
    var ym_dict={};
    for (let item of js_data_current_common_search_global){
        var blkey='ym_'+item[0][0].substring(0,7);
        if (ym_dict[blkey]==undefined){
            ym_dict[blkey]=[0,0,0];
        }
        ym_dict[blkey][0]=ym_dict[blkey][0]+item[0][1];
        ym_dict[blkey][1]=ym_dict[blkey][1]+item[0][2];
        ym_dict[blkey][2]=ym_dict[blkey][2]+1;
    }
    ym_dict=object2array_b(ym_dict,true,3);
    var tr_list=['<tr><th>年月</th><th align=right>最高温度平均值℃</th><th align=right>最低温度平均值℃</th><th align=right>统计天数</th></tr>'];
    for (let blxl=0;blxl<ym_dict.length;blxl++){
        ym_dict[blxl][1]=ym_dict[blxl][1]/ym_dict[blxl][3];
        ym_dict[blxl][2]=ym_dict[blxl][2]/ym_dict[blxl][3];
        
        tr_list.push('<tr><td>'+ym_dict[blxl][0]+'</td><td align=right>'+ym_dict[blxl][1].toFixed(2)+'</td><td align=right>'+ym_dict[blxl][2].toFixed(2)+'</td><td align=right>'+ym_dict[blxl][3]+'</td></tr>');

        ym_dict[blxl][0]=ym_dict[blxl][0]+'-01';        
        ym_dict[blxl][3]='';
        ym_dict[blxl].push('');
        ym_dict[blxl]=[ym_dict[blxl],-1];
    }
    document.getElementById('divhtml').innerHTML='<table class="table_common">'+tr_list.join('\n')+'</table>';
    flot_line_temperature_district_weather(only_dot,ym_dict,'月均温');
}

function flot_line_temperature_district_weather(only_dot=false,csarr=false,legend_caption='温度'){
    function sub_flot_line_temperature_district_weather_flotarr(csdict,cscaption){
        for (let key in csdict){
            for (let blxl=0;blxl<csdict[key].length;blxl++){
                csdict[key][blxl][0].setFullYear(2000);
            }
            
            csdict[key]=[key+cscaption+line_type].concat(csdict[key]);
            flot_arr.push(csdict[key]);
        } 
    }
    //-----------------------
    var ht=[];
    var lt=[];
    
    var line_type='#points:false#';
    if (only_dot){
        line_type='#show:false#';
    }
    
    var temperature_range=document.getElementById('select_temperature_range_jsad_dweather').value;
    
    if (csarr===false){
        csarr=js_data_current_common_search_global;
    }
    csarr.sort(function (a,b){return a[0][0]>b[0][0];});
    if (klmenu_check_b('span_multi_year_lines_jsad_dweather',false)){
        var year_h_dict={};
        var year_l_dict={};
        for (let item of csarr){
            var bldate=validdate_b(item[0][0]);
            var blkey=bldate.getFullYear()+'年';
            
            if (year_h_dict[blkey]==undefined){
                year_h_dict[blkey]=[];
            }
            if (year_l_dict[blkey]==undefined){
                year_l_dict[blkey]=[];
            }            
            
            year_h_dict[blkey].push([bldate,item[0][1]]);
            year_l_dict[blkey].push([bldate,item[0][2]]);
        }
        
        var flot_arr=[];
        if (temperature_range=='全部' || temperature_range=='最高温度'){
            sub_flot_line_temperature_district_weather_flotarr(year_h_dict,'最高温度');
        }
        if (temperature_range=='全部' || temperature_range=='最低温度'){
            sub_flot_line_temperature_district_weather_flotarr(year_l_dict,'最低温度');
        }
    }
    else {
        for (let item of csarr){
            var bldate=validdate_b(item[0][0]);
            ht.push([bldate,item[0][1]]);
            lt.push([bldate,item[0][2]]);
        }
        ht=['最高'+legend_caption+line_type].concat(ht);    
        lt=['最低'+legend_caption+line_type].concat(lt);
        switch (temperature_range){
            case '全部':
                var flot_arr=[ht,lt];
                break;
            case '最高温度':
                var flot_arr=[ht];
                break;
            case '最低温度':
                var flot_arr=[lt];
                break;
        }
    }
    
    var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';
    var odiv=document.getElementById('div_status_common');

    odiv.innerHTML='<div id="div_status_common_sub" style="width:100%; height:600px;"></div>'+blbutton;
    flot_lines_b(flot_arr,'div_status_common_sub','nw',true,'',document.getElementById('select_flot_date_type_jsad_dweather').value,'',0);
    
    odiv.scrollIntoView();        
}

function integrity_district_weather(){
    var not_found_date=check_district_weather(false);
    var date_set=new Set();
    var result_t=[];
    for (let one_date of not_found_date){
        var blfound=false;
        for (let blxl=0;blxl<district_weather_global.length-1;blxl++){
            if (district_weather_global[blxl][0]<one_date &&  district_weather_global[blxl+1][0]>one_date){
                result_t=[one_date, (district_weather_global[blxl][1]+district_weather_global[blxl+1][1])/2, (district_weather_global[blxl][2]+district_weather_global[blxl+1][2])/2, '', ''];
                
                date_set.add(district_weather_global[blxl][0]);
                date_set.add(one_date);
                date_set.add(district_weather_global[blxl+1][0]);

                blfound=true;
                break;
            }
        }
        if (blfound){
            district_weather_global.push(result_t);
            district_weather_global.sort();        
        }
    }
    
    if (date_set.size==0){return;}
    search_common(Array.from(date_set).join(' '));
}

function sort_district_weather(csdesc=false){   
    var blno=parseInt(document.getElementById('select_sort_type_jsad_dweather').value);
    if (csdesc){
        district_weather_global.sort(function (a,b){return a[blno]<b[blno];});        
    }
    else {
        district_weather_global.sort(function (a,b){return a[blno]>b[blno];});                
    }
    search_common();
}

function check_district_weather(show_html=true){
    js_data_current_common_search_global=[];
    
    if (district_weather_global.length==0){return;}
    district_weather_global.sort();

    var date_set=new Set();
    for (let blxl=0;blxl<district_weather_global.length;blxl++){
        var arow=district_weather_global[blxl];
        var error='';

        var bldate=arow[0];
        
        if (date_set.has(bldate)){
            error=error+'日期重复：';        
        }
        date_set.add(bldate);

        bldate=validdate_b(bldate);

        if (bldate==false){
            error=error+'日期格式错误：';
        }
                
        if (arow[1]<arow[2]){
            error=error+'最高温<最低温：';        
        }
        
        if (error!==''){
            var result_t=[].concat(arow);
            result_t[0]=error+result_t[0];
            js_data_current_common_search_global.push([result_t,blxl+1]);
        }
    }
    
    var date_min=district_weather_global[0][0];
    var date_max=district_weather_global.slice(-1)[0][0];
    var days=days_between_two_dates_b(date_min,date_max)+1;
    var error='';
    if (days!==district_weather_global.length){
        var error='日期天数不一致（'+date_min+'-'+date_max+'-'+days+' vs '+district_weather_global.length+'）：';
    }
    
    var not_found_date=[];
    for (let blxl=0;blxl<days;blxl++){
        var blnext=next_day_b(date_min,blxl);
        if (date_set.has(blnext)){continue;}
        not_found_date.push(blnext);
    }

    if (not_found_date.length>0){
        error=error+'缺少日期（'+not_found_date.length+': '+not_found_date.join(' ')+'）：'
    }
    
    if (error!==''){
        var arow=district_weather_global[district_weather_global.length-1];
        var result_t=[].concat(arow);
        result_t[0]=error+result_t[0];
        js_data_current_common_search_global.push([result_t,district_weather_global.length]);    
    }
    
    if (show_html){
        page_common(1);
    }
    return not_found_date;
}

function dots_district_weather(){
    function sub_dots_district_weather_zero_month(){
        if (!klmenu_check_b('span_zero_month_jsad_dweather',false)){return;}
        ym_set=Array.from(ym_set);
        ym_set.sort();
        var ym_min=ym_set[0];
        if (ym_min.slice(-2,)!=='01'){
            ym_min=ym_min.substring(0,5)+'01';
        }
        var ym_max=ym_set[ym_set.length-1];
        var ym_str=ym_min;
        while (true){
            if (ht[ym_str]==undefined){
                ht[ym_str]=[];
            }
            if (lt[ym_str]==undefined){
                lt[ym_str]=[];
            }
            ym_str=next_month_b(ym_str);
            if (ym_str=='' || ym_str>ym_max){break;}
        }    
    }
    
    function sub_dots_district_weather_one_dict(csdict){
        var result_t=[];
        for (let key in csdict){
            var blyear=parseInt(key.substring(0,4));
            var blmonth=parseInt(key.slice(-2,))-1;
            var all_date_list=year365_b(blyear, false,[blmonth]);
            var simple_date_list=[];
            for (let one_date of csdict[key]){
                simple_date_list.push(one_date[0]);
            }
            
            var difference=array_difference_b(all_date_list,simple_date_list);
            for (let one_diff of difference){
                csdict[key].push([one_diff,null]);
            }
            csdict[key].sort();
            
            var bljg=[];
            for (let item of csdict[key]){
                if (item[1]==null){
                    bljg.push('<span title="'+item[0]+'">◌</span>');
                }
                else {
                    var blcolor=value_in_color_range_b(item[1],color_list,min_value,false); //max_value - 保留注释
                    bljg.push('<span style="color:'+blcolor+';" title="'+item[0]+' '+item[1]+'">●</span>');
                }
            }
            
            result_t.push(blyear+'年'+(blmonth+1<10?'0':'')+(blmonth+1)+'月 '+bljg.join(''));
        }
        result_t.sort();
        return result_t;
    }
    //-----------------------
    var temperature_range=document.getElementById('select_temperature_range_jsad_dweather').value;
    var ht={};
    var lt={};
    var ym_set=new Set();
    for (let item of js_data_current_common_search_global){
        var bldate=item[0][0];
        var blkey=item[0][0].substring(0,7);    //年月 - 保留注释
        if (ht[blkey]==undefined){
            ht[blkey]=[];
        }
        ht[blkey].push([bldate,item[0][1]]);

        if (lt[blkey]==undefined){
            lt[blkey]=[];
        }
        lt[blkey].push([bldate,item[0][2]]);
        
        ym_set.add(blkey);
    }
    
    if (ym_set.size==0){return;}
    sub_dots_district_weather_zero_month();
    
    var h_dots='';
    var l_dots='';
    
    var temperature_color_str=document.getElementById('input_temperature_color_range_jsad_dweather').value.trim();
    var temperature_color_list=temperature_color_str.split(',');
    if (temperature_color_list.length!==5){
        alert('需要5个元素');
        return;
    }
    var min_value,max_value,color_range,color1,color2;
    [min_value,max_value,color_range,color1,color2]=array_batch_value_get_b(temperature_color_list,[[-10,'int'],[40,'int'],[8,'int'],['green','str'],['red','str']]);
    
    var color_list=[];
    if (color1!==color2){
        color_range=Math.round(color_range/2);
        color_list=color_with_different_light_b(color1,color_range);
        color_list.reverse();
    }
    color_list=color_list.concat(color_with_different_light_b(color2,color_range));
    
    var legend=[];
 
    [color_list,legend]=color_range_with_value_range_b(color_list,min_value,max_value);
    
    if (temperature_range=='全部' || temperature_range=='最高温度'){
        h_dots='<h3>最高温度</h3><p>'+sub_dots_district_weather_one_dict(ht).join('</p><p>')+'</p>';
    }
    if (temperature_range=='全部' || temperature_range=='最低温度'){
        l_dots='<h3>最低温度</h3><p>'+sub_dots_district_weather_one_dict(lt).join('</p><p>')+'</p>';
    }

    var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';    
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML='<table><tr><td style="padding:1rem;">'+h_dots+l_dots+'<p>'+legend.join(' ')+'</p></td></tr></table>'+blbutton;  //table 截图用 - 保留注释
    odiv.scrollIntoView();
}
