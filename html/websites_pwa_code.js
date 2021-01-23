function menu_websites_pwa(){
    var str_t=klmenu_hide_b('#top');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'add_websites_pwa();">添加单个网址</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'form_websites_pwa();">导入/导出</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'organize_websites_pwa();">逐个整理</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'qr_html_websites_pwa();">QR</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'qr_html_websites_pwa(\'weixin.qq.com\');">QR微信公众号</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'weixin_select_pwa();">QR微信公众号_Select</span>',   
    ];

    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'clear_cache_websites_pwa();">更新版本</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'demo_websites_pwa();">导入Demo网址</span>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','14rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','14rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function demo_websites_pwa(){
    var websites_str=local_storage_get_b('websites_list_pwa',-1,false).trim();
    if (websites_str!==''){
        alert('现有网址不为空，取消导入');
        return;
    }
    if (confirm('是否导入Demo网址？')){
        localStorage.setItem('websites_list_pwa',websites_demo_global.trim());
        search_websites_pwa();
    }
}

function clear_cache_websites_pwa(){
    if (confirm('是否更新版本？')){
        document.getElementById('span_status').innerHTML='';
        service_worker_delete_b('pwa_websites_store\',\'websites_service_worker.js');
    }
}

function add_websites_pwa(){
    var websites_list=local_storage_get_b('websites_list_pwa',-1,true);
    var blexample=websites_list[0];
    if (blexample==''){
        blexample='新闻 https://www.thepaper.cn/ 澎湃';
    }
    
    var blcategory='';
    var blstr=(prompt('输入格式：分类 网址 名称',blexample) || '').trim();
    var blname='';
    [blcategory,blstr,blname]=split_websites_pwa(blstr);
    
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
    websites_list.push(blcategory+' '+blstr+' '+blname);
    localStorage.setItem('websites_list_pwa',websites_list.join('\n'));
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

function split_websites_pwa(csstr){
    var blat=csstr.indexOf('http');
    if (blat==-1){
        return ['','',''];
    }
    var blcategory=csstr.substring(0,blat).trim();
    if (blcategory==''){
        blcategory='未分类';
    }
    csstr=csstr.substring(blat,);
    blat=csstr.indexOf(' ');
    if (blat==-1){
        blat=csstr.lastIndexOf('/');
        if (blat==-1){
            return [blcategory,csstr,''];
        }
    }
    var blname=csstr.substring(blat,).trim();
    csstr=csstr.substring(0,blat).trim();
    return [blcategory,csstr,blname];
}

function form_websites_pwa(){
    var websites_list=local_storage_get_b('websites_list_pwa',-1,false);
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_websites_pwa" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_websites_pwa" id="textarea_websites_pwa" style="width:90%;height:24rem;">'+websites_list+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:search_websites_pwa();">关闭</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:update_websites_pwa();">更新</span> ';
    bljg=bljg+textarea_buttons_b('textarea_websites_pwa','清空,复制,发送到临时记事本,发送地址')+' 行数：'+websites_list.split('\n').length;

    bljg=bljg+'</p></form>';
    document.getElementById('divhtml').innerHTML=bljg;
}

function buttons_klwebsite_pwa(keyword=''){
    var bljg='<input type="text" id="input_search" style="width:10rem;" value="'+keyword+'" placeholder="搜索" onkeyup="javascript:if (event.key==\'Enter\'){search_websites_pwa(this.value);}" />';
    bljg=bljg+'<span id="span_recent_search"></span>';
    return bljg;
}

function update_websites_pwa(){
    if (confirm("是否更新网址库？")){
        var result_t=[];
        var list_t=document.getElementById('textarea_websites_pwa').value.trim().split('\n');
        for (let item of list_t){
            item=item.trim();
            if (item=='' || result_t.includes(item)){continue;}
            result_t.push(item);
        }
        result_t.sort(function (a,b){return zh_sort_b(a,b,false);});        
        localStorage.setItem('websites_list_pwa',result_t.join('\n'));
        search_websites_pwa();
    }
}

function search_websites_pwa(cskey=''){
    var websites_list=local_storage_get_b('websites_list_pwa',-1,true);
    
    cskey=cskey.trim();
    var list_t=[];
    if (cskey!==''){
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
            for (let item of websites_list){
                var blfound=str_reg_search_b(item,cskey,true);
                if (blfound==-1){
                    break;
                }
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
    var new_list=[];
    for (let item of websites_list){
        [blcategory,blstr,blname]=split_websites_pwa(item);
        if (blcategory=='' || blstr=='' || blname==''){continue;}
        list_t.push([blcategory,blstr,blname]);
        new_list.push(blcategory+' '+blstr+' '+blname);
    }
    list_t.sort(function (a,b){return zh_sort_b(a,b,false,2);});
    list_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    
    new_list=array_unique_b(new_list);
    new_list.sort(function (a,b){return zh_sort_b(a,b,false);});
    new_list=new_list.slice(-500,);
    if (cskey==''){
        localStorage.setItem('websites_list_pwa',new_list.join('\n'));
    }
    
    var result_t={}
    var blxl=0;
    for (let item of list_t){
        if ((item[0] in result_t)===false){
            result_t[item[0]]=[];
        }
        result_t[item[0]].push('<span class="span_websites_link_container"><a class="a_oblong_box" href="'+item[1].replace(new RegExp('"',"g"),'&quot;')+'" target=_blank>'+specialstr92_b(item[2])+'</a></span>');
        blxl=blxl+1;
    }
    var bljg='';
    for (let key in result_t){
        bljg=bljg+'<span style="font-weight:bold;font-size:1.2rem;">'+key+'</span> '+result_t[key].join(' ')+' ';
    }
    document.getElementById('divhtml').innerHTML='<p style="line-height:'+(ismobile_b()?'1.8':'2.2')+'rem;">'+buttons_klwebsite_pwa(cskey)+bljg+'</p>';
    input_with_x_b('input_search',8);
    recent_search_b('recent_search_websites_pwa',[cskey,date2str_b(),previous_day_b(),next_day_b()],'search_websites_pwa','span_recent_search',[],15,false);
    document.getElementById('span_count').innerText='('+new_list.length+')';
    top_bottom_arrow_b('div_top_bottom',blxl+' ');
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
    }
    else {
        for (let item of ospans){
            item.insertAdjacentHTML('beforeend',' <span class="span_box" onclick="javascript:delete_websites_pwa(this.parentNode);">☒</span>');
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
        var websites_list=local_storage_get_b('websites_list_pwa',-1,true);
        var list_t=[];
        for (let item of websites_list){
            if (item.includes(' '+oa.href+' ')){continue;}
            list_t.push(item);
        }
        localStorage.setItem('websites_list_pwa',list_t.join('\n'));
        ospan.parentNode.removeChild(ospan);
    }
}

function qr_html_websites_pwa(ahref=''){
    if (qr_html_websites_b('divhtml','a.a_oblong_box',ahref)){
        qr_generate_websites_pwa();
    }
    else {  //切换 - 保留注释
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
        }
        else {
            other_list.push(item.outerHTML);
        }
    }
    wx_list.sort();
    var blselect='<div id="div_canvas_qr_wx" style="width:'+canvas_size_websites_global*1.5+'px;height:'+canvas_size_websites_global*1.5+'px;padding:0.5rem;border:0.1rem black solid;"></div>';
    var bllen=wx_list.length;
    blselect=blselect+'<select id="select_canvas_qr_wx" style="margin-top:0.5rem;margin-bottom:0.5rem;height:2rem;" onchange="javascript:weixin_qr_pwa(this.value);">';
    for (let blxl=0;blxl<bllen;blxl++){
        let item=wx_list[blxl];
        blselect=blselect+'<option value="'+item[0]+'">'+(blxl+1)+'/'+bllen+'. '+item[1]+'</option>\n';
    }
    blselect=blselect+'</select> ';
    if (bllen>1){
        blselect=blselect+'<span class="aclick" onclick="javascript:weixin_prev_or_next_pwa(\'p\');">prev</span> <span class="aclick" onclick="javascript:weixin_prev_or_next_pwa(\'n\');">next</span>';
    }
    odiv.innerHTML=blselect+'<p>'+other_list.join(' ')+'</p>';
    var rect =document.getElementById('div_canvas_qr_wx').getBoundingClientRect();
    document.getElementById('select_canvas_qr_wx').style.width=rect.width+'px';
    weixin_qr_pwa(wx_list[0][0]);
}

function weixin_prev_or_next_pwa(cstype){
    var oselect=document.getElementById('select_canvas_qr_wx');
    if (oselect.selectedIndex>0 && cstype=='p'){
        oselect.selectedIndex--;
        weixin_qr_pwa(oselect.value);
    }
    else if (oselect.selectedIndex<oselect.length-1 && cstype=='n'){
        oselect.selectedIndex++;
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

function qr_generate_websites_pwa(){
    if (qr_generate_websites_b('div#divhtml canvas')===false){
        return;
    }
    setTimeout(qr_generate_websites_pwa,10);
}
