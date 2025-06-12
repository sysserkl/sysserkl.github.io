function keys_klexam(){
    var cskeys=href_split_b(location.href);
    var isdone=false;
    var blnumber='';
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let bltmpstr of cskeys){
            if (bltmpstr.substring(0,2)=='n='){
                blnumber=bltmpstr.substring(2,); //此处无 break; - 保留注释
            } else if (bltmpstr=='type=recent'){
                input_klexam(blnumber,'recent');
                isdone=true;
                break;
            } else if (bltmpstr=='type=en2cn'){
                en2cn_klexam(blnumber);
                isdone=true;
                break;
            } else if (bltmpstr=='type=en2cn_recent'){
                en2cn_klexam(blnumber,'en2cn_recent');
                isdone=true;
                break;
            }            
        }
        if (isdone==false){
            input_klexam(blnumber);
        }
    } else {
        input_klexam();
    }
}

function is_show_sentence_klexam(){
    return klmenu_check_b('span_show_en_sentence_b',false);
}

function showcn_klexam(csid,show_sentence=-1,remote_host=false, button_str=false, font_size=false,max_rows=5){
    if (show_sentence===-1){
        show_sentence=is_show_sentence_klexam();
    }
    
    var blword='';
    var op=document.getElementById('p_en2cn_'+csid);
    var bljg=[];
    if (op){
        blword=op.innerText;
        for (let item of enwords){
            if (item[0]==blword){
                bljg=item;
                break;
            }
        }
    }
    var ospan=document.getElementById('span_en2cn_'+csid);
    if (ospan){
        ospan.innerHTML=en_one_word_b(bljg,[-1,0,false])
    }

    if (show_sentence){
        var odiv=document.getElementById('div_en2cn_sentence_'+csid);
        if (odiv){
            if (remote_host===false || button_str===false || font_size===false){
                [remote_host,button_str,font_size]=sentence_property_b(false);
                console.log('showcn_klexam() 初始化变量',remote_host,button_str,font_size);
            }
            var blstr,blcount,no_next;
            [blstr,blcount,no_next]=sentence_set_path_and_get_b(bljg[0],max_rows,font_size,remote_host,button_str);    
            if (blstr!==''){       
                odiv.innerHTML=blstr; 
                odiv.style.display='';
            }
        }
    }
}

