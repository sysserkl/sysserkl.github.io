function buttons_gps_points(){
    var bljg='<input type="file" id="input_upload_gpx" multiple style="max-width:20rem;"> ';
    bljg=bljg+'<span class="aclick" onclick="upload_gpx_gps_points();">Upload GPX File</span> ';
    bljg=bljg+'<select id="select_transform" style="max-width:5rem;">\n';
    bljg=bljg+'<option></option>\n';
    bljg=bljg+'<option>WGS84_TO_GCJ02</option>\n';
    bljg=bljg+'<option>GCJ02_TO_WGS84</option>\n';
    bljg=bljg+'</select>\n';
    bljg=bljg+'<span id="span_quick_buttons_gpx"></span>';
    bljg=bljg+'<span class="aclick" onclick="outdoor_gps_points(false);" title="户外一键设置，不定位">高</span> ';    
    bljg=bljg+'<span class="aclick" onclick="outdoor_gps_points();" title="户外一键设置，持续定位">🎀</span> ';    
    bljg=bljg+'<span class="aclick" onclick="close_buttons_gps_points(this);">Close</span> ';
    
    var left_strings='<p>';
    left_strings=left_strings+'<span class="aclick" onclick="add_current_latlng_gps_points();">添加当前点</span> ';
    
    left_strings=left_strings+'内存：<span class="aclick" onclick="save_to_memory_gps_points();">存入</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="recover_from_memory_gps_points();">恢复</span> ';

    left_strings=left_strings+'缓存：<span class="aclick" onclick="save_to_memory_gps_points(true);">存入</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="recover_from_memory_gps_points(true);">恢复</span> ';

    left_strings=left_strings+'<span class="aclick" onclick="current_position_distance_gps_points();">当前点与储存点距离</span> ';
    
    var right_strings='</p>';
    var blstr=textarea_with_form_generate_b('textarea_gps_points','height:20rem;',left_strings,'全选,清空,复制,save as gpx file,发送到临时记事本,发送地址',right_strings,'','form_gps_news'); //从 bigfile 导入文件内容 - 保留注释
    
    bljg=bljg+blstr+'\n';    
    return bljg;
}

function outdoor_gps_points(position_check=true){
    document.getElementById('select_transform').value='WGS84_TO_GCJ02';
    
    var show_circle=klmenu_check_b('span_show_circle',false);
    if (position_check && show_circle===false || !position_check && show_circle===true){
        klmenu_check_b('span_show_circle',true);
    }
    
    var is_continue=klmenu_check_b('span_continue_position',false);
    if (position_check && is_continue===false || !position_check && is_continue===true){
        klmenu_check_b('span_continue_position',true);
    }    
    
    circle_distance_settings_gps_points(false,'');
    gd_switch_gps_points(false,'gd_earth');
}

function save_to_memory_gps_points(is_local_storage=false){
    var blcaption,blcontent;
    [blcaption,blcontent]=memory_or_local_storage_cache_get_gps_points(is_local_storage);
    
    var blstr=document.getElementById('textarea_gps_points').value
    if (confirm('是否将'+blcaption+'中 '+blcontent.length+' 内容替换为当前 '+blstr.length+' 内容？')==false){return;}
    
    if (is_local_storage){
        localStorage.setItem('gps_points_cache',blstr);
    } else {
        textarea_content_gps_points_global=blstr;
    }
}

function memory_or_local_storage_cache_get_gps_points(is_local_storage=false){
    if (is_local_storage){
        var blcaption='缓存';
        var blcontent=local_storage_get_b('gps_points_cache');
    } else {
        var blcaption='内存';
        if (typeof textarea_content_gps_points_global == 'undefined'){
            textarea_content_gps_points_global='';
        }
        var blcontent=textarea_content_gps_points_global;
    }
    return [blcaption,blcontent];
}

function recover_from_memory_gps_points(is_local_storage=false){
    var blcaption,blcontent;
    [blcaption,blcontent]=memory_or_local_storage_cache_get_gps_points(is_local_storage);
    
    var otextarea=document.getElementById('textarea_gps_points');
    if (confirm('是否将编辑框中 '+otextarea.value.length+' 内容替换为'+blcaption+'中 '+blcontent.length+' 的内容？')==false){return;}
    otextarea.value=blcontent;
}


function close_buttons_gps_points(obutton){
    if (confirm('是否关闭按钮区？')==false){return;}
    var odom=document.getElementById('div_gps_points');
    if (odom){
        odom.style.display='none';
    }
}

function add_current_latlng_gps_points(){
    if (clicked_lat_lng_global.length!==2){return;}
    var otextarea=document.getElementById('textarea_gps_points');
    otextarea.value=otextarea.value.trim()+'\n'+clicked_lat_lng_global[0]+','+clicked_lat_lng_global[1];
}

function help_gps_points(){
    var dots=`
圆形：
circle=lon,lat,radius1_radius2,color;lon,lat,radius,color;
方形：
rectangle=lon,lat,longlinexshortline_longlinexshortline,color;lon,lat,longlinexshortline,color;
字符：
character=lon,lat,radius1_radius2,color,某个字符;lon,lat,radius1_radius2,color,某个字符
生成点格式1：
EXIF_DateTimeOriginal:2017:06:30 08:24:03
GPS_GPSLatitude:37.3628
GPS_GPSLongitude:120.442
-----
EXIF_DateTimeOriginal:2017:05:29 15:40:51
GPS_GPSLatitude:37.3593
GPS_GPSLongitude:120.45
-----
生成点格式2：
GPS_GPSLatitude:37.3628
GPS_GPSLongitude:120.442
GPS_GPSLatitude:37.3593
GPS_GPSLongitude:120.45
`.trim();
    document.getElementById('textarea_gps_points').value=dots;
}

function upload_gpx_gps_points(){
    function sub_upload_gpx_gps_points_one(){
        if (blxl>=bllen){
            document.title=old_title;
            return;
        }
        
        var ofile=ogpxfiles[blxl];
        if (ofile.type!=='application/gpx+xml' && ofile.name.substring(ofile.name.toLowerCase().lastIndexOf('.gpx'),).toLowerCase()!=='.gpx'){
            otextarea.value = '非gpx文件：'+ofile.type+'\n'+ofile.name;  
            sub_upload_gpx_gps_points_continue();
            return;
        }
        if (ofile.size>30*1024*1024){
            otextarea.value = '文件太大：'+ofile.name+' '+ofile.size;  
            sub_upload_gpx_gps_points_continue();
            return;
        }
            
        var gpxFile = new FileReader();
        gpxFile.fileName = ofile.name;
        gpxFile.readAsText(ofile);
        gpxFile.onload = function (){
            otextarea.value = this.result;
            read_gpx_gps_points(this.result,this.fileName.substring(0,this.fileName.lastIndexOf('.')),false,part_len);
            sub_upload_gpx_gps_points_continue();
        }
    }
    
    function sub_upload_gpx_gps_points_continue(){
        blxl=blxl+1;
        document.title=blxl+'/'+bllen+' -'+old_title;            
        setTimeout(sub_upload_gpx_gps_points_one,1);    
    }
    
    var otextarea=document.getElementById('textarea_gps_points');
    var ogpxfiles=document.getElementById('input_upload_gpx').files;
    var part_len=parseInt(document.getElementById('input_sub_line_length_gps_points').value.trim()) || -1;

    var bllen=ogpxfiles.length;
    var blxl=0;
    var old_title=document.title;
    sub_upload_gpx_gps_points_one();
}

function draw_multiple_lines_gps_points(){
    function sub_draw_multiple_lines_gps_points_one_line(){
        if (blxl>=bllen){
            document.title=old_caption;
            return;
        }
        
        var result_t=data_lines_2_latlon_gps_points_b(list_t[blxl][0],'latlon');
        draw_gpx_gps_points(result_t,list_t[blxl][1],true,cscolors,true);
        
        blxl=blxl+1;
        if (blxl % 10 == 0){
            document.title=blxl+'/'+bllen+' - '+old_caption;
            setTimeout(sub_draw_multiple_lines_gps_points_one_line,1);
        } else {
            sub_draw_multiple_lines_gps_points_one_line();
        }
    }
    
    var csstr=document.getElementById('textarea_gps_points').value.trim();
    if (csstr==''){return;}
    
    var cscolors=colors_get_gps_points(false);
    
    var list_t=horizontal_delimiter_split_gps_points_b(csstr,true);
    var blxl=0;
    var bllen=list_t.length;
    var old_caption=document.title;
    sub_draw_multiple_lines_gps_points_one_line();
}

function draw_gpx_gps_points(cslist=false,csname='',dotransform=false,cscolors=['','',''],dopanto=true,csfillcolor='',csfillopacity=0){
    //cslist 须是 lat,lon 格式，形如 [ [ 30.221588, 120.024205 ], [ 30.221542, 120.024116 ] ] - 保留注释
    if (cslist===false){
        cslist=data_lines_2_latlon_gps_points_b('','latlon');   //返回为 lat,lon 格式 - 保留注释
    }
    if (dotransform){
        var bltype=document.getElementById('select_transform').value;
        cslist=transform_dotlines_gps_points(cslist,bltype,false);
    }
    //---
    var blfound_list=[];
    for (let blxl=0,lent=cscolors.length;blxl<lent;blxl++){
        if (cscolors[blxl]==-1 || cscolors[blxl]==false){
            blfound_list.push(blxl);
        }
    }
    if (blfound_list.length>0){
        color_list=colors_get_gps_points();
        for (let blno of blfound_list){
            cscolors[blno]=color_list[blno];
        }
    }
    
    draw_gpx_lines_simple_leaflet_b(navigation_layer_gps_global,omap_gps_points_global,cslist,csname,cscolors,'textarea_gps_points',dopanto,[[],[]],-1,'',false,csfillcolor,csfillopacity);
}

function transform_dotlines_gps_points(cslist=false,cstype=false,write_to_textarea=false){
    if (cslist===false){
        cslist=data_lines_2_latlon_gps_points_b('','latlon');   //返回为 lat,lon 格式，每个元素形如：[ 31.27391856542109, 121.22964409945823 ] - 保留注释
    }
    if (cstype===false){
        cstype=document.getElementById('select_transform').value;
    }
    var bllon;
    var bllat;
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
        [bllon,bllat]=transform_lon_lat_one_dot_b(cstype,cslist[blxl][1],cslist[blxl][0]);
        cslist[blxl]=[bllat,bllon];
    }

    if (write_to_textarea){
        var list_t=[];
        for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
            list_t[blxl]=cslist[blxl][0]+','+cslist[blxl][1];
        }
        var otextarea=document.getElementById('textarea_gps_points');    
        otextarea.value=list_t.join('\n');
    }
    return cslist;
}

function trk_filter_gps_points(cskey=''){
    var otextarea=document.getElementById('textarea_gps_points');
    var blstr=otextarea.value;
    if (!blstr.includes('<trk>')){return;}
    
    if (cskey==''){
        cskey=prompt('输入筛选关键字：');
        if (cskey==null){return;}
    }
    cskey=cskey.trim();
    var is_reg;
    [cskey,is_reg]=str_reg_check_b(cskey,false,true);
    
    if (cskey==''){return;}

    var list_t=blstr.split('<trk>');
    var result_t=[];
    for (let item of list_t){
        if (!item.includes('</trk>')){continue;}
        item=item.split('</trk>')[0];
        var blfound=str_reg_search_b(item,cskey,is_reg);
        if (blfound==-1){break;}
        if (blfound==false){continue;}
        result_t.push(item);
    }
    if (result_t.length==0){
        alert('无结果');
        return;
    } else {
        if (confirm('发现'+result_t.length+'条记录，是否更新？')==false){return;}
        otextarea.value=gpx_head_tail_leaflet_b('<trk>'+result_t.join('</trk><trk>')+'</trk>');
    }
}

function read_gpx_gps_points(csstr,csname='',cscolors=false,part_len=false){
    var bltype=document.getElementById('select_transform').value;   
    if (part_len===false){
        part_len=parseInt(document.getElementById('input_sub_line_length_gps_points').value.trim()) || -1;
    }
    
    if (cscolors===false){
        cscolors=colors_get_gps_points(false);
        //cscolors 形似 [ "blue:red:green:brown:cyan:black:purple", "cyan", "red" ] - 保留注释
    }

    var is_no_style=klmenu_check_b('span_line_no_gps',false);   //数字编号

    var all_points=gpx_file_draw_leaflet_b(navigation_layer_gps_global,omap_gps_points_global,csstr,bltype,csname,cscolors,part_len,is_no_style);

    if (klmenu_check_b('span_gpx_2_latlon',false)){
        document.getElementById('textarea_gps_points').value = all_points.join('\n');
    }
}

