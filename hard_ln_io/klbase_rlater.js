function fav_add_rlater_b(csid,csa,addtag=false,cscaption='移动'){
    if (typeof csid == 'string'){
        var oa=document.querySelector('a#'+csid);
    }
    else {  // object - 保留注释
        var oa=csid;
    }
    if (!oa){return;}
    var bltag='';
    if (addtag){
        bltag=(prompt('输入 tag 并'+cscaption+'到收藏夹(不输入则取消收藏): \n'+specialstr_html_b(oa.href)+'\n'+specialstr_html_b(oa.innerText)) || '');
        bltag=bltag.replace(new RegExp(/\r\n/,'g'),' ');
        bltag=bltag.replace(new RegExp(/\n/,'g'),' ');
        if (bltag==''){return;}
    }
    
    if (addtag==true || confirm('是否'+cscaption+'到收藏夹：\n'+specialstr_html_b(oa.href)+'\n'+specialstr_html_b(oa.innerText)+'？')){
        var fav_sites=local_storage_get_b('fav_sites_rlater',-1,false)+'\n'; //(localStorage.getItem('fav_sites_rlater') || '')+'\n';
        var bltitle=oa.innerText;
        if (bltitle.includes('[') || bltitle.includes(']')){
            bltitle='<nowiki>'+bltitle+'</nowiki>';
        }
        var blstr='# ['+specialstr_html_b(oa.href)+' '+specialstr_html_b(bltitle)+']';
        if (!fav_sites.includes(blstr)){
            if (bltag!==''){
                blstr=blstr+' '+bltag;
            }
            fav_sites=(fav_sites+blstr+'\n').trim();
            localStorage.setItem('fav_sites_rlater',fav_sites);
            csa.innerHTML=fav_sites.split('\n').length;
            csa.style.backgroundColor=scheme_global['pink'];
            csa.classList.remove('span_box');
            csa.removeAttribute('onclick');
        }
        if (typeof csid == 'string'){
            delete_open_php_rlater_b(oa.href,csid);
        }
    }
}

function delete_open_php_rlater_b(cshref,csid){
    var php_href=klwebphp_path_b( 'readlater_delete.php?key='+encodeURIComponent(cshref));
    if (is_delete_to_iframe_global){
        var odiv=document.getElementById('div_search_links');
        if (!odiv){
            console.log('未发现 div_search_links，未删除',cshref);
            return;
        }
        var oiframe=odiv.querySelector('iframe#iframe_delete_record_rlater');
        if (!oiframe){
            odiv.insertAdjacentHTML('beforeend','<iframe id="iframe_delete_record_rlater" style="width:100%;height:16rem;" src=""></iframe>');
        }
        var oiframe=odiv.querySelector('iframe#iframe_delete_record_rlater');
        if (!oiframe){
            console.log('未发现 iframe，未删除',cshref);
            return;
        }
        oiframe.setAttribute('src',php_href);
    }
    else {
        var new_window=window.open(php_href,'readlater_delete','width=600,height=600');
        new_window.blur();
    }
    remove_from_array_rlater_b(csid);
}

function remove_from_array_rlater_b(csid){
    if (typeof readlater_data_global =='undefined'){return;}
    
    var oa=document.querySelector('a#'+csid);
    if (!oa){return;}
    var blhref=oa.href;
    var blid=parseInt(oa.getAttribute('id').split('_').slice(-1)[0]);
    for (let blxl=0;blxl<readlater_data_global.length;blxl++){
        var item=readlater_data_global[blxl];
        if (item[0]==oa.href && item[3]==blid){
            readlater_data_global.splice(blxl,1);
            break;
        }
    }
}
