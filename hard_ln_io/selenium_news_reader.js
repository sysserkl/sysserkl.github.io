function mobile_style_klsnews(){
    var mobile_t='\n<style>\n';
    mobile_t=mobile_t+'#divhtml {margin:0px 0.5rem;}\n';
    mobile_t=mobile_t+'sup.sup_sele_en {font-size:0.2rem;color:black;border-bottom:0.3rem #92addb solid;}\n';    
    mobile_t=mobile_t+'</style>\n';

	var pc_t='\n<style>\n';
	pc_t=pc_t+'#divhtml {margin-left:'+(parseInt(document.body.clientWidth)*0.5)/2+'px; max-width:'+Math.max(700,(parseInt(document.body.clientWidth)*0.5))+'px;}\n';
    pc_t=pc_t+'sup.sup_sele_en {font-size:0.8rem;color:black;border-bottom:3px #92addb solid;}\n';
	pc_t=pc_t+'</style>\n';
	mobile_b(mobile_t, pc_t);
}

function sentence_new_words_klsnews(){
    var ospans=document.querySelectorAll('span.span_content');
    var list_t=[];
    for (let item of ospans){
        list_t.push(item.innerText);
    }
    get_new_words_arr_enbook(2,list_t.join('\n'),ospans,4,true,true);
}

function sites_compare_sort_klsnews(sort_type){
    sites_compare_list_isdesc=!sites_compare_list_isdesc;
    sort_type=Math.min(3,Math.max(0,parseInt(sort_type)));
    if (sort_type==0){
        sites_compare_list_global.sort(function (a,b){return zh_sort_b(a,b,sites_compare_list_isdesc,0);});
    }
    else {
        if (sites_compare_list_isdesc){
            sites_compare_list_global.sort(function (a,b){return b[sort_type]-a[sort_type];});
        }
        else {
            sites_compare_list_global.sort(function (a,b){return a[sort_type]-b[sort_type];});
        }
    }

    var bljg='';
    for (let blxl=0;blxl<sites_compare_list_global.length;blxl++){
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
        bljg='<h3>网站更新频率</h3>\n<table>\n<tr><th class="blackline2" onclick="javascript:sites_compare_sort_klsnews(0);">网站</th><th class="blackline2" onclick="javascript:sites_compare_sort_klsnews(1);">更新次数</th><th class="blackline2" onclick="javascript:sites_compare_sort_klsnews(2);">更新条数</th></tr>\n'+bljg+'</table>\n';
    }
    document.getElementById('td_sites_compare').innerHTML=bljg;
}

function sites_compare_klsnews(csdays,sort_type=2){
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
        if (statistics_t[item_t[0]]==null){
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
    sites_compare_sort_klsnews(sort_type);
}

function sort_keys_klsnews(){
    var focus_list=[];
    var otextarea=document.getElementById('textarea_selenium_keywords');
    if (otextarea){
        focus_list=otextarea.value.split(',');
    }
    focus_list = array_unique_b(focus_list);
    focus_list.sort();
    return focus_list;
}

function newwords_klsnews(){
    if (document.getElementById('div_newwords_klsnews').innerHTML!==''){
        document.getElementById('div_newwords_klsnews').innerHTML='';
        return;
    }
    var enwords_temp=[];
    for (let blxl=0;blxl<enwords.length;blxl++){
        enwords_temp.push(enwords[blxl][0].toLowerCase());
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'d');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'ed');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'s');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'es');
        enwords_temp.push(enwords[blxl][0].toLowerCase()+'ing');
    }

    var bljg='';
    for (let blxl in sourcelist){
	    bljg=bljg+sourcelist[blxl][1];
    }
    var list_t=bljg.match(/\b[a-zA-Z\-]+\b/g);
    var list2_t=[];
    for (let blxl in list_t){
        var str_t=list_t[blxl].toLowerCase();
        if (str_t.length<=1){continue;}
        if (enwords_temp.includes(str_t)){continue;}
        if (list2_t[str_t]==null){
            list2_t[str_t]=[str_t,0];
        }
        list2_t[str_t][1]=list2_t[str_t][1]+1;
    }
    var list_t=[];
    for (let blxl in list2_t){
        list_t.push(list2_t[blxl]);
    }
    list_t.sort(function (a,b){return b[1]-a[1];});
    var blxl=0;
    var bljg='';
    for (let bly in list_t){
        bljg=bljg+list_t[bly][0]+' ('+list_t[bly][1]+') ';
        blxl=blxl+1;
        if (blxl>300){break;}
    }
    document.getElementById('div_newwords_klsnews').innerHTML='<p style="font-size:1rem;">'+bljg+'</p>';
}

