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
            one_a.outerHTML='<div style="positon:relative;float:left;padding:0.2rem;text-align:center;"><div class="div_qr" style="width:'+canvas_size_websites_global+'px;height:'+canvas_size_websites_global+'px;" title="'+one_a.href+'"></div>'+one_a.outerHTML+'</div>';
        } else {
            one_a.outerHTML='<div style="positon:relative;float:left;padding:0.2rem;text-align:center;">'+one_a.outerHTML+'</div>';        
        }
    }

    oa_qr_list_websites_global=odiv.querySelectorAll('div.div_qr');
    return true;
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
        for (let blxl=0;blxl<fav_websites_global.length;blxl++){
            if (fav_websites_global[blxl][0]==blhref){
                fav_websites_global.splice(blxl,1);
                break;
            }
        }       
    }
    localStorage.setItem('fav_websites',Array.from(fav_set).join('\n'));    
    document.getElementById('div_fav_www_menu').outerHTML=fav_www_menu_websites_b(csjump,is_pwa);
}

function qr_img_veil_websites_b(oimg){
    var oimgs=document.querySelectorAll('img.img_qr');
    for (let one_img of oimgs){
        if (one_img==oimg){
            one_img.style.filter='';
        } else {
            one_img.style.filter='brightness(0%) contrast(0%)'; //brightness(0%) 只用 brightness(0%) 会变成黑色 - 保留注释
        }
    }
}

function qr_generate_websites_b(query_str,do_veil=false){
    if (oa_qr_no_websites_global>=oa_qr_list_websites_global.length){
        oa_qr_no_websites_global=0;
        oa_qr_list_websites_global=[];
        
        var ocanvas=document.querySelectorAll(query_str);
        for (let item of ocanvas){
            item.outerHTML='<img class="img_qr" src="'+canvas2img_b(item)+'" />';
        }
        if (do_veil){
            var oimgs=document.querySelectorAll('img.img_qr');
            for (let one_img of oimgs){
                one_img.addEventListener('click',function(){
                    qr_img_veil_websites_b(this);
                });
            }
        }
        return false;
    }
    
    var one_oa=oa_qr_list_websites_global[oa_qr_no_websites_global];
    create_qr_b($(one_oa),one_oa.title,canvas_size_websites_global,'black','white',false,'canvas');
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
    blcategory=list_t[0];
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
    //形如：[ "资讯", "https://weibo.com/u/2938715943?is_all=1", "人民网舆情数据中心 - 微博", "CN" ] - 保留注释
}
