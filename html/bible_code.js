function recent_search_bible(csstr=''){
    recent_search_b('recent_search_bible',csstr,'search_bible','div_recent_search',['[借著鍊](:r)','b=传道书_3_1_8','带著','照著']);
}

function bookmarks_set_bible(){
    var omain=document.getElementById('select_chapter');
    var osub=document.getElementById('select_sub');
    if (omain.selectedIndex==-1 || omain.value=='' || osub.selectedIndex==-1){return;}
    
    if (omain.value+' /// '+osub.value==local_storage_get_b('bible_bookmark')){
        alert('书签已存在'); //章节号 /// 行号 - 保留注释
        return;
    }
    
    if (confirm('是否更新 书签：'+kjv[omain.value]+' -> '+(osub.selectedIndex+1)+'？')){
        localStorage.setItem('bible_bookmark',omain.value+' /// '+osub.value);
        alert('书签已更新');
        bookmarks_get_bible();  //读取一次 - 保留注释
    }
}

function bookmarks_get_bible(only_change_title=false){
    var bm=local_storage_get_b('bible_bookmark');
    if (!bm.includes(' /// ')){
        return ['',''];
    }
    var blchapter, blsub;
    [blchapter,blsub]=bm.split(' /// ');
    if (only_change_title){
        return [blchapter,blsub];
    }
    
    document.getElementById('select_chapter').value=blchapter;
    document.getElementById('select_chapter_cn').value=blchapter;
    minor_options_bible(blchapter);
    document.getElementById('select_sub').value=blsub;
    document.getElementById('select_end_sub').value=blsub;    
    chapter_one_bible(blsub);
}

function new_words_bible(){
    if (klmenu_check_b('span_show_new_enwords',false)){
        get_new_words_arr_obj_enbook_b(2,document.getElementById('divhtml').innerText,document.querySelectorAll('.txt_content'));
    }
}

function sub_start_change_bible(oselect){
    var oend=document.getElementById('select_end_sub');
    if (parseInt(oend.value)<parseInt(oselect.value)){
        oend.value=oselect.value;
    }
    chapter_one_bible(oselect.value,oend.value); 
}

function sub_end_change_bible(oselect){
    chapter_one_bible(document.getElementById('select_sub').value,oselect.value);
}

function menu_bible(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'bookmarks_get_bible();">读取书签</span>',    
    '<span class="span_menu" onclick="'+str_t+'bookmarks_set_bible();">添加书签</span>',
    '<span class="span_menu" onclick="'+str_t+'reading_statistics_bible();">阅读进度</span>',
    '<span class="span_menu" onclick="'+str_t+'search_bible(\'FAV\');">FAV</span>',
    '<span class="span_menu" onclick="'+str_t+'fav_all_bible();">FAV_Reader</span>',    
    '<span class="span_menu" onclick="'+str_t+'chapter_all_bible();">所有章节</span>',
    '<span id="span_show_new_enwords" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);new_words_bible();">⚪ 显示生词</span>',        
    '<span id="span_highlight_keys" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 关键词加亮</span>',        
    ];

    if (is_local_b()){
        klmenu1.push('<a href="enwords_book.htm" onclick="'+str_t+'" target=_blank>生词统计链接</a>');
    }
    var klmenu2=[
    '<span id="span_reg_bible" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 正则</span>',            
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'bible\');">更新版本</span>',
    '<span class="span_menu" onclick="'+str_t+'help_bible();">Help</span>',
    ];
    klmenu2=root_font_size_menu_b(str_t).concat(klmenu2);
    
    var klmenu_idb=[
    '<span class="span_menu" onclick="'+str_t+'idb_bible(\'count\');">统计 IDB 记录数</span>',     
    '<span class="span_menu" onclick="'+str_t+'if (confirm(\'是否从 IDB 读取数据？\')){load_data_bible(true);}">从 IDB 读取数据</span>',
    '<span class="span_menu" onclick="'+str_t+'if (confirm(\'是否写入数据到 IDB？\')){idb_bible(\'write\');}">写入数据到 IDB</span>', 
    '<span class="span_menu" onclick="'+str_t+'if (confirm(\'是否清除 IDB 数据？\')){idb_bible(\'clear\');}">清除 IDB 数据</span>',
    '<span class="span_menu" onclick="'+str_t+'compare_data_bible();">比较 js 和 IDB 数据</span>',    
    ];
    
    var klmenu3=[];    
    for (let key of web_sites_keys_bible()){
        klmenu3.push('<span class="span_menu" onclick="'+str_t+'web_sites_href_list_bible(\''+specialstr_j(key)+'\');">'+key+'</span>');
    }
    
    var color_menu=[];
    var list_t=['default'].concat(popular_colors_b());
    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl];
        color_menu.push('<span class="span_menu" onclick="'+'change_colors_b(\''+item+'\');" style="color:'+item.split(',')[0]+';background-color:'+item.split(',')[1]+';">'+(blxl+1)+'. '+item+'</span>');
    }

    if (ismobile_b()){
        var button_fontsize='1.8rem';
        var menu_fontsize='1.2rem';
    } else {
        var button_fontsize='1.5rem';
        var menu_fontsize='1rem';
    }
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✝','14rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(klmenu2,'⚙','20rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(klmenu_idb,'ℹ','14rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(klmenu3,'🌐','16rem',button_fontsize,menu_fontsize,'60rem')+klmenu_b(color_menu,'🎨','20rem',button_fontsize,menu_fontsize,'20rem'),'','0rem')+' ');

    klmenu_check_b('span_reg_bible',true);
    klmenu_check_b('span_highlight_keys',true);
}

