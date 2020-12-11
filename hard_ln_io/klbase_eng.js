//csver:0.0.1-20190125
function en_word_def_istrong_b(csdef,is_remove=false){
    var bltypes=["adj", "adv", "art", "vt", "vi", "pron", "prep", "pref", "conj", "noun","num", "abbr", "int", "v", "n"];
    if (is_remove){
        for (let item of bltypes){
            if (csdef.includes('<b>'+item+'. </b>')){
                csdef=csdef.replace(new RegExp('<b>'+item+'\\. <\/b>','g'),item+'. ');
            }
        }
        csdef=csdef.replace(new RegExp(' <small>📋</small> ','g'),' ');
        return csdef;    
    }
    
    for (let item of bltypes){
        if (csdef.includes(' '+item+'. ')){
            csdef=csdef.replace(new RegExp(' '+item+'\\. ','g'),' <b>'+item+'. </b>');
        }
        if (csdef.includes('；'+item+'. ')){
            csdef=csdef.replace(new RegExp('；'+item+'\\. ','g'),'；<b>'+item+'. </b>');
        }            
        if (csdef.indexOf(item+'. ')==0){
            //从左到右替换一次 - 保留注释
            csdef=csdef.replace(item+'. ','<b>'+item+'. </b>');
        }
    }
    csdef=csdef.replace(new RegExp('; ','g'),'; <small>📋</small> ');
    return csdef;
}

function words_queue_read_b(){
    var list_t=local_storage_get_b('words_queue_kle',-1,true);
    var one_word=[];
    for (let item of list_t){
        item=item.trim();
        if (item.includes('-') && item.replace(new RegExp(/-/,'g'),'')==''){continue;}
        if (item==''){continue;}
        one_word.push(item);
        if (one_word.length==3){    //每3行处理一次 - 保留注释
            var blfound=false;
            for (let blxl=0;blxl<enwords.length;blxl++){
                if (enwords[blxl][0]==one_word[0]){
                    enwords[blxl][1]=one_word[1];
                    enwords[blxl][2]=one_word[2]+'✏';
                    blfound=true;
                    break;
                }
            }
            if (blfound===false){
                enwords.push([one_word[0],one_word[1],one_word[2]+'🥚']);
            }
            one_word=[];
        }
    }
}

function enwords_init_b(simple=false){
    var t0 = performance.now();
    words_queue_read_b();
    if (simple){
        //写入序号 - 保留注释
        for (let blxl=0;blxl<enwords.length;blxl++){
            enwords[blxl].push(blxl);
            if (enwords[blxl][1]==''){
                enwords[blxl][1]='[null]';
            }
            enwords[blxl][2]=en_word_def_istrong_b(enwords[blxl][2]);
        }
        console.log('enwords_init_b() 费时：'+(performance.now() - t0) + " milliseconds");
        return;
    }
    //添加元素，写入 序号 和 asc 值数组(0,1,2 以及 0 的第一个字符) - 保留注释
    for (let blxl=0;blxl<enwords.length;blxl++){
        if (enwords[blxl][1]==''){
            enwords[blxl][1]='[null]';
        }
        enwords[blxl][2]=en_word_def_istrong_b(enwords[blxl][2]);
        enwords[blxl].push(blxl,[asc_sum_b(enwords[blxl][0]),asc_sum_b(enwords[blxl][1]),asc_sum_b(enwords[blxl][2]), asc_sum_b(enwords[blxl][0].substring(0,1))]);
    }
    
    if (typeof enwords_new == "object"){
        if (Array.isArray(enwords_new)){
            for (let blxl=0;blxl<enwords_new.length;blxl++){
                if (enwords_new[blxl][1]==''){
                    enwords_new[blxl][1]='[null]';
                }
                enwords_new[blxl][2]=en_word_def_istrong_b(enwords_new[blxl][2]);
                enwords_new[blxl][2]=enwords_new[blxl][2].replace(new RegExp('; ','g'),'; <small>📋</small> ');
            }
        }
    }
    console.log('enwords_init_b() 费时：'+(performance.now() - t0) + " milliseconds");
}

