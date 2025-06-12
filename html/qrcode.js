function init_klqr(){
    character_2_icon_b('𖣯');
        
    args_klqr();
    if (parameter_klqr_global.has('iframe')){return;}

    var input_list=[
    ['input_qrsize',3],
    ['input_forecolor',5],
    ['input_backcolor',5],
    ['bg_left_klqr',5],
    ['bg_top_klqr',5],
    
    ];
    input_size_b(input_list,'id');
    input_with_x_b('input_qrtxt',15);

    ascii_box_option_klqr_global={'false':'','red':'🟥', 'orange':'🟧', 'yellow':'🟨', 'green':'🟩', 'blue':'🟦', 'purple':'🟪', 'brown':'🟫', 'black':'⬛', 'white':'⬜'};
    var list_t=[];
    for (let key in ascii_box_option_klqr_global){
        list_t.push('<option value="'+key+'">'+ascii_box_option_klqr_global[key]+'</option>');
    }
    document.getElementById('select_box_color_klqr').innerHTML=list_t.join('\n');
    menu_klqr();
    
    var otextarea=document.getElementById('textarea_base64_img_klqr');
    var buttons='<span class="aclick" onclick="import_base64_img_klqr();">载入背景图片</span>';
    otextarea.insertAdjacentHTML('afterend','<p>'+buttons+textarea_buttons_b('textarea_base64_img_klqr','清空,复制,导入temp_txt_share')+'</p>');
}

function import_base64_img_klqr(){    
    var imgData = document.getElementById('textarea_base64_img_klqr').value;
    
    if (imgData.trim().substring(0,11)!=='data:image/' || !imgData.includes(';base64,')){return;}
    background_img_data_klqr_global = imgData;
    background_img_load_klqr(false);    
}

function qrtxt_clear_klqr(){
    document.getElementById('input_qrtxt').value='';
    document.getElementById('input_qrtxt').focus();
}

function canvas2img_klqr(cscolor){
	var odiv=document.getElementById('div_qrcode');
	var ocanvas=odiv.querySelector('canvas');
	if (!ocanvas){return;}
    
    background_img_load_klqr(ocanvas);
    
    var imgsrc=ocanvas.toDataURL('image/'+document.getElementById('select_canvas_save_type').value);
    if (parameter_klqr_global.has('iframe')){        
        document.body.innerHTML='<img src="'+imgsrc+'" style="width:100%;" />';
    } else {
        var blstyle='padding:0.5rem;border:0.1rem '+cscolor+' solid;';
        var img_html='<img src="'+imgsrc+'" style="'+blstyle+'" ondblclick="show_hide_klqr(\'\');" />';
        ocanvas.outerHTML=img_html;
        if (parameter_klqr_global.has('simple')){
            show_hide_klqr('none');
        }
    }
}

function read_img_klqr(){
    var oimg=document.getElementById('img_backgound_qr');
    if (!oimg){
        upload_img_klqr();
        return;
    }

    var container_id='div_qr_read';
    var textarea_id='textarea_qr_read';
    var odiv=document.getElementById(container_id);
    if (odiv){
        odiv.parentNode.removeChild(odiv);    //确保编辑框在第一行 - 保留注释
    }
    document.getElementById('div_qrcode').insertAdjacentHTML('afterbegin','<div id="'+container_id+'"><textarea id="'+textarea_id+'"></textarea><textarea id="'+textarea_id+'2"></textarea></div>');
    var otextarea=document.getElementById(textarea_id);
    if (!otextarea){return;}   

    var qr_str = qr_read_b(oimg);
    if (qr_str!==''){
        otextarea.value=qr_str;    
        var otextarea2=document.getElementById(textarea_id+'2');
        otextarea2.value='"#'+qr_str+'","","'+specialstr_j(file_path_name_b(background_img_name_klqr_global)[1])+'",20,"微信公众号"';
        if (!otextarea2){return;}             
    } else {
        otextarea.value='not found';
    }  
}

