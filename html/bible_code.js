function recent_search_bible(csstr=''){
    recent_search_b('recent_search_bible',csstr,'search_bible','div_recent_search',['[借著鍊](:r)','b=传道书_3_1_8','带著','照著']);
}

function bookmarks_set_bible(){
    var omain=document.getElementById('select_chapter');
    var osub=document.getElementById('select_sub');
    if (omain.selectedIndex==-1 || omain.value=='' || osub.selectedIndex==-1){
        return;
    }
    if (confirm("是否更新 书签："+kjv[omain.value]+' -> '+(osub.selectedIndex+1)+"？")){
        localStorage.setItem('bible_bookmark',omain.value+' /// '+osub.value);
        alert('书签已更新');
    }
}

function bookmarks_get_bible(only_change_title=false){
    var bm=localStorage.getItem('bible_bookmark') || '';
    if (!bm.includes(' /// ')){
        return ['',''];
    }
    var blchapter;
    var blsub;
    [blchapter,blsub]=bm.split(' /// ');
    if (only_change_title){
        return [blchapter,blsub];
    }
    
    document.getElementById('select_chapter').value=blchapter;
    document.getElementById('select_chapter_cn').value=blchapter;
    minor_options_bible(blchapter);
    document.getElementById('select_sub').value=blsub;
    chapter_one_bible(blsub);
}

function new_words_bible(){
    get_new_words_arr_enbook(2,document.getElementById('divhtml').innerText,document.querySelectorAll('.txt_content'),0);
}

