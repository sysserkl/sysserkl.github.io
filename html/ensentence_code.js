function init_ensentence(){
    function sub_init_ensentence_fn(){
        enwords_mini_search_frame_style_b();
        enwords_mini_search_frame_form_b();    
    }
    
    function sub_init_ensentence_done(){
        menu_ensentence();
        input_date_set_enwords_b();
        character_2_icon_b('🗨');
        en_sentence_source_current_global=[];   //全局变量 - 保留注释

        enwords_init_b(false,true,sub_init_ensentence_fn);
    }
    
    //-----------------------
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.8rem':'1.6rem'),true,false,2);
    var input_list=[
    ['input_bcolor',12,0.5],
    ];
    input_size_b(input_list,'id');
    input_with_x_b('input_search',11,'',false,'input_reg',true);
    enwords_recent_search_b('','sentence');
    var data_files=[
    ['en_sentence_global','enwords_sentence'],
    ['en_sentence_count_global','enwords_count_sentence'],
    ];
    for (let blno=0,lent=data_files.length;blno<lent;blno++){
        data_files[blno][1]=klbase_addons_import_js_b([],[],['words/'+data_files[blno][1]+'_data.js'],[],false,false);
        //data_files[blno][1]为数组，其元素是数组，形如：[ "js", "http://aaa/enwords_count_sentence_data.js", "" ] - 保留注释
    }
    
    load_js_var_one_by_one_b(data_files,0,sub_init_ensentence_done);
}

function menu_ensentence(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];
    
    var group_list=[
    ['asc','get_day_sentences();',true],
    ['段落','get_day_sentences(\'\',\'\',false);',true],
    ['例句中的旧单词','article_words_list_enwc_b();',true],
    ['填空','exam_generate_ensentence();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'指定日期例句：'));
    
    klmenu1=klmenu1.concat([
    '<span class="span_menu" onclick="'+str_t+'rare_old_words_ensentence(\'例句最少的单词\',false,true,2,10,5000,false);">例句最少的单词5000</span>',
    '<span class="span_menu" onclick="'+str_t+'phrase_not_in_ensentence(1,100);">例句最少的词组100</span>',
    '<span class="span_menu" onclick="'+str_t+'rare_old_words_ensentence(\'例句出处唯一的单词\',false,true,2,10,5000,true);">例句出处唯一的单词5000</span>',
    '<span class="span_menu" onclick="'+str_t+'show_sentence_enwc_b();">显示例句</span>',
    '<span class="span_menu" onclick="'+str_t+'show_new_words_enwc_b(\'span.span_enwords_sentence\',false);">显示例句中的生词</span>',  //get_new_words_arr_enbook_b - 保留注释
    '<span class="span_menu" onclick="'+str_t+'klwiki_txtbook_oldwords_diff_ensentence();">klwiki 和 txtbook 中的稀有单词</span>',
    ]);

    var group_list=[
    ['随机例句','random_get_ensentence();',true],
    ['填空','random_get_ensentence(true);',true],
    ['临时例句','temp_form_ensentence();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));

    var group_list=[
    ['无例句的单词','rare_old_words_ensentence(\'无例句的单词\',false,false,1,0,3000);',true],
    ['词组1000','phrase_not_in_ensentence(0,1000);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));

    var klmenu_fill=[];
    var group_list=[
    ['⚪ 移除无空行','klmenu_check_b(this.id,true);',false,'span_remove_full_exam_ensentence'],
    ['当前结果填空','exam_generate_ensentence(false);',true],
    ['导出为HTML','standalone_exam_html_generate();',true],
    ];    
    klmenu_fill.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['填空比例 <input type="number" id="input_ensentence_percent_exam" min=0 max=1 value=0.2 step=0.1 />','',false],
    ['每行最少 <input type="number" id="input_ensentence_row_min_exam" value=3 />','',false],
    ['最多 <input type="number" id="input_ensentence_row_max_exam" value=-1 />','',false],
    ];    
    klmenu_fill.push(menu_container_b(str_t,group_list,''));
    
    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'sentence_source_list_ensentence();">例句出处文章列表</span>',    
    '<span class="span_menu" onclick="'+str_t+'host_count_ensentence();">例句出处统计</span>',
    '<span class="span_menu" onclick="'+str_t+'eword_duplicate_ensentence();">行内重复 eword 检索</span>',
    fpara_menu_b(str_t,true),
    ];  

    var group_list=[
    ['🚩','sentence_flag_get_ensentence(-1);',true],
    ['①奇数个引号','odd_quote_get_ensentence();',true],
    ['②开放结尾','search_sentences(open_end_key_ensentence_b());',true],
    ['③数字开头','search_sentences(\'^[0-9]\');',true],
    ['①②③ hash','hash_result_sentences();',true],
    
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,'统计：'));
    
    var group_list=[
    //['⚪ reg','klmenu_check_b(this.id,true);',true,'span_reg_ensentence'],
    ['⚪ show button','klmenu_check_b(this.id,true);',true,'span_button_show_ensentence'],
    ['⚪ match strictly','klmenu_check_b(this.id,true);',true,'span_match_strictly_eng_b'],
    ['⚪ 显示例句详细出处','klmenu_check_b(this.id,true);',true,'span_source_en_b'],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));
    
    if (is_local_b()){
        klmenu_config=klmenu_config.concat([
        '<span id="span_sort_by_selenium_ensentence" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 按selenium单词数排序</span>',
        ]);
        
        var group_list=[
        ['最短例句','length_sort_ensentence();',true],
        ['最长例句','length_sort_ensentence(false);',true],
        ];    
        klmenu_config.push(menu_container_b(str_t,group_list,'<select id="select_length_sort_ensentence_type"><option>分句</option><option>全句</option></select>：'));        
    }
    
    var klmenu_link=[
    '<a href="../jsdata/words/enwords_sentence_data.js'+file_date_parameter_b()+'" onclick="'+str_t+'" target=_blank>enwords_sentence_data.js</a>',    
    '<a href="'+location.origin+'/wiki/index.php/%E7%89%B9%E6%AE%8A:%E6%9C%80%E8%BF%91%E6%9B%B4%E6%94%B9" onclick="'+str_t+'" target=_blank>KLWiki最近更改</a>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🗨','24rem','1rem','1rem','60rem')+klmenu_b(klmenu_fill,'✏','29rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','17rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','29rem','1rem','1rem','60rem'),'','0rem')+' ');

    //klmenu_check_b('span_reg_ensentence',true);
    klmenu_check_b('span_remove_full_exam_ensentence',true);
    klmenu_check_b('span_source_en_b',true);
    klmenu_check_b('span_match_strictly_eng_b',true);
    
    var input_list=[
    ['input_ensentence_percent_exam',4,0.5],
    ['input_ensentence_row_min_exam',3,0.5],
    ['input_ensentence_row_max_exam',3,0.5],
    ];
    input_size_b(input_list,'id');
}