function background_img_merge_klqr(ocanvas,oimg){
    var bltitle=(oimg.natrualWidth|oimg.width)+','+(oimg.naturalHeight|oimg.height);
    if (!ocanvas){
        document.getElementById('div_qrcode').insertAdjacentHTML('afterbegin','<p><img id="img_backgound_qr" src="'+background_img_data_klqr_global+'" title="'+bltitle+'" /></p>');
        return;
    }
    
    var octx = ocanvas.getContext('2d');
    var oimageData = octx.getImageData(0, 0, ocanvas.width, ocanvas.height);
    var odata = oimageData.data;
    
    var icanvas = document.createElement('canvas');    
    icanvas.width=oimg.naturalWidth;
    icanvas.height=oimg.naturalHeight;

    var ictx = icanvas.getContext('2d');
    ictx.drawImage(oimg, 0, 0,oimg.naturalWidth,oimg.naturalHeight,0,0,icanvas.width,icanvas.height);
    // Get the pixel data
    var iimageData = ictx.getImageData(0,0, icanvas.width, icanvas.height);
    var idata = iimageData.data;
    
    var blleft=parseFloat(document.getElementById('bg_left_klqr').value.trim());
    var bltop=parseFloat(document.getElementById('bg_top_klqr').value.trim());
    [blleft,bltop]=container_subdom_left_top_b(icanvas,ocanvas,blleft,bltop);
    
    var col_end=blleft+ocanvas.width;
    var row_end=bltop+ocanvas.height;
    
    var one_row_points=icanvas.width*4;
    var row_no=-1;
    var col_no=0;
    var odata_no=0;
    for (let blxl=0,lent=idata.length;blxl<lent;blxl=blxl+4){
        if (blxl % one_row_points == 0){
            row_no=row_no+1;
            col_no=0;
        }
        if (row_no>=bltop && row_no<row_end && col_no>=blleft && col_no<col_end){
            var ohsl=rgb2hsl_b(odata[odata_no],odata[odata_no+1],odata[odata_no+2]);
            var ihsl=rgb2hsl_b(idata[blxl],idata[blxl+1],idata[blxl+2]);
            if (Math.abs(ihsl['l']-ohsl['l'])>0.1){
                ihsl['l']=ohsl['l'];
                //ihsl['l']=0.5;
                var nrgb=hsl2rgb_b(ihsl);
                idata[blxl]=nrgb['r'];
                idata[blxl+1]=nrgb['g'];
                idata[blxl+2]=nrgb['b'];
            }
            odata_no=odata_no+4;
        }
        col_no=col_no+1;
    }
    ictx.putImageData(iimageData, 0, 0);
    
    var img_border=klmenu_check_b('span_img_border',false);        
    var bljg='<p><img id="img_backgound_qr" src="'+icanvas.toDataURL('image/'+document.getElementById('select_canvas_save_type').value)+'"'+(img_border?' style="border:0.1px solid '+scheme_global['color']+';"':'')+' title="'+bltitle+'" /></p>';
    
    document.getElementById('div_qrcode').insertAdjacentHTML('afterbegin',bljg);
}

function background_img_load_klqr(ocanvas=false){
    if (background_img_data_klqr_global==''){return;}

    var bg_img=document.getElementById('img_backgound_qr');
    if (bg_img){
        bg_img.parentNode.removeChild(bg_img);
    }
    
    var oimg = new Image();
    oimg.onload = function(){
        background_img_merge_klqr(ocanvas,this);
        
        var bg_img=document.getElementById('img_backgound_qr');    
        if (bg_img){
            bg_img.addEventListener('click', function(ev){
                var x,y;
                [x,y]=img_xy_b(ev,this);
                document.getElementById('span_info').innerText=x+','+y;
            });
        }     
    };
    oimg.src = background_img_data_klqr_global;
}

