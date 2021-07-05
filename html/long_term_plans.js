function menu_lt_plans(){
    var str_t=klmenu_hide_b('#top');
    var blsymbol=local_storage_get_b('symbol_long_term_plans',-1,false);
    if (blsymbol==''){
        blsymbol=symbol_manage_lt_plans('default');
    }
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'search_lt_plans();">计划搜索</span>',   
    '<span id="span_reg_lt_plan" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id,true);">⚪ 正则</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'blank_lt_plans();">新计划</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'backup_lt_plans();">编辑/导入/导出</span>', 
    '<span id="span_symbol_lt_plans" class="span_menu" onclick="javascript:'+str_t+'symbol_manage_lt_plans();">符号：'+blsymbol+'</span>',    
    '<span id="span_simple_lt_plan" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id,true);">⚪ Simple</span>',    
    ];
    
    var klmenu_sort=[
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'1a\';init_lt_plans();">名称升序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'1\';init_lt_plans();">名称降序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'2a\';init_lt_plans();">开始日期升序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'2\';init_lt_plans();">开始日期降序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'4a\';init_lt_plans();">结束日期升序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'4\';init_lt_plans();">结束日期降序</span>',         
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'-1a\';init_lt_plans();">进度升序</span>',
        '<span class="span_menu" onclick="javascript:'+str_t+'ltp_sort_type_global=\'-1\';init_lt_plans();">进度降序</span>',
    ];
    
    var klmenu_config=[
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'long_term_plans\');}">更新版本</span>',
    ];
    klmenu_config=root_font_size_menu_b(str_t,true,true,true).concat(klmenu_config);
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'⛳','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_sort,'↕','10rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','14rem','1rem','1rem','60rem'),'','0rem');
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg+' ');
    klmenu_check_b('span_reg_lt_plan',true);
}

function search_lt_plans(){
    var blstr=(prompt('输入搜索关键字：',recent_search_key_lt_plan_global) || '').trim();
    if (blstr==''){
        return;
    }
    recent_search_key_lt_plan_global=blstr;
    init_lt_plans(blstr);
}

function symbol_manage_lt_plans(cstype='set'){
    var default_symbol='○,●';
    if (cstype=='default'){
        return default_symbol;
    }
    
    var ospan=document.getElementById('span_symbol_lt_plans');
    if (!ospan){return;}
    
    var blstr=ospan.innerText.trim();
    if (blstr.substring(0,3)=='符号：'){
        blstr=blstr.substring(3,).trim();
    }
    
    var list_t=blstr.split(',');
    if (list_t.length==2){
        var old_symbol=blstr;
    }
    else {
        var old_symbol=default_symbol;
    }
    switch (cstype){
        case 'get':
            return old_symbol.split(',');
            break;
        case 'set':
            var new_symbol=(prompt('设置符号，并以英文逗号间隔：',old_symbol) || '').replace(new RegExp(/\s/,'g'),'').split(',');
            if (new_symbol[0]=='默认'){
                new_symbol=default_symbol.split(',');
            }
            else if (new_symbol.length!==2 || new_symbol == old_symbol){return;}
            ospan.innerText='符号：'+new_symbol.join(',');
            localStorage.setItem('symbol_long_term_plans',new_symbol.join(','));
            break;
    }
}

function update_lt_plans(){
    var otextarea_item=document.getElementById('textarea_backup_ltp');
    if (!otextarea_item){return;}
    var blitems=otextarea_item.value.trim();
    if (confirm("是否更新数据？")){
        localStorage.setItem('list_long_term_plans',blitems);
        init_lt_plans();
    }
}

function array_2_local_storage_lt_plans(){
    array_2_local_storage_b('list_long_term_plans',long_term_plans_global);
}

