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

function bejeweled_fill_linkgame(cslist){
    function sub_bejeweled_fill_linkgame_loop(changed_td){
        var same_list=[];
        for (let item of changed_td){
            var otd=document.getElementById('td_'+item[0]+'_'+item[1]);
            var list_t=bejeweled_same_linkgame(otd);
            if (list_t.length>0){
                same_list=array_union_b(same_list,list_t);
            }
        }
        
        if (same_list.length>0){
            bejeweled_fill_linkgame(same_list);
        } else {
            if (config_emoji_global['mark'] % 11 == 0){   //质数 - 保留注释
                bejeweled_refresh_img_linkgame();
            }
        }
    }
    
    function sub_bejeweled_fill_linkgame_cols(fill_with_blank=true){
        for (let one_key in col_dict){
            var blcol=parseInt(one_key.slice(2,));
            if (changed_col.has(blcol)){
                for (let blx=0;blx<rows_lg_global+2;blx++){
                    var otd=document.getElementById('td_'+blx+'_'+blcol);
                    otd.textContent=col_dict[one_key][blx];
                }
            }
        }
        if (fill_with_blank){
            setTimeout(function (){sub_bejeweled_fill_linkgame_done(false);},wait_time);
        } else {
            sub_bejeweled_fill_linkgame_loop(changed_td);
        }
    }
    
    function sub_bejeweled_fill_linkgame_done(fill_with_blank=true){
        for (let bly=0;bly<cols_lg_global+2;bly++){
            col_dict['c_'+bly]=[];
            for (let blx=0;blx<rows_lg_global+2;blx++){
                var otd=document.getElementById('td_'+blx+'_'+bly);
                col_dict['c_'+bly].push(otd.textContent);
            }
        }
        
        var blank_count=0;
        for (let key in col_dict){
            var blat=col_dict[key].lastIndexOf(config_emoji_global['blank_symbol']);
            if (blat==-1){
                sub_bejeweled_fill_linkgame_count(key);
                continue;
            }
            
            var blcol=parseInt(key.slice(2,));
            for (let blx=0;blx<=blat;blx++){
                changed_td.push([blx,blcol]);
                changed_col.add(blcol);
            }
            col_dict[key].splice(blat,1);
            blank_count=blank_count+1;        
            while (true){
                blat=col_dict[key].lastIndexOf(config_emoji_global['blank_symbol']);
                if (blat==-1){break;}
                col_dict[key].splice(blat,1);
                blank_count=blank_count+1;
            }
            
            sub_bejeweled_fill_linkgame_count(key);
        }
        
        if (fill_with_blank){
            for (let key in col_dict){
                for (let blxl=0,lent=rows_lg_global+2-col_dict[key].length;blxl<lent;blxl++){
                    col_dict[key]=[config_emoji_global['blank_symbol']].concat(col_dict[key]);
                }
            }
        } else {
            all_exist_emoji=object2array_b(all_exist_emoji,true,2);
            all_exist_emoji.sort(function (a,b){return a[1]<b[1]?-1:1;});
            
            refill_list=[];
            for (let item of all_exist_emoji){
                if (item[1]>=3){break;}
                refill_list.push(item[0]);
            }
            
            var bllen=selected_emoji_global.length;
            var blxl=0;
            selected_emoji_global.sort(randomsort_b);
            while (true){
                if (refill_list.length>=blank_count){break;}
                if (blxl>=bllen){break;}
                if (!refill_list.includes(selected_emoji_global[blxl])){
                    refill_list.push(selected_emoji_global[blxl]);
                }
                blxl=blxl+1;
            }
            
            var result_t=emoji_duplicate_linkgame(refill_list,3,false);
            var blno=0;
            for (let key in col_dict){
                for (let blxl=0,lent=rows_lg_global+2-col_dict[key].length;blxl<lent;blxl++){
                    col_dict[key]=[result_t[blno]].concat(col_dict[key]);
                    blno=blno+1;
                }
            }
        }
        setTimeout(function (){sub_bejeweled_fill_linkgame_cols(fill_with_blank);},wait_time);
    }
    
    function sub_bejeweled_fill_linkgame_count(key){
        for (let item of col_dict[key]){
            if (all_exist_emoji['e_'+item]==undefined){
                all_exist_emoji['e_'+item]=0;
            }
            all_exist_emoji['e_'+item]=all_exist_emoji['e_'+item]+1;
        }    
    }
    
    function sub_bejeweled_fill_linkgame_cells(){
        for (let item of cslist){
            item.textContent=config_emoji_global['blank_symbol'];
            item.style.borderColor=config_emoji_global['normal_color'];
        }
        
        config_emoji_global['mark']=config_emoji_global['mark']+cslist.length;
        document.getElementById('span_mark_emoji').textContent=config_emoji_global['mark'];
        if (config_emoji_global['sound']){
            if (cslist.length>=5){
                sound_b('elephant');
            } else {
                sound_b('flash');
            }
        }
        setTimeout(sub_bejeweled_fill_linkgame_done,wait_time);
    }

    var col_dict={};
    var all_exist_emoji={};
    var wait_time=250;
    
    var changed_td=[];
    var changed_col=new Set();
        
    for (let item of cslist){
        item.style.borderColor=config_emoji_global['selected_color'];
    }
    setTimeout(sub_bejeweled_fill_linkgame_cells,wait_time);
}

