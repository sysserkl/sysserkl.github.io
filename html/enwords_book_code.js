function book_load_enwords_book(csno){
    let list_t=csno.split('_');    //如2_5 - 保留注释
    csbookno_global=Math.min(csbooklist_sub_global.length-1,parseInt(list_t[0])-1);
    if (list_t.length>1){
        csbookno2_global=Math.min(csbooklist_sub_global.length-1,parseInt(list_t[1])-1);
    }
    title_set_enwords_book();
    import_book_js_b(true);
}

function refresh_book_new_enwords_book(csno=10){
    var value_old=all_new_words_count_get_enbook_b(false,false);
    var value_new=all_new_words_count_get_enbook_b(true,false);
    
    compare_statistics_enwords_book(value_old,value_new,csno,false);
    
    var filter_str=[];
    for (let item of enbook_compare_result_list_global){
        filter_str.push(item[0]);
    }
    if (filter_str.length==0){return;}

    console.log(filter_str);    //此行保留 - 保留注释
    localStorage.setItem('enbook_filter','^('+filter_str.join('|')+')$_reg');
    location.href='?book=1&continue';
}

function filter_get_enwords_book(){
    var blstr=local_storage_get_b('enbook_filter');
    if (blstr==''){
        blstr=book_filter_str_enbook_b();
    }
    return blstr;
}

function load_filelist_enwords_book(){
    var cskeys=href_split_b(location.href);
    enbook_title_setted_global=false;
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();
            if (bltmpstr.substring(0,5)=='book='){
                book_load_enwords_book(bltmpstr.substring(5,)); //如book=2_5 - 保留注释
                enbook_title_setted_global=true;
                break;
            }         
        }
    }
    if (enbook_title_setted_global==false){
        title_set_enwords_book();
    }
}

function is_continue_mode_enwords_book(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let bltmpstr of cskeys){
            if (bltmpstr.trim()=='continue'){
                en_words_book_newwords_continue_global=true;
                break;
            }
        }
    }
}

function args_enwords_book(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();

            if (bltmpstr.substring(0,7)=='allnew='){
                var new_words_str=bltmpstr.substring(7,);
                var otextarea=document.getElementById('textarea_new_words1');
                if (otextarea){
                    otextarea.value=new_words_str;
                }
                in_all_new_enwords_book('不在新单词库中');
                get_new_words_arr_set_enbook_b(2);
                break;
            } else if (bltmpstr=='excluded'){
                exclude_enwords_book();
                break;
            }            
        }
    }
    
    if (en_words_book_newwords_continue_global===false){
        show_enwords_book();
    }
}

function recent_enwords_book(csstr=''){
    recent_search_b('recent_search_enwords_book',csstr,'search_enwords_book','div_recent_search',[],25,false); 
}

function init_enwords_book(){
    function sub_init_enwords_book_fn_load(is_ok){
        if (!is_ok){return;}
        import_filelist_enwords_book();
        if (en_words_book_newwords_continue_global){
            get_new_words_arr_set_enbook_b(2);
        }    
    }
    
    function sub_init_enwords_book_fn(){
        args_enwords_book();
        //-----------------------
        if (en_words_book_newwords_continue_global===false){
            top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),true,false,2);
            input_with_x_b('input_search_enbook',11);
            recent_enwords_book();
            
            enwords_mini_search_frame_style_b();
            menu_enwords_book();
            enwords_mini_search_frame_form_b();
        }    

        if (enbook_title_setted_global){
            load_var_b('filelist',-1,2000,sub_init_enwords_book_fn_load);
        }
    }
    //-----------------------
    words_searched_arr_global=[];
    new_words_form_enwords_book();
    enwords_init_b(true,true,sub_init_enwords_book_fn);
}

