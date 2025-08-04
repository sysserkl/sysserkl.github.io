function showbigphoto_klphotos_b(csxl=0){
    function sub_showbigphoto_klphotos_b_month(str_t){
        let bljg='';
        let monthdays_t=month_day_b(str_t.substring(4,6),str_t.substring(0,4));
        let theday_t=parseInt(str_t.substring(6,8));
        for (let blxl=1;blxl<=monthdays_t;blxl++){
            if (blxl==theday_t){
                bljg=bljg+'<font color=red>'+blxl+'</font> ';
            } else {
                bljg=bljg+blxl+' ';
            }
        } 
        return bljg;
    }
    //-----------------------
	black_bg_t=klmenu_check_b('span_black_bg_klphoto',false);
    
    var filter_str=get_filter_style_klphotos_b(true);
    //背景图 - 保留注释
    slide_gery_div_b('div_grey_album_b',black_bg_t,imgpath_global+photodata_global[csxl][0],filter_str);

    var border_color=false;
    if (album_marked_rows_global.includes(imgpath_global+photodata_global[csxl][0])){
        border_color=marked_color_klphotos_b();
    }
    var list_t=slide_center_img_style_b(black_bg_t,filter_str,border_color);
    //list_t 形如：[ 20, 'style="max-height:743px;max-width:1560px;border:20px #7F7F7F solid;"' ] - 保留注释
    var border_size_t=list_t[0];
	var big_photo_id_t='div_big_photo_info_'+csxl+'_'+Math.round(Math.random()*100000);

	var bljg='<img src="'+imgpath_global+photodata_global[csxl][0]+'" id="img_big" '+list_t[1]+' />';
	bljg=bljg+'<div id="'+big_photo_id_t+'" ';
	bljg=bljg+'style="position:absolute;background-color:#ffffff;right:'+border_size_t+'px;bottom:'+border_size_t+'px;margin-left:'+border_size_t+';opacity:0.6;';
	if (black_bg_t==false){
		bljg=bljg+'border:1px #000000 solid;';
	}
	bljg=bljg+'">';
	bljg=bljg+'<table border=0 width=100%><tr><td align=left style="font-size:0.6rem;"><b>';

    if (photodata_global[csxl][0].includes('/')){
        var imgname=photodata_global[csxl][0].slice(photodata_global[csxl][0].lastIndexOf('/')+1);
    } else {
        var imgname=photodata_global[csxl][0];
    }
            
	if (photodata_global[csxl][1]!==''){
        bljg=bljg+photodata_global[csxl][1]+'/';
    }
    bljg=bljg+imgname;
    
	bljg=bljg+'</b></td><td align=right style="font-size:0.6rem;"><span id="span_exif"></span></td></tr></table></div>';    //<i>(img='+photodata_global[csxl][2]+')</i>
    
    if (klmenu_check_b('span_calendar_klphoto',false)){
        var str_t=(photodata_global[csxl][0].slice(photodata_global[csxl][0].lastIndexOf('/')+1)).substring(0,8);
        if (str_t.length==8 && isNaN(str_t)==false){
            bljg=bljg+'<div id="div_calendar" style="'+document.getElementById('textarea_calendar_css').value+'margin-left:'+border_size_t+';margin-right:'+border_size_t+';"><i>';
            bljg=bljg+'<span style="font-size:'+document.getElementById('input_calendar_month_font_size').value+'rem;">'+str_t.substring(4,6)+'</span> ';

            bljg=bljg+sub_showbigphoto_klphotos_b_month(str_t);
            if (klmenu_check_b('span_year_klphoto',false)){
                bljg=bljg+' / '+str_t.substring(0,4);
            }
            bljg=bljg+'</i></div>';
        }
    }

    var ocaption=document.getElementById('textarea_caption');
    if (ocaption && ocaption.value.trim()!==''){
        var list_t=document.getElementById('textarea_caption').value.trim().split('\n');
        bljg=bljg+'<div id="div_bigphoto_caption" style="'+document.getElementById('textarea_calendar_css').value+'margin-left:'+border_size_t+'px;margin-right:'+border_size_t+'px;">';
        bljg=bljg+'<br />'+list_t.join('<br />')+'</div>';
    }

	var blo_tmp=document.getElementById('div_big_album_b');
	blo_tmp.innerHTML=bljg;
	blo_tmp.style.display='block';
    
    getExif_klphotos_b();

	remove_info_klphotos_b(big_photo_id_t);
	
    //---
    var oimg=document.getElementById('img_big');
    oimg.onload = function(){
        let rect=oimg.getBoundingClientRect();
        blo_tmp.style.width=rect.width+'px';
        blo_tmp.style.height=rect.height+'px';  //否则div的大小和img的大小不完全匹配 - 保留注释
    };
    //---
    slide_hide_show_objects_b(['div_top_bottom','div_album_info_b','span_page_no1_album_b','span_page_no2_album_b','div_show_hide','h2_photo'],['div_grey_album_b','div_transparent']);
    
	imgnum_global=csxl;
}

