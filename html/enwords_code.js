//-----------------------
//history
//0.2.4-20200814
//0.2.3-20190923
//0.2.2-20190824
//0.2.1-20190804
//0.2.0-20190301
//0.1.9-20190228
//0.1.8-20190215
//0.1.7-20190211
//0.1.6-20181111
//-----------------------
function args_kle(){
    function sub_args_kle_search(csstr,add_recent=true){
        if (csstr=='' || csstr=='_reg'){
            getlines_enwc_b(1,40);
        } else {
            var bls_reg=csstr.split('_'); //dog_reg
            var search_str;
            var is_reg=-1;
            if (bls_reg.length>1){
                if (bls_reg[1]=='reg'){
                    search_str=bls_reg[0];
                    is_reg=true;
                } else {
                    search_str=csstr;
                }
            } else {
                search_str=bls_reg[0];
            }
            wordsearch_enwords_b(search_str,is_reg,[],false,true,add_recent);
        }
    }
    //-----------------------
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：enwords.htm?s=english& - 保留注释
        //是否显示例句 - 保留注释
        var show_sentence=false;
        for (let item of cskeys){
            if (item=='sentence'){
                show_sentence=true;
                var ocheck=document.getElementById('check_js_wiki');
                if (ocheck){
                    ocheck.checked=true;
                }
                break;
            }
        }

        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();
            if (bltmpstr.substring(0,2)=='s='){
                bltmpstr=bltmpstr.substring(2,);
                sub_args_kle_search(bltmpstr);
                break;
            } else if (bltmpstr=='sls'){
                var blstr=temp_search_link_value_get_b();
                sub_args_kle_search(blstr,false);
                break;
            } else if (bltmpstr.substring(0,3)=='si='){
                similar_enwords_b(bltmpstr.substring(3));
                break;
            } else if (bltmpstr.substring(0,5)=='line='){
                let blno_lines=bltmpstr.substring(5).split('_'); //30_20
                if (blno_lines.length>1){
                    getlines_enwc_b(parseInt(blno_lines[0]), parseInt(blno_lines[1]));
                } else {
                    getlines_enwc_b(parseInt(blno_lines[0]));
                }
                break;
            } else if (bltmpstr.substring(0,8)=='rndline='){
                let blno_lines=bltmpstr.substring(8); //20
                getlines_rnd_enwc_b(blno_lines);
                break;
            } else if (bltmpstr.substring(0,6)=='rndcn='){
                let blno_lines=bltmpstr.substring(6); //20
                rnd_cn_search_enwc_b(blno_lines);
                break;
            } else if (bltmpstr.substring(0,7)=='recent='){
                bltmpstr=bltmpstr.substring(7,);
                recent_words_list_enwords_b(parseInt(bltmpstr));
                break;
            } else if (bltmpstr=='update_recent_words'){
                en_words_temp_textarea_b('divhtml',true);
                words_count_enwords_b();
                document.querySelector('form[name="form_word_temp"]').submit();
                break;
            } else if (bltmpstr.substring(0,6)=='recent'){
                recent_words_list_enwords_b();
                break;
            } else if (bltmpstr.substring(0,14)=='day_old_words='){
                let list_t=bltmpstr.substring(14).split('_'); //20_012 20_0
                let old_type_t='old';
                //第1个参数：日期 - 保留注释
                let blno_lines=list_t[0];
                //第2个参数：类型 - 保留注释
                if (list_t.length>1){
                    old_type_t='old'+list_t[1];
                }
                //第3个参数：OR - 保留注释
                if (list_t.length>2){
                    old_type_t='old'+list_t[1]+'_OR';
                }
                
                if (blno_lines=='' || blno_lines=='0'){
                    let today = new Date();
                    blno_lines=today.getDate();
                }
                get_day_words_enwc_b(parseInt(blno_lines),'',old_type_t);
                break;
            }
        }

        if (show_sentence){
            show_sentence_enwc_b();
        }
    } else {
        getlines_enwc_b(1,40);
    }
}

function words_queue_transform_kle(){
    var otextarea=document.getElementById('textarea_words_queue');
    var blstr=otextarea.value.trim();
    if (blstr==''){return;}

    var row0=blstr.split('\n')[0].trim();
    if (row0.substring(0,2)=='["' && row0.slice(-3,)=='"],'){return;}
    
    var selected_word=document.getElementById('select_queue_words').value;
    if (selected_word!==''){
        alert('仅用于全部单词时');
        return;
    }
        
    if (confirm('是否展现为数组形式（并不实际更改存储的临时数据）？')==false){return;}
    
    var emoji_list=words_queue_emoji_b();
    var result_t=[];
    var list_t=words_queue_split_kle(blstr,'sublist')[0];
    for (let item of list_t){
        result_t.push(enwords_lines_2_js_array_b(item,emoji_list));
    }

    if (result_t.length>0){
        otextarea.value=result_t.join('\n');
    }
}

function words_queue_new_or_old_kle(is_new=true,only_word=false){
    var result_t=[];
    var error='';
    if (is_new){
        var new_str=document.getElementById('textarea_words_queue').value.trim();
        if (new_str==''){return [[],error];}
        [result_t,error]=words_queue_split_kle(new_str,'sublist');    
    } else {
        [result_t,error]=words_queue_split_kle(words_queue_get_b(false),'sublist');
    }
    
    if (only_word){
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            result_t[blxl]=result_t[blxl][0];
        }
    }
    return [result_t,error];
}

