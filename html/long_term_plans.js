function menu_lt_plans(){
    var str_t=klmenu_hide_b('#top');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'search_lt_plans();">计划搜索</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'blank_lt_plans();">新计划</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'backup_lt_plans();">编辑/导入/导出</span>', 
    ];

    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'pwa_long_term_plans_store\',\'long_term_plans_service_worker.js\');}">更新版本</span>',
    ];
    klmenu2=root_font_size_menu_b(str_t,true,true,true).concat(klmenu2);
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'⛳','14rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','14rem','1rem','1rem','60rem'),'','0rem');
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg+' ');
}

function search_lt_plans(){
    var blstr=(prompt('输入搜索关键字：') || '').trim();
    if (blstr==''){
        return;
    }
    init_lt_plans(blstr);
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
    var bljg='';
    for (let one_row of long_term_plans_global){
        bljg=bljg+'---\n';
        for (let one_col of one_row){
            bljg=bljg+one_col+'\n';
        }
    }
    localStorage.setItem('list_long_term_plans',bljg.trim());
}

function local_storage_2_array_lt_plans(){
    var items=('\n'+local_storage_get_b('list_long_term_plans',-1,false)).split('\n---\n');
    var ids=[];
    for (let one_item of items){
        var list_t=one_item.trim().split('\n');
        var bllen=list_t.length;
        if (bllen<6){
            continue;
        }
        if (ids.includes(list_t[0])){
            alert('发现重复key: '+list_t[0]+'，未更新');
            return;
        }
        ids.push(list_t[0]);
    }
    long_term_plans_global=[];
    for (let one_item of items){
        var list_t=one_item.trim().split('\n');
        var bllen=list_t.length;
        if (bllen<6){
            continue;
        }
        list_t[3]=parseFloat(list_t[3]);
        list_t[5]=parseFloat(list_t[5]);
        list_t[6]=parseFloat(list_t[6]);
        
        long_term_plans_global.push(list_t);
    }
    long_term_plans_global.sort();
    array_2_local_storage_lt_plans();
}

function send_lt_plans(){
    if (confirm("是否发送到临时记事本？")){
        document.querySelector('form[name="form_lt_plans"]').submit();
    }
}

function backup_lt_plans(){
    var items=local_storage_get_b('list_long_term_plans',-1,false);
    var postpath=postpath_b();
    var bljg='<div id="div_backup" style="width:90%;margin:0.5rem;">';
    bljg=bljg+'<div id=div_help></div>'
    bljg=bljg+'<p><b>项目：</b></p>';
    bljg=bljg+'<form method="POST" action="'+postpath+'temp_txt_share.php?type=long_term_plans" name="form_lt_plans" target=_blank>\n';
    bljg=bljg+'<textarea id="textarea_backup_ltp" name="textarea_backup_ltp" style="width:100%;height:10rem;">'+items+'</textarea>';
    bljg=bljg+'<p align=right>';
    bljg=bljg+'<span class="aclick"  onclick="javascript:document.getElementById(\'div_backup\').style.display=\'none\';">Close</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:help_lt_plans();">Help</span> ';

    bljg=bljg+'<span class="aclick" onclick="javascript:update_lt_plans();">更新</span> ';   
    bljg=bljg+textarea_buttons_b('textarea_backup_ltp','清空,复制,发送到临时记事本,发送地址','long_term_plans')+' ';
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

function draw_lt_plans(csno){
    var csitem=long_term_plans_global[csno];
    var start_day = validdate_b(csitem[2]);
    var end_day = validdate_b(csitem[4]);
    var today=new Date();
    var today_str=date2str_b('/',today);
    var all_days=Math.ceil((end_day-start_day+1)/(1000*3600*24));
    if (all_days<=0){return;}
    var used_days=Math.ceil((today-start_day)/(1000*3600*24));
    
    var blcount=csitem[5]-csitem[3];
    if (blcount==0){return;}
    var blcurrent=parseFloat(csitem[6])-csitem[3];

    var blpercent=Math.abs(blcurrent/blcount);
    var blposition=parseInt(blpercent*all_days);
    //var divstyle='position:relative;float:left;margin:0.1rem;font-size:0.8rem;line-height:100%;';
    var bljg='<tr><td><b>'+(csno+1)+'.';
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',1);">'+csitem[1]+'</span>';
    bljg=bljg+'</b> <small>[';
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',3);">初值: '+csitem[3]+'; '+'</span>';    
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',5);">终值: '+csitem[5]+'; '+'</span>';    
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',6);">进度: '+csitem[6]+', '+(blpercent*100).toFixed(2)+'%</span>';
    bljg=bljg+']</small></td></tr>';
    bljg=bljg+'<tr><td style="font-size:0.72rem;line-height:120%;padding:0.1rem;word-break:break-all;word-wrap:break-word;">';
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_plans(\''+csitem[0]+'\',2);">'+csitem[2]+'</span> ';

    for (let blxl=1;blxl<=all_days;blxl++){
        var day_str=date2str_b('/',start_day);
        var list_t=['grey','○'];
        if (blxl<=blposition){
            list_t=['green','●'];
        }
        if (day_str==today_str){
            list_t=['red','●'];
        }
        bljg=bljg+'<span style="color:'+list_t[0]+';margin-right:0.1rem;" title="'+blxl+'. '+day_str+'">'+list_t[1]+'</span>';
        //bljg=bljg+'<div style="'+divstyle+'" title="'+blxl+'. '+day_str+'">'+blstr+'</div>';
        start_day.setTime(start_day.getTime()+24*60*60*1000);
    }
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

function init_lt_plans(cskey=''){
    local_storage_2_array_lt_plans();
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

    var isreg=false;
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
                }
                else if ([2,4].includes(csnumber)){
                    currentvalue=validdate_b(currentvalue);
                    if (currentvalue===false){
                        alert('日期格式错误');
                        return;
                    }
                    currentvalue=date2str_b('-',currentvalue);
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
