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
    ['input_date_start_klr2',8],
    ['input_date_step_klr2',3],
    ['input_date_format_klr2',8],
    ['input_font_family_jieba_klr2',8],
    ['input_bgcolor_jieba_klr2',5],
    ['input_ratio_jieba_klr2',3],
    ['input_width_jieba_klr2',4],
    ['input_height_jieba_klr2',4],

    ];
    var dom_list=input_size_b(input_list,'id',false,true);
    for (let one_dom of dom_list){
        if (!one_dom.hasAttribute('onkeydown')){
            one_dom.setAttribute('onkeydown',"if (event.key=='Enter'){return false;}");   
        }
    }
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
            add_line_str_klr_b(lstr,rstr,'textarea_rows_content',document.getElementById('checkbox_trim_insert_klr2').checked);
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
            } else {
                strquick_klr_b(cstype,'textarea_rows_content','textarea_status',blno1,blno2);
            }
            break;
        case 'date':
            var blop=document.getElementById('fwhere').value;        
            var bldate=validdate_b(document.getElementById('input_date_start_klr2').value.trim());
            if (bldate===false){
                alert('日期格式错误');
                return;
            }
            var blstep=parseInt(document.getElementById('input_date_step_klr2').value.trim());
            var step_type=document.getElementById('select_date_step_ymd_klr2').value;
            if (isNaN(blstep)){
                alert('日期step错误');
                return;
            }
            var blformat=document.getElementById('input_date_format_klr2').value.trim();
            var otextarea=document.getElementById('textarea_rows_content');
            document.getElementById('textarea_status').value=otextarea.value;
            var content_list=otextarea.value.split('\n');
            var date_list=next_days_b(bldate,content_list.length,false,'',blstep,step_type);
        
            if (blop=='1'){
                for (let blxl=0,lent=content_list.length;blxl<lent;blxl++){
                    content_list[blxl]=date_2_str_format_b(date_list[blxl],blformat,'date')+content_list[blxl];
                }
            } else {  //'2'
                for (let blxl=0,lent=content_list.length;blxl<lent;blxl++){
                    content_list[blxl]=content_list[blxl]+date_2_str_format_b(date_list[blxl],blformat,'date');
                }            
            }
            otextarea.value=content_list.join('\n');
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
            var reg_type=document.getElementById('input_reg_type_klr2').value.trim();
            var is_multileline=document.getElementById('checkbox_replace_multiline_klr2').checked;
            replace_strs_klr_b(csrep1,csrep2,'textarea_rows_content','textarea_status',reg_type,is_multileline);
            break;
        case '分组':
	        var blinterval=Math.max(parseInt(document.getElementById('input_line_interval').value.trim()),1);
	        var blinsert_str=document.getElementById('input_new_line').value;        
            insert_new_lines_klr_b(blinterval,blinsert_str);
            break;
        case '随机字符':
            var cslines=document.getElementById('input_rnd_lines').value;
            var csmin=document.getElementById('input_rnd_count_min').value;
            var csmax=document.getElementById('input_rnd_count_max').value;        
            var bltype=[
            document.getElementById('checkbox_rnd_character_cn_klr2').checked,
            document.getElementById('checkbox_rnd_character_en_klr2').checked,
            document.getElementById('checkbox_rnd_character_num_klr2').checked,
            ];
            rnd_str_klr_b(bltype,cslines,csmin,csmax);
            break;
        case '重复':
	        var bltimes=document.getElementById('tcopy').value;
            copy_lines_klr_b(bltimes);
            break;
    }
}