function hash_result_sentences(){
    function sub_hash_result_sentences_html(csarr,cskey=false,csstring=''){
        var bllen=csarr.length;
        if (bllen>2){
            csarr=[csarr[0]].concat(csarr.slice(-1));
        }
        if (cskey===false){
            var bljg=csarr;
        } else {
            var bljg=sentence_list_2_html_b(csarr,[''],-1,false,false);
        }
	    return '<div class="div_sentence">'+bljg.join('\n')+'</div><p><i>('+bllen+')</i>'+csstring+'</p>';        
    }
    
    var match_strictly=klmenu_check_b('span_match_strictly_eng_b',false);
    if (match_strictly){
        klmenu_check_b('span_match_strictly_eng_b',true);
    }
    
    var result1=odd_quote_get_ensentence(-1,false,false,false);
    var result2=sentence_search_value_get_b(open_end_key_ensentence_b(),false,false,false,true);
    var result3=sentence_search_value_get_b('^[0-9]',false,false,false,true);
    
    var bible_count=0;
    for (let item of result3[0]){
        if (item[2]=='Bible(kjv)_TLS'){
            bible_count=bible_count+1;
        }
    }

    var len_all=result1.length+'_'+result2[0].length+'_'+result3[0].length;
    
    var bljg1=sub_hash_result_sentences_html(result1);
    var bljg2=sub_hash_result_sentences_html(result2[0],result2[1]);
    var bljg3=sub_hash_result_sentences_html(result3[0],result3[1],' 其中 Bible(kjv)_TLS: <i>('+bible_count+')</i>');
    
    var hash_value=SHA1(bljg1)+'/'+SHA1(bljg2)+'/'+SHA1(bljg3);
    var old_value=local_storage_get_b('hash_result_ensentence');
    if (len_all+'_'+hash_value==old_value){
        var blcaption='<font color="'+scheme_global['green']+'">一致 ✔</font>';
        var blbutton='';
    } else {
        var blcaption='('+old_value+')<font color="'+scheme_global['a-hover']+'">不一致 ✗</font>';
        var blbutton=' <span class="aclick" onclick="hash_save_ensentence(\''+len_all+'_'+hash_value+'\');">储存</span>';
    }
    document.getElementById('divhtml').innerHTML=bljg1+bljg2+bljg3+'<p>'+hash_value+' 与缓存值'+blcaption+blbutton+'</p>';
    
    if (match_strictly){
        klmenu_check_b('span_match_strictly_eng_b',true);
    }
}

function hash_save_ensentence(csvalue){
    localStorage.setItem('hash_result_ensentence',csvalue);
}

function args_ensentence(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：.htm?s=english& - 保留注释
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,3)=='si='){
                //xxx_ensentence(one_key.substring(3)); //此行保留 - 保留注释
                break;
            }
        }
    } else {
        //bbb_ensentence(1,40); //此行保留 - 保留注释
    }
}

function sentence_source_list_ensentence(csstr=''){
    var isreg=klmenu_check_b('span_reg_ensentence',false);

    en_sentence_source_current_global=en_sentence_source_b(csstr,isreg);
    for (let blxl=0,lent=en_sentence_source_current_global.length;blxl<lent;blxl++){
        var item=en_sentence_source_current_global[blxl];
        en_sentence_source_current_global[blxl]='<a href=" '+item[1]+'" target=_blank>'+item[2]+'</a>';
    }

    var buttons='<input type="text" id="input_sentence_source" placeholder="出处筛选" value="'+specialstr_j(csstr)+'" onkeyup="if (event.key==\'Enter\'){sentence_source_list_ensentence(this.value);}" />';
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='<p>'+buttons+'</p><div id="div_sentence_source_content" style="margin:1rem;"></div>';
    input_with_x_b('input_sentence_source',11);
    sentence_source_pages_ensentence(1);
}

function temp_form_ensentence(){
    var blstr='<textarea id="textarea_temp_ensentence" style="height:20rem;"></textarea>';
    blstr=blstr+'<p>';
    blstr=blstr+'<span class="aclick" onclick="temp_import_ensentence();">导入</span>';
    blstr=blstr+'<span class="aclick" onclick="temp_import_ensentence(\'exam\');">生成填空题</span>';
    blstr=blstr+textarea_buttons_b('textarea_temp_ensentence','清空,复制,导入temp_txt_share');
    blstr=blstr+'</p>';
    document.getElementById('divhtml').innerHTML=blstr;
}

function temp_import_ensentence(cstype='import'){
    var blstr=document.getElementById('textarea_temp_ensentence').value.trim();
    if (blstr==''){return;}
    var list_t=blstr.split('\n');
    var lent=list_t.length;
    
    switch (cstype){
        case 'import':
            if (!confirm('是否导入'+lent+'条记录并替换原有的例句？')){return;}
            break;
        case 'exam':
            var old_sentence=[].concat(en_sentence_global);        
            break;
    }

    en_sentence_global=[];
    for (let blxl=0;blxl<lent;blxl++){
        var arow=list_t[blxl].trim();
        if (arow==''){continue;}
        en_sentence_global.push([arow,'','',blxl]);
    }
    
    switch (cstype){
        case 'import':
            alert('done');
            break;
        case 'exam':
            random_get_ensentence(true);
            en_sentence_global=old_sentence;
            break;
    }
}

function sentence_source_pages_ensentence(csno,csmax=100){
    var odiv=document.getElementById('div_sentence_source_content');
    if (!odiv){return;}

    var blstart=(csno-1);
    var list_t=en_sentence_source_current_global.slice(blstart,blstart+csmax);

    var blstr=page_combination_b(en_sentence_source_current_global.length,csmax,csno,'sentence_source_pages_ensentence','sentence_source_location_ensentence',false,0,0,'','aclick');
    
    odiv.innerHTML=array_2_li_b(list_t)+blstr;
    odiv.parentNode.scrollIntoView();
}

function sentence_source_location_ensentence(cspages,csmax){
    var blno=parseInt((prompt('输入页号',cspages) || '').trim());
    if (isNaN(blno)){return;}
    blno=Math.min(cspages,Math.max(1,blno));
    sentence_source_pages_ensentence((blno-1)*csmax+1,csmax);
}

