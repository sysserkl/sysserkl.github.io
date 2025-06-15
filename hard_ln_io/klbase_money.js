function content_media_money_b(csstr){
	var blcount=0;
	csstr=csstr.replace(new RegExp('&lt;&lt;',"g"),'<');
	csstr=csstr.replace(new RegExp('&gt;&gt;',"g"),'>');
	while (blcount<=100){
		var blat1=csstr.indexOf('<'+'!--mymedia--'+'>');
		if (blat1<0){
            return csstr;
        }
		
		var bltmp=csstr.substring(blat1-1+('<'+'!--/mymedia--'+'>').length);
		blat2=bltmp.indexOf('<'+'!--/mymedia--'+'>');
		if (blat2<0){
            return csstr;
        }
		
		bltmp=bltmp.substring(0,blat2);
		var bljg=bltmp;
		if (bljg.substring(0,7)=='[path1]'){
			bljg='http://'+location.host+'/wikiuploads/wpatt/'+bljg.substring(8);
		}
		
		if ('.jpg,.bmp,.png,.gif'.includes(bljg.substring(bljg.length-4).toLowerCase()) || '.avif,.jfif,.jpeg,.webp'.includes(bljg.substring(bljg.length-5).toLowerCase())){
			bljg='<div style="max-width:20rem;max-height:30rem;overflow:hidden;"><img src=\"'+bljg+'\" onclick="resizeimg_wp(this.parentNode);" style="max-width:100%;" border="0"></div>';
		} else {
			bljg='<a style="text-decoration:underline;" href=\"'+bljg+'\" target=_blank>'+bljg.substring(bljg.lastIndexOf('/')+1)+'</a>';
		}
		
		csstr=csstr.replace('<'+'!--mymedia--'+'>'+bltmp+'<'+'!--/mymedia--'+'>',bljg);
        csstr=csstr.replace(/^(https?:\/\/.*?)(\s|<)/g,'<a href="$1" target=_blank style="text-decoration:underline;color:blue;">$1</a>$2');
		blcount=blcount+1;
	}
	if (blcount>100){
        alert(csstr);
    }
	return csstr;
}

function color_money_b(csarr){
	var blvalue=(csarr[11]*csarr[12]).toFixed(5);
	var bljg='<span title="数量×单价 = '+blvalue+'"';
	if (blvalue<csarr[13]){
        bljg=bljg+' style="cursor:pointer;color:'+scheme_global['a-hover']+';" onclick="alert(\'数量×单价 = '+blvalue+'\');"';
    } else if (blvalue>csarr[13]){
        bljg=bljg+' style="cursor:pointer;color:'+scheme_global['a']+';" onclick="alert(\'数量×单价 = '+blvalue+'\');"';
    } else {
        bljg=bljg+' style="color:'+scheme_global['button']+';"';
    }

	bljg=bljg+'<b>●</b></span>';
	return bljg;
}

function search_link_money_b(csstr,cstype,fn_name='search_wp'){
	csstr=csstr.trim();
	var bljg='';
	switch (cstype){
		case '登记日期':
			var bltmp=fn_name+'(\"'+csstr+'(:'+cstype+')\");';
            bljg='<span class="span_underline_box" onclick=\''+bltmp+'\'>'+csstr+'</span>';
			break;        
		case '购置日期':
			var bltmp=fn_name+'(\"='+csstr+'(:'+cstype+')\");';
            bljg='<span class="span_underline_box" onclick=\''+bltmp+'\' title="'+Math.floor(days_between_two_dates_b(csstr))+'天以前">'+csstr+'</span>';
			break;
		case '子类':
			var blarr=csstr.split(',');
			var bljg='';
			var bltmp='';
			for (let item of blarr){
				bltmp=fn_name+'(\"';
				bltmp=bltmp+item+'(:'+cstype+')';
				bltmp=bltmp+'\");';
				bljg=bljg+' <span class="span_underline_box" onclick=\''+bltmp+'\'>'+item+'</span>';
			}
			break;
		case '出处':
		case '分类+子类':
		case '分类':
			if (!csstr.includes(' ') && cstype=='分类+子类'){
				var bltmp=fn_name+'(\"'+csstr+'(:分类) '+csstr+'(:子类)\");';
				bljg='<span class="span_underline_box" onclick=\''+bltmp+'\'>'+csstr+'</span>';
			} else {
				var blarr=csstr.split(' ');
				var bltmp=fn_name+'(\"';
				for (let item of blarr){
					bltmp=bltmp+'+'+item+'(:'+cstype+') ';
				}
				if (bltmp.substring(bltmp.length-1)==' '){
                    bltmp=bltmp.substring(0,bltmp.length-1);
                }
				bltmp=bltmp+'\");';
				bljg='<span class="span_underline_box span_'+(cstype=='出处'?'address':'class')+'_wp" onclick=\''+bltmp+'\'>'+csstr+'</span>';
			}
			break;
	}
	return bljg;
}

