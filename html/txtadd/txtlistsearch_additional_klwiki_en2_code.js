function menu_more_kltxt_klwiki_en2(){
    var ospan=document.getElementById('span_for_more_menu_kltxt');
    if (!ospan){return;}

    var str_t=klmenu_hide_b('');
    var klmenu1=[    
    '<span class="span_menu" onclick="'+str_t+'days_kltxt_klwiki_en2();">今日段落阅读</span>',
    '<span class="span_menu" onclick="'+str_t+'batch_search_form_kltxt_klwiki_en2();">单词批量查找</span>',
    '<span class="span_menu" onclick="'+str_t+'common_rare_old_words_kltxt_klwiki_en2();">当前范围常见稀有旧单词</span>',
    '<span class="span_menu" onclick="'+str_t+'rare_old_words_in_chapter_kltxt_klwiki_en2();">稀有旧单词章节统计</span>',
    '<a href="../jsdata/words/enwords_sentence_data.js'+file_date_parameter_b()+'" onclick="'+str_t+'" target=_blank>enwords_sentence_data.js</a>',    
    
    ];

    var group_list=[
    ['page页面第一个出现的稀有旧单词','first_rare_old_words_kltxt_klwiki_en2();',true],
    ['&批量查找','first_rare_old_words_kltxt_klwiki_en2(true);',true],    
    ['&random','first_rare_old_words_kltxt_klwiki_en2(true,true);',true],    
    ['&10','first_rare_old_words_kltxt_klwiki_en2(true,true,10);',true],    

    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['最长','rows_len_rank_kltxt_klwiki_en2(\'最长\');',true],
    ['最短','rows_len_rank_kltxt_klwiki_en2(\'最短\');',true],    
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'行：'));
    
    var group_list=[
    ['全部','new_words_count_kltxt_klwiki_en2(\'all\');',true],
    ['当前','new_words_count_kltxt_klwiki_en2(\'current\');',true],    
    ['txtbook','new_words_count_kltxt_klwiki_en2(\'txtbook\');',true],
    ['⚪ 例句W','klmenu_check_b(this.id,true);',false,'span_include_sentence_w_kltxt_klwiki_en2'],
    ['⚪ 例句T','klmenu_check_b(this.id,true);',false,'span_include_sentence_t_kltxt_klwiki_en2'],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'常见生词统计：'));
    
    var group_list=[
    ['稀有单词行','rare_words_kltxt_klwiki_en2();',true],
    ['含有2个稀有单词的行','txtsearch_kltxt_b(\'(\\\\(\\\\-|\\\\([^\\\\(\\\\)]+\\\\s\\\\-)[^\\\\(\\\\)-]+\\\\s\\\\-\');',true],
    ['无新单词行','new_words_kltxt_klwiki_en2(0);',true],    
    ['仅有1个新单词行','new_words_kltxt_klwiki_en2(1);',true],
    
    
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var blstr=klmenu_b(klmenu1,'🇬🇧','30rem','1rem','1rem','30rem');
    ospan.outerHTML=blstr;
}

