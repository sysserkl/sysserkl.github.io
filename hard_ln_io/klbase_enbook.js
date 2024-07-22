function wordtypes_enbook_b(blitem){
    function sub_wordtypes_enbook_b_push(csword){
        bltmparr.add(csword);
        bltmparr.add(csword.toLowerCase());
        bltmparr.add(csword.toUpperCase());
        bltmparr.add(csword.substring(0,1).toUpperCase()+csword.substring(1,).toLowerCase());
    }
    
	var bltmparr=new Set();
    bltmparr.add(blitem);
    bltmparr.add(blitem.toLowerCase(),blitem.toUpperCase());
    bltmparr.add(blitem.substring(0,1).toUpperCase()+blitem.substring(1,).toLowerCase());
    
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
    
    if (is_remove_square===-1){
        is_remove_square=checkbox_kl_value_b('remove_square');
    }
	if (is_remove_square==false){
		csstr=csstr.replace(new RegExp("(\\[[^\\[\\]]+\\])","g"),' ');
	}
    
    var bljgarr2=str_2_array_enbook_b(csstr);
    
    if (words_type===-1){
        words_type=checkbox_kl_value_b('words_type_check');
    }
    words_type=(words_type===0?true:words_type);
    return new_old_word_list_enbook_b(bljgarr2,words_type,csendata_set).concat([words_type,csstr]);    //[new_words_set,old_words_set,rare_words_set,bltypecheck,csstr] - 保留注释
}