function compare_data_bible(){
    function sub_compare_data_bible_replace(diff_str_js_list,diff_str_idb_list,key_list){
        //key_list [['着','著'],['藉着','借著']];
        var list1=diff_str_js_list.concat(diff_str_idb_list);
        var list2=diff_str_js_list.concat(diff_str_idb_list);
        var len_old=list1.length;
        try {
            for (let blxl=0;blxl<len_old;blxl++){
                for (let item of key_list){
                    list1[blxl]=list1[blxl].replace(new RegExp(item[0],'g'),item[1]);
                    list2[blxl]=list2[blxl].replace(new RegExp(item[1],'g'),item[0]);
                }
            }
        } catch (error){
            console.log(error.message);
        }

        var len_old=list1.length;

        diff_str_js_list.sort();
        var js_join=diff_str_js_list.join('\n');
        diff_str_idb_list.sort();
        var idb_join=diff_str_idb_list.join('\n');

        var blstr=sub_compare_data_bible_result(list1,list2,js_join,idb_join,key_list,len_old);
        
        return blstr;
    }
    
    function sub_compare_data_bible_td(csno,js_str,idb_str,subchapter_name,line_no){
        var bookno=line_no_2_book_no(line_no);
        return '<td align=right>'+csno+'</td><td><span style="cursor:pointer;" onclick="chapter_relative_bible(event,'+bookno+');">【'+(bookno+1)+'】</span><span style="cursor:pointer;" onclick="book_bible(\''+subchapter_name.replace(/\s*(\d+)$/g,'_$1')+'_'+js_str.split(' ')[0]+'\');">'+subchapter_name+'</span></td><td class="td_compare_bible">'+js_str+'</td><td class="td_compare_bible">'+idb_str+'</td>'; //\s* 和 (\s+)? 效果不一样 - 保留注释
    }
    
    function sub_compare_data_bible_result(diff_str_list1,diff_str_list2,js_join,idb_join,key_list,len_old){
        diff_str_list1=array_unique_b(diff_str_list1);
        var str_t1=array_2_li_b(diff_str_list1);
        diff_str_list1.sort();
        var list_join1=diff_str_list1.join('\n');

        diff_str_list2=array_unique_b(diff_str_list2);
        var str_t2=array_2_li_b(diff_str_list2);
        diff_str_list2.sort();
        var list_join2=diff_str_list2.join('\n');
        
        var bljg='<div id="div_compare_bible">';
        
        var equal_str1='';
        var is_equal1=false;
        [equal_str1,is_equal1]=sub_compare_data_bible_is_equal(js_join,idb_join,list_join1);

        if (is_equal1){
            var replace_list1=[];
            for (let item of key_list){
                replace_list1.push(item[0]+' 替换为 '+item[1]);
            }
            
            bljg=bljg+'<p>将 '+replace_list1.join('、')+' 之后，结果行数从 '+len_old+' 行变为 '+diff_str_list1.length+' 行 <small>('+now_time_str_b(':',true)+')</small></p>';
            bljg=bljg+str_t1;        
            bljg=bljg+equal_str1;
        } else {
            var equal_str2='';
            var is_equal2=false;
            [equal_str2,is_equal2]=sub_compare_data_bible_is_equal(js_join,idb_join,list_join2);        

            var replace_list2=[];
            for (let item of key_list){
                replace_list2.push(item[1]+' 替换为 '+item[0]);
            }
            
            bljg=bljg+'<p>将 '+replace_list2.join('、')+' 之后，结果行数从 '+len_old+' 行变为 '+diff_str_list2.length+' 行 <small>('+now_time_str_b(':',true)+')</small></p>';
            bljg=bljg+str_t2;        
            bljg=bljg+equal_str2;
        }
        
        bljg=bljg+'</div>';
        return bljg;
    }
    
    function sub_compare_data_bible_is_equal(js_join,idb_join,compared_str){
        if (compared_str==js_join){
            return ['<h4>与 js 一致</h4>',true];
        } else if (compared_str==idb_join){
            return ['<h4>与 idb 一致</h4>',true];
        } else {
            return ['<h4>与 js 和 idb 都不一致</h4>',false];
        }
    }

    function sub_compare_data_bible_different_characters(str1,str2,key_list){
        var list1=str1.split('');
        var list2=str2.split('');
        if (list1.length==list2.length){
            var no_list=[];
            for (let blxl=0;blxl<list1.length;blxl++){
                if (list1[blxl]==list2[blxl]){continue;}
                no_list.push(blxl);
            }
            
            var group_list=[];
            var one_group=[];
            for (let item of no_list){
                if (one_group.length==0){
                    one_group=[item];
                } else if (one_group[one_group.length-1]+1==item){
                    one_group.push(item);
                } else {
                    group_list.push(one_group);
                    one_group=[item];
                }
            }
            if (one_group.length>0){
                group_list.push(one_group);            
            }
            
            for (let item of group_list){
                if (item.length==1){
                    var value1=list1[item[0]];
                    var value2=list2[item[0]];
                } else {
                    var value1=list1.slice(item[0],item[item.length-1]+1).join('');
                    var value2=list2.slice(item[0],item[item.length-1]+1).join('');
                }
                var blfound=false;
                for (let one_old_key of key_list){
                    if (one_old_key[0]==value1 && one_old_key[1]==value2){
                        blfound=true;
                        break;
                    }
                }
                if (blfound==false){
                    key_list.push([value1,value2]);
                }
            }
            return key_list;
        } else {
            return [];
        }
    }
    //---
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
        var str_new='';
        var str_old='';
        
        var t0=performance.now();
        for (let blxl=0;blxl<len_min;blxl++){
            if (kjv[blxl].substring(0,4)=='=== ' && kjv[blxl].slice(-4,)==' ==='){
                subchapter_no=blxl;
            }
            var blfound=false;
            if (kjv[blxl]!==enbible_old_global[blxl]){
                blfound=true;
                subchapter_name=kjv[subchapter_no].slice(4,-4);
                str_new=kjv[blxl];
                str_old=enbible_old_global[blxl];
            }
            if (cnbible_global[blxl]!==cnbible_old_global[blxl]){
                blfound=true;
                subchapter_name=cnbible_global[subchapter_no].slice(4,-4);
                str_new=cnbible_global[blxl];
                str_old=cnbible_old_global[blxl];
            }
            if (blfound){
                diff_td_list.push(sub_compare_data_bible_td(blno,str_new,str_old,subchapter_name,blxl));
                diff_str_js_list.push(str_new);
                diff_str_idb_list.push(str_old);
                character_list=sub_compare_data_bible_different_characters(str_new,str_old,character_list);
                blno=blno+1;
            }
            if (blno>=400){break;}
        }
        
        var character_unique=new Set();
        for (let item of character_list){
            character_unique.add(item[0]);
            character_unique.add(item[1]);
        }
        character_unique=Array.from(character_unique);
        
        character_list.sort(function (a,b){return a[0].length<b[0].length;});   //长的不同字在前先替换 - 保留注释
        character_unique.sort(function (a,b){return a.length<b.length;});   //长的不同字在前先替换 - 保留注释
        
        console.log('sub_compare_data_bible_get_old_data() 查找不同字 费时：'+(performance.now() - t0) + ' milliseconds');
        
        var bljg='<table id="table_compare_bible" class="table_common" cellspacing=0><tr><th>No.</th><th>Book</th><th>js</th><th>idb</th></tr>\n'+array_2_li_b(diff_td_list,'tr',false,'','','')+'</table>';
        bljg=bljg+array_2_li_b(character_unique);

        bljg=bljg+sub_compare_data_bible_replace(diff_str_js_list,diff_str_idb_list,character_list);

        document.getElementById('divhtml').innerHTML='<div style="margin:0.5rem;" >'+bljg+'</div>';
        var is_ok;
        var otds=document.querySelectorAll('table#table_compare_bible td.td_compare_bible,div#div_compare_bible p,div#div_compare_bible li');
        for (let one_td of otds){
            for (let one_character of character_unique){
                is_ok=highlight_obj_b(one_td,one_character,'<span style="background-color:'+scheme_global['pink']+';">'+one_character+'</span>');
                if (is_ok===-1){
                    break;
                } else if (is_ok===false){
                    one_td.insertAdjacentHTML('beforeend','💡<span style="background-color:'+scheme_global['pink']+';">'+one_character+'</span>');
                }
            }
        }

        enbible_old_global=[];
        cnbible_old_global=[];
    }
    //-----------------------
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
                    case 'kjv':
                        use_kjv_cn_global=[true,false];
                        break;
                    case 'cn':
                        use_kjv_cn_global=[false,true];
                        break;
                }
            } else if (bltmpstr=='alone'){
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
                } else {
                    document.getElementById('input_bible_search').value=bltmpstr;
                    search_bible();
                    dosomething=true;
                    break;
                }
            } else if (bltmpstr.substring(0,2)=='b='){
                book_bible(bltmpstr.substring(2,),is_alone);
                dosomething=true;
                break;
            }
        }
    }
    return dosomething;
}

function init_bible(){
    main_sub_chapter_var_generate_bible();
    main_options_bible();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2.3rem':'1.6rem'),true,true,2);
    var dosomething=args_bible();

    checkbox_bible();
    refresh_use_bible();
    if (dosomething==false){
        rand_chapter_list_bible();
        bookmarks_get_bible();
    }
}

function current_sub_chapter_index_bible(cssub=-1){
    if (cssub==-1){
        cssub=parseInt(document.getElementById('select_sub').value);
    }
    if (isNaN(cssub) || cssub<0){
        return -1;
    }
    
    return chapter_sub_global.indexOf(cssub);
}

