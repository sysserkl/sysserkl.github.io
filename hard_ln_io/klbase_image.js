function img_size_get_b(obj_img,use_natural){
    if (use_natural){
        var blw=obj_img.naturalWidth || obj_img.width;
        var blh=obj_img.naturalHeight || obj_img.height;    
    } else {
        var blw=obj_img.width;
        var blh=obj_img.height;        
    }
    return [blw,blh];
}

function resize_img_check_b(oimg,csmaxwidth=-1,csmaxheight=-1,use_natural=false){    
    var resize_w, resize_h;
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

function resize_one_img_b(oimg,csmaxwidth,csmaxheight,return_type,use_natural=false){
    var resize_w, resize_h, doresize;
    [resize_w,resize_h,doresize]=resize_img_check_b(oimg,csmaxwidth,csmaxheight,use_natural);

    if (doresize===false){return false;}
    return image_2_canvas_img_b(oimg,return_type,'',use_natural,resize_w,resize_h);
}

function resize_batch_imgs_b(oimgs,new_width=false,alert_id=''){
    function sub_resize_batch_imgs_b_one(){
        if (blxl>=bllen){
            var blstr='操作完成，一共有'+bllen+'张图片，调整了'+changed+'张';
            if (alert_id!==''){
                js_alert_b(blstr,alert_id);
            }
            return;
        }
        
        var one_img=oimgs[blxl];
        var list_t=resize_one_img_b(one_img,new_width,-1,'canvas',true);
        if (list_t!==false){
            var ocanvas=list_t[0];
            one_img.setAttribute('src',ocanvas.toDataURL('image/jpeg'));    
            changed=changed+1;
        }
        blxl=blxl+1;
        setTimeout(sub_resize_batch_imgs_b_one,10);
    }
    //-----------------------
    if (new_width===false){
        new_width=prompt('输入最大宽度','1600');
    }
    if (new_width==null){return;}
    
    new_width=new_width.trim();
    if (new_width=='' || isNaN(new_width)){return;}
    new_width=parseInt(new_width);
    
    var blxl=0;
    var bllen=oimgs.length;
    var changed=0;
    sub_resize_batch_imgs_b_one();
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
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        var blat=item.indexOf(cstype+'(');
        if (blat==0 && item.slice(-2,)=='%)'){
            if (new_value===false){
                blvalue=parseInt(item.slice(blat+cstype.length+1,-2));
            } else {
                if (new_value==0){
                    list_t[blxl]='';
                } else {
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
    } else {
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
    } else {
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
            js_alert_b(blstr,alert_info_id);
            
            console.log('img2base64_kleditor() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        
        var blsrc=oimgs[blxl].src;
        if (blsrc){
            if (blsrc.substring(0,11).toLowerCase()!=='data:image/'){
                if (blsrc.slice(-4,).toLowerCase()=='.gif' && location.href.substring(0,5)!=='file:'){
                    fetch_file_data_b(blsrc,oimgs[blxl],'src');
                } else {
                    ocanvas=image_2_canvas_img_b(oimgs[blxl],'canvas')[0];
                    oimgs[blxl].setAttribute('src',ocanvas.toDataURL('image/jpeg'));
                }
                changed=changed+1;
            } else {
                unchanged=unchanged+1;
            }
        }
        blxl=blxl+1;
        setTimeout(sub_img2base64_b_one_img,100);        
    }
    //-----------------------
    if (!confirm('是否转换图片为base64格式？')){return;}
    
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
            } else {
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
    } else {
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
    for (let blxl = 0,lent= data.length; blxl <lent; blxl += 4){
        [r, g, b] = [data[blxl], data[blxl + 1], data[blxl + 2]];
        var gray = 0.299 * r + 0.587 * g + 0.114 * b; // 计算灰度值。在图像处理中，灰度化是将彩色图像转换为灰度图像的过程，即将每个像素点的RGB值转换为一个灰度值。常用的灰度化方法有平均值法、加权平均法、最大值法和最小值法等。其中，0.299、0.587、0.114是RGB三个颜色通道的权值比例，这些权值比例是经过科学实验得到的最佳值，使得转换后的灰度图像最能够反映彩色图像的亮度和对比度信息。在灰度化过程中，将每个像素点的RGB值乘以对应的权值比例，然后将三个结果相加，得到该像素点的灰度值。这个灰度值可以用来代替原来的RGB值，从而得到灰度图像。
        data[blxl] = gray;
        data[blxl + 1] = gray;
        data[blxl + 2] = gray;
    }
    
    if (white_and_black){
        for (let blxl = 0,lent= data.length; blxl <lent; blxl += 4){
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
    var x = event.clientX - oimg.x;//oimg.offsetLeft;// - (oimg.offsetWidth-oimg.width)/2;
    var y = event.clientY - oimg.y;//oimg.offsetTop;// - (oimg.offsetHeight-oimg.height)/2;
    
    //以下几行保留 - 保留注释
    //console.log('--------------');
    //console.log('oimg.naturalWidth, oimg.naturalHeight',oimg.naturalWidth,oimg.naturalHeight);
    //console.log('oimg.width, oimg.height',oimg.width,oimg.height);
    
    //console.log('offsetLeft, offsetTop',oimg.offsetLeft,oimg.offsetTop);    
    //console.log('offsetWidth, offsetHeight',oimg.offsetWidth,oimg.offsetHeight);

    //console.log('event.clientX, event.clientY',event.clientX,event.clientY);    
    //console.log('img.x, img.y',oimg.x,oimg.y);
    //console.log('event.clientX - oimg.x, event.clientY - oimg.y',x,y);

    //console.log('ratio',oimg.naturalWidth/oimg.width,oimg.naturalHeight/oimg.height);
    //console.log('rect',oimg.getBoundingClientRect());
    return [Math.round(x*oimg.naturalWidth/oimg.offsetWidth),Math.round(y*oimg.naturalHeight/oimg.offsetHeight)];
}

function imgs_min_max_size_b(oimgs){
    var blwidth=new Set();
    var blheight=new Set();
    for (let one_img of oimgs){
        blwidth.add(one_img.naturalWidth);
        blheight.add(one_img.naturalHeight);
    }
    if (blwidth.size=0 || blheight.size==0){return '';}
    
    var blmin='min wh: '+Math.min(...blwidth)+'x'+Math.min(...blheight);
    var blmax='max wh: '+Math.max(...blwidth)+'x'+Math.max(...blheight);
    return blmin+'\n'+blmax;
}

function img_split_list_get_b(oimg,split_width=0,split_height=0,only_2=false,csmax=10){
    if (split_width<=0){
        split_width=oimg.width;
    }
    if (split_height<=0){
        split_height=oimg.height;
    }

    if (split_width<1){
        split_width=split_width*oimg.width;
    }
    if (split_height<1){
        split_height=split_height*oimg.height;
    }
    
    var error='';
    if (oimg.width<split_width || oimg.height<split_height){
        error='尺寸超出';
    } else if (oimg.width==split_width && oimg.height==split_height){
        error='尺寸一致';
    } else if (only_2===false && (oimg.width/split_width>csmax || oimg.height/split_height>csmax)){
        error='超出'+csmax+'份';
    }

    if (error!==''){
        return [error,[]];
    }
    
    var list_t=[];
    var new_w=0;
    var new_h=0;
    if (only_2){
        for (let blr=0;blr<oimg.height;blr=blr+split_height){
            for (let blc=0;blc<oimg.width;blc=blc+split_width){    
                if (blr>0){
                    new_h=oimg.height-blr;
                } else {
                    new_h=Math.min(split_height,oimg.height-blr);
                }
                if (blc>0){
                    new_w=oimg.width-blc;
                } else {
                    new_w=Math.min(split_width,oimg.width-blc);
                }
                list_t.push([blc,blr,new_w,new_h]);
                if (blc>0){break;}
            }
            if (blr>0){break;}
        } 
    } else {
        for (let blr=0;blr<oimg.height;blr=blr+split_height){
            for (let blc=0;blc<oimg.width;blc=blc+split_width){
                new_w=Math.min(split_width,oimg.width-blc);
                new_h=Math.min(split_height,oimg.height-blr);
                list_t.push([blc,blr,new_w,new_h]);
            }
        }
    }
    return [error,list_t];
}

function img_split_canvas_b(oimg,ocanvas,ctx,one_part,csext='jpeg'){
    ocanvas.width=one_part[2];
    ocanvas.height=one_part[3];
    ctx.drawImage(oimg, one_part[0],one_part[1], one_part[2], one_part[3], 0,0, one_part[2], one_part[3]);
    return ocanvas.toDataURL('image/'+csext);
}
