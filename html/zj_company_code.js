function hide_show_zjcompany(cstype=''){
    document.getElementById('div_buttons').style.display=cstype;
}

function import_data_zjcompany(){
    var cskeys=href_split_b(location.href);
    data_type_zjcompany='';
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,5)=='data='){
                data_type_zjcompany=one_key.substring(5,).trim();
                break;
            }
        }
    }
    if (data_type_zjcompany==''){
        data_type_zjcompany='all';
    }
    klbase_addons_import_js_b([],[],['zj_company_'+data_type_zjcompany+'_data.js']);
}

function recent_search_key_zjcompany(csstr=''){
    recent_search_b('recent_search_zjcompany',csstr,'search_zjcompany','div_recent_search',['阿里巴巴','^[1-3]$(:r)','+宁波 +^([1-9]|[1-2][0-9])$(:r)',(new Date().getFullYear()-1)+'年']);
}

function search_zjcompany(cskey=false,csreg=-1,show_html=true){    
    [cskey,csreg]=keys_rank_b(cskey,csreg,show_html);
    
    if (show_html){
        recent_search_key_zjcompany(cskey+(csreg?'(:r)':''));
    }
    
    var blsum=0;
    [search_result_zj_company_global,blsum]=search_rank_b(zj_company_raw_global,cskey,csreg,2,3,4);
    
    if (klmenu_check_b('span_simple_name_zjcompany',false)){
        search_result_zj_company_global=simple_name_rank_b(cskey,search_result_zj_company_global,0);
    }
        
    if (show_html){
        array_2_html_zjcompany(search_result_zj_company_global,blsum);
    }
}

function pie_multiyear_district_statistics_zjcompany(csindex=2){
    var years=year_district_list_zjcompany()[0];
    if (years.length==0){return;}
   
    var cskey;
    var csreg;
    [cskey,csreg]=keys_rank_b(false,-1,false);    
    
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
        flot_pie_b(list_t,blid);
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
    flot_pie_b(list_t,'div_flot_zj_company');
}

function line_district_revenue_zjcompany(return_percent=false){
    var flot_array=line_district_revenue_rank_b(search_result_zj_company_global,1,4,2,100000000);
    div_flot_css_zjcompany(true,false);    

    if (return_percent){
        var bljg=line_district_revenue_percent_rank_b(flot_array,2,10000,'Revenue(亿元)');
        document.getElementById('div_flot_zj_company').innerHTML='<table class="table_zj_company table_common" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
        return;
    }

    flot_lines_b(object2array_b(flot_array),'div_flot_zj_company','nw',false,'','m','万亿元',-1,[],-1,false,false,true);
}

function company_rate_zjcompany(){
    var bljg=company_rate_rank_b(search_result_zj_company_global,1,4,2,10000);

    div_flot_css_zjcompany(true,false);    
    document.getElementById('div_flot_zj_company').innerHTML='<table class="table_zj_company table_common" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
}

function line_company_revenue_zjcompany(){
    var list_t=line_company_revenue_rank_b(search_result_zj_company_global,4,2,10000);
    div_flot_css_zjcompany(true,false);    
    flot_lines_b(list_t,'div_flot_zj_company','nw',false,'','m','亿元',-1,[],-1,false,false,true);
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
    var bljg='<tr>';
    bljg=bljg+'<td class="td_no" align=right>'+csno+'</td>';
    bljg=bljg+'<td>'+item[0]+'</td>';
    bljg=bljg+'<td class="td_district">'+item[1]+'</td>';
    bljg=bljg+'<td class="td_revenue" align=right>'+item[2].toFixed(fraction_len)+'</td>';
    bljg=bljg+'<td class="td_rank" align=right>'+item[3]+'</td>';
    bljg=bljg+'<td class="td_year">'+item[4]+'</td>';
    bljg=bljg+'</tr>';
    return bljg;
}