function menu_bible(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'bookmarks_get_bible();">读取书签</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'bookmarks_set_bible();">添加书签</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'reading_statistics_bible();">阅读进度</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'search_bible(\'FAV\');">FAV</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'fav_all_bible();">FAV_Reader</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'chapter_all_bible();">所有章节</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'new_words_bible();">显示生词</span>',
    ];

    if (is_local_b()){
        klmenu1.push(    '<a href="../../../../enwords_book.htm" onclick="javascript:'+str_t+'" target=_blank>生词统计链接</a>');
    }
    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'bible\');}">更新版本</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'help_bible();">Help</span>',
    ];
    klmenu2=root_font_size_menu_b(str_t).concat(klmenu2);
    
    var klmenu_idb=[
    '<span class="span_menu" onclick="javascript:'+str_t+'idb_bible(\'count\');">统计 IDB 记录数</span>',     
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否从 IDB 读取数据？\')){load_data_bible(true);}">从 IDB 读取数据</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否写入数据到 IDB？\')){idb_bible(\'write\');}">写入数据到 IDB</span>', 
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否清除 IDB 数据？\')){idb_bible(\'clear\');}">清除 IDB 数据</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'compare_data_bible();">比较 js 和 IDB 数据</span>',    
    ];
    
    var klmenu3=[
    '<span class="span_menu" onclick="javascript:'+str_t+'web_sites_href_list_bible(\'BibleGateway_CUVS\',\'BibleGateway(和合本)\');">BibleGateway(和合本)</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'web_sites_href_list_bible(\'BibleGateway_KJV\',\'BibleGateway(KJV)\');">BibleGateway(KJV)</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'web_sites_href_list_bible(\'o-bible.com_kjv\',\'o-bile(KJV)\');">o-bile(KJV)</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'web_sites_href_list_bible(\'o-bible.com\',\'o-bile(和合本)\');">o-bile(和合本)</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'web_sites_href_list_bible(\'shengjing_jidujiao_com\',\'基督教中文网\');">基督教中文网</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'web_sites_href_list_bible(\'biblestudytools.com\',\'Bible Study Tools(KJV)\');">Bible Study Tools(KJV)</span>',
    ];
    
    var color_menu=[];
    var list_t=['default'].concat(popular_colors_b());
    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl];
        color_menu.push('<span class="span_menu" onclick="javascript:'+'change_colors_b(\''+item+'\');" style="color:'+item.split(',')[0]+';background-color:'+item.split(',')[1]+';">'+(blxl+1)+'. '+item+'</span>');
    }

    if (ismobile_b()){
        var button_fontsize='1.8rem';
        var menu_fontsize='1.2rem';
    }
    else {
        var button_fontsize='1.5rem';
        var menu_fontsize='1rem';
    }
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✝','14rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(klmenu2,'⚙','14rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(klmenu_idb,'ℹ','14rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(klmenu3,'🌐','16rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(color_menu,'🎨','20rem',button_fontsize,menu_fontsize,'20rem'),'','0rem')+' ');
}

function compare_data_bible(){
    function sub_compare_data_bible_td(csno,js_str,idb_str,subchapter_name,line_no){
        var bookno=line_no_2_book_no(line_no);
        return '<td align=right>'+csno+'</td><td><span style="cursor:pointer;" onclick="javascript:chapter_relative_bible(event,'+bookno+');">【'+(bookno+1)+'】</span><span style="cursor:pointer;" onclick="javascript:book_bible(\''+subchapter_name.replace(new RegExp(/\s*(\d+)$/,'g'),'_$1')+'_'+js_str.split(' ')[0]+'\');">'+subchapter_name+'</span></td><td class="td_compare_bible">'+js_str+'</td><td class="td_compare_bible">'+idb_str+'</td>'; //\s* 和 (\s+)? 效果不一样 - 保留注释
    }
    
    function sub_compare_data_bible_result(diff_str_list,js_join,idb_join,character1,character2,len_old){
        diff_str_list=array_unique_b(diff_str_list);
        var str_t=array_2_li_b(diff_str_list);
        diff_str_list.sort();
        var list_join=diff_str_list.join('\n');

        var bljg='<div id="div_compare_bible">';
        bljg=bljg+'<p>将 '+character1+' 替换为 '+character2+' 之后，结果行数从 '+len_old+' 行变为 '+diff_str_list.length+' 行</p>';
        bljg=bljg+str_t;
        
        var equal_str='';
        var is_equal=false;
        [equal_str,is_equal]=sub_compare_data_bible_is_equal(js_join,idb_join,list_join);
        bljg=bljg+equal_str;
        bljg=bljg+'</div>';
        return [bljg,is_equal];
    }
    
    function sub_compare_data_bible_is_equal(js_join,idb_join,compared_str){
        if (compared_str==js_join){
            return ['<h4>与 js 一致</h4>',true];
        }
        else if (compared_str==idb_join){
            return ['<h4>与 idb 一致</h4>',true];
        }
        else {
            return ['<h4>与 js 和 idb 都不一致</h4>',false];
        }
    }
    //-
    async function sub_compare_data_bible_get_old_data(){
        await idb_bible('read',true);
        var len_min=Math.min(kjv.length,cnbible_global.length,enbible_old_global.length,cnbible_old_global.length);
        var diff_td_list=[];
        var diff_str_js_list=[];
        var diff_str_idb_list=[];
        var character_list=[];
        var js_list=[];
        var idb_list=[];
        var blno=1;
        var subchapter_no;
        var subchapter_name='';
        for (let blxl=0;blxl<len_min;blxl++){
            if (kjv[blxl].substring(0,4)=='=== ' && kjv[blxl].slice(-4,)==' ==='){
                subchapter_no=blxl;
            }
            if (kjv[blxl]!==enbible_old_global[blxl]){
                subchapter_name=kjv[subchapter_no].slice(4,-4);
                diff_td_list.push(sub_compare_data_bible_td(blno,kjv[blxl],enbible_old_global[blxl],subchapter_name,blxl));
                diff_str_js_list.push(kjv[blxl]);
                diff_str_idb_list.push(enbible_old_global[blxl]);
                
                js_list=kjv[blxl].split('');
                idb_list=enbible_old_global[blxl].split('');
                character_list=character_list.concat(array_difference_b(js_list,idb_list));
                character_list=character_list.concat(array_difference_b(idb_list,js_list));
                blno=blno+1;
            }
            if (cnbible_global[blxl]!==cnbible_old_global[blxl]){
                subchapter_name=cnbible_global[subchapter_no].slice(4,-4);
                diff_td_list.push(sub_compare_data_bible_td(blno,cnbible_global[blxl],cnbible_old_global[blxl],subchapter_name,blxl));  
                diff_str_js_list.push(cnbible_global[blxl]);
                diff_str_idb_list.push(cnbible_old_global[blxl]);
                                
                js_list=cnbible_global[blxl].split('');
                idb_list=cnbible_old_global[blxl].split('');
                character_list=character_list.concat(array_difference_b(js_list,idb_list));
                character_list=character_list.concat(array_difference_b(idb_list,js_list));
                blno=blno+1;
            }
            if (blno>=400){break;}
        }
        
        character_list=array_unique_b(character_list);
        var bljg='<table id="table_compare_bible" class="table_common" cellspacing=0><tr><th>No.</th><th>Book</th><th>js</th><th>idb</th></tr>\n'+array_2_li_b(diff_td_list,'tr',false,'','','')+'</table>';
        bljg=bljg+array_2_li_b(character_list);
        //---
        var diff_str_list1=diff_str_js_list.concat(diff_str_idb_list);
        var diff_str_list2=diff_str_js_list.concat(diff_str_idb_list);
        if (character_list.length==2){
            var len_old=diff_str_list1.length;
            try{
                for (let blxl=0;blxl<len_old;blxl++){
                    diff_str_list1[blxl]=diff_str_list1[blxl].replace(new RegExp(character_list[0],'g'),character_list[1]);
                    diff_str_list2[blxl]=diff_str_list2[blxl].replace(new RegExp(character_list[1],'g'),character_list[0]);
                }
            }
            catch (error){
                console.log(error.message);
            }

            diff_str_js_list.sort();
            var js_join=diff_str_js_list.join('\n');
            diff_str_idb_list.sort();
            var idb_join=diff_str_idb_list.join('\n');

            var blstr='';
            var is_equal=false;
            [blstr,is_equal]=sub_compare_data_bible_result(diff_str_list1,js_join,idb_join,character_list[0],character_list[1],len_old);
            if (is_equal){
                bljg=bljg+blstr;
            }
            else {
                bljg=bljg+sub_compare_data_bible_result(diff_str_list2,js_join,idb_join,character_list[1],character_list[0],len_old)[0];
            }
        }
        //---
        document.getElementById('divhtml').innerHTML='<div style="margin:0.5rem;" >'+bljg+'</div>';
        var is_ok;
        var otds=document.querySelectorAll('table#table_compare_bible td.td_compare_bible,div#div_compare_bible p,div#div_compare_bible li');
        for (let one_td of otds){
            for (let one_character of character_list){
                is_ok=highlight_obj_b(one_td,one_character,'<span style="background-color:'+scheme_global['pink']+';">'+one_character+'</span>');
                if (is_ok===-1){break;}
                else if (is_ok===false){
                    one_td.insertAdjacentHTML('beforeend','💡<span style="background-color:'+scheme_global['pink']+';">'+one_character+'</span>');
                }
            }
        }

        enbible_old_global=[];
        cnbible_old_global=[];
    }
    //-----------------------------------
    sub_compare_data_bible_get_old_data();
}

function args_bible(){
    var dosomething=false;
    var is_alone=false;
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //优先设置 - 保留注释
        for (let item of cskeys){
            var bltmpstr=item.trim();
            if (bltmpstr.substring(0,2)=='u='){
                var str_t=bltmpstr.substring(2,);
                switch (str_t){
                    case "kjv":
                        use_kjv_cn_global=[true,false];
                        break;
                    case 'cn':
                        use_kjv_cn_global=[false,true];
                        break;
                }
            }
            else if (bltmpstr=='alone'){
                is_alone=true;
            }
        }
        
        //二次处理 - 保留注释
        for (let item of cskeys){
            var bltmpstr=item.trim();
            if (bltmpstr.substring(0,2)=='s='){
                bltmpstr=bltmpstr.substring(2,);
                if (bltmpstr=='' || bltmpstr=='(:r)'){
                    //do nothing - 保留注释
                }
                else {
                    document.getElementById('input_bible_search').value=bltmpstr;
                    search_bible();
                    dosomething=true;
                    break;
                }
            }
            else if (bltmpstr.substring(0,2)=='b='){
                book_bible(bltmpstr.substring(2,),is_alone);
                dosomething=true;
                break;
            }
        }
    }
    return dosomething;
}

function init_bible(){
    chapter_list_bible();
    main_options_bible();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2.3rem':'1.6rem'));
    var dosomething=args_bible();

    checkbox_bible();
    refresh_use_bible();
    if (dosomething==false){
        rand_chapter_list_bible();
        bookmarks_get_bible();
    }
}

function reading_statistics_bible(cssub=-1,do_alert=true){
    if (cssub==-1){
        cssub=parseInt(document.getElementById('select_sub').value);
    }
    if (isNaN(cssub) || cssub<0){
        return '';
    }
    var list_t=[];
    for (let blxl=0;blxl<kjv.length;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
            list_t.push(blxl);
        }
    }
    var blno=list_t.indexOf(cssub);
    var remained_days=days_remained_of_year_b();
    var remained_chapters=list_t.length-blno;
    var chapters_per_day=remained_chapters/remained_days;
    
    var bljg='今年剩余天数 '+remained_days+ ' 天。\n全书共有 '+list_t.length+' 章，'+kjv.length+' 行。\n';
    bljg=bljg+'当前章'+kjv[cssub].replace('=== ','【').replace(' ===','')+'・'+cnbible_global[cssub].replace('=== ','').replace(' ===','】');
    bljg=bljg+' 为第 '+(blno+1)+' 章('+((blno+1)*100/list_t.length).toFixed(1)+'%)。\n当前为第 '+(cssub+1)+' 行('+((cssub+1)*100/kjv.length).toFixed(2)+'%)。\n完成阅读需要 '+chapters_per_day.toFixed(1) +' 章/天；';
    bljg=bljg+'完成阅读需要 '+((kjv.length-cssub)/remained_days).toFixed(2) +' 行/天。';
    
    var chapters_per_day_ceil=Math.ceil(chapters_per_day);
    for (let blxl=chapters_per_day_ceil;blxl<=4;blxl++){
        if (blxl!==chapters_per_day){
            var days_ceil=remained_chapters/blxl;
            bljg=bljg+'\n按每日 '+blxl+' 章阅读，需要 '+days_ceil.toFixed(1)+' 天读完，即 '+next_day_b('',days_ceil)+'。';
        }
    }
    if (do_alert){
        alert(bljg);
    }
    return bljg;
}

function chapter_relative_bible(event,csno){
    var bljg=[];
    for (let blxl=0;blxl<chapter_global.length;blxl++){
        if (blxl<csno-3 || blxl>csno+3){continue;}
        var item=chapter_global[blxl];
        var blstr='<p>';
        blstr=blstr+(blxl+1)+'. ';
        if (use_kjv_cn_global[0]){
            blstr=blstr+item[1]+' ';
        }
        if (use_kjv_cn_global[1]){
            blstr=blstr+item[2];
        }
        bljg.push(blstr.trim()+'</p>');
    }
    popup_event_div_b(event,'div_popup_bible',bljg.join('\n'),'top_right');
    //alert(bljg);
}

function search_one_row_bible(blxl,h2,h3,chapter_no_current,blstyle,ismobile){
    var blno;
    var enstr;
    var cnstr;
    [blno,enstr,cnstr]=number_bible(blxl,blstyle);
    var bljg='<tr><td style="font-size:'+(ismobile_b()?'1.15':'0.85')+'rem;">';
    if (use_kjv_cn_global[0]){
        bljg=bljg+'<p><big>'+enstr+'</big></p>';
    }
    if (use_kjv_cn_global[1]){
        bljg=bljg+'<p><big>'+cnstr+'</big></p>';
    }
    bljg=bljg+'<p>&nbsp;</p><p>';
    bljg=bljg+'—— <span style="cursor:pointer;" onclick="javascript:chapter_relative_bible(event,'+chapter_no_current+');">【'+(chapter_no_current+1)+'】</span>';
    bljg=bljg+'<span class="span_box" onclick="javascript:book_bible(\''+kjv[h2].substring(3,kjv[h2].length-3)+'_'+kjv[h3].substring(4,kjv[h3].length-4).split(' ').slice(-1)[0]+'_'+kjv[blxl].split(' ')[0]+'\');">';
    if (use_kjv_cn_global[0] && use_kjv_cn_global[1]){
        bljg=bljg+kjv[h2].substring(3,kjv[h2].length-3)+' '+cnbible_global[h3].substring(4,cnbible_global[h3].length-4);
    }
    else if (use_kjv_cn_global[0]){
        bljg=bljg+kjv[h3].substring(4,kjv[h3].length-4);
    }
    else if (use_kjv_cn_global[1]){
        bljg=bljg+cnbible_global[h3].substring(4,cnbible_global[h3].length-4);
    }  
    bljg=bljg+'</span>';
    bljg=bljg+'</p></td></tr>';
    return bljg;
}

function fav_location_bible(cspages){
    var blno=parseInt((prompt('输入页号',cspages) || '').trim());
    if (isNaN(blno)){return;}
    blno=Math.min(cspages,Math.max(1,blno));
    search_bible('FAV',0,blno);
}

function search_bible(cskey='',csstartno=0,favpage_no=1,csmax=500){
    var t0=performance.now();   
    if (cskey==''){
        cskey=document.getElementById('input_bible_search').value.trim();
    }
    if (cskey.substring(0,2).toLowerCase()=='b='){
        book_bible(cskey.substring(2,));
        return;
    }
    document.getElementById('input_bible_search').value=cskey;
    var h2=-1;
    var h3=-1;
    var isreg=false;
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    recent_search_bible(cskey+(isreg?'(:r)':''));
    csstartno=Math.max(0,parseInt(csstartno));
    //var csmax=10;
    var fav_list=local_storage_get_b('fav_lines_bible',-1,true);
    var fav_len=fav_list.length;
    var fav_start=0;
    var fav_pages='';
    if (cskey=='FAV' && csmax>=0){
        fav_start=(favpage_no-1)*csmax;
        fav_list=fav_list.slice(fav_start,fav_start+csmax);
        
        var pages_count=Math.ceil(fav_len/csmax);
        if (pages_count>1){
            for (let blxl=1;blxl<=pages_count;blxl++){
                fav_pages=fav_pages+page_one_b(pages_count,favpage_no,blxl,'onclick="javascript:search_bible(\'FAV\',0,'+blxl+');"'+(blxl==favpage_no?' style="color:red;"':''),0,0);
            }
            fav_pages=page_remove_dot_b(fav_pages);
            fav_pages=fav_pages+page_prev_next_b(pages_count,favpage_no,'onclick="javascript:search_bible(\'FAV\',0,'+(favpage_no-1)+');"','onclick="javascript:search_bible(\'FAV\',0,'+(favpage_no+1)+');"','onclick="javascript:fav_location_bible('+pages_count+');"');
        }
    }
    
    fav_list=new Set(fav_list); //加快搜索速度 - 保留注释
    
    var bljg='<table class="table_zebra" border=0 cellspacing=5 cellpadding=10 width=100%>';
    var blcount=0;
    var blfound;
    var blstyle;
    var ismobile=ismobile_b();
    var continue_search_no=0;
    
    var cskey_list=cskey.split(' ');
    var exclude_fav=(cskey_list.includes('-FAV'));
    var include_fav=(cskey_list.includes('+FAV'));
    cskey='';
    for (let item of cskey_list){
        if (item=='+FAV' || item=='-FAV'){
            continue;
        }
        cskey=cskey+item+' ';
    }
    cskey=cskey.trim();
    //FAV dog 无意义 - 保留注释
    
    var chapter_no_t=[];
    for (let item of chapter_global){
        chapter_no_t.push(item[0]);
    }
    var chapter_no_current=-1;
    
    current_search_no_global=new Set();
    for (let blxl=csstartno;blxl<kjv.length;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,3)=='== ' && item.slice(-3,)==' =='){
            h2=blxl;
            chapter_no_current=chapter_no_t.indexOf(h2);
            h3=-1;
            continue;
        }
        if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
            h3=blxl;
            continue;
        }
        blstyle='';
        if (fav_list.has(blxl.toString())){
            if (exclude_fav){
                continue;
            }
            blstyle=' style="background-color:'+scheme_global['pink']+';"';
        }
        else {
            if (include_fav){
                continue;
            }
        }
        if (cskey=='FAV'){
            blfound=fav_list.has(blxl.toString());
        }
        else {
            blfound=str_reg_search_b([item,cnbible_global[blxl]],cskey,isreg);
            if (blfound==-1){
                break;
            }
        }
        if (blfound && h2>-1 && h3>-1){
            current_search_no_global.add(blxl);
            bljg=bljg+search_one_row_bible(blxl,h2,h3,chapter_no_current,blstyle,ismobile);
            blcount=blcount+1;
            if (csmax>=0 && blcount>=csmax){
                continue_search_no=blxl+1;
                break;
            }
        }
    }
    bljg=bljg+'</table>';
    bljg=bljg+(fav_pages==''?'':'<p style="line-height:1.8rem;margin-left:0.5rem;">'+fav_pages+'</p>');

    bljg=bljg+'<p style="line-height:1.8rem;margin-left:0.5rem;">';
    bljg=bljg+'('+blcount+') ';
    
    if (cskey!=='FAV' && continue_search_no>0 && continue_search_no<kjv.length){
        bljg=bljg+'<span class="oblong_box" onclick="javascript:search_bible(\'\','+continue_search_no+');">继续搜索('+continue_search_no+')</span> ';
    }
    if (csmax>=0 && blcount==csmax){
        bljg=bljg+'<span class="oblong_box" onclick="javascript:search_bible(\''+specialstr_j(cskey+(isreg?'(:r)':''))+'\',0,1,-1);">完全搜索</span> ';    
        bljg=bljg+'<span class="oblong_box" onclick="javascript:search_bible(\''+specialstr_j(cskey+(isreg?'(:r)':''))+'\',0,1,-1);break_line_bible();">完全搜索+断句</span> ';
    }
    bljg=bljg+'<span class="oblong_box" onclick="javascript:break_line_bible();">断句</span> ';    
    bljg=bljg+'<span class="oblong_box" onclick="javascript:search_statistics_bible();">Statistics</span> ';    
    
    if (cskey=='FAV'){
        bljg=bljg+'<span class="oblong_box" onclick="javascript:fav_export_import_form_bible();">FAV Import/Export</span> ';
    }
    bljg=bljg+'</p>';
    bljg=bljg+'<div id="div_search_statistics" style="margin:0.5rem;"></div>';
    
    document.getElementById('divhtml').innerHTML=bljg;
    document.getElementById('select_chapter').value='-1';
    document.getElementById('select_chapter_cn').value='-1';
    document.getElementById('select_sub').innerHTML='';
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#divhtml span.oblong_box'));
    console.log('search_bible 费时：'+(performance.now() - t0) + " milliseconds");
}

