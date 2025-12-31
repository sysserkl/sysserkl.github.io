function mobile_style_kltxt_b(line_height=180){
    var unity_t='span.span_jsdoc_html_line_no {font-size:0.8rem;color:'+scheme_global['memo']+';}';
    
	var mobile_t=[
	'ul,ol,li{font-size:1.1rem;line-height:'+line_height+'%;}',
    'li{margin-bottom:1.5rem;}',
    'ul,ol{padding:0;margin-left:0rem;list-style-position: inside;}',
	'#divhtml,#div_cn_words {margin:0 1rem;}',
	'#div_top_bottom{position:fixed; bottom:2%; right:1%; z-index:9999; padding:0; margin:0;opacity:0.7;}',
    '#divhtml p {font-size:1.1rem;margin-bottom:1rem;line-height:'+line_height+'%;}',
    'img {max-width:100%;}',
    unity_t,
    ];

    var pc_t=[
    'ul,ol,li{font-size:1.1rem;line-height:'+line_height+'%;padding:0px;}',
    'li{margin-bottom:0.5rem;}',
	'#divhtml,#div_cn_words {font-family:Noto Sans;margin-left:10%; margin-right:10%;max-width:'+Math.max(700,parseInt(document.body.clientWidth*0.5))+'px;}', //margin-left:'+(parseInt(document.body.clientWidth)*0.5)/2+'px; - 保留注释
	'#div_top_bottom{position:fixed; bottom:2%; right:1%; z-index:9999; padding:0; margin:0;opacity:0.7;}',
    '#divhtml p {font-size:1.1rem;margin-bottom:1rem;line-height:'+line_height+'%;}',
    'img {max-width:500px;}',
    unity_t,
    ];

	mobile_style_b(mobile_t, pc_t);
}

function possible_menu_kltxt_b(){
    var list_t=[];
    for (let blxl=0,lent=filelist.length;blxl<lent;blxl++){
        var item=filelist[blxl];
        if (item.length>50){continue;}
        list_t.push([item,blxl]);
    }
    list_t.sort();
    var blstr='';
    var blno=0;
    var double_t=[];
    var bltimes=1;
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        if (item[0]!==blstr){
            if (blxl>0 && bltimes==2 && blstr!==''){
                double_t.push([blno,blstr]);
            }
            blstr=item[0];
            blno=item[1];
            bltimes=1;
        } else {
            bltimes=bltimes+1;
            blno=Math.max(blno,item[1]);
        }
    }
    double_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    var bljg='';
    for (let item of double_t){
        bljg=bljg+'<li>'+item[1]+'<span style="cursor:pointer;color:'+scheme_global['memo']+';font-size:0.9rem;" onclick="getlines_kltxt_b('+item[0]+');">('+(item[0]+1)+')</span></li>';
    }
    document.getElementById('divhtml').innerHTML='<ol>'+bljg+'</ol>';
}

function change_colors_kltxt_b(csstr=''){
    if (csstr==''){
        csstr=local_storage_get_b('theme_txtlistsearch');
    }
    change_colors_b(csstr);
    localStorage.setItem('theme_txtlistsearch',csstr);
    var ospan=document.querySelectorAll('span[class*="span_page_number"]');
    for (let item of ospan){
        var ofont=item.querySelector('font[color="'+scheme_global['a-hover']+'"]');
        if (ofont){
            item.click();
            document.location.href='#top';
            break;
        }
    }
}

function statistics_kltxt_b(){
    var result_t=[];
    var flot_list=[];
    [result_t,flot_list]=date_rows_tr_generate_b('booklist_statistics',40,[15,0,0.5],0).slice(1,3);
    
    if (result_t.length==0){return;}

    var bljg='<table border=1 cellspacing=0 cellpadding=0 style="margin:1rem 0rem;"><tr><th  style="padding:0.2rem;" nowrap>日期</th><th style="padding:0.2rem;" nowrap>书籍数</th><th style="padding:0.2rem;" nowrap>Δ</th></tr>'+result_t.join('\n')+'</table>';    
    bljg='<table border=0 width=100% height=100%><tr><td valign=top width=1 height=100%>'+bljg+'</td>';
    bljg=bljg+'<td valign=top width=70%><div style="width:100%;height:300px;" id="div_flot_line"></div></td></tr>';
    bljg=bljg+'</table>';

    document.getElementById('divhtml').innerHTML=bljg;
    flot_lines_b([['书籍数'].concat(flot_list)],'div_flot_line','nw',true,'','d','本',0,[1, 'day'],5);
}

function new_words_kltxt_b(type_list=false,word_is_in_sentence='',do_clear=false,ocontainer=false){
    if (type_list===false){
        type_list=[];
        if (klmenu_check_b('span_show_new_enwords',false)){
            type_list.push(2);
        }
        
        if (klmenu_check_b('span_show_rare_enwords',false)){
            type_list.push(5);
        }
    }

    ocontainer=container_query_doms_get_kltxt_b('',ocontainer);
    
    if (do_clear){
        if (type_list.includes(2)){
            rare_or_new_span_remove_enbook_b(ocontainer,false);                
        }
        if (type_list.includes(5)){
            rare_or_new_span_remove_enbook_b(ocontainer,true);
        }        
    }
    
    for (let one_type of type_list){
        get_new_words_arr_obj_enbook_b(one_type,ocontainer.innerText,ocontainer.querySelectorAll('.txt_content'),true,false,'',false,'0.15rem dotted',word_is_in_sentence);
    }
}

function old_words_kltxt_b(is_init=false,ocontainer=false){
    var blshow=(klmenu_check_b('span_show_old_enwords',false)?'':'none');
    if (is_init){
        sup_kleng_words_b(blshow,ocontainer);
    } else {
        var ospans=container_query_doms_get_kltxt_b('sup.kleng span.span_sup_word_full',ocontainer);
        for (let one_span of ospans){
            one_span.style.display=blshow;
        }
    }
}

function search_or_reader_kltxt_b(cstype){
    var blno=document.getElementById('input_lineno').value;
    window.open(cstype+'.htm?'+csbookname_global+(cstype=='reader_card'?'':'&line='+blno));
}

function tw_kltxt_b(){
    var tws=new Set();
    for (let item of filelist){
        var list_t=item.split('');
        for (let one_word of list_t){
            tws.add(one_word);
        }
    }
    var result_t=[];
    for (let item of tws){
        if (item.trim()=='' || item==','){continue;}
        if (zh_tw_global.includes(item+'>')){
            result_t.push(item);
        }
    }
    document.getElementById('divhtml').innerHTML='<p>'+result_t.join(', ')+'</p><p>'+result_t.length+'</p>';
}

function digest_statistics_kltxt_b(){
    var t0 = performance.now();
	var start_lineno, end_lineno;
    [start_lineno,end_lineno]=start_end_lineno_kltxt_b().slice(0,2);    //如 0, 32358 - 保留注释
    
    var digest_nos=new Set(array_split_by_col_b(digest_sort_kltxt_b(false),[0]));
    
    var result_t=[];

    var flot_list=['含摘要的行占比#points:false#'];
    var digest_lines=0;
    var total_lines=end_lineno-start_lineno;
    
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){
        if (digest_nos.has(blxl)){
            blfound='<span style="color:green;margin-left:0.1rem;" title="'+(blxl+1)+'">●</span>';
            digest_lines=digest_lines+1;        
        } else {
            var blfound='<span style="color:grey;margin-left:0.1rem;" title="'+(blxl+1)+'">○</span>';
        }
        result_t.push(blfound);
        flot_list.push([blxl+1,digest_lines*100/total_lines]);    
    }

    var bljg='<p style="line-height:120%;font-size:0.8rem;word-break:break-all;word-wrap:break-word;">('+(start_lineno+1)+'-'+end_lineno+': '+digest_lines+'/'+total_lines+' '+(digest_lines*100/total_lines).toFixed(2)+'%) '+result_t.join('\n')+'</p>';
    bljg=bljg+'<div id="div_digest_flot_kltxt" style="width:100%;height:500px;"></div>';
    document.getElementById('divhtml').innerHTML=bljg;

    flot_lines_b([flot_list],'div_digest_flot_kltxt','nw',false,'','','%');
    console.log('digest_statistics_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function reading_mode_kltxt_b(){
    digest_temp_add_kltxt_b(true);   
    var odiv=document.getElementById('div_show_hide');
    if (odiv){
        odiv.style.display='none';
    }
    location.href='#content';
}

function float_bookname_kltxt_b(){
    var odiv=document.getElementById('div_float_bookname');
    if (!odiv){
        document.body.insertAdjacentHTML('beforeend','<div id="div_float_bookname" style="position:fixed;left:0;bottom:0;width:100%;background-color:'+scheme_global['background']+';cursor:pointer;" ondblclick="this.style.display=\'none\';"></div>');
        odiv=document.getElementById('div_float_bookname');
    }
    if (!odiv){return;}
    var bookname_t=csbooklist_sub_global[csbookno_global][1];
    if (!bookname_t.includes('《')){
        bookname_t='《'+bookname_t+'》';
    }
    var bljg='<hr /><p align=right style="font-weight:bold;margin:0.5rem;">'+bookname_t+'</p>';    
    odiv.innerHTML=bljg;
    odiv.style.display='';
}

function import_bigfile_kltxt_b(){
    function sub_import_bigfile_kltxt_b_load_digest(is_ok){
        if (!is_ok){
            digest_global=digest_temp;
        }
        digest_temp_load_kltxt_b();
        getlines_kltxt_b(1);
    }
    
    function sub_import_bigfile_kltxt_b_load_content(is_ok){
        if (is_ok){
            create_menulist_kltxt_b();
            book_title_set_kltxt_b(csbooklist_sub_global[0][1]);
            menu_all_only_one_kltxt_b();
            digest_temp=[].concat(digest_global);
            digest_global=undefined;
            load_js_var_file_b('digest_global',[],csbooklist_sub_global[0][0]+'_digest.js',sub_import_bigfile_kltxt_b_load_digest,true,true);
        }
    }
    
    var fname=document.getElementById('select_big_file_book_kltxt').value;
    if (fname=='手动输入 bigfile book 文件名'){
        fname=prompt_from_local_storage_b('输入书籍文件名','bigfile_txtbook') || '';
    }
    
    if (fname.trim()==''){return;}

    filelist=undefined;
    filelist2=[];
    menulist=[];
    digest_global=[];
    kltxt_menulist_index_global=[];
    var digest_temp;
    load_js_var_file_b('filelist',[],fname,sub_import_bigfile_kltxt_b_load_content,true,true);
}

function new_words_lines_kltxt_b(new_min=-1,new_max=-1,rare_min=-1,rare_max=-1){
    function sub_new_words_lines_kltxt_b_check(cslen,csmin,csmax){
        if (csmin>=0 && csmax>=0){
            if (cslen>=csmin && cslen<=csmax){
                return true;
            }
        } else if (csmin>=0){
            if (cslen>=csmin){
                return true;
            }
        } else if (rare_max>=0){
            if (cslen<=csmax){
                return true;
            }
        } else if (csmin<0 && csmax<0){
            return true;
        }
        return false;
    }
    
    function sub_new_words_lines_kltxt_b_arow(){
        if (blxl>=bllen || result_t.length>=blmax){
            document.title=old_title;
            lines_2_html_kltxt_b(result_t);
            new_words_kltxt_b();
            console.log('digest_statistics_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        
        if (!menu_no.has(blxl)){
            let do_push_new=true;
            let do_push_rare=true;
            let new_old_list=get_new_old_rare_words_set_enbook_b(filelist[blxl],is_remove_square,words_type,csendata_set);
            let new_words_length=new_old_list[0].size;
            let rare_words_length=new_old_list[2].size;

            if (!sub_new_words_lines_kltxt_b_check(new_words_length,new_min,new_max)){
                do_push_new=false;
            }
            
            if (do_push_new){
                if (!sub_new_words_lines_kltxt_b_check(rare_words_length,rare_min,rare_max)){
                    do_push_rare=false;
                }
            }
            
            if (do_push_new && do_push_rare){
                result_t.push([filelist[blxl],blxl]);
            //} else {
                //console.log(new_words_length,rare_words_length);  //测试用 - 保留注释
            }
        }
        blxl=blxl+1;
        if (blxl % 10000 == 0){
            document.title=blxl+'/'+bllen+' - '+old_title;
            setTimeout(sub_new_words_lines_kltxt_b_arow,1);
        } else {
            sub_new_words_lines_kltxt_b_arow();
        }
    }
    
    var t0 = performance.now();    

    var start_lineno, end_lineno, blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();
    
    var blxl=start_lineno;
    var bllen=end_lineno;
    var old_title=document.title;
    var menu_no=new Set(menu_no_get_kltxt_b());
    var result_t=[];
    var is_remove_square,words_type,csendata_set;
    [is_remove_square,words_type,csendata_set]=get_new_old_rare_words_para_enbook_b();
    sub_new_words_lines_kltxt_b_arow();
}

function txtmenus_kltxt_b(cstype=''){
    var str_t=klmenu_hide_b('');
    var blparent=menu_parent_node_b(str_t);

    if (cstype=='reader'){
        var jump_list=['txtlistsearch','Search Page'];
    } else {
        var jump_list=['reader','Reader'];
    }
    
    var menu_general=[];
    
    var group_list=[
    [jump_list[1],'search_or_reader_kltxt_b(\''+jump_list[0]+'\');',true],
    ['Card','search_or_reader_kltxt_b(\'reader_card\');',true],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,''));

    var group_list=[
    ['read','bookmarks_get_kltxt_b(false,false);',true],
    ['add','bookmarks_set_kltxt_b();',true],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,'bookmark: '));
        
    menu_general=menu_general.concat([
    '<span id="span_add_zero_reading_lines_txtlistsearch" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 阅读行数补零</span>',
    //'<span class="span_menu" onclick="'+str_t+'new_words_kltxt_b([2],\'exclude\',true);">当前页面不在例句中的生词</span>',
    ]);    

    var group_list=[
    ['当前页面不在例句中的生词','new_words_kltxt_b([2],\'exclude\',true);',true],
    ['摘要中的旧单词','old_words_in_digest_kltxt_b();',true],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['返回阅读页面','getlines_kltxt_b();',true],
    ['溢出调整','content_horizontal_overflow_check_kltxt_b();',true],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['仅有1个新单词','new_words_lines_kltxt_b(1,1);',true],
    ['无新单词','new_words_lines_kltxt_b(0,0);',true],
    ['无新单词且无稀有单词','new_words_lines_kltxt_b(0,0,0,0);',true],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,'行：'));
    
    var group_list=[
    ['枚举','rare_enwords_enumerate_kltxt_b();',true],
    ['搜索','rare_enwords_search_kltxt_b();',true],
    ['例句+生词+','rare_enwords_search_kltxt_b(true,true,true);',true],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,'稀有旧单词：'));
    
    var group_list=[
    ['全部','frequent_new_enwords_kltxt_b();',true],
    ['当前页面','frequent_new_enwords_kltxt_b(true);',true],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,'常见英语生词：'));
    
    menu_general.push(load_sentence_menu_b(str_t,[['最佳','best_sentences_kltxt_b(\'divhtml2\');',true]]));
    
    var group_list=[
    ['汉字生字','find_cn_words_kltxt_b();',true],
    ['⚪ 生词','klmenu_check_b(this.id,true);new_words_kltxt_b();',true,'span_show_new_enwords'],
    ['⚪ 稀有旧单词','klmenu_check_b(this.id,true);new_words_kltxt_b();',true,'span_show_rare_enwords'],
    ['⚪ 旧单词','klmenu_check_b(this.id,true);old_words_kltxt_b();',true,'span_show_old_enwords'],
    ];    
    menu_general.push(menu_container_b(str_t,group_list,'显示：'));
        
    if (is_local_b()){
        menu_general.push('<span class="span_menu" onclick="'+str_t+'klwiki_link_b(\'KL Reading\',true);">KL Reading</span>');
    }

    var menu_dir=[
    '<span class="span_menu" onclick="'+str_t+'findmenu_kltxt_b(-1,-1,a_raw_number_kltxt_b());">查找目录</span>',
    '<span class="span_menu" onclick="'+str_t+'fullmenu_kltxt_b();">all menus</span>',
    '<span class="span_menu" onclick="'+str_t+'fullmenu_kltxt_b(true,\'without_number\');">未定位的目录</span>',
    '<span class="span_menu" onclick="'+str_t+'possible_menu_kltxt_b();">可能的目录</span>',
    ];

    if (cstype!=='reader'){
        var group_list=[
        ['1','menu_insert_kltxt_b(1);',true],
        ['3','menu_insert_kltxt_b(3);',true],
        ['全部','menu_insert_kltxt_b(-1);',true],
        ];    
        menu_dir.push(menu_container_b(str_t,group_list,'显示搜索关键字目录：'));
        
        menu_dir=menu_dir.concat([
        '<span class="span_menu" onclick="'+str_t+'ellipsis_lines_kltxt_b();">未显示的行不足为省略号</span>',
        '<hr />'
        ]);
    }
    var menu_dir_width='14rem';
    var search_list=[];
    
    var group_list=[
    ['AB Search','absearch_kltxt_b();',true],
    ['单一结果','absearch_kltxt_b(\'\',-1,true);',true],
    ];    
    search_list.push(menu_container_b(str_t,group_list,''));

    var group_list=[
    ['提取（不支持AB搜索）','select_array_kltxt_b(\'select\');',true],
    ['删除','select_array_kltxt_b(\'remove\');',true],
    ];    
    search_list.push(menu_container_b(str_t,group_list,'符合条件的记录：'));
    
    search_list=search_list.concat([
    '<span class="span_menu" onclick="'+str_t+'name_form_kltxt_b();">姓名溯源</span>',    
    '<span class="span_menu" onclick="'+str_t+'rearray_kltxt_b();">重新分组</span>',
    '<hr />',
    '<span class="span_menu" onclick="'+str_t+'separate_search_kltxt_b();">分离搜索</span>',    
    ]);

    var menu_config=root_font_size_menu_b(str_t);
    menu_config=menu_config.concat([
    enwords_mini_menu_item_b(str_t),
    '<span class="span_menu" onclick="'+str_t+'float_bookname_kltxt_b();">浮动书名</span>',
    fpara_menu_b(str_t),
    ]);

    if (cstype=='reader'){
        menu_config.push('<span class="span_menu" onclick="'+str_t+'line_no_show_hide_kltxt_b();">段落号隐显</span>');
    }

    if (cstype!=='digest'){
        menu_config.push(idb_menu_generate_bigfile_b('book','select_big_file_book_kltxt',blparent,'import_bigfile_kltxt_b'));
    }
    
    if (cstype!=='reader' && cstype!=='digest'){
        var book_list_file=load_current_book_b(true,false)[0];
        var digest_file=menu_digest_file_full_name_b()[1];
        menu_dir=menu_dir.concat(search_list);
        menu_dir_width='24rem';
        menu_config=menu_config.concat([
        '<a href="'+book_list_file+'" onclick="'+str_t+'" target=_blank>booklist_current_data.js</a>',    
        '<a href="'+digest_file+'" onclick="'+str_t+'" target=_blank>_digest.js</a>',
        '<span class="span_menu" onclick="'+str_t+'innerHTML_2_arr_kltxt_b();">当前内容保存为js arr</span>',            
        ]);
        
        var group_list=[
        ['Help','help_kltxt_b();',true],
        ['页面可编辑','editable_kltxt_b();',true],
        ['断句','break_line_kltxt_b();',true],
        ];
        menu_config.push(menu_container_b(str_t,group_list,''));
        
        var group_list=[
        ['base64','img2base64_kltxt_b();',true],
        ['size','img_size_show_kltxt_b();',false],
        ['resize','img_resize_kltxt_b();',true],
        ];    
        menu_config.push(menu_container_b(str_t,group_list,'img: '));            
    }
    
    var menu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'statistics_kltxt_b();">Statistics</span>',    
    '<span class="span_menu" onclick="'+str_t+'counthz_kltxt_b();">不重复汉字数统计</span>',
    '<span class="span_menu" onclick="'+str_t+'count_characters_kltxt_b();">span.txt_content innterText 字符数统计</span>',
    '<span class="span_menu" onclick="'+str_t+'words_distribution_kltxt_b();" title="格式：搜索关键词1,搜索关键词2|提前剔除关键词1,提前剔除关键词2，如：宝玉,黛玉|甄宝玉">span.txt_content innterText 关键词分回合统计</span>',
    '<span class="span_menu" onclick="'+str_t+'tw_kltxt_b();">繁体字统计</span>',     
    '<span class="span_menu" onclick="'+str_t+'booksthickness_form_kltxt_b();">书的厚度</span>',    
    '<span class="span_menu" onclick="'+str_t+'books_current_table_kltxt_b();">当前书目列表</span>',
    '<a href="../../../../jsdoc_img_and_real_file_compare.htm" onclick="'+str_t+'" target=_blank>jsdoc img and real file compare</a>',    
    ];
    
    var menu_digest=[
    '<span class="span_menu" onclick="'+str_t+'reading_mode_kltxt_b();">进入阅读状态</span>',    
    '<span class="span_menu" onclick="'+str_t+'digest_temp_add_kltxt_b();">添加临时摘要</span>',
    '<span class="span_menu" onclick="'+str_t+'digest_excluded_kltxt_b();">查看未包含或重复的摘要</span>',
    '<span class="span_menu" onclick="'+str_t+'digest_statistics_kltxt_b();">摘要分布统计</span>',
    '<span class="span_menu" onclick="'+str_t+'digest_sort_kltxt_b();">按文章顺序重新生成不重复的摘要</span>',    
    '<span class="span_menu" onclick="'+str_t+'wiki_style_kltxt_b();">当前页面WIKI格式生成</span>',
    ];
    
    var group_list=[
    ['全部','digest_lines_kltxt_b();',true],
    ['最新的500条','digest_lines_kltxt_b(500);',true],
    ['跳转到最新的10条并进入阅读模式','digest_lines_kltxt_b(10,true,true);',true],
    ];    
    menu_digest.push(menu_container_b(str_t,group_list,'显示摘要段落：'));        
    
    var color_menu=colors_menu_b('change_colors_kltxt_b',['default']);
    
    //recent opened books - 保留注释
    var list_t=recent_opened_book_get_kltxt_b();
    var book_menu=[];

    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        book_menu.push('<a onclick="'+str_t+'" href="txtlistsearch.htm?'+item[0]+'"><small>'+(blxl+1)+'. '+item[1]+'</small></a>');
    }
        
    var fontsize=(ismobile_b()?'0.9rem':'1rem');
    var bljg='';
    var colors=klmenu_b(color_menu,'🎨',(ismobile_b()?'16rem':'20rem'),'',fontsize,'20rem');
    if (cstype!=='digest'){
        bljg=bljg+klmenu_b(menu_general,'','27rem','',fontsize);
        bljg=bljg+klmenu_b(menu_dir,'🔍',menu_dir_width,'',fontsize);
        bljg=bljg+klmenu_b(menu_digest,'🖊','34rem','',fontsize);       
        bljg=bljg+colors;
        bljg=bljg+klmenu_b(menu_config,'⚙','22rem','',fontsize);
        if (cstype!=='reader'){
            bljg=bljg+klmenu_b(menu_statistics,'🧮','24rem','',fontsize);
        }
        bljg=bljg+klmenu_b(book_menu,'📚','15rem','',fontsize);        
    } else {
        var dmenu_info=[
        '<span class="span_menu" onclick="'+str_t+'date_size_digest();">当前摘要文件日期和大小</span>',    
        '<span class="span_menu" onclick="'+str_t+'date_size_digest(true);">无摘要文件列表</span>',    
        enwords_mini_menu_item_b(str_t),        
        ];   
        bljg=bljg+klmenu_b(dmenu_info,'🗃','15rem','',fontsize);        
        bljg=bljg+colors;
    }
    bljg=bljg+'<span id="span_for_more_menu_kltxt"></span>';
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(bljg,'','0rem')+' ');
}

