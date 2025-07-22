function init_bigfile(){
    file_name_bigfile_global='';
    file_content_bigfile_global='';
    raw_data_bigfile_global=[];
    current_data_bigfile_global=[];
    is_all_result_bigfile_global=true;
    rows_per_page_bigfile_global=10;
    
    today_clicked_websites_global=new Set();
    
    let ismobile=ismobile_b();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile?'1.8rem':'1.6rem'),true,false,2);
    input_with_x_b('input_search',11);
    character_2_icon_b('🍥');

    menu_bigfile();
    refresh_bigfile();
    is_args_checked_bigfile=false;
    
    var buttons_more='<span class="aclick" onclick="local_storage_import_b(\'textarea_temp_txt_share\',true);">import data to localStorage</span>';
    buttons_more=buttons_more+'<span class="aclick" onclick="update_temp_txt_share_b(\'enwords_temp\',\'textarea_temp_txt_share\');">更新最近记忆单词</span> ';
    buttons_more=buttons_more+'<span class="span_link" onclick="open_enwords_htm_bigfile();">enwords.htm</span>';

    init_temp_txt_share_b(false,'',false,true,buttons_more);
}

function open_enwords_htm_bigfile(){
    if (is_render_page_b()){
        html_form_bigfile('enwords.htm',true);
    } else {
        window.open('./enwords.htm');
    }
}

function args_bigfile(){
    var cskeys=href_split_b(location.href,false);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,4)=='htm='){
                one_key=one_key.substring(4,);
                if (!one_key.endsWith('.htm')){
                    one_key=one_key+'.htm';
                }
                html_form_bigfile(one_key,true);
                is_args_checked_bigfile=true;
                break;
            }
        }
    }

    var str_t=klmenu_hide_b('');
    var htm_menu=[];
    for (let item of raw_data_bigfile_global){
        var fname=item[1];
        if (!fname.endsWith('.htm')){continue;}
        if (fname=='bigfile_standalone.htm'){continue;}
        fname=fname.slice(0,-4);
        htm_menu.push('<a href="?render&idb&htm='+fname+'" onclick="'+str_t+'" target=_blank>'+fname+'</a>');
    }
    
    htm_menu.sort();
    var omenu=document.getElementById('span_menu_htm_bigfile');
    if (omenu){
        omenu.outerHTML=klmenu_b(htm_menu,'🌐','12rem','1rem','1rem','30rem');
    }
}

function recent_bigfile(csstr=''){
    recent_search_b('recent_search_bigfile',csstr,'search_bigfile','div_recent_search',[],25,false); //此行保留 - 保留注释
}

function refresh_bigfile(){
    idb_bigfile_b('read','','',read_fn_bigfile);
}

function clear_data_bigfile(){
    idb_bigfile_b('clear','','',read_fn_bigfile);
}

function menu_bigfile(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    klmenu_select_sort_b('select_sort_type_bigfile',['','文件名','内容','大小','日期'],str_t,'sort_bigfile',true,true,[],4),
    '<span class="span_menu" onclick="'+str_t+'refresh_bigfile();">refresh</span>',
    '<span class="span_menu" onclick="'+str_t+'clear_data_bigfile();">清空数据库</span>',
    '<span class="span_menu" onclick="'+str_t+'merge_files_bigfile();">合并导出当前文件内容</span>',
    '<span class="span_menu" onclick="'+str_t+'htm_files_prerequisite_bigfile();">当前条件htm文件包含文件列表</span>',
    '<span class="span_menu" onclick="'+str_t+'statistics_ext_bigfile();">当前条件文件扩展名统计</span>',
    ];
    
    var group_list=[
    ['⚪ 导出时加密','klmenu_check_b(this.id,true);',true,'span_encode_bigfile'],
    ['⚪ 导入时解密','klmenu_check_b(this.id,true);',true,'span_decode_bigfile'],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));

    var klmenu_batch=[];
    if (is_local_b()){
        klmenu_batch.push('<span class="span_menu" onclick="'+str_t+'batch_open_bigfile(\'dsrb\');">diff+selenium_enwords+readlater+BT</span>');
    } else {
        klmenu_batch.push('<span class="span_menu" onclick="'+str_t+'batch_open_bigfile(\'dnsrb\');">diff+notepad+selenium_enwords+readlater+BT</span>');
    }

    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'bigfile\');">更新版本</span>',
    '<span class="span_menu" onclick="'+str_t+'enwords_mini_search_frame_show_hide_b();">单词搜索</span>',        
    '<span class="span_menu" onclick="'+str_t+'show_hide_storage_bigfile();">暂存</span>',    
    '<span class="span_menu" onclick="'+str_t+'file_date_form_bigfile();">文件日期对比</span>',    
    '<span class="span_menu">删除方式：'+list_2_option_b(['数字确认','简单确认','直接删除'],'select_delete_option_bigfile')+'</span>',    
    ]);
    
    var group_list=[
    ['⚪ reg','klmenu_check_b(this.id,true);',false,'span_reg_bigfile'],
    ['⚪ 将bigfile作为第一数据源','first_source_set_bigfile();',false,'span_first_source_bigfile'],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,''));

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'𖧶','18rem','1rem','1rem','30rem')+'<span id="span_menu_htm_bigfile"></span>'+klmenu_b(klmenu_batch,'📦','19rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','19rem','1rem','1rem','30rem'),'','0rem')+' ');
    
    klmenu_check_b('span_reg_bigfile',true);
    klmenu_check_b('span_decode_bigfile',true);
    first_source_set_bigfile(false);
}

