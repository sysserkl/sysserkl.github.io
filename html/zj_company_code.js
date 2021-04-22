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
    
    search_result_zj_company_global=[];
    var blsum=0;
    for (let item of zj_company_global){
		var blfound=str_reg_search_b(item,cskey,csreg);
		if (blfound==-1){
			break;
		}

		if (cskey=='' || blfound){        
            search_result_zj_company_global.push(item);
            blsum=blsum+item[2];
        }
    }

    search_result_zj_company_global.sort(function (a,b){return a[2]<b[2];});
    search_result_zj_company_global.sort(function (a,b){return a[3]>b[3];});
    search_result_zj_company_global.sort(function (a,b){return a[4]<b[4];});
    if (show_html){
        array_2_html_zjcompany(search_result_zj_company_global,blsum);
    }
}

function show_hide_zjcompany(csid,cstype){
    var otable=document.getElementById(csid);
    if (!otable){return;}
    var otds=otable.querySelectorAll('th,td');
    for (let one_td of otds){
        if (!one_td.classList.contains(cstype)){continue;}
        one_td.style.display=(one_td.style.display==''?'none':'');
    }
}

function switch_columns_zjcompany(csid,tdclass1,tdclass2){
    var otable=document.getElementById(csid);
    if (!otable){return;}

    var otrs=otable.querySelectorAll('tr');
    for (let one_tr of otrs){
        var otds=one_tr.querySelectorAll('th,td');
        var result_t=[];
        for (let one_td of otds){
            if (one_td.classList.contains(tdclass1) || one_td.classList.contains(tdclass2)){
                result_t.push(one_td);
            }
        }
        for (let blxl=0;blxl<result_t.length;blxl=blxl+2){
            var blstr=result_t[blxl].outerHTML;
            result_t[blxl].outerHTML=result_t[blxl+1].outerHTML;
            result_t[blxl+1].outerHTML=blstr;
        }
    }
}

function flot_district_revenue_pie_multi_year_zjcompany(do_count=false){
    var years=year_district_list_zjcompany()[0];
    if (years.length==0){return;}
    var result_t=[];
    for (let item of years){
        search_zjcompany(item,false,false);
        result_t.push([item,flot_district_revenue_pie_zjcompany(false,do_count)]);
    }
    
    document.getElementById('divhtml').innerHTML='';
    var odiv=div_flot_css_zjcompany(true,true);
    odiv.innerHTML='';
    
    for (let one_year_data of result_t){
        var list_t=[];
        for (let item of one_year_data[1]){
            list_t.push({'label': item[0],'data': (do_count?item[1]:item[1]/100000000)});
        }
        var blid='div_flot_zj_company'+one_year_data[0].substring(0,4);
        odiv.insertAdjacentHTML('beforeend','<div style="position:relative;float:left;margin:0.5rem;"><div id="'+blid+'" style="width:300px; height:300px;"></div><p align=center>'+one_year_data[0]+'</p></div>\n');
        flot_pie_k(list_t,blid);
    }
    search_result_zj_company_global=[];
    document.getElementById('input_search').value='';
}

function div_flot_css_zjcompany(csshow=true,fullscreen=false){
    var odiv=document.getElementById('div_flot_zj_company');
    if (fullscreen){
        odiv.style.width='';
        odiv.style.height='';    
    }
    else {
        odiv.style.width='900px';
        odiv.style.height='700px';
    }
    odiv.style.display=(csshow?'':'none');
    return odiv;
}

