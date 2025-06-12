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
                document.getElementById('textarea_lsm_status').value='移除名为 '+key_list.join(', ')+' 的 localStorage 值';        
                keys_generate_lsm();                
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
        } else {
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
    } else {
        for (let item of olis){
            item.querySelector('input[type="checkbox"]').checked=false;
        }
        document.getElementById('checkbox_select_all').checked=false;
    }
}

function local_storage_view_lsm(cstype=''){
    var blstr, bllen;
    [blstr,bllen]=local_storage_all_b(cstype);
    if (Array.isArray(blstr)){
        blstr=blstr.join('\n');
    }
    document.getElementById('textarea_lsm_content').value=blstr;
    document.getElementById('textarea_lsm_status').value='localStorage 长度：'+bllen;
    if (cstype==''){
        local_storage_today_b('local_storage_used_length',40,(bllen/1024).toFixed(2),':');
    }
}

function local_storage_import_lsm(){
    if (local_storage_import_b('textarea_lsm_content')){
        document.getElementById('textarea_lsm_status').value='批量导入 localStorage 完成';
    }
}

function local_storage_read_key_lsm(cskey=''){
    if (cskey==''){
        cskey=(prompt('输入key') || '').trim();
    }
    if (cskey==''){return;}
    var blstr=local_storage_get_b(cskey);
    document.getElementById('textarea_lsm_content').value=blstr;
    document.getElementById('textarea_lsm_status').value='读取名为 '+cskey+' 的 localStorage 值，行数：'+blstr.split('\n').length;
}

function menu_lsm(){
    var str_t=klmenu_hide_b();
    var blparent=menu_parent_node_b(str_t);

    var klmenu_local=[ 
    '<span class="span_menu" onclick="'+str_t+'keys_generate_lsm();">刷新 localStorage key</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_view_lsm(\'name\');">查看全部 localStorage key</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_view_lsm(\'name_length\');">查看全部 localStorage key 和 长度</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_view_lsm(\'brief\');">简略显示全部 localStorage</span>',
    '<span class="span_menu" onclick="'+str_t+'local_storage_import_lsm();">导入 localStorage</span>',
    ];

    var group_list=[
    ['查看全部 localStorage','local_storage_view_lsm();',true],
    ['无分隔符','local_storage_whole_hash_lsm(false);',true],
    ];    
    klmenu_local.push(menu_container_b(str_t,group_list,''));    
    
    var group_list=[
    ['生成','local_storage_key_hash_lsm(\'generate\');',true],
    ['比较','local_storage_key_hash_lsm(\'compare\');',true],
    ['整体','local_storage_whole_hash_lsm();',true],
    ['textarea','textarea_hash_lsm();',true],
    ];    
    klmenu_local.push(menu_container_b(str_t,group_list,'hash localStorage: '));    

    var klmenu_config=root_font_size_menu_b(str_t);

    klmenu_config=klmenu_config.concat([ 
    idb_menu_generate_bigfile_b('lsm','select_big_file_lsm',blparent,'import_bigfile_lsm'),    
    '<span class="span_menu" onclick="'+str_t+'machine_name_lsm();">machine name</span>',
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'lsm\');">更新版本</span>',
    fpara_menu_b(str_t),
    ]);
    
    var group_list=[
    ['更新指定文件','update_remote_file_lsm();',true],
    ['DRY RUN','update_remote_file_lsm(true);',true],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));        
        
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_local,'☁','25rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','60rem'),'','0rem')+' ');
}


function import_bigfile_lsm(fname=false){
    function sub_import_bigfile_lsm_onsuccess(cscontent){
        if (fname!==false){
            document.getElementById('textarea_lsm_status').value='从 bigfile 导入：'+fname;
        }
    }
    
    if (fname===false){
        fname=document.getElementById('select_big_file_lsm').value;
    }
    
    if (fname=='手动输入 bigfile lsm 文件名'){
        fname=false;
    }
    import_bigfile_content_b(fname,'textarea_lsm_content',sub_import_bigfile_lsm_onsuccess);
}

function textarea_hash_lsm(){
    var blhash=SHA1(document.getElementById('textarea_lsm_content').value);
    document.getElementById('textarea_lsm_status').value='SHA1: '+blhash;
}