function calculate_klqr(){
    var otable=document.querySelector('div#div_qrcode table');
    if (!otable){
        document.getElementById('div_statistics').innerHTML='';
        document.getElementById('div_tail_buttons_klqr').style.display='none';
        return;
    }
    
    var otrs=otable.querySelectorAll('tr');
    var blrows=otrs.length
    var bljg='rows: '+blrows;
    
    var blcols=0;
    for (let onetr of otrs){
        var otds=onetr.querySelectorAll('td');
        blcols=otds.length
        break;
    }
    bljg=bljg+' cols: '+blcols;

    var qrfcolor,qrbcolor,f_rgb,b_rgb;
    [qrfcolor,qrbcolor,f_rgb,b_rgb]=color_get_klqr();
    
    var fcolor_block=0;
    var bcolor_block=0;

    for (let onetr of otrs){
        var otds=onetr.querySelectorAll('td');
        for (let onetd of otds){
            if (onetd.style.backgroundColor==qrfcolor || onetd.style.backgroundColor==f_rgb){
                fcolor_block=fcolor_block+1;
            } else if (onetd.style.backgroundColor==qrbcolor || onetd.style.backgroundColor==b_rgb){
                bcolor_block=bcolor_block+1;
            }
        }
    }
    
    bljg=bljg+' F-Color blocks: '+fcolor_block;
    bljg=bljg+' B-Color blocks: '+bcolor_block;
    bljg=bljg+' Total: '+(fcolor_block+bcolor_block);
    if (blrows*blcols==fcolor_block+bcolor_block){
        bljg=bljg+' ✔';
    } else {
        bljg=bljg+' ？';
    }
    document.getElementById('p_block_count').innerHTML=bljg;
    
    //-----------------------
    var left_str='<p>';
    var right_str='</p>';
    var odiv=document.getElementById('div_list_klqr');
    var blstr=textarea_with_form_generate_b('textarea_list_klqr','height:30rem;line-height:100%;',left_str,'清空,复制,发送到临时记事本,发送地址',right_str);
    odiv.innerHTML=blstr;
    
    odiv.style.display='none';  //保持最初的设置 - 保留注释
    document.getElementById('span_list').style.display='none';  //保持最初的设置 - 保留注释
    document.getElementById('div_tail_buttons_klqr').style.display='';    
}

function round_klqr(){
    var odiv=document.querySelector('div#div_qrcode');
    if (odiv){
        round_qr_b(odiv);
    }
}

function td_2_str_klqr(){
    var tr_oblocks=tr_oblocks_get_klqr()[0];
    if (tr_oblocks===false){return;}
    
    var blstr=qr_list_get_from_table_b(tr_oblocks,false,color_get_klqr(),true);
    document.getElementById('textarea_ascii_klqr').value=blstr;
}

function randcolor_klqr(){
	document.getElementById('input_forecolor').value='-1';
	document.getElementById('input_backcolor').value='-1';
	create_klqr();
}

function black_white_klqr(){
	document.getElementById('input_forecolor').value='black';
	document.getElementById('input_backcolor').value='white';
	create_klqr();
}

function reverse_klqr(){
	var fcolor=document.getElementById('input_forecolor').value;
    document.getElementById('input_forecolor').value=document.getElementById('input_backcolor').value;
	document.getElementById('input_backcolor').value=fcolor;
	create_klqr();
}

function parameter_get_klqr(csstr=''){
    var oinput=document.getElementById('input_qrtxt');
    if (csstr==''){
	    csstr=oinput.value.trim();
    }
    oinput.value=csstr;

	var qrsize=parseInt(document.getElementById('input_qrsize').value.trim());

    if (klmenu_check_b('span_table_klqr',false)){
        var blrender='table';
	} else {
        var blrender='canvas';
    }
    
    var qrfcolor,qrbcolor,f_rgb,b_rgb;
    [qrfcolor,qrbcolor,f_rgb,b_rgb]=color_get_klqr().slice(0,2);
    return [csstr,qrsize,blrender,qrfcolor,qrbcolor,f_rgb,b_rgb];
}

function create_klqr(csstr=''){
	document.getElementById('div_qrcode').innerHTML='';
    document.getElementById('div_statistics').innerHTML='';
    document.getElementById('div_tail_buttons_klqr').style.display='none';
   
    var qrsize,blrender,qrfcolor,qrbcolor,f_rgb,b_rgb;
    [csstr,qrsize,blrender,qrfcolor,qrbcolor,f_rgb,b_rgb]=parameter_get_klqr(csstr);
    
    create_qr_b($('#div_qrcode'),csstr,qrsize,qrfcolor,qrbcolor,klmenu_check_b('span_encode_klqr',false),blrender,correct_level_klqr(true));
    canvas2img_klqr(qrfcolor);  
    
    if (!parameter_klqr_global.has('iframe')){
        setTimeout(calculate_klqr,1000);
        recent_search_b('recent_search_klqr',csstr,'create_klqr','div_recent_search',[],25,false);    
    }
}

