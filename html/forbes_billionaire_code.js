function init_forbes_billionaire(){
    buttons_rank_b('Forbes Billionaire','search_forbes_billionaire();');
    forbes_billionaire_global=obj2array_rank_b(forbes_billionaire_global,1);
    recent_search_key_forbes_billionaire();
    menu_forbes_billionaire();
    data_check_rank_b(forbes_billionaire_global,8,[3]);
}

function menu_forbes_billionaire(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://www.forbeschina.com/lists" target=_blank>Forbes China</a>',    
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_forbes_billionaire(false,-1);">地区人数图</span>',
    '<span class="span_menu" onclick="'+str_t+'line_district_statistics_forbes_billionaire(true,-1);">地区人数比例图</span>',        
    '<span class="span_menu" onclick="'+str_t+'pie_multiyear_district_statistics_forbes_billionaire();">multiyear district wealth pie</span>',     
    '<span class="span_menu" onclick="'+str_t+'pie_multiyear_district_statistics_forbes_billionaire(-1);">多年地区人数饼图</span>',     
    ];

    var menu_years;
    var menu_district;
    [menu_years,menu_district]=year_district_list_forbes_billionaire();
    menu_years.reverse();
    
    for (let blxl=0,lent=menu_years.length;blxl<lent;blxl++){
        menu_years[blxl]='<span class="span_menu" onclick="'+str_t+'search_forbes_billionaire(\''+menu_years[blxl]+'\',false);">'+menu_years[blxl]+'</span>';   
    }

    for (let blxl=0,lent=menu_district.length;blxl<lent;blxl++){
        menu_district[blxl]='<span class="span_menu" onclick="'+str_t+'search_forbes_billionaire(\''+menu_district[blxl]+'\',false);">'+menu_district[blxl]+'</span>';   
    }
    
    var menu_group=[
    '<span class="span_menu" onclick="'+str_t+'no_range_forbes_billionaire();">No. 显示范围</span>',         
    '<span id="span_group_district_forbes_billionaire" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ group by district</span>',    
    '<span id="span_group_year_forbes_billionaire" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ group by year</span>',        
    '<span class="span_menu" onclick="'+str_t+'group_forbes_billionaire();">执行分组</span>',     
    ];
    
    var klmenu_config=root_font_size_menu_b(str_t);
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏭','17rem','1rem','1rem','60rem')+klmenu_b(menu_years,'Year','7rem','1rem','1rem','30rem')+klmenu_b(menu_district,'District','12rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','12rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','15rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function no_range_forbes_billionaire(){
    var otables=document.querySelectorAll('table.table_forbes_billionaire');
    number_td_range_rank_b(otables,'td_no','No.','');
}

function line_district_statistics_forbes_billionaire(is_percent=false,csindex=1){    
    var cskey;
    var csreg;
    [cskey,csreg]=keys_rank_b(false,-1,false);

    var flot_revenue_data=line_district_statistics_flot_array_rank_b(forbes_billionaire_global,cskey,csreg,5,7,csindex,1);
    
    if (flot_revenue_data.length==0){
        alert('无符合条件 '+cskey+' 的记录，仅支持城市筛选，不支持年份筛选');
        return;
    }

    var odiv=div_flot_css_forbes_billionaire(true,false);
    
    if (is_percent){
        flot_lines_b(line_district_statistics_percent_rank_b(flot_revenue_data),'div_flot_forbes_billionaire','nw',false,'','m','%',-1,[],-1,false,false,true);
    } else {
        flot_lines_b(flot_revenue_data,'div_flot_forbes_billionaire','nw',false,'','m',(csindex==-1?'人':'亿美元'),-1,[],-1,false,false,true);
    }

    odiv.scrollIntoView();
}

function line_district_revenue_forbes_billionaire(return_percent=false,csindex=3){
    var flot_array=line_district_revenue_rank_b(search_result_forbes_billionaire_global,5,7,csindex,1);
    div_flot_css_forbes_billionaire(true,false);    

    if (return_percent){
        var bljg=line_district_revenue_percent_rank_b(flot_array,1,1,'财富(亿美元)');
        document.getElementById('div_flot_forbes_billionaire').innerHTML='<table class="table_forbes_billionaire table_common" cellpadding=0 cellspacing=0>'+bljg+'</table>';   
        return;
    }

    flot_lines_b(object2array_b(flot_array),'div_flot_forbes_billionaire','nw',false,'','m','亿美元',-1,[],-1,false,false,true);
}

