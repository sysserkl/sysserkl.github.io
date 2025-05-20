function import_files_seen(){
    if (is_local_b()){
        var flist=['data/klwiki/klwiki_page_position_data.js'];
        for (let blxl=0,lent=flist.length;blxl<lent;blxl++){
            flist[blxl]='../../../../'+flist[blxl];
        }
        klbase_addons_import_js_b([],[],['words/enwords_data.js'],flist);
    }
}

function import_data_seen(){
    if (is_local_b()){
        var blpath=klwebphp_path_b('data/php_writable/');
        
        flist=[
        blpath+'selenium_enwords_data',
        ];
        import_data_rlater_b(flist,'load_data_seen','');
    }
}

function load_data_seen(fname=''){
    function sub_load_data_seen_run(){
        var t0 = performance.now();
        var oldset=simple_words_b();
        var blxl=selenium_enwords_data_global.length;
        for (let item of selenium_enwords_data_original_global){
            item.push(blxl); //4 添加 序号 - 保留注释    
            item.push((item[0]+item[1]).length); //5 添加 href+title 长度 - 保留注释    
            item.push(item[3].length); //6 添加 words 个数 - 保留注释    
            item.push(-1); //7 添加 临时统计用数值 - 保留注释    
            item.push(fname); //8 添加 来源文件名 - 保留注释
            item.push(enwords_array_to_links_b(item[3],oldset,true));   //,'count_one_seen'. 9 添加 words html - 保留注释
            if (item[0].includes('//')){
                item.push(item[0].split('//')[1].split('/')[0]);    //10 添加 host - 保留注释
            } else {
                item.push('');
            }
            item.push(href2date_b(item[0]));    //11 添加 href 中的 年月日 日期，不支持 /17-Jul-2024/ - 保留注释
            selenium_enwords_data_global.push(item);
            blxl=blxl+1;
        }
        console.log('load_data_seen',fname,selenium_enwords_data_original_global.length,'费时：'+(performance.now() - t0) + ' milliseconds');
        selenium_enwords_data_original_global=[];    
    }
    if (typeof enwords=='undefined'){
        load_enword_file_b('enwords','enwords',sub_load_data_seen_run);
    }
    else {
        sub_load_data_seen_run();
    }
}

function sort_seen(desc=false){
    var bltype=document.getElementById('select_raw_sort_id_seen').value;
    var no_list={'href': 0, 'title': 1, 'host': 2, 'string length': 5, 'count': 6, 'rare words': 7, 'old words': 7,'date': 11};

    var margin_id=-1;
    switch (bltype){
        case 'random':
            var bltimes=randint_b(2,5);
            for (let blxl=0;blxl<bltimes;blxl++){
                selenium_enwords_data_global.sort(randomsort_b);
            }
            break;  
        case 'rare words':
            rare_words_seen();
            break;
        case 'old words':
            old_words_seen();
            break;
        case 'contain':
            margin_id=contain_seen(desc);
            break;
        case 'one2more':
            margin_id=one2more_seen(desc);
            break;
        case 'host count':
            host_count_seen(desc?'desc':'asc');
            break;
    }
    
    if (bltype in no_list){
        var col_no=no_list[bltype];
        if (desc){
            selenium_enwords_data_global.sort(function (a,b){return a[col_no]<b[col_no] ? 1 : -1;});            
        } else {
            selenium_enwords_data_global.sort(function (a,b){return a[col_no]>b[col_no] ? 1 : -1;});
        }
    }
    
    switch (bltype){
        case 'rare words':
        case 'old words':
            for (let blxl=0,lent=selenium_enwords_data_global.length-1;blxl<lent;blxl++){ //不含最后一条记录 - 保留注释
                if (selenium_enwords_data_global[blxl][7]==0 && selenium_enwords_data_global[blxl+1][7]!==0){
                    margin_id=selenium_enwords_data_global[blxl][4];
                    break;
                } else if (selenium_enwords_data_global[blxl][7]!==0 && selenium_enwords_data_global[blxl+1][7]==0){
                    margin_id=selenium_enwords_data_global[blxl][4];
                    break;
                }
            }
            break;
    }
    
    search_seen('',margin_id);
}

function href_date_sort_seen(isdesc=false){
    if (isdesc){
        selenium_enwords_data_global.sort((a,b) => {return a[11]<b[11] ? 1 : -1;});
    } else {
        selenium_enwords_data_global.sort((a,b) => {return a[11]>b[11] ? 1 : -1;});
    }
}

