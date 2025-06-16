function recent_search_klsearch(csstr=''){
    recent_search_b('recent_search_klsearch',csstr,'search_add_key_klsearch','div_recent_search',[],35);
}

function search_add_key_klsearch(csstr){
    document.getElementById('input_searchtxt').value=csstr;
}

function show_sites_klsearch(){
    var sites_rows={};
    var blhero=local_storage_get_b('herokuapp_host').trim();
    for (let blxl=0,lent=search_sites_list_global.length;blxl<lent;blxl++){
        var item=search_sites_list_global[blxl];
        if (item.length!==8){
            console.log('不合规行：',item);
            continue;
        }
        if (sites_rows[item[6]]==undefined){
            sites_rows[item[6]]=[];
        }
        var one_site='<span class="'+(item[5].includes('b')?'oblong_box':'span_link')+'" onclick="search_site_klsearch('+blxl+');" title="'+item[7]+'">';
        if (item[3]==''){
            one_site=one_site+item[4];
        } else {
            one_site=one_site+'<span style="font-weight:bold;color:'+item[3]+';">'+item[4].substring(0,1)+'</span>';
            one_site=one_site+item[4].substring(1,);
        }
        one_site=one_site+'</span>';

        if (blhero!=='' && item[5].includes('p')){
            one_site=one_site+'<span class="span_link" onclick="search_site_klsearch('+blxl+',true);">(p)</span>';
        }
        sites_rows[item[6]].push(one_site);
    }
    
    var bljg='';
    for (let blkey in sites_rows){
        bljg=bljg+'<p>';
        bljg=bljg+'<span class="span_link" style="background-color:khaki;" onclick="batch_open_sites_klsearch(\''+blkey+'\');"><b>'+blkey+'</b></span> ';
        bljg=bljg+sites_rows[blkey].join(' ')+'</p>';
    }
    var odiv=document.getElementById('div_search');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function search_site_klsearch(csno,csproxy=false,cskey='',openwindow=-1,showhtml=true,csencode=false){
    if (csno<0 || csno>=search_sites_list_global.length){return '';}
    if (cskey==''){
        cskey=document.getElementById('input_searchtxt').value;
    }
    
    if (openwindow===-1){
        openwindow=document.getElementById('checkbox_openwindow').checked;
    }
    
    recent_search_klsearch(cskey);
    var item=[].concat(search_sites_list_global[csno]);
    
    //item 形如：[ "http://xxx/klsearch.htm?k=", "&t=batch_en_wiktionary&close=1" ] - 保留注释
    if (item[0].endsWith('klsearch.htm?k=') && (item[1].includes('&close=1') || item[1].includes('&iframe'))){  //klsearch.htm 不能在其前部添加/ - 保留注释
        var iframe_or_select='';
        var oselect=document.getElementById('select_iframe_or_close_klsearch');
        if (oselect){
            iframe_or_select=oselect.value;
        }
        if (iframe_or_select!==''){
            item[1]=item[1].replace(/&(close=1|iframe)\b/,'&'+iframe_or_select);
        }
    }
    
    if (item[2]==4){ 
        cskey=gbkcode(cskey);
    } else {
        cskey=web_href_key_b(cskey,item[2]);
    }
    
    if (csencode && !csproxy){
        cskey=encodeURIComponent(cskey);
    }
    //以下3行保留 - 保留注释
    //else if (item[csi][3]=="unicode"){
    //    window.open(blleft+escape(blstr)+blright);
    //}

    if (item[5].includes('n')){
        var blhref=item[0]+item[1];
    } else {
        if (item[5].includes('l')){
            var blhref=item[0]+cskey.toLowerCase()+item[1];
        } else {
            var blhref=item[0]+cskey+item[1];
        }
    }
    
    if (csproxy){
        var blhero=local_storage_get_b('herokuapp_host').trim();
        if (blhero!==''){
            blhref='https://'+blhero+'/get?url='+encodeURIComponent(blhref);
        }
    }
    blhref=href_replace_host_klsearch(blhref,item[6]);
    
    if (openwindow){
        window.open(blhref);
    }
    if (showhtml){
        document.getElementById('div_status').innerHTML='<a href="'+blhref+'" target=_blank>'+blhref+'</a>';
    }
    return blhref;
}

function batch_open_sites_klsearch(cscategory){
    function sub_batch_open_sites_klsearch_one_site(){
        if (blxl>=search_sites_list_global.length){return;}
        var item=search_sites_list_global[blxl];
        if (item[6]!==cscategory){
            blxl=blxl+1
            sub_batch_open_sites_klsearch_one_site();
        } else {
            search_site_klsearch(blxl,false,blkey);
            if (item[5].includes('p')){
                search_site_klsearch(blxl,true,blkey);
            }
            blxl=blxl+1
            setTimeout(sub_batch_open_sites_klsearch_one_site,2000);
        }
    }
    //-----------------------
    if (!confirm('是否批量搜索？')){return;}
    
    var blkey=document.getElementById('input_searchtxt').value;
    var blxl=0;
    sub_batch_open_sites_klsearch_one_site();
}

function batch_type_get_klsearch(cstype){
    switch (cstype){
        case 'batch_en':
            var cstype='dict.cn,youdao,iciba,merriam-webster,dictionary.com,wr_cn,TFD,longman,wordnik,AHD,learnersdictionary,lexico';
            //(is_local_b()?'KLWiki,':'') +'collins(p),wiktionary(p),' - 此两项保留 - 保留注释
            break;
        case 'batch_en+':
            var cstype='Bing(cn),Oxford,Cambridge';
            break;
        case 'batch_en_wiktionary':
            cstype='Wiktionary(Local),kaikki(Local),wordhippo,definitions';
            break;
    }
    
    if (cstype==''){return [];}
    
    cstype=cstype.toLowerCase().split(',');
    return cstype;
}

function iframe_current_button(event,obutton,csxl){
    var rect=obutton.getBoundingClientRect();
    var odiv=document.getElementById('div_new_window_iframe_klsearch');
    if (!odiv){
        odiv=document.createElement('div');
        odiv.setAttribute('id','div_new_window_iframe_klsearch');
        odiv.style.cssText='position:absolute;left:0px;top:0px;';
        odiv.innerHTML='<span class="oblong_box" onclick="copy_iframe_link_klsearch(true);">↪</span>';
        document.body.appendChild(odiv);
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    }

    if (!odiv){return;}
    var rect2=odiv.getBoundingClientRect();
    odiv.style.left=rect.left+'px';
    odiv.style.top=(rect.top-rect2.height)+'px';
}

function iframe_generate_klsearch(cstype='',cskey=false){
    cstype=batch_type_get_klsearch(cstype);
    if (cskey===false){
        cskey=document.getElementById('input_searchtxt').value.trim();
    }
    
    var oiframes=document.querySelectorAll('iframe.iframe_site_kl_b');
    for (let one_iframe of oiframes){
        one_iframe.outerHTML='';
    }
    
    var buttons_t=[];
    var result_t=[];
    var is_local_file=is_file_type_b();
    for (let one_type of cstype){
        var is_proxy=false;
        if (one_type.slice(-3,)=='(p)'){
            is_proxy=true;
            one_type=one_type.slice(0,-3);
        }
        
        for (let blxl=0,lent=search_sites_list_global.length;blxl<lent;blxl++){
            var item=search_sites_list_global[blxl];
            if (one_type==item[4].toLowerCase()){
                var blsrc=search_site_klsearch(blxl,is_proxy,cskey,false);
                if (is_local_file && blsrc.substring(0,4).toLowerCase()!=='http'){
                    if (blsrc.split('?')[0].slice(-4,).toLowerCase()=='.php'){continue;}
                }
                var list_t=iframe_generate_b(blxl,one_type,blsrc,'iframe_current_button');
                buttons_t.push(list_t[0]);
                result_t.push(list_t[1]);
                break;
            }
        }
    }
    var odiv=document.getElementById('div_status');
    odiv.innerHTML='<p id="p_buttons_kls">'+buttons_t.join(' ')+'</p>'+result_t.join('\n');
    input_size_b([['input_iframe_link_kls',6,0.5]],'id');
    //-----------------------
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'copy_iframe_link_klsearch();">copy</span>',
    '<span class="span_menu" onclick="'+str_t+'iframe_generate_klsearch(this.innerText);">batch_en</span>',
    '<span class="span_menu" onclick="'+str_t+'iframe_generate_klsearch(this.innerText);">batch_en+</span>',
    '<span class="span_menu" onclick="'+str_t+'iframe_generate_klsearch(this.innerText);">batch_en_wiktionary</span>',
    
    ];
    document.getElementById('p_buttons_kls').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🇬🇧','13rem','1rem','1rem','30rem'),'','0rem'));//+' <span class="aclick" onclick="copy_iframe_link_klsearch(true);">↪</span>');
    //-----------------------
    iframe_init_b();
    document.getElementById('checkbox_openwindow').parentNode.style.display='none';
    document.getElementById('div_recent_search').style.display='none';
    document.getElementById('div_search').style.display='none';
    document.title=cskey+' - KLSearch';
}

