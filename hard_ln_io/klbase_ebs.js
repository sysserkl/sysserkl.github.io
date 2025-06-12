function remove_or_search_textarea_words_ebs_b(odiv,cstype=''){
    var ops=odiv.querySelectorAll('p');
    var words=new Set();
    for (let onep of ops){
        var blstr=onep.innerText.trim();
        if (blstr.substring(0,1)!=='*'){continue;}
        blstr=blstr.substring(1,).trim();
        words.add(blstr);
    }
    if (words.size==0){
        return words;
    }
    
    switch (cstype){
        case 'search':
            temp_search_link_value_set_b('^('+Array.from(words).join('|')+')$_reg');
            window.open(klbase_sele_path_b()[1]+('/html/enwords.htm?sls&sentence'));
            break;
        case 'remove':
            if (!confirm('是否剔除单词？\n'+Array.from(words).join('\n'))){return;}
            
            var otextarea=document.getElementById('textarea_batch_search_ebs');
            var list_t=otextarea.value.trim().split('\n');
            var result_t=[];
            for (let item of list_t){
                if (words.has(item)){continue;}
                result_t.push(item);
            }
            otextarea.value=result_t.join('\n');
            alert('剔除前行数'+list_t.length+'；剔除后行数：'+result_t.length);
            break;
        case 'value':
            return words;
            break;            
    }
}

function show_result_ebs_b(content_arr,book_arr,cskey,selepath){
    var blno=0;
    for (let blxl=0,lent=content_arr.length;blxl<lent;blxl++){
        var item=content_arr[blxl];
        if (item.substring(0,3)=='BN:'){
            var bookid=item.substring(3,);
            var bookname='';
            var digest_position='';
            var isprivate='';
            
            for (let abook of book_arr){
                if (abook[0]==bookid){
                    bookname=abook[1];
                    digest_position=abook[3];
                    if (abook[4].includes('P')){
                        isprivate='P';
                    }
                    break;
                }
            }
            content_arr[blxl]='<span class="span_ebs_book_name span_link" id="span_ebs_book_name_'+blno+'" style="font-size:1.3rem;font-weight:bold;" onclick="txtbook_link_b(this,\''+bookid+'\');">'+(blno+1)+'.' +bookname+'</span> <small>'+(digest_file_found_global.includes(bookid)?'<span style="color:red;font-weight:bold;">'+bookid+'</span>':bookid)+' ('+digest_position+isprivate+')'+'</small>';
            blno=blno+1;
        }
    }
    return content_arr;
}

function init_ebs_b(){
    function sub_init_ebs_b_fn(){
        enwords_mini_search_frame_style_b();
        enwords_mini_search_frame_form_b();
    }
    //-----------------------
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    document.getElementById('p_buttons_ebs').insertAdjacentHTML('afterbegin',textarea_buttons_b('textarea_batch_search_ebs','清空,复制'));
    
    enwords_init_b(true,true,sub_init_ebs_b_fn);
}

function txtbook_link_b(ospan,bookid){
    var span_id=ospan.getAttribute('id');
    if (!span_id){return;}
    
    var blfound=false;
    var odoms=document.querySelectorAll('span.span_ebs_book_name, div.div_words_list_ebs');
    for (let blxl=0,lent=odoms.length-1;blxl<lent;blxl++){
        var one_dom=odoms[blxl];
        var blid=one_dom.getAttribute('id');
        if (!blid){continue;}
        if (blid!==span_id){continue;}
        if (odoms[blxl+1].classList.contains('span_ebs_book_name')){break;}
        
        var words=Array.from(remove_or_search_textarea_words_ebs_b(odoms[blxl+1],'value'));
        temp_search_link_value_set_b('+('+specialstr_j(words.join('|')).replace(/\s/g,'\\s')+')(:r)');
        window.open(klbase_sele_path_b()[1]+'/html/txtlistsearch.htm?'+bookid+'&sls');       
        blfound=true;
        break; 
    }
    if (blfound==false){
        window.open(klbase_sele_path_b()[1]+'/html/txtlistsearch.htm?'+bookid);
    }
}