function dots_2_list_gps_points(cslist=false){
    if (cslist===false){
        cslist=document.getElementById('textarea_gps_points').value.trim().split('\n');
    }
    var result_t=[];
    for (let item of cslist){
        item=item.split('@')[0].trim();
        if (item.includes(',')){
            item=item.split(',');
        } else if (item.includes(' ')){
            item=item.split(' ');        
        } else {continue;}    
        
        item[0]=parseFloat(item[0].trim());
        item[1]=parseFloat(item[1].trim());                
        if (!isNaN(item[0]) && !isNaN(item[1])){
            result_t.push([item[0],item[1]]);
        }
    }
    return result_t;
}

function dots_show_gps_points(is_lat_lon_style=false){
    var blstr=document.getElementById('textarea_gps_points').value.trim();
    if (is_lat_lon_style){
        var list_t=blstr.split('\n');
        var result_t=dots_2_list_gps_points(list_t);
        dots_draw_gps_points(result_t);        
    } else {
        if (blstr.includes('\n-----\n') || blstr.match(/\n---\s\d+\s---\n/)){
            //生成点格式1 - 保留注释
            dots_multi_groups_gps_points(blstr);
        } else {
            //生成点格式2 - 保留注释
            dots_one_group_gps_points(blstr);   
        }
    }
}

function dots_multi_groups_gps_points(csstr){
    var list_t=horizontal_delimiter_split_gps_points_b(csstr);
    var result_t=[];
    var bltype=document.getElementById('select_transform').value;  
    for (let oneblock of list_t){
        rows=oneblock.trim().split('\n');
        var bllat=0;
        var bllon=0;
        var blyear='';

        for (let arow of rows){
            if (arow.indexOf('GPS_GPSLatitude:')==0){
                bllat=parseFloat(arow.split('GPS_GPSLatitude:')[1].trim());
            } else if (arow.indexOf('GPS_GPSLongitude:')==0){
                bllon=parseFloat(arow.split('GPS_GPSLongitude:')[1].trim());
            } else if (arow.indexOf('EXIF_DateTimeOriginal:')==0){
                blyear=parseFloat(arow.split('EXIF_DateTimeOriginal:')[1].split(':')[0].trim());
            }
        }
        
        if (bllat!==0 && bllon!==0){
            [bllon,bllat]=transform_lon_lat_one_dot_b(bltype,bllon,bllat);        
            
            result_t.push([parseInt(blyear) || 9999,bllon,bllat]);  //年份，经度，纬度 - 保留注释
        }
    }
    result_t.sort();
    
    var colors=['red,red','blue,blue','green,green','black,black','orange,orange','brown,brown'];
    var color_len=colors.length;
    var year_colors=[];
    for (let item of result_t){
        if (item[0]==9999){
            var thecolor=colors[color_len-1].split(',');
        } else {
            var thecolor=colors[item[0] % (color_len-1)].split(',');
        }
        
        if (year_colors[item[0]]==undefined){
            year_colors[item[0]]=[item[0],thecolor[0],thecolor[1],0];
        }
        year_colors[item[0]][3]=year_colors[item[0]][3]+1;
        
        navigation_layer_gps_global.addLayer(circle_leaflet_b(omap_gps_points_global,true,item[1],item[2],10,thecolor[0],thecolor[1]));
    }
    if (result_t.length>0){    
        var last_point=result_t.slice(-1)[0];
        omap_gps_points_global.panTo(new L.LatLng(last_point[2],last_point[1]));
    }
    
    for (let key in year_colors){
        console.log(year_colors[key]);
    }
}

function dots_one_group_gps_points(csstr=''){
    if (csstr==''){
        csstr=document.getElementById('textarea_gps_points').value.trim();
    }
    result_t=data_lines_2_latlon_gps_points_b(csstr,'');
    dots_draw_gps_points(result_t);
}

function dots_draw_gps_points(cslist){
    var bltype=document.getElementById('select_transform').value;  
    var bllon, bllat;
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
        [bllon,bllat]=transform_lon_lat_one_dot_b(bltype,cslist[blxl][1],cslist[blxl][0]);
        cslist[blxl]=[bllat,bllon];
    }
    
    for (let item of cslist){
        navigation_layer_gps_global.addLayer(circle_leaflet_b(omap_gps_points_global,true,item[1],item[0]));
    }
    if (cslist.length>0){
        var last_point=cslist.slice(-1)[0];
        omap_gps_points_global.panTo(new L.LatLng(last_point[0],last_point[1]));
    }
}

function dots_2_circles_gps_points(len_list=false){
    if (len_list===false){
        var blstr=prompt('输入半径，如 500,1000：');
        if (blstr==null){return;}       
        var list_t=blstr.trim().split(',');
        
        len_list=[];
        for (let item of list_t){
            item=parseFloat(item.trim());
            if (isNaN(item)){continue;}
            if (item<=0){continue;}
            len_list.push(item);
        }
    }
    if (len_list.length==0){return;}

    var dots=dots_2_list_gps_points();
    var result_t=[];
    
    var color_list=['red','blue','green','black','orange','brown'];
    var blxl=0;
    for (let one_len of len_list){
        var blcolor=color_list[blxl];
        for (let item of dots){
            result_t.push([item[1],item[0],[one_len],blcolor]);
        }
        blxl=blxl+1;
        if (blxl>=color_list.length){
            blxl=0;
        }
    }
    circle_gps_points(result_t,true,'navigation',false);
}

function dot_property_get_gps_points(item,cscolor,dotransform,transform_type){
    if (typeof item =='string'){
        var onecircle=item.split(',');
        if (onecircle.length<3){
            return [false,false,false,false,false];
        }
        var radius_list=onecircle[2].split('_');
    } else {
        var onecircle=item;
        if (onecircle.length<3){
            return [false,false,false,false,false];
        }
        var radius_list=onecircle[2]; 
    }

    if (onecircle.length>=4){
        cscolor=onecircle[3];   //后者继承前者颜色 - 保留注释
    }

    var lon = parseFloat(onecircle[0]);
    var lat  = parseFloat(onecircle[1]);
    if (dotransform){
        [lon,lat]=transform_lon_lat_one_dot_b(transform_type,lon,lat);
    }
    return [onecircle,radius_list,cscolor,lon,lat];
}

function character_gps_points(csstr,dotransform=true,layertype='navigation',dopanto=true,old_title=false,transform_type=false,check_is_in_map=false){
    //格式：lon,lat,radius,color,character;lon,lat,radius,color; - 保留注释
    function sub_character_gps_points_one_row(){
        if (blxl>=bllen){
            document.title=old_title;
            performance_b('character_gps_points()',t0,200);
            return;
        }
        
        var item=list_t[blxl];
        [onecharacter,radius_list,blcolor,head_lon,head_lat]=dot_property_get_gps_points(item,blcolor,dotransform,transform_type);
        if (onecharacter===false){
            blxl=blxl+1;
            sub_character_gps_points_one_row();
            return;
        }

        if (onecharacter.length>4){
            var blcharacter=onecharacter[4];
        } else {
            var blcharacter='U';
        }
        
        for (let one_radius of radius_list){
            if (one_radius.toString().trim()==''){continue;}

            var ocharacter=character_leaflet_b(blcharacter,omap_gps_points_global,true,head_lon,head_lat,one_radius,blcolor);
            if (layertype=='navigation'){
                navigation_layer_gps_global.addLayer(ocharacter);
            } else if (layertype=='current'){
                current_position_layer_gps_global.addLayer(ocharacter);
            }
        }

        if (dopanto){
            if (check_is_in_map){
                dopanto=check_points_is_in_map(head_lat,head_lon,transform_type,dopanto);
            }
            if (dopanto){
                omap_gps_points_global.panTo(new L.LatLng(head_lat,head_lon));
            }
        }

        blxl=blxl+1;
        if ( blxl % 100 == 0){
            document.title=(blxl*100/bllen).toFixed(2)+'% - '+old_title;
            setTimeout(sub_character_gps_points_one_row,1);
        } else {
            sub_character_gps_points_one_row();
        }
    }
    //-----------------------
    var t0 = performance.now();

    if (typeof csstr =='string'){
        var list_t=csstr.split(';');
    } else {
        var list_t=csstr;   //array - 保留注释
    }
    
    var onecharacter,radius_list,head_lon,head_lat;
    var blcolor='red';
    if (transform_type===false){
        transform_type=document.getElementById('select_transform').value;    
    }
    var blxl=0;
    var bllen=list_t.length;
    if (old_title===false){
        old_title=document.title;
    }
    sub_character_gps_points_one_row();
}

function circle_gps_points(csstr,dotransform=true,layertype='navigation',dopanto=true,old_title=false,transform_type=false,fill_opacity=-1,is_stroke=-1,check_is_in_map=false){
    //格式：lon,lat,radius,color;lon,lat,radius,color; - 保留注释
    function sub_circle_gps_points_one_row(){
        if (blxl>=bllen){
            document.title=old_title;
            performance_b('circle_gps_points()',t0);
            return;
        }
        
        var item=list_t[blxl];
        [onecircle,radius_list,blcolor,head_lon,head_lat]=dot_property_get_gps_points(item,blcolor,dotransform,transform_type);
        if (onecircle===false){
            blxl=blxl+1;
            sub_circle_gps_points_one_row();
            return;
        }

        for (let one_radius of radius_list){
            if (one_radius.toString().trim()==''){continue;}

            var ocircle=circle_leaflet_b(omap_gps_points_global,true,head_lon,head_lat,one_radius,blcolor,blcolor,fill_opacity,is_stroke);
            if (layertype=='navigation'){
                navigation_layer_gps_global.addLayer(ocircle);
            } else if (layertype=='current'){
                current_position_layer_gps_global.addLayer(ocircle);
            }
        }

        if (dopanto){
            if (check_is_in_map){
                dopanto=check_points_is_in_map(head_lat,head_lon,transform_type,dopanto);
            }
            if (dopanto){
                omap_gps_points_global.panTo(new L.LatLng(head_lat,head_lon));
            }
        }

        blxl=blxl+1;
        if ( blxl % 100 == 0){
            document.title=(blxl*100/bllen).toFixed(2)+'% - '+old_title;
            setTimeout(sub_circle_gps_points_one_row,1);
        } else {
            sub_circle_gps_points_one_row();
        }
    }
    //-----------------------
    var t0 = performance.now();

    if (typeof csstr =='string'){
        var list_t=csstr.split(';');
    } else {
        var list_t=csstr;   //array - 保留注释
    }
    
    var onecircle,radius_list,head_lon,head_lat;
    var blcolor='red';
    if (transform_type===false){
        transform_type=document.getElementById('select_transform').value;    
    }
    var blxl=0;
    var bllen=list_t.length;
    if (old_title===false){
        old_title=document.title;
    }
    if (fill_opacity===-1){
        fill_opacity=parseFloat(document.getElementById('input_fill_opacity_gps_points').value.trim());
    }
    if (is_stroke===-1){
        is_stroke=document.getElementById('checkbox_stroke_line_border_gps_points').checked;
    }
    sub_circle_gps_points_one_row();
}

function check_points_is_in_map(head_lat,head_lon,transform_type,dopanto){
    if (dopanto){
        var range_t=map_range_leaflet_b(omap_gps_points_global,true,transform_type);
        if (head_lat>=range_t[0][0] && head_lat<=range_t[0][1]){
            if (head_lon>=range_t[1][0] && head_lon<=range_t[1][1]){
                dopanto=false;
            }
        }
    }
    return dopanto;
}

function rectangle_gps_points(csstr,dotransform=true,layertype='navigation',dopanto=true,old_title=false){
    //格式：lon,lat,longlinexshortline,color;lon,lat,longlinexshortline,color; - 保留注释

    function sub_rectangle_gps_points_one_row(){
        if (blxl>=bllen){
            document.title=old_title;
            console.log('rectangle_gps_points() 费时：'+(performance.now() - t0) + ' milliseconds');    
            return;
        }
        
        var item=list_t[blxl];
        [onerect,radius_list,blcolor,head_lon,head_lat]=dot_property_get_gps_points(item,blcolor,dotransform,bltype);
        if (onerect===false){
            blxl=blxl+1;
            sub_rectangle_gps_points_one_row();
            return;
        }
        
        for (let one_radius of radius_list){
            if (one_radius.trim()==''){continue;}
            if (!one_radius.includes('x')){
                one_radius=one_radius+'x'+one_radius;
            }
            var long_short_list=one_radius.split('x');
            var longline=parseFloat(long_short_list[0]);
            var shortline=parseFloat(long_short_list[1]);

            var orectangle=rectangle_by_lines_leaflet_b(omap_gps_points_global,true,head_lon,head_lat,longline,shortline,blcolor);
            if (layertype=='navigation'){
                navigation_layer_gps_global.addLayer(orectangle);
            } else if (layertype=='current'){
                current_position_layer_gps_global.addLayer(orectangle);
            }
        }

        if (dopanto){
            omap_gps_points_global.panTo(new L.LatLng(head_lat,head_lon));
        }
        
        blxl=blxl+1;
        if ( blxl % 100 == 0){
            document.title=(blxl*100/bllen).toFixed(2)+'% - '+old_title;
            setTimeout(sub_rectangle_gps_points_one_row,1);
        } else {
            sub_rectangle_gps_points_one_row();
        }
    }
    
    var t0 = performance.now();

    if (typeof csstr =='string'){
        var list_t=csstr.split(';');
    } else {
        var list_t=csstr;   //array - 保留注释
    }
    
    var blxl=0;
    var onerect,radius_list,head_lon,head_lat;
    var blcolor='red';
    var bltype=document.getElementById('select_transform').value;  
    var bllen=list_t.length;
    if (old_title===false){
        old_title=document.title;
    }
    sub_rectangle_gps_points_one_row();
}