function args_klsearch(){
    var blkey='';
    var bltype='';
    var blcategory='';
    var blclose='1';
    var cskeys=href_split_b(location.href);
    var is_iframe=false;
    
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let item of cskeys){
            item=item.trim();
            if (item.substring(0,2)=='k='){
                blkey=item.substring(2,);
            } else if (item.substring(0,2)=='t='){
                bltype=item.substring(2,).toLowerCase();
            } else if (item.substring(0,2)=='c='){
                blcategory=item.substring(2,).toLowerCase();
            } else if (item.substring(0,6)=='close='){
                blclose=item.substring(6,).toLowerCase();
            } else if (item.substring(0,15)=='herokuapp_host='){
                localStorage.setItem('herokuapp_host',item.substring(15,))
            } else if (item=='iframe'){
                is_iframe=true;
            }            
        }
    }
    if (blkey==''){return;}
    document.getElementById('input_searchtxt').value=blkey;
    
    if (bltype==''){return;}
    
    if (is_iframe){ //只考虑 type 参数，忽略 category 等其他 - 保留注释
        iframe_generate_klsearch(bltype,blkey);
        return;
    }
    
    bltype=batch_type_get_klsearch(bltype);
    var links_t=[];
    for (let one_type of bltype){
        var is_proxy=false;        
        if (one_type.slice(-3,)=='(p)'){
            is_proxy=true;
            one_type=one_type.slice(0,-3);
        }
        
        for (let blxl=0,lent=search_sites_list_global.length;blxl<lent;blxl++){
            var item=search_sites_list_global[blxl];
            if (one_type==item[4].toLowerCase()){
                if (blcategory!=='' && blcategory!==item[6].toLowerCase()){continue;}
                var blhref=search_site_klsearch(blxl,is_proxy,blkey,false);
                links_t.push(blhref);
            }
        }
    }
    
    if (links_t.length==0){return;}
    
    for (let blxl=0,lent=links_t.length-1;blxl<lent;blxl++){
        window.open(links_t[blxl]);
    }
    
    if (blclose=='1'){
        setTimeout(function (){document.location=links_t[links_t.length-1];},2000);
    } else {
        window.open(links_t[links_t.length-1]);
    }
}