function host_count_seen(cstype=''){
    function sub_host_count_seen_item(item){
        var blkey='h_'+item[10];
        if (host_dict[blkey]==undefined){
            host_dict[blkey]=0;
        }
        host_dict[blkey]=host_dict[blkey]+1;    
    }
    
    var host_dict={};
    
    if (cstype=='status'){
        for (let item of selenium_enwords_current_global){
            sub_host_count_seen_item(item[2]);
        }
    } else {
        for (let item of selenium_enwords_data_global){
            sub_host_count_seen_item(item);
        }
    }
    
    switch (cstype){
        case 'desc':
            selenium_enwords_data_global.sort((a,b) => {return host_dict['h_'+a[10]]<host_dict['h_'+b[10]] ? 1 : -1;});
            break;
        case 'asc':
            selenium_enwords_data_global.sort((a,b) => {return host_dict['h_'+a[10]]>host_dict['h_'+b[10]] ? 1 : -1;});
            break;
        case 'status':
            host_dict=object2array_b(host_dict,true,2);
            host_dict.sort();
            host_dict.sort((a,b) => {return a[1]<b[1] ? 1 : -1;});
            var host_href_list=[];
            for (let item of host_dict){
                host_href_list.push('https://'+item[0]);
            }            
            document.getElementById('div_search_links').innerHTML='<div style="column-count:'+(ismobile_b()?2:4)+';">'+array_2_li_b(host_dict)+'</div><textarea>'+host_href_list.join('\n')+'</textarea>';
            break;
    }
}

function contain_seen(desc=false){
    selenium_enwords_data_global.sort(function (a,b){return a[6]<b[6] ? 1 : -1;});    
    
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        selenium_enwords_data_global[blxl][7]=-1;
    }
    
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        if (selenium_enwords_data_global[blxl][7]!==-1){continue;}
        var mother_words=selenium_enwords_data_global[blxl][3];
        var blcount=0;
        var found_no=-1;
        for (let blno=0,lenb=selenium_enwords_data_global.length;blno<lenb;blno++){
            if (selenium_enwords_data_global[blno][7]!==-1){continue;}
            
            var son_words=selenium_enwords_data_global[blno][3];
            
            var is_contain=true;
            if (blxl!==blno){
                for (let one_word of son_words){
                    if (mother_words.includes(one_word)){continue;}
                    is_contain=false;
                    break;
                }
            }
            
            if (is_contain){
                selenium_enwords_data_global[blno][7]=selenium_enwords_data_global[blxl][4];
                found_no=blno;
                blcount=blcount+1;
            }
        }
        
        if (blcount==1){
            selenium_enwords_data_global[found_no][7]=-1;
        }
    }

    var margin_id=group_seen(true);
    
    if (desc){
        selenium_enwords_data_global.reverse();
    }
    return margin_id;
}

function group_seen(is_contain){
    var result_t={};
    var others_t=[];
    for (let arow of selenium_enwords_data_global){
        if (arow[7]==-1){
            others_t.push(arow);
            continue;
        }
        
        var blkey='w_'+arow[7];
        if (result_t[blkey]==undefined){
            result_t[blkey]=[];
        }
        result_t[blkey].push(arow);
    }    

    selenium_enwords_data_global=[];
    if (is_contain){
        for (let key in result_t){
            result_t[key].sort(function (a,b){return a[6]<b[6] ? 1 : -1;});
            selenium_enwords_data_global=selenium_enwords_data_global.concat(result_t[key]);
        }
    } else {
        for (let key in result_t){
            result_t[key].sort(function (a,b){return a[6]>b[6] ? 1 : -1;});
            selenium_enwords_data_global=selenium_enwords_data_global.concat(result_t[key]);
        }
    }    
    
    var margin_id=-1;
    if (selenium_enwords_data_global.length>0){
        margin_id=selenium_enwords_data_global.slice(-1)[0][4];
    }
    others_t.sort(function (a,b){return a[3][0]>b[3][0] ? 1 : -1;});
    selenium_enwords_data_global=selenium_enwords_data_global.concat(others_t);
    return margin_id;
}

