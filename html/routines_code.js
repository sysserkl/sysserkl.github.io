function statistics_form_klroutines(){
    var bljg='';
    bljg=bljg+'<p>输入以往每周执行记录：</p>';
    bljg=bljg+'<p><textarea id="textarea_statistics" style="width:90%;height:20rem;"></textarea></p>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:statistics_items_klroutines();">项目统计</span>';
    bljg=bljg+'<span class="aclick" onclick="javascript:statistics_category_klroutines();">分类统计</span>';
    bljg=bljg+'<span class="aclick" onclick="javascript:statistics_date_klroutines();">日统计</span>';
    bljg=bljg+'<span class="aclick" onclick="javascript:statistics_category_date_klroutines();">分类日统计</span>';    
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">Close</span>';    
    bljg=bljg+'</p>\n';    
    bljg=bljg+'<div id="div_flot_date_klroutines" style="width:100%;height:100%;display:none;"></div>\n';
    bljg=bljg+'<div id="div_flot_week_klroutines" style="width:100%;height:100%;display:none;"></div>\n';
    document.getElementById('divhtml2').innerHTML=bljg;
}

function statistics_items_klroutines(){
    var otextarea=document.getElementById('textarea_statistics');
    var list_t=otextarea.value.trim().split('\n');
    var list2_t=[];
    for (let item of list_t){
        //以下3行保留注释
        //match(/\(\d{4}-\d{2}-\d{2}\)$/)
        //match(/\(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\)$/)
        //match(/\(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [日一二三四五六]\)$/)
        var blvalue=item.trim().match(/ \(\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2}( [日一二三四五六])?)?\)$/);
        if (blvalue!==null){
            console.log(item);
            list2_t.push(item.trim().replace(new RegExp(/ \(\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2}( [日一二三四五六])?)?\)$/,'g'),'').trim());
        }
    }
    //---------------
    list_t=[];
    list2_t.sort();
    for (let item of list2_t){
        if (list_t[item]==null){
            list_t[item]=[item,0];
        }
        list_t[item][1]=list_t[item][1]+1;
    }
    //---------------
    list2_t=[];
    for (let blxl in list_t){
        list2_t.push([list_t[blxl][0],list_t[blxl][1]]);
    }
    list2_t.sort(function (a,b){return a[1]<b[1];});
    
    var bljg=[];
    var simple_list=[];
    var bltotal=0;
    for (let item of list2_t){
        bljg.push(item[0]+': '+item[1]);
        simple_list.push(item[0]);
        bltotal=bltotal+item[1];
    }
    //---------------
    var zero_list=[];
    for (let item of routines_data_global){
        if (simple_list.includes(item[2]) || zero_list.includes(item[2])){continue;}
        zero_list.push(item[2]);
    }
    for (let item of zero_list){
        bljg.push(item+': 0');
    }
    document.getElementById('divhtml').innerHTML=array_2_li_b(bljg)+'<p>Total: '+bltotal+'</p>';
    statsitics_flot_show_ide_klroutines('none');
}

function statsitics_flot_show_ide_klroutines(cstype='none'){
    document.getElementById('div_flot_date_klroutines').style.display=cstype;
    document.getElementById('div_flot_week_klroutines').style.display=cstype;
}

function statistics_category_klroutines(only_return_obj=false){
    var otextarea=document.getElementById('textarea_statistics');
    var list_t=otextarea.value.trim().split('\n');
    var result_t={};
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        var blvalue=item.match(/\d{4}-\d{2}-\d{2}/);
        if (blvalue==null){
            var blvalue=item.match(/ \([1-9]\d*\)$/);   //不能忽略 20 之类个位数为0的整数 - 保留注释
            if (blvalue){
                var blname=item.replace(new RegExp(/ \([1-9]\d*\)$/),'').trim();
                if (blname==''){continue;}
                var blvalue=parseInt(item.replace(new RegExp(/^.* \(([1-9]\d*)\)$/),'$1').trim());
                if (isNaN(blvalue)){continue;}
                if (result_t[blname]==null){
                    result_t[blname]=[blname,0];
                }
                result_t[blname][1]=result_t[blname][1]+blvalue;
            }
        }
    }
    if (only_return_obj){
        return result_t;
    }
    result_t=object2array_b(result_t);
    result_t.sort(function (a,b){return a[1]<b[1];});
    var bltotal=0;
    for (let blxl=0;blxl<result_t.length;blxl++){
        bltotal=bltotal+result_t[blxl][1];
        result_t[blxl]=result_t[blxl][0]+': '+result_t[blxl][1];
    }
    document.getElementById('divhtml').innerHTML=array_2_li_b(result_t)+'<p>Total: '+bltotal+'</p>';
    statsitics_flot_show_ide_klroutines('none');
}