function emoji_random_klqr(){
    var list_t=emoji_category_b(['food','vegetable','animal','transport','human'],-2);
    var blcount=parseInt((prompt('输入个数：') || '').trim());
    if (isNaN(blcount)){return;}
    blcount=Math.max(1,blcount);
    while (list_t.length<blcount){
        list_t=list_t.concat(list_t);
    }
    list_t.sort(randomsort_b);
    list_t=list_t.slice(0,blcount);
    document.getElementById('textarea_ascii_klqr').value=list_t.join(',');
}

function show_border_klqr(){
    var oblocks=document.querySelectorAll('div.emp, div.dot');
    if (oblocks.length==0){
        var oblocks=document.querySelectorAll('div#div_qrcode table td');
    }
    if (oblocks.length==0){return;}
    
    var showborder=(oblocks[0].style.border=='');
    
    if (showborder){
        for (let item of oblocks){
            item.style.border='0.1rem solid blue';
            var blid=item.id.split('_');
        }
    } else {
        for (let item of oblocks){
            item.style.border='';
        }
    }
}

function show_list_klqr(){
    var otextarea=document.getElementById('textarea_list_klqr');
    if (!otextarea){return;}
    if (qr_list_global.length==0){return;}
    var bljg=[];
    for (let item of qr_list_global){
        bljg.push(item.join(','));
    }
    otextarea.value=bljg.join('\n');
    document.getElementById('div_list_klqr').style.display='';
}

function table_2_ascii_klqr(){
    var qrfcolor,qrbcolor,f_rgb,b_rgb;
    [qrfcolor,qrbcolor,f_rgb,b_rgb]=color_get_klqr();
    
    var blstr=document.getElementById('textarea_ascii_klqr').value.trim();
    if (blstr==''){
        blstr='呵';
    }
        
    if (document.getElementById('checkbox_comma').checked){
        var character_list=blstr.split(',');
    } else {
        var character_list=blstr.split('');    
    }
    var character_len=character_list.length;

    var tr_oblocks=document.querySelectorAll('div#div_qrcode table tr');
    
    var td_oblocks=tr_oblocks[0].querySelectorAll('td');    
    var result_t=[];
    var blxl=0;

    var blcolor=document.getElementById('select_box_color_klqr').value;
    var blbox=ascii_box_option_klqr_global[blcolor];
    for (let blr=0,lent=tr_oblocks.length;blr<lent;blr++){
        var td_oblocks=tr_oblocks[blr].querySelectorAll('td');        
        var row_list=[];
        for (let blc=0,lenb=td_oblocks.length;blc<lenb;blc++){
            if (td_oblocks[blc].style.backgroundColor==qrfcolor || td_oblocks[blc].style.backgroundColor==f_rgb){
                if (blbox!=='' && (blc<=6 && (blr<=6 || blr>=tr_oblocks.length-7) || blc>=td_oblocks.length-7 && blr<=6)){
                    row_list.push(blbox);
                } else {
                    row_list.push(character_list[blxl]);
                    blxl=blxl+1;
                    if (blxl>=character_len){
                        blxl=0;
                    }
                }
            } else if (td_oblocks[blc].style.backgroundColor==qrbcolor || td_oblocks[blc].style.backgroundColor==b_rgb){
                row_list.push('　');
            }
        }
        result_t.push(row_list.join(''));
    }
    var otextarea=document.getElementById('textarea_list_klqr');
    if (otextarea){
        otextarea.style.color=(blbox==''?qrfcolor:blcolor);
        otextarea.style.backgroundColor=qrbcolor;
        otextarea.value=result_t.join('\n');
    }
    document.getElementById('div_list_klqr').style.display='';
    console.log(result_t.join('\n'));   //此行保留 - 保留注释
}

