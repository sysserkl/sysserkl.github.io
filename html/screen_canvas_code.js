function rnddraw_scanvas(){
    if (Math.random()<0.05){
        document.getElementById('div_containter').style.backgroundColor=rndcolor_light_b(0.4);
    }
    
    var canvas = document.getElementById('canvas');
    if (Math.random()<0.005){
        canvas.width+=0;
        drawnum_global=0;
    }
    
    if (drawnum_global>=10){
        if (Math.random()>1/(drawnum_global+'').length){return;}
    }
    
    if (canvas.getContext){
        var painter=canvas.getContext("2d");
        painter.beginPath();
        
        painter.moveTo(randint_b(1,window_w_global),randint_b(1,window_h_global));
        var rndvalue=Math.random();
        if (rndvalue<=1/3){
            painter.arc(randint_b(0,window_w_global),randint_b(0,window_h_global),randint_b(1,Math.min(window_h_global,window_w_global)),0,2*Math.PI,false);
        } else if (rndvalue<=2/3){
            painter.lineTo(randint_b(0,window_w_global),randint_b(1,window_h_global));
        } else {
            painter.strokeRect(randint_b(1,window_w_global),randint_b(1,window_w_global),randint_b(1,window_w_global),randint_b(1,window_w_global));        
        }
        painter.strokeStyle=rndcolor_b();
        painter.lineWidth=randint_b(1,20);
        painter.stroke();
        drawnum_global=drawnum_global+1;
    }
}

function init_scanvas(){
    resize_scanvas();
    document.body.style.overflow='hidden';
    //---
    slide_control_table_b('div_transparent','333');
    document.getElementById('div_transparent_td_l1').setAttribute('onclick','console.log(1);');
    document.getElementById('div_transparent_td_l2').setAttribute('onclick','console.log(2);');
    document.getElementById('div_transparent_td_l3').setAttribute('onclick','console.log(3);');
    document.getElementById('div_transparent_td_m1').setAttribute('onclick','body_fullscreen_b();setTimeout(resize_scanvas,1000);');
    document.getElementById('div_transparent_td_m2').setAttribute('onclick','console.log(5);');
    document.getElementById('div_transparent_td_m3').setAttribute('onclick','console.log(6);');
    document.getElementById('div_transparent_td_r1').setAttribute('onclick','service_worker_delete_b(\'screen_canvas\');');
    document.getElementById('div_transparent_td_r2').setAttribute('onclick','console.log(7);');
    document.getElementById('div_transparent_td_r3').setAttribute('onclick','console.log(8);');
    
    setInterval(rnddraw_scanvas,3000);
}

function resize_scanvas(){
    window_w_global=document.documentElement.clientWidth;   //全局变量 - 保留注释
    window_h_global=document.documentElement.clientHeight;
    document.getElementById('div_containter').setAttribute('width',window_w_global+'px');
    document.getElementById('div_containter').setAttribute('height',window_h_global+'px');
    document.getElementById('canvas').setAttribute('width',window_w_global+'px');
    document.getElementById('canvas').setAttribute('height',window_h_global+'px');
    document.getElementById('div_containter').style.backgroundColor=rndcolor_light_b(0.4);
}
