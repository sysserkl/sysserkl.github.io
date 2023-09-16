function args_enwords_book(){
    var cskeys=href_split_b(location.href);
    var title_setted=false;
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：enwords.htm?s=english& - 保留注释
        //第一次处理 - 保留注释
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();
            if (bltmpstr=='continue'){
                en_words_book_newwords_continue_global=true;
                break;
            }
        }
        //第二次处理 - 保留注释
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();

            if (bltmpstr.substring(0,5)=='book='){
                let list_t=bltmpstr.substring(5,).split('_');    //如book=2_5 - 保留注释
                csbookno_global=Math.min(csbooklist_sub_global_b.length-1,parseInt(list_t[0])-1);
                if (list_t.length>1){
                    csbookno2_global_b=Math.min(csbooklist_sub_global_b.length-1,parseInt(list_t[1])-1);
                }
                title_set_enwords_book();
                title_setted=true;
                show_enwords_book();
                import_book_js_b(true);
                break;
            }
            else if (bltmpstr.substring(0,7)=='allnew='){
                var new_words_str=bltmpstr.substring(7,);
                var otextarea=document.getElementById('textarea_new_words1');
                if (otextarea){
                    otextarea.value=new_words_str;
                }
                in_all_new_enwords_book();
                get_new_words_arr_enbook_b(2);
                show_enwords_book();
                break;
            }
            else if (bltmpstr=='excluded'){
                exclude_enwords_book();
                break;
            }            
        }
    }
    else {
        show_enwords_book();
    }
    if (title_setted==false){
        title_set_enwords_book();
    }
}

function recent_enwords_book(csstr=''){
    recent_search_b('recent_search_enwords_book',csstr,'search_enwords_book','div_recent_search',[],25,false); 
}

function init_enwords_book(){
    words_searched_arr_global=[];
    new_words_form_enwords_book();
    enwords_init_b(true);
    args_enwords_book();
    //---------------
    if (en_words_book_newwords_continue_global===false){
        top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),true,false,2);
        input_with_x_b('input_search_enbook',11);
        recent_enwords_book();
        
        enwords_mini_search_frame_style_b();
        menu_enwords_book();
        enwords_mini_search_frame_form_b();
        
        local_storage_today_b('all_new_words_statistics',40,all_new_words_global.length,'/');
    }    
}

