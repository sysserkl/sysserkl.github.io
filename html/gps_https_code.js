function buttons_gps(){
    var bljg='<input type="number" min=1 id="input_second" value=5 /> ';
    bljg=bljg+'<span class="aclick" onclick="run_times_global=0;run_gps_global=setInterval(record_write_gps,document.getElementById(\'input_second\').value*1000);">Start</span>';
    bljg=bljg+'<span class="aclick" onclick="clearInterval(run_gps_global);">Stop</span>';
    bljg=bljg+'<span class="aclick" onclick="record_clear_gps();">Clear Records</span>';
    bljg=bljg+'<span class="aclick" onclick="record_export_gps();">Export Records</span>';
    return bljg;
}

function height_gps(){
    var window_h_global=document_body_offsetHeight_b();
    document.getElementById('span_status').innerHTML='GPS';
    document.getElementById('span_buttons').innerHTML=buttons_gps();

    var rect =document.getElementById('div_gps').getBoundingClientRect();
    document.getElementById('div_map').style.height=Math.max(300,(window_h_global-rect.height))+'px';
}

function record_write_gps(){
    point_gps('record');
}

function record_export_gps(){
    //2019-11-06 19:00:37,lon,lat - 保留注释
    var list_t=local_storage_get_b('gps',-1,true);
    list_t.reverse();
    var bljg='';
    for (let item of list_t){
        var arow=item.split(',');
        if (arow.length==3){
            bljg=bljg+'<trkpt lat="'+arow[2]+'" lon="'+arow[1]+'"></trkpt>\n';
        }
    }
    if (bljg!==''){
        var bltop='<?xml version="1.0" encoding="UTF-8"?>\n';
        bltop=bltop+'<gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.topografix.com/GPX/1/1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="Javascript">\n';
        bltop=bltop+'<trk><name>GPS_Javascript'+list_t[0].split(',')[0].trim()+'</name>\n';
        bltop=bltop+'<trkseg>\n';
        
        var blbottom='</trkseg>\n</trk>\n</gpx>\n';
        bljg=bltop+bljg+blbottom;
    }
    
    var odiv=document.getElementById('div_export');
    odiv.style.display='block';
    odiv.innerHTML='<textarea>'+bljg+'</textarea><br /><span class="span_link" onclick="this.parentNode.style.display=\'none\';">Close</span>';
}

function record_clear_gps(){
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认清空') || '').trim()==rndstr){
        localStorage.setItem('gps','');
    }
}

function success_record_gps(position){
    if (lon_gps_global==position.coords.longitude && lat_gps_global==position.coords.latitude){
        return;
    }
    
    var old_lon=lon_gps_global;
    var old_lat=lat_gps_global;
    lon_gps_global = position.coords.longitude;
    lat_gps_global  = position.coords.latitude;
    document.getElementById('span_status').innerHTML = 'Lon: '+lon_gps_global+', Lat: '+lat_gps_global;

    var myLines = [{
    'type': 'LineString',
    'coordinates': [[old_lon, old_lat], [lon_gps_global,lat_gps_global]],
    },];
    
    myLayer = L.geoJSON().addTo(omap_gps_global);
    myLayer.addData(myLines);
    
    local_storage_today_b('gps',20000,csnewcontent=lon_gps_global+','+lat_gps_global,',',[],'dt');
    
    run_times_global=run_times_global+1;
    document.getElementById('span_count').innerHTML=run_times_global;
}

function error_record_gps(){
    document.getElementById('span_status').innerHTML = 'Unable to retrieve your location';
    map_gps();
}

function success_init_gps(position){
    lon_gps_global = position.coords.longitude;
    lat_gps_global  = position.coords.latitude;
    document.getElementById('span_status').innerHTML = 'Lon: '+lon_gps_global+', Lat: '+lat_gps_global;
    map_gps(lon_gps_global,lat_gps_global);
}

function error_init_gps(){
    document.getElementById('span_status').innerHTML = 'Unable to retrieve your location';
    map_gps();
}

function map_gps(cslon=121.5,cslat=31.2){
    var myLines = [{
    'type': 'Point',
    'coordinates': [cslon, cslat],
    },];

    if (omap_gps_global==false){
        omap_gps_global = L.map('div_map').setView([cslat,cslon], 16);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
        {
        attribution: '',
        maxZoom: 20,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoid3k3MzA1ZSIsImEiOiJjazJuMG9laTEwMWJqM2xtenZ2eXduMHdtIn0.yh0uJghsB8Ci-Kd2Scy_wA',
        }
        ).addTo(omap_gps_global);
    }
    
    var myLayer = L.geoJSON().addTo(omap_gps_global);
    myLayer.addData(myLines);
}

function point_gps(cstype='init'){
    if (!navigator.geolocation){
        document.getElementById('span_status').innerHTML = 'Geolocation is not supported by your browser';
    } else {
        if (cstype=='init'){
            navigator.geolocation.getCurrentPosition(success_init_gps, error_init_gps);
        } else if (cstype=='record'){
            navigator.geolocation.getCurrentPosition(success_record_gps, error_record_gps);
        }
    }
}
