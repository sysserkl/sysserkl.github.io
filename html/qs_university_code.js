function init_qs_rank(){
    buttons_rank_b('QS University '+qs_region_global[0].toUpperCase() + qs_region_global.substring(1),'search_qs_rank()');
    
    var repeated_data=[];
    for (let key in qs_university_raw_global){
        console.log(key,qs_university_raw_global[key].length);
        
        var list_t=name_unique_check_qs_rank(qs_university_raw_global[key]);
        if (list_t.length>0){
            repeated_data.push('<h3>'+key+'重复记录</h3>'+array_2_li_b(list_t));
        }
    }
    qs_university_raw_global=obj2array_rank_b(qs_university_raw_global,-1);    
    recent_search_key_qs_rank();
    menu_qs_rank();    
    data_check_rank_b(qs_university_raw_global,6,[3]);    
    
    if (repeated_data.length>0){
        document.getElementById('divhtml').innerHTML=repeated_data.join('\n');
    }
}

function name_unique_check_qs_rank(one_year){
    var name_set=new Set();
    var result_t=[];
    for (let arow of one_year){
        var blstr=arow.toString();
        if (name_set.has(blstr)){
            result_t.push(blstr);
        }
        name_set.add(blstr);
    }
    return result_t;
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

function is_unique_qs_rank(){
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

function years_qs_rank(){
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
        document.getElementById('span_count').innerHTML=' '+csarray.length+'/'+qs_university_raw_global.length+'/'+(csarray.length*100/qs_university_raw_global.length).toFixed(2)+'%'
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
    '<span class="span_menu" onclick="'+str_t+'search_qs_rank(\'^=?\\\\d{1,2}\\\\b,.*, ^=?100,.*\',true);">排名前100名的学校</span>',          
    '<span class="span_menu" onclick="'+str_t+'is_unique_qs_rank();">重复记录检查</span>',  
    '<span class="span_menu" onclick="'+str_t+'years_qs_rank();">多年记录表</span>',  
    '<span id="span_group_year_qs_rank" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 按年份分组</span>',        
    '<span class="span_menu" onclick="'+str_t+'group_qs_rank();">执行分组</span>',     
    ];

    var menu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'name_district_statistics_qs_rank(false);">当前条件学校、地区统计</span>',          
    '<span class="span_menu" onclick="'+str_t+'name_district_statistics_by_years_qs_rank();">当前条件学校、地区分年统计</span>',          
    '<span class="span_menu" onclick="'+str_t+'jieba_name_qs_rank();">当前条件学校名称分词</span>',
    ];

    group_list=[
    ['⚪ 大学','klmenu_check_b(this.id,true);',true,'span_university_statistics_qs_rank'],
    ['⚪ 地区','klmenu_check_b(this.id,true);',true,'span_district_statistics_qs_rank'],
    ['⚪ 国家','klmenu_check_b(this.id,true);',true,'span_country_statistics_qs_rank'],
    ];    
    menu_statistics.push(menu_container_b(str_t,group_list,'统计：'));

    group_list=[
    ['⚪ 统计表','klmenu_check_b(this.id,true);',true,'span_table_statistics_qs_rank'],
    ['⚪ 图形','klmenu_check_b(this.id,true);',true,'span_flot_statistics_qs_rank'],
    ];    
    menu_statistics.push(menu_container_b(str_t,group_list,'显示：'));
    
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
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🏛','10rem','1rem','1rem','60rem')+klmenu_b(menu_years,'年','7rem','1rem','1rem','30rem')+klmenu_b(country_list,'国','12rem','1rem','1rem','30rem')+klmenu_b(menu_group,'👥','12rem','1rem','1rem','30rem')+klmenu_b(menu_statistics,'🧮','16rem','1rem','1rem','30rem'),'','0rem')+' ');
    
    for (let item of ['span_university_statistics_qs_rank','span_district_statistics_qs_rank','span_country_statistics_qs_rank','span_table_statistics_qs_rank','span_flot_statistics_qs_rank']){
        klmenu_check_b(item,true);        
    }
}

function name_district_statistics_by_years_qs_rank(){
    var year_dict={};
    for (let item of search_result_qs_rank_global){
        var blyear='y_'+item[5];
        if (year_dict[blyear]==undefined){
            year_dict[blyear]=[];
        }
        year_dict[blyear].push(item);
    }

    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='';
    
    var set_list=statistics_set_get_qs_rank();
    
    var blxl=0;
    for (let key in year_dict){
        odiv.insertAdjacentHTML('beforeend','<h3>'+key.substring(2,)+'</h3>');    
        var list_t=name_district_statistics_qs_rank(year_dict[key],set_list,blxl.toString(),false);
        for (let item of list_t){
            odiv.insertAdjacentHTML('beforeend',item[0]);
            flot_pie_b(item[1],item[2]);
        }
        blxl=blxl+1;
    }
}

function statistics_set_get_qs_rank(){
    var set_list=[];
    for (let item of ['span_university_statistics_qs_rank','span_district_statistics_qs_rank','span_country_statistics_qs_rank','span_table_statistics_qs_rank','span_flot_statistics_qs_rank']){
        set_list.push(klmenu_check_b(item,false));        
    }
    return set_list;
}