function break_line_bible(){
    var blkey=document.getElementById('input_bible_search').value.trim();
    var isreg=false;
    if (blkey.slice(-4,)=='(:r)'){
        isreg=true;
        blkey=blkey.substring(0,blkey.length-4);
    }    
    if (blkey=='' || current_search_no_global.length==0){return;}
    if (isreg){
        try{
            ''.match(blkey);
            ''.replace(new RegExp('('+blkey+')','g'),'\n$1');
        }
        catch (error){
            alert(error.message);
            return;
        }
    }
    
    var result_t=[];
    if (isreg){
        for (let blno of current_search_no_global){
            if (kjv[blno].match(blkey)!==null){
                result_t.push(kjv[blno].replace(new RegExp('('+blkey+')','g'),'\n$1'));
            }
            if (cnbible_global[blno].match(blkey)!==null){
                result_t.push(cnbible_global[blno].replace(new RegExp('('+blkey+')','g'),'\n$1'));
            }
        }
    }
    else {
        for (let blno of current_search_no_global){
            if (kjv[blno].includes(blkey)){
                result_t.push(kjv[blno].replace(new RegExp('('+blkey+')','g'),'\n$1'));
            }
            if (cnbible_global[blno].includes(blkey)){
                result_t.push(cnbible_global[blno].replace(new RegExp('('+blkey+')','g'),'\n$1'));
            }
        }
    }
    
    if (result_t.length==0){return;}
    result_t=result_t.join('\n').split('\n');
    
    var bljg=[];
    if (isreg){
        for (let item of result_t){
            if (item.match(blkey)!==null){
                bljg.push(item);
            }
        }
    }
    else {
        for (let item of result_t){
            if (item.includes(blkey)){
                bljg.push(item);
            }        
        }
    }
    
    bljg.sort(function (a,b){return zh_sort_b(a,b);});
    var blbuttons='<p><span class="aclick" onclick="javascript:document.getElementById(\'div_search_statistics\').innerHTML=\'\';">Close</span></p>';
    var odiv=document.getElementById('div_search_statistics');
    odiv.innerHTML=array_2_li_b(bljg,'li','ol')+blbuttons;
    odiv.scrollIntoView();
}

function search_statistics_bible(cscolumn=-1,hidezero=false){
    //var fav_list=local_storage_get_b('fav_lines_bible',-1,true);
    var blchapter={};
    for (let blxl=0;blxl<chapter_global.length;blxl++){
        var one_chapter_name=chapter_global[blxl][1];
        blchapter[one_chapter_name]=[blxl,0];
    }
    
    for (let item of current_search_no_global){
        var blvalue=parseInt(item);
        if (blvalue<0){continue;}
        var blfound=false;
        for (let blxl=0;blxl<chapter_global.length;blxl++){
            var one_chapter_number=chapter_global[blxl][0];
            if (blvalue<one_chapter_number && blxl>0){
                var prev_chapter_name=chapter_global[blxl-1][1];
                blchapter[prev_chapter_name][1]=blchapter[prev_chapter_name][1]+1;
                blfound=true;
                break;
            }
        }
        if (blfound===false){
            var prev_chapter_name=chapter_global[chapter_global.length-1][1];
            blchapter[prev_chapter_name][1]=blchapter[prev_chapter_name][1]+1;            
        }
    }
    
    var result_t=[];
    for (let key in blchapter){
        //console.log(key,blchapter[key]); - 保留注释
        var blno=blchapter[key][0];
        var blcount=blchapter[key][1];
        if (hidezero && blcount==0){continue;}
        result_t.push([blno+1,chapter_global[blno][1],chapter_global[blno][2],blcount]);
    }
    
    if (cscolumn==2){
        result_t.sort(function (a,b){return zh_sort_b(a,b,fav_desc_sort_global,2);});
    }
    else {
        if (fav_desc_sort_global){
            result_t.sort(function (a,b){return a[cscolumn]>b[cscolumn];});
        }
        else {
            result_t.sort(function (a,b){return a[cscolumn]<b[cscolumn];});
        }    
    }

    fav_desc_sort_global=!fav_desc_sort_global;
    
    var bljg='<table class="table_zebra"><tr>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="javascript:search_statistics_bible(0,'+hidezero+');">No.</th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="javascript:search_statistics_bible(1,'+hidezero+');">EN</th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="javascript:search_statistics_bible(2,'+hidezero+');">CN</th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="javascript:search_statistics_bible(3,'+hidezero+');">Lines</th></tr>';
    for (let item of result_t){
        bljg=bljg+'<tr><td align=right>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td align=right>'+item[3]+'</td></tr>';
    }
    bljg=bljg+'</table>';
    bljg=bljg+'<p><span class="aclick" onclick="javascript:fav_desc_sort_global=!fav_desc_sort_global;search_statistics_bible('+cscolumn+','+!hidezero+');">'+(hidezero?'Show':'Hide')+' Zero</span></p>';
    document.getElementById('div_search_statistics').innerHTML=bljg;   
}

function fav_update_bible(){
    if (confirm("是否更新收藏？")){
        var list_t=array_unique_b(document.getElementById('textarea_fav_bible').value.trim().split('\n'));
        list_t=fav_sort_bible(list_t);
        localStorage.setItem('fav_lines_bible',list_t.join('\n'));
        alert('收藏已更新');
    }
}

