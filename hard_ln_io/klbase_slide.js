function slide_control_table_b(csdivid,cstdstyle='131'){
    var odiv=document.getElementById(csdivid);
    if (odiv){
        odiv.style.cssText='position: fixed; top: 0; left: 0; width:100%;height:100%; z-index: 100;opacity:0;';
        switch (cstdstyle){
            case '131':
                var bljg='<table width=100% height=100% border=1>';
                bljg=bljg+'<tr>';
                bljg=bljg+'<td width=30% rowspan=3 id="'+csdivid+'_td_l" style="cursor:w-resize;"></td>';
                bljg=bljg+'<td width=30% height=30% id="'+csdivid+'_td_m1" style="cursor:crosshair;"></td>';
                bljg=bljg+'<td width=30% rowspan=3 id="'+csdivid+'_td_r" style="cursor:e-resize;"></td>';
                bljg=bljg+'</tr>';
                bljg=bljg+'<tr>';
                bljg=bljg+'<td width=30% height=30% id="'+csdivid+'_td_m2" style="cursor:pointer;"></td>';
                bljg=bljg+'</tr>';
                bljg=bljg+'<tr>';
                bljg=bljg+'<td width=30% height=30% id="'+csdivid+'_td_m3" style="cursor:move;"></td>';
                bljg=bljg+'</tr>';
                bljg=bljg+'</table>';
                break;
            case '333':
                var bljg='<table width=100% height=100% border=1>';
                bljg=bljg+'<tr>';
                bljg=bljg+'<td width=30% id="'+csdivid+'_td_l1" style="cursor:nw-resize;"></td>';
                bljg=bljg+'<td width=30% height=30% id="'+csdivid+'_td_m1" style="cursor:crosshair;"></td>';
                bljg=bljg+'<td width=30% id="'+csdivid+'_td_r1" style="cursor:ne-resize;"></td>';
                bljg=bljg+'</tr>';
                bljg=bljg+'<tr>';
                bljg=bljg+'<td width=30% id="'+csdivid+'_td_l2" style="cursor:w-resize;"></td>';                
                bljg=bljg+'<td width=30% height=30% id="'+csdivid+'_td_m2" style="cursor:pointer;"></td>';
                bljg=bljg+'<td width=30% id="'+csdivid+'_td_r2" style="cursor:e-resize;"></td>';                
                bljg=bljg+'</tr>';
                bljg=bljg+'<tr>';
                bljg=bljg+'<td width=30% id="'+csdivid+'_td_l3" style="cursor:sw-resize;"></td>';                                
                bljg=bljg+'<td width=30% height=30% id="'+csdivid+'_td_m3" style="cursor:move;"></td>';
                bljg=bljg+'<td width=30% id="'+csdivid+'_td_r3" style="cursor:se-resize;"></td>';
                bljg=bljg+'</tr>';
                bljg=bljg+'</table>';
                break; 
        }
        odiv.innerHTML=bljg;
    }
}

function slide_gery_div_b(csdivid,csblack,csimg){
	if (csblack){
		document.getElementById(csdivid).style.cssText='position: fixed; top: 0%; left: 0%; width:100%;height:100%; z-index: 98;opacity:1;background-color:#000000;';
	}
	else {
        //background-img - 保留注释
		document.getElementById(csdivid).style.cssText='position: fixed; top: 0%; left: 0%; width:100%;height:100%; z-index: 98;opacity:1; filter: blur(5px);';
		document.getElementById(csdivid).style.backgroundImage='url("'+csimg+'")';
	}
}

function slide_center_img_style_b(csblack){
	if (csblack){
		var border_size_t=0;
		var bljg='style="max-height:'+document.body.clientHeight+'px;max-width:'+document.body.clientWidth+'px;"';
	}
	else {
		var border_size_t=Math.min(20,Math.max(1,Math.round(Math.min(document.body.clientHeight,document.body.clientWidth)*0.025)));	
		var bljg='style="max-height:'+(document.body.clientHeight-border_size_t*2)+'px;max-width:'+(document.body.clientWidth-border_size_t*2)+'px;border:'+border_size_t+'px #c0c0c0 solid;"';
	}
    return [border_size_t,bljg];
}

function slide_hide_show_objects_b(hidelist,showlist){
    for (let blxl in hidelist){
    	var obj=document.getElementById(hidelist[blxl]);
        if (obj){
            obj.style.display='none';
        }
    }
    for (let blxl in showlist){
	    var obj=document.getElementById(showlist[blxl]);
        if (obj){
            obj.style.display='block';
        }
    }
}