function words_queue_append_kle(){
    if (document.getElementById('select_queue_words').value!==''){return;}

    var new_list,error;
    [new_list,error]=words_queue_new_or_old_kle(true);
    if (new_list.length==0 || error!==''){return;}
    
    var old_list;
    [old_list,error]=words_queue_new_or_old_kle(false);
    if (error!==''){return;}

    var blfound='';
    for (let old_row of old_list){
        for (let new_row of new_list){
            if (old_row[0]==new_row[0]){
                blfound=old_row[0];
                break;
            }
        }
        if (blfound!==''){break;}
    }
    
    if (blfound!==''){
        alert('发现重复单词：'+blfound);
        return;
    }
    
    if (confirm('是否批量添加('+new_list.length+')个单词？')){
        var list_t=new_list.concat(old_list);
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            list_t[blxl]=list_t[blxl].join('\n');
        }
        localStorage.setItem('enwords_queue',list_t.join('\n---\n')+'\n---\n');
        words_queue_select_kle();
        js_alert_b('添加完成，临时单词从'+old_list.length+'个增加到'+list_t.length+'个','span_queue_words_info');
    }
}

function words_queue_split_kle(csstr,cstype='string'){
    var result_t=[];
    var list_t=('\n'+csstr+'\n').split('\n---\n');
    var error_str='';
    for (let item of list_t){
        item=item.trim();
        if (item==''){continue;}
        var aword=item.split('\n');
        if (aword.length==3){   //形如：[ "clubman", "['klʌbˌmæn]", "n. 俱乐部会员；拿棍棒的人" ] - 保留注释
            if (cstype=='sublist'){
                result_t.push(aword);
            } else if (cstype=='string'){
                result_t.push(item);
            } else {
                result_t=result_t.concat(aword);
            }
        } else {
            error_str='error: '+item+(aword.length>3?'\n第4行开始是：'+aword[3].slice(0,10):'');
            alert(error_str);
            break;
        }
    }
        
    if (error_str==''){
        return [result_t,error_str];
    } else {
        return [[],error_str];
    }
}

function words_queue_update_kle(do_type='change'){
    function sub_words_queue_update_kle_arr2str(csarr){
        for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
            if (Array.isArray(csarr[blxl])){
                csarr[blxl]=csarr[blxl].toString();
            }
        }    
        return csarr;
    }
    
    function sub_words_queue_update_kle_diff(old_list,new_list){
        old_list=sub_words_queue_update_kle_arr2str(old_list);
        new_list=sub_words_queue_update_kle_arr2str(new_list);

        var diff_str=two_list_diff_b(old_list,new_list,false,false,'','','旧版','新版')[1];
        var buttons='<p>'+close_button_b('div_words_queue_diff_kle','')+'</p>';
        document.getElementById('div_words_queue_diff_kle').innerHTML=diff_str+buttons;       
        key_location_diff_b([[2,'textarea_words_queue']]); 
    }
    
    var blstr=document.getElementById('textarea_words_queue').value.trim();
    if (blstr.match(/\n\s*\n/mg)){
        alert('存在空行，取消操作');
        return;
    }
    
    var selected_word=document.getElementById('select_queue_words').value;
    var new3_list,old3_list,words_new_list,words_old_list,error='';
    if (selected_word==''){
        [new3_list,error]=words_queue_new_or_old_kle(true,false);    
        if (error!==''){return;}
        
        [old3_list,error]=words_queue_new_or_old_kle(false,false);
        if (error!==''){return;}
        
        if (new3_list.toString()==old3_list.toString()){
            alert('完全一致'+(do_type=='change'?'，未修改':''));
            return;
        }
        [words_new_list,error]=words_queue_new_or_old_kle(true,true);    
        if (error!==''){return;}
        
        [words_old_list,error]=words_queue_new_or_old_kle(false,true);
        if (error!==''){return;}
        
        if (do_type=='change' && confirm('是否将原有'+words_old_list.length+'个单词('+words_old_list+')批量覆盖为'+words_new_list.length+'个单词('+words_new_list+')('+blstr.length+')？')){
            localStorage.setItem('enwords_queue',blstr);
            words_queue_select_kle();
            js_alert_b('更新完成','span_queue_words_info');
        } else if (do_type=='diff'){
            sub_words_queue_update_kle_diff(old3_list,new3_list);
        }
        return;
    }
    //---
    var word_t,error;
    [word_t,error]=words_queue_split_kle(blstr,'');
    if (error!==''){return;}
    
    //---
    var temp_words;
    [temp_words,error]=words_queue_split_kle(words_queue_get_b(false),'');
    //temp_words 是 单词个数*3行的数组，以名称、读音、释义逐行分布 - 保留注释
    var bllen=temp_words.length;
    if (error!==''){return;}
    
    var blfound=false;
    if (selected_word!=='NEW WORD'){
        for (let blxl=0;blxl<bllen;blxl++){
            if (blxl % 3 == 0 && temp_words[blxl]==selected_word && blxl+2<bllen){
                if (temp_words[blxl]==word_t[0] && temp_words[blxl+1]==word_t[1] && temp_words[blxl+2]==word_t[2]){
                    alert('完全一致'+(do_type=='change'?'，未修改':''));
                    return;
                }
                
                old3_list=[].concat(temp_words.slice(blxl,blxl+3));
                new3_list=[].concat(word_t);

                temp_words[blxl]=word_t[0];
                temp_words[blxl+1]=word_t[1];
                temp_words[blxl+2]=word_t[2];
                blfound=true;
                break;
            }
        }
    }
    
    if (blfound===false){
        temp_words=temp_words.concat(word_t);   //视为新单词添加 - 保留注释
    }
    
    var list_t=[];
    var name_set=new Set();
    for (let blxl=0,lent=temp_words.length;blxl<lent;blxl++){  
        var item=temp_words[blxl];
        if (blxl % 3 == 0){ //单词名称行 - 保留注释
            if (name_set.has(item)){
                alert('发现重复的单词：'+item+(do_type=='change'?'，取消更新':''));
                return;
            }
            name_set.add(item);
        }
        list_t.push(item);
        if (blxl % 3 == 2){
            list_t.push('---'); //在单词释义行后添加分隔行 - 保留注释
        }
    }
    
    if (do_type=='change' ){
        if (word_t.length>0){
            if (selected_word=='NEW WORD' || selected_word==word_t[0]){
                var blmessage='是否更新('+word_t[0]+')？';
            } else {
                var blmessage='是否将单词 '+selected_word+' 修改为 '+word_t[0]+' ？';
            }
            
            if (confirm(blmessage)){
                localStorage.setItem('enwords_queue',list_t.join('\n'));
                words_queue_select_kle(word_t[0]);
                js_alert_b('更新完成','span_queue_words_info');
            }
        }
    } else if (do_type=='diff'){
        sub_words_queue_update_kle_diff(old3_list,new3_list);
    }
}
 
