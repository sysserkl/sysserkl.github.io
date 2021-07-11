function div_matrix(){
    var dleft=randint_b(-1,100);
    var bljg='<div class="div_col" style="position:absolute;left:'+dleft+'%;width:1rem;height:10rem;color:'+color_global+';"></div>';   //width 和 height 不能改为 100% - 保留注释
        
    var obody=document.getElementsByTagName('body')[0];
    obody.insertAdjacentHTML('beforeend',bljg);
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
        }
        else if (Math.random()>=0.996){
            var str_t=now_time_str_b();
        }
        else {
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
    document.getElementsByTagName('body')[0].style.overflow='hidden';
    div_height_temp_remove_b();
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