function fav_sort_bible(csarray){
    var result_t=[];
    for (let item of csarray){
        item=item.replace(new RegExp('#','g'),'').trim();
        var blvalue=parseInt(item);
        if (isNaN(blvalue)){continue;}
        result_t.push(blvalue);
    }
    result_t.sort(function (a,b){return a-b;}); //不能使用 a<b，或默认的 sort(); - 保留注释
    return result_t;
}

function fav_all_bible(){
    var t0=performance.now();   
    var result_t=[];
    for (let blxl=0;blxl<chapter_global.length;blxl++){
        var startline=chapter_global[blxl][0];
        if (blxl+1<chapter_global.length){
            var endline=chapter_global[blxl+1][0]-1;
        }
        else {
            var endline=kjv.length-1;
        }
        result_t=result_t.concat(fav_one_book_bible(startline,endline));
    }
    console.log('fav_all_bible 费时：'+(performance.now() - t0) + " milliseconds");
    
    var aname=[];
    for (let blxl=0;blxl<result_t.length;blxl++){
        var trclass='';
        var item=result_t[blxl];
        result_t[blxl][2]='';
        if (item[0].substring(0,3)=='== ' && item[0].slice(-3,)==' =='){
            var blh2_en=result_t[blxl][0].slice(3,-3);
            var blh2_cn=result_t[blxl][1].slice(3,-3);
            result_t[blxl][0]='<h2>'+blh2_en+'</h2>';
            result_t[blxl][1]='<h2>'+blh2_cn+'</h2>';
            result_t[blxl][2]='tr_'+blh2_en;
            trclass=' class="tr_head"';
            aname.push('<option value="#tr_'+blh2_en+'">'+blh2_en+' '+blh2_cn+'</option>');
        }        
        else if (item[0].substring(0,4)=='=== ' && item[0].slice(-4,)==' ==='){
            result_t[blxl][0]='<h3>'+result_t[blxl][0].slice(4,-4)+'</h3>';
            result_t[blxl][1]='<h3>'+result_t[blxl][1].slice(4,-4)+'</h3>';
            trclass=' class="tr_head"';
        }
        else if (item[0]=='' && item[1]==''){
            result_t[blxl][0]='...';
            result_t[blxl][1]='...';
        }

        result_t[blxl]='<tr'+trclass+(result_t[blxl][2]==''?'':' id="'+result_t[blxl][2]+'"')+'><td class="td_fav_en" valign=top width=50%>'+item[0]+'</td><td class="td_fav_cn" valign=top width=50%>'+item[1]+'</td></tr>';
    }
    var bljg='<select style="max-width:20rem;" onchange="javascript:location.href=this.value;">'+aname.join(' ')+'</select>';
    bljg=bljg+'<input type="checkbox" id="radio_type_en" onclick="javascript:fav_en_cn_bible();" checked><label for="radio_type_en">en</label> <input type="checkbox" id="radio_type_cn" onclick="javascript:fav_en_cn_bible();" checked><label for="radio_type_cn">cn</label>';
    bljg=bljg+'<table id="table_fav" border=0 cellspacing=5 cellpadding=10 width=100%>'+result_t.join('\n')+'</table>';
    document.getElementById('divhtml').innerHTML=bljg;
}

function fav_en_cn_bible(){
    var use_en=document.getElementById('radio_type_en').checked?'':'none';
    var use_cn=document.getElementById('radio_type_cn').checked?'':'none';
    var otds=document.querySelectorAll('td.td_fav_en');
    for (let item of otds){
        item.style.display=use_en;
    }
    var otds=document.querySelectorAll('td.td_fav_cn');
    for (let item of otds){
        item.style.display=use_cn;
    }    
}

function fav_one_book_bible(startline,endline){
    var fav_list=local_storage_get_b('fav_lines_bible',-1,true);    
    var result_t=[];
    var isdot=false;
    for (let blxl=startline;blxl<=endline;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,2)=='==' || fav_list.includes(blxl.toString())){
            result_t.push([item,cnbible_global[blxl]]);
            isdot=false;
        }        
        else {
            if (isdot===false){
                result_t.push(['','']);
                isdot=true;
            }
        }
    }
    for (let blxl=0;blxl+2<result_t.length;blxl++){
        if (result_t[blxl][0].substring(0,4)=='=== ' && result_t[blxl+1][0]=='' && result_t[blxl+1][1]=='' && result_t[blxl+2][0].substring(0,2)=='=='){
            result_t[blxl]=['',''];
            result_t[blxl+1]=['',''];
        }
    }
    var bljg=[];
    var isempty=false;
    for (let item of result_t){
        if (item[0]=='' && item[1]==''){
            if (isempty){continue;}
            isempty=true;
        }
        else {
            isempty=false;
        }
        bljg.push(item);
    }
    if (bljg.length>=2){
        var temp_t=bljg.slice(-2,);
        if (temp_t[0][0].substring(0,2)=='==' && temp_t[1][0]=='' && temp_t[1][1]==''){
            bljg=bljg.slice(0,-2);
        }
    }
    return bljg;
}

function fav_export_import_form_bible(){
    var fav_list=local_storage_get_b('fav_lines_bible',-1,true);
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type=bible_fav" name="form_fav_bible" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_fav_bible" id="textarea_fav_bible" style="height:20rem;">#'+fav_list.join('#\n#')+'#</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\'div_search_statistics\').innerHTML=\'\';">Close</span> ';        
    bljg=bljg+'<span class="aclick" onclick="javascript:fav_update_bible();">更新</span> ';    
    bljg=bljg+'<span class="aclick" onclick="javascript:local_storage_view_form_b(\'\',\'div_search_statistics\');">查看 localStorage</span> ';

    bljg=bljg+textarea_buttons_b('textarea_fav_bible','清空,复制,发送到临时记事本');
    bljg=bljg+'<div id="div_word_temp" style="display:inline;">';
    bljg=bljg+textarea_buttons_b('textarea_fav_bible','发送地址','bible_fav')+' 行数：'+fav_list.length+'</div>';
    bljg=bljg+'</p>';
    bljg=bljg+'</form>';
    document.getElementById('div_search_statistics').innerHTML=bljg;
}

function cn_a_bible(csstr){
    if (csstr.trim().slice(-2,)==' a' && csstr.trim().split(' ').length==2){
        return csstr.trim().split(' ')[0];
    }
    else {
        return csstr;
    }
}

function help_bible(){
    var bljg='<li><a href="?s=神" target=_blank>bible.htm?s=神</a></li>';
    bljg=bljg+'<li><a href="?s=+Joseph +Noah" target=_blank>bible.htm?s=+Joseph +Noah</a></li>';
    bljg=bljg+'<li><a href="?s=-Joseph +Noah" target=_blank>bible.htm?s=-Joseph +Noah</a></li>';
    bljg=bljg+'<li><a href="?s=Joseph Noah" target=_blank>bible.htm?s=Joseph Noah</a></li>';
    bljg=bljg+'<li><a href="?s=Joseph|Noah(:r)" target=_blank>bible.htm?s=Joseph|Noah(:r)</a></li>';
    bljg=bljg+'<li><a href="?s=耶稣&u=cn" target=_blank>bible.htm?s=耶稣&u=cn</a></li>';
    bljg=bljg+'<li><a href="?s=Jehovah&u=kjv" target=_blank>bible.htm?s=Jehovah&u=kjv</a></li>';
    bljg=bljg+'<li><a href="?b=启示录_2_5_9" target=_blank>bible.htm?b=启示录_2_5_9</a></li>';
    bljg=bljg+'<li><a href="?b=启_2_5_9" target=_blank>bible.htm?b=启_2_5_9</a></li>';
    bljg=bljg+'<li><a href="?b=rev3:4" target=_blank>bible.htm?b=rev3:4</a></li>';
    bljg=bljg+'<li><a href="?b=启2:4" target=_blank>bible.htm?b=启2:4</a></li>';
    bljg=bljg+'<li><a href="?b=启2:4" target=_blank>bible.htm?b=启2:4&alone</a></li>';
    
    bljg='<ul style="margin-left:2rem;">'+bljg+'</ul>';
    bljg=bljg+'<p style="margin-left:2rem;">ver: 0.1.2- 20210607</p>'
    //history:
    //0.1.2- 20210607 增加 js 和 idb 对比功能
    //0.1.1- 20200619 FAV分页 继续搜索
    //0.1.0 -20200613 增加收藏功能
    //0.0.9-20200413 增加 PWA Cache 清除
    //0.0.8-20200402 支持 PWA
    //0.0.7-20200206
    //0.0.6-20200201
    //0.0.5-20200115
    //0.0.4-20190926
    //0.0.3-20190831
    //0.0.2-20190822
    //0.0.1-20190821    
    document.getElementById('divhtml').innerHTML=bljg;
}

