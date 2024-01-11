//-----------------------
//history
//0.0.1-20190125
//-----------------------
function en_style_b(table_compare=false){
    document.write('\n<style>\n');
    document.write('a.similar {text-decoration:none;}\n');
    document.write('a.similar:link, a.similar:visited, a.similar:hover, a.similar:active{color:'+scheme_global['memo']+';}\n');
    document.write('.txtsearch_lineno {color:'+scheme_global['memo']+';font-size:0.8rem;}\n');
    document.write('.div_sentence{margin:1rem 0rem 1rem 2rem;border:0.2rem dashed '+scheme_global['shadow']+';padding:0.5rem 1rem;}\n');
    p_enwords_sentence_style_b();
    if (table_compare){
        document.write('#table_compare tr{background-color: '+scheme_global['background']+';}\n');
        document.write('#table_compare tr:hover {background-color: '+scheme_global['skyblue']+';}\n');
    }
    document.write('</style>\n');
}

function en_font_menu_b(str_t){
    var klmenu_font=['<span class="span_menu" onclick="'+str_t+'en_font_set_b();">abcde</span>'];
    var en_font_list=letters52_style_list_b();
    for (let blxl=0;blxl<en_font_list.length;blxl++){
        klmenu_font.push('<span class="span_menu" onclick="'+str_t+'en_font_set_b('+blxl+');">'+en_font_list[blxl].slice(0,5).join('')+'</span>');
    }
    return klmenu_font;
}

function en_font_set_b(csno=''){
    var t0 = performance.now();    
    var en_font_list=letters52_style_list_b();
    var odiv=document.getElementById('divhtml');
    var ospans=odiv.querySelectorAll('span.a_word, span.span_a_article_title_b, span.span_explanation, span.span_enwords_sentence');
    
    for (let aspan of ospans){
        var blhtml=aspan.innerHTML;
        aspan.innerHTML=letters52_style_transform_b(blhtml,-1);
    }
    if (csno===''){ //0=='' - 保留注释
        console.log('en_font_set_b() 还原费时：'+(performance.now() - t0) + ' milliseconds');
        return;
    }
    
    var blarray=en_font_list[csno];
    for (let aspan of ospans){
        var blhtml=aspan.innerHTML;
        var bljg='';
        while (true){
            var blstr=(blhtml.match(/(<.*?>)|(&[^\s]+;)/) || [''])[0];  //&考虑 unicode - 保留注释
            if (blstr==''){
                bljg=bljg+letters52_style_transform_b(blhtml,0,blarray);
                break;
            } else {
                var blat=blhtml.indexOf(blstr);
                bljg=bljg+letters52_style_transform_b(blhtml.substring(0,blat),0,blarray);
                bljg=bljg+blstr;
                blhtml=blhtml.substring(blat+blstr.length,);
            }
        }
        aspan.innerHTML=bljg;
    }
    console.log('en_font_set_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function enword_type_b(return_reg=false){
    var list_t=['adj', 'adv', 'art', 'vt', 'vi', 'phrase', 'pron', 'prep', 'pref', 'suf', 'conj', 'noun','idiom','num', 'abbr', 'int', 'v', 'n'];
    if (return_reg){
        return list_join_2_reg_style_b(list_t);
    }
    return list_t;
}

function en_word_def_istrong_b(csdef,is_remove=false){
    var bltypes=enword_type_b();
    if (is_remove){
        for (let item of bltypes){
            if (csdef.includes('<b>'+item+'. </b>')){
                csdef=csdef.replace(new RegExp('<b>'+item+'\\. <\/b>','g'),item+'. ');
            }
        }
        csdef=csdef.replace(new RegExp(' 📋 ','g'),' ');
        return csdef;    
    }
    
    if (csdef.includes('; 📋 ')){
        return csdef;
    }
    
    for (let item of bltypes){
        if (csdef.includes('; '+item+'. ') || csdef.includes('；'+item+'. ')){
            csdef=csdef.replace(new RegExp('(; |；)'+item+'\\. ','g'),'$1<b>'+item+'. </b>');
        }
        //if (csdef.includes('；'+item+'. ')){
            //csdef=csdef.replace(new RegExp('；'+item+'\\. ','g'),'；<b>'+item+'. </b>');
        //}            
        if (csdef.indexOf(item+'. ')==0){
            //从左到右替换一次 - 保留注释
            csdef=csdef.replace(item+'. ','<b>'+item+'. </b>');
        }
    }
    csdef=csdef.replace(new RegExp('; ','g'),'; 📋 ');
    return csdef;
}

function words_queue_emoji_b(){
    var list_t=[];
    for (let item of ['🥚','✏']){
        list_t.push([item,item.length]);
    }
    return list_t;
}

function words_queue_read_b(){
    console.log('添加临时单词前，单词库总数：',enwords.length);
    var list_t=local_storage_get_b('enwords_queue',-1,true);
    var one_word=[];
    for (let item of list_t){
        item=item.trim();
        if (item.includes('-') && item.replace(/-/g,'')==''){continue;}
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
                enwords.splice(0,0,[one_word[0],one_word[1],one_word[2]+'🥚']);  //添加到头部 - 保留注释
            }
            one_word=[];
        }
    }
    console.log('添加临时单词后，单词库总数：',enwords.length);
}

