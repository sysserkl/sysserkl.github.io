function recent_search_klsearch(csstr=''){
    recent_search_b('recent_search_klsearch',csstr,'search_add_key_klsearch','div_recent_search',[],35);
}

function search_add_key_klsearch(csstr){
    document.getElementById('input_searchtxt').value=csstr;
}

function show_sites_klsearch(){
    var sites_rows={};
    var blhero=local_storage_get_b('herokuapp_host').trim();
    for (let blxl=0;blxl<search_sites_list_global.length;blxl++){
        var item=search_sites_list_global[blxl];
        if (item.length!==8){
            console.log('不合规行：',item);
            continue;
        }
        if (sites_rows[item[6]]==null){
            sites_rows[item[6]]=[];
        }
        var one_site='<span class="'+(item[5].includes('b')?'oblong_box':'span_link')+'" onclick="javascript:search_site_klsearch('+blxl+');" title="'+item[7]+'">';
        if (item[3]==''){
            one_site=one_site+item[4];
        }
        else {
            one_site=one_site+'<span style="font-weight:bold;color:'+item[3]+';">'+item[4].substring(0,1)+'</span>';
            one_site=one_site+item[4].substring(1,);
        }
        one_site=one_site+'</span>';

        if (blhero!=='' && item[5].includes('p')){
            one_site=one_site+'<span class="span_link" onclick="javascript:search_site_klsearch('+blxl+',true);">(p)</span>';
        }
        sites_rows[item[6]].push(one_site);
    }
    
    var bljg='';
    for (let blkey in sites_rows){
        bljg=bljg+'<p>';
        bljg=bljg+'<span class="span_link" style="background-color:khaki;" onclick="javascript:batch_open_sites_klsearch(\''+blkey+'\');"><b>'+blkey+'</b></span> ';
        bljg=bljg+sites_rows[blkey].join(' ')+'</p>';
    }
    var odiv=document.getElementById('div_search');
    odiv.innerHTML=bljg;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
}

