function import_files_rlater(){
    if (is_local_b()){
        var flist=['data/readlater/readlater_words_count_data.js', 'data/readlater/readlater_spam_keys_data.js', 'data/readlater/readlater_important_keys_data.js', 'data/klwiki/klwiki_page_position_data.js','data/album/wiki_album_data.js'];
        for (let blxl=0;blxl<flist.length;blxl++){
            flist[blxl]='../../../../'+flist[blxl];
        }
        klbase_addons_import_js_b([],[],[],flist);
    }
}

function import_data_rlater(){
    var blno=args_rlater(true);
    var the_year=date_2_ymd_b(false,'y');
    readlater_data_file_list_global=[];   //全局变量 - 保留注释
    if (!is_local_b()){return;}
    
    var blpath=klwebphp_path_b('data/php_writable/');
    for (blxl=readlater_start_year_b();blxl<=the_year;blxl++){
        readlater_data_file_list_global.push(blpath+'readlater_data_'+blxl);
        //形如：http://aaa/readlater_data_2024 - 保留注释
    }
    
    if (blno !== '' && !isNaN(blno)){
        if (blno<=0){
            readlater_data_file_list_global=readlater_data_file_list_global.slice(blno,);
        }
    }
    import_data_rlater_b(readlater_data_file_list_global,'load_data_rlater','');
}

function load_data_rlater(fname=''){
    var t0 = performance.now();
    var blxl=readlater_data_global.length;
    for (let item of readlater_data_original_global){
        item.push(find_host_rlater(item[0])); //添加 host - 保留注释
        item.push(blxl); //添加序号 - 保留注释
        item.push(item[1].length); //添加标题长度 - 保留注释    
        item.push(fname);
        readlater_data_global.push(item);
        blxl=blxl+1;
    }
    console.log(fname,readlater_data_original_global.length,'费时：'+(performance.now() - t0) + ' milliseconds');
    readlater_data_original_global=[];    
}

function import_bigfile_rlater(){
    function sub_import_bigfile_rlater_load(is_ok){
        if (is_ok){
            load_data_rlater(fname);
            search_websites_rlater();
        }
    }
    
    var fname=prompt_from_local_storage_b('输入文件名','bigfile_readlater') || '';
    if (fname.trim()==''){return;}
    
    readlater_data_global=[];
    readlater_data_original_global=undefined;
    load_js_var_file_b('readlater_data_original_global',[],fname,sub_import_bigfile_rlater_load,true,true);
}

function comment_rlater(){
    var key_list=local_storage_get_b('recent_search_readlater',-1,true)[0];
    var cskey=prompt('输入网址过滤字符串（可选）',key_list);
    if (cskey==null){return;}
    cskey=cskey.trim();
    recent_search_key_rlater(cskey);
    
    sort_rlater('href',false);
    sort_rlater('reverse',false);

    var today_t=date_2_ymd_b(false,'d');    
    var cstype=radio_value_get_b('radio_search_type');
    
    console.log('--------------------------------');  // - 此行保留 - 保留注释
    var csmax=parseInt(document.getElementById('input_max_rows').value);
    var result_t=new Set();
    var blno=0;
    for (let blxl=1;blxl<readlater_data_global.length;blxl++){//忽略第1条 - 保留注释
        if (cskey!=='' && !readlater_data_global[blxl][0].includes(cskey)){continue;}
        var current_hash=readlater_data_global[blxl][0].includes('#');
        var prev_hash=readlater_data_global[blxl-1][0].includes('#');        
        
        if (prev_hash || !current_hash){continue;}        
        
        var blfound=false;
        if (readlater_data_global[blxl][0].split('#')[0]==readlater_data_global[blxl-1][0]){    //排序时 无#应该在前，有#在后 - 保留注释
            blfound=true;
        } else if (readlater_data_global[blxl][0].split('/comment-page-')[0]+'/'==readlater_data_global[blxl-1][0]){
            //形如：https://new.shuge.org/ba_sui/comment-page-1/#comment-10079 - 保留注释        
            blfound=true
        }        
        if (blfound){
            result_t.add(red_one_rlater(readlater_data_global[blxl],cstype,today_t));
            //result_t.add(red_one_rlater(readlater_data_global[blxl-1],cstype,today_t));  // - 此行保留 - 保留注释
            blno=blno+1;
            console.log(blno,readlater_data_global[blxl-1]);  // - 此行保留 - 保留注释
            if (csmax>=0 && blno>=csmax){break;}
        }
    }
    result_t=Array.from(result_t);
    search_array_2_html_rlater(result_t,cstype);
}

function split_rlater(){    
    var default_value='';
    var list_t=statistics_show_rlater(false);
    if (list_t.length>0){
        if (list_t[0][2]>0){    //有可能记录减少出现负数 - 保留注释
            default_value=list_t[0][2];
        }
    }
    var new_count=prompt('输入截取记录数：',default_value);
    if (new_count==null){return;}
    new_count=parseInt(new_count.trim());
    if (isNaN(new_count)){return;}
    if (new_count<0){return;}
    readlater_data_global=readlater_data_global.slice(-1*new_count,);
    search_websites_rlater();
}

function month_rlater(csno=0,csy=0,is_today=false){
    var bldate=date2str_b('-');
    var ym=bldate.substring(0,7);
    if (csno>0){
        ym=prev_month_b(ym,csno);
    }
    if (ym.substring(5,6)=='0'){
        var blm='0*'+ym.slice(-1);
    } else {
        var blm=ym.slice(-2,);
    }
    
    if (csy<0){
        var bly=date_2_ymd_b(false,'y')+csy;
        ym=bly+ym.substring(4,);
    }
    if (is_today){
        var blday=bldate.slice(-2,);
        if (blday.substring(0,1)=='0'){
            blday='0*'+blday.slice(-1);
        }
    } else {
        var blday='(0*[1-9]|[1-3][0-9])';
    }
    var blstr=ym.substring(0,4)+'[^0-9]*?'+blm+'[^0-9]*?'+blday+'[^0-9]*(:r)';  
    search_websites_rlater(blstr);
}

function weibo_weixin_user_rlater(){
    radio_value_set_b('radio_search_type',1);
    search_websites_rlater();
    window.open('./PythonTools/data/selenium_news/html/js_data_file_common_search.htm?s=klwiki_h3_pb_data');
}

