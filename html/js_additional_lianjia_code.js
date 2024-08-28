function menu_more_lianjia(){
    var str_t=klmenu_hide_b('');
    
    var col_name_list=Object.keys(table_th_jscm_global);
    var klmenu1=[
    '<a href="https://map.ke.com/map/" onclick="'+str_t+'" target=_blank>ke</a>',    
    klmenu_select_sort_b('select_sort_type_jsad_lianjia',col_name_list,str_t,'sort_lianjia'),
    '<span class="span_menu" id="span_menu_for_sort_lianjia"></span>',
    '<span class="span_menu">挂牌价分段范围：<input type="text" id="input_price_range_jsad_lianjia" value="10000,40000,8,blue,red" style="width:10rem;" /></span>',  
    '<span class="span_menu">半径：<input type="number" id="input_radius_jsad_lianjia" value="20" style="width:5rem;" min=0 /></span>',
    '<span id="span_radius_amount_lianjia" class="span_menu" onclick="klmenu_check_b(this.id,true);">⚪ 套数*半径</span>',
    '<span class="span_menu" onclick="'+str_t+'statistics_price_range_lianjia();">挂牌价分区</span>',        
    ];
    return klmenu_b(klmenu1,'🛖','12rem','1rem','1rem','30rem');
}

function file_load_lianjia(){
    flot_load_common(['leaflet']);
}

function sort_lianjia(is_desc=false){
    var rank_no=parseInt(document.getElementById('select_sort_type_jsad_lianjia').value);
    var col_name_list=Object.keys(table_th_jscm_global);
    var blname=col_name_list[rank_no];
    
    if (['地市','版块'].includes(blname)){
        lianjia_subdistrict_global.sort(function (a,b){return zh_sort_b(a,b,is_desc,rank_no);});            
    } else if (blname=='扫描日期'){
        if (is_desc){
            lianjia_subdistrict_global.sort(function (a,b){return new Date(a[rank_no])<new Date(b[rank_no]) ? 1 : -1;});
        } else {
            lianjia_subdistrict_global.sort(function (a,b){return new Date(a[rank_no])>new Date(b[rank_no]) ? 1 : -1;});    
        }
    } else if (['lat','lng','挂牌价','套数'].includes(blname)){
        if (is_desc){
            lianjia_subdistrict_global.sort(function (a,b){return parseFloat(a[rank_no])<parseFloat(b[rank_no]) ? 1 : -1;});
        } else {
            lianjia_subdistrict_global.sort(function (a,b){return parseFloat(a[rank_no])>parseFloat(b[rank_no]) ? 1 : -1;});    
        }    
    } else {
        if (is_desc){
            lianjia_subdistrict_global.sort(function (a,b){return a[rank_no]<b[rank_no] ? 1 : -1;});
        } else {
            lianjia_subdistrict_global.sort(function (a,b){return a[rank_no]>b[rank_no] ? 1 : -1;});    
        }        
    }
}

function statistics_price_range_lianjia(){
    var range_list=document.getElementById('input_price_range_jsad_lianjia').value.trim().split(',');
    
    var color_list,legend,min_value,max_value,demo_list;
    [color_list,legend,min_value,max_value,demo_list]=color_list_generate_b(range_list,3,-1,false);
    if (color_list==false){
        alert('需要5个元素');
        return;
    }
    
    console.log('color_list',color_list);
    console.log('min_value',min_value);
    console.log('max_value',max_value,'max_value 设为 false');

    var key_list=Object.keys(table_th_jscm_global);
    var price_at=key_list.indexOf('挂牌价');    
    var amount_at=key_list.indexOf('套数');
    var lat_at=key_list.indexOf('lat');
    var lng_at=key_list.indexOf('lng');
    
    var blradius=parseInt(document.getElementById('input_radius_jsad_lianjia').value.trim());
    var radius_amount=klmenu_check_b('span_radius_amount_lianjia',false);
    
    var result_t={};
    for (let arow of js_data_current_common_search_global){        
        var blvalue=parseFloat(arow[0][price_at]);
        var blcolor=value_in_color_range_b(blvalue*10000,color_list,min_value,false);
        if (result_t['c_'+blcolor]==undefined){
            result_t['c_'+blcolor]=[];
        }
        
        var lng_lat=transform_lon_lat_one_dot_b('BD09_TO_WGS84',arow[0][lng_at],arow[0][lat_at]);
        result_t['c_'+blcolor].push(lng_lat[0]+','+lng_lat[1]+','+(radius_amount?Math.round(blradius*parseFloat(arow[0][amount_at])):blradius)+','+blcolor);
    }
    
    for (let key in result_t){
        result_t[key]='circle='+result_t[key].join(';');
    }
    result_t=object2array_b(result_t);
    document.getElementById('divhtml').innerHTML='<textarea>'+result_t.join('\n')+'</textarea><p><span>'+legend.join('')+'</span> <small>('+demo_list.join(' ')+')</small></p>';
}

