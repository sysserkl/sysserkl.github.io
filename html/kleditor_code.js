function table_kleditor(){
    if (selection_global===false){return;}
    
    var rows_cols=(prompt('输入行数和列数，用小写字母x间隔','3x4') || '').split('x');
    if (rows_cols.length<2){return;}
    var rows=parseInt(rows_cols[0].trim());
    var cols=parseInt(rows_cols[1].trim());
    if (isNaN(rows) || isNaN(cols)){return;}

    var bljg='';
    if (confirm('是否另外添加标题行？')){
        bljg=bljg+'<tr>';
        for (let blc=0;blc<cols;blc++){
            bljg=bljg+'<th>TITLE'+(blc+1)+'</th>';
        }
        bljg=bljg+'</tr>\n';
    }
    
    for (let blr=0;blr<rows;blr++){
        bljg=bljg+'<tr>';
        for (let blc=0;blc<cols;blc++){
            bljg=bljg+'<td>&nbsp;</td>';
        }
        bljg=bljg+'</tr>\n';
    }
    var otable = document.createElement('table');
    otable.innerHTML=bljg;
    otable.border=1;
    otable.width='80%';
    selection_global.insertNode(otable);
    selection_global=false;
    
    var oparent=otable.parentNode;
    if (oparent){
        if (oparent.tagName.toLowerCase()=='p'){
            var blstr=otable.outerHTML;
            otable.outerHTML='';
            oparent.insertAdjacentHTML('afterend','\n'+blstr+'\n');
        }
    }
}

function format2_kleditor(cstype){
    if (selection_global===false){return;}
    
    var content = selection_global.extractContents();
    selection_global.deleteContents();

    var oi = document.createElement(cstype);
    oi.appendChild(content);
    selection_global.insertNode(oi); //此行不能放在末尾 - 保留注释

    var onodes=oi.childNodes;
    var outer_2_inner=true;
    for (let one_dom of onodes){
        var blhtml=one_dom.innerHTML;
        if (!blhtml){
            if (one_dom.textContent==''){continue;}
            var oi2=document.createElement(cstype);
            oi2.appendChild(document.createTextNode(one_dom.textContent));
            
            if (one_dom.nextSibling){
                console.log('nextSibling');
                one_dom.nextSibling.insertAdjacentHTML('beforebegin',oi2.outerHTML);
                one_dom.parentNode.removeChild(one_dom);
            } else if (one_dom.previousSibling){
                console.log('previousSibling');
                one_dom.previousSibling.insertAdjacentHTML('afterend',oi2.outerHTML);
                one_dom.parentNode.removeChild(one_dom);
                break;
            } else {
                console.log('noSibling');
                outer_2_inner=false;
                break;
            }
        } else if (blhtml!==''){
            console.log('has innerHTML',blhtml,one_dom);
            one_dom.innerHTML='<'+cstype+'>'+blhtml+'</'+cstype+'>';    //分段问题待解决
        }
    }
    if (outer_2_inner){
        oi.outerHTML=oi.innerHTML;
    }
    selection_global=false;    
}

function selection_kleditor(){
    if (selection_global){return;}
    
    selection_global = window.getSelection();
    var blfound=false;
    if (selection_global){
        var onode=selection_global.anchorNode;
        if (onode){
            while (true){
                onode=onode.parentNode;
                if (onode){
                    var blid=onode.id; //不能使用getAttribute - 保留注释
                    if (blid){
                        if (blid=='div_text_box'){
                            if (selection_global.getRangeAt && selection_global.rangeCount){
                                selection_global = selection_global.getRangeAt(0);
                                blfound=true;
                            }
                            break;
                        }
                    }
                } else {
                    break;
                }
            }
        }
    }
    if (blfound==false){
        selection_global=false;
    }
}

