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
    '<span id="span_multi_year_lines_jsad_dweather" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 分年</span>',        
    '<span class="span_menu" onclick="'+str_t+'check_district_weather();">格式检查</span>',   
    '<span class="span_menu" onclick="'+str_t+'integrity_district_weather();">缺失日期温度填补</span>',   
    ];
    
    var group_list=[
    ['折线图','flot_line_temperature_district_weather();',true],
    ['散点图','flot_line_temperature_district_weather(true);',true],
    ['温度数据导出','export_temperature_district_weather();',true],
    ['点状热力图','dots_district_weather();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'当前条件温度'));
    
    var search_list=['+^(2[89]|[3-9]\\d)$'];
    var klmenu2=[];
    for (let item of search_list){
        klmenu2.push('<span class="span_menu" onclick="'+str_t+'search_common(\''+specialstr_j(item)+'\');">'+item+'</span>');
    }
    return klmenu_b(klmenu1,'🌀','27rem','1rem','1rem','30rem')+klmenu_b(klmenu2,'🔍','16rem','1rem','1rem','30rem');
}

function file_load_district_weather(){
    flot_load_common(['date','flot'],['time','symbol']);
}

function export_temperature_district_weather(){
    function sub_export_temperature_district_weather_flotarr(csdict,cscaption){
        for (let key in csdict){            
            csdict[key]=['"'+key+cscaption+'"'].concat(csdict[key]);
            flot_arr.push(csdict[key].join(','));
        } 
    }
    //-----------------
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

function flot_line_temperature_district_weather(only_dot=false){
    function sub_flot_line_temperature_district_weather_flotarr(csdict,cscaption){
        for (let key in csdict){
            for (let blxl=0;blxl<csdict[key].length;blxl++){
                csdict[key][blxl][0].setFullYear(2000);
            }
            
            csdict[key]=[key+cscaption+line_type].concat(csdict[key]);
            flot_arr.push(csdict[key]);
        } 
    }
    //-----------------
    var ht=[];
    var lt=[];
    
    var line_type='#points:false#';
    if (only_dot){
        line_type='#show:false#';
    }
    
    var temperature_range=document.getElementById('select_temperature_range_jsad_dweather').value;
    js_data_current_common_search_global.sort(function (a,b){return a[0][0]>b[0][0];});
    if (klmenu_check_b('span_multi_year_lines_jsad_dweather',false)){
        var year_h_dict={};
        var year_l_dict={};
        for (let item of js_data_current_common_search_global){
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
        for (let item of js_data_current_common_search_global){
            var bldate=validdate_b(item[0][0]);
            ht.push([bldate,item[0][1]]);
            lt.push([bldate,item[0][2]]);
        }
        ht=['最高温度'+line_type].concat(ht);    
        lt=['最低温度'+line_type].concat(lt);
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
        error=error+'缺少日期（'+not_found_date.join(' ')+'）：'
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
                    var blcolor=value_in_color_range_b(item[1],color_range,min_value,max_value);
                    bljg.push('<span style="color:'+blcolor+';" title="'+item[0]+' '+item[1]+'">●</span>');
                }
            }
            
            result_t.push(blyear+'年'+(blmonth+1)+'月 '+bljg.join(''));
        }
        return result_t;
    }
    //--------------------------
    var temperature_range=document.getElementById('select_temperature_range_jsad_dweather').value;
    var ht={};
    var lt={};
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
    }

    var h_dots='';
    var l_dots='';
    
    var color_range=color_with_different_light_b('blue',8);
    color_range.reverse();
    color_range=color_range.concat(color_with_different_light_b('red',8));
    
    var min_value=-10;
    var max_value=40;
    var legend=[];
 
    [color_range,legend]=color_range_with_value_range_b(color_range,min_value,max_value);
    
    if (temperature_range=='全部' || temperature_range=='最高温度'){
        h_dots='<h3>最高温度</h3><p>'+sub_dots_district_weather_one_dict(ht).join('</p><p>')+'</p>';
    }
    if (temperature_range=='全部' || temperature_range=='最低温度'){
        l_dots='<h3>最低温度</h3><p>'+sub_dots_district_weather_one_dict(lt).join('</p><p>')+'</p>';
    }

    var blbutton='<p>'+close_button_b('div_status_common','','aclick')+'</p>';    
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML=h_dots+l_dots+'<p>'+legend.join(' ')+'</p>'+blbutton;
    odiv.scrollIntoView();
}
