function menu_klwebsites(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'search_in_site_options_klwebsites();">search in site</span>',        
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'http://\');">http_https check</span>',
    '<span class="span_menu" onclick="'+str_t+'qr_html_klwebsites();">qr</span>',
    '<span id="span_veil_web" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ QR遮罩</span>',
    '<span class="span_menu" onclick="'+str_t+'new_filter_form_klwebsites();">新网址过滤</span>',   
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    '<span class="span_menu" onclick="'+str_t+'window_open_klwebsites();">New Window</span>',
    ];

    var list_t=[
    ['RSS','rss_klwebsites();',true],
    ['Weibo','weibo_klwebsites();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,list_t,'List: '));    
    
    var klmenu_search=[
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^1,[01],0$\');">Selenium</span>',        
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^1,1,0$\');">Selenium CN</span>',
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^1,0,0$\');">Selenium EN</span>',
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^0,0,1$\');">non Selenium</span>',
    '<span class="span_menu" onclick="'+str_t+'waterfall_klwebsites();">waterfall</span>',
    ];
    
    //---
    var tag_list={};
    var fav_set=fav_www_get_websites_b();
    fav_websites_global=[];
    for (let item of sites_all_global){
        if (fav_set.has(item[0])){
            fav_websites_global.push([item[0],item[1]]);
        }
        var blat=item[2].indexOf(',');
        if (blat==-1){continue;}
        var bltag=item[2].substring(blat+1,).trim();
        if (bltag==''){continue;}
        var list_t=bltag.split(',');
        for (let atag of list_t){
            if (tag_list[atag]==undefined){
                tag_list[atag]=0;
            }
            tag_list[atag]=tag_list[atag]+1;
        }
    }
    
    var klmenu_tag=tag_menu_websites_b(tag_list,'search_klwebsites',str_t);
    
    var klmenu_config=[
    '<span class="span_menu" onclick="'+str_t+'demo_style_klwebsites();">PWA Demo Style</span>',   
    '<span id="span_jieba_web" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ jieba分词</span>',
    ];    
    //---
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🕸','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_tag,'#','10rem','1rem','1rem','60rem')+klmenu_b(klmenu_search,'𓅸','10rem','1rem','1rem','60rem')+fav_www_menu_websites_b('',false)+klmenu_b(klmenu_config,'⚙','13rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_veil_web',true);        
}

function new_filter_form_klwebsites(){
    var bljg='<h4>输入待过滤的网址 <span style="font-weight:normal;font-size:0.9rem"><b>格式如：</b>"#http://www.puppylinux.com/","","Puppy",20,"软件" <b>或</b> "https://nymag.com/","nymag.","New York Magazine",18,"资讯"</span></h4>';
    bljg=bljg+'<textarea id="textarea_filter_raw_klwebsites" style="height:15rem;"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="new_filter_result_klwebsites();">过滤</span>';
    bljg=bljg+'</p>';
    bljg=bljg+'<p><b>已存在相同网址</b><span id="span_filter_exist_href_klwebsites"></span></p>';
    bljg=bljg+'<textarea id="textarea_filter_exist_href_klwebsites" style="height:10rem;"></textarea>';
    bljg=bljg+'<p><b>已存在相同名称</b><span id="span_filter_exist_name_klwebsites"></span></p>';
    bljg=bljg+'<textarea id="textarea_filter_exist_name_klwebsites" style="height:10rem;"></textarea>';
    bljg=bljg+'<p style="margin-top:0.5rem; margin-bottom:0.5rem;"><b>不存在</b><span id="span_filter_nonexist_klwebsites"></span> <span class="oblong_box" onclick="csv_2_html_klwebsites();">html</span></p>';
    bljg=bljg+'<textarea id="textarea_filter_nonexist_klwebsites" style="height:10rem;"></textarea>';    
    bljg=bljg+'<div id="div_filter_nonexist_klwebsites" style="column-count:'+(ismobile_b()?2:4)+';"></div>';    
    bljg=bljg+'<p><b>error</b><span id="span_filter_error_klwebsites"></span></p>';
    bljg=bljg+'<textarea id="textarea_filter_error_klwebsites" style="height:10rem;"></textarea>';       
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));    
}

