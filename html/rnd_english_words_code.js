function new_words_rndwords(){
    var ospans=document.querySelectorAll('span.span_enwords_sentence');
    var list_t=[];
    for (let item of ospans){
        list_t.push(item.innerText);
    }
    get_new_words_arr_obj_enbook_b(2,list_t.join('\n'),ospans,true,true);
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
    } else {
        buttons_klexam();
        input_size_b([['testno',5]],'id');
        input_klexam();
        document.getElementById('div_rnd_enwords_buttons').style.display='none';
        document.getElementById('div_recent_search').style.display='none';    
        odivhtml.style.margin='1rem';
        odiv.style.margin='1rem';
    }
}

function sentence_search_rndwords(){
    var csstr=document.getElementById('input_eng_search').value;
    csstr=csstr.trim();   
    var isreg=klmenu_check_b('span_reg_rndwords',false);
    if (csstr.slice(-4,)=='(:r)'){
        isreg=true;
        csstr=csstr.substring(0,csstr.length-4);
    }
    if (csstr==''){return;}
    
    var show_button=klmenu_check_b('span_button_en_slide',false);
    var bljg=sentence_search_b(csstr,isreg,100,show_button,'0.9');
    document.getElementById('divhtml').innerHTML=div_title_href_b(['','',bljg]);
    if (!klmenu_check_b('span_source_en_slide',false)){
        setTimeout(function (){en_sentence_mobile_b(true);},10);
    }
}

function links_rndwords(){
    var csstr=document.getElementById('input_eng_search').value;
    csstr=csstr.trim();   
    if (csstr.slice(-4,)=='(:r)'){
        csstr=csstr.substring(0,csstr.length-4);
    }
    if (csstr==''){return;}
    var bljg='<big>'+en_word_links_b(csstr)+'</big>';
    document.getElementById('divhtml').innerHTML=div_title_href_b(['',bljg]);
}

function init_rndwords(){
    function sub_init_rndwords_fn(){
        menu_rndwords();
        args_rndwords();    
        en_word_temp_get_b();        
    }
    //-----------------------
    slide_no_rndwords_global=0;
    words_temp_arr_global=[];
    slide_interval_seconds_rndwords_global=8;
    ismobile_global=ismobile_b();

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.6rem':'1.5rem'),true,true);
    input_with_x_b('input_eng_search',(ismobile_b()?16:20));
    
    enwords_init_b(false,true,sub_init_rndwords_fn);
}

