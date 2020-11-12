function show_hide_textarea_gps_points(){
    var obuttons=document.getElementById('div_buttons');
    if (obuttons.style.display=='none'){
        obuttons.style.display='block';
    }
    else {
        obuttons.style.display='none';
    }
}

function buttons_gps_points(){
    var bljg='<input type="file" id="input_upload_gpx"> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:upload_gpx_gps_points();">Upload GPX File</span> ';
    bljg=bljg+'<select id="select_transform" style="max-width:5rem;">\n';
    bljg=bljg+'<option></option>\n';
    bljg=bljg+'<option>WGS84_TO_GCJ02</option>\n';
    bljg=bljg+'<option>GCJ02_TO_WGS84</option>\n';
    bljg=bljg+'</select>\n';
    bljg=bljg+'<span class="aclick" onclick="javascript:this.parentNode.parentNode.style.display=\'none\';">Close</span> ';
    bljg=bljg+'<textarea id="textarea_gps_points" style="height:20rem;"></textarea>';
    return bljg;
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

function draw_gpx_gps_points(cslist=false,csname='',dotransform=false,draw_lines=true){
    //cslist 须是 lat,lon 格式 - 保留注释
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
    navigation_layer_gps_global.addLayer(line_leaflet_b(omap_gps_points_global,true,cslist,'blue',csname));
    circle_gps_points(cslist[0][1]+','+cslist[0][0]+',2,green',false);
    circle_gps_points(cslist[cslist.length-1][1]+','+cslist[cslist.length-1][0]+',2,red',false);
}

function transform_lon_lat_gps_points(cstype,lon,lat){
    cstype=cstype.toUpperCase();
    if (['WGS84_TO_GCJ02','W2G','WTOG','WG'].includes(cstype)){
        [lon,lat]=wgs84togcj02_b(lon, lat);
    }
    else if (['GCJ02_TO_WGS84','G2W','GTOW','GW'].includes(cstype)){
        [lon,lat]=gcj02towgs84_b(lon, lat);
    }
    return [lon,lat];
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
        [bllon,bllat]=transform_lon_lat_gps_points(cstype,cslist[blxl][1],cslist[blxl][0]);
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

function read_gpx_gps_points(csstr,csname=''){
    var all_points=[];
    var list_t=csstr.split('<trk>');
    var bltype=document.getElementById('select_transform').value;
    for (let blxl=1;blxl<list_t.length;blxl++){
        var result_list=[];
        var trkpts=list_t[blxl].split('<trkpt ');
        for (let lonlat of trkpts){
            lonlat=lonlat.split('>')[0];
            if (lonlat.includes('lon=') && lonlat.includes('lat=')){
                var bllat=lonlat.split('lat=')[1].trim().split(' ')[0].replace(new RegExp(/['"]/,'g'),'');
                var bllon=lonlat.split('lon=')[1].split(' ')[0].replace(new RegExp(/['"]/,'g'),'');
                bllat=parseFloat(bllat);
                bllon=parseFloat(bllon);
                [bllon,bllat]=transform_lon_lat_gps_points(bltype,bllon,bllat);
                result_list.push([bllat,bllon]);
            }
        }
        all_points=all_points.concat(result_list);
        draw_gpx_gps_points(result_list,csname);
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
            [bllon,bllat]=transform_lon_lat_gps_points(bltype,bllon,bllat);        
            
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
            item=item.trim();
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
        [bllon,bllat]=transform_lon_lat_gps_points(bltype,result_t[blxl][1],result_t[blxl][0]);
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
                [lon,lat]=transform_lon_lat_gps_points(bltype,lon,lat);
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
            [lon,lat]=transform_lon_lat_gps_points(bltype,lon,lat);
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
                [lon,lat]=transform_lon_lat_gps_points(bltype,lon,lat);            
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
            [lon,lat]=transform_lon_lat_gps_points(bltype,lon,lat);           
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
    if (!navigator.geolocation) {
        document.getElementById('div_status').innerHTML='A Geolocation request can only be fulfilled in a secure context';
        return;
    } 
    navigator.geolocation.getCurrentPosition(function (position){
        var lon = position.coords.longitude;
        var lat  = position.coords.latitude;
        var bltype=document.getElementById('select_transform').value;
        [lon,lat]=transform_lon_lat_gps_points(bltype,lon,lat);
        
        document.getElementById('div_status').innerHTML=' lng: '+lon+', lat: '+lat;
        omap_gps_points_global.panTo(new L.LatLng(lat,lon));

        current_layer_refresh_gps_points();
        current_position_layer_gps_global.addLayer(L.marker([lat,lon]));
        circle_distance_show_gps_points(lon,lat);
    },
    function (){
        document.getElementById('div_status').innerHTML='Unable to retrieve your location';        
    }
    );
}

function init_gps_points(){
    var window_h=document_body_offsetHeight_b();
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
        document.getElementById('div_status').innerHTML=' lng: '+ev.latlng.lng+', lat: '+ev.latlng.lat;
        current_layer_refresh_gps_points();        
        circle_distance_show_gps_points(ev.latlng.lng,ev.latlng.lat);
       //以下2行保留注释
       //var latlon=omap_gps_points_global.getCenter();
       //document.getElementById('div_status').innerHTML=latlon["lng"]+','+latlon["lat"];
    });
}

function circle_distance_settings_gps_points(show_prompt=true){
    var default_value='100,blue;200,green;300,red;1000,blue;2000,green;3000,red';
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

function read_txt_file_gps_points(fname,cstype){ 
    if (cstype=='kl'){
        var fullname='../../../../data/gpx_kl/'+fname
    }
    else {
        var fullname='../jsdata/gpx_pb/'+fname
    }
    var allText=read_txt_file_b(fullname);
    document.getElementById('textarea_gps_points').value = allText;
    read_gpx_gps_points(allText,fname);
    show_hide_map_gps_points();
}

function show_hide_map_gps_points(hidemap=false){
    if (hidemap){
        document.getElementById('div_map').style.display='none';
        document.getElementById('div_gps_points').style.display='none';    
        document.getElementById('div_gpx_file_selection').style.display=''
    }
    else {
        document.getElementById('div_map').style.display='';
        document.getElementById('div_gps_points').style.display='';    
        document.getElementById('div_gpx_file_selection').style.display='none';    
    }
}

function gpx_file_selection_gps_points(){
    var odiv=document.getElementById('div_gpx_file_selection');
    if (odiv.innerHTML==''){
        var list_t=[];
        for (let item of gpx_pb_global){
            list_t.push('<span class="span_link" onclick="javascript:read_txt_file_gps_points(\''+item+'\',\'pb\');">'+item+'</span>');
        }
        for (let item of gpx_kl_global){
            list_t.push('<span class="span_link" onclick="javascript:read_txt_file_gps_points(\''+item+'\',\'kl\');">'+item+'</span>');
        }
        var buttons='<span class="aclick" onclick="javascript:show_hide_map_gps_points();">返回</span>';
        odiv.innerHTML='<p>'+buttons+'</p>'+array_2_li_b(list_t);
    }
    show_hide_map_gps_points(true);
}

function lonlat_2_latlon_gps_points(){
    var otextarea=document.getElementById('textarea_gps_points');
    var result_t=[];
    var list_t=otextarea.value.trim().split('\n');
    for (let item of list_t){
        var temp_list=item.split(',');
        if (temp_list.length==2){
            result_t.push(temp_list[1].trim()+','+temp_list[0].trim());
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

function menu_gps_points(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];    
    if (document.location.href.substring(0,5).toLowerCase()!=='file:'){
        klmenu1.push('<span class="span_menu" onclick="javascript:'+str_t+'gpx_file_selection_gps_points();">选择GPX文件</span>');
    }
    klmenu1.push('<span class="span_menu" onclick="javascript:'+str_t+'remove_navigation_gps_points();">清除路线</span>');    
    klmenu1.push('<span class="span_menu" onclick="javascript:'+str_t+
    'lonlat_2_latlon_gps_points();">经度,纬度前后调换</span>');
    klmenu1.push('<span class="span_menu" onclick="javascript:'+str_t+'draw_gpx_gps_points(false,\'\',true);">纬度,经度格式生成线条</span>');   
    klmenu1.push('<span class="span_menu" onclick="javascript:'+str_t+'transform_dotlines_gps_points(false,false,true);">纬度,经度格式坐标转换</span>');    
    klmenu1.push('<span class="span_menu" onclick="javascript:'+str_t+'latlon_2_gpx_gps_points();">纬度,经度格式生成GPX文件</span>');    
    klmenu1.push('<span class="span_menu" onclick="javascript:'+str_t+'generate_gps_points();">生成点</span>');    

    var klmenu2=[
    '<span class="span_menu" onclick="javascript:'+str_t+'help_gps_points();">Help</span>',
    '<span id="span_gpx_2_latlon" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);">⚪ 转换gpx为纬度,经度点</span>',
    '<span id="span_show_circle" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);current_layer_refresh_gps_points();">⚪ 显示距离圈</span>',
    '<span id="span_is_rectangle" class="span_menu" onclick="javascript:'+str_t+'klmenu_check_b(this.id);">⚪ 方形距离圈</span>',        
    '<span class="span_menu" onclick="javascript:'+str_t+'circle_distance_settings_gps_points();">距离圈设置</span>',        
    ];
    document.getElementById('input_upload_gpx').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','16rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','16rem','1rem','1rem','60rem'),'','0rem')+' ');
}
