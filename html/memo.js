function menu_lt_klmemo(){
    var str_t=klmenu_hide_b('#top');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'search_lt_klmemo();">搜索</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'init_lt_klmemo(\'DONE\');">已完成的事项</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'new_klmemo();">新Memo</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'backup_lt_klmemo();">编辑/导入/导出</span>', 
    ];

    var klmenu_sort=[
        '<span class="span_menu" onclick="javascript:'+str_t+'klmemo_sort_type_global=\'0a\';init_lt_klmemo();">名称升序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'klmemo_sort_type_global=\'0\';init_lt_klmemo();">名称降序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'klmemo_sort_type_global=\'1a\';init_lt_klmemo();">开始日期升序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'klmemo_sort_type_global=\'1\';init_lt_klmemo();">开始日期降序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'klmemo_sort_type_global=\'2a\';init_lt_klmemo();">结束日期升序</span>',     
        '<span class="span_menu" onclick="javascript:'+str_t+'klmemo_sort_type_global=\'2\';init_lt_klmemo();">结束日期降序</span>',         
    ];
    
    var klmenu_config=[
    '<span class="span_menu" onclick="javascript:'+str_t+'kl_remote_host_address_b();">设置form发送地址</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'pwa_memo_store\',\'memo_service_worker.js\');}">更新版本</span>',
    ];
    klmenu_config=root_font_size_menu_b(str_t).concat(klmenu_config);
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'🧷','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_sort,'↕','10rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','14rem','1rem','1rem','60rem'),'','0rem');
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg+' ');
}

function search_lt_klmemo(){
    var blstr=(prompt('输入搜索关键字：') || '').trim();
    if (blstr==''){
        return;
    }
    init_lt_klmemo(blstr);
}

function update_lt_klmemo(){
    var otextarea_item=document.getElementById('textarea_backup_memo');
    if (!otextarea_item){return;}
    var blitems=otextarea_item.value.trim();
    if (confirm("是否更新数据？")){
        localStorage.setItem('klmemo_item',blitems);
        init_lt_klmemo();
    }
}

function array_2_local_storage_lt_klmemo(){
    var bljg='';
    for (let one_row of klmemo_global){
        bljg=bljg+'---\n';
        for (let one_col of one_row){
            bljg=bljg+one_col+'\n';
        }
    }
    localStorage.setItem('klmemo_item',bljg.trim());
}

function delete_klmemo(){
    if (confirm("是否清空完成项？")){
        local_storage_2_array_lt_klmemo(true);
        init_lt_klmemo();
    }        
}

function local_storage_2_array_lt_klmemo(do_delete=false){
    var items=('\n'+local_storage_get_b('klmemo_item',-1,false)).split('\n---\n');
    var ids=[];
    for (let one_item of items){
        var list_t=one_item.trim().split('\n');
        var bllen=list_t.length;
        if (bllen<3){
            continue;
        }
        if (ids.includes(list_t[0])){
            alert('发现重复名称: '+list_t[0]+'，未更新');
            return;
        }
        ids.push(list_t[0]);
    }
    
    klmemo_global=[];
    for (let one_item of items){
        var list_t=one_item.trim().split('\n');
        var bllen=list_t.length;
        if (bllen<3){
            continue;
        }
        if (do_delete){
            var start_day = validdate_b(list_t[1]);
            var end_day = validdate_b(list_t[2]);
            if (start_day!==false && end_day!==false){
                if (end_day>=start_day){continue;}
            }
        }
        klmemo_global.push(list_t);
    }
    
    var blno=parseInt((klmemo_sort_type_global+'0').substring(0,1));
    if (isNaN(blno)){
        blno=0;
    }
    blno=Math.min(2,Math.max(0,blno));
    klmemo_global.sort(function (a,b){return a[blno]>b[blno];});
    if (klmemo_sort_type_global.includes('a')){
        klmemo_global.reverse();
    }
    array_2_local_storage_lt_klmemo();
}

