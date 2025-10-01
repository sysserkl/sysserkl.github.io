function qr_html_websites_b(divid,aclass,ahref=''){
    var odiv=document.getElementById(divid);
    if (!odiv){return false;}
    if (odiv.getElementsByTagName('canvas').length>0 || odiv.getElementsByClassName('img_qr').length>0){
        return false;
    }    
    var oas=odiv.querySelectorAll(aclass);
    var bljg=[];
    for (let one_a of oas){
        bljg.push(one_a.outerHTML);
    }
    odiv.innerHTML=bljg.join('\n');
    
    oas=odiv.querySelectorAll('a.a_oblong_box');
    for (let one_a of oas){
        if (ahref=='' || one_a.href.includes(ahref)){
            one_a.outerHTML=div_qr_ane_name_generate_websites_b(canvas_size_websites_global,one_a.href,one_a.outerHTML);
        } else {
            one_a.outerHTML='<div style="positon:relative;float:left;padding:0.2rem;text-align:center;">'+one_a.outerHTML+'</div>';
        }
    }

    oa_qr_list_websites_global=odiv.querySelectorAll('div.div_qr');
    return true;
}

function div_qr_ane_name_generate_websites_b(qr_size,cshref,cslink,cstable=''){
    return '<div class="div_qr_and_name" style="positon:relative;float:left;padding:0.2rem;text-align:center;"><div class="div_qr" style="width:'+qr_size+'px;height:'+qr_size+'px;" title="'+cshref+'">'+cstable+'</div>'+cslink+'</div>';
}

function fav_www_get_websites_b(){
    return new Set(local_storage_get_b('fav_websites',-1,true));
}

function fav_www_menu_websites_b(csjump='',is_pwa=false){
    var str_t=klmenu_hide_b(csjump);

    var set_list=[
    ['add','fav_www_set_websites_b(\'add\',\''+csjump+'\','+is_pwa+');',true],
    ['remove','fav_www_set_websites_b(\'remove\',\''+csjump+'\','+is_pwa+');',true],
    ['refresh','fav_www_refresh_websites_b();',true],
    ];    
    var result_t=[menu_container_b(str_t,set_list,'')];

    fav_websites_global.sort(function (a,b){return zh_sort_b(a,b,false,1);});
    for (let item of fav_websites_global){
        result_t.push('<a href="'+item[0]+'" target=_blank onclick="'+str_t+'recent_websites_b(this);">'+item[1]+'</a>');
    }
    return klmenu_b(result_t,'💖','14rem','1rem','1rem','30rem','','div_fav_www_menu');
}

function fav_www_refresh_websites_b(){
    var fav_set=fav_www_get_websites_b();
    var has_title=[];
    var without_title=[];
    for (let one_href of fav_set){
        var blfound=false;
        for (let item of fav_websites_global){
            if (one_href==item[0]){
                blfound=true;
                break;
            }
        }
        if (blfound){
            has_title.push(one_href);
        } else {
            without_title.push(one_href);
        }
    }

    if (without_title.length==0){
        alert('未发现失效 fav 链接');
        return;
    }

    var rndstr=randstr_b(4,true,false);        
    var blps=(prompt('输入 '+rndstr+' 剔除 '+without_title.length+' 个失效 fav 链接：\n'+without_title.join('\n')) || '').trim();
    if (blps!==rndstr){return;}   
    localStorage.setItem('fav_websites',has_title.join('\n'));
    alert('操作完成，现有 fav 链接 '+has_title.length+' 个。');
}

