function menu_more_kltxt_klwiki_en2(){
    var ospan=document.getElementById('span_for_more_menu_kltxt');
    if (!ospan){return;}

    var str_t=klmenu_hide_b('');
    var klmenu1=[    
    '<span class="span_menu" onclick="'+str_t+'days_kltxt_klwiki_en2();">今日段落阅读</span>',
    '<span class="span_menu" onclick="'+str_t+'batch_search_form_kltxt_klwiki_en2();">单词批量查找</span>',
    '<a href="enwords_book.htm" onclick="'+str_t+'" target=_blank>生词统计</a>',    
    '<a href="ensentence.htm" onclick="'+str_t+'" target=_blank>ensentence</a>',
    '<a href="../jsdata/words/enwords_sentence_data.js'+file_date_parameter_b()+'" onclick="'+str_t+'" target=_blank>enwords_sentence_data.js</a>',    
    
    ];
    
    if (is_local_b()){
        klmenu1.push('<a href="selenium_enwords.htm" onclick="'+str_t+'" target=_blank>selenium enwords</a>');
    }
    
    var blstr=klmenu_b(klmenu1,'🇬🇧','17rem','1rem','1rem','30rem');
    ospan.outerHTML=blstr;
}

function batch_search_form_kltxt_klwiki_en2(){
    var postpath=postpath_b();
    var bljg='<p><textarea id="textarea_batch_search_words_kltxt_klen2" style="height:10rem;"></textarea></p>';
    bljg=bljg+'<p>'   
    bljg=bljg+'<span class="span_box" ondblclick="selective_default_value_kltxt_klwiki_en2();">过滤：</span><input type="text" id="input_selective_words_kltxt_klen2" /> ';
    bljg=bljg+'<span class="aclick" onclick="batch_search_result_kltxt_klwiki_en2();">单词批量查找</span> ';
    bljg=bljg+'<span class="aclick" onclick="words_not_in_article_kltxt_klwiki_en2();">正文中不存在的单词</span> ';
    bljg=bljg+textarea_buttons_b('textarea_batch_search_words_kltxt_klen2','复制,清空');
    bljg=bljg+close_button_b('divhtml2','')
    bljg=bljg+'</p>';
    
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML='<div style="margin:0.5rem;">'+bljg+'</div>';
    selective_default_value_kltxt_klwiki_en2();
    var input_list=[['input_selective_words_kltxt_klen2',11,0.5]];
    input_size_b(input_list,'id');    
    odiv.scrollIntoView();
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
    document.getElementById('input_selective_words_kltxt_klen2').value=['-^(\\d|\\*|\\[)','-[“”（）\(\)">]', '-https?:','-&gt;','-:$'].join(' '); //忽略数字或星号或方括号开头，忽略引号、括号和>，忽略链接，忽略:结尾 - 保留注释
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
