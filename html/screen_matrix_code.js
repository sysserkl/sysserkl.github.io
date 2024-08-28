function init_matrix(){
    args_matrix();
    document.body.style.backgroundColor=bg_global;

    slide_control_table_b('div_transparent','333');
    document.getElementById('div_transparent_td_l1').setAttribute('onclick','console.log(1);');
    document.getElementById('div_transparent_td_l2').setAttribute('onclick','console.log(2);');
    document.getElementById('div_transparent_td_l3').setAttribute('onclick','console.log(3);');
    document.getElementById('div_transparent_td_m1').setAttribute('onclick','body_fullscreen_b();');
    document.getElementById('div_transparent_td_m2').setAttribute('onclick','console.log(5);');
    document.getElementById('div_transparent_td_m3').setAttribute('onclick','console.log(6);');
    document.getElementById('div_transparent_td_r1').setAttribute('onclick','service_worker_delete_b(\'screen_matrix\');');
    document.getElementById('div_transparent_td_r2').setAttribute('onclick','console.log(7);');
    document.getElementById('div_transparent_td_r3').setAttribute('onclick','console.log(8);');
    
    for (let blxl=0;blxl<10;blxl++){
        div_matrix();
        add_text_matrix();
    }

    setTimeout(remove_div_temp_matrix,5000);
    setInterval(div_matrix,300);
    setInterval(add_text_matrix,200);
}

function div_matrix(){
    var dleft=randint_b(-1,100);
    var bljg='<div class="div_col" style="position:absolute;left:'+dleft+'%;width:1rem;height:10rem;color:'+color_global+';"></div>';   //width 和 height 不能改为 100% - 保留注释
        
    document.body.insertAdjacentHTML('beforeend',bljg);
}

function add_text_matrix(){
    var cols=document.getElementsByClassName('div_col');
    for (let acol of cols){
        if (Math.random()>=0.5){
            continue;
        }
        if (Math.random()>0.985 || acol.innerText.length>150){
            acol.parentNode.removeChild(acol);
        }
        
        if (Math.random()>=0.5){
            var str_t=random_chs_b(1);
        } else if (Math.random()>=0.996){
            var str_t=now_time_str_b();
        } else {
            var str_t=randstr_b(1);
        }
        
        acol.innerHTML='<span class="span_text">'+str_t+'</span><br />'+acol.innerHTML;
    }
    text_style_matrix();
}

function text_style_matrix(){
    var otexts=document.getElementsByClassName('span_text');
    if (Math.random()>0.1){
        var rndno=randint_b(0,otexts.length-1);
        if (!otexts[rndno]){return;}
        otexts[rndno].style.filter='brightness(250%)';
    }
    
    if (Math.random()>0.1){
        var rndno=randint_b(0,otexts.length-1);
        if (!otexts[rndno]){return;}
        otexts[rndno].style.fontWeight='600';
        otexts[rndno].style.overflow='hidden';
    }
    
    if (Math.random()>0.9){
        var rndno=randint_b(0,otexts.length-1);
        if (!otexts[rndno]){return;}
    }
    
    if (Math.random()>0.5){
        var rndno=randint_b(0,otexts.length-1);
        if (!otexts[rndno]){return;}
        otexts[rndno].style.fontSize=(Math.random()*randint_b(2,7)).toFixed(2)+'rem';
    }

    if (Math.random()>0.9){
        var rndno=randint_b(0,otexts.length-1);
        if (!otexts[rndno]){return;}
        otexts[rndno].style.color=rndcolor_b();
    }
}

function remove_div_temp_matrix(){
    document.body.style.overflow='hidden';
}

function args_matrix(){
    var cskeys=href_split_b(location.href);
    for (let item of cskeys){
        if (item.substring(0,6)=='color='){
            color_global='#'+item.substring(6);
        }
        if (item.substring(0,7)=='colorn='){
            color_global=item.substring(7);
        }
        if (item.substring(0,3)=='bg='){
            bg_global='#'+item.substring(3);
        }    
        if (item.substring(0,4)=='bgn='){
            bg_global=item.substring(4);
        }
    }
}
