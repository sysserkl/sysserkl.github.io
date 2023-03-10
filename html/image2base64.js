function split_klbase64(oimg){
    var split_width=parseInt(document.getElementById('input_split_width').value);
    var split_height=parseInt(document.getElementById('input_split_height').value);
    if (split_width<=0){
        split_width=oimg.width;
    }
    if (split_height<=0){
        split_height=oimg.height;
    }

    var doresize=false;
    var bljg='';
    if (oimg.width<split_width || oimg.height<split_height){
        doresize=false;
        bljg='尺寸超出';
    }
    else if (oimg.width==split_width && oimg.height==split_height){
        doresize=false;
        bljg='尺寸一致';
    }
    else if (oimg.width/split_width>10 || oimg.height/split_height>10) {
        doresize=false;
        bljg='超出10份';
    }
    else {
        doresize=true;
    }

    if (doresize){
        var max_width=(ismobile_b()?'max-width:80%;':'');
        var odiv=document.getElementById('div_split');
        var list_t=[];
        for (let blr=0;blr<oimg.height;blr=blr+split_height){
            for (let blc=0;blc<oimg.width;blc=blc+split_width){
                var new_w=Math.min(split_width,oimg.width-blc);
                var new_h=Math.min(split_height,oimg.height-blr);
                bljg=bljg+'<canvas id="canvas_split_'+blr+'_'+blc+'" width='+new_w+' height='+new_h+' style="margin:1rem;padding:1rem;display:none;"></canvas>';
                bljg=bljg+'<img id="img_split_'+blr+'_'+blc+'" / style="margin:0.2rem;'+max_width+'">';
                list_t.push(['split_'+blr+'_'+blc,blc,blr,new_w,new_h]);

            }
            odiv.innerHTML=bljg;
            for (let item of list_t){
                var canvas=document.getElementById('canvas_'+item[0]);
                var ctx=canvas.getContext("2d");    
                ctx.drawImage(oimg, item[1],item[2], item[3], item[4], 0,0, item[3], item[4]);
                var splited_img_src=canvas.toDataURL("image/jpeg");
                document.getElementById('img_'+item[0]).src=splited_img_src;                
            }
        }
    }
    else {
        document.getElementById('div_split').innerHTML=bljg;
    }
}

function default_size_klbase64(){
    document.getElementById('input_maxw').value=960;
    document.getElementById('input_maxh').value=960;
}

function same_size_klbase64(){
    var original_img_w=document.getElementById('span_original_width');
    var original_img_h=document.getElementById('span_original_height');
    if (original_img_w && original_img_h){
        document.getElementById('input_maxw').value=parseInt(original_img_w.innerHTML);
        document.getElementById('input_maxh').value=parseInt(original_img_h.innerHTML);    
    }
}

function object_klbase64(cstype){
    var img_original_obj=new Image();
    img_original_obj.onload = function(){
        switch (cstype){
            case 'resize':
                resize_klbase64(img_original_obj);
                break;
            case 'split':
                split_klbase64(img_original_obj);
                break;
            case 'filter_demo':
                filter_klbase64(img_original_obj);
                break;
            case 'filter_full':
                filter_klbase64(img_original_obj,true);
                break;                
        }
    };
    img_original_obj.src=document.getElementById('img_original').src;
}

function rows_klbase64(textareaid,lines_num){
    var textarea_base64 = document.getElementById(textareaid);
    var str_t=textarea_base64.value;
    var length_t=Math.ceil(str_t.length/lines_num);
    var bljg='';
    while (str_t.length>0){
        bljg=bljg+str_t.slice(0,length_t)+'\n';
        str_t=str_t.substring(length_t,);
    }
    document.getElementById('textarea_base64_result').value='base64_BEGIN\n'+bljg+'base64_END\n';
}

/*转换函数*/  
function trans_klbase64() {  
    var ofile=document.getElementById('input_img').files[0];
    if (!ofile){return;}
    if (ofile.type.substring(0,6)!=="image/"){
        document.getElementById('textarea_base64_original').value = '非图片文件：'+ofile.name+' '+ofile.type;
        return;
    }
    if (ofile.size>30*1024*1024){
        document.getElementById('textarea_base64_original').value = '文件太大：'+ofile.name+' '+ofile.size;  
        return;
    }
    
    var imgFile = new FileReader();
    imgFile.readAsDataURL(ofile);  
    imgFile.onload = function () {
        var imgData = this.result; //base64数据    
        document.getElementById('img_original').setAttribute('src', imgData);  
        
        var img_original_obj=new Image();
        img_original_obj.onload = function(){
            document.getElementById('span_original_img_size').innerHTML='Width: <span id="span_original_width">'+img_original_obj.width+'</span> Height: <span id="span_original_height">'+img_original_obj.height +'</span> Data Length: '+kbmbgb_b(imgData.length,2);
        };
        img_original_obj.src=imgData;
        
        document.getElementById('textarea_base64_original').value = imgData;  
    }
}

