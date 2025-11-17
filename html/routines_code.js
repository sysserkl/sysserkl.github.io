//-----------------------
//history
//0.0.7-20221228 不重复显示同名未完成项
//0.0.6-20220617 每周柱状图 每月柱状图
//0.0.5-20220117 采用 /// 格式，增加统计筛选
//0.0.4-20200913 增加逐个修改、删除事项功能
//0.0.3-20200901 事项改为保存到 localStorage 中，添加 PWA
//0.0.2-20200220 增加 菜单 和 统计功能
//0.0.1-20191222
//-----------------------
function statistics_form_klroutines(){
    var bljg='';
    bljg=bljg+'<p>输入以往每周执行记录：</p>';
    bljg=bljg+'<p><textarea id="textarea_statistics" style="width:90%;height:20rem;"></textarea></p>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="statistics_items_klroutines();">Item</span>';
    bljg=bljg+'<span class="aclick" onclick="statistics_category_klroutines();">Category</span>';
    bljg=bljg+'<span class="aclick" onclick="statistics_date_klroutines();">Date</span>';
    bljg=bljg+'<span class="aclick" onclick="statistics_category_date_klroutines();">Category&amp; Date</span> ';    
    bljg=bljg+'<input type="text" id="input_filter_statistics_klroutines" placeholder="filter" /> ';
    bljg=bljg+close_button_b('divhtml2','');    
    bljg=bljg+'</p>\n';    
    
    for (let item of div_canvas_list_klroutines_global){
        bljg=bljg+'<div id="'+item+'" style="width:100%;display:none;"></div>\n';
    }
    document.getElementById('divhtml2').innerHTML=bljg;
    
    var blwidth=document.body.clientWidth/3;
    for (let item of div_canvas_list_klroutines_global){    
        document.getElementById(item).style.height=blwidth+'px';
    }
    
    var input_list=[
    ['input_filter_statistics_klroutines',12,0.8],
    ];
    input_size_b(input_list,'id');    
}

function statistics_filter_klroutines(){
    var otextarea=document.getElementById('textarea_statistics');
    var list_t=otextarea.value.trim().split('\n');
    var filter_str=document.getElementById('input_filter_statistics_klroutines').value;
    if (filter_str==''){
        return list_t;
    }
    
    var isreg=false;
    if (filter_str.slice(-4)=='(:r)'){
        filter_str=filter_str.substring(0,filter_str.length-4);
        isreg=true;
    }
        
    var result_t=[];
    for (let item of list_t){
		var blfound=str_reg_search_b(item,filter_str,isreg);
		if (blfound==-1){
			break;
		}
		if (blfound){
			result_t.push(item);
		}
    }
    return result_t;
}

function statistics_items_klroutines(){
    var list_t=statistics_filter_klroutines();
    var list2_t=[];
    for (let item of list_t){
        item=item.split(' /// ');
        if (item.length!==3){continue;}
        list2_t.push(item[0].trim());
    }
    //-----------------------
    list_t=[];
    list2_t.sort();
    for (let item of list2_t){
        if (list_t[item]==undefined){
            list_t[item]=[item,0];
        }
        list_t[item][1]=list_t[item][1]+1;
    }
    //-----------------------
    list2_t=[];
    for (let blxl in list_t){
        list2_t.push([list_t[blxl][0],list_t[blxl][1]]);
    }
    list2_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    
    var bljg=[];
    var simple_list=[];
    var bltotal=0;
    for (let item of list2_t){
        bljg.push(item[0]+': '+item[1]);
        simple_list.push(item[0]);
        bltotal=bltotal+item[1];
    }
    //-----------------------
    var zero_list=[];
    for (let item of routines_data_global){
        if (simple_list.includes(item[2]) || zero_list.includes(item[2])){continue;}
        zero_list.push(item[2]);
    }
    for (let item of zero_list){
        bljg.push(item+': 0');
    }
    document.getElementById('divhtml').innerHTML=array_2_li_b(bljg)+'<p>Total: '+bltotal+'</p>';
    column_count_switch_klroutines(true);
    statsitics_flot_show_ide_klroutines(['none']);
}

function statsitics_flot_show_ide_klroutines(cstype=['none']){
    while (cstype.length<div_canvas_list_klroutines_global.length){
        cstype.push(cstype[0]);
    }
    for (let blxl=0,lent=div_canvas_list_klroutines_global.length;blxl<lent;blxl++){
        document.getElementById(div_canvas_list_klroutines_global[blxl]).style.display=cstype[blxl];
    }
}

