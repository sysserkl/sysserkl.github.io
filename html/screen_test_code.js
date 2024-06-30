function basecolor_screentest(){
    var basecolor=['red','blue','yellow','green','black','white','pink','tomato','grey','purple','orange'];
    var list_t=[];
    for (let item of basecolor){
        list_t.push(item);
    }
    var l_list=[];
    for (let item of basecolor){
        var ohsl=rgb2hsl_b(item);
        if (!l_list.includes(ohsl['h']+'_'+ohsl['s'])){
            l_list.push(ohsl['h']+'_'+ohsl['s']);
            list_t.push('l_'+item);
        }
    }
    list_t.push('grey256');
    return list_t;
}

function jump_to_l_screentest(){
    for (let blxl=0,lent=pure_color_list_global.length;blxl<lent;blxl++){
        if (pure_color_list_global[blxl].substring(0,2)=='l_'){
            color_no_global=blxl;
            pure_colors_screentest(0);
            break;
        }
    }
}

function pure_colors_screentest(csnum=1){
    var odiv=document.getElementById('div_test');
    odiv.innerHTML='';
    color_no_global=color_no_global+csnum;

    if (color_no_global>=pure_color_list_global.length){
        color_no_global=0;
    } else if (color_no_global<0){
        color_no_global=Math.max(0,pure_color_list_global.length+color_no_global);
    }
    
    if (pure_color_list_global[color_no_global]=='grey256'){
        grey256_screentest();
    }
    if (pure_color_list_global[color_no_global].substring(0,2)=='l_'){
        hsl_screentest(pure_color_list_global[color_no_global].substring(2,),'l');
    } else {
        document.body.style.backgroundColor=pure_color_list_global[color_no_global];
    }
}

function grey256_screentest(){
    document.body.style.backgroundColor='';
    var odiv=document.getElementById('div_test');
    odiv.style.backgroundColor='white';
    var list_t=color_range_b(color1=[0,0,0],color2=[255,255,255],cscount=256);

    var window_w=document.documentElement.clientWidth;
    var window_h=document.documentElement.clientHeight;
    var rows=Math.ceil(Math.sqrt(256*window_h/window_w));
    var cols=Math.ceil(256/rows);

    var div_w=parseInt(window_w/cols-10);
    var div_h=parseInt(window_h/rows-10);
    var bljg='';
    for (let blxl=0;blxl<256;blxl++){
        bljg=bljg+'<div style="position:relative;float:left;width:'+div_w+'px;height:'+div_h+'px;margin:5px;background-color:'+rgb2hex_b(list_t[blxl])+';font-size:0.8rem;"><center style="background-color:grey;">'+rgb2hex_b(list_t[blxl])+'</center></div>';
    } 
    odiv.innerHTML=bljg;
}

function hsl_screentest(cscolor){
    document.body.style.backgroundColor='';
    ohsl=rgb2hsl_b(cscolor);
    var bljg='';
    var bllen=document.documentElement.clientWidth/2;
    var blheight=document.documentElement.clientHeight+'px';    
    for (let blxl=0;blxl<bllen;blxl++){
        bljg=bljg+'<td width=1 height=100% style="background-color:'+hsl2hex_b(ohsl['h'],ohsl['s'],blxl/bllen)+';"></td>';  //width不能100% - 保留注释
    }
    bljg='<table width=100% height="'+blheight+'" cellpadding=0 cellspacing=0><tr>'+bljg+'</tr></table>';
    document.getElementById('div_test').innerHTML=bljg;
}

function init_screentest(){
    slide_control_table_b('div_transparent','333');
    document.getElementById('div_transparent_td_l1').setAttribute('onclick','color_no_global=-1;pure_colors_screentest(1);');
    document.getElementById('div_transparent_td_l2').setAttribute('onclick','pure_colors_screentest(-1);');
    document.getElementById('div_transparent_td_l3').setAttribute('onclick','color_no_global=pure_color_list_global.length;pure_colors_screentest(-1);');
    document.getElementById('div_transparent_td_m1').setAttribute('onclick','body_fullscreen_b();');
    document.getElementById('div_transparent_td_m2').setAttribute('onclick','pure_colors_screentest(1);');
    document.getElementById('div_transparent_td_m3').setAttribute('onclick','console.log(5);');
    document.getElementById('div_transparent_td_r1').setAttribute('onclick','service_worker_delete_b(\'screen_test\');');
    document.getElementById('div_transparent_td_r2').setAttribute('onclick','pure_colors_screentest(1);');
    document.getElementById('div_transparent_td_r3').setAttribute('onclick','jump_to_l_screentest();');
}