function statistics_date_klroutines(){
    var otextarea=document.getElementById('textarea_statistics');
    var list_t=otextarea.value.trim().split('\n');
    var list2_t=[];
    for (let item of list_t){
        item=item.trim();
        var blvalue=item.match(/ \(\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2}( [日一二三四五六])?)?\)$/);
        if (blvalue!==null){
            list2_t.push(item.replace(new RegExp(/^.* \((\d{4}-\d{2}-\d{2})( \d{2}:\d{2}:\d{2}( [日一二三四五六])?)?\)$/,'g'),'$1').trim());
        }        
    }

    var result_t={}
    var days=new Set();
    for (let item of list2_t){
        if (result_t[item]==null){
            var bldate=validdate_b(item);
            if (bldate===false){
                bldate=new Date('2018-12-31');  //错误日期 - 保留注释
                console.log(item); //此行保留 - 保留注释 
            }
            else {
                days.add(item);
            }
            result_t[item]=[bldate,0];
        }
        result_t[item][1]=result_t[item][1]+1;
    }
       
    result_t2=object2array_b(result_t);   
    if (result_t2.length==0){return;}
   
    result_t2=date_list_insert_zero_b(result_t2);
    
    var weeks_t=[];
    var weeks_count=[];
    for (let blxl=0;blxl<7;blxl++){
        var weekname='周'+['日','一','二','三','四','五','六'][blxl];
        weeks_t[blxl]=[weekname+'执行数'];
        weeks_count[blxl]=[weekname,0];
    }
    
    var bltotal=0;    
    for (let item of result_t2){
        bltotal=bltotal+item[1];
        var theweek=item[0].getDay();
        weeks_t[theweek].push([new Date(item[0].getTime()),item[1]]);
        weeks_count[theweek][1]=weeks_count[theweek][1]+item[1];
    }
    
    var bljg='<p>Total: '+bltotal+' ';
    for (let item of weeks_count){
        bljg=bljg+item[0]+': '+item[1]+' '; 
    }
    bljg=bljg+'</p>';
    document.getElementById('divhtml').innerHTML=bljg;
    statsitics_flot_show_ide_klroutines('');

    weeks_t.push(['每日执行数#show:true##points:false#'].concat(result_t2));
    flot_lines_k(weeks_t,'div_flot_date_klroutines','ne',true,"",'d',y1unit='项',0,[],-1,false,false,false);    
    $.plot("#div_flot_week_klroutines", [ weeks_count ], {
        series: {
            bars: {show: true, barWidth: 0.5, align: "center"}
        },
        xaxis: {mode: "categories", tickLength: 0},
        yaxis: {
            tickFormatter: function (v, axis) {return v.toFixed(axis.tickDecimals) + '项';}
        }
    });
}

function statistics_category_date_klroutines(){
    var otextarea=document.getElementById('textarea_statistics');
    var list_t=otextarea.value.trim().split('\n');
    var result_t={};
    var current_category='';
    for (let item of list_t){
        item=item.trim();
        var blvalue=item.match(/ \(\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2}( [日一二三四五六])?)?\)$/);
        if (blvalue!==null){
            if (current_category==''){
                console.log('分类为空',item); //- 保留注释
            }
            else {
                if (result_t[current_category]==undefined){
                    result_t[current_category]=[];
                }
                var bldate=item.replace(new RegExp(/^.* \((\d{4}-\d{2}-\d{2})( \d{2}:\d{2}:\d{2}( [日一二三四五六])?)?\)$/,'g'),'$1').trim();
                result_t[current_category].push(bldate);
            }
            continue;
        }
        var blvalue=item.match(/ \([1-9]\d*\)$/);
        if (blvalue!==null){
            if (item.match(/^\d{4}\-\d{2}\-\d{2}——\d{4}\-\d{2}\-\d{2}/)==null){
                current_category=item.replace(new RegExp(/ \([1-9]\d*\)$/),'').trim();
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
        }
        else {
            different_key.push('key缺失：'+key);
        }
    }
    
    var flot_array=[];
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
            }
            if (current_date==item){
                same_date_count=same_date_count+1;
            }
            else {
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
            one_date_category.push(key+' '+date2str_b('-',list_t[0][0])+': '+list_t[0][1]);
        }
        else {
            flot_array.push([key].concat(list_t));
        }
    }
    
    for (let blxl=0;blxl<flot_array.length;blxl++){
        if (flot_array[blxl].length<=3){continue;}
        flot_array[blxl]=[flot_array[blxl][0]].concat(date_list_insert_zero_b(flot_array[blxl].slice(1,)));
    }
    
    document.getElementById('div_flot_date_klroutines').style.display='';
    document.getElementById('div_flot_week_klroutines').style.display='none';
    flot_lines_k(flot_array,'div_flot_date_klroutines','ne',true,'','m','项',0);    

    document.getElementById('divhtml').innerHTML='不一致的key:<br />'+array_2_li_b(different_key)+'只有一项的分类：<br />'+array_2_li_b(one_date_category);
}