function book_bible(csstr,isalone=false){
    //高亮边框指定的段落 - 保留注释
    //csstr: bookname_chapter_sentence_start-number_end-number 启_2_5_9 或 rev3:4 或 启2:4 - 保留注释
    //csstr=csstr.replace(new RegExp(/[:：\.\-]/,'g'),'_').trim();
    csstr=csstr.replace(new RegExp(/(\d{1,})[：:](\d{1,})/,'g'),'_$1_$2').trim();
    var rightstr=(csstr.match(/(\d+_)*(\d+)?$/g) || [''])[0].trim();    //rev3 或 rev3_4，返回 3 或 3_4 - 保留注释
    if (rightstr!==''){
        csstr=csstr.replace(new RegExp(/(\d+_)*(\d+)?$/,'g'),'').trim()+'_'+rightstr;
    }
    while (csstr.includes('__')){
        csstr=csstr.replace(new RegExp('__','g'),'_');
    }    
    var book_no_list=csstr.split('_');
    var book_no=abbr_bible(book_no_list[0]);
    if (book_no>=0){
        document.getElementById('select_chapter').value=chapter_global[book_no][0];
        document.getElementById('select_chapter_cn').value=chapter_global[book_no][0];
        minor_options_bible(chapter_global[book_no][0],false);
        if (book_no_list.length>1){
            var osub_options=document.querySelectorAll('#select_sub option');
            var found_sub=false;
            for (let item of osub_options){
                if (item.innerText==book_no_list[1]){
                    item.selected=true;
                    chapter_one_bible(item.value);
                    found_sub=true;
                    break;
                }
            }
        }
        if (found_sub){
            var start_td=parseInt(book_no_list[2]);
            if (book_no_list.length>2 && start_td>1){
                //定位到上一条 - 保留注释
                document.location.href ='#kjv_'+(start_td-1);
            }
            var end_td=start_td;
            if (book_no_list.length>3){
                end_td=parseInt(book_no_list[3]);
            }
            if (isalone===false){                
                for (let blxl=start_td;blxl<=end_td;blxl++){
                    var okjv=document.getElementById('td_kjv_'+blxl);
                    var ocn=document.getElementById('td_cn_'+blxl);
                    if (okjv){
                        okjv.style.backgroundColor=scheme_global["pink"];
                    }
                    if (ocn){
                        ocn.style.backgroundColor=scheme_global["skyblue"];            
                    }
                }
            }
            else {
                var otd_kjvs=document.querySelectorAll('div#divhtml table.table_zebra td.td_kjv, div#divhtml table.table_zebra td.td_cn');
                for (let one_td of otd_kjvs){
                    var tdid=one_td.getAttribute('id');
                    if (!tdid){continue;}
                    var blxl=parseInt(tdid.split('_').slice(-1)[0].trim());
                    if (isNaN(blxl) || blxl>=start_td && blxl<=end_td){continue;}
                    one_td.parentNode.outerHTML='';
                }
                var id_list=['h2_title','div_buttons','div_status','div_top_bottom'];
                for (let item of id_list){
                    var oobj=document.getElementById(item);
                    if (oobj){
                        oobj.parentNode.removeChild(oobj);
                    }
                }
                var ospans=document.getElementsByClassName('span_number_bible');
                for (let item of ospans){
                    item.style.borderWidth=0;
                }
                var otable=document.querySelector('table.table_zebra');
                if (otable){
                    otable.classList.remove('table_zebra');
                }
            }
        }
    }
}

function abbr_bible(csstr){
    csstr=csstr.trim();
    var bible_abbr=[ //不可排序 - 保留注释
    ["The First Book of Moses: Called Genesis", "Genesis", "Gen", "Ge", "Gn", "创世记", "创"],
    ["The Second Book of Moses: Called Exodus", "Exodus", "Ex", "Exo", "Exod", "出埃及记", "出"],
    ["The Third Book of Moses: Called Leviticus", "Leviticus", "Lev", "Le", "Lv", "利未记", "利"],
    ["The Fourth Book of Moses: Called Numbers", "Numbers", "Num", "Nu", "民数记", "民"],
    ["The Fifth Book of Moses: Called Deuteronomy", "Deuteronomy", "Deu", "Dt", "申命记", "申"],
    ["The Book of Joshua", "Joshua", "Jos", "Josh", "约书亚记", "书"],
    ["The Book of Judges", "Judges", "Jdg", "Jug", "Judg", "士师记", "士"],
    ["The Book of Ruth", "Ruth", "Ru", "Rut", "Rth", "路得记", "得"],
    ["The First Book of Samuel", "1st Samuel", "1Sa", "1Sam", "撒母耳记上", "撒上"],
    ["The Second Book of Samuel", "2nd Samuel", "2Sa", "2Sam", "撒母耳记下", "撒下"],
    ["The First Book of the Kings", "1st Kings", "1Ki", "列王纪上", "王上"],
    ["The Second Book of the Kings", "2nd Kings", "2Ki", "列王纪下", "王下"],
    ["The First Book of the Chronicles", "1st Chronicles", "1Ch", "1Chr", "历代志上", "代上"],
    ["The Second Book of the Chronicles", "2nd Chronicles", "2Ch", "2Chr", "历代志下", "代下"],
    ["Ezra", "Ezr", "以斯拉记", "拉"],
    ["The Book of Nehemiah", "Nehemiah", "Neh", "Ne", "尼希米记", "尼"],
    ["The Book of Esther", "Esther", "Est", "以斯帖记", "斯"],
    ["The Book of Job", "Job", "约伯记", "伯"],
    ["The Book of Psalms", "Psalms", "Ps", "Psa", "Psm", "诗篇", "诗"],
    ["The Proverbs", "Proverbs", "Prov", "Pr", "Pro", "箴言", "箴"],
    ["Ecclesiastes", "Ecc", "传道书", "传"],
    ["The Song of Solomon", "Song of Solomon", "Song", "Son", "SS", "雅歌", "歌"],
    ["The Book of the Prophet Isaiah", "Isaiah", "Is", "Isa", "以赛亚书", "赛"],
    ["The Book of the Prophet Jeremiah", "Jeremiah", "Jer", "耶利米书", "耶"],
    ["The Lamentations of Jeremiah", "Lamentations", "Lam", "耶利米哀歌", "哀"],
    ["The Book of the Prophet Ezekiel", "Ezekiel", "Eze", "Ezek", "以西结书", "结"],
    ["The Book of Daniel", "Daniel", "Dan", "但以理书", "但"],
    ["Hosea", "Hos", "何西阿书", "何"],
    ["Joel", "Joe", "约珥书", "珥"],
    ["Amos", "Amo", "Am", "阿摩司书", "摩"],
    ["Obadiah", "Oba", "Ob", "俄巴底亚书", "俄"],
    ["Jonah", "Jon", "Jnh", "约拿书", "拿"],
    ["Micah", "Mic", "弥迦书", "弥"],
    ["Nahum", "Nah", "Na", "那鸿书", "鸿"],
    ["Habakkuk", "Hab", "哈巴谷书", "哈"],
    ["Zephaniah", "Zep", "Zeph", "西番雅书", "番"],
    ["Haggai", "Hag", "哈该书", "该"],
    ["Zechariah", "Zec", "Zech", "撒迦利亚书", "亚"],
    ["Malachi", "Mal", "玛拉基书", "玛"],
    ["The Gospel According to Saint Matthew", "Matthew", "Matt", "Mat", "Mt", "马太福音", "太"],
    ["The Gospel According to Saint Mark", "Mark", "Mk", "Mak", "Mrk", "马可福音", "可"],
    ["The Gospel According to Saint Luke", "Luke", "Lk", "Lu", "Luk", "路加福音", "路"],
    ["The Gospel According to Saint John", "John", "Jhn", "Jn", "约翰福音", "约"],
    ["The Acts of the Apostles", "Acts", "Act", "Ac", "使徒行传", "徒"],
    ["The Epistle of Paul the Apostle to the Romans", "Romans", "Rom", "Ro", "罗马书", "罗"],
    ["The First Epistle of Paul the Apostle to the Corinthians", "1st Corinthians", "1Cor", "1Co", "哥林多前书", "林前"],
    ["The Second Epistle of Paul the Apostle to the Corinthians", "2nd Corinthians", "2Cor", "2Co", "哥林多后书", "林后"],
    ["The Epistle of Paul the Apostle to the Galatians", "Galatians", "Gal", "Ga", "加拉太书", "加"],
    ["The Epistle of Paul the Apostle to the Ephesians", "Ephesians", "Eph", "以弗所书", "弗"],
    ["The Epistle of Paul the Apostle to the Philippians", "Philippians", "Phil", "Phi", "Phl", "Php", "腓立比书", "腓"],
    ["The Epistle of Paul the Apostle to the Colossians", "Colossians", "Col", "歌罗西书", "西"],
    ["The First Epistle of Paul the Apostle to the Thessalonians", "1st Thessalonians", "1Th", "1Ts", "1Thess", "帖撒罗尼迦前书", "帖前"],
    ["The Second Epistle of Paul the Apostle to the Thessalonians", "2nd Thessalonians", "2Th", "2Ts", "2Thess", "帖撒罗尼迦后书", "帖后"],
    ["The First Epistle of Paul the Apostle to Timothy", "1st Timothy", "1Ti", "1Tim", "提摩太前书", "提前"],
    ["The Second Epistle of Paul the Apostle to Timothy", "2nd Timothy", "2Ti", "2Tim", "提摩太后书", "提后"],
    ["The Epistle of Paul the Apostle to Titus", "Titus", "Tit", "提多书", "多"],
    ["The Epistle of Paul the Apostle to Philemon", "Philemon", "Phm", "Philem", "腓利门书", "门"],
    ["The Epistle of Paul the Apostle to the Hebrews", "Hebrews", "Heb", "He", "希伯来书", "来"],
    ["The General Epistle of James", "James", "Jas", "Jam", "雅各书", "雅"],
    ["The First Epistle General of Peter", "1st Peter", "1Pe", "1Pet", "彼得前书", "彼前"],
    ["The Second General Epistle of Peter", "2nd Peter", "2Pe", "2Pet", "彼得后书", "彼后"],
    ["The First Epistle General of John", "1st John", "1Jn", "约翰一书", "约一"],
    ["The Second Epistle General of John", "2nd John", "2Jn", "约翰二书", "约二"],
    ["The Third Epistle General of John", "3rd John", "3Jn", "约翰三书", "约三"],
    ["The General Epistle of Jude", "Jude", "Jud", "Jue", "犹太书", "犹"],
    ["The Revelation of Saint John the Devine", "Revelation", "Rev", "Re", "Rv", "启示录", "启"],
    ];   
    for (let blxl=0;blxl<bible_abbr.length;blxl++){
        if (bible_abbr[blxl].includes(csstr)){
            return blxl;
        }
    }
    
    if (csstr.match(/[a-zA-Z]/)!==null){
        csstr=csstr.toLowerCase();
        for (let blxl=0;blxl<bible_abbr.length;blxl++){
            for (let item of bible_abbr[blxl]){
                if (item.toLowerCase()==csstr){
                    return blxl;
                }
            }
        }
    }
    
    for (let blxl=0;blxl<bible_abbr.length;blxl++){
        for (let item of bible_abbr[blxl]){
            if (item.includes(csstr)){
                return blxl;
            }
        }
    }
    return -1;
}

