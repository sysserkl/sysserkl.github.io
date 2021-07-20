function init_klqr(){
    var input_list=[
    ["input_qrsize",3],
    ["input_forecolor",5],
    ["input_backcolor",5],
    ];
    input_size_b(input_list,'id');
    input_with_x_b('input_qrtxt',15);
    
    menu_klqr();
    args_klqr();    
}

function canvas2img_klqr(){
	var odiv=document.querySelector('div#div_qrcode');
	var ocanvas=odiv.querySelector('canvas');
	if (ocanvas){
		var imgsrc=ocanvas.toDataURL("image/jpeg");
		var oimg=document.getElementById('img_from_canvas');
		oimg.src=imgsrc;
		oimg.style.display='';
        ocanvas.style.display='none';
	}
}

function calculate_klqr(){
    var otable=document.querySelector('div#div_qrcode table');
    if (!otable){
        document.getElementById('div_statistics').innerHTML='';
        document.getElementById('div_buttons').style.display='none';
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

	var qrfcolor=document.getElementById('input_forecolor').value.trim();
	var qrbcolor=document.getElementById('input_backcolor').value.trim();

    //,后有空格 - 保留注释
    var f_rgb='rgb('+hex2rgb_b(qrfcolor).join(', ')+')';
    var b_rgb='rgb('+hex2rgb_b(qrbcolor).join(', ')+')';
    
    var fcolor_block=0;
    var bcolor_block=0;

    for (let onetr of otrs){
        var otds=onetr.querySelectorAll('td');
        for (let onetd of otds){
            if (onetd.style.backgroundColor==qrfcolor || onetd.style.backgroundColor==f_rgb){
                fcolor_block=fcolor_block+1;
            }
            else if (onetd.style.backgroundColor==qrbcolor || onetd.style.backgroundColor==b_rgb){
                bcolor_block=bcolor_block+1;
            }
        }
    }
    
    bljg=bljg+' F-Color blocks: '+fcolor_block;
    bljg=bljg+' B-Color blocks: '+bcolor_block;
    bljg=bljg+' Total: '+(fcolor_block+bcolor_block);
    if (blrows*blcols==fcolor_block+bcolor_block){
        bljg=bljg+' ✔';
    }
    else {
        bljg=bljg+' ？';
    }
    document.getElementById('p_block_count').innerHTML=bljg;
    
    //-------------
    var postpath=postpath_b();
	bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_list_klqr" id="textarea_list_klqr" style="height:30rem;line-height:100%;"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+textarea_buttons_b('textarea_list_klqr','清空,复制,发送到临时记事本,发送地址')+'</p>';
    bljg=bljg+'</form>';
    
    var odiv=document.getElementById('div_list_klqr');
    odiv.innerHTML=bljg;
    odiv.style.display='none';  //保持最初的设置 - 保留注释
    document.getElementById('span_list').style.display='none';  //保持最初的设置 - 保留注释
    document.getElementById('div_buttons').style.display='';    
}

function round_klqr(){
    var odiv=document.querySelector('div#div_qrcode');
    if (odiv){
        round_qr_b(odiv);
    }
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

function create_klqr(csstr=''){
    document.getElementById('img_from_canvas').style.display='none';
	document.getElementById('div_qrcode').innerHTML='';
    document.getElementById('div_statistics').innerHTML='';
    document.getElementById('div_buttons').style.display='none';
	var qrsize=parseInt(document.getElementById('input_qrsize').value.trim());
    
    var oinput=document.getElementById('input_qrtxt');
    if (csstr==''){
	    csstr=oinput.value.trim();
    }
    oinput.value=csstr;
    
    if (klmenu_check_b('span_encode_klqr',false)){
		csstr=encodeURIComponent(csstr);
	}
    if (klmenu_check_b('span_table_klqr',false)){
        var blrender='table';
	}
    else {
        var blrender='canvas';
    }
    
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

    $('#div_qrcode').qrcode({render: blrender,correctLevel : correct_level_klqr(true), background:qrbcolor,foreground: qrfcolor, width: qrsize,height: qrsize,text: utf16to8_qr_b(csstr)});
    canvas2img_klqr();  
    
    setTimeout(calculate_klqr,1000);
    
    recent_search_b('recent_search_klqr',csstr,'create_klqr','div_recent_search',[],25,false);    
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
    }
    else {
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
	var qrfcolor=document.getElementById('input_forecolor').value.trim();
	var qrbcolor=document.getElementById('input_backcolor').value.trim();
    var f_rgb='rgb('+hex2rgb_b(qrfcolor).join(', ')+')';
    var b_rgb='rgb('+hex2rgb_b(qrbcolor).join(', ')+')';
    
    var blstr=document.getElementById('textarea_ascii_klqr').value.trim();
    if (blstr==''){
        blstr='呵';
    }
    
    var use_black_square=document.getElementById('checkbox_black_square').checked;
    
    if (document.getElementById('checkbox_comma').checked){
        var character_list=blstr.split(',');
    }
    else {
        var character_list=blstr.split('');    
    }
    var character_len=character_list.length;
    
    var tr_oblocks=document.querySelectorAll('div#div_qrcode table tr');
    
    var td_oblocks=tr_oblocks[0].querySelectorAll('td');    
    var result_t=[];
    var blxl=0;
    for (let blr=0;blr<tr_oblocks.length;blr++){
        var td_oblocks=tr_oblocks[blr].querySelectorAll('td');        
        var row_list=[];
        for (let blc=0;blc<td_oblocks.length;blc++){
            if (td_oblocks[blc].style.backgroundColor==qrfcolor || td_oblocks[blc].style.backgroundColor==f_rgb){
                if (use_black_square && (blc<=6 && (blr<=6 || blr>=tr_oblocks.length-7) || blc>=td_oblocks.length-7 && blr<=6)){
                    row_list.push('⬛');                    
                }
                else {
                    row_list.push(character_list[blxl]);
                    blxl=blxl+1;
                    if (blxl>=character_len){
                        blxl=0;
                    }
                }
            }
            else if (td_oblocks[blc].style.backgroundColor==qrbcolor || td_oblocks[blc].style.backgroundColor==b_rgb){
                row_list.push('　');
            }
        }
        result_t.push(row_list.join(''));
    }
    var otextarea=document.getElementById('textarea_list_klqr');
    if (otextarea){
        otextarea.value=result_t.join('\n');
    }
    document.getElementById('div_list_klqr').style.display='';
    console.log(result_t.join('\n'));   //此行保留 - 保留注释
}

function show_number_klqr(){    
	var qrfcolor=document.getElementById('input_forecolor').value.trim();
	var qrbcolor=document.getElementById('input_backcolor').value.trim();
    var f_rgb='rgb('+hex2rgb_b(qrfcolor).join(', ')+')';
    var b_rgb='rgb('+hex2rgb_b(qrbcolor).join(', ')+')';

    var tr_oblocks=document.querySelectorAll('div#div_qrcode table tr');
    if (tr_oblocks.length==0){return;}
    
    qr_list_global=[];

    var td_oblocks=tr_oblocks[0].querySelectorAll('td');        
    if (td_oblocks.length==0){return;}
    var shownumber=(td_oblocks[0].innerHTML=='');

    var ospan_list=document.getElementById('span_list');
    if (ospan_list){
        ospan_list.style.display=(shownumber?'':'none');
    }
    
    var odiv=document.getElementById('div_list_klqr');
    if (odiv && shownumber===false){
        odiv.style.display='none';
    }
    
    if (shownumber){        
        for (let blr=0;blr<tr_oblocks.length;blr++){
            var td_oblocks=tr_oblocks[blr].querySelectorAll('td');        
            for (let blc=0;blc<td_oblocks.length;blc++){
                if (td_oblocks[blc].style.backgroundColor==qrfcolor || td_oblocks[blc].style.backgroundColor==f_rgb){
                    td_oblocks[blc].innerHTML='<span style="color: '+qrbcolor+'; font-size:0.8rem;">'+(blr+1)+'+'+(blc+1)+'</span>';
                    qr_list_global.push([blr,blc,1]);
                }
                else if (td_oblocks[blc].style.backgroundColor==qrbcolor || td_oblocks[blc].style.backgroundColor==b_rgb){
                    td_oblocks[blc].innerHTML='<span style="color: '+qrfcolor+'; font-size:0.8rem;">'+(blr+1)+'-'+(blc+1)+'</span>';
                    qr_list_global.push([blr,blc,0]);
                }
                td_oblocks[blc].align='center';
            }
        }
    }
    else {
        for (let blr=0;blr<tr_oblocks.length;blr++){
            var td_oblocks=tr_oblocks[blr].querySelectorAll('td');        
            for (let blc=0;blc<td_oblocks.length;blc++){
                td_oblocks[blc].innerHTML='';
            }
        }
    }
}

function cleartxt_klqr(){
	document.getElementById('input_qrtxt').value='';
    document.getElementById("input_qrtxt").focus();
}

function args_klqr(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：xxxx.htm?s=abcdef& - 保留注释
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();
            if (bltmpstr.substring(0,2)=='s='){
                document.getElementById('input_qrtxt').value=bltmpstr.substring(2,);
                create_klqr();
                break;
            }
        }
    }
    else{
        setTimeout(create_klqr,2000);
    }
}

function correct_level_klqr(only_return_current_value=false){
    var ospan=document.getElementById('span_correct_level_klqr');
    var old_value=parseInt(ospan.innerText.split(':').slice(-1)[0].trim());
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
    ospan.innerHTML='correct level: <b>'+new_value+'</b>';
}

function menu_klqr(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_encode_klqr" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);">⚪ Encode</span>',
    '<span id="span_table_klqr" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);">⚪ Table</span>',    
    '<span id="span_correct_level_klqr" class="span_menu" onclick="javascript:'+str_t+'correct_level_klqr();">correct level: <b>3</b></span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'calculate_klqr();">Calculate</span>',        
    ];

    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'help_klqr();">help</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'qrcode\');}">更新版本</span>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','10rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','7rem','1rem','1rem','60rem'),'','0rem')+' ');
    //klmenu_check_b('span_table_klqr'); //此行保留 - 保留注释
}

function help_klqr(){
    document.getElementById('div_statistics').innerHTML='<p><small>based on: <a href="https://github.com/jeromeetienne/jquery-qrcode" target=_blank>https://github.com/jeromeetienne/jquery-qrcode</a></small></p>';
}