function menu_rndwords(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'new_words_rndwords();">显示生词</span>',   
    '<span class="span_menu" onclick="'+str_t+'exam_rndwords(true);day_old_words_rndwords();">今日旧单词</span>', 
    '<span class="span_menu" onclick="'+str_t+'exam_rndwords(true);recent_words_rndwords();">最近记忆单词</span>',     
    '<span class="span_menu" onclick="'+str_t+'en_word_recent_bookmark_b(false);exam_rndwords(true);recent_words_rndwords();">设置书签</span>',    
    '<span class="span_menu" onclick="'+str_t+'exam_rndwords();">单词测试</span>',         
    '<span id="span_show_en_sentence_b" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 显示例句</span>',    
    '<span id="span_source_en_slide" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 显示例句详细出处</span>',            
    '<span id="span_button_en_slide" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 显示例句按钮</span>',        
    ];
    
    var klmenu2=[
    '<span class="span_menu" onclick="'+str_t+'slide_select_rndwords(\'all\');">全部单词幻灯片</span>',
    '<span class="span_menu" onclick="'+str_t+'slide_select_rndwords(\'current\');">当前单词幻灯片</span>',
    '<span class="span_menu" onclick="'+str_t+'slide_select_rndwords(\'recent\');">最近记忆单词幻灯片</span>',     
    '<span class="span_menu" onclick="'+str_t+'slide_select_rndwords(\'today\');">今日旧单词幻灯片</span>',  
    '<span id="span_random_en_slide" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 随机排序</span>',
    '<span id="span_interval_en_slide" class="span_menu" onclick="'+str_t+'slide_set_seconds_rndwords();">时间间隔：'+slide_interval_seconds_rndwords_global+' 秒</span>',
    ];
    
    var klmenu_search=[
    '<span class="span_menu" onclick="'+str_t+'links_rndwords();">显示词典链接</span>',
    '<span class="span_menu" onclick="'+str_t+'sentence_search_rndwords();">例句搜索</span>',    
    ];
    
    var klmenu3=[
    load_sentence_menu_b(str_t),    
    '<span id="span_reg_rndwords" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 正则</span>',                
    '<span class="span_menu" onclick="'+str_t+'window.open(location.href,\'\',\'width=550, height=200\');">新窗口</span>', 
    '<span class="span_menu" onclick="'+str_t+'enwords_definition_2_multilines_b();">释义分段</span>',
    '<span class="span_menu" onclick="'+str_t+'pronunciation_show_hide_rndwords();">音标显示切换</span>',    
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'rnd_english_words\');">更新版本</span>',
    ];
    klmenu3=root_font_size_menu_b(str_t,true,true,true).concat(klmenu3);
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🇬🇧','12rem','1.1rem','1rem','60rem')+klmenu_b(klmenu2,'💡','12rem','1.1rem','1rem','60rem')+klmenu_b(klmenu_search,'🎯','10rem','1.1rem','1rem','60rem')+klmenu_b(en_font_menu_b(str_t),'🅰','10rem','1rem','1rem','30rem')+klmenu_b(klmenu3,'⚙','16rem','1.1rem','1rem','60rem'),'','0rem')+' ');
    
    klmenu_check_b('span_reg_rndwords',true);
    klmenu_check_b('span_show_en_sentence_b',true);
    if (!ismobile_b()){
        klmenu_check_b('span_source_en_slide',true);
    }
}

function pronunciation_show_hide_rndwords(){
    var ospans=document.querySelectorAll('span.span_pronounce');
    for (let item of ospans){
        popup_show_hide_b(item,'');
    }
}

function slide_set_seconds_rndwords(){
    var blnum=parseInt(prompt('输入间隔秒数：',slide_interval_seconds_rndwords_global) || '');
    if (isNaN(blnum)){return;}
    if (blnum<1){return;}
    slide_interval_seconds_rndwords_global=blnum;
    document.getElementById('span_interval_en_slide').innerText='时间间隔：'+slide_interval_seconds_rndwords_global+' 秒';
}

