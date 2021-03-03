function color_name2hex_b(csname){
    //更新日期：2019-08-11 - 保留注释
    var colorname={"aliceblue":"#f0f8ff", "antiquewhite":"#faebd7", "aqua":"#00ffff", "aquamarine":"#7fffd4", "azure":"#f0ffff", "beige":"#f5f5dc", "bisque":"#ffe4c4", "black":"#000000", "blanchedalmond":"#ffebcd", "blue":"#0000ff", "blueviolet":"#8a2be2", "brown":"#a52a2a", "burlywood":"#deb887", "cadetblue":"#5f9ea0", "chartreuse":"#7fff00", "chocolate":"#d2691e", "coral":"#ff7f50", "cornflowerblue":"#6495ed", "cornsilk":"#fff8dc", "crimson":"#dc143c", "cyan":"#00ffff", "darkblue":"#00008b", "darkcyan":"#008b8b", "darkgoldenrod":"#b8860b", "darkgray":"#a9a9a9", "darkgreen":"#006400", "darkgrey":"#a9a9a9", "darkkhaki":"#bdb76b", "darkmagenta":"#8b008b", "darkolivegreen":"#556b2f", "darkorange":"#ff8c00", "darkorchid":"#9932cc", "darkred":"#8b0000", "darksalmon":"#e9967a", "darkseagreen":"#8fbc8f", "darkslateblue":"#483d8b", "darkslategray":"#2f4f4f", "darkslategrey":"#2f4f4f", "darkturquoise":"#00ced1", "darkviolet":"#9400d3", "deeppink":"#ff1493", "deepskyblue":"#00bfff", "dimgray":"#696969", "dimgrey":"#696969", "dodgerblue":"#1e90ff", "firebrick":"#b22222", "floralwhite":"#fffaf0", "forestgreen":"#228b22", "fuchsia":"#ff00ff", "gainsboro":"#dcdcdc", "ghostwhite":"#f8f8ff", "gold":"#ffd700", "goldenrod":"#daa520", "gray":"#808080", "green":"#008000", "greenyellow":"#adff2f", "grey":"#808080", "honeydew":"#f0fff0", "hotpink":"#ff69b4", "indianred":"#cd5c5c", "indigo":"#4b0082", "ivory":"#fffff0", "khaki":"#f0e68c", "lavender":"#e6e6fa", "lavenderblush":"#fff0f5", "lawngreen":"#7cfc00", "lemonchiffon":"#fffacd", "lightblue":"#add8e6", "lightcoral":"#f08080", "lightcyan":"#e0ffff", "lightgoldenrodyellow":"#fafad2", "lightgray":"#d3d3d3", "lightgreen":"#90ee90", "lightgrey":"#d3d3d3", "lightpink":"#ffb6c1", "lightsalmon":"#ffa07a", "lightseagreen":"#20b2aa", "lightskyblue":"#87cefa", "lightslategray":"#778899", "lightslategrey":"#778899", "lightsteelblue":"#b0c4de", "lightyellow":"#ffffe0", "lime":"#00ff00", "limegreen":"#32cd32", "linen":"#faf0e6", "magenta":"#ff00ff", "maroon":"#800000", "mediumaquamarine":"#66cdaa", "mediumblue":"#0000cd", "mediumorchid":"#ba55d3", "mediumpurple":"#9370db", "mediumseagreen":"#3cb371", "mediumslateblue":"#7b68ee", "mediumspringgreen":"#00fa9a", "mediumturquoise":"#48d1cc", "mediumvioletred":"#c71585", "midnightblue":"#191970", "mintcream":"#f5fffa", "mistyrose":"#ffe4e1", "moccasin":"#ffe4b5", "navajowhite":"#ffdead", "navy":"#000080", "oldlace":"#fdf5e6", "olive":"#808000", "olivedrab":"#6b8e23", "orange":"#ffa500", "orangered":"#ff4500", "orchid":"#da70d6", "palegoldenrod":"#eee8aa", "palegreen":"#98fb98", "paleturquoise":"#afeeee", "palevioletred":"#db7093", "papayawhip":"#ffefd5", "peachpuff":"#ffdab9", "peru":"#cd853f", "pink":"#ffc0cb", "plum":"#dda0dd", "powderblue":"#b0e0e6", "purple":"#800080", "rebeccapurple":"#663399", "red":"#ff0000", "rosybrown":"#bc8f8f", "royalblue":"#4169e1", "saddlebrown":"#8b4513", "salmon":"#fa8072", "sandybrown":"#f4a460", "seagreen":"#2e8b57", "seashell":"#fff5ee", "sienna":"#a0522d", "silver":"#c0c0c0", "skyblue":"#87ceeb", "slateblue":"#6a5acd", "slategray":"#708090", "slategrey":"#708090", "snow":"#fffafa", "springgreen":"#00ff7f", "steelblue":"#4682b4", "tan":"#d2b48c", "teal":"#008080", "thistle":"#d8bfd8", "tomato":"#ff6347", "turquoise":"#40e0d0", "violet":"#ee82ee", "wheat":"#f5deb3", "white":"#ffffff", "whitesmoke":"#f5f5f5", "yellow":"#ffff00", "yellowgreen":"#9acd32"};
    csname=csname.toLowerCase();
    if (colorname[csname]){
        return colorname[csname];
    }
    return '';
}

