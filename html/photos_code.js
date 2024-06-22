function export_array_klphotos(){
    var list_t=[];
    for (let item of photo_source_global){
        if (Array.isArray(item)){
            var str_t='[';
            for (let arow of item){
                str_t=str_t+'"'+specialstr92_b(arow)+'",\n';
            }
            str_t=str_t+'],';
            list_t.push(str_t);
        } else {
            list_t.push('"'+specialstr92_b(item)+'",');
        }
    }
    var otextarea=document.getElementById('textarea_export_klphotos');
    otextarea.value='var photo_source_global=[\n'+list_t.join('\n')+'\n];\n';
}

function export_current_klphotos(){
    var name_str='';
    var list_t=array_split_by_col_b(photodata_global,[0]);
    if (confirm('是否encodeURIComponent？')){
        for (let blxl=0;blxl<list_t.length;blxl++){
            list_t[blxl]=encodeURIComponent(album_current_global[0])+'&s='+encodeURIComponent(list_t[blxl]);
        }
        name_str='== 分隔行 '+date2str_b('')+' ==\nalbum_s_keys\n';
    }

    document.getElementById('textarea_export_klphotos').value=name_str+list_t.join('\n');
}

function export_form_klphotos(){
    var postpath=postpath_b();
	var blform='<form method="POST" action="'+postpath+'temp_txt_share.php" target=_blank>\n';
    
    var bltextarea='<textarea id="textarea_export_klphotos" name="textarea_export_klphotos" style="width:90%;height:25rem;"></textarea>';
    var bljg=close_button_b('div_array','');
    bljg=bljg+textarea_buttons_b('textarea_export_klphotos','清空,复制,发送到临时记事本,发送地址');
    bljg=bljg+'<span class="aclick" onclick="export_array_klphotos();">导出全部数组</span>';
    bljg=bljg+'<span class="aclick" onclick="export_current_klphotos();">导出当前图片文件名</span>';
    bljg=bljg+'<span class="aclick" onclick="import_marked_rows_klphotos();">导入已标记图片名</span>';
    bljg=bljg+'<span class="aclick" onclick="delete_marked_rows_klphotos();">清空已标记图片名</span>';

    document.getElementById('div_array').innerHTML=blform+bltextarea+'<p>'+bljg+'</p></form>';
}

function album_marked_rows_get_klphotos(){
    album_marked_rows_global=local_storage_get_b('album_marked_rows',-1,true);
}

function import_marked_rows_klphotos(){
    if (album_marked_rows_global.length==0){return;}
    if (album_marked_rows_global.length==1 && album_marked_rows_global[0]==''){return;}
    
    if (confirm('是否导入 '+album_marked_rows_global.length+' 条已标记链接？')){
        document.getElementById('textarea_export_klphotos').value=album_marked_rows_global.join('\n');
    }
}

function delete_marked_rows_klphotos(){
    if (album_marked_rows_global.length==0){return;}
    if (album_marked_rows_global.length==1 && album_marked_rows_global[0]==''){return;}
    
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空 '+album_marked_rows_global.length+' 条已标记链接') || '').trim()==rndstr){
        localStorage.removeItem('album_marked_rows');
        album_marked_rows_global=[];
    }
}

function gallery_2_canvas_klphotos(){
    function sub_gallery_2_canvas_klphotos_load(){
        var o_loaded_img=new Image();
        o_loaded_img.onload = function(){
            ctx.drawImage(o_loaded_img, 0, 0, o_loaded_img.width, o_loaded_img.height, 10,bltop,one_img_rect.width, one_img_rect.height);
            bltop=bltop+one_img_rect.height+10;

            blxl=blxl+1;
            if (blxl>=bllen){
                var jpeg_src=ocanvas.toDataURL('image/jpeg');
                document.getElementById('td_gallery_klphotos').innerHTML='<img src="'+jpeg_src+'" />';                
                return;
            }
            console.log(blxl,bllen,bltop,oimgs[blxl].src);
            sub_gallery_2_canvas_klphotos_load();
        }
        var one_img_rect = oimgs[blxl].getBoundingClientRect();
        o_loaded_img.src=oimgs[blxl].src;       
    }
    //-----------------------
    var otable=document.getElementById('table_gallery_klphotos');
    var blheight=0;
    var blwidth=0;
    var oimgs=otable.querySelectorAll('img');
    for (let one_img of oimgs){
        var rect = one_img.getBoundingClientRect();
        blwidth=Math.max(blwidth,rect.width);
        blheight=blheight+rect.height;
    }
    
    blwidth=10+blwidth+10;
    blheight=blheight+(oimgs.length+1)*10;
    
    otable.insertAdjacentHTML('afterend','<canvas id="canvas_gallery_klphotos" width="'+blwidth+'px" height="'+blheight+'px" style="border:0.1rem black solid;display:none;"></canvas>');
    var ocanvas=document.getElementById('canvas_gallery_klphotos');
    var ctx=ocanvas.getContext('2d');    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, ocanvas.width, ocanvas.height);
    
    var bltop=10;
    var bllen=oimgs.length;
    var blxl=0;
    sub_gallery_2_canvas_klphotos_load();
}