function year_district_list_forbes_billionaire(){
    return year_district_list_rank_b(forbes_billionaire_global,7,5);
}

function group_forbes_billionaire(){
    var group_district=klmenu_check_b('span_group_district_forbes_billionaire',false);
    var group_year=klmenu_check_b('span_group_year_forbes_billionaire',false);
    if (group_district==false && group_year==false){return;}
    
    var result_t=group_rank_b(search_result_forbes_billionaire_global,group_district,group_year,5,7);
    var bljg=[];
    for (let key in result_t){
        bljg.push(array_2_html_forbes_billionaire(result_t[key],false,'',true,false,false));
    }

    div_flot_css_forbes_billionaire(false,false);    
    bljg='<table id="table_group_forbes_billionaire" class="table_forbes_billionaire table_common" cellpadding=0 cellspacing=0>'+bljg.join('\n')+'</table>\n';
    bljg=bljg+'<p>'+table_buttons_set_rank_b('table_group_forbes_billionaire',[['td_district','Country']],false)+'</p>';    
    document.getElementById('divhtml').innerHTML=bljg;
}

function recent_search_key_forbes_billionaire(csstr=''){
    recent_search_b('recent_search_forbes_billionaire',csstr,'search_forbes_billionaire','div_recent_search',['阿里巴巴','美国',(new Date().getFullYear()-1)+'年']);
}

function search_forbes_billionaire(cskey=false,csreg=-1,show_html=true){    
    [cskey,csreg]=keys_rank_b(cskey,csreg,show_html);
    
    if (show_html){
        recent_search_key_forbes_billionaire(cskey+(csreg?'(:r)':''));
    }
    
    var blsum=0;
    [search_result_forbes_billionaire_global,blsum]=search_rank_b(forbes_billionaire_global,cskey,csreg,3,0,7);
    if (show_html){
        array_2_html_forbes_billionaire(search_result_forbes_billionaire_global,blsum);
    }
}

function array_2_html_forbes_billionaire(csarray,cssum=false,table_id='table_forbes_billionaire',only_tr=false,show_button=true,show_html=true){
    var bljg=[];
    var blaverage=(cssum===false?false:(cssum/csarray.length));
    var average_count=0;
    
    for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
        var item=csarray[blxl];
        if (cssum!==false && item[3]>=blaverage){
            average_count=average_count+1;
        }
        bljg.push(one_td_forbes_billionaire(item,blxl+1));
    }
    
    if (show_html){
        document.getElementById('divhtml').innerHTML='';
        div_flot_css_forbes_billionaire(false,false);
    }
    if (bljg.length==0){
        return '';
    }
    
    var blhead='<tr><th class="td_no">No.</th><th class="td_rank">当年名次</th><th>Name</th><th>姓名</th><th class="td_revenue">财富<small>(亿美元)</small></th><th class="td_source">来源</th><th class="td_district">地区</th><th class="td_year">Year</th></tr>\n';
    if (only_tr){
        bljg=blhead+bljg.join('\n');
    } else {
        bljg='<table'+(table_id==''?'':' id="'+table_id+'"')+' class="table_forbes_billionaire table_common" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
    }
    if (show_button){
        bljg=bljg+'<p style="margin-top:0.5rem;">';
        bljg=bljg+'<select onchange="flot_type_forbes_billionaire(this.value);" style="height:2rem;">';
        for (let item of ['','个人财富折线图(中)','个人财富折线图(EN)','地区财富折线图','地区财富饼图','地区人数饼图']){
            bljg=bljg+'<option>'+item+'</option>\n';
        }
        bljg=bljg+'</select>';
        bljg=bljg+'</p>\n';
        if (cssum!==false){  
            bljg=bljg+'<p>总财富：'+cssum.toFixed(2)+'亿美元；平均财富：'+blaverage.toFixed(2)+'亿美元；在平均线上的共有 '+average_count+' 人次，占 '+(average_count*100/csarray.length).toFixed(2)+' %</p>\n';
        }
    }
    if (show_html){
        bljg=bljg+'<p>'+table_buttons_set_rank_b('table_forbes_billionaire',[['td_district','Country']],false)+'</p>';    
        document.getElementById('divhtml').innerHTML=bljg;
    }
    return bljg;
}