function list_tr_money_b(csarr,csxl,cssimple=false,csluru_php='wpluru.php',csnolink=false,csnew_window=true){
	var bljg='<tr class="trcolor"><td align=center nowrap width=1% style="padding-left:1rem;padding-right:1rem;font-size:1.5rem;"><span class="wpno">';

    if (csluru_php=='wp_pwa'){
        bljg=bljg+'<span class="span_link" onclick="edit_form_wp_pwa('+csarr[0]+','+asc_sum_b(csarr.join(''))+');"';
        bljg=bljg+' title="修改记录">'+(parseInt(csxl)+1).toString()+'</span>';    
    } else {
        bljg=bljg+'<a href="'+csluru_php+'?id='+csarr[0]+'&hash='+csarr[1]+'"';
        bljg=bljg+(csnew_window?' target=_blank':'');
        bljg=bljg+'>'+(parseInt(csxl)+1).toString()+'</a>';
    }
	bljg=bljg+'</span></td>';
	bljg=bljg+'<td><p class="p_wp_name" style="font-size:1.45rem;margin-top:0.5rem;margin-bottom:0.5rem;"><b>';
    if (csarr[2]=='失效物品'){
        bljg=bljg+'<strike style="color:'+scheme_global['a']+';"><font color="'+scheme_global['memo']+'">'+csarr[4]+'</font></strike>';
    } else {
        bljg=bljg+csarr[4];
    }
    bljg=bljg+'</b>';
    if (csarr[2]=='失效物品'){
        bljg=bljg+' <big><span style="color:'+scheme_global['a-hover']+'; font-weight:bold;">✗</span></big>';
    }
    bljg=bljg+'</p>';
	
	bljg=bljg+'<p style="font-size:1rem;">';
    if (csnolink){
        bljg=bljg+csarr[2];
        bljg=bljg+csarr[3];
        bljg=bljg+' / '+csarr[5];
    } else {
        bljg=bljg+search_link_money_b(csarr[2],'分类');
	    bljg=bljg+search_link_money_b(csarr[3],'子类');
        bljg=bljg+' / '+search_link_money_b(csarr[5],'出处');
    }

	bljg=bljg+' / <span class="span_amount_wp">'+csarr[11].toFixed(3)+'</span><span class="span_unit_wp">'+csarr[10]+'</span> / ';
    bljg=bljg+'<span class="span_price_wp">'+csarr[12].toFixed(2)+'</span>';
	bljg=bljg+' '+color_money_b(csarr);
    if (csarr[7]!=='忽略' || csarr[8]!=='忽略' || csarr[9]!=='忽略'){
	    bljg=bljg+' <font class="font_bookkeeping_info_wp" color=#c0c0c0>/ ';
        if (csluru_php=='wpluru.php'){
            bljg=bljg+'<span class="span_box span_template_wp" onclick="template_set_money_b(this);" title="发送当前记录到录入界面">登记</span> ';        
        } else {
            bljg=bljg+'登记 ';
        }
        bljg=bljg+csarr[7]+' '+csarr[8]+' '+csarr[9]+'</font>';
    }
    bljg=bljg+'</td>';
	bljg=bljg+'<td align=right nowrap width=6% style="font-size:1.45rem;font-weight:bold;" class="td_total_price_wp">'+csarr[13].toFixed(2)+'</td>';
	
    bljg=bljg+'</tr>';
	
	if (csarr[14].length>0 && cssimple==false){
        bljg=bljg+'<tr class="trcolor"><td colspan=3><p class=tb01>'+content_media_money_b(csarr[14])+'</td></tr>';
    }
	return bljg;
}

