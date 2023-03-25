function init_qs_rank(){
    buttons_rank_b('QS University '+qs_region_global[0].toUpperCase() + qs_region_global.substring(1),'search_qs_rank()');
    for (let key in qs_university_raw_global){
        console.log(key,qs_university_raw_global[key].length);
    }
    qs_university_raw_global=obj2array_rank_b(qs_university_raw_global,-1);    
    recent_search_key_qs_rank();
    menu_qs_rank();    
    data_check_rank_b(qs_university_raw_global,6,[3]);    
}

function args_qs_rank(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：.htm?s=english& - 保留注释
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,7)=='region='){
                qs_region_global=one_key.substring(7,).trim();
                break;
            }
        }
    }
    if (qs_region_global==''){
        qs_region_global='asia';
    }
    document.title='🏛 QS University: '+qs_region_global;
}

function is_unique_qs_asis(){
    var set_t=new Set();
    var result_t=[];
    for (let item of qs_university_raw_global){
        var blstr=item.toString();
        if (set_t.has(blstr)){
            document.getElementById('divhtml').innerHTML=blstr;
            return;
        }
        set_t.add(blstr);
    }
    document.getElementById('divhtml').innerHTML='无重复记录';
}

function university_rank_qs_asis(){
    var year_t=new Set();
    var uinversity_district=new Set();
    for (let item of search_result_qs_rank_global){
        year_t.add(item[5]);
        uinversity_district.add(item[1]+'分隔'+item[2]);  //英文名称中不会出现中文 - 保留注释
    }
    
    year_t=Array.from(year_t).sort().reverse(); //年份逆序 - 保留注释
    var result_t={};
    for (let one_university of uinversity_district){
        result_t[one_university]={};
        for (let one_year of year_t){
            result_t[one_university][one_year]=['','',''];  //排名 分数  顺序位次
        }
    }
    
    for (let item of search_result_qs_rank_global){
        result_t[item[1]+'分隔'+item[2]][item[5]]=[item[0],item[3],item[4]];
    }
    
    var bljg=[];
    for (let key in result_t){  //每一个学校 - 保留注释
        var list_t=key.split('分隔');
        if (list_t.length!==2){continue;}
        var blstr='<tr>\n<td>'+list_t[0]+'<br /><small>'+list_t[1]+'</small></td>\n';
        result_t[key]=object2array_b(result_t[key],true);
        result_t[key].sort().reverse();  //年份逆序 - 保留注释
        for (let one_year of result_t[key]){  //每一年 - 保留注释
            blstr=blstr+'<td align=right style="font-weight:bold;">'+one_year[1]+'</td>\n';
            blstr=blstr+'<td align=right>'+one_year[2]+'</td>\n';
            blstr=blstr+'<td align=right style="color:'+scheme_global['memo']+';">'+one_year[3]+'</td>\n';
        }
        blstr=blstr+'</tr>';
        bljg.push(blstr);
    }

    var blhead1='<tr><th rowspan=2>学校</th>';
    var blhead2='<tr>';
    for (let item of year_t){
        blhead1=blhead1+'<th colspan=3>'+item+'</th>';
        blhead2=blhead2+'<th>排名</th><th>分数</th><th>顺序排位</th>';
    }
    blhead1=blhead1+'</tr>\n';
    blhead2=blhead2+'</tr>\n';

    document.getElementById('divhtml').innerHTML='<table class="table_qs_rank table_common" cellpadding=0 cellspacing=0>'+blhead1+blhead2+bljg.join('\n')+'</table>';
}

function search_qs_rank(cskey=false,csreg=-1){
    [cskey,csreg]=keys_rank_b(cskey,csreg,true);

    recent_search_key_qs_rank(cskey+(csreg?'(:r)':''));

    search_result_qs_rank_global=[];
    for (let item of qs_university_raw_global){
		var blfound=str_reg_search_b(item.toString(),cskey,csreg);
		if (blfound==-1){break;}

		if (cskey=='' || blfound){        
            search_result_qs_rank_global.push(item);
        }
    }
    
    array_2_html_qs_rank(search_result_qs_rank_global);
}

