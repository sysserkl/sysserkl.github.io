function fav_add_rlater_b(csid,csa,prefix='readlater',addtag=false){
    var cscaption='移动';
    var local_id='fav_sites_rlater';
    
    var oa=document.querySelector('a#'+csid);
    if (!oa){return;}
    
    var bltag='';
    if (addtag){
        bltag=(prompt('输入 tag 并'+cscaption+'到收藏夹(不输入则取消收藏): \n'+specialstr_html_b(oa.href)+'\n'+specialstr_html_b(oa.innerText)) || '');
        bltag=bltag.replace(/\r\n/g,' ');
        bltag=bltag.replace(/\n/g,' ');
        if (bltag==''){return;}
    }
    
    if (addtag==true || confirm('是否'+cscaption+'到收藏夹：\n'+specialstr_html_b(oa.href)+'\n'+specialstr_html_b(oa.innerText)+'？')){
        var fav_sites=local_storage_get_b(local_id,-1,false)+'\n';
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
            localStorage.setItem(local_id,fav_sites);
            csa.innerHTML=fav_sites.split('\n').length;
            csa.style.backgroundColor=scheme_global['pink'];
            csa.classList.remove('span_box');
            csa.removeAttribute('onclick');
        }
        
        delete_open_php_rlater_b(oa.href,csid,prefix);
    }
}

function delete_open_php_rlater_b(cshref,csid,prefix='readlater'){
    if (is_http_file_global){
        var php_href=klwebphp_path_b('txt_row_delete.php?key='+encodeURIComponent(cshref)+'&prefix='+encodeURIComponent(prefix));
        if (is_delete_to_iframe_global){
            var odiv=document.getElementById('div_search_links');
            if (!odiv){
                console.log('未发现 div_search_links，未删除',cshref);
                return;
            }
            var oiframe=document.getElementById('iframe_delete_record_rlater');
            if (!oiframe){
                odiv.insertAdjacentHTML('afterend','<iframe id="iframe_delete_record_rlater" style="margin:0.5rem;width:90%;height:16rem;" src=""></iframe>');
            }
            var oiframe=document.getElementById('iframe_delete_record_rlater');
            if (!oiframe){
                console.log('未发现 iframe，未删除',cshref);
                return;
            }
            oiframe.setAttribute('src',php_href);
        } else {
            var new_window=window.open(php_href,'readlater_delete','width=600,height=600');
            new_window.blur();
        }
        remove_from_array_rlater_b(csid,prefix);
    } else {
        if (readlater_marked_rows_global.length>=5000){
            alert('已标记达5000条，操作取消');
        } else {
            if (!readlater_marked_rows_global.includes(cshref)){
                readlater_marked_rows_global.push(cshref);
                localStorage.setItem('readlater_marked_rows',readlater_marked_rows_global.join('\n'));
            }
        }
    }
}

function marked_rows_get_rlater_b(){
    readlater_marked_rows_global=local_storage_get_b('readlater_marked_rows',-1,true);
}

function remove_from_array_rlater_b(csid,prefix){
    var id_dict={'readlater':3,'selenium_enwords':4};
    if (id_dict[prefix]==undefined){
        console.log('未发现 prefix 对应 id');
        return;
    }
    
    if (eval('typeof '+prefix+'_data_global') =='undefined'){
        console.log('未发现：',prefix+'_data_global');
        return;
    }
    
    var oa=document.querySelector('a#'+csid);
    if (!oa){return;}
    var blhref=oa.href;
    var blid=parseInt(oa.getAttribute('id').split('_').slice(-1)[0]);
    
    var csarray=eval(prefix+'_data_global');
    for (let blxl=0;blxl<csarray.length;blxl++){
        var item=csarray[blxl];
        if (item[0]==oa.href && item[id_dict[prefix]]==blid){
            csarray.splice(blxl,1);
            years_rlater_b(csarray.length,false,true);
            break;
        }
    }
    //---
    if (prefix=='selenium_enwords'){
        if (eval('typeof '+prefix+'_current_global') =='undefined'){
            console.log('未发现：',prefix+'_current_global');
            return;
        }    

        var blid=' id="'+csid+'" ';
        var csarray=eval(prefix+'_current_global');
        for (let blxl=0;blxl<csarray.length;blxl++){
            var item=csarray[blxl][0];
            if (item.includes(blid)){
                csarray.splice(blxl,1);
                break;
            }
        }
    }
}

function import_data_rlater_b(csarray,load_fn_name,cshref=false){
    var today=file_date_parameter_b();
    if (cshref===false){
        cshref=new URL('./',location.href)['href'];
        cshref=cshref+'data/php_writable/';
    }
    
    for (let item of csarray){
        document.write('\n<script src="'+cshref+item+'.js'+today+'"><\/script>\n');
        document.write('<script>\n');
        document.write(load_fn_name+'("'+item+'");\n');
        document.write('<\/SCRIPT>\n');
        console.log(cshref+item+'.js'+today);
    }
}

