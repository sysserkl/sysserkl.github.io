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
    if (csno<0 || csno>=search_sites_list_global.length){
        return ['',[]];
    }
    
    if (cskey==''){
        cskey=document.getElementById('input_searchtxt').value;
    }
    var raw_key=cskey;
    
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

    var blhref=search_site_kls_b(item,cskey,csencode,csproxy);
    blhref=href_replace_host_klsearch(blhref,item[6]);

    var link_list=[];
    if (openwindow){
        window.open(blhref);
    } else {
        var batch_type=item[1].match(/&t=(batch_.*?)&/);    //形如：[ "&t=batch_offline&", "batch_offline" ] - 保留注释
        if (batch_type){
            link_list=types_2_list_kls_b(batch_type[1],raw_key,'',showhtml);
        }
    }

    if (showhtml){
        document.getElementById('div_status').innerHTML='<a href="'+blhref+'" target=_blank>'+blhref+'</a>'+(link_list.length>0?array_2_li_b(link_list):'');
    }
    return [blhref,link_list];
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

function iframe_generate_klsearch(cstype='',cskey=false,iframe_or_close=''){
    if (cskey===false){
        cskey=document.getElementById('input_searchtxt').value.trim();
    }
        
    if (iframe_or_close=='close=1'){
        window.open('?k='+encodeURIComponent(cskey)+'&t='+cstype+'&close=1');
        return;
    }
    
    cstype=batch_type_get_kls_b(cstype);
    
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
                var blsrc=search_site_klsearch(blxl,is_proxy,cskey,false)[0];
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
    ];
    
    for (let item of ['batch_en','batch_en+','batch_en_wiktionary','batch_dwdlw']){
        let group_list=[
        [item,'iframe_generate_klsearch(\''+item+'\');',true],
        ['🫧','iframe_generate_klsearch(\''+item+'\',false,\'close=1\');',true],
        ];    
        klmenu1.push(menu_container_b(str_t,group_list,''));
    }
    
    document.getElementById('p_buttons_kls').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🇬🇧','14rem','1rem','1rem','30rem'),'','0rem'));
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
    
    var links_t=types_2_list_kls_b(bltype,blkey,blcategory);
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
        search_sites_list_global.sort(function (a,b){return a[4].toLowerCase()>b[4].toLowerCase()?-1:1;});  //名称
        search_sites_list_global.sort(function (a,b){return a[6]<b[6]?-1:1;});  //分类
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
    '<span class="span_menu" onclick="'+str_t+'iframe_generate_klsearch();">iframe generate</span>',
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
        list_t.push([item[4],search_site_klsearch(blxl,false,blkey,false,false)[0]]);
        if (item[5].includes('p')){
            list_t.push([item[4]+'(p)',search_site_klsearch(blxl,true,blkey,false,false)[0]]);
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
    bljg=bljg+textarea_buttons_b('textarea_batch_keys','清空,全选,复制,导入temp_txt_share');
    bljg=bljg+'搜索引擎名称：<input type="text" id="input_search_type" /> ';
    bljg=bljg+'<select id="select_type_batch_keys"><option>链接</option><option>js</option><option>wiki</option></select> ';
    bljg=bljg+'<span class="aclick" onclick="batch_keys_links_klsearch();">生成</span> ';
    bljg=bljg+'<label><input type="checkbox" id="checkbox_key_name_klsearch" />链接只显示关键字名称</label> ';
    bljg=bljg+'<label><input type="checkbox" id="checkbox_use_proxy_klsearch" />proxy</label> ';
    bljg=bljg+'<span class="aclick" onclick="batch_ellipsis_2_full_klsearch();">EN缩写文件名转换为全名</span> ';        
    bljg=bljg+'<span class="aclick" onclick="batch_files_2_links_klsearch();">根据文件名生成链接</span> ';        
    
    bljg=bljg+'<select id="select_links_range_klsearch" style="display:none;" onchange="current_no_oa_klsearch_global=Math.max(0,parseInt(this.value));"></select> ';
    bljg=bljg+'最大间隔秒数：<input type="number" id="input_max_seconds" min=0 step=1 value=10 /> ';    
    bljg=bljg+'<span class="aclick" onclick="batch_open_links_klsearch();">批量打开链接</span> ';        
    bljg=bljg+'<span id="span_batch_keys_count"></span> ';        
    bljg=bljg+'</p>';
    bljg=bljg+'<div id="div_sub_status"></div>';
    document.getElementById('div_status').innerHTML=bljg;
    input_with_x_b('input_search_type',8,'',0.8);
    input_size_b([['input_max_seconds',4]],'id');
}