function get_new_words_arr_set_enbook_b(cstype,csstr='',div_id='div_new_words2',is_remove_square=-1,words_type=-1,csendata_set=false){
    //cstype 1 全部单词 2 未收录 3 已收录 4 旧单词js_wiki格式 5 稀有旧单词 6 稀有旧单词js_wiki格式 - 保留注释
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

function get_new_words_arr_obj_enbook_b(cstype,csstr='',csobjects=false,addline=false,append_parent=false,execstring='',ew=false){
    //cstype 1 全部单词 2 未收录 3 已收录 4 旧单词js_wiki格式 5 稀有旧单词 6 稀有旧单词js_wiki格式 - 保留注释
    //csobjects 在 selenium bible mediawiki_common 等中被调用 - 保留注释
    //-----------------------
    function sub_get_new_words_arr_obj_enbook_b_objects(){
        var blno=-1;
        for (let item of csobjects){
            blno=blno+1;
            if (blno<csstart){continue;}
            
            if (blno>=csstart+100){
                csstart=csstart+100;
                if (csstart % 200 == 0){
                    console.log('sub_get_new_words_arr_obj_enbook_b_objects()',csstart);
                }
                setTimeout(sub_get_new_words_arr_obj_enbook_b_objects,1);
                return;
            }
            var oldstr=item.innerText;
            var new_line=[];
            var words_list=oldstr.match(/[a-zA-Z\-']+/g) || [];
            if (words_list.length==0){continue;}
            
            var cs_word_set=(cstype=='2'?new_words_set:rare_words_set);
            var cs_word_color=(cstype=='2'?scheme_global['memo']:scheme_global['a-hover']);

            for (let one_new_or_rare_word of cs_word_set){
                if (!words_list.includes(one_new_or_rare_word)){continue;}
                
                var new_html_str='<span class="span_'+class_name+'" style="color:'+scheme_global['a']+';border-bottom:0.1rem dotted '+cs_word_color+';cursor:pointer;"  onclick="popup_words_links_b(event,\''+specialstr_j(one_new_or_rare_word)+'\','+ew+');">'+one_new_or_rare_word+'</span>';

                var oldhtml=item.innerHTML;
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
                } else {
                    item.innerHTML=oldhtml;
                    if (addline){
                        new_line.push(new_html_str);
                    }
                }
                
                //cs_word_set.delete(one_new_or_rare_word);
            }
            if (new_line.length>0){
                var p_str='<p class="p_'+class_name+'" style="line-height:250%;">* '+new_line.join(' ')+'</p>';
                if (append_parent==false){
                    item.innerHTML=item.innerHTML+p_str;
                } else {
                    item.parentNode.insertAdjacentHTML('afterend',p_str);
                }
            }
        }
        if (execstring!==''){
            try {
                eval(execstring);
            } catch (error){
                console.log('get_new_words_arr_obj_enbook_b()',error);
            }                 
        }
        console.log('sub_get_new_words_arr_obj_enbook_b_objects() 费时：'+(performance.now() - t0) + ' milliseconds');
    }
    //-----------------------
    var t0 = performance.now();
    
    var class_name=(cstype=='2'?'new':'rare')+'_word_search_links';;
    
    var is_scanned=false;
    for (let item of csobjects){
        if (item.querySelector('span.span_'+class_name)){
            is_scanned=true;
            break;
        }
    }
    if (is_scanned){
        console.log('get_new_words_arr_obj_enbook_b() 曾扫描过，费时：'+(performance.now() - t0) + ' milliseconds');
        return;
    }
        
    var new_words_set, old_words_set, rare_words_set, bltypecheck;
    [new_words_set,old_words_set,rare_words_set,bltypecheck,csstr]=get_new_old_rare_words_set_enbook_b(csstr);
    if (new_words_set===false){return;}    

    var csstart=0;
    sub_get_new_words_arr_obj_enbook_b_objects();
    
    console.log('get_new_words_arr_obj_enbook_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function new_old_word_list_enbook_b(bljgarr2,check_types=true,csendata_set=false){
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
    
    for (let item of bljgarr2){
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
                if (en_sentence_count_global.includes(one_word)){
                    rare_words_set.add(one_word);
                }
                blfound=true;
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
    //cstype: 1 全部单词 2 未收录 3 已收录 4 旧单词js_wiki格式 5 稀有旧单词 6 稀有旧单词js_wiki格式 - 保留注释
    //-----------------------
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
    }
    var odiv=document.getElementById(div_id);
    if (odiv){
        odiv.innerHTML='<div id="div_sub_words">'+bljg+'</div>';
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
            newwords_statistics=[today];  //非今日则清空缓存原先记录，并设置为今日日期 - 保留注释
        } else {
            newwords_statistics[0]=today;
        }
    }
    
    var id_name=csbooklist_sub_global[csbookno_global][0]+' /// '+csbooklist_sub_global[csbookno_global][1]; 
    
    var blfound=false;
    for (let blxl=0,lent=newwords_statistics.length;blxl<lent;blxl++){
        if (newwords_statistics[blxl].startsWith(id_name+' /// ')){
            blfound=true;
            newwords_statistics[blxl]=id_name+' /// '+cslength+' /// '+percent10length;
            break;
        }
    }
    
    if (!blfound){
        newwords_statistics.push(id_name+' /// '+cslength+' /// '+percent10length);
    }
    
    all_new_words_count_set_enbook_b(true,newwords_statistics.join('\n'));
    
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

function new_old_words_html_enbook_b(csarray,csname='',csaname='',onlytitle=false,oldset=new Set(),show_len=true){    

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
    var blsort='<span class="aclick" onclick="sort_enwords_enbook_b(this,0);">原始顺序</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this);">排序</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this,\'tail\');">尾部排序</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this,\'length\');">长度排序</span>';    
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook_b(this,\'random\');">随机排序</span>';
    blsort=blsort+'<span class="aclick" onclick="document.getElementById(\'textarea_enwords_book_'+csaname+'\').select();document.execCommand(\'copy\');">复制</span>';
    blsort=blsort+'<span class="aclick" onclick="show_hide_words_enbook_b(this);">Show/Hide</span>';

    return bltitle+'<div class="div_enwords_container"><textarea id="textarea_enwords_book_'+csaname+'" style="height:200px;">'+Array.from(csarray).join(' ')+'</textarea><p>'+blsort+'</p><div class="div_enwords_links">'+bljg.join(' ')+enwords_batch_div_b(Array.from(csarray),parseInt(Math.random()*99999))+'</div></div>';
}

function show_hide_words_enbook_b(ospan){
    var odiv=ospan.parentNode.parentNode.querySelector('div.div_enwords_links');
    odiv.style.display=(odiv.style.display==''?'none':'');
}

function sort_enwords_enbook_b(oa,cstype=''){
    var odiv=oa.parentNode.parentNode;
    if (!odiv){return;}
    
    if (odiv.getAttribute('class')!=='div_enwords_container'){return;}
    
    var otextarea=odiv.querySelector('textarea');
    if (!otextarea){return;}
    
    var olinksdiv=odiv.querySelector('div.div_enwords_links');
    if (!olinksdiv){return;}
    
    var t0 = performance.now();
    var csarray=otextarea.value.trim().split(' ');
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

function frequency_enwords_book_b(cstype='',simple_split=false,common_max=4000){
    function sub_frequency_enwords_book_b_arow(){
        if (blxl>=bllen){
            var new_t,common_t,common_set;
            [new_t,common_t,common_set]=new_and_common_enwords_book_b(result_t,oldwords.size*2,common_max); //2倍旧单词长度 - 保留注释
            switch (cstype){
                case 'sentence_common':
                    document.getElementById('textarea_new_words1').value='//常见新单词('+new_t.length+')\n'+new_t.join('\n');
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
                    var oldset=simple_words_b();
                    document.getElementById('divhtml').innerHTML=new_old_words_html_enbook_b(new Set(new_t),'常见新单词','',false,oldset,true);
                    
                    //document.getElementById('divhtml').innerHTML='<h3>常见新单词<small>('+new_t.length+')</small></h3><p>'+enwords_array_to_links_b(new_t).join(' ')+'</p>';   //此行保留 - 保留注释
                    break;
            }
            if (!['sentence_rare','klwiki_en_new'].includes(cstype)){
                document.getElementById('textarea_new_words2').value='var enwords_easy_global=[\n//常见单词('+common_t.length+')\n'+common_t.join('\n')+'\n];\n';
            }
            console.log('frequency_enwords_book() 费时：'+(performance.now() - t0) + ' milliseconds');
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
            } else if (oldwords.has(aword) || old_variety.has(aword)){
                blstr=aword;
                is_new=false;
            } else if (!simple_split){
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
            setTimeout(sub_frequency_enwords_book_b_arow,1);
        } else {
            sub_frequency_enwords_book_b_arow();
        } 
    }
    //-----------------------
    if (document.querySelector('span.span_common_old_words')){return;}
    var t0 = performance.now();

    var oldwords=simple_words_b();
    var old_variety=new Set();
    var result_t={};
    var new_word_set=new Set();
    
    if (['sentence_common','textarea'].includes(cstype)){
        var is_remove_square,words_type,csendata_set;
        [is_remove_square,words_type,csendata_set]=get_new_old_rare_words_para_enbook_b();
    }
    
    var article_arr=[];
    if (Array.isArray(cstype)){
        article_arr=[].concat(cstype);       
        cstype='klwiki_en_new';
    } else {
        switch (cstype){
            case 'sentence_rare':
            case 'sentence_common':
                if (typeof en_sentence_global !== 'undefined'){
                    for (let item of en_sentence_global){
                        article_arr.push(item[0]);
                    }
                }
                break;
            case 'textarea':
                article_arr=document.getElementById('textarea_new_words1').value.trim().split('\n');
                break;
        }
    }
    var blxl=0;
    var bllen=article_arr.length;
    sub_frequency_enwords_book_b_arow();   
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
        
        if (blxl>=common_max && blxl % 100 == 0){
            if (common_list.length>=common_max && new_t.length >=1000){break;}
        }
    }
    new_t=new_t.slice(0,1000);
    common_list=common_list.slice(0,common_max);
    return [new_t,common_list,common_set];
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