function gallery_klphotos(){
    if (photodata_global.length>100){
        alert('当前图片数超过100');
        return;
    }
    var list_t=(prompt('输入 最大宽度x最大高度（如 50remx100rem）：','50rem') || '').trim().split('x');
    var maxwidth='';
    var maxheight='';
    var bllen=list_t.length;
    if (bllen>=1){
        maxwidth=list_t[0];
    }
    if (bllen>=2){
        maxheight=list_t[1];
    }
    
    var result_t=[];
    var blpath=album_current_global[2];
    for (let item of photodata_global){
        result_t.push('<p style="margin-bottom:0.5rem;"><img src="'+(item[0].substring(0,4)=='http'?'':blpath)+item[0]+'" style="'+(maxwidth==''?'':'max-width:'+maxwidth+';')+(maxheight==''?'':'max-height:'+maxheight+';')+'" ondblclick="this.parentNode.outerHTML=\'\';" /></p>');
    }
    var blbuttons='<p>';
    blbuttons=blbuttons+close_button_b('div_info','');
    blbuttons=blbuttons+'<span class="aclick" onclick="gallery_2_canvas_klphotos();">Canvas</span>';    
    blbuttons=blbuttons+'</p>';
    
    document.getElementById('div_klphotos').innerHTML='';
    document.getElementById('span_page_no1').innerHTML='';
    document.getElementById('span_page_no2').innerHTML='';
            
    var odiv=document.getElementById('div_info');
    var img_border=klmenu_check_b('span_img_border',false);        

    odiv.innerHTML='<table id="table_gallery_klphotos" cellpadding=0 cellspacing=0 style="margin:0.5rem 0rem;"><tr><td id="td_gallery_klphotos" align="center"'+(img_border?' style="border:0.1rem solid black;padding:0.5rem;"':'')+'>'+result_t.join('\n')+'</td></tr></table>'+blbuttons;
    odiv.scrollIntoView();
}

function album_select_klphotos(odom,isrand=false){
    var ospan=odom.parentNode.querySelector('span.span_menu_container_item');
    location.href='?'+ospan.innerText+(isrand?'&rnd':'')
}

function slice_klphotos(){
    var bllen=photodata_global.length;
    var blrange=prompt('输入分割范围0,'+bllen+'：');
    if (blrange==null){return;}
        
    blrange=blrange.replace(/\s/g,'').split(',');
    if (blrange[0]==''){
        blrange[0]=0;
    } else {
        blrange[0]=parseInt(blrange[0]);
    }
    
    if (blrange.length==1){
        blrange[1]=bllen;
    } else {
        blrange[1]=parseInt(blrange[1]);    
    }

    if (confirm('是否保留当前结果的 '+blrange+' 部分？')){
        photodata_global=photodata_global.slice(blrange[0],blrange[1]);
        refresh_klphotos();
    }
}

function menu_klphotos(){
    var button_size='1rem';
    var str_t=klmenu_hide_b('');
    var menu_gallery=[];
    
    for (let item of albumlist_global){
        var group_list=[
        [item[0],'album_select_klphotos(this);',true],
        ['随机','album_select_klphotos(this,true);',true],
        ];    
        menu_gallery.push(menu_container_b(str_t,group_list,''));
    }

    var menu_tools=[
    '<span class="span_menu" onclick="'+str_t+'month_day_line_klphotos();">逐日照片数统计</span>',
    '<span class="span_menu" onclick="'+str_t+'timeline_category_klphotos();">Timeline</span>',   
    '<span class="span_menu" onclick="'+str_t+'screen_album_start_klphotos();">屏幕相框</span>',
    '<span class="span_menu" onclick="'+str_t+'export_form_klphotos();">导出数组和标记图片</span>',
    '<span class="span_menu" onclick="'+str_t+'gallery_klphotos();">当前图片合并显示</span>',  
    '<span class="span_menu" onclick="'+str_t+'slice_klphotos();">当前结果部分图片截取</span>',  
    ];

    var menu_month=[];
    for (let blxl=1;blxl<=12;blxl++){
        menu_month.push('<span class="span_menu" onclick="'+klmenu_hide_b('#div_info')+'month_album_klphotos('+blxl+');">'+blxl+'月</span>');
    }

    var menu_config=root_font_size_menu_b(str_t);
    menu_config=menu_config.concat([
    '<span id="span_black_bg_klphoto" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 幻灯片黑色背景</span>',    
    '<span id="span_loop_klphoto" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 无限循环播放幻灯片</span>',    
    '<span id="span_calendar_klphoto" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 在幻灯片中显示日历</span>',        
    '<span id="span_year_klphoto" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 在幻灯片中显示年份</span>',       
    '<span id="span_amount_klphoto" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 统计图显示合计数</span>',
    '<span id="span_img_border" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ img border</span>',        
    ]);   

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(menu_gallery,'🖼','17rem',button_size,button_size)+klmenu_b(menu_tools,'🔧','17rem',button_size,button_size)+klmenu_b(menu_month,'🈷️','5rem',button_size,button_size)+klmenu_b(menu_config,'⚙️','15rem',button_size,button_size),'','0rem')+' ');
    
    //-----------------------
    var button_more='<div class=klmenu><button style=font-size:'+button_size+';" onclick="popup_show_hide_b(\'div_css\');">Text Style</button></div>';
    button_more=button_more+'<div class=klmenu><button style=font-size:'+button_size+';" onclick="popup_show_hide_b(\'div_tempphoto_list\');">临时图片文件列表</button></div>';
    button_more=button_more+'<div class=klmenu><button style=font-size:'+button_size+';" onclick="popup_show_hide_b(\'textarea_caption\');">文字说明</button></div>';
    button_more=button_more+'<div class=klmenu><button style=font-size:'+button_size+';" onclick="popup_show_hide_b(\'p_filter\');">Filter</button></div>';

    document.getElementById('div_toolbar2').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(button_more,'block','0','0.2rem 0rem 0rem 0rem'));
}