function batch_ellipsis_2_full_klsearch(){
    var otextarea=document.getElementById('textarea_batch_keys');
    var list_t=otextarea.value.trim().split('\n');
    var result_t=[];
    for (let afile of list_t){
        let finfo=file_path_name_b(afile);
        for (let arow of endict_ellipsis_global){
            if (finfo[1].startsWith(arow[1])){
                afile=finfo[0]+finfo[1].replace(arow[1],arow[0])+(finfo[2]==''?'':'.'+finfo[2]);
                break;
            }
        }
        result_t.push(afile);
    }    
    otextarea.value=result_t.join('\n');
}

function batch_files_2_links_klsearch(){
    function sub_batch_files_2_links_klsearch_result(cslist){
        //cslist 每个元素形如：[ "https://www.ahdictionary.com/word/search.html?q=culver", "culver" ] - 保留注释
        cslist=array_split_by_col_b(cslist,[0]);
        let result_t=[];
        for (let arow of cslist){
            let wname=windows_filename_b(arow,'',true);   //含路径替换 - 保留注释
            let blat=full_name_list.indexOf(wname);
            if (blat==-1){continue;}
            result_t.push([arow,blat]); //按照文件的顺序排序链接，便于比较 - 保留注释
        }
        result_t.sort(function (a,b){return a[1]<b[1]?-1:1;});
        var bljg=[];
        for (let item of result_t){
            bljg.push('<a class="a_batch_links_klsearch" href="'+item[0]+'" target=_blank>'+item[0]+'</a>');
        }
        list_2_links_container_klsearch(bljg,result_t,'链接');
    }
    
    var list_t=document.getElementById('textarea_batch_keys').value.trim().split('\n');
    var full_name_list=[];
    var words=new Set();
    for (let arow of list_t){
        let finfo=file_path_name_b(arow);
        if (finfo[2]=='txt'){
            arow=file_path_name_b(arow)[1];
        } else {
            arow=file_path_name_b(arow)[3];
        }
        full_name_list.push(arow);
        let blat=Math.max(arow.lastIndexOf('=',arow),arow.lastIndexOf('_',arow));
        if (blat>=0){
            words.add(arow.slice(blat+1,));
        }
    }
    batch_keys_links_klsearch(Array.from(words),'链接',false,sub_batch_files_2_links_klsearch_result);
}

function batch_open_links_klsearch(is_init=false){
    if (oa_batch_links_klsearch_global===false){
        oa_batch_links_klsearch_global=[];
        for (let one_a of document.querySelectorAll('a.a_batch_links_klsearch')){
            oa_batch_links_klsearch_global.push(one_a.href);
        }
        current_no_oa_klsearch_global=0;
        document.getElementById('select_links_range_klsearch').value=0;
    }
    
    if (is_init){return;}
    
    window.open(oa_batch_links_klsearch_global[current_no_oa_klsearch_global]);
    
    document.getElementById('span_batch_keys_count').innerHTML=(1+current_no_oa_klsearch_global)+'/'+oa_batch_links_klsearch_global.length;
    current_no_oa_klsearch_global=current_no_oa_klsearch_global+1;
    
    if (current_no_oa_klsearch_global>=oa_batch_links_klsearch_global.length){
        oa_batch_links_klsearch_global=false;
        current_no_oa_klsearch_global=0;
        document.getElementById('select_links_range_klsearch').value=0;
    } else if (current_no_oa_klsearch_global % 10 == 0){
        document.getElementById('select_links_range_klsearch').value=current_no_oa_klsearch_global;
    } else {    
        var blmax=parseInt(document.getElementById('input_max_seconds').value);
        var blrand=randint_b(0,blmax*1000);
        setTimeout(batch_open_links_klsearch,blrand);
    }
}

function batch_keys_no_get_klsearch(){
    var bltype=document.getElementById('input_search_type').value.trim();
    if (bltype==''){return -1;}
    
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
    return csno;
}