function str_en_de_kl2(cstype='double',en=true){
    var blstr=document.getElementById('textarea_rows_content').value;
    var ostatus=document.getElementById('textarea_status');
    switch (cstype){
        case 'double':
            if (en){
                ostatus.value=en_double_str_b(blstr);    
            } else {
                ostatus.value=de_double_str_b(blstr);    
            }
            break;
        case 'url':
            var list_t=blstr.split('\n');
            if (en){
                for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                    list_t[blxl]=encodeURIComponent(list_t[blxl]);
                }
            } else {
                for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                    list_t[blxl]=decodeURIComponent(list_t[blxl]);
                }
            }
            ostatus.value=list_t.join('\n');
            break;
        case 'confuse':
            var list_t=blstr.split('\n');
            if (en){
                for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                    list_t[blxl]=en_confuse_str_b(list_t[blxl]);
                }
            } else {
                for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                    list_t[blxl]=de_confuse_str_b(list_t[blxl]);
                }
            }
            ostatus.value=list_t.join('\n');        
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

    var fsize=(ismobile_b()?50:100);
    
    klmenu_fn=klmenu_fn.concat([
    '<span class="span_menu" onclick="'+str_t+'html_to_image_klr_b();">保存为图片</span>',
    '<span class="span_menu" onclick="'+str_t+'setInterval(random_strs_klr2,5000);">每5秒生成随机字符串到剪贴板</span>',
    '<span class="span_menu" onclick="'+str_t+'random_txt_files_klr2('+fsize+');">随机生成'+fsize+'MB文本文件</span>',
    '<span class="span_menu" onclick="scheme_div_b();">页面主题</span>',
    '<span class="span_menu" onclick="'+str_t+'service_worker_delete_b(\'rows\');">更新版本</span>',
    ]);

    var group_list=[
    ['md->HTML','markdown2html_klr2();',true],
    ['HTML->md','markdown2html_klr2(true);',true],
    ];    
    klmenu_fn.push(menu_container_b(str_t,group_list,'markdown: '));
    
    var klmenu_ende=[
    '<span class="span_menu" onclick="'+str_t+'en_double_2_array_klr2();">en_double 2 array</span>',
    '<span class="span_menu" onclick="'+str_t+'en_double_2_array_klr2(true);">en_double 2 array html file</span>',    
    ];

    var group_list=[
    ['en','str_en_de_kl2(\'url\',true);',true],
    ['de','str_en_de_kl2(\'url\',false);',true],
    ];    
    klmenu_ende.push(menu_container_b(str_t,group_list,'codeURIComponent: '));
    
    var group_list=[
    ['en','str_en_de_kl2(\'double\',true);',true],
    ['de','str_en_de_kl2(\'double\',false);',true],
    ];    
    klmenu_ende.push(menu_container_b(str_t,group_list,'double: '));

    var group_list=[
    ['en','str_en_de_kl2(\'confuse\',true);',true],
    ['de','str_en_de_kl2(\'confuse\',false);',true],
    ];    
    klmenu_ende.push(menu_container_b(str_t,group_list,'confuse: '));
        
    var klmenu_sort=sort_menu_klr_b('textarea_rows_content',str_t);
      
    var klmenu_convert=[];
    var group_list=[
    ['js2href','JavaScript 数组 =&gt; 网址链接'],
    ['js2wikihref','JavaScript 数组 =&gt; wiki链接'],
    ['wikihref2js','wiki链接 =&gt; JavaScript 数组'],
    ['href_title2js','网址 名称 =&gt; JavaScript 数组'],
    ['title_href2js','名称 网址 =&gt; JavaScript 数组'],
    ['title_href2csv','名称 网址 =&gt; csv网址格式'],
    ['enword2enlink','单词名称 =&gt; 词典链接 JavaScript 数组'],

    ];
    for (let arow of group_list){
        klmenu_convert.push('<span class="span_menu" onclick="'+str_t+'strquick_klr_b(\''+arow[0]+'\');">'+arow[1]+'</span>');
    }
   
    var klmenu_batch=[
    '<span class="span_menu" onclick="'+str_t+'enwords_get_klr2();">提取英文单词</span>',
    '<span class="span_menu">间隔(秒)：<input type="number" id="input_seconds_strquick_b" style="width:3rem;" value=1 min=0 /></span>',
    '<span class="span_menu" onclick="'+str_t+'batch_open_www_klr_b(\'batchwww\');">批量打开网址</span>',
    ];
        
    var group_list=['Kai_B_C_O_+_K', 'BCO+K', 'BO+K', 'BOK', 'OK',];
    for (let blxl=0,lent=group_list.length;blxl<lent;blxl++){
        group_list[blxl]=[group_list[blxl],'batch_open_www_klr_b(\''+group_list[blxl]+'\');',true];
    }
    klmenu_batch.push(menu_container_b(str_t,group_list,'批量打开(en): '));

    var group_list=[
    ['+','batch_open_www_klr_b(\'+\');',true],
    ['C','batch_open_www_klr_b(\'C\');',true],
    ['Kaikki','batch_open_www_klr_b(\'Kai\');',true],
    ];    
    klmenu_batch.push(menu_container_b(str_t,group_list,'批量打开(en): '));
    
    if (is_local_b()){
        klmenu_batch.push('<span class="span_menu" onclick="'+str_t+'batch_open_www_klr_b(\'klwikititle\');">批量打开KLWiki Title</span>');
    }
    
    var klmenu_links=[
    '<a href="image2base64.htm" onclick="'+str_t+'" target=_blank>Image 2 base64</a>',
    '<a href="?klqr">KLQR(userscript)</a>',
    '<a href="../module/CSV_to_Wiki_Table.htm" onclick="'+str_t+'" target=_blank>CSV to Wiki Table</a>',
    '<a href="readlater.htm" onclick="'+str_t+'" target=_blank>readlater</a>',
    ];    
    
    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span class="span_menu" onclick="'+str_t+'title_change_klr2();">修改页面标题</span>',    
    ]);
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_fn,'','20rem','1rem','1rem','60rem')+klmenu_b(klmenu_ende,'🛡️','17rem','1rem','1rem','60rem')+klmenu_b(klmenu_sort,'↕','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_convert,'↔','20rem','1rem','1rem','60rem')+klmenu_b(klmenu_batch,'🗂','28rem','1rem','1rem','60rem')+klmenu_b(klmenu_links,'L','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','20rem','1rem','1rem','60rem'),'','0rem','','menus_klr2')+' ');
}

