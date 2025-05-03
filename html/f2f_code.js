function menu_lt_f2f(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'new_lt_f2f();">new encounter</span>', 
    '<span class="span_menu" onclick="'+str_t+'times_pie_f2f();">接触次数占比</span>', 
    '<span class="span_menu" onclick="'+str_t+'year_all_f2f();">总计</span>',     
    '<span class="span_menu" onclick="'+str_t+'year_individual_f2f();">分类</span>',     
    ];
    
    var name_list=Array.from(name_set_f2f());
    name_list.sort(function (a,b){return zh_sort_b(a,b)});
    var name_menu=['<span id="span_reg_f2f" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>'];
    for (let item of name_list){
        name_menu.push('<span class="span_menu" onclick="'+str_t+'search_f2f(\'^\'+this.innerText);">'+item+'</span>');
    }

    var klmenu_config=root_font_size_menu_b(str_t,true,true,true);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'backup_lt_f2f();">edit/import/export</span>',
    '<span class="span_menu" onclick="'+str_t+'export_local_2_js_f2f();">导出缓存为js data文件</span>',
    '<span id="span_encode_f2f" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 导出时加密</span>',
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'f2f\');">更新版本</span>',
    ]);

    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'🫂','14rem','1rem','1rem','60rem')+klmenu_b(name_menu,'𓁈','16rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem');
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg+' ');
    klmenu_check_b('span_reg_f2f',true);
}

function export_local_2_js_f2f(is_full=true){
    var result_t=[];
    for (let item of content_all_f2f_global){
        if (!is_full && item[2]!=='l'){continue;}
        result_t.push('["'+specialstr_j(item[0])+'","'+specialstr_j(item[1])+'","j"],');
    }
    if (result_t.length==0){return;}
    
    if (is_full){
        var fname='';
        if (!confirm('是否完整保存 '+result_t.length+' 条记录为 f2f_data.js？')){return;}
    } else {
        var fname='_update';
        if (!confirm('是否增量保存 '+result_t.length+' 条缓存记录为 f2f'+fname+'_data.js？')){return;}
    }
    
    let blcontent='var content_raw_f2f_global=[\n'+result_t.join('\n')+'\n];\n';
    if (klmenu_check_b('span_encode_f2f',false)){
        blcontent=bc_encode_b(blcontent)[0];
        var save_name='f2f'+fname+'_data_$$encoded.js';
    } else {
        var save_name='f2f'+fname+'_data.js';
    }
    
    string_2_txt_file_b(blcontent,save_name,'txt');
}

function backup_lt_f2f(){
    reload_f2f();
    
    var bljg='<div id="div_backup" style="width:90%;margin:0.5rem;">';
    bljg=bljg+'<p><b>Items:</b>(不含js部分)</p>';

    var left_str='<p>';
    left_str=left_str+close_button_b('div_backup','none')+' ';
    left_str=left_str+'<span class="aclick" onclick="filter_klplan_f2f();">Filter</span> ';       
    left_str=left_str+'<span class="aclick" onclick="update_lt_f2f();">Update</span> ';   

    var right_str='</p>';
    var blstr=textarea_with_form_generate_b('textarea_backup_f2f','width:100%;height:10rem;',left_str,'清空,复制,发送到临时记事本,发送地址',right_str);

    bljg=bljg+blstr+'<p><textarea id="textarea_filter_items_f2f" style="display:none; width:100%;height:10rem;" onclick="this.select();document.execCommand(\'copy\');"></textarea></p>\n';
    bljg=bljg+'</div>';

    var odiv=document.getElementById('div_backup');
    if (odiv){
        odiv.outerHTML=bljg;
    } else {
        document.getElementById('divhtml').insertAdjacentHTML('afterbegin',bljg);
    }

    var items=local_storage_get_b('list_f2f',-1,false);
    document.getElementById('textarea_backup_f2f').value=items;
}

function filter_klplan_f2f(){
    var otextarea=document.getElementById('textarea_backup_f2f');
    var list_t=otextarea.value.trim().split('\n');

    var cskey=(prompt('输入过滤关键词：') || '').trim();
    var is_reg=false;
    [cskey,is_reg]=str_reg_check_b(cskey,false);
    if (cskey==''){return;}
    
    var others_item_list=[];
    var current_item_list=[];
    for (let item of list_t){
        var blfound=str_reg_search_b(item,cskey,is_reg);
        if (blfound===-1){break;}
        
        if (blfound){
            current_item_list.push(item);
        } else {
            others_item_list.push(item);
        }
    }
    
    if (current_item_list.length==0){
        alert('not found');
        return;
    }
    
    otextarea.value=others_item_list.join('\n');
    var otextarea_current=document.getElementById('textarea_filter_items_f2f');
    otextarea_current.value=current_item_list.join('\n');
    otextarea_current.style.display='';
    alert('原共有项目'+list_t.length+'条；当前筛选出项目'+current_item_list.length+'条；剩余项目'+others_item_list.length+'条。'+(list_t.length==current_item_list.length+others_item_list.length?'条数一致。':'条数不一致。'));
}

