function menu_img_viewer(){
    var button_size='1rem';
    var str_t=klmenu_hide_b('');

    var menu_config=root_font_size_menu_b(str_t);
    menu_config=menu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'export_form_klphotos_b();">导出数组和标记图片</span>',    
    '<span id="span_black_bg_klphoto" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 幻灯片黑色背景</span>',    
    ]);   

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(menu_config,'🖽️','15rem',button_size,button_size),'','0rem')+' ');
    
    //-----------------------
    var button_more='<div class=klmenu><button style=font-size:'+button_size+';" onclick="popup_show_hide_b(\'div_tempphoto_list\');">临时图片文件列表</button></div>';

    document.getElementById('div_toolbar2').insertAdjacentHTML('afterbegin',klmenu_multi_button_div_b(button_more,'block','0','0.2rem 0rem 0rem 0rem'));
}

function init_img_viewer(){
    //variable global
    imgnum_global=0;
    current_page_first_img_num_global=0;
    pageitems_global=30;
    //imgshow_klphotos_global=false;
    //photodata_global=[];   //文件名，数组分类名，在 photo_source_global 中的序号 - 保留注释
    img_sec_global=0;

    div_generate_klphotos_b();

    input_with_x_b('input_search',15);
    slide_klphotos_b(true);
    hide_div_big_photo_b();
    
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'2rem':'1.5rem'));

    album_marked_rows_get_klphotos_b();

    if (is_local_b()){
        menu_img_viewer();
        recent_search_klphotos_b();
    }    
}