function template_set_money_b(csspan){
    var odiv=document.getElementById('jstj');
    if (!odiv){return;}
    var otrs=odiv.querySelectorAll('tr');
    for (let one_tr of otrs){
        var ospan=one_tr.querySelector('span.span_template_wp');
        if (!ospan){continue;}
        if (ospan==csspan){
            var dom_list=['span.span_class_wp','p.p_wp_name','span.span_unit_wp','span.span_amount_wp','span.span_price_wp','td.td_total_price_wp','span.span_address_wp'];
            var result_t=[];
            for (let dom_str of dom_list){
                var odom=one_tr.querySelector(dom_str);
                if (!odom){
                    result_t.push(dom_str+':');
                } else {
                    result_t.push(dom_str+':'+odom.innerText);
                }
            }
            localStorage.setItem('wp_template',result_t.join('\n'));
            break;
        }
    }
}

function template_get_money_b(){
    var list_t=local_storage_get_b('wp_template',-1,true);
    var id_list=[    
    'input_class',
    'input_name',
    'input_unit',
    'input_amount',
    'input_price',
    'input_total_price',
    'input_address',    
    ];
    if (list_t.length!==id_list.length){return;}
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var odom=document.querySelector('input[name="'+id_list[blxl]+'"');
        if (!odom){
            console.log('not found '+id_list[blxl]);
            continue;
        }
        var blat=list_t[blxl].indexOf(':');
        if (blat>=0){
            list_t[blxl]=list_t[blxl].substring(blat+1,);
        }
        if (['input_amount','input_price','input_total_price'].includes(id_list[blxl])){
            list_t[blxl]=parseFloat(list_t[blxl]);
        }
        odom.value=list_t[blxl];
    }
    localStorage.setItem('wp_template','');    
}

function from_day_money_b(csday){
    var ospan=document.getElementById('popup_'+csday);  //popup需要支持多个popup同时显示，不能使用event弹出唯一的div - 保留注释
    if (!ospan){return;}
    
    if (ospan.innerHTML!==''){
        popup_show_hide_b('popup_'+csday);
        return;
    }
    
    var fromarr=[];
    for (let item of csdata){
        if (item[6]!==csday){continue;}
        if (fromarr[item[5]]==undefined){
            fromarr[item[5]]=[item[5],0];
        }
        fromarr[item[5]][1]=fromarr[item[5]][1]+item[13] ;
    }
    
    var fromarr2=object2array_b(fromarr);
    fromarr2.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    
    var bljg=[];
    var blsum=0;
    for (let item of fromarr2){
        var bladdress=(item[0]==''?'无出处':item[0]);
        bljg.push('<tr><td nowrap>'+bladdress+'</td><td align=right>'+item[1].toFixed(2)+'</td></tr>');
        blsum=blsum+item[1];
    }
    bljg=bljg.join('\n')+'<tr><td>合计</td><td align=right>'+blsum.toFixed(2)+'</td></tr>';
    ospan.innerHTML='<table>'+bljg+'</table>';
    popup_show_hide_b('popup_'+csday);
}

function table_top_money_b(){
	return '<table class="tablebordertd2" width="100%" cellspacing=0 cellpadding='+(ismobile_b()?1:10)+' border="0" height=1>';
}

function table_detail_money_b(cspage=1,csstatus='',cspagenum=-1,cssimple=false,csluru_php='wpluru.php',csnolink=false,csnew_window=true){
    function table_detail_money_b_row(){
        let bljg='<tr><td colspan=3 style="border-top:double 0.5rem #e0e0e0;padding:1rem 0;"><big><strong>';
        if (csnolink){
            bljg=bljg+purchase_date;
        } else {
            bljg=bljg+search_link_money_b(purchase_date,'购置日期');
        }
        bljg=bljg+' <span onclick="from_day_money_b(\''+purchase_date+'\');" style="cursor:pointer;">'+day_2_week_b(purchase_date)+'</span></strong></big>'+popup_b('popup_'+purchase_date,'','','70%')+'</td></tr>';
        return bljg;
    }

    var bljg='';
    bljg=table_top_money_b()+'<tr><td colspan=3 style="border:0px;" id="td_recent_search"></td></tr><tr><td colspan=3 style="border:0px;" id="td_status_wp">'+csstatus+'</td></tr>';
    
    var purchase_date='';
    var blamount_total=0;
    var blamount_this_page=0;
    var blsum_this_page=0;
	for (let blxl=0,lent=csdata.length;blxl<lent;blxl++){
        var item=csdata[blxl];
        blamount_total=blamount_total+item[11];
		if (cspage<=0 || blxl>=cspage-1 && blxl<cspage-1+cspagenum){
            //cspage<=0 时则显示全部记录 - 保留注释
            if (item[6]!==purchase_date){
                purchase_date=item[6];
                bljg=bljg+table_detail_money_b_row();
            }
			bljg=bljg+list_tr_money_b(item,blxl,cssimple,csluru_php,csnolink,csnew_window);
            blamount_this_page=blamount_this_page+item[11];
            blsum_this_page=blsum_this_page+item[13];
		}
	}

    bljg=bljg+'</table>';
	
    return [bljg,blamount_total,blamount_this_page,blsum_this_page];
}

