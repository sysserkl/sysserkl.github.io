function search_emoji(){
    var cskey=document.getElementById('input_emoji_search').value;
    var isreg=klmenu_check_b('span_reg_emoji',false);

    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    var bljg='';
    var blcount=0;
    for (let category in emoji_global){
        for (let key in emoji_global[category]){
            for (let item of emoji_global[category][key]){
                var blfound=str_reg_search_b(item,cskey,isreg);
                if (blfound==-1){break;}
                
                if (blfound){
                    bljg=bljg+'<p>'+img_name_generate_emoji(blcount+1,item)+'</p>';
                    blcount=blcount+1;
                    if (blcount>=20000){break;}
                }
            }
        }
    }
    document.getElementById('divhtml_category').innerHTML=bljg;
    document.getElementById('select_chapter').value='-1';
    document.getElementById('select_sub').innerHTML='';
}

function range_filter_emoji(cskey=false){
    if (cskey==false){
        cskey=document.getElementById('input_range_filter').value;
    }
    var isreg=klmenu_check_b('span_reg_emoji',false);
    if (cskey.slice(-4,)=='(:r)'){
        isreg=true;
        cskey=cskey.substring(0,cskey.length-4);
    }
    var objs=document.querySelectorAll('select#select_unicode option');
    if (obj_search_show_hide_b(objs,'',cskey,isreg)[0]==0 && cskey.length<=4){
        unicode_search_emoji(cskey);
    }
}

function main_options_emoji(){
    var bljg=['<option value=""></option>'];
    var category_list=Object.keys(emoji_global);
    for (let one_category of category_list){
        bljg.push('<option value="'+one_category+'">'+one_category+'</option>');
    }
    document.getElementById('select_chapter').innerHTML=bljg.join('\n');
    minor_options_emoji();
}

function minor_options_emoji(cscategory=''){
    if (cscategory==''){
        document.getElementById('divhtml_category').innerHTML='';
        return;
    }
    var key_list=Object.keys(emoji_global[cscategory]);

    var bljg=['<option value=""></option>'];
    for (let item of key_list){
        bljg.push('<option value="'+item+'">'+item+'</option>');
    }
    document.getElementById('select_sub').innerHTML=bljg.join('\n');
    one_chapter_emoji();
}

function one_chapter_emoji(sub_category=''){
    var main_category=document.getElementById('select_chapter').value;

    if (main_category==''){
        document.getElementById('divhtml_category').innerHTML='';
        document.getElementById('select_sub').innerHTML='';
        return;
    }
    
    if (sub_category==''){
        var list_t=[];
        for (let key in emoji_global[main_category]){
            list_t=list_t.concat(emoji_global[main_category][key]);
        }
    } else {
        var list_t=emoji_global[main_category][sub_category];
    }
    
    var bljg=[];
    var blno=1;
    for (let item of list_t){
        bljg.push('<p>'+img_name_generate_emoji(blno,item)+'</p>');
        blno=blno+1;
    }
    document.getElementById('divhtml_category').innerHTML=bljg.join('\n');
}

function img_name_generate_emoji(csno,item){
    return '<span class="span_no">'+csno+'. </span><span class="span_emoji_img" onclick="copy_or_not_symbols(this);">'+item[0]+'</span><span class="span_no"> => </span><span class="span_emoji_name">'+item[1]+'</span>';
}

function cursor_change_emoji(do_change=false,odoms=false){
    klmenu_check_b('span_enable_copy',do_change);
    var cursor_str=(klmenu_check_b('span_enable_copy',false)===true?'pointer':'');
    if (odoms===false){
        odoms=document.querySelectorAll('div.div_unicode,span.span_emoji_img');
    }
    for (let one_dom of odoms){
        one_dom.style.cursor=cursor_str;
    }
    console.log('操作了',odoms.length,'个对象');
}

function menu_emoji(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    //'<span id="span_reg_emoji" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 正则</span>',
    '<span class="span_menu" onclick="'+str_t+'unicode_overlape_search_emoji();">重叠码</span>',             
    '<span class="span_menu" onclick="'+str_t+'js_arr_generate_emoji();">获取当前emoji为js数组</span>',             
    ];
    
    var group_list=[
    ['⚪ 正则','klmenu_check_b(this.id,true);',true,'span_reg_emoji'],
    ['⚪ 点击即复制','cursor_change_emoji(true);',true,'span_enable_copy'],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var klmenu_link=[
    '<a href="https://www.unicode.org/emoji/charts/full-emoji-list.html" onclick="'+str_t+'" target=_blank>Full Emoji List</a>',    
    '<a href="https://www.unicodepedia.com/groups/" onclick="'+str_t+'" target=_blank>Unicodepedia</a>',    
    '<a href="https://emojipedia.org/" onclick="'+str_t+'" target=_blank>Emojipedia</a>',
    '<a href="https://symbl.cc/en/" onclick="'+str_t+'" target=_blank>SYMBL (◕‿◕)</a>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🎁️','15rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L️','11rem','1rem','1rem','60rem'),'','0rem')+' ');
    
    klmenu_check_b('span_reg_emoji',true);
}

