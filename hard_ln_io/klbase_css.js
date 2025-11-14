function color_name2hex_b(csname,is_unique=false){
    //更新日期：2019-08-11 - 保留注释
    var colorname={'aliceblue':'#f0f8ff', 'antiquewhite':'#faebd7', 'aqua':'#00ffff', 'aquamarine':'#7fffd4', 'azure':'#f0ffff', 'beige':'#f5f5dc', 'bisque':'#ffe4c4', 'black':'#000000', 'blanchedalmond':'#ffebcd', 'blue':'#0000ff', 'blueviolet':'#8a2be2', 'brown':'#a52a2a', 'burlywood':'#deb887', 'cadetblue':'#5f9ea0', 'chartreuse':'#7fff00', 'chocolate':'#d2691e', 'coral':'#ff7f50', 'cornflowerblue':'#6495ed', 'cornsilk':'#fff8dc', 'crimson':'#dc143c', 'cyan':'#00ffff', 'darkblue':'#00008b', 'darkcyan':'#008b8b', 'darkgoldenrod':'#b8860b', 'darkgray':'#a9a9a9', 'darkgreen':'#006400', 'darkgrey':'#a9a9a9', 'darkkhaki':'#bdb76b', 'darkmagenta':'#8b008b', 'darkolivegreen':'#556b2f', 'darkorange':'#ff8c00', 'darkorchid':'#9932cc', 'darkred':'#8b0000', 'darksalmon':'#e9967a', 'darkseagreen':'#8fbc8f', 'darkslateblue':'#483d8b', 'darkslategray':'#2f4f4f', 'darkslategrey':'#2f4f4f', 'darkturquoise':'#00ced1', 'darkviolet':'#9400d3', 'deeppink':'#ff1493', 'deepskyblue':'#00bfff', 'dimgray':'#696969', 'dimgrey':'#696969', 'dodgerblue':'#1e90ff', 'firebrick':'#b22222', 'floralwhite':'#fffaf0', 'forestgreen':'#228b22', 'fuchsia':'#ff00ff', 'gainsboro':'#dcdcdc', 'ghostwhite':'#f8f8ff', 'gold':'#ffd700', 'goldenrod':'#daa520', 'gray':'#808080', 'green':'#008000', 'greenyellow':'#adff2f', 'grey':'#808080', 'honeydew':'#f0fff0', 'hotpink':'#ff69b4', 'indianred':'#cd5c5c', 'indigo':'#4b0082', 'ivory':'#fffff0', 'khaki':'#f0e68c', 'lavender':'#e6e6fa', 'lavenderblush':'#fff0f5', 'lawngreen':'#7cfc00', 'lemonchiffon':'#fffacd', 'lightblue':'#add8e6', 'lightcoral':'#f08080', 'lightcyan':'#e0ffff', 'lightgoldenrodyellow':'#fafad2', 'lightgray':'#d3d3d3', 'lightgreen':'#90ee90', 'lightgrey':'#d3d3d3', 'lightpink':'#ffb6c1', 'lightsalmon':'#ffa07a', 'lightseagreen':'#20b2aa', 'lightskyblue':'#87cefa', 'lightslategray':'#778899', 'lightslategrey':'#778899', 'lightsteelblue':'#b0c4de', 'lightyellow':'#ffffe0', 'lime':'#00ff00', 'limegreen':'#32cd32', 'linen':'#faf0e6', 'magenta':'#ff00ff', 'maroon':'#800000', 'mediumaquamarine':'#66cdaa', 'mediumblue':'#0000cd', 'mediumorchid':'#ba55d3', 'mediumpurple':'#9370db', 'mediumseagreen':'#3cb371', 'mediumslateblue':'#7b68ee', 'mediumspringgreen':'#00fa9a', 'mediumturquoise':'#48d1cc', 'mediumvioletred':'#c71585', 'midnightblue':'#191970', 'mintcream':'#f5fffa', 'mistyrose':'#ffe4e1', 'moccasin':'#ffe4b5', 'navajowhite':'#ffdead', 'navy':'#000080', 'oldlace':'#fdf5e6', 'olive':'#808000', 'olivedrab':'#6b8e23', 'orange':'#ffa500', 'orangered':'#ff4500', 'orchid':'#da70d6', 'palegoldenrod':'#eee8aa', 'palegreen':'#98fb98', 'paleturquoise':'#afeeee', 'palevioletred':'#db7093', 'papayawhip':'#ffefd5', 'peachpuff':'#ffdab9', 'peru':'#cd853f', 'pink':'#ffc0cb', 'plum':'#dda0dd', 'powderblue':'#b0e0e6', 'purple':'#800080', 'rebeccapurple':'#663399', 'red':'#ff0000', 'rosybrown':'#bc8f8f', 'royalblue':'#4169e1', 'saddlebrown':'#8b4513', 'salmon':'#fa8072', 'sandybrown':'#f4a460', 'seagreen':'#2e8b57', 'seashell':'#fff5ee', 'sienna':'#a0522d', 'silver':'#c0c0c0', 'skyblue':'#87ceeb', 'slateblue':'#6a5acd', 'slategray':'#708090', 'slategrey':'#708090', 'snow':'#fffafa', 'springgreen':'#00ff7f', 'steelblue':'#4682b4', 'tan':'#d2b48c', 'teal':'#008080', 'thistle':'#d8bfd8', 'tomato':'#ff6347', 'turquoise':'#40e0d0', 'violet':'#ee82ee', 'wheat':'#f5deb3', 'white':'#ffffff', 'whitesmoke':'#f5f5f5', 'yellow':'#ffff00', 'yellowgreen':'#9acd32'};
    if (is_unique){
        var list_t={};
        var value_set=new Set();
        for (let key in colorname){
            if (value_set.has(colorname[key])){continue;}
            list_t[key]=colorname[key];
            value_set.add(colorname[key]);
        }
        colorname=list_t;
    }
    
    if (csname=='ALL'){
        return colorname;
    } else if (['ALLKEYS','ALLNAMES'].includes(csname)){
        return Object.keys(colorname);
    }
    
    csname=csname.toLowerCase();
    if (colorname[csname]){
        return colorname[csname];
    }
    return '';
}

function scheme_div_b(){
    Object.entries(scheme_global).forEach(([key, value]) => {
        var hsl=rgb2hsl_b(value);
        document.write('<div style="background-color:'+value+';"><span style="color:black;background-color:white;padding-right:0.5rem;">scheme_global["'+key+'"]: "'+value+'", rgb: '+hex2rgb_b(value)+' hsl: '+hsl['h'].toFixed(4)+' '+hsl['s'].toFixed(4)+' '+hsl['l'].toFixed(4)+'</span></div>');
    });
}

function scheme_generation_b(){
    if (typeof scheme_global == 'undefined'){
        console.log('初始化', 'scheme_global');
        scheme_global={};
    }
    
    if (!scheme_global['color'] || scheme_global['color']==''){
       scheme_global={
       'color':'black',
       'background':'white',
       'a':'#0707bb',
       'a-hover':'red',
       };
    }
    var fcolor=hex2rgb_b(scheme_global['color']);
    var bcolor=hex2rgb_b(scheme_global['background']);
    
    //中等灰度 - 保留注释
    scheme_global['memo']=rgb2hex_b(parseInt(fcolor[0]/2+bcolor[0]/2),parseInt(fcolor[1]/2+bcolor[1]/2),parseInt(fcolor[2]/2+bcolor[2]/2));

    var memohsl=rgb2hsl_b(scheme_global['memo']);
    var bghsl=rgb2hsl_b(scheme_global['background']);
    //3个灰度色 - 保留注释
    scheme_global['shadow']=hsl2hex_b({'h':memohsl['h'],'s':memohsl['s'],'l':Math.min(1,memohsl['l']*1.35)});
    scheme_global['button']=hsl2hex_b({'h':memohsl['h'],'s':memohsl['s'],'l':Math.min(1,memohsl['l']*1.85)});
    scheme_global['menubg']=hsl2hex_b({'h':memohsl['h'],'s':memohsl['s'],'l':Math.min(1,memohsl['l']*2)});

    //3个加亮色 - 保留注释
    scheme_global['skyblue']=hsl2hex_b({'h':Math.abs(0.5-bghsl['h']),'s':Math.abs(0.5-bghsl['s']),'l':bghsl['l']*0.9});
    scheme_global['pink']=hsl2hex_b({'h':1-bghsl['h'],'s':1-bghsl['s'],'l':bghsl['l']*0.9});
    scheme_global['selection']=hsl2hex_b({'h':Math.min(1,bghsl['h']+0.17),'s':1-bghsl['s'],'l':bghsl['l']*0.65});
    
    //---
    var chsl=rgb2hsl_b(scheme_global['a']);
    scheme_global['green']=hsl2hex_b({'h':1-chsl['h'],'s':0.7*chsl['s'],'l':chsl['l']});
    chsl=rgb2hsl_b(scheme_global['a-hover']);
    scheme_global['brown']=hsl2hex_b({'h':chsl['h'],'s':0.5*chsl['s'],'l':chsl['l']*0.8});    
}

function css_root_size_b(pcsize='16',mobilesize='30',increment=false){
    if (pcsize==''){
        pcsize='16';
    }
    if (mobilesize==''){
        mobilesize='30';
    }
    
    if (increment === false){
        increment=parseFloat(local_storage_get_b('root_font_size_increment'));
    } else {
        increment=0;
    }
    
    if (isNaN(increment)){
        increment=0;
    }
    pcsize=parseFloat(pcsize)+increment;
    mobilesize=parseFloat(mobilesize)+increment;
    var rootsize=(ismobile_b()?mobilesize:pcsize);
    document.querySelector(':root').style.fontSize=rootsize+'px';
}

function css_root_style_b(pcsize='16',mobilesize='30',cssname=[''],usercss=[],checkbox_radio=3,increment=false,dom_type=true){
    if (typeof scheme_global == 'undefined'){
        console.log('初始执行', 'scheme_generation_b()');    
        scheme_generation_b();
    }
    
    var list_t=[];
    if (!cssname.includes('wiki')){
        css_root_size_b(pcsize,mobilesize,increment);
        
        if (ismobile_b()){
            //document.write(':root {font-size:'+mobilesize+'px;}\n'); - 保留注释
            //document.write('section {font-size:'+(parseInt(mobilesize)+20)+'px;line-height:150%;}\n'); - 保留注释
            list_t.push('section {font-size:1rem;line-height:150%;}');
            if (checkbox_radio>1){
                list_t.push('input[type=checkbox] {-webkit-transform: scale('+checkbox_radio+'); margin:25px;}');
                list_t.push('input[type=radio] {-webkit-transform: scale('+checkbox_radio+'); margin:25px;}');
            }
        } else {
            //list_t.push(':root {font-size:'+pcsize+'px;}'); - 保留注释
            list_t.push('section {font-size:1rem;line-height:200%;}');
        }
    }
    
    var style_base_wiki_dict={};
    style_base_wiki_dict['.aclick']='.aclick {user-select: none;font-size:1rem; padding:0.3rem 0.4rem;margin-right:0.2rem;line-height:250%;text-decoration:none;border-radius: 0.2rem;background-color:'+scheme_global['button']+';box-shadow: 0.2rem 0.2rem 0.1rem '+scheme_global['shadow']+';cursor:pointer;}\n.aclick:link {color:'+scheme_global['color']+';}\n.aclick:hover {color:'+scheme_global['a-hover']+';}';
    style_base_wiki_dict['.oblong_box']='.oblong_box {border-radius: 0.5rem;border:0.1rem solid '+scheme_global['shadow']+';padding:0.1rem 0.3rem;word-break:break-all;word-wrap:break-word;}';
    style_base_wiki_dict['recent_oblong_box']='div#div_recent_search span.oblong_box {word-break:break-all;word-wrap:break-word;}';
    style_base_wiki_dict['.span_box']='span.span_box {user-select: none; cursor:pointer;}\nspan.span_box:hover {color:'+scheme_global['a-hover']+';}';
    style_base_wiki_dict['.span_underline_box']='span.span_underline_box {user-select: none; cursor:pointer;}\nspan.span_underline_box:hover {color:'+scheme_global['a-hover']+'; text-decoration:underline;}';
    style_base_wiki_dict['.span_link']='span.span_link {color:'+scheme_global['a']+';text-decoration:underline;cursor:pointer;}\nspan.span_link:hover {color:'+scheme_global['a-hover']+';}';
        
    if (cssname.includes('base')){
        list_t=list_t.concat([
        'body {font-size:1rem; margin:0px; padding:0px;color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';}',
        'p {word-break:normal;word-wrap:normal;font-size:0.85rem;margin:0;margin-bottom:0.2rem;color:'+scheme_global['color']+';}',
        'label {cursor:pointer;}',
        'p.mini {font-size:0.75rem;margin:0px;padding:1px 0px 1px 0px;}',
        'ol,ul,li {font-size:0.9rem;color:'+scheme_global['color']+';}',
        'ol,ul {padding:0;list-style-position: inside;}',
        '.fmini {font-size:0.75rem;line-height:100%;margin:3px 0px;color:'+scheme_global['color']+';}',
        '::selection {background-color:'+scheme_global['selection']+';color:'+scheme_global['color']+';}',
        'img {max-width:620px;}',
        'hr {border:1px dashed '+scheme_global['memo']+';}',
        'a {word-break:break-all;word-wrap:break-word;}',
        'a:link, .a_word {color:'+scheme_global['a']+';}',
        '.a_word {text-decoration:underline;cursor:pointer;}',
        'span.span_box_strong {user-select: none; cursor:pointer;}',
        'a:visited {color:'+scheme_global['a']+';}',
        'a:hover, .a_word:hover {color:'+scheme_global['a-hover']+';}',
        'span.span_box_strong:hover {color:'+scheme_global['a-hover']+'; font-weight:bold;}',
        'a.a_box, a.a_black {text-decoration:none;}',
        'a.a_box:hover, a.a_black:hover {text-decoration:underline;}',
        'a:active {color:'+scheme_global['a']+';}',
        'input[type="submit"] {font-size:1rem; padding:0.3rem 1rem;margin-right:0.2rem;border:0;border-radius: 0.2rem;background-color:'+scheme_global['button']+';box-shadow: 0.2rem 0.2rem 0.1rem '+scheme_global['shadow']+';}',
        'a.a_black {color:'+scheme_global['color']+';}',
        'a.a_black:hover {color:'+scheme_global['a-hover']+';}',
        'input {border:1px solid '+scheme_global['memo']+';font-size:0.95rem;padding:2px 5px;color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';}',
        'textarea{border:0.1rem solid '+scheme_global['memo']+';font-size:0.9rem;line-height:130%;width:'+(ismobile_b()?'90':'95')+'%;padding:0.5rem;color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';}',
        'SELECT {font-size:0.9rem;}',
        '.span_from_url, .span_from_wiki {color:'+scheme_global['memo']+';font-size:0.7rem;font-style: italic;}',
        '.span_digest {font-weight:bold;border-bottom:0.15rem solid '+scheme_global['pink']+';}',
        '.span_from_url a, .span_from_wiki a {color:'+scheme_global['memo']+';text-decoration:none;}',
        'a.a_oblong_box {color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';text-decoration:none;border-radius: 0.5rem;border:0.1rem solid '+scheme_global['shadow']+';padding:0.1rem 0.3rem;line-height:1.8rem;}',
        'a.a_oblong_box:hover {color:'+scheme_global['a-hover']+';box-shadow: 0.1rem 0.1rem 0.1rem '+scheme_global['shadow']+';}',
        '.table_common th {border-bottom:0.1rem solid black;padding:0.1rem 0.5rem;}',
        '.table_common tr:hover {background-color:'+scheme_global['button']+';}',
        '.table_common td {border-bottom:0.05rem dotted black;padding:0.1rem 0.5rem;}',        
        ]);
    }
    
    if (cssname.includes('base') || cssname.includes('wiki')){
        for (let akey in style_base_wiki_dict){
            list_t.push(style_base_wiki_dict[akey]);
        }
    }
    
    if (cssname.includes('menu')){
        var fcolor=hex2rgb_b(scheme_global['color']);
        list_t=list_t.concat([
        '.klmenu button {color: '+scheme_global['color']+'; background-color: '+scheme_global['button']+'; padding: 0.5rem 0.65rem; border: none; cursor: pointer; margin:0px;}',
        '.klmenu {position: relative; display: inline-block;}',
        '.klmenu div {display: none; position: absolute; background-color: '+scheme_global['menubg']+'; box-shadow: 0px 8px 16px 0px rgba('+fcolor[0]+','+fcolor[1]+','+fcolor[2]+',0.2); z-index: 1;}',
        '.klmenu div a, .klmenu div span.span_menu, .klmenu div span.span_menu_container{color: '+scheme_global['color']+'; padding: 0.5rem 1rem; text-decoration: none; display: block; font-weight:normal;}',
        '.klmenu div a:hover, .klmenu div a:active, .klmenu div span.span_menu:hover {color:'+scheme_global['a-hover']+'; background-color: '+scheme_global['button']+'; font-weight:bold; box-shadow: 0px 0px 10px '+scheme_global['color']+';cursor:pointer;}',
        '.klmenu div span.span_menu_container:hover {background-color: '+scheme_global['button']+'; box-shadow: 0px 0px 10px '+scheme_global['color']+';cursor:pointer;}',
        '.klmenu:hover button {background-color: '+scheme_global['shadow']+';}',        
        ]);
    }

    if (usercss.length==1){
        usercss.push(usercss[0]);
    }
    if (usercss.length==2){
        if (ismobile_b()){
            list_t.push(usercss[0]);
        } else {
            list_t.push(usercss[1]);
        }
    }
    
    style_generate_b(list_t,dom_type);
}