function current_layer_refresh_gps_points(){
    current_position_layer_gps_global.removeFrom(omap_gps_points_global);
    current_position_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    current_position_layer_gps_global.addTo(omap_gps_points_global);
}

function current_position_distance_gps_points(){
    if (clicked_lat_lng_global.length!==2){return;}
    var list_t=document.getElementById('textarea_gps_points').value.trim().split('\n');
    var result_t=[];
    var blno=0;
    for (let item of list_t){
        var lat_lng=item.trim().split(',').slice(0,2);
        if (lat_lng.length<2){continue;}
        lat2=parseFloat(lat_lng[0]);
        lng2=parseFloat(lat_lng[1]);
        if (isNaN(lat2) || isNaN(lng2)){continue;}
        var blvalue=distance_leaflet_b(clicked_lat_lng_global[0], clicked_lat_lng_global[1], lat2, lng2);
        blno=blno+1;
        result_t.push(blno+'. '+blvalue.toFixed(1));
    }
    alert(result_t.join('\n'));
}

function current_position_show_gps_points(){
    if (!navigator.geolocation){
        document.getElementById('div_status').innerHTML='A Geolocation request can only be fulfilled in a secure context';
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        function (position){
            navigator_geolocation_getCurrentPosition_ok_b(position,omap_gps_points_global);
            omap_gps_points_global.panTo(new L.LatLng(lat,lon));

            current_layer_refresh_gps_points();
            current_position_layer_gps_global.addLayer(L.marker([lat,lon]));
            circle_distance_show_gps_points(lon,lat);
            if (klmenu_check_b('span_continue_position',false)){
                setTimeout(current_position_show_gps_points,5000);
            }
        },
        navigator_geolocation_getCurrentPosition_error_b,
    );
}

function init_page_gps_points(is_simple=false,map_type='',map_id='osm'){    
    gpx_pb_global.sort(function (a,b){return zh_sort_b(a,b,false,0)});
    gpx_kl_global.sort(function (a,b){return zh_sort_b(a,b,false,0)});

    var window_h=document_body_offsetHeight_b();
    map_resize_gps_points(window_h,is_simple,false,true);
    
    var lat_lon_value=[31.2,121.5];
    var zoom_value=12;
    var ostatus=document.getElementById('div_status');
    ostatus.style.backgroundColor=scheme_global['skyblue'];
    //-----------------------
    if (is_simple==false){
        document.getElementById('div_icon').innerHTML='🧿';
        ostatus.innerHTML='GPS Points';
        document.getElementById('div_buttons').innerHTML=buttons_gps_points();
        menu_gps_points();
    }
    
    init_maps_leaflet_b();
    
    omap_gps_points_global = L.map('div_map', {
        center: lat_lon_value,
        zoom: zoom_value,
        layers: [klmaps_global[map_id]],//[L.layerGroup([klmaps_global[map_id]])],    //此行保留 - 保留注释
    });
    
    //omap_gps_points_global.addLayer(klmaps_global[map_id]);   //此行保留 - 保留注释
    
    //以下3行保留 - 保留注释
    //omap_gps_points_global.on('layeradd', function(event){
        //console.log('Layer added:', event.layer);
    //});

    L.control.layers(baselayers_leaflet_b(map_type), null).addTo(omap_gps_points_global);

    navigation_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    navigation_layer_gps_global.addTo(omap_gps_points_global);

    current_position_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    current_position_layer_gps_global.addTo(omap_gps_points_global);

    //-----------------------
    var cskeys=href_split_b(location.href);
    var bltype='';
    if (is_simple==false && cskeys.length>0){
        //第1遍处理 - 保留注释
        for (let item of cskeys){
            if (item.substring(0,5)=='type='){
                bltype=item.substring(5,);  //WGS84_TO_GCJ02、GCJ02_TO_WGS84 - 保留注释
            }
        }
        document.getElementById('select_transform').value=bltype;

        //第2遍处理 - 保留注释
        for (let item of cskeys){
            if (item.substring(0,7)=='circle='){
                circle_gps_points(item.substring(7,));
            } else if (item.substring(0,10)=='rectangle='){
                rectangle_gps_points(item.substring(10,));
            }
        }
    }

    omap_gps_points_global.addEventListener('click', function(ev){
        //以下几行保留 - 保留注释
        //var oselect=document.getElementById('select_transform');
        //if (oselect){
            //var bltype=oselect.value;    
        //} else if (typeof gps_tranform_type_global == 'string'){
            //var bltype=gps_tranform_type_global;
        //} else {return;}
        
        var bllon, bllat;
        bllon=ev.latlng.lng;    //不能写成[bllon,bllat] - 保留注释
        bllat=ev.latlng.lat;
        
        //当地图发生变化时，坐标不能发生变化，而是坐标对应的地点发生变化
        
        //[bllon,bllat]=transform_lon_lat_one_dot_b(bltype,ev.latlng.lng,ev.latlng.lat);    //此行保留 - 保留注释
        if (lat_lon_status_b(bllat,bllon,'div_status',omap_gps_points_global)){
            current_layer_refresh_gps_points();
            circle_distance_show_gps_points(ev.latlng.lng,ev.latlng.lat);
        }
       //以下2行保留注释
       //var latlon=omap_gps_points_global.getCenter();
       //document.getElementById('div_status').innerHTML=latlon["lng"]+','+latlon["lat"];
    });
}

function circle_distance_settings_gps_points(show_prompt=true,newstr=false){
    var default_value='100,yellow;200,cyan;300,deeppink;1000,yellow;2000,cyan;3000,deeppink';
    if (newstr===false){
        var blstr=local_storage_get_b('circle_distance_gps_points');
    } else {
        var blstr=newstr;
    }
    
    if (blstr==''){
        blstr=default_value;
    }
    
    if (show_prompt){
        var newstr=(prompt('输入距离圈设置，格式：xxx米,颜色1;yyy米,颜色2; 如：100,red;200,blue\n输入 默认 则返回默认值：',blstr) || '').trim();
        if (newstr==''){
            return blstr;
        }
        if (newstr=='默认'){
            newstr=default_value;
        }
        blstr=newstr;
    }
    
    localStorage.setItem('circle_distance_gps_points',blstr);
    return blstr;
}

function circle_distance_show_gps_points(cslon,cslat){
    if (klmenu_check_b('span_show_circle',false)===false){return;}
    var list_t=circle_distance_settings_gps_points(false).split(';')
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]=cslon+','+cslat+','+list_t[blxl];
    }
    if (klmenu_check_b('span_is_rectangle',false)){
        rectangle_gps_points(list_t.join(';'),false,'current',false);
    } else {
        circle_gps_points(list_t.join(';'),false,'current',false);
    }
}

function gpx_filename_2_pullname_gps_points(fname,cstype){
    if (cstype=='kl'){
        return fullname='../../../../data/gpx_kl/'+fname;
    } else {
        return fullname='../jsdata/gpx_pb/'+fname;
    }
}

function read_txt_file_gps_points(fname,cstype,cscolors=false,save_to_local=true){ 
    var fullname=gpx_filename_2_pullname_gps_points(fname,cstype);
    console.log(fullname);  //此行保留 - 保留注释
    var allText=read_txt_file_b(fullname);
    document.getElementById('textarea_gps_points').value = allText;
    read_gpx_gps_points(allText,fname,cscolors);
    show_hide_map_gps_points();
    if (save_to_local){
        recent_gpx_file_set_gps_points(fname,cstype);
    }
}

function show_hide_map_gps_points(hidemap=false){
    if (hidemap){
        document.getElementById('div_map').style.display='none';
        document.getElementById('div_gps_points').style.display='none';    
        document.getElementById('div_selection').style.display=''
    } else {
        document.getElementById('div_map').style.display='';
        document.getElementById('div_gps_points').style.display='';    
        document.getElementById('div_selection').style.display='none';    
    }
}

function gpx_file_selection_gps_points(cskeys=''){
    function sub_gpx_file_selection_gps_points_array(cskeys,csreg,csarray,cstype){
        var list_t=[];
        for (let item of csarray){
            if (cskeys!==''){
                var blfound=str_reg_search_b(item,cskeys,csreg);
                if (blfound==-1){break;}
                if (blfound==false){continue;}       
            } 
            list_t.push('<span class="span_link" onclick="read_txt_file_gps_points(\''+item[0]+'\',\''+cstype+'\');">'+item[0]+'</span>');
            if (show_line_info){
                if (item[4]!==''){
                    if (len_list[item[4]]==undefined){
                        len_list[item[4]]=0;
                    }
                    len_list[item[4]]=len_list[item[4]]+item[6];
                
                    if (item[5]!==''){
                        if (len_list[item[4]+'_'+item[5]]==undefined){
                            len_list[item[4]+'_'+item[5]]=0;
                        }
                        len_list[item[4]+'_'+item[5]]=len_list[item[4]+'_'+item[5]]+item[6];
                    }
                } else {
                    unknow_len=unknow_len+item[6];
                }
                len_total=len_total+item[6];
            }
        }
        return list_t;
    }
    //-----------------------
    var csreg=false;
    var raw_key=cskeys.trim();
    if (cskeys.slice(-4,)=='(:r)'){
        csreg=true;
        cskeys=cskeys.slice(0,-4);
    }
    cskeys=cskeys.trim();
    var list_t=[];
    
    var len_list={};
    
    var unknow_len=0;
    var len_total=0;
    var ocheckbox_show_line_info=document.getElementById('checkbox_show_line_info');
    if (ocheckbox_show_line_info){
        var show_line_info=ocheckbox_show_line_info.checked;
    } else {
        var show_line_info=false;
    }
    
    if (show_line_info){
        var province_set=district_cn_level_b(0);    //省份 - 保留注释
        for (let item of province_set){
            len_list[item]=0;
        }
    }
    
    list_t=list_t.concat(sub_gpx_file_selection_gps_points_array(cskeys,csreg,gpx_pb_global,'pb'));
    list_t=list_t.concat(sub_gpx_file_selection_gps_points_array(cskeys,csreg,gpx_kl_global,'kl'));

    gpx_file_array_2_html_gps_points(raw_key,list_t);
    
    //---
    len_list=object2array_b(len_list,true);
    len_list.sort(function (a,b){return zh_sort_b(a,b,false,0);});
    var province_list=[];
    for (let blxl=0,lent=len_list.length;blxl<lent;blxl++){
        if (!len_list[blxl][0].includes('_')){
            province_list.push([len_list[blxl][0],len_list[blxl][1]]);
        }
        len_list[blxl]=len_list[blxl][0]+'：'+(len_list[blxl][1]/1000).toFixed(3)+'公里';
    }
    if (unknow_len>0){
        len_list.push('unknow：'+(unknow_len/1000).toFixed(3)+'公里');
    }
    
    province_list.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    
    var oinfo=document.getElementById('section_gpx_line_info');
    if (len_list.length==0){
        oinfo.innerHTML='';
    } else {
        var bljg='<div style="column-count:'+(ismobile_b()?'2':'4')+';">\n'+array_2_li_b(len_list)+'<p><b>Total：</b>'+(len_total/1000).toFixed(3)+'公里</p>\n</div>\n';
        for (let blxl=0,lent=province_list.length;blxl<lent;blxl++){
            province_list[blxl]=(blxl+1)+'.'+province_list[blxl][0]+'：'+(province_list[blxl][1]/1000).toFixed(3)+'公里';
        }
        bljg=bljg+'<hr />\n<p><b>省份排序：</b>'+province_list.join(' ')+'</p>\n';
        if (cskeys==''){
            bljg=bljg+'<p><span class="aclick" onclick="gpx_file_statistics_gps_points();">统计图</span></p>\n';
            bljg=bljg+'<table width=100%><tr><td valign=top width=1 id="td_statistics_gpx_file"></td><td valign=top width=99%><div style="width:100%;height:500px;display:none;" id="div_flot_statistics_gpx_file"></div></td></tr></table>\n';
        }
        oinfo.innerHTML=bljg;
    }
    
    if (cskeys=='' && len_total!==0){
        local_storage_today_b('gpx_file_statistics',40,len_total+'/'+(gpx_pb_global.length+gpx_kl_global.length),'/',[15,0,0.5]);
    }
}

