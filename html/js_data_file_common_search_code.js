function init_common(){
    style_generate_b('#divhtml li:hover {background-color:'+scheme_global['button']+';}',true);

    is_all_result_jscm_global=false;
    clicked_row_no_jscm_global=-1;
    rows_per_page_jscm_global=100;
    if (is_standalone_html_file_global){
        js_file_list_common_global=[];
    } else {
        js_file_list_common_global=array_union_b(js_file_list_common_pb_global,js_file_list_common_kl_global);
    }
    js_file_list_common_pb_global=[];
    js_file_list_common_kl_global=[];
    //-----------------------
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),!is_standalone_html_file_global,false,2);
    input_with_x_b('input_search',11);

    var input_list=[['input_result_max',6,0.5]];
    input_size_b(input_list,'id');
    
    data_file_jscm_global='';
    icon_emoji_jscm_global='🔎';
    title_name_jscm_global='Common Search';
    var_name_jscm_global='';
    js_additional_jscm_global='';
    load_remote_data_jscm_global='1';
    
    raw_data_len_jscm_global=0;

    if (!is_standalone_html_file_global){
        var cskeys=href_split_b(location.href);
        if (cskeys.length>0 && cskeys[0]!==''){
            for (let one_key of cskeys){
                if (one_key.substring(0,2)=='s='){
                    one_key=one_key.substring(2,);
                    var is_reg;
                    [one_key,is_reg]=str_reg_check_b(one_key,false,true);
                    for (let arow of js_file_list_common_global){
                        var blfound=str_reg_search_b(arow,one_key,is_reg);
                        if (blfound){
                            cskeys=js_file_row_2_arg_common(arow,false);
                            break;
                        }
                    }
                    break;
                }
            }
            
            for (let one_key of cskeys){
                one_key=one_key.trim();
                if (one_key.substring(0,2)=='d='){
                    data_file_jscm_global=one_key.substring(2,)
                } else if (one_key.substring(0,2)=='i='){
                    icon_emoji_jscm_global=one_key.substring(2,)
                } else if (one_key.substring(0,2)=='t='){
                    title_name_jscm_global=one_key.substring(2,)
                } else if (one_key.substring(0,2)=='v='){
                    var_name_jscm_global=one_key.substring(2,)
                } else if (one_key.substring(0,2)=='j='){
                    js_additional_jscm_global=one_key.substring(2,)
                } else if (one_key.substring(0,2)=='r='){
                    load_remote_data_jscm_global=one_key.substring(2,)
                }                
            }
        }
    }
    
    var status_t=global_var_common();
    console.log(status_t.join('\n'));

    web_page_name_set_common();

    if (load_remote_data_jscm_global=='0' && !is_local_b()){
        eval(var_name_jscm_global+'=[]');   //设置默认值为空，只对非本地段起作用 - 保留注释
        if (!is_standalone_html_file_global){
            file_dom_create_b([(js_additional_jscm_global==''?'':'js_additional_'+js_additional_jscm_global+'_code.js')]);
        }
    } else {
        if (!is_standalone_html_file_global){
            file_dom_create_b([data_file_jscm_global,(js_additional_jscm_global==''?'':'js_additional_'+js_additional_jscm_global+'_code.js')]);
        }
    }
    
    js_data_current_common_search_global=[];
    menu_common();
    wait_array_common();
}

function global_var_common(do_alert=false){
    var status_t=[];
    for (let item of ['data_file_jscm_global','icon_emoji_jscm_global','title_name_jscm_global','var_name_jscm_global','js_additional_jscm_global','load_remote_data_jscm_global']){
        if (eval('typeof '+item) =='undefined'){
            status_t.push(item+'=undefined;');
        } else {
            status_t.push(item+'=\''+eval(item)+'\';');
        }
    }

    if (typeof table_th_jscm_global =='undefined'){
        status_t.push('table_th_jscm_global=undefined;');
    } else {
        status_t.push('table_th_jscm_global='+JSON.stringify(table_th_jscm_global)+';');
    }
    
    if (do_alert){
        alert(status_t.join('\n'));
    }
    return status_t;
}

function web_page_name_set_common(){
    document.title=icon_emoji_jscm_global+' '+title_name_jscm_global;
    document.getElementById('span_title').innerText=title_name_jscm_global;
}

function web_page_count_set_common(cslen){
    raw_data_len_jscm_global=cslen;
    document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
}

function args_common(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,2)=='k='){
                search_common(one_key.substring(2,));
                break;
            }
        }
    }
}

