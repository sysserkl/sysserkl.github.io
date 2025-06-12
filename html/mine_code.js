function list_klmine(cslevel=0){
    if (cslevel==0){
        var cspercent=0.15;
        level_caption_global='Easy';
    } else if (cslevel==1){
        var cspercent=0.2;
        level_caption_global='Middle';
    } else {
        var cspercent=0.25;
        level_caption_global='Hard';
    }
    document.getElementById('div_menu').innerHTML='';
    if (rows_global==-1){
        rows_global=Math.floor((window_h_global+2*box_border_global)/(boxsize_global+box_border_global+box_border_global))-1;
    }
    if (cols_global==-1){
        cols_global=Math.floor((window_w_global+2*box_border_global)/(boxsize_global+box_border_global+box_border_global))-1;
    }

    var bljg='<table align=center cellpadding=0 cellspacing=0>';
    mine_total_global=0;
    mine_list_global=[];
    
    //-----------------------
    var list_t=[];
    for (let blxl=0;blxl<rows_global*cols_global;blxl++){
        list_t.push(blxl<rows_global*cols_global*cspercent?-1:0);
    }
    list_t.sort(randomsort_b);
    //-----------------------
    
    var blxl=0;
    for (let blr=0;blr<rows_global;blr++){
        bljg=bljg+'<tr>';
        for (let blc=0;blc<cols_global;blc++){
            bljg=bljg+'<td align=center id="td_'+blr+'_'+blc+'" style="color:'+P_klmine_g.mask_bcolor+';padding: 0.5rem '+boxsize_global/2+'px;border:'+box_border_global+'px solid skyblue;box-shadow: inset '+box_border_global*2+'px '+box_border_global*2+'px '+box_border_global+'px gray;border-radius: '+box_border_global*3+'px;background-color:'+P_klmine_g.mask_bcolor+';cursor:pointer;" onclick="menu_klmine(this);">';
            
            var blvalue=list_t[blxl];
            blxl=blxl+1;
            mine_list_global['td_'+blr+'_'+blc]=blvalue;
            mine_total_global=mine_total_global+(blvalue==-1?1:0);
            bljg=bljg+empty_td_content_global+'</td>';
        }
        bljg=bljg+'</tr>';
    }
    bljg=bljg+'</table>';

    document.getElementById('div_cp').innerHTML=bljg+buttons_klmine();
}

function buttons_klmine(){
    var buttons='<p style="font-size:1.5rem;margin:0.5rem;" id="p_status">New Game ';
    buttons=buttons+'<span class="aclick" onclick="list_klmine(0);first_klmine();">Easy</span> ';
    buttons=buttons+'<span class="aclick" onclick="list_klmine(1);first_klmine();">Middle</span> ';
    buttons=buttons+'<span class="aclick" onclick="list_klmine(2);first_klmine();">Hard</span> ';
    buttons=buttons+'<span class="aclick" onclick="record_klmine();">Record</span> ';
    buttons=buttons+'<span id="span_remain" style="color:blue;">'+mine_total_global+'</span> - <span id="span_total" style="color:blue;">'+mine_total_global+'</span>/<span id="span_size" style="color:blue;">'+(rows_global*cols_global)+'</span> ';
    buttons=buttons+'<span id="span_level">'+level_caption_global+'</span> <span id="span_timer"></span> ';
    buttons=buttons+'<span id="span_game_over" style="color:red;"></span></p>';
    return buttons;
}

function max_rows_cols_klmine(){
    var otds=document.getElementsByTagName('td');
    var rows=0;
    var cols=0;
    var pstatus=document.getElementById('p_status');
    var psize=pstatus.getBoundingClientRect();
    for (let onetd of otds){
        var rect =onetd.getBoundingClientRect();
        if (rect.right>window_w_global){
            cols=onetd.id.split('_')[2];
            break;
        }
    }
    for (let onetd of otds){
        var rect =onetd.getBoundingClientRect();
        if (rect.bottom>window_h_global-psize.height){
            rows=onetd.id.split('_')[1];
            break;
        }
    }
    rows_global=rows-1;
    cols_global=cols-1;
}