function luru_input_format_money_b(cstype='name'){
    var input_list=[
    ['input_class',4,0.8],
    ['input_name',18,0.8],
    ['input_unit',4,0.8],
    ['input_amount',6,0.8],
    ['input_price',6],
    ['input_total_price',8,0.8],
    ['input_address',18,0.8],
    ['input_day_purchase',10.5,1000],
    ['input_tag',12],
    ];
    input_size_b(input_list,cstype);
}

function editor_money_b(){
	var bljg=[];
    var list_t={'加粗':'<b>B</b>','下划线':'<u>U</u>','斜体':'<i>I</i>','删除线':'<strike>删除线</strike>','上标':'上标','下标':'下标','多媒体':'多媒体'};
    for (let key in list_t){
	    bljg.push('<span class="aclick" onclick=style_money_b("'+key+'") title="'+key+'" tabindex="-1">'+list_t[key]+'</span>');
    }
	var odiv=document.getElementById('div_editor');
	if (odiv){
        odiv.innerHTML=bljg.join('');
    }
}

function style_money_b(csedittype){
    function sub_style_money_b_multimedia(csstr){
        var blreg=/^\/home\/.+\/wpatt\/(.+)$/mg;
        if (csstr.match(blreg)){
            csstr=csstr.replace(blreg,'$1');
        }
        return csstr;
    }
    
	var blarray={
    '加粗':['<<B>>','<</B>>'],
    '下划线':['<<U>>','<</U>>'],
    '斜体':['<<I>>','<</I>>'],
    '删除线':['<<strike>>','<</strike>>'],
    '上标':['<<sup>>','<</sup>>'],
    '下标':['<<sub>>','<</sub>>'],
    '多媒体':['<<!--mymedia-->>[path1]/','<<!--/mymedia-->>'],
    };
    
    if (blarray[csedittype]==undefined){return;}
    
    var fontbegin=blarray[csedittype][0];
    var fontend=blarray[csedittype][1];

	var txa = document.getElementById('textarea_content');
	if (txa){
        if (csedittype=='多媒体'){
            dom_insert_str_b(txa,fontbegin,fontend,true,true,sub_style_money_b_multimedia);
        } else {
            dom_insert_str_b(txa,fontbegin,fontend);
        }
	}
}

function popup_selection_money_b(){
    function sub_popup_selection_money_b_generate(cslist,span_name,popup_name,input_name,add_empty=false){
        cslist.sort(function (a,b){return zh_sort_b(a,b);});
        if (add_empty){
            cslist=['清空'].concat(cslist);
        }
        var bljg='';
        for (let item of cslist){
            var blvalue=(item=='清空'?'':item);
            bljg=bljg+'<div style="margin-bottom:1rem;display:inline-block;font-weight:300;font-size:1.5rem;"><span class="span_box" style="padding:0.5rem;" onclick="document.getElementById(\''+input_name+'\').value=\''+blvalue+'\';popup_show_hide_b(\''+popup_name+'\');">'+item+'</span></div>';
        }
        var oclass=document.getElementById(span_name);
        if (oclass){
            oclass.insertAdjacentHTML('afterend',popup_b(popup_name,bljg,'','70%'));
        }
    }
    //-----------------------
    var list_t=["健康","食品","休闲","水电物","衣物","电脑","蔬菜","水果","礼金","交通","餐馆","工具","卫生","办公","卧室","化妆","厨房","家装","阅读","牛奶","通信","影视","投资","生活"];
    sub_popup_selection_money_b_generate(list_t,'span_class','popup_class','input_class');
    
    var from_list=local_storage_get_b('recent_from_wp',25,true);
    sub_popup_selection_money_b_generate(from_list,'span_from','popup_from','input_address',true);
}

