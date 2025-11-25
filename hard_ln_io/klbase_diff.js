function tab2space_diff_b(){
    function sub_tab2space_one_by_one_diff_b(csstr){
        csstr=csstr.replace(/\t/g,' ');
        while (csstr.includes('  ')){
            csstr=csstr.replace(new RegExp('  ','g'),' ');
        }
        return csstr;
    }
    //-----------------------
    var texta=document.querySelector('textarea[name="textarea_diff_1"]');
    var textb=document.querySelector('textarea[name="textarea_diff_2"]');
    if (texta && textb){
        texta.value=sub_tab2space_one_by_one_diff_b(texta.value);
        textb.value=sub_tab2space_one_by_one_diff_b(textb.value);
    }
}

function clear_textarea_diff_b(csno,cstype){
    if (csno=='12'){
        if (confirm('是否清空两个编辑框？')){
            document.querySelector('textarea[name="textarea_'+cstype+'_1"]').value='';
            document.querySelector('textarea[name="textarea_'+cstype+'_2"]').value='';
        }
    } else {
        if (confirm('是否清空编辑框？')){
            document.querySelector('textarea[name="textarea_'+cstype+'_'+csno+'"]').value='';
        }
    }
}

function remove_cn_space_diff_b(){
    function sub_remove_cn_space_one_by_one_diff_b(csstr){
        while (true){
            if (csstr.match(/[^\x00-\xff]\s+[^\x00-\xff]/)==null){break;}
            csstr=csstr.replace(/([^\x00-\xff])\s+([^\x00-\xff])/g,'$1$2');
            csstr=csstr.trim();
        }
        return csstr;
    }
    //-----------------------
    var texta=document.querySelector('textarea[name="textarea_diff_1"]');
    var textb=document.querySelector('textarea[name="textarea_diff_2"]');
    if (texta && textb){
        texta.value=sub_remove_cn_space_one_by_one_diff_b(texta.value);
        textb.value=sub_remove_cn_space_one_by_one_diff_b(textb.value);
    }
}

function remove_all_space_diff_b(){
    function sub_remove_all_space_one_by_one_diff_b(csstr){
        csstr=csstr.replace(new RegExp(' ','g'),'');
        csstr=csstr.trim();
        return csstr;
    }
    //-----------------------
    var texta=document.querySelector('textarea[name="textarea_diff_1"]');
    var textb=document.querySelector('textarea[name="textarea_diff_2"]');
    if (texta && textb){
        texta.value=sub_remove_all_space_one_by_one_diff_b(texta.value);
        textb.value=sub_remove_all_space_one_by_one_diff_b(textb.value);
    }
}

function remove_space_diff_b(){
    function sub_remove_space_one_by_one_diff_b(csstr){
        csstr=csstr.replace(/\r\n/g,'\n');
        csstr=csstr.trim();
        while (csstr.includes('\n ')){
            csstr=csstr.replace(/\n /g,'\n');
        }
        while (csstr.includes(' \n')){
            csstr=csstr.replace(/ \n/g,'\n');
        }
        return csstr;
    }
    //-----------------------
    var texta=document.querySelector('textarea[name="textarea_diff_1"]');
    var textb=document.querySelector('textarea[name="textarea_diff_2"]');
    if (texta && textb){
        texta.value=sub_remove_space_one_by_one_diff_b(texta.value);
        textb.value=sub_remove_space_one_by_one_diff_b(textb.value);
    }
}

function remove_empty_lines_diff_b(){
    function sub_remove_empty_lines_one_by_one_diff_b(csstr){
        csstr=csstr.replace(/\r\n/g,'\n');
        while (csstr.includes('\n\n')){
            csstr=csstr.replace(/\n\n/g,'\n');
        }
        return csstr;
    }
    //-----------------------
    var texta=document.querySelector('textarea[name="textarea_diff_1"]');
    var textb=document.querySelector('textarea[name="textarea_diff_2"]');
    if (texta && textb){
        texta.value=sub_remove_empty_lines_one_by_one_diff_b(texta.value);
        textb.value=sub_remove_empty_lines_one_by_one_diff_b(textb.value);
    }
}

