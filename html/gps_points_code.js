function buttons_gps_points(){
    var bljg='<input type="file" id="input_upload_gpx"> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:upload_gpx_gps_points();">Upload GPX File</span> ';
    bljg=bljg+'<select id="select_transform" style="max-width:5rem;">\n';
    bljg=bljg+'<option></option>\n';
    bljg=bljg+'<option>WGS84_TO_GCJ02</option>\n';
    bljg=bljg+'<option>GCJ02_TO_WGS84</option>\n';
    bljg=bljg+'</select>\n';
    bljg=bljg+'<span class="aclick" onclick="javascript:this.parentNode.parentNode.style.display=\'none\';">Close</span> ';
    
    var postpath=postpath_b();
    bljg=bljg+'<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_gps_news" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_gps_points" id="textarea_gps_points" style="height:20rem;"></textarea>';    
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:add_current_latlng_gps_points();">添加当前点</span>';
    bljg=bljg+textarea_buttons_b('textarea_gps_points','全选,清空,复制,发送到临时记事本,发送地址')+'</p>';
    bljg=bljg+'</form>\n';    
    return bljg;
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
    var ofile=document.getElementById('input_upload_gpx').files[0];
    if (ofile.type!=='application/gpx+xml' && ofile.name.substring(ofile.name.toLowerCase().lastIndexOf('.gpx'),).toLowerCase()!=='.gpx'){
        document.getElementById('textarea_gps_points').value = '非gpx文件：'+ofile.type+'\n'+ofile.name;  
        return;
    }
    if (ofile.size>30*1024*1024){
        document.getElementById('textarea_gps_points').value = '文件太大：'+ofile.name+' '+ofile.size;  
        return;
    }
        
    var gpxFile = new FileReader();
    gpxFile.readAsText(ofile);
    gpxFile.onload = function () {
        document.getElementById('textarea_gps_points').value = this.result;
        read_gpx_gps_points(this.result,ofile.name.substring(0,ofile.name.lastIndexOf('.')));
    }
}