function content_horizontal_overflow_check_kltxt_b(){
    var ocontainer=document.getElementById('divhtml');
    var ospans=ocontainer.querySelectorAll('span.txt_content');
    doms_horizontal_overflow_check_b(ocontainer,ospans);
}

function old_words_in_digest_kltxt_b(){
    get_new_words_arr_set_enbook_b(4,Array.from(digest_special_raw_global['*']).join(' '),'divhtml')
}

function line_no_show_hide_kltxt_b(is_dry=false,ocontainer=false){
    var ospans=container_query_doms_get_kltxt_b('span.txtsearch_kltxt_lineno',ocontainer);
    if (ospans.length==0){return false;}
    
    if (is_dry){
        return ospans[0].style.display;
    }
    
    var bldisplay=(ospans[0].style.display=='none'?'':'none');
    for (let one_span of ospans){
        one_span.style.display=bldisplay;
    }
}

function rare_enwords_enumerate_kltxt_b(){
    var result_t=get_new_old_rare_words_set_enbook_b(filelist.join('\n'),false,true)[2];
    document.getElementById('divhtml').innerHTML=new_old_words_html_enbook_b(result_t,'稀有旧单词','',false,new Set(),true,true);
}

function img2base64_kltxt_b(){
    var oimgs=document.querySelectorAll('#divhtml img');
    img2base64_b(oimgs,'');
}

function name_form_kltxt_b(){
    var bljg='<textarea id="textarea_name_kltxt" style="height:20rem;"></textarea>';

    bljg=bljg+'<p>';
    bljg=bljg+close_button_b('divhtml2','')+' ';
    bljg=bljg+'最大间隔数：<input type="number" id="input_max_interval_name_kltxt" value=10 /> ';
    bljg=bljg+'<span class="aclick" onclick="cn_get_kltxt_b();">提取汉字</span> ';
    bljg=bljg+'<span class="aclick" onclick="name_sort_kltxt_b();">排序</span> ';
    bljg=bljg+'<span class="aclick" onclick="name_unique_kltxt_b();">unique</span> ';
    bljg=bljg+'<span class="aclick" onclick="name_remove_surname_kltxt_b();">剔除行首1个字符</span> ';
    bljg=bljg+'<span class="aclick" onclick="name_remove_single_kltxt_b();">剔除单字</span> ';    
    bljg=bljg+'<span class="aclick" onclick="name_search_kltxt_b();">溯源</span> ';
    bljg=bljg+textarea_buttons_b('textarea_name_kltxt','全选,清空,复制')+'</p>';
    bljg=bljg+'<div id="div_name_kltxt"></div>';

    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML='<div style="margin:0.5rem;">'+bljg+'</div>';
    input_size_b([['input_max_interval_name_kltxt',5]],'id');
    
    odiv.scrollIntoView();
}

function name_sort_kltxt_b(){
    if (!confirm('是否排序？')){return;}
    var otextarea=document.getElementById('textarea_name_kltxt');
    var list_t=otextarea.value.trim().split('\n');
    list_t.sort(zh_sort_b);
    otextarea.value=list_t.join('\n');
}

function name_unique_kltxt_b(){
    if (!confirm('是否剔除重复行？')){return;}

    var otextarea=document.getElementById('textarea_name_kltxt');
    var list_t=otextarea.value.trim().split('\n');
    var len_old=list_t.length;
    
    list_t.sort();
    var result_t=[];
    var duplicate=[];
    var current='';
    for (let item of list_t){
        if (item==current){
            duplicate.push(item);
        } else {
            result_t.push(item);
            current=item;
        }
    }
    otextarea.value=result_t.join('\n');
    alert('剔除前行数：'+len_old+'，剔除后行数：'+result_t.length+'，重复项('+duplicate.length+')：'+duplicate.slice(0,100).join('\n'));
}

function name_remove_single_kltxt_b(){
    if (!confirm('是否剔除单字？')){return;}

    var otextarea=document.getElementById('textarea_name_kltxt');
    var list_t=otextarea.value.trim().split('\n');
    var len_old=list_t.length;    
    var result_t=[];
    for (let item of list_t){
        if (item.length>1){
            result_t.push(item);
        }
    }
    otextarea.value=result_t.join('\n');
    alert('剔除前行数：'+len_old+'，剔除后行数：'+result_t.length);
}

function name_remove_surname_kltxt_b(){
    if (!confirm('是否剔除行首1个字符？')){return;}

    var otextarea=document.getElementById('textarea_name_kltxt');
    var list_t=otextarea.value.trim().split('\n');
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]=list_t[blxl].slice(1,);
    }
    otextarea.value=list_t.join('\n');
}

function cn_get_kltxt_b(){
    var otextarea=document.getElementById('textarea_name_kltxt');
    var blstr=otextarea.value.trim();
    var list_t=blstr.match(/[^\x00-\xff]+/g) || [];
    if (list_t.length==0){return;}
    if (!confirm('发现汉字 '+list_t.length+' 个，是否替换当前编辑框内容？')){return;}
    otextarea.value=list_t.join('\n');
}

function name_search_kltxt_b(){
    function sub_name_search_kltxt_b_one_row(){
        if (blxl>=bllen){
            var blno=0;
            var bljg=[];
            var not_found=[];
            for (let key in result_t){
                if (result_t[key].size==0){
                    not_found.push(key.slice(2,));
                    continue;
                }
                
                bljg.push('<h3>'+(blno+1)+'. '+key.slice(2,)+'</h3><div style="margin:1rem;">'+array_2_li_b(Array.from(result_t[key]),'li','ol','ol_name_kltxt_'+blno)+'</div>');
                high_light_list.push([key.slice(2,).match(/[^\x00-\xff]/g) || [],'ol#ol_name_kltxt_'+blno+' li']);
                blno=blno+1;
            }
            odiv.innerHTML=bljg.join('\n')+'<hr /><h3>not found('+not_found.length+')</h3><textarea onclick="this.select();document.execCommand(\'copy\');">'+not_found.join('\n')+'</textarea><hr /><h3>error('+error_list.length+')</h3>'+array_2_li_b(error_list);
            for (let item of high_light_list){
                highlight_text_b(item[0],item[1])
            }
            
            return;
        }

        var blkey='n_'+name_list[blxl];
        var blname=name_list[blxl].replace(/([^\x00-\xff])/g,'$1'+interval_str);
        if (blname.slice(interval_str_len,)==interval_str){
            blname=blname.slice(0,interval_str_len);
        }
        
        try {
            for (let arow of filelist){
                if (arow.match(new RegExp(blname,'g'))==null){continue;}
                result_t[blkey].add(arow);
            }
        } catch (error){
            console.log(error);
            error_list.push(error.toString());
        }
        
        if (blxl % 100 == 0){
            odiv.innerHTML=(blxl+1)+'/'+bllen;
        }
        blxl=blxl+1;
        setTimeout(sub_name_search_kltxt_b_one_row,1);
    }
    

    var blinterval=parseInt(document.getElementById('input_max_interval_name_kltxt').value.trim());
    var interval_str='.{0,'+blinterval+'}';
    var interval_str_len=-1*interval_str.length;
    var result_t={};

    var list_t=array_unique_b(document.getElementById('textarea_name_kltxt').value.trim().split('\n'));
    list_t.sort(zh_sort_b);
    var name_list=[];
    for (let item of list_t){
        item=item.trim();
        if (item.length<2){continue;}
        name_list.push(item);
        result_t['n_'+item]=new Set();
    }

    var blxl=0;
    var bllen=name_list.length;

    var error_list=[];
    var high_light_list=[];
    var odiv=document.getElementById('div_name_kltxt');
    sub_name_search_kltxt_b_one_row();
}

function innerHTML_2_arr_kltxt_b(){
    var ospans=document.querySelectorAll('div#divhtml span.txt_content');
    var result_t=[];
    for (let one_span of ospans){
        result_t.push('"'+specialstr_j(one_span.innerHTML)+'",');
    }
    
    var left_strings='<p>'+close_button_b('divhtml2','');
    var blstr=textarea_with_form_generate_b('textarea_innerhtml_arr_kltxt','height:15rem;',left_strings,'全选,复制,save as js file,发送到临时记事本,发送地址','</p>','','',false,'var filelist=[\n'+result_t.join('\n')+'\n];\n',false,'','aclick',true,'margin:0.5rem');

    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=blstr;
    odiv.scrollIntoView();
}

function img_size_show_kltxt_b(){
    var oimgs=document.querySelectorAll('#divhtml img');
    var bljg=imgs_min_max_size_b(oimgs);
    if (bljg!==''){
        alert(bljg);
    }
}

function img_resize_kltxt_b(){
    var oimgs=document.querySelectorAll('#divhtml img');    
    resize_batch_imgs_b(oimgs,false,'');
}

function words_distribution_kltxt_b(keep_list=false,replace_list=false,cshighlight=-1){
    function sub_words_distribution_kltxt_b_h4(){
        let str_list=[];
        for (let arow of statistics_list){
            str_list.push(arow[1].toString());
            let oh4=document.getElementById('h4_kltxt_'+arow[0]);
            if (oh4){
                oh4.insertAdjacentHTML('beforeend','<span style="font-size:small;word-break:break-all;word-wrap:break-word;">('+arow[1]+')</span>');
            }
        }
        console.log(str_list.join('\n'));
    }
    
    function sub_words_distribution_kltxt_b_calculate(new_no=-1){
        if (current_menu_no>=0){
            keep_dict=object2array_b(keep_dict,true,2);
            statistics_list.push([current_menu_no,keep_dict]);
        }
        current_menu_no=new_no;
        sub_words_distribution_kltxt_b_dict_ini();
    }
    
    function sub_words_distribution_kltxt_b_dict_ini(){
        keep_dict={};
        for (let key of keep_list){
            keep_dict['k_'+key]=0;
        }
    }
    
    function sub_words_distribution_kltxt_b_one_step(){
        if (blxl>bllen){
            sub_words_distribution_kltxt_b_calculate();
            
            odiv.innerHTML=result_t.join('\n');
            sub_words_distribution_kltxt_b_h4();
            if (cshighlight===-1){
                cshighlight=document.getElementById('input_highlight')?.checked || false;
            }
            if (cshighlight){
                highlight_text_b(keep_list);
            }
            return;
        }
        
        getlines_kltxt_b(blxl,blstep,true,false,false,false,false);
        var ospans=odiv.querySelectorAll('span.txt_content');
        
        for (let one_span of ospans){
            var blstr=one_span.innerText.trim();

            var ono=one_span.parentNode.querySelector('span.txtsearch_kltxt_lineno');
            if (ono){
                var blno=parseInt(ono.innerText.slice(1,-1));
                if (menu_no_list.includes(blno-1)){
                    sub_words_distribution_kltxt_b_calculate(blno-1);
                    result_t.push('<h4 id="h4_kltxt_'+(blno-1)+'">'+blstr+'</h4>');
                    is_started=true;
                    continue;
                }
            }
        
            for (let item of replace_list){
                blstr=blstr.replace(new RegExp(item,'g'),'▢'.repeat(item.length));
            }
            
            var match_list=blstr.split(new RegExp('('+keep_list.join(')|(')+')'));
            for (let one_phrase of match_list){
                if (one_phrase == undefined){continue;}
                if (keep_list.includes(one_phrase)){
                    keep_dict['k_'+one_phrase]=keep_dict['k_'+one_phrase]+1;
                    continue;
                }
                blstr=blstr.replace(one_phrase,'▢'.repeat(one_phrase.length))
            }
            
            result_t.push('<p style="line-height:120%; margin:0.5rem 0;font-size:small;word-break:break-all;word-wrap:break-word;"><span class="txt_content">'+blstr+'</span></p>');
        }      
                
        blxl=blxl+blstep;
        setTimeout(sub_words_distribution_kltxt_b_one_step,200);
    }
    //-----------------------
    if (keep_list===false){
        let list_t=document.getElementById('input_search').value.trim().split('|');
        keep_list=list_t[0].split(',');
        if (replace_list===false && list_t.length>1){
            replace_list=list_t[1].split(',');
        }
    }
    if (replace_list===false){
        replace_list=[];
    }
    
    var bllen=filelist.length;
    var blxl=1;
    var blstep=250;
    var odiv=document.getElementById('divhtml');
    var result_t=[];
    var keep_dict={};
    sub_words_distribution_kltxt_b_dict_ini();
    var is_started=false;
    var statistics_list=[];
    var current_menu_no=-1;
    var menu_no_list=array_split_by_col_b(kltxt_menulist_index_global,[0]);
    sub_words_distribution_kltxt_b_one_step();
}

function count_characters_kltxt_b(){
    function sub_count_characters_kltxt_b_one_step(){
        if (blxl>bllen){
            for (let key in total_dict){
                result_t.push(key+': '+total_dict[key]);
            }
            odiv.innerHTML=array_2_li_b(result_t);
            return;
        }
        getlines_kltxt_b(blxl,blstep,true,false,false,false,false);
        var ospans=odiv.querySelectorAll('span.txt_content');
        
        var page_dict={'len':0,'cn':0,'enc':0,'enw':0,'numc':0,'numw':0};
        for (let one_span of ospans){
            var blstr=one_span.innerText.trim();
            page_dict['len']=page_dict['len']+blstr.length;
            
            var cn_count=(blstr.match(/[^\x00-\xff]/g) || []).length;
            page_dict['cn']=page_dict['cn']+cn_count;

            var enc=(blstr.match(/[a-z]/ig) || []).length;
            page_dict['enc']=page_dict['enc']+enc;
            
            var enw=(blstr.match(/[a-z]{2,}/ig) || []).length;
            page_dict['enw']=page_dict['enw']+enw;

            var num=(blstr.match(/[0-9]/g) || []).length;
            page_dict['numc']=page_dict['numc']+num;            

            var num=(blstr.match(/[0-9]+/g) || []).length;
            page_dict['numw']=page_dict['numw']+num;                        
        }
        
        for (let key in total_dict){
            total_dict[key]=total_dict[key]+page_dict[key];
        }
        
        page_dict=object2array_b(page_dict,true);
        result_t.push(blxl+'-'+(blxl+blstep)+': '+page_dict);
        
        blxl=blxl+blstep;
        setTimeout(sub_count_characters_kltxt_b_one_step,200);
    }
    //-----------------------
    var bllen=filelist.length;
    var blxl=1;
    var blstep=250;
    var total_dict={'len':0,'cn':0,'enc':0,'enw':0,'numc':0,'numw':0};
    var odiv=document.getElementById('divhtml');
    var result_t=[];
    sub_count_characters_kltxt_b_one_step();
}

function wiki_style_kltxt_b(){
    getlines_kltxt_b(false,false,false,true,true,true);
    var ospans=document.querySelectorAll('div#divhtml span.txtsearch_kltxt_lineno');
    for (let one_span of ospans){
        one_span.outerHTML='';
    }
    
    ospans=document.querySelectorAll('div#divhtml span.txt_content');
    for (let one_span of ospans){
        one_span.outerHTML=one_span.innerHTML;
    }
}

function frequent_new_enwords_kltxt_b(is_current_page=false){
    if (is_current_page){
        var ospans=document.querySelectorAll('#divhtml span.txt_content');
        var csarr=[];
        for (let one_span of ospans){
            csarr.push(one_span.innerText);
        }
    } else {
        var csarr=filelist;
    }
    document.getElementById('divhtml').innerHTML='<h3>统计中...</h3>';
    setTimeout(function (){frequency_words_enbook_b(csarr);},1);
}

function editable_kltxt_b(){
    var odiv=document.getElementById('divhtml');
    if (!odiv){return;}
    if (odiv.getAttribute('contenteditable')=='true'){
        odiv.setAttribute('contenteditable','false');
    } else {
        odiv.setAttribute('contenteditable','true');
    }
}

function books_current_table_kltxt_b(){
    var list_t=[];
    var bookname_list=[];
    var bookpath_list=[];
    list_t.push(array_2_li_b(['id','name','tag','no','type'],'th','tr'));
    for (let item of csbooklist_sub_global){
        if (item[0]==csbookname_global){
            var highheight_row=[].concat(item);
            highheight_row[0]='<span id="span_current_book_id" style="background-color:'+scheme_global['pink']+';">'+highheight_row[0]+'</span>';
            list_t.push(array_2_li_b(highheight_row,'td','tr'));
        } else {
            list_t.push(array_2_li_b(item,'td','tr'));
        }
        bookname_list.push(item[1]);
        if (item[3]=='3'){
            bookpath_list.push('~/klwebphp/PythonTools/data/selenium_news/jsdoc'+item[3]+'/'+item[0]+'.js');
        } else {
            bookpath_list.push('~/jsdoc/jsdoc'+item[3]+'/'+item[0]+'.js');
        }
    }
    bookpath_list.sort();
    
    var bljg='<table class="table_common" cellpadding=0 cellspacing=0>'+list_t.join('\n')+'</table>';

    bljg=bljg+'<textarea name="textarea_booknamelist" id="textarea_booknamelist" style="height:15rem;">';
    bljg=bljg+bookname_list.join('\n')+'\n';
    bljg=bljg+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+textarea_buttons_b('textarea_booknamelist','全选,清空,复制');
    bljg=bljg+'</p>';

    bljg=bljg+'<textarea name="textarea_bookpathlist" id="textarea_bookpathlist" style="height:15rem;">';
    bljg=bljg+bookpath_list.join('\n')+'\n';
    bljg=bljg+'</textarea>';
    bljg=bljg+'<p><span class="aclick" onclick="document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span>';    
    bljg=bljg+textarea_buttons_b('textarea_bookpathlist','全选,清空,复制');
    bljg=bljg+'</p>';
    
    document.getElementById('divhtml2').innerHTML=bljg;
    fix_divhtml2_kltxt_b(false);
    var ospan=document.getElementById('span_current_book_id');
    if (ospan){
        ospan.scrollIntoView();
    } else {
        location.href='#divhtml2';
    }
}

function fullmenu_kltxt_b(is_simple=true,cstype='all',sort_by_rows=false){
    function sub_fullmenu_kltxt_one_title(cstitle,csxl,is_simple,cstype){
        let blstyle='';
        let href='';
        if (is_simple){
            let blcount=(cstitle.match(/^=+\s/) || [' '])[0].length-1;
            if (blcount>0 && (cstitle.match(/\s=+$/) || [' '])[0].length-1==blcount){
                blstyle=' style="font-size:'+Math.max(0.7,(1.7-blcount/5))+'rem;"';
                cstitle=cstitle.slice(blcount+1,-1*blcount-1);
                if (cstitle.match(/^\[https?:\/\/[^\s]+\s.*\]$/g)!==null){
                    href=cstitle.replace(/^\[(https?:\/\/[^\s]+)\s(.*)\]$/g,'$1');            
                    href='<a href="'+href+'" class="a_box a_menu_link_txtbook" style="font-size:0.8rem;" onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';" target=_blank>'+href+'</a> ';
                    cstitle=cstitle.replace(/^\[(https?:\/\/[^\s]+)\s(.*)\]$/g,'$2');
                }
            }
        }
        let line_number,interval;
        [line_number,interval]=sub_fullmenu_kltxt_b_id_2_line_number(cstitle,csxl);
        let bljg='<span class="span_link"'+blstyle+' onclick="findmenu_kltxt_b('+csxl+');" style="text-decoration:none;">'+cstitle+'</span> '+href+line_number;
        if (cstype=='' || cstype=='all'){
            return [bljg,interval];
        } else if (cstype=='without_number' && line_number=='' || cstype=='with_number' && line_number!==''){
            return [bljg,interval];
        } else {
            return ['',interval];
        }
    }
    
    function sub_fullmenu_kltxt_b_id_2_line_number(cstitle,csxl){
        let interval=0;
        
        for (let blno=0;blno<menulist_len;blno++){
            let item=kltxt_menulist_index_global[blno];
            if (item[1]==csxl){
                if (blno<menulist_len-1){
                    interval=kltxt_menulist_index_global[blno+1][0]-item[0];    //相邻目录所在行的行号相减 - 保留注释
                } else if (blno==menulist_len-1){
                    interval=filelist.length-kltxt_menulist_index_global[blno][0]+1;
                }
                
                let blhref=array_unique_b(cstitle.match(/([^\x00-\xff]{2,}|[a-z0-9]{2,})/ig) || []);
                blhref='+'+encodeURIComponent(blhref.join(' +'));
                
                return ['<span style="color:'+scheme_global['memo']+';font-size:0.9rem;">(<span onclick="getlines_kltxt_b('+item[0]+');" style="cursor:pointer;" title="跳转到第'+(item[0]+1)+'行">'+(item[0]+1)+'</span>, <a href="?_tag'+csbookname_global+'&s1='+blhref+'" style="color:'+scheme_global['memo']+';text-decoration:none;" target=_blank title="搜索链接">'+interval+'rows</a>)</span>',interval];
            }
        }
        return ['',interval];
    }
    //-----------------------
	var bljg=[];
    var menulist_len=kltxt_menulist_index_global.length;
    
    if (csbookname_global.substring(0,6)=='klwiki'){
        for (let blxl=0,lent=menulist.length;blxl<lent;blxl++){
            if (menulist[blxl].substring(0,7)=='<title>' && menulist[blxl].slice(-8)=='</title>'){
                var one_menu=sub_fullmenu_kltxt_one_title(menulist[blxl].substring(7,menulist[blxl].length-8),blxl,is_simple,cstype);
                if (one_menu[0]!==''){
                    bljg.push(one_menu);
                }
            } else {
                var one_menu=sub_fullmenu_kltxt_one_title(menulist[blxl],blxl,is_simple,cstype);
                if (one_menu[0]!==''){
                    bljg.push(one_menu);
                }
            }
        }
    } else {
        for (let blxl=0,lent=menulist.length;blxl<lent;blxl++){
            var one_menu=sub_fullmenu_kltxt_one_title(menulist[blxl],blxl,is_simple,cstype);
            if (one_menu[0]!==''){
                bljg.push(one_menu);
            }
        }
    }
    
    var input_str='<p>';
    input_str=input_str+'<input type="text" id="input_fullmenu_filter_kltxt" onkeyup="if (event.key==\'Enter\'){fullmenu_filter_kltxt_b(this.value);}">\n';
    input_str=input_str+'<span class="aclick" onclick="fullmenu_kltxt_b('+!is_simple+',\''+cstype+'\');">swith to: '+(is_simple?'RAW':'Simple')+'</span>';
    if (!sort_by_rows){
        input_str=input_str+'<span class="aclick" onclick="fullmenu_kltxt_b('+is_simple+',\''+cstype+'\',true);">current: sort by rows</span>';
    } else {
        input_str=input_str+'<span class="aclick" onclick="fullmenu_kltxt_b('+is_simple+',\''+cstype+'\',false);">current</span>';    
    }
    
    input_str=input_str+'</p>';
    
    if (sort_by_rows){
        bljg.sort(function (a,b){return a[1]>b[1]?-1:1;});
    }
    bljg=array_split_by_col_b(bljg,[0]);
    
	document.getElementById('divhtml').innerHTML=input_str+array_2_li_b(bljg,'li','ol','ol_fullmenu_filter_kltxt');
    input_with_x_b('input_fullmenu_filter_kltxt',15);
}