function copy_iframe_link_klsearch(is_open=false){
    var oiframe=document.querySelector('iframe.iframe_selected_iframe_kl_b');
    if (!oiframe){return;}
    if (is_open){
        window.open(oiframe.src);
    } else {
        copy_2_clipboard_b(oiframe.src);
    }
}

function init_klsearch(){
    var remote_address=local_storage_get_b('kl_remote_host',-1,false);
    var blhref=location.href;
    var basepath=klwebphp_path_b();
    if (basepath!==false){
        blhref=blhref.replace(basepath,remote_address+'/klwebphp/');
        var blat=blhref.lastIndexOf('/');
        if (blat>=0){
            blhref=blhref.substring(0,blat+1);
        }
        search_sites_list_global=search_sites_list_global.concat(search_sites_list_kl_global);  //合并 - 保留注释

        for (let blxl=0,lent=search_sites_list_global.length;blxl<lent;blxl++){
            var item=search_sites_list_global[blxl][0];
            if (item.substring(0,4)=='http'){continue;}
            search_sites_list_global[blxl][0]=blhref+search_sites_list_global[blxl][0];
        }
    }
    
    search_sites_list_kl_global=[];
    oa_batch_links_klsearch_global=false;
    current_no_oa_klsearch_global=0;
    input_with_x_b('input_searchtxt',18,'',0.8);
    document.getElementById('input_searchtxt').focus();
    args_klsearch();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    show_sites_klsearch();
    if (ismobile_b()==false){
        document.getElementById('div_search').style.columnCount=2;
    }
    menu_klsearch();
    recent_search_klsearch();
}