function eval_calculator_money_b(){
    var str_t=document.getElementById('input_calculator').value.trim();
    localStorage.setItem('simple_calculator',str_t);
    var ospan=document.getElementById('span_calculator');
    if (str_t==''){
        ospan.innerHTML='未输入数学表达式';
        return;        
    }
    var checkstr=str_t.replace(new RegExp('[0-9]','g'),'');
    var checkstr=checkstr.replace(/[\.\s\+\-\*\/\(\)]/g,'');
    if (checkstr!==''){
        ospan.innerHTML='包含了多余字符：'+checkstr;
        return;
    }
    try {
        var blvalue=eval(str_t).toFixed(3);
    } catch (error){
        var blvalue=error;
    }
    document.getElementById('span_calculator').innerHTML=blvalue;
}

function calculator_generate_money_b(){
    var odiv=document.getElementById('div_calculator');
    if (!odiv){
        console.log('未发现 id: div_calculator');
        return;
    }
    var blstr=specialstr_j(local_storage_get_b('simple_calculator'));
    var bljg='计算器：<input type="text" name="input_calculator" id="input_calculator" value="'+blstr+'" onkeyup="if (event.key==\'Enter\'){eval_calculator_money_b();}"> = <span id="span_calculator"></span>';
    odiv.innerHTML=bljg;
    input_with_x_b('input_calculator',14,'',0.8);
}

function form_content_check_money_b(event=false){
	var blo_t=document.getElementById('textarea_content');
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

    if (typeof(add_or_modify_wp_global)=='string'){
        if (event && add_or_modify_wp_global.includes('修改') && local_storage_get_b('modify_confirm_wp')!==today_str_b()){
            if (!confirm('是否修改记录')){
                event.preventDefault();
            }
        }
    }
}

function electricity_get_money_b(csstr){
    var error='';
    var blname='电费';
    var bladdress='XX供电局';
    var blamount='';
    var total_price='';

    if (!csstr.includes('电量')){
        error='未发现电量';
        return [error,blname,bladdress,blamount,total_price,csstr];
    }
    
    var blat=csstr.indexOf('。本期');
    if (blat==-1){
        csstr=csstr.replace(/.*，户名：.*?，地址：.*?。/,'');
    } else {
        csstr=csstr.substring(blat+1,);
    }
    csstr=csstr.replace(/交费到期日为.*?，如已交费，敬请忽略，/g,'');
    csstr=csstr.replace('请及时交费，如已交费，敬请忽略，','');  
    csstr=csstr.replace(/可点击https:\/\/.*?查询详情。/g,'');
    csstr=csstr.split('\n')[0];
    
    var blamount=csstr.replace(/.*电量(.*?)度.*/g,'$1');
    var total_price=csstr.replace(/.*电费(.*?)元.*/g,'$1');
    if (isNaN(blamount) || isNaN(total_price)){
        error='未发现电量或电费数值';
        return [error,blname,bladdress,blamount,total_price,csstr];
    }
    return [error,blname,bladdress,blamount,total_price,csstr];
}

