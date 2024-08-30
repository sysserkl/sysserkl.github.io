function menu_websites_pwa(){
    var str_t=klmenu_hide_b('#top');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'add_websites_pwa();">add a site</span>',    
    '<span class="span_menu" onclick="'+str_t+'form_websites_pwa();">import/export</span>',
    '<span class="span_menu" onclick="'+str_t+'organize_websites_pwa();">organize one by one</span>',
    '<span class="span_menu" onclick="'+str_t+'search_websites_pwa(\'\',true,100);">random 100 sites</span>',    
    '<span class="span_menu" onclick="'+str_t+'qr_html_websites_pwa();">QR</span>',
    '<span class="span_menu" onclick="'+str_t+'qr_html_websites_pwa(\'weixin.qq.com\');">QR微信公众号</span>',    
    '<span class="span_menu" onclick="'+str_t+'weixin_select_pwa();">QR微信公众号_Select</span>',   
    ];

    var klmenu2=[
    '<span id="span_reg_web" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',
    '<span id="span_veil_web" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ QR遮罩</span>',    
    '<span id="span_jieba_web" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ jieba分词</span>',    
    '<span class="span_menu" onclick="'+str_t+'clear_cache_websites_pwa();">update</span>',
    '<span class="span_menu" onclick="'+str_t+'demo_websites_pwa();">import demo sites</span>',    
    ];
    klmenu2=root_font_size_menu_b(str_t).concat(klmenu2);
    
    //---
    var tag_list={};
    var fav_set=fav_www_get_websites_b();
    fav_websites_global=[];
        
    var websites_list=localstorage_get_websites_pwa(true);
    for (let item of websites_list){
        var row_list=split_pwa_websites_b(item);
        if (fav_set.has(row_list[1])){
            fav_websites_global.push([row_list[1],row_list[2]]);
        }  
        var bltag=row_list[3];
        if (bltag==''){continue;}
        var list_t=bltag.split(',');
        for (let atag of list_t){
            if (tag_list[atag]==undefined){
                tag_list[atag]=0;
            }
            tag_list[atag]=tag_list[atag]+1;
        }
    }
    
    var klmenu_tag=tag_menu_websites_b(tag_list,'search_websites_pwa',str_t);
    //---
    var klmenu_recent=[];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_tag,'#','10rem','1rem','1rem','60rem')+klmenu_b(klmenu_recent,'🌐','16rem','1rem','1rem','30rem','','div_menu_recent_sites_pwa')+fav_www_menu_websites_b('#top',true)+klmenu_b(klmenu2,'⚙','16rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_web',true);
    klmenu_check_b('span_veil_web',true);    
    recent_websites_b(false,'menu','div_menu_recent_sites_pwa');
    menu_refresh_recent_sites_websites_pwa();
}

function menu_refresh_recent_sites_websites_pwa(){
    var odiv=document.getElementById('div_menu_recent_sites_pwa');
    if (!odiv){return;}
    var klmenu_recent=recent_websites_b(false,'menu','menu_refresh_recent_sites_websites_pwa();');
    odiv.outerHTML=klmenu_b(klmenu_recent,'🌐','16rem','1rem','1rem','30rem','','div_menu_recent_sites_pwa');
}

function init_websites_pwa(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    menu_websites_pwa();
    args_websites_pwa();
}

function args_websites_pwa(){
    var cskeys=href_split_b(location.href);
    var blkey='';
    if (cskeys.length>0 && cskeys[0]!==''){
        var bltype='';
        for (let item of cskeys){
            item=item.trim();
            if (item.substring(0,2)=='t='){
                bltype=item.substring(2,);
                break;
            }
        }
            
        for (let item of cskeys){   //第2轮 - 保留注释
            item=item.trim();
            if (item.substring(0,2)=='k='){
                blkey=item.substring(2,);
                search_websites_pwa(blkey);
                switch (bltype){
                    case 'qr':
                        qr_html_websites_pwa();
                        break;
                    case 'qrw':
                        qr_html_websites_pwa('weixin.qq.com');
                        break;
                    case 'qrws':
                        weixin_select_pwa();
                        break;
                }
                break;
            }
        }
    } else {
        search_websites_pwa();
    }
}

