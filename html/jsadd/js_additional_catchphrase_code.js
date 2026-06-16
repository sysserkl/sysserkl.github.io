function menu_more_catchphrase(){
    var str_t=klmenu_hide_b('');

    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'mini_catchphrase();">生成随机mini版本js文件</span>',   
    ];

    return klmenu_b(klmenu1,'🪧','19rem','1rem','1rem','30rem');
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
    var file_list=klbase_addons_import_js_b(['en_de_str','wiki'],[],[],[],false,false);
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
