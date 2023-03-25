function select_all_lsm(csvalue){
    var olis=document.querySelectorAll('ol#ol_lsm li');
    var key_list=[];
    for (let item of olis){
        if (item.style.display=='none'){continue;}
        
        var ocheckbox=item.querySelector('input[type="checkbox"]');
        if (ocheckbox){
            ocheckbox.checked=csvalue;
        }
    }
}

function selected_keys_lsm(cstype=''){
    var olis=document.querySelectorAll('ol#ol_lsm li');
    var key_list=[];
    for (let item of olis){
        if (item.style.display=='none'){continue;}
        
        var ocheckbox=item.querySelector('input[type="checkbox"]');
        if (ocheckbox){
            if (ocheckbox.checked){
                key_list.push(ocheckbox.value);
            }
        }
    }
    if (key_list.length==0){return;}
        
    switch (cstype){
        case 'value':
            document.getElementById('textarea_lsm_content').value=local_storage_all_b('',key_list)[0];
            break;
        case 'remove':
            var rndstr=randstr_b(4,true,false);
            if ((prompt('输入 '+rndstr+' 确认移除\n\n'+key_list.slice(0,5).join('\n')+'\n\n'+(key_list.length>5?'等 ':'')+key_list.length+'个 localStorage key') || '').trim()==rndstr){    
                for (let blkey of key_list){
                    localStorage.removeItem(blkey);
                }
                document.getElementById('textarea_lsm_state').value='移除名为 '+key_list.join(', ')+' 的 localStorage 值';        
                keys_lsm();                
            }
            break;
        case 'length':
            document.getElementById('textarea_lsm_content').value=local_storage_all_b('name_length',key_list)[0].join('\n');
            break;
    }
}

function search_value_lsm(csstr=''){
    var oinput=document.getElementById('input_search');
    if (csstr==''){
        csstr=oinput.value;
    }
    oinput.value=csstr;

    var blreg=false;
    [csstr,blreg]=str_reg_check_b(csstr,blreg);
    var olis=document.querySelectorAll('ol#ol_lsm li');
    for (let item of olis){
        var blcontent=local_storage_get_b(item.innerText.trim());
        var blfound=str_reg_search_b(blcontent,csstr,blreg);
        if (blfound==-1){break;}
        if (blfound){
            item.style.display='';
        }
        else {
            item.style.display='none';
        }            
    }    
}

function filter_lsm(csstr='',checked=false){
    var oinput=document.getElementById('input_search');
    if (csstr==''){
        csstr=oinput.value;
    }
    oinput.value=csstr;
    
    var blreg=false;
    [csstr,blreg]=str_reg_check_b(csstr,blreg);
    
    var olis=document.querySelectorAll('ol#ol_lsm li');
    obj_search_show_hide_b(olis,'',csstr,blreg);
    if (checked){
        for (let item of olis){
            item.querySelector('input[type="checkbox"]').checked=(item.style.display=='none'?false:true);
        }
        document.getElementById('checkbox_select_all').checked=true;
    }
    else {
        for (let item of olis){
            item.querySelector('input[type="checkbox"]').checked=false;
        }
        document.getElementById('checkbox_select_all').checked=false;
    }
}

function local_storage_view_lsm(cstype=''){
    var blstr;
    var bllen;
    [blstr,bllen]=local_storage_all_b(cstype);
    if (Array.isArray(blstr)){
        blstr=blstr.join('\n');
    }
    document.getElementById('textarea_lsm_content').value=blstr;
    document.getElementById('textarea_lsm_state').value='localStorage 长度：'+bllen;
    if (cstype==''){
        local_storage_today_b('local_storage_used_length',40,(bllen/1024).toFixed(2),':');
    }
}

function local_storage_import_lsm(){
    if (local_storage_import_b('textarea_lsm_content')){
        document.getElementById('textarea_lsm_state').value='批量导入 localStorage 完成';
    }
}

function local_storage_read_key_lsm(cskey=''){
    if (cskey==''){
        cskey=(prompt('输入key') || '').trim();
    }
    if (cskey==''){return;}
    var blstr=local_storage_get_b(cskey);
    document.getElementById('textarea_lsm_content').value=blstr;
    document.getElementById('textarea_lsm_state').value='读取名为 '+cskey+' 的 localStorage 值，行数：'+blstr.split('\n').length;
}

function menu_lsm(){
    var str_t=klmenu_hide_b();

    var klmenu_local=[ 
    '<span class="span_menu" onclick="'+str_t+'local_storage_view_lsm(\'name\');">查看全部 localStorage key</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_view_lsm(\'name_length\');">查看全部 localStorage key 和 长度</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_view_lsm();">查看全部 localStorage</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_view_lsm(\'brief\');">简略显示全部 localStorage</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_import_lsm();">导入 localStorage</span>',
    ];
    
    var klmenu_config=[ 
    '<span class="span_menu" onclick="'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'lsm\');}">更新版本</span>',
    ];
        
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_local,'','20rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','8rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function init_lsm(){
    var oform=document.querySelector('form[name="form_lsm"]');
    if (oform){
	    oform.setAttribute('action',postpath_b()+'temp_txt_share.php');
    }
    var op=document.getElementById('p_buttons');
    if (op){
        var bljg=textarea_buttons_b('textarea_lsm_content','全选,清空,复制,save as txt file,发送到临时记事本,发送地址','lsm');    
        op.insertAdjacentHTML('beforeend',bljg);
    }
    input_with_x_b('input_search',(ismobile_b()?5:9));
    if (ismobile_b()){
        document.getElementById('td_lsm_name').width='30%';    
        document.getElementById('td_lsm_value').width='70%';
    }
    keys_lsm();
    args_lsm();
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('td#td_lsm_name span.oblong_box'));    
}

function args_lsm(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：.htm?s=english& - 保留注释
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,4)=='key='){
                one_key=one_key.substring(4,).trim().replace(new RegExp(',','g'),'|');
                filter_lsm(one_key,true);
                selected_keys_lsm('value');
                break;
            }
        }
    }
}

function keys_lsm(){
    var otd=document.getElementById('section_lsm_name');

    var lsm_key=[];
    for (let blxl = 0; blxl < localStorage.length; blxl++){
        lsm_key.push('<input type="checkbox" value="'+localStorage.key(blxl)+'" /> <span class="span_link" onclick="local_storage_read_key_lsm(this.innerText);">'+localStorage.key(blxl)+'</span>');
    }
    lsm_key.sort();
    otd.innerHTML=array_2_li_b(lsm_key,'li','ol','ol_lsm');
    filter_lsm();
}