function local_storage_2_array_lt_plans(do_join_sort=false){   
    var is_ok;
    var result_t;
    [is_ok,result_t]=local_storage_2_array_b('list_long_term_plans',6,do_join_sort);
    if (is_ok === false){
        alert('发现重复key: '+result_t+'，未更新');
        return;
    }
    
    for (let blxl=0;blxl<result_t.length;blxl++){
        result_t[blxl][3]=parseFloat(result_t[blxl][3]);
        result_t[blxl][5]=parseFloat(result_t[blxl][5]);
        result_t[blxl][6]=parseFloat(result_t[blxl][6]);    
    }
    long_term_plans_global=result_t;

    sort_lt_plans();
    array_2_local_storage_lt_plans();
}

function sort_lt_plans(){
    if (ltp_sort_type_global==''){return;}
    else if (ltp_sort_type_global.includes('-1')){
        long_term_plans_global.sort(function (a,b){return percent_lt_plans(a)<percent_lt_plans(b);});    
    }
    else {
        var blno=parseInt((ltp_sort_type_global+'0').substring(0,1));
        if (isNaN(blno)){
            blno=0;
        }
        blno=Math.min(4,Math.max(0,blno));
        long_term_plans_global.sort(function (a,b){return a[blno]<b[blno];});
    }
    
    if (ltp_sort_type_global.includes('a')){
        long_term_plans_global.reverse();
    }    
}

function send_lt_plans(){
    if (confirm("是否发送到临时记事本？")){
        document.querySelector('form[name="form_lt_plans"]').submit();
    }
}

function backup_lt_plans(){
    ltp_sort_type_global='';
    local_storage_2_array_lt_plans(true);
    init_lt_plans('',false);
    
    var items=local_storage_get_b('list_long_term_plans',-1,false);
    var postpath=postpath_b();
    var bljg='<div id="div_backup" style="width:90%;margin:0.5rem;">';
    bljg=bljg+'<div id=div_help></div>'
    bljg=bljg+'<p><b>项目：</b></p>';
    bljg=bljg+'<form method="POST" action="'+postpath+'temp_txt_share.php?type=list_long_term_plans" name="form_lt_plans" target=_blank>\n';
    bljg=bljg+'<textarea id="textarea_backup_ltp" name="textarea_backup_ltp" style="width:100%;height:10rem;">'+items+'</textarea>';
    bljg=bljg+'<p align=right>';
    bljg=bljg+'<span class="aclick"  onclick="javascript:document.getElementById(\'div_backup\').style.display=\'none\';">Close</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:local_storage_view_form_b(\'PIM\',\'div_backup\');">查看 localStorage(PIM系列)</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:help_lt_plans();">Help</span> ';

    bljg=bljg+'<span class="aclick" onclick="javascript:update_lt_plans();">更新</span> ';   
    bljg=bljg+textarea_buttons_b('textarea_backup_ltp','清空,复制,发送到临时记事本,发送地址','list_long_term_plans')+' ';
    bljg=bljg+'</p>';
    bljg=bljg+'</form>';
    bljg=bljg+'</div>';
    var odiv=document.getElementById('div_backup');
    if (odiv){
        odiv.outerHTML=bljg;
    }
    else {
        document.getElementById('divhtml').insertAdjacentHTML('afterbegin',bljg);
    }
}

function help_lt_plans(){
    //history
    //0.0.2-20201107 增加计划搜索功能
    //0.0.1-20200422
    //-----------------------
    var bljg=`ver. 0.0.2-20201107
    <b>格式如下：</b>
    ---
    项目编号1
    项目名称1
    起始日期，形式如：2020-04-23
    初值，形式如：380
    结束日期，形式如：2021-12-31
    终值，形式如：0
    当前值，形式如：340
    ---
    项目编号2
    项目名称2
    2020-04-23
    89
    2020-12-31
    100
    90`;
    document.getElementById('div_help').innerHTML=bljg.split('\n').join('<br />');
}

function percent_lt_plans(csitem){
    var blcount=csitem[5]-csitem[3];
    if (blcount==0){return false;}
    var blcurrent=parseFloat(csitem[6])-csitem[3];

    return Math.abs(blcurrent/blcount);
}