function statistics_category_klroutines(only_return_obj=false,csat=0){
    var list_t=statistics_filter_klroutines();
    if (csat==0){
        var bljg=statistics_category_count_klplan_b(list_t);
    } else {
        var bljg=statistics_category_year_month_klplan_b(list_t,csat);
    }
    var buttons='<p><span class="aclick" onclick="statistics_category_klroutines(false,7);">逐月</span><span class="aclick" onclick="statistics_category_klroutines(false,4);">逐年</span></p>';
    
    document.getElementById('divhtml').innerHTML='<table class="table_common">'+bljg+'</table>'+buttons;
    column_count_switch_klroutines(false);
    statsitics_flot_show_ide_klroutines(['none']);
}

function statistics_date_klroutines(){
    var list_t=statistics_filter_klroutines();
    var list2_t=[];
    for (let item of list_t){
        item=item.trim();
        item=item.split(' /// ');
        if (item.length!==3){continue;}
        list2_t.push(item[1].trim().substring(0,10));
    }

    var result_t={}
    var year_set=new Set();    
    var days=new Set();
    for (let item of list2_t){
        if (result_t[item]==undefined){
            var bldate=validdate_b(item);
            if (bldate===false){
                bldate=new Date('2018-12-31');  //错误日期 - 保留注释
            } else {
                days.add(item);
            }
            year_set.add(bldate.getFullYear());
            result_t[item]=[bldate,0];
        }
        result_t[item][1]=result_t[item][1]+1;
    }
       
    result_t=object2array_b(result_t);   
    if (result_t.length==0){return;}
   
    result_t=date_list_insert_zero_b(result_t);
    //result_t 每个元素形如：[ Date Mon Dec 23 2019 00:00:00 GMT+0800 (China Standard Time), 1 ] - 保留注释

    var year_week_no={};
    for (let item of year_set){
        year_week_no[item]=year_week_range_b(item);
    }
    
    var start_no=day_of_year_b(result_t[0][0])-1;
    var start_year=result_t[0][0].getFullYear();
    var every_week_list={};
    var every_month_list={};
    year_set=Array.from(year_set).sort();
    var is_one_year=(year_set.length==1);
    for (let item of result_t){
        var theyear=item[0].getFullYear();
        if (theyear!==start_year){
            start_year=theyear;
            start_no=0;
        }
        if (is_one_year){
            var week_keyname='w'+year_week_no[theyear][start_no];        
            var month_keyname='m'+(item[0].getMonth()+1);
        } else {
            var week_keyname=theyear+'w'+year_week_no[theyear][start_no];
            var month_keyname=theyear+'m'+(item[0].getMonth()+1);
        }
        if (every_week_list[week_keyname]==undefined){
            //every_week_list[week_keyname]=[];   //此行用于检验 - 保留注释
            every_week_list[week_keyname]=0;
        }
        //every_week_list[week_keyname].push(item);   //此行用于检验 - 保留注释
        every_week_list[week_keyname]=every_week_list[week_keyname]+item[1];
        
        if (every_month_list[month_keyname]==undefined){
            every_month_list[month_keyname]=0;
        }
        every_month_list[month_keyname]=every_month_list[month_keyname]+item[1];        
        start_no=start_no+1;
    }
    every_week_list=object2array_b(every_week_list,true);   
    //every_week_list 形如：[ ['2019w52': 14],['2019w53',11],['2020w1',10]...] - 保留注释
    every_month_list=object2array_b(every_month_list,true);   
    //every_month_list 形如：[ ['2019m12': 25],['2020m1',89],['2020m2',103]...] - 保留注释
    //---        
    var weeks_t=[];
    var weeks_count=[];
    for (let blxl=0;blxl<7;blxl++){
        var weekname=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][blxl];
        weeks_t[blxl]=[weekname+'执行数'];
        weeks_count[blxl]=[weekname,0];
    }
    
    var bltotal=0;    
    for (let item of result_t){
        bltotal=bltotal+item[1];
        var theweek=item[0].getDay();
        weeks_t[theweek].push([new Date(item[0].getTime()),item[1]]);
        weeks_count[theweek][1]=weeks_count[theweek][1]+item[1];
    }
    
    var weeks2_t=[];    //不能使用{} - 保留注释
    var blxl=0;
    for (let item of weeks_t){
        if (item.length>2){    //否则x轴标记出错 - 保留注释
            var is_all_zero=true;
            for (let blno=1,lent=item.length;blno<lent;blno++){
                if (item[blno][1]!==0){
                    is_all_zero=false;
                    break;
                }
            }
            if (is_all_zero){continue;}
            weeks2_t[blxl]=item;
            blxl=blxl+1;
        }
    }

    var bljg='<p>Total: '+bltotal+' ';
    for (let item of weeks_count){
        bljg=bljg+item[0]+': '+item[1]+' '; 
    }
    bljg=bljg+'</p>';
    document.getElementById('divhtml').innerHTML=bljg;
    statsitics_flot_show_ide_klroutines(['']);

    weeks2_t.push(['每日执行数#show:true##points:false#'].concat(result_t));

    flot_lines_b(weeks2_t,'div_flot_every_day_klroutines','ne',true,'','d',y1unit='项',0,[],-1,false,false,false);    

    var oseries={bars: {show: true, barWidth: 0.5, align: 'center'}};
    var oaxis={mode: 'categories', tickLength: 0};
    var oyaxis={tickFormatter: function (v, axis){return v.toFixed(axis.tickDecimals) + '项';}};
    $.plot('#div_flot_week_count_klroutines', [ weeks_count ], {series: oseries, xaxis: oaxis, yaxis: oyaxis});
    $.plot('#div_flot_every_week_klroutines', [ every_week_list ], {series: oseries, xaxis: oaxis, yaxis: oyaxis});
    $.plot('#div_flot_every_month_klroutines', [ every_month_list ], {series: oseries, xaxis: oaxis, yaxis: oyaxis});    
    
    document.getElementById('divhtml').insertAdjacentHTML('beforeend',date_count_dots_b(result_t,'purple',13,1,'项',true,true));
}