function compare_lines_diff_b(do_submit=false,other_string=''){
    var odiv=div_get_diff_b();
    if (!odiv){return;}

    var blstr1=document.querySelector('textarea[name="textarea_diff_1"]').value;
    var blstr2=document.querySelector('textarea[name="textarea_diff_2"]').value;
    if (blstr1==blstr2){
        odiv.innerHTML=other_string+'<h3>行差集 '+time_get_diff_b()+'</h3><p>完全一致</p>';   
        odiv.scrollIntoView();
        return;
    }
    
    if (do_submit){
        document.getElementById('form_diff').submit();
        return;
    }
    
    var list_t1=blstr1.split('\n');
    var list_t2=blstr2.split('\n');
    var diff1=array_difference_b(list_t1,list_t2);
    var diff2=array_difference_b(list_t2,list_t1);
    
    var result_t=[];
    result_t.push('<h4>行数</h4>');
    result_t.push('<p>'+list_t1.length+' - '+list_t2.length+'</p>');

    if (list_t1.length>=list_t2.length){
        var max_list=list_t1;
        var min_list=list_t2;
    } else {
        var max_list=list_t2;
        var min_list=list_t1;    
    }

    var blfound=false;
    for (let blxl=0,lent=min_list.length;blxl<lent;blxl++){
        if (min_list[blxl]!==max_list[blxl]){
            blfound=true;
            result_t.push('<p>从第'+(blxl+1)+'行起不同</p>');
            break;    
        }
    }
    if (blfound==false){
        result_t.push('<p>从第'+(min_list.length+1)+'行起不同</p>');
    }

    if (diff1.length>0){
        result_t.push('<p style="background-color:'+scheme_global['skyblue']+';">-</p>');
        result_t.push('<div class="div_two_list_diff_1">'+array_2_li_b(diff1)+'</div>');
    }
    if (diff2.length>0){
        result_t.push('<p style="background-color:'+scheme_global['pink']+';">+</p>');
        result_t.push('<div class="div_two_list_diff_2">'+array_2_li_b(diff2)+'</div>');
    }
    odiv.innerHTML=other_string+'<h3>行差集 '+time_get_diff_b()+'</h3>'+result_t.join('\n');
    odiv.scrollIntoView();

    key_location_diff_b([[1,'textarea_diff_1'],[2,'textarea_diff_2']]);
}

function do_type_diff_b(){
    cstype=document.getElementById('select_do_type_diff').value;
    switch (cstype){
        case '替换连续空格为一个空格，替换\\t为空格':
            tab2space_diff_b();
            break;
        case '转换为英文标点':
            eng_punctuatin_diff_b();
            break;
        case '移除所有空格':
            remove_all_space_diff_b();
            break;
        case '移除汉字间的空格':
            remove_cn_space_diff_b();
            break;
        case 'add blank rows':
            blank_rows_add_klr_b('textarea_diff_1');
            blank_rows_add_klr_b('textarea_diff_2');
            break;
        case 'remove blank rows':
            blank_rows_remove_klr_b('textarea_diff_1');
            blank_rows_remove_klr_b('textarea_diff_2');
            break;
        case '隐藏/显示相同行':
            hide_show_diff_b();
            break;
    }
}

