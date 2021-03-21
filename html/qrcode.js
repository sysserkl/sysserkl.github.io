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
//--------------
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
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:show_border_klqr(this);">Show Border</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:show_number_klqr(this);">Show Number</span> ';
    bljg=bljg+'<span class="aclick" id="span_list" style="display:none;" onclick="javascript:show_list_klqr();">Show List</span> ';    
    bljg=bljg+'<span class="aclick" onclick="javascript:round_klqr();">Round</span>';    
    bljg=bljg+'</p>';
    bljg=bljg+'<textarea id="textarea_list" style="height:15rem;display:none;" onclick="javascript:this.select();document.execCommand(\'copy\');"></textarea>'
    document.getElementById('div_statistics').innerHTML=bljg;
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

function show_border_klqr(obutton){
    if (obutton.innerText=='Show Border'){
        var showborder=true;
        obutton.innerText='Hide Border';
    }
    else {
        var showborder=false;
        obutton.innerText='Show Border';
    }
    var oblocks=document.querySelectorAll('div.emp, div.dot');
    if (oblocks.length==0){
        var oblocks=document.querySelectorAll('div#div_qrcode table td');
    }
    for (let item of oblocks){
        if (showborder){
            item.style.border="0.1rem solid blue";
            var blid=item.id.split('_');
        }
        else {
            item.style.border="";
        }  
    }
}

function show_list_klqr(){
    var otextarea=document.getElementById('textarea_list');
    if (!otextarea){return;}
    if (qr_list_global.length==0){return;}
    var bljg=[];
    for (let item of qr_list_global){
        bljg.push(item.join(','));
    }
    otextarea.value=bljg.join('\n');
    otextarea.style.display='';
}

function show_number_klqr(obutton){
    var ospan_list=document.getElementById('span_list');
    var otextarea=document.getElementById('textarea_list');
    if (obutton.innerText=='Show Number'){
        var shownumber=true;
        obutton.innerText='Hide Number';
    }
    else {
        var shownumber=false;
        obutton.innerText='Show Number';
    }
    if (ospan_list){
        ospan_list.style.display=(shownumber?'':'none');
    }
    if (otextarea && shownumber===false){
        otextarea.style.display='none';
    }
    
	var qrfcolor=document.getElementById('input_forecolor').value.trim();
	var qrbcolor=document.getElementById('input_backcolor').value.trim();
    var f_rgb='rgb('+hex2rgb_b(qrfcolor).join(', ')+')';
    var b_rgb='rgb('+hex2rgb_b(qrbcolor).join(', ')+')';

    var tr_oblocks=document.querySelectorAll('div#div_qrcode table tr');

    qr_list_global=[];
    for (let blr=0;blr<tr_oblocks.length;blr++){
        var td_oblocks=tr_oblocks[blr].querySelectorAll('td');
        for (let blc=0;blc<td_oblocks.length;blc++){
            if (shownumber){
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
            else {
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
    klmenu_check_b('span_table_klqr');
}

function help_klqr(){
    document.getElementById('div_statistics').innerHTML='<p><small>based on: <a href="https://github.com/jeromeetienne/jquery-qrcode" target=_blank>https://github.com/jeromeetienne/jquery-qrcode</a></small></p>';
}
