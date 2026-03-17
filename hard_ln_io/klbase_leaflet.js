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

    klmaps_global['gd'] = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global['gd_earth'] = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global['gd_road'] = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {maxZoom: 18,minZoom: 5});
    
    klmaps_global['osm'] = L.tileLayer.chinaProvider('OSM.Normal.Map', {maxZoom: 18,minZoom: 5});

    klmaps_global['google'] = L.tileLayer.chinaProvider('Google.Normal.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global['google_earth'] = L.tileLayer.chinaProvider('Google.Satellite.Map', {maxZoom: 18,minZoom: 5});

    klmaps_global['geoq'] = L.tileLayer.chinaProvider('Geoq.Normal.Map', {maxZoom: 18,minZoom: 5});
    klmaps_global['geoq_PurplishBlue'] = L.tileLayer.chinaProvider('Geoq.Normal.PurplishBlue', {maxZoom: 18,minZoom: 5});
    klmaps_global['geoq_Gray'] = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {maxZoom: 18,minZoom: 5});
    klmaps_global['geoq_Warm'] = L.tileLayer.chinaProvider('Geoq.Normal.Warm', {maxZoom: 18,minZoom: 5});
    klmaps_global['geoq_Hydro'] = L.tileLayer.chinaProvider('Geoq.Theme.Hydro', {maxZoom: 18,minZoom: 5});
}

function line_default_weight_b(){
    if (typeof gpx_line_weight_global=='undefined'){
        gpx_line_weight_global=(ismobile_b()?4:3);
    }
}

function line_length_2_km_leaflet_b(cslen){
    if (cslen>500){
        return (cslen/1000).toFixed(2)+' km';
    } else {
        return cslen.toFixed(2)+' m';
    }
}

function transform_and_restore_leaflet_b(){
    var transform_type='';
    var restore_type='';
    var oselect=document.getElementById('select_transform');
    if (oselect){
        transform_type=oselect.value;
    } else if (typeof gps_tranform_type_global !== 'undefined'){
        transform_type=gps_tranform_type_global;
    }
    
    switch (transform_type){
        case 'WGS84_TO_GCJ02':
            restore_type='GCJ02_TO_WGS84';
            break;
        case 'GCJ02_TO_WGS84':
            restore_type='WGS84_TO_GCJ02';
            break;
    }
    return [transform_type,restore_type];
}