function mobile_style_b(csstr1,csstr2=''){
    //csstr1 mobile style
    //csstr2 pc style
	if (ismobile_b()){
		if (csstr1!==''){
            style_generate_b(csstr1,true);
        }
	} else {
		if (csstr2!==''){
            style_generate_b(csstr2,true);
        }
	}
}

function css_select_b(cslen=4,cstype='pc'){
    if (cstype=='mobile'){
        return 'font-size:1.1rem; width:'+(1.3*cslen)+'em; min-height:1.1rem;';
    }
    return 'width:'+(cslen+2)+'em;';
}

function css_checkbox_b(csscale=2,cstype='pc'){
    if (cstype=='mobile'){
        return '-webkit-transform: scale('+csscale+');margin-right:1rem;';
    }
    return '';
}

function css_input_text_b(cslen=10,cstype='pc',csexpand=false,csstyle='',font_size=false){
    if (csexpand==false){
        csexpand=2;
    }
    if (csstyle==''){
        var csstyle='border:0px;border-bottom:0.1rem solid #939598';
    }
    if (cstype!=='mobile' && cslen>10){
        cslen=cslen+cslen/csexpand;
    }
    if (font_size==false){
        font_size=1.25;
    }
    return 'width: '+cslen+'rem; font-size:'+font_size+'rem; padding:2px 5px; vertical-align:text-bottom;'+csstyle;
}

function checkbox_kl_b(csid,cscaption,cstitle='',selected=false,jsstr=''){
    if (selected){
        var blc='blue';
        var blchecked=' checked';
    } else {
        var blc='grey';
         var blchecked='';
    }
    var bljg='';
    bljg=bljg+'<span id="'+csid+'" style="cursor:pointer;color:'+blc+'" title="'+cstitle+'" onclick=\'checkbox_kl_color_b("'+csid+'");'+jsstr+'\'>';
    bljg=bljg+'<input name="checkbox_'+csid+'" id="checkbox_'+csid+'" type="checkbox" style="display:none;" ';
    bljg=bljg+blchecked+'>';
    bljg=bljg+'✔ '+cscaption+'</span>';
    return bljg;
}

function checkbox_kl_color_b(csid,setvalue=-1){
    //切换或设置值 - 保留注释
    var obj=document.getElementById(csid);
    if (obj){
        var ocheck=obj.getElementsByTagName('input')[0];
        if (ocheck){
            if (setvalue==-1){
                if (obj.style.color=='grey'){
                    obj.style.color='blue';
                    ocheck.checked=true;
                } else {
                    obj.style.color='grey';
                    ocheck.checked=false;
                }
            } else if (setvalue==1 || setvalue==true){
                obj.style.color='blue';
                ocheck.checked=true;
            } else if (setvalue==0 || setvalue==false){
                obj.style.color='grey';
                ocheck.checked=false;
            }
        }
    }
}

function checkbox_kl_value_b(csid){
    //获取值 - 保留注释
    var obj=document.getElementById(csid);
    if (obj){
        var ocheck=obj.getElementsByTagName('input')[0];
        if (ocheck){
            return ocheck.checked;
        }   
    }
    return 0;
}

function klmenu_check_b(span_id,change_value=true){
    var ospan=document.getElementById(span_id);
    if (!ospan){return 0;} //原先为 false - 保留注释
    var blstr=ospan.innerText;
    var blvalue=(blstr.indexOf('⚪')==0?false:true);
    if (change_value){
        blvalue=!blvalue;
        ospan.innerText=(blvalue?'🔵':'⚪')+blstr.substring((blvalue?'⚪'.length:'🔵'.length),);
    }
    return blvalue;
}

function local_storage_span_get_b(app_name,span_suffix,cstype,csdict=false){
    if (typeof cstype == 'string'){
        cstype=[cstype];
    }
    for (let one_type of cstype){
        var old_set=(local_storage_get_b(app_name+'_set_'+one_type)=='1');
        var current_value=klmenu_check_b('span_'+one_type+'_'+span_suffix,false);
        if (old_set!==current_value){
            current_value=klmenu_check_b('span_'+one_type+'_'+span_suffix,true);
        }
        if (csdict!==false){
            csdict[one_type]=current_value;
        }
    }
}

function local_storage_span_set_b(app_name,span_suffix,cstype,csdict=false){
    var blvalue=klmenu_check_b('span_'+cstype+'_'+span_suffix,true);
    if (csdict!==false){
        csdict[cstype]=blvalue;
    }
    localStorage.setItem(app_name+'_set_'+cstype,(blvalue?'1':'0'));
}

function klmenu_b(csarray,menu_name='',min_width='',button_fontsize='',item_fontsize='',max_height='',cstitle='',menuid='',buttonid=''){
    if (menu_name==''){
        menu_name='☰';
    }
    if (min_width==''){
        min_width='10rem';
    }
    if (button_fontsize==''){
        button_fontsize='1.2rem';
    }
    if (item_fontsize==''){
        item_fontsize='1.2rem';
    }
    if (max_height==''){
        max_height='40rem';
    }
    
    var bljg='<div class="klmenu"';
    if (menuid!==''){
        bljg=bljg+' id="'+menuid+'"';
    }
    bljg=bljg+'>';
    bljg=bljg+'<button type="button"';
    if (buttonid!==''){
        bljg=bljg+' id="'+buttonid+'"';
    }
    bljg=bljg+' style="font-size:'+button_fontsize+';" onclick="klmenu_button_click_b(this);" title="'+cstitle+'">'+menu_name+'</button>';
    bljg=bljg+'<div class="div_menu_items" style="display:none;min-width: '+min_width+';max-height:'+max_height+';overflow:scroll;overflow-y:auto;overflow-x:auto;">';
    for (let item of csarray){
        bljg=bljg+'<span style="text-align:left;font-size:'+item_fontsize+';">'+item+'</span>\n';
    }
    bljg=bljg+'</div></div>';
    return bljg;
}

function klmenu_button_click_b(obutton){
    var o_current_div=obutton.parentNode.querySelector('div.div_menu_items');
    popup_show_hide_b(o_current_div);
    
    var omenu=obutton.parentNode.parentNode;
    if (omenu){
        var odivs=omenu.querySelectorAll('div.div_menu_items');
        for (let one_div of odivs){
            if (one_div==o_current_div){continue;}  //对象直接对比 - 保留注释
            if (one_div.style.display!=='none'){
                one_div.style.display='none';
            }
        }
    }
}

function fpara_menu_b(str_t){
    return '<span class="span_menu" onclick="'+str_t+'file_date_paramter_refresh_b();">刷新 file date paramter</span>';
}

function klmenu_hide_b(csname='',more_parent=false){
    var blhref=(csname==''?'':"document.location.href = '"+csname+"';");
    if (more_parent){
        return "this.parentNode.parentNode.parentNode.style.display='none';"+blhref;    
    } else {
        return "this.parentNode.parentNode.style.display='none';"+blhref;
    }
}

function klmenu_select_sort_b(select_id,col_name_list,str_t=false,fn_name=false,add_span=true,no_mode=true,span_more=[],selected_id=0,prefix='',suffix=''){
    if (no_mode){
        for (let blxl=0,lent=col_name_list.length;blxl<lent;blxl++){
            col_name_list[blxl]='<option value="'+blxl+'"'+(selected_id==blxl?' selected':'')+'>'+col_name_list[blxl]+'</option>';
        }
    } else {
        for (let blxl=0,lent=col_name_list.length;blxl<lent;blxl++){
            col_name_list[blxl]='<option'+(selected_id==blxl?' selected':'')+'>'+col_name_list[blxl]+'</option>';
        }
    }

    var blstr='<select id="'+select_id+'" style="height:2rem;">'+col_name_list.join('')+'</select>';
    
    if (str_t!==false && fn_name!==false){
        var blparent=menu_parent_node_b(str_t);
        blstr=blstr+' <span class="aclick" onclick="'+blparent+fn_name+'();">↑</span><span class="aclick" onclick="'+blparent+fn_name+'(true);">↓</span>';
    }
    
    var more_buttons=[];
    for (let item of span_more){
        more_buttons.push('<span class="aclick" onclick="'+blparent+item[0]+'();">'+item[1]+'</span>');
    }
    blstr=blstr+more_buttons.join('');
    
    blstr=prefix+blstr+suffix;
    
    if (add_span){
        blstr='<span class="span_menu">'+blstr+'</span>';
    }
    return blstr;
}

function klmenu_multi_button_div_b(csstr,cstyle='',cspadding='',csmargin='',csid=''){
    if (cstyle==''){
        cstyle='inline-block';
    }
    if (cspadding==''){    
        cspadding='0rem 0.5rem';
    }
    if (csmargin==''){    
        csmargin='0';
    }    
    var menu_str='<div ';
    if (csid!==''){
        menu_str=menu_str+'id="'+csid+'" ';
    }
    menu_str=menu_str+'style="background-color:'+scheme_global['button']+';display: '+cstyle+';padding:'+cspadding+';margin:'+csmargin+';">';
    menu_str=menu_str+csstr;
    menu_str=menu_str+'</div>';
    return menu_str;
}

function popup_show_hide_b(csid,cstype='block'){
    if (typeof csid =='string'){
        var obj=document.getElementById(csid);
    } else {
        var obj=csid;
    }
    
    if (!obj){return false;}
    if (obj.style.display==cstype){
        obj.style.display='none';
        cstype='none';
    } else {
        obj.style.display=cstype;
    }
    return cstype;
}

function border_style_b(spanid,popupid){
    var list_t=['none','dotted','dashed','solid','double','groove','ridge','inset','outset','wavy'];
    var bltop='<span id="'+spanid+'" style="cursor:pointer;" onclick="popup_show_hide_b(\''+popupid+'\')">none</span>';
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<span style="cursor:pointer;" onclick="document.getElementById(\''+spanid+'\').innerHTML=this.innerHTML;popup_show_hide_b(\''+popupid+'\');">'+item+'</span> ';
    }
    return bltop+popup_b(popupid,bljg)
}

function background_img_style_b(spanid,popupid){
    //no-repeat-expand 是特殊属性 - 保留注释
    var list_t=['repeat','repeat-x','repeat-y','no-repeat','no-repeat-expand','space','round'];
    var bltop='<span id="'+spanid+'" style="cursor:pointer;" onclick="popup_show_hide_b(\''+popupid+'\')">repeat</span>';
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<span style="cursor:pointer;" onclick="document.getElementById(\''+spanid+'\').innerHTML=this.innerHTML;popup_show_hide_b(\''+popupid+'\');">'+item+'</span> ';
    }
    return bltop+popup_b(popupid,bljg)
}

function popup_b(csid,cscontent='',csfontsize='',cswidth='',cspadding='',csline_height='',csdisplay='',csposition=''){
    if (csfontsize==''){
        csfontsize='1rem';
    }
    if (cswidth==''){
        cswidth='auto';
    }
    if (csdisplay==''){
        csdisplay='none';
    }
    if (csposition==''){
        csposition='absolute';
    }        
    if (cspadding==''){
        cspadding='1rem';
    }
    var bljg='<div id="'+csid+'" ';
    bljg=bljg+'style="position:'+csposition+';display:'+csdisplay+';margin-left:0.05rem;margin-top:0.5rem;padding:'+cspadding+'; border:0.1rem solid #c0c0c0;border-radius: 1rem; box-shadow: 0.3rem 0.3rem 0.3rem #c0c0c0;word-break:normal;word-wrap:normal;background-color:#f0f0f0;font-size:'+csfontsize+';max-width:'+cswidth+';z-index: 1;line-height:'+csline_height+';">'+cscontent+'</div>';
    return bljg;
}

function popup_event_div_b(event,div_id,div_html='',add_close_button='bottom',div_font_size_mobile='',translucent=1,max_width='',background_color='',border_width='',border_type='',z_index=-1,csposition='absolute'){
    var odiv=document.getElementById(div_id);
    if (!odiv){
        var trans_style='';
        if (translucent<1){
            trans_style=' onmouseover="this.style.opacity=1;" onmouseout="this.style.opacity='+translucent+';"';
        }    
        
        max_width=(max_width!==''?'max-width:'+max_width+';':'');
        background_color=(background_color==''?scheme_global['background']:background_color);
        border_width=(border_width==''?'0.1rem':border_width);
        border_type=(border_type==''?'solid':border_type);
        
        document.querySelector('body').insertAdjacentHTML('beforeend','<div id="'+div_id+'" style="position:'+csposition+';display:none;background-color:'+background_color+';padding:0.5rem;'+max_width+' border:'+border_width+' '+border_type+' '+scheme_global['memo']+';border-radius:1rem;top:0;left:0;'+(ismobile_b() && div_font_size_mobile!==''?'font-size:'+div_font_size_mobile+';':'')+(z_index>0?'z-index:'+z_index+';':'')+'"'+trans_style+'></div>');
        odiv=document.getElementById(div_id);
    }
    if (!odiv){
        console.log('popup_event_div_b()','未发现',div_id);
        return false;
    }
    switch (add_close_button){
        case 'bottom':
            div_html=div_html+' <span class="span_box" onclick="this.parentNode.style.display=\'none\';">❌</span>';
            break;
        case 'top_right':
            div_html='<p align=right><span class="span_box" onclick="this.parentNode.parentNode.style.display=\'none\';">❌</span></p>'+div_html;
            break;
        case 'top_left':
            div_html='<p><span class="span_box" onclick="this.parentNode.parentNode.style.display=\'none\';">❌</span></p>'+div_html;
            break;            
    }
    odiv.innerHTML=div_html;
    odiv.style.display='';  //否则rect的值为0 - 保留注释
    var rect=odiv.getBoundingClientRect();
    odiv.style.left=Math.min(event.pageX,document.body.scrollWidth-rect.width)+'px';    //必须加上px - 保留注释
    odiv.style.top=event.pageY+'px';
    return odiv;
}