function localstorage_get_websites_pwa(return_list){
    return local_storage_get_b('websites_list_pwa',-1,return_list);
}

function localstorage_set_websites_pwa(cslist){
    if (typeof cslist == 'string'){
        localStorage.setItem('websites_list_pwa',cslist);    
    } else {
        localStorage.setItem('websites_list_pwa',cslist.join('\n'));
    }
}

function demo_websites_pwa(){
    var websites_str=localstorage_get_websites_pwa(false);
    if (websites_str!==''){
        alert('现有网址不为空，取消导入');
        return;
    }
    if (confirm('是否导入Demo网址？')){
        var demo_str=['SNS https://www.douban.com/ 豆瓣','Tools https://www.bing.com/translator/ Bing Microsoft Translator','编程 https://github.com/ GitHub','出行旅游 http://www.amap.com/ 高德','搜索引擎 https://www.bing.com Bing','消费 http://www.decathlon.com.cn/ 迪卡侬','消费 https://www.smzdm.com/ 什么值得买','影音 https://www.imdb.com/ IMDb','阅读 http://www.aisixiang.com/ 爱思想','阅读 http://www.cnki.net/ 知网','阅读 https://shuge.org/ebooks/ 书格','资讯 https://www.solidot.org/ Solidot','微信公众号 http://weixin.qq.com/r/4HUIDMbEIQ5dKYJvbyBk ABBS'].join('\n');
        localstorage_set_websites_pwa(demo_str);
        search_websites_pwa();
    }
}

function clear_cache_websites_pwa(){
    if (confirm('是否更新版本？')){
        document.getElementById('span_status').innerHTML='';
        service_worker_delete_b('websites','','');
    }
}

function add_websites_pwa(){
    var websites_list=localstorage_get_websites_pwa(true);
    if (websites_list.length>=2000){
        alert('网址总数不能超过2000');
        return;
    }
    var blexample=websites_list[0];
    if (blexample==''){
        blexample='新闻 https://www.thepaper.cn/ 澎湃';
    }
    
    var blcategory='';
    var blstr=(prompt('输入格式：分类 网址 名称',blexample) || '').trim();
    var blname='';
    var bltag='';
    [blcategory,blstr,blname,bltag]=split_pwa_websites_b(blstr);
    
    if (blcategory==''){
        status_websites_pwa('无分类');
        return;
    }
    if (blstr==''){
        status_websites_pwa('无网址');
        return;    
    }
    if (blname==''){
        status_websites_pwa('无名称');
        return;    
    }
        
    if (websites_list.includes(' '+blstr+' ')){
        status_websites_pwa('已存在同名网址');
        return;
    }
    websites_list.push(blcategory+(bltag==''?'':','+bltag)+' '+blstr+' '+blname);
    localstorage_set_websites_pwa(websites_list);
    search_websites_pwa();
}

function status_websites_pwa(csstr){
    function status_websites_pwa_hide(){
        document.getElementById('span_status').innerHTML='';
    }
    //-----------------------
    document.getElementById('span_status').innerHTML=csstr;
    setTimeout(status_websites_pwa_hide,5000);
}

function form_websites_pwa(){
    var websites_list=localstorage_get_websites_pwa(false);
    
    var left_str='<p>';
    left_str=left_str+'<span class="aclick" onclick="search_websites_pwa();">Close</span> ';
    left_str=left_str+'<span class="aclick" onclick="update_websites_pwa();">Update</span> ';
        
    var right_str=' rows: '+websites_list.split('\n').length+'</p>';
    right_str=right_str+'<p><input type="text" id="input_filter" placeholder="filter" onkeyup="if (event.key==\'Enter\'){filter_websites_pwa(this.value);}" /></p>';    

    var blstr=textarea_with_form_generate_b('textarea_websites_pwa','width:90%;height:24rem;',left_str,'清空,复制,发送到临时记事本,发送地址',right_str,'','form_websites_pwa');
    document.getElementById('divhtml').innerHTML=blstr;
    document.getElementById('textarea_websites_pwa').value=websites_list;
    input_with_x_b('input_filter',(ismobile_b()?10:20));
}