function menu_enwords_book(){
    var str_t=klmenu_hide_b('');
    var str2_t=klmenu_hide_b('#div_new_words2');
    var klmenu1=[
    '<a href="enwords.htm" onclick="'+str_t+'" target=_blank>单词库</a>',
    '<span class="span_menu" onclick="'+str2_t+'get_new_words_arr_set_enbook_b(4);">旧单词js_wiki格式</span>',
    '<span class="span_menu" onclick="'+str2_t+'get_new_words_arr_set_enbook_b(6);">稀有旧单词js_wiki格式</span>',
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
    '<span class="span_menu" onclick="'+str_t+'import_enwords_book(\'new_hot\');">导入常见新单词</span>',   
    '<span class="span_menu" onclick="'+str_t+'max_length_new_enwords_book();">全部新单词中最长的单词</span>',     
    '<span class="span_menu" onclick="'+str_t+'phrase_in_current_enwords_book();">由当前单词组成的词组</span>',     
    ]);

    var format_list=[
    ['例句中','frequency_count_get_enwords(\'sentence_common\');',true],
    ['当前内容','frequency_count_get_enwords(\'textarea\');',true],
    ['返回结果数：<input type="number" id="input_frequency_count_enwords" min=-1 step=1 value=4000 />','',false],
    ];
    klmenu_new.push(menu_container_b(str_t,format_list,'常见单词：'));    
    
    var format_list=[
    ['新单词','import_enwords_book(\'new\',2500);',true],
    ['旧单词释义','import_enwords_book(\'old_def\',2500);',true],
    ['例句','import_enwords_book(\'sentence\',1000);',true],
    ['kaikki phrase','import_enwords_book(\'kaikki phrase\',1000);',true],
    ['usr share dict','import_enwords_book(\'usr share dict\',3000);',true],
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
    
    format_list=[
    ['高中单词','import_enwords_book(\'senior_high_school\');',true],
    ['CET6单词','import_enwords_book(\'cet6\');',true],
    ];    

    if (is_local_b()){
        format_list.push(['onetab','onetab_enwords_book();',true]);
    }
    klmenu_new.push(menu_container_b(str_t,format_list,'导入'));    
    
    var cache_type_list=['','随机','旧单词在前','单词数','标题和链接长度','标题首字母','稀有度','一对多','包含'];
    for (let blxl=0,lent=cache_type_list.length;blxl<lent;blxl++){
        cache_type_list[blxl]='<option>'+cache_type_list[blxl]+'</option>';
    }
    
    var klmenu2=[    
    '<a href="?book=1&continue" onclick="'+str_t+'">批量统计生词</a>',
    '<span class="span_menu" onclick="'+str_t+'refresh_book_new_enwords_book(10);">按书名顺序重新批量统计变动最少的10本书籍</span>',
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
    load_sentence_menu_b(str_t),    
    '<span class="span_menu" onclick="'+str_t+'space2underline_enwords_book();">替换单词间空格为下划线</span> ',  
    '<span class="span_menu" onclick="'+str_t+'character2space_enwords_book(\'_\',\'下划线\');">替换下划线为空格</span> ',  
    '<span class="span_menu" onclick="'+str_t+'character2space_enwords_book(\'-\',\'连字符\');">替换连字符为空格</span> ',  
    ];
    
    format_list=[
    ['全部新单词','load_all_new_enwords_book();',true],
    ['kaikki','load_enword_file_b(\'kaikki_phrase_global\',\'kaikki_phrase\',false);',true],
    ['new_words_count','load_new_words_count_enwords_book();',true],
    ];    
    klmenu_config.push(menu_container_b(str_t,format_list,'文件载入：'));    
    
    var menus=klmenu_b(klmenu1,'','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_new,'🔤','32rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'🧮','23rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','27rem','1rem','1rem','60rem');
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(menus,'','0rem')+' ');
    
    var input_list=[['input_frequency_count_enwords',5,0.5],];
    input_size_b(input_list,'id');
}

function frequency_count_get_enwords(cstype){
    var oinput=document.getElementById('input_frequency_count_enwords');
    var common_max=parseInt(oinput.value.trim()) || 4000;
    
    frequency_enwords_book_b(cstype,false,common_max);
}