function fav_www_set_websites_b(cstype,csjump,is_pwa){
    if (is_pwa){
        var oa=document.querySelector('span.span_websites_link_container a.a_oblong_box');
    } else {
        var oa=document.querySelector('.p_sites a.a_oblong_box');
    }
    if (!oa){return;}
    var blhref=oa.href;
    var bltitle=oa.innerText;
    
    var fav_set=fav_www_get_websites_b();
    
    if (cstype=='add'){
        if (fav_set.has(blhref)){return;}
        if (fav_set.size>=100){
            alert('fav 已达 100');
            return;
        }
        if (!confirm('是否添加 '+bltitle+' ？')){return;}
        fav_set.add(blhref);
        fav_websites_global.push([blhref,bltitle]);
    } else {  //'remove'
        if (!fav_set.has(blhref)){return;}        
        if (!confirm('是否移除'+bltitle+' ？')){return;}
        fav_set.delete(blhref);
        for (let blxl=0,lent=fav_websites_global.length;blxl<lent;blxl++){
            if (fav_websites_global[blxl][0]==blhref){
                fav_websites_global.splice(blxl,1);
                break;
            }
        }       
    }
    localStorage.setItem('fav_websites',Array.from(fav_set).join('\n'));    
    document.getElementById('div_fav_www_menu').outerHTML=fav_www_menu_websites_b(csjump,is_pwa);
}

function qr_img_veil_add_one_websites_b(oimg){
    var oimgs=document.querySelectorAll('div.div_qr img.img_qr, div.div_qr table');
    for (let one_img of oimgs){
        if (one_img==oimg){
            one_img.style.filter='';
        } else {
            one_img.style.filter='brightness(0%) contrast(0%)'; //brightness(0%) 只用 brightness(0%) 会变成黑色 - 保留注释
        }
    }
}

function qr_img_veil_add_batch_websites_b(){
    var oimgs=document.querySelectorAll('div.div_qr img.img_qr, div.div_qr table');
    for (let one_img of oimgs){
        one_img.addEventListener('click',function(){
            qr_img_veil_add_one_websites_b(this);
        });
    }
}

function qr_generate_websites_b(query_str,do_veil=false,qr_type='canvas'){
    if (oa_qr_no_websites_global>=oa_qr_list_websites_global.length){
        oa_qr_no_websites_global=0;
        oa_qr_list_websites_global=[];
        
        var ocanvas=document.querySelectorAll(query_str);
        for (let item of ocanvas){
            item.outerHTML='<img class="img_qr" src="'+canvas2img_b(item)+'" />';
        }
        if (do_veil){
            qr_img_veil_add_batch_websites_b();
        }
        return false;
    }
    
    var one_oa=oa_qr_list_websites_global[oa_qr_no_websites_global];
    create_qr_b($(one_oa),one_oa.title,canvas_size_websites_global,'black','white',false,qr_type);
    oa_qr_no_websites_global=oa_qr_no_websites_global+1;
    return true;
}

function icon_websites_b(cshref,ico_type){
    switch (ico_type){
        case 'remote':
            var blsrc=href2host_b(cshref,true)+'/favicon.ico';
            break;
        case '':
        case 'local':
            var blsrc='../../../../data/website_ico/'+href2host_b(cshref,false)+'.ico';
            break;
        case 'old':
            var blsrc='';
            break;
    }
    if (blsrc==''){return '';}
    return '<img alt="" src="'+blsrc+'" style="max-width:1rem;max-height:1rem;border-radius:1rem;" />';   //alt可以隐藏无图片的网站，title不行 - 保留注释
}