function csv_2_html_klwebsites(){
    var odiv=document.getElementById('div_filter_nonexist_klwebsites');
    if (!odiv){return;}
    var otextarea=document.getElementById('textarea_filter_nonexist_klwebsites');
    if (!otextarea){return;}
    
    var list_t=otextarea.value.trim().split('\n');
    var result_t=[];
    for (let arow of list_t){
        arow=arow.trim();
        if (arow==''){continue;}
        try {
            arow=eval('['+arow+']');
            if (arow.length<4){continue;}
            result_t.push('<a href="'+arow[0]+'" onclick="this.style.backgroundColor=\''+scheme_global['pink']+'\';" target=_blank>'+arow[2]+'</a> ('+arow[3]+')');
        }
        catch (e){
            //pass
        }
    }
    if (result_t.length==0){return;}
    odiv.innerHTML=array_2_li_b(result_t);
}

function new_filter_result_klwebsites(){
    var raw_list=document.getElementById('textarea_filter_raw_klwebsites').value.trim().split('\n');
    var result_t={'exist_href':[],'exist_name':[],'nonexist':[],'error':[]};

    var href_set=new Set();
    var name_set=new Set();
    for (let item of sites_all_global){
        href_set.add(item[0]);
        name_set.add(item[1]);
    }
    
    for (let arow of raw_list){
        arow=arow.trim();
        if (arow==''){continue;}
        
        try {
            var list_t=eval('['+arow+']');
            if (!Array.isArray(list_t)){
                result_t['error'].push(arow);
                result_t['error'].push('不是数组');          
                continue;      
            }
            if (list_t.length==0){
                result_t['error'].push(arow);
                result_t['error'].push('数组为空');          
                continue;      
            }
            var blhref=list_t[0];
            var blat=blhref.indexOf('http');
            if (blat==-1){
                result_t['error'].push(arow);
                result_t['error'].push('无http');          
                continue;     
            }
            blhref=blhref.substring(blat,);
            if (href_set.has(blhref)){
                result_t['exist_href'].push(arow);
            }
            else if (list_t.length>=3){
                if (name_set.has(list_t[2])){
                    result_t['exist_name'].push(arow);
                }
                else {
                    result_t['nonexist'].push(arow);          
                }
            }
            else {
                result_t['nonexist'].push(arow);            
            }
        }
        catch (error){
            result_t['error'].push(arow);
            result_t['error'].push(error.message);
            continue;
        }
    }
    
    for (let one_key of Object.keys(result_t)){
        document.getElementById('textarea_filter_'+one_key+'_klwebsites').value=result_t[one_key].join('\n');
        document.getElementById('span_filter_'+one_key+'_klwebsites').innerHTML=' ('+result_t[one_key].length+')';        
    }
}

function rss_klwebsites(){
    var blkey='';
    var oinput=document.getElementById('input_search');
    if (oinput){
        blkey=oinput.value.trim();
    }
    
    let arrays=array_klwebsites(blkey);
    var result_t=[];
    for (let arow of arrays){
        var item=sites_all_global[arow[1]];
        if (item[4]==''){continue;}
        
        var blname=specialstr92_b(item[1]);
        result_t.push([blname,'<span class="span_rss"><a class="a_oblong_box a_rss_name" href="'+arow[0]+'" target=_blank>'+blname+'</a> <a class="a_rss_link" href="'+item[4]+'" target=_blank>'+item[4]+'</a></span>']);
    }

    result_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    for (let blxl=0;blxl<result_t.length;blxl++){
        result_t[blxl]=result_t[blxl][1];
    }

    var bljg=array_2_li_b(result_t,'li','ol','','','margin-bottom:0.2rem;');
    if (ismobile_b()==false){
        bljg='<div style="column-count:2;">'+bljg+'</div>';
    }
    var blbutton='<p>';
    blbutton=blbutton+'<span class="aclick" onclick="opml_klwebsites();">opml</span>';
    blbutton=blbutton+'</p>';
    
    document.getElementById('divhtml').innerHTML=bljg+blbutton;
}