function one_td_forbes_billionaire(item,csno){
    var bljg='<tr>';
    bljg=bljg+'<td class="td_no" align=right>'+csno+'</td>';
    bljg=bljg+'<td class="td_rank">'+item[0]+'</td>';
    bljg=bljg+'<td>'+item[1]+'</td>';
    bljg=bljg+'<td>'+item[2]+'</td>';
    bljg=bljg+'<td class="td_revenue" align=right>'+item[3]+'</td>';
    bljg=bljg+'<td class="td_source" align=right>'+item[4]+'</td>';
    bljg=bljg+'<td class="td_district">'+item[5]+'</td>';
    bljg=bljg+'<td class="td_year">'+item[7]+'</td>';
    bljg=bljg+'</tr>';
    return bljg;
}

function div_flot_css_forbes_billionaire(csshow=true,fullscreen=false){
    return div_flot_css_rank_b('div_flot_forbes_billionaire',csshow,fullscreen);
}

function flot_type_forbes_billionaire(cstype){
    switch (cstype){
        case '个人财富折线图(中)':
            line_personal_revenue_forbes_billionaire(2);
            break;
        case '个人财富折线图(EN)':
            line_personal_revenue_forbes_billionaire(1);
            break;
        case '地区财富折线图':
            line_district_revenue_forbes_billionaire();
            break;                
        case '地区财富饼图':
            pie_district_statistics_forbes_billionaire();
            break;      
        case '地区人数饼图':
            pie_district_statistics_forbes_billionaire(true,-1);
            break;
    }
    document.getElementById('div_flot_forbes_billionaire').scrollIntoView();
}

function line_personal_revenue_forbes_billionaire(csindex=1){
    var list_t=line_company_revenue_rank_b(search_result_forbes_billionaire_global,7,3,1,csindex);
    div_flot_css_forbes_billionaire(true,false);    
    flot_lines_b(list_t,'div_flot_forbes_billionaire','nw',false,'','m','亿美元',-1,[],-1,false,false,true);
}

function pie_district_statistics_forbes_billionaire(show_chart=true,csindex=3){
    var list_t=pie_district_statistics_array_rank_b(search_result_forbes_billionaire_global,5,csindex);
    if (!show_chart){
        return list_t;
    }
    
    var bljg=[];
    [list_t,bljg]=pie_district_statistics_string_rank_b(list_t,1,'亿美元',1,csindex);

    var div_id='div_district_revenue_pie_data_forbes_billionaire';
    var odiv=document.getElementById(div_id);
    if (!odiv){
        document.getElementById('divhtml').insertAdjacentHTML('beforeend','<div id="'+div_id+'" style="column-count:3;"></div>');
    }
    document.getElementById(div_id).innerHTML=array_2_li_b(bljg);
    div_flot_css_forbes_billionaire(true,false);
    flot_pie_b(list_t,'div_flot_forbes_billionaire');
}

function pie_multiyear_district_statistics_forbes_billionaire(csindex=3){
    var years=year_district_list_forbes_billionaire()[0];
    if (years.length==0){return;}
       
    var cskey;
    var csreg;
    [cskey,csreg]=keys_rank_b(false,-1,false);    
    
    var result_t=[];
    for (let item of years){
		var blfound=str_reg_search_b(item,cskey,csreg); //仅支持对年份过滤 - 保留注释
		if (blfound==-1){break;}
        
		if (cskey=='' || blfound){        
            search_forbes_billionaire(item,false,false);
            result_t.push([item,pie_district_statistics_forbes_billionaire(false,csindex)]);
        }
    }
    
    document.getElementById('divhtml').innerHTML='';
    var odiv=div_flot_css_forbes_billionaire(true,true);
    odiv.innerHTML='<h3 id="h3_multi_year_pi" style="cursor:pointer;" ondblclick="popup_show_hide_b(\'div_buttons\');">多年地区'+['人数','','','','财富'][csindex+1]+'饼图</h3>';
    
    for (let one_year_data of result_t){
        var list_t=[];
        for (let item of one_year_data[1]){
            list_t.push({'label': item[0],'data': item[1]});
        }
        var blid='div_flot_forbes_billionaire'+one_year_data[0].substring(0,4);
        odiv.insertAdjacentHTML('beforeend','<div style="position:relative;float:left;margin:0.5rem;"><div id="'+blid+'" style="width:300px; height:300px;"></div><p align=center>'+one_year_data[0]+'</p></div>\n');
        flot_pie_b(list_t,blid);
    }
    search_result_forbes_billionaire_global=[];
}
