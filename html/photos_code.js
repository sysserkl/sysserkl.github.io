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
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            list_t[blxl]=encodeURIComponent(album_current_global[0])+'&s='+encodeURIComponent(list_t[blxl]);
        }
        name_str='== 分隔行 '+date2str_b('')+' ==\nalbum_s_keys\n';
    }

    document.getElementById('textarea_export_klphotos').value=name_str+list_t.join('\n');
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
    var blrange=slice_range_get_b(bllen);
    if (blrange===false){return;}

    if (confirm('是否保留当前结果的 '+blrange+' 部分？')){
        photodata_global=photodata_global.slice(blrange[0],blrange[1]);
        refresh_klphotos();
    }
}

function export_form_klphotos(){
    var bljg='<span class="aclick" onclick="export_array_klphotos();">导出全部数组</span>';
    bljg=bljg+'<span class="aclick" onclick="export_current_klphotos();">导出当前图片文件名</span>';
    return export_form_klphotos_b(bljg);
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

function month_album_klphotos(month_t){
	document.getElementById('input_search').value='\\d{4}'+('00'+month_t).slice(-2)+'\\d{2}';
	document.getElementById('input_reg').checked=true;
	imgsearch_klphotos_b();
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
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
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
	for (let blxl=0,lent=photodata_global.length;blxl<lent;blxl++){
		photodata_global[blxl][1]='';
	}
    
	var bltotal_t=Math.floor((Math.random()*10)+1);
	for (let blxl=0;blxl<bltotal_t;blxl++){
		photodata_global.sort(randomsort_b);
	}
    refresh_klphotos();
}

function refresh_klphotos(){
	hide_div_big_photo_b();
	thumbnail_klphotos_b();

	document.getElementById('span_img_count').innerHTML='<i>('+photodata_global.length+')</i>';
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
	change_klphotos_b("'");
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
                    imgsearch_klphotos_b(bls_reg[0],true);
                } else {
                    imgsearch_klphotos_b(bltmpstr.substring(2));
                }
			} else {
                imgsearch_klphotos_b(bls_reg[0]);
            }
		} else if (bltmpstr.substring(0,4)=='img='){
			var num_tmp=Math.min(photodata_global.length-1,Math.max(0,parseInt(bltmpstr.substring(4))));
			var page_tmp=pageitems_global*(Math.ceil((num_tmp+1)/pageitems_global)-1);
			thumbnail_klphotos_b(page_tmp);
			showbigphoto_klphotos_b(num_tmp);
		} else if (bltmpstr.substring(0,3)=='rnd'){
			rndsearch_klphotos();
		} else if (bltmpstr.substring(0,4)=='auto'){
			showbigphoto_klphotos_b(0);
			autoshow_klphotos();
		}
	}
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

    slide_klphotos_b(false,'change_klphotos_b("\'");clearInterval(imgshow_klphotos_global);autoshow_klphotos();');

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2rem':'1.5rem'));
    calendar_css_klphotos();

    data_set_klphotos();
    album_marked_rows_get_klphotos_b();
    
    if (is_local_b()){
        menu_klphotos();
        import_img_data_klphotos_b();
        args_klphotos();
        recent_search_klphotos_b();
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
        list_t.push('<li class="li_treeview_klphotos" style="display:none;"><span class="span_link" onclick="imgsearch_klphotos_b(\''+specialstr_j(item[0])+'\');">'+item[0]+'('+(item.length-1)+')</span></li>');
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