function gpx_file_statistics_gps_points(){
    var otd=document.getElementById('td_statistics_gpx_file');
    if (!otd){return;}
    var odiv=document.getElementById('div_flot_statistics_gpx_file');
    if (!odiv){return;}
    
    var list_t=local_storage_get_b('gpx_file_statistics',-1,true);
    
    var bljg='';
    var flot_list1=[];
    var flot_list2=[];
    for (let item of list_t){
        var day_count=item.split('/');
        if (day_count.length!==3){continue;}
        var blweek='('+day_2_week_b(day_count[0],'cnbrief')+')';
        if (blweek=='(日)'){
            blweek='<span style="color:'+scheme_global["a-hover"]+';">'+blweek+'</span>';
        }
        bljg=bljg+'<tr><td style="padding:0.2rem;" nowrap>'+day_count[0]+' '+blweek+'</td><td align=right style="padding:0.2rem;" nowrap>'+day_count[1]+'</td><td align=right style="padding:0.2rem;" nowrap>'+day_count[2]+'</td></tr>';
        flot_list1.push([new Date(day_count[0]),parseInt(day_count[1])]);
        flot_list2.push([new Date(day_count[0]),parseInt(day_count[2])]);
    }
    if (bljg!==''){
        bljg='<table border=1 cellspacing=0 cellpadding=0 style="margin:1rem 0rem;"><tr><th  style="padding:0.2rem;" nowrap>日期</th><th  style="padding:0.2rem;" nowrap>总长度</th><th  style="padding:0.2rem;" nowrap>条数</th></tr>'+bljg+'</table>';
    }
    flot_list1.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    flot_list2.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    flot_list1=['总长度'].concat(flot_list1);
    flot_list2=['条数'].concat(flot_list2);
    
    otd.innerHTML=bljg;
    odiv.style.display='';
    flot_two_lines_two_yaxis_b([flot_list1,flot_list2],'div_flot_statistics_gpx_file','米','条','nw',true,'d',0,0);
}

function gpx_files_batch_open_init_gps_points(){
    function sub_gpx_files_batch_open_init_gps_points_one_gpx(fname='',cstype='',cscolors=false){
        if (gpx_files_batch_no>=bllen){
            recent_gpx_file_set_gps_points(fname,cstype);
            document.title=caption_old;
            return;
        }

        fname=olis[gpx_files_batch_no].innerText;
        if (cscolors==false){
            cscolors=colors_get_gps_points(false);  //不能放在sub函数外 - 保留注释
        }
        
        var raw_color=[].concat(cscolors);  //cscolors数组传递过程中，元素值发生变化 - 保留注释

        var cstype=gpx_filename2type_gps_points(fname)[1];
        if (cstype!==''){
            read_txt_file_gps_points(fname,cstype,cscolors,false);
        }

        gpx_files_batch_no=gpx_files_batch_no+1;
        if (gpx_files_batch_no % 5 == 0){
            document.title=gpx_files_batch_no+'/'+bllen+' - '+caption_old;
        }
        setTimeout(function (){sub_gpx_files_batch_open_init_gps_points_one_gpx(fname,cstype,raw_color);},10);
    }
    //-----------------------
    var ool=document.getElementById('ol_gpx_file_list');
    var olis=ool.querySelectorAll('li');    
    var bllen=olis.length;
    if (bllen==0){return;}
    
    if (confirm('是否批量载入GPX文件？')==false){return;}
    var caption_old=document.title;
    var gpx_files_batch_no=0;
    
    sub_gpx_files_batch_open_init_gps_points_one_gpx();
}

function gpx_filename2type_gps_points(fname){
    var blfound=false;
    var cstype='';
    var blvalue=[];
    for (let item of gpx_pb_global){
        if (item[0]==fname){
            blvalue=item;
            cstype='pb';
            blfound=true;
            break;
        }
    }
    if (blfound===false){
        for (let item of gpx_kl_global){
            if (item[0]==fname){
                blvalue=item;
                cstype='kl';
                blfound=true;
                break;
            }
        }
    }
    return [blvalue,cstype];
}

function recent_gpx_file_set_gps_points(csstr,cstype){
    if (csstr==''){return;}
    localStorage.setItem('recent_gpx_file',csstr+' /// '+cstype);

    var ospan=document.getElementById('span_recent_gpx_file');
    if (ospan){
        ospan.innerText=(csstr.length>12?csstr.substring(0,12)+'...':csstr);
    }
}

function recent_gpx_file_get_gps_points(openfile=false){
    var list_t=local_storage_get_b('recent_gpx_file').split(' /// ');
    if (list_t.length!==2){
        return ['',''];
    }
    if (openfile){
        if (list_t[1]=='bigfile'){
            import_bigfile_gps_points(list_t[0]);
        } else {
            read_txt_file_gps_points(list_t[0],list_t[1]);
        }
    }
    return list_t;
}

function gpx_list_filter_gps_points(cstype){
    var ool=document.getElementById('ol_gpx_file_list');
    var olis=ool.querySelectorAll('li');
    var result_t=[];
    for (let one_li of olis){
        result_t.push(one_li.outerHTML);
    }
    switch (cstype){
        case 'reverse':
            result_t.reverse();
            break;
        case 'slice':
            var bllen=parseInt((prompt('输入截取数量：') || '').trim());
            if (isNaN(bllen)){return;}
            if (bllen<=0 || bllen>=result_t.length){return;}
            result_t=result_t.slice(0,bllen);
            break;
    }
    ool.innerHTML=result_t.join('\n');
}

function gpx_quadrangle_gps_points(is_simple=false){
    function sub_gpx_quadrangle_gps_points_one_line(){
        if (blxl>=bllen){
            show_hide_map_gps_points();
            omap_gps_points_global.panTo(new L.LatLng(lat,lon));
            document.title=old_title;
            console.log('gpx_quadrangle_gps_points() 费时：'+(performance.now() - t0) + ' milliseconds');           
        } else {
            var item=list_t[blxl];
            if (li_names.has(item[0])){
                [lat,lon]=sub_gpx_quadrangle_gps_points_draw(item[0],item[3],do_transform,line_color_list[gpx_line_color_no_global % line_color_list.length]);
                gpx_line_color_no_global=gpx_line_color_no_global+1;
            }    
            blxl=blxl+1;
            if (blxl % 50 == 0){
                document.title=blxl+'/'+bllen+' - '+old_title;
            }
            setTimeout(sub_gpx_quadrangle_gps_points_one_line,10);
        }
    }
    
    function sub_gpx_quadrangle_gps_points_draw(fname,gpx_point,do_transform,line_color){
        var result_t=[];

        var min_lat=gpx_point[0][0];
        var min_lon=gpx_point[0][1];        
        var max_lat=gpx_point[0][2];
        var max_lon=gpx_point[0][3];
                        
        if (is_simple){
            for (let one_range of gpx_point){
                min_lat=Math.min(min_lat,one_range[0]);
                min_lon=Math.min(min_lon,one_range[1]);
                max_lat=Math.max(max_lat,one_range[2]);
                max_lon=Math.max(max_lon,one_range[3]);
            }
            result_t=[];
            result_t.push([min_lat,min_lon]);
            result_t.push([min_lat, max_lon]);
            result_t.push([max_lat, max_lon]);
            result_t.push([max_lat, min_lon]);
            result_t.push([min_lat,min_lon]);            
            draw_gpx_gps_points(result_t,file_path_name_b(fname)[1],do_transform,[line_color,'',''],true);    
        } else {
            for (let one_range of gpx_point){
                result_t=[];
                min_lat=one_range[0];
                min_lon=one_range[1];
                max_lat=one_range[2];
                max_lon=one_range[3];
                result_t.push([min_lat,min_lon]);
                result_t.push([min_lat, max_lon]);
                result_t.push([max_lat, max_lon]);
                result_t.push([max_lat, min_lon]);
                result_t.push([min_lat,min_lon]);
                draw_gpx_gps_points(result_t,file_path_name_b(fname)[1],do_transform,[line_color,'',''],true);    
            }
        }
        return [min_lat,min_lon];
    }
    //-----------------------
    var t0 = performance.now();
    var li_names=new Set();
    var olis=document.querySelectorAll('ol#ol_gpx_file_list li');
    for (let item of olis){
        li_names.add(item.innerText);
    }
    var do_transform=(document.getElementById('select_transform').value!=='');
    
    var lat, lon;
    var line_color_list=colors_get_gps_points(false)[0].split(':');
    var old_title=document.title;
    var list_t=gpx_pb_global.concat(gpx_kl_global);
    var bllen=list_t.length;
    var blxl=0;
    sub_gpx_quadrangle_gps_points_one_line(); 
}

function gpx_file_download_gps_points(){
    var ool=document.getElementById('ol_gpx_file_list');
    var olis=ool.querySelectorAll('li');
    if (olis.length==0){return;}
    fname=olis[0].innerText;

    var cstype=gpx_filename2type_gps_points(fname)[1];
    if (cstype!==''){
        var fullname=gpx_filename_2_pullname_gps_points(fname,cstype);
        window.open(fullname);
    }
}

function gpx_list_gps_points(cstype=''){
    if (cstype==''){
        cstype=document.getElementById('select_gpx_list_gps_points').value;
    }
    var input_value=document.getElementById('input_gpx_search').value;
    switch (cstype){
        case '离当前点最近的gpx文件':
            gpx_near_gps_points();
            break;
        case '下载':
            gpx_file_download_gps_points();
            break;
        case 'gpx文件范围示意':
            gpx_quadrangle_gps_points();
            break;
        case 'gpx文件范围示意(简单)':
            gpx_quadrangle_gps_points(true);
            break;            
        case 'gpx文件批量载入':
            gpx_files_batch_open_init_gps_points();
            break;
        case '倒转':
            gpx_list_filter_gps_points('reverse');
            break;
        case '截取':
            gpx_list_filter_gps_points('slice');
            break;
        case 'Bing 搜索':
            window.open('https://www.bing.com/search?q='+encodeURIComponent(input_value+' 景点'));
            break;
        case 'Baidu 搜索':
            window.open('https://www.baidu.com/s?wd='+encodeURIComponent(input_value+' 景点'));
            break;
        case '定位':
            var list_t=district_search_gps_points('+'+input_value.replace(/_/g,' +'));
            if (list_t.length>0){
                location_gpx_gps_points(list_t[0]);
                show_hide_map_gps_points();
            }
            break;
        case 'gpx线路数最少的50个区域或全部零区域定位':
            var result_t=[];
            for (let key in gpx_files_district_global){ //假设 gpx_files_district_global 已生成数据 - 保留注释
                result_t.push([key,gpx_files_district_global[key].length]);
            }
            result_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
            for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
                if (blxl>=50 && result_t[blxl][1]>0){
                    result_t=result_t.slice(0,blxl);
                    break;
                }
            }

            var gps_list=[];
            for (let item of result_t){ //不能先合并地址再统一搜索，必须逐个搜索，以免数量多的地名放在前面 - 保留注释
                item=item[0].replace(/_/g,'.*');            
                gps_list=gps_list.concat(district_search_gps_points('+,1, +'+item+'(:r)'));
            }
            if (gps_list.length>0){
                if (confirm('是否随机排序？')){
                    gps_list.sort(randomsort_b);
                }
                
                document.getElementById('textarea_gps_points').value=gps_list.join('\n');
                location_gpx_gps_points(gps_list[0]);
                show_hide_map_gps_points();
            }
            break;
    }
}

function gpx_district_set_gps_points(cskey='',oselect=false){
    if (cskey==''){return;}
    
    if (['全部','零区域','非零区域'].includes(cskey)){
        if (!oselect){return;}
        
        var show_zero='none';
        var show_non_zero='none';
        switch (cskey){
            case '全部':
                show_zero='';
                show_non_zero='';                
                break;
            case '零区域':
                show_non_zero='';
                break;
            case '非零区域':
                show_zero='';
                break;
        }
        
        var options=oselect.querySelectorAll('option');
        for (let one_option of options){
            if (one_option.innerText.slice(-1,)!==')'){continue;}
            
            if (one_option.innerText.slice(-3,)=='(0)'){
                one_option.style.display=show_non_zero;
            } else {
                one_option.style.display=show_zero;
            }
        }
    } else if (cskey == '名称排序'){
        if (!oselect){return;}    
        oselect.innerHTML=gpx_district_option_gps_points(cskey);
    } else if (cskey == '数量排序'){
        var list_top=[];
        var list_num=[];
        var options=oselect.querySelectorAll('option');
        for (let one_option of options){
            if (one_option.innerText.match(/^\d+\.\s?.*\(\d+\)$/)==null){
                list_top.push(one_option.outerHTML);
            } else {
                list_num.push([one_option.innerText.replace(/^\d+\.\s?(.*)\(\d+\)$/g,'$1'),parseInt(one_option.innerText.replace(/^\d+\.\s?.*\((\d+)\)$/g,'$1'))]);
            }
        }

        list_num.sort(function (a,b){return zh_sort_b(a,b,false,0);});
        list_num.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
        var blxl=1;
        var bljg=[];        
        for (let item of list_num){
            list_top.push('<option value="'+item[0]+'">'+blxl+'.'+item[0]+'('+item[1]+')'+'</option>');
            blxl=blxl+1;
            if (item[1]>0){
                bljg.push(item[0]+' '+item[1]);
            }
        }
        oselect.innerHTML=list_top.join('\n');
        console.log(bljg.join('\n')); //此行保留 - 保留注释
    } else if (cskey in gpx_files_district_global){
        var list_t=[];
        for (let item of gpx_files_district_global[cskey]){
            list_t.push('<span class="span_link" onclick="read_txt_file_gps_points(\''+item[0]+'\',\''+item[1]+'\');">'+item[0]+'</span>');
        }
        gpx_file_array_2_html_gps_points(cskey,list_t,cskey);
    }
}

