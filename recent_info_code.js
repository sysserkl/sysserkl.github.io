function args_klrecent(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0){
        if (cskeys[0]!==''){
            current_datafile_rct_global='archived/'+cskeys[0]+'.js';
            is_default_rct_global=false;
            document.title=cskeys[0];//+' - Info';            
        }
        else {
            if (recent_info_title_global[0].length>=3 && recent_info_title_global[0][1]!==""){
                document.title=recent_info_title_global[0][1];
            }
            else {
                document.title=recent_info_title_global[0][0];
            }
        }
    }

    for (let item of cskeys){
        if (item.substring(0,10)=='font-size='){
            headline_size_rct_global=item.substring(10,);
        }
        else if (item.substring(0,5)=='menu='){
            showmenu_rct_global=(item.substring(5,).trim()=='1');
        }        
    }
}

function init_klrecent(){
    if (recent_info_list.length==0){
        //纯荧光字 - 保留注释
        big_title_klrecent();
    }

    if (current_datafile_rct_global!==default_datafile_rct_global){
        if (recent_info_list.length>0){
            let list_t=current_datafile_rct_global.split('/');
            if (list_t.length>0){
                document.getElementById('span_title').innerText=list_t[1].split('.')[0];
            }
        }
        else {
            //current_datafile_rct_global='archived/'+cskeys[0]+'.js'; - 保留注释
            document.getElementById('span_title').innerText=current_datafile_rct_global.substring(current_datafile_rct_global.indexOf('/')+1,current_datafile_rct_global.length-3);
        }
    }
    else {
        document.getElementById('span_title').innerText=recent_info_title_global[0][0];
    }

    recent_info_list.reverse();
    var bljg=search_klrecent('',false);
    var blinput='';
    if (recent_info_list.length>10){
        blinput='<p style="margin-left:2rem;"><input type="text" id="input_search" placeholder="search" onkeyup="javascript:if (event.key==\'Enter\'){search_klrecent(this.value,true);}"/></p>\n<div id="div_recent_search" style="font-size:1rem;line-height:2rem;margin-left:2rem;margin-top:0.5rem;"></div>';
    }
    
    var blquote='';
    if (current_datafile_rct_global==default_datafile_rct_global){
        blquote=quotestr_klrecent(quote31_global[theday_rct_global-1])+quotestr_klrecent(bible31_global[theday_rct_global-1]);
    }

    //history
    //0.0.6-20200310 增加目录
    //0.0.5-20200304 增加唯一编号 a name 跳转
    //0.0.4-20190618
    //0.0.3-20190402
    //0.0.2-20190320
    //0.0.1-20190318
    //
    if (bljg+blquote!==''){
        if (is_default_rct_global){
            var odiv=document.getElementById('divhtml');
            odiv.innerHTML=blinput+'<div id="div_rct_content">'+bljg+'</div>'+blquote+more_tools_klrecent()+'<p align=center>('+recent_info_list.length+') <span style="cursor:pointer;" onclick="javascript:alert(navigator.userAgent);">ver: 0.0.6-20200310</span> <span onclick="javascript:history_klrecent();" style="cursor:pointer;color:blue;">Title History</span></p>';
            mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
        }
        else {
            document.getElementById('divhtml').innerHTML=blinput+'<div id="div_rct_content">'+bljg+'</div>';
        }
        title_klrecent(location.href);
    }
    input_with_x_b('input_search',17.5);
    recent_search_b('recent_search_recent_info','','search_klrecent','div_recent_search',[],20,false);
    
    if (recent_info_list.length>0){
        top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.85rem':'2rem'));
    }
}

function style_klrecent(){
    document.write('\n<style>\n');
    if (ismobile_b()){
        document.write('div.link_title .span_a_article_title_b{font-size:1.5rem;}\n');
        document.write('div.link_title br{margin-top:1.5rem;margin-bottom:1.5rem;}\n');
        document.write('div.link_title p{line-height:2.1rem;margin-top:1.5rem;margin-bottom:1.5rem;}\n');
        document.write('div.link_title table{font-size:1.2rem;}\n');
        document.write('div.div_columns_rct{column-count:1;}\n');
        document.write('.headline_on{font-size:1.4rem;}\n');
    }
    else {
        document.write('div.link_title .span_a_article_title_b{font-size:2.15rem;}\n');
        document.write('div.link_title br{margin-top:1rem;margin-bottom:1rem;}\n');
        document.write('div.link_title p{line-height:180%;margin-top:1rem;margin-bottom:1rem;}\n');
        document.write('div.link_title table{font-size:1.2rem;}\n');
        document.write('div.div_columns_rct{column-count:2;}\n');
        document.write('.headline_on{font-size:2.4rem;}\n');
    }
    document.write('div.div_columns_rct a{font-size:1.2rem}\n');
    document.write('div.link_title li{margin-bottom:0.25rem;margin-left:2rem;}\n');
    document.write('div.link_title table br{margin-top:0rem;margin-bottom:0rem;}\n');
    document.write('<\/style>\n');
}