function recent_websites_b(obj_a=false,return_type='none',user_js=''){
    if (typeof today_clicked_websites_global== 'undefined'){
        today_clicked_websites_global=new Set();
    }
    
    var bltoday=today_str_b();

    if (obj_a){
        var removed_item=obj_a.href+' '+obj_a.innerText.trim();    
        var recent_websites_list=local_storage_get_b('recent_websites',500,true,removed_item);
        
        if (!recent_websites_list.includes(bltoday)){
            recent_websites_list=[bltoday].concat(recent_websites_list);  
        }
        recent_websites_list=[removed_item].concat(recent_websites_list);
        
        localStorage.setItem('recent_websites',recent_websites_list.join('\n'));
        obj_a.style.backgroundColor=scheme_global['pink'];
    } else {
        var recent_websites_list=local_storage_get_b('recent_websites',500,true);
    }

    if (today_clicked_websites_global.size==0){
        var blat=recent_websites_list.indexOf(bltoday);
        for (let blxl=0;blxl<blat;blxl++){
            today_clicked_websites_global.add(recent_websites_list[blxl].split(' ')[0]);
        }
    } else if (obj_a){
        today_clicked_websites_global.add(obj_a.href);  //当同时使用 网址库 和 pwa 时，相互之间 localStorage 可以同步，但 全局变量 today_clicked_websites_global 不同步 - 保留注释
    }

    recent_websites_list=recent_websites_list.slice(0,30);
    
    if (return_type=='none'){return;}
    
    var ico_type=(is_old_firefox_b()?'old':(is_local_b()?'local':''));
    var result_t=[];
    var blclass=(return_type=='menu'?'':'class=" a_oblong_box" ');
    switch (return_type){
        case 'html':
        case 'menu':
            for (let item of recent_websites_list){
                var blat=item.indexOf(' ');
                if (blat<0){continue;}
                var blhref=item.substring(0,blat).trim();
                var bltitle=item.substring(blat,).trim();
                var blstyle=(return_type=='html' && today_clicked_websites_global.has(blhref)?'style="background-color: '+scheme_global['pink']+';" ':'');

                result_t.push('<a href="'+blhref+'" target=_blank '+blclass+blstyle+'onclick="recent_websites_b(this);'+user_js+'">'+bltitle+icon_websites_b(blhref,ico_type)+'</a>\n');
            }
            break;
        case 'array':
            for (let item of recent_websites_list){
                if (item.includes(' ')){
                    result_t.push(item);
                }
            }    
            break;
        case 'recent_array':
            for (let item of recent_websites_list){
                if (item.includes(' ')){
                    result_t.push(split_pwa_websites_b('RECENT '+item).slice(0,3));
                }
            }
            break;
    }
    return result_t;
}

function same_name_websites_b(cshref,cstitle='',use_small=false){
    var list_t=cshref.split('/');
    if (list_t.slice(-1)=='' && list_t.length>1){
        var bltail=list_t.slice(-2)[0];
    } else {
        var bltail=list_t.slice(-1)[0];
    }
    
    try {
        var blurl = new URL(cshref);
        var hostname = blurl.hostname;
        var list_t=hostname.split('.');
        if (list_t[0]=='www'){
            hostname=list_t.slice(1,).join('.');
        }
        list_t=hostname.split('.');
        if (list_t.length==2){
            hostname=list_t[0];
        } else if (list_t.length>=3){
            hostname=list_t[1];
        }
    } catch (error){
        var hostname='';
    }
    
    if (hostname!==''){
        hostname='('+hostname+')';
    }
    bltail='('+bltail+')';

    if (use_small){
        if (hostname!==''){
            hostname='<small>'+hostname+'</small>';
        }
        bltail='<small>'+bltail+'</small>';
    }

    if (hostname!==''){
        hostname=cstitle+hostname;
    }
    bltail=cstitle+bltail;
    
    return [hostname,bltail];
}

function name_remove_quote_websites_b(cshref,csname){
    var blat=csname.lastIndexOf('(');
    if (blat>0 && csname.slice(-1)==')'){
        var blstr_right=csname.slice(blat+1,-1);
        if (cshref.slice(-1*blstr_right.length,)==blstr_right){
            csname=csname.substring(0,blat);
        }
    }
    return csname;
}

function tag_menu_websites_b(tag_list,search_fn,str_t){
    tag_list=object2array_b(tag_list,true);
    tag_list.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    var klmenu_tag=[];
    for (let item of tag_list){
        if (item[1]<2){continue;}
        klmenu_tag.push('<span class="span_menu" onclick="'+str_t+search_fn+'(this.innerText);">'+item[0]+'</span>');
    }
    return klmenu_tag;
}

function jieba_websites_b(csarray,title_no=1){
    if (jieba_websites_global.size>0){return;}
    var name_list=[];
    for (let arow of csarray){
        name_list.push(arow[title_no]);
    }
    var blstr=name_list.join(' ');
    var words_list=split_words_b(blstr,true);
    var rank_list=count_words_b(blstr,words_list,4);  //元素形如： [ "地图", 4 ] - 保留注释
    
    var blxl=0;
    jieba_websites_global=new Set();
    for (let item of rank_list){
        var blkey=item[0].toLowerCase().trim();
        if (blkey.length<2){continue;}
        if (['and','com','htm','html','http','https','org','small','the','www'].includes(blkey)){continue;}
        if (blkey.match(/^[a-z]{1,2}$/)!==null){continue;}
        jieba_websites_global.add(blkey);
        blxl=blxl+1;
        if (blxl>=30){break;}
    }
}