function rare_old_words_in_chapter_kltxt_klwiki_en2(){
    function sub_rare_old_words_in_chapter_kltxt_klwiki_en2_scan(){
        if (row_no>=row_len){
            sub_rare_old_words_in_chapter_kltxt_klwiki_en2_done();
            document.title=old_title;
            return;
        }
        
        let arow=filelist[row_no];
        if (arow.startsWith('=== ') && arow.endsWith(' ===')){
            sub_rare_old_words_in_chapter_kltxt_klwiki_en2_push();
            chapter_name=arow.slice(4,-4);
            rare_list=[];
        } else {
            var list_t=rare_old_words_get_kltxt_klwiki_en2(arow);
            for (let item of list_t){
                rare_list.push(item.trim().slice(1,));
            }
        }
        
        row_no=row_no+1;
        if (row_no % 10000 == 0){
            document.title=row_no+'/'+row_len+' - ' + old_title;
            setTimeout(sub_rare_old_words_in_chapter_kltxt_klwiki_en2_scan,1);
        } else {
            sub_rare_old_words_in_chapter_kltxt_klwiki_en2_scan();
        }
    }
    
    function sub_rare_old_words_in_chapter_kltxt_klwiki_en2_done(){
        sub_rare_old_words_in_chapter_kltxt_klwiki_en2_push();
        
        result_t.sort();
        result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});
        result_t.sort(function (a,b){return a[2]>b[2]?-1:1;});
        
        words_dict=object2array_b(words_dict,true,2);
        words_dict.sort();

        let rare_eq_1=[];
        let rare_gt_1=[];
        for (let item of words_dict){
            if (item[1]==0 || item[2]==0){continue;}    //单词大小写导致 - 保留注释
            if (item[2]==1){
                rare_eq_1.push([item[0],item[1]]);
            } else {
                rare_gt_1.push([item[0],item[1]]);
            }
        }
        
        rare_eq_1.sort(function (a,b){return a[1]>b[1]?-1:1;});        
        rare_gt_1.sort(function (a,b){return a[1]>b[1]?-1:1;});

        let rare_unique=array_split_by_col_b(words_dict,[0,2]);
        rare_unique.sort(function (a,b){return a[1]>b[1]?-1:1;});

        var range_str=sub_rare_old_words_in_chapter_kltxt_klwiki_en2_range(rare_unique.slice(0,50),'分布最广泛的单词');
        range_str=range_str+sub_rare_old_words_in_chapter_kltxt_klwiki_en2_range(rare_unique.slice(50,100),'分布最广泛的单词');
        range_str=range_str+sub_rare_old_words_in_chapter_kltxt_klwiki_en2_range(rare_gt_1.slice(0,50),'出现次数最多的分布大于2处的单词');
        range_str=range_str+sub_rare_old_words_in_chapter_kltxt_klwiki_en2_range(rare_eq_1.slice(0,50),'出现次数最多的分布只有1处的单词');
        
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            var item=result_t[blxl];
            result_t[blxl]='<tr><td width=1%>'+item[0]+'</td><td width=1% align=right>'+item[1]+'</td><td width=1% align=right>'+item[2]+'</td><td width=90% style="word-break:break-all;word-wrap:break-word;font-size:small;">'+item[3].join('|')+'</td></tr>';
        }
        document.getElementById('divhtml').innerHTML='<table class="table_common">'+result_t.join('\n')+'</table>\n'+range_str;
        console.log('rare_old_words_in_chapter_kltxt_klwiki_en2() 费时：'+(performance.now() - t0) + ' milliseconds');    
    }
    
    function sub_rare_old_words_in_chapter_kltxt_klwiki_en2_range(csarr,cscaption=''){
        if (csarr.length>0){
            var words_range=csarr[0][1]+'～'+csarr[csarr.length-1][1];
        } else {
            var words_range='';
        }
        csarr=array_split_by_col_b(csarr,[0]);    
        return '<h3>'+cscaption+' ('+words_range+')</h3><textarea>\\b('+csarr.join('|')+')\\b</textarea>';
    }
    
    function sub_rare_old_words_in_chapter_kltxt_klwiki_en2_push(){
        if (rare_list.length==0){return;}
        
        for (let item of rare_list){
            let blkey='d_'+item;
            if (words_dict[blkey]==undefined){
                words_dict[blkey]=[0,0];
            }
            words_dict[blkey][0]=words_dict[blkey][0]+1;
        }
                
        let set_t=array_unique_b(rare_list);  
        set_t=Array.from(new_old_word_list_enbook_b(set_t,true,csendata_set)[2]);
        set_t.sort();  
        result_t.push([chapter_name,rare_list.length,set_t.length,set_t]);
        
        for (let item of set_t){
            let blkey='d_'+item;
            if (words_dict[blkey]==undefined){  //单词大小写 - 保留注释
                words_dict[blkey]=[0,0];
            }
            words_dict[blkey][1]=words_dict[blkey][1]+1;
        }
    }
    
    var t0 = performance.now();

    var result_t=[];
    var chapter_name='';
    var rare_list=[];
    var words_dict={};
    var row_no=0;
    var row_len=filelist.length;
    var old_title=document.title;
    var csendata_set=simple_words_b(true,false,true);

    sub_rare_old_words_in_chapter_kltxt_klwiki_en2_scan();
}