function scheme_div_b(){
    Object.entries(scheme_global).forEach(([key, value]) => {
        var hsl=rgb2hsl_b(value);
        document.write('<div style="background-color:'+value+';"><span style="color:black;background-color:white;padding-right:0.5rem;">scheme_global["'+key+'"]: "'+value+'", rgb: '+hex2rgb_b(value)+' hsl: '+hsl["h"].toFixed(4)+' '+hsl["s"].toFixed(4)+' '+hsl["l"].toFixed(4)+'</span></div>');
    });
}

function scheme_generation_b(){
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
}

function css_root_style_b(pcsize="16",mobilesize="30",cssname=[''],usercss=[],checkbox_radio=3){
    if (pcsize==''){
        pcsize='16';
    }
    if (mobilesize==''){
        mobilesize='30';
    }
    var increment=parseFloat(local_storage_get_b('root_font_size_increment'));
    if (isNaN(increment)){
        increment=0;
    }
    pcsize=parseFloat(pcsize)+increment;
    mobilesize=parseFloat(mobilesize)+increment;
    
    document.write("\n<style>\n");
    if (ismobile_b()){
        //document.write(":root {font-size:"+mobilesize+"px;}\n"); - 保留注释
        document.querySelector(":root").style.fontSize=mobilesize+'px';
        //document.write("section {font-size:"+(parseInt(mobilesize)+20)+"px;line-height:150%;}\n"); - 保留注释
        document.write("section {font-size:1rem;line-height:150%;}\n");
        if (checkbox_radio>1){
            document.write("input[type=checkbox] {-webkit-transform: scale("+checkbox_radio+"); margin:25px;}\n");
            document.write("input[type=radio] {-webkit-transform: scale("+checkbox_radio+"); margin:25px;}\n");
        }
    }
    else{
        document.querySelector(":root").style.fontSize=pcsize+'px';
        //document.write(":root {font-size:"+pcsize+"px;}\n"); - 保留注释
        document.write("section {font-size:1rem;line-height:200%;}\n");
    }

    if (cssname.includes('base')){
        document.write('body {font-size:1rem; margin:0px; padding:0px;color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';}\n');
        document.write('p{word-break:normal;word-wrap:normal;font-size:0.85rem;margin:0;margin-bottom:0.2rem;color:'+scheme_global['color']+';}\n');
        document.write('label{cursor:pointer;}\n');        
        document.write('p.mini{font-size:0.75rem;margin:0px;padding:1px 0px 1px 0px;}\n');
        document.write('ol,ul,li{font-size:0.9rem;color:'+scheme_global['color']+';}\n');
        document.write('ol,ul{padding:0;list-style-position: inside;}\n');
        document.write('.fmini {font-size:0.75rem;line-height:100%;margin:3px 0px;color:'+scheme_global['color']+';}\n');
        document.write('::selection {background-color:'+scheme_global['selection']+';color:'+scheme_global['color']+';}\n');
        document.write('img {max-width:620px;}\n');
        document.write('hr {border:1px dashed '+scheme_global['memo']+';}\n');
        document.write('a{word-break:break-all;word-wrap:break-word;}\n');
        document.write('a:link, .a_word, span.span_link{color:'+scheme_global['a']+';}\n');
        document.write('.a_word, span.span_link{text-decoration:underline;cursor:pointer;}\n');
        document.write('span.span_box, span.span_underline_box{cursor:pointer;}\n');
        document.write('a:visited{color:'+scheme_global['a']+';}\n');
        document.write('a:hover, .a_word:hover, span.span_link:hover, span.span_box:hover{color:'+scheme_global['a-hover']+';}\n');
        document.write('span.span_underline_box:hover{color:'+scheme_global['a-hover']+'; text-decoration:underline;}\n');
        document.write('a:active{color:'+scheme_global['a']+';}\n');
        document.write('input[type="submit"]{font-size:1rem; padding:0.3rem 1rem;margin-right:0.2rem;border:0;border-radius: 0.2rem;background-color:'+scheme_global['button']+';box-shadow: 0.2rem 0.2rem 0.1rem '+scheme_global['shadow']+';}\n');
        document.write('.aclick{font-size:1rem; padding:0.3rem 0.4rem;margin-right:0.2rem;line-height:250%;text-decoration:none;border-radius: 0.2rem;background-color:'+scheme_global['button']+';box-shadow: 0.2rem 0.2rem 0.1rem '+scheme_global['shadow']+';cursor:pointer;}\n');
        document.write('.aclick:link{color:'+scheme_global['color']+';}\n');
        document.write('.aclick:hover{color:'+scheme_global['a-hover']+';}\n');
        document.write('input{border:1px solid '+scheme_global['memo']+';font-size:0.95rem;padding:2px 5px;color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';}\n');
        document.write('textarea{border:1px solid '+scheme_global['memo']+';font-size:0.9rem;line-height:130%;width:95%;padding:10px;color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';}\n');
        document.write('SELECT{font-size:0.9rem;}\n');
        document.write('.span_from, .span_from_wiki {color:'+scheme_global['memo']+';font-size:0.7rem;font-style: italic;}\n');
        document.write('.span_from a, .span_from_wiki a{color:'+scheme_global['memo']+';text-decoration:none;}\n');
        document.write('a.a_oblong_box{color:'+scheme_global['color']+';background-color:'+scheme_global['background']+';text-decoration:none;border-radius: 0.5rem;border:0.1rem solid '+scheme_global['shadow']+';padding:0.1rem 0.3rem;line-height:1.8rem;}\n');
        document.write('a.a_oblong_box:hover{color:'+scheme_global['a-hover']+';box-shadow: 0.1rem 0.1rem 0.1rem '+scheme_global['shadow']+';}\n');
        document.write('.oblong_box{border-radius: 0.5rem;border:0.1rem solid '+scheme_global['shadow']+';padding:0.1rem 0.3rem;}\n');
        document.write('.table_common th{border-bottom:0.1rem solid black;padding:0.1rem 0.5rem;}\n');
        document.write('.table_common tr:hover {background-color:'+scheme_global['button']+';}\n');        
        document.write('.table_common td {border-bottom:0.05rem dotted black;padding:0.1rem 0.5rem;}\n');    
    }
    if (cssname.includes('menu')){
        var fcolor=hex2rgb_b(scheme_global['color']);
        document.write(".klmenu button {color: "+scheme_global['color']+"; background-color: "+scheme_global['button']+"; padding: 0.5rem 0.65rem; border: none; cursor: pointer; margin:0px;}\n");
        document.write(".klmenu {position: relative; display: inline-block;}\n");
        document.write(".klmenu div {display: none; position: absolute; background-color: "+scheme_global['menubg']+"; box-shadow: 0px 8px 16px 0px rgba("+fcolor[0]+','+fcolor[1]+','+fcolor[2]+",0.2); z-index: 1;}\n");
        document.write(".klmenu div a, .klmenu div span.span_menu{color: "+scheme_global['color']+"; padding: 0.5rem 1rem; text-decoration: none; display: block; font-weight:normal;}\n");
        document.write(".klmenu div a:hover, .klmenu div a:active, .klmenu div span.span_menu:hover {color:"+scheme_global['a-hover']+"; background-color: "+scheme_global['button']+"; font-weight:bold; box-shadow: 0px 0px 10px "+scheme_global['color']+";cursor:pointer; }\n");
        document.write(".klmenu:hover button {background-color: "+scheme_global['shadow']+";}\n");
    }
    
    if (usercss.length==2){
        mobile_b(usercss[0],usercss[1]);
    }
    document.write("</style>\n");
}

