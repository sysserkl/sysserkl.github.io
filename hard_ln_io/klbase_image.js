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

function upload_img_file_check_b(ofile,cssize=30*1024*1024){
    if (!ofile){
        return '未发现图片文件';
    }
    if (ofile.type.substring(0,6)!=='image/'){
        return '非图片文件：'+ofile.name+' '+ofile.type;
    }
    if (ofile.size>cssize){
        return '文件太大：'+ofile.name+' '+ofile.size;  
    }
    return '';
}

function qr_read_b(oimg){
    var icanvas = document.createElement('canvas');    
    icanvas.width=oimg.naturalWidth || oimg.width;
    icanvas.height=oimg.naturalHeight || oimg.height;

    var ictx = icanvas.getContext('2d');
    ictx.drawImage(oimg, 0, 0,oimg.naturalWidth,oimg.naturalHeight,0,0,icanvas.width,icanvas.height);
    var iimageData = ictx.getImageData(0,0, icanvas.width, icanvas.height);

    var ode = jsQR(iimageData.data, oimg.naturalWidth, oimg.naturalHeight);
    if (ode){
        return ode.data;        
    }
    else {
        return '';
    }    
}

function grey_img_b(img_original_obj,ocanvas,ctx,white_and_black=false){
    // 将图像绘制到canvas上
    ocanvas.width = img_original_obj.width;
    ocanvas.height = img_original_obj.height;
    ctx.drawImage(img_original_obj, 0, 0, ocanvas.width, ocanvas.height);

    // 获取图像数据
    const imageData = ctx.getImageData(0, 0, ocanvas.width, ocanvas.height);
    const data = imageData.data;

    // 将图像转换为黑白二色
    var r,g,b;
    for (let blxl = 0; blxl < data.length; blxl += 4){
        [r, g, b] = [data[blxl], data[blxl + 1], data[blxl + 2]];
        var gray = 0.299 * r + 0.587 * g + 0.114 * b; // 计算灰度值。在图像处理中，灰度化是将彩色图像转换为灰度图像的过程，即将每个像素点的RGB值转换为一个灰度值。常用的灰度化方法有平均值法、加权平均法、最大值法和最小值法等。其中，0.299、0.587、0.114是RGB三个颜色通道的权值比例，这些权值比例是经过科学实验得到的最佳值，使得转换后的灰度图像最能够反映彩色图像的亮度和对比度信息。在灰度化过程中，将每个像素点的RGB值乘以对应的权值比例，然后将三个结果相加，得到该像素点的灰度值。这个灰度值可以用来代替原来的RGB值，从而得到灰度图像。
        data[blxl] = gray;
        data[blxl + 1] = gray;
        data[blxl + 2] = gray;
    }
    
    if (white_and_black){
        for (let blxl = 0; blxl < data.length; blxl += 4){
            var gray = data[blxl];
            var bw = gray > 128 ? 255 : 0; // 将灰度值大于128的像素点设为白色，否则设为黑色
            data[blxl] = bw;
            data[blxl + 1] = bw;
            data[blxl + 2] = bw;
        }    
    }
    // 将处理后的图像数据绘制回canvas
    ctx.putImageData(imageData, 0, 0);
}

function img_xy_b(event,oimg){
    var x = event.clientX - oimg.x;//offsetLeft;// - (oimg.offsetWidth-oimg.width)/2;
    var y = event.clientY - oimg.y;//offsetTop;// - (oimg.offsetHeight-oimg.height)/2;
    
    //以下几行保留 - 保留注释
    //console.log('--------------');
    //console.log('n',oimg.naturalWidth,oimg.naturalHeight);
    //console.log('wh',oimg.width,oimg.height);
    //console.log('o',oimg.offsetWidth,oimg.offsetHeight);
    //console.log('xy',x,y);
    //console.log('lx,ty',oimg.offsetLeft,oimg.x,oimg.offsetTop,oimg.y);
    //console.log('ratio',oimg.naturalWidth/oimg.width,oimg.naturalHeight/oimg.height);
    //console.log('rect',oimg.getBoundingClientRect());
    return [Math.round(x*oimg.naturalWidth/oimg.offsetWidth),Math.round(y*oimg.naturalHeight/oimg.offsetHeight)];
}


