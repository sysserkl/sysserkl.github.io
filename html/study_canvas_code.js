function basic_init_study_canvas(){
    var otd=document.getElementById('td_canvas');
    otd.innerHTML='';
    var rect=otd.getBoundingClientRect();
    otd.innerHTML='<canvas width="'+rect.width+'px" height="'+rect.height+'px"></canvas>';
}

function geometry_two_lines_intersection_study_canvas(){
    basic_init_study_canvas();
    
    var ocanvas=document.querySelector('td#td_canvas canvas');
    ocanvas.style.border='1px solid blue';
    
    var ctx = ocanvas.getContext('2d');
    canvas_center_axis_b(ocanvas,ctx,50,0.6);

    var blstyle=[3,3];

    canvas_draw_line_b([418,89],[103,106],ctx,'red');
    canvas_draw_line_b([7,2],[25,75],ctx,'red');
    
    var x,y;
    [x,y]=two_lines_intersection_b(418,89,103,106,7,2,25,75);
    
    canvas_draw_line_b([103,106],[x,y],ctx,'blue',blstyle);
    canvas_draw_line_b([25,75],[x,y],ctx,'blue',blstyle);
    console.log(x,y);
}

function palette_study_canvas(){
    basic_init_study_canvas();
    
    var ctx = document.querySelector('td#td_canvas canvas').getContext('2d');
    var rows_cols=9;
    var blstep=255/rows_cols;
    var box_size=60;
    var bcolor=Math.floor(Math.random()*255);
    for (let arow = 0; arow < rows_cols; arow++){
        for (let acol = 0; acol < rows_cols; acol++){
            ctx.fillStyle = 'rgb(' + Math.floor(255 - blstep * arow) + ', ' +Math.floor(255 - blstep * acol) + ', '+bcolor+')';
            ctx.fillRect(arow * box_size, acol * box_size, box_size, box_size);
        }
    }
}

function arc_simple_study_canvas(){
    basic_init_study_canvas();
    
    var ctx = document.querySelector('td#td_canvas canvas').getContext('2d');
    ctx.lineWidth=3;
        
    ctx.beginPath();
    ctx.arc(100, 120, 50, (Math.PI/180)*30, (Math.PI/180)*90, true);
    ctx.strokeStyle = 'green';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(300, 120, 50, (Math.PI/180)*30, (Math.PI/180)*90, false);
    ctx.strokeStyle = 'red';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arcTo(50, 300, 150, 400, 100);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
       
    ctx.beginPath();
    ctx.arc(100, 500, 50, (Math.PI/180)*0, (Math.PI/180)*360, false);
    ctx.strokeStyle = 'tomato';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(300, 500, 50, (Math.PI/180)*0, (Math.PI/180)*180, false);
    ctx.strokeStyle = 'brown';
    ctx.stroke();    
}

function li_filter_study_canvas(cskey){
    var olis=document.querySelectorAll('ol#ol_menu li');
    obj_search_show_hide_b(olis,'',cskey,klmenu_check_b('span_reg_study',false),true);
}

function li_show_study_canvas(){
    study_canvas_type_dict_global={   //全局变量，*表示显示源代码但不执行 - 保留注释
    //study_dict_start
    'palette':['palette_study_canvas','*basic_init_study_canvas'],
    'arc_simple':['arc_simple_study_canvas','*basic_init_study_canvas'],
    'geometry_two_lines_intersection':['geometry_two_lines_intersection_study_canvas','*basic_init_study_canvas','*two_lines_intersection_b','*canvas_draw_line_b','*canvas_center_axis_b'],
    //study_dict_end
    }    
    var bljg=[];
    for (let item in study_canvas_type_dict_global){
        bljg.push('<li><span class="span_link" onclick="run_source_study_canvas(\''+item+'\');">'+item+'</span></li>');
    }
    document.getElementById('ol_menu').innerHTML=bljg.join('\n');
    current_li_value_canvas_global=Object.keys(study_canvas_type_dict_global)[0];
}

function run_source_study_canvas(cstype,view_source=false){
    var otd=document.getElementById('td_interactive_info');
    otd.innerHTML='';
    otd.setAttribute('align','');
    document.getElementById('div_interactive_info').style.display='none';
    
    if (! cstype in study_canvas_type_dict_global){return;}
    current_li_value_canvas_global=cstype;
    var fun_list=study_canvas_type_dict_global[cstype];

    var otd=document.getElementById('td_canvas');
    run_or_view_source_klh_b(view_source,fun_list,otd);
}

function menu_study_canvas(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" target=_blank>MDN</a>',    
    '<span id="span_reg_study" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',            
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'📎','12rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_study',true);
}

function init_study_canvas(){
    document.getElementById('td_canvas').style.height=body_height_canvas_global*0.9+'px';
    input_with_x_b('input_search',8);        
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('td#td_study_list span.oblong_box'));        
    li_show_study_canvas();
    menu_study_canvas();
}