function menu_enwords_book(){
    var str_t=klmenu_hide_b('');
    var str2_t=klmenu_hide_b('#div_new_words2');
    var klmenu1=[
    '<a href="enwords.htm" onclick="'+str_t+'" target=_blank>单词库</a>',
    '<span class="span_menu" onclick="'+str2_t+'get_new_words_arr_enbook_b(4);">旧单词js_wiki格式</span>',
    '<span class="span_menu" onclick="'+str2_t+'show_sentence_enwc_b(3,true);">显示少量例句</span>',
    '<span class="span_menu" onclick="'+str_t+'words_sort_count_enwords_book();">单词数量统计排序</span>',
    '<span class="span_menu" onclick="'+str_t+'txtlistsearch_open_enwords_book();">打开当前电子书</span>',
    ];
    
    if (is_local_b()){
        klmenu1.push('<span class="span_menu" onclick="'+str_t+'onetab_links_enwords_book();">onetab链接</span>');
    }

    var klmenu_new=[];
    var format_list=[
    ['全部','day_new_enwords_book();',true],
    ['过滤','filter_new_enwords_book();',true],
    ];    
    klmenu_new.push(menu_container_b(str_t,format_list,'今日新单词：'));    
    
    klmenu_new=klmenu_new.concat([
    '<span class="span_menu" onclick="'+str_t+'import_enwords_book(\'new\');">导入KLWiki和txtbook全部新单词</span>',   
    '<span class="span_menu" onclick="'+str_t+'max_length_new_enwords_book();">全部新单词中最长的单词</span>',     
    '<span class="span_menu" onclick="'+str_t+'phrase_in_current_enwords_book();">由当前单词组成的词组</span>',     
    ]);

    var format_list=[
    ['例句中','frequency_enwords_book_b(\'sentence_common\');',true],
    ['当前内容','frequency_enwords_book_b(\'textarea\');',true],
    ];    
    klmenu_new.push(menu_container_b(str_t,format_list,'常见单词：'));    
    
    var format_list=[
    ['新单词','import_enwords_book(\'new\',2500);',true],
    ['旧单词释义','import_enwords_book(\'old_def\',2500);',true],
    ['例句','import_enwords_book(\'sentence\',1000);',true],
    ['kaikki phrase','import_enwords_book(\'kaikki phrase\',1000);',true],
    ];    
    klmenu_new.push(menu_container_b(str_t,format_list,'随机导入：'));    

    var format_list=[
    ['导入全部旧单词','import_enwords_book(\'old\');',true],
    ['释义','import_enwords_book(\'old_def\');',true],
    ['全部词组','import_enwords_book(\'phrase\');',true],
    ['非词组','import_enwords_book(\'not_phrase\');',true],
    ['词组中的生词','new_words_in_phrase_enwords_book();',true],
    ];    
    klmenu_new.push(menu_container_b(str_t,format_list,''));    
    
    if (is_local_b()){
        klmenu_new.push('<span class="span_menu" onclick="'+str_t+'onetab_enwords_book();">导入onetab</span>');
    }
        
    format_list=[
    ['高中单词','import_enwords_book(\'senior_high_school\');',true],
    ['CET6单词','import_enwords_book(\'cet6\');',true],
    ];    
    klmenu_new.push(menu_container_b(str_t,format_list,'导入'));    
    
    var cache_type_list=['','随机','旧单词在前','单词数','标题和链接长度','标题首字母','稀有度','一对多','包含'];
    for (let blxl=0;blxl<cache_type_list.length;blxl++){
        cache_type_list[blxl]='<option>'+cache_type_list[blxl]+'</option>';
    }
    
    var klmenu2=[
    '<a href="?book=1&continue" onclick="'+str_t+'">批量统计生词</a>',
    '<span class="span_menu" onclick="'+str_t+'news_words_statistics_enwords_book();">显示统计结果</span>',
    '<span class="span_menu" onclick="'+str_t+'compare_form_statistics_enwords_book();">比较统计数据</span>',
    '<span class="span_menu" onclick="'+str_t+'exclude_enwords_book();">电子书中未包含的旧单词</span>',    

    ];
    if (is_local_b()){
        klmenu2.push('<span class="span_menu" onclick="'+str_t+'klwiki_link_b(\'英语书籍生词统计\',true);">英语书籍生词统计(KLWiki)</span>');
    }

    var klmenu_link=[
    '<a href="ensentence.htm" onclick="'+str_t+'" target=_blank>ensentence</a>',
    ];
    
    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'space2underline_enwords_book();">替换单词间空格为下划线</span> ',  
    '<span class="span_menu" onclick="'+str_t+'character2space_enwords_book(\'_\',\'下划线\');">替换下划线为空格</span> ',  
    '<span class="span_menu" onclick="'+str_t+'character2space_enwords_book(\'-\',\'连字符\');">替换连字符为空格</span> ',  
    ];
    
    var menus=klmenu_b(klmenu1,'','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_new,'🔤','28rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'🧮','16rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem');
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(menus,'','0rem')+' ');
}

function phrase_in_current_enwords_book(){
    var blstr=document.getElementById('textarea_new_words1').value;
    if (blstr.trim()==''){return;}
    var words_set=new Set(blstr.replace(/\s+/mg,' ').split(' '));
    var result_t=new Set();
    for (let aword of enwords){
        if (aword[0].includes('-') || aword[0].includes(' ')){
            var phrase_words=aword[0].replace(/\s+/mg,' ').split(' ');
            var blfound=true;
            for (let item of phrase_words){
                if (!words_set.has(item)){
                    blfound=false;
                    break;
                }
            }
            if (blfound){
                result_t.add(aword[0]);
            }
        }
    }    
    
    var bljg=new_old_words_html_enbook_b(result_t,'由当前单词组成的词组');
    document.getElementById('div_new_words2').innerHTML=bljg;
}