function one2more_seen(desc=false){
    selenium_enwords_data_global.sort(function (a,b){return a[6]>b[6] ? 1 : -1;});
    
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        selenium_enwords_data_global[blxl][7]=-1;
    }
    
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        if (selenium_enwords_data_global[blxl][7]!==-1){continue;}
        if (selenium_enwords_data_global[blxl][6]>1){break;}
        
        var one_word=selenium_enwords_data_global[blxl][3][0];
        var blcount=0;
        var found_no=-1;
        for (let blno=0,lenb=selenium_enwords_data_global.length;blno<lenb;blno++){
            if (selenium_enwords_data_global[blno][7]!==-1){continue;}
            if (!selenium_enwords_data_global[blno][3].includes(one_word)){continue;}
            selenium_enwords_data_global[blno][7]=selenium_enwords_data_global[blxl][4];

            found_no=blno;
            blcount=blcount+1;
        }
        if (blcount==1){
            selenium_enwords_data_global[found_no][7]=-1;
        }
    }

    var margin_id=group_seen(false);        
    if (desc){
        selenium_enwords_data_global.reverse();
    }
    return margin_id;
}

function title_words_seen(){
    var word_dict={};
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        var arow=selenium_enwords_data_global[blxl];
        var set_t=new Set(arow[1].match(/[a-z]{2,}/ig) || []);
        
        for (let one_word of set_t){
            var blkey='w_'+one_word.toLowerCase();
            if (word_dict[blkey]==undefined){
                word_dict[blkey]=0;
            }
            word_dict[blkey]=word_dict[blkey]+1;
        }
    }
    word_dict=object2array_b(word_dict,true,2);
    word_dict.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    word_dict=word_dict.slice(0,1000);
    for (let blxl=0,lent=word_dict.length;blxl<lent;blxl++){
        word_dict[blxl]=word_dict[blxl][0];
    }
    recent_search_b('',word_dict,'search_seen','div_recent_search',[],1000,true,1000);
}

function rare_words_seen(){
    var word_dict=selenium_enwords_count_enbook_b();
    //word_dict 形如：Object { w_remediated: 6, w_revalidate: 1, w_unintuitive: 15, w_changelogs: 3, w_scalability: 47, w_unmoderated: 8, w_datatypes: 1, w_exmples: 1, w_observability: 28, w_parsers: 8, … } - 保留注释
    rare_score_seen(word_dict,3);
}

function rare_score_seen(word_dict,word_col_no){
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        var words=selenium_enwords_data_global[blxl][word_col_no];
        var blcount=0;
        for (let one_word of words){
            var blkey='w_'+one_word;
            if (word_dict[blkey]==1){
                blcount=0;
                break;
            }
            blcount=blcount+word_dict[blkey];
        }
        selenium_enwords_data_global[blxl][7]=blcount/words.length;
    }
}

function old_words_seen(){
    var oldset=simple_words_b();
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        var words=selenium_enwords_data_global[blxl][3];
        var blcount=0;
        for (let one_word of words){
            if (!oldset.has(one_word)){continue;}
            blcount=blcount+1;
        }
        selenium_enwords_data_global[blxl][7]=blcount/words.length;
    }
}

function menu_seen(){
    var str_t=klmenu_hide_b('#top');
    var blparent=menu_parent_node_b(str_t);

    var sort_type=['contain','count','host','host count','href','old words','one2more','random','rare words','string length','title','date'];
    var option_t=list_2_option_b(sort_type);

    var klmenu1=[
    klmenu_select_sort_b('select_raw_sort_id_seen',sort_type,str_t,'sort_seen',true,false),
    '<span class="span_menu" onclick="'+str_t+'frequency_enwords_book_b(\'sentence_rare\',true);">非稀有旧单词</span>',
    '<span class="span_menu" onclick="'+str_t+'list_popular_seen();">常见新单词</span>',    
    '<span class="span_menu" onclick="'+str_t+'title_words_seen();">常见标题单词</span>',    
    '<span class="span_menu" onclick="'+str_t+'words_count_statistics_seen(1,true);">当前条件的单一新单词</span>',    
    '<span class="span_menu" onclick="'+str_t+'enwords_search_result_load_b(false,\'input\',\'input_search\',\'b\');">暂存搜索单词查询</span>',    
    ];
    
    var group_list=[
    ['第1个','words_count_more_than_one_line_seen();',true],
    ['第2个','words_count_more_than_one_line_seen(2);',true],
    ['最后一个','words_count_more_than_one_line_seen(-1);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'非单一单词行：'));        

    var klmenu_config=[
    load_sentence_menu_b(str_t),
    '<span class="span_menu" onclick="'+str_t+'split_current_arr_seen();">当前结果数组分割</span>',
    '<span class="span_menu" onclick="'+str_t+'host_count_seen(\'status\');">当前条件 host count</span>',
    select_delete_type_generate_rlater_b(),
    '<span class="span_menu" onclick="'+str_t+'rlater_links_get_seen();">复制当前页面链接</span>',
    '<span class="span_menu" onclick="'+str_t+'delete_batch_from_array_form_rlater_b(\'selenium_enwords\');">导入数组批量删除</span>',
    '<span class="span_menu" onclick="'+str_t+'clear_cached_deleted_rows_rlater_b(\'selenium_enwords_deleted_rows\');">清除今日删除记录</span>',
    '<span class="span_menu" onclick="'+str_t+'import_bigfile_seen();">导入 bigfile 文件</span>',        
    ];    
    
    var group_list=[
    ['⚪ reg','klmenu_check_b(this.id,true);',false,'span_reg_rlater'],
    ['⚪ 显示host','klmenu_check_b(this.id,true);',false,'span_show_host_rlater'],
    ['⚪ 显示日期','klmenu_check_b(this.id,true);',false,'span_show_date_rlater'],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));
    
    if (is_local_b()){
        klmenu_config.push('<a href="'+klwebphp_path_b('data/words/enwords_selenium_scan_data.js')+'?'+date2str_b('')+'" onclick="'+str_t+'" target=_blank>enwords_selenium_scan.js</a>');
    }
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'🐿','21rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','18rem','1rem','1rem','60rem'),'','0rem');
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg+' ');    
    klmenu_check_b('span_reg_rlater',true);    
    klmenu_check_b('span_show_host_rlater',true);    
    klmenu_check_b('span_show_date_rlater',true);    
    
    sort_type.sort(randomsort_b);
    document.getElementById('select_raw_sort_id_seen').value=sort_type[0];
}

