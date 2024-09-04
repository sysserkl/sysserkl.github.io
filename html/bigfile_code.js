function init_bigfile(){
    file_name_bigfile_global='';
    file_content_bigfile_global='';

    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),true,false,2);
    input_with_x_b('input_search',11);
    character_2_icon_b('B');    
    var_generate_temp_txt_share_b();
    menu_bigfile();
    refresh_bigfile();
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
    '<span class="span_menu" onclick="'+str_t+'clear_data_bigfile();">清空数据库</span>',
    ];
        
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'bigfile\');">更新版本</span>',
    '<span id="span_first_source_bigfile" class="span_menu" onclick="'+str_t+'first_source_set_bigfile();">⚪ 将bigfile作为第一数据源</span>',    
    '<span class="span_menu" onclick="'+str_t+'local_storage_form_bigfile();">缓存导入</span>',    
    ]);

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'𖧶','10rem','1rem','1rem','30rem')+klmenu_b(klmenu_config,'⚙','16rem','1rem','1rem','30rem'),'','0rem')+' ');
    first_source_set_bigfile(false);
}

function local_storage_form_bigfile(){
    var otextarea=document.getElementById('textarea_temp_bigfile');
    if (otextarea){
        idb_bigfile_b('read','','',read_fn_bigfile);
        return;
    }

    var left_strings='<p><span class="aclick" onclick="local_storage_import_b(\'textarea_temp_bigfile\',true);">import data to localStorage</span>';
    left_strings=left_strings+'<span class="aclick" onclick="update_temp_txt_share_b(\'enwords_temp\',\'textarea_temp_bigfile\');">更新最近记忆单词</span>';

    var blstr=textarea_with_form_generate_b('textarea_temp_bigfile','height:25rem;',left_strings,'清空,复制,save as txt file,导入temp_txt_share,发送到临时记事本,发送地址,➕','</p>');

    document.getElementById('divhtml').innerHTML=blstr;
}

function first_source_set_bigfile(do_change=true){
    if (do_change){
        var current_value=(local_storage_get_b('first_source_bigfile')=='0'?'1':'0');
        localStorage.setItem('first_source_bigfile',current_value);
    } else {
        var current_value=(local_storage_get_b('first_source_bigfile')!=='1'?'0':'1');
    }
    klmenu_check_b('span_first_source_bigfile',current_value=='1');
}

function upload_a_bigfile(){
    function sub_upload_a_bigfile_check(one_file){
        var error='';
        if (!one_file){
            error='未发现文件';
        }
        if (one_file.size>20*1024*1024){
            error='文件太大：'+one_file.name+' '+one_file.size;  
        }
        if (error!==''){
            alert(error);
        }        
        return error;    
    }
    
    function sub_upload_a_bigfile_one_step(){
        if (blxl>=bllen){return;}
        if (sub_upload_a_bigfile_check(ofiles[blxl])!==''){return;}
                
        file_name_bigfile_global=ofiles[blxl].name;
        var textFileReader = new FileReader();
        //textFileReader.readAsDataURL(ofiles[blxl]); //此行保留 - 保留注释
        textFileReader.readAsText(ofiles[blxl]);    //此行保留 , 'UTF-8'); // 使用 readAsText 并指定编码为 UTF-8 - 保留注释
        textFileReader.onload = function (){
            file_content_bigfile_global = this.result;
            if (blxl==bllen-1){
                document.title=old_title;            
                idb_bigfile_b('edit','','',read_fn_bigfile);
            } else {
                blxl=blxl+1;
                document.title=blxl+'/'+bllen+' - '+old_title;
                idb_bigfile_b('edit','','',sub_upload_a_bigfile_one_step);
            }
        }    
    }
    
    var ofiles=document.getElementById('input_upload_bigfile').files;
    var bllen=ofiles.length;
    if (bllen>10){
        alert('文件超过10个');
        return;
    }

    for (let one_file of ofiles){
        if (sub_upload_a_bigfile_check(one_file)!==''){return;}
    }

    if (!confirm('是否上传 '+bllen+' 个文件？')){return;}
    var blxl=0;
    var old_title=document.title;
    sub_upload_a_bigfile_one_step();
}

function read_fn_bigfile(raw_data_bigfile){
    document.getElementById('span_count').innerHTML='('+raw_data_bigfile.length+')';      
    var result_t=[];  
    raw_data_bigfile.sort(function(a,b){return zh_sort_b(a,b,false,1);});
    var today=new Date().toLocaleString().split(',')[0];
    for (let item of raw_data_bigfile){
        result_t.push('<li><span class="span_name_bigfile" style="font-weight:bold;">'+specialstr92_b(item[1])+'</span>: '+specialstr92_b(item[2])+' <span style="font-size:0.8rem;color:'+scheme_global['memo']+';">('+item[3]+' '+(item[4].startsWith(today)?'<span style="color:'+scheme_global['a-hover']+';">'+item[4]+'</span>':item[4])+')</span><span class="oblong_box" onclick="delete_bigfile(this);">✗</span> <span class="oblong_box" onclick="copy_bigfile(this);">C</span></li>');
    }
    
    var odiv=document.getElementById('divhtml');

    if (result_t.length==0){
        odiv.innerHTML='';
    } else {
        odiv.innerHTML='<ol>'+result_t.join('\n')+'</ol>';
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));        
    }
}

function copy_bigfile(ospan){
    var fname=ospan.parentNode.querySelector('span.span_name_bigfile').innerText;
    copy_2_clipboard_b(fname);
    alert('已复制文件名：'+fname);
}

function delete_bigfile(ospan){
    file_name_bigfile_global=ospan.parentNode.querySelector('span.span_name_bigfile').innerText;

    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认删除该记录') || '').trim()!==rndstr){return;}    
    
    idb_bigfile_b('edit','delete','',read_fn_bigfile);
}