function reading_statistics_bible(do_alert=true){
    var cssub=parseInt(bookmarks_get_bible(true)[1]);
    var blno=Math.max(0,current_sub_chapter_index_bible(cssub));
    
    var remained_days=days_remained_of_year_b();
    
    var sub_len=chapter_sub_global.length;
    var remained_chapters1=sub_len-blno;
    var remained_chapters2=sub_len-(local_storage_get_b('bible_chapter_readed').match(/1/g) || []).length;

    var remained_chapters_min=Math.min(remained_chapters1,remained_chapters2);
    
    var chapters_per_day=remained_chapters_min/remained_days;
    
    var bljg='今年剩余天数 '+remained_days+ ' 天。\n全书共有 '+sub_len+' 章， '+kjv.length+' 行。\n';

    bljg=bljg+'已读 '+(sub_len-remained_chapters_min)+' 章 ('+((sub_len-remained_chapters_min)*100/sub_len).toFixed(1)+'%)。未读 '+remained_chapters_min+' 章。';    

    if (remained_chapters1<remained_chapters2){
        bljg=bljg+'书签所在章'+kjv[cssub].replace('=== ','【').replace(' ===','')+'・'+cnbible_global[cssub].replace('=== ','').replace(' ===','】');
        bljg=bljg+' 为第 '+(blno+1)+' 章 ('+((blno+1)*100/sub_len).toFixed(1)+'%)。\n书签所在行为第 '+(cssub+1)+' 行 ('+((cssub+1)*100/kjv.length).toFixed(2)+'%)。\n';
    }
    
    bljg=bljg+'今年年底完成阅读需要 '+chapters_per_day.toFixed(1) +' 章/天';
    if (remained_chapters1<remained_chapters2){
        '，或 '+((kjv.length-cssub)/remained_days).toFixed(2) +' 行/天';
    }
    bljg=bljg+'。';
    
    var chapters_per_day_ceil=Math.ceil(chapters_per_day);
    for (let blxl=chapters_per_day_ceil;blxl<=4;blxl++){
        if (blxl!==chapters_per_day){
            var days_ceil=remained_chapters_min/blxl;
            bljg=bljg+'\n按每日 '+blxl+' 章阅读，需要 '+days_ceil.toFixed(1)+' 天读完，即 '+next_day_b('',days_ceil)+'。';
        }
    }
    
    if (chapters_per_day>=4){
        remained_days=remained_days+isLeapYear_b(false,1,true);
        chapters_per_day=remained_chapters_min/remained_days;
        bljg=bljg+'\n距 '+(date_2_ymd_b(false,'y')+1)+' 年年底剩余天数 '+remained_days+' 天，完成阅读需要 '+chapters_per_day.toFixed(1) +' 章/天';
        if (remained_chapters1<remained_chapters2){
            bljg=bljg+'，或 '+((kjv.length-cssub)/remained_days).toFixed(2) +' 行/天';
        }
        bljg=bljg+'。';
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
    bljg=bljg+'—— <span style="cursor:pointer;" onclick="chapter_relative_bible(event,'+chapter_no_current+');">【'+(chapter_no_current+1)+'】</span>';
    bljg=bljg+'<span class="span_box" onclick="book_bible(\''+kjv[h2].substring(3,kjv[h2].length-3)+'_'+kjv[h3].substring(4,kjv[h3].length-4).split(' ').slice(-1)[0]+'_'+kjv[blxl].split(' ')[0]+'\');">';
    if (use_kjv_cn_global[0] && use_kjv_cn_global[1]){
        bljg=bljg+kjv[h2].substring(3,kjv[h2].length-3)+' '+cnbible_global[h3].substring(4,cnbible_global[h3].length-4);
    } else if (use_kjv_cn_global[0]){
        bljg=bljg+kjv[h3].substring(4,kjv[h3].length-4);
    } else if (use_kjv_cn_global[1]){
        bljg=bljg+cnbible_global[h3].substring(4,cnbible_global[h3].length-4);
    }  
    bljg=bljg+'</span>';
    bljg=bljg+'</p></td></tr>';
    return bljg;
}

function fav_location_bible(cspages,csmax){
    var blno=parseInt((prompt('输入页号',cspages) || '').trim());
    if (isNaN(blno)){return;}
    blno=Math.min(cspages,Math.max(1,blno));
    search_bible('FAV',0,(blno-1)*csmax+1);
}

function fav_get_bible(){
    return local_storage_get_b('fav_lines_bible',-1,true);
}

function fav_set_bible(cslist){
    localStorage.setItem('fav_lines_bible',cslist.join('\n'));
}

function search_bible(cskey='',csstartno=0,fav_start=1,csmax=500){
    if (cskey==''){
        cskey=document.getElementById('input_bible_search').value.trim();
    }
    document.getElementById('input_bible_search').value=cskey;
    var isreg=klmenu_check_b('span_reg_bible',false);
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    if (cskey.substring(0,2).toLowerCase()=='b='){
        recent_search_bible(cskey);
        book_bible(cskey.substring(2,));
        return;
    } else {
        recent_search_bible(cskey+(isreg?'(:r)':''));
    }
    
    var t0=performance.now();       
    var h2=-1;
    var h3=-1;
    csstartno=Math.max(0,parseInt(csstartno));

    var fav_list=fav_get_bible();
    var fav_pages='';
    if (cskey=='FAV' && csmax>=0){
        fav_pages=fav_pages+page_combination_b(fav_list.length,csmax,fav_start,'search_bible(\'FAV\',0,','fav_location_bible','word-break:break-all;word-wrap:break-word;',0,0,'','aclick');

        fav_list=fav_list.slice(fav_start-1,fav_start-1+csmax);
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
        if (item=='+FAV' || item=='-FAV'){continue;}
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
            if (exclude_fav){continue;}
            blstyle=' style="background-color:'+scheme_global['pink']+';"';
        } else {
            if (include_fav){continue;}
        }
        if (cskey=='FAV'){
            blfound=fav_list.has(blxl.toString());
        } else {
            blfound=str_reg_search_b([item,cnbible_global[blxl]],cskey,isreg);
            if (blfound==-1){break;}
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
        bljg=bljg+'<span class="oblong_box" onclick="search_bible(\'\','+continue_search_no+');">继续搜索('+continue_search_no+')</span> ';
    }
    if (csmax>=0 && blcount==csmax){
        bljg=bljg+'<span class="oblong_box" onclick="search_bible(\''+specialstr_j(cskey+(isreg?'(:r)':''))+'\',0,1,-1);">完全搜索</span> ';    
        bljg=bljg+'<span class="oblong_box" onclick="search_bible(\''+specialstr_j(cskey+(isreg?'(:r)':''))+'\',0,1,-1);break_line_bible(true);">完全搜索+断句+词频</span> ';
    } else {
        bljg=bljg+'<span class="oblong_box" onclick="break_line_bible(true);">断句+词频</span> ';    
    }
    bljg=bljg+'<span class="oblong_box" onclick="break_line_bible();">断句</span> ';    
    bljg=bljg+'<span class="oblong_box" onclick="search_statistics_bible();">Statistics</span> ';    
    
    if (cskey=='FAV'){
        bljg=bljg+'<span class="oblong_box" onclick="fav_export_import_form_bible();">FAV Import/Export</span> ';
    }
    bljg=bljg+'</p>';
    bljg=bljg+'<div id="div_search_statistics" style="margin:0.5rem;"></div>';
    document.getElementById('divhtml').innerHTML=bljg;
    document.getElementById('select_chapter').value='-1';
    document.getElementById('select_chapter_cn').value='-1';
    document.getElementById('select_sub').innerHTML='';
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#divhtml span.oblong_box'));

    if (klmenu_check_b('span_highlight_keys',false)){
        highlight_text_b(document.getElementById('input_bible_search').value,'div#divhtml p span.span_cn_content');
    }
    new_words_bible();
    console.log('search_bible 费时：'+(performance.now() - t0) + ' milliseconds');
}

function break_line_bible(check_frequency=false){
    var blkey=document.getElementById('input_bible_search').value.trim();
    var isreg=false;
    if (blkey.slice(-4,)=='(:r)'){
        isreg=true;
        blkey=blkey.substring(0,blkey.length-4);
    }    
    if (blkey=='' || current_search_no_global.length==0){return;}
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
    if (isreg){
        for (let blno of current_search_no_global){
            if (kjv[blno].match(blkey)!==null){
                result_t.push(kjv[blno].replace(new RegExp('('+blkey+')','g'),'\n$1'));
            }
            if (cnbible_global[blno].match(blkey)!==null){
                result_t.push(cnbible_global[blno].replace(new RegExp('('+blkey+')','g'),'\n$1'));
            }
        }
    } else {
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
    } else {
        for (let item of result_t){
            if (item.includes(blkey)){
                bljg.push(item);
            }        
        }
    }
    
    bljg.sort(function (a,b){return zh_sort_b(a,b);});
    var blbuttons='<p>';
    if (check_frequency==false){
        blbuttons=blbuttons+'<span class="aclick" onclick="word_frequency_bible(this);">词频</span>';    
    }
    blbuttons=blbuttons+close_button_b('div_search_statistics','');
    blbuttons=blbuttons+'</p>';
    var odiv=document.getElementById('div_search_statistics');
    odiv.innerHTML=array_2_li_b(bljg,'li','ol')+blbuttons;
    if (check_frequency){
        word_frequency_bible(false,true);
    } else {
        odiv.scrollIntoView();
    }
}

function word_frequency_bible(ospan=false,scroll_to_textarea=false){
    var odiv=document.getElementById('div_search_statistics');
    var olis=odiv.querySelectorAll('li');
    var result_t={};
    for (let item of olis){
        for (let blxl=2;blxl<=4;blxl++){
            var blstr=item.innerText.substring(0,blxl);
            if (blstr.length!==blxl){continue;}
            if (result_t[blstr]==undefined){
                result_t[blstr]=0;
            }
            result_t[blstr]=result_t[blstr]+1;
        }
    }
    if (ospan){
        ospan.parentNode.removeChild(ospan);
    }
    
    result_t=object2array_b(result_t,true);
    result_t.sort(function(a,b){return a[1]<b[1];});
    for (let blxl=0;blxl<result_t.length;blxl++){
        if (result_t[blxl][1]==1){
            result_t=result_t.slice(0,blxl);
            break;
        }
    }
    odiv.insertAdjacentHTML('beforeend','<textarea id="textarea_frequency_bible" style="height:20rem;">'+result_t+'</textarea>');
    if (scroll_to_textarea){
        document.getElementById('textarea_frequency_bible').scrollIntoView();
    }
}

function search_statistics_bible(cscolumn=-1,hidezero=false){
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
    } else {
        if (fav_desc_sort_global){
            result_t.sort(function (a,b){return a[cscolumn]>b[cscolumn];});
        } else {
            result_t.sort(function (a,b){return a[cscolumn]<b[cscolumn];});
        }    
    }

    fav_desc_sort_global=!fav_desc_sort_global;
    
    var bljg='<table class="table_zebra"><tr>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="search_statistics_bible(0,'+hidezero+');">No.</th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="search_statistics_bible(1,'+hidezero+');">EN</th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="search_statistics_bible(2,'+hidezero+');">CN</th>';
    bljg=bljg+'<th style="cursor:pointer;" onclick="search_statistics_bible(3,'+hidezero+');">Lines</th></tr>';
    for (let item of result_t){
        bljg=bljg+'<tr><td align=right>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td align=right>'+item[3]+'</td></tr>';
    }
    bljg=bljg+'</table>';
    bljg=bljg+'<p><span class="aclick" onclick="fav_desc_sort_global=!fav_desc_sort_global;search_statistics_bible('+cscolumn+','+!hidezero+');">'+(hidezero?'Show':'Hide')+' Zero</span></p>';
    document.getElementById('div_search_statistics').innerHTML=bljg;   
}

