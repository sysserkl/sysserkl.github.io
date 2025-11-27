function mobile_style_klsnews_b(){
    var mobile_t=[
    '#divhtml {margin:0px 0.5rem;}',
    'sup.sup_sele_en {font-size:0.2rem;color:black;border-bottom:0.3rem #92addb solid;}',
    ];
    
	var pc_t=[
    '#divhtml {margin-left:'+(parseInt(document.body.clientWidth)*0.5)/2+'px; max-width:'+Math.max(700,(parseInt(document.body.clientWidth)*0.5))+'px;}',
    'sup.sup_sele_en {font-size:0.8rem;color:black;border-bottom:3px #92addb solid;}',
    ];
	mobile_style_b(mobile_t, pc_t);
}

function sentence_new_words_klsnews_b(){
    var do_translate=checkbox_kl_value_b('input_show_new_words');
    if (!do_translate===true){return;}
    
    var ospans=document.querySelectorAll('span.span_content');
    var list_t=[];
    for (let item of ospans){
        list_t.push(item.innerText);
    }
    get_new_words_arr_obj_enbook_b(2,list_t.join('\n'),ospans,true,true,'sentence_check_link_and_style_klsnews_b()');
}

function sentence_check_link_and_style_klsnews_b(){
    var ospans=document.querySelectorAll('span.span_content');
    for (let item of ospans){
        var oa=item.querySelector('a.a_news_link');
        if (oa){
            if (oa.innerText==''){
                oa.innerText='(link)';
            }
        }
    }
    masonrydiv_klsnews_b();
}

function sites_compare_sort_klsnews_b(sort_type){
    sites_compare_list_isdesc=!sites_compare_list_isdesc;
    sort_type=Math.min(3,Math.max(0,parseInt(sort_type)));
    if (sort_type==0){
        sites_compare_list_global.sort(function (a,b){return zh_sort_b(a,b,sites_compare_list_isdesc,0);});
    } else {
        if (sites_compare_list_isdesc){
            sites_compare_list_global.sort(function (a,b){return b[sort_type]>a[sort_type] ? 1 : -1;});
        } else {
            sites_compare_list_global.sort(function (a,b){return a[sort_type]>b[sort_type] ? 1 : -1;});
        }
    }

    var bljg='';
    for (let blxl=0,lent=sites_compare_list_global.length;blxl<lent;blxl++){
        bljg=bljg+'<tr class="odd">';
        var foundname=false;
        for (let www of sites_all_global){
            if (www[1]==sites_compare_list_global[blxl][0]){
                bljg=bljg+'<td class="blackline1">'+(blxl+1)+'. <a href="'+www[0]+'" target=_blank>'+sites_compare_list_global[blxl][0]+'</a></td>';
                foundname=true;
                break;
            }
        }
        if (foundname==false){
            bljg=bljg+'<td class="blackline1">'+(blxl+1)+'. '+sites_compare_list_global[blxl][0]+'</td>';
        }
        bljg=bljg+'<td align=right class="blackline1">'+sites_compare_list_global[blxl][1]+'</td>';
        bljg=bljg+'<td align=right class="blackline1">'+sites_compare_list_global[blxl][2]+'</td>';
        bljg=bljg+'</tr>\n';
    }
    if (bljg!==''){
        bljg='<h3>网站更新频率</h3>\n<table>\n<tr><th class="blackline2" onclick="sites_compare_sort_klsnews_b(0);">网站</th><th class="blackline2" onclick="sites_compare_sort_klsnews_b(1);">更新次数</th><th class="blackline2" onclick="sites_compare_sort_klsnews_b(2);">更新条数</th></tr>\n'+bljg+'</table>\n';
    }
    document.getElementById('td_sites_compare').innerHTML=bljg;
}

function sites_compare_klsnews_b(csdays,sort_type=2){
    if (sites_all_global.length==0 || site_exist_global.length==0 || csdays==0){
        return;
    }
    var odiv=document.getElementById('divhtml');
    var bljg='';
    var list_0=[];
    if (site_exist_global.length>0){
        for (let item_t of site_exist_global){
            if (item_t.length<3){continue;}
            list_0.push(item_t[0]);
        }
    }
    var list_all0=[];
    for (let item_t of sites_all_global){
        list_all0.push(item_t[1]);
    }
    
    var result_t=array_difference_b(list_all0,list_0);
    result_t.sort(function (a,b){return zh_sort_b(a,b);});
    for (let item_t of result_t){
        for (let www of sites_all_global){
            if (item_t==www[1]){
                bljg=bljg+'<li><a href="'+www[0]+'" target=_blank>'+www[1]+'</a></li>\n';
            }
        }
    }
    if (bljg!==''){
        bljg='<h3>最近'+csdays+'天未更新的网站</h3><ol>'+bljg+'</ol>';
    }

    var statistics_t=[];

    for (let item_t of site_exist_global){
        if (item_t.length<3){continue;}
        if (statistics_t[item_t[0]]==undefined){
            statistics_t[item_t[0]]=[item_t[0],0,0];
        }
        statistics_t[item_t[0]][1]=statistics_t[item_t[0]][1]+1;
        statistics_t[item_t[0]][2]=statistics_t[item_t[0]][2]+item_t[2];
    }
    
    sites_compare_list_global=[];
    for (let key in statistics_t){
        sites_compare_list_global.push(statistics_t[key]);
    }
    
    odiv.innerHTML='<table cellpadding="10" style="margin-top:0.5rem;"><tr><td valign=top>'+bljg+'</td><td valign=top id="td_sites_compare"></td></tr></table>';
    sites_compare_sort_klsnews_b(sort_type);
}

function sort_keys_klsnews_b(){
    var focus_list=[];
    var otextarea=document.getElementById('textarea_selenium_keywords');
    if (otextarea){
        focus_list=otextarea.value.split(',');
    }
    focus_list = array_unique_b(focus_list);
    focus_list.sort();
    return focus_list;
}

