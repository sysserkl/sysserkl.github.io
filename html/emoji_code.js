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
                    bljg=bljg+'<p><span class="span_no">'+(blcount+1)+'. </span>'+item[0]+'<span class="span_no"> => </span>'+item[1]+'</p>';
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
    if (obj_search_show_hide_b(objs,'',cskey,isreg)==0 && cskey.length<=4){
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

    var bljg=[];
    for (let item of key_list){
        bljg.push('<option value="'+item+'">'+item+'</option>');
    }
    document.getElementById('select_sub').innerHTML=bljg.join('\n');
    if (key_list.length>0){
        document.getElementById('select_sub').value=key_list[0];
        one_chapter_emoji(key_list[0]);
    }
}

function one_chapter_emoji(sub_category=''){
    var main_category=document.getElementById('select_chapter').value;

    if (main_category=='' || sub_category==''){
        document.getElementById('divhtml_category').innerHTML='';
        document.getElementById('select_sub').innerHTML='';
        return;
    }
    
    var list_t=emoji_global[main_category][sub_category];
    
    var bljg=[];
    var blno=1;
    for (let item of list_t){
        bljg.push('<p><span class="span_no">'+blno+'. </span>'+item[0]+'<span class="span_no"> => </span>'+item[1]+'</p>');
        blno=blno+1;
    }
    document.getElementById('divhtml_category').innerHTML=bljg.join('\n');
}

function menu_emoji(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_reg_emoji" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 正则</span>',         
    '<span class="span_menu" onclick="'+str_t+'unicode_overlape_search_emoji();">重叠码</span>',             
    ];
    
    var klmenu_link=[
    '<a href="https://www.unicode.org/emoji/charts/full-emoji-list.html" onclick="'+str_t+'" target=_blank>Full Emoji List</a>',    
    '<a href="https://www.unicodepedia.com/groups/" onclick="'+str_t+'" target=_blank>Unicodepedia</a>',    
    '<a href="https://emojipedia.org/" onclick="'+str_t+'" target=_blank>Emojipedia</a>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🎁️','11rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L️','11rem','1rem','1rem','60rem'),'','0rem')+' ');
    
    klmenu_check_b('span_reg_emoji',true);
}

function init_emoji(){
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
    }
    else {
        search_emoji();
    }

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    
    var key_list=Object.keys(unicode_global);
    for (let blxl=0;blxl<key_list.length;blxl++){
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
        range_filter_emoji('+'+bljg.replace(new RegExp(/\s/,'g'),' +')+'(:r)');
        unicode_list_emoji(bljg,Math.ceil(blno/no_per_page_emoji_global));
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
        }
        else {
            aspan.style.color='';
        }
    }
}

function unicode_page_emoji(cscategory,cspages){
    var blno=page_location_b(cspages);
    if (blno!==false){
        unicode_list_emoji(cscategory,blno);
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
            list_t.sort(function (a,b){return a[0]>b[0];});
            
            var textarea_list=[];    
            var blcount=0;    
            for (let blno=0;blno<list_t.length;blno++){
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
            }
            else {
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

function unicode_list_emoji(cscategory='',csstart=1){
    if (cscategory==''){return;}
    var odiv=document.getElementById('divhtml_range');

    var list_t=unicode_global[cscategory];
    var blstart=eval('0x'+list_t[0]);
    var blend=eval('0x'+list_t[1])+1;
    
    var page_count=Math.ceil((blend-blstart)/no_per_page_emoji_global);
    var pages='';
    if (page_count>1){
        for (let blxl=1;blxl<=page_count;blxl++){
            pages=pages+page_one_b(page_count,csstart,blxl,'onclick="unicode_list_emoji(\''+specialstr_j(cscategory)+'\','+blxl+');"',1,100);
        }
    }
    var blfound;
    [pages,blfound]=page_remove_dot_b(pages);
    if (blfound){
        pages=pages+page_prev_next_b(page_count,csstart,'onclick="unicode_list_emoji(\''+specialstr_j(cscategory)+'\','+(csstart-1)+');"','onclick="unicode_list_emoji(\''+specialstr_j(cscategory)+'\','+(csstart+1)+');"','onclick="unicode_page_emoji(\''+specialstr_j(cscategory)+'\','+page_count+');"');
    }
    
    blstart=blstart+(csstart-1)*no_per_page_emoji_global;
    if (blstart+no_per_page_emoji_global<blend){
        blend=blstart+no_per_page_emoji_global;
    }
        
    var result_t=[];
    var blstyle='border:0.1rem solid '+scheme_global['button']+';';
    for (let blxl=blstart;blxl<blend;blxl++){   //不包含 blend - 保留注释
        var blstr='&#'+blxl+';' //也可以用：blstr=String.fromCodePoint(blxl); - 保留注释
        odiv.innerHTML=blstr;
        if (odiv.innerText.slice(-1)==';'){continue;}
        result_t.push('<div class="div_unicode" style="'+blstyle+'" onclick="unicode_info_emoji('+blxl+');">'+blstr+'</div>');
    }
    odiv.innerHTML='<p style="word-break:break-all;word-wrap:break-word;">'+pages+'</p>'+result_t.join(' ');
}

function unicode_info_emoji(csxl){
    var val16=csxl.toString(16);
    var blstr='<b>HTML Entity (decimal):</b> &amp;#'+csxl+'; <b>HTML Entity (hex):</b> &amp;#x'+val16+' ';
    blstr=blstr+'<b>Javascript:</b> \\u{'+val16+'} <b>Javascript (ASCII):</b> \\x'+val16;
    document.getElementById('span_unicode_info').innerHTML=blstr+'<span class="span_no"> => </span>'+'&#'+csxl;
}

function select_pre_next_emoji(cstype){
    var oselect=document.getElementById('select_unicode');
    if (select_prev_or_next_b(oselect,cstype,true)){
        unicode_list_emoji(oselect.value);
    }
}