function fav_update_bible(){
    if (confirm('是否更新收藏？')){
        var list_t=array_unique_b(document.getElementById('textarea_fav_bible').value.trim().split('\n'));
        list_t=fav_sort_bible(list_t);
        fav_set_bible(list_t);
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
        } else {
            var endline=kjv.length-1;
        }
        result_t=result_t.concat(fav_one_book_bible(startline,endline));
    }
    console.log('fav_all_bible 费时：'+(performance.now() - t0) + ' milliseconds');
    
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
            aname.push('<option value="tr_'+blh2_en+'">'+blh2_en+' '+blh2_cn+'</option>');
        } else if (item[0].substring(0,4)=='=== ' && item[0].slice(-4,)==' ==='){
            result_t[blxl][0]='<h3>'+result_t[blxl][0].slice(4,-4)+'</h3>';
            result_t[blxl][1]='<h3>'+result_t[blxl][1].slice(4,-4)+'</h3>';
            trclass=' class="tr_head"';
        } else if (item[0]=='' && item[1]==''){
            result_t[blxl][0]='...';
            result_t[blxl][1]='...';
        }

        result_t[blxl]='<tr'+trclass+(result_t[blxl][2]==''?'':' id="'+result_t[blxl][2]+'"')+'><td class="td_fav_en" valign=top width=50%>'+item[0]+'</td><td class="td_fav_cn" valign=top width=50%>'+item[1]+'</td></tr>';
    }
    var bljg='<select style="max-width:20rem;" onchange="document.getElementById(this.value).scrollIntoView();">'+aname.join(' ')+'</select>';
    bljg=bljg+'<label><input type="checkbox" id="radio_type_en" onclick="fav_en_cn_bible();" checked>en</label> <label><input type="checkbox" id="radio_type_cn" onclick="fav_en_cn_bible();" checked>cn</label>';
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
    var fav_list=fav_get_bible();
    var result_t=[];
    var isdot=false;
    for (let blxl=startline;blxl<=endline;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,2)=='==' || fav_list.includes(blxl.toString())){
            result_t.push([item,cnbible_global[blxl]]);
            isdot=false;
        } else {
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
        } else {
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
    var fav_list=fav_get_bible();
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php?type=fav_lines_bible" name="form_fav_bible" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_fav_bible" id="textarea_fav_bible" style="height:20rem;">#'+fav_list.join('#\n#')+'#</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+close_button_b('div_search_statistics','')+' ';        
    bljg=bljg+'<span class="aclick" onclick="fav_update_bible();">Update</span> ';    
    bljg=bljg+'<span class="aclick" onclick="local_storage_view_form_b(\'\',\'div_search_statistics\');">查看 localStorage</span> ';

    bljg=bljg+textarea_buttons_b('textarea_fav_bible','清空,复制,发送到临时记事本,save as txt file');
    bljg=bljg+'<div id="div_word_temp" style="display:inline;">';
    bljg=bljg+textarea_buttons_b('textarea_fav_bible','发送地址','fav_lines_bible')+' 行数：'+fav_list.length+'</div>';
    bljg=bljg+'</p>';
    bljg=bljg+'</form>';
    document.getElementById('div_search_statistics').innerHTML=bljg;
}

