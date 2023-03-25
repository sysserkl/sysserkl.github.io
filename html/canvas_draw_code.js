function show_point_cdraw(){   
    if (old_x_global==false || old_y_global==false){
        old_x_global=current_x_global;
        old_y_global=current_y_global;
        return;
    }    

    ctx_global.beginPath();
    ctx_global.moveTo(old_x_global,old_y_global);
    ctx_global.lineTo(current_x_global, current_y_global);
    ctx_global.stroke();
    old_x_global=current_x_global;
    old_y_global=current_y_global;
}

function mouse_move_cdraw(e){
    current_x_global = e.pageX - ocanvas_global.offsetLeft;
    current_y_global = e.pageY - ocanvas_global.offsetTop;
}

function mouse_down_cdraw(e){
    if (e.pageX<ocanvas_global.offsetLeft || e.pageX>ocanvas_global.offsetLeft+ocanvas_global.width){
        halt_cdraw();
        return;
    }
    if (e.pageY<ocanvas_global.offsetTop || e.pageY>ocanvas_global.offsetTop+ocanvas_global.height){
        halt_cdraw();
        return;
    }
    current_x_global = e.pageX - ocanvas_global.offsetLeft;
    current_y_global = e.pageY - ocanvas_global.offsetTop;
    ocanvas_global.onmousemove=mouse_move_cdraw;
    
    ointerval_global=setInterval(show_point_cdraw, 10);
}

function mouse_up_cdraw(e){
    halt_cdraw();
}

function halt_cdraw(){
    clearInterval(ointerval_global);
    ocanvas_global.onmousemove=null;    
    old_x_global=false;
    old_y_global=false;
}

function buttons_cdraw(){
    var result_t=[];
    for (let item of color_range_global){
        var blcolor=rgb2hex_b(item);
        result_t.push('<span style="cursor:pointer;background-color:'+blcolor+';padding:0rem 1rem;border:0.1rem solid black; border-radius:1rem;margin:0.5rem;" onclick="ctx_global.strokeStyle=this.style.backgroundColor;"></span>');
    }
    document.getElementById('td_buttons').innerHTML=result_t.join('');
}

function init_cdraw(){
    old_x_global=false;
    old_y_global=false;
    current_x_global = 0;
    current_y_global = 0;
    size_global=10;    
    color_range_global=['white','blue','red','yellow','pink','tomato','brown','green','black'];
    buttons_cdraw();

    ointerval_global=false;

    ocanvas_global = document.getElementById('canvas_draw');
    ocanvas_global.width=document.documentElement.scrollWidth*0.9;
    ocanvas_global.height=document_body_offsetHeight_b()*0.9;
    
    ocanvas_global.onmousedown=mouse_down_cdraw;
    ocanvas_global.onmouseup=mouse_up_cdraw;
    ocanvas_global.oncontextmenu=mouse_up_cdraw;
    setTimeout(canvas_size_cdraw,1);
}

function canvas_size_cdraw(){    
    var orect=document.getElementById('td_buttons').getBoundingClientRect();
    ocanvas_global.height=document_body_offsetHeight_b()*0.9-orect.height;

    ctx_global = ocanvas_global.getContext('2d');

    ctx_global.fillStyle = 'white';
    ctx_global.beginPath();
    ctx_global.rect(0,0,ocanvas_global.width,ocanvas_global.height);
    ctx_global.closePath();
    ctx_global.fill();
    
    ctx_global.strokeStyle = 'blue';    
    ctx_global.lineJoin = 'round';       
    ctx_global.lineWidth = 10;
}
