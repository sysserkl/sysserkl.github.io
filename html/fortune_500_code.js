function recent_search_key_fortune_500(csstr=''){
    recent_search_b('recent_search_fortune_500',csstr,'search_fortune_500','div_recent_search',['阿里巴巴','美国',(new Date().getFullYear()-1)+'年']);
}

function search_fortune_500(cskey=false,csreg=-1,show_html=true){    
    [cskey,csreg]=keys_rank_b(cskey,csreg,show_html);
    
    if (show_html){
        recent_search_key_fortune_500(cskey+(csreg?'(:r)':''));
    }
    
    var blsum=0;
    var sort_type=parseInt(document.getElementById('select_sort_type_fortune_500').value);
    
    if (sort_type==1){ //按收入排序 - 保留注释
        var profit_index=-1;
        var rank_index=4;   
    } else {
        var profit_index=sort_type;
        var rank_index=-1;
    }
    
    if (klmenu_check_b('span_sort_by_year_fortune_500',false)){
        var year_index=5;
    } else {
        var year_index=-1;
    }
    
    [search_result_fortune_500_global,blsum]=search_rank_b(fortune_500_raw_global,cskey,csreg,1,rank_index,year_index,profit_index,klmenu_check_b('span_sort_reverse_fortune_500',false));
    if (klmenu_check_b('span_simple_name_fortune_500',false)){
        search_result_fortune_500_global=simple_name_rank_b(cskey,search_result_fortune_500_global,0);
    }
    
    search_result_fortune_500_global=group_district_replace_fortune_500(search_result_fortune_500_global);

    if (show_html){
        array_2_html_fortune_500(search_result_fortune_500_global,blsum);
    }
}

function pie_multiyear_district_statistics_fortune_500(csindex=1){
    var years=year_district_list_fortune_500()[0];
    if (years.length==0){return;}
       
    var cskey;
    var csreg;
    [cskey,csreg]=keys_rank_b(false,-1,false);    
    
    var result_t=[];
    for (let item of years){
		var blfound=str_reg_search_b(item,cskey,csreg);
		if (blfound==-1){break;}

		if (cskey=='' || blfound){        
            search_fortune_500(item,false,false);
            result_t.push([item,pie_district_statistics_fortune_500(false,csindex)]);
        }
    }
    
    document.getElementById('divhtml').innerHTML='';
    var odiv=div_flot_css_fortune_500(true,true);
    odiv.innerHTML='<h3 id="h3_multi_year_pi" style="cursor:pointer;" ondblclick="popup_show_hide_b(\'div_buttons\');">多年地区'+['企业家数','','收入','利润'][csindex+1]+'饼图</h3>';
    
    for (let one_year_data of result_t){
        var list_t=[];
        for (let item of one_year_data[1]){
            list_t.push({'label': item[0],'data': item[1]});
        }
        var blid='div_flot_fortune_500'+one_year_data[0].substring(0,4);
        odiv.insertAdjacentHTML('beforeend','<div style="position:relative;float:left;margin:0.5rem;"><div id="'+blid+'" style="width:300px; height:300px;"></div><p align=center>'+one_year_data[0]+'</p></div>\n');
        flot_pie_b(list_t,blid);
    }
    search_result_fortune_500_global=[];
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
    flot_pie_b(list_t,'div_flot_fortune_500');
}

function line_district_profit_percent_fortune_500(){
    var fraction_len=1;

    var flot_array=line_district_revenue_rank_b(search_result_fortune_500_global,3,5,[1,2],1);
    div_flot_css_fortune_500(true,false);    
    flot_array=object2array_b(flot_array);
    for (let one_district=0,lent=flot_array.length;one_district<lent;one_district++){
        for (let one_year=1,lenb=flot_array[one_district].length;one_year<lenb;one_year++){
            //flot_array[one_district][one_year] 形如：[ "2011", 157030, 41278 ]
            flot_array[one_district][one_year]=[flot_array[one_district][one_year][0],flot_array[one_district][one_year][2]*100/flot_array[one_district][one_year][1]];
        }
    }
    flot_lines_b(flot_array,'div_flot_fortune_500','nw',false,'','m','%',-1,[],-1,false,false,true);
}

