function buttons_show_klsticker_m(){
    var ob1=document.getElementById('td_title_buttons');
    if (ob1.style.display=='none'){
        ob1.style.display='';
    } else {
        ob1.style.display='none';
    }
    var ob2=document.getElementById('div_content_buttons');
    if (ob2.style.display=='none'){
        ob2.style.display='';
    } else {
        ob2.style.display='none';
    }
}

function plain_text_klsticker_m(){
    if (confirm('是否转换为无格式文本？')){
        var odiv=document.getElementById('td_content');
        var old_html=odiv.innerHTML;
        var old_text=odiv.innerText.trim();
        if (old_html.trim().substring(0,1)!=='<'){
            odiv.innerHTML='<p>'+old_html;  //不能使用 <br /> - 保留注释
            console.log(1);
        }
        var blos=odiv.querySelectorAll('p, br, div, li');
        var bljg='';
        for (let one_obj of blos){
            if (one_obj.innerHTML==''){
                one_obj.outerHTML='';
            } else {
                one_obj.outerHTML='<p>'+one_obj.innerText+'</p>';
            }
        }
        if (odiv.innerText.trim()!==old_text){
            odiv.innerHTML=old_html;
            alert('未转换');
        }
    }
}

function remove_title_klsticker_m(){
    document.getElementById('td_title').style.display='none';
}

function article_padding_klsticker_m(csvalue=''){   //3rem - 保留注释
    var odiv=document.getElementById('table_article');
    var blpadding=odiv.style.padding;
    if (csvalue==''){
        csvalue=(prompt('输入新padding值',blpadding) || '').trim();
    }
    if (csvalue==''){return;}
    odiv.style.padding=csvalue;
}

function p_margin_klsticker_m(csvalue=''){
    if (csvalue==''){
        csvalue=(prompt('输入新margin值',p_margin_global) || '').trim();
    }
    if (csvalue==''){return;}
    csvalue=parseFloat(csvalue);
    if (csvalue<0){return;}
    p_margin_global=csvalue;    
    vertical_klsticker_m(false);
}

function vertical_klsticker_m(dochange=true){
    var otd_content=document.getElementById('td_content');

    var blclass=otd_content.getAttribute('class');
    
    var blos=otd_content.querySelectorAll('p, br, li, div');
    if (dochange==false){
        blclass=(blclass=='horizontal'?'vertical':'horizontal');
    }

    var otd_title=document.getElementById('td_title');
    
    while (true){
        var ospan=document.querySelector('span.span_line_sticker_m');
        if (ospan){
            ospan.outerHTML=ospan.innerHTML;
        } else {break;}
    }
    
    var otable=document.getElementById('table_article');
    if (blclass=='horizontal'){
        otd_content.setAttribute('class','vertical');
        for (let item of blos){
            item.style.margin='';
            item.style.marginTop='';
            item.style.marginBottom='';
            item.style.marginLeft=p_margin_global+'rem';
            item.style.marginRight='';
            if (show_underline_global){
                item.innerHTML='<span class="span_line_sticker_m" style="'+(underline_padding_global==''?'':'padding-left:'+underline_padding_global+'rem;')+'border-width:0 0 0 0.1rem; border-style:solid;">'+item.innerHTML+'</span>';
            }
        }
        otable.style.writingMode='vertical-rl';
        
        otd_title.style.borderBottom='';
        otd_title.style.paddingBottom='';     
        otd_title.style.marginBottom='';
        otd_title.style.borderLeft='0.1rem solid';
        otd_title.style.paddingLeft='0.5rem';
        otd_title.style.marginLeft='0.5rem'; 
        otd_title.style.textAlign='';
    } else {
        otd_content.setAttribute('class','horizontal');
        for (let item of blos){
            item.style.margin='';
            item.style.marginTop=p_margin_global+'rem';
            item.style.marginBottom='';
            item.style.marginLeft='';
            item.style.marginRight='';
            if (show_underline_global){
                item.innerHTML='<span class="span_line_sticker_m" style="'+(underline_padding_global==''?'':'padding-bottom:'+underline_padding_global+'rem;')+'border-width:0 0 0.1rem 0; border-style:solid;">'+item.innerHTML+'</span>';
            }
        }        
        otable.style.writingMode='';
        
        otd_title.style.borderBottom='0.1rem solid';
        otd_title.style.paddingBottom='0.5rem';
        otd_title.style.marginBottom='0.5rem';
        otd_title.style.borderLeft='';
        otd_title.style.paddingLeft='';       
        otd_title.style.marginLeft=''; 
        otd_title.style.textAlign='center';
    }
    otd_title.style.borderColor=current_scheme_sticker_m_global[0];
}