function en_similar_word_b(cskey,cskey_list,compared_word){
    if (compared_word==cskey || compared_word.toLowerCase()==cskey.toLowerCase()){
        return 0;
    }
    else if (cskey==compared_word.substring(0,cskey.length) || cskey.toLowerCase()==compared_word.substring(0,cskey.length).toLowerCase()){
        return 1;
    }
    else if (cskey==compared_word.slice(-1*cskey.length,) || cskey.toLowerCase()==compared_word.slice(-1*cskey.length,).toLowerCase()){
        return 2;
    }
    else if (cskey_list.includes(compared_word) || cskey_list.includes(compared_word.toLowerCase())){
        return 3;
    }
    else {
        return 4;
    }
}

function enwords_batch_div_b(wordslist_t,checkboxno='',showno=true,startno=0){
    if (wordslist_t==null || wordslist_t.length==0){return '';}

    var bljg='<div style="border:0.2rem dashed '+scheme_global['shadow']+';padding:0.5rem;margin-top:0.5rem;">';
    var blxl=startno;
    for (let item of wordslist_t){
        var id_name=checkboxno+'_'+parseInt(Math.random()*999)+'_'+parseInt(Math.random()*999)+'_'+parseInt(Math.random()*999);
        if (Array.isArray(item)){
            var enstr_t=item[0];
        }
        else {
            var enstr_t=item;
        }
        if (enstr_t.substring(0,1)=='"' && enstr_t.slice(-1)=='"'){
            enstr_t=enstr_t.slice(1,-1);
        }
        if (enstr_t==''){continue;}
        blxl=blxl+1;
        bljg=bljg+'<input type="checkbox" name="checkbox_enword'+checkboxno+'"  id="checkbox_enword'+id_name+'" value="'+specialstr_j(enstr_t,true)+'">';
        if (showno){
            bljg=bljg+'<label for="checkbox_enword'+id_name+'"><small style="color:'+scheme_global['memo']+';">'+blxl+'.</small>';
        }
        bljg=bljg+specialstr_j(enstr_t,true)+'</label> ';
        if (blxl>=100){
            bljg=bljg+'<strong><i>(&gt;100...)</i></strong>'
            break;
        }
    }

    if (wordslist_t.length>1){
        bljg=bljg+'<input type="checkbox" id="checkbox_enwords_select_all" onchange=\'javascript:if (this.checked){enwords_checkbox_open_b("checkbox_enword'+checkboxno+'","1");}else {enwords_checkbox_open_b("checkbox_enword'+checkboxno+'","0");}\'><label for="checkbox_enwords_select_all">全选</label> ';
    }
    bljg=bljg+'<span style="font-size:1.3rem;word-break:break-all;word-wrap:break-word;">';
    var list_t=en_search_sites_b();
    for (let item of list_t){
        bljg=bljg+'<span class="span_link" style="padding:0 0.5rem;" title="'+item[1]+'" onclick=\'javascript:enwords_checkbox_open_b("checkbox_enword'+checkboxno+'","'+item[0]+'");\'>'+item[0].toUpperCase()+'</span>';
    }
    bljg=bljg+'</span></div>';
    
    return bljg;
}

function en_word_links_b(csword='',dictcn=true,maxlength=-1,csquote=false){
    if (maxlength==0){return '';}
    var list_t=en_search_sites_b(dictcn,maxlength);
    var bljg='';
    
    for (let item of list_t){
        bljg=bljg+'<span class="span_link" title="'+item[1]+'" onclick="javascript:open_link_en_b(\''+item[0]+'\',\''+csword+'\'); en_word_temp_change_b(this,\''+item[0]+'\');"';
        bljg=bljg+'>'+item[0]+'</span> ';
    }
    if (csquote){
        bljg='('+bljg.trim()+')';
    }
    return bljg.trim();
}

function en_search_sites_b(dictcn=true,maxlength=-1){
    if (dictcn){
        var list_t=[['d','海词']];
    }
    else {
        var list_t=[];
    }
    list_t=list_t.concat([
    ['b','Bing'],
    ['m','Merriam-webster'],
    ['o','Oxford'],
    ['+','Cambridge'],
    //以下3行保留 - 保留注释
    //['c','Collins'],
    //['r','wordReference'],
    //['e','enwords'],
    ['w','KLWiki'],
    ['t','txtlistsearch'],
    ['E','Englishwords Book Search'],
    ['s','Selenium_news_reader'],
    ['4','海词+Bing+Merriam-webster+Oxford'],
    ]);
    if (maxlength>0){
        list_t=list_t.slice(0,maxlength);
    }
    return list_t;
}