function opml_klwebsites(){
    var opml_list=[];    
    var ospans=document.querySelectorAll('div#divhtml span.span_rss');
    console.log(ospans);
    for (let one_span of ospans){
        var oa1=one_span.querySelector('a[class="a_oblong_box a_rss_name"]');
        var oa2=one_span.querySelector('a.a_rss_link');
        if (!oa1 || !oa2){continue;}
        var blname=specialstr92_b(oa1.innerText);
        opml_list.push('	<outline text="'+blname+'" htmlUrl="'+oa1.href.replace(new RegExp('&','g'),'&amp;')+'" language="unknown" title="'+blname+'" type="rss" version="RSS" xmlUrl="'+oa2.href.replace(new RegExp('&','g'),'&amp;')+'"/>');
    }
    opml_list.sort(function (a,b){return zh_sort_b(a,b);});
    
    var opml_str=`<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
<head>
<title>websites.opml</title>
<dateCreated>`+new Date().toUTCString()+`</dateCreated>
</head>
<body>`;    
    opml_str=opml_str+'\n'+opml_list.join('\n')+'\n</body>\n</opml>\n';    
    string_2_txt_file_b(opml_str,'websites_opml.opml','opml');
}

function demo_style_klwebsites(){
    var list_t=demo_content_klwebsites();
    
    var postpath=postpath_b();
    var bljg='';
    bljg=bljg+'<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_demo_style_sites" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_demo_style_sites" id="textarea_demo_style_sites" style="height:20rem;">'+list_t.join('\n')+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+textarea_buttons_b('textarea_demo_style_sites','全选,清空,复制,发送到临时记事本,发送地址');    
    bljg=bljg+'</form>\n';
    bljg=bljg+' rows：'+list_t.length;        
    bljg=bljg+'</p>';
    document.getElementById('div_sub_content').innerHTML=bljg;
}

function selenium_show_hide_klwebsites(){
    var oas=document.querySelectorAll('div#divhtml a.a_oblong_box');
    if (oas.length<1){return;}
    for (let one_link of oas){
        if (one_link.style.backgroundColor!==''){
            continue;
        }
        if (one_link.style.display=='none'){
            one_link.style.display='';
        }
        else {
            one_link.style.display='none';
        }
    }
}

function one_link_klwebsites(cshref,csxl,csnumber,is_selenium_site,ico_type){
    var bljg='<a href="'+cshref+'" target=_blank class="a_oblong_box"';
    if (today_clicked_websites_global.has(cshref)){
        bljg=bljg+' style="background-color: '+scheme_global['pink']+';"';    
    }
    else if (is_selenium_site){
        bljg=bljg+' style="background-color: '+scheme_global['button']+';"';
    }
    bljg=bljg+' onclick="recent_websites_b(this);">';
    var sitename_t=sites_all_global[csxl][1];

    if (sites_all_global[csxl][3]<=1 && csnumber>1){
        bljg=bljg+'<font color=red>'+sitename_t+'</font>';
    }
    else if (sites_all_global[csxl][3]>25 && csnumber>-1){
        bljg=bljg+'<font color=gray>'+sitename_t+'</font>';
    }
    else {
        bljg=bljg+sitename_t;
    }
    bljg=bljg+icon_websites_b(cshref,ico_type)+'</a>';
    if (sites_all_global[csxl][2].includes('登陆')){
        bljg=bljg+'🚪';
    }
    if (cshref.includes('//weixin.qq.com/r/')){
        bljg=bljg+'🐧';
    }
    return bljg+' ';
}