function split_current_arr_seen(){
    array_split_by_range_b('selenium_enwords_current_global',page_seen);
}

function rlater_links_get_seen(){
    var oas=document.querySelectorAll('a.a_rlater_link');
    var result_t=[];
    for (let one_a of oas){
        result_t.push(one_a.href);
    }
    copy_2_clipboard_b(result_t.join('\n'));
    alert('已复制链接 '+result_t.length+' 条到剪贴板');
}

function import_bigfile_seen(){
    function sub_import_bigfile_seen_load(is_ok){
        if (is_ok){
            load_data_seen(fname);
            search_seen();
        }
    }
    
    var fname='selenium_enwords_data.js';
    selenium_enwords_data_global=[];
    selenium_enwords_data_original_global=undefined;
    load_js_var_file_b('selenium_enwords_data_original_global',[],fname,sub_import_bigfile_seen_load,true,true);
}

function statistics_set_seen(){
    local_storage_today_b('selenium_enwords_articles',40,selenium_enwords_data_global.length,'/',[8,0,0.5]);
}

function init_seen(){
    function sub_init_seen_fn(){
        enwords_mini_search_frame_style_b();
        enwords_mini_search_frame_form_b();        
        menu_seen();
    }
    //-----------------------
    var style_list=[
    '#div_search_links a.a_rlater_link, #div_search_links li::marker{font-size:1.25rem;font-weight:bold;}',
    '#div_search_links a {text-decoration:none;color:black;}',
    '#div_search_links a:hover {text-decoration:underline;color:red;}',
    'li {margin-bottom:0.4rem;'+(ismobile_b()?'font-size:1.1rem;':'')+'}',
    ];
    style_generate_b(style_list,true);
        
    input_size_b([['input_max_delete_rlater',4,0.8]],'id');
    input_with_x_b('input_search',(ismobile_b()?10:15));
    var progress_list=ltp_status_get_b('+selenium +生词统计','tomato','white',100);
    document.getElementById('p_buttons').insertAdjacentHTML('beforeend',progress_list.join(''));
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.6rem':'1.4rem'));
    character_2_icon_b('🐿');
    
    statistics_set_seen();
    marked_rows_get_rlater_b('selenium_enwords');

    en_word_temp_get_b();  
    words_searched_arr_global=[];
    recent_search_key_seen();
    
    enwords_init_b(true,true,sub_init_seen_fn);

    //search_seen('.*(:r)'); //此行保留 - 保留注释
}

function recent_search_key_seen(csstr=''){
    recent_search_b('recent_search_selenium_enwords',csstr,'search_seen','div_recent_search',['^[a-z]+(ed|ing|s)$(:r)','\/(author|tag)\/(:r)'],20);
}