function filter_websites_pwa(csstr){
    var otextarea=document.getElementById('textarea_websites_pwa');
    var list_t=otextarea.value.trim().split('\n');
    var bljg=[];
    for (let item of list_t){
        var blfound=str_reg_search_b(item,csstr,true);
        if (blfound==-1){
            break;
        }
        if (blfound){
            bljg.push(item);
        }
    }
    otextarea.value=bljg.join('\n');
}

function buttons_klwebsite_pwa(keyword=''){
    var bljg='<input type="text" id="input_search" value="'+keyword+'" placeholder="搜索" onkeyup="if (event.key==\'Enter\'){search_websites_pwa(this.value);}" />';
    bljg=bljg+'<span id="span_recent_search"></span>';
    return bljg;
}

function update_websites_pwa(){
    if (confirm('是否更新网址库？')==false){return;}
    var result_t=[];
    var repeated=[];
    var site_list=[];
    var list_t=document.getElementById('textarea_websites_pwa').value.trim().split('\n');
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        if (result_t.includes(item)){
            repeated.push(item);
            continue;
        }
        
        var site_tmp=split_pwa_websites_b(item);
        if (site_tmp[0]==''){continue;}
        site_list.push(site_tmp);
        
        result_t.push(item);
    }

    site_list.sort(function (a,b){return a[1].length>b[1].length ? 1 : -1});  //网址长度 - 保留注释

    var hostname,bltail;
    var name_set=new Set();
    for (let blxl=0,lent=site_list.length;blxl<lent;blxl++){
        var blname=name_remove_quote_websites_b(site_list[blxl][1],site_list[blxl][2]);
        if (blname!==site_list[blxl][2] && !name_set.has(blname)){
            site_list[blxl][2]=blname;
        }

        if (name_set.has(site_list[blxl][2])){
            [hostname,bltail]=same_name_websites_b(site_list[blxl][1],site_list[blxl][2],false);
            console.log(hostname,bltail);
            if (hostname!=='' && !name_set.has(hostname)){
                site_list[blxl][2]=hostname;
            } else {
                site_list[blxl][2]=bltail;
            }
        }
        name_set.add(site_list[blxl][2]);    
    
        site_list[blxl]=site_list[blxl][0]+(site_list[blxl][3]==''?'':','+site_list[blxl][3])+ ' '+site_list[blxl][1]+' '+site_list[blxl][2];
    }

    site_list.sort(function (a,b){return zh_sort_b(a,b,false);});
    localstorage_set_websites_pwa(site_list);

    repeated.sort(function (a,b){return zh_sort_b(a,b,false);});        
    alert_websites_pwa(repeated,'重复项目');
    search_websites_pwa();
}

function array_2_local_storage_websites_pwa(csarray,cskey='',return_max=-1){
    csarray=array_unique_b(csarray);
    if (cskey=='' && return_max==-1){
        csarray.sort(function (a,b){return zh_sort_b(a,b,false);});
        csarray=csarray.slice(-2000,);
        localstorage_set_websites_pwa(csarray);
    } else if (return_max>0){
        csarray=csarray.slice(0,return_max);
    }
    return csarray.length;
}

function alert_websites_pwa(cslist,cscaption){
    var bllen=cslist.length;
    if (bllen>5){
        alert('忽略了'+bllen+'个'+cscaption+'：\n\n'+cslist.slice(0,5).join('\n')+'\n...');
    } else if (bllen>0){
        alert('忽略了'+bllen+'个'+cscaption+'：\n\n'+cslist.join('\n'));        
    }
}

