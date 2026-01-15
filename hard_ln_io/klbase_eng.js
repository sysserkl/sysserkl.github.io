//-----------------------
//history
//0.0.1-20190125
//-----------------------
function en_style_b(add_table_compare_style=false){
    var style_list=[
    'a.similar {text-decoration:none;}',
    'a.similar:link, a.similar:visited, a.similar:hover, a.similar:active{color:'+scheme_global['memo']+';}',
    '.txtsearch_lineno {color:'+scheme_global['memo']+';font-size:0.8rem;}',
    '.div_sentence{margin:1rem 0rem 1rem 2rem;border:0.2rem dashed '+scheme_global['shadow']+';padding:0.5rem 1rem;}',
    p_enwords_sentence_style_b(false),
    ];
    
    if (add_table_compare_style){
        style_list.push('#table_compare_enbook tr{background-color: '+scheme_global['background']+';}');
        style_list.push('#table_compare_enbook tr:hover {background-color: '+scheme_global['skyblue']+';}');
    }
    style_generate_b(style_list,true,'style','head');
}

function en_font_menu_b(str_t){
    var klmenu_font=['<span class="span_menu" onclick="'+str_t+'en_font_set_b();">abcde</span>'];
    var en_font_list=letters52_style_list_b();
    for (let blxl=0,lent=en_font_list.length;blxl<lent;blxl++){
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
    var list_t=['adj', 'adv', 'art', 'det','vt', 'vi', 'phrase', 'pron', 'prep', 'pref', 'suf', 'conj', 'noun', 'idiom','num', 'abbr', 'int', 'contr', 'v', 'n'];
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

function words_queue_get_b(return_list=true){
    return local_storage_get_b('enwords_queue',-1,return_list);
}

function words_queue_remove_b(remove_add=true,remove_edit=true){
    while (true){
        var blfound=false;
        for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
            if (remove_add && enwords[blxl][2].endsWith('🥚') || remove_edit && enwords[blxl][2].endsWith('✏')){
                enwords.splice(blxl,1);
                blfound=true;
                removed_enwords=true;
                break;
            }
        }
        if (blfound===false){break;}
    }
    console.log('剔除旧临时单词后，单词库总数：',enwords.length);        
}

function words_queue_read_b(reinit=false){
    console.log('添加临时单词前，单词库总数：',enwords.length);
    var removed_enwords=false;
    if (reinit){
        words_queue_remove_b(true,false);   //不移除修改的单词 - 保留注释
    }
    
    var list_t=words_queue_get_b();
    var one_word=[];
    var word_name_list=[];
    for (let item of list_t){
        item=item.trim();
        if (item.includes('-') && item.replace(/-/g,'')==''){continue;}
        if (item==''){continue;}
        one_word.push(item);
        if (one_word.length==3){    //每3行处理一次 - 保留注释
            var blfound=false;
            for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
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
            word_name_list.push(one_word[0]);
            one_word=[];
        }
    }
    
    if (reinit){
        words_queue_reinit_b(word_name_list,removed_enwords);
    }
    console.log('添加临时单词后，单词库总数：',enwords.length,word_name_list);    
}

function words_queue_reinit_b(word_name_list,removed_enwords){
    if (word_name_list.length>0 || removed_enwords){
        var t0 = performance.now();
        for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
            enwords[blxl][3]=blxl;
        }
        
        for (let one_word of word_name_list){
            for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
                var blitem=enwords[blxl];
                if (blitem[0]!==one_word){continue;}

                if (blitem[1]==''){
                    enwords[blxl][1]='[null]';
                }
                enwords[blxl][2]=en_word_def_istrong_b(blitem[2]);
                enwords[blxl][4]=enwords_asc_value_b(blitem);
                break;
            }
        }
        console.log('words_queue_reinit_b()  费时：'+(performance.now() - t0) + ' milliseconds');        
    }
}

function load_sentence_menu_b(jsstr,others_list=[]){    
    var group_list=[
    ['载入例句','load_enword_file_b(\'en_sentence_global\',\'enwords_sentence\');',true],
    ['bigfile','load_enword_file_b(\'en_sentence_global\',\'enwords_sentence\',false,true,true);',true],
    ];    
    group_list=group_list.concat(others_list);
    return menu_container_b(jsstr,group_list,'');
}

function load_enword_file_b(varname,filename,csfn=false,do_echo=true,direct_from_bigfile=false){
    var file_list=klbase_addons_import_js_b([],[],['words/'+filename+'_data.js'],[],false,false);
    load_js_var_file_b(varname,file_list,filename+'_data.js',csfn,do_echo,direct_from_bigfile);
}

function import_enwords_data_b(){
    if (local_storage_get_b('first_source_bigfile')!=='1'){
        klbase_addons_import_js_b([],[],['words/enwords_data.js']);
    }
}

function enwords_init_b(simple=false,load_enwords=true,run_fn=false){
    function sub_enwords_init_b_load(is_ok=true){
        if (is_ok){
            enwords_init_b(simple,false,run_fn);
        }
    }
    //-----------------------
    if (typeof enwords == 'undefined' && load_enwords){
        load_enword_file_b('enwords','enwords',sub_enwords_init_b_load);
        return;
    }
    //-----------------------
    if (enwords.length==0){
        console.log('enwords 长度为0');
        return;
    }
    
    if (enwords[0].length>3){   //已初始化 - 保留注释
        console.log('已初始化');
        return;
    }
    
    var t0 = performance.now();    
    words_queue_read_b();   //导入临时添加的单词 - 保留注释
    
    if (simple){    //写入序号 - 保留注释
        for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
            if (enwords[blxl][1]==''){
                enwords[blxl][1]='[null]';
            }
            enwords[blxl][2]=en_word_def_istrong_b(enwords[blxl][2]);
            enwords[blxl][3]=blxl;
        }
    } else {    //添加元素，写入 序号 和 asc 值数组(0,1,2 以及 0 的第一个字符) - 保留注释
        for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
            var blitem=enwords[blxl];
            if (blitem[1]==''){
                enwords[blxl][1]='[null]';
            }
            enwords[blxl][2]=en_word_def_istrong_b(blitem[2]);
            enwords[blxl][3]=blxl;
            enwords[blxl][4]=enwords_asc_value_b(blitem);
        }
    }
    
    if (typeof run_fn == 'function'){
        run_fn();
    }
    performance_b('enwords_init_b()',t0);
}