function js_arr_generate_emoji(){
    var odiv=document.getElementById('divhtml_category');
    if (odiv.style.display=='none'){
        var odoms=document.querySelectorAll('#divhtml_range div.div_unicode');    
    } else {
        var odoms=odiv.querySelectorAll('span.span_emoji_img');
    }
    
    var result_t=[];
    for (let one_dom of odoms){
        result_t.push('\''+one_dom.textContent+'\'');
    }

    var left_str='<p>'+close_button_b('div_status_emoji','');
    left_str=left_str+'<span class="aclick" onclick="compare_arr_emoji();">比较</span>';
    var right_str='</p>';    
    var blstr=textarea_with_form_generate_b('textarea_content1_emoji','height:'+(ismobile_b()?'10':'20')+'rem;',left_str,'全选,清空,复制,发送到临时记事本,发送地址',right_str,'','',false,result_t.join(','));

    var ostatus=document.getElementById('div_status_emoji');
    ostatus.innerHTML=blstr+'<p><textarea id="textarea_content2_emoji"></textarea></p><div id="div_sub_js_arr_emoji"></div>';
    ostatus.scrollIntoView();
}

function compare_arr_emoji(){
    try {
        var js1=document.getElementById('textarea_content1_emoji').value.trim().match(/'.*?'/g) || [];
        var js2=document.getElementById('textarea_content2_emoji').value.trim().match(/'.*?'/g) || [];
        
        var used_set=new Set();
        var repeated=[];
        for (let item of js2){
            if (used_set.has(item)){
                repeated.push(item);
            }
            used_set.add(item);
        }
        var blunion=array_union_b(js1,js2);
        var blintersection=array_intersection_b(js1,js2);
        var diff1,diff2;
        [diff1,difff2]=array_difference_b(js1,js2,false,true);
        var odiv=document.getElementById('div_sub_js_arr_emoji');
        odiv.innerHTML='<h4>并集</h4><textarea>'+blunion+'</textarea>'+'<h4>交集</h4><textarea>'+blintersection+'</textarea>'+'<h4>差集（1含有2没有）</h4><textarea>'+diff1+'</textarea>'+'<h4>差集（2含有1没有）</h4><textarea>'+difff2+'</textarea>'+'<h4>重复</h4><textarea>'+repeated+'</textarea>';
    } catch (error){
        alert(error);
    }
}

function init_emoji(){
    var style_list=[
    '.divhtml {margin:0.5rem 1rem;}',
    '.divhtml p{font-size:2rem;}',
    '.span_no {font-size:1rem;color:gray;}',
    'div.div_unicode{position:relative;float:left;font-size:2rem;padding:0.2rem 0.6rem;margin:0.2rem;border-radius:1rem;}',
    'span.span_unicode{font-size:2rem;padding:0.2rem 0.6rem;margin:0.2rem;border-radius:1rem;}',
    ];
    if (ismobile_b(true)=='mobile'){
        style_list.push('td {font-size:1.5rem;}');
    }
    style_generate_b(style_list,true);

    show_emoji('category');
    var input_list=[
    ['input_emoji_search',15],
    ['input_range_filter',15],
    ];
    input_size_b(input_list,'name');
    menu_emoji();

    main_options_emoji();

    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let item of cskeys){
            var bltmpstr=item.trim();
            if (bltmpstr.substring(0,2)=='s='){
                document.getElementById('input_emoji_search').value=bltmpstr.substring(2);
                search_emoji();
                break;
            }
        }
    } else {
        search_emoji();
    }

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    
    var key_list=Object.keys(unicode_global);
    for (let blxl=0,lent=key_list.length;blxl<lent;blxl++){
        key_list[blxl]='<option>'+key_list[blxl]+'</option>';
    }
    key_list.sort();
    document.getElementById('select_unicode').innerHTML='<option></option>\n'+key_list.join('\n');
}