function bejeweled_same_linkgame(otd){
    var list_t=otd.id.split('_');
    var blrow=parseInt(list_t[1]);
    var blcol=parseInt(list_t[2]);
    var blemoji=otd.textContent;
    
    var same_row=[];
    for (let blxl=blrow-1;blxl>=0;blxl--){
        var oneighbour=document.getElementById('td_'+blxl+'_'+blcol);
        if (!oneighbour){break;}
        if (oneighbour.textContent!==blemoji){break;}
        //console.log(blxl,blcol,oneighbour);   //此行保留 - 保留注释
        same_row.push(oneighbour);
    }
    
    for (let blxl=blrow;blxl<rows_lg_global+2;blxl++){
        var oneighbour=document.getElementById('td_'+blxl+'_'+blcol);
        if (!oneighbour){break;}
        if (oneighbour.textContent!==blemoji){break;}
        //console.log(blxl,blcol,oneighbour);   //此行保留 - 保留注释
        same_row.push(oneighbour);
    }

    var same_col=[];
    for (let blxl=blcol-1;blxl>=0;blxl--){
        var oneighbour=document.getElementById('td_'+blrow+'_'+blxl);
        if (!oneighbour){break;}
        if (oneighbour.textContent!==blemoji){break;}
        //console.log(blrow,blxl,oneighbour);   //此行保留 - 保留注释
        same_col.push(oneighbour);
    }
    
    for (let blxl=blcol;blxl<cols_lg_global+2;blxl++){
        var oneighbour=document.getElementById('td_'+blrow+'_'+blxl);
        if (!oneighbour){break;}
        if (oneighbour.textContent!==blemoji){break;}
        //console.log(blrow,blxl,oneighbour);   //此行保留 - 保留注释
        same_col.push(oneighbour);
    }
    
    var result_t=[];
    if (same_row.length>=3){
        result_t=result_t.concat(same_row);
    }
    
    if (same_col.length>=3){
        result_t=result_t.concat(same_col);    
    }
    return result_t;
}

function bejeweled_selected_img_get_linkgame(){
    return emoji_slice_linkgame(Math.max(6,Math.ceil((rows_lg_global+cols_lg_global)*0.15)));
}

function bejeweled_refresh_img_linkgame(){
    var new_img_list=bejeweled_selected_img_get_linkgame();
    var dict_t={};
    for (let blxl=0,lent=selected_emoji_global.length;blxl<lent;blxl++){
        dict_t['e_'+selected_emoji_global[blxl]]=new_img_list[blxl];
    }
    
    var otds=document.querySelectorAll('td.td_content_lg');
    for (let one_td of otds){
        one_td.textContent=dict_t['e_'+one_td.textContent];
    }
    selected_emoji_global=new_img_list;
}

