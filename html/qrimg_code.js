function position_qr_qrimg(){
    var oradios=document.getElementsByName('radio_position');
    for (let item of oradios){
        if (item.checked){
            document.getElementById('div_qr').style.position=item.value;
            break;
        }
    }
}

function select_qrimg(){
    var bljg='';
    for (let blxl=1;blxl<=9;blxl++){
        bljg=bljg+'<option>'+blxl+'</option>';
    }
    document.getElementById('select_img1').innerHTML=bljg;
    document.getElementById('select_img2').innerHTML=bljg;
}

function sort_by_name_qrimg(desc=false){
    var oimgs=document.querySelectorAll('img.img_uploaded');
    var list_t=[];
    for (let item of oimgs){
        list_t.push([item.src,item.getAttribute('alt')]);
    }
    if (desc){
        list_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    } else {
        list_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});    
    }

    var img_border=klmenu_check_b('span_img_border',false);        
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]=style_qrimg(list_t[blxl][0],list_t[blxl][1],img_border);
    }
    document.getElementById('divhtml').innerHTML=list_t.join('');
}

function shift_qrimg(reset=false){
    if (reset){
        var oimgs=document.querySelectorAll('img.img_uploaded');
        var list_t=[];
        var img_border=klmenu_check_b('span_img_border',false);                
        for (let item of oimgs){
            list_t.push(style_qrimg(item.src,item.getAttribute('alt'),img_border));
        }
        document.getElementById('divhtml').innerHTML=list_t.join('');
        return;
    }
    
    var img1=parseInt(document.getElementById('select_img1').value);
    var img2=parseInt(document.getElementById('select_img2').value);
    if (img1==img2){return;}
    var oimgs=document.querySelectorAll('img.img_uploaded');
    var bllen=oimgs.length;
    if (bllen<img1 || bllen<img2){return;}

    var img_border=klmenu_check_b('span_img_border',false);            
    var list_t=[];
    for (let item of oimgs){
        list_t.push(style_qrimg(item.src,item.getAttribute('alt'),img_border));
    }
    var bltmp=list_t[img2-1];
    list_t[img2-1]=list_t[img1-1];
    list_t[img1-1]=bltmp;
    document.getElementById('divhtml').innerHTML=list_t.join('');
}

function rotate_qrimg(){
    var odiv=document.getElementById('div_qr');
    if (odiv){
        odiv.style.transform='rotate(45deg)';
    }
}

function close_qrimg(){
    document.getElementById('div_form').style.display='none';
    center_qrimg();
}

function round_qrimg(){
    var odiv=document.querySelector('div#div_qr');
    if (odiv){
        round_qr_b(odiv);
    }
}

function size_qrimg(){
    var blleft=0;
    var bltop=0;
    var blwidth=0;
    var blheight=0;
    
    var otable=document.getElementById('table_imgs');
    if (otable){
        var rect=otable.getBoundingClientRect();
        [blleft,bltop,blwidth,blheight]=[rect.left,rect.top,rect.width,rect.height];
    } else {
        var oimgs=document.querySelectorAll('img.img_uploaded');
        [blleft,bltop,blwidth,blheight]=doms_rect_b(oimgs,true);
    }
    return {'left':blleft,'top':bltop,'width':blwidth,'height':blheight};
}

function qr_qrimg(){
    var odiv=document.getElementById('div_qr');
    var size_dict=size_qrimg();
    var qrsize=parseInt(Math.min(size_dict.width,size_dict.height)*document.getElementById('input_qr_size').value);

    clean_qrimg();
    var blstr=document.getElementById('input_qrstr').value.trim();
    create_qr_b($('div#div_qr'),blstr,qrsize,'black','white',false);
    center_qrimg(size_dict);
}

function center_qrimg(cssize=false){
    if (cssize===false){
        cssize=size_qrimg();
    }

    var position_list=document.getElementById('input_qr_position').value.trim().split(';');
    var lrtb_list=['left','right','top','bottom'];
    var position_set=false;

    var odiv=document.getElementById('div_qr');
    if (odiv.innerHTML==''){return;}
    var bltransform=odiv.style.transform;
    odiv.style.transform='';
    odiv.style.border='0.2rem solid black';
    odiv.style.padding='0.5rem';

    for (let item of position_list){
        var list_t=item.trim().split(':');
        if (list_t.length!==2){continue;}
        var blat=lrtb_list.indexOf(list_t[0]);
        if (blat>=0){
            position_set=true;
            switch (blat){
                case 0:
                    odiv.style.left=list_t[1];
                    odiv.style.right='';
                    break;
                case 1:
                    odiv.style.right=list_t[1];
                    odiv.style.left='';
                    break;
                case 2:
                    odiv.style.top=list_t[1];
                    odiv.style.bottom='';
                    break;
                case 3:
                    odiv.style.bottom=list_t[1];
                    odiv.style.top='';
                    break;
            }
        }
    }
    if (position_set==false){
        var rect2=odiv.getBoundingClientRect();
        odiv.style.left=(cssize.left+cssize.width/2-rect2.width/2)+'px';
        odiv.style.top=(cssize.top+cssize.height/2-rect2.height/2)+'px';  //px不能省略 - 保留注释
    }
    odiv.style.transform=bltransform;
}

