function baselayers_leaflet_b(cstype=''){
    switch (cstype){
        case 'simple':
            return {
                '高德地图': L.layerGroup([klmaps_global['gd']]),
                '高德地形(无路网)': L.layerGroup([klmaps_global['gd_earth']]),
                'OSM': L.layerGroup([klmaps_global['osm']]),                
            }            
            break;
        case 'gd':
            return {
                '高德地图': L.layerGroup([klmaps_global['gd']]),
                '高德地形(无路网)': L.layerGroup([klmaps_global['gd_earth']]),
            }            
            break;            
        default:
            return {
                'mapbox': L.layerGroup([klmaps_global['mapbox']]),
                'OSM': L.layerGroup([klmaps_global['osm']]),
                'Google': L.layerGroup([klmaps_global['google']]),
                'Google 地形': L.layerGroup([klmaps_global['google_earth']]),
                'Geoq': L.layerGroup([klmaps_global['geoq']]),
                'Geoq_PurplishBlue': L.layerGroup([klmaps_global['geoq_PurplishBlue']]),
                'geoq_Gray': L.layerGroup([klmaps_global['geoq_Gray']]),
                'geoq_Warm': L.layerGroup([klmaps_global['geoq_Warm']]),
                'geoq_Hydro': L.layerGroup([klmaps_global['geoq_Hydro']]),
                '高德地图': L.layerGroup([klmaps_global['gd']]),
                '高德地形(无路网)': L.layerGroup([klmaps_global['gd_earth']]),
                '高德路网': L.layerGroup([klmaps_global['gd_road']]),
            }
            break;
    }
}

function init_maps_leaflet_b(csmax=18,csmin=5){
    klmaps_global=[];
    klmaps_global['mapbox']=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 30,
        minZoom: 0,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoid3k3MzA1ZSIsImEiOiJjazJuMG9laTEwMWJqM2xtenZ2eXduMHdtIn0.yh0uJghsB8Ci-Kd2Scy_wA'
    });

    klmaps_global["gd"] = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global["gd_earth"] = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global["gd_road"] = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {maxZoom: 18,minZoom: 5});
    
    klmaps_global["osm"] = L.tileLayer.chinaProvider('OSM.Normal.Map', {maxZoom: 18,minZoom: 5});

    klmaps_global["google"] = L.tileLayer.chinaProvider('Google.Normal.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global["google_earth"] = L.tileLayer.chinaProvider('Google.Satellite.Map', {maxZoom: 18,minZoom: 5});

    klmaps_global["geoq"] = L.tileLayer.chinaProvider('Geoq.Normal.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global["geoq_PurplishBlue"] = L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', {maxZoom: 18,minZoom: 5});
    klmaps_global["geoq_Gray"] = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {maxZoom: 18,minZoom: 5});
    klmaps_global["geoq_Warm"] = L.tileLayer.chinaProvider('Geoq.Normal.Warm', {maxZoom: 18,minZoom: 5});
    klmaps_global["geoq_Hydro"] = L.tileLayer.chinaProvider('Geoq.Theme.Hydro', {maxZoom: 18,minZoom: 5});
}

function rectangle_leaflet_b(csomap,islayer=false,cslon=121.5,cslat=31.2,longline=1000,shortline=500,cscolor='red'){
    var list_t=rectangle_xy_leaflet_b(cslat,cslon,longline/2,shortline/2);
    return line_leaflet_b(csomap,islayer,list_t,cscolor,'');
}

function circle_leaflet_b(csomap,islayer=false,cslon=121.5,cslat=31.2,csradius=10,cscolor='red',csfillcolor='#f03',csfillopacity=0.5){
    var circle = L.circle([cslat,cslon], {
        color: cscolor,
        fillColor: csfillcolor,
        fillOpacity: csfillopacity,
        radius: csradius
    });
    if (islayer){
        return circle;
    }
    else {
        circle.addTo(csomap);
    }
}