function search_websites_pwa(cskey='',is_random=false,return_max=-1){
    var websites_list=localstorage_get_websites_pwa(true);
    if (websites_list.length==1 && websites_list[0]==''){return;}
    
    cskey=cskey.trim();
    
    var fav_set=new Set();
    if (cskey=='FAV'){
        fav_set=fav_www_get_websites_b();
    }
        
    var list_t=[];
    if (cskey=='FAV'){
        for (let item of websites_list){
            for (let ahref of fav_set){
                if (item.includes(' '+ahref+' ')){
                    list_t.push(item);
                    break;
                }
            }
        } 
    } else if (cskey!==''){
        if (cskey.match(/^\d{4}\-\d{2}\-\d{2}$/)!==null){
            var theday=validdate_b(cskey);
            if (theday!==false){
                var bldays_count=day_of_year_b(theday) % 20;
                for (let item of websites_list){
                    var blasc_sum=asc_sum_b(item);
                    if (blasc_sum % 20 == bldays_count){
                        list_t.push(item);
                    }
                }
            }
        }
        
        if (list_t.length==0){
            var is_reg=klmenu_check_b('span_reg_web',false);
            for (let item of websites_list){
                var blfound=str_reg_search_b(item,cskey,is_reg);
                if (blfound==-1){break;}
                if (blfound){
                    list_t.push(item);
                }
            }
        }
    }
    if (cskey!==''){
        websites_list=[].concat(list_t);
    }
    
    list_t=[];
    var blcategory='';
    var blstr='';
    var blname='';
    var bltag='';
    var new_list=[];
    var ignored_list=[];
    for (let item of websites_list){
        [blcategory,blstr,blname,bltag]=split_pwa_websites_b(item);
        if (blcategory=='' || blstr=='' || blname==''){
            ignored_list.push(item);
            continue;
        }
        list_t.push([blcategory,blstr,blname]);
        new_list.push(blcategory+(bltag==''?'':','+bltag)+' '+blstr+' '+blname);
    }
    alert_websites_pwa(ignored_list,'网址');
    
    if (is_random){
        list_t.sort(randomsort_b);
    } else {
        list_t.sort(function (a,b){return zh_sort_b(a,b,false,2);});
        list_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    }
    
    if (return_max>0){
        list_t=list_t.slice(0,return_max);
    }
    var new_list_len=array_2_local_storage_websites_pwa(new_list,cskey,return_max);

    var enable_jieba=klmenu_check_b('span_jieba_web',false);
    if (enable_jieba){
        jieba_websites_b(list_t,2);
    }
    var result_t={};
    var blxl=0;
    for (let item of list_t){        
        //item 形如 [ "资讯", "https://news.sina.com.cn", "新浪新闻" ] - 保留注释
        var blkey='w_'+category_websites_b(enable_jieba,item[2],item[0],cskey);
        if (result_t[blkey]==undefined){
            result_t[blkey]=[];
        }
        var blhref=item[1].replace(new RegExp('"','g'),'&quot;');
        var blstyle=(today_clicked_websites_global.has(blhref)?' style="background-color:'+scheme_global['pink']+';"':'');
        result_t[blkey].push('<span class="span_websites_link_container"><a class="a_oblong_box" href="'+blhref+'" onclick="recent_websites_b(this); menu_refresh_recent_sites_websites_pwa();"'+blstyle+' target=_blank>'+specialstr92_b(item[2])+'</a></span>');
        blxl=blxl+1;
    }
    
    var bljg=[];
    for (let key in result_t){
        bljg.push('<span style="font-weight:bold;font-size:1.2rem;">'+key.substring(2,)+'</span> '+result_t[key].join(' '));
    }
    if (enable_jieba){
        bljg.sort(function (a,b){return zh_sort_b(a,b);});
    }
    document.getElementById('divhtml').innerHTML='<p style="line-height:'+(ismobile_b()?'1.8':'2.2')+'rem;">'+buttons_klwebsite_pwa(cskey)+bljg.join(' ')+'</p>';
    
    recent_search_websites_pwa(cskey);  //放在 <span id="span_recent_search"></span> 形成之后 - 保留注释

    input_with_x_b('input_search',(ismobile_b()?8:20));
    document.getElementById('span_count').innerText='('+new_list_len+')';
    top_bottom_arrow_b('div_top_bottom',blxl+' ');
}

function recent_search_websites_pwa(cskey){
    recent_search_b('recent_search_websites_pwa',[cskey,date2str_b(),previous_day_b(),next_day_b()],'search_websites_pwa','span_recent_search',[],15,false,-1,'^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$');
}