function options_kleditor(){
    var list_t={
    'select_title':
    [
    ["- formatting -"],
    ["h1","Title 1 &lt;h1&gt;"],
    ["h2","Title 2 &lt;h2&gt;"],
    ["h3","Title 3 &lt;h3&gt;"],
    ["h4","Title 4 &lt;h4&gt;"],
    ["h5","Title 5 &lt;h5&gt;"],
    ["h6","Subtitle &lt;h6&gt;"],
    ["p","Paragraph &lt;p&gt;"],
    ["pre","Preformatted &lt;pre&gt;"],
    ],
    "select_font":
    [
    ["- font -"],
    ["Arial"],
    ["Arial Black"],
    ["Courier New"],
    ["Times New Roman"],
    ],
    "select_size":
    [
    ["- size -"],
    ["1","Very small"],
    ["2","A bit small"],
    ["3","Normal"],
    ["4","Medium-large"],
    ["5","Big"],
    ["6","Very big"],
    ["7","Maximum"],
    ],
    "select_color":
    [
    ["- color -"],
    ["red","Red"],
    ["blue","Blue"],
    ["green","Green"],
    ["black","Black"],
    ],
    "select_bgcolor":
    [
    ["- background -"],
    ["red","Red"],
    ["green","Green"],
    ["black","Black"],
    ],    
    };
    for (let key in list_t){
        var one_row=list_t[key];
        var bljg='';
        for (let item of one_row){
            var blcaption=(item.length>1?item[1]:item[0]);
            bljg=bljg+'<option value="'+item[0]+'">'+blcaption+'</option>\n';
        }
        document.getElementById(key).innerHTML=bljg;
    }
}

function remove_obj_kleditor(cstype='none'){
    function sub_remove_obj_kleditor_check(one_dom){
        switch (cstype){
            case 'none':
                return one_dom.style.display=='none';
                break;
            case 'empty':
                return one_dom.innerHTML=='';
                break;
            case 'space':
                return one_dom.innerHTML.trim()=='' || one_dom.innerHTML.trim().match(/^(&nbsp;)+$/)!==null;
                break;
        }
        return false;
    }
    //-----------------------
    if (is_in_source_mode_kleditor()){return;}
    
    var odoms,query_str;
    [odoms,query_str]=doms_get_kleditor();
    if (odoms===false){return;}
        
    if (confirm('是否移除不可见的 '+query_str+' doms？')==false){return;}

    var bldone=0;
    while (true){
        odoms=doms_get_kleditor()[0];
        if (odoms===false){break;}

        var found_doms=[];
        for (let one_dom of odoms){
            if (sub_remove_obj_kleditor_check(one_dom)){
                found_doms.push(one_dom);
            }
        }
        if (found_doms.length==0){break;}
        
        bldone=bldone+found_doms.length;
        for (let one_dom of found_doms){
            one_dom.parentNode.removeChild(one_dom);
        }
    }
    js_alert_b('操作完成，处理了 '+bldone+' 个dom','span_info');
}

function doms_get_kleditor(){
    var query_str=document.getElementById('input_query_str_kleditor').value.trim();
    try {
        var odiv=document.getElementById('div_text_box');
        return [odiv.querySelectorAll(query_str),query_str];        
    } catch (e){
        alert('e');
        return [false,query_str];
    }
}

function remove_attribute_kleditor(){
    if (is_in_source_mode_kleditor()){return;}
    
    var odoms,query_str;
    [odoms,query_str]=doms_get_kleditor();
    if (odoms===false){return;}
    
    var cstype=document.getElementById('select_attribuute_kleditor').value;
    if (confirm('是否移除 '+query_str+' 对象的 '+cstype+'？')==false){return;}
    
    var bldone=0;
    var blignore=0;
    for (let item of odoms){
        if (item.getAttribute(cstype)){
            item.removeAttribute(cstype);
            bldone=bldone+1;
        } else {
            blignore=blignore+1;
        }
    }
    js_alert_b('操作完成，处理了 '+bldone+' 个dom，无需处理 '+blignore+' 个','span_info');
}

function emoji_list_kleditor(){
    var blstr=get_source_kleditor();
    var result_t=emoji_find_b(blstr);
    if (result_t.length==''){
        alert('未发现emoji');
    } else {
        alert(result_t);
    }
}

