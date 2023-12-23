function init_common(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),true,false,2);
    input_with_x_b('input_search',11);

    var input_list=[['input_result_max',6,0.5]];
    input_size_b(input_list,'id');
    
    data_file_jscm_global='';
    icon_emoji_jscm_global='🔎';
    title_name_jscm_global='Common Search';
    var_name_jscm_global='';
    js_additional_jscm_global='';
    raw_data_len_jscm_global=0;
    
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
            }
        }
    }
    document.title=icon_emoji_jscm_global+' '+title_name_jscm_global;
    document.getElementById('span_title').innerText=title_name_jscm_global;
    
    file_dom_create_b([data_file_jscm_global,(js_additional_jscm_global==''?'':'js_additional_'+js_additional_jscm_global+'_code.js')]);

    js_data_current_common_search_global=[];
    menu_common();
    wait_array_common();
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
    }
    
    function sub_wait_array_common_check(){
        if (blfound){
            sub_wait_array_common_fn(); //数组载入后，再载入code.js - 保留注释
            return;
        }
        
        if (blxl>csmax){
            console.log('未发现数组 '+var_name_jscm_global+'，等待次数：',blxl);        
            document.getElementById('span_count').innerHTML='数据载入失败，等待次数：'+blxl+' <a href="'+data_file_jscm_global+'" target=_blank>'+file_path_name_b(data_file_jscm_global)[3]+'</a>';    //'+location.origin+'/'
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
                        
            raw_data_len_jscm_global=csarray.length;
            console.log('发现数组 '+var_name_jscm_global+'，等待次数：',blxl);
            document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
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
        klmenu_list.push('<a href="?'+encodeURIComponent(js_file_row_2_arg_common(item,true))+'">'+item[2]+'</a>');
    }
    return klmenu_list;
}

function js_file_row_2_arg_common(arow,return_str=false){
    var list_t=['d='+arow[0],'i='+arow[1],'t='+arow[2],'v='+arow[3],'j='+arow[4]];
    if (return_str){
        return list_t.join('&');
    }
    return list_t;
}

function menu_common(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span id="span_reg_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',    
    '<span id="span_highlight_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ highlight</span>',    
    '<span id="span_row_no_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ row no</span>',        
    '<span id="span_http_links_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ http links</span>',    
    '<span id="span_additional_fn_common" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ additional fn</span>',       
    ];

    var group_list=[
    ['⚪ table','klmenu_check_b(this.id,true);',false,'span_table_style_common'],
    ['⚪ columns','klmenu_check_b(this.id,true);',false,'span_table_columns_common'],
    ['⚪ row no','klmenu_check_b(this.id,true);',false,'span_table_row_no_common'],

    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'th_set_common();">设定表格列名称</span>',
    '<span class="span_menu" onclick="'+str_t+'standalone_search_common();">当前结果导出为 standalone search</span>',
    ]);
    
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
        menu_files.push(klmenu_b(klmenu_list,akey.substring(2,),'16rem','1rem','1rem','30rem'));
    }
        
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,icon_emoji_jscm_global,'18rem','1rem','1rem','60rem')+menu_files.join('')+'<span id="span_menu_more_common"></span>'+klmenu_b(klmenu_config,'⚙','19rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_common',true);
    klmenu_check_b('span_highlight_common',true);
    klmenu_check_b('span_row_no_common',true);
    klmenu_check_b('span_http_links_common',true);    
    klmenu_check_b('span_additional_fn_common',true);    

    klmenu_check_b('span_table_columns_common',true);    
    klmenu_check_b('span_table_row_no_common',true);    

    if (data_file_jscm_global!==''){
        recent_common();
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
    for (let blxl=0;blxl<result_t.length;blxl++){
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
    
    result_percent_b('span_count',js_data_current_common_search_global.length,raw_data_len_jscm_global);

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

function page_common(csno,show_html=true){
    function sub_page_common_td_generate(csxl,item){
        var bltds=[];
        if (show_table_row_no){
            bltds.push('<td nowrap>'+(csxl+1)+'</td>');
        }
        
        if (td_align==false){
            for (let one_col of item[0]){
                bltds.push('<td>'+http_link_common(one_col,http_links)+'</td>');
            }
        } else {
            for (let blxl=0;blxl<item[0].length;blxl++){
                one_col=item[0][blxl];
                bltds.push('<td align="'+td_align[blxl]+'">'+http_link_common(one_col,http_links)+'</td>');
            }
        }
        return bltds;
    }
    //-----------------------
    var cslen=js_data_current_common_search_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_jscm_global,csno,'page_common','locate_common',false,2,Math.round(raw_data_len_jscm_global/rows_per_page_jscm_global/10));  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_jscm_global,cslen);
    var blno=0;
    
    var http_links=klmenu_check_b('span_http_links_common',false);
    var td_align=false;
    if (typeof table_th_jscm_global !== 'undefined'){
        td_align=Object.values(table_th_jscm_global);
    }
    var id_no,is_table,table_columns,show_table_row_no;
    [id_no,is_table,table_columns,show_table_row_no]=table_option_get_common();;

    if (is_all_result_jscm_global || id_no==false){
        if (is_table){
            for (let blxl=csno-1;blxl<blend;blxl++){
                var item=js_data_current_common_search_global[blxl];
                if (table_columns && Array.isArray(item[0])){
                    var bltds=sub_page_common_td_generate(blxl,item);
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
                    var bltds=sub_page_common_td_generate(blxl,item);
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
        }
    }
    return result_t;
}

function table_option_get_common(){
    var id_no=klmenu_check_b('span_row_no_common',false);
    var is_table=klmenu_check_b('span_table_style_common',false);
    var table_columns=klmenu_check_b('span_table_columns_common',false);
    var show_table_row_no=klmenu_check_b('span_table_row_no_common',false);
    return [id_no,is_table,table_columns,show_table_row_no];
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

function flot_load_common(file1=['flot'],flot_type=['time','symbol'],file2=[],file3=[],file4=[]){
    function sub_flot_load_common_flot(){
        flot_import_js_b(flot_type,false,'dom'); 
    }
    //-----------------------
    var file_list=klbase_addons_import_js_b(file1,file2,file3,file4,true,false);
    file_dom_create_b(file_list,true,'js');
    load_fn_b('flot_import_js_b',-1,2000,sub_flot_load_common_flot);
}

function merge_data_common(varname,jsfile_list,ospan=false){    
    function sub_merge_data_common_done(){
        raw_data_len_jscm_global=eval(varname).length;
        document.getElementById('span_count').innerText='('+raw_data_len_jscm_global+')';
        if (ospan){
            ospan.outerHTML='';
        }
    }
    //-----------------------
    if (jsfile_list.length==0){return;} 

    if (!confirm('是否合并数据？')){return;}
    document.getElementById('span_count').innerText='数据载入中...';

    merge_js_data_files_in_one_b(varname,jsfile_list,sub_merge_data_common_done);
}