function phrase_not_in_ensentence(max_count=0,max_result=100){
    function sub_phrase_not_in_ensentence_done(){
        en_word_temp_get_b();
        var full_t=[];
        var words_found=[];
        for (let key in phrase_dict){
            if (phrase_dict[key][1]>max_count){continue;}
            full_t.push(phrase_dict[key][0]);
            words_found.push(phrase_dict[key][0][0]);
        }
        words_found.sort();
        full_t.sort();
        
        var odiv=document.getElementById('divhtml');   
        odiv.innerHTML=enwords_array_to_html_b(full_t,false)+rare_old_words_form_ensentence(words_found,false);
        
        //odiv.insertAdjacentHTML('beforeend','<textarea onclick="this.select();document.execCommand(\'copy\');">'+words_found.join('\n')+'</textarea>');
        console.log('phrase_not_in_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');       
    }
    
    function sub_phrase_not_in_ensentence_one(){
        if (blxl>=bllen){
            sub_phrase_not_in_ensentence_done();
            return;
        }
        
        var item=enwords[blxl];
        
        if (item[0].includes(' ')){
            phrase_dict['w_'+item[0]]=[item,0];
            
            for (let one_sentence of en_sentence_global){
                if (one_sentence[0].toString().match(new RegExp('\\b'+item[0]+'\\b','i'))!==null){
                    phrase_dict['w_'+item[0]][1]=phrase_dict['w_'+item[0]][1]+1;
                    if (phrase_dict['w_'+item[0]][1]>max_count){break;}
                }
            }
            
            if (phrase_dict['w_'+item[0]][1]<=max_count){
                blcount=blcount+1;
                if (blcount>=max_result){
                    sub_phrase_not_in_ensentence_done();
                    return;
                }
            }
        }
        
        blxl=blxl+1;
        if (blxl % 100 == 0){
            setTimeout(sub_phrase_not_in_ensentence_one,1);
        } else {
            sub_phrase_not_in_ensentence_one();
        }
    }
    
    var t0 = performance.now();
    
    var blxl=0;
    var bllen=enwords.length;
    var phrase_dict={};
    var blcount=0;
    sub_phrase_not_in_ensentence_one();
}

function host_count_ensentence(sort_no=-1){
    function sub_host_count_ensentence_dict_generate(csarr){
        var host_t={};
        var article_from_t=new Set();
        
        for (let item of csarr){
            //item[0] 是例句 - 保留注释
            //item[1]形如：/[https://www.mnn.com/lifestyle/arts-culture/blogs/books-independent-bookstore-arent-dead 20190531 | Starre Vartan: Why paper books and the independent bookstore aren't dead | MNN]/ - 保留注释
        
            var list_t=item[1].match(/^\/\[https?:\/\/([^\/]+)/) || []; //获取 host - 保留注释
            if (list_t.length==2){
                var blstr=list_t[1];
            } else if (item[2].slice(-4,)=='_TLS'){
                var blstr=item[2];   //TLS - 保留注释
            } else {  //无链接的KLWiki 文章 - 保留注释
                var blstr='KLWiki_TLS';
            }

            if (host_t['h_'+blstr]==undefined){
                host_t['h_'+blstr]=0;
            }
            host_t['h_'+blstr]=host_t['h_'+blstr]+1;
            //---
            var blhref=item[1].match(/^\/\[(https?:\/\/[^\s]+)/) || [];
            if (blhref.length==2){
                var blstr=blhref[1];
            } else {
                var blstr=item[2];   //TLS - 保留注释
            }
            article_from_t.add(blstr);
        }    
        return [host_t,article_from_t];
        //host_t 形如：{ "h_www.rogerebert.com": 562, "h_www.vulture.com": 585, "h_www.theregister.com": 291, ... } - 保留注释
        //article_from_t 是 set，形如："https://www.rogerebert.com/reviews/a-single-man-2009", "http://www.vulture.com/2010/05/lost_recap_the_candidate.html", "https://www.theregister.com/2025/01/14/doom_delivered_in_a_pdf/", "http://www.boston.com/bigpicture/2012/03/japan_tsunami_pictures_before.html", - 保留注释
    }
    //-----------------------
    var sentence_host_t={};
    var article_from_t=new Set();
    [sentence_host_t,article_from_t]=sub_host_count_ensentence_dict_generate(en_sentence_global);
    
    var article_t=[];
    for (let item of article_from_t){
        article_t.push(['','/['+item,item]);
    }
    var article_host_t=sub_host_count_ensentence_dict_generate(article_t)[0];   //key元素形如 "h_www.vulture.com": 64, - 保留注释
    var article_count=0;
    for (let key in article_host_t){
        article_count=article_count+article_host_t[key];
    }
        
    sentence_host_t=object2array_b(sentence_host_t,true,2);
    sentence_host_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    
    var sentence_len=en_sentence_global.length;
    var result_t=[];
    for (let blxl=0,lent=sentence_host_t.length;blxl<lent;blxl++){
        var one_tr=[];
        var article_host=article_host_t['h_'+sentence_host_t[blxl][0]];
        
        var blhost=sentence_host_t[blxl][0];
        if (blhost.slice(-4,)!=='_TLS'){
            blhost='<span class="span_link" onclick="sentence_source_list_ensentence(\''+specialstr_j(blhost)+'\');">'+blhost+'</span>';
        } else {
            blhost=blhost.slice(0,-4);
        }
        one_tr.push(blhost);
        one_tr.push(sentence_host_t[blxl][1]);
        one_tr.push(sentence_host_t[blxl][1]*100/sentence_len);

        if (article_host==undefined){
            one_tr.push(null);
            one_tr.push(null);
        } else {
            one_tr.push(article_host);
            one_tr.push(article_host*100/article_count);        
            one_tr.push(sentence_host_t[blxl][1]/article_host); //句数/文章数 - 保留注释
        }
        result_t.push(one_tr);
    }
    
    if (sort_no>=0){
        result_t.sort();
        result_t.sort(function (a,b){return a[sort_no]<b[sort_no] ? 1 : -1;});
    }
    
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        var item=result_t[blxl];
        result_t[blxl]='<tr><td align=right>'+(blxl+1)+'</td><td>'+item[0]+'</td><td align=right>'+item[1]+'</td><td align=right>'+item[2].toFixed(2)+'%</td><td align=right>'+item[3]+'</td><td align=right>'+item[4].toFixed(2)+'%</td><td align=right>'+item[5].toFixed(2)+'</td></tr>';
    }
    
    var th='<tr><th nowrap>No.</th><th nowrap>出处</th><th nowrap style="cursor:pointer;" onclick="host_count_ensentence(1);">句数</th><th nowrap>占比</th><th nowrap style="cursor:pointer;" onclick="host_count_ensentence(3);">文章数</th><th nowrap>占比</th><th nowrap style="cursor:pointer;" onclick="host_count_ensentence(5);">句数/文章数</th></tr>';
    document.getElementById('divhtml').innerHTML='<p>Total: '+sentence_len+'</p><table class="table_common">'+th+result_t.join('\n')+'</table>';
}

function klwiki_txtbook_oldwords_diff_ensentence(){
    function sub_klwiki_txtbook_oldwords_diff_ensentence_display(csarr){
        csarr_raw=Array.from(csarr);
        csarr_sorted=rare_old_words_sort_ensentence(csarr_raw);
        var blstr=enwords_array_to_html_b(csarr_sorted);
        blstr=blstr+enwords_js_wiki_textarea_b(csarr_raw,'str');
        return blstr;
    }
    //-----------------------
    var list_t=sentence_wt_b();
    
    var is_remove_square,words_type,csendata_set;
    [is_remove_square,words_type,csendata_set]=get_new_old_rare_words_para_enbook_b();
    
    var klwiki_rare_set=get_new_old_rare_words_set_enbook_b(list_t['w'].toString(),is_remove_square,words_type,csendata_set)[2];
    var txtbook_rare_set=get_new_old_rare_words_set_enbook_b(list_t['t'].toString(),is_remove_square,words_type,csendata_set)[2];
    var intersection_t=array_intersection_b(klwiki_rare_set,txtbook_rare_set,true);
    
    var difference_t=array_difference_b(klwiki_rare_set,txtbook_rare_set,true,true);
    
    var bljg='<h3>klwiki 含有但 txtbook 没有的稀有单词</h3>';
    bljg=bljg+sub_klwiki_txtbook_oldwords_diff_ensentence_display(difference_t[0]);
    bljg=bljg+'<h3>txtbook 含有但 klwiki 没有的稀有单词</h3>';
    bljg=bljg+sub_klwiki_txtbook_oldwords_diff_ensentence_display(difference_t[1]);
    
    bljg=bljg+'<h3>klwiki 和 txtbook 都含有的稀有单词</h3>';
    bljg=bljg+sub_klwiki_txtbook_oldwords_diff_ensentence_display(intersection_t);
    document.getElementById('divhtml').innerHTML=bljg;
}

function enwords_count_sentence_data_save_ensentence(){
    var otextarea=document.getElementById('textarea_rare_words');
    if (!otextarea){return;}
    if (!confirm('是否保存为enwords_count_sentence_data.js？')){return;}
    var list_t=otextarea.value.trim().split('\n');
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]='"'+specialstr_j(list_t[blxl])+'",';
    }   
    string_2_txt_file_b('var en_sentence_count_global=[\n'+list_t.join('\n')+'\n];\n','enwords_count_sentence_data.js','txt');
}

