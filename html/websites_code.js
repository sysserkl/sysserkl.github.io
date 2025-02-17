function fav_and_tag_klwebsites(change_no=false){
   var tag_list={};
    var fav_set=fav_www_get_websites_b();
    fav_websites_global=[];
    for (let blxl=0,lent=sites_all_global.length;blxl<lent;blxl++){
        var item=sites_all_global[blxl];
        if (fav_set.has(item[0])){
            fav_websites_global.push([item[0],item[1]]);
            if (change_no){
                sites_all_global[blxl][3]=7;
            }
        }
        
        var list_t=item[2].split(',');
        for (let atag of list_t){
            if (atag==''){continue;}
            if (tag_list[atag]==undefined){
                tag_list[atag]=0;
            }
            tag_list[atag]=tag_list[atag]+1;
        }
    }
    return tag_list;
}

function menu_klwebsites(change_no=false){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'search_in_site_options_klwebsites();">search in site</span>',        
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'http://\');">http_https check</span>',
    '<span class="span_menu" onclick="'+str_t+'new_filter_form_klwebsites();">新网址过滤</span>',   
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    '<span class="span_menu" onclick="'+str_t+'window_open_klwebsites();">New Window</span>',
    '<span class="span_menu">batch eword search max windows: <input type="number" id="input_key_batch_search_max_klwebsites" value=5 /></span>',
    ];

    var list_t=[
    ['QR','qr_html_klwebsites();',true],
    ['Table','qr_html_klwebsites(\'table\');',true],
    ['⚪ 遮罩','klmenu_check_b(this.id,true);',false,'span_veil_web'],
    ['js','qr_table_2_js_klwebsites();',true],

    ];    
    klmenu1.push(menu_container_b(str_t,list_t,''));    
    
    var list_t=[
    ['bing','key_batch_search_by_engine_klwebsites(true,\'bing\');',true],
    ['百度','key_batch_search_by_engine_klwebsites(true,\'baidu\');',true],
    ];    
    klmenu1.push(menu_container_b(str_t,list_t,'batch eword search: '));    
    
    var list_t=[
    ['RSS','rss_klwebsites();',true],
    ['Weibo ALL','weibo_klwebsites();',true],
    ['Weibo RND','weibo_klwebsites(true);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,list_t,'List: '));    
    
    var klmenu_search=[
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^1,[01],0$\');">Selenium</span>',        
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^1,1,0$\');">Selenium CN</span>',
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^1,0,0$\');">Selenium EN</span>',
    '<span class="span_menu" onclick="'+str_t+'search_klwebsites(\'^0,0,1$\');">non Selenium</span>',
    '<span class="span_menu" onclick="'+str_t+'waterfall_klwebsites();">waterfall</span>',
    '<span class="span_menu" onclick="'+str_t+'oldnews_klwebsites();">oldnews</span>',
    ];
    
    var tag_list=fav_and_tag_klwebsites(change_no);
    var klmenu_tag=tag_menu_websites_b(tag_list,'search_klwebsites',str_t);
    
    var klmenu_config=[
    load_sentence_menu_b(str_t),
    '<span class="span_menu" onclick="'+str_t+'demo_style_klwebsites();">PWA Demo Style</span>',   
    '<span class="span_menu" onclick="'+str_t+'demo_style_klwebsites(true);">当前条件网址列表</span>',   
    '<span class="span_menu" onclick="'+str_t+'import_pwa_data_klwebsites();">导入 PWA 网址</span>',   
    //'<span class="span_menu" onclick="'+str_t+'import_bigfile_klwebsites();">导入 bigfile 网址文件</span>',   
    '<span id="span_jieba_web" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ jieba分词</span>',
    '<span id="span_category_with_p_web" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 分类分段</span>',
    ];    
    //---
    
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🕸','24rem','1rem','1rem','60rem')+klmenu_b(klmenu_tag,'#','10rem','1rem','1rem','30rem')+klmenu_b(klmenu_search,'𓅸','10rem','1rem','1rem','60rem')+fav_www_menu_websites_b('',false)+klmenu_b(klmenu_config,'⚙','13rem','1rem','1rem','30rem'),'','0rem','','div_websites_menu')+' ');
    klmenu_check_b('span_veil_web',true);        
    klmenu_check_b('span_category_with_p_web',true);        
    
    var input_list=[['input_key_batch_search_max_klwebsites',3]];
    input_size_b(input_list,'id');
}

function qr_table_2_js_klwebsites(){
    var qrfcolor='black';
    var qrbcolor='white';
    var f_rgb='rgb('+hex2rgb_b(qrfcolor).join(', ')+')'; //,后有空格 - 保留注释
    var b_rgb='rgb('+hex2rgb_b(qrbcolor).join(', ')+')';
    var result_t=[];

    var odivs=document.querySelectorAll('div.div_qr_and_name');
    for (let one_div of odivs){
        var odiv_qr=one_div.querySelector('div.div_qr');
        if (!odiv_qr){continue;}
        var otable=odiv_qr.querySelector('div.div_qr table');
        if (!otable){continue;}

        var blhref=odiv_qr.getAttribute('title');

        var tr_oblocks=otable.querySelectorAll('tr');
        var blstr=qr_list_get_from_table_b(tr_oblocks,false,[qrfcolor,qrbcolor,f_rgb,b_rgb],true);

        var oname=one_div.querySelector('a.a_oblong_box');
        var blname=(oname?oname.textContent:'unknown');
        result_t.push('["'+specialstr_j(blname)+'","'+specialstr_j(blhref)+'","'+blstr+'"],');
    }
    
    if (result_t.length==0){return;}
    
    var left_str='<p>';
    left_str=left_str+'<span class="aclick" onclick="qr_table_standalone_klwebsites();">Standalone</span> ';
    var right_str='</p>';
    
    var blstr=textarea_with_form_generate_b('textarea_qr_js_sites','width:90%;height:24rem;',left_str,'全选,清空,复制,发送到临时记事本,发送地址',right_str);
    document.getElementById('divhtml').innerHTML=blstr;
    document.getElementById('textarea_qr_js_sites').value=result_t.join('\n');    
}

function qr_table_standalone_klwebsites(){
    function sub_qr_table_standalone_klwebsites_on_load(){
        var blsize=150;
        for (let blxl=0,lent=data_raw_standalone_global.length;blxl<lent;blxl++){
            var bllink='<a href="'+data_raw_standalone_global[blxl][1]+'" target="_blank" class="a_oblong_box">'+data_raw_standalone_global[blxl][0]+'</a>';
        
            var table_str=list_2_table_qr_b(str_2_list_qr_b(data_raw_standalone_global[blxl][2]),blsize);
            var result_t=div_qr_ane_name_generate_websites_b(blsize,data_raw_standalone_global[blxl][1],bllink,table_str);
            data_raw_standalone_global[blxl]=result_t;
        }
    }
    
    var on_data_load_run_js=sub_qr_table_standalone_klwebsites_on_load.toString()+'sub_qr_table_standalone_klwebsites_on_load();\n';
    var diy_style='.div_qr_and_name {margin:0.1rem; border: 0.1rem solid black;}';
    var fns=['str_2_list_qr_b','qr_list_get_from_table_b','list_2_table_qr_b','array_split_by_col_b','div_qr_ane_name_generate_websites_b','qr_img_veil_add_one_websites_b','qr_img_veil_add_batch_websites_b'];
    var bldata=document.getElementById('textarea_qr_js_sites').value;
    standalone_search_funs_b('QR Sites Search',bldata,fns,false,'',25,false,false,diy_style,on_data_load_run_js,'qr_img_veil_add_batch_websites_b()');
}

function import_pwa_data_klwebsites(){
    var list_t=local_storage_get_b('websites_list_pwa',-1,true);
    sites_all_global=[];
    for (let item of list_t){
        var result_t=split_pwa_websites_b(item);
        if (result_t[0]=='' && result_t[1]==''){continue;}
        sites_all_global.push([result_t[1],result_t[2],result_t[0]+(result_t[3]==''?'':','+result_t[3]),10,'']);
    }
    
    sites_reload_klwebsites(true);
}

//function import_bigfile_klwebsites(){
    //sites_all_global=undefined;
    //load_js_var_file_b('sites_all_global',[],'sites_all_data.js',sites_reload_klwebsites,true,true);
//}

function sites_reload_klwebsites(is_pwa=false,do_search=true){
    sites_type_klwebsites();
    var omenu=document.getElementById('div_websites_menu');
    if (omenu){
        omenu.outerHTML='';
    }
    menu_klwebsites(is_pwa);
    sites_tail_klwebsites();
    
    if (do_search){
        search_klwebsites('',7);    
    }
}

function key_batch_search_by_engine_klwebsites(is_enword=true,csengine='bing'){
    function sub_key_batch_search_by_engine_klwebsites_done(){
        var used_seconds=(new Date()-start_time)/1000;
        console.log(new Date().toLocaleString(), '完成，费时：',used_seconds.toFixed(2)+'秒');        
        document.title=old_title;    
    }
    
    function sub_key_batch_search_by_engine_klwebsites_one_site(){
        var window_id=false;
        for (let blxl=0,lent=window_list.length;blxl<lent;blxl++){
            if (window_list[blxl]===false || window_list[blxl].closed){
                window_id=blxl;
                break;
            }
        }
        
        if (window_id!==false){
            var owindow=window_list[window_id];
            [is_closed,wait_times]=window_is_closed_b(owindow,wait_times,10,false);
            if (is_closed===false || is_closed===-1){   //没关掉，或超次数 - 保留注释
                setTimeout(sub_key_batch_search_by_engine_klwebsites_one_site,wait_seconds*1000);
                return;
            }
        }
            
        if (blno>=bllen){
            sub_key_batch_search_by_engine_klwebsites_done();
            return;
        } else if (window_id===false){
            if (confirm('是否继续对 '+blkey+' 在剩余 '+(bllen-blno)+' 个网站中进行批量搜索？')){
                setTimeout(sub_key_batch_search_by_engine_klwebsites_one_site,wait_seconds*1000);
            } else {
                sub_key_batch_search_by_engine_klwebsites_done();
            }
            return;
        }
        
        var blurl=search_in_site_new_window_klwebsites(csengine,blkey,site_list[blno],false);
        window_list[window_id]=window.open(blurl);
        if (otextarea){
            otextarea.value=otextarea.value+(blno+1)+'. '+blurl+'\n';
        }
        blno=blno+1;
        wait_times=0;
        document.title=blno+'/'+bllen+' - '+title_key+' - '+old_title;
        setTimeout(sub_key_batch_search_by_engine_klwebsites_one_site,wait_seconds*1000);
    }
    //-----------------------
    var max_result=Math.min(20,Math.max(1,parseInt(document.getElementById('input_key_batch_search_max_klwebsites').value.trim()) || 5));
    var site_list=false;
    if (is_enword){
        site_list=array_klwebsites('^1,0,0$',999);
        for (let blxl=0,lent=site_list.length;blxl<lent;blxl++){
            site_list[blxl]=site_list[blxl][0];
        }
    }
    
    var oinput=document.getElementById('input_search');
    var blkey=oinput.value.trim();
    if (blkey==''){return;}

    var title_key=document_title_key_word_b(blkey,'');

    if (blkey.match(/^(["']).*\1$/)==null){
        blkey='"'+blkey+'"';
    }
    
    site_list=Array.from(search_in_site_options_klwebsites(true,site_list,true));
    site_list.sort(randomsort_b);
    
    var bllen=site_list.length;
    if (bllen==0){return;}
    if (!confirm('是否对 '+blkey+' 在 '+bllen+' 个网站中进行批量搜索？')){return;}
    
    var window_list=window_list_init_b(max_result);

    var blno=0;
    var is_closed=false;
    var start_time=new Date();
    var wait_times=0;
    var wait_seconds=5;
    var old_title=document.title;
    var odiv=document.getElementById('div_sub_content');
    if (odiv){
        odiv.innerHTML='<textarea id="textarea_key_batch_klwebsites" style="height:30rem;"></textarea>';
    }
    var otextarea=document.getElementById('textarea_key_batch_klwebsites');
    sub_key_batch_search_by_engine_klwebsites_one_site();
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
        } catch (e){
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
            } else if (list_t.length>=3){
                if (name_set.has(list_t[2])){
                    result_t['exist_name'].push(arow);
                } else {
                    result_t['nonexist'].push(arow);          
                }
            } else {
                result_t['nonexist'].push(arow);            
            }
        } catch (error){
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
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
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

function demo_style_klwebsites(only_http=false){
    var list_t=demo_content_klwebsites(false,only_http);
    
    var left_str='<p>';
    var right_str=' rows：'+list_t.length+'</p>';
    
    var blstr=textarea_with_form_generate_b('textarea_demo_style_sites','width:90%;height:24rem;',left_str,'全选,清空,复制,发送到临时记事本,发送地址',right_str,'','form_demo_style_sites');
    document.getElementById('div_sub_content').innerHTML=blstr;
    document.getElementById('textarea_demo_style_sites').value=list_t.join('\n');    
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
        } else {
            one_link.style.display='none';
        }
    }
}

function one_link_klwebsites(cshref,csxl,csnumber,is_selenium_site,ico_type){
    var bljg='<a href="'+cshref+'" target=_blank class="a_oblong_box"';
    if (today_clicked_websites_global.has(cshref)){
        bljg=bljg+' style="background-color: '+scheme_global['pink']+';"';    
    } else if (is_selenium_site){
        bljg=bljg+' style="background-color: '+scheme_global['button']+';"';
    }
    bljg=bljg+' onclick="recent_websites_b(this);">';
    
    var sitename_t=sites_all_global[csxl][1];

    if (sites_all_global[csxl][3]<=1 && csnumber>1){
        bljg=bljg+'<font color=red>'+sitename_t+'</font>';
    } else if (sites_all_global[csxl][3]>25 && csnumber>-1){
        bljg=bljg+'<font color=gray>'+sitename_t+'</font>';
    } else {
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

function array_klwebsites(keyword='',csnumber=999,enable_rnd=false){
    function sub_array_klwebsites_add(item,cshref,csxl){
        if (enable_rnd){
            var r_list=item[2].match(/\bR(0\.\d+)\b/) || [];
            if (r_list.length==2){
                if (Math.random()<parseFloat(r_list[1])){
                    console.log('忽略',item);
                    return;
                }
            }
        }
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
        for (let blxl=0,lent=sites_all_global.length;blxl<lent;blxl++){
            var item=sites_all_global[blxl];
            href_str=href_klwebsites(item,csnumber,keyword);
            
            if (href_str===false){break;}
            else if (href_str===''){continue;}
            
            sub_array_klwebsites_add(item,href_str,blxl);
        }
    } else {
        for (let blxl=0,lent=sites_all_global.length;blxl<lent;blxl++){
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
    //-----------------------
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

function demo_content_klwebsites(cskey=false,only_http=false){
    if (cskey==false){
        cskey=document.getElementById('input_search').value;
    }
    var result_t=array_klwebsites(cskey,999);
    var demo_list=[];
    if (only_http){
        for (let href_list of result_t){
            demo_list.push(href_list[0]);
        }
    } else {
        for (let href_list of result_t){
            var href_str=href_list[0];
            var category=sites_all_global[href_list[1]][2];
            if (category==''){
                category='未分类';
            }
            demo_list.push(category+' '+href_str+' '+sites_all_global[href_list[1]][1].replace(/<\/?small>/g,''));
        }
    }
    return demo_list;
}

function category_select_klwebsites(ospan){
    var ocategory=ospan.parentNode.querySelector('span.span_category_websites');
    if (!ocategory){return;}
    search_klwebsites(ocategory.innerText);
}

function search_klwebsites(keyword='',csnumber=999){
    var csresult=array_klwebsites(keyword,csnumber);
    //csresult 的 元素形如：[ "https://www.chatpdf.com/", 5, "AI" ] - 保留注释
    
    var ico_type=(is_old_firefox_b()?'old':(is_local_b()?'local':''));
    var count1=0;
    var count2=0;
    var count3=0;
    var category_dict={};
    
    for (let href_list of csresult){
        var item=sites_all_global[href_list[1]];
        //sites_all_global 的元素为数组，形如：[["https://www.hanselman.com/blog/", "Scott Hanselman<small>(hanselman)</small>", ​"IT", ​20, ​"", ​[ 1, 0, 0 ] ] - 保留注释
        
        count1=count1+item[5][0];
        count2=count2+item[5][1];
        count3=count3+item[5][2];    
        
        var blkey='c_'+href_list[2];
        if (category_dict[blkey]==undefined){
            category_dict[blkey]=[[]];  //网址列表在一个 list 中 - 保留注释
        }
        var item=sites_all_global[href_list[1]];
        category_dict[blkey][0].push(one_link_klwebsites(href_list[0],href_list[1],csnumber,(item[5][0]>0),ico_type));
    }
    result_2_html_klwebsites(category_dict,keyword,csnumber,count1,count2,count3);
}

function result_2_html_klwebsites(category_dict,keyword='',csnumber=999,count1=0,count2=0,count3=0){
    function sub_result_2_html_klwebsites_count(cscount){
        return ' <span class="span_box" style="color:'+scheme_global['memo']+';font-size:0.6rem;" onclick="category_select_klwebsites(this);"><i>('+cscount+')</i></span>';
    }
    
    function sub_result_2_html_klwebsites_input_range(csnumber=1,keyword=''){
        var bljg = '';
        var list_t=[['',1,'M'],['',7,'S'],['',999,'A'],['FAV',999,'F']];
        for (let item of list_t){
            bljg=bljg+'<span class="oblong_box" onclick="search_klwebsites(\''+item[0]+'\','+item[1]+');">';
            if (keyword==item[0] && csnumber==item[1]){
                bljg=bljg+'<font color=red>'+item[2]+'</font>';
            } else {
                bljg=bljg+item[2];
            }
            bljg=bljg+'</span> ';
        }
        bljg=bljg+buttons_klwebsites(keyword);
        return bljg;
    }
    //-----------------------
    
    category_dict=object2array_b(category_dict,true,2);
    //category_dict 的元素形如：[ "英语", [ "<a href=\"https://dictionaryblog.cambridge.org/\" target=_blank class=\"a_oblong_box\" style=\"background-color: #EBEBEB;\" onclick=\"recent_websites_b(this);\">Cambridge Dictionaries Online blog<img alt=\"\" src=\"../../../../data/website_ico/dictionaryblog.cambridge.org.ico\" style=\"max-width:1rem;max-height:1rem;border-radius:1rem;\" /></a> ", "<a href=\"https://www.merriam-webster.com/words-at-play\" target=_blank class=\"a_oblong_box\" style=\"background-color: #EBEBEB;\" onclick=\"recent_websites_b(this);\">Merriam-Webster<img alt=\"\" src=\"../../../../data/website_ico/www.merriam-webster.com.ico\" style=\"max-width:1rem;max-height:1rem;border-radius:1rem;\" /></a> " ] ] - 保留注释

    var lineheight=(ismobile_b()?'1.3':'1.8');
    var select_str=[];
    var tagname=(klmenu_check_b('span_category_with_p_web',false)?'p':'span');
    for (let blxl=0,lent=category_dict.length;blxl<lent;blxl++){
        select_str.push('<option value="sites_category_'+blxl+'">'+category_dict[blxl][0]+'</option>');        
        category_dict[blxl]='<a name="sites_category_'+blxl+'"></a><'+tagname+' class="p_sites" style="font-size:0.88rem;line-height:'+lineheight+'rem;"><span class="span_category_websites" style="font-weight:bold;cursor:pointer;" title="批量打开" onclick="batch_open_klwebsites(this.parentNode);">'+category_dict[blxl][0]+'</span> '+category_dict[blxl][1].join('')+sub_result_2_html_klwebsites_count(category_dict[blxl][1].length)+'</'+tagname+'>';
    }
    
    //-----------------------
    select_str='<select style="width:5rem;height:2rem;margin-bottom:0.5rem;" onchange=\'document.location="#"+this.value;\'>'+select_str.join('\n')+'</select>';
    
    var bljg='<hr /><p style="line-height:1.45rem;">'+select_str+' '+sub_result_2_html_klwebsites_input_range(csnumber,keyword)+'</p><div id="div_sub_content">'+recent_refresh_klwebsites(lineheight)+category_dict.join('\n')+random_klwebsites(lineheight)+day_klwebsites(lineheight)+'<p>&nbsp;</p></div>';

    if (keyword=='http://'){
        bljg=bljg+http_klwebsites();
    }

    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    recent_search_b('recent_search_websites',keyword,'search_klwebsites','span_recent_search',[],15,false);
    
    input_with_x_b('input_search',8);

    var ospan=document.getElementById('span_count');
    if (ospan){
        ospan.innerHTML='<span style="cursor:pointer;" onclick="selenium_show_hide_klwebsites();">sele网站数：'+count1+'</span>，其中CN网址：'+count2+'，其他：'+count3+'，总计：'+(count1+count3);
    }
}

function weibo_klwebsites(enable_rnd=false){
    var blkey='';
    var oinput=document.getElementById('input_search');
    if (oinput){
        blkey=oinput.value.trim();
    }
    if (blkey==''){
        blkey='weibo';
    }
    
    let arrays=array_klwebsites(blkey,999,enable_rnd);
    //arrays的元素形如：[ "https://weibo.com/u/5722964389", 260, "编程" ] - 保留注释
    
    var result_t=[];
    for (let arow of arrays){
        var item=sites_all_global[arow[1]];
        if (item[1].slice(-5,)!==' - 微博'){continue;}
       
        var blurl=item[0];
        blurl=blurl.substring(blurl.indexOf('http'),);
        result_t.push('@'+item[1].slice(0,-5).trim()+' '+blurl);
    }

    result_t.sort(function (a,b){return zh_sort_b(a,b);});

    var buttons='<p>'+textarea_buttons_b('textarea_weibo_websites','全选,清空,复制')+'</p>';    
    document.getElementById('divhtml').innerHTML='<textarea id="textarea_weibo_websites" style="height:30rem;">'+result_t.join('\n')+'</textarea>'+buttons;
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
    for (let blxl=0,lent=sites_all_global.length;blxl<lent;blxl++){
        var item=sites_all_global[blxl];
        href_str=item[0];    //href_klwebsites(item,-1,'');
        if (href_str===false){
            break;
        } else if (href_str===''){continue;}
        
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
    for (let blxl=0,lent=sites_all_global.length;blxl<lent;blxl++){
        var item=sites_all_global[blxl];
        href_str=item[0];   //href_klwebsites(item,-1,'');
        if (href_str===false){
            break;
        } else if (href_str===''){continue;}
        
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
    if (!op){return;}
    var oas=op.getElementsByTagName('a');
    var link_list=[];
    var blxl=0;
    for (let one_a of oas){
        var href_str=one_a.getAttribute('href');
        if (!href_str){return;}
        if (one_a.style.display=='none'){continue;}
        link_list.push(href_str);
        blxl=blxl+1;
        if (blxl>=20){break;}        
    }
    
    if (!confirm('是否批量打开 '+link_list.length+' 个网址？')){return;}
    for (let item of link_list){
        window.open(item);
    }
}

function window_open_klwebsites(){
    var blurl=(prompt('输入url') || '').trim();
    if (blurl==''){return;}
    window.open(blurl, blurl, 'width=900, height=420');
}

function qr_html_klwebsites(qr_type='canvas'){
    qr_html_websites_b('div_sub_content','p.p_sites a.a_oblong_box');
    qr_generate_klwebsites(klmenu_check_b('span_veil_web',false),qr_type);
}

function qr_generate_klwebsites(do_veil=false,qr_type='canvas'){
    if (qr_generate_websites_b('div#div_sub_content canvas',do_veil,qr_type)===false){return;}
    setTimeout(function(){qr_generate_klwebsites(do_veil,qr_type);},10);
}

function search_in_site_options_klwebsites(only_set=false,site_list=false,remove_sites_from_textarea=false){
    var set_t=new Set();
    
    if (Array.isArray(site_list)){
        for (let blhref of site_list){
            blhref=blhref.replace(/^.*\/\/([^\/]+)\/?.*$/g,'$1');
            set_t.add(blhref);
        }     
    } else {
        var oas=document.querySelectorAll('div#div_sub_content p.p_sites a.a_oblong_box');
        for (let one_a of oas){
            var blhref=one_a.href;
            if (!blhref){continue;}
            blhref=blhref.replace(/^.*\/\/([^\/]+)\/?.*$/g,'$1');
            set_t.add(blhref);
        }
    }
    
    if (remove_sites_from_textarea){
        var otextarea=document.getElementById('textarea_key_batch_klwebsites');
        if (otextarea){
            var list_t=otextarea.value.trim().match(/ site: (.+)/g) || [];    //元素格式如：" site: www.news.com.au" - 保留注释
            for (let item of list_t){
                item=item.slice(7,);
                if (set_t.has(item)){
                    set_t.delete(item);
                }
            }
        }
    }
    
    if (only_set){
        return set_t;
    }
    
    if (set_t.size==0){return;}
    var ospan=document.getElementById('span_search_in_site');
    var bljg='<select id="select_search_in_site"><option>'+Array.from(set_t).join('</option><option>')+'</option></select> <span class="aclick" onclick="search_in_site_new_window_klwebsites(\'bing\');">Bing</span> <span class="aclick" onclick="search_in_site_new_window_klwebsites(\'baidu\');">Baidu</span>';
    ospan.innerHTML=bljg;
}

function search_in_site_new_window_klwebsites(cstype,cskey=false,site_name=false,open_window=true){
    if (cskey===false){
        cskey=document.getElementById('input_search').value;
    }
    cskey=encodeURIComponent(cskey);
    
    if (site_name===false){
        site_name=document.getElementById('select_search_in_site').value;
    }
    
    var blstr='';
    switch (cstype){
        case 'bing':
            blstr='https://www.bing.com/search?q='+cskey+' site: '+site_name;
            break;
        case 'baidu':
            blstr='https://www.baidu.com/baidu?wd='+cskey+' site: '+site_name;
            break;
    }
    
    if (blstr!=='' && open_window){
        window.open(blstr);    
    }
    return blstr;
}

function sites_type_klwebsites(){
    var klwebphp_path=klwebphp_path_b();

    for (let blxl=0,lent=sites_all_global.length;blxl<lent;blxl++){
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
        } else {
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
}

function sites_tail_klwebsites(){
    var t0 = performance.now();
    var hostname,bltail;
    var name_set=new Set();
    sites_all_global.sort(function (a,b){return a[0].length>b[0].length ? 1 : -1});  //网址长度 - 保留注释
    for (let blxl=0,lent=sites_all_global.length;blxl<lent;blxl++){
        if (name_set.has(sites_all_global[blxl][1])){
            [hostname,bltail]=same_name_websites_b(sites_all_global[blxl][0],sites_all_global[blxl][1],true);
            if (hostname!=='' && !name_set.has(hostname)){
                sites_all_global[blxl][1]=hostname;
            } else {
                sites_all_global[blxl][1]=bltail;
            }
        }
        name_set.add(sites_all_global[blxl][1]);
    }
    console.log('sites_tail_klwebsites() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function init_klwebsites(){
    function sub_init_klwebsites_en(){
        enwords_mini_search_frame_style_b();
        enwords_mini_search_frame_form_b();
    }
    
    function sub_init_klwebsites_done(){
        if (typeof sites_all_global == 'undefined'){    //在menu前 - 保留注释
            sites_all_global=[];
        }
        character_2_icon_b('🕸');
        top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.5rem':'1.4rem'));

        sites_reload_klwebsites(false,false);
        
        recent_websites_b();
        args_klwebsites();

        enwords_init_b(true,true,sub_init_klwebsites_en);    
    }
    //-----------------------
    oa_qr_list_websites_global=[];
    oa_qr_no_websites_global=0;
    fav_websites_global=[];
    jieba_websites_global=new Set();
    today_clicked_websites_global=new Set();
    canvas_size_websites_global=(ismobile_b()?90:150);

    var file_list=klbase_addons_import_js_b([],[],['sites_all_data.js'],[],false,false);
    //file_list 的元素是数组，形如：[ "js", "http://127.0.0.1/klwebphp/PythonTools/data/selenium_news/jsdata/sites_all_data.js", "" ] - 保留注释
    load_js_var_file_b('sites_all_global',file_list,'sites_all_data.js',sub_init_klwebsites_done);
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
            } else if (item=='waterfall'){
                waterfall_klwebsites();
                break;
            } else if (item=='oldnews'){
                oldnews_klwebsites();
                break;
            }
        }
    } else {
        refresh_page_klwebsites(blkey);
    }
}

function refresh_page_klwebsites(cskey=''){
    search_klwebsites(cskey,(ismobile_b()?1:7));
}

function oldnews_klwebsites(){
    var result_t={'c_oldnews':[[]]};
    var blstr=date2str_b();
    var ico_type=(is_old_firefox_b()?'old':(is_local_b()?'local':''));
    
    while (true){
        var blprev=previous_year_b(blstr,10);
        if (blprev>='2000'){
            var blold=blprev.replace(/\-/g,'');
            for (let item of ['am','pm']){
                var blhref='https://news.sina.com.cn/head/news'+blold+item+'.shtml';
                blhref='<a href="'+blhref+'" target=_blank class="a_oblong_box">'+blold+item+'</a> ';

                result_t['c_oldnews'][0].push(blhref);
            }
            blstr=blprev;
        } else { break; }
    }
    result_2_html_klwebsites(result_t);
}
