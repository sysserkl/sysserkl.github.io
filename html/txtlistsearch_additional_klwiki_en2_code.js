function menu_more_kltxt_klwiki_en2(){
    var ospan=document.getElementById('span_for_more_menu_kltxt');
    if (!ospan){return;}

    var str_t=klmenu_hide_b('');
    var klmenu1=[    
    '<span class="span_menu" onclick="'+str_t+'days_kltxt_klwiki_en2();">今日段落阅读</span>',
    '<span class="span_menu" onclick="'+str_t+'batch_search_form_kltxt_klwiki_en2();">单词批量查找</span>',
    '<span class="span_menu" onclick="'+str_t+'common_rare_old_words_kltxt_klwiki_en2();">当前范围常见稀有旧单词</span>',
    '<a href="../jsdata/words/enwords_sentence_data.js'+file_date_parameter_b()+'" onclick="'+str_t+'" target=_blank>enwords_sentence_data.js</a>',    
    
    ];

    var group_list=[
    ['最长','rows_len_rank_kltxt_klwiki_en2(\'最长\');',true],
    ['最短','rows_len_rank_kltxt_klwiki_en2(\'最短\');',true],    
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'行：'));
    
    var group_list=[
    ['全部','new_words_count_kltxt_klwiki_en2(\'all\');',true],
    ['当前','new_words_count_kltxt_klwiki_en2(\'current\');',true],    
    ['txtbook','new_words_count_kltxt_klwiki_en2(\'txtbook\');',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'常见生词统计：'));
    
    var group_list=[
    ['稀有单词行','rare_words_kltxt_klwiki_en2();',true],
    ['无新单词行','new_words_kltxt_klwiki_en2(0);',true],    
    ['仅有1个新单词行','new_words_kltxt_klwiki_en2(1);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var blstr=klmenu_b(klmenu1,'🇬🇧','22rem','1rem','1rem','30rem');
    ospan.outerHTML=blstr;
}

function common_rare_old_words_kltxt_klwiki_en2(){
    var t0 = performance.now();

    var start_lineno,end_lineno,blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();

    var result_t={};
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){
        var blstr=filelist[blxl];
        if (!blstr.endsWith(')')){continue;}
        var blat=blstr.lastIndexOf('(');
        if (blat==-1){continue;}
        blstr=blstr.slice(blat+1,-1);
        if (!blstr.includes('-')){continue;}
        
        var list_t=blstr.match(/^\-[^\s]+| \-[^\s]+/g) || [];
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
    result_t=array_intersection_b(result_t,en_sentence_count_global);
    
    en_word_temp_get_b();
    document.getElementById('divhtml').innerHTML='<h4>'+blrange+'</h4>'+enwords_js_wiki_textarea_b(result_t,'str');
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

function rare_words_kltxt_klwiki_en2(){
    txtsearch_kltxt_b('\\(-[^\\(\\)]+\\)$ \\s-[^\\(\\)]+\\)$(:r)'); //-可能出现在(后或空格后 - 保留注释
}

function new_words_count_kltxt_klwiki_en2(cstype='all'){
    var t0 = performance.now();
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
            if (result_t['w'+one_word]==undefined){
                result_t['w'+one_word]=0;
            }
            result_t['w'+one_word]=result_t['w'+one_word]+1;
        }
	}
    result_t=object2array_b(result_t,true,2);
    result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});
    result_t=result_t.slice(0,2500);
    result_t=new Set(array_split_by_col_b(result_t,[0]));
    var old_set=simple_words_b(true,true);
    var old_size=array_intersection_b(result_t,old_set,true).size;
    document.getElementById('divhtml').innerHTML=new_old_words_html_enbook_b(result_t,old_size+'/'+result_t.size,'',false,old_set,false);
    console.log('new_words_count_kltxt_klwiki_en2() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function batch_search_form_kltxt_klwiki_en2(){
    var postpath=postpath_b();
    var bljg='<p><textarea id="textarea_batch_search_words_kltxt_klen2" style="height:10rem;"></textarea></p>';
    bljg=bljg+'<p>'   
    bljg=bljg+'<span class="span_box" ondblclick="selective_default_value_kltxt_klwiki_en2();">查找过滤：</span><input type="text" id="input_selective_words_kltxt_klen2" /> ';
    bljg=bljg+'<span class="aclick" onclick="batch_search_result_kltxt_klwiki_en2();">单词批量查找</span> ';
    bljg=bljg+'<span class="aclick" onclick="words_not_in_article_kltxt_klwiki_en2();">正文中不存在的单词</span> ';
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
        split_list.push(bldiff.slice(blxl,blxl+100).join('|').replace(/\s/g,'\\s'));
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

function batch_search_result_kltxt_klwiki_en2(){
    var list_t=array_unique_b(document.getElementById('textarea_batch_search_words_kltxt_klen2').value.trim().replace(/ /g,'\\s').split('\n')); 

    var more_filter=document.getElementById('input_selective_words_kltxt_klen2').value.trim().split(' ');

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

    render_html_kltxt_b(blwordlist);
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