function open_klmine(csid){
    var otd=document.getElementById(csid);
    var list_t=csid.split('_');
    var blr=parseInt(list_t[1]);
    var blc=parseInt(list_t[2]);
    clean_klmine(blr,blc);
}

function menu_klmine(otd){
    var rect=otd.getBoundingClientRect();
    if (ismine_klmine(otd.innerHTML)){
        var bljg='<button style="padding:0.5rem;width:3rem;" onclick="count_klmine(\''+otd.id+'\',0)">✓</button><br /><button style="padding:0.5rem;width:3rem;" onclick="count_klmine(\''+otd.id+'\',-2)">&nbsp;</button>';
    } else if (otd.style.backgroundColor==P_klmine_g.mask_bcolor){
        var bljg='<button style="padding:0.5rem;width:3rem;" onclick="count_klmine(\''+otd.id+'\',0)">✓</button><br /><button style="padding:0.5rem;width:3rem;" onclick="count_klmine(\''+otd.id+'\',-1)">'+mine_character_global+'</button>';
    } else if (td_get_value_klmine(otd.id)>0 && iscleaned_klmine(otd.id)==false){
        var bljg='<button style="padding:0.5rem;width:4rem;" onclick="open_klmine(\''+otd.id+'\')">✓+</button>';
    } else {return;}
    
    var odiv=document.getElementById('div_menu');
    odiv.innerHTML=bljg;
    odiv.style.left=rect.left+'px';
    odiv.style.top=rect.top+'px';
}

function cell_iscleaned_klmine(csr,csc){
    if (csr<0 || csr>rows_global-1 || csc<0 || csc>cols_global-1){return true;}
    var blid='td_'+csr+'_'+csc;
    if (ismine_klmine(document.getElementById(blid).innerHTML)){
        return true;
    } else if (document.getElementById(blid).style.backgroundColor==P_klmine_g.mask_bcolor){
        return false;
    }
    return true;
}
    
function iscleaned_klmine(csid){
    var list_t=csid.split('_');
    var blr=parseInt(list_t[1]);
    var blc=parseInt(list_t[2]);
    var cleaned=[
    cell_iscleaned_klmine(blr-1,blc-1),
    cell_iscleaned_klmine(blr-1,blc),
    cell_iscleaned_klmine(blr-1,blc+1),
    
    cell_iscleaned_klmine(blr,blc-1),
    cell_iscleaned_klmine(blr,blc+1),
        
    cell_iscleaned_klmine(blr+1,blc-1),
    cell_iscleaned_klmine(blr+1,blc),
    cell_iscleaned_klmine(blr+1,blc+1),
    ];
    
    if (cleaned.includes(false)){return false;}
    return true;
}

function clean_klmine(blr,blc){
    function sub_clean_klmine_click(csr,csc){
        if (csr<0 || csr>rows_global-1 || csc<0 || csc>cols_global-1){return;}
        var csid='td_'+csr+'_'+csc;
        if (document.getElementById(csid).style.backgroundColor!==P_klmine_g.unmask_bcolor && ismine_klmine(document.getElementById(csid).innerHTML)==false){
            count_klmine(csid,0);
        }
    }
    //-----------------------
    sub_clean_klmine_click(blr-1,blc-1);
    sub_clean_klmine_click(blr-1,blc);
    sub_clean_klmine_click(blr-1,blc+1);
    
    sub_clean_klmine_click(blr,blc-1);
    sub_clean_klmine_click(blr,blc+1);
        
    sub_clean_klmine_click(blr+1,blc-1);
    sub_clean_klmine_click(blr+1,blc);
    sub_clean_klmine_click(blr+1,blc+1);
}

function timer_klmine(){
    document.getElementById('span_timer').innerHTML=(((new Date()).getTime()-time_start_global)/1000).toFixed(0);
}

