function new_words_rndwords(){
    var ospans=document.querySelectorAll('span.span_enwods_sentence');
    var list_t=[];
    for (let item of ospans){
        list_t.push(item.innerText);
    }
    get_new_words_arr_enbook(2,list_t.join('\n'),ospans,4,true,true);
}

function exam_rndwords(dohide=false){
    var odiv=document.getElementById('div_exam_buttons');
    var oinput=document.getElementById('testno');
    var odivhtml=document.getElementById('divhtml');
    if (oinput || dohide){
        odiv.innerHTML='';
        if (oinput){
            odivhtml.innerHTML='';
        }
        document.getElementById('div_rnd_enwords_buttons').style.display='';
        document.getElementById('div_recent_search').style.display='';
        odivhtml.style.margin='';
        odiv.style.margin='';
    }
    else {
        buttons_klexam();
        input_size_b([['testno',5]],'id');
        input_klexam();
        document.getElementById('div_rnd_enwords_buttons').style.display='none';
        document.getElementById('div_recent_search').style.display='none';    
        odivhtml.style.margin='1rem';
        odiv.style.margin='1rem';
    }
}

function menu_rndwords(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'new_words_rndwords();">显示生词</span>',   
    '<span class="span_menu" onclick="javascript:'+str_t+'exam_rndwords(true);day_old_words_rndwords();">今日旧单词</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'exam_rndwords(true);recent_words_rndwords();">最近记忆单词</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'exam_rndwords();">单词测试</span>',         
    '<span class="span_menu" onclick="javascript:'+str_t+'exam_rndwords(true);en_sentence_source_rndwords();">例句出处文章列表</span>',
    ];
    
    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'all\');">全部单词幻灯片</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'all\',true);">全部单词幻灯片(乱序)</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'current\');">当前单词幻灯片</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'current\',true);">当前单词幻灯片(乱序)</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'recent\');">最近记忆单词幻灯片</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'recent\',true);">最近记忆单词幻灯片(乱序)</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'today\');">今日旧单词幻灯片</span>',  
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_select_rndwords(\'today\',true);">今日旧单词幻灯片(乱序)</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'slide_set_seconds_rndwords();">设置时间间隔</span>',
    ];
    
    var klmenu3=[
    '<span class="span_menu" onclick="javascript:'+str_t+'window.open(location.href,\'\',\'width=550, height=200\');">新窗口</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'kl_remote_host_address_b();">设置form发送地址</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'pwa_rnd_english_words_store\',\'rnd_english_words_service_worker.js\');}">更新版本</span>',
    ];
    klmenu3=root_font_size_menu_b(str_t).concat(klmenu3);
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🇬🇧','14rem','1.1rem','1rem','60rem')+klmenu_b(klmenu2,'💡','14rem','1.1rem','1rem','60rem')+klmenu_b(klmenu3,'⚙','14rem','1.1rem','1rem','60rem'),'','0rem')+' ');
}

function slide_set_seconds_rndwords(){
    var blnum=parseInt(prompt('输入间隔秒数：',slide_interval_seconds_rndwords_global) || '');
    if (isNaN(blnum)){
        return;
    }
    if (blnum<1){
        return;
    }
    slide_interval_seconds_rndwords_global=blnum;
}

function slide_select_rndwords(cstype,israndom=false){
    clearInterval(slide_do_rndwords_global);
    slide_no_rndwords_global=0;
    en_word_temp_get_b();

    if (israndom==false){
        enwords_sort_b();
    }
    switch (cstype){
        case 'recent':
            words_temp_arr_global=en_words_temp_list_b();
            break;
        case 'today':
            words_temp_arr_global=en_day_old_words_b(day_of_year_b(new Date()),'old',[0]);
            break;
        case 'current':
            break;
        default:         
            words_temp_arr_global=[].concat(enwords);            
    }
    if (words_temp_arr_global.length<1){
        alert('当前无可用单词');
        return;
    }    
    if (israndom){
        words_temp_arr_global.sort(randomsort_b);
    }
    slide_start_rndwords();
    slide_one_rndwords();
    slide_do_rndwords_global=setInterval(slide_one_rndwords,slide_interval_seconds_rndwords_global*1000);
}

function one_line_rndwords(item,csrecent_word=''){
    if (item.length==0){return '';}
    if (item[0].length<3){return '';} //单词 发音 注释 - 保留注释
    var blpronounce='';
    if (item[1]!==''){
        var blword0=item[0].replace(new RegExp("'",'g'),"\\'");
        blpronounce=blpronounce+'<span class="span_pronounce" onclick="javascript:en_word_temp_change_b(this,\''+blword0+'\',\'switch\');"';

        if (en_words_temp_global.includes(item[0])){
            blpronounce=blpronounce+' style="background-color:'+scheme_global['pink']+';"';
        }

        blpronounce=blpronounce+'>'+item[1]+'</span>';
    }

    var list_t=['http://dict.cn/'+item[0],"<span style='font-size:2.5rem;font-weight:600;'>"+item[0]+"</span>",(ismobile_global?'<p>':'')+blpronounce+' '+en_word_def_b(item[0],item[2],csrecent_word)];
    list_t[2]=list_t[2]+'<hr />'+en_sentence_b(item[0],5,'0.9','','','txtlistsearch.htm?_tag',1)[0];
    
    return div_title_href_b(list_t);
}