function get_filter_style_klphotos_b(only_content=false){
    var oinput=document.getElementById('input_img_filter_dom_b');
    if (!oinput){return '';}
    
    var filter_str=oinput.value.trim();
    if (only_content){
        if (filter_str==''){return '';}
        return 'filter: '+filter_str+';';
    }
    filter_str=(filter_str==':'?'':' style="filter:'+filter_str+';"');
    return filter_str;
}

function remove_info_klphotos_b(big_photo_id_t){
	function sub_remove_info_klphotos_removeit(){
		var big_photo_t=document.getElementById(big_photo_id_t);
		if (big_photo_t){
			big_photo_t.style.opacity=0;
		}
	}
    if (typeof photo_info_global !== 'undefined'){
        clearTimeout(photo_info_global);    //全局变量
    }
	photo_info_global=setTimeout(sub_remove_info_klphotos_removeit,Math.min(img_sec_global*2/3,10*1000));
}

function getExif_klphotos_b(is_all=false){
    var oimg=document.getElementById('img_big');
    if (!oimg){return;}
    
	EXIF.getData(oimg, function(){
        if (is_all){
            var allMetaData = EXIF.getAllTags(this);
            var blsrc=decodeURIComponent(oimg.src);
            var result_t=[blsrc,path_convert_b(blsrc,false)];
            for (let key in allMetaData){
                result_t.push(key+': '+allMetaData[key]);
            }
            allMetaData=object2array_b(result_t);
            allMetaData.sort();
            alert(allMetaData.join('\n'));
            return;
        }
        
		var model = EXIF.getTag(this, 'Model');
		if (model){
			document.getElementById('span_exif').innerHTML=model;
		} else {
            document.getElementById('span_exif').innerHTML='';
        }
	});
}

function slide_klphotos_b(is_simple=false,csm1=''){
    slide_control_table_b('div_transparent','333');
    document.getElementById('div_transparent_td_l1').setAttribute('onclick','getExif_klphotos_b(true);');
    document.getElementById('div_transparent_td_l2').setAttribute('onclick','change_klphotos_b("%");');
   
    if (!is_simple){
        document.getElementById('div_transparent_td_l3').setAttribute('onclick','openimgwindow_klphotos_b(\'puzzle\');');
        document.getElementById('div_transparent_td_r3').setAttribute('onclick','openimgwindow_klphotos_b(\'canvas\');');
        document.getElementById('div_transparent_td_m1').setAttribute('onclick',csm1);        
        
        var blclear='clearInterval(imgshow_klphotos_global);';
    } else {
        var blclear='';
    }
    
    document.getElementById('div_transparent_td_r1').setAttribute('onclick','change_klphotos_b("tag");');
    document.getElementById('div_transparent_td_r2').setAttribute('onclick','change_klphotos_b("\'");');
    
    document.getElementById('div_transparent_td_m2').setAttribute('onclick','openimgwindow_klphotos_b();');
    document.getElementById('div_transparent_td_m3').setAttribute('onclick',blclear+'hide_div_big_photo_b();');
}