function bejeweled_generate_linkgame(){
    var max_elements=max_elements_get_linkgame()[1];
    if (max_elements<=0){return;}
    
    selected_emoji_global=bejeweled_selected_img_get_linkgame();
    var result_t=emoji_duplicate_linkgame(selected_emoji_global,3,false);

    var table_list=[];
    var blxl=0;
    for (let arow=0;arow<rows_lg_global+2;arow++){
        table_list.push('<tr>');
        
        for (let acol=0;acol<cols_lg_global+2;acol++){
            table_list.push('<td id="td_'+arow+'_'+acol+'" class="td_content_lg" align="center" style="cursor:pointer;" onclick="bejeweled_check_linkgame(this);">'+result_t[blxl]+'</td>');
            blxl=blxl+1;
        }
        table_list.push('</tr>');    
    }
    var otable=document.getElementById('table_lg');
    otable.innerHTML=table_list.join('\n');
}

function bejeweled_check_linkgame(otd){
    function sub_bejeweled_check_linkgame_change(otd){
        var id1=otd.id.split('_');
        var id2=selected_td_lg_global.id.split('_');
        
        id1[1]=parseInt(id1[1]);
        id1[2]=parseInt(id1[2]);
        id2[1]=parseInt(id2[1]);
        id2[2]=parseInt(id2[2]);
        var is_neighbour=false;
        if (id1[1]==id2[1]){
            is_neighbour=(Math.abs(id1[2]-id2[2])==1);
        } else if (id1[2]==id2[2]){
            is_neighbour=(Math.abs(id1[1]-id2[1])==1);        
        }
        
        if (is_neighbour===false){
            selected_td_lg_global.style.borderColor=config_emoji_global['normal_color'];        
            selected_td_lg_global=otd;
            selected_td_lg_global.style.borderColor=config_emoji_global['selected_color'];
            return;
        }
        
        [otd.textContent,selected_td_lg_global.textContent]=[selected_td_lg_global.textContent,otd.textContent];

        otd.style.borderColor=config_emoji_global['normal_color'];        
        selected_td_lg_global.style.borderColor=config_emoji_global['normal_color'];
        
        var result_t=bejeweled_same_linkgame(otd);
        result_t=result_t.concat(bejeweled_same_linkgame(selected_td_lg_global));
        if (result_t.length==0){
            [otd.textContent,selected_td_lg_global.textContent]=[selected_td_lg_global.textContent,otd.textContent];
            selected_td_lg_global=otd;
            selected_td_lg_global.style.borderColor=config_emoji_global['selected_color'];            
        } else {
            bejeweled_fill_linkgame(result_t);
            selected_td_lg_global=false;
        }
    }
    
    if (is_two_selected_linkgame(otd,true)){
        sub_bejeweled_check_linkgame_change(otd);
    }
}

function emoji_slice_linkgame(max_elements){
    var img_list=[].concat(config_emoji_global['emoji']);
    
    var blmax=randint_b(5,10);
    for (let blxl=0;blxl<blmax;blxl++){    
        img_list.sort(randomsort_b);
    }
    img_list=img_list.slice(0,max_elements);
    return img_list;
}

function emoji_duplicate_linkgame(img_list,multiply=2,blank_rows_cols=true){
    if (blank_rows_cols){
        var blcouple=Math.ceil(rows_lg_global*cols_lg_global/multiply);
    } else {
        var blcouple=Math.ceil((rows_lg_global+2)*(cols_lg_global+2)/multiply);    
    }
    
    var result_t=[];
    for (let blxl=0;blxl<blcouple;blxl++){
        img_list.sort(randomsort_b);
        for (let bly=0;bly<multiply;bly++){
            result_t.push(img_list[0]);
        }
    }
    blmax=randint_b(5,10);    
    for (let blxl=0;blxl<blmax;blxl++){
        result_t.sort(randomsort_b);
    }
    return result_t;
}

