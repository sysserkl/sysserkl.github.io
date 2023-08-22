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
    }
    else if ('ing'.includes(blitem.slice(-3))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_b_push(word_tmp);
        sub_wordtypes_enbook_b_push(word_tmp+'e');
    }
    else if ('ies,ier,ied'.includes(blitem.slice(-3))){
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

function get_new_words_arr_enbook_b(cstype,csstr='',csobjects=false,maxlength=3,addline=false,append_parent=false,execstring='',ew=false){
    //cstype 1 全部单词 2 未收录 3 已收录 4 wiki 5 js - 保留注释
    //csobjects 在 selenium bible mediawiki_common 等中被调用 - 保留注释
    //------------------
    function sub_get_new_words_arr_enbook_b_objects(){
        var blno=-1;
        for (let item of csobjects){
            blno=blno+1;
            if (blno<csstart){continue;}
            
            if (blno>=csstart+100){
                csstart=csstart+100;
                if (csstart % 200 == 0){
                    console.log('sub_get_new_words_arr_enbook_b_objects()',csstart);
                }
                setTimeout(sub_get_new_words_arr_enbook_b_objects,100);
                return;
            }
            var oldstr=item.innerText;
            var new_line=[];
            var words_list=oldstr.match(/[a-zA-Z\-']+/g) || [];
            if (words_list.length==0){continue;}
                        
            for (let one_new_word of new_words_set){
                if (!words_list.includes(one_new_word)){continue;}
                
                var new_html_str='<span class="span_new_word_search_links" style="color:'+scheme_global['a']+';border-bottom:0.1rem dotted '+scheme_global['memo']+';cursor:pointer;"  onclick="popup_words_links_b(event,\''+specialstr_j(one_new_word)+'\','+ew+');">'+one_new_word+'</span>';

                var oldhtml=item.innerHTML;
                item.innerHTML=oldhtml.replace(new RegExp('\\b'+one_new_word+'\\b'),new_html_str);
                //---
                var is_link=false;
                var ospans_inserted=item.querySelectorAll('span.span_new_word_search_links');
                for (let one_span of ospans_inserted){
                    if (one_span.innerText==one_new_word){
                        is_link=(one_span.parentNode && one_span.parentNode.tagName.toLowerCase()=='a');
                        break;
                    }
                }
                //---
                if (is_link==false && item.innerText==oldstr){
                    //依然会修改一些页面表达，如链接 - 保留注释
                    //item.innerHTML=oldhtml.replace(new RegExp('\\b'+one_new_word+'\\b'),'<span class="span_new_word_search_links" onclick="popup_words_links_b(event,\''+specialstr_j(one_new_word)+'\');">'+one_new_word+'</span>'); //依赖 klbase_eng.js - 保留注释
                    oldstr=item.innerText;
                }
                else {
                    item.innerHTML=oldhtml;
                    if (addline){
                        new_line.push(new_html_str);
                    }
                }
                
                new_words_set.delete(one_new_word);
            }
            if (new_line.length>0){
                if (append_parent==false){
                    item.innerHTML=item.innerHTML+'<p class="p_new_word_search_links" style="line-height:250%;">* '+new_line.join(' ')+'</p>';
                }
                else {
                    item.parentNode.insertAdjacentHTML('afterend','<p class="p_new_word_search_links" style="line-height:250%;">* '+new_line.join(' ')+'</p>');
                }
            }
        }
        if (execstring!==''){
            try {
                eval(execstring);
            }
            catch (error) {
                console.log('get_new_words_arr_enbook_b()',error);
            }                 
        }
        console.log('sub_get_new_words_arr_enbook_b_objects() 费时：'+(performance.now() - t0) + ' milliseconds');
    }
    //-----------------------------------
    var t0 = performance.now();
    if (csobjects!==false){
        var is_scanned=false;
        for (let item of csobjects){
            if (item.querySelector('span.span_new_word_search_links')){
                is_scanned=true;
                break;
            }
        }
        if (is_scanned){
            console.log('get_new_words_arr_enbook_b() 曾扫描过，费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
    }
    csstart=0;
    if (csstr==''){
        var otextarea=document.getElementById('textarea_new_words1');
        if (!otextarea){return;}
        csstr=otextarea.value;
    }
	if (checkbox_kl_value_b('remove_square')==false){
		csstr=csstr.replace(new RegExp("(\\[[^\\[\\]]+\\])","g"),' ');
	}

    var new_words_set=new Set();
    var old_words_set=new Set();    
    var bljgarr2=str_2_array_enbook_b(csstr);
    
    var bltypecheck=checkbox_kl_value_b('words_type_check');
    bltypecheck=(bltypecheck===0?true:bltypecheck);
    
    [new_words_set,old_words_set]=new_old_word_list_enbook_b(bljgarr2,bltypecheck);
    bljgarr2=array_union_b(new_words_set,old_words_set,true);

    var new_words_set10=new Set();
    var old_words_set10=new Set();    
    if (typeof en_words_book_newwords_continue_global!=='undefined' && en_words_book_newwords_continue_global){
        var list10=csstr.trim().split('\n');
        var blstr10=list10.slice(0,parseInt(list10.length*0.1)).join('\n');
        var bljgarr2_10=str_2_array_enbook_b(blstr10);
        [new_words_set10,old_words_set10]=new_old_word_list_enbook_b(bljgarr2_10,bltypecheck);
    }
    
    if (csobjects==false){
        get_new_words_arr_html_enbook_b(cstype,bljgarr2,[new_words_set,old_words_set,new_words_set10,old_words_set10]);
    }
    else {
        sub_get_new_words_arr_enbook_b_objects();
    }
    console.log('get_new_words_arr_enbook_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function new_old_word_list_enbook_b(bljgarr2,check_types=true){
    //提取单词列表
	var endata_t=new Set();
	for (let item of enwords){
        //将空格替换为下划线
		endata_t.add(item[0].replace(new RegExp(' ','g'),'_'));
	}

    //-------------
    var new_words_all_set=new Set();
        
    var new_words_set=new Set();
    var old_words_set=new Set();
    for (let item of bljgarr2){
        if (new_words_all_set.has(item) || new_words_set.has(item) || old_words_set.has(item)){
            continue;
        }
        if (check_types){
            var list_t=wordtypes_enbook_b(item);
        }
        else {
            var list_t=new Set();
            list_t.add(item);
        }
        var blfound=false;
        for (let one_word of list_t){
            if (endata_t.has(one_word)){
                old_words_set.add(one_word);
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
    return [new_words_set,old_words_set];
}

function get_new_words_arr_html_enbook_b(cstype,bljgarr2,list_t){
    //cstype: 1 全部单词 2 未收录 3 已收录 4 wiki 5 js - 保留注释
    var en_new2_total=list_t[0];
    var en_intersection_total=list_t[1];
    //----------------------
    if (en_words_book_newwords_continue_global){
        new_words_continue_enbook_b(en_new2_total.size,list_t[2].size);
        return;
    }
    //----------------------
    var bljg='';
    switch (cstype){
        case 1:
            bljg=new_old_words_html_enbook_b(bljgarr2,'全部单词','all_words');
            break;
        case 2:
            bljg=new_old_words_html_enbook_b(en_new2_total,'未收录单词','new_words');
            break;
        case 3:
            bljg=new_old_words_html_enbook_b(en_intersection_total,'已收录单词','old_words');
            break;
        case 4:
            bljg=enwords_different_types_div_b(Array.from(en_intersection_total));
            break;
    }
    document.getElementById('div_new_words2').innerHTML='<div id="div_sub_words">'+bljg+'</div>';
    
    //未收录单词 - 保留注释
    if (en_words_book_newwords_continue_global===false && cstype==2 && csbookno_global>=0 && csbooklist_sub_global_b[csbookno_global][1]=='Way Station(Clifford D. Simak)' && !document.getElementById('textarea_new_words1').value.includes('已截取')){
        if (confirm('是否更新 Way Station 的未收录单词统计数字：('+en_new2_total.size+')？')){
            local_storage_today_b('enwords_way_station_statistics',40,en_new2_total.size,'/');
        }
    }
}

function new_words_continue_enbook_b(cslength,percent10length=0){
    if (csbookno_global>=0 && en_words_book_newwords_continue_global){
        if (csbookno_global==0){
            if (confirm('是否批量统计生词数量？')==false){
                location.href='?';
                return;
            }
            else {
                all_new_words_count_save_old_data_enbook_b();
                all_new_words_count_set_enbook_b(true,'');
            }
        }
        var newwords_statistics=all_new_words_count_get_enbook_b(true,false);
        
        var today=date2str_b();
        if (newwords_statistics.split('\n')[0].trim()!==today){
            newwords_statistics=today;
        }
        newwords_statistics=newwords_statistics+'\n'+csbooklist_sub_global_b[csbookno_global][0]+' /// '+csbooklist_sub_global_b[csbookno_global][1]+' /// '+cslength+' /// '+percent10length+'\n';
        
        all_new_words_count_set_enbook_b(true,newwords_statistics);
        
        if (csbooklist_sub_global_b.length-1>csbookno_global){
            location.href='?book='+(csbookno_global+1+1)+'&continue';
        }
        else {
            alert('done');
            location.href='?';
        }
    }
}

function all_new_words_count_save_old_data_enbook_b(){
    var blnew=all_new_words_count_get_enbook_b()[0];
    var blold=all_new_words_count_get_enbook_b(false)[0];
    if (blold=='' || confirm('是否将'+blold+'记录替换为'+blnew+'记录？')){
        all_new_words_count_set_enbook_b(false,all_new_words_count_get_enbook_b(true,false));
    }
}

function all_new_words_count_get_enbook_b(iscurrent=true,return_list=true){
    if (iscurrent){
        return local_storage_get_b('enwords_books_all_new_words_current',-1,return_list);
    }
    else {
        return local_storage_get_b('enwords_books_all_new_words_old',-1,return_list);    
    }
}

function all_new_words_count_set_enbook_b(iscurrent=true,csvalue=''){
    if (iscurrent){
        localStorage.setItem('enwords_books_all_new_words_current',csvalue);
    }
    else {
        localStorage.setItem('enwords_books_all_new_words_old',csvalue);    
    }
}

function new_old_words_html_enbook_b(csarray,csname,csaname='',onlytitle=false){    
    var bltitle='';
    if (csaname!==''){
        bltitle=bltitle+'<a name="'+csaname+'"></a>';
    }
    bltitle=bltitle+'<h3>'+csname;
    bltitle=bltitle+'<span style="font-size:0.8rem;">('+csarray.size+')</span>';
    bltitle=bltitle+'</h3>';        
    
    if (onlytitle){
        return bltitle;
    }
    
    var bljg=enwords_array_to_links_b(csarray);
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
            csarray.sort(function (a,b){return reverse_str_b(a)>reverse_str_b(b);});
            break;
        case 'length':
            csarray.sort(function (a,b){return a.length>b.length;});
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

function selenium_local_storage_get_enbook_b(cstype='all'){
    var list_t=local_storage_get_b('selenium_enbook').split('\n');
    if (list_t.length % 4 !== 0){
        console.log('列数不为4',list_t);    //此行保留 - 保留注释
        return [];
    }
    var result_t=[];
    switch (cstype){
        case 'href':
            for (let blxl=0;blxl<list_t.length;blxl=blxl+4){
                result_t.push(list_t[blxl]);
            }    
            break;
        case 'word':
            for (let blxl=3;blxl<list_t.length;blxl=blxl+4){
                result_t.push(list_t[blxl]);
            }         
            break;
        case 'all':
            for (let blxl=0;blxl<list_t.length;blxl=blxl+4){
                result_t.push([list_t[blxl],list_t[blxl+1],list_t[blxl+2],list_t[blxl+3]]);
            }
            break;
    }
    
    return result_t;
}