function search_site_klsearch(csno,csproxy=false,cskey='',openwindow=-1,showhtml=true){
    if (csno<0 || csno>=search_sites_list_global.length){return '';}
    if (cskey==''){
        cskey=document.getElementById('input_searchtxt').value;
    }
    
    if (openwindow===-1){
        openwindow=document.getElementById('checkbox_openwindow').checked;
    }
    
    recent_search_klsearch(cskey);
    var item=search_sites_list_global[csno];
    if (item[2]==4){ 
        cskey=gbkcode(cskey);
    }
    else {
        cskey=web_href_key_b(cskey,item[2]);
    }
    
    //以下3行保留 - 保留注释
    //else if (item[csi][3]=="unicode"){
    //    window.open(blleft+escape(blstr)+blright);
    //}

    if (item[5].includes('n')){
        var blhref=item[0]+item[1];
    }
    else {
        var blhref=item[0]+cskey+item[1];
    }
    if (csproxy){
        var blhero=local_storage_get_b('herokuapp_host').trim();
        if (blhero!==''){
            blhref='https://'+blhero+'/get?url='+encodeURIComponent(blhref);
        }
    }
    blhref=href_replace_host_klsearch(blhref);
    
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
        }
        else {
            search_site_klsearch(blxl,false,blkey);
            if (item[5].includes('p')){
                search_site_klsearch(blxl,true,blkey);
            }
            blxl=blxl+1
            setTimeout(sub_batch_open_sites_klsearch_one_site,2000);
        }
    }
    //--------------------------------
    if (!confirm("是否批量搜索？")){
        return;
    }
    var blkey=document.getElementById('input_searchtxt').value;
    var blxl=0;
    sub_batch_open_sites_klsearch_one_site();
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
            }
            else if (item.substring(0,2)=='t='){
                bltype=item.substring(2,).toLowerCase();
            }
            else if (item.substring(0,2)=='c='){
                blcategory=item.substring(2,).toLowerCase();
            }
            else if (item.substring(0,6)=='close='){
                blclose=item.substring(6,).toLowerCase();
            }
            else if (item.substring(0,15)=='herokuapp_host='){
                localStorage.setItem('herokuapp_host',item.substring(15,))
            }
            else if (item=='iframe'){
                is_iframe=true;
            }            
        }
    }
    if (blkey==''){return;}
    document.getElementById('input_searchtxt').value=blkey;
    
    if (bltype==''){return;}
    
    if (is_iframe){ //只考虑 type 参数，忽略 category 等其他 - 保留注释
        var xl_list=[];    
        var buttons_t=[];
        var result_t=[];
        bltype=bltype.split(',');   
        for (let one_type of bltype){
            var is_proxy=false;
            if (one_type.slice(-3,)=='(p)'){
                is_proxy=true;
                one_type=one_type.slice(0,-3);
            }
            for (let blxl=0;blxl<search_sites_list_global.length;blxl++){
                var item=search_sites_list_global[blxl];
                if (one_type==item[4].toLowerCase()){
                    xl_list.push(blxl);
                    buttons_t.push('<span class="aclick" onclick="javascript:show_iframe_klsearch('+blxl+');">'+one_type+'</span>');
                    result_t.push('<iframe class="iframe_site" id="iframe_site_'+blxl+'" style="width:95%;height:40rem;display:none;" src="'+search_site_klsearch(blxl,is_proxy,blkey,false)+'"></iframe>');
                    break;
                }
            }
        }
        var odiv=document.getElementById('div_status');
        odiv.innerHTML='<p>'+buttons_t.join(' ')+'</p>'+result_t.join('\n');
        if (xl_list.length>0){
            show_iframe_klsearch(xl_list[0]);
        }
        odiv.scrollIntoView();
    }
    else {
        var is_proxy=false;
        if (bltype.slice(-3,)=='(p)'){
            is_proxy=true;
            bltype=bltype.slice(0,-3);
        }    
        for (let blxl=0;blxl<search_sites_list_global.length;blxl++){
            var item=search_sites_list_global[blxl];
            if (bltype==item[4].toLowerCase()){
                if (blcategory!=='' && blcategory!==item[6].toLowerCase()){continue;}
                var blhref=search_site_klsearch(blxl,is_proxy,blkey,false);
                if (blclose=='1'){
                    document.location=blhref;
                }
                else {
                    window.open(blhref);
                }
            }
        }
    }
}

function show_iframe_klsearch(csno){
    var oiframe=document.getElementById('iframe_site_'+csno);
    if (!oiframe){return;}
    var oiframes=document.querySelectorAll('iframe.iframe_site');
    for (let one_iframe of oiframes){
        one_iframe.style.display='none';
    }
    oiframe.style.display='';
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
        search_sites_list_global=search_sites_list_global.concat(search_sites_list_kl_global);
        for (let blxl=0;blxl<search_sites_list_global.length;blxl++){
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
    }
    else {
        ospan.innerText='使用本地地址';
        user_remote_host_klsearch_global=true;
    }
}

function href_replace_host_klsearch(cshref){
    var remote_address=local_storage_get_b('kl_remote_host',-1,false)+'/';
    if (remote_address==''){return cshref;}
    if (user_remote_host_klsearch_global===false){
        if (cshref.substring(0,remote_address.length)==remote_address){
            return '../../../../../'+cshref.substring(remote_address.length,);
        }
    }
    return cshref;
}