function main_options_bible(){
    var bloption_kjv='<option value=-1></option>';
    var bloption_cn='<option value=-1></option>';
    for (let blxl=0;blxl<chapter_global.length;blxl++){
        var item=chapter_global[blxl];
        bloption_kjv=bloption_kjv+'<option value='+item[0]+'>';
        bloption_kjv=bloption_kjv+(blxl < 9 ? '0' : '')+(blxl+1)+'. '+item[1]+'</option>\n';
        bloption_cn=bloption_cn+'<option value='+item[0]+'>';
        bloption_cn=bloption_cn+(blxl < 9 ? '0' : '')+(blxl+1)+'. '+chapter_global[blxl][2]+'</option>\n';
    }
    var ochapter=document.getElementById('select_chapter');
    if (ochapter){
        ochapter.innerHTML=bloption_kjv;
    }
    var ochapter_cn=document.getElementById('select_chapter_cn');
    if (ochapter_cn){
        ochapter_cn.innerHTML=bloption_cn;
    }

    //rand_chapter_list_bible();
}

function rand_chapter_list_bible(){
    var rndchapter=parseInt(Math.random()*chapter_global.length);
    document.getElementById('select_chapter').value=chapter_global[rndchapter][0];
    document.getElementById('select_chapter_cn').value=chapter_global[rndchapter][0];
    minor_options_bible(chapter_global[rndchapter][0],true);
}

function minor_options_bible(csno=0,csrnd=false){
    if (csno==-1){
        document.getElementById('divhtml').innerHTML='';
        return;
    }
    if (kjv.length==0 || cnbible_global.length==0){
        return;
    }
    var item=kjv[csno];
    if (item.substring(0,3)!=='== ' || item.slice(-3,)!==' =='){
        return;
    }
    var enname=item.substring(3,item.length-3);
    var bljg='';
    var list_t=[];
    for (let blxl=parseInt(csno)+1;blxl<kjv.length;blxl++){
        if (kjv[blxl].substring(0,4)=='=== ' && kjv[blxl].slice(-4,)==' ==='){
            bljg=bljg+'<option value='+blxl+'>'+kjv[blxl].substring(4,kjv[blxl].length-4).replace(enname,'')+'</option>\n';
            list_t.push(blxl);
            continue;
        }
        if (kjv[blxl].substring(0,3)=='== ' && kjv[blxl].slice(-3,)==' =='){
            break;
        }
    }
    document.getElementById('select_sub').innerHTML=bljg;
    document.getElementById('select_end_sub').innerHTML='<option value="-1"></option>'+bljg;
    if (list_t.length>0){
        if (csrnd){
            list_t.sort(randomsort_b);
        }
        document.getElementById('select_sub').value=list_t[0];
        chapter_one_bible(list_t[0]);
    }
}

function line_no_2_book_no(line_no=0){
    if (line_no<0 || line_no>=kjv.length){
        return -1;
    }
    for (let blxl=0;blxl<chapter_global.length;blxl++){
        var book_first_line_no=chapter_global[blxl][0];
        if (line_no<book_first_line_no && blxl>0){
            return blxl-1;
        }
    }
    return chapter_global.length-1;
}

function chapter_one_bible(startno=0,endno=0){
    if (startno==-1){
        document.getElementById('divhtml').innerHTML='';
        document.getElementById('select_sub').innerHTML='';
        return;
    }
    startno=parseInt(startno);
    endno=parseInt(endno);
    var bljg='<table class="table_zebra" border=0 cellspacing=5 cellpadding=10 width=100%>';
    var found2=false;
    var found3=false;
    var tdwidth='100%';
    if (use_kjv_cn_global[0] && use_kjv_cn_global[1]){
        tdwidth='50%';
    }
    
    var tdnum='';
    var enstr='';
    var cnstr='';
    var fav_list=array_unique_b(local_storage_get_b('fav_lines_bible',-1,true),true);
    for (let blxl=startno;blxl<cnbible_global.length;blxl++){
        if (blxl==0 || found2==false && kjv[blxl].substring(0,3)=='== ' && kjv[blxl].slice(-3,)==' =='){
            continue;
        }
        if (found2 && kjv[blxl].substring(0,3)=='== ' && kjv[blxl].slice(-3,)==' ==' || found3 && kjv[blxl].substring(0,4)=='=== ' && kjv[blxl].slice(-4,)==' ==='){
            break;
        }

        bljg=bljg+'<tr>';
        if (kjv[blxl].substring(0,4)=='=== ' && kjv[blxl].slice(-4,)==' ==='){
            if (endno>startno){
                if (blxl>=endno){
                    found3=true;
                }
            }
            else {
                found3=true;
            }
            if (use_kjv_cn_global[0]){
                bljg=bljg+'<td width='+tdwidth+' valign=top><h3>'+kjv[blxl].substring(4,kjv[blxl].length-4)+'</h3></td>';
            }
            if (use_kjv_cn_global[1]){
                bljg=bljg+'<td width='+tdwidth+' valign=top><h3>'+cnbible_global[blxl].substring(4,cnbible_global[blxl].length-4)+'</h3></td>';
            }
        }
        else {
            var blstyle=(fav_list.has(blxl.toString())?' style="background-color:'+scheme_global['pink']+';"':'');
            [tdnum,enstr,cnstr]=number_bible(blxl,blstyle);
            if (use_kjv_cn_global[0]){
                bljg=bljg+'<td width='+tdwidth+' valign=top id="td_kjv_'+tdnum+'" class="td_kjv">'+'<a name="kjv_'+tdnum+'"></a>'+enstr+'</td>';
            }
            if (use_kjv_cn_global[1]){
                bljg=bljg+'<td width='+tdwidth+' valign=top id="td_cn_'+tdnum+'" class="td_cn">'+cnstr+'</td>';
            }
        }
        bljg=bljg+'</tr>\n';

        if (kjv[blxl].substring(0,3)=='== ' && kjv[blxl].slice(-3,)==' =='){
            found2=true;
        }
    }
    bljg=bljg+'</table>';
    document.getElementById('divhtml').innerHTML=bljg;
    
    if (endno==0){
        var ospan=document.getElementById('span_outside_links');
        var bljg='';
        var book_no=line_no_2_book_no(startno);
        var chapter_no=parseInt(kjv[startno].replace(new RegExp(/^.*\s(\d+)\s===$/,'g'),'$1'))-1;
        for (let key in bible_web_sites_global){
            bljg=bljg+'<a class="a_oblong_box" href="'+web_sites_href_one_chapter_bible(key,book_no,chapter_no)+'" target=_blank>'+key+'</a> ';
        }
        ospan.innerHTML=bljg;
    }
}

function fav_init_bible(){
    var fav_list=array_unique_b(local_storage_get_b('fav_lines_bible',-1,true));
    fav_list=fav_sort_bible(fav_list);
    localStorage.setItem('fav_lines_bible',fav_list.join('\n'));    
}

function fav_add_bible(csno){
    csno=csno.toString();
    var ospan_en=document.getElementById('span_number_bible_en_'+csno);
    var ospan_cn=document.getElementById('span_number_bible_cn_'+csno);
    var fav_list=array_unique_b(local_storage_get_b('fav_lines_bible',-1,true));
    var is_remove=false;
    if (ospan_en){
        if (ospan_en.style.backgroundColor==''){
            ospan_en.style.backgroundColor=scheme_global['pink'];
        }
        else {
            ospan_en.style.backgroundColor='';
            is_remove=true;
        }
    }
    if (ospan_cn){
        if (ospan_cn.style.backgroundColor==''){
            ospan_cn.style.backgroundColor=scheme_global['pink'];
        }
        else {
            ospan_cn.style.backgroundColor='';
            is_remove=true;
        }
    }
    
    var blat=fav_list.indexOf(csno);
    if (is_remove){
        if (blat>=0){
            fav_list.splice(blat,1);
            localStorage.setItem('fav_lines_bible',fav_list.join('\n'));
        }
    }
    else {
        if (blat==-1){
            fav_list.push(csno);
            fav_list=fav_sort_bible(fav_list);
            localStorage.setItem('fav_lines_bible',fav_list.join('\n'));
        }
    }
}