function statistics_category_date_klroutines(){
    var list_t=statistics_filter_klroutines();
    var result_t={};
    var current_category='';
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        item=item.split(' /// ');
        if (item.length!==3){continue;}
        var category_name=item[2].trim();
        if (category_name==''){continue;}
        if (result_t[category_name]==undefined){
            result_t[category_name]=[];
        }         
        result_t[category_name].push(item[1].trim().substring(0,10));
        continue;
         
        var blvalue=item.match(/ \(\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2}( [日一二三四五六]| [a-zA-Z]{3})?)?\)$/);
        if (blvalue!==null){
            if (current_category==''){
                console.log('category is empty',item); //- 保留注释
            } else {
                if (result_t[current_category]==undefined){
                    result_t[current_category]=[];
                }
                var bldate=item.replace(/^.* \((\d{4}-\d{2}-\d{2})( \d{2}:\d{2}:\d{2}( [日一二三四五六]| [a-zA-Z]{3})?)?\)$/g,'$1').trim();
                result_t[current_category].push(bldate);
            }
            continue;
        }
        var blvalue=item.match(/ \([1-9]\d*\)$/);
        if (blvalue!==null){
            if (item.match(/^\d{4}\-\d{2}\-\d{2}——\d{4}\-\d{2}\-\d{2}/)==null){
                current_category=item.replace(/ \([1-9]\d*\)$/,'').trim();
            }
        }
    }
    
    var different_key=[];
    var category_dict=statistics_category_klroutines(true);
    for (let key in category_dict){
        if (key in result_t){
            if (result_t[key].length!==category_dict[key][1]){
                different_key.push('key数量不一致：'+key+' '+result_t[key].length+' vs '+category_dict[key][1]);
            }
        } else {
            different_key.push('key缺失：'+key);
        }
    }
    
    var flot_day_array=[];
    var one_date_category=[];
    for (let key in result_t){
        result_t[key].sort();
        
        var list_t=[];
        var same_date_count=0
        var current_date=''
        for (let item of result_t[key]){
            if (current_date==''){
                current_date=item;
                same_date_count=1;
            } else if (current_date==item){
                same_date_count=same_date_count+1;
            } else {
                var bldate=validdate_b(current_date);
                if (bldate===false){
                    bldate=new Date('2018-12-31');  //错误日期 - 保留注释
                    console.log(current_date); //此行保留 - 保留注释 
                }
                list_t.push([bldate,same_date_count]);
                current_date=item;
                same_date_count=1;
            }
        }
        
        if (same_date_count>0){
            var bldate=validdate_b(current_date);
            if (bldate===false){
                bldate=new Date('2018-12-31');  //错误日期 - 保留注释
                console.log(current_date); //此行保留 - 保留注释 
            }
            list_t.push([bldate,same_date_count]);        
        }
        
        if (list_t.length==1){
            one_date_category.push(key+' '+date2str_b('-',list_t[0][0])); //+': '+list_t[0][1]
        } else {
            flot_day_array.push([key].concat(list_t));
        }
    }

    //flot_day_arry 每个元素形如：[["截图照片",[ Date Mon May 16 2022 00:00:00 GMT+0800 (China Standard Time), 2 ],[ Date Tue Jun 07 2022 00:00:00 GMT+0800 (China Standard Time), 1 ]...] - 保留注释
    
    for (let blxl=0,lent=flot_day_array.length;blxl<lent;blxl++){
        if (flot_day_array[blxl].length<=3){continue;}
        flot_day_array[blxl]=[flot_day_array[blxl][0]].concat(date_list_insert_zero_b(flot_day_array[blxl].slice(1,)));
    }
    
    statsitics_flot_show_ide_klroutines(['','none','none','none']);
    flot_lines_b(flot_day_array,'div_flot_every_day_klroutines','ne',true,'','m','项',0);    

    var bljg='';
    if (different_key.length>0){
        bljg=bljg+'不一致的key:<br />'+array_2_li_b(different_key)+'\n<hr />\n';
    }
    if (one_date_category.length>0){
        bljg=bljg+'只有一项内容的分类和日期组合(未在图形中显示)：<br />'+array_2_li_b(one_date_category)+'\n<hr />\n';
    }
    document.getElementById('divhtml').innerHTML=bljg;
}