function statistics_sites_klsnews(){
    if (document.getElementById('div_sitesname').innerHTML!==''){
        document.getElementById('div_sitesname').innerHTML='';
        return;
    }
    var sites_count_t=[];
    for (let blxl in sourcelist){
        var site_name_t=sourcelist[blxl][3];
        if (sites_count_t[site_name_t]==null){
             sites_count_t[site_name_t]=[site_name_t,0];
        }
        sites_count_t[site_name_t][1]=sites_count_t[site_name_t][1]+1;
    }
    var sites_count2_t=[];
    for (let blxl in sites_count_t){
        sites_count2_t.push(sites_count_t[blxl]);
    }
    sites_count2_t.sort(function (a,b){return a[0].localeCompare(b[0],"zh");});
    
    var bljg='0. <span onclick=\'javascript:getlines_klsnews();\' style="cursor:pointer;">全部</span>('+sourcelist.length+') ';
    for (let blxl in sites_count2_t){
        bljg=bljg+(parseInt(blxl)+1)+'. <span onclick=\'javascript:getlines_klsnews(1,50,"'+sites_count2_t[blxl][0]+'");\' style="cursor:pointer;">'+sites_count2_t[blxl][0]+'</span>('+sites_count2_t[blxl][1]+') ';
    }
    document.getElementById('div_sitesname').innerHTML='<p>'+bljg+'</p>';
}

function showhide_klsnews(){
	var odiv=document.getElementById("div_show_hide");
	if (odiv.style.display=='none'){
        odiv.style.display='block';
    }
	else {
        odiv.style.display='none';
    }
}

function open_all_more_klsnews(){
    var oas=document.querySelectorAll('p[id^="p_more_"] a');
    for (let blxl=0;blxl<oas.length;blxl++){
        oas[blxl].click();
    }
}

