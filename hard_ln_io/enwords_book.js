function args_enbook(){
    var bltag='englishwords en_minor';
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：enwords.htm?s=english& - 保留注释
        //第一次处理 - 保留注释
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();
            if (bltmpstr=='continue'){
                en_words_book_newwords_continue_global=true;
                break;
            }
        }
        //第二次处理 - 保留注释
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();

            if (bltmpstr.substring(0,5)=='book='){
                let list_t=bltmpstr.substring(5,).split('_');    //如book=2_5 - 保留注释
                csbookno_global_b=parseInt(list_t[0])-1;
                if (list_t.length>1){
                    csbookno2_global_b=parseInt(list_t[1])-1;
                }
                books_b(true,'eng',bltag);
                import_book_js_b(false);
                break;
            }
            else if (bltmpstr.substring(0,7)=='allnew='){
                var new_words_str=bltmpstr.substring(7,);
                var otextarea=document.getElementById('textarea_new_words1');
                if (otextarea){
                    otextarea.value=new_words_str;
                }
                in_all_new_words_enbook();
                get_new_words_arr_enbook(2);
                books_b(true,'eng',bltag);
                break;
            }
            else if (bltmpstr=='excluded'){
                exclude_words_enbook();
                break;
            }            
        }
    }
    else {
        books_b(true,'eng',bltag);
    }
}

function space2underline_enbook(){
    if (confirm("是否替换单词间空格为下划线？")==false){return;}
    var otextarea=document.getElementById('textarea_new_words1');
    var blstr=otextarea.value.trim();
    while (true){   //考虑 get a grip 等形式 - 保留注释
        if (blstr.match(/([a-z]) +([a-z])/)==null){break;}
        blstr=blstr.replace(new RegExp(/([a-z]) +([a-z])/,'ig'),'$1_$2'); 
    }
    otextarea.value=blstr;
}

function new_words_form_enbook(){
    var bljg='<p>第一组</p>';
    bljg=bljg+'<textarea id="textarea_new_words1"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:get_new_words_arr_enbook(1);">全部单词</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:get_new_words_arr_enbook(2);">新单词</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:get_new_words_arr_enbook(3);">旧单词</span> ';

    bljg=bljg+'<span class="aclick" onclick="javascript:in_all_new_words_enbook(\'include\');">已在全部新单词中的新单词</span> ';        
    bljg=bljg+'<span class="aclick" onclick="javascript:in_all_new_words_enbook();">不在全部新单词中的新单词</span> ';    
    bljg=bljg+'<span class="aclick" onclick="javascript:old_words_in_sentence_enbook();">最少例句中的旧单词</span> ';        

    bljg=bljg+'<span class="aclick" onclick="javascript:textarea_shift_enbook();">对调</span> ';    
    bljg=bljg+'<span class="aclick" onclick="javascript:space2underline_enbook();">替换单词间空格为下划线</span> ';      
    bljg=bljg+'<span class="aclick" onclick="javascript:filter_enbook();">筛选</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'textarea_new_words1\').select();document.execCommand(\'copy\');">复制</span> ';    
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'textarea_new_words1\').value=\'\';">清空</span> ';

    bljg=bljg+'<br />'+checkbox_kl_b('remove_square','删除方括号[](否则方括号中的内容视为音标而不收录')+' ';
    bljg=bljg+checkbox_kl_b('newwords_one_textarea','WIKI格式单词放在一个编辑框内','',true)+' ';
    bljg=bljg+checkbox_kl_b('words_type_check','检验单词类型','',true)+' ';    
    bljg=bljg+' <span id="span_book_lines_count"></span>';
    bljg=bljg+' 前：<input type="text" id="input_first_lines" value="10%">行 <span class="aclick" onclick="javascript:textarea_first_lines_enbook();">截取</span>';   
    bljg=bljg+'</p>';
    bljg=bljg+'<p>第二组</p>';
    bljg=bljg+'<textarea id="textarea_new_words2"></textarea>';
    bljg=bljg+'<p><span class="aclick" onclick="javascript:get_new_words_group_enbook();">分组比较(无扩展)</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'textarea_new_words2\').select();document.execCommand(\'copy\');">复制</span> ';    
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'textarea_new_words2\').value=\'\';">清空</span> ';    
    bljg=bljg+'<span id=booklinks></span>';
    bljg=bljg+'<p>结果：</p><div id="div_new_words2" style="max-width:900px;font-family:Noto Sans;"></div>';
    document.getElementById('divhtml').innerHTML=bljg;
    
    input_size_b([["input_first_lines",5]],'id');
}