function update_lt_f2f(){
    var otextarea_item=document.getElementById('textarea_backup_f2f');
    if (!otextarea_item){return;}
    var blitems=otextarea_item.value.trim();
    if (confirm('是否更新数据？')){
        localStorage.setItem('list_f2f',blitems);
        reload_f2f();
    }
}

function array_2_local_storage_lt_f2f(){
    content_all_f2f_global.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    var result_t=[];
    for (let item of content_all_f2f_global){
        if (item[2]=='l'){
            result_t.push(item.slice(0,2).join(' '));
        }
    }
    localStorage.setItem('list_f2f',result_t.join('\n'));
}

function local_storage_2_array_lt_f2f(){
    var is_ok, result_t;
    var result_set=new Set();
    var result_list=[];
    var ignore_list=[];

    for (let item of content_all_f2f_global){
        if (item[2]=='l'){continue;}

        var blname=name_get_f2f(item[0]);
        if (result_set.has(blname+' '+item[1])){
            ignore_list.push(item);
            continue;
        }
    
        result_set.add(blname+' '+item[1]);
        result_list.push(item);
    }
    
    var list_t=local_storage_get_b('list_f2f',-1,true);
        
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        
        var blat=item.lastIndexOf(' ');
        if (blat==-1){
            ignore_list.push(item);
            continue;
        }
        
        var blname=name_get_f2f(item.substring(0,blat));
        var bldate=item.substring(blat+1,);
        if (result_set.has(blname+' '+bldate)){
            ignore_list.push(item);
            continue;
        }
        result_set.add(blname+' '+bldate);
        result_list.push([item.substring(0,blat),bldate,'l']);
    }
    
    if (ignore_list.length>0){
        alert('以下 '+ignore_list.length+' 条数据未导入：'+ignore_list.join('\n'));
    }
    
    content_all_f2f_global=result_list;
    array_2_local_storage_lt_f2f();
    return true;
}

function draw_lt_f2f(csno){
    var csitem=content_all_f2f_global[csno];
    var bldate = validdate_b(csitem[1]);
    
    var bljg='';
    bljg=bljg+'<hr />';
    
    var date_span=(csitem[2]=='l'?'<span id="span_f2f_date_'+csno+'" style="cursor:pointer;" onclick="change_lt_f2f('+csno+');">'+csitem[1]+'</span>':csitem[1]);
    
    bljg=bljg+'<table width=100% cellspacing=0 cellpadding=0><tr style="font-size:0.8rem;color:'+scheme_global['color']+';background-color:'+scheme_global['skyblue']+';"><td>'+(csno+1)+'. '+date_span+' '+day_2_week_b(csitem[1],'cnbrief');

    var edit_icon=(csitem[2]=='l'?'<span style="cursor:pointer;" onclick="content_editable_lt_f2f('+csno+');">🖊</span>':'');
    bljg=bljg+'<td id="td_f2f_buttons_'+csno+'" align=right width=1% nowrap>'+edit_icon+'</td></tr></table>';
    bljg=bljg+'<p class="p_f2f_content" style="font-size:1.2rem;">';
    bljg=bljg+'<span class="span_f2f_content" id="span_f2f_content_'+csno+'" style="font-weight:bold;">';

    bljg=bljg+csitem[0]+'</span>';
    bljg=bljg+'</p><hr />';
    var odiv=document.getElementById('div_f2f_'+csno);
    if (odiv){
        odiv.innerHTML=bljg;
    } else {
        document.getElementById('divhtml').insertAdjacentHTML('beforeend','<div id="div_f2f_'+csno+'" width=100%>'+bljg+'</div>\n');
    }
}