function rare_old_words_get_kltxt_klwiki_en2(arow){
    if (!arow.endsWith(')')){return [];}
    var blat=arow.lastIndexOf('(');
    if (blat==-1){return [];}
    arow=arow.slice(blat+1,-1);
    if (!arow.includes('-')){return [];}
    
    return arow.match(/^\-[^\s]+| \-[^\s]+/g) || [];
    //形如 [ " -fifthly", " -fourthly" ] 或 [ "-initialize", " -sudoku" ] 等 - 保留注释
}

function common_rare_old_words_kltxt_klwiki_en2(){
    var t0 = performance.now();
    var sub_fix=mark_check_b('common_rare_old_words_kltxt_klwiki_en2','start')[0];
    
    var start_lineno,end_lineno,blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();

    var result_t={};
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){
        var list_t=rare_old_words_get_kltxt_klwiki_en2(filelist[blxl]);

        for (let one_word of list_t){
            one_word=one_word.trim().slice(1,);
            if (result_t['w_'+one_word]==undefined){
                result_t['w_'+one_word]=0;
            }
            result_t['w_'+one_word]=result_t['w_'+one_word]+1;
        }
    }
    result_t=object2array_b(result_t,true,2);
    result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        if (result_t[blxl][1]==1){
            result_t=result_t.slice(0,blxl);
            break;
        }
    }
    result_t=result_t.slice(0,blmax);
    var blrange=result_t[0][1]+'～'+result_t.slice(-1)[0][1];
    
    result_t=array_split_by_col_b(result_t,[0]);
    var rare_words=new_old_word_list_enbook_b(result_t)[2];
    
    en_word_temp_get_b();
    document.getElementById('divhtml').innerHTML='<h4>'+blrange+'</h4>'+enwords_js_wiki_textarea_b(rare_words,'str');
    
    mark_check_b('common_rare_old_words_kltxt_klwiki_en2','end',sub_fix,['start','end'],true);
    console.log('common_rare_old_words_kltxt_klwiki_en2() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function rows_len_rank_kltxt_klwiki_en2(cstype){
    var start_lineno,end_lineno,blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();

    var result_t=[];
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){
        if (filelist[blxl].startsWith('==') && filelist[blxl].endsWith('==')){continue;}
        result_t.push([blxl,filelist[blxl].length]);
    }
    
    if (result_t.length>blmax){
        if (cstype=='最长'){
            result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});  //最长在前 - 保留注释
        } else {
            result_t.sort(function (a,b){return a[1]<b[1]?-1:1;});  //最短在前 - 保留注释        
        }
        result_t=result_t.slice(0,blmax);
        
        result_t.sort(function (a,b){return a[0]<b[0]?-1:1;});  //行号排序 - 保留注释
    }
    
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        var row_no=result_t[blxl][0];
        result_t[blxl]=[filelist[row_no],row_no];
    }
    
    lines_2_html_kltxt_b(result_t);
}

function new_words_kltxt_klwiki_en2(cscount){
    switch (cscount){
        case 0:
            txtsearch_kltxt_b('\\([^\\(\\)\\+]+\\)$(:r)');
            break;
        case 1:
            txtsearch_kltxt_b('\\(\\+[^\\(\\)\\+]+\\)$(:r)');
            break;
    }
}

function rare_words_kltxt_klwiki_en2(run_fn=false){
    txtsearch_kltxt_b('\\(-[^\\(\\)]+\\)$ \\s-[^\\(\\)]+\\)$(:r)',-1,-1,true,run_fn); //-可能出现在(后或空格后 - 保留注释
}