function menu_kleditor(){
    var str_t=klmenu_hide_b('');
    var blparent=menu_parent_node_b(str_t);
    
    var option_list=list_2_option_b(['alt','class','rel','style','title']);
    
    var klmenu1=[
    '<span class="span_menu">批量移除 <select id="select_attribuute_kleditor">'+option_list.join('')+'</select> <span class="aclick" onclick="'+blparent+'remove_attribute_kleditor();">执行</span></span>',
    '<span class="span_menu" onclick="'+str_t+'remove_obj_kleditor(\'none\');">批量移除不可见doms</span>',
    '<span class="span_menu" onclick="'+str_t+'remove_obj_kleditor(\'empty\');">批量移除innerHTML为空的doms</span>',
    '<span class="span_menu" onclick="'+str_t+'remove_obj_kleditor(\'space\');">批量移除innerHTML为空格的doms</span>',
    '<span class="span_menu">query string: <input id="input_query_str_kleditor" value="*" /></span>',
    '<span class="span_menu" onclick="'+str_t+'emoji_list_kleditor();">emoji list</span>',
    ];

    var group_list=[
    ['Save','save_kleditor();',true],
    ['ENSave','save_kleditor(\'\',true);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var klmenu_image=[
    '<a href="image2base64.htm" onclick="'+str_t+'" target=_blank>convert gif 2 base64</a>',
    ];
    
    var group_list=[
    ['base64','img2base64_kleditor();',true],
    ['size','img_size_show_kleditor();',false],
    ['resize','img_resize_kleditor();',true],
    ];    
    klmenu_image.push(menu_container_b(str_t,group_list,'img: '));    

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'📝','22rem','1rem','1rem','60rem')+klmenu_b(klmenu_image,'🖼','14rem','1rem','1rem','60rem'),'','0rem')+' ');
    
    var input_list=[['input_query_str_kleditor',10.1,5]];
    input_size_b(input_list,'id');    
}

function init_kleditor(){
    menu_kleditor();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    options_kleditor();
    buttons_kleditor();
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_buttons span.oblong_box'));    
    odiv_text_global = document.getElementById('div_text_box');
    if (document.compForm.switchMode.checked){ 
        set_mode_kleditor(true); 
    }
}

function format_kleditor(sCmd, sValue){
    if (validate_mode_kleditor()){
        document.execCommand(sCmd, false, sValue); 
        odiv_text_global.focus(); 
    }
}

function quote_kleditor(){
    format_kleditor('formatblock','blockquote');
}

function validate_mode_kleditor(){
    if (!document.compForm.switchMode.checked){ 
        return true; 
    }
    alert("Uncheck \"Show HTML\".");
    odiv_text_global.focus();
    return false;
}

function get_source_kleditor(){
    var ocheck=document.getElementById('checkbox_switch');
    if (ocheck.checked){
        return odiv_text_global.innerText;
    } else {
        return odiv_text_global.innerHTML;
    }
}

function set_source_kleditor(csstr){
    var ocheck=document.getElementById('checkbox_switch');
    if (ocheck.checked){
        odiv_text_global.innerText=csstr;
    } else {
        odiv_text_global.innerHTML=csstr;
    }
}

function save_kleditor(cstitle='',encrypt=false){
    var blstr=get_source_kleditor();
    if (encrypt){
        if (document.getElementById('checkbox_switch').checked){
            alert('不支持源码下保存');
            return;
        }
        var src_list=[];
        var oimgs=document.querySelectorAll('#div_text_box img');
        for (let one_img of oimgs){
            src_list.push(one_img.getAttribute('src') || '');
            one_img.setAttribute('src','');
        }
        en_double_2_array_klr_b(get_source_kleditor(),true,src_list,true);
        set_source_kleditor(blstr);
        return;
    }
    
    if (cstitle==''){
        cstitle=prompt('输入保存文件名','kleditor');
        if (cstitle==null){return;}
    }
    
    cstitle=cstitle.trim().split('\n')[0];
    if (cstitle==''){
        cstitle='kleditor';
    }
    
    var savename=cstitle+'_'+today_str_b('dt','','','_')+'.htm';
    
    blstr=standalone_html_head_klr_b('💡 '+cstitle)+'<body>\n'+blstr;
    blstr=blstr+dom_quote_b([klarticle_funs_klr_b(true),'//-----------------------','klarticle_init_klr_b(true);']);

    blstr=blstr+'<p>&nbsp;</p>\n<p>&nbsp;</p>\n'+html_tail_generate_b();
    string_2_txt_file_b(blstr,savename,'html')
}

