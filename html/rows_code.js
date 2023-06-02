function input_style_klr2(){
    var input_list=[
    ['taddstr1',10],
    ['taddstr2',10],
    ['tno1',3],
    ['tno2',3],
    ['tcopy',4],
    ['oget3',11],
    ['rep1',10],
    ['rep2',10],
    ['char_t',4],
    ['input_line_interval',5],
    ['input_new_line',10],
    ['input_rnd_lines',5],
    ['input_rnd_count_min',5],
    ['input_rnd_count_max',5],

    ];
    input_size_b(input_list,'id');
}

function en_double_2_array_klr2(do_export=false){
    var blcontent=document.getElementById('textarea_rows_content').value.trim();
    var result_t=en_double_2_array_klr_b(blcontent,do_export);
    document.getElementById('textarea_status').value=result_t; 
}

function do_type_klr2(cstype){
    switch (cstype){
        case '插入':
            var lstr=document.getElementById('taddstr1').value;
            var rstr=document.getElementById('taddstr2').value;
            add_line_str_klr_b(lstr,rstr);
            break;
        case '行号':
        case 'ed2k':
        case 'magnet':
        case 'ffmpeg_combine':
            var blop=document.getElementById('fwhere').value;
            var blno1=document.getElementById('tno1').value;
            var blno2=document.getElementById('tno2').value;   
            if (cstype=='行号'){
                add_line_no_klr_b(blop,blno1,blno2);
            }
            else {
                strquick_klr_b(cstype,'textarea_rows_content','textarea_status',blno1,blno2);
            }
            break;
        case '筛选':
            var cstype=document.getElementById('oget1').value;
            var csin=document.getElementById('oget2').value;
            var cskey=document.getElementById('oget3').value;     
            get_selected_lines_klr_b(cstype,csin,cskey);
            break;
        case '移除':
            var cstype=document.getElementById('char_o').value;
            var cscount=parseInt(document.getElementById('char_t').value);
            lines_del_chars_klr_b(cstype,cscount);
            break;
        case '替换':
            var csrep1=document.getElementById('rep1').value;
            var csrep2=document.getElementById('rep2').value;        
            replace_strs_klr_b(csrep1,csrep2);
            break;
        case '分组':
	        var blinterval=Math.max(parseInt(document.getElementById('input_line_interval').value.trim()),1);
	        var blinsert_str=document.getElementById('input_new_line').value;        
            insert_new_lines_klr_b(blinterval,blinsert_str);
            break;
        case '随机字符':            
        case '随机中文':
        case '随机英文':
        var cslines=document.getElementById('input_rnd_lines').value;
        var csmin=document.getElementById('input_rnd_count_min').value;
        var csmax=document.getElementById('input_rnd_count_max').value;        
            var list_t={'随机字符':'','随机中文':'cn','随机英文':'en'};
            rnd_str_klr_b(list_t[cstype],cslines,csmin,csmax);
            break;
        case '重复':
	        var bltimes=document.getElementById('tcopy').value;        
            copy_lines_klr_b(bltimes);
            break;
    }
}

function str_en_de_kl2(cstype='double',en=true){
    var blstr=document.getElementById('textarea_rows_content').value;
    switch (cstype){
        case 'double':
            if (en){
                document.getElementById('textarea_status').value=en_double_str_b(blstr);    
            }
            else {
                document.getElementById('textarea_status').value=de_double_str_b(blstr);    
            }
            break;
        case 'url':
            if (en){
                document.getElementById('textarea_status').value=encodeURIComponent(blstr);    
            }
            else {
                document.getElementById('textarea_status').value=decodeURIComponent(blstr);    
            }        
            break;
    }
}