function line_district_revenue_fortune_500(return_percent=false,csindex=1){
    var fraction_len=1;

    var flot_array=line_district_revenue_rank_b(search_result_fortune_500_global,3,5,csindex,1);
    div_flot_css_fortune_500(true,false);    

    if (return_percent){
        var bljg=line_district_revenue_percent_rank_b(flot_array,fraction_len,1,'Revenue(百万美元)');
        document.getElementById('div_flot_fortune_500').innerHTML='<table class="table_fortune_500 table_common" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
        return;
    }

    flot_lines_b(object2array_b(flot_array),'div_flot_fortune_500','nw',false,'','m','百万美元',-1,[],-1,false,false,true);
}

function company_rate_fortune_500(csindex=1){
    var bljg=company_rate_rank_b(search_result_fortune_500_global,3,5,csindex,1);

    div_flot_css_fortune_500(true,false);
    document.getElementById('div_flot_fortune_500').innerHTML='<table class="table_fortune_500 table_common" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
}

function line_company_rank_fortune_500(){
    var list_t=line_company_revenue_rank_b(search_result_fortune_500_global,5,4,1);
    div_flot_css_fortune_500(true,false);    
    flot_lines_b(list_t,'div_flot_fortune_500','ne',false,'','m','名次',-1,[],-1,false,false,true);
}

function line_company_revenue_fortune_500(csindex=1){
    var list_t=line_company_revenue_rank_b(search_result_fortune_500_global,5,csindex,1);
    div_flot_css_fortune_500(true,false);    
    flot_lines_b(list_t,'div_flot_fortune_500','nw',false,'','m',(csindex==6?'%':'百万美元'),-1,[],-1,false,false,true);
}

function compare_fortune_500(){
    var head_name=document.getElementById('input_search').value.trim().split(' ')[0];

    var year_dict, year_set, name_set;    
    [year_dict,year_set,name_set]=year_name_set_get_ranke_b(search_result_fortune_500_global,5,0,head_name);
    if (year_set.length==0){return;}
    
    var table_names={'收入':1,'利润':2,'利润率':6};


    var th_list=['<th>名称</th>'];    
    for (let one_year of year_set){
        th_list.push('<th colspan=2>'+one_year+'</th>');
    }

    var odiv=document.getElementById('div_flot_fortune_500');
    odiv.innerHTML='';
    div_flot_css_fortune_500(true,false);
    compare_ranke_b(year_dict,year_set,name_set,head_name,table_names,odiv)
    
    odiv.scrollIntoView();
}

function one_td_fortune_500(item,csno,fraction_len){
    var bljg='<tr>';
    bljg=bljg+'<td class="td_no" align=right>'+csno+'</td>';
    bljg=bljg+'<td>'+item[0]+'</td>';
    bljg=bljg+'<td class="td_district">'+item[3]+'</td>';
    bljg=bljg+'<td class="td_revenue" align=right>'+item[1].toFixed(fraction_len)+'</td>';
    bljg=bljg+'<td class="td_interest" align=right>'+value_to_fixed_fortune_500(item[2],fraction_len)+'</td>';
    bljg=bljg+'<td class="td_percent" align=right>'+value_to_fixed_fortune_500(item[6],fraction_len)+'</td>';
    bljg=bljg+'<td class="td_rank" align=right>'+item[4]+'</td>';
    bljg=bljg+'<td class="td_year">'+item[5]+'</td>';
    bljg=bljg+'</tr>';
    return bljg;
}

function value_to_fixed_fortune_500(value,fraction_len){
    return ((value==='' || isNaN(value))?'':value.toFixed(fraction_len));
}

function group_district_replace_fortune_500(csarray){
    var group_district_name=document.getElementById('select_group_district_fortune_500').value;
    if (group_district_name==''){return csarray;}
    
    group_district_name=group_district_name.split('|');

    var result_t=[];
    for (let item of csarray){
        var list_t=[].concat(item);
        result_t.push(list_t);
    }
            
    for (let one_name of group_district_name){
        var group_district_list=group_disctrict_fortune_500_global[one_name];
        if (group_district_list==undefined){
            console.log('error',one_name);
            continue;
        }
        for (let item of result_t){
            if (group_district_list.includes(item[3])){
                item[3]=one_name;
            }
        }
    }
    return result_t;
}