function elm_get_money_b(csstr,csdate,csaddress,to_line_style=false){
    //饿了么格式如下： - 保留注释
    //知味观干菜肉煎饼 400g/包
    //x 1
    //¥
    //8.92
    //¥15.8
    //折
    //进口蓝莓（秘鲁） 125±10g/盒
    //x 1
    //¥
    //8.75
    //¥13.6
    csstr=csstr.replace(/^支持\d+天无理由$/mg,'');
    csstr=csstr.replace(/\n+/mg,'\n');
    
    var list_t=csstr.trim().split('\n');
    var result_t=[];
    var blname='';
    var blamount='';
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl].trim();
        if (item.includes('/')){    //含有单位，如 /盒 - 保留注释
            blname=item;
            continue;
        } else if (blxl<list_t.length-1){
            if (list_t[blxl+1].match(/^x \d/)){ //不含有单位，但下一行是如 x 1 格式 - 保留注释
                blname=item;
                continue;
            }
        }
        if (blname==''){continue;}
        
        if (item.match(/^x\s+\d+$/g)!==null){
            blamount=item.split(' ').slice(-1,)[0];
            continue;
        }
        if (blamount==''){continue;}
        
        if (item.match(/^[0-9\.]+$/)!==null){
            result_t.push([blname,blamount,item]);
            blname='';
            blamount='';
        }
    }
    
    if (!to_line_style){
        return result_t;
    }
    
    var line_style_list=[];
    for (let item of result_t){
        var blcontent=`---
记录号:忽略
编号:忽略
分类:食品
子类:
名称:`+item[0]+`
出处:`+csaddress+`
购置日期:`+csdate+`
用户名:忽略
登记日期:忽略
登记时间:忽略
单位:
数量:`+item[1]+`
单价:
总价:`+item[2]+`
备注:`;
        line_style_list.push(blcontent);
    }    
    return [result_t,line_style_list];
}

function import_elm_money_b(textarea_id='textarea_idb_content'){   //饿了么 - 保留注释
    var otextarea=document.getElementById(textarea_id);
    if (!otextarea){return [false,false,''];}
    var blstr=otextarea.value.trim();
    if (blstr==''){return [false,false,''];}

    var bldate_default=date2str_b('-');
    var bldate=prompt('输入日期，默认'+bldate_default+'：');
    if (bldate==null){return [false,false,''];}
    bldate=bldate.trim();
    if (bldate==''){
        bldate=bldate_default;
    }

    var provider=(blstr.match(/^.*\(.*店\)$/mg) || ['']).slice(-1)[0];    //提取最后一次出现的店名，最先出现的可能是广告 - 保留注释
    if (provider!==''){
        provider='饿了么 '+provider.replace(/[\(\)]/g,'');
    }
    
    var bladdress=local_storage_get_b('wp_import_address');
    if (bladdress==''){
        bladdress=provider;
    }
    bladdress=prompt('输入地址（'+provider+'）：',bladdress);
    if (bladdress==null){return [false,false,''];}
    bladdress=bladdress.trim();
    localStorage.setItem('wp_import_address',bladdress);
    
    var result_t,line_style_list;
    [result_t,line_style_list]=elm_get_money_b(blstr,bldate,bladdress,true);

    if (result_t.length==0){
        return [false,false,'未发现饿了么数据'];
    }
    
    var alert_str=[];
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            alert_str.push((blxl+1)+'. '+result_t[blxl]);
    }
    if (!confirm('是否转换以下记录以备导入：\n'+alert_str.join('\n'))){return [false,false,''];}

    otextarea.value=line_style_list.join('\n');
    return [result_t,line_style_list,''];
}

function import_is_only_one_thing_money_b(textarea_id){
    var name_list=import_name_list_money_b(false,textarea_id,false);
    if (name_list.length!==1){
        alert('编辑框有'+name_list.length+'种物品，应只有一种');
        return '';
    }
    return name_list[0];
}

function import_number1_money_b(textarea_id,do_ask=true){
    var blname=import_is_only_one_thing_money_b(textarea_id);
    if (blname==''){return;}

    if (do_ask && !confirm('是否转换【'+blname+'】的数量为1？')){return;}
    
    var otextarea=document.getElementById(textarea_id);
    var blstr=otextarea.value.trim();
    blstr=blstr.replace(/^数量:.*$/mg,'数量:1.000');
    otextarea.value=blstr;
}

function import_vegetable_fruit_money_b(textarea_id,cscategory=false,do_ask=true){
    if (cscategory===false){
        cscategory=document.getElementById('select_wp_import_category_name').value;
    }
    if (cscategory==''){return;}
    
    var blname=import_is_only_one_thing_money_b(textarea_id);
    if (blname==''){return;}

    if (do_ask && !confirm('是否转换【'+blname+'】的分类为【'+cscategory+'】？')){return;}
    
    var otextarea=document.getElementById(textarea_id);
    var blstr=otextarea.value.trim();
    blstr=blstr.replace(/^(名称|分类):(.*)$/mg,'$1:'+cscategory);
    otextarea.value=blstr;
}

