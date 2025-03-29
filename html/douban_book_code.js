function data_load_dbb(){
    if (!is_local_b()){
        douban_book_global=[];
        init_dbb();
    } else {
        document.getElementById('span_count').innerText='数据载入中...';
        var jsfile_list=klbase_addons_import_js_b([],[],['douban_book1_data.js','douban_book2_data.js'],[],false,false,true);   
        merge_js_data_files_in_one_b('douban_book_global',jsfile_list,init_dbb);
    }
}

function init_dbb(){    
    character_2_icon_b('𖠗');
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),true,false,2);
    menu_dbb();

    var input_list=[
    ['input_rating_min',4,0.5],
    ['input_rating_max',4,0.5],
    ['input_people_min',4,0.5],
    ['input_people_max',4,0.5],
    ['input_year_min',4,0.5],
    ['input_year_max',4,0.5],
    ['input_result_max',6,0.5],    
    ];
    input_size_b(input_list,'id');
    
    input_with_x_b('input_search',20);
    recent_dbb();
    document.getElementById('span_count').innerHTML='('+douban_book_global.length+')';    
    
    if (typeof csbooklist_source_global == 'undefined'){
        csbooklist_source_global=[];
    }
    
    var list_t=[];
    var blat;
    for (let blxl=0,lent=csbooklist_source_global.length;blxl<lent;blxl++){
        if (csbooklist_source_global[blxl][3]=='2'){
            csbooklist_source_global[blxl]='';
            continue;
        }
        csbooklist_source_global[blxl]=csbooklist_source_global[blxl][1];
        
        var blfound=false;
        var blstr=csbooklist_source_global[blxl];
        for (let item of ['(','（']){
            blat=blstr.indexOf(item);
            if (blat>0){    //非第一个字符 - 保留注释
                blfound=true;
                blstr=blstr.substring(0,blat).trim();
            }
        }
        if (blfound){
            list_t.push(blstr);
        }
    }
    csbooklist_source_global=new Set(csbooklist_source_global.concat(list_t));
    ignored_books_dbb_global=new Set(local_storage_get_b('ignored_books_dbb',-1,true));
    args_dbb();
}

function arg_input_dict_dbb(){
    return {'rmin':'input_rating_min','rmax':'input_rating_max','pmin':'input_people_min','pmax':'input_people_max','ymin':'input_year_min','ymax':'input_year_max'};
}

function current_link_dbb(){
    var input_dict=arg_input_dict_dbb();
    var bljg=[];
    for (let akey in input_dict){
        var oinput=document.getElementById(input_dict[akey]);
        if (oinput){
            bljg.push(akey+'='+oinput.value.trim());
        }
    }
    document.getElementById('divhtml').innerHTML='<p><a href="?'+bljg.join('&')+'" target=_blank>'+bljg.join('&')+'</p>';
}

function args_dbb(){
    var cskeys=href_split_b(location.href);
    var input_dict=arg_input_dict_dbb();
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,4) in input_dict &&  one_key.substring(4,5)=='='){
                document.getElementById(input_dict[one_key.substring(0,4)]).value=one_key.substring(5,);
            }    
        }
    } else {
        //bbb_kltemplate(1,40); //此行保留 - 保留注释
    }
}

function style_dbb(){
    var ismobile=ismobile_b();
    var style_list=[
    '#divhtml ol li:nth-child(even) a {background-color: '+scheme_global['button']+';}',
    '#divhtml ol li {font-size:'+(ismobile?1.1:0.95)+'rem; line-height:1.5rem;margin-bottom:'+(ismobile?0.5:0.2)+'rem;}',
    ];
    style_generate_b(style_list,true);
}

