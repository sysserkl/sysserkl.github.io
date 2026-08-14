function init_maze(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),true,false,2);
    menu_maze();
    character_2_icon_b('🌀');    
    generate_maze();
}

function menu_maze(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'refresh_maze();">重来</span>',
    ];
        
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span id="span_auto_complete_maze" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 直线自动填满</span>',        
    '<span id="span_auto_no_fork_maze" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 无岔路自动填充</span>',        
    ]);

    var group_list=[
    ['rows: <input type="number" id="input_rows_maze" value='+rows_maze_global+' style="width:4rem;" />','',false],
    ['cols: <input type="number" id="input_cols_maze" value='+cols_maze_global+' style="width:4rem;" />','',false],

    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🌀','8rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','18rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_auto_complete_maze',true);
    klmenu_check_b('span_auto_no_fork_maze',true);
}

function refresh_maze(){
    var otable=document.getElementById('table_maze');
    var otds=otable.querySelectorAll('td.td_maze_answer,td.td_maze_path');
    for (let one_td of otds){
        one_td.classList.remove('td_maze_answer');
        one_td.classList.remove('td_maze_path');
    }
}

function generate_maze(){
    rows_maze_global=parseInt(document.getElementById('input_rows_maze').value.trim());
    cols_maze_global=parseInt(document.getElementById('input_cols_maze').value.trim());
    
    grid = [];
    init_grid_maze_b(grid,rows_maze_global,cols_maze_global);    //,cell_size_maze_global,border_color_maze_global,canvas,ctx);
    
    var otable=document.getElementById('table_maze');
    table_maze_generate_b(rows_maze_global,cols_maze_global,grid,otable,null,'td_click_maze');
}

function answer_maze(){
    var otable=document.getElementById('table_maze');
    var blpath=find_path_maze_b(grid,rows_maze_global,cols_maze_global); //,cell_size_maze_global,path_color,false,canvas,ctx);
    
    var has_answer=otable.querySelector('td.td_maze_answer');
    
    var error_found=false;
    for (let item of blpath){
        let otd=otable.querySelector('.td_maze_rc'+item.row+'_'+item.col);
        if (otd){
            if (!otd.classList.contains('td_maze_answer')){
                error_found=true;
            } else {
                otd.classList.remove('td_maze_answer');
            }
            otd.classList.add('td_maze_path');
        }
    }
    
    if (otable.querySelector('td.td_maze_answer')){
        error_found=true;
    }
    
    if (has_answer){
        setTimeout(function (){alert(error_found?'错误':'正确');},1);
    }
}

function td_click_maze(otd){
    if (otd.classList.contains('td_maze_answer')){
        otd.classList.remove('td_maze_answer');
    } else {
        otd.classList.add('td_maze_answer');
        if (klmenu_check_b('span_auto_complete_maze',false)){
            do_auto_complete_maze(otd);
        }
        if (klmenu_check_b('span_auto_no_fork_maze',false)){
            do_auto_no_fork_maze(otd);
        }        
    }
}

function class_get_maze(otd){
    var class_str=otd.getAttribute('class');
    var rc=class_str.match(/td_maze_rc(\d+)_(\d+)/) || ['','',''];  //形如 [ "td_maze_rc2_17", "2", "17" ]
    var ltrb=class_str.match(/td_maze_w(\d)(\d)(\d)(\d)/) || ['','','','',''];    //形如：[ "td_maze_w1100", "1", "1", "0", "0" ]
    
    rc[1]=parseInt(rc[1]);
    rc[2]=parseInt(rc[2]);
    for (let blxl=1;blxl<5;blxl++){
        ltrb[blxl]=parseInt(ltrb[blxl]);
    }
    return [rc,ltrb];
}

function do_auto_complete_maze(otd){
    var rc0,ltrb0,rc1,ltrb1;
    [rc0,ltrb0]=class_get_maze(otd);
    
    var otable=document.getElementById('table_maze');
    var otds=otable.querySelectorAll('td.td_maze_answer');
    for (let one_td of otds){
        if (one_td==otd){continue;}
        [rc1,ltrb1]=class_get_maze(one_td);

        if (rc1[0].startsWith('td_maze_rc'+rc0[1]+'_')){
            console.log('r');
            console.log(rc0,ltrb0);
            console.log(rc1,ltrb1);
            
            let col_min=Math.min(rc0[2],rc1[2]);
            let col_max=Math.max(rc0[2],rc1[2]);
            var is_ok=true;
            var dom_list=[];
            for (let blxl=col_min;blxl<=col_max-1;blxl++){  //不考虑最右侧的td的right情况 - 保留注释
                var odom=otable.querySelector('td.td_maze_rc'+rc0[1]+'_'+blxl);
                dom_list.push(odom);
                var right_value=class_get_maze(odom)[1][3];
                if (right_value==1){
                    is_ok=false;
                    break;
                }
            }
            
            if (is_ok){
                for (let one_dom of dom_list){
                    one_dom.classList.add('td_maze_answer');
                }
            }
        }

        if (rc1[0].endsWith('_'+rc0[2])){
            console.log('c');
            console.log(rc0,ltrb0);
            console.log(rc1,ltrb1);
            
            let row_min=Math.min(rc0[1],rc1[1]);
            let row_max=Math.max(rc0[1],rc1[1]);
            var is_ok=true;
            var dom_list=[];
            for (let blxl=row_min;blxl<=row_max-1;blxl++){  //不考虑最下侧的td的right情况 - 保留注释
                var odom=otable.querySelector('td.td_maze_rc'+blxl+'_'+rc0[2]);
                dom_list.push(odom);
                var bottom_value=class_get_maze(odom)[1][4];
                if (bottom_value==1){
                    is_ok=false;
                    break;
                }
            }
            
            if (is_ok){
                for (let one_dom of dom_list){
                    one_dom.classList.add('td_maze_answer');
                }
            }            
        }        
    }
}

function do_auto_no_fork_maze(otd){
    if (otd.classList.contains('td_maze_rc0_0') || otd.classList.contains('td_maze_rc'+(rows_maze_global-1)+'_'+(cols_maze_global-1))){return;}

    var otable=document.getElementById('table_maze');

    var rc,ltrb;
    [rc,ltrb]=class_get_maze(otd);
    //console.log('fork',rc,ltrb);
    
    var dom_list=[];
    if (ltrb[1]==0){
        dom_list.push(otable.querySelector('td.td_maze_rc'+rc[1]+'_'+(rc[2]-1)));
    }

    if (ltrb[2]==0){
        dom_list.push(otable.querySelector('td.td_maze_rc'+(rc[1]-1)+'_'+rc[2]));    
    }
    
    if (ltrb[3]==0){
        dom_list.push(otable.querySelector('td.td_maze_rc'+rc[1]+'_'+(rc[2]+1)));    
    }
    
    if (ltrb[4]==0){
        dom_list.push(otable.querySelector('td.td_maze_rc'+(rc[1]+1)+'_'+rc[2]));        
    }
    
    var open_dom=[];
    for (let one_dom of dom_list){
        if (!one_dom){continue;}
        if (one_dom.classList.contains('td_maze_answer')){continue;}
        open_dom.push(one_dom);
    }
    
    if (open_dom.length==1){
        open_dom[0].classList.add('td_maze_answer');
        do_auto_no_fork_maze(open_dom[0]);
    }
}