function elm_buttons_money_b(dom_id,textarea_id){
    var blstr=`<span class="aclick" onclick="import_name_list_money_b(true,'`+textarea_id+`');">名称列表</span>
<span class="aclick" onclick="import_statistics_money_b(true,'`+textarea_id+`');">数量与总价</span>
合并为一条记录：<span class="aclick" onclick="import_merge_money_b('`+textarea_id+`');">执行</span>
<span class="aclick" onclick="import_merge_money_b('`+textarea_id+`',1,'蔬菜');">数量为1的蔬菜</span>
<span class="aclick" onclick="import_merge_money_b('`+textarea_id+`',1,'水果');">数量为1的水果</span>

分类和名称修改为：<select id="select_wp_import_category_name"><option></option><option>蔬菜</option><option>水果</option></select>
<span class="aclick" onclick="import_vegetable_fruit_money_b('`+textarea_id+`');">修改</span>
<span class="aclick" onclick="import_number1_money_b('`+textarea_id+`');">数量改为1</span>
<select id="select_wp_import_retain_or_remove"><option>保留</option><option selected>剔除</option></select>
<input type="text" id="input_filter_wp_import" onkeydown="if (event.key=='Enter'){return false;}" />
<span class="aclick" onclick="import_filter_records_money_b(false,'`+textarea_id+`');">筛选</span>
<span class="aclick" onclick="import_jieba_records_money_b('`+textarea_id+`');">分词</span>`;

    var op=document.getElementById(dom_id);
    op.insertAdjacentHTML('beforeend',blstr);
    var input_list=[
    ['input_filter_wp_import',35,15],
    ];
    input_size_b(input_list,'id');  
    return op;
}

function import_name_list_money_b(do_alert=true,textarea_id='textarea_idb_content',with_no=true){
    var otextarea=document.getElementById(textarea_id);
    var blstr=otextarea.value.trim();
    var list_t=blstr.match(/^名称:.*$/mg) || [];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]=(with_no?(blxl+1)+'. ':'')+list_t[blxl].substring(3,);
    }
    if (do_alert){
        alert(list_t.join('\n'));
    }
    return list_t;
}

function import_statistics_money_b(do_alert=true,textarea_id='textarea_idb_content'){
    var otextarea=document.getElementById(textarea_id);
    var blstr=otextarea.value.trim();
    var list_t=blstr.match(/^(数量|总价):.*$/mg) || [];
    var amount=0;
    var total_price=0;
    for (let item of list_t){
        var blname=item.substring(0,3);
        var blvalue=parseFloat(item.substring(3,).trim());
        if (blname=='数量:'){
            amount=amount+blvalue;
        } else {
            total_price=total_price+blvalue;
        }        
    }
    if (do_alert){
        alert('数量: '+amount.toFixed(3)+' 总价: '+total_price.toFixed(2)+'￥');
    }
    return [otextarea,amount,total_price];
}

function import_data_get_money_b(textarea_id='textarea_idb_content'){
    var otextarea=document.getElementById(textarea_id);
    var blcontent=otextarea.value.trim();
    if (blcontent==''){return [false,false,false];}
    
    var list_t=('\n'+blcontent+'\n').split('\n---\n');
    var result_t=[];
    for (let item of list_t){
        if (item==''){continue;}
        result_t.push(item.trim());
    }
    var set_t=new Set(result_t);
    return [otextarea,result_t,set_t];
}

function import_merge_money_b(textarea_id='textarea_idb_content',amount_to_1=false,new_category_and_name=''){
    var otextarea,raw_list,set_t;
    [otextarea,raw_list,set_t]=import_data_get_money_b(textarea_id);
    if (otextarea===false){return;}
    if (raw_list.length==0){return;}
    
    var amount,total_price;    
    [otextarea,amount,total_price]=import_statistics_money_b(false,textarea_id);
    
    var blvalue=raw_list[0].split('\n');
    for (let blxl=0,lent=blvalue.length;blxl<lent;blxl++){
        var list_t=blvalue[blxl].split(':');
        if (list_t[0]=='数量'){
            if (amount_to_1){
                blvalue[blxl]='数量:1.000';
            } else {
                blvalue[blxl]='数量:'+amount.toFixed(3);
            }
        } else if (list_t[0]=='总价'){
            blvalue[blxl]='总价:'+total_price.toFixed(2);
        } else if (list_t[0]=='分类'){
            if (new_category_and_name!==''){
                blvalue[blxl]='分类:'+new_category_and_name;
            }
        } else if (list_t[0]=='名称'){
            if (new_category_and_name!==''){
                blvalue[blxl]='名称:'+new_category_and_name;
            }            
        }
    }
    
    if (!confirm('是否合并 '+raw_list.length+' 条数据为\n---\n'+blvalue.join('\n')+'\n？')){return;}
    otextarea.value='---\n'+blvalue.join('\n');
}