function top_bottom_menu_b(csno=-1,trigger=true,threshold=0){
    var osection=document.getElementById('section_top_bottom_menu');
    if (!osection){return;}
    var ohs=document.querySelectorAll('h1,h2,h3,h4,h5');
    var blno=1;
    if (osection.innerHTML==''){
        var result_t=[];
        var full_t=[];
        for (let blxl=0,lent=ohs.length;blxl<lent;blxl++){
            var item=ohs[blxl];
            var bltxt=item.innerText.trim();
            var blat=bltxt.indexOf(' | ');
            if (blat>=0){
                bltxt=bltxt.substring(blat+3,);
            }
            if (bltxt==''){continue;}

            full_t.push('<p style="margin:0.5rem 0 0.5rem 0;"><span style="cursor:pointer;" onmouseover="this.style.backgroundColor=\'skyblue\';" onmouseout="this.style.backgroundColor=\'\';" onclick="top_bottom_menu_b('+blxl+',false);">'+blno+'. '+bltxt+'</span></p>');
            
            if (bltxt.length>20){
                bltxt=bltxt.substring(0,20)+'...';
            }
            result_t.push('<p><span onmouseover="this.style.backgroundColor=\'white\';" onmouseout="this.style.backgroundColor=\'\';" onclick="top_bottom_menu_b('+blxl+');">'+blno+'. '+bltxt+'</span></p>');
            blno=blno+1;
        }
        osection.innerHTML=result_t.join('\n');
        if (threshold>0 && result_t.length>=threshold){
            var omenu=document.getElementById('div_list_top_bottom_menu');
            if (!omenu){
                var blsize=(ismobile_b()?0.9:1.1);
                document.body.insertAdjacentHTML('afterbegin','<div id="div_list_top_bottom_menu" style="font-size:'+blsize+'rem;line-height:'+(blsize+0.3)+'rem;padding:0.5rem;border:0.1rem dotted grey;border-radius:0.5rem;"></div>\n');
            }
            omenu=document.getElementById('div_list_top_bottom_menu');
            if (omenu){            
                if (omenu.innerHTML==''){
                    omenu.innerHTML=full_t.join('\n');
                }
            }
        }
    }
    if (csno>=0 && csno <ohs.length){
        ohs[csno].scrollIntoView();
    }
    if (trigger){
        popup_show_hide_b(osection);
    }
}

function top_bottom_arrow_b(idname,csmemo='',cseng=false,csfsize='1.3rem',show_soft=true,show_time=false,add_lines=0,show_menu=0,show_font=false){  //topbottom - 保留注释
    var odiv=document.getElementById(idname);
    if (!odiv){
        document.body.insertAdjacentHTML('beforeend','<div id="'+idname+'"></div>');
        odiv=document.getElementById(idname);
    }
    if (!odiv){return;}
    
    //更新memo - 保留注释
    var omemo=document.getElementById('span_top_bottom_arrow_memo');
    if (omemo){
        if (csmemo!==''){
            omemo.innerHTML=csmemo;
        }
        return;
    }
    
    var ismobile=ismobile_b();
    if (ismobile && csfsize==''){
        csfsize='2.3rem';
    }
    
    var bljg='';
    var soft_str='';
    if (show_soft){
        var soft_font_size=(parseFloat(csfsize.split('rem')[0])*0.6).toFixed(2);
        soft_str=klsofts_div_b('div_top_bottom_menu',soft_font_size);
    }
    bljg=bljg+soft_str;

    var check_h=false;
    if (Array.isArray(show_menu)){
        if (show_menu.length>=2){
            check_h=show_menu[1];
        }
        show_menu=show_menu[0];
    }
    if (check_h){
        if (document.querySelectorAll('h1,h2,h3,h4,h5').length<=1){
            show_menu=0;
        }
    }
    
    if (show_menu>0){
        bljg=bljg+'<section id="section_top_bottom_menu" style="display:none;font-weight:normal;padding:0rem;max-height:'+(ismobile?'20':'30')+'rem;overflow-x: hidden;overflow-y: scroll;"></section>';
    }
    //---
    var time_str='';
    if (show_time){
        bljg=bljg+'<span onclick="page_eta_b(this,\'⏰\');" style="cursor:pointer;">⏰</span> ';    
    }
    
    bljg=bljg+'<span id="span_top_bottom_arrow_memo">'+csmemo+'</span>';
    if (show_soft){
        var blhour=new Date().getHours();
        if (blhour>=18){
            var soft_character='🌑';
        } else if (blhour>=10){
            var soft_character='🌞';            
        } else {
            var soft_character='S';
        }
        bljg=bljg+'<span onclick="popup_show_hide_b(\'div_top_bottom_menu\');" style="cursor:pointer;">'+soft_character+'</span> ';
    }
    if (show_menu>0){
        bljg=bljg+'<span onclick="top_bottom_menu_b(-1,true,'+show_menu+');" style="cursor:pointer;">M</span> ';
    }
    if (show_font){
        bljg=bljg+'<span onclick="root_font_size_change_b(0.5);" style="cursor:pointer;">+</span> ';
        bljg=bljg+'<span onclick="root_font_size_change_b(-0.5);" style="cursor:pointer;">-</span> ';
    }
    bljg=bljg+'<span onclick="window.scrollTo(0,0);" style="cursor:pointer;">T↑</span> ';
    bljg=bljg+'<span onclick="window.scrollTo(0,document.body.scrollHeight);" style="cursor:pointer;">B↓</span> ';
    if (cseng || document.getElementsByClassName('sup.kleng').length>0){
        bljg=bljg+'<span style="cursor:pointer;" onclick="sup_kleng_hide_b();" title="单词显示切换">E</span> ';
    }
    if (is_local_b()){
        var caption=(location.host=='127.0.0.1'?'❌':'❎');
    } else {
        var caption='x';
    }
    bljg=bljg+'<span onclick="if (confirm(\'是否关闭？\')){document.getElementById(\''+idname+'\').parentNode.removeChild(document.getElementById(\''+idname+'\'));}" style="cursor:pointer;">'+caption+'</span> ';
    odiv.innerHTML=bljg;
    odiv.style.cssText='position:fixed; bottom:0%; right:0%; z-index:9999; color:black; font-size:'+csfsize+';padding:0 0.5rem; margin:0; border-radius:0.5rem;background-color:#bbbbbb;opacity:0.5;font-weight:bold;';
    odiv.setAttribute('onmouseover','this.style.opacity=0.9;');
    odiv.setAttribute('onmouseout','this.style.opacity=0.5;');
    
    if (add_lines>0){
        document.body.insertAdjacentHTML('beforeend','<p>&nbsp;</p>\n'.repeat(add_lines));
    }
}

function page_eta_b(ospan,default_value='',csmax=5400){
    function sub_page_eta_b_check(){
        var bltime=days_between_two_dates_b(start_value[1],new Date(),'s');
        var bllen=document.scrollingElement.scrollTop-start_value[0];
        if (bllen>1 && bltime>1){
            var blspeed=bltime/bllen;
            var remain_time=Math.ceil((document.scrollingElement.scrollHeight-document.scrollingElement.scrollTop)*blspeed);
            var blplus='';
            if (remain_time>csmax){
                blplus='+';
                remain_time=csmax;
            }
            var blminute='';
            if (remain_time>60){
                blminute=Math.floor(remain_time/60);
                remain_time=remain_time-blminute*60;
                blminute=blminute+'m';
            }
            ospan.innerText=blminute+remain_time+'s'+blplus;
        }
        if (page_eta_global==false || document.scrollingElement.clientHeight+document.scrollingElement.scrollTop>=document.scrollingElement.scrollHeight){
            page_eta_global=false;
            ospan.innerText=default_value;
        } else {
            setTimeout(sub_page_eta_b_check,3000); //比使用setInterval合理，避免未运行完程序就再次调用 - 保留注释
        }
    }
    //-----------------------
    if (typeof page_eta_global !== 'undefined'){
        if (page_eta_global){
            page_eta_global=false;
            return;
        }
    }
    var start_value=[document.scrollingElement.scrollTop,new Date()];
    ospan.innerText='↕';
    page_eta_global=true;   //全局变量
    setTimeout(sub_page_eta_b_check,3000); 
}

function rndcolor_b(){
    var letters = '0123456789ABCDEF';
    var color = '';
    for (let blxl = 0; blxl < 6; blxl++){
        color += letters[Math.floor(Math.random() * 16)];
    }
    return '#'+color;
}

function rnd_margin_color_b(csmargin=20,csrgbcolor=[255,255,255]){
    function sub_rnd_margin_color_b(csmargin,one_csrgbcolor){
        var blxl=0;
        var one_rgb=Math.floor(Math.random() * 256);
        while (Math.abs(one_rgb-one_csrgbcolor)<=csmargin){
            bljg=Math.floor(Math.random() * 256);
            blxl=blxl+1;
            if (blxl>100){return 0;}
        }
        return one_rgb;
    }
    //-----------------------
    var r=sub_rnd_margin_color_b(csmargin,csrgbcolor[0]);
    var g=sub_rnd_margin_color_b(csmargin,csrgbcolor[1]);
    var b=sub_rnd_margin_color_b(csmargin,csrgbcolor[2]);
    return rgb2hex_b(r,g,b);
}

function rndcolor_light_b(light_max=1,light_min=0){
    light_max=Math.min(1,Math.max(0.001,light_max));
    light_min=Math.min(1,Math.max(0.001,light_min));
    
    var rnd_right=Math.abs(light_max-light_min)*Math.random()+Math.max(light_max,light_min);
    
    var rgbcolor=hsl2rgb_b(Math.random(),Math.random(),Math.random()*rnd_right);
    return rgb2hex_b([rgbcolor['r'],rgbcolor['g'],rgbcolor['b']]);
}

function rgb2hex_b(rgb,csg,csb){
    //rgb [255,0,0] - 保留注释
    function sub_rgb2hex_b_component(c){
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
    //-----------------------
    var csnum=arguments.length;
    if (csnum==3){
        rgb=[rgb,csg,csb];
    } else if (csnum==1){
        if (!Array.isArray(rgb) && typeof rgb =='object'){
            rgb=[rgb['r'],rgb['g'],rgb['b']];
        } else if (typeof rgb == 'string' ){//rgb(153, 153, 153) - 保留注释
            var hexname=color_name2hex_b(rgb);
            if (hexname!==''){
                return hexname;
            }
            rgb=rgb.replace('rgb','');
            rgb=rgb.replace('(','');
            rgb=rgb.replace(')','');
            rgb=rgb.split(',');
        }
    }

    for (let blxl=0;blxl<3;blxl++){
        if (typeof rgb[blxl] == 'string'){
            rgb[blxl]=parseInt(rgb[blxl].trim());
        }
    }

    return ('#' + sub_rgb2hex_b_component(rgb[0]) + sub_rgb2hex_b_component(rgb[1]) + sub_rgb2hex_b_component(rgb[2])).toUpperCase();
}

function hex2rgb_b(hex,return_str=false){
    //hex支持颜色名称输入 - 保留注释
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b){
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result==null){
        hex=color_name2hex_b(hex);
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    }

    var bljg = result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : false;
    if (return_str){
        if (bljg===false){
            return '';
        } else {
            return 'rgb('+bljg.join(', ')+')';
        }
    } else {
        return bljg;
    }
}

function color_range_b(color1=[],color2=[],cscount=10){ //date_count_dots_b - 保留注释
    if (color1.length!==3){
        var color1=[randint_b(0,255),randint_b(0,255),randint_b(0,255)];
    }
    if (color2.length!==3){
        var color2=[randint_b(0,255),randint_b(0,255),randint_b(0,255)];
    }
    var list_t=[];
    cscount=Math.max(2,cscount-1);
    
    var red=(color2[0]-color1[0])/cscount;
    var green=(color2[1]-color1[1])/cscount;
    var blue=(color2[2]-color1[2])/cscount;
    
    for (let blxl=0;blxl<=cscount;blxl++){
        list_t.push([parseInt(color1[0]+red*blxl),parseInt(color1[1]+green*blxl),parseInt(color1[2]+blue*blxl)]);
    }
    return list_t;
}

function color_list_generate_b(cslist,intround=0,demo_min_value=-1,demo_max_value=-1){
    if (cslist.length!==5){
        return [false,'需要5个元素',false,false];
    }
    var default_list=[[-10,'int'],[40,'int'],[8,'int'],['green','str'],['red','str']];
    var min_value,max_value,color_range,color1,color2;
    [min_value,max_value,color_range,color1,color2]=array_batch_value_get_b(cslist,default_list);
    
    var color_list=[];
    if (color1!==color2){
        color_range=Math.round(color_range/2);
        color_list=color_with_different_light_b(color1,color_range,true);
    }
    color_list=color_list.concat(color_with_different_light_b(color2,color_range));
    //color_list 形如：[ "#000066", "#0000CC", "#3333FF", "#9999FF", "#FF9999", "#FF3333", "#CC0000", "#660000" ] - 保留注释
    var legend=[];

    [color_list,legend]=color_range_with_value_range_b(color_list,min_value,max_value,intround);
    
    if (demo_min_value===-1){
        demo_min_value=min_value;
    }
    
    if (demo_max_value===-1){
        demo_max_value=max_value;
    }
    var demo_list=values_demo_color_range_b(color_list,demo_min_value,demo_max_value);
    return [color_list,legend,min_value,max_value,demo_list];
}

function color_range_with_value_range_b(color_list,min_value,max_value,intround=0){
    var blstep=Math.ceil((max_value-min_value+1)/(color_list.length-1));
    if (intround>0){
        blstep=Math.round(blstep/(10**intround))*(10**intround);
    }
    
    var legend=[];
    var csarr=[].concat(color_list);
    for (let blxl=0,lent=csarr.length-1;blxl<lent;blxl++){
        csarr[blxl]=[csarr[blxl],min_value+blstep*blxl];
        legend.push('&lt;<span style="color:'+csarr[blxl][0]+';">●</span>≤'+csarr[blxl][1]);
    }

    csarr[csarr.length-1]=[csarr[csarr.length-1],Infinity];
    legend.push('&lt;<span style="color:'+csarr[csarr.length-1][0]+';">●</span>≤'+csarr[csarr.length-1][1]);
    
    if (legend.length>0){
        legend[0]=legend[0].substring(4,);
    }
    return [csarr,legend];
}

function values_demo_color_range_b(color_list,min_value=false,max_value=false){
    var result_t=new Set();
    for (let arow of color_list){
        result_t.add(arow[1]-1);
        result_t.add(arow[1]);
        result_t.add(arow[1]+1);
    }
    
    result_t=Array.from(result_t);
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        var item=result_t[blxl];
        var blcolor=value_in_color_range_b(item,color_list,min_value,max_value);
        result_t[blxl]='<span style="color:'+blcolor+';">●</span>'+item;
    }
    
    return result_t;
}

function value_in_color_range_b(csvalue,color_list,min_value=false,max_value=false){
    var blcolor=false;
    if (min_value!==false){
        csvalue=Math.max(min_value,csvalue);
    }
    if (max_value!==false){
        csvalue=Math.min(max_value,csvalue);
    }
        
    for (let item of color_list){
        blcolor=item[0];
        if (csvalue<=item[1]){break;} //console.log(blcolor,csvalue,item[1]);
    }
    return blcolor;
}

function color_with_different_light_b(cscolor,cscount=10,is_reverse=false){
    var color_raw=rgb2hsl_b(cscolor);
    var result_t=[];
    //忽略白色和黑色 - 保留注释
    cscount=cscount+1;
    for (let blxl=cscount-1;blxl>0;blxl--){
        var color_new=hsl2hex_b(color_raw['h'],color_raw['s'],blxl/cscount);
        result_t.push(color_new);
    }
    if (is_reverse){
        result_t.reverse();
    }
    return result_t;
}

function hsl2hex_b(h,s,l){
    if (arguments.length === 1){
        var s,l;
        [h,s,l]=[h.h, h.s, h.l];
    }
    return rgb2hex_b(hsl2rgb_b(h,s,l));
}