function filter_enbook(){
    var blstr=document.getElementById('textarea_new_words1').value.trim();
    if (blstr==''){return;}
    var blkey=prompt('输入筛选关键字：') || '';
    if (blkey==''){return;}
    
    var is_reg=false;
    if (blkey.slice(-4,)=='(:r)'){
        blkey=blkey.slice(0,-4);
        is_reg=true;
    }
    var result_t=new Set();
    var list_t=blstr.split(' ');
    for (let item of list_t){
		var blfound=str_reg_search_b(item,blkey,is_reg);
		if (blfound==-1){
			break;
		}        
        if (blfound){
            result_t.add(item);
        }
    }
    var otextarea2=document.getElementById('textarea_new_words2');
    otextarea2.value=Array.from(result_t).join(' ');
}

function in_all_new_words_enbook(cstype='exclude'){
    var csstr=document.getElementById('textarea_new_words1').value.trim();
    
    var new_words_set=new Set();
    var old_words_set=new Set();    
    var bljgarr2=str_2_array_enbook(csstr,true);
    [new_words_set,old_words_set]=get_new_words_arr_enbook2(bljgarr2,checkbox_kl_value_b('words_type_check'));
    
    var result_t_include=[];
    var result_t_exclude=[];
    for (let item of new_words_set){
        if (all_new_words_global.includes(item) || all_new_words_global.includes(item.toLowerCase())){
            result_t_include.push(item);
        }
        else {
            result_t_exclude.push(item);        
        }
    }
    var bljg='';
    if (cstype=='' || cstype=='include'){
        bljg=bljg+'已在新单词库中的新单词：'+result_t_include.join(' ')+'\n';
    }
    if (cstype=='' || cstype=='exclude'){
        bljg=bljg+'不在新单词库中的新单词：'+result_t_exclude.join(' ')+'\n';
    }
    document.getElementById('textarea_new_words2').value=bljg;
}

function old_words_in_sentence_enbook(){
    var csstr=document.getElementById('textarea_new_words1').value.trim();
    
    var new_words_set=new Set();
    var old_words_set=new Set();    
    var bljgarr2=str_2_array_enbook(csstr,true);
    [new_words_set,old_words_set]=get_new_words_arr_enbook2(bljgarr2,checkbox_kl_value_b('words_type_check'));
    
    if (typeof no_article_enwords_global == 'undefined'){
        no_article_enwords_global=[];
    }
    var intersection=array_intersection_b(old_words_set,Array.from(en_sentence_count_global).concat(no_article_enwords_global));

    var bljg='最少例句中的旧单词：'+Array.from(intersection).join(' ')+'\n';
    document.getElementById('textarea_new_words2').value=bljg;
}

function wordtypes_enbook(blitem){
    function sub_wordtypes_enbook_push(csword){
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
        sub_wordtypes_enbook_push(word_tmp);
    }
    
    if ('nning,pping,tting'.includes(blitem.slice(-5))){
        word_tmp=blitem.substring(0,blitem.length-4);
        sub_wordtypes_enbook_push(word_tmp);   
    }
    
    if ('est'.includes(blitem.slice(-3))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_push(word_tmp);
        sub_wordtypes_enbook_push(word_tmp+'e');
    }
    else if ('ing'.includes(blitem.slice(-3))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_push(word_tmp);
        sub_wordtypes_enbook_push(word_tmp+'e');
    }
    else if ('ies,ier,ied'.includes(blitem.slice(-3))){
        word_tmp=blitem.substring(0,blitem.length-3);
        sub_wordtypes_enbook_push(word_tmp+'y');
    }
    
    if ('ed,es,er'.includes(blitem.slice(-2))){
        word_tmp=blitem.substring(0,blitem.length-2);
        sub_wordtypes_enbook_push(word_tmp);
    }
    if ('d,s'.includes(blitem.slice(-1))){
        word_tmp=blitem.substring(0,blitem.length-1);
        sub_wordtypes_enbook_push(word_tmp);
    }

    return bltmparr;
}