function menu_rlater(){
    var str_t=klmenu_hide_b('#top');

    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'search_in_site_rlater();">站内搜索</span>',   
    '<span class="span_menu" onclick="'+str_t+'fav_show_rlater();">Fav</span>',   
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    '<span class="span_menu" onclick="'+str_t+'month_rlater(0,-1,true);">去年今日</span>',       
    ];
    
    var group_list=[
    ['本月','month_rlater();',true],
    ['上月','month_rlater(1);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));        
    
    var klmenu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'tags_editor_rlater();">Tags</span>',    
    '<span class="span_menu" onclick="'+str_t+'statistics_show_rlater();">Statistics</span>',
    '<span class="span_menu" onclick="'+str_t+'split_rlater();">截取最新记录</span>',
    '<span class="span_menu" onclick="'+str_t+'duplication_rlater();">duplication</span>',        
    '<span class="span_menu" onclick="'+str_t+'comment_rlater();">#记录</span>',    
    '<span class="span_menu" onclick="'+str_t+'weibo_weixin_user_rlater();">当前条件微博、微信用户统计</span>',    
    ];   
    
    var group_list=[
    ['当前','jieba_keys_rlater();',true],
    ['全部','jieba_keys_rlater(true);',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'分词：'));        
    
    var klmenu_link=[];
    if (is_local_b()){
        klmenu_link.push('<a href="'+klwiki_link_b('百度热榜')+'" onclick="'+str_t+'" target=_blank>百度热榜 - WIKI</a>');    
        
        var group_list=[
        ['次要新闻','klwiki_link_b(\'次要新闻\',true);',true],
        ['按整理日期归集','klwiki_link_b(\'次要新闻 - 按整理日期归集\',true);',true],
        ];    
        klmenu_link.push(menu_container_b(str_t,group_list,''));    

        var group_list=[
        ['upload:','window.open(\'../../../../upload.php\');',true],
        ['klwebphp','window.open(\'../../../../upload.php?type=klwebphp\');',true],
        ];    
        klmenu_link.push(menu_container_b(str_t,group_list,''));    
        klmenu_link.push('<a href="../../../../temp_txt_append.php" onclick="'+str_t+'" target=_blank>➕ Temp txt append</a>');

        var klmenu_spam=[];
        var group_list=[
        ['RND','search_batch_rlater(readlater_spam_keys_global,true);',true],
        ['TEST','search_batch_rlater(readlater_spam_keys_global,true,-1,true);',true],
        ['浏览内容','array_sites_rlater(readlater_spam_keys_global);',true],
        ];    
        klmenu_spam.push(menu_container_b(str_t,group_list,''));    
            
        for (let item of readlater_spam_keys_global){    
            klmenu_spam.push('<span class="span_menu" onclick="'+str_t+'search_websites_rlater(\''+item+'\');">'+item+'</span>');
        }
        
        var klmenu_important=[];
        var group_list=[
        ['RND','search_batch_rlater(readlater_important_keys_global,true);',true],
        ['TEST','search_batch_rlater(readlater_important_keys_global,true,-1,true);',true],
        ['浏览内容','array_sites_rlater(readlater_important_keys_global);',true],    
        ];    
        klmenu_important.push(menu_container_b(str_t,group_list,''));    
        
        for (let item of readlater_important_keys_global){    
            klmenu_important.push('<span class="span_menu" onclick="'+str_t+'search_websites_rlater(\''+item+'\');">'+item+'</span>');
        }
    
        var local_menu_group=klmenu_b(klmenu_link,'L','16rem','1rem','1rem','60rem')+klmenu_b(klmenu_important,'💎','24rem','1rem','1rem','30rem')+klmenu_b(klmenu_spam,'🗑','24rem','1rem','1rem','30rem');
    } else {
        var local_menu_group='';
    }
    
    var klmenu_idb=[
    '<span id="span_reg_rlater" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',      
    select_delete_type_generate_rlater_b(),
    '<a href="?load=-1" onclick="'+str_t+'">仅导入最新data文件</a>',    
    '<span class="span_menu" onclick="'+str_t+'clear_cached_deleted_rows_rlater_b(\'readlater_deleted_rows\');">清除今日删除记录</span>',
    '<span class="span_menu" onclick="'+str_t+'delete_batch_from_array_form_rlater_b(\'readlater\');">导入数组批量删除</span>',    
    '<span class="span_menu" onclick="'+str_t+'import_bigfile_rlater();">导入 bigfile 文件</span>',    
    
    ];    
    
    var group_list=[
    ['write','if (confirm(\'是否写入数据到IDB？\')){idb_rlater(\'write\');}',true],
    ['read','if (confirm(\'是否从IDB读取数据？\')){idb_rlater(\'read\');}',true],
    ['clear','if (confirm(\'是否清除IDB数据？\')){idb_rlater(\'clear\');}',true],    
    ['count','idb_rlater(\'count\');',true],    
    
    ];    
    klmenu_idb.push(menu_container_b(str_t,group_list,'IDB: '));    

    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'🛋','10rem','1rem','1rem','60rem')+klmenu_b(klmenu_statistics,'🧮','16rem','1rem','1rem','30rem')+klmenu_b(klmenu_idb,'⚙','17rem','1rem','1rem','60rem')+local_menu_group,'','0rem');
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',bljg+' ');    
    klmenu_check_b('span_reg_rlater',true);
}

function jieba_sites_rlater(){
    var list_t=[];
    var ospans=document.querySelectorAll('#section_jieba span.span_jieba_key_rlater');
    for (let blxl=0;blxl<ospans.length;blxl++){
        list_t.push(ospans[blxl].innerText);
        if (blxl>300){break;}
    }
    tags_websites_rlater(list_t,false,20);
}

function array_sites_rlater(csarray){
    tags_websites_rlater(csarray.slice(0,300),false,20);
}

