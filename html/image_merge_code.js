function sort_merge_img(cstype){
    switch (cstype){
        case 'asc':
            img_file_list_global.sort(function (a,b){return a.fileName<b.fileName ? 1 : -1;});
            break;
        case 'desc':
            img_file_list_global.sort(function (a,b){return a.fileName>b.fileName ? 1 : -1;});        
            break;
    }
    read_merge_img();
}

function init_merge_img(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    var input_list=[
    ['input_max_width',5,0.5],
    ['input_max_height',5,0.5],
    ['input_span',5,0.5],
    ['input_margin',5,0.5],
    ['input_bgcolor',8,0.5],
    ];
    
    input_size_b(input_list,'id');
    menu_merge_img();
}

function menu_merge_img(){
    var str_t=klmenu_hide_b('');

    var klmenu2=[
    '<span class="span_menu">保存图片类型：<select  id="select_canvas_save_type"><option>jpeg</option><option>png</option></select></span>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu2,'⚙','15rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function step_merge_img(){            
    imagesLoaded_global += 1;
    if (imagesLoaded_global == img_len_global){
        read_merge_img();
    }
}

function check_merge_img(){
    var limited_width=parseInt(document.getElementById('input_max_width').value.trim());
    var limited_height=parseInt(document.getElementById('input_max_height').value.trim());
    var blspan=parseInt(document.getElementById('input_span').value.trim());
    var blmargin=parseInt(document.getElementById('input_margin').value.trim());
    
    if (isNaN(limited_width) || isNaN(limited_height) || isNaN(blspan) || isNaN(blmargin)){
        document.getElementById('divhtml').innerHTML='格式错误';
        return [false,false,false,false];
    }
    return [limited_width,limited_height,blspan,blmargin];
}

function size_merge_img(limited_width=-1,limited_height=-1){
    var max_width=0;
    var max_height=0;
    var min_width=0;
    var min_height=0;
    var sum_width=0;
    var sum_height=0;
    for (let one_img of img_file_list_global){
        var doresize=false;
        var resize_w=0;
        var resize_h=0;
        [resize_w,resize_h,doresize]=resize_img_check_b(one_img,limited_width,limited_height);
        
        max_width=(max_width>0?Math.max(max_width,resize_w):resize_w);
        max_height=(max_height>0?Math.max(max_height,resize_h):resize_h);        
        min_width=(min_width>0?Math.min(min_width,resize_w):resize_w);
        min_height=(min_height>0?Math.min(min_height,resize_h):resize_h);
        sum_width=sum_width+resize_w;
        sum_height=sum_height+resize_h;
    }
    
    if (limited_width==-1 && limited_height==-1){
        var ospan=document.getElementById('span_status');
        ospan.innerHTML='width: '+min_width+' - '+max_width+' height: '+min_height+' - '+max_height;
    }
    return [max_width, max_height, min_width, min_height, sum_width, sum_height];
}

function read_merge_img(){
    if (img_len_global==0){return;}
    
    var limited_width;
    var limited_height;
    var blspan;
    var blmargin;
    [limited_width,limited_height,blspan,blmargin]=check_merge_img();
    if (limited_width===false){return;}

    size_merge_img();
    
    var max_width=0;
    var max_height=0;
    var min_width=0;
    var min_height=0;
    var sum_width=0;
    var sum_height=0;
    [max_width, max_height, min_width, min_height, sum_width, sum_height]=size_merge_img(limited_width,limited_height);
    var vh=document.getElementById('select_vh').value;
    
    var ocanvas = document.getElementById('canvas');
    
    if (vh=='vertical'){
        ocanvas.width=max_width+blmargin*2;
        ocanvas.height=sum_height+(img_file_list_global.length-1)*blspan+blmargin*2;
    } else {
        ocanvas.width=sum_width+(img_file_list_global.length-1)*blspan+blmargin*2;
        ocanvas.height=max_height+blmargin*2;
    }
    document.getElementById('span_canvas_info').innerText='canvas: '+ocanvas.width+'w, '+ocanvas.height+'h';
    var ctx = ocanvas.getContext('2d');   
    
    var bgcolor=document.getElementById('input_bgcolor').value.trim();
    ctx.fillStyle = (bgcolor==''?'white':bgcolor);
    ctx.fillRect(0,0,ocanvas.width,ocanvas.height);
    
    var blleft=blmargin;
    var bltop=blmargin;
    var align_type=document.getElementById('select_align').value;
    for (let one_img of img_file_list_global){   
        var doresize=false;
        var resize_w=0;
        var resize_h=0;
        [resize_w,resize_h,doresize]=resize_img_check_b(one_img,limited_width,limited_height);
        if (vh=='vertical'){
            ctx.drawImage(one_img, 0, 0,one_img.width,one_img.height,align_merge_img(ocanvas.width,resize_w,align_type),bltop,resize_w,resize_h);
            bltop=bltop+resize_h+blspan;
        } else {
            ctx.drawImage(one_img, 0, 0,one_img.width,one_img.height,blleft,align_merge_img(ocanvas.height,resize_h,align_type),resize_w,resize_h);
            blleft=blleft+resize_w+blspan;        
        }
    }
    
    var imgtype=document.getElementById('select_canvas_save_type').value;
    var img = ocanvas.toDataURL('image/'+imgtype);
    document.getElementById('divhtml').innerHTML='<img src="' + img + '" style="max-width:900px;max-height:1400px;" />';        
}

function align_merge_img(canvas_size,imgsize,align_type){
    var blvalue=0;
    switch (align_type){
        case 'r':
            blvalue=canvas_size-imgsize;
            break;
        case 'c':
            blvalue=(canvas_size-imgsize)/2;
            break;
    }
    return blvalue;
}

function upload_merge_img(){
    if (check_merge_img()[0]===false){return;}
    
    img_len_global=0;
    img_file_list_global=[];
    imagesLoaded_global=0;
    
    var oimgs=document.getElementById('input_img').files;
    var result_t=[];
    for (let blxl=0,lent=oimgs.length;blxl<lent;blxl++){
        var ofile=oimgs[blxl];
        
        var error=upload_img_file_check_b(ofile);
        if (error!==''){
            document.getElementById('divhtml').innerHTML=error;
            return;        
        }            
        
        result_t.push(blxl);
    }
    
    result_t=result_t.slice(0,20);
    img_len_global=result_t.length;
    for (let item of result_t){
        var ofile=oimgs[item];
        var imgFile = new FileReader();
        imgFile.fileName = ofile.name;
        imgFile.readAsDataURL(ofile); 
        imgFile.onload = function (){
            var oimg=new Image();
            oimg.fileName=this.fileName;
            oimg.onload = function (){
                img_file_list_global.push(this);
                step_merge_img();
            }
            oimg.src=this.result;            
        }
    }
}