function enwords_init_b(simple=false){
    if (enwords.length==0){
        console.log('enwords 长度为0');
        return;
    }
    if (enwords[0].length>3){
        console.log('已初始化');
        return;
    }   //已初始化 - 保留注释
    
    var t0 = performance.now();    
    words_queue_read_b();   //导入临时添加的单词 - 保留注释
    
    if (simple){
        //写入序号 - 保留注释
        for (let blxl=0;blxl<enwords.length;blxl++){
            enwords[blxl].push(blxl);
            if (enwords[blxl][1]==''){
                enwords[blxl][1]='[null]';
            }
            enwords[blxl][2]=en_word_def_istrong_b(enwords[blxl][2]);
        }
        console.log('enwords_init_b() 费时：'+(performance.now() - t0) + ' milliseconds');
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

    console.log('enwords_init_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function en_similar_word_b(cskey,cskey_set,compared_word){
    if (compared_word==cskey || compared_word.toLowerCase()==cskey.toLowerCase()){
        return 0;
    } else if (cskey_set.has(compared_word) || cskey_set.has(compared_word.toLowerCase())){
        return 1;
    } else if (cskey==compared_word.substring(0,cskey.length) || cskey.toLowerCase()==compared_word.substring(0,cskey.length).toLowerCase()){
        return 2;
    } else if (cskey==compared_word.slice(-1*cskey.length,) || cskey.toLowerCase()==compared_word.slice(-1*cskey.length,).toLowerCase()){
        return 3;
    } else {
        for (let item of cskey_set){
            if (item.includes(compared_word) || item.includes(compared_word.toLowerCase())){
                return 4;
            }
            if (compared_word.includes(item) || compared_word.toLowerCase().includes(item)){
                return 4;
            }            
        }
        return 5;
    }
}

function enwords_batch_select_b(csname,csvalue=0,batch_open_num=10){
    csvalue=parseInt(csvalue);
    if (csvalue==-1){return;}
    var ocheckboxs=document.querySelectorAll('input[name="'+csname+'"]');
    
    if (batch_open_num>=0){
        var blmax=Math.min(ocheckboxs.length,csvalue+batch_open_num);
    } else {
        var blamx=ocheckboxs.length;
    }
    for (let blxl=0;blxl<ocheckboxs.length;blxl++){
        ocheckboxs[blxl].checked=(blxl>=csvalue && blxl<blmax);
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
        } else {
            var enstr_t=item;
        }
        if (enstr_t.substring(0,1)=='"' && enstr_t.slice(-1)=='"'){
            enstr_t=enstr_t.slice(1,-1);
        }
        if (enstr_t==''){continue;}
        blxl=blxl+1;
        bljg=bljg+'<input type="checkbox" name="checkbox_enword'+checkboxno+'" id="checkbox_enword'+id_name+'" value="'+specialstr_j(enstr_t,true)+'">';
        if (showno){
            bljg=bljg+'<label for="checkbox_enword'+id_name+'"><small style="color:'+scheme_global['memo']+';">'+blxl+'.</small>';
        }
        bljg=bljg+specialstr_j(enstr_t,true)+'</label> ';
        if (blxl>=100){
            bljg=bljg+'<strong><i>(&gt;100...)</i></strong>'
            break;
        }
    }

    var bllen=wordslist_t.length;
    if (bllen>1){
        bljg=bljg+'<label><input type="checkbox" id="checkbox_enwords_select_all" onchange=\'if (this.checked){enwords_checkbox_open_b("checkbox_enword'+checkboxno+'","1");}else {enwords_checkbox_open_b("checkbox_enword'+checkboxno+'","0");}\'>全选</label> ';
    }
    var batch_open_num=10;
    if (bllen>batch_open_num){
        bljg=bljg+'<select onchange="enwords_batch_select_b(\'checkbox_enword'+checkboxno+'\', this.value);">\n';
        bljg=bljg+select_option_numbers_b(Math.min(100,bllen),batch_open_num);
        bljg=bljg+'</select>\n';
    }
    bljg=bljg+'<span style="font-size:1.3rem;word-break:break-all;word-wrap:break-word;">';
    var list_t=en_search_sites_b();
    for (let item of list_t){
        bljg=bljg+'<span class="span_link" style="padding:0 0.5rem;" title="'+item[1]+'" onclick=\'enwords_checkbox_open_b("checkbox_enword'+checkboxno+'","'+item[0]+'");\'>'+item[0].toUpperCase()+'</span>';
    }
    bljg=bljg+'</span></div>';
    
    return bljg;
}

function en_word_links_b(csword='',ew=false){
    var list_t=en_search_sites_b(-1,ew);
    var bljg='';
    
    for (let item of list_t){
        bljg=bljg+'<span class="span_link" title="'+item[1]+'" onclick="open_link_en_b(\''+item[0]+'\',\''+specialstr_j(csword)+'\'); en_word_temp_change_b(this,\''+item[0]+'\');"';
        bljg=bljg+'>'+item[0]+'</span> ';
    }
    return bljg.trim();
}

function en_search_sites_b(maxlength=-1,ew=false){
    var list_t=[
    ['bt','Bing Microsoft Translator'],    
    ['b','Bing'],
    ['y','youdao'],
    ['d','海词'],
    ['m','Merriam-webster'],
    ['c','Collins'],    
    ['o','Oxford'],
    ['+','Cambridge'],
    //['r','wordReference'],
    ['k','KL Search'],    
    ];
    
    if (is_local_b()){
        list_t=list_t.concat([
        ['t','txtlistsearch'],        
        ['e','enwords'],
        ]); //不可排序 - 保留注释
    }
    if (!is_file_type_b()){
        list_t=list_t.concat([
        ['w','KLWiki'],    
        ['s','Selenium_news_reader'],
        ['👁','EBS'],
        ]); //不可排序 - 保留注释    
        
        if (ew){
            list_t.push(['w👁','WE']);            
        }
    }
    
    if (maxlength>0){
        list_t=list_t.slice(0,maxlength);
    }
    return list_t;
}

function enwords_checkbox_open_b(csname,cstype){
    function sub_enwords_checkbox_open_b_one(){
        if (blxl>=ocheckbox.length){return;}
        if (ocheckbox[blxl].checked){
            open_link_en_b(cstype,ocheckbox[blxl].value);
            blxl=blxl+1;
            setTimeout(sub_enwords_checkbox_open_b_one,1000);
        } else {
            blxl=blxl+1;
            sub_enwords_checkbox_open_b_one();
        }
    }
    //-----------------------
    var ocheckbox=document.getElementsByName(csname);
    if (ocheckbox.length==0){return;}
    if (cstype=='1'){
        for (let item of ocheckbox){
            item.checked=true;
        }
        return;
    } else if (cstype=='0'){
        for (let item of ocheckbox){
            item.checked=false;
        }
        return;
    }
    var blcount=0;
    for (let item of ocheckbox){
        if (item.checked){
            blcount=1;
            break;
        }
    }
    if (blcount==0){
        ocheckbox[0].checked=true;
    }
    
    var blxl=0;
    sub_enwords_checkbox_open_b_one();
}

function open_link_en_b(cstype,csword,do_open=true){
    var blhref='';
    switch (cstype){
        case '+':
            blhref='https://dictionary.cambridge.org/dictionary/english/'+web_href_key_b(csword,'-',true);
            break;
        case 'c':
            blhref='https://www.collinsdictionary.com/dictionary/english/'+web_href_key_b(csword,'-',true);
            break;
        case 'd':
            blhref='https://dict.cn/'+encodeURIComponent(csword);
            break;
        case 'b':
            blhref='https://cn.bing.com/dict/search?q='+encodeURIComponent(csword);
            break;
        case 'y':
            blhref='https://dict.youdao.com/search?le=eng&q='+encodeURIComponent(csword);
            break;            
        case 'w':
            blhref=local_storage_get_b('kl_remote_host',-1,false)+'/wiki/index.php?search='+encodeURIComponent(csword)+'&title=特殊%3A搜索&profile=default&fulltext=1';
            break;
        case 't':
            blhref=klbase_sele_path_b()[1]+'/html/txtlistsearch.htm';
            blhref=blhref+'?_tagKLWiki0&s='+web_href_key_b(csword,'+',true);
            break;
        case 'bt':
            blhref='https://cn.bing.com/translator/';
            break;
        case '👁':
            blhref=klwebphp_path_b('book_search.php');
            blhref=blhref+'?s='+web_href_key_b(csword,'s',true)+'(:r)&eng';
            break;
        case 'w👁':
            open_link_en_b('w',csword,do_open);
            open_link_en_b('👁',csword,do_open);
            break;
        case 'e':
            blhref=klbase_sele_path_b()[1]+('/html/enwords.htm');
            blhref=blhref+'?s='+web_href_key_b(csword,'+',true);
            break;
        case 'o':
            blhref='https://www.oxfordlearnersdictionaries.com/definition/english/'+web_href_key_b(csword,'-',true);
            break;
        case 'm':
            blhref='https://www.merriam-webster.com/dictionary/'+web_href_key_b(csword,'+',true);
            break;  
        //case 'r':
            //blhref='https://www.wordreference.com/definition/'+encodeURIComponent(csword);
            //break;                      
        case 's':
            var blhref=klwebphp_path_b('klbase_html_jump.htm');
            blhref=blhref+'?selenium_news_search.php?search='+encodeURIComponent( '\\b'+csword+'\\b(:title)(:r)');
            break;
        case 'k':
            blhref=klbase_sele_path_b()[1];
            blhref=blhref+'/html/klsearch.htm?k='+encodeURIComponent(csword)+'&t=batch_en&iframe';           
            break; 
    }
    if (blhref!=='' && do_open){
        window.open(blhref);
    }
    return blhref;
}

function sup_kleng_hide_b(){
	var o_sups=document.querySelectorAll('sup.kleng');
	if (o_sups.length==0){return;}

	for (var item of o_sups){
		if (item.style.display=='none'){
			item.style.display='inline';
		} else {
			item.style.display='none';
		}
	}
}

function sup_kleng_show_hide_b(ospan){
    var oword=ospan.parentNode.querySelector('span.span_sup_word_full');
    popup_show_hide_b(oword,'');
}

function sup_kleng_words_b(csdisplay='none'){
    var o_sups=document.querySelectorAll('sup.kleng');
	if (o_sups.length==0){return;}
    
    var t0 = performance.now(); 
    
	for (let one_sup of o_sups){
        var word_t=one_sup.innerText;
        if (!word_t){return;}
        
        if (word_t.substring(0,1)=='"' && word_t.slice(-1)=='"'){
            word_t=word_t.slice(1,-1);
        }
        if (one_sup.style && one_sup.style.color=='blue'){
            var supcolor='blue';
        } else {
            var supcolor='#cc0000';
        }
        for (let item of enwords){
            if (item[0]==word_t){
                one_sup.innerHTML='<span class="span_sup_word_icon span_box" onclick="sup_kleng_show_hide_b(this);" style="margin-left:0.05rem;">🇬🇧</span><span class="span_sup_word_full" style="display:'+csdisplay+';margin-left:0.05rem;">(<span class="span_box" onclick="popup_words_links_b(event,\''+specialstr_j(word_t)+'\');"><font color="'+supcolor+'">'+item[1]+'</font></span> '+en_word_def_istrong_b(item[2])+')</span>';
                break;
            }
        }
	}
    console.log('sup_kleng_words_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function line_enword_count_b(odiv,ocontent){
    if (odiv && ocontent){            
        var blstr=ocontent.innerHTML.replace(/<sup.*?>.*?<\/sup>/g,'');
        odiv.innerHTML=blstr;
        var list_t=odiv.innerText.match(/\b[a-z\-\']+\b/ig) || [];
        return list_t.length;
    }
    return '';
}

function lines_enword_total_b(clicked_ospan=false){
    if (clicked_ospan){
        if (clicked_ospan.style.backgroundColor==''){
            clicked_ospan.style.backgroundColor=scheme_global['pink'];
        } else {
            clicked_ospan.style.backgroundColor='';
        }
    }
    var ospans=document.querySelectorAll('span.span_clicked_line_word_count, sup.sup_clicked_line_word_count, sub.sub_clicked_line_word_count');
    var blsum=0;
    if (clicked_ospan){
        for (let aspan of ospans){
            if (aspan.style.backgroundColor==''){continue;}
            var blvalue=parseInt(aspan.innerText);    
            blsum=blsum+blvalue;
        }
        var ospan=document.getElementById('span_clicked_line_word_total');
        if (ospan){
            ospan.innerText=blsum;        
        }
    } else {
        for (let aspan of ospans){
            var blvalue=parseInt(aspan.innerText);    
            blsum=blsum+blvalue;
        }    
        var ospan=document.getElementById('span_all_line_word_total');
        if (ospan){
            ospan.innerText=blsum;
        }
    }
}

function enwords_b(csstr,cstype=''){
	//<eword w=zoo></eword> - 保留注释
    if (!csstr.includes('&lt;eword') || !csstr.includes('&lt;/eword&gt;')){
        if (cstype=='array'){
            return [];
        } else {
            return csstr;
        }
    }

    if (cstype=='array'){
        var list_t=[];
        var myRegexp = /&lt;eword w=((&quot;|")?)(.*?)\1&gt;.*?&lt;\/eword&gt;/g;
        var result=[];
        while (result = myRegexp.exec(csstr)){
            if (result.length>=3+1){
                //循环单词库，寻找同名单词 - 保留注释
                for (let item of enwords){
                    if (item[0]==result[3]){
                        list_t.push([item[0],item[1],item[2]]);
                        break;
                    }
                }
                //list_t.push([result[2],result[4],result[5]]); - 保留注释
            }
        }
        return list_t;
    } else {
        var bljg=csstr.replace(/&lt;eword w=(&quot;|")(.*?)\1&gt;&lt;\/eword&gt;/g,sup_kleng_style_b()+'$2</sup>');
        bljg=bljg.replace(/&lt;eword w=(.*?)(&gt;|\s).*?&lt;\/eword&gt;/g,sup_kleng_style_b()+'$1</sup>');
        return bljg;
    }
}

function sup_kleng_style_b(){
    return '<sup style="font-size:0.8rem;color:#cc0000;" class="kleng">';
}

function en_lines_days_b(csarray,cstheday=''){
    if (cstheday==''){
        var today_t=new Date();
    } else {
        var today_t=validdate_b(cstheday);
    }
    
    var month_days=month_day_b(today_t.getMonth()+1,today_t.getFullYear());
    var blday=today_t.getDate();

    var cscount=csarray.length/month_days;
    var blstart=Math.floor((blday-1)*cscount);
    var blend=Math.floor(blday*cscount);
	var bljg=[];   
	for (let blxl=blstart;blxl<blend;blxl++){
        bljg.push(csarray[blxl]);
	}
    return enwords_b(bljg.join('\n'),'array');
}

function en_sentence_p_style_b(fontsize='0.95'){
    return '<p class="p_enwords_sentence" style="line-height:130%;font-size:'+fontsize+'rem;margin-top:0.3rem;padding:0.2rem 0.5rem;">';
}

function en_sentence_one_line_b(aline,wordname='',attachment_path='',wikisite='',button_str='',return_arr=false,keep_kleng=false){  //attachment_path 用于替换 {{wikiuploads}} - 保留注释
    function sub_en_sentence_one_line_b_replace(item,aword){
        item=item.replace(new RegExp('&lt;eword w=&quot;'+aword+'&quot;&gt;&lt;/eword&gt;','g'),'<sup>🚩</sup>');
        item=item.replace(new RegExp('&lt;eword w='+aword+'&gt;&lt;/eword&gt;','g'),'<sup>🚩</sup>');    
        return item;
    }
    
    function sub_en_sentence_one_line_b_flag(item,aword){
        if (item.match(new RegExp('\\b'+aword+'\\b','i'))!==null){
            item=item.replace(new RegExp('<sup>🚩</sup>','g'),'');
        }
        if (item.toLowerCase().match('http[^\\s]*'+aword.toLowerCase()+'[^\\s]*')==null){
            item=item.replace(new RegExp('\\b('+aword+')\\b','ig'),'<span style="background-color: '+scheme_global['skyblue']+';">$1</span>');
        }    
        return item;
    }
    //-----------------------
    var item=aline[0];
    if (Array.isArray(item)){
        item=item.join(' ');
    }
    
    if (typeof wordname == 'string'){
        wordname=[wordname];
    }
    
    var blmatch=false;
    for (let aword of wordname){
        if (aword==''){
            blmatch=true;
            continue;
        }
        if (!item.includes('w=&quot;'+aword+'&quot;') && !item.includes('w='+aword+'&gt;') && item.match(new RegExp('\\b'+aword+'\\b','i'))==null){
            continue;
        }
        blmatch=true;
        item=sub_en_sentence_one_line_b_replace(item,aword);
    }
    
    //若循环一遍后未含有 指定的单词组，则直接返回空字符串 - 保留注释
    if (blmatch==false){
        if (return_arr){
            return [];
        } else {
            return '';
        }
    }
    
    if (!keep_kleng){
        item=item.replace(/&lt;eword.*?&gt;&lt;\/eword&gt;/g,'');
    }
    
    for (let aword of wordname){
        if (aword==''){continue;}
        if (!item.includes('w=&quot;'+aword+'&quot;') && !item.includes('w='+aword+'&gt;') && item.match(new RegExp('\\b'+aword+'\\b','i'))==null){
            continue;
        }

        item=sub_en_sentence_one_line_b_flag(item,aword);
    }

    if (item.match(/<(i|strong|u|em)>/)!==null){
        for (let adom of ['i','strong','u','em']){
            var blat1=item.lastIndexOf('<'+adom+'>');
            var blat2=item.lastIndexOf('</'+adom+'>');
            if (blat1>=0 && blat2<blat1){
                item=item+'</'+adom+'>';
            }
        }
    }
    var bljg='<span class="span_enwords_sentence">'+wiki_line_b(item,attachment_path)+'</span>';
    
    //---
    if (aline[1].slice(-1)!=='/'){
        aline[1]=aline[1]+'/';
    }
    
    var web_source=wiki_line_b(aline[1]);
    if (!return_arr){
        web_source=' <span class="span_from_url" style="line-height:150%;" onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';">'+web_source+'</span>';
    }
    
    var wiki_source='';
    if (wikisite!==''){
        if (aline[2].slice(-4,)=='_TLS'){
            var blstr=aline[2].slice(0,-4);
            wiki_source='<a href="'+wikisite+encodeURIComponent(blstr.replace(/[\+\s\?\*\-\\\[\]\(\)\']/g,'.'))+'_reg&s='+wordname+'" target=_blank>'+blstr+'</a>';
        } else {
            var wiki_link=aline[1].match(/^\/\[[^\s]*\s(.+)\]\/$/) || [];
            if (wiki_link.length==2){
                wiki_link=wiki_page_title_link_generate_b(aline[2],wiki_link[1]);
            } else {
                wiki_link=wiki_page_title_link_generate_b(aline[2]);
            }
            wiki_source='<a href="'+wikisite+wiki_link+'" target=_blank>'+aline[2]+'</a>';
        }
        if (!return_arr){
            wiki_source='<span class="span_from_wiki" style="line-height:150%;" onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';">'+wiki_source+'</span>';
        }
    }
    
    if (return_arr){
        return [bljg,web_source,wiki_source];
    } else {
        bljg=bljg+web_source+wiki_source+button_str;
        return bljg;
    }
}

function en_sentence_result_b(wordname,csmax=-1,fontsize='',attachment_path='',wikisite='',txtlistsearch_site='',button_str='',no_start=0){
    function sub_en_sentence_result_b_statistics(){
        console.log('扫描例句条数：',split_no_set.size,'；例句总条数：',en_sentence_global.length,'；占比：',(split_no_set.size*100/en_sentence_global.length).toFixed(2)+'%');    
    }
    //-----------------------
    if (en_sentence_global.length==0){
        return ['',0,0];
    } else if (Array.isArray(wordname)){
        if (wordname.length==0){
            return ['',0,0];
        }
    } else if (wordname.trim()==''){
        return ['',0,0];
    }
    
    if (fontsize==''){
        fontsize='0.95';
    }
    var p_style=en_sentence_p_style_b(fontsize);
    
    var split_no_set=new Set();
    if (Array.isArray(wordname)){
        var sentence_list={};
        for (let aword of wordname){
            sentence_list['w_'+aword]=['',0,0];
        }
        
        for (let aword of wordname){
            for (let blno=no_start;blno<en_sentence_global.length;blno++){
                var aline=en_sentence_global[blno];            
                if (csmax>0 && sentence_list['w_'+aword][1]>=csmax){continue;}
            
                var search_site=(aline[2].slice(-4,)=='_TLS'?txtlistsearch_site:wikisite);
                var line_split=sentence_split_b(aline[0],blno);
                split_no_set.add(blno);
                for (let arow of line_split){
                    var str_t=en_sentence_one_line_b([arow].concat(aline.slice(1,)),aword,attachment_path,search_site,button_str);
                    if (str_t!==''){
                        str_t=p_style+str_t+'</p>\n';
                        sentence_list['w_'+aword][0]=sentence_list['w_'+aword][0]+str_t;
                        sentence_list['w_'+aword][1]=sentence_list['w_'+aword][1]+1;
                        sentence_list['w_'+aword][2]=blno+1;
                    }
                }
            }
        }
        
        sub_en_sentence_result_b_statistics();
        return sentence_list;
    } else {
        var bljg='';
        var blxl=0; //例句条数 - 保留注释
        var no_next=0;
        for (let blno=no_start;blno<en_sentence_global.length;blno++){
            var aline=en_sentence_global[blno];
            var search_site=(aline[2].slice(-4,)=='_TLS'?txtlistsearch_site:wikisite);
            var do_break=false;
            var line_split=sentence_split_b(aline[0],blno);
            split_no_set.add(blno);

            for (let arow of line_split){
                var str_t=en_sentence_one_line_b([arow].concat(aline.slice(1,)),wordname,attachment_path,search_site,button_str);
                if (str_t!==''){
                    bljg=bljg+p_style+str_t+'</p>\n';
                    blxl=blxl+1;
                }
                no_next=blno+1;
                if (csmax>0 && blxl>=csmax){
                    do_break=true;
                    break;
                }
            }
            if (do_break){break;}
        }
        
        sub_en_sentence_result_b_statistics();
        return [bljg,blxl,no_next];
    }
}

function en_sentence_mobile_b(enforce=false){
    if (enforce===false && ismobile_b()==false){return;}
    
    var ospans=document.getElementsByClassName('span_from_url');
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

function en_word_temp_important_init_b(){
    if (typeof en_words_temp_important_global == 'undefined'){
        en_words_temp_important_global=[];  //全局变量 - 保留注释
    }
}

function en_word_temp_important_change_b(ospan){
    var csword=ospan.innerText;
    en_word_temp_important_init_b();
    if (ospan.style.color==''){
        if (!en_words_temp_global.includes(csword) || en_words_temp_important_global.includes(csword)){return;}
        
        var old_word=enwords_recent_bookmark_get_b();
        if (old_word==csword){return;}
        en_words_temp_important_global.push(csword);
        ospan.style.color=scheme_global['a-hover'];
    } else {
        var blat=en_words_temp_important_global.indexOf(csword);
        if (blat>=0){
            en_words_temp_important_global.splice(blat,1);
            ospan.style.color='';
        }
    }
    enwords_temp_2_local_storage_b(en_words_temp_global);
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
                enwords_temp_2_local_storage_b(en_words_temp_global);
            }
        }
    } else {
        var recent_bookmark=enwords_recent_bookmark_get_b();
        if (csword==recent_bookmark){
            //如果单词是书签，则不可剔除 - 保留注释
            return;
        }
        ospan.style.backgroundColor='';
        if (cstype=='switch' || cstype=='remove'){
            var blat=en_words_temp_global.indexOf(csword);
            if (blat>=0){
                en_words_temp_global.splice(blat,1);
                
                en_word_temp_important_init_b();
                var blat2=en_words_temp_important_global.indexOf(csword);
                if (blat2>=0){
                    en_words_temp_important_global.splice(blat2,1);
                }
                enwords_temp_2_local_storage_b(en_words_temp_global);
            }
        }
    }
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
    //-----------------------
    var list_t=[];
    var csinterval=4;
    if (cstype.includes('_OR')){
        for (let oneword of enwords){
            var asc_t=0;
            for (let item of array_num_t){
                //asc_t=asc_sum_b(oneword[item]); - 保留注释
                asc_t=oneword[4][item];
                //只要一项元素符合即可 - 保留注释
                
                if (sub_en_day_old_words_b_oneword(oneword,daynumber,csinterval,asc_t)){
                    list_t.push(oneword)
                    break;
                }
            }
        }
    } else {
        for (let oneword of enwords){
            var asc_t=0;
            //对选定的元素进行求和计算 - 保留注释
            for (let item of array_num_t){
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

function enwords_sort_b(cstype=''){
    switch (cstype){
        case 'a':
            enwords.sort();
            break;        
        case 'z':
            enwords.sort();
            enwords.reverse();
            break;
        case 'r':
            var bltotal_t=Math.floor((Math.random()*50)+1);
            for (let blxl=0;blxl<bltotal_t;blxl++){
                enwords.sort(randomsort_b);
            }
            break;
        default:
            enwords.sort(function (a,b){return a[3]>b[3] ? 1 : -1;});
            break;
    }
}

function en_words_temp_list_b(add_date_line=true,return_dead_words=false){
    en_word_temp_get_b();
    var list_t=[];
    var list_simple_t=[];
    var bllen=enwords.length;
    for (let blxl=0;blxl<bllen;blxl++){
        var item=enwords[blxl];
        if (en_words_temp_global.includes(item[0])){
            if (blxl<=100){
                //将 最新的100个单词 排在前头 - 保留注释
                list_t.push([item,bllen-blxl]);
            } else if (en_words_temp_important_global.includes(item[0])){
                //将 重要临时单词 排在前头 - 保留注释            
                list_t.push([item,bllen-101]);
            } else {
                list_t.push([item,en_words_temp_global.indexOf(item[0])]); //单词数组 和 序号 - 保留注释
            }            

            list_simple_t.push(item[0]);
        }
    }
    
    if (add_date_line){
        for (let blxl=0;blxl<en_words_temp_global.length;blxl++){
            var item=en_words_temp_global[blxl];
            if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
                list_t.push([item,blxl]);
            }
        }
    }
    
    //reverse - 保留注释
    list_t.sort(function (a,b){return b[1]>a[1] ? 1 : -1;});
    var list2_t=[];
    for (let item of list_t){
        list2_t.push(item[0]); //单词数组 - 保留注释
    }
    //显示不包含的单词 - 保留注释
    var dead_list=array_difference_b(en_words_temp_global,list_simple_t);
    if (return_dead_words){
        return dead_list;
    } else {
        console.log('en_words_temp_list_b()',dead_list);
        return list2_t;
    }
}

function en_word_def_b(csword,csdef,csrecent_word=''){
    if (csdef==''){return '';}

	var bljg='';   
    if (csrecent_word!==''){
        if (csword==csrecent_word){
            bljg=bljg+' <span class="span_explanation" style="background-color:'+scheme_global['skyblue']+';">'+csdef+'</span>';
        } else {
            bljg=bljg+' <span class="span_explanation">'+csdef+'</span>';
        }
    } else {
        bljg=bljg+' <span class="span_explanation">'+csdef+'</span>';
    }
    
    return bljg;
}

function enwords_recent_bookmark_get_b(){
    return local_storage_get_b('enwords_recent_bookmark').trim();
}

function en_word_recent_bookmark_b(refresh=true){
    var old_word=enwords_recent_bookmark_get_b();
    var csword=(prompt('输入新的最近记忆单词，作为书签',old_word) || '').trim();
    if (csword=='' || csword==old_word){return;}
    
    en_word_temp_get_b();
    if (!en_words_temp_global.includes(csword)){
        alert(csword+' 不是最近记忆单词');
        return;
    }
    
    localStorage.setItem('enwords_recent_bookmark',csword);
    if (refresh){
        recent_words_list_enwords_b(0);
    }
}

function en_sentence_source_b(cskey='',isreg=false){
    var list_t=[];
    for (let item of en_sentence_global){
        if (list_t.includes(item[1]) || !item[1].includes('[http') || item[1].includes('[http://127.') || item[1].includes('[http://192.') || item[1].includes('[http://localhost:')){
            continue;
        }
        
        if (cskey==''){
            list_t.push(item[1]);
        } else {
            var blfound=str_reg_search_b(item[1],cskey,isreg);
            if (blfound==-1){break;}        
            if (blfound){
                list_t.push(item[1]);
            }
        }
    }
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=[
            list_t[blxl].replace(/.*\[https?:\/\/(.*?)\/.*$/g,'$1'),
            list_t[blxl].replace(/.*\[(https?:\/\/.*?)\s.*$/g,'$1'),
            list_t[blxl].replace(/.*\[https?:\/\/.*?\s(.*)\].*$/g,'$1'),
        ];
    }
    
    list_t.sort();
    return list_t;
}

function sentence_set_path_and_get_b(csword,csmax,font_size,remote_host,button_str,no_start=0){
    var attachment_path,wikisite,txtlistsearch_site;
    [attachment_path,wikisite,txtlistsearch_site]=sentence_path_get_b(remote_host,is_local_b());

    return en_sentence_result_b(csword,csmax,font_size,attachment_path,wikisite,txtlistsearch_site,button_str,no_start);
}

function sentence_path_get_b(remote_host,is_local){
    if (is_local){
        return [remote_host+'/wikiuploads/',remote_host+'/wiki/index.php/',remote_host+'/klwebphp/PythonTools/data/selenium_news/html/txtlistsearch.htm?_tag'];
    } else {
        return ['','',klbase_sele_path_b()[1]+'/html/txtlistsearch.htm?_tag'];   
    }
}

function sentence_property_b(show_button){
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var button_str=(show_button?en_sentence_button_init_b(true):'');
    var font_size=(ismobile_b()?'1.1':'');
    return [remote_host,button_str,font_size];
}

function sentence_format_b(csword){
    copy_2_clipboard_b('<eword w="'+csword+'"></eword>');
}

function sentence_popup_b(csword,ospan=false,no_start=0){
    var odiv=document.getElementById('div_enword_search_links');
    if (!odiv){return;}    
    
    var blmax_rows=5;
    var remote_host, button_str, font_size;
    [remote_host,button_str,font_size]=sentence_property_b(false);

    var bljg,blcount,no_next;
    [bljg,blcount,no_next]=sentence_set_path_and_get_b(csword,blmax_rows,font_size,remote_host,button_str,no_start);
    if (bljg==''){
        if (no_start==0){
            if (ospan!==false){
                ospan.style.textDecoration='line-through';
                ospan.style.color=scheme_global['a-hover'];
            }
            return;
        } else {
            no_start=0;
            [bljg,blcount,no_next]=sentence_set_path_and_get_b(csword,blmax_rows,font_size,remote_host,button_str,no_start);
        }
    }
    if (ospan!==false){
        ospan.outerHTML='';
    }

    if (no_next>=en_sentence_global.length){
        no_next=0;
    }
    var osentence=odiv.querySelector('div.div_enwords_sentence');
    if (osentence){        
        osentence.parentNode.removeChild(osentence);
    }
    
    if (no_start==0 && no_next==0 && blcount<blmax_rows){
        var more_link='';
    } else {
        var more_link='<p align="right" class="p_more"><span class="span_link" onclick="sentence_popup_b(\''+specialstr_j(csword)+'\',false,'+no_next+');">more ('+(no_next+1)+'+)</span></p>'; //   //刚好5条例句有可能会再次出现 more_link - 保留注释
    }
    odiv.insertAdjacentHTML('beforeend','<div class="div_enwords_sentence">'+bljg+more_link+'</div>');
}

function popup_def_b(ospan){
    if (typeof enwords == 'undefined'){return;}

    var oparent=ospan.parentNode;
    if (!oparent){return;}
    var oword=oparent.querySelector('span.span_popup_word');
    if (!oword){return;}
    
    var odiv=document.getElementById('div_enword_search_links');
    if (!odiv){return;}
    
    var blword=oword.innerText;
    var bldef='';
    for (let item of enwords){
        if (item[0]==blword){
            wordname=item[0].replace(new RegExp("'",'g'),"\\'");
            bldef=bldef+en_word_pronunciation_b(wordname,item);
            bldef=bldef+en_word_def_b(wordname,item[2]);
            break;
        }
    }
    if (bldef==''){
        ospan.style.textDecoration='line-through';
        ospan.style.color=scheme_global['a-hover'];
        return;
    }
    odiv.insertAdjacentHTML('beforeend',bldef);
    ospan.outerHTML='';
}

function popup_words_links_b(event,csword,ew=false,def_button=false,mobile_font_size='1.8rem'){
    var bljg='<span class="span_popup_word" style="cursor:pointer;font-weight:bold;'+(en_words_temp_important_global.includes(csword)?'color:'+scheme_global['a-hover']+';':'')+'" onclick="en_word_temp_important_change_b(this);">'+csword+'</span> ';
    if (def_button){
        bljg=bljg+'<span class="span_link" onclick="popup_def_b(this);">def</span> ';
    }
    bljg=bljg+'<br />'+en_word_links_b(csword,ew);
    bljg=bljg+' <span class="span_link" onclick="sentence_format_b(\''+specialstr_j(csword)+'\');" title="复制 wiki 格式到剪贴板">f</span>';
    if (typeof en_sentence_global !== 'undefined'){
        bljg=bljg+' <span class="span_link" onclick="sentence_popup_b(\''+specialstr_j(csword)+'\',this);">例句</span>';
    }
    var ismobile=ismobile_b();
    var odiv=document.getElementById('div_enwords_mini_search_frame');
    var z_index=(odiv?(parseInt(odiv.style.zIndex)+1 || -1):-1);
    popup_event_div_b(event,'div_enword_search_links',bljg,'bottom',mobile_font_size,0.8,(ismobile?70:50)+'%','',(ismobile?'0.3rem':'0.2rem'),'inset',z_index);
}

function en_one_word_b(csword,csno=[-1,0],csrecent_word='',change_color=true,ew=false,def_button=false){
    if (csword==null){return '';}
	if (csword.length==1){
        csword.push('');
    }
	if (csword.length==2){
        csword.push('');
    }
	
	if (csno.length==1){
        csno.push(0);  //similar
    }
	
	var bljg='';
    var blword0=csword[0].replace(new RegExp("'",'g'),"\\'");
    if (csword[0].substring(0,4)=='=== ' && csword[0].slice(-4,)==' ==='){
        return '<span style="padding-left:0.5rem;padding-right:0.5rem;font-weight:bold;background-color:'+scheme_global['skyblue']+';">'+csword[0]+'</span>';
    } else if (change_color && csword[1]=='' && csword[2]==''){
        //just word - 保留注释
        bljg=bljg+'<span class="a_word" onclick="popup_words_links_b(event,\''+blword0+'\','+ew+','+def_button+'); en_word_temp_change_b(this,\''+blword0+'\');"';
    } else {
        bljg=bljg+'<span class="a_word" onclick="popup_words_links_b(event,\''+blword0+'\','+ew+','+def_button+');"';
    }
    
    bljg=bljg+'><b>'+csword[0]+'</b></span> ';    
    
    bljg=bljg+en_word_pronunciation_b(blword0,csword);
    bljg=bljg+en_word_def_b(blword0,csword[2],csrecent_word);

	if (csno[1]!==0 || csno[0]!==-1){
        bljg=bljg+' <span class="txtsearch_lineno"><i>';
    }
	if (csno[1]!==0){
        bljg=bljg+'(<a class="similar" href="javascript:void(null);" onclick=\'similar_enwords_b("'+csword[0]+'");\'>'+csno[1].toString()+'</a>)';
    }
	if (csno[0]!==-1){
        bljg=bljg+'('+(csno[0]+1).toString()+')';
    }
	if (csno[1]!==0 || csno[0]!==-1){
        bljg=bljg+'</i></span>';
    }
	return bljg;
}

function en_word_pronunciation_b(cswname=false,csword){
	if (csword[1]==''){return '';}

    if (cswname==false){
        cswname=csword[0].replace(new RegExp("'",'g'),"\\'");
    }
    var bljg='';
    bljg=bljg+' <span class="span_pronounce" onclick="en_word_temp_change_b(this,\''+cswname+'\',\'switch\');"';
    if (en_words_temp_global.includes(csword[0])){
        bljg=bljg+' style="background-color:'+scheme_global['pink']+';"';
    }
    bljg=bljg+'>'+csword[1]+'</span>';
    
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
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type=enwords_temp" name="form_word_temp" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_word_temp" id="textarea_word_temp" style="height:'+(ismobile_b()?'10':'20')+'rem;">'+en_word_temp_get_b('raw')+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+close_button_b(divname,'')+' ';
    if (calljsname!==''){
        calljsname=calljsname+'();';
    }    
    bljg=bljg+'<span class="aclick" onclick="en_words_temp_update_b(\''+divname+'\');'+calljsname+'">Update</span> ';
    bljg=bljg+textarea_buttons_b('textarea_word_temp','全选,清空,复制,导入temp_txt_share','enwords_temp');    
    bljg=bljg+'<span class="aclick" onclick="en_words_temp_send_to_txt_b();" title="send to remote temp memo">📤</span> ';

    bljg=bljg+textarea_buttons_b('textarea_word_temp','发送地址','enwords_temp');
    bljg=bljg+' row: '+en_words_temp_global.length;
    bljg=bljg+'</p>';    
    bljg=bljg+'</form>\n';
    
    document.getElementById(divname).innerHTML=bljg;
}

function en_words_temp_send_to_txt_b(){
    if (confirm('是否发送到临时记事本？')){
        document.querySelector('form[name="form_word_temp"]').submit();
    }
}

function en_words_temp_update_b(divname){
    var otextarea=document.getElementById('textarea_word_temp');
    if (otextarea){
        var list_t=otextarea.value.trim().split('\n');
        list_t=array_unique_b(list_t);
        if (confirm('是否更新('+list_t.length+')？')){
            enwords_temp_2_local_storage_b(list_t);
            en_words_temp_textarea_b(divname);
        }
    }
}

function en_word_temp_get_b(cstype=''){
    switch (cstype){
        case 'raw':
            return local_storage_get_b('enwords_temp');
            break;
        case 'common':
        case 'important':
            var list_t=local_storage_get_b('enwords_temp',-1,true);
            var result_t=[];
            for (let item of list_t){
                if (cstype=='important' && item.substring(0,1)=='*' || cstype=='common' && item.substring(0,1)!=='*'){
                    result_t.push(item.substring(1,));
                }
            }
            return result_t;
            break;
    }
    //-----------------------
    en_words_temp_important_global=[];  //全局变量 - 保留注释
    en_words_temp_global=local_storage_get_b('enwords_temp',-1,true);
    for (let blxl=0;blxl<en_words_temp_global.length;blxl++){
        if (en_words_temp_global[blxl].substring(0,1)=='*'){
            en_words_temp_global[blxl]=en_words_temp_global[blxl].substring(1,);
            en_words_temp_important_global.push(en_words_temp_global[blxl]);
        }
    }
}

function enwords_temp_2_local_storage_b(csarray){
    function sub_enwords_temp_2_local_storage_b_is_date(item){
        return item.substring(0,4)=='=== ' && item.slice(-4,)==' ===';
    }
    //-----------------------
    if (csarray.length==0){return;}
    if (sub_enwords_temp_2_local_storage_b_is_date(csarray[0])){
        csarray=csarray.slice(1,);
    }
    
    if (Math.random()<0.1){ //偶尔扫描 - 保留注释
        for (let blxl=1;blxl<(csarray.length-1)/2;blxl++){  //忽略第1个和最后一个元素，且只检查一半最旧的记录 - 保留注释
            if (sub_enwords_temp_2_local_storage_b_is_date(csarray[blxl-1]) && sub_enwords_temp_2_local_storage_b_is_date(csarray[blxl]) && sub_enwords_temp_2_local_storage_b_is_date(csarray[blxl+1])){
                console.log(csarray[blxl]);
                csarray[blxl]='';
            }
        }
    }

    en_word_temp_important_init_b();
    var result_t=[];
    for (let item of csarray){
        if (item==''){continue;}
        if (en_words_temp_important_global.includes(item)){
            result_t.push('*'+item);
        } else {
            result_t.push(item);
        }
    }
    localStorage.setItem('enwords_temp',result_t.join('\n'));
}

function enwords_array_to_links_b(csarray,oldset=new Set(),fn_name='',return_old_count=false){
    var bljg=[];
    var blxl=0;
    if (fn_name==''){
        blsmall='<small class="small_enword_no_b">';
    } else {
        blsmall='<small class="small_enword_no_b" style="cursor:pointer;" onclick="'+fn_name+'(this);">';
    }
    var old_count=0;
    for (let item of csarray){  //csarray 有可能是 set - 保留注释
        var blword=item.replace(new RegExp('_','g'),' ');
        var icon='';
        if (oldset.has(blword)){
            old_count=old_count+1;
            icon='💧';
        }
        bljg.push('<span class="span_word_combination_enword">'+blsmall+(blxl+1)+'. </small>'+icon+en_one_word_b([blword],[-1,0],'',true,true,true)+'</span>');
        blxl=blxl+1;
    }
    if (return_old_count){
        return [bljg,old_count];
    }
    return bljg;
}

function enwords_array_to_html_b(csarray,showstatus=true,isrecent=false,csword=''){
    if (document.getElementById('check_hide_no')){
	    var cshideno=document.getElementById('check_hide_no').checked;
    } else {
        var cshideno=false;
    }
    if (document.getElementById('check_hide_lineno')){
	    var cshidelineno=document.getElementById('check_hide_lineno').checked;
    } else {
        var cshidelineno=true;
    }

	var bljg='';
	var length_t=csarray.length;
    var jumpstr='';
    
    if (isrecent==false){
        var recent_bookmark='';
    } else {
        var recent_bookmark=enwords_recent_bookmark_get_b();
        //如果没有预设单词书签，则第一个最近记忆单词为书签 - 保留注释
        if (recent_bookmark=='' && length_t>0){
            recent_bookmark=csarray[0][0];
        }
    }
    var line_pref=new Date().getMilliseconds()+'_'+parseInt(Math.random()*9999);
    
	for (let blxl=0;blxl<length_t;blxl++){
        var blitem_t=csarray[blxl];
        if (blitem_t==null || blitem_t==[]){continue;}
        if (typeof blitem_t=='string'){
            blitem_t=[blitem_t,'',''];
        }
        if (blitem_t.length<3){continue;}
        
        if (length_t>200 && (blxl+1) % 25 == 0 || length_t<=200 && (blxl+1) % 10 == 0 || blxl==length_t-1){
            bljg=bljg+'<a name="line_'+line_pref+'_'+(blxl+1)+'"></a>';
            jumpstr=jumpstr+'<a href="#line_'+line_pref+'_'+(blxl+1)+'" class="a_oblong_box">'+(blxl+1)+'</a> ';
        }
        
        if (isrecent && blitem_t[0]==recent_bookmark){
            bljg=bljg+'<a name="a_recent_bookmark"></a>';
        }
        
        if (cshideno){
            bljg=bljg+'<p class="article">';
        } else {
            bljg=bljg+'<li>';
        }
        
        if (cshidelineno){
            bljg=bljg+en_one_word_b(blitem_t,[-1,0],recent_bookmark);
        } else if (blitem_t.length>3){
            bljg=bljg+en_one_word_b(blitem_t,[blitem_t[3],0],recent_bookmark);
        } else {
            bljg=bljg+en_one_word_b(blitem_t,[blxl,0],recent_bookmark);
        }
        bljg=bljg+namesake_enwords_b(blitem_t[0],csword);
        
        if (cshideno){
            bljg=bljg+'</p>';
        } else {
            bljg=bljg+'</li>';
        }
	}
    
	if (cshideno){
        bljg='<div>'+bljg+'</div>';
    } else {
        bljg='<ol>'+bljg+'</ol>';
    }

    if (showstatus){
        top_bottom_arrow_b('div_top_bottom',csarray.length+' ');
    }
    if (jumpstr!==''){
        jumpstr='<p>'+jumpstr+'</p>';
    }
	return jumpstr+bljg;
}

function enwords_lines_2_js_array_b(aword,emoji_list,three_lines=false){
    if (three_lines){
        str_t=aword[0]+'\n'+aword[1]+'\n';
    } else {
        var str_t='["';
        str_t=str_t+specialstr_j(aword[0],true)+'",';
        str_t=str_t+' "'+specialstr_j(aword[1],true)+'", "';
    }
    
    var definition=aword[2];
    for (let one_emoji of emoji_list){
        if (definition.slice(-1*one_emoji[1],)==one_emoji[0]){
            definition=definition.slice(0,-1*one_emoji[1]);
            break;
        }
    }
    
    if (three_lines){
        str_t=str_t+en_word_def_istrong_b(definition,true);
    } else {
        str_t=str_t+specialstr_j(en_word_def_istrong_b(definition,true),true);
        str_t=str_t+'"],';
    }
    return str_t;
}

function enwords_different_types_div_b(cswlist){
    var blbuttons='<p>';
    blbuttons=blbuttons+'<select onchange="enwords_different_types_textarea_b(this);">';
    for (let item of ['','asterisk','js','temp','wiki','reg','space']){
        blbuttons=blbuttons+'<option>'+item+'</option>\n';
    }
    blbuttons=blbuttons+'</select>\n';    
    blbuttons=blbuttons+'<label><input type="checkbox" class="input_enwords_different_types_one_textarea" checked>one textarea</label>';
    blbuttons=blbuttons+'<label><input type="checkbox" class="input_enwords_different_types_remove_emoji" checked>remove emoji</label>';
    blbuttons=blbuttons+'</p>';
    blbuttons=blbuttons+'<textarea class="textarea_enwords_raw_types">'+cswlist.join('\n')+'</textarea>';    
    blbuttons=blbuttons+'<div class="div_textarea_enwords_different_types"></div>';
    blbuttons=blbuttons+'<div class="div_word_sentence_rank"></div>';
    return '<div style="margin-top:0.5rem;">'+blbuttons+'</div>';
}

function enwords_different_types_textarea_b(oselect){
    var ocontainer=oselect.parentNode.parentNode;
    var raw_list=ocontainer.querySelector('textarea.textarea_enwords_raw_types').value.trim().split('\n');
    var odiv=ocontainer.querySelector('div.div_textarea_enwords_different_types');
    var one_textarea=ocontainer.querySelector('input.input_enwords_different_types_one_textarea').checked;    
    var remove_emoji=ocontainer.querySelector('input.input_enwords_different_types_remove_emoji').checked;
    var bljg='';
    switch (oselect.value){
        case 'asterisk':
            bljg=enwords_wiki_type_words_b(raw_list,one_textarea,true);
            break;
        case 'js':
            bljg=enwords_js_type_words_b(raw_list,one_textarea,remove_emoji);
            break;
        case 'temp':
            bljg=enwords_js_type_words_b(raw_list,one_textarea,remove_emoji,true);
            break;
        case 'wiki':
            bljg=enwords_wiki_type_words_b(raw_list,one_textarea,false);        
            break;
        case 'reg':
            bljg=raw_list.join('|').replace(/\s/g,'\\s');
            bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">\\b('+bljg+')\\b</textarea>';
            break;
        case 'space':
            bljg=raw_list.join(' ');
            bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+bljg+'</textarea>';        
            break;
    }
    odiv.innerHTML=bljg;
}

function enwords_js_type_words_b(cswlist,onetextarea=false,remove_emoji=false,three_lines=false){
    //cswlist 形如：["Doris", "biocompatibility", "deworm", "dewdrop", ] - 保留注释
    if (remove_emoji){
        var emoji_list=words_queue_emoji_b();
    } else {
        var emoji_list=[];
    }

    var list_t=[];
    var js_type='';    
    for (let item of enwords){
        if (cswlist.includes(item[0]) || cswlist.includes(item[0].replace(new RegExp(' ','g'),'_'))){
            js_type=enwords_lines_2_js_array_b(item,emoji_list,three_lines);
            if (onetextarea==false){
                js_type='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+js_type+'</textarea>';
            } else {
                if (three_lines){
                    js_type=js_type+'\n---\n';
                } else {
                    js_type=js_type+'\n';
                }
            }
            list_t.push([js_type,(2+cswlist.indexOf(item[0]))*-1]);
        }
    }
    return enwords_different_types_result_b(list_t,onetextarea);
}

function enwords_different_types_result_b(cslist,onetextarea){
    cslist.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    var bljg='';    
    for (let item of cslist){
        bljg=bljg+item[0];
    }
    if (onetextarea){
        var firstword='';
        if (cslist.length>1){
            firstword='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+cslist[0][0].trim()+'</textarea>';
        }
        var blxl=0;
        var textarea_id='';
        while (true){
            blxl=blxl+1;
            textarea_id='textarea_enwords_different_types_'+blxl+'_'+Math.round(Math.random()*9999);
            if (!document.getElementById(textarea_id)){break;}
        }
        var postpath=postpath_b();
	    var blform='<form method="POST" action="'+postpath+'temp_txt_share.php" target=_blank>\n';
        bljg=firstword+blform+'<br /><textarea name="'+textarea_id+'" id="'+textarea_id+'" style="height:20rem;">'+bljg.trim()+'</textarea>';
        bljg=bljg+'<p>'+textarea_buttons_b(textarea_id,'全选,清空,复制,发送到临时记事本,发送地址')+'</p>';
        bljg=bljg+'</form>'; 
    }
    return bljg;
}

function enwords_wiki_type_words_b(cswlist,onetextarea=false,asterisk=false){
    var list_t=[];
    var wiki_type='';
    for (let item of enwords){
        if (cswlist.includes(item[0]) || cswlist.includes(item[0].replace(new RegExp(' ','g'),'_'))){
            if (asterisk){
                wiki_type='*'+item[0];
            } else {
                wiki_type='&lt;eword w="'+item[0]+'"&gt;&lt;/eword&gt;';
            }
            if (onetextarea==false){
                wiki_type='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+wiki_type+'</textarea>';
            } else {
                wiki_type=wiki_type+'\n';
            }
            list_t.push([wiki_type,(2+cswlist.indexOf(item[0]))*-1]);
        }
    }
    return enwords_different_types_result_b(list_t,onetextarea);
}

function enwords_js_wiki_textarea_b(cslist,is_simple=false){
    //cslist 中每一行格式如 enwords 的每一行 - 保留注释
    //cslist 中每一行格式也可以是如 ['dog'] - 保留注释
    var ocheck=document.getElementById('check_js_wiki');
    if (ocheck){
        if (!ocheck.checked){return '';}
    }
    
    if (is_simple){
        var list_t=[].concat(cslist);    
    } else {
        var list_t=[];
        for (let item of cslist){
            list_t.push(item[0]);
        }
    }
    return enwords_different_types_div_b(list_t);
}

function enwords_search_show_html_b(odiv,batch_div_name,recent_search_str,csword,csarray,csequal,without_textarea=false){
    var csword_filter=(csword.match(/[a-zA-Z0-9 '_\-]+/) || [''])[0];
    odiv.innerHTML='';
    if (csarray.length==0){
        //以下条件不能和上面条件合并 - 保留注释
        if (csword_filter.trim()==''){
            csword_filter=csword;
        }
        var bljg=recent_search_str+enwords_batch_div_b([csword_filter],batch_div_name);
    } else {
        var bljg=recent_search_str+enwords_array_to_html_b(csarray,false,false,csword);
        var bltextarea=(without_textarea?'':enwords_js_wiki_textarea_b(csarray));
        if (csequal){
            bljg=bljg+enwords_batch_div_b(csarray,batch_div_name)+bltextarea;
        } else {
            if (csword_filter!==''){
                bljg=bljg+enwords_batch_div_b([csword_filter].concat(csarray),batch_div_name,true,-1)+bltextarea;
            } else {
                bljg=bljg+enwords_batch_div_b(csarray,batch_div_name)+bltextarea;
            }
        }
    }
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('p#p_recent_search span.oblong_box'));
}

function enword_search_type_b(cs_w_p_d){
	if (cs_w_p_d.length==0){
        if (document.getElementById('input_s_word')){
		    cs_w_p_d.push(document.getElementById('input_s_word').checked);
        } else {
            cs_w_p_d.push(true);
        }
	}
	if (cs_w_p_d.length<2){
        if (document.getElementById('input_s_p')){
		    cs_w_p_d.push(document.getElementById('input_s_p').checked);
        } else {
            cs_w_p_d.push(true);
        }
	}
	if (cs_w_p_d.length<3){
        if (document.getElementById('input_s_def')){
		    cs_w_p_d.push(document.getElementById('input_s_def').checked);
        } else {
            cs_w_p_d.push(true);
        }
	}
	
	if (cs_w_p_d[0]==false && cs_w_p_d[1]==false && cs_w_p_d[2]==false){
        cs_w_p_d[0]=true;
    }
	
    if (document.getElementById('input_s_word')){
	    document.getElementById('input_s_word').checked=cs_w_p_d[0];
    }
    if (document.getElementById('input_s_p')){
	    document.getElementById('input_s_p').checked=cs_w_p_d[1];
    }
    if (document.getElementById('input_s_def')){
	    document.getElementById('input_s_def').checked=cs_w_p_d[2];
    }
    return cs_w_p_d;
}

function enwords_search_one_b(csitem,cswordlist,csreg,csword_filter,csword_filter_set,cs_w_p_d,cscount,csmax=500){
    var bltmp1 = (cs_w_p_d[0]?csitem[0]:'');
    var bltmp2 = (cs_w_p_d[1]?csitem[1]:'');
    var bltmp3 = (cs_w_p_d[2]?csitem[2]:'');
            
    var blfound=str_reg_search_b([bltmp1,bltmp2,bltmp3],cswordlist,csreg);
    if (blfound==-1){
        return [-1,-1];
    }

    var blnumber=-1;
    if (blfound){
        var blnumber=en_similar_word_b(csword_filter,csword_filter_set,bltmp1);
        if (blnumber==5 && cscount<=csmax || blnumber!==5){
            //do nothing - 保留注释
        } else {
            blnumber=-1;
        }
        cscount=cscount+1;
    }
    return [cscount,blnumber];
}

function enwords_search_arr_init_b(){
    return [[],[],[],[],[],[]];
}

function enwords_search_old_b(cs_w_p_d,csword,csreg){
    var blcount=0;
    var words_temp_equal_arr=enwords_search_arr_init_b();
	
    var cswordlist=csword.split(' ');
    var csword_filter=(csword.match(/[a-zA-Z0-9 '_\-]+/) || [''])[0];
    var csword_filter_set=new Set(csword_filter.split(' '));
    var blnumber=-1;
    
    for (let blitem_t of enwords){
        [blcount,blnumber]=enwords_search_one_b(blitem_t,cswordlist,csreg,csword_filter,csword_filter_set,cs_w_p_d,blcount);
        if (blcount==-1){break;}
        if (blnumber!==-1){
            words_temp_equal_arr[blnumber].push(blitem_t);
        }
    }
    return words_temp_equal_arr;
}

function enwords_mini_search_b(csword=''){
    var osession = document.getElementById('session_mini_search');
    var odiv=document.getElementById('input_enwords_mini_search');
    if (csword==''){
        csword=odiv.value;
    }
	csword=csword.trim();   
    odiv.value=csword;
	if (csword==''){
        osession.innerHTML='';
        return;
    }

    en_word_temp_get_b();
    
    var csreg=checkbox_kl_value_b('input_enwords_mini_search_reg');
    var cs_w_p_d=enword_search_type_b([]);

    var csword_filter=(csword.match(/[a-zA-Z0-9 '_\-]+/) || [''])[0];

    var words_temp_equal_arr=enwords_search_old_b(cs_w_p_d,csword,csreg);
    
    var words_temp_arr=enwords_merge_b(words_temp_equal_arr,500);
    
    var blequal=false;
    for (let item of words_temp_arr){
        if (csword_filter==item[0]){
            blequal=true;
            break;
        }
    }

    var recent_search_str=enwords_recent_search_b(csword,'mini');
    enwords_search_show_html_b(osession,'_mini',recent_search_str,csword,words_temp_arr,blequal,true);
}

function enwords_merge_b(cswords_list,cstimes=500){
    var result_t=[];
    for (let item of cswords_list){
        result_t=result_t.concat(item);
    }
    if (result_t.length>cstimes){
        result_t=result_t.slice(0,cstimes);
    }
    return result_t;
}

function enwords_mini_search_frame_show_hide_b(csexpand=true){
    if (csexpand){
        enwords_init_b(true);
    }
    enwords_mini_search_frame_style_b('div_enwords_mini_search_frame',false);   //初始化 - 保留注释
    var odiv=document.getElementById('div_enwords_mini_search_frame');
    if (!odiv){return;}
    if (odiv.style.cssText==''){
        enwords_mini_search_frame_style_b('',true);
        if (csexpand){
            enwords_mini_search_frame_form_b('');
        } else {
            enwords_mini_search_frame_form_b('s');
        }
    } else {
        odiv.style.cssText='';
        odiv.innerHTML='';
    }
}

function enwords_mini_search_frame_style_b(csid='',set_css=true){
    if (csid==''){
        csid='div_enwords_mini_search_frame';
    }
    var odiv=document.getElementById(csid);
    if (!odiv){
        document.body.insertAdjacentHTML('beforeend','<div id="'+csid+'"></div>')
    }
    odiv=document.getElementById(csid);
    if (set_css){
        odiv.style.cssText='position:fixed;right:0%;top:0%;border:0.2rem pink dashed;background-color:white;max-width:70%;padding:0.5rem;'+(location.href.includes(location.origin+'/wiki/')?'z-index:998;':'');
    }
}

function enwords_mini_search_frame_form_b(cstype='s'){
    var odiv=document.getElementById('div_enwords_mini_search_frame');
    if (cstype=='s'){
        odiv.innerHTML='<span onclick="enwords_mini_search_frame_form_b(\'\');" style="padding:1rem 0.5rem;cursor:pointer;color:tomato;"><b>S</b></span>';
        odiv.style.opacity='0.5';
    } else {
        var bljg='';
        bljg=bljg+'<input id="input_enwords_mini_search" type="text" onkeyup="if (event.key==\'Enter\'){enwords_mini_search_b();}"> ';
        bljg=bljg+'<span class="aclick" onclick="enwords_mini_search_frame_form_b();">Close</span>';
        bljg=bljg+'<section style="overflow:auto;padding-top:0.1rem;max-height:'+parseInt(window.innerHeight*2/3)+'px;font-size:1rem;" id="session_mini_search">'+enwords_recent_search_b('','mini');+'</section>';
        odiv.innerHTML=bljg;
        mouseover_mouseout_oblong_span_b(document.querySelectorAll('p#p_recent_search span.oblong_box'));
        odiv.style.opacity='';
        input_with_x_b('input_enwords_mini_search',11,'',0.8,'input_enwords_mini_search_reg');
        checkbox_kl_color_b('input_enwords_mini_search_reg',1);
        document.getElementById('input_enwords_mini_search').focus();
    }
}

function enwords_recent_search_b(csword='',cstype=''){
    function sub_enwords_recent_search_b_fn(fn_name){
        return recent_search_b('recent_search_enwords',csword,fn_name,'',logo_list,25,false);
    }
    //-----------------------
    var logo_list=['🥚','✏','🚧','〘 〙','🚩'];
    if (cstype=='mini'){
        var recent_search_str='<p id="p_recent_search" style="line-height:'+(ismobile_b()?'200':'210')+'%;">';
        return recent_search_str+sub_enwords_recent_search_b_fn('enwords_mini_search_b')+'</p>';
    } else {
        var odiv=document.getElementById('div_recent_search');
        if (odiv){
            odiv.innerHTML=sub_enwords_recent_search_b_fn('wordsearch_enwords_b');    
            mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
        }
        return '';
    }
}

function p_enwords_sentence_style_b(do_write=true){
    var blstr='.div_sentence p.p_enwords_sentence:nth-child(even), #div_enword_search_links p.p_enwords_sentence:nth-child(even) {background-color:'+scheme_global['button']+';}';
    if (do_write){
        document.write(blstr+'\n');
    } else {
        return blstr;
    }
}

function en_sentence_to_default_order_b(){
    var t0 = performance.now();
    en_sentence_global.sort(function (a,b){return a[3]>b[3] ? 1 : -1;}); //按 编号 排序 - 保留注释
    en_sentence_global.sort(function (a,b){return a[2]>b[2] ? 1 : -1;}); //按 KLWiki title名 或 书名 排序 - 保留注释
    console.log('en_sentence_to_default_order_b() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function en_sentence_button_init_b(return_str=false){
    var blstr='<span class="span_sentence_button_init" style="padding-left:0.5rem;padding-right:0.5rem;font-weight:bold;cursor:pointer;" onclick="en_sentence_button_click_b(this);">⚪</span>';
    if (return_str){
        return blstr;
    }
    
    var ops=document.querySelectorAll('p.p_enwords_sentence');
    if (ops.length==0){return;}
    var obutton=ops[0].querySelector('span.span_sentence_button_init,span.span_sentence_button_clicked');
    if (obutton){return;}
    for (let one_p of ops){
        one_p.insertAdjacentHTML('beforeend',blstr);
    }
}

function en_sentence_button_click_b(ospan){
    var blnum=ospan.innerText;
    if (blnum!=='⚪'){
        ospan.innerText='⚪';
        ospan.setAttribute('class','span_sentence_button_init');
    } else {
        ospan.innerText='';
        ospan.setAttribute('class','span_sentence_button_clicked');    
    }
    var ospans=document.querySelectorAll('span.span_sentence_button_clicked');
    var bllen=ospans.length;
    if (bllen==0){return;}
    for (let blxl=0;blxl<bllen;blxl++){
        ospans[blxl].innerText=(blxl+1)+'/'+bllen;
    }
}

function sentence_list_2_html_b(cslist,csword_list=[''],csmax=500,show_button=true,csmobile_font=false,return_arr=false,keep_kleng=false){
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var mobile_pc_font_size='';
    if (ismobile_b()){
        if (csmobile_font===false){
            mobile_pc_font_size='1.1';
        } else {
            mobile_pc_font_size=csmobile_font;
        }
    }
    var button_str=(show_button?en_sentence_button_init_b(true):'');

    var blcount=0;
    var bljg=[];
    var p_style=en_sentence_p_style_b(mobile_pc_font_size);
    var islocal=is_local_b();
    var sele_path=klbase_sele_path_b()[1];
	for (let item of cslist){
        //符合宽泛的条件后，再判断是否含有 过滤后的单词，若没有返回空字符 - 保留注释
        if (islocal){
            var str_t=en_sentence_one_line_b(item,csword_list,remote_host+'/wikiuploads/',remote_host+(item[2].slice(-4,)=='_TLS'?'/klwebphp/PythonTools/data/selenium_news/html/txtlistsearch.htm?_tag':'/wiki/index.php/'),button_str,return_arr,keep_kleng);
        } else {
            var str_t=en_sentence_one_line_b(item,csword_list,'',(item[2].slice(-4,)=='_TLS'?sele_path+'/html/txtlistsearch.htm?_tag':''),button_str,return_arr,keep_kleng);        
        }
        
        if (return_arr){
            if (str_t.length>0){
                bljg.push(str_t);
                blcount=blcount+1;
            }
        } else if (str_t!=''){
            bljg.push(p_style+str_t+'</p>');
            blcount=blcount+1;
        }        
        if (blcount>=csmax){break;}
	}
    return bljg;
}

function sentence_split_b(csstr,csno=-1){   //sentence split - 保留注释
    function sub_sentence_split_b_check(csstr1,csstr2){
        return csstr1.length<10 || (csstr1.match(/\s/g) || []).length<5 || csstr2.length<10 || (csstr2.match(/\s/g) || []).length<5 || csstr2.trim().match(/^[a-z]/);   //如果csstr2 以小写字母开头 - 保留注释
    }
    //-----------------------
    if (Array.isArray(csstr)){
        return csstr;
    } else if (csstr.length<=300){
        if (csno>=0){
            en_sentence_global[csno][0]=[csstr];
        }
        return [csstr];
    }
    
    var old_str=csstr;
    csstr=csstr.replace(/(([^A-Z]((\. )+)?\.|\?|!|\"|\?) )/g,'$1\n');
    var has_mr=(csstr.includes('Mr.') || csstr.includes('Dr.') || csstr.includes('St.'));
    var list_t=csstr.split('\n');
    var result_t=[];

    if (has_mr){
        for (let blxl=list_t.length-1;blxl>0;blxl--){
            if (sub_sentence_split_b_check(list_t[blxl-1],list_t[blxl]) || list_t[blxl-1].trim().slice(-5,)==' etc.' || [' Dr.',' Mr.',' St.'].includes(list_t[blxl-1].trim().slice(-4,)) && list_t[blxl-1].slice(-1)!=='.'){
                list_t[blxl-1]=list_t[blxl-1]+list_t[blxl];
                list_t[blxl]='';    
            }
        }    
        //-----------------------
        for (let item of list_t){
            if (item==''){continue;}
            result_t.push(item);
        }
        list_t=[].concat(result_t);
        
        for (let blxl=0;blxl<list_t.length-1;blxl++){
            if (['Mr.','Dr.','St.'].includes(list_t[blxl].trim().slice(-3,))){
                list_t[blxl+1]=list_t[blxl]+list_t[blxl+1];
                list_t[blxl]='';    
            }
        }
        result_t=[];
    } else {
        for (let blxl=list_t.length-1;blxl>0;blxl--){
            if (sub_sentence_split_b_check(list_t[blxl-1],list_t[blxl]) || list_t[blxl-1].trim().slice(-5,)==' etc.'){
                list_t[blxl-1]=list_t[blxl-1]+list_t[blxl];
                list_t[blxl]='';    
            }
        }
    }

    for (let item of list_t){
        if (item==''){continue;}
        if (item.includes('; ') && item.length>300){
            var semicolon_list=item.replace(/( [a-zA-Z0-9_\-']+; )([a-zA-Z0-9_\-']+ )/g,'$1\n$2').split('\n');
            for (let blxl=semicolon_list.length-1;blxl>0;blxl--){
                if (sub_sentence_split_b_check(semicolon_list[blxl-1],semicolon_list[blxl])){
                    semicolon_list[blxl-1]=semicolon_list[blxl-1]+semicolon_list[blxl];
                    semicolon_list[blxl]='';    
                }
            }
            for (let a_semicolon of semicolon_list){
                if (a_semicolon==''){continue;}
                result_t.push(a_semicolon);
            }
        } else {
            result_t.push(item);
        }
    }
    if (csno>=0){
        en_sentence_global[csno][0]=result_t;
    }
    
    //console.log(old_str==result_t.join('')); //此行保留，用于检测是否正确分割了例句 - 保留注释
    return result_t;
}

function sentence_search_b(csword='',csreg=false,csmax=500,show_button=true,csmobile_font=false){
	if (csword==''){return;}

	var blcount=0;
	var blwordlist=csword.split(' ');
    
    //以下过滤单词 - 保留注释
    var blwordlist2=[];
    for (let item of blwordlist){
        if (item.substring(0,1)=='-'){continue;}
        if (item.substring(0,1)=='+'){
            blwordlist2.push(item.substring(1,));
        } else {
            blwordlist2.push(item);
        }
    }
    
    var result_t=[];
	for (let blxl=0;blxl<en_sentence_global.length;blxl++){
        var aline=en_sentence_global[blxl];
        var line_split=sentence_split_b(aline[0],blxl);
        var do_break=false;
        for (let arow of line_split){
            var blfound=str_reg_search_b(arow,blwordlist,csreg);
            if (blfound==-1){
                do_break=true;
                break;
            }

            if (blfound){
                result_t.push([arow].concat(aline.slice(1,)));
                blcount=blcount+1;
                if (blcount>=csmax){break;}
            }
        }
        if (do_break){break;}
	}
    
    var bljg=sentence_list_2_html_b(result_t,blwordlist2,csmax,show_button,csmobile_font);
	return '<div class="div_sentence">'+bljg.join('\n')+'</div><p><i>('+bljg.length+')</i></p>';
}

function simple_words_b(is_set=true,to_lower_case=false){
    if (is_set){
        var result_t=new Set();
        if (to_lower_case){
            for (let item of enwords){
                result_t.add(item[0].toLowerCase());
            }        
        } else {
            for (let item of enwords){
                result_t.add(item[0]);
            }
        }
    } else {
        var result_t=[];
        if (to_lower_case){
            for (let item of enwords){
                result_t.push(item[0].toLowerCase());
            }        
        } else {
            for (let item of enwords){
                result_t.push(item[0]);
            }
        }
    }
    return result_t;
}

function one_enword_b(item,recent_bookmark='',ismobile=false,csword=''){
    if (item.length==0){return '';}
    if (item[0].length<3){return '';} //单词 发音 注释 - 保留注释
    var blpronounce='';
    if (item[1]!==''){
        var blword0=item[0].replace(new RegExp("'",'g'),"\\'");
        blpronounce=blpronounce+'<span class="span_pronounce" onclick="en_word_temp_change_b(this,\''+blword0+'\',\'switch\');"';

        if (en_words_temp_global.includes(item[0])){
            blpronounce=blpronounce+' style="background-color:'+scheme_global['pink']+';"';
        }

        blpronounce=blpronounce+'>'+item[1]+'</span>';
    }

    var bltitle="<span style='font-size:2.2rem;font-weight:bold;cursor:pointer;' onclick=\"popup_words_links_b(event,'"+specialstr_j(item[0])+"');\">"+item[0]+"</span>";
    var bldef=(ismobile?'<br />':'')+blpronounce+' '+en_word_def_b(item[0],item[2],recent_bookmark);
    var list_t=['',bltitle,bldef];
    
    list_t[2]=list_t[2]+namesake_enwords_b(item[0],csword);
    list_t[2]=list_t[2]+' <hr /><div class="div_sentence" style="display:none;">'+item[0]+'</div>';  //在<hr />前需要空格，以避开链接 - 保留注释
    
    return div_title_href_b(list_t);
}

function namesake_enwords_b(word1,word2){
    if (word1==word2){
        return ' <span style="color:'+scheme_global['a-hover']+';">✔</span>';
    } else if (word1.toLowerCase()==word2.toLowerCase()){
        return ' <span style="color:'+scheme_global['a']+';">✔</span>';
    } else {
        return '';
    }    
}

function set_2_enwords_b(cssets){
    var list_t=[];
    for (let item of enwords){
        if (cssets.has(item[0])){
            list_t.push(item);
        }
    }
    return list_t;
}

function title_change_enwords_b(csstr=''){
    var bltitle=document.title;
    if (bltitle.includes('-')){
        bltitle=bltitle.split('-').slice(-1)[0].trim();
    }
    if (csstr==''){
        csstr=bltitle;
    } else {
        csstr=csstr+' - '+bltitle;
    }
    document.title=csstr;
    document.getElementById('span_title').innerHTML=csstr;
}

function words_count_enwords_b(){
    en_word_temp_get_b();
    var recent_bookmark=enwords_recent_bookmark_get_b();
    var ocount=document.getElementById('countwords');
    ocount.innerHTML='('+enwords.length+'/'+en_words_temp_global.length+'/'+recent_bookmark+')';
    if (ocount.getAttribute('title')==''){
        ocount.setAttribute('title','最初的最近记忆单词数：'+en_words_temp_global.length);
    }
}

function recent_words_list_enwords_b(cspageno=0,words_count_per_page=100,israndom=false,show_html=true,add_date_line=true){
    words_searched_arr_global=en_words_temp_list_b(add_date_line);
    var bllen=words_searched_arr_global.length;
    var pages_count=Math.ceil(words_searched_arr_global.length/words_count_per_page);
    //cspageno 从 1 开始，0表示当前书签单词所在页，-1表示全部 - 保留注释
    var recent_bookmark=enwords_recent_bookmark_get_b();
    if (cspageno==0){
        if (recent_bookmark=='' && words_searched_arr_global.length>0){
            recent_bookmark=words_searched_arr_global[0][0];
        }
        var blat=0;
        for (let blxl=0;blxl<words_searched_arr_global.length;blxl++){
            if (words_searched_arr_global[blxl][0]==recent_bookmark){
                blat=blxl;
                break;
            }
        }
        cspageno=Math.ceil((blat+1)/words_count_per_page);
        cspageno=(cspageno-1)*words_count_per_page+1;
    }

    if (israndom){
        if (cspageno>1){
            words_searched_arr_global=words_searched_arr_global.slice(cspageno-1,);
            for (let blxl=0;blxl<words_searched_arr_global.length;blxl++){
                if (words_searched_arr_global[blxl][0]==recent_bookmark){
                    words_searched_arr_global=words_searched_arr_global.slice(blxl,);                    
                    break;
                }
            }
        }

        words_searched_arr_global.sort(randomsort_b);
        words_searched_arr_global=words_searched_arr_global.slice(0,words_count_per_page);
    } else if (cspageno!==-1){
        words_searched_arr_global=words_searched_arr_global.slice(cspageno-1,cspageno-1+words_count_per_page);
    }

    if (!show_html){
        return words_searched_arr_global; 
    }
    
	var bljg=enwords_array_to_html_b(words_searched_arr_global,true,true);
    var blweek=date_2_ymd_b(false,'w');    
    
    var blday=date_2_ymd_b(false,'d');
    blday=(blday==1?11:blday);
    blday=(blday>11?blday%10:blday);
    blday=(blday<2?10+blday:blday);

    var page_html=page_combination_b(bllen,words_count_per_page,cspageno,'recent_words_list_enwords_b','page_location_enwords_b','',1,15,'','aclick',1,true,[(blweek==0?7:blweek),blday]);

	document.getElementById('divhtml').innerHTML=bljg+page_html;
    
    cspageno=Math.ceil((cspageno+1)/words_count_per_page);

    title_change_enwords_b('最近记忆的单词'+(cspageno==-1?'(全部)':'_第'+cspageno+'页'));
    document.location.href='#top';
    document.location.href='#a_recent_bookmark';
    words_count_enwords_b();
    en_sentence_show_check_b();    
}

function page_location_enwords_b(cspages,words_count_per_page){
    var blno=page_location_b(cspages);
    if (blno!==false){
        recent_words_list_enwords_b((blno-1)*words_count_per_page+1,words_count_per_page);
    }
}

function similar_enwords_b(csword,cshideno,cshidelineno,cshidesimilarno,csshow){
	var csnum=arguments.length;
	if (csnum==0){
        var csword= document.getElementById('input_search').value.trim();
    }
	document.getElementById('input_search').value=csword;
    if (csword.substring(0,1)=='+'){
        csword=csword.substring(1,);
    }
	if (csnum<=1){
        var ocheck_hide_no=document.getElementById('check_hide_no');
        if (ocheck_hide_no){
            var cshideno=ocheck_hide_no.checked;
        } else {
            var cshideno=false;
        }
    }
	if (csnum<=2){
        var ocheck_hide_lineno=document.getElementById('check_hide_lineno');
        if (ocheck_hide_lineno){
            var cshidelineno=ocheck_hide_lineno.checked;
        } else {
            var cshidelineno=true;
        }
    }
	if (csnum<=3){
        var ocheck_hide_similarno=document.getElementById('check_hide_similarno');
        if (ocheck_hide_similarno){
            var cshidesimilarno=ocheck_hide_similarno.checked;
        } else {
            var cshidesimilarno=true;
        }
    }
	if (csnum<=4){
        var csshow = true;
    }
	
	if (csword==''){
        document.getElementById('divhtml').innerHTML='';
        return '';
    }
	
	var bllist=[];
	var wordlength=csword.length;
    
    words_searched_arr_global=[];
    
	// door 分解为 d oo r 和 d o o r 最终合并为 d o r oo - 保留注释
    for (let blxl=0;blxl<enwords.length;blxl++){
		var word2=enwords[blxl][0];
		if (word2==csword){continue;}
		var wordlength2=word2.length;
		if (Math.abs(wordlength-wordlength2)>2){continue;}
		
        //差集含有大于2元素则排除 - 保留注释
        var diff1=string_difference_b(csword,word2).length;
        if (diff1>=2){continue;}
        var diff2=string_difference_b(word2,csword).length;
        if (diff2>=2){continue;}

        var blvalue=wordlength-diff2;

        bllist.push([blvalue,blxl]);
	}
	if (bllist.length==0){
        document.getElementById('divhtml').innerHTML='';
        return '';
    }
	bllist.sort(function(a,b){return b[0]>a[0] ? 1 : -1;});
    bllist=bllist.slice(0,100);
	var bljg='';
	for (let blxl=0;blxl<bllist.length;blxl++){
		var blno=bllist[blxl][1];

		if (cshideno){
            bljg=bljg+'<p class="article">';
        } else {
            bljg=bljg+'<li>';
        }
		
		var tmp_similarno=bllist[blxl][0];
		if (cshidesimilarno){
            tmp_similarno=0;
        }

		if (cshidelineno){
            bljg=bljg+en_one_word_b(enwords[blno],[-1, tmp_similarno]);
        } else {
            bljg=bljg+en_one_word_b(enwords[blno],[blno, tmp_similarno]);
        }
        
		if (cshideno){
            bljg=bljg+'</p>';
        } else {
            bljg=bljg+'</li>';
        }
        words_searched_arr_global.push(enwords[blno]);
	}

	if (cshideno){
        bljg='<div>'+bljg+'</div>';
    } else {
        bljg='<ol>'+bljg+'</ol>';
    }
	bljg=bljg+'<p>';
	
	if (csshow){
        document.getElementById('divhtml').innerHTML=bljg+enwords_batch_div_b(words_searched_arr_global,'')+enwords_js_wiki_textarea_b(words_searched_arr_global);
        en_sentence_show_check_b();
    }
	return bljg;
}

function wordsearch_enwords_b(csword='',csreg=-1,cs_w_p_d=[],csnew_words=false,showhtml=true,add_recent=true){
	if (csword==''){
        csword=document.getElementById('input_search').value.trim();
    }
    
	csword=csword.trim();
	if (csword==''){return;}

    if (showhtml && add_recent){
        enwords_recent_search_b(csword);
    }
    
    var oselect=document.getElementById('select_search_more_enwords');
    if (oselect){
        oselect.value='';
    }
    
    en_word_temp_get_b();
	if (csreg===-1){
        csreg=checkbox_kl_value_b('input_reg');
    }
    [csword,csreg]=str_reg_check_b(csword,csreg);

    document.getElementById('input_search').value=csword;    
    checkbox_kl_color_b('input_reg',csreg);

    cs_w_p_d=enword_search_type_b(cs_w_p_d);

    var csword_filter=(csword.match(/[a-zA-Z0-9 '_\-]+/) || [''])[0];   //不能放在if中 - 保留注释
    var words_temp_equal_arr=enwords_search_old_b(cs_w_p_d,csword,csreg);
    var words_temp_arr=enwords_merge_b(words_temp_equal_arr,max_result_enwords_b());
    
    var blequal=false;
    for (let item of words_temp_arr){
        if (csword_filter==item[0]){
            blequal=true;
            break;
        }
    }

    if (showhtml){
        var blhtml = document.getElementById('divhtml');
        enwords_search_show_html_b(blhtml,'','',csword,words_temp_arr,blequal);
        en_sentence_show_check_b();
    }
    
    words_searched_arr_global=[].concat(words_temp_arr);

    if (showhtml){
        title_change_enwords_b('');
        top_bottom_arrow_b('div_top_bottom',words_searched_arr_global.length+' ');
    }
}

function en_sentence_show_check_b(){
    if (klmenu_check_b('span_show_en_sentence_b',false)){
        console.log('显示例句');
        show_sentence_enwc_b(0,true,true);
    } else {
        console.log('不显示例句');            
    }
}

function max_result_enwords_b(csmax=500){
    var oinput=document.getElementById('input_max_result');
    if (oinput){
        csmax=parseInt(oinput.value);
    }   
    return csmax;
}

function input_date_set_enwords_b(){
    var today = new Date();
    var oday=document.getElementById('input_day');
    if (oday.value==''){
        oday.value=today.getDate();
    }
    
    var omonth=document.getElementById('input_month');
    if (omonth.value==''){
        omonth.value=today.getMonth()+1;
    }
}

function enwords_definition_2_multilines_b(){
    var ospans=document.querySelectorAll('span.span_explanation');
    for (let one_span of ospans){
        var blstr=one_span.innerHTML;
        if (blstr.substring(0,4)=='<ul>'){continue;}
        one_span.innerHTML='<ul><li>'+enwords_definition_split_b(blstr,true,false).join('</li><li>')+'</li></ul>';
    }
}

function enwords_definition_split_b(csdefinition,include_cn=false,remove_type=true){
    function sub_enwords_definition_split_b_push(csstr){
        if (csstr.includes('；') && ! item.includes('〘')){
            if (include_cn){
                result_t=result_t.concat(csstr.split('；'));
            } else {
                result_t.push(csstr.split('；').slice(-1));
            }
        } else {
            result_t.push(csstr);
        }    
        //无法处理〘 cross my heart (and hope to die): 我发誓所说属实（否则不得好死）；said to show that what you have just said or promised is completely true or sincere 〙 - 保留注释
    }
    //-----------------------
    if (remove_type){
        csdefinition=csdefinition.replace(new RegExp('<b>'+enword_type_b(true)+'\\. <\/b>','g'),'');    //不能加\\b - 保留注释
    } else {
        csdefinition=csdefinition.replace(new RegExp('<b>'+enword_type_b(true)+'\\. <\/b>','g'),'<b>$1\. </b>; 📋 ');    //不能加\\b - 保留注释    
    }
    
    var def_list=csdefinition.split('; 📋 ');
    var result_t=[];
    var blstr='';
    for (let blxl=0;blxl<def_list.length;blxl++){
        var item=def_list[blxl];
        if (item.includes('〘') && item.includes('〙')){
            sub_enwords_definition_split_b_push(blstr+item);
            blstr='';
            continue;
        }
        
        if (item.includes('〘')){
            if (blstr!==''){
                sub_enwords_definition_split_b_push(blstr);
            }
            blstr=item+'; ';
            continue;
        }
        
        if (item.includes('〙')){
            sub_enwords_definition_split_b_push(blstr+item);
            blstr='';
            continue;
        }

        if (blstr!==''){
            if (blxl<def_list.length-1){
                blstr=blstr+item+'; ';
            } else {
                sub_enwords_definition_split_b_push(blstr+item);
                blstr='';
            }
        } else {
            sub_enwords_definition_split_b_push(item);
        }
    }

    return result_t;
}
