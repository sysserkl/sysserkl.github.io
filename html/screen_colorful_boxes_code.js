function colorful_klbox(){
    times_global=0;
    var window_w=document.body.offsetWidth;
    var window_h=document_body_offsetHeight_b();
    
    var minwh=Math.min(window_w,window_h);
    
    var boxw=randint_b(20,parseInt(minwh/10));
    var boxh=boxw;

    if (Math.random()>1/3){
        if (Math.random()>0.5){
            boxw=window_w;
        } else {
            boxh=window_h;
        }
    }
    
    var cols=parseInt(window_w/boxw);
    var rows=parseInt(window_h/boxh);
    
    var divborder_w=Math.max(0,window_w-cols*boxw);
    var divborder_h=Math.max(0,window_h-rows*boxh);
    var odiv=document.getElementById('div_colors');
    var bljg='';
    for (let blx=0;blx<rows;blx++){
        for (let bly=0;bly<cols;bly++){
            bljg=bljg+'<div style="position:relative;float:left;width:'+boxw+'px;height:'+boxh+'px;color:black;background-color:'+rndcolor_b()+';"></div>';
        }
        if (divborder_w>0){
            bljg=bljg+'<div style="position:relative;float:left;width:'+divborder_w+'px;height:'+boxh+'px;color:black;background-color:'+rndcolor_b()+';"></div>';
        }
    }
    if (divborder_h>0){
        for (let bly=0;bly<cols;bly++){
            bljg=bljg+'<div style="position:relative;float:left;width:'+boxw+'px;height:'+divborder_h+'px;color:black;background-color:'+rndcolor_b()+';"></div>';
        }
    }
    if (divborder_w>0 && divborder_h>0){
        bljg=bljg+'<div style="position:relative;float:left;width:'+divborder_w+'px;height:'+divborder_h+'px;color:black;background-color:'+rndcolor_b()+';"></div>';    
    }
    odiv.innerHTML=bljg;
}

function change_color_klbox(){
    var odiv=document.getElementById('div_colors');
    var divs=odiv.getElementsByTagName('div');
    if (Math.random()>0.05){
        times_global=times_global+1;
        for (let item of divs){
            if (Math.random()>0.1){continue;}
            if (Math.random()>0.5){
                if (Math.random()>0.5){
                    item.style.filter='brightness(90%)';
                } else {
                    item.style.filter='brightness(110%)';
                }
            } else {
                item.style.backgroundColor=rndcolor_b();
            }
        }
    } else if (times_global>10){
        var color_range=color_range_b([],[],divs.length);
        for (let blxl=0,lent=divs.length;blxl<lent;blxl++){
            divs[blxl].style.backgroundColor=rgb2hex_b(color_range[blxl]);
        }
        times_global=0;
        return;
    }
    if (Math.random()>0.9 && times_global>10){
        colorful_klbox();
    }
}

function init_klbox(){
    colorful_klbox();
    setInterval(change_color_klbox,1000);
}