function length_sort_ensentence(is_short=true,do_merge=-1,keep_kleng=true){
    function sub_length_sort_ensentence_group(csarr){
        let bllen=csarr.length;
        let groups=group_2_equal_bins_b(array_split_by_col_b(csarr,[0]),20,keep_kleng);
        for (let blxl=0,lent=groups.length;blxl<lent;blxl++){
            groups[blxl]='<b>'+groups[blxl]['interval'].toString().replace(',','~')+':</b> '+groups[blxl]['values'].length+' ('+(groups[blxl]['values'].length*100/bllen).toFixed(3)+'%)';
        }
        return groups.join('|');
    }

    var t0 = performance.now();
    if (do_merge===-1){
        do_merge=(document.getElementById('select_length_sort_ensentence_type').value=='全句');
    }
    
    var csmax=parseInt(document.getElementById('input_max_result').value);

    var result_t=[];
    var re_combine=sentence_split_status_generate_b();
    for (let blno=0,lent=en_sentence_global.length;blno<lent;blno++){
        var aline=en_sentence_global[blno];
        //if (aline[2].slice(-4,)=='_TLS'){continue;}   //此行保留 - 保留注释
        
        if (do_merge){
            if (Array.isArray(aline[0])){
                var blstr=aline[0].join('');    //不能合并为' ' - 保留注释
            } else {
                var blstr=aline[0];
            }
            if (!keep_kleng){
                blstr=blstr.replace(/&lt;eword w=.*?&gt;&lt;\/eword&gt;/g,'');
            }
            //if (blstr.length>50+10){continue;}  //最短例句长度是50 - 保留注释
            result_t.push([blstr.length,aline]);     
        } else {
            var line_split=sentence_split_b(aline[0],blno,re_combine);
            for (let arow of line_split){
                if (!keep_kleng){
                    arow=arow.replace(/&lt;eword w=.*?&gt;&lt;\/eword&gt;/g,'');
                }
                result_t.push([arow.length,[arow].concat(aline.slice(1,))]);
            }
        }
    }
    
    if (is_short){
        result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    } else {
        result_t.sort(function (a,b){return a[0]<b[0] ? 1 : -1;});    
    }
    
    var groups_full='<font color="'+scheme_global['a-hover']+'">全部：</font>'+sub_length_sort_ensentence_group(result_t);
    result_t=result_t.slice(0,csmax);
    var groups_part='<font color="'+scheme_global['a-hover']+'">部分：</font>'+sub_length_sort_ensentence_group(result_t);

    result_t=array_split_by_col_b(result_t,[1]);
    var bljg=sentence_list_2_html_b(result_t,[''],csmax,false,false,false,true);
    
    var group_reg=quote_reg_button_ensentence();
    document.getElementById('divhtml').innerHTML='<div class="div_sentence">'+bljg.join('\n')+'</div><p><i>('+bljg.length+')</i> '+groups_full+' '+groups_part+'</p><p>'+group_reg[0]+'</p>'+group_reg[1];
    if (keep_kleng){
        sup_kleng_words_b();
    }
    console.log('length_sort_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function rare_old_words_sort_ensentence(csarr){
    var result_t=[].concat(csarr);
    if (klmenu_check_b('span_sort_by_selenium_ensentence',false)){
        var selenium_dict=selenium_enwords_count_enbook_b(true);
        
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            var blkey='w_'+result_t[blxl];
            if (selenium_dict[blkey]==undefined){
                result_t[blxl]=[result_t[blxl],0];
            } else {
                result_t[blxl]=[result_t[blxl],selenium_dict[blkey]];                
            }
        }
        
        result_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            result_t[blxl]=[result_t[blxl][0],'',result_t[blxl][1].toString()];
        }
    } else {
        result_t.sort();
    }
    return result_t;
}

