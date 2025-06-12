function img_xy_klbase64(event,oimg){
    var x,y;
    [x,y]=img_xy_b(event,oimg);
    document.getElementById('span_info').innerText=x+','+y;
}

function split_result_klbase64(oimg){
    var split_width=parseFloat(document.getElementById('input_split_width').value);
    var split_height=parseFloat(document.getElementById('input_split_height').value);
    var only_2=document.getElementById('checkbox_split_onlye_2_klbase64').checked;

    var error,list_t;
    [error,list_t]=img_split_list_get_b(oimg,split_width,split_height,only_2);

    if (error!==''){
        document.getElementById('div_split').innerHTML=error;
        return;
    }
    
    var max_width=(ismobile_b()?'max-width:80%;':'');
    var img_list=[];
    for (let item of list_t){
        img_list.push('<img id="img_split_'+item[0]+'_'+item[1]+'" class="img_split_klbase64" style="margin:0.2rem;'+max_width+'" onclick="split_img_selected_klbase64(this);" />');
    }

    var odiv=document.getElementById('div_split');
    odiv.innerHTML=img_list.join('');

    var canvas = document.createElement('canvas');    
    var ctx=canvas.getContext('2d');
    for (let item of list_t){
        document.getElementById('img_split_'+item[0]+'_'+item[1]).src=img_split_canvas_b(oimg,canvas,ctx,item);
    }
    split_img_selected_klbase64();
}

function split_data_get_klbase64(){
    var oimgs=document.querySelectorAll('img.img_split_klbase64');
    var selected=hex2rgb_b(color_name2hex_b(scheme_global['a-hover']),true);
    for (let item of oimgs){
        var color_value=item.style.borderColor;
        if (hex2rgb_b(color_value,true)==selected){
            document.getElementById('textarea_base64_result').value=item.src;
            break;
        }
    }
}

