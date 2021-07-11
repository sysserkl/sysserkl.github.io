function recent_search_key_zjcompany(csstr=''){
    recent_search_b('recent_search_zjcompany',csstr,'search_zjcompany','div_recent_search',['阿里巴巴','^[1-3]$(:r)','+宁波 +^([1-9]|[1-2][0-9])$(:r)',(new Date().getFullYear()-1)+'年']);
}

function search_zjcompany(cskey,csreg,show_html){
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
        recent_search_key_zjcompany(cskey+(csreg?'(:r)':''));
    }
    
    var blsum=0;
    [search_result_zj_company_global,blsum]=search_rank_b(zj_company_raw_global,cskey,csreg,2,3,4);
    if (show_html){
        array_2_html_zjcompany(search_result_zj_company_global,blsum);
    }
}

function pie_multiyear_district_statistics_zjcompany(csindex=2){
    var years=year_district_list_zjcompany()[0];
    if (years.length==0){return;}

    var cskey= document.getElementById('input_search').value.trim();
    var csreg=document.getElementById('input_reg').checked;
    if (cskey.slice(-4,)=='(:r)'){
        csreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    
    var result_t=[];
    for (let item of years){
		var blfound=str_reg_search_b(item,cskey,csreg);
		if (blfound==-1){
			break;
		}

		if (cskey=='' || blfound){         
            search_zjcompany(item,false,false);
            result_t.push([item,pie_district_statistics_zjcompany(false,csindex)]);
        }
    }
    
    document.getElementById('divhtml').innerHTML='';

    var odiv=div_flot_css_zjcompany(true,true);
    odiv.innerHTML='<h3>多年地区'+['企业家数','','','收入'][csindex+1]+'饼图</h3>';
    
    for (let one_year_data of result_t){
        var list_t=[];
        for (let item of one_year_data[1]){
            list_t.push({'label': item[0],'data': (csindex==-1?item[1]:item[1]/100000000)});
        }
        var blid='div_flot_zj_company'+one_year_data[0].substring(0,4);
        odiv.insertAdjacentHTML('beforeend','<div style="position:relative;float:left;margin:0.5rem;"><div id="'+blid+'" style="width:300px; height:300px;"></div><p align=center>'+one_year_data[0]+'</p></div>\n');
        flot_pie_k(list_t,blid);
    }
    search_result_zj_company_global=[];
}

function div_flot_css_zjcompany(csshow=true,fullscreen=false){
    return div_flot_css_rank_b('div_flot_zj_company',csshow,fullscreen);
}

function pie_district_statistics_zjcompany(show_chart=true,csindex=2){
    var list_t=pie_district_statistics_array_rank_b(search_result_zj_company_global,1,csindex);
    if (!show_chart){
        return list_t;
    }
    
    var bljg=[];
    [list_t,bljg]=pie_district_statistics_string_rank_b(list_t,3,'万亿元',100000000,csindex);

    var div_id='div_district_revenue_pie_data_zjcompany';
    var odiv=document.getElementById(div_id);
    if (!odiv){
        document.getElementById('divhtml').insertAdjacentHTML('beforeend','<div id="'+div_id+'" style="column-count:3;"></div>');
    }
    document.getElementById(div_id).innerHTML=array_2_li_b(bljg);
    div_flot_css_zjcompany(true,false);
    flot_pie_k(list_t,'div_flot_zj_company');
}

function line_district_revenue_zjcompany(return_percent=false){
    var flot_array=line_district_revenue_rank_b(search_result_zj_company_global,1,4,2,100000000);
    div_flot_css_zjcompany(true,false);    

    if (return_percent){
        var bljg=line_district_revenue_percent_rank_b(flot_array,2,10000,'Revenue(亿元)');
        document.getElementById('div_flot_zj_company').innerHTML='<table class="table_zj_company" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
        return;
    }

    flot_lines_k(object2array_b(flot_array),'div_flot_zj_company','nw',false,'','m','万亿元',-1,[],-1,false,false,true);
}

function company_rate_zjcompany(){
    var bljg=company_rate_rank_b(search_result_zj_company_global,1,4,2,10000);

    div_flot_css_zjcompany(true,false);    
    document.getElementById('div_flot_zj_company').innerHTML='<table class="table_zj_company" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
}

function line_company_revenue_zjcompany(){
    var list_t=line_company_revenue_rank_b(search_result_zj_company_global,4,2,10000);
    div_flot_css_zjcompany(true,false);    
    flot_lines_k(list_t,'div_flot_zj_company','nw',false,'','m','亿元',-1,[],-1,false,false,true);
}

function fraction_len_zjcompany(csarray){
    var fraction_len=0;
    for (let item of csarray){
        var list_t=item[2].toString().split('.');
        if (list_t.length==2){
            fraction_len=Math.max(fraction_len,list_t[1].length);
        }
        if (fraction_len==2){break;}
    }
    return fraction_len;
}

function one_td_zjcompany(item,csno,fraction_len){
    return '<tr><td class="td_no" align=right>'+csno+'</td><td>'+item[0]+'</td><td class="td_district">'+item[1]+'</td><td class="td_revenue" align=right>'+item[2].toFixed(fraction_len)+'</td><td class="td_rank" align=right>'+item[3]+'</td><td class="td_year">'+item[4]+'</td></tr>';
}

function array_2_html_zjcompany(csarray,cssum=false,table_id='table_zj_company',only_tr=false,show_button=true,show_html=true){
    var bljg=[];
    
    var fraction_len=fraction_len_zjcompany(csarray);

    var blaverage=(cssum===false?false:(cssum/csarray.length).toFixed(fraction_len));
    var average_count=0;
    
    for (let blxl=0;blxl<csarray.length;blxl++){
        var item=csarray[blxl];
        if (cssum!==false && item[2]>=blaverage){
            average_count=average_count+1;
        }
        bljg.push(one_td_zjcompany(item,blxl+1,fraction_len));
    }
    
    if (show_html){
        document.getElementById('divhtml').innerHTML='';
        div_flot_css_zjcompany(false,false);
    }
    if (bljg.length==0){
        return '';
    }
    
    var blhead='<tr><th class="td_no">No.</th><th>Company</th><th class="td_district">City</th><th class="td_revenue">Revenue(万元)</th><th class="td_rank">当年名次</th><th class="td_year">Year</th></tr>\n';
    if (only_tr){
        bljg=blhead+bljg.join('\n');
    }
    else {
        bljg='<table'+(table_id==''?'':' id="'+table_id+'"')+' class="table_zj_company" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
    }
    if (show_button){
        bljg=bljg+'<p>'+table_buttons_rank_b('table_zj_company')+'</p>';
        bljg=bljg+'<p>';
        bljg=bljg+'<select onchange="javascript:flot_type_zjcompany(this.value);" style="height:2rem;">';
        for (let item of ['','企业收入折线图','企业多年平均增长率','地区收入折线图','地区多年平均增长率','地区收入饼图','地区企业家数饼图']){
            bljg=bljg+'<option>'+item+'</option>\n';
        }
        bljg=bljg+'</select>';
        bljg=bljg+'</p>\n';
        if (cssum!==false){  
            bljg=bljg+'<p>总收入：'+cssum.toFixed(2)+'万元；平均收入：'+blaverage+'万元；在平均线上的企业共有 '+average_count+' 家，占 '+(average_count*100/csarray.length).toFixed(2)+' %</p>\n';
        }
    }
    if (show_html){
        document.getElementById('divhtml').innerHTML=bljg;
    }
    return bljg;
}

function flot_type_zjcompany(cstype){
    switch (cstype){
        case '企业收入折线图':
            line_company_revenue_zjcompany();
            break;
        case '企业多年平均增长率':
            company_rate_zjcompany();
            break;
        case '地区收入折线图':
            line_district_revenue_zjcompany();
            break;
        case '地区多年平均增长率':
            line_district_revenue_zjcompany(true);
            break;            
        case '地区收入饼图':
            pie_district_statistics_zjcompany();
            break;
        case '地区企业家数饼图':
            pie_district_statistics_zjcompany(true,-1);
            break;
    }
    document.getElementById('div_flot_zj_company').scrollIntoView();
}

function array_2_csv_zjcompany(){
    var bljg=[];
    
    var fraction_len=fraction_len_zjcompany(search_result_zj_company_global);
    
    for (let blxl=0;blxl<search_result_zj_company_global.length;blxl++){
        var item=search_result_zj_company_global[blxl];
        bljg.push((blxl+1)+',"'+specialstr_j(item[0])+'","'+specialstr_j(item[1])+'",'+item[2].toFixed(fraction_len)+','+item[3]+',"'+specialstr_j(item[4])+'"');
    }

    if (bljg.length==0){return;}

    var blhead='"No.","Company","City","Revenue(万元)","当年名次","Year"\n';        
    string_2_txt_file_b(blhead+bljg.join('\n'),'zj_company_export_'+now_time_str_b("-",true)+'.csv','csv');
}

function format_data_form_zjcompany(){
    var bljg='';
    bljg='<textarea id="textarea_data_format_zj_company" style="height:20rem;"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:format_data_2_array_zjcompany();">转换为数组</span>',

    bljg=bljg+'</p>';
    document.getElementById('divhtml').innerHTML=bljg;
}

function format_data_2_array_zjcompany(){
    var otextarea=document.getElementById('textarea_data_format_zj_company');
    var blstr=otextarea.value.trim();
    blstr=blstr.replace(new RegExp(/\s(\d{1,3})\s/,'mg'),'\n$1\t');
    blstr=blstr.replace(new RegExp(/\s+$/,'mg'),'');
    blstr=blstr.replace(new RegExp(/\t+/,'mg'),'\t');
    var list_t=blstr.trim().split('\n');
    list_t.sort(function (a,b){return parseFloat(a)>parseFloat(b);});
    var result_t=[];
    for (let item of list_t){
        var blarr=item.split('\t');  //此处未考虑公司名等含有\t - 保留注释
        if (blarr.length!==4){
            alert('格式错误：\n'+blarr);
            return;
        }
        if (!isNaN(blarr[3].trim())){
            result_t.push('["'+blarr[1].trim()+'","'+blarr[2].trim()+'",'+blarr[3].trim()+'],');
        }
        else {
            result_t.push('["'+blarr[1].trim()+'","'+blarr[3].trim()+'",'+blarr[2].trim()+'],');
        }
    }
    if (result_t.length>0){
        otextarea.value="'xxxx':[\n"+result_t.join('\n')+'\n],\n';
    }
}

function line_district_statistics_zjcompany(is_percent=false,csindex=2){
    var cskey= document.getElementById('input_search').value.trim();
    var csreg=document.getElementById('input_reg').checked;
    if (cskey.slice(-4,)=='(:r)'){
        csreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }

    var flot_revenue_data=line_district_statistics_flot_array_rank_b(zj_company_raw_global,cskey,csreg,1,4,csindex,100000000);
    
    if (flot_revenue_data.length==0){
        alert('无符合条件 '+cskey+' 的记录，仅支持城市筛选，不支持年份筛选');
        return;
    }

    var odiv=div_flot_css_zjcompany(true,false);
    
    if (is_percent){
        flot_lines_k(line_district_statistics_percent_rank_b(flot_revenue_data),'div_flot_zj_company','nw',false,'','m','%',-1,[],-1,false,false,true);
    }
    else {
        flot_lines_k(flot_revenue_data,'div_flot_zj_company','nw',false,'','m',(csindex==-1?'家':'万亿元'),-1,[],-1,false,false,true);
    }

    odiv.scrollIntoView();
}

function two_columns_table_zjcompany(csid='table_zj_company'){
    var otable=document.getElementById(csid);
    if (!otable){return;}
    var otrs=otable.querySelectorAll('tr');
    var bllen=otrs.length-1;
    if (bllen<2){return;}
    var otds=otrs[0].querySelectorAll('th,td');
    if (otds.length==12){return;}
    for (let blxl=1;blxl<bllen;blxl++){
        if (blxl+bllen/2 > bllen){break;}
        otrs[blxl].insertAdjacentHTML('beforeend',otrs[blxl+bllen/2].innerHTML);
        var otds=otrs[blxl].querySelectorAll('td');
        otds[6].style.borderLeft='0.2rem double black';
        otrs[blxl+bllen/2].outerHTML='';
    }
    otrs[0].insertAdjacentHTML('beforeend',otrs[0].innerHTML);
    var otds=otrs[0].querySelectorAll('th');
    otds[6].style.borderLeft='0.2rem solid black';    
}

function year_district_list_zjcompany(is_all=true){
    return year_district_list_rank_b(zj_company_raw_global,4,1,is_all);
}

function group_zjcompany(){
    var group_district=klmenu_check_b('span_group_district_zjcompany',false);
    var group_year=klmenu_check_b('span_group_year_zjcompany',false);
    if (group_district==false && group_year==false){return;}
    
    var result_t=group_rank_b(search_result_zj_company_global,group_district,group_year,1,4);
    var bljg=[];
    for (let key in result_t){
        bljg.push(array_2_html_zjcompany(result_t[key],false,'',true,false,false));
    }

    div_flot_css_zjcompany(false,false);    
    document.getElementById('divhtml').innerHTML='<table class="table_zj_company" cellpadding=0 cellspacing=0>'+bljg.join('\n')+'</table>\n';
}

function menu_zjcompany(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="http://zjqlw.com/baiqiang.php" target=_blank>百强企业</a>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'format_data_form_zjcompany();">整理原始数据</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'array_2_csv_zjcompany();">导出当前结果为csv</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'two_columns_table_zjcompany();">两栏表格</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_zjcompany();">地区收入图</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_zjcompany(true);">地区收入比例图</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_zjcompany(false,-1);">地区企业家数图</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'line_district_statistics_zjcompany(true,-1);">地区企业家数比例图</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'pie_multiyear_district_statistics_zjcompany();">多年地区收入饼图</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'pie_multiyear_district_statistics_zjcompany(-1);">多年地区企业家数饼图</span>',     
    ];

    var menu_years;
    var menu_district;
    [menu_years,menu_district]=year_district_list_zjcompany();
    menu_years.reverse();
    
    for (let blxl=0;blxl<menu_years.length;blxl++){
        menu_years[blxl]='<span class="span_menu" onclick="javascript:'+str_t+'search_zjcompany(\''+menu_years[blxl]+'\',false);">'+menu_years[blxl]+'</span>';   
    }

    for (let blxl=0;blxl<menu_district.length;blxl++){
        menu_district[blxl]='<span class="span_menu" onclick="javascript:'+str_t+'search_zjcompany(\''+menu_district[blxl]+'\',false);">'+menu_district[blxl]+'</span>';   
    }
    
    var menu_group=[
    '<span id="span_group_district_zjcompany" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id,true);">⚪ 按地区分组</span>',    
    '<span id="span_group_year_zjcompany" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id,true);">⚪ 按年份分组</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'group_zjcompany();">执行分组</span>',     
    ];
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏭','14rem','1rem','1rem','60rem')+klmenu_b(menu_years,'年','7rem','1rem','1rem','30rem')+klmenu_b(menu_district,'市','5rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','10rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function init_zjcompany(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    zj_company_raw_global=obj2array_rank_b(zj_company_raw_global,2);
    recent_search_key_zjcompany();
    menu_zjcompany();
}