function load_new_words_count_enwords_book(){
    function sub_load_new_words_count_enwords_book_set(){
        local_storage_today_b('new_hot_words_count_statistics',40,Object.keys(new_words_count_global).length,'/');
    }
    load_enword_file_b('new_words_count_global','new_words_count',sub_load_new_words_count_enwords_book_set);
}

function load_all_new_enwords_book(){
    function sub_load_all_new_enwords_book_set(){
        local_storage_today_b('all_new_words_statistics',40,all_new_words_global.length,'/');
    }
    load_enword_file_b('all_new_words_global','all_new_words',sub_load_all_new_enwords_book_set);
}

function check_all_new_enwords_book(){
    if (typeof all_new_words_global == 'undefined'){
        return false;
    }
    return true;
}

function check_kaikki_enwords_book(){
    if (typeof kaikki_phrase_global == 'undefined'){
        return false;
    }
    return true;
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
    bljg=bljg+'<span class="aclick" onclick="get_new_words_arr_set_enbook_b(1);">全部</span> ';
    bljg=bljg+'<span class="aclick" onclick="get_new_words_arr_set_enbook_b(2);">新</span> ';
    bljg=bljg+'<span class="aclick" onclick="get_new_words_arr_set_enbook_b(3);">旧</span> ';
    bljg=bljg+'<span class="aclick" onclick="get_new_words_arr_set_enbook_b(5);">稀有</span> ';

    bljg=bljg+'<select id="select_new_words_type_enbook"><option>不在新单词库中</option><option>已在新单词库中</option><option>不在例句中</option><option>已在例句中</option></select> ';
    bljg=bljg+'<span class="aclick" onclick="in_all_new_enwords_book();">新单词</span>';

    bljg=bljg+'<span class="aclick" onclick="textarea_shift_b(\'textarea_new_words1\',\'textarea_new_words2\');">对调</span> ';    
    bljg=bljg+'分隔符：<input type="text" id="input_filter_delimiter" value=" " /> ';

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
    input_size_b([['input_first_lines',5],['input_filter_delimiter',3]],'id');
}

function import_to_digest_global_enwords_book(){
    var blstr=document.getElementById('textarea_new_words3').value.trim();
    if (blstr==''){
        var list_t=[];
    } else {
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
        blpath=blpath+'?'+csbooklist_sub_global[csbookno_global][0]+'&line=1';
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
            if (check_kaikki_enwords_book()){
                blarr=kaikki_phrase_global;
            }
            break;
        case '全部新单词':
            if (check_all_new_enwords_book()){
                blarr=all_new_words_global;
            }
            break;
        case 'usr share dict':
            blarr=usr_share_dict_global;
            break;
    }
    if (blarr===false){return;}
    
    var result_t=common_search_b(cskey,isreg,blarr,1000)[0];
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
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
    bljg=bljg+'<tr><td colspan=2 align=right>前 <input type="number" id="input_table_rows_enwords_book" min=0 /> 行 <span class="aclick" onclick="booknames_get_enwords_book();">获取书名</span><span class="aclick" onclick="sentences_get_by_bookname_enwords_book();">获取例句</span><span class="aclick" onclick="compare_statistics_enwords_book();">比较</span>'+close_button_b('divhtml2','')+'</p></tr>';
    bljg=bljg+'<tr><td colspan=2 valign=top id="td_result" style="padding:1rem;"></tr>';    
    bljg=bljg+'</table>';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=bljg;
    
    var input_list=[['input_table_rows_enwords_book',5,0.5],];
    input_size_b(input_list,'id');    
    
    current_statistics_data_enwords_book('1',false);
    current_statistics_data_enwords_book('2',true);
    compare_statistics_enwords_book();
    
    odiv.scrollIntoView();
}