function wait_array_common(){
    function sub_wait_array_common_fn(){
        for (let afn of ['style_load_','file_load_']){
            var fn_style_load=fn_name_get_common(afn);
            if (fn_style_load!==''){
                try {
                    eval(fn_style_load+'()');
                } catch (error){
                    console.log(error);
                }
            }
        }
        
        var fn_data_load=fn_name_get_common('data_load_');
        if (fn_data_load!==''){
            try {
                eval(fn_data_load+'("'+var_name_jscm_global+'")');
            } catch (error){
                console.log(error);
            }
        }

        var menu_more_str='';
        var fn_menu_more=fn_name_get_common('menu_more_');
        if (fn_menu_more!==''){
            try {
                menu_more_str=eval(fn_menu_more+'()');
            } catch (error){
                menu_more_str='';
                console.log(error);
            }
        }
        var ospan=document.getElementById('span_menu_more_common');
        if (ospan){
            ospan.outerHTML=menu_more_str;
        }
        
        var fn_more_run=fn_name_get_common('fn_more_'); //在menu载入后运行 - 保留注释
        if (fn_more_run!==''){
            try {
                eval(fn_more_run+'()');
            } catch (error){
                console.log(error);
            }
        }
        args_common();
    }
    
    function sub_wait_array_common_check(){
        if (blfound){
            sub_wait_array_common_fn(); //数组载入后，再载入code.js - 保留注释
            return;
        }
        
        if (blxl>csmax){
            console.log('未发现数组 '+var_name_jscm_global+'，等待次数：',blxl);
            document.getElementById('span_count').innerHTML='数据载入失败，等待次数：'+blxl+' <a href="'+data_file_jscm_global+'" target=_blank>'+file_path_name_b(data_file_jscm_global)[3]+'</a>';
            return;
        }
        
        if (document.readyState=='loading'){
            console.log(blxl,'loading');
            blxl=blxl+1;
            setTimeout(sub_wait_array_common_check,1000);
            return;        
        }
        
        try {
            var csarray=eval(var_name_jscm_global);
            if (typeof csarray == 'object'){
                if (Array.isArray(csarray)==false){
                    var list_t=[];
                    for (let key in csarray){
                        list_t.push([key,csarray[key]]);
                    }
                    eval(var_name_jscm_global+'=list_t');
                    csarray=list_t;
                }
            }
                        
            web_page_count_set_common(csarray.length);
            console.log('发现数组 '+var_name_jscm_global+'，等待次数：',blxl);
            blfound=true;
            sub_wait_array_common_check();
        } catch (error){
            console.log(blxl,'error',error);        
            blxl=blxl+1;
            setTimeout(sub_wait_array_common_check,1000);
        }
    }
    //-----------------------
    var blxl=1;
    var csmax=(is_local_b()?20:50);
    var blfound=false;
    document.getElementById('span_count').innerText='数据载入中...';
    setTimeout(sub_wait_array_common_check,1);  //先载入数组 - 保留注释
}

function js_file_links_common(csarray){
    var klmenu_list=[];
    for (let item of csarray){
        if (item[2]==title_name_jscm_global){continue;}
        klmenu_list.push('<a href="?'+encodeURIComponent(js_file_row_2_arg_common(item,true))+'">'+item[1]+' '+item[2]+'</a>');
    }
    return klmenu_list;
}

function js_file_row_2_arg_common(arow,return_str=false){
    var list_t=['d='+arow[0],'i='+arow[1],'t='+arow[2],'v='+arow[3],'j='+arow[4],'r='+arow[6]];
    if (return_str){
        return list_t.join('&');
    }
    return list_t;
}

function rows_per_page_set_common(){
    var new_value=prompt('输入每页记录数',rows_per_page_jscm_global);
    if (new_value==null){return;}
    new_value=parseInt(new_value.trim());
    if (isNaN(new_value)){return;}
    rows_per_page_jscm_global=Math.max(1,new_value);
}