function hsl2rgb_b(h,s,l){
    //code source: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    function sub_HSLtoHSV_b(h, s, l){
        var _h = h;
        var _s, _v;

        l *= 2;
        s *= (l <= 1) ? l : 2 - l;
        _v = (l + s) / 2;
        if (s==0){
            _s=0;
        } else {
            _s = (2 * s) / (l + s);
        }
        return [_h, _s, _v];
    }

    function sub_HSVtoRGB_b(cslist){
        var h,s,v;
        [h,s,v]=cslist;
        
        var r, g, b, i, f, p, q, t;
        
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6){
            case 0:
                r = v, g = t, b = p; 
                break;
            case 1: 
                r = q, g = v, b = p; 
                break;
            case 2: 
                r = p, g = v, b = t; 
                break;
            case 3: 
                r = p, g = q, b = v; 
                break;
            case 4: 
                r = t, g = p, b = v; 
                break;
            case 5: 
                r = v, g = p, b = q; 
                break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    //-----------------------
    if (arguments.length === 1){
        var s,l;
        [h,s,l]=[h.h, h.s, h.l];
    }
    if (s==0){
        var rgb = { };
        rgb.r = rgb.g = rgb.b = Math.round(l * 255);
        return rgb;
    }
        
    return sub_HSVtoRGB_b(sub_HSLtoHSV_b(h,s,l));
}

function rgb_mix_b(rgb1,rgb2){ 
    // 计算新的RGB值  
    var newRgb = [  
    Math.round((rgb1[0] + rgb2[0]) / 2),  
    Math.round((rgb1[1] + rgb2[1]) / 2),  
    Math.round((rgb1[2] + rgb2[2]) / 2)  
    ];  
  
    return newRgb;  
}  

function rgb2hsl_b(r,g,b){
    //code source: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    function sub_RGBtoHSV_b(r, g, b){
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var d = max - min;
        var _h;
        var _s = (max === 0 ? 0 : d / max);
        var _v = max / 255;

        switch (max){
            case min:
                _h = 0; 
                break;
            case r:
                _h = (g - b) + d * (g < b ? 6: 0);
                _h /= 6 * d;
                break;
            case g:
                _h = (b - r) + d * 2;
                _h /= 6 * d;
                break;
            case b:
                _h = (r - g) + d * 4;
                _h /= 6 * d;
                break;
        }

        return {h: _h, s: _s, v: _v};
    }

    function sub_HSVtoHSL_b(cslist){
        var h,s,v;
        [h,s,v]=[cslist.h, cslist.s, cslist.v];
        
        var _h = h;
        var _s = s * v;
        var _l = (2 - s) * v;
        //_s /= (_l <= 1) ? _l : 2 - _l;
        _s /= (_l <= 1) ? (_l === 0 ? 1 : _l) : 2 - _l;
        _l /= 2;
        return {h: _h, s: _s, l: _l};
    }
    //-----------------------
    if (arguments.length === 1){
        var g,b;
        if (Array.isArray(r) && r.length==3){
            [r,g,b]=r;
        } else if (typeof r =='string'){        //hex - 保留注释
            [r,g,b]=hex2rgb_b(r);
        } else if (typeof r == 'object'){
            [r,g,b]=[r.r, r.g, r.b];
        }
    }
    
    if (r==255 && g==255 && b==255){
        return {h: 0, s: 0, l: 1};
    }
        
    return sub_HSVtoHSL_b(sub_RGBtoHSV_b(r,g,b));
}

function document_body_offsetHeight_b(){
    return document.documentElement.scrollHeight;
}

function div_title_href_id_b(item,id_list){
    var blhref_length=item[0].length;
    var bltitle_length=item[1].length;
    var a_name_asc=0;
    if (item[0]!==''){
        a_name_asc=asc_sum_b(item[0]); //依赖 klbase.js - 保留注释
    } else if (item[1]!==''){
        a_name_asc=asc_sum_b(item[1]);
    } else {
        a_name_asc=asc_sum_b(item[2].substring(0,20));
    }
    var bltype='t_';
    while (true){
        if (id_list.includes('t_'+blhref_length+'_'+bltitle_length+'_'+a_name_asc)){
            console.log(item[0],item[1],a_name_asc,a_name_asc+1); //此段显示 - 保留注释
            a_name_asc=a_name_asc+1;
            bltype='m_';
        } else {
            break;
        }
    }
    return bltype+blhref_length+'_'+bltitle_length+'_'+a_name_asc;
}

function div_title_href_b(item,csfsize='',underline=false,csid='',fnname='',item2_nofomat=false){ //依赖klbase_wiki.js - 保留注释
    if (csfsize===''){
        csfsize='1rem';
    }
    var bljg='';
    var review='';
    if (item[0]==''){
        if (item[1]!==''){
            bljg=bljg+'<span class="span_a_article_title_b" style="color:'+scheme_global['a']+'">'+item[1]+'</span> ';
        }
    } else {
        if (item[1]==''){
            bljg=bljg+'<a class="span_a_article_title_b" href="'+item[0]+'" target=_blank>'+item[0]+'</a> ';
        } else {
            bljg=bljg+'<a class="span_a_article_title_b" href="'+item[0]+'" target=_blank>'+item[1]+'</a> ';
        }
    }

    if (item.length>=3){
        if (item[2]!==''){
            if (item2_nofomat){
                var blcontent=item[2];
            } else {
                var blcontent=wiki_all_format_b(item[2],'',-1,underline);
            }
            if (csfsize!==false){
                blcontent='<span style="font-size:'+csfsize+';">'+blcontent+'</span>';            
            }
            bljg=bljg+blcontent;
        }
    }
    if (item.length>=4){
        if (item[3]!==''){
            review=wiki_all_format_b('{{span|t=l}}'+item[3]+'{{/span}}','',-1,underline); //ismobile
            if (csfsize!==false){
                review='<span style="font-size:'+csfsize+';">'+review+'</span>';
            }
            review=review+' ';
        }
    }
    bljg=review+bljg;
    if (bljg!==''){
        if (csid!==''){
            bljg=bljg+' <a href="#'+csid+'"';
            if (fnname!==''){
                bljg=bljg+' onclick="'+fnname+'(this.href);"';
            }
            bljg=bljg+'>'+(csid.substring('0,2')=='m_'?'🖇':'📎')+'</a>';
        }
        
        bljg='<div class="link_title">'+bljg+'</div>';
        
        if (csid!==''){
            bljg='<a name="'+csid+'"></a>'+bljg;
        }
    }
    return bljg;
}

function input_size_b(cslist,cstype='name',font_size=false,return_dom=false){
    //cslist: [ ["input_class0",8],["input_class",5,false], ["input_calculator",21,3], ]; - 保留注释
    //cstype name; id
    var is_mobile=ismobile_b(true);
    if (cstype=='name'){
        var querystr='input[name="';
        var querystr_end='"]';
    } else if (cstype=='id'){
        var querystr='input#';
        var querystr_end='';
    } else {
        return [];
    }
    
    var dom_list=[];
    for (let item of cslist){
        var oinput=document.querySelector(querystr+item[0]+querystr_end);
        if (oinput){
            if (item.length>=4){
                oinput.style.cssText=css_input_text_b(item[1],is_mobile,item[2],item[3],font_size);
            } else if (item.length>=3){
                oinput.style.cssText=css_input_text_b(item[1],is_mobile,item[2],'',font_size);
            } else {
                oinput.style.cssText=css_input_text_b(item[1],is_mobile,false,'',font_size);
            }
            if (return_dom){
                dom_list.push(oinput);
            }
        }
    }
    return dom_list;
}

function input_with_x_b(csid,cswidth,xid='',csexpand=false,regid=false,isreg=false,is_focus=false){
    //csexpand 可以是 数值型 - 保留注释
    var oinput=document.getElementById(csid);
    if (!oinput){return false;}
    
    var blcolor=(typeof scheme_global=='undefined'?'black':scheme_global['color']);
    oinput.outerHTML='<span style="border-bottom:0.1rem solid '+blcolor+';">'+oinput.outerHTML+'</span>';
    
    //以下一行必要 - 保留注释
    oinput=document.getElementById(csid);

    if (xid==''){
        xid=csid+'_x';
    }
    var inputx='<input type="button" value="❌" id="'+xid+'" onclick=\'document.getElementById("'+csid+'").value="";document.getElementById("'+csid+'").focus();\'>';
    
    oinput.insertAdjacentHTML('afterend',inputx);
    
    var input_list=[
    [csid,cswidth,csexpand,'border:0px'],
    [xid,2,csexpand,'border:0px;cursor:pointer;'],
    ];
    input_size_b(input_list,'id');

    var input_reg='';
    if (regid!==false){
        if (regid===''){
            regid=csid+'_reg'
        }
        input_reg=checkbox_kl_b(regid,'正则','',isreg);
    }
    if (input_reg!==''){
        oinput.parentNode.insertAdjacentHTML('afterend',' '+input_reg);
    }
    if (is_focus){
        oinput.focus();
    }
    return oinput;
}

function colors_menu_b(fn_name='change_colors_b',prefix_list=[]){
    var color_menu=[];
    var list_t=prefix_list.concat(popular_colors_b());
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        var split_t=item.split(',');
        color_menu.push('<span class="span_menu" onclick="'+fn_name+'(\''+item+'\');" style="color:'+split_t[0]+';background-color:'+split_t[1]+';">'+(blxl+1)+'. '+item+'</span>');
    }
    return color_menu;
}

function popular_colors_b(){
    return [
    "#000000,#ECE6F0,#9A0712",
    "#000000,#E3E1EA,#2B1E1A",
    "#01321B,#E2E9E8,#6A01F4",
    "#0436EB,#DDBBD4,#0F5133",
    "#050D00,#D7E7F3,#3E9FDB",  
    "#056ABE,#89D4DB,#056ABE",
    "#0665A9,#A2FCD1,#EC533D",
    "#072861,#BFCBC3,#EC6BA3",
    "#080823,#CBB9B1,#1D5D1E",
    "#090D3A,#41B5A1,#140544",
    "#094525,#8FCDA0,#486275",
    "#0A6778,#A3D5C1,#2005E0",
    "#0B0F0C,#77C0AD,#9A0712",
    "#0B2819,#60BCA5,#12A889",
    "#0B2823,#E7F2D9,#ABB7E4",
    "#0C0E27,#E0CCA4,#1EC309",
    "#0C1E1F,#9CC3C7,#F5A9FF",
    "#0D2636,#ACC1F9,#1D47A3",
    "#0E669A,#CED7CA,#DE7C45",
    "#101A23,#D5D1DA,#4C79A4",  
    "#102B3F,#C1BAAB,#49FE11",
    "#102B3F,#D4CFC4,#49FE11",
    "#105B7E,#71ADBE,#17C1E3",
    "#13201E,#DCE6EF,#D19C74",
    "#13396A,#CFBC73,#F94F7C",
    "#13678F,#EBF3F0,#92220D",
    "#151E1C,#B8E0DB,#7E7F66",
    "#173C4A,#95E7B0,#FB73EA",
    "#1A1A1A,#DBF1E3,black",
    "#1A3F26,#8BEC82,#13495E",
    "#1A7440,#ADCD8F,#2C451C",
    "#1B203D,#C1D4AD,#239A43",
    "#211CBE,#BFD5D1,#872975",
    "#264033,#DAEEF1,#9F8358",
    "#28C874,#243E54,#28DFBB",
    "#295B7A,#E9D3A2,#295B7A",
    "#296292,#B2CFB3,#119D55",
    "#2A2068,#E09DE3,#AB374C",
    "#2A719D,#98ADA0,#11917C",
    "#2B295F,#9BBAA5,#0A1E80",
    "#2B323F,#DEE9AE,#248BB0",
    "#2D5890,#95A992,#2B1C5C",
    "#320E14,#8DA67C,#0E8393",
    "#320E14,#F2F4F0,#0E8393",
    "#343B3C,#E9D5C5,#2D81C2",
    "#344621,#E0FFF8,#7B4BD5",
    "#344E59,#EEEADE,#FE5161",
    "#353431,#72C1A9,#8E7DF8",    
    "#39205D,#CAE0DD,#AA563F",
    "#3A4C72,#E8EDAD,#9E6D50",
    "#3D292D,#E5E5E5,#BCCC8E",
    "#3F205A,#9A96B6,#F2CAC4",
    "#415106,#A5B7D6,#415106",
    "#4379CA,#D1EED0,#22831A",
    "#47498B,#C7A09B,#AC6992",
    "#4980A2,#99BECE,#854E80",
    "#49F73C,#73153F,#ADFFF4",
    "#4C79A4,#D5D1DA,#4C79A4",
    "#4F6BAB,#D6C9C5,#61AF0A",
    "#534721,#CED7CA,#DE7C45",
    "#57492D,#E2F2EE,#53332E",
    "#57492D,#FCF6EC,#53332E",
    "#58C2F4,#5B5670,#C1A74F",
    "#59635B,#C1C3A5,#4F5A54",
    "#5C2E37,#DCE2D7,#5CDCD5",
    "#5C98CC,#0C2620,#048A34",
    "#5E463D,#92B8EF,#92154D",
    "#667354,#EFD09D,#2AA748",
    "#66AE77,#1D1629,#ECC8DC",
    "#71ECE3,#1671F5,#E3C2FA",
    "#774773,#86A7AD,#1A3964",
    "#7BE3F1,#4EACB2,#A0AE30",
    "#7E049E,#EEF0DB,#C6272E",
    "#80211F,#D0C5D0,#34BEF8",
    "#827197,#D9D3D1,#8AC7AD",
    "#82DABD,#7B0157,#00A786",
    "#845E6E,#D4B4CE,#191472",
    "#848794,#464593,#ED6CA5",
    "#8BD3D5,#054B75,#DA4C1C",
    "#8FD8E7,#090D77,#7456F3",
    "#92E4D1,#226CAE,#DF7974",
    "#937015,#02191D,#7B90F3",
    "#989B8A,#08172B,#CD990C",
    "#99A7E6,#48433A,#C35297",
    "#99E04A,#7D3D5D,#29E689",
    "#9AD8DE,#263A4D,#F9C54B",
    "#9D98A8,#093B95,#3391F5",
    "#9DD849,#2F322D,#BAFA84",
    "#9FD7E6,#2C3469,#E33F23",
    "#A0AAEF,#5C2CCB,#26A2A7",
    "#A2B7A3,#343A47,#299605",
    "#A5D6F4,#675F7A,#A6A2B2",
    "#A6A5BD,#322927,#38EA59",
    "#A6A7AF,#17605C,#F5CEC9",
    "#A8DFB6,#316981,#A5FAF3",
    "#AAA5AC,#1B1C47,#AAA5AC",
    "#AABBE6,#0E7095,#8FA589",
    "#ACF5DA,#5DAD8C,#801BE4",
    "#B10353,#D6F6B4,#0B2FD4",
    "#B1D149,#540219,#A7C240",
    "#B28626,#181726,#C6AACD",    
    "#B2C7C2,#333333,pink",
    "#B59DA0,#4B314D,#F5962E",
    "#B7D079,#1A4578,#22B5A8",
    "#B9BBEE,#6E4D7B,#662C1D",
    "#B9D1C3,#69797B,#FC2F0A",
    "#BA9A3E,#413E29,#E09997",
    "#BAA12C,#50656B,#1DD8F5",
    "#BAA253,#284734,#833FF2",    
    "black,#33C195,#1F110F",
    "black,ivory,#0707bb",
    "black,white,#E90255",
    "#C1D956,#1F173F,#79FF84",
    "#C2C9B8,#4A7546,#9DEDCC",
    "#C2FFFF,#057964,#C4AE58",
    "#C5F8FD,#527595,#9BF27E",
    "#C6A7BD,#3E2B24,#C6A6BD",
    "#C6E3EB,#677295,#130B4A",
    "#C71B59,#1e1925,#8BDBBA",
    "#C7A407,#375D71,#E9ED86",
    "#C7B6A5,#3D175A,#E6D4FB",
    "#C8C2B5,#212B3D,#91C0DE",
    "#C8D6AA,#984967,#C07CE1",
    "#C98A5B,#02160C,#CB1D67",
    "#C9A01D,#264B23,#E8F318",
    "#C9AC7B,#2F555F,#846E5A",
    "#CFBB20,#049D96,#DD2CBE",
    "#CFE1FC,#574D7F,#005BA4",
    "#CFFCF7,#041D32,#B09043",    
    "#D0BDC7,#110E41,#D0BDC7",
    "#D3A58B,#03406F,#89A6EF",
    "#D5D8F6,#082D4A,#90FAEE",    
    "#D86207,#0A031E,#044BBA",
    "#D8F3E6,#298C2E,#E1C419",
    "#DAC390,#097EA5,#80E811",
    "#DAFCCF,#200330,#F54BAD",
    "#DF8A43,#31365C,#45F392",
    "#E09DE5,#722372,#0A9CF0",
    "#E0D4F7,#0E2D3B,#2C1FC7",
    "#E4D1DC,#000803,#AF6EB4",
    "#E4E1EE,#933B6E,#E4E1EE",
    "#E4EAE1,#173F45,#4A0653",
    "#E5E5E5,#333333,#0707bb",
    "#E5E5E5,#3D5363,#46AF6E",
    "#E5E5E5,#3F8D6B,#F304D4",
    "#E6D565,#480FAE,#14FCD9",
    "#E8CB72,#4457ED,#EECE6C",
    "#E9EFDC,#404E59,#7B6FD1",
    "#EAEFE4,#6777AC,#033326",
    "#EBE1E0,#811826,#1320B5",
    "#EC7703,#37036C,#D13124",
    "#ED363F,#13183F,#1EA143",
    "#EDD8B1,#BB5857,#A2D2C5",
    "#F3EDD8,#2F3736,#8765A8",
    "#F4CC8E,#E70C1B,#E2E063",
    "#F6693B,#313E45,#9C5BB4",
    "#F8DCD1,#477192,#C1FDC9",
    "#F9BEB4,#A52E55,#F41281",
    "#F9CC8F,#62213B,#D0AD0F",
    "#FC99CB,#523270,#D2B9E2",
    "#FDDDF1,#2695A0,#C654E7",
    "#FFEA77,#25565C,#4FA96A",
    "#FFFFFF,#046295,#233610",
    "#FFFFFF,#154151,#233169",
    "#FFFFFF,#172C2A,#74854D",    
    "#FFFFFF,#26403B,#B27B8F",
    "#FFFFFF,#2A82A2,#233169",
    "#ffffff,#37342F,#703AF3",    
    "#FFFFFF,#45455F,#0B31D2",
    "#FFFFFF,#566778,#81B538",    
    "indigo,ivory",
    "white,#8B7A76,#DAD6E2",
    "white,black,white",

    ];
}