function line_leaflet_b(csomap,islayer=false,cslist=[],cscolor='red',cscaption='',textarea_id_for_remove='',time_ele_list=[[],[]],part_len=-1,point_type=''){
    function sub_line_leaflet_b_one_detail(tlist,elist){
        let result_t=[];
        for (let item of tlist){
            item=item.replace(/^<.*?>(.*?)<\/.*?>/,'$1');
            result_t.push(new Date(item));
        }
        
        let error_found=false;
        let seconds_sum=0;
        let seconds_list=[0];
        for (let blxl=1,lent=result_t.length;blxl<lent;blxl++){
            let seconds_minus=days_between_two_dates_b(result_t[blxl-1],result_t[blxl],'s',true);
            if (seconds_minus===false){
                error_found=true;
                break;
            }
            seconds_sum=seconds_sum+seconds_minus;
            seconds_list.push(seconds_sum);
        }

        result_t=[];
        for (let item of elist){
            item=item.replace(/^<.*?>(.*?)<\/.*?>/,'$1');
            result_t.push(parseFloat(item));
        }
        
        if (!error_found){
            detail_key='te_detail_'+Object.keys(te_detail_leaflet_global).length;        
            te_detail_leaflet_global[detail_key]=[seconds_list,result_t];
        }
    }
    
    function sub_line_leaflet_b_one_draw(sub_list){
        let [dots_list,cslen,start_no,end_no]=sub_list;
        
        let blstr=line_length_2_km_leaflet_b(cslen);
        
        if (line_no==1){
            lte_list_leaflet_global.push('🧭 '+cscaption+(line_count>1?'':' '+blstr));
        }
        
        detail_key='';
        let sub_caption='';
        if (line_count>1){
            sub_caption=' 🥾 '+line_no+'/'+line_count;
            let sub_time=time_list.slice(start_no,end_no);
            if (time_len>=list_len){
                sub_caption=sub_caption+' '+gpx_time_get_leaftlet_b(sub_time);
            }
            
            if (ele_len==time_len && ele_len>=list_len){
                let sub_ele=ele_list.slice(start_no,end_no);
                sub_line_leaflet_b_one_detail(sub_time,sub_ele);
                sub_caption=sub_caption+' '+gpx_ele_get_leaftlet_b(sub_ele);
            }
            lte_list_leaflet_global.push(sub_caption+' '+blstr);
        } else {
            if (ele_len==time_len && ele_len>=list_len){
                sub_line_leaflet_b_one_detail(time_list,ele_list);
            }
        }
        
        blstr='<span class="span_line_caption_leaflet">'+cscaption+sub_caption+'</span> '+blstr;
        if (detail_key!==''){
            blstr=blstr+' <span style="cursor:pointer;" onclick="te_2_chart_leaflet_b(this,\''+detail_key+'\');">⛰</span>';
        }
        blstr=blstr+' <span style="cursor:pointer;" onclick="data_2_gpx_file_leaflet_b(\''+restore_type+'\',this);">⬇</span>';
        blstr=blstr+point_type;
        blstr=blstr+' <span style="cursor:pointer;" onclick="split_2_gpx_file_leaflet_b();">🪚</span>';
        if (textarea_id_for_remove!==''){
            blstr=blstr+' <span style="cursor:pointer;" onclick="remove_data_in_textarea_leaflet_b(\''+restore_type+'\',this,\''+textarea_id_for_remove+'\');">⛔</span>';
        }

        var polyline = L.polyline(dots_list, line_style[line_no % 2]);

        polyline.bindPopup('<span style="word-break:break-all;">'+blstr+'</span>'+(detail_key!==''?'<div id="div_'+detail_key+'" style="display:none;width:100%;height:5rem;"><canvas style="border:1px solid black; background-color:'+scheme_global['button']+'; border-radius: 1rem;"></canvas></div>':''));
        polyline.on('click', (e) => {
            gpx_current_geometry_data_global=e.target.getLatLngs(); //全局变量 - 保留注释   
            lat_lon_status_b(e.latlng['lat'],e.latlng['lng'],'div_status',csomap);
        });
        return polyline; 
    }
    
    //[[lat,lon],[lat,lon]] - 保留注释
    if (cslist.length==0){
        console.log('cslist 长度为0');
        return;
    }
    
    var time_list,ele_list;
    [time_list,ele_list]=time_ele_list;
    
    var line_list=[];
    
    var bllen=0;
    var blstart=0;
    var list_len=cslist.length;
    var time_len=time_list.length;
    var ele_len=ele_list.length;
    
    line_default_weight_b();
    
    var line_style=[{},{}];   //设置虚线样式和偏移量
    if (typeof cscolor == 'object'){
        line_style[1]=cscolor;
    } else {
        line_style[1]={color:cscolor};
    }
    line_style[1]['weight']=gpx_line_weight_global;
    
    for (let key in line_style[1]){
        line_style[0][key]=line_style[1][key];
    }

    if (line_style[0]['dashArray']==undefined){
        line_style[0]['dashArray']=(gpx_line_weight_global * 3) + ',' + (gpx_line_weight_global * 2);
    }
    if (line_style[0]['dashOffset']==undefined){
        line_style[0]['dashOffset']=(gpx_line_weight_global * 3).toString();
    }

    for (let blno=1;blno<list_len;blno++){
        var latlng1 = L.latLng(cslist[blno-1][0], cslist[blno-1][1]);
        var latlng2 = L.latLng(cslist[blno][0], cslist[blno][1]);
        bllen=bllen+latlng1.distanceTo(latlng2);    //线条长度计算 - 保留注释
        
        if (part_len>0 && bllen>=part_len && blno>=blstart+2 && blno<=list_len-3){
            line_list.push([cslist.slice(blstart,blno+1),bllen,blstart,blno+1])
            blstart=blno+1;
            bllen=0;
        }
    }
    
    if (blstart<list_len){
        line_list.push([cslist.slice(blstart,list_len),bllen,blstart,list_len]);
    }
    
    //-----------------------
    var temp_list=[];
    for (let item of line_list){
        temp_list=temp_list.concat(item[0]);
    }
    if (temp_list.toString()!==cslist.toString()){
        console.log('分割错误',line_list,cslist);   //验证是否正确分割 - 保留注释
    }
    //-----------------------
    var line_count=line_list.length;
    if (line_count==0){
        console.log('无结果',cslist);
        return;
    }
    
    var transform_type,restore_type;
    [transform_type,restore_type]=transform_and_restore_leaflet_b();

    if (cscaption==''){
        cscaption=cslist[0]+'_'+cslist[cslist.length-1];
    }
    
    if (typeof lte_list_leaflet_global == 'undefined'){
        lte_list_leaflet_global=[]; //全局变量 - 保留注释
    }
    
    if (typeof te_detail_leaflet_global == 'undefined'){
        te_detail_leaflet_global={};
    }
    
    var line_no=1;
    var detail_key='';
    
    if (line_count>1){
        var line_group = L.layerGroup();
        for (let one_line of line_list){
            var sub_line=sub_line_leaflet_b_one_draw(one_line);
            if (islayer){
                line_group.addLayer(sub_line);
            } else {
                sub_line.addTo(csomap);
            }
            line_no=line_no+1;
        }
        
        console.log(lte_list_leaflet_global.join('\n'));

        //console.log('生成了含有', line_group.getLayers().length,'条线的 group');  
        if (islayer){
            return line_group;
        }
    } else {
        var polyline=sub_line_leaflet_b_one_draw(line_list[0]);
        console.log(lte_list_leaflet_global.join('\n'));
        
        if (islayer){
            return polyline;
        } else {
            polyline.addTo(csomap);
        }
    }
}

