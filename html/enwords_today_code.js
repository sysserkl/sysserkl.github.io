function olds_words_batch_today_words(rnd_words_num=0,cn_def_words_num=0){
    var day1 = document.getElementById('select_day_start').value;
    var month1=document.getElementById('select_month_start').value;
    var day2 = document.getElementById('select_day_end').value;
    var month2=document.getElementById('select_month_end').value;
    
    var result_t=[];
    var bljg='';
    var blxl=1;
    var theday=validdate_b(new Date().getFullYear()+'-'+('0'+month1).slice(-2,)+'-'+('0'+day1).slice(-2,));
    
    var islast=false;
    while (true){
        bljg=bljg+'<h3>'+blxl+'. '+date2str_b('-',theday)+'</h3>';
        var list_t=[];
        
        get_day_words_enwc_b(theday.getDate(),theday.getMonth()+1,'old',false,false);
        list_t=list_t.concat(words_searched_arr_global);
        
        if (words_searched_arr_global.length>0){
            bljg=bljg+enwords_array_to_html_b(words_searched_arr_global,false)+'<hr />';
        }
        
        getlines_rnd_enwc_b(rnd_words_num,false);
        list_t=list_t.concat(words_searched_arr_global);

        if (words_searched_arr_global.length>0){
            bljg=bljg+enwords_array_to_html_b(words_searched_arr_global,false)+'<hr />';
        }
        
        rnd_cn_search_enwc_b(cn_def_words_num,false);
        list_t=list_t.concat(words_searched_arr_global);

        if (words_searched_arr_global.length>0){
            bljg=bljg+enwords_array_to_html_b(words_searched_arr_global,false)+'<hr />';
        }        
        
        result_t=result_t.concat(list_t);
        
        if (theday.getMonth()+1==month2 && theday.getDate()==day2){break;}

        theday.setTime(theday.getTime()+24*60*60*1000);
        blxl=blxl+1;
        if (theday.getMonth()+1==month2 && theday.getDate()==day2){
            islast=true;
            continue;   //完成最后一天 - 保留注释
        }
        if (islast || blxl>30){break;}
    }

    words_searched_arr_global=[].concat(result_t);
    
    var blhtml = document.getElementById('divhtml');
    blhtml.innerHTML=bljg+'<p><span class="aclick" onclick="en_word_temp_batch_add_b();">批量添加当前条件下的单词为最近记忆单词</span></p>'+enwords_batch_div_b(words_searched_arr_global)+enwords_js_wiki_textarea_b(words_searched_arr_global);
    top_bottom_arrow_b('div_top_bottom',words_searched_arr_global.length+' ');    
    
    title_change_enwords_b('旧单词+rnd'+rnd_words_num+'+cn'+cn_def_words_num);
}

function rnd_batch_today_words(cstype=''){
    var blcount=document.getElementById('input_count').value;
    var blnum=document.getElementById('input_lines').value;
    if (blcount==1){
        if (cstype=='cn'){
            return rnd_cn_search_enwc_b();
        } else {
            return getlines_rnd_enwc_b();
        }
    }

    if (cstype=='cn'){
        title_change_enwords_b((blcount>1?'批量':'')+'中文释义单词');
    } else {
        title_change_enwords_b((blcount>1?'批量':'')+'随机单词');
    }
    var list_t=[];
    var bljg='';
    for (let blxl=1;blxl<=blcount;blxl++){
        if (cstype=='cn'){
            rnd_cn_search_enwc_b(blnum,false);
        } else {
            getlines_rnd_enwc_b(blnum,false);
        }
        list_t=list_t.concat(words_searched_arr_global);

        bljg=bljg+'<h3>'+blxl+'</h3>'+enwords_array_to_html_b(words_searched_arr_global,false)+'<hr />';
    }
    
    words_searched_arr_global=[].concat(list_t);
    var blhtml = document.getElementById('divhtml');
    blhtml.innerHTML=bljg+'<p><span class="aclick" onclick="en_word_temp_batch_add_b();">批量添加当前条件下的单词为最近记忆单词</span></p>'+enwords_batch_div_b(words_searched_arr_global)+enwords_js_wiki_textarea_b(words_searched_arr_global);
    top_bottom_arrow_b('div_top_bottom',words_searched_arr_global.length+' ');
}

function set_today_words(){
    var today = new Date();
    months_days_today_words(today.getMonth()+1,today.getDate());
    option_days_today_words('select_day_start',today.getMonth()+1,today.getDate());
    option_days_today_words('select_day_end',today.getMonth()+1,today.getDate());
}

function months_days_today_words(csm,csd){
    var list_t=[];
    for (let blxl=1;blxl<=12;blxl++){
        list_t.push('<option>'+blxl+'</option>');
    }
    var oselect=document.getElementById('select_month_start');
    oselect.innerHTML=list_t.join('\n');
    oselect.value=csm;
    var oselect=document.getElementById('select_month_end');
    oselect.innerHTML=list_t.join('\n');
    oselect.value=csm;
}

function option_days_today_words(csid,csm,csday=''){
    var days=month_day_b(csm);
    var list_t=[];
    for (let blxl=1;blxl<=days;blxl++){
        list_t.push('<option>'+blxl+'</option>');
    }    
    var oselect=document.getElementById(csid);
    if (csday==''){
        csday=oselect.value;
    }
    
    oselect.innerHTML=list_t.join('\n');
    if (csday!==''){
        oselect.value=csday;
    }
}

function menu_today_words(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" id="span_source_en_b" onclick="klmenu_check_b(this.id,true);">⚪ 显示例句详细出处</span>',
    '<span class="span_menu" onclick="'+str_t+'show_sentence_enwc_b();">显示例句</span>',
    '<span class="span_menu" onclick="'+str_t+'show_new_words_enwc_b(\'span.span_enwords_sentence\');">显示例句中的生词</span>',
    '<span class="span_menu" onclick="'+str_t+'show_new_words_enwc_b(\'span.span_explanation\');">显示释义中的生词</span>',
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🗓','12rem','1rem','1rem','60rem'),'','0rem')+' ');
    if (!ismobile_b()){
        klmenu_check_b('span_source_en_b',true);
    }    
}

function init_today_words(){
    function sub_init_today_words_fn(){
        character_2_icon_b('🗓️');
        local_storage_today_b('enwords_statistics',40,enwords.length,'/');
        words_count_enwords_b();
        menu_today_words();
        set_today_words();
        enwords_mini_search_frame_form_b();
        olds_words_batch_today_words(rnd_cn__today_words_global[0],rnd_cn__today_words_global[1]);    
    }
    //-----------------------
    enwords_mini_search_frame_style_b();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),true,false,2);
    document.getElementById('span_batch_button_today_words').innerText='指定日期单词+随机单词'+rnd_cn__today_words_global[0]+'个+随机中文释义单词≤'+rnd_cn__today_words_global[1]+'个';
    words_searched_arr_global=[];  //全局变量 - 保留注释

    enwords_init_b(false,true,sub_init_today_words_fn);
}