function menu_dbb(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://book.douban.com" onclick="'+str_t+'" target=_blank>豆瓣读书</a>',    
    ];
    
    var group_list=[
    ['已购','search_dbb(false,\'txtbook\');',true],
    ['忽略','search_dbb(false,\'ignore\');',true],
    ['链接','current_link_dbb();',true],   
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'当前条件书籍：'));    
    
    var klmenu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'statistics_key_year_line_dbb(\'people\',[\'count\',\'sum\'],[\'本\',\'人\']);">评论人数年份图</span>',
    '<span class="span_menu" onclick="'+str_t+'statistics_key_year_line_dbb(\'rating\',[\'count\',\'average\'],[\'本\',\'分\']);">平均分年份图</span>',
    ];

    var group_list=[
    ['全部评分','statistics_textarea_values_dbb(\'rating\');',true],
    ['书名','statistics_textarea_values_dbb(\'title\');',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'当前条件：'));    

    var group_list=[
    ['书名','statistics_textarea_values_dbb(\'title\',true);',true],
    ['作者','statistics_textarea_values_dbb(\'作者\',true);',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'当前页：'));    
        
    group_list=[
    ['出版社','statistics_key_pie_dbb(\'出版社\');',true],
    ['出版年','statistics_key_pie_dbb(\'publication_year\');',true],
    ['作者','statistics_key_pie_dbb(\'作者\');',true],
    ['评分','statistics_key_pie_dbb(\'rating\');',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'统计：'));    

    group_list=[
    ['出版社','group_key_dbb(\'出版社\');',true],
    ['出版年','group_key_dbb(\'publication_year\');',true],
    ['作者','group_key_dbb(\'作者\');',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'分组：'));    
    
    group_list=[
    ['英语','jieba_dbb(\'en\');',true],
    ['非英语','jieba_dbb(\'cn\');',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'当前条件全部分词：'));        

    group_list=[
    ['常见','jieba_dbb(\'title\');',true],
    ['罕见','jieba_dbb(\'title\',1,9);',true],
    ['单一','jieba_dbb(\'title\',1,1);',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'当前条件书名分词：'));      
    
    var klmenu_config=[
    '<span class="span_menu">排序：<select id="select_sort_type_dbb" onchange="'+klmenu_hide_b('',true)+'"><option></option><option>书名</option><option selected>评分/书名</option><option>评分/人数</option><option>人数</option><option>出版年</option><option>页数</option><option>定价</option><option>随机</option></select></span>',    
    '<span class="span_menu" onclick="'+str_t+'upload_data_files_form_dbb();">上传数据文件</span>',    
    '<span class="span_menu" onclick="'+str_t+'standalone_dbb();">当前结果导出为 standalone search</span>',    
    ];

    var group_list=[
    ['⚪ reg','klmenu_check_b(this.id,true);',true,'span_reg_dbb'],
    ['⚪ 出版社简化','klmenu_check_b(this.id,true);',true,'span_publisher_simplify_dbb'],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));    
    
    var group_list=[
    ['⚪ 标记','klmenu_check_b(this.id,true);',true,'span_txtbook_icon_dbb'],
    ['⚪ 显示','klmenu_check_b(this.id,true);',true,'span_bought_show_dbb'],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,'已有书籍：'));    
    
    group_list=[
    ['名单','ignore_books_list_dbb();',true],
    ['缓存','window.open(\'lsm.htm?key=ignored_books_dbb\');',true],
    ['⚪ 显示','klmenu_check_b(this.id,true);',true,'span_txtbook_ignore_dbb'],    
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,'忽略书籍：'));        
        
    klmenu_config=klmenu_config.concat(root_font_size_menu_b(str_t));
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','16rem','1rem','1rem','60rem')+klmenu_b(klmenu_statistics,'🧮','20rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','20rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_dbb',true);        
    klmenu_check_b('span_txtbook_icon_dbb',true);        
}

function standalone_dbb(){
    var bltitle=prompt('输入标题');
    if (bltitle==null){return;}
    if (bltitle.trim()==''){
        bltitle='Douban Book Search';
    }
    var result_t=[];
    for (let item of current_result_dbb_global){
        result_t.push('"'+specialstr_j(arow_dbb(item[0]).join(' ⦙ '))+'",');
    }
    standalone_search_funs_b(bltitle.trim(),result_t.join('\n'),['popup_dbb','popup_event_div_b','style_generate_b']);
}