function words_queue_read_one_word_kle(csword){
    var otextarea=document.getElementById('textarea_words_queue');
    if (csword=='NEW WORD'){
        otextarea.value='';
        return;
    }    
    
    if (csword==''){
        otextarea.value=words_queue_get_b(false);
        return;
    }
    
    var temp_words=words_queue_split_kle(words_queue_get_b(false),'sublist')[0];
    for (let item of temp_words){
        if (item[0]==csword){
            otextarea.value=item.join('\n');
            break;
        }        
    }
}

function words_queue_select_kle(csword=''){    
    var temp_words=words_queue_split_kle(words_queue_get_b(false),'sublist')[0];

    var bljg='<option></option><option>NEW WORD</option>\n';
    for (let item of temp_words){
        bljg=bljg+'<option'+(csword==item[0]?' selected':'')+'>'+item[0]+'</option>\n';
    }
    document.getElementById('select_queue_words').innerHTML=bljg;
}

function words_queue_insert_kle(){
    var otextarea=document.getElementById('textarea_words_queue');
    var list_t=document.getElementById('select_queue_insert').value.split(',');
    console.log(list_t);
    if (list_t.length==1){
        list_t.push('');
    }
    dom_insert_str_b(otextarea,list_t[0],list_t[1],false);
}

function textarea_queue_search_kle(cskey){
    textarea_top_bottom_b('textarea_words_queue',cskey.trim(),-1);
}

function words_editor_form_kle(){
    if (typeof window_close_alert_kle_global == 'undefined'){
        close_window_alert_b();
        window_close_alert_kle_global=true;
    }
    
    var list_t=words_queue_get_b();
    var bljg='';
    bljg=bljg+'\n<select id="select_queue_words" onchange="words_queue_read_one_word_kle(this.value);"></select>\n';
    bljg=bljg+'<span id="span_queue_words_info"></span>';
    
    var left_strings='<p>';
    left_strings=left_strings+'<span class="aclick" onclick="words_queue_update_kle();">更新</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="words_queue_update_kle(\'diff\');">diff</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="words_queue_append_kle();">批量添加</span> ';
        
    var right_strings=' <select id="select_queue_do_type">';
    for (let item of ['数组转为多行形式','展现为数组形式','batch_en','batch_en+','batch_dwdlw']){
        right_strings=right_strings+'<option>'+item+'</option>';
    }
    right_strings=right_strings+'</select> ';
    right_strings=right_strings+'<select id="select_iframe_or_close_kle"><option></option><option selected>iframe</option><option>close=1</option></select> '
    right_strings=right_strings+'<span class="aclick" onclick="words_queue_do_type_kle();">执行</span> ';    

    right_strings=right_strings+'<select id="select_queue_insert">';
    for (let item of ['[',']','[,]','] [','(,)','(',')','ə','(ə)','（,）','（','）','〘 , 〙',"'",'ˌ','；']){
        right_strings=right_strings+'<option>'+item+'</option>';
    }
    right_strings=right_strings+'</select> ';
    right_strings=right_strings+'<span class="aclick" onclick="words_queue_insert_kle();">插入</span> ';    
    right_strings=right_strings+'<a href="lsm.htm?key=enwords_queue" target=_blank>LocalStorage</a> ';
    right_strings=right_strings+' 行数：'+list_t.length;    
    right_strings=right_strings+'</p>';

    var blstr=textarea_with_form_generate_b('textarea_words_queue','height:20rem;',left_strings,'全选,清空,复制,导入temp_txt_share,发送到临时记事本,发送地址',right_strings,'enwords_queue','form_words_queue',false,list_t.join('\n'));

    blstr=blstr+'<p><input type="text" id="input_find_in_textarea_queue" placeholder="搜索字符串" onkeyup="if (event.key==\'Enter\'){textarea_queue_search_kle(this.value);}" /></p>';

    bljg=bljg+blstr+'<div id="div_words_queue_diff_kle"></div>\n';
    bljg=bljg+'<p>格式：</p><hr />'+['单词1','音标','释义','---','单词2','音标','释义','---'].join('<br />');
    if (enwords.length>=2){
        bljg=bljg+'<br />'+[enwords[0][0],enwords[0][1],enwords[0][2],'---',enwords[1][0],enwords[1][1],enwords[1][2]].join('<br />');
    }
    bljg=bljg+'<hr />\n';
    //---
    list_t=[];
    var emoji_list=words_queue_emoji_b();
    for (let item of enwords){
        for (let one_emoji of emoji_list){
            if (item[2].slice(-1*one_emoji[1],)==one_emoji[0]){
                list_t.push(item[0]);
                break;
            }
        }
    }
    bljg=bljg+enwords_different_types_div_b(list_t);
    document.getElementById('divhtml').innerHTML=bljg;
    input_with_x_b('input_find_in_textarea_queue',11);
    words_queue_select_kle();
}

function words_queue_do_type_kle(){
    var bltype=document.getElementById('select_queue_do_type').value;
    switch (bltype){
        case '展现为数组形式':
            words_queue_transform_kle();
            break;
        case '数组转为多行形式':
            words_array_2_lines_kle(); 
            break;
        case 'batch_en':
        case 'batch_en+':
        case 'batch_dwdlw':
            var otextarea=document.getElementById('textarea_words_queue');
            var blstr=otextarea.value.trim().split('\n')[0];
            if (blstr!==''){
                if (confirm('是否 '+bltype+' [ '+blstr+' ] ？')){
                    var iframe_or_close=document.getElementById('select_iframe_or_close_kle').value;
                    if (iframe_or_close==''){
                        iframe_or_close=(bltype=='batch_en'?'iframe':'close=1');
                    }
                    window.open('klsearch.htm?k='+blstr+'&t='+bltype+'&'+iframe_or_close);
                }
            }
            break;
    }
}

