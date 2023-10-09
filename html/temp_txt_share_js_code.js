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