function position_img_qrimg(cstype){
    var oimgs=document.querySelectorAll('img.img_uploaded');
    var padding=parseInt(document.getElementById('input_qr_padding').value);
    if (isNaN(padding) || padding<0){
        padding=0;
    }
    var row=parseInt(document.getElementById('input_qr_rows').value);
    var col=parseInt(document.getElementById('input_qr_cols').value);
    if (isNaN(row) || row<1){
        row=2;
    }
    if (isNaN(col) || col<1){
        col=2;
    }    
    var bllen=oimgs.length;
    if (bllen<1){return;}
    switch (bllen){
        case 2:
            if (cstype=='lr'){
                row=1;
            } else if (cstype=='tb'){
                col=1;
            }
            break;
        case 6:
            if (cstype=='lr'){
                row=2;
            } else if (cstype=='tb'){
                col=2;
            }
            break;
        case 9:
            row=3;
            col=3;
            break;
    }

    var bljg='<table id="table_imgs" cellspacing=0 cellpadding='+padding+'>';
    var blxl=0;
    for (let blr=0;blr<row;blr++){
        bljg=bljg+'<tr>';
        for (let blc=0;blc<col;blc++){
            bljg=bljg+'<td><img class="img_uploaded" src="'+oimgs[blxl].src+'" alt="'+specialstr_j(oimgs[blxl].getAttribute('alt'))+'" /></td>';
            blxl=blxl+1;
            if (blxl>=bllen){break;}
        }
        bljg=bljg+'</tr>';
        if (blxl>=bllen){break;}
    }
    bljg=bljg+'</table>';
    document.getElementById('divhtml').innerHTML=bljg;    
    clean_qrimg();
}

function clean_qrimg(){
    var odiv=document.getElementById('div_qr');
    odiv.innerHTML='';
    odiv.style.transform='';
    odiv.style.border='';
    odiv.style.padding='';
}

function upload_qrimg(){
    var oimgs=document.getElementById('input_img').files;
    var bljg='';
    var img_border=klmenu_check_b('span_img_border',false);        
    
    for (let blxl=0,lent=oimgs.length;blxl<lent;blxl++){
        var ofile=oimgs[blxl];
        var error=upload_img_file_check_b(ofile);
        if (error!==''){
            document.getElementById('divhtml').innerHTML=error;
            return;        
        }
        
        var imgFile = new FileReader();
        imgFile.fileName = ofile.name;
        imgFile.readAsDataURL(ofile); 
        imgFile.onload = function (){
            bljg=bljg+style_qrimg(this.result,file_path_name_b(this.fileName)[1],img_border);
            document.getElementById('divhtml').innerHTML=bljg;
        }
        if (blxl>=8){break;}
    }
    clean_qrimg();
}

function style_qrimg(cssrc,fname='',csborder=true){
    return '<div class="div_relative_uploaded" style="position:relative;float:left;"><img class="img_uploaded" src="'+cssrc+'" style="max-width:500px;margin:0.5rem;'+(csborder?'border:0.1rem black solid;':'')+'" alt="'+specialstr_j(fname)+'" /></div>';
}

function init_qrimg(){
    character_2_icon_b('𖡗');
    
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    var input_list=[
    ['input_qr_rows',5,0.5],
    ['input_qr_cols',5,0.5],   
    ['input_qr_padding',5,0.5],    
    ['input_qrstr',15,0.5],    
    ['input_qr_size',5,0.5],    
    ['input_qr_position',15,0.5],    

    ];
    input_size_b(input_list,'id');
    menu_qrimg();
    select_qrimg();    
}

function menu_qrimg(){
    var str_t=klmenu_hide_b('');
    var klmenu_config=[
    '<span id="span_img_border" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ img border</span>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_config,'𖡗','12rem','1rem','1rem','30rem'),'','0rem')+' ');
    klmenu_check_b('span_img_border',true);        
}

function run_qrimg(cstype){
    switch (cstype){
        case '上下':
            position_img_qrimg('tb');
            break;
        case '左右':
            position_img_qrimg('lr');
            break;
        case '文件名升序':
            sort_by_name_qrimg();
            break;
        case '文件名降序':
            sort_by_name_qrimg(true);
            break;            
        case 'Reset':
            shift_qrimg(true);
            break;
    }
}

function canvas_qrimg(){
    html2canvas(document.body).then(canvas => {
        var imgdata=canvas.toDataURL('image/jpeg');
        if (ismobile_b()){
            document.write('<img src="'+imgdata+'" style="max-width:700px;" />');
        } else {
            window.open(imgdata);
        }
    });
}