function getExif_klphotos(is_all=false){
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

function import_img_item_klphotos(blitem,img_xl_tmp,csimport=true){
	if (Array.isArray(blitem)){
		for (let one_img of blitem){
			if (csimport){
                one_img=one_img.split(' /// ')[0];
                if (one_img.match(/\.(jpg|jpeg|png|bmp|gif|webp)$/i)){
				    photodata_global.push([one_img,blitem[0],img_xl_tmp]);
                }
			}
			img_xl_tmp=img_xl_tmp+1;
		}
	} else if (typeof blitem == 'string'){
		if (csimport){
            blitem=blitem.split(' /// ')[0];
            if (blitem.match(/\.(jpg|jpeg|png|bmp|gif|webp)$/i)){
			    photodata_global.push([blitem,'',img_xl_tmp]);
            }
		}
		img_xl_tmp=img_xl_tmp+1;
	}
	return img_xl_tmp;
}

function import_img_data_klphotos(){
	photodata_global=[];
	var img_xl_tmp=0;
	for (let item of photo_source_global){
		img_xl_tmp=import_img_item_klphotos(item, img_xl_tmp);
	}
	hide_div_big_photo();
	thumbnail_klphotos();
	
	document.getElementById('span_img_count').innerHTML='<i>('+photodata_global.length+')</i>';
}

function month_album_klphotos(month_t){
	document.getElementById('input_search').value='\\d{4}'+('00'+month_t).slice(-2)+'\\d{2}';
	document.getElementById('input_reg').checked=true;
	imgsearch_klphotos();
}

function showhide_klphotos(){
	var odiv=document.getElementById('div_show_hide');
	if (odiv.style.display=='none'){
        odiv.style.display='block';
    } else {
        odiv.style.display='none';
    }
}

function recent_search_klphotos(csword=''){
    recent_search_b('recent_search_album',csword,'imgsearch_klphotos','div_recent_search',['西湖|郭庄|西溪湿地|杭州花圃(:r)','山 坞','\\d{4}'+date2str_b('').slice(-4,)+'(:r)']);
}

function imgsearch_klphotos(csword,csreg){
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
    recent_search_klphotos(csword+(csreg?'(:r)':''));

	if (csword==''){return;}
    
	var blwordlist=csword.split(' ');
	
	photodata_global=[];
	var img_xl_tmp=0;
	for (let item of photo_source_global){
		if (typeof item == 'string'){
            var bltmp = item;
        } else {
            var bltmp = item[0];
        }

		var blfound=str_reg_search_b(bltmp,blwordlist,csreg);
		if (blfound==-1){break;}

		if (blfound){
			img_xl_tmp=import_img_item_klphotos(item,img_xl_tmp);
		} else {
			img_xl_tmp=import_img_item_klphotos(item,img_xl_tmp,false);
		}
	}

	hide_div_big_photo();
	thumbnail_klphotos();
	
	document.getElementById('span_img_count').innerHTML='<i>('+photodata_global.length+')</i>';
}

function sort_date_count_klphotos(cstype){
    var result_t=[];
    var odiv=document.getElementById('div_date_count_photo');
    var ospans=odiv.querySelectorAll('span.span_date_count_photo');
    for (let item of ospans){
        var bltxt=item.innerText;
        if (!bltxt.includes(':')){continue;}
        var list_t=bltxt.split(':');
        result_t.push([list_t[0],parseInt(list_t[1].trim())]);
    }
    if (cstype=='date'){
        result_t.sort();
    } else {
        result_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    }
    var bljg='';
    for (let blxl=0;blxl<result_t.length;blxl++){
        var item=result_t[blxl];
        bljg=bljg+'<p>'+(blxl+1)+'. <span class="span_date_count_photo">'+item[0]+': '+item[1]+'</span></p>';
    }
    odiv.innerHTML=bljg;
}

function month_day_line_klphotos(){
    //固定用2000年，闰年
    function sub_month_day_line_klphotos_ymd(csitem,hasyear=false){
        var list_t = csitem.split('/');
        var bljg=list_t[list_t.length-1];
        if (bljg.length>=8){
            if (hasyear){
                bljg=bljg.substring(0,8);
            } else {
                bljg=bljg.substring(4,8);
            }
            if (isNaN(bljg)){
                return '';
            }
            return bljg;
        } else {
            return '';
        }
    }

    function sub_month_day_line_klphotos_list(hasyear=false){
        var mdlist=[];
        for (let blxl in photodata_global){
            var bltmp = sub_month_day_line_klphotos_ymd(photodata_global[blxl][0],hasyear);
            if (bltmp==''){continue;}
            if (mdlist['d'+bltmp]==undefined){
                mdlist['d'+bltmp]=[bltmp,0];
            }
            mdlist['d'+bltmp][1]=mdlist['d'+bltmp][1]+1;
        }
        return mdlist;
    }
    //-----------------------
    var mdlist=sub_month_day_line_klphotos_list(false);

    var bljg='';
    var months_t=[31,29,31,30,31,30,31,31,30,31,30,31];

    var year1=photodata_global[0][0];
    var year2=photodata_global[photodata_global.length-1][0];
    year1=Math.min(3000,Math.max(1000,parseInt(year1.substring(0,4))));
    year2=Math.min(3000,Math.max(1000,parseInt(year2.substring(0,4))));
    
    if (year1==year2){
        var line_t=[year1];
    } else {
        var line_t=[year2+'-'+year1];
    }
    var blday_no=1;
    for (let blm=0;blm<12;blm++){
        var blm_days=months_t[blm];
        for (let blx=1;blx<=blm_days;blx++){
            var strmd=('0'+(blm+1)).slice(-2)+('0'+blx).slice(-2);
            if (mdlist['d'+strmd]==undefined){
                bljg=bljg+'<p>'+blday_no+'. <span class="span_date_count_photo">'+strmd.substring(0,2)+'月'+strmd.slice(-2)+'日: 0</span>\n</p>';
                line_t.push([new Date('2000-'+strmd.substring(0,2)+'-'+strmd.slice(-2)),0]);
            } else {
                bljg=bljg+'<p>'+blday_no+'. <span class="span_date_count_photo">'+strmd.substring(0,2)+'月'+strmd.slice(-2)+'日: '+mdlist['d'+strmd][1]+'</span>\n</p>';
                line_t.push([new Date('2000-'+strmd.substring(0,2)+'-'+strmd.slice(-2)),mdlist['d'+strmd][1]]);
            }
            blday_no=blday_no+1;
        }
    }
    
    bljg='<div id="div_date_count_photo" style="column-count: '+(ismobile_b()?2:5)+';">'+bljg+'</div>';
    bljg=bljg+'<p style="margin-top:0.5rem;magin-bottom:0.5rem;"><span class="oblong_box" onclick="sort_date_count_klphotos(\'date\');">按日期排序</span> ';
    bljg=bljg+'<span class="oblong_box" onclick="sort_date_count_klphotos(\'count\');">按数量排序</span></p>';    
    bljg=bljg+'<div id="div_flot_years" style="width:100%;height:600px;"></div>';
    if (year1!==year2){
        bljg=bljg+'<div id="div_flot_all" style="width:100%;height:600px;"></div>';    
    }
    bljg=bljg+'<p align=right>'+close_button_b('div_info','')+'</p>';
    bljg=bljg+'<p>&nbsp;</p><p>&nbsp;</p>';
        
    var mdlist2=sub_month_day_line_klphotos_list(true);
    var line2_t=[];
    for (let blxl=Math.min(year1,year2);blxl<=Math.max(year1,year2);blxl++){
        var list_t=[blxl.toString()];
        var empty_t=true;
        for (let blm=0;blm<12;blm++){
            var blm_days=month_day_b(blm+1,blxl);
            for (let blx=1;blx<blm_days;blx++){
                var strmd=blxl+('0'+(blm+1)).slice(-2)+('0'+blx).slice(-2);
                if (mdlist2['d'+strmd]==undefined){
                    list_t.push([new Date('2000-'+strmd.substring(4,6)+'-'+strmd.slice(-2)),0]);
                } else {
                    list_t.push([new Date('2000-'+strmd.substring(4,6)+'-'+strmd.slice(-2)),mdlist2['d'+strmd][1]]);
                    empty_t=false;
                }
            }
        }
        if (empty_t==false){
            line2_t.push(list_t);
        }
   }
    
    var odiv=document.getElementById('div_info');
    odiv.innerHTML=bljg;
    odiv.scrollIntoView();
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    if (year1!==year2){
        if (klmenu_check_b('span_amount_klphoto',false)){
            line2_t.push(line_t);
        }
        flot_lines_b([[...line_t]],'div_flot_all','nw',true,'%m月%d日');        
    }
    flot_lines_b(line2_t,'div_flot_years','nw',true,'%m月%d日');
}

function rndsearch_klphotos(){
	//photodata_global=[];
	//var img_xl_tmp=0;
	//for (let item of photo_source_global){
		//img_xl_tmp=import_img_item_klphotos(item,img_xl_tmp);
	//}
	
	for (let blxl=0;blxl<photodata_global.length;blxl++){
		photodata_global[blxl][1]='';
	}
    
	var bltotal_t=Math.floor((Math.random()*10)+1);
	for (let blxl=0;blxl<bltotal_t;blxl++){
		photodata_global.sort(randomsort_b);
	}
    refresh_klphotos();
}

function refresh_klphotos(){
	hide_div_big_photo();
	thumbnail_klphotos();

	document.getElementById('span_img_count').innerHTML='<i>('+photodata_global.length+')</i>';
}

function openimgwindow_klphotos(cstype=''){
    var o_tmp=document.getElementById('img_big');
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

function get_filter_style_klphotos(only_content=false){
    var filter_str=document.getElementById('input_img_filter_dom_b').value.trim();
    if (only_content){
        if (filter_str==''){return '';}
        return 'filter: '+filter_str+';';
    }
    filter_str=(filter_str==':'?'':' style="filter:'+filter_str+';"');
    return filter_str;
}

function thumbnail_klphotos(csno=0){
	current_page_first_img_num_global = csno;

	var bljg='';
	var bltitle_tmp='';
	if (csno-pageitems_global>=0){
		bljg=bljg+'<div class="div_thumb"><table border=0 width=100% height=100%><tr><td align=center valign=center class="td_thumb" style="cursor:pointer;" onclick="thumbnail_klphotos('+(csno-pageitems_global)+');">';
		bljg=bljg+'<span style="text-decoration:none;font-size:2rem;"><font color=#707070>←<br />上一页</font></span> ';
		bljg=bljg+'</td></tr></table></div>';
	}
    var filter_str=get_filter_style_klphotos(true);
    
	for (let blxl=csno;blxl<=photodata_global.length-1;blxl++){
		if (bltitle_tmp=='' || bltitle_tmp!==photodata_global[blxl][1]){
			bltitle_tmp=photodata_global[blxl][1];
			if (bltitle_tmp!=''){
				bljg=bljg+'<div class="div_thumb"><table border=0 width=100% height=100%><tr>';
                bljg=bljg+'<td align=center valign=center class="td_thumb" style="word-break:break-all;word-wrap:break-word;overflow:hidden;';
				if (bltitle_tmp.length>=30){
					bljg=bljg+'font-size:0.9rem;';
				}
				bljg=bljg+'">';
				bljg=bljg+bltitle_tmp;
				bljg=bljg+'→</td></tr></table></div>';
			}
		}
		//data-src= - 保留注释
        var blstyle='';
        if (album_marked_rows_global.includes(imgpath_global+photodata_global[blxl][0])){
            blstyle='border-color: red; border-style: solid; ';
        }
		bljg=bljg+'<img src="'+imgpath_global+photodata_global[blxl][0]+'" class="img_thumb"'+(blstyle+filter_str==''?'':' style="'+blstyle+filter_str+'"');
		if (photodata_global[blxl][1]==''){
            bljg=bljg+' title="'+photodata_global[blxl][0]+'"';
        } else {
            bljg=bljg+' title="'+photodata_global[blxl][1]+'"';
        }
		bljg=bljg+' onclick="showbigphoto_klphotos('+blxl+');" style="cursor:pointer;" id="images'+blxl+'">';
		
		if (blxl-csno+1>=pageitems_global){break;}
	}

	if (csno+pageitems_global<photodata_global.length){
		bljg=bljg+'<div class="div_thumb"><table border=0 width=100% height=100%><tr><td align=center valign=center class="td_thumb" style="cursor:pointer;" onclick="thumbnail_klphotos('+(csno+pageitems_global)+');">';
		bljg=bljg+'<span style="text-decoration:none;font-size:2rem;"><font color=#707070>下一页<br />→</font></span> ';
		bljg=bljg+'</td></tr></table></div>';		
	}

	document.getElementById('div_klphotos').innerHTML=bljg;
	pages_klphotos(csno);
	//var images = document.querySelectorAll(".img_thumb");
	//lazyload(images); - 保留注释
	document.location.href='#top';
}

function page_no_select_klphotos(cspages){
    var blno=page_location_b(cspages);
    if (blno!==false){
        thumbnail_klphotos((blno-1)*pageitems_global);
    }
}

function pages_klphotos(csno){
	if (photodata_global.length<=pageitems_global){
		document.getElementById('span_page_no1').innerHTML='';
		document.getElementById('span_page_no2').innerHTML='';
		return;
	}

    var bljg=page_combination_b(photodata_global.length,pageitems_global,csno,'thumbnail_klphotos','page_no_select_klphotos',false,0,0,'','aclick',0,false);

	document.getElementById('span_page_no1').innerHTML=bljg;
	document.getElementById('span_page_no2').innerHTML=bljg;
	
	imgnum_global=csno;
}

function showbigphoto_klphotos(csxl=0){
    function sub_showbigphoto_klphotos_month(str_t){
        var bljg='';
        var monthdays_t=month_day_b(str_t.substring(4,6),str_t.substring(0,4));
        var theday_t=parseInt(str_t.substring(6,8));
        for (var blxl=1;blxl<=monthdays_t;blxl++){
            if (blxl==theday_t){
                bljg=bljg+'<font color=red>'+blxl+'</font> ';
            } else {
                bljg=bljg+blxl+' ';
            }
        } 
        return bljg;
    }
    //-----------------------
	var bljg='';
	
	black_bg_t=klmenu_check_b('span_black_bg_klphoto',false);
    
    var filter_str=get_filter_style_klphotos(true);
    //背景图 - 保留注释
    slide_gery_div_b('div_grey_album',black_bg_t,imgpath_global+photodata_global[csxl][0],filter_str);

	bljg=bljg+'<img src="'+imgpath_global+photodata_global[csxl][0]+'" id="img_big" ';

    var border_color=false;
    if (album_marked_rows_global.includes(imgpath_global+photodata_global[csxl][0])){
        border_color='red';
    }
    var list_t=slide_center_img_style_b(black_bg_t,filter_str,border_color);
    //list_t 形如：[ 20, 'style="max-height:743px;max-width:1560px;border:20px #7F7F7F solid;"' ] - 保留注释
    var border_size_t=list_t[0];
    bljg=bljg+list_t[1];
    
	bljg=bljg+' />';
	var blo_tmp=document.getElementById('div_big_photo');
	
	big_photo_id_t='div_big_photo_info_'+csxl+'_'+Math.round(Math.random()*100000);

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
            
	if (photodata_global[csxl][1]==''){
		bljg=bljg+imgname;
	} else {
        bljg=bljg+photodata_global[csxl][1]+'/'+imgname;
    }
	bljg=bljg+'</b> <i>(img='+photodata_global[csxl][2]+')</i></td><td align=right style="font-size:0.6rem;"><span id="span_exif"></span></td></tr></table></div>';
    
    if (klmenu_check_b('span_calendar_klphoto',false)){
        var str_t=(photodata_global[csxl][0].slice(photodata_global[csxl][0].lastIndexOf('/')+1)).substring(0,8);
        if (str_t.length==8 && isNaN(str_t)==false){
            bljg=bljg+'<div id="div_calendar" style="'+document.getElementById('textarea_calendar_css').value+'margin-left:'+border_size_t+';margin-right:'+border_size_t+';"><i>';
            bljg=bljg+'<span style="font-size:'+document.getElementById('input_calendar_month_font_size').value+'rem;">'+str_t.substring(4,6)+'</span> ';

            bljg=bljg+sub_showbigphoto_klphotos_month(str_t);
            if (klmenu_check_b('span_year_klphoto',false)){
                bljg=bljg+' / '+str_t.substring(0,4);
            }
            bljg=bljg+'</i></div>';
        }
    }

    if (document.getElementById('textarea_caption').value.trim()!==''){
        var list_t=document.getElementById('textarea_caption').value.trim().split('\n');
        bljg=bljg+'<div id="div_bigphoto_caption" style="'+document.getElementById('textarea_calendar_css').value+'margin-left:'+border_size_t+'px;margin-right:'+border_size_t+'px;">';
        bljg=bljg+'<br />'+list_t.join('<br />')+'</div>';
    }
        
	blo_tmp.innerHTML=bljg;
    getExif_klphotos();

	remove_info_klphotos(big_photo_id_t);
	
	blo_tmp.style.display='block';
    //---
    var oimg=document.getElementById('img_big');
    if (oimg){
        var rect=oimg.getBoundingClientRect();
        blo_tmp.style.width=rect.width+'px';
        blo_tmp.style.height=rect.height+'px';  //否则div的大小和img的大小不完全匹配 - 保留注释
    }
    //---
    slide_hide_show_objects_b(['div_top_bottom','div_klphotos_info','span_page_no1','span_page_no2','div_show_hide','h2_photo'],['div_grey_album','div_transparent']);
    
	imgnum_global=csxl;
}

function remove_info_klphotos(big_photo_id_t){
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

function hide_div_big_photo(){
    slide_hide_show_objects_b(['div_big_photo','div_grey_album','div_transparent'],['div_top_bottom','div_klphotos_info','span_page_no1','span_page_no2','div_show_hide','h2_photo']);

	clearInterval(imgshow_klphotos_global);

	var theimg_t=document.getElementById('images'+imgnum_global);
	if (theimg_t){
		var rect = theimg_t.getBoundingClientRect();
		window.scrollTo(0, Math.max(0,rect.top-50));
	}
}

function getEvent_klphotos(){
	if (document.all){
        return window.event;
    } 
	func=getEvent_klphotos.caller; 
	while (func!=null){ 
		var arg0=func.arguments[0]; 
		if (arg0){ 
			if (arg0.constructor==Event || (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){ 
				return arg0; 
			} 
		} 
		func=func.caller; 
	} 
	return null; 
}

function mykeycontrol_klphotos(){
	var pbkeyevent=getEvent_klphotos();
	var myeventtagname=pbkeyevent.srcElement || pbkeyevent.target;
	if (['INPUT','TEXTAREA'].includes(myeventtagname.tagName)){
        return false;
    }
	var iekey=pbkeyevent.keyCode || pbkeyevent.which;
	var realkey=String.fromCharCode(pbkeyevent.keyCode||pbkeyevent.which);

	change_klphotos(realkey);
}

function autoshow_klphotos(){
	clearInterval(imgshow_klphotos_global);
	img_sec_global = Math.max(50, parseInt(document.getElementById('input_slide_interval').value)*1000);
	imgshow_klphotos_global=setInterval(next_klphotos,img_sec_global);
	if (imgnum_global==photodata_global.length-1 || imgnum_global>=current_page_first_img_num_global+pageitems_global-1){
		clearInterval(imgshow_klphotos_global);
	}
}

function next_klphotos(){
	change_klphotos("'");
}

function change_klphotos(realkey){
    switch (realkey){
	    case '%':
            if (imgnum_global-1<0 && klmenu_check_b('span_loop_klphoto',false)){
                imgnum_global=photodata_global.length;
                thumbnail_klphotos((Math.ceil(photodata_global.length/pageitems_global)-1)*pageitems_global);
                showbigphoto_klphotos(photodata_global.length-1);
            } else if (imgnum_global-1>=0){
                if (imgnum_global<=current_page_first_img_num_global){
                    var no_tmp=imgnum_global;
                    thumbnail_klphotos(Math.max(0,imgnum_global-pageitems_global));
                    imgnum_global=no_tmp;
                }
                showbigphoto_klphotos(imgnum_global-1);
            }
            break;
        case "'":
            if (imgnum_global+1>photodata_global.length-1 && klmenu_check_b('span_loop_klphoto',false)){
                imgnum_global=-1;
                thumbnail_klphotos(0);
                showbigphoto_klphotos(0);
            } else if (imgnum_global+1<=photodata_global.length-1){
                if (imgnum_global>=current_page_first_img_num_global+pageitems_global-1){
                    var no_tmp=imgnum_global;
                    thumbnail_klphotos(imgnum_global+1);
                    imgnum_global=no_tmp;
                }
                showbigphoto_klphotos(imgnum_global+1);
            }
            break;
	    case '':
            hide_div_big_photo();
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
                showbigphoto_klphotos(imgnum_global);
            }
            break;
    }
}

function args_klphotos(cskeys){
    var cskeys=href_split_b(location.href);
    document.getElementById('span_title').innerHTML=album_current_global[0]+(cskeys.includes('rnd')?' - 随机':'');
    
	for (let bltmpstr of cskeys){
		bltmpstr=bltmpstr.trim();
		if (bltmpstr.substring(0,2)=='s='){
			var bls_reg=bltmpstr.substring(2).split('_'); //河流_reg
			if (bls_reg.length>1){
				if (bls_reg[1]=='reg'){
                    imgsearch_klphotos(bls_reg[0],true);
                } else {
                    imgsearch_klphotos(bltmpstr.substring(2));
                }
			} else {
                imgsearch_klphotos(bls_reg[0]);
            }
		} else if (bltmpstr.substring(0,4)=='img='){
			var num_tmp=Math.min(photodata_global.length-1,Math.max(0,parseInt(bltmpstr.substring(4))));
			var page_tmp=pageitems_global*(Math.ceil((num_tmp+1)/pageitems_global)-1);
			thumbnail_klphotos(page_tmp);
			showbigphoto_klphotos(num_tmp);
		} else if (bltmpstr.substring(0,3)=='rnd'){
			rndsearch_klphotos();
		} else if (bltmpstr.substring(0,4)=='auto'){
			showbigphoto_klphotos(0);
			autoshow_klphotos();
		}
	}
}

function show_temp_klphotos(csrnd=false){
    var otemp=document.getElementById('textarea_temp_klphotos');
    if (!otemp){return;}
    
    var blstr=otemp.value.trim();
    if (blstr==''){return;}        
    var content_t=blstr.split('\n');
    
    photo_source_global=[];
    for (let item of content_t){
        photo_source_global.push(item);
    }
    if (csrnd){
        photo_source_global.sort(randomsort_b);
    }
    imgpath_global=''; //此时 此变量 失去作用，无须恢复原值 - 保留注释
    import_img_data_klphotos();
    document.getElementById('span_title').innerHTML='临时图片';
}

function screen_album_end_klphotos(){
    document.exitFullscreen();
    document.getElementById('div_album').style.display='none';
    slide_hide_show_objects_b([],['div_top_bottom','div_klphotos_info','span_page_no1','span_page_no2','div_show_hide','h2_photo']);
    document.body.style.overflow='auto';
    clearInterval(show_screen_album_klphotos_global);
}

function screen_album_start_klphotos(){
    document.getElementById('div_album').style.display='block';
    document.body.requestFullscreen();
    
    slide_hide_show_objects_b(['div_top_bottom','div_klphotos_info','span_page_no1','span_page_no2','div_show_hide','h2_photo'],[]);
    document.body.style.overflow='hidden';
    for (let blxl=0;blxl<5;blxl++){
        screen_album_klphotos();
    }
    var seconds=1000*document.getElementById('input_slide_interval').value;
    show_screen_album_klphotos_global=setInterval(screen_album_klphotos,seconds);
}

function screen_album_klphotos(){    
    var window_w=document.documentElement.clientWidth;
    var window_h=document.documentElement.clientHeight;
    
    var album_w=randint_b(window_w/6.4,window_w/1.5);
    var album_h=randint_b(window_h/3.6,window_h/1.5);
    var album_border=randint_b(window_w/200,window_w/100);
    var album_shadow=Math.max(2,Math.round(window_w/640));

    var album_left=randint_b(0,window_w-album_w-album_border*2-album_shadow*2);
    var album_top=randint_b(0,window_h-album_h-album_border*2-album_shadow*2);
    var rndcolor=rndcolor_b();
    rotate=0;
    if (Math.random()>0.5){
        rotate=randint_b(-22,22);
    }
    var imgfile=imgpath_global+photodata_global[imgnum_global][0];
    imgnum_global=imgnum_global+1;
    if (imgnum_global>=photodata_global.length){
        imgnum_global=0;
    }
    var bljg='';
    bljg=bljg+'<div class="div_a_photo" style="position:absolute; left:'+album_left+'px; top:'+album_top+'px;">';
    bljg=bljg+'<a href="'+imgfile+'" target=_blank>';
    bljg=bljg+'<img src="'+imgfile+'" style="max-width:'+album_w+'px; max-height:'+album_h+'px; border:'+album_border+'px solid '+rndcolor+'; border-radius: '+album_border+'px; box-shadow: '+album_shadow+'px '+album_shadow+'px '+album_shadow+'px grey; transform:rotate('+rotate+'deg);" />';
    bljg=bljg+'</a>';
    bljg=bljg+'</div>';

    var odiv=document.getElementById('div_album');
    var ophotos=odiv.getElementsByClassName('div_a_photo');
    if (ophotos.length>10){
        for (let item of ophotos){
            if (Math.random()>0.8){
                item.parentNode.removeChild(item);
            }
        }
    }
    
    odiv.insertAdjacentHTML('beforeend',bljg);
}

function calendar_css_klphotos(){
    var list_t=[
    'position:absolute;bottom:3%;font-size:1.5rem;color:white;padding-left:10px;padding-right:10px;',
    'position:absolute;right:4%;bottom:1%;font-size:2.4rem;color:white;padding:60px;font-family:FZDocKai;writing-mode: vertical-rl;',
    'position:absolute;right:1%;bottom:1%;font-size:3.5rem;color:#882dbe;font-weight:bold;padding:60px;font-family:方正启体简体;writing-mode: vertical-rl;',
    ];
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<option>'+item+'</option>';
    }
    document.getElementById('select_css').innerHTML=bljg;
    document.getElementById('textarea_calendar_css').value=list_t[0];
}

function data_load_klphotos(){
    //photo_info_global;
    albumlist_global=albumlist_kl_global.concat(albumlist_pb_global);
    albumlist_pb_global=null;
    albumlist_kl_global=null;
    album_current_global=[];
    if (albumlist_global.length>0){
        album_current_global=albumlist_global[0];
    }
    
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0){
        for (let item of albumlist_global){
            if (item[0]==cskeys[0]){
                album_current_global=item;
                break;
            }
        }
    }

    photo_source_global=[];
    album_current_global[1]=path_convert_b(album_current_global[1]);
    album_current_global[2]=path_convert_b(album_current_global[2]);
    write_js_css_b([['js',album_current_global[1],'']],true);
    imgpath_global=album_current_global[2];    
}

function data_set_klphotos(){
    var blfilter_str=album_current_global[4];
    if (album_current_global[3]){ //元素为数组型 - 保留注释
        blfilter_str=filter_str_img_b(blfilter_str);
        if (blfilter_str!==''){
            var list_t=[];
            for (let one_array of photo_source_global){
                var temp_t=[];
                for (let item of one_array){
                    if (item.includes(' /// ')){
                        if (item.match(blfilter_str)){
                            temp_t.push(item);
                        }
                    } else {
                        temp_t.push(item);
                    }
                }
                if (temp_t.length>1){
                    list_t.push(temp_t);
                }
            }
            photo_source_global=list_t;
        }
        photo_source_global.sort(function(a,b){return zh_sort_b(a,b,true,0);});
    } else {
        //元素为字符串型 - 保留注释
        photo_source_global=filter_array_img_b(photo_source_global,blfilter_str)
        photo_source_global.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    }
}

function slide_klphotos(){
    slide_control_table_b('div_transparent','333');
    document.getElementById('div_transparent_td_l1').setAttribute('onclick','getExif_klphotos(true);');
    document.getElementById('div_transparent_td_l2').setAttribute('onclick','change_klphotos("%");');
    document.getElementById('div_transparent_td_l3').setAttribute('onclick','openimgwindow_klphotos(\'puzzle\');');
    document.getElementById('div_transparent_td_r1').setAttribute('onclick','change_klphotos("tag");');
    document.getElementById('div_transparent_td_r2').setAttribute('onclick','change_klphotos("\'");');
    document.getElementById('div_transparent_td_r3').setAttribute('onclick','openimgwindow_klphotos(\'canvas\');');
    document.getElementById('div_transparent_td_m1').setAttribute('onclick','change_klphotos("\'");clearInterval(imgshow_klphotos_global);autoshow_klphotos();');
    document.getElementById('div_transparent_td_m2').setAttribute('onclick','openimgwindow_klphotos();');
    document.getElementById('div_transparent_td_m3').setAttribute('onclick','clearInterval(imgshow_klphotos_global);hide_div_big_photo();');
}

function init_klphotos(){
    //variable global
    imgnum_global=0;
    current_page_first_img_num_global=0;
    pageitems_global=30;
    imgshow_klphotos_global=false;
    photodata_global=[];   //文件名，数组分类名，在 photo_source_global 中的序号 - 保留注释
    img_sec_global=Math.max(50, parseInt(document.getElementById('input_slide_interval').value)*1000);
    
    //---
    document.getElementById('p_filter').innerHTML=filter_form_img_b();
    var input_list=[
    ['input_img_filter_dom_b',12,0.5],
    ];
    input_size_b(input_list,'id');    
    input_with_x_b('input_search',15);

    slide_klphotos();

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2rem':'1.5rem'));
    calendar_css_klphotos();

    data_set_klphotos();
    album_marked_rows_get_klphotos();
    
    if (is_local_b()){
        menu_klphotos();
        import_img_data_klphotos();
        args_klphotos();
        recent_search_klphotos();
    }    
}

function timeline_oneyear_klphotos(csstr='',isyear=true){
    var olis=document.querySelectorAll('td#td_treeview_klphotos ol li.li_treeview_klphotos');
    var blreg=false;
    if (isyear===false && csstr.slice(-4,)=='(:r)'){
        blreg=true;
        csstr=csstr.slice(0,-4).trim();
    }
    if (csstr==''){return;}
    if (isyear){
        for (let item of olis){
            var bltext=item.innerText.trim();
            if (bltext.substring(0,4)==csstr){
                item.style.display='';
            } else {
                item.style.display='none';
            }
        }
    } else {
        obj_search_show_hide_b(olis,'',csstr,blreg);
    }
}

function timeline_close_klphotos(){
    var otd_r=document.getElementById('td_thumb_klphotos');
    otd_r.setAttribute('width','');
    document.getElementById('td_treeview_klphotos').innerHTML='';
}

function timeline_category_klphotos(){
    var list_t=[];
    var years_t={};
    for (let item of photo_source_global){
        if (!Array.isArray(item)){continue;}
        if (item.length<2){continue;}   //元素个数为0，或只有名称 - 保留注释
        var one_photo=item.slice(1,);
        one_photo.sort(randomsort_b);
        list_t.push('<li class="li_treeview_klphotos" style="display:none;"><span class="span_link" onclick="imgsearch_klphotos(\''+specialstr_j(item[0])+'\');">'+item[0]+'('+(item.length-1)+')</span></li>');
        var blyear=item[0].substring(0,4);
        if (blyear in years_t===false){
            years_t[blyear]=0;
        }
        years_t[blyear]=years_t[blyear]+item.length-1;
    }
    
    list_t.sort().reverse();
    
    var years_str=[];
    var max_year='';
    for (let key in years_t){
        years_str.push('<span class="oblong_box" onclick="timeline_oneyear_klphotos(\''+key+'\');"><strong>'+key+'</strong><small>('+years_t[key]+')</small></span>');
        max_year=(key>max_year?key:max_year);
    }
    if (years_str.length<1){return;}
    years_str.sort().reverse();
    
    years_str.push('<span class="oblong_box" onclick="timeline_close_klphotos();" style="color:'+scheme_global['a-hover']+';">✖</span>');
    
    var otd_r=document.getElementById('td_thumb_klphotos');
    otd_r.setAttribute('width','85%');
    var rect=otd_r.getBoundingClientRect();

    var otd_l=document.getElementById('td_treeview_klphotos');
    otd_l.innerHTML='<section id="section_timeline_klphotos" style="max-height:'+(window.screen.availHeight-rect.top)+'px;overflow:auto;"><p style="line-height:2rem;">'+years_str.join(' ')+'</p><p><input type="text" id="input_timeline_search" onkeyup="if (event.key==\'Enter\'){timeline_oneyear_klphotos(this.value,false);}"></p>\n<ol>'+list_t.join('\n')+'</ol></section>';
    mouseover_mouseout_oblong_span_b(otd_l.querySelectorAll('span.oblong_box'));
    input_with_x_b('input_timeline_search',10);
    timeline_oneyear_klphotos(max_year);
}
