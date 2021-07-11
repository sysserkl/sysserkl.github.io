function list_colorpicker(cstype="name"){
    if (cstype=='name'){
        var list_t=["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkGrey","DarkKhaki","DarkMagenta","DarkOliveGreen","DarkOrange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","Goldenrod","Gray","Green","GreenYellow","Grey","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGreen","LightGrey","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","RebeccaPurple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
    }
    else {
        var list_t=all_colors_colorpicker();
    }
    
    var list_length=list_t.length+3;
    var window_w=document.body.offsetWidth;
    var window_h=document_body_offsetHeight_b();
    var rows=Math.ceil(Math.sqrt(list_length*window_h/window_w));
    var cols=Math.ceil(list_length/rows);

    var div_w=parseInt(window_w/cols-10);
    var div_h=parseInt(window_h/rows-10);
    var bljg='';
    for (var item of list_t){
        bljg=bljg+'<div id="div_'+item+'" style="position:relative;float:left;width:'+div_w+'px;height:'+div_h+'px;margin:5px;background-color:'+item+';font-size:0.8rem;cursor:pointer;" onclick="javascript:show_hide_name_colorpicker(\'div_'+item+'\');"><div class="div_rgb" style="color:'+item+';background-color:silver;padding:0 0.1rem;display:none;"></div></div>';
    } 
    
    var buttons='<button style="position:relative;float:left;width:'+div_w+'px;height:'+div_h+'px;margin:5px;font-size:0.8rem;cursor:pointer;font-weight:600;" onclick="javascript:show_hide_name_colorpicker();" title="show / hide">S</button>';
    buttons=buttons+'<button style="position:relative;float:left;width:'+div_w+'px;height:'+div_h+'px;margin:5px;font-size:0.8rem;cursor:pointer;font-weight:600;" onclick="javascript:list_colorpicker(\'\');" title="color all">A</button>';
    buttons=buttons+'<button style="position:relative;float:left;width:'+div_w+'px;height:'+div_h+'px;margin:5px;font-size:0.8rem;cursor:pointer;font-weight:600;" onclick="javascript:list_colorpicker();" style="color name">N</button>';
    
    document.getElementById('div_cp').innerHTML=bljg+buttons;

}

function show_hide_name_colorpicker(csid=""){
    if (csid==""){
        var ocolors=document.getElementsByClassName('div_rgb');
    }
    else {
        var ocolors=document.getElementById(csid).getElementsByClassName('div_rgb');
    }

    var blshow=false;
    if (ocolors[0].style.display=='none'){ 
        blshow=true;
    }

    for (var item of ocolors){
        item.style.color=item.parentNode.style.backgroundColor;
        if (blshow){ 
            var colorname1=item.parentNode.style.backgroundColor;
            var colorname2=window.getComputedStyle(item).color;
            if (colorname1.substring(0,4)=='rgb(' && colorname1.slice(-1)==')'){
                colorname1=colorname1.slice(4,colorname1.length-1);
            }
            if (colorname2.substring(0,4)=='rgb(' && colorname2.slice(-1)==')'){
                colorname2=colorname2.slice(4,colorname2.length-1);
            }
            var colorname3='';
            var list_t=colorname2.split(',');
            
            if (list_t.length==3){
                colorname3=rgb2hex_b(list_t);
            }
            
            if (colorname1==colorname2){colorname2='';}
            if (colorname1==colorname3){colorname3='';}
            item.innerHTML=colorname1+' '+colorname2+' ('+colorname3+')';
            item.style.color="";
            item.style.display="block";
        }
        else {
            item.style.display="none";
        }
    }
}

function all_colors_colorpicker(colorcount=216){
    colorcount=Math.min(1000,Math.max(3,colorcount));
    var blonecolorcount=parseInt(Math.cbrt(colorcount));
    var blinterval=parseInt(256/(blonecolorcount-1));
    var list_t=[];
    for (var blr=0;blr<=255;blr=blr+blinterval){
        for (var blg=0;blg<=255;blg=blg+blinterval){
            for (var blb=0;blb<=255;blb=blb+blinterval){
                list_t.push(rgb2hex_b([blr,blg,blb]));
            }
        }
    }
    return list_t;
}