function local_or_remote_host_klsearch(ospan){
    var remote_address=local_storage_get_b('kl_remote_host',-1,false);
    if (ospan.innerText=='使用本地地址'){
        ospan.innerText='使用('+remote_address+')地址';
        user_remote_host_klsearch_global=false;
    } else {
        ospan.innerText='使用本地地址';
        user_remote_host_klsearch_global=true;
    }
}

function href_replace_host_klsearch(cshref,cstype){
    var remote_address=local_storage_get_b('kl_remote_host',-1,false)+'/';

    if (user_remote_host_klsearch_global===false){
        if (cshref.substring(0,remote_address.length)==remote_address){
            return '../../../../../'+cshref.substring(remote_address.length,);
        } else if (cstype=='Local' && cshref.substring(0,7)=='http://'){
            cshref=cshref.substring(7,);
            var blat=cshref.indexOf('/');
            if (blat>=0){
                return 'http://127.0.0.1/'+cshref.substring(blat+1,);
            }
        }        
    }
    return cshref;
}

function menu_klsearch(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'one_key_to_all_links_klsearch();">显示全部搜索链接</span>',
    '<span class="span_menu" onclick="'+str_t+'batch_keys_form_klsearch();">批量关键词</span>',
    '<span class="span_menu" onclick="'+str_t+'local_or_remote_host_klsearch(this);">使用('+local_storage_get_b('kl_remote_host',-1,false)+')地址</span>',
    '<span class="span_menu" onclick="'+str_t+'kl_remote_host_address_b();">远端地址设定</span>',
    ];
    
    var klmenu2=[
    '<span class="span_menu" onclick="'+str_t+'iframe_generate_klsearch();">batch en iframe 模式</span>',
    '<span class="span_menu">batch search type: <select id="select_iframe_or_close_klsearch"><option></option><option>iframe</option><option>close=1</option></select></span>',    
    '<span class="span_menu" onclick="'+str_t+'same_name_klsearch();">相同名称的搜索</span>',
    ];
    
    document.getElementById('div_title_klsearch').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','18rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','18rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function same_name_klsearch(){
    result_t={};
    for (let item of search_sites_list_global){
        if (result_t[item[4]]==undefined){
            result_t[item[4]]=[];
        }
        result_t[item[4]].push(item);
    }
    
    var bljg='';
    for (let key in result_t){
        if (result_t[key].length<=1){continue;}
        bljg=bljg+'<h4>'+key+'</h4>\n'+result_t[key].join('<br />\n');
    }
    if (bljg==''){
        bljg='无';
    }
    document.getElementById('div_status').innerHTML=bljg;
}

