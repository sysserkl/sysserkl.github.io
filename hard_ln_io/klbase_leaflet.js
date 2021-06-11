function baselayers_leaflet_b(){
    return {
        "mapbox": L.layerGroup([klmaps_global["mapbox"]]),
        "OSM": L.layerGroup([klmaps_global["osm"]]),
        "Google": L.layerGroup([klmaps_global["google"]]),
        "Google 地形": L.layerGroup([klmaps_global["google_earth"]]),
        "Geoq": L.layerGroup([klmaps_global["geoq"]]),
        "Geoq_PurplishBlue": L.layerGroup([klmaps_global["geoq_PurplishBlue"]]),
        "geoq_Gray": L.layerGroup([klmaps_global["geoq_Gray"]]),
        "geoq_Warm": L.layerGroup([klmaps_global["geoq_Warm"]]),
        "geoq_Hydro": L.layerGroup([klmaps_global["geoq_Hydro"]]),
        "高德地图": L.layerGroup([klmaps_global["gd"]]),
        "高德地形(无路网)": L.layerGroup([klmaps_global["gd_earth"]]),
    }
}

function init_maps_leaflet_b(csmax=18,csmin=5){
    klmaps_global=[];
    klmaps_global["mapbox"]=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        maxZoom: 18,
        minZoom:5,
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
    if (cscaption!==''){
        blstr=cscaption+'<br />'+blstr;
    }
    polyline.bindPopup(blstr);
    
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
    var list_t=csstr.trim().replace(new RegExp(/\r\n/,'mg'),'\n').replace(new RegExp(/\n/,'mg'),';').split(';');
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