function weibo_at_klsnews(cssite,csstr){
    if (cssite.includes('weibo.com')){
        csstr=csstr.replace(new RegExp(/@([^# 【】《》@]+?)([：: ，])/,'g'),'<a href="http://weibo.com/n/$1" target=_blank>@$1</a>$2');
        
        csstr=csstr.replace(new RegExp(/(\s?)(https?:\/\/t\.cn\/[^\s]*)(\s?)/,'g'),'$1<a href="$2" target=_blank>$2</a>$3');

        csstr=csstr.replace(new RegExp(/#([^@【】《》#]+?)#/,'g'),'<a href="https://s.weibo.com/weibo?q=%23$1%23" target=_blank>#$1#</a>');
        
        csstr=csstr.replace(new RegExp(/《([^#@《》]+?)》/,'g'),'<b>《$1》</b>');
        csstr=csstr.replace(new RegExp(/【([^#@【】]+?)】/,'g'),'<b>【$1】</b>');     
        csstr=csstr.replace(new RegExp('O网页链接','g'),' ');
        csstr=csstr.replace(new RegExp('展开全文c','g'),' ');
        csstr=csstr.replace(new RegExp(/\d+  \d+ ñ\d+/,'g'),' ');
        csstr=csstr.replace(new RegExp(/^(\d?\d?:?\d?\d?)\s?来自 (微博 weibo.com|iPhone 6s|[^\s]*\s)/,'g'),'$1 ');
    }
    return csstr;
}

function longtxts_klsnews(cslist,addsitename=false){
    var str_t='<span class="span_content"><a href="'+cslist[0]+'" target=_blank style="text-decoration:none;" title="'+cslist[2]+' '+cslist[0]+'" class="a_news_link">';
    
    var title_t=specialstr_lt_gt_j(cslist[1].trim());
    //替换英文字母边的中文引号为英文引号 - 保留注释
    title_t=title_t.replace(new RegExp(/([a-zA-Z])’/,'g'),'$1&#39;');
    title_t=title_t.replace(new RegExp(/‘([a-zA-Z])/,'g'),'&#39;$1');
    if (title_t.length>150 || cslist[0].includes("://weibo.com/")){
        var at_t=title_t.indexOf(' ');
        if (at_t<=10){
            at_t=15;
        }
        str_t=str_t+title_t.substring(0,at_t);
        str_t=str_t+'</a>';
        str_t=str_t+weibo_at_klsnews(cslist[0], title_t.substring(at_t,));
        if (addsitename){
            str_t=str_t+' - '+cslist[3];
        }
    }
    else {
        str_t=str_t+title_t;
        if (addsitename){
            str_t=str_t+' - '+cslist[3];
        }        
        str_t=str_t+'</a>';
    }
    return str_t+'</span> <span class="span_fav" style="cursor:pointer;font-size:0.9rem;" onclick="javascript:fav_add_klsnews(this);">⚪</span>';
}

function fav_all_klsnews(ositename){
    var odiv=ositename.parentNode.parentNode;
    if (odiv){
        if (odiv.getAttribute('class')=='div_masonry'){
            var ospan=odiv.querySelector('span.span_fav');
            if (ospan){
                var is_add=(ospan.innerText=='⚪');
                var ospans=odiv.querySelectorAll('span.span_fav');
                if (confirm("是否"+(is_add?"添加":"清除")+ositename.innerText+"下的 "+ospans.length+" 条记录？")==false){
                    return;
                }
                for (let item of ospans){
                    item.innerText=(is_add?'⚪':'🔴');
                    fav_add_klsnews(item);
                }
            }
        }
    }
}

function fav_link_title_klsnews(ospan){
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
                }
                else {break;}
            }
            
            var sitename_t='';
            var odiv=ospan.parentNode.parentNode;
            if (odiv){
                if (odiv.getAttribute('class')=='div_masonry'){
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

function fav_show_klsnews(){
    var fav_selenews=(localStorage.getItem('fav_selenews') || '').trim();
    
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_selenium_fav" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_selenium_fav" id="textarea_selenium_fav" style="width:100%;height:20rem;" onclick="javascript:this.select();document.execCommand(\'copy\');">'+fav_selenews+'</textarea>';
    bljg=bljg+'<p><span class="aclick" href="javascript:void(null);" onclick="javascript:fav_clear_klsnews();">清空</span> ';
    bljg=bljg+textarea_buttons_b('textarea_selenium_fav','发送到临时记事本,发送地址')+' 行数：'+fav_selenews.split('\n').length;

    bljg=bljg+'</p></form>\n';
    document.getElementById('divhtml').innerHTML='';
    document.getElementById('divhtml2').innerHTML=bljg;
}

function fav_clear_klsnews(){
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空') || '').trim()==rndstr){
        localStorage.setItem('fav_selenews','');
        fav_show_klsnews();
    }
}

function fav_add_klsnews(ospan){
    var fav_selenews=localStorage.getItem('fav_selenews') || '';
    var str_t=fav_link_title_klsnews(ospan)+'\n';
    var cstype=ospan.innerText;
    if (cstype=='⚪'){
        ospan.innerText='🔴';
        if (fav_selenews.includes(str_t)){return;}
        localStorage.setItem('fav_selenews',(fav_selenews+str_t).replace(new RegExp(/\n\n/,'g'),'\n'));
    }
    else if (cstype=='🔴'){
        ospan.innerText='⚪';
        if (!fav_selenews.includes(str_t)){return;}
        localStorage.setItem('fav_selenews',fav_selenews.replace(str_t,'\n').replace(new RegExp(/\n\n/,'g'),'\n'));
    }
}

function fav_status_klsnews(){
    var fav_selenews=local_storage_get_b('fav_selenews',-1,true);
    var ospans=document.querySelectorAll('span.span_content');
    var link_title_list=[];
    for (let item of ospans){
        link_title_list.push([item,fav_link_title_klsnews(item)]);
    }

    for (let item of fav_selenews){
        for (let one_span of link_title_list){
            if (one_span[1]==item){
                one_span[0].parentNode.querySelector('span.span_fav').innerText='🔴';
                break;
            }
        }
        //for (let one_span of ospans){
            //if (fav_link_title_klsnews(one_span)==item){
                //one_span.parentNode.querySelector('span.span_fav').innerText='🔴';
                //break;
            //}
        //}
    }
}

function finish_site_klsnews(sitename,ospan){
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
    }
    else {
        if (!finished_sites.includes(key_value+','+sitename)){
            localStorage.setItem('finished_selenews',key_value+','+sitename+'\n'+finished_sites.join('\n'));
        }
        ospan_isfinished.innerHTML='已阅';
    }
}

function classify_sites_klsnews(bottom_eng=false,sort_by_day=false){
    function sub_classify_sites_klsnews_link(bly,blxl){
        var str_t='<p ';
        if (bly % 2 == 1){
            str_t=str_t+'style="padding:0.5rem;font-size:1rem;background-color:#efefef;"';
        }
        else {
            str_t=str_t+'style="padding:0.5rem;font-size:1rem;"';
        }
        str_t=str_t+'>'+bly+'. '+longtxts_klsnews(selected_list[blxl]);
        str_t=str_t+'</p>';
        return str_t;
    }
    function sub_classify_sites_klsnews_head(divstyle,blno,cstotal,thetag,isfinished,str_t,more_t,bly){
        var bljg='<div class="div_masonry" style="'+divstyle+'">';
        bljg=bljg+'<a name="a_site_num_'+blno+'"></a>';
        bljg=bljg+'<p style="padding:0.5rem;font-weight:bold;font-size:1rem;">'+blno+'/'+cstotal+'. ';
        bljg=bljg+'<span class="span_site_name" style="cursor:pointer;" onclick="javascript:fav_all_klsnews(this);">'+thetag+'</span>';
        if (isfinished){
            bljg=bljg+' <span style="cursor:pointer;" onclick="javascript:finish_site_klsnews(\''+thetag+'\',this);">('+(bly-1)+') <span class="span_isfinished" style="color:'+scheme_global['a-hover']+';">已阅</span></span>';
        }
        else {
            bljg=bljg+' <span style="cursor:pointer;" onclick="javascript:finish_site_klsnews(\''+thetag+'\',this);">('+(bly-1)+') <span class="span_isfinished" style="color:'+scheme_global['a-hover']+';"></span></span>';
        }
        bljg=bljg+'</p>';
        bljg=bljg+str_t;
        if (more_t!==''){
            var divid_t='div_more_'+blno;
            bljg=bljg+'<p id="p_more_'+blno+'"><a href="javascript:void(null);" onclick=\'javascript:document.getElementById("'+divid_t+'").style.display="block";document.getElementById("p_more_'+blno+'").style.display="none";masonrydiv_klsnews();\'>more...</a></p>';
            bljg=bljg+'<div id="'+divid_t+'" style="display:none;">'+more_t+'</div>';
        }
        bljg=bljg+'</div>';
        return bljg;
    }
    //--------------------------------------------
    var selected_list=filter_list_klsnews();
    //形如 - 保留注释：
    //[ "https://www.theverge.com/2019/3/23/18278557/apple-iphone-11-wireless-charging-other-devices-airpods-watch-rumor", "Apple’s next iPhone might be able to wirelessly charge other devices", "2019-03-25", "Apple next iPhone might be able to wirelessly charge other devices", "The Verge" ]
    //以下两行排序必要 - 保留注释
    selected_list.sort(function (a,b){return sort_by_date_b(a,b,true,2,1,false,true);});
    selected_list.sort(function (a,b){
        return a[3].localeCompare(b[3],"zh");
    });

    var thetag='';
    var str_t='';
    var more_t='';
    var bly=1;
    var bljg_list=[];
    var date_t = new Date(); 
    //var today_t=date_t.getDate();
    var ospan=document.getElementById('span_search_key');
    if (ospan){
        var key_html_t=ospan.innerHTML;
    }
    else {return;}
    var dividednum_list=key_html_t.match(/\d/g);
    if (dividednum_list){
        var today_t=asc_sum_b(dividednum_list.join());
    }
    else {
        var today_t=asc_sum_b(key_html_t);
    }
    //if (bottom_eng && today_t % 5 ==0){
        //bottom_eng=false;
    //}
    today_t=100+today_t%31; //如果+1，而不是+100，则出现后面的整除后都余0的情况
	if (ismobile_b()){
		var divstyle='padding:0rem; margin:0.2rem 0rem; border:2px dashed #c0c0c0;';
	}
    else {
        var divstyle='padding:0rem;margin:0.5rem 0rem; border:2px dashed #c0c0c0;word-break:normal; word-wrap:normal;';
        //position:relative;float:left;max-width:330px; - 保留注释
    }
    
    for (let blxl=0;blxl<selected_list.length;blxl++){
        if (thetag==''){
            thetag=selected_list[blxl][3];
        }
        if (thetag!==selected_list[blxl][3]){
            if (sort_by_day){
                bljg_list.push([asc_sum_b(thetag)%today_t,thetag,str_t,more_t,bly]);
            }
            else {
                bljg_list.push([0,thetag,str_t,more_t,bly]);
            }
            
            //console.log(thetag,asc_sum_b(thetag),today_t,asc_sum_b(thetag)%today_t); - 保留注释
            
            str_t='';
            more_t='';
            bly=1;
            thetag=selected_list[blxl][3];
        }
        if (bly<=20){
            str_t=str_t+sub_classify_sites_klsnews_link(bly,blxl);
        }
        else {
            more_t=more_t+sub_classify_sites_klsnews_link(bly,blxl);
        }
        bly=bly+1;
    }

    if (str_t!==''){
        if (sort_by_day){
            bljg_list.push([asc_sum_b(thetag)%today_t,thetag,str_t,more_t,bly]);
        }
        else {
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
    if (bottom_eng){
        var maxnum=0;
        for (let item of bljg_list){
            maxnum=Math.max(maxnum,item[0])+1;  //如果不+1,则 maxnum 可能是 0 - 保留注释
        }
        var removestr='[”“’‘„–—‒…‚・⨯]';
        for (let blxl=0;blxl<bljg_list.length;blxl++){
            //适用 www 数据库 - 保留注释
            if (sites_en_cn_global["cn"].includes(bljg_list[blxl][1])){
                console.log(0,bljg_list[blxl][1]);
                continue;
            }
            else if (sites_en_cn_global["en"].includes(bljg_list[blxl][1])){
                console.log(1,bljg_list[blxl][1]);
                bljg_list[blxl][0]=bljg_list[blxl][0]+maxnum;
                continue;
            }            
            //适用 www 数据库以外；网站名中含有中文 - 保留注释
            else if ((bljg_list[blxl][1].replace(new RegExp(removestr,'g'),'').trim().match(/[^\x00-\xff]/) || []).length>0){
                console.log(2,bljg_list[blxl][1]);
                continue;
            }
            //适用全部数据库；第一条记录中含有中文数量少于2个 - 保留注释
            else if ((bljg_list[blxl][2].split('</p>')[0].trim().replace(new RegExp(removestr,'g'),'').match(/[^\x00-\xff]/g) || []).length<=1){
                console.log(3,bljg_list[blxl][1]);
                bljg_list[blxl][0]=bljg_list[blxl][0]+maxnum;
            }
            //以下四行保留注释
            //else {
                //console.log(bljg_list[blxl][0],bljg_list[blxl][1],bljg_list[blxl][1].replace(new RegExp(removestr,'g'),'').trim().match(/[^\x00-\xff]/));
                //console.log(bljg_list[blxl][2].split('</p>')[0].trim().replace(new RegExp(removestr,'g'),'').match(/[^\x00-\xff]/g));
            //}
        }
    }
    bljg_list.sort(function (a,b){return a[0]-b[0];});
    var a_site_num_links='';
    
    var finished_sites=local_storage_get_b('finished_selenews',-1,true);
    var key_value=document.getElementById('span_search_key').innerText;
    key_value=(key_value.match(/\d{4}\-\d{2}\-\d{2}/g) || [""])[0];
    for (let blxl=0;blxl<bljg_list.length;blxl++){
        if (blxl % 10 == 0){
            bljg=bljg+'<div class="div_masonry" style="width:100%;"><h3>第 '+(1+blxl/10)+' 部分</h3></div>';
        }
        
        bljg=bljg+sub_classify_sites_klsnews_head(divstyle,blxl+1,bljg_list.length,bljg_list[blxl][1],finished_sites.includes(key_value+','+bljg_list[blxl][1]),bljg_list[blxl][2],bljg_list[blxl][3],bljg_list[blxl][4]);
 
        a_site_num_links=a_site_num_links+'<option value="#a_site_num_'+(blxl+1)+'">'+(blxl+1)+'. '+bljg_list[blxl][1]+'</option>';
        //第n部分 增加标签分组 - ToDo
    }
    //console.log(bljg_list);
    odiv2.innerHTML='<div class="div_masonry" style="'+divstyle+'"><select onchange="document.location.href = this.value;">'+a_site_num_links+'</select>'+' <a id="a_open_all" href="javascript:void(null);" onclick=\'javascript:this.style.display="none";open_all_more_klsnews();\' class="aclick">全部展开</a></div>'+bljg;
    masonrydiv_klsnews();
    
    //enwords----
    words_translate_klsnews();
    //----
    document.location.href = "#content";
    fav_status_klsnews();
    
    top_bottom_arrow_b('div_top_bottom',sourcelist.length+' ');
}

function words_translate_klsnews(){
    var oinput_enwords=document.getElementById('input_enwords');
    if (!oinput_enwords){
        return;
    }
    if (checkbox_kl_value_b('input_enwords')){
        var enwords_temp=[];
        var enwords_temp_no=[];
        for (var blxl=0;blxl<enwords.length;blxl++){
            if (enwords_easy.includes(enwords[blxl][0].toLowerCase())){
                continue;
            }
            enwords_temp.push(enwords[blxl][0].toLowerCase());
            enwords_temp_no.push(blxl);
        }
        var odiv2as=document.querySelectorAll('a.a_news_link');
        var bltotal=0;
        for (var blxl=odiv2as.length-1;blxl>=0;blxl--){
            //单词总数控制 - 保留注释
            if (bltotal>50){break;}
            var str_t=odiv2as[blxl].innerText;
            if (str_t){
                list_t=str_t.match(/\b[a-zA-Z]+\b/g);
                //数量控制 - 保留注释
                if (list_t==null || list_t.length<6){
                    continue;
                }
                var bly=0;
                for (var blx in list_t){
                    if (list_t[blx]=='' || enwords_easy.includes(list_t[blx]) || enwords_easy.includes(list_t[blx].toLowerCase())){
                        continue;
                    }
                    
                    var at_t=enwords_temp.indexOf(list_t[blx].toLowerCase());
                    if (at_t>=0) {
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
        masonrydiv_klsnews();
        document.getElementById('label_translation').innerHTML='<span style="color:red;font-size:0.8rem;font-weight:normal;">(已翻译)</span>';
    }
    else {
        document.getElementById('label_translation').innerHTML='';
    }
}

function rnd_search_window_klsnews(){
    var odiv2as=document.querySelectorAll('a.a_news_link');
    var list_len=odiv2as.length;
    if (list_len==0){
        clearInterval(rnd_open_window_klsnews_global);
        return;
    }
    var str_t='';
    for (var blxl=0;blxl<1;blxl++){
        var item=randint_b(0,list_len);
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
    'https://www.dogedoge.com/results?q=',
    'https://cn.bing.com/search?q=',
    'http://www.chinaso.com/search/pagesearch.htm?q=',
    'https://m.toutiao.com/search/?keyword=',
    'https://www.ecosia.org/search?q=',
    ];
    var nmax=Math.ceil(Math.random()*5);
    for (let blxl=0;blxl<nmax;blxl++){
        websites.sort(randomsort_b);
    }
    window.open(websites[0]+str_t,'rnd_news_window');
}

function rnd_window_klsnews(){
    var odiv2as=document.querySelectorAll('a.a_news_link');
    var list_len=odiv2as.length;
    if (list_len==0){
        clearInterval(rnd_open_window_klsnews_global);
        return;
    }
    var item=randint_b(0,list_len);
    console.log('rndhref',odiv2as[item].href);
    window.open(odiv2as[item].href,'rnd_news_window');
}

function masonrydiv_klsnews(){
    if (ismobile_b()==false){
        try {
            var msnry = new Masonry( document.getElementById('divhtml2'), {
              itemSelector: '.div_masonry',
              columnWidth: 200
            });
        }
        catch (error) {
            //do nothing
        }
    }
}

function filter_list_klsnews(){
    function sub_filter_list_klsnews_selected(){
        var selected_list=[];
        for (let one_row of sourcelist){
            selected_list.push(one_row);
        }
        return selected_list;
    }
    //--------------------------
    var oinput_focus=document.getElementById('input_focus');
    if (!oinput_focus){
        return sub_filter_list_klsnews_selected();
    }
    var focus=checkbox_kl_value_b('input_focus'); //oinput_focus.checked;
    var selected_list=[];
    if (focus){        
        var focus_list=sort_keys_klsnews();
        for (let one_row of sourcelist){
            for (let one_key of focus_list) {
		        if (one_key==''){continue;}
                if (one_row[0].toLowerCase().includes(one_key) || one_row[1].toLowerCase().includes(one_key)){
                    selected_list.push(one_row);
                    break;
                }
            }
        }
    }
    else {
        return sub_filter_list_klsnews_selected();
    }
    return selected_list;    
}

function rowid_change_klsnews(cstype=1){
    if (sourcelist.length==0){return;}
    var oinput=document.getElementById('input_rowid');
    //下一页
    if (cstype==1){
        oinput.value=sourcelist[sourcelist.length-1][5];
    }
    //上一页
    else if (cstype==-1) {
        oinput.value=sourcelist[0][5];
    }
    else {
        oinput.value='';
    }
    document.getElementById('input_direction').value=cstype;
    document.getElementById('form_search').submit();
}

function next_dbc_search_klsnews(){
    if (sourcelist.length>0){return;}
    var oselect=document.getElementById('select_dbfname');
    if (oselect){
        var options=oselect.getElementsByTagName('option');
        var blxl=0;
        for (blxl=0;blxl<options.length;blxl++){
            if (options[blxl].selected){
                break;
            }
        }
        if (blxl==options.length-1){return;}
        options[blxl+1].selected=true;
        document.getElementById('form_search').submit();
    }
}

function getlines_simple_klsnews(){
    if (sourcelist.length==0){
        document.getElementById('divhtml').innerHTML='';
        return;
    }
    var bljg='';
    var blpage='';
    if (max_row_id_global!==-1 && sourcelist[0][5]<max_row_id_global){
        blpage=blpage+'<a class="aclick" href="javascript:void(null);" onclick="javascript:rowid_change_klsnews(-1);">上一页</a> ';
    }
    if (min_row_id_global!==-1 && sourcelist[sourcelist.length-1][5]>min_row_id_global){
        blpage=blpage+'<a class="aclick" href="javascript:void(null);" onclick="javascript:rowid_change_klsnews(1);">下一页</a>';
    }
    if (blpage!==''){
        blpage='<a class="aclick" href="javascript:void(null);" onclick="javascript:rowid_change_klsnews(0);">第一页</a> '+blpage;
        blpage='<p align=right>'+blpage+'</p>';
    }
    
    //bljg=bljg+blpage;
	for (let item of sourcelist){
        bljg=bljg+'<p style="font-size:1.1rem;padding:0.2rem 0.5rem;border:0.1rem solid '+scheme_global["background"]+';" onmouseover="javascript:this.style.border=\'0.1rem solid '+scheme_global["shadow"]+'\';" onmouseout="javascript:this.style.border=\'0.1rem solid '+scheme_global["background"]+'\';">';
        bljg=bljg+longtxts_klsnews(item,true);
        bljg=bljg+'</p>';
	}

    bljg=bljg+blpage;
    
	document.getElementById('divhtml').innerHTML=bljg;

    fav_status_klsnews();
}

function getlines_klsnews(csno=1,cslines=50,jssearchkey=''){
    function sub_getlines_pages_klsnews(csno,cslines,bllength,jssearchkey){
        var bljg='<p align=right>';
        bljg=bljg+'<span style="cursor:pointer;" onclick=\'javascript:getlines_klsnews(1,50,"'+jssearchkey+'");\'><b>第一页</b></span> · ';
        if (csno-cslines>=0){
        bljg=bljg+'<span style="cursor:pointer;" onclick=\'javascript:getlines_klsnews('+(csno-cslines)+', '+cslines+',"'+jssearchkey+'");\'><b>上一页</b></span> · ';
        }
        if (csno+cslines<bllength){
        bljg=bljg+'<span style="cursor:pointer;" onclick=\'javascript:getlines_klsnews('+(csno+cslines)+', '+cslines+',"'+jssearchkey+'");\'><b>下一页</b></span>';
        }
        return bljg+'</p>';
    }
    //---------
    var bljg='';
    var selected_list=filter_list_klsnews();
    if (jssearchkey!==''){
        var selected_list2=[];
        for (var blxl in selected_list){
            var blfound=str_reg_search_b(selected_list[blxl],jssearchkey.split(' '),false);
            if (blfound==-1){
                break;
            }

            if (blfound){
                selected_list2.push(selected_list[blxl]);
            }
        }
        selected_list=selected_list2;
    }
    
    var bllength=selected_list.length;

    var pagehtml=sub_getlines_pages_klsnews(csno,cslines,bllength,jssearchkey);
    bljg=bljg+pagehtml;
    
	for (var blxl=csno-1;blxl<csno+cslines-1;blxl++){
		if (blxl>=bllength){break;}
        if (blxl % 2==0) {
            bljg=bljg+'<p style="font-size:1.1rem;padding:0.2rem 0.5rem;">';
        }
        else {
            bljg=bljg+'<p style="font-size:1.1rem;background-color:#efefef;padding:0.2rem 0.5rem;">';
        }
        bljg=bljg+(blxl+1)+'. ';
        bljg=bljg+longtxts_klsnews(selected_list[blxl],true);
        bljg=bljg+'</p>';
	}
	
	bljg=bljg+pagehtml;
	
	document.getElementById('divhtml').innerHTML=bljg;
    var odivhtml2=document.getElementById('divhtml2');
    if (odivhtml2){
        odivhtml2.innerHTML='';
        odivhtml2.style.cssText='margin:0 0.5rem;';
    }
    words_translate_klsnews();
    
	document.location.href = "#content";
    fav_status_klsnews();
}

function dbc_list_klsnews(cskeys,csshow_websites=false,csoneday=false){
    var bljg='';
    var dbc_count=selenium_dbc_global.length;
    if (dbc_count==1){
        var html_file='index.htm';
        var space_str='';
    }
    else {
        var html_file='selenium_news_reader_offline.htm';
        var space_str=' ';
    }
    for (var blxl=0;blxl<dbc_js_files.length;blxl++){
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
            }
            else {
                if (csoneday){continue;}
                else{bljg=bljg+file_date2+': ';}
            }
        }
        for (let item of selenium_dbc_global){
            var str_t=file_date+'_'+item[0];
            if (dbc_count==1){
                var html_title=file_date2;
            }
            else {
                var html_title=item[1];
            }
            if (csshow_websites==false && cskeys.substring(0,10)==file_date && cskeys.split('_')[1]==item[0]){
                bljg=bljg+'<a class="a_oblong_box" href="'+html_file+'?day_dbf='+str_t+'"><font color=red><b>'+html_title+'</b></font></a>'+space_str;
            }
            else {
                bljg=bljg+'<a class="a_oblong_box" href="'+html_file+'?day_dbf='+str_t+'">'+html_title+'</a>'+space_str;
            }
        }

        bljg=bljg+' ';
    }
    document.getElementById('div_dbcname').innerHTML=bljg;
}

function dbc_list2_klsnews(cskeys){
    //cskyes 形如 2019-05-30_www - 保留注释
    var list_t=[];
    var dbc_count=selenium_dbc_global.length;
    if (dbc_count==1){
        var html_file='index.htm';
    }
    else {
        var html_file='selenium_news_reader_offline.htm';
    }
    for (var file_date of dbc_js_files){
        for (let item of selenium_dbc_global){
            var str_t=file_date+'_'+item[0];
            var html_title=item[1];
            var href_link=html_file+'?day_dbf='+str_t;
            if (item[0]=='www'){
                href_link=href_link+'&expand';
            }
            if (cskeys.substring(0,10)==file_date && cskeys.split('_')[1]==item[0]){
                list_t.push('<a href="'+href_link+'"><font color=red><b>'+file_date+' '+html_title+'</b></font></a>');
            }
            else {
                list_t.push('<a href="'+href_link+'">'+file_date+' '+html_title+'</a>');
            }
        }
    }
    return list_t;
}

function dbc_list3_klsnews(){
    var bljg='';
    var currentvalue=document.getElementById('select_dbfname').value;
    for (let blxl=0;blxl<selenium_dbc_global.length;blxl++){
        bljg=bljg+'<a ';
        if (currentvalue==selenium_dbc_global[blxl][0]){
            bljg=bljg+'style="text-decoration:none;color:'+scheme_global["color"]+';" ';
        }
        else {
            bljg=bljg+'style="text-decoration:none;color:'+scheme_global["memo"]+';" ';
        }
        bljg=bljg+'href="javascript:void(null);" onclick="javascript:dbc_select_submit('+blxl+');">';
        bljg=bljg+selenium_dbc_global[blxl][1];
        bljg=bljg+'</a> ';
    }
    document.getElementById('div_dbc').innerHTML=bljg;
}

function dbc_select_submit(csvalue){
    document.getElementById('select_dbfname').value=selenium_dbc_global[csvalue][0];
    var oas=document.querySelectorAll('div#div_dbc a');
    for (let alink of oas){
        if (alink.innerHTML==selenium_dbc_global[csvalue][1]){
            alink.style.color=scheme_global["color"];
        }
        else {
            alink.style.color=scheme_global["memo"];
        }
    }
    document.getElementById('form_search').submit();
}

function title_menu_klsnews(cskeys,js_or_php=''){
    //cskyes 形如 2019-05-30_www - 保留注释
    var another_page=[];
    if (js_or_php=='js'){
        another_page=['<a href="selenium_news_reader.php">PHP版</a>'];
    }
    else if (js_or_php=='php'){
        another_page=[
        '<a href="selenium_news_reader_offline.htm">离线版</a>',
        '<a href="?search=0(:iscn)&limit=1000&input_random">随机1000条英文信息</a>',
        ];
    }
    var str_t=klmenu_hide_b('');
    var menu_list1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'classify_sites_klsnews();">按网站分类</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'classify_sites_klsnews(true);">按网站分类(中上英下)</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'classify_sites_klsnews(false,true);">按网站分类(ASC排序)</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'sourcelist.sort(randomsort_b);getlines_klsnews();">乱序</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'sourcelist.sort(function (a,b){return sort_by_date_b(a,b,true,2,1,false,true);});getlines_klsnews();">按日期排序</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'sourcelist.sort(function (a,b){return zh_sort_b(a,b,false,1);});getlines_klsnews();">按标题排序</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'fav_show_klsnews();">收藏</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'sentence_new_words_klsnews();">显示生词</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'newwords_klsnews();">热门生词</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'clearInterval(rnd_open_window_klsnews_global);rnd_window_klsnews();rnd_open_window_klsnews_global=setInterval(rnd_window_klsnews,60000);">随机访问</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'clearInterval(rnd_open_window_klsnews_global);rnd_search_window_klsnews();rnd_open_window_klsnews_global=setInterval(rnd_search_window_klsnews,20000);">随机搜索</span>',    
    ];
    menu_list1=another_page.concat(menu_list1);
    
    var menu_list3=[
    '<span class="span_menu" onclick="javascript:'+str_t+'statistics_sites_klsnews();">当前页网站列表</span>',
    ];

    if (js_or_php=='php'){
        menu_list3.push('<a href="?dbf='+cskeys+'&countdays=30">最近30天更新统计</a>');
    }       

    var menu_list2='';
    if (js_or_php=='js' && cskeys!==''){
        menu_list2=dbc_list2_klsnews(cskeys);
        return klmenu_multi_button_div_b(klmenu_b(menu_list1,'','13rem','1.1rem','0.9rem')+klmenu_b(menu_list3,'⚙','12rem','1.1rem','0.9rem','30rem')+klmenu_b(menu_list2,'🛢','12rem','1.1rem','0.9rem','30rem'),'','0rem');
    }
    else {
        return klmenu_multi_button_div_b(klmenu_b(menu_list1,'','13rem','1.1rem','0.9rem')+klmenu_b(menu_list3,'⚙','12rem','1.1rem','0.9rem','30rem'),'','0rem');
    }
}

function buttons_klsnews(){
    var button_size='0.9rem;'
    var button_more='';
    button_more=button_more+'<div class=klmenu><button style="font-size:'+button_size+';">'+checkbox_kl_b('input_focus','只显示重点条目')+'</button></div>';
    button_more=button_more+'<div class=klmenu><button style="font-size:'+button_size+';">'+checkbox_kl_b('input_enwords','单词翻译')+'</button></div>';
    button_more=button_more+'<div class=klmenu><button style=font-size:'+button_size+';" onclick="javascript:popup_show_hide_b(\'div_selenium_keywords\');">关键词</button></div>';
    
    document.getElementById('div_show_hide').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(button_more,'block','0','','div_menu_checkboxes'));
}

function keywords_form_klsnews(){
    var odiv=document.getElementById('div_selenium_keywords');
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_selenium_keywords" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_selenium_keywords" id="textarea_selenium_keywords"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:keywords_read_klsnews();">读取</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:keywords_update_klsnews();">更新</span> ';
    //bljg=bljg+'<input type="submit" value="发送到临时记事本" /> ';
    //bljg=bljg+'<a href="javascript:void(null);" onclick="javascript:kl_remote_host_address_b();" title="设置发送地址">发送地址</a>：'+postpath+'temp_txt_share.php';
    
    bljg=bljg+textarea_buttons_b('textarea_selenium_keywords','发送到临时记事本,发送地址');    

    bljg=bljg+'</p>';
    bljg=bljg+'</form>';
    odiv.innerHTML=bljg;
    keywords_read_klsnews();
}

function keywords_update_klsnews(){
    var otextarea=document.getElementById('textarea_selenium_keywords');
    if (otextarea){
        var list_t=otextarea.value.trim().split(',');
        list_t=array_unique_b(list_t);
        list_t.sort();
        if (confirm("是否更新("+list_t.length+")？")){
            var blstr=list_t.join(',');
            localStorage.setItem('keywords_selenium',blstr);
            otextarea.value=blstr;
        }
    }
}

function keywords_read_klsnews(){
    var otextarea=document.getElementById('textarea_selenium_keywords');
    if (otextarea){
        otextarea.value=local_storage_get_b('keywords_selenium',-1);
    }
}