function number_bible(blxl,blstyle){
    var blnum='';
    var blstr_en=kjv[blxl].trim();
    var blat=blstr_en.indexOf(' ');
    if (blat>0){
        blnum=blstr_en.substring(0,blat).trim();
    }
    
    var blnum2='';
    var blstr_cn=cn_a_bible(cnbible_global[blxl]);
    var blat2=blstr_cn.indexOf(' ');
    if (blat2>0){
        blnum2=blstr_cn.substring(0,blat2).trim();
    }
    if (blnum==blnum2){
        blstr_en=blstr_en.substring(blat+1,);
        blstr_en='<span class="span_number_bible" id="span_number_bible_en_'+blxl+'"'+blstyle+' onclick="javascript:fav_add_bible('+blxl+');">'+blnum+'</span> <span class="txt_content">'+blstr_en+'</span>';
        
        blstr_cn=blstr_cn.substring(blat2+1,);
        blstr_cn='<span class="span_number_bible" id="span_number_bible_cn_'+blxl+'"'+blstyle+' onclick="javascript:fav_add_bible('+blxl+');">'+blnum+'</span> '+blstr_cn;
        return [blnum,blstr_en,blstr_cn];
    }
    else {
        return ['',blstr_en,blstr_cn];
    }
}

function checkbox_bible(){
    if (document.getElementById('use_kjv')){
        return;
    }
    var osub=document.getElementById('select_end_sub');
    if (osub){
        osub.insertAdjacentHTML('afterend',' '+checkbox_kl_b('use_kjv','KJV','',use_kjv_cn_global[0],'refresh_use_bible(true);')+' '+checkbox_kl_b('use_cn','CN','',use_kjv_cn_global[1],'refresh_use_bible(true);'));
    }
}

function refresh_use_bible(csupdate=false){
    use_kjv_cn_global[0]=checkbox_kl_value_b('use_kjv');
    use_kjv_cn_global[1]=checkbox_kl_value_b('use_cn');
    var select_en=document.getElementById('select_chapter');
    if (select_en){
        select_en.style.display=use_kjv_cn_global[0]?'inline':'none';
    }
    var select_cn=document.getElementById('select_chapter_cn');
    if (select_cn){
        select_cn.style.display=use_kjv_cn_global[1]?'inline':'none';
    }
    var oinput=document.getElementById('input_bible_search');
    if (oinput){
        oinput.placeholder=use_kjv_cn_global[1]?'圣经搜索':'Bible Search';
    }
    if (csupdate){
        if (document.getElementById('select_sub').value=='' && document.getElementById('input_bible_search').value!==''){
            search_bible();
        }
        else {
            chapter_one_bible(document.getElementById('select_sub').value,document.getElementById('select_end_sub').value);
        }
    }
}

function idb_read_bible(db,is_old=false){
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(['bible_dbf'], "readonly");
        //transaction.oncomplete = function(event) {
            //console.log('transaction ok');
        //};
        transaction.onerror = function(event) {
            console.log('transaction error');
        };

        var otable = transaction.objectStore('bible_dbf');
        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }    
                
        var en_list=[];
        var cn_list=[];            
        otable.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.type=='en'){
                    en_list.push(cursor.value.text);
                }
                else if (cursor.value.type=='cn'){
                    cn_list.push(cursor.value.text);
                }
                cursor.continue();
            }
            else {
                if (is_old){
                    enbible_old_global=en_list;
                    cnbible_old_global=cn_list;                                  
                }
                else {
                    kjv=en_list;
                    cnbible_global=cn_list;                        
                }
                resolve(true);
            }
        };
    });
}

function idb_count_bible(db){
    return new Promise((resolve, reject) => {
        var blcount=0;
        var transaction = db.transaction(['bible_dbf'], "readonly");
        transaction.oncomplete = function(event) {
            console.log('transaction ok',blcount);
        };
        transaction.onerror = function(event) {
            console.log('transaction error');
            reject(err);
        };

        var otable = transaction.objectStore('bible_dbf');

        var ocount=otable.count();
        ocount.onsuccess = function() {
            blcount=ocount.result;
            resolve(blcount);
        }
        ocount.onerror = function() {
            reject(err);
        }

        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }
    });
}

function idb_write_bible(db,adddata=true){
    return new Promise((resolve, reject) => {
        var transaction = db.transaction(['bible_dbf'], "readwrite");
        transaction.oncomplete = function(event) {
            console.log('transaction ok');
            resolve(true);
        };
        transaction.onerror = function(event) {
            console.log('transaction error');
        };

        var otable = transaction.objectStore('bible_dbf');

        var ocount1=otable.count();
        ocount1.onsuccess = function() {
            document.getElementById('span_status').innerHTML='IDB 清除前记录数：'+ocount1.result;
            console.log('清除前记录数：',ocount1.result);
        }

        var oclear = otable.clear();
        oclear.onsuccess = function(event) {
            console.log('数据清除成功');
        };
        oclear.onerror= function(event) {
            console.log('数据清除失败');
        };

        var ocount2=otable.count();
        ocount2.onsuccess = function() {
            document.getElementById('span_status').innerHTML='IDB 清除后记录数：'+ocount2.result;
            console.log('清除后记录数：',ocount2.result);
        }
        
        if (adddata){
            for (let item of kjv){
                otable.add({type:'en',text: item});
            }
            for (let item of cnbible_global){
                otable.add({type:'cn',text: item});
            }

            var ocount3=otable.count();
            ocount3.onsuccess = function() {
                document.getElementById('span_status').innerHTML='IDB 添加后记录数：'+ocount3.result;
                console.log('添加后记录数：',ocount3.result);
            }
        }

        otable.onsuccess = function (event) {
            console.log('dbf 打开成功');
        };
        otable.onerror = function (event) {
            console.log('dbf 打开失败');
        }
    });
}

function chapter_list_bible(){
    var chapter_minor_name_old='';
    var chapter_minor_count_old='';
    var chapter_minor_count_list=[];
    for (let blxl=0;blxl<kjv.length;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,3)=='== ' && item.slice(-3,)==' =='){
            chapter_global.push([blxl,item.substring(3,item.length-3),cnbible_global[blxl].substring(3,cnbible_global[blxl].length-3),0]);
        }
        if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
            var chapter_minor_name_current=item.replace(new RegExp(/^=== (.*?) (\d*) ===$/,'g'),'$1');
            var chapter_minor_count_current=item.replace(new RegExp(/^=== (.*?) (\d*) ===$/,'g'),'$2');
            if (chapter_minor_name_current==chapter_minor_name_old){
                chapter_minor_count_old=chapter_minor_count_current;
            }
            else {
                if (chapter_minor_name_old!==''){
                    chapter_minor_count_list.push([chapter_minor_name_old,parseInt(chapter_minor_count_old)]);
                }
                chapter_minor_name_old=chapter_minor_name_current;
                chapter_minor_count_old=chapter_minor_count_current;
            }
        }
    }
    //for (let item of chapter_global){
        //chapter_cn_global.push([item[0],cnbible_global[item[0]].substring(3,cnbible_global[item[0]].length-3)]);
    //}
    chapter_minor_count_list.push([chapter_minor_name_old,parseInt(chapter_minor_count_old)]);
    
    if (chapter_minor_count_list.length==chapter_global.length){
        for (let blxl=0;blxl<chapter_global.length;blxl++){
            if (chapter_global[blxl][1]==chapter_minor_count_list[blxl][0]){
                chapter_global[blxl][3]=chapter_minor_count_list[blxl][1];
            }
        }
    }    
}

function idb_count_and_write_bible(){
    ///在 bible_data.js 中被调用 - 保留注释
    async function sub_idb_count_and_write_bible(){
        console.log('idb_count_and_write_bible()');
        var blcount=await idb_bible('count');
        if (blcount==0){
            await idb_bible('write');
            //如果数据库为空，第一载入页面无法显示，重载正常 - 保留注释
            location.reload();
        }
        init_bible();
    }
    sub_idb_count_and_write_bible();
}

function load_data_bible(load_from_idb=false){
    async function sub_load_data_bible_read(){
        console.log('load_data_bible()');
        await idb_bible('read');
        if (kjv.length==0 || cnbible_global.length==0){
            await idb_bible('count');
            //console.log('load bible data from js file');
            //document.getElementById('span_title').style.color=scheme_global['color'];
            //document.write('\n<script language=JavaScript src="../jsdata/bible_data.js"><\/script>\n');
        }
        else {
            console.log('load data from idb');
            document.getElementById('span_title').style.color=scheme_global['a'];
            init_bible();
        }
    }
    if (load_from_idb==false){ // is_local_b() - 保留注释
        console.log('load bible data from local js file');
        document.getElementById('span_title').style.color=scheme_global['color'];
        //document.write('\n<script language=JavaScript src="../jsdata/bible_data.js"><\/script>\n');
        load_filelist_bible();
    }
    else {
        sub_load_data_bible_read();
    }
}