function array_2_html_zjcompany(csarray,cssum=false,table_id='table_zj_company',only_tr=false,show_button=true,show_html=true){
    var bljg=[];
    
    var fraction_len=fraction_len_zjcompany(csarray);

    var blaverage=(cssum===false?false:(cssum/csarray.length).toFixed(fraction_len));
    var average_count=0;
    
    for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
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
    } else {
        bljg='<table'+(table_id==''?'':' id="'+table_id+'"')+' class="table_zj_company table_common" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
    }
    if (show_button){
        bljg=bljg+'<p>'+table_buttons_set_rank_b('table_zj_company')+'</p>';
        bljg=bljg+'<p>';
        bljg=bljg+'<select onchange="flot_type_zjcompany(this.value);" style="height:2rem;">';
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
    
    for (let blxl=0,lent=search_result_zj_company_global.length;blxl<lent;blxl++){
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
    bljg=bljg+'<span class="aclick" onclick="format_data_2_array_zjcompany();">转换为数组</span>',

    bljg=bljg+'</p>';
    document.getElementById('divhtml').innerHTML=bljg;
}

function format_data_2_array_zjcompany(){
    var otextarea=document.getElementById('textarea_data_format_zj_company');
    var blstr=otextarea.value.trim();
    blstr=blstr.replace(/\s(\d{1,3})\s/mg,'\n$1\t');
    blstr=blstr.replace(/\s+$/mg,'');
    blstr=blstr.replace(/\t+/mg,'\t');
    var list_t=blstr.trim().split('\n');
    list_t.sort(function (a,b){return parseFloat(a)>parseFloat(b) ? 1 : -1;});
    var result_t=[];
    for (let item of list_t){
        var blarr=item.split('\t');  //此处未考虑公司名等含有\t - 保留注释
        if (blarr.length!==4){
            alert('格式错误：\n'+blarr);
            return;
        }
        if (!isNaN(blarr[3].trim())){
            result_t.push('["'+blarr[1].trim()+'","'+blarr[2].trim()+'",'+blarr[3].trim()+'],');
        } else {
            result_t.push('["'+blarr[1].trim()+'","'+blarr[3].trim()+'",'+blarr[2].trim()+'],');
        }
    }
    if (result_t.length>0){
        otextarea.value="'xxxx':[\n"+result_t.join('\n')+'\n],\n';
    }
}

function line_district_statistics_zjcompany(is_percent=false,csindex=2){
    var cskey;
    var csreg;
    [cskey,csreg]=keys_rank_b(false,-1,false);    

    var flot_revenue_data=line_district_statistics_flot_array_rank_b(zj_company_raw_global,cskey,csreg,1,4,csindex,100000000);
    
    if (flot_revenue_data.length==0){
        alert('无符合条件 '+cskey+' 的记录，仅支持城市筛选，不支持年份筛选');
        return;
    }

    var odiv=div_flot_css_zjcompany(true,false);
    
    if (is_percent){
        flot_lines_b(line_district_statistics_percent_rank_b(flot_revenue_data),'div_flot_zj_company','nw',false,'','m','%',-1,[],-1,false,false,true);
    } else {
        flot_lines_b(flot_revenue_data,'div_flot_zj_company','nw',false,'','m',(csindex==-1?'家':'万亿元'),-1,[],-1,false,false,true);
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

function year_district_list_zjcompany(){
    return year_district_list_rank_b(zj_company_raw_global,4,1);
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
    document.getElementById('divhtml').innerHTML='<table class="table_zj_company table_common" cellpadding=0 cellspacing=0>'+bljg.join('\n')+'</table>\n';
}

function menu_zjcompany(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="http://zjqlw.com/baiqiang.php" onclick="'+str_t+'" target=_blank>百强企业</a>',    
    '<span class="span_menu" onclick="'+str_t+'format_data_form_zjcompany();">整理原始数据</span>',
    '<span class="span_menu" onclick="'+str_t+'array_2_csv_zjcompany();">导出当前结果为csv</span>',    
    '<span class="span_menu" onclick="'+str_t+'two_columns_table_zjcompany();">两栏表格</span>',
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_zjcompany();">地区收入图</span>',
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_zjcompany(true);">地区收入比例图</span>',    
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_zjcompany(false,-1);">地区企业家数图</span>',
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_zjcompany(true,-1);">地区企业家数比例图</span>',        
    '<span class="span_menu" onclick="'+str_t+'pie_multiyear_district_statistics_zjcompany();">多年地区收入饼图</span>',     
    '<span class="span_menu" onclick="'+str_t+'pie_multiyear_district_statistics_zjcompany(-1);">多年地区企业家数饼图</span>',     
    '<span class="span_menu" onclick="'+str_t+'hide_show_zjcompany(\'none\');">隐藏按钮区域</span>',         
    ];

    var menu_years;
    var menu_district;
    [menu_years,menu_district]=year_district_list_zjcompany();
    menu_years.reverse();
    
    for (let blxl=0,lent=menu_years.length;blxl<lent;blxl++){
        menu_years[blxl]='<span class="span_menu" onclick="'+str_t+'search_zjcompany(\''+menu_years[blxl]+'\',false);">'+menu_years[blxl]+'</span>';   
    }

    for (let blxl=0,lent=menu_district.length;blxl<lent;blxl++){
        menu_district[blxl]='<span class="span_menu" onclick="'+str_t+'search_zjcompany(\''+menu_district[blxl]+'\',false);">'+menu_district[blxl]+'</span>';   
    }
    
    var menu_group=[
    '<span id="span_simple_name_zjcompany" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 名称简化</span>',    
    '<span id="span_group_district_zjcompany" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 按地区分组</span>',    
    '<span id="span_group_year_zjcompany" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 按年份分组</span>',        
    '<span class="span_menu" onclick="'+str_t+'group_zjcompany();">执行分组</span>',     
    '<span class="span_menu" onclick="'+str_t+'compare_zjcompany();">当前企业对比</span>',         
    ];
    
    var menu_data=[];
    for (let item of ['all','manufacture']){
        menu_data.push('<a href="?data='+item+'" onclick="'+str_t+'">'+item+'</a>');
    }    

    var klmenu_config=root_font_size_menu_b(str_t);
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏭','14rem','1rem','1rem','60rem')+klmenu_b(menu_years,'年','7rem','1rem','1rem','30rem')+klmenu_b(menu_district,'市','5rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','10rem','1rem','1rem','30rem')+klmenu_b(menu_data,'📚','10rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','15rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function init_zjcompany(){
    buttons_rank_b('浙江百强企业','search_zjcompany()');
    document.getElementById('span_title').insertAdjacentHTML('beforeend',' - '+data_type_zjcompany);
    document.title=document.title+' - '+data_type_zjcompany;
    zj_company_raw_global=obj2array_rank_b(zj_company_raw_global,2);
    recent_search_key_zjcompany();
    menu_zjcompany();
    data_check_rank_b(zj_company_raw_global,5,[2]);    
}

function compare_zjcompany(){
    var head_name=document.getElementById('input_search').value.trim().split(' ')[0];

    var year_dict, year_set, name_set;    
    [year_dict,year_set,name_set]=year_name_set_get_ranke_b(search_result_zj_company_global,4,0,head_name);
    if (year_set.length==0){return;}
    
    var table_names={'收入':2};

    var th_list=['<th>名称</th>'];    
    for (let one_year of year_set){
        th_list.push('<th colspan=2>'+one_year+'</th>');
    }

    var odiv=document.getElementById('div_flot_zj_company');
    odiv.innerHTML='';
    div_flot_css_zjcompany(true,false);
    compare_ranke_b(year_dict,year_set,name_set,head_name,table_names,odiv)
    
    odiv.scrollIntoView();
}