function booknames_get_enwords_book(){
    var blrows=parseInt(document.getElementById('input_table_rows_enwords_book').value.trim());
    if (isNaN(blrows) || blrows<=0){return;}
    var otable=document.getElementById('table_compare_enbook');
    if (!otable){return;}
    var otrs=otable.querySelectorAll('tr');
    
    var blno=0;
    var result_t=[];
    for (let arow of otrs){
        var otds=arow.querySelectorAll('td');
        if (otds.length==0){continue;}
        result_t.push(otds[1].innerText);
        blno=blno+1;
        if (blno>=blrows){break;}
    }
    document.getElementById('div_compare_enbook').innerHTML='<textarea>'+result_t.join('\n')+'</textarea>';
}

function sentences_get_by_bookname_enwords_book(){
    if (typeof en_sentence_global == 'undefined'){
        console.log('例句未载入');
        return;
    }
    
    var otextarea=document.querySelector('#div_compare_enbook textarea');
    if (!otextarea){
        console.log('未发现书名编辑框');
        return;
    }
    var list_t=otextarea.value.split('\n');
    
    var result_t=[];
    for (let arow of en_sentence_global){
        if (!arow[2].endsWith('_TLS')){continue;}
        var blname=arow[2].slice(0,-4);
        if (list_t.includes(blname)){
            result_t.push(arow[0]);
        }
    }
    console.log('获取了',result_t.length,'条结果');
    var otextarea=document.getElementById('textarea_new_words1');
    otextarea.value=result_t.toString();
    otextarea.scrollIntoView();
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
            if (check_all_new_enwords_book()){
                if (csmax>0){
                    var words_t=[].concat(all_new_words_global);
                    var bltotal_t=Math.floor((Math.random()*10)+1);
                    for (let blxl=0;blxl<bltotal_t;blxl++){
                        words_t.sort(randomsort_b);
                    }
                    otextarea.value=words_t.slice(0,csmax).join(' ');
                } else {
                    otextarea.value=all_new_words_global.join(' ');            
                }
            }
            break;
        case 'new_hot':
            if (typeof new_words_count_global !== 'undefined'){
                var result_t=object2array_b(new_words_count_global,true,2);
                result_t.sort(function(a,b){return a[1]<b[1]?1:-1;});
                otextarea.value=result_t.join('\n');
            }
            break;
        case 'old':
        case 'old_def':
            var result_t=[];
            var blno=(cstype=='old'?0:2);
            for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
                result_t.push(enwords[blxl][blno]);
                if (blno==2 && blxl % 5000 == 0){
                    result_t=array_unique_b(result_t.join(' ').split(' ')); //减少总体长度 - 保留注释
                }
            }
            if (csmax>0){
                result_t.sort(randomsort_b);
                result_t=result_t.slice(0,csmax);
            }
            otextarea.value=result_t.join(' ');
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
            if (typeof en_sentence_global !== 'undefined'){
                if (csmax==-1){
                    csmax=en_sentence_global.length;
                }
                var list_t=array_numbers_b(Math.min(csmax,en_sentence_global.length),Math.floor((Math.random()*10)+1));

                var result_t=[];
                for (let item of list_t){
                    result_t.push(en_sentence_global[item]);
                }
                otextarea.value=result_t.join('\n\n');
            }
            break;
        case 'senior_high_school':
            otextarea.value=senior_high_school_en_global.join('\n');        
            break;
        case 'cet6':
            otextarea.value=cet6_en_global.join('\n');     //全部导入 - 保留注释
            var progress_list=ltp_status_get_b('+生词 +CET6','pink','white',100);
            ospan.innerHTML=progress_list.join(' ');   
            break;   
        case 'kaikki phrase':
            if (check_kaikki_enwords_book()){
                kaikki_phrase_global.sort(randomsort_b);
                otextarea.value=(csmax>0?kaikki_phrase_global.slice(0,csmax):kaikki_phrase_global).join('\n').replace(/ /g,'_');
            }
            break;
        case 'usr share dict':
            usr_share_dict_global.sort(randomsort_b);
            otextarea.value=(csmax>0?usr_share_dict_global.slice(0,csmax):usr_share_dict_global).join('\n').replace(/ /g,'_');
            break;
    }
}