function one_key_to_all_links_klsearch(){
    var blkey=document.getElementById('input_searchtxt').value.trim();
    if (blkey==''){return;}
    var list_t=[];
    for (let blxl=0,lent=search_sites_list_global.length;blxl<lent;blxl++){
        var item=search_sites_list_global[blxl];
        list_t.push([item[4],search_site_klsearch(blxl,false,blkey,false,false)]);
        if (item[5].includes('p')){
            list_t.push([item[4]+'(p)',search_site_klsearch(blxl,true,blkey,false,false)]);
        }
    }
    var bljg='';
    bljg=bljg+'<table width=100%>';
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        bljg=bljg+'<tr><td>'+(blxl+1)+'</td><td>'+item[0]+' <a href="'+item[1]+'" target=_blank>'+item[1]+'</a></td>';
        bljg=bljg+'<td align=left><textarea style="height:1rem;" onclick="this.select();document.execCommand(\'copy\');">'+item[0]+'</textarea></td>';
        bljg=bljg+'<td align=left><textarea style="height:1rem;" onclick="this.select();document.execCommand(\'copy\');">'+item[1]+'</textarea></td>';
        bljg=bljg+'</tr>';
    }
    bljg=bljg+'</table>';
    document.getElementById('div_status').innerHTML=bljg;
}

function batch_keys_form_klsearch(){
    var bljg='<textarea id="textarea_batch_keys" style="height:20rem;"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+textarea_buttons_b('textarea_batch_keys','清空,全选,复制');
    bljg=bljg+'搜索引擎名称：<input type="text" id="input_search_type" /> ';
    bljg=bljg+'<select id="select_type_batch_keys"><option>链接</option><option>js</option><option>wiki</option></select> ';
    bljg=bljg+'<span class="aclick" onclick="batch_keys_links_klsearch();">生成</span> ';
    bljg=bljg+'<label><input type="checkbox" id="checkbox_key_name_klsearch" />关键字名称</label> ';
    bljg=bljg+'<label><input type="checkbox" id="checkbox_use_proxy_klsearch" />proxy</label> ';
    bljg=bljg+'<select id="select_links_range_klsearch" style="display:none;" onchange="current_no_oa_klsearch_global=Math.max(0,parseInt(this.value));"></select> ';
    bljg=bljg+'最大间隔秒数：<input type="number" id="input_max_seconds" min=0 step=1 value=10 /> ';    
    bljg=bljg+'<span class="aclick" onclick="batch_open_links_klsearch();">批量打开链接</span> ';        
    bljg=bljg+'<span id="span_batch_keys_count"></span> ';        
    bljg=bljg+'</p>';
    document.getElementById('div_status').innerHTML=bljg;
    input_with_x_b('input_search_type',8,'',0.8);
    input_size_b([['input_max_seconds',4]],'id');
}

function batch_open_links_klsearch(is_init=false){
    if (oa_batch_links_klsearch_global===false){
        oa_batch_links_klsearch_global=document.getElementsByClassName('batch_links_klsearch');
        current_no_oa_klsearch_global=0;
        document.getElementById('select_links_range_klsearch').value=0;
    }
    if (is_init){return;}
    if (oa_batch_links_klsearch_global[current_no_oa_klsearch_global]){
        window.open(oa_batch_links_klsearch_global[current_no_oa_klsearch_global].href);
    }
    document.getElementById('span_batch_keys_count').innerHTML=(1+current_no_oa_klsearch_global)+'/'+oa_batch_links_klsearch_global.length;
    current_no_oa_klsearch_global=current_no_oa_klsearch_global+1;
    if (current_no_oa_klsearch_global>=oa_batch_links_klsearch_global.length){
        oa_batch_links_klsearch_global=false;
        current_no_oa_klsearch_global=0;
        document.getElementById('select_links_range_klsearch').value=0;
    } else if (current_no_oa_klsearch_global % 10 == 0){
        document.getElementById('select_links_range_klsearch').value=current_no_oa_klsearch_global;
        return;
    } else {    
        var blmax=parseInt(document.getElementById('input_max_seconds').value);
        var blrand=randint_b(0,blmax*1000);
        setTimeout(batch_open_links_klsearch,blrand);
    }
}

