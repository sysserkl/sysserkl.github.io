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
        var buttons_t=[];
        var result_t=[];
        var button_str,iframe_str;
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            [button_str,iframe_str]=iframe_generate_b(blxl,list_t[blxl],list_t[blxl]);
            buttons_t.push(button_str);
            result_t.push(iframe_str);        
        }
        
        var odiv=document.getElementById('div_status');
        odiv.innerHTML='<p id="p_buttons_kls">'+buttons_t.join(' ')+'</p>'+result_t.join('\n');
        odiv.scrollIntoView();        
        iframe_init_b();
        return;
    }
    
    var blxl=0;
    var bllen=list_t.length;
    sub_sync_pages_batch_open_js_tts_one_page();
} 