function new_words_form_enwords_book(){
    var bljg='<p>第一组</p>';
    bljg=bljg+'<textarea id="textarea_new_words1"></textarea>';
    bljg=bljg+'<p>单词：';
    bljg=bljg+'<span class="aclick" onclick="get_new_words_arr_enbook_b(1);">全部</span> ';
    bljg=bljg+'<span class="aclick" onclick="get_new_words_arr_enbook_b(2);">新</span> ';
    bljg=bljg+'<span class="aclick" onclick="get_new_words_arr_enbook_b(3);">旧</span> ';

    bljg=bljg+'<span class="aclick" onclick="in_all_new_enwords_book(\'include\');">已在全部新单词中的新单词</span> ';        
    bljg=bljg+'<span class="aclick" onclick="in_all_new_enwords_book();">不在全部新单词中的新单词</span> ';    
    bljg=bljg+'<span class="aclick" onclick="in_rare_words_enwords_book();">稀有旧单词</span> ';    

    bljg=bljg+'<span class="aclick" onclick="textarea_shift_b(\'textarea_new_words1\',\'textarea_new_words2\');">对调</span> ';    
    bljg=bljg+'<span class="aclick" onclick="filter_key_enwords_book();">Filter</span> ';
    bljg=bljg+textarea_buttons_b('textarea_new_words1','清空,复制');

    bljg=bljg+'<br />'+checkbox_kl_b('remove_square','删除方括号[](否则方括号中的内容视为音标而不收录')+' ';
    bljg=bljg+checkbox_kl_b('words_type_check','检验单词类型','',true)+' ';    
    bljg=bljg+' <span id="span_book_lines_count"></span>';
    bljg=bljg+' 前：<input type="text" id="input_first_lines" value="10%">行 <span class="aclick" onclick="textarea_first_lines_enwords_book();">截取</span>';   
    bljg=bljg+'</p>';
    bljg=bljg+'<p>第二组</p>';
    bljg=bljg+'<textarea id="textarea_new_words2"></textarea>';
    bljg=bljg+'<p><span class="aclick" onclick="get_new_words_group_enwords_book();">分组比较(无扩展)</span> ';
    bljg=bljg+'<span class="aclick" onclick="words_check_by_lines_enwords_book();">单词逐行搜索</span> ';    
    bljg=bljg+textarea_buttons_b('textarea_new_words2','清空,复制');

    bljg=bljg+'<span class="aclick" onclick="show_all_books_global=!show_all_books_global;show_enwords_book();">Books</span> ';        
    bljg=bljg+'<span><span id=booklinks></span></p>';

    bljg=bljg+'<p>digest_global</p>';
    bljg=bljg+'<textarea id="textarea_new_words3"></textarea>';
    bljg=bljg+'<p><span class="aclick" onclick="import_to_digest_global_enwords_book();">导入</span></p>';

    bljg=bljg+'<p>结果：</p><div id="div_new_words2" style="max-width:900px;font-family:Noto Sans;"></div>';
    document.getElementById('divhtml').innerHTML=bljg;
    
    input_size_b([['input_first_lines',5]],'id');
}

function import_to_digest_global_enwords_book(){
    var blstr=document.getElementById('textarea_new_words3').value.trim();
    if (blstr==''){
        var list_t=[];
    }
    else {
        var list_t=blstr.split('\n');
    }
    if (!confirm('是否修改 digest_global 变量值为 '+list_t.length+' 行单词？')){return;}
    digest_global=[];
    for (let item of list_t){
        digest_global.push('*'+item);
    }
}

function words_check_by_lines_enwords_book(){
    var blstr=document.getElementById('textarea_new_words1').value.trim();
    var word_list=new Set(document.getElementById('textarea_new_words2').value.trim().split('\n'));
    var digest_words=digest_get_enwords_b(true,true);
    var result_t=new Set();
    for (let aword of word_list){
        if (digest_words.has(aword.toLowerCase())){continue;}
        if (blstr.match(new RegExp('\\b'+aword+'\\b','i'))!==null){
            result_t.add(aword);
        }
    }
    var bljg=new_old_words_html_enbook_b(result_t,'包含的单词列表','',false);
    document.getElementById('div_new_words2').innerHTML=bljg+enwords_different_types_div_b(Array.from(result_t));
}

function txtlistsearch_open_enwords_book(){
    var blpath=klbase_sele_path_b()[1]+('/html/txtlistsearch.htm');
    if (csbookno_global>=0){
        blpath=blpath+'?'+csbooklist_sub_global_b[csbookno_global][0]+'&line=1';
    }
    window.open(blpath);
}

function search_enwords_book(cskey=false){
    var oinput=document.getElementById('input_search_enbook');
    if (cskey===false){
        cskey=oinput.value.trim();
    }
    oinput.value=cskey;

    recent_enwords_book(cskey);
    var isreg=false;
    [cskey,isreg]=str_reg_check_b(cskey,isreg,true);        
    
    var bltype=document.getElementById('select_search_type_enbook').value;
    var blarr=false;
    switch (bltype){
        case 'kaikki phrase':
            blarr=kaikki_phrase_global;
            break;
        case '全部新单词':
            blarr=all_new_words_global;
            break;
    }
    if (blarr===false){return;}
    
    var result_t=common_search_b(cskey,isreg,blarr,1000)[0];
    for (let blxl=0;blxl<result_t.length;blxl++){
        result_t[blxl]=result_t[blxl][0].replace(/\s/g,'_');
    }
    document.getElementById('textarea_new_words1').value=result_t.join('\n');
}