function random_txt_files_klr2(cssize=100){
    function sub_random_txt_files_klr2_one_file(){
        if (blxl>=cscount){return;}

        //分段，且比randstr_b(cssize*1024*1024) 节约非常多的内存 - 保留注释
        var blcontent=[];
        for (let blno=0;blno<1024;blno++){
            blcontent.push(randstr_b(cssize*1024)); 
        }
        string_2_txt_file_b(blcontent.join('\n'),'temp_'+fname+'_'+(blxl+1)+'_'+cscount+'.txt','txt');
        
        blxl=blxl+1;
        setTimeout(sub_random_txt_files_klr2_one_file,2000*randint_b(1,5));
    }
    //-----------------------
    var cscount=parseInt((prompt('输入生成份数：','10') || '').trim());
    if (isNaN(cscount)){return;}
    cscount=Math.min(50,Math.max(0,cscount));
    var fname=randstr_b(8);
    var blxl=0;
    sub_random_txt_files_klr2_one_file();
}

function enwords_get_klr2(){
    var otextarea=document.getElementById('textarea_rows_content');
    var blstr=otextarea.value;
    var list_t=blstr.trim().replace(new RegExp('_','g'),' ').split('\n');
    var result_t=[];
    for (let arow of list_t){
        for (let item of ['】',' - ','是什么意思','Definition & Meaning','definition and meaning',' in English',' | English meaning']){
            arow=arow.split(item)[0];
        }
        row_list=arow.match(/[a-z\-\_\s]+/ig) || [];
        result_t=array_union_b(result_t,row_list);
    }
    otextarea.value=result_t.join('\n').replace(/^\s+|\s+$/mg,'');
    document.getElementById('textarea_status').value=blstr;
}