function line_leaflet_b(csomap,islayer=false,cslist,cscolor='red',cscaption=''){
    //[[lat,lon],[lat,lon]] - 保留注释
    if (cslist.length==0){return;}
    
    var polyline = L.polyline(cslist, {color: cscolor});
    var bllen=0;
    for (let blno=1;blno<cslist.length;blno++){
        var latlng1 = L.latLng(cslist[blno-1][0], cslist[blno-1][1]);
        var latlng2 = L.latLng(cslist[blno][0], cslist[blno][1]);
        bllen=bllen+latlng1.distanceTo(latlng2);
    }
    var blstr='';
    if (bllen>500){
        blstr=(bllen/1000).toFixed(2)+' km';
    }
    else {
        blstr=bllen.toFixed(2)+' m';
    }
    
    var restore_type='';
    var oselect=document.getElementById('select_transform');    //line_leaflet_b
    if (oselect){
        restore_type=oselect.value;
    }
    else if (typeof gps_tranform_type_global !== 'undefined'){
        restore_type=gps_tranform_type_global;
    }
    
    switch (restore_type){
        case 'WGS84_TO_GCJ02':
            restore_type='GCJ02_TO_WGS84';
            break;
        case 'GCJ02_TO_WGS84':
            restore_type='WGS84_TO_GCJ02';
            break;
    }
    
    if (cscaption==''){
        cscaption=cslist[0]+'_'+cslist[cslist.length-1];
    }
    
    blstr='<span style="word-break:break-all;">'+cscaption+' '+blstr+' <span style="cursor:pointer;" onclick="data_2_gpx_file_leaflet_b(\''+restore_type+'\',this);">⬇</span></span>';
    
    polyline.bindPopup(blstr);
    
    polyline.on('click', (e) => {
        gpx_current_geometry_data_global=e.target.getLatLngs(); //全局变量 - 保留注释
    });
    
    if (islayer){
        return polyline;
    }
    else {
        polyline.addTo(csomap);
    }
}

function distance_leaflet_b(lat1, lng1, lat2, lng2){    
    var radLat1 = rad_leaflet_b(lat1);
    var radLat2 = rad_leaflet_b(lat2);
    var a = radLat1 - radLat2;
    var b = rad_leaflet_b(lng1) - rad_leaflet_b(lng2);
    
    var tmp1=Math.pow(Math.sin(a/2),2);
    var tmp2=Math.pow(Math.sin(b/2),2);
    
    //球面距离公式???
    var distance = 2 * Math.asin(Math.sqrt(tmp1 + Math.cos(radLat1)*Math.cos(radLat2)*tmp2));
    distance = distance * earth_radius_leaflet_b()*1000;
    return distance;
}

function rad_leaflet_b(d) {
    return d*Math.PI/180.0;
}

function earth_radius_leaflet_b(){ 
    return 6378.137;
}

function get_y_leaflet_b(lat1,lng1,s_len,lat2){
    s_len=s_len/1000;
    s_len=s_len/earth_radius_leaflet_b();
    s_len=s_len/2;
    s_len=Math.sin(s_len);
    s_len=s_len**2;

    radLat1 = rad_leaflet_b(lat1);
    radLat2 = rad_leaflet_b(lat2);
    a = radLat1 - radLat2;
    tmp1=Math.pow(Math.sin(a/2),2);

    s_len=s_len-tmp1;
    s_len=s_len/Math.cos(radLat1);
    s_len=s_len/Math.cos(radLat2);

    s_len=Math.sqrt(s_len);
    s_len=Math.asin(s_len);
    s_len=s_len*2;
    s_len=rad_leaflet_b(lng1)-s_len;
    s_len=s_len*180/Math.PI;
    
    return s_len;
}

function get_x_leaflet_b(lat1, radius){
    radius=radius/1000;
    radius=radius/earth_radius_leaflet_b();
    lat2=(rad_leaflet_b(lat1)-radius)*180.0/Math.PI;
    return lat2;
}

function rectangle_xy_leaflet_b(lat1,lng1,longline_half,shortline_half){
    x2=get_x_leaflet_b(lat1,shortline_half);
    y2=get_y_leaflet_b(lat1,lng1,longline_half,lat1);

    bllist=[[x2,y2]];
    
    bllist.push([x2,2*lng1-y2]);
    bllist.push([2*lat1-x2,2*lng1-y2]);
    bllist.push([2*lat1-x2,y2]);
    
    bllist.push([x2,y2]);
    return bllist;
}