function update_klroutines(textarea_id='',local_storage_id='',reload=true){
    //update_klroutines() - 意味仅重载 - 保留注释
    if (update_klplan_b(textarea_id,local_storage_id)){
        if (reload){
            routines_data_global=load_lists_klplan_b('list_routines');
        }
        init_klroutines(false);
    }
}

function form_done_klroutines(){
    form_done_klplan_b('routines','done_routines','update_klroutines'); //update_klroutines() - 保留注释
}

function form_list_klroutines(){
    form_list_klplan_b(load_lists_klplan_b('list_routines'),'routines','list_routines','update_klroutines');
}

function menu_klroutines(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'search_klplan_b();">search</span>',   
    '<span class="span_menu" onclick="'+str_t+'statistics_form_klroutines();">statistics</span>',    
    '<span class="span_menu" onclick="'+str_t+'demo_klroutines();">import demo</span>',
    '<span class="span_menu" onclick="'+str_t+'form_done_klroutines();">import/export finished items</span>',    
    '<span class="span_menu" onclick="'+str_t+'update_klroutines();">reload</span>',      
    '<span class="span_menu" onclick="'+str_t+'today_link_klroutines();">今日图片外链</span>',           
    ];
    
    var group_list=[
    ['one by one','edit_switch_klroutines();',true],
    ['batch','form_list_klroutines();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'organize: '));
    
    if (is_local_b()){
        klmenu1.push('<a href="../../../../../wiki/index.php/KL_Routines" onclick="'+str_t+'" target=_blank>KL Routines - KLWiki</a>');
    }
    
    if (ismobile_b()){
        var fontsize='0.8rem';
        var menu1width='13rem';
    } else {
        var fontsize='1rem';
        var menu1width='17rem';
    }

    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span id="span_reg_klplan" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',    
    '<span id="span_unique_klplan" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ unique</span>',    
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'routines\');">update</span>',
    ]);

    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,day_2_week_b('','en3'),menu1width,fontsize,fontsize,'60rem','','div_rountines_menu1','button_routines_menu1')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem','','div_routines_menu')+' '); //♾ - 保留注释
    klmenu_check_b('span_reg_klplan',true);
    klmenu_check_b('span_unique_klplan',true);
}

function today_link_klroutines(){
    var list_t=local_storage_get_b('album_s_keys',-1,true);
    if (list_t.length==0){
        alert('未发现外链缓存');
        return;
    }

    var ospan=document.getElementById('span_total');
    var blmatch=ospan.innerText.match(/^\(\d+\/(\d+)\/(\d+)\)$/) || ['','0','0'];
    var bldone=parseInt(blmatch[1]);
    var blall=parseInt(blmatch[2]);
    
    if (bldone<10){
        alert('完成数小于10');
        return;
    }
    
    if (blall/bldone>60){
        alert('完成数占比不足');
        return;
    }
    
    while (list_t.length<366){
        list_t=list_t.concat(list_t).slice(0,366);
    }
    var blno=day_of_year_b();
    var blstr=list_t[blno];
    var blhref=location_href_b()+'photos.htm?'+blstr;
    
    window.open(blhref);
}

