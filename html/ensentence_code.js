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
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'get_day_sentences_enwc_b();">指定日期例句(asc)</span>',
    '<span class="span_menu" onclick="'+str_t+'get_day_sentences_enwc_b(\'\',\'\',false);">指定日期例句(段落)</span>',        
    '<span class="span_menu" onclick="'+str_t+'minimum_ensentence();">例句最少的单词300</span>',
    '<span class="span_menu" onclick="'+str_t+'random_scan_ensentence('+(ismobile_b()?20:100)+');">随机扫描例句最少的单词</span>',
    '<span class="span_menu" onclick="'+str_t+'rare_old_words_ensentence();">例句最少的单词2000</span>',    
    '<span class="span_menu" onclick="'+str_t+'none_ensentence();">无例句的单词</span>',
    '<span class="span_menu" onclick="'+str_t+'show_new_words_enwc_b(\'span.span_enwords_sentence\',false);">显示例句中的生词</span>',    
    ];

    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'sentence_source_list_ensentence();">例句出处文章列表</span>',    
    '<span class="span_menu" onclick="'+str_t+'host_count_ensentence();">例句出处统计</span>',    
    '<span id="span_reg_ensentence" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',
    '<a href="../jsdata/words/enwords_sentence_data.js?'+date2str_b('')+'" onclick="'+str_t+'" target=_blank>enwords_sentence_data.js</a>',    
    '<a href="'+location.origin+'/wiki/index.php/%E7%89%B9%E6%AE%8A:%E6%9C%80%E8%BF%91%E6%9B%B4%E6%94%B9" onclick="'+str_t+'" target=_blank>KLWiki最近更改</a>',    
    ];    

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🗨','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','17rem','1rem','1rem','60rem'),'','0rem')+' ');
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
    }
    else{
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
    
    var blstart=(csno-1)*csmax;
    var list_t=en_sentence_source_current_global.slice(blstart,blstart+csmax);

    var pages_count=Math.ceil(en_sentence_source_current_global.length/csmax);
    
    var blstr='';
    if (pages_count>1){
        for (let blxl=1;blxl<=pages_count;blxl++){
            blstr=blstr+page_one_b(pages_count,csno,blxl,'onclick="sentence_source_pages_ensentence('+blxl+','+csmax+');"'+(blxl==csno?' style="color:red;"':''),0,0);
        }
        var blfound;
        [blstr,blfound]=page_remove_dot_b(blstr);
        if (blfound){
            blstr=blstr+page_prev_next_b(pages_count,csno,'onclick="sentence_source_pages_ensentence('+(csno-1)+','+csmax+');"','onclick="sentence_source_pages_ensentence('+(csno+1)+','+csmax+');"','onclick="sentence_source_location_ensentence('+pages_count+','+csmax+');"');
        }
    }
    odiv.innerHTML=array_2_li_b(list_t)+blstr;
    odiv.parentNode.scrollIntoView();
}

function sentence_source_location_ensentence(cspages,csmax){
    var blno=parseInt((prompt('输入页号',cspages) || '').trim());
    if (isNaN(blno)){return;}
    blno=Math.min(cspages,Math.max(1,blno));
    sentence_source_pages_ensentence(blno,csmax);
}

function minimum_ensentence(){
    en_word_temp_get_b();
    words_searched_arr_global=[];
    for (let item of en_sentence_count_global){
        for (let item2 of enwords){
            if (item2[0]==item[0]){
                words_searched_arr_global.push(item2);
                break;
            }
        }
    }
    document.getElementById('divhtml').innerHTML=enwords_array_to_html_b(words_searched_arr_global,false)+enwords_batch_div_b(words_searched_arr_global,'');
    show_sentence_enwc_b();
}