function enwords_checkbox_open_b(csname,cstype){
    var ocheckbox=document.getElementsByName(csname);
    if (ocheckbox.length==0){return;}
    if (cstype=='1'){
        for (var blxl in ocheckbox){
            ocheckbox[blxl].checked=true;
        }
        return;
    }
    if (cstype=='0'){
        for (var blxl in ocheckbox){
            ocheckbox[blxl].checked=false;
        }
        return;
    }
    var blcount=0;
    for (var blxl=0;blxl<ocheckbox.length;blxl++){
        if (ocheckbox[blxl].checked){
            blcount=1;
            break;
        }
    }
    if (blcount==0){
        ocheckbox[0].checked=true;
    }
    
    for (var blxl=0;blxl<ocheckbox.length;blxl++){
        if (ocheckbox[blxl].checked){
            open_link_en_b(cstype,ocheckbox[blxl].value);
        }
    }
}

function open_link_en_b(cstype,csword){
    switch (cstype){
        case '+':
            window.open('https://dictionary.cambridge.org/dictionary/english/'+encodeURIComponent(csword.split(' ').join('-')));
            break;
        case 'c':
            window.open('https://www.collinsdictionary.com/dictionary/english/'+encodeURIComponent(csword.split(' ').join('-')));
            break;                    
        case 'd':
            window.open('http://dict.cn/'+encodeURIComponent(csword));
            break;
        case 'b':
            window.open('https://cn.bing.com/dict/search?q='+encodeURIComponent(csword));
            break;
        case 'w':
            window.open(local_storage_get_b('kl_remote_host',-1,false)+'/wiki/index.php?search='+encodeURIComponent(csword)+'&title=特殊%3A搜索&profile=default&fulltext=1');
            break;
        case 't':
            var blhref=location.href;
            if (blhref.includes('/klwebphp/')){
                blhref=blhref.split('/klwebphp/')[0]+'/klwebphp/PythonTools/data/selenium_news/html/txtlistsearch.htm';
            }
            else if (blhref.includes('/klwebphp_backup/')){
                blhref=blhref.split('/klwebphp_backup/')[0]+'/klwebphp_backup/PythonTools/data/selenium_news/html/txtlistsearch.htm';
            }    
            else {
                blhref='txtlistsearch.htm';
            }
            window.open(blhref+'?_tagKLWiki0&s='+encodeURIComponent(('+'+csword).replace(new RegExp(' ','g'),' +')));
            break;
        case 'E':
            window.open('englishwords_book_search.php?s='+encodeURIComponent(csword.replace(new RegExp(' ','g'),'\\s')));
            break;
        case 'e':
            window.open('enwords.htm?s='+encodeURIComponent(('+'+csword).replace(new RegExp(' ','g'),' +')));
            break;
        case 'o':
            window.open('https://www.oxfordlearnersdictionaries.com/definition/english/'+encodeURIComponent(csword.split(' ').join('-')));
            break;
        case 'm':
            window.open('https://www.merriam-webster.com/dictionary/'+encodeURIComponent(('+'+csword).replace(new RegExp(' ','g'),' +')));
            break;  
        case 'r':
            window.open('https://www.wordreference.com/definition/'+encodeURIComponent(('+'+csword).replace(new RegExp(' ','g'),' +')));
            break;                      
        case 's':
            window.open('klbase_html_jump.htm?selenium_news_search.php?search='+encodeURIComponent( '\\b'+csword)+'\\b(:title)(:r)');
            break;
        case '4':
            window.open('http://dict.cn/'+encodeURIComponent(csword));
            window.open('https://cn.bing.com/dict/search?q='+encodeURIComponent(csword));
            window.open('https://www.merriam-webster.com/dictionary/'+encodeURIComponent(('+'+csword).replace(new RegExp(' ','g'),' +')));            
            window.open('https://www.oxfordlearnersdictionaries.com/definition/english/'+encodeURIComponent(csword.split(' ').join('-')));
            break;
    }
}

function sup_kleng_hide_b(){
	var o_sups=document.querySelectorAll('sup.kleng');
	if (o_sups.length==0){return;}

	for (var item of o_sups){
		if (item.style.display=='none'){
			item.style.display='inline';
		}
		else{
			item.style.display='none';
		}
	}
}