function slide_select_rndwords(cstype){
    clearInterval(slide_do_rndwords_global);
    slide_no_rndwords_global=0;
    en_word_temp_get_b();

    var israndom=klmenu_check_b('span_random_en_slide',false);
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

function one_line_rndwords(item,csrecent_word='',csword=''){
    return one_enword_b(item,csrecent_word,ismobile_global,csword);
}

function show_sentence_rndwords(){
    function sub_show_sentence_rndwords_one_word(){
        if (blxl>=bllen){
            if (!klmenu_check_b('span_source_en_slide',false)){
                en_sentence_mobile_b(true);
            }
            console.log('show_sentence_rndwords 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        
        if (odivs[blxl].style.display=='none'){
            odivs[blxl].innerHTML=en_sentence_result_b(odivs[blxl].innerText,5,font_size,attachment_path,wikisite,txtlistsearch_site,button_str)[0];
            //'','','txtlistsearch.htm?_tag'
            odivs[blxl].style.display='';
        }
        blxl=blxl+1;
        setTimeout(sub_show_sentence_rndwords_one_word,5);
    }
    //-----------------------
    if (klmenu_check_b('span_show_en_sentence_b',false)==false){return;}

    var t0=performance.now();       
    var font_size=(ismobile_b()?'0.95':'0.9');
    var button_str=(klmenu_check_b('span_button_en_slide',false)?en_sentence_button_init_b(true):'');

    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var attachment_path,wikisite,txtlistsearch_site;
    [attachment_path,wikisite,txtlistsearch_site]=sentence_path_get_b(remote_host,is_local_b());
    
    var odivs=document.querySelectorAll('div.div_sentence');
    var bllen=odivs.length;
    var blxl=0;
    sub_show_sentence_rndwords_one_word();
}

function recent_words_rndwords(csstartno=-1,cscount=20){
    document.getElementById('input_eng_search').value='';
    en_word_temp_get_b();
    enwords_sort_b();

    var learn_something='';
    var list_t=en_words_temp_list_b();
    
    var recent_bookmark=enwords_recent_bookmark_get_b();
    if (recent_bookmark==''){
        if (list_t.length>0){
            recent_bookmark=list_t[0][0];
        }
    }

    if (csstartno==-1){
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            if (list_t[blxl][0]==recent_bookmark){
                csstartno=blxl;
                break;
            }
        }
    }

    csstartno=Math.max(csstartno,0);
    for (let blxl=csstartno,lent=list_t.length;blxl<lent;blxl++){
        learn_something=learn_something+one_line_rndwords(list_t[blxl],recent_bookmark);
        if (blxl-csstartno+1>=cscount){break;}
    }

    var bottom_str='<span style="font-size:1.2rem;">';
    if (csstartno>0){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="recent_words_rndwords(0,'+cscount+');" title="第一页">1</a> ';
    }
    if (csstartno>0){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="recent_words_rndwords('+(csstartno-cscount)+','+cscount+');" title="上一页">◀</a> ';
    }
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="recent_words_rndwords(-1);" title="今日">⏺</a> ';
    if (csstartno+cscount<list_t.length){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="recent_words_rndwords('+(csstartno+cscount)+','+cscount+');" title="下一页">▶</a> ';
    }
    if (csstartno+cscount<list_t.length){
        bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="recent_words_rndwords('+(Math.ceil(list_t.length/cscount)-1)*cscount+','+cscount+');" title="末一页">'+Math.ceil(list_t.length/cscount)+'</a> ';
    }
    bottom_str=bottom_str+'<span class="oblong_box" onclick="recent_words_locate_rndwords('+list_t.length+','+cscount+');">定位</span> ';    
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#div_recentwords" onclick="en_words_temp_textarea_b(\'div_recentwords\');">导入/导出</a> ';
    bottom_str=bottom_str+'</span>';
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=learn_something+'<p align=center style="margin:1rem;">'+bottom_str+' 最近记忆单词总数：'+list_t.length+' 当前为：'+(csstartno+1)+' 至 '+Math.min(csstartno+cscount,list_t.length)+'</p><div id="div_recentwords" style="margin:1rem;"></div>';
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    show_sentence_rndwords();
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
        csday=date2str_b('-'); //不用 new Date(); - 保留注释
    }
    var blday=validdate_b(csday);
    if (blday==false){return false;}
    var day_str=date2str_b('-',blday);
    document.getElementById('input_eng_search').value=day_str;
    en_word_temp_get_b();
    enwords_sort_b();

    var learn_something='';
    var list_t=en_day_old_words_b(day_of_year_b(blday)+1,'old',[0]);    //2021-01-02 00:00:00 还是第一天 - 保留注释
    for (let item of list_t){
        learn_something=learn_something+one_line_rndwords(item);
    }    

    var bottom_str='<span style="font-size:1.2rem;">';
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="day_old_words_rndwords(\''+previous_day_b(blday)+'\');" title="上一天">◀</a> ';
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="day_old_words_rndwords(\'\');" title="今日">⏺</a> ';
    bottom_str=bottom_str+'<a class="a_oblong_box" href="#" onclick="day_old_words_rndwords(\''+next_day_b(blday)+'\');" title="下一天">▶</a> ';
    bottom_str=bottom_str+'</span>';
    document.getElementById('divhtml').innerHTML=learn_something+'<p align=center style="margin:1rem;">'+bottom_str+' 当前页单词数：'+list_t.length+'</p>';
    show_sentence_rndwords();
    document.location.href="#top";
    return true;
}

function word_search_rndwords(csstr='',times=10){
    en_word_temp_get_b();
    if (csstr==''){
        csstr=document.getElementById('input_eng_search').value;
    }
    csstr=csstr.trim();
    if ((csstr.match(/^\d{4}\-\d{2}\-\d{2}$/) || []).length==1){
        if (day_old_words_rndwords(csstr)){return;}
    }
    
    var isreg=klmenu_check_b('span_reg_rndwords',false);
    if (csstr.slice(-4,)=='(:r)'){
        isreg=true;
        csstr=csstr.substring(0,csstr.length-4);
    }
    document.getElementById('input_eng_search').value=csstr;

    recent_search_b('recent_search_enwords',csstr+(isreg?'(:r)':''),'word_search_rndwords','div_recent_search');
    
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
    } else {
        var words_temp_equal_arr=enwords_search_arr_init_b();
        var csword_filter=(csstr.match(/[a-zA-Z0-9 '_\-]+/) || [""])[0];
        var csword_filter_set=new Set(csword_filter.split(' '));
        var blnumber=-1;
        for (let item of enwords){
            [blxl,blnumber]=enwords_search_one_b(item,csstr,isreg,csword_filter,csword_filter_set,[true,true,true],blxl,times);
            if (blxl==-1){break;}
            if (blnumber!==-1){
                words_temp_equal_arr[blnumber].push(item);
            }
        }
    
        words_temp_arr_global=enwords_merge_b(words_temp_equal_arr,times);
        
        for (let blxl=0,lent=words_temp_arr_global.length;blxl<lent;blxl++){
            learn_something=learn_something+'<a name="word_'+blxl+'"></a>'+one_line_rndwords(words_temp_arr_global[blxl],'',csstr);         
        }
    }

    if (csstr==''){
        var bottom_str='<a href="#" onclick="word_search_rndwords();">刷新</a>';
    } else {
        var bottom_str='<a href="#top">Go Top</a> ';
        if (words_temp_arr_global.length>=times && times<=250){
            bottom_str=bottom_str+'<a href="#word_'+(words_temp_arr_global.length-1)+'" onclick="word_search_rndwords(\'\','+times*2+');">Load More</a>'; //跳转到上次搜索的最后一个单词 - 保留注释
        }
    }
    if (learn_something==''){
        links_rndwords();
    } else {
        document.getElementById('divhtml').innerHTML=learn_something+'<p align=center>'+bottom_str+' ('+enwords.length+') ver: 0.0.5-20200418</p>';
        show_sentence_rndwords();
        document.location.href='#top';
    }
}

function slide_start_rndwords(){
    var odivs=document.querySelectorAll('#div_menu_buttons,#div_exam_buttons,#div_top_bottom');
    var blstop=false;
    for (let one_div of odivs){
        if (one_div.style.display=='none'){
            one_div.style.display='';
            blstop=true;
        } else {
            one_div.style.display='none';
        }
    }
    if (blstop){
        clearInterval(slide_do_rndwords_global);
        slide_no_rndwords_global=0;
    }
}

function slide_one_rndwords(){
    function sub_slide_one_rndwords_plus(){
        slide_no_rndwords_global=slide_no_rndwords_global+1;
        if (slide_no_rndwords_global>=words_temp_arr_global.length){
            slide_no_rndwords_global=0;
        }
    }
    //-----------------------
    if (words_temp_arr_global.length<1){return;}
    
    var bljg=one_line_rndwords(words_temp_arr_global[slide_no_rndwords_global]);
    if (bljg==''){  //遇到 === 等出现空白 - 保留注释
        console.log(words_temp_arr_global[slide_no_rndwords_global]); //此行保留 - 保留注释
        sub_slide_one_rndwords_plus();
        slide_one_rndwords();
        return;
    }
    bljg=bljg+'<p id="p_slide_buttons" style="margin-left:1rem;"><span class="oblong_box" style="cursor:pointer;" onclick="exam_rndwords(true);slide_start_rndwords();this.parentNode.style.display=\'none\';">Stop</span></p>';
    document.getElementById('divhtml').innerHTML=bljg;
    
    show_sentence_rndwords();
    sub_slide_one_rndwords_plus();
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
    word_search_rndwords(blkey);
}