function enwords_asc_value_b(csitem){
    return [asc_sum_b(csitem[0]),asc_sum_b(csitem[1]),asc_sum_b(csitem[2]), asc_sum_b(csitem[0].substring(0,1))];
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
    for (let blxl=0,lent=ocheckboxs.length;blxl<lent;blxl++){
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

function en_word_links_b(csword='',ew=false,www=false){
    var list_t=en_search_sites_b(-1,ew,www);
    var bljg='';
    
    for (let item of list_t){
        bljg=bljg+'<span class="span_link" title="'+item[1]+'" onclick="open_link_en_b(\''+item[0]+'\',\''+specialstr_j(csword)+'\'); en_word_temp_change_b(this,\''+item[0]+'\');"';
        bljg=bljg+'>'+item[0]+'</span> ';
    }
    return bljg.trim();
}

function en_search_sites_b(maxlength=-1,ew=false,www=false){
    var list_t=[
    ['b','Bing'],
    ['y','youdao'],
    ['d','海词'],
    ['m','Merriam-webster'],
    ['c','Collins'],    
    ['o','Oxford'],
    ['+','Cambridge'],
    //['r','wordReference'],
    ['k','KL Search'],
    ['kai','Kai'],
    ];
    
    if (www){
        list_t=[['li','link']].concat(list_t);
    }
    
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
    cstype=cstype.toLowerCase();
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
        case 'li':
            websites_in_en_popup_box_b();
            break;
        case 'kai':
            blhref='https://kaikki.org/dictionary/English/words/index.html?s='+csword;
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
            blhref='https://www.oxfordlearnersdictionaries.com/definition/english/'+web_href_key_b(csword.toLowerCase(),'-',true);
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
        case 'l':
            blhref='https://www.ldoceonline.com/dictionary/'+web_href_key_b(csword,'-',true);        
            break;
    }
    if (blhref!=='' && do_open){
        window.open(blhref);
    }
    return blhref;
}

function sup_kleng_hide_b(new_status='auto'){
    var o_sups=document.querySelectorAll('sup.kleng');
    if (o_sups.length==0){return;}
    
    if (new_status=='auto'){
        var bldisplay=(o_sups[0].style.display=='none'?'':'none');
    } else {
        if (o_sups[0].style.display==new_status){
            console.log('sup_kleng_hide_b','状态一致，忽略刷新');
            return;
        } else {
            var bldisplay=new_status;
        }
    }
    
    for (let item of o_sups){
        item.style.display=bldisplay;
    }
}

function sup_kleng_show_hide_b(ospan){
    var oword=ospan.parentNode.querySelector('span.span_sup_word_full');
    popup_show_hide_b(oword,'');
}

function sup_kleng_words_b(csdisplay='none',ocontainer=false,cstimes=0){   
    if (ocontainer===false){
        var o_sups=document.querySelectorAll('sup.kleng');
    } else {
        var o_sups=ocontainer.querySelectorAll('sup.kleng');    
    }
    
	if (o_sups.length==0){return;}

    if (typeof enwords == 'undefined'){
        if (cstimes>3){
            console.log('未发现 enwords');
        } else {
            setTimeout(function (){sup_kleng_words_b(csdisplay,ocontainer,cstimes+1);},1000);
        }
        return;
    }
        
    var t0 = performance.now(); 
    
	for (let one_sup of o_sups){
        if (one_sup.querySelector('span.span_sup_word_icon')){
            console.log('已存在 span.span_sup_word_icon');
            return;
        }
        
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
        
        var blhead='<span class="span_sup_word_icon span_box" onclick="sup_kleng_show_hide_b(this);" style="margin-left:0.05rem;">🇬🇧</span><span class="span_sup_word_full" style="display:'+csdisplay+';margin-left:0.05rem;">';
        for (let item of enwords){
            if (item[0]!==word_t){continue;}
            one_sup.innerHTML=blhead+'(<span class="span_box span_kleng" onclick="popup_words_links_b(event,\''+specialstr_j(word_t)+'\');" title="'+specialstr_j(word_t)+'"><font color="'+supcolor+'">'+item[1]+'</font></span> '+en_word_def_istrong_b(item[2])+')</span>';
            break;
        }
	}
    console.log('sup_kleng_words_b() 等待次数：',cstimes,'费时：'+(performance.now() - t0) + ' milliseconds');
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

function en_sentence_p_style_b(fontsize=''){
    if (fontsize==''){
        fontsize='0.95';
    }
    return '<p class="p_enwords_sentence" style="line-height:130%;font-size:'+fontsize+'rem;margin-top:0.3rem;padding:0.2rem 0.5rem;">';
}

function en_sentence_quote_compared_get_b(csstr){
    return csstr.replace(/([a-z0-9])['‘’]([a-z0-9])/ig,'$1_$2');   //把夹在两个字母/数字之间的引号换成下划线
}

function en_sentence_one_line_b(aline,wordname='',attachment_path='',wikisite='',button_str='',return_arr=false,keep_kleng=false,remove_quote='rq'){  //attachment_path 用于替换 {{wikiuploads}} - 保留注释
    function sub_en_sentence_one_line_b_return(){
        if (return_arr){
            return [];
        } else {
            return '';
        }    
    }
    
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
        item=item.join('');
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
        return sub_en_sentence_one_line_b_return();
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
    
    //处理 “不完整引号” 的情况
    //如果字符串只有开头引号，就去掉开头引号
    //如果字符串只有结尾引号，就去掉结尾引号
    //item 可能形如：Now then, it<span style="background-color: #D9F2F2;">'</span>s this sodium that I extract from salt water and with which I compose my electric cells."
    if (['rq','rs'].includes(remove_quote) && item.match(/^['"”“‘’]|['"”“‘’]$/)){
        let compared=en_sentence_quote_compared_get_b(item);
        if (compared.match(/^'[^']+$/) || compared.match(/^"[^"]+$/) || compared.match(/^‘[^‘’]+$/) || compared.match(/^“[^“”]+$/)){
            if (remove_quote=='rs'){
                return sub_en_sentence_one_line_b_return();
            } else {
                item=item.slice(1,);
            }
        }
        
        if (compared.match(/^[^']+'$/) || compared.match(/^[^"]+"$/) || compared.match(/^[^‘’]+’$/) || compared.match(/^[^“”]+”$/)){
            if (remove_quote=='rs'){
                return sub_en_sentence_one_line_b_return();
            } else {
                item=item.slice(0,-1);
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
    if (typeof en_sentence_global == 'undefined'){return ['',0,0];}
    
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
    
    var re_combine=sentence_split_status_generate_b();
    var split_no_set=new Set();
    if (Array.isArray(wordname)){
        var sentence_list={};
        for (let aword of wordname){
            sentence_list['w_'+aword]=['',0,0];
        }
        
        for (let aword of wordname){
            for (let blno=no_start,lent=en_sentence_global.length;blno<lent;blno++){
                var aline=en_sentence_global[blno];            
                if (csmax>0 && sentence_list['w_'+aword][1]>=csmax){continue;}
            
                var search_site=(aline[2].slice(-4,)=='_TLS'?txtlistsearch_site:wikisite);
                var line_split=sentence_split_b(aline[0],blno,re_combine);
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
        console.log(re_combine);
        sub_en_sentence_result_b_statistics();
        return sentence_list;
    } else {
        var bljg='';
        var blxl=0; //例句条数 - 保留注释
        var no_next=0;
        for (let blno=no_start,lent=en_sentence_global.length;blno<lent;blno++){
            var aline=en_sentence_global[blno];
            var search_site=(aline[2].slice(-4,)=='_TLS'?txtlistsearch_site:wikisite);
            var do_break=false;
            var line_split=sentence_split_b(aline[0],blno,re_combine);
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
        console.log(re_combine);
        sub_en_sentence_result_b_statistics();
        return [bljg,blxl,no_next];
    }
}

function en_sentence_menu_generate_b(){
    var group_list=[
    ['⚪ 显示例句','klmenu_check_b(this.id,true);',true,'span_show_en_sentence_b'],
    ['⚪ 显示例句详细出处','klmenu_check_b(this.id,true);',true,'span_source_en_b'],
    ['⚪ 释义分段','local_storage_span_set_b(\'en_words\',\'b\',\'split_en_definitions\');',true,'span_split_en_definitions_b'],
    ];
    return group_list;
}

function en_sentence_mobile_b(){
    if (klmenu_check_b('span_source_en_b',false)){return;}
   
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
        if (csword==recent_bookmark){return;} //如果单词是书签，则不可剔除 - 保留注释
        
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
        for (let blxl=0,lent=en_words_temp_global.length;blxl<lent;blxl++){
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
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
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

function websites_in_en_popup_box_b(){
    var odiv=document.getElementById('div_enword_search_links');
    if (!odiv){
        console.log('未发现 id: div_enword_search_links');
        return;
    }
    if (odiv.querySelector('div.div_websites_in_en_popup_box')){return;}
    
    odiv.insertAdjacentHTML('beforeend','<div class="div_websites_in_en_popup_box">'+translator_sites_b().join(' ')+'</div>');
}

function translator_sites_b(){
    var list_t=[
    ['https://cn.bing.com/translator/','Bing'],
    ['https://www.deepl.com/en/translator','DeepL'],
    ['https://www.reverso.net/text-translation','Reverso'],
    ['https://translate.yandex.com/','Yandex'],
    ['https://fanyi.baidu.com/mtpe-individual/multimodal','百度'],
    ['https://fanyi.youdao.com/#/TextTranslate','有道'],
    ['https://www.qianwen.com/','千问'],    
    ['https://yuanbao.tencent.com/chat/','元宝'],
    ];
    
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]='<a href="'+list_t[blxl][0]+'" target=_blank>'+list_t[blxl][1]+'</a>';
    }

    return list_t;
}

function sentence_popup_b(csword,ospan=false,no_start=0){
    var odiv=document.getElementById('div_enword_search_links');
    //即包含指定单词各个网站链接的气泡框 - 保留注释
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
    //包含在 odiv 中的 例句框 - 保留注释
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
    en_word_temp_get_b();
    
    var oparent=ospan.parentNode;
    if (!oparent){return;}
    var oword=oparent.querySelector('span.span_popup_word');
    if (!oword){
        console.log('未发现','span.span_popup_word');
        return;
    }
    
    var odiv=document.getElementById('div_enword_search_links');
    if (!odiv){
        console.log('未发现 id','div_enword_search_links');
        return;
    }
    
    var blword=oword.innerText;
    var bldef='';
    for (let item of enwords){
        if (item[0]==blword || item[0].toLowerCase()==blword.toLowerCase()){
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

function popup_words_links_b(event,csword,ew=false,def_button=false,ospan=false,mobile_font_size='1.8rem'){
    var bljg='<span class="span_popup_word" style="cursor:pointer;font-weight:bold;'+(en_words_temp_important_global.includes(csword)?'color:'+scheme_global['a-hover']+';':'')+'" onclick="en_word_temp_important_change_b(this);">'+csword+'</span> ';
    if (def_button){
        bljg=bljg+'<span class="span_link" onclick="popup_def_b(this);">def</span> ';
    }
    bljg=bljg+'<br />'+en_word_links_b(csword,ew,true);
    bljg=bljg+' <span class="span_link" onclick="sentence_format_b(\''+specialstr_j(csword)+'\');" title="复制 wiki 格式到剪贴板">f</span>';
    if (typeof en_sentence_global !== 'undefined'){
        bljg=bljg+' <span class="span_link" onclick="sentence_popup_b(\''+specialstr_j(csword)+'\',this);">例句</span>';
    }
    var ismobile=ismobile_b();
    var odiv=document.getElementById('div_enwords_mini_search_frame');
    
    var max_width=max_width=(ismobile?70:50)+'%';
    
    var z_index=(odiv?(parseInt(odiv.style.zIndex)+1 || -1):-1);
    popup_event_div_b(event,'div_enword_search_links',bljg,'bottom',mobile_font_size,0.8,max_width,'',(ismobile?'0.3rem':'0.2rem'),'inset',z_index);
    
    if (ospan){
        en_word_temp_change_b(ospan,csword);
    }
}

function en_one_word_b(csword,csno=[-1,0],csrecent_word='',ew=false,def_button=false){
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
	
    var blword0=csword[0].replace(new RegExp("'",'g'),"\\'");
    if (csword[0].substring(0,4)=='=== ' && csword[0].slice(-4,)==' ==='){
        return '<span style="padding-left:0.5rem;padding-right:0.5rem;font-weight:bold;background-color:'+scheme_global['skyblue']+';">'+csword[0]+'</span>';
    } 

    var do_change=(csword[1]=='' && csword[2]=='' ? ',this':'');
    var bljg='<span class="a_word" onclick="popup_words_links_b(event,\''+blword0+'\','+ew+','+def_button+do_change+');"><b>'+csword[0]+'</b></span> ';    
    
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
        if (item.style.backgroundColor!==''){continue;}
        blxl=blxl+1
    }
    if (blxl==0){return;}
    if (confirm('是否添加当前页面的 '+blxl+' 个单词到 最近记忆单词？')){
        for (let item of ospan){
            if (item.style.backgroundColor!==''){continue;}
            item.click();
        }
    }
}

function en_words_temp_textarea_b(divname,csrecount=false){
    en_word_temp_get_b();

    var left_str='<p>';
    left_str=left_str+close_button_b(divname,'')+' ';

    left_str=left_str+'<span class="aclick" onclick="en_words_temp_update_b(\''+divname+'\','+csrecount.toString()+');">Update</span> ';
    left_str=left_str+'<span class="aclick" onclick="recent_words_remove_old_date_b(400);">清除400天以前的日期标记</span> ';
    left_str=left_str+'<span class="aclick" onclick="en_words_temp_diff_b();">diff</span> ';
    
    var right_str=textarea_buttons_b('textarea_word_temp','发送到临时记事本,加密发送,发送地址','enwords_temp');
    right_str=right_str+' row: '+en_words_temp_global.length;
    right_str=right_str+'</p>';    

    var blstr=textarea_with_form_generate_b('textarea_word_temp','height:'+(ismobile_b()?'10':'20')+'rem;',left_str,'全选,清空,复制,加密,解密,save as txt file,导入temp_txt_share,导入 txt 文件',right_str,'enwords_temp','form_word_temp');
    blstr=blstr+'<div id="div_words_temp_diff"></div>';
    document.getElementById('divhtml').innerHTML=blstr;
    document.getElementById('textarea_word_temp').value=en_word_temp_get_b('raw');
}

function en_words_temp_diff_b(){
    var result_t1=en_word_temp_get_b('raw').split('\n');
    var result_t2=document.getElementById('textarea_word_temp').value.split('\n');

    var diff_str=two_list_diff_b(result_t1,result_t2,false,false,'','','旧版','新版')[1];

    var buttons='<p>'+close_button_b('div_words_temp_diff','')+'</p>';
    var odiv=document.getElementById('div_words_temp_diff');
    odiv.innerHTML=diff_str+buttons;
    key_location_diff_b([[2,'textarea_word_temp']]); 
}

function recent_words_remove_old_date_b(csnum){
    var otextarea=document.getElementById('textarea_word_temp');
    var list_t=otextarea.value.split('\n');
    list_t.reverse();
    var result_t=[];
    var blxl=0;
    for (let item of list_t){
        if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
            if (blxl>csnum){continue;}
            blxl=blxl+1;
        }
        result_t.push(item);
    }
    result_t.reverse();
    if (result_t.length==list_t.length){
        alert('无可删除的日期行');
        return;
    }
    
    if (!confirm('原有行数 '+list_t.length+' 行，剔除后剩余行数 '+result_t.length+' 行，是否替换编辑框内容？')){return;}
    otextarea.value=result_t.join('\n');    
}

function en_words_temp_update_b(divname,recount=false){
    var otextarea=document.getElementById('textarea_word_temp');
    if (otextarea){
        var list_t=otextarea.value.trim().split('\n');
        list_t=array_unique_b(list_t);
        if (confirm('是否更新('+list_t.length+')？')){
            enwords_temp_2_local_storage_b(list_t);
            en_words_temp_textarea_b(divname);
        }
    }
    if (recount){
        words_count_enwords_b();
    }
}

function en_word_temp_get_b(cstype=''){
    var t0 = performance.now();    
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
            performance_b('en_word_temp_get_b()',t0);
            return result_t;
            break;
    }
    //-----------------------
    en_words_temp_important_global=[];  //全局变量 - 保留注释
    en_words_temp_global=local_storage_get_b('enwords_temp',-1,true);
    for (let blxl=0,lent=en_words_temp_global.length;blxl<lent;blxl++){
        if (en_words_temp_global[blxl].substring(0,1)=='*'){
            en_words_temp_global[blxl]=en_words_temp_global[blxl].substring(1,);
            en_words_temp_important_global.push(en_words_temp_global[blxl]);
        }
    }
    performance_b('en_word_temp_get_b()',t0);
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
        for (let blxl=1,lent=(csarray.length-1)/2;blxl<lent;blxl++){  //忽略第1个和最后一个元素，且只检查一半最旧的记录 - 保留注释
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

function enwords_array_to_links_b(csarray,oldset=new Set(),cursor_style=false,return_old_count=false){
    var bljg=[];
    var blxl=0;
    if (cursor_style){
        blsmall='<small class="small_enword_no_b" style="cursor:pointer;">';
    } else {
        blsmall='<small class="small_enword_no_b">';
    }
    //} else {
        //blsmall='<small class="small_enword_no_b" style="cursor:pointer;" onclick="'+fn_name+'(this);">';
    //}
    var old_count=0;
    for (let item of csarray){  //csarray 有可能是 set - 保留注释
        var blword=item.replace(new RegExp('_','g'),' ');
        var icon='';
        if (oldset.has(blword)){
            old_count=old_count+1;
            icon='💧';
        }
        bljg.push('<span class="span_word_combination_enword">'+blsmall+(blxl+1)+'. </small>'+icon+en_one_word_b([blword],[-1,0],'',true,true)+'</span>');
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

function enwords_different_types_div_b(cswlist,add_form=false,textarea_id='',textarea_name='',button_type='',more_buttons=''){
    var blstr='<p>';
    blstr=blstr+'<select onchange="enwords_different_types_textarea_b(this);">';
    var type_names=['','(o)asterisk','cut','(o)js','count','(o)temp','(o)wiki','reg','space','rare_words','filter','group','random_sort','switch with the first textarea','移除行无非字母字符'];
    type_names.sort();
    for (let item of type_names){
        blstr=blstr+'<option>'+item+'</option>\n';
    }
    blstr=blstr+'</select>\n';    
    blstr=blstr+'<label><input type="checkbox" class="input_enwords_different_types_one_textarea" checked>one textarea</label>';
    blstr=blstr+'<label><input type="checkbox" class="input_enwords_different_types_remove_emoji" checked>remove emoji</label> ';
    blstr=blstr+'<span class="span_box" onclick="enwords_search_result_save_b(this);">save</span> ';
    blstr=blstr+'<span class="span_box" onclick="enwords_search_result_load_b(this);">load</span>';
    blstr=blstr+'</p>';
    
    if (add_form){
        var postpath=postpath_b();
        blstr=blstr+'<form method="POST" action="'+postpath+'temp_txt_share.php" target=_blank>\n';    
    }
    
    blstr=blstr+'<textarea class="textarea_enwords_raw_types"'+(textarea_id==''?'':' id="'+textarea_id+'"')+(textarea_name==''?'':' name="'+textarea_name+'"')+'>'+cswlist.join('\n')+'</textarea>';
    
    var buttons=more_buttons;
    if (textarea_id!=='' && button_type!==''){
        buttons=buttons+textarea_buttons_b(textarea_id,button_type);
    }
    if (buttons!==''){
        buttons='<p>'+buttons+'</p>';
    }
    blstr=blstr+buttons;
    
    if (add_form){
        blstr=blstr+'</form>\n';
    }
    
    blstr=blstr+'<div class="div_textarea_enwords_different_types"></div>';
    blstr=blstr+'<div class="div_word_sentence_rank"></div>';
    return '<div style="margin-top:0.5rem;">'+blstr+'</div>';
}

function enwords_search_result_save_b(ospan){
    var otextarea=ospan.parentNode.parentNode.querySelector('textarea.textarea_enwords_raw_types');
    var list_t=otextarea.value.split('\n');
    var bllen=list_t.length;
    if (bllen>500){
        list_t=list_t.slice(0,500);
    }
    
    var old_len=enwords_search_result_load_b().length;
    if (!confirm('是否保存'+(bllen>500?'最多 ':' ')+list_t.length+' 个单词到缓存，替换原有的 '+old_len+' 个单词？')){return;}
    localStorage.setItem('enwords_search_result',list_t.join('\n'));
    alert('done');
}

function enwords_search_result_load_b(ospan=false,cstype='',dom_id='',delimiter='b'){
    var list_t=local_storage_get_b('enwords_search_result',-1,true);

    if (ospan===false){
        switch (cstype){
            case 'reg':
                return enwords_list_2_reg_b(list_t);
                break;
            case 'input':
                if (dom_id!==''){
                    var odom=document.getElementById(dom_id);
                    if (odom){
                        odom.value=enwords_list_2_reg_b(list_t,delimiter);
                    }
                }
                break;
            case 'textarea':
                if (dom_id!==''){
                    var odom=document.getElementById(dom_id);
                    if (odom){
                        odom.value=list_t.join('\n');
                    }
                }
                break;
            default:
                return list_t;
        }
    } else {
        var otextarea=ospan.parentNode.parentNode.querySelector('textarea.textarea_enwords_raw_types');
        if (!confirm('是否从缓存中读取 '+list_t.length+' 个单词？')){return;}
        otextarea.value=list_t.join('\n');
    }
}

function enwords_list_2_reg_b(cslist,delimiter='b'){
    var bljg=cslist.join('|').replace(/\s/g,'\\s');
    switch (delimiter){
        case 'b':
            bljg='\\b('+bljg+')\\b';
            break;
        case '^$':
            bljg='^('+bljg+')$';
            break;
    }
    return bljg;
}

function enwords_different_types_textarea_b(oselect){
    var ocontainer=oselect.parentNode.parentNode;
    var oraw_textarea=ocontainer.querySelector('textarea.textarea_enwords_raw_types');
    var raw_str=oraw_textarea.value.trim();
    var raw_list=raw_str.split('\n');
    
    var odiv=ocontainer.querySelector('div.div_textarea_enwords_different_types');
    var one_textarea=ocontainer.querySelector('input.input_enwords_different_types_one_textarea').checked;    
    var remove_emoji=ocontainer.querySelector('input.input_enwords_different_types_remove_emoji').checked;
    
    let bljg='';
    let result_t,blkey;
    switch (oselect.value){
        case '(o)asterisk':
            bljg=enwords_wiki_type_words_b(raw_list,one_textarea,true);
            break;
        case 'count':
            alert(raw_list.length);
            break;
        case 'cut':
            blkey=prompt('输入 slice 范围（0～'+(raw_list.length-1)+'），格式如 10,20，可输入负数：');
            if (blkey==null){
                bljg='';
            } else {
                blkey=blkey.split(',');
                if (blkey.length<2){
                    blkey.push('');
                }
                
                blkey[0]=parseInt(blkey[0]);
                if (blkey[1]==''){
                    blkey[1]=raw_list.length;
                } else {
                    blkey[1]=parseInt(blkey[1]);
                }
                if (isNaN(blkey[0]) || isNaN(blkey[1])){
                    bljg='';
                } else {
                    let result_t=raw_list.slice(blkey[0],blkey[1]);
                    bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+result_t.join('\n')+'</textarea>';
                }
            }
            break;
        case '(o)js':
            bljg=enwords_js_type_words_b(raw_list,one_textarea,remove_emoji);
            break;
        case '(o)temp':
            bljg=enwords_js_type_words_b(raw_list,one_textarea,remove_emoji,true);
            break;
        case '(o)wiki':
            bljg=enwords_wiki_type_words_b(raw_list,one_textarea,false);        
            break;
        case 'reg':
            bljg=enwords_list_2_reg_b(raw_list);
            bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+bljg+'</textarea>';
            break;
        case 'space':
            bljg=raw_list.join(' ');
            bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+bljg+'</textarea>';        
            break;
        case '移除行无非字母字符':
            bljg=raw_str.replace(/[^a-z]+$/img,'');
            bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+bljg+'</textarea>';
            break;
        case 'rare_words':
            result_t=[];
            for (let aword of raw_list){
                result_t.push('"'+specialstr_j(aword)+'"');
            }
            bljg='    var rare_words=new Set(['+result_t.join(',')+']); //'+today_str_b('dt')+' //fn_in_one_line_content';
            bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+bljg+'</textarea>';        
            break;
        case 'random_sort':
            result_t=[].concat(raw_list);
            result_t.sort(randomsort_b);
            bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+result_t.join('\n')+'</textarea>';
            break;
        case 'switch with the first textarea':
            osecond_textarea=odiv.querySelector('textarea');
            if (osecond_textarea){
                oraw_textarea.value=osecond_textarea.value;
                osecond_textarea.value=raw_str;
                bljg=false;
            }
            break;
        case 'filter':
            blkey=prompt('输入筛选关键词，如(,,\\d+$(:r))');
            if (blkey==null){
                bljg='';
            } else {
                let is_reg=false;
                [blkey,is_reg]=str_reg_check_b(blkey);
                result_t=[];
                for (let item of raw_list){
                    let blfound=str_reg_search_b(item,blkey,is_reg);
                    if (blfound==-1){break;}        
                    if (blfound){
                        result_t.push(item);
                    }
                }
                bljg='<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+result_t.join('\n')+'</textarea>';        
            }
            break;
        case 'group':
            let blcount=parseInt(prompt('输入每组单词个数：') || '-1');
            if (blcount<=0){
                bljg='';
            } else {
                let group_count=Math.ceil(raw_list.length/blcount);
                if (group_count>100){
                    bljg='分组结果 '+group_count+' 超过 100 组';
                } else {
                    for (let blxl=0,lent=raw_list.length;blxl<lent;blxl=blxl+blcount){
                        bljg=bljg+'<br /><textarea style="height:3rem;" onclick="this.select();document.execCommand(\'copy\');">'+raw_list.slice(blxl,blxl+blcount).join('\n')+'</textarea>';
                    }
                }
            }
            break;
    }
    
    if (bljg!==false){
        odiv.innerHTML=bljg;
    }
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
    var bljg=array_split_by_col_b(cslist,[0]).join('');  //已经含有\n - 保留注释
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
        
        var blstr=textarea_with_form_generate_b(textarea_id,'height:20rem;','<p>','全选,清空,复制,发送到临时记事本,发送地址','</p>','','',false,bljg);
        bljg=firstword+blstr;
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

function enwords_js_wiki_textarea_b(cslist,cstype=''){
    //cslist 中每一行格式如 enwords 的每一行 - 保留注释
    //cslist 中每一行格式也可以是如 ['dog'] - 保留注释
    var ocheck=document.getElementById('check_js_wiki');
    if (ocheck){
        if (!ocheck.checked){return '';}
    }
    
    switch (cstype){
        case 'simple':
            var list_t=[].concat(cslist);    
            break;
        case 'str':
            var list_t=[];
            for (let item of cslist){
                list_t.push([item]);
            }            
            break;
        default:
            var list_t=[];
            for (let item of cslist){
                list_t.push(item[0]);
            }
            break;
    }
    return enwords_different_types_div_b(list_t);
}

function enwords_search_show_html_b(odiv,batch_div_name,recent_search_str,csword,csarray,csequal,without_textarea=false){
    var csword_filter=enword_filter_reg_b(csword)
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

function enwords_search_old_b(cs_w_p_d,csword,csreg,csmax=500){
    var blcount=0;
    var words_temp_equal_arr=enwords_search_arr_init_b();
	
    var cswordlist=csword.split(' ');
    var csword_filter=enword_filter_reg_b(csword)
    var csword_filter_set=new Set(csword_filter.split(' '));

    var blnumber=-1;
    
    for (let blitem_t of enwords){
        [blcount,blnumber]=enwords_search_one_b(blitem_t,cswordlist,csreg,csword_filter,csword_filter_set,cs_w_p_d,blcount,csmax);
        if (blcount==-1){break;}
        if (blnumber!==-1){
            words_temp_equal_arr[blnumber].push(blitem_t);
        }
    }
    return words_temp_equal_arr;
}

function enwords_mini_search_width_set_b(){
    var csw=prompt_from_local_storage_b('输入最大宽度','enwords_mini_search_width');
    if (csw==null){return;}
    document.getElementById('div_enwords_mini_search_frame').style.maxWidth=csw;
}

function enwords_mini_search_do_b(csword=''){
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

    var csreg=checkbox_kl_value_b('input_enwords_mini_search_reg');

    var search_type='';
    var otypes=document.getElementsByName('checkbox_mini_search_type');
    for (let one_type of otypes){
        if (one_type.checked){
            search_type=one_type.parentNode.innerText;
            break;
        }
    }
    
    if (search_type=='单词'){
        search_type='';
    }

    osession.scrollTop=0;
    
    if (search_type!==''){
        switch (search_type){
            case 'filelist 检索': //txtlistsearch - 保留注释
                if (typeof txtsearch_kltxt_b == 'function'){
                    txtsearch_kltxt_b(csword,csreg,false,false,false,osession);
                }
                break;
            case '网址库':
                if (typeof search_load_websites_b == 'function'){
                    search_load_websites_b(csword,csreg,-1,function(cslist){osession.innerHTML=cslist.join('\n');});
                }
                break;
            case 'statistics':
                if (typeof statistics_mini_b == 'function'){
                    osession.innerHTML=statistics_mini_b(csword,csreg,2);
                }
                break;
            case 'readlater':
                if (typeof search_websites_rlater == 'function' && csword!=='' && csword!=='.*'){
                    osession.innerHTML='<ol>'+search_websites_rlater(csword,false,20,false,true,false,25,csreg,true).join('\n')+'</ol>';
                }
                break;
            case 'f6t':
                osession.innerHTML='<div style="column-count:'+(ismobile_b()?1:2)+';">'+array_2_li_b(f6t_hot_words_search_b(csword,csreg,(ismobile_b()?10:20)))+'</div>';
                break;
        }
        return;
    }
    
    en_word_temp_get_b();
    
    var cs_w_p_d=enword_search_type_b([]);
    var csword_filter=enword_filter_reg_b(csword)
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

function f6t_hot_words_search_b(csword,isreg,csmax=10){
    [csword,isreg]=str_reg_check_b(csword,isreg,true);
    var hot_words=common_search_b(csword,isreg,f6t_hot_words_global)[0];
    
    var result_t=[];
    for (let arow of hot_words){
        for (let acol=1,lent=arow[0].length;acol<lent;acol++){
            result_t.push(arow[0][0]+' '+arow[0][acol]);
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

function enwords_mini_menu_item_b(csjs){
    return '<span class="span_menu" onclick="'+csjs+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>';
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

    var max_width=local_storage_get_b('enwords_mini_search_width');
    if (max_width==''){
        max_width=(ismobile_b()?70:50)+'%';
    }
    
    if (set_css){
        var blmax=get_max_zindex_b()+1;
        odiv.style.cssText='position:fixed;right:0%;top:0%;border:0.2rem pink dashed;background-color:white;max-width:'+max_width+';padding:0.5rem;z-index:'+blmax+';';
    }
}

function enwords_mini_search_frame_form_b(cstype='s'){
    var odiv=document.getElementById('div_enwords_mini_search_frame');
    if (cstype=='s'){
        odiv.innerHTML='<span onclick="enwords_mini_search_frame_form_b(\'\');" style="padding:1rem 0.5rem;cursor:pointer;color:tomato;"><b>S</b></span>';
        odiv.style.opacity='0.5';
    } else {
        var bljg='<input id="input_enwords_mini_search" type="text" onkeyup="if (event.key==\'Enter\'){enwords_mini_search_do_b();}"> ';

        var radios='';
        var radio_count=0;
        if (typeof txtsearch_kltxt_b == 'function' && typeof filelist !== 'undefined'){
            radios=radios+'<label><input type="radio" name="checkbox_mini_search_type">filelist 检索</label> ';    
            radio_count=radio_count+1;
        }

        if (typeof search_load_websites_b == 'function'){
            radios=radios+'<label><input type="radio" name="checkbox_mini_search_type">网址库</label> ';    
            radio_count=radio_count+1;
        }

        if (typeof statistics_mini_b == 'function'){
            radios=radios+'<label><input type="radio" name="checkbox_mini_search_type">statistics</label> ';
            radio_count=radio_count+1;
        }
        
        if (typeof search_websites_rlater == 'function' && typeof readlater_data_global !== 'undefined'){
            radios=radios+'<label><input type="radio" name="checkbox_mini_search_type">readlater</label> ';
            radio_count=radio_count+1;
        }
        
        if (typeof f6t_hot_words_global !== 'undefined'){
            radios=radios+'<label><input type="radio" name="checkbox_mini_search_type">f6t</label> ';
            radio_count=radio_count+1;
        }
                
        if (radio_count>1){
            radios='<label><input type="radio" name="checkbox_mini_search_type" checked>单词</label> '+radios;
        } else if (radio_count==1){
            radios=radios.replace('type="radio"','type="checkbox"');
        }
        
        bljg=bljg+radios;
        bljg=bljg+'<span class="aclick" onclick="enwords_mini_search_width_set_b();">W</span>';
        bljg=bljg+'<span class="aclick" onclick="enwords_mini_search_frame_form_b();">Close</span>';
        bljg=bljg+'<section style="overflow:auto;padding-top:0.1rem;max-height:'+parseInt(window.innerHeight*2/3)+'px;font-size:1rem;" id="session_mini_search">'+enwords_recent_search_b('','mini');+'</section>';

        odiv.innerHTML=bljg;
        odiv.style.opacity='';

        mouseover_mouseout_oblong_span_b(document.querySelectorAll('p#p_recent_search span.oblong_box'));

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
    switch (cstype){
        case 'mini':
            var recent_search_str='<p id="p_recent_search" style="margin:0; line-height:'+(ismobile_b()?'200':'210')+'%;">';
            return recent_search_str+sub_enwords_recent_search_b_fn('enwords_mini_search_do_b')+'</p>';
            break;
        case 'sentence':
            var odiv=document.getElementById('div_recent_search');
            if (odiv){
                odiv.innerHTML=sub_enwords_recent_search_b_fn('search_sentences');    
                mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
            }
            return '';
            break;
        default:
            var odiv=document.getElementById('div_recent_search');
            if (odiv){
                odiv.innerHTML=sub_enwords_recent_search_b_fn('wordsearch_enwords_b');    
                mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
            }
            return '';
    }
}

function p_enwords_sentence_style_b(){
    return '.div_sentence p.p_enwords_sentence:nth-child(even), #div_enword_search_links p.p_enwords_sentence:nth-child(even) {background-color:'+scheme_global['button']+';}';
}

function en_sentence_to_default_order_b(){
    if (typeof en_sentence_global == 'undefined'){
        return 'en_sentence_global 未定义';
    }
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

function en_sentence_attachment_wikisite_path_get_b(islocal,remote_host,sele_path,item){
    if (islocal){
        var attachment_path=remote_host+'/wikiuploads/';
        var wikisite=remote_host+(item[2].slice(-4,)=='_TLS'?'/klwebphp/PythonTools/data/selenium_news/html/txtlistsearch.htm?_tag':'/wiki/index.php/');
    } else {
        var attachment_path='';
        var wikisite=(item[2].slice(-4,)=='_TLS'?sele_path+'/html/txtlistsearch.htm?_tag':'');        
    }
    return [attachment_path,wikisite];
}

function sentence_list_2_html_b(cslist,csword_list=[''],csmax=500,show_button=true,csmobile_font=false,return_arr=false,keep_kleng=false,remove_quote='rq'){
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var mobile_pc_font_size='';
    if (ismobile_b()){
        mobile_pc_font_size=(csmobile_font===false?'1.1':csmobile_font);
    }
    
    var button_str=(show_button?en_sentence_button_init_b(true):'');

    var blcount=0;
    var bljg=[];
    var p_style=en_sentence_p_style_b(mobile_pc_font_size);
    var islocal=is_local_b();
    var sele_path=klbase_sele_path_b()[1];
    var attachment_path,wikisite;
	for (let item of cslist){
        //符合宽泛的条件后，再判断是否含有 过滤后的单词，若没有返回空字符 - 保留注释
        [attachment_path,wikisite]=en_sentence_attachment_wikisite_path_get_b(islocal,remote_host,sele_path,item);

        var str_t=en_sentence_one_line_b(item,csword_list,attachment_path,wikisite,button_str,return_arr,keep_kleng,remove_quote);
        
        if (return_arr){
            if (str_t.length>0){
                bljg.push(str_t);
                blcount=blcount+1;
            }
        } else if (str_t!==''){
            bljg.push(p_style+str_t+'</p>');
            blcount=blcount+1;
        }        
        if (csmax>=0 && blcount>=csmax){break;}
	}
    return bljg;
}

function sentence_horizontal_overflow_check_b(){
    var ocontainer=document.querySelector('div.div_sentence');
    var ospans=ocontainer.querySelectorAll('span.span_enwords_sentence');
    doms_horizontal_overflow_check_b(ocontainer,ospans);
}

function sentence_split_status_generate_b(){
    return {'小写':0,'长度':0,'单词数':0,'http':0,'()':0,'_Dr.':0,'Dr.':0,'etc':0,'console':false};
}

function sentence_split_b(csstr,csno=-1,re_combine=false){   //sentence split - 保留注释
    function sub_sentence_split_b_count(cstype,str1,str2){
        re_combine[cstype]=re_combine[cstype]+1;
        if (re_combine['console']){
            console.log('例句再合并 '+cstype+':',str1,str2);
        }
    }
    
    function sub_sentence_split_b_check_str(csstr1,csstr2){
        let blcheck=csstr1.length<25 || csstr2.length<25;
        if (blcheck){
            sub_sentence_split_b_count('长度',csstr1,csstr2);
            return true;
        }
    
        blcheck=(csstr1.match(/\s+/g) || []).length<10 || (csstr2.match(/\s+/g) || []).length<10;
        if (blcheck){
            sub_sentence_split_b_count('单词数',csstr1,csstr2);
            return true;
        }
        
        blcheck=csstr2.trim().match(/^[a-z]/);   //如果csstr2 以小写字母开头 - 保留注释
        if (blcheck){
            sub_sentence_split_b_count('小写',csstr1,csstr2);
            return true;
        }
        
        if (csstr1.match(/\[https?:\/\/[^\]]+$/)){
            sub_sentence_split_b_count('http',csstr1,csstr2);
            return true;
        }
        
        if (has_quote){
            let quote1=(csstr1.match(/[\(\)]/g) || ['']).slice(-1)[0];  //获取最后一个括号 - 保留注释
            if (quote1=='('){
                let quote2=(csstr2.match(/[\(\)]/) || [''])[0];  //获取第一个括号 - 保留注释
                if (quote2==')'){
                    sub_sentence_split_b_count('()',csstr1,csstr2);                
                    return true;
                }
            }
        }

        return false;
    }
    
    function sub_sentence_split_b_check_etc(col_no){
        if (list_t[col_no-1].trim().slice(-5,)==' etc.'){
            sub_sentence_split_b_count('etc',list_t[col_no-1],list_t[col_no]);
            return true;
        } else {
            return sub_sentence_split_b_check_str(list_t[col_no-1],list_t[col_no]); 
        }
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
    
    if (re_combine===false){
        re_combine=sentence_split_status_generate_b();
    }
    var old_str=csstr;
    
    csstr=csstr.replace(/(([^A-Z]((\. )+)?\.|\?|!|\"|\?) )/g,'$1\n');
    var has_mr=(csstr.includes('Mr.') || csstr.includes('Dr.') || csstr.includes('St.'));
    var has_quote=(csstr.includes('(') && csstr.includes(')'));
    var list_t=csstr.split('\n');
    var result_t=[];

    if (has_mr){
        for (let blxl=list_t.length-1;blxl>0;blxl--){
            if (sub_sentence_split_b_check_etc(blxl)){
                list_t[blxl-1]=list_t[blxl-1]+list_t[blxl];
                list_t[blxl]='';
            } else if ([' Dr.',' Mr.',' St.'].includes(list_t[blxl-1].trim().slice(-4,)) && list_t[blxl-1].slice(-1)!=='.'){
                sub_sentence_split_b_count('_Dr.',list_t[blxl-1],list_t[blxl]);        
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
        
        for (let blxl=0,lent=list_t.length-1;blxl<lent;blxl++){
            if (['Mr.','Dr.','St.'].includes(list_t[blxl].trim().slice(-3,))){
                sub_sentence_split_b_count('Dr.',list_t[blxl],list_t[blxl+1]);
                list_t[blxl+1]=list_t[blxl]+list_t[blxl+1];
                list_t[blxl]='';
            }
        }
        result_t=[];
    } else {
        for (let blxl=list_t.length-1;blxl>0;blxl--){   //blxl 最小值取到 1 - 保留注释
            if (sub_sentence_split_b_check_etc(blxl)){
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
                if (sub_sentence_split_b_check_str(semicolon_list[blxl-1],semicolon_list[blxl])){
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

function sentence_search_value_get_b(csword,change_title=true,show_button=true){
    var is_reg=checkbox_kl_value_b('input_reg');
    var blmax=parseInt(document.getElementById('input_max_result').value);
    document.getElementById('divhtml').innerHTML=sentence_search_b(csword,is_reg,blmax,show_button);
    setTimeout(en_sentence_mobile_b,10);
    if (change_title){
        title_change_enwords_b('例句搜索');
    }
}

function sentence_search_b(csword='',csreg=false,csmax=500,show_button=true,csmobile_font=false){
    if (typeof en_sentence_global == 'undefined'){
        return 'en_sentence_global 未定义';
    }
    if (csword==''){return '';}

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
    var re_combine=sentence_split_status_generate_b();
	for (let blxl=0,lent=en_sentence_global.length;blxl<lent;blxl++){
        var aline=en_sentence_global[blxl];
        var line_split=sentence_split_b(aline[0],blxl,re_combine);
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
                if (blcount>=csmax){
                    do_break=true;
                    break;
                }
            }
        }
        if (do_break){break;}
	}
    console.log(re_combine);
    var bljg=sentence_list_2_html_b(result_t,blwordlist2,csmax,show_button,csmobile_font);
	return '<div class="div_sentence">'+bljg.join('\n')+'</div><p><i>('+bljg.length+')</i></p>';
}

function simple_words_b(is_set=true,to_lower_case=false,space_2_underline=false,onlyaz=false){
    var result_t=[];
    if (to_lower_case){
        if (onlyaz){
            for (let item of enwords){
                if (item[0].match(/^[a-z]+$/i)){
                    result_t.push(item[0].toLowerCase());
                }
            }
        } else {
            for (let item of enwords){
                result_t.push(item[0].toLowerCase());
            }        
        }
    } else {
        if (onlyaz){
            for (let item of enwords){
                if (item[0].match(/^[a-z]+$/i)){
                    result_t.push(item[0]);
                }
            }
        } else {
            for (let item of enwords){
                result_t.push(item[0]);
            }
        }
    }
    
    if (space_2_underline){
        for (let blxl=0,lent=result_t.length; blxl<lent; blxl++){
            result_t[blxl]=result_t[blxl].replace(new RegExp(' ','g'),'_');
        }
    }
    
    if (is_set){
        return new Set(result_t);
    } else {
        return result_t;
    }
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

function day_no_enwords_b(csinterval=30,csdate=false,do_test=false){
    if (do_test){
        for (let blxl=1;blxl<=31;blxl++){
            var bldate=next_day_b('',blxl,false);
            var result_t=day_no_enwords_b(csinterval,bldate,false)[0];
            console.log(date_2_ymd_b(bldate,'d'),result_t);
        }
        return;
    }
    
    var blday=date_2_ymd_b(csdate,'d');
    blday=blday%csinterval;
    blday=(blday==0?csinterval:blday);
    blday=(blday==1?csinterval+1:blday);
    return [blday,csinterval];
    
    //以下4行保留 - 保留注释
    //var blday=date2str_b().slice(-1,);
    //if (blday=='0' || blday=='1'){
        //blday='1'+blday;
    //}    
}

function recent_words_list_enwords_b(cspageno=0,words_count_per_page=100,israndom=false,show_html=true,add_date_line=true){
    words_searched_arr_global=en_words_temp_list_b(add_date_line);
    var bllen=words_searched_arr_global.length;
    var pages_count=Math.ceil(words_searched_arr_global.length/words_count_per_page);
    //cspageno 是记录序号 从 1 开始，0表示当前书签单词所在页，-1表示全部 - 保留注释
    var recent_bookmark=enwords_recent_bookmark_get_b();
    if (cspageno==0){
        if (recent_bookmark=='' && words_searched_arr_global.length>0){
            recent_bookmark=words_searched_arr_global[0][0];
        }
        var blat=0;
        for (let blxl=0,lent=words_searched_arr_global.length;blxl<lent;blxl++){
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
            for (let blxl=0,lent=words_searched_arr_global.length;blxl<lent;blxl++){
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

    //以下2行保留 - 保留注释
    //var blweek=date_2_ymd_b(false,'w');    
    //blweek=(blweek==0?7:blweek);
    var cached_no=local_storage_get_b('enwords_recent_no');
    var rand_page_no_list=[day_no_enwords_b()[0]];
    if (cached_no!==''){
        rand_page_no_list.push(parseInt(cached_no));
    }
    
    var page_html='<p style="'+page_p_style_b()+'">'+page_combination_b(bllen,words_count_per_page,cspageno,'recent_words_list_enwords_b','page_location_enwords_b','WITHOUT P',1,50,'','aclick',1,true,rand_page_no_list);

    cspageno=Math.ceil((cspageno+1)/words_count_per_page);  //记录号更改为页号 - 保留注释

    page_html=page_html+'<span class="aclick" onclick="enwords_recent_no_set_b('+cspageno+',this);">Cache('+cached_no+')</span>';
    page_html=page_html+'</p>';
    
	document.getElementById('divhtml').innerHTML=bljg+page_html;
    

    title_change_enwords_b('最近记忆的单词'+(cspageno==-1?'(全部)':'_第'+cspageno+'页'));
    document.location.href='#top';
    document.location.href='#a_recent_bookmark';
    words_count_enwords_b();
    en_words_show_check_b();
}

function enwords_recent_no_set_b(cspageno,ospan){
    if (cspageno=='' || isNaN(cspageno)){return;}
    
    localStorage.setItem('enwords_recent_no',cspageno);
    ospan.innerText='Cache('+cspageno+')';
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
    for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
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
	for (let blxl=0,lent=bllist.length;blxl<lent;blxl++){
		var blno=bllist[blxl][1];

        bljg=bljg+(cshideno?'<p class="article">':'<li>');

		var tmp_similarno=bllist[blxl][0];
		if (cshidesimilarno){
            tmp_similarno=0;
        }

        bljg=bljg+en_one_word_b(enwords[blno],[(cshidelineno?-1:blno), tmp_similarno]);
        bljg=bljg+(cshideno?'</p>':'</li>');
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
        en_words_show_check_b();
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

    var csword_filter=enword_filter_reg_b(csword)   //不能放在if中 - 保留注释
    var words_temp_equal_arr=enwords_search_old_b(cs_w_p_d,csword,csreg,max_result_enwords_b());
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
        en_words_show_check_b();
    }
    
    words_searched_arr_global=[].concat(words_temp_arr);

    if (showhtml){
        title_change_enwords_b('');
        top_bottom_arrow_b('div_top_bottom',words_searched_arr_global.length+' ');
    }
}

function enword_filter_reg_b(csword=false){
    var blreg=/[a-zA-Z0-9 '_\-]+/;
    if (csword===false){
        return blreg;
    } else {
        return (csword.match(blreg) || [''])[0];
    }
}

function en_words_show_check_b(){
    if (klmenu_check_b('span_show_en_sentence_b',false)){
        console.log('显示例句');
        show_sentence_enwc_b(0,true,true);
    } else {
        console.log('不显示例句');
    }

    if (klmenu_check_b('span_split_en_definitions_b',false)){
        console.log('拆分释义');
        enwords_definition_2_multilines_b();
    } else {
        console.log('不拆分释义');
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

function enwords_definition_sort_b(ospan){
    var oparent=ospan.parentNode;
    var olis=oparent.parentNode.querySelectorAll('li');
    var blstart=-1;
    var blend=olis.length-1;
    var result_t=[];
    for (let blxl=0,lent=olis.length;blxl<lent;blxl++){
        if (olis[blxl]==oparent){
            blstart=blxl+1;
            continue;
        }
        
        if (blstart===-1){continue;}
        
        if (olis[blxl].querySelector('span.span_enword_type')){
            blend=blxl-1;
            break;
        }
        result_t.push(olis[blxl].innerHTML);
    }
    
    if (blstart===-1 || result_t.length<2 || blend-blstart+1!==result_t.length){return;}
    
    result_t.sort(zh_sort_b);
    for (let blxl=blstart;blxl<=blend;blxl++){
        olis[blxl].innerHTML=result_t[blxl-blstart];
    }
}

function enwords_definition_2_multilines_b(){
    var type_str=enword_type_b(true);
    
    var ospans=document.querySelectorAll('span.span_explanation');
    for (let one_span of ospans){
        var blstr=one_span.innerHTML;
        if (blstr.substring(0,4)=='<ul>'){continue;}
        one_span.innerHTML='<ul><li>'+enwords_definition_split_b(blstr,type_str,true,false).join('</li><li>')+'</li></ul>';
    }
}

function enwords_definition_split_b(csdefinition,type_str,include_cn=false,remove_type=true){
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
    var reg_exp=new RegExp('<b>'+type_str+'\\. <\/b>','g');    //不能加\\b - 保留注释

    if (remove_type){
        var replace_to='';
    } else {
        var replace_to='<span class="span_enword_type span_box" style="font-weight:bold;" ondblclick="enwords_definition_sort_b(this);" title="释义排序">$1\. </span>; 📋 ';
    }
    
    csdefinition=csdefinition.replace(reg_exp,replace_to);
    
    var def_list=csdefinition.split('; 📋 ');
    var result_t=[];
    var blstr='';
    for (let blxl=0,lent=def_list.length;blxl<lent;blxl++){
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

    //result_t 形如：
    //[
    //"<span class="span_enword_type span_box" style="font-weight:bold;" ondblclick="enwords_definition_sort_b(this);">adj. </span>",
    //"多波段的",
    //"(radio) involving or receiving more than one waveband",
    //"having or employing multiple bands, especially frequency bands",
    //"<span class="span_enword_type span_box" style="font-weight:bold;" ondblclick="enwords_definition_sort_b(this);">adj. </span>",
    //"having or involving numerous bands"
    //];
    return result_t;
}

function sentence_wt_b(){
    var list_t={'w':[],'t':[]};
    if (typeof en_sentence_global == 'undefined'){return list_t;}

    for (let arow of en_sentence_global){
        var colno=(arow[2].slice(-4,)=='_TLS'?'t':'w');
        list_t[colno].push(arow[0]);
    }
    return list_t;
}

function phrase_in_old_words_b(merge_phrase=false){
    var words_set=new Set();
    var phrase1_set=new Set();
    var phrase2_set=new Set();

    for (let item of enwords){
        if (item[0].includes(' ')){
            phrase1_set.add(item[0]);
        } else if (item[0].includes('-')){
            phrase2_set.add(item[0]);
        } else {
            words_set.add(item[0]);
        }
    }
    if (merge_phrase){
        return [array_union_b(phrase1_set,phrase2_set,true),words_set];
    } else {
        return [phrase1_set,phrase2_set,words_set];
    }
}

function old_words_redundant_kltxt_b(is_all=false,row_query='span.txt_content',check_is_visible=false,return_reg=true){
    var result_t=[];
    var blmin=(is_all?0:1);
    var orows=document.querySelectorAll(row_query);
    for (let arow of orows){
        if (check_is_visible){
            if (arow.style.display=='none'){continue;}
        }
        
        var ospans=arow.querySelectorAll('span.span_kleng');
        var lent=ospans.length;
        if (lent<blmin+1){continue;}
        //<span class="span_box span_kleng" onclick="popup_words_links_b(event,'unofficial');" title="unofficial"><font color="#cc0000">[ˌʌnə'fɪʃ(ə)l]</font></span>
        for (let blxl=blmin;blxl<lent;blxl++){
            result_t.push(ospans[blxl].getAttribute('title'));
        }
    }
    if (return_reg){
        alert('结果：\n^\\*('+result_t.join('|')+')$');
    } else {
        alert('结果：\n'+result_t.join('\n')+'');
    }
}