function mobile_b(csstr1,csstr2){
    //csstr1 mobile style
    //csstr2 pc style
	var csnum=arguments.length;
	if (csnum<2){
        var csstr2 = '';
    }
	if (ismobile_b()){
		if (csstr1!=''){
            document.write('\n'+csstr1+'\n');
        }
	}
	else{
		if (csstr2!=''){
            document.write('\n'+csstr2+'\n');
        }
	}
}

function css_select_b(cslen=4,cstype='pc'){
    if (cstype=='mobile'){
        return "font-size:1.1rem;width:"+(1.3*cslen)+"em;min-height:1.1rem;";
    }
    return "width:"+(cslen+2)+"em;";
}

function css_checkbox_b(csscale=2,cstype='pc'){
    if (cstype=='mobile'){
        return "-webkit-transform: scale("+csscale+");margin-right:1rem;";
    }
    return '';
}

function css_input_text_b(cslen=10,cstype='pc',csexpand=false,csstyle=''){
    if (csexpand==false){
        csexpand=2;
    }
    if (csstyle==''){
        var csstyle='border:0px;border-bottom:0.1rem solid #939598';
    }
    if (cstype!=='mobile' && cslen>10){
        cslen=cslen+cslen/csexpand;
    }
    return "width: "+cslen+"rem; font-size:1.25rem; padding:2px 5px; vertical-align:text-bottom;"+csstyle;
}

function checkbox_kl_b(csid,cscaption,cstitle="",selected=false,jsstr=''){
    if (selected){
        var blc='blue';
        var blchecked=' checked';
    }
    else {
        var blc='grey';
         var blchecked='';
    }
    var bljg='';
    bljg=bljg+'<span id="'+csid+'" style="cursor:pointer;color:'+blc+'" title="'+cstitle+'" onclick=\'javascript:checkbox_kl_color_b("'+csid+'");'+jsstr+'\'>';
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
                }
                else {
                    obj.style.color='grey';
                    ocheck.checked=false;
                }
            }
            else if (setvalue==1 || setvalue==true) {
                obj.style.color='blue';
                ocheck.checked=true;
            }
            else if (setvalue==0 || setvalue==false) {
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
    if (!ospan){return false;}
    var blstr=ospan.innerText;
    var blvalue=(blstr.indexOf('⚪')==0?false:true);
    if (change_value){
        blvalue=!blvalue;
        ospan.innerText=(blvalue?'🔵':'⚪')+blstr.substring((blvalue?1:2),);
    }
    return blvalue;
}