function buttons_klwebsites(keyword=''){
    var bljg='<input type="text" id="input_search" style="width:10rem;" value="'+keyword+'" placeholder="搜索" onkeyup="if (event.key==\'Enter\'){search_klwebsites(this.value,999);}" />';
    bljg=bljg+'<span id="span_recent_search" style="font-size:0.8rem;"></span>';
    bljg=bljg+'<span id="span_search_in_site"></span>';
    return bljg;
}

function href_klwebsites(csarray,csnumber=-1,keyword=''){
    var href_str=csarray[0];    //href_str 可以不含有 http，如本地网站 - 保留注释
    if (csarray[3]>csnumber && csnumber>-1){
        return '';
    }
    
    if (keyword!==''){
        var blfound=str_reg_search_b(csarray,keyword,true);
        if (blfound==-1){
            return false;
        }
        if (!blfound){
            return ''
        }
    }

    return href_str;
}

function array_klwebsites(keyword='',csnumber=999){
    function sub_array_klwebsites_add(item,cshref,csxl){
        var blcategory=category_websites_b(enable_jieba,item[1],item[2],keyword);
        if (category_list['w_'+blcategory]==undefined){
            category_list['w_'+blcategory]=[];
        }
        category_list['w_'+blcategory].push([cshref,csxl,blcategory]);   //网址 序号 分类 - 保留注释    
    }
    //-----------------------
    sort_klwebsites();
    
    var fav_set=new Set();
    if (keyword=='FAV'){
        fav_set=fav_www_get_websites_b();
    }
    var category_list={};
    
    var enable_jieba=klmenu_check_b('span_jieba_web',false);
    if (enable_jieba){
        jieba_websites_b(sites_all_global,1);
    }
    
    var href_str='';
    if (fav_set.size==0){
        for (let blxl=0;blxl<sites_all_global.length;blxl++){
            var item=sites_all_global[blxl];
            href_str=href_klwebsites(item,csnumber,keyword);
            
            if (href_str===false){break;}    
            else if (href_str===''){continue;}
            
            sub_array_klwebsites_add(item,href_str,blxl);
        }
    }
    else {
        for (let blxl=0;blxl<sites_all_global.length;blxl++){
            var item=sites_all_global[blxl];
            if (fav_set.has(item[0])){
                sub_array_klwebsites_add(item,item[0],blxl);
            }
        }
    }
    
    var result_t=[];
    for (let key in category_list){
        result_t=result_t.concat(category_list[key]);
    }
    if (enable_jieba){
        result_t.sort(function (a,b){return zh_sort_b(a,b,false,2);});
    }
    return result_t;
}

function waterfall_klwebsites(csnum=5){
    function sub_waterfall_klwebsites_one_site(cshref,cstitle,new_window=true){
        var bllink='<a href="'+cshref+'"'+(new_window?' target=_blank':'')+' onclick="recent_websites_b(this);">'+cstitle+'</a>';
        bllink='<p style="font-size:1.25rem;line-height:2rem;margin-bottom:0.5rem;">'+bllink+'</p>';        
        return bllink;    
    }
    //-------------------------
    var list_t=array_klwebsites('',csnum);
    var result_t={};
    result_t['local']=[sub_waterfall_klwebsites_one_site('?','网址库',false)];
    for (let href_list of list_t){
        var item=sites_all_global[href_list[1]];
        var category=href_list[2];
        if (result_t[category]==undefined){
            result_t[category]=[];
        }        
        var bllink=sub_waterfall_klwebsites_one_site(href_list[0],sites_all_global[href_list[1]][1]);
        result_t[category].push(bllink);
    }
    
    for (let key in result_t){
        result_t[key]=result_t[key].join('\n');
        result_t[key]='<div class="div_masonry" style="margin:0.5rem;padding:1rem;border:0.1rem dotted '+scheme_global['memo']+';">'+result_t[key]+'</div>';        
    }
    result_t=object2array_b(result_t);
    document.getElementById('divhtml').innerHTML=result_t.join('\n');
    var msnry = new Masonry( document.getElementById('divhtml'), {
      itemSelector: '.div_masonry',
      columnWidth: 1,
    });    
    document.getElementById('h2_title').style.display='none';
}