function recent_words_rndwords(csstartno=-1,cscount=20){
    document.getElementById('input_eng_search').value='';
    en_word_temp_get_b();
    enwords_sort_b();

    var learn_something='';
    var list_t=en_words_temp_list_b();
    
    var recent_bookmark=(localStorage.getItem('enwords_recent_bookmark') || "").trim();
    if (recent_bookmark==''){
        if (list_t.length>0){
            recent_bookmark=list_t[0][0];
        }
    }

    if (csstartno==-1){
        for (let blxl=0;blxl<list_t.length;blxl++){
            if (list_t[blxl][0]==recent_bookmark){
                csstartno=blxl;
                break;
            }
        }
    }

    csstartno=Math.max(csstartno,0);
    for (let blxl=csstartno;blxl<list_t.length;blxl++){
        learn_something=learn_something+one_line_rndwords(list_t[blxl],recent_bookmark);
        if (blxl-csstartno+1>=cscount){break;}
    }

    var bottom_str='<span style="font-size:1.2rem;">';
    if (csstartno>0){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:recent_words_rndwords(0,'+cscount+');" title="第一页">1</a> ';
    }
    if (csstartno>0){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:recent_words_rndwords('+(csstartno-cscount)+','+cscount+');" title="上一页">◀</a> ';
    }
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:recent_words_rndwords(-1);" title="今日">⏺</a> ';
    if (csstartno+cscount<list_t.length){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:recent_words_rndwords('+(csstartno+cscount)+','+cscount+');" title="下一页">▶</a> ';
    }
    if (csstartno+cscount<list_t.length){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:recent_words_rndwords('+(Math.ceil(list_t.length/cscount)-1)*cscount+','+cscount+');" title="末一页">'+Math.ceil(list_t.length/cscount)+'</a> ';
    }
    bottom_str=bottom_str+'<span class="oblong_box" onclick="javascript:recent_words_locate_rndwords('+list_t.length+','+cscount+');">定位</span> ';    
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#div_recentwords" onclick="javascript:en_words_temp_textarea_b(\'div_recentwords\');">导入/导出</a> ';
    bottom_str=bottom_str+'</span>';
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=learn_something+'<p align=center style="margin:1rem;">'+bottom_str+' 最近记忆单词总数：'+list_t.length+' 当前为：'+(csstartno+1)+' 至 '+Math.min(csstartno+cscount,list_t.length)+'</p><div id="div_recentwords" style="margin:1rem;"></div>';
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    en_sentence_mobile_b();
    document.location.href="#top";
}

function recent_words_locate_rndwords(cslen,cscount){
    var blpages=Math.ceil(cslen/cscount);
    var blno=parseInt((prompt('输入页号',blpages) || '').trim());
    if (isNaN(blno)){return;}
    blno=Math.min(blpages,Math.max(1,blno));   
    recent_words_rndwords((blno-1)*cscount,cscount);
    locatin.href="#top";
}