function buttons_diff_b(){
    var bljg='';
    bljg=bljg+'<select id="select_do_type_diff" style="height:2rem;">';
    for (let item of ['add blank rows','remove blank rows','替换连续空格为一个空格，替换\\t为空格','转换为英文标点','移除所有空格','移除汉字间的空格','隐藏/显示相同行']){
        bljg=bljg+'<option>'+item+'</option>';
    }
    bljg=bljg+'</select> ';
    bljg=bljg+'<span class="aclick" onclick="do_type_diff_b();">执行</span> ';    
    bljg=bljg+'<span class="aclick" onclick="remove_space_diff_b();">① 去除段落前后空格</span> ';
    bljg=bljg+'<span class="aclick" onclick="remove_empty_lines_diff_b();">② 去除空行</span> ';
    bljg=bljg+'<span class="aclick" onclick="remove_space_diff_b(); remove_empty_lines_diff_b();">① + ②</span> ';

    bljg=bljg+'<span class="aclick" onclick="clear_textarea_diff_b(\'12\',\'diff\');">♻ 清空两个编辑框</span> ';
    bljg=bljg+'<span class="aclick" onclick="compare_textarea_diff_b();">❸ 编辑框对比</span> ';    
    bljg=bljg+'<span class="aclick" onclick="compare_lines_diff_b();">❹ 行差集</span> ';    
    bljg=bljg+'<span class="aclick" onclick="compare_textarea_diff_b(true);">❸ + ❹</span> ';    
    
    document.getElementById('span_diff_buttons').innerHTML=bljg;
    
    document.querySelector('textarea[name="textarea_diff_1"]').insertAdjacentHTML('beforebegin','<p><span class="aclick" onclick="clear_textarea_diff_b(\'1\',\'diff\');">清空</span>'+textarea_buttons_b('textarea_diff_1','↑,↓')+' <input type="file" id="input_data_upload_txt1"> <span class="aclick" onclick="upload_txt_diff_b(1);">Upload TXT File</span></p>');
    document.querySelector('textarea[name="textarea_diff_2"]').insertAdjacentHTML('beforebegin','<p><span class="aclick" onclick="clear_textarea_diff_b(\'2\',\'diff\');">清空</span>'+textarea_buttons_b('textarea_diff_2','↑,↓')+' <input type="file" id="input_data_upload_txt2"> <span class="aclick" onclick="upload_txt_diff_b(2);">Upload TXT File</span></p>');
    
    var odiv=document.getElementById('div_line_compare_form');
    if (odiv){
        var blbuttons='<p><input type="text" id="input_line1_compare" style="width:90%;" /><span class="span_box" onclick="find_in_textarea_diff_b(1);" title="从编辑框指定位置开始查找字符串">📍</span></p>\n';
        blbuttons=blbuttons+'<p><input type="text" id="input_line2_compare" style="width:90%;" /><span class="span_box" onclick="find_in_textarea_diff_b(2);" title="从编辑框指定位置开始查找字符串">📍</span></p>\n';
        blbuttons=blbuttons+'<p><span class="aclick" onclick="compare_one_line_diff_b();">行对比</span>';
        blbuttons=blbuttons+'<span class="aclick" onclick="replace_textarea_diff_b(1);">左侧替换</span>';
        blbuttons=blbuttons+'<span class="aclick" onclick="replace_textarea_diff_b(2);">右侧替换</span>';
        blbuttons=blbuttons+'<label><input type="checkbox" id="checkbox_reg_diff_b" checked />正则</label> ';
        blbuttons=blbuttons+'<input type="text" id="input_reg_type_diff_b" style="width:4rem;" placeholder="i|m|g" value="img" />';
        blbuttons=blbuttons+'</p>';
        blbuttons=blbuttons+'<div id="div_line_compare_result"></div>';
        odiv.innerHTML=blbuttons;
    }
}

function replace_textarea_diff_b(cstype){
    var find_str=document.getElementById('input_line1_compare').value;
    var replace_to=document.getElementById('input_line2_compare').value;
    var is_reg=document.getElementById('checkbox_reg_diff_b').checked;
    var reg_type=document.getElementById('input_reg_type_diff_b').value.trim();
    var otextarea=document.getElementById('textarea_diff_'+cstype);
    var old_str=otextarea.value;
    if (old_str==''){return;}
    if (confirm('是否替换？')){
        if (is_reg){
            try {
                otextarea.value=old_str.replace(new RegExp(find_str,reg_type),replace_to);
            } catch (error){
                alert(error);
            }
        } else {
            otextarea.value=old_str.replace(find_str,replace_to);
        }
    }
}

function find_in_textarea_diff_b(csno){
    var blstr=document.getElementById('input_line'+csno+'_compare').value;
    textarea_top_bottom_b('textarea_diff_'+csno,blstr,-1);
}

function time_get_diff_b(rnd_emoji=true){
     return '<span style="font-weight:normal; font-size:small;">'+now_time_str_b()+(rnd_emoji?emoji_category_b('human',-1):'')+'</span>';
}

function compare_textarea_diff_b(compare_lines=false){
    let diff_str,is_ok;
    [diff_str,is_ok]=two_list_diff_b(false,false,'textarea_diff_1','textarea_diff_2').slice(1,3);
    diff_str='<h3>编辑框对比 '+time_get_diff_b()+'</h3>'+diff_str;
    var odiv=document.getElementById('div_diff');
    if (odiv){
        odiv.innerHTML=diff_str;
    }
    key_location_diff_b([[1,'textarea_diff_1'],[2,'textarea_diff_2']]);
    
    if (is_ok && compare_lines){
        compare_lines_diff_b(false,diff_str);
    } else {
        odiv.scrollIntoView();
    }
}