function menu_klsearch(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'one_key_to_all_links_klsearch();">显示全部搜索链接</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'batch_keys_form_klsearch();">批量关键词</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'local_or_remote_host_klsearch(this);">使用本地地址</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'javascript:kl_remote_host_address_b();">远端地址设定</span>',
    ];
    
    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'same_name_klsearch();">相同名称的搜索</span>',
    ];
    
    document.getElementById('div_title_klsearch').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','12rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','12rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function same_name_klsearch(){
    result_t={};
    for (let item of search_sites_list_global){
        if (result_t[item[4]]==null){
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
    for (let blxl=0;blxl<search_sites_list_global.length;blxl++){
        var item=search_sites_list_global[blxl];
        list_t.push([item[4],search_site_klsearch(blxl,false,blkey,false,false)]);
        if (item[5].includes('p')){
            list_t.push([item[4]+'(p)',search_site_klsearch(blxl,true,blkey,false,false)]);
        }
    }
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<li>'+item[0]+' <a href="'+item[1]+'" target=_blank>'+item[1]+'</a></li>';
    }
    document.getElementById('div_status').innerHTML='<ol>'+bljg+'</ol>';
}

function batch_keys_form_klsearch(){
    var bljg='<textarea id="textarea_batch_keys" style="height:20rem;"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+textarea_buttons_b('textarea_batch_keys','清空,全选,复制');
    bljg=bljg+'搜索引擎名称：<input type="text" id="input_search_type" /> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:batch_keys_links_klsearch();">生成链接</span> ';
    bljg=bljg+'最大间隔秒数：<input type="number" id="input_max_seconds" min=0 step=1 value=10 /> ';    
    bljg=bljg+'<span class="aclick" onclick="javascript:batch_open_links_klsearch();">批量打开链接</span> ';        
    bljg=bljg+'<span id="span_batch_keys_count"></span> ';        
    bljg=bljg+'</p>';
    document.getElementById('div_status').innerHTML=bljg;
    input_with_x_b('input_search_type',8,'',0.8);
    input_size_b([['input_max_seconds',4]],'id');
}

function batch_open_links_klsearch(){
    if (oa_batch_links_klsearch_global===false){
        oa_batch_links_klsearch_global=document.getElementsByClassName('batch_links_klsearch');
        current_no_oa_klsearch_global=0;
    }
    window.open(oa_batch_links_klsearch_global[current_no_oa_klsearch_global].href);
    document.getElementById('span_batch_keys_count').innerHTML=(1+current_no_oa_klsearch_global)+'/'+oa_batch_links_klsearch_global.length;
    current_no_oa_klsearch_global=current_no_oa_klsearch_global+1;
    if (current_no_oa_klsearch_global>=oa_batch_links_klsearch_global.length){
        oa_batch_links_klsearch_global=false;
        current_no_oa_klsearch_global=0;
    }
    else {    
        var blmax=parseInt(document.getElementById('input_max_seconds').value);
        var blrand=randint_b(0,blmax*1000);
        setTimeout(batch_open_links_klsearch,blrand);
    }
}

function batch_keys_links_klsearch(){
    var bltype=document.getElementById('input_search_type').value.trim();
    if (bltype==''){return;}
    var csno=0;
    for (let blxl=0;blxl<search_sites_list_global.length;blxl++){
        var item=search_sites_list_global[blxl];
        if (item[4]==bltype){
            csno=blxl;
            break;
        }
    }
        
    var list_t=document.getElementById('textarea_batch_keys').value.trim().split('\n');
    if (list_t.length==1 && list_t[0]==''){return;}

    if (csno==0){
        alert('未找到对应搜索引擎');
        return;
    }
    
    var isproxy=search_sites_list_global[csno][5].includes('p');
    
    var result_t=[];    
    for (let one_key of list_t){
        one_key=one_key.trim();
        if (one_key==''){continue;}
            result_t.push(search_site_klsearch(csno,isproxy,one_key,false,false));
    }
    var bljg='';
    for (let item of result_t){
        bljg=bljg+'<li><a class="batch_links_klsearch" href="'+item+'" target=_blank>'+item+'</a></li>';
    }
    document.getElementById('div_status').insertAdjacentHTML('beforeend','<ol>'+bljg+'</ol>');
}
