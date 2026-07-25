function menu_more_catchphrase(){
    var str_t=klmenu_hide_b('');

    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'mini_catchphrase();">生成随机mini版本js文件</span>',   
    '<span class="span_menu" onclick="'+str_t+'duplicate_catchphrase();">当前条件重复子句检查</span>',
    '<span class="span_menu">子句最少字数：<input type="number" id="input_min_len_jsad_catchphrase" min=2 value=10 style="width:4rem;" /> <label><input type="checkbox" id="checkbox_remove_name_jsad_catchphrase" checked />移除末尾——书名/作者名</label></span>',
    ];

    return klmenu_b(klmenu1,'🪧','19rem','1rem','1rem','30rem');
}

function duplicate_catchphrase(){
    var clause_list=[];
    var phrase_set=new Set();
    var duplicate_set=new Set();
    var min_len=parseInt(document.getElementById('input_min_len_jsad_catchphrase').value.trim()) || 2;
    var remove_name=document.getElementById('checkbox_remove_name_jsad_catchphrase').checked;
    for (let blxl=0,lent=js_data_current_common_search_global.length;blxl<lent;blxl++){
        let arow=js_data_current_common_search_global[blxl];
        if (Array.isArray(arow[0])){
            var blstr=arow[0].join('.');
        } else {
            var blstr=arow[0];
        }
        
        if (remove_name){
             blstr=blstr.replace(/(.*)——.*/, '$1'); 
        }
        
        var set_t=new Set(punctuation_replace_b(blstr,false));
        set_t=Array.from(set_t).filter(item => item.length > min_len);
        if (set_t.length==0){continue;}
        
        clause_list.push([set_t,blxl]);
        for (let item of set_t){
            if (phrase_set.has(item)){
                duplicate_set.add(item);
            } else {
                phrase_set.add(item);
            }
        }
    }
    
    var result_t=[];
    for (let arow of clause_list){
        for (let aphrase of duplicate_set){
            if (arow[0].includes(aphrase)){
                result_t.push(js_data_current_common_search_global[arow[1]]);
                break;
            }
        }
    }
    js_data_current_common_search_global=result_t;
    document.getElementById('input_search').value=Array.from(duplicate_set).join(' ');
    current_len_refresh_common();
    page_common();
}

function mini_catchphrase(cscount=1000){
    var lent=catchphrase_global.length;
    var result_t=randint_list_b(0,lent-1,cscount);
    result_t.sort(function (a,b){return a<b?-1:1;});
    
    for (let blxl=0,lenb=result_t.length;blxl<lenb;blxl++){
        let list_t=catchphrase_global[result_t[blxl]];
        if (typeof list_t=='string'){
            list_t=[list_t];
        }
        
        let value=[];
        for (let arow of list_t){
            value.push(specialstr92_b(arow));
        }
        result_t[blxl]='["'+value.join('",\n"')+'"],';
    }
    string_2_txt_file_b('var catchphrase_global=[\n'+result_t.join('\n')+'\n];\n','catchphrase_mini_data.js','js');
}

function style_load_catchphrase(){
    var blstr='#divhtml br {margin-bottom:0.5rem;}';
    style_generate_b(blstr,true);
}

function col_rearrange_catchphrase(){
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        if (Array.isArray(arow[0])){
            list_t.push([arow[0].join('<br />'),arow[1]]);
        } else {
            console.log('非数组',arow[0]);
            list_t.push([arow[0],arow[1]]);
        }
    }
    return list_t;
}

function file_load_catchphrase(){
    var file_list=klbase_addons_import_js_b(['en_de_str','wiki','rows'],[],[],[],false,false);
    file_dom_create_b(file_list,true,'js');
}

function data_load_catchphrase(array_name){
    function sub_data_load_catchphrase_format(){
        var t0=performance.now();           
        var result_t=[];
        for (let arow of eval(array_name)){
            for (let blxl=0,lent=arow.length;blxl<lent;blxl++){
                arow[blxl]=wiki_all_format_b(arow[blxl]);
            }
            result_t.push(arow);
        }
        eval(array_name+'=result_t');
        console.log('data_load_catchphrase 费时：'+(performance.now() - t0) + ' milliseconds');
    }
    //-----------------------
    load_fn_b('wiki_all_format_b',sub_data_load_catchphrase_format);
}