function batch_open_bigfile(cstype){
    function sub_batch_open_bigfile_open(){
        if (blxl>=bllen){
            document.title=old_title;
            return;
        }
        
        window.open(name_list[blxl]);
        blxl=blxl+1;
        document.title=blxl+'/'+bllen+' - '+old_title;
        setTimeout(sub_batch_open_bigfile_open,2000);
    }
    
    function sub_batch_open_bigfile_links(){
        for (let blno=0,lent=name_list.length;blno<lent;blno++){
            name_list[blno]=blhref+name_list[blno]+suffix;
        }
        name_list=array_union_b(name_list,other_list);
    }
    
    if (location.href.includes('?render&idb')){
        var blhref=location.origin+'?render&idb&htm=';
        var suffix='';
    } else if (location.href.match(/\/html\/[^\/]+$/)){
        var blhref=location.href.split(/\/html\/[^\/]+$/)[0]+'/html/';
        var suffix='.htm';
    } else {
        alert('未知网址路径');
        return;
    }
    
    var name_list=[];
    var other_list=[];
    switch (cstype){
        case 'dnsrb':
            name_list=['diff_js','notepad','selenium_enwords','readlater'];
            other_list=['https://cn.bing.com/translator/'];
            break;
        case 'dsrb':
            name_list=['diff_js','selenium_enwords','readlater'];
            other_list=['https://cn.bing.com/translator/'];        
            break;
    }
    
    sub_batch_open_bigfile_links();

    var blxl=0;
    var bllen=name_list.length;
    if (!confirm('是否批量打开 '+bllen+' 个链接？')){return;}

    var old_title=document.title;
    sub_batch_open_bigfile_open();
}

function file_date_compare_bigfile(){
    var otextarea=document.getElementById('textarea_file_date_compare_bigfile');
    var blstr=otextarea.value.trim();
    //每一行形如：60. /home/kl/klwebphp/PythonTools/file_rar_sn_terminal.py 2024-03-26 16:55:01 - 保留注释
    var list_t=blstr.split('\n');
    var file_dict={};
    for (let item of list_t){
        if (item.match(/^\d+\.\s*/)){
            item=item.replace(/^\d+\.\s*/,'');
        }
        
        var fname1=item.slice(0,-19).trim();
        if (fname1==''){continue;}
        
        var fdate1=item.slice(-19,).trim();

        var bname=fname1.replace(/^.*[\/\\]/g,'').trim();  //去掉目录 - 保留注释        
        if (bname==''){continue;}

        file_dict['f_'+bname]=[validdate_b(fdate1),fdate1,fname1];
    }

    var name_found=[];
    var full_found=[];
    var not_found=[];
    for (let afile of raw_data_bigfile_global){
        var fname2=afile[1];
        var fdate2=validdate_b(afile[4]);

        if (file_dict['f_'+fname2]==undefined){
            not_found.push(fname2);
        } else {
            if (file_dict['f_'+fname2][0]>fdate2){
                name_found.push('<b>'+fname2+':</b> '+now_time_str_b(':',true,fdate2,'-',' ')+' ➡ '+file_dict['f_'+fname2][1]);
                full_found.push(file_dict['f_'+fname2][2]);
            }
        }
    }
    
    not_found.sort();
    full_found.sort();
    name_found.sort();

    var left_strings1='<p>';
    var textarea_str1=textarea_with_form_generate_b('textarea_not_found_file_list_bigfile','width:90%;height:10rem;',left_strings1,'清空,复制,加密,解密,发送到临时记事本,save as txt file,','</p>');
    
    var left_strings2='<p>';
    var textarea_str2=textarea_with_form_generate_b('textarea_found_file_list_bigfile','width:90%;height:10rem;',left_strings2,'清空,复制,加密,解密,发送到临时记事本,发送地址,save as txt file,','</p>');
        
    document.getElementById('div_file_date_compare_bigfile').innerHTML='<h4>未发现的文件('+not_found.length+')</h4>'+textarea_str1+'<h4>需要更新的文件</h4>'+array_2_li_b(name_found)+textarea_str2;
    
    document.getElementById('textarea_not_found_file_list_bigfile').value=not_found.join('\n');
    document.getElementById('textarea_found_file_list_bigfile').value=full_found.join('\n');
}

function file_date_form_bigfile(){
    var left_strings='<p><span class="aclick" onclick="file_date_compare_bigfile();">文件日期对比</span>';
    var blstr=textarea_with_form_generate_b('textarea_file_date_compare_bigfile','height:25rem;',left_strings,'清空,复制,加密,解密,导入 txt 文件,发送到临时记事本,发送地址','</p>');
    document.getElementById('divhtml').innerHTML=blstr+'<div id="div_file_date_compare_bigfile"></div>';
}

function first_source_set_bigfile(do_change=true){
    if (do_change){
        var current_value=(local_storage_get_b('first_source_bigfile')==='0'?'1':'0');
        localStorage.setItem('first_source_bigfile',current_value);
    } else {
        var current_value=(local_storage_get_b('first_source_bigfile')!=='1'?'0':'1');
    }
    
    if (klmenu_check_b('span_first_source_bigfile',false)!==(current_value=='1')){
        klmenu_check_b('span_first_source_bigfile',true);
    }
}

