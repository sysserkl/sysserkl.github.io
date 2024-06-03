function form_generate_js_tts(){
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_temp_txt_share" id="textarea_temp_txt_share" style="height:'+(ismobile_b()?'10':'20')+'rem;"></textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span id="span_update"></span><span style="color:#b0b0b0;font-size:0.8rem;"><i id="i_client_info"></i></span>';
    bljg=bljg+'</p>';
    bljg=bljg+'</form>\n';
    
    document.getElementById('div_temp_txt_share').insertAdjacentHTML('afterbegin',bljg);
}

function menu_more_js_tts(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'sync_pages_batch_open_js_tts();">批量打开需同步页面</span>', 
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    load_sentence_menu_b(str_t), 
    ];
    return klmenu_b(klmenu1,'🌑','12rem','1rem','1rem','30rem');
}

function sync_pages_batch_open_js_tts(){
    function sub_sync_pages_batch_open_js_tts_one_page(){
        if (blxl>=bllen){return;}
        window.open(sele_path+'/html/'+list_t[blxl]);
        blxl=blxl+1;
        setTimeout(sub_sync_pages_batch_open_js_tts_one_page,2000);
    }
    
    var sele_path=klbase_sele_path_b()[1];
    var list_t=[
    'enwords.htm',
    'reader.htm?_tagNONE',
    'selenium_enwords.htm',
    'readlater.htm',
    'notepad.htm',
    ];
    
    var blxl=0;
    var bllen=list_t.length;
    sub_sync_pages_batch_open_js_tts_one_page();
} 
