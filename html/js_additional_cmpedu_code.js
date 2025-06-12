function menu_more_cmpedu(){
    var str_t=klmenu_hide_b('');
    table_th_jscm_global={'id':'','content':''};
    
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'empty_ids_cmpedu();">全部无内容id</span>',
    ];

    return klmenu_b(klmenu1,'🪛','12rem','1rem','1rem','30rem');
}

function empty_ids_cmpedu(){
    var result_t=[];
    var blid,blurl,bllink;
    for (let arow of cmpedu_global){        
        if (arow[1]==''){
            [blid,blurl,bllink]=id2http_cmpedu(arow[0]);
            result_t.push([parseInt(blid),blurl,bllink]);
        }
    }
    
    result_t.sort(function(a,b){return a[0]<b[0]?-1:1;});
    
    var links_t=array_split_by_col_b(result_t,[2]);
    var textarea_t=array_split_by_col_b(result_t,[1]);
    
    var blclose='<p>'+close_button_b('div_status_common','')+'</p>';
    var odiv=document.getElementById('div_status_common');
    odiv.innerHTML='<div style="column-count:'+(ismobile_b()?5:8)+';">'+array_2_li_b(links_t)+'</div>'+'<textarea>'+textarea_t.join('\n')+'</textarea>'+blclose;
    odiv.scrollIntoView();
}

function id2http_cmpedu(csstr){
    var blreg1=/^{{(.+?)}}(.+)$/g;

    var blid=csstr.replace(blreg1,'$2');
    var blurl=csstr.replace(blreg1,'http://qr.cmpedu.com/CmpBookResource/$1_resource.do?id=$2');
    var bllink='<a href="'+blurl+'" target=_blank>'+blid+'</a>';
    return [blid,blurl,bllink];
}

function col_rearrange_cmpedu(){
    var list_t=[];
    
    for (let arow of js_data_current_common_search_global){        
        var new_row=[].concat(arow[0]);

        if (new_row[1]==''){continue;}
        new_row[0]=id2http_cmpedu(new_row[0])[2];
        
        new_row[1]=new_row[1].replace(/{{qrcloud}}/g,'https://qrcloud.cmpkgs.com/');
        new_row[1]=new_row[1].replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target=_blank>$1</a>');
        new_row[1]=array_2_li_b(new_row[1].split(/ \/\/\/ /),'li','ul');
        list_t.push([new_row,arow[1]]);
    }
    return list_t;
}