function upload_a_bigfile(){
    function sub_upload_a_bigfile_split_content(csstr){
        var list_t,error_info;
        [list_t,error_info]=delimiter_find_b(csstr);
        if (error_info!==''){
            alert(error_info);
            return;
        }
        ofiles=[];
        var name_list=[];
        for (let item of list_t){
            item=item.trimLeft().split('\n');
            if (item.length<2){continue;}
            var fname=item[0];
            var fcontent=item.slice(1,).join('\n');
            var one_file={'name':fname,'size':fcontent.length,'content':fcontent};
            ofiles.push(one_file);
            name_list.push(fname);
        }
        
        file_no=0;
        file_count=ofiles.length;
        if (do_type=='仅分割'){
            alert('可分割保存的文件名：\n'+name_list.join('\n'));
            var save_name=prompt('输入文件名保存为单独的文件：');
            if (save_name==null){return;}
            save_name=save_name.trim();
            for (let item of ofiles){
                if (item['name']==save_name){
                    export_bigfile(save_name,item['content']);
                    break;
                }
            }
        } else {
            if (!confirm('是否将上传的文件分割为'+file_count+'部分？')){return;}
            sub_upload_a_bigfile_one_split();
        }
    }
    
    function sub_upload_a_bigfile_check(one_file){
        var error='';
        if (!one_file){
            error='未发现文件';
        }
        if (one_file.size>blmultiple*60*1024*1024){
            error='文件太大：'+one_file.name+' '+one_file.size;  
        }
        if (error!==''){
            alert(error);
        }        
        return error;
    }

    function sub_upload_a_bigfile_name_set(){
        if (file_no>=file_count){return [false,[]];}
        if (sub_upload_a_bigfile_check(ofiles[file_no])!==''){return [false,[]];}
        file_name_bigfile_global=ofiles[file_no].name;

        if (file_name_bigfile_global.match(reg_exp1)){
            file_name_bigfile_global=file_name_bigfile_global.replace(reg_exp1,'$1');
        }

        if (file_name_bigfile_global.match(reg_exp2)){
            file_name_bigfile_global=file_name_bigfile_global.replace(reg_exp2,'$1');
        }
        
        var finfo;
        [finfo,file_name_bigfile_global,is_encoded]=file_is_encoded_b(file_name_bigfile_global,is_do_decode);
        return [true,finfo];
    }

    function sub_upload_a_bigfile_one_split(){
        var is_ok,finfo;
        [is_ok,finfo]=sub_upload_a_bigfile_name_set();
        if (!is_ok){return;}

        file_content_bigfile_global = ofiles[file_no].content;
        if (file_no==file_count-1){
            document.title=old_title;
            idb_bigfile_b('edit','','',read_fn_bigfile);
        } else {
            file_no=file_no+1;
            document.title=file_no+'/'+file_count+' - '+old_title;
            idb_bigfile_b('edit','','',sub_upload_a_bigfile_one_split);
        }
    }
    
    function sub_upload_a_bigfile_one_step(){
        var is_ok,finfo;
        [is_ok,finfo]=sub_upload_a_bigfile_name_set();
        if (!is_ok){return;}
                
        var textFileReader = new FileReader();
        if (text_file_ext_set.has('.'+finfo[2].toLowerCase())){
            textFileReader.readAsText(ofiles[file_no]);    //, 'UTF-8'); // 使用 readAsText 并指定编码为 UTF-8 - 保留注释
        } else {
            textFileReader.readAsDataURL(ofiles[file_no]);
        }
        
        textFileReader.onload = function (){
            var blcontent=this.result;
            if (is_do_decode && is_encoded){
                blcontent=bc_decode_b(blcontent)[0];
            }
            
            if (do_split){
                sub_upload_a_bigfile_split_content(blcontent);
            } else {
                file_content_bigfile_global = blcontent;
                if (file_no==file_count-1){
                    document.title=old_title;
                    idb_bigfile_b('edit','','',read_fn_bigfile);
                } else {
                    file_no=file_no+1;
                    document.title=file_no+'/'+file_count+' - '+old_title;
                    idb_bigfile_b('edit','','',sub_upload_a_bigfile_one_step);
                }
            }
        };
        
        textFileReader.onerror = function(event){
            // 读取文件出错时执行的代码
            alert('读取文件时发生错误: '+[file_no,file_count,file_name_bigfile_global, event.target.error]); //不支持文件名中含有.号 - 保留注释
        };
    }

    var do_type=document.getElementById('select_upload_bigfile').value;
    var do_split=(do_type.includes('分割'));
    var ofiles=document.getElementById('input_upload_bigfile').files;
    var file_count=ofiles.length;
    if (file_count>50){
        alert('文件超过50个');
        return;
    }
    
    if (do_split){
        var blmultiple=10;
        file_count=1;    //只读取第1个文件 - 保留注释
        var blcaption='分割';
    } else {
        var blmultiple=1;
        var blcaption='';
    }

    for (let one_file of ofiles){
        if (sub_upload_a_bigfile_check(one_file)!==''){return;}
    }

    if (!confirm('是否'+blcaption+'上传 '+file_count+' 个文件？')){return;}
    var file_no=0;
    var old_title=document.title;
    
    var reg_exp1=/\s*\(\d+\)(\.[^\.]+)$/;   //同名文件(1) - 保留注释
    var reg_exp2=/\s*\(copy \d+\)(\.[^\.]+)$/;   //同名文件(copy 1) - 保留注释
    var is_encoded=false;
    var is_do_decode=klmenu_check_b('span_decode_bigfile',false);
    var text_file_ext_set=new Set(code_file_ext_b().concat(text_file_ext_b()));
    sub_upload_a_bigfile_one_step();
}