function new_words_ebs_b(is_rare=false){
    var ospans=document.querySelectorAll('div#divhtml span.txt_content');
    var list_t=[];
    var ospans_content=[];
    for (let item of ospans){
        var otitle=item.querySelector('span.span_ebs_book_name');
        if (otitle){continue;}
        list_t.push(item.innerText);
        ospans_content.push(item);
    }
    get_new_words_arr_obj_enbook_b((is_rare?5:2),list_t.join('\n'),ospans_content,true,true);
}

function enwords_array_ebs_b(){
    function sub_enwords_array_ebs_b_get_words(){
        var bljg=[];
        for (let aword of words){
            bljg.push('*'+aword);
        }
        if (bljg.length==0){return '';}
        bljg.sort();    
        if (otextarea_value==''){
            var blbuttons='';
        } else {
            var blbuttons='<p style="margin-top:0.5rem;">';
            blbuttons=blbuttons+'<span class="oblong_box" onclick="remove_or_search_textarea_words_ebs_b(this.parentNode.parentNode,\'remove\');">清除编辑框中的这些单词</span> ';
            blbuttons=blbuttons+'<span class="oblong_box" onclick="remove_or_search_textarea_words_ebs_b(this.parentNode.parentNode,\'search\');">单词测试</span> ';
            blbuttons=blbuttons+'</p>';
        }
        return '<div class="div_words_list_ebs">\n<hr />\n<p>'+bljg.join('</p><p>')+'</p>'+blbuttons+'<hr />\n</div>\n'
    }
    //-----------------------
    var odiv=document.getElementById('divhtml');
    var ospans=odiv.querySelectorAll('span.txt_content');
    var otextarea_value=document.getElementById('textarea_batch_search_ebs').value.trim();
    var words=new Set();
    for (let aspan of ospans){
        if (aspan.querySelectorAll('span.span_ebs_book_name').length>1){continue;}  //可能由于正文中含有 html tag 且未闭合，导致错误的包含关系 - 保留注释
        var otitle=aspan.querySelector('span.span_ebs_book_name');    
        if (otitle){
            if (words.size==0){continue;}
            aspan.parentNode.insertAdjacentHTML('beforebegin',sub_enwords_array_ebs_b_get_words());
            words=new Set();
        } else {
            var blcontent=aspan.innerText;            
            var highlights=aspan.querySelectorAll('span.span_key_highlight');   //informative uninformative - 保留注释
            for (let one_hightlight of highlights){
                var blkey=one_hightlight.innerText;
                try {
                    if (blcontent.match('\\b'+blkey+'\\b')!==null){
                        words.add(blkey);
                    }
                } catch (error){
                    //do nothing
                }
            }
        }
    }
    if (words.size>0){
        odiv.insertAdjacentHTML('beforeend',sub_enwords_array_ebs_b_get_words());
    }
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function hide_batch_search_form_ebs_b(){
    var otextarea=document.getElementById('textarea_batch_search_ebs');
    var blvalue=otextarea.value.trim();
    if (blvalue=='' || confirm('是否清空编辑框并关闭批量搜索？')){
        otextarea.value='';
        document.getElementById('div_batch_search_ebs').style.display='none';
    }
}

function document_title_ebs_b(){
    var blstr=document.getElementById('input_search').value;
    document_title_key_word_b(blstr,'Book Search');
}

function menu_ebs_b(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'new_words_ebs_b();">显示生词</span>',
    '<span class="span_menu" onclick="'+str_t+'new_words_ebs_b(true);">显示稀有旧单词</span>',    
    '<span class="span_menu" onclick="'+str_t+'document.getElementById(\'div_batch_search_ebs\').style.display=\'\';">批量搜索</span>',   
    load_sentence_menu_b(str_t),
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'👁','11rem','1rem','1rem','60rem'),'','0rem')+' ');
}
