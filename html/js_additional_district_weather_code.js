function menu_more_district_weather(){
    var str_t=klmenu_hide_b('');
    
    table_th_jscm_global={'日期':'','最高气温℃':'right','最低气温℃':'right','天气':'','风向':''};
    
    var col_name_list=Object.keys(table_th_jscm_global);
    for (let blxl=0;blxl<col_name_list.length;blxl++){
        col_name_list[blxl]='<option value="'+blxl+'">'+col_name_list[blxl]+'</option>';
    }
    
    var blparent=menu_parent_node_b(str_t);
    var klmenu1=[
    '<span class="span_menu"><select id="select_sort_type_jsad_dweather" style="height:2rem;">'+col_name_list.join('')+'</select> <span class="aclick" onclick="'+blparent+'sort_district_weather();">↑</span><span class="aclick" onclick="'+blparent+'sort_district_weather(true);">↓</span></span>',

    '<span class="span_menu" onclick="'+str_t+'check_district_weather();">格式检查</span>',   

    ];
    return klmenu_b(klmenu1,'🌀','16rem','1rem','1rem','30rem');
}

function file_load_district_weather(){
    flot_load_common(['date','flot'],['time','symbol']);
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

function check_district_weather(){
    js_data_current_common_search_global=[];
    js_data_current_common_search_global.sort();
    
    var old_date=false;
    for (let blxl=0;blxl<district_weather_global.length;blxl++){
        var arow=district_weather_global[blxl];
        var error='';
        var bldate=validdate_b(arow[0]);
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
    page_common(1);
}