function split_img_selected_klbase64(oimg=false){
    var oimgs=document.querySelectorAll('img.img_split_klbase64');
    for (let item of oimgs){
        item.style.border='0.1rem solid '+scheme_global['memo'];
    }
    
    if (oimg){
        oimg.style.border='0.1rem solid '+scheme_global['a-hover'];
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
                resize_result_klbase64(img_original_obj);
                break;
            case 'split':
                split_result_klbase64(img_original_obj);
                break;
            case 'filter_demo':
                filter_result_klbase64(img_original_obj);
                break;
            case 'filter_full':
                filter_result_klbase64(img_original_obj,true);
                break;              
            case 'grey':
                grey_result_klbase64(img_original_obj);
                break;
            case 'black and white':
                grey_result_klbase64(img_original_obj,true);                
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

function trans_klbase64(){  
    var ofile=document.getElementById('input_img').files[0];   
    var error=upload_img_file_check_b(ofile);
    if (error!==''){
        document.getElementById('textarea_base64_original').value=error;
        return;
    }

    var imgFile = new FileReader();
    imgFile.readAsDataURL(ofile);  
    imgFile.onload = function (){
        var imgData = this.result; //base64数据
        original_img_size_klbase64(imgData);
    }
}

function load_img_from_textarea_klbase64(){
    var imgData = document.getElementById('textarea_base64_original').value;
    
    if (imgData.trim().substring(0,11)!=='data:image/' || !imgData.includes(';base64,')){return;}
    document.getElementById('img_original').setAttribute('src', imgData);  
    original_img_size_klbase64(imgData,false);
}

function original_img_size_klbase64(imgData,update_textarea=true){
    document.getElementById('img_original').setAttribute('src', imgData);  
    
    var img_original_obj=new Image();
    img_original_obj.onload = function(){
        document.getElementById('span_original_img_size').innerHTML='Width: <span id="span_original_width">'+img_original_obj.width+'</span> Height: <span id="span_original_height">'+img_original_obj.height +'</span> Data Length: '+kbmbgb_b(imgData.length,2);
    };
    img_original_obj.src=imgData;
    
    if (update_textarea){
        document.getElementById('textarea_base64_original').value = imgData;        
    }
}

function filter_result_klbase64(oimg,isfullimg=false){   
    var blwidth=(isfullimg?oimg.width:Math.min(900,oimg.width));
    var blheight=(isfullimg?oimg.height:Math.min(900,oimg.height));
    document.getElementById('div_canvas').innerHTML='<canvas id="canvas_filter" width='+blwidth+' height='+blheight+' style="margin:1rem;padding:1rem;display:none;"></canvas>';
    var canvas=document.getElementById('canvas_filter');
    var ctx=canvas.getContext('2d');    
    ctx.filter = document.getElementById('input_img_filter_dom_b').value.trim();  //change image style #css - 保留注释
    ctx.drawImage(oimg, 0, 0, blwidth, blheight,0,0,blwidth, blheight);
    var resized_src=canvas.toDataURL('image/jpeg');
    document.getElementById('img_filtered').src=resized_src;
    document.getElementById('textarea_base64_modified').value=resized_src;
}

function grey_result_klbase64(img_original_obj,black_and_white=false){
    // 创建一个canvas元素
    var blwidth=img_original_obj.width;
    var blheight=img_original_obj.height;
        
    document.getElementById('div_canvas').innerHTML='<canvas id="canvas_filter" width='+blwidth+' height='+blheight+' style="margin:1rem;padding:1rem;display:none;"></canvas>';
    
    var canvas=document.getElementById('canvas_filter');
    var ctx=canvas.getContext('2d');        
    grey_img_b(img_original_obj,canvas,ctx,black_and_white);

    // 将canvas转换为图像元素
    var resized_src=canvas.toDataURL('image/jpeg');
    document.getElementById('img_filtered').src=resized_src;
    document.getElementById('textarea_base64_modified').value=resized_src;    
}

function resize_result_klbase64(oimg){
    var blmaxwidth=parseInt(document.getElementById('input_maxw').value);
    var blmaxheight=parseInt(document.getElementById('input_maxh').value)

    var resize_w, resize_h, doresize;
    [resize_w,resize_h,doresize]=resize_img_check_b(oimg,blmaxwidth,blmaxheight);

    if (doresize===false){return;}
    
    document.getElementById('div_canvas').innerHTML='<canvas id="canvas_resize" width='+resize_w+' height='+resize_h+' style="margin:1rem;padding:1rem;display:none;"></canvas>';
    var canvas=document.getElementById('canvas_resize');
    var ctx=canvas.getContext('2d');    
    ctx.drawImage(oimg, 0, 0, oimg.width, oimg.height, 0,0, resize_w, resize_h);
    var resized_src=canvas.toDataURL('image/jpeg');
    document.getElementById('img_resized').src=resized_src;
    document.getElementById('textarea_base64_modified').value=resized_src;
    document.getElementById('span_resized_img_size').innerHTML='Width: '+resize_w+' Height: '+resize_h+' Data Length: '+kbmbgb_b(resized_src.length,2);
}

function init_klbase64(){
    menu_klbase64();
    document.getElementById('img_original').style.maxWidth=(ismobile_b()?'80%':'');
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    
    document.getElementById('p_original_klbase64').insertAdjacentHTML('beforeend',textarea_buttons_b('textarea_base64_original','清空,复制,save as txt file,发送到临时记事本,发送地址','','','oblong_box'));
    
    document.getElementById('p_result_klbase64').insertAdjacentHTML('beforeend',textarea_buttons_b('textarea_base64_result','清空,复制,save as txt file,发送到临时记事本,发送地址','','','oblong_box')+'<span class="oblong_box" onclick="replace_klbase64(\'textarea_base64_result\');">replace the original image</span>');    
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_buttons span.oblong_box'));    
    
    var postpath=postpath_b();
    document.querySelector('form[name="form_original_klbase64"]').setAttribute('action', postpath+'temp_txt_share.php');
    document.querySelector('form[name="form_result_klbase64"]').setAttribute('action', postpath+'temp_txt_share.php');
}

function filter_form_klbase64(){
    var blstr='<p style="line-height:1.8rem;"><span class="aclick" onclick="object_klbase64(\'grey\');">grey</span><span class="aclick" onclick="object_klbase64(\'black and white\');">black and white</span> '+filter_form_img_b("object_klbase64('filter_demo');","object_klbase64('filter_full');")+'</p>\n';
    blstr=blstr+`<p><b>Filtered Image</b></p>
<p><img id="img_filtered" src="" alt="" style="padding:1rem;border:0.1rem black solid;"></p>`+modified_form_klbase64('Filtered');

    var odiv=document.getElementById('div_form');
    odiv.innerHTML=blstr;
    var input_list=[
    ['input_img_filter_dom_b',(ismobile_b?24:40)],
    ];
    input_size_b(input_list,'id');    
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('div#div_form span.oblong_box'));
    document.getElementById('img_filtered').style.maxWidth=(ismobile_b()?'80%':'');
    odiv.scrollIntoView();
}

function modified_form_klbase64(caption){
    var left_strings='<p style="line-height:1.8rem;"><b>'+caption+' Image Base64 Data:</b>';
    var right_strings=' <span class="oblong_box" onclick="rows_klbase64(\'textarea_base64_modified\',50);">Split Data to 50 rows</span> ';
    right_strings=right_strings+'<span class="oblong_box" onclick="replace_klbase64(\'textarea_base64_modified\');">replace the original image</span> ';
    right_strings=right_strings+'</p>';
    var blstr=textarea_with_form_generate_b('textarea_base64_modified','',left_strings,'清空,复制,save as txt file,发送到临时记事本,发送地址',right_strings,'','',false,'',true,'','oblong_box');
    return blstr;
}

function replace_klbase64(textarea_id){
    if (!confirm('是否替代原始图片？')){return;}

    var blstr=document.getElementById(textarea_id).value;
    original_img_size_klbase64(blstr,true);
    var oimg=document.getElementById('img_original');
    oimg.scrollIntoView();
}

function resize_form_klbase64(){
    var blstr=`<p style="line-height:1.8rem;">
Max Width: <input type="number" id="input_maxw" min=1 />
Max Height: <input type="number" id="input_maxh" min=1 />
<span class="oblong_box" onclick="object_klbase64('resize');">Resize</span>
<span class="oblong_box" onclick="same_size_klbase64();">Same Size</span>
<span class="oblong_box" onclick="default_size_klbase64();">Default Value</span>
</p>
<p><b>Resized Image</b> <span id="span_resized_img_size"></span></p>
<p><img id="img_resized" src="" alt="" style="padding:1rem;border:0.1rem black solid;"></p>`+modified_form_klbase64('Resized');
    var odiv=document.getElementById('div_form');
    odiv.innerHTML=blstr;
    var input_list=[
    ['input_maxw',5],
    ['input_maxh',5],
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
<span class="oblong_box" onclick="object_klbase64('split');">Split</span>
<label><input type="checkbox" id="checkbox_split_onlye_2_klbase64" />上下或左右分割为二份</label>
<span class="oblong_box" onclick="split_data_get_klbase64();">base64</span>
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
    '<span class="span_menu" onclick="'+str_t+'filter_form_klbase64();">Filter</span>',    
    '<span class="span_menu" onclick="'+str_t+'resize_form_klbase64();">Resize</span>',
    '<span class="span_menu" onclick="'+str_t+'split_form_klbase64();">Split</span>',
    ];
    document.getElementById('h2_title').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(klmenu_b(klmenu0,'','10rem','1rem','1rem','60rem'),'','0rem')+' ');
}
