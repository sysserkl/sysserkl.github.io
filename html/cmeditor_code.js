function args_codemirror(){
    theme_selected_cm_global=theme_random_codemorror();
    mode_cm_global='javascript';
	bigfile_cm_global='';
    
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,5)=='mode='){
                mode_cm_global=one_key.substring(5,);
            } else if (one_key.substring(0,6)=='theme='){
                theme_selected_cm_global=one_key.substring(6,);
            } else if (one_key.substring(0,8)=='bigfile='){
                bigfile_cm_global=one_key.substring(8,);
            }
        }
    }
    
    save_name_cm_global=bigfile_cm_global;
    menu_icon_cm_global=mode_cm_global.slice(0,1).toUpperCase();
    var blext=file_path_name_b(bigfile_cm_global)[2];
   	switch (blext){
        case 'js':
            mode_cm_global='javascript';
            menu_icon_cm_global='{}';
            break;
        case 'htm':
        case 'html':
            mode_cm_global='html';
            break;
        case 'sh':
            mode_cm_global='shell';
            break;
        case 'php':
            mode_cm_global='php';
            menu_icon_cm_global='p';
            break;
        case 'py':
            mode_cm_global='python';
            break;
    }
    
    if (mode_cm_global=='html'){
        mode_cm_global='htmlmixed';
    } else if (mode_cm_global=='php'){
        mode_cm_global='application/x-httpd-php';
    }
    
    console.log('theme_selected_cm_global:',theme_selected_cm_global,'mode_cm_global:',mode_cm_global);
}

function load_codemirror(){
    function sub_load_codemirror_one(is_ok,fname){
        blxl=blxl+1;
        console.log('step',step_no+1,'/',blxl,'/',bllen[step_no],is_ok,fname);
        if (blxl>=bllen[step_no]){
            if (step_no==1){
                file_loaded_cm_global=true;
            } else {
                //console.log(typeof file_loaded_cm_global);    //此行保留 - 保留注释
                step_no=1;
                blxl=0;
                load_var_b('CodeMirror',function (){file_dom_create_b(flist2,true,'',sub_load_codemirror_one);},false,-1,200);  //等待变量，即便如此，也会可能出现载入失败 - 保留注释
            }
        }
    }

    function sub_load_codemirror_path(cslist){
        for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
            cslist[blxl]='codemirror/'+cslist[blxl];
        }
        return cslist;
    }
    
    function sub_load_codemirror_base(cslist){
        for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
            cslist[blxl]=file_path_name_b(cslist[blxl])[3];
        }
        return cslist;
    }
    
    function sub_load_codemirror_bigfile(csdict){
        var js_content=[];
        var css_content=[];
        for (let afile of base_name_list){
            if (csdict['f_'+afile]==undefined){
                alert('未发现 '+afile);
                break;
            }
            if (afile.endsWith('.js')){
                js_content.push(csdict['f_'+afile]);
            } else if (afile.endsWith('.css')){
                css_content.push(csdict['f_'+afile]);
            }
            js_content.push('file_loaded_cm_global=true;');
            style_generate_b(js_content,true,'script');
            style_generate_b(css_content,true,'style');
        }
    }
    args_codemirror();

    var step_1_list=[
    'codemirror.min.js',
    'codemirror.min.css',
    ];
    
    var step_2_list=[];
    
    var lint_list=['lint.min.js','lint.min.css'];
    var mode_list=[];
    switch (mode_cm_global){
        case 'javascript':
            lint_list.push('javascript-lint.min.js');
            
            mode_list=['javascript/javascript.min.js'];
            break;
        case 'htmlmixed':
            lint_list.push('html-lint.min.js');
            
            mode_list=['xml/xml.min.js', 'javascript/javascript.min.js', 'css/css.min.js', 'htmlmixed/htmlmixed.min.js'];
            break;
        case 'shell':
            mode_list=['shell/shell.min.js'];
            break;
        case 'application/x-httpd-php':
            mode_list=['xml/xml.min.js','php/php.min.js'];
            break;
        case 'python':
            mode_list=['python/python.min.js'];
            break;
    }
    
    for (let item of lint_list){
        step_2_list.push('addon/lint/'+item);
    }
    
    for (let item of mode_list){
        step_2_list.push('mode/'+item);
    }

    step_1_list=sub_load_codemirror_path(step_1_list);
    step_2_list=sub_load_codemirror_path(step_2_list);

    switch (mode_cm_global){
        case 'javascript':
            step_2_list=['jshint.min.js'].concat(step_2_list);
            break;
        case 'htmlmixed':
            step_2_list=['htmlhint.min.js'].concat(step_2_list);  //必须先载入 - 保留注释
            break;
    }
    
    step_2_list.push('codemirror/theme/'+theme_selected_cm_global+'.min.css');

    if (local_storage_get_b('first_source_bigfile')!=='1'){
        var blxl=0;
        var bllen=[step_1_list.length,step_2_list.length];
        var step_no=0;
        var flist1=klbase_addons_import_js_b([],step_1_list,[],[],false,false);
        var flist2=klbase_addons_import_js_b([],step_2_list,[],[],false,false);
        file_dom_create_b(flist1,true,'',sub_load_codemirror_one);
    } else {
        step_1_list=sub_load_codemirror_base(step_1_list);
        step_2_list=sub_load_codemirror_base(step_2_list);
        var base_name_list=step_1_list.concat(step_2_list);
        idb_bigfile_b('read','filedict',base_name_list,sub_load_codemirror_bigfile);
    }
}