function update_klroutines(textarea_id,local_storage_id,reload=true){
    if (update_klplan_b(textarea_id,local_storage_id)){
        if (reload){
            routines_data_global=load_lists_klplan_b('list_routines');
        }    
        init_klroutines(false);
    }
}

function form_done_klroutines(){
    form_done_klplan_b('routines','done_routines','update_klroutines');
}

function form_list_klroutines(){
    form_list_klplan_b(routines_data_global,'routines','list_routines','update_klroutines');
}

function menu_klroutines(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'search_klplan_b();">搜索</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'statistics_form_klroutines();">统计</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'edit_switch_klroutines();">逐个整理事项</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'form_list_klroutines();">批量整理事项</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'demo_klroutines();">导入Demo事项</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'form_done_klroutines();">导入/导出完成项</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'routines\');}">更新版本</span>',
    ];
    if (is_local_b()){
        klmenu1.push('<a href="../../../../../wiki/index.php/KL_Routines" onclick="javascript:'+str_t+'" target=_blank>KL Routines - KLWiki</a>');
    }
    
    if (ismobile_b()){
        var fontsize='0.8rem';
        var menu1width='10rem';
    }
    else {
        var fontsize='1rem';
        var menu1width='14rem';
    }
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,day_2_week_b('',true),menu1width,fontsize,fontsize,'60rem','','div_rountines_menu1','button_routines_menu1'),'','0rem','','div_routines_menu')+' '); //♾ - 保留注释
}

function week_check_klroutines(){
    var blstr=document.getElementById('button_routines_menu1').innerText;
    var thisweek=day_2_week_b('',true);
    if (blstr==thisweek){return;}
    document.getElementById('div_routines_menu').outerHTML='';
    thisweek_global=day_2_week_range_b('','',true);
    preweek_global=day_2_week_range_b('','pre',true);    
    menu_klroutines();
    show_klroutines();
    //count_klplan_b();   //重新计数 - 保留注释
}