function menu_klr2(){
    var str_t=klmenu_hide_b();
    var klmenu_fn=[];
    var group_list=[
    ['左侧','lines_trim_klr_b(\'l\');',true],
    ['右侧','lines_trim_klr_b(\'r\');',true],
    ['两侧','lines_trim_klr_b();',true],
    ];    
    klmenu_fn.push(menu_container_b(str_t,group_list,'删除每行空格: '));

    var group_list=[
    ['en','str_en_de_kl2(\'url\',true);',true],
    ['de','str_en_de_kl2(\'url\',false);',true],
    ];    
    klmenu_fn.push(menu_container_b(str_t,group_list,'codeURIComponent: '));
    
    var group_list=[
    ['en','str_en_de_kl2(\'double\',true);',true],
    ['de','str_en_de_kl2(\'double\',false);',true],
    ];    
    klmenu_fn.push(menu_container_b(str_t,group_list,'double: '));
    
    klmenu_fn=klmenu_fn.concat([
    '<span class="span_menu" onclick="'+str_t+'en_double_2_array_klr2();">en_double 2 array</span>',
    '<span class="span_menu" onclick="'+str_t+'en_double_2_array_klr2(true);">en_double 2 array html file</span>',
    '<span class="span_menu" onclick="'+str_t+'add_to_html_klr_b(\'textarea_rows_content\',\'body\');">显示为HTML(body)</span>',    
    '<span class="span_menu" onclick="'+str_t+'html_to_image_klr_b();">保存为图片</span>',
    '<span class="span_menu" onclick="'+str_t+'setInterval(random_strs_klr2,5000);">每5秒生成随机字符串到剪贴板</span>',
    '<span class="span_menu" onclick="scheme_div_b();">页面主题</span>',
    '<span class="span_menu" onclick="'+str_t+'if (confirm(\'是否更新版本？\')){service_worker_delete_b(\'rows\');}">更新版本</span>',
    ]);

    var klmenu_sort=[];
    
    var group_list=[
    ['升序','sort_rows_klr_b(\'textarea_rows_content\',\'\');',true],
    ['倒序','sort_rows_klr_b(\'textarea_rows_content\',\'desc\');',true],
    ];    
    klmenu_sort.push(menu_container_b(str_t,group_list,''));

    var group_list=[
    ['升序','sort_rows_klr_b(\'textarea_rows_content\',\'asc_num\');',true],
    ['倒序','sort_rows_klr_b(\'textarea_rows_content\',\'desc_num\');',true],
    ];    
    klmenu_sort.push(menu_container_b(str_t,group_list,'数字：'));
    
    klmenu_sort=klmenu_sort.concat([
    '<span class="span_menu" onclick="'+str_t+'reverse_klr_b();">倒转</span>',
    '<span class="span_menu" onclick="'+str_t+'chinese_sort_klr_b();">汉字升序</span>',
    '<span class="span_menu" onclick="'+str_t+'lines_unique_klr_b();">unique</span>',
    '<span class="span_menu" onclick="'+str_t+'sort_rows_klr_b(\'textarea_rows_content\',\'length\');">长度排序</span>',    
    '<span class="span_menu" onclick="'+str_t+'sort_rows_klr_b(\'textarea_rows_content\',\'random\');">随机排序</span>',
    ]);    
   
    var group_list=[
    ['js2href','JavaScript 数组 =&gt; 网址链接'],
    ['js2wikihref','JavaScript 数组 =&gt; wiki链接'],
    ['wikihref2js','wiki链接 =&gt; JavaScript 数组'],
    ['href_title2js','网址 名称 =&gt; JavaScript 数组'],
    ['title_href2js','名称 网址 =&gt; JavaScript 数组'],
    ['title_href2csv','名称 网址 =&gt; csv网址格式'],
    ];
    
    var klmenu_convert=[];
    for (let arow of group_list){
        klmenu_convert.push('<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\''+arow[0]+'\');">'+arow[1]+'</span>');
    }
   
    var klmenu_batch=[
    '<span class="span_menu" onclick="'+str_t+'enwords_get_klr2();">提取英文单词</span>',        
    '<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\'batchwww\');">批量打开网址</span>',
    '<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\'bing_oxford_klsearch_en\');">批量打开Bing+Oxford+KLSearch(en)</span>',    
    '<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\'bing_collins_oxford_klsearch_en\');">批量打开Bing+Collins+Oxford+KLSearch(en)</span>',    
    '<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\'oxford_klsearch_en\');">批量打开Oxford+KLSearch(en)</span>',
    '<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\'collins\');">批量打开Collins</span>',
    ];
    if (is_local_b()){
        klmenu_batch.push('<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\'klwikititle\');">批量打开KLWiki Title</span>');
    }
    
    var klmenu_links=[
    '<a href="../module/CSV_to_Wiki_Table.htm" onclick="'+str_t+'" target=_blank>CSV to Wiki Table</a>',
    '<a href="?klqr">KLQR(userscript)</a>',
    '<a href="image2base64.htm" onclick="'+str_t+'" target=_blank>Image 2 base64</a>',
    ];    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_fn,'','17rem','1rem','1rem','60rem')+klmenu_b(klmenu_sort,'↕','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_convert,'↔','18rem','1rem','1rem','60rem')+klmenu_b(klmenu_batch,'🗂','26rem','1rem','1rem','60rem')+klmenu_b(klmenu_links,'链','12rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function enwords_get_klr2(){
    var otextarea=document.getElementById('textarea_rows_content');
    var list_t=otextarea.value.trim().replace(new RegExp('_','g'),' ').split('\n');
    var result_t=[];
    for (let arow of list_t){
        for (let item of ['】',' - ','是什么意思','Definition & Meaning','definition and meaning']){
            arow=arow.split(item)[0];
        }
        row_list=arow.match(/[a-z\-\_\s]+/ig) || [];
        result_t=array_union_b(result_t,row_list);
    }
    
    document.getElementById('textarea_status').value=result_t.join('\n');
}

function random_strs_klr2(){
    var cslines=document.getElementById('input_rnd_lines').value;
    var csmin=document.getElementById('input_rnd_count_min').value;
    var csmax=document.getElementById('input_rnd_count_max').value;
    rnd_str_klr_b('',cslines,csmin,csmax);
    
    var otextarea=document.getElementById('textarea_rows_content');
    otextarea.select();
    document.execCommand('copy');
}

function form_set_klr2(){
    var postpath=postpath_b();

    var oform=document.querySelector('form[name="form_content_klr"]');
    if (oform){
	    oform.setAttribute('action',postpath+'temp_txt_share.php');
    }
    var op=document.getElementById('p_buttons_1');
    if (op){
        var bljg=textarea_buttons_b('textarea_rows_content','全选,清空,复制,发送到临时记事本,发送地址');    
        op.insertAdjacentHTML('beforeend',bljg);
    }
    //---------------
    var oform=document.querySelector('form[name="form_status_klr"]');
    if (oform){
	    oform.setAttribute('action',postpath+'temp_txt_share.php');
    }
    var op=document.getElementById('p_buttons_2');
    if (op){
        var bljg=textarea_buttons_b('textarea_status','全选,清空,复制,发送到临时记事本');
        bljg=bljg+'<span class="aclick" onclick="textarea_shift_b(\'textarea_rows_content\',\'textarea_status\');">对调</span>';        
        bljg=bljg+'<span class="aclick" onclick="temp_save_klr2(\'write\',\'textarea_status\');">暂存</span>';
        op.insertAdjacentHTML('beforeend',bljg);
    }  
}

function option_generate_klr2(){
    var list_t=[
    ['blank_rows_remove','remove blank rows'],
    ['ltrim_rows','移除段前空格'],
    ['lines2comma','换行符转换为英文逗号'],    
    ['unique_characters','字符无重复'],
    ['js_multilines','js多行内容`{}替换'],
    ['chinese_punctuation','中文标点'],
    ['replace_cn_quote','替换中文引号为英文引号'],
    ['htm2wiki','网页源代码转换为wiki格式'],
    ['n_br','段落替换为&lt;br /&gt;'],
    ['blank8','段首8字节空格'],
    ['rhash_ed2k','rhash_ed2k'],
    ['ahref','a href'],
    ['ahref_encode','a href encode'],
    ['movefiles','Move Files'],
    ['jieba','分词'],
    ['links_html','链接和文本'],
    ['reverse','段落倒转'],
    ['reverse_str','每段文字倒转'],
    ['double2single','全角转半角'],
    ['double2single_w','全角数字和字母转半角'],
    ['single2double','半角转全角'],
    ['space2underline','空格转换为下划线'],
    ['eword','eword提取'],
    ['hash_filename2wiki_table','hash file 转换为 wiki 表格'],
    ['filename_hash2wiki_table','file hash 转换为 wiki 表格'],    
    ['get_head_lines','get_head_lines'],
    ['clear_copy_tab_title_url','clear copy tab title url'],
    ['capitalize_first_letter','每个单词首字母大写'],
    ['common_string_from_filenames','提取文件名中的相同字符串'],
    ['common_string_from_lines','提取每一行中的相同字符串'],
    ['number_sub','数字替换为下标'],
    ];    
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]='<OPTION value="'+list_t[blxl][0]+'">'+list_t[blxl][1]+'</OPTION>';
    }
    document.getElementById('oquick').innerHTML=list_t.join('\n');
}