function export_form_klphotos_b(other_buttons=''){   
    var left_str='<p>'+close_button_b('div_array_album_b','');
    
    var right_str=other_buttons;
    right_str=right_str+'<span class="aclick" onclick="import_marked_rows_klphotos_b();">显示已标记图片名</span>';
    right_str=right_str+'<span class="aclick" onclick="delete_marked_rows_klphotos_b();">清空已标记图片名</span>';
    right_str=right_str+'</p>';

    var blstr=textarea_with_form_generate_b('textarea_export_klphotos','width:90%;height:25rem;',left_str,'清空,复制,发送到临时记事本,发送地址',right_str);
    document.getElementById('div_array_album_b').innerHTML=blstr;
}

function delete_marked_rows_klphotos_b(){
    if (album_marked_rows_global.length==0){return;}
    if (album_marked_rows_global.length==1 && album_marked_rows_global[0]==''){return;}
    
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空 '+album_marked_rows_global.length+' 条已标记链接') || '').trim()==rndstr){
        localStorage.removeItem('album_marked_rows');
        album_marked_rows_global=[];
    }
}

function import_marked_rows_klphotos_b(){
    if (album_marked_rows_global.length==0){return;}
    if (album_marked_rows_global.length==1 && album_marked_rows_global[0]==''){return;}
    
    if (confirm('是否导入 '+album_marked_rows_global.length+' 条已标记链接？')){
        document.getElementById('textarea_export_klphotos').value=album_marked_rows_global.join('\n');
    }
}

function album_marked_rows_get_klphotos_b(){
    album_marked_rows_global=local_storage_get_b('album_marked_rows',-1,true);
}


function import_img_item_klphotos_b(blitem){
    function sub_import_img_item_klphotos_b_one(item,category=''){
        item=item.split(' /// ')[0];
        if (item.match(/\.(jpg|jpeg|png|bmp|gif|webp)$/i)){
            photodata_global.push([item,category]);
        }    
    }
    
	if (Array.isArray(blitem)){
		for (let one_img of blitem){
            sub_import_img_item_klphotos_b_one(one_img,blitem[0]);
		}
	} else if (typeof blitem == 'string'){
        sub_import_img_item_klphotos_b_one(blitem);
	}
}

function import_img_data_klphotos_b(){
	photodata_global=[];
	//var img_xl_tmp=0;
	for (let item of photo_source_global){
		//img_xl_tmp=
        import_img_item_klphotos_b(item);   //img_xl_tmp
	}
	hide_div_big_photo_b();
	thumbnail_klphotos_b();
	
	document.getElementById('span_img_count').innerHTML='<i>('+photodata_global.length+')</i>';
}

function imgsearch_klphotos_b(csword,csreg){
	var csnum=arguments.length;
	if (csnum==0){
        var csword= document.getElementById('input_search').value.trim();
    }

	if (csnum<=1){
        var csreg=document.getElementById('input_reg').checked;
    }
    
    if (csword.slice(-4,)=='(:r)'){
        csreg=true;
        csword=csword.slice(0,-4);
    }
    
    document.getElementById('input_search').value=csword;
	document.getElementById('input_reg').checked=csreg;
    recent_search_klphotos_b(csword+(csreg?'(:r)':''));

	if (csword==''){return;}
    
	var blwordlist=csword.split(' ');
	
	photodata_global=[];
    var blfound0, blfound1;

    var t0=performance.now();       
	for (let item of photo_source_global){
        let is_str=(typeof item == 'string');
        blfound0=str_reg_search_b((is_str?item:item[0]),blwordlist,csreg);
        
		if (blfound0==-1){break;}

		if (blfound0){
            import_img_item_klphotos_b(item);
		} else if (!is_str){
            var sub_list=[];
            for (let blxl=1,lent=item.length;blxl<lent;blxl++){
                blfound1=str_reg_search_b(item[blxl],blwordlist,csreg);
                if (blfound1==-1){break;}
                if (blfound1){
                    sub_list.push(item[blxl]);
                }
            }
            if (sub_list.length>0){
                sub_list=[item[0]].concat(sub_list);
                import_img_item_klphotos_b(sub_list);
            }
        }
	}
    console.log('imgsearch_klphotos_b() 检索费时：'+(performance.now() - t0) + ' milliseconds');
	
    hide_div_big_photo_b();
	thumbnail_klphotos_b();
	
	document.getElementById('span_img_count').innerHTML='<i>('+photodata_global.length+')</i>';
}