function quotestr_klrecent(list_t){
    var blquote='';
    for (let item of list_t){
        blquote=blquote+'<p style="font-size:1.25rem;color:black;">'+item+'</p>';
    }
    blquote='<div class="link_title">'+blquote+'</div>';
    return blquote;
}

function history_klrecent(){
    var bljg='';
    for (let item of recent_info_title_global){
        var str_t='';
        for (let acol of item){
            str_t=str_t+' '+acol;
        }
        bljg=bljg+div_title_href_b(['',str_t],false,true);
    }
    document.getElementById('divhtml').innerHTML=bljg+'<p align=center>('+recent_info_title_global.length+')</p>'; 
}

function more_tools_klrecent(){
    var tools=[
    ['html/bible.htm', 'Bible'],
    ['html/calculator.htm','➕➖❌➗'],
    ['html/calendar.htm', 'Calendar'],
    ['html/code_links.htm','随机编程知识点'],
    ['html/digest.htm', 'Digest'],
    ['html/emoji.htm','emoji'],
    ['html/fortune_500.htm','Fortune 500'],    
    ['html/gps_https.htm', 'Coords'],
    ['html/gps_news.htm', 'gps news'],        
    ['html/gps_points.htm', 'gps points'],    
    ['html/hzpinyin.htm', 'hzpy'],
    ['html/image2base64.htm','image2base64'],
    ['html/klsearch.htm','KL Search'],
    ['html/long_term_plans.htm','Long Term Plans'],
    ['html/lsm.htm','LSM'],    
    ['html/memo.htm','Memo'],    
    ['html/mine.htm','Mine'],
    ['html/money_plan.htm', 'Money Plan'],
    ['html/poker24.htm','24'],
    ['html/proofreader.htm','proofreader'],    
    ['html/qrcode.htm','QR'],
    ['html/qrimg.htm','qrimg'],
    ['html/qs_university_asia.htm','QS University Asia'],        
    ['html/reader_card.htm', 'reader card'],
    ['html/reader.htm', 'reader'],
    ['html/reader_idb.htm','reader idb'],    
    ['html/rnd_english_words.htm', '随机单词'],
    ['html/routines.htm', 'routines'],
    ['html/screen_clock.htm','Clock'],
    ['html/screen_colorful_boxes.htm','screen colorful boxes'],
    ['html/screen_color_picker.htm','screen color picker'],    
    ['html/screen_matrix.htm', 'Matrix'],
    ['html/screen_test.htm', 'Screen Test'],
    ['html/society_data_analyze.htm','sda'],    
    ['html/sticker_mobile.htm','Sticker Mobile'],
    ['html/sudoku.htm', 'Sudoku'],
    ['html/symbols.htm', 'Symbols'],
    ['html/tetris.htm','Tetris'],
    ['html/todolist.htm', 'ToDoList'],
    ['html/txtlistsearch.htm', 'txtlistsearch'],
    ['html/websites_pwa.htm', 'Websites for PWA'],
    ['html/wp_offline_luru.htm', 'wp offline'],
    ['html/zj_college_search.htm','浙江高考分数'],    
    ['html/zj_company.htm','浙江企业'],    
    ['index.htm', '更多资讯'],

    ];
    tools.sort(function (a,b){return a[1].toLowerCase()>b[1].toLowerCase();});
    var bljg='<p style="line-height:2.4rem;">';
    for (let item of tools){
        bljg=bljg+'<a class="a_oblong_box" href="'+item[0]+'" target=_blank>'+item[1]+'</a> ';
    }
    bljg=bljg+'<span class="oblong_box" onclick="javascript:pwa_clear_cache_all_b();">Clear PWA Cache</span> ';
    bljg=bljg+'<span class="oblong_box" onclick="javascript:local_storage_view_form_b(\'\',\'div_localstorage\');">查看 localStorage(全部)</span> ';
    bljg=bljg+'<span class="oblong_box" onclick="javascript:local_storage_view_form_b(\'PIM\',\'div_localstorage\');">查看 localStorage(PIM系列)</span> ';    
    bljg=bljg+'</p>';
    bljg=bljg+'<div id="div_localstorage" style="margin-top:0.5rem;"></div>';
    return div_title_href_b(['','Tools:',bljg],false,true);
}