function jieba_keys_rlater(isall=false){
    if (isall){
        arr_t=readlater_words_count_global;
    } else {
        var list_t=[];
        var oas=document.getElementsByClassName('a_rlater_link');
        var blxl=0;
        for (let item of oas){
            list_t.push(item.innerText);
            blxl=blxl+1;
            if (blxl>=5000){
                break;
            }
        }
        var blstr=list_t.join('\n');
        var arr_t = count_words_b(blstr,split_words_b(blstr,true),2);
        arr_t=arr_t.slice(0,200);
    }
    var str_t='';
    for (let item of arr_t){
        var blkey=specialstr92_b(item[0]);
        str_t=str_t+'<span class="oblong_box span_jieba_key_rlater" onclick="search_r_key_b(\'input_search\',\'\',\''+blkey+'\');search_websites_rlater();document.location.href=\'#div_links\';">'+blkey+'</span> <span style="color:'+scheme_global['memo']+';">'+item[1]+'</span> ';
    }
    
    var blbuttons='<span class="oblong_box" onclick="jieba_sites_rlater();"><strong>浏览内容</strong></span> ';
    blbuttons=blbuttons+'<span class="oblong_box" onclick="this.parentNode.innerHTML=\'\';"><strong>Close</strong></span>';
    
    var odiv=document.getElementById('section_jieba');
    odiv.innerHTML = '<p>'+str_t+blbuttons+'</p>';
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function span_subtitle_rlater(){
    var list_t=['需要知道吗？','不知道没关系吧？','如果每天只有5分钟浏览时间，那么首先看什么？','关注能改变的'];
    list_t.sort(randomsort_b);
    document.getElementById('span_subtitle').innerHTML=list_t[0];
}

function tags_editor_rlater(){
    var bltags=local_storage_get_b('keywords_selenium',-1,false);
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?keywords_selenium" name="form_tags_readlater" target=_blank>\n';    
    bljg=bljg+'<p>输入关键字，以英文逗号或回车换行隔开：</p>';
    bljg=bljg+'<p><textarea name="textarea_tags_readlater" id="textarea_tags_readlater" style="height:10rem;">'+bltags+'</textarea></p>';
    bljg=bljg+'<p>'
    bljg=bljg+'<span class="aclick" onclick="tags_update_rlater();">Update</span> ';
    
    bljg=bljg+textarea_buttons_b('textarea_tags_readlater','清空,复制,发送到临时记事本,发送地址','keywords_selenium');

    bljg=bljg+'</p></form>';
    div_column_count_rlater(bljg);
}

function tags_update_rlater(){
    if (!confirm('是否更新？')){return;}
    var otextarea=document.getElementById('textarea_tags_readlater');
    var list_t=otextarea.value.trim().split('\n');
    var result_t=[];
    for (let item of list_t){
        result_t=result_t.concat(item.split(','));
    }
    result_t=array_unique_b(result_t);
    result_t.sort();
    var blstr=result_t.join(',');
    localStorage.setItem('keywords_selenium',blstr);
    otextarea.value=blstr;
}

function fav_clear_rlater(){
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空') || '').trim()==rndstr){
        localStorage.setItem('fav_sites_rlater','');
        fav_show_rlater();
    }
}

function fav_update_rlater(){
    var otextarea=document.getElementById('textarea_fav_readlater');
    if (!otextarea){return;}
    var blstr=otextarea.value;
    if (confirm('是否更新('+blstr.length+')？')){
        localStorage.setItem('fav_sites_rlater',blstr);
        fav_show_rlater();
    }
}

function fav_show_rlater(){
    var fav_sites=local_storage_get_b('fav_sites_rlater',-1,false);

    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_fav_readlater" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_fav_readlater" id="textarea_fav_readlater" style="height:20rem;">'+fav_sites+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="fav_update_rlater();">Update</span> ';
    bljg=bljg+'<span class="aclick" onclick="fav_clear_rlater();">Clear</span> ';
    bljg=bljg+textarea_buttons_b('textarea_fav_readlater','复制,发送到临时记事本,发送地址')+' rows: '+fav_sites.split('\n').length;

    bljg=bljg+'</p>\n</form>\n';
    
    bljg=bljg+'<textarea onclick="this.select();document.execCommand(\'copy\');">=== '+date2str_b('')+' ===</textarea>\n'
    div_column_count_rlater(bljg);
}

function random_pages_rlater(cscount=10){
    function sub_random_pages_rlater_one_page(){
        if (blxl<list_t.length){
            document.title=(blxl+1)+'/'+bllen+' - '+old_title;
            for (let item of oas){
                if (item.href==list_t[blxl][0]){
                    item.click();
                    item.style.backgroundColor=scheme_global['pink'];
                    break;
                }
            }
            blxl=blxl+1;
            setTimeout(sub_random_pages_rlater_one_page,1500);
            return;
        }
        
        if (blxl<oas.length){ //与总的链接数比较 - 保留注释
            var bljg='<h4>书签</h4><ol>';
            for (let item of list_t){
                bljg=bljg+'<li><a href="#'+item[2]+'">'+specialstr92_b(item[1])+'</a></li>';
            }
            bljg=bljg+'</ol>';
            bljg=bljg+'<p>'+close_button_b('div_info','')+'</p>';
            document.getElementById('div_info').innerHTML=bljg;
        }
        document.title=old_title;
    }
    //-----------------------
    var oas=document.querySelectorAll('a.a_rlater_link');
    //不能使用 oas.sort() 和 oas.slice() - 保留注释
    var list_t=[];
    for (let item of oas){
        if (item.style.backgroundColor!==''){continue;}
        list_t.push([item.href,item.innerText,item.id]);
    }

    for (let blno=0;blno<8;blno++){
        list_t.sort(randomsort_b);
    }
    list_t=list_t.slice(0,cscount);
    var blxl=0;
    var bllen=Math.min(cscount,oas.length);
    var old_title=document.title;
    sub_random_pages_rlater_one_page();
}

function find_host_rlater(cshref){
    var blhost='';
    if (cshref.includes('//')){
        var blstr=cshref.split('//')[1].split('/')[0];
        var list_t=blstr.split('.');
        if (list_t.length==2){
            blhost=list_t[0];
        } else if (list_t.length==3){
            blhost=list_t[1];
        } else if (list_t.length>3){
            if (list_t[0]=='www'){
                blhost=list_t[1];
            } else {
                blhost=list_t[2];
            }
        } else {
            blhost=blstr;
        }
    }
    return blhost;
}

function statistics_set_rlater(){
    local_storage_today_b('readlater_statistics',40,readlater_data_global.length,': ',[8,0,0.5]);
}