function max_length_new_enwords_book(){
    if (check_all_new_enwords_book()===false){return;}
    var list_t=[].concat(all_new_words_global);
    list_t.sort(function (a,b){return a.length<b.length ? 1 : -1;});
    list_t=list_t.slice(0,100);
    if (list_t.length==0){return;}
    document.getElementById('textarea_new_words1').value='最长('+list_t[0].length+'-'+list_t.slice(-1)[0].length+')的 '+list_t.length+' 个单词：\n'+list_t.join('\n');
}

function filter_new_enwords_book(){
    day_new_enwords_book(true);
    get_new_words_arr_set_enbook_b(2);
}

function title_set_enwords_book(){
    var bltitle='生词统计';
    if (csbookno_global>=0 && csbookno_global<csbooklist_sub_global.length){
        bltitle=bltitle+' - '+csbooklist_sub_global[csbookno_global][1];
    }
    if (csbookno2_global>=0 && csbookno2_global<csbooklist_sub_global.length){
        bltitle=bltitle+' - '+csbooklist_sub_global[csbookno2_global][1];
    }    
    
    if (en_words_book_newwords_continue_global){
        bltitle=(csbookno_global+1)+'/'+csbooklist_sub_global.length+' - '+bltitle;    
    }

    document.title=bltitle;
    localStorage.setItem('enbook_title_name',bltitle);
}

function compare_statistics_enwords_book(value_old=false,value_new=false,csmax=-1,show_html=true){
    function sub_compare_statistics_enwords_book_get_list(cslist){
        for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
            var item=cslist[blxl];
            var list_temp=item.split(' /// ');
            //形如 24tian_tu_po_gao_kao_dgch3cc_343788 /// 24天突破高考大纲词汇3500(陈灿) /// 2426 - 保留注释
            if (list_temp.length<3){
                cslist[blxl]=['','',0,0];
            } else if (list_temp.length<4){
                cslist[blxl]=[list_temp[0].trim(),list_temp[1].trim(),parseInt(list_temp[2].trim()),0];
            } else {
                cslist[blxl]=[list_temp[0].trim(),list_temp[1].trim(),parseInt(list_temp[2].trim()),parseInt(list_temp[3].trim())];
            }
        }
        return cslist;
    }
    
    if (value_old===false){
        value_old=document.getElementById('textarea_compare_1').value.trim();
    }
    if (value_new===false){
        value_new=document.getElementById('textarea_compare_2').value.trim();
    }
    var list1=value_old.split('\n');
    var list2=value_new.split('\n');
    
    list1=sub_compare_statistics_enwords_book_get_list(list1);
    list2=sub_compare_statistics_enwords_book_get_list(list2);
    //元素格式如：[ "a_princess_of_mars_1616", "A Princess of Mars", 2203, 449 ] - 保留注释
    
    enbook_compare_result_list_global=[];   //全局变量用于避免重新排序时重新计算 - 保留注释
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
            if (csmax==-1){
                enbook_compare_result_list_global.push([bookid,item2[1],'',item2[2],'--','',item2[3],'--']);
            }
        }
    }
    
    if (csmax>0){
        enbook_compare_result_list_global.sort(function (a,b){return zh_sort_b(a,b,false,1);});
        enbook_compare_result_list_global.sort(function (a,b){return a[4]<b[4]?1:-1;});
        enbook_compare_result_list_global=enbook_compare_result_list_global.slice(0,csmax);
    }
    //No.	书名	Data1	Data2	Δ	Data1(10%)	Data2(10%)	Δ - 保留注释
    //enbook_compare_result_list_global 元素形如：[ "ye_zhi_shi_xuan_ying_hdz_241502", "叶芝诗选(英汉对照)", 1129, 1126, -3, 153, 153, 0 ] - 保留注释
    
    if (show_html){
        compare_result_list_to_table_enwords_book();
    }
}