function load_img_from_textarea_klbase64(){
    var imgData = document.getElementById('textarea_base64_original').value;
    
    if (imgData.trim().substring(0,11)!=='data:image/' || !imgData.includes(';base64,')){
        return;
    }
    document.getElementById('img_original').setAttribute('src', imgData);  
    
    var img_original_obj=new Image();
    img_original_obj.onload = function(){
        document.getElementById('span_original_img_size').innerHTML='Width: <span id="span_original_width">'+img_original_obj.width+'</span> Height: <span id="span_original_height">'+img_original_obj.height +'</span> Data Length: '+kbmbgb_b(imgData.length,2);
    };
    img_original_obj.src=imgData;
}

/*复制数据*/  
function copy_klbase64(idname) {  
    var textarea_base64 = document.getElementById(idname);
    textarea_base64.select(); // 选择对象    
    var cpd=document.execCommand("Copy"); // 执行浏览器复制命令    
    document.getElementById('span_copy').innerHTML = (cpd?'复制成功' :'复制失败');  
    window.setTimeout(function () {  
        document.getElementById('span_copy').innerHTML = '';  
    }, 3000); 
}

function filter_klbase64(oimg,isfullimg=false){   
    var blwidth=(isfullimg?oimg.width:Math.min(900,oimg.width));
    var blheight=(isfullimg?oimg.height:Math.min(900,oimg.height));
    document.getElementById('div_canvas').innerHTML='<canvas id="canvas_filter" width='+blwidth+' height='+blheight+' style="margin:1rem;padding:1rem;display:none;"></canvas>';
    var canvas=document.getElementById("canvas_filter");
    var ctx=canvas.getContext("2d");    
    ctx.filter = document.getElementById('input_filter').value.trim();
    ctx.drawImage(oimg, 0, 0, blwidth, blheight,0,0,blwidth, blheight);
    var resized_src=canvas.toDataURL("image/jpeg");
    document.getElementById('img_filtered').src=resized_src;
    document.getElementById('textarea_base64_filtered').value=resized_src;
}

function resize_new_wh_klbase64(oimg,csmaxwidth,csmaxheight){
    var resize_w=oimg.width;
    var resize_h=oimg.height;
    var blratio_wh=resize_w/resize_h;
    var blratio_hw=resize_h/resize_w;
    var doresize=false;

    if (resize_w>=csmaxwidth){
        resize_w = csmaxwidth;
        resize_h = Math.floor(resize_w*blratio_hw);
        doresize=true;
    }

    if (resize_h>=csmaxheight){
        resize_h=csmaxheight;
        resize_w=Math.floor(resize_h*blratio_wh);
        doresize=true;
    }
    return [resize_w,resize_h,doresize];
}

function resize_klbase64(oimg){
    var blmaxwidth=parseInt(document.getElementById('input_maxw').value);
    var blmaxheight=parseInt(document.getElementById('input_maxh').value)

    var resize_w;
    var resize_h;
    var doresize;
    [resize_w,resize_h,doresize]=resize_new_wh_klbase64(oimg,blmaxwidth,blmaxheight);

    if (doresize===false){return;}
    
    document.getElementById('div_canvas').innerHTML='<canvas id="canvas_resize" width='+resize_w+' height='+resize_h+' style="margin:1rem;padding:1rem;display:none;"></canvas>';
    var canvas=document.getElementById("canvas_resize");
    var ctx=canvas.getContext("2d");    
    ctx.drawImage(oimg, 0, 0, oimg.width, oimg.height, 0,0, resize_w, resize_h);
    var resized_src=canvas.toDataURL("image/jpeg");
    document.getElementById('img_resized').src=resized_src;
    document.getElementById('textarea_base64_resized').value=resized_src;
    document.getElementById('span_resized_img_size').innerHTML='Width: '+resize_w+' Height: '+resize_h+' Data Length: '+kbmbgb_b(resized_src.length,2);
}

function init_klbase64(){
    menu_klbase64();
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_buttons span.oblong_box'));
    document.getElementById('img_original').style.maxWidth=(ismobile_b()?'80%':'');
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
}