function init_data_rlater(){
    for (let blxl=0;blxl<readlater_data_global.length;blxl++){
        var item=readlater_data_global[blxl];
        if (item.length==6){continue;}
        readlater_data_global[blxl].push(find_host_rlater(item[0])); //添加 host - 保留注释
        readlater_data_global[blxl].push(blxl); //添加序号 - 保留注释
        readlater_data_global[blxl].push(item[1].length); //添加标题长度 - 保留注释        
        readlater_data_global[blxl].push('');//来源文件名 - 保留注释
    }
    statistics_set_rlater();
    
    //-----------------------
    marked_rows_get_rlater_b('readlater'); //放在 args_rlater 前 - 保留注释
    args_rlater();
    span_subtitle_rlater();
}

function init_style_rlater(){
    input_with_x_b('input_search',15);
    input_size_b([['input_max_rows',4,0.5],['input_max_delete_rlater',4,0.5]],'id');
    init_data_rlater();
    menu_rlater();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.6rem':'1.4rem'));
    character_2_icon_b('🛋');
    setTimeout(img_today_set_rlater,1000);
}

function args_rlater(load_data=false){
    var cskeys=href_split_b(location.href);
    var blkey='';
    if (load_data){
        if (cskeys.length>0 && cskeys[0]!==''){
            for (let item of cskeys){
                item=item.trim();
                if (item.substring(0,5)=='load='){
                    return parseInt(item.substring(5,).trim());
                }
            }
        }
        return;
    }
    
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let item of cskeys){
            item=item.trim();
            if (item.substring(0,2)=='k='){
                blkey=item.substring(2,);
                break;
            }
        }
    }
    search_websites_rlater(blkey);
}

function host_data_rlater(is_count=true){
    var t0 = performance.now();

    var list_t={};
    for (let item of readlater_data_global){
        if (item[0].substring(0,4)=='http'){
            var site_t=item[0];
        } else {
            var site_t=item[1];
        }
        site_t=site_t.replace(new RegExp('https?:\/\/(.*?)\/.*','g'),'$1');
        
        if (list_t['s_'+site_t]==undefined){
            if (is_count){
                list_t['s_'+site_t]=[site_t,0];
            } else {
                list_t['s_'+site_t]=[];            
            }
        }
        if (is_count){
            list_t['s_'+site_t][1]=list_t['s_'+site_t][1]+1;
        } else {
            list_t['s_'+site_t].push(item);            
        }
    }
    
    if (!is_count){
        list_t=object2array_b(list_t);
        list_t.sort(randomsort_b);
        list_t.sort(function (a,b){return a.length<b.length ? 1 : -1;});
        
        readlater_data_global=[];
        for (let item of list_t){
            readlater_data_global=readlater_data_global.concat(item);
        }
    }
    console.log('host_data_rlater() 费时：'+(performance.now() - t0) + ' milliseconds');    
    return list_t;
}

function host_count_rlater(refresh=false,only_return_array=false){
    if (refresh || readlater_host_global.length==0){
        readlater_host_global=[];
        
        var list_t=host_data_rlater(true);
        for (let blkey in list_t){
            readlater_host_global.push(list_t[blkey]);
        }
        readlater_host_global.sort(function (a,b){return b[1]>a[1] ? 1 : -1;});
    }
    
    if (only_return_array){return;}
    
    var bljg='';
    var added_line=false;
    for (let item of readlater_host_global){
        if (added_line===false && item[1]<=100){
            var blid=' id="li_host_100_rlater"';
            added_line=true;
        } else {
            var blid='';
        }
        bljg=bljg+'<li'+blid+'><span class="span_link" onclick="search_r_key_b(\'input_search\',\'\',\'+'+item[0]+'\');search_websites_rlater(); jieba_keys_rlater();">'+item[0]+'</span> '+item[1]+'</li>';
    }
    var blbuttons='<p><span class="aclick" onclick="host_sites_rlater();">浏览内容</span>';
    blbuttons=blbuttons+'<span class="aclick" onclick="host_count_rlater(true);">刷新信息源</span>';
    blbuttons=blbuttons+'<span class="aclick" onclick="host_100_line_rlater();">100分界线</span>';
    
    var progress_list=ltp_status_get_b('+readlater +信息源','mediumaquamarine','white',100);

    blbuttons=blbuttons+' '+progress_list.join(' ')+'</p>';
    
    bljg=blbuttons+'<ol>'+bljg+'</ol>'
    div_column_count_rlater(bljg,false);
}

function host_100_line_rlater(){
    var oli=document.getElementById('li_host_100_rlater');
    if (oli){
        oli.scrollIntoView();
    }
}

function host_sites_rlater(){
    var list_t=[];
    for (let blxl=0;blxl<readlater_host_global.length;blxl++){
        list_t.push(readlater_host_global[blxl][0]);
        if (blxl>300){break;}
    }
    tags_websites_rlater(list_t,false,20);
}

function sites_type_rlater(cslist,cstype,csstrong=false){
    if (cslist.length!==6){return '';} //readlater_data_global 每行元素个数 - 保留注释
    
    var cslink=cslist[0];
    var cstitle=cslist[1];
    var idno=cslist[3];
    var prgname='readlater';
    
    var bljg='';
    switch(cstype){
        case '1':
            bljg=bljg+'["'+specialstr_j(cslink)+'", "'+specialstr_j(cstitle)+'"],\n';
            break;
        case '2':
            bljg=bljg+one_link_gerenrate_rlater_b(idno,cslink,cstitle,csstrong,prgname);
            break;
        case '3':
            bljg=bljg+'# ['+specialstr_html_b(cslink)+'&nbsp;';
            if (cstitle.includes('[') || cstitle.includes(']')){
                bljg=bljg+'<nowiki>';
            }
            bljg=bljg+specialstr_html_b(cstitle);
            if (cstitle.includes('[') || cstitle.includes(']')){
                bljg=bljg+'</nowiki>';
            }                
            bljg=bljg+']\n';
            break;            
    }
    return bljg;
}

function title_words_rlater(cscount=20){
    var cn_t=new Set();
    var en_t=new Set();
    var key_list;
    for (let item of readlater_data_global){
        key_list=item[1].match(/[^\x00-\xff]/g); //末尾须加g - 保留注释
        if (key_list!==null){
            key_list.sort(randomsort_b);
            cn_t.add(key_list[0]);
        }

        key_list=item[1].match(/\b[a-zA-Z]{2,}\b/g);
        if (key_list!==null){
            key_list.sort(randomsort_b);
            en_t.add(key_list[0]);
        }
        if (cn_t.size>1000 && en_t.size>1000){break;}   
    }
    
    var list_t=Array.from(cn_t).concat(Array.from(en_t));
    list_t.sort(randomsort_b);
    return list_t.slice(0,cscount);
}