function compare_result_list_to_table_enwords_book(sortno=4){
    if (enbook_compare_result_list_sort_order_global){
        enbook_compare_result_list_global.sort(function (a,b){
            if (sortno>=2){
                if (isNaN(a[sortno])){return 1;}
                if (isNaN(b[sortno])){return 0;}
            }
            return a[sortno]>b[sortno] ? 1 : -1;
        });   
    } else {
        enbook_compare_result_list_global.sort(function (a,b){
            if (sortno>=2){
                if (isNaN(a[sortno])){return 0;}
                if (isNaN(b[sortno])){return 1;}
            }
            return a[sortno]<b[sortno] ? 1 : -1;
        });   
    }
    enbook_compare_result_list_sort_order_global=!enbook_compare_result_list_sort_order_global;
    
    var tdstyle='style="padding:0.5rem;border-bottom:0.1rem solid '+scheme_global['color']+';"';
    var thstyle='style="cursor:pointer;padding:0.5rem;border-bottom:0.2rem solid '+scheme_global['color']+';"';
    var bljg='<div id="div_compare_enbook"></div><table id="table_compare_enbook" cellpadding=0 cellspacing=0 align=center>';
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
    if (check_all_new_enwords_book()===false){return;}
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

function in_all_new_enwords_book(cstype=false){
    function sub_in_all_new_enwords_book_result(result_t_include,result_t_exclude){
        var bljg=cstype+'的新单词(';
        if (cstype.startsWith('已在')){
            bljg=bljg+result_t_include.length+')：'+result_t_include.join(' ')+'\n';
        } else {
            bljg=bljg+result_t_exclude.length+')：'+result_t_exclude.join(' ')+'\n';
        }
        document.getElementById('textarea_new_words2').value=bljg;    
    }
    
    if (cstype===false){
        cstype=document.getElementById('select_new_words_type_enbook').value;
    }

    var csstr=document.getElementById('textarea_new_words1').value.trim();
    var bljgarr2=str_2_array_enbook_b(csstr);
    var new_words_set=new_old_word_list_enbook_b(bljgarr2,checkbox_kl_value_b('words_type_check'))[0];
    
    var result_t_include=[];
    var result_t_exclude=[];
    if (cstype.includes('新单词库') && typeof all_new_words_global !== 'undefined'){
        for (let item of new_words_set){
            if (all_new_words_global.includes(item) || all_new_words_global.includes(item.toLowerCase())){
                result_t_include.push(item);
            } else {
                result_t_exclude.push(item);        
            }
        }
        sub_in_all_new_enwords_book_result(result_t_include,result_t_exclude);
    } else if (cstype.includes('例句')){
        words_in_sentence_enbook_b(new_words_set,true,sub_in_all_new_enwords_book_result);
    }
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
    bljg2.sort(function (a,b){return b[1]>a[1] ? 1 : -1;});
    document.getElementById('textarea_new_words2').value=bljg2.join(' ')+'\n已截取\n';
}

function show_enwords_book(){
    books_b(show_all_books_global,'eng',book_filter_str_enbook_b());
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
    [blkey,is_reg]=str_reg_check_b(blkey,is_reg);

    var result_t=new Set();
    var bldelimiter=delimiter_get_b(document.getElementById('input_filter_delimiter').value);
    var list_t=blstr.split(bldelimiter);
    for (let item of list_t){
		var blfound=str_reg_search_b(item,blkey,is_reg);
		if (blfound==-1){
            alert('表达式错误');
            break;
        }
        if (blfound){
            result_t.add(item);
        }
    }
    var otextarea2=document.getElementById('textarea_new_words2');
    otextarea2.value=Array.from(result_t).join(bldelimiter);
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
        } else {
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
    obj_search_show_hide_b(olis,'',document.getElementById('input_filter_ontab').value,false,true,true);
}

function onetab_links_enwords_book(){
    var result_t=new Set();
    for (let item of onetab_global){
        result_t.add('<a href="'+item[0]+'" onmousedown="this.style.backgroundColor=\''+scheme_global['pink']+'\';" target=_blank>'+item[1]+'</a>');
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
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
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
        var otextarea_t=document.getElementById('textarea_new_words1');
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