function category_websites_b(enable_jieba,cstitle,cscategory,cskey){
    if (cskey.includes(' ')){
        cskey='';
    }
    if (enable_jieba){
        var result_t='';
        for (let one_word of jieba_websites_global){
            if (one_word==cskey){continue;} //对相同 cskey  下的网址进行细分 - 保留注释
            if (cstitle.toLowerCase().includes(one_word)){
                result_t=one_word;
                break;
            }
        }
        if (result_t==''){
            result_t=cscategory.split(',')[0];
        }
    } else {
        var result_t=cscategory.split(',')[0];
    }
    if (result_t.length<2){
        result_t='unclassified';
    }
    return result_t;
}

function split_pwa_websites_b(csstr){
    var blat=csstr.indexOf('http');
    if (blat==-1){
        return ['','','',''];
    }
    var list_t=csstr.substring(0,blat).trim().split(',');
    var blcategory=list_t[0];
    if (blcategory==''){
        blcategory='未分类';
    }
    var bltag=list_t.slice(1,).join(',');
    
    csstr=csstr.substring(blat,);
    blat=csstr.indexOf(' ');
    if (blat==-1){
        blat=csstr.lastIndexOf('/');
        if (blat==-1){
            return [blcategory,csstr,'',bltag];
        }
    }
    var blname=csstr.substring(blat,).trim();
    csstr=csstr.substring(0,blat).trim();
    return [blcategory,csstr,blname,bltag];
    //形如：[ "资讯", "https://weibo.com/u/2938715943", "人民网舆情数据中心 - 微博", "CN" ] - 保留注释
}

function search_cache_websites_b(cskey='',is_reg=false,is_random=false,return_max=-1,enable_jieba=false,cslist=[]){
    function sub_search_websites_b_one(item){
        if (item==''){return;}
        
        [blcategory,blstr,blname,bltag]=split_pwa_websites_b(item);
        if (blcategory=='' || blstr=='' || blname==''){
            ignored_list.push(item);
            return;
        }
        result_t.push([blcategory,blstr,blname]);
        new_list.push(blcategory+(bltag==''?'':','+bltag)+' '+blstr+' '+blname);
    }
    
    if (cslist.length==0){
        websites_list=local_storage_get_b('websites_list_pwa',-1,true);
    } else {
        websites_list=[].concat(cslist);
    }
    //websites_list 的元素形如："微信公众号 http://weixin.qq.com/r/ukwYHNLEQho_KZZ-bxk_ 数据宝" - 保留注释
    
    var result_t=[];
    var blcategory, blstr, blname, bltag;
    var new_list=[];
    var ignored_list=[];

    cskey=cskey.trim();

    if (cskey==''){
        for (let item of websites_list){
            sub_search_websites_b_one(item);
        }
    } else {
        for (let item of websites_list){
            var blfound=str_reg_search_b(item,cskey,is_reg);
            if (blfound==-1){break;}
            if (blfound){
                sub_search_websites_b_one(item);
            }
        }
    }

    if (is_random){
        result_t.sort(randomsort_b);
    } else {
        result_t.sort(function (a,b){return zh_sort_b(a,b,false,2);});
        result_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    }

    if (return_max>0){
        result_t=result_t.slice(0,return_max);
    }

    if (enable_jieba){
        jieba_websites_b(result_t,2);
    }
    
    return [result_t,new_list,ignored_list];
}

function search_links_websites_b(cskey,cslist,concat_recent=false,enable_jieba=false,userjs=''){
    var result_t={};
    var blcount=0;
    
    if (concat_recent){
        cslist=recent_websites_b(false,'recent_array').concat(cslist);  //recent 不进入localStorage - 保留注释
    }
    
    for (let item of cslist){
        //item 形如 [ "资讯", "https://news.sina.com.cn", "新浪新闻" ] - 保留注释
        var blkey='w_'+category_websites_b(enable_jieba,item[2],item[0],cskey);
        if (result_t[blkey]==undefined){
            result_t[blkey]=[];
        }
        var blhref=item[1].replace(new RegExp('"','g'),'&quot;');
        var blstyle=(today_clicked_websites_global.has(blhref)?' style="background-color:'+scheme_global['pink']+';"':'');
        result_t[blkey].push('<a class="a_oblong_box" href="'+blhref+'" onclick="recent_websites_b(this);'+userjs+'"'+blstyle+' target=_blank>'+specialstr92_b(item[2])+'</a>');
        blcount=blcount+1;
    }
    return [result_t,blcount];
}