function help_bible(){
    var bljg='<li><a href="?s=神">bible.htm?s=神</a></li>';
    bljg=bljg+'<li><a href="?s=+Joseph +Noah">bible.htm?s=+Joseph +Noah</a></li>';
    bljg=bljg+'<li><a href="?s=-Joseph +Noah">bible.htm?s=-Joseph +Noah</a></li>';
    bljg=bljg+'<li><a href="?s=Joseph Noah">bible.htm?s=Joseph Noah</a></li>';
    bljg=bljg+'<li><a href="?s=Joseph|Noah(:r)">bible.htm?s=Joseph|Noah(:r)</a></li>';
    bljg=bljg+'<li><a href="?s=耶稣&u=cn">bible.htm?s=耶稣&u=cn</a></li>';
    bljg=bljg+'<li><a href="?s=Jehovah&u=kjv">bible.htm?s=Jehovah&u=kjv</a></li>';
    bljg=bljg+'<li><a href="?b=启示录_2_5_9">bible.htm?b=启示录_2_5_9</a></li>';
    bljg=bljg+'<li><a href="?b=启_2_5_9">bible.htm?b=启_2_5_9</a></li>';
    bljg=bljg+'<li><a href="?b=rev3:4">bible.htm?b=rev3:4</a></li>';
    bljg=bljg+'<li><a href="?b=启2:4">bible.htm?b=启2:4</a></li>';
    bljg=bljg+'<li><a href="?b=启2:4">bible.htm?b=启2:4&alone</a></li>';
    
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
    //csstr=csstr.replace(/[:：\.\-]/g,'_').trim();
    csstr=csstr.replace(/(\d{1,})[：:](\d{1,})/g,'_$1_$2').trim();
    var rightstr=(csstr.match(/(\d+_)*(\d+)?$/g) || [''])[0].trim();    //rev3 或 rev3_4，返回 3 或 3_4 - 保留注释
    if (rightstr!==''){
        csstr=csstr.replace(/(\d+_)*(\d+)?$/g,'').trim()+'_'+rightstr;
    }
    while (csstr.includes('__')){
        csstr=csstr.replace(new RegExp('__','g'),'_');
    }    
    
    var book_no_list=csstr.split('_');
    var book_no=abbr_bible(book_no_list[0]);
    if (book_no<0){return;}
        
    document.getElementById('select_chapter').value=chapter_global[book_no][0];
    document.getElementById('select_chapter_cn').value=chapter_global[book_no][0];
    minor_options_bible(chapter_global[book_no][0],false);
    
    var found_sub=false;
    if (book_no_list.length>1){
        var osub_options=document.querySelectorAll('#select_sub option');
        for (let item of osub_options){
            if (item.innerText.trim()==book_no_list[1]){
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
            document.querySelector('#td_kjv_'+(start_td-1)+', #td_cn_'+(start_td-1)).scrollIntoView();
        } else {
            document.querySelector('#td_kjv_'+(start_td-1)+', #td_cn_'+start_td).scrollIntoView();        
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
                    okjv.style.backgroundColor=scheme_global['pink'];
                }
                if (ocn){
                    ocn.style.backgroundColor=scheme_global['skyblue'];
                }
            }
        } else {
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
    
    new_words_bible();
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
    ["The First Book of the Kings", "1st Kings", "1Ki", "列王纪上", "列王记上", "王上"],
    ["The Second Book of the Kings", "2nd Kings", "2Ki", "列王纪下", "列王记下", "王下"],
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
}

function rand_chapter_list_bible(){
    var chapters=read_get_bible(-1);
    var zero_no_t=[];
    for (let blxl=0;blxl<chapters.length;blxl++){
        if (chapters[blxl]=='0'){
            zero_no_t.push(blxl);
        }
    }
    
    var is_rand=true;
    if (zero_no_t.length==0){
        var rndchapter=parseInt(Math.random()*chapter_global.length);
    } else {
        zero_no_t.sort(randomsort_b);
        var item=zero_no_t[0];
        is_rand=chapter_sub_global[item];
        var rndchapter=row_no_2_chapter_index_no_bible(is_rand);
        
        //以下几行验证用 - 保留注释
        //for (let item of zero_no_t){
            //is_rand=chapter_sub_global[item];
            //var rndchapter=row_no_2_chapter_index_no_bible(is_rand);
            //console.log(rndchapter,chapter_global[rndchapter],is_rand,cnbible_global[is_rand]);
        //}
    }
    
    document.getElementById('select_chapter').value=chapter_global[rndchapter][0];
    document.getElementById('select_chapter_cn').value=chapter_global[rndchapter][0];
    minor_options_bible(chapter_global[rndchapter][0],is_rand);
}

function row_no_2_chapter_index_no_bible(csno){
    var blmain=-1;
    for (let blxl=1;blxl<chapter_global.length;blxl++){
        if (csno<chapter_global[blxl][0]){
            blmain=blxl-1;
            break;
        }
    }
    if (blmain==-1){
        blmain=chapter_global.length-1;
    }
    return blmain;
}

function main_with_sub_check_bible(){
    function sub_main_with_sub_check_bible_one(){
        var blkey='m_'+main_row_no;
        if (dict_t[blkey]==undefined){
            console.log('未发现key2 :'+blkey);
        } else if (dict_t[blkey].toString()!==sub_list.toString()){
            console.log('sub 不一致：', blkey,dict_t[blkey],sub_list);
        }    
    }
    //-----------------------
    //检验 main_with_sub_check_bible() 是否正确 - 保留注释
    var dict_t=main_with_sub_chapters_bible();
    var keys=Object.keys(dict_t);
    if (keys.length!==chapter_global.length){
        console.log('dict 元素个数错误');
    }
    
    for (let item of chapter_global){
        var blkey='m_'+item[0];
        if (dict_t[blkey]==undefined){
            console.log('未发现key1 :'+blkey);
            continue;
        }
    }


    var main_row_no=-1;
    var sub_list=[];
    for (let blxl=0;blxl<kjv.length;blxl++){
        if (kjv[blxl].substring(0,4)=='=== ' && kjv[blxl].slice(-4,)==' ==='){
            sub_list.push(blxl);
        } else if (kjv[blxl].substring(0,3)=='== ' && kjv[blxl].slice(-3,)==' =='){
            if (sub_list.length>0){
                sub_main_with_sub_check_bible_one();
            }
            main_row_no=blxl;
            sub_list=[];
        }
    }
    
    if (sub_list.length>0){
        sub_main_with_sub_check_bible_one();
    }
    
    console.log('检查完毕');
}

function main_with_sub_chapters_bible(main_line_no=false){
    var blend=-1;
    var line_no_list=[].concat(chapter_sub_global);
    var main_no_list=[];
    for (let item of chapter_global){
        line_no_list.push(item[0]);
        main_no_list.push(item[0]);
    }
    
    line_no_list.sort(function (a,b){return a>b;});
    
    if (main_line_no===false){
        var result_t={};
        for (let blxl=0;blxl<main_no_list.length-1;blxl++){
            var blat1=line_no_list.indexOf(main_no_list[blxl]);
            var blat2=line_no_list.indexOf(main_no_list[blxl+1]);
            result_t['m_'+main_no_list[blxl]]=line_no_list.slice(blat1+1,blat2);
        }    

        var blat1=line_no_list.indexOf(main_no_list[main_no_list.length-1]);
        result_t['m_'+main_no_list[main_no_list.length-1]]=line_no_list.slice(blat1+1,);
        return result_t;
    } else {
        main_line_no=parseInt(main_line_no);
        var blat1=line_no_list.indexOf(main_line_no);
    
        var blxl=main_no_list.indexOf(main_line_no);
        if (blxl<main_no_list.length-1){
            var blat2=line_no_list.indexOf(main_no_list[blxl+1]);        
            return line_no_list.slice(blat1+1,blat2);
        } else {
            return line_no_list.slice(blat1+1,);        
        }
    }
}

function minor_options_bible(csno=0,csrnd=false){
    if (csno==-1){
        document.getElementById('divhtml').innerHTML='';
        return;
    }
    if (kjv.length==0 || cnbible_global.length==0){return;}
    
    var item=kjv[csno];
    if (item.substring(0,3)!=='== ' || item.slice(-3,)!==' =='){return;}
    
    var line_no_list=main_with_sub_chapters_bible(csno);

    var enname=item.substring(3,item.length-3);
    var bljg='';
    for (let blxl of line_no_list){
        bljg=bljg+'<option value='+blxl+'>'+kjv[blxl].substring(4,kjv[blxl].length-4).replace(enname,'')+'</option>\n';
    }
    
    var osub=document.getElementById('select_sub');
    osub.innerHTML=bljg;
    document.getElementById('select_end_sub').innerHTML='<option value="-1"></option>'+bljg;
    
    if (line_no_list.length>0){
        if (csrnd===true){
            line_no_list.sort(randomsort_b);
        }
        if (csrnd===true || csrnd===false){
            csrnd=line_no_list[0];
        }
        osub.value=csrnd;
        chapter_one_bible(csrnd);
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
    var fav_list=array_unique_b(fav_get_bible(),true);
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
            } else {
                found3=true;
            }
            if (use_kjv_cn_global[0]){
                bljg=bljg+'<td width='+tdwidth+' valign=top><h3>'+kjv[blxl].substring(4,kjv[blxl].length-4)+'</h3></td>';
            }
            if (use_kjv_cn_global[1]){
                bljg=bljg+'<td width='+tdwidth+' valign=top><h3>'+cnbible_global[blxl].substring(4,cnbible_global[blxl].length-4)+'</h3></td>';
            }
        } else {
            var blstyle=(fav_list.has(blxl.toString())?' style="background-color:'+scheme_global['pink']+';"':'');
            [tdnum,enstr,cnstr]=number_bible(blxl,blstyle);
            if (use_kjv_cn_global[0]){
                bljg=bljg+'<td width='+tdwidth+' valign=top id="td_kjv_'+tdnum+'" class="td_kjv">'+enstr+'</td>';
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
        var oselect=document.getElementById('select_outside_links');
        var bljg=['<option></option>'];
        var book_no=line_no_2_book_no(startno);
        var chapter_no=parseInt(kjv[startno].replace(/^.*\s(\d+)\s===$/g,'$1'))-1;
        for (let key of web_sites_keys_bible()){
            bljg.push('<option value="'+book_no+','+chapter_no+','+key+'">'+key+'</option>');
        }
        oselect.innerHTML=bljg.join('\n');
    }
    
    var ospan=document.getElementById('span_is_readed_bible');
    if (startno==endno || endno==0){
        var is_readed=read_get_bible(startno);
        if (is_readed!==-1){
            ospan.innerText='⚪ 已读';
            if (is_readed=='1'){
                klmenu_check_b('span_is_readed_bible',true);
            }
        }
    } else {
        ospan.innerText='';
    }
    new_words_bible();
}

function read_all_unread_bible(){
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认设置全部章节未读') || '').trim()!==rndstr){return;} 
    localStorage.setItem('bible_chapter_readed','');
    alert('done');
}

function read_get_bible(line_no=-1){
    var chapters=local_storage_get_b('bible_chapter_readed').split('');
    if (chapters.length==''){
        chapters='0'.repeat(chapter_sub_global.length);
        localStorage.setItem('bible_chapter_readed',chapters);
        chapters=chapters.split('');
    }
    
    if (line_no==-1){
        return chapters;
    } else {
        var blno=current_sub_chapter_index_bible(line_no);
        if (blno==-1){
            return -1;
        } else {    
            return chapters[blno];
        }
    }
}

function read_set_bible(){
    var csvalue=(klmenu_check_b('span_is_readed_bible',true)?'1':'0');
    
    var blno=current_sub_chapter_index_bible();
    if (blno==-1){
        klmenu_check_b('span_is_readed_bible',true);
        return;
    }
    
    var chapters=read_get_bible(-1);
    chapters[blno]=csvalue;
    localStorage.setItem('bible_chapter_readed',chapters.join(''));    
}

function fav_init_bible(){
    var fav_list=array_unique_b(fav_get_bible());
    fav_list=fav_sort_bible(fav_list);
    fav_set_bible(fav_list);
}

function fav_add_bible(csno){
    csno=csno.toString();
    var ospan_en=document.getElementById('span_number_bible_en_'+csno);
    var ospan_cn=document.getElementById('span_number_bible_cn_'+csno);
    var fav_list=array_unique_b(fav_get_bible());
    var is_remove=false;
    if (ospan_en){
        if (ospan_en.style.backgroundColor==''){
            ospan_en.style.backgroundColor=scheme_global['pink'];
        } else {
            ospan_en.style.backgroundColor='';
            is_remove=true;
        }
    }
    if (ospan_cn){
        if (ospan_cn.style.backgroundColor==''){
            ospan_cn.style.backgroundColor=scheme_global['pink'];
        } else {
            ospan_cn.style.backgroundColor='';
            is_remove=true;
        }
    }
    
    var blat=fav_list.indexOf(csno);
    if (is_remove){
        if (blat>=0){
            fav_list.splice(blat,1);
            fav_set_bible(fav_list);
        }
    } else {
        if (blat==-1){
            fav_list.push(csno);
            fav_list=fav_sort_bible(fav_list);
            fav_set_bible(fav_list);
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
    var blstr_cn=cnbible_global[blxl];
    var blat2=blstr_cn.indexOf(' ');
    if (blat2>0){
        blnum2=blstr_cn.substring(0,blat2).trim();
    }
    if (blnum==blnum2){
        blstr_en=blstr_en.substring(blat+1,);
        blstr_en='<span class="span_number_bible" id="span_number_bible_en_'+blxl+'"'+blstyle+' onclick="fav_add_bible('+blxl+');">'+blnum+'</span> <span class="txt_content">'+blstr_en+'</span>';
        
        blstr_cn=blstr_cn.substring(blat2+1,);
        blstr_cn='<span class="span_number_bible" id="span_number_bible_cn_'+blxl+'"'+blstyle+' onclick="fav_add_bible('+blxl+');">'+blnum+'</span> <span class="span_cn_content">'+blstr_cn+'</span>';
        return [blnum,blstr_en,blstr_cn];
    } else {
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
        } else {
            chapter_one_bible(document.getElementById('select_sub').value,document.getElementById('select_end_sub').value);
        }
    }
}

function idb_read_bible(db,is_old=false){
    function sub_idb_read_bible_onsuccess(event){
        var cursor = event.target.result;
        if (cursor){
            if (cursor.value.type=='en'){
                en_list.push(cursor.value.text);
            } else if (cursor.value.type=='cn'){
                cn_list.push(cursor.value.text);
            }
            cursor.continue();
        } else {
            if (is_old){
                enbible_old_global=en_list;
                cnbible_old_global=cn_list;
            } else {
                kjv=en_list;
                cnbible_global=cn_list;
            }
        }
    }
    //-----------------------
    var en_list=[];
    var cn_list=[];    
    return new Promise((resolve, reject) => {
        idb_read_b(db,'bible_dbf',sub_idb_read_bible_onsuccess);
        resolve(true);
    });
}

function idb_count_bible(db){
    return new Promise((resolve, reject) => {
        var blcount=idb_count_b(db,'bible_dbf',false);
        resolve(blcount);
    });
}

function idb_write_bible(db,adddata=true){
    function sub_idb_write_bible_count1(cscount){
        document.getElementById('span_status').innerHTML='IDB 清除前记录数：'+cscount;
    }

    function sub_idb_write_bible_count2(cscount){
        document.getElementById('span_status').innerHTML='IDB 清除后记录数：'+cscount;
    }
    
    function sub_idb_write_bible_onsuccess(otable){
        if (!adddata){return;}

        for (let item of kjv){
            otable.add({type:'en',text: item});
        }
        for (let item of cnbible_global){
            otable.add({type:'cn',text: item});
        }

        var ocount3=otable.count();
        ocount3.onsuccess = function(){
            document.getElementById('span_status').innerHTML='IDB 添加后记录数：'+ocount3.result;
            console.log('添加后记录数：',ocount3.result);
        }
    }
    
    return new Promise((resolve, reject) => {
        idb_write_b(db,'bible_dbf',sub_idb_write_bible_count1,sub_idb_write_bible_count2,sub_idb_write_bible_onsuccess);
        resolve(true);
    });
}

function main_sub_chapter_var_generate_bible(){
    for (let blxl=0;blxl<kjv.length;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,3)=='== ' && item.slice(-3,)==' =='){
            chapter_global.push([blxl,item.substring(3,item.length-3),cnbible_global[blxl].substring(3,cnbible_global[blxl].length-3),0]);
        } else if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){  
            chapter_sub_global.push(blxl);
        }
    }
    
    var main_sub_dict=main_with_sub_chapters_bible();
    
    for (let blxl=0;blxl<chapter_global.length;blxl++){
        var blkey='m_'+chapter_global[blxl][0];
        if (main_sub_dict[blkey]==undefined){
            console.log('error',blkey);
        } else {
            chapter_global[blxl][3]=main_sub_dict[blkey].length;
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
        } else {
            console.log('load data from idb');
            document.getElementById('span_title').style.color=scheme_global['a'];
            init_bible();
        }
    }
    if (load_from_idb==false){ // is_local_b() - 保留注释
        console.log('load bible data from local js file');
        document.getElementById('span_title').style.color=scheme_global['color'];
        load_filelist_bible();
    } else {
        sub_load_data_bible_read();
    }
}

