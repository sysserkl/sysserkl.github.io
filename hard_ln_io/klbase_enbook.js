function wordtypes_enbook_b(blitem,only_lower_upper=false){
    function sub_wordtypes_enbook_b_push(csword){
        bltmparr.add(csword);
        bltmparr.add(csword.toLowerCase());
        bltmparr.add(csword.toUpperCase());
        bltmparr.add(csword.substring(0,1).toUpperCase()+csword.substring(1,).toLowerCase());
    }
    
	var bltmparr=new Set();
    sub_wordtypes_enbook_b_push(blitem);
    if (only_lower_upper){
        return bltmparr;
    }
    
    var word_tmp;
    if ('pped,gged,nned,lled,dded,ssed'.includes(blitem.slice(-4))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_b_push(word_tmp);
    }
    
    if ('nning,pping,tting'.includes(blitem.slice(-5))){
        word_tmp=blitem.substring(0,blitem.length-4);
        sub_wordtypes_enbook_b_push(word_tmp);   
    }
    
    if ('est'.includes(blitem.slice(-3))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_b_push(word_tmp);
        sub_wordtypes_enbook_b_push(word_tmp+'e');
    } else if ('ing'.includes(blitem.slice(-3))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_b_push(word_tmp);
        sub_wordtypes_enbook_b_push(word_tmp+'e');
    } else if ('ies,ier,ied'.includes(blitem.slice(-3))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_b_push(word_tmp+'y');
    }
    
    if ('ed,es,er'.includes(blitem.slice(-2))){
        word_tmp=blitem.substring(0,blitem.length-2);
        sub_wordtypes_enbook_b_push(word_tmp);
    }
    
    if ('d,s'.includes(blitem.slice(-1))){
        word_tmp=blitem.substring(0,blitem.length-1);
        sub_wordtypes_enbook_b_push(word_tmp);
    }

    return bltmparr;
}

function get_new_old_rare_words_para_enbook_b(){
    var is_remove_square=checkbox_kl_value_b('remove_square');
    var words_type=checkbox_kl_value_b('words_type_check');
    var csendata_set=simple_words_b(true,false,true);   //将空格替换为下划线 - 保留注释
    return [is_remove_square,words_type,csendata_set];    
}

function get_new_old_rare_words_set_enbook_b(csstr,is_remove_square=-1,words_type=-1,csendata_set=false){
    if (csstr==''){
        var otextarea=document.getElementById('textarea_new_words1');
        if (!otextarea){return [false,false,false,false,csstr];}
        csstr=otextarea.value;
    }
    csstr=csstr.trim();
    var is_all_old_def=(csstr.split('\n')[0]=='全部释义');
    
    if (is_remove_square===-1){
        is_remove_square=checkbox_kl_value_b('remove_square');
    }
    
	if (is_remove_square==false){
        csstr=csstr.replace(/\[[^\[\]]+\]/g,' ');
    }
    
    var bljgarr2=str_2_array_enbook_b(csstr);
    
    if (words_type===-1){
        words_type=checkbox_kl_value_b('words_type_check');
    }
    words_type=(words_type===0?true:words_type);
    
    var result_t=new_old_word_list_enbook_b(bljgarr2,words_type,csendata_set).concat([words_type,csstr]);    //[new_words_set,old_words_set,rare_words_set,bltypecheck,csstr] - 保留注释
    if (is_all_old_def){
        local_storage_today_b('all_def_new_words_count',40,result_t[0].size,'/');
    }
    return result_t;
}