function color_get_klqr(){
	var qrfcolor=document.getElementById('input_forecolor').value.trim();
	var qrbcolor=document.getElementById('input_backcolor').value.trim();

	if (qrfcolor=='' || qrfcolor=='-1'){
		qrfcolor=rndcolor_b();
		document.getElementById('input_forecolor').value=qrfcolor;
	}
	if (qrbcolor=='' || qrbcolor=='-1'){
		qrbcolor=rndcolor_b();
		document.getElementById('input_backcolor').value=qrbcolor;
	}
    
    var f_rgb='rgb('+hex2rgb_b(qrfcolor).join(', ')+')'; //,后有空格 - 保留注释
    var b_rgb='rgb('+hex2rgb_b(qrbcolor).join(', ')+')';
    return [qrfcolor,qrbcolor,f_rgb,b_rgb];
}

function tr_oblocks_get_klqr(){
    var tr_oblocks=document.querySelectorAll('div#div_qrcode table tr');
    if (tr_oblocks.length==0){return [false,false];}
    
    var td_oblocks=tr_oblocks[0].querySelectorAll('td');        
    if (td_oblocks.length==0){return [false,false];}
    
    return [tr_oblocks,td_oblocks];
}

function show_number_klqr(){    
    var tr_oblocks,td_oblocks;
    [tr_oblocks,td_oblocks]=tr_oblocks_get_klqr();
    if (tr_oblocks===false){return;}
    var shownumber=(td_oblocks[0].innerHTML=='');

    var ospan_list=document.getElementById('span_list');
    if (ospan_list){
        ospan_list.style.display=(shownumber?'':'none');
    }
    
    var odiv=document.getElementById('div_list_klqr');
    if (odiv && shownumber===false){
        odiv.style.display='none';
    }

    qr_list_global=[];
    if (shownumber){      
        qr_list_global=qr_list_get_from_table_b(tr_oblocks,shownumber,color_get_klqr());
    } else {
        for (let blr=0,lent=tr_oblocks.length;blr<lent;blr++){
            var td_oblocks=tr_oblocks[blr].querySelectorAll('td');        
            for (let blc=0,lenb=td_oblocks.length;blc<lenb;blc++){
                td_oblocks[blc].innerHTML='';
            }
        }
    }
}

function cleartxt_klqr(){
	var oinput=document.getElementById('input_qrtxt');
    oinput.value='';
    oinput.focus();
}

function args_klqr(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let item of cskeys){
            item=item.trim();
            if (item=='simple'){
                parameter_klqr_global.add('simple');
            }
            if (item=='iframe'){
                parameter_klqr_global.add('iframe');
            }
            if (item.substring(0,5)=='size='){
                document.getElementById('input_qrsize').value=item.substring(5,).trim();
            }
        }
        
        for (let item of cskeys){   //第2轮 - 保留注释
            item=item.trim();
            if (item.substring(0,2)=='s='){
                document.getElementById('input_qrtxt').value=item.substring(2,);
                create_klqr();
                break;
            }
        }
    } else {
        setTimeout(create_klqr,2000);
    }
}

function correct_level_klqr(only_return_current_value=false){
    var ospan=document.getElementById('span_correct_level_klqr');
    if (ospan){
        var old_value=parseInt(ospan.innerText.split(':').slice(-1)[0].trim());
    } else {
        var old_value=3;
    }
    
    if (isNaN(old_value)){
        old_value=3;
        return;
    }

    if (only_return_current_value){
        return old_value;
    }
    
    var new_value=parseInt((prompt('set correct level(0-3): ',old_value) || '').trim());
    if (isNaN(new_value)){return;}
    if (new_value<0 || new_value>3){return;}
    if (ospan){
        ospan.innerHTML='correct level: <b>'+new_value+'</b>';
    }
}

function show_hide_klqr(cstype=false){
    var idlist=['h2_title','div_head_buttons_klqr','div_recent_search'];
    for (let one_id of idlist){
        var odom=document.getElementById(one_id);
        if (cstype==false){
            odom.style.display=(odom.style.display==''?'none':'');
        } else {
            odom.style.display=cstype;
        }
    }
}

