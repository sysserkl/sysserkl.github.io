function list_colorpicker(){
    show_name_color_global=!show_name_color_global;
    if (show_name_color_global){
        var list_t=color_name2hex_b('ALLKEYS');
    } else {
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
    var bt_style='position:relative;float:left;width:'+div_w+'px;height:'+div_h+'px;margin:5px;font-size:0.8rem;cursor:pointer;';    
    for (var item of list_t){
        bljg=bljg+'<div id="div_'+item+'" style="'+bt_style+'background-color:'+item+';" onclick="show_hide_name_colorpicker(\'div_'+item+'\');"><div class="div_rgb" style="color:'+item+';background-color:silver;padding:0 0.1rem;display:none;"></div></div>';
    } 
    
    var bt_style=bt_style+'font-weight:bold;';
    var buttons='<button style="'+bt_style+'" onclick="show_hide_name_colorpicker();" title="show / hide">S</button>';
    buttons=buttons+'<button style="'+bt_style+'" onclick="list_colorpicker();">A/N</button>';
    buttons=buttons+'<select style="'+bt_style+'" onchange="copy_colorpicker(this.value);"><option></option><option>name</option><option>rgb</option><option>hex</option><option>all</option></select>';

    document.getElementById('div_cp').innerHTML=bljg+buttons;
}

function copy_colorpicker(cstype){
    if (cstype==''){return;}
    var blno=['name','rgb','hex'].indexOf(cstype);
    
    var odivs=document.querySelectorAll('div.div_rgb');
    var result_t=[];
    for (let adiv of odivs){
        if (adiv.style.display=='none'){continue;}
        if (blno==-1){
            result_t.push(adiv.innerText);
        } else {
            var list_t=adiv.innerText.split('; ')        
            result_t.push(list_t[blno]);
        }
    }
    if (result_t.length==0){return;}
    alert(result_t.join('\n'));
}

function show_hide_name_colorpicker(csid=''){
    if (csid==''){
        var ocolors=document.getElementsByClassName('div_rgb');
    } else {
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
            
            if (colorname1==colorname2){
                colorname1='';
            }
            //if (colorname1==colorname3){
                //colorname3='';
            //}
            item.innerHTML=colorname1+'; '+colorname2+'; '+colorname3;
            item.style.color='';
            item.style.display='block';
        } else {
            item.style.display='none';
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
