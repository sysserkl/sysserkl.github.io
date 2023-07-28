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

function init_enwords_book(){
    new_words_form_enwords_book();
    enwords_init_b(true);
    args_enwords_book();
    //---------------
    if (en_words_book_newwords_continue_global===false){
        top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),true,false,2);

        enwords_mini_search_frame_style_b();
        menu_enwords_book();
        enwords_mini_search_frame_form_b();
        
        local_storage_today_b('all_new_words_statistics',40,all_new_words_global.length,'/');

    }    
    enwords_selenium_scan_global.sort(function (a,b){return a[2]>b[2];});
}

function menu_enwords_book(){
    var str_t=klmenu_hide_b('');
    var str2_t=klmenu_hide_b('#div_new_words2');
    var klmenu1=[
    '<a href="enwords.htm" onclick="'+str_t+'" target=_blank>单词库</a>',
    '<span class="span_menu" onclick="'+str2_t+'get_new_words_arr_enbook_b(4);">旧单词js_wiki格式</span>',
    '<span class="span_menu" onclick="'+str2_t+'show_sentence_enwc_b(3,true);">显示少量例句</span>',
    '<span class="span_menu" onclick="'+str_t+'words_sort_count_enwords_book();">单词数量统计排序</span>',
    '<span class="span_menu" onclick="'+str_t+'txtlistsearch_enwords_book();">打开当前电子书</span>',
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
    ]);

    var format_list=[
    ['例句中','frequency_enwords_book(\'sentence_common\');',true],
    ['当前内容','frequency_enwords_book(\'textarea\');',true],
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
    
    var klmenu_selenium=[
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book();">selenium新词</span>',
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book(true);">selenium新词(缓存)</span>',
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book(true,\'random\');">selenium新词(缓存随机)</span>',    
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book(true,\'old\');">selenium新词(缓存旧单词在前)</span>',    
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book(true,\'count\');">selenium新词(缓存单词数)</span>',    
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book(true,\'length\');">selenium新词(缓存标题和链接长度)</span>',    
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book(true,\'title\');">selenium新词(标题)</span>',        
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_enwords_book(true,\'rare\');">selenium新词(缓存稀有度)</span>',
    '<span class="span_menu" onclick="'+str2_t+'selenium_one2more_enwords_book();">selenium新词(缓存一对多)</span>',        
    '<span class="span_menu" onclick="'+str2_t+'selenium_contain_enwords_book();">selenium新词(缓存包含)</span>',        
    '<span class="span_menu" onclick="'+str2_t+'selenium_list_popular_enwords_book();">selenium常见新词(缓存)</span>',    
    '<a href="lsm.htm?key=selenium_enbook" onclick="'+str_t+'" target=_blank>查看缓存</a>',
    ];
    
    var group_list=[
    ['第1个','selenium_words_count_more_than_one_line_enword_book();',true],
    ['第2个','selenium_words_count_more_than_one_line_enword_book(2);',true],
    ['最后一个','selenium_words_count_more_than_one_line_enword_book(-1);',true],
    ];    
    klmenu_selenium.push(menu_container_b(str_t,group_list,'非单一单词行：'));        
    
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
    
    var menus=klmenu_b(klmenu1,'','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_new,'🔤','28rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'🧮','16rem','1rem','1rem','60rem')+(is_local_b()?klmenu_b(klmenu_selenium,'📰','20rem','1rem','1rem','60rem'):'')+klmenu_b(klmenu_link,'L','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem');
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(menus,'','0rem')+' ');
    
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

function txtlistsearch_enwords_book(){
    var blpath=klbase_sele_path_b()[1]+('/html/txtlistsearch.htm');
    if (csbookno_global>=0){
        blpath=blpath+'?'+csbooklist_sub_global_b[csbookno_global][0]+'&line=1';
    }
    window.open(blpath);
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

function selenium_list_popular_enwords_book(){
    var cached_list=selenium_local_storage_get_enwords_book();
    var word_list={};
    for (let arow of cached_list){
        var list_t=arow[3].split(' ');
        for (let aword of list_t){
            if (word_list[aword]==undefined){
                word_list[aword]=0;
            }
            word_list[aword]=word_list[aword]+1;
        }
    }
    word_list=object2array_b(word_list,true);
    word_list.sort(function (a,b){return a[1]<b[1];});

    var oldset=simple_words_b();
    var result_t=[];
    var blxl=0;
    for (let item of word_list){
        if (oldset.has(item[0])){continue;}

        if (item[1]>1){
            result_t.push(item[0]);
        }
        blxl=blxl+1;
    }
    document.getElementById('textarea_new_words1').value=result_t.join(' ');
    document.getElementById('textarea_new_words2').value='共有新单词 '+blxl+' 个';
    local_storage_today_b('enwords_selenium_new_words',40,blxl,'/');
    get_new_words_arr_enbook_b(2);
}

function selenium_count_one_enword_book(odom){
    var oword=odom.parentNode.querySelector('span.a_word');
    if (!oword){return;}
    var blword=oword.innerText;
    var blold=odom.innerText.split('(')[0].split('.')[0];
    var owords=document.querySelectorAll('div#div_new_words2 span.a_word');
    var blcount=0;
    for (let aword of owords){
        if (aword.innerText==blword){
            blcount=blcount+1;
            if (blcount>5){
                blcount='5+';
                break;
            }
        }
    }
    odom.innerText=blold+'('+(blcount==1?'𝟭':blcount)+'). '
}

function selenium_words_count_more_than_one_line_enword_book(csno=1){
    function sub_selenium_words_count_more_than_one_line_enword_book_one_hand(one_div){
        var olist=one_div.querySelector('div.div_word_list_selenium_enbook');
        if (olist.innerText.includes('𝟭')){return false;}
        
        var ohand=one_div.querySelector('span.span_batch_count_enwords_book');
        ohand.click();
        row_count=row_count+1;
        if (row_count>50){
            one_div.scrollIntoView();
            alert('终止运行');
            return true;
        }
            
        if (!olist.innerText.includes('𝟭')){
            found_count=found_count+1;
            if (found_count==csno){
                one_div.scrollIntoView();
                return true;
            }
        }
        return false;
    }
    //------------------
    var t0 = performance.now();
    var found_count=0;
    var row_count=0;
    var odivs=document.querySelectorAll('div.div_h3_selenium_enbook');
    
    if (csno<0){
        csno=-1*csno;
        for (let blxl=odivs.length-1;blxl>0;blxl--){
            var one_div=odivs[blxl];
            if (sub_selenium_words_count_more_than_one_line_enword_book_one_hand(one_div)){break;}
        } 
    }
    else {
        for (let blxl=0;blxl<odivs.length;blxl++){
            var one_div=odivs[blxl];
            if (sub_selenium_words_count_more_than_one_line_enword_book_one_hand(one_div)){break;}
        }
    }
    console.log('selenium_words_count_more_than_one_line_enword_book() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function selenium_contain_enwords_book(){
    var cached_len=selenium_local_storage_get_enwords_book(true).length;

    var enarray=selenium_local_storage_get_enwords_book(false);

    var oldset=simple_words_b();
    var key_name;
    var key_name_no=0;
    enarray.sort(randomsort_b);
    enarray.sort(function (a,b){return a[3].split(' ').length<b[3].split(' ').length;});    //按单词数，由多到少排序 - 保留注释

    var result_t={};
    for (let item of enarray){
        var html='<h3>'+selenium_list_h3_generation_enwords_book(item,true)+'</h3>\n';
        var word_list=item[3].trim().split(' ').sort();
        
        for (let key in result_t){
            key_name=key;
            for (let aword of word_list){
                if (!result_t[key][1].has(aword)){
                    key_name='';
                    break;
                }
            }
            if (key_name!==''){break;}
        }
        if (key_name==''){
            key_name='s_contain_'+key_name_no;
            key_name_no=key_name_no+1;
        }
        
        if (result_t[key_name]==undefined){
            result_t[key_name]=[[],new Set(word_list)];
        }

        var words=enwords_array_to_links_b(word_list,oldset,'selenium_count_one_enword_book').join(' ');        
        result_t[key_name][0].push([selenium_list_container_generation_enwords_book(html,words,word_list.length),word_list.length]);
    }

    var sentence_list=[];
    var list_t=[];
    var bottom_list=[];
    for (let key in result_t){
        sentence_list=result_t[key][0];
        if (sentence_list.length==1){
            bottom_list.push(sentence_list[0][0]);
        }
        else {
            sentence_list.sort(function (a,b){return a[1]<b[1];});
            for (let arow of sentence_list){
                list_t.push(arow[0]);
            }
        }
    }
    bottom_list.sort(randomsort_b);
    var rare_href=bottom_list_href_get_enwords_book(bottom_list);
    selenium_html_enwords_book(list_t.join('\n')+bottom_list.join('\n'),true,cached_len,'Cached');
    selenium_rare_jump_enwords_book(rare_href);
}

function bottom_list_href_get_enwords_book(bottom_list){
    var rare_href='';
    if (bottom_list.length>0){
        rare_href=(bottom_list[0].match(/"(http[^\s]+)"/) || ['',''])[1];
    }
    return rare_href;
}

function selenium_one2more_enwords_book(){
    var cached_len=selenium_local_storage_get_enwords_book(true).length;

    var enarray=selenium_local_storage_get_enwords_book(false);

    var oldset=simple_words_b();
    var key_name;
    var single_set=new Set();
    enarray.sort(randomsort_b);
    enarray.sort(function (a,b){return a[3].split(' ').length>b[3].split(' ').length;});    //按单词数，由少到多排序 - 保留注释
    var result_t={};
    for (let item of enarray){
        var html='<h3>'+selenium_list_h3_generation_enwords_book(item,true)+'</h3>\n';
        var word_list=item[3].trim().split(' ');

        var rand_list=[].concat(word_list).sort(randomsort_b);
        key_name=rand_list[0];
        if (key_name==''){continue;}
        
        for (let aword of word_list){
            if (single_set.has(aword)){
                key_name=aword;
                break;
            }
        }
        single_set.add(key_name);
        
        if (result_t['s_'+key_name]==undefined){ //当 key_name 为 constructor 是，不是 undefined - 保留注释
            result_t['s_'+key_name]=[];
        }
        
        var words=enwords_array_to_links_b(word_list,oldset,'selenium_count_one_enword_book').join(' ');        
        result_t['s_'+key_name].push([selenium_list_container_generation_enwords_book(html,words,word_list.length),word_list.length]);
    }

    var list_t=[];
    var bottom_list=[];
    for (let key in result_t){
        if (result_t[key].length==1){
            bottom_list.push(result_t[key][0][0]);
        }
        else {        
            result_t[key].sort(randomsort_b);    
            result_t[key].sort(function (a,b){return a[1]>b[1];});
            for (let arow of result_t[key]){
                list_t.push(arow[0]);
            }
        }
    }
    
    bottom_list.sort(randomsort_b);    
    var rare_href=bottom_list_href_get_enwords_book(bottom_list);
    selenium_html_enwords_book(list_t.join('\n')+bottom_list.join('\n'),true,cached_len,'Cached');
    selenium_rare_jump_enwords_book(rare_href);
}

function selenium_list_h3_generation_enwords_book(item,use_cache){
    var html='<span class="span_no_selenium_enbook" style="font-weight:normal;'+(use_cache?'background-color:'+scheme_global['skyblue']+';':'')+'"></span>';
    html=html+'<a class="a_black" href="'+item[0]+'" onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';" ondragstart="this.style.backgroundColor=\''+scheme_global['pink']+'\';" target=_blank>'+item[1]+'</a> ';
    html=html+'<span class="span_underline_box" style="color:'+scheme_global['a-hover']+';font-weight:normal;" onclick="selenium_remove_enwords_book(this.parentNode.parentNode);">✗</span> ';
    html=html+'<span class="span_box" style="font-size:0.9rem; font-weight:normal;" onclick="selenium_list_h3_2_fav_enwords_book(this,false);">⚪</span> ';    
    html=html+'<span class="span_box" style="font-weight:normal;" onclick="selenium_list_h3_2_fav_enwords_book(this);">🏷</span>';
    return html;
}

function selenium_list_h3_2_fav_enwords_book(ospan,addtag=true){
    var oa=ospan.parentNode.querySelector('a.a_black');
    fav_add_rlater_b(oa,ospan,addtag,'添加');
}

function selenium_list_container_generation_enwords_book(html,words,cslength=0){
    var blstr='<div  class="div_h3_selenium_enbook">\n'+html+'<div class="div_word_list_selenium_enbook" style="border:0.1rem dotted '+scheme_global['shadow']+';border-radius:1rem;padding:0.5rem;">';
    if (cslength>1){
        blstr=blstr+'<span class="span_box span_batch_count_enwords_book" onclick="selenium_count_batch_enwords_book(this);">👆</span> ';
    }
    else {
        blstr=blstr+'<span class="span_box span_batch_count_enwords_book" onclick="selenium_count_batch_enwords_book(this);" style="display:none;">👆</span> ';    
    }
    blstr=blstr+words+'</div>\n</div>';
    return blstr;
}

function selenium_count_batch_enwords_book(ospan){
    var osmalls=ospan.parentNode.querySelectorAll('span.span_word_combination_enword small.small_enword_no_b');
    for (let one_small of osmalls){
        selenium_count_one_enword_book(one_small);
    }
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

function rare_word_count_enwords_book(cslist,rare_dict){
    var blcount_set=new Set();
    for (let aword of cslist){
        if (rare_dict['w_'+aword]==undefined){continue;}
        blcount_set.add(rare_dict['w_'+aword]);
    }
    if (blcount_set.size>0){
        return Math.min(...blcount_set);
    }
    return 0;
}

function selenium_list_enwords_book(use_cache=false,cstype=''){
    function sub_selenium_list_enwords_book_watershed(cslist,colno,csvalue=1){
        var rare_href='';
        for (let item of cslist){
            if (item[colno]==csvalue){
                rare_href=(item[0].match(/"(http[^\s]+)"/) || ['',''])[1];
                break;
            }
        }    
        return rare_href;
    }
    //-------------------------
    var result_t={};
    var cached_list=selenium_local_storage_get_enwords_book(true);
    
    if (use_cache){
        var enarray=[['Cached','','','']].concat(selenium_local_storage_get_enwords_book(false));
    }
    else {
        var enarray=enwords_selenium_scan_global;
    }

    var oldset=simple_words_b();
    var theday='';
    var bllinks,old_count;
    
    var rare_dict={};
    if (cstype=='rare'){
        for (let item of enarray){
            var word_list=item[3].split(' ');
            for (let one_word of word_list){
                var blkey='w_'+one_word;
                if (rare_dict[blkey]==undefined){
                    rare_dict[blkey]=0;
                }
                rare_dict[blkey]=rare_dict[blkey]+1;
            }
        }
    }
    
    for (let item of enarray){
        if (item[1]=='' && item[2]=='' && item[3]==''){
            theday=item[0];
            continue;
        }

        var html='<h3>'+selenium_list_h3_generation_enwords_book(item,use_cache);
        if (use_cache==false && cached_list.includes(item[0])){
            html=html+' ⚓';
        }
        html=html+'</h3>\n';
        var word_list=item[3].split(' ');
        [bllinks,old_count]=enwords_array_to_links_b(word_list,oldset,'selenium_count_one_enword_book',true);
        var words=bllinks.join(' ');
        if (result_t['k_'+item[2]]==undefined){
            result_t['k_'+item[2]]=[];
        }
        
        var blstr=selenium_list_container_generation_enwords_book(html,words,word_list.length);
        
        var blrare_count=0;
        if (cstype=='rare'){
            blrare_count=rare_word_count_enwords_book(word_list,rare_dict);
        }
        
        if (['count','old','random','length','rare','title'].includes(cstype)){
            result_t['k_'+item[2]].push([blstr,(item[0]+item[1]).length,word_list.length,old_count/word_list.length,blrare_count,item[1]]);
        }
        else {
            result_t['k_'+item[2]].push(blstr);
        }
    }
    
    var rare_href='';
    if (['count','old','random','length','rare','title'].includes(cstype)){
        var list_t=[];
        for (let key in result_t){
            list_t=list_t.concat(result_t[key]);    //逐个元素合并 - 保留注释
        }
        //先随机排序一番 - 保留注释
        var blmax=randint_b(5,10);
        for (let blxl=0;blxl<blmax;blxl++){
            list_t.sort(randomsort_b);
        }
        //---
        switch (cstype){
            case 'length':
                list_t.sort(function (a,b){return a[1]<b[1];});            
                break;
            case 'count':
                list_t.sort(function (a,b){return a[2]<b[2];});
                rare_href=sub_selenium_list_enwords_book_watershed(list_t,2);            
                break;                        
            case 'old':
                list_t.sort(function (a,b){return a[3]<b[3];});
                rare_href=sub_selenium_list_enwords_book_watershed(list_t,3,0);
                break;
            case 'rare':
                list_t.sort(function (a,b){return a[4]<b[4];});
                rare_href=sub_selenium_list_enwords_book_watershed(list_t,4);
                break;
            case 'title':
                list_t.sort(function (a,b){return a[5]>b[5];});
                //rare_href=sub_selenium_list_enwords_book_watershed(list_t,5);
                break;
        }
        for (let blxl=0;blxl<list_t.length;blxl++){
            list_t[blxl]=list_t[blxl][0];
        }
        //---
        result_t=list_t.join('\n');
    }
    else {
        for (let key in result_t){
            result_t[key]=result_t[key].join('\n');
            result_t[key]='<div class="div_h2_selenium_enbook">\n<hr />\n<h2>🌐 <span class="span_name_selenium_enbook">'+key.substring(2,)+'</span> <span class="span_underline_box" style="color:'+scheme_global['a-hover']+';font-weight:normal;" onclick="selenium_remove_enwords_book(this.parentNode.parentNode);">✗</span></h2>\n'+result_t[key]+'\n</div>';
        }
        result_t=object2array_b(result_t).join('\n');
    }
    selenium_html_enwords_book(result_t,use_cache,cached_list.length,theday);
    selenium_rare_jump_enwords_book(rare_href);
}

function selenium_rare_jump_enwords_book(rare_href){
    if (rare_href==''){return;}
    var odivs=document.querySelectorAll('div.div_h3_selenium_enbook');
    for (let blxl=0;blxl<odivs.length;blxl++){
        var one_div=odivs[blxl];
        var oa=one_div.querySelector('a.a_black');
        if (!oa){continue;}
        var blhref=oa.href;
        if (!blhref){continue;}
        if (blhref==rare_href){
            var ospan=one_div.querySelector('span.span_batch_count_enwords_book');
            if (ospan){
                ospan.click();
            }
            if (blxl>0){
                ospan=odivs[blxl-1].querySelector('span.span_batch_count_enwords_book');
                if (ospan){
                    ospan.click();
                }      
                odivs[blxl-1].scrollIntoView();
            }
            else {
                one_div.scrollIntoView();
            }
            break;
        }
    }
}

function selenium_html_enwords_book(result_str,use_cache,cached_list_len,theday){
    var progress_list=ltp_status_get_b('+selenium +生词统计','tomato','white',100);
    var bljg='<p>'+progress_list.join(' ')+'</p>';
    bljg=bljg+'<h1>'+theday+'</h1>\n'+result_str+'<p>';
    bljg=bljg+'<span class="aclick" onclick="frequency_enwords_book(\'sentence_rare\',true);this.outerHTML=\'\';">例句中的常见单词</span>';
    bljg=bljg+'<span class="aclick" onclick="selenium_number_enwords_book();">刷新编号</span>';
    if (use_cache){
        bljg=bljg+'<span class="aclick" onclick="selenium_local_storage_clear_enwords_book();">清空缓存(<span id="span_selenium_local_storage_count">'+cached_list_len+'</span>)</span>';
    }
    bljg=bljg+'<span class="aclick" onclick="selenium_local_storage_set_enwords_book('+use_cache+');">添加当前记录到缓存</span>';
    bljg=bljg+' <span id="span_selenium_old_record_count"></span></p>';
    document.getElementById('div_new_words2').innerHTML=bljg;
    
    selenium_old_record_count_enwords_book();
    selenium_number_enwords_book();
}

function selenium_number_enwords_book(){
    var t0 = performance.now();

    var ospans=document.querySelectorAll('span.span_no_selenium_enbook');
    for (let blxl=0;blxl<ospans.length;blxl++){
        ospans[blxl].innerText=(blxl+1)+'. ';
    }
    var odivs=document.querySelectorAll('div.div_h2_selenium_enbook');
    for (let one_div of odivs){
        var ospans=one_div.querySelectorAll('span.span_no_selenium_enbook');
        for (let blxl=0;blxl<ospans.length;blxl++){
            ospans[blxl].insertAdjacentHTML('afterbegin',(blxl+1)+'/');
        }        
    }
    console.log('selenium_number_enwords_book() 费时：'+(performance.now() - t0) + ' milliseconds');            
}

function selenium_local_storage_clear_enwords_book(){
    var cached_list=selenium_local_storage_get_enwords_book();
    if (cached_list.length==0){return;}

    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空'+cached_list.length+'条缓存记录') || '').trim()==rndstr){
        localStorage.setItem('selenium_enbook','');
        selenium_old_record_count_enwords_book(true,false);
    }
}

function selenium_local_storage_set_enwords_book(is_cache){
    var cached_list=selenium_local_storage_get_enwords_book();
    var oas=document.querySelectorAll('div.div_h3_selenium_enbook a.a_black');
    if (oas.length==0){return;}
    if (cached_list.length>0 && confirm('缓存区现有记录'+cached_list.length+'条，是否添加当前页面'+oas.length+'条记录到缓存？')==false){
        return;
    }
        
    var result_t=[];
    var all_articles_list=enwords_selenium_cached_global.concat(enwords_selenium_scan_global);
    for (let one_a of oas){
        var blhref=one_a.getAttribute('href');
        if (!blhref){continue;}
        for (let item of all_articles_list){
            if (item[0]==blhref){
                result_t.push(item.join('\n'));
                break;
            }
        }
    }
    
    for (let blxl=0;blxl<cached_list.length;blxl++){
        cached_list[blxl]=cached_list[blxl].join('\n');
    }    
    result_t=array_union_b(result_t,cached_list);
    localStorage.setItem('selenium_enbook',result_t.join('\n'));
    
    selenium_old_record_count_enwords_book(true);
}

function selenium_old_record_count_enwords_book(show_alert=false,show_error=true){
    var oas=document.querySelectorAll('div#div_new_words2 a.a_black');
    var cached_list=selenium_local_storage_get_enwords_book(true);
    var bllen=cached_list.length;
    if (show_alert){
        var ospan=document.getElementById('span_selenium_local_storage_count');
        if (ospan){
            ospan.innerHTML=bllen;    
        }
        else {
            alert('操作完毕，缓存区现有记录'+bllen+'条');        
        }
    }
    
    var blcount=0;
    for (let one_a of oas){
        var blhref=one_a.href;
        if (blhref && (cached_list.includes(blhref) ||cached_list.includes(decodeURIComponent(blhref)))){
            blcount=blcount+1;
        }
        else if (show_error){
            console.log('error',blhref);
        }
    }
    var blstr='已缓存记录数：'+blcount;
    
    var minus='';
    local_storage_today_b('cached_records_count_enbook',40,bllen,'/');
    var list_t=local_storage_get_b('cached_records_count_enbook',-1,true);
    
    if (list_t.length>=2){
        var old_str=list_t[1];
        if (old_str.includes('/')){
            var list_t=old_str.split('/');
            var old_count=parseInt(list_t[1].trim());
            minus='；与 '+list_t[0]+' 相差：'+(bllen-old_count);
        }
    }
    document.getElementById('span_selenium_old_record_count').innerHTML=blstr+minus;
}

function selenium_local_storage_get_enwords_book(only_href=false){
    var list_t=local_storage_get_b('selenium_enbook').split('\n');
    if (list_t.length % 4 !== 0){
        console.log('列数不为4',list_t);    //此行保留 - 保留注释
        return [];
    }
    var result_t=[];
    if (only_href){
        for (let blxl=0;blxl<list_t.length;blxl=blxl+4){
            result_t.push(list_t[blxl]);
        }    
    }
    else {
        for (let blxl=0;blxl<list_t.length;blxl=blxl+4){
            result_t.push([list_t[blxl],list_t[blxl+1],list_t[blxl+2],list_t[blxl+3]]);
        }
    }
    
    return result_t;
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

function selenium_remove_enwords_book(odiv){
    if(!odiv){return;}
    var oh3s=odiv.querySelectorAll('h3');
    if (oh3s.length==0){return;}
    
    if (oh3s.length==1){
        var oa=oh3s[0].querySelector('a.a_black');
        if (!oa){return;}
        var atitle=oa.innerText;
        if (!confirm('是否删除？\n'+atitle)){return;}
        odiv.parentNode.removeChild(odiv);
    }
    else {
        var okey=odiv.querySelector('span.span_name_selenium_enbook');
        if (!okey){return;}
        if (!confirm('是否删除 '+okey.innerText+' 下'+oh3s.length+'条记录？')){return;}
        odiv.parentNode.removeChild(odiv);        
    }
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

function new_and_common_enwords_book(csresult,cslength,common_max){
    csresult=object2array_b(csresult,true,2);
    csresult.sort();    
    csresult.sort(function (a,b){return a[1]<b[1];});
    
    var common_set=[];
    for (let blxl=0;blxl<csresult.length;blxl++){
        if (csresult[blxl][1]<=1){
            common_set=csresult.slice(0,blxl);
            break;
        }
    }
    
    for (let blxl=0;blxl<common_set.length;blxl++){
        common_set[blxl]=common_set[blxl][0];
    }
    common_set=new Set(common_set);
    
    csresult=csresult.slice(0,cslength);
    
    var common_list=[];
    var new_t=[];
    for (let blxl=0;blxl<csresult.length;blxl++){
        var item=csresult[blxl];
        common_list.push('"'+specialstr_lt_gt_j(item[0])+'",');
        
        if (item[2]){
            new_t.push(item[0]);
        }
        
        if (blxl>=common_max && blxl % 100 == 0){
            if (common_list.length>=common_max && new_t.length >=1000){break;}
        }
    }
    new_t=new_t.slice(0,1000);
    common_list=common_list.slice(0,common_max);
    return [new_t,common_list,common_set];
}

function common_word_sign_set_enwords_book(csset){
    var t0 = performance.now();
    var ospans=document.querySelectorAll('span.span_word_combination_enword');
    var ofirst=false;
    for (let one_span of ospans){
        var osub=one_span.querySelector('span.a_word');
        if (!osub){continue;}
        var blword=osub.innerText;
        if (!csset.has(blword)){continue;}
        osub.insertAdjacentHTML('beforebegin','👫');
        if (ofirst===false){
            ofirst=osub;
        }
    }
    if (ofirst!==false){
        ofirst.scrollIntoView();
    }
    console.log('common_word_sign_set_enwords_book() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function frequency_enwords_book(cstype='',simple_split=false,common_max=4000){
    function sub_frequency_enwords_book_arow(){
        if (blxl>=bllen){
            var new_t,common_t,common_set;
            [new_t,common_t,common_set]=new_and_common_enwords_book(result_t,oldwords.size*2,common_max); //2倍旧单词长度 - 保留注释
            switch (cstype){
                case 'sentence_common':
                    document.getElementById('textarea_new_words1').value='//常见新单词('+new_t.length+')\n'+new_t.join('\n');
                    get_new_words_arr_enbook_b(2);
                    break;
                case 'textarea':
                    get_new_words_arr_enbook_b(2,new_t.join(' '));
                    break;
                case 'sentence_rare':
                    console.log('frequency_enwords_book() 费时：'+(performance.now() - t0) + ' milliseconds');
                    common_word_sign_set_enwords_book(common_set);
                    break;
            }
            if (cstype!=='sentence_rare'){
                document.getElementById('textarea_new_words2').value='var enwords_easy_global=[\n//常见单词('+common_t.length+')\n'+common_t.join('\n')+'\n];\n';
                console.log('frequency_enwords_book() 费时：'+(performance.now() - t0) + ' milliseconds');
            }
            return;
        }
        
        var blstr=article_arr[blxl].toString().replace(/&lt;eword w=['"]?.*?['"]?&gt;&lt;\/eword&gt;/g,'');
        var list_t=str_2_array_enbook_b(blstr,'list');
        for (let aword of list_t){
            aword=aword.trim();
            if (aword==''){continue;}
            
            var is_new=true;
            var blstr='';
            
            if (new_word_set.has(aword)){
                blstr=aword;
            }
            else if (oldwords.has(aword) || old_variety.has(aword)){
                blstr=aword;
                is_new=false;
            }
            else if (!simple_split){
                var variety=wordtypes_enbook_b(aword);
                for (let one_type of variety){
                    if (oldwords.has(one_type)){
                        blstr=one_type;
                        is_new=false; 
                        old_variety.add(one_type);
                        break;
                    }                    
                }
            }
            
            if (blstr==''){
                blstr=aword;
            }
            if (is_new){
                new_word_set.add(blstr);
            }
            if (result_t['w_'+blstr]==undefined){
                result_t['w_'+blstr]=[0,is_new];
            }
            result_t['w_'+blstr][0]=result_t['w_'+blstr][0]+1;
        }
        
        blxl=blxl+1;
        if (blxl % 200 == 0){
            setTimeout(sub_frequency_enwords_book_arow,1);
        }
        else {
            sub_frequency_enwords_book_arow();
        } 
    }
    //------------------
    var t0 = performance.now();

    var oldwords=simple_words_b();
    var old_variety=new Set();
    var result_t={};
    var new_word_set=new Set();
    var article_arr=[];
    switch (cstype){
        case 'sentence_rare':
        case 'sentence_common':
            for (let item of en_sentence_global){
                article_arr.push(item[0]);
            }
            break;
        case 'textarea':
            article_arr=document.getElementById('textarea_new_words1').value.trim().split('\n');
            break;
    }
    var blxl=0;
    var bllen=article_arr.length;
    sub_frequency_enwords_book_arow();   
}