function search_html_websites_b(cslist,csdisplay,enable_jieba){
    function sub_search_html_websites_b_join(csarr,display_str=''){
        return '<span class="span_websites_link_container" style="display:'+display_str+';">'+csarr.join('</span> <span class="span_websites_link_container" style="display:'+display_str+';">')+'</span>';
    }
    
    var bljg=[];
    for (let key in cslist){
        let bllen=cslist[key].length;
        let len_str='<span style="font-size:0.9rem; font-weight:normal;">('+bllen+')</span>';
        if (bllen>5){
            bljg.push('<span><span style="font-weight:bold;font-size:1.2rem;cursor:pointer;" onclick="show_all_or_part_websites_b(this);">'+key.substring(2,)+len_str+'</span> '+sub_search_html_websites_b_join(cslist[key].slice(0,5))+' '+sub_search_html_websites_b_join(cslist[key].slice(5,),csdisplay)+'</span>');
        } else {
            bljg.push('<span><span style="font-weight:bold;font-size:1.2rem;">'+key.substring(2,)+len_str+'</span> '+sub_search_html_websites_b_join(cslist[key])+'</span>');
        }
    }
    
    if (enable_jieba){
        bljg.sort(function (a,b){return zh_sort_b(a,b);});
    }
    return bljg;
}

function show_all_or_part_websites_b(ospan){
    var odoms=ospan.parentNode.querySelectorAll('span.span_websites_link_container');
    var lent=odoms.length;
    if (lent<=5){return;}
    var bldisplay=(odoms[5].style.display=='none'?'':'none');
    for (let blxl=5;blxl<lent;blxl++){
        odoms[blxl].style.display=bldisplay;
    }
}

function sort_js_websites_b(csarr){
    csarr.sort();
    csarr.sort(function (a,b){return zh_sort_b(a,b,false,1);});
    csarr.sort(function (a,b){return zh_sort_b(a,b,false,2);});
    return csarr;
}

function js_arr_type_websites_b(csarr){
    //网址载入过滤
    var klwebphp_path=klwebphp_path_b();
    var href_set=new Set();
    var result_t=[];
    for (let arow of csarr){
        var href_str=arow[0];
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
            arow[0]=href_str;
        }
        if (count1==1){
            if (arow[2]=='CN' || arow[2].slice(-3,)==',CN' || arow[2].substring(0,3)=='CN,' || arow[2].includes(',CN,')){
                count2=1;
            }
        }
        arow.push([count1,count2,count3]);   //selenium类型网址，其中CN网址，非selenium类型网址 - 保留注释
        if (href_set.has(href_str)){
            console.log('相同网址',arow);    //通常是RSS地址 - 保留注释
        } else {
            href_set.add(href_str);
            result_t.push(arow);
        }
    }
    console.log('过滤前条数：',csarr.length,'过滤后条数：',result_t.length);
    return result_t;
}
    