function menu_common(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'th_set_common();">设定表格列名称</span>',
    '<span class="span_menu" onclick="'+str_t+'rows_per_page_set_common();">修改每页记录数</span>',
    ];

    var group_list=[
    ['⚪ reg','klmenu_check_b(this.id,true);',false,'span_reg_common'],
    ['⚪ highlight','klmenu_check_b(this.id,true);',false,'span_highlight_common'],
    ['⚪ line no','klmenu_check_b(this.id,true);',false,'span_line_no_common'],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var group_list=[
    ['⚪ http links','klmenu_check_b(this.id,true);',false,'span_http_links_common'],
    ['⚪ additional fn','klmenu_check_b(this.id,true);',false,'span_additional_fn_common'],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,''));

    var group_list=[
    ['⚪ table','klmenu_check_b(this.id,true);',true,'span_table_style_common'],
    ['⚪ columns','klmenu_check_b(this.id,true);',false,'span_table_columns_common'],
    ['⚪ row no','klmenu_check_b(this.id,true);',false,'span_table_row_no_common'],
    ];
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'global_var_common(true);">全局变量一览</span>',
    '<span class="span_menu" onclick="'+str_t+'upload_data_files_form_common();">上传数据文件或从bigfile导入</span>',
    '<span class="span_menu" onclick="'+str_t+'split_current_arr_common();">当前结果数组分割</span>',
    '<span class="span_menu" onclick="'+str_t+'sort_by_key_count_common();">当前条件按输入的关键词出现次数排序</span>',    
    ]);
    
    if (!is_standalone_html_file_global){
        klmenu_config.push('<span class="span_menu" onclick="'+str_t+'standalone_search_common();">当前结果导出为 standalone search</span>');
    }
    
    var menu_group={};
    js_file_list_common_global.sort(function (a,b){return zh_sort_b(a,b,false,2);});
    js_file_list_common_global.sort(function (a,b){return zh_sort_b(a,b,false,5);});
    for (let item of js_file_list_common_global){
        var blcategory='c_'+(item[5]==''?'📜':item[5]);
        if (menu_group[blcategory]==undefined){
            menu_group[blcategory]=[];
        }
        menu_group[blcategory].push(item);
    }
    
    var menu_files=[];
    for (let akey in menu_group){
        var klmenu_list=js_file_links_common(menu_group[akey]);
        menu_files.push(klmenu_b(klmenu_list,akey.substring(2,),'18rem','1rem','1rem','30rem'));
    }
        
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,icon_emoji_jscm_global,'18rem','1rem','1rem','60rem')+menu_files.join('')+'<span id="span_menu_more_common"></span>'+klmenu_b(klmenu_config,'⚙','19rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_common',true);
    klmenu_check_b('span_highlight_common',true);
    klmenu_check_b('span_line_no_common',true);
    klmenu_check_b('span_http_links_common',true);    
    klmenu_check_b('span_additional_fn_common',true);    

    klmenu_check_b('span_table_style_common',true);    
    klmenu_check_b('span_table_columns_common',true);    
    klmenu_check_b('span_table_row_no_common',true);    

    if (data_file_jscm_global!==''){
        recent_common();
    }
}

function sort_by_key_count_common(){
    js_data_current_common_search_global=arr_key_includes_sort_b(js_data_current_common_search_global,search_key_split_b()[1],0);
    page_common();
}

function upload_data_files_form_common(){
    var blstr='<p>Select file: <input type="file" id="input_upload_data_files_common" multiple /> <span class="aclick" onclick="upload_data_files_result_common();">上传文件</span>';
    var bname=file_path_name_b(data_file_jscm_global);
    if (bname[3]!==''){
        blstr=blstr+'<span class="aclick" onclick="upload_data_file_from_bigfile_common();">从bigfile导入'+bname[3]+'</span>';
    }
    blstr=blstr+'</p>';
    document.getElementById('divhtml').innerHTML=blstr;
}

function upload_data_file_from_bigfile_common(){
    function sub_upload_data_file_from_bigfile_common_done(is_ok){
        if (is_ok){
            upload_data_files_result_common(eval(var_name_jscm_global));
        } else {
            alert('导入失败');
        }
    }
    
    var bname=file_path_name_b(data_file_jscm_global)[3];
    if (bname=='' || var_name_jscm_global==''){return;}

    eval(var_name_jscm_global+'=undefined'); 
    
    load_js_var_file_b(var_name_jscm_global,[],bname,sub_upload_data_file_from_bigfile_common_done,true,true);
}

function split_current_arr_common(){
    function sub_split_current_arr_common_refresh(){
        current_len_refresh_common();
        page_common();
    }
    array_split_by_range_b('js_data_current_common_search_global',sub_split_current_arr_common_refresh);
}