function content_editable_lt_f2f(csno){
    var ospan=document.getElementById('span_f2f_content_'+csno);
    var otd=document.getElementById('td_f2f_buttons_'+csno);    
    if (!ospan){
        alert('未发现指定编号事项');
        return;
    }
    if (!otd){
        alert('未发现按钮区');
        return;
    }    
    ospan.setAttribute('contenteditable','true');
    otd.innerHTML='<button onclick="change_content_lt_f2f('+csno+');">Save</button> <button onclick="draw_lt_f2f('+csno+');">Cancel</button>';
}

function change_content_lt_f2f(csno){
    if (csno<0 || csno>=content_all_f2f_global.length){
        alert('编号超出范围，未保存');
        return;    
    }
    
    var ocontent=document.getElementById('span_f2f_content_'+csno);
    if (!ocontent){
        alert('未发现指定事项');
        return;
    }

    var odate=document.getElementById('span_f2f_date_'+csno);
    if (!odate){
        alert('未发现指定日期');
        return;
    }
    var bldate=odate.innerText;
    
    var currentvalue=ocontent.innerText.trim();
    if (currentvalue==''){
        alert('修改项为空值，未保存');
        return;
    }    

    currentvalue=quote_2_cn_character_b(currentvalue);

    var oldvalue=content_all_f2f_global[csno][0];
    if (currentvalue=='delete' || currentvalue=='删除'){
        if (confirm('是否删除？\n'+oldvalue)==false){return;}
        content_all_f2f_global.splice(csno,1);
        array_2_local_storage_lt_f2f();        
        reload_f2f();
    } else {
        for (let blxl=0,lent=content_all_f2f_global.length;blxl<lent;blxl++){
            if (currentvalue+' '+bldate==content_all_f2f_global[blxl].join(' ')){
                if (blxl==csno){
                    alert('未做修改，未保存');
                    return;
                } else {
                    alert('存在同名的内容，取消修改');
                    return;
                }
            }
        }
        
        if (confirm('是否修改？\n'+oldvalue+'\n'+currentvalue)==false){return;}

        content_all_f2f_global[csno][0]=currentvalue;
        array_2_local_storage_lt_f2f();
        draw_lt_f2f(csno);
    }
}

function reload_f2f(){
    if (local_storage_2_array_lt_f2f()==false){return;};

    document.getElementById('divhtml').innerHTML='';

    if (content_all_f2f_global.length==0){
        content_all_f2f_global.push(['Demo','2020-05-01','l']);
        array_2_local_storage_lt_f2f();
    }
    
    document.getElementById('span_count').innerHTML='('+content_all_f2f_global.length+')';
    search_f2f('')
}

function init_f2f(){
    function sub_init_f2f_done(){
        if (typeof content_raw_f2f_global !== 'undefined'){
            content_all_f2f_global=[].concat(content_raw_f2f_global);
            console.log('导入 '+content_all_f2f_global.length+' 条 js 记录');
            content_raw_f2f_global=undefined;
        }
        
        reload_f2f();
        menu_lt_f2f();
    }
    
    content_all_f2f_global=[];
    content_current_f2f_global=[];
    rows_per_page_f2f_global=50;
    
    input_with_x_b('input_search',15);
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    recent_f2f();

    load_js_from_bigfile_b('content_raw_f2f_global','f2f_data_$$encoded.js',sub_init_f2f_done);
    //load_js_var_file_b('content_raw_f2f_global',[],'f2f_data_$$encoded.js',sub_init_f2f_done,true,true);  //只支持 js 文件从 bigfile 直接导入，此行保留 - 保留注释
}

function search_f2f(cskey=false){
    var oinput=document.getElementById('input_search');
    if (cskey===false){
        cskey=oinput.value.trim();
    }
    oinput.value=cskey;

    content_current_f2f_global=[];
    if (cskey==''){
        for (let blxl=0,lent=content_all_f2f_global.length;blxl<lent;blxl++){
            content_current_f2f_global.push(blxl);
        }    
    } else {
        recent_f2f(cskey);
        var isreg=klmenu_check_b('span_reg_f2f',false);
        [csstr,isreg]=str_reg_check_b(cskey,isreg,true);        

        for (let blxl=0,lent=content_all_f2f_global.length;blxl<lent;blxl++){
            var blfound=str_reg_search_b(content_all_f2f_global[blxl],cskey,isreg);
            if (blfound==-1){break;}
            if (blfound){
                content_current_f2f_global.push(blxl);
            }
        }
    }
    
    result_percent_b('span_count',content_current_f2f_global.length,content_all_f2f_global.length,1);
    page_f2f(1);
}

function recent_f2f(csstr=''){
    recent_search_b('recent_search_f2f',csstr,'search_f2f','div_recent_search',[],25,false);
}