function unicode_search_emoji(csstr){
    var bljg='';
    var blno=1;
    var blvalue=csstr.codePointAt();    //不能使用 charCodeAt - 保留注释
    for (let key in unicode_global){
        var list_t=unicode_global[key];
        var blstart=eval('0x'+list_t[0]);
        var blend=eval('0x'+list_t[1])+1;
        for (let blxl=blstart;blxl<blend;blxl++){   //不包含 blend - 保留注释
            if (blxl==blvalue){
                bljg=key;
                blno=blxl-blstart+1;
                break;
            }
        }        
    }
    if (bljg!==''){
        range_filter_emoji('+'+bljg.replace(/\s/g,' +')+'(:r)');
        
        var blstart=1+(Math.ceil(blno/no_per_page_emoji_global)-1)*no_per_page_emoji_global;
        unicode_list_emoji(bljg,blstart);
    }
}

function show_emoji(cstype){
    var odivs=document.querySelectorAll('div.div_emoji, div.divhtml');
    for (let adiv of odivs){
        adiv.style.display='none';
    }
    
    var ospans=document.querySelectorAll('p#p_buttons_emoji span.aclick');
    for (let aspan of ospans){
        if (aspan.innerText==cstype){
            aspan.style.color=scheme_global['a-hover'];
            document.getElementById('div_'+cstype+'_emoji').style.display='';
            document.getElementById('divhtml_'+cstype).style.display='';            
        } else {
            aspan.style.color='';
        }
    }
    if (cstype=='range'){
        unicode_list_emoji();
    }
    
    //cursor_change_emoji(false);
}

function unicode_page_emoji(cscategory,cspages){
    var blno=page_location_b(cspages);
    if (blno!==false){
        unicode_list_emoji(cscategory,(blno-1)*no_per_page_emoji_global+1);
    }
}

function unicode_overlape_search_emoji(){
    function sub_unicode_overlape_search_emoji_push(csstr,cswidth){
        cswidth=Math.ceil(cswidth);
        if (result_t['w'+cswidth]==undefined){
            result_t['w'+cswidth]=[];
        }
        result_t['w'+cswidth].push(csstr);
    }
    
    function sub_unicode_overlape_search_emoji_one_key(){
        if (blxl>=bllen){
            var list_t=[];
            for (let key in result_t){
                list_t.push([parseInt(key.substring(1,)),result_t[key]]);
            }
            list_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
            
            var textarea_list=[];    
            var blcount=0;    
            for (let blno=0,lent=list_t.length;blno<lent;blno++){
                textarea_list=textarea_list.concat(list_t[blno][1]);    
                var blhead='<h3>'+list_t[blno][0]+'<small>('+(blcount+1)+'-'+(blcount+list_t[blno][1].length)+')</small></h3>';
                blcount=blcount+list_t[blno][1].length;
                list_t[blno]=blhead+array_2_li_b(list_t[blno][1]);
            }
            var blstr='<textarea onclick="this.select();document.execCommand(\'copy\');">var unicode_overlape_firefox_or_chrome=["'+textarea_list.join('","')+'",];\n</textarea>';
            odiv.innerHTML='<div style="column-count:'+(ismobile_b()?4:8)+';">'+list_t.join('\n')+'</div>'+blstr;
            ospan.innerText=textarea_list.length;
            return;
        }
        ospan.innerText=(blxl+1)+'/'+bllen+'. '+key_list[blxl];
        var list_t=unicode_global[key_list[blxl]];
        var blstart=eval('0x'+list_t[0]);
        var blend=eval('0x'+list_t[1])+1;    
        for (let blxl=blstart;blxl<blend;blxl++){
            var blstr='&#'+blxl+';'
            odiv.innerHTML='<span>'+blstr+'</span>';
            if (odiv.innerText.slice(-1)==';'){continue;}
            var rect2=odiv.querySelector('span').getBoundingClientRect();
            odiv.innerHTML='<span>美'+blstr+'</span>';
            var rect_combination=odiv.querySelector('span').getBoundingClientRect();      
            if (rect_combination.width<rect_normal.width+rect2.width){  //不考虑 rect2.width==0 的情况 - 保留注释
                sub_unicode_overlape_search_emoji_push(blstr,rect2.width);
            } else {
                odiv.innerHTML='<span>'+blstr+'美</span>';
                var rect_combination=odiv.querySelector('span').getBoundingClientRect();      
                if (rect_combination.width<rect_normal.width+rect2.width){  //不考虑 rect2.width==0 的情况 - 保留注释
                    sub_unicode_overlape_search_emoji_push(blstr,rect2.width);
                }
            }
        }
        blxl=blxl+1;
        setTimeout(sub_unicode_overlape_search_emoji_one_key,10);
    }
    //-----------------------
    if (confirm('是否扫描重叠码（略费时）？')==false){return;}    
    
    show_emoji('range');
    var ospan=document.getElementById('span_unicode_info');
    var odiv=document.getElementById('divhtml_range');
    odiv.innerHTML='<span>美</span>';
    var rect_normal=odiv.querySelector('span').getBoundingClientRect();
    var result_t={};
    var key_list=Object.keys(unicode_global);
    var bllen=key_list.length;
    blxl=0;
    sub_unicode_overlape_search_emoji_one_key();
}