function sup_kleng_words_b(){
	var o_sups=document.querySelectorAll('sup.kleng');
	if (o_sups.length==0){return;}

	for (let one_sup of o_sups){
        var word_t=one_sup.innerHTML;
        if (!word_t){
            continue;
        }
        if (word_t.substring(0,1)=='"' && word_t.slice(-1)=='"'){
            word_t=word_t.slice(1,-1);
        }
        if (one_sup.style && one_sup.style.color=='blue'){
            var supcolor='blue';
        }
        else {
            var supcolor='#cc0000';
        }
        for (let item of enwords){
            if (item[0]==word_t){
                one_sup.innerHTML='(<a href="http://dict.cn/'+word_t+'" target="_blank"><font color="'+supcolor+'">'+item[1]+'</font></a> '+en_word_def_istrong_b(item[2])+')';
                break;
            }
        }
	}
}

function enwords_b(csstr,cstype=''){
	//<eword w=zoo></eword>
    if (csstr.indexOf('&lt;eword')<0 || csstr.indexOf('&lt;/eword&gt;')<0){
        if (cstype=='array'){
            return [];
        }
        else {
            return csstr;
        }
    }

    if (cstype=='array'){
        var list_t=[];
        var myRegexp = /&lt;eword w=((&quot;|")?)(.*?)\1&gt;.*?&lt;\/eword&gt;/g;
        var result=[];
        while (result = myRegexp.exec(csstr)) {
            if (result.length>=3+1){
                //循环单词库，寻找同名单词 - 保留注释
                for (var item of enwords){
                    if (item[0]==result[3]){
                        list_t.push([item[0],item[1],item[2]]);
                        break;
                    }
                }
                //list_t.push([result[2],result[4],result[5]]); - 保留注释
            }
        }
        return list_t;
    }
    else {
        var bljg='';
        bljg=csstr.replace(new RegExp(/&lt;eword w=(&quot;|")(.*?)\1&gt;&lt;\/eword&gt;/,"g"),sup_kleng_style_b()+'$2</sup>');
        bljg=bljg.replace(new RegExp(/&lt;eword w=(.*?)(&gt;|\s).*?&lt;\/eword&gt;/,"g"),sup_kleng_style_b()+'$1</sup>');
        return bljg;
    }
}

function sup_kleng_style_b(){
    return '<sup style="font-size:0.8rem;color:#cc0000;" class="kleng">';
}

function en_lines_days_b(csarray,cstheday=''){
    var cscount=Math.ceil(csarray.length/365);

    if (cstheday==''){
        var today_t=new Date();
    }
    else {
        var today_t=validdate_b(cstheday);
    }

    var csday = new Date(today_t.getFullYear(),0,1);

    var today_t_str=date2str_b('',today_t);
	var bljg='';   
	var blenstr_t='';
	var blxl=0;
	for (let blstr of csarray){
		if (blxl>0 && blxl%cscount==0){
			if (date2str_b('',csday)==today_t_str){
    	        bljg=bljg+blenstr_t;
                break;
            }
			csday.setTime(csday.getTime()+24*60*60*1000);
			blenstr_t='';
		}
        blenstr_t=blenstr_t+blstr+'\n';
		blxl=blxl+1;
	}
    return enwords_b(bljg,'array');
}

function en_sentence_one_line_b(aline,wordname='',fontsize='',attachment_path='',wikisite='',zebra=0){
    if (fontsize==''){
        fontsize='0.95';
    }
    var item=aline[0];
    if (Array.isArray(wordname)){
        var blmatch=false;
        for (let aword of wordname){
            if (!item.includes('w=&quot;'+aword+'&quot;') && !item.includes('w='+aword+'&gt;') && item.match(new RegExp('\\b'+aword+'\\b','i'))==null){
                continue;
            }
            blmatch=true;
            item=item.replace(new RegExp('&lt;eword w=&quot;'+aword+'&quot;&gt;&lt;/eword&gt;','g'),'<sup>🚩</sup>');
            item=item.replace(new RegExp('&lt;eword w='+aword+'&gt;&lt;/eword&gt;','g'),'<sup>🚩</sup>');
        }
        
        //若循环一遍后未含有 指定的单词组，则直接返回空字符串 - 保留注释
        if (blmatch==false){
            return '';
        }
        
        item=item.replace(new RegExp(/&lt;eword.*?&gt;&lt;\/eword&gt;/,'g'),'');
        
        for (let aword of wordname){
            if (!item.includes('w=&quot;'+aword+'&quot;') && !item.includes('w='+aword+'&gt;') && item.match(new RegExp('\\b'+aword+'\\b','i'))==null){
                continue;
            }
                    
            if (item.match(new RegExp('\\b'+aword+'\\b','i'))!==null){
                item=item.replace(new RegExp('<sup>🚩</sup>','g'),'');
            }
            if (item.toLowerCase().match('http[^\\s]*'+aword.toLowerCase()+'[^\\s]*')==null){
                item=item.replace(new RegExp('(\\b)('+aword+')(\\b)','ig'),'$1<span style="background-color: '+scheme_global['skyblue']+';">$2</span>$3');
            }
        }
    }
    else if (wordname!==''){
        if (!item.includes('w=&quot;'+wordname+'&quot;') && !item.includes('w='+wordname+'&gt;') && item.match(new RegExp('\\b'+wordname+'\\b','i'))==null){
            return '';
        }
        
        item=item.replace(new RegExp('&lt;eword w=&quot;'+wordname+'&quot;&gt;&lt;/eword&gt;','g'),'<sup>🚩</sup>');
        item=item.replace(new RegExp('&lt;eword w='+wordname+'&gt;&lt;/eword&gt;','g'),'<sup>🚩</sup>');

        item=item.replace(new RegExp(/&lt;eword.*?&gt;&lt;\/eword&gt;/,'g'),'');
        
        if (item.match(new RegExp('\\b'+wordname+'\\b','i'))!==null){
            item=item.replace(new RegExp('<sup>🚩</sup>','g'),'');
        }
        if (item.toLowerCase().match('http[^\\s]*'+wordname.toLowerCase()+'[^\\s]*')==null){
            item=item.replace(new RegExp('(\\b)('+wordname+')(\\b)','ig'),'$1<span style="background-color: '+scheme_global['skyblue']+';">$2</span>$3');
        }
    }
    
    var bljg='';
    if (zebra==1){
        bljg=bljg+'<p style="line-height:130%;font-size:'+fontsize+'rem;background-color:'+scheme_global['button']+';margin-top:0.3rem;padding:0.2rem 0.5rem;">';
    }
    else {
        bljg=bljg+'<p style="line-height:130%;font-size:'+fontsize+'rem;margin-top:0.3rem;padding:0.2rem 0.5rem;">';
    }
    bljg=bljg+'<span class="span_enwods_sentence">'+wiki_line_b(item,attachment_path)+'</span>';
    
    if (aline[1].slice(-1)!=='/'){
        aline[1]=aline[1]+'/';
    }
    bljg=bljg+' <span class="span_from" style="line-height:150%;" onclick="javascript:this.style.backgroundColor=\''+scheme_global['pink']+'\';">'+wiki_line_b(aline[1])+'</span>';
    if (wikisite!==''){
        bljg=bljg+'<span class="span_from_wiki" style="line-height:150%;" onclick="javascript:this.style.backgroundColor=\''+scheme_global['pink']+'\';">';
        if (aline[2].slice(-4,)=='_TLS'){
            var blstr=aline[2].slice(0,-4);
            bljg=bljg+'<a href="'+wikisite+encodeURIComponent(blstr.replace(new RegExp(' ','g'),'\\s'))+'_reg&s='+wordname+'" target=_blank>'+blstr+'</a></span>';
        }
        else {
            bljg=bljg+'<a href="'+wikisite+encodeURIComponent(aline[2])+'" target=_blank>'+aline[2]+'</a></span>';
        }
    }
    bljg=bljg+'</p>';
    
    return bljg;
}

function en_sentence_b(wordname,csmax=-1,fontsize='',attachment_path='',wikisite='',txtlistsearch_site='',csodd=0){
    if (en_sentence_global.length==0){
        return ['',0];
    }
    else if (Array.isArray(wordname)){
        if (wordname.length==0){
            return ['',0];
        }
    }
    else if (wordname.trim()==''){
        return ['',0];
    }
    
    if (fontsize==''){
        fontsize='0.95';
    }
    if (Array.isArray(wordname)){
        var sentence_list={};
        for (let aword of wordname){
            sentence_list[aword]=['',0];
        }
        
        for (let aword of wordname){
            var blxl=0;
            for (let aline of en_sentence_global){
                if (csmax>0 && sentence_list[aword][1]>=csmax){
                    continue;
                }
                var search_site=(aline[2].slice(-4,)=='_TLS'?txtlistsearch_site:wikisite);
                var str_t=en_sentence_one_line_b(aline,aword,fontsize,attachment_path,search_site,(blxl+csodd)%2);
                if (str_t!==''){
                    sentence_list[aword][0]=sentence_list[aword][0]+str_t;
                    sentence_list[aword][1]=sentence_list[aword][1]+1;
                    blxl=blxl+1;
                }
            }
        }
        return sentence_list;
    }
    else {
        var bljg='';
        var blxl=0;
        for (let aline of en_sentence_global){
            var search_site=(aline[2].slice(-4,)=='_TLS'?txtlistsearch_site:wikisite);
            var str_t=en_sentence_one_line_b(aline,wordname,fontsize,attachment_path,search_site,(blxl+csodd)%2);
            if (str_t!==''){
                bljg=bljg+str_t;
                blxl=blxl+1;
            }
            if (csmax>0 && blxl>=csmax){break;}
        }
        return [bljg,blxl];
    }
}

function en_sentence_mobile_b(){
    if (ismobile_b()==false){return;}
    
    var ospans=document.getElementsByClassName('span_from');
    for (let a_span of ospans){
        var oas=a_span.getElementsByTagName('a');
        for (let one_a of oas){
            one_a.title=one_a.innerText;
            one_a.innerText='source';
        }
    }

    var ospans=document.getElementsByClassName('span_from_wiki');
    for (let a_span of ospans){
        var oas=a_span.getElementsByTagName('a');
        for (let one_a of oas){
            one_a.title=one_a.innerText;
            one_a.innerText=(one_a.href.includes('txtlistsearch.htm')?'txt':'wiki');
        }
    }
}

function en_word_temp_change_b(ospan,csword,cstype=''){
    //cstype: add remove switch - 保留注释
    if (cstype!==''){
        en_word_temp_get_b();
    }
    if (ospan.style.backgroundColor=='' || cstype=='add'){
        ospan.style.backgroundColor=scheme_global['pink'];
        if (cstype=='switch' || cstype=='add'){
            var theday=new Date();
            var today_str=theday.getFullYear()+'-'+('0'+(theday.getMonth()+1)).slice(-2)+'-'+('0'+theday.getDate()).slice(-2);
            var do_change=false;
            if (!en_words_temp_global.includes('=== '+today_str+' 🔼 ===')){
                en_words_temp_global.push('=== '+today_str+' 🔼 ===');
                do_change=true;
            }        
            if (!en_words_temp_global.includes(csword)){
                en_words_temp_global.push(csword);
                do_change=true;
            }
            if (do_change){
                localStorage.setItem('enwords_temp',en_words_temp_global.join('\n'));
            }
        }
    }
    else {
        var recent_bookmark=(localStorage.getItem('enwords_recent_bookmark') || "").trim();
        if (csword==recent_bookmark){
            //如果单词是书签，则不可剔除 - 保留注释
            return;
        }
        ospan.style.backgroundColor='';
        if (cstype=='switch' || cstype=='remove'){
            var blat=en_words_temp_global.indexOf(csword);
            if (blat>=0){
                en_words_temp_global.splice(blat,1);
                localStorage.setItem('enwords_temp',en_words_temp_global.join('\n'));
            }
        }
    }
}

function en_word_temp_get_b(){
    en_words_temp_global=local_storage_get_b('enwords_temp',-1,true);
}

function en_day_old_words_b(daynumber,cstype,array_num_t){
    function sub_en_day_old_words_b_oneword(oneword,daynumber,csinterval,asc_t){
        if (daynumber % csinterval !== 0 && (1+asc_t%365)==daynumber){
            return true;
        }
        
        //对于所有asc值对应的一年内的天数能被 如10 整除（即第10天、第20天...）的单词 - 保留注释
        if ((1+asc_t%365) % csinterval == 0 && 1+(asc_t+oneword[4][3]) % 365 == daynumber){
            return true;
        }
        return false;
    }
    //----------
    var list_t=[];
    var csinterval=4;
    if (cstype.includes('_OR')){
        for (let oneword of enwords){
            var asc_t=0;
            for (var item of array_num_t){
                //asc_t=asc_sum_b(oneword[item]); - 保留注释
                asc_t=oneword[4][item];
                //只要一项元素符合即可 - 保留注释
                
                if (sub_en_day_old_words_b_oneword(oneword,daynumber,csinterval,asc_t)){
                    list_t.push(oneword)
                    break;
                }
            }
        }
    }
    else {
        for (let oneword of enwords){
            var asc_t=0;
            //对选定的元素进行求和计算 - 保留注释
            for (var item of array_num_t){
                //asc_t=asc_t+asc_sum_b(oneword[item]); - 保留注释
                asc_t=asc_t+oneword[4][item];
            }

            if (sub_en_day_old_words_b_oneword(oneword,daynumber,csinterval,asc_t)){
                list_t.push(oneword)
            }            
        }
    }
    return list_t;
}

function enwords_sort_b(cstype=""){
    switch (cstype){
        case "a":
            enwords.sort();
            break;        
        case "z":
            enwords.sort();
            enwords.reverse();
            break;
        case "r":
            var bltotal_t=Math.floor((Math.random()*50)+1);
            for (var blxl=0;blxl<bltotal_t;blxl++){
                enwords.sort(randomsort_b);
            }
            break;
        default:
            enwords.sort(function (a,b){return a[3]-b[3];});
            break;
    }
}

function en_words_temp_list_b(){
    en_word_temp_get_b();
    var list_t=[];
    var list_simple_t=[];
    var bllen=enwords.length;
    for (let blxl=0;blxl<bllen;blxl++){
        var item=enwords[blxl];
        if (en_words_temp_global.includes(item[0])){
            if (blxl>100){
                list_t.push([item,en_words_temp_global.indexOf(item[0])]); //单词数组 和 序号 - 保留注释
            }
            else {
                //将最新的100个单词排在前头 - 保留注释
                list_t.push([item,bllen-blxl]);
            }
            list_simple_t.push(item[0]);
        }
    }
    
    for (let blxl=0;blxl<en_words_temp_global.length;blxl++){
        var item=en_words_temp_global[blxl];
        if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
            list_t.push([item,blxl]);
        }
    }
    
    //reverse - 保留注释
    list_t.sort(function (a,b){return b[1]-a[1];});
    var list2_t=[];
    for (let item of list_t){
        list2_t.push(item[0]); //单词数组 - 保留注释
    }
    //显示不包含的单词 - 保留注释
    console.log('en_words_temp_list_b()',array_difference_b(en_words_temp_global,list_simple_t));
    return list2_t;
}

function en_word_def_b(csword,csdef,csrecent_word){
	var bljg='';
    if (csdef!==''){
        if (csrecent_word!==''){
            if (csword==csrecent_word){
                bljg=bljg+' <span class="span_explanation" style="background-color:'+scheme_global["skyblue"]+';">'+csdef+'</span>';
            }
            else {
                bljg=bljg+' <span class="span_explanation" onclick="javascript:en_word_recent_bookmark_b(this,\''+csword+'\');">'+csdef+'</span>';
            }
        }
        else {
            bljg=bljg+' <span class="span_explanation">'+csdef+'</span>';
        }
    }
    return bljg;
}

function en_word_recent_bookmark_b(current_span,csword){
    if (confirm("是否设置"+csword+"为最近记忆单词书签？")){
        var ospans=document.getElementsByClassName('span_explanation');
        for (let item of ospans){
            item.style.backgroundColor='';
        }
        current_span.style.backgroundColor=scheme_global["skyblue"];
        localStorage.setItem('enwords_recent_bookmark',csword);
    }
}

function en_sentence_source_b(){
    var list_t=[];
    for (let item of en_sentence_global){
        if (list_t.includes(item[1]) || !item[1].includes('[http') || item[1].includes('[http://127.') || item[1].includes('[http://192.') || item[1].includes('[http://localhost:')){
            continue;
        }
        list_t.push(item[1]);
    }
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=[
            list_t[blxl].replace(new RegExp(/.*\[https?:\/\/(.*?)\/.*$/,'g'),'$1'),
            list_t[blxl].replace(new RegExp(/.*\[(https?:\/\/.*?)\s.*$/,'g'),'$1'),
            list_t[blxl].replace(new RegExp(/.*\[https?:\/\/.*?\s(.*)\].*$/,'g'),'$1'),
        ];
    }
    
    list_t.sort();
    return list_t;
}

function en_one_word_b(csword,csno,csrecent_word){  //wordlinks_kle
    if (csword==null){return '';}
	var csnum=arguments.length;
	if (csnum<=1){
        csno=[-1,0,false];
    }
	if (csnum<=2){
        csrecent_word='';
    }

	if (csword.length==1){
        csword.push("");
    }
	if (csword.length==2){
        csword.push("");
    }
	
	if (csno.length==1){
        csno.push(0);  //similar
    }
	if (csno.length==2){
        csno.push(false); //hide link
    } 
	
	var bljg='';
    var blword0=csword[0].replace(new RegExp("'",'g'),"\\'");
    if (csword[0].substring(0,4)=='=== ' && csword[0].slice(-4,)==' ==='){
        return '<span style="padding-left:0.5rem;padding-right:0.5rem;font-weight:bold;background-color:'+scheme_global['skyblue']+';">'+csword[0]+'</span>';
    }
    else if (csword[1]=='' && csword[2]==''){
        //just word - 保留注释
        bljg=bljg+'<span class="a_word" onclick="javascript:window.open(\'http://dict.cn/'+blword0+'\'); en_word_temp_change_b(this,\''+blword0+'\');"';
    }    
    else {
        bljg=bljg+'<span class="a_word" onclick="javascript:window.open(\'http://dict.cn/'+blword0+'\');"';
    }
    
    bljg=bljg+'><b>'+csword[0]+'</b></span> ';
	
	if (csno[2]==false){
		bljg=bljg+'(<i>';
        bljg=bljg+en_word_links_b(blword0,false);
		bljg=bljg+'</i>)';
	}
	if (csword[1]!==''){
        bljg=bljg+' <span class="span_pronounce" onclick="javascript:en_word_temp_change_b(this,\''+blword0+'\',\'switch\');"';

        if (en_words_temp_global.includes(csword[0])){
            bljg=bljg+' style="background-color:'+scheme_global['pink']+';"';
        }

        bljg=bljg+'>'+csword[1]+'</span>';
    }
    bljg=bljg+en_word_def_b(blword0,csword[2],csrecent_word);

	if (csno[1]!==0 || csno[0]!==-1){
        bljg=bljg+' <span class="txtsearch_lineno"><i>';
    }
	if (csno[1]!==0){
        bljg=bljg+'(<a class="similar" href="javascript:void(null);" onclick=\'javascript:similar_words_kle("'+csword[0]+'");\'>'+csno[1].toString()+'</a>)';
    }
	if (csno[0]!==-1){
        bljg=bljg+'('+(csno[0]+1).toString()+')';
    }
	if (csno[1]!==0 || csno[0]!==-1){
        bljg=bljg+'</i></span>';
    }
	return bljg;
}

function en_word_temp_batch_add_b(){
    var ospan=document.getElementsByClassName('span_pronounce');
    blxl=0;
    for (let item of ospan){
        if (item.style.backgroundColor!==''){
            continue;
        }
        blxl=blxl+1
    }
    if (blxl==0){return;}
    if (confirm("是否添加当前页面的 "+blxl+" 个单词到 最近记忆单词？")){
        for (let item of ospan){
            if (item.style.backgroundColor!==''){
                continue;
            }
            item.click();
        }
    }
}

function en_words_temp_textarea_b(divname,calljsname=''){
    en_word_temp_get_b();
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type=enwords" name="form_word_temp" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_word_temp" id="textarea_word_temp" style="height:'+(ismobile_b()?'10':'20')+'rem;">'+en_words_temp_global.join('\n')+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\''+divname+'\').innerHTML=\'\';">关闭</span> ';
    if (calljsname!==''){
        calljsname=calljsname+'();';
    }    
    bljg=bljg+'<span class="aclick" onclick="javascript:en_words_temp_update_b(\''+divname+'\');'+calljsname+'">更新</span> ';
    bljg=bljg+textarea_buttons_b('textarea_word_temp','全选,清空,复制','enwords');    
    bljg=bljg+'<span class="aclick" onclick="javascript:en_words_temp_send_to_txt_b();">发送到临时记事本</span> ';

    bljg=bljg+textarea_buttons_b('textarea_word_temp','发送地址','enwords');
    bljg=bljg+' 行数：'+en_words_temp_global.length;
    bljg=bljg+'</p>';    
    bljg=bljg+'</form>\n';
    
    document.getElementById(divname).innerHTML=bljg;
	return;
}

function en_words_temp_send_to_txt_b(){
    if (confirm("是否发送到临时记事本？")){
        document.querySelector('form[name="form_word_temp"]').submit();
    }
}

function en_words_temp_update_b(divname){
    var otextarea=document.getElementById('textarea_word_temp');
    if (otextarea){
        var list_t=otextarea.value.trim().split('\n');
        list_t=array_unique_b(list_t);
        if (confirm("是否更新("+list_t.length+")？")){
            var blstr=list_t.join('\n');
            localStorage.setItem('enwords_temp',blstr);
            en_words_temp_textarea_b(divname);
        }
    }
}