function gcj02towgs84_b(lng, lat){
    //GCJ02(火星坐标系)转GPS84
    //lng:火星坐标系的经度
    //lat:火星坐标系纬度
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    
    if (out_of_china_b(lng, lat)){
        return [lng, lat];
    }
    else {
        var dlat = transformlat_b(lng - 105.0, lat - 35.0);
        var dlng = transformlng_b(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
}

function wgs84togcj02_b(lng, lat){
    //WGS84转GCJ02(火星坐标系)
    //lng:WGS84坐标系的经度
    //lat:WGS84坐标系的纬度
    var PI = 3.1415926535897932384626;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;
    
    if (out_of_china_b(lng, lat)) {
        return [lng, lat];
    } 
    else {
        var dlat = transformlat_b(lng - 105.0, lat - 35.0);
        var dlng = transformlng_b(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return [mglng, mglat];
    }
}

function bd09togcj02_b(bd_lng, bd_lat) {
    //百度坐标系 (BD-09) 转 火星坐标系 (GCJ-02)
    var bd_lng = +bd_lng;
    var bd_lat = +bd_lat;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat];
}

function gcj02tobd09_b(lng, lat) {
    //火星坐标系 (GCJ-02) 转百度坐标系 (BD-09) 
    var lng = +lng;
    var lat = +lat;
    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat];
}

function wgs84tobd09_b(lng, lat){
    //WGS84 转百度坐标系 (BD-09) 
    [lng, lat]=wgs84togcj02_b(lng,lat);
    return gcj02tobd09_b(lng,lat);
}

function bd09towgs84_b(lng, lat){
    //百度坐标系 (BD-09) 转 WGS84
    [lng, lat]=bd09togcj02_b(lng,lat);
    return gcj02towgs84_b(lng,lat);
}
  
function out_of_china_b(lng, lat) {
    // 纬度 3.86~53.55, 经度 73.66~135.05 
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
}

function transformlng_b(lng, lat){
    var PI = 3.1415926535897932384626;
    var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
    return ret;
}

function transformlat_b(lng, lat){
    var PI = 3.1415926535897932384626;
    var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
    return ret;
}

function transform_lng_lat_dots_b(csstr,cstype=''){
    var list_t=csstr.trim().replace(/\r\n/mg,'\n').replace(/\n/mg,';').split(';');
    var result_t=[];
    for (let aline of list_t){
        var line_t=[];
        var line_dots=aline.split(',');
        for (let one_lng_lat of line_dots){
            one_lng_lat=one_lng_lat.trim().split(' ');
            if (one_lng_lat.length!==2){continue;}
            [lon_value,lat_value]=one_lng_lat;
            if (cstype!==''){
                [lon_value,lat_value]=transform_lon_lat_one_dot_b(cstype,lon_value,lat_value);
            }
            line_t.push([lon_value,lat_value]);
        }
        if (line_t.length>0){
            result_t.push(line_t);
        }
    }
    return result_t;
}

function transform_lon_lat_one_dot_b(cstype,lon,lat){
    cstype=cstype.toUpperCase();
    switch (cstype){
        case 'WGS84_TO_GCJ02':
        case 'W2G':
        case 'WTOG':
        case 'WG':
            [lon,lat]=wgs84togcj02_b(lon, lat);
            break;
        case 'GCJ02_TO_WGS84':
        case 'G2W':
        case 'GTOW':
        case 'GW':
            [lon,lat]=gcj02towgs84_b(lon, lat);
            break;
        case 'BD09_TO_GCJ02':
        case 'B2G':
        case 'BTOG':
        case 'BG':
            [lon,lat]=bd09togcj02_b(lon, lat);
            break;        
        case 'BD09_TO_WGS84':
        case 'B2W':
        case 'BTOW':
        case 'BW':
            [lon,lat]=bd09towgs84_b(lon, lat);
            break;
        case 'GCJ02_TO_BD09':
        case 'G2B':
        case 'GTOB':
        case 'GB':
            [lon,lat]=gcj02tobd09_b(lon, lat);
            break;
        case 'WGS84_TO_BD09':
        case 'W2B':
        case 'WTOB':
        case 'WB':
            [lon,lat]=wgs84tobd09_b(lon, lat);
            break;        
    }
    return [lon,lat];
}

function district_cn_name_2_lnglat_b(csname){
    //需要载入 district_cn_geo_global - 保留注释
    var exact_lnglat=[];
    var similar1_list=[];
    var similar2_list=[];
    for (let item of district_cn_geo_global){
        if (item[4]==csname){
            exact_lnglat=item.slice(-2,);
            break;
        }
        else if (item[3]==csname){
            similar1_list.push(item.slice(-2,));
        }
        else if (item[3].includes(csname) || item[4].includes(csname)){
            similar2_list.push(item.slice(-2,));
        }        
    }
    if (exact_lnglat.length>0){
        return exact_lnglat;
    }
    else if (similar1_list.length==1){
        return similar1_list[0];
    }
    else if (similar1_list.length==0 && similar2_list.length==1){
        return similar2_list[0];
    }
    else {
        return [false,false];
    }
}

function district_cn_level_b(level=2){
    //依赖 district_cn_geo_global - 保留注释
    var result_t=[];
    for (let item of district_cn_geo_global){
        if (item[2]==level){
            result_t.push(item[4]);
        }
    }
    var nationality=/(.{2})(蒙古|藏|苗|壮|回|维吾尔|彝|布依|朝鲜|侗|白|哈尼|傣|傈僳|畲|拉祜|满|瑶|土家|哈萨克|黎|佤|高山|水|东乡|景颇|土|仫佬|布朗|毛南|锡伯|普米|纳西|柯尔克孜|达斡尔|羌|撒拉|仡佬|阿昌|塔吉克|怒|俄罗斯|德昂|裕固|塔塔尔|鄂伦春|门巴|基诺|乌孜别克|鄂温克|保安|京|独龙|赫哲|珞巴|各)(族|自治).*$/;    //有一个 各族 - 保留注释
    for (let blxl=0;blxl<result_t.length;blxl++){
        var list_t=result_t[blxl].split(' ');
        for (let blno=0;blno<list_t.length;blno++){
            if (list_t[blno].match(nationality)!==null){
                list_t[blno]=list_t[blno].replace(new RegExp(nationality,'g'),'$1');
            }
            else if (list_t[blno].match(/自治([区州盟县])$/)!==null){
                list_t[blno]=list_t[blno].replace(/自治[区州盟县]$/g,'');
            }
            else if (list_t[blno].match(/.{2}(地区|新区|矿区|林区|城区|郊县|行政委员会|特别行政区)$/)!==null){
                list_t[blno]=list_t[blno].replace(/(.{2})(地区|新区|矿区|林区|城区|郊县|行政委员会|特别行政区)$/g,'$1');
            }
            else if (list_t[blno].match(/.{2}[省市区县盟]$/)!==null){
                list_t[blno]=list_t[blno].replace(/(.{2})[省市区县盟]$/g,'$1');
            }
        }
        if (list_t.length>=2){
            if (list_t[0]==list_t[1]){
                list_t=[list_t[0]].concat(list_t.slice(2,));
            }
        }
        if (list_t.length>=3){
            if (list_t[1]==list_t[2]){
                list_t=[list_t[0],list_t[1]];
            }
        }  
        if (list_t.length==2){//澳门_澳门 - 保留注释
            if (list_t[0]==list_t[1]){
                list_t=[list_t[0]];
            }
        }        
        result_t[blxl]=list_t.join('_');
    }
    
    for (let item of result_t){
        if (item.includes(' ')){
            console.log(item);  //是否含有空格 - 保留注释
        }
        var list_t=item.split('_');
        for (let acol of list_t){
            if (acol.length<=1){
                console.log(item);  //长度是否只有一个汉字以内 - 保留注释
                break;
            }
        }
    }
    result_t.sort(zh_sort_b);
    return new Set(result_t);
}

function datetime_gpx_leaflet_b(csstr){
    csstr=csstr.replace(new RegExp('</?time>','g'),'').trim();
    var theday=validdate_b(csstr);
    if (theday===false){
        var bljg=csstr.replace('T',' ');
    }
    else {
        var bljg=now_time_str_b(':',true,theday);
    }
    return [theday,bljg];
}

function lines_latlon_2_dots_leaflet_b(cslist,cstype){
    var result_t=[];
    var bllat=0;
    var bllon=0;
    
    for (let item of cslist){       
        item=item.split('@',1)[0].trim(); //去掉注释部分 - 保留注释
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
    return result_t;
}

function lines_gpsinfo_2_dots_leaflet_b(cslist){
    var result_t=[];
    var bllat=0;
    var bllon=0;
    
    for (let item of cslist){
        item=item.split('@',1)[0].trim();   //去掉注释部分，此行可以忽略，parseFloat 会自动忽略 数字字符之后的 # 等非数字字符部分- 保留注释
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

    return result_t;
}

function draw_gpx_lines_simple_leaflet_b(cslist,csname,cscolors){
    //cslist 须是 lat,lon 格式，形如 [ [ 30.221588, 120.024205 ], [ 30.221542, 120.024116 ] ] - 保留注释
    //---
    if (cslist.length==0){return;}
    
    if (cscolors.length<3){
        cscolors=cscolors.concat([-1,-1,-1]).slice(0,3);
    }
    var list_t=cscolors[0].split(':');
    cscolors[0]=list_t[gpx_line_color_no_global % list_t.length];
    gpx_line_color_no_global=gpx_line_color_no_global+1;
    //---
    
    navigation_layer_gps_global.addLayer(line_leaflet_b(omap_gps_points_global,true,cslist,cscolors[0],csname));
    if (cscolors[1]!==''){
        //lon,lat,radius,color - 保留注释
        one_point_leaflet_b(cslist[0][1],cslist[0][0],2,cscolors[1]);
    }
    if (cscolors[2]!==''){
        one_point_leaflet_b(cslist[cslist.length-1][1],cslist[cslist.length-1][0],2,cscolors[2]);
    }
}

function one_point_leaflet_b(lon,lat,csradius,cscolor){    
    var ocircle=circle_leaflet_b(omap_gps_points_global,true,lon,lat,csradius,cscolor,'',0);
    navigation_layer_gps_global.addLayer(ocircle);
    omap_gps_points_global.panTo(new L.LatLng(lat,lon));
}

function map_range_leaflet_b(min_max=false){
    var xy=omap_gps_points_global.getSize();
    if (min_max){
        var lat_list=[];
        var lon_list=[];
        for (let item of [[0,0],[xy.x,xy.y]]){
            var lat_lon=omap_gps_points_global.containerPointToLatLng(item);
            lat_list.push(lat_lon['lat']);
            lon_list.push(lat_lon['lng']);
        }
        lat_list.sort(function (a,b){return a>b;});
        lon_list.sort(function (a,b){return a>b;});
        return [lat_list,lon_list];
    }
    else {
        var result_t=[];
        for (let item of [[0,0],[xy.x,0],[0,xy.y],[xy.x,xy.y]]){
            var lat_lon=omap_gps_points_global.containerPointToLatLng(item);
            result_t.push([lat_lon['lat'],lat_lon['lng']]);
        }
        return result_t;
    }
}

function gpx_file_draw_leaflet_b(csstr,cstype,csname='',cscolors=[]){
    var all_points=[];
    var list_t=csstr.split('<trk>');    //有几条线路就有几个 trk - 保留注释

    var line_color_list=cscolors[0].split(':');
    var blstr1='';
    var blstr2='';
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
        blname=blname.replace(new RegExp('_','g'),' ');
        blname=blname.replace(new RegExp('-','g'),' - ');
        var bltime=list_t[blxl].match(/<time>.*?<\/time>/mg);    //multiline - 保留注释
        if (bltime!==null){
            if (bltime.length>=1){
                blname=blname+' (';
                var theday1;
                [theday1,blstr1]=datetime_gpx_leaflet_b(bltime[0]);
                blname=blname+blstr1;
                
                if (bltime.length>=2){
                    var theday2;
                    [theday2,blstr2]=datetime_gpx_leaflet_b(bltime.slice(-1)[0]);
                    if (blstr1.split(' ')[0]==blstr2.split(' ')[0]){
                        blname=blname+' - '+blstr2.substring(blstr2.indexOf(' '),).trim();
                    }
                    else {
                        blname=blname+' - '+blstr2;
                    }
                    if (theday1!==false && theday2!==false){
                        blname=blname+' / '+days_between_two_dates_b(theday1,theday2,'hms');
                    }
                }
                blname=blname+')';  //添加日期 - 保留注释
            }
        }
        var trkpts=list_t[blxl].split('<trkpt ');
        for (let lonlat of trkpts){
            lonlat=lonlat.split('>')[0];
            if (lonlat.includes('lon=') && lonlat.includes('lat=')){
                var bllat=lonlat.split('lat=')[1].trim().split(' ')[0].replace(/['"]/g,'');
                var bllon=lonlat.split('lon=')[1].split(' ')[0].replace(/['"]/g,'');
                bllat=parseFloat(bllat);
                bllon=parseFloat(bllon);
                [bllon,bllat]=transform_lon_lat_one_dot_b(cstype,bllon,bllat);
                result_list.push([bllat,bllon]);
            }
        }
        all_points=all_points.concat(result_list);
        
        cscolors[0]=line_color_list[gpx_line_color_no_global % line_color_list.length];
        gpx_line_color_no_global=gpx_line_color_no_global+1;          
        
        draw_gpx_lines_simple_leaflet_b(result_list,blname,cscolors);  
    }

    return all_points;
}

function data_2_gpx_file_leaflet_b(transform_type='',odom=false){
    if (typeof gpx_current_geometry_data_global == 'undefined'){return;}
    if (Array.isArray(gpx_current_geometry_data_global)==false){return;}
    var list_t=[];
    var lat, lon;
    for (let item of gpx_current_geometry_data_global){
        [lon,lat]=transform_lon_lat_one_dot_b(transform_type,item['lng'],item['lat']);
        list_t.push([lat,lon]);
    }
    
    var savename='';
    if (odom){
        var oparent=odom.parentNode;
        if (oparent){
            savename=oparent.innerText;
            savename=savename.split('(')[0].trim().split('.gpx')[0].trim();
            savename=savename.replace(/\s+\d{8}.*$/g,'');            
            savename=savename.replace(/\s/g,'_');
        }
    }
    savename=prompt('输入保存文件名：',savename);
    if (savename==null){return;}
    savename=savename.trim();
    if (savename==''){return;}
    
    var blstr=latlon_2_gpx_file_leaflet_b(list_t,savename);
    string_2_txt_file_b(blstr,savename+'.gpx','gpx');
}

function latlon_2_gpx_file_leaflet_b(cslist,csname,with_head_tail=true){
    //cslist 数组每一个元素都是 [lat,lon] 格式 - 保留注释
    for (let blxl=0;blxl<cslist.length;blxl++){
        cslist[blxl]='<trkpt lat="'+cslist[blxl][0]+'" lon="'+cslist[blxl][1]+'"></trkpt>';
    }

    var bljg='<trk><name>'+csname+'</name>\n';
    bljg=bljg+'<trkseg>\n';
    bljg=bljg+cslist.join('\n');
    bljg=bljg+'</trkseg>\n</trk>\n';
    
    if (with_head_tail){
        bljg=gpx_head_tail_leaflet_b(bljg);
    }
    return bljg;
}

function gpx_head_tail_leaflet_b(cscontent){
    var bljg='<?xml version="1.0" encoding="UTF-8"?>\n';
    bljg=bljg+'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="JavaScript">\n';
    bljg=bljg+cscontent;
    bljg=bljg+'</gpx>\n';
    return bljg;
}