function get_new_words_group_enwords_book(cstype){
	var str1=document.getElementById('textarea_new_words1').value.trim();
	if (str1==''){return;}

	var str2=document.getElementById('textarea_new_words2').value.trim();
	if (str2==''){return;}

    var list1_t=str_2_array_enbook_b(str1);
    var list2_t=str_2_array_enbook_b(str2);
    var union_t=array_union_b(list1_t,list2_t,true);
    var inter_t=array_intersection_b(list1_t,list2_t,true);
    var diff1_t=array_difference_b(list1_t,list2_t,true);
    var diff2_t=array_difference_b(list2_t,list1_t,true);
    
    var alink='<a class="a_oblong_box" href="#get_new_words_group_enbook_5">第一组含有但第二组没有的单词</a> ';
    alink=alink+'<a class="a_oblong_box" href="#get_new_words_group_enbook_6">第二组含有但第一组没有的单词</a>';
    
	var bljg='';
    bljg=bljg+new_old_words_html_enbook_b(list1_t,'第一组单词量','group1',true);
    bljg=bljg+new_old_words_html_enbook_b(list2_t,'第二组单词量','group2',true);
    bljg=bljg+new_old_words_html_enbook_b(union_t,'两组合计单词量','group_union',true);
    bljg=bljg+new_old_words_html_enbook_b(inter_t,'两组单词交集','group_intersection');
    bljg=bljg+new_old_words_html_enbook_b(diff1_t,'第一组含有但第二组没有的单词','get_new_words_group_enbook_5');
    bljg=bljg+new_old_words_html_enbook_b(diff2_t,'第二组含有但第一组没有的单词','get_new_words_group_enbook_6');
    
	document.getElementById('div_new_words2').innerHTML='<p>'+alink+'</p>'+bljg;
}

function compare_form_statistics_enwords_book(){
    var bljg='<table width=95% height=600px>';
    bljg=bljg+'<tr><td width=50% valign=top><textarea id="textarea_compare_1" style="width:100%;height:100%;"></textarea><p><span class="aclick" onclick="current_statistics_data_enwords_book(\'1\',false);">旧数据</span></p></td>';
    bljg=bljg+'<td width=50% valign=top><textarea id="textarea_compare_2" style="width:100%;height:100%;"></textarea><p><span class="aclick" onclick="current_statistics_data_enwords_book(\'2\',true);">新数据</span></p></td></tr>';
    bljg=bljg+'<tr><td colspan=2 align=right><span class="aclick" onclick="compare_statistics_enwords_book();">比较</span>'+close_button_b('divhtml2','')+'</p></tr>';
    bljg=bljg+'<tr><td colspan=2 valign=top id="td_result" style="padding:1rem;"></tr>';    
    bljg=bljg+'</table>';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
}