function fullmenu_filter_kltxt_b(csstr){
    var olis=document.querySelectorAll('ol#ol_fullmenu_filter_kltxt li');
    obj_search_show_hide_b(olis,'',csstr);
}

function ellipsis_lines_kltxt_b(){
    var op=document.querySelector('p.p_ellipsis');
    if (op){return;}
    
    var ospans=txtsearch_kltxt_lineno_doms_get_kltxt_b();
    for (let one_pair of ospans){
        if (one_pair[1]+1==one_pair[3]){continue;}    
        if (!one_pair[0]){continue;}
        one_pair[0].parentNode.insertAdjacentHTML('afterend','<p class="p_ellipsis">……</p>');        
    }
}

function txtsearch_kltxt_lineno_doms_get_kltxt_b(){
    var result_t=[];
    var ospans=document.querySelectorAll('div#divhtml span.txtsearch_kltxt_lineno');
    if (ospans.length==0){return [];}

    var blcurrent=parseInt(ospans[0].innerText.replace(/[\(\)]/g,''));    
    result_t.push([false,0,ospans[0],blcurrent]);
    
    for (let blxl=0,lent=ospans.length-1;blxl<lent;blxl++){
        var blcurrent=parseInt(ospans[blxl].innerText.replace(/[\(\)]/g,''));
        var blnext=parseInt(ospans[blxl+1].innerText.replace(/[\(\)]/g,''));
        if (isNaN(blcurrent) || isNaN(blnext)){continue;}
        result_t.push([ospans[blxl],blcurrent,ospans[blxl+1],blnext]);
    }
    return result_t;
}

function menu_insert_kltxt_b(menu_count=3){
    function sub_menu_insert_kltxt_b_one_title(title_name,line_no){
        var bljg=p_style+'<span class="span_inserted_menu" style="font-weight:bold;font-size:1.5rem;">'+title_name+'</span> ';
        bljg=bljg+'<span class="txtsearch_kltxt_lineno" id="txtsearch_kltxt_lineno_'+(line_no+1)+'" style="cursor:pointer;font-style: italic;color:'+scheme_global['shadow']+';'+bldisplay+'" onclick="getlines_kltxt_b('+(line_no+1)+');">('+(line_no+1)+')</span></p>';    
        name_list.push([title_name,line_no]);
        return bljg;
    }
    
    function sub_menu_insert_kltxt_b_one_range(no_current,no_next){
        var in_range=[];
        var title_no=false;
        for (let one_no of menu_no){
            if (no_current>=0 && one_no<=no_current){continue;}
            if (one_no==no_next){
                title_no=one_no;
                continue;
            }
            if (one_no>no_next){continue;}
            in_range.push(one_no);
        }
        in_range.sort(function (a,b){return a>b ? 1 : -1;});        
        if (menu_count>0){
            in_range=in_range.slice(-1*menu_count,);
        }
        return [in_range,title_no];
    }
    
    function sub_menu_insert_kltxt_b_one_insert(in_range,odom,csposition='beforebegin'){
        for (let blno of in_range){
            if (filelist[blno].substring(0,7)=='<title>' && filelist[blno].slice(-8,)=='</title>'){
                var title_name=filelist[blno].slice(7,-8);
            } else {
                var title_name=filelist[blno];
            }
            menu_no.delete(blno);
            var bljg=sub_menu_insert_kltxt_b_one_title(title_name,blno);
            if (csposition=='outerHTML'){
                odom.parentNode.outerHTML=bljg;
            } else {
                odom.parentNode.insertAdjacentHTML(csposition,bljg);
            }
        }
    }
    //-----------------------
    var omenu=document.querySelector('span.span_inserted_menu');
    if (omenu){return;}

    var menu_no=new Set(menu_no_get_kltxt_b());
    
    if (menu_no.size==0){return;}

    var ospans=txtsearch_kltxt_lineno_doms_get_kltxt_b();
    if (ospans.length==0){return;}

    var p_style='<p class="p_inserted_menu" style="padding:0.5rem 0; border-top:0.2rem dotted '+scheme_global['memo']+'; border-bottom:0.2rem dotted '+scheme_global['memo']+';">';
    var bldisplay='display:'+(checkbox_value_get_b('check_hide_lineno',true)?'none':'')+';';
    
    var span_nos=[];
    var title_list=[];
    var name_list=[];

    var in_range,title_no;
    for (let one_pair of ospans){
        [in_range,title_no]=sub_menu_insert_kltxt_b_one_range(one_pair[1]-1,one_pair[3]-1);
        sub_menu_insert_kltxt_b_one_insert(in_range,one_pair[2]);
        if (title_no!==false){
            title_list.push([[title_no],one_pair[2]]);  //[[no],ospan] - 保留注释
            menu_no.delete(title_no);
        }
    }
    
    if (menu_count<=0){
        in_range=Array.from(menu_no);
        in_range.sort(function (a,b){return a<b ? 1 : -1;});
        sub_menu_insert_kltxt_b_one_insert(in_range,ospans[ospans.length-1][2],'afterend');        
    }
    
    for (let item of title_list){
        sub_menu_insert_kltxt_b_one_insert(item[0],item[1],'outerHTML');    //最后处理，否则 span.odom.parentNode.outerHTML 修改后，找不到 span - 保留注释
    }
    name_list.sort(function (a,b){return a[1]>b[1]?1:-1;});
    for (let blxl=0,lent=name_list.length;blxl<lent;blxl++){
        name_list[blxl]='<span class="span_box" onclick="inserted_menu_seek_kltxt_b(this.innerText);">'+name_list[blxl][0].replace(/^(=+)(.*?)(=+)$/g,'<span style="font-size:0.1rem;">$1</span>$2<span style="font-size:0.1rem;">$3</span>')+'</span>';
    }
    
    var close_button='<p>'+close_button_b('section_inserted_menu_kltxt','')+'</p>';
    var osection=document.getElementById('section_inserted_menu_kltxt');
    if (!osection){
        document.body.insertAdjacentHTML('beforeend','<section id="section_inserted_menu_kltxt" style="position:fixed;top:10%;right:1%;max-width:20%;max-height:70%;overflow:scroll;background-color:'+scheme_global['button']+'; padding:0.1rem; z-index:1;" onmouseover="this.style.opacity=0.9;" onmouseout="this.style.opacity=0.5;"></section>');
    }
    osection=document.getElementById('section_inserted_menu_kltxt');
    osection.innerHTML=close_button+array_2_li_b(name_list,'li','ol','','','font-size:0.8rem;margin-bottom:0.2rem;')+close_button;
}

function inserted_menu_seek_kltxt_b(csstr){
    var ospans=document.querySelectorAll('#divhtml span.span_inserted_menu');
    for (let one_span of ospans){
        if (one_span.innerText==csstr){
            one_span.scrollIntoView();
            break;
        }
    }
}

function create_menulist_kltxt_b(value=0){
	var len_t=menulist.length;
	if (len_t<1){return;}
	var oselect=document.getElementById('select_menu');
    if (!oselect){return;}
    
    var klwiki_t=false;
    if (csbookname_global.substring(0,6)=='klwiki'){
         klwiki_t=true;
    }

	var bljg='';
	var step_t=Math.max(parseInt(len_t/1000),1);
	if (len_t>1000){
		bljg=bljg+'<option>共有目录项'+len_t+'个，显示了一部分目录</option>\n';
	}
	for (let blxl=0;blxl<len_t;blxl=blxl+step_t){
		if (menulist[blxl]==''){continue;}
        var menuitem_t=menulist[blxl];
        if (klwiki_t){
            if (menuitem_t.substring(0,7)=='<title>' && menuitem_t.slice(-8)=='</title>'){
                menuitem_t=menuitem_t.substring(7,menuitem_t.length-8)
		    }
        }
		if (value==blxl){
			bljg=bljg+'<option value="'+blxl+'" selected>'+menuitem_t+'</option>\n';
		} else {
			bljg=bljg+'<option value="'+blxl+'">'+menuitem_t+'</option>\n';
		}
	}
    oselect.innerHTML=bljg;
}

