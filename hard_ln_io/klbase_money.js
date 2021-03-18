function content_media_money_b(csstr){
	var blcount=0;
	csstr=csstr.replace(new RegExp('&lt;&lt;',"g"),'<');
	csstr=csstr.replace(new RegExp('&gt;&gt;',"g"),'>');
	while (blcount<=100){
		var blat1=csstr.indexOf('<'+'!--mymedia--'+'>');
		if (blat1<0){return csstr;}
		
		var bltmp=csstr.substring(blat1-1+('<'+'!--/mymedia--'+'>').length);
		blat2=bltmp.indexOf('<'+'!--/mymedia--'+'>');
		if (blat2<0){return csstr;}
		
		bltmp=bltmp.substring(0,blat2);
		var bljg=bltmp;
		if (bljg.substring(0,7)=='[path1]'){
			bljg='http://'+location.host+'/wikiuploads/wpatt/'+bljg.substring(8);
		}
		
		if ('.jpg,.bmp,.png,.gif'.includes(bljg.substring(bljg.length-4).toLowerCase()) || '.jpeg,.webp'.includes(bljg.substring(bljg.length-5).toLowerCase())){
			bljg='<div style="max-width:20rem;max-height:30rem;overflow:hidden;"><img src=\"'+bljg+'\" onclick="javascript:resizeimg_wp(this.parentNode);" style="width:100%;" border="0"></div>';
		}
		else{
			bljg='<a style="text-decoration:underline;" href=\"'+bljg+'\" target=_blank>'+bljg.substring(bljg.lastIndexOf('/')+1)+'</a>';
		}
		
		csstr=csstr.replace('<'+'!--mymedia--'+'>'+bltmp+'<'+'!--/mymedia--'+'>',bljg);
        csstr=csstr.replace(new RegExp(/^(https?:\/\/.*?)(\s|<)/,'g'),'<a href="$1" target=_blank style="text-decoration:underline;color:blue;">$1</a>$2');
		blcount=blcount+1;
	}
	if (blcount>100){
        alert(csstr);
    }
	return csstr;
}

function color_money_b(csarr){
	var blvalue=(csarr[11]*csarr[12]).toFixed(5);
	var bljg='<span title="数量×单价 = '+blvalue+'" style="cursor:pointer;">';
	if (blvalue<csarr[13]){
        bljg=bljg+'<font color='+scheme_global['a-hover']+'>';
    }
	else if (blvalue>csarr[13]){
        bljg=bljg+'<font color='+scheme_global['a']+'>';
    }
	else{
        bljg=bljg+'<font color='+scheme_global['button']+'>';
    }

	bljg=bljg+'<b>●</b></font></span>';
	return bljg;
}

function search_link_money_b(csstr,cstype,csname=''){
	csstr=csstr.trim();
	var bljg='';
    var fn_name='search_wp';
	switch (cstype){
		case "登记日期":
			var bltmp='javascript:'+fn_name+'(\"'+csstr+'(:'+cstype+')\");';
            bljg='<span class="span_underline_box" onclick=\''+bltmp+'\'>'+csstr+'</span>';
			break;        
		case "购置日期":
			var bltmp='javascript:'+fn_name+'(\"='+csstr+'(:'+cstype+')\");';
            bljg='<span class="span_underline_box" onclick=\''+bltmp+'\'>'+csstr+'</span>';
			break;
		case "子类":
			var blarr=csstr.split(',');
			var bljg='';
			var bltmp='';
			for (let item of blarr){
				bltmp='javascript:'+fn_name+'(\"';
				bltmp=bltmp+'\['+item+'\]$'+cstype+' ';	
				bltmp=bltmp+'\");';
				bljg=bljg+' <span class="span_underline_box" onclick=\''+bltmp+'\'>'+item+'</span>';
			}
			break;
		case "出处":
		case "分类+子类":
		case "分类":
			if (!csstr.includes(' ') && cstype=="分类+子类"){
				var bltmp='javascript:'+fn_name+'(\"'+csstr+'(:分类) '+csstr+'(:子类)\");';
				bljg='<span class="span_underline_box" onclick=\''+bltmp+'\'>'+csstr+'</span>';
			}
			else{
				var blarr=csstr.split(' ');
				var bltmp='javascript:'+fn_name+'(\"';
				for (let item of blarr){
					bltmp=bltmp+'+'+item+'(:'+cstype+') ';
				}
				if (bltmp.substring(bltmp.length-1)==' '){
                    bltmp=bltmp.substring(0,bltmp.length-1);
                }
				bltmp=bltmp+'\");';
				bljg='<span class="span_underline_box" onclick=\''+bltmp+'\'>'+csstr+'</span>';
			}
			break;
	}
	return bljg;
}