function draw_lt_plans(csno){
    function sub_draw_lt_plans_dots(dots){
        var bljg=[];
        for (let item of dots){
            bljg.push('<span style="color:'+item[1]+';margin-right:0.1rem;" title="'+item[0]+'. '+item[3]+'">'+item[2]+'</span>');
        }
        return bljg.join('');
    }
    
    function sub_draw_lt_plans_section(dot_list,cscolor){
        var days=10;
        if (is_simple && dot_list.length>=days*2+days){
            return sub_draw_lt_plans_dots(dot_list.slice(0,days))+'<span style="color:'+cscolor+';" title="'+dot_list[days][3]+'—'+dot_list.slice(-1*days-1,-1*days)[0][3]+'">…'+'('+(dot_list.length-days*2)+'天)…</span>'+sub_draw_lt_plans_dots(dot_list.slice(-1*days,));
        }
        else {
            return sub_draw_lt_plans_dots(dot_list);
        }    
    }
    //---------------------------
    var csitem=long_term_plans_global[csno];
    var start_day = validdate_b(csitem[2]);
    var end_day = validdate_b(csitem[4]);
    var today=new Date();
    var today_str=date2str_b('/',today);
    var all_days=Math.ceil((end_day-start_day+1)/(1000*3600*24));
    if (all_days<=0){return;}
    var used_days=Math.ceil((today-start_day)/(1000*3600*24));
    
    var blpercent=percent_lt_plans(csitem);
    if (blpercent===false){return;}
    
    var blposition=Math.min(all_days,Math.max(0,parseInt(blpercent*all_days)));
    
    var bljg='<tr><td><b>'+(csno+1)+'.';
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',1);">'+csitem[1]+'</span>';
    bljg=bljg+'</b> <small>[';
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',3);">初值: '+csitem[3]+'; '+'</span>';    
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',5);">终值: '+csitem[5]+'; '+'</span>';    
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',6);">进度: '+csitem[6]+', '+(blpercent*100).toFixed(2)+'%</span>';
    bljg=bljg+']</small></td></tr>';
    bljg=bljg+'<tr><td style="font-size:0.72rem;line-height:120%;padding:0.1rem;overflow-wrap: anywhere;">';
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',2);">'+csitem[2]+'</span> ';

    var symbol_list=symbol_manage_lt_plans('get');
    
    var is_simple=klmenu_check_b('span_simple_lt_plan',false);
    //------------------
    var dot_list=[];
    for (let blxl=1;blxl<=blposition;blxl++){
        var day_str=date2str_b('/',start_day);
        if (day_str==today_str){
            bljg=bljg+sub_draw_lt_plans_section(dot_list,'green');
            dot_list=[];
            bljg=bljg+sub_draw_lt_plans_dots([[blxl,'red',symbol_list[1],day_str]]);
        }
        else {
            dot_list.push([blxl,'green',symbol_list[1],day_str]);
        }
        start_day.setTime(start_day.getTime()+24*60*60*1000);
    }
    bljg=bljg+sub_draw_lt_plans_section(dot_list,'green');
    
    dot_list=[];
    for (let blxl=blposition+1;blxl<=all_days;blxl++){
        var day_str=date2str_b('/',start_day);
        if (day_str==today_str){
            bljg=bljg+sub_draw_lt_plans_section(dot_list,'grey');
            dot_list=[];        
            bljg=bljg+sub_draw_lt_plans_dots([[blxl,'red',symbol_list[1],day_str]]);
        }
        else {
            dot_list.push([blxl,'grey',symbol_list[0],day_str]);
        }
        start_day.setTime(start_day.getTime()+24*60*60*1000);
    }
    bljg=bljg+sub_draw_lt_plans_section(dot_list,'grey');
    //------------------
    
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',4);">'+csitem[4]+'</span> ('+all_days+'天)';
    bljg=bljg+'</td></tr>';
    
    var otable=document.getElementById('table_'+csitem[0]);
    if (otable){
        otable.innerHTML=bljg;
    }
    else {
        document.getElementById('divhtml').insertAdjacentHTML('beforeend','<table id="table_'+csitem[0]+'">'+bljg+'</table>');
    }
}