function array_2_html_fortune_500(csarray,cssum=false,table_id='table_fortune_500',only_tr=false,show_button=true,show_html=true,group_distrct_check=false){
    var bljg=[];
    var fraction_len=1;
    
    if (group_distrct_check){
        csarray=group_district_replace_fortune_500(csarray);
    }
    
    var blaverage=(cssum===false?false:(cssum/csarray.length).toFixed(fraction_len));
    var average_count=0;
    
    for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
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
    
    var blhead='<tr><th class="td_no">No.</th><th>Company</th><th class="td_district">Country</th><th class="td_revenue">营收<small>(百万美元)</small></th><th class="td_interest">利润<small>(百万美元)</small></th><th class="td_percent">利润率<small>(%)</small></th><th class="td_rank">当年名次</th><th class="td_year">Year</th></tr>\n';
    if (only_tr){
        bljg=blhead+bljg.join('\n');
    } else {
        bljg='<table'+(table_id==''?'':' id="'+table_id+'"')+' class="table_fortune_500 table_common" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
    }
    if (show_button){
        bljg=bljg+'<p>'+table_buttons_set_rank_b('table_fortune_500',[['td_district','Country'],['td_revenue','营收'],['td_interest','利润']])+'</p>';
        bljg=bljg+'<p>';
        bljg=bljg+'<select onchange="flot_type_fortune_500(this.value);" style="height:2rem;">';
        for (let item of ['','企业收入折线图','企业收入多年平均增长率','企业利润折线图','企业利润多年平均增长率','企业利润率折线图','地区收入折线图','地区收入多年平均增长率','地区利润折线图','地区利润多年平均增长率','地区利润率折线图','地区收入饼图','地区利润饼图','地区企业家数饼图','企业排名折线图']){
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
        result_percent_b('span_count',csarray.length,fortune_500_raw_global.length);
    }
    return bljg;
}

function flot_type_fortune_500(cstype){
    switch (cstype){
        case '企业收入折线图':
            line_company_revenue_fortune_500();
            break;
        case '企业收入多年平均增长率':
            company_rate_fortune_500();
            break;
        case '企业利润折线图':
            line_company_revenue_fortune_500(2);
            break;
        case '企业利润率折线图':
            line_company_revenue_fortune_500(6);
            break;            
        case '企业利润多年平均增长率':
            company_rate_fortune_500(2);
            break;
        case '地区收入折线图':
            line_district_revenue_fortune_500();
            break;
        case '地区收入多年平均增长率':
            line_district_revenue_fortune_500(true);
            break;           
        case '地区利润折线图':
            line_district_revenue_fortune_500(false,2);
            break;        
        case '地区利润率折线图':
            line_district_profit_percent_fortune_500();
            break;                  
        case '地区利润多年平均增长率':
            line_district_revenue_fortune_500(true,2);
            break;                 
        case '地区收入饼图':
            pie_district_statistics_fortune_500();
            break;
        case '地区利润饼图':
            pie_district_statistics_fortune_500(true,2);
            break;            
        case '地区企业家数饼图':
            pie_district_statistics_fortune_500(true,-1);
            break;
        case '企业排名折线图':
            line_company_rank_fortune_500();
            break;
    }
    document.getElementById('div_flot_fortune_500').scrollIntoView();
}

function array_2_csv_fortune_500(){
    var bljg=[];
    
    var fraction_len=1;
    
    for (let blxl=0,lent=search_result_fortune_500_global.length;blxl<lent;blxl++){
        var item=search_result_fortune_500_global[blxl];
        bljg.push((blxl+1)+',"'+specialstr_j(item[0])+'",'+item[1].toFixed(fraction_len)+','+value_to_fixed_fortune_500(item[2],fraction_len)+',"'+specialstr_j(item[3])+'",'+item[4]+',"'+item[5]+'"');
    }

    if (bljg.length==0){return;}

    var blhead='"No.","Company","Revenue(百万美元)","Interest(百万美元)","Country","当年名次","Year"\n';        
    string_2_txt_file_b(blhead+bljg.join('\n'),'fortune_500_export_'+now_time_str_b("-",true)+'.csv','csv');
}

function line_district_statistics_fortune_500(is_percent=false,csindex=1){    
    var cskey;
    var csreg;
    [cskey,csreg]=keys_rank_b(false,-1,false);

    var flot_revenue_data=line_district_statistics_flot_array_rank_b(fortune_500_raw_global,cskey,csreg,3,5,csindex,1);
    
    if (flot_revenue_data.length==0){
        alert('无符合条件 '+cskey+' 的记录，仅支持城市筛选，不支持年份筛选');
        return;
    }

    var odiv=div_flot_css_fortune_500(true,false);
    
    if (is_percent){
        flot_lines_b(line_district_statistics_percent_rank_b(flot_revenue_data),'div_flot_fortune_500','nw',false,'','m','%',-1,[],-1,false,false,true);
    } else {
        flot_lines_b(flot_revenue_data,'div_flot_fortune_500','nw',false,'','m',(csindex==-1?'家':'百万美元'),-1,[],-1,false,false,true);
    }

    odiv.scrollIntoView();
}

function year_district_list_fortune_500(){
    return year_district_list_rank_b(fortune_500_raw_global,5,3);
}

function group_fortune_500(){
    var group_district=klmenu_check_b('span_group_district_fortune_500',false);
    var group_year=klmenu_check_b('span_group_year_fortune_500',false);
    if (group_district==false && group_year==false){return;}
    
    var result_t=group_rank_b(search_result_fortune_500_global,group_district,group_year,3,5);
    var bljg=[];
    for (let key in result_t){
        bljg.push(array_2_html_fortune_500(result_t[key],false,'',true,false,false,true));
    }

    div_flot_css_fortune_500(false,false);    
    document.getElementById('divhtml').innerHTML='<table class="table_fortune_500 table_common" cellpadding=0 cellspacing=0>'+bljg.join('\n')+'</table>\n';
}

function menu_fortune_500(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="http://www.fortunechina.com/" target=_blank>Fortune</a>',    

    '<span class="span_menu" onclick="'+str_t+'array_2_csv_fortune_500();">export current result as csv</span>',    
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_fortune_500();">district revenue</span>',
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_fortune_500(true);">district revenue ratio</span>',    
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_fortune_500(false,2);">district profit</span>',
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_fortune_500(true,2);">district profit ratio</span>',    
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_fortune_500(false,-1);">地区企业家数图</span>',
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_fortune_500(true,-1);">地区企业家数比例图</span>',        
    '<span class="span_menu" onclick="'+str_t+'pie_multiyear_district_statistics_fortune_500();">multiyear district revenue pie</span>',     
    '<span class="span_menu" onclick="'+str_t+'pie_multiyear_district_statistics_fortune_500(2);">多年地区利润饼图</span>',     
    '<span class="span_menu" onclick="'+str_t+'pie_multiyear_district_statistics_fortune_500(-1);">多年地区企业家数饼图</span>',
    ];

    var menu_years;
    var menu_district;
    [menu_years,menu_district]=year_district_list_fortune_500();
    menu_years.reverse();
    
    for (let blxl=0,lent=menu_years.length;blxl<lent;blxl++){
        menu_years[blxl]='<span class="span_menu" onclick="'+str_t+'search_fortune_500(\''+menu_years[blxl]+'\',false);">'+menu_years[blxl]+'</span>';   
    }

    for (let blxl=0,lent=menu_district.length;blxl<lent;blxl++){
        menu_district[blxl]='<span class="span_menu" onclick="'+str_t+'search_fortune_500(\''+menu_district[blxl]+'\',false);">'+menu_district[blxl]+'</span>';   
    }
    
    var menu_group=[
    '<span class="span_menu">组团：<select id="select_group_district_fortune_500"><option></option></select></span>',         
    '<span class="span_menu">排序：<select id="select_sort_type_fortune_500"><option value=1>收入</option><option value=2>利润</option><option value=6>利润率</option></select></span>',     
    '<span id="span_sort_by_year_fortune_500" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 按年份排序</span>',    
    '<span id="span_sort_reverse_fortune_500" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reverse</span>',
    '<span id="span_simple_name_fortune_500" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 名称简化</span>',
    '<span id="span_group_district_fortune_500" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ group by district</span>',    
    '<span id="span_group_year_fortune_500" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ group by year</span>',        
    '<span class="span_menu" onclick="'+str_t+'group_fortune_500();">执行分组</span>',     
    '<span class="span_menu" onclick="'+str_t+'merge_data_generate_fortune_500();">按年份和国籍分别合并当前结果</span>',     
    '<span class="span_menu" onclick="'+str_t+'merge_data_clear_fortune_500();">清除全部合并数据</span>',     
    '<span class="span_menu" onclick="'+str_t+'compare_fortune_500();">当前企业对比</span>',     
    
    ];
    
    var klmenu_config=root_font_size_menu_b(str_t);

    var klmenu_search=[
    '<span class="span_menu" onclick="'+str_t+'search_fortune_500(\'^-[0-9]+(:r)\') ;">亏损企业</span>',     
    ];
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏭','17rem','1rem','1rem','60rem')+klmenu_b(menu_years,'Year','7rem','1rem','1rem','30rem')+klmenu_b(menu_district,'Countries','12rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','18rem','1rem','1rem','30rem')+klmenu_b(klmenu_search,'🔽','10rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','15rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_sort_by_year_fortune_500',true);
    
    var oselect=document.getElementById('select_group_district_fortune_500');
    for (let key in group_disctrict_fortune_500_global){
        oselect.insertAdjacentHTML('beforeend','<option>'+key+'</option>');
    }
}