function new_words_in_phrase_enwords_book(){
    var t0 = performance.now();

    var old_words=simple_words_b();
    var result_t=new Set();
    for (let aword of old_words){
        if (aword.includes('-')){
            aword.replace(/\-/g,' ');
        }
        if (!aword.includes(' ')){continue;}
        var list_t=aword.split(' ');
        for (let item of list_t){
            if (old_words.has(item) || old_words.has(item.toLowerCase())){continue;}
            result_t.add(item);
        }
    }
    document.getElementById('textarea_new_words1').value=Array.from(result_t);
    console.log('new_words_in_phrase_enwords_book() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function import_enwords_book(cstype,csmax=-1){
    var ospan=document.getElementById('span_progress_enbook');
    ospan.innerHTML='';
    var otextarea=document.getElementById('textarea_new_words1');
    switch (cstype){
        case 'new':
            if (csmax>0){
                var words_t=[].concat(all_new_words_global);
                var bltotal_t=Math.floor((Math.random()*10)+1);
                for (let blxl=0;blxl<bltotal_t;blxl++){
                    words_t.sort(randomsort_b);
                }
                otextarea.value=words_t.slice(0,csmax).join(' ');
            }
            else {
                otextarea.value=all_new_words_global.join(' ');            
            }
            break;    
        case 'old':
        case 'old_def':
            var result_t=[];
            var blno=(cstype=='old'?0:2);
            for (let item of enwords){
                result_t.push(item[blno]);
            }
            if (csmax>0){
                result_t.sort(randomsort_b);
                result_t=result_t.slice(0,csmax);
            }
            otextarea.value=result_t.join('\n');
            break;
        case 'phrase':
            var result_t=[];        
            for (let item of enwords){    
                if (item[0].includes(' ') || item[0].includes('-')){
                    result_t.push(item[0]);
                }    
            }
            otextarea.value=result_t.join('\n');            
            break;        
        case 'not_phrase':
            var result_t=[];        
            for (let item of enwords){    
                if (!item[0].includes(' ') && !item[0].includes('-')){
                    result_t.push(item[0]);
                }    
            }
            otextarea.value=result_t.join('\n');            
            break;
        case 'sentence':
            var list_t=array_numbers_b(Math.min(csmax,en_sentence_global.length),Math.floor((Math.random()*10)+1));

            var result_t=[];
            for (let item of list_t){
                result_t.push(en_sentence_global[item]);
            }
            otextarea.value=result_t.join('\n\n');
            break;
        case 'senior_high_school':
            otextarea.value=senior_high_school_en_global.join('\n');        
            break;
        case 'cet6':
            otextarea.value=cet6_en_global.join('\n');     
            var progress_list=ltp_status_get_b('+生词 +CET6','pink','white',100);
            ospan.innerHTML=progress_list.join(' ');   
            break;   
        case 'kaikki phrase':
            kaikki_phrase_global.sort(randomsort_b);
            otextarea.value=kaikki_phrase_global.slice(0,1000).join('\n').replace(/ /g,'_');
            break;
    }
}

function max_length_new_enwords_book(){
    var list_t=[].concat(all_new_words_global);
    list_t.sort(function (a,b){return a.length<b.length;});
    list_t=list_t.slice(0,100);
    if (list_t.length==0){return;}
    document.getElementById('textarea_new_words1').value='最长('+list_t[0].length+'-'+list_t.slice(-1)[0].length+')的 '+list_t.length+' 个单词：\n'+list_t.join('\n');
}

function filter_new_enwords_book(){
    day_new_enwords_book(true);
    get_new_words_arr_enbook_b(2);
}

function in_rare_words_enwords_book(){    
    var csstr=document.getElementById('textarea_new_words1').value.trim();
    
    var bljgarr2=str_2_array_enbook_b(csstr);
    var old_words_set=new_old_word_list_enbook_b(bljgarr2,checkbox_kl_value_b('words_type_check'))[1];
    
    var result_t_include=[];
    for (let item of old_words_set){
        if (en_sentence_count_global.includes(item) || en_sentence_count_global.includes(item.toLowerCase())){
            result_t_include.push(item);
        }
    }
    var bljg='稀有旧单词：'+result_t_include.join(' ')+'\n';
    document.getElementById('textarea_new_words2').value=bljg;    
}

function title_set_enwords_book(){
    var bltitle='生词统计';
    if (csbookno_global>=0 && csbookno_global<csbooklist_sub_global_b.length){
        bltitle=bltitle+' - '+csbooklist_sub_global_b[csbookno_global][1];
    }
    if (csbookno2_global_b>=0 && csbookno2_global_b<csbooklist_sub_global_b.length){
        bltitle=bltitle+' - '+csbooklist_sub_global_b[csbookno2_global_b][1];
    }    
    
    if (en_words_book_newwords_continue_global){
        bltitle=(csbookno_global+1)+'/'+csbooklist_sub_global_b.length+' - '+bltitle;    
    }

    document.title=bltitle;
    localStorage.setItem('enbook_title_name',bltitle);
}

function compare_statistics_enwords_book(){
    function sub_compare_statistics_enwords_book_get_list(cslist){
        for (let blxl=0;blxl<cslist.length;blxl++){
            var item=cslist[blxl];
            var list_temp=item.split(' /// ');
            //形如 24tian_tu_po_gao_kao_dgch3cc_343788 /// 24天突破高考大纲词汇3500(陈灿) /// 2426 - 保留注释
            if (list_temp.length<3){
                cslist[blxl]=['','',0,0];
            }
            else if (list_temp.length<4){
                cslist[blxl]=[list_temp[0].trim(),list_temp[1].trim(),parseInt(list_temp[2].trim()),0];
            }            
            else {
                cslist[blxl]=[list_temp[0].trim(),list_temp[1].trim(),parseInt(list_temp[2].trim()),parseInt(list_temp[3].trim())];
            }
        }
        return cslist;
    }
    var list1=document.getElementById('textarea_compare_1').value.trim().split('\n');
    var list2=document.getElementById('textarea_compare_2').value.trim().split('\n');
    
    list1=sub_compare_statistics_enwords_book_get_list(list1);
    list2=sub_compare_statistics_enwords_book_get_list(list2);
    
    enbook_compare_result_list_global=[];
    for (let item2 of list2){
        var bookid=item2[0];
        if (bookid==''){continue;}
        var blfound=false;
        for (let item1 of list1){
            if (item1[0]==bookid){
                enbook_compare_result_list_global.push([bookid,item2[1],item1[2],item2[2],item2[2]-item1[2],item1[3],item2[3],item2[3]-item1[3]]);
                blfound=true;
                break;
            }
        }
        if (!blfound){
            enbook_compare_result_list_global.push([bookid,item2[1],'',item2[2],'--','',item2[3],'--']);
        }
    }
    compare_result_list_to_table_enwords_book();
}

function compare_result_list_to_table_enwords_book(sortno=4){
    if (enbook_compare_result_list_sort_order_global){
        enbook_compare_result_list_global.sort(function (a,b){
            if (sortno>=2){
                if (isNaN(a[sortno])){return 1;}
                if (isNaN(b[sortno])){return 0;}
            }
            return a[sortno]>b[sortno];
        });   
    }
    else {
        enbook_compare_result_list_global.sort(function (a,b){
            if (sortno>=2){
                if (isNaN(a[sortno])){return 0;}
                if (isNaN(b[sortno])){return 1;}
            }
            return a[sortno]<b[sortno];
        });   
    }
    enbook_compare_result_list_sort_order_global=!enbook_compare_result_list_sort_order_global;
    
    var tdstyle='style="padding:0.5rem;border-bottom:0.1rem solid '+scheme_global['color']+';"';
    var thstyle='style="cursor:pointer;padding:0.5rem;border-bottom:0.2rem solid '+scheme_global['color']+';"';
    var bljg='<table id="table_compare" cellpadding=0 cellspacing=0 align=center>';
    bljg=bljg+'<tr>';
    bljg=bljg+'<th '+thstyle+'>No.</th>';
    bljg=bljg+'<th '+thstyle+' onclick="compare_result_list_to_table_enwords_book(1);">书名</th>';
    bljg=bljg+'<th '+thstyle+' onclick="compare_result_list_to_table_enwords_book(2);">Data1</th>';
    bljg=bljg+'<th '+thstyle+' onclick="compare_result_list_to_table_enwords_book(3);">Data2</th>';
    bljg=bljg+'<th '+thstyle+' onclick="compare_result_list_to_table_enwords_book(4);">Δ</th>';
    bljg=bljg+'<th '+thstyle+' onclick="compare_result_list_to_table_enwords_book(5);">Data1(10%)</th>';
    bljg=bljg+'<th '+thstyle+' onclick="compare_result_list_to_table_enwords_book(6);">Data2(10%)</th>';
    bljg=bljg+'<th '+thstyle+' onclick="compare_result_list_to_table_enwords_book(7);">Δ</th>';    
    bljg=bljg+'</tr>';
    var blno=1;
    for (let item of enbook_compare_result_list_global){
        bljg=bljg+'<tr>';
        bljg=bljg+'<td '+tdstyle+'>'+blno+'</td>';
        bljg=bljg+'<td '+tdstyle+'>'+item[1]+'</td>';
        for (let blxl=2;blxl<=7;blxl++){
            bljg=bljg+'<td align=right '+tdstyle+'>'+item[blxl]+'</td>';
        } 
        bljg=bljg+'</tr>';
        blno=blno+1;
    }
    bljg=bljg+'</table>';
    
    var progress_list=ltp_status_get_b('+George +生词','purple','white',100);
    document.getElementById('td_result').innerHTML='<p>'+progress_list.join(' ')+'</p>'+bljg;
}

function current_statistics_data_enwords_book(csid,iscurrent){
    var blresult=all_new_words_count_get_enbook_b(iscurrent,false);
    document.getElementById('textarea_compare_'+csid).value=blresult;
}

function day_new_enwords_book(do_filter=false){
    //var days=day_of_year_b();   //当年第几天，此行保留 - 保留注释
    var days=date_2_ymd_b(false,'d');
    
    var result_t=[];
    for (let item of all_new_words_global){
        if (do_filter){
            if (item.length==1 || item.length>15){continue;}
            if (item.split('-').length>=2){continue;}
            if (item.substring(0,1)!==item.substring(0,1).toLowerCase()){continue;} //首字母大写 - 保留注释
        }
        if ((1+asc_sum_b(item)%31)==days){  //原本365 - 保留注释
            result_t.push(item);
        }
    }
    document.getElementById('textarea_new_words1').value=result_t.join(' ');    
    return result_t;
}

function in_all_new_enwords_book(cstype='exclude'){
    var csstr=document.getElementById('textarea_new_words1').value.trim();
    
    var bljgarr2=str_2_array_enbook_b(csstr);
    var new_words_set=new_old_word_list_enbook_b(bljgarr2,checkbox_kl_value_b('words_type_check'))[0];
    
    var result_t_include=[];
    var result_t_exclude=[];
    for (let item of new_words_set){
        if (all_new_words_global.includes(item) || all_new_words_global.includes(item.toLowerCase())){
            result_t_include.push(item);
        }
        else {
            result_t_exclude.push(item);        
        }
    }
    var bljg='';
    if (cstype=='' || cstype=='include'){
        bljg=bljg+'已在新单词库中的新单词：'+result_t_include.join(' ')+'\n';
    }
    if (cstype=='' || cstype=='exclude'){
        bljg=bljg+'不在新单词库中的新单词：'+result_t_exclude.join(' ')+'\n';
    }
    document.getElementById('textarea_new_words2').value=bljg;
}

function words_sort_count_enwords_book(){
    var csstr=document.getElementById('textarea_new_words1').value;
    var list_t=csstr.match(/\b[a-zA-Z_']+\b/g) || [];
    list_t.sort();
    var bljg=[];
    for (let item of list_t){
        if (item.trim()==''){continue;}
        
        if (bljg[item]==undefined){
            bljg[item]=[item,0];
        }
        bljg[item][1]=bljg[item][1]+1;
    }
    var bljg2=object2array_b(bljg);
    bljg2.sort(function (a,b){return b[1]>a[1];});
    document.getElementById('textarea_new_words2').value=bljg2.join(' ')+'\n已截取\n';
}

function show_enwords_book(){
    var bltag='englishwords en_minor';
    books_b(show_all_books_global,'eng',bltag);
}

function space2underline_enwords_book(){
    if (confirm('是否替换单词间空格为下划线？')==false){return;}
    var otextarea=document.getElementById('textarea_new_words1');
    var blstr=otextarea.value.trim();
    while (true){   //考虑 get a grip 等形式 - 保留注释
        if (blstr.match(/([a-z]) +([a-z])/)==null){break;}
        blstr=blstr.replace(/([a-z]) +([a-z])/ig,'$1_$2'); 
    }
    otextarea.value=blstr;
}

function character2space_enwords_book(cscharacter,cscaption){
    if (confirm('是否替换'+cscaption+'为空格？')==false){return;}
    var otextarea=document.getElementById('textarea_new_words1');
    var blstr=otextarea.value.trim();
    blstr=blstr.replace(new RegExp(cscharacter,'g'),' '); 
    otextarea.value=blstr;
}

function filter_key_enwords_book(){
    var blstr=document.getElementById('textarea_new_words1').value.trim();
    if (blstr==''){return;}
    var blkey=prompt('输入筛选关键字：') || '';
    if (blkey==''){return;}
    
    var is_reg=false;
    if (blkey.slice(-4,)=='(:r)'){
        blkey=blkey.slice(0,-4);
        is_reg=true;
    }
    var result_t=new Set();
    var list_t=blstr.split(' ');
    for (let item of list_t){
		var blfound=str_reg_search_b(item,blkey,is_reg);
		if (blfound==-1){break;}        
        if (blfound){
            result_t.add(item);
        }
    }
    var otextarea2=document.getElementById('textarea_new_words2');
    otextarea2.value=Array.from(result_t).join(' ');
}

function textarea_first_lines_enwords_book(){
    var otextarea=document.getElementById('textarea_new_words1');
    if (otextarea){
        var bljg=otextarea.value;
        if (bljg.includes('\n已截取\n')){return;}
        
        var list_t=bljg.trim().split('\n');
        var blpercent=document.getElementById('input_first_lines').value.trim();
        if (blpercent.slice(-1)=='%'){
            blpercent=parseFloat(blpercent.slice(0,-1))/100;
        }
        else {
            blpercent=parseInt(blpercent);
        }
        if (blpercent<1){
            blpercent=list_t.length*blpercent;
        }
        blpercent=Math.max(0,parseInt(blpercent));
        list_t=list_t.slice(0,blpercent);
        otextarea.value=list_t.join('\n')+'\n已截取\n';
        document.getElementById('span_book_lines_count').innerHTML='共有 '+list_t.length+' 行';
    }
}

function onetab_enwords_book(){
    var result_t=new Set();
    for (let item of onetab_global){
        result_t.add(item[1].trim());
    }
    result_t=Array.from(result_t);
    result_t.sort();
    document.getElementById('textarea_new_words1').value=result_t.join('\n');
}

function onetab_filter_enwords_book(){
    olis=document.querySelectorAll('#ol_onetab_links li');
    obj_search_show_hide_b(olis,'',document.getElementById('input_filter_ontab').value,false,true);
}

function onetab_links_enwords_book(){
    var result_t=new Set();
    for (let item of onetab_global){
        result_t.add('<a href="'+item[0]+'" target=_blank>'+item[1]+'</a>');
    }
    result_t=Array.from(result_t);
    result_t.sort();    
    var blbuttons='<p><input type="text" id="input_filter_ontab" placeholder="filter" onkeyup="if (event.key==\'Enter\'){onetab_filter_enwords_book();}" /></p>';
    document.getElementById('div_new_words2').innerHTML=blbuttons+array_2_li_b(result_t,'li','ol','ol_onetab_links');
    input_with_x_b('input_filter_ontab',11);    
}

function exclude_enwords_book(){
    var list_t=local_storage_get_b('txt_englishwords_excluded',-1,true);
    var bookname='';
    var bljg='';
    var bltotal=0;
    var blno=0;
    var bookno=0;
    var blwords='';
    var textarea_value=[];
    var book_search=(klwebphp_path_b()===false?'book_search_js.htm':'../../../../book_search.php');
    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl].split(' /// ');
        if (item.length<2){continue;}
        if (bookname!==item[0]){
            bookno=bookno+1;
            if (blwords!==''){
                bljg=bljg+'<p>'+blwords+'</p>';
                bljg=bljg+'<p><textarea>'+textarea_value.join('\n')+'</textarea></p>';
            }
            
            blwords='';
            textarea_value=[];
            bljg=bljg+'<h3>'+bookno+'. <a href="txtlistsearch.htm?'+encodeURIComponent(item[0]+'&s='+item[1])+'" target=_blank>'+item[0]+'</a></h3>';
            bookname=item[0];
            blno=0;
        }
        blno=blno+1;
        bltotal=bltotal+1;
        blwords=blwords+blno+'. <a href="'+book_search+'?s='+encodeURIComponent(item[1])+'&eng" target=_blank>'+item[1]+'</a> ';
        textarea_value.push(item[1]);
    }
    if (blwords!==''){
        bljg=bljg+'<p>'+blwords+'</p>';
        bljg=bljg+'<p><textarea>'+textarea_value.join('\n')+'</textarea></p>';        
    }
    bljg=bljg+'<p style="margin-top:1rem;"><a class="aclick" href="txtlistsearch.htm?_tagenglishwords&sc=batch_refresh_'+Math.round((Math.random()*99999))+'" target=_blank>批量刷新</a> 全部：'+bltotal+'</p>';   //batch_refresh_ 是随意的无意义的搜索关键词 - 保留注释
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
}

function news_words_statistics_enwords_book(){
    var blresult=all_new_words_count_get_enbook_b(true,true);
    var odiv=document.getElementById('div_new_words2');
    odiv.innerHTML=array_2_li_b(blresult);
    odiv.scrollIntoView();
}

function import_filelist_enwords_book(){
    if (filelist!==null && filelist.length>0){
        var bljg=filelist.join('\n');
        var otextarea_t=document.getElementById('textarea_new_words1')
        if (otextarea_t){
            otextarea_t.value=bljg;
            document.getElementById('span_book_lines_count').innerHTML='共有 '+bljg.trim().split('\n').length+' 行';
        }
        filelist=[];
    }
    if (filelist2!==null && filelist2.length>0){
        var bljg=filelist2.join('\n');
        var otextarea_t=document.getElementById('textarea_new_words2')
        if (otextarea_t){
            otextarea_t.value=bljg;
        }    
        filelist2=[];
    }
}