function load_filelist_bible(do_init=true){
    var today=(is_local_b()?'?'+today_str_b('d',''):'');
    var sele_path=klbase_sele_path_b()[1];
    document.write('\n<script src="'+sele_path+'/jsdoc3/bible_kjv_890.js'+today+'"><\/script>\n');
    console.log(sele_path+'/jsdoc3/bible_kjv_890.js'+today);
    
    document.write('<script>\n');
    document.write('kjv=[];\n');
    document.write('for (let item of filelist){\n');
    document.write('    kjv.push(item);\n');
    document.write('}\n');
    document.write('</script>\n');
    
    document.write('\n<script src="'+sele_path+'/jsdoc3/sheng_jing_he_he_ben_124338.js'+today+'"><\/script>\n');
    console.log(sele_path+'/jsdoc3/sheng_jing_he_he_ben_124338.js'+today);
    
    document.write('<script>\n');
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
    async function sub_idb_bible_switch(cstype, db, resolve, blcount, id_old){
        switch (cstype){
            case 'read':
                async function sub_idb_bible_read(){
                    console.log('sub_idb_bible_read()');
                    await idb_read_bible(db,is_old);
                    resolve(true);
                }
                sub_idb_bible_read();
                break;
            case 'write':
                async function sub_idb_bible_write(){
                    console.log('sub_idb_bible_write()');
                    await idb_write_bible(db);
                    resolve(true);
                }
                sub_idb_bible_write();
                break;
            case 'clear':
                async function sub_idb_bible_clear(){
                    console.log('sub_idb_bible_clear()');
                    await idb_write_bible(db,false);
                    resolve(true);
                }
                sub_idb_bible_clear();
                break;
            case 'count':
                async function sub_idb_bible_count(){
                    console.log('sub_idb_bible_count()');
                    blcount = await idb_count_bible(db);
                    document.getElementById('span_status').innerHTML='IDB 记录数：'+blcount;
                    resolve(blcount);
                }
                sub_idb_bible_count();
                break;
        }    
    }
    //-----------------------
    return new Promise((resolve, reject) => {
        var bljg=idb_main_b(cstype,'bible','bible_dbf',sub_idb_bible_switch,is_old);
        resolve(bljg);
    });
    //idb_bible('count').then(value => {console.log('行数：',value);});  //此行保留 - 保留注释
}