function hide_div_big_photo_b(){
    slide_hide_show_objects_b(['div_big_album_b','div_grey_album_b','div_transparent'],['div_top_bottom','div_album_info_b','span_page_no1_album_b','span_page_no2_album_b','div_show_hide','h2_photo']);

    if (typeof imgshow_klphotos_global !== 'undefined'){
	    clearInterval(imgshow_klphotos_global);
    }
    
	var theimg_t=document.getElementById('images'+imgnum_global);
	if (theimg_t){
		var rect = theimg_t.getBoundingClientRect();
		window.scrollTo(0, Math.max(0,rect.top-50));
	}
}

function change_klphotos_b(realkey){
    switch (realkey){
	    case '%':
            if (imgnum_global-1<0 && klmenu_check_b('span_loop_klphoto',false)){
                imgnum_global=photodata_global.length;
                thumbnail_klphotos_b((Math.ceil(photodata_global.length/pageitems_global)-1)*pageitems_global);
                showbigphoto_klphotos_b(photodata_global.length-1);
            } else if (imgnum_global-1>=0){
                if (imgnum_global<=current_page_first_img_num_global){
                    var no_tmp=imgnum_global;
                    thumbnail_klphotos_b(Math.max(0,imgnum_global-pageitems_global));
                    imgnum_global=no_tmp;
                }
                showbigphoto_klphotos_b(imgnum_global-1);
            }
            break;
        case "'":
            if (imgnum_global+1>photodata_global.length-1 && klmenu_check_b('span_loop_klphoto',false)){
                imgnum_global=-1;
                thumbnail_klphotos_b(0);
                showbigphoto_klphotos_b(0);
            } else if (imgnum_global+1<=photodata_global.length-1){
                if (imgnum_global>=current_page_first_img_num_global+pageitems_global-1){
                    var no_tmp=imgnum_global;
                    thumbnail_klphotos_b(imgnum_global+1);
                    imgnum_global=no_tmp;
                }
                showbigphoto_klphotos_b(imgnum_global+1);
            }
            break;
	    case '':
            hide_div_big_photo_b();
            break;
        case 'tag':            
            if (album_marked_rows_global.length>=5000){
                alert('已标记达5000条，操作取消');
            } else {
                var blat=album_marked_rows_global.indexOf(imgpath_global+photodata_global[imgnum_global][0]);
                if (blat>=0){
                    album_marked_rows_global.splice(blat,1);
                } else {
                    album_marked_rows_global.push(imgpath_global+photodata_global[imgnum_global][0]);
                }
                localStorage.setItem('album_marked_rows',album_marked_rows_global.join('\n'));
                showbigphoto_klphotos_b(imgnum_global);
            }
            break;
    }
}

function mykeycontrol_klphotos_b(){
	var pbkeyevent=getEvent_klphotos_b();
	var myeventtagname=pbkeyevent.srcElement || pbkeyevent.target;
	if (['INPUT','TEXTAREA'].includes(myeventtagname.tagName)){
        return false;
    }
	var iekey=pbkeyevent.keyCode || pbkeyevent.which;
	var realkey=String.fromCharCode(pbkeyevent.keyCode||pbkeyevent.which);

	change_klphotos_b(realkey);
}

function show_temp_klphotos_b(csrnd=false,is_simple=false){
    var otemp=document.getElementById('textarea_temp_klphotos');
    if (!otemp){return;}
    
    var blstr=otemp.value.trim();
    if (blstr==''){return;}  
    var content_t=blstr.split('\n');
    content_t=path_convert_b(content_t,true);      

    photo_source_global=[];
    for (let item of content_t){
        photo_source_global.push(item);
    }
    if (csrnd){
        photo_source_global.sort(randomsort_b);
    }
    imgpath_global=''; //此时 此变量 失去作用，无须恢复原值 - 保留注释
    import_img_data_klphotos_b();
    if (!is_simple){
        document.getElementById('span_title').innerHTML='临时图片';
    }
}

function showhide_klphotos_b(){
	var odiv=document.getElementById('div_show_hide');
	if (odiv.style.display=='none'){
        odiv.style.display='block';
    } else {
        odiv.style.display='none';
    }
}