function draw_gpx_gps_points(cslist=false,csname='',dotransform=false,draw_lines=true,cscolors=-1){
    //cslist 须是 lat,lon 格式，形如 [ [ 30.221588, 120.024205 ], [ 30.221542, 120.024116 ] ] - 保留注释
    if (cslist===false){
        cslist=data_lines_2_latlon_gps_points('','latlon');   //返回为 lat,lon 格式 - 保留注释
    }
    if (dotransform){
        var bltype=document.getElementById('select_transform').value;
        cslist=transform_dotlines_gps_points(cslist,bltype,false);
    }
    if (draw_lines===false){
        return cslist;
    }
    //----
    if (cscolors==false || cscolors==-1){
        cscolors=colors_get_gps_points();
    }
    else {
        if (cscolors.length<3){
            cscolors=cscolors.concat([-1,-1,-1]).slice(0,3);
        }
        var blfound_list=[];
        for (let blxl=0;blxl<cscolors.length;blxl++){
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
    }
    //----
    
    navigation_layer_gps_global.addLayer(line_leaflet_b(omap_gps_points_global,true,cslist,cscolors[0],csname));
    if (cscolors[1]!==''){
        circle_gps_points(cslist[0][1]+','+cslist[0][0]+',2,'+cscolors[1],false);
    }
    if (cscolors[2]!==''){
        circle_gps_points(cslist[cslist.length-1][1]+','+cslist[cslist.length-1][0]+',2,'+cscolors[2],false);
    }
}

function transform_dotlines_gps_points(cslist=false,cstype=false,write_to_textarea=false){
    if (cslist===false){
        cslist=data_lines_2_latlon_gps_points('','latlon');   //返回为 lat,lon 格式 - 保留注释
    }
    if (cstype===false){
        cstype=document.getElementById('select_transform').value;
    }
    var bllon;
    var bllat;
    for (let blxl=0;blxl<cslist.length;blxl++){
        [bllon,bllat]=transform_lon_lat_one_dot_b(cstype,cslist[blxl][1],cslist[blxl][0]);
        cslist[blxl]=[bllat,bllon];
    }

    if (write_to_textarea){
        var list_t=[];
        for (let blxl=0;blxl<cslist.length;blxl++){
            list_t[blxl]=cslist[blxl][0]+','+cslist[blxl][1];
        }
        var otextarea=document.getElementById('textarea_gps_points');    
        otextarea.value=list_t.join('\n');
    }
    return cslist;
}

function read_gpx_gps_points(csstr,csname='',cscolors=false){
    var all_points=[];
    var list_t=csstr.split('<trk>');    //有几条线路就有几个 trk - 保留注释
    var bltype=document.getElementById('select_transform').value;
    for (let blxl=1;blxl<list_t.length;blxl++){ //忽略第1个元素 - 保留注释
        var result_list=[];
        var blname=list_t[blxl].match(/<name>(.*?)<\/name>/m);
        if (blname==null){
            blname=csname;
        }
        else if (blname.length<2){
            blname=csname;
        }
        else {
            blname=blname[1];
        }
        var bltime=list_t[blxl].match(/<time>.*?<\/time>/m);
        if (bltime!==null){
            if (bltime.length>=1){
                blname=blname+'('+bltime[0].split('T')[0].replace(new RegExp('-','g'),'')+')';  //添加日期 - 保留注释
            }
        }
        var trkpts=list_t[blxl].split('<trkpt ');
        for (let lonlat of trkpts){
            lonlat=lonlat.split('>')[0];
            if (lonlat.includes('lon=') && lonlat.includes('lat=')){
                var bllat=lonlat.split('lat=')[1].trim().split(' ')[0].replace(new RegExp(/['"]/,'g'),'');
                var bllon=lonlat.split('lon=')[1].split(' ')[0].replace(new RegExp(/['"]/,'g'),'');
                bllat=parseFloat(bllat);
                bllon=parseFloat(bllon);
                [bllon,bllat]=transform_lon_lat_one_dot_b(bltype,bllon,bllat);
                result_list.push([bllat,bllon]);
            }
        }
        all_points=all_points.concat(result_list);
        draw_gpx_gps_points(result_list,blname,false,true,cscolors);
    }
    if (klmenu_check_b('span_gpx_2_latlon',false)){
        document.getElementById('textarea_gps_points').value = all_points.join('\n');
    }
}

function generate_gps_points(){
    var blstr=document.getElementById('textarea_gps_points').value.trim();
    if (blstr.includes('\n-----\n')){
        //生成点格式1 - 保留注释
        arrays_gps_points(blstr);
    }
    else {
        //生成点格式2 - 保留注释
        lines_gps_points(blstr);   
    }
}

function arrays_gps_points(csstr){
    var list_t=('\n'+csstr+'\n').split('\n-----\n');
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
            }
            else if (arow.indexOf('GPS_GPSLongitude:')==0){
                bllon=parseFloat(arow.split('GPS_GPSLongitude:')[1].trim());
            }
            else if (arow.indexOf('EXIF_DateTimeOriginal:')==0){
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
        }
        else {
            var thecolor=colors[item[0] % (color_len-1)].split(',');
        }
        
        if (year_colors[item[0]]==null){
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

function data_lines_2_latlon_gps_points(csstr='',cstype='latlon'){
    if (csstr==''){
        csstr=document.getElementById('textarea_gps_points').value.trim();
    }
    var list_t=csstr.split('\n');
    var result_t=[];
    var bllat=0;
    var bllon=0;
    
    if (cstype==''){
        for (let item of list_t){
            item=item.split('#',1)[0].trim();   //去掉注释部分，此行可以忽略，parseFloat 会自动忽略 数字字符之后的 # 等非数字字符部分- 保留注释
            if (item==''){continue;}
            if (item.indexOf('GPS_GPSLatitude:')==0){
                bllat=parseFloat(item.split('GPS_GPSLatitude:')[1].trim());
            }
            else if (item.indexOf('GPS_GPSLongitude:')==0){
                bllon=parseFloat(item.split('GPS_GPSLongitude:')[1].trim());
            }
            if (bllat!==0 && bllon!==0){
                result_t.push([bllat,bllon]);
                bllat=0;
                bllon=0;
            }
        }
    }
    else {
        for (let item of list_t){       
            item=item.split('#',1)[0].trim(); //去掉注释部分 - 保留注释
            if (!item.includes(',')){continue;}
            
            var ll_list=item.trim().split(',');
            if (cstype=='lonlat'){
                bllon=parseFloat(ll_list[0].trim());
                bllat=parseFloat(ll_list[1].trim());
            }
            else if (cstype=='latlon'){
                bllat=parseFloat(ll_list[0].trim());            
                bllon=parseFloat(ll_list[1].trim());
            }
            if (isNaN(bllon) || isNaN(bllat)){continue;}
            result_t.push([bllat,bllon]);
        }
    }
    return result_t;
}

function lines_gps_points(csstr=''){
    if (csstr==''){
        csstr=document.getElementById('textarea_gps_points').value.trim();
    }
    result_t=data_lines_2_latlon_gps_points(csstr,'');
    
    var bltype=document.getElementById('select_transform').value;  
    var bllon;
    var bllat;
    for (let blxl=0;blxl<result_t.length;blxl++){
        [bllon,bllat]=transform_lon_lat_one_dot_b(bltype,result_t[blxl][1],result_t[blxl][0]);
        result_t[blxl]=[bllat,bllon];
    }
    
    for (let item of result_t){
        navigation_layer_gps_global.addLayer(circle_leaflet_b(omap_gps_points_global,true,item[1],item[0]));
    }
    if (result_t.length>0){
        var last_point=result_t.slice(-1)[0];
        omap_gps_points_global.panTo(new L.LatLng(last_point[0],last_point[1]));
    }
}

function circle_gps_points(csstr,dotransform=true,layertype='navigation',dopanto=true){
    //格式：lon,lat,radius,color;lon,lat,radius,color; - 保留注释
    var list_t=csstr.split(';');
    var blcolor='red';
    var bltype=document.getElementById('select_transform').value;    
    for (let item of list_t){
        var onecircle=item.split(',');
        if (onecircle.length<3){continue;}
        if (onecircle.length>=4){
            blcolor=onecircle[3];   //后者继承前者颜色 - 保留注释
        }
        var radius_list=onecircle[2].split('_');
        for (let one_radius of radius_list){
            if (one_radius.trim()==''){continue;}

            var lon = parseFloat(onecircle[0]);
            var lat  = parseFloat(onecircle[1]);
            if (dotransform){
                [lon,lat]=transform_lon_lat_one_dot_b(bltype,lon,lat);
            }
            
            var ocircle=circle_leaflet_b(omap_gps_points_global,true,lon,lat,one_radius,blcolor,'',0);
            if (layertype=='navigation'){
                navigation_layer_gps_global.addLayer(ocircle);
            }
            else if (layertype=='current'){
                current_position_layer_gps_global.addLayer(ocircle);
            }
        }
        var lon = parseFloat(onecircle[0]);
        var lat  = parseFloat(onecircle[1]);
        if (dotransform){
            [lon,lat]=transform_lon_lat_one_dot_b(bltype,lon,lat);
        }
        if (dopanto){
            omap_gps_points_global.panTo(new L.LatLng(lat,lon));
        }
    }
}

function rectangle_gps_points(csstr,dotransform=true,layertype='navigation',dopanto=true){
    //格式：lon,lat,longlinexshortline,color;lon,lat,longlinexshortline,color; - 保留注释
    var list_t=csstr.split(';');
    var blcolor='red';
    var bltype=document.getElementById('select_transform').value;  
    for (let item of list_t){
        var onerect=item.split(',');
        if (onerect.length<3){continue;}
        if (onerect.length>=4){
            blcolor=onerect[3];   //后者继承前者颜色 - 保留注释
        }
        var radius_list=onerect[2].split('_');
        for (let one_radius of radius_list){
            if (one_radius.trim()==''){continue;}
            if (!one_radius.includes('x')){
                one_radius=one_radius+'x'+one_radius;
            }
            var long_short_list=one_radius.split('x');
            var longline=parseFloat(long_short_list[0]);
            var shortline=parseFloat(long_short_list[1]);
            
            var lon = parseFloat(onerect[0]);
            var lat  = parseFloat(onerect[1]);
            if (dotransform){
                [lon,lat]=transform_lon_lat_one_dot_b(bltype,lon,lat);            
            }
            
            var orectangle=rectangle_leaflet_b(omap_gps_points_global,true,lon,lat,longline,shortline,blcolor);
            if (layertype=='navigation'){
                navigation_layer_gps_global.addLayer(orectangle);
            }
            else if (layertype=='current'){
                current_position_layer_gps_global.addLayer(orectangle);
            }            
        }

        var lon = parseFloat(onerect[0]);
        var lat  = parseFloat(onerect[1]);
        if (dotransform){
            [lon,lat]=transform_lon_lat_one_dot_b(bltype,lon,lat);           
        }
        if (dopanto){
            omap_gps_points_global.panTo(new L.LatLng(lat,lon));
        }
    }
}

function current_layer_refresh_gps_points(){
    current_position_layer_gps_global.removeFrom(omap_gps_points_global);
    current_position_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    current_position_layer_gps_global.addTo(omap_gps_points_global);
}

function current_position_gps_points(){
    if (!navigator.geolocation){
        document.getElementById('div_status').innerHTML='A Geolocation request can only be fulfilled in a secure context';
        return;
    } 
    navigator.geolocation.getCurrentPosition(
        function (position){
            var lon = position.coords.longitude;
            var lat  = position.coords.latitude;
            var bltype=document.getElementById('select_transform').value;
            [lon,lat]=transform_lon_lat_one_dot_b(bltype,lon,lat);
            
            document.getElementById('div_status').innerHTML='lat,lng: '+lat+','+lon;
            clicked_lat_lng_global=[lat,lon];
            omap_gps_points_global.panTo(new L.LatLng(lat,lon));

            current_layer_refresh_gps_points();
            current_position_layer_gps_global.addLayer(L.marker([lat,lon]));
            circle_distance_show_gps_points(lon,lat);
            if (klmenu_check_b('span_continue_position',false)){
                setTimeout(current_position_gps_points,5000);
            }
        },
        function (){
            document.getElementById('div_status').innerHTML='Unable to retrieve your location';        
        }
    );
}

function init_gps_points(){
    var window_h=document_body_offsetHeight_b();
    var odiv=document.getElementById('div_selection');
    odiv.style.maxHeight=Math.round(window_h*0.8)+'px';
    var rect =document.getElementById('div_gps_points').getBoundingClientRect();
    document.getElementById('div_map').style.height=Math.max(300,(window_h-rect.height))+'px';

    var lat_lon_value=[31.2,121.5];
    var zoom_value=12;
    var map_name_value='mapbox';

    //----------
    document.getElementById('div_icon').innerHTML='🧿';
    document.getElementById('div_status').innerHTML='GPS Points';
    document.getElementById('div_buttons').innerHTML=buttons_gps_points();
    menu_gps_points();
    
    init_maps_leaflet_b();

    omap_gps_points_global = L.map("div_map", {
        center: lat_lon_value,
        zoom: zoom_value,
        layers: [L.layerGroup([klmaps_global[map_name_value]])],
    });

    L.control.layers(baselayers_leaflet_b(), null).addTo(omap_gps_points_global);

    navigation_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    navigation_layer_gps_global.addTo(omap_gps_points_global);

    current_position_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    current_position_layer_gps_global.addTo(omap_gps_points_global);

    //-----------
    var cskeys=href_split_b(location.href);
    var bltype='';
    if (cskeys.length>0){
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
            }
            else if (item.substring(0,10)=='rectangle='){
                rectangle_gps_points(item.substring(10,));
            }
        }
    }

    omap_gps_points_global.addEventListener('click', function(ev) {
        var bltype=document.getElementById('select_transform').value;    
        var bllon;
        var bllat;
        [bllon,bllat]=transform_lon_lat_one_dot_b(bltype,ev.latlng.lng,ev.latlng.lat);
        document.getElementById('div_status').innerHTML='lat,lng: '+bllat+','+bllon;
        clicked_lat_lng_global=[bllat,bllon],
        current_layer_refresh_gps_points();
        circle_distance_show_gps_points(ev.latlng.lng,ev.latlng.lat);
       //以下2行保留注释
       //var latlon=omap_gps_points_global.getCenter();
       //document.getElementById('div_status').innerHTML=latlon["lng"]+','+latlon["lat"];
    });
}

function circle_distance_settings_gps_points(show_prompt=true){
    var default_value='100,yellow;200,cyan;300,deeppink;1000,yellow;2000,cyan;3000,deeppink';
    var blstr=local_storage_get_b('circle_distance_gps_points');
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
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=cslon+','+cslat+','+list_t[blxl];
    }
    if (klmenu_check_b('span_is_rectangle',false)){
        rectangle_gps_points(list_t.join(';'),false,'current',false);
    }
    else {
        circle_gps_points(list_t.join(';'),false,'current',false);
    }
}

function read_txt_file_gps_points(fname,cstype,cscolors=false){ 
    if (cstype=='kl'){
        var fullname='../../../../data/gpx_kl/'+fname
    }
    else {
        var fullname='../jsdata/gpx_pb/'+fname
    }
    var allText=read_txt_file_b(fullname);
    document.getElementById('textarea_gps_points').value = allText;
    read_gpx_gps_points(allText,fname,cscolors);
    show_hide_map_gps_points();
}

function show_hide_map_gps_points(hidemap=false){
    if (hidemap){
        document.getElementById('div_map').style.display='none';
        document.getElementById('div_gps_points').style.display='none';    
        document.getElementById('div_selection').style.display=''
    }
    else {
        document.getElementById('div_map').style.display='';
        document.getElementById('div_gps_points').style.display='';    
        document.getElementById('div_selection').style.display='none';    
    }
}

function gpx_file_selection_gps_points(cskeys=''){
    var csreg=false;
    var raw_key=cskeys.trim();
    if (cskeys.slice(-4,)=='(:r)'){
        csreg=true;
        cskeys=cskeys.slice(0,-4);
    }
    cskeys=cskeys.trim();
    var list_t=[];
    for (let item of gpx_pb_global){
        if (cskeys!==''){
            var blfound=str_reg_search_b(item,cskeys,csreg);
            if (blfound==-1){break;}
            if (blfound==false){continue;}       
        } 
        list_t.push('<span class="span_link" onclick="javascript:read_txt_file_gps_points(\''+item[0]+'\',\'pb\');">'+item[0]+'</span>');
    }
    for (let item of gpx_kl_global){
        if (cskeys!==''){
            var blfound=str_reg_search_b(item,cskeys,csreg);
            if (blfound==-1){break;}
            if (blfound==false){continue;}           
        }
        list_t.push('<span class="span_link" onclick="javascript:read_txt_file_gps_points(\''+item[0]+'\',\'kl\');">'+item[0]+'</span>');
    }
    gpx_file_array_2_html_gps_points(raw_key,list_t);
}

function gpx_files_batch_open_init_gps_points(){
    if (confirm('是否批量载入GPX文件？')==false){return;}
    gpx_files_batch_no_global=0;
    gpx_colors_global=colors_get_gps_points();
    gpx_files_batch_open_one_step_gps_points();
}

function gpx_files_batch_open_one_step_gps_points(){
    var ool=document.getElementById('ol_gpx_file_list');
    var olis=ool.querySelectorAll('li');
    if (gpx_files_batch_no_global>=olis.length){return;}

    var fname=olis[gpx_files_batch_no_global].innerText;
    
    var blfound=false
    for (let item of gpx_pb_global){
        if (item[0]==fname){
            read_txt_file_gps_points(item[0],'pb',gpx_colors_global);
            blfound=true;
            break;
        }
    }
    if (blfound===false){
        for (let item of gpx_kl_global){
            if (item[0]==fname){
                read_txt_file_gps_points(item[0],'kl',gpx_colors_global);
                blfound=true;
                break;
            }
        }
    }
    gpx_files_batch_no_global=gpx_files_batch_no_global+1;
    setTimeout(gpx_files_batch_open_one_step_gps_points,1000);
}

function filter_gpx_list_gps_points(cstype){
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

function gpx_quadrangle_gps_points(){
    function sub_gpx_quadrangle_gps_points_draw(fname,gpx_point,do_transform,line_color){
        var result_t=[];

        var min_lat=gpx_point[0][0];
        var min_lon=gpx_point[0][1];        
        
        for (let one_range of gpx_point){
            result_t=[];
            min_lat=one_range[0];
            min_lon=one_range[1];
            var max_lat=one_range[2];
            var max_lon=one_range[3];
            result_t.push([min_lat,min_lon]);
            result_t.push([min_lat, max_lon]);
            result_t.push([max_lat, max_lon]);
            result_t.push([max_lat, min_lon]);
            result_t.push([min_lat,min_lon]);
            draw_gpx_gps_points(result_t,file_path_name_b(fname)[1],do_transform,true,[line_color,'','']);    
        }
        return [min_lat,min_lon];
    }
    //---------------
    var li_names=new Set();
    var olis=document.querySelectorAll('ol#ol_gpx_file_list li');
    for (let item of olis){
        li_names.add(item.innerText);
    }
    var do_transform=(document.getElementById('select_transform').value!=='');
    
    var lat;
    var lon;
    var line_color=colors_get_gps_points()[0];

    for (let item of gpx_pb_global){//gpxfilename,fsize,fdate,min_lat,min_lon,max_lat,max_lon
        if (!li_names.has(item[0])){continue;}        
        [lat,lon]=sub_gpx_quadrangle_gps_points_draw(item[0],item[3],do_transform,line_color);
    }
    for (let item of gpx_kl_global){
        if (!li_names.has(item[0])){continue;}          
        [lat,lon]=sub_gpx_quadrangle_gps_points_draw(item[0],item[3],do_transform,line_color);
    }
    show_hide_map_gps_points();
    omap_gps_points_global.panTo(new L.LatLng(lat,lon));
}

function gpx_file_array_2_html_gps_points(cskeys,cslist){
    var buttons='<p><input type="text" id="input_gpx_search" value="'+cskeys+'" onkeyup="javascript:if (event.key==\'Enter\'){gpx_file_selection_gps_points(this.value);}"> ';
    buttons=buttons+'<span class="aclick" onclick="javascript:show_hide_map_gps_points();">返回</span> ';
    buttons=buttons+'当前条件下：<span class="aclick" onclick="javascript:gpx_near_gps_points();">离当前点最近的gpx文件</span> ';    
    buttons=buttons+'<span class="aclick" onclick="javascript:gpx_quadrangle_gps_points();">gpx文件范围示意</span> ';  
    buttons=buttons+'<span class="aclick" onclick="javascript:gpx_files_batch_open_init_gps_points();">gpx文件批量载入</span> ';
    buttons=buttons+'<span class="aclick" onclick="javascript:filter_gpx_list_gps_points(\'reverse\');">倒转</span> ';    
    buttons=buttons+'<span class="aclick" onclick="javascript:filter_gpx_list_gps_points(\'slice\');">截取</span> ';    

    buttons=buttons+'</p>';
    buttons=buttons+'<div id="div_recent_gpx_sreach"></div>';
    
    var odiv=document.getElementById('div_selection');
    odiv.innerHTML=buttons+array_2_li_b(cslist,'li','ol','ol_gpx_file_list');
    input_with_x_b('input_gpx_search',15);
    
    recent_search_b('recent_search_gpx_gps_points',cskeys,'gpx_file_selection_gps_points','div_recent_gpx_sreach',["西湖"],20);
    show_hide_map_gps_points(true);
}

function gpx_near_gps_points(){
    function sub_gpx_near_gps_points_min_distance(current_point,gpx_point){
        var distance_list=[];
        for (let one_range of gpx_point){
            var min_lat=one_range[0];
            var min_lon=one_range[1];
            var max_lat=one_range[2];
            var max_lon=one_range[3];
            distance_list.push(distance_leaflet_b(current_point[0], current_point[1],min_lat, min_lon));
            distance_list.push(distance_leaflet_b(current_point[0], current_point[1],max_lat, max_lon));
            distance_list.push(distance_leaflet_b(current_point[0], current_point[1],min_lat, max_lon));
            distance_list.push(distance_leaflet_b(current_point[0], current_point[1],max_lat, min_lon));
        }
        return Math.min(...distance_list);
    }
    //------------------------------------------
    var t0 = performance.now();

    if (clicked_lat_lng_global.length!==2){return;}

    var li_names=new Set();
    var olis=document.querySelectorAll('ol#ol_gpx_file_list li');
    for (let item of olis){
        li_names.add(item.innerText);
    }
    
    var result_t=[];
    for (let item of gpx_pb_global){//gpxfilename,fsize,fdate,min_lat,min_lon,max_lat,max_lon
        if (!li_names.has(item[0])){continue;}        
        result_t.push([item[0],sub_gpx_near_gps_points_min_distance(clicked_lat_lng_global,item[3]),'pb']);
    }

    for (let item of gpx_kl_global){
        if (!li_names.has(item[0])){continue;}            
        result_t.push([item[0],sub_gpx_near_gps_points_min_distance(clicked_lat_lng_global,item[3]),'kl']);
    }
    result_t.sort(function (a,b){return a[1]>b[1];});
    
    var span_list=[];
    for (let item of result_t){
        span_list.push('<span class="span_link" onclick="javascript:read_txt_file_gps_points(\''+item[0]+'\',\''+item[2]+'\');">'+item[0]+'</span>');
    }

    gpx_file_array_2_html_gps_points('',span_list);
    console.log('gpx_near_gps_points() 费时：'+(performance.now() - t0) + " milliseconds");    
}

function lonlat_2_latlon_gps_points(){
    var otextarea=document.getElementById('textarea_gps_points');
    var result_t=[];
    var list_t=otextarea.value.trim().split('\n');
    for (let item of list_t){
        var blat=item.indexOf('#');
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

function latlon_2_gpx_gps_points(){
    var cslist=data_lines_2_latlon_gps_points('','latlon'); //返回结果数组每一个元素都是 [lat,lon] 格式 - 保留注释
    for (let blxl=0;blxl<cslist.length;blxl++){
        cslist[blxl]='<trkpt lat="'+cslist[blxl][0]+'" lon="'+cslist[blxl][1]+'"></trkpt>';
    }

    var bljg='<?xml version="1.0" encoding="UTF-8"?>\n';
    bljg=bljg+'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="JavaScript">\n';
    bljg=bljg+'<trk><name>JavaScript_'+date2str_b()+'</name>\n';
    bljg=bljg+'<trkseg>\n';
    bljg=bljg+cslist.join('\n');
    bljg=bljg+'</trkseg>\n</trk>\n</gpx>\n'
    document.getElementById('textarea_gps_points').value=bljg;
}

function remove_navigation_gps_points(){
    navigation_layer_gps_global.removeFrom(omap_gps_points_global);
    navigation_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    navigation_layer_gps_global.addTo(omap_gps_points_global);
}

function gpx_from_textarea_gps_points(){
    var blstr=document.getElementById('textarea_gps_points').value;
    read_gpx_gps_points(blstr,'');
}

function district_gps_points(cskeys=false){
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
        var blfound=str_reg_search_b(item.toString(),cskeys,csreg); //便于使用,1,找出地级市 等 - 保留注释
        if (blfound==-1){break;}
        if (blfound==false){continue;}       
        
        result_t.push(item[6]+','+item[5]+'#'+item[4]);
    }    
    document.getElementById('textarea_gps_points').value=result_t.join('\n');
}

function batch_2points_distance_list_gps_points(){
    var otextarea=document.getElementById('textarea_gps_points');
    var list_t=otextarea.value.trim().split('\n');
    var blmemo;
    var lat;
    var lng;
    var result_t=[];
    for (let item of list_t){
        blmemo='';
        var blat=item.indexOf('#');
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
            memo_str=memo_list.join('#')
            if (memo_set.has(memo_str)){continue;}
            memo_set.add(memo_str);
            
            distance_list.push([distance_leaflet_b(item_a[0], item_a[1], item_b[0], item_b[1])/1000,memo_list]);
        }    
    }
    distance_list.sort(function (a,b){return a[0]>b[0];});
    for (let blxl=0;blxl<distance_list.length;blxl++){
        distance_list[blxl]='<p>'+(blxl+1)+'. '+distance_list[blxl][1].join('——')+': '+distance_list[blxl][0].toFixed(2)+'公里</p>';
    }
    var blbuttons='<p><span class="aclick" onclick="javascript:document.getElementById(\'divhtml\').innerHTML=\'\';">Close</p>';
    document.getElementById('divhtml').innerHTML=distance_list.join('\n')+blbuttons;    //用 li 排序 会很慢 - 保留注释
}

function menu_gps_points(){
    var str_t=klmenu_hide_b('');
    var klmenu_gpx=[];    
    if (document.location.href.substring(0,5).toLowerCase()!=='file:'){
        klmenu_gpx.push('<span class="span_menu" onclick="javascript:'+str_t+'gpx_file_selection_gps_points();">选择GPX文件</span>');
    }
    klmenu_gpx=klmenu_gpx.concat([
    '<span class="span_menu" onclick="javascript:'+str_t+'remove_navigation_gps_points();">清除路线</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'gpx_from_textarea_gps_points();">从编辑框显示GPX图形</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'latlon_2_gpx_gps_points();">纬度,经度格式生成GPX文件</span>',
    '<span id="span_gpx_2_latlon" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);">⚪ 转换gpx为纬度,经度点</span>',    
    ]);
    
    var klmenu_dots=[
    '<span class="span_menu" onclick="javascript:'+str_t+'lonlat_2_latlon_gps_points();">经度,纬度前后调换</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'draw_gpx_gps_points(false,\'\',true);">纬度,经度格式生成线条</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'transform_dotlines_gps_points(false,false,true);">纬度,经度格式坐标转换</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'generate_gps_points();">生成点</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'baidu_data_transform_gps_points(\'BD09_TO_WGS84\');">百度 经度 纬度,经度 纬度;经度 纬度 格式转换为WGS84</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'baidu_data_transform_gps_points(\'BD09_TO_GCJ02\');">百度 经度 纬度,经度 纬度;经度 纬度 格式转换为GCJ02</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'lng_lat_gps_points();">经度 纬度,经度 纬度;经度 纬度 格式生成线条</span>',
    ];

    var klmenu_district=[
        '<span class="span_menu" onclick="javascript:'+str_t+'district_gps_points();">地区坐标搜索</span>',
        '<span class="span_menu" onclick="javascript:'+str_t+'district_gps_points(\',1,\');">地级及以上城市</span>',
        '<span class="span_menu" onclick="javascript:'+str_t+'batch_2points_distance_list_gps_points();">两两坐标距离排序</span>',
    ];
    
    var klmenu_config=[
    '<span class="span_menu" onclick="javascript:'+str_t+'help_gps_points();">Help</span>',
    '<span id="span_continue_position" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);current_position_gps_points();">⚪ 持续定位</span>',    
    '<span id="span_show_circle" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);current_layer_refresh_gps_points();">⚪ 显示距离圈</span>',
    '<span id="span_is_rectangle" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);">⚪ 方形距离圈</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'circle_distance_settings_gps_points();">距离圈设置</span>',   
    '<span id="span_colors_gps_points" class="span_menu" onclick="javascript:'+str_t+'colors_settings_gps_points();">线条颜色：blue,cyan,red</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'alarm_interval_set_b(0);">整点报时</span>',
    '<span class="span_menu" onclick="javascript:'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'gps_points\');}">更新版本</span>',
    ];
    document.getElementById('input_upload_gpx').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_gpx,'⛰','16rem','1rem','1rem','60rem')+klmenu_b(klmenu_dots,'','28rem','1rem','1rem','60rem')+klmenu_b(klmenu_district,'📍','16rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function colors_get_gps_points(){
    var ospan=document.getElementById('span_colors_gps_points');
    if (!ospan){return ['','',''];}
    var old_value=ospan.innerText;
    var blat=old_value.indexOf('：');
    if (blat<0){return ['','',''];}
    old_value=old_value.substring(blat+1,);
    var list_t=old_value.split(',').concat(['','','']).slice(0,3);  //补充颜色设置为3个元素 - 保留注释
    
    return list_t;
}

function colors_settings_gps_points(){
    var ospan=document.getElementById('span_colors_gps_points');
    if (!ospan){return;}

    var old_value=colors_get_gps_points().join(',');
    var new_value=(prompt('输入颜色，输入 默认 则返回默认值：',old_value) || '').trim();
    if (new_value==''){
        return;
    }
    new_value=new_value.replace(new RegExp(/[，\s]/,'g'),',');
    var list_t=new_value.split(',');
    new_value=[];
    for (let item of list_t){
        if (item==''){continue;}
        new_value.push(item);
    }
    new_value=new_value.join(',');
    if (new_value=='默认'){
        new_value='blue,cyan,red';
    }
    ospan.innerText='线条颜色：'+new_value;
}

function baidu_data_transform_gps_points(cstype){
    var otextarea=document.getElementById('textarea_gps_points');
    var list_t=transform_lng_lat_dots_b(otextarea.value,cstype);
    var result_t=[];
    for (let one_line of list_t){
        for (let blxl=0;blxl<one_line.length;blxl++){
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
    for (let one_line of list_t){
        if (one_line.length==0){continue;}    
        for (let blxl=0;blxl<one_line.length;blxl++){
            one_line[blxl]=[one_line[blxl][1],one_line[blxl][0]];
        }
        draw_gpx_gps_points(one_line,'',true);
        
        var last_point=transform_dotlines_gps_points(one_line.slice(-1),bltype,false);
        omap_gps_points_global.panTo(new L.LatLng(last_point[0][0],last_point[0][1]));
    }
}
