function qr_html_websites_b(divid,aclass,ahref=''){
    var odiv=document.getElementById(divid);
    if (!odiv){return false;}
    if (odiv.getElementsByTagName('canvas').length>0 || odiv.getElementsByClassName('img_qr').length>0){
        return false;
    }    
    var oas=odiv.querySelectorAll(aclass);
    var bljg=[];
    for (let one_a of oas){
        bljg.push(one_a.outerHTML);
    }
    odiv.innerHTML=bljg.join('\n');
    
    oas=odiv.querySelectorAll('a.a_oblong_box');
    for (let one_a of oas){
        if (ahref=='' || one_a.href.includes(ahref)){
            one_a.outerHTML='<div style="positon:relative;float:left;padding:0.2rem;text-align:center;"><div class="div_qr" style="width:'+canvas_size_websites_global+'px;height:'+canvas_size_websites_global+'px;" title="'+one_a.href+'"></div>'+one_a.outerHTML+'</div>';
        }
        else {
            one_a.outerHTML='<div style="positon:relative;float:left;padding:0.2rem;text-align:center;">'+one_a.outerHTML+'</div>';        
        }
    }

    oa_qr_list_websites_global=odiv.querySelectorAll('div.div_qr');
    return true;
}

function qr_generate_websites_b(query_str){
    console.log(query_str);
    if (oa_qr_no_websites_global>=oa_qr_list_websites_global.length){
        oa_qr_no_websites_global=0;
        oa_qr_list_websites_global=[];
        
        var ocanvas=document.querySelectorAll(query_str);
        for (let item of ocanvas){
            item.outerHTML='<img class="img_qr" src="'+canvas2img_b(item)+'" />';
        }
        return false;
    }
    
    var one_oa=oa_qr_list_websites_global[oa_qr_no_websites_global];
    create_qr_b($(one_oa),one_oa.title,canvas_size_websites_global,'black','white',false,'canvas');
    oa_qr_no_websites_global=oa_qr_no_websites_global+1;
    return true;
}

function icon_klwebsites_b(cshref,isremote=false){
    if (isremote){
        var blsrc=href2host_b(cshref,true)+'/favicon.ico'
    }
    else {
        var blsrc='data/website_ico/'+href2host_b(cshref,false)+'.ico'
    }
    return '<img alt="" src="'+blsrc+'" style="max-width:1rem;max-height:1rem;border-radius:1rem;" />';   //alt可以隐藏无图片的网站，title不行 - 保留注释
}