function counthz_kltxt_b(){
    var t0 = performance.now();
	var hz_t=new Set();
	var bd_t='　，、！？。“”《》；：（）．…‘’〈〉／％※□ －—･【】℃＞～∶○―「」';
	bd_t=bd_t+'０１２３４５〔〕•∕─①②［］＿→↗↘＋③④⑤⑥｀   –﹙﹚『』﹝﹞';
	bd_t=bd_t+'＊＆＝▲６７８⒄〖〗＜■◎●〓々⑩⑦⑧⑨﹔ＡＧⅠⅡⅢＯＶＸετāⅣα';
	bd_t=bd_t+'ɑɒʤəɜɪŋɔʃʊʌʒβθˌ⇒❶❷❸❹❺';

	var start_lineno, end_lineno, blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();
    
	for (let blxl=start_lineno;blxl<end_lineno;blxl++){
		var blhzs_t=filelist[blxl].match(/[^\x00-\xff]/g);
		if (blhzs_t){
			for (let blxl2=0,lent=blhzs_t.length;blxl2<lent;blxl2++){
				if (!bd_t.includes(blhzs_t[blxl2])){
					hz_t.add(blhzs_t[blxl2]);
				}
			}
		}
	}
    hz_t=Array.from(hz_t);
	hz_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
	
	var blcount=0;
	var out_3500_t=[];
	for (let item of hz_t){
		if (hz_3500_global.includes(item) || hz_easy_global.includes(item)){
            blcount=blcount+1;
        } else {
            out_3500_t.push(item);
        }
	}
	
    var bljg='<p><b>不重复汉字数：'+hz_t.length+' 其中常用汉字：'+blcount+' 占 '+(blcount*100/hz_t.length).toFixed(2)+'%</b></p>';
    bljg=bljg+'<p>'+hz_t.join(' ')+'</p><p><b>其中非常用汉字：</b></p><p id="p_uncommon_zh_words">'+out_3500_t.join(' ')+'</p>';
    document.getElementById('divhtml').innerHTML=bljg;

    console.log('counthz_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function separate_search_kltxt_b(key_list=false){    
    if (key_list==false){
        key_list=document.getElementById('input_search').value.trim().split(' ');
    }
    if (typeof key_list == 'string'){
        key_list=key_list.split(' ');
    }
	klwiki_syntaxhighlight_global=false;   
    
    var start_lineno, end_lineno, csmaxlines;
    [start_lineno, end_lineno, csmaxlines]=start_end_lineno_kltxt_b();
	var cshideno=document.getElementById('check_hide_no').checked;
    
    var result_t=[];
    var reg_default=document.getElementById('input_reg').checked;
    var is_group_file=is_group_file_kltxt_b();
    for (let aword of key_list){
        var is_reg=reg_default;
        [aword,is_reg]=str_reg_check_b(aword,is_reg);    
        var tmp_t=txtsearch_list_kltxt_b(aword,is_reg,csmaxlines,start_lineno,end_lineno,false);
        if (tmp_t.length==0){continue;}
    	var bljg=format_lines_kltxt_b(tmp_t,'',-1,is_group_file);
        result_t.push('<h3>'+aword+'</h3>\n'+bljg);
    }

    var odiv = document.getElementById('divhtml');
    if (cshideno){
        odiv.innerHTML='<div>'+result_t.join('\n')+'</div>';
    } else {
        odiv.innerHTML='<ol>'+result_t.join('\n')+'</ol>';
    }
    bible_title_link_generate_kltxt_b();
    render_html_kltxt_b(key_list);
}

function bible_title_link_generate_kltxt_b(){
    if (book_type_check_kltxt_b()!=='bible'){return;}
    load_fn_b('link_generate_kltxt_bible',function (){eval('link_generate_kltxt_bible()');});
}

function booksthickness_form_kltxt_b(){
	document.getElementById('divhtml').innerHTML='<p>导入书籍js文件名和大小数据：<textarea id="textarea_books_thickness"></textarea><p>被比较书籍：<input type="text" id="input_compared_book" size="15" style="margin-left:15px; margin-bottom:5px;"> <span class="aclick" onclick="get_books_thickness_kltxt_b();">比较</span>';
	return;
}

function select_array_kltxt_b(cstype){
    var blkey= document.getElementById('input_search').value.trim().split(' ');
	var csreg=document.getElementById('input_reg').checked;

    var match_t=str_reg_search_b('',blkey,csreg);
    if (match_t==-1){return;}
    
    var newlist_t=[];
    
    for (let item of filelist){
        match_t=str_reg_search_b(item,blkey,csreg);
        if (cstype=='remove' && match_t==false || cstype=='select' && match_t==true){
            newlist_t.push(item);
        }
    }

    filelist=[];
    for (let item of newlist_t){
        filelist.push(item);
    }
    document.getElementById('linecount').innerHTML='('+filelist.length+'行)';
}

function rearray_kltxt_b(){
    var blkey= document.getElementById('input_search').value.trim().split(' ');
	var csreg=document.getElementById('input_reg').checked;

    var match_t=str_reg_search_b('',blkey,csreg);
    if (match_t==-1){return;}
    
    var bljg='';
    var newlist_t=[];
    for (let item of filelist){
        match_t=str_reg_search_b(item,blkey,csreg);
        if (match_t){
            if (bljg!==''){
                newlist_t.push(bljg);
            }
            bljg=item;
        } else {
            if (bljg==''){
                bljg=bljg+item;
            } else {
                bljg=bljg+' &lt;br /&gt;'+item;
            }
        }
    }
    if (bljg!==''){
        newlist_t.push(bljg);
    }

    if (newlist_t.length>0){
        filelist=[];
        for (let item of newlist_t){
            filelist.push(item);
        }
        document.getElementById('linecount').innerHTML='('+filelist.length+'行)';
    }
}

function get_books_thickness_kltxt_b(){
	var blarr=document.getElementById('textarea_books_thickness').value.split('\n');
	var blcompared_book=document.getElementById('input_compared_book').value;
	var blcompared_size=0;
	var blarr3_t=[];
	for (let blxl=0,lent=blarr.length;blxl<lent;blxl++){
		if (blarr[blxl].includes('/')){
			var arr_t=blarr[blxl].split('/');
			blarr[blxl]=arr_t[arr_t.length-1];
		}
		var blarr2_t=blarr[blxl].split(' ');
		if (blarr2_t.length!=2){continue;}
		var bookname_t=blarr2_t[0];
        if (bookname_t.trim()==''){continue;}
        if (bookname_t.slice(-4,).toLowerCase()=='.jpg'){continue;}
        if (bookname_t.slice(-8,).toLowerCase()=='_menu.js'){continue;}
		for (let one_book of csbooklist_sub_global){
			if (one_book[0]==bookname_t || one_book[0]+'.js'==bookname_t || one_book[1]==bookname_t){
				blarr2_t[0]=one_book[1];
				break;
			}
		}
		blarr3_t.push(blarr2_t);
	}
    if (blarr3_t.length==0){return;}
	blarr3_t.sort(function(a,b){return a[1]>b[1] ? 1 : -1;});
	var bljg='';
	for (let blxl=0,lent=blarr3_t.length;blxl<lent;blxl++){
		bljg=bljg+blarr3_t[blxl][0]+' '+blarr3_t[blxl][1]+'\n';
		if (blarr3_t[blxl][0]==blcompared_book){
			blcompared_size=blarr3_t[blxl][1];
		}
	}
	if (blcompared_size==0){
		blcompared_book=blarr3_t[0][0];
		blcompared_size=blarr3_t[0][1];
	}
	document.getElementById('textarea_books_thickness').value=bljg;

	var bljg='';
	var totalsize_t=0;
	for (let blxl=0,lent=blarr3_t.length;blxl<lent;blxl++){
		bljg=bljg+'<div style="positon:relative;float:left;width:30%; margin:2px; border:3px #c0c0c0 solid; background-color:'+rndcolor_b()+';">';
        bljg=bljg+'<p style="font-size:1.8rem;margin:'+blarr3_t[blxl][1]*15/blcompared_size+'px 0px;" align=center>'+blarr3_t[blxl][0]+'('+(blarr3_t[blxl][1]/blcompared_size).toFixed(2)+')</p>';
        bljg=bljg+'</div>';
		totalsize_t=totalsize_t+blarr3_t[blxl][1]/blcompared_size;
	}
	document.getElementById('divhtml2').innerHTML='<p>全部书籍相当于：'+totalsize_t.toFixed(2)+'本'+blcompared_book+'</p>'+bljg;
}

function help_kltxt_b(){
	var bljg=`<h4>搜索语法示例：</h4>
<ol>
<li>必须含有宝玉，并且必须含有林黛玉（<b>+宝玉 +林黛玉</b>）</li>
<li>或者含有宝玉，或者含有林黛玉（<b>宝玉 林黛玉</b>）</li>
<li>必须含有宝玉，并且必须不含有林黛玉（<b>+宝玉 -林黛玉</b>）</li>
<li>或者含有宝玉，并且必须含有林黛玉（<b>宝玉 +林黛玉</b>）</li>
</ol>
<h4>参数示例：</h4>
<ol>
<li><a href="?_tag幻想" target=_blank>?_tag幻想</a> 返回指定分类的书籍</li>
<li><a href="?xi_you_ji_99175" target=_blank>?xi_you_ji_99175</a> 返回指定书籍</li>
<li><a href="?xi_you_ji_99175&s=猪八戒" target=_blank>?xi_you_ji_99175&s=猪八戒</a> 搜索指定书籍内容</li>
<li><a href="?xi_you_ji_99175&s1=衡阳峪黑水河神府" target=_blank>?xi_you_ji_99175&s1=衡阳峪黑水河神府</a> 返回搜索得到的第一条记录的阅读页面</li>
</ol>
`;
	document.getElementById('divhtml').innerHTML=bljg;
}

function menu_all_only_one_kltxt_b(csmax=3000){
    var t0 = performance.now();
    var bllen=menulist.length;
    if (bllen==0){return;}
    
    var blstep=1;
    //以下3行保留 - 保留注释
    //if (csmax>0 && bllen>csmax){
        //blstep=Math.ceil(bllen/csmax);
    //}
    
    var notfound_list=[];
    var startno=0;
    for (let blxl=0;blxl<bllen;blxl=blxl+blstep){
        var list_t=menu_only_one_kltxt_b(blxl,startno);
        if (list_t.length==2){
            kltxt_menulist_index_global.push(list_t);
            startno=list_t[0];
        } else {
            notfound_list.push(blxl);
        }
    }
    
    while (true){
        var changed=false;
        
        for (let blno=0,lent=notfound_list.length;blno<lent;blno++){
            var one_no=notfound_list[blno];
            if (one_no==-1){continue;}
            var startno=0;
            var endno=-1;
            for (let blxl=0,lenb=kltxt_menulist_index_global.length;blxl<lenb;blxl++){
                var item=kltxt_menulist_index_global[blxl];
                if (item[1]>one_no){    //目录数组中目录序号大于指定目录序号 - 保留注释
                    endno=Math.max(0,item[0]-1);
                    if (blxl>0){
                        startno=kltxt_menulist_index_global[blxl-1][0]+1;
                    }
                    var list_t=menu_only_one_kltxt_b(one_no,startno,endno);
                    if (list_t.length==2){
                        kltxt_menulist_index_global.push(list_t);
                        kltxt_menulist_index_global.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
                        notfound_list[blno]=-1;
                        changed=true;
                    }
                    break;
                }
            }
        }
        if (changed===false){break;}
    }
    console.log('menu_all_only_one_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function menu_only_one_kltxt_b(csxl,startno=0,endno=-1){
    var list_t=[];
    
    var left_at=filelist.indexOf(menulist[csxl],startno);
    if (left_at>=0){
        if (endno<0 || endno==filelist.length){
            if (left_at==filelist.lastIndexOf(menulist[csxl])){
                return [left_at,csxl];
            }
        } else {
            if (filelist.indexOf(menulist[csxl],left_at+1)>endno){  //在搜寻范围内只有1个 - 保留注释
                return [left_at,csxl];
            }
        }
    }
    
    var remove_strs=['=','[=\\s]'];
    for (let one_remove of remove_strs){
        var blitem=menulist[csxl].replace(new RegExp(one_remove,"g"),"").trim();
        var left_at=filelist.indexOf(blitem,startno);
        if (left_at>=0){
            if (endno<0 || endno==filelist.length){
                if (left_at==filelist.lastIndexOf(blitem)){
                    return [left_at,csxl];
                }
            } else {
                if (filelist.indexOf(blitem,left_at+1)>endno){
                    return [left_at,csxl];
                }
            }
        }
    }
    return list_t;
}
    
function findmenu_kltxt_b(csxl=-1,cslimit=20,cscontent_length=-1){
    //cscontent_length: input_line_no - 保留注释
    function sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t){
        var blitem=menulist[blxl].replace(new RegExp("=","g"),"").trim();
        var blitem2=blitem.replace(/\s/g,"").trim();
        var blitem3=blitem.split('—')[0].replace(/[=\s]/g,"").trim();
        var found_t=false;
        for (let blxl2=cscontent_length-1;blxl2>=start_no_t;blxl2--){ //内容扫描
            if (menulist[blxl]==filelist[blxl2].trim() || blitem==filelist[blxl2].trim() || blitem2==filelist[blxl2].trim().replace(new RegExp("　","g"),"")){
                start_no_t=blxl2;
                menu_no_t=blxl;
                found_t=true;
                break;
            }
            if (blxl2-1>=0){
                if (blitem==filelist[blxl2-1].trim()+filelist[blxl2].trim() || blitem2==(filelist[blxl2-1].trim()+filelist[blxl2].trim()).replace(new RegExp("　","g"),"")){
                    start_no_t=blxl2-1;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
            if (blxl2+1<cscontent_length){
                if (blitem==filelist[blxl2].trim()+filelist[blxl2+1].trim() || blitem2==(filelist[blxl2].trim()+filelist[blxl2+1].trim()).replace(/[\s　]/g,"")){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
            if (blxl2+2<cscontent_length){
                if (blitem==filelist[blxl2].trim()+filelist[blxl2+1].trim()+filelist[blxl2+2].trim() || blitem2==(filelist[blxl2].trim()+filelist[blxl2+1].trim()+filelist[blxl2+2].trim()).replace(/[\s　]/g,"")){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }     
        }
        if (found_t===false){
            for (let blxl2=cscontent_length-1;blxl2>=start_no_t;blxl2--){ //内容扫描   
                    if (blitem==filelist[blxl2].trim().split(' ')[0]){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
        }
        if (found_t===false){
            for (let blxl2=cscontent_length-1;blxl2>=start_no_t;blxl2--){ //内容扫描   
                    if (blitem3==filelist[blxl2].trim().split(' ')[0]){
                    start_no_t=blxl2;
                    menu_no_t=blxl;
                    found_t=true;
                    break;
                }
            }
        }
        return [start_no_t,menu_no_t];
    }

    function sub_findmenu_kltxt_binnerHTML(start_no_t,menu_no_t){
        var oinput_startlineno=document.getElementById('input_start_lineno');
        if (oinput_startlineno){
            oinput_startlineno.value=start_no_t+1;
        }
        document.getElementById('input_lineno').value=start_no_t+1;
        document.getElementById('input_search').value=menulist[menu_no_t].replace(new RegExp("=","g"),"").trim();

        create_menulist_kltxt_b(menu_no_t);

        getlines_kltxt_b();
    }
    
    function sub_findmenu_kltxt_bsteps(){
        switch (step_xl){
            case 1:
                for (let blxl=max_t;blxl<=csxl;blxl++){ //目录序号
                    if (menulist[blxl].includes('==')){continue;}
                    no_list_t=sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t);
                    start_no_t=no_list_t[0];
                    menu_no_t=no_list_t[1];
                }
                document.getElementById('divhtml').innerHTML='搜索阶段：'+step_xl+'/'+step_count+'...';
                break;
            case 2:
                for (let blxl=max_t;blxl<=csxl;blxl++){ //目录序号
                    if (menulist[blxl].includes('===') || (menulist[blxl].match(/=/g) || []).length==2){
                        continue;
                    }
                    no_list_t=sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t);
                    start_no_t=no_list_t[0];
                    menu_no_t=no_list_t[1];
                }
                document.getElementById('divhtml').innerHTML='搜索阶段：'+step_xl+'/'+step_count+'...';
                break;
            case 3:
                for (let blxl=max_t;blxl<=csxl;blxl++){ //目录序号
                    if (menulist[blxl].includes('===')){
                        no_list_t=sub_findmenu_kltxt_bscan(blxl,cscontent_length,start_no_t,menu_no_t);
                        start_no_t=no_list_t[0];
                        menu_no_t=no_list_t[1];
                    }
                }
                document.getElementById('divhtml').innerHTML='搜索阶段：'+step_xl+'/'+step_count+'...';
                break;
            case 4:
                sub_findmenu_kltxt_binnerHTML(start_no_t,menu_no_t);
                break;
        }
        step_xl=step_xl+1;
        if (step_xl>4){
            return;
        } else {
            setTimeout(sub_findmenu_kltxt_bsteps,10);
        }
    }
    //-----------------------
	if (csxl>menulist.length-1 || menulist.length==0){return;}
    
    if (csbookname_global.substring(0,6)=='klwiki'){
        if (csxl==-1 && cslimit==-1){
            for (let blxl2=cscontent_length-1;blxl2>=0;blxl2--){
                if (filelist[blxl2].substring(0,7)=='<title>' && filelist[blxl2].slice(-8)=='</title>'){
                    sub_findmenu_kltxt_binnerHTML(blxl2,menulist.indexOf(filelist[blxl2]));
                    return;
                }
            }
        } else if (csxl>=0){
            for (let blxl2=0,lent=filelist.length;blxl2<lent;blxl2++){
                if (filelist[blxl2]==menulist[csxl]){
                    sub_findmenu_kltxt_binnerHTML(blxl2,csxl);
                    return;
                }
            }
        }
    }
    
    var start_no_t=0;
    var cstype='';
	if (csxl==-1){
        var cstype='search menu';
		csxl=menulist.length-1;
        for (let item of kltxt_menulist_index_global){
            if (cscontent_length-1>=item[0]){
                start_no_t=item[0];
            } else {
                break;
            }
        }
	}
    
	if (cslimit==-1){
		cslimit=menulist.length-1;
	}

	if (cscontent_length==-1){
        var cstype='search content';
		cscontent_length=filelist.length;
        
        for (let item of kltxt_menulist_index_global){
            if (csxl<=item[1]){
                cscontent_length=item[0]+1;
                break;
            } else {
                start_no_t=item[0];
            }
        }
	}
    
    var oinput_endlineno=document.getElementById('input_end_lineno');
    if (oinput_endlineno && parseInt(oinput_endlineno.value)>0){
        cscontent_length=Math.min(cscontent_length,parseInt(document.getElementById('input_end_lineno').value));
    }
    
	var max_t=Math.max(0,csxl-cslimit);
	var menu_no_t=0;
    
    var step_xl=1;
    var step_count=4;

    console.log(cstype,csxl,cscontent_length,start_no_t);
    
    var list_t=[];
    if (cstype=='search content'){
        var list_t=menu_only_one_kltxt_b(csxl,start_no_t,cscontent_length-1);
    }

    if (list_t.length==2){
        sub_findmenu_kltxt_binnerHTML(list_t[0],list_t[1]);
        console.log('only one');    
    } else {
        sub_findmenu_kltxt_bsteps();
        console.log('scan all');
    }
}

function find_cn_words_kltxt_b(){
    var csstr=document.getElementById('divhtml').innerHTML;
    var bljg='';
    for (let key in cnwords_global){
        if (csstr.includes(key)){
            bljg=bljg+'<li style="font-size:0.9rem;"><font color=blue><b>'+key+'</b></font> '+cnwords_global[key].join(' ')+'</li>';
        }
    }
    if (bljg!==''){
        bljg='<ol>'+bljg+'</ol>';
        bljg=bljg+'<p align=right class="fmini"><span class="aclick" onclick=\'document.getElementById("div_cn_words").innerHTML="";\'>Clear</span></p>';
        document.getElementById('div_cn_words').innerHTML=bljg;
    }
}

function bookmarks_set_kltxt_b(cslsname='reader_lastbook'){
    var bljg='';
    var list_t=local_storage_get_b(cslsname,-1,true);
    if (list_t.length>900){
        alert('现有书签多于900个，无法添加');
        return;
    }
    for (let item of list_t){
        if (item.split('&').length==6){
            bljg=bljg+item+'\n';
        }
    }

	var csno= Math.max(parseInt(document.getElementById('input_lineno').value.trim()),0);
	var cslines= Math.min(500,Math.max(0,parseInt(document.getElementById('input_lines').value.trim())));
    if ((csno-1)/cslines+1==Math.ceil(filelist.length/cslines)){
        csno=filelist.length;   //最后一页 - 保留注释
    }
    var str_t=csbookname_global+'&'+csno+'&'+cslines;
    if (!('&'+bljg+'&').includes('&'+str_t+'&')){   //避免不同日期，相同书签值的出现 - 保留注释
        str_t=csbooklist_sub_global[csbookno_global][1].replace(/&/g,'_')+'&'+str_t+'&'+filelist.length+'&'+now_time_str_b(':',true)+'\n';
        bljg=str_t+bljg;
    } else {
        alert('书签已存在');
        return;
    }
    if (bljg.slice(-1)=='\n'){
        bljg=bljg.substring(0,bljg.length-1);
    }
    localStorage.setItem(cslsname,bljg);
    alert('书签已添加');
}

function bookmarks_read_kltxt_b(current_book_today_bookmark_only_one,return_full,cslsname){
    //current_book_today_bookmark_only_one 为 true 时：当前书籍今日书签仅保留最新的一个 - 保留注释
    if (Array.isArray(cslsname)){
        var last_book=cslsname;
    } else {
        var last_book=local_storage_get_b(cslsname,-1,true);
    }
    var today=date2str_b();
    var bookmark_list=[];

    var current_book_today_row=[];
    for (let item of last_book){
        var abook=item.split('&');
        if (abook.length!==6){continue;}
        abook[2]=parseInt(abook[2]);
        abook[4]=parseInt(abook[4]);
        //abook 形如：[ "枪炮、病菌与钢铁(贾雷德·戴蒙德)", "qiang_pao_bing_jun_yu_gtjlddmd_227675", 761, "20", 2018, "2023-11-17 21:11:51" ] - 保留注释
        
        if (csbookname_global==abook[1] && abook[5].substring(0,11)==today+' '){ //如果是当前书籍且是今天的书签 - 保留注释
            current_book_today_row.push(abook);
        } else {
            bookmark_list.push(abook);
        }
    }
    
    var current_book_today_bookmark_count=current_book_today_row.length;
    if (current_book_today_bookmark_count>0){
        if (current_book_today_bookmark_only_one){
            current_book_today_row.sort(function (a,b){return a[5]<b[5] ? 1 : -1;}); //按日期排序 - 保留注释
            current_book_today_row=current_book_today_row.slice(0,1);
        }
        bookmark_list=bookmark_list.concat(current_book_today_row);
    }

    var bookmark_name={};
    for (let item of bookmark_list){
        var key_name='b_'+item[1];
        if (bookmark_name[key_name]==undefined){
            bookmark_name[key_name]=[];
        }
        bookmark_name[key_name].push(item);  //同名书籍分组 - 保留注释
    }
    
    var preday=previous_day_b('',366)+' ';   //366天以前 - 保留注释
    for (let key in bookmark_name){
        bookmark_name[key].sort(function (a,b){return a[5]<b[5] ? 1 : -1;}); //按日期排序 - 保留注释
        var oldest_bookmark=bookmark_name[key].slice(-1);
        var bllen=bookmark_name[key].length;
        for (let blxl=3,lent=bookmark_name[key].length;blxl<lent;blxl++){
            if (bookmark_name[key][blxl][5].substring(0,11)<preday){
                bookmark_name[key]=bookmark_name[key].slice(0,blxl);    //不含第 blxl 个元素 - 保留注释
                if (blxl<=bllen-1){
                    bookmark_name[key]=bookmark_name[key].concat(oldest_bookmark);  //保留最古老的书签 - 保留注释
                }
                break;
            }
        }
    }
    
    bookmark_list=[];
    var bookmark_list_only2=[];
    for (let key in bookmark_name){
        bookmark_list=bookmark_list.concat(bookmark_name[key]);
        bookmark_list_only2=bookmark_list_only2.concat(bookmark_name[key].slice(0,2));  //最新的2个 - 保留注释
    }

    bookmark_list.sort(function (a,b){return a[5]<b[5] ? 1 : -1;});
    bookmark_list.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    
    bookmark_list_only2.sort(function (a,b){return a[5]<b[5] ? 1 : -1;});
    bookmark_list_only2.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    
    if (Array.isArray(cslsname)==false && current_book_today_bookmark_only_one && current_book_today_bookmark_count>1){
        if (confirm('当前书籍今日书签是否仅保留最新的一个？')){
            current_book_today_bookmark_count=0;
            var bljg='';
            for (let item of bookmark_list){
                bljg=bljg+item.join('&')+'\n';
            }
            localStorage.setItem(cslsname,bljg);
        }
    }
    
    if (return_full){
        return [current_book_today_bookmark_count,bookmark_list];
    } else {
        return [current_book_today_bookmark_count,bookmark_list_only2];    
    }
}

function bookmarks_get_kltxt_b(current_book_today_bookmark_only_one=false,return_full=true,cslsname='reader_lastbook'){
    //格式：书编号&开始行号&每页行数&filelist元素个数&日期时间 - 保留注释
    fix_divhtml2_kltxt_b(false);
    var current_book_today_bookmark_count=0;
    var bookmark_list=[];
    
    [current_book_today_bookmark_count,bookmark_list]=bookmarks_read_kltxt_b(current_book_today_bookmark_only_one,return_full,cslsname);
    var sum_line_done=0;
    var sum_line_total=0;

    var bookname_t='';
    var bllen=bookmark_list.length;
    var sum_line_change=0;
    
    var theyear = new Date().getFullYear();
    var remain_days=1+days_remained_of_year_b();    //包含当天 - 保留注释
    var next_year_days=(isLeapYear_b(theyear+1)?366:365);
    var next_year2_days=(isLeapYear_b(theyear+2)?366:365);
    
    var result_t=[];
    var newest_datetime='';
    for (let blxl=0;blxl<bllen;blxl++){
        var abook=bookmark_list[blxl];
        var lines_done=(abook[2]<abook[4]?abook[2]-1:abook[2]);
        if (blxl==0 || blxl>0 && abook[1]!==bookmark_list[blxl-1][1]){  //只读取同名书籍的最新记录 - 保留注释
            sum_line_done=sum_line_done+lines_done;
            sum_line_total=sum_line_total+abook[4];
        }
        
        var str_t=bookid_2_bookname_b(abook[1])[0];
        
        var lines_left=abook[4]-lines_done;
        var blstr='<td align=right>'+abook[2]+' / ';
        blstr=blstr+abook[4]+' / ';
        blstr=blstr+(lines_done/abook[4]*100).toFixed(2)+'%</td>';
        
        blstr=blstr+'<td align=right>';
        if (blxl<bllen-1 && abook[1]==bookmark_list[blxl+1][1]){//计算相邻同名书籍已读行数变化 - 保留注释
            var one_book_line_change=abook[2]-bookmark_list[blxl+1][2];
            if (blxl>0 && abook[1]==bookmark_list[blxl-1][1]){
                //blstr=blstr+'/';    //相同书名已读行数变动只统计最新的2条 - 保留注释
                blstr=blstr+'<font color="'+scheme_global['memo']+'">'+(one_book_line_change>0?'+':'')+one_book_line_change+'</font>';
            } else {
                blstr=blstr+(one_book_line_change>0?'+':'')+one_book_line_change;
                sum_line_change=sum_line_change+one_book_line_change;
            }
        } else {
            blstr=blstr+'<font color="'+scheme_global['memo']+'">/</font>';
        }
        blstr=blstr+'</td>';
    
        blstr=blstr+'<td align=right>'+Math.ceil(lines_left/remain_days)+' / ';
        blstr=blstr+Math.ceil(lines_left/(remain_days+next_year_days))+' / ';
        blstr=blstr+Math.ceil(lines_left/(remain_days+next_year_days+next_year2_days))+'</td>';        
        blstr=blstr+'<td class="td_bookmark_datetime">'+abook[5]+'</td>';
        if (abook[5]>newest_datetime){
            newest_datetime=abook[5];
        }
        
        var blno='<td align=right>'+(blxl+1)+'</td>';
        if (csbookname_global==abook[1]){
            result_t.push(blno+'<td style="min-width:10rem;"><span class="span_link" onclick="getlines_kltxt_b('+abook[2]+','+abook[3]+');">'+str_t+'</span></td>'+blstr);
        } else {
            result_t.push(blno+'<td style="min-width:10rem;"><a href="?'+abook[1]+'&line='+abook[2]+'_'+abook[3]+'">'+str_t+'</a></td>'+blstr);
        }
    }
        
    var postpath=postpath_b();
    
    var bltype='';
    if (cslsname=='reader_lastbook'){
        bltype='reader_lastbook';
    }
    var textarea_name='textarea_bookmarks';
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type='+bltype+'" name="form_bookmarks" target=_blank style="margin-left:0.5rem;">\n';
    if (return_full){
        bljg=bljg+'<textarea name="'+textarea_name+'" id="'+textarea_name+'" style="height:20rem;">';
        for (let item of bookmark_list){
            bljg=bljg+item.join('&')+'\n';
        }
        bljg=bljg+'</textarea>';
    }
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span> ';       
    if (return_full){
        bljg=bljg+'<span class="aclick" onclick="bookmarks_import_kltxt_b(\''+cslsname+'\');">更新</span> ';
        bljg=bljg+'<span class="aclick" onclick="bookmarks_get_kltxt_b(false,false,\''+cslsname+'\');">最新书签</span> ';
        bljg=bljg+'<span class="aclick" onclick="bookmarks_separate_kltxt_b(\''+textarea_name+'\');">分离当前书签</span> ';       
        bljg=bljg+'<span class="aclick" onclick="bookmarks_textarea_flot_kltxt_b(\''+textarea_name+'\');">当前书签阅读图形</span> ';       
        bljg=bljg+flot_legend_select_b('select_flot_legend_position_kltxt');
        bljg=bljg+textarea_buttons_b(textarea_name,'全选,清空,复制,发送到临时记事本,发送地址',bltype)+' ';
    } else {
        bljg=bljg+'<span class="aclick" onclick="bookmarks_get_kltxt_b(false,true,\''+cslsname+'\');">全部书签</span> ';
    }
    bljg=bljg+theyear+'年剩余天数：'+remain_days;
    bljg=bljg+'</p>';
    if (return_full){
        bljg=bljg+'<p><textarea id="textarea_current_book_bookmarks_kltxt" style="display:none;" onclick="this.select();document.execCommand(\'copy\');"></textarea></p>\n';
    }
    if (current_book_today_bookmark_count>1){
        bljg=bljg+'<p><span class="aclick" onclick="bookmarks_get_kltxt_b(true,true,\''+cslsname+'\');">当前书籍今日书签仅留最新一个</span></p>';
    }
    bljg=bljg+'</form>\n';
    
    //---
    var current_book_percent=[];
    var reading_lines=[];
    [current_book_percent,reading_lines]=bookmarks_percent_lines_kltxt_b(bookmark_list,csbookname_global,return_full);
    if (current_book_percent.length>0){
        bljg=bljg+'<div id="div_flot_bookmark_line" style="width=100%;height:35rem;"></div>';
        bljg=bljg+'<div id="div_bookmark_statistics"></div>';
    }
    //---
    document.getElementById('divhtml').innerHTML='';
    var table_th='<tr><th>No.</th><th>书名</th><th nowrap>当前行号 / 总行数 / 完成%</th><th>Δ</th><th nowrap>'+theyear+' / '+(theyear+1)+' / '+(theyear+2)+'年年底<br />完成每日需阅读行数</th><th>添加日期</th></tr>';
    
    var table_sum='<tr><th></th><th align=center>合计</th>';
    table_sum=table_sum+'<th align=right>'+sum_line_done+' / '+sum_line_total+' / '+(sum_line_done/sum_line_total*100).toFixed(2)+'%</th>';
    table_sum=table_sum+'<th align=right>'+(sum_line_change>0?'+':'')+sum_line_change+'</th>';

    lines_left=sum_line_total-sum_line_done;

    table_sum=table_sum+'<th align=right>'+Math.ceil(lines_left/remain_days)+' / ';
    table_sum=table_sum+Math.ceil(lines_left/(remain_days+next_year_days))+' / ';
    table_sum=table_sum+Math.ceil(lines_left/(remain_days+next_year_days+next_year2_days))+'</th>';       

    table_sum=table_sum+'<th></th></tr>';
    
    document.getElementById('divhtml2').innerHTML='<section style="overflow:auto;margin-left:0.5rem; margin-right:0.5rem;"><table id="table_bookmarks" class="table_common" cellpadding=0 cellspacing=0 style="font-size:0.85rem;" width=100%>'+table_th+array_2_li_b(result_t,'tr',false)+table_sum+'</table></section><br />'+bljg;

    if (csbooklist_sub_global.length>0){
        bookmarks_statistics_kltxt_b(bookmark_list,reading_lines,current_book_percent,csbookno_global,return_full,cslsname);
    }

    var today=date2str_b();
    var otds=document.querySelectorAll('table#table_bookmarks td.td_bookmark_datetime');
    for (let one_td of otds){
        if (one_td.innerText.substring(0,10)!==today && one_td.innerText!==newest_datetime){continue;}  //最新日期不一定是今天 - 保留注释
        if (one_td.innerText==newest_datetime){
            var blcolor=scheme_global['pink'];
        } else {
            var blcolor=scheme_global['skyblue'];
        }
        one_td.parentNode.style.backgroundColor=blcolor;
        one_td.parentNode.setAttribute('onmouseover','this.style.backgroundColor="'+scheme_global['button']+'";');
        one_td.parentNode.setAttribute('onmouseout','this.style.backgroundColor="'+blcolor+'";');
    }
}

function bookmarks_separate_kltxt_b(textarea_id){
    var otextarea=document.getElementById(textarea_id);
    var list_t=otextarea.value.trim().split('\n');
    var others_bookmark_list=[];
    var current_bookmark_list=[];
    for (let item of list_t){
        if (item.includes('&'+csbookname_global+'&')){
            current_bookmark_list.push(item);
        } else {
            others_bookmark_list.push(item);
        }
    }
    if (current_bookmark_list.length==0){return;}
    otextarea.value=others_bookmark_list.join('\n');
    var otextarea_current=document.getElementById('textarea_current_book_bookmarks_kltxt');
    otextarea_current.value=current_bookmark_list.join('\n');
    otextarea_current.style.display='';
    alert('原共有书签'+list_t.length+'条；当前书籍书签'+current_bookmark_list.length+'条；其他书籍书签'+others_bookmark_list.length+'条。'+(list_t.length==current_bookmark_list.length+others_bookmark_list.length?'条数一致。':'条数不一致。'));
}

function bookmarks_percent_lines_kltxt_b(bookmark_list,bookid,return_full){
    var current_book_percent=[];
    var reading_lines=[];
    var bldate;
    if (return_full){
        for (let item of bookmark_list){
            if (item[1]!==bookid){continue;}
            var percent=(item[2]<item[4]?item[2]-1:item[2])*100/item[4];
            bldate=new Date(item[5].split(' ')[0]);
            current_book_percent.push([bldate,percent]);
            reading_lines.push([bldate,item[2]-1]);
        }
        current_book_percent.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
        reading_lines.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    }
    if (reading_lines.length>0){
        if (reading_lines[0][1]>=1){
            var prev_date=previous_day_b(reading_lines[0][0],1,false);
            reading_lines=[[prev_date,0]].concat(reading_lines);
            current_book_percent=[[prev_date,0]].concat(current_book_percent);
        }
    }
    if (reading_lines.length>=2 && current_book_percent.length>=0){
        if (reading_lines[0][1]==0){
            bldate=previous_day_b(reading_lines[1][0],1,false);
            reading_lines[0][0]=bldate;
            current_book_percent[0][0]=bldate;      
        }
    }
    
    for (let blxl=reading_lines.length-1;blxl>0;blxl--){
        reading_lines[blxl][1]=reading_lines[blxl][1]-reading_lines[blxl-1][1];
    }
    return [current_book_percent,reading_lines];    //current_book_percent日期改变会导致reading_lines日期同时改变，反之亦然 - 保留注释
}

function bookmarks_diy_name_kltxt_b(){
    var diy_name='';
    var oinput=document.getElementById('input_diy_bookname');
    if (oinput){
        diy_name=oinput.value.trim();
    }
    return diy_name;
}

function bookmarks_statistics_kltxt_b(bookmark_list,reading_lines,current_book_percent,csno,return_full,cslsname){
    var bookid=csbooklist_sub_global[csno][0];
    var bookname_t=csbooklist_sub_global[csno][1];
    
    var diy_name=bookmarks_diy_name_kltxt_b();
    if (diy_name!==''){
        bookname_t=diy_name;
    }
    
    if (!bookname_t.includes('《')){
        bookname_t=' 《'+bookname_t+'》';
    }
    
    var unit_t='行';
    if (bookname_t.includes('#页#')){
        unit_t='页';
        bookname_t=bookname_t.replace('#页#','');
    }
        
    var blstatsitics='';

    var current_line_no_max=0;
    var filelist_len=0;
    for (let item of bookmark_list){
        if (item[1]!==bookid){continue;}
        if (current_line_no_max<item[2]){
            current_line_no_max=item[2];
            filelist_len=item[4];
        }
    }
    
    if (current_line_no_max<filelist_len){
        current_line_no_max=current_line_no_max-1;  //书签行号-1 - 保留注释
    }
    if (reading_lines.length>=2){
        if (reading_lines[0][1]<=1){    //考虑第一个书签已读行数为1的情形 - 保留注释
            var day_start=reading_lines[1][0];  //第二个书签已读行数应当>1 - 保留注释
            var read_days=reading_lines.length-1;
        } else {
            var day_start=reading_lines[0][0];
            var read_days=reading_lines.length;
        }
        var day_end=reading_lines.slice(-1)[0][0];
        if (current_line_no_max<filelist_len){
            var day_end=validdate_b(date2str_b());
        }
        var day_all=Math.ceil(days_between_two_dates_b(day_start,day_end))+1;
        
        blstatsitics='<p style="margin-left:0.5rem;"><b>'+bookname_t+'</b>。';
        blstatsitics=blstatsitics+'开始阅读日期：'+date2str_b('-',day_start)+' '+day_2_week_b(day_start)+'；结束日期：'+date2str_b('-',day_end)+' '+day_2_week_b(day_end)+'；总天数：'+day_all+'天；';
        
        var lines_per_day_real=current_line_no_max/read_days;
        var lines_per_day_all=current_line_no_max/day_all;
        blstatsitics=blstatsitics+'实际阅读天数：'+read_days+'天；总'+unit_t+'数：'+filelist_len+'；';
        blstatsitics=blstatsitics+'完成：'+(current_line_no_max*100/filelist_len).toFixed(2)+'%；';
        if (lines_per_day_all.toFixed(0)==lines_per_day_real.toFixed(0)){
            blstatsitics=blstatsitics+'平均每天阅读：'+lines_per_day_all.toFixed(0)+unit_t+'。';        
        } else {
            blstatsitics=blstatsitics+'平均每天阅读：'+lines_per_day_all.toFixed(0)+'—'+lines_per_day_real.toFixed(0)+unit_t+'。';
        }

        if (current_line_no_max<filelist_len){       
            var plan_days_real=Math.ceil((filelist_len-current_line_no_max)/lines_per_day_real);
            var plan_days_all=Math.ceil((filelist_len-current_line_no_max)/lines_per_day_all);
            blstatsitics=blstatsitics+'完成阅读还需要：';
            blstatsitics=blstatsitics+plan_days_real;
            if (plan_days_real!==plan_days_all){
                blstatsitics=blstatsitics+'—'+plan_days_all;
            }
            blstatsitics=blstatsitics+'天；即，'+next_day_b('',plan_days_real);
            if (plan_days_real!==plan_days_all){            
                blstatsitics=blstatsitics+'—'+next_day_b('',plan_days_all);
            }
            blstatsitics=blstatsitics+'。';
            
            var recent_reading_times=5;
            var recent_reading_status='';
            if (reading_lines.length>recent_reading_times){
                var day10_start=reading_lines.slice(-1*recent_reading_times,-1*recent_reading_times+1)[0][0];
                var day10_len=Math.ceil(days_between_two_dates_b(day10_start,day_end))+1;
                var day10_reading_lines=0;
                for (let blxl=reading_lines.length-recent_reading_times,lenb=reading_lines.length;blxl<lenb;blxl++){
                    day10_reading_lines=day10_reading_lines+reading_lines[blxl][1];
                }
                var lines_per_day_10=day10_reading_lines/day10_len;
                var plan_days_10=Math.ceil((filelist_len-current_line_no_max)/lines_per_day_10);
                
                recent_reading_status='最近'+day10_len+'天，共阅读'+recent_reading_times+'次，共阅读'+day10_reading_lines+unit_t+'，平均每天阅读'+(lines_per_day_10).toFixed(0)+unit_t+'。按此计算，';
                recent_reading_status=recent_reading_status+'完成阅读还需要：'+plan_days_10+'天；即，'+next_day_b('',plan_days_10)+'。';
            }
            blstatsitics=blstatsitics+recent_reading_status;
        }
        blstatsitics=blstatsitics+'</p>';
    }

    if (klmenu_check_b('span_add_zero_reading_lines_txtlistsearch',false)){
        reading_lines=date_list_insert_zero_b(reading_lines);   //阅读行数补零 - 保留注释
    }
    if (return_full && reading_lines.length>=1 && current_book_percent.length>0 && csbooklist_sub_global.length>0){
        var flot_list1=[bookname_t+'阅读'+unit_t+'数'].concat(reading_lines);        
        var flot_list2=[bookname_t+'已读比例'].concat(current_book_percent);
        
        flot_two_lines_two_yaxis_b([flot_list1,flot_list2],'div_flot_bookmark_line',unit_t,'%',document.getElementById('select_flot_legend_position_kltxt').value,true,'d',0,0,'',[],-1,false,false,false,100);
        var odiv=document.getElementById('div_bookmark_statistics');
        odiv.innerHTML=blstatsitics;
        
        var result_t=new Set();
        for (let item of bookmark_list){
            result_t.add(item[1]);
        }
        bookmarks_buttons_kltxt_b(result_t,csno,diy_name,cslsname);
    }
}

function bookmarks_buttons_kltxt_b(id_set,csno=-1,diy_name='',cslsname='reader_lastbook',do_clear=false,sum_list=[]){
    if (id_set.size<=1){return;}
    
    var bljg=['<span class="oblong_box"'+(csno==-1?' style="color:red;"':'')+' onclick="bookmarks_all_book_statistics_data_kltxt_b();">全部</span>'];
    id_set=Array.from(id_set);
    for (let one_set of id_set){
        for (let blno=0,lent=csbooklist_sub_global.length;blno<lent;blno++){
            if (csbooklist_sub_global[blno][0]==one_set){
                bljg.push('<span class="oblong_box"'+(csno==blno?' style="color:red;"':'')+' onclick="bookmarks_one_book_statistics_kltxt_b('+blno+',\''+cslsname+'\');">'+csbooklist_sub_global[blno][1]+'</span>');
                break;
            }
        }
    }
    var diy_button=' <input type="text" id="input_diy_bookname" placeholder="自定义书名" value="'+specialstr92_b(diy_name)+'" />';
    var odiv=document.getElementById('div_bookmark_statistics');
    if (!odiv){return;}
    
    if (do_clear){
        odiv.innerHTML='';
    }
    odiv.insertAdjacentHTML('beforeend','<p style="margin-left:0.5rem;line-height:1.8rem;">'+bljg.join(' ')+diy_button+'</p>');
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    input_size_b([['input_diy_bookname',12,0.95]],'id');
        
    var blstr=date_count_dots_b(sum_list,'blue',13,20,'行',true,true);
    odiv.insertAdjacentHTML('beforeend','<div style="padding:0.5rem;">'+blstr+'</div>');    
}

function bookmarks_textarea_flot_kltxt_b(){
    var otextarea=document.getElementById('textarea_bookmarks');
    if (!otextarea){return;}
    var list_t=otextarea.value.trim().split('\n');
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        if (list_t[blxl].substring(0,1)=='#'){
            list_t[blxl]=list_t[blxl].substring(1,).trim();
        }
    }
    list_t=bookmarks_read_kltxt_b(false,true,list_t)[1];
    
    var result_t,id_set;
    [result_t,id_set]=bookmarks_all_book_statistics_data_kltxt_b('reader_lastbook',true,list_t,true,false);
    
    var sum_list=[];
    if (result_t[0][0]=='合计'){
        sum_list=result_t[0].slice(1,);
        result_t=result_t.slice(1,);
    }
    bookmarks_all_book_statistics_flot_kltxt_b(false,id_set,'reader_lastbook',result_t,sum_list);
}

function bookmarks_all_book_statistics_data_kltxt_b(cslsname='reader_lastbook',show_sum=false,bookmark_list=false,select_year=false,show_flot=true){
    if (Array.isArray(bookmark_list)==false){
        bookmark_list=bookmarks_read_kltxt_b(false,true,cslsname)[1];
    }
    
    var id_set=new Set();
    var bookname_dict={};
    for (let item of bookmark_list){
        id_set.add(item[1]);
        bookname_dict['b_'+item[1]]=item[0];
    }
    
    var result_t=[];
    var sum_list={};
    var year_set=new Set();
    
    for (let one_id of id_set){
        var current_book_percent=[];
        var reading_lines=[];
        [current_book_percent,reading_lines]=bookmarks_percent_lines_kltxt_b(bookmark_list,one_id,true);
        if (current_book_percent.length>0 && reading_lines.length>1){
            for (let arow of reading_lines){
                year_set.add(arow[0].getFullYear());
            }
            if (show_sum){
                for (let arow of reading_lines){
                    var bldate=date2str_b('-',arow[0]);
                    if (sum_list[bldate]==undefined){
                        sum_list[bldate]=[validdate_b(arow[0]),0];
                    }
                    sum_list[bldate][1]=sum_list[bldate][1]+arow[1];
                }
            }
            var bookname_t=bookname_dict['b_'+one_id];
            if (!bookname_t.includes('《')){
                bookname_t='《'+bookname_t+'》';
            }            
            result_t.push([bookname_t].concat(reading_lines));
        }
    }
    
    if (show_sum){
        sum_list=object2array_b(sum_list);
        sum_list.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
        sum_list=['合计'].concat(sum_list);
        result_t=[sum_list].concat(result_t);
    }
    
    if (select_year && year_set.size>1){
        year_set=Array.from(year_set);
        year_set.sort();
        var selected_year=parseInt((prompt('输入年份（'+year_set+'）（可选）') || '').trim());
        var filtered_t=[];
        if (year_set.includes(selected_year)){
            for (let abook of result_t){
                var temp_t=[abook[0]];
                for (let acol=1,lenb=abook.length;acol<lenb;acol++){
                    if (abook[acol][0].getFullYear()!==selected_year){continue;}
                    temp_t.push(abook[acol]);
                }
                if (temp_t.length>2){
                    filtered_t.push(temp_t);
                }
            }
            result_t=filtered_t;  
        }
    }
    if (show_flot){
        bookmarks_all_book_statistics_flot_kltxt_b(show_sum,id_set,cslsname,result_t);
    } else {
        return [result_t,id_set];
    }
}

function bookmarks_all_book_statistics_flot_kltxt_b(show_sum,id_set,cslsname,cslist,sum_list=[]){
    if (show_sum && cslist.length==2){ //只有1本书 - 保留注释
        if (cslist[0][0]=='合计'){
            cslist=[cslist[1]];
        }
    }

    var odiv=document.getElementById('div_flot_bookmark_line');
    if (odiv){
        flot_lines_b(cslist,'div_flot_bookmark_line',document.getElementById('select_flot_legend_position_kltxt').value,true,true,'','d','行',0);
        odiv.scrollIntoView();
    }
    var diy_name=bookmarks_diy_name_kltxt_b();
    bookmarks_buttons_kltxt_b(id_set,-1,diy_name,cslsname,true,sum_list);
}

function bookmarks_one_book_statistics_kltxt_b(csno,cslsname){   
    if (csno<0 || csno>=csbooklist_sub_global.length.length){return;}
    var bookmark_list=bookmarks_read_kltxt_b(false,true,cslsname)[1];
    var current_book_percent=[];
    var reading_lines=[];
    [current_book_percent,reading_lines]=bookmarks_percent_lines_kltxt_b(bookmark_list,csbooklist_sub_global[csno][0],true);
    if (current_book_percent.length==0){return;}
    
    bookmarks_statistics_kltxt_b(bookmark_list,reading_lines,current_book_percent,csno,true,cslsname);
}

function bookmarks_import_kltxt_b(cslsname){
    if (confirm('是否更新书签？')){
        var str_t=document.getElementById('textarea_bookmarks').value;
        localStorage.setItem(cslsname,str_t.trim());
        bookmarks_get_kltxt_b(false,true,cslsname);
    }
}

function page_kltxt_b(cspages,cslines){
    var blno=page_location_b(cspages);
    if (blno!==false){
        getlines_kltxt_b((blno-1)*cslines+1,cslines);
    }
}

function cover_kltxt_b(csno,cshideno){
    var bljg='';
    if (csno==1 && csbookno_global>=0){
        var blfound=false;
        if (typeof mini_img_list0_global!=='undefined'){
            if (csbookname_global+'.jpg' in mini_img_list0_global){
                var cover_img='<img src="'+mini_img_list0_global[csbookname_global+'.jpg']+'" />';            
                blfound=true;
            }
        }
        
        if (blfound==false){
            var coverpath=csbooklist_sub_global[csbookno_global][3];
            var covername=csbooklist_sub_global[csbookno_global][0];
            if (coverpath.includes('digest')){
                coverpath=coverpath.replace('digest','');
                if (covername.slice(-7,)=='_digest'){
                    covername=covername.slice(0,-7);
                }
            }
            if (book_type_b(csbooklist_sub_global[csbookno_global],'P')){
                var cover_img='<img src="'+book_path_b(coverpath)+'cover/'+covername+'.jpg" alt="'+csbooklist_sub_global[csbookno_global][1]+'" />';
            } else {
                var cover_img='<img src="'+book_path_py_b('cover',coverpath)+covername+'.jpg" alt="'+csbooklist_sub_global[csbookno_global][1]+'" />';
            }
        }
        
		if (cshideno){
            bljg='<p style="color:'+scheme_global['shadow']+';">'+cover_img+'</p>';
        } else {
            bljg='<li style="color:'+scheme_global['shadow']+';">'+cover_img+'</li>';
        }
    }
    return bljg;
}

function no_lines_get_kltxt_b(csno,cslines,single){
	if (csno===false){
        csno=Math.max(parseInt(document.getElementById('input_lineno').value.trim()),0);
    } else {
        csno=Math.max(0,csno);
    }
    
	if (cslines===false){
        var csmaxlines=start_end_lineno_kltxt_b()[2];//500;
        cslines= Math.min(csmaxlines,Math.max(0,parseInt(document.getElementById('input_lines').value.trim())));
    }

	var bllength=filelist.length;
	
	if (csno==0){
		csno=Math.min(bllength-1,Math.max(1,(Math.random()*bllength).toFixed(0)));
	}
	if (cslines==0){
		cslines=Math.max(1,(Math.random()*500).toFixed(0));
	}
	
    var aname_num=csno;
    if (single===false){
        csno=(Math.ceil(csno/cslines)-1)*cslines+1;
    }
    
    var olineno=document.getElementById('input_lineno');
    if (olineno){
        olineno.value=csno;
    }
    var olines=document.getElementById('input_lines');
    if (olines){
        olines.value=cslines;
    }
    return [csno,cslines,aname_num,bllength];
}

function getlines_one_part_kltxt_b(csmin,csmax,bllength,csgrey,csaname,is_single=false,cshideno=false,cover_img='',addhr=false,is_group_file=''){
    var bljg=cover_img;
    
    if (!is_single || !csgrey){
        var style_t='';
        if (csgrey==true){
            style_t='color:'+scheme_global['shadow'];
        }
        var list_t=[];
        for (let blxl=csmin;blxl<csmax;blxl++){
            if (blxl>=bllength){break;}
            if (blxl<0 || blxl>filelist.length-1){continue;}
            list_t.push([filelist[blxl],blxl]);
        }
        bljg=bljg+format_lines_kltxt_b(list_t,style_t,csaname,is_group_file);
    }
    
    if (!cshideno){
        if (csgrey){
            bljg='<ul>'+bljg+'</ul>';
        } else {
            bljg='<ol>'+bljg+'</ol>';            
        }
    }

    if (addhr){
        bljg=bljg+'<hr />';
    }        
    return bljg;
}
    
function getlines_kltxt_b(csno=false,cslines=false,single=false,highlight=true,addhr=true,b_style=false,do_render=true){
    //csno 从 1 开始 - 保留注释
    function sub_getlines_kltxt_b_pages(csno,cslines,bllength){
        var bljg=page_combination_b(filelist.length,cslines,csno,'getlines_kltxt_b','page_kltxt_b','font-size:0.9rem;line-height:1rem;text-align:right',0,0,'');
        return bljg;    
    }
    //-----------------------
    if (csbooklist_sub_global.length==0){return;}
    
    var csno,cslines,aname_num,bllength;
    [csno,cslines,aname_num,bllength]=no_lines_get_kltxt_b(csno,cslines,single);

    var cshideno=checkbox_value_get_b('check_hide_no',true);

	klwiki_syntaxhighlight_global=false;    

    var is_group_file=is_group_file_kltxt_b();
    var cover_img=cover_kltxt_b(csno,cshideno);
    var bljg='';
    bljg=bljg+getlines_one_part_kltxt_b(csno-3,csno-1,bllength,true,aname_num,single,cshideno,cover_img,addhr,is_group_file);
    bljg=bljg+getlines_one_part_kltxt_b(csno-1,csno+cslines-1,bllength,false,aname_num,single,cshideno,'',addhr,is_group_file);
    bljg=bljg+getlines_one_part_kltxt_b(csno+cslines-1,csno+cslines-1+2,bllength,true,aname_num,single,cshideno,'',false,is_group_file);
    
	if (cshideno){
        bljg='<div>'+bljg+'</div>';
    }

    if (single===false){
        var blpage=sub_getlines_kltxt_b_pages(csno,cslines,bllength);
        bljg=blpage+bljg+blpage;
    }

	document.getElementById('divhtml').innerHTML=bljg;
    bible_title_link_generate_kltxt_b();
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#divhtml span.oblong_box'));
    
    if (aname_num!==csno){
	    document.location.href = '#a_raw_line_number';
    } else {
        document.location.href = '#content';
    }
    
    if (do_render){
        render_html_kltxt_b([],false,highlight,b_style);
    }
}

function booksearch_kltxt_b(csword,csreg){
	var csnum=arguments.length;
	if (csnum==0){
        var csword= document.getElementById('input_search').value.trim();
    }
	document.getElementById('input_search').value=csword;

	if (csnum<=1){
        var csreg=document.getElementById('input_reg').checked;
    }
	document.getElementById('input_reg').checked=csreg;
    
    recent_search_kltxt_b(csword+(csreg?'(:r)':''));

    if (csword.trim()==''){return;}
    if (csreg){
        csword=csword+'_reg';
    }

    document.location.href='?_tag'+encodeURIComponent(csword)+'&line=1';
}

function recent_search_kltxt_b(cskeys='',addstyle=false){
    if (document.location.href.includes('reader.htm')){
        var blfn='search_klreader';
    } else {
        var blfn='txtsearch_kltxt_b';
    }
    if (addstyle){
        var odiv=document.getElementById('div_recent_search');
        if (odiv){
            odiv.style.cssText='line-height:1.8rem;margin-top:0.5rem;margin-bottom:0.5rem;padding-top:0.2rem;border-top:0.1rem dotted '+scheme_global['memo']+';border-bottom:0.1rem dotted '+scheme_global['memo']+';';
        }
    }
    recent_search_b('recent_search_txtlistsearch',cskeys,blfn,'div_recent_search',['&lt;title;.mht','&lt;title&gt;;.mht|blogspot|evernote|youdao|wordpress\.com(:r)','+http +2018\\d{4}(:r)','&lt;title;avplayer','&lt;title;==','&lt;title;{{wikiuploads}}200[7-9]/(:r)','&lt;title;引用资料;^\\d+.*http','([^\\x00-\\xff])\\1\\1(:r)','^[^\\x00-\\xff]{2,10}$(:r)','一|二|三|四|五|六|七|八|九|十|零|〇(:r)','kleng','-klwiki -englishwords','-klwiki -已整理','-klwiki -次要','-klwiki -englishwords -已读 -次要 -en_minor +已整理 -🔖','狍 獐 獾 鹿 蛙 野味 兔','-链接 -redirect -模板 -分类 -讨论:','<title>|==(:r)'],20);
}

function txtsearch_one_kltxt_b(csword='',csreg=false){
    if (csword.slice(-4,)=='(:r)'){
        csreg=true;
        csword=csword.slice(0,-4);
    }
    var result_t=txtsearch_list_kltxt_b(csword,csreg,1);
    if (result_t.length==0){return;}
    var oinput=document.getElementById('input_search');
    if (oinput){
        oinput.value=csword;
    }
    var oreg=document.getElementById('input_reg');
    if (oreg){
        oreg.checked=csreg;
    }
    getlines_kltxt_b(result_t[0][1]+1);
}

function txtsearch_list_kltxt_b(csword,csreg,csmaxlines,start_lineno=0,end_lineno=-1,add_recent=true){
    if (csword.length==0){return [];}

    var t0 = performance.now();
    
    if (typeof csword == 'string'){
        var cswordlist=csword.split(' ');   
    } else {
        var cswordlist=csword;
    }
    
	var blcount=0;
    if (end_lineno==-1){
        end_lineno=filelist.length;
    }
    var result_t=[];
    for (let blxl=start_lineno;blxl<end_lineno;blxl++){
		var bltmp = filelist[blxl];
		
		var blfound=str_reg_search_b(bltmp,cswordlist,csreg);
		if (blfound==-1){break;}

		if (blfound){
            result_t.push([bltmp,blxl]);
			blcount=blcount+1;
			if (blcount>=csmaxlines){break;}
		}
	}
    if (add_recent){
        recent_search_kltxt_b(csword+(csreg?'(:r)':''));
    }
    console.log('txtsearch_list_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');

    return result_t;
}

function rare_enwords_search_kltxt_b(show_rare_word=false,import_sentence=false,show_new_word=false,do_search=true,scan_rare=false){
    function sub_rare_enwords_search_kltxt_b_new(){
        var type_list=[];
        if (show_new_word){
            type_list.push(2);
        }
        if (scan_rare){
            type_list.push(5);
        }
        if (type_list.length>0){
            new_words_kltxt_b(type_list,'exclude',true);
        }
    }
    
    function sub_rare_enwords_search_kltxt_b_done(is_ok=true){
        if (is_ok){
            if (do_search){
                var blstr='-class="kleng" -eword +\\b('+en_sentence_count_global.join('|')+')\\b';
                txtsearch_kltxt_b(blstr,true,-1,false,sub_rare_enwords_search_kltxt_b_new);
            } else {
                sub_rare_enwords_search_kltxt_b_new();
            }
        }
    }
    
    if (typeof en_sentence_count_global == 'undefined'){return;}
    
    if (show_rare_word){
        if (!klmenu_check_b('span_show_rare_enwords',false)){
            klmenu_check_b('span_show_rare_enwords',true);
        }
    }
    
    if (import_sentence){
        if (typeof en_sentence_global == 'undefined'){
            load_enword_file_b('en_sentence_global','enwords_sentence',sub_rare_enwords_search_kltxt_b_done);
            return;
        }
    }
    sub_rare_enwords_search_kltxt_b_done();
}

function txtsearch_kltxt_b(csword='',csreg=-1,cscontinue=-1,add_recent=true,run_fn=false,ocontainer=false){
    var oinput=document.getElementById('input_search');
    var oreg=document.getElementById('input_reg');
	if (csword==''){
        csword=oinput.value.trim();
    }

	if (csreg===-1){
        csreg=oreg.checked;
    }

    [csword,csreg]=str_reg_check_b(csword,csreg);
    
    oinput.value=csword;
    oreg.checked=csreg;

    var oinput_continue=document.getElementById('input_continue');
    if (oinput_continue){
        if (cscontinue===-1){
            cscontinue=oinput_continue.checked;
        }
        oinput_continue.checked=cscontinue;
    }
    
    var start_lineno, end_lineno, csmaxlines;
    [start_lineno, end_lineno, csmaxlines]=start_end_lineno_kltxt_b();

    //一开始设置为false，这样才能正确运行 wiki_line_b - 保留注释
	klwiki_syntaxhighlight_global=false;
	
	var blwordlist=csword.split(' ');   

    var result_t=txtsearch_list_kltxt_b(csword,csreg,csmaxlines,start_lineno,end_lineno,add_recent);
    var bllen=lines_2_html_kltxt_b(result_t,ocontainer);
	var do_continue=false;
    
	if (bllen==0 && cscontinue==true){
		if (csbookno_global==csbooklist_sub_global.length-1 && confirm('是否继续跨数据表搜索？')==false){
            layout_kltxt_b();
            return;
        }
        
        var blreg=(csreg?'_reg':'');        
        do_continue=true;
        
		if (csbookno_global==csbooklist_sub_global.length-1){
            location.href='?'+csbooklist_sub_global[0][0]+'_tag'+book_tag_global+'&sc='+csword+blreg;
        } else {
            location.href='?'+csbooklist_sub_global[parseInt(csbookno_global)+1][0]+'_tag'+book_tag_global+'&sc='+csword+blreg;
        }
	}
    
    if (do_continue==false){
        render_html_kltxt_b(blwordlist,true,true,false,true,run_fn,ocontainer);
    }
}

function render_html_kltxt_b(wordlist=[],layout=true,highlight=true,b_style=false,enforce_refresh=false,run_fn=false,ocontainer=false){
    function sub_render_html_kltxt_b_after_highlight(){
        digest_show_kltxt_b(true,-1,b_style,false,ocontainer);
        books_generate_b(false,'txt',book_tag_global,enforce_refresh);
        new_words_kltxt_b(false,'',false,ocontainer);
        img_load_check_kltxt_b();
        if (typeof run_fn == 'function'){
            run_fn();
        }
        console.log('render_html_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');    
    }
    var t0 = performance.now();

    if (layout){
        layout_kltxt_b();
    }
    old_words_kltxt_b(true,ocontainer);
    
    if (highlight){
        var query_str=container_query_doms_get_kltxt_b('p span.txt_content, li span.txt_content',ocontainer);
        
        highlight_text_b(wordlist,query_str,true,sub_render_html_kltxt_b_after_highlight);
    } else {
        sub_render_html_kltxt_b_after_highlight();
    }
}

function container_query_doms_get_kltxt_b(query_str='',ocontainer=false){    
    if (ocontainer===false){
        ocontainer=document.getElementById('divhtml');
    }

    if (query_str==''){
        return ocontainer;
    }

    return ocontainer.querySelectorAll(query_str);    
}

function img_load_check_kltxt_b(){
    function sub_img_load_check_kltxt_b_status(one_img,return_group=false){
        var blsrc=one_img.src;
        if (!blsrc){
            one_img.classList.remove('img_raw_kltxt');
            return '';
        }
        
        if (blsrc.substring(0,11)=='data:image/'){
            one_img.classList.remove('img_raw_kltxt');
            return '';
        }
        
        //不能使用 one_img.complete 没有载入的图片也会 true - 保留注释     

        if (one_img.naturalWidth>0){
            one_img.classList.remove('img_raw_kltxt');
            return '';
        }       
        
        var group_no=new Set();        
        var finfo=file_path_name_b(blsrc);
        var bname=finfo[3];
        
        var blfound=false;
        if (typeof mini_img_index_global !== 'undefined'){
            for (let akey in mini_img_index_global){
                if (mini_img_index_global[akey].includes(bname)){
                    group_no.add(akey);
                    blfound=true;
                    break;
                }
            }
        }

        if (!blfound){
            bname=finfo[1];        
            if (is_group_file.includes('G')){
                group_no.add(bname.slice(-2,));
            }
        }
                        
        if (group_no.size==0){
            one_img.classList.remove('img_raw_kltxt');
            return '';
        }
        
        var can_ignore=true;
        for (let one_no of group_no){
            if (!img_group_ignore_kltxt_global.has(one_no)){
                can_ignore=false;
                break;
            }
        }
        if (can_ignore){
            one_img.classList.remove('img_raw_kltxt');
            console.log('发现忽略',group_no);
            return '';                
        }
        
        if (return_group){
            return group_no;
        } else {
            return blsrc;       
        }
    }

    function sub_img_load_check_kltxt_b_convert_info(fname,one_img,key_type){
        var base64_value=img_key_2_base64_kltxt_b(fname,is_group_file,key_type);
        if (base64_value!==''){
            console.log('转换',fname,'为 base64');
            one_img.src=base64_value;
            one_img.classList.remove('img_raw_kltxt');
        }
    }
    
    function sub_img_load_check_kltxt_b_wait(){
        var oimgs=document.querySelectorAll('img.img_raw_kltxt');
        for (let one_img of oimgs){
            var blsrc=sub_img_load_check_kltxt_b_status(one_img);
            if (blsrc==''){continue;}            
            
            var finfo=file_path_name_b(blsrc);
            var fname=finfo[3];

            var blkey='';
            if (typeof mini_img_index_global !== 'undefined'){
                for (let akey in mini_img_index_global){
                    if (mini_img_index_global[akey].includes(fname)){
                        blkey=akey;
                        break;
                    }
                }
            }
            if (blkey!==''){
                sub_img_load_check_kltxt_b_convert_info(fname,one_img,blkey);
            }
        }

        oimgs=document.querySelectorAll('img.img_raw_kltxt');
        var bllen=oimgs.length;
        console.log('还有 .img_raw_kltxt 图片',bllen,'张');        
        return bllen;
    }

    function sub_img_load_check_kltxt_b_group(){        
        var result_t=new Set();
        var oimgs=document.querySelectorAll('img.img_raw_kltxt');        
        for (let one_img of oimgs){
            var group_no=sub_img_load_check_kltxt_b_status(one_img,true);
            if (group_no!==''){
                result_t=array_union_b(result_t,group_no,true);
            }
        }
        
        return result_t;
    }
    
    function sub_img_load_check_kltxt_b_import_js(is_loaded=true){
        if (!is_loaded){
            img_group_ignore_kltxt_global.add(group_t[blxl-1]);
            console.log('添加忽略',group_t[blxl-1]);
        }
        if (blxl>=bllen){
            sub_img_load_check_kltxt_b_wait();
            console.log('应加载总数：',group_t.length,'；已加载：',group_t.slice(0,blxl),'；未继续加载：',group_t.slice(blxl,));
            console.log('img_load_check_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');            
            return;
        }
        
        if (img_group_ignore_kltxt_global.has(group_t[blxl])){
            blxl=blxl+1;
            sub_img_load_check_kltxt_b_import_js();
            return;
        }
        
        if (sub_img_load_check_kltxt_b_wait()==0){
            console.log('应加载总数：',group_t.length,'；已加载：',group_t.slice(0,blxl),'；未继续加载：',group_t.slice(blxl,));
            //未继续加载部分 不能合并到 img_group_ignore_kltxt_global 中，可能存在相同编号，但尺寸较小或较大的图片 - 保留注释
            console.log('img_load_check_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }

        if (eval('typeof mini_img_list'+group_t[blxl]+'_global') == 'undefined'){    
            file_dom_create_b([imgpath+'mini_img_list'+group_t[blxl]+'_data.js']);
            load_var_b('mini_img_list'+group_t[blxl]+'_global',sub_img_load_check_kltxt_b_import_js,false,csmax);
        } else {
            load_var_b('mini_img_list'+group_t[blxl]+'_global',sub_img_load_check_kltxt_b_import_js,false,1,1);        
        }
        
        blxl=blxl+1;
    }    
    
    function sub_img_load_check_kltxt_b_start(){
        group_t=Array.from(sub_img_load_check_kltxt_b_group());
        group_t.sort();
        
        bllen=group_t.length;
        blxl=0;
        sub_img_load_check_kltxt_b_import_js();    
    }
    //-----------------------
    var oimgs=document.querySelectorAll('img.img_raw_kltxt');
    if (oimgs.length==0){return;}
    
    var t0 = performance.now();
        
    if (typeof img_group_ignore_kltxt_global == 'undefined'){
        img_group_ignore_kltxt_global=new Set();
    }

    var is_group_file=is_group_file_kltxt_b();
    var imgpath=img_path_kltxt_b();
    var csmax=(is_local_b()?10:20);    
    var group_t, bllen, blxl;

    if (typeof mini_img_index_global == 'undefined'){
        file_dom_create_b([imgpath+'mini_img_index_data.js']);
        load_var_b('mini_img_index_global',sub_img_load_check_kltxt_b_start,false,csmax);            
    } else {
        sub_img_load_check_kltxt_b_start();
    }
}

function is_group_file_kltxt_b(){
    var is_group_file='';
    if (csbookno_global>=0 && csbooklist_sub_global.length>0){
        if (book_type_b(csbooklist_sub_global[csbookno_global],'G')){
            is_group_file=is_group_file+'G';
        }        
    }
    return is_group_file;
}

function img_key_2_base64_kltxt_b(img_name,is_group_file,group_no=false){    
    function sub_img_key_2_base64_kltxt_b_one_arr(csarray){
        var base64_value='';
        if (img_name in csarray){
            console.log('base64图片：',img_name);    //此行保留 - 保留注释
            var base64_value=csarray[img_name];
            if (base64_value.substring(0,11)!=='data:image/'){
                if (base64_value in csarray){
                    console.log('jump from:',img_name,'to:',base64_value);    //此行保留 - 保留注释
                    base64_value=csarray[base64_value];
                } else {
                    console.log('not find jump key:',base64_value);    //此行保留 - 保留注释
                }
            }
        }    
        return base64_value;
    }
    //-----------------------
    var base64_value='';
    
    var group_no_list=[];
    if (group_no!==false){
        group_no_list=[group_no];
    }

    for (let group_no of group_no_list){
        if (eval('typeof mini_img_list'+group_no+'_global') == 'undefined'){continue;}
        if (group_no===''){continue;}
        try {
            var csarray=eval('mini_img_list'+group_no+'_global');
            base64_value=sub_img_key_2_base64_kltxt_b_one_arr(csarray);
            if (base64_value!==''){break;}
        } catch (error){
            console.log(error);
        }
    }
    
    return base64_value;
}

function format_lines_kltxt_b(cslist,csstyle='',csaname=-1,is_group_file=''){
    //cslist 的每个元素为数组，包含2个元素：0为字符串，1为序号

    function sub_format_lines_kltxt_b_img(csstr,imgpath){
        var scan_times=0;        
        while (csstr.match(/<jsdocimg>(.*?)<\/jsdocimg>/)!==null){
            scan_times=scan_times+1;
            
            var img_name=csstr.replace(/.*<jsdocimg>(.*?)<\/jsdocimg>.*/,'$1');
            var base64_value=img_key_2_base64_kltxt_b(img_name,is_group_file);
            if (base64_value!==''){
                csstr=csstr.replace('<jsdocimg>'+img_name+'</jsdocimg>','<img src="'+base64_value+'" />');
            } else {
                csstr=csstr.replace(/<jsdocimg>(.*?)<\/jsdocimg>/,'<img class="img_raw_kltxt" src="'+imgpath+'$1"  />');  //onerror="img_load_check_kltxt_b(this);" - 此行保留
            }
        }
        if (scan_times>1){
            console.log('jsdocimg 循环次数：',scan_times);    //此行保留 - 保留注释
        }
        return csstr;
    }

    function sub_format_lines_kltxt_b_a_line(cslist,cshidelineno=false,booktype='',csklwiki_format=false,remote_host='',imgpath='',is_digest=false,isbold=false){
        var blstr=cslist[0];
        var csxl=cslist[1];
        var menu_t='';
        if (booktype=='wiki'){
            if (blstr.includes('<') || blstr.includes('>')){
                blstr=blstr.replace(new RegExp('<','g'),'&lt;');
                blstr=blstr.replace(new RegExp('>','g'),'&gt;');
            }
            if (csklwiki_format){
                blstr=wiki_line_b(blstr,remote_host+'/wikiuploads/');
            }            
        } else if (booktype=='jsdoc_html'){
            blstr=wiki_line_b(blstr,remote_host+'/wikiuploads/');
        }

        if (csklwiki_format && imgpath!==''){
            blstr=sub_format_lines_kltxt_b_img(blstr,imgpath);
        }

        blstr='<span class="txt_content">'+blstr+'</span>';
        if (isbold){
            blstr='<big><strong>'+blstr+'</strong></big>';
        }

        blstr=blstr+' <span class="txtsearch_kltxt_lineno" id="txtsearch_kltxt_lineno_'+(csxl+1)+'" style="cursor:pointer; font-style: italic;'+(cshidelineno?'display:none;':'')+'" onclick="getlines_kltxt_b('+(csxl+1)+');">('+(csxl+1)+')</span>';
        blstr=blstr+menu_t;
        return blstr;
    }

    //-----------------------
    if (cslist.length==0){return '';}
    
    var t0 = performance.now();
        
    var ul_no=0;
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
        if (cslist[blxl][0].substring(0,2)=='# '){
            cslist[blxl][0]=(ul_no+1)+'. '+cslist[blxl][0].substring(2,);
            ul_no=ul_no+1;
        } else if (ul_no>0){
            ul_no=0;
        }
    }
        
    if (csstyle==''){
        csstyle='color:'+scheme_global['color'];
    }
    
    var cshideno=checkbox_value_get_b('check_hide_no',true);
    var cshidelineno=checkbox_value_get_b('check_hide_lineno',true);
    var csklwiki_format=checkbox_value_get_b('check_klwiki_format',true);
    
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var is_digest=location.href.includes('digest.htm');
    
    var imgpath=img_path_kltxt_b();

    var html_keys=['table','tr','th','td','ul','ol','li','div'];
    var opened_keys=[];
    
    var menu_no_list=[];
    var obold=document.getElementById('input_menu_bold');
    if (obold && obold.checked){
        var menu_list=menu_no_get_kltxt_b();
    }
    
    var booktype=book_type_check_kltxt_b();

    var bljg='';
    for (let item of cslist){
        //item 为 [ "玉亭失望地见他哥快上了土坡，就又轻轻喊叫了一声：“哥，你先等一等……”", 380 ] 这样的数组 - 保留注释
        if (item[1]+1==csaname){
            bljg=bljg+'<a name="a_raw_line_number" id="a_raw_line_number_'+csaname+'"></a>';
        }

        var hide_p_li='';
        var only_html_key=null;
        if (item[0].substring(0,1)=='<'){
            for (let one_key of html_keys){
                if (['<'+one_key+' ','<'+one_key+'>'].includes(item[0].substring(0,1+one_key.length+1))){
                    hide_p_li=one_key;
                    opened_keys.push(one_key);
                    break;
                } else if ('</'+one_key+'>'==item[0].substring(0,2+one_key.length+1)){
                    hide_p_li='/';
                    var blat=opened_keys.lastIndexOf(one_key);
                    if (blat>=0){
                        opened_keys.splice(blat,1);
                    }
                    break;
                }
            }
            if (hide_p_li!==''){
                only_html_key=item[0].match(/^<[^<>]+>$/);
            }
        }
        
        var blleft='';
        var blright='';        
        if (hide_p_li==''){ //如果含有指定的html key，则不添加 p 或 li。不能使用 opened_keys.length==0，因为表格内部需要换行 - 保留注释
            if (cshideno){
                blleft='<p style="'+csstyle+';">';
                blright='</p>';
            } else {
                blleft='<li style="'+csstyle+';">';
                blright='</li>';
            }
        }
        if (only_html_key==null){
            bljg=bljg+blleft+sub_format_lines_kltxt_b_a_line(item,cshidelineno,booktype,csklwiki_format,remote_host,imgpath,is_digest,menu_no_list.includes(item[1]))+blright;
        } else {
            bljg=bljg+item[0];  //如一行只有html key，如<td>，则不做修饰 - 保留注释
        }
    }
    
    //收回html key - 保留注释
    opened_keys.reverse(); 
    for (let item of opened_keys){
        bljg=bljg+'</'+item+'>';
    }
    var ms=performance.now() - t0;
    if (ms>10){
        console.log('format_lines_kltxt_b() 费时：'+ms + ' milliseconds');
    }
    return bljg;
}

function book_type_check_kltxt_b(){
    var booktype='';
    if (csbookno_global<0){return '';}
    
    if (csbooklist_sub_global[csbookno_global][0].substring(0,6)=='klwiki' || csbooklist_sub_global[csbookno_global][0].slice(-6,).toLowerCase()=='klwiki'){
        booktype='wiki';
    } else if (csbooklist_sub_global[csbookno_global][1]=='圣经和合本' || csbooklist_sub_global[csbookno_global][1]=='Bible(kjv)'){
        booktype='bible';
    } else if (csbooklist_sub_global[csbookno_global][0]=='jsdoc_search_html_data'){
        booktype='jsdoc_html';
    }
    return booktype;
}

function img_path_kltxt_b(){
    var imgpath='';
    if (csbookno_global>=0 && csbooklist_sub_global.length>0){
        if (book_type_b(csbooklist_sub_global[csbookno_global],'L')){
            imgpath=book_path_b(csbooklist_sub_global[csbookno_global][3])+'images/'+csbookname_global+'/';
        } else {
            imgpath=book_path_py_b('images',csbooklist_sub_global[csbookno_global][3])+csbookname_global+'/';
        }
    }
    return imgpath;
}

function a_raw_number_kltxt_b(){
    var blnum=1;
    var oa=document.querySelector('a[id^="a_raw_line_number_"]');
    if (oa){
        blnum=parseInt(oa.id.split('a_raw_line_number_')[1]);
    }
    return blnum;
}

function absearch_kltxt_b(csword='',csreg=-1,csonlyone=false){
	var csnum=arguments.length;
	if (csnum==0 || csword==''){
        var csword= document.getElementById('input_search').value.trim();
    }
	document.getElementById('input_search').value=csword;

	if (csnum<=1 || csreg==-1){
        var csreg=document.getElementById('input_reg').checked;
    }
	document.getElementById('input_reg').checked=csreg;

	if (csword==''){return;}

	var start_lineno, end_lineno, csmaxlines;
    [start_lineno,end_lineno,csmaxlines]=start_end_lineno_kltxt_b();

    //这样才能更新搜索关键字
	books_generate_b(false,'txt',book_tag_global);
	
	klwiki_syntaxhighlight_global=false;
	
	var bljg='';
    var list_t=[];
	var blcount=0;
    //ablist 是条件组 - 保留注释
    var ablist=csword.trim().split(';');
    for (let blxl=0,lent=ablist.length;blxl<lent;blxl++){
        //每个条件字符串转化为数组 - 保留注释
	    ablist[blxl] = [ablist[blxl].trim().split(' '),[]];
    }
    var breakfor=false;
	for (let blxl=start_lineno;blxl<end_lineno;blxl++){
		var bltmp = filelist[blxl];
		var blfound=false;
        
        //对每一行内容，遍历条件组 - 保留注释
        for (let bly=0,lent=ablist.length;bly<lent;bly++){
            blfound=str_reg_search_b(bltmp,ablist[bly][0],csreg);
            if (blfound==-1){
                breakfor=true;
                break;
            }
            
            if (blfound){
                //储存行内容和行号 - 保留注释
                ablist[bly][1]=[bltmp,blxl];
                if (bly<ablist.length-1){
                    //将剩余的列表改为空列表 - 保留注释
                    for (let blz=bly+1,lenb=ablist.length;blz<lenb;blz++){
                        ablist[blz][1]=[];
                    }
                    break;
                }
            }
            //搜索到最后一个查询关键字时 - 保留注释
            if (bly==ablist.length-1){
                var match_t=true;
                //如果存储的行内容为空 - 保留注释
                if (ablist[ablist.length-1][1][0]==''){
                    match_t=false;
                } else {
                    //如果存在一项搜索结果为空列表 - 保留注释
                    for (let blz=0,lenb=ablist.length;blz<lenb;blz++){
                        if (ablist[blz][1].length==0){
                            match_t=false;
                            break;
                        }
                    }
                }
                if (match_t){
                    //循环一边当前存储的值 - 保留注释
                    for (let blz=0,lenb=ablist.length;blz<lenb;blz++){
                        if (ablist[blz][1][0]==''){continue;}
                        list_t.push([ablist[blz][1][0],ablist[blz][1][1]]);
                        if (csonlyone){
                            ablist[blz][1]=[];
                        } else {
                            //消除存储的行内容，但不把列表改为空列表 - 保留注释
                            ablist[blz][1][0]='';
                        }
                        blcount=blcount+1;
                        if (blcount>=csmaxlines){
                            breakfor=true;
                            break;
                        }
                    }
                }
            }
        }
        
        if (breakfor){break;}
	}
    lines_2_html_kltxt_b(list_t);
    old_words_kltxt_b(true);
}

function decode_and_create_menu_kltxt_b(){
    if (csbooklist_sub_global.length>0 && book_type_b(csbooklist_sub_global[csbookno_global],'*')){
         for (let item in filelist){
             if (filelist[item].includes('~~')){
                filelist[item]=de_confuse_str_b(filelist[item]); 
            }
        }
    }

    if (csbookname_global.substring(0,6)=='klwiki' && menulist.length==0){
         for (let item in filelist){
             if (filelist[item].substring(0,7)=='<title>' && filelist[item].slice(-8)=='</title>'){
                menulist.push(filelist[item]);
            }
        }
    }

    document.getElementById('linecount').innerHTML='('+filelist.length+'行)';
    document.getElementById('readingdata').innerHTML='';
}

function args_kltxt_b(cskeys){
    function sub_args_kltxt_b_search(csstr,add_recent=true){
        if (csstr.slice(-4)=='_reg'){
            txtsearch_kltxt_b(csstr.substring(0,csstr.length-4),true,-1,add_recent);
        } else {
            txtsearch_kltxt_b(csstr,-1,-1,add_recent);
        }
    }
    //-----------------------
    var blstart_line_no=0;
    for (let bltmpstr of cskeys){   //第1轮 - 保留注释
        bltmpstr=bltmpstr.trim();
        if (bltmpstr.substring(0,14)=='start_line_no='){
            blstart_line_no=bltmpstr.substring(14,);
            if (isNaN(blstart_line_no)){
                var isreg=false;
                [blstart_line_no,isreg]=str_reg_check_b(blstart_line_no,isreg,false);  
                var result_t=txtsearch_list_kltxt_b(blstart_line_no,isreg,1,0,-1,false);      
                if (result_t.length==1){
                    blstart_line_no=result_t[0][1]+1;
                } else {
                    blstart_line_no='';
                }
            }
            var oinput=document.getElementById('input_start_lineno');
            if (oinput){
                oinput.value=blstart_line_no;
            }
        }
    }
        
    for (let bltmpstr of cskeys){   //第2轮 - 保留注释
        bltmpstr=bltmpstr.trim();
        if (bltmpstr.substring(0,5)=='line='){
            var blno_lines=bltmpstr.substring(5,).split('_'); //30_20
            if (blno_lines.length>1){
                getlines_kltxt_b(parseInt(blno_lines[0]), parseInt(blno_lines[1]));
            } else {
                getlines_kltxt_b(parseInt(blno_lines[0]));
            }
            break;
        } else if (bltmpstr.substring(0,2)=='s='){
            var bls_reg=bltmpstr.substring(2,).trim(); //河流_reg
            sub_args_kltxt_b_search(bls_reg);
            break;
        } else if (bltmpstr=='sls'){
            var blstr=temp_search_link_value_get_b();
            sub_args_kltxt_b_search(blstr,false);
            break;
        } else if (bltmpstr.substring(0,3)=='s1='){//返回搜索得到的第一条记录的阅读页面 - 保留注释
            txtsearch_one_kltxt_b(bltmpstr.substring(3,).trim());
            break;
        }
        
        if (location.href.match(/\/(txtlistsearch|digest)\.htm\?/)==null){continue;}
                
        if (bltmpstr.substring(0,3)=='sc='){
            var bls_reg=bltmpstr.substring(3,).trim(); //河流_reg
            if (bls_reg.slice(-4)=='_reg'){
                txtsearch_kltxt_b(bls_reg.substring(0,bls_reg.length-4),true,true);
            } else {
                txtsearch_kltxt_b(bls_reg,false,true);
            }

            break;
        } else if (bltmpstr.substring(0,3)=='ab='){
            var bls_reg=bltmpstr.substring(3).trim(); //河流_reg
            if (bls_reg.slice(-4)=='_reg'){
                absearch_kltxt_b(bls_reg.substring(0,bls_reg.length-4),true,false);
            } else {
                absearch_kltxt_b(bls_reg,false,false);
            }
            break;
        } else if (bltmpstr.substring(0,4)=='ab1='){
            var bls_reg=bltmpstr.substring(4,).trim(); //河流_reg
            if (bls_reg.slice(-4)=='_reg'){
                absearch_kltxt_b(bls_reg.substring(0,bls_reg.length-4),true,true);
            } else {
                absearch_kltxt_b(bls_reg,false,true);
            }
            break;
        }
    }
    recent_search_kltxt_b('',true);
    load_book_js_code_file_kltxt_b();   //载入txt对应js code 文件 - 保留注释
}

function load_book_js_code_file_kltxt_b(){
    function sub_load_book_js_code_file_kltxt_b_do(){
        eval('menu_more_kltxt_'+txtbook_js_code_file_global+'()');
    }
    //-----------------------
    if (txtbook_js_code_file_global==''){return;}
    var file4=['txtadd/txtlistsearch_additional_'+txtbook_js_code_file_global+'_code.js'];
    var file_list=klbase_addons_import_js_b([],[],[],file4,false,false);
    file_dom_create_b(file_list,true,'js');
    load_fn_b('menu_more_kltxt_'+txtbook_js_code_file_global,sub_load_book_js_code_file_kltxt_b_do);
}

function recent_opened_book_set_kltxt_b(bookid,cskeys){
    if (bookid==''){return;}
    for (let item of cskeys){
        if (item.substring(0,3)=='sc='){return;}
    }
    var list_t=[bookid].concat(local_storage_get_b('recent_opened_books',10,true,bookid));
    localStorage.setItem('recent_opened_books',list_t.join('\n'));
}

function recent_opened_book_get_kltxt_b(){
    var list_t=local_storage_get_b('recent_opened_books',10,true);
    var result_t=[];
    for (let item of list_t){
        for (let abook of csbooklist_source_global){
            if (abook[0]==item){
                result_t.push([abook[0],abook[1]]);
                break;
            }
        }
    }
    return result_t;
}

function import_book_kltxt_b(cskeys,csrandom=false){
    if (is_render_page_b()){
        cskeys=[];
    }
    if (cskeys.length>0){
        var list_t=cskeys[0].split('_tag');
        csbookname_global=list_t[0];
        if (list_t.length>=2){
            book_tag_global=list_t[1];
        }
        if (csbookname_global.substring(0,4)=='_tag'){
            book_tag_global=csbookname_global.substring(4,);
            csbookname_global='';
        }
    }
    //---
    book_makelist_b(book_tag_global);
    if (csbookname_global=='' || csbookname_global=='0'){
        if (book_tag_global=='' || book_tag_global=='all' || csrandom==true){
            csbookno_global=Math.min(csbooklist_sub_global.length-1,Math.max(0,(csbooklist_sub_global.length*Math.random()).toFixed(0)));
        } else {
            csbookno_global=0;
        }
        if (csbooklist_sub_global.length>0){
            csbookname_global=csbooklist_sub_global[csbookno_global][0];
        }
    } else {
        recent_opened_book_set_kltxt_b(csbookname_global,cskeys);
    }

    if (csbookno_global<=0){
        if (csbookname_global==''){
            csbookno_global=0;
        } else {
            var blfound=false;           
            for (let blxl=0,lent=csbooklist_sub_global.length;blxl<lent;blxl++){
                if (csbooklist_sub_global[blxl][0]==csbookname_global){
                    csbookno_global=blxl;
                    blfound=true;
                    break;
                }
            }
            
            if (blfound===false){
                //此次添加不在数组中的书籍 - 保留注释
                //csbookname_global 格式：id-name-jsdoc号-是否解密 - 保留注释
                var list_t=csbookname_global.split('-');
                csbookname_global=list_t[0];
                var bname=csbookname_global;
                if (list_t.length>=2){
                    bname=list_t[1];
                }
                var jsdoc_no='1';
                if (list_t.length>=3){
                    jsdoc_no=list_t[2];
                }
                var do_decode='';
                if (list_t.length>=4){
                    do_decode=list_t[3];
                }
                book_makelist_b(csbookname_global);
                csbooklist_sub_global.push([csbookname_global,bname,csbookname_global,jsdoc_no,do_decode]);
                csbookno_global=csbooklist_sub_global.length-1;
            }
        }
    }
    import_book_js_b();
    if (csbooklist_sub_global.length>0){
        book_title_set_kltxt_b(csbooklist_sub_global[csbookno_global][1],parseInt(csbookno_global)+1);
        document.getElementById('readingdata').innerHTML=' - 正在读取数据...';
    } else {
        document.getElementById('booktitle').innerHTML=' <span id="linecount" style="font-size:0.7rem;font-style: italic;"></span>';
    }
}

function book_title_set_kltxt_b(bookname,csno=-1){
    document.getElementById('booktitle').innerHTML=(csno==-1?'':csno+'.')+bookname+' <span id="linecount" style="font-size:0.7rem;font-style: italic;"></span>';
    document.title=(location.href.includes('digest.htm')?'🗃 ':'')+bookname+' - TXT文本搜索';
}

function start_end_lineno_kltxt_b(){
    var ostart=document.getElementById('input_start_lineno');
    var oend=document.getElementById('input_end_lineno');
	var start_lineno = 0;
    if (ostart){
        var blvalue=parseInt(ostart.value);
        if (!isNaN(blvalue)){
            start_lineno=Math.max(0,blvalue-1);
        }
    }
	var end_lineno = filelist.length;
    if (oend){
        var blvalue=parseInt(oend.value);
        if (!isNaN(blvalue) && blvalue>0){
            end_lineno=Math.min(blvalue,end_lineno);
        }
    }
    
    var blmax=rows_max_kltxt_b();
    return [start_lineno,end_lineno,blmax];
}

function rows_max_kltxt_b(){
    var omax=document.getElementById('input_max_lines');
    var blmax=500;
    if (omax){
        blmax=parseInt(omax.value);
    }
    return blmax;
}

function digest_special_raw_set_kltxt_b(){
    if (typeof digest_special_raw_global=='undefined'){
        digest_special_raw_global={'#':new Set(),'*':new Set()};
    }
}

function digest_number_2_txt_kltxt_b(){
    if (typeof digest_scan_hash_global == 'undefined'){
        digest_scan_hash_global=false;
    }
    
    if (digest_scan_hash_global){return;}

    digest_special_raw_set_kltxt_b();
    
    var t0 = performance.now();
    var bllen=filelist.length;
    for (let blxl=0,lent=digest_global.length;blxl<lent;blxl++){
        var item=digest_global[blxl];
        if (item.length>=2 && item.substring(0,1)=='#' && item.slice(-1)=='#'){
            digest_special_raw_global['#'].add(item);   //第一行为0 - 保留注释
            item=parseInt(item.slice(1,-1));
            if (!isNaN(item) && item>=0 && item<bllen){
                digest_global[blxl]=filelist[item];
            }
        }
    }
    digest_scan_hash_global=true;
    console.log('digest_number_2_txt_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function digest_sort_kltxt_b(show_html=true){
    var t0 = performance.now();
    digest_special_raw_set_kltxt_b();
    
    var hash_len=digest_special_raw_global['#'].size;
    var asterisk_len=digest_special_raw_global['*'].size;
    var result_t=[];

    for (let one_digest of digest_special_raw_global['*']){
        var blword=one_digest.slice(1,);
        for (let blxl=0,lent=filelist.length;blxl<lent;blxl++){
            if (filelist[blxl]==''){continue;}
            try {
                if (filelist[blxl].match('\\b'+blword+'\\b')){
                    result_t.push([blxl,one_digest]);
                    break;
                }
            } catch (error){
                //do nothing
            }
        }
    }    

    var digest_t=[].concat(digest_global);
    var hash_count=0;
    
    for (let blxl=0,lent=filelist.length;blxl<lent;blxl++){
        if (filelist[blxl]==''){continue;}
        
        for (let blno=0,lenb=digest_t.length;blno<lenb;blno++){
            var one_digest=digest_t[blno];
            if (one_digest==''){continue;}
            if (one_digest.substring(0,1)=='#'){
                result_t.push([-1,one_digest]);
                digest_t[blno]='';
                hash_count=hash_count+1;
                continue;
            }
            
            if (hash_len>0 && one_digest==filelist[blxl]){
                if (digest_special_raw_global['#'].has('#'+blxl.toString()+'#')){
                    result_t.push([blxl,'#'+blxl+'#']);
                    digest_t[blno]='';  
                }
            } else if (filelist[blxl].includes(one_digest)){ //一行中可能有多个摘要，行内的多个摘要未排序 - 保留注释
                result_t.push([blxl,one_digest]);  
                digest_t[blno]='';  
            }
        }
    }
    
    result_t.sort(function (a,b){return a[0]<b[0]?-1:1;});
    
    if (show_html){
        result_t=array_split_by_col_b(result_t,[1]);
        
        var bljg=textarea_with_form_generate_b('textarea_digest_sort_kltxt_b','height:10rem;','<p>','清空,复制,发送到临时记事本,发送地址','</p>');

        var buttons='<p style="font-size:0.9rem;">原摘要数：'+digest_global.length+'，其中<b>#</b>开头的摘要有：'+hash_count+'；原摘要无重复数：'+new Set(digest_global).size+'；#NO# hash摘要数：'+hash_len+'；*摘要数：'+asterisk_len+'；整理后：'+result_t.length+'</p>';
        buttons=buttons+'<p  style="font-size:0.9rem;">注：原摘要的数字形式会转化为文字形式。原摘要中的<b>#</b>会排在最前面。</p>';
        document.getElementById('divhtml').innerHTML=bljg+buttons;
        document.getElementById('textarea_digest_sort_kltxt_b').value=result_t.join('\n');
    }
    console.log('digest_sort_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
    return result_t;
}

function digest_lines_kltxt_b(recent_lines=-1,do_jump=false,reading_mode=false){
    var t0 = performance.now();
    
    if (reading_mode){
        reading_mode_kltxt_b();
    }
    
	var start_lineno, end_lineno, blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();
    
    var list_t=[];
    var blcount=0;
    digest_number_2_txt_kltxt_b();
    
    if (recent_lines==-1){
        var digest_list=[].concat(digest_global);
    } else {
        var digest_list=digest_global.slice(-1*recent_lines,);
    }
    
    var scanned_number=new Set();
    for (let one_digest of digest_list){
        if (one_digest=='' || one_digest.substring(0,1)=='#'){continue;}

        var all_scanned=true;
        var blfound=false;
        for (let blxl=start_lineno;blxl<end_lineno;blxl++){
            if (scanned_number.has(blxl)){continue;}
            all_scanned=false;
            if (filelist[blxl].includes(one_digest)){
                list_t.push([filelist[blxl],blxl]);
                blfound=true;
                scanned_number.add(blxl);
                break;  
            }
        }
        if (blfound){
            blcount=blcount+1;
            if (blcount>=blmax){break;}        
        }
        if (all_scanned){
            console.log('all_scanned');
            break;
        }
    }
    
    digest_in_bookmark_kltxt_b(Math.max(...scanned_number));
    
    list_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});

    lines_2_html_kltxt_b(list_t);
    old_words_kltxt_b(true);
    digest_show_kltxt_b(false,recent_lines,false,do_jump);
    
    img_load_check_kltxt_b();
    console.log('digest_lines_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function digest_in_bookmark_kltxt_b(pageno){
    var bookmark=reader_lastbook_id_get_b()[1];
    for (let item of bookmark){
        if (item.length<3){continue;}
        if (item[1]==csbookname_global){
            if (pageno+1>parseInt(item[2])){
                alert('摘要位置 '+(pageno+1)+' 超过书签位置 '+parseInt(item[2]));
            }
            console.log(pageno+1,parseInt(item[2]));
            break;
        }
    }
}

function lines_2_html_kltxt_b(cslist,odiv=false){
    var t0 = performance.now();

    var is_group_file=is_group_file_kltxt_b();
	var bljg=format_lines_kltxt_b(cslist,'',-1,is_group_file);
	var cshideno=document.getElementById('check_hide_no').checked;
    
    if (odiv===false){
	    odiv = document.getElementById('divhtml');
    }
    
	if (cshideno){
        odiv.innerHTML='<div>'+bljg+'</div>';
    } else {
        odiv.innerHTML='<ol>'+bljg+'</ol>';
    }
    bible_title_link_generate_kltxt_b();
    console.log('lines_2_html_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');    
    return bljg.length;
}

function digest_show_kltxt_b(do_number_2_txt=true,recent_lines=-1,b_style=false,do_jump=false,ocontainer=false){
    if (do_number_2_txt){
        digest_number_2_txt_kltxt_b();
    }
    
    if (digest_global.length==0){return;}
    
    var oinput=document.getElementById('input_digest');
    if (!oinput){return;}
    if (oinput.checked==false){return;}    
    
    var t0 = performance.now();
    var ospans=container_query_doms_get_kltxt_b('span.txt_content',ocontainer);
    
    if (recent_lines==-1){
        var digest_list=[].concat(digest_global);
    } else {
        var digest_list=digest_global.slice(-1*recent_lines,);
    }
    
    for (let blno=0,lent=digest_list.length;blno<lent;blno++){
        if (digest_list[blno].substring(0,1)=='#'){// && digest_list[blno].slice(-1)!=='#'){
            digest_list[blno]='';   //忽略开头为 # 的 摘要 - 保留注释
        } 
    }
    
    var line_no_list=[];    
    for (let blxl=0,lent=ospans.length;blxl<lent;blxl++){
        line_no_list.push('');
        var oldtxt=ospans[blxl].innerText;
        var oldhtml=ospans[blxl].innerHTML;
        var newhtml=oldhtml;
        for (let blno=0,lenb=digest_list.length;blno<lenb;blno++){
            var one_digest=digest_list[blno];
            var is_whole_line=false;
            if (one_digest==''){continue;}
            if (!newhtml.includes(one_digest)){
                if (one_digest.substring(0,1)!=='#' || one_digest.slice(-1)!=='#'){continue;}
                if (line_no_list[blxl]==''){
                    var oline_no=ospans[blxl].parentNode.querySelector('span.txtsearch_kltxt_lineno');
                    if (!oline_no){continue;}
                    line_no_list[blxl]=(parseInt(oline_no.innerText.slice(1,-1))-1).toString();
                }
                if (line_no_list[blxl]!==one_digest.slice(1,-1)){
                    continue;
                } else {
                    one_digest=oldtxt;
                    is_whole_line=true;
                }
            }
            if (b_style){
                newhtml=newhtml.replace(one_digest,'<b>'+one_digest+'</b>');            
            } else {
                newhtml=newhtml.replace(one_digest,'<span class="span_digest">'+one_digest+'</span>');
            }
            digest_list[blno]='';   //不重复显示同样的摘要 - 保留注释
            if (is_whole_line){break;}
        }
        ospans[blxl].innerHTML=newhtml;
        if (ospans[blxl].innerText!==oldtxt){
            ospans[blxl].innerHTML=oldhtml;
            ospans[blxl].insertAdjacentHTML('afterend','💡');
        }
    }
    
    if (do_jump){
        var odigests=container_query_doms_get_kltxt_b('span.span_digest',ocontainer);
        
        if (odigests.length>0){
            odigests[odigests.length-1].scrollIntoView();
            if (line_no_show_hide_kltxt_b(true,ocontainer)=='none'){
                line_no_show_hide_kltxt_b(false,ocontainer);
            }
        }
    }
    console.log('digest_show() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function digest_temp_load_kltxt_b(cstype=''){
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var new_full_list=[];
    var bllen=csbookname_global.length;
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        if (item.substring(0,bllen+1)==csbookname_global+':'){
            item=item.substring(bllen+1,).trim();
            if (digest_global.includes(item)){continue;}
            digest_global.push(item);
            new_full_list.push(csbookname_global+':'+item);
        } else {
            new_full_list.push(item);
        }
    }
    if (list_t.join('\n')!==new_full_list.join('\n')){
        localStorage.setItem('digest_temp_txtlistsearch',new_full_list.join('\n'));
    }
    digest_enwords_remove_kltxt_b(cstype);    //添加英语单词 - 保留注释
}

function fix_divhtml2_kltxt_b(do_fix=true,ospan=false){
    var otemp=document.getElementById('div_temp_space');
    if (otemp){
        otemp.parentNode.removeChild(otemp);
    }
    var odiv=document.getElementById('divhtml2');
    if (do_fix){
        var rect =odiv.getBoundingClientRect();
        odiv.insertAdjacentHTML('afterend','<div id="div_temp_space" style="height:'+rect.height+'px;"></div>');
        if (ismobile_b()){
            var blmargin='width:100%;';
        } else {
            var blmargin='margin-left:10%;margin-right:10%;max-width:'+Math.max(700,parseInt(document.body.clientWidth*0.5))+'px;';
        }
        odiv.style.cssText='position:fixed;bottom:0;'+blmargin+'padding:0.1rem;height:auto;background-color:'+scheme_global['background']+';border-top:0.2rem solid '+scheme_global['shadow']+';';    
    } else {
        odiv.style.cssText='';
        odiv.scrollIntoView();
    }
    if (ospan){
        ospan.innerText=(ospan.innerText=='固定'?'不固定':'固定');
    }

    var op=document.getElementById('p_temp_digest_bottom_buttons');
    if (op){
        op.style.display=(do_fix?'none':'');
    }    
    var omenu=document.getElementById('menu_temp_digest');
    if (omenu){
        omenu.style.display=(do_fix?'none':'');
    }    
}

function selected_range_get_kltxt_b(){
    var oselection=window.getSelection();
    var oparent=oselection.anchorNode?.parentNode;
    if (!oparent){return;}
    
    if (oparent.classList.contains('txt_content')){
        oselected_kltxt_global=selection_dict_get_b();
    }
}

function selected_range_expand_kltxt_b(do_expand=true,add_to_textarea=false,do_save=false){
    if (typeof(oselected_kltxt_global)=='undefined'){
        selected_range_get_kltxt_b();
    }

    if (typeof(oselected_kltxt_global)=='undefined'){return;}
    
    if (Object.keys(oselected_kltxt_global).length==0){
        selected_range_get_kltxt_b();
    }
    if (selection_generate_b(oselected_kltxt_global)===false){return;}
    if (do_expand){
        selection_expand_b();
    }
    
    if (add_to_textarea){
        var blstr=selection_content_b();
        document.getElementById('textarea_digest_txtlistsearch').value=blstr;
    }
    if (do_save){
        setTimeout(digest_temp_update_kltxt_b,1);
    }
    oselected_kltxt_global={};
}

function digest_temp_add_kltxt_b(do_fix=false){
    fix_divhtml2_kltxt_b(false);
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    
    var bljg='<p id="p_digest_button" style="font-size:0.9rem;line-height:1.5rem;margin:0.5rem;">';
    bljg=bljg+textarea_buttons_b('textarea_digest_txtlistsearch','清空','','','oblong_box');
    bljg=bljg+'<span class="oblong_box" onclick="digest_temp_update_kltxt_b();" title="添加临时摘要">➕</span> ';
    bljg=bljg+'<span class="oblong_box" onclick="digest_temp_jump_to_line_kltxt_b();" title="返回阅读">⤴</span> ';
    bljg=bljg+'<span class="oblong_box" onmouseenter="selected_range_get_kltxt_b();" onclick="selected_range_expand_kltxt_b();">↔</span> ';
    bljg=bljg+'<span class="oblong_box" onmouseenter="selected_range_get_kltxt_b();" onclick="selected_range_expand_kltxt_b(false,true);">cp</span> ';
    bljg=bljg+'<span class="oblong_box" onmouseenter="selected_range_get_kltxt_b();" onclick="selected_range_expand_kltxt_b(false,true,true);">cp➕</span> ';
    bljg=bljg+'<span class="oblong_box" id="span_digest_temp_fix" onclick="fix_divhtml2_kltxt_b(this.innerText==\'固定\',this);">固定</span> '; 
    bljg=bljg+'<span class="oblong_box" onclick="div_digest_bottom_set_kltxt_b();" title="bottom 设置">B</span> '; 
    bljg=bljg+'<span id="span_current_book_temp_digest_count"></span>';     
    bljg=bljg+'</p>';
    
    var left_strings='<p id="p_temp_digest_bottom_buttons" style="font-size:0.9rem;line-height:1.5rem;margin-top:0.2rem;">';
    left_strings=left_strings+'<span class="oblong_box" onclick="document.getElementById(\'divhtml2\').innerHTML=\'\';">关闭</span> ';       
    
    var right_strings=' rows: '+list_t.length+' <span id="span_digest_temp_status"></span></p>';    

    var blstr=textarea_with_form_generate_b('textarea_digest_txtlistsearch','height:4rem; background-color:transparent;',left_strings,'全选,复制,发送到临时记事本,发送地址,↑,↓',right_strings,'','form_digest_textarea',false,'',false,'','oblong_box',true,'margin:0.5rem');

    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML=bljg+blstr;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));

    var str_t=klmenu_hide_b('');
    var digest_menu=[
    '<span class="span_menu" onclick="'+str_t+'digest_temp_show_kltxt_b();">显示当前书籍临时摘要</span>',
    '<span class="span_menu" onclick="'+str_t+'digest_temp_show_kltxt_b(true);">显示全部临时摘要</span>',
    '<span class="span_menu" onclick="'+str_t+'digest_temp_delete_kltxt_b(true);">清除当前书籍所有临时摘要</span>',
    '<span class="span_menu" onclick="'+str_t+'digest_temp_delete_kltxt_b();">清除当前书籍最新添加的一条临时摘要</span>',
    '<span class="span_menu" onclick="'+str_t+'digest_temp_copy1_kltxt_b();">复制编辑框第一条内容</span>',
    ];
    document.getElementById('p_digest_button').insertAdjacentHTML('afterbegin',klmenu_b(digest_menu,'🔻','21rem','0.8rem','0.9rem','','','menu_temp_digest')+' ');
    
    if (do_fix){
        var ospan=document.getElementById('span_digest_temp_fix');
        if (ospan){
            fix_divhtml2_kltxt_b(true,ospan);
        }
    }
    location.href='#divhtml2';
}

function digest_temp_copy1_kltxt_b(){
    var blstr=document.getElementById('textarea_digest_txtlistsearch').value.trim().split('\n')[0];
    copy_2_clipboard_b(blstr);
}

function div_digest_bottom_set_kltxt_b(){
    var odiv=document.getElementById('divhtml2');
    var old_value=odiv.style.bottom;
    var new_value=prompt('输入bottom值',old_value);
    if (new_value==null || new_value==old_value){return;}    
    odiv.style.bottom=new_value;
}

function digest_temp_jump_to_line_kltxt_b(){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    
    var blstr=otextarea.value.trim().split('\n').slice(-1)[0];  //最后一行的字符串 - 保留注释
    if (blstr==''){
        location.href='#divhtml';
        return;
    }
    var blstr2=blstr.replace(/^#*/g,'').trim();
    
    var ospans=document.querySelectorAll('div#divhtml span.txt_content');
    for (let item of ospans){
        if (item.innerText.includes(blstr) || blstr2!=='' && item.innerText.includes(blstr2)){
            item.scrollIntoView();
            break;
        }
    }
}

function digest_excluded_kltxt_b(){
    digest_number_2_txt_kltxt_b();
    var excluded_list=[];
    var bllen=filelist.length-1;
    for (let item of digest_global){
        item=item.trim();
        if (item==''){continue;}
        var blfound=false;
        for (let one_row of filelist){
            if (one_row.includes(item)){
                blfound=true;
                break;
            }
        }
        if (blfound===false){
            excluded_list.push(item);
            if (excluded_list.length>=500){break;}
        }
    }
    
    list_t=[].concat(digest_global);
    list_t.sort();
    var blstr='';
    var duplication=new Set();
    for (let item of list_t){
        if (item==blstr){
            duplication.add(item);
        } else {
            blstr=item;
        }
    }
    var bljg='<h4>未包含的摘要</h4>'+array_2_li_b(excluded_list,'li','ol')+(excluded_list.length>=500?'<p>超长省略...</p>':'');
    bljg=bljg+'<h4>重复的摘要</h4>'+array_2_li_b(Array.from(duplication),'li','ol');
    document.getElementById('divhtml').innerHTML=bljg;    
}

function digest_temp_show_kltxt_b(is_all=false){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var new_full_list=[];
    var new_current_list=[];
    var bllen=csbookname_global.length;
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        if (item.substring(0,bllen+1)==csbookname_global+':'){
            item=item.substring(bllen+1,).trim();
            new_full_list.push(csbookname_global+':'+item);
            new_current_list.push(item);
        } else {
            new_full_list.push(item);
        }
    }
    
    if (is_all){
        otextarea.value=new_full_list.join('\n');
    } else {
        otextarea.value=new_current_list.join('\n');
    }
}

function digest_temp_delete_kltxt_b(isall=false){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var new_full_list=[];
    var current_book_list=[];
    var bllen=csbookname_global.length;
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        if (item.substring(0,bllen+1)==csbookname_global+':'){
            current_book_list.push(item);
            continue;
        }
        new_full_list.push(item);
    }
    if (current_book_list.length>0){
        var rndstr=randstr_b(4,true,false);
        var do_change=false;
        if (isall){
            if ((prompt('输入 '+rndstr+' 确认清空当前书籍的临时摘要'+current_book_list.length+'条') || '').trim()==rndstr){
                do_change=true;
            }
        } else {
            if ((prompt('输入 '+rndstr+' 确认清空当前书籍的最新一条临时摘要\n'+current_book_list.slice(-1)[0]) || '').trim()==rndstr){
                new_full_list=new_full_list.concat(current_book_list.slice(0,-1));
                do_change=true;
            }
        }
        if (do_change){
            localStorage.setItem('digest_temp_txtlistsearch',new_full_list.join('\n'));
            alert('原有临时摘要共'+list_t.length+'条，现有'+new_full_list.length+'条');
        }
    }
}

function digest_temp_update_kltxt_b(){
    var otextarea=document.getElementById('textarea_digest_txtlistsearch');
    if (!otextarea){return;}
    var blstr=otextarea.value.trim();
    if (blstr.includes(csbookname_global+':')){return;}
    
    var list_t=blstr.split('\n');
    var digest_list=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    var blxl=0;
    var last_row='';
    for (let one_row of list_t){
        one_row=one_row.trim();
        if (one_row==''){continue;}
        
        if (digest_list.includes(csbookname_global+':'+one_row)){
            continue;
        }
        if (confirm("是否添加临时摘要？\n"+one_row)){
            digest_list.push(csbookname_global+':'+one_row);
            last_row=one_row;
            blxl=blxl+1;
        }
    }
    if (blxl>0){
        localStorage.setItem('digest_temp_txtlistsearch',digest_list.join('\n'));
        document.getElementById('span_digest_temp_status').innerHTML='<span style="background-color:'+rndcolor_b()+';border-radius:1rem;padding-right:1rem;">&nbsp;</span> <font color="'+scheme_global['a']+'"><b>'+now_time_str_b()+'</b></font> 添加了<font color="'+scheme_global['a-hover']+'"><b>'+blxl+'</b></font>条临时摘要('+specialstr92_b(last_row.substring(0,20))+'...)';
        
        digest_list=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
        var blno=0;
        for (let one_row of digest_list){
            if (one_row.indexOf(csbookname_global+':')==0){
                blno=blno+1;
            }        
        }
        document.getElementById('span_current_book_temp_digest_count').innerHTML='('+blno+')';
    }
}

function break_line_kltxt_b(){
    var blkey=document.getElementById('input_search').value.trim();
    var isreg=document.getElementById('input_reg').checked;
    
    [blkey,isreg]=str_reg_check_b(blkey,isreg);
    document.getElementById('input_reg').checked=isreg;
    
    if (blkey==''){return;}
    if (isreg){
        try {
            ''.match(blkey);
            ''.replace(new RegExp('('+blkey+')','g'),'\n$1');
        } catch (error){
            alert(error.message);
            return;
        }
    }
    
    var result_t=[];
    var unique_t=[];
    if (isreg){
        for (let item of filelist){
            if (item.match(blkey)!==null){
                result_t.push(item.replace(new RegExp('('+blkey+')','g'),'\n$1'));
                unique_t=unique_t.concat(item.match(new RegExp('('+blkey+')','g')));
            }
        }
    } else {
        for (let item of filelist){
            if (item.includes(blkey)){
                result_t.push(item.replace(new RegExp('('+blkey+')','g'),'\n$1'));
                unique_t=unique_t.concat(item.match(new RegExp('('+blkey+')','g')));
            }
        }
    }
    
    if (result_t.length==0){return;}
    result_t=result_t.join('\n').split('\n');   //重新分段 - 保留注释

    unique_t=array_unique_b(unique_t);
    unique_t.sort();
    var unique_str='';
    for (let blxl=0,lent=unique_t.length;blxl<lent;blxl++){
        unique_str=unique_str+(blxl+1)+'. '+unique_t[blxl]+'; ';
    }
    
    var bljg=[];    //剔除分段后无关键字的行 - 保留注释
    if (isreg){
        for (let item of result_t){
            if (item.match(blkey)!==null){
                bljg.push(item);
            }
        }
    } else {
        for (let item of result_t){
            if (item.includes(blkey)){
                bljg.push(item);
            }        
        }
    }
    bljg.sort(function (a,b){return zh_sort_b(a,b);});
    var blbuttons='<p>'+close_button_b('divhtml2','')+'</p>';
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML='<div style="margin-left:1rem;">'+array_2_li_b(bljg,'li','ol')+'<hr />'+unique_str+blbuttons+'</div>';
    odiv.scrollIntoView();
}

function random_book_current_category_kltxt_b(){
    if (csbooklist_sub_global.length==0){return;}
    var blno=randint_b(0,csbooklist_sub_global.length-1);
    var item=csbooklist_sub_global[blno];
    var href='?'+item[0]+'_tag'+book_tag_global+'&line=1';
    location.href=href;
}

function category_generate_bltxt_b(){
    var op=document.getElementById('p_book_list');
    var bljg='<span class="span_link" onclick="books_generate_b(\'switch\',\'txt\',book_tag_global);"><b>Books</b></span> <a href="?&line=0_0">RND</a> ';
    if (book_tag_global!=='all'){
        bljg=bljg+'<span class="span_link" onclick="random_book_current_category_kltxt_b();">RND(current)</span> ';
    }
    bljg=bljg+'<span style="cursor:pointer;" onclick="popup_show_hide_b(\'span_book_category\',\'\');">🧩</span> ';
    bljg=bljg+'<span id="span_book_category" style="display:none;"></span> <span id="booklinks"></span>';
    op.innerHTML=bljg;
    book_category_b('span_book_category',['演义','圣经','KLWiki'],book_tag_global);    
    books_generate_b(false,'txt',book_tag_global);    
}

function is_sc_kltxt_b(cskeys){
    for (let item of cskeys){
        item=item.trim();
        if (item.substring(0,3)=='sc='){
            return true;
        }
    }
    return false;
}

function init_kltxt_b(cstype,cskeys){
    if (book_tag_global=='🔖' && csbooklist_sub_global.length==0){
        location.href='?&line=0_0';
    }
    
    switch (cstype){
        case 'reader':
            character_2_icon_b('📕️️');
            break;
        case 'txtlistsearch':
            character_2_icon_b('📚️️');
            break;
    }
    buttons_generate_kltxt_b(cstype);
    
    html_name_kltxt_global=cstype;  //全局变量
    layout_done_kltxt_global=false; //全局变量
    decode_and_create_menu_kltxt_b();
    
    if (!is_sc_kltxt_b(cskeys)){
        layout_kltxt_b(cstype);
    }
    args_kltxt_b(cskeys);
    if (csbookname_global=='klwiki_en2'){
        local_storage_today_b('klwiki_en2_rows',40,filelist.length,'/');
    }
}

function buttons_generate_kltxt_b(cstype){
    if (['txtlistsearch','digest'].includes(cstype)){
        var op=document.getElementById('p_search_menu_kltxt');
        if (op){
            op.insertAdjacentHTML('afterbegin',`搜索范围：从第 <input type="number" id="input_start_lineno" style="width:6rem;" ondblclick='this.value="";'> 行开始，到第  <input type="number" id="input_end_lineno" style="width:6rem;" ondblclick='this.value="";'> 行为止`);
        }
    }

    if (['txtlistsearch','digest','reader'].includes(cstype)){
        var list_t={
        'Highlight':['input_highlight','checked'],
        'Digest':['input_digest','checked'],
        '目录加粗':['input_menu_bold','checked'],
        '隐藏序号':['check_hide_no','checked'],
        '隐藏行号':['check_hide_lineno','checked'],
        'KLWiki format':['check_klwiki_format','checked'],
        };
        if (cstype=='txtlistsearch'){
            list_t['隐藏序号'][1]='';
            list_t['隐藏行号'][1]='';
        } else if (cstype=='digest'){
            delete list_t['Digest']; 
            delete list_t['目录加粗']; 
        }
        var result_t=[];
        for (let key in list_t){
            result_t.push('<label><input type="checkbox" id="'+list_t[key][0]+'"'+(list_t[key][1]==''?'':' '+list_t[key][1])+' />'+key+'</label>');
        }
        var ospan=document.getElementById('span_checkboxes_txtbook');
        ospan.innerHTML=result_t.join('\n');
        
        var ospan=document.getElementById('span_lines_config_txtbook');
        ospan.innerHTML='&nbsp;搜索结果最大行数：<input type="number" id="input_max_lines" style="width:5rem;" value="500" />&nbsp;行号：<input type="number" style="width:5rem;" min=1 step=1 onkeyup="if (event.key==\'Enter\'){jump_2_line_no_kltxt_b(this.value);}" placeholder="跳转到指定行" />';
        if (cstype=='reader'){
            ospan.style.display='none';
        }
    }
}

function jump_2_line_no_kltxt_b(csno){
    var csno=parseInt(csno);
    if (isNaN(csno)){return;}
    if (csno<1){return;}
    
    var ospans=document.querySelectorAll('#divhtml span.txt_content');
    if (ospans.length>=csno){
        ospans[csno-1].scrollIntoView();
    }
}

function layout_kltxt_b(cstype=''){
    function sub_layout_kltxt_b_fn(){
        enwords_mini_search_frame_style_b();
        enwords_mini_search_frame_form_b();    
    }
    //-----------------------
    if (layout_done_kltxt_global){return;}
    layout_done_kltxt_global=true;

    menu_all_only_one_kltxt_b();
    digest_temp_load_kltxt_b(cstype);
    //上一行放在 menu_all_only_one_kltxt_b 之后，此函数末尾执行 digest_enwords_remove_kltxt_b();，在其中设置缓存：txt_englishwords_excluded - 保留注释

    input_with_x_b('input_search',15);

    category_generate_bltxt_b();    
    txtmenus_kltxt_b(html_name_kltxt_global);
    change_colors_kltxt_b();
    
    create_menulist_kltxt_b();
    if (cskeys.length==1 && (cskeys[0]=='' || cskeys[0].substring(0,4)=='_tag')){
        getlines_kltxt_b();
    }    
    if (csbookname_global=='klwiki_en2'){
        load_fn_b('days_kltxt_'+txtbook_js_code_file_global,function (){eval('days_kltxt_'+txtbook_js_code_file_global+'()');});
    }
    
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.7rem':'1.4rem'),true,html_name_kltxt_global=='reader',2);    

    enwords_init_b(true,true,sub_layout_kltxt_b_fn);
}

function digest_enwords_remove_kltxt_b(cstype=''){
    if (cstype=='digest'){return;}
    //摘要转为例句，digest_import_enwords，与KLfuns_txtbook_enwords.py 及 enwords_klwiki_from_books_terminal.py 对应 - 保留注释
    var t0 = performance.now();
    var csstr=local_storage_get_b('txt_englishwords_excluded');
    var excluded_words=csstr.split('\n');
    var enwords_changed=false;
    
    digest_special_raw_set_kltxt_b();
    
    if (csstr.includes(csbookname_global+' /// ')){
        var result_t=[];
        for (let item of excluded_words){
            if (item.indexOf(csbookname_global+' /// ')==0){
                enwords_changed=true;
                continue;
            }
            result_t.push(item);
        }
        excluded_words=result_t;
    }
    
    //---
    var new_list=[];
    //var menu_list=new Set();    //如果使用 list 则极慢 - 保留注释
    //if (typeof kltxt_menulist_index_global == 'object' && Array.isArray(kltxt_menulist_index_global)){  //添加目录行号 - 保留注释
        //for (let item of kltxt_menulist_index_global){
            //menu_list.add(item[0]);
        //}
    //}
    var menu_list=new Set(menu_no_get_kltxt_b());
    
    for (let item of digest_global){
        if (item.substring(0,1)!=='*'){
            new_list.push(item);
            continue;
        } else {  //摘要中*号开头的作为英语单词 - 保留注释
            digest_special_raw_global['*'].add(item);
        }
        
        var blword=item.substring(1,).trim();
        try {
            ''.match(new RegExp('\\b'+blword+'\\b','i')); //测试正则表达式 - 保留注释
        } catch (error){continue;}

        var blleft='';
        var blright='';
        if (blword.includes(' ')){
            blleft='<u>';
            blright='</u>';
        }
        var blfound=false;

        for (let blxl=0,lent=filelist.length;blxl<lent;blxl++){
            if (menu_list.has(blxl)){continue;}
            if (filelist[blxl].length<50){  //例句最短长度 - 保留注释
                menu_list.add(blxl);
                continue;
            }
            
            var arow=filelist[blxl];
            if (arow.match(new RegExp('\\b'+blword+'\\b','i'))==null){continue;}
            if (arow.match(new RegExp('\\-'+blword+'\\b','i'))!==null){continue;}   //如果字符前是- - 保留注释
            
            if (arow.includes('<') && arow.includes('>')){
                var bltmp_str=(arow.match(/<.*?>/g) || []).join(' ');
                if (bltmp_str.match(new RegExp('\\b'+blword+'\\b','i'))!==null){continue;}
            }
            if (arow.includes('&lt;') && arow.includes('&gt;')){            
                var bltmp_str=(arow.match(/&lt;.*?&gt;/g) || []).join(' ');
                if (bltmp_str.match(new RegExp('\\b'+blword+'\\b','i'))!==null){continue;}
            }
            
            filelist[blxl]=filelist[blxl].replace(new RegExp('\\b('+blword+')\\b','i'),blleft+'$1'+blright+sup_kleng_style_b()+blword+'</sup>');
            blfound=true;
            break;
        }
        if (blfound===false){
            filelist.push('* '+blleft+blword+blright+sup_kleng_style_b()+blword+'</sup>');  //如果未发现单词，则添加到 filelist 末尾 - 保留注释
            excluded_words.push(csbookname_global+' /// '+blword);
            enwords_changed=true;
        }
    }
    if (enwords_changed){
        localStorage.setItem('txt_englishwords_excluded',excluded_words.join('\n'));
    }
    digest_global=new_list;
    console.log('digest_enwords_remove_kltxt_b() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function menu_no_get_kltxt_b(){
    if (typeof kltxt_menulist_index_global == 'object' && Array.isArray(kltxt_menulist_index_global)){  //添加目录行号 - 保留注释
        return array_split_by_col_b(kltxt_menulist_index_global,[0]);
    }
    return [];
}

function best_sentences_kltxt_b(csid,filter_str='',csreg=false){
    function sub_best_sentences_kltxt_b_remove(ospan){
        var oparent=ospan.parentNode;
        if (!oparent){return;}
        if (['li','p'].includes(oparent.tagName.toLowerCase())){
            oparent.outerHTML='';
        }
    }
    
    function sub_best_sentences_kltxt_b_textarea(){
        if (pushed_words.size>0){
            all_found_new_words=array_union_b(all_found_new_words,pushed_words,true);

            pushed_words=Array.from(pushed_words);
            var blstr='<textarea style="max-width:10rem;" onclick="this.select();document.execCommand(\'copy\');">*'+pushed_words.join('\n*')+'</textarea>';
            blstr=blstr+'<textarea style="max-width:10rem;" onclick="this.select();document.execCommand(\'copy\');">'+pushed_words.join('|').replace(/\s/g,'\\s')+'</textarea>';
            result_t.push(blstr);
            pushed_words=new Set();
        }
    }
    
    en_word_temp_get_b();
    var result_t=[];
    var odiv=document.getElementById('divhtml');
    var ospans=odiv.querySelectorAll('span.txt_content,span.span_inserted_menu');
    var has_menu=odiv.querySelector('span.span_inserted_menu')!==null;
    var words_in_book=new Set();
    var page_name='';
    var pushed_words=new Set();    
    var all_found_new_words=new Set();
    var page_no=0;
    var sentence_no=0;

    var sentence_in_one_page={};
    if (typeof en_sentence_global !== 'undefined'){
        for (let arow of en_sentence_global){
            if (arow[2].endsWith('_TLS')){
                var blkey='=== '+arow[2].slice(0,-4)+' ===';
            } else {
                var blkey='=== '+arow[2]+' ===';
            }
            if (sentence_in_one_page[blkey]==undefined){
                sentence_in_one_page[blkey]=[];
            }
            if (Array.isArray(arow[0])){
                sentence_in_one_page[blkey].push(arow[0].join(''));
            } else {
                sentence_in_one_page[blkey].push(arow[0]);
            }
        }
        for (let blkey in sentence_in_one_page){
            sentence_in_one_page[blkey]=sentence_in_one_page[blkey].join('\n');
        }
    }
    
    for (let one_span of ospans){
        if (one_span.classList.contains('span_inserted_menu')){
            words_in_book=new Set();
            page_name=one_span.innerText;
            if (sentence_in_one_page[page_name]==undefined){
                console.log('✗例句中无：',page_name);
                var current_page_key='';
            } else {
                console.log('✔例句中有：',page_name);
                var current_page_key=page_name;
            }
            sub_best_sentences_kltxt_b_textarea();
        }
        
        var owords=one_span.querySelectorAll('span.span_key_highlight, span.span_rare_word_search_links, span.span_new_word_search_links');
        var word_set=new Set();
        for (let one_word of owords){
            var blstr=one_word.innerText;
            if (has_menu){
                if (words_in_book.has(blstr)){continue;}
                words_in_book.add(blstr);
            }
            word_set.add(blstr);
        }
        
        if (word_set.size==0){
            sub_best_sentences_kltxt_b_remove(one_span);
            continue;
        }
        
        var whole_str=one_span.innerText;
        if (filter_str!==''){   //条件形如：-[“”‘’](:r)，当不符合条件时，剔除 - 保留注释
            var blfound=str_reg_search_b(whole_str,filter_str,csreg);
            if (!blfound){
                sub_best_sentences_kltxt_b_remove(one_span);
                continue;
            }
        }
        
        var list_t=whole_str.match(/\b[A-Z][a-zA-Z\s,\-'’]{80,}[\.\?\!]/g) || [];
        if (list_t.length==0){
            sub_best_sentences_kltxt_b_remove(one_span);
            continue;
        }
        
        var is_pushed=false;
        for (let one_sentence of list_t){
            for (let one_word of word_set){
                try {
                    var blreg=new RegExp('\\b'+one_word+'\\b');                
                    if (current_page_key!=='' && sentence_in_one_page[current_page_key].match(blreg)){
                        console.log('发现单词：',one_word); //,word_set,sentence_in_one_page[0],sentence_in_one_page[1],one_sentence); //余下部分保留 - 保留注释
                        continue;   //应该使用 continue 而不是 break，有可能klwiki_en2中存在其他不存在于例句中的单词 - 保留注释
                    }

                    if (one_sentence.match(blreg)){
                        var new_str=en_one_word_b([one_word,'',''],[-1,0],'',false,true);
                        new_str=one_sentence.replace(blreg,new_str);
                        if (!result_t.includes(new_str)){
                            if (page_name!==''){
                                page_no=page_no+1;
                                result_t.push('<span style="font-size:large;font-weight:bold;">'+page_no+'. '+page_name+'</span>');
                                page_name='';
                            }
                            sentence_no=sentence_no+1;                            
                            result_t.push(sentence_no+'. '+new_str);
                            pushed_words.add(one_word);
                            is_pushed=true;
                        }
                        break;
                    }
                } catch (error){break;}
            }
        }
        
        if (is_pushed==false){
            sub_best_sentences_kltxt_b_remove(one_span);
        }
    }

    sub_best_sentences_kltxt_b_textarea();
    
    all_found_new_words=Array.from(all_found_new_words);
    all_found_new_words.sort();
    for (let blxl=0,lent=all_found_new_words.length;blxl<lent;blxl++){
        all_found_new_words[blxl]=[all_found_new_words[blxl]];
    }
    var buttons='<p>'+enwords_js_wiki_textarea_b(all_found_new_words)+close_button_b(csid,'')+'<span class="aclick" onclick="document.getElementById(\''+csid+'\').scrollIntoView();">跳转到第1行</span></p>';
    var ocontainer=document.getElementById(csid);
    ocontainer.innerHTML='<div style="margin:2rem;"><p>'+result_t.join('</p><p>')+'</p>'+buttons+'</div>';
    ocontainer.scrollIntoView();
}