function localstorage_value_load_save_b(cs_id_list,cs_checkbox_list,savename,cstype){
    //cs_id_list 形如 ['input_fcolor', 'input_bcolor']; 或为 字符串，代表 id - 保留注释
    //csprefix 为前缀字符串 - 保留注释 
    if (cstype=='save'){
        if (confirm('是否保存？')){
            if (Array.isArray(cs_id_list)){
                var blpara=[];
                for (let item of cs_id_list){
                    blpara.push(document.getElementById(item).value);
                }
                for (let item of cs_checkbox_list){
                    blpara.push(checkbox_kl_value_b(item)?1:0);
                }
                var bljg=blpara.join(' /// ');  //不能使用英文逗号，因为字体名称中可能会有英文逗号 - 保留注释
            } else {
                var bljg=document.getElementById(cs_id_list).value;
            }
            localStorage.setItem(savename,bljg);
        }
    } else if (cstype=='load'){
        var bljg=local_storage_get_b(savename);
        if (Array.isArray(cs_id_list)){
            var list_t=bljg.split(' /// ');
            if (list_t.length==cs_id_list.length+cs_checkbox_list.length){
                for (let blxl=0,lent=cs_id_list.length;blxl<lent;blxl++){
                    document.getElementById(cs_id_list[blxl]).value=list_t[blxl];
                }
                var bllen=cs_id_list.length;
                for (let blxl=0,lent=cs_checkbox_list.length;blxl<lent;blxl++){
                    checkbox_kl_color_b(cs_checkbox_list[blxl],list_t[bllen+blxl]);
                }
            } else {
                console.log(list_t.length,cs_id_list.length,cs_checkbox_list.length,bljg); //此行保留 - 保留注释
            }
        } else {
            document.getElementById(cs_id_list).value=bljg;
        }
    }
}

function highlight_oblong_span_b(ospan,ishover=true,cscolor=''){
    if (ishover){
        ospan.style.color=scheme_global['a-hover'];
        ospan.style.boxShadow='0.1rem 0.1rem 0.1rem '+scheme_global['shadow'];
    } else {
        ospan.style.color=cscolor;
        ospan.style.boxShadow='';
    }
}

function mouseover_mouseout_oblong_span_b(ospans){
    for (let one_span of ospans){
        one_span.setAttribute('onmouseover','highlight_oblong_span_b(this);');
        one_span.setAttribute('onmouseout','highlight_oblong_span_b(this,false,\''+one_span.style.color+'\');');
        one_span.style.cursor='pointer';
    }
}

function recent_search_b(localsavename,csstr,jsfunctionname,divname,commonlist=[],csmax=15,return_with_p=true,show_items=-1,remove_reg_str=''){
    function sub_recent_search_b_one_key(item,jsfunctionname,cssquash){
        var str_t=item.replace(/\\/g,'\\\\');
        str_t=str_t.replace(new RegExp('"','g'),'&quot;');
        str_t=str_t.replace(new RegExp("'",'g'),'\\\'');
        if (str_t.trim()==''){
            return '';
        }
        if (cssquash && item.length>100){
            item=specialstr_html_b(item.slice(0,50))+'<span class="span_recent_search_squash_container">...<span class="span_recent_search_squash_content" style="display:none;">'+specialstr_html_b(item.slice(50,-50))+'</span></span>'+specialstr_html_b(item.slice(-50,));
        } else {
            item=specialstr_html_b(item);
        }
        return '<span class="oblong_box" onclick="'+jsfunctionname+'(\''+str_t+'\');">'+item+'</span>&nbsp;'; //不能使用空格，而应该使用 &nbsp; - 保留注释
    }
    
    function sub_recent_search_b_key_replace(csstr){
        csstr=csstr.trim().replace(new RegExp('<','g'),'&lt;');
        csstr=csstr.replace(new RegExp('>','g'),'&gt;');
        if (csstr=='(:r)'){
            csstr='';
        }
        return csstr;
    }
    //-----------------------
    if (Array.isArray(csstr)){
        for (let blxl=0,lent=csstr.length;blxl<lent;blxl++){
            csstr[blxl]=sub_recent_search_b_key_replace(csstr[blxl]);
        }
        var list_t=[];
        for (let item of csstr){
            if (item=='' || list_t.includes(item)){continue;}
            list_t.push(item);
        }
        csstr=list_t;
    } else {
        csstr=sub_recent_search_b_key_replace(csstr);
    }

    var recent_search=[];
    if (localsavename!==''){    //当为空时，仅发布到 html，不操作缓存 - 保留注释
        if (remove_reg_str!==''){
            recent_search=local_storage_get_b(localsavename,csmax,true,remove_reg_str,true);
            localStorage.setItem(localsavename,recent_search.join('\n'));   //此处长度缩短 - 保留注释
        }
        recent_search=local_storage_get_b(localsavename,csmax,true,csstr);
    }
    
    var old_search_len=recent_search.join('\n').length;
    var is_changed=false;
    if (csstr.length>0){
        if (Array.isArray(csstr)){
            recent_search=csstr.concat(recent_search);
        } else {
            recent_search=[csstr].concat(recent_search);
        }
        is_changed=true;
    }
    
    for (let item of commonlist){
        item=item.replace(new RegExp('<','g'),'&lt;');
        item=item.replace(new RegExp('>','g'),'&gt;');
        if (recent_search.includes(item)){continue;}
        recent_search.push(item);
        is_changed=true;
    }
    
    if (is_changed){
        var blstr=recent_search.join('\n');
        if (blstr.length<5000 || old_search_len>=blstr.length){  //储存长度不超过5000 或 新的存储长度小于旧的存储长度 - 保留注释
            if (localsavename!==''){
                localStorage.setItem(localsavename,blstr);
            }
        } else {
            console.log('remove',recent_search.shift());    //删除第一个（刚刚添加的）元素 - 保留注释
            console.log('remove',recent_search.pop());    //删除最后一个元素 - 保留注释
            if (localsavename!==''){
                localStorage.setItem(localsavename,recent_search.join('\n'));            
            }
        }
    }
    
    var recent_search_str='';
    if (return_with_p){
        recent_search_str='<p>';
    }
    
    if (show_items==-1){
        show_items=(ismobile_b()?5:10);
    }
    show_items=Math.min(recent_search.length,show_items);
   
    var recent_search_str2='';
    for (let blxl=show_items,lent=recent_search.length;blxl<lent;blxl++){
        recent_search_str2=recent_search_str2+sub_recent_search_b_one_key(recent_search[blxl],jsfunctionname,true);
    }
    
    var do_squash=false;
    if (recent_search_str2!==''){
        recent_search_str2='<span class="oblong_box" onclick="recent_search_full_content_b(this);" style="margin-right:0.2rem;"> ... </span><span class="span_recent_search_more" style="display:none;word-break:break-all;word-wrap:break-word;">'+recent_search_str2+'</span>';
        do_squash=true;
    }

    for (let blxl=0;blxl<show_items;blxl++){
        recent_search_str=recent_search_str+sub_recent_search_b_one_key(recent_search[blxl],jsfunctionname,do_squash);
    }
        
    recent_search_str=recent_search_str+recent_search_str2;
    if (return_with_p){
        recent_search_str=recent_search_str+'</p>';
    }
    if (divname!==''){
        var odiv=document.getElementById(divname);
        if (odiv){
            odiv.innerHTML=recent_search_str;
            mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
        }
    }
    return recent_search_str;
}

function recent_search_full_content_b(ospan){
    var odiv=ospan.parentNode;
    odiv.querySelector('span.span_recent_search_more').style.display='';
    ospan.outerHTML='';
    var ospans=odiv.querySelectorAll('span.span_recent_search_squash_container');
    for (let one_span of ospans){
        var ocontent=one_span.querySelector('span.span_recent_search_squash_content');
        one_span.outerHTML=ocontent.innerHTML;
    }
}

function page_one_b(pages_count,cspageno,current_no,span_script,show_number=3,interval_number=5,classname='aclick',show_page_no_list=[]){
    //pages_count 总页数；cspageno 加亮页号；current_no 当前循环页号；span_script 执行代码 - 保留注释
    var page_html='';
    if (current_no>1 && current_no<pages_count && Math.abs(cspageno-current_no)>show_number && current_no>show_number && pages_count-current_no>show_number && !show_page_no_list.includes(current_no)){
        if (interval_number<=0 || current_no % interval_number !==0){
            page_html=page_html+'. . . ';
            return page_html;
        }
    }
    page_html=page_html+'<span class="'+classname+'" '+span_script+'>';
    if (current_no==cspageno){
        page_html=page_html+'<font class="font_current_no_b" color="'+scheme_global['a-hover']+'">'+current_no+'</font>';
    } else {
        page_html=page_html+current_no;
    }
    page_html=page_html+'</span> ';
    return page_html;
}

function page_prev_next_b(pages_count,cspageno,span_script_prev,span_script_next,span_script_location='',classname='aclick'){
    if (pages_count<=1){return '';}
    //pages_count 总页数；cspageno 加亮页号；span_script 执行代码 - 保留注释
    var page_html='';
    page_html=page_html+'<span class="'+classname+'" '+span_script_location+'>locate</span> ';
    
    if (cspageno>1){
        page_html=page_html+'<span class="'+classname+'" '+span_script_prev+'>prev</span> ';
    } else {
        page_html=page_html+'<span class="'+classname+'" style="color:'+scheme_global['memo']+';">prev</span> ';
    }
    if (cspageno<=pages_count-1){
        page_html=page_html+'<span class="'+classname+'" '+span_script_next+'>next</span> ';
    } else {
        page_html=page_html+'<span class="'+classname+'" style="color:'+scheme_global['memo']+';">next</span> ';
    }
    return page_html;
}

function page_location_b(cspages){
    var blno=parseInt((prompt('输入页号',cspages) || '').trim());
    if (isNaN(blno)){return false;}
    return Math.min(cspages,Math.max(1,blno));
}

function page_remove_dot_b(page_html){
    while (page_html.includes('. . . . ')){
        page_html=page_html.replace(/(\. ){4}/g,'. . . ');
    }
    var blfound=page_html.includes('. . . ');   //3点，非4点 - 保留注释    
    return [page_html,blfound];
}

function page_p_style_b(){
    return 'margin-top:0.5rem;margin-bottom:0.5rem;line-height:2rem;font-size:1rem;';
}

function page_combination_b(cslen,rows_per_page,csno,page_fn,locate_fn,p_style=false,show_number=4,interval_number=10,p_class='',button_class='oblong_box',first_page_no=1,has_right_part=true,rand_page_no_list=[]){
    if (cslen<=rows_per_page){return '';}
    var pages=Math.ceil(cslen/rows_per_page);
    var bljg='';
    
    if (!page_fn.includes('(')){
        page_fn=page_fn+'(';
    }
    if (!locate_fn.includes('(')){
        locate_fn=locate_fn+'(';
    }
    
    var fn_right_part=(has_right_part?', '+rows_per_page+')':')');
    
    if (first_page_no==1){
        for (let blxl=1;blxl<=pages;blxl++){
            bljg=bljg+page_one_b(pages,(csno-1)/rows_per_page+1,blxl,'onclick="'+page_fn+((blxl-1)*rows_per_page+1)+fn_right_part+';"',show_number,interval_number,button_class,rand_page_no_list);
        }
    } else {
        for (let blxl=0;blxl<pages;blxl++){
            bljg=bljg+page_one_b(pages,csno/rows_per_page+1,blxl+1,'onclick="'+page_fn+(blxl*rows_per_page)+fn_right_part+';"',show_number,interval_number,button_class,rand_page_no_list);
        }    
    }
    
    var blfound;
    [bljg,blfound]=page_remove_dot_b(bljg); 
    if (blfound){
        bljg=bljg+page_prev_next_b(pages,(first_page_no==1?csno-1:csno)/rows_per_page+1,' onclick="'+page_fn+(csno-rows_per_page)+fn_right_part+';"','onclick="'+page_fn+(csno+rows_per_page)+fn_right_part+';"',' onclick="'+locate_fn+pages+fn_right_part+';"',button_class);
    }
    
    if (p_style=='WITHOUT P'){
        return bljg;
    }
    
    if (p_style==false){
        p_style=page_p_style_b();
    }
    bljg='<p '+(p_class==''?'':'class="'+p_class+'" ')+'style="'+p_style+'">'+bljg+'</p>';
    
    return bljg;
}

