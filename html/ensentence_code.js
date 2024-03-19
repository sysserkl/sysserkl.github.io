function init_ensentence(){
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.8rem':'1.6rem'),true,false,2);
    var input_list=[
    ['input_bcolor',12,0.5],
    ];
    input_size_b(input_list,'id');
    input_with_x_b('input_search',11,'',false,'input_reg',true);
    menu_ensentence();
    input_date_set_enwords_b();
    enwords_init_b();
    enwords_mini_search_frame_style_b();
    enwords_mini_search_frame_form_b();
    en_sentence_source_current_global=[];   //全局变量 - 保留注释
    character_2_icon_b('🗨');
}

function menu_ensentence(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];
    
    var group_list=[
    ['asc','get_day_sentences_enwc_b();',true],
    ['段落','get_day_sentences_enwc_b(\'\',\'\',false);',true],
    ['例句中的旧单词','article_words_list_enwc_b();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'指定日期例句：'));
    
    klmenu1=klmenu1.concat([
    '<span class="span_menu" onclick="'+str_t+'rare_old_words_ensentence(false,true);">例句最少的单词3000</span>',
    '<span class="span_menu" onclick="'+str_t+'rare_old_words_ensentence(false,true,2,10,3000,true);">例句出处唯一的单词3000</span>',
    '<span class="span_menu" onclick="'+str_t+'show_sentence_enwc_b();">显示例句</span>',
    '<span class="span_menu" onclick="'+str_t+'show_new_words_enwc_b(\'span.span_enwords_sentence\',false);">显示例句中的生词</span>',  //get_new_words_arr_enbook_b - 保留注释
    '<span class="span_menu" onclick="'+str_t+'klwiki_txtbook_oldwords_diff_ensentence();">klwiki 和 txtbook 中的稀有单词</span>',    
    ]);
    
    var group_list=[
    ['无例句的单词','rare_old_words_ensentence(true,false,1,0,3000);',true],
    ['词组','phrase_not_in_ensentence();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));

    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'sentence_source_list_ensentence();">例句出处文章列表</span>',    
    '<span class="span_menu" onclick="'+str_t+'host_count_ensentence();">例句出处统计</span>',   
    '<span id="span_reg_ensentence" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',
    ];  
      
    if (is_local_b()){
        klmenu_config.push('<span id="span_sort_by_selenium_ensentence" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 按selenium单词数排序</span>');    
        klmenu_config.push('<span class="span_menu" onclick="'+str_t+'length_sort_ensentence();">最短例句</span>');
    }
    
    var klmenu_link=[
    '<a href="../jsdata/words/enwords_sentence_data.js?'+date2str_b('')+'" onclick="'+str_t+'" target=_blank>enwords_sentence_data.js</a>',    
    '<a href="'+location.origin+'/wiki/index.php/%E7%89%B9%E6%AE%8A:%E6%9C%80%E8%BF%91%E6%9B%B4%E6%94%B9" onclick="'+str_t+'" target=_blank>KLWiki最近更改</a>',        
    '<a href="enwords_book.htm" onclick="'+str_t+'" target=_blank>生词统计</a>',
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🗨','22rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','17rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','15rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_ensentence',true);
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
    for (let blxl=0;blxl<en_sentence_source_current_global.length;blxl++){
        var item=en_sentence_source_current_global[blxl];
        en_sentence_source_current_global[blxl]='<a href=" '+item[1]+'" target=_blank>'+item[2]+'</a>';
    }

    var buttons='<input type="text" id="input_sentence_source" placeholder="出处筛选" value="'+specialstr_j(csstr)+'" onkeyup="if (event.key==\'Enter\'){sentence_source_list_ensentence(this.value);}" />';
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='<p>'+buttons+'</p><div id="div_sentence_source_content" style="margin:1rem;"></div>';
    input_with_x_b('input_sentence_source',11);
    sentence_source_pages_ensentence(1);
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

function phrase_not_in_ensentence(){ 
    var t0 = performance.now();

    var full_t=[];
    var words_found=[];
    for (let item of enwords){
        if (!item[0].includes(' ')){continue;}
        
        var blfound=false;
        for (let one_sentence of en_sentence_global){
            if (one_sentence[0].toString().match(new RegExp('\\b'+item[0]+'\\b','i'))!==null){
                blfound=true;
                break;
            }
        }
        
        if (!blfound){
            full_t.push(item);
            words_found.push(item[0]);
        }
    }
    en_word_temp_get_b();
    words_found.sort();
    full_t.sort();
    
    var odiv=document.getElementById('divhtml');   
    odiv.innerHTML=enwords_array_to_html_b(full_t,false);
    odiv.insertAdjacentHTML('beforeend','<textarea onclick="this.select();document.execCommand(\'copy\');">'+words_found.join('\n')+'</textarea>'+words_2_js_array_ensentence(words_found));
    console.log('phrase_not_in_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function host_count_ensentence(sort_no=-1){
    function sub_host_count_ensentence_dict_generate(csarr){
        var host_t={};
        var article_from_t=new Set();
        
        for (let item of csarr){        
            //item[1]形如：/[https://www.mnn.com/lifestyle/arts-culture/blogs/books-independent-bookstore-arent-dead 20190531 | Starre Vartan: Why paper books and the independent bookstore aren't dead | MNN]/ - 保留注释
        
            var list_t=item[1].match(/^\/\[https?:\/\/([^\/]+)/) || [];  
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
    for (let blxl=0;blxl<sentence_host_t.length;blxl++){
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
        }
        result_t.push(one_tr);
    }
    
    if (sort_no>=0){
        result_t.sort();
        result_t.sort(function (a,b){return a[sort_no]<b[sort_no] ? 1 : -1;});
    }
    
    for (let blxl=0;blxl<result_t.length;blxl++){
        var item=result_t[blxl];
        result_t[blxl]='<tr><td align=right>'+(blxl+1)+'</td><td>'+item[0]+'</td><td align=right>'+item[1]+'</td><td align=right>'+item[2].toFixed(2)+'%</td><td align=right>'+item[3]+'</td><td align=right>'+item[4].toFixed(2)+'%</td></tr>';
    }
    
    var th='<tr><th nowrap>No.</th><th nowrap>出处</th><th nowrap style="cursor:pointer;" onclick="host_count_ensentence(1);">句数</th><th nowrap>占比</th><th nowrap style="cursor:pointer;" onclick="host_count_ensentence(3);">文章数</th><th nowrap>占比</th></tr>';
    document.getElementById('divhtml').innerHTML='<p>Total: '+sentence_len+'</p><table class="table_common">'+th+result_t.join('\n')+'</table>';
}

function klwiki_txtbook_oldwords_diff_ensentence(){
    function sub_klwiki_txtbook_oldwords_diff_ensentence_display(csarr){
        csarr_raw=Array.from(csarr);
        csarr_sorted=rare_old_words_sort_ensentence(csarr_raw);
        var blstr=enwords_array_to_html_b(csarr_sorted);
        for (let blxl=0;blxl<csarr_raw.length;blxl++){
            csarr_raw[blxl]=[csarr_raw[blxl]];
        }
        blstr=blstr+enwords_js_wiki_textarea_b(csarr_raw);
        return blstr;
    }
    //-----------------------
    var list_t=[[],[]];
    for (let arow of en_sentence_global){
        var colno=(arow[2].slice(-4,)=='_TLS'?1:0);
        list_t[colno].push(arow[0]);
    }
    var klwiki_rare_set=get_new_old_rare_words_set_enbook_b(list_t[0].toString())[2];
    var txtbook_rare_set=get_new_old_rare_words_set_enbook_b(list_t[1].toString())[2];
    var intersection_t=array_intersection_b(klwiki_rare_set,txtbook_rare_set,true);
    
    var bljg='<h3>klwiki 含有的稀有单词</h3>';
    bljg=bljg+sub_klwiki_txtbook_oldwords_diff_ensentence_display(klwiki_rare_set);
    bljg=bljg+'<h3>txtbook 含有的稀有单词</h3>';
    bljg=bljg+sub_klwiki_txtbook_oldwords_diff_ensentence_display(txtbook_rare_set);
    
    bljg=bljg+'<h3>klwiki 和 txtbook 都含有的稀有单词</h3>';
    bljg=bljg+sub_klwiki_txtbook_oldwords_diff_ensentence_display(intersection_t);
    document.getElementById('divhtml').innerHTML=bljg;
}

function enwords_count_sentence_data_save_ensentence(){
    var otextarea=document.getElementById('textarea_rare_words');
    if (!otextarea){return;}
    if (!confirm('是否保存为enwords_count_sentence_data.js？')){return;}
    var list_t=otextarea.value.trim().split('\n');
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]='"'+specialstr_j(list_t[blxl])+'",';
    }   
    string_2_txt_file_b('var en_sentence_count_global=[\n'+list_t.join('\n')+'\n];\n','enwords_count_sentence_data.js','txt');
}

function length_sort_ensentence(){
    var t0 = performance.now();

    var result_t=[];
    for (let blno=0;blno<en_sentence_global.length;blno++){
        var aline=en_sentence_global[blno];
        //if (aline[2].slice(-4,)=='_TLS'){continue;}   //此行保留 - 保留注释

        if (Array.isArray(aline[0])){
            var blstr=aline[0].join(' ');
        } else {
            var blstr=aline[0];
        }
        
        blstr=blstr.replace(/&lt;eword w=.*?&gt;&lt;\/eword&gt;/g,'');
        if (blstr.length>50+10){continue;}  //最短例句长度是50 - 保留注释
        result_t.push([blstr.length,aline]);
    }
    
    result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    result_t=result_t.slice(0,200);
    for (blxl=0;blxl<result_t.length;blxl++){
        result_t[blxl]=result_t[blxl][1];
    }
    var bljg=sentence_list_2_html_b(result_t,[''],500,false);
    
    document.getElementById('divhtml').innerHTML='<div class="div_sentence">'+bljg.join('\n')+'</div><p><i>('+bljg.length+')</i></p>';
    console.log('length_sort_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function words_2_js_array_ensentence(csarray){
    var result_t=[];
    for (let aword of csarray){
        result_t.push('"'+specialstr_j(aword)+'"');
    }
    return '<textarea onclick="this.select();document.execCommand(\'copy\');">    var rare_words=new Set(['+result_t.join(',')+']);</textarea>';
}

function rare_old_words_sort_ensentence(csarr){
    var result_t=[].concat(csarr);
    if (klmenu_check_b('span_sort_by_selenium_ensentence',false)){
        var selenium_dict=selenium_enwords_count_enbook_b(true);
        
        for (let blxl=0;blxl<result_t.length;blxl++){
            var blkey='w_'+result_t[blxl];
            if (selenium_dict[blkey]==undefined){
                result_t[blxl]=[result_t[blxl],0];
            } else {
                result_t[blxl]=[result_t[blxl],selenium_dict[blkey]];                
            }
        }
        
        result_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
        for (let blxl=0;blxl<result_t.length;blxl++){
            result_t[blxl]=[result_t[blxl][0],'',result_t[blxl][1].toString()];
        }
    } else {
        result_t.sort();
    }
    return result_t;
}
    
function rare_old_words_ensentence(show_sentence=true,generate_js=false,max_count=2,rows_min=10,rows_max=3000,source_check=false){
    function sub_rare_old_words_ensentence_form(){
        var postpath=postpath_b();
        var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" target=_blank>\n';    
        bljg=bljg+'<p><textarea name="textarea_rare_words" id="textarea_rare_words" style="height:10rem;">'+words_searched_arr_global.join('\n')+'</textarea></p>';
        bljg=bljg+'<p>'   
        if (generate_js){
            bljg=bljg+'<span class="aclick" onclick="enwords_count_sentence_data_save_ensentence();">save as enwords_count_sentence_data.js file</span>';
        }
        bljg=bljg+textarea_buttons_b('textarea_rare_words','复制,发送到临时记事本,发送地址');
        bljg=bljg+'</p></form>';
        return bljg;
    }
    
    function sub_rare_old_words_ensentence_words(words_list){
        for (let aword of words_list){
            var blkey='w_'+aword.toLowerCase(); //否则 一些 Save 之类的在例句中出现次数很少，但 save 出现次数很多，结果 Save 被列为出现次数很少的单词 - 保留注释
            if (result_t[blkey]==undefined){
                result_t[blkey]=[aword,0];
            }
            result_t[blkey][1]=result_t[blkey][1]+1;
        }  
    }
    
    function sub_rare_old_words_ensentence_arow(){
        if (blxl>=bllen){
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
            
            var bltextarea=sub_rare_old_words_ensentence_form();
            
            var progress_list=ltp_status_get_b('+例句 +单词','green','white',100);

            document.getElementById('divhtml').innerHTML='<p>'+progress_list.join(' ')+'</p>'+enwords_array_to_html_b(words_searched_arr_global,false)+bltextarea+words_2_js_array_ensentence(words_searched_arr_global);
            
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
            return;
        }
        
        var line_split=sentence_split_b(en_sentence_global[blxl][0],blxl);
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
    sub_rare_old_words_ensentence_arow();
}