function show_all_cn_klexam(cscount){
    function sub_show_all_cn_klexam_one_word(){
        if (blxl>=cscount){
            console.log('show_all_cn_klexam 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        
        showcn_klexam(blxl,show_sentence,remote_host, button_str, font_size);
        blxl=blxl+1;
        if (blxl % 40 == 0){
            setTimeout(sub_show_all_cn_klexam_one_word,1);
        } else {
            sub_show_all_cn_klexam_one_word();
        }
    }
    //-----------------------    
    var t0=performance.now();    
    var show_sentence=is_show_sentence_klexam();
    var remote_host,button_str,font_size;
    [remote_host,button_str,font_size]=sentence_property_b(false);
    
    var blxl=0;
    sub_show_all_cn_klexam_one_word();
}

function config_klexam(cstestno,cstype=''){
	if (cstestno==''){
        var cstestno= document.getElementById('testno').value;
        if (cstestno==''){
            cstestno=10;
        }
    }
    var isrecent=false;
    if (cstype=='recent' || cstype=='en2cn_recent'){
        en_word_temp_get_b();
        isrecent=true;
        //cstestno=en_words_temp_global.length; - 保留注释
    }
    cstestno = Math.min(enwords.length,Math.max(1, parseInt(cstestno)));

	document.getElementById('testno').value=cstestno;

    var today_list=[];
    if (isrecent){
        enwords_sort_b();
        var today_list=recent_1_today_words_klexam();    
    }
    
    enwords_sort_b('r');

	var odiv = document.getElementById('divhtml');
	odiv.innerHTML='';
    return [isrecent,cstestno,odiv,today_list];
}

function en2cn_klexam(csnumber='',cstype='en2cn'){
    var isrecent=false;
    var odiv,today_list;
    [isrecent,csnumber,odiv,today_list]=config_klexam(csnumber,cstype);

    var recent_type=document.getElementById('select_recent_enwords').value;
    var bllen=en_words_temp_global.length;
    var recent_half_len=en_words_temp_global.length/2;
    
	var bljg='<p style="background-color:'+scheme_global['skyblue']+';">Type: '+cstype+'</p>';
    var bllink_t='';
    var blxl=0;
    var important_list=(isrecent?en_word_temp_get_b('important'):[]);
    var include_no=new Set();
    var hr_str=(is_rnd_eng_klexam()?'border-top: 0.1rem dotted '+scheme_global['memo']+';':'');
    
    var do_confuse,quote_len;
    [do_confuse,quote_len]=quote_attribute_b('span_confuse_klexam');
    
	for (let item of enwords){
        if (isrecent){
            var blat=en_words_temp_global.indexOf(item[0]);
            if (check_recent_klexam(blat,item[0],recent_type,recent_half_len,bllen,important_list,today_list)==false){continue;}
        }
        include_no.add(blat);

        bllink_t=bllink_t+item[0]+'|';
		bljg=bljg+'<p id="p_en2cn_'+blxl+'" align=center style="font-size:2.5rem;font-weight:bold;border:0.1rem dotted black;padding:1rem;">'+item[0]+'</p>';
        bljg=bljg+'<p style="font-size:1rem;margin-bottom:1rem;margin-top:0.5rem;"><span class="oblong_box" style="cursor:pointer;" onclick="showcn_klexam(\''+blxl+'\');">释义</span> <span id="span_en2cn_'+blxl+'"></span></p>';
        bljg=bljg+'<div id="div_en2cn_sentence_'+blxl+'" class="div_sentence" style="display:none;'+hr_str+'"></div>';
        blxl=blxl+1;
        if (do_confuse){
            bljg=bljg+'<p style="line-height:1.5rem;margin-bottom:0.5rem;">'+quote31_global[blxl % quote_len].join('</p><p style="line-height:1.5rem;margin-bottom:0.5rem;">')+'</p>';
        }
        if (blxl==csnumber){break;}        
	}
    console.log('en2cn_klexam()',recent_type,blxl,Math.min(...include_no),Math.max(...include_no)); //此行保留 - 保留注释

    if (bllink_t.slice(-1)=='|'){
        bllink_t=bllink_t.substring(0,bllink_t.length-1);
    }
    
	bljg=bljg+'<p style="margin-top:0.5rem;"><span class="aclick" onclick="show_all_cn_klexam('+blxl+');">显示全部释义</span> ';
    if (!is_rnd_eng_klexam()){
        bljg=bljg+'<a class=aclick href="enwords.htm?s=^('+bllink_t.replace(new RegExp(' ','g'),'\\s')+')$_reg" target=_blank>link</a> ';
    }
    bljg=bljg+'</p>'
	odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function unblur_klexam(ospan){
    ospan.style.color=scheme_global['color'];
    ospan.style.backgroundColor=scheme_global['background'];
}

function confuse_klexam(){
    if (klmenu_check_b('span_confuse_klexam',true)){
        quote_load_b();
    }
}

function menu_klexam(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    load_sentence_menu_b(str_t),
    '<span id="span_show_en_sentence_b" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 显示例句</span>',    
    '<span id="span_confuse_klexam" class="span_menu" onclick="'+str_t+'confuse_klexam();">⚪ 混淆显示</span>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✒️','12rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_show_en_sentence_b',true);
}

function init_klexam(){
    function sub_init_klexam_fn(){
        character_2_icon_b('✒️️');
        enwords_mini_search_frame_form_b();
        keys_klexam();
        words_count_enwords_b();    
    }
    //-----------------------
    menu_klexam();
    buttons_klexam();
    enwords_mini_search_frame_style_b();
    input_size_b([['testno',5]],'id');
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    
    enwords_init_b(false,true,sub_init_klexam_fn);
}

function check_recent_klexam(csat,csword,recent_type,recent_half_len,en_words_temp_global_len,important_list,today_list){
    if (csat==-1){
        return false;
    }
    switch (recent_type){
        case '1':  //新近添加的最近记忆单词
            return csat>=recent_half_len;
            break;
        case '2':  //非新近添加的最近记忆单词
            return csat<=recent_half_len;
            break;
        case '1000':
            return en_words_temp_global_len-1-csat<1000;
            break;
        case '-1000':
            return csat<1000;
            break;
        case 'a-m':
            return csword[0].toLowerCase()<'n';
            break;
        case 'n-z':
            return csword[0].toLowerCase()>='n';
            break;
        case 'important':
            return important_list.includes(csword);
            break;
        case '1-today':
            return today_list.includes(csword);
            break;            
    }
    return true;
}

function recent_1_today_words_klexam(){
    var blday,blinterval;
    [blday,blinterval]=day_no_enwords_b();
    var words=recent_words_list_enwords_b(1,100,false,false).concat(recent_words_list_enwords_b((blday-1)*100+1,100,false,false));
    var result_t=[];
    for (let item of words){
        result_t.push(item[0]);
    }
    return result_t;
}

function input_klexam(cstestno='',cstype='all'){
    function sub_input_klexam_one_word(blno){
        var item=enwords[blno];
		var bljg='<li id="li_'+blno+'"><input type="text" id="word'+blno+'" value="">';
		bljg=bljg+' <span id=spell'+blno+' title="点击显示音标" style="cursor:pointer;" class="fmini" onclick="showspell_klexam('+blno+');">(音标)</span> ';
		bljg=bljg+' <span title="点击提示一个字母" style="cursor:pointer;" class="fmini" onclick="showletter_klexam('+blno+');">(提示)</span> ';
        
        if (item[0].includes('\\') || item[0].includes('(') || item[0].includes('(') || item[0].includes('[') || item[0].includes(']')){
            var bldef=item[2];
        } else if (item[2].toLowerCase().includes(item[0].toLowerCase())){
            var bldef=item[2].replace(new RegExp('('+item[0]+')','ig'),'<span class="span_word_blur" ondblclick="unblur_klexam(this);">$1</span>');
        } else {
            var bldef=item[2];
        }
		bljg=bljg+'<span style="font-size:1rem;">'+bldef+'</span><span id=check'+blno+'></span>';
		bljg=bljg+' <span id=answer'+blno+' class="span_answer_klexam" style="display:none;">'+en_one_word_b([item[0],item[1]],[-1,0,false])+'</span></li>';    
        return bljg;
    }
    //-----------------------
    var isrecent=false;
    var odiv,today_list;
    [isrecent,cstestno,odiv,today_list]=config_klexam(cstestno,cstype);
    var recent_type=document.getElementById('select_recent_enwords').value;
    
    var bllen=en_words_temp_global.length;
    var recent_half_len=en_words_temp_global.length/2;
    
	var words_list_t=[];
    
    en_words_no_list_global=[];
    var bllink_t=[];
    var blxl=0;

    if (isrecent){
        var important_list=en_word_temp_get_b('important');

        var include_no=new Set();
        for (let blno=0,lent=enwords.length;blno<lent;blno++){
            var item=enwords[blno];
            var blat=en_words_temp_global.indexOf(item[0]);
            if (check_recent_klexam(blat,item[0],recent_type,recent_half_len,bllen,important_list,today_list)==false){continue;}
            
            include_no.add(blat);

            en_words_no_list_global.push(item[3]);
            bllink_t.push(item[0]);
            words_list_t.push(sub_input_klexam_one_word(blno));
            blxl=blxl+1;
            if (blxl==cstestno){break;}
        }
        console.log('input_klexam()',recent_type,blxl,Math.min(...include_no),Math.max(...include_no)); //此行保留 - 保留注释
    } else {
        for (let blno=0,lent=enwords.length;blno<lent;blno++){
            var item=enwords[blno];

            en_words_no_list_global.push(item[3]);
            bllink_t.push(item[0]);
            words_list_t.push(sub_input_klexam_one_word(blno));
            if (blno==cstestno-1){break;}
        }
    }
    
	var bljg='<p style="margin-top:15px;">';
    bljg=bljg+'<span class="aclick" onclick="checkwords_klexam();">检验</span> <span style="margin-left:20px;" id=good_bad></span>';
	bljg=bljg+' <span class="aclick" onclick="showwords_klexam();">答案</span>';
	bljg=bljg+' <span class="aclick" onclick="switch_klexam(\'right\');">正确</span>';
	bljg=bljg+' <span class="aclick" onclick="switch_klexam(\'wrong\');">错误</span>';
	bljg=bljg+' <span class="aclick" onclick="switch_klexam();">全部</span> ';
    if (!is_rnd_eng_klexam()){
        bljg=bljg+'<span class="aclick" onclick="search_link_klexam();">link</span> ';
    }
    bljg=bljg+checkbox_kl_b('o_ignore_empty','忽略未输入项','',true);
    bljg=bljg+'<p><span class="aclick" onclick="en_word_temp_batch_add_b();">批量添加当前条件下的单词为最近记忆单词</span></p>';
    bljg=bljg+'</p>';
	odiv.innerHTML='<p style="background-color:'+scheme_global['skyblue']+';">Type: '+cstype+'</p><ol>'+words_list_t.join('\n')+'</ol>'+bljg;
    
    var oinputs=document.body.querySelectorAll('input[id^=word]');  
    for (let item of oinputs){
        input_size_b([[item.getAttribute('id'),10]],'id');
    }
}

function is_rnd_eng_klexam(){
    return location.href.includes('rnd_english_words');
}

function search_link_klexam(){
    var result_t=[];
    var bllen=enwords.length;
    var olis=document.querySelectorAll('div#divhtml li');
    for (let ali of olis){
        if (ali.style.display=='none'){continue;}
        var ospan=ali.querySelector('span.span_answer_klexam');
        if (ospan){
            if (ospan.style.display=='none'){continue;}
            var blno=ospan.getAttribute('id');
            if (!blno){continue;}
            if (blno.substring(0,6)=='answer'){
                blno=parseInt(blno.substring(6,));
                if (blno>=0 && blno<bllen){
                    result_t.push(enwords[blno][0]);           
                }
            }
        }
    }
    sls_search_link_generate_enwc_b(result_t);
}

function switch_klexam(cstype=''){
    function sub_switch_klexam_show_hide(csclass,csshow){
        var ospans=document.getElementsByClassName(csclass);
        for (let item of ospans){
            item.parentNode.style.display=(csshow?'':'none');
        }
    }
    switch (cstype){
        case 'right':
            sub_switch_klexam_show_hide('check_right',true);
            sub_switch_klexam_show_hide('check_wrong',false);
            sub_switch_klexam_show_hide('check_ignore',false);
            break;
        case 'wrong':
            sub_switch_klexam_show_hide('check_right',false);
            sub_switch_klexam_show_hide('check_ignore',false);
            sub_switch_klexam_show_hide('check_wrong',true);
            break;
        default:
            sub_switch_klexam_show_hide('check_right',true);
            sub_switch_klexam_show_hide('check_wrong',true);      
            sub_switch_klexam_show_hide('check_ignore',true);  
            break;
    }
}

function checkwords_klexam(){
	var blinput=document.body.querySelectorAll('input[id^=word]');  
	var blgood=0;
	var blbad=0;
    var ignore_count=0;
    var is_ignore_empty=checkbox_kl_value_b('o_ignore_empty');
	for (let blxl=0,lent=blinput.length;blxl<lent;blxl++){
		var blno=blinput[blxl].getAttribute('id').substring(4,); 
		var checko=document.getElementById('check'+blno); 
        for (let one_word of enwords){
            if (one_word[3]==parseInt(en_words_no_list_global[blxl])){
                if (blinput[blxl].value.trim()==one_word[0]){
                    checko.innerHTML='<font color="'+scheme_global['a']+'"><big>✓</big></font>';
                    blgood=blgood+1;
                    checko.setAttribute('class','check_right');
                } else {
                    if (is_ignore_empty && blinput[blxl].value.trim()==''){
                        checko.innerHTML='<big>❓</big>';
                        ignore_count=ignore_count+1;
                        checko.setAttribute('class','check_ignore');
                    } else {
                        checko.innerHTML='<font color="'+scheme_global['a-hover']+'"><big>✗</big></font>';
                        blbad=blbad+1;
                        checko.setAttribute('class','check_wrong');
                    }
                }
                break;
            }
        }
	}
	var good_bad_o=document.getElementById('good_bad'); 
	good_bad_o.innerHTML='对了 '+blgood+' 道；错了 '+blbad+' 道；忽略 '+ignore_count+' 道';
}

function showwords_klexam(){
	var blinput=document.body.querySelectorAll('input[id^=word]');
    var is_ignore_empty=checkbox_kl_value_b('o_ignore_empty');
    
	for (let blxl=0,lent=blinput.length;blxl<lent;blxl++){
        if (is_ignore_empty && blinput[blxl].value.trim()==''){continue;}
		var blno=blinput[blxl].getAttribute('id').substring(4); 
		document.getElementById('answer'+blno).style.display="inline";
        
        //显示音标 - 保留注释
        for (let item of enwords){
            if (item[3]==parseInt(en_words_no_list_global[blxl])){
		        document.getElementById('spell'+blno).innerHTML=item[1];
                break;
            }
        }
        var oli=document.getElementById('li_'+blxl);
        if (oli){
            var ospans=oli.querySelectorAll('span.span_word_blur');
            for (let item of ospans){
                unblur_klexam(item);
            }
        }
	}
}

function showspell_klexam(csno){
    if (csno>=0 && csno<enwords.length){
        document.getElementById('spell'+csno).innerHTML=enwords[csno][1];
    }
}

function showletter_klexam(csno){
    if (csno>=0 && csno<enwords.length){
        document.getElementById('word'+csno).value=enwords[csno][0].substring(0,1);
    }
}

function buttons_klexam(){  //不能转换为htm，随机单词也用到 - 保留注释
    var bl1000='';
    if (en_words_temp_global.length>2000){
        bl1000=`<option value='1000'>最新1000最近记忆单词</option>
        <option value='-1000'>最旧1000最近记忆单词</option>`
    }

    var blday=day_no_enwords_b()[0];//day_no_klexam();
    
    var bljg=`<p style="margin-bottom:0.5rem;">题目数量：<input type="number" id="testno" value=10 onkeyup="if (event.key=='Enter'){input_klexam();}"> 
    <span class="aclick" onclick="input_klexam();">生成</span>
    <span class="aclick" onclick="input_klexam('','recent');">Recent</span>
    <span class="aclick" onclick="en2cn_klexam();">en2cn</span>
    <span class="aclick" onclick="en2cn_klexam('','en2cn_recent');">Recent(en2cn)</span>
    <select id="select_recent_enwords" style="height:2rem;">
    <option value='0'>全部最近记忆单词</option>
    <option value='1'>新近添加的最近记忆单词</option>
    <option value='2'>非新近添加的最近记忆单词</option>
    <option value='a-m'>a-m最近记忆单词</option>
    <option value='n-z'>n-z最近记忆单词</option>
    <option value='important'>important最近记忆单词</option>
    <option value='1-today'>第1页和第${blday}页最近记忆单词</option>
    `+bl1000+`
    </select>
    </p>`;
    document.getElementById('div_exam_buttons').innerHTML=bljg;
}
