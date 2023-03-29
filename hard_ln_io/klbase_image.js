function img_size_get_b(obj_img,use_natural){
    if (use_natural){
        var blw=obj_img.naturalWidth || obj_img.width;
        var blh=obj_img.naturalHeight || obj_img.height;    
    }
    else {
        var blw=obj_img.width;
        var blh=obj_img.height;        
    }
    return [blw,blh];
}

function resize_img_check_b(oimg,csmaxwidth=-1,csmaxheight=-1,use_natural=false){    
    [resize_w,resize_h]=img_size_get_b(oimg,use_natural);
    
    var blratio_wh=resize_w/resize_h;
    var blratio_hw=resize_h/resize_w;
    var doresize=false;

    if (csmaxwidth>0 && resize_w>=csmaxwidth){
        resize_w = csmaxwidth;
        resize_h = Math.floor(resize_w*blratio_hw);
        doresize=true;
    }

    if (csmaxheight>0 && resize_h>=csmaxheight){
        resize_h=csmaxheight;
        resize_w=Math.floor(resize_h*blratio_wh);
        doresize=true;
    }
    return [resize_w,resize_h,doresize];
}

function resize_img_convert_b(oimg,csmaxwidth,csmaxheight,return_type,use_natural=false){
    var resize_w;
    var resize_h;
    var doresize;
    [resize_w,resize_h,doresize]=resize_img_check_b(oimg,csmaxwidth,csmaxheight,use_natural);

    if (doresize===false){return false;}
    return image_2_canvas_img_b(oimg,return_type,'',use_natural,resize_w,resize_h);
}

function filter_form_img_b(csjs1='',csjs2=''){
    var bljg='<select id="select_img_filter_dom_b" onchange="filter_select_value_img_b();">\n';
    for (let item of ['brightness', 'contrast', 'grayscale', 'invert', 'opacity', 'saturate', 'sepia',]){
        bljg=bljg+'<option>'+item+'</option>\n';
    }
    bljg=bljg+'</select>\n';
    bljg=bljg+'<input type="range" min=0 max=100 value=0 id="range_img_filter_dom_b" style="width:10rem;"  oninput="filter_select_value_img_b(this.value);'+csjs1+'">\n';
    bljg=bljg+'<span id="span_img_filter_dom_b">0%</span>\n';
    bljg=bljg+'<input type="text" id="input_img_filter_dom_b" />\n';
    if (csjs2!==''){
        bljg=bljg+'<span class="oblong_box" onclick="'+csjs2+'">filter</span>\n';
    }
    return bljg;
}

function filter_select_value_img_b(new_value=false){
    var cstype=document.getElementById('select_img_filter_dom_b').value;
    var oinput=document.getElementById('input_img_filter_dom_b');
    var list_t=oinput.value.trim().split(' ');
    var blvalue=0;
    var blfound=false;
    for (let blxl=0;blxl<list_t.length;blxl++){
        var item=list_t[blxl];
        var blat=item.indexOf(cstype+'(');
        if (blat==0 && item.slice(-2,)=='%)'){
            if (new_value===false){
                blvalue=parseInt(item.slice(blat+cstype.length+1,-2));
            }
            else {
                if (new_value==0){
                    list_t[blxl]='';
                }
                else {
                    list_t[blxl]=cstype+'('+new_value+'%)';
                }
                blvalue=new_value;
            }
            blfound=true;
            break;
        }
    }
    if (new_value!==false){
        if (blfound===false){
            blvalue=new_value;
            list_t.push(cstype+'('+new_value+'%)');
        }
        var newlist=[];
        for (let item of list_t){
            if (item==''){continue;}
            newlist.push(item);
        }
        oinput.value=newlist.join(' ');
    }
    document.getElementById('range_img_filter_dom_b').value=blvalue;
    document.getElementById('span_img_filter_dom_b').innerHTML=blvalue+'%';
}

function image_2_canvas_img_b(obj_img,return_type='jpeg',csfilter='',use_natural=true,new_width=-1,new_height=-1){
    var blw;
    var blh;
    [blw,blh]=img_size_get_b(obj_img,use_natural);

    var canvas = document.createElement('canvas');    
    
    if (new_width<=0 || new_height<=0){
        canvas.width = blw;
        canvas.height = blh;
    }
    else {
        canvas.width = new_width;
        canvas.height = new_height;    
    }
    var ctx=canvas.getContext('2d');    
    if (csfilter!==''){
        ctx.filter = csfilter;
    }
    
    //先设置 filter，再 draw - 保留注释
    if (new_width<=0 || new_height<=0){
        ctx.drawImage(obj_img, 0, 0, blw, blh);
    }
    else {
        ctx.drawImage(obj_img, 0, 0, blw, blh, 0,0, new_width, new_height);
    }
    switch (return_type){
        case 'canvas':
            return [canvas,ctx];
            break;
        case 'png':
            return canvas.toDataURL('image/png');    
            break;
        default:
            return canvas.toDataURL('image/jpeg');
            break;
    }
}

function img2base64_b(oimgs,alert_info_id=''){
    function sub_img2base64_b_one_img(){
        if (blxl>=bllen){
            var blstr='操作完成，一共有'+bllen+'张图片，转换了'+changed+'张，无需转换'+unchanged+'张';
            if (alert_info_id=='alert'){
                alert(blstr);
            }
            else if (alert_info_id!==''){
                js_alert_b(blstr,alert_info_id);
            }
            
            console.log('img2base64_kleditor() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        
        var blsrc=oimgs[blxl].src;
        if (blsrc){
            if (blsrc.substring(0,11).toLowerCase()!=='data:image/'){
                if (blsrc.slice(-4,).toLowerCase()=='.gif' && location.href.substring(0,5)!=='file:'){
                    fetch_file_data_b(blsrc,oimgs[blxl],'src');
                }
                else {
                    ocanvas=image_2_canvas_img_b(oimgs[blxl],'canvas')[0];
                    oimgs[blxl].setAttribute('src',ocanvas.toDataURL('image/jpeg'));
                }
                changed=changed+1;
            }
            else {
                unchanged=unchanged+1;
            }
        }
        blxl=blxl+1;
        setTimeout(sub_img2base64_b_one_img,100);        
    }
    //-------------------------------
    var bllen=oimgs.length;
    var blxl=0;
    var changed=0;
    var unchanged=0;
    var ocanvas;
    var t0 = performance.now();
    sub_img2base64_b_one_img();
}

function filter_str_img_b(csstr){
    if (csstr=='BIGPHOTO'){
        csstr='///\\s([7-9][0-9]{2,}|\\d{4,})\\s([6-9][0-9]{2}|[1-9][0-9]{3,})\\s[0-2]\\s?$';
    }
    return csstr;
}

function filter_array_img_b(csarray,filter_str){
    filter_str=filter_str_img_b(filter_str);     
    if (filter_str!==''){
        var list_t=[];
        for (let item of csarray){
            if (item.includes(' /// ')){
                if (item.match(filter_str)){
                    list_t.push(item);
                }
            }
            else {
                list_t.push(item);
            }
        }
        return list_t;
    }
    return csarray;
}