function filter_select_value_klbase64(new_value=false){
    var cstype=document.getElementById('select_filter').value;
    var oinput=document.getElementById('input_filter');
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
    document.getElementById('input_range_filter').value=blvalue;
    document.getElementById('span_range_filter').innerHTML=blvalue+'%';
}

function filter_form_klbase64(){
    var blstr=`<p style="line-height:1.8rem;">
    <select id="select_filter" onchange="javascript:filter_select_value_klbase64();">
    <option>brightness</option>
    <option>contrast</option>
    <option>grayscale</option>
    <option>invert</option>
    <option>opacity</option>
    <option>saturate</option>
    <option>sepia</option>
    </select>
    <input type="range" min=0 max=100 value=0 id="input_range_filter" style="width:10rem;"  oninput="javascript:filter_select_value_klbase64(this.value);object_klbase64('filter_demo');"><span id="span_range_filter">0%</span>
    <input type="text" id="input_filter" />
    <span class="oblong_box" onclick="javascript:object_klbase64('filter_full');">filter</span>
    </p>
    <p><b>Filtered Image</b></p>
    <p><img id="img_filtered" src="" alt="" style="padding:1rem;border:0.1rem black solid;"></p>
    <p style="line-height:1.8rem;">
    <b>Filtered Image Base64 Data:</b>
    <span class="oblong_box" onclick="javascript:copy_klbase64('textarea_base64_filtered');">Copy</span>
    <span class="oblong_box" onclick="javascript:rows_klbase64('textarea_base64_filtered',50);">Split Data to 50 rows</span>
    </p>
    <textarea id="textarea_base64_filtered"></textarea>`;
    var odiv=document.getElementById('div_form');
    odiv.innerHTML=blstr;
    var input_list=[
    ["input_filter",(ismobile_b?24:40)],
    ];
    input_size_b(input_list,'id');    
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_form span.oblong_box'));
    document.getElementById('img_filtered').style.maxWidth=(ismobile_b()?'80%':'');
    odiv.scrollIntoView();
}

function resize_form_klbase64(){
    var blstr=`<p style="line-height:1.8rem;">
    Max Width: <input type="number" id="input_maxw" min=1 />
    Max Height: <input type="number" id="input_maxh" min=1 />
    <span class="oblong_box" onclick="javascript:object_klbase64('resize');">Resize</span>
    <span class="oblong_box" onclick="javascript:same_size_klbase64();">Same Size</span>
    <span class="oblong_box" onclick="javascript:default_size_klbase64();">Default Value</span>
    </p>
    <p><b>Resized Image</b> <span id="span_resized_img_size"></span></p>
    <p><img id="img_resized" src="" alt="" style="padding:1rem;border:0.1rem black solid;"></p>
    <p style="line-height:1.8rem;">
    <b>Resized Image Base64 Data:</b>
    <span class="oblong_box" onclick="javascript:copy_klbase64('textarea_base64_resized');">Copy</span>
    <span class="oblong_box" onclick="javascript:rows_klbase64('textarea_base64_resized',50);">Split Data to 50 rows</span>
    </p>
    <textarea id="textarea_base64_resized"></textarea>`;
    var odiv=document.getElementById('div_form');
    odiv.innerHTML=blstr;
    var input_list=[
    ["input_maxw",5],
    ["input_maxh",5],
    ];
    input_size_b(input_list,'id');    
    default_size_klbase64();
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_form span.oblong_box'));
    document.getElementById('img_resized').style.maxWidth=(ismobile_b()?'80%':'');
    odiv.scrollIntoView();
}

function split_form_klbase64(){
    var blstr=`<p>
    Split Width: <input type="number" id="input_split_width" min=1 value=0 />
    Split Height: <input type="number" id="input_split_height" min=1 value=0 />
    <span class="oblong_box" onclick="javascript:object_klbase64('split');">Split</span>
    </p>
    <div id="div_split"></div>`;
    var odiv=document.getElementById('div_form');
    odiv.innerHTML=blstr;
    var input_list=[
    ['input_split_width',5],
    ['input_split_height',5],
    ];
    input_size_b(input_list,'id');        
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_form span.oblong_box'));
    odiv.scrollIntoView();
}

function menu_klbase64(){
    var str_t=klmenu_hide_b('');
    var klmenu0=[
    '<span class="span_menu" onclick="javascript:'+str_t+'filter_form_klbase64();">Filter</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'resize_form_klbase64();">Resize</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'split_form_klbase64();">Split</span>',
    ];
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu0,'','10rem','1rem','1rem','60rem'),'','0rem')+' ');
}