function web_stes_list_get_bible(website_name,book_no=-1){
   switch (website_name){
        case 'hkbs':
            var href_head='http://rcuv.hkbs.org.hk/RCUV1s/';
            break;        
        case 'ccctspm':
            website_name='hkbs';
            var href_head='http://bible.ccctspm.org/CUNP/'; //RCUV - 保留注释
            break;
        default:
            var href_head='';
    }
    
    if ((website_name in bible_web_sites_global) == false){
        return [website_name,'',[]];
    }
    var list_t=bible_web_sites_global[website_name];
    if (list_t.length!==chapter_global.length){
        return [website_name,'',[]];
    }
    if (book_no>=0 && book_no>=chapter_global.length){
        return [website_name,'',[]];
    }    
    return [website_name,href_head,list_t];
    
}

function web_sites_href_one_chapter_bible(website_name,book_no=0,chapter_no=0){
    var href_head='';
    var list_t=[];
    [website_name,href_head,list_t]=web_stes_list_get_bible(website_name,book_no);
    if (list_t.length==0){return '';}    
    
    var bljg='';
    switch (website_name){
        case 'shengjing_jidujiao_com':
            bljg='http://'+(ismobile_b()?'sj':'shengjing')+'.jidujiao.com/'+list_t[book_no]+(chapter_no+1)+'.html';
            break;
        case 'BibleGateway_CUVS':
            var BibleGateway_bookname=list_t[book_no].split('');
            for (let name_no=0;name_no<BibleGateway_bookname.length;name_no++){
                BibleGateway_bookname[name_no]=encodeURIComponent(BibleGateway_bookname[name_no]);
            }
            bljg='https://www.biblegateway.com/passage/?search='+BibleGateway_bookname.join('+')+'+'+(chapter_no+1)+'&version=CUVS';
            break;
        case 'BibleGateway_KJV':
            var BibleGateway_bookname=list_t[book_no];
            bljg='https://classic.biblegateway.com/passage/?search='+BibleGateway_bookname+'+'+(chapter_no+1)+'&version=KJV';
            break;
        case 'o-bible.com':
            bljg='http://www.o-bible.com/cgibin/ob.cgi?version=hgb&book='+list_t[book_no]+'&chapter='+(chapter_no+1);
            break;
        case 'o-bible.com_kjv':
            bljg='http://www.o-bible.com/cgibin/ob.cgi?version=kjv&book='+list_t[book_no]+'&chapter='+(chapter_no+1);
            break;
        case 'biblestudytools.com':
            bljg='https://www.biblestudytools.com/kjv/'+list_t[book_no]+'/'+(chapter_no+1)+'.html';
            break;
        case 'hkbs':
            bljg=href_head+list_t[book_no]+'/'+(chapter_no+1)+'/';        
            break;
        case 'wwbible':
            var blstr=encodeURIComponent('第'+NumberToChinese_b(chapter_no+1)+'章');
            bljg='https://www.wwbible.org/'+blstr+'-'+list_t[book_no][chapter_no];
            break;    
    }
    return bljg;
}