function batch_keys_links_klsearch(){
    function batch_keys_links_klsearch_container(cslist){
        var ocontainer=document.getElementById('container_batch_links_klsearch');
        if (ocontainer){
            ocontainer.outerHTML='';
        }
        
        if (bltype=='链接'){
            document.getElementById('div_status').insertAdjacentHTML('beforeend','<ol id="container_batch_links_klsearch">'+bljg.join('\n')+'<ol>');
        } else {
            document.getElementById('div_status').insertAdjacentHTML('beforeend','<textarea id="container_batch_links_klsearch" style="height:20rem;">'+bljg.join('\n')+'</textarea>');        
        }
    }
    //-----------------------
    var list_t=document.getElementById('textarea_batch_keys').value.trim().split('\n');
    if (list_t.length==1 && list_t[0]==''){return;}
    
    var bltype=document.getElementById('input_search_type').value.trim();
    if (bltype==''){return;}
    
    var csno=-1;
    var csno2=-1;
    for (let blxl=0,lent=search_sites_list_global.length;blxl<lent;blxl++){
        var item=search_sites_list_global[blxl];
        if (item[4]==bltype){
            csno=blxl;
            break;
        }
        
        if (item[7].toLowerCase()==bltype.toLowerCase()){
            csno2=blxl;
        }
    }
    
    if (csno==-1){
        csno=csno2;
    }
    
    if (csno==-1){    
        alert('未找到对应搜索引擎');
        return;
    }
    
    var isproxy=document.getElementById('checkbox_use_proxy_klsearch').checked;
    var bltype=document.getElementById('select_type_batch_keys').value;
    
    var result_t=[];    
    var do_en=(bltype=='wiki');
    for (let one_key of list_t){
        one_key=one_key.trim();
        if (one_key==''){continue;}
        result_t.push([search_site_klsearch(csno,isproxy,one_key,false,false,do_en),one_key]);
    }
    
    var add_key=document.getElementById('checkbox_key_name_klsearch').checked;
    var bljg=[];
    switch (bltype){
        case '链接':
            for (let item of result_t){
                bljg.push('<li><a class="batch_links_klsearch" href="'+item[0]+'" target=_blank>'+(add_key?item[1]:item[0])+'</a></li>');
            }
            batch_keys_links_klsearch_container(bljg);
            
            batch_open_links_klsearch(true);
            
            var oselect=document.getElementById('select_links_range_klsearch');
            var batch_open_num=10;
            var bljg='';
            if (oa_batch_links_klsearch_global.length>batch_open_num){
                bljg=select_option_numbers_b(Math.min(100,oa_batch_links_klsearch_global.length),batch_open_num);
                oselect.style.display='';
            } else {
                oselect.style.display='none';
            }
            oselect.innerHTML=bljg;    
            break;
        case 'js':
            for (let item of result_t){
                bljg.push('["'+item[0]+'","'+(add_key?specialstr_j(item[1]):item[0])+'"],');
            }        
            batch_keys_links_klsearch_container(bljg);
            break;
        case 'wiki':
            if (add_key){
                for (let item of result_t){
                    if (item[1].includes('[') || item[1].includes(']')){
                        bljg.push('['+item[0]+' <nowiki>'+item[1]+'</nowiki>]');                    
                    } else {
                        bljg.push('['+item[0]+' '+item[1]+']');
                    }
                }
            } else {
                for (let item of result_t){
                    bljg.push('['+item[0]+' '+item[0]+']');
                }
            }
            batch_keys_links_klsearch_container(bljg);
            break;
    }
}