function organize_websites_pwa(){
    var ospans=document.getElementsByClassName('span_websites_link_container');

    var odelete=document.querySelector('span.span_websites_link_container span.span_box');
    if (odelete){
        for (let item of ospans){
            odelete=item.querySelector('span.span_box');
            if (odelete){
                odelete.parentNode.removeChild(odelete);
            }
        }
        search_websites_pwa();
    } else {
        for (let item of ospans){
            item.insertAdjacentHTML('beforeend',' <span class="span_box" onclick="delete_websites_pwa(this.parentNode);">☒</span>');
        }
    }
}

function delete_websites_pwa(ospan){
    if (!ospan){
        return;
    }
    var oa=ospan.querySelector('a.a_oblong_box');
    if (!oa){
        return;
    }
    var blstr=oa.innerText;
    if (confirm('是否删除 '+blstr+' ？')){
        var websites_list=localstorage_get_websites_pwa(true);
        var list_t=[];
        for (let item of websites_list){
            if (item.includes(' '+oa.href+' ')){continue;}
            list_t.push(item);
        }
        localstorage_set_websites_pwa(list_t);
        ospan.parentNode.removeChild(ospan);
    }
}

function qr_html_websites_pwa(ahref=''){
    if (qr_html_websites_b('divhtml','a.a_oblong_box',ahref)){
        qr_generate_websites_pwa(klmenu_check_b('span_veil_web',false));
    } else {  //切换 - 保留注释
        search_websites_pwa();
    }
}

function weixin_select_pwa(){
    var odiv_wx=document.getElementById('div_canvas_qr_wx');
    if (odiv_wx){return;}
    var odiv=document.getElementById('divhtml');
    var oas=odiv.querySelectorAll('a.a_oblong_box');
    var wx_list=[];
    var other_list=[];
    for (let item of oas){
        var blhref=item.href;
        if (!blhref){continue;}
        if (blhref.includes('/weixin.qq.com/')){
            wx_list.push([blhref,item.innerText]);
        } else {
            other_list.push(item.outerHTML);
        }
    }
    wx_list.sort(function (a,b){return zh_sort_b(a,b,false,1);});
    var blselect='<div id="div_canvas_qr_wx" style="width:'+canvas_size_websites_global*1.5+'px;height:'+canvas_size_websites_global*1.5+'px;padding:0.5rem;border:0.1rem black solid;"></div>';
    var bllen=wx_list.length;
    blselect=blselect+'<select id="select_canvas_qr_wx" style="margin-top:0.5rem;margin-bottom:0.5rem;height:2rem;" onchange="weixin_qr_pwa(this.value);">';
    for (let blxl=0;blxl<bllen;blxl++){
        let item=wx_list[blxl];
        blselect=blselect+'<option value="'+item[0]+'">'+(blxl+1)+'/'+bllen+'. '+item[1]+'</option>\n';
    }
    blselect=blselect+'</select> ';
    if (bllen>1){
        blselect=blselect+'<span class="aclick" onclick="weixin_prev_or_next_pwa(\'p\');">prev</span> <span class="aclick" onclick="weixin_prev_or_next_pwa(\'n\');">next</span>';
    }
    odiv.innerHTML=blselect+'<p>'+other_list.join(' ')+'</p>';
    var rect =document.getElementById('div_canvas_qr_wx').getBoundingClientRect();
    document.getElementById('select_canvas_qr_wx').style.width=rect.width+'px';
    weixin_qr_pwa(wx_list[0][0]);
}

function weixin_prev_or_next_pwa(cstype){
    var oselect=document.getElementById('select_canvas_qr_wx');
    if (select_prev_or_next_b(oselect,cstype)){
        weixin_qr_pwa(oselect.value);
    }
}

function weixin_qr_pwa(csvalue){
    var odiv=document.getElementById('div_canvas_qr_wx');
    odiv.innerHTML='';
    create_qr_b($(odiv),csvalue,canvas_size_websites_global*1.5,'black','white',false,'canvas');
    var ocanvas=odiv.querySelector('canvas');
    if (ocanvas){
        ocanvas.outerHTML='<img class="img_qr" src="'+canvas2img_b(ocanvas)+'" />';
    }
}

function qr_generate_websites_pwa(do_veil=false){
    if (qr_generate_websites_b('div#divhtml canvas',do_veil)===false){
        return;
    }
    setTimeout(function(){qr_generate_websites_pwa(do_veil);},10);
}