function words_array_2_lines_kle(){
    var otextarea=document.getElementById('textarea_words_queue');
    var blstr_old=otextarea.value.trim().split('\n');
    try {
        var list_t=eval('['+blstr_old+']');
        var words_list=[];
        var names=[];
        for (let arow of list_t){
            if (!Array.isArray(arow) || arow.length!==3){continue;}
            words_list.push(arow.join('\n'));
            names.push(arow[0]);
        }
        
        if (words_list.length>0){
            if (!confirm('是否转换单词 '+names.join(' ')+' 为多行形式？')){return;}
            var blstr_new=words_list.join('\n---\n');
            otextarea.value=blstr_new;
        }
    } catch (error){
        alert(error.message);
    }    
}

function week_plan_set_kle(){
    var blstr=local_storage_get_b('enwords_plan_week');
    
    var new_date_value=prompt('输入日期和单词量，以空格间隔：',blstr);
    if (new_date_value==null){return;}
    new_date_value=new_date_value.trim();
    if (new_date_value==blstr){return;}
    
    var list_t=new_date_value.split(' ');
    if (list_t.length!==2){
        alert('格式错误');
        return;
    }
    if (validdate_b(list_t[0])==false || isNaN(list_t[1])){
        alert('格式错误');
        return;
    }    
    localStorage.setItem('enwords_plan_week',new_date_value);
    week_plan_show_kle();
}

function week_plan_get_kle(){
    var list_t=local_storage_get_b('enwords_plan_week').split(' ');
    if (list_t.length==1){
        list_t.push(enwords.length);
    } else {
        list_t[1]=parseInt(list_t[1]);
        if (isNaN(list_t[1])){
            list_t[1]=enwords.length;
        }    
    }
    var bldate=validdate_b(list_t[0]);
    if (bldate==false){
        bldate=new Date();
    }
    
    bldate=validdate_b(date2str_b('-',bldate));
    //---
    var today=date2str_b();
    var remain_days=days_between_two_dates_b(bldate,today);
    bldate.setTime(bldate.getTime()+remain_days*24*60*60*1000);
    list_t[1]=list_t[1]+4*remain_days;
    //---
    var blrange=day_2_week_range_b(bldate);
    remain_days=days_between_two_dates_b(bldate,blrange[1]);
    list_t[1]=list_t[1]+4*remain_days;    
        
    return [bldate,list_t[1],blrange[0],blrange[1]];
}

function week_plan_show_kle(){
    var bldate;
    var blvalue;
    var blweek_start;
    var blweek_end;
    [bldate,blvalue,blweek_start,blweek_end]=week_plan_get_kle();
    
    var result_t=[];
    result_t.push('<tr><td>'+blweek_start+'</td><td>'+blweek_end+'</td><td>'+(blvalue-28+4)+'-'+blvalue+'</td></tr>');
    
    blweek_start=next_day_b(blweek_end,1,false);
    blweek_end=next_day_b(blweek_end,7,false);
    
    for (let blxl=0;blxl<105;blxl++){
        result_t.push('<tr><td>'+date2str_b('-',blweek_start)+'</td><td>'+date2str_b('-',blweek_end)+'</td><td>'+(blvalue+blxl*28+4)+'-'+(blvalue+(blxl+1)*28)+'</td></tr>');
        blweek_start.setTime(blweek_start.getTime()+7*24*60*60*1000);
        blweek_end.setTime(blweek_end.getTime()+7*24*60*60*1000);
    }
    var bljg='<table class="table_common"><tr><th>开始日期</th><th>结束日期</th><th>累计</th></tr>'+result_t.join('\n')+'</table>';
    bljg=bljg+'<p><span class="aclick" onclick="week_plan_set_kle();">设置</span></p>';
    document.getElementById('divhtml').innerHTML=bljg;
}