function set_mode_kleditor(show_source=false){
    var oContent;
    if (show_source){
        oContent = document.createTextNode(odiv_text_global.innerHTML);

        odiv_text_global.innerHTML = '';
        odiv_text_global.contentEditable = false;
        
        var oPre = document.createElement('pre');
        oPre.id = 'sourceText';
        oPre.contentEditable = true;
        oPre.appendChild(oContent);
        
        odiv_text_global.appendChild(oPre);
        document.execCommand('defaultParagraphSeparator', false, 'div');
    } else {
        odiv_text_global.innerHTML = odiv_text_global.innerText;
        odiv_text_global.contentEditable = true;
    }
    odiv_text_global.focus();
}

function print_kleditor(){
    if (!validate_mode_kleditor()){return;}
    var oPrntWin = window.open('','_blank','width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes');
    oPrntWin.document.open();
    oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + odiv_text_global.innerHTML + "<\/body><\/html>");
    oPrntWin.document.close();
}

function buttons_kleditor(){
    var style_list=[
    ['Undo','undo','undo.gif'],
    ['Redo','redo','redo.gif'],
    ['Bold','bold','bold.gif'],
    ['Italic','italic','italic.gif'],
    ['Underline','underline','underline.gif'],
    ['Left align','justifyleft','left_align.gif'],
    ['Center align','justifycenter','center_align.gif'],
    ['Right align','justifyright','right_align.gif'],
    ['Numbered list','insertorderedlist','numbered_list.gif'],
    ['Dotted list','insertunorderedlist','dotted_list.gif'],
    ['Delete indentation','outdent','delete_indentation.gif'],
    ['Add indentation','indent','add_indentation.gif'],
    ['Cut','cut','cut.gif'],
    ['Copy','copy','copy.gif'],
    ['Paste','paste','paste.gif'],
    ['Remove formatting','removeFormat','remove_formatting.png'],
    
    ['Clean','*clean_kleditor();','clean.gif'],
    ['Print','*print_kleditor();','print.png'],
    ['Quote','*quote_kleditor();','quote.gif'],
    ['Hyperlink','*hyperlink_kleditor();','hyperlink.gif'],    
    ];
    var list_t=[];
    for (let item of style_list){
        if (item[1].substring(0,1)=='*'){
            list_t.push('<img class="img_link" title="'+item[0]+'" onclick="'+item[1].substring(1,)+'" src="'+imgs_kleditor_global[item[2]]+'" />');        
        } else {
            list_t.push('<img class="img_link" title="'+item[0]+'" onclick="format_kleditor(\''+item[1]+'\');" src="'+imgs_kleditor_global[item[2]]+'" />');
        }
    }
    document.getElementById('div_buttons').insertAdjacentHTML('afterbegin',list_t.join('\n'));
}

function clean_kleditor(){
    if (validate_mode_kleditor() && confirm('Are you sure?')){
        odiv_text_global.innerHTML='';
    }
}

function hyperlink_kleditor(){
    var sLnk=prompt('Write the URL here','http:\/\/');
    if (sLnk && sLnk!='' && sLnk!='http://'){
        format_kleditor('createlink',sLnk);
    }
}

function select_kleditor(cstype,csvalue){
    if (csvalue.substring(0,1)=='-' && csvalue.slice(-1,)=='-'){return;}
    format_kleditor(cstype,csvalue);
}

function img2base64_kleditor(){
    if (is_in_source_mode_kleditor()){return;}    
    var oimgs=document.querySelectorAll('#div_text_box img');
    img2base64_b(oimgs,'span_info');
}

function img_size_show_kleditor(){
    if (is_in_source_mode_kleditor()){return;}    
    var oimgs=document.querySelectorAll('#div_text_box img');

    var bljg=imgs_min_max_size_b(oimgs);
    if (bljg!==''){
        alert(bljg);
    }
}

function img_resize_kleditor(){
    if (is_in_source_mode_kleditor()){return;}   
    var oimgs=document.querySelectorAll('#div_text_box img');    
    resize_batch_imgs_b(oimgs,false,'span_info');
}

function is_in_source_mode_kleditor(){
    if (document.getElementById('checkbox_switch').checked){
        alert('不支持源码下转换');
        return true;
    }
    return false;
}