function duplication_rlater(){
    sort_rlater('href',false);

    var today_t=date_2_ymd_b(false,'d');    
    var cstype=radio_value_get_b('radio_search_type');
    
    var result_t=new Set();
    for (let blxl=1;blxl<readlater_data_global.length;blxl++){//忽略第1条 - 保留注释
        if (readlater_data_global[blxl][0]==readlater_data_global[blxl-1][0]){
            result_t.add(red_one_rlater(readlater_data_global[blxl],cstype,today_t));
            result_t.add(red_one_rlater(readlater_data_global[blxl-1],cstype,today_t));
        }
    }
    result_t=Array.from(result_t);
    search_array_2_html_rlater(result_t,cstype);
}

function sort_rlater(cstype,dosearch=true){
    switch(cstype){
        case '':
            return;
        case '默认':
            readlater_data_global.sort(function (a,b){return a[3]>b[3] ? 1 : -1;});
            break;
        case 'href':
            readlater_data_global.sort(function (a,b){return a[0]<b[0] ? 1 : -1;});
            break;
        case 'title':
            readlater_data_global.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
            break;
        case 'host':
            readlater_data_global.sort(function (a,b){return a[2]<b[2] ? 1 : -1;});
            break;
        case 'length':
            readlater_data_global.sort(function (a,b){return a[4]>b[4] ? 1 : -1;});
            break;       
        case 'host_count':
            host_data_rlater(false);
            break;
        case 'random':
            readlater_data_global.sort(randomsort_b);
            break;
        case 'reverse':
            readlater_data_global.reverse();
            break;
        default:
            document.getElementById('input_search').value=cstype;
    }
    
    if (dosearch){
        var odiv_links=document.getElementById('div_links');
        if (odiv_links){
            odiv_links.innerHTML='<b>刷新中...</b>';
        }
        setTimeout(search_websites_rlater,100);
    }
}

function red_one_rlater(csitem,cstype,csday){
    return sites_type_rlater(csitem,cstype,((asc_sum_b(csitem[1])+csday) % 7 == 0));
}

function top_pages_rlater(cspageno=1){
    var cstype=radio_value_get_b('radio_search_type');
    var myDate = new Date(); 
    var today_t=myDate.getDate();

    var len_t=readlater_data_global.length;
    
    var result_t=[];
    for (let blxl=len_t-1-(cspageno-1);blxl>len_t-1-(cspageno-1)-recentlength_global;blxl--){
        if (blxl<0){break;}
        result_t.push(red_one_rlater(readlater_data_global[blxl],cstype,today_t));
    }

    var pages_count=Math.ceil(len_t/recentlength_global);
    var rand_page_no_list=randint_list_b(1,pages_count,2);
    
    var page_html=page_combination_b(len_t,recentlength_global,cspageno,'top_pages_rlater','top_page_location_rlater','',1,800,'','aclick',1,false,rand_page_no_list);

    document.getElementById('div_top_rlater').outerHTML=top_div_rlater(result_t.join('\n'),'TOP',cstype,ismobile_b(),page_html);
    document.getElementById('div_top_rlater').scrollIntoView();
}

function top_page_location_rlater(cspages){
    var blno=page_location_b(cspages);
    if (blno!==false){
        top_pages_rlater((blno-1)*recentlength_global+1);
    }
}

function top_div_rlater(csstr,tagname,cstype,is_mobile,pages=''){
    var col_count=(is_mobile?1:2);
    if (cstype=='2'){
        if (tagname=='TOP'){
            return '<div id="div_top_rlater" style="position:relative;float:left;padding:3px;margin:3px; border:2px dashed #c0c0c0;column-count:'+col_count+';"><p><span style="cursor:pointer;font-weight:bold;font-size:large"" onclick="sort_rlater(\'random\');" title="随机排序">'+tagname+'</span></p><ol>'+csstr+'</ol>'+pages+'</div>';
        } else {
            return '<div style="position:relative;float:left;padding:3px;margin:3px; border:2px dashed #c0c0c0;column-count:'+col_count+';"><p><span style="cursor:pointer;font-weight:bold;font-size:large;" onclick="tag_refresh_rlater(this);" title="随机刷新本栏">'+tagname+'</span></p><ol>'+csstr+'</ol>'+pages+'</div>';
        }
    } else {
        return csstr;
    }
}

function tag_refresh_rlater(ospan){
    var blkey=ospan.innerText;
    var odiv=ospan.parentNode.parentNode;
    var ool=odiv.querySelector('ol');
    var olis=ool.querySelectorAll('li');
    var bllen=olis.length;
    var result_t=tags_websites_rlater([blkey],false,bllen*10,false,true);
    if (result_t.length==1){
        var bljg=result_t[0].trim().split('\n');
        bljg.sort(randomsort_b);
        ool.innerHTML=bljg.slice(0,bllen).join('\n');
    } else {
        ool.innerHTML='';
    }
}