function random_strs_klr2(){
    var cslines=document.getElementById('input_rnd_lines').value;
    var csmin=document.getElementById('input_rnd_count_min').value;
    var csmax=document.getElementById('input_rnd_count_max').value;
    rnd_str_klr_b([],cslines,csmin,csmax);
    
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
        var bljg=textarea_buttons_b('textarea_rows_content','全选,清空,复制,导入temp_txt_share,导入 txt 文件,发送到临时记事本,发送地址,加密,解密,↑,↓');    
        op.insertAdjacentHTML('beforeend',bljg);
    }
    //-----------------------
    var oform=document.querySelector('form[name="form_status_klr"]');
    if (oform){
	    oform.setAttribute('action',postpath+'temp_txt_share.php');
    }
    var op=document.getElementById('p_buttons_2');
    if (op){
        var bljg=textarea_buttons_b('textarea_status','全选,清空,复制,发送到临时记事本');
        bljg=bljg+'<span class="aclick" onclick="textarea_shift_b(\'textarea_rows_content\',\'textarea_status\');">对调</span>';        
        bljg=bljg+'<span class="aclick" onclick="temp_save_klr2(\'write\',\'textarea_status\');">暂存</span>';
        bljg=bljg+'<span class="aclick" onclick="diff_klr2();">diff</span>';
        op.insertAdjacentHTML('beforeend',bljg);
    }  
}

function markdown2html_klr2(is_reverse=false){
    var otextarea=document.getElementById('textarea_rows_content');
    var ostatus=document.getElementById('textarea_status');
    var blstr=otextarea.value;
    if (is_reverse){
        const turndownService = new TurndownService({
            headingStyle: 'atx' //或 setext - 保留注释
        });
  
        const markdown = turndownService.turndown(blstr);
        ostatus.value = markdown;    
    } else {
        var blhtml = marked.parse(blstr);
        ostatus.value=blhtml;
        var odiv=document.getElementById('divhtml');
        odiv.innerHTML=blhtml;
        odiv.scrollIntoView();
    }
}

function diff_klr2(){
    var diff_str=two_list_diff_b(false,false,'textarea_rows_content','textarea_status','','','上','下')[1];

    var buttons='<p>'+close_button_b('div_status','')+'</p>';

    var odiv=document.getElementById('div_status');
    odiv.innerHTML=diff_str+buttons;
    odiv.scrollIntoView();
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
    ['letter2num9','字母替换为9键数字'],
    ['numbers2datetime','数字串转换为日期时间'],

    ];    
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl]='<option value="'+list_t[blxl][0]+'">'+list_t[blxl][1]+'</option>';
    }
    document.getElementById('oquick').innerHTML=list_t.join('\n');
    
    var list_t=[
    '["+——《》"],',
    '"+",',
    ];
    document.getElementById('select_leaflet_insert_common').innerHTML=list_2_option_b(list_t);
    
    var list_t=[
    '^.*?(/.*/)((save|待整理)-\\d*-[ab]|待看\\d*(副本)?)/.*$+$1$2',
    '^===\\d*===$',
    '\\s.*$',
    ];
    document.getElementById('select_leaflet_replace_common').innerHTML=list_2_option_b(list_t);
}

function init_klr2(){
    function sub_init_klr2_set_input_value(csid,csmin,csmax){
        var oinput=document.getElementById(csid);
        var blvalue;
        if (oinput.value==1){
            blvalue=randint_b(csmin,csmax);
            oinput.value=blvalue;
        } else {
            blvalue=oinput.value;
        }
        return blvalue;
    }
    //-----------------------
    character_2_icon_b('𝍣');    
    leaflet_klr2();
    option_generate_klr2();
    form_set_klr2();
    input_style_klr2();
    menu_klr2();
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),true,false,2);
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

function replace_common_klr2(){
    var blstr=document.getElementById('select_leaflet_replace_common').value;
    if (blstr==''){return;}
    inputs_insert_value_from_str_b('rep1','rep2',blstr);
}

function insert_common_klr2(){
    var blstr=document.getElementById('select_leaflet_insert_common').value;
    if (blstr==''){return;}
    inputs_insert_value_from_str_b('taddstr1','taddstr2',blstr);
}