function flot_district_revenue_pie_zjcompany(show_chart=true,do_count=false){
    var flot_array={};
    
    for (let blxl=0;blxl<search_result_zj_company_global.length;blxl++){
        var item=search_result_zj_company_global[blxl];
        if (flot_array[item[1]]==null){
            flot_array[item[1]]=[item[1],0];
        }
        flot_array[item[1]][1]=flot_array[item[1]][1]+(do_count?1:item[2]);
    }
    
    var list_t=object2array_b(flot_array);
    list_t.sort(function (a,b){return a[1]<b[1];});

    if (!show_chart){
        return list_t;
    }

    var bljg=[].concat(list_t);
    var blsum=0;
    for (let blxl=0;blxl<list_t.length;blxl++){
        blsum=blsum+list_t[blxl][1];
        list_t[blxl]={'label': list_t[blxl][0],'data': (do_count?list_t[blxl][1]:list_t[blxl][1]/100000000)};
    }
    bljg.push(['合计',blsum]);

    for (let blxl=0;blxl<bljg.length;blxl++){
        bljg[blxl]=bljg[blxl][0]+': '+(do_count?bljg[blxl][1]+'家，':(bljg[blxl][1]/100000000).toFixed(3)+'万亿元，')+(bljg[blxl][1]*100/blsum).toFixed(2)+'%';
    }
    var odiv=document.getElementById('div_district_revenue_pie_data_zjcompany');
    if (!odiv){
        document.getElementById('divhtml').insertAdjacentHTML('beforeend','<div id="div_district_revenue_pie_data_zjcompany" style="column-count:3;"></div>');
    }
    document.getElementById('div_district_revenue_pie_data_zjcompany').innerHTML=array_2_li_b(bljg);
    div_flot_css_zjcompany(true,false);
    flot_pie_k(list_t,'div_flot_zj_company');
}

function flot_year_revenue_district_line_zjcompany(){
    var list_t=[];
    var flot_array=[];
    
    for (let blxl=0;blxl<search_result_zj_company_global.length;blxl++){
        var item=search_result_zj_company_global[blxl];
        if (list_t[item[1]+'_'+item[4]]==null){
            list_t[item[1]+'_'+item[4]]=[item[4].substring(0,4),0];
        }
        if (flot_array[item[1]]==null){
            flot_array[item[1]]=[item[1]];
        }
        list_t[item[1]+'_'+item[4]][1]=list_t[item[1]+'_'+item[4]][1]+item[2]/100000000;
    }

    for (let key in list_t){
        flot_array[key.split('_')[0]].push(list_t[key]);
    }
    
    div_flot_css_zjcompany(true,false);
    flot_lines_k(object2array_b(flot_array),'div_flot_zj_company','nw',false,'','m','万亿元',-1,[],-1,false,false,true);
}

