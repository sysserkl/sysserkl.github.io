//依赖 enwords_code.js - 保留注释
function keys_klexam(){
    var cskeys=href_split_b(location.href);
    var isdone=false;
    var blnumber='';
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let bltmpstr of cskeys){
            if (bltmpstr.substring(0,2)=='n='){
                blnumber=bltmpstr.substring(2,); //此处无 break; - 保留注释
            }
            else if (bltmpstr=='type=recent'){
                input_klexam(blnumber,'recent');
                isdone=true;
                break;
            }
            else if (bltmpstr=='type=en2cn'){
                en2cn_klexam(blnumber);
                isdone=true;
                break;
            }
            else if (bltmpstr=='type=en2cn_recent'){
                en2cn_klexam(blnumber,'en2cn_recent');
                isdone=true;
                break;
            }            
        }
        if (isdone==false){
            input_klexam(blnumber);
        }
    }
    else {
        input_klexam();
    }
}

function showcn_klexam(csid){
    var op=document.getElementById('p_en2cn_'+csid);
    var bljg=[];
    if (op){
        var blword=op.innerText;
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
}

function show_all_cn_klexam(cscount){
    for (let blxl=0;blxl<cscount;blxl++){
        showcn_klexam(blxl);
    }
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
    
    enwords_sort_b('r');

	var odiv = document.getElementById('divhtml');
	odiv.innerHTML='';
    return [isrecent,cstestno,odiv];
}

function en2cn_klexam(csnumber='',cstype='en2cn'){
    var isrecent=false;
    var odiv;
    [isrecent,csnumber,odiv]=config_klexam(csnumber,cstype);

    var recent_type=document.getElementById('select_recent_enwords').value;
    var bllen=en_words_temp_global.length;
    var recent_half_len=en_words_temp_global.length/2;
    
	var bljg='<p style="background-color:'+scheme_global['skyblue']+';">Type: '+cstype+'</p>';
    var bllink_t='';
    var blxl=0;
    var include_no=new Set();
	for (let item of enwords){
        if (isrecent){
            var blat=en_words_temp_global.indexOf(item[0]);
            if (blat==-1){
                continue;
            }            
            if (recent_type=='1' && blat<recent_half_len || recent_type=='2' && blat>recent_half_len){
                continue;
            }
            if (recent_type=='1000' && bllen-1-blat>=1000 || recent_type=='-1000' && blat>=1000){
                continue;
            }                        
        }
        include_no.add(blat);

        bllink_t=bllink_t+item[0]+'|';
		bljg=bljg+'<p id="p_en2cn_'+blxl+'" align=center style="font-size:2.5rem;font-weight:bold;border:0.1rem dotted black;padding:1rem;">'+item[0]+'</p>';
        bljg=bljg+'<p style="font-size:1rem;margin-bottom:1rem;"><span class="oblong_box" style="cursor:pointer;" onclick="javascript:showcn_klexam(\''+blxl+'\');">释义</span> <span id="span_en2cn_'+blxl+'"></span></p>';
        blxl=blxl+1;
        if (blxl==csnumber){break;}
	}
    console.log(recent_type,Math.min(...include_no),Math.max(...include_no)); //此行保留 - 保留注释

    if (bllink_t.slice(-1)=='|'){
        bllink_t=bllink_t.substring(0,bllink_t.length-1);
    }
    
	bljg=bljg+'<p style="margin-top:15px;"><span class="aclick" onclick="javascript:show_all_cn_klexam('+blxl+');">显示全部释义</span> ';
    if (!location.href.includes('rnd_english_words')){
        bljg=bljg+'<a class=aclick href="enwords.htm?s=^('+bllink_t.replace(new RegExp(" ","g"),'\\s')+')$_reg" target=_blank>link</a> ';
    }
    bljg=bljg+'</p>'
	odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function unblur_klexam(ospan){
    ospan.style.color=scheme_global['color'];
    ospan.style.backgroundColor=scheme_global['background'];
}

function init_klexam(){
    buttons_klexam();
    enwords_mini_search_frame_style_b();
    input_size_b([['testno',5]],'id');
    enwords_init_b();
    enwords_mini_search_frame_form_b();
    keys_klexam();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
}

function input_klexam(cstestno='',cstype='all'){
    function sub_input_klexam_one_word(blno){
        var item=enwords[blno];
		var bljg='<li id="li_'+blno+'"><input type="text" id="word'+blno+'" value="">';
		bljg=bljg+' <span id=spell'+blno+' title="点击显示音标" style="cursor:pointer;" class="fmini" onclick="javascript:showspell_klexam('+blno+');">(音标)</span> ';
		bljg=bljg+' <span title="点击提示一个字母" style="cursor:pointer;" class="fmini" onclick="javascript:showletter_klexam('+blno+');">(提示)</span> ';
        
        if (item[0].includes('\\') || item[0].includes('(') || item[0].includes('(') || item[0].includes('[') || item[0].includes(']')){
            var bldef=item[2];
        }
        else if (item[2].toLowerCase().includes(item[0].toLowerCase())) {
            var bldef=item[2].replace(new RegExp('('+item[0]+')','ig'),'<span class="span_word_blur" ondblclick="javascript:unblur_klexam(this);">$1</span>');
        }
        else {
            var bldef=item[2];
        }
		bljg=bljg+'<span style="font-size:1rem;">'+bldef+'</span><span id=check'+blno+'></span>';
		bljg=bljg+' <span id=answer'+blno+' style="display:none;">'+en_one_word_b([item[0],item[1]],[-1,0,false])+'</span></li>';    
        return bljg;
    }
    //-----------------------
    var isrecent=false;
    var odiv;
    [isrecent,cstestno,odiv]=config_klexam(cstestno,cstype);
    
    var recent_type=document.getElementById('select_recent_enwords').value;
    
    var bllen=en_words_temp_global.length;
    var recent_half_len=en_words_temp_global.length/2;
    
	var words_list_t=[];
    
    en_words_no_list_global=[];
    var bllink_t=[];
    var blxl=0;
    if (isrecent){
        var include_no=new Set();
        for (let blno=0;blno<enwords.length;blno++){
            var item=enwords[blno];
            var blat=en_words_temp_global.indexOf(item[0]);
            if (blat==-1){
                continue;
            }            
            if (recent_type=='1' && blat<recent_half_len || recent_type=='2' && blat>recent_half_len){
                continue;
            }
            if (recent_type=='1000' && bllen-1-blat>=1000 || recent_type=='-1000' && blat>=1000){
                continue;
            }
            include_no.add(blat);

            en_words_no_list_global.push(item[3]);
            bllink_t.push(item[0]);
            words_list_t.push(sub_input_klexam_one_word(blno));
            blxl=blxl+1;
            if (blxl==cstestno){break;}
        }
        console.log('input_klexam()',recent_type,Math.min(...include_no),Math.max(...include_no)); //此行保留 - 保留注释
    }
    else {
        for (let blno=0;blno<enwords.length;blno++){
            var item=enwords[blno];

            en_words_no_list_global.push(item[3]);
            bllink_t.push(item[0]);
            words_list_t.push(sub_input_klexam_one_word(blno));
            if (blno==cstestno-1){break;}
        }
    }
    
	var bljg='<p style="margin-top:15px;">';
    bljg=bljg+'<span class="aclick" onclick="javascript:checkwords_klexam();">检验</span> <span style="margin-left:20px;" id=good_bad></span>';
	bljg=bljg+' <span class="aclick" onclick="javascript:showwords_klexam();">显示答案</span>';
	bljg=bljg+' <span class="aclick" onclick="javascript:switch_klexam(\'right\');">显示正确</span>';
	bljg=bljg+' <span class="aclick" onclick="javascript:switch_klexam(\'wrong\');">显示错误</span>';
	bljg=bljg+' <span class="aclick" onclick="javascript:switch_klexam();">显示全部</span> ';
    if (!location.href.includes('rnd_english_words')){
        bljg=bljg+'<a class="aclick" href="enwords.htm?s=^('+bllink_t.join('|').replace(new RegExp(" ","g"),'\\s')+')$_reg" target=_blank>link</a> ';
    }
    bljg=bljg+checkbox_kl_b('o_ignore_empty','忽略未输入项','',true);
    bljg=bljg+'<p><span class="aclick" onclick="javascript:en_word_temp_batch_add_b();">批量添加当前条件下的单词为最近记忆单词</span></p>';
    bljg=bljg+'</p>';
	odiv.innerHTML='<p style="background-color:'+scheme_global['skyblue']+';">Type: '+cstype+'</p><ol>'+words_list_t.join('\n')+'</ol>'+bljg;
    
    var oinputs=document.body.querySelectorAll('input[id^=word]');  
    for (let item of oinputs){
        input_size_b([[item.getAttribute('id'),10]],'id');
    }
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
    //var words_no_list=document.getElementById('input_words_no').value.trim().split('|');
	for (let blxl=0;blxl<blinput.length;blxl++){
		var blno=blinput[blxl].getAttribute('id').substring(4,); 
		var checko=document.getElementById('check'+blno); 
        for (let one_word of enwords){
            if (one_word[3]==parseInt(en_words_no_list_global[blxl])){
                if (blinput[blxl].value.trim()==one_word[0]){
                    checko.innerHTML='<font color="'+scheme_global['a']+'"><big>✓</big></font>';
                    blgood=blgood+1;
                    checko.setAttribute('class','check_right');
                }
                else{
                    if (is_ignore_empty && blinput[blxl].value.trim()==''){
                        checko.innerHTML='<big>❓</big>';
                        ignore_count=ignore_count+1;
                        checko.setAttribute('class','check_ignore');
                    }
                    else {
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
    
	for (let blxl=0;blxl<blinput.length;blxl++){
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

    var bljg=`<p style="margin-bottom:0.5rem;">题目数量：<input type="number" id="testno" value=10 onkeyup="javascript:if (event.key=='Enter'){input_klexam();}"> 
    <span class="aclick" onclick="javascript:input_klexam();">生成</span>
    <span class="aclick" onclick="javascript:input_klexam('','recent');">Recent</span>
    <span class="aclick" onclick="javascript:en2cn_klexam();">en2cn</span>
    <span class="aclick" onclick="javascript:en2cn_klexam('','en2cn_recent');">Recent(en2cn)</span>
    <select id="select_recent_enwords" style="height:2rem;">
    <option value='0'>全部最近记忆单词</option>
    <option value='1'>新近添加的最近记忆单词</option>
    <option value='2'>非新近添加的最近记忆单词</option>
    `+bl1000+`
    </select>
    </p>`;
    document.getElementById('div_exam_buttons').innerHTML=bljg;
}