function init_lt_plans(cskey='',reload=true){
    if (reload){
        local_storage_2_array_lt_plans();
    }
    document.getElementById('divhtml').innerHTML='';

    var bljg=array_repeated_column_value_b(long_term_plans_global,0);
    if (bljg.length>0){
        document.getElementById('divhtml').innerHTML='<h4>发现重复key：</h4>'+bljg.join('<br />');
        return;
    }
    if (long_term_plans_global.length==0){
        long_term_plans_global.push(['plan0001','项目名称Demo','2020-05-01',10,'2020-10-31',100,20]);
        array_2_local_storage_lt_plans();
    }

    var isreg=klmenu_check_b('span_reg_lt_plan',false);
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }

    if (cskey!==''){
        for (let blxl=0;blxl<long_term_plans_global.length;blxl++){
            var item=long_term_plans_global[blxl][1];   //项目名称 - 保留注释
            blfound=str_reg_search_b(item,cskey,isreg);
            if (blfound==-1){
                break;
            }
            if (blfound){
                draw_lt_plans(blxl);
            }
        }
    }
    else {
        for (let blxl=0;blxl<long_term_plans_global.length;blxl++){
            draw_lt_plans(blxl);
        }
    }
    document.getElementById('span_count').innerHTML='('+long_term_plans_global.length+')';
}

function change_lt_plans(csid,csnumber){
    csnumber=parseInt(csnumber);
    var list_t=["项目编号","项目名称","起始日期","初值","结束日期","终值","当前值"];
    if (csnumber<1 || csnumber>=list_t.length){return;}
    
    for (let blxl=0;blxl<long_term_plans_global.length;blxl++){
        var item=long_term_plans_global[blxl];
        if (item[0]==csid){
            if (csnumber!==list_t.length-1){
                if (confirm(list_t[csnumber]+'：'+item[csnumber]+"\n是否修改？")==false){
                    break;
                }
            }
            var currentvalue=(prompt('输入'+list_t[csnumber],item[csnumber]) || '').trim();
            if (currentvalue!==''){
                if ([3,5,6].includes(csnumber)){
                    currentvalue=parseFloat(currentvalue);
                    if (csnumber==3 && long_term_plans_global[blxl][5]==currentvalue || csnumber==5 && long_term_plans_global[blxl][3]==currentvalue){
                        alert('初值终值不能相同');
                        return;                        
                    }
                }
                else if ([2,4].includes(csnumber)){
                    currentvalue=validdate_b(currentvalue);
                    if (currentvalue===false){
                        alert('日期格式错误');
                        return;
                    }
                    currentvalue=date2str_b('-',currentvalue);
                    if (csnumber==2 && long_term_plans_global[blxl][4]<=currentvalue || csnumber==4 && long_term_plans_global[blxl][2]>=currentvalue){
                        alert('日期不能相同，结束日期不能小于起始日期');
                        return;                        
                    }
                }
                long_term_plans_global[blxl][csnumber]=currentvalue;
                array_2_local_storage_lt_plans();
                draw_lt_plans(blxl);
            }
            break;
        }
    }
}

function blank_lt_plans(){
    if (confirm("是否添加空白计划？")==false){
        return;
    }
    var blid='plan'+date2str_b('')+'_';
    var blxl=1;
    var id_list=[];
    for (let item of long_term_plans_global){
        id_list.push(item[0]);
    }
    while (true){
        if (id_list.includes(blid+blxl)){
            blxl=blxl+1;
        }
        else {break;}
    }
    var list_t=[blid+blxl,'空白计划'+blxl,date2str_b(),0,next_day_b('',10),100,0];
    long_term_plans_global.push(list_t);
    array_2_local_storage_lt_plans();
    draw_lt_plans(long_term_plans_global.length-1);
    document.getElementById('span_count').innerHTML='('+long_term_plans_global.length+')';
}