function upload_data_files_result_common(csarr=false){
    var fn_upload_data_files=fn_name_get_common('upload_data_files_');
    if (fn_upload_data_files!==''){
        try {
            run_fn=eval(fn_upload_data_files);  //调用形如 function upload_data_files_xxx 的自定义函数，在上传完毕后执行 - 保留注释
            if (csarr===false){
                upload_files_to_list_b('input_upload_data_files_common',run_fn,'.js');
            } else {
                run_fn(csarr,true);
            }
        } catch (error){
            alert(str(error));
            console.log(error);
        }
    } else {
        alert('未发现 upload_data_files_'+js_additional_jscm_global+' 函数');
    }
}

function th_set_common(){
    var old_value='{"列1":"","列1":"right"}';
    if (typeof table_th_jscm_global !== 'undefined'){
        var list_t=[];
        for (let key in table_th_jscm_global){
            list_t.push('"'+specialstr_j(key)+'":"'+table_th_jscm_global[key]+'"');
        }
        old_value='{'+list_t.join(',')+'}';
    }
    var new_value=prompt('输入表格列名称和格式，输入 undefined 删除表格头',old_value);
    if (new_value==null){return;}
    if (new_value=='undefined'){
        table_th_jscm_global=undefined;
        return;
    }
    
    var new_dict=false;
    try {
        eval('new_dict='+new_value);
    } catch (error){
        console.log(error);
        return;
    }
    
    table_th_jscm_global=new_dict;
}

function standalone_search_common(){
    var bltitle=prompt('输入标题');
    if (bltitle==null){return;}
    if (bltitle.trim()==''){
        bltitle='Common Search';
    }
    var old_value=rows_per_page_jscm_global;
    rows_per_page_jscm_global=js_data_current_common_search_global.length;
    var result_t=page_common(1,false);
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]='"'+specialstr_j(result_t[blxl])+'",';
    }
    standalone_search_funs_b(bltitle.trim(),result_t.join('\n'),['style_generate_b'],false,th_generate_common());
    rows_per_page_jscm_global=old_value;
}

function recent_common(csstr=''){
    recent_search_b('recent_search_common',csstr,'search_common','div_recent_search',[],25,false);
}

function search_common(cskey=false,row_no=1,show_html=true){
    var oinput=document.getElementById('input_search');
    if (cskey===false){
        cskey=oinput.value.trim();
    }
    
    if (show_html){
        recent_common(cskey);
    }
    
    var isreg=klmenu_check_b('span_reg_common',false);
    [cskey,isreg]=str_reg_check_b(cskey,isreg,true);    

    oinput.value=cskey;
    
    js_data_current_common_search_global=[];    //全局变量 - 保留注释
    
    try {
        var csarray=eval(var_name_jscm_global);
    } catch (error){
        var csarray=[];
        console.log(error);
    }

    var blmax=parseInt(document.getElementById('input_result_max').value) || -1;
    var blcount=0;

    is_all_result_jscm_global=true;
    [js_data_current_common_search_global,is_all_result_jscm_global]=common_search_b(cskey,isreg,csarray,blmax);
        
    var fn=fn_name_get_common('col_rearrange_');
    if (fn!==''){
        var list_t=[];
        try {
            list_t=eval(fn+'()');
        } catch (error){
            console.log(error);
            list_t=[];
        }
        
        if (list_t.length>0){
            js_data_current_common_search_global=list_t;
        }
    }
    
    current_len_refresh_common();

    clicked_row_no_jscm_global=row_no;
    var page_no=Math.ceil(row_no/rows_per_page_jscm_global);
    if (show_html){
        page_common(1+(page_no-1)*rows_per_page_jscm_global);
    }
}

function fn_name_get_common(prefix){
    var blname='';
    var enable_add_fn=klmenu_check_b('span_additional_fn_common',false);
    if (js_additional_jscm_global=='' || !enable_add_fn){return '';}
    
    var blname=prefix+js_additional_jscm_global;
    try {
        if (eval('typeof '+blname) !== 'function'){
            console.log('not found function:',blname);
            blname='';
        } else {
            console.log('found function:',blname);        
        }
    } catch (error){
        blname='';
        console.log(error);
    }
    
    return blname;
}

function http_link_common(csstr,enable_http){
    function sub_http_link_common_a_row(acell){
        if (typeof acell == 'string'){
            if (!acell.includes(' ') && !acell.includes('"') && (acell.substring(0,7)=='http://' || acell.substring(0,8)=='https://')){
                acell='<a href="'+acell+'" target=_blank>'+acell+'</a>';
            }    
        }
        return acell;
    }
    //-----------------------
    if (enable_http){
        if (typeof csstr == 'string'){
            csstr=sub_http_link_common_a_row(csstr);
        } else if (Array.isArray(csstr)){
            var result_t=[];
            for (let acol of csstr){
                result_t.push(sub_http_link_common_a_row(acol));
            }
            return result_t;
        }
    }
    return csstr;
}