function array_2_html_qs_rank(csarray,table_id='table_qs_rank',only_tr=false,show_html=true){
    var bljg=[];
    
    for (let blxl=0;blxl<csarray.length;blxl++){
        var item=csarray[blxl];
        var blstr='';
        blstr=blstr+'<td align="center">'+item[0]+'</td>';
        blstr=blstr+'<td>'+item[1]+'</td>';
        blstr=blstr+'<td>'+item[2]+'</td>';
        blstr=blstr+'<td align="right">'+item[3]+'</td>';
        blstr=blstr+'<td align="right">'+item[4]+'</td>';
        blstr=blstr+'<td align="center">'+item[5]+'</td>';
        
        bljg.push('<tr>'+blstr+'</tr>');
    }
    
    var blhead='<tr><th>排名</th><th>学校</th><th>地区</th><th>分数</th><th>当年顺序排位</th><th>年份</th></tr>\n';

    if (only_tr){
        bljg=blhead+bljg.join('\n');
    }
    else {
        bljg='<table'+(table_id==''?'':' id="'+table_id+'"')+' class="table_qs_rank table_common" cellpadding=0 cellspacing=0>'+blhead+bljg.join('\n')+'</table>\n';
    }
    if (show_html){    
        document.getElementById('divhtml').innerHTML=bljg;
    }
    return bljg;
}

function menu_qs_rank(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];   

    var group_list=[
    ['World','window.open(\'https://www.topuniversities.com/university-rankings/world-university-rankings/\');',true],
    ['Asia','window.open(\'https://www.topuniversities.com/university-rankings/asian-university-rankings/\');',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'link: '));

    group_list=[
    ['World','window.open(\'?region=world\');',true],
    ['Asia','window.open(\'?region=asia\');',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'type: '));
    
    var menu_group=[
    '<span class="span_menu" onclick="'+str_t+'is_unique_qs_asis();">重复记录检查</span>',  
    '<span class="span_menu" onclick="'+str_t+'university_rank_qs_asis();">多年记录表</span>',  
    '<span id="span_group_year_qs_rank" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 按年份分组</span>',        
    '<span class="span_menu" onclick="'+str_t+'group_qs_rank();">执行分组</span>',     
    ];

    var menu_years;
    var menu_district;
    [menu_years,menu_district]=year_district_list_rank_b(qs_university_raw_global,5,2);
    menu_years.reverse();
    
    for (let blxl=0;blxl<menu_years.length;blxl++){
        menu_years[blxl]='<span class="span_menu" onclick="'+str_t+'search_qs_rank(\''+menu_years[blxl]+'\',false);">'+menu_years[blxl]+'</span>';   
    }

    var country_set=new Set();
    var country_list=[];
    for (let item of menu_district){
        item=item.replace(new RegExp(/^.*,([A-Z].*)$/,'g'),'$1').trim();
        if (country_set.has(item)){continue;}
        country_set.add(item);
        country_list.push('<span class="span_menu" onclick="'+str_t+'search_qs_rank(\''+item+'\',false);">'+item+'</span>');
    }
    country_list.sort(function (a,b){return zh_sort_b(a,b);});
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏛','16rem','1rem','1rem','60rem'),'','0rem')+klmenu_b(menu_years,'年','7rem','1rem','1rem','30rem')+klmenu_b(country_list,'国','12rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','10rem','1rem','1rem','30rem')+' ');
}

function recent_search_key_qs_rank(csstr=''){
    recent_search_b('recent_search_qs_rank',csstr,'search_qs_rank','div_recent_search',[(new Date().getFullYear()-1)+'年','^=?[1-2]?[0-9]?,(:r)']);
}

function group_qs_rank(){
    var group_year=klmenu_check_b('span_group_year_qs_rank',false);
    if (group_year==false){return;}
    
    var result_t=group_rank_b(search_result_qs_rank_global,false,group_year,-1,5);
    var bljg=[];
    for (let key in result_t){
        bljg.push(array_2_html_qs_rank(result_t[key],'',true,false));
    }

    document.getElementById('divhtml').innerHTML='<table class="table_qs_rank table_common" cellpadding=0 cellspacing=0>'+bljg.join('\n')+'</table>\n';
}