function flot_year_revenue_company_line_zjcompany(){
    var flot_array={};
    for (let blxl=0;blxl<search_result_zj_company_global.length;blxl++){
        var item=search_result_zj_company_global[blxl];
        if (flot_array[item[0]]==null){
            flot_array[item[0]]=[];
        }
        flot_array[item[0]].push([parseInt(item[4].substring(0,4)),item[2]/10000]);
    }
    var list_t=[];
    for (let key in flot_array){
        flot_array[key].sort();
        list_t.push([key].concat(flot_array[key])); //不是 list_t.push([key],flot_array[key]);
    }
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
    return '<tr><td class="td_no" align=right>'+csno+'</td><td>'+item[0]+'</td><td class="td_city">'+item[1]+'</td><td class="td_revenue" align=right>'+item[2].toFixed(fraction_len)+'</td><td class="td_rank" align=right>'+item[3]+'</td><td class="td_year">'+item[4]+'</td></tr>';
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
    
    var blhead='<tr><th class="td_no">No.</th><th>Company</th><th class="td_city">City</th><th class="td_revenue">Revenue(万元)</th><th class="td_rank">当年名次</th><th class="td_year">Year</th></tr>\n';
    if (only_tr){
        bljg=blhead+bljg.join('\n');
    }
    else {
        bljg='<table'+(table_id==''?'':' id="'+table_id+'"')+' class="table_zj_company" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
    }
    if (show_button){
        bljg=bljg+'<p>';
        bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_zjcompany(\'table_zj_company\',\'td_rank\');">名次</span>\n';
        bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_zjcompany(\'table_zj_company\',\'td_year\');">年份</span>\n';
        bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_zjcompany(\'table_zj_company\',\'td_no\');">序号</span>\n';        
        bljg=bljg+'<span class="aclick" onclick="javascript:switch_columns_zjcompany(\'table_zj_company\',\'td_no\',\'td_rank\');">序号与名次对调</span>\n';       
        bljg=bljg+'<span class="aclick" onclick="javascript:switch_columns_zjcompany(\'table_zj_company\',\'td_city\',\'td_revenue\');">城市与地区对调</span>\n';        
        bljg=bljg+'</p><p>';
        bljg=bljg+'<span class="aclick" onclick="javascript:flot_year_revenue_company_line_zjcompany();">年份收入折线图</span>\n';
        bljg=bljg+'<span class="aclick" onclick="javascript:flot_year_revenue_district_line_zjcompany();">地区收入折线图</span>\n';        
        bljg=bljg+'<span class="aclick" onclick="javascript:flot_district_revenue_pie_zjcompany();">地区收入饼图</span>\n';  
        bljg=bljg+'<span class="aclick" onclick="javascript:flot_district_revenue_pie_zjcompany(true,true);">地区家数饼图</span>\n';  
        bljg=bljg+'</p>\n';
        if (cssum!==false){  
            bljg=bljg+'<p>平均收入：'+blaverage+'万元；在平均线上的企业共有 '+average_count+' 家，占 '+(average_count*100/csarray.length).toFixed(2)+' %</p>\n';
        }
    }
    if (show_html){
        document.getElementById('divhtml').innerHTML=bljg;
    }
    return bljg;
}

function array_2_csv_zjcompany(){
    var bljg=[];
    
    var fraction_len=fraction_len_zjcompany(search_result_zj_company_global);
    
    for (let blxl=0;blxl<search_result_zj_company_global.length;blxl++){
        var item=search_result_zj_company_global[blxl];
        bljg.push((blxl+1)+',"'+specialstr_j(item[0])+'","'+specialstr_j(item[1])+'",'+item[2].toFixed(fraction_len)+','+item[3]+',"'+item[4]+'"');
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

function obj2array_zjcompany(){
    var result_t=[];
    for (let key in zj_company_global){
        zj_company_global[key].sort(function (a,b){return a[2]<b[2];})
        for (let blxl=0;blxl<zj_company_global[key].length;blxl++){
            var arow=zj_company_global[key][blxl];
            arow.push(blxl+1);
            arow.push(key+'年');
            result_t.push(arow);
        }
    }
    zj_company_global=result_t;
}

function flot_district_year_revenue_line_zjcompany(is_percent=false,do_count=false){
    var list_t=[];//全局变量 - 保留注释
    for (let item of zj_company_global){
        var blcity=item[1];
        var blyear=item[4].substring(0,4);
        if (list_t[blcity+'_'+blyear]==null){
            list_t[blcity+'_'+blyear]=[blcity,parseInt(blyear),0];  //地区，年份，营收(或个数) - 保留注释
        }
        list_t[blcity+'_'+blyear][2]=list_t[blcity+'_'+blyear][2]+(do_count?1:item[2]);
    }
    list_t=object2array_b(list_t);
    
    var result_t=[];
    for (let item of list_t){
        if (result_t[item[0]]==null){
            result_t[item[0]]=[];
        }
        result_t[item[0]].push([item[1],(do_count?item[2]:item[2]/100000000)]);    //年份,营收 - 保留注释
    }
    
    for (let key in result_t){
        result_t[key]=int_number_list_insert_zero_b(result_t[key]);
        result_t[key]=[key].concat(result_t[key]);  //添加地区，形成 [ 地区,[年份1,营收1(或个数1)],[年份2,营收2(或个数2)] ] - 保留注释
    }
    result_t=object2array_b(result_t);
    //---
    var cskey= document.getElementById('input_search').value.trim();
    var csreg=document.getElementById('input_reg').checked;
    if (cskey.slice(-4,)=='(:r)'){
        csreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }

    var flot_revenue_data=[];
    for (let item of result_t){
		var blfound=str_reg_search_b(item,cskey,csreg); 
		if (blfound==-1){
			break;
		}

		if (cskey=='' || blfound){        
            flot_revenue_data.push(item);
        }
    }
    
    if (flot_revenue_data.length==0){
        alert('无符合条件 '+cskey+' 的记录，仅支持城市筛选，不支持年份筛选');
        return;
    }

    var odiv=div_flot_css_zjcompany(true,false);
    
    if (is_percent){
        var year_sum=[];
        for (let item of flot_revenue_data){
            for (let blxl=1;blxl<item.length;blxl++){
                var blyear=item[blxl][0]+'年';
                if (year_sum[blyear]==null){
                    year_sum[blyear]=0;
                }
                year_sum[blyear]=year_sum[blyear]+item[blxl][1];
            }        
        }

        var flot_percent_data=[];
        for (let blxl=0;blxl<flot_revenue_data.length;blxl++){
            var arr_p=[flot_revenue_data[blxl][0]]; 
            for (let one_year=1;one_year<flot_revenue_data[blxl].length;one_year++){
                var blpercent=flot_revenue_data[blxl][one_year][1]*100/year_sum[flot_revenue_data[blxl][one_year][0]+'年'];
                arr_p.push([flot_revenue_data[blxl][one_year][0],blpercent]);
            }
            flot_percent_data.push(arr_p);
        }
       flot_lines_k(flot_percent_data,'div_flot_zj_company','nw',false,'','m','%',-1,[],-1,false,false,true);
    }
    else {
        flot_lines_k(flot_revenue_data,'div_flot_zj_company','nw',false,'','m',(do_count?'家':'万亿元'),-1,[],-1,false,false,true);
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
    var year_list=new Set();
    var district_list=new Set();
    if (is_all){
        for (let item of zj_company_global){
            year_list.add(item[4]); //格式为 xxxx年 - 保留注释
            district_list.add(item[1]);
        }
    }
    else {
        for (let item of search_result_zj_company_global){
            year_list.add(item[4]);
            district_list.add(item[1]);
        }
    }
    
    return [Array.from(year_list).sort(),Array.from(district_list).sort(function (a,b){return zh_sort_b(a,b);})];
}

function group_zjcompany(){
    var group_district=klmenu_check_b('span_group_district_zjcompany',false);
    var group_year=klmenu_check_b('span_group_year_zjcompany',false);
    if (group_district==false && group_year==false){return;}
    
    var blkey='';
    var result_t=[];
    for (let item of search_result_zj_company_global){
        if (group_district && group_year){
            blkey=item[1]+'_'+item[4];
        }
        else if (group_district ){
            blkey=item[1];
        }        
        else {
            blkey=item[4];
        }
        if (result_t[blkey]==null){
            result_t[blkey]=[];
        }
        result_t[blkey].push(item);
    }

    div_flot_css_zjcompany(false,false);
    var bljg=[];
    for (let key in result_t){
        bljg.push(array_2_html_zjcompany(result_t[key],false,'',true,false,false));
    }
    document.getElementById('divhtml').innerHTML='<table class="table_zj_company" cellpadding=0 cellspacing=0>'+bljg.join('\n')+'</table>\n';
}

function menu_zjcompany(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="http://zjqlw.com/baiqiang.php" target=_blank>百强企业</a>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'format_data_form_zjcompany();">整理原始数据</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'array_2_csv_zjcompany();">导出当前结果为csv</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'two_columns_table_zjcompany();">两栏表格</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'flot_district_year_revenue_line_zjcompany();">地区收入图</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'flot_district_year_revenue_line_zjcompany(true);">地区收入比例图</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'flot_district_year_revenue_line_zjcompany(false,true);">地区家数图</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'flot_district_year_revenue_line_zjcompany(true,true);">地区家数比例图</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'flot_district_revenue_pie_multi_year_zjcompany();">多年地区收入饼图</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'flot_district_revenue_pie_multi_year_zjcompany(true);">多年地区家数饼图</span>',     
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
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏭','12rem','1rem','1rem','60rem')+klmenu_b(menu_years,'年','7rem','1rem','1rem','30rem')+klmenu_b(menu_district,'市','5rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','10rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function init_zjcompany(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    obj2array_zjcompany();    
    recent_search_key_zjcompany();
    menu_zjcompany();
}