function recent_search_gps_points(cskeys){
    recent_search_b('recent_search_gpx_gps_points',cskeys,'gpx_file_selection_gps_points','div_recent_gpx_sreach',['西湖'],20);    
}

function gpx_file_array_2_html_gps_points(cskeys,cslist,csdistrict=''){
    var ool=document.getElementById('ol_gpx_file_list');
    if (ool){
        if (cslist.length>0){
            ool.innerHTML=array_2_li_b(cslist,'li',false);    
        } else {
            ool.innerHTML='';
        }
        recent_search_gps_points(cskeys);
        show_hide_map_gps_points(true);
        document.getElementById('input_gpx_search').value=cskeys;
        console.log('refresh li');
        return;
    }

    var buttons='<p><input type="text" id="input_gpx_search" value="'+cskeys+'" onkeyup="if (event.key==\'Enter\'){gpx_file_selection_gps_points(this.value);}"> ';
    buttons=buttons+'<span class="aclick" onclick="show_hide_map_gps_points();">返回</span> ';
    buttons=buttons+'当前条件下：<select id="select_gpx_list_gps_points">';
    buttons=buttons+'<option>离当前点最近的gpx文件</option>\n';
    buttons=buttons+'<option>gpx文件范围示意(简单)</option>\n';    
    buttons=buttons+'<option>gpx文件范围示意</option>\n';
    buttons=buttons+'<option>gpx文件批量载入</span>\n';
    buttons=buttons+'<option>倒转</option>\n';
    buttons=buttons+'<option>截取</option>\n';
    buttons=buttons+'<option>定位</option>\n';    
    buttons=buttons+'<option>下载</option>\n';        
    buttons=buttons+'<option>gpx线路数最少的50个区域或全部零区域定位</option>\n';        
    buttons=buttons+'<option>Bing 搜索</option>\n';
    buttons=buttons+'<option>Baidu 搜索</option>\n';
    buttons=buttons+'</select>\n'; 
    buttons=buttons+'<span class="aclick" onclick="gpx_list_gps_points();">执行</span> ';
    buttons=buttons+'<select id="select_district_gps_points" onchange="gpx_district_set_gps_points(this.value,this);">\n';
    buttons=buttons+gpx_district_option_gps_points(csdistrict);    
    buttons=buttons+'</select>\n'; 
    buttons=buttons+'<label><input type="checkbox" id="checkbox_show_line_info" />统计线路长度</label>\n';
    buttons=buttons+'<a class="aclick" href="#section_gpx_line_info">bottom</a> ';
    buttons=buttons+'<span id="span_gpx_files_info"></span></p>';
    buttons=buttons+'<div id="div_recent_gpx_sreach"></div>';
    
    var odiv=document.getElementById('div_selection');
    odiv.innerHTML=buttons+'<div'+(ismobile_b()?'':' style="column-count:2;"')+'>'+array_2_li_b(cslist,'li','ol','ol_gpx_file_list','li_gpx_file')+'<p><a class="aclick" href="#input_gpx_search">top</a></p></div><section id="section_gpx_line_info" style="max-height:20rem; overflow:auto;margin-top:0.2rem;padding-top:0.2rem;border-top:0.1rem dotted '+scheme_global['memo']+';"></section>';
    input_with_x_b('input_gpx_search',15);

    recent_search_gps_points(cskeys);    
    show_hide_map_gps_points(true);
}

function gpx_district_option_gps_points(csdistrict=''){
    if (gpx_files_district_global.length==0){
        gpx_files_district_global=gpx_district_generate_gps_points();
    }
    
    var options='<option></option>\n<option>全部</option>\n<option>零区域</option>\n<option>非零区域</option>\n<option>名称排序</option>\n<option>数量排序</option>\n';
    var blxl=1;
    var result_t=[];
    for (let key in gpx_files_district_global){
        result_t.push('<option value="'+key+'"'+(key==csdistrict?' selected':'')+'>'+blxl+'.'+key+'('+gpx_files_district_global[key].length+')'+'</option>');
        blxl=blxl+1;
    }
    result_t.sort(function (a,b){return zh_sort_b(a,b,false,0);});            
    
    return options+result_t.join('\n');
}

function gpx_near_gps_points(info_id='span_gpx_files_info',show_list=true){
    function sub_gpx_near_gps_points_min_distance(current_point,gpx_point){
        var distance_list=[];
        for (let one_range of gpx_point){
            var min_lat=one_range[0];
            var min_lon=one_range[1];
            var max_lat=one_range[2];
            var max_lon=one_range[3];
            
            var min_min=transform_lon_lat_one_dot_b(cstype,min_lon,min_lat,true);
            var max_max=transform_lon_lat_one_dot_b(cstype,max_lon,max_lat,true);
            var min_max=transform_lon_lat_one_dot_b(cstype,max_lon,min_lat,true);
            var max_min=transform_lon_lat_one_dot_b(cstype,min_lon,max_lat,true);
            
            distance_list.push(distance_leaflet_b(current_point,min_min));
            distance_list.push(distance_leaflet_b(current_point,max_max));
            distance_list.push(distance_leaflet_b(current_point,min_max));
            distance_list.push(distance_leaflet_b(current_point,max_min));
        }
        return Math.min(...distance_list);
    }
    //-----------------------
    var t0 = performance.now();

    if (clicked_lat_lng_global.length!==2){return;}

    var cstype=document.getElementById('select_transform').value;

    var li_names=new Set();
    var olis=document.querySelectorAll('ol#ol_gpx_file_list li');
    for (let item of olis){
        li_names.add(item.innerText);
    }
    
    if (li_names.size==0){
        alert('未获取gpx文件列表');
        return;
    }
    
    var result_t=[];
    for (let item of gpx_pb_global){    //gpxfilename,fsize,fdate,min_lat,min_lon,max_lat,max_lon
        if (!li_names.has(item[0])){continue;}        
        result_t.push([item[0],sub_gpx_near_gps_points_min_distance(clicked_lat_lng_global,item[3]),'pb']);
    }

    for (let item of gpx_kl_global){
        if (!li_names.has(item[0])){continue;}            
        result_t.push([item[0],sub_gpx_near_gps_points_min_distance(clicked_lat_lng_global,item[3]),'kl']);
    }
    result_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    
    if (result_t.length>0){
        var oinfo=document.getElementById(info_id);
        oinfo.innerHTML=result_t[0][0]+': '+(result_t[0][1]/1000).toFixed(2)+'km';
        oinfo.style.color=(oinfo.style.color==scheme_global['color']?scheme_global['a']:scheme_global['color']);
    }
    
    if (show_list){
        var span_list=[];
        for (let item of result_t){
            span_list.push('<span class="span_link" onclick="read_txt_file_gps_points(\''+item[0]+'\',\''+item[2]+'\');">'+item[0]+'</span>');
        }

        gpx_file_array_2_html_gps_points('',span_list);
    }
    console.log('gpx_near_gps_points() 费时：'+(performance.now() - t0) + ' milliseconds');    
}

function lonlat_2_latlon_gps_points(){
    var otextarea=document.getElementById('textarea_gps_points');
    var result_t=[];
    var list_t=otextarea.value.trim().split('\n');
    for (let item of list_t){
        var blat=item.indexOf('@');
        var blcomment='';
        if (blat>=0){
            blcomment=item.substring(blat,);
            item=item.substring(0,blat).trim();
        }
        var temp_list=item.split(',');
        if (temp_list.length==2){
            result_t.push(temp_list[1].trim()+','+temp_list[0].trim()+blcomment);
        }
    }
    otextarea.value=result_t.join('\n');
}

function latlon_2_gpx_gps_points(do_save=false){
    var csstr=document.getElementById('textarea_gps_points').value.trim();
    var list_t=horizontal_delimiter_split_gps_points_b(csstr);
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        if (list_t[blxl].trim()==''){continue;}
        list_t[blxl]=data_lines_2_latlon_gps_points_b(list_t[blxl],'latlon'); //返回结果数组每一个元素都是 [lat,lon] 格式 - 保留注释
        list_t[blxl]=latlon_2_gpx_file_leaflet_b(list_t[blxl],'line'+blxl,false);
    }
    document.getElementById('textarea_gps_points').value=gpx_head_tail_leaflet_b(list_t.join('\n'));
    if (do_save){
        dom_value_2_txt_file_b('textarea_gps_points','','gpx');
    }
}

function remove_navigation_gps_points(){
    navigation_layer_gps_global.removeFrom(omap_gps_points_global);
    navigation_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    navigation_layer_gps_global.addTo(omap_gps_points_global);
    lte_list_leaflet_global=[]; //全局变量
}

function gpx_from_textarea_gps_points(){
    var blstr=document.getElementById('textarea_gps_points').value;
    read_gpx_gps_points(blstr,'');
}

function district_search_gps_points(cskeys=false,show_html=true){
    if (cskeys===false){
        var cskeys=(prompt('输入查询地区名称：') || '').trim();
    }
    var csreg=false;
    if (cskeys.slice(-4,)=='(:r)'){
        csreg=true;
        cskeys=cskeys.slice(0,-4);
    }
    cskeys=cskeys.trim();
    if (cskeys==''){return;}

    var result_t=[];
    for (let item of district_cn_geo_global){
        //item 数组元素：id,上级id,deep(0省1市2区),name,full name,lng,lat - 保留注释
        var blfound=str_reg_search_b(item.toString(),cskeys,csreg); //便于使用,1,找出地级市 等 - 保留注释
        if (blfound==-1){break;}
        if (blfound==false){continue;}       
        
        result_t.push([item[6]+','+item[5],item[4]]);
    }
    result_t.sort(function (a,b){return zh_sort_b(a,b,false,1);});            
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]=result_t[blxl].join('@');
    }
    if (show_html){
        document.getElementById('textarea_gps_points').value=result_t.join('\n');
    }
    return result_t;
}

function batch_2points_distance_list_gps_points(){
    var otextarea=document.getElementById('textarea_gps_points');
    var list_t=otextarea.value.trim().split('\n');
    var blmemo;
    var lat;
    var lng;
    var result_t=[];
    var blxl=0;
    for (let item of list_t){
        blmemo='';
        var blat=item.indexOf('@');
        if (blat>=0){
            blmemo=item.substring(blat+1,);
            if (new Set(blmemo.split(' ')).size==1){
                blmemo=blmemo.split(' ',1)[0];
            }
            item=item.substring(0,blat);
        }
        lat_lng=item.split(',');
        if (lat_lng.length!==2){continue;}
        lat=parseFloat(lat_lng[0]);
        lng=parseFloat(lat_lng[1]);
        if (isNaN(lat) || isNaN(lng)){continue;}
        result_t.push([lat,lng,blmemo]);
        blxl=blxl+1;
        if (blxl>=10000){
            document.getElementById('div_status').innerHTML='仅计算前10000条记录';
            break;
        }
    }
    
    var distance_list=[];
    var blmemo_a;
    var blmemo_b;
    var memo_list=[];
    var memo_str='';
    var memo_set=new Set();
    for (let item_a of result_t){
        blmemo_a=(item_a[2]==''?item_a[0]+','+item_a[1]:item_a[2]);
        for (let item_b of result_t){
            if (item_a.toString()==item_b.toString()){continue;}
            
            blmemo_b=(item_b[2]==''?item_b[0]+','+item_b[1]:item_b[2]);
            memo_list=[blmemo_a,blmemo_b].sort();
            memo_str=memo_list.join('@');
            if (memo_set.has(memo_str)){continue;}
            memo_set.add(memo_str);
            
            distance_list.push([distance_leaflet_b(item_a[0], item_a[1], item_b[0], item_b[1])/1000,memo_list]);
        }    
    }
    distance_list.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    if (distance_list.length>10000){
        document.getElementById('div_status').innerHTML='只显示前10000条记录';
        distance_list=distance_list.slice(0,10000);
    }
    for (let blxl=0,lent=distance_list.length;blxl<lent;blxl++){
        distance_list[blxl]='<p>'+(blxl+1)+'. '+distance_list[blxl][1].join('——')+': '+distance_list[blxl][0].toFixed(2)+'公里</p>';
    }
    var blbuttons='<p>'+close_button_b('divhtml','')+'</p>';
    document.getElementById('divhtml').innerHTML=distance_list.join('\n')+blbuttons;    //用 li 排序 会很慢 - 保留注释
}