function page_f2f(csno){
    document.getElementById('divhtml').innerHTML='';

    var cslen=content_current_f2f_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_f2f_global,csno,'page_f2f','locate_f2f',false,1,10);
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_f2f_global,cslen);
    var blno=0;

    for (let blxl=csno-1;blxl<blend;blxl++){
        var item=content_current_f2f_global[blxl];
        draw_lt_f2f(item);
    }
    
    var odiv=document.getElementById('div_page');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function locate_f2f(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_f2f((blno-1)*rows_per_page_f2f_global+1,rows_per_page_f2f_global);
    }        
}

function name_set_f2f(){
    var name_set=new Set();
    for (let item of content_all_f2f_global){
        name_set.add(name_get_f2f(item[0]));
    }
    return name_set;
}

function old_value_get_f2f(){
    var nameset=new Set();
    for (let item of content_all_f2f_global){
        nameset.add(item[0]+' '+item[1]);
    }
    return nameset;
}

function change_lt_f2f(csno){
    if (csno<0 || csno>=content_all_f2f_global.length){
        alert('记录号超出范围');
        return;
    }
    var nameset=old_value_get_f2f();

    var item=content_all_f2f_global[csno];
    var oldvalue=item[1];
    var blinfo='：'+oldvalue;
    
    if (confirm('是否修改？\n'+'Date'+blinfo)==false){return;}

    var currentvalue=(prompt('输入Date',oldvalue) || '').trim();                        
    currentvalue=quote_2_cn_character_b(currentvalue);
    if (currentvalue==item[1]){
        alert('未修改');
        return;
    }
    if (currentvalue==''){return;}

    currentvalue=validdate_b(currentvalue);
    if (currentvalue===false){
        alert('日期格式错误');
        return;
    }
    currentvalue=date2str_b('-',currentvalue);
    if (nameset.has(item[0]+' '+currentvalue)){
        alert('存在同名的内容，取消修改');
        return;
    }

    content_all_f2f_global[csno][1]=currentvalue;
    array_2_local_storage_lt_f2f();
    draw_lt_f2f(csno);
}

function new_lt_f2f(){
    var encounter_str=quote_2_cn_character_b((prompt('输入：人名1 人名2#备注') || '').trim());
    if (encounter_str==''){return;}
    
    var blat=encounter_str.indexOf('#');
    if (blat>=0){
        var encounter_memo=encounter_str.substring(blat,);    
        encounter_str=encounter_str.substring(0,blat);
    } else {
        var encounter_memo='';    
    }

    var encounter_list=new Set(encounter_str.trim().split(' '));

    var nameset=old_value_get_f2f();
    
    var today=date2str_b('');
    var list_t=(prompt('输入时间段，以英文逗号或-间隔，如'+today.slice(0,6)+'09-'+today.slice(0,6)+'11',today+'-'+today) || '').trim().split(',');
    var date_list=[];
    for (let item of list_t){
        var range_t=item.trim().split('-');
        range_t[0]=validdate_b(range_t[0]);
        if (range_t[0]===false){
            alert('日期格式错误');
            return;
        }
        if (range_t.length==2){
            range_t[1]=validdate_b(range_t[1]);
            if (range_t[1]===false){
                alert('日期格式错误');
                return;
            }              
            var days=days_between_two_dates_b(range_t[0],range_t[1]);
            for (let blxl=0;blxl<=days;blxl++){
                date_list.push(date2str_b('-',range_t[0]));
                range_t[0].setTime(range_t[0].getTime()+24*60*60*1000);        
            }
        } else {
            date_list.push(date2str_b('-',range_t[0]));
        }
    }
    
    for (let anew_encounter of encounter_list){
        for (let adate of date_list){
            if (nameset.has(anew_encounter+' '+adate)){
                alert('存在同名的内容，取消添加：'+anew_encounter+' '+adate);
                return;
            }
        }
    }
    
    if (date_list.length>=2){
        var date_range=date_list[0]+' '+day_2_week_b(date_list[0],'cnbrief')+' ~ '+date_list[date_list.length-1]+' '+day_2_week_b(date_list[date_list.length-1],'cnbrief');
    } else {
        var date_range=date_list[0]+' '+day_2_week_b(date_list[0],'cnbrief');
    }
    
    if (confirm('是否添加'+encounter_list.size+'人（'+Array.from(encounter_list)+'）、'+date_list.length+'天（'+date_range+'）记录?')==false){return;}

    for (let anew_encounter of encounter_list){
        for (let adate of date_list){
            content_all_f2f_global.push([anew_encounter,adate,'l']);
        }
    }
    
    array_2_local_storage_lt_f2f();
    document.getElementById('span_count').innerHTML='('+content_all_f2f_global.length+')';
    search_f2f('');
}

