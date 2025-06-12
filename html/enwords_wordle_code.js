function character_wordle(cscharacter){
    if (cscharacter==' '){
        cscharacter='<div class="div_space"> </div>';                    
    } else {
        cscharacter='<div class="div_done">'+cscharacter+'</div>';        
    }
    return cscharacter;
}

function enwords_range_worlde(){
    var blrange=document.getElementById('select_range_wordle').value;
    switch (blrange){
        case '全部':
            return enwords;
            break;
        case '最近记忆':
            return en_words_temp_list_b(false);
            break;
        case '四六级':
            return cet46_get_wordle();
            break;
        case '高中':
            return senior_high_school_get_wordle();
            break;
    }
}

function generate_wordle(show_answer=false){    
    if (show_answer==false){
        current_list_wordle_global=enwords_range_worlde();        
        var blmax=randint_b(5,10);
        for (let blxl=0;blxl<blmax;blxl++){    
            current_list_wordle_global.sort(randomsort_b);
        }
    }

    if (current_list_wordle_global.length==0){return;}
    
    current_word_wordle_global=current_list_wordle_global[0];
    var odiv=document.getElementById('td_content');
    var list_t=current_word_wordle_global[0].split('');
    if (show_answer){
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            list_t[blxl]=character_wordle(list_t[blxl]);        
        }
        answer_wordle();
    } else {
        length_wordle_global=(current_word_wordle_global[0].match(/[a-z]/ig) || []).length;
        var show_no=[];
        if (length_wordle_global>5){
            var show_count=Math.min(Math.floor(length_wordle_global/2),length_wordle_global-5);
        } else {
            var show_count=1;
        }
        for (let blxl=0;blxl<length_wordle_global;blxl++){
            show_no.push(blxl);
        }
        length_wordle_global=length_wordle_global-show_count;
        
        var blmax=randint_b(5,10);
        for (let blxl=0;blxl<blmax;blxl++){            
            show_no.sort(randomsort_b);
        }
        show_no=show_no.slice(0,show_count);
                    
        var letter_no=0;
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            if (list_t[blxl].match(/^[a-zA-Z]$/)==null){
                list_t[blxl]=character_wordle(list_t[blxl]);        
                continue; 
            }
            
            if (show_no.includes(letter_no)){
                list_t[blxl]=character_wordle(list_t[blxl]);                  
            } else {
                list_t[blxl]='<div id="div_wordle_'+blxl+'" class="div_wordle" onclick="border_wordle(this.id);">&nbsp;</div>';
            }
            letter_no=letter_no+1;
        }
        times_wordle_global=0;
        corrected_wordle_global=0;
        document.getElementById('span_times_wordle').innerHTML=times_wordle_global;
        document.getElementById('div_info_ewordle').innerHTML='';
    }
    odiv.innerHTML=list_t.join('');
    border_wordle();
    click_wordle();
}

function border_wordle(csid=''){
    var odivs=document.querySelectorAll('.div_wordle,.div_done');
    for (let one_div of odivs){
        one_div.style.borderColor=scheme_global['memo'];
    }
    if (csid==''){return;}
    var odiv=document.getElementById(csid);
    if (!odiv){return;}
    odiv.style.borderColor=scheme_global['a-hover'];
    current_id_wordle_global=csid;
}

function buttons_wordle(){
    var list_t=characters_b('a').split('');
    var cols=(ismobile_b()?6:7);
    var bltd='<td class="td_button_wordle" width=1 align="center" valign="middle" onclick="change_wordle(this.innerText);" onmouseover="this.style.color=scheme_global[\'a-hover\'];this.style.borderColor=scheme_global[\'a-hover\'];" onmouseout="this.style.color=\'\';this.style.borderColor=scheme_global[\'memo\'];" style="border-color:'+scheme_global['memo']+';background-color:'+scheme_global['button']+';">';
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]=bltd+list_t[blxl]+'</td>\n';
        if (blxl % cols == 0){
            list_t[blxl]='<tr>'+list_t[blxl];
        }        
        if (blxl % cols == cols-1){
            list_t[blxl]=list_t[blxl]+'</tr>\n';
        }
    }
    if (list_t[list_t.length-1].slice(-6,)!=='</tr>\n'){
        list_t[list_t.length-1]=list_t[list_t.length-1]+'</tr>\n';
    }
    document.getElementById('table_buttons').innerHTML=list_t.join('');
}

