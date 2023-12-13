function box_linkgame(top_left=false,cspercent=0.8){
    function sub_box_linkgame_blank_tr(rowno){
        var list_t=[];
        list_t.push('<tr>');   
        list_t.push('<td id="td_'+rowno+'_-1" align="center">'+blank_symbol_lg_global+'</td>');
        for (let acol=0;acol<cols_lg_global;acol++){
            list_t.push('<td id="td_'+rowno+'_'+acol+'" align="center">'+blank_symbol_lg_global+'</td>');
        }
        list_t.push('<td id="td_'+rowno+'_'+cols_lg_global+'" align="center">'+blank_symbol_lg_global+'</td>');        
        list_t.push('</tr>');        
        return list_t;
    }
    //-----------------------
    var max_elements=Math.round(rows_lg_global*cols_lg_global*cspercent);    
    switch (type_lg_global){
        case 'cn':
            img_list=random_chs_b(max_elements,true);
            break;
        default:
            var img_list=emoji_category_b('food',-2).concat(emoji_category_b('vegetable',-2));
            var blmax=randint_b(5,10);    
            for (let blxl=0;blxl<blmax;blxl++){    
                img_list.sort(randomsort_b);
            }
            img_list=img_list.slice(0,max_elements);
            break;
    }
    
    var blcouple=Math.ceil(rows_lg_global*cols_lg_global/2);
    var result_t=[];
    for (let blxl=0;blxl<blcouple;blxl++){
        img_list.sort(randomsort_b);
        result_t.push(img_list[0]);
        result_t.push(img_list[0]);
    }
    blmax=randint_b(5,10);    
    for (let blxl=0;blxl<blmax;blxl++){
        result_t.sort(randomsort_b);
    }
    var blxl=0;
    var table_list=sub_box_linkgame_blank_tr(-1);            
    for (let arow=0;arow<rows_lg_global;arow++){
        var list_t=[];
        table_list.push('<tr>');   
        table_list.push('<td id="td_'+arow+'_-1" align="center">'+blank_symbol_lg_global+'</td>');
        for (let acol=0;acol<cols_lg_global;acol++){
            table_list.push('<td id="td_'+arow+'_'+acol+'" class="td_content_lg" align="center" style="cursor:pointer;" onclick="click_linkgame(this);">'+result_t[blxl]+'</td>');
            list_t.push(result_t[blxl]);
            blxl=blxl+1;
        }
        table_list.push('<td id="td_'+arow+'_'+cols_lg_global+'" align="center">'+blank_symbol_lg_global+'</td>');        
        table_list.push('</tr>');    
    }
    table_list=table_list.concat(sub_box_linkgame_blank_tr(rows_lg_global));
    var otable=document.getElementById('table_lg');
    otable.innerHTML=table_list.join('\n');
    if (top_left){
        var rect=otable.getBoundingClientRect();
        var window_w=document.documentElement.clientWidth;
        var window_h=document.documentElement.clientHeight;        
        otable.style.left=(window_w-rect.width)/2+'px';
        otable.style.top=(window_h-rect.height)/2+'px';
    }
    selected_td_lg_global='';
    document.getElementById('span_tip').innerHTML='';
    tip_content_lg_global=[];
    resolve_linkgame();
}

function click_linkgame(otd){
    if (otd.style.borderColor==selected_color_lg_global || otd.style.borderColor=='red'){
        otd.style.borderColor='#e0e0e0';
        if (selected_td_lg_global==otd.id){
            selected_td_lg_global='';
        }
    } else {
        otd.style.borderColor='red';
        if (selected_td_lg_global==''){
            selected_td_lg_global=otd.id;
        } else {
            check_linkgame(otd);
        }
    }
}

function resolve_linkgame(){
    if (tip_content_lg_global.length==2){
        var td1='td_'+tip_content_lg_global[0][0]+'_'+tip_content_lg_global[0][1];
        var td2='td_'+tip_content_lg_global[1][0]+'_'+tip_content_lg_global[1][1];
        var str1=document.getElementById(td1).innerText;
        var str2=document.getElementById(td2).innerText;      
        if (str1==tip_content_lg_global[0][2] && str2==tip_content_lg_global[1][2]){
            if (klmenu_check_b('span_show_tip_lg',false)){  
                document.getElementById('span_tip').innerHTML=tip_content_lg_global[0]+' &nbsp; '+tip_content_lg_global[1];
            }        
            return;
        }
    }
    
    var list_t=remain_linkgame();
    if (list_t.length<=1){
        return [true,true];
    }
    
    for (let blx=0;blx<list_t.length;blx++){
        for (let bly=0;bly<list_t.length;bly++){
            if (blx==bly){continue;}
            var td1='td_'+list_t[blx][0]+'_'+list_t[blx][1];
            var td2='td_'+list_t[bly][0]+'_'+list_t[bly][1];
            var str1=document.getElementById(td1).innerText;
            var str2=document.getElementById(td2).innerText;
            if (str1!==str2){continue;}
            if (str1==blank_symbol_lg_global){continue;}
            if (compare_linkgame(td1,td2)==false){
                if (klmenu_check_b('span_show_tip_lg',false)){  
                    document.getElementById('span_tip').innerHTML=list_t[blx]+' &nbsp; '+list_t[bly];
                }
                tip_content_lg_global=[list_t[blx],list_t[bly]];
                return [list_t[blx],list_t[bly]];
            }
        }
    }
    recombine_times_lg_global=recombine_times_lg_global+1;
    if (recombine_times_lg_global<10){
        recombine_linkgame(list_t);
        return resolve_linkgame();
    }
    return [false,false];
}