function read_fn_bigfile(raw_data_bigfile){
    raw_data_bigfile_global=raw_data_bigfile;
    sort_bigfile(true);
}

function sort_bigfile(is_desc=false){
    document.getElementById('span_count').innerHTML='('+raw_data_bigfile_global.length+')';
    var result_t=[];
    //raw_data_bigfile_global 每个元素为数组，形如：[ 0, "selenium_enwords_data.js", 'var selenium_enwords_data_original_global=[\n["http://bevcooks.com/2023/02/broccoli-cheddar-chicken-p……en and Chancellor Olaf Scholz of Germany Before Bilateral Meeting","The White House", ["conv"]],\n];\n', "2.46M", "9/23/2024, 3:57:26 PM" ]，//第一个元素为 id，值都是 0，为无效字段， - 保留注释
    
    raw_data_bigfile_global.sort(function(a,b){return zh_sort_b(a,b,false,1);});
    var sort_col=parseInt(document.getElementById('select_sort_type_bigfile').value);
    if ([1,2].includes(sort_col)){
        raw_data_bigfile_global.sort(function(a,b){return zh_sort_b(a,b,is_desc,sort_col);});
    } else if (sort_col==3){
        if (is_desc){
            raw_data_bigfile_global.sort(function (a,b){return parseFloat(a[3])>parseFloat(b[3])?-1:1;});
        } else {
            raw_data_bigfile_global.sort(function (a,b){return parseFloat(a[3])<parseFloat(b[3])?-1:1;});        
        }
    } else if (sort_col==4){
        if (is_desc){
            raw_data_bigfile_global.sort(function (a,b){return new Date(a[4])>new Date(b[4])?-1:1;});
        } else {
            raw_data_bigfile_global.sort(function (a,b){return new Date(a[4])<new Date(b[4])?-1:1;});        
        }    
    }
    
    if (!is_args_checked_bigfile){
        args_bigfile();
    }
    
    search_bigfile();
}

function statistics_ext_bigfile(){
    let ext_dict={};
    for (let item of current_data_bigfile_global){
        let blext=file_path_name_b(item[0][1])[2];
        if (ext_dict['f_'+blext]==undefined){
            ext_dict['f_'+blext]=0;
        }
        ext_dict['f_'+blext]=ext_dict['f_'+blext]+1;
    }
    ext_dict=object2array_b(ext_dict,true,2);
    ext_dict.sort();
    ext_dict.sort(function (a,b){return a[1]>b[1]?-1:1;});
    document.getElementById('divhtml').innerHTML=array_2_li_b(ext_dict);
}

function key_get_bigfile(cskey=false){
    var oinput=document.getElementById('input_search');
    if (cskey===false){
        cskey=oinput.value.trim();
    }
    oinput.value=cskey;

    recent_bigfile(cskey);

    var isreg=klmenu_check_b('span_reg_bigfile',false);
    [cskey,isreg]=str_reg_check_b(cskey,isreg,true);
    
    return [cskey,isreg];
}

function search_bigfile(cskey=false){
    var isreg;
    [cskey,isreg]=key_get_bigfile(cskey);

    current_data_bigfile_global=[];
    is_all_result_bigfile_global=true;

    [current_data_bigfile_global,is_all_result_bigfile_global]=common_search_b(cskey,isreg,raw_data_bigfile_global,-1);

    result_percent_b('span_count',current_data_bigfile_global.length,raw_data_bigfile_global.length,1);
    page_bigfile(1);
}

function is_file_included_bigfile(csdict,included_files){
    let found_js=[];
    let found_css=[];
    let not_found_list=[];
    let not_append_list=[];
    for (let afile of included_files){
        if (csdict['f_'+afile]==undefined){
            not_found_list.push(afile);
            continue;
        }
        if (afile.endsWith('.js')){
            found_js.push('//'+afile+'\n'+csdict['f_'+afile]);
        } else if (afile.endsWith('.css')){
            found_css.push('/* '+afile+' */\n'+csdict['f_'+afile]);
        } else {
            not_append_list.push(afile);
        }
    }

    return [found_js,found_css,not_found_list,not_append_list];
}