function list_2_links_container_klsearch(cslist,result_t,link_wiki_js){
    let textarea_str=textarea_with_form_generate_b('textarea_batch_links_result_klsearch','height:20rem;','<p>','复制,发送到临时记事本,发送地址','</p>');
    if (link_wiki_js=='链接'){
        let table_str='<table style="width:100%;"><tr><td valign=top width=50%>'+array_2_li_b(cslist)+'</td>';
        table_str=table_str+'<td valign=top width=50%>'+textarea_str+'</td></tr></table>';
        
        document.getElementById('div_sub_status').insertAdjacentHTML('beforeend',table_str);
        
        let alinks=array_split_by_col_b(result_t,[0]);
        document.getElementById('textarea_batch_links_result_klsearch').value=alinks.join('\n');
    } else {
        document.getElementById('div_sub_status').insertAdjacentHTML('beforeend',textarea_str);        
        document.getElementById('textarea_batch_links_result_klsearch').value=cslist.join('\n');  
    }
}

function batch_keys_links_klsearch(word_list=false,link_wiki_js=false,show_html=true,run_fn=false){
    function sub_batch_keys_links_klsearch_run(){
        if (typeof run_fn == 'function'){
            run_fn(result_t);
        }
    }
    
    function sub_batch_keys_links_klsearch_generate(){
        if (blxl>=bllen){
            if (show_html){
                sub_batch_keys_links_klsearch_select();
            }
            sub_batch_keys_links_klsearch_run();
            document.title=old_title;
            return;
        }
        
        let one_key=word_list[blxl].trim();
        if (one_key!==''){
            let bllink=search_site_klsearch(csno,isproxy,one_key,false,false,do_en);
            result_t.push([bllink[0],one_key]);
            
            for (let item of bllink[1]){
                result_t.push([item,one_key]);        
            }    
        }
        blxl=blxl+1;
        if (blxl % 100 == 0){
            document.title=blxl+'/'+bllen+' - '+old_title;
            setTimeout(sub_batch_keys_links_klsearch_generate,1);
        } else {
            sub_batch_keys_links_klsearch_generate();
        }
    }
    
    function sub_batch_keys_links_klsearch_select(){
        document.getElementById('div_sub_status').innerHTML='';
        let add_key=document.getElementById('checkbox_key_name_klsearch').checked;
        var bljg=[];

        switch (link_wiki_js){
            case '链接':
                for (let item of result_t){
                    bljg.push('<a class="a_batch_links_klsearch" href="'+item[0]+'" target=_blank>'+(add_key?item[1]:item[0])+'</a>');
                }
                list_2_links_container_klsearch(bljg,result_t,link_wiki_js);
                
                batch_open_links_klsearch(true);
                
                var oselect=document.getElementById('select_links_range_klsearch');
                var batch_open_num=10;
                var options='';
                if (oa_batch_links_klsearch_global.length>batch_open_num){
                    options=select_option_numbers_b(Math.min(100,oa_batch_links_klsearch_global.length),batch_open_num);
                    oselect.style.display='';
                } else {
                    oselect.style.display='none';
                }
                oselect.innerHTML=options;    
                break;
            case 'js':
                for (let item of result_t){
                    bljg.push('["'+item[0]+'","'+(add_key?specialstr_j(item[1]):item[0])+'"],');
                }        
                list_2_links_container_klsearch(bljg,result_t,link_wiki_js);
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
                list_2_links_container_klsearch(bljg,result_t,link_wiki_js);
                break;
        }
    }
    
    //-----------------------
    var result_t=[];    
    
    if (word_list===false){
        word_list=document.getElementById('textarea_batch_keys').value.trim().split('\n');
    }
    if (word_list.length==1 && word_list[0]==''){
        sub_batch_keys_links_klsearch_run();
        return;
    }
    
    var csno=batch_keys_no_get_klsearch();
    if (csno==-1){    
        alert('未找到对应搜索引擎');
        sub_batch_keys_links_klsearch_run();
        return;
    }

    var isproxy=document.getElementById('checkbox_use_proxy_klsearch').checked;
    if (link_wiki_js===false){
        link_wiki_js=document.getElementById('select_type_batch_keys').value;
    }
    var do_en=(link_wiki_js=='wiki');
    
    var blxl=0;
    var bllen=word_list.length;
    var old_title=document.title;
    sub_batch_keys_links_klsearch_generate();
}
