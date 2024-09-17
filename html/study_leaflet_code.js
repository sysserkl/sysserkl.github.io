function simple_study_leaflet(){
    var map = L.map('td_study_leaflet').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'study leaflet attribution'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('<b>study</b> <span style="font-size:2rem;">leaflet</span> <a href="https://leafletjs.com/" target=_blank>marker</a>')
    .openPopup();
}

function li_filter_study_leaflet(cskey){
    var olis=document.querySelectorAll('ol#ol_menu li');
    obj_search_show_hide_b(olis,'',cskey,klmenu_check_b('span_reg_study',false),true);
}

function li_show_study_leaflet(){
    study_js_type_dict_global={   //全局变量，*表示显示源代码但不执行 - 保留注释
    //study_dict_start
    'simple':['simple_study_leaflet'],    
    //study_dict_end
    }
        
    var bljg=[];
    for (let blkey in study_js_type_dict_global){
        bljg.push('<li><span class="span_link" onclick="run_source_study_leaflet(\''+blkey+'\');">'+blkey+'</span></li>');
    }
    document.getElementById('ol_menu').innerHTML=bljg.join('\n');
    current_li_value_study_leaflet_global=Object.keys(study_js_type_dict_global)[0];
}

function run_source_study_leaflet(cstype,view_source=true){
    var otd=document.getElementById('td_interactive_info');
    otd.innerHTML='';
    otd.setAttribute('align','');
    document.getElementById('div_interactive_info').style.display='none';
    
    if (! cstype in study_js_type_dict_global){return;}
    current_li_value_study_leaflet_global=cstype;
    var fun_list=study_js_type_dict_global[cstype];

    var otd=document.getElementById('td_study_leaflet');
    otd.innerHTML='';
    run_or_view_source_klh_b(view_source,fun_list,otd);
}

function menu_study_leaflet(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://leafletjs.com/" target=_blank>leafletjs</a>',    
    '<a href="https://github.com/Leaflet/Leaflet" target=_blank>GitHub</a>',    
    '<a href="https://leafletjs.com/examples.html" target=_blank>Tutorials</a>',        
    '<a href="https://leafletjs.com/examples/quick-start/" target=_blank>Quick Start Guide</a>',        
    '<a href="https://leafletjs.com/reference.html" target=_blank>Documentation</a>',        
    '<a href="https://leafletjs.com/plugins.html" target=_blank>Plugins</a>',    
    '<span id="span_reg_study" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',            
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'📍','12rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_study',true);
}

function init_study_leaflet(){
    document.getElementById('td_study_leaflet').style.height=body_height_study_leaflet_global*0.9+'px';
    input_with_x_b('input_search',8);    
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('td#td_study_list span.oblong_box'));        
    menu_study_leaflet();
    li_show_study_leaflet();
}