function tags_websites_rlater(taglist=[],showrecent=true,csmax=10,showhtml=true,only_li=false){
    var t0 = performance.now();
    var cstype=radio_value_get_b('radio_search_type');

    if (taglist.length==0){
        taglist=local_storage_get_b('keywords_selenium').trim().split(',');
        taglist.sort(randomsort_b);
        taglist=taglist.slice(0,50);   //防止 keywords_selenium 过多 - 保留注释        
        
        taglist=taglist.concat(title_words_rlater(20));
        //taglist=taglist.concat(title_words_rlater('cn',10),title_words_rlater('en',10)); - 保留注释

        var myDate = new Date(); 
        var theyear=myDate.getFullYear();
        var today_t=myDate.getDate();
        for (let blxl=theyear-2;blxl<=theyear;blxl++){
            taglist.push(blxl.toString());
        }
        taglist.push(randstr_b(1));
        
        taglist.sort(randomsort_b);
        taglist.push('TOP');        
    }
    
    var list_t=[];
    //[[href1,title1],[href2,title2],...] - 保留注释
    if (showrecent){
        list_t['t_TOP']=[];
        var recentlength=recentlength_global;
    } else {
        var recentlength=0;
    }

    for (let tagname of taglist){    //这4行代码独立出来后，速度加快了 - 保留注释
        if (list_t['t_'+tagname]==undefined){
            list_t['t_'+tagname]=[];
        }
    }

    for (let blxl=0;blxl<readlater_data_global.length-recentlength;blxl++){
        for (let tagname of taglist){
            if (tagname=='TOP'){continue;}
            if (readlater_data_global[blxl][0].toLowerCase().includes(tagname.toLowerCase()) || readlater_data_global[blxl][1].toLowerCase().includes(tagname.toLowerCase())){
                list_t['t_'+tagname].push(readlater_data_global[blxl]);
                break;
            }
        }
    }

    if (showrecent){
        var len_t=readlater_data_global.length;
        for (let blxl=len_t-1;blxl>=Math.max(0,len_t-recentlength);blxl--){
            list_t['t_TOP'].push(readlater_data_global[blxl]);
        }
        taglist.reverse();
    }

    //taglist 类似于：[​​"TOP","静","林","舟","粉","肢","房","歐","步","设"] - 保留注释
    var result_t=[];
    var is_mobile=ismobile_b();
    for (let tagname of taglist){
        if (list_t['t_'+tagname]==undefined || list_t['t_'+tagname].length==0){continue;}

        var blno=0;
        var blstr='';
        for (let item of list_t['t_'+tagname]){
            blstr=blstr+red_one_rlater(item,cstype,today_t);
            blno=blno+1;
            if (blno>=csmax && tagname!=='TOP'){break;}
        }
        if (only_li){
            result_t.push(blstr);        
        } else {
            var blbutton=((tagname=='TOP' && readlater_data_global.length>recentlength_global)?'<span class="aclick" onclick="top_pages_rlater('+(recentlength_global+1)+');">more</span>':'');
            result_t.push(top_div_rlater(blstr,tagname,cstype,is_mobile,blbutton));
        }
    }
        
    var bljg=result_t.join('\n');
    if (showhtml){
        if (cstype!=='2'){
            bljg='\n<textarea style="height:38rem;">\n'+bljg+'</textarea>\n';
        }
        bljg=years_rlater_b(readlater_data_global.length)+'<div id="div_links">'+bljg+'</div>';    
        div_column_count_rlater(bljg);
    }
    console.log('tags_websites_rlater() 费时：'+(performance.now() - t0) + ' milliseconds');
    return result_t;
}

function search_batch_rlater(key_list,randomsort=false,csmax=-1,istest=false){
    function sub_search_batch_rlater_one_key(){
        if (istest){
            if (blxl>=bllen){
                test_t=object2array_b(test_t,true);
                test_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
                for (let blxl=0;blxl<test_t.length;blxl++){
                    test_t[blxl]=test_t[blxl][0].substring(2,)+': '+test_t[blxl][1];
                }
                div_column_count_rlater(array_2_li_b(test_t));
                return;
            }        
        } else {
            if (blxl>=bllen || result_t.size>=csmax){
                search_array_2_html_rlater(Array.from(result_t).slice(0,csmax),radio_value_get_b('radio_search_type'));
                return;
            }
        }
        
        var one_key=searchkeys[blxl].trim();
        if (!['','.*','(:r)','.*(:r)'].includes(one_key)){
            var search_t=search_websites_rlater(one_key,false,-1,false,false);
            if (istest){
                test_t['k_'+one_key]=search_t.length;
            } else {
                result_t=array_union_b(result_t,new Set(search_t),true);
            }
        }
                
        blxl=blxl+1;
        setTimeout(sub_search_batch_rlater_one_key,10);
    }
    //-----------------------
    var searchkeys=[].concat(key_list);
    if (randomsort){
        searchkeys.sort(randomsort_b);
    }
    if (csmax===-1){
        csmax=parseInt(document.getElementById('input_max_rows').value);
    }
    if (csmax===-1){
        csmax=1000;
    }
    
    var result_t=new Set();
    var test_t={};
    var bllen=searchkeys.length;
    var blxl=0;
    sub_search_batch_rlater_one_key();
}

function recent_search_key_rlater(csstr=''){
    recent_search_b('recent_search_readlater',csstr,'sort_rlater','div_recent_search',["-[^\\x00-\\xff](:r)", ".*", "https?:\/\/[^\/]+\/?$(:r)", "javascript|python|linux|bash(:r)","javascript(:r)", "python(:r)", "linux(:r)","bash(:r)","^[美国万岁](:r)",],20);
}

function search_websites_rlater(cskeys='',israndom=-1,rnd_number=20,showhtml=true,add_recent_search=true){ //rnd_number 只在 random 时有效 - 保留注释
    if (israndom===-1){
        if (document.getElementById('select_sort').value=='random'){
            sort_rlater('random',false);
        }
        israndom=false;
    }
    if (israndom===false){
        if (cskeys===''){
            cskeys=document.getElementById('input_search').value;
        }

        var csreg=klmenu_check_b('span_reg_rlater',false);
        [cskeys,csreg]=str_reg_check_b(cskeys,csreg);
        
        document.getElementById('input_search').value=cskeys;
        
        if (add_recent_search){
            recent_search_key_rlater(cskeys+(csreg?'(:r)':''));
        }

        if (cskeys=='' || cskeys=='.*'){
            return tags_websites_rlater([],true,10,showhtml);
        }
    } else {
        sort_rlater('random',false);
    }
    var cstype=radio_value_get_b('radio_search_type');
    var bljg=[];
    var blxl=0;
    var rows_max=document.getElementById('input_max_rows').value;
    var today_t=date_2_ymd_b(false,'d');    
    
    if (israndom){
        for (let item of readlater_data_global){
            bljg.push(red_one_rlater(item,cstype,today_t));
            blxl=blxl+1;
            if (blxl>=rnd_number){break;}
        }
    } else {
        for (let item of readlater_data_global){
            var blfound=str_reg_search_b(item,cskeys,csreg);
            if (blfound==-1){
                return [];
            }
            if (blfound==false){continue;}
            bljg.push(red_one_rlater(item,cstype,today_t));
            blxl=blxl+1;
            if (rows_max>=0 && blxl>=rows_max){break;}
        }
    }
    if (showhtml){
        search_array_2_html_rlater(bljg,cstype);
    }
    return bljg;
}