function split_2_gpx_file_leaflet_b(){
    if (typeof clicked_lat_lng_global == 'undefined'){return;}
        
    let closestIndex = -1;
    let minDistance = Infinity;

    // 确保点击点是 L.LatLng
    const clickLatLng = L.latLng(clicked_lat_lng_global);
    
    // 遍历所有点，找最近点的索引
    for (let blxl = 0,lent=gpx_current_geometry_data_global.length; blxl < lent; blxl++){
        const vertex = L.latLng(gpx_current_geometry_data_global[blxl]);
        const distance = clickLatLng.distanceTo(vertex);
        if (distance < minDistance){
            minDistance = distance;
            closestIndex = blxl; // 👈 记录索引！
        }
    }

    if (closestIndex === -1){
        console.warn('未找到最近点');
        return;
    }

    // 分割为两段（包含分割点）
    const part1 = gpx_current_geometry_data_global.slice(0, closestIndex + 1); // 从起点到分割点（含）
    const part2 = gpx_current_geometry_data_global.slice(closestIndex);        // 从分割点到终点（含）

    const length1 = lat_lon_dict_dots_get_length_b(part1);
    const length2 = lat_lon_dict_dots_get_length_b(part2);

    var bljg=line_length_2_km_leaflet_b(length1)+' + '+line_length_2_km_leaflet_b(length2)+' = '+line_length_2_km_leaflet_b(length1+length2);
    alert(bljg);
}

function lat_lon_dict_dots_get_length_b(points){
    var bllen=0;
    for (let blno=1,lent=points.length;blno<lent;blno++){
        var latlng1 = L.latLng(points[blno-1]);
        var latlng2 = L.latLng(points[blno]);
        bllen=bllen+latlng1.distanceTo(latlng2);    //线条长度计算 - 保留注释
    }
    return bllen;
}
    