function location_gpx_gps_points(csstr=false){
    var otextarea=document.getElementById('textarea_gps_points');
    var line_list=[];
    if (csstr===false){
        if (!otextarea){return;}
        line_list=otextarea.value.trim().split('\n');
    }
    csstr=line_list[0].split('@')[0];
    
    var list_t=csstr.split(',');
    if (list_t.length==2){
        omap_gps_points_global.panTo(new L.LatLng(list_t[0],list_t[1]));
    }
    
    if (line_list.length>0 && klmenu_check_b('span_delete_first_line',false)){
        otextarea.value=line_list.slice(1,).join('\n');
    }
}

function menu_gps_points(){
    var str_t=klmenu_hide_b('');
    var blparent=menu_parent_node_b(str_t);

    var klmenu_gpx=[];    
    if (document.location.href.substring(0,5).toLowerCase()!=='file:'){
        klmenu_gpx.push('<span class="span_menu" onclick="'+str_t+'gpx_file_selection_gps_points();">select GPX file</span>');
        var recent_t=recent_gpx_file_get_gps_points();
        if (recent_t[0]!==''){
            klmenu_gpx.push('<span class="span_menu" id="span_recent_gpx_file" onclick="'+str_t+'recent_gpx_file_get_gps_points(true);">'+(recent_t[0].length>12?recent_t[0].substring(0,12)+'...':recent_t[0])+'</span>');            
        }
    }
    
    var group_list=[
    ['清除','remove_navigation_gps_points();',true],   
    ['筛选','trk_filter_gps_points();',true],    
    ['距离、时间、海拔表格显示','lte_show_gps_points();',true],    
    ];    
    klmenu_gpx.push(menu_container_b(str_t,group_list,'路线：'));    
    
    klmenu_gpx=klmenu_gpx.concat([
    idb_menu_generate_bigfile_b('gpx','select_big_file_gpx_gps_points',blparent,'import_bigfile_gps_points'),
    '<span class="span_menu" onclick="'+str_t+'gpx_from_textarea_gps_points();">从编辑框显示GPX图形</span>',
    '<span class="span_menu" onclick="'+str_t+'latlon_2_gpx_gps_points();">lat,lon to GPX file format</span>',
    '<span id="span_gpx_2_latlon" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id);">⚪ 转换gpx为纬度,经度点</span>',    
    ]);
    
    var klmenu_dots=[];
    
    var group_list=[
    ['switch','lonlat_2_latlon_gps_points();',true],   
    ['坐标转换','transform_dotlines_gps_points(false,false,true);',true],    
    ['line','draw_multiple_lines_gps_points();',true],
    ['circles','dots_2_circles_gps_points();',true],    
    ['从编辑框逐行读取arg参数并执行','arg_from_textarea_gps_points();',true]
    ];    
    klmenu_dots.push(menu_container_b(str_t,group_list,'lat,lon: '));    

    var group_list=[
    ['转换为WGS84','baidu_data_transform_gps_points(\'BD09_TO_WGS84\');',true],
    ['转换为GCJ02','baidu_data_transform_gps_points(\'BD09_TO_GCJ02\');',true],
    ];    
    klmenu_dots.push(menu_container_b(str_t,group_list,'百度 经度 纬度,经度 纬度;经度 纬度 格式：'));    
    
    klmenu_dots=klmenu_dots.concat([
    '<span class="span_menu" onclick="'+str_t+'lng_lat_gps_points();">经度 纬度,经度 纬度;经度 纬度 格式生成线条</span>',
    '<span class="span_menu">演示1秒 == 实际 <input type="number" id="input_real_second_gps_points" min="1" value="86400" style="width:5rem;" /> 秒 最长间隔时间（秒）：<input type="number" id="input_max_wait_seconds_gps_points" min="0.01" value="0.01" style="width:4rem;" /><br /><label><input type="checkbox" id="checkbox_ppt_circle_gps_points" checked />circle</label> 半径：<input type="number" id="input_ppt_circle_radius_gps_points" min="1" value="20" style="width:3rem;" /> <label><input type="checkbox" id="checkbox_ppt_character_gps_points" checked />character</label> 半径：<input type="number" id="input_ppt_character_radius_gps_points" min="1" value="17" style="width:3rem;" /> 分组：<select id="select_ppt_color_gps_points"><option></option><option>10年</option><option>年</option><option>月</option></select> 最小缩放：<input type="number" id="input_ppt_scale_min_gps_points" min="5" value="9" step="1" style="width:4rem;" /> <span class="aclick" onclick="'+blparent+'ppt_gps_points();">动态演示</span><span class="aclick" onclick="'+blparent+'ppt_gps_points(true);">直接载入</span> 延时：<input type="number" id="input_run_wait_second_gps_points" min="1" value="3" style="width:3rem;" /> 秒 <span class="aclick" onclick="'+blparent+'selet_points_in_range_gps_points();">筛选出当前看见范围内的点</span></span>',
    ]);
    
    group_list=[
    ['key:value 格式','dots_show_gps_points();',true],
    ['lat,lon 格式','dots_show_gps_points(true);',true],
    ];    
    klmenu_dots.push(menu_container_b(str_t,group_list,'generate dots: '));    

    var option_list=[];
    for (let blxl=1;blxl<10;blxl++){
        option_list.push('<option>'+blxl+'</option>');
    }
    var blparent=menu_parent_node_b(str_t);

    var klmenu_district=[
    '<span class="span_menu" onclick="'+str_t+'lat_lon_range_gps_points();">当前地区可见区域坐标</span>',    
    '<span class="span_menu">当前地区放大 <select id="select_enlarge_gps_points_min">'+option_list.join('')+'</select> - <select id="select_enlarge_gps_points_max">'+option_list.join('')+'</select> 级地图遍历 <span class="aclick" onclick="'+blparent+'enlarge_current_range_gps_points();">执行</span></span>',   
    '<span class="span_menu" onclick="'+str_t+'district_search_gps_points();">地区坐标搜索</span>',
    '<span class="span_menu" onclick="'+str_t+'batch_2points_distance_list_gps_points();">两两坐标距离排序</span>',
    '<span class="span_menu" onclick="'+str_t+'location_gpx_gps_points();">lat,lon 坐标定位</span>',        
    '<span id="span_delete_first_line" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id);">⚪ 定位后删除第1行</span>',
    ];

    group_list=[
    ['最新','enlarge_range_restore_gps_points();',true],
    ['最近','enlarge_range_restore_gps_points(\'nearest\');',true],
    ];    
    klmenu_district.push(menu_container_b(str_t,group_list,'上次遍历的坐标和比例：'));    
    
    group_list=[
    ['提取','lat_lon_group_visible_gps_points();',true],
    ['删除','lat_lon_group_visible_gps_points(true);',true],
    ];    
    klmenu_district.push(menu_container_b(str_t,group_list,'当前地区可见区域lat,lon分组：'));    
    
    group_list=[
    ['省份','district_search_gps_points(\',0,0,\');',true],
    ['省会城市','district_search_gps_points(\'01,[0-9]+,1,(:r)\');',true],
    ['地级及以上城市','district_search_gps_points(\',1,\');',true],
    ['城区','district_search_gps_points(\'+,2, +区,\');',true],
    ];    
    klmenu_district.push(menu_container_b(str_t,group_list,''));    

    var klmenu_link=[
    '<a href="https://www.mct.gov.cn/tourism/" onclick="'+str_t+'" target=_blank>中华人民共和国文化和旅游部</a>',        
    ];
    
    var klmenu_config=[
    '<span id="span_colors_gps_points" class="span_menu" style="font-size:small;word-break:break-all;" onclick="'+str_t+'colors_settings_gps_points();">line color: '+colors_default_value_gps_points()+'</span>',
    ];
    
    group_list=[
    ['<font color="red">red</font>','colors_settings_gps_points(\'red\');',true],
    ['<font color="blue">blue</font>','colors_settings_gps_points(\'blue\');',true],
    ['默认','colors_settings_gps_points(\'默认\');',true],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,'颜色：'));        
    
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu"><select onchange="quick_buttons_select_gps_points(this.value);"><option></option><option>lat,lon处理</option></select></span>',
    '<span class="span_menu">fill opacity: <input type="number" id="input_fill_opacity_gps_points" value="0" min="0" max="1" step="0.1" /> <label><input type="checkbox" id="checkbox_stroke_line_border_gps_points" checked />stroke</label> 线路分段(m): <input type="number" id="input_sub_line_length_gps_points" value="0" min="100" step="100" style="width:5rem;" /> 线宽: <input type="number" id="input_line_weight_gps_points" min="3" max="10" step="1" style="width:2rem;" onchange="gpx_line_weight_global=parseInt(this.value);" /></span>',
    ]);

    group_list=[
    ['距离圈设置','circle_distance_settings_gps_points();',true],
    ['缩放设置','zoom_gps_points();',true],
    ['调整地图显示区域','map_resize_gps_points(window.innerHeight,false,true);',true],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));        
    
    var group_list=[
    ['⚪ show distance circle','klmenu_check_b(this.id);current_layer_refresh_gps_points();',false,'span_show_circle'],
    ['⚪ 持续定位','klmenu_check_b(this.id);current_position_show_gps_points();',false,'span_continue_position'],    
    ['⚪ 方形距离圈','klmenu_check_b(this.id);',false,'span_is_rectangle'],   
    ['⚪ 数字编号','klmenu_check_b(this.id);',false,'span_line_no_gps'],   
    ];
    klmenu_config.push(menu_container_b(str_t,group_list,''));    

    var more_config=[
    ['update','service_worker_delete_b(\'gps_points\');',true],
    ['help','help_gps_points();',true],
    ['整点报时','alarm_interval_set_b(0)',true],
    ];    
    klmenu_config.push(menu_container_b(str_t,more_config,''));
    
    klmenu_config=klmenu_config.concat(root_font_size_menu_b(str_t,false,true,false,true,'textarea_gps_points'));
        
    document.getElementById('input_upload_gpx').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_gpx,'⛰','22rem','1rem','1rem','60rem')+klmenu_b(klmenu_dots,'','39rem','1rem','1rem','60rem')+klmenu_b(klmenu_district,'📍','24rem','1rem','1rem','60rem')+klmenu_b(klmenu_link,'L','18rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','36rem','1rem','1rem','60rem'),'','0rem')+' ');
    
    klmenu_check_b('span_line_no_gps',true);        

    line_default_weight_b();
    document.getElementById('input_line_weight_gps_points').value=gpx_line_weight_global;
}

function lte_show_gps_points(){
    if (typeof lte_list_leaflet_global == 'undefined'){return;}
    document.getElementById('textarea_gps_points').value=lte_list_leaflet_global.join('\n');
}

function lat_lon_year_get_gps_points(add_raw=false){
    var list_t=document.getElementById('textarea_gps_points').value.trim().split('\n');
    var result_t=[];
    var year_range=new Set();
    for (let arow of list_t){
        let raw_row=arow;
        arow=arow.trim().split(' /// '); //形如：2025/20250714NUC散热.jpg /// 28.674675 /// 121.431758 /// 2025:07:14 22:19:09 - 保留注释
        if (arow.length!==4){continue;}
        arow[3]=arow[3].trim().split(' ');
        if (arow[3].length!==2){continue;}
        arow[3][0]=arow[3][0].replace(/\:/g,'-');
        let img_date=validdate_b(arow[3].join(' '));
        if (img_date===false){
            console.log('日期错误',arow);
            continue;
        } else {
            arow[3]=img_date;
            year_range.add(img_date.getFullYear());
        }
        arow[1]=parseFloat(arow[1].trim());
        arow[2]=parseFloat(arow[2].trim());
        if (isNaN(arow[1]) || isNaN(arow[2])){
            console.log('经纬度错误',arow);
            continue;
        }
        arow[0]=file_path_name_b(arow[0])[1];
        arow.push(0);
        if (add_raw){
            arow.push(raw_row);
        }
        result_t.push(arow);
    }

    result_t.sort();
    result_t.sort(function (a,b){return a[3]<b[3]?-1:1;});

    console.log('整理前行数：', list_t.length, '整理后行数：', result_t.length);
    
    return [result_t,year_range];
}

function selet_points_in_range_gps_points(){
    var result_t,year_range;
    [result_t,year_range]=lat_lon_year_get_gps_points(true);
    if (result_t.length==0){return;}

    var transform_type=document.getElementById('select_transform').value;
    
    //result_t 每个元素为数组，形如：
    //"20200101XXXXXXX"
    //30.361330972222
    //120.03687497222
    //Date Wed Jan 01 2020 09:21:16 GMT+0800 (China Standard Time)
    //0
    //raw_row
    var selected_list=[];
    for (let item of result_t){
        let lon = item[2];
        let lat  = item[1];
        [lon,lat]=transform_lon_lat_one_dot_b(transform_type,lon,lat);
        dopanto=check_points_is_in_map(lat,lon,transform_type,true);
        if (dopanto){continue;}
        selected_list.push(item[5]);
    }
    
    if (confirm('获取数据 '+result_t.length+' 条，当前可见区域记录有 '+selected_list.length+' 条，是否替换？')==false){return;}

    document.getElementById('textarea_gps_points').value=selected_list.join('\n');
}