function html_get_bigfile(is_render=false,is_two_files=true){
    function sub_html_get_bigfile_wait(cstimes,fn_name){
        if (cstimes>5){
            console.log('等候了',cstimes,'次');
            return;
        }
        
        if (eval('typeof '+fn_name) == 'undefined'){    //先载入基础的 js 函数，再渲染页面 - 保留注释
            setTimeout(function (){sub_html_get_bigfile_wait(cstimes+1,fn_name);},1000);
            return;
        }

        console.log('sub_html_get_bigfile_wait() 等待 '+fn_name+' 次数',cstimes);
        html_head_body_render_b(blsource);
    }

    function sub_html_get_bigfile_format(){
        var reg_exp1,reg_exp2,reg_exp3;
        [reg_exp1,reg_exp2,reg_exp3]=html_reg_exp_bigfile();
    
        for (let blxl=0,lent=blsource.length;blxl<lent;blxl++){
            if (blsource[blxl].match(reg_exp1)){
                blsource[blxl]='';
            } else if (blsource[blxl].match(reg_exp2)){
                blsource[blxl]='';
            } else if (blsource[blxl].match(reg_exp3)){
                blsource[blxl]='';
            }
        }    

        for (let blxl=0,lent=blsource.length;blxl<lent;blxl++){
            if (blsource[blxl].match(/<\/title>\s*$/)){
                title_position=blxl;
                break;
            }
        }
    }
    
    function sub_html_get_bigfile_done(csdict){
        let ostatus=document.getElementById('textarea_html_status_bigfile');
        if (title_position===-1){
            ostatus.value='未发现 title';
            return;
        }
        
        let found_js,found_css,not_found_list,not_append_list;
        [found_js,found_css,not_found_list,not_append_list]=is_file_included_bigfile(csdict,included_files);
        
        ostatus.value='未发现文件：\n'+not_found_list.join('\n')+'\n未添加内容的文件：\n'+not_append_list.join('\n');
        if (is_render && not_found_list.length>0){
            if (!confirm('存在未发现的文件：\n'+not_found_list.join('\n')+'\n是否渲染？')){
                is_render=false;;
            }
        }
        
        if (found_js.length>0){
            if (is_render){
                is_html_rendered=true;
                html_render_js_b(found_js,sub_html_get_bigfile_wait);
            } else {
                let imported_str='imported_files_global=new Set(["'+included_files.join('","')+'"]);\n';
                if (is_two_files){
                    blsource[title_position]=blsource[title_position]+'\n<script src="保存的js文件名"></script>\n';
                    var oresult2=document.getElementById('textarea_html_result2_bigfile');
                    oresult2.value='//js函数插入处\n'+imported_str+found_js.join('\n');
                } else {
                    blsource[title_position]=blsource[title_position]+dom_quote_b(['//js函数插入处',imported_str,found_js.join('\n')]);
                }
            }
        }
        
        if (found_css.length>0){
            if (is_render){
                style_generate_b(found_css,true);   //css 无执行顺序要求，不用等待 - 保留注释
            } else {
                blsource[title_position]=blsource[title_position]+'\n<style>\n'+found_css.join('\n')+'\n</style>\n';
            }
        }
        
        if (!is_render){
            let oresult1=document.getElementById('textarea_html_result1_bigfile');
            oresult1.value=blsource.join('\n');
            oresult1.scrollIntoView();
        } else {
            if (!is_html_rendered){
                html_head_body_render_b(blsource);
            }
        }
    }
    
    if (is_render){
        is_two_files=true;
    }

    var title_position=-1;
    var blsource=document.getElementById('textarea_html_file_content_bigfile').value.split('\n');
    sub_html_get_bigfile_format();

    let included_files=included_files_filter_bigfile(is_render,false);
    
    var is_html_rendered=false;
    idb_bigfile_b('read','filedict',included_files,sub_html_get_bigfile_done);
}

function included_files_filter_bigfile(is_render=false,raw_list=false){
    var imported_files=new Set();
    if (is_render && typeof imported_files_global!=='undefined'){
        for (let item of imported_files_global){
            imported_files.add(file_path_name_b(item)[3]);
        }
    }
    
    console.log('imported files',imported_files);

    if (raw_list===false){
        raw_list=array_unique_b(document.getElementById('textarea_html_file_include_bigfile').value.trim().split('\n'));
    }
    
    var included_files=[];
    for (let afile of raw_list){
        afile=afile.trim();
        if (afile==''){continue;}
        if (is_render){
            if (afile=='klbase.js' || imported_files.has(afile)){continue;}
        }
        
        included_files.push(afile);
    }
    
    console.log('included files',included_files);
    return included_files;
}

function merge_files_bigfile(){
    function sub_merge_files_bigfile_done(csdict){
        var bldelimiter=delimiter_generate_b(10).trim();
        
        var result_t=[];
        var bllen=0;
        var blcount=0;
        for (let key in csdict){
            result_t.push(bldelimiter);
            result_t.push(key.slice(2,));
            result_t.push(csdict[key]);
            bllen=bllen+csdict[key].length;
            blcount=blcount+1;
        }

        var export_data=result_t.join('\n');
        var save_name='file_merge_'+today_str_b('dt','','','_',10);
        [export_data,save_name]=encode_content_bigfile(export_data,save_name);
        
        save_name=save_name+'.txt';
        
        if (!confirm('是否合并当前 '+blcount+'/'+current_data_bigfile_global.length+' 个文件的合计长度为 '+bllen+' 的内容导出为 '+save_name+'？')){return;}

        string_2_txt_file_b(export_data,save_name,'txt');
    }
    
    var fname_list=[];
    for (let item of current_data_bigfile_global){
        fname_list.push(item[0][1]);
    }
    
    idb_bigfile_b('read','filedict',fname_list,sub_merge_files_bigfile_done);
}

function encode_content_bigfile(export_data,save_name){
    if (klmenu_check_b('span_encode_bigfile',false)){
        let raw_data=export_data;
        export_data=bc_encode_b(export_data)[0];
        save_name=save_name+'_$$encoded';
    }
    return [export_data,save_name];
}