function distance_leaflet_b(lat1, lng1, lat2=false, lng2=false){
    if (lat2===false && lng2===false){
        [lat2,lng2]=lng1;
        [lat1,lng1]=lat1;
    }
    
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

function rad_leaflet_b(d){
    return d*Math.PI/180.0;
}

function te_2_chart_leaflet_b(ospan,cskey){
    dataX=te_detail_leaflet_global[cskey][0];
    dataY=te_detail_leaflet_global[cskey][1];
    let compare_list=[];
    for (let blxl=0,lent=dataX.length;blxl<lent;blxl++){
        compare_list.push('['+dataX[blxl]+','+dataY[blxl]+']');
    }
    
    let blname='array_analyze';
    var oname=ospan.parentNode.querySelector('span.span_line_caption_leaflet');
    if (oname){
        blname=oname.innerText.replace(/^(.*?)\s\d+.*$/,'$1');
    }
    console.log('"'+blname+'#points:false#",'+compare_list.join(','));
    
    var odiv=document.getElementById('div_'+cskey);
    if (odiv){
        odiv.style.display='block';
        canvas=odiv.querySelector('canvas');
        canvas_nn_line_chart_b(canvas,dataX,dataY,5);
    }
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

    var radLat1 = rad_leaflet_b(lat1);
    var radLat2 = rad_leaflet_b(lat2);
    var a = radLat1 - radLat2;
    var tmp1=Math.pow(Math.sin(a/2),2);

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
    var lat2=(rad_leaflet_b(lat1)-radius)*180.0/Math.PI;
    return lat2;
}

function rectangle_xy_leaflet_b(lat1,lng1,longline_half,shortline_half,add_first_point=true){    
    //lat1,lng1 是中心点 - 保留注释
    var x2=get_x_leaflet_b(lat1,shortline_half);
    var y2=get_y_leaflet_b(lat1,lng1,longline_half,lat1);

    var bllist=[[x2,y2]];
    
    bllist.push([x2,2*lng1-y2]);
    bllist.push([2*lat1-x2,2*lng1-y2]);
    bllist.push([2*lat1-x2,y2]);
    
    if (add_first_point){
        bllist.push([x2,y2]);
    }
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
    } else {
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
    
    if (out_of_china_b(lng, lat)){
        return [lng, lat];
    } else {
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

function bd09togcj02_b(bd_lng, bd_lat){
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

function gcj02tobd09_b(lng, lat){
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
  
function out_of_china_b(lng, lat){
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

function transform_lon_lat_one_dot_b(cstype,lon,lat,return_lat_lon=false){
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
    if (return_lat_lon){
        return [lat,lon];    
    } else {
        return [lon,lat];
    }
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
        } else if (item[3]==csname){
            similar1_list.push(item.slice(-2,));
        } else if (item[3].includes(csname) || item[4].includes(csname)){
            similar2_list.push(item.slice(-2,));
        }        
    }
    if (exact_lnglat.length>0){
        return exact_lnglat;
    } else if (similar1_list.length==1){
        return similar1_list[0];
    } else if (similar1_list.length==0 && similar2_list.length==1){
        return similar2_list[0];
    } else {
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
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        var list_t=result_t[blxl].split(' ');
        for (let blno=0,lenb=list_t.length;blno<lenb;blno++){
            if (list_t[blno].match(nationality)!==null){
                list_t[blno]=list_t[blno].replace(new RegExp(nationality,'g'),'$1');
            } else if (list_t[blno].match(/自治([区州盟县])$/)!==null){
                list_t[blno]=list_t[blno].replace(/自治[区州盟县]$/g,'');
            } else if (list_t[blno].match(/.{2}(地区|新区|矿区|林区|城区|郊县|行政委员会|特别行政区)$/)!==null){
                list_t[blno]=list_t[blno].replace(/(.{2})(地区|新区|矿区|林区|城区|郊县|行政委员会|特别行政区)$/g,'$1');
            } else if (list_t[blno].match(/.{2}[省市区县盟]$/)!==null){
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
    } else {
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
        } else if (cstype=='latlon'){
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
        } else if (item.indexOf('GPS_GPSLongitude:')==0){
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

function point_size_get_leaflet_b(point_type){
    var point_size=gpx_line_weight_global;
    if (['triangle','rectangle'].includes(point_type)){
        point_size=point_size*2;
    } else if (point_type!==''){
        point_size=point_size*(ismobile_b()?4:6);
    }
    return point_size;
}

function draw_gpx_lines_simple_leaflet_b(onavigation,omap,cslist,csname,cscolors,textarea_id_for_remove='',dopanto=true,time_ele_list=[[],[]],part_len=-1,point_type='',point_size=false,csfillcolor='',csfillopacity=0){
    //cslist 须是 lat,lon 格式，形如 [ [ 30.221588, 120.024205 ], [ 30.221542, 120.024116 ] ] - 保留注释
    //point_type 数字编号 - 保留注释
    //---
    if (cslist.length==0){return;}
        
    if (cscolors.length<3){
        cscolors=cscolors.concat([-1,-1,-1]).slice(0,3);
    }
    var list_t=cscolors[0].split(':');
    cscolors[0]=list_t[gpx_line_color_no_global % list_t.length];
    gpx_line_color_no_global=gpx_line_color_no_global+1;
    //---

    line_default_weight_b();
    
    onavigation.addLayer(line_leaflet_b(omap,true,cslist,cscolors[0],csname,textarea_id_for_remove,time_ele_list,part_len,point_type));
    
    if (point_type===''){
        var type_list=['','triangle','rectangle'];
        type_list.sort(randomsort_b);
        point_type=type_list[0];
    }
    
    if (point_size===false){
        point_size=point_size_get_leaflet_b(point_type);
    }
    
    //cscolors 形如：[ "greenyellow", "cyan", "red" ] - 保留注释
    if (cscolors[1]!==''){  //标注起点 - 保留注释
        //lon,lat,radius,color - 保留注释
        one_point_leaflet_b(onavigation,omap,cslist[0][1],cslist[0][0],point_size,cscolors[1],dopanto,point_type,csfillcolor,csfillopacity);
    }
    if (cscolors[2]!==''){  //标注终点 - 保留注释
        one_point_leaflet_b(onavigation,omap,cslist[cslist.length-1][1],cslist[cslist.length-1][0],point_size,cscolors[2],dopanto,point_type,csfillcolor,csfillopacity);
    }
}

function one_point_leaflet_b(onavigation,omap,lon,lat,csradius,cscolor,dopanto=true,cstype='',csfillcolor='',csfillopacity=0){ 
    switch (cstype){
        case 'triangle':
            var odom=triangle_leaflet_b(omap,true,lon,lat,csradius,cscolor,csfillcolor,csfillopacity);
            break;
        case 'rectangle':
            var odom=rectangle_by_polygon_leaflet_b(omap,true,lon,lat,csradius,cscolor,csfillcolor,csfillopacity);
            break;
        case '':
            var odom=circle_leaflet_b(omap,true,lon,lat,csradius,cscolor,csfillcolor,csfillopacity);
            break;
        default:
            var odom=character_leaflet_b(cstype,omap,true, lon, lat, csradius,cscolor); //数字编号 - 保留注释
            break;
    }
    
    onavigation.addLayer(odom);
    if (dopanto){
        omap.panTo(new L.LatLng(lat,lon));
    }
}

function rectangle_by_lines_leaflet_b(csomap,islayer=false,cslon=121.5,cslat=31.2,longline=1000,shortline=500,cscolor='red'){
    //正方形或长方形 - 保留注释
    var list_t=rectangle_xy_leaflet_b(cslat,cslon,longline/2,shortline/2);
    //list_t 为 5 个元素的数组，每个元素是坐标 - 保留注释
    return line_leaflet_b(csomap,islayer,list_t,cscolor,'');
}

function circle_leaflet_b(csomap,islayer=false,cslon=121.5,cslat=31.2,csradius=10,cscolor='red',csfillcolor='#f03',csfillopacity=0.5,is_stroke=true){
    var circle = L.circle([cslat,cslon], {
        color: cscolor,
        fillColor: csfillcolor,
        fillOpacity: csfillopacity,
        radius: csradius,
        stroke: is_stroke,
    });
    
    if (islayer){
        return circle;
    } else {
        circle.addTo(csomap);
    }
}

function rectangle_by_polygon_leaflet_b(omap,islayer, cslng, cslat, sideLength,cscolor,csfillcolor='#f03',csfillopacity=0.5){
    //正方形 - 保留注释
    var list_t=rectangle_xy_leaflet_b(cslat,cslng,sideLength/2,sideLength/2,false);
    //list_t 为 4 个元素的数组，每个元素是坐标 - 保留注释

    var rectangle_style={
        color: cscolor,
        fillColor: csfillcolor,
        fillOpacity: csfillopacity,    
    };
    
    const otriangle = L.polygon(list_t, rectangle_style);

    if (islayer){
        return otriangle;
    } else {
        otriangle.addTo(omap);
    }
}

function character_leaflet_b(character,omap,islayer, cslng, cslat, sideLength,cscolor){
    const font_size=Math.floor(sideLength * 0.8);

    const customIcon = L.divIcon({
        className: 'custom-character-icon',
        html: `<span style="font-size: ${font_size}px; font-weight:bold; color:${cscolor};">${character}</span>`,
        iconSize: [sideLength, sideLength], // 图标大小
    });

    // 在指定坐标添加文字标记 - 保留注释
    var omarker=L.marker([cslat, cslng], { icon: customIcon});
    
    if (islayer){
        return omarker;
    } else {
        omarker.addTo(omap);
    }    
}

function triangle_leaflet_b(omap,islayer, cslng, cslat, sideLength,cscolor,csfillcolor='#f03',csfillopacity=0.5){
    const earthRadius = earth_radius_leaflet_b()*1000;  //米 - 保留注释

    // 将边长转换为经纬度的近似值
    const deltaLat = (sideLength / earthRadius) * (180 / Math.PI);
    const deltaLng = deltaLat / Math.cos((cslat * Math.PI) / 180);

    // 计算正三角形的三个顶点坐标
    const height = (Math.sqrt(3) / 2) * sideLength; // 正三角形的高

    const point1 = [cslat + deltaLat / 2, cslng]; // 顶点
    const point2 = [cslat - deltaLat / 2, cslng - deltaLng / 2]; // 左下角
    const point3 = [cslat - deltaLat / 2, cslng + deltaLng / 2]; // 右下角

    var triangle_style={
        color: cscolor,
        fillColor: csfillcolor,
        fillOpacity: csfillopacity,    
    };
        
    const otriangle = L.polygon([point1, point2, point3], triangle_style);

    if (islayer){
        return otriangle;
    } else {
        otriangle.addTo(omap);
    }
}

function map_size_or_bound_leaflet_b(omap,min_max=false,bound_or_size='size',with_raw=false){
    var list_t=[];
    if (bound_or_size=='size'){
        var xy=omap.getSize();
        if (min_max){
            for (let item of [[0,0],[xy.x,xy.y]]){
                var lat_lon=omap.containerPointToLatLng(item);
                list_t.push(lat_lon);
            }
        } else {
            for (let item of [[0,0],[xy.x,0],[0,xy.y],[xy.x,xy.y]]){    //左上角 右上角 左下角 右下角
                var lat_lon=omap.containerPointToLatLng(item);
                list_t.push(lat_lon);
            }
        }
    } else {
        var xy=omap.getBounds(); 
        var nw=xy.getNorthWest();
        var ne=xy.getNorthEast();
        var sw=xy.getSouthWest();
        var se=xy.getSouthEast();
        
        if (min_max){
            list_t=[nw,se];
        } else {
            list_t=[nw,ne,sw,se];
        }
    }
    if (with_raw){
        return [list_t,xy];
    }
    return list_t;
}

function map_range_leaflet_b(omap,min_max=false,cstype=false){
    var list_t=map_size_or_bound_leaflet_b(omap,min_max,'bound');
    if (min_max){
        var lat_list=[];
        var lon_list=[];
        for (let lat_lon of list_t){
            if (cstype!==false){
                [lat_lon['lng'],lat_lon['lat']]=transform_lon_lat_one_dot_b(cstype,lat_lon['lng'],lat_lon['lat']);
            }
            lat_list.push(lat_lon['lat']);
            lon_list.push(lat_lon['lng']);
        }
        lat_list.sort(function (a,b){return a>b ? 1 : -1;});
        lon_list.sort(function (a,b){return a>b ? 1 : -1;});
        return [lat_list,lon_list];
    } else {
        var result_t=[];
        for (let lat_lon of list_t){
            if (cstype!==false){
                [lat_lon['lng'],lat_lon['lat']]=transform_lon_lat_one_dot_b(cstype,lat_lon['lng'],lat_lon['lat']);
            }
            result_t.push([lat_lon['lat'],lat_lon['lng']]);
        }
        return result_t;
    }
}

function gpx_ele_get_leaftlet_b(ele_list){
    if (ele_list.length==0){
        return '';
    }
    
    var up_sum=0;
    var down_sum=0;
    var ele_set=new Set();
    
    var point0=parseFloat(ele_list[0].slice(5,-6));
    for (let blxl=1,lent=ele_list.length;blxl<lent;blxl++){
        let item=parseFloat(ele_list[blxl].slice(5,-6));  //<ele>480.0</ele> - 保留注释
        if (item==point0){continue;}
        if (item>point0){
            up_sum=up_sum+item-point0;
        } else {
            down_sum=down_sum+item-point0;
        }
        point0=item;
        ele_set.add(item);
    }
    
    let blmax=Math.max(...ele_set);
    let blmin=Math.min(...ele_set);
    
    return '(↑'+up_sum.toFixed(0)+' ↓ '+Math.abs(down_sum).toFixed(0)+' | '+blmin.toFixed(0)+' ~ '+blmax.toFixed(0)+')';
}

function gpx_time_get_leaftlet_b(time_list){
    let blname='';
    if (time_list.length>=1){
        blname=blname+' (';
        var theday1,blstr1;
        [theday1,blstr1]=datetime_gpx_leaflet_b(time_list[0]);
        blname=blname+blstr1;
        
        if (time_list.length>=2){
            var theday2,blstr2;
            [theday2,blstr2]=datetime_gpx_leaflet_b(time_list.slice(-1)[0]);
            if (blstr1.split(' ')[0]==blstr2.split(' ')[0]){
                blname=blname+' - '+blstr2.substring(blstr2.indexOf(' '),).trim();
            } else {
                blname=blname+' - '+blstr2;
            }
            if (theday1!==false && theday2!==false){
                blname=blname+' / '+days_between_two_dates_b(theday1,theday2,'hms');
            }
        }
        blname=blname+')';  //添加日期 - 保留注释
    }
    //blname 形如：(2014-11-19 07:53:52 - 10:12:03 / 02:18:11) - 保留注释
    return blname;
}

function gpx_name_get_leaftlet_b(csstr,csname=''){
    var blname=csstr.match(/<name>(.*?)<\/name>/m);
    if (blname==null){
        blname=csname;
    } else if (blname.length<2){
        blname=csname;
    } else {
        blname=blname[1];
    }
    
    blname=blname.replace(new RegExp('_','g'),' ').replace(new RegExp('-','g'),' - ');
    
    var bltime=csstr.match(/<time>.*?<\/time>/mg);    //time_list, multiline - 保留注释
    if (bltime!==null){
        blname=blname+gpx_time_get_leaftlet_b(bltime);
    } else {
        bltime=[];
    }
    //bltime 元素形如：<time>2025-02-17T02:47:18Z</time> - 保留注释

    var ele_list=csstr.match(/<ele>.*?<\/ele>/mg) || [];    //海拔 - 保留注释
    if (ele_list.length>0){
        blname=blname+gpx_ele_get_leaftlet_b(ele_list);
    }
    
    //ele_list 形如：<ele>480.0</ele> - 保留注释
    return [blname,bltime,ele_list];
}

function gpx_file_draw_leaflet_b(onavigation,omap,csstr,cstype,csname='',cscolors=[],part_len=-1,is_line_no_style=true,csfillcolor='',csfillopacity=0){
    //is_line_no_style 数字编号 - 保留注释
    var all_points=[];
    var list_t=csstr.split('<trk>');    //有几条线路就有几个 trk - 保留注释

    var line_color_list=cscolors[0].split(':');
    var blname,bltime,blele;
    var point_size=point_size_get_leaflet_b((is_line_no_style?'1':''));
    
    lte_list_leaflet_global=[]; //全局变量
    
    for (let blxl=1,lent=list_t.length;blxl<lent;blxl++){ //忽略第1个元素 - 保留注释
        [blname,bltime,blele]=gpx_name_get_leaftlet_b(list_t[blxl],csname);   //time_list - 保留注释

        var result_list=[];
        var trkpts=list_t[blxl].split('<trkpt ');
        //trkpts 的元素形如：
        //0: "\n<trkseg>\n"
        //1: 'lon="121.471574" lat="28.810572"><ele>134.719184</ele><time>2024-02-12T03:26:31Z</time><speed>1.8835790498978044</speed></trkpt>\n'
        //455: 'lon="121.493255" lat="28.803515"><ele>70.963688</ele><time>2024-02-12T07:01:56Z</time><speed>1.0287360272521981</speed></trkpt>\n</trkseg>\n</trk>\n</gpx>\n'

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
        
        draw_gpx_lines_simple_leaflet_b(onavigation,omap,result_list,blname,cscolors,'',true,[bltime,blele],part_len,(is_line_no_style?blxl.toString():''),point_size,csfillcolor,csfillopacity);  
    }

    return all_points;
}

function horizontal_delimiter_split_gps_points_b(csstr,with_name=false){
    if (with_name){
        var list_t=csstr.split('\n');
        var result_t=[];
        var bljg='';
        var old_name='';
        for (let arow of list_t){
            if (arow=='-----'){
                if (bljg!==''){
                    result_t.push([bljg,old_name]);
                    bljg='';
                }
                old_name='';
            } else if (arow.match(/^---\s*\d+\s*---$/)){
                var current_name=arow.replace(/^---\s*(\d+)\s*---$/,'$1');
                if (bljg!==''){
                    result_t.push([bljg,old_name]);
                    bljg='';
                }
                old_name=current_name;
            } else {
                bljg=bljg+arow+'\n';
            }
        }
        if (bljg!==''){
            result_t.push([bljg,old_name]);
        }
        return result_t;
    }
    
    var list_t=('\n'+csstr+'\n').replace(/\n---\s*\d+\s*---\n/g,'\n-----\n').split('\n-----\n');
    var result_t=[];
    for (let item of list_t){
        if (item.trim()==''){continue;}
        result_t.push(item);
    }
    return result_t;
}

function data_lines_2_latlon_gps_points_b(csstr='',cstype='latlon',textarea_id='textarea_gps_points'){
    if (csstr==''){
        csstr=document.getElementById(textarea_id).value.trim();
    }
    if (Array.isArray(csstr)){
        var list_t=csstr;
    } else {
        var list_t=csstr.split('\n');
    }
    
    if (cstype==''){
        return lines_gpsinfo_2_dots_leaflet_b(list_t);
    } else {
        return lines_latlon_2_dots_leaflet_b(list_t,cstype);
    }
}

function remove_data_in_textarea_leaflet_b(restore_type='',odom=false,textarea_id_for_remove=''){
    var otextarea=document.getElementById(textarea_id_for_remove);
    if (!otextarea){return;}
    
    var list_t=current_line_lat_lon_get_leaflet_b(restore_type);
    var bllen=list_t.length;
    if (bllen==0){return;}
    
    var current_name='';
    if (odom){
        var ocaption=odom.parentNode.querySelector('span.span_line_caption_leaflet');
        if (ocaption){
            current_name=ocaption.innerText;
        }
    }
    
    var textarea_str=otextarea.value.trim();
    var content_t=horizontal_delimiter_split_gps_points_b(textarea_str,true);
    var result_t=[];
    for (let blxl=0,lent=content_t.length;blxl<lent;blxl++){
        var line_str=content_t[blxl][0];
        var blname=content_t[blxl][1];
        
        content_t[blxl]=data_lines_2_latlon_gps_points_b(line_str,'latlon');
        if (content_t[blxl].length!==bllen){continue;}
        if (current_name!=='' && current_name!==blname){continue;}  //忽略名称不一致的线条 - 保留注释
        
        var distance=0;
        var error_found=false;
        for (let blno=0,lenb=content_t[blxl].length;blno<lenb;blno++){
            content_t[blxl][blno]=transform_lon_lat_one_dot_b(restore_type,content_t[blxl][blno][1],content_t[blxl][blno][0],true);
            var two_points_len=distance_leaflet_b(content_t[blxl][blno],list_t[blno]);
            if (two_points_len>1000){   //超过一定距离（米），则忽略 - 保留注释
                error_found=true;
                break;
            }
            distance=distance+two_points_len;
        }
        if (error_found){continue;}
        result_t.push([distance/bllen,blname,line_str]);
    }
    
    if (result_t.length==0){
        alert('获得结果数为0，未发现对应数据');
        return;
    }
    
    result_t.sort(function (a,b){return a[0]<b[0]?-1:1;});
    var bljg=result_t[0];
    
    var blreg=new RegExp('^---\\s*'+bljg[1]+'\\s*---\\n'+bljg[2],'mg');
    if (textarea_str.match(blreg)==null){
        blreg=new RegExp('^---\\s*'+bljg[1]+'\\s*---\\n'+bljg[2].trimRight()+'$','mg'); //必须添加 .trimRight() - 保留注释
        if (textarea_str.match(blreg)==null){
            alert('match 结果为 null，未发现对应名称为 '+bljg[1]+' 的数据');
            return;
        }
    }

    if (confirm('是否移除编辑框数据中的名为 '+bljg[1]+' 的数据，其行数为 '+bllen+' 行？')==false){return;}
    
    otextarea.value=textarea_str.replace(blreg,'');
}

function current_line_lat_lon_get_leaflet_b(restore_type=''){
    if (typeof gpx_current_geometry_data_global == 'undefined'){return [];}
    if (Array.isArray(gpx_current_geometry_data_global)==false){return [];}
    var list_t=[];
    for (let item of gpx_current_geometry_data_global){
        list_t.push(transform_lon_lat_one_dot_b(restore_type,item['lng'],item['lat'],true));
    }
    return list_t;
}

function data_2_gpx_file_leaflet_b(restore_type='',odom=false){
    var list_t=current_line_lat_lon_get_leaflet_b(restore_type);
    if (list_t.length==0){return;}
    
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
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
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

function rectangle_angles_leaflet_b(southWest,northEast,return_dict=true){
    var northWest = L.latLng(northEast.lat, southWest.lng);
    var southEast = L.latLng(southWest.lat, northEast.lng);
    if (return_dict){
        return {'nw':northWest,'se':southEast};
    } else {
        return [northWest,southEast];
    }
}

function lat_lon_status_b(cslat,cslon,status_id,csmap){
    //[cslon,cslat]=transform_lon_lat_one_dot_b(transform_type,cslon,cslat);
    var ostatus=document.getElementById(status_id);
    if (ostatus){
        ostatus.innerHTML='('+csmap.getZoom()+') lat,lng: '+cslat+','+cslon;
        clicked_lat_lng_global=[cslat,cslon];
        
        //circle_leaflet_b(csmap,false,cslon,cslat);    //根据存储坐标画圆来检验位置一致性 - 保留注释
        
        return true;
    }
    return false;
}
