function prism_highlight_strings_klh_b(cscontent,filetype){
    var code_object=false;
    var codetype_dict={
    '.asp':'html',
    '.cpp':'cpp',
    '.css':'css',
    '.htm':'html',
    '.html':'html',
    '.js':'javascript',
    '.php':'php',
    '.py':'python',
    '.sh':'bash',
    '.txt':'text',
    };
    
    var codetype=codetype_dict[filetype] || '';
    if (codetype==''){
        return 'not found code type';
    }
    
    var bljg='<pre class="line-numbers language-'+codetype+'" id="pre_prism">\n';            
    bljg=bljg+'<code class="language-'+codetype+'">';        
    
    bljg=bljg+Prism.highlight(cscontent, Prism.languages[codetype], codetype);
    
    bljg=bljg+'</code>\n';
    bljg=bljg+'</pre>\n';
    return bljg;
}

function run_or_view_source_klh_b(view_source,fun_list,obj=false){
    if (view_source){
        var codestrs='';
        for (let item of fun_list){
            if (item.substring(0,1)=='*'){
                item=item.substring(1,);
            }
            codestrs=codestrs+eval(item+'.toString()')+'\n\n'
        }
        for (let item of fun_list){
            if (item.substring(0,1)=='*'){continue;}      
            codestrs=codestrs+item+'();\n'
        }
        if (obj){
            obj.innerHTML=prism_highlight_strings_klh_b(codestrs,'.js');
        } else {
            return codestrs;
        }
    } else {
        for (let item of fun_list){
            if (item.substring(0,1)=='*'){continue;}      
            eval(item+'()');
        }
    }
}

function source_search_klh_b(cssource,cskey,isreg=false){
    if (cskey==''){return true;}

    var blfound=str_reg_search_b(cssource,cskey,isreg); 
    if (blfound==-1 || blfound==false){return false;}
         
    var list_t=cssource.split('\n');
    for (let arow of list_t){
        var blfound=str_reg_search_b(arow,cskey,isreg); 
        if (blfound==-1){return false;}
        if (blfound){return true;}   //有一行符合即返回 true - 保留注释
    }
    return false;
}

function fun_full_search_arr_study_klh_b(cskey,csarr,isreg=false){
    var result_t=[];
    for (let aname in csarr){
        var blstr=run_or_view_source_klh_b(true,csarr[aname],false);
        if (source_search_klh_b(blstr,cskey,isreg)){
            result_t.push(aname);
        }
    }
    return result_t;
}

function fun_full_search_li_study_klh_b(csarr){
    var cskey=document.getElementById('input_search').value.trim();
    var result_t=fun_full_search_arr_study_klh_b(cskey,csarr,klmenu_check_b('span_reg_study',false));
    var olis=document.querySelectorAll('ol#ol_menu li');
    for (let ali of olis){
        ali.style.display=(result_t.includes(ali.innerText)?'':'none');
    }
}