function clear_cached_deleted_rows_rlater_b(local_id){
    var blstr=local_storage_get_b(local_id,-1,false).trim();    //第一行为日期 - 保留注释
    if (blstr==''){
        alert('最近删除记录为空');
        return;
    }
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空'+(blstr.split('\n').length-2)+'条记录') || '').trim()==rndstr){
        localStorage.setItem(local_id,'');
        var blstr=local_storage_get_b(local_id,-1,false).trim();    //第一行为日期 - 保留注释
        if (blstr==''){
            alert('最近删除记录为空');
        } else {
            alert('现有最近删除记录'+(blstr.split('\n').length-2)+'条');
        }
    }
}

function selenium_search_str_rlater_b(cstitle){
    var selestr=cstitle.replace(/[—：\-_<>'"]/g,' ');
    var sele_list=selestr.trim().split(' ');
    if (sele_list.length>1){
        selestr='';
        for (let blxl=0;blxl<3;blxl++){
            selestr=selestr+sele_list[blxl]+' ';
            if (selestr.length>5){break;}
        }
    }
    selestr=encodeURIComponent('+'+selestr.trim().replace(new RegExp(' ','g'),' +'));
    return selestr;
}

function manage_item_rlater_b(csid,cstype='copy text'){
    var oa=document.getElementById(csid);
    if (!oa){
        close_popup_rlater_b();
        return;
    }
    var otextarea=document.getElementById('textarea_for_copy');
    if (!otextarea){
        close_popup_rlater_b();
        return;
    }
    
    switch (cstype){
        case 'copy text':
            otextarea.value=oa.innerText;
            break;
        case 'copy url':
            otextarea.value=oa.href;
            break;
        case 'copy wiki':
            var blstr=oa.innerText;            
            if (blstr.match(/^\d{3}\s\|\s/)==null){
                blstr=date2str_b('')+' | '+blstr;
            }
            if (blstr.includes('[') || blstr.includes(']')){
                blstr='<nowiki>'+blstr+'</nowiki>';
            }
            otextarea.value='=== ['+oa.href+' '+blstr+'] ===';
            break;
        case 'selenium':
            var selestr=selenium_search_str_rlater_b(oa.innerText);
            window.open('klbase_html_jump.htm?selenium_news_search.php?search='+selestr);
            break;
        case 'edit title':
            var new_title=(prompt('输入新标题',oa.innerText) || '').trim();
            if (new_title!=='' && new_title!==oa.innerText){
                oa.innerText=new_title;
            }
            break;
        case 'edit link':
            var new_href=(prompt('输入新链接',oa.href) || '').trim();
            if (new_href!=='' && new_href!==oa.href){
                oa.href=new_href;
            }        
            break;
    }
    
    if (cstype.substring(0,5)=='copy '){
        otextarea.style.display='';
        otextarea.select();
        document.execCommand('copy');
        otextarea.style.display='none';
    }
    close_popup_rlater_b();
}

function close_popup_rlater_b(){
    document.getElementById('div_confirm_delete_one_record_rlater').style.display='none';
}

function qr_rlater_b(csid){
    var oa=document.getElementById(csid);
    if (!oa){return;}
    
    var odiv=document.getElementById('div_confirm_delete_one_record_rlater');
    if (!odiv){return;}

    var oiframe=odiv.querySelector('.iframe_qr_rlater');
    if (oiframe){return;}
    
    if (!oiframe){
        odiv.insertAdjacentHTML('beforeend','<iframe class="iframe_qr_rlater" style="width:10rem;height:10rem;border:0;overflow:hidden;" scrolling="no"></iframe>');
    }
    oiframe=odiv.querySelector('.iframe_qr_rlater');
    if (!oiframe){return;}
    oiframe.src=klbase_sele_path_b()[1]+'/html/qrcode.htm?s='+encodeURIComponent(oa.href)+'&simple&iframe&size=516';
}

function title_key_rlater_b(csstr){
    var result_t=[];
    for (let key in klwiki_page_position_global){
        for (let item of klwiki_page_position_global[key]){
            if (csstr.includes(item)){
                result_t.push([item,key]);
            }
        }
    }

    //result_t 每个元素形如：[ "Cats (1998)", "klwiki04" ] - 保留注释
    result_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    //var is_file=is_file_type_b();
    for (let blxl=0;blxl<result_t.length;blxl++){
        var blstr='';
        blstr=blstr+'<span class="span_box" onclick="open_wkp(this,\''+result_t[blxl][1]+'\',\'wiki\');close_popup_rlater_b();">'+result_t[blxl][0]+'</span>';
        result_t[blxl]=blstr;
    }
    return result_t;
}

function delete_one_rlater_b(event=false,csid='',is_yes=false,button_id='',prgname='readlater'){
    var oa=document.getElementById(csid);
    if (!oa){return;}
    if (is_yes===false){
        var blstr=oa.innerText;
        var more_links=blstr.match(/\bhttps?:\/\/[^\s]+/g) || [];
        var bljg='<p>'+specialstr_html_b(blstr).substring(0,50)+(blstr.length>50?'...':'')+'</p>';
        bljg=bljg+'<p>'+specialstr_html_b(oa.href).substring(0,50)+(oa.href.length>50?'...':'');
        bljg=bljg+' <span class="oblong_box" onclick="qr_rlater_b(\''+csid+'\');">qr</span></p>';
        if (more_links.length>0){
            bljg=bljg+'<p>';
            for (let item of more_links){
                bljg=bljg+'<a href="'+item+'" target=_blank>'+item+'</a> ';
            }
            bljg=bljg+'</p>';
        }
        var wikilink=title_key_rlater_b(blstr);
        if (wikilink.length>0){
            bljg=bljg+'<p>klwiki: '+wikilink.join(' ')+'</p>';
        }
        bljg=bljg+'<p style="line-height:1.8rem;margin-top:0.5rem;">';
        bljg=bljg+'<span class="oblong_box" style="margin-right:1rem;" onclick="delete_one_rlater_b(false,\''+csid+'\',true,\''+button_id+'\',\''+prgname+'\');close_popup_rlater_b();"><b>删除</b></span> ';      
        bljg=bljg+'修改：<span class="oblong_box" onclick="manage_item_rlater_b(\''+csid+'\',\'edit title\');">标题</span> ';          
        bljg=bljg+'<span class="oblong_box" onclick="manage_item_rlater_b(\''+csid+'\',\'edit link\');">链接</span> ';          

        bljg=bljg+'复制：<span class="oblong_box" onclick="manage_item_rlater_b(\''+csid+'\');">标题</span> ';
        bljg=bljg+'<span class="oblong_box" onclick="manage_item_rlater_b(\''+csid+'\',\'copy url\');">链接</span> ';
        bljg=bljg+'<span class="oblong_box" onclick="manage_item_rlater_b(\''+csid+'\',\'copy wiki\');">WIKI</span> ';
        
        bljg=bljg+'<span class="oblong_box" onclick="manage_item_rlater_b(\''+csid+'\',\'selenium\');" title="Selenium">S</span> ';
        bljg=bljg+'<span class="span_box" onclick="close_popup_rlater_b();">❌</span></p>';
        popup_event_div_b(event,'div_confirm_delete_one_record_rlater',bljg,'');
        mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_confirm_delete_one_record_rlater span.oblong_box'));
    }

    // || confirm("是否删除：\n"+specialstr_html_b(oa.href)+'\n'+specialstr_html_b(oa.innerText)+"？")){ - 此行保留    
    if (is_yes){
        delete_open_php_rlater_b(oa.href,csid,prgname);
        oa.style.textDecoration='line-through';
        if (button_id!==''){
            var ospan=document.getElementById(button_id);
            if (ospan){
                ospan.style.backgroundColor=scheme_global['pink'];
            }
        }
    }
}

function years_rlater_b(all_len,current_len=false,update_left_part=false){
    var blstr=all_len+'条 40条/天 '+(all_len/40/365).toFixed(3)+'年';
    if (update_left_part){
        var ospan=document.getElementById('span_todolist_rlater');
        if (ospan){
            ospan.innerText=blstr;
        }
        return;
    }
    return '<p>ToDoList: <span id="span_todolist_rlater">'+blstr+'</span>'+(current_len===false?'':'。当前结果：'+current_len+' 条')+'</p><div id="div_info"></div>';
}

function one_link_gerenrate_rlater_b(idno,cslink,cstitle,csstrong=false,prgname='readlater',other_str='',with_li=true){    
    var bljg='';
    if (with_li){
        bljg=bljg+'<li>';
    }
    bljg=bljg+'<a class="a_rlater_link" id="a_rlater_link_'+idno+'" href="'+cslink+'" target=_blank onmousedown="this.style.backgroundColor=\''+scheme_global['pink']+'\';">'; //替代 onclick, ondragstart，支持鼠标右键 - 保留注释

    if (readlater_marked_rows_global.includes(cslink)){
        bljg=bljg+'<span style="background-color:'+scheme_global['shadow']+'; border-radius: 0.5rem;">'+cstitle+'</span>';
    } else if (csstrong){
        bljg=bljg+'<font color=red><strong>'+cstitle+'</strong></font>';
    } else {
        bljg=bljg+cstitle;
    }
    bljg=bljg+'</a>';
    
    //if (is_http_file_global){
        bljg=bljg+' <span class="span_box span_rlater_button" id="span_rlater_button_'+idno+'" onclick="delete_one_rlater_b(event,\'a_rlater_link_'+idno+'\',false,this.id,\''+prgname+'\');" style="font-size:0.8rem;">☒</span>';
        bljg=bljg+' <span class="span_box" onclick="fav_add_rlater_b(\'a_rlater_link_'+idno+'\',this,\''+prgname+'\');" style="font-size:0.8rem;">⚪</span>';
        bljg=bljg+' <span class="span_box" onclick="fav_add_rlater_b(\'a_rlater_link_'+idno+'\',this,\''+prgname+'\',true);" style="font-size:0.8rem;">🏷</span>';
    //}

    bljg=bljg+other_str;
    if (with_li){
        bljg=bljg+'</li>';
    }
    bljg=bljg+'\n';
    
    return bljg;
}