function search_array_2_html_rlater(csarr,cstype){
    var bljg=csarr.join('\n');
    if (cstype=='2'){
        bljg='<ol>'+bljg+'</ol>';
    } else if (cstype=='1'){
        bljg='var readlater_data_global=[\n'+bljg+'];\nreadlater_data_global.sort();\n';
    }
    if (cstype!=='2'){
        bljg='\n<textarea style="height:38rem;">\n'+bljg+'</textarea>\n<p class=mini>('+csarr.length+')</p>\n';
    }
    
    bljg=years_rlater_b(readlater_data_global.length,csarr.length)+bljg+'<p><span class="aclick" onclick="delete_batch_rlater_b();">批量删除</span> <span id="span_batch_delete_process"></span></p>';
    bljg='<div id="div_links">'+bljg+'</div>';    
    
    div_column_count_rlater(bljg,cstype!=='2');
}

function div_column_count_rlater(cscontent,is_one=true){
    var odiv=document.getElementById('div_search_links');
    odiv.innerHTML=cscontent;
    odiv.style.columnCount=((is_one || ismobile_b())?1:2);
}

function search_in_site_rlater(){
    var ospan=document.querySelector('span.span_search_in_site');
    if (ospan){return;}
    var oas=document.querySelectorAll('div#div_links a.a_rlater_link');
    for (let one_a of oas){
        var blhref=one_a.href;
        if (!blhref){continue;}
        blhref=blhref.replace(/^.*\/\/([^\/]+)\/?.*$/g,'$1');
        var bltxt=encodeURIComponent(one_a.innerText);
        var bljg='<span class="oblong_box" onclick="window.open(\'https://www.bing.com/search?q='+bltxt+' site: '+blhref+'\');">Bing</span> ';
        bljg=bljg+'<span class="oblong_box" onclick="window.open(\'https://www.baidu.com/baidu?wd='+bltxt+' site: '+blhref+'\');">Baidu</span>';
        bljg='<span class="span_search_in_site" style="line-height:180%;font-size:0.7rem;color:'+scheme_global['memo']+';">'+bljg+'</span>';
        one_a.insertAdjacentHTML('afterend',' '+bljg);
    }
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_links span.span_search_in_site span.oblong_box'));
}

function statistics_show_rlater(showhtml=true){
    var date_list=[];
    var tr_list=[];
    var flot_list=[];
    [date_list,tr_list,flot_list]=date_rows_tr_generate_b('readlater_statistics',25,[8,0,0.5],0,': ');
    if (showhtml && tr_list.length>0){
        var progress_list=ltp_status_get_b('+readlater +data +js','red','white',100);
        var bljg='';
        bljg=bljg+'<table border=1 cellspacing=0 cellpadding=0 style="margin:1rem 0rem;"><tr>';
        bljg=bljg+'<th style="padding:0.2rem;" nowrap>日期</th><th style="padding:0.2rem;" nowrap><span class="span_link" onclick="statistics_set_rlater();statistics_show_rlater();" title="更新">信息条数</span></th><th style="padding:0.2rem;" nowrap>Δ</th></tr>';
        bljg=bljg+tr_list.join('\n')+'</table>';
        
        var blcontainer='<table width=100% height=80%><tr>';
        blcontainer=blcontainer+'<td valign=top width=1 height=100%>'+bljg+'</td>';
        blcontainer=blcontainer+'<td valign=top width=85% style="padding-left:0.5rem;">';
        blcontainer=blcontainer+'<div style="display:inline-block;">'+progress_list.join('</div><div style="margin-left:2rem;display:inline-block;">')+'</div>';
        blcontainer=blcontainer+'<div style="width:100%;height:500px;" id="div_flot"></div><div id="div_img_rlater" align=center></div></td>';
        blcontainer=blcontainer+'</tr></table>';
        div_column_count_rlater(blcontainer);
        flot_lines_b([['信息条数'].concat(flot_list)],'div_flot','nw',true,'','d','',0,[1, 'day'],8);
        img_today_show_rlater();        
    }
    return date_list;
}

function img_today_set_rlater(){
    var days=days_remained_of_year_b();
    var list_t=filter_array_img_b(photo_source_global,'BIGPHOTO');
    photo_source_global=[];
    for (let afile of list_t){
        if ((asc_sum_b(afile) + days) % 366 == 0){
            photo_source_global.push(afile.split(' /// ')[0]);
        }
    }
    photo_source_global.sort(function (a,b){return asc_sum_b(a)<asc_sum_b(b) ? 1 : -1;});
}