function click_wordle(odom=false){
    if (odom==false){
        odom=document.querySelector('.div_wordle');
        if (odom){
            odom.click();
        }   
    } else {
        while (true){
            odom=odom.nextSibling;
            if (!odom){
                odom=document.querySelector('.div_wordle');
                if (!odom){break;}
            }
            if (odom.classList.contains('div_wordle')){
                odom.click();
                break;
            }
        }
    }
}

function change_wordle(csvalue){
    var oletter=document.getElementById(current_id_wordle_global);
    if (!oletter){return;}    
    var blno=parseInt(current_id_wordle_global.split('_').slice(-1)[0]);
    oletter.innerText=csvalue;
    if (csvalue.toLowerCase()==current_word_wordle_global[0].substring(blno,blno+1).toLowerCase()){
        oletter.style.color=scheme_global['green'];
        oletter.style.borderColor=scheme_global['memo'];
        oletter.removeAttribute('id');   
        oletter.classList.remove('div_wordle');   
        oletter.classList.add('div_done');   
             
        corrected_wordle_global=corrected_wordle_global+1;
        if (corrected_wordle_global==length_wordle_global || document.getElementById('td_content').innerText.replace(/\s/g,'').toLowerCase().trim()==current_word_wordle_global[0].replace(/\s/g,'').toLowerCase()){
            answer_wordle();
        }
        
        click_wordle(oletter);
    } else if (current_word_wordle_global[0].toLowerCase().includes(csvalue.toLowerCase())){
        oletter.style.color=scheme_global['brown'];
    } else {
        oletter.style.color=scheme_global['memo'];
    }
    times_wordle_global=times_wordle_global+1;
    document.getElementById('span_times_wordle').innerHTML=times_wordle_global;    
}

function answer_wordle(){
    function sub_answer_wordle_sentence(){
        var osentence=odiv.querySelector('div.div_sentence');
        if (osentence){
            osentence.innerHTML=en_sentence_result_b(current_word_wordle_global[0],5,(ismobile_b()?'0.95':'0.9'),'','','txtlistsearch.htm?_tag','')[0];
            osentence.style.display='';
            en_sentence_mobile_b();
        }    
    }
    //-----------------------
    en_word_temp_get_b();
    var bljg='<hr />\n'+one_enword_b(current_word_wordle_global,'',ismobile_b())+'\n';
    var odiv=document.getElementById('div_info_ewordle');
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
    setTimeout(sub_answer_wordle_sentence,10);
}

function init_wordle(){
    function sub_init_wordle_fn(){
        generate_wordle();    
    }
    //-----------------------
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    menu_wordle();
    buttons_wordle();
    enwords_init_b(false,true,sub_init_wordle_fn);
}

function menu_wordle(){
    var str_t=klmenu_hide_b('');
    var blparent=klmenu_hide_b('',true);
    var klmenu1=[
    load_sentence_menu_b(str_t),
    '<span class="span_menu">单词范围：<select id="select_range_wordle" style="height:2rem;" onchange="'+blparent+'"><option>全部</option><option>最近记忆</option><option>四六级</option><option>高中</option></select></span>',
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'😵','14rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function cet46_get_wordle(){
    if (typeof cet46_wordle_global== 'undefined'){
        var sets=new Set(cet6_en_global);
        cet46_wordle_global=set_2_enwords_b(sets); //全局变量 - 保留注释
    }
    return cet46_wordle_global;
}

function senior_high_school_get_wordle(){
    if (typeof shs_wordle_global== 'undefined'){
        var sets=new Set(senior_high_school_en_global);
        shs_wordle_global=set_2_enwords_b(sets); //全局变量 - 保留注释
    }
    return shs_wordle_global;
}
