function menu_more_kltxt_bible(){
    var file_list=klbase_addons_import_js_b(['bible'],[],[],[],false,false);
    file_dom_create_b(file_list,true,'js');
    
    var ospan=document.getElementById('span_for_more_menu_kltxt');
    if (!ospan){return;}

    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="bible.htm" onclick="'+str_t+'" target=_blank>KJV&ChiUns</a>',    
    ];

    var blstr=klmenu_b(klmenu1,'✝','11rem','1rem','1rem','30rem');
    ospan.outerHTML=blstr;
}

function link_generate_kltxt_bible(check_base=true){
    if (typeof(en_cn_bible_b)!=='function'){
        if (check_base){
            load_fn_b('en_cn_bible_b',function (){eval('link_generate_kltxt_bible(false)');});
        }
        return;
    }
    if (book_type_check_kltxt_b()!=='bible'){return;}

    var other_book_t=(csbooklist_sub_global[csbookno_global][1]=='圣经和合本'?'Bible(kjv)':'圣经和合本');
    var other_book_id_t='';
    for (let item of csbooklist_sub_global){
        if (item[1]==other_book_t){
            other_book_id_t=item[0];
            break;
        }
    }
    if (other_book_id_t==''){return;}
        
    var ospans=document.querySelectorAll('div#divhtml span.txt_content');
    for (let one_span of ospans){
        var oldhtml=one_span.innerHTML;
        var blstr=one_span.innerText;
        var list_t=blstr.match(/^={2,}\s(.*?)\s(\d*)\s?={2,}$/) || [];
        if (list_t.length!==3){continue;}
    
        var str_t=list_t[1];
        var num_t=list_t[2];
        
        blstr='<a href="txtlistsearch.htm?'+other_book_id_t+'&s=+'+en_cn_bible_b(str_t).replace(new RegExp(' ','g'),' +');
        if (num_t!==''){
            num_t=parseInt(num_t);
            if (num_t>0){
                blstr=blstr+' +'+num_t+'" target=_blank>'+str_t+' '+num_t+'</a>';
            } else {
                blstr=blstr+'" target=_blank>'+str_t+'</a>';
            }
        } else {
            blstr=blstr+'" target=_blank>'+str_t+'</a>';
        }
        one_span.innerHTML=blstr;
        if (one_span.innerText!==str_t+(num_t!==''?' '+num_t:'')){
            one_span.innerHTML=oldhtml;
        }
    }
}
