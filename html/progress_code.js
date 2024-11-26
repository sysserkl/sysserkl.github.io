function init_progress(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    var input_list=[
    ['input_min_date_prog',10,0.5],
    ['input_max_date_prog',10,0.5],
    ['input_max_lines_prog',8,0.5],
    ['input_keys_prog',11,0.9],
    ];
    input_size_b(input_list,'id');    
    menu_progress();
    character_2_icon_b('📈');
}

function menu_progress(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'category_progress(\'enwords\');">enwords</span>',
    '<span class="span_menu" onclick="'+str_t+'category_progress(\'miscellaneous\');">miscellaneous</span>',    
    '<span id="span_show_table_progress" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ table</span>',    
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'📈','14rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_show_table_progress',true);            
}

function category_progress(csname){
    var show_table=klmenu_check_b('span_show_table_progress',false);
    var date_min=document.getElementById('input_min_date_prog').value.trim();
    var date_max=document.getElementById('input_max_date_prog').value.trim();
    var max_lines=document.getElementById('input_max_lines_prog').value.trim();
    var filter_str=document.getElementById('input_keys_prog').value.trim();
    var flot_type=document.getElementById('selection_flot_type_prog').value;
    
    date_min=(date_min==''?false:date_min);
    date_max=(date_max==''?false:date_max);
    max_lines=(max_lines==''?false:max_lines);

    var result_t=statistics_draw_b(csname,'divhtml',show_table,date_min,date_max,max_lines,2,'810px','100%','500px',true,filter_str,flot_type);
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]='<span class="oblong_box" onclick="jump_to_item_progress('+blxl+');">'+result_t[blxl][1]+'</span>'
    }
    var op=document.getElementById('p_bookmark_progress');
    op.innerHTML=result_t.join(' ');
    mouseover_mouseout_oblong_span_b(op.querySelectorAll('span.oblong_box'));    
}

function jump_to_item_progress(csno){
    var odivs=document.querySelectorAll('div.div_statistics_plot_b');
    if (csno>=0 && csno<=odivs.length-1){
        odivs[csno].scrollIntoView();
    }
}