function emoji_category_b(cstype,csno=false){
    var list_t=[];
    if (cstype.includes('vegetable')){
        list_t=list_t.concat(['💐','🌸','💮','🏵','🌹','🥀','🌺','🌻','🌼','🌷','🌱','🌲','🌳','🌴','🌵','🌾','🌿','☘','🍀','🍁','🍂','🍃','🍇','🍈','🍉','🍊','🍋','🍌','🍍','🥭','🍎','🍏','🍐','🍑','🍒','🍓','🥝','🍅','🥥','🥑','🍆','🥔','🥕','🌽','🌶','🥒','🥬','🥦','🧄','🧅','🍄','🥜','🌰']);
    }
    if (cstype.includes('food')){
        list_t=list_t.concat(['🍞','🥐','🥖','🥨','🥯','🥞','🧇','🧀','🍖','🍗','🥩','🥓','🍔','🍟','🍕','🌭','🥪','🌮','🌯','🥙','🧆','🥚','🍳','🥘','🍲','🥣','🥗','🍿','🧈','🧂','🥫','🍱','🍘','🍙','🍚','🍛','🍜','🍝','🍠','🍢','🍣','🍤','🍥','🥮','🍡','🥟','🥠','🥡','🦀','🦞','🦐','🦑','🦪','🍦','🍧','🍨','🍩','🍪','🎂','🍰','🧁','🥧','🍫','🍬','🍭','🍮','🍯','🍼','🥛','☕','🍵','🍶','🍾','🍷','🍸','🍹','🍺','🍻','🥂','🥃','🥤','🧃','🧉','🧊','🥢','🍽','🍴','🥄','🔪','🏺']);
    }
    if (cstype.includes('animal')){
        list_t=list_t.concat(['🦧','🐀','🐁','🐂','🐃','🐄','🐅','🐆','🐇','🐈','🐉','🐊','🐋','🐌','🐍','🐎','🐏','🐐','🐑','🐒','🐓','🐔','🐕','🐖','🐗','🐘','🐙','🐚','🐛','🐜','🐝','🐞','🐟','🐠','🐡','🐢','🐣','🐤','🐥','🐦','🐧','🐨','🐩','🐪','🐫','🐬','🐭','🐮','🐯','🐰','🐱','🐲','🐳','🐴','🐵','🐶','🐷','🐸','🐹','🐺','🐻','🐼','🐽','🐾','🐿','🕊','🕷','🕸','🦁','🦂','🦃','🦄','🦅','🦆','🦇','🦈','🦉','🦊','🦋','🦌','🦍','🦎','🦏','🦮','🦝','🦓','🦙','🦒','🦛','🦔','🦥','🦦','🦨','🦘','🦡','🦢','🦩','🦚','🦜','🦕','🦖','🦗','🦟','🦠','🙈','🙉','🙊']);
    }
    if (cstype.includes('transport')){
        list_t=list_t.concat(['🚀','🚁','🚂','🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚋','🚌','🚍','🚎','🚏','🚐','🚑','🚒','🚓','🚔','🚕','🚖','🚗','🚘','🚙','🚚','🚛','🚜','🚝','🚞','🚟','🚠','🚡','🚢','🚣','🚤','🚥','🚦','🚧','🚨','🚲','🚳','🚴','🚵','🚶','🚷','🚸','🌎','🌋','🗻','🏝','🏞','🏟','🧱','🏦','🏭','🏯','🏰','💒','🗼','🗽','🕌','🛕','⛩','⛲','⛺','🎠','🎡','🎢','🛵','🛺','🛴','⚓','🪂','🛰','🛸','🧳','🌑','🌕','🌙','🌡','🌝','🌞','🪐','🌀','🌈','🌂','☔','⛄','🔥','🌊']);
    }
    
    if (cstype.includes('human')){
        list_t=list_t.concat(['💩','🤡','👹','👺','👻','👽','👾','🤖','😤','😡','😠','🤬','😈','👿','💀','☠','😱','😎','🤓','🧐','🤠','🥳','🥸','🤢','🥵','🥶','💅','🧠','🦷','🦴','👀','👁','👅','👄','💂','👣','🎃','🎄','🎋','🎎','🎏','🎐','🏆','🏅','⚽','🏀','🏈','🎳','🏓','🏸','🥊','🥋','🤿','🥌','🎯','🪁','🔮','🎮','🎲','🧩','🀄','🧶','👓','🦺','👖','🧣','🧥','🧦','👗','🥻','🩱','🩲','👜','🎒','🥾','👠','👒','🧢','💄','📻','🎷','🎸','🎺','🎻','🪕','🥁','🎬','🔦','🏮','🪔','🔫','🏹','🧬','🔬','🔭','💊','🩹','🩺','🪑','🚽','🚿','🪒','🧷','🧻','🗿']);
    }
    
    if (list_t.length==0){
        list_t=[''];
    }
    
    if (csno===-1){
        list_t.sort(randomsort_b);
        return list_t[0];
    } else if (csno<-1){
        return list_t;
    } else {
        csno=csno % list_t.length;
        return list_t[csno];
    }
}

function root_font_size_change_b(change_value=0,csask=false){
    var increment=parseFloat(local_storage_get_b('root_font_size_increment'));
    if (isNaN(increment)){
        increment=0;
    }
    if (change_value===false){
        change_value=-1*increment;
    }
    
    var root = document.querySelector(':root');
    var oldsize=parseFloat(root.style.fontSize.trim().split('px')[0]);
    
    if (csask){
        var newsize=parseFloat((prompt('输入字号大小',oldsize) || '').trim());
        if (isNaN(newsize)){return;}
        
        increment=newsize-(oldsize-increment);
        root.style.fontSize=newsize.toFixed(2)+'px';
    } else {
        increment=increment+change_value;
        root.style.fontSize=(oldsize+change_value).toFixed(2)+'px';
    }
    localStorage.setItem('root_font_size_increment',increment);
}

function menu_parent_node_b(nodestr){
    return nodestr.replace('.parentNode.','.parentNode.parentNode.');
}

function menu_container_b(nodestr,cslist,caption=''){
    var blparent=menu_parent_node_b(nodestr);
    var result_t=[];
    for (let item of cslist){   //[caption,onclick,add_parent_node,span_id] - 保留注释
        var id_str='';
        if (item.length>=4){
            if (item[3]!==''){
                id_str='id="'+item[3]+'" ';
            }
        }
        var js_str=(item[2]?blparent:'')+item[1];
        js_str=(js_str==''?'':' onclick="'+js_str+'"');

        var blstr='<span '+id_str+'class="span_box_strong span_menu_container_item"'+js_str+'>'+item[0]+'</span>';            
        result_t.push(blstr);   //item[1] 不能添加 specialstr_j - 保留注释
    }
    return '<span class="span_menu_container">'+caption+result_t.join(' ')+'</span>';
}

function root_font_size_menu_b(csstr='',font_menu=true,full_screen_menu=true,remote_host_address=false,location_href_menu=true,fn_source_textarea_id=''){
    var list_t=[];
    if (font_menu){
        var font_list=[
        ['➕','root_font_size_change_b(0.5);',false],
        ['➖','root_font_size_change_b(-0.5);',false],
        ['default','root_font_size_change_b(false);',true],
        ['set','root_font_size_change_b(0,true);',true],
        ];    
        list_t.push(menu_container_b(csstr,font_list,'font size: '));
    }
    if (full_screen_menu){
        list_t.push('<span class="span_menu" onclick="'+csstr+'body_fullscreen_b();">fullscreen</span>');
    }
    if (remote_host_address){
        list_t.push('<span class="span_menu" onclick="'+csstr+'kl_remote_host_address_b();">set form post address</span>');
    }
    if (location_href_menu){
        list_t.push('<span class="span_menu" onclick="'+csstr+'window.open(location.href);copy_2_clipboard_b(location.href);">location.href</span>');   //移动端复制失败 - 保留注释
    }
    if (fn_source_textarea_id!==''){
        list_t.push('<span class="span_menu" onclick="'+csstr+'fun_soruce_show_b(\''+fn_source_textarea_id+'\');">function source</span>');        
    }
    return list_t;
}

