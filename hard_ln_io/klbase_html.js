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
    function sub_html_head_body_render_b_wait(){
        wait_times=wait_times+1;
        if (wait_times>50){
            console.log('未发现 body','等候 body 次数：',wait_times);
            return;
        }
        
        if (document.querySelector('body')){
            console.log('等候 body 次数：',wait_times);
            html_str_group_b(blright,'body');
        } else {
            setTimeout(sub_html_head_body_render_b_wait,100);
        }
    }
    
    var blat=html_source.indexOf('</head>');
    if (blat==-1){
        var blfoud=false;
        for (let blxl=1,lent=html_source.length;blxl<lent;blxl++){  //第一行肯定不含</head> - 保留注释
            if (html_source[blxl].includes('</head>')){
                head_at=html_source[blxl].indexOf('</head>');
                var blleft=html_source.slice(0,blxl).concat([html_source[blxl].slice(0,head_at)]);
                var blright=[html_source[blxl].slice(head_at+7,)].concat(html_source.slice(blxl+1,));
                //console.log(blleft,blright); - 此行用于检查 head 和 body 是否正确分割 - 保留注释
                var blfound=true;
                break;
            }
        }
        if (!blfound){
            alert('未发现</head>');
            return;
        }
    } else {
        var blleft=html_source.slice(0,blat);
        var blright=html_source.slice(blat+1,);
    }
    
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
        console.log('添加 body');
    } else {
        document.body.innerHTML='';
    }
    
    var wait_times=0;
    sub_html_head_body_render_b_wait();
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

function js_and_htm_file_render_b(cslist){
    function sub_js_and_htm_file_render_b_html(){
        var blsource='';
        for (let afile of cslist){
            if (afile[0].endsWith('.htm') || afile[0].endsWith('.html')){
                blsource=afile[1].split('\n');
                break;
            }
        }
        html_head_body_render_b(blsource);    
    }
    
    function sub_js_and_htm_file_render_b_wait(cstimes,fn_name){
        if (cstimes>5){return;}
        
        if (eval('typeof '+fn_name) == 'undefined'){
            setTimeout(function (){sub_js_and_htm_file_render_b_wait(cstimes+1,fn_name);},1000);
            return;
        }

        console.log('等待 '+fn_name+' 次数',cstimes);      
        
        sub_js_and_htm_file_render_b_html();
    }
    
    var blfound=false;
    for (let afile of cslist){
        if (afile[0].endsWith('.js')){
            html_render_js_b(afile[1].split('\n'),sub_js_and_htm_file_render_b_wait);
            blfound=true;
            break;
        }
    }
    
    if (!blfound){
        sub_js_and_htm_file_render_b_html();
    }
}