function init_klr2(){
    function sub_init_klr2_set_input_value(csid,csmin,csmax){
        var oinput=document.getElementById(csid);
        var blvalue;
        if (oinput.value==1){
            blvalue=randint_b(csmin,csmax);
            oinput.value=blvalue;
        }
        else {
            blvalue=oinput.value;
        }
        return blvalue;
    }
    //------------------------------------
    leaflet_klr2();
    option_generate_klr2();
    form_set_klr2();
    input_style_klr2();
    menu_klr2();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    document.getElementById('p_version').insertAdjacentHTML('beforeend',navigator.userAgent);
    
    var oinput=document.getElementById('input_rnd_lines');
    if (oinput.value==1){
        oinput.value=randint_b(1,50);
    }

    sub_init_klr2_set_input_value('input_rnd_lines',1,50);
    var blvalue=sub_init_klr2_set_input_value('input_rnd_count_min',1,50);
    sub_init_klr2_set_input_value('input_rnd_count_max',blvalue,blvalue+50);
    
    leaflet_en_buttons_klr2();
    temp_save_klr2('read');
}

function leaflet_en_buttons_klr2(){
    var list_t=letters52_style_list_b();
    var result_t=['<option value=-1>abcde</option>'];
    for (let blxl=0;blxl<list_t.length;blxl++){
        result_t.push('<option value='+blxl+'>'+list_t[blxl].slice(0,5).join('')+'</option>');
    }
    var buttons='<select id="select_transform_klr">'+result_t.join('\n')+'</select>\n';
    buttons=buttons+'<span class="aclick" onclick="en_transform_klr2(document.getElementById(\'select_transform_klr\').value);">执行</span> ';        

    buttons=buttons+'Braille: ';
    buttons=buttons+'<span class="aclick" onclick="brialle_transform_klr2();">encode</span> ';
    buttons=buttons+'<span class="aclick" onclick="brialle_transform_klr2(false);">decode</span> ';

    buttons=buttons+'Morse: ';
    buttons=buttons+'<span class="aclick" onclick="morse_transform_klr2();">encode</span> ';
    buttons=buttons+'<span class="aclick" onclick="morse_transform_klr2(false);">decode</span> ';
    
    buttons=buttons+'<select id="select_invisible_klr">\n';
    for (let item of ['add','cn','cn_phrase','remove','test']){
        buttons=buttons+'<option>'+item+'</option>';
    }
    buttons=buttons+'</select>\n';
    buttons=buttons+'<label><input type="checkbox" id="input_invisible_restrict" />restrict</label>\n';
    buttons=buttons+'<span class="aclick" onclick="invisible_klr2(document.getElementById(\'select_invisible_klr\').value)">执行</span> ';    
    buttons=buttons+'<span class="aclick" onclick="encrypt_content_quick_transform_klr2();">quick</span> ';    
    document.getElementById('div_leaflet_en').insertAdjacentHTML('afterbegin',buttons);
}