function demo_content_klwebsites(cskey=false){
    if (cskey==false){
        cskey=document.getElementById('input_search').value;
    }
    var result_t=array_klwebsites(cskey,999);
    var demo_list=[];
    for (let href_list of result_t){
        var href_str=href_list[0];
        demo_list.push(sites_all_global[href_list[1]][2]+' '+href_str+' '+sites_all_global[href_list[1]][1].replace(new RegExp(/<\/?small>/,'g'),''));//+same_name_site_klwebsites(href_list[1],true));    
    }
    return demo_list;
}

function category_klwebsites(ospan){
    var ocategory=ospan.parentNode.querySelector('span.span_category_websites');
    if (!ocategory){return;}
    search_klwebsites(ocategory.innerText);
}

function search_klwebsites(keyword='',csnumber=999){
    function sub_search_klwebsites_count(cscount){
        return ' <span class="span_box" style="color:'+scheme_global['memo']+';font-size:0.6rem;" onclick="category_klwebsites(this);"><i>('+cscount+')</i></span>';
    }
    
    function sub_search_klwebsites_input_range(csnumber=1,keyword=''){
        var bljg = '';
        var list_t=[['',1,'M'],['',7,'S'],['',999,'A'],['FAV',999,'F']];
        for (let item of list_t){
            bljg=bljg+'<span class="oblong_box" onclick="search_klwebsites(\''+item[0]+'\','+item[1]+');">';
            if (keyword==item[0] && csnumber==item[1]){
                bljg=bljg+'<font color=red>'+item[2]+'</font>';
            }
            else {
                bljg=bljg+item[2];
            }
            bljg=bljg+'</span> ';
        }
        bljg=bljg+buttons_klwebsites(keyword);
        return bljg;
    }
    //----------------------
    var lineheight=(ismobile_b()?'1.3':'1.8');
        
    var odiv=document.getElementById('divhtml');
    var bljg='';
    
    var result_t=array_klwebsites(keyword,csnumber);

    var ico_type=(is_old_firefox_b()?'old':(is_local_b()?'local':''));
    var category='';
    var blxl2=0;
    var count1=0;
    var count2=0;
    var count3=0;
    var select_str='';
    for (let href_list of result_t){
        var href_str=href_list[0];
        var item=sites_all_global[href_list[1]];
        count1=count1+item[5][0];
        count2=count2+item[5][1];
        count3=count3+item[5][2];
        
        if (category!==href_list[2]){
            category=href_list[2];
            if (bljg!==''){
                bljg=bljg+sub_search_klwebsites_count(blxl2);
                bljg=bljg+'</p>';
            }
            bljg=bljg+'<a name="sites_category_'+href_list[1]+'"></a><p class="p_sites" style="font-size:0.88rem;line-height:'+lineheight+'rem;"><span class="span_category_websites" style="font-weight:bold;cursor:pointer;" title="批量打开" onclick="batch_open_klwebsites(this.parentNode);">'+category+'</span> ';
            blxl2=0;
            select_str=select_str+'<option value="sites_category_'+href_list[1]+'">'+category+'</option>\n';
        }
        
        bljg=bljg+one_link_klwebsites(href_str,href_list[1],csnumber,(item[5][0]>0),ico_type);
        blxl2=blxl2+1;
    }
    
    if (bljg.slice(-4,)!=='</p>'){
        bljg=bljg+sub_search_klwebsites_count(blxl2);
        bljg=bljg+'</p>';
    }
    
    //------------
    select_str='<select style="width:5rem;height:2rem;margin-bottom:0.5rem;" onchange=\'document.location="#"+this.value;\'>'+select_str+'</select>';
    
    bljg='<hr /><p style="line-height:1.45rem;">'+select_str+' '+sub_search_klwebsites_input_range(csnumber,keyword)+'</p><div id="div_sub_content">'+recent_refresh_klwebsites(lineheight)+bljg+random_klwebsites(lineheight)+day_klwebsites(lineheight)+'<p>&nbsp;</p></div>';

    if (keyword=='http://'){
        bljg=bljg+http_klwebsites();
    }
    
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    recent_search_b('recent_search_websites',keyword,'search_klwebsites','span_recent_search',[],15,false);
    
    input_with_x_b('input_search',8);

    var ospan=document.getElementById('span_count');
    if (ospan){
        ospan.innerHTML='<span style="cursor:pointer;" onclick="selenium_show_hide_klwebsites();">sele网站数：'+count1+'</span>，其中CN网址：'+count2+'，其他：'+count3+'，总计：'+(count1+count3);
    }
}

