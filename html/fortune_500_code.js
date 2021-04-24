function recent_search_key_fortune_500(csstr=''){
    recent_search_b('recent_search_fortune_500',csstr,'search_fortune_500','div_recent_search',['阿里巴巴','美国',(new Date().getFullYear()-1)+'年']);
}

function search_fortune_500(cskey,csreg,show_html){
	var csnum=arguments.length;
	if (csnum==0){
        var cskey= document.getElementById('input_search').value.trim();
    }
    
	if (csnum<=1){
        var csreg=document.getElementById('input_reg').checked;
    }
	if (csnum<=2){
        var show_html=true;
    }
        
    if (cskey.slice(-4,)=='(:r)'){
        csreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    if (cskey==''){
        cskey=(new Date().getFullYear()-1)+'年';
    }
    if (show_html){
	    document.getElementById('input_search').value=cskey;    
	    document.getElementById('input_reg').checked=csreg;
        recent_search_key_fortune_500(cskey+(csreg?'(:r)':''));
    }
    
    var blsum=0;
    [search_result_fortune_500_global,blsum]=search_rank_b(fortune_500_raw_global,cskey,csreg,1,4,5);

    if (show_html){
        array_2_html_fortune_500(search_result_fortune_500_global,blsum);
    }
}

function pie_multiyear_district_statistics_fortune_500(csindex=1){
    var years=year_district_list_fortune_500()[0];
    if (years.length==0){return;}
    var result_t=[];
    for (let item of years){
        search_fortune_500(item,false,false);
        result_t.push([item,pie_district_statistics_fortune_500(false,csindex)]);
    }
    
    document.getElementById('divhtml').innerHTML='';
    var odiv=div_flot_css_fortune_500(true,true);
    odiv.innerHTML='';
    
    for (let one_year_data of result_t){
        var list_t=[];
        for (let item of one_year_data[1]){
            list_t.push({'label': item[0],'data': item[1]});
        }
        var blid='div_flot_fortune_500'+one_year_data[0].substring(0,4);
        odiv.insertAdjacentHTML('beforeend','<div style="position:relative;float:left;margin:0.5rem;"><div id="'+blid+'" style="width:300px; height:300px;"></div><p align=center>'+one_year_data[0]+'</p></div>\n');
        flot_pie_k(list_t,blid);
    }
    search_result_fortune_500_global=[];
    document.getElementById('input_search').value='';
}

function div_flot_css_fortune_500(csshow=true,fullscreen=false){
    return div_flot_css_rank_b('div_flot_fortune_500',csshow,fullscreen);
}

function pie_district_statistics_fortune_500(show_chart=true,csindex=1){
    var fraction_len=1;
    var list_t=pie_district_statistics_array_rank_b(search_result_fortune_500_global,3,csindex);

    if (!show_chart){
        return list_t;
    }
    
    var bljg=[];
    [list_t,bljg]=pie_district_statistics_string_rank_b(list_t,fraction_len,'百万美元',1,csindex);
    
    var div_id='div_district_revenue_pie_data_fortune_500';
    var odiv=document.getElementById(div_id);
    if (!odiv){
        document.getElementById('divhtml').insertAdjacentHTML('beforeend','<div id="'+div_id+'" style="column-count:3;"></div>');
    }
    document.getElementById(div_id).innerHTML=array_2_li_b(bljg);
    div_flot_css_fortune_500(true,false);
    flot_pie_k(list_t,'div_flot_fortune_500');
}

function line_district_revenue_fortune_500(return_percent=false){
    var fraction_len=1;

    var flot_array=line_district_revenue_rank_b(search_result_fortune_500_global,3,5,1,1);

    div_flot_css_fortune_500(true,false);    

    if (return_percent){
        var bljg=line_district_revenue_percent_rank_b(flot_array,fraction_len,1,'Revenue(百万美元)');
        document.getElementById('div_flot_fortune_500').innerHTML='<table class="table_fortune_500" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
        return;
    }

    flot_lines_k(object2array_b(flot_array),'div_flot_fortune_500','nw',false,'','m','百万美元',-1,[],-1,false,false,true);
}

function company_rate_fortune_500(){
    var bljg=company_rate_rank_b(search_result_fortune_500_global,3,5,1,1);

    div_flot_css_fortune_500(true,false);    
    document.getElementById('div_flot_fortune_500').innerHTML='<table class="table_fortune_500" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
}

function line_company_revenue_fortune_500(){
    var list_t=line_company_revenue_rank_b(search_result_fortune_500_global,5,1,1);
    
    div_flot_css_fortune_500(true,false);    
    flot_lines_k(list_t,'div_flot_fortune_500','nw',false,'','m','百万美元',-1,[],-1,false,false,true);
}

function one_td_fortune_500(item,csno,fraction_len){
    if (item[2]=='' || isNaN(item[2])){
        console.log(item);
    }
    return '<tr><td class="td_no" align=right>'+csno+'</td><td>'+item[0]+'</td><td class="td_district">'+item[3]+'</td><td class="td_revenue" align=right>'+item[1].toFixed(fraction_len)+'</td><td class="td_interest" align=right>'+((item[2]=='' || isNaN(item[2]))?'':item[2].toFixed(fraction_len))+'</td><td class="td_rank" align=right>'+item[4]+'</td><td class="td_year">'+item[5]+'</td></tr>';
}

function array_2_html_fortune_500(csarray,cssum=false,table_id='table_fortune_500',only_tr=false,show_button=true,show_html=true){
    var bljg=[];
    
    var fraction_len=1;

    var blaverage=(cssum===false?false:(cssum/csarray.length).toFixed(fraction_len));
    var average_count=0;
    
    for (let blxl=0;blxl<csarray.length;blxl++){
        var item=csarray[blxl];
        if (cssum!==false && item[1]>=blaverage){
            average_count=average_count+1;
        }
        bljg.push(one_td_fortune_500(item,blxl+1,fraction_len));
    }
    
    if (show_html){
        document.getElementById('divhtml').innerHTML='';
        div_flot_css_fortune_500(false,false);
    }
    if (bljg.length==0){
        return '';
    }
    
    var blhead='<tr><th class="td_no">No.</th><th>Company</th><th class="td_district">Country</th><th class="td_revenue">营收(百万美元)</th><th class="td_interest">利润(百万美元)</th><th class="td_rank">当年名次</th><th class="td_year">Year</th></tr>\n';
    if (only_tr){
        bljg=blhead+bljg.join('\n');
    }
    else {
        bljg='<table'+(table_id==''?'':' id="'+table_id+'"')+' class="table_fortune_500" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
    }
    if (show_button){
        bljg=bljg+'<p>'+table_buttons_rank_b('table_fortune_500')+'</p>';
        bljg=bljg+'<p>';
        bljg=bljg+'<select onchange="javascript:flot_type_fortune_500(this.value);" style="height:2rem;">';
        for (let item of ['','企业收入折线图','企业多年平均增长率','地区收入折线图','地区多年平均增长率','地区收入饼图','地区企业家数饼图']){
            bljg=bljg+'<option>'+item+'</option>\n';
        }
        bljg=bljg+'</select>';
        bljg=bljg+'</p>\n';
        if (cssum!==false){  
            bljg=bljg+'<p>总收入：'+cssum.toFixed(fraction_len)+'百万美元；平均收入：'+blaverage+'百万美元；在平均线上的企业共有 '+average_count+' 家，占 '+(average_count*100/csarray.length).toFixed(2)+' %</p>\n';
        }
    }
    if (show_html){
        document.getElementById('divhtml').innerHTML=bljg;
    }
    return bljg;
}

function flot_type_fortune_500(cstype){
    switch (cstype){
        case '企业收入折线图':
            line_company_revenue_fortune_500();
            break;
        case '企业多年平均增长率':
            company_rate_fortune_500();
            break;
        case '地区收入折线图':
            line_district_revenue_fortune_500();
            break;
        case '地区多年平均增长率':
            line_district_revenue_fortune_500(true);
            break;            
        case '地区收入饼图':
            pie_district_statistics_fortune_500();
            break;
        case '地区企业家数饼图':
            pie_district_statistics_fortune_500(true,-1);
            break;
    }
    document.getElementById('div_flot_fortune_500').scrollIntoView();
}

function array_2_csv_fortune_500(){
    var bljg=[];
    
    var fraction_len=1;
    
    for (let blxl=0;blxl<search_result_fortune_500_global.length;blxl++){
        var item=search_result_fortune_500_global[blxl];
        bljg.push((blxl+1)+',"'+specialstr_j(item[0])+'",'+item[1].toFixed(fraction_len)+','+item[2].toFixed(fraction_len)+',"'+specialstr_j(item[3])+'",'+item[4]+',"'+item[5]+'"');
    }

    if (bljg.length==0){return;}

    var blhead='"No.","Company","Revenue(百万美元)","Interest(百万美元)","Country","当年名次","Year"\n';        
    string_2_txt_file_b(blhead+bljg.join('\n'),'fortune_500_export_'+now_time_str_b("-",true)+'.csv','csv');
}

function line_district_statistics_fortune_500(is_percent=false,csindex=1){
    var cskey= document.getElementById('input_search').value.trim();
    var csreg=document.getElementById('input_reg').checked;
    if (cskey.slice(-4,)=='(:r)'){
        csreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }

    var flot_revenue_data=line_district_statistics_flot_array_rank_b(fortune_500_raw_global,cskey,csreg,3,5,csindex,1);
    
    if (flot_revenue_data.length==0){
        alert('无符合条件 '+cskey+' 的记录，仅支持城市筛选，不支持年份筛选');
        return;
    }

    var odiv=div_flot_css_fortune_500(true,false);
    
    if (is_percent){
        flot_lines_k(line_district_statistics_percent_rank_b(flot_revenue_data),'div_flot_fortune_500','nw',false,'','m','%',-1,[],-1,false,false,true);
    }
    else {
        flot_lines_k(flot_revenue_data,'div_flot_fortune_500','nw',false,'','m',(csindex==-1?'家':'百万美元'),-1,[],-1,false,false,true);
    }

    odiv.scrollIntoView();
}

function year_district_list_fortune_500(is_all=true){
    return year_district_list_rank_b(fortune_500_raw_global,5,3,is_all);
}

function group_fortune_500(){
    var group_district=klmenu_check_b('span_group_district_fortune_500',false);
    var group_year=klmenu_check_b('span_group_year_fortune_500',false);
    if (group_district==false && group_year==false){return;}
    
    var result_t=group_rank_b(search_result_fortune_500_global,group_district,group_year,3,5);
    var bljg=[];
    for (let key in result_t){
        bljg.push(array_2_html_fortune_500(result_t[key],false,'',true,false,false));
    }

    div_flot_css_fortune_500(false,false);    
    document.getElementById('divhtml').innerHTML='<table class="table_fortune_500" cellpadding=0 cellspacing=0>'+bljg.join('\n')+'</table>\n';
}

function menu_fortune_500(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="http://www.fortunechina.com/" target=_blank>Fortune</a>',    

    '<span class="span_menu" onclick="javascript:'+str_t+'array_2_csv_fortune_500();">导出当前结果为csv</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_fortune_500();">地区收入图</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_fortune_500(true);">地区收入比例图</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_fortune_500(false,-1);">地区企业家数图</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_fortune_500(true,-1);">地区企业家数比例图</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'pie_multiyear_district_statistics_fortune_500();">多年地区收入饼图</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'pie_multiyear_district_statistics_fortune_500(-1);">多年地区企业家数饼图</span>',     
    ];

    var menu_years;
    var menu_district;
    [menu_years,menu_district]=year_district_list_fortune_500();
    menu_years.reverse();
    
    for (let blxl=0;blxl<menu_years.length;blxl++){
        menu_years[blxl]='<span class="span_menu" onclick="javascript:'+str_t+'search_fortune_500(\''+menu_years[blxl]+'\',false);">'+menu_years[blxl]+'</span>';   
    }

    for (let blxl=0;blxl<menu_district.length;blxl++){
        menu_district[blxl]='<span class="span_menu" onclick="javascript:'+str_t+'search_fortune_500(\''+menu_district[blxl]+'\',false);">'+menu_district[blxl]+'</span>';   
    }
    
    var menu_group=[
    '<span id="span_group_district_fortune_500" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id,true);">⚪ 按地区分组</span>',    
    '<span id="span_group_year_fortune_500" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id,true);">⚪ 按年份分组</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'group_fortune_500();">执行分组</span>',     
    ];
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏭','14rem','1rem','1rem','60rem')+klmenu_b(menu_years,'年','7rem','1rem','1rem','30rem')+klmenu_b(menu_district,'国','12rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','10rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function init_zjcompany(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    fortune_500_raw_global=obj2array_rank_b(fortune_500_raw_global,1);
    recent_search_key_fortune_500();
    menu_fortune_500();
}