function week_klroutines(do_settimeout=false){
    var blstr=document.getElementById('button_routines_menu1').innerText;
    var thisweek=day_2_week_b('','en3');
    if (blstr==thisweek){return;}
    document.getElementById('div_routines_menu').outerHTML='';
    thisweek_global=day_2_week_range_b('','');
    preweek_global=day_2_week_range_b('','pre');    
    document.getElementById('div_week').innerHTML=fortnight_klroutines();
    menu_klroutines();
    show_klroutines();
    //count_get_klplan_b();   //重新计数 - 保留注释
    if (do_settimeout){
        var bltime=days_between_two_dates_b('',next_day_b(),'')+1;    //是否需要加1毫秒？ - 保留注释
        console.log('week_klroutines()','等候',(bltime/1000/60/60).toFixed(1),'小时');
        setTimeout(function (){week_klroutines(true);}, bltime);
    }
}

function check_klroutines(csid,cscategory){
    var list_t=done_list_klplan_b('','','done_routines',preweek_global[0]);
    var blfound=false;
    var blcaption='';
    [blfound,blcaption]=found_klplan_b(list_t,csid,routines_data_global,thisweek_global[0]);
    
    check_klplan_b(csid,blfound,blcaption,'done_routines',preweek_global[0]);
}

function edit_switch_klroutines(){
    edit_switch_klplan_b('div#divhtml span[class="span_box span_edit_klroutines"]');
}

function edit_item_klroutines(csid){
    if (edit_item_klplan_b(routines_data_global,'list_routines',csid)){
        routines_data_global=load_lists_klplan_b('list_routines');
        init_klroutines(false);
        edit_show_klplan_b('div#divhtml span[class="span_box span_edit_klroutines"]');
    }
}

function new_item_klroutines(multiple=false){
    if (new_item_klplan_b(routines_data_global,'list_routines',multiple)){
        routines_data_global=load_lists_klplan_b('list_routines');
        init_klroutines(false);
        alert('已添加');
    }
}

function show_klroutines(ispreweek=false){
    var csdone_list=done_list_klplan_b('','','done_routines',preweek_global[0]);
    var bljg='';
    var blwiki='\n';
    var blwiki_count=[];
    var category='';
    var category_list=[];
    var today=date2str_b('-');
    
    for (let item of routines_data_global){
        if (category!=='' && category!==item[1]){
            bljg=bljg+'</ol></div>';
        }
            
        if (category=='' || category!==item[1]){
            //<span class="span_category"> 的 innerHTML 只能是 分类名 - 保留注释
            category=item[1];
            bljg=bljg+category_klplan_b(category);
            blwiki=blwiki+'==== '+category+' ====\n';
            category_list.push(category);
            blwiki_count[category]=0;
        }
    
        bljg=bljg+'<li>';
        if (ispreweek){
            bljg=bljg+'<span';
        } else {
            bljg=bljg+'<span class="span_link" onclick="check_klroutines(\''+item[0]+'\',\''+category+'\');" id="span_item_'+item[0]+'"';
        }
        var done_date='<span id="span_'+item[0]+'" class="span_date" style="color:'+scheme_global['shadow']+';"></span>';
        for (let arow of csdone_list){
            if (arow.split(',')[1]!==item[0]){continue;}
            
            if (ispreweek==false && arow.split(',')[0].split(' ')[0]>=thisweek_global[0] || ispreweek && arow.split(',')[0].split(' ')[0]<=preweek_global[1]){
                bljg=bljg+' style="background-color:'+scheme_global['pink']+';"';
                
                done_date=done_date_klplan_b(arow,today,item[0]);
                
                blwiki=blwiki+'# '+item[2];
                blwiki=blwiki+' /// '+arow.split(',')[0]+' /// '+category+'\n';
                blwiki_count[category]=blwiki_count[category]+1;
                break;
            }
        }
        bljg=bljg+'>'+specialstr92_b(item[2]);
        var span_edit=' <span class="span_box span_edit_klroutines" onclick="edit_item_klroutines(\''+item[0]+'\');" style="font-size:0.9rem;display:none;">🖍</span> ';
        if (ispreweek){
            bljg=bljg+'</span>'+span_edit+done_date;
        } else {
            bljg=bljg+'</span>'+span_edit+done_date;
        }
        bljg=bljg+'</li>';
    }
    
    if (bljg.slice(-11,)!=='</ol></div>'){
        bljg=bljg+'</ol></div>';
    }
    
    if (ispreweek){
        var bltotal=0;
        for (let item of category_list){
            blwiki=blwiki.replace('\n==== '+item+' ====\n','\n==== '+item+' ('+blwiki_count[item]+') ====\n');
            bltotal=bltotal+blwiki_count[item];
        }
        blwiki='=== '+preweek_global[0]+'——'+preweek_global[1]+' ('+bltotal+') ===\n'+blwiki;
        
        var left_strings='<p style="line-height:2.4rem;">';
        var right_strings='</p>';
        var blstr=textarea_with_form_generate_b('textarea_preweek_routines','height:10rem;margin-bottom:0.5rem;',left_strings,'发送到临时记事本,加密发送,发送地址',right_strings,'','form_preweek_routines',true);
        document.getElementById('divhtml').innerHTML=bljg+blstr;
        var otextarea=document.getElementById('textarea_preweek_routines').value=blwiki;
    } else {
        document.getElementById('divhtml').innerHTML=bljg;
    }
    
    column_count_switch_klroutines(true);
    
    count_get_klplan_b();
    
    var oapre=document.getElementById('span_preweek');
    var oathis=document.getElementById('span_thisweek');
    if (ispreweek){
        oapre.style.color=scheme_global['a-hover'];
        oathis.style.color='';
    } else {
        oapre.style.color='';
        oathis.style.color=scheme_global['a-hover'];
    }

    return category_list;
}