function data_load_lianjia(array_name){
    function sub_data_load_lianjia_remove(col_name){
        var blat=Object.keys(table_th_jscm_global).indexOf(col_name);
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            result_t[blxl]=result_t[blxl].slice(0,blat).concat(result_t[blxl].slice(blat+1,));
        }
        delete table_th_jscm_global[col_name];        
    }
    
    var result_t=[];
    var error_list=[];
    var type_set=new Set();
    var lat_is_empty=true;
    var lng_is_empty=true;
    
    table_th_jscm_global={'地市':'','版块':'','类型':'','GPS':'','lat':'','lng':'','挂牌价':'right','套数':'right','扫描日期':''};

    var key_list=Object.keys(table_th_jscm_global);
    var price_at=key_list.indexOf('挂牌价');
    var amount_at=key_list.indexOf('套数');
    var type_at=key_list.indexOf('版块');
    var lat_at=key_list.indexOf('lat');
    var lng_at=key_list.indexOf('lng');
    
    for (let adata of eval(array_name)){
        if (adata[price_at].endsWith('万')){
            adata[price_at]=adata[price_at].slice(0,-1);
            adata[price_at]=parseFloat(adata[price_at]).toFixed(2);
        } else {
            error_list.push(adata);
            continue;
        }

        if (adata[amount_at].endsWith('套')){
            adata[amount_at]=adata[amount_at].slice(0,-1);
        } else {
            error_list.push(adata);
            continue;
        }
        type_set.add(adata[type_at]);
        if (adata[lat_at]!==''){
            lat_is_empty=false;
        }
        if (adata[lng_at]!==''){
            lng_is_empty=false;
        }        
        result_t.push(adata);
    }

    if (var_name_jscm_global=='lianjia_subdistrict_global'){
        sub_data_load_lianjia_remove('GPS');
    }
    
    if (type_set.size=1){
        sub_data_load_lianjia_remove('类型');
    }
    
    if (lat_is_empty){
        sub_data_load_lianjia_remove('lat');
    }

    if (lng_is_empty){
        sub_data_load_lianjia_remove('lng');
    }    

    result_t.sort(function (a,b){return zh_sort_b(a,b,true,0);});
    result_t.sort(function (a,b){return zh_sort_b(a,b,true,1);});

    price_at=Object.keys(table_th_jscm_global).indexOf('挂牌价');    
    result_t.sort(function (a,b){return a[price_at]>b[price_at]?-1:1;});
            
    eval(array_name+'=result_t');
    raw_data_len_jscm_global=result_t.length;
    document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
    if (error_list.length>0){
        document.getElementById('divhtml').innerHTML='<h4>错误行</h4><textarea>'+error_list.join('\n')+'</textarea>';
    }
}

function col_rearrange_lianjia(){
    if (js_data_current_common_search_global.length==0){return [];}
    
    var list_t=[];
    var bllen=js_data_current_common_search_global[0][0].length;

    var key_list=Object.keys(table_th_jscm_global);

    var blat=key_list.indexOf('扫描日期');
    for (let arow of js_data_current_common_search_global){        
        var new_row=[].concat(arow[0]);
        new_row[blat]='<small>'+new_row[blat]+'</small>';
        list_t.push([new_row,arow[1]]);
    }
    
    if (var_name_jscm_global=='lianjia_gps_global'){
        var blat=key_list.indexOf('GPS');
        for (let arow of list_t){        
            arow[0][blat]='<small>'+arow[0][blat]+'</small>';
        }
    }
    return list_t;
}