function recent_search_klphotos_b(csword=''){
    var common_list=['西湖|郭庄|西溪湿地|杭州花圃(:r)','山 坞','\\d{4}'+today_str_b('d','').slice(-4,)+'(:r)'];
    recent_search_b('recent_search_album',csword,'imgsearch_klphotos_b','div_recent_search',common_list);
}

function getEvent_klphotos_b(){
	if (document.all){
        return window.event;
    } 
	func=getEvent_klphotos_b.caller; 
	while (func!=null){ 
		var arg0=func.arguments[0]; 
		if (arg0){ 
			if (arg0.constructor==Event || (typeof(arg0)=='object' && arg0.preventDefault && arg0.stopPropagation)){ 
				return arg0; 
			} 
		} 
		func=func.caller; 
	} 
	return null; 
}

function openimgwindow_klphotos_b(cstype=''){
    var o_tmp=document.getElementById('img_big');
    if (!o_tmp){return;}
    
    switch (cstype){
        case 'puzzle':
            window.open('puzzle.htm?img='+o_tmp.src);
            break;
        case 'canvas':
            var blstyle=document.getElementById('input_img_filter_dom_b').value.trim();
            window.open(image_2_canvas_img_b(o_tmp,'jpeg',blstyle));
            break;
        default:
    	    window.open(o_tmp.src);
            break;
    }
}

function page_no_select_klphotos_b(cspages){
    var blno=page_location_b(cspages);
    if (blno!==false){
        thumbnail_klphotos_b((blno-1)*pageitems_global);
    }
}

function pages_klphotos_b(csno){
	if (photodata_global.length<=pageitems_global){
		document.getElementById('span_page_no1_album_b').innerHTML='';
		document.getElementById('span_page_no2_album_b').innerHTML='';
		return;
	}

    var bljg=page_combination_b(photodata_global.length,pageitems_global,csno,'thumbnail_klphotos_b','page_no_select_klphotos_b',false,0,0,'','aclick',0,false);

	document.getElementById('span_page_no1_album_b').innerHTML=bljg;
	document.getElementById('span_page_no2_album_b').innerHTML=bljg;
	
	imgnum_global=csno;
}

function thumbnail_klphotos_b(csno=0){
    function sub_thumbnail_klphotos_b_week(cstitle){
        let bldate=(cstitle.match(/^\d{8}/) || [''])[0];
        if (bldate!==''){
            cstitle=cstitle.substring(0,8)+'('+day_2_week_b(bldate,'cnbrief')+')'+cstitle.substring(8,);
        }
        return cstitle;
    }
    
	current_page_first_img_num_global = csno;

	var bljg='';
	var bltitle_tmp='';
	if (csno-pageitems_global>=0){
		bljg=bljg+'<div class="div_thumb"><table border=0 width=100% height=100%><tr><td align=center valign=center class="td_thumb" style="cursor:pointer;" onclick="thumbnail_klphotos_b('+(csno-pageitems_global)+');">';
		bljg=bljg+'<span style="text-decoration:none;font-size:2rem;"><font color=#707070>←<br />上一页</font></span> ';
		bljg=bljg+'</td></tr></table></div>';
	}
    var filter_str=get_filter_style_klphotos_b(true);
    
    var marked_color=marked_color_klphotos_b();
	for (let blxl=csno,lent=photodata_global.length-1;blxl<=lent;blxl++){
		if (bltitle_tmp=='' || bltitle_tmp!==photodata_global[blxl][1]){
			bltitle_tmp=photodata_global[blxl][1];
			if (bltitle_tmp!==''){
				bljg=bljg+'<div class="div_thumb"><table border=0 width=100% height=100%><tr>';
                bljg=bljg+'<td align=center valign=center class="td_thumb" style="word-break:break-all;word-wrap:break-word;overflow:hidden;';
				if (bltitle_tmp.length>=30){
					bljg=bljg+'font-size:0.9rem;';
				}
				bljg=bljg+'">';
				bljg=bljg+sub_thumbnail_klphotos_b_week(bltitle_tmp);
				bljg=bljg+'→</td></tr></table></div>';
			}
		}
		//data-src= - 保留注释
        var blstyle='';
        if (album_marked_rows_global.includes(imgpath_global+photodata_global[blxl][0])){
            blstyle='border-color: '+marked_color+'; border-style: solid; ';
        }
		bljg=bljg+'<img src="'+imgpath_global+photodata_global[blxl][0]+'" class="img_thumb"'+(blstyle+filter_str==''?'':' style="'+blstyle+filter_str+'"');
		if (photodata_global[blxl][1]==''){
            bljg=bljg+' title="'+photodata_global[blxl][0]+'"';
        } else {
            bljg=bljg+' title="'+photodata_global[blxl][1]+'"';
        }
		bljg=bljg+' onclick="showbigphoto_klphotos_b('+blxl+');" style="cursor:pointer;" id="images'+blxl+'">';
		
		if (blxl-csno+1>=pageitems_global){break;}
	}

	if (csno+pageitems_global<photodata_global.length){
		bljg=bljg+'<div class="div_thumb"><table border=0 width=100% height=100%><tr><td align=center valign=center class="td_thumb" style="cursor:pointer;" onclick="thumbnail_klphotos_b('+(csno+pageitems_global)+');">';
		bljg=bljg+'<span style="text-decoration:none;font-size:2rem;"><font color=#707070>下一页<br />→</font></span> ';
		bljg=bljg+'</td></tr></table></div>';
	}

	document.getElementById('div_thumb_album_b').innerHTML=bljg;
	pages_klphotos_b(csno);
	//var images = document.querySelectorAll(".img_thumb");
	//lazyload(images); - 保留注释
	document.location.href='#top';
}