function color_font_select_klsticker_m(cstype){
    var list_t=['td_title','td_content','td_title_buttons','div_content_buttons','div_control_buttons'];
    var odiv=document.getElementById('div_'+cstype);
    if (odiv.style.display=='none'){
        odiv.style.display='';
        for (let item of list_t){
            document.getElementById(item).style.display='none';
        }
        if (cstype=='colors' && current_scheme_sticker_m_global[3]!==-1){
            var ocolors=odiv.querySelectorAll('div.div_color_box');
            for (let item of ocolors){
                var blid=item.getAttribute('id').split('_').slice(-1)[0];
                if (blid==current_scheme_sticker_m_global[3]){
                    item.style.borderColor='red';
                } else {
                    item.style.borderColor='white';
                }
            }
        } else if (cstype=='webfonts' && webfont_id_global!==''){
            var ocolors=odiv.querySelectorAll('img.img_webfont_box');
            for (let item of ocolors){
                var blid=item.getAttribute('src');
                if (blid.includes('_'+webfont_id_global+'.jpeg')){
                    item.style.borderColor='red';
                } else {
                    item.style.borderColor='grey';
                }
            }
        }        
    } else {
        odiv.style.display='none';
        for (let item of list_t){
            document.getElementById(item).style.display='';
        }        
    }
}

function color_box_klsticker_m(){
    var list_t=popular_colors_b();
    var div_list=[];
    div_list.push('<div class="div_color_box" id="div_color_box_null" onclick="color_font_select_klsticker_m(\'colors\');"><p style="color:black;background-color:white;padding:0.2rem;">0</p><p style="color:black;background-color:white;margin:0;padding:0.2rem;">取消</p></div>');
    
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl].split(',');
        if (item.length<3){continue;}
        div_list.push('<div class="div_color_box" id="div_color_box_'+blxl+'" onclick="change_scheme_klsticker_m(\''+(list_t[blxl]+','+blxl)+'\');color_font_select_klsticker_m(\'colors\');"><p style="color:'+item[0]+';background-color:'+item[1]+';padding:0.2rem;">'+(blxl+1)+'</p><p style="color:'+item[2]+';background-color:'+item[1]+';margin:0;padding:0.2rem;">正文</p></div>');
    }
    document.getElementById('div_colors').innerHTML=div_list.join('\n');
}

function webfont_box_klsticker_m(){
    var div_list=[];
    div_list.push('<div style="position:relative;float:left;border:0.1rem solid grey;margin:0.1rem;padding:0.2rem;color:black;background-color:white;cursor:pointer;" onclick="color_font_select_klsticker_m(\'webfonts\');">取消</div> ');

    for (let blxl=0,lent=webfont_global.length;blxl<lent;blxl++){
        var item=webfont_global[blxl];
        div_list.push('<img class="img_webfont_box" src="../jsdata/webfont/'+item.join('_')+'.jpeg" onclick="webfont_id_global=\''+item[2]+'\';webfont_set_klsticker_m();color_font_select_klsticker_m(\'webfonts\');" /> ');
    }
    document.getElementById('div_webfonts').innerHTML=div_list.join('\n');
}

function webfont_set_klsticker_m(){
    $youziku.load('#table_article', webfont_id_global,'');
    $youziku.draw(0);
    $youziku.submit('#table_article');
}

function change_scheme_klsticker_m(csstr){
    current_scheme_sticker_m_global=csstr.split(',');
    var odiv=document.getElementById('td_title');
    odiv.style.color=current_scheme_sticker_m_global[2];
    odiv.style.borderColor=current_scheme_sticker_m_global[0];
    
    document.getElementById('div_qr').style.color=current_scheme_sticker_m_global[0];
    document.getElementById('td_content').style.color=current_scheme_sticker_m_global[0];
    document.querySelector('body').style.backgroundColor=current_scheme_sticker_m_global[1];    
}

function font_size_klsticker_m(csid,csvalue=''){
    var blo=document.getElementById(csid);
    var blfont=parseFloat(blo.style.fontSize.split('rem')[0].trim());
    if (csvalue=='+'){
        blfont=blfont+0.1;
    } else if (csvalue=='-'){
        blfont=Math.max(0.1,blfont-0.1);
    } else {
        if (csvalue==''){
            csvalue=(prompt('输入字号值',blfont) || '').trim();
        }
        if (csvalue==''){return;}
        csvalue=parseFloat(csvalue);
        if (csvalue<0){return;}   
        blfont=csvalue; 
    }
    blo.style.fontSize=blfont+'rem';
}