function box_linkgame(top_left=false,empty_tip=true){
    function sub_box_linkgame_blank_tr(rowno){
        var list_t=[];
        list_t.push('<tr>');   
        list_t.push('<td id="td_'+rowno+'_-1" align="center" style="visibility:hidden;">'+config_emoji_global['blank_symbol']+'</td>');
        for (let acol=0;acol<cols_lg_global;acol++){
            list_t.push('<td id="td_'+rowno+'_'+acol+'" align="center" style="visibility:hidden;">'+config_emoji_global['blank_symbol']+'</td>');
        }
        list_t.push('<td id="td_'+rowno+'_'+cols_lg_global+'" align="center" style="visibility:hidden;">'+config_emoji_global['blank_symbol']+'</td>');
        list_t.push('</tr>');
        return list_t;
    }
    //-----------------------
    var max_elements=max_elements_get_linkgame()[1];
    if (max_elements<=0){return;}
    
    switch (config_emoji_global['type']){
        case '汉字':
            img_list=random_chs_b(max_elements,true);
            break;
        default:
            var img_list=emoji_slice_linkgame(max_elements);
            break;
    }
    
    var result_t=emoji_duplicate_linkgame(img_list,2);
    
    var blxl=0;
    var table_list=sub_box_linkgame_blank_tr(-1);
    
    var do_rotate,rotate_list;
    [do_rotate,rotate_list]=rotate_deg_get_linkgame();
    
    for (let arow=0;arow<rows_lg_global;arow++){
        var list_t=[];
        table_list.push('<tr>');   
        table_list.push('<td id="td_'+arow+'_-1" align="center" style="visibility:hidden;">'+config_emoji_global['blank_symbol']+'</td>');
        
        if (do_rotate){
            for (let acol=0;acol<cols_lg_global;acol++){
                rotate_list.sort(randomsort_b);
                table_list.push('<td id="td_'+arow+'_'+acol+'" class="td_content_lg" align="center" style="cursor:pointer;" onclick="click_linkgame(this);"><div style="transform:rotate('+rotate_list[0]+'deg);">'+result_t[blxl]+'</div></td>');
                list_t.push(result_t[blxl]);
                blxl=blxl+1;
            }
        } else {
            for (let acol=0;acol<cols_lg_global;acol++){
                table_list.push('<td id="td_'+arow+'_'+acol+'" class="td_content_lg" align="center" style="cursor:pointer;" onclick="click_linkgame(this);">'+result_t[blxl]+'</td>');
                list_t.push(result_t[blxl]);
                blxl=blxl+1;
            }        
        }
        
        table_list.push('<td id="td_'+arow+'_'+cols_lg_global+'" align="center" style="visibility:hidden;">'+config_emoji_global['blank_symbol']+'</td>');
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
        document.getElementById('span_tip_emoji').innerHTML='';
    }
    config_emoji_global['tip']=[];
    resolve_linkgame();
}

function click_linkgame(otd){
    function sub_click_linkgame_check(otd){
        if (selected_td_lg_global.textContent!==otd.textContent){   //selected_td_lg_global===false - 保留注释
            selected_td_lg_global.style.borderColor=config_emoji_global['normal_color'];
            selected_td_lg_global=otd;
            return;
        }
        
        if (compare_linkgame(selected_td_lg_global,otd.id,true)===false){
            sub_click_linkgame_remove(otd,selected_td_lg_global);
        } else {
            if (selected_td_lg_global!==false){
                selected_td_lg_global.style.borderColor=config_emoji_global['normal_color'];
            }
            selected_td_lg_global=otd;
        }
    }
    
    function sub_click_linkgame_remove(otd1,otd2){
        for (let odom of [otd1,otd2]){
            odom.textContent=config_emoji_global['blank_symbol'];
            odom.removeAttribute('onclick');
            odom.style.borderColor=config_emoji_global['normal_color'];
            odom.style.cursor='';
            odom.style.visibility='hidden';
        }

        selected_td_lg_global=false;
        
        config_emoji_global['recombine_times']=0;
        resolve_linkgame();
    }
    
    if (is_two_selected_linkgame(otd)){
        sub_click_linkgame_check(otd);
    }
}

function is_two_selected_linkgame(otd,check_same=false){
    if (selected_td_lg_global==otd){
        otd.style.borderColor=config_emoji_global['normal_color'];
        selected_td_lg_global=false;
    } else {
        otd.style.borderColor=config_emoji_global['selected_color'];
        if (selected_td_lg_global===false){
            selected_td_lg_global=otd;
        } else if (check_same && selected_td_lg_global.textContent==otd.textContent){
            selected_td_lg_global.style.borderColor=config_emoji_global['normal_color'];
            selected_td_lg_global=otd;
            return false;
        } else {
            return true;
        }
    }
    return false;
}