function import_filter_records_money_b(from_check_box=false,textarea_id='textarea_idb_content'){
    var otextarea,raw_list,set_t;
    [otextarea,raw_list,set_t]=import_data_get_money_b(textarea_id);
    if (otextarea===false){return;}
    
    var oinput=document.getElementById('input_filter_wp_import');
    if (from_check_box){
        var blstr='';
        var ocheckboxes=document.querySelectorAll('.checkbox_jieba_wpimport');
        for (let one_checkbox of ocheckboxes){
            if (one_checkbox.checked){
                blstr=blstr+' '+one_checkbox.parentNode.innerText;
            }
        }
        oinput.value=blstr;
    } else {
        var blstr=oinput.value.trim();
    }
    var is_reg=false;
    [blstr,is_reg]=str_reg_check_b(blstr,false);

    var is_include=(document.getElementById('select_wp_import_retain_or_remove').value=='保留');
    var included_t=[];
    var excluded_t=[];
    for (let blxl=0,lent=raw_list.length;blxl<lent;blxl++){
        var item=raw_list[blxl];
        var blfound=str_reg_search_b(item,blstr,is_reg);
        if (blfound==-1){break;}
        if (is_include && blfound || !is_include && !blfound){
            included_t.push(item);
        } else {
            excluded_t.push(item);        
        }
    }
    if (excluded_t.length==0){
        alert('没有可过滤的数据');
        return;
    }

    var blstr='是否保留 '+included_t.length+' 条记录：\n---\n'+included_t.slice(0,3).join('\n---\n')+'\n...\n';
    blstr=blstr+'是否剔除 '+excluded_t.length+' 条记录：\n---\n'+excluded_t.slice(0,3).join('\n---\n')+'\n...\n？';
    
    if (!confirm(blstr)){return;}
    otextarea.value='---\n'+included_t.join('\n---\n');
    
    document.getElementById('textarea_split_content').value='---\n'+excluded_t.join('\n---\n');
}

function import_jieba_records_money_b(textarea_id='textarea_idb_content'){
    var names=import_name_list_money_b(false,textarea_id);
    var cn_words=split_words_b(names.join(' '))[1];
    cn_words.sort(zh_sort_b);
    var list_t=[];
    for (let item of cn_words){
        list_t.push('<label><input type="checkbox" class="checkbox_jieba_wpimport" />'+item+'</label>');    //也可以设定 checkbox 的 value - 保留注释
    }
    var buttons='<p>';
    buttons=buttons+close_button_b('div_jieba_wpimport','')+' ';       
    buttons=buttons+'<span class="aclick" onclick="import_filter_records_money_b(true,\''+textarea_id+'\');">确定</span>';   
    buttons=buttons+'</p>';
    var odiv=document.getElementById('div_jieba_wpimport');
    odiv.innerHTML=list_t.join('\n')+buttons;
}

function remove_line_money_b(textarea_id){
    var otextarea=document.getElementById(textarea_id);
    if (!otextarea){return;}
    
    var blstr=otextarea.value;
    if (blstr==''){return;}
    
    var old_value=local_storage_get_b('wp_remove_line');
    if (old_value==''){
        old_value='不支持7天无理由';
    }
    var new_value=prompt('输入待删除的行：',old_value);
    if (new_value==null || new_value==''){return;}
    localStorage.setItem('wp_remove_line',new_value);
    
    var blcount=0;
    var result_t=[];
    var list_t=blstr.split('\n');
    for (let item of list_t){
        if (item==new_value){
            blcount=blcount+1;
            continue;
        }
        result_t.push(item);
    }
    
    if (blcount==0){
        alert('未发现指定行');
    } else {
        if (!confirm('发现指定行共 '+blcount+' 处，是否删除？')){return;}
        otextarea.value=result_t.join('\n');
    }
}