function rare_old_words_form_ensentence(cslist,generate_js){
    var more_buttons='';
    if (generate_js){
        more_buttons='<span class="aclick" onclick="enwords_count_sentence_data_save_ensentence();">save as enwords_count_sentence_data.js file</span>';
    }
    var bljg=enwords_different_types_div_b(cslist,true,'textarea_rare_words','textarea_rare_words','复制,发送到临时记事本,发送地址',more_buttons);
    return bljg;
}
    
function rare_old_words_ensentence(cscaption='',show_sentence=false,generate_js=false,max_count=2,rows_min=10,rows_max=5000,source_check=false){
    function sub_rare_old_words_ensentence_words(words_list){
        for (let aword of words_list){
            var blkey='w_'+aword.toLowerCase(); //否则 一些 Save 之类的在例句中出现次数很少，但 save 出现次数很多，结果 Save 被列为出现次数很少的单词 - 保留注释
            if (result_t[blkey]==undefined){
                result_t[blkey]=[aword,0];
            }
            result_t[blkey][1]=result_t[blkey][1]+1;
        }  
    }
    
    function sub_rare_old_words_ensentence_done(){
        console.log(re_combine);
        
        result_t=object2array_b(result_t);
        result_t.sort();
        result_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});   //出现次数从少到多排列 - 保留注释
        var oldset=simple_words_b(true,true);
        en_word_temp_get_b();
        words_searched_arr_global=[];            
        var blno=0;
        for (let arow of result_t){
            if (!oldset.has(arow[0].toLowerCase())){continue;}
            if (source_check && arow[1]==0){continue;}
            if (arow[1]>=max_count && blno>=rows_min){break;}
            words_searched_arr_global.push(arow[0]);
            blno=blno+1;
        }
        
        if (words_searched_arr_global.length>rows_max){
            words_searched_arr_global.sort(randomsort_b);
            words_searched_arr_global=words_searched_arr_global.slice(0,rows_max);
        }
        words_searched_arr_global=rare_old_words_sort_ensentence(words_searched_arr_global);
        
        var bltextarea=rare_old_words_form_ensentence(words_searched_arr_global,generate_js);
        
        var progress_list=ltp_status_get_b('+例句 +单词','green','white',100);

        var remained_days=days_remained_of_year_b();
        var theyear=new Date().getFullYear();
        var nextyear_days=isLeapYear_b(theyear,1,true);
        var max_in_current_year=(words_searched_arr_global.length+4*remained_days);
        var nextyear_count=words_searched_arr_global.length+4*(remained_days+nextyear_days);

        var blpercent_current=(words_searched_arr_global.length*100/enwords.length).toFixed(2);
        var blpercent_this_year=((words_searched_arr_global.length+max_in_current_year)*100/(enwords.length+max_in_current_year)).toFixed(2);
        var blpercent_next_year=((words_searched_arr_global.length+nextyear_count)*100/(enwords.length+nextyear_count)).toFixed(2);
        
        if (cscaption=='例句最少的单词'){
            local_storage_today_b('estimated_rare_words_count',40,max_in_current_year,'/');
            local_storage_today_b('rare_words_in_old_words_percent',40,blpercent_current,'/');
            local_storage_today_b('estimated_rare_words_percent',40,blpercent_this_year,'/');
        }
        
        var remain_str='当前'+cscaption+'占全部旧单词比为 '+blpercent_current+'%，今年剩余天数 '+remained_days+' 天，按 4个单词/日 计算， '+theyear+' 年内最多产生 '+max_in_current_year+' 个'+cscaption+'，占比 '+blpercent_this_year+'%，至 '+(theyear+1)+' 年底，最多产生 '+nextyear_count+' 个，占比 '+blpercent_next_year+'%';
        
        document.getElementById('divhtml').innerHTML='<p>'+progress_list.join(' ')+'</p><p>'+remain_str+'</p>'+enwords_array_to_html_b(words_searched_arr_global,false)+bltextarea;
        
        if (source_check){
            var local_id='enwords_one_source_ensentence';
        } else {
            var local_id=(max_count>1?'enwords_rare_ensentence':'enwords_non_ensentence');
        }
        local_storage_today_b(local_id,40,words_searched_arr_global.length,'/');
        
        if (show_sentence){
            show_sentence_enwc_b();
        }
        console.log('rare_old_words_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');
    }
    
    function sub_rare_old_words_ensentence_arow(){
        if (blxl>=bllen){
            sub_rare_old_words_ensentence_done();
            return;
        }
        
        var line_split=sentence_split_b(en_sentence_global[blxl][0],blxl,re_combine);
        if (source_check){
            var words_list=new Set(line_split.join('\n').toLowerCase().match(/[a-zA-Z\-']+/mg) || []);
            sub_rare_old_words_ensentence_words(words_list);
        } else {
            for (let aline of line_split){
                var words_list=new Set(aline.match(/[a-zA-Z\-']+/g) || []);
                sub_rare_old_words_ensentence_words(words_list);
            }
        }
        blxl=blxl+1;
        if (blxl % 200 == 0){
            setTimeout(sub_rare_old_words_ensentence_arow,1);
        } else {
            sub_rare_old_words_ensentence_arow();
        }
    }
    //-----------------------
    var t0 = performance.now();    

    var result_t={};
    for (let item of enwords){
        if (item[0].includes(' ')){continue;}   //检索例句时，不考虑含有空格的情况 - 保留注释
        
        var blkey='w_'+item[0].toLowerCase();
        if (result_t[blkey]==undefined){
            result_t[blkey]=[item[0],0];
        }
    }
    console.log('rare_old_words_ensentence() 旧单词部分 费时：'+(performance.now() - t0) + ' milliseconds');

    var blxl=0;
    var bllen=en_sentence_global.length;
    var re_combine=sentence_split_status_generate_b();
    sub_rare_old_words_ensentence_arow();
}

function odd_quote_get_ensentence(csmax=-1,show_button=true,csmobile_font=false,show_html=true){
    if (typeof en_sentence_global == 'undefined'){
        var result_t=['en_sentence_global 未定义'];
    } else {
        var result_t=odd_quote_get_ensentence_b(en_sentence_global,csmax,show_button,csmobile_font,true,-1,false,false,new Set(),false);
    }
    
    var group_reg=quote_reg_button_ensentence();
    var buttons='<span class="aclick" onclick="quote_ignore_ensentence(\'s_quote_space\');">①忽略内部仅有一个s\'或s’的句子</span>';
    buttons=buttons+'<span class="aclick" onclick="quote_ignore_ensentence(\'az_quote_az\');">②忽略含有[a-z][\'’][a-z]但无其他引号的句子</span>';
    buttons=buttons+'<span class="aclick" onclick="quote_ignore_ensentence(\'space_q_quote_09\');">③忽略含有\\s[\'’][0-9]但无其他引号的句子</span>';
    buttons=buttons+'<span class="aclick" onclick="quote_ignore_ensentence(\'all\');">①+②+③</span>';
    buttons=buttons+group_reg[0];

    if (show_html){
	    document.getElementById('divhtml').innerHTML='<div class="div_sentence">'+result_t.join('\n')+'</div><p><i id="i_odd_quote_count_ensentence">('+result_t.length+')</i> '+buttons+'</p>'+group_reg[1];
    }
    return result_t;
}

function quote_reg_button_ensentence(){
    var blstr='<span class="aclick" onclick="quote_reg_result_ensentence();">分组reg检索</span>';
    var bldiv='<div id="div_odd_quote_result_ensentence"></div>';
    return [blstr,bldiv];
}

function quote_reg_result_ensentence(){
    var group_dict={};
    var a_dict={};
    var ops=document.querySelectorAll('p.p_enwords_sentence');
    for (let one_p of ops){
        var odom=document.createElement('p');
        odom.innerHTML=one_p.innerHTML;
        var osups=odom.querySelectorAll('sup.kleng');
        for (let one_sup of osups){
            one_sup.parentNode.removeChild(one_sup);
        }
            
        var str_list=odom.querySelector('span.span_enwords_sentence').innerText.split(/\s+/);
        var bllen=str_list.length;
        var blstart=randint_b(0,Math.max(0,bllen-5));   //至少5个关键词 - 保留注释

        var owiki=odom.querySelector('span.span_from_wiki');
        var blkey='b_'+owiki.innerText; 
        var bllink=(owiki.querySelector('a')?.href || '').split('#')[0];
        if (group_dict[blkey]==undefined){
            group_dict[blkey]=[];
        }
        if (a_dict[blkey]==undefined){
            a_dict[blkey]=bllink;
        }
        group_dict[blkey].push(str_list.slice(blstart,blstart+5).join(' '));
    }
    
    var result_t=[];
    var blxl=0;
    for (let key in group_dict){
        var bljg='<h4>'+(blxl+1)+'. <a href="'+a_dict[key]+'" onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';" target=_blank>'+key.slice(2,)+'</a> ('+group_dict[key].length+')</h4>';
        var add_r=(a_dict[key].includes('/wiki/index.php')?'(:r)':'');        
        bljg=bljg+textarea_for_copy_b('\\b('+group_dict[key].join('|').replace(/\s/g,'\\s').replace(/([\(\)\[\]\.\*\?])/g,'\\$1')+')\\b'+add_r);
        result_t.push('<p>'+bljg+'</p>');
        blxl=blxl+1;
    }
    
    var buttons='<span class="aclick" onclick="document.getElementById(\'div_odd_quote_result_ensentence\').scrollIntoView();">🔝</span>';
    document.getElementById('div_odd_quote_result_ensentence').innerHTML=result_t.join('\n')+'<p>'+buttons+'</p>';
}

function quote_ignore_ensentence(cstype){
    var ops=document.querySelectorAll('p.p_enwords_sentence');
    quote_ignore_ensentence_b(cstype,ops);

    document.getElementById('i_odd_quote_count_ensentence').innerHTML='('+document.querySelectorAll('p.p_enwords_sentence').length+')';
}

function sentence_flag_get_ensentence(csmax=-1,show_button=true,csmobile_font=false){
    function sentence_flag_get_ensentence_word(csstr){
        var matchs=csstr.match(new RegExp('&lt;eword w=(.*?)&gt;&lt;/eword&gt;','g')) || [];
        var words_t=[];
        for (let one_match of matchs){
            var blword=one_match.replace(new RegExp('&lt;eword w=("|&quot;)?(.*?)("|&quot;)?&gt;&lt;/eword&gt;','g'),'$2');
            if (csstr.match(new RegExp('\\b'+blword+one_match))==null){
                if (csstr.match(new RegExp('&lt;u&gt;'+blword+'&lt;/u&gt;'+one_match))==null){
                    words_t.push(blword);
                }
            }
        }
        return new Set(words_t);
    }
    
    if (typeof en_sentence_global == 'undefined'){
        return 'en_sentence_global 未定义';
    }

    var t0 = performance.now();

	var blcount=0;
    var result_t=[];
    var do_break=false;
    var keys=new Set();
    var re_combine=sentence_split_status_generate_b();
	for (let blxl=0,lent=en_sentence_global.length;blxl<lent;blxl++){
        var aline=en_sentence_global[blxl];
        var line_split=sentence_split_b(aline[0],blxl,re_combine);
        for (let arow of line_split){
            if (!arow.includes('&lt;eword w=')){continue;}
            var word_set=(sentence_flag_get_ensentence_word(arow));
            if (word_set.size==0){continue;}
            keys=array_union_b(keys,word_set,true);
            
            result_t.push([arow].concat(aline.slice(1,)));
            blcount=blcount+1;
            if (csmax>=0 && blcount>=csmax){
                do_break=true;
                break;
            } 
        }
        if (do_break){break;}
	}
    console.log(re_combine);
    result_t=sentence_list_2_html_b(result_t,Array.from(keys),csmax,show_button,csmobile_font);
    var bljg=[];
    for (let item of result_t){
        if (!item.includes('🚩')){continue;}
        bljg.push(item);
    }

	document.getElementById('divhtml').innerHTML='<div class="div_sentence">'+bljg.join('\n')+'</div><p><i>('+bljg.length+')</i></p>';
    console.log('sentence_flag_get_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function span_info_show_ensentence(cscontent=''){
    document.getElementById('span_info').innerHTML=cscontent;
}

function exam_generate_ensentence(do_get=true){
    span_info_show_ensentence('生成中...');  
    setTimeout(function (){exam_inputs_ensentence(do_get); span_info_show_ensentence();},1);
}

function exam_inputs_ensentence(do_get=true){   
    if (document.querySelector('.input_ensentence_one_word_exam')){return;}
 
    var empty_percent=parseFloat(document.getElementById('input_ensentence_percent_exam').value.trim());
    if (empty_percent<=0 || empty_percent>=1){return;}
    var odiv=document.getElementById('divhtml');
    odiv.style.display='none';
    if (do_get){
        get_day_sentences();
    }

    var row_min=Math.max(2,parseInt(document.getElementById('input_ensentence_row_min_exam').value.trim()));
    var row_max=Math.max(2,parseInt(document.getElementById('input_ensentence_row_max_exam').value.trim()));
    var remove_full=klmenu_check_b('span_remove_full_exam_ensentence',false);  
    
    var ospans=document.querySelectorAll('span.span_enwords_sentence');
    for (let blxl=0,lent=ospans.length;blxl<lent;blxl++){
        var one_span=ospans[blxl];
        var old_html=one_span.innerHTML;
        var old_str=one_span.textContent;
        var new_str=old_str;
        var words_list=old_str.match(/[a-z\-]+/ig) || [];
        if (words_list.length<row_min){
            if (remove_full){
                one_span.parentNode.outerHTML='';
            }
            continue;
        }

        var raw_list=[].concat(words_list);
        
        var rnd_value=randint_b(1,9);
        for (let blno=0;blno<rnd_value;blno++){
            words_list.sort(randomsort_b);
        }
        
        var bllen=Math.floor(words_list.length*empty_percent);
        if (row_max>2){
            bllen=Math.min(bllen,row_max);
        }
        words_list=words_list.slice(0,bllen);
        if (new Set(words_list).size<row_min){
            if (remove_full){
                one_span.parentNode.outerHTML='';
            }        
            continue;
        }  //避免重复 - 保留注释

        var selected_list=[];        
        for (let one_word of words_list){
            var blat=raw_list.indexOf(one_word);
            selected_list.push(blat);
            new_str=new_str.replace(new RegExp('\\b'+one_word+'\\b'),'<b>'+one_word+'</b>');
        }
        one_span.innerHTML=new_str;
        if (one_span.textContent!==old_str){
            console.log('error',old_str);
            if (remove_full){
                one_span.parentNode.outerHTML='';
            }
            continue;
        }
                
        for (let blno=0,lenb=words_list.length;blno<lenb;blno++){
            var one_word=words_list[blno];
            old_str=old_str.replace(new RegExp('\\b'+one_word+'\\b'),'<input type="text" class="input_ensentence_one_word_exam" />');
            words_list[blno]='<span class="span_box" onclick="copy_2_clipboard_b(this.innerText);">'+words_list[blno]+'</span>';
        }

        one_span.innerHTML=old_str;
        
        selected_list.sort(function (a,b){return a<b?-1:1;});
        for (let blno=0,lenb=selected_list.length;blno<lenb;blno++){
            selected_list[blno]=raw_list[selected_list[blno]];
        }
        one_span.insertAdjacentHTML('afterend','<span class="span_ensentence_words_exam" style="font-size:0.9rem;"> ( '+words_list.join(' | ')+' ) </span><span class="span_box" onclick="exam_answer_ensentence(this);" style="font-size:1.2rem;">🛎</span><textarea style="display:none;">'+en_double_str_b(selected_list.join(','))+'</textarea>');
    }
    odiv.style.display='';
}

function exam_answer_ensentence(ospan){
    var otextarea=ospan.parentNode.querySelector('textarea');
    var answer_list=de_double_str_b(otextarea.value).split(',');
    var oinputs=ospan.parentNode.querySelectorAll('.input_ensentence_one_word_exam');
    var error_count=0;
    for (let blxl=0,lent=oinputs.length;blxl<lent;blxl++){
        if (oinputs[blxl].value.trim()!==answer_list[blxl]){
            oinputs[blxl].style.borderBottomColor='red';
            error_count=error_count+1;
        } else {
            oinputs[blxl].style.borderBottomColor='blue';            
        }
    }
    
    if (error_count==0){
        for (let item of oinputs){
            item.outerHTML='<b>'+item.value+'</b>';
        }    
        otextarea.outerHTML='';
        ospan.parentNode.querySelector('span.span_ensentence_words_exam').outerHTML='';
        ospan.outerHTML='<span style="color:'+scheme_global['green']+'; font-size:1rem;">✔</span>';
    }
}

function standalone_exam_html_generate(){
    if (!document.querySelector('.input_ensentence_one_word_exam')){
        alert('未发现填空');
        return;
    }

    var odiv=document.getElementById('divhtml');
    var oas=odiv.querySelectorAll('span.span_from_wiki a');
    for (let one_a of oas){
        one_a.outerHTML=one_a.innerHTML;
    }
    
    var bltoday=date2str_b();
    var fns=['css_root_style_b','css_root_size_b','ismobile_b','style_generate_b','de_interval_str_b','de_double_str_b','odd_str_b','exam_answer_ensentence','en_style_b','p_enwords_sentence_style_b','style_generate_ensentence','mobile_style_enwc_b','mobile_style_b','local_storage_get_b','copy_2_clipboard_b'];
    
    var blcontent=html_head_generate_b('🇧 Sentence Test '+bltoday,[],false,false)
    +dom_quote_b(['//js函数插入处',fun_2_string_b(fns)])
    +dom_quote_b([
    'scheme_global={',
    scheme_list_for_standalone_b().join('\n'),
    '};',
    "css_root_style_b('17.2','13',['base'],[],1);",
    'en_style_b(true);',
    ])
    +html_head_generate_b(false,[],true,true)
    +'<body style="margin:0.5rem;">'
    +dom_quote_b(['style_generate_ensentence();'])
    +'<h2>🇬🇧 Sentence Test '+bltoday+'</h2>\n<div id="divhtml">\n'
    +odiv.querySelector('div.div_sentence').outerHTML+'</div>'+html_tail_generate_b();

    string_2_txt_file_b(blcontent,'sentence_test_'+bltoday+'.htm','htm');
}

function style_generate_ensentence(){
    var blmobile='.span_ensentence_words_exam {font-size:0.7rem;font-weight:bold;}';
    blmobile=blmobile+'.input_ensentence_one_word_exam {font-size:0.95rem;border:0;border-bottom:0.1rem solid '+scheme_global['color']+';width:3rem;}';
    mobile_style_enwc_b(blmobile,blmobile);
}

function search_sentences(csstr=false){
    var oinput=document.getElementById('input_search');
    if (csstr===false){
        csstr=oinput.value.trim();
    }
    oinput.value=csstr;
    
    enwords_recent_search_b(csstr,'sentence');
    
    var show_button=klmenu_check_b('span_button_show_ensentence',false);
    sentence_search_value_get_b(csstr,false,show_button);
}

function eword_duplicate_ensentence(){
    //search_sentences('eword.*eword.*eword');
    var t0 = performance.now();
    var csmax=parseInt(document.getElementById('input_max_result').value);
    
    var result_t=[];
    for (let blno=0,lent=en_sentence_global.length;blno<lent;blno++){
        var aline=en_sentence_global[blno];
        
        if (Array.isArray(aline[0])){
            var blstr=aline[0].join('');    //不能合并为' ' - 保留注释
        } else {
            var blstr=aline[0];
        }
        
        let blfound=str_reg_search_b(blstr,'\\beword\\b.*\\beword\\b.*\\beword\\b',true);
        if (blfound==-1){break;}        
        if (blfound){
            result_t.push([blstr.length,aline]);
            if (result_t.length>=csmax){break;}
        }
    }

    result_t=array_split_by_col_b(result_t,[1]);
    var bljg=sentence_list_2_html_b(result_t,[''],csmax,false);
    document.getElementById('divhtml').innerHTML='<div class="div_sentence">'+bljg.join('\n')+'</div><p><i>('+bljg.length+')</i></p>';
    console.log('eword_duplicate_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function random_get_ensentence(input_mode=false){
    var t0 = performance.now();

    var show_button=klmenu_check_b('span_button_show_ensentence',false);
    var blmax=parseInt(document.getElementById('input_max_result').value);

    var row_and_col_no_list=[];
    var blsum=0;
    var re_combine=sentence_split_status_generate_b();
	for (let blxl=0,lent=en_sentence_global.length;blxl<lent;blxl++){
        var aline=en_sentence_global[blxl];
        var line_split=sentence_split_b(aline[0],blxl,re_combine);
        row_and_col_no_list.push([blsum,blsum+line_split.length-1]);
        blsum=blsum+line_split.length;
	}
    
    if (row_and_col_no_list.length==0){
        console.log(re_combine);
        return;
    }
    
    var row_no_list=randint_list_b(0,row_and_col_no_list.slice(-1,)[0][1],blmax);
    row_no_list.sort(function (a,b){return a<b?-1:1;});
    
    var bljg=[];
    for (let item of row_no_list){
	    for (let blxl=0,lent=row_and_col_no_list.length;blxl<lent;blxl++){
            var arow=row_and_col_no_list[blxl];
            if (item>=arow[0] && item<=arow[1]){
                var aline=en_sentence_global[blxl];
                var line_split=sentence_split_b(aline[0],blxl,re_combine);
                bljg.push([line_split[item-arow[0]]].concat(aline.slice(1,)));
                break;
            }
        }
    }
    console.log(re_combine);
    var result_t=sentence_list_2_html_b(bljg,[''],blmax,show_button,false);
	var odiv=document.getElementById('divhtml');
    
    if (input_mode){
        odiv.style.display='none';
    }
    
    odiv.innerHTML='<div class="div_sentence">'+result_t.join('\n')+'</div><p><i>('+result_t.length+')</i></p>';

    if (input_mode){
        exam_generate_ensentence(false);
    }
    
    console.log('random_get_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function get_day_sentences(csday='',csmonth='',use_asc=true){
    function sub_get_day_sentences_pages(csyear,csmonth,csday,use_asc=true){
        var list_t=day_range_in_one_month_b(csmonth,csday);
        var bljg='';
        for (let item of list_t){
            bljg=bljg+'<span class="aclick"'+(item==csday?' style="color:red;"':'');
            bljg=bljg+' onclick=\'get_day_sentences('+item+','+csmonth+','+(use_asc?'true':'false')+');\'>';        
            bljg=bljg+csmonth+'月'+item+'日/'+day_2_week_b(csyear+'-'+csmonth+'-'+item,'cnbrief');
            bljg=bljg+'</span> ';
        }
        return bljg;
    }

    var blyear, bldate;
    [blyear,csmonth,csday,bldate]=get_month_day_enwc_b(csday,csmonth);

    var csdays=months_b(csmonth-1)+csday;
    var re_combine=sentence_split_status_generate_b();
    var list_t=[];
    if (use_asc){
        for (let blno=0,lent=en_sentence_global.length;blno<lent;blno++){
            var aline=en_sentence_global[blno];    
            var line_split=sentence_split_b(aline[0],blno,re_combine);
            for (let arow of line_split){
                var asc_t=asc_sum_b(arow);            
                if ((1+asc_t%365)==csdays){
                    list_t.push([arow].concat(aline.slice(1,)));
                }
            }
        }
        list_t.sort(function (a,b){return a[3]>b[3] ? 1 : -1;}); //按 编号 排序 - 保留注释
        list_t.sort(function (a,b){return a[2]>b[2] ? 1 : -1;}); //按 KLWiki title名 或 书名 排序 - 保留注释
    } else {
        en_sentence_to_default_order_b();    
        var blsection=en_sentence_global.length/365;
        var blstart=Math.floor((csdays-1)*blsection);
        var blend=Math.min(en_sentence_global.length,Math.floor(csdays*blsection));
        for (let blno=blstart;blno<blend;blno++){
            var aline=en_sentence_global[blno];    
            var line_split=sentence_split_b(aline[0],blno,re_combine);
            var arow=line_split.join('');
            list_t.push([arow].concat(aline.slice(1,)));
        }
    }
    console.log(re_combine);
    var show_button=klmenu_check_b('span_button_show_ensentence',false);
    var bljg=sentence_list_2_html_b(list_t,[''],500,show_button,false,!use_asc,!use_asc);    
    var pages='<p>'+sub_get_day_sentences_pages(blyear,csmonth,csday,use_asc)+'</p>';
    if (use_asc){
        bljg='<div class="div_sentence">'+bljg.join('\n')+pages+'</div><p><i>('+bljg.length+')</i></p>';
    } else {
        var result_t=[];
        var source='';
        var p_style=en_sentence_p_style_b();
        for (let item of bljg){
            if (item[1]+item[2]!==source){
                result_t.push('<hr />\n<h3>'+item[1]+item[2]+'</h3>');
                source=item[1]+item[2];
            }
            result_t.push(p_style+item[0]+' <sub class="sub_clicked_line_word_count" style="cursor:pointer;" onclick="lines_enword_total_b(this);"></sub></p>');
        }
        bljg='<div class="div_sentence">'+result_t.join('\n')+pages+'</div><p><i>('+bljg.length+'/<span id="span_clicked_line_word_total">0</span>)</i></p>';
    }
	document.getElementById('divhtml').innerHTML=bljg;
    line_count_enwc_b();
    setTimeout(en_sentence_mobile_b,10);
}
