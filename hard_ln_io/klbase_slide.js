function slide_control_table_b(csdivid,cstdstyle='131'){
    var odiv=document.getElementById(csdivid);
    if (!odiv){
        document.body.insertAdjacentHTML('beforeend','<div id="'+csdivid+'"></div>');
        var odiv=document.getElementById(csdivid);
    }
    if (!odiv){
        console.log('not found div: '+csdivid);
        return;
    }
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

function slide_gery_div_b(csdivid,csblack,csimg,user_style=''){
    var common_str='position: fixed; top: 0%; left: 0%; width:100%;height:100%; z-index: 98;';
    common_str=common_str+(user_style.includes('opacity')?'':'opacity:1; ');
	if (csblack){
		document.getElementById(csdivid).style.cssText=common_str+'background-color:#000000;'+user_style;
	} else {
        //background-img - 保留注释
		document.getElementById(csdivid).style.cssText=common_str+(user_style.includes('blur')?'':'filter: blur(5px);')+user_style;
		document.getElementById(csdivid).style.backgroundImage='url("'+csimg+'")';
	}
}

function slide_center_img_style_b(csblack,user_style='',border_color=false){
	if (csblack){
		var border_size_t=0;
		var bljg='style="max-height:'+document.documentElement.clientHeight+'px;max-width:'+document.documentElement.clientWidth+'px;'+user_style+'"';
	} else {
		var border_size_t=Math.min(20,Math.max(1,Math.round(Math.min(document.documentElement.clientHeight,document.documentElement.clientWidth)*0.025)));
        if (border_color===false){
            border_color=scheme_global['memo'];
        }
		var bljg='style="max-height:'+(document.documentElement.clientHeight-border_size_t*2)+'px;max-width:'+(document.documentElement.clientWidth-border_size_t*2)+'px;border:'+border_size_t+'px '+border_color+' solid;'+user_style+'"';
	}
    return [border_size_t,bljg];
}

function slide_hide_show_objects_b(hidelist,showlist){
    for (let item of hidelist){
        var obj=document.getElementById(item);
        if (obj){
            obj.style.display='none';
        }
    }
    for (let item of showlist){
        var obj=document.getElementById(item);
        if (obj){
            obj.style.display='block';
        }
    }
}