function local_storage_whole_hash_lsm(do_hash=true){
    var blstr=local_storage_all_b('',[],false)[0];
    if (do_hash){
        var blhash='SHA1: '+SHA1(blstr);    //hash 字符串 和 hash 包含该字符串的文本文件 是两个概念 - 保留注释
    } else {
        var blhash=blstr;
    }
    document.getElementById('textarea_lsm_content').value=blhash;
}

function local_storage_key_hash_lsm(cstype){
    var current_dict={};
    for (let blxl = 0,lent= localStorage.length; blxl <lent; blxl++){
        var keyname=localStorage.key(blxl);
        var blhash=SHA1(localStorage.getItem(keyname));
        current_dict['k_'+keyname]=blhash;
    }
    
    switch (cstype){
        case 'generate':
            current_dict=object2array_b(current_dict,true,2);
            current_dict.sort();
            for (let blxl=0,lent=current_dict.length;blxl<lent;blxl++){
                current_dict[blxl]=current_dict[blxl][0]+' '+current_dict[blxl][1];
            }
            localStorage.setItem('ls_hash',current_dict.join('\n'));
            document.getElementById('textarea_lsm_content').value=current_dict.join('\n');
            break;
        case 'compare':
            var old_list=local_storage_get_b('ls_hash',-1,true);
            var changed_t=new Set();
            for (let item of old_list){
                var blat=item.lastIndexOf(' ');
                if (blat==-1){continue;}
                var blkey=item.substring(0,blat);
                var blvalue=item.substring(blat+1,);
                if (current_dict['k_'+blkey]===blvalue){continue;}
                changed_t.add(blkey);
            }
            document.getElementById('textarea_lsm_content').value=local_storage_all_b('',Array.from(changed_t))[0];
            document.getElementById('textarea_lsm_status').value=Array.from(changed_t);
            break;
    }
}

function machine_name_lsm(){
    var blold=local_storage_get_b('machine_name');
    var blnew=prompt('输入新的machine name',blold);
    if (blnew==null){return;}
    var blnew=blnew.trim();
    if (blold==blnew){return;}
    if (!confirm('是否将 machine_name 从 '+blold+' 修改为 '+blnew+'？')){return;}
    localStorage.setItem('machine_name',blnew);
}

function update_remote_file_lsm(is_dry_run=false){
    var blstr=(prompt('输入指定文件名称关键词，如 enwords') || '').trim();
    if (blstr==''){return;}
    var blcaption=(is_dry_run?'DRY':'是否更新指定文件？');
    service_worker_delete_b('',blstr,blcaption,'value','textarea_lsm_status');
}

function init_lsm(){
    menu_lsm();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    character_2_icon_b('☁');

    var oform=document.querySelector('form[name="form_lsm"]');
    if (oform){
	    oform.setAttribute('action',postpath_b()+'temp_txt_share.php');
    }
    var op=document.getElementById('p_buttons');
    if (op){
        var bljg=textarea_buttons_b('textarea_lsm_content','全选,清空,复制,save as txt file,导入 txt 文件,↑,↓,发送到临时记事本,发送地址','lsm');    
        op.insertAdjacentHTML('beforeend',bljg);
    }
    input_with_x_b('input_search',(ismobile_b()?5:9));
    if (ismobile_b()){
        document.getElementById('td_lsm_name').width='30%';    
        document.getElementById('td_lsm_value').width='70%';
    
        var otextarea=document.getElementById('textarea_lsm_status');
        otextarea.style.height='20rem';
    }
    keys_generate_lsm();
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

function keys_generate_lsm(){
    var otd=document.getElementById('section_lsm_name');

    var lsm_key=[];
    for (let blxl = 0,lent=localStorage.length; blxl<lent; blxl++){
        lsm_key.push('<input type="checkbox" value="'+localStorage.key(blxl)+'" /> <span class="span_link" onclick="local_storage_read_key_lsm(this.innerText);">'+localStorage.key(blxl)+'</span>');
    }
    lsm_key.sort();
    otd.innerHTML=array_2_li_b(lsm_key,'li','ol','ol_lsm');
    filter_lsm();
}