function img_today_show_rlater(){
    function sub_img_today_rlater_canvas(oimg){
        var odiv=document.getElementById('div_img_rlater');
        var rect=odiv.getBoundingClientRect();
        
        var blw,blh,doresize;
        [blw,blh,doresize]=resize_img_check_b(oimg,rect.width*0.9,-1,true);

        var ocanvas=document.createElement('canvas');    
        ocanvas.width=blw;
        ocanvas.height=blh;
        odiv.appendChild(ocanvas);
        var ctx=ocanvas.getContext('2d');    
        ctx.drawImage(oimg, 0, 0, oimg.naturalWidth|oimg.width, oimg.naturalHeight|oimg.height, 0,0, blw, blh);    
        return [blw,blh,ctx,ocanvas];
    }

    function sub_img_today_rlater_date(){
        var list_t=local_storage_get_b('readlater_deleted_rows',-1,true);
        var bldate=list_t[0];
        return [bldate==date2str_b(),list_t.length-2];
    }
    
    function sub_img_today_rlater_array(){
        var blcount=deleted_count;
        
        if (blcount>=(csno+1)*grids_count){return [];}  //达成任务 - 保留注释
        
        var num_list=[];
        for (let blxl=csno*grids_count;blxl<(csno+1)*grids_count;blxl++){
            num_list.push(blxl);
        }
        
        var days=days_remained_of_year_b();
        num_list.sort(function (a,b){
            return (asc_sum_b(a.toString()) + days) % 31 > (asc_sum_b(b.toString()) + days) % 31;
        });
        blcount=Math.max(0,blcount-csno*grids_count);
        num_list=num_list.slice(blcount,);
        for (let blxl=0;blxl<num_list.length;blxl++){
            num_list[blxl]=num_list[blxl]-csno*grids_count;
        }
        num_list.sort(function (a,b){return a>b ? 1 : -1;});
        return num_list;
    }
    
    function sub_img_today_rlater_hide(cslist,csw,csh,ctx){
        if (csw<csh){
            var cols=5;
            var rows=grids_count/cols;
        } else {
            var rows=5;
            var cols=grids_count/rows;        
        }
        for (let one_no of cslist){
            var blrow=Math.floor(one_no/cols);
            var blcol=one_no-blrow*cols;
            var blx=blcol*(csw/cols);            
            var bly=blrow*(csh/rows);
            
            ctx.fillStyle = scheme_global['memo'];
            ctx.beginPath();
            ctx.rect(blx,bly,csw/cols,csh/rows);
            ctx.closePath();
            ctx.fill();
        }
    }

    function sub_img_today_rlater_load(){
        if (csno>photo_source_global.length-1){return;}  

        var oimg=new Image();
        oimg.onload=function (){        
            var blw,blh,ctx,ocanvas;
            [blw,blh,ctx,ocanvas]=sub_img_today_rlater_canvas(this);
            
            var num_list=sub_img_today_rlater_array();
            if (num_list.length==0){
                var de_str=decodeURIComponent(this.src);
                var bname=encodeURIComponent(file_path_name_b(de_str)[1]);
                //ocanvas.setAttribute('ondblclick','window.open("'+specialstr_j(this.src)+'")'); //此行保留 - 保留注释
                ocanvas.setAttribute('ondblclick','window.open(klbase_sele_path_b()[1]+"/html/photos.htm?WIKI&s='+bname+'")');
                ocanvas.setAttribute('title',path_convert_b(de_str));
                if (csno<bltotal-1){
                    csno=csno+1;
                    sub_img_today_rlater_load();
                }
                return;
            }
            sub_img_today_rlater_hide(num_list,blw,blh,ctx);
            console.log('img_today_show_rlater() 费时：'+(performance.now() - t0) + ' milliseconds');
        }
        oimg.src=path_convert_b('{{wikiuploads}}')+photo_source_global[csno];    
    }
    //-----------------------
    var t0 = performance.now();
    
    var csno=0;
    var bltotal=3;
    var grids_count=40;
    var is_today,deleted_count;
    [is_today,deleted_count]=sub_img_today_rlater_date();
    if (!is_today){return;}
    
    sub_img_today_rlater_load();
}

function idb_write_rlater(db,adddata=true){
    function sub_idb_write_rlater_count1(cscount){
        document.getElementById('span_idb_status').innerHTML='IDB 清除前记录数：'+cscount;
    }

    function sub_idb_write_rlater_count2(cscount){
        document.getElementById('span_idb_status').innerHTML='IDB数据清除完毕，现有记录 '+cscount+' 条';
    }
    
    function sub_idb_write_rlater_onsuccess(otable){
        if (!adddata){return;}
        
        for (let item of readlater_data_global){
            otable.add({href:item[0],title: item[1]});
        }
        var ocount3=otable.count();
        ocount3.onsuccess = function(){
            console.log('添加后记录数：',ocount3.result);
            document.getElementById('span_idb_status').innerHTML='IDB数据写入完毕，现有记录 '+ocount3.result+' 条';
        }
    }
    //-----------------------
    return idb_write_b(db,'rlater_dbf',sub_idb_write_rlater_count1,sub_idb_write_rlater_count2,sub_idb_write_rlater_onsuccess);
}

function idb_read_rlater(db){
    function sub_idb_read_rlater_onsuccess(resolve, reject, event, other_var1,other_var2){
        var cursor = event.target.result;
        if (cursor){
            readlater_data_global.push([cursor.value.href,cursor.value.title]);
            cursor.continue();
        } else {
            is_from_IDB_global=true;
            document.getElementById('span_data_from').innerHTML='<span style="color:red;font-weight:bold;">IDB</span>';
            document.getElementById('span_idb_status').innerHTML='';
            init_data_rlater();
            resolve();
        }
    }
    //-----------------------
    readlater_data_global=[];
    return idb_read_b(db, 'rlater_dbf', sub_idb_read_rlater_onsuccess);
}

function idb_count_rlater(db){
    function sub_idb_count_rlater_onsuccess(cscount){
        console.log('idb_count_rlater sub_idb_count_rlater_onsuccess');
        document.getElementById('span_idb_status').innerHTML='IDB现有记录 '+cscount+' 条';
    }
    //-----------------------
    return idb_count_b(db, 'rlater_dbf', sub_idb_count_rlater_onsuccess);
    //调用 idb_count_rlater 函数的代码可以直接通过 .then() 或 .catch() 处理 idb_count_b 返回的 Promise 结果 - 保留注释
    
    //或者写成一下代码： - 保留注释
    //return new Promise((resolve, reject) => {
        //idb_count_b(db, 'rlater_dbf', sub_idb_count_rlater_onsuccess)
            //.then(count => {resolve(count);})
            //.catch(error => {reject(error);});
    //});
}

function idb_count_and_write_rlater(){
    async function sub_idb_count_and_write_rlater(){
        console.log('idb_count_and_write_rlater()');
        var blcount=await idb_rlater('count');
        if (blcount==0){
            await idb_rlater('write');
        }
    }
    //-----------------------    
    sub_idb_count_and_write_rlater();
}

function idb_rlater(cstype=''){
    async function sub_idb_rlater_switch(cstype, db, resolve, reject){
        var sub_operation;
        switch (cstype){
            case 'read':
                sub_operation=idb_read_rlater(db);
                break;
            case 'write':
                sub_operation=idb_write_rlater(db);
                break;
            case 'clear':
                sub_operation=idb_write_rlater(db,false);
                break;
            case 'count':
                sub_operation=idb_count_rlater(db);
                break;
            default:
                console.error('Invalid operation type:', cstype);
                idb_close_b(db);
                reject(new Error(`Unsupported operation: ${cstype}`));
                break;                
        }    

        try {
            var bljg=await sub_operation;
            resolve(bljg);
        } catch (error){
            reject(error);
        } finally {
            idb_close_b(db);
        }            
    }
    //-----------------------
    return idb_main_b(cstype, 'rlater', 'rlater_dbf', sub_idb_rlater_switch);
    //idb_rlater('count').then(value => {console.log('行数：',value);}); //此行保留 - 保留注释
}