function marked_color_klphotos_b(){
    return 'blue';
}

// GPS坐标转换函数
function parse_GPS_Coordinates_klphotos_b(gps){
    function sub_parse_GPS_Coordinates_klphotos_b_convert(degrees, ref){
        let decimal = degrees[0] + degrees[1]/60 + degrees[2]/3600;
        return (ref === 'S' || ref === 'W') ? -decimal : decimal;
    };

    if (!gps.latitude || !gps.longitude){
        return [false,false]
    };

    let lat=sub_parse_GPS_Coordinates_klphotos_b_convert(gps.latitude, gps.latRef);
    let lng=sub_parse_GPS_Coordinates_klphotos_b_convert(gps.longitude, gps.lonRef);
    
    return [lat,lng];
}

function div_generate_klphotos_b(){
    var blstr=`<div id="div_big_album_b" style="position: fixed; top: 50%; left: 50%; -webkit-transform: translateX(-50%) translateY(-50%); z-index: 99;background-color:#ffffff;"></div>
<div id="div_grey_album_b"></div>
<div id="div_array_album_b" style="margin:0.5rem;"></div>
<div id="div_album_info_b">
<p style="margin:0rem 0.5rem;"><span id="span_page_no1_album_b"></span></p>
<table border=0>
<tr>
<td id="td_treeview_album_b" style="word-break:break-all;word-wrap:break-word;" valign=top></td>
<td id="td_thumb_album_b" valign=top><div id="div_thumb_album_b"></div></td>
</tr>
</table>
<p style="margin:0rem 0.5rem;"><span id="span_page_no2_album_b"></span></p>
<div id="div_info_album_b" style="margin:0rem 0.5rem;"></div>
</div>`;
    document.getElementById('div_show_hide').insertAdjacentHTML('afterend',blstr);
}

function style_generate_klphotos_b(cssize=''){
    if (cssize==''){
        cssize=local_storage_get_b('album_thumb_size');
    }
    
    if (cssize==''){
        cssize='10rem';
    }
    
    let list_t=cssize.split(',');
    if (list_t.length==1){
        list_t.push(list_t[0]);
    }
    let csw,csh;
    [csw,csh]=list_t.slice(0,2);
    return `.img_thumb {max-height:`+csh+`; border:0.1rem dashed #c0c0c0;padding:0.2rem;margin:0.2rem;position:relative;float:left;cursor:pointer;}
.div_thumb {width:`+csw+`; height:`+csh+`; border:0.1rem dashed #c0c0c0; padding:0.2rem;margin:0.2rem; position:relative; float:left;}
.td_thumb {font-size:1.3rem; color:707070;word-break:normal; word-wrap:normal;}`;
}