function web_sites_keys_bible(){
    var list_t=Object.keys(bible_web_sites_global);
    list_t.push('ccctspm');
    list_t.sort();
    return list_t;
}
function web_sites_href_list_bible(website_name){
    var href_head='';
    var list_t=[];
    [website_name,href_head,list_t]=web_stes_list_get_bible(website_name);
    if (list_t.length==0){return;}    
        
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
    var result_t=[];
    var blstyle='onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';"';
    switch (website_name){
        case 'shengjing_jidujiao_com':
            var blhttp=(ismobile_b()?'sj':'shengjing');
            for (let blxl=0;blxl<list_t.length;blxl++){
                result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][2]+'</h3>');
                for (let blno=0;blno<chapter_global[blxl][3];blno++){
                    result_t.push('<a class="a_oblong_box" '+blstyle+' href="http://'+blhttp+'.jidujiao.com/'+list_t[blxl]+(blno+1)+'.html" target=_blank>'+(blno+1)+'</a> ');
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
                    result_t.push('<a class="a_oblong_box" '+blstyle+' href="https://www.biblegateway.com/passage/?search='+BibleGateway_bookname.join('+')+'+'+(blno+1)+'&version=CUVS" target=_blank>'+(blno+1)+'</a> ');
                }
            }                
            break;
        case 'BibleGateway_KJV':
            for (let blxl=0;blxl<list_t.length;blxl++){
                result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][1]+'</h3>');
                var BibleGateway_bookname=list_t[blxl];
                for (let blno=0;blno<chapter_global[blxl][3];blno++){
                    result_t.push('<a class="a_oblong_box" '+blstyle+' href="https://www.biblegateway.com/passage/?search='+BibleGateway_bookname+'+'+(blno+1)+'&version=KJV" target=_blank>'+(blno+1)+'</a> ');
                }
            }
            break;
        case 'o-bible.com':
        case 'o-bible.com_kjv':
            for (let blxl=0;blxl<list_t.length;blxl++){
                result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][blen_cn]+'</h3>');                    
                for (let blno=0;blno<chapter_global[blxl][3];blno++){
                    result_t.push('<a class="a_oblong_box" '+blstyle+' href="http://www.o-bible.com/cgibin/ob.cgi?version='+blver+'&book='+list_t[blxl]+'&chapter='+(blno+1)+'" target=_blank>'+(blno+1)+'</a> ');
                }
            }
            break;
        case 'biblestudytools.com':
            for (let blxl=0;blxl<list_t.length;blxl++){
                result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][1]+'</h3>');                    
                for (let blno=0;blno<chapter_global[blxl][3];blno++){
                    result_t.push('<a class="a_oblong_box" '+blstyle+' href="https://www.biblestudytools.com/kjv/'+list_t[blxl]+'/'+(blno+1)+'.html" target=_blank>'+(blno+1)+'</a> ');
                }
            }
            break;    
        case 'hkbs':
            for (let blxl=0;blxl<list_t.length;blxl++){
                result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][2]+'</h3>');                    
                for (let blno=0;blno<chapter_global[blxl][3];blno++){
                    result_t.push('<a class="a_oblong_box" '+blstyle+' href="'+href_head+list_t[blxl]+'/'+(blno+1)+'/" target=_blank>'+(blno+1)+'</a> ');
                }
            }        
            break;
        case 'wwbible':
            for (let blxl=0;blxl<list_t.length;blxl++){
                result_t.push('<h3>'+(blxl+1)+'. '+chapter_global[blxl][2]+'</h3>');                    
                for (let blno=0;blno<list_t[blxl].length;blno++){
                    var blstr=encodeURIComponent('第'+NumberToChinese_b(blno+1)+'章');
                    result_t.push('<a class="a_oblong_box" '+blstyle+' href="https://www.wwbible.org/'+blstr+'-'+list_t[blxl][blno]+'" target=_blank>'+(blno+1)+'</a> ');
                }
            }
            break;            
    }

    document.getElementById('divhtml').innerHTML='<h3 style="margin:0.5rem;">'+website_name+'</h3><div style="margin:0.5rem;column-count:4;line-height:'+(ismobile_b()?'180':'220')+'%;">'+result_t.join('\n')+'</div>';
}

function chapter_all_check_bible(){
    //检验 chapter_all_bible() 是否正确 - 保留注释

    var result_t=[];
    var main_chapter=-1;
    var main_no=1;
    var chapters=read_get_bible(-1);

    var sub_no=0;
    for (let blxl=0;blxl<kjv.length;blxl++){
        var item=kjv[blxl];
        if (item.substring(0,3)=='== ' && item.slice(-3,)==' =='){
            main_chapter=blxl;
            result_t.push('<h3 style="cursor:pointer;" onclick="chapter_go_bible('+main_chapter+','+blxl+');">'+main_no+'. '+item.slice(3,-3)+' '+cnbible_global[blxl].slice(3,-3)+'</h3>');
            main_no=main_no+1;
        } else if (item.substring(0,4)=='=== ' && item.slice(-4,)==' ==='){
            var bgcolor=(chapters[sub_no]=='1'?' style="background-color:pink;"':'');
            result_t.push('<span class="oblong_box"'+bgcolor+' onclick="chapter_go_bible('+main_chapter+','+blxl+');">'+item.replace(/.*?\s*(\d*)\s*===$/g,'$1')+'</span> ');
            sub_no=sub_no+1;
        }
    }     
    
    var result2_t=chapter_all_bible(true);
    
    console.log(result_t);
    console.log(result2_t);
    if (result_t.length==result2_t.length){
        console.log('行数：一致');
        var content_error=false;
        for (let blxl=0;blxl<result_t.length;blxl++){
            if (result_t[blxl]==result2_t[blxl]){continue;}
            console.log('内容：不一致',blxl,result_t[blxl], result2_t[blxl]);        
            content_error=true;    
        }
        if (content_error===false){
            console.log('内容：一致');                    
        }
    } else {
        console.log('行数：不一致');    
    }
}

function chapter_all_bible(only_check=false){
    var result_t=[];
    var main_chapter=-1;
    var main_no=1;
    var chapters=read_get_bible(-1);

    var sub_no=0;
    var main_sub_dict=main_with_sub_chapters_bible();
    for (let key in main_sub_dict){
        main_chapter=parseInt(key.substring(2,));
        var item=kjv[main_chapter];
        result_t.push('<h3 style="cursor:pointer;" onclick="chapter_go_bible('+main_chapter+','+main_chapter+');">'+main_no+'. '+item.slice(3,-3)+' '+cnbible_global[main_chapter].slice(3,-3)+'</h3>');
        main_no=main_no+1;
        
        var sub_list=main_sub_dict[key];
        for (let blno of sub_list){
            var item=kjv[blno];
            var bgcolor=(chapters[sub_no]=='1'?' style="background-color:pink;"':'');
            result_t.push('<span class="oblong_box"'+bgcolor+' onclick="chapter_go_bible('+main_chapter+','+blno+');" title="全书第 '+(sub_no+1)+' 章">'+item.replace(/.*?\s*(\d*)\s*===$/g,'$1')+'</span> ');
            sub_no=sub_no+1;      
        }
    }
    
    if (only_check){
        return result_t;
    }
        
    var buttons='<p><a class="aclick" href="lsm.htm?key=bible_chapter_readed" target=_blank>导出已读状态</a><span class="aclick" onclick="read_all_unread_bible();">全部设置为未读</span></p>';
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='<div style="margin:0.5rem;column-count:4;line-height:'+(ismobile_b()?'180':'220')+'%;">'+result_t.join('\n')+'</div>'+buttons;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
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

function web_site_open_bible(csstr){
    var blat=csstr.indexOf(',');
    if (blat<0){return;}
    var book_no=csstr.substring(0,blat);
    csstr=csstr.substring(blat+1,);
    
    blat=csstr.indexOf(',');
    if (blat<0){return;}
    var chapter_no=csstr.substring(0,blat);
    csstr=csstr.substring(blat+1,);    
    var href=web_sites_href_one_chapter_bible(csstr,parseInt(book_no),parseInt(chapter_no));
    if (!href==''){
        window.open(href);
    }
}