function jieba_dbb(cstype='cn',csmin=10,csmax=-1){
    var list_t=[];
    if (['cn','en'].includes(cstype)){
        for (let arow of current_result_dbb_global){
            list_t.push(Object.values(arow[0]).toString());
        }
    } else {
        for (let arow of current_result_dbb_global){
            list_t.push(arow[0][cstype]);
        }
    }
    
    var blstr=list_t.join('\n');
    
    switch (cstype){
        case 'cn':
            list_t=blstr.match(/[^\x00-\xff]+/mg) || [];
            break;
        case 'en':
            list_t=blstr.match(/[a-z\'\-]+/img) || [];    
            break;
    }
    
    blstr=list_t.join('\n');
    var arr_t = count_words_b(blstr,split_words_b(blstr,true),csmin,csmax);

    var blbutton='<p>'+close_button_b('div_statistics','')+'</p>';
    var odiv=document.getElementById('div_statistics');
    odiv.innerHTML = '<textarea style="height:20rem;">'+arr_t.join('\n')+'</textarea>'+blbutton;    
    odiv.scrollIntoView();
}

function recent_dbb(csstr=''){
    recent_search_b('recent_search_dbb',csstr,'search_dbb','div_recent_search',[],25,false);
}

function search_dbb(cskey=false,cstype=''){
    if (douban_book_global.length==0){return;}

    var t0=performance.now();       
    
    var oinput=document.getElementById('input_search');
    if (cskey===false){
        cskey=oinput.value.trim();
    }
    oinput.value=cskey;
    
    current_result_dbb_global=[];

    var rating_min=parseFloat(document.getElementById('input_rating_min').value.trim());
    var rating_max=parseFloat(document.getElementById('input_rating_max').value.trim());

    var people_min=parseInt(document.getElementById('input_people_min').value.trim());
    var people_max=parseInt(document.getElementById('input_people_max').value.trim());

    var year_min=parseInt(document.getElementById('input_year_min').value.trim());
    var year_max=parseInt(document.getElementById('input_year_max').value.trim());
        
    recent_dbb(cskey);
    
    var isreg=klmenu_check_b('span_reg_dbb',false);
    [cskey,isreg]=str_reg_check_b(cskey,isreg,true);        

    var blmax=parseInt(document.getElementById('input_result_max').value) || -1;
    var empty_year_count=0;
    var blcount=0;
    
    var bought_show=klmenu_check_b('span_bought_show_dbb',false);            
    var ignore_show=klmenu_check_b('span_txtbook_ignore_dbb',false);                

    for (let blxl=0,lent=douban_book_global.length;blxl<lent;blxl++){
        var item=douban_book_global[blxl];
        if (item['publication_year']==undefined){
            item['publication_year']=year_get_dbb(item['出版年']);
            if (item['publication_year']==-1){
                console.log(item); //此行保留 - 保留注释
                empty_year_count=empty_year_count+1;
            }
        }
        if (rating_min>-1 && item['rating']<rating_min || rating_max>-1 && item['rating']>rating_max){continue;}
        if (people_min>-1 && item['people']<people_min || people_max>-1 && item['people']>people_max){continue;}
        if (year_min>-1 && item['publication_year']<year_min || year_max>-1 && item['publication_year']>year_max){continue;}
        
        if (cstype=='ignore'){
            if (!ignored_books_dbb_global.has(item['title'])){continue;}
        } else if (cstype=='txtbook'){
            if (!csbooklist_source_global.has(item['title'])){continue;}        
        }   
        
        var blfound = (cskey=='' || str_reg_search_b(Object.values(item),cskey,isreg));
        if (blfound==-1){break;}
        
        if (!bought_show && csbooklist_source_global.has(item['title'])){continue;}
        if (!ignore_show && ignored_books_dbb_global.has(item['title'])){continue;}
        
        if (blfound){
            var blrow=found_row_generate_dbb(item);
            current_result_dbb_global.push(blrow);
            blcount=blcount+1;
            if (blmax>0 && blcount>=blmax){break;}
        }
    }    
    console.log('空白年记录数：'+empty_year_count);
    
    var sort_type=document.getElementById('select_sort_type_dbb').value;
    if (['书名','人数','出版年','页数','定价'].includes(sort_type)){
        current_result_dbb_global.sort(function (a,b){return a[0]['rating']<b[0]['rating'] ? 1 : -1;});    //评分排序 - 保留注释
        current_result_dbb_global.sort(function (a,b){return zh_sort_b(a,b,false,1);}); //书名排序 - 保留注释       
    }
    switch (sort_type){
        case '评分/书名':
            current_result_dbb_global.sort(function (a,b){return a[0]['people']<b[0]['people'] ? 1 : -1;});    //人数排序 - 保留注释
            current_result_dbb_global.sort(function (a,b){return zh_sort_b(a,b,false,1);}); //书名排序 - 保留注释
            current_result_dbb_global.sort(function (a,b){return a[0]['rating']<b[0]['rating'] ? 1 : -1;});  //评分排序 - 保留注释
            break;
        case '评分/人数':
            current_result_dbb_global.sort(function (a,b){return zh_sort_b(a,b,false,1);}); //书名排序 - 保留注释
            current_result_dbb_global.sort(function (a,b){return a[0]['people']<b[0]['people'] ? 1 : -1;});    //人数排序 - 保留注释
            current_result_dbb_global.sort(function (a,b){return a[0]['rating']<b[0]['rating'] ? 1 : -1;});  //评分排序 - 保留注释
            break;            
        case '人数':
            current_result_dbb_global.sort(function (a,b){return a[0]['people']<b[0]['people'] ? 1 : -1;});
            break;
        case '出版年':
            current_result_dbb_global.sort(function (a,b){return a[0]['publication_year']<b[0]['publication_year'] ? 1 : -1;});
            break;
        case '页数':
            current_result_dbb_global.sort(function (a,b){return a[2]<b[2] ? 1 : -1;});      
            break;            
        case '定价':
            current_result_dbb_global.sort(function (a,b){return a[3]<b[3] ? 1 : -1;});      
            break;
        case '随机':
            current_result_dbb_global.sort(randomsort_b);
            break;
        default:
            if (sort_type!=='书名'){
                current_result_dbb_global.sort(function (a,b){return zh_sort_b(a,b,false,1);});
            }
    }
    result_percent_b('span_count',current_result_dbb_global.length,douban_book_global.length,3);

    console.log('search_dbb() 搜索部分 费时：'+(performance.now() - t0) + ' milliseconds');
    
    page_dbb(1);
}

function found_row_generate_dbb(item){
    var blmoney=(item['定价'] || '').match(/[0-9\.]+/g) || ['0'];
    return [item,item['title'],parseInt(item['页数'] || '0'),parseFloat(blmoney[0])];   //,item['rating'],item['people']]);
}

function ignore_books_list_dbb(){
    var all_books=new Set();
    for (let abook of douban_book_global){
        all_books.add(abook['title']);
    }
    var column_count=(ismobile_b()?2:5);
    var old_size=ignored_books_dbb_global.size;    
    
    var diff_with_all_set=array_difference_b(ignored_books_dbb_global,all_books,true);
    var intersect_with_txtbook_set=array_intersection_b(ignored_books_dbb_global,csbooklist_source_global,true);
    
    var blnotfound=(diff_with_all_set.size==0 && intersect_with_txtbook_set.size==0);
    
    if (blnotfound){
        var bljg='共有'+old_size+'个忽略书籍。';
    } else {
        var bljg='原共有'+old_size+'个忽略书籍。';    
    }
    
    if (diff_with_all_set.size==0){
        bljg=bljg+'未发现不在全部书籍中的忽略书籍名单。';
    } else {
        bljg=bljg+'发现'+diff_with_all_set.size+'个不在全部书籍中的忽略书籍。';
        ignored_books_dbb_global=array_difference_b(ignored_books_dbb_global,diff_with_all_set,true);       
        bljg=bljg+'<h3>清除名单</h3>';
        bljg=bljg+'<div style="column-count:'+column_count+';">'+array_2_li_b(Array.from(diff_with_all_set))+'</div>';
    }
    
    if (intersect_with_txtbook_set.size==0){
        bljg=bljg+'未发现在txtbook书籍中的忽略书籍名单。';
    } else {
        bljg=bljg+'发现'+intersect_with_txtbook_set.size+'个在txtbook书籍中的忽略书籍。';    
        ignored_books_dbb_global=array_difference_b(ignored_books_dbb_global,intersect_with_txtbook_set,true); 
        bljg=bljg+'<h3>清除名单</h3>';
        bljg=bljg+'<div style="column-count:'+column_count+';">'+array_2_li_b(Array.from(intersect_with_txtbook_set))+'</div>';
    }
   
    var list_t=Array.from(ignored_books_dbb_global);
    list_t.sort(function (a,b){return zh_sort_b(a,b);});
    if (blnotfound==false){
        localStorage.setItem('ignored_books_dbb',list_t.join('\n'));
    }
    
    bljg=bljg+'<h3>现有名单</h3><div style="column-count:'+column_count+';">'+array_2_li_b(list_t)+'</div>';
    document.getElementById('divhtml').innerHTML=bljg;    
}

function popup_dbb(event,ospan){
    var oa=ospan.parentNode.querySelector('a.a_title_dbb');
    if (!oa){return;}
    var bltitle=oa.innerText;
    var bllink=[
    '<a href="https://www.amazon.cn/s?k='+bltitle+'" target=_blank>𝐀</a>',
    '<a href="https://www.bing.com/search?q='+bltitle+'" target=_blank>𝐁</a>',
    '<a href="https://book.douban.com/subject_search?search_text='+bltitle+'" target=_blank>豆</a>',
    '<a href="http://searchb.dangdang.com/?key='+bltitle+'" target=_blank>当</a>',
    '<a href="https://search.jd.com/Search?keyword='+bltitle+'" target=_blank>京</a>',
    '<span class="span_link" onclick="copy_2_clipboard_b(\''+specialstr_j(oa.innerText)+'\');close_popup_dbb();">复制书名</span>',
    '<span class="span_link" onclick="copy_2_clipboard_b(\''+ospan.innerText+'\');close_popup_dbb();">复制分值</span>',
    ];
    
    if (typeof ignored_books_dbb_global !== 'undefined'){
        bllink.push('<span class="span_link" onclick="ignore_set_dbb(\''+oa.href+'\',this);close_popup_dbb();">'+(ignored_books_dbb_global.has(bltitle)?'取消忽略':'忽略')+'</span>');
    }
    bllink.push('');    //末尾添加空格 - 保留注释
    popup_event_div_b(event,'div_popup_dbb',bllink.join('&nbsp;&nbsp;'),'bottom','1.25rem',0.8);
    ospan.style.backgroundColor=scheme_global['pink'];
}

function close_popup_dbb(){
    document.getElementById('div_popup_dbb').style.display='none';
}

function ignore_set_dbb(cshref,ospan){
    if (ignored_books_dbb_global.size>=10000){
        alert('已有太多的被忽略书籍');
        return;
    }

    var bltype=ospan.innerText;
    var blname='';
    var oas=document.querySelectorAll('a.a_title_dbb');
    for (let one_a of oas){
        if (one_a.href==cshref){
            blname=one_a.innerText;
            break;
        }
    }

    if (blname==''){return;}
    
    for (let one_a of oas){
        if (one_a.innerText==blname){
            one_a.style.textDecoration = (bltype=='忽略'?'line-through':'underline'); //考虑到可能有重复的书名，不使用 break - 保留注释
        }
    }
    
    if (bltype=='忽略'){
        ospan.innerText='取消忽略';
        ignored_books_dbb_global.add(blname);
    } else {
        ospan.innerText='忽略';
        ignored_books_dbb_global.delete(blname);
    }
    var list_t=Array.from(ignored_books_dbb_global);
    localStorage.setItem('ignored_books_dbb',list_t.join('\n'));
}

function arow_dbb(arow,show_txtbook=false){
    var key_list=Object.keys(arow);
    var blstyle='style="text-decoration: '+(ignored_books_dbb_global.has(arow['title'])?'line-through':'underline')+';"'; 
    var link='<a class="a_title_dbb" href="https://book.douban.com/subject/'+arow['id']+'/" '+blstyle+' target=_blank>'+arow['title']+'</a> ';
    if (show_txtbook && csbooklist_source_global.has(arow['title'])){
        link=link+'📕 ';
    }
    link=link+'<span class="span_box" onclick="popup_dbb(event,this);">('+arow['rating']+'/'+arow['people']+')</span>';
    var result_t=[link];
    for (let akey of key_list){
        if (['id','title','rating','people','publication_year'].includes(akey)){continue;}
        result_t.push(akey+'：'+arow[akey]);
    }
    return result_t;
}

function page_dbb(csno){
    var cslen=current_result_dbb_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_dbb_global,csno,'page_dbb','locate_dbb',false,1,15);  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_dbb_global,cslen);
    var blno=0;

    var show_txtbook=klmenu_check_b('span_txtbook_icon_dbb',false);        
    for (let blxl=csno-1;blxl<blend;blxl++){
        var item=current_result_dbb_global[blxl][0];
        result_t.push('<li onmouseover="this.style.backgroundColor=\''+scheme_global['button']+'\';"  onmouseout="this.style.backgroundColor=\'\';">'+arow_dbb(item,show_txtbook).join(' ⦙ ')+'</li>');
    }
    
    var odiv=document.getElementById('divhtml');

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
        odiv.innerHTML=bljg+'<ol>'+result_t.join('\n')+'</ol>\n'+bljg;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));        
        odiv.scrollIntoView();
    }
}