function menu_kle(){
    var str_t=klmenu_hide_b('#top');
    var str2_t=klmenu_hide_b('#a_recent_bookmark');
    var klmenu_old, klmenu1, klmenu_brain;
    [klmenu_old,klmenu1,klmenu_brain]=menu_base_enwc_b();

    klmenu1.push(menu_container_b(str_t,en_sentence_menu_generate_b(),''));

    var group_list=[
    ['随机排序','show_sentence_enwc_b(0,true,true);',true],
    ['最多3条','show_sentence_enwc_b(3,true,true);',true],
    ['恢复原始排序','en_sentence_to_default_order_b();alert(\'done\');',true],
    ['溢出调整','sentence_horizontal_overflow_check_b();',true],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,'例句：'));
    
    klmenu1=klmenu1.concat([
    '<span class="span_menu" onclick="'+str_t+'pure_words_sentences_b();">纯单词+例句</span>',
    '<span class="span_menu" onclick="'+str_t+'duplicate_words_kle();">重复单词和格式检查</span>',
    '<span class="span_menu" onclick="'+str_t+'enwords_search_result_load_b(false,\'input\',\'input_search\',\'^$\');">暂存搜索单词查询</span>',
    '<a href="ensentence.htm" onclick="'+str_t+'" target=_blank>ensentence</a>',  
    '<a href="selenium_enwords.htm" onclick="'+str_t+'" target=_blank>selenium enwords</a>',  
    ]);
    
    if (is_local_b()){
        klmenu1=klmenu1.concat(['<a href="txtlistsearch.htm?klwiki_en2" onclick="'+str_t+'" target=_blank>今日段落阅读</a>',
        ]);
    }
    
    var klmenu_new=[
    '<span class="span_menu" onclick="'+str_t+'words_editor_form_kle();">录入临时新单词或旧单词编辑</span>',        
    '<span class="span_menu" onclick="'+str_t+'words_queue_read_b(true);">再次载入临时单词</span>',        
    '<a href="enwords_book.htm" onclick="'+str_t+'" target=_blank>生词统计</a>',
    '<span class="span_menu" onclick="'+str_t+'show_new_words_enwc_b(\'span.span_enwords_sentence\');">显示例句中的生词</span>',
    '<span class="span_menu" onclick="'+str_t+'show_new_words_enwc_b(\'span.span_explanation\');">显示释义中的生词</span>',    
    ];
    
    var klmenu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'statistics_draw_b(\'enwords\');">统计</span>',
    ];

    var group_list=[
    ['0','day_old_word_all_kle(\'\',[0]);',true],
    ['1','day_old_word_all_kle(\'\',[1]);',true],
    ['2','day_old_word_all_kle(\'\',[2]);',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'全部旧单词：'));

    klmenu_statistics=klmenu_statistics.concat([
    '<span class="span_menu" onclick="'+str_t+'day_old_word_all_kle(\'_OR\',[0,2]);">全部旧单词：0_2_OR</span>',
    '<span class="span_menu" onclick="'+str_t+'day_old_word_all_kle(\'\',[0,1,2]);">全部旧单词：0_1_2</span>',
    '<span class="span_menu" onclick="'+str_t+'letters_26_kle();">26字首统计</span>',
    '<span class="span_menu" onclick="'+str_t+'other_characters_kle();">除字母外的其他字符</span>',
    '<span class="span_menu" onclick="'+str_t+'week_plan_show_kle();">每周记忆计划</span>',    
    '<span class="span_menu" onclick="'+str_t+'search_similar_new_sentence_kle(\'例句\',\'’\');">含有中文标点的例句</span>',    
    fpara_menu_b(str_t),
    ]);

    var group_list=[
    ['全部','similar_words_batch_kle();',true],
    ['当前','similar_words_batch_kle(false,false,true);',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'相似单词：'));
    
    var list_t=[
    "-([a-zA-Z]{3,}.*){3,}(:r)",
    "UK\\s\\[(.*?)\\]\\sUS\\s\\[\\1\\]$(:r)",
    ".*?([a-z])([^\\s]*?\\1){4,}(:r)",
    "\\[(.*?)\\].*\\[\\1\\](:r)",
    "+adj. +ly$(:r)",
    "+[a-z]{10,} -([a-z])[a-z]*\\1(:r)",
    "([a-z])([a-z]*\\1){3,}(:r)",
    "dant$(:r)",
    "descent crescent decline",
    "ful$(:r)",
    "+州 +([a-z])\\1(:r)",
    "let$(:r)",
    "^..n..m$(:r)",
    "primary premier prime prim prem",
    "[^s]sion(:r)",
    "复兴 复活 复苏 恢复 回复 唤醒 振兴",
    "+英.*(\\[.*?\\]).*美.*\\1(:r)",
    ];

    var klmenu_search=[];
    for (let item of list_t){
        klmenu_search.push('<span class="span_menu" onclick="'+str_t+'hot_key_search_kle(this);">'+item+'</span>');
    }
    
    klmenu_old.push('<span class="span_menu" onclick="'+str_t+'old_words_name_list_form_kle();">旧单词列表</span>');
    klmenu_old.push('<span class="span_menu" onclick="'+str_t+'old_words_without_phrase_kle();">无词组的旧单词</span>');
    klmenu_old.push('<span class="span_menu" onclick="'+str_t+'old_words_and_phrase_with_space_kle();">空格词组和对应单词</span>');
    
    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'','24rem','1rem','1rem','60rem')+klmenu_b(klmenu_old,'旧','19rem','1rem','1rem','60rem')+klmenu_b(klmenu_brain,'🧠','17rem','1rem','1rem')+klmenu_b(klmenu_new,'🆕','17rem','1rem','1rem','60rem')+klmenu_b(klmenu_statistics,'🧮','14rem','1rem','1rem')+klmenu_b(klmenu_search,'🔽','18rem','1rem','1rem','30rem'),'','0rem')+' ';
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',bljg);
    
    document.getElementById('span_checkboxes').insertAdjacentHTML('beforeend',klmenu_multi_button_div_b(klmenu_b(en_font_menu_b(str_t),'🅰','10rem','1rem','1rem','30rem'),'','0rem')+' ');

    if (!ismobile_b()){
        klmenu_check_b('span_source_en_b',true);
    }
    local_storage_span_get_b('en_words','b','split_en_definitions');
}

function old_words_name_list_form_kle(){
    var ocheck=document.getElementById('check_js_wiki');
    if (ocheck){
        ocheck.checked=true;
    }

    var old_list=simple_words_b(false);
    
    var bljg='<h3>全部旧单词列表</h3>';
    bljg=bljg+textarea_with_form_generate_b('textarea_old_words1_kle','height:15rem; background-color:'+scheme_global['button']+';','<p>','全选,复制,发送到临时记事本,发送地址','</p>','','',false,old_list.join('\n'));

    bljg=bljg+'<h3>88待比较的单词列表</h3>';
    bljg=bljg+textarea_with_form_generate_b('textarea_old_words2_kle','height:15rem;','<p><span class="aclick" onclick="old_words_name_list_compare_kle();">比较</span>','全选,清空,复制,导入temp_txt_share,发送到临时记事本,发送地址','</p>');

    bljg=bljg+'<h3>比较结果（全部旧单词列表 有，待比较的单词列表 无）<span id="span_old_words3_kle"></span></h3>';    
    bljg=bljg+textarea_with_form_generate_b('textarea_old_words3_kle','height:15rem;','<p>','全选,清空,复制,发送到临时记事本,发送地址','</p>');
    bljg=bljg+'<div id="div_old_words3_kle"></div>';

    bljg=bljg+'<h3>比较结果（全部旧单词列表 无，待比较的单词列表 有）<span id="span_old_words4_kle"></span></h3>';    
    bljg=bljg+textarea_with_form_generate_b('textarea_old_words4_kle','height:15rem;','<p>','全选,清空,复制,发送到临时记事本,发送地址','</p>');
    bljg=bljg+'<div id="div_old_words4_kle"></div>';    
    
    document.getElementById('divhtml').innerHTML=bljg;
    document.getElementById('textarea_old_words1_kle').readOnly=true;
}

