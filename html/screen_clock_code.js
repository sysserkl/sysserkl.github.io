function run_clock(){
    var today = new Date();
    if (stopwatch_start_global>=0){
        var bls=(today.getTime()-stopwatch_start_global)/1000;
        var blh=0;
        var blm=0;
        if (bls>=60){
            blm=parseInt(bls/60);
            bls=bls-blm*60;
        }
        if (blm>=60){
            blh=parseInt(blm/60);
            blm=blm-blh*60;
        }
        bls=Math.round(bls);
        if (nosecond_global){
            var mytime=('0'+blh).slice(-2)+':'+('0'+blm).slice(-2);
        } else {
            var mytime=('0'+blh).slice(-2)+':'+('0'+blm).slice(-2)+'<span style="font-size:'+font_size2_global+'rem;">'+':'+('0'+bls).slice(-2)+'</span>';
        }
    } else {
        if (nosecond_global){
            var mytime=('0'+today.getHours()).slice(-2)+':'+('0'+today.getMinutes()).slice(-2);
        } else {
            var mytime=('0'+today.getHours()).slice(-2)+':'+('0'+today.getMinutes()).slice(-2)+'<span style="font-size:'+font_size2_global+'rem;">'+':'+('0'+today.getSeconds()).slice(-2)+'</span>';
        }
    }
    odiv_global.innerHTML=mytime;
    document.title=odiv_global.innerText;
}

function fontsize_change_clock(cstype='+'){
    if (cstype=='+'){
        font_size1_global=font_size1_global+1;
    } else if (cstype=='-'){
        font_size1_global=Math.max(1,font_size1_global-1);
    } else {
        font_size1_global=18;
    }
    font_size2_global=Math.round(font_size1_global/2,2);
    odiv_global.style.fontSize=font_size1_global+'rem';
}

function getcolor_clock(cscolor){
    if (isNaN(cscolor)==false){
        return "#"+cscolor;
    } else if (cscolor.replace(new RegExp("[0123456789abcdef]","ig"),'')==''){
        return "#"+cscolor;
    } else {
        return cscolor;
    }
}

function init_clock(){
    slide_control_table_b('div_transparent','333');
    document.getElementById("div_transparent_td_l1").setAttribute('onclick','console.log(1);');
    document.getElementById("div_transparent_td_l2").setAttribute('onclick','fontsize_change_clock("-");');
    document.getElementById("div_transparent_td_l3").setAttribute('onclick','alarm_interval_set_b(0);');
    document.getElementById("div_transparent_td_m1").setAttribute('onclick','body_fullscreen_b();');
    document.getElementById("div_transparent_td_m2").setAttribute('onclick',"fontsize_change_clock('');");
    document.getElementById("div_transparent_td_m3").setAttribute('onclick',"stopwatch_start_global=(stopwatch_start_global>=0?-1:new Date().getTime());");
    document.getElementById("div_transparent_td_r1").setAttribute('onclick','service_worker_delete_b(\'screen_clock\');');
    document.getElementById("div_transparent_td_r2").setAttribute('onclick','fontsize_change_clock("+");');
    document.getElementById("div_transparent_td_r3").setAttribute('onclick','nosecond_global=!nosecond_global;');
    
    //---
    fontsize_change_clock('');

    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let item of cskeys){
            item=item.trim();
            if (item.substring(0,2)=='c='){
                fore_color_global=item.substring(2);
            }
            if (item.substring(0,3)=='bc='){
                backgounrd_color_global=item.substring(3);
            }
        }
    }    
    //---
    odiv_global.style.color=getcolor_clock(fore_color_global);
    document.getElementById("div_flex").style.backgroundColor=getcolor_clock(backgounrd_color_global);
    //---
    run_clock();
    setInterval(run_clock,1000);
}
