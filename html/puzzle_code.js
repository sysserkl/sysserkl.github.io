function draw_puzzle(){
    if (cols_puzzle_global==-1){
        cols_puzzle_global=parseInt(rows_puzzle_global*img_puzzle_global.width/img_puzzle_global.height);
    }

    pieceWidth1_puzzle_global=img_puzzle_global.width/cols_puzzle_global;
    pieceHeight1_puzzle_global=img_puzzle_global.height/rows_puzzle_global;

    var window_w=document.body.offsetWidth;
    var window_h=document_body_offsetHeight_b();
    var blmargin=0;
    
    var blvalue=cols_puzzle_global*border_width_puzzle_global+(cols_puzzle_global-2)*border_width_puzzle_global+blmargin;
    if (img_puzzle_global.width+blvalue>window_w){
        var iw=window_w-blvalue;
    } else {
        var iw=img_puzzle_global.width;
    }
    
    var ih=iw*img_puzzle_global.height/img_puzzle_global.width;
    
    blvalue=rows_puzzle_global*border_width_puzzle_global+(rows_puzzle_global-2)*border_width_puzzle_global+blmargin*2;
    if (ih+blvalue>window_h){
        ih=window_h-blvalue;
        iw=ih*img_puzzle_global.width/img_puzzle_global.height;
    }
           
    pieceWidth2_puzzle_global=iw/cols_puzzle_global;
    pieceHeight2_puzzle_global=ih/rows_puzzle_global;

    for (let item of ['img_puzzle_global.width','img_puzzle_global.height','window_w','window_h','iw','ih','pieceWidth1_puzzle_global','pieceHeight1_puzzle_global','pieceWidth2_puzzle_global','pieceHeight2_puzzle_global','rows_puzzle_global','cols_puzzle_global']){
        console.log(item,eval(item));
    }
    
    var pieces = [];
    for (let blr=0;blr<rows_puzzle_global;blr++){
        for (let blc=0;blc<cols_puzzle_global;blc++){
            pieces.push({row:blr,col:blc});
        }
    }
    pieces.sort(randomsort_b);
    
    var bljg=[];
    var row_str='';
    for (let blxl=0,lent=pieces.length;blxl<lent;blxl++){
        var str_t='';
        if (blxl % cols_puzzle_global == 0){
            if (row_str!==''){
                bljg.push('<tr>'+row_str+'</tr>');
                row_str='';
            }
        }
        str_t=str_t+'<td align=center valign=middle onclick="td_border_puzzle(this)">';
        str_t=str_t+'<canvas id="canvas_'+pieces[blxl]['row']+'_'+pieces[blxl]['col']+'" width="'+pieceWidth2_puzzle_global+'" height="'+pieceHeight2_puzzle_global+'"></canvas>';
        str_t=str_t+'</td>';
        row_str=row_str+str_t;
    }
    if (row_str!==''){
        bljg.push('<tr>'+row_str+'</tr>');
    }

    var otable=document.getElementById('table_canvas');
    otable.innerHTML=bljg.join('\n');
    td_border_puzzle(false);
    refresh_puzzle();
}

function refresh_puzzle(csid=[]){
    for (let blr=0;blr<rows_puzzle_global;blr++){
        for (let blc=0;blc<cols_puzzle_global;blc++){
            var canvas=document.getElementById('canvas_'+blr+'_'+blc);
            if (csid.length==0 || csid.includes('canvas_'+blr+'_'+blc)){
                var ctx=canvas.getContext('2d');        
                ctx.drawImage(img_puzzle_global, blc*pieceWidth1_puzzle_global, blr*pieceHeight1_puzzle_global, pieceWidth1_puzzle_global, pieceHeight1_puzzle_global, 0,0, pieceWidth2_puzzle_global, pieceHeight2_puzzle_global);
            }
        }
    }
}

function td_border_puzzle(otd){
    if (otd){
        if (td1_puzzle_global!==false){
            if (otd.querySelector('canvas').id==td1_puzzle_global.querySelector('canvas').id){
                 otd.style.border=border_width_puzzle_global+'px white dashed';
                 td1_puzzle_global=false;
                 return;
            }
        }
    }
    var otds=document.querySelectorAll('#table_canvas td');
    for (let item of otds){
        item.style.border=border_width_puzzle_global+'px white dashed';
    }
    if (otd){
        otd.style.border=border_width_puzzle_global+'px tomato dashed';
        if (td1_puzzle_global==false){
            td1_puzzle_global=otd;
        } else {
            var canvasid=[otd.querySelector('canvas').id,td1_puzzle_global.querySelector('canvas').id];
            var blcontent=otd.innerHTML;
            otd.innerHTML=td1_puzzle_global.innerHTML;
            td1_puzzle_global.innerHTML=blcontent;
            td1_puzzle_global=otd;
            refresh_puzzle(canvasid);
        }
    }
    check_puzzle();
}

function check_puzzle(){
    var list_t=[];
    var otrs=document.querySelectorAll('#table_canvas tr');
    for (let one_tr of otrs){
        var ocanvas=one_tr.querySelectorAll('canvas');
        for (let item of ocanvas){
            var row_col=item.id.split('_');
            list_t.push([parseFloat(row_col[1]),parseFloat(row_col[2])]);
        }
    }

    if (list_t.length!==rows_puzzle_global*cols_puzzle_global){return false;}
    
    var blxl=0;
    for (let blr=0;blr<rows_puzzle_global;blr++){
        for (let blc=0;blc<cols_puzzle_global;blc++){
            if (list_t[blxl][0]!==blr || list_t[blxl][1]!==blc){return false;}
            blxl=blxl+1;
        }
    }
    document.getElementById('div_check').innerHTML='Done';
    document.getElementById('table_canvas').innerHTML='<tr><td><img src="'+img_puzzle_global.src+'" style="max-width:'+document.body.offsetWidth+'px;max-height:'+document_body_offsetHeight_b()+'px;" /></td></tr>';
    return true;
}

function init_puzzle(){
    character_2_icon_b('𓉔');
        
    var imgfile=path_convert_b('{{jsdoc_attachment}}images1/yu_wang_wei_ke_tuo_astfyf_69639/000001.jpg');
    rows_puzzle_global=randint_b(5,10);
    cols_puzzle_global=-1;
    border_width_puzzle_global=1;
    
    var cskeys=href_split_b(location.href);
    for (let item of cskeys){
        if (item.substring(0,4)=='img='){
            imgfile=item.substring(4,).trim();
        }
        if (item.substring(0,2)=='r='){
            rows_puzzle_global=parseInt(item.substring(2,).trim());
        }
        if (item.substring(0,2)=='c='){
            cols_puzzle_global=parseInt(item.substring(2,).trim());
        }        
    }

    td1_puzzle_global=false;
    img_puzzle_global=new Image();
    img_puzzle_global.onload=draw_puzzle;
    img_puzzle_global.src=imgfile;
}