function klmenu_b(csarray,menu_name='',min_width='',button_fontsize='',item_fontsize="",max_height='',cstitle='',menuid='',buttonid=''){
    // csarray links <a href="#">Link 1</a>
    if (menu_name==''){
        menu_name='☰';
    }
    if (min_width==''){
        min_width='10rem';
    }
    if (button_fontsize==""){
        button_fontsize="1.2rem";
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
    bljg=bljg+' style="font-size:'+button_fontsize+';" onclick="javascript:if(this.parentNode.getElementsByTagName(\'div\')[0].style.display==\'block\'){this.parentNode.getElementsByTagName(\'div\')[0].style.display=\'none\';}else {this.parentNode.getElementsByTagName(\'div\')[0].style.display=\'block\';}" title="'+cstitle+'">'+menu_name+'</button>';
    bljg=bljg+'<div style="display:none;min-width: '+min_width+';max-height:'+max_height+';overflow:scroll;overflow-y:auto;overflow-x:auto;">';
    for (let item of csarray){
        bljg=bljg+'<span style="text-align:left;font-size:'+item_fontsize+';">'+item+'</span>\n';
    }
    bljg=bljg+'</div></div>';
    return bljg;
}

function klmenu_hide_b(csname=''){
    if (csname==""){
        return "this.parentNode.parentNode.style.display='none';";
    }
    return "this.parentNode.parentNode.style.display='none';document.location.href = '"+csname+"';";
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

function popup_show_hide_b(csid,cstype='block') {
  if (document.getElementById(csid).style.display==cstype){
      document.getElementById(csid).style.display='none';
      return;
  }
  document.getElementById(csid).style.display=cstype;
}

function border_style_b(spanid,popupid) {
    var list_t=["none","dotted","dashed","solid","double","groove","ridge","inset","outset",'wavy'];
    var bltop='<span id="'+spanid+'" style="cursor:pointer;" onclick="javascript:popup_show_hide_b(\''+popupid+'\')">none</span>';
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<span style="cursor:pointer;" onclick="javascript:document.getElementById(\''+spanid+'\').innerHTML=this.innerHTML;popup_show_hide_b(\''+popupid+'\');">'+item+'</span> ';
    }
    return bltop+popup_b(popupid,bljg)
}

function background_img_style_b(spanid,popupid) {
    //no-repeat-expand 是特殊属性 - 保留注释
    var list_t=["repeat","repeat-x","repeat-y","no-repeat","no-repeat-expand","space","round"];
    var bltop='<span id="'+spanid+'" style="cursor:pointer;" onclick="javascript:popup_show_hide_b(\''+popupid+'\')">repeat</span>';
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<span style="cursor:pointer;" onclick="javascript:document.getElementById(\''+spanid+'\').innerHTML=this.innerHTML;popup_show_hide_b(\''+popupid+'\');">'+item+'</span> ';
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

function top_bottom_arrow_b(idname,csmemo='',cseng=false,csfsize='1.3rem',show_soft=true){
    var odiv=document.getElementById(idname);
    if (!odiv){
        return;
    }
    if (!location.href.includes('/klwebphp/')){
        show_soft=false;
    }
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
        soft_str=klsofts_div_b('div_top_bottom_softs',soft_font_size);
    }
    bljg=bljg+soft_str;
    bljg=bljg+'<span id="span_top_bottom_arrow_memo">'+csmemo+'</span>';
    if (show_soft){
        bljg=bljg+'<span onclick="javascript:popup_show_hide_b(\'div_top_bottom_softs\');" style="cursor:pointer;">S</span> ';
    }
    bljg=bljg+'<span onclick="javascript:window.scrollTo(0,0);" style="cursor:pointer;">T↑</span> ';
    bljg=bljg+'<span onclick="javascript:window.scrollTo(0,document.body.scrollHeight);" style="cursor:pointer;">B↓</span> ';
    if (cseng || document.getElementsByClassName('sup.kleng').length>0){
        bljg=bljg+'<span style="cursor:pointer;" onclick="javascript:sup_kleng_hide_b();" title="单词显示切换">E</span> ';
    }
    bljg=bljg+'<span onclick="javascript:if (confirm(\'是否关闭？\')){document.getElementById(\''+idname+'\').parentNode.removeChild(document.getElementById(\''+idname+'\'));}" style="cursor:pointer;">x</span> ';
    odiv.innerHTML=bljg;
    odiv.style.cssText='position:fixed; bottom:0%; right:0%; z-index:9999; color:black; font-size:'+csfsize+';padding:0 0.5rem; margin:0; background-color:#bbbbbb;opacity:0.5;font-weight:bold;';
    odiv.setAttribute('onmouseover','javascript:this.style.opacity=0.9;');
    odiv.setAttribute('onmouseout','javascript:this.style.opacity=0.5;');
}

function rndcolor_b() {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (let blxl = 0; blxl < 6; blxl++) {
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
    //-------------
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

function rgb2hex_b(rgb,csg,csb) {
    //rgb [255,0,0] - 保留注释
    function sub_rgb2hex_b_component(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    //--------------------
    var csnum=arguments.length;
    if (csnum==3){
        rgb=[rgb,csg,csb];
    }
    else if (csnum==1){
        if (!Array.isArray(rgb) && typeof rgb =='object'){
            rgb=[rgb['r'],rgb['g'],rgb['b']];
        }
        else if (typeof rgb == 'string' ){//rgb(153, 153, 153) - 保留注释
            var hexname=color_name2hex_b(rgb);
            if (hexname!==''){return hexname;}
            rgb=rgb.replace('rgb','');
            rgb=rgb.replace('(','');
            rgb=rgb.replace(')','');
            rgb=rgb.split(',');
        }
    }

    for (let blxl=0;blxl<3;blxl++){
        if (typeof rgb[blxl] == 'string' ){
            rgb[blxl]=parseInt(rgb[blxl].trim());
        }
    }

    return ("#" + sub_rgb2hex_b_component(rgb[0]) + sub_rgb2hex_b_component(rgb[1]) + sub_rgb2hex_b_component(rgb[2])).toUpperCase();
}

function hex2rgb_b(hex) { 
    //hex支持颜色名称输入 - 保留注释
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result==null){
        hex=color_name2hex_b(hex);
        result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    }
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : false;
}

function color_range_b(color1=[],color2=[],cscount=10){
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
    
    for (var blxl=0;blxl<=cscount;blxl++){
        list_t.push([parseInt(color1[0]+red*blxl),parseInt(color1[1]+green*blxl),parseInt(color1[2]+blue*blxl)]);
    }
    return list_t;
}

function div_height_temp_create_b(){
    document.write('\n<div id="div_height_temp_b" style="position:absolute;right:100%;width:1px;height:100rem;"><\/div>\n');
}

function div_height_temp_remove_b(){
    var odiv=document.getElementById('div_height_temp_b');
    if (odiv){
        odiv.parentNode.removeChild(odiv);
    }
}

function hsl2hex_b(h,s,l){
    if (arguments.length === 1) {
        s = h.s;
        l = h.l;
        h = h.h;
    }
    return rgb2hex_b(hsl2rgb_b(h,s,l));
}

function hsl2rgb_b(h,s,l){
    //code source: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    if (arguments.length === 1) {
        s = h.s;
        l = h.l;
        h = h.h;
    }
    if (s==0){
        var rgb = { };
        rgb.r = rgb.g = rgb.b = Math.round(l * 255);
        return rgb;
    }
    
    //--------------
    function sub_HSLtoHSV_b(h, s, l) {
        if (arguments.length === 1) {
            s = h.s;
            l = h.l;
            h = h.h;
        }
        var _h = h;
        var _s;
        var _v;

        l *= 2;
        s *= (l <= 1) ? l : 2 - l;
        _v = (l + s) / 2;
        if (s==0){
            _s=0;
        }
        else {
            _s = (2 * s) / (l + s);
        }
        return {h: _h, s: _s, v: _v};
    }

    function sub_HSVtoRGB_b(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
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
    //------------
    return sub_HSVtoRGB_b(sub_HSLtoHSV_b(h,s,l));
}

function rgb2hsl_b(r,g,b){
    //code source: https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    if (arguments.length === 1) {
        if (Array.isArray(r) && r.length==3){
            g=r[1];
            b=r[2];
            r=r[0];
        }
        //hex - 保留注释
        else if (typeof r =='string') {
            var rgb=hex2rgb_b(r);
            r=rgb[0];
            g=rgb[1];
            b=rgb[2];
        }
        else if (typeof r == 'object') {
            g = r.g;
            b = r.b;
            r = r.r;
        }
    }
    if (r==255 && g==255 && b==255){
        return {h: 0, s: 0, l: 1};
    }
    //----------
    function sub_RGBtoHSV_b(r, g, b) {
        if (arguments.length === 1) {
            g = r.g;
            b = r.b;
            r = r.r;
        }
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var d = max - min;
        var _h;
        var _s = (max === 0 ? 0 : d / max);
        var _v = max / 255;

        switch (max) {
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

    function sub_HSVtoHSL_b(h, s, v) {
        if (arguments.length === 1) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        
        var _h = h;
        var _s = s * v;
        var _l = (2 - s) * v;
        //_s /= (_l <= 1) ? _l : 2 - _l;
        _s /= (_l <= 1) ? (_l === 0 ? 1 : _l) : 2 - _l;
        _l /= 2;
        return {h: _h, s: _s, l: _l};
    }
    //----------
    return sub_HSVtoHSL_b(sub_RGBtoHSV_b(r,g,b));
}

function document_body_offsetHeight_b(){;
    var window_h=document.body.offsetHeight;
    if (window_h>0){return window_h;}
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
}

function div_title_href_id_b(item,id_list){
    var blhref_length=item[0].length;
    var bltitle_length=item[1].length;
    var a_name_asc=0;
    if (item[0]!==''){
        a_name_asc=asc_sum_b(item[0]); //依赖 klbase.js - 保留注释
    }
    else if (item[1]!==''){
        a_name_asc=asc_sum_b(item[1]);
    }
    else {
        a_name_asc=asc_sum_b(item[2].substring(0,20));
    }
    var bltype='t_';
    while (true){
        if (id_list.includes('t_'+blhref_length+'_'+bltitle_length+'_'+a_name_asc)){
            console.log(item[0],item[1],a_name_asc,a_name_asc+1); //此段显示 - 保留注释
            a_name_asc=a_name_asc+1;
            bltype='m_';
        }
        else {
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
            bljg=bljg+'<span class="span_a_article_title_b" style="color:'+scheme_global["a"]+'">'+item[1]+'</span> ';
        }
    }
    else {
        if (item[1]==''){
            bljg=bljg+'<a class="span_a_article_title_b" href="'+item[0]+'" target=_blank>'+item[0]+'</a> ';
        }
        else {
            bljg=bljg+'<a class="span_a_article_title_b" href="'+item[0]+'" target=_blank>'+item[1]+'</a> ';
        }
    }

    if (item.length>=3){
        if (item[2]!==""){
            if (item2_nofomat){
                var blcontent=item[2];
            }
            else {
                var blcontent=wiki_all_format_b(item[2],"",-1,underline);
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
                bljg=bljg+' onclick="javascript:'+fnname+'(this.href);"';
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

function input_size_b(cslist,cstype='name'){
    //cslist: [ ["input_class0",8],["input_class",5,false], ["input_calculator",21,3], ]; - 保留注释
    //cstype name; id
    var mobile_global=ismobile_b(true);
    if (cstype=='name'){
        var querystr='input[name="';
        var querystr_end='"]';
    }
    else if (cstype=='id') {
        var querystr='input#';
        var querystr_end='';
    }
    else {return;}
    for (let item of cslist){
        var oinput=document.querySelector(querystr+item[0]+querystr_end);
        if (oinput){
            if (item.length>=4){
                oinput.style.cssText=css_input_text_b(item[1],mobile_global,item[2],item[3]);
            }        
            else if (item.length>=3){
                oinput.style.cssText=css_input_text_b(item[1],mobile_global,item[2]);
            }
            else {
                oinput.style.cssText=css_input_text_b(item[1],mobile_global);
            }
        }
    }
}

function input_with_x_b(csid,cswidth,xid='',csexpand=false,regid=false,isreg=false){
    //csexpand 可以是 数值型 - 保留注释
    var oinput=document.getElementById(csid);
    if (!oinput){
        return;
    }
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
}

function popular_colors_b(){
    return [
    "#01321B,#E2E9E8,#6A01F4",
    "#0436EB,#DDBBD4,#0F5133",
    "#050D00,#D7E7F3,#3E9FDB",  
    "#056ABE,#89D4DB,#056ABE",
    "#0665A9,#A2FCD1,#EC533D",
    "#080823,#CBB9B1,#1D5D1E",
    "#090D3A,#41B5A1,#140544",
    "#094525,#8FCDA0,#486275",
    "#0A6778,#A3D5C1,#2005E0",
    "#0B0F0C,#77C0AD,#9A0712",
    "#0C1E1F,#9CC3C7,#F5A9FF",
    "#0D2636,#ACC1F9,#1D47A3",
    "#0E669A,#CED7CA,#DE7C45",
    "#101A23,#D5D1DA,#4C79A4",  
    "#105B7E,#71ADBE,#17C1E3",
    "#13396A,#CFBC73,#F94F7C",
    "#13678F,#EBF3F0,#92220D",
    "#151E1C,#B8E0DB,#7E7F66",
    "#173C4A,#95E7B0,#FB73EA",
    "#1A1A1A,#DBF1E3,black",
    "#1A3F26,#8BEC82,#13495E",
    "#1A7440,#ADCD8F,#2C451C",
    "#1B203D,#C1D4AD,#239A43",
    "#211CBE,#BFD5D1,#872975",
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
    "#39205D,#CAE0DD,#AA563F",
    "#3A4C72,#E8EDAD,#9E6D50",
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
    "#B59DA0,#4B314D,#F5962E",
    "#B7D079,#1A4578,#22B5A8",
    "#B9BBEE,#6E4D7B,#662C1D",
    "#B9D1C3,#69797B,#FC2F0A",
    "#BA9A3E,#413E29,#E09997",
    "#BAA12C,#50656B,#1DD8F5",
    "#BAA253,#284734,#833FF2",    
    "black,#33C195,#1F110F",
    "black,ivory,#0707bb",
    "black,white,black",
    "black,white,#E90255",
    "#C1D956,#1F173F,#79FF84",
    "#C2C9B8,#4A7546,#9DEDCC",
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
    "#D0BDC7,#110E41,#D0BDC7",
    "#D3A58B,#03406F,#89A6EF",
    "#D86207,#0A031E,#044BBA",
    "#D8F3E6,#298C2E,#E1C419",
    "#DAC390,#097EA5,#80E811",
    "#DF8A43,#31365C,#45F392",
    "#E09DE5,#722372,#0A9CF0",
    "#E0D4F7,#0E2D3B,#2C1FC7",
    "#E4D1DC,#000803,#AF6EB4",
    "#E4E1EE,#933B6E,#E4E1EE",
    "#E6D565,#480FAE,#14FCD9",
    "#E8CB72,#4457ED,#EECE6C",
    "#EAEFE4,#6777AC,#033326",
    "#EBE1E0,#811826,#1320B5",
    "#EC7703,#37036C,#D13124",
    "#ED363F,#13183F,#1EA143",
    "#EDD8B1,#BB5857,#A2D2C5",
    "#F4CC8E,#E70C1B,#E2E063",
    "#F6693B,#313E45,#9C5BB4",
    "#F8DCD1,#477192,#C1FDC9",
    "#F9BEB4,#A52E55,#F41281",
    "#F9CC8F,#62213B,#D0AD0F",
    "#FC99CB,#523270,#D2B9E2",
    "#FDDDF1,#2695A0,#C654E7",
    "#FFEA77,#25565C,#4FA96A",
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
        if (confirm("是否保存？")){
            if (Array.isArray(cs_id_list)){
                var blpara=[];
                for (let item of cs_id_list){
                    blpara.push(document.getElementById(item).value);
                }
                for (let item of cs_checkbox_list){
                    blpara.push(checkbox_kl_value_b(item)?1:0);
                }
                var bljg=blpara.join(' /// ');  //不能使用英文逗号，因为字体名称中可能会有英文逗号 - 保留注释
            }
            else {
                var bljg=document.getElementById(cs_id_list).value;
            }
            localStorage.setItem(savename,bljg);
        }
    }
    else if (cstype=='load'){
        var bljg=local_storage_get_b(savename);
        if (Array.isArray(cs_id_list)){
            var list_t=bljg.split(' /// ');
            if (list_t.length==cs_id_list.length+cs_checkbox_list.length){
                for (let blxl=0;blxl<cs_id_list.length;blxl++){
                    document.getElementById(cs_id_list[blxl]).value=list_t[blxl];
                }
                var bllen=cs_id_list.length;
                for (let blxl=0;blxl<cs_checkbox_list.length;blxl++){
                    checkbox_kl_color_b(cs_checkbox_list[blxl],list_t[bllen+blxl]);
                }
            }
            else {
                console.log(list_t.length,cs_id_list.length,cs_checkbox_list.length,bljg); //此行保留 - 保留注释
            }
        }
        else {
            document.getElementById(cs_id_list).value=bljg;
        }
    }
}

function highlight_oblong_span_b(ospan,ishover=true,cscolor=''){
    if (ishover){
        ospan.style.color=scheme_global['a-hover'];
        ospan.style.boxShadow='0.1rem 0.1rem 0.1rem '+scheme_global['shadow'];
    }
    else {
        ospan.style.color=cscolor;
        ospan.style.boxShadow='';
    }
}

function mouseover_mouseout_oblong_span_b(ospans){
    console.log(new Date(),'mouseover_mouseout_oblong_span_b',ospans.length);
    for (let one_span of ospans){
        one_span.setAttribute('onmouseover','javascript:highlight_oblong_span_b(this);');
        one_span.setAttribute('onmouseout','javascript:highlight_oblong_span_b(this,false,\''+one_span.style.color+'\');');
        one_span.style.cursor='pointer';
    }
}

function recent_search_b(localsavename,csstr,jsfunctionname,divname,commonlist=[],csmax=15,return_with_p=true,show_items=-1){
    function sub_recent_search_b_one_key(item,jsfunctionname){
        var str_t=item.replace(new RegExp(/\\/,'g'),'\\\\');
        str_t=str_t.replace(new RegExp('"','g'),'&quot;');
        str_t=str_t.replace(new RegExp("'",'g'),'\\\'');
        if (str_t.trim()==''){
            return '';
        }
        return '<span class="oblong_box" onclick="javascript:'+jsfunctionname+'(\''+str_t+'\');">'+specialstr_html_b(item)+'</span>&nbsp;'; //不能使用空格，而应该使用 &nbsp; - 保留注释
    }
    
    function sub_recent_search_b_key_replace(csstr){
        csstr=csstr.trim().replace(new RegExp("<",'g'),'&lt;');
        csstr=csstr.replace(new RegExp(">",'g'),'&gt;');
        //csstr=csstr.replace(new RegExp(/\\/,'g'),'\\\\');
        if (csstr=='(:r)'){
            csstr='';
        }
        return csstr;
    }
    //----------------------------------
    if (Array.isArray(csstr)){
        for (let blxl=0;blxl<csstr.length;blxl++){
            csstr[blxl]=sub_recent_search_b_key_replace(csstr[blxl]);
        }
        var list_t=[];
        for (let item of csstr){
            if (item=='' || list_t.includes(item)){continue;}
            list_t.push(item);
        }
        csstr=list_t;
    }
    else {
        csstr=sub_recent_search_b_key_replace(csstr);
    }
    
    var recent_search=local_storage_get_b(localsavename,csmax,true,csstr);
    var is_changed=false;
    if (csstr.length>0){
        if (Array.isArray(csstr)){
            recent_search=csstr.concat(recent_search);
        }
        else {
            recent_search=[csstr].concat(recent_search);
        }
        is_changed=true;
    }
    for (let item of commonlist){
        item=item.replace(new RegExp("<",'g'),'&lt;');
        item=item.replace(new RegExp(">",'g'),'&gt;');
        //item=item.replace(new RegExp(/\\/,'g'),'\\\\'); 
        if (recent_search.includes(item)){continue;}
        recent_search.push(item);
        is_changed=true;
    }
    if (is_changed){
        localStorage.setItem(localsavename,recent_search.join('\n'));
    }
    
    var recent_search_str='';
    if (return_with_p){
        recent_search_str='<p>';
    }
    
    if (show_items==-1){
        show_items=(ismobile_b()?5:10);
    }
    show_items=Math.min(recent_search.length,show_items);

    for (let blxl=0;blxl<show_items;blxl++){
        recent_search_str=recent_search_str+sub_recent_search_b_one_key(recent_search[blxl],jsfunctionname);
    }
    
    var recent_search_str2='';
    for (let blxl=show_items;blxl<recent_search.length;blxl++){
        recent_search_str2=recent_search_str2+sub_recent_search_b_one_key(recent_search[blxl],jsfunctionname);
    }
    
    if (recent_search_str2!==''){
        recent_search_str2='<span class="oblong_box" onclick="javascript:this.parentNode.querySelector(\'span.span_recent_search_more\').style.display=\'\';this.outerHTML=\'\';"> ... </span><span class="span_recent_search_more" style="display:none;word-break:break-all;word-wrap:break-word;">'+recent_search_str2+'</span>';
    }
    
    recent_search_str=recent_search_str+recent_search_str2;
    if (return_with_p){
        recent_search_str=recent_search_str+'</p>';
    }
    var odiv=document.getElementById(divname);
    if (odiv){
        odiv.innerHTML=recent_search_str;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    }
    return recent_search_str;
}

function page_one_b(pages_count,cspageno,current_no,span_script,show_number=3,interval_number=5,classname='aclick'){
    //pages_count 总页数；cspageno 加亮页号；current_no 当前循环页号；span_script 执行代码 - 保留注释
    var page_html='';
    if (current_no>1 && current_no<pages_count && Math.abs(cspageno-current_no)>show_number && current_no>show_number && pages_count-current_no>show_number){
        if (interval_number<=0 || current_no % interval_number !==0){
            page_html=page_html+'. . . ';
            return page_html;
        }
    }
    page_html=page_html+'<span class="'+classname+'" '+span_script+'>';
    if (current_no==cspageno){
        page_html=page_html+'<font color="'+scheme_global['a-hover']+'">'+current_no+'</font>';
    }
    else {
        page_html=page_html+current_no;
    }
    page_html=page_html+'</span> ';
    return page_html;
}

function page_prev_next_b(pages_count,cspageno,span_script_prev,span_script_next,span_script_location='',classname='aclick'){
    if (pages_count<=1){return '';}
    //pages_count 总页数；cspageno 加亮页号；span_script 执行代码 - 保留注释
    var page_html='';
    page_html=page_html+'<span class="'+classname+'" '+span_script_location+'>定位</span> ';
    
    if (cspageno>1){
        page_html=page_html+'<span class="'+classname+'" '+span_script_prev+'>prev</span> ';
    }
    else {
        page_html=page_html+'<span class="'+classname+'" style="color:'+scheme_global['memo']+';">prev</span> ';
    }
    if (cspageno<=pages_count-1){
        page_html=page_html+'<span class="'+classname+'" '+span_script_next+'>next</span> ';
    }
    else {
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
    while (true){
        if (page_html.includes('. . . . ')){
            page_html=page_html.replace(new RegExp(/(\. ){4}/,'g'),'. . . ');
        }
        else{break;}
    }
    return page_html;
}

function emoji_category_b(cstype,csno=false){
    var list_t=[''];
    switch (cstype){
        case 'vegetable':
            list_t=["💐","🌸","💮","🏵","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🌲","🌳","🌴","🌵","🌾","🌿","☘","🍀","🍁","🍂","🍃","🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🥝","🍅","🥥","🥑","🍆","🥔","🥕","🌽","🌶","🥒","🥬","🥦","🧄","🧅","🍄","🥜","🌰"];
            break;
        case 'food':
            list_t=["🍞","🥐","🥖","🥨","🥯","🥞","🧇","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🥙","🧆","🥚","🍳","🥘","🍲","🥣","🥗","🍿","🧈","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🦀","🦞","🦐","🦑","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","☕","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🧃","🧉"];
            break;
    }
    if (csno===-1){
        list_t.sort(randomsort_b);
        return list_t[0];
    }
    else if (csno<-1){
        return list_t;
    }
    else {
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
    
    var root = document.querySelector(":root");
    var oldsize=parseFloat(root.style.fontSize.trim().split('px')[0]);
    
    if (csask){
        var newsize=parseFloat((prompt('输入字号大小',oldsize) || '').trim());
        if (isNaN(newsize)){
            return;
        }
        increment=newsize-(oldsize-increment);
        root.style.fontSize=newsize.toFixed(2)+'px';
    }
    else {
        increment=increment+change_value;
        root.style.fontSize=(oldsize+change_value).toFixed(2)+'px';
    }
    localStorage.setItem('root_font_size_increment',increment);
}

function root_font_size_menu_b(csstr='',font_menu=true,full_screen_menu=true,remote_host_address=false){
    var list_t=[];
    if (font_menu){
        list_t=list_t.concat(['<span class="span_menu" onclick="javascript:'+csstr+'root_font_size_change_b(0.5);">字号+</span>', 
        '<span class="span_menu" onclick="javascript:'+csstr+'root_font_size_change_b(-0.5);">字号-</span>', 
        '<span class="span_menu" onclick="javascript:'+csstr+'root_font_size_change_b(false);">默认字号大小</span>', 
        '<span class="span_menu" onclick="javascript:'+csstr+'root_font_size_change_b(0,true);">指定字号</span>',
        ]);
    }
    if (full_screen_menu){
        list_t=list_t.concat(['<span class="span_menu" onclick="javascript:'+csstr+'body_fullscreen_b();">fullscreen</span>']);
    }
    if (remote_host_address){
        list_t=list_t.concat(['<span class="span_menu" onclick="javascript:'+csstr+'kl_remote_host_address_b();">设置form发送地址</span>']);
    }
    return list_t;
}

function body_fullscreen_b(){
    if (document.fullscreenElement==null){
        document.documentElement.requestFullscreen();
    } 
    else {
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

function obj_search_show_hide_b(objs,subobj_querystr='',cskey='',csreg=false,checkreg=false){   
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
        return;
    }
    for (let item of objs){
        var bltext='';
        if (subobj_querystr==''){
            bltext=item.innerText.trim();
        }
        else {
            var osub=item.querySelector(subobj_querystr);
            if (osub){
                bltext=osub.innerText.trim();
            }
        }
        var blfound=str_reg_search_b(bltext,cskey,csreg);
        if (blfound==-1){break;}
        if (blfound){
            item.style.display='';
        }
        else {
            item.style.display='none';
        }    
    }
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
        var blm=date_2_ymd_b(false,'M');
        var bls=date_2_ymd_b(false,'s');
        var blinterval=kl_alarm_interval_global - blm % kl_alarm_interval_global;
        kl_alarm_obj_global=setInterval(alarm_interval_sound_b,Math.max(0,blinterval*60*1000-bls*1000));   //不能使用setTimeout，有可能重复运行 - 保留注释
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
        setTimeout(sub_alarm_interval_sound_b_one_sound,1000);
    }
    //-----------------------------------------
    if (kl_alarm_interval_global==-1){
        return;
    }
    var sound_list=['elephant','ding','drop','flash','whistle','dududu'];
    var blm=date_2_ymd_b(false,'M');
    if (blm % 5 == 0 && blm % kl_alarm_interval_global == 0){
        var blstr=('0'+blm).slice(-2,);
        var sound_type=[sound_list[parseInt(blstr.slice(0,1))],sound_list[parseInt(blstr.slice(-1,))]];
        var blxl=0;
        sub_alarm_interval_sound_b_one_sound();
    }
    else {
        sub_alarm_interval_sound_b_next();
    }
}

function alarm_interval_set_b(csinterval=5){
    if (csinterval==0){
        if (typeof(kl_alarm_interval_global) == 'undefined'){
            var blvalue='5';
        }
        else {
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
        console.log('整点报时停止');
        return;
    }
    console.log('整点报时('+csinterval+')开始');
    kl_alarm_interval_global=csinterval;    //全局变量 - 保留注释
    alarm_interval_sound_b();
}
