function html_str_group_b(cslist,csparent=''){
    var result_t=[];
    var dom_name='';
    var blcontent=[];
    for (let arow of cslist){
        var list_t=arow.match(/^\s*<title>(.*?)<\/title>\s*$/) || [];
        if (list_t.length>0){
            result_t.push(['title',list_t[1]]);
            continue;
        }
        
        list_t=arow.match(/^\s*<\/(script|style)>\s*$/) || [];
        if (list_t.length>0){
            if (dom_name!==''){
                result_t.push([dom_name,blcontent]);
            }
            dom_name='';
            blcontent=[];
            continue;
        }
        
        list_t=arow.match(/^\s*<(script|style)>\s*$/) || [];
        if (list_t.length>0){
            if (blcontent.length>0){
                result_t.push(['html',blcontent]);
            }
            dom_name=list_t[1];
            blcontent=[];
            continue;
        }
        
        blcontent.push(arow);
    }

    result_t.push(['html',blcontent]);
    
    var bltitle='';
    if (csparent!==''){
        for (let one_content of result_t){
            switch (one_content[0]){
                case 'title':
                    bltitle=one_content[1];
                    break;
                case 'html':
                    switch (csparent){
                        case 'head':
                            document.head.insertAdjacentHTML('beforeend',one_content[1].join('\n'));
                            break;
                        case 'body':
                            document.body.insertAdjacentHTML('beforeend',one_content[1].join('\n'));
                            break;
                    }
                    break;
                case 'style':
                case 'script':
                    style_generate_b(one_content[1],true,one_content[0],csparent);
                    break;
            }
        }
    }
    
    if (bltitle!==''){
        setTimeout(function(){document.title=bltitle;},1000);   //不然 title 没有正确显示 - 保留注释
    }
    return result_t;
}

function html_head_body_render_b(html_source){
    var blat=html_source.indexOf('</head>');
    if (blat==-1){
        alert('未发现</head>');
        return;
    }
    
    var blleft=html_source.slice(0,blat);
    for (let blxl=0,lent=blleft.length;blxl<lent;blxl++){
        if (blleft[blxl].match(/^\s*<head>\s*$/)){
            blleft=blleft.slice(blxl+1,);
            break;
        }
    }
    for (let blxl=0,lent=blleft.length;blxl<lent;blxl++){
        if (blleft[blxl].match(/^\s*<\/head>\s*$/)){
            blleft=blleft.slice(0,blxl);
            break;
        }
    }

    for (let blxl=0,lent=blleft.length;blxl<lent;blxl++){
        if (blleft[blxl].match(/^\s*<link rel="manifest" href=".*?\.webmanifest" \/>\s*$/)){
            console.log('移除',blleft[blxl]);
            blleft[blxl]='';
            break;
        }
    }
    
    var head_content=html_str_group_b(blleft,'head');
            
    var blright=html_source.slice(blat+1,);
    for (let blxl=0,lent=blright.length;blxl<lent;blxl++){
        if (blright[blxl].match(/^\s*<body /) || blright[blxl].match(/^\s*<body>\s*$/)){
            blright=blright.slice(blxl+1,);
            break;
        }
    }
    
    for (let blxl=0,lent=blright.length;blxl<lent;blxl++){
        if (blright[blxl].match(/^\s*<\/body>\s*$/)){
            blright=blright.slice(0,blxl);
            break;
        }
    }

    for (let blxl=0,lent=blright.length;blxl<lent;blxl++){
        if (blright[blxl].match(/^\s*pwa_register_b\('.*?_service_worker\.js',.*?\);\s*$/)){
            console.log('移除',blright[blxl]);
            blright[blxl]='';
            break;
        }
    }  

    if (!document.body){
        document.write('<body></body>');    //head 更新后，似乎 body 被自动删除了 - 保留注释
    } else {
        document.body.innerHTML='';
    }
    html_str_group_b(blright,'body');
}

function html_render_js_b(js_list,run_fn=false){
    style_generate_b(js_list,true,'script');
    var fn_name=[];
    for (let item of js_list){
        fn_name=item.match(/^\s*function\s+(.*?)\(.*?\)/m) ||[];
        //形如：[ "function tab2space_diff_b()", "tab2space_diff_b" ] - 保留注释
        if (fn_name.length>0){
            if (typeof run_fn == 'function'){
                run_fn(0,fn_name[1]);
            }
            break;
        }
    }
}