function big_title_klrecent(){
    let otable=document.getElementById('table_title');
    otable.style.cssText="width:100%;height: 100%;background-color:black;";
    document.querySelector('body').style.cssText="margin:0px;";
    otable.querySelector('td').align="center";
    otable.querySelector('td').valign="center";
    otable.querySelector('h2').style.cssText="";
    otable.querySelector('#span_title').style.cssText="font-size:"+headline_size_rct_global+"rem;border-radius: 0rem;";
}

function search_klrecent(cskey='',showhtml=true){
    var bljg=[];
    var bljgtop=[];
    var title_list=[];

    recent_search_b('recent_search_recent_info',cskey,'search_klrecent','div_recent_search',[],20,false);
    
    var oinput=document.getElementById('input_search');
    if (oinput){
        oinput.value=cskey;
    }
    var isreg=false;
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.slice(0,-4);
    }

    var a_name_list=[];
    var a_name_asc='';
    var tablewidth=(ismobile_b()?'100%':'80%');
    var blxl=0;
    for (let item of recent_info_list){
        if (cskey!==''){
            var blfound=str_reg_search_b(item,cskey,isreg);
            if (blfound==-1){
                break;
            }
            if (blfound===false){continue;}
        }
        //if (bljg.includes(item[0]) && item[0]!==""){continue;} //暂时保留 - 保留注释

        a_name_asc=div_title_href_id_b(item,a_name_list);
        a_name_list.push(a_name_asc);
        if (item[1]!==''){
            title_list.push([item[1],a_name_asc]);
        }
        else if (item[0]!==''){
            title_list.push([item[0],a_name_asc]);
        }
        else if (item[2]!=='') {
            title_list.push([item[2].substring(0,20),a_name_asc]);
        }
        
        item[2]=wiki_table_b(item[2],'width='+tablewidth+' cellspacing=0 cellpadding=0 style="margin-top:0.5rem;margin-bottom:2rem;"','style="padding:0.2rem;border-bottom:0.1rem solid '+scheme_global['color']+';"','style="padding:0.2rem;border-bottom:0.2rem solid '+scheme_global['color']+';"');
        var blstr=div_title_href_b(item,false,true,a_name_asc,'title_klrecent');
        if (item[1].substring(0,4)=='[置顶]'){
            item[1]='📢 '+item[1].substring(4,);
            bljgtop.push(blstr);
        }
        else {
            bljg.push(blstr);
        }
        blxl=blxl+1;
        if (blxl>=10000){
            bljg.push(div_title_href_b(['','...超长省略...'],false,true,a_name_asc,'title_klrecent'));
            break;
        }
    }
    
    var result_str=menu_klrecent(title_list)+bljgtop.join('\n')+bljg.join('\n');
    if (showhtml){
        var odiv=document.getElementById('div_rct_content');
        if (odiv){
            odiv.innerHTML=result_str;
        }
    }
    return result_str;
}

function menu_klrecent(title_list){
    if (showmenu_rct_global===false){return '';}
    var menu_t=[];
    var blxl=1;
    for (let item of title_list){
        menu_t.push('<p style="font-size:1.05rem;line-height:1.35rem;margin:0.3rem 0;">'+blxl+'. <a href="#'+item[1]+'"'+(blxl%2==0?' style="background-color:'+scheme_global['button']+';':'')+'" onclick="javascript:this.style.backgroundColor=\''+scheme_global["pink"]+'\';">'+item[0]+'</a></p>');
        blxl=blxl+1;
    }
    if (menu_t.length>0){
        return div_title_href_b(['','<span class="span_link" style="font-weight:bold;" onclick="javascript:popup_show_hide_b(\'div_menu_rct\');">Menu</span>','<div id="div_menu_rct" style="display:block;">'+menu_t.join('\n')+'</div>'],false,false,'','',true);
    }
    else {
        return '';
    }
}

function title_klrecent(cshref){
    if (!cshref){return;}
    if (!cshref.includes('#')){return;}
    cshref=cshref.substring(cshref.lastIndexOf('#')+1,).trim();
    
    var a_name_list=[];
    var a_name_asc='';
    for (let item of recent_info_list){
        a_name_asc=div_title_href_id_b(item,a_name_list);
        a_name_list.push(a_name_asc);
        if (a_name_asc==cshref){
            document.title=item[1];
            break;
        }
    }
}