function newwords_klsnews_b(){
    var odiv=document.getElementById('div_newwords_klsnews');
    if (odiv.innerHTML!==''){
        odiv.innerHTML='';
        return;
    }
    var enwords_temp=[];
    for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
        enwords_temp.push(enwords[blxl][0].toLowerCase());
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'d');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'ed');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'s');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'es');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'ing');
    }

    var bljg=[];
    for (let item of sourcelist){
	    bljg.push(item[1]);
    }
    var list_t=bljg.join(' ').match(/\b[a-zA-Z\-]+\b/g) || [];
    var list2_t={};
    for (let item of list_t){
        item=item.toLowerCase();
        if (item.length<=1){continue;}
        if (enwords_temp.includes(item)){continue;}
        if (list2_t['k_'+item]==undefined){
            list2_t['k_'+item]=[item,0];
        }
        list2_t['k_'+item][1]=list2_t['k_'+item][1]+1;
    }
    
    var list_t=object2array_b(list2_t);

    list_t.sort(function (a,b){return b[1]>a[1] ? 1 : -1;});
    var blxl=0;
    var bljg=[];
    for (let item of list_t){
        bljg.push(item[0]+' ('+item[1]+')');
        blxl=blxl+1;
        if (blxl>300){break;}
    }
    var blbutton='<p>'+close_button_b('div_newwords_klsnews','')+'</p>';
    odiv.innerHTML='<p style="font-size:1rem;">'+bljg.join(' ')+'</p>'+blbutton;
}

function statistics_sites_klsnews_b(){
    var odiv=document.getElementById('div_sitesname');
    if (odiv.innerHTML!==''){
        odiv.innerHTML='';
        return;
    }
    var sites_count_t=[];
    for (let item of sourcelist){
        var site_name_t=item[3];
        if (sites_count_t['s_'+site_name_t]==undefined){
             sites_count_t['s_'+site_name_t]=[site_name_t,0];
        }
        sites_count_t['s_'+site_name_t][1]=sites_count_t['s_'+site_name_t][1]+1;
    }
    sites_count_t=object2array_b(sites_count_t);    
    sites_count_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    
    var bljg='0. <span onclick=\'getlines_klsnews_b();\' style="cursor:pointer;">全部</span>('+sourcelist.length+') ';
    for (let blxl=0,lent=sites_count_t.length;blxl<lent;blxl++){
        var item=sites_count_t[blxl];
        bljg=bljg+(parseInt(blxl)+1)+'. <span onclick=\'getlines_klsnews_b("'+item[0]+'",1,50);\' style="cursor:pointer;">'+item[0]+'</span>('+item[1]+') ';
    }
    odiv.innerHTML='<p>'+bljg+'</p>';
}

function showhide_klsnews_b(){
	var odiv=document.getElementById('div_show_hide');
	if (odiv.style.display=='none'){
        odiv.style.display='block';
    } else {
        odiv.style.display='none';
    }
}

function open_all_more_klsnews_b(){
    var oas=document.querySelectorAll('p[id^="p_more_"] span.span_link');
    for (let blxl=0,lent=oas.length;blxl<lent;blxl++){
        oas[blxl].click();
    }
}