function load_filelist_bible(do_init=true){
    var sele_path=klbase_sele_path_b()[1];
    document.write('\n<script language=JavaScript src="'+sele_path+'/jsdoc3/bible_kjv_890.js"><\/script>\n');
    document.write('<script language="javascript">\n');
    document.write('kjv=[];\n');
    document.write('for (let item of filelist){\n');
    document.write('    kjv.push(item);\n');
    document.write('}\n');
    document.write('</script>\n');
    
    document.write('\n<script language=JavaScript src="'+sele_path+'/jsdoc3/sheng_jing_he_he_ben_124338.js"><\/script>\n');
    document.write('<script language="javascript">\n');
    document.write('cnbible_global=[];\n');
    document.write('for (let item of filelist){\n');
    document.write('    cnbible_global.push(item);\n');
    document.write('}\n');
    document.write('filelist=[];\n');
    if (do_init){
        document.write('init_bible();\n');    //idb_count_and_write_bible();
    }
    document.write('</script>\n');
}

function idb_bible(cstype='',is_old=false){
    return new Promise((resolve, reject) => {
        var bljg=0;
        var db;
        var DBOpenRequest = window.indexedDB.open('bible');
        DBOpenRequest.onerror = function (event) {
            console.log('bible 数据库打开报错');
        };

        DBOpenRequest.onsuccess = function (event) {
            db = DBOpenRequest.result;
            console.log('bible 数据库打开成功');
            
            if (!db.objectStoreNames.contains('bible_dbf')) {
                db.createObjectStore('bible_dbf', { autoIncrement: true });
                console.log('new table: bible_dbf');
            }
            switch (cstype){
                case 'read':
                    async function sub_idb_bible_read() {
                        console.log('sub_idb_bible_read()');
                        await idb_read_bible(db,is_old);
                        resolve(true);
                    }
                    sub_idb_bible_read();
                    break;
                case 'write':
                    async function sub_idb_bible_write() {
                        console.log('sub_idb_bible_write()');
                        await idb_write_bible(db);
                        resolve(true);
                    }
                    sub_idb_bible_write();
                    break;
                case 'clear':
                    async function sub_idb_bible_clear() {
                        console.log('sub_idb_bible_clear()');
                        await idb_write_bible(db,false);
                        resolve(true);
                    }
                    sub_idb_bible_clear();
                    break;
                case 'count':
                    async function sub_idb_bible_count() {
                        console.log('sub_idb_bible_count()');
                        bljg = await idb_count_bible(db);
                        document.getElementById('span_status').innerHTML='IDB 记录数：'+bljg;
                        resolve(bljg);
                    }
                    sub_idb_bible_count();
                    break;
            }
            db.close();
        };

        DBOpenRequest.onupgradeneeded = function (event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains('bible_dbf')) {
                db.createObjectStore('bible_dbf', { autoIncrement: true });
            }
            console.log('onupgradeneeded');
        }
    });
}

function web_sites_href_one_chapter_bible(website_name,book_no=0,chapter_no=0){
    if (website_name in bible_web_sites_global){
        var list_t=bible_web_sites_global[website_name];
        if (list_t.length!==chapter_global.length || book_no>=chapter_global.length){
            return '';
        }
        switch (website_name){
            case 'shengjing_jidujiao_com':
                return 'http://'+(ismobile_b()?'sj':'shengjing')+'.jidujiao.com/'+list_t[book_no]+(chapter_no+1)+'.html'
            case 'BibleGateway_CUVS':
                var BibleGateway_bookname=list_t[book_no].split('');
                for (let name_no=0;name_no<BibleGateway_bookname.length;name_no++){
                    BibleGateway_bookname[name_no]=encodeURIComponent(BibleGateway_bookname[name_no]);
                }
                return 'https://www.biblegateway.com/passage/?search='+BibleGateway_bookname.join('+')+'+'+(chapter_no+1)+'&version=CUVS';
            case 'BibleGateway_KJV':
                var BibleGateway_bookname=list_t[book_no];
                return 'https://classic.biblegateway.com/passage/?search='+BibleGateway_bookname+'+'+(chapter_no+1)+'&version=KJV';
            case 'o-bible.com':
                return 'http://www.o-bible.com/cgibin/ob.cgi?version=hgb&book='+list_t[book_no]+'&chapter='+(chapter_no+1);
            case 'o-bible.com_kjv':
                return 'http://www.o-bible.com/cgibin/ob.cgi?version=kjv&book='+list_t[book_no]+'&chapter='+(chapter_no+1);
            case 'biblestudytools.com':
                return 'https://www.biblestudytools.com/kjv/'+list_t[book_no]+'/'+(chapter_no+1)+'.html';
        }
    }
    return '';
}

function web_sites_href_list_bible(website_name,cscaption){
    var result_t=[];
    if (website_name in bible_web_sites_global){
        var list_t=bible_web_sites_global[website_name];
        if (list_t.length!==chapter_global.length){
            return '';
        }
        var blver='';
        var blen_cn=0;
        switch (website_name){
            case 'o-bible.com':
                blver='hgb';
                blen_cn=2;
                break;
            case 'o-bible.com_kjv':
                blver='kjv';
                blen_cn=1;
                break;
        }
        
        switch (website_name){
            case 'shengjing_jidujiao_com':
                var blhttp=(ismobile_b()?'sj':'shengjing');
                for (let blxl=0;blxl<list_t.length;blxl++){
                    result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][2]+'</h3>');
                    for (let blno=0;blno<chapter_global[blxl][3];blno++){
                        result_t.push('<a class="a_oblong_box" href="http://'+blhttp+'.jidujiao.com/'+list_t[blxl]+(blno+1)+'.html" target=_blank>'+(blno+1)+'</a> ');
                    }
                }
                break;
            case 'BibleGateway_CUVS':
                for (let blxl=0;blxl<list_t.length;blxl++){
                    result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][2]+'</h3>');
                    var BibleGateway_bookname=list_t[blxl].split('');
                    for (let name_no=0;name_no<BibleGateway_bookname.length;name_no++){
                        BibleGateway_bookname[name_no]=encodeURIComponent(BibleGateway_bookname[name_no]);
                    }
                    
                    for (let blno=0;blno<chapter_global[blxl][3];blno++){
                        result_t.push('<a class="a_oblong_box" href="https://www.biblegateway.com/passage/?search='+BibleGateway_bookname.join('+')+'+'+(blno+1)+'&version=CUVS" target=_blank>'+(blno+1)+'</a> ');
                    }
                }                
                break;
            case 'BibleGateway_KJV':
                for (let blxl=0;blxl<list_t.length;blxl++){
                    result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][1]+'</h3>');
                    var BibleGateway_bookname=list_t[blxl];
                    for (let blno=0;blno<chapter_global[blxl][3];blno++){
                        result_t.push('<a class="a_oblong_box" href="https://www.biblegateway.com/passage/?search='+BibleGateway_bookname+'+'+(blno+1)+'&version=KJV" target=_blank>'+(blno+1)+'</a> ');
                    }
                }                
                break;
            case 'o-bible.com':
            case 'o-bible.com_kjv':
                for (let blxl=0;blxl<list_t.length;blxl++){
                    result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][blen_cn]+'</h3>');                    
                    for (let blno=0;blno<chapter_global[blxl][3];blno++){
                        result_t.push('<a class="a_oblong_box" href="http://www.o-bible.com/cgibin/ob.cgi?version='+blver+'&book='+list_t[blxl]+'&chapter='+(blno+1)+'" target=_blank>'+(blno+1)+'</a> ');
                    }
                }
                break;
            case 'biblestudytools.com':
                for (let blxl=0;blxl<list_t.length;blxl++){
                    result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][1]+'</h3>');                    
                    for (let blno=0;blno<chapter_global[blxl][3];blno++){
                        result_t.push('<a class="a_oblong_box" href="https://www.biblestudytools.com/kjv/'+list_t[blxl]+'/'+(blno+1)+'.html" target=_blank>'+(blno+1)+'</a> ');
                    }
                }
                break;                
        }
    }
    document.getElementById('divhtml').innerHTML='<h3 style="margin:0.5rem;">'+cscaption+'</h3><div style="margin:0.5rem;column-count:4;line-height:'+(ismobile_b()?'180':'220')+'%;">'+result_t.join('\n')+'</div>';
}

function chapter_all_bible(){
    var result_t=[];
    var main_chapter=-1;
    var main_no=1;
    for (let blxl=0;blxl<kjv.length;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,3)=='== ' && item.slice(-3,)==' =='){
            main_chapter=blxl;        
            result_t.push('<h3 style="cursor:pointer;" onclick="chapter_go_bible('+main_chapter+','+blxl+');">'+main_no+'. '+item.slice(3,-3)+' '+cnbible_global[blxl].slice(3,-3)+'</h3>');
            main_no=main_no+1;
        }
        else if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
            result_t.push('<span class="oblong_box" onclick="chapter_go_bible('+main_chapter+','+blxl+');">'+item.replace(new RegExp(/.*?\s*(\d*)\s*===$/,'g'),'$1')+'</span> ');
        }
    }        
    
    document.getElementById('divhtml').innerHTML='<div style="margin:0.5rem;column-count:4;line-height:'+(ismobile_b()?'180':'220')+'%;">'+result_t.join('\n')+'</div>';
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#divhtml span.oblong_box'));
}

function chapter_go_bible(csmain,cssub){
    document.getElementById('select_chapter').value=csmain;
    document.getElementById('select_chapter_cn').value=csmain;
    minor_options_bible(csmain);
    if (cssub!==csmain){
        document.getElementById('select_sub').value=cssub;    
        chapter_one_bible(cssub);
    }
    document.location.href = '#top';
}