function recombine_linkgame(remain_list){
    var blank_list=[];
    var blcount=rows_lg_global*cols_lg_global-remain_list.length;
    for (let blxl=0;blxl<blcount;blxl++){
        blank_list.push(blank_symbol_lg_global);
    }
    for (let item of remain_list){
        blank_list.push(item[2]);
    }

    var blmax=randint_b(5,10);    
    for (let blxl=0;blxl<blmax;blxl++){    
        blank_list.sort(randomsort_b);
    }
    
    var otds=document.querySelectorAll('td.td_content_lg');
    if (otds.length!==blank_list.length){
        console.log(otds.length,blank_list.length);
        return;
    }
    var blxl=0;
    for (let one_td of otds){
        one_td.innerHTML=blank_list[blxl];
        one_td.style.borderColor='#e0e0e0';
        if (blank_list[blxl]==blank_symbol_lg_global){
            one_td.removeAttribute('onclick');
            one_td.style.cursor='';
        } else {
            one_td.setAttribute('onclick','click_linkgame(this);');
            one_td.style.cursor='pointer';
        }
        blxl=blxl+1;
    }
    selected_td_lg_global='';
}

function remain_linkgame(){
    var result_t=[];
    for (let arow=0;arow<rows_lg_global;arow++){
        for (let acol=0;acol<cols_lg_global;acol++){
            var otd=document.getElementById('td_'+arow+'_'+acol);
            if (otd.innerText!==blank_symbol_lg_global){
                result_t.push([arow,acol,otd.innerText]);
            }
        }
    }
    return result_t;
}

function blank_linkgame(csrow,cscol){
    var otd=document.getElementById('td_'+csrow+'_'+cscol);
    if (!otd){return false;}
    return otd.innerText==blank_symbol_lg_global;
}

function between_linkgame(td1,td2){
    if (td1[0]!==td2[0] && td1[1]!==td2[1]){return true;}

    var odom1=document.getElementById('td_'+td1[0]+'_'+td1[1]);
    var odom2=document.getElementById('td_'+td2[0]+'_'+td2[1]);
    if (!odom1 || !odom2){return true;}
    if (odom1.innerText!==odom2.innerText && odom1.innerText!==blank_symbol_lg_global && odom2.innerText!==blank_symbol_lg_global){return true;}

    if (td1[0]==td2[0]){
        for (let blxl=Math.min(td1[1],td2[1])+1;blxl<Math.max(td1[1],td2[1]);blxl++){
            var td_between=document.getElementById('td_'+td1[0]+'_'+blxl);
            if (td_between){
                if (td_between.innerText!==blank_symbol_lg_global){return true;}
            }
        }
        return false;
    } else { //td1[1]==td2[1] - 保留注释
        for (let blxl=Math.min(td1[0],td2[0])+1;blxl<Math.max(td1[0],td2[0]);blxl++){
            var td_between=document.getElementById('td_'+blxl+'_'+td1[1]);
            if (td_between){
                if (td_between.innerText!==blank_symbol_lg_global){return true;}                    
            }
        }
        return false;
    }
}

function neighbour_list_linkgame(cstd){
    var result_t=[];
    for (let blxl=cstd[0]-1;blxl>=-1;blxl--){
        if (!blank_linkgame(blxl,cstd[1])){break;}
        result_t.push([blxl,cstd[1]]);
    }
    
    for (let blxl=cstd[0]+1;blxl<=rows_lg_global;blxl++){
        if (!blank_linkgame(blxl,cstd[1])){break;}            
        result_t.push([blxl,cstd[1]]);
    }

    for (let blxl=cstd[1]-1;blxl>=-1;blxl--){
        if (!blank_linkgame(cstd[0],blxl)){break;}
        result_t.push([cstd[0],blxl]);
    }

    for (let blxl=cstd[1]+1;blxl<=cols_lg_global;blxl++){
        if (!blank_linkgame(cstd[0],blxl)){break;}
        result_t.push([cstd[0],blxl]);
    }
    return result_t;  
}

