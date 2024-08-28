function reset_cn_idiom(){
    clicked_td_no_global=-1;
    times_td_no_global=0;
    document.getElementById('divhtml').innerHTML='';    
}

function generate_cn_idiom(){    
    if (cn_idiom_global.length<4){return;}

    reset_cn_idiom();

    var blmax=randint_b(3,10);
    for (let blxl=0;blxl<blmax;blxl++){
        cn_idiom_global.sort(randomsort_b);
    }
    var result_t=[];
    var tr_list=[];
    var td_no=0;
    for (let blxl=0;blxl<4;blxl++){
        result_t=result_t.concat(cn_idiom_global[blxl].split(''));
        bllen=cn_idiom_global[blxl].length;
        var arow=[];
        for (let acol=0;acol<bllen;acol++){
            arow.push(td_style_cn_idiom(td_no));
            td_no=td_no+1;
        }
        tr_list.push('<tr>'+arow.join('')+'</tr>');
    }
    
    var blno=0;
    arow=[];
    for (let blxl=4,lent=cn_idiom_global.length;blxl<lent;blxl++){
        var item=cn_idiom_global[blxl].split('');
        item.sort(randomsort_b);
        if (!result_t.includes(item[0])){
            result_t.push(item[0]);
            arow.push(td_style_cn_idiom(td_no));
            td_no=td_no+1;
            blno=blno+1;
            if (blno>=3){break;}
        }
    }
    tr_list.push('<tr>'+arow.join('')+'</tr>');

    blmax=randint_b(3,10);
    for (let blxl=0;blxl<blmax;blxl++){
        result_t.sort(randomsort_b);    
    }
    
    var otable=document.getElementById('table_cn_idiom');
    otable.innerHTML=tr_list.join('\n');
    var otds=otable.querySelectorAll('td');
    if (otds.length!==result_t.length){
        document.getElementById('divhtml').innerHTML='error: '+otds.length+' : '+result_t.length;
        return;
    }
    for (let blxl=0,lent=otds.length;blxl<lent;blxl++){
        otds[blxl].innerText=result_t[blxl];
    }
}

function td_style_cn_idiom(td_no){
    return '<td id="td_cn_idiom_'+td_no+'" onclick="click_cn_idiom('+td_no+');" onmouseover="border_color_cn_idiom(this,'+td_no+',true);" onmouseout="border_color_cn_idiom(this,'+td_no+',false);"></td>';
}

function border_color_cn_idiom(otd,td_no,is_over=true){
    if (is_over){
        otd.style.borderColor=scheme_global['pink'];
        return;
    }
    
    var blcolor=(td_no==clicked_td_no_global?'a-hover':'memo');
    otd.style.borderColor=scheme_global[blcolor];        
}

function click_cn_idiom(csno=-1){
    var otds=document.querySelectorAll('#table_cn_idiom td');
    for (let one_td of otds){
        one_td.style.borderColor=scheme_global['memo'];
    }
    
    if (csno==clicked_td_no_global){    //取消点击 - 保留注释
        clicked_td_no_global=-1;
    } else if (csno>=0){
        var old_td=document.getElementById('td_cn_idiom_'+clicked_td_no_global);

        var current_td=document.getElementById('td_cn_idiom_'+csno);
        if (current_td){            
            if (old_td){
                var old_str=old_td.innerText;
                old_td.innerText=current_td.innerText;
                current_td.innerText=old_str;
                clicked_td_no_global=-1;
                times_td_no_global=times_td_no_global+1;
                check_cn_idiom();
            } else {
                current_td.style.borderColor=scheme_global['a-hover'];
                clicked_td_no_global=csno;
            }
        }        
    }
}

function check_cn_idiom(){
    var otrs=document.querySelectorAll('#table_cn_idiom tr');
    var blxl=0;
    var blcorrect=true;
    for (let arow of otrs){
        var otds=arow.querySelectorAll('td');
        var blstr='';
        for (let acol of otds){
            blstr=blstr+acol.innerText;
        }
        if (!cn_idiom_global.includes(blstr)){
            blcorrect=false;
            break;
        }
        blxl=blxl+1;
        if (blxl>=4){break;}
    }
    if (blcorrect){
        answer_cn_idiom();
    } else {
        document.getElementById('divhtml').innerHTML='<p>进行中，次数：'+times_td_no_global+'</p>';
    }
}

function answer_cn_idiom(){
    document.getElementById('divhtml').innerHTML=array_2_li_b(cn_idiom_global.slice(0,4))+'<p>完成，次数：'+times_td_no_global+'</p>';
}

function init_cn_idiom(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    generate_cn_idiom();
}