function hide_show_div_img_upload_klqr(){
    var status=popup_show_hide_b('div_img_upload_klqr');
    if (status=='none'){
        background_img_data_klqr_global='';
    }
}

function upload_img_klqr(){
    var ofile=document.getElementById('input_upload_img_klqr').files[0];
    var error=upload_img_file_check_b(ofile);
    if (error!==''){
        alert(error);
        return;
    }
    background_img_name_klqr_global=ofile.name;
    var imgFile = new FileReader();
    imgFile.readAsDataURL(ofile);
    imgFile.onload = function (){
        var imgData = this.result;
        background_img_data_klqr_global = imgData;  
        background_img_load_klqr(false);
    }
}

function menu_klqr(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_encode_klqr" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id);">⚪ Encode</span>',
    '<span id="span_table_klqr" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id);">⚪ Table</span>',    
    '<span id="span_correct_level_klqr" class="span_menu" onclick="'+str_t+'correct_level_klqr();">correct level: <b>3</b></span>',        
    '<span class="span_menu" onclick="'+str_t+'calculate_klqr();">Calculate</span>',
    ];

    var klmenu2=[
    '<span class="span_menu" onclick="'+str_t+'hide_show_div_img_upload_klqr();">背景图片</span>',
    '<span class="span_menu" onclick="'+str_t+'batch_form_klqr();">文本分割批量QR</span>',
    '<span class="span_menu">文本分割每份字符数：<input type="number" id="input_batch_split_max_len_klqr" min=0 value=300 /></span>',
    '<span class="span_menu">保存图片类型：<select  id="select_canvas_save_type"><option>jpeg</option><option>png</option></select></span>',    
    '<span id="span_img_border" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ img border</span>',        
    '<span class="span_menu" onclick="'+str_t+'help_klqr();">help</span>',
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'qrcode\');">更新版本</span>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'𖣯','11rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','19rem','1rem','1rem','60rem'),'','0rem')+' ');
    //klmenu_check_b('span_table_klqr'); //此行保留 - 保留注释
    
    var input_list=[['input_batch_split_max_len_klqr',4,0.5],];
    input_size_b(input_list,'id');
}

function batch_form_klqr(){    
    var left_strings='<p>'+close_button_b('div_content_klqr','');
    left_strings=left_strings+'<span class="aclick" onclick="batch_split_klqr();">分割生成</span>';
    var blstr=textarea_with_form_generate_b('textarea_split_klqr','height:15rem;',left_strings,'全选,复制,导入temp_txt_share,发送到临时记事本,发送地址','</p>');

    var odiv=document.getElementById('div_content_klqr');
    odiv.innerHTML=blstr;
    odiv.scrollIntoView();
}

function batch_split_klqr(){
    var max_len=parseInt(document.getElementById('input_batch_split_max_len_klqr').value.trim());
    var blstr,qrsize,blrender,qrfcolor,qrbcolor,f_rgb,b_rgb;
    [blstr,qrsize,blrender,qrfcolor,qrbcolor,f_rgb,b_rgb]=parameter_get_klqr('');
    var is_encode=klmenu_check_b('span_encode_klqr',false);
    
    var blcontent=document.getElementById('textarea_split_klqr').value.trim();
    var list_t=[];
    var odiv=document.getElementById('div_qrcode');
    odiv.innerHTML='';
    
    var blxl=0;
    while (true){
        var current_str=blcontent.slice(0,max_len);
        if (current_str==''){break;}
        
        blcontent=blcontent.slice(max_len,);
        var sub_div=div_table_2_cols_b(blxl.toString().padStart(2, '0'),'td_batch_klqr_'+blxl,qrsize);
        odiv.insertAdjacentHTML('beforeend',sub_div);
        create_qr_b($('#td_batch_klqr_'+blxl),current_str,qrsize,qrfcolor,qrbcolor,is_encode,blrender,correct_level_klqr(true));
        blxl=blxl+1;
    }
}

function help_klqr(){
    document.getElementById('div_statistics').innerHTML='<p><small>based on: <a href="https://github.com/jeromeetienne/jquery-qrcode" target=_blank>https://github.com/jeromeetienne/jquery-qrcode</a></small></p>';
}