function column_count_switch_klroutines(multi_column=true){
    document.getElementById('divhtml').style.columnCount=((multi_column==false || ismobile_b())?1:5);
}

function fortnight_klroutines(){
    var bljg='<p><span class="span_link" id="span_preweek" onclick="show_klroutines(true);">Last Week</span>: ';
    bljg=bljg+preweek_global[0]+'—'+preweek_global[1].slice(0,-2)+'<span style="color:'+scheme_global["a-hover"]+';">'+preweek_global[1].slice(-2,)+'</span></p>';
    bljg=bljg+'<p><span class="span_link" id="span_thisweek" onclick="show_klroutines();hide_klplan_b(false,true);">This Week</span>: ';
    bljg=bljg+thisweek_global[0]+'—'+thisweek_global[1].slice(0,-2)+'<span style="color:'+scheme_global["a-hover"]+';">'+thisweek_global[1].slice(-2,)+'</span></p>';
    return bljg;
}

function init_klroutines(showmenu=true){
    routines_data_global=sort_klplan_b(routines_data_global);
    document.getElementById('div_week').innerHTML=fortnight_klroutines();
    if (no_repeated_keys_klplan(routines_data_global)){
        html_klroutines();
    }
    if (showmenu){
        menu_klroutines();
        var bltime=days_between_two_dates_b('',next_day_b(),'')+1;    //是否需要加1毫秒？ - 保留注释
        console.log('init_klroutines()','等候',(bltime/1000/60/60).toFixed(1),'小时');
        setTimeout(function (){week_klroutines(true);}, bltime);
    }
    hide_klplan_b(false,true);
}

function html_klroutines(){
    var list_t=show_klroutines();
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<a href="#'+item+'" class="a_oblong_box">'+item+'</a> ';
    }
    bljg=bljg+'<span class="oblong_box" onclick="new_item_klroutines();">New Item</span> ';
    bljg=bljg+'<span class="oblong_box" onclick="new_item_klroutines(true);">multiple</span> ';    
    var odiv=document.getElementById('div_category_links')
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function demo_klroutines(){
    var list_str=local_storage_get_b('list_routines',-1,false).trim();
    if (list_str!==''){
        alert('现有事项，取消导入');
        return;
    }
    if (confirm('是否导入Demo事项？')){
        var demo_str=['book26-3 阅读 新电子书 1部','cook02 烹饪 包饺子','health5-2 健康 开合跳>=50下','housework9-2 家务 拖地','info20 信息 百度网盘 下载文件或目录 >=4GB','info3 信息 新浪微博收藏缩减>=50条','multimedia7-2 影音 看漫画 1卷'].join('\n');
        localStorage.setItem('list_routines',demo_str);
        routines_data_global=load_lists_klplan_b('list_routines');
        init_klroutines(false);
    }
}