function init_codemirror(is_ok=true){
    function sub_init_codemirror_bigfile(csstr){
        if (csstr==''){
            editor_cm_global.setValue('//mode: '+mode_cm_global+'\n//theme: '+theme_selected_cm_global+'\n'); //不能使用 otextarea.value= 否则不会显示 - 保留注释   
        } else {
            editor_cm_global.setValue(csstr);
        }
    }
    
    if (!is_ok){
        alert('载入失败');
        return;
    }
    
    menu_codemirror();
    buttons_codemirror();
    
    var blheight=document_body_offsetHeight_b()*0.9;
    style_generate_b('.CodeMirror { height: '+blheight+'px; }',true,'style','head');
    character_2_icon_b('{}');

    //全局变量 - 保留注释
    // 初始化CodeMirror编辑器并设置主题
    var bllint=null;
    var blsmartIndent=true;
    switch (mode_cm_global){
        case 'javascript':
            bllint={
                options: {
                    esversion: 6, // 允许 ES6 语法
                    undef: true,   // 检查未定义的变量
                }
            };
            break;
        case 'htmlmixed':
            bllint={
                options: {
                    'tag-pair': true, // 检查标签是否成对出现
                    'attr-no-duplication': true, // 检查属性是否有重复
                }
            };
            blsmartIndent=false;
            break;
    }
    
    var otextarea=document.getElementById('textarea_cm_editor');
    editor_cm_global = CodeMirror.fromTextArea(otextarea, {
        lineNumbers: true, //显示行号
        lineWrapping: true, //自动换行
        smartIndent: blsmartIndent, // 智能缩进
        indentUnit: 4,
        mode: mode_cm_global, //设置模式
        theme: theme_selected_cm_global, //设置主题
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        lint: bllint,
    });

	bigfile_content_read_codemirror(sub_init_codemirror_bigfile);
}
    
function bigfile_content_read_codemirror(run_fn){
    if (bigfile_cm_global==''){
        run_fn('');
    } else {
    	idb_bigfile_b('read','content',bigfile_cm_global,run_fn);
    }
}

function menu_codemirror(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'quick_klsticker(\'mobile\');">手机</span>', 
    ];
    
     	      document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,menu_icon_cm_global,'14rem'),'','0rem')+' ');
    
}

function buttons_codemirror(){
    var list_t=[];
    if (mode_cm_global=='javascript'){
        list_t.push('<span class="aclick" onclick="run_codemirror();" title="运行">▶️</span>');
    }
    list_t=list_t.concat([
    '<span class="aclick" onclick="save_as_file_codemirror();" title="保存为文件">📤</span>',
    '<span class="aclick" onclick="save_2_bigfile_codemirror();" title="保存到bigfile">💾</span>',
    '<span class="aclick" onclick="copy_file_name_codemirror();" title="复制文件名">📎</span>',
        
    ]);
    
    document.getElementById('p_buttons_cm_editor').innerHTML=list_t.join('');
}

function save_2_bigfile_codemirror(){
    
}

function copy_file_name_codemirror(){
}

function save_as_file_codemirror(){
    var blstr = editor_cm_global.getValue();
    if (blstr==''){return;}
    
    var fname=(prompt('输入文件名和后缀来保存 '+blstr.length+ '长度内容',bigfile_cm_global) || '').trim();    
    if (fname==''){return;}
    var blext=file_path_name_b(fname)[2];
	string_2_txt_file_b(blstr,fname,blext);
}

function run_codemirror(){
    try {
        // 获取编辑器中的代码
        let code = editor_cm_global.getValue();
        // 创建一个新的Function对象并立即执行它
        const result = new Function(code)();
        // 输出结果
        document.getElementById('div_html').textContent = '输出结果：\n' + result;
    } catch (error) {
        // 如果有错误发生，输出错误信息
        document.getElementById('div_html').textContent = '错误：\n' + error.message;
    }
}

function themes_get_codemirror(){
    return ['3024-day','3024-night','abbott','abcdef','ambiance','ambiance-mobile','ayu-dark','ayu-mirage','base16-dark','base16-light','bespin','blackboard','cobalt','colorforth','darcula','dracula','duotone-dark','duotone-light','eclipse','elegant','erlang-dark','gruvbox-dark','hopscotch','icecoder','idea','isotope','juejin','lesser-dark','liquibyte','lucario','material','material-darker','material-ocean','material-palenight','mbo','mdn-like','midnight','monokai','moxer','neat','neo','night','nord','oceanic-next','panda-syntax','paraiso-dark','paraiso-light','pastel-on-dark','railscasts','rubyblue','seti','shadowfox','solarized','ssms','the-matrix','tomorrow-night-bright','tomorrow-night-eighties','ttcn','twilight','vibrant-ink','xq-dark','xq-light','yeti','yonce','zenburn'];
}

function theme_random_codemorror(){
    var list_t=themes_get_codemirror().sort(randomsort_b);
    return list_t[0];
}