function day_old_words_rndwords(csday=''){
    if (csday==''){
        csday=new Date();
    }
    var blday=validdate_b(csday);
    if (blday==false){return false;}
    document.getElementById('input_eng_search').value=date2str_b('-',blday);
    en_word_temp_get_b();
    enwords_sort_b();

    var learn_something='';
    var list_t=en_day_old_words_b(day_of_year_b(blday),'old',[0]);
    for (let item of list_t){
        learn_something=learn_something+one_line_rndwords(item);
    }    

    var bottom_str='<span style="font-size:1.2rem;">';
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:day_old_words_rndwords(\''+previous_day_b(blday)+'\');" title="上一天">◀</a> ';
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:day_old_words_rndwords(\'\');" title="今日">⏺</a> ';
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="javascript:day_old_words_rndwords(\''+next_day_b(blday)+'\');" title="下一天">▶</a> ';
    bottom_str=bottom_str+'</span>';
    document.getElementById('divhtml').innerHTML=learn_something+'<p align=center style="margin:1rem;">'+bottom_str+' 当前页单词数：'+list_t.length+'</p>';
    en_sentence_mobile_b();
    document.location.href="#top";
    return true;
}

function search_rndwords(csstr='',times=10){
    en_word_temp_get_b();
    if (csstr==''){
        csstr=document.getElementById('input_eng_search').value;
    }
    csstr=csstr.trim();
    if ((csstr.match(/^\d{4}\-\d{2}\-\d{2}$/) || []).length==1){
        if (day_old_words_rndwords(csstr)){
            return;
        }
    }
    
    var isreg=false;
    if (csstr.slice(-4,)=='(:r)'){
        isreg=true;
        csstr=csstr.substring(0,csstr.length-4);
    }
    document.getElementById('input_eng_search').value=csstr;

    recent_search_b('recent_search_rndenwords',csstr+(isreg?'(:r)':''),'search_rndwords','div_recent_search');
    
    var learn_something='';
    if (csstr==''){
        enwords.sort(randomsort_b);
    }
    
    var blxl=0;
    words_temp_arr_global=[];
    if (csstr==''){
        for (let item of enwords){
            learn_something=learn_something+one_line_rndwords(item);
            words_temp_arr_global.push(item);
            blxl=blxl+1;
            if (blxl>=times){break;}
        }
    }
    else {
        var words_temp_equal_arr=[[],[],[],[],[]];
        var csword_filter=(csstr.match(/[a-zA-Z0-9 '_\-]+/) || [""])[0];
        var csword_filter_set=new Set(csword_filter.split(' '));
        
        for (let item of enwords){
            var blfound=str_reg_search_b(item,csstr,isreg);
            if (blfound==-1){
                break;
            }
            if (blfound){
                var blnumber=en_similar_word_b(csword_filter,csword_filter_set,item[0]);
                if (blnumber==4 && blxl<=times || blnumber!==4){
                    words_temp_equal_arr[blnumber].push(item);
                }

                blxl=blxl+1;
            }
        }
        
        for (let blxl=0;blxl<=4;blxl++){
            words_temp_arr_global=words_temp_arr_global.concat(words_temp_equal_arr[blxl]);
        }
        if (words_temp_arr_global.length>times){
            words_temp_arr_global=words_temp_arr_global.slice(0,times);
        }        
        for (let blxl=0;blxl<words_temp_arr_global.length;blxl++){
            learn_something=learn_something+'<a name="word_'+blxl+'"></a>'+one_line_rndwords(words_temp_arr_global[blxl]);
        }
    }

    if (csstr==''){
        var bottom_str='<a href="#" onclick="javascript:search_rndwords();">刷新</a>';
    }
    else {
        var bottom_str='<a href="#top">Go Top</a> ';
        if (words_temp_arr_global.length>=times && times<=250){
            bottom_str=bottom_str+'<a href="#word_'+(words_temp_arr_global.length-1)+'" onclick="javascript:search_rndwords(\'\','+times*2+');">Load More</a>'; //跳转到上次搜索的最后一个单词 - 保留注释
        }
    }
    document.getElementById('divhtml').innerHTML=learn_something+'<p align=center>'+bottom_str+' ('+enwords.length+') ver: 0.0.5-20200418</p>';
    en_sentence_mobile_b();
    document.location.href="#top";
}

function en_sentence_source_rndwords(){
    var list_t=en_sentence_source_b();
    var result_t=[];
    var bljg='';
    var blhost='';
    var blxl=1;
    for (let item of list_t){
        if (blhost!==item[0]){
            if (bljg!==''){
                result_t.push(bljg);
            }
            bljg='';
            blhost=item[0];
        }
        bljg=bljg+'<p>'+blxl+'. <a href=" '+item[1]+'" target=_blank>'+item[2]+'</a></p>\n';
        blxl=blxl+1;
    }
    if (bljg!==''){
        result_t.push(bljg);
    }    
    document.getElementById('divhtml').innerHTML='<div style="margin:1rem;"><hr />'+result_t.join('<hr />')+'</div>';
}

function slide_start_rndwords(){
    var odivs=document.querySelectorAll('#div_menu_buttons,#div_exam_buttons,#div_top_bottom');
    var blstop=false;
    for (let one_div of odivs){
        if (one_div.style.display=='none'){
            one_div.style.display='';
            blstop=true;
        }
        else {
            one_div.style.display='none';
        }
    }
    if (blstop){
        clearInterval(slide_do_rndwords_global);
        slide_no_rndwords_global=0;
    }
}

function slide_one_rndwords(){
    if (words_temp_arr_global.length<1){
        return;
    }
    document.getElementById('divhtml').innerHTML=one_line_rndwords(words_temp_arr_global[slide_no_rndwords_global])+'<p id="p_slide_buttons" style="margin-left:1rem;"><span class="oblong_box" style="cursor:pointer;" onclick="javascript:exam_rndwords(true);slide_start_rndwords();this.parentNode.style.display=\'none\';">Stop</span></p>';
    en_sentence_mobile_b();
    slide_no_rndwords_global=slide_no_rndwords_global+1;
    if (slide_no_rndwords_global>=words_temp_arr_global.length){
        slide_no_rndwords_global=0;
    }
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('p#p_slide_buttons span.oblong_box'));
}

function args_rndwords(){
    var cskeys=href_split_b(location.href);
    var blkey='';
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let item of cskeys){
            item=item.trim();
            if (item.substring(0,2)=='s='){
                blkey=item.substring(2,);
                break;
            }
        }
    }
    search_rndwords(blkey);
}
