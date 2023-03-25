function load_data_enarticle(){
    enwords_article=[];
    for (let item of filelist){
        if (item.includes('&gt;&lt;/eword&gt;')){   //符合条件的行数很少 - 保留注释
            enwords_article.push(item);
        }
    }
    filelist=[];
}

function init_enarticle(){
    input_with_x_b('input_search',(ismobile_b()?11:22),'',false,'input_reg',true);
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.8rem':'1.4rem'),true,true,2);
    menu_enarticle();

    words_searched_arr=[];
    enwords_init_b();
    input_date_set_enwords_b();
    
    enwords_mini_search_frame_style_b();
    enwords_mini_search_frame_form_b();
    
    article_words_list_enwc_b();
}

function menu_enarticle(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'show_sentence_enwc_b(0,true,true);">显示例句</span>',    
    ];
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','12rem','1.1rem','1rem','60rem'),'','0rem')+' ');
}