function search_seen(cskeys='',margin_id=-1){
    if (cskeys===''){
        cskeys=document.getElementById('input_search').value;
    }

    var csreg=klmenu_check_b('span_reg_rlater',false);
    [cskeys,csreg]=str_reg_check_b(cskeys,csreg);
    
    document.getElementById('input_search').value=cskeys;
    recent_search_key_seen(cskeys+(csreg?'(:r)':''));

    var show_host=klmenu_check_b('span_show_host_rlater',false);    
    var show_date=klmenu_check_b('span_show_date_rlater',false);    
    
    selenium_enwords_current_global=[];
    is_all_result_seen_global=true;    

    var pageno=1;
    for (let blxl=0,lent=selenium_enwords_data_global.length;blxl<lent;blxl++){
        var item=selenium_enwords_data_global[blxl];
        var blfound=str_reg_search_b(item,cskeys,csreg);
        if (blfound==-1){break;}
        if (blfound==false){continue;}
        
        var words=list_container_generation_seen(item[9]);

        if (item[4]==margin_id){
            pageno=rows_per_page_seen_global*Math.floor((blxl+1)/rows_per_page_seen_global)+1;
        }
        
        var tail_str='';
        if (show_host){
            tail_str=tail_str+' <small>('+item[10]+')</small>';
        }
        if (show_date){
            tail_str=tail_str+(item[11]==''?'':' <small>('+item[11]+')</small>');
        }
        var arow=one_link_gerenrate_rlater_b(item[4],item[0],item[1],false,'selenium_enwords',tail_str+words,false);

        selenium_enwords_current_global.push([arow,blxl+1,item]);
    }
    
    var bljg=years_rlater_b(selenium_enwords_data_global.length,selenium_enwords_current_global.length);
    document.getElementById('div_status').innerHTML=bljg;    

    page_seen(pageno);

    if (margin_id!==-1){
        var oa=document.getElementById('a_rlater_link_'+margin_id);
        if (oa){
            oa.scrollIntoView();
        }
    }
}

function page_seen(csno=1){
    var cslen=selenium_enwords_current_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_seen_global,csno,'page_seen','locate_seen',false,1,10);  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_seen_global,cslen);
    var blno=0;
    
    if (is_all_result_seen_global){
        for (let blxl=csno-1;blxl<blend;blxl++){
            var item=selenium_enwords_current_global[blxl][0];
            result_t.push('<li>'+item+'</li>');
        }    
    } else {
        for (let blxl=csno-1;blxl<blend;blxl++){
            var item=selenium_enwords_current_global[blxl][0];
            result_t.push('<li>'+item+' <span style="font-size:0.8rem;color:'+scheme_global['memo']+';">('+selenium_enwords_current_global[blxl][1]+')</span></li>');
        }
    }
    var odiv=document.getElementById('div_search_links');

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
        odiv.innerHTML=bljg+'<ol>'+result_t.join('\n')+'</ol>\n'+bljg;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));        
    }
    odiv.scrollIntoView();
}

function locate_seen(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_seen((blno-1)*rows_per_page_seen_global+1,rows_per_page_seen_global);
    }        
}

function words_count_statistics_seen(csno=1,only_new=true){
    var words_set=new Set();
    for (let arow of selenium_enwords_current_global){
        var list_t=arow[0].match(/<span class="a_word" .+?><b>(.+?)<\/b><\/span>/g) || [];
        //list_t 的每一个元素如：<span class="a_word" onclick="popup_words_links_b(event,'aromatics',true,true); en_word_temp_change_b(this,'aromatics');"><b>aromatics</b></span> - 保留注释
        for (let one_word of list_t){
            words_set.add(one_word.match(/<span class="a_word" .+?><b>(.+?)<\/b><\/span>/)[1]);
        }
    }

    var words_dict=selenium_enwords_count_enbook_b();
    var result_t=new Set();
    for (let one_word of words_set){
        if ('w_'+one_word in words_dict){
            var blcount=words_dict['w_'+one_word];
            if (blcount==csno){
                result_t.add(one_word);
            }
        }
    }  
    
    var oldset=simple_words_b();
    if (only_new){
        result_t=array_difference_b(result_t,oldset,true,false);
    }

    document.getElementById('div_search_links').innerHTML=new_old_words_html_enbook_b(result_t,'','',false,oldset,false);
    
    //以下4行保留 - 保留注释
    //result_t=Array.from(result_t);
    //result_t.sort();
    //var bljg=enwords_array_to_links_b(result_t,oldset,'count_one_seen');
    //document.getElementById('div_search_links').innerHTML=list_container_generation_seen(bljg);
}