function upload_txt_diff_b(csno){
    var ofile=document.getElementById('input_data_upload_txt'+csno).files[0];
    if (!ofile){return;}
    var blext=ofile.name.substring(ofile.name.toLowerCase().lastIndexOf('.'),).toLowerCase();
    
    if (!['.asp','.htm','.html','.js','.php','.py','.sh','.txt'].includes(blext)){
        alert('非txt文件：'+ofile.type+'\n'+ofile.name);
        return;
    }
    if (ofile.size>30*1024*1024){
        alert('文件太大：'+ofile.name+' '+ofile.size);  
        return;
    }
        
    var txtFile = new FileReader();
    txtFile.readAsText(ofile);
    txtFile.onload = function (){
        var otextarea=document.querySelector('textarea[name="textarea_diff_'+csno+'"]');
        otextarea.value='2'+this.result;
    }
}

function compare_one_line_diff_b(){
    var oinput1=document.getElementById('input_line1_compare');
    var oinput2=document.getElementById('input_line2_compare');
    var odiv=document.getElementById('div_line_compare_result');
    if (!oinput1 || !oinput2 || !odiv){return;}
    var bljg=[];
    var character1=new Set(oinput1.value.split(''));
    var character2=new Set(oinput2.value.split(''));
    bljg.push('line1-line2: '+Array.from(array_difference_b(character1,character2,true)));
    bljg.push('line2-line1: '+Array.from(array_difference_b(character2,character1,true)));

    var words1=new Set(oinput1.value.match(/\b([a-z]+)\b/ig) || []);    //js 与 python 处理方式不同 - 保留注释
    var words2=new Set(oinput2.value.match(/\b([a-z]+)\b/ig) || []);
    bljg.push('line1-line2: '+Array.from(array_difference_b(words1,words2,true)));
    bljg.push('line2-line1: '+Array.from(array_difference_b(words2,words1,true)));
    odiv.innerHTML=bljg.join('<br />');
}

function hide_show_diff_b(){
    var op_equals=document.getElementsByClassName('p_diff_equal');
    if (op_equals.length<1){return;}
    var new_status=(op_equals[0].style.display=='none'?'':'none');
    for (let item of op_equals){
        item.style.display=new_status;
    }
}

function count_diff_b(){
    var op_minus=document.getElementsByClassName('p_diff_minus');
    var op_plus=document.getElementsByClassName('p_diff_plus');
    var odiv=document.getElementById('div_diff');
    if (odiv){
        odiv.insertAdjacentHTML('afterbegin','<p style="font-size:1.5rem;"><b>-:</b> '+op_minus.length+'; <b>+:</b> '+op_plus.length+'</p><hr />');
    }
}

function div_get_diff_b(){
    var odiv=document.getElementById('div_diff');
    if (!odiv){
        var odiv_lines=document.getElementById('div_line_compare_form');
        if (odiv_lines){
            odiv_lines.insertAdjacentHTML('afterend','<div id="div_diff" style="border:0.2rem tomato dashed;padding:0.5rem;"></div>');
            odiv=document.getElementById('div_diff');
        }
    }
    return odiv;
}

function init_diff_b(){
    buttons_diff_b();
    count_diff_b();
    menu_diff_b();
    character_2_icon_b('⚖');
}

function menu_diff_b(){
    var str_t=klmenu_hide_b('');
    var paste_list=['{{\\/?quote}}','^[\\*#] ','^====|====$'];
    var klmenu1=[];
    for (let item of paste_list){
        klmenu1.push('<span class="span_menu" onclick="'+str_t+'common_replace_diff_b(this.innerText);">'+item+'</span>');
    }

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'⚖','14rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function common_replace_diff_b(csstr){
    document.getElementById('input_line1_compare').value=csstr;
}

function eng_punctuatin_diff_b(){
    function sub_eng_punctuatin_diff_b(csstr){
        var arr_t=[
        ['‘([\x00-\xff])',"'$1"],
        ['([\x00-\xff])’',"$1'"],
        ['“([\x00-\xff])','"$1'],
        ['([\x00-\xff])”','$1"'],
        ];
        
        for (let item of arr_t){
            csstr = csstr.replace(new RegExp(item[0],"gm"),item[1]);
        }
        return csstr;
    }
    //-----------------------
    var texta=document.querySelector('textarea[name="textarea_diff_1"]');
    var textb=document.querySelector('textarea[name="textarea_diff_2"]');
    if (texta && textb){
        texta.value=sub_eng_punctuatin_diff_b(texta.value);
        textb.value=sub_eng_punctuatin_diff_b(textb.value);
    }
}
