function max_elements_get_linkgame(){
    var opercent=document.getElementById('input_percent_linkgame');
    var cspercent=opercent.value.trim();
    if (cspercent=='MAX'){
        cspercent=opercent.getAttribute('max');
    }
    cspercent=parseFloat(cspercent);
    console.log('难度系数',cspercent);
    var max_elements=Math.round(rows_lg_global*cols_lg_global*cspercent);  
    return [cspercent,max_elements];
}

function box_linkgame(top_left=false,empty_tip=true){
    function sub_box_linkgame_blank_tr(rowno){
        var list_t=[];
        list_t.push('<tr>');   
        list_t.push('<td id="td_'+rowno+'_-1" align="center" style="visibility:hidden;">'+blank_symbol_lg_global+'</td>');
        for (let acol=0;acol<cols_lg_global;acol++){
            list_t.push('<td id="td_'+rowno+'_'+acol+'" align="center" style="visibility:hidden;">'+blank_symbol_lg_global+'</td>');
        }
        list_t.push('<td id="td_'+rowno+'_'+cols_lg_global+'" align="center" style="visibility:hidden;">'+blank_symbol_lg_global+'</td>');        
        list_t.push('</tr>');
        return list_t;
    }
    //-----------------------
    var max_elements=max_elements_get_linkgame()[1];
    if (max_elements<=0){return;}
    
    switch (type_lg_global){
        case 'cn':
            img_list=random_chs_b(max_elements,true);
            break;
        default:
            var img_list=[].concat(emoji_lg_global);
            
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
        table_list.push('<td id="td_'+arow+'_-1" align="center" style="visibility:hidden;">'+blank_symbol_lg_global+'</td>');
        for (let acol=0;acol<cols_lg_global;acol++){
            table_list.push('<td id="td_'+arow+'_'+acol+'" class="td_content_lg" align="center" style="cursor:pointer;" onclick="click_linkgame(this);">'+result_t[blxl]+'</td>');
            list_t.push(result_t[blxl]);
            blxl=blxl+1;
        }
        table_list.push('<td id="td_'+arow+'_'+cols_lg_global+'" align="center" style="visibility:hidden;">'+blank_symbol_lg_global+'</td>');
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
    selected_td_lg_global=false;
    if (empty_tip){
        document.getElementById('span_tip').innerHTML='';
    }
    tip_content_lg_global=[];
    resolve_linkgame();
}

function click_linkgame(otd){
    function sub_click_linkgame_check(otd){
        if (selected_td_lg_global===false || selected_td_lg_global.textContent!==otd.textContent){
            selected_td_lg_global.style.borderColor='#e0e0e0';
            selected_td_lg_global=otd;
            return;
        }
        
        if (compare_linkgame(selected_td_lg_global,otd.id,true)===false){
            sub_click_linkgame_remove(otd,selected_td_lg_global);
        } else {
            if (selected_td_lg_global!==false){
                selected_td_lg_global.style.borderColor='#e0e0e0';
            }
            selected_td_lg_global=otd;
        }
    }
    
    function sub_click_linkgame_remove(otd1,otd2){
        for (let odom of [otd1,otd2]){
            odom.innerHTML=blank_symbol_lg_global;
            odom.removeAttribute('onclick');
            odom.style.borderColor='#e0e0e0';
            odom.style.cursor='';
            odom.style.visibility='hidden';
        }

        selected_td_lg_global=false;
        
        recombine_times_lg_global=0;
        resolve_linkgame();
    }

    if (selected_td_lg_global==otd){
        otd.style.borderColor='#e0e0e0';
        selected_td_lg_global=false;
    } else {
        otd.style.borderColor='red';
        if (selected_td_lg_global===false){
            selected_td_lg_global=otd;
        } else {
            sub_click_linkgame_check(otd);
        }
    }
}

function resolve_linkgame(){
    if (tip_content_lg_global.length==2){
        var td1='td_'+tip_content_lg_global[0][0]+'_'+tip_content_lg_global[0][1];
        var td2='td_'+tip_content_lg_global[1][0]+'_'+tip_content_lg_global[1][1];
        var str1=document.getElementById(td1).textContent;
        var str2=document.getElementById(td2).textContent;      
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
    
    for (let blx=0,lent=list_t.length;blx<lent;blx++){
        for (let bly=0,lenb=list_t.length;bly<lenb;bly++){
            if (blx==bly){continue;}
            var td1='td_'+list_t[blx][0]+'_'+list_t[blx][1];
            var td2='td_'+list_t[bly][0]+'_'+list_t[bly][1];
            var str1=document.getElementById(td1).textContent;
            var str2=document.getElementById(td2).textContent;
            if (str1!==str2){continue;}
            if (str1==blank_symbol_lg_global){continue;}
            if (compare_linkgame(td1,td2)===false){
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
            one_td.style.visibility='hidden';
        } else {
            one_td.setAttribute('onclick','click_linkgame(this);');
            one_td.style.cursor='pointer';
            one_td.style.visibility='';
        }
        blxl=blxl+1;
    }
    selected_td_lg_global=false;//'';
}

function remain_linkgame(){
    var result_t=[];
    for (let arow=0;arow<rows_lg_global;arow++){
        for (let acol=0;acol<cols_lg_global;acol++){
            var otd=document.getElementById('td_'+arow+'_'+acol);
            if (otd.textContent!==blank_symbol_lg_global){
                result_t.push([arow,acol,otd.textContent]);
            }
        }
    }
    return result_t;
}

function blank_linkgame(csrow,cscol){
    //csrow,cscol 左上角空白坐标为 -1,-1 - 保留注释
    var otd=document.getElementById('td_'+csrow+'_'+cscol);
    if (!otd){return false;}
    return otd.textContent==blank_symbol_lg_global; //当 visibility:hidden 时 innerText 为空 - 保留注释
    //textContent 会忽略空白字符（如空格、制表符和换行符），而 innerText 会保留它们。 - 通义千问
}

function between_linkgame(td1,td2){
    if (td1[0]!==td2[0] && td1[1]!==td2[1]){return true;}   //不在同一行且不在同一列 - 保留注释

    var odom1=document.getElementById('td_'+td1[0]+'_'+td1[1]);
    var odom2=document.getElementById('td_'+td2[0]+'_'+td2[1]);
    if (!odom1 || !odom2){return true;}
    if (odom1.textContent!==odom2.textContent && odom1.textContent!==blank_symbol_lg_global && odom2.textContent!==blank_symbol_lg_global){return true;}    //非空且不等 - 保留注释

    if (td1[0]==td2[0]){
        for (let blxl=Math.min(td1[1],td2[1])+1;blxl<Math.max(td1[1],td2[1]);blxl++){
            var td_between=document.getElementById('td_'+td1[0]+'_'+blxl);
            if (td_between){
                if (td_between.textContent!==blank_symbol_lg_global){return true;}
            }
        }
        return false;
    } else { //td1[1]==td2[1] - 保留注释
        for (let blxl=Math.min(td1[0],td2[0])+1;blxl<Math.max(td1[0],td2[0]);blxl++){
            var td_between=document.getElementById('td_'+blxl+'_'+td1[1]);
            if (td_between){
                if (td_between.textContent!==blank_symbol_lg_global){return true;}                    
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

function neighbour_route_linkgame(td1,td2,show_line){
    var blfound=between_linkgame(td1,td2);
    if (blfound===false){
        line_draw_linkgame([td1,td2],show_line);
        return false;
    }
    
    blfound=true;
    var list_t1=neighbour_list_linkgame(td1);
    for (let item of list_t1){
        blfound=between_linkgame(item,td2);
        if (blfound===false){
            line_draw_linkgame([td1,item,td2],show_line);
            break;
        }
    }
    
    if (blfound){
        var list_t2=neighbour_list_linkgame(td2);
        for (let item of list_t2){
            blfound=between_linkgame(td1,item);
            if (blfound===false){
                line_draw_linkgame([td1,item,td2],show_line);
                break;
            }
        }
    }
    
    if (blfound){
        for (let item1 of list_t1){
            for (let item2 of list_t2){
                blfound=between_linkgame(item1,item2);
                if (blfound===false){
                    line_draw_linkgame([td1,item1,item2,td2],show_line);
                    break;
                }
            }
            if (blfound===false){break;}
        }
    }
    return blfound;
}

function line_draw_linkgame(csarr,show_line){
    if (!show_line || klmenu_check_b('span_show_line_lg',false)===false){return;}
        
    var td_list=[];
    for (let item of csarr){
        var one_td=document.getElementById('td_'+item[0]+'_'+item[1]);
        td_list.push(dom_center_xy_get_b(one_td));
    }

    var x1,y1,x2,y2;
    var line_list=[];
    for (let blxl=0,lent=td_list.length-1;blxl<lent;blxl++){
        // 获取线段元素
        [x1,y1]=td_list[blxl];
        [x2,y2]=td_list[blxl+1];
        // 计算两个点之间的距离和角度
        var length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); // 线段长度
        var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; // 线段角度
        var oline = document.createElement('line');
        oline.setAttribute('class','line_linkgame');
        document.body.appendChild(oline);

        oline.style.cssText='position: absolute; left:'+x1+'px; top:'+y1+'px; background-color: '+scheme_global['a']+'; width: '+length+'px; height:1px; transform-origin: 0 0; transform: rotate('+angle+'deg);';
        line_list.push(oline);
    }
    setTimeout(function (){line_remove_linkgame(line_list);},2000);
}

function line_remove_linkgame(line_list){
    for (let one_line of line_list){
        if (one_line){
            one_line.outerHTML='';
        }
    }
}

function compare_linkgame(td1,td2,show_line=false){
    if (td1===false){return false;}
    if (typeof td1 !== 'string'){
        td1=td1.id;
    }
    
    td1=td1.substring(3,).split('_');
    td2=td2.substring(3,).split('_');
    td1[0]=parseInt(td1[0]);
    td1[1]=parseInt(td1[1]);
    td2[0]=parseInt(td2[0]);
    td2[1]=parseInt(td2[1]);
    
    return neighbour_route_linkgame(td1,td2,show_line);   
}

function init_linkgame(){
    selected_td_lg_global=false;
    blank_symbol_lg_global='⬜';
    recombine_times_lg_global=0;
    type_lg_global='';
    emoji_lg_global=emoji_category_b(['food','vegetable','animal','transport'],-2);
    tip_content_lg_global=[];
    percent_max_lg_global=1;

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
    
    resize_linkgame(false);
}

function resize_linkgame(empty_tip=true,set_global_value=true){
    function sub_resize_linkgame_table_size(){
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
    
    if (set_global_value){
        sub_resize_linkgame_table_size();
    }
    
    var percent_num=emoji_lg_global.length/(rows_lg_global*cols_lg_global);
    var percent_str=percent_num.toFixed(3);
    var oinput=document.getElementById('input_percent_linkgame');
    oinput.setAttribute('placeholder','≤'+percent_str);
    oinput.setAttribute('max',percent_str);
    var current_value=oinput.value.trim();
    if (current_value=='' || parseFloat(current_value)>percent_num){
        oinput.value=percent_str;
    }
    box_linkgame(true,empty_tip);
}

function remain_cells_set_linkgame(){
    if (!confirm('是否保存当前进度？')){return;}
    
    var result_t=[];
    for (let blx=0;blx<rows_lg_global;blx++){
        row_list=[];
        for (let bly=0;bly<cols_lg_global;bly++){
            var otd=document.getElementById('td_'+blx+'_'+bly);
            row_list.push(otd.textContent);
        }
        result_t.push(row_list.join(','));
    }
    var old_value=remain_cells_get_linkgame();
    old_value=[today_str_b('dt') +' '+result_t.join(';')].concat(old_value);
    localStorage.setItem('remain_link_game',old_value.join('\n'));
    menu_remain_refresh_linkgame();
}

function remain_cells_restore_linkgame(csdatetime){
    var blstr=remain_cells_get_linkgame(csdatetime);
    if (blstr==''){return;}
    var list_t=blstr.split(';');
    
    rows_lg_global=list_t.length;

    for (let blxl=0;blxl<rows_lg_global;blxl++){
        list_t[blxl]=list_t[blxl].split(',');
    }
    cols_lg_global=list_t[0].length;
    resize_linkgame(true,false);
    
    for (let blx=0;blx<rows_lg_global;blx++){
        for (let bly=0;bly<cols_lg_global;bly++){
            var otd=document.getElementById('td_'+blx+'_'+bly);
            otd.textContent=list_t[blx][bly];
            if (list_t[blx][bly]==blank_symbol_lg_global){
                otd.removeAttribute('onclick');
                otd.style.cursor='';
                otd.style.visibility='hidden';
            }
        }
    }
}

function remain_cells_get_linkgame(csdatetime=''){
    var list_t=local_storage_get_b('remain_link_game',10,true);
    if (list_t.length==1 && list_t[0]==''){
        list_t=[];
    }
    
    if (csdatetime!==''){
        var result_t=''
        for (let item of list_t){
            if (item.startsWith(csdatetime+' ')){
                result_t=item.substring(csdatetime.length+1,);  //不能再+1 - 保留注释
                break;
            }
        }
        return result_t;
    }
    return list_t;
}

function menu_linkgame(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'type_lg_global=\'emoji\';box_linkgame();">emoji</span>',    
    '<span class="span_menu" onclick="'+str_t+'type_lg_global=\'cn\';box_linkgame();">汉字</span>',
    '<span id="span_show_tip_lg" class="span_menu" onclick="'+str_t+'tip_linkgame();">⚪ 连续提示</span>',
    '<span class="span_menu" onclick="'+str_t+'tip_linkgame(true);">提示一次</span>',
    '<span id="span_show_line_lg" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 连线</span>',
    '<span class="span_menu" onclick="'+str_t+'resize_linkgame();">resize</span>',
    ];

    var color_menu=colors_menu_b('scheme_change_linkgame',['default']);

    var remain_menu=[];

    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu">难度系数：<input type="text" id="input_percent_linkgame" value="MAX" /></span>',   
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'link_game\');">更新版本</span>',    
    ]);

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','8rem','1rem','1rem','60rem')+klmenu_b(color_menu,'🎨','20rem','1rem','1rem','20rem')+klmenu_b(remain_menu,'♟','12rem','1rem','1rem','60rem','','menu_remain_linkgame')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem')+' ');
    
    var input_list=[['input_percent_linkgame',5,0.5],];
    input_size_b(input_list,'id');
    klmenu_check_b('span_show_line_lg',true);        
    menu_remain_refresh_linkgame();
}

function menu_remain_refresh_linkgame(){
    var str_t=klmenu_hide_b('');

    var remain_menu=['<span class="span_menu" onclick="'+str_t+'remain_cells_set_linkgame();">保存当前棋局</span>',
    ];
    
    var list_t=remain_cells_get_linkgame();
    for (let item of list_t){
        var bltime=item.substring(0,19);
        remain_menu.push('<span class="span_menu" onclick="'+str_t+'remain_cells_restore_linkgame(\''+bltime+'\');">'+bltime+'</span>');
    }
    document.getElementById('menu_remain_linkgame').outerHTML=klmenu_b(remain_menu,'♟','12rem','1rem','1rem','60rem','','menu_remain_linkgame');
}

function scheme_change_linkgame(item){
    change_colors_b(item);
}

function tip_linkgame(is_once=false){
    if (is_once){
        if (klmenu_check_b('span_show_tip_lg',false)===true){return;}

        if (klmenu_check_b('span_show_tip_lg',false)===false){
            klmenu_check_b('span_show_tip_lg',true);
        }
        resolve_linkgame();
        if (klmenu_check_b('span_show_tip_lg',false)===true){
            klmenu_check_b('span_show_tip_lg',true);
        }
        setTimeout(function (){document.getElementById('span_tip').innerHTML='';},5000);
        return;
    }
    
    if (klmenu_check_b('span_show_tip_lg',true)){
        resolve_linkgame();
    } else {
        document.getElementById('span_tip').innerHTML='';
    }
}