function times_data_f2f(){
    var result_t={};
    for (let item of content_current_f2f_global){
        var blname=name_get_f2f(content_all_f2f_global[item][0]);
        if (result_t['n_'+blname]==undefined){
            result_t['n_'+blname]=[blname,[]];
        }
        result_t['n_'+blname][1].push(item[1]);
    }
    for (let key in result_t){
        result_t[key][1].sort();
    }
    
    return object2array_b(result_t);
    //每个元素形如："再次测试", [ "2022-01-01", "2022-01-02", "2022-01-03" ]    
}

function times_pie_f2f(){
    var result_t=times_data_f2f();
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]={label: result_t[blxl][0], data: result_t[blxl][1].length};
    }
    result_t.sort(function (a,b){return a['data']<b['data'] ? 1 : -1;}); //data 必须 加 引号 - 保留注释
    document.getElementById('divhtml').innerHTML='<div id="div_flot" style="width:600px;height:600px;"></div>';
    flot_pie_b(result_t,'div_flot');
}

function name_get_f2f(csstr){
    var blname=csstr.split('#')[0];
    if (blname==''){
        blname='unknown'
    }
    return blname;
}

function year_individual_f2f(){
    function year_individual_f2f_one_person(cslist,cscolor){
        var date_list=[];
        for (let one_date of cslist[1]){
            date_list.push([validdate_b(one_date),1]);
        }
        return date_count_dots_b(date_list,cscolor,1,1,'次',true,true,true,true,false,'1.3rem');
    }
    //-----------------------
    var color_list=['red','green','blue','black','orange'];
    var dates=year_range_f2f();
    if (dates==false){return;}
    var blstart=dates[0];
    var blend=dates.slice(-1)[0];
    
    var result_t={};
    for (let item of content_current_f2f_global){
        var blname=name_get_f2f(content_all_f2f_global[item][0]);
        if (result_t['n_'+blname]==undefined){
            result_t['n_'+blname]=[blname,[]];
        }
        result_t['n_'+blname][1].push(content_all_f2f_global[item][1]);
    }
    result_t=object2array_b(result_t);
    result_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});    
    result_t.sort(function (a,b){return a[1].length<b[1].length ? 1 : -1;});
    //result_t 每个元素形如："AAA", [ "2022-09-22", "2021-03-27" ] - 保留注释
    
    var color_no=0;
    var tr_list=[];
    for (let arow of result_t){
        var td_str=year_individual_f2f_one_person(arow,color_list[color_no]);
        tr_list.push('<tr><td align="center" valign="middle"><strong>'+arow[0]+'</strong></td><td><p>'+td_str+'</p></td></tr>');
        color_no=color_no+1;
        if (color_no>=color_list.length){
            color_no=0;
        }
    }

    document.getElementById('divhtml').innerHTML='<p>'+blstart+' '+blend+'</p>\n<table class="table_common">'+tr_list.join('\n')+'</table>';
    document.getElementById('div_page').innerHTML='';
}

function year_range_f2f(){
    var year_set=new Set();
    for (let item of content_current_f2f_global){
        var blyear=validdate_b(content_all_f2f_global[item][1]).getFullYear();
        year_set.add(blyear);
    }
    
    year_set=Array.from(year_set);
    year_set.sort();
    if (year_set.length==0){return false;}
    var year_min=year_set[0];
    var year_max=year_set.slice(-1)[0];
    
    var dates=[];
    for (let blxl=year_min;blxl<=year_max;blxl++){
        dates=dates.concat(year365_b(blxl));
    }
    return dates;
}

function year_all_f2f(){    
    var result_t={};
    for (let item of content_current_f2f_global){
        var blkey=content_all_f2f_global[item][1];
        if (result_t[blkey]==undefined){
            result_t[blkey]=0;
        }
        result_t[blkey]=result_t[blkey]+1;
    }
    
    result_t=object2array_b(result_t,true);
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl][0]=validdate_b(result_t[blxl][0]);
    }
    document.getElementById('divhtml').innerHTML=date_count_dots_b(result_t,'brown',5,1,'次',true,true,true,true,true,'1.3rem');
    document.getElementById('div_page').innerHTML='';
}