function first_rare_old_words_kltxt_klwiki_en2(batch_search=false,israndom=false,csmax=-1){
    var t0 = performance.now();
    var result_t=new Set();
    var selected_rows=[];
    var start_lineno,end_lineno,blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();

    var page_name='';
    var csendata_set=simple_words_b(true,false,true);
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){
        var arow=filelist[blxl];
        var page_check=(arow.match(/^=== (.*) ===$/) || ['',''])[1];
        if (page_check!==''){
            page_name=page_check;
            continue;
        }
        
        if (page_name==''){continue;}
        
        var list_t=rare_old_words_get_kltxt_klwiki_en2(arow);
        if (list_t.length==0){continue;}

        var blstr=list_t[0].trim().slice(1,);
        var rare_check=new_old_word_list_enbook_b([blstr],true,csendata_set)[2];
        if (rare_check.size==0){
            console.log('非稀有单词',blstr);
            continue;
        }
        
        if (!israndom || Math.random()>0.5){
            result_t.add(Array.from(rare_check)[0]);
            page_name='';   //一个page下只获取1个单词 - 保留注释
            selected_rows.push([filelist[blxl],blxl]);
        }
        //如果遍历每一行，获取 稀有单词 列表，可能很慢 - 保留注释
        
        //if (result_t.size>blmax){break;}
    }
    
    result_t=Array.from(result_t);
    if (csmax>0){
        if (israndom){  //再次随机排序 - 保留注释
            result_t=array_numbers_b(result_t,3);
            result_t=result_t.slice(0,csmax);
            console.log(result_t);  //此行保留 - 保留注释
        }
    }
    
    en_word_temp_get_b();

    if (batch_search){
        var run_fn=function (){
            rare_enwords_search_kltxt_b(true,true,false,false,true);
        };
        batch_search_result_kltxt_klwiki_en2(result_t.join('\n'),[],false,run_fn);
    } else {
        lines_2_html_kltxt_b(selected_rows);
        render_html_kltxt_b(result_t);    
        menu_insert_kltxt_b(1);
        
        var button='<p>'+close_button_b('divhtml2','')+'</p>';
        document.getElementById('divhtml2').innerHTML='<div style="margin:2rem;"><h4>'+result_t.length+'</h4>'+enwords_js_wiki_textarea_b(result_t,'str')+button+'</div>';
    }

    console.log('first_rare_old_words_kltxt_klwiki_en2() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function new_words_count_kltxt_klwiki_en2(cstype='all'){
    en_word_temp_get_b();
    
    var blarr=[];
    switch (cstype){
        case 'current':
            var ospans=document.querySelectorAll('#divhtml span.txt_content');
            for (let one_span of ospans){
                blarr.push(one_span.innerText);
            }
            break;
        case 'all':
            blarr=filelist;
            break;
        case 'txtbook':
            var blstart=false;
            for (let arow of filelist){
                if (arow=='== TXTBOOK =='){
                    blstart=true;
                }
                if (blstart){
                    blarr.push(arow);
                }
            }
            break;
    }

    var result_t={};
    for (let arow of blarr){
        var list_t=arow.match(/\(([^\(\)]+?)\)$/) || ['',''];
        if (list_t[1]==''){continue;}
        //结果如：[ "(+amp +lying)", "+amp +lying" ] - 保留注释
        var words=list_t[1].match(/\+[^\s]+/g) || [];
        for (let one_word of words){
            one_word=one_word.slice(1,);    //去除+号 - 保留注释
            if (result_t['w_'+one_word]==undefined){
                result_t['w_'+one_word]=[0,true];
            }
            result_t['w_'+one_word][0]=result_t['w_'+one_word][0]+1;
        }
	}

    var bltype=(klmenu_check_b('span_include_sentence_w_kltxt_klwiki_en2',false)?'w':'');
    bltype=bltype+(klmenu_check_b('span_include_sentence_t_kltxt_klwiki_en2',false)?'t':'');
    if (bltype==''){
        bltype='none';
    }
    frequency_words_enbook_b('dict_plus_'+bltype,false,4000,result_t);
}