function send_lt_klmemo(){
    if (confirm("是否发送到临时记事本？")){
        document.querySelector('form[name="form_backup_memo"]').submit();
    }
}

function backup_lt_klmemo(){
    var items=local_storage_get_b('klmemo_item',-1,false);
    var postpath=postpath_b();
    var bljg='<div id="div_backup" style="width:90%;margin:0.5rem;">';
    bljg=bljg+'<div id=div_help></div>'
    bljg=bljg+'<p><b>项目：</b></p>';
    bljg=bljg+'<form method="POST" action="'+postpath+'temp_txt_share.php?type=klmemo" name="form_backup_memo" target=_blank>\n';
    bljg=bljg+'<textarea id="textarea_backup_memo" name="textarea_backup_memo" style="width:100%;height:10rem;">'+items+'</textarea>';
    bljg=bljg+'<p align=right>';
    bljg=bljg+'<span class="aclick"  onclick="javascript:document.getElementById(\'div_backup\').style.display=\'none\';">Close</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:help_lt_klmemo();">Help</span> ';

    bljg=bljg+'<span class="aclick" onclick="javascript:update_lt_klmemo();">更新</span> ';   
    bljg=bljg+textarea_buttons_b('textarea_backup_memo','清空,复制,发送到临时记事本,发送地址','klmemo')+' ';
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

function help_lt_klmemo(){
    //history
    //0.0.1-20201225
    //-----------------------
    var bljg=`ver. 0.0.1-20201225
    <b>格式如下：</b>
    ---
    Memo1
    起始日期，形式如：2020-04-23
    结束日期，形式如：2021-12-31
    ---
    Memo2
    2020-04-23
    2020-12-31
    `;
    document.getElementById('div_help').innerHTML=bljg.split('\n').join('<br />');
}

function draw_lt_klmemo(csno){
    var csitem=klmemo_global[csno];
    var start_day = validdate_b(csitem[1]);
    var end_day = validdate_b(csitem[2]);
    var today=new Date();
    var today_str=date2str_b('/',today);
    var all_days=Math.ceil((end_day-start_day+1)/(1000*3600*24));
    if (all_days<0){
        all_days='';
    }
    else {
        all_days=' ('+all_days+'天)';
    }
    
    var bljg='';
    bljg=bljg+'<hr /><p style="font-size:0.8rem;color:'+scheme_global['color']+';background-color:'+scheme_global[(csitem[2]<csitem[1]?'skyblue':'button')]+';">'+(csno+1)+'. <span style="cursor:pointer;" onclick="change_lt_klmemo(\''+csitem[0]+'\',1);">'+csitem[1]+'</span>&nbsp;&nbsp;-&nbsp;&nbsp;';

    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_klmemo(\''+csitem[0]+'\',2);">'+(csitem[2]<csitem[1]?'yyyy-mm-dd':csitem[2])+'</span>'+all_days+'</p>';
    bljg=bljg+'<p style="font-size:1.2rem;"><b>';
    bljg=bljg+'<span style="cursor:pointer;" onclick="change_lt_klmemo(\''+csitem[0]+'\',0);">'+csitem[0]+'</span>';
    bljg=bljg+'</b></p><hr />';    
    var otable=document.getElementById('div_memo_'+csno);
    if (otable){
        otable.innerHTML=bljg;
    }
    else {
        document.getElementById('divhtml').insertAdjacentHTML('afterbegin','<div id="div_memo_'+csno+'" width=100%>'+bljg+'</div>\n');
    }
}

function init_lt_klmemo(cskey=''){
    local_storage_2_array_lt_klmemo();
    document.getElementById('divhtml').innerHTML='';

    var bljg=array_repeated_column_value_b(klmemo_global,0);
    if (bljg.length>0){
        document.getElementById('divhtml').innerHTML='<h4>发现重复名称：</h4>'+bljg.join('<br />');
        return;
    }
    if (klmemo_global.length==0){
        klmemo_global.push(['Memo Demo','2020-05-01','2020-10-31']);
        array_2_local_storage_lt_klmemo();
    }
    document.getElementById('span_count').innerHTML='('+klmemo_global.length+')';

    if (cskey=='DONE'){
        var blfound=false;
        for (let blxl=0;blxl<klmemo_global.length;blxl++){
            var item=klmemo_global[blxl];
            var start_day = validdate_b(item[1]);
            var end_day = validdate_b(item[2]);
            if (start_day===false || end_day===false){continue;}
            if (end_day<start_day){continue;}
            blfound=true;
            draw_lt_klmemo(blxl);
        }
        if (blfound){
            document.getElementById('divhtml').insertAdjacentHTML('afterbegin','<p><span class="aclick" onclick="javascript:delete_klmemo();">清空已完成项</span></p>');
        }
        return;
    }
    var isreg=false;
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    
    if (cskey!==''){
        for (let blxl=0;blxl<klmemo_global.length;blxl++){
            var item=klmemo_global[blxl][0];   //Memo Name - 保留注释
            blfound=str_reg_search_b(item,cskey,isreg);
            if (blfound==-1){
                break;
            }
            if (blfound){
                draw_lt_klmemo(blxl);
            }
        }
    }
    else {
        for (let blxl=0;blxl<klmemo_global.length;blxl++){
            draw_lt_klmemo(blxl);
        }
    }
}

function change_lt_klmemo(csid,csnumber){
    csnumber=parseInt(csnumber);
    var list_t=["Memo Name","起始日期","结束日期"];
    if (csnumber<0 || csnumber>=list_t.length){return;}
    
    var nameset=new Set();
    for (let item of klmemo_global){
        nameset.add(item[0]);
    }
    
    for (let blxl=0;blxl<klmemo_global.length;blxl++){
        var item=klmemo_global[blxl];
        if (item[0]==csid){            
            var oldvalue=item[csnumber];
            var blinfo='：'+oldvalue;
            if (csnumber==2 && item[2]<item[1]){
                oldvalue=date2str_b();
                blinfo='';
            }
            
            if (confirm('是否修改？\n'+list_t[csnumber]+blinfo)==false){
                break;
            }
                        
            var currentvalue=(prompt('输入'+list_t[csnumber],oldvalue) || '').trim();
            if (currentvalue==item[csnumber]){
                alert('未修改');
                return;
            }
            if (currentvalue!==''){
                if (csnumber==0){
                    if (nameset.has(currentvalue)){
                        alert('存在同名的Memo，取消修改');
                        return;
                    }
                }            
                else if ([1,2].includes(csnumber)){
                    currentvalue=validdate_b(currentvalue);
                    if (currentvalue===false){
                        alert('日期格式错误');
                        return;
                    }
                    currentvalue=date2str_b('-',currentvalue);
                }
                klmemo_global[blxl][csnumber]=currentvalue;
                array_2_local_storage_lt_klmemo();
                draw_lt_klmemo(blxl);
            }
            break;
        }
    }
}

function new_klmemo(){
    var newmemo=(prompt('输入Memo') || '').trim();
    if (newmemo==''){return;}
    var name_list=new Set();
    for (let item of klmemo_global){
        name_list.add(item[0]);
    }
    if (name_list.has(newmemo)){
        alert('存在同名的Memo，取消添加');
        return;
    }
    if (confirm("是否添加？")==false){
        return;
    }
    var list_t=[newmemo,date2str_b(),previous_day_b('',10)];
    klmemo_global.push(list_t); //此处无sort - 保留注释
    array_2_local_storage_lt_klmemo();
    draw_lt_klmemo(klmemo_global.length-1);
    document.getElementById('span_count').innerHTML='('+klmemo_global.length+')';
}