function neighbour_route_linkgame(td1,td2){
    var blfound=true;
    var list_t1=neighbour_list_linkgame(td1);
    for (let item of list_t1){
        blfound=between_linkgame(item,td2);
        if (blfound==false){
            break;
        }
    }
    
    if (blfound){
        var list_t2=neighbour_list_linkgame(td2);
        for (let item of list_t2){
            blfound=between_linkgame(td1,item);
            if (blfound==false){break;}
        }
    }
    
    if (blfound){
        for (let item1 of list_t1){
            for (let item2 of list_t2){
                blfound=between_linkgame(item1,item2);
                if (blfound==false){break;}
            }
            if (blfound==false){break;}
        }
    }
    return blfound;
}

function check_linkgame(otd){
    var prev_td=document.getElementById(selected_td_lg_global);
    if (prev_td.innerText!==otd.innerText){
        prev_td.style.borderColor='#e0e0e0';
        selected_td_lg_global=otd.id;
        return;
    }
    
    if (compare_linkgame(selected_td_lg_global,otd.id)==false){
        remove_linkgame(otd,prev_td);
    } else {
        prev_td.style.borderColor='#e0e0e0';
        selected_td_lg_global=otd.id;        
    }
}

function compare_linkgame(td1,td2){
    td1=td1.substring(3,).split('_');
    td2=td2.substring(3,).split('_');
    td1[0]=parseInt(td1[0]);
    td1[1]=parseInt(td1[1]);
    td2[0]=parseInt(td2[0]);
    td2[1]=parseInt(td2[1]);
    var blfound=between_linkgame(td1,td2);
    
    if (blfound==false){return false;}
    return neighbour_route_linkgame(td1,td2);   
}

function remove_linkgame(otd1,otd2){
    for (let odom of [otd1,otd2]){
        odom.innerHTML=blank_symbol_lg_global;
        odom.removeAttribute('onclick');
        odom.style.borderColor='#e0e0e0';
        odom.style.cursor='';
    }

    selected_td_lg_global='';
    
    recombine_times_lg_global=0;
    resolve_linkgame();
}

function table_size_linkgame(){
    var otable=document.getElementById('table_lg');
    otable.innerHTML='';
    otable.style.left='';   //不能写成 0px - 保留注释
    otable.style.top='';
    var window_w=document.documentElement.clientWidth;
    var window_h=document.documentElement.clientHeight;
    
    var blstr='';
    var row=1;
    while (row<100){
        blstr=blstr+'<tr><td>'+blank_symbol_lg_global+'</td></tr>';
        otable.innerHTML=blstr;
        var rect=otable.getBoundingClientRect();
        if (rect.top*2+rect.height>=window_h){  //上下对称 - 保留注释
            row=row-1;
            break;
        }
        row=row+1;
    }
    
    blstr='';
    var col=1;
    while (col<100){
        blstr=blstr+'<td>'+blank_symbol_lg_global+'</td>';
        otable.innerHTML='<tr>'+blstr+'</tr>';
        var rect=otable.getBoundingClientRect();
        if (rect.left*2+rect.width>=window_w){  //左右对称 - 保留注释
            col=col-1;
            break;
        }
        col=col+1;
    }
    otable.innerHTML='';
    rows_lg_global=row-2;
    cols_lg_global=col-2;
}

function init_linkgame(){
    menu_linkgame();
    var otable=document.getElementById('table_lg');
    if (ismobile_b()){
        var fsize='1.65rem';
        var blpadding='0.5rem';
    } else {
        var fsize='2rem';
        var blpadding='2rem';
    }

    otable.style.padding=blpadding;
    otable.style.fontSize=fsize;
    
    resize_linkgame();
}

function resize_linkgame(){
    table_size_linkgame();
    box_linkgame(true);
}

function menu_linkgame(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'type_lg_global=\'emoji\';box_linkgame();">emoji</span>',    
    '<span class="span_menu" onclick="'+str_t+'type_lg_global=\'cn\';box_linkgame();">汉字</span>',
    '<span id="span_show_tip_lg" class="span_menu" onclick="'+str_t+'tip_linkgame();">⚪ 提示</span>',        
    '<span class="span_menu" onclick="'+str_t+'resize_linkgame();">resize</span>',
    ];

    var klmenu_config=root_font_size_menu_b(str_t);

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','8rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function tip_linkgame(){
    if (klmenu_check_b('span_show_tip_lg',true)){
        resolve_linkgame();
    } else {
        document.getElementById('span_tip').innerHTML='';
    }
}