function body_fullscreen_b(){
    if (document.fullscreenElement==null){
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function change_colors_b(csstr){
    if (csstr.includes('.')){
        csstr=csstr.substring(csstr.indexOf('.')+1,);
    }
    if (csstr=='' || csstr=='default'){
        csstr='black,white';
    }    
    var list_t=csstr.split(',');
    if (list_t.length>=2){
        scheme_global['color']=list_t[0].trim();
        scheme_global['background']=list_t[1].trim();
        scheme_generation_b();
    }
    var obody=document.querySelector('body');
    obody.style.color=scheme_global['color'];
    obody.style.backgroundColor=scheme_global['background'];
}

function obj_search_show_hide_b(objs,subobj_querystr='',cskey='',csreg=false,checkreg=false,get_html=false){  
    //#filter #ol - 保留注释
    if (checkreg){
        if (cskey.slice(-4,)=='(:r)'){
            csreg=true;
            cskey=cskey.slice(0,-4).trim();
        }
    }
    if (cskey==''){
        for (let item of objs){
            item.style.display='';
        }
        if (objs.length>0){
            return [objs.length,objs[0]];
        } else {
            return [objs.length,false];
        }
    }
    
    var blcount=0;
    var first_dom=false;
    for (let item of objs){
        var bltext='';
        if (subobj_querystr==''){
            if (get_html){
                bltext=item.innerHTML.trim();            
            } else {
                bltext=item.innerText.trim();
            }
        } else {
            var osub=item.querySelector(subobj_querystr);
            if (osub){
                if (get_html){
                    bltext=osub.innerHTML.trim();
                } else {
                    bltext=osub.innerText.trim();
                }
            }
        }
        var blfound=str_reg_search_b(bltext,cskey,csreg);
        if (blfound==-1){break;}
        if (blfound){
            item.style.display='';
            if (blcount==0){
                first_dom=item;
            }
            blcount=blcount+1;
        } else {
            item.style.display='none';
        }
    }
    return [blcount,first_dom];
}

function sound_b(cstype){
    var sfile=klwebphp_path_b('sound/'+cstype+'.wav');
    if (sfile===false && location.href.includes('/html/')){ //for git remote address - 保留注释
        sfile='../hard_ln_io/sound/'+cstype+'.wav';
    }
	var audio = new Audio(sfile);
	audio.play();
}

function alarm_interval_sound_b(){
    function sub_alarm_interval_sound_b_next(){
        if (typeof(kl_alarm_obj_global)!=='undefined'){
            clearInterval(kl_alarm_obj_global);
        }
        var blm=date_2_ymd_b(false,'M');    //当前分钟 - 保留注释
        var bls=date_2_ymd_b(false,'s');    //当前分钟已度过的秒数 - 保留注释
        if (kl_alarm_start_time_global===-1){
            kl_alarm_start_time_global=new Date().getTime()+(5 - blm % 5)*60*1000-bls*1000;   //先转到 5 或 0 分钟处 - 保留注释
            console.log('alarm_interval_sound_b','start time',new Date(kl_alarm_start_time_global));
        }
        
        var blminutes=(new Date().getTime()-kl_alarm_start_time_global)/1000/60;
        if (blminutes<0){
            var blinterval=Math.abs(blminutes)+kl_alarm_interval_global;
        } else {
            var m_times=blminutes/kl_alarm_interval_global;
            var blinterval=kl_alarm_interval_global-(m_times-Math.floor(m_times))*kl_alarm_interval_global;
        }
        console.log('alarm_interval_sound_b', new Date(),Math.floor(blinterval)+'m'+((blinterval-Math.floor(blinterval))*60).toFixed(3)+'s');
        kl_alarm_obj_global=setInterval(alarm_interval_sound_b,blinterval*60*1000); 
        
        //var blinterval=kl_alarm_interval_global - blm % kl_alarm_interval_global;   //下一次播放剩余分钟 - 保留注释
        //kl_alarm_obj_global=setInterval(alarm_interval_sound_b,Math.max(0,blinterval*60*1000-bls*1000));   //不能使用setTimeout，有可能重复运行 - 保留注释
    }
    
    function sub_alarm_interval_sound_b_one_sound(){
        if (kl_alarm_interval_global==-1){  //全局变量 - 保留注释
            return;
        }
        if (blxl>=sound_type.length){
            sub_alarm_interval_sound_b_next();
            return;
        }
        sound_b(sound_type[blxl]);
        blxl=blxl+1;
        setTimeout(sub_alarm_interval_sound_b_one_sound,1000);  //间隔1秒播放 - 保留注释
    }
    //-----------------------
    if (kl_alarm_interval_global==-1){return;}
    
    var sound_list=['elephant','ding','drop','flash','whistle','dududu'];
    var blm=date_2_ymd_b(false,'M');
    if (blm % 5 == 0 && kl_alarm_start_time_global!==-1){
        var blstr=('0'+blm).slice(-2,);
        var sound_type=[sound_list[parseInt(blstr.slice(0,1))],sound_list[parseInt(blstr.slice(-1,))]];
        var blxl=0;
        sub_alarm_interval_sound_b_one_sound();
    } else {
        sub_alarm_interval_sound_b_next();
    }
}

function alarm_interval_set_b(csinterval=5){
    if (csinterval==0){
        if (typeof(kl_alarm_interval_global) == 'undefined'){
            var blvalue='5';
        } else {
            var blvalue=Math.max(5,parseInt(kl_alarm_interval_global));
        }
        csinterval=prompt('输入整点报时时间间隔，须能被5整除，取消报时输入任意不符合要求数字',blvalue);
        if (csinterval==null){return;}
        csinterval=parseInt(csinterval.trim());
    }
    if (isNaN(csinterval) ||  csinterval % 5 !== 0){
        if (typeof(kl_alarm_obj_global)!=='undefined'){    //全局变量
            clearInterval(kl_alarm_obj_global);
        }
        kl_alarm_interval_global=-1;
        kl_alarm_start_time_global=-1;
        console.log('整点报时停止');
        return;
    }
    console.log('整点报时('+csinterval+')开始');
    kl_alarm_interval_global=csinterval;    //全局变量 - 保留注释
    kl_alarm_start_time_global=-1;
    alarm_interval_sound_b();
}

function select_option_numbers_b(cslen,batch_open_num){
    var bljg='<option value=-1></option>\n';
    for (let blxl=0;blxl<Math.ceil(cslen/batch_open_num);blxl++){
        bljg=bljg+'<option value='+(blxl*batch_open_num)+'>'+(blxl*batch_open_num+1)+' - '+Math.min(cslen,((blxl+1)*batch_open_num))+'</option>\n';
    }
    return bljg;
}

function list_2_option_b(cslist,select_id=''){
    var option_t=[];
    for (let item of cslist){
        option_t.push('<option>'+item+'</option>');
    }
    if (select_id!==''){
        return '<select id="'+select_id+'">'+option_t.join('\n')+'</select>';
    } else {
        return option_t;
    }
}

function highlight_obj_b(obj,search_str,new_str){
    if (search_str==''){return 0;}
    var old_txt=obj.innerText;
    var old_html=obj.innerHTML;
    try {
        if (old_html.match(search_str)==null){return 0;}
        var new_html=old_html.replace(new RegExp(search_str,'g'),new_str);
    } catch (error){
        console.log(error.message);
        return -1;
    }
    
    obj.innerHTML=new_html;
    if (obj.innerText!==old_txt){
        obj.innerHTML=old_html;
        return false;
    }
    return true;
}

function highlight_text_b(cswordlist=[],query_str='',is_async=false,run_fn=false){
    function sub_highlight_text_b_run(){
        if (typeof run_fn == 'function'){
            run_fn();
        }    
    }
    
    function sub_highlight_text_b_one(){
        if (blno>=blcount){
            console.log('highlight_text_b() 关键字加亮',(is_async?'异步模式':'同步模式'),blkey2,'费时：'+(performance.now() - t0) + ' milliseconds');
            sub_highlight_text_b_run();
            return;
        }
        
        var one_dom=ospans[blno];
        var old_text=one_dom.innerText;
        var old_html=one_dom.innerHTML;
        var new_html=old_html;
        for (let blxl=0;blxl<bllen;blxl++){
            var one_key=blkey2[blxl];
            if (old_text.includes(one_key)){
                if (reg_error){
                    new_html=new_html.replace(one_key,'<span class="span_key_highlight" style="font-weight:bold;background-color:'+highlight_color_b(blxl)+';">'+one_key+'</span>');
                } else {
                    new_html=new_html.replace(new RegExp(one_key,'g'),'<span class="span_key_highlight" style="font-weight:bold;background-color:'+highlight_color_b(blxl)+';">'+one_key+'</span>');
                }
            }
        }
        one_dom.innerHTML=new_html;
        if (one_dom.innerText!==old_text){
            one_dom.innerHTML=old_html;
        }
                
        blno=blno+1;
        if (is_async && blno % 500 == 0){
            setTimeout(sub_highlight_text_b_one,1);
        } else {
            sub_highlight_text_b_one();
        }
    }
    
    var ohighlight=document.getElementById('input_highlight');
    if (ohighlight){
        if (document.getElementById('input_highlight').checked==false){
            console.log('highlight_text_b() 关键字加亮',(is_async?'异步模式':'同步模式'),'input_highlight 未选中');
            sub_highlight_text_b_run();
            return;
        }
    }

    var t0 = performance.now();

    var reg_error,blkey2;
    [reg_error,blkey2]=search_key_split_b(cswordlist);
    var bllen=blkey2.length;
    
    if (bllen==0){
        console.log('highlight_text_b() 关键字加亮',(is_async?'异步模式':'同步模式'),'key 长度为 0');
        sub_highlight_text_b_run();
        return;
    }
    
    if (query_str=='' || query_str===false){
        query_str='div#divhtml p span.txt_content, div#divhtml li span.txt_content';
    } 
    
    if (typeof query_str == 'string'){
        var ospans=document.querySelectorAll(query_str);        
    } else {
        var ospans=query_str;
    }
    
    var blno=0;
    var blcount=ospans.length;
    sub_highlight_text_b_one();
}

function highlight_color_b(csxl){
    var blcolor=['pink','skyblue','selection'][csxl % 3];
    return scheme_global[blcolor];
}

function select_prev_or_next_b(oselect,cstype,filter_visible=false){
    var bldone=false;
    while (true){
        bldone=false;
        if (oselect.selectedIndex>0 && cstype=='p'){
            oselect.selectedIndex--;            
            bldone=true;
        } else if (oselect.selectedIndex<oselect.length-1 && cstype=='n'){
            oselect.selectedIndex++;
            bldone=true;
        }
        if (bldone==false){break;}
        if (filter_visible && oselect[oselect.selectedIndex].style.display=='none'){continue;}
        break;
    }
    return bldone;
}

function select_first_visible_option_b(oselect,ooptions=false){
    if (ooptions===false){
        ooptions=oselect.querySelectorAll('option');
    }
    
    for (let blxl = 0,lent= ooptions.length; blxl<lent; blxl++){
        if (ooptions[blxl].style.display == 'none'){continue;}
        oselect.selectedIndex = blxl;
        break;
    }
}

function character_2_icon_b(csstr,cssize=24,line_width=5,mobile_style=true,change_ico=true,csfill='#cecece'){
    function sub_character_2_icon_b_num_get(csstr){
        if (isNaN(csstr)){
            csstr=asc_sum_b(csstr); //如果 csstr 为空，返回 0 - 保留注释
        } else {
            csstr=parseInt(csstr);    
        }
        return csstr;
    }
    //-----------------------
    var ocanvas = document.createElement('canvas');
    ocanvas.setAttribute('width',cssize);
    ocanvas.setAttribute('height',cssize);

    var ctx = ocanvas.getContext('2d');

    ctx.fillStyle = csfill;
    ctx.fillRect(0, 0, ocanvas.width, ocanvas.height);

    if (mobile_style && ismobile_b()){
        ctx.globalAlpha = 0.8; // 设置透明 - 保留注释
        ctx.lineWidth = line_width;
        var color_list=['red','brown','green','black','grey','blue','orange'];

        var last_ip='00'+location.host.split(':')[0].split('.').slice(-1)[0];   //如 00io - 保留注释
        //last_ip.slice(-1) 形如 o - 保留注释
        //last_ip.slice(-2,-1) 形如i，可能为空 - 保留注释
        var blno_end=sub_character_2_icon_b_num_get(last_ip.slice(-1));
        var blno_second=sub_character_2_icon_b_num_get(last_ip.slice(-2,-1));
        
        var blhost_all=sub_character_2_icon_b_num_get(location.host);
        
        var dash_list=[[],[],[],[]];
        var selected_color=['','','',''];
        if (blno_end % 2 == 0){
            dash_list[0]=[2,2]; //上边框
            //dash_list[2]=[2,2]; //下边框 - 此行保留 - 保留注释
        }
        
        if (blhost_all % 2 == 0){
            dash_list[2]=[2,2]; //下边框
        }
        
        selected_color[0]=color_list[blno_end % color_list.length];
        //selected_color[2]=color_list[blno_end % color_list.length];   //此行保留 - 保留注释
        selected_color[2]=color_list[blhost_all % color_list.length];

        if (blno_second % 2 == 0){
            dash_list[1]=[2,2]; //右边框
            dash_list[3]=[2,2]; //左边框
        }
        selected_color[1]=color_list[blno_second % color_list.length];
        selected_color[3]=color_list[blno_second % color_list.length];
                
        //ctx.rect(0, 0, cssize,cssize); //绘制矩形，参数分别为左上角x坐标、y坐标、宽度、高度 - 保留注释
        canvas_box_with_4_lines_b(ocanvas,ctx,selected_color,dash_list);
        ctx.globalAlpha = 1;
    }
    
    ctx.font = (cssize-line_width)+'px FreeSerif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle'; 

    ctx.fillStyle = 'black';
    ctx.fillText(csstr, cssize/2,cssize/2);
   
    var imgsrc=ocanvas.toDataURL('image/png');
    //-----------------------
    if (change_ico){
        var olink=link_ico_create_b();
        olink.href=imgsrc;
    }
    return imgsrc;
}

function link_ico_create_b(){
    var olink=document.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
    if (!olink){
        var olink = document.createElement('link');
        olink.setAttribute('rel','shortcut icon');
        document.head.appendChild(olink);
    }
    return olink;
}

function canvas_box_with_4_lines_b(ocanvas,ctx,color_list,dash_list){
    // 获取画布的尺寸
    var canvasWidth = ocanvas.width;
    var canvasHeight = ocanvas.height;
    
    // 设置线条样式
    ctx.strokeStyle = color_list[0];
    ctx.setLineDash(dash_list[0]);
    // 绘制上边框
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.stroke();

    // 设置线条样式
    ctx.strokeStyle = color_list[1];
    ctx.setLineDash(dash_list[1]);
    // 绘制右边框
    ctx.beginPath();
    ctx.moveTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.stroke();
    
    // 设置线条样式
    ctx.strokeStyle = color_list[2];
    ctx.setLineDash(dash_list[2]);
    // 绘制下边框
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.stroke();
    
    // 设置线条样式
    ctx.strokeStyle = color_list[3];
    ctx.setLineDash(dash_list[3]);    
    // 绘制左边框
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvasHeight);
    ctx.stroke();
}

function close_button_b(query_str='',cstype='',class_name='aclick',is_id=true){
    if (is_id){
        query_str='#'+query_str;
    }
    switch (cstype){
        case '':
            return '<span class="'+class_name+'" onclick="document.querySelector(\''+query_str+'\').innerHTML=\'\';">Close</span>';
            break;      
        case 'none':
            return '<span class="'+class_name+'" onclick="document.querySelector(\''+query_str+'\').style.display=\'none\';">Close</span>';
            break;        
        case 'remove':
            return '<span class="'+class_name+'" onclick="document.querySelector(\''+query_str+'\').outerHTML=\'\';">Close</span>';        
            break;
    }
}

function date_count_dots_b(cslist,cscolor='red',color_range=13,csstep=20,csunit='',add0101=true,add1231=true,show_date_str=true,show_average=true,show_legend=true,line_height='1.5rem',sum_decimal_len=0,avg_decimal_len=2){
    //cslist 每个元素如：[ Date Fri Sep 01 2023 00:00:00 GMT+0800 (China Standard Time), 127.57 ] - 保留注释

    cslist=date_list_insert_zero_b(cslist,add0101,add1231);
    
    if (cslist.length<2){return '';}
    var day_begin=date2str_b('-',cslist[0][0]);
    var day_end=date2str_b('-',cslist.slice(-1)[0][0]);
    var days_to_sunday=days_between_firstday_to_sunday_b(cslist[0][0]);
    var color_list=['#ffffff'].concat(color_with_different_light_b(cscolor,color_range));
        
    var step_list={};
    for (let blxl=0,lent=color_list.length;blxl<lent;blxl++){
        step_list[blxl]=0;
    }

    var used_color=new Set();
    var total_lines=0;
    var zero_days=0;
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
        var item=cslist[blxl];
        var the_day=date2str_b('-',item[0]);
        var blno=Math.max(0,Math.min(color_range,Math.floor(item[1]/csstep)));  //负数视为0 - 保留注释
        used_color.add(blno);
        var sunday_str=is_sunday_b(days_to_sunday,blxl);
        var is01=month01_day_b(the_day);
        if (blno==0){
            cslist[blxl]='<span style="'+is01+'" title="'+the_day+' '+item[1].toFixed(sum_decimal_len)+'">◌</span>'+sunday_str;
        } else {
            cslist[blxl]='<span style="color:'+color_list[blno]+';'+is01+'" title="'+the_day+' '+item[1].toFixed(sum_decimal_len)+'">●</span>'+sunday_str;
        }
        total_lines=total_lines+item[1];
        step_list[blno]=step_list[blno]+1;
        if (item[1]==0){
            zero_days=zero_days+1;
        }
    }
    
    var blstr='';
    if (show_date_str){
        blstr=blstr+'<p style="line-height:'+line_height+';">'+day_begin+'</p>';
    }
    blstr=blstr+'<p style="line-height:'+line_height+';">'+cslist.join(' ');
    if (show_date_str){
        blstr=blstr+' '+day_end;
    }
    if (show_average){
        blstr=blstr+' ('+total_lines.toFixed(sum_decimal_len)+csunit+'/'+cslist.length+'日≈'+(total_lines/cslist.length).toFixed(avg_decimal_len)+')';    
    }
    blstr=blstr+'</p>';

    var color_legend_list=[];
    if (show_legend){
        used_color=Array.from(used_color);
        used_color.sort(function (a,b){return a>b ? 1 : -1;});
        for (let blxl=0,lent=used_color.length;blxl<lent;blxl++){
            if (used_color[blxl]==0){
                color_legend_list.push([blxl,'0('+(zero_days==step_list[blxl]?'':zero_days+'/')+step_list[blxl]+'日)<span>◌</span>&lt;']);
            } else if (step_list[blxl]>0){
                color_legend_list.push([blxl,used_color[blxl]*csstep+'≤<span style="color:'+color_list[used_color[blxl]]+';" title="'+step_list[blxl]+'">●</span>&lt;']);
            }
        }
    } else {
        csunit='';
    }
    
    color_legend_list.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    for (let blxl=0,lent=color_legend_list.length;blxl<lent;blxl++){
        color_legend_list[blxl]=color_legend_list[blxl][1];
    }
    
    if (color_legend_list.length>0){
        color_legend_list[color_legend_list.length-1]=color_legend_list[color_legend_list.length-1]+'Infinity';
    }
        
    var demo_list=[];
    if (show_legend){
        var used_value=new Set();
        for (let blx=1;blx<=color_range;blx++){
            var blvalue=blx*csstep;
            for (let bly=-1;bly<=1;bly++){
                if (used_value.has(blvalue+bly)){continue;}
                var blno=Math.max(0,Math.min(color_range,Math.floor((blvalue+bly)/csstep)));
                demo_list.push([blvalue+bly,blno]);
                used_value.add(blvalue+bly);
            }
        }

        for (let blxl=0,lent=demo_list.length;blxl<lent;blxl++){
            var item=demo_list[blxl];
            demo_list[blxl]=item[0]+' <span style="color:'+color_list[item[1]]+';">●</span>';
        }
    }
    
    blstr=blstr+'<p style="line-height:'+line_height+';"><span>'+color_legend_list.join('')+(demo_list.length>0?'</span> (<small>'+demo_list.join('╎')+')</small>':'')+(csunit==''?'':' ('+csunit+')')+'</p>';
    return blstr;
}

function progress_b(cspercent,cscolor1='blue',cscolor2='white',cswidth=100,csheight=10,csalpha=0.5){
    var ocanvas=document.createElement('canvas');    
    ocanvas.width = cswidth;
    ocanvas.height = csheight;

    var ctx = ocanvas.getContext('2d');    
    ctx.globalAlpha=csalpha;
    
    ctx.fillStyle=cscolor2;
    ctx.fillRect(0,0,ocanvas.width,ocanvas.height);
    ctx.fillStyle=cscolor1;
    ctx.fillRect(0, 0, ocanvas.width*(cspercent/100), ocanvas.height);
    return ocanvas.toDataURL('image/png');  //png 支持 alpha - 保留注释
}

function ltp_status_get_b(cskey,cscolor1='blue',cscolor2='white',cswidth=100,csheight=10,csalpha=0.5){
    var error,list_t;
    [error,list_t]=local_storage_2_array_b('list_long_term_plans',7,false,false,cskey);
    if (error===false){
        console.log(list_t);
        return [];
    }
    var result_t=[];
    for (let arow of list_t){
        var blpercent=100*percent_calculation_b(parseFloat(arow[3]),parseFloat(arow[5]),parseFloat(arow[6]))[0];
        var blbase64=progress_b(blpercent,cscolor1,cscolor2,cswidth,csheight,csalpha);
        result_t.push('<img src="'+blbase64+'" title="'+specialstr_j(arow[1])+'" style="border:0.1rem '+scheme_global['color']+' solid;" /> '+arow[1]+' <b>'+blpercent.toFixed(2)+'%</b>');
    }
    return result_t;
}

function doms_rect_b(odoms,return_list=false){
    var blleft=0;
    var bltop=0;
    var blwidth=0;
    var blheight=0;
    
    for (let one_dom of odoms){
        var rect=one_dom.getBoundingClientRect();
        blleft=Math.min(blleft,rect.left);
        bltop=Math.min(bltop,rect.top);
        blwidth=Math.max(blwidth,rect.left+rect.width);
        blheight=Math.max(blheight,rect.top+rect.height);
    }
    
    if (return_list){
        return [blleft,bltop,blwidth,blheight];
    } else {
        return {'left':blleft,'top':bltop,'width':blwidth,'height':blheight};
    }
}

function edit_buttons_b(js_fn='',cstype=[],dom_type='button'){
    var the_year=new Date().getFullYear();
    var result_t=[
    '<br />',
    '<code>+</code>', 
    '<div class="div_kl_wrap" style="max-height:;">+</div>', 
    '<ed2k name="ed2k">+</ed2k>', 
    '<kltab sep=comma>+</kltab>', 
    '<magnet>+</magnet>', 
    '<photo>+</photo>', 
    '<photo>{{wikiuploads}}'+the_year+'/+</photo>', 
    '<poem>+</poem>', 
    '{{quote}}+{{/quote}}', 
    '{{span}}+{{/span}}', 
    '<syntaxhighlight lang="">+</syntaxhighlight>', 
    'upload/',
    '<u>+</u>', 
    '{{wikiuploads}}', 
    '{{wikiuploads}}'+the_year+'/', 
    ];
    
    if (cstype.includes('notepad')){
        result_t=[
        "'''+'''",
        "''+''",
        '#',
        '*',
        '== + ==',
        '=== + ===',
        '<big>+</big>',
        '<nowiki>+</nowiki>',
        '<sub>+</sub>',
        '<sup>+</sup>',
        '<tag>+</tag>',
        ].concat(result_t);
    }
    
    if (cstype.includes('mediawiki')){
        result_t=result_t.concat([
        '{{c|t=b|n=+}}', 
        '{{c|t=r|n=+}}', 
        '<klpc 512>+</klpc>', 
        [' li="10" name=""','用于 website 的 txt 模式'],
        '<mrt m>+</mrt>', 
        '<mrt r>+</mrt>', 
        '<mrt t>+</mrt>', 
        '<pre>+</pre>', 
        '<references>+</references>', 
        '<references><ref name="">+</ref></references>', 
        '<ref name="" />', 
        '<ref name="">+</ref>', 
        '{{s|k=+}}', 
        '<span class="klignore">+</span>', 
        '<span class="span_css_klwiki">+</span>', 
        '<span class="span_date_klwiki">+</span>',
        '<span id="span_ico_klwiki">+</span>', 
        '<strike>+</strike>', 
        '{{t|n=+}}', 
        '<todocheck>+</todocheck>', 
        '<website kf>+</website>', 
        '<website m>+</website>', 
        '<website name="" txt>+</website>', 
        '<website name="">+</website>', 
        '<website s>+</website>', 
        '<website w>+</website>', 
        '{{w|n=+}}',
        ]);
    }

    result_t.sort(sort_by_a_z_b);
    
    if (js_fn!==''){
        if (dom_type=='button'){
            var dom_str_l='<button type="button"';
            var dom_str_r='</button>';
        } else {
            var dom_str_l='<span class="'+dom_type+'"';
            var dom_str_r='</span>';
        }
        
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            if (Array.isArray(result_t[blxl])){
                result_t[blxl]=dom_str_l+' title="'+specialstr92_b(result_t[blxl][1])+'" onclick="'+js_fn+'(this);">'+specialstr_lt_gt_j(result_t[blxl][0])+dom_str_r;
            } else {
                result_t[blxl]=dom_str_l+' onclick="'+js_fn+'(this);">'+specialstr_lt_gt_j(result_t[blxl])+dom_str_r;
            }
        }
    }
    return result_t.join(' ');
}