function leaflet_en_buttons_klr2(){
    var list_t=letters52_style_list_b();
    var result_t=['<option value=-1>abcde</option>'];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        result_t.push('<option value='+blxl+'>'+list_t[blxl].slice(0,5).join('')+'</option>');
    }
    var buttons='<select id="select_transform_klr">'+result_t.join('\n')+'</select>\n';
    buttons=buttons+'<span class="aclick" onclick="en_transform_klr2(document.getElementById(\'select_transform_klr\').value);">执行</span> ';        
    
    buttons=buttons+'<select id="select_invisible_klr">\n';
    for (let item of ['add','cn','cn_phrase','remove','test']){
        buttons=buttons+'<option>'+item+'</option>';
    }
    buttons=buttons+'</select>\n';
    buttons=buttons+'<label><input type="checkbox" id="input_invisible_restrict" />restrict</label>\n';
    buttons=buttons+'<span class="aclick" onclick="invisible_klr2(document.getElementById(\'select_invisible_klr\').value)">执行</span> ';    
    buttons=buttons+'<span class="aclick" onclick="encrypt_textarea_quick_transform_klr_b(\'textarea_rows_content\',\'textarea_status\');">quick</span> ';    
    
    buttons=buttons+'<select id="select_transform_type">';
    for (let item of ['base64','braille','morse']){
        buttons=buttons+'<option>'+item+'</option>';
    }
    buttons=buttons+'</select> ';
    buttons=buttons+'<span class="aclick" onclick="transform_type_kl2(true);">encode</span> ';
    buttons=buttons+'<span class="aclick" onclick="transform_type_kl2(false);">decode</span> ';
        
    document.getElementById('div_leaflet_en').insertAdjacentHTML('afterbegin',buttons);
}

function temp_save_klr2(cstype='',textarea_id=''){
    temp_save_table_b(cstype,'klr2_save',textarea_id,'div_temp_save',20,'textarea_rows_content');
}

function transform_type_kl2(csencode=true){
    var bltype=document.getElementById('select_transform_type').value;
    switch (bltype){
        case 'base64':
            var blcontent=document.getElementById('textarea_rows_content').value;
            try {
                if (csencode){
                    var bljg=btoa(blcontent);
                } else {
                    var bljg=atob(blcontent.trim());
                }
            } catch (error){
                var bljg=error;
            }   
            document.getElementById('textarea_status').value=bljg;
            break;
        case 'braille':
            document.getElementById('textarea_status').value=braille_transform_b(document.getElementById('textarea_rows_content').value,csencode);        
            break;
        case 'morse':
            document.getElementById('textarea_status').value=morse_transform_b(document.getElementById('textarea_rows_content').value,csencode);        
            break;
    }
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

function jieba_klr2(){
    var otextarea = document.getElementById('textarea_rows_content');
    var str_t,arr_t;
    [str_t,arr_t]=jieba_klr_b(otextarea.value);
    var ostatus=document.getElementById('textarea_status');
    ostatus.value = str_t.join(' ')+'\n\n'+arr_t;
    ostatus.scrollIntoView();
    
    wordcloud_klr2(arr_t);
}

function wordcloud_klr2(csarr=false){
    if (csarr===false){
        var list_t=document.getElementById('textarea_rows_content').value.trim().match(/^\[".*",\s*\d+\]\s*,$/mg) || [];
        try {
            csarr=eval('['+list_t.join('\n')+']');
        } catch (error){
            alert(error);
            console.log(error);
            return;
        }
    }
    
    var ratio=parseFloat(document.getElementById('input_ratio_jieba_klr2').value.trim());
    
    for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
        csarr[blxl]={ text: csarr[blxl][0], size: csarr[blxl][1]*ratio};
    }
    
    var font_family=document.getElementById('input_font_family_jieba_klr2').value.trim();
    var bgcolor=document.getElementById('input_bgcolor_jieba_klr2').value.trim();
    var width=parseInt(document.getElementById('input_width_jieba_klr2').value.trim());
    var height=parseInt(document.getElementById('input_height_jieba_klr2').value.trim());
    wordcloud_generate_d3_b('#div_status',width,height,csarr,font_family,bgcolor);
}