function resolve_linkgame(){
    function sub_resolve_linkgame_link(){
        for (let blx=0,lent=list_t.length;blx<lent;blx++){
            for (let bly=0,lenb=list_t.length;bly<lenb;bly++){
                if (blx==bly){continue;}
                var td1='td_'+list_t[blx][0]+'_'+list_t[blx][1];
                var td2='td_'+list_t[bly][0]+'_'+list_t[bly][1];
                var str1=document.getElementById(td1).textContent;
                var str2=document.getElementById(td2).textContent;
                if (str1!==str2){continue;}
                if (str1==config_emoji_global['blank_symbol']){continue;}
                if (compare_linkgame(td1,td2)===false){
                    if (klmenu_check_b('span_show_tip_lg',false)){
                        document.getElementById('span_tip_emoji').innerHTML=list_t[blx]+' &nbsp; '+list_t[bly];
                    }
                    config_emoji_global['tip']=[list_t[blx],list_t[bly]];
                    return [list_t[blx],list_t[bly]];
                }
            }
        }    
        return false;
    }
    
    if (config_emoji_global['tip'].length==2){
        var td1='td_'+config_emoji_global['tip'][0][0]+'_'+config_emoji_global['tip'][0][1];
        var td2='td_'+config_emoji_global['tip'][1][0]+'_'+config_emoji_global['tip'][1][1];
        var str1=document.getElementById(td1).textContent;
        var str2=document.getElementById(td2).textContent;      
        if (str1==config_emoji_global['tip'][0][2] && str2==config_emoji_global['tip'][1][2]){
            if (klmenu_check_b('span_show_tip_lg',false)){
                document.getElementById('span_tip_emoji').innerHTML=config_emoji_global['tip'][0]+' &nbsp; '+config_emoji_global['tip'][1];
            }        
            return;
        }
    }
    
    var list_t=remain_linkgame();
    if (list_t.length<=1){
        return [true,true];
    }
    
    var result_t=sub_resolve_linkgame_link();
    if (result_t!==false){
        return result_t;
    }

    config_emoji_global['recombine_times']=config_emoji_global['recombine_times']+1;
    if (config_emoji_global['recombine_times']<10){
        recombine_linkgame(list_t);
        return resolve_linkgame();
    }
    return [false,false];
}