function search_js_websites_b(websites_list,keyword='',csnumber=999,enable_rnd=false,enable_jieba=false){
    function sub_search_js_websites_b_href(csarray){
        var href_str=csarray[0];    //href_str 可以不含有 http，如本地网站 - 保留注释
        if (csarray[3]>csnumber && csnumber>-1){return '';}
        
        if (keyword!==''){
            var blfound=str_reg_search_b(csarray,keyword,true);
            if (blfound==-1){return false;}
            if (!blfound){return '';}
        }

        return href_str;
    }
    
    function sub_search_js_websites_b_add(item,cshref,csxl){
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
    websites_list=sort_js_websites_b(websites_list);
    
    var fav_set=new Set();
    if (keyword=='FAV'){
        fav_set=fav_www_get_websites_b();
    }
    var category_list={};
    
    if (enable_jieba){
        jieba_websites_b(websites_list,1);
    }

    var href_str='';
    if (fav_set.size==0){
        for (let blxl=0,lent=websites_list.length;blxl<lent;blxl++){
            var item=websites_list[blxl];
            href_str=sub_search_js_websites_b_href(item);
            
            if (href_str===false){break;}
            else if (href_str===''){continue;}
            
            sub_search_js_websites_b_add(item,href_str,blxl);
        }
    } else {
        for (let blxl=0,lent=websites_list.length;blxl<lent;blxl++){
            var item=websites_list[blxl];
            if (fav_set.has(item[0])){
                sub_search_js_websites_b_add(item,item[0],blxl);
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

function js_2_demo_style_websites_b(csarr,cskey='',only_http=false,enable_jieba=false){
    var result_t=search_js_websites_b(csarr,cskey,999,false,enable_jieba);

    var demo_list=[];
    if (only_http){
        for (let href_list of result_t){
            demo_list.push(href_list[0]);
        }
    } else {
        for (let href_list of result_t){
            var href_str=href_list[0];
            var category=csarr[href_list[1]][2];
            if (category==''){
                category='未分类';
            }
            demo_list.push(category+' '+href_str+' '+csarr[href_list[1]][1].replace(/<\/?small>/g,''));
        }
    }
    return demo_list;
}

function demo_2_cache_style_websites_b(cslist){
    var result_t=[];
    var repeated=[];
    var site_list=[];
    for (let item of cslist){
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
    repeated.sort(function (a,b){return zh_sort_b(a,b,false);});
    return [site_list,repeated];
}

function search_load_websites_b(cskey,is_reg,return_max=-1,run_fn=false){
    function sub_search_load_websites_b_load(){
        if (typeof sites_all_global == 'undefined'){
            sites_all_global=[];
        }
        
        if (typeof sites_cache_global == 'undefined'){
            sites_cache_global=js_arr_type_websites_b(sites_all_global);
            sites_cache_global=js_2_demo_style_websites_b(sites_cache_global);
            sites_cache_global=demo_2_cache_style_websites_b(sites_cache_global)[0];
        }
        
        sub_search_load_websites_b_search();
    }
    
    function sub_search_load_websites_b_search(){
        var result_t=search_cache_websites_b(cskey,is_reg,false,return_max,false,sites_cache_global)[0];
        result_t=search_links_websites_b(cskey,result_t,true)[0];
        
        var bljg=search_html_websites_b(result_t,'none',false);
        if (typeof run_fn == 'function'){
            run_fn(bljg);
        }
        console.log('search_load_websites_b() 费时：'+(performance.now() - t0) + ' milliseconds');
    }
    
    var t0 = performance.now();

    if (typeof sites_all_global == 'undefined'){
        var file_list=klbase_addons_import_js_b([],[],['sites_all_data.js'],[],false,false);
        load_js_var_file_b('sites_all_global',file_list,'sites_all_data.js',sub_search_load_websites_b_load);
    } else {
        sub_search_load_websites_b_load();
    }
}

function efull_get_websites_b(run_fn=false){
    function sub_efull_get_websites_b_done(is_ok){
        if (!is_ok){return;}
        var result_t=new Set();
        for (let item of sites_all_global){
            if ((','+item[2]+',').includes(',EFULL,')){
                var host_name=(item[0].match(/\/\/(www\.)?(.*?)\/?$/) || ['','',''])[2];
                result_t.add(host_name);
            }
        }
        
        var efull_set=new Set();
        for (let item of result_t){
            var blfound=false;
            for (let one_host of result_t){
                if (item!==one_host && item.includes(one_host)){
                    blfound=true;
                    break;
                }
            }
            if (!blfound){
                efull_set.add(item);
            }
        }
        console.log(efull_set); //此行保留 - 保留注释
        efull_set=Array.from(efull_set);
        if (typeof run_fn == 'function'){
            run_fn(efull_set);
        }
    }

    var flist=klbase_addons_import_js_b([],[],['sites_all_data.js'],[],false,false);
    load_js_var_file_b('sites_all_global',flist,'sites_all_data.js',sub_efull_get_websites_b_done,true,false,-1,100,true);
}