function ppt_gps_points(direct_show=false){
    function sub_ppt_gps_points_one_point(){
        if (do_rescale){
            if (blno!==row_count-1){
                zoom_gps_points(scale_current);
                console.log(today_str_b('t'), '缩放',scale_current);
            }
            do_rescale=false;
            session1_start=performance.now();
        }
        
        let dopanto;
        if (performance.now() - session0_start>wait_max*1000 || blno==row_count-1){
            dopanto=true;
            session0_start=performance.now();
        } else {
            dopanto=false;
        }

        if (!direct_show && scale_min!==scale_current && dopanto){
            if (performance.now() - session1_start>Math.max(10,wait_max*10)*1000){
                //至少10秒 - 保留注释
                do_rescale=true;
                zoom_gps_points(scale_min);
                let rescale_wait=Math.max(1.5,Math.min(10,wait_max*10));
                console.log(today_str_b('t'), '缩放',scale_min,'等待',rescale_wait,'秒');
                setTimeout(sub_ppt_gps_points_one_point,rescale_wait*1000);
                //等待 1.5-10秒之间 - 保留注释
                return;
            }
        }

        let arow=result_t[blno];

        let img_name=arow[0].replace(/\d+$/,'');
        let img_year=arow[3].getFullYear();
        let img_month=arow[3].getMonth();
        if (current_year===false){
            current_year=img_year;
        }
        if (current_month===false){
            current_month=img_month;
        }
        
        let do_color_change=false;
        let show_string='+';
        switch (color_type){
            case '10年':
                if (current_year!==img_year){
                    if (current_year.toString().slice(0,3)!==img_year.toString().slice(0,3)){
                        do_color_change=true;
                        sound_b('elephant');
                    }
                    current_year=img_year;
                }
                show_string=arow[0].substring(3,4);
                break;
            case '年':
                if (current_year!==img_year){
                    do_color_change=true;
                    current_year=img_year;
                    sound_b('elephant');
                }
                show_string=arow[0].substring(3,4); //年份尾数 - 保留注释
                //arow 形如：[ "20250625杭州3", 30.296242, 120.091354, Date Wed Jun 25 2025 14:50:57 GMT+0800 (China Standard Time), 0.00008101851851851852 ]
                break;
            case '月':
                if (current_year!==img_year || current_month!==img_month){
                    do_color_change=true;
                    current_year=img_year;
                    current_month=img_month;
                    sound_b('cuckoo');
                }
                show_string=(year_count>1?arow[0].substring(3,4)+'/':'')+arow[0].substring(4,6);
                break;
        }
        
        if (do_color_change){
            color_no=color_no+1;
            if (color_no>=color_count){
                color_no=0;
            }
        }
        
        if (show_circle){
            circle_gps_points([arow[2]+','+arow[1]+','+circle_radius+','+color_list[color_no]],true,'navigation',dopanto,false,transform_type,fill_opacity,is_stroke,blno!==row_count-1);
            dopanto=false;
        }
        if (show_character){
            character_gps_points([arow[2]+','+arow[1]+','+character_radius+','+color_list[color_no]+','+show_string],true,'navigation',dopanto,false,transform_type,blno!==row_count-1);
        }
        
        blno=blno+1;
        document.title=blno+'/'+row_count+' - '+img_name+' - '+old_title;

        if (blno>=row_count){
            if (scale_min!==scale_current){
                zoom_gps_points(scale_min);
                console.log(today_str_b('t'), '缩放',scale_min);
            }
            document.title=old_title;
            console.log('ppt_gps_points() 费时：'+(performance.now() - t0)/1000 + ' seconds');    
            return;
        }
        
        if (direct_show){
            if (blno % 1000 ==0){
                setTimeout(sub_ppt_gps_points_one_point,1);
            } else {
                sub_ppt_gps_points_one_point();
            }
        } else {
            if (blno % 1000 ==0){
                console.log(today_str_b('t'), blno,'等待',result_t[blno][4],'秒',dopanto,arow);
            }
            setTimeout(sub_ppt_gps_points_one_point,result_t[blno][4]*1000);
        }
    }
    
    var t0 = performance.now();

    var show_circle=document.getElementById('checkbox_ppt_circle_gps_points').checked;
    var show_character=document.getElementById('checkbox_ppt_character_gps_points').checked;
    if (!show_circle && !show_character){return;}
    
    var circle_radius=parseInt(document.getElementById('input_ppt_circle_radius_gps_points').value.trim());
    var character_radius=parseInt(document.getElementById('input_ppt_character_radius_gps_points').value.trim());
    
    var scale_min=parseInt(document.getElementById('input_ppt_scale_min_gps_points').value.trim());
    var scale_current=omap_gps_points_global.getZoom();
    
    var result_t,year_range;
    [result_t,year_range]=lat_lon_year_get_gps_points();
    if (result_t.length==0){return;}
    
    var year_count=year_range.size;
    
    var ratio=Math.max(1,parseInt(document.getElementById('input_real_second_gps_points').value.trim()));
    var wait_max=parseFloat(document.getElementById('input_max_wait_seconds_gps_points').value.trim());
    
    var color_list=colors_get_gps_points(false)[0].split(':');
    var color_count=color_list.length;
    var color_no=0;
    var color_type=document.getElementById('select_ppt_color_gps_points').value;
    
    for (let blxl=1,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl][4]=Math.min(wait_max,(result_t[blxl][3]-result_t[blxl-1][3])/1000/ratio);   //演示间隔秒数
    }
    
    var transform_type=document.getElementById('select_transform').value;
    var fill_opacity=parseFloat(document.getElementById('input_fill_opacity_gps_points').value.trim());
    var is_stroke=document.getElementById('checkbox_stroke_line_border_gps_points').checked;

    var blno=0;
    var row_count=result_t.length;
    var old_title=document.title;
    var current_year=false;
    var current_month=false;
    var session0_start = performance.now();
    var session1_start = performance.now();
    var do_rescale=false;
    
    var run_wait=parseInt(document.getElementById('input_run_wait_second_gps_points').value.trim()) || 0;
    if (run_wait>0){
        setTimeout(sub_ppt_gps_points_one_point,run_wait*1000);
        document.title='延时 '+run_wait +' 秒 - '+old_title;
    } else {
        sub_ppt_gps_points_one_point();
    }
}

function import_bigfile_gps_points(fname=false){
    function sub_import_bigfile_gps_points_onsuccess(cscontent){
        gpx_from_textarea_gps_points();
        if (fname!==false){
            recent_gpx_file_set_gps_points(fname,'bigfile');
        }
    }
    
    if (fname===false){
        fname=document.getElementById('select_big_file_gpx_gps_points').value;
    }
    
    if (fname=='重新载入'){
        idb_option_clear_bigfile_b('gpx',document.getElementById('select_big_file_gpx_gps_points'));
    }
    
    if (fname=='手动输入 bigfile gpx 文件名'){
        fname=false;
    }
    import_bigfile_content_b(fname,'textarea_gps_points',sub_import_bigfile_gps_points_onsuccess);
}

function arg_from_textarea_gps_points(){
    var list_t=document.getElementById('textarea_gps_points').value.trim().split('\n');
    var circle_list=[];
    var rect_list=[];
    var character_list=[];
    
    for (let arow of list_t){
        if (arow.substring(0,7)=='circle='){
            circle_list=circle_list.concat(arow.substring(7,).split(';'));
        } else if (arow.substring(0,10)=='rectangle='){
            rect_list=rect_list.concat(arow.substring(10,).split(';'));
        } else if (arow.substring(0,10)=='character='){
            character_list=character_list.concat(arow.substring(10,).split(';'));
        }
    }
    
    var old_title=document.title;
    if (circle_list.length>0){
        circle_gps_points(circle_list,true,'navigation',true,old_title);
    }
    
    if (rect_list.length>0){
        rectangle_gps_points(rect_list,true,'navigation',true,old_title);
    }
    
    if (character_list.length>0){
        character_gps_points(character_list,true,'navigation',true,old_title);
    }
}

function map_resize_gps_points(window_h=false,is_simple=false,map_resize=false,set_selection=false){
    if (window_h==false){
        window_h=document_body_offsetHeight_b();
    }
    
    var omap=document.getElementById('div_map');
    if (is_simple==false){
        if (set_selection){
            var odiv=document.getElementById('div_selection');
            odiv.style.maxHeight=Math.round(window_h*0.8)+'px';
        }
        //var rect =document.getElementById('div_gps_points').getBoundingClientRect();  //此行暂时保留 - 保留注释
        
        var rect2 =omap.getBoundingClientRect();
        omap.style.height=Math.max(300,(window_h-rect2.top))+'px';  //rect.height-  //此注释暂时保留 - 保留注释
    } else {
        omap.style.height=Math.max(300,window_h)+'px';    
    }
    
    if (map_resize){
        omap_gps_points_global.invalidateSize(true);
    }
}

function quick_buttons_select_gps_points(cstype){
    var blstr='';
    switch (cstype){
        case 'lat,lon处理':
            blstr='lat,lon: <span class="aclick" onclick="draw_multiple_lines_gps_points();" title="显示为 line">〰</span>';
            blstr=blstr+'<span class="aclick" onclick="remove_navigation_gps_points();" title="清除路线">🫧</span>';            
            blstr=blstr+'<span class="aclick" onclick="latlon_2_gpx_gps_points(true);">to GPX file format & save</span>';
            blstr=blstr+'当前可见区域：<span class="aclick" onclick="lat_lon_group_visible_gps_points();" title="提取">〽</span><span class="aclick" onclick="lat_lon_group_visible_gps_points(true);" title="删除">🚮</span>';
            blstr=blstr+'<span class="aclick" onclick="gd_switch_gps_points(this);" title="高德切换">🌐</span>';
            blstr=blstr+'<span class="aclick" onclick="gpx_near_gps_points(\'span_gpx_files_info2\',false);" title="最近gpx">✳</span>';
            blstr=blstr+'<span id="span_gpx_files_info2"></span>';
            break;
    }
    var ospan=document.getElementById('span_quick_buttons_gpx');
    ospan.innerHTML=blstr;
}

function gd_switch_gps_points(ospan=false,add_map=false){
    for (let one_map in klmaps_global){
        if (omap_gps_points_global.hasLayer(klmaps_global[one_map])){
            console.log('发现',one_map);
            omap_gps_points_global.removeLayer(klmaps_global[one_map]);
            if (add_map===false){
                add_map=(one_map=='gd'?'gd_earth':'gd');
            }
            omap_gps_points_global.addLayer(klmaps_global[add_map]);
            if (ospan){
                ospan.innerHTML=(add_map=='gd'?'🌏':'🌐');
            }
            break;
        }
    }
}

function lat_lon_range_gps_points(){
    var list_t=map_range_leaflet_b(omap_gps_points_global,false,document.getElementById('select_transform').value);
    var otextarea=document.getElementById('textarea_gps_points');
    otextarea.value=list_t.join('\n');
}

function split_map_gps_points(csrows, cscols, return_points=true, return_lines=true, return_rectangle=true,bounds=false){
    if (bounds==false){
        var bounds = omap_gps_points_global.getBounds();
    }
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();

    var latDiff = (northEast.lat - southWest.lat) / csrows;
    var lngDiff = (northEast.lng - southWest.lng) / cscols;

    var points_list = [];
    var lines_list=[];
    var rectangles_list=[];
    var used_points=new Set();
    var used_lines=new Set();
    var nw,se;
    for (let arow = 0; arow < csrows; arow++){
        for (let acol = 0; acol < cscols; acol++){
            var sw=L.latLng(southWest.lat + latDiff * arow, southWest.lng + lngDiff * acol);
            var ne=L.latLng(southWest.lat + latDiff * (arow + 1), southWest.lng + lngDiff * (acol + 1));
            [nw,se]=rectangle_angles_leaflet_b(sw,ne,false);
            
            if (return_points){
                var list_t=[sw,ne,nw,se];
                for (let item of list_t){
                    if (used_points.has(item.toString())){continue;}
                    points_list.push(item);
                    used_points.add(item.toString());
                }
            }

            var list_t=[
            [[nw.lat,nw.lng],[ne.lat,ne.lng]],
            [[nw.lat,nw.lng],[sw.lat,sw.lng]],
            [[ne.lat,ne.lng],[se.lat,se.lng]],
            [[sw.lat,sw.lng],[se.lat,se.lng]],
            ];
                
            if (return_lines){
                for (let item of list_t){
                    if (used_lines.has(item.toString())){continue;}
                    lines_list.push(item);
                    //draw_gpx_gps_points(item,'',false,-1,false); //此行保留 - 保留注释
                    used_lines.add(item.toString());
                }
            }
            
            if (return_rectangle){
                rectangles_list.push(list_t);
            }
                        
            //gridBounds.push({'sw':sw,'ne':ne,'nw':nwse['nw'],'se':nwse['se']}); //此行保留 - 保留注释
            
            //以下几行保留 - 保留注释
            //矩形的西南角和东北角坐标 - 保留注释
            //gridBounds.push([
                //L.latLng(southWest.lat + latDiff * arow, southWest.lng + lngDiff * acol),
                //L.latLng(southWest.lat + latDiff * (arow + 1), southWest.lng + lngDiff * (acol + 1))
            //]);
        }
    }
    
    return [points_list,lines_list,rectangles_list];
    
    //以下几行保留 - 保留注释
    //gridBounds.forEach(function(bounds, index){
        //var rectangle = L.rectangle(bounds, {color: 'red', weight: 1});
        //rectangle.addTo(omap_gps_points_global);
        //rectangle.bindPopup('Part ' + index);
    //});
}