function first_element_emoji(){
    var odiv=document.getElementById('divhtml_range');
    var result_t=[];
    var blstyle='border:0.1rem solid '+scheme_global['button']+';font-size:small;';
    
    for (let key in unicode_global){
        var list_t=unicode_global[key];
        var blstart=eval('0x'+list_t[0]);
        var blend=eval('0x'+list_t[1])+1;
        result_t.push('<span class="span_unicode" style="'+blstyle+'" onclick="unicode_list_emoji(\''+specialstr_j(key)+'\');">'+key+'</span> '+one_type_emoji(blstart,blend,odiv,1,'span').join(' '));
    }
    odiv.innerHTML='<p style="line-height:4rem;">'+result_t.join(' ')+'</p>';    
}

function unicode_list_emoji(cscategory=false,csstart=1){
    var oselect=document.getElementById('select_unicode');
    if (cscategory===false){
        cscategory=oselect.value;
    }
    
    if (cscategory==''){
        first_element_emoji();
        return;
    }
    oselect.value=cscategory;

    var list_t=unicode_global[cscategory];
    var blstart=eval('0x'+list_t[0]);
    var blend=eval('0x'+list_t[1])+1;

    document.getElementById('span_unicode_info').innerText=[list_t,blstart,eval('0x'+list_t[1]),eval('0x'+list_t[1])-blstart+1];  //此行保留 - 保留注释

    var pages=page_combination_b(blend-blstart,no_per_page_emoji_global,csstart,'unicode_list_emoji(\''+specialstr_j(cscategory)+'\',','unicode_page_emoji(\''+specialstr_j(cscategory)+'\',','word-break:break-all;word-wrap:break-word;',1,100,'','aclick',1,false)
    
    blstart=blstart+csstart-1;
    if (blstart+no_per_page_emoji_global<blend){
        blend=blstart+no_per_page_emoji_global;
    }

    var odiv=document.getElementById('divhtml_range');
    var result_t=one_type_emoji(blstart,blend,odiv);
    odiv.innerHTML='<p style="word-break:break-all;word-wrap:break-word;">'+pages+'</p>'+result_t.join(' ');
    cursor_change_emoji(false);
}

function one_type_emoji(csstart,csend,odiv,csmax=-1,tagname='div'){
    var result_t=[];
    var blstyle='border:0.1rem solid '+scheme_global['button']+';';
    
    var blcount=0;
    for (let blxl=csstart;blxl<csend;blxl++){   //不包含 blend - 保留注释
        var blstr='&#'+blxl+';' //也可以用：blstr=String.fromCodePoint(blxl); - 保留注释
        odiv.innerHTML=blstr;
        if (odiv.innerText.slice(-1)==';'){continue;}
        result_t.push('<'+tagname+' class="'+tagname+'_unicode" style="'+blstyle+'" onclick="unicode_info_emoji('+blxl+',this);">'+blstr+'</'+tagname+'>');
        blcount=blcount+1;
        if (csmax>0 && blcount>=csmax){break;}
    }
    return result_t;
}

function unicode_info_emoji(csxl,odom){
    var val16=csxl.toString(16);
    var blstr='<b>HTML Entity (decimal):</b> &amp;#'+csxl+'; <b>HTML Entity (hex):</b> &amp;#x'+val16+' ';
    blstr=blstr+'<b>Javascript:</b> \\u{'+val16+'} <b>Javascript (ASCII):</b> \\x'+val16;
    document.getElementById('span_unicode_info').innerHTML=blstr+'<span class="span_no"> => </span>'+'&#'+csxl;
    
    copy_or_not_symbols(odom);
}

function select_pre_next_emoji(cstype){
    var oselect=document.getElementById('select_unicode');
    if (select_prev_or_next_b(oselect,cstype,true)){
        unicode_list_emoji(oselect.value);
    }
}

function copy_or_not_symbols(odiv){
    if (klmenu_check_b('span_enable_copy',false)){
        copy_2_clipboard_b(odiv.innerText,true);
    }
}