function encrypt_content_quick_transform_klr2(){
    var blold=document.getElementById('textarea_rows_content').value;
    var result_t=encrypt_content_quick_transform_klr_b(blold,true);
    if (result_t!==false){
        document.getElementById('textarea_status').value=result_t;
    }
}

function temp_save_klr2(cstype='',textarea_id=''){
    temp_save_table_b(cstype,'klr2_save',textarea_id,'div_temp_save',20,'textarea_rows_content');
}

function brialle_transform_klr2(csencode){
    document.getElementById('textarea_status').value=braille_transform_b(document.getElementById('textarea_rows_content').value,csencode);
}

function morse_transform_klr2(csencode){
    document.getElementById('textarea_status').value=morse_transform_b(document.getElementById('textarea_rows_content').value,csencode);
}

function invisible_klr2(cstype=''){
    var old_str=document.getElementById('textarea_rows_content').value;
    var is_restrict=document.getElementById('input_invisible_restrict').checked;
    
    var result_t=invisible_klr_b(old_str,is_restrict,cstype).slice(0,2);
    
    document.getElementById('textarea_status').value=result_t.join('\n');
}

function en_transform_klr2(csno){
    var blold=document.getElementById('textarea_rows_content').value;
    var result_t=en_transform_klr_b(blold,csno).slice(0,2);
    
    document.getElementById('textarea_status').value=result_t.join('\n');
}

function leaflet_klr2(csid=''){
    var oleaflets=document.querySelectorAll('div.div_leaflet');
    for (let item of oleaflets){
        item.style.display='none';
    }
    
    var ospans=document.querySelectorAll('span.span_leaflet');
    for (let item of ospans){
        item.style.fontWeight='';
        item.style.color='';
    }
    
    if (csid==''){
        csid=local_storage_get_b('recent_rows_span_id');
    }
    
    if (csid!==''){
        var odiv=document.getElementById('div_leaflet_'+csid);
        if (odiv){
            odiv.style.display='';
        }
        var ospan=document.getElementById('span_leaflet_'+csid);    
        if (ospan){
            ospan.style.fontWeight='bold';
            ospan.style.color=scheme_global['a-hover'];
        }
        localStorage.setItem('recent_rows_span_id',csid);
    }
}