function weibo_klwebsites(){
    var blkey='';
    var oinput=document.getElementById('input_search');
    if (oinput){
        blkey=oinput.value.trim();
    }
    if (blkey==''){
        blkey='weibo';
    }
    
    let arrays=array_klwebsites(blkey);
    var result_t=[];

    for (let arow of arrays){
        var item=sites_all_global[arow[1]];
        if (item[1].slice(-5,)!==' - 微博'){continue;}
       
        var blurl=item[0];
        blurl=blurl.substring(blurl.indexOf('http'),);
        result_t.push('@'+item[1].slice(0,-5).trim()+' '+blurl);
    }

    result_t.sort(function (a,b){return zh_sort_b(a,b);});
    
    bljg=array_2_li_b(result_t);
    if (ismobile_b()==false){
        bljg='<div style="column-count:2;">'+bljg+'</div>';
    }
    document.getElementById('divhtml').innerHTML=bljg;
}

function http_klwebsites(){
    var bljg='';
    for (let item of sites_all_global){
        var blurl=item[0];
        if (blurl.substring(0,7).toLowerCase()=='http://'){
            var blhttps='https://'+blurl.substring(7,);
            bljg=bljg+'<li><a href="'+blurl+'" target=_blank>'+blurl+'</a> '+item[1]+' <a href="'+blhttps+'" target=_blank>'+blhttps+'</a></li>';
        }
    }
    bljg='<ol>'+bljg+'</ol>';
    bljg=bljg+'<p>'+close_button_b('div_http_list','none')+'</p>';
    bljg='<div id="div_http_list">'+bljg+'</div>';
    return bljg;
}

function recent_refresh_klwebsites(lineheight){
    recent_websites=recent_websites_b(false,'html').join('\n');
    
    if (recent_websites!==''){
        recent_websites='<p style="font-size:0.88rem;line-height:'+lineheight+'rem;"><span style="font-weight:bold;cursor:pointer;" title="刷新" onclick="this.parentNode.outerHTML=recent_refresh_klwebsites(\''+lineheight+'\');">RECENT</span> '+recent_websites+'</p>';
    }
    return recent_websites;
}

function random_klwebsites(lineheight){
    sites_all_global.sort(randomsort_b);
    var bljg='';
    var blno=0;
    var ico_type=(is_old_firefox_b()?'old':(is_local_b()?'local':''));  
    var href_str;
    for (let blxl=0;blxl<sites_all_global.length;blxl++){
        var item=sites_all_global[blxl];
        href_str=item[0];    //href_klwebsites(item,-1,'');
        if (href_str===false){break;}
        else if (href_str===''){continue;}
        
        bljg=bljg+one_link_klwebsites(href_str,blxl,-1,(item[5][0]>0),ico_type); //count1 - 保留注释
        blno=blno+1;
        if (blno>=5){break;}
    }
    
    bljg=bljg+'<span id="span_refresh_random_sites" class="oblong_box" onclick="this.parentNode.outerHTML=refresh_random_line_klwebsites(\''+lineheight+'\');">刷新</span>';
    var rnd_websites='<p style="font-size:0.88rem;line-height:'+lineheight+'rem;"><span style="font-weight:bold;cursor:pointer;" title="批量打开" onclick="batch_open_klwebsites(this.parentNode);">RANDOM</span> '+bljg+'</p>';
    
    return rnd_websites;
}