function merge_data_generate_fortune_500(){
    if (search_result_fortune_500_global.length<2){
        alert('至少需要两条数据才能合并');
        return;
    }
    
    if (!confirm('是否合并当前 '+search_result_fortune_500_global.length+' 条数据？')){return;}
    
    var bltitle=(prompt('输入合并后的名称') || '').trim();
    if (bltitle==''){return;}

    var dict_t={};
    for (let item of search_result_fortune_500_global){
        var blkey=item[3]+'_'+item[5];
        if (dict_t[blkey]==undefined){
            dict_t[blkey]=[].concat(item);
            dict_t[blkey][0]=bltitle;
            dict_t[blkey][4]=-1;
        } else {
            dict_t[blkey][1]=dict_t[blkey][1]+item[1];
            dict_t[blkey][2]=dict_t[blkey][2]+item[2];
        }
    }   

    var old_len=fortune_500_raw_global.length;
    for (let key in dict_t){
        dict_t[key][6]=dict_t[key][2]*100/dict_t[key][1];
        fortune_500_raw_global.push(dict_t[key]);
    }
    alert('合并前原始数据共 '+old_len+' 条，合并后 '+fortune_500_raw_global.length+' 条');
}

function merge_data_clear_fortune_500(){
    var blcount=0;
    for (let item of fortune_500_raw_global){
        if (item[4]==-1){
            blcount=blcount+1;
        }
    }
    if (blcount==0){
        alert('无临时合并的数据');
        return;
    }

    if (!confirm('是否清除 '+blcount+' 条临时合并的数据？')){return;}

    var old_len=fortune_500_raw_global.length;

    var result_t=[];
    for (let item of fortune_500_raw_global){
        if (item[4]==-1){continue;}
        result_t.push(item);
    }
    fortune_500_raw_global=result_t;
    alert('清除前原始数据共 '+old_len+' 条，清除后 '+fortune_500_raw_global.length+' 条');    
}

