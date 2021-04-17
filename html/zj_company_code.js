function recent_search_zjcompany(csstr=''){
    recent_search_b('recent_search_zjcompany',csstr,'search_zjcompany','div_recent_search',['阿里巴巴','^[1-3]$(:r)',(new Date().getFullYear()-1)+'年']);
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
        cskey=new Date().getFullYear();
    }
    if (show_html){
	    document.getElementById('input_search').value=cskey;    
	    document.getElementById('input_reg').checked=csreg;
    }
    recent_search_zjcompany(cskey+(csreg?'(:r)':''));
    
    search_result_zj_company_global=[];
    for (let item of zj_company_global){
		var blfound=str_reg_search_b(item,cskey,csreg);
		if (blfound==-1){
			break;
		}

		if (blfound){        
            search_result_zj_company_global.push(item);
        }
    }
    if (search_result_zj_company_global.length==0){return;}

    search_result_zj_company_global.sort(function (a,b){return a[2]<b[2];});
    search_result_zj_company_global.sort(function (a,b){return a[3]>b[3];});
    search_result_zj_company_global.sort(function (a,b){return a[4]<b[4];});
    if (show_html){
        array_2_html_zjcompany();
    }
}

function show_hide_zjcompany(cstype){
    var otable=document.getElementById('table_zj_company');
    if (!otable){return;}
    var otds=otable.querySelectorAll('th,td');
    for (let one_td of otds){
        if (!one_td.classList.contains(cstype)){continue;}
        one_td.style.display=(one_td.style.display==''?'none':'');
    }
}

function switch_columns_zjcompany(tdclass1,tdclass2){
    var otable=document.getElementById('table_zj_company');
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

function flot_zjcompany(){
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
    document.getElementById('div_flot_zj_company').style.display='';
    flot_lines_k(list_t,'div_flot_zj_company','nw',false,'','m','亿元',-1,[],-1,false,false,true);
}

function array_2_html_zjcompany(cstype='table'){
    var bljg=[];
    
    var fraction_len=0;
    for (let item of search_result_zj_company_global){
        var list_t=item[2].toString().split('.');
        if (list_t.length==2){
            fraction_len=Math.max(fraction_len,list_t[1].length);
        }
        if (fraction_len==2){break;}
    }
    
    for (let blxl=0;blxl<search_result_zj_company_global.length;blxl++){
        var item=search_result_zj_company_global[blxl];
        if (cstype=='table'){
            bljg.push('<tr><td class="td_no" align=right>'+(blxl+1)+'</td><td>'+item[0]+'</td><td class="td_city">'+item[1]+'</td><td class="td_revenue" align=right>'+item[2].toFixed(fraction_len)+'</td><td class="td_rank" align=right>'+item[3]+'</td><td class="td_year">'+item[4]+'</td></tr>');
        }
        else if (cstype=='csv') {
            bljg.push((blxl+1)+',"'+specialstr_j(item[0])+'","'+specialstr_j(item[1])+'",'+item[2].toFixed(fraction_len)+','+item[3]+',"'+item[4]+'"');            
        }
    }

    if (cstype=='table'){
        var blhead='<tr><th class="td_no">No.</th><th>Company</th><th class="td_city">City</th><th class="td_revenue">Revenue(万元)</th><th class="td_rank">当年名次</th><th class="td_year">Year</th></tr>\n';
        bljg='<table id="table_zj_company" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
        bljg=bljg+'<p>';
        bljg=bljg+'<span class="aclick" onclick="javascript:flot_zjcompany();">显示统计图</span>\n';
        bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_zjcompany(\'td_rank\');">名次</span>\n';
        bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_zjcompany(\'td_year\');">年份</span>\n';
        bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_zjcompany(\'td_no\');">序号</span>\n';        
        bljg=bljg+'<span class="aclick" onclick="javascript:switch_columns_zjcompany(\'td_no\',\'td_rank\');">序号与名次对调</span>\n';       
        bljg=bljg+'<span class="aclick" onclick="javascript:switch_columns_zjcompany(\'td_city\',\'td_revenue\');">城市与地区对调</span>\n';               
        bljg=bljg+'</p>\n';
        bljg=bljg+'<div id="div_flot_zj_company" style="width:900px; height:700px;display:none;"></div>\n';
        document.getElementById('divhtml').innerHTML=bljg;
    }
    else if (cstype=='csv') {
        var blhead='"No.","Company","City","Revenue(万元)","当年名次","Year"\n';        
        string_2_txt_file_b(blhead+bljg.join('\n'),'zj_company_export_'+now_time_str_b("-",true)+'.csv','csv');
    }
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
    result_t=[];
    for (let key in zj_company_global){
        zj_company_global[key].sort(function (a,b){return a[2]<b[2];})
        for (let blxl=0;blxl<zj_company_global[key].length;blxl++){
            var arow=zj_company_global[key][blxl];
            arow.push(blxl+1);
            arow.push(key+'年');
            //arow[2]=Math.round(arow[2]);
            result_t.push(arow);
        }
    }
    zj_company_global=result_t;
}

function two_columns_table_zjcompany(){
    var otable=document.getElementById('table_zj_company');
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

function menu_zjcompany(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="http://zjqlw.com/baiqiang.php" target=_blank>百强企业</a>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'format_data_form_zjcompany();">整理原始数据</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'array_2_html_zjcompany(\'csv\');">导出当前结果为csv</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'two_columns_table_zjcompany();">两栏表格</span>',        
    ];

    var year_list=new Set();
    for (let item of zj_company_global){
        year_list.add(item[4]);
    }
    year_list=Array.from(year_list).sort().reverse();
    
    for (let blxl=0;blxl<year_list.length;blxl++){
        year_list[blxl]='<span class="span_menu" onclick="javascript:'+str_t+'search_zjcompany(\''+year_list[blxl]+'\',false);">'+year_list[blxl]+'</span>';   
    }
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏭','14rem','1rem','1rem','60rem')+klmenu_b(year_list,'年','6rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function init_zjcompany(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    obj2array_zjcompany();    
    recent_search_zjcompany();
    menu_zjcompany();
}