function iframe_show_b(ospan,csno){
    var span_class_name='span_selected_iframe_kl_b';
    var oold_span=document.querySelector('span.'+span_class_name);
    if (oold_span){
        oold_span.style.color='';
        oold_span.style.fontWeight='';
        oold_span.classList.remove(span_class_name);        
    }

    ospan.style.color=scheme_global['a-hover'];
    ospan.style.fontWeight='bold';
    ospan.classList.add(span_class_name);
    
    var iframe_class_name='iframe_selected_iframe_kl_b';
    var oold_iframe=document.querySelector('iframe.'+iframe_class_name);
    if (oold_iframe){
        oold_iframe.style.display='none';
        oold_iframe.classList.remove(iframe_class_name);        
    }

    var oiframe=document.getElementById('iframe_site_kl_b_'+csno);
    oiframe.classList.add(iframe_class_name);    
    oiframe.style.display='';
}

function iframe_generate_b(csxl,cstitle,cssrc,js_code=''){
    var buttons_t='<span class="aclick span_one_iframe_kl_b" onclick="iframe_show_b(this,'+csxl+');'+(js_code==''?'':js_code+'(event,this,'+csxl+');')+'">'+cstitle+'</span>';
    var result_t='<iframe id="iframe_site_kl_b_'+csxl+'" class="iframe_site_kl_b" style="width:95%;height:40rem;display:none;" src="'+cssrc+'"></iframe>';
    return [buttons_t,result_t];
}

function iframe_with_content_b(oparent,cscontent='',iframe_style='',css_js='',add_html=true,add_body=true){
    // 创建一个 iframe 元素
    const iframe = document.createElement('iframe');

    iframe.style.cssText = iframe_style;
    oparent.appendChild(iframe);

    // 等待 iframe 加载完成后再写入内容（确保 contentDocument 可用）
    iframe.onload = function (){
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        if (add_html){
            let html_top=`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
`+css_js+`
<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport" />
</head>`;
        cscontent=html_top+(add_body?'<body>':'')+cscontent+(add_body?'</body>':'')+'</html>';
        }
        doc.write(cscontent);
        doc.close();
    };
}

function iframe_init_b(cslist=[],obutton=false,ocontent=false){
    var buttons_t=[];
    var result_t=[];
    if (cslist.length>0){
        var button_str,iframe_str;
        for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
            var bname=file_path_name_b(cslist[blxl])[1];
            [button_str,iframe_str]=iframe_generate_b(blxl,bname,cslist[blxl]);
            buttons_t.push(button_str);
            result_t.push(iframe_str);
        }
        
        if (obutton){
            obutton.innerHTML=buttons_t.join(' ');
        }
        if (ocontent){
            ocontent.innerHTML=result_t.join('\n');
        }
    }
    
    var ospan=document.querySelector('span.span_one_iframe_kl_b');
    if (ospan){
        ospan.click();
    }
}

function iframe_error_alert_b(oiframe,do_alert=false){
    var blstr='';
    if (!do_alert && oiframe.contentWindow && oiframe.contentWindow.document){
        var blhtml=oiframe.contentWindow.document.body.innerHTML;
        if (blhtml.replace(/\s/g,'').includes('<h1>404</h1>')){
            blstr=': 404';
            do_alert=true;
        } else if (blhtml.trim().startsWith('<h1>Not Found</h1>') && blhtml.includes('<p>The requested URL was not found on this server.</p>')){
            blstr=': not found'; 
            do_alert=true;
        }
    }
    if (do_alert){
        alert('iframe error'+blstr);
    }
}

function get_max_zindex_b(){
    //这种方法假设z-index值是有效的整数，并且只检查了行内样式（style属性）。如果z-index值是在CSS文件或<style>标签中定义的，你可能需要使用getComputedStyle方法来获取计算后的样式，这将使问题变得更复杂，因为需要为每个元素计算样式。此外，实际应用中还需考虑浏览器兼容性等问题。 - 通义千问
    var maxZ = 0;
    var elementsWithZIndex = document.querySelectorAll('[style*="z-index"]');
    for (let one_dom of elementsWithZIndex){
        var zIndex = parseInt(one_dom.style.zIndex, 10); // 获取z-index值，并确保转换为整数
        
        // 注意：某些情况下zIndex可能未定义或不是数值，这里进行简单检查
        if (!isNaN(zIndex) && zIndex > maxZ){
            maxZ = zIndex;
        }
    }

    return maxZ;
}

function span_style_b(){
    var width_t=document.documentElement.clientWidth;
    var height_t=document.documentElement.clientHeight;
    
    var ocontainer=document.querySelector('article, div.article, div.main, div.container, #main');
    var op=false;
    if (ocontainer){
        var op=ocontainer.querySelector('p');
        console.log('span_style_b()','found p');
    }
    
    var fontsize1=0;
    var fontsize2=0;
    
    if (op){
        var rect=op.getBoundingClientRect();
        fontsize1=Math.min(Math.max(width_t,height_t)/40,Math.min(width_t,height_t)/30,rect.height*1.5);
        fontsize2=fontsize1;
    }
    
    if (fontsize1<=0){
        if (width_t>1200){
            var blw1=60;
            var blw2=120;
        } else {
            var blw1=20;
            var blw2=30;    
        }
        fontsize1=document.documentElement.clientWidth/blw1;
        fontsize2=document.documentElement.clientWidth/blw2;        
    }
    

    var spanstyle='color:#0000ff; cursor:pointer; margin-right:5px; font-size:'+fontsize1+'px; line-height:120%;';
    var textareastyle='font-size:'+fontsize2+'px;width:auto;line-height:120%;border:1px solid black;';
    return [spanstyle,textareastyle,fontsize1,fontsize2];
}

function style_generate_b(csstr,dom_type,dom_name='style',csparent='head'){
    if (Array.isArray(csstr)){
        csstr=csstr.join('\n');
    }
    
    if (dom_type){
        var ostyle = document.createElement(dom_name);
        ostyle.innerHTML=csstr;
        switch (csparent){
            case 'head':
                document.head.appendChild(ostyle);
                break;
            case 'body':
                document.body.appendChild(ostyle);
                break;
        }
        return ostyle;
    } else {
        document.write('\n<'+dom_name+'>\n');    
        document.write(csstr+'\n');
        document.write('</'+dom_name+'>\n');
    }
}

function insert_style_dom_b(rule_list){
    var newStyle = document.createElement('style');
    document.head.appendChild(newStyle);

    // 获取新 <style> 标签的 CSSStyleSheet 对象
    var styleSheet = newStyle.sheet;
    // 向 <style> 标签中插入 CSS 规则
    for (let arow of rule_list){
        // arow 形如：'#myElement { color: red; }' - 保留注释
        try {
            styleSheet.insertRule(arow, styleSheet.cssRules.length);
        } catch (e){
            console.error('插入规则失败:', arow, e);
        }
    }
}

function main_container_generate_b(oparent,idname,cstop='50%'){
    var main_container = document.createElement('div');    
    oparent.parentNode.insertBefore(main_container,oparent);
    
    main_container.style.cssText='position:fixed;float:right;z-index:99999;border: solid 1px black;background:#c0c0c0;opacity: 0.6; top:'+cstop+'; left:0%;';
    main_container.setAttribute('id',idname);
    main_container.setAttribute('onmouseover','this.style.opacity=1');
    main_container.setAttribute('onmouseout','this.style.opacity=0.6');
    return main_container;
}

function buttons_do_type_generate_b(cscaption,button_name_list,do_type_fn,one_character=false,cstop='10rem'){
    var odiv=document.getElementById('div_'+cscaption+'_kl');
    if (odiv){return [false,false];}
    
	var sp1 = document.createElement('div');
	sp1.setAttribute('id', 'div_'+cscaption+'_kl');
	var blobj = document.querySelector('body');
	var parentDiv = blobj.parentNode;
	parentDiv.insertBefore(sp1, blobj);
	sp1.style.cssText='position:fixed;float:right;z-index:99999;border: dotted 0.05rem black;border-radius:1rem;padding:0.2rem;cursor:pointer;background:#f0f0f0;opacity: 0.4;margin-top:'+cstop+';';
    sp1.setAttribute('onmouseover','this.style.opacity=1');
    sp1.setAttribute('onmouseout','this.style.opacity=0.4');
    
    var spanstyle='margin:0.2rem; border:0.1rem solid black; border-radius:0.5rem;padding:0.1rem';
	
    //button_name_list 形如 ['Scan','Status','Erase','Import','Error ids','Stop'] - 保留注释
    for (let item of button_name_list){
        var ospan=document.createElement('span');
        sp1.appendChild(ospan);
        if (one_character){
            ospan.innerHTML=item.substring(0,1);
            ospan.title=item;        
        } else {
            ospan.innerHTML=item;
        }
        ospan.style.cssText=spanstyle;
        ospan.addEventListener('click',function(e){do_type_fn(item);},false); //需要放在一行，否则压缩出错 - 保留注释
    }

    return [sp1,spanstyle];
}

function sub_dom_create_b(oparent,cshtml,csstyle='',cstitle='',tagname='span'){
    var osub=document.createElement(tagname);
    oparent.appendChild(osub);
    osub.innerHTML=cshtml;
    osub.title=cstitle;
    osub.style.cssText = csstyle;
    return osub;
}

function div_table_2_cols_b(left_str,csid,cssize,class_name=''){
    return '<div'+(class_name==''?'':' class="'+class_name+'"')+' style="margin:0 0.5rem 0.5rem 0; border:0.1rem solid black; display:inline-block;"><table cellpadding=5 cellspacing=0 style="line-height:0;"><tr><td valign=middle style="border-right:0.1rem solid black;">'+left_str+'</td><td id="'+csid+'" width='+cssize+' height='+cssize+' valign=middle></td></tr></table></div>';
}

function table_split_doms_one_row_b(cslist,cswidth='100%'){
    return '<table style="line-height:0;" width="'+cswidth+'"><tr><td valign=top>'+cslist.join('</td><td valign=top>')+'</td></tr></table>';
}

function dom_center_xy_get_b(odom){
    var rect = odom.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
}

function doms_horizontal_overflow_check_b(ocontainer,osubs,check_scroll=true){
    if (check_scroll){
        const hasScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
        if (!hasScroll){
            console.log('未发现横向滚动条');
            return;
        }
        console.log('发现横向滚动条');
    }

    var blxl=0;
    var container_right=ocontainer.getBoundingClientRect().right;
    for (let one_sub of osubs){
        if (one_sub.getBoundingClientRect().right>container_right){
            one_sub.style.wordBreak='break-all';
            blxl=blxl+1;
            console.log('调整',blxl,one_sub.innerText);
        }
    }
}

function container_subdom_left_top_b(ocontainer,osubdom,left_value,top_value,add_px=false){
    if (isNaN(left_value) || left_value==-1){
        left_value=Math.max(0,(ocontainer.width-osubdom.width)/2);
    } else if (left_value>0 && left_value<1){
        left_value=ocontainer.width*left_value;
    } else if (left_value<0 && left_value>-1){
        left_value=Math.max(0,ocontainer.width*(1+left_value)-osubdom.width);
    } else if (left_value<-1){
        left_value=Math.max(0,ocontainer.width+left_value-osubdom.width);
    }
    
    if (isNaN(top_value) || top_value==-1){
        var top_value=Math.floor(Math.max(0,(ocontainer.height-osubdom.height)/2));
    } else if (top_value>0 && top_value<1){
        top_value=ocontainer.height*top_value;
    } else if (top_value<0 && top_value>-1){
        top_value=Math.max(0,ocontainer.height*(1+top_value)-osubdom.height);
    } else if (top_value<-1){
        top_value=Math.max(0,ocontainer.height+top_value-osubdom.height);
    }
    
    if (add_px){
        left_value=left_value+'px';
        top_value=top_value+'px';
    }
    return [left_value,top_value];
}

function inputs_insert_value_from_str_b(id1,id2,csstr,delimiter='+'){
    var list_t=csstr.split(delimiter);
    list_t.push('');
    document.getElementById(id1).value=list_t[0];
    document.getElementById(id2).value=list_t[1];
}

function remove_img_alt_b(){
    var oimgs=document.querySelectorAll('img');
    var blcount_alt=0;
    var blcount_title=0;
    for (let one_img of oimgs){
        var blalt=one_img.getAttribute('alt');
        if (blalt){
            console.log('remove alt:',blalt);
            one_img.removeAttribute('alt');
            blcount_alt=blcount_alt+1;
        }

        var bltitle=one_img.getAttribute('title');
        if (bltitle){
            console.log('remove title:',bltitle);        
            one_img.removeAttribute('title');
            blcount_title=blcount_title+1;
        }
    }
    console.log('获取图片对象',oimgs.length,'个，移除 alt',blcount_alt,'个，移除 title',blcount_title,'个');
}

function find_closest_dom_above_by_tagname_b(odom,tagname,classname=false){
    let currentElement = odom;
    let is_parent=false;
    while (currentElement){
        // 检查当前元素的前方兄弟元素
        let sibling = currentElement.previousElementSibling;
        while (sibling){
            if (sibling.tagName === tagname){
                if (classname!==false){
                    if (sibling.classList.contains(classname)){
                        return sibling;
                    }
                } else {
                    return sibling;
                }
            }
            sibling = sibling.previousElementSibling;
        }
        // 若无，向父元素层级移动
        currentElement = currentElement.parentElement;
    }
    return null;
}

function find_closest_dom_next_by_tagname_b(odom,tagname,classname=false){
    let currentElement = odom;
    while (currentElement){
        // 检查当前元素的前方兄弟元素
        let sibling = currentElement.nextElementSibling;
        while (sibling){
            if (sibling.tagName === tagname){
                if (classname!==false){
                    if (sibling.classList.contains(classname)){
                        return sibling;
                    }
                } else {
                    return sibling;
                }
            }
            sibling = sibling.nextElementSibling;
        }
        // 若无，向父元素层级移动
        currentElement = currentElement.parentElement;
    }
    return null;
}

function rect_valign_middle_b(odom){
    //odom 默认的 style 中 top 要预先设置为 50%; - 保留注释
    var rect=odom.getBoundingClientRect();
    odom.style.top=(rect.top-rect.height/2)+'px';
}

function popup_font_family_content_b(input_id,popup_id){
    var list_t=local_storage_get_b('kl_font_family_b',40,true);
    var bljg='';
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        var blspecial=specialstr_j(item,true);
        bljg=bljg+'<span class="oblong_box" style="font-size:1.5rem;font-family:'+item+';" onclick="document.getElementById(\''+input_id+'\').value=\''+blspecial+'\';" title="'+blspecial+'">字体'+item.slice(0,4)+(blxl+1)+'</span> ';
    }
    
    var opopup=document.getElementById(popup_id);
    opopup.innerHTML='<p style="line-height:2.8rem;">'+bljg+'</p>';
    mouseover_mouseout_oblong_span_b(opopup.querySelectorAll('span.oblong_box'));
    popup_show_hide_b(popup_id);
}

function textarea_flash_b(dom_id,remove_outline=false){
    var list_t=[];
    if (remove_outline){
        list_t.push(dom_id+' {outline:none;}');
    }
    list_t.push(dom_id+':focus {border-color: '+scheme_global['color']+';}');
    return list_t;  //消除屏幕闪烁 - 保留注释
}