function locate_dbb(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_dbb((blno-1)*rows_per_page_dbb_global+1,rows_per_page_dbb_global);
    }        
}

function title_simple_name_dbb(simplify=true){
    var otextarea=document.querySelector('div#div_statistics textarea');
    if (!otextarea){return [];}
    var blstr=otextarea.value.trim();
    if (blstr==''){return [];}
    
    var list_t=blstr.split('\n');
    if (simplify){
        var result_t=new Set();
        for (let arow of list_t){
            arow=arow.replace(/^(.+)[\(（].*$/g,'$1');
            arow=arow.replace(/[·\s]*[0-9\-_]+$/g,'');
            arow=arow.replace(/\s*[IVX]+$/g,'');
            arow=arow.replace(/\s*vol\.?$/ig,'');
            arow=arow.trim();
            if (ignored_books_dbb_global.has(arow) || csbooklist_source_global.has(arow)){continue;}
            result_t.add(arow);
        }
        result_t=Array.from(result_t);
        otextarea.value=result_t.join('\n');
        return result_t;        
    } else {
        return list_t;
    }
}

function amazon_title_batch_dbb(){
    function sub_amazon_title_batch_dbb_one_title(){
        [is_closed,wait_times]=window_is_closed_b(owindow,wait_times,10);
        if (!is_closed){
            setTimeout(sub_amazon_title_batch_dbb_one_title,2000);
            return;
        }
        
        if (blxl>=bllen){
            var used_seconds=(new Date()-start_time)/1000;
            console.log(new Date().toLocaleString(), '完成，费时：',used_seconds.toFixed(2)+'秒');
            document.title=old_title;
            return;
        }
        owindow=window.open('https://www.amazon.cn/s?k='+encodeURIComponent(list_t[blxl])+'&autoclose=1');
        blxl=blxl+1;
        wait_times=0;
        setTimeout(sub_amazon_title_batch_dbb_one_title,2000);        
    }
    //-----------------------
    var list_t=title_simple_name_dbb(false);
    var bllen=list_t.length;
    if (list_t.length==0){return;}
    if (!confirm('是否在亚马逊批量搜索'+list_t.length+'条记录？')){return;}
    var blxl=0;
    var wait_times=0;
    var owindow=false;
    var is_closed=false;
    var start_time=new Date();
    var old_title=document.title;    
    sub_amazon_title_batch_dbb_one_title();
}

function statistics_textarea_values_dbb(cstype,is_current_page=false){
    var list_t=statistics_key_value_dbb(cstype,is_current_page);
    var odiv=document.getElementById('div_statistics');
    if (cstype!=='rating'){
        var delimiter='\n';    
        list_t=array_unique_b(list_t);
    } else {
        var delimiter=',';
    }
    
    var blbuttons='<p>';
    blbuttons=blbuttons+'<span class="aclick" onclick="title_simple_name_dbb();">去除书籍尾部序号及已忽略和已购书籍</span>';    
    blbuttons=blbuttons+'<span class="aclick" onclick="amazon_title_batch_dbb();">亚马逊批量检索</span>';    
    blbuttons=blbuttons+close_button_b('div_statistics','');
    blbuttons=blbuttons+'</p>';
    odiv.innerHTML = '<textarea style="height:20rem;">'+list_t.join(delimiter)+'</textarea>'+blbuttons;    
    odiv.scrollIntoView();    
}

function statistics_key_value_dbb(cskey,is_current_page=false){
    var result_t=[];
    var do_simplify=klmenu_check_b('span_publisher_simplify_dbb',false);

    if (is_current_page){
        var ofont=document.querySelector('font.font_current_no_b');
        if (ofont){
            var blstart=parseInt(ofont.innerText)-1;
        } else {
            var blstart=0;
        }
        var csarray=current_result_dbb_global.slice(blstart*rows_per_page_dbb_global,(blstart+1)*rows_per_page_dbb_global);
    } else {
        var csarray=current_result_dbb_global;
    }
    
    if (cskey=='出版社' && do_simplify){
        for (let arow of csarray){
            var blvalue=arow[0][cskey]; 
            if (blvalue==undefined){continue;}
            blvalue=publisher_name_simplify_dbb(blvalue);
            result_t.push(blvalue);
        }    
    } else {
        for (let arow of csarray){
            var blvalue=arow[0][cskey]; 
            if (blvalue==undefined){continue;}
            result_t.push(blvalue);
        }
    }
    
    switch (cskey){
        case 'publication_year':
            var year_list=[];
            for (let item of result_t){
                if (item==-1){continue;}
                year_list.push(item);
            }
            return year_list;
            break;
    }
    return result_t;
}

function year_get_dbb(csyear){
    if (csyear==undefined){return -1;}
    
    var result_t=csyear.slice(0,4);
    if (result_t.length<4 || isNaN(result_t)){
        if (csyear.match(/[,\s]\d{4}$/)!==null){
            result_t=csyear.slice(-4,);
        } else if (csyear.match(/\b\d{4}\b/)!==null){
            result_t=csyear.replace(/.*\b(\d{4})\b.*/g,'$1');
        } else {
            result_t='';
        }
    }
    result_t=parseInt(result_t);
    if (isNaN(result_t)){
        result_t=-1;
    }
    return result_t;
}

function statistics_key_year_line_dbb(cskey,cstype,csunit){
    var result_t={};
    var year_list=[];
    for (let arow of current_result_dbb_global){
        var blyear=arow[0]['publication_year'];
        if (blyear==-1){continue;}

        var blvalue=arow[0][cskey]; 
        if (blvalue==undefined){continue;}
        
        var blkey='y_'+blyear;
        blyear=parseInt(blyear);
        if (result_t[blkey]==undefined){
            result_t[blkey]=[blyear,0,0];
            year_list.push(blyear);
        }
        
        result_t[blkey][1]=result_t[blkey][1]+1;
        blvalue=Math.max(0,parseFloat(blvalue));    //将 -1  改为 0 - 保留注释
        if (!isNaN(blvalue)){
            result_t[blkey][2]=result_t[blkey][2]+blvalue;
        }
    }
        
    for (let key in result_t){
        if (result_t[key][1]!==0){
            result_t[key].push(result_t[key][2]/result_t[key][1]);
        } else {
            result_t[key].push(0);
        }
    }
    
    year_list.sort();
    var bllen=year_list.length;
    for (let blxl=0;blxl<bllen-1;blxl++){
        var year_min=year_list[blxl];
        var year_max=year_list[blxl+1];
        for (let blyear=year_min+1;blyear<year_max;blyear++){
            result_t['y_'+blyear]=[blyear,0,0,0];
        }
    }
    
    var count_list=[];
    var sum_list=[];
    var average_list=[];
    for (let key in result_t){
        count_list.push([result_t[key][0],result_t[key][1]]);
        sum_list.push([result_t[key][0],result_t[key][2]]);
        average_list.push([result_t[key][0],result_t[key][3]]);
    }
    
    count_list.sort();
    sum_list.sort();
    average_list.sort();
    var fraction=0;
    switch (cskey){
        case 'people':
            caption='评论人数';
            break;
        case 'rating':
            caption='评分';
            fraction=1;
            break;
        default:
            captin='';
            break;
    }
    count_list=['书籍数量(本)'].concat(count_list);
    sum_list=[caption+'合计'].concat(sum_list);
    average_list=[caption+'/本'].concat(average_list);
       
    var flot_list=[];
    for (let item of cstype){
        if (item=='count'){
            flot_list.push(count_list);
        } else if (item=='sum'){
            flot_list.push(sum_list);
        } else if (item=='average'){
            flot_list.push(average_list);
        }
    }
    
    var str_list=[];
    for (let acol of flot_list){
        var list_t=[];
        for (let arow of acol){
            list_t.push(arow.toString())
        }
        str_list.push('<td valign=top><div style="max-height:300px;overflow:auto;">'+array_2_li_b(list_t)+'</div></td>');
    }
    div_flot_generate_dbb(false,'','<table width=90%><tr>'+str_list.join('\n')+'</tr></table>');
    flot_two_lines_two_yaxis_b(flot_list,'div_flot',csunit[0],csunit[1],'nw',false,'m',0,fraction);
}

function div_flot_generate_dbb(is_pie=true,top_str='',bottom_str=''){
    var odiv=document.getElementById('div_statistics');
    var blbutton='<p>'+close_button_b('div_statistics','')+'</p>';
    odiv.innerHTML=top_str+'<div id="div_flot" style="width:'+(is_pie?700:Math.round(document.body.clientWidth*0.9))+'px; height:700px;"></div>'+bottom_str+blbutton;
    odiv.scrollIntoView();
}

function rating_pyramid_dbb(cslist){
    //cslist 每个元素形如 [ 9.4, 3 ] - 保留注释
    var blmax_right=0;
    for (let item of cslist){
        blmax_right=Math.max(item[1],blmax_right);
    }
    
    var bllen_right,affix_right;
    [bllen_right,affix_right]=zero_prefix_b(blmax_right);
    
    var result_t=[];
    for (let item of cslist){
        var blcount=Math.max(1,item[1]*100/blmax_right);
        result_t.push('<p align="center" style="line-height:100%;"><small>'+(item[0]==10?'10.':item[0].toFixed(1))+'</small> <span style="background-color:'+scheme_global['memo']+';">'+'&nbsp;'.repeat(blcount)+'</span> <small>'+(affix_right+item[1].toString()).slice(bllen_right,)+'</small></p>');
    }
    return '<table width=100%><tr><td aling="center">'+result_t.join('\n')+'</td></tr></table>';
}

function group_key_dbb(cstype){
    function sub_group_key_dbb_push(arow){
        var blkey='k_'+blvalue;
        if (result_t[blkey]==undefined){
            result_t[blkey]=[];
        }
        result_t[blkey].push(arow);    
    }
    
    var result_t={};
    var do_simplify=klmenu_check_b('span_publisher_simplify_dbb',false);
    
    if (cstype=='出版社' && do_simplify){
        for (let arow of current_result_dbb_global){
            var blvalue=arow[0][cstype]; 
            if (blvalue==undefined){continue;}
            blvalue=publisher_name_simplify_dbb(blvalue);            
            sub_group_key_dbb_push(arow);
        }
    } else {
        for (let arow of current_result_dbb_global){
            var blvalue=arow[0][cstype]; 
            if (blvalue==undefined){continue;}
            sub_group_key_dbb_push(arow);
        }
    }

    var show_txtbook=klmenu_check_b('span_txtbook_icon_dbb',false);        
    var blmax=parseInt(document.getElementById('input_result_max').value) || -1;    
    
    var bljg=[];
    for (let key in result_t){
        var one_type=[];
        var lent=result_t[key].length;
        one_type.push('<ol>');
        
        lent=(blmax>0?Math.min(blmax,lent):lent);
        for (let blxl=0;blxl<lent;blxl++){
            var item=result_t[key][blxl][0];
            one_type.push('<li>'+arow_dbb(item,show_txtbook).join(' ⦙ ')+'</li>');
        }
        one_type.push('</ol>');       
        bljg.push([key.substring(2,),result_t[key].length,one_type.join('\n')]); 
    }
    
    bljg.sort(function (a,b){return zh_sort_b(a,b,false,0);}); 
    //bljg=array_split_by_col_b(bljg,[1,2]);
    
    for (let blxl=0,lenb=bljg.length;blxl<lenb;blxl++){
        bljg[blxl]='<h4>'+(blxl+1)+'. '+bljg[blxl][0]+'('+bljg[blxl][1]+')</h4>'+bljg[blxl][2];
    }
    document.getElementById('divhtml').innerHTML=bljg.join('\n');
}

function publisher_name_simplify_dbb(csname){
    if (csname.includes('出版社')){
        csname=csname.split('出版社')[0]+'出版社';
    }
    
    var reg_exp=/^.*[◎·,\|｜丨∣，：:／\/\-\s]/;
    if (csname.match(reg_exp)){
        csname=csname.replace(reg_exp,'');
    }
    return csname;
}

function statistics_key_pie_dbb(cstype){
    var publisher_list=statistics_key_value_dbb(cstype);
    var bllen=publisher_list.length;
    if (bllen==0){return;}
        
    var result_t={};
    for (let item of publisher_list){
        var blkey='k_'+item;
        if (result_t[blkey]==undefined){
            result_t[blkey]=[item,0];
        }
        result_t[blkey][1]=result_t[blkey][1]+1;
    }
    result_t=object2array_b(result_t);  //每个元素如：[ 9.1, 15 ] - 保留注释
    
    var pyramid_str='';
    switch (cstype){
        case 'rating':
            result_t.sort(function (a,b){return a[0]<b[0] ? 1 : -1;});    
            pyramid_str=rating_pyramid_dbb(result_t);
            break;
        case '作者':
        case '出版社':
            result_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
            break;
        case 'publication_year':
            result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
            break;
    }
    result_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});

    var table_list=[];
    var bllen=publisher_list.length;
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        table_list.push('<tr><td>'+(blxl+1)+'</td><td>'+result_t[blxl][0]+'</td><td align="right">'+result_t[blxl][1]+'</td><td align="right">'+(result_t[blxl][1]*100/bllen).toFixed(2)+'%</td></tr>');
    }
        
    var blat=-1;
    for (let blxl=10,lent=result_t.length;blxl<lent;blxl++){  //至少显示前 10 个 - 保留注释
        if (result_t[blxl][1]/bllen<0.01){
            blat=blxl;
            break;
        }
    }
    
    if (bllen>100 && blat>=0){
        var other_count=0;
        var other_list=result_t.slice(blat,);
        for (let item of other_list){
            other_count=other_count+item[1];
        }
        result_t=result_t.slice(0,blat);
        result_t.push(['others',other_count]);
    }

    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]={'label': result_t[blxl][0], 'data': result_t[blxl][1]};
    }
    
    div_flot_generate_dbb(true,pyramid_str,'<table class="table_common" width=90%><tr><th>No.</th><th>Name</th><th>Count</th><th>Percent</th></tr>'+table_list.join('\n')+'</table>');
    flot_pie_b(result_t,'div_flot');
}

function upload_data_files_form_dbb(){
    var blstr='<p>Select file: <input type="file" id="input_upload_data_files_dbb" multiple /> <span class="aclick" onclick="upload_data_files_result_dbb();">上传文件</span></p>';
    document.getElementById('divhtml').innerHTML=blstr;
}

function upload_data_files_result_dbb(){
    function sub_upload_data_files_result_dbb_run(csresult){
        douban_book_global=csresult;
        document.getElementById('span_count').innerHTML='('+douban_book_global.length+')';
        alert('导入完成');
    }
    
    function sub_upload_data_files_result_dbb_done(csarr){
        merge_js_lines_from_file_list_b(csarr,'{',sub_upload_data_files_result_dbb_run); 
    }

    upload_files_to_list_b('input_upload_data_files_dbb',sub_upload_data_files_result_dbb_done,'.js');
}
