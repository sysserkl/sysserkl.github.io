function search_site_kls_b(item,cskey='',csencode=false,csproxy=false){
    if (item[2]==4){ 
        cskey=gbkcode(cskey);   //仅 当当 - 保留注释
    } else {
        cskey=web_href_key_b(cskey,item[2]);
    }
    
    if (csencode && !csproxy){
        cskey=encodeURIComponent(cskey);
    }
    //以下3行保留 - 保留注释
    //else if (item[csi][3]=="unicode"){
    //    window.open(blleft+escape(blstr)+blright);
    //}

    if (item[5].includes('n')){
        var blhref=item[0]+item[1];
    } else {
        if (item[5].includes('l')){
            var blhref=item[0]+cskey.toLowerCase()+item[1];
        } else {
            var blhref=item[0]+cskey+item[1];
        }
    }
    
    if (csproxy){
        var blhero=local_storage_get_b('herokuapp_host').trim();
        if (blhero!==''){
            blhref='https://'+blhero+'/get?url='+encodeURIComponent(blhref);
        }
    }
    return blhref;
}

function batch_type_get_kls_b(cstype){
    switch (cstype){
        case 'batch_en':
            cstype='youdao,iciba,merriam-webster,TFD,AHD,britannicadict,lexico,reverso';//,dict.cn,WR_CN,dictionary.com,longman,wordnik';
            //(is_local_b()?'KLWiki,':'') +'collins(p),wiktionary(p),' - 此两项保留 - 保留注释
            break;
        case 'batch_en+':
            cstype='Bing(cn),Oxford,Cambridge';
            break;
        case 'batch_en_wiktionary':
            cstype='Wiktionary(Local),kaikki(Local),wordhippo,definitions';
            break;
        case 'batch_dwdlw':
            cstype='dict.cn,WR_CN,dictionary.com,longman,wordnik,oed';
            break;
        case 'batch_offline':
            cstype='merriam-webster,AHD,britannicadict,Oxford,Cambridge,Cambridge_CN,WR_CN,dictionary.com,longman,wordnik,Collins,reverso';
            break;
    }
    
    if (cstype==''){return [];}
    
    cstype=cstype.toLowerCase().split(',');
    return cstype;
}

function types_2_list_kls_b(cstype,cskey,cscategory='',to_html=false){
    var type_list=batch_type_get_kls_b(cstype);

    var links_t=[];
    for (let one_type of type_list){
        let is_proxy=false;        
        if (one_type.slice(-3,)=='(p)'){
            is_proxy=true;
            one_type=one_type.slice(0,-3);
        }
        
        for (let blxl=0,lent=search_sites_list_global.length;blxl<lent;blxl++){
            let item=search_sites_list_global[blxl];
            if (one_type==item[4].toLowerCase()){   //网站缩写名称 - 保留注释
                if (cscategory!=='' && cscategory!==item[6].toLowerCase()){continue;}   //网站分类 - 保留注释
                //let blhref=search_site_klsearch(blxl,is_proxy,cskey,false,false)[0];  //此行保留 - 保留注释
                let row_list=[].concat(search_sites_list_global[blxl]);
                let blhref=search_site_kls_b(row_list,cskey,false,is_proxy);
                if (to_html){
                    blhref='<a href="'+blhref+'" target=_blank>'+blhref+'</a>';
                }
                links_t.push(blhref);
            }
        }
    }
    links_t.sort();
    return links_t;
}