function old_words_name_list_compare_kle(){
    var words_list=[];
    for (let blxl=0;blxl<=1;blxl++){
        var blstr=document.getElementById('textarea_old_words'+(blxl+1)+'_kle').value.trim();
        if (blstr==''){
            words_list[blxl]=new Set();
        } else {
            words_list[blxl]=new Set(blstr.split('\n'));
        }
    }
    
    var diff_result=array_difference_b(words_list[0],words_list[1],true,true);

    for (let blxl=0;blxl<=1;blxl++){
        diff_result[blxl]=Array.from(diff_result[blxl]);
    
        var blkey=blxl+3;
        document.getElementById('textarea_old_words'+blkey+'_kle').value=diff_result[blxl].join('\n');
        document.getElementById('span_old_words'+blkey+'_kle').innerHTML='('+diff_result[blxl].length+')';
        document.getElementById('div_old_words'+blkey+'_kle').innerHTML=enwords_js_wiki_textarea_b(diff_result[blxl],'simple');
    }
}

function hot_key_search_kle(ospan){
    var blkey=ospan.innerText;
    search_r_key_b('input_search','input_reg',blkey);
    wordsearch_enwords_b();
}

function other_characters_kle(){
    var set_t=simple_words_b();
    var result_t=[];
    for (let one_word of set_t){
        var list_t=one_word.match(/[^a-z\s'\.\-]/ig) ||[];
        if (list_t.length==0){continue;}
        result_t=result_t.concat(list_t);
    }
    wordsearch_enwords_b("[^a-z\\s'\\.\\-]",true,[true,false,false]);
    document.getElementById('divhtml').insertAdjacentHTML('afterbegin','<p><b>'+array_unique_b(result_t).join(' ')+'</b></p>');
}

function letters_26_kle(idno='',sort_by_count=false,percent=false){
    function sub_letters_26_kle_one_array(csarray,cscaption,element_is_array,idno,sort_by_count=false,percent=false){
        var l26={};
        for (let item of csarray){
            if (element_is_array){
                var initial=item[0].substring(0,1).toLowerCase();
            } else {
                var initial=item.substring(0,1).toLowerCase();                
            }
            if (initial==''){continue;}
            if (l26[initial]==undefined){
                l26[initial]=0;
            }
            l26[initial]=l26[initial]+1;
        }
        l26=object2array_b(l26,true);
        l26.sort();
        
        if (sort_by_count){
            l26.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
        }

        var bljg=[];
        for (let blxl=0,lent=l26.length;blxl<lent;blxl++){
            bljg.push('<font color="'+scheme_global['memo']+'">'+(blxl+1)+'. </font><b>'+l26[blxl][0]+'</b>: '+(percent?(l26[blxl][1]*100/csarray.length).toFixed(2)+'%':l26[blxl][1]));
        } 
        
        var odiv=document.getElementById('div_initial_count_'+idno+'_enwords');
        if (odiv){
            var ocaption=odiv.querySelector('span.span_initial_count_caption');
            if (ocaption){
                ocaption.innerHTML=cscaption+' <small>('+csarray.length+')</small>';
            }
            var op=odiv.querySelector('p.p_initial_count_result');
            if (op){
                op.innerHTML=bljg.join(' ');
            }
        }
    }
    //-----------------------
    if (idno==''){
        var blstr=[];
        for (let blxl=1;blxl<=4;blxl++){
            var blbuttons='<select onchange="letters_26_kle('+blxl+',this.value.substring(0,1)==\'1\',this.value.slice(-1)==\'1\');">';
            blbuttons=blbuttons+'<option value="00">字母排序</option>\n';
            blbuttons=blbuttons+'<option value="10">数量排序</option>\n';
            blbuttons=blbuttons+'<option value="01">字母排序百分比</option>\n';
            blbuttons=blbuttons+'<option value="11">数量排序百分比</option>\n';
            blbuttons=blbuttons+'</select>';        
            blstr.push('<div id="div_initial_count_'+blxl+'_enwords"><h3><span class="span_initial_count_caption"></span> '+blbuttons+'</h3>\n<p class="p_initial_count_result"  style="font-size:1.5rem;"></p></div>');
        }
        document.getElementById('divhtml').innerHTML=blstr.join('\n');
    }
    
    if (idno=='' || idno==1){
        sub_letters_26_kle_one_array(enwords,'全部旧单词',true,1,sort_by_count,percent);
    }
    if (idno=='' || idno==2){
        sub_letters_26_kle_one_array(en_words_temp_global,'全部临时记忆单词',false,2,sort_by_count,percent);  
    }
    if (idno=='' || idno==3){    
        sub_letters_26_kle_one_array(en_words_temp_important_global,'全部重要临时记忆单词',false,3,sort_by_count,percent);  
    }
}

function duplicate_words_kle(){
    var t0=performance.now();
    
    enwords_sort_b('a');

    var duplication=new Set();
    var definition_redundant=new Set();
    var simple_words=new Set();
    var format_list1={  //音标
    ' ]':[],    //空格+] - 保留注释    
    };    
    var format_list2={  //释义
    ';;':[],
    ' ;':[],    //空格+英文分号 - 保留注释
    '  ':[],    //两个空格 - 保留注释
    '， ':[],    //中文逗号+空格 - 保留注释
    '； ':[],    //中文分号+空格 - 保留注释
    '	':[],   //\t  - 保留注释
    ' :':[],   //空格+冒号  - 保留注释
    '．':[], //点号 - 保留注释
    '……':[],    //省略号
    ' …':[],    //空格+省略号
    '… ':[],    //省略号+空格
    '...':[],    //三个点
    
    };
    
    var reg_list=[
    [/[a-z]’[a-z]/i,[]],    //结尾字符判断 - 保留注释
    [/\)[a-z]/i,[]],
    [/;[^\s]/,[]],
    [/[,;\s]$/,[]],
    ];

    var type_str=enword_type_b(true);
	for (let blxl=1,lent=enwords.length;blxl<lent;blxl++){
        var item=enwords[blxl];
        if (enwords[blxl][0]==enwords[blxl-1][0]){
            duplication.add(enwords[blxl][0]);
        }
        
        var tmp_list=enwords_definition_split_b(item[2],type_str);
        if (tmp_list.length!==new Set(tmp_list).size){
            definition_redundant.add(item[0]);
        }
        
        simple_words.add(item[0]);

        for (let key in format_list1){
            if (item[1].includes(key)){
                format_list1[key].push(item[0]);
            }
        }
                
        for (let key in format_list2){
            if (item[2].includes(key)){
                format_list2[key].push(item[0]);
            }
        }
        
        for (let one_reg of reg_list){
            if (item[2].match(one_reg[0])!==null){
                one_reg[1].push(item[0]);
            }        
        }
    }
    
    duplication=Array.from(duplication);

    var bljg='<br />重复单词：<br />'+duplication.join('<br />');
	bljg=bljg+'<hr />';    

	bljg=bljg+'<br />格式：<br />';
    for (let key in format_list1){
        if (format_list1[key].length==0){continue;}
        bljg=bljg+'<p><b>【'+key+'】('+format_list1[key].length+')：</b> "'+list_join_2_reg_style_b(format_list1[key])+'"</p>\n';
    }    
    for (let key in format_list2){
        if (format_list2[key].length==0){continue;}
        bljg=bljg+'<p><b>【'+key+'】('+format_list2[key].length+')：</b> "'+list_join_2_reg_style_b(format_list2[key])+'"</p>\n';
    }
    
    for (let one_reg of reg_list){
        if (one_reg[1].length>0){
            bljg=bljg+'<p><b>【'+one_reg[0].toString()+'】('+one_reg[1].length+')：</b> "'+list_join_2_reg_style_b(one_reg[1])+'"</p>\n';        
        }    
    }
    
    bljg=bljg+'<p><b>重复释义单词('+definition_redundant.size+')：</b>"'+list_join_2_reg_style_b(Array.from(definition_redundant))+'"</p>\n';  

	document.getElementById('divhtml').innerHTML=bljg;
    enwords_sort_b();
    console.log('duplicate_words_kle() 费时：'+(performance.now() - t0) + ' milliseconds');
}

function day_old_word_all_kle(cstype='',array_num_t=[0]){
    //统计一年中所有天数的旧单词数 - 保留注释
    var result_list=[];
    var blcount=0;
    var allwords=[];
    var maxlength=0;
    var flot_list=['一年度每日旧单词数'];
    var flot_easy_list=['easy'];
    var flot_difficult_list=['difficult'];

    var blyear_list=year365_b(0,true);
    var todaylen=day_of_year_b(preweekday_b('',0));
    var flot_rencent_list=['最近两周每日旧单词数'];
    var flot_rencent_easy_list=['easy'];
    var flot_rencent_difficult_list=['difficult'];
        
    for (let blxl=1;blxl<=365;blxl++){
        var word_t=[];
        var ignore_count=0;
        var list_t=en_day_old_words_b(blxl,cstype,array_num_t);
        for (let item of list_t){
            if (enwords_easy_global.includes(item[0])){
                var word_name='<span class="span_enwords_easy" style="color:'+scheme_global['green']+';">'+item[0]+'</span>';
                ignore_count=ignore_count+1;
            } else {
                var word_name=item[0];
            }
            word_t.push(word_name);
            allwords.push(word_name);
        }
        blcount=blcount+word_t.length;
        maxlength=Math.max(maxlength,word_t.length);
        var blstr=date2str_b('-',blyear_list[blxl-1]);
        result_list.push('<span style="font-weight:bold;">'+blstr+'/'+day_2_week_b(blyear_list[blxl-1],'cnbrief')+'</span> '+word_t.join(', ')+' ('+(word_t.length-ignore_count)+'/'+word_t.length+')');
        
        flot_list.push([blyear_list[blxl-1],word_t.length]);
        flot_easy_list.push([blyear_list[blxl-1],ignore_count]);
        flot_difficult_list.push([blyear_list[blxl-1],word_t.length-ignore_count]);
        if (blxl-todaylen>=0 && blxl-todaylen<=14){
            flot_rencent_list.push([blyear_list[blxl-1],word_t.length]);
            flot_rencent_easy_list.push([blyear_list[blxl-1],ignore_count]);
            flot_rencent_difficult_list.push([blyear_list[blxl-1],word_t.length-ignore_count]);            
        }
    }
    
    allwords=array_unique_b(allwords);
    var bljg='<h3>统计类型：'+cstype+' 指定序号：'+array_num_t.join(',')+'</h3>\n';
    bljg=bljg+'<h4>单词总数：'+blcount+' 无重复单词总数：'+allwords.length+' 比值：'+(blcount/allwords.length).toFixed(4)+' 最大单日单词数：'+maxlength+' 平均每日：'+(blcount/365).toFixed(1)+'</h4>\n';
    
    bljg=bljg+'<p><input type="text" id="input_day_old_word_filter_kle" onkeyup="if (event.key==\'Enter\'){day_old_word_filter_kle(this.value);}"></p>';
    
    bljg=bljg+array_2_li_b(result_list,'li','ol','ol_day_old_words');
    bljg=bljg+'<div id="div_oldwords_flot" style="width:100%;height:400px;"></div>';
    bljg=bljg+'<div id="div_oldwords_recent_flot" style="width:100%;height:400px;"></div>';
    document.getElementById('divhtml').innerHTML=bljg;
    input_with_x_b('input_day_old_word_filter_kle',15);
    
    flot_lines_b([flot_list,flot_easy_list,flot_difficult_list],'div_oldwords_flot','ne',true,'','d','',0);
    flot_lines_b([flot_rencent_list,flot_rencent_easy_list,flot_rencent_difficult_list],'div_oldwords_recent_flot','ne',true,'','d','',0,[1, 'day']);
    
    var olis=document.querySelectorAll('ol#ol_day_old_words li');
    var blno=day_of_year_b()-1;
    if (blno>=0 && blno<olis.length){
        olis[blno].scrollIntoView();
    }
}

function day_old_word_filter_kle(csstr){
    var olis=document.querySelectorAll('ol#ol_day_old_words li');
    obj_search_show_hide_b(olis,'',csstr,false,true);
}

function similar_words_batch_kle(csno=false,pageitems=false,is_current=false){
	if (csno===false){
        csno= parseInt(document.getElementById('input_lineno').value.trim());
    }
    csno=Math.max(1,csno);
    
    if (pageitems===false){
        pageitems=parseInt(document.getElementById('input_max_result').value);
    }

	var cshideno=document.getElementById('check_hide_no').checked;
	var cshidelineno=document.getElementById('check_hide_lineno').checked;
	var cshidesimilarno=document.getElementById('check_hide_similarno').checked;
	var bljg='';

    var similar_list=[];
    var similar_set=new Set();
    
    if (is_current){
        var csarr=[];
        for (let item of words_searched_arr_global){
            csarr.push([].concat(item));
        }
        var pages='';
    } else {
        var csarr=enwords;
        var pages=page_combination_b(csarr.length,pageitems,csno,'similar_words_batch_kle','locate_swords_batch_kle',false,1,100);
    }
	for (let blxl=csno,lent=csarr.length;blxl<lent;blxl++){
		var tmpstr=similar_enwords_b(csarr[blxl][0],cshideno,cshidelineno,cshidesimilarno,false,similar_list,similar_set);
		if (tmpstr!==''){
            bljg=bljg+'<h3>'+csarr[blxl][0]+'</h3>\n'+tmpstr;
        }
		if (blxl-csno+1>=pageitems){break;}
	}

	var odiv=document.getElementById('divhtml');
    odiv.innerHTML=bljg+pages;
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    words_searched_arr_global=similar_list;
}

function locate_swords_batch_kle(pages,pageitems){
    var blno=page_location_b(pages);
    if (blno!==false){
        similar_words_batch_kle((blno-1)*pageitems+1);
    }
}

function recent_bookmark_position(){
    var recent_bookmark=enwords_recent_bookmark_get_b();
    if (recent_bookmark==''){return;}
    var blat=en_words_temp_global.indexOf(recent_bookmark);
    if (blat>=0){
        local_storage_today_b('enwords_recent_bookmark_position',40,blat,'/');
    }
}

function search_similar_new_sentence_kle(cstype=false,csword=''){
    if (cstype===false){
        cstype=document.getElementById('select_search_more_enwords').value;
    }
    if (csword==''){
        csword=document.getElementById('input_search').value.trim();
    }
    
    var odiv=document.getElementById('divhtml');
    if (csword==''){
        odiv.innerHTML='';
        return;
    }
    
    enwords_recent_search_b(csword);
    
    switch (cstype){
        case '相似':
            similar_enwords_b(csword);
            break;
        case '例句':
            sentence_search_value_get_b(csword);
            break;
        case '链接':
            var bljg='<p style="font-size:1.5rem;">'+en_word_links_b(csword,false,false)+'</p>';
            odiv.innerHTML=bljg;
            break;
        default:
            wordsearch_enwords_b(csword,-1,[],false,true,false);
            break;
    }
}

function init_kle(){
    function sub_init_kle_fn(){
        local_storage_today_b('enwords_statistics',40,enwords.length,'/');
        words_count_enwords_b();
        local_storage_today_b('enwords_recent_statistics',40,en_words_temp_global.length,'/');
            
        menu_kle();
        args_kle();
        recent_bookmark_position();
        days_enwc_b();
        input_date_set_enwords_b();
        enwords_mini_search_frame_style_b();    
        enwords_mini_search_frame_form_b();    
    }
    //-----------------------
    input_with_x_b('input_search',(ismobile_b()?11:22),'',false,'input_reg',true);
    character_2_icon_b('🇬🇧');
    top_bottom_arrow_b('div_top_bottom','',true,(ismobile_b()?'1.8rem':'1.4rem'),true,true,2);

    words_searched_arr_global=[];  //全局变量 - 保留注释
    
    enwords_init_b(false,true,sub_init_kle_fn);
}

function old_words_and_phrase_with_space_kle(){
    var words_set=simple_words_b(true);
    var space_set=new Set();
    for (let aword of words_set){
        if (aword.includes(' ')){
            space_set.add(aword);
        }
    }
    var result_t=new Set();
    for (let aword of space_set){
        var bltmp=aword.replace(/\s+/g,'');
        if (words_set.has(bltmp)){
            result_t.add(bltmp);
            result_t.add(aword);
        }
    }
    
    result_t=Array.from(result_t);
    result_t.sort();
    wordsearch_enwords_b(enwords_list_2_reg_b(result_t,'^$'));
}

function old_words_without_phrase_kle(){
    var phrase_set,words_set;
    [phrase_set,words_set]=phrase_in_old_words_b(true);
    
    phrase_set=new Set(Array.from(phrase_set).join(' ').split(/[\s\-]+/));
    
    var without_phrase=Array.from(array_difference_b(words_set,phrase_set,true));
    var with_phrase=Array.from(array_intersection_b(words_set,phrase_set,true));

    var bljg='<h4>无词组的单词 <small>('+without_phrase.length+')</small></h4>';
    without_phrase.sort(randomsort_b);
    bljg=bljg+'<textarea style="height:25rem;">'+without_phrase.slice(0,1000)+'...</textarea>';
    bljg=bljg+'<h4>有词组的单词 <small>('+with_phrase.length+')</small></h4>';
    with_phrase.sort(randomsort_b);    
    bljg=bljg+'<textarea style="height:25rem;">'+with_phrase.slice(0,1000)+'...</textarea>';

    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=bljg;    

    local_storage_today_b('enwords_has_phrase',40,with_phrase.length,'/');
}