function list_tr_money_b(csarr,csxl,cssimple=false,csluru_php='wpluru.php',csnolink=false,csnew_window=true){
	var bljg='<tr class="trcolor"><td align=center nowrap width=1%><span class="wpno">';

	bljg=bljg+'<a href="'+csluru_php+'?id='+csarr[0]+'&hash='+csarr[1]+'"';
    bljg=bljg+(csnew_window?' target=_blank':'');
    bljg=bljg+'>'+(parseInt(csxl)+1).toString()+'</a>';
	bljg=bljg+'</span></td>';
	bljg=bljg+'<td><p style="font-size:1.45rem;margin-top:0.5rem;margin-bottom:0.5rem;"><b>';
    if (csarr[2]=='失效物品'){
        bljg=bljg+'<strike style="color:'+scheme_global['a']+';"><font color="'+scheme_global['memo']+'">'+csarr[4]+'</font></strike>';
    }
    else {
        bljg=bljg+csarr[4];
    }
    bljg=bljg+'</b>';
    if (csarr[2]=='失效物品'){
        bljg=bljg+' <big><span style="color:'+scheme_global['a-hover']+'; font-weight:600;">✗</span></big>';
    }
    bljg=bljg+'</p>';
	
	bljg=bljg+'<p style="font-size:1rem;">';
    if (csnolink){
        bljg=bljg+csarr[2];
        bljg=bljg+csarr[3];
        bljg=bljg+' / '+csarr[5];
    }
    else {
        bljg=bljg+search_link_money_b(csarr[2],"分类");
	    bljg=bljg+search_link_money_b(csarr[3],"子类");
        bljg=bljg+' / '+search_link_money_b(csarr[5],"出处");
    }

	bljg=bljg+' / '+csarr[11].toFixed(3)+csarr[10]+' / '+csarr[12].toFixed(2);
	bljg=bljg+' '+color_money_b(csarr);
	bljg=bljg+' <font color=#c0c0c0>/ 登记 '+csarr[7]+' '+csarr[8]+' '+csarr[9]+'</font></td>';
	bljg=bljg+'<td align=right nowrap width=6% style="font-size:1.45rem;font-weight:600;">'+csarr[13].toFixed(2)+'</td>';
	
    bljg=bljg+'</tr>';
	
	if (csarr[14].length>0 && cssimple==false){
        bljg=bljg+'<tr class="trcolor"><td colspan=3><p class=tb01>'+content_media_money_b(csarr[14])+'</td></tr>';
    }
	return bljg;
}

function date_row_money_b(purchase_date,csnolink){
    var bljg='<tr><td colspan=3 style="border-top:double 0.5rem #e0e0e0;padding:1rem 0;"><big><strong>';
    if (csnolink){
        bljg=bljg+purchase_date;
    }
    else {
        bljg=bljg+search_link_money_b(purchase_date,"购置日期");
    }
    bljg=bljg+' <span onclick="javascript:from_day_wp(\''+purchase_date+'\');" style="cursor:pointer;">'+day_2_week_b(purchase_date)+'</span></strong></big>'+popup_b('popup_'+purchase_date,'','','70%')+'</td></tr>';
    return bljg;
}

function table_top_money_b(){
	return '<table class="tablebordertd2" width="100%" cellspacing=0 cellpadding='+(ismobile_b()?1:10)+' border="0" height=1>';
}

function table_detail_money_b(cspage,csstatus,cspagenum,cssimple=false,csluru_php='wpluru.php',csnolink=false,csnew_window=true){
    var bljg='';
	if (csdata.length>0){
		bljg=table_top_money_b()+'<tr><td colspan=3 style="border:0px;" id="td_recent_search"></td></tr><tr><td colspan=3 style="border:0px;">'+csstatus+'</td></tr>';
	}
	
    var date_t='';
    var blamount_total=0;
    var blamount_this_page=0;
    var blsum_this_page=0;
	for (let blxl=0;blxl<csdata.length;blxl++){
        var item=csdata[blxl];
        blamount_total=blamount_total+item[11];
		if (blxl<=cspage*cspagenum-1 && blxl>=(cspage-1)*cspagenum){
            if (item[6]!==date_t){
                date_t=item[6];
                bljg=bljg+date_row_money_b(item[6],csnolink);
            }
			bljg=bljg+list_tr_money_b(item,blxl,cssimple,csluru_php,csnolink,csnew_window);
            blamount_this_page=blamount_this_page+item[11];
            blsum_this_page=blsum_this_page+item[13];
		}
	}

	if (csdata.length>0){
		bljg=bljg+'</table>';
	}
    return [bljg,blamount_total,blamount_this_page,blsum_this_page];
}