function init_fortune_500(){
    group_disctrict_fortune_500_global={
    'UK+EU':['法国','德国','英国','瑞士','荷兰','西班牙','意大利','爱尔兰','瑞典','比利时','丹麦','卢森堡','挪威','波兰','芬兰','奥地利','英国/荷兰','匈牙利'],
    'G7':['美国','加拿大','法国','德国','英国','意大利','日本'],
    '五眼联盟':['美国','加拿大','英国','澳大利亚','新西兰'],
    'G7(不含US)|EU(不含德法意)':[],
    };
    group_disctrict_fortune_500_global['发达国家']=array_unique_b(['韩国'].concat(group_disctrict_fortune_500_global['UK+EU'],group_disctrict_fortune_500_global['G7'],group_disctrict_fortune_500_global['五眼联盟']));

    group_disctrict_fortune_500_global['发达国家(不含US)']=[].concat(group_disctrict_fortune_500_global['发达国家']);
    group_disctrict_fortune_500_global['发达国家(不含US)']=array_remove_item_b(group_disctrict_fortune_500_global['发达国家(不含US)'],'美国');

    group_disctrict_fortune_500_global['G7(不含US)']=[].concat(group_disctrict_fortune_500_global['G7']);
    group_disctrict_fortune_500_global['G7(不含US)']=array_remove_item_b(group_disctrict_fortune_500_global['G7(不含US)'],'美国');

    group_disctrict_fortune_500_global['EU(不含德法意)']=[].concat(group_disctrict_fortune_500_global['UK+EU']);
    group_disctrict_fortune_500_global['EU(不含德法意)']=array_remove_item_b(group_disctrict_fortune_500_global['EU(不含德法意)'],['德国','法国','意大利','英国']);

    for (let key in group_disctrict_fortune_500_global){
        group_disctrict_fortune_500_global[key].sort(zh_sort_b);
    }

    buttons_rank_b('Fortune 500','search_fortune_500();');
    fortune_500_raw_global=obj2array_rank_b(fortune_500_raw_global,1);
    for (let blxl=0,lent=fortune_500_raw_global.length;blxl<lent;blxl++){
        fortune_500_raw_global[blxl].push(fortune_500_raw_global[blxl][2]*100/fortune_500_raw_global[blxl][1]);
    }
    recent_search_key_fortune_500();
    menu_fortune_500();
    data_check_rank_b(fortune_500_raw_global,7,[1,2]);
}