function name_district_statistics_qs_rank(csarray=false,set_list=false,id_no='',show_html=true){
    function sub_name_district_statistics_qs_rank_to_array(csobj,cscount,caption,flot_id_name,odiv,id_no,set_list,show_html){
        csobj=object2array_b(csobj,true,2);
        csobj.sort();
        csobj.sort(function (a,b){return a[1]<b[1];});
        var bljg=[];
        var others=0;
        var flot_list=[];
        for (let blxl=0;blxl<csobj.length;blxl++){
            var blprecent=(csobj[blxl][1]*100/cscount).toFixed(2)+'%';
            bljg.push('<tr><td>'+(blxl+1)+'</td><td>'+csobj[blxl][0]+'</td><td align="right">'+csobj[blxl][1]+'</td><td align="right">'+blprecent+'</td></tr>');
            if (blxl>=15){
                others=others+csobj[blxl][1];
            }
            else {
                flot_list.push({'label':csobj[blxl][0],'data':csobj[blxl][1]});
            }
        }
        if (others>0){
            flot_list.push({'label':'others','data':others});
        }
        
        if (set_list[3]){
            bljg='<section style="max-height:40rem;overflow:auto;"><table class="table_common"><tr><th>No.</th><th>'+caption+'</th><th>Count</th><th>Percent</th></tr>'+bljg.join('\n')+'</table></section>';
        }
        else {
            bljg='';
        }
        if (set_list[4]){
            bljg=bljg+'<div id="div_flot_'+flot_id_name+id_no+'_qs_rank" style="width:600px;height:600px;"></div>';        
        }
        if (show_html){
            odiv.insertAdjacentHTML('beforeend',bljg);
        }
        if (set_list[4] && show_html){
            flot_pie_b(flot_list,'div_flot_'+flot_id_name+id_no+'_qs_rank');
        }
        return [bljg,flot_list,'div_flot_'+flot_id_name+id_no+'_qs_rank'];
    }
    //---------------------
    if (set_list===false){
        set_list=statistics_set_get_qs_rank();
    }
    
    var university_list={};
    var university_count=0;
    var district_list={};
    var district_count=0;
    var country_list={};
    var country_count=0;
    if (csarray===false){
        csarray=search_result_qs_rank_global;
    }
    for (let item of csarray){
        if (set_list[0]){
            var blkey='n_'+item[1];
            if (university_list[blkey]==undefined){
                university_list[blkey]=0;
            }
            university_list[blkey]=university_list[blkey]+1;
            university_count=university_count+1;
        }
        
        var blstr=item[2].replace(/,+/g,',');
        var list_t=blstr.split(',');
        if (list_t.length>2){
            console.log('district, country error:',item);  //此行保留 - 保留注释
        }
                
        var district_name='';
        var country_name='';
        if (list_t.length>=2){
            district_name=blstr;
            country_name=list_t[1].trim();
        }
        else if (list_t.length==1){
            country_name=list_t[0].trim();
        }
        
        if (set_list[1] && district_name!==''){
            var blkey='d_'+district_name;
            if (district_list[blkey]==undefined){
                district_list[blkey]=0;
            }
            district_list[blkey]=district_list[blkey]+1;        
            district_count=district_count+1;
        }
        
        if (set_list[2] && country_name!==''){
            var blkey='c_'+country_name;
            if (country_list[blkey]==undefined){
                country_list[blkey]=0;
            }
            country_list[blkey]=country_list[blkey]+1;        
            country_count=country_count+1;
        }
    }

    var odiv=document.getElementById('divhtml');
    if (show_html){
        odiv.innerHTML='';
    }
    
    var university_str='';
    var district_str='';
    var country_str='';
    
    var university_flot=[];
    var district_flot=[];
    var country_flot=[];
    
    var university_flot_id='';
    var district_flot_id='';
    var country_flot_id='';
    
    if (set_list[0]){
        [university_str,university_flot,university_flot_id]=sub_name_district_statistics_qs_rank_to_array(university_list,university_count,'University','University',odiv,id_no,set_list,show_html);    
    }
    if (set_list[1]){
        [district_str,district_flot,district_flot_id]=sub_name_district_statistics_qs_rank_to_array(district_list,district_count,'District','District',odiv,id_no,set_list,show_html);
    }
    if (set_list[2]){    
        [country_str,country_flot,country_flot_id]=sub_name_district_statistics_qs_rank_to_array(country_list,country_count,'Country/Region','Country',odiv,id_no,set_list,show_html);
    }
    return [[university_str,university_flot,university_flot_id],[district_str,district_flot,district_flot_id],[country_str,country_flot,country_flot_id]];
}

function jieba_name_qs_rank(){
    var name_list=[];
    for (let item of search_result_qs_rank_global){
        name_list.push(item[1]);
    }
    
    var caption=['校名重复','校名不重复'];
    var list_t=[name_list.join(' '),array_unique_b(name_list).join(' ')];
    for (let blxl=0;blxl<list_t.length;blxl++){
        var word_list=list_t[blxl].replace(/[\s\-\(\),]+/g, ' ').split(' ');
        var name_dict=list_category_count_b(word_list,false);
        name_dict.sort(function (a,b){return a[1]<b[1];});
        var name_list=[];
        for (let item of name_dict){
            name_list.push(item[0]);
        }
        
        list_t[blxl]='<h3>'+caption[blxl]+'</h3><textarea style="height:10rem;">'+name_list+'</textarea><textarea style="height:15rem;">'+name_dict.join('\n')+'</textarea>';
    }
    
    var buttons='<p>'+close_button_b('div_status','')+'</p>';
    var odiv=document.getElementById('div_status');
    odiv.innerHTML=list_t.join('\n')+buttons;
    odiv.scrollIntoView();
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