function refresh_random_line_klwebsites(lineheight){
    var ospan=document.getElementById('span_refresh_random_sites');
    if (ospan){
        ospan.parentNode.outerHTML=random_klwebsites(lineheight);
    }
    ospan=document.getElementById('span_refresh_random_sites');
    if (ospan){
        mouseover_mouseout_oblong_span_b([ospan]);
    }
}

function sort_klwebsites(){
    sites_all_global.sort();
    sites_all_global.sort(function (a,b){return zh_sort_b(a,b,false,1);});
    sites_all_global.sort(function (a,b){return zh_sort_b(a,b,false,2);});
}

function day_klwebsites(lineheight,csday='',odom=false){
    sort_klwebsites();
    
    var bljg='';
    if (csday===''){
        csday=new Date();
    }
    csday=validdate_b(csday);
    var bldays=day_of_year_b(csday) % 100;
    var bldays_2=day_of_year_b(csday) % 30;
    
    var ico_type=(is_old_firefox_b()?'old':(is_local_b()?'local':''));
    var href_str;
    for (let blxl=0;blxl<sites_all_global.length;blxl++){
        var item=sites_all_global[blxl];
        href_str=item[0];   //href_klwebsites(item,-1,'');
        if (href_str===false){break;}
        else if (href_str===''){continue;}
        
        var blasc_sum=asc_sum_b(item[0]);
        if (!item[2].includes(',登陆') && blasc_sum % 100 == bldays || item[2].includes(',登陆') && blasc_sum % 30 == bldays_2){
            bljg=bljg+one_link_klwebsites(href_str,blxl,-1,(item[5][0]>0),ico_type); //count1 - 保留注释
        }
    }

    bljg=bljg+'<span class="oblong_box" onclick="day_klwebsites(\''+lineheight+'\',\''+previous_day_b(csday)+'\',this);">上一日</span> ';
    bljg=bljg+'<span class="oblong_box" onclick="day_klwebsites(\''+lineheight+'\',\'\',this);">今日</span> ';    
    bljg=bljg+'<span class="oblong_box" onclick="day_klwebsites(\''+lineheight+'\',\''+next_day_b(csday)+'\',this);">下一日</span> ';    

    var today_websites='<p id="p_today_sites" style="font-size:0.88rem;line-height:'+lineheight+'rem;"><span style="font-weight:bold;cursor:pointer;" title="批量打开" onclick="batch_open_klwebsites(this.parentNode);">TODAY('+date2str_b('-',csday)+')</span> '+bljg+'</p>';

    if (odom!==false){
        odom.parentNode.outerHTML=today_websites;
        mouseover_mouseout_oblong_span_b(document.querySelectorAll('p#p_today_sites span.oblong_box'));
    }
    return today_websites;
}

function batch_open_klwebsites(op){
    if (!confirm('是否批量打开？')){return;}
    if (op){
        var oas=op.getElementsByTagName('a');
        var blxl=0;
        for (let one_a of oas){
            var href_str=one_a.getAttribute('href');
            if (href_str){
                if (one_a.style.display=='none'){continue;}
                window.open(href_str);
                blxl=blxl+1;
                if (blxl>=20){break;}
            }
        }
    }
}

function window_open_klwebsites(){
    var blurl=(prompt('输入url') || '').trim();
    if (blurl==''){return;}
    window.open(blurl, blurl, 'width=900, height=420');
}

function qr_html_klwebsites(){
    qr_html_websites_b('div_sub_content','p.p_sites a.a_oblong_box');
    qr_generate_klwebsites(klmenu_check_b('span_veil_web',false));
}

function qr_generate_klwebsites(do_veil=false){
    if (qr_generate_websites_b('div#div_sub_content canvas',do_veil)===false){return;}
    setTimeout(function(){qr_generate_klwebsites(do_veil);},10);
}