function group_content_common(csarr,csoption=false){
    if (csoption===false){
        csoption=table_option_get_common(true);
    }
    var id_no,is_table,table_columns,show_table_row_no,http_links,td_align;
    [id_no,is_table,table_columns,show_table_row_no,http_links,td_align]=csoption;

    var result_t=[];
    if (is_table){
        for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
            var item=csarr[blxl];
            if (table_columns && Array.isArray(item[0])){
                var bltds=page_td_generate_common(blxl,item,show_table_row_no,td_align,http_links);
                bltds.push(no_jump_common(item[1],'td'));
                result_t.push('<tr>'+bltds.join('')+'</tr>');
            } else {
                result_t.push('<tr>'+(show_table_row_no?'<td nowrap>'+(blxl+1)+'</td>':'')+'<td>'+http_link_common(item[0],http_links)+no_jump_common(item[1])+'</td></tr>');
            }
        }
    } else {
        for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
            var item=csarr[blxl];
            result_t.push('<li>'+http_link_common(item[0],http_links)+no_jump_common(item[1])+'</li>');
        }
    }
    return result_t;
}

function page_td_generate_common(csxl,item,show_table_row_no,td_align,http_links){
    var bltds=[];
    if (show_table_row_no){
        bltds.push('<td nowrap>'+(csxl+1)+'</td>');
    }
    
    if (td_align==false){
        for (let one_col of item[0]){
            bltds.push('<td>'+http_link_common(one_col,http_links)+'</td>');
        }
    } else {
        for (let blxl=0,lent=item[0].length;blxl<lent;blxl++){
            one_col=item[0][blxl];
            bltds.push('<td align="'+td_align[blxl]+'">'+http_link_common(one_col,http_links)+'</td>');
        }
    }
    return bltds;
}
    
function page_common(csno=1,show_html=true){
    var cslen=js_data_current_common_search_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_jscm_global,csno,'page_common','locate_common',false,2,Math.round(raw_data_len_jscm_global/rows_per_page_jscm_global/10));  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_jscm_global,cslen);
    var blno=0;
    
    var id_no,is_table,table_columns,show_table_row_no,http_links,td_align;
    [id_no,is_table,table_columns,show_table_row_no,http_links,td_align]=table_option_get_common(true);

    if (is_all_result_jscm_global || id_no==false){
        if (is_table){
            for (let blxl=csno-1;blxl<blend;blxl++){
                var item=js_data_current_common_search_global[blxl];
                if (table_columns && Array.isArray(item[0])){
                    var bltds=page_td_generate_common(blxl,item,show_table_row_no,td_align,http_links);
                    result_t.push('<tr id="tr_common_'+item[1]+'">'+bltds.join('')+'</tr>');
                } else {
                    result_t.push('<tr id="tr_common_'+item[1]+'">'+(show_table_row_no?'<td nowrap>'+(blxl+1)+'</td>':'')+'<td>'+http_link_common(item[0],http_links)+'</td></tr>');
                }
            }        
        } else {
            for (let blxl=csno-1;blxl<blend;blxl++){
                var item=js_data_current_common_search_global[blxl];
                result_t.push('<li id="li_common_'+item[1]+'">'+http_link_common(item[0],http_links)+'</li>');
            }
        }
    } else {
        if (is_table){
            for (let blxl=csno-1;blxl<blend;blxl++){
                var item=js_data_current_common_search_global[blxl];
                if (table_columns && Array.isArray(item[0])){
                    var bltds=page_td_generate_common(blxl,item,show_table_row_no,td_align,http_links);
                    bltds.push(no_jump_common(item[1],'td'));
                    result_t.push('<tr>'+bltds.join('')+'</tr>');
                } else {                
                    result_t.push('<tr>'+(show_table_row_no?'<td nowrap>'+(blxl+1)+'</td>':'')+'<td>'+http_link_common(item[0],http_links)+no_jump_common(item[1])+'</td></tr>');
                }
            }
        } else {
            for (let blxl=csno-1;blxl<blend;blxl++){
                var item=js_data_current_common_search_global[blxl];
                result_t.push('<li>'+http_link_common(item[0],http_links)+no_jump_common(item[1])+'</li>');
            }
        }
    }
    if (!show_html){
        return result_t;
    }
    
    var odiv=document.getElementById('divhtml');
    var tag_name=(is_table?['tr','td']:['li','li']);

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
        odiv.innerHTML=bljg+table_or_ol_common(id_no,is_table,table_columns,show_table_row_no,result_t)+bljg;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
        
        if (klmenu_check_b('span_highlight_common',false)){
            highlight_text_b([],'div#divhtml '+tag_name[1]);            
        }

        var oli=document.getElementById(tag_name[0]+'_common_'+clicked_row_no_jscm_global);
        if (oli){
            oli.scrollIntoView();
        } else {
            odiv.scrollIntoView();
        }
    }
    return result_t;
}