function html_reg_exp_bigfile(){
    var reg_exp1=/^\s*<script src=.*?><\/script>\s*$/mg;
    var reg_exp2=/^\s*klbase_addons_import_js_b\(.*?$/mg;
    var reg_exp3=/^\s*flot_import_js_b\(\[.*?\].*?$/mg;

    return [reg_exp1,reg_exp2,reg_exp3];
}

function find_in_textarea_bigfile(csstr,textarea_id){
    textarea_top_bottom_b(textarea_id,csstr,-1);
}

function input_find_generate_bigfile(textarea_id){
    return '<input type="text" title="从编辑框指定位置开始查找字符串" onkeyup="if (event.key==\'Enter\'){find_in_textarea_bigfile(this.value,\''+textarea_id+'\');}" />';
}

function content_from_html_bigfile(csstr,ignore_set,prerequisite_set,flot_set){
    var bllen=csstr.length;
    if (bllen==0){
        alert('未获取文件内容');
        return [ignore_set,prerequisite_set,flot_set,false];
    }

    let reg_exp1,reg_exp2,reg_exp3;
    [reg_exp1,reg_exp2,reg_exp3]=html_reg_exp_bigfile();
    let script_list=csstr.match(reg_exp1) || [];
    [ignore_set,prerequisite_set]=js_files_from_html_bigfile(script_list,/".*?"/g,ignore_set,prerequisite_set); //只支持 双引号 - 保留注释
    
    let import_list=csstr.match(reg_exp2) || [];
    
    for (let item of import_list){
        if (item.match(/\(\[.*?\],\s*\[.*?\],\s*\[.*?\],\s*\[.*?\],\s*true/)){
            prerequisite_set.add('jquery.js');
            break;
        }
    }
    
    for (let item of import_list){
        let list_t=item.match(/\[.*?\]/g) || [];  //不能使用.+? - 保留注释
        [ignore_set,prerequisite_set]=js_files_from_html_bigfile(list_t,/'.*?'/g,ignore_set,prerequisite_set); //只支持 单引号 - 保留注释
    }
    
    let flot_list=csstr.match(reg_exp3) || [];
    for (let item of flot_list){
        item=item.match(/'(.*?)'/g);
        for (let acol of item){
            flot_set.add('jquery.flot.'+acol.slice(1,-1)+'.min.js');
        }
    }
    
    if (flot_set.size>0){
        prerequisite_set.add('jquery.flot.min.js');
        prerequisite_set=array_union_b(prerequisite_set,flot_set,true);
    }
    
    return [ignore_set,prerequisite_set,flot_set,true];
}

function js_files_from_html_bigfile(cslist,quote_exp,ignore_set=new Set(),prerequisite_set=new Set()){
    for (let one_quote of cslist){
        let elements=one_quote.match(quote_exp) || [];
        for (let one_element of elements){
            let bname=file_path_name_b(one_element.slice(1,-1))[3];
            if (bname.endsWith('_data.js') || bname.startsWith('readlater_data_')){
                ignore_set.add(one_element);
                continue;
            }
            if (!bname.includes('.')){
                bname='klbase_'+bname+'.js';
            }
            if (bname.match(/,\s*defer$/)){
                bname=bname.replace(/,\s*defer$/,'');
            }
            prerequisite_set.add(bname);
        }
    }
    return [ignore_set,prerequisite_set];
}

function htm_files_prerequisite_bigfile(){
    function sub_htm_files_prerequisite_bigfile_content(csstr){
        prerequisite_set=content_from_html_bigfile(csstr,new Set(),prerequisite_set,new Set())[1];
        sub_htm_files_prerequisite_bigfile_next();
    }
    
    function sub_htm_files_prerequisite_bigfile_done(csdict){
        let not_found_list=is_file_included_bigfile(csdict,included_files)[2];
        not_found_list.sort();
        
        let left_strings='<p>';
        let blstr=textarea_with_form_generate_b('textarea_html_status_bigfile','width:90%;height:10rem;',left_strings,'清空,复制,发送到临时记事本,发送地址','</p>');
                    
        document.getElementById('divhtml').innerHTML='<h4>未发现的文件('+not_found_list.length+')</h4>'+blstr;
        document.getElementById('textarea_html_status_bigfile').value=not_found_list.join('\n');
        document.title=old_title;
    }
    
    function sub_htm_files_prerequisite_bigfile_next(){
        blxl=blxl+1;

        if (blxl>=bllen){
            included_files=included_files_filter_bigfile(false,prerequisite_set);
            idb_bigfile_b('read','filedict',included_files,sub_htm_files_prerequisite_bigfile_done);

            return;
        }
        
        setTimeout(sub_htm_files_prerequisite_bigfile_one,1);
    }
    
    function sub_htm_files_prerequisite_bigfile_one(){
        let file_name=current_data_bigfile_global[blxl][0][1];
        let file_ext=file_path_name_b(file_name)[2];
        
        document.title=blxl+'/'+bllen+'-'+old_title;
        if (file_ext=='htm' || file_ext=='html'){
            idb_bigfile_b('read','content',file_name,sub_htm_files_prerequisite_bigfile_content);
        } else {
            sub_htm_files_prerequisite_bigfile_next();
        }
    }
    
    let blxl=0;
    let bllen=current_data_bigfile_global.length;
    let old_title=document.title;
    let prerequisite_set=new Set();
    let included_files;
    sub_htm_files_prerequisite_bigfile_one();
}

function html_form_bigfile(ospan,do_render=false){
    function sub_html_get_bigfile_spare(){
        let prerequisite_ignore_set=array_union_b(new Set(),prerequisite_set,true);
        for (let item of ignore_set){
            while (true){
                let blfound=false;
                if (item.startsWith("'") || item.startsWith('"')){
                    item=item.slice(1,);
                    blfound=true;
                }
                if (item.endsWith("'") || item.endsWith('"')){
                    item=item.slice(0,-1);
                    blfound=true;
                }
                if (!blfound){break;}
            }
            
            let blat=item.lastIndexOf('/');
            if (blat>=0){
                item=item.slice(blat+1,);
            }
            item=item.trim();
            if (item==''){continue;}
            prerequisite_ignore_set.add(item);
        }
        
        let spare_list=[];
        for (let item of current_data_bigfile_global){
            let fname=item[0][1];
            if (prerequisite_ignore_set.has(fname)){continue;}
            spare_list.push(fname);
        }
        spare_list.sort(zh_sort_b);
        return spare_list;
    }
    
    function sub_html_form_bigfile_raw(csstr){
        return '<h4>'+file_name+' 文件原始内容 '+input_find_generate_bigfile('textarea_html_file_content_bigfile')+'</h4>'+csstr;
    }
    
    function sub_html_form_bigfile_textarea(only_source=false){
        var left_strings0='<p>';
        if (!only_source){
            left_strings0=left_strings0+'<span class="aclick" onclick="html_get_bigfile(false,true);">.htm+.js</span><span class="aclick" onclick="html_get_bigfile(false,false);">one file</span><span class="aclick" onclick="html_get_bigfile(true);">render</span><a class="aclick" href="?render&idb&htm='+file_name+'" target=_blank>link</a><a class="aclick" href="?render&idb&htm=cmeditor.htm&bigfile='+file_name+'" target=_blank>{}</a>';
        } else {
            left_strings0=left_strings0+'<a class="aclick" href="?render&idb&htm=cmeditor.htm&bigfile='+file_name+'" target=_blank>{}</a>';
        }
        
        var blstr0=textarea_with_form_generate_b('textarea_html_file_content_bigfile','width:90%;height:'+(only_source?25:10)+'rem;',left_strings0,'清空,复制,↑,↓,发送到临时记事本,发送地址','</p>');
        
        if (!only_source){
            var left_strings1='<p>';
            var blstr1=textarea_with_form_generate_b('textarea_html_file_include_bigfile','width:100%;height:10rem;',left_strings1,'清空,复制,发送到临时记事本','</p>');

            var left_strings2='<p>';
            var blstr2=textarea_with_form_generate_b('textarea_html_file_ignore_bigfile','width:100%;height:10rem;',left_strings2,'清空,复制,发送到临时记事本','</p>');

            var left_strings_spare='<p>';
            var blstr_spare=textarea_with_form_generate_b('textarea_html_file_spare_bigfile','width:100%;height:10rem;',left_strings_spare,'清空,复制,发送到临时记事本','</p>');

            var left_strings3='<p>';
            var blstr3=textarea_with_form_generate_b('textarea_html_status_bigfile','width:90%;height:10rem;',left_strings3,'清空,复制,发送到临时记事本','</p>');

            var left_strings4='<p>';
            var blstr4=textarea_with_form_generate_b('textarea_html_result1_bigfile','width:100%;height:10rem;',left_strings4,'清空,复制,↑,↓,save as htm file,发送到临时记事本','</p>');

            var left_strings5='<p>';
            var blstr5=textarea_with_form_generate_b('textarea_html_result2_bigfile','width:100%;height:10rem;',left_strings5,'清空,复制,↑,↓,save as js file,发送到临时记事本','</p>');
            
            var bljg=sub_html_form_bigfile_raw(blstr0);
            var spare_list=sub_html_get_bigfile_spare();

            bljg=bljg+table_split_doms_one_row_b(['<h4>包含文件列表('+prerequisite_set.size+')</h4>'+blstr1,'<h4>忽略文件列表('+ignore_set.size+')</h4>'+blstr2,'<h4>多余文件列表('+spare_list.length+')</h4>'+blstr_spare],'90%');
            bljg=bljg+'<h4>状态</h4>'+blstr3+table_split_doms_one_row_b(['<h4>结果 HTML '+input_find_generate_bigfile('textarea_html_result1_bigfile')+'</h4>'+blstr4,'<h4>结果 JS '+input_find_generate_bigfile('textarea_html_result2_bigfile')+'</h4>'+blstr5],'90%');
            document.getElementById('divhtml').innerHTML=bljg;

            document.getElementById('textarea_html_file_include_bigfile').value=Array.from(prerequisite_set).join('\n');
            document.getElementById('textarea_html_file_ignore_bigfile').value=Array.from(ignore_set).join('\n');
            document.getElementById('textarea_html_file_spare_bigfile').value=spare_list.join('\n');
        } else {
            document.getElementById('divhtml').innerHTML=sub_html_form_bigfile_raw(blstr0);
        }
        document.getElementById('textarea_html_file_content_bigfile').value=html_file_content;
        
        if (do_render){
            html_get_bigfile(true);
        }        
    }
    
    function sub_html_form_bigfile_content(csstr){
        [ignore_set,prerequisite_set,flot_set,is_ok]=content_from_html_bigfile(csstr,ignore_set,prerequisite_set,flot_set);
        
        if (is_ok){
            html_file_content=csstr;
            sub_html_form_bigfile_textarea();
        }
    }
    
    function sub_html_form_bigfile_source(csstr){
        var bllen=csstr.length;
        if (bllen==0){
            alert('未获取文件内容');
            return;
        }
        html_file_content=csstr;
        sub_html_form_bigfile_textarea(true);        
    }
    
    var html_file_content='';
    var prerequisite_set=new Set();
    var flot_set=new Set();
    var ignore_set=new Set();
    
    if (typeof ospan=='string'){
        var file_name=ospan;
    } else {
        var file_name=ospan.parentNode.querySelector('span.span_name_bigfile').innerText;
    }

    var file_ext=file_path_name_b(file_name)[2];
    if (file_ext=='htm' || file_ext=='html'){
        idb_bigfile_b('read','content',file_name,sub_html_form_bigfile_content);
    } else {
        idb_bigfile_b('read','content',file_name,sub_html_form_bigfile_source);
    }
}

function page_bigfile(csno){
    function sub_page_bigfile_one(csxl){
        let item=current_data_bigfile_global[csxl][0];
        let htm_icon='';
        
        if (parseFloat(current_data_bigfile_global[csxl][0][3])<=1){   //1MB大小以内 - 保留注释
            if (item[1].endsWith('.htm') || item[1].endsWith('.html')){
                htm_icon='<span class="oblong_box" onclick="html_form_bigfile(this);" title="转换htm文件并载入或下载">🌐</span> ';
            } else {
                htm_icon='<span class="oblong_box" onclick="html_form_bigfile(this);" title="查看内容">{}</span> ';
            }
        }
        
        return '<li><span class="span_name_bigfile" style="font-weight:bold;">'+specialstr92_b(item[1])+'</span>: '+specialstr92_b(item[2])+' <span style="font-size:0.8rem;color:'+scheme_global['memo']+';">('+item[3]+' '+(item[4].startsWith(today)?'<span style="color:'+scheme_global['a-hover']+';">'+item[4]+'</span>':item[4])+')</span><span class="oblong_box" onclick="delete_bigfile(this);" title="删除记录">🗑</span> <span class="oblong_box" onclick="copy_bigfile(this);" title="复制文件名">📎</span>  <span class="oblong_box" onclick="export_bigfile(this);" title="另存为文件">📤</span> '+htm_icon+'<span style="font-size:0.8rem;color:'+scheme_global['memo']+';">('+current_data_bigfile_global[csxl][1]+')</span></li>';
    }
    
    var today=new Date().toLocaleString().split(',')[0];
    var cslen=current_data_bigfile_global.length;
    var bljg=page_combination_b(cslen,rows_per_page_bigfile_global,csno,'page_bigfile','locate_bigfile',false,1,10);  
    //-----------------------
    var result_t=[];
    var blend=Math.min(csno-1+rows_per_page_bigfile_global,cslen);

    for (let blxl=csno-1;blxl<blend;blxl++){
        result_t.push(sub_page_bigfile_one(blxl));
    }

    var odiv=document.getElementById('divhtml');

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
        odiv.innerHTML=bljg+'<ol>'+result_t.join('\n')+'</ol>\n'+bljg;
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
    }
}

function locate_bigfile(pages){
    var blno=page_location_b(pages);
    if (blno!==false){
        page_bigfile((blno-1)*rows_per_page_bigfile_global+1,rows_per_page_bigfile_global);
    }        
}

function copy_bigfile(ospan){
    var fname=ospan.parentNode.querySelector('span.span_name_bigfile').innerText;
    copy_2_clipboard_b(fname);
    alert('已复制文件名：'+fname);
}

function delete_bigfile(ospan){
    file_name_bigfile_global=ospan.parentNode.querySelector('span.span_name_bigfile').innerText;
    
    var delete_option=document.getElementById('select_delete_option_bigfile').value;
    switch (delete_option){
        case '数字确认':
            var rndstr=randstr_b(4,true,false);
            if ((prompt('输入 '+rndstr+' 确认删除记录：'+file_name_bigfile_global) || '').trim()!==rndstr){return;}
            break;
        case '简单确认':
            if (!confirm('是否删除记录：'+file_name_bigfile_global+'?')){return;}            
            break;
    }
 
    idb_bigfile_b('edit','delete','',read_fn_bigfile);
}

function export_bigfile(ospan,cscontent=false){
    function sub_export_bigfile_save(csstr){
        var bllen=csstr.length;
        if (bllen==0){
            alert('未获取文件内容');
            return;
        }
        
        var rndstr=randstr_b(4,true,false);
        if ((prompt('输入 '+rndstr+' 确认导出长度为 '+bllen+' 的该记录') || '').trim()!==rndstr){return;}
        
        [csstr,fname]=encode_content_bigfile(csstr,fname);
        
        var base64_list=csstr.match(/^data:(.*?\/.*?);base64,/);    //形如：[ "data:audio/x-wav;base64,", "audio/x-wav" ] - 保留注释
        if (base64_list!==null){
            string_base64_2_file_b(csstr, base64_list[1], fname+'.'+blext);
        } else {
            string_2_txt_file_b(csstr,fname+'.'+blext,blext);
        }
    }
    
    if (typeof ospan=='string'){
        var fname=ospan;
    } else {
        var fname=ospan.parentNode.querySelector('span.span_name_bigfile').innerText;
    }
    
    var finfo=file_path_name_b(fname);
    fname=finfo[1];
    var blext=finfo[2];
    if (cscontent===false){
        idb_bigfile_b('read','content',fname+'.'+blext,sub_export_bigfile_save);
    } else {
        sub_export_bigfile_save(cscontent);
    }
}

function websites_bigfile(return_max=-1){
    function sub_websites_bigfile_done(cslist){
        document.getElementById('divhtml').innerHTML='<p style="line-height:'+(ismobile_b()?'1.8':'2.2')+'rem;">'+cslist.join(' ')+'</p>';
    }

    var cskey,is_reg;
    [cskey,is_reg]=key_get_bigfile();
    search_load_websites_b(cskey,is_reg,-1,sub_websites_bigfile_done);
}

function show_hide_storage_bigfile(){
    var odiv=document.getElementById('div_temp_txt_share');
    var bltype=popup_show_hide_b(odiv);
    if (bltype!=='none'){
        odiv.scrollIntoView();
    }
}