function batch_search_form_kltxt_klwiki_en2(){
    var postpath=postpath_b();
    var bljg='<p><textarea id="textarea_batch_search_words_kltxt_klen2" style="height:10rem;"></textarea></p>';
    bljg=bljg+'<p>'   
    bljg=bljg+'<span class="span_box" ondblclick="selective_default_value_kltxt_klwiki_en2();">查找过滤：</span><input type="text" id="input_selective_words_kltxt_klen2" /> ';
    bljg=bljg+'<span class="aclick" onclick="batch_search_result_kltxt_klwiki_en2();">单词批量查找</span> ';
    bljg=bljg+'<span class="aclick" onclick="enwords_search_result_load_b(false,\'textarea\',\'textarea_batch_search_words_kltxt_klen2\');">载入暂存搜索单词</span> ';
    bljg=bljg+'<span class="aclick" onclick="words_not_in_article_kltxt_klwiki_en2();">正文中不存在的单词</span> ';
    bljg=bljg+recent_rare_words_buttons_kltxt_b('textarea_batch_search_words_kltxt_klen2');
    bljg=bljg+textarea_buttons_b('textarea_batch_search_words_kltxt_klen2','复制,清空');
    bljg=bljg+'</p><p>';
    bljg=bljg+'<span class="span_box">提取过滤：</span><input type="text" id="input_selective_sentences_kltxt_klen2" /> ';
    bljg=bljg+'<span class="aclick" onclick="best_sentences_kltxt_klwiki_en2();">提取最佳例句</span>';    
    bljg=bljg+'<span class="aclick" onclick="current_books_content_kltxt_klwiki_en2();">显示指定书名内容</span>';    
    bljg=bljg+close_button_b('divhtml2','')
    bljg=bljg+'</p>';
    bljg=bljg+'<div id="div_sub_batch_search_kltxt_klwiki_en2"></div>';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML='<div style="margin:0.5rem;">'+bljg+'</div>';
    var input_list=[['input_selective_words_kltxt_klen2',11,1],['input_selective_sentences_kltxt_klen2',11,1]];
    input_size_b(input_list,'id');
    document.getElementById('input_selective_sentences_kltxt_klen2').value='-[“”‘’"](:r)';
    odiv.scrollIntoView();
}

function current_books_content_kltxt_klwiki_en2(){
    var list_t=document.getElementById('textarea_batch_search_words_kltxt_klen2').value.trim().split('\n');
    
    var start_lineno,end_lineno,blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();

    var result_t=[];
    var start_push=false;
    var blno=0;
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){
        var arow=filelist[blxl];
        if (arow.startsWith('== ') && arow.endsWith(' ==')){
            start_push=false;
            continue;
        }    
        
        if (arow.startsWith('=== ') && arow.endsWith(' ===')){
            var blname=arow.slice(4,-4);
            start_push=list_t.includes(blname);
            continue;
        }
        
        if (start_push){
            result_t.push([arow,blxl]);
            blno=blno+1;
            if (blno>=blmax){break;}
        }
    }
    lines_2_html_kltxt_b(result_t);
}

function best_sentences_kltxt_klwiki_en2(){
    var filter_str=document.getElementById('input_selective_sentences_kltxt_klen2').value;
    var is_reg=false;
    [filter_str,is_reg]=str_reg_check_b(filter_str,is_reg);
    var blfound=str_reg_search_b('',filter_str,is_reg);
    if (blfound==-1){return;}
    
    best_sentences_kltxt_b('div_sub_batch_search_kltxt_klwiki_en2',filter_str,is_reg);
}

