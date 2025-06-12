function menu_more_js_tts(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',    
    load_sentence_menu_b(str_t), 
    ];
    
    var group_list=[
    ['批量打开需同步页面','sync_pages_batch_open_js_tts();',true],
    ['iframe','sync_pages_batch_open_js_tts(true);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    return klmenu_b(klmenu1,'🌑','17rem','1rem','1rem','30rem');
}

function sync_pages_batch_open_js_tts(is_iframe=false){
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
    
    if (is_iframe){
        var odiv=document.getElementById('div_status');
        odiv.scrollIntoView();

        odiv.innerHTML='<p></p><div></div>';
        var op=odiv.querySelector('p');
        var ocontent=odiv.querySelector('div');
        
        iframe_init_b(list_t,op,ocontent);
        return;
    }
    
    var blxl=0;
    var bllen=list_t.length;
    sub_sync_pages_batch_open_js_tts_one_page();
} 
