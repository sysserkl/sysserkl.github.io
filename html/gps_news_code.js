function buttons_gps_news(){
    var bljg='<select id="select_transform" style="max-width:5rem;">\n';
    bljg=bljg+'<option></option>\n';
    bljg=bljg+'<option>WGS84_TO_GCJ02</option>\n';
    bljg=bljg+'<option>GCJ02_TO_WGS84</option>\n';
    bljg=bljg+'</select>\n';
    bljg=bljg+'<input type="text" id="input_day_start_gps_news" placeholder="开始日期，格式如：20210525"> ';
    bljg=bljg+'<input type="text" id="input_day_end_gps_news" placeholder="结束日期，格式如：20210525"> ';
    bljg=bljg+'<span class="aclick" onclick="this.parentNode.parentNode.style.display=\'none\';">Close</span> ';
        
    bljg=bljg+textarea_with_form_generate_b('textarea_gps_news','height:20rem;','<p>','全选,清空,复制,发送到临时记事本,发送地址','222</p>','','form_gps_news');

    return bljg;
}

function current_layer_refresh_gps_news(){
    current_position_layer_gps_global.removeFrom(omap_gps_news_global);
    current_position_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    current_position_layer_gps_global.addTo(omap_gps_news_global);
}

function current_position_gps_news(){
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
            omap_gps_news_global.panTo(new L.LatLng(lat,lon));

            current_layer_refresh_gps_news();
            current_position_layer_gps_global.addLayer(L.marker([lat,lon]));
        },
        function (){
            document.getElementById('div_status').innerHTML='Unable to retrieve your location';        
        }
    );
}

function div_size_gps_news(){
    var window_h=document_body_offsetHeight_b();
    var odiv=document.getElementById('div_selection');
    odiv.style.maxHeight=Math.round(window_h*0.8)+'px';
    var rect =document.getElementById('div_gps_news').getBoundingClientRect();
    document.getElementById('div_map').style.height=Math.max(300,(window_h-rect.height))+'px';
}

function date_range_gps_news(){
    var list_t=array_split_by_col_b(gps_news_global,[0]);
    list_t.sort();
    var bllen=list_t.length;
    if (bllen==0){return;}
    document.getElementById('input_day_start_gps_news').value=list_t[0];
    document.getElementById('input_day_end_gps_news').value=list_t[bllen-1];
}

function init_gps_news(){
    div_size_gps_news();

    var lat_lon_value=[31.2,121.5];
    var zoom_value=6;
    var map_name_value='mapbox';    //gd 或 mapbox - 保留注释

    //-----------------------
    document.getElementById('div_icon').innerHTML='📰';
    document.getElementById('div_status').innerHTML='时局图';
    document.getElementById('div_buttons').innerHTML=buttons_gps_news();
    menu_gps_news();
    
    init_maps_leaflet_b();

    omap_gps_news_global = L.map('div_map', {
        center: lat_lon_value,
        zoom: zoom_value,
        layers: [klmaps_global[map_name_value]],    //[L.layerGroup([klmaps_global[map_name_value]])],
        closePopupOnClick: false,
    });

    L.control.layers(baselayers_leaflet_b(), null).addTo(omap_gps_news_global);

    navigation_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    navigation_layer_gps_global.addTo(omap_gps_news_global);

    current_position_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    current_position_layer_gps_global.addTo(omap_gps_news_global);

    //-----------------------
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
    }

    omap_gps_news_global.addEventListener('click', function(ev){
        var bltype=document.getElementById('select_transform').value;    
        var bllon;
        var bllat;
        [bllon,bllat]=transform_lon_lat_one_dot_b(bltype,ev.latlng.lng,ev.latlng.lat);
        document.getElementById('div_status').innerHTML='lat,lng: '+bllat+','+bllon;
        current_layer_refresh_gps_news();
    });
    
    date_range_gps_news();
    popup_gps_news();
}

function remove_navigation_gps_news(){
    navigation_layer_gps_global.removeFrom(omap_gps_news_global);
    navigation_layer_gps_global = L.layerGroup();    //全局变量，不加 var - 保留注释
    navigation_layer_gps_global.addTo(omap_gps_news_global);
}

function popup_gps_news(show_content=true){
    //gps_news_global 中的每一组格式 ["日期","地区","事件名称","网址","tag"]
    remove_navigation_gps_news();
    var bltype=document.getElementById('select_transform').value;
    var day_start=document.getElementById('input_day_start_gps_news').value.trim();
    var day_end=document.getElementById('input_day_end_gps_news').value.trim();
    
    var lng, lat;
    var district_list={};
    var bljg=[];
    for (let item of gps_news_global){
        if (item[0]<day_start || day_end!=='' && item[0]>day_end){continue;}
        
        [lng,lat]=district_cn_name_2_lnglat_b(item[1]);
        if (lng==false || lat==false){
            console.log('未找到位置',item);
            continue;
        }

        [lng,lat]=transform_lon_lat_one_dot_b(bltype,lng,lat);

        if (district_list['d'+lng+'_'+lat]==undefined){
            district_list['d'+lng+'_'+lat]=[lat,lng,[]];
        }
        district_list['d'+lng+'_'+lat][2].push((item[0]==''?'':item[0]+' | ')+'<a href="'+item[3]+'" target=_blank>'+item[2]+'</a>');
        bljg.push((item[0]==''?'':item[0]+' | ')+item[2]+' '+item[3]);
    }
    
    var blyear=date_2_ymd_b(false,'y');
    for (let key in district_list){
        district_list[key][2].sort().reverse();
        for (let blxl=0,lent=district_list[key][2].length;blxl<lent;blxl++){
            if (district_list[key][2][blxl].substring(0,4)==blyear && district_list[key][2][blxl].substring(8,11)==' | '){  //排除可能是 无日期 的记录 - 保留注释
                district_list[key][2][blxl]=district_list[key][2][blxl].substring(4,);
            }
        }
        
        var popupContent = district_list[key][2].join('<br />');
        var opopup = new L.Popup({'autoClose':false});
        opopup.setLatLng(new L.LatLng(district_list[key][0],district_list[key][1]));
        opopup.setContent(popupContent);        
        
        var omarker=L.marker([district_list[key][0],district_list[key][1]]).addTo(navigation_layer_gps_global)
        .bindPopup(opopup);
        if (show_content){
            omarker.openPopup();
        }
        
        //navigation_layer_gps_global.addLayer(opopup); //此行保留 - 保留注释
        omap_gps_news_global.panTo(new L.LatLng(district_list[key][0],district_list[key][1]));
    }
    
    bljg.sort().reverse();
    document.getElementById('textarea_gps_news').value=bljg.join('\n');
}

function menu_gps_news(){
    var str_t=klmenu_hide_b('');
    var klmenu_gpx=[
    '<span class="span_menu" onclick="'+str_t+'popup_gps_news();">重绘</span>',    
    '<span class="span_menu" onclick="'+str_t+'popup_gps_news(false);">重绘(仅标记点)</span>',
    '<span class="span_menu" onclick="'+str_t+'remove_navigation_gps_news();">清除路线</span>',
    ];
    
    document.getElementById('select_transform').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_gpx,'⛰','10rem','1rem','1rem','60rem'),'','0rem')+' ');
}