function none_ensentence(){
    function sub_none_ensentence_one(){
        if (blxl>=bllen){
            var simple_t=array_difference_b(oldwords,sentence_words,true);
            var full_t=[];
            var words_found=[];
            for (let item of enwords){
                if (item[0].includes(' ')){
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
                else {
                    if (simple_t.has(item[0])){
                        full_t.push(item);
                        words_found.push(item[0]);                        
                    }
                }
            }
            en_word_temp_get_b();
            words_found.sort();
            full_t.sort();
            odiv.innerHTML=enwords_array_to_html_b(full_t,false);    
            odiv.insertAdjacentHTML('beforeend','<textarea onclick="this.select();document.execCommand(\'copy\');">'+words_found.join('\n')+'</textarea>');
            local_storage_today_b('enwords_non_ensentence',40,words_found.length,'/');
            document.title=old_title;
            console.log('none_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');                     
            return;
        }
        var list_t=new Set(en_sentence_global[blxl][0].toString().match(/\b[a-z\-\']+\b/ig) || []);    //有可能是数组，不含空格 - 保留注释
        sentence_words=array_union_b(sentence_words,list_t,true);
        blxl=blxl+1;
        if (blxl % 500 == 0){
            var intersection=array_intersection_b(sentence_words,oldwords,true);
            sentence_words=array_difference_b(sentence_words,intersection,true);
            oldwords=array_difference_b(oldwords,intersection,true);
            
            var blpercent=(blxl*100/bllen).toFixed(0)+'%';
            odiv.innerHTML='检索中...'+blpercent;
            document.title=blpercent+' - '+old_title;
            setTimeout(sub_none_ensentence_one,1);
        }
        else {
            sub_none_ensentence_one();
        }
    }
    //-------------------------------
    if (!confirm('是否检索无例句单词？')){return;}
    
    var t0 = performance.now();
    
    var old_title=document.title;
    var oldwords=simple_words_b(true);
    var sentence_words=new Set();
    var odiv=document.getElementById('divhtml');
    var blxl=0;
    var bllen=en_sentence_global.length;
    sub_none_ensentence_one();
}

function host_count_ensentence(){
    var result_t=new Set();
    for (let item of en_sentence_global){
        //item[1]形如：/[https://www.mnn.com/lifestyle/arts-culture/blogs/books-independent-bookstore-arent-dead 20190531 | Starre Vartan: Why paper books and the independent bookstore aren't dead | MNN]/ - 保留注释
    
        var list_t=item[1].match(/\/\[https?:\/\/[^\s]+/g);  
        if (list_t==null){continue;}
        var blstr=list_t[0];    //形如：/[https://www.rogerebert.com/reviews/a-single-man-2009 - 保留注释
        blstr=blstr.substring(2,);
        result_t.add(blstr);
    }
    
    result_t=Array.from(result_t);
    host_t={};
    var bltotal=0;
    for (let item of result_t){
        item=item.match(/https?:\/\/[^\/]+/g)[0];  //形如 https://www.zdnet.com - 保留注释
        item=item.split('//')[1];
        if (host_t['h_'+item]==undefined){
            host_t['h_'+item]=0;
        }
        host_t['h_'+item]=host_t['h_'+item]+1;
        bltotal=bltotal+1;
    }
    host_t=object2array_b(host_t,true);
    host_t.sort(function (a,b){return a[1]<b[1];});
    for (let blxl=0;blxl<host_t.length;blxl++){
        var blhost=host_t[blxl][0].substring(2,);
        blhost='<span class="span_link" onclick="sentence_source_list_ensentence(\''+specialstr_j(blhost)+'\');">'+blhost+'</span>';
        host_t[blxl]=blhost+': '+host_t[blxl][1]+', '+(host_t[blxl][1]*100/bltotal).toFixed(2)+'%';
    }
    document.getElementById('divhtml').innerHTML='<p>Total: '+bltotal+'</p>'+array_2_li_b(host_t);
}


function random_scan_ensentence(csmax=-1){
    function sub_random_scan_ensentence_one_word(){
        if (blxl<bllen){
            var list_t=en_sentence_result_b(enwords[blxl][0],2,'',path_list[0],path_list[1],path_list[2]);  //读取旧单词例句 - 保留注释
            if (list_t[1]==1){
                result_t.push(en_one_word_b(enwords[blxl],[-1,0],'',false)+'<div class="div_sentence">'+list_t[0]+'</div>');
                just_words.push(enwords[blxl][0]);
            }
            blxl=blxl+1;
            if (csmax>=0 && result_t.length>=csmax){
                blxl=bllen;
            }
            if (blxl % 200 == 0){
                document.getElementById('divhtml').innerHTML=blxl+'/'+bllen+'...';
                setTimeout(sub_random_scan_ensentence_one_word,1);
            }
            else {
                sub_random_scan_ensentence_one_word();
            }
        }
        else {
            console.log('random_scan_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');   
            var bljg=array_2_li_b(result_t)+'<textarea onclick="this.select();document.execCommand(\'copy\');">'+just_words.join('\n')+'</textarea>';
            document.getElementById('divhtml').innerHTML=bljg;
        }
    }
    //--------------------------
    var t0 = performance.now();    
    en_word_temp_get_b();
    
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    enwords.sort(randomsort_b);
    var bllen=enwords.length;
    var blxl=0;
    var result_t=[];
    var just_words=[];
    if (is_local_b()){
        var path_list=[remote_host+'/wikiuploads/',remote_host+'/wiki/index.php/',remote_host+'/klwebphp/PythonTools/data/selenium_news/html/txtlistsearch.htm?_tag'];
    }
    else {
        var path_list=['','',klbase_sele_path_b()[1]+'/html/txtlistsearch.htm?_tag'];    
    }
    document.getElementById('divhtml').innerHTML=blxl+'/'+bllen+'...';
    setTimeout(sub_random_scan_ensentence_one_word,1);
}

function rare_old_words_ensentence(){
    function sub_rare_old_words_ensentence_arow(){
        if (blxl>=bllen){
            result_t=object2array_b(result_t,true,2);
            result_t.sort(function (a,b){return a[1]>b[1];});

            var oldset=simple_words_b(true,true);
            en_word_temp_get_b();
            words_searched_arr_global=[];            
            var blno=0;
            for (let arow of result_t){
                if (!oldset.has(arow[0].toLowerCase())){continue;}
                words_searched_arr_global.push(arow[0]);
                blno=blno+1;
                if (blno>=2000){break;}
            }
            var bltextarea='<textarea onclick="this.select();document.execCommand(\'copy\');">'+words_searched_arr_global.join('\n')+'</textarea>';
            document.getElementById('divhtml').innerHTML=enwords_array_to_html_b(words_searched_arr_global,false)+bltextarea;
            show_sentence_enwc_b();            
            console.log('rare_old_words_ensentence() 费时：'+(performance.now() - t0) + ' milliseconds');           
            return;
        }
        
        var aline=en_sentence_global[blxl];
        var line_split=sentence_split_b(aline[0],blxl);
        for (let aline of line_split){
            var words_list=new Set(aline.match(/[a-zA-Z\-']+/g) || []);
            for (let aword of words_list){
                var blkey='w_'+aword.toLowerCase(); //否则 一些 Save 之类的在例句中出现次数很少，但 save 出现次数很多，结果 Save 被列为出现次数很少的单词 - 保留注释
                if (result_t[blkey]==undefined){
                    result_t[blkey]=0;
                }
                result_t[blkey]=result_t[blkey]+1;
            }
        }
        blxl=blxl+1;
        if (blxl % 200 == 0){
            setTimeout(sub_rare_old_words_ensentence_arow,1);
        }
        else {
            sub_rare_old_words_ensentence_arow();
        }
    }
    //------------------
    var t0 = performance.now();    

    var result_t={};
    var blxl=0;
    var bllen=en_sentence_global.length;
    sub_rare_old_words_ensentence_arow();
}