function first_klmine(){
    var list_t=[];
    for (let blr=0;blr<rows_global;blr++){
        for (let blc=0;blc<cols_global;blc++){    
            //不是地雷，并且周边地雷数合计为0 - 保留注释
            if (mine_list_global['td_'+blr+'_'+blc]==0 && around_klmine(blr,blc)==0){
                list_t.push([blr,blc]);
            }
        }
    }
    list_t.sort(randomsort_b);
    count_klmine('td_'+list_t[0][0]+'_'+list_t[0][1],0);
    time_start_global=(new Date()).getTime();
    clearInterval(time_interval_global);
    time_interval_global=setInterval(timer_klmine,1000);
}

function around_klmine(blr,blc){
    function sub_around_klmine_cell(csr,csc){
        if (csr<0 || csr>rows_global-1 || csc<0 || csc>cols_global-1){return 0;}
        var csid='td_'+csr+'_'+csc;
        return mine_list_global[csid]==-1?1:0;
    }
    
    var blaround=0;

    blaround=blaround+sub_around_klmine_cell(blr-1,blc-1);
    blaround=blaround+sub_around_klmine_cell(blr-1,blc);
    blaround=blaround+sub_around_klmine_cell(blr-1,blc+1);

    blaround=blaround+sub_around_klmine_cell(blr,blc-1);
    blaround=blaround+sub_around_klmine_cell(blr,blc+1);
    
    blaround=blaround+sub_around_klmine_cell(blr+1,blc-1);
    blaround=blaround+sub_around_klmine_cell(blr+1,blc);
    blaround=blaround+sub_around_klmine_cell(blr+1,blc+1);

    return blaround;
}

function count_klmine(tdid,cstype){
    function sub_count_klmine_done(){
        if (mine_total_global==0){
            var blclean=true;
            for (let blr=0;blr<rows_global;blr++){
                for (let blc=0;blc<cols_global;blc++){
                    if (cell_iscleaned_klmine(blr,blc)==false){
                        blclean=false;
                        break;
                    }
                }
                if (blclean==false){break;}
            }
            if (blclean){
                document.getElementById('span_game_over').innerHTML='WIN';
                clearInterval(time_interval_global);
                record_klmine(true);
            }
        }
    }
    
    function sub_count_klmine_plus_minus(tdid,csvalue=-1){
        if (csvalue==-1){
            document.getElementById(tdid).innerHTML=random_mine_klmine();
        } else {
            document.getElementById(tdid).innerHTML=empty_td_content_global;
        }
        mine_total_global=mine_total_global+csvalue;
        document.getElementById('span_remain').innerHTML=mine_total_global;      
    }
    //-----------------------
    //cstype -2:还原; -1:mine; 0:click;
    document.getElementById('div_menu').innerHTML='';
    if (cstype==-2){
        if (ismine_klmine(document.getElementById(tdid).innerHTML)){
            sub_count_klmine_plus_minus(tdid,1);
        }
        return;
    }
    
    if (mine_list_global[tdid]==-1){
        if (cstype==-1){
            sub_count_klmine_plus_minus(tdid,-1);
            sub_count_klmine_done();
            return;
        } else {
            sub_count_klmine_plus_minus(tdid,-1);
            document.getElementById(tdid).style.borderColor='red';
            document.getElementById('span_game_over').innerHTML='Game Over';
            clearInterval(time_interval_global);
            sub_count_klmine_done();
            return;
        }
    }
    if (cstype==-1){
        sub_count_klmine_plus_minus(tdid,-1);
        sub_count_klmine_done();  
        return;
    }
    
    var list_t=tdid.split('_');
    var blr=parseInt(list_t[1]);
    var blc=parseInt(list_t[2]);

    var blaround=around_klmine(blr,blc);

    if (ismine_klmine(document.getElementById(tdid).innerHTML)){
        sub_count_klmine_plus_minus(tdid,1);
    }
    //必须先执行以下行，再执行余下部分 - 保留注释
    document.getElementById(tdid).style.backgroundColor=P_klmine_g.unmask_bcolor;
    
    if (blaround>0){
        td_set_value_klmine(tdid,blaround);
        document.getElementById(tdid).style.color=P_klmine_g.unmask_fcolor;
    } else {
        clean_klmine(blr,blc);
        document.getElementById(tdid).style.color=P_klmine_g.unmask_bcolor;
    }
    sub_count_klmine_done();
}