function check_klroutines(csid,cscategory){
    var list_t=done_list_klplan('','','done_routines',preweek_global[0]);
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

function new_item_klroutines(){
    if (new_item_klplan_b(routines_data_global,'list_routines')){
        routines_data_global=load_lists_klplan_b('list_routines');
        init_klroutines(false);
        alert('已添加');
    }
}

function show_klroutines(ispreweek=false){
    var csdone_list=done_list_klplan('','','done_routines',preweek_global[0]);
    var bljg='';
    var blwiki='\n';
    var blwiki_count=[];
    var category='';
    var category_list=[];
    var today=date2str_b('-');
    for (let item of routines_data_global){
        if (category==''){
            category=item[1];
            //<span class="span_category"> 的 innerHTML 只能是 分类名 - 保留注释
            bljg=bljg+category_klplan_b(category);
            blwiki=blwiki+'==== '+category+' ====\n';
            category_list.push(category);
            blwiki_count[category]=0;
        }
        else if (category!==item[1]){
            bljg=bljg+'</ol></div>';
            category=item[1];
            bljg=bljg+category_klplan_b(category);
            blwiki=blwiki+'==== '+category+' ====\n';
            category_list.push(category);
            blwiki_count[category]=0;
        }
    
        bljg=bljg+'<li>';
        if (ispreweek){
            bljg=bljg+'<span';
        }
        else {
            bljg=bljg+'<span class="span_link" onclick="javascript:check_klroutines(\''+item[0]+'\',\''+category+'\');" id="span_item_'+item[0]+'"';
        }
        var done_date='<span id="span_'+item[0]+'" class="span_date" style="color:'+scheme_global["shadow"]+';"></span>';
        for (let arow of csdone_list){
            if (arow.split(',')[1]!==item[0]){
                continue;
            }
            if (ispreweek==false && arow.split(',')[0].split(' ')[0]>=thisweek_global[0] || ispreweek && arow.split(',')[0].split(' ')[0]<=preweek_global[1]){
                bljg=bljg+' style="background-color:'+scheme_global["pink"]+';"';
                
                done_date=done_date_klplan_b(arow,today,item[0]);
                
                blwiki=blwiki+'# '+item[2];
                blwiki=blwiki+' ('+arow.split(',')[0]+')\n';
                blwiki_count[category]=blwiki_count[category]+1;
                break;
            }
        }
        bljg=bljg+'>'+specialstr92_b(item[2]);
        var span_edit=' <span class="span_box span_edit_klroutines" onclick="javascript:edit_item_klroutines(\''+item[0]+'\');" style="font-size:0.9rem;display:none;">🖍</span> ';
        if (ispreweek){
            bljg=bljg+'</span>'+span_edit+done_date;
        }
        else {
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
        
        var postpath=postpath_b();
	    bljg=bljg+'<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_preweek_routines" target=_blank>\n';        
        bljg=bljg+'<textarea name="textarea_preweek_routines" id="textarea_preweek_routines" style="height:10rem;margin-bottom:0.5rem;" onclick="javascript:this.select();document.execCommand(\'copy\');">'+blwiki+'</textarea>';
        bljg=bljg+'<p style="line-height:2.4rem;">';
        bljg=bljg+textarea_buttons_b('textarea_preweek_routines','发送到临时记事本,发送地址');
        bljg=bljg+' ver 0.0.4-20200913';
        bljg=bljg+'</p></form>';
    }
    //history
    //0.0.4-20200913 增加逐个修改、删除事项功能
    //0.0.3-20200901 事项改为保存到 localStorage 中，添加 PWA
    //0.0.2-20200220 增加 菜单 和 统计功能
    //0.0.1-20191222
        
    document.getElementById('divhtml').innerHTML=bljg;

    count_klplan_b();
    
    var oapre=document.getElementById('span_preweek');
    var oathis=document.getElementById('span_thisweek');
    if (ispreweek){
        oapre.style.color=scheme_global["a-hover"];
        oathis.style.color='';
    }
    else {
        oapre.style.color='';
        oathis.style.color=scheme_global["a-hover"];
    }

    return category_list;
}

function week_klroutines(){
    var bljg='<p><span class="span_link" id="span_preweek" onclick="javascript:show_klroutines(true);">上周</span>：';
    bljg=bljg+preweek_global[0]+'['+day_2_week_b(preweek_global[0],true)+']——'+preweek_global[1]+'[<span style="color:'+scheme_global["a-hover"]+';">'+day_2_week_b(preweek_global[1],true)+'</span>]</p>';
    bljg=bljg+'<p><span class="span_link" id="span_thisweek" onclick="javascript:show_klroutines();">本周</span>：';
    bljg=bljg+thisweek_global[0]+'['+day_2_week_b(thisweek_global[0],true)+']——'+thisweek_global[1]+'[<span style="color:'+scheme_global["a-hover"]+';">'+day_2_week_b(thisweek_global[1],true)+'</span>]</p>';
    return bljg;
}

function init_klroutines(showmenu=true){
    routines_data_global=sort_klplan_b(routines_data_global);
    document.getElementById('div_week').innerHTML=week_klroutines();
    if (no_repeated_keys_klplan(routines_data_global)){
        html_klroutines();
    }
    if (showmenu){
        menu_klroutines();
    }
}

function html_klroutines(){
    var list_t=show_klroutines();
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<a href="#'+item+'" class="a_oblong_box">'+item+'</a> ';
    }
    bljg=bljg+'<span class="oblong_box" onclick="javascript:new_item_klroutines();">新事项</span> ';
    var odiv=document.getElementById('div_category_links')
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));

    if (ismobile_b()==false){
        document.getElementById('divhtml').style.columnCount=5;
    }
}

function demo_klroutines(){
    var list_str=local_storage_get_b('list_routines',-1,false).trim();
    if (list_str!==''){
        alert('现有事项，取消导入');
        return;
    }
    if (confirm('是否导入Demo事项？')){
        localStorage.setItem('list_routines',routines_demo_data_global.trim());
        routines_data_global=load_lists_klplan_b('list_routines');
        init_klroutines(false);
    }
}
