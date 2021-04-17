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

    if (csluru_php=='wp_offline_luru'){
        bljg=bljg+'<span class="span_link" onclick="javascript:edit_form_wp_offline_luru('+csarr[0]+','+asc_sum_b(csarr.join(''))+');"';
        bljg=bljg+' title="修改记录">'+(parseInt(csxl)+1).toString()+'</span>';    
    }
    else {
        bljg=bljg+'<a href="'+csluru_php+'?id='+csarr[0]+'&hash='+csarr[1]+'"';
        bljg=bljg+(csnew_window?' target=_blank':'');
        bljg=bljg+'>'+(parseInt(csxl)+1).toString()+'</a>';
    }
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
    if (csarr[7]!=='忽略' || csarr[8]!=='忽略' || csarr[9]!=='忽略'){
	    bljg=bljg+' <font class="font_bookkeeping_info_wp" color=#c0c0c0>/ 登记 '+csarr[7]+' '+csarr[8]+' '+csarr[9]+'</font>';
    }
    bljg=bljg+'</td>';
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
    bljg=bljg+' <span onclick="javascript:from_day_money_b(\''+purchase_date+'\');" style="cursor:pointer;">'+day_2_week_b(purchase_date)+'</span></strong></big>'+popup_b('popup_'+purchase_date,'','','70%')+'</td></tr>';
    return bljg;
}

function from_day_money_b(csday){
    var ospan=document.getElementById('popup_'+csday);  //popup需要支持多个popup同时显示，不能使用event弹出唯一的div - 保留注释
    if (ospan){
        if (ospan.innerHTML!==''){
            popup_show_hide_b('popup_'+csday);
            return;
        }
        var fromarr=[];
        for (let item of csdata){
            if (item[6]!==csday){continue;}
            if (fromarr[item[5]]==null){
                fromarr[item[5]]=[item[5],0];
            }
            fromarr[item[5]][1]=fromarr[item[5]][1]+item[13] ;
        }
        
        var fromarr2=object2array_b(fromarr);
        fromarr2.sort(function (a,b) {return zh_sort_b(a,b,false,0);});
        
        var bljg=[];
        var blsum=0;
        for (let item of fromarr2){
            var bladdress=(item[0]==""?"无出处":item[0]);
            bljg.push('<tr><td nowrap>'+bladdress+'</td><td align=right>'+item[1].toFixed(2)+'</td></tr>');
            blsum=blsum+item[1];
        }
        bljg=bljg.join('\n')+'<tr><td>合计</td><td align=right>'+blsum.toFixed(2)+'</td></tr>';
        ospan.innerHTML='<table>'+bljg+'</table>';
        popup_show_hide_b('popup_'+csday);
    }
}

function table_top_money_b(){
	return '<table class="tablebordertd2" width="100%" cellspacing=0 cellpadding='+(ismobile_b()?1:10)+' border="0" height=1>';
}