function weibo_at_klsnews_b(cssite,csstr){
    if (cssite.includes('weibo.com')){
        csstr=csstr.replace(/@([^# 【】《》@]+?)([：: ，])/g,'<a href="http://weibo.com/n/$1" target=_blank>@$1</a>$2');
        
        csstr=csstr.replace(/(\s?)(https?:\/\/t\.cn\/[^\s]*)(\s?)/g,'$1<a href="$2" target=_blank>$2</a>$3');

        csstr=csstr.replace(/#([^@【】《》#]+?)#/g,'<a href="https://s.weibo.com/weibo?q=%23$1%23" target=_blank>#$1#</a>');
        
        csstr=csstr.replace(/《([^#@《》]+?)》/g,'<b>《$1》</b>');
        csstr=csstr.replace(/【([^#@【】]+?)】/g,'<b>【$1】</b>');     
        csstr=csstr.replace(new RegExp('O网页链接','g'),' ');
        csstr=csstr.replace(new RegExp('展开全文c','g'),' ');
        csstr=csstr.replace(/\d+  \d+ ñ\d+/g,' ');
        csstr=csstr.replace(/^(\d?\d?:?\d?\d?)\s?来自 (微博 weibo.com|iPhone 6s|[^\s]*\s)/g,'$1 ');
    }
    return csstr;
}

function longtxts_klsnews_b(cslist,addsitename=false){
    var str_t='<span class="span_content"><a href="'+cslist[0]+'" target=_blank style="text-decoration:none;" title="'+cslist[2]+' '+cslist[0]+'" class="a_news_link" onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';">';
    
    var title_t=specialstr_lt_gt_j(cslist[1].trim());
    //替换英文字母边的中文引号为英文引号 - 保留注释
    title_t=title_t.replace(/([a-zA-Z])’/g,'$1&#39;');
    title_t=title_t.replace(/‘([a-zA-Z])/g,'&#39;$1');
    if (title_t.length>150 || cslist[0].includes('://weibo.com/')){
        var at_t=title_t.indexOf(' ');
        if (at_t<=10){
            at_t=15;
        }
        str_t=str_t+title_t.substring(0,at_t);
        str_t=str_t+'</a>';
        str_t=str_t+weibo_at_klsnews_b(cslist[0], title_t.substring(at_t,));
        if (addsitename){
            str_t=str_t+' - '+cslist[3];
        }
    } else {
        str_t=str_t+title_t;
        if (addsitename){
            str_t=str_t+' - '+cslist[3];
        }        
        str_t=str_t+'</a>';
    }
    return str_t+'</span> <span class="span_fav" style="cursor:pointer;font-size:0.9rem;" onclick="fav_add_klsnews_b(this);">⚪</span>';
}

function fav_all_klsnews_b(ositename,do_confirm=true){
    var odiv=ositename.parentNode.parentNode;
    if (odiv){
        if (odiv.getAttribute('class')=='div_masonry'){
            var ospan=odiv.querySelector('span.span_fav');
            if (ospan){
                var is_add=(ospan.innerText=='⚪');
                var ospans=odiv.querySelectorAll('span.span_fav');
                if (do_confirm && confirm('是否'+(is_add?'添加':'清除')+ositename.innerText+'下的 '+ospans.length+' 条记录？')==false){
                    return;
                }
                for (let item of ospans){
                    item.innerText=(is_add?'⚪':'🔴');
                    fav_add_klsnews_b(item);
                }
            }
        }
    }
}

function fav_link_title_klsnews_b(ospan){
    var bljg='';
    var oparent=ospan.parentNode;
    if (!oparent){return;}
    var ospan_content=oparent.querySelector('span.span_content');
    if (ospan_content){
        var oa=ospan_content.querySelector('a');
        if (oa){
            var span_html=ospan_content.innerHTML;
            while (true){ //移除单词搜索链接 - 保留注释
                var osmall=ospan_content.querySelector('small.small_word_search_links');
                if (osmall){
                    osmall.parentNode.removeChild(osmall);
                } else {break;}
            }
            
            var sitename_t='';
            var odiv=ospan.parentNode.parentNode;
            if (odiv){
                if (odiv.classList.contains('div_masonry')){
                    var ospan_site=odiv.querySelector('span.span_site_name');
                    if (ospan_site){
                        sitename_t=ospan_site.innerText;
                    }
                }
            }
            if (sitename_t!==''){
                sitename_t=' - '+sitename_t;
            }
            bljg='["'+oa.href+'", "'+specialstr_j(ospan_content.innerText+sitename_t,true)+'"],';
            ospan_content.innerHTML=span_html;
        }
    }
    return bljg;
}

function fav_show_klsnews_b(){
    var fav_selenews=(localStorage.getItem('fav_selenews') || '').trim();
    
    var left_strings='<p><span class="aclick" onclick="fav_clear_klsnews_b();">Clear</span> ';
    var right_strings=' rows: '+fav_selenews.split('\n').length+'</p>\n';
    
    var blstr=textarea_with_form_generate_b('textarea_selenium_fav','width:95%;height:20rem;',left_strings,'发送到临时记事本,发送地址,↑,↓',right_strings,'','form_selenium_fav',true,fav_selenews);

    document.getElementById('divhtml').innerHTML='';
    document.getElementById('divhtml2').innerHTML=blstr;
}

function fav_clear_klsnews_b(){
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空') || '').trim()==rndstr){
        localStorage.setItem('fav_selenews','');
        fav_show_klsnews_b();
    }
}

function fav_add_klsnews_b(ospan){
    var fav_selenews=localStorage.getItem('fav_selenews') || '';
    var str_t=fav_link_title_klsnews_b(ospan)+'\n';
    var cstype=ospan.innerText;
    if (cstype=='⚪'){
        ospan.innerText='🔴';
        if (fav_selenews.includes(str_t)){return;}
        localStorage.setItem('fav_selenews',(fav_selenews+str_t).replace(/\n\n/g,'\n'));
    } else if (cstype=='🔴'){
        ospan.innerText='⚪';
        if (!fav_selenews.includes(str_t)){return;}
        localStorage.setItem('fav_selenews',fav_selenews.replace(str_t,'\n').replace(/\n\n/g,'\n'));
    }
}

function fav_status_klsnews_b(){
    var fav_selenews=local_storage_get_b('fav_selenews',-1,true);
    var ospans=document.querySelectorAll('span.span_content');
    var link_title_list=[];
    for (let item of ospans){
        link_title_list.push([item,fav_link_title_klsnews_b(item)]);
    }

    for (let item of fav_selenews){
        for (let one_span of link_title_list){
            if (one_span[1]==item){
                one_span[0].parentNode.querySelector('span.span_fav').innerText='🔴';
                break;
            }
        }
    }
}

function finish_site_klsnews_b(sitename,ospan){
    //最多保留100条浏览记录 - 保留注释
    var finished_sites=local_storage_get_b('finished_selenews',100,true);
    var key_value=document.getElementById('span_search_key').innerText;
    key_value=(key_value.match(/\d{4}\-\d{2}\-\d{2}/g) || [""])[0];
    var ospan_isfinished=ospan.querySelector('span.span_isfinished');
    if (ospan_isfinished.innerHTML!==''){
        //reread - 保留注释
        if (finished_sites.includes(key_value+','+sitename)){
            var list_t=[];
            for (let item of finished_sites){
                if (item==key_value+','+sitename){continue;}
                list_t.push(item);
            }
            localStorage.setItem('finished_selenews',list_t.join('\n'));
        }
        ospan_isfinished.innerHTML='';
    } else {
        if (!finished_sites.includes(key_value+','+sitename)){
            localStorage.setItem('finished_selenews',key_value+','+sitename+'\n'+finished_sites.join('\n'));
        }
        ospan_isfinished.innerHTML='已阅';
    }
}

function more_info_expand_klsnews_b(csno){
    document.getElementById('div_more_'+csno).style.display='block';
    document.getElementById('p_more_'+csno).style.display='none';
    masonrydiv_klsnews_b();
}

function expand_all_klsnews_b(cskeys){
    if (cskeys.includes('expand')){
        var ospan=document.getElementById('span_open_all');
        if (ospan){
            ospan.click();
        }
    }
}

function classify_sites_klsnews_b(bottom_eng=true,sort_by_day=false,show_cn_en=''){
    function sub_classify_sites_klsnews_b_link(bly,blxl){
        var str_t='<p ';
        if (bly % 2 == 1){
            str_t=str_t+'style="padding:0.5rem;font-size:1rem;background-color:#efefef;"';
        } else {
            str_t=str_t+'style="padding:0.5rem;font-size:1rem;"';
        }
        str_t=str_t+'>'+bly+'. '+longtxts_klsnews_b(selected_list[blxl]);
        str_t=str_t+'</p>';
        return str_t;
    }
    
    function sub_classify_sites_klsnews_b_head(divstyle,blno,cstotal,thetag,isfinished,str_t,more_t,bly){
        var bljg='<div class="div_masonry" style="'+divstyle+'">';
        bljg=bljg+'<a name="a_site_num_'+blno+'"></a>';
        bljg=bljg+'<p style="padding:0.5rem;font-weight:bold;font-size:1rem;">'+blno+'/'+cstotal+'. ';
        
        var class_name=(sites_en_cn_global['efull'].includes(thetag)?' span_site_name_efull':'');
        class_name=class_name+(sites_en_cn_global['cn'].includes(thetag)?' span_site_name_cn':'');
        
        bljg=bljg+'<span class="span_site_name'+class_name+'" style="cursor:pointer;" onclick="fav_all_klsnews_b(this);">'+thetag+'</span>';
        if (isfinished){
            bljg=bljg+' <span style="cursor:pointer;" onclick="finish_site_klsnews_b(\''+thetag+'\',this);">('+(bly-1)+') <span class="span_isfinished" style="color:'+scheme_global['a-hover']+';">已阅</span></span>';
        } else {
            bljg=bljg+' <span style="cursor:pointer;" onclick="finish_site_klsnews_b(\''+thetag+'\',this);">('+(bly-1)+') <span class="span_isfinished" style="color:'+scheme_global['a-hover']+';"></span></span>';
        }
        bljg=bljg+'</p>';
        bljg=bljg+str_t;
        if (more_t!==''){
            bljg=bljg+'<p id="p_more_'+blno+'"><span class="span_link" onclick=\'more_info_expand_klsnews_b('+blno+');\'>more...</span></p>';
            bljg=bljg+'<div id="div_more_'+blno+'" style="display:none;">'+more_t+'</div>';
        }
        bljg=bljg+'</div>';
        return bljg;
    }
    //-----------------------
    var selected_list=filter_list_klsnews_b();
    //形如 - 保留注释：
    //[ "https://www.theverge.com/2019/3/23/18278557/apple-iphone-11-wireless-charging-other-devices-airpods-watch-rumor", "Apple’s next iPhone might be able to wirelessly charge other devices", "2019-03-25", "Apple next iPhone might be able to wirelessly charge other devices", "The Verge" ]
    //以下两行排序必要 - 保留注释
    
    selected_list.sort(function (a,b){return sort_by_date_b(a,b,true,2,1,false,true);});
    selected_list.sort(function (a,b){return zh_sort_b(a,b,false,3);});

    var thetag='';
    var str_t='';
    var more_t='';
    var bly=1;
    var bljg_list=[];
    var date_t = new Date(); 
    var ospan=document.getElementById('span_search_key');
    if (ospan){
        var key_html_t=ospan.innerHTML;
    } else {return;}
    
    var dividednum_list=key_html_t.match(/\d/g);
    if (dividednum_list){
        var today_t=asc_sum_b(dividednum_list.join());
    } else {
        var today_t=asc_sum_b(key_html_t);
    }
    today_t=100+today_t%31; //如果+1，而不是+100，则出现后面的整除后都余0的情况
	if (ismobile_b()){
		var divstyle='padding:0rem; margin:0.2rem 0rem; border:2px dashed #c0c0c0;';
	} else {
        var divstyle='padding:0rem;margin:0.5rem 0rem; border:2px dashed #c0c0c0;word-break:normal; word-wrap:normal;';
        //position:relative;float:left;max-width:330px; - 保留注释
    }
    
    for (let blxl=0,lent=selected_list.length;blxl<lent;blxl++){
        if (thetag==''){
            thetag=selected_list[blxl][3];
        }
        if (thetag!==selected_list[blxl][3]){
            if (sort_by_day){
                bljg_list.push([asc_sum_b(thetag)%today_t,thetag,str_t,more_t,bly]);
            } else {
                bljg_list.push([0,thetag,str_t,more_t,bly]);
            }
            
            //console.log(thetag,asc_sum_b(thetag),today_t,asc_sum_b(thetag)%today_t); - 保留注释
            
            str_t='';
            more_t='';
            bly=1;
            thetag=selected_list[blxl][3];
        }
        if (bly<=20){
            str_t=str_t+sub_classify_sites_klsnews_b_link(bly,blxl);
        } else {
            more_t=more_t+sub_classify_sites_klsnews_b_link(bly,blxl);
        }
        bly=bly+1;
    }

    if (str_t!==''){
        if (sort_by_day){
            bljg_list.push([asc_sum_b(thetag)%today_t,thetag,str_t,more_t,bly]);
        } else {
            bljg_list.push([0,thetag,str_t,more_t,bly]);
        }
    }
    var odivhtml=document.getElementById('divhtml')
    if (odivhtml){
        odivhtml.innerHTML='';
    }
	var odiv2=document.getElementById('divhtml2');
    
    var bljg='';
    //bljg_list 中的一个元素形如：
    //[ 1, "豆瓣", "<p style=\"line-height:120%;font-size:1rem;\">1. <a href=\"https://www.douban.com/event/31952137/\" target=_blank style=\"text-decoration:none;\" title=\"2019-03-25 https://www.douban.com/event/31952137/\" class=\"a_news_link\">由废墟再出发 I&#39;d Rather Struggle</a></p>", "", 2 ]
    //分别是：排序分数，网站名，前20条内容，第21条开始的内容，显示序号
    // bljg_list.sort(function (a,b){return zh_sort_b(a,b,false,1);}); - 保留注释
    if (bottom_eng || ['cn','en'].includes(show_cn_en)){
        var maxnum=1;   //如果不+1，则 maxnum 可能是 0 - 保留注释
        for (let item of bljg_list){
            maxnum=Math.max(maxnum,item[0]);
        }
        
        var removestr='[”“’‘„–—‒…‚・⨯]';
        var list_t=[].concat(bljg_list);
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            var item=list_t[blxl];
            var site_type='';
            var do_add=false;
            //适用 www 数据库 - 保留注释
            if (sites_en_cn_global['cn'].includes(item[1])){
                site_type='cn0';
            } else if (sites_en_cn_global['efull'].includes(item[1])){
                site_type='efull';
                if (bottom_eng){
                    do_add=true;
                }
            } else if (sites_en_cn_global['en'].includes(item[1])){
                site_type='en0';
                if (bottom_eng){
                    do_add=true;
                }
            } else if ((item[1].replace(new RegExp(removestr,'g'),'').trim().match(/[^\x00-\xff]/) || []).length>0){
                site_type='cn1';    //适用 www 数据库以外；网站名中含有中文 - 保留注释
            } else if ((item[2].split('</p>')[0].trim().replace(new RegExp(removestr,'g'),'').match(/[^\x00-\xff]/g) || []).length<=1){
                site_type='en1';
                if (bottom_eng){
                    do_add=true;    //适用全部数据库；第一条记录中含有中文数量少于2个 - 保留注释
                }
            }
            
            console.log(site_type,item[1]); //此行保留 - 保留注释
            if (show_cn_en=='cn' && site_type.substring(0,2)=='en' || show_cn_en=='cn' && site_type=='efull' || show_cn_en=='en' && site_type.substring(0,2)=='cn'){
                list_t[blxl]='';
            } else if (do_add){
                list_t[blxl][0]=item[0]+maxnum*(site_type=='efull'?1:2);  //EFULL+maxnum，CN+maxnum*2 - 保留注释
            }
            //以下四行保留注释
            //else {
                //console.log(bljg_list[blxl][0],bljg_list[blxl][1],bljg_list[blxl][1].replace(new RegExp(removestr,'g'),'').trim().match(/[^\x00-\xff]/));
                //console.log(bljg_list[blxl][2].split('</p>')[0].trim().replace(new RegExp(removestr,'g'),'').match(/[^\x00-\xff]/g));
            //}
        }
        bljg_list=[];
        for (let item of list_t){
            if (item==''){continue;}
            bljg_list.push(item);
        }
    }
    
    bljg_list.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});

    var a_site_num_links='';
    
    var finished_sites=local_storage_get_b('finished_selenews',-1,true);
    var key_value=document.getElementById('span_search_key').innerText;
    key_value=(key_value.match(/\d{4}\-\d{2}\-\d{2}/g) || [''])[0];
    for (let blxl=0,lent=bljg_list.length;blxl<lent;blxl++){
        if (blxl % 10 == 0){
            bljg=bljg+'<div class="div_masonry" style="width:100%;"><h3>第 '+(1+blxl/10)+' 部分</h3></div>';
        }
        
        bljg=bljg+sub_classify_sites_klsnews_b_head(divstyle,blxl+1,bljg_list.length,bljg_list[blxl][1],finished_sites.includes(key_value+','+bljg_list[blxl][1]),bljg_list[blxl][2],bljg_list[blxl][3],bljg_list[blxl][4]);
 
        a_site_num_links=a_site_num_links+'<option value="#a_site_num_'+(blxl+1)+'">'+(blxl+1)+'. '+bljg_list[blxl][1]+'</option>';
        //第n部分 增加标签分组 - ToDo
    }
    odiv2.innerHTML='<div class="div_masonry" style="'+divstyle+'"><select onchange="document.location.href = this.value;">'+a_site_num_links+'</select>'+' <span id="span_open_all" onclick=\'this.style.display="none";open_all_more_klsnews_b();\' class="aclick">全部展开</span></div>'+bljg;
    masonrydiv_klsnews_b();
    
    //enwords
    words_translate_klsnews_b();
    sentence_new_words_klsnews_b();
    //---
    document.location.href = '#content';
    fav_status_klsnews_b();
    
    top_bottom_arrow_b('div_top_bottom',sourcelist.length+' ');
}

function init_klsnews_b(){
    for (let blxl=0,lent=enwords_easy_global.length;blxl<lent;blxl++){
        enwords_easy_global[blxl]=enwords_easy_global[blxl].toLowerCase();
    }
    enwords_easy_global=new Set(enwords_easy_global);
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.3rem':'1.3rem'));
    mobile_style_klsnews_b();    
}

function words_translate_klsnews_b(){
    var do_translate=checkbox_kl_value_b('input_enwords');
    if (do_translate===0){return;}
    
    if (do_translate===true){
        var enwords_temp=[];
        var enwords_temp_no=[];
        for (let blxl=0,lent=enwords.length;blxl<lent;blxl++){
            if (enwords_easy_global.has(enwords[blxl][0].toLowerCase())){continue;}
            
            enwords_temp.push(enwords[blxl][0].toLowerCase());
            enwords_temp_no.push(blxl);
        }
        var odiv2as=document.querySelectorAll('a.a_news_link');
        var bltotal=0;
        for (let blxl=odiv2as.length-1;blxl>=0;blxl--){
            //单词总数控制 - 保留注释
            if (bltotal>50){break;}
            var str_t=odiv2as[blxl].innerText;
            if (str_t){
                list_t=str_t.match(/\b[a-zA-Z]+\b/g);
                //数量控制 - 保留注释
                if (list_t==null || list_t.length<6){continue;}
                
                var bly=0;
                for (let blx=0,lenb=list_t.length;blx<lenb;blx++){
                    if (list_t[blx]=='' || enwords_easy_global.has(list_t[blx]) || enwords_easy_global.has(list_t[blx].toLowerCase())){
                        continue;
                    }
                    
                    var at_t=enwords_temp.indexOf(list_t[blx].toLowerCase());
                    if (at_t>=0){
                        odiv2as[blxl].innerHTML=odiv2as[blxl].innerHTML.replace(new RegExp(' '+list_t[blx]+' ',''),' '+list_t[blx]+'<sup class="sup_sele_en">('+enwords[enwords_temp_no[at_t]][1]+' '+enwords[enwords_temp_no[at_t]][2]+')</sup> ');
                        enwords_temp.splice(at_t,1);
                        enwords_temp_no.splice(at_t,1);
                        bly=bly+1;
                        bltotal=bltotal+1;
                        //数量控制 - 保留注释
                        if (bly>=1){break;}
                    }
               }
            }
        }
        masonrydiv_klsnews_b();
        document.getElementById('label_translation').innerHTML='<span style="color:red;font-size:0.8rem;font-weight:normal;">(已翻译)</span>';
    } else {
        document.getElementById('label_translation').innerHTML='';
    }
}

function rnd_search_window_klsnews_b(){
    var odiv2as=document.querySelectorAll('a.a_news_link');
    var list_len=odiv2as.length;
    if (list_len==0){
        clearInterval(rnd_open_window_klsnews_global);
        return;
    }
    var str_t='';
    for (let blxl=0;blxl<1;blxl++){
        var item=randint_b(0,list_len-1);
        var str_t=str_t+' '+odiv2as[item].innerText;
    }
    
    var list_t=split_words_b(str_t,true);

    list_t.sort(randomsort_b);
    console.log('search',str_t,list_t);

    list_t=list_t.slice(0,randint_b(3,7));
    
    str_t=list_t.join(' ');

    var websites=[
    'https://www.baidu.com/s?wd=',
    'https://www.so.com/s?q=',
    'https://www.sogou.com/web?query=',
    'https://cn.bing.com/search?q=',
    'http://www.chinaso.com/search/pagesearch.htm?q=',
    'https://m.toutiao.com/search/?keyword=',
    ];
    var nmax=Math.ceil(Math.random()*5);
    for (let blxl=0;blxl<nmax;blxl++){
        websites.sort(randomsort_b);
    }
    window.open(websites[0]+str_t,'rnd_news_window');
}

function rnd_links_klsnews_b(cscount=0){
    function sub_rnd_links_klsnews_b_one_link(){
        if (blxl>=list_t.length){return;}
        odiv2as[list_t[blxl]].click();
        blxl=blxl+1;
        setTimeout(sub_rnd_links_klsnews_b_one_link,2000);
    }
    //-----------------------
    var odiv2as=document.querySelectorAll('a.a_news_link');
    var list_t=[];
    var bgcolor=hex2rgb_b(scheme_global['pink'],true);
    for (let blno=0,lent=odiv2as.length;blno<lent;blno++){
        if (odiv2as[blno].style.backgroundColor==bgcolor){continue;}
        list_t.push(blno);
    }
    var bltotal_t=Math.floor((Math.random()*20)+1);
    for (let blno=0;blno<bltotal_t;blno++){    
        list_t.sort(randomsort_b);
    }
    list_t=list_t.slice(0,cscount);
    if (list_t.length==0){return;}
    var blxl=0;
    sub_rnd_links_klsnews_b_one_link();
}

function rnd_window_klsnews_b(){
    var odiv2as=document.querySelectorAll('a.a_news_link');
    var list_len=odiv2as.length;
    if (list_len==0){
        clearInterval(rnd_open_window_klsnews_global);
        return;
    }
    var item=randint_b(0,list_len-1);
    console.log('rndhref',odiv2as[item].href);
    window.open(odiv2as[item].href,'rnd_news_window');
}

function masonrydiv_klsnews_b(){
    if (!klmenu_check_b('span_masonry_style',false)){return;}

    if (ismobile_b()==false){
        try {
            var msnry = new Masonry( document.getElementById('divhtml2'), {
              itemSelector: '.div_masonry',
              columnWidth: 200
            });
        } catch (error){
            //do nothing
        }
    }
}

function filter_list_klsnews_b(){
    function sub_filter_list_klsnews_b_selected(){
        var selected_list=[];
        for (let one_row of sourcelist){
            selected_list.push(one_row);
        }
        return selected_list;
    }
    //-----------------------
    var oinput_focus=document.getElementById('input_focus');
    if (!oinput_focus){
        return sub_filter_list_klsnews_b_selected();
    }
    var focus=checkbox_kl_value_b('input_focus'); //oinput_focus.checked;
    var selected_list=[];
    if (focus===true){       
        var focus_list=sort_keys_klsnews_b();
        for (let one_row of sourcelist){
            for (let one_key of focus_list){
		        if (one_key.trim()==''){continue;}
                if (one_row[0].toLowerCase().includes(one_key) || one_row[1].toLowerCase().includes(one_key)){
                    selected_list.push(one_row);
                    break;
                }
            }
        }
    } else {
        return sub_filter_list_klsnews_b_selected();
    }
    return selected_list;    
}

function rowid_change_klsnews_b(cstype=1){
    if (sourcelist.length==0){return;}
    var oinput=document.getElementById('input_rowid');
    if (cstype==1){     //下一页
        oinput.value=sourcelist[sourcelist.length-1][5];
    } else if (cstype==-1){    //上一页
        oinput.value=sourcelist[0][5];
    } else {
        oinput.value='';
    }
    document.getElementById('input_direction').value=cstype;
    document.getElementById('form_search').submit();
}

function next_dbc_search_klsnews_b(){
    if (sourcelist.length>0){return;}
    var oselect=document.getElementById('select_dbfname');
    if (oselect){
        var options=oselect.getElementsByTagName('option');
        var blxl=0;
        for (blxl=0,lent=options.length;blxl<lent;blxl++){
            if (options[blxl].selected){break;}
        }
        if (blxl==options.length-1){return;}
        options[blxl+1].selected=true;
        document.getElementById('form_search').submit();
    }
}

function getlines_simple_klsnews_b(){
    if (sourcelist.length==0){
        document.getElementById('divhtml').innerHTML='';
        return;
    }
    var bljg='';
    var blpage='';
    if (max_row_id_global!==-1 && sourcelist[0][5]<max_row_id_global){
        blpage=blpage+'<span class="aclick" onclick="rowid_change_klsnews_b(-1);">上一页</span> ';
    }
    if (min_row_id_global!==-1 && sourcelist[sourcelist.length-1][5]>min_row_id_global){
        blpage=blpage+'<span class="aclick" onclick="rowid_change_klsnews_b(1);">下一页</span>';
    }
    if (blpage!==''){
        blpage='<span class="aclick" onclick="rowid_change_klsnews_b(0);">第一页</span> '+blpage;
        blpage='<p align=right>'+blpage+'</p>';
    }
    
	for (let item of sourcelist){
        bljg=bljg+'<p style="font-size:1.1rem;padding:0.2rem 0.5rem;border:0.1rem solid '+scheme_global["background"]+';" onmouseover="this.style.border=\'0.1rem solid '+scheme_global["shadow"]+'\';" onmouseout="this.style.border=\'0.1rem solid '+scheme_global["background"]+'\';">';
        bljg=bljg+longtxts_klsnews_b(item,true);
        bljg=bljg+'</p>';
	}

    bljg=bljg+blpage;
    
	document.getElementById('divhtml').innerHTML=bljg;

    fav_status_klsnews_b();
}

function getlines_location_klsnews_b(jssearchkey,cscount,cslines){
    var blno=page_location_b(cscount);
    if (blno!==false){
        getlines_klsnews_b(jssearchkey,(blno-1)*cslines+1,cslines);
    }
}

function getlines_klsnews_b(jssearchkey='',csno=1,cslines=50){
    function sub_getlines_klsnews_b_pages(csno,cslines,bllength,jssearchkey){
        var page_html=page_combination_b(bllength,cslines,csno,'getlines_klsnews_b(\''+jssearchkey+'\',','getlines_location_klsnews_b(\''+jssearchkey+'\',','text-align:right',2,0,'','aclick');
        return page_html;
    }
    //-----------------------
    var bljg='';
    var selected_list=filter_list_klsnews_b();
    if (jssearchkey!==''){
        var selected_list2=[];
        for (let item of selected_list){
            var blfound=str_reg_search_b(item,jssearchkey.split(' '),false);
            if (blfound==-1){break;}

            if (blfound){
                selected_list2.push(item);
            }
        }
        selected_list=selected_list2;
    }
    
    var bllength=selected_list.length;
    var pagehtml='';    
    if (cslines==-1){
        cslines=bllength-csno+1;
    }
    
    var pagehtml=sub_getlines_klsnews_b_pages(csno,cslines,bllength,jssearchkey);
    bljg=bljg+pagehtml;
    
	for (let blxl=csno-1;blxl<csno+cslines-1;blxl++){
		if (blxl>=bllength){break;}
        if (blxl % 2==0){
            bljg=bljg+'<p style="font-size:1.1rem;padding:0.2rem 0.5rem;">';
        } else {
            bljg=bljg+'<p style="font-size:1.1rem;background-color:#efefef;padding:0.2rem 0.5rem;">';
        }
        bljg=bljg+(blxl+1)+'. ';
        bljg=bljg+longtxts_klsnews_b(selected_list[blxl],true);
        bljg=bljg+'</p>';
	}
	
	bljg=bljg+pagehtml;
	
	document.getElementById('divhtml').innerHTML=bljg;
    var odivhtml2=document.getElementById('divhtml2');
    if (odivhtml2){
        odivhtml2.innerHTML='';
        odivhtml2.style.cssText='margin:0 0.5rem;';
    }
    words_translate_klsnews_b();
    sentence_new_words_klsnews_b();
    
	document.location.href = '#content';
    fav_status_klsnews_b();
}

function show_all_day_links_klsnews_b(ospan){
    var oas=document.querySelectorAll('div#div_dbcname a.a_oblong_box');
    for (let item of oas){
        item.style.display='';
    }
    ospan.parentNode.removeChild(ospan);
}

function dbc_list_klsnews_b(cskeys,csshow_websites=false,csoneday=false){
    var bljg='';
    var dbc_count=selenium_dbc_global.length;
    var space_str=(dbc_count==1?'':' ');

    for (let blxl=0,lent=dbc_js_files.length;blxl<lent;blxl++){//天数 - 保留注释
        var file_date=dbc_js_files[blxl];
        var file_date2=file_date;
        if (csoneday==false && blxl>0){
            if (dbc_js_files[blxl-1].substring(0,5)==file_date.substring(0,5)){
                file_date2=file_date2.substring(5,);
            }
        }
        if (dbc_count>1){
            if (cskeys.substring(0,10)==file_date){
                bljg=bljg+'<b>'+file_date2+': </b>';
            } else {
                if (csoneday){
                    continue;
                } else {
                    bljg=bljg+file_date2+': ';
                }
            }
        }
        if (dbc_count==1 && blxl==4 && dbc_js_files.length>4){
            bljg=bljg+'<span class="oblong_box" onclick="show_all_day_links_klsnews_b(this);">...</span> ';
        }
        for (let item of selenium_dbc_global){//数据表 - 保留注释
            var str_t=file_date+'_'+item[0];
            if (dbc_count==1){
                var html_title=file_date2;
            } else {
                var html_title=item[1];
            }

            bljg=bljg+'<a class="a_oblong_box"';
            if (dbc_count==1 && blxl>3){
                if (csshow_websites!==false || cskeys.substring(0,10)!==file_date || cskeys.split('_')[1]!==item[0]){
                    bljg=bljg+' style="display:none;"';
                }
            }
            bljg=bljg+' href="?day_dbf='+str_t+'">';
            if (csshow_websites==false && cskeys.substring(0,10)==file_date && cskeys.split('_')[1]==item[0]){
                bljg=bljg+'<font color=red><b>'+html_title+'</b></font>';
            } else {
                bljg=bljg+html_title;
            }
            bljg=bljg+'</a>'+space_str;
        }
        bljg=bljg+' ';
    }
    var odiv=document.getElementById('div_dbcname');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));    
}

function dbc_list2_klsnews_b(cskeys){
    //cskyes 形如 2019-05-30_www - 保留注释
    var list_t=[];
    var dbc_count=selenium_dbc_global.length;

    var jump_t=klmenu_hide_b('');    
    for (let file_date of dbc_js_files){
        var group_list=[];
        for (let item of selenium_dbc_global){
            var str_t=file_date+'_'+item[0];
            var href_link='?day_dbf='+str_t;
            if (item[0]=='www'){
                href_link=href_link+'&expand';
            }
            
            var html_title=(cskeys==file_date+'_'+item[0]?'<font color=red><b>'+item[1]+'</b></font>':item[1]);  
            group_list.push([html_title,'location.href=\''+href_link+'\';',true]);
        }
        
        list_t.push(menu_container_b(jump_t,group_list,file_date+': '));        
    }
    return list_t;
}

function dbc_list3_klsnews_b(){
    var bljg='';
    var currentvalue=document.getElementById('select_dbfname').value;
    for (let blxl=0,lent=selenium_dbc_global.length;blxl<lent;blxl++){
        bljg=bljg+'<span class="oblong_box"';
        if (currentvalue==selenium_dbc_global[blxl][0]){
            bljg=bljg+' style="color:'+scheme_global['a-hover']+';"';
        }
        bljg=bljg+' onclick="dbc_select_submit_b('+blxl+');">';
        bljg=bljg+selenium_dbc_global[blxl][1];
        bljg=bljg+'</span> ';
    }
    var odiv=document.getElementById('div_dbc');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function dbc_select_submit_b(csvalue){
    document.getElementById('select_dbfname').value=selenium_dbc_global[csvalue][0];
    var oas=document.querySelectorAll('div#div_dbc a');
    for (let alink of oas){
        if (alink.innerHTML==selenium_dbc_global[csvalue][1]){
            alink.style.color=scheme_global['color'];
        } else {
            alink.style.color=scheme_global['memo'];
        }
    }
    document.getElementById('form_search').submit();
}

function sort_content_klsnews_b(cstype){
    switch (cstype){
        case 'date':
            sourcelist.sort(function (a,b){return sort_by_date_b(a,b,true,2,1,false,true);});
            break;
        case 'title':
            sourcelist.sort(function (a,b){return zh_sort_b(a,b,false,1);});
            break;
        case 'random':
            sourcelist.sort(randomsort_b);
            break;
    }
    getlines_klsnews_b();
}

function menu_klsnews_b(cskeys,js_or_php=''){
    //cskyes 形如 2019-05-30_www - 保留注释
    var another_page=[];
    if (js_or_php=='js'){
        another_page=['<a href="selenium_news_reader.php">PHP版</a>'];
    } else if (js_or_php=='php'){
        another_page=[
        '<a href="selenium_news_reader_offline.htm">离线版</a>',
        '<a href="?search=0(:iscn)&limit=1000&input_random">随机1000条英文信息</a>',
        ];
    }
    var str_t=klmenu_hide_b('');
    var menu_list1=[
    '<span class="span_menu" onclick="'+str_t+'fav_show_klsnews_b();">收藏</span>',
    '<a href="temp_txt_append.php" onclick="'+str_t+'" target=_blank>➕ temp txt append</a>',
    ];
    
    var group_list=[
    ['按网站分类：','classify_sites_klsnews_b(false);',true],
    ['中上英下','classify_sites_klsnews_b(true,true);',true],
    ['英文','classify_sites_klsnews_b(false,false,\'en\');',true],
    ['中文','classify_sites_klsnews_b(false,false,\'cn\');',true],
    ['ASC排序','classify_sites_klsnews_b(false,false);',true],
    ];    
    menu_list1.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['日期','sort_content_klsnews_b(\'date\');',true],
    ['标题','sort_content_klsnews_b(\'title\');',true],
    ['随机','sort_content_klsnews_b(\'random\');',true],
    ];    
    menu_list1.push(menu_container_b(str_t,group_list,'排序：'));
        
    menu_list1=another_page.concat(menu_list1);
    
    var menu_list3=[
    '<span id="span_masonry_style" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ masonry</span>',            
    '<span class="span_menu" onclick="'+str_t+'statistics_sites_klsnews_b();">当前页网站列表</span>',
    enwords_mini_menu_item_b(str_t),
    '<span class="span_menu" onclick="'+str_t+'newwords_klsnews_b();">热门生词</span>',
    '<span class="span_menu" onclick="'+str_t+'span_fav_show_hide_klsnews_b();">fav button show/hide</span>',    
    '<span class="span_menu" onclick="'+str_t+'stanalone_search_klsnews_b();">导出链接为standalone search</span>',        
    ];

    var group_list=[
    ['cn','fav_trigger_klsnews_b(\'cn\');',true],
    ['efull','fav_trigger_klsnews_b(\'efull\');',true],
    ];    
    menu_list3.push(menu_container_b(str_t,group_list,'fav trigger: '));
    
    var group_list=[
    ['访问','rnd_open_or_search_klsnews_b(false);',true],
    ['搜索','rnd_open_or_search_klsnews_b(true);',true],
    ['打开10条链接','rnd_links_klsnews_b(10);',true],
    ];    
    menu_list3.push(menu_container_b(str_t,group_list,'随机：'));

    if (js_or_php=='php'){
        menu_list3.push('<a href="?dbf='+cskeys+'&countdays=30">最近30天更新统计</a>');
    }       

    var menu_combination=klmenu_b(menu_list1,'','21rem','1.1rem','0.9rem')+klmenu_b(menu_list3,'⚙','16rem','1.1rem','0.9rem','30rem');

    var menu_list2='';
    if (js_or_php=='js' && cskeys!==''){
        menu_list2=dbc_list2_klsnews_b(cskeys);
        var bljg=klmenu_multi_button_div_b(menu_combination+klmenu_b(menu_list2,'🛢','17rem','1.1rem','0.9rem','30rem'),'','0rem');
    } else {
        var bljg=klmenu_multi_button_div_b(menu_combination,'','0rem');
    }
    
    document.getElementById('span_h2_title').insertAdjacentHTML('beforebegin',bljg+' ');
    klmenu_check_b('span_masonry_style',true);            
}

function rnd_open_or_search_klsnews_b(is_search=false){
    clearInterval(rnd_open_window_klsnews_global);
    if (is_search){
        rnd_search_window_klsnews_b();
        rnd_open_window_klsnews_global=setInterval(rnd_search_window_klsnews_b,20000);    
    } else {
        rnd_window_klsnews_b();
        rnd_open_window_klsnews_global=setInterval(rnd_window_klsnews_b,60000);
    }
}

function fav_trigger_klsnews_b(cstype){
    var ospans=document.querySelectorAll('span.span_site_name_'+cstype);
    for (let one_span of ospans){
        fav_all_klsnews_b(one_span,false);
    }
}

function stanalone_search_klsnews_b(){
    var bltitle=prompt('输入标题');
    if (bltitle==null){return;}
    if (bltitle.trim()==''){
        bltitle='Selenium Search';
    }
    var result_t=[];
    for (let item of sourcelist){
        result_t.push('"'+specialstr_j('<a href="'+item[0]+'" target=_blank>'+item[1]+' - '+item[3]+'</a>')+'",');
    }
    standalone_search_funs_b(bltitle.trim(),result_t.join('\n'),['style_generate_b']);
}

function span_fav_show_hide_klsnews_b(){
    var ofavs=document.querySelectorAll('span.span_fav');
    if (ofavs.length==0){return;}
    var hide_or_show=(ofavs[0].style.display=='none'?'':'none');
    for (let one_fav of ofavs){
        one_fav.style.display=hide_or_show;
    }
}

function buttons_klsnews_b(){
    var button_size='0.9rem;'
    var button_more='';
    button_more=button_more+'<div class=klmenu><button style="font-size:'+button_size+';">'+checkbox_kl_b('input_focus','只显示重点条目')+'</button></div>';
    button_more=button_more+'<div class=klmenu><button style="font-size:'+button_size+';">'+checkbox_kl_b('input_show_new_words','显示生词')+'</button></div>';    
    button_more=button_more+'<div class=klmenu><button style="font-size:'+button_size+';">'+checkbox_kl_b('input_enwords','旧单词翻译')+'</button></div>';
    button_more=button_more+'<div class=klmenu><button style=font-size:'+button_size+';" onclick="popup_show_hide_b(\'div_selenium_keywords\');">关键词</button></div>';
    
    document.getElementById('div_show_hide').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(button_more,'block','0','','div_menu_checkboxes'));
}

function keywords_form_klsnews_b(){   
    var left_strings='<p>格式：按英文逗号间隔，不支持空格或换行 ';
    left_strings=left_strings+'<span class="aclick" onclick="keywords_read_klsnews_b();">读取</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="keywords_update_klsnews_b();">更新</span> ';   
    var right_strings='</p>';
    
    var blstr=textarea_with_form_generate_b('textarea_selenium_keywords','',left_strings,'发送到临时记事本,发送地址',right_strings,'','form_selenium_keywords');

    var odiv=document.getElementById('div_selenium_keywords');
    odiv.innerHTML=blstr;
    keywords_read_klsnews_b();
}

function keywords_update_klsnews_b(){
    var otextarea=document.getElementById('textarea_selenium_keywords');
    if (otextarea){
        var list_t=otextarea.value.trim().split(',');
        list_t=array_unique_b(list_t);
        list_t.sort();
        if (confirm('是否更新('+list_t.length+')？')){
            var blstr=list_t.join(',');
            localStorage.setItem('keywords_selenium',blstr);
            otextarea.value=blstr;
        }
    }
}

function keywords_read_klsnews_b(){
    var otextarea=document.getElementById('textarea_selenium_keywords');
    if (otextarea){
        otextarea.value=local_storage_get_b('keywords_selenium',-1);
    }
}