function get_new_words_arr_enbook(cstype,csstr='',csobjects=false,maxlength=3,addline=false,append_parent=false,execstring=''){
    //cstype 1 全部单词 2 未收录 3 已收录 4 wiki 5 js - 保留注释
    //csobjects 在 selenium bible mediawiki_common 等中被调用 - 保留注释
    //------------------
    function sub_get_new_words_arr_objects_enbook(){
        var blno=-1;
        for (let item of csobjects){
            blno=blno+1;
            if (blno<csstart){
                continue;
            }
            if (blno>=csstart+100){
                csstart=csstart+100;
                if (csstart % 200 == 0){
                    console.log('sub_get_new_words_arr_objects_enbook()',csstart);
                }
                setTimeout(sub_get_new_words_arr_objects_enbook,100);
                return;
            }
            //if ((blno+1) % 50 == 0){console.log('sub_get_new_words_arr_objects_enbook()',blno+1);}
            var oldstr=item.innerText;
            var new_line='';
            var words_list=oldstr.match(/[a-zA-Z\-']+/g) || [];
            if (words_list.length==0){continue;}
            for (let one_new_word of new_words_set){
                if (!words_list.includes(one_new_word)){continue;}

                var oldhtml=item.innerHTML;
                item.innerHTML=oldhtml.replace(new RegExp('\\b'+one_new_word+'\\b'),'<span class="span_new_word_search_links">'+one_new_word+'</span>');
                var blcontent='<a href="https://dict.cn/'+specialstr_j(one_new_word)+'" target=_blank style="text-decoration:none;color:inherit;font-weight:bold;">'+one_new_word+'</a><small class="small_word_search_links"><i style="border-bottom:0;">'+en_word_links_b(specialstr_j(one_new_word),false,maxlength,true)+'</i></small>';
                if (item.innerText==oldstr){
                    //依然会修改一些页面表达，如链接 - 保留注释
                    item.innerHTML=oldhtml.replace(new RegExp('\\b'+one_new_word+'\\b'),'<span class="span_new_word_search_links">'+blcontent+'</span>'); //依赖 klbase_eng.js - 保留注释
                    oldstr=item.innerText;
                }
                else {
                    item.innerHTML=oldhtml;
                    if (addline){
                        new_line=new_line+'<span class="span_new_word_search_links" style="border-radius: 0.5rem; border:0.1rem dotted #303030;padding:0.1rem 0.3rem;}">'+blcontent+'</span> ';
                    }
                }
                //en_new2_total[blxl]='';
                new_words_set.delete(one_new_word);
            }
            if (new_line!==''){
                if (append_parent==false){
                    item.innerHTML=item.innerHTML+'<p class="p_new_word_search_links" style="line-height:250%;">'+new_line+'</p>';
                }
                else {
                    item.parentNode.insertAdjacentHTML('afterend','<p class="p_new_word_search_links" style="line-height:250%;">'+new_line+'</p>');
                }
            }
        }
        if (execstring!==''){
            try {
                eval(execstring);
            }
            catch (error) {
                console.log('get_new_words_arr_enbook',error);
            }                 
        }
        console.log('sub_get_new_words_arr_objects_enbook() 费时：'+(performance.now() - t0) + " milliseconds");
    }
    //-----------------------------------
    var t0 = performance.now();
    csstart=0;
    if (csstr==''){
        var otextarea=document.getElementById('textarea_new_words1');
        if (!otextarea){
            return;
        }
        csstr=otextarea.value;
    }
	if (checkbox_kl_value_b('remove_square')==false){
		csstr=csstr.replace(new RegExp("(\\[[^\\[\\]]+\\])","g"),' ');
	}

    var new_words_set=new Set();
    var old_words_set=new Set();    
    var bljgarr2=str_2_array_enbook(csstr,true);
    
    var bltypecheck=checkbox_kl_value_b('words_type_check');
    bltypecheck=(bltypecheck===0?true:bltypecheck);
    
    [new_words_set,old_words_set]=get_new_words_arr_enbook2(bljgarr2,bltypecheck);
    bljgarr2=array_union_b(new_words_set,old_words_set,true);

    var new_words_set10=new Set();
    var old_words_set10=new Set();    
    if (typeof en_words_book_newwords_continue_global!=='undefined' && en_words_book_newwords_continue_global){
        var list10=csstr.trim().split('\n');
        var blstr10=list10.slice(0,parseInt(list10.length*0.1)).join('\n');
        var bljgarr2_10=str_2_array_enbook(blstr10,true);
        [new_words_set10,old_words_set10]=get_new_words_arr_enbook2(bljgarr2_10,bltypecheck);
    }
    
    if (csobjects==false){
        get_new_words_arr_html_enbook(cstype,bljgarr2,[new_words_set,old_words_set,new_words_set10,old_words_set10]);
    }
    else {
        sub_get_new_words_arr_objects_enbook();
    }
    console.log('get_new_words_arr_enbook() 费时：'+(performance.now() - t0) + " milliseconds");
}

function get_new_words_arr_enbook2(bljgarr2,check_types=true){
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
            var list_t=wordtypes_enbook(item);
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

function words_sort_count_enbook(){
    var csstr=document.getElementById('textarea_new_words1').value;
    var list_t=csstr.match(/\b[a-zA-Z_']+\b/g) || [];
    list_t.sort();
    var bljg=[];
    for (let item of list_t){
        if (item.trim()==''){
            continue;
        }
        if (bljg[item]==null){
            bljg[item]=[item,0];
        }
        bljg[item][1]=bljg[item][1]+1;
    }
    var bljg2=[];
    for (let blxl in bljg){
        bljg2.push(bljg[blxl]);
    }
    bljg2.sort(function (a,b){return b[1]>a[1];});
    document.getElementById('textarea_new_words2').value=bljg2.join(' ')+'\n已截取\n';
}

function textarea_shift_enbook(){
    var otextarea1=document.getElementById('textarea_new_words1');
    var otextarea2=document.getElementById('textarea_new_words2');
    var blstr1=otextarea1.value;
    var blstr2=otextarea2.value;
    otextarea1.value=blstr2;
    otextarea2.value=blstr1;
}

function textarea_first_lines_enbook(){
    var otextarea=document.getElementById('textarea_new_words1');
    if (otextarea){
        var bljg=otextarea.value;
        if (bljg.includes('\n已截取\n')){
            return;
        }
        var list_t=bljg.trim().split('\n');
        var blpercent=document.getElementById('input_first_lines').value.trim();
        if (blpercent.slice(-1)=='%'){
            blpercent=parseFloat(blpercent.slice(0,-1))/100;
        }
        else {
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

function get_new_words_group_enbook(cstype){
	var str1=document.getElementById('textarea_new_words1').value.trim();
	if (str1==''){return;}

	var str2=document.getElementById('textarea_new_words2').value.trim();
	if (str2==''){return;}

    var list1_t=str_2_array_enbook(str1,true);
    var list2_t=str_2_array_enbook(str2,true);
    var union_t=array_union_b(list1_t,list2_t,true);
    var inter_t=array_intersection_b(list1_t,list2_t,true);
    var diff1_t=array_difference_b(list1_t,list2_t,true);
    var diff2_t=array_difference_b(list2_t,list1_t,true);
    
    var alink='<a class="a_oblong_box" href="#get_new_words_group_enbook_5">第一组含有但第二组没有的单词</a> ';
    alink=alink+'<a class="a_oblong_box" href="#get_new_words_group_enbook_6">第二组含有但第一组没有的单词</a>';
    
	var bljg='';
    bljg=bljg+new_old_words_html_enbook(list1_t,'第一组单词量','group1',true);
    bljg=bljg+new_old_words_html_enbook(list2_t,'第二组单词量','group2',true);
    bljg=bljg+new_old_words_html_enbook(union_t,'两组合计单词量','group_union',true);
    bljg=bljg+new_old_words_html_enbook(inter_t,'两组单词交集','group_intersection');
    bljg=bljg+new_old_words_html_enbook(diff1_t,'第一组含有但第二组没有的单词','get_new_words_group_enbook_5');
    bljg=bljg+new_old_words_html_enbook(diff2_t,'第二组含有但第一组没有的单词','get_new_words_group_enbook_6');
    
	document.getElementById('div_new_words2').innerHTML='<p>'+alink+'</p>'+bljg;
}

function get_new_words_arr_html_enbook(cstype,bljgarr2,list_t){
    //cstype: 1 全部单词 2 未收录 3 已收录 4 wiki 5 js - 保留注释
    var en_new2_total=list_t[0];
    var en_intersection_total=list_t[1];
    //----------------------
    if (en_words_book_newwords_continue_global){
        new_words_continue_enbook(en_new2_total.size,list_t[2].size);
        return;
    }
    //----------------------
    var bljg='';
    switch (cstype){
        case 1:
            bljg=new_old_words_html_enbook(bljgarr2,'全部单词','all_words');
            break;
        case 2:
            bljg=new_old_words_html_enbook(en_new2_total,'未收录单词','new_words');
            break;
        case 3:
            bljg=new_old_words_html_enbook(en_intersection_total,'已收录单词','old_words');
            break;
        case 4:
            onetextarea_t=checkbox_kl_value_b('newwords_one_textarea');
            bljg=enwords_wiki_type_words_b(Array.from(en_intersection_total),onetextarea_t);
            break;
        case 5:
            onetextarea_t=checkbox_kl_value_b('newwords_one_textarea');
            bljg=enwords_js_type_words_b(Array.from(en_intersection_total),onetextarea_t);
            break;
    }
    document.getElementById('div_new_words2').innerHTML='<div id="div_sub_words">'+bljg+'</div>';
    
    //未收录单词 - 保留注释
    if (en_words_book_newwords_continue_global===false && cstype==2 && csbookno_global_b>=0 && csbooklist_sub_global_b[csbookno_global_b][1]=='Way Station(Clifford D. Simak)' && !document.getElementById('textarea_new_words1').value.includes('已截取')){
        if (confirm("是否更新 Way Station 的未收录单词统计数字：("+en_new2_total.size+")？")){
            local_storage_today_b('enwords_way_station_statistics',40,en_new2_total.size,'/');
        }
    }
}

function new_words_continue_enbook(cslength,percent10length=0){
    if (csbookno_global_b>=0 && en_words_book_newwords_continue_global){
        if (csbookno_global_b==0){
            if (confirm("是否批量统计生词数量？")==false){
                location.href="?";
                return;
            }
        }
        var newwords_statistics=(localStorage.getItem('enwords_books_all_new_words') || '').trim();
        var today=date2str_b();
        if (newwords_statistics.split('\n')[0].trim()!==today){
            newwords_statistics=today;
        }
        newwords_statistics=newwords_statistics+'\n'+csbooklist_sub_global_b[csbookno_global_b][0]+' /// '+csbooklist_sub_global_b[csbookno_global_b][1]+' /// '+cslength+' /// '+percent10length+'\n';
        localStorage.setItem('enwords_books_all_new_words',newwords_statistics);
        
        if (csbooklist_sub_global_b.length-1>csbookno_global_b){
            location.href='?book='+(csbookno_global_b+1+1)+'&continue';
        }
        else {
            //news_words_statistics_enbook();
            alert('done');
            location.href="?";
        }
    }
}

function new_old_words_html_enbook(csarray,csname,csaname='',onlytitle=false){    
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
    
    var bljg=array_2_html_enbook(csarray);
    var blsort='<span class="aclick" onclick="sort_enwords_enbook(this,0);">原始顺序</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook(this);">排序</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook(this,\'tail\');">尾部排序</span>';
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook(this,\'length\');">长度排序</span>';    
    blsort=blsort+'<span class="aclick" onclick="sort_enwords_enbook(this,\'random\');">随机排序</span>';
    blsort=blsort+'<span class="aclick" onclick="javascript:document.getElementById(\'textarea_enwords_book_'+csaname+'\').select();document.execCommand(\'copy\');">复制</span>';

    return bltitle+'<div class="div_enwords_container"><textarea id="textarea_enwords_book_'+csaname+'" style="height:200px;">'+Array.from(csarray).join(' ')+'</textarea><p>'+blsort+'</p><div class="div_enwords_links">'+bljg.join(' ')+enwords_batch_div_b(Array.from(csarray),parseInt(Math.random()*99999))+'</div></div>';
}

function array_2_html_enbook(csarray){
    var bljg=[];
    var blxl=0;
    for (let item of csarray){  //csarray 有可能是 set - 保留注释
        bljg.push('<small>'+(blxl+1)+'</small>. '+en_one_word_b([item.replace(new RegExp('_','g'),' ')],[-1,0]));
        blxl=blxl+1;
    }
    return bljg;
}

function sort_enwords_enbook(oa,cstype=''){
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
    var bljg=array_2_html_enbook(csarray);
    olinksdiv.innerHTML=bljg.join(' ')+enwords_batch_div_b(csarray);
    console.log('sort_enwords_enbook() 费时：'+(performance.now() - t0) + " milliseconds");    
}

function str_2_array_enbook(blstr,isset=false){
    //中文逗号修改为英文逗号 - 保留注释
	blstr=blstr.replace(new RegExp("’","g"),'\'');
    
	//去掉类型 - 保留注释
    blstr=blstr.replace(new RegExp(/\b(adj|adv|art|pref|num|conj|pron|prep|vt|vi|noun|abbr|suf)\b/,"g"),' ');

	//去掉一些英文逗号后的字符 - 保留注释
    blstr=blstr.replace(new RegExp(/\b[a-zA-Z\'\-_]+\'(s|d|re|t|m|ve|ll)\b/,"g"),' ');
    
    //去掉了单个字母 - 保留注释
    var bljgarr2=blstr.match(/\b[a-zA-Z\'\-_]{2,}\b/g);
    bljgarr2=array_unique_b(bljgarr2,isset);

    return bljgarr2;
}

function import_enbook(){
    if (filelist!==null && filelist.length>0){
        var bljg=filelist.join('\n');
        var otextarea_t=document.getElementById('textarea_new_words1')
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
    
    var bltitle='生词统计';
    if (csbookno_global_b>=0){
        bltitle=bltitle+' - '+csbooklist_sub_global_b[csbookno_global_b][1];
    }
    if (csbookno2_global_b>=0){
        bltitle=bltitle+' - '+csbooklist_sub_global_b[csbookno2_global_b][1];
    }    
    document.title=bltitle;
}

function news_words_statistics_enbook(){
    var blresult=(localStorage.getItem('enwords_books_all_new_words') || '').trim().split('\n');
    var odiv=document.getElementById('div_new_words2');
    odiv.innerHTML=array_2_li_b(blresult);
    odiv.scrollIntoView();
}

function current_statistics_data_enbook(csid){
    var blresult=(localStorage.getItem('enwords_books_all_new_words') || '').trim();
    document.getElementById('textarea_compare_'+csid).value=blresult;
}

function compare_statistics_enbook(){
    function sub_compare_statistics_enbook_get_list(cslist){
        for (let blxl=0;blxl<cslist.length;blxl++){
            var item=cslist[blxl];
            var list_temp=item.split(' /// ');
            //形如 24tian_tu_po_gao_kao_dgch3cc_343788 /// 24天突破高考大纲词汇3500(陈灿) /// 2426 - 保留注释
            if (list_temp.length<3){
                cslist[blxl]=['','',0,0];
            }
            else if (list_temp.length<4){
                cslist[blxl]=[list_temp[0].trim(),list_temp[1].trim(),parseInt(list_temp[2].trim()),0];
            }            
            else {
                cslist[blxl]=[list_temp[0].trim(),list_temp[1].trim(),parseInt(list_temp[2].trim()),parseInt(list_temp[3].trim())];
            }
        }
        return cslist;
    }
    var list1=document.getElementById('textarea_compare_1').value.trim().split('\n');
    var list2=document.getElementById('textarea_compare_2').value.trim().split('\n');
    
    list1=sub_compare_statistics_enbook_get_list(list1);
    list2=sub_compare_statistics_enbook_get_list(list2);
    
    enbook_compare_result_list_global=[];
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
            enbook_compare_result_list_global.push([bookid,item2[1],'',item2[2],'--','',item2[3],'--']);
        }
    }
    compare_result_list_to_table_enbook();
}

function compare_result_list_to_table_enbook(sortno=4){
    if (enbook_compare_result_list_sort_order_global){
        enbook_compare_result_list_global.sort(function (a,b){
            if (sortno>=2){
                if (isNaN(a[sortno])){return 1;}
                if (isNaN(b[sortno])){return 0;}
            }
            return a[sortno]>b[sortno];
        });   
    }
    else {
        enbook_compare_result_list_global.sort(function (a,b){
            if (sortno>=2){
                if (isNaN(a[sortno])){return 0;}
                if (isNaN(b[sortno])){return 1;}
            }
            return a[sortno]<b[sortno];
        });   
    }
    enbook_compare_result_list_sort_order_global=!enbook_compare_result_list_sort_order_global;
    
    var tdstyle='style="padding:0.5rem;border-bottom:0.1rem solid '+scheme_global['color']+';"';
    var thstyle='style="cursor:pointer;padding:0.5rem;border-bottom:0.2rem solid '+scheme_global['color']+';"';
    var bljg='<table id="table_compare" cellpadding=0 cellspacing=0 align=center>';
    bljg=bljg+'<tr>';
    bljg=bljg+'<th '+thstyle+'>No.</th>';
    bljg=bljg+'<th '+thstyle+' onclick="javascript:compare_result_list_to_table_enbook(1);">书名</th>';
    bljg=bljg+'<th '+thstyle+' onclick="javascript:compare_result_list_to_table_enbook(2);">Data1</th>';
    bljg=bljg+'<th '+thstyle+' onclick="javascript:compare_result_list_to_table_enbook(3);">Data2</th>';
    bljg=bljg+'<th '+thstyle+' onclick="javascript:compare_result_list_to_table_enbook(4);">Δ</th>';
    bljg=bljg+'<th '+thstyle+' onclick="javascript:compare_result_list_to_table_enbook(5);">Data1(10%)</th>';
    bljg=bljg+'<th '+thstyle+' onclick="javascript:compare_result_list_to_table_enbook(6);">Data2(10%)</th>';
    bljg=bljg+'<th '+thstyle+' onclick="javascript:compare_result_list_to_table_enbook(7);">Δ</th>';    
    bljg=bljg+'</tr>';
    var blxl=1;
    for (let item of enbook_compare_result_list_global){
        bljg=bljg+'<tr>';
        bljg=bljg+'<td '+tdstyle+'>'+blxl+'</td>';
        bljg=bljg+'<td '+tdstyle+'>'+item[1]+'</td>';
        bljg=bljg+'<td align=right '+tdstyle+'>'+item[2]+'</td>';
        bljg=bljg+'<td align=right '+tdstyle+'>'+item[3]+'</td>';
        bljg=bljg+'<td align=right '+tdstyle+'>'+item[4]+'</td>';
        bljg=bljg+'<td align=right '+tdstyle+'>'+item[5]+'</td>';
        bljg=bljg+'<td align=right '+tdstyle+'>'+item[6]+'</td>';
        bljg=bljg+'<td align=right '+tdstyle+'>'+item[7]+'</td>';        
        bljg=bljg+'</tr>';
        blxl=blxl+1;
    }
    bljg=bljg+'</table>';
    document.getElementById('td_result').innerHTML=bljg;
}

function compare_form_statistics_enbook(){
    var bljg='<table width=95% height=600px>';
    bljg=bljg+'<tr><td width=50% valign=top><textarea id="textarea_compare_1" style="width:100%;height:100%;"></textarea><p><span class="aclick" onclick="javascript:current_statistics_data_enbook(\'1\');">最新数据</span></p></td>';
    bljg=bljg+'<td width=50% valign=top><textarea id="textarea_compare_2" style="width:100%;height:100%;"></textarea><p><span class="aclick" onclick="javascript:current_statistics_data_enbook(\'2\');">最新数据</span></p></td></tr>';
    bljg=bljg+'<tr><td colspan=2 align=right><span class="aclick" onclick="javascript:compare_statistics_enbook();">比较</span><span class="aclick" href="javascript:void(null);" onclick="javascript:document.getElementById(\'divhtml2\').innerHTML=\'\';">Close</span></p></tr>';
    bljg=bljg+'<tr><td colspan=2 valign=top id="td_result" style="padding:1rem;"></tr>';    
    bljg=bljg+'</table>';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
}

function max_length_new_words_enbook(){
    var list_t=[].concat(all_new_words_global);
    list_t.sort(function (a,b){return a.length<b.length;});
    list_t=list_t.slice(0,100);
    if (list_t.length==0){return;}
    document.getElementById('textarea_new_words1').value='最长('+list_t[0].length+'-'+list_t.slice(-1)[0].length+')的 '+list_t.length+' 个单词：\n'+list_t.join('\n');
}

function import_words_enbook(cstype,csmax=-1){
    switch (cstype){
        case 'new':
            if (csmax>0){
                var words_t=[].concat(all_new_words_global);
                var bltotal_t=Math.floor((Math.random()*10)+1);
                for (let blxl=0;blxl<bltotal_t;blxl++){
                    words_t.sort(randomsort_b);
                }
                document.getElementById('textarea_new_words1').value=words_t.slice(0,csmax).join(' ');
            }
            else {
                document.getElementById('textarea_new_words1').value=all_new_words_global.join(' ');            
            }
            break;            
        case 'old':
            var result_t=[];
            for (let item of enwords){
                result_t.push(item[2]);
            }
            if (csmax>0){
                result_t.sort(randomsort_b);
                result_t=result_t.slice(0,csmax);
            }
            document.getElementById('textarea_new_words1').value=result_t.join('\n');
            break;
        case 'sentence':
            var list_t=array_numbers_b(Math.min(csmax,en_sentence_global.length),Math.floor((Math.random()*10)+1));

            var result_t=[];
            for (let item of list_t){
                result_t.push(en_sentence_global[item]);
            }
            document.getElementById('textarea_new_words1').value=result_t.join('\n\n');
            break;
    }
}

function exclude_words_enbook(){
    var list_t=local_storage_get_b('txt_englishwords_excluded',-1,true);
    var bookname='';
    var bljg='';
    var bltotal=0;
    var blno=0;
    var bookno=0;
    var blwords='';
    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl].split(' /// ');
        if (item.length<2){continue;}
        if (bookname!==item[0]){
            bookno=bookno+1;
            bljg=bljg+'<p>'+blwords+'</p>';
            blwords='';
            bljg=bljg+'<h3>'+bookno+'. <a href="PythonTools/data/selenium_news/html/txtlistsearch.htm?'+encodeURIComponent(item[0]+'&s='+item[1])+'" target=_blank>'+item[0]+'</a></h3>';
            bookname=item[0];
            blno=0;
        }
        blno=blno+1;
        bltotal=bltotal+1;
        blwords=blwords+blno+'. <a href="book_search.php?s='+encodeURIComponent(item[1])+'&eng" target=_blank>'+item[1]+'</a> ';
    }
    if (blwords!==''){
        bljg=bljg+'<p>'+blwords+'</p>';
    }
    bljg=bljg+'<p style="margin-top:1rem;"><a class="aclick" href="PythonTools/data/selenium_news/html/txtlistsearch.htm?_tagenglishwords&sc=batch_refresh_'+Math.round((Math.random()*99999))+'" target=_blank>批量刷新</a> 全部：'+bltotal+'</p>';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
}

function txtlistsearch_enbook(){
    var blpath=klwebphp_path_b('PythonTools/data/selenium_news/html/txtlistsearch.htm');
    if (csbookno_global_b>=0){
        blpath=blpath+'?'+csbooklist_sub_global_b[csbookno_global_b][0]+'&line=1';
    }
    window.open(blpath);
}

function day_new_words_enbook(){
    var days=day_of_year_b();   //当年第几天 - 保留注释

    var result_t=[];
    for (let item of all_new_words_global){
        if ((1+asc_sum_b(item)%365)==days){
            result_t.push(item);
        }        
    }
    document.getElementById('textarea_new_words1').value=result_t.join(' ');    
}

function menu_enbook(){
    var str_t=klmenu_hide_b('');
    var str2_t=klmenu_hide_b('#div_new_words2');
    var klmenu1=[
    '<a href="enwords.htm" onclick="javascript:'+str_t+'" target=_blank>单词库</a>',
    '<span class="span_menu" onclick="javascript:'+str2_t+'get_new_words_arr_enbook(4);">旧单词wiki格式</span>',
    '<span class="span_menu" onclick="javascript:'+str2_t+'get_new_words_arr_enbook(5);">旧单词js格式</span>',
    '<span class="span_menu" onclick="javascript:'+str2_t+'show_sentence_kle(3,true);">显示少量例句</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'words_sort_count_enbook();">单词排序</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'txtlistsearch_enbook();">txtlistsearch</span>',
    ];

    var klmenu_new=[
    '<span class="span_menu" onclick="javascript:'+str_t+'import_words_enbook(\'new\');">导入KLWiki和txtbook全部新单词</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'day_new_words_enbook();">今日新单词</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'import_words_enbook(\'new\',2500);">随机导入2500个新单词</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'max_length_new_words_enbook();">全部新单词中最长的单词</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'import_words_enbook(\'sentence\',2000);">随机导入2000条例句</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'import_words_enbook(\'old\',2500);">随机导入2500条旧单词释义</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'import_words_enbook(\'old\');">导入全部旧单词释义</span>',
    ];
    
    var klmenu2=[
    '<a href="?book=1&continue" onclick="javascript:'+str_t+'">批量统计生词</a>',
    '<span class="span_menu" onclick="javascript:'+str_t+'news_words_statistics_enbook();">显示统计结果</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'compare_form_statistics_enbook();">比较统计数据</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'exclude_words_enbook();">电子书中未包含的旧单词</span>',        
    '<a href="http://192.168.0.133/wiki/index.php/%E8%8B%B1%E8%AF%AD%E4%B9%A6%E7%B1%8D%E7%94%9F%E8%AF%8D%E7%BB%9F%E8%AE%A1" onclick="javascript:'+str_t+'" target=_blank>英语书籍生词统计(KLWiki)</a>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_new,'🔤','18rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'🧮','16rem','1rem','1rem','60rem'),'','0rem')+' ');
    
}

function init_enbook(){
    new_words_form_enbook();
    enwords_init_b(true);
    args_enbook();
    //---------------
    if (en_words_book_newwords_continue_global===false){
        top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));

        enwords_mini_search_frame_style_b();
        //local_storage_today_b('enwords_statistics',40,enwords.length,'/');
        menu_enbook();
        enwords_mini_search_frame_form_b();
        
        var list_t=new Set();
        for (let item of en_sentence_count_global){
            if (item[1]>=3){continue;}
            list_t.add(item[0]);
        }
        en_sentence_count_global=list_t;
    }
}

function style_enbook(){
    document.write('\n<style>\n');
    document.write('a.similar {text-decoration:none;}\n');
    document.write('a.similar:link, a.similar:visited, a.similar:hover, a.similar:active{color:'+scheme_global['memo']+';}\n');
    document.write('.txtsearch_lineno {color:'+scheme_global['memo']+';font-size:0.8rem;}\n');
    document.write('.div_sentence{margin:1rem 0rem 1rem 2rem;border:0.2rem dashed '+scheme_global['shadow']+';padding:0.5rem 1rem;}\n');
    document.write('#table_compare tr{background-color: '+scheme_global['background']+';}\n');
    document.write('#table_compare tr:hover {background-color: '+scheme_global['skyblue']+';}\n');
    document.write('</style>\n');
}