function table_option_get_common(return_http_align=false){
    var id_no=klmenu_check_b('span_line_no_common',false);
    var is_table=klmenu_check_b('span_table_style_common',false);
    var table_columns=klmenu_check_b('span_table_columns_common',false);
    var show_table_row_no=klmenu_check_b('span_table_row_no_common',false);
    
    if (return_http_align){
        var http_links=klmenu_check_b('span_http_links_common',false);
        var td_align=false;
        if (typeof table_th_jscm_global !== 'undefined'){
            td_align=Object.values(table_th_jscm_global);
        }
        return [id_no,is_table,table_columns,show_table_row_no,http_links,td_align];
    } else {
        return [id_no,is_table,table_columns,show_table_row_no];
    }
}

function th_generate_common(table_option=false){
    var id_no,is_table,table_columns,show_table_row_no;
    if (table_option===false){
        table_option=table_option_get_common();
    }
    [id_no,is_table,table_columns,show_table_row_no]=table_option;
    
    var th_str='';
    if (table_columns){
        if (typeof table_th_jscm_global !== 'undefined'){
            th_str='<th>'+Object.keys(table_th_jscm_global).join('</th><th>')+'</th>';
            if (show_table_row_no){
                 th_str='<th>No.</th>'+th_str;
            }
            
            if (id_no && !is_all_result_jscm_global){
                th_str=th_str+'<th>row no</th>';
            }
            th_str='<tr>'+th_str+'</tr>';
        }
    }
    return th_str;
}

function table_or_ol_common(id_no,is_table,table_columns,show_table_row_no,cslist){
    if (is_table){
        var th_str=th_generate_common([id_no,is_table,table_columns,show_table_row_no]);
        return '<table class="table_common">'+th_str+cslist.join('\n')+'</table>\n';    
    } else {
        return '<ol>'+cslist.join('\n')+'</ol>\n';
    }
}

function no_jump_common(csno,cstype=''){
    if (csno==-1){return '';}
    var blstr='<span style="cursor:pointer;font-size:0.8rem;color:'+scheme_global['memo']+';" onclick="search_common(\'\','+csno+');">('+csno+')</span>';
    if (cstype=='td'){
        return '<td>'+blstr+'</td>';
    } else {
        return ' '+blstr;
    }
}

function locate_common(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_common((blno-1)*rows_per_page_jscm_global+1);
    }        
}

function flot_load_common(file1=['flot'],flot_type=['time','symbol'],file2=[],file3=[],file4=[],import_jquery=true){
    function sub_flot_load_common_flot(){
        flot_import_js_b(flot_type,false,'dom'); 
    }
    //-----------------------
    var file_list=klbase_addons_import_js_b(file1,file2,file3,file4,import_jquery,false);
    file_dom_create_b(file_list,true,'js');
    if (file1.includes('flot') && import_jquery){
        load_fn_b('flot_import_js_b',sub_flot_load_common_flot);
    }
}

function current_len_refresh_common(){
    var current_len=js_data_current_common_search_global.length;
    result_percent_b('span_count',current_len,raw_data_len_jscm_global);
}

function arr_len_refresh_common(){
    raw_data_len_jscm_global=eval(var_name_jscm_global).length;
    document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
}

function merge_data_common(jsfile_list,ospan=false){    
    function sub_merge_data_common_done(){
        arr_len_refresh_common();
        if (ospan){
            ospan.outerHTML='';
        }
    }
    //-----------------------
    if (jsfile_list.length==0){return;} 

    if (!confirm('是否合并数据？')){return;}
    document.getElementById('span_count').innerText='数据载入中...';

    //jsfile_list 每个元素如："../jsdata/rmrb_online/rmrb_online_198801_200312_data.js" - 保留注释
    merge_js_data_files_in_one_b(var_name_jscm_global,jsfile_list,sub_merge_data_common_done,true);
}