function search_in_site_options_klwebsites(){
    var oas=document.querySelectorAll('div#div_sub_content p.p_sites a.a_oblong_box');
    var list_t=new Set();
    for (let one_a of oas){
        var blhref=one_a.href;
        if (!blhref){continue;}
        blhref=blhref.replace(new RegExp(/^.*\/\/([^\/]+)\/?.*$/,'g'),'$1');
        list_t.add(blhref);
    }
    if (list_t.size==0){return;}
    var ospan=document.getElementById('span_search_in_site');
    var bljg='<select id="select_search_in_site"><option>'+Array.from(list_t).join('</option><option>')+'</option></select> <span class="aclick" onclick="search_in_site_new_window_klwebsites(\'bing\');">Bing</span> <span class="aclick" onclick="search_in_site_new_window_klwebsites(\'baidu\');">Baidu</span>';
    ospan.innerHTML=bljg;
}

function search_in_site_new_window_klwebsites(cstype){
    var blstr=encodeURIComponent(document.getElementById('input_search').value);
    var blsite=document.getElementById('select_search_in_site').value;
    switch (cstype){
        case 'bing':
            window.open('https://www.bing.com/search?q='+blstr+' site: '+blsite);
            break;
        case 'baidu':
            window.open('https://www.baidu.com/baidu?wd='+blstr+' site: '+blsite);
            break;
    }
}

function init_klwebsites(){
    if (typeof sites_all_global == 'undefined'){    //在menu前 - 保留注释
        sites_all_global=[];
    }
    
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.5rem':'1.4rem'));

    var t0 = performance.now();
    var klwebphp_path=klwebphp_path_b();
    for (let blxl=0;blxl<sites_all_global.length;blxl++){
        var href_str=sites_all_global[blxl][0];
        var count1=0;
        var count2=0;
        var count3=0;
        if (href_str.includes('{{klwebphp}}')){
            href_str=href_str.replace('{{klwebphp}}',klwebphp_path);
            count3=1;
        }
        if (href_str.substring(0,4)!=='http'){
            href_str=href_str.substring(href_str.indexOf('http'),); //截取http开始的字符串 - 保留注释
            count3=1;
        }
        else {
            count1=1;
        }
        if (count3>0){
            sites_all_global[blxl][0]=href_str;
        }
        if (count1==1){
            if (sites_all_global[blxl][2]=='CN' || sites_all_global[blxl][2].slice(-3,)==',CN' || sites_all_global[blxl][2].substring(0,3)=='CN,' || sites_all_global[blxl][2].includes(',CN,')){
                count2=1;
            }
        }
        sites_all_global[blxl].push([count1,count2,count3]);   //selenium类型网址，其中CN网址，非selenium类型网址 - 保留注释
    }
    menu_klwebsites();  //等 #http 之类网站被修正后，引入 menu - 保留注释
    var name_set=new Set();
    sites_all_global.sort(function (a,b){return a[0].length>b[0].length});  //网址长度 - 保留注释
    for (let blxl=0;blxl<sites_all_global.length;blxl++){
        if (name_set.has(sites_all_global[blxl][1])){
            sites_all_global[blxl][1]=sites_all_global[blxl][1]+'<small>('+same_name_websites_b(sites_all_global[blxl][0])+')</small>';
        }
        name_set.add(sites_all_global[blxl][1]);
    }
    console.log('init_klwebsites() 网址数组初始化部分费时：'+(performance.now() - t0) + ' milliseconds');
    
    recent_websites_b();
    args_klwebsites();

    enwords_init_b(true);
    enwords_mini_search_frame_style_b();
    enwords_mini_search_frame_form_b();
}

function args_klwebsites(){
    var cskeys=href_split_b(location.href);
    var blkey='';
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let item of cskeys){
            item=item.trim();
            if (item.substring(0,2)=='k='){
                blkey=item.substring(2,);
                refresh_page_klwebsites(blkey);
                break;
            }
            else if (item=='waterfall'){
                waterfall_klwebsites();
                break;
            }
        }
    }
    else {
        refresh_page_klwebsites(blkey);
    }
}

function refresh_page_klwebsites(cskey=''){
    search_klwebsites(cskey,(ismobile_b()?1:7));
}