function recombine_linkgame(remain_list){
    line_remove_linkgame();
    var blank_list=[];
    var blcount=rows_lg_global*cols_lg_global-remain_list.length;
    for (let blxl=0;blxl<blcount;blxl++){
        blank_list.push(config_emoji_global['blank_symbol']);
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

    var do_rotate,rotate_list;
    [do_rotate,rotate_list]=rotate_deg_get_linkgame();
    
    var blxl=0;
    for (let one_td of otds){
        one_td.style.borderColor=config_emoji_global['normal_color'];
        
        if (blank_list[blxl]==config_emoji_global['blank_symbol']){
            one_td.textContent=blank_list[blxl];        
            one_td.removeAttribute('onclick');
            one_td.style.cursor='';
            one_td.style.visibility='hidden';
        } else {
            one_td.setAttribute('onclick','click_linkgame(this);');
            one_td.style.cursor='pointer';
            one_td.style.visibility='';
            
            rotate_cell_insert_linkgame(do_rotate,rotate_list,one_td,blank_list[blxl]);
        }
        blxl=blxl+1;
    }
    selected_td_lg_global=false;
}

function remain_linkgame(){
    var result_t=[];
    for (let arow=0;arow<rows_lg_global;arow++){
        for (let acol=0;acol<cols_lg_global;acol++){
            var otd=document.getElementById('td_'+arow+'_'+acol);
            if (otd.textContent!==config_emoji_global['blank_symbol']){
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
    return otd.textContent==config_emoji_global['blank_symbol']; //当 visibility:hidden 时 innerText 为空 - 保留注释
    //textContent 会忽略空白字符（如空格、制表符和换行符），而 innerText 会保留它们。 - 通义千问
}

function between_linkgame(td1,td2){
    if (td1[0]!==td2[0] && td1[1]!==td2[1]){return true;}   //不在同一行且不在同一列 - 保留注释

    var odom1=document.getElementById('td_'+td1[0]+'_'+td1[1]);
    var odom2=document.getElementById('td_'+td2[0]+'_'+td2[1]);
    if (!odom1 || !odom2){return true;}
    if (odom1.textContent!==odom2.textContent && odom1.textContent!==config_emoji_global['blank_symbol'] && odom2.textContent!==config_emoji_global['blank_symbol']){return true;}    //非空且不等 - 保留注释

    if (td1[0]==td2[0]){
        for (let blxl=Math.min(td1[1],td2[1])+1;blxl<Math.max(td1[1],td2[1]);blxl++){
            var td_between=document.getElementById('td_'+td1[0]+'_'+blxl);
            if (td_between){
                if (td_between.textContent!==config_emoji_global['blank_symbol']){return true;}
            }
        }
        return false;
    } else { //td1[1]==td2[1] - 保留注释
        for (let blxl=Math.min(td1[0],td2[0])+1;blxl<Math.max(td1[0],td2[0]);blxl++){
            var td_between=document.getElementById('td_'+blxl+'_'+td1[1]);
            if (td_between){
                if (td_between.textContent!==config_emoji_global['blank_symbol']){return true;}                    
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
    if (!show_line || config_emoji_global['show_line']===false){return;}
    line_remove_linkgame();
    
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
        var length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); // 线段长度 - 保留注释
        var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; // 线段角度
        var oline = document.createElement('line');
        oline.setAttribute('class','line_linkgame');
        document.body.appendChild(oline);

        oline.style.cssText='position: absolute; left:'+x1+'px; top:'+y1+'px; background-color: '+scheme_global['a']+'; width: '+length+'px; height:1px; transform-origin: 0 0; transform: rotate('+angle+'deg);';
        line_list.push(oline);
    }
    setTimeout(function (){line_remove_linkgame(line_list);},2000);
}

function line_remove_linkgame(line_list=false){
    if (line_list===false){
        line_list=document.querySelectorAll('line.line_linkgame');
    }
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

function emoji_usable_linkgame(){
    var result_t=[];
    var lent=config_emoji_global['emoji'].length;
    for (let blxl=0;blxl<lent;blxl++){
        if (blxl % (cols_lg_global+2) == 0){    //左右两侧空白列 - 保留注释
            result_t.push('</tr><tr>')
        }
        result_t.push('<td style="cursor:pointer;" onclick="select_one_emoji_linkgame(this);">'+config_emoji_global['emoji'][blxl]+'</td>');
    }
    var bljg=result_t.join('');
    if (!bljg.startsWith('<tr>')){
        bljg='<tr>'+bljg;
    }
    if (!bljg.endsWith('</tr>')){
        bljg=bljg+'</tr>';
    }
    
    var buttons='共有'+lent+'个 <span class="aclick" onclick="emoji_selected_2_clipboard_linkgame();">复制选中的emoji到剪贴板</span>';
    document.getElementById('table_lg').innerHTML=bljg+'<tr><td colspan='+(cols_lg_global+2)+'><p>'+buttons+'</p></td></tr>';
}

function emoji_selected_2_clipboard_linkgame(){
    var otds=document.querySelectorAll('#table_lg td');
    var result_t=[];
    for (let one_td of otds){
        if (one_td.style.borderColor==config_emoji_global['selected_color']){
            result_t.push(one_td.textContent);
        }
    }
    copy_2_clipboard_b(result_t.join(' '));
}

function select_one_emoji_linkgame(otd){
    otd.style.borderColor=(otd.style.borderColor==config_emoji_global['selected_color']?config_emoji_global['normal_color']:config_emoji_global['selected_color']);
}

function init_linkgame(){
    config_emoji_global={
    'mark':0,
    'normal_color':'#e0e0e0',
    'selected_color':'red',
    'blank_symbol':'⬜',
    'type':'',
    'tip':[],
    'emoji':emoji_category_b(['food','vegetable','animal','transport','human'],-2),
    'recombine_times':0,
    //'show_line':true,
    //'rotate':true,
    //'sound':true,
    };
    
    selected_emoji_global=[];
    selected_td_lg_global=false;

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
    //top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.6rem':'1.4rem'),true,false,2);
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
            blstr=blstr+'<tr><td>'+config_emoji_global['blank_symbol']+'</td></tr>';
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
            blstr=blstr+'<td>'+config_emoji_global['blank_symbol']+'</td>';
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
    
    var percent_num=config_emoji_global['emoji'].length/(rows_lg_global*cols_lg_global);
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

    var do_rotate,rotate_list;
    [do_rotate,rotate_list]=rotate_deg_get_linkgame();
    
    for (let blx=0;blx<rows_lg_global;blx++){
        for (let bly=0;bly<cols_lg_global;bly++){
            var otd=document.getElementById('td_'+blx+'_'+bly);
            rotate_cell_insert_linkgame(do_rotate,rotate_list,otd,list_t[blx][bly]);

            if (list_t[blx][bly]==config_emoji_global['blank_symbol']){
                otd.removeAttribute('onclick');
                otd.style.cursor='';
                otd.style.visibility='hidden';
            }
        }
    }
}

function rotate_cell_insert_linkgame(do_rotate,rotate_list,otd,cscontent){
    if (do_rotate){
        rotate_list.sort(randomsort_b);
        otd.innerHTML='<div style="transform:rotate('+rotate_list[0]+'deg);">'+cscontent+'</div>';
    } else {
        otd.textContent=cscontent;
    }
}

function rotate_deg_get_linkgame(){
    return [config_emoji_global['rotate'],[0,90,180,270]];
    //[0,45,90,135,180,225,270,315] //此行保留 - 保留注释
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

function type_linkgame(cstype){
    config_emoji_global['type']=cstype;
    config_emoji_global['mark']=0;
    document.getElementById('span_mark_emoji').textContent='';
    switch (cstype){
        case 'emoji':
            box_linkgame();
            break;
        case '汉字':
            box_linkgame();
            break;
        case '消块':
            bejeweled_generate_linkgame();
            break;
    }
}

function menu_linkgame(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'type_linkgame(this.textContent);">emoji</span>',    
    '<span class="span_menu" onclick="'+str_t+'type_linkgame(this.textContent);">汉字</span>',
    '<span class="span_menu" onclick="'+str_t+'type_linkgame(this.textContent);">消块</span>',    
    '<span id="span_show_tip_lg" class="span_menu" onclick="'+str_t+'tip_linkgame();">⚪ 连续提示</span>',
    '<span class="span_menu" onclick="'+str_t+'tip_linkgame(true);">提示一次</span>',
    '<span class="span_menu" onclick="'+str_t+'resize_linkgame();">resize</span>',
    ];

    var color_menu=colors_menu_b('scheme_change_linkgame',['default']);

    var remain_menu=[];

    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu">难度系数：<input type="text" id="input_percent_linkgame" value="MAX" /></span>',   
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'link_game\');">更新版本</span>',    
    '<span class="span_menu" onclick="'+str_t+'emoji_usable_linkgame();">可用emoji清单</span>',        
    ]);

    var group_list=[
    ['⚪ 连线','local_storage_set_linkgame(\'show_line\');',true,'span_show_line_lg'],
    ['⚪ 旋转','local_storage_set_linkgame(\'rotate\');',true,'span_rotate_lg'],
    ['⚪ sound','local_storage_set_linkgame(\'sound\');',true,'span_sound_lg'],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','10rem','1rem','1rem','60rem')+klmenu_b(color_menu,'🎨','20rem','1rem','1rem','20rem')+klmenu_b(remain_menu,'♟','12rem','1rem','1rem','60rem','','menu_remain_linkgame')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem')+' ');
    
    var input_list=[['input_percent_linkgame',5,0.5],];
    input_size_b(input_list,'id');
    local_storage_get_linkgame(['show_line','rotate','sound']);
    menu_remain_refresh_linkgame();
}

function local_storage_get_linkgame(cstype){
    local_storage_span_get_b('link_game','lg',cstype,config_emoji_global);
}

function local_storage_set_linkgame(cstype){
    local_storage_span_set_b('link_game','lg',cstype,config_emoji_global);
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
        setTimeout(function (){document.getElementById('span_tip_emoji').innerHTML='';},5000);
        return;
    }
    
    if (klmenu_check_b('span_show_tip_lg',true)){
        resolve_linkgame();
    } else {
        document.getElementById('span_tip_emoji').innerHTML='';
    }
}