function words_not_in_article_kltxt_klwiki_en2(){
    var blstr=document.getElementById('textarea_batch_search_words_kltxt_klen2').value.trim();
    if (blstr==''){return;}
    
    var content_set=filelist.join('\n').match(/[a-zA-Z\-']+/g) || [];
    var words_set=blstr.split('\n');
    var bldiff=array_difference_b(words_set,content_set);

    var split_list=[];
    for (let blxl=0,lent=bldiff.length;blxl<lent;blxl=blxl+100){
        split_list.push('\\b('+bldiff.slice(blxl,blxl+100).join('|').replace(/\s/g,'\\s')+')\\b');
    }
    
    for (let blxl=0,lent=bldiff.length;blxl<lent;blxl++){
        bldiff[blxl]=[bldiff[blxl],'',''];
    }
    var bljg='<div style="column-count:3;">'+enwords_array_to_html_b(bldiff,false)+'</div>';
    bljg=bljg+enwords_js_wiki_textarea_b(bldiff);

    document.getElementById('divhtml').innerHTML=bljg+array_2_li_b(split_list);
}

function selective_default_value_kltxt_klwiki_en2(){
    document.getElementById('input_selective_words_kltxt_klen2').value=['-^(\\d|\\*|\\[)','-[“”（）">]', '-https?:','-&gt;','-:$'].join(' '); //忽略数字或星号或方括号开头，忽略引号、括号和>，忽略链接，忽略:结尾 - 保留注释
}

function batch_search_result_kltxt_klwiki_en2(csstr=false,more_filter=false,cshighlight=true,run_fn=false){
    if (csstr===false){
        csstr=document.getElementById('textarea_batch_search_words_kltxt_klen2').value;
    }
    var list_t=array_unique_b(csstr.trim().replace(/ /g,'\\s').split('\n')); 
    
    if (more_filter===false){
        more_filter=document.getElementById('input_selective_words_kltxt_klen2').value.trim().split(' ');
    }
    
    var blwordlist=[];
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        blwordlist.push(item);
    }    

    var csword=['+\\b('+blwordlist.join('|')+')\\b'];    //比 csword.push('\\b'+item+'\\b'); 快 - 保留注释
    csword=csword.concat(more_filter);
    
    var start_lineno, end_lineno,blmax;
    [start_lineno, end_lineno,blmax]=start_end_lineno_kltxt_b();

    //一开始设置为false，这样才能正确运行 wiki_line_b - 保留注释
	klwiki_syntaxhighlight_global=false;

    var result_t=txtsearch_list_kltxt_b(csword,true,blmax,start_lineno,end_lineno,false);
    lines_2_html_kltxt_b(result_t);

    render_html_kltxt_b(blwordlist,true,cshighlight,false,false,run_fn,false);
    menu_insert_kltxt_b(1);
}

function days_kltxt_klwiki_en2(theday=new Date()){
    function sub_days_kltxt_klwiki_en2_h3(csday,line_count_t,wordcount_t){
        var daystr_t=csday.getFullYear()+'-'+ ('0'+(csday.getMonth()+1)).slice(-2) + '-' + ('0'+csday.getDate()).slice(-2)+' 星期'+['日','一','二','三','四','五','六'][csday.getDay()];
        var bljg='';
        bljg=bljg+'<h3>'+daystr_t+' ('+line_count_t+'行)</h3>'; 
        return bljg;
    }
    
    function sub_days_kltxt_klwiki_en2_div(blenstr_t){
        var bljg='';
        var englist_t=blenstr_t.match(/<sup style="font-size:0.8rem;color:#cc0000;" class="kleng">(.*?)<\/sup>/g);
        if (englist_t==null){return '';}
        for (let blxl=0,lent=englist_t.length;blxl<lent;blxl++){
            englist_t[blxl]=englist_t[blxl].replace(/<sup style="font-size:0.8rem;color:#cc0000;" class="kleng">(.*?)<\/sup>/g,'$1');
        }
        bljg=bljg+enwords_batch_div_b(englist_t);    
        return bljg;
    }
    //-----------------------
    var cscount=Math.ceil(filelist.length/365);
    
    var today_t=validdate_b(theday,false,true);
    if (today_t==false){
        today_t=new Date();
    }

    //不含当月的今年累计天数+当月已过天数 - 保留注释
    //var csday2=months_b(today_t.getMonth()+1-1)+today_t.getDate();

	var csday = new Date(today_t.getFullYear(),0,1); //1月1日 - 保留注释

	var bljg='';
	var blenstr_t='';
	var wordcount_t=0;
	var en_count_t=0;
	var line_count_t=0;

    var today_t_str=date2str_b('',today_t);
	var blxl=0;
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
	for (let blstr of filelist){
		if (csbookname_global=='klwiki_en2' && blxl>0 && blxl%cscount==0){
			if (date2str_b('',csday)==today_t_str){
                bljg=bljg+sub_days_kltxt_klwiki_en2_h3(csday,line_count_t,wordcount_t);
    	        bljg=bljg+blenstr_t;
                bljg=bljg+sub_days_kltxt_klwiki_en2_div(blenstr_t);
                break;
            }
			csday.setTime(csday.getTime()+24*60*60*1000);
			wordcount_t=0;
			blenstr_t='';
			line_count_t=0;
		}
		
		en_count_t=(blstr.match(/&lt;eword /g) || []).length;
		if (en_count_t==0){
            en_count_t=(blstr.match(/kleng/g) || []).length;
        }
		wordcount_t =wordcount_t + en_count_t;
		
        blenstr_t=blenstr_t+'<p style="font-size:1.1rem;"><span class="txt_content">';
	    blenstr_t=blenstr_t+(line_count_t+1)+'. ';
        blenstr_t=blenstr_t+wiki_line_b(blstr,remote_host+'/wikiuploads/')+'</span>';
        
        if (csbookname_global=='klwiki_en2'){
            blenstr_t=blenstr_t+'<sub class="sub_word_count">('+wordcount_t+')</sub>';
        }
        blenstr_t=blenstr_t+'</p>';
		
		blxl=blxl+1;
		line_count_t=line_count_t+1;
	}
    
    var pages='<p>';
    for (let blxl=4;blxl>=1;blxl--){
        var day_temp=previous_day_b(today_t,blxl);
        pages=pages+'<span class="aclick" onclick="days_kltxt_klwiki_en2(\''+day_temp+'\');">'+day_temp.slice(-5,)+'</span> ';
    }
    var day_temp=date2str_b('-',today_t);
    pages=pages+'<span class="aclick" onclick="days_kltxt_klwiki_en2(\''+day_temp+'\');"><font color="'+scheme_global['a-hover']+'">'+day_temp.slice(-5,)+'</font></span> ';
    for (let blxl=1;blxl<=4;blxl++){
        var day_temp=next_day_b(today_t,blxl);
        pages=pages+'<span class="aclick" onclick="days_kltxt_klwiki_en2(\''+day_temp+'\');">'+day_temp.slice(-5,)+'</span> ';
    }
    pages=pages+'<span class="aclick" onclick="days_kltxt_klwiki_en2();">今日</span> ';
    pages=pages+'<span class="aclick" onclick="position_kltxt_klwiki_en2();">指定日期</span> ';
    pages=pages+'<span id="span_clicked_line_word_total" title="已点击行累计单词数">0</span>/';    
    pages=pages+'<span id="span_all_line_word_total" title="所有行累计单词数"></span>';        
    pages=pages+'</p>';
	document.getElementById('divhtml').innerHTML = bljg+pages;
    old_words_kltxt_b(true);
    document.location.href='#content';
    word_length_show_kltxt_klwiki_en2();
    new_words_kltxt_b();
}

function word_length_show_kltxt_klwiki_en2(){
    function sub_word_length_show_kltxt_klwiki_en2_one_p(){
        if (blxl>=plen){
            lines_enword_total_b();
            return;
        }
        var onep=ops[blxl];
        var ospan=onep.querySelector('span.txt_content');
        var osub=onep.querySelector('sub.sub_word_count');
        if (ospan && osub){
            osub.innerHTML=osub.innerText.slice(0,-1)+'/<span class="span_clicked_line_word_count" style="cursor:pointer;" onclick="lines_enword_total_b(this);">'+line_enword_count_b(odiv,ospan)+'</span>)';
        }
        blxl=blxl+1;
        setTimeout(sub_word_length_show_kltxt_klwiki_en2_one_p,10);
    }
    //-----------------------
    var odiv = document.createElement('div');

    var ops=document.querySelectorAll('div#divhtml p');
    var plen=ops.length;
    var blxl=0;
    sub_word_length_show_kltxt_klwiki_en2_one_p();
}

function position_kltxt_klwiki_en2(){
    var blday=(prompt('输入指定日期') || '').trim();
    if (blday==''){return;}
    days_kltxt_klwiki_en2(blday);
}