function enlarge_range_restore_gps_points(cstype=''){
    var list_t=local_storage_get_b('gps_points_center_zoom',30,true);
    if (list_t.length==1 && list_t[0]==''){
        alert('未发现缓存记录');
        return;
    }

    var blno=0;
    switch (cstype){
        case 'nearest':
            var ocenter=omap_gps_points_global.getCenter();
            var transform_type=document.getElementById('select_transform').value;
            var distance_list=[];
            for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                var arow=list_t[blxl].split('_');
                if (arow.length!==3){continue;}
                var one_dot=transform_lon_lat_one_dot_b(transform_type,parseFloat(arow[1]), parseFloat(arow[0]),true);
                distance_list.push([blxl,distance_leaflet_b([ocenter['lat'],ocenter['lng']],one_dot),arow,ocenter]);
            }
            distance_list.sort(function (a,b){return a[1]<b[1]?-1:1;});
            blno=distance_list[0][0];
            break;
    }

    var arow=list_t[blno].split('_');
    omap_gps_points_global.setZoom(parseInt(arow[2]));  //此行放在 panTo 前，否则要 setTimeout - 保留注释
    omap_gps_points_global.panTo(new L.LatLng(parseFloat(arow[0]),parseFloat(arow[1])));
}

function enlarge_range_set_gps_points(ocenter,cscurrent){
    var current_lat_lng=ocenter['lat']+'_'+ocenter['lng']+'_';
    
    var list_t=local_storage_get_b('gps_points_center_zoom',30,true);
    var used_lat_lng=new Set();
    var result_t=[];
    for (let arow of list_t){
        if (arow.startsWith(current_lat_lng)){continue;}
        var temp_t=arow.split('_');
        if (temp_t.length!==3){continue;}
        var one_lat_lng=temp_t[0]+'_'+temp_t[1]+'_';
        if (used_lat_lng.has(one_lat_lng)){continue;}
        
        result_t.push(arow);
        used_lat_lng.add(one_lat_lng);
    }
    result_t=[current_lat_lng+cscurrent].concat(result_t);
    localStorage.setItem('gps_points_center_zoom',result_t.join('\n'));
}

function enlarge_current_range_gps_points(wait_seconds=false,zoom_degree_min=false,zoom_degree_max=false){  
    function sub_enlarge_current_range_gps_points_loop(){
        omap_gps_points_global.panTo(ocenter);
        if (zoom_degree_max===false){return;}
        if (zoom_degree_min>=zoom_degree_max){return;}
        
        if (zoom_degree_min<zoom_degree_max){
            setTimeout(function (){enlarge_current_range_gps_points(wait_seconds,zoom_degree_min+1,zoom_degree_max);},1000);
        }
    }
    
    function sub_enlarge_current_range_gps_points_draw(){
        if (rectangles_xl>=rectangles_len){
            document.title=old_title;
            zoom_gps_points(blcurrent);
            setTimeout(sub_enlarge_current_range_gps_points_loop,1000);
            return;
        }
        for (let item of rectangles_list[rectangles_xl]){
            draw_gpx_gps_points(item,'',false,cscolors,true);
        }
        rectangles_xl=rectangles_xl+1;
        document.title=rectangles_xl+'/'+rectangles_len+' - '+old_title;
        setTimeout(sub_enlarge_current_range_gps_points_draw,wait_seconds*1000);
    }
    
    function sub_enlarge_current_range_gps_points_check(){
        var bound_new=map_size_or_bound_leaflet_b(omap_gps_points_global,false,'bound');
        if (bound_old.toString()!==bound_new.toString()){
            var new_x_length=bound_new[0].distanceTo(bound_new[1]);
            var new_y_length=bound_new[0].distanceTo(bound_new[2]);
            console.log('尝试次数',bltimes);
            
            csrows=Math.ceil(old_y_length/new_y_length);
            cscols=Math.ceil(old_x_length/new_x_length);

            rectangles_list=split_map_gps_points(csrows, cscols,false,false,true,bound_raw)[2];
            rectangles_xl=0;
            rectangles_len=rectangles_list.length;
            enlarge_range_set_gps_points(ocenter,blcurrent);
            if (confirm('当前放大比例 '+blcurrent+' 。是否以每次 '+wait_seconds+' 秒间隔，遍历读取 '+csrows+' ('+old_y_length.toFixed(1)+'/'+new_y_length.toFixed(1)+') x '+cscols+' ('+old_x_length.toFixed(1)+'/'+new_x_length.toFixed(1)+') = '+rectangles_len+' 块地图内容？')==false){return;}
    
            sub_enlarge_current_range_gps_points_draw();
            return;
        }
        
        bltimes=bltimes+1;
        if (bltimes>5){
            console.log('尝试次数',bltimes);
            return;
        }
        setTimeout(sub_enlarge_current_range_gps_points_check,1);
    }

    var blcurrent=omap_gps_points_global.getZoom();
    var blmax=omap_gps_points_global._layersMaxZoom;
    if (blcurrent==blmax){
        alert('已到最大放大程度');
        return;
    }
    
    if (wait_seconds===false){
        wait_seconds=prompt('输入间隔秒数：');
        if (wait_seconds==null){return;}      
        wait_seconds=parseInt(wait_seconds);
        if (isNaN(wait_seconds)){
            alert('格式错误');
            return;
        }
    }
    
    var csrows, cscols;
    var rectangles_list, rectangles_xl, rectangles_len;

    var cscolors=colors_get_gps_points(false);

    var bound_old,bound_raw;
    [bound_old,bound_raw]=map_size_or_bound_leaflet_b(omap_gps_points_global,false,'bound',true);
    var old_x_length=bound_old[0].distanceTo(bound_old[1]);
    var old_y_length=bound_old[0].distanceTo(bound_old[2]);

    if (zoom_degree_min===false){
        zoom_degree_min=parseInt(document.getElementById('select_enlarge_gps_points_min').value);
    }

    if (zoom_degree_max===false){
        zoom_degree_max=parseInt(document.getElementById('select_enlarge_gps_points_max').value);
    }
    
    zoom_gps_points(blcurrent+zoom_degree_min);
    var bltimes=0;
    
    var old_title=document.title;
    var ocenter=omap_gps_points_global.getCenter();
    
    setTimeout(sub_enlarge_current_range_gps_points_check,1);
}

function zoom_gps_points(new_value=false){
    var blmax=omap_gps_points_global._layersMaxZoom;
    var blmin=omap_gps_points_global._layersMinZoom;
    var blcurrent=omap_gps_points_global.getZoom();
    
    if (new_value===false){
        var new_value=parseInt((prompt('输入缩放值（'+blmin+'-'+blmax+'）：',blcurrent) || '').trim());
    }
    
    if (isNaN(new_value) || new_value==blcurrent){return;}    
    if (new_value<blmin || new_value>blmax){return;}
    omap_gps_points_global.setZoom(new_value);
}

function lat_lon_group_visible_gps_points(is_remove=false){
    var otextarea=document.getElementById('textarea_gps_points');
    var cstype=document.getElementById('select_transform').value;
    var range_t=map_range_leaflet_b(omap_gps_points_global,true,cstype);
    var csstr=otextarea.value.trim();
    var group_list=horizontal_delimiter_split_gps_points_b(csstr,true);
    var group_in=[];
    var in_name_list=[];
    var group_out=[];
    for (let one_group of group_list){
        var list_t=one_group[0].trim().split('\n');
        list_t=dots_2_list_gps_points(list_t);
        var in_range=false;
        for (let arow of list_t){
            [arow[1],arow[0]]=transform_lon_lat_one_dot_b(cstype,arow[1],arow[0]);
            if (arow[0]>=range_t[0][0] && arow[0]<=range_t[0][1] && arow[1]>=range_t[1][0] && arow[1]<=range_t[1][1]){
                in_range=true;
                break;
            }
        }
        if (in_range){
            group_in.push(one_group);
            in_name_list.push(one_group[1]);
        } else {
            group_out.push(one_group);
        }
    }
    
    if (confirm('当前共有分组 '+group_list.length+' 个，发现 '+group_in.length+' 个在可见范围内（'+in_name_list.join(',')+'），是否'+(is_remove?'移除':'提取')+'？')==false){return;}

    var blarray=(is_remove?group_out:group_in);
    
    for (let blxl=0,lent=blarray.length;blxl<lent;blxl++){
        blarray[blxl]=(blarray[blxl][1]==''?'-----':'--- '+blarray[blxl][1]+' ---')+'\n'+blarray[blxl][0].trim();
    }
    otextarea.value=blarray.join('\n');
}

function colors_get_gps_points(one_color=true){
    var ospan=document.getElementById('span_colors_gps_points');
    if (!ospan){
        return ['','',''];
    }
    var old_value=ospan.innerText;
    var blat=old_value.indexOf(': ');
    if (blat<0){
        return ['','',''];
    }
    
    old_value=old_value.substring(blat+2,);
    var list_t=old_value.split(',');
    if (one_color){
        list_t[0]=list_t[0].split(':')[0];  //线条颜色支持多种，起点、终点颜色不考虑多种 - 保留注释
    }
    list_t=list_t.concat(['','','']).slice(0,3);  //补充颜色设置为3个元素 - 保留注释
    return list_t;
}

function colors_default_value_gps_points(){
    return 'blue:red:green:brown:greenyellow:cyan:black:tomato:dodgerblue:hotpink:indianred:purple,cyan,red';
}

function colors_settings_gps_points(new_value=''){
    var ospan=document.getElementById('span_colors_gps_points');
    if (!ospan){return;}
    
    if (new_value==''){
        var old_value=colors_get_gps_points(false).join(',');
        new_value=(prompt('输入颜色，输入 默认 则返回默认值：',old_value) || '').trim();
    }
    
    if (new_value==''){return;}
    
    new_value=new_value.replace(/[，\s]/g,',');
    var list_t=new_value.split(',');
    new_value=[];
    for (let item of list_t){
        if (item==''){continue;}
        new_value.push(item);
    }
    new_value=new_value.join(',');
    if (new_value=='默认'){
        new_value=colors_default_value_gps_points();
    }
    ospan.innerText='line color: '+new_value;
}

function baidu_data_transform_gps_points(cstype){
    var otextarea=document.getElementById('textarea_gps_points');
    var list_t=transform_lng_lat_dots_b(otextarea.value,cstype);
    var result_t=[];
    for (let one_line of list_t){
        for (let blxl=0,lent=one_line.length;blxl<lent;blxl++){
            one_line[blxl]=one_line[blxl].join(' ');
        }
        result_t.push(one_line);
    }
    otextarea.value=result_t.join(';');
}

function lng_lat_gps_points(){
    var bltype=document.getElementById('select_transform').value;
    var otextarea=document.getElementById('textarea_gps_points');
    var list_t=transform_lng_lat_dots_b(otextarea.value,'');
    
    var cscolors=colors_get_gps_points(false);
    for (let one_line of list_t){
        if (one_line.length==0){continue;}    
        for (let blxl=0,lent=one_line.length;blxl<lent;blxl++){
            one_line[blxl]=[one_line[blxl][1],one_line[blxl][0]];
        }
        draw_gpx_gps_points(one_line,'',true,cscolors,true);
        
        var last_point=transform_dotlines_gps_points(one_line.slice(-1),bltype,false);
        omap_gps_points_global.panTo(new L.LatLng(last_point[0][0],last_point[0][1]));
    }
}

function gpx_district_generate_gps_points(){
    function sub_gpx_district_gps_points_array(csarray,cstype){
        var the_district;
        for (let item of csarray){
            the_district=item[0].split('_').slice(0,2).join('_');
            if (district_t.has(the_district)){
                result_t[the_district].push([item[0],cstype]);
            } else {
                the_district=item[0].split('_')[0];
                if (district_t.has(the_district)){
                    result_t[the_district].push([item[0],cstype]);
                } else {
                    result_t['others'].push([item[0],cstype]);            
                }
            }
        }    
    }
    //-----------------------
    var result_t={};
    var district_t=district_cn_level_b(1);
    for (let item of district_t){
        result_t[item]=[];
    }
    result_t['others']=[];
    sub_gpx_district_gps_points_array(gpx_pb_global,'pb');
    sub_gpx_district_gps_points_array(gpx_kl_global,'kl');
    
    return result_t;
}