function html_source_klsticker_m(ospan){
    var otd=document.getElementById('td_content');
    var blcaption=ospan.innerText;
    if (blcaption=='View Source'){
        otd.innerText=otd.innerHTML;
        ospan.innerText='Source2HTML';
    } else if (blcaption=='Source2HTML'){
        otd.innerHTML=otd.innerText;
        ospan.innerText='View Source';
    }
}

function td_center_klsticker_m(){
    var otd=document.getElementById('td_content');
    var blstatus=otd.getAttribute('valign');

    if (blstatus=='middle'){
        otd.setAttribute('align','');
        otd.setAttribute('valign','top');
    } else {
        otd.setAttribute('align','center');
        otd.setAttribute('valign','middle');
    }
}

function save_load_klsticker_m(cstype){
    if (cstype=='save' && confirm("是否保存？")){
        localStorage.setItem('klsticker_input_title',document.getElementById('td_title').innerText);
        localStorage.setItem('klsticker_textarea_full',document.getElementById('td_content').innerHTML);
        var odiv=document.getElementById('div_qr');
        var blstr=odiv.innerText.trim();
        if (blstr.substring(0,4).toLowerCase()=='http' || blstr==odiv.innerHTML.trim()){
            localStorage.setItem('klsticker_m_qr',blstr);
        }
    } else if (cstype=='load' && confirm("是否导入？")){
        document.getElementById('td_title').innerText=local_storage_get_b('klsticker_input_title');
        document.getElementById('td_content').innerHTML=local_storage_get_b('klsticker_textarea_full');
        document.getElementById('div_qr').innerText=local_storage_get_b('klsticker_m_qr');
        vertical_klsticker_m(false);
    }    
}

function clear_klsticker_m(){
    if (confirm("是否清空？")){
        document.getElementById('td_title').innerText='标题';    
        document.getElementById('td_content').innerHTML='正文';
        vertical_klsticker_m(false);
    }    
}

function close_klsticker_m(){
    if (confirm("是否关闭设置按钮？")){
        document.getElementById('td_title_buttons').style.display='none';
        document.getElementById('div_content_buttons').style.display='none';
        document.getElementById('div_control_buttons').style.display='none';
    }    
}

function buttons_style_klsticker_m(){
    var odivs=document.querySelectorAll('div.oblong_box');
    for (let item of odivs){
        item.style.marginBottom='0.2rem';
        item.style.paddingTop='0.1rem';
        item.style.paddingBottom='0.1rem';
        item.style.backgroundColor='white';
        item.style.opacity='0.9';
    }
}

function underline_padding_klsticker_m(){
    var blnew=prompt('输入新underline padding值',underline_padding_global);
    if (blnew==null){return;}
    underline_padding_global=blnew.trim();
    vertical_klsticker_m(false);
}

function underline_klsticker_m(){
    show_underline_global=!show_underline_global;
    vertical_klsticker_m(false);
}

function line_height_klsticker_m(csvalue=''){
    var odiv=document.getElementById('table_article');
    var bl_line_height=odiv.style.lineHeight.trim();
    if (csvalue==''){
        csvalue=(prompt('输入新line height值',bl_line_height) || '').trim();
    }
    if (csvalue==''){return;}
    odiv.style.lineHeight=csvalue;
}

function qr_generate_klsticker_m(){
    var odiv=document.getElementById('div_qr');
    odiv.style.cssText="width:120px;height:120px;padding:0.5rem;writing-mode:initial;border: 0.1rem solid "+current_scheme_sticker_m_global[0]+"; margin-top:"+p_margin_global+"rem;";
    var bltext=odiv.innerText.trim(); 
    odiv.innerHTML='';
    create_qr_b($('div#div_qr'),bltext,120,current_scheme_sticker_m_global[0],current_scheme_sticker_m_global[1],false);
}

function qr_remove_klsticker_m(){
    var odiv=document.getElementById('div_qr');
    odiv.style.cssText="";
    odiv.innerText=local_storage_get_b('klsticker_m_qr');
}

function qr_trigger_klsticker_m(odiv){
    var blstr=odiv.innerText;
    if (blstr=='add qr'){
        qr_generate_klsticker_m();
        odiv.innerText='remove qr';
    } else {
        qr_remove_klsticker_m();
        odiv.innerText='add qr';
    }
}