function count_one_seen(odom,words_dict=false){
    var oword=odom.parentNode.querySelector('span.a_word');
    if (!oword){return;}
    var blword=oword.innerText;
    if (words_dict===false){
        words_dict=selenium_enwords_count_enbook_b(false,readlater_marked_rows_global);
    }
    
    var blold=odom.innerText.split('(')[0].split('.')[0];
    
    var blcount=0;
    if ('w_'+blword in words_dict){
        blcount=words_dict['w_'+blword];
    }
    
    odom.innerText=blold+'('+(blcount==1?'𝟭':blcount)+'). '
}

function list_container_generation_seen(words){
    //words 每个元素形如：<span class="span_word_combination_enword"><small class="small_enword_no_b" style="cursor:pointer;">3. </small><span class="a_word" onclick="popup_words_links_b(event,'cerevisiae',true,true); en_word_temp_change_b(this,'cerevisiae');"><b>cerevisiae</b></span> </span> - 保留注释
    
    // onclick="count_one_seen(this);"
    
    var blstr='<div class="div_word_list_seen" style="border:0.1rem dotted '+scheme_global['shadow']+';border-radius:1rem;padding:0.5rem;" onclick="div_word_list_click_seen(event);">';
    var blstyle=(words.length<=1?' style="display:none;"':'');

    blstr=blstr+'<span class="span_box span_batch_count_enwords_book" onclick="count_batch_seen(this);"'+blstyle+'>👆</span> ';    
    blstr=blstr+words.join(' ');
    blstr=blstr+'</div>';
    return blstr;
}

function div_word_list_click_seen(event){
    const target = event.target;

    // 处理 small 元素的点击（计数）
    const osmallElement = target.closest('.small_enword_no_b');
    if (osmallElement){
        count_one_seen(osmallElement);
    }
}

function count_batch_seen(ospan){
    var words_dict=selenium_enwords_count_enbook_b();
    var osmalls=ospan.parentNode.querySelectorAll('span.span_word_combination_enword small.small_enword_no_b');
    for (let one_small of osmalls){
        count_one_seen(one_small,words_dict);
    }
}

function list_popular_seen(){
    var word_list={};
    for (let arow of selenium_enwords_data_global){
        var list_t=arow[3];
        for (let aword of list_t){
            if (word_list['w_'+aword]==undefined){
                word_list['w_'+aword]=0;
            }
            word_list['w_'+aword]=word_list['w_'+aword]+1;
        }
    }
    word_list=object2array_b(word_list,true,2);
    word_list.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    
    var oldset=simple_words_b();
    var result_t=[];
    
    var blcount=0;
    for (let item of word_list){
        if (oldset.has(item[0])){continue;}
        
        if (item[1]>1){
            result_t.push(item[0]);
        }
        blcount=blcount+1;
    }
    local_storage_today_b('enwords_selenium_new_words',40,blcount,'/',[8,0,0.5]);    
    get_new_words_arr_set_enbook_b(2,result_t.join(' '),'div_search_links');   
}

function words_count_more_than_one_line_seen(csno=1){
    function sub_words_count_more_than_one_line_seen_one_hand(one_div){
        var olist=one_div.querySelector('div.div_word_list_seen');
        if (olist.innerText.includes('𝟭')){return false;}
        
        var ohand=one_div.querySelector('span.span_batch_count_enwords_book');
        ohand.click();
        row_count=row_count+1;
        if (row_count % 10 == 0 && (performance.now() - t0)/1000>2){
            one_div.scrollIntoView();
            alert('终止运行');
            return true;
        }
            
        if (!olist.innerText.includes('𝟭')){
            found_count=found_count+1;
            if (found_count==csno){
                one_div.scrollIntoView();
                return true;
            }
        }
        return false;
    }
    //-----------------------
    var t0 = performance.now();
    var found_count=0;
    var row_count=0;
    var odivs=document.querySelectorAll('div#div_search_links li');
    
    if (csno<0){
        csno=-1*csno;
        for (let blxl=odivs.length-1;blxl>0;blxl--){
            var one_div=odivs[blxl];
            if (sub_words_count_more_than_one_line_seen_one_hand(one_div)){break;}
        } 
    } else {
        for (let blxl=0,lent=odivs.length;blxl<lent;blxl++){
            var one_div=odivs[blxl];
            if (sub_words_count_more_than_one_line_seen_one_hand(one_div)){break;}
        }
    }
    console.log('words_count_more_than_one_line_seen() 费时：'+(performance.now() - t0) + ' milliseconds');
}