function get_new_words_arr_set_enbook_b(cstype,csstr='',div_id='div_new_words2',is_remove_square=-1,words_type=-1,csendata_set=false){
    //cstype 1 全部单词 2 未收录 3 已收录 4 旧单词js_wiki格式 5 稀有旧单词 6 稀有旧单词js_wiki格式 7 新单词js_wiki格式 - 保留注释
    var t0 = performance.now();

    var new_words_set, old_words_set, rare_words_set, bltypecheck;
    [new_words_set,old_words_set,rare_words_set,bltypecheck,csstr]=get_new_old_rare_words_set_enbook_b(csstr,is_remove_square,words_type,csendata_set);
    if (new_words_set===false){return;}
    
    var bljgarr2=array_union_b(new_words_set,old_words_set,true);

    var new_words_set10=new Set();  //10%新单词 - 保留注释
    if (typeof en_words_book_newwords_continue_global!=='undefined' && en_words_book_newwords_continue_global){
        var list10=csstr.trim().split('\n');
        var blstr10=list10.slice(0,parseInt(list10.length*0.1)).join('\n');
        var bljgarr2_10=str_2_array_enbook_b(blstr10);
        new_words_set10=new_old_word_list_enbook_b(bljgarr2_10,bltypecheck)[0]; //old_words_set10
    }
    
    get_new_words_arr_html_enbook_b(cstype,bljgarr2,new_words_set,old_words_set,rare_words_set,new_words_set10.size,div_id);
    
    console.log('get_new_words_arr_set_enbook_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function old_rare_words_jump_enbook_b(cstype,ignore_old=true){
    //cstype: new, rare
    var class_name=cstype+'_word_search_links';
    if (typeof current_new_rare_word_no_global == 'undefined'){
        current_new_rare_word_no_global={'new': -1,'rare': -1};    //new, rare - 保留注释
    }
    
    var ospan_jumps=document.querySelectorAll('span.span_'+class_name);
    var lent=ospan_jumps.length;
    if (lent==0){return;}
    
    if (current_new_rare_word_no_global[cstype]+1>=lent){
        current_new_rare_word_no_global[cstype]=-1;
    }
    
    var selection_top=false;
    var selection_dict=selection_dict_get_b();
    if (selection_dict['startOffset']!==selection_dict['endOffset']){
        var odom=selection_dict['startContainer'];
        if (odom){
            if (!odom.tagName){
                odom=odom.parentNode;
            }
        }
        if (odom.tagName){
            selection_top=odom.getBoundingClientRect().top;
        }
    }
    
    //以下4行用于检验 - 保留注释
    //console.log(selection_top);
    //for (let one_dom of ospan_jumps){
        //console.log(one_dom.parentNode.getBoundingClientRect().top);
    //}
    
    var blfound=false;
    for (let blno=current_new_rare_word_no_global[cstype]+1;blno<lent;blno++){
        if (ignore_old){
            var onext=ospan_jumps[blno].nextSibling;
            if (onext && onext.tagName?.toLowerCase()=='sup' && onext.classList.contains('kleng')){continue;}
        }
        
        if (selection_top!==false){ //在有选中的情况下，从选中的行开始查找 - 保留注释
            if (ospan_jumps[blno].parentNode.getBoundingClientRect().top<selection_top){continue;}
        }
        
        ospan_jumps[blno].scrollIntoView();
        current_new_rare_word_no_global[cstype]=blno;
        blfound=true;
        break;
    }
    
    if (!blfound){
        current_new_rare_word_no_global[cstype]=-1; //不能再递归，避免死循环 - 保留注释
    }
}

function rare_or_new_span_remove_enbook_b(odiv,is_rare){
    var new_or_rare=(is_rare?'rare':'new')+'_word_search_links';

    var removed_list=[];
    var o_span_removes=odiv.querySelectorAll('span.span_'+new_or_rare);
    console.log('需要移除的 span.span_'+new_or_rare+' 有',o_span_removes.length,'个');
    for (let one_remove of o_span_removes){
        removed_list.push(one_remove.innerText);
        one_remove.outerHTML=one_remove.innerHTML;
    }

    var o_p_removes=odiv.querySelectorAll('p.p_'+new_or_rare);
    console.log('需要移除的 p.p_'+new_or_rare+' 有',o_p_removes.length,'个');    
    for (let one_remove of o_p_removes){
        one_remove.outerHTML='';
    }
    //console.log('被移除的单词',removed_list);    //此行保留 - 保留注释
}

function get_new_words_arr_obj_enbook_b(cstype,csstr='',csobjects=false,addline=false,append_parent=false,execstring='',ew=false,border_width_and_style='0.15rem dotted',word_is_in_sentence=''){
    //cstype 1 全部单词 2 未收录 3 已收录 4 旧单词js_wiki格式 5 稀有旧单词 6 稀有旧单词js_wiki格式 7 新单词js_wiki格式 - 保留注释
    //csobjects 在 selenium bible mediawiki_common 等中被调用 - 保留注释
    //-----------------------
    function sub_get_new_words_arr_obj_enbook_b_objects(){
        if (blxl>=bllen){
            if (execstring!==''){
                try {
                    eval(execstring);
                } catch (error){
                    console.log('get_new_words_arr_obj_enbook_b()',error);
                }
            }
            
            //console.log('add_list',add_list); //此行保留 - 保留注释
            console.log('diff1_count',diff1_count,'diff2_count',diff2_count);
            console.log('get_new_words_arr_obj_enbook_b() 添加了 '+new_span_count+' 个 span.span_'+class_name+' 和 '+new_line_count+' 个 p.p_'+class_name+'，与 add_list 相差 '+(add_list.length-new_span_count)+'，费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }

        var item=csobjects[blxl];
        var oldstr=item.innerText;
        var new_line=[];
        var words_added_in_line=[];
        var words_in_txt=new Set(oldstr.match(/[a-zA-Z\-']+/g) || []); //后面的代码只替换相同的单词一次，因此重复无意义 - 保留注释
        if (words_in_txt.size>0){
            for (let one_new_or_rare_word of cs_word_set){
                if (!words_in_txt.has(one_new_or_rare_word)){continue;}
                
                var new_html_str='<span class="span_'+class_name+'" style="'+style_str+'"  onclick="popup_words_links_b(event,\''+specialstr_j(one_new_or_rare_word)+'\','+ew+');">'+one_new_or_rare_word+'</span>';
                var oldhtml=item.innerHTML;
                
                //只替换一次，且替换第一个出现的单词 - 保留注释
                item.innerHTML=oldhtml.replace(new RegExp('\\b'+one_new_or_rare_word+'\\b'),new_html_str);
                //---
                var is_link=false;
                var ospans_inserted=item.querySelectorAll('span.span_'+class_name);
                for (let one_span of ospans_inserted){
                    if (one_span.innerText==one_new_or_rare_word){
                        is_link=(one_span.parentNode && one_span.parentNode.tagName.toLowerCase()=='a');
                        break;
                    }
                }
                //---
                if (is_link==false && item.innerText==oldstr){
                    //依然会修改一些页面表达，如链接 - 保留注释
                    //item.innerHTML=oldhtml.replace(new RegExp('\\b'+one_new_or_rare_word+'\\b'),'<span class="span_new_word_search_links" onclick="popup_words_links_b(event,\''+specialstr_j(one_new_or_rare_word)+'\');">'+one_new_or_rare_word+'</span>'); //依赖 klbase_eng.js - 保留注释
                    oldstr=item.innerText;

                    add_list.push(one_new_or_rare_word);
                    words_added_in_line.push(one_new_or_rare_word);
                } else {
                    item.innerHTML=oldhtml;
                    if (addline){
                        new_line.push(new_html_str);
                        add_list.push(one_new_or_rare_word);
                        //words_added_in_line 不考虑 p 中的单词 - 保留注释
                    }
                }
            }

            if (new_line.length>0){
                var p_str='<p class="p_'+class_name+'" style="line-height:250%;">* '+new_line.join(' ')+'</p>';
                if (append_parent==false){
                    item.insertAdjacentHTML('afterend',p_str);   //添加一行 - 保留注释
                } else {
                    item.parentNode.insertAdjacentHTML('afterend',p_str);   //加在页面底部 - 保留注释
                }
                new_line_count=new_line_count+1;
            }
            
            var added_items=item.querySelectorAll('span.span_'+class_name);
            var added_count=added_items.length;
            new_span_count=new_span_count+added_count;
            new_span_count=new_span_count+new_line.length;
            
            if (words_added_in_line.length!==added_count){
                var span_text_list=[];
                for (let one_added of added_items){
                    span_text_list.push(one_added.innerText);
                }
                [diff1,diff2]=array_difference_b(words_added_in_line,span_text_list,false,true);
                //console.log(diff1,diff2,item.innerText);  //此行保留 - 保留注释
                diff1_count=diff1_count+diff1.length;
                diff2_count=diff2_count+diff2.length;
            }
        }
        
        blxl=blxl+1;

        if (blxl % 100==0){
            setTimeout(sub_get_new_words_arr_obj_enbook_b_objects,1);
        } else {
            sub_get_new_words_arr_obj_enbook_b_objects();
        }
    }

    function sub_get_new_words_arr_obj_enbook_b_start(csinclude,csexclude){
        switch (word_is_in_sentence){   //一共3种状态：全部、include、exclude - 保留注释
            case 'include':
                cs_word_set=csinclude;
                break;
            case 'exclude':
                cs_word_set=csexclude;
                break;
        }
        sub_get_new_words_arr_obj_enbook_b_objects();
    }
    //-----------------------
    var bllen=csobjects.length;
    if (bllen==0){return;}
    if (typeof enwords == 'undefined'){return;}
    
    var t0 = performance.now();
    
    var class_name=(cstype=='2'?'new':'rare')+'_word_search_links';;
    
    var is_scanned=false;
    if (csobjects[0].querySelector('span.span_'+class_name)){
        is_scanned=true;
    }
    if (is_scanned){
        console.log('get_new_words_arr_obj_enbook_b() 曾扫描过，费时：'+(performance.now() - t0) + ' milliseconds');
        return;
    }
        
    var new_words_set, old_words_set, rare_words_set, bltypecheck;
    [new_words_set,old_words_set,rare_words_set,bltypecheck,csstr]=get_new_old_rare_words_set_enbook_b(csstr);
    if (new_words_set===false){return;}    

    var cs_word_set=(cstype=='2'?new_words_set:rare_words_set);
    var cs_word_color=(cstype=='2'?scheme_global['memo']:scheme_global['a-hover']);
    var style_str='color:'+scheme_global['a']+';border-bottom: '+border_width_and_style+' '+cs_word_color+';cursor:pointer;';

    var blxl=0;
    var new_span_count=0;
    var new_line_count=0;
    var add_list=[];
    var diff1,diff2;
    var diff1_count=0;
    var diff2_count=0;
    if (word_is_in_sentence==''){   //一共3种状态：全部、include、exclude - 保留注释
        sub_get_new_words_arr_obj_enbook_b_start();
    } else {
        words_in_sentence_enbook_b(cs_word_set,false,sub_get_new_words_arr_obj_enbook_b_start);
    }
}

function words_in_sentence_enbook_b(words_set,return_list=false,run_fn=false){
    function sub_words_in_sentence_enbook_b_run(){
        if (return_list){
            result_t_include=Array.from(result_t_include);
            result_t_exclude=Array.from(result_t_exclude);        
        }
        
        if (typeof run_fn =='function'){
            run_fn(result_t_include,result_t_exclude);
        }
    }
    
    function sub_words_in_sentence_enbook_b_one(){
        if (blxl>=bllen){
            console.log('words_in_sentence_enbook_b() 费时：'+(performance.now() - t0) + ' milliseconds');
            sub_words_in_sentence_enbook_b_run();        
            return;
        }
        
        var aword=words_list[blxl];
        var blfound=false;
        for (let item of en_sentence_global){   //比提取例句生成单词库后再检索快很多 - 保留注释
            var blstr=item[0].toString();
            if (blstr.match(new RegExp('\\b'+aword+'\\b','i'))){
                blfound=true;
                break;
            }
        }
        if (blfound){
            result_t_include.add(aword);
        } else {
            result_t_exclude.add(aword);
        }
        
        blxl=blxl+1;
        if (blxl%100==0){
            setTimeout(sub_words_in_sentence_enbook_b_one,1);
        } else {
            sub_words_in_sentence_enbook_b_one();
        }
    }

    var result_t_include=new Set();
    var result_t_exclude=new Set();
    
    if (typeof en_sentence_global == 'undefined'){
        sub_words_in_sentence_enbook_b_run();
        return;
    }    

    var t0 = performance.now();
    var blxl=0;
    var words_list=Array.from(words_set);
    var bllen=words_list.length;
    sub_words_in_sentence_enbook_b_one();
}

function new_old_word_list_enbook_b(word_list,check_types=true,csendata_set=false){
    //提取单词列表
    if (csendata_set==false){
	    csendata_set=simple_words_b(true,false,true);   //将空格替换为下划线 - 保留注释
    }
    //-----------------------
    var new_words_all_set=new Set();
        
    var new_words_set=new Set();
    var old_words_set=new Set();
    var rare_words_set=new Set();
    
    if (typeof en_sentence_count_global == 'undefined'){
        en_sentence_count_global=[];
    }
    
    for (let item of word_list){
        if (new_words_all_set.has(item) || new_words_set.has(item) || old_words_set.has(item)){
            continue;
        }
        if (check_types){
            var list_t=wordtypes_enbook_b(item);
        } else {
            var list_t=new Set();
            list_t.add(item);
        }
        
        var blfound=false;
        for (let one_word of list_t){
            if (csendata_set.has(one_word)){
                old_words_set.add(one_word);
                blfound=true;
                break;
            }
        }

        for (let one_word of list_t){
            if (en_sentence_count_global.includes(one_word)){
                rare_words_set.add(one_word);
                break;
            }
        }
        
        if (blfound==false){
            new_words_set.add(item);
            for (let one_type of list_t){
                new_words_all_set.add(one_type);
            }
        }
    }
    return [new_words_set,old_words_set,rare_words_set];
}

function get_new_words_arr_html_enbook_b(cstype,all_words_set,new_words_set,old_words_set,rare_words_set,new_words_set10_size,div_id){
    //cstype: 1 全部单词 2 未收录 3 已收录 4 旧单词js_wiki格式 5 稀有旧单词 6 稀有旧单词js_wiki格式 7 新单词js_wiki格式 - 保留注释
    //-----------------------
    if (typeof en_words_book_newwords_continue_global == 'undefined'){
        en_words_book_newwords_continue_global=false;
    }
    
    if (en_words_book_newwords_continue_global){
        new_words_continue_enbook_b(new_words_set.size,new_words_set10_size);
        return;
    }
    //-----------------------
    var bljg='';
    switch (cstype){
        case 1:
            bljg=new_old_words_html_enbook_b(all_words_set,'全部单词','all_words');
            break;
        case 2:
            bljg=new_old_words_html_enbook_b(new_words_set,'未收录单词','new_words');
            break;
        case 3:
            bljg=new_old_words_html_enbook_b(old_words_set,'已收录单词','old_words');
            break;
        case 4:
            bljg=enwords_different_types_div_b(Array.from(old_words_set));
            break;
        case 5:
            bljg=new_old_words_html_enbook_b(rare_words_set,'稀有旧单词','rare_words');
            break;            
        case 6:
            bljg=enwords_different_types_div_b(Array.from(rare_words_set));
            break;         
        case 7:
            bljg=enwords_different_types_div_b(Array.from(new_words_set));
            break;                 
    }
    var odiv=document.getElementById(div_id);
    if (odiv){
        odiv.innerHTML='<div id="div_sub_words">'+bljg+'</div>';
    } else {
        console.log('未发现 id',div_id);
    }
}

function new_words_continue_enbook_b(cslength,percent10length=0){
    if (csbookno_global<0 || !en_words_book_newwords_continue_global){
        console.log('csbookno_global:',csbookno_global, 'en_words_book_newwords_continue_global:',en_words_book_newwords_continue_global);   //此行保留 - 保留注释
        return;
    }
    
    if (csbookno_global==0){
        if (confirm('是否批量统计生词数量？')==false){
            localStorage.setItem('enbook_filter',book_filter_str_enbook_b());
            location.href='?';
            return;
        } else {
            all_new_words_count_save_old_data_enbook_b();
        }
    }
    var newwords_statistics=all_new_words_count_get_enbook_b(true,true);
    var today=date2str_b();
    if (newwords_statistics[0].trim()!==today){
        if (book_filter_str_enbook_b(true) && confirm('原先缓存非今日记录，是否清空？')){
            newwords_statistics=[];  //非今日则清空缓存原先记录 - 保留注释
        }
    }
    
    var result_t=[today,csbooklist_sub_global[csbookno_global][0]+' /// '+csbooklist_sub_global[csbookno_global][1]+' /// '+cslength+' /// '+percent10length];
    
    var used_id_set=new Set();
    used_id_set.add(csbooklist_sub_global[csbookno_global][0]);
    
    for (let item of newwords_statistics){
        if (!item.includes(' /// ')){continue;} //日期 - 保留注释
        var current_id=item.split(' /// ')[0];
        if (used_id_set.has(current_id)){continue;}
        result_t.push(item);
        used_id_set.add(current_id);
    }
    
    all_new_words_count_set_enbook_b(true,result_t.join('\n'));
    
    if (csbooklist_sub_global.length-1>csbookno_global){
        location.href='?book='+(csbookno_global+1+1)+'&continue';
    } else {
        alert('done');
        localStorage.setItem('enbook_filter',book_filter_str_enbook_b());
        location.href='?';
    }
}

function book_filter_str_enbook_b(return_boolean=false){
    if (return_boolean){
        return local_storage_get_b('enbook_filter')=='englishwords en_minor';
    }
    return 'englishwords en_minor';
}

function all_new_words_count_save_old_data_enbook_b(){
    //批量统计生词 - 保留注释
    var blnew=all_new_words_count_get_enbook_b()[0];
    var blold=all_new_words_count_get_enbook_b(false)[0];
    //不能添加 if (book_filter_str_enbook_b(true)) 判断，以免当月01日的记录被修改无备份 - 保留注释
    if (blold=='' || confirm('是否将'+blold+'的旧记录替换为当前的'+blnew+'新记录？')){
        all_new_words_count_set_enbook_b(false,all_new_words_count_get_enbook_b(true,false));
    }
}

function all_new_words_count_get_enbook_b(iscurrent=true,return_list=true){
    if (iscurrent){
        return local_storage_get_b('enwords_books_all_new_words_current',-1,return_list);
    } else {
        return local_storage_get_b('enwords_books_all_new_words_old',-1,return_list);    
    }
}

function all_new_words_count_set_enbook_b(iscurrent=true,csvalue=''){
    if (iscurrent){
        localStorage.setItem('enwords_books_all_new_words_current',csvalue);
    } else {
        localStorage.setItem('enwords_books_all_new_words_old',csvalue);    
    }
}

function new_old_words_html_enbook_b(csarray,csname='',csaname='',onlytitle=false,oldset=new Set(),show_len=true,show_words_type=false){
    var bltitle=csname;
    if (show_len){
        bltitle=bltitle+'<span style="font-size:0.8rem;">('+csarray.size+')</span>';
    }

    if (bltitle!==''){
        bltitle='<h3>'+bltitle+'</h3>';
    }

    if (csaname!==''){
        bltitle='<a name="'+csaname+'"></a>'+bltitle;
    }
    
    if (onlytitle){
        return bltitle;
    }
    
    var bljg=enwords_array_to_links_b(csarray,oldset);
    var blsort='<b>排序：</b><span class="aclick" onclick="sort_enwords_enbook_b(this,0);">原始</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this);">字母</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this,\'tail\');">尾部</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this,\'length\');">长度</span>';    
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this,\'random\');">随机</span>';

    blsort=blsort+'<span class="aclick" onclick="document.getElementById(\'textarea_enwords_book_'+csaname+'\').select();document.execCommand(\'copy\');">Copy</span>';
    blsort=blsort+'<span class="aclick" onclick="show_hide_words_enbook_b(this);">Show/Hide</span>';

    var select_str='<select class="select_type_enwords_container">'+list_2_option_b(['全部','在例句中','不在例句中'])+'</select>';
    
    var arr_temp=Array.from(csarray);
    return bltitle+'<div class="div_enwords_container"><textarea id="textarea_enwords_book_'+csaname+'" style="height:200px;">'+arr_temp.join(' ')+'</textarea><p>'+select_str+' '+blsort+'</p><div class="div_enwords_links">'+bljg.join(' ')+enwords_batch_div_b(arr_temp,parseInt(Math.random()*99999))+(show_words_type?enwords_different_types_div_b(arr_temp):'')+'</div></div>';
}

function show_hide_words_enbook_b(ospan){
    var odiv=ospan.parentNode.parentNode.querySelector('div.div_enwords_links');
    odiv.style.display=(odiv.style.display==''?'none':'');
}

function words_in_sentence_set_generate_enbook_b(){
    if (typeof words_in_sentence_set_global == 'undefined'){
        words_in_sentence_set_global=new Set();    //全局变量
    }
    if (words_in_sentence_set_global.size==0){
        words_in_sentence_set_global=sentences_2_words_set_enbook_b(false,0,false,true);
        console.log('words_in_sentence_set_global 元素个数',words_in_sentence_set_global.size);
        local_storage_today_b('words_in_sentence_set_global_count',40,words_in_sentence_set_global.size,'/');
    }
}

function sort_enwords_enbook_b(oa,cstype=''){
    var odiv=oa.parentNode.parentNode;
    if (!odiv){return;}
    
    if (odiv.getAttribute('class')!=='div_enwords_container'){return;}
    
    var otextarea=odiv.querySelector('textarea');
    if (!otextarea){return;}
    
    var olinksdiv=odiv.querySelector('div.div_enwords_links');
    if (!olinksdiv){return;}
    
    var oselect_type=odiv.querySelector('select.select_type_enwords_container');
    if (!oselect_type){return;}
    
    var t0 = performance.now();
    var csarray=otextarea.value.trim().split(' ');
    
    if (oselect_type.value.includes('例句')){
        words_in_sentence_set_generate_enbook_b();
        switch (oselect_type.value){
            case '不在例句中':
                csarray=array_difference_b(csarray,Array.from(words_in_sentence_set_global));
                break;
            case '在例句中':
                csarray=array_intersection_b(csarray,Array.from(words_in_sentence_set_global));
                break;        
        }    
    }
    
    switch (cstype){
        case '': //排序 - 保留注释
            csarray.sort();
            break;
        case 'tail':
            csarray.sort(function (a,b){return reverse_str_b(a)>reverse_str_b(b) ? 1 : -1;});
            break;
        case 'length':
            csarray.sort(function (a,b){return a.length>b.length ? 1 : -1;});
            break;            
        case 'random': //随机排序
            csarray.sort(randomsort_b);
            break;
    }
    
    var bljg=enwords_array_to_links_b(csarray);
    olinksdiv.innerHTML=bljg.join(' ')+enwords_batch_div_b(csarray);
    console.log('sort_enwords_enbook_b() 费时：'+(performance.now() - t0) + ' milliseconds'); 
}

function str_2_array_enbook_b(blstr,cstype='set'){
    //中文逗号修改为英文逗号 - 保留注释
	blstr=blstr.replace(new RegExp("’","g"),'\'');
    
	//去掉类型 - 保留注释
    blstr=blstr.replace(new RegExp('\\b'+enword_type_b(true)+'\\b','g'),' ');

	//去掉一些英文单引号后的字符 - 保留注释
    blstr=blstr.replace(/\b[a-zA-Z\'\-_]+\'(s|d|re|t|m|ve|ll)\b/g,' ');
    
    //去掉多个连续- - 保留注释
    blstr=blstr.replace(/\-{2,}/g,' ');

	//去掉&开头接非空字符以;结尾的字符串 - 保留注释
    blstr=blstr.replace(/&[^&;\s]{1,10};/g,' ');

	//去掉&lt;开头&gt;结尾的字符串 - 保留注释
    blstr=blstr.replace(/&lt;[^(&lt;|&gt;)]{1,10}&gt;/g,' ');

	//去掉<开头>结尾的字符串 - 保留注释
    blstr=blstr.replace(/<[^<>]{1,10}>/g,' ');
                
    //去掉了单个字母，并保证第一个字符和最后一个字符为字母 - 保留注释
    var bljgarr2=blstr.match(/\b[a-z][a-z\'\-_]*[a-z]\b/ig) || [];
    
    switch (cstype){
        case 'set':
            bljgarr2=array_unique_b(bljgarr2,true);
            break;
        case 'unique':
            bljgarr2=array_unique_b(bljgarr2,false);
            break;
        case 'list':    //do nothing - 保留注释
            break;
    }

    return bljgarr2;
}

function new_words_in_str_enbook_b(article_arr,simple_split=false,only_lower_upper=false,csresult={},run_fn=false){
    //类似函数：sentences_2_words_set_enbook_b()
    function sub_new_words_in_str_enbook_b_arow(){
        if (blxl>=bllen){
            console.log('new_words_in_str_enbook_b() 费时：'+(performance.now() - t0) + ' milliseconds');
            if (typeof run_fn =='function'){
                run_fn(oldwords.size);
            }
            return;
        }
        
        var blstr=article_arr[blxl].toString().replace(/&lt;eword w=['"]?.*?['"]?&gt;&lt;\/eword&gt;/g,'');
        var list_t=str_2_array_enbook_b(blstr,'list');
        //list_t 形如：[ "There", "are", "large", "number", "of", "minor", "parallels", "that", "might", "be", … ] - 保留注释
        for (let aword of list_t){
            aword=aword.trim();
            if (aword==''){continue;}
            
            var is_new=true;
            var blstr='';
            
            if (new_word_set.has(aword)){
                blstr=aword;
            } else if (oldwords.has(aword) || old_variety.has(aword)){
                blstr=aword;
                is_new=false;
            } else if (!simple_split){
                var variety=wordtypes_enbook_b(aword,only_lower_upper);
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
            if (csresult['w_'+blstr]==undefined){
                csresult['w_'+blstr]=[0,is_new];
            }
            csresult['w_'+blstr][0]=csresult['w_'+blstr][0]+1;
        }
        
        blxl=blxl+1;
        if (blxl % 200 == 0){
            setTimeout(sub_new_words_in_str_enbook_b_arow,1);
        } else {
            sub_new_words_in_str_enbook_b_arow();
        } 
    }

    var t0 = performance.now();

    var oldwords=simple_words_b();
    var old_variety=new Set();
    var new_word_set=new Set();
    
    var blxl=0;
    var bllen=article_arr.length;
    console.log('初始字典key个数',Object.keys(csresult).length,'待分析数组行数',bllen);
    sub_new_words_in_str_enbook_b_arow();   
}

function frequency_words_enbook_b(cstype='',simple_split=false,common_max=4000,csresult={},only_lower_upper=false){
    function sub_frequency_words_enbook_b_done(oldwords_size){
        var new_t,common_t,common_set;
        [new_t,common_t,common_set]=new_and_common_enwords_book_b(csresult,oldwords_size*2,common_max); //2倍旧单词长度 - 保留注释
        switch (cstype){
            case 'sentence_common':
                document.getElementById('textarea_new_words1').value='//'+blcaption+'新单词('+new_t.length+')\n'+new_t.join('\n');
                if (blcaption=='全部' && new_t.length>0){
                    local_storage_today_b('new_words_in_sentences',40,new_t.length,'/');
                }
                get_new_words_arr_set_enbook_b(2,'','div_new_words2',is_remove_square,words_type,csendata_set);
                break;
            case 'textarea':
                get_new_words_arr_set_enbook_b(2,new_t.join(' '),'div_new_words2',is_remove_square,words_type,csendata_set);
                break;
            case 'sentence_rare':
                console.log('frequency_enwords_book() 费时：'+(performance.now() - t0) + ' milliseconds');
                common_word_sign_set_enwords_book_b(common_set);
                break;
            case 'klwiki_en_new':
            case 'dict_plus_wt':
            case 'dict_plus_w':
            case 'dict_plus_t':
            case 'dict_plus_none':
                var oldset=simple_words_b();
                document.getElementById('divhtml').innerHTML=new_old_words_html_enbook_b(new Set(new_t),blcaption+'新单词','',false,oldset,true);
                //document.getElementById('divhtml').innerHTML='<h3>常见新单词<small>('+new_t.length+')</small></h3><p>'+enwords_array_to_links_b(new_t).join(' ')+'</p>';   //此行保留 - 保留注释
                break;
        }
        
        if (!['sentence_rare','klwiki_en_new'].includes(cstype)){
            var otextarea2=document.getElementById('textarea_new_words2');
            if (otextarea2){
                otextarea2.value='var enwords_easy_global=[\n//'+blcaption+'单词('+common_t.length+')\n'+common_t.join('\n')+'\n];\n';
            }
        }
    }

    //-----------------------    
    if (document.querySelector('span.span_common_old_words')){return;}

    var blcaption=(common_max>0?'常见':'全部');
    
    var article_arr=[];
    if (Array.isArray(cstype)){ //当 cstype 是数组时，类型为 klwiki_en_new - 保留注释
        article_arr=[].concat(cstype);
        cstype='klwiki_en_new';
    }

    if (['sentence_common','textarea'].includes(cstype)){
        var is_remove_square,words_type,csendata_set;
        [is_remove_square,words_type,csendata_set]=get_new_old_rare_words_para_enbook_b();
    }
    
    switch (cstype){
        case 'sentence_rare':
        case 'sentence_common':
            if (typeof en_sentence_global !== 'undefined'){
                article_arr=array_split_by_col_b(en_sentence_global,[0]);
            }
            break;
        case 'dict_plus_wt':
        case 'dict_plus_w':
        case 'dict_plus_t':
            var dict_wt=sentence_wt_b();
            if (cstype.startsWith('dict_plus_w')){
                article_arr=article_arr.concat(dict_wt['w']);
            }
            if (cstype.endsWith('t')){
                article_arr=article_arr.concat(dict_wt['t']);
            }
            break;
        case 'textarea':
            article_arr=document.getElementById('textarea_new_words1').value.trim().split('\n');
            break;
    }
    
    new_words_in_str_enbook_b(article_arr,simple_split,only_lower_upper,csresult,sub_frequency_words_enbook_b_done);
}

function new_and_common_enwords_book_b(csresult,cslength,common_max){
    csresult=object2array_b(csresult,true,2);
    csresult.sort();    
    csresult.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    
    var common_set=[];
    for (let blxl=0,lent=csresult.length;blxl<lent;blxl++){
        if (csresult[blxl][1]<=1){
            common_set=csresult.slice(0,blxl);
            break;
        }
    }
    
    for (let blxl=0,lent=common_set.length;blxl<lent;blxl++){
        common_set[blxl]=common_set[blxl][0];
    }
    common_set=new Set(common_set);
    
    csresult=csresult.slice(0,cslength);
    
    var common_list=[];
    var new_t=[];
    for (let blxl=0,lent=csresult.length;blxl<lent;blxl++){
        var item=csresult[blxl];
        common_list.push('"'+specialstr_lt_gt_j(item[0])+'",');
        
        if (item[2]){
            new_t.push(item[0]);
        }
        
        if (common_max>0 && blxl>=common_max && blxl % 100 == 0){
            if (common_list.length>=common_max && new_t.length >=common_max){break;}
        }
    }
    if (common_max>0){
        new_t=new_t.slice(0,common_max);
        common_list=common_list.slice(0,common_max);
    }
    return [new_t,common_list,common_set];
}

function sentences_2_words_set_enbook_b(csarr=false,col_no=-1,simple_split=true,only_lower_upper=false){
    //类似函数：new_words_in_str_enbook_b()

    function sub_sentences_2_words_set_enbook_b_one(item){
        let blstr=item.toString().replace(/&lt;eword w=['"]?.*?['"]?&gt;&lt;\/eword&gt;/g,'');    
        let set_t=str_2_array_enbook_b(blstr,'set');
        for (let aword of set_t){
            if (simple_split){
                words_in_sentence_set.add(aword);
            } else {
                let list_t=wordtypes_enbook_b(aword,only_lower_upper);
                for (let item of list_t){
                    words_in_sentence_set.add(item);
                }
            }
        }
    }

    var t0 = performance.now();
    var words_in_sentence_set=new Set();
    var list_t=[];
    
    if (csarr===false){
        if (typeof en_sentence_global == 'undefined'){
            return words_in_sentence_set;
        } else {
            csarr=en_sentence_global;        
        }
    }
    
    if (col_no>=0){
        for (let item of csarr){
            sub_sentences_2_words_set_enbook_b_one(item[col_no]);
        }
    } else {
        for (let item of csarr){
            sub_sentences_2_words_set_enbook_b_one(item);
        }
    }
    
    console.log('sentences_2_words_set_enbook_b() 费时：'+(performance.now() - t0) + ' milliseconds');
    return words_in_sentence_set;
}

function common_word_sign_set_enwords_book_b(csset){
    var t0 = performance.now();
    var ospans=document.querySelectorAll('span.span_word_combination_enword');
    var ofirst=false;
    for (let one_span of ospans){
        var osub=one_span.querySelector('span.a_word');
        if (!osub){continue;}
        var blword=osub.innerText;
        if (!csset.has(blword)){continue;}
        osub.insertAdjacentHTML('beforebegin','<span class="span_common_old_words">👫</span>');
        if (ofirst===false){
            ofirst=osub;
        }
    }
    if (ofirst!==false){
        ofirst.scrollIntoView();
    }
    console.log('common_word_sign_set_enwords_book_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function selenium_enwords_count_enbook_b(is_original=false,marked_links=[]){
    var csarray=false;
    
    if (is_original){
        if (typeof selenium_enwords_data_original_global !== 'undefined'){
            csarray=selenium_enwords_data_original_global;        
        }    
    } else {
        if (typeof selenium_enwords_data_global !== 'undefined'){
            csarray=selenium_enwords_data_global;
        }
    }
    
    if (csarray===false){return;}

    var selenium_dict={};
    for (let arow of csarray){
        if (marked_links.includes(arow[0])){continue;}
        for (let one_word of arow[3]){
            var blkey='w_'+one_word;
            if (selenium_dict[blkey]==undefined){
                selenium_dict[blkey]=0;
            }
            selenium_dict[blkey]=selenium_dict[blkey]+1;
        }
    }
    return selenium_dict;  
}    

function check_all_new_enbook_b(){
    if (typeof all_new_words_global == 'undefined'){return false;}
    return true;
}

function day_new_enbook_b(csmax=-1,do_filter=false,group_by='y'){
    if (check_all_new_enbook_b()===false){return [];}
    
    switch (group_by){
        case 'y':
            var days=day_of_year_b();   //当年第几天，此行保留 - 保留注释
            var group_len=366;
            break;
        case 'm':
            var days=date_2_ymd_b(false,'d'); //本月第几天，此行保留 - 保留注释
            var group_len=31;
            break;
        default:
            return [];
    }
        
    var result_t=[];
    for (let item of all_new_words_global){
        if (do_filter){
            if (item.length==1 || item.length>15){continue;}
            if (item.split('-').length>=2){continue;}
            if (item.substring(0,1)!==item.substring(0,1).toLowerCase()){continue;} //首字母大写 - 保留注释
        }
        let asc_sum=asc_sum_b(item);
        if (1+asc_sum%group_len==days){
            result_t.push(item);
        }
    }
    if (csmax>0){
        for (let blxl=0;blxl<5;blxl++){
            result_t.sort(randomsort_b);
        }
        result_t=result_t.slice(0,csmax);
    }
    return result_t;
}