function td_get_value_klmine(csid){
    var blvalue=document.getElementById(csid).innerHTML.replace(new RegExp('&nbsp;','g'),'').trim();
    if (ismine_klmine(blvalue)){
        return -1;
    } else if (blvalue==''){
        return -2;
    } else {
        return parseInt(blvalue);
    }
}

function record_klmine(addnew=false){
    //日期 难度 长宽 地雷数 秒数 姓名 - 保留注释
    //2019-08-16 Hard 100x150 50 100 name - 保留注释
    clearInterval(time_interval_global);

    var list_t=local_storage_get_b('mine_record',-1,true);
    list_t.sort(function (a,b){
        var arr1=a.trim().split(' ');
        var arr2=b.trim().split(' ');
        if (arr1.length!==6 || arr2.length!==6){
            return a<b;
        }
        return parseInt(arr1[4])<parseInt(arr2[4]);
    });

    list_t=list_t.slice(0,10);

    if (addnew){
        var blname=(prompt('输入姓名：') || '').trim();
        if (blname==''){return;}
        
        blname=blname.replace(new RegExp(' ','g'),'_');
    
        var bljg=date2str_b()+' '+level_caption_global+' '+rows_global+'x'+cols_global+' '+document.getElementById('span_total').innerHTML+' '+document.getElementById('span_timer').innerHTML+' '+blname;
        list_t=[bljg].concat(list_t);
    }
    
    localStorage.setItem('mine_record',list_t.join('\n'));
    
    var bltable='<table border=1>';
    bltable=bltable+'<tr><th>日期</th><th>难度<th>长宽</th><th>地雷数</th><th>秒数</th><th>姓名</th></tr>';
    for (let item of list_t){
        bltable=bltable+'<tr>';
        var row_list=item.trim().split(' ');
        if (row_list.length!==6){continue;}
        
        bltable=bltable+'<td align=center>'+row_list[0]+'</td>';
        bltable=bltable+'<td align=center>'+row_list[1]+'</td>';
        bltable=bltable+'<td align=center>'+row_list[2]+'</td>';
        bltable=bltable+'<td align=right>'+row_list[3]+'</td>';
        bltable=bltable+'<td align=right>'+row_list[4]+'</td>';
        bltable=bltable+'<td align=center>'+row_list[5]+'</td>';
        bltable=bltable+'</tr>';
    }
    bltable=bltable+'</table>';
    document.getElementById('div_cp').innerHTML='<h2>排行榜</h2>'+bltable+buttons_klmine();
}

function ismine_klmine(csstr){
    if (mine_type_global_list.includes(csstr)){return true;}
    return false;
}

function random_mine_klmine(){
    mine_type_global_list.sort(randomsort_b);
    return mine_type_global_list[0];
}

function td_set_value_klmine(csid,csvalue){
    if (ismine_klmine(csvalue) || csvalue==-1){
        document.getElementById(csid).innerHTML=random_mine_klmine();
    } else if (csvalue==-2){
        document.getElementById(csid).innerHTML=empty_td_content_global;
    } else {
        document.getElementById(csid).innerHTML='&nbsp;'.repeat(nbsp_count_global)+csvalue+'&nbsp;'.repeat(nbsp_count_global);
    }
}

function init_mine(){
    var style_list=[
    '::selection {background-color:'+P_klmine_g.mask_bcolor+';color:'+P_klmine_g.mask_bcolor+';}',
    'td {font-size:1rem;}',
    'button {font-size:1rem;}',
    ];
    style_generate_b(style_list,true);
    
    box_border_global=1;
    document.title=mine_character_global+' Mine';
    if (ismobile_b()){
        boxsize_global=20;
        nbsp_count_global=2;
    } else {
        boxsize_global=14;
        nbsp_count_global=1;
    }
    empty_td_content_global='&nbsp;'.repeat(nbsp_count_global)+'0'+'&nbsp;'.repeat(nbsp_count_global);
    window_w_global=document.body.offsetWidth;
    window_h_global=document_body_offsetHeight_b();
    rows_global=-1;
    cols_global=-1;
    mine_total_global=0;
    
    list_klmine();
    max_rows_cols_klmine();
    list_klmine();
}