function crpytology_klr2(rows=99,cols=26,start_l='L',do_test=true){
    var chars=characters_b('A').split('');
    var blat=chars.indexOf(start_l);
    if (blat>=0){
        chars=chars.slice(blat,);
    }
    
    chars=chars.slice(0,cols+1);
    var bllen=chars.length;
    
    var test_data=[];
    var result_t=[];
    var oth='<tr><th></th><th>'+chars.join('</th><th>')+'</th></tr>';    
    for (let blx=0;blx<rows;blx++){
        var arow=[];
        for (let bly=0;bly<bllen;bly++){
            var blvalue=asc_sum_b(blx+''+bly+''+(blx+bly)+''+(blx*bly)+''+parseInt(blx*100/(bly+1))+''+parseInt(Math.sqrt(blx*bly)*100) +chars[bly]+chars[bly].toLowerCase());  //从A-Z前99行3-4组合无重复
            blvalue=('0'+blvalue.toString()).slice(-2,);
            arow.push(blvalue);
        }
        if (blx % 10 == 0){
            result_t.push(oth);
        }
        result_t.push('<tr><td align=right>'+(blx+1)+'</td><td>'+arow.join('</td><td>')+'</td></tr>');  //no. 不能仅保留2位 - 保留注释
        test_data.push(arow);
    }
    
    
    var buttons='<p>'+close_button_b('div_status','')+'</p>';    
    var odiv=document.getElementById('div_status');    
    odiv.innerHTML='<table class="table_common">'+result_t.join('\n')+'</table>'+buttons;
    odiv.scrollIntoView();
    
    document.getElementById('textarea_status').value=SHA1(test_data.toString());
    
    if (do_test){
        console.log('rows',rows,'cols',cols,'start_L',start_l);
        for (let test_no=3;test_no<=4;test_no++){
            var sub_group={};
            for (let arow of test_data){
                for (let blxl=0;blxl<bllen;blxl=blxl+test_no){
                    var sub_col=arow.slice(blxl,blxl+test_no);
                    if (sub_col.length<test_no){continue;}
                    
                    var blkey='g_'+sub_col.join('_');
                    if (sub_group[blkey]==undefined){
                        sub_group[blkey]=0;
                    }
                    sub_group[blkey]=sub_group[blkey]+1;
                }
            }
            sub_group=object2array_b(sub_group,true,2);
            sub_group.sort();
            sub_group.sort(function (a,b){return a[1]>b[1]?-1:1;});
            console.log('元素组合 '+test_no+'：',sub_group);
            var repeat_count=0;
            for (let blxl=0,lent=sub_group.length;blxl<lent;blxl++){
                if (sub_group[blxl][1]==1){
                    console.log('重复元素：',sub_group.slice(0,blxl),'占比：'+repeat_count/sub_group.length);
                    break;
                }
                repeat_count=repeat_count+sub_group[blxl][1]-1;
            }
        }
    }
}

function mermaid_show_klr2(){
    var list_t=document.getElementById('textarea_rows_content').value.trim().split('\n');
    var odiv=document.getElementById('div_status');
    odiv.innerHTML='';

    show_mermaid_b(list_t,odiv);
}

function showhide_klr2(){
    for (let item of ['div_form_klr2','div_temp_save']){
        var odiv=document.getElementById(item);
        odiv.style.display=(odiv.style.display=='none'?'':'none');
    }
    var odiv=document.getElementById('menus_klr2');
    odiv.style.display=(odiv.style.display=='none'?'inline':'none');
}

function title_change_klr2(){
    var old_title=document.title;
    var new_title=(prompt('输入新标题：',old_title) || '').trim();
    if (new_title=='' || new_title==old_title){return;}
    document.title=new_title;
    document.getElementById('span_title').innerText=new_title;
}