function table_detail_money_b(cspage=1,csstatus='',cspagenum=-1,cssimple=false,csluru_php='wpluru.php',csnolink=false,csnew_window=true){
    var bljg='';
	if (csdata.length>0){
		bljg=table_top_money_b()+'<tr><td colspan=3 style="border:0px;" id="td_recent_search"></td></tr><tr><td colspan=3 style="border:0px;" id="td_status_wp">'+csstatus+'</td></tr>';
	}
	
    var date_t='';
    var blamount_total=0;
    var blamount_this_page=0;
    var blsum_this_page=0;
	for (let blxl=0;blxl<csdata.length;blxl++){
        var item=csdata[blxl];
        blamount_total=blamount_total+item[11];
		if (cspage<=0 || blxl<=cspage*cspagenum-1 && blxl>=(cspage-1)*cspagenum){
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

function luru_input_format_money_b(cstype='name'){
    var input_list=[
    ["input_class",4,0.8],
    ["input_name",18,0.8],
    ["input_unit",4,0.8],
    ["input_amount",6,0.8],
    ["input_price",6],
    ["input_total_price",8,0.8],
    ["input_address",18,0.8],
    ["input_day_purchase",10],
    ["input_tag",12],
    ];
    input_size_b(input_list,cstype);
}

function editor_money_b(){
	var bljg='';
    var list_t=["加粗","下划线","斜体","删除线","上标","下标","多媒体"];
    var list2_t=["<b>B</b>","<u>U</u>","<i>I</i>","<strike>删除线</strike>","上标","下标","多媒体"];
    for (let blxl=0;blxl<list_t.length;blxl++){
	    bljg=bljg+'<span class="aclick" onclick=style_money_b("'+list_t[blxl]+'") title="'+list_t[blxl]+'" tabindex="-1">'+list2_t[blxl]+'</span>';
    }
	var odiv=document.getElementById("div_editor");
	if (odiv){
        odiv.innerHTML=bljg;
    }
}

function style_money_b(csedittype){
	var fontbegin="";
	var fontend="";
	var blarray=[
    ["加粗","<<B>>","<</B>>"],
    ["下划线","<<U>>","<</U>>"],
    ["斜体","<<I>>","<</I>>"],
    ["删除线","<<strike>>","<</strike>>"],
    ["上标","<<sup>>","<</sup>>"],
    ["下标","<<sub>>","<</sub>>"],
    ["多媒体","<<!--mymedia-->>[path1]/","<<!--/mymedia-->>"],
    ];
	for(let blys of blarray){
		if (blys[0]==csedittype){
			fontbegin=blys[1];
			fontend=blys[2];
			break;
		}
	}

	var txa = document.getElementById("textarea_content");
	if (txa){
		var st=txa.selectionStart;
		var ed=txa.selectionEnd;
		txa.value=txa.value.substring(0,st)+fontbegin+txa.value.substring(st,ed)+fontend+txa.value.slice(ed);
	}
}

function popup_selection_money_b(){
    function sub_popup_selection_money_b_generate(cslist,span_name,popup_name,input_name){
        cslist.sort(function (a,b) {return zh_sort_b(a,b);});
        var bljg='';
        for (let item of cslist) {
            bljg=bljg+'<div style="margin-bottom:1rem;display:inline-block;font-weight:300;font-size:1.5rem;"><span class="span_box" style="padding:0.5rem;" onclick="javascript:document.getElementById(\''+input_name+'\').value=\''+item+'\';popup_show_hide_b(\''+popup_name+'\');">'+item+'</span></div>';
        }
        var oclass=document.getElementById(span_name);
        if (oclass){
            oclass.insertAdjacentHTML('afterend',popup_b(popup_name,bljg,'','70%'));
        }
    }
    //---------------
    var list_t=["健康","食品","休闲","水电物","衣物","电脑","蔬菜","水果","礼金","交通","餐馆","工具","卫生","办公","卧室","化妆","厨房","家装","阅读","牛奶","通信","影视","投资","生活"];
    sub_popup_selection_money_b_generate(list_t,'span_class','popup_class','input_class');
    
    var from_list=local_storage_get_b('recent_from_wp',25,true);
    sub_popup_selection_money_b_generate(from_list,'span_from','popup_from','input_address');
}

function eval_calculator_money_b(){
    var str_t=document.getElementById('input_calculator').value.trim();
    var ospan=document.getElementById('span_calculator');
    if (str_t==''){
        ospan.innerHTML='未输入数学表达式';
        return;        
    }
    var checkstr=str_t.replace(new RegExp('[0-9]','g'),'');
    var checkstr=checkstr.replace(new RegExp(/[\.\s\+\-\*\/\(\)]/,'g'),'');
    if (checkstr!==''){
        ospan.innerHTML='包含了多余字符：'+checkstr;
        return;
    }
    try {
        var blvalue=eval(str_t).toFixed(3);
    }
    catch (error) {
        var blvalue=error;
    }
    document.getElementById('span_calculator').innerHTML=blvalue;
}

function calculator_generate_money_b(){
    var odiv=document.getElementById('div_calculator');
    if (odiv){
        var bljg='计算器：<input type="text" name="input_calculator" id="input_calculator" onkeyup="javascript:if (event.key==\'Enter\'){eval_calculator_money_b();}"> = <span id="span_calculator"></span>';
        odiv.innerHTML=bljg;
        input_with_x_b('input_calculator',14,'',0.8);
    }
}

function form_content_check_money_b(){
	var blo_t=document.getElementById("textarea_content");
	if (blo_t){
		var blstr_t=blo_t.value.trim();
		
		var space_t=[' ', '　', '\t'];
		for (var blxl in space_t){
			while (blstr_t.includes('\n'+space_t[blxl])){
				blstr_t=blstr_t.replace(new RegExp('\n'+space_t[blxl],'g'),'\n');
			}
			while (blstr_t.includes(space_t[blxl]+'\r\n')){
				blstr_t=blstr_t.replace(new RegExp(space_t[blxl]+'\r\n','g'),'\r\n');
			}
			while (blstr_t.includes(space_t[blxl]+'\n')){
				blstr_t=blstr_t.replace(new RegExp(space_t[blxl]+'\n','g'),'\n');
			}
		}
		
		while (blstr_t.includes('\r\n\r\n')){
			blstr_t=blstr_t.replace(new RegExp('\r\n\r\n','g'),'\r\n');
		}
		while (blstr_t.includes('\n\n')){
			blstr_t=blstr_t.replace(new RegExp('\n\n','g'),'\n');	
		}
		
		blo_t.value=blstr_t;
	}
    var oaddress=document.getElementById('input_address');
    if (oaddress){
        var blfrom=oaddress.value.trim();
        local_storage_insert_unique_b('recent_from_wp',blfrom,25);
    }
}
