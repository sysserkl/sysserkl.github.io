function load_data_digest(){
    cskeys=href_split_b(location.href);
    csbookname_global='';
    kltxt_menulist_index_global=[];
    en_words_temp_important_global=[];
    digest_statistics_sort_asc_dec_global=false;
    booklist_source_config_b(true);
    import_book_kltxt_b(cskeys);
}

function date_size_digest(without_digest=false,sortno=0){    
    if (without_digest){
        var csarray=without_digest_book_list_global;
    } else {
        var csarray=csbooklist_sub_global;
    }

    var result_t=[];
    
    for (let abook of csarray){
        var bldate='';
        var blsize=-1;
        for (let adigest of digest_list_source_global){
            if (abook[0]==adigest[0]){
                bldate=adigest[2];
                blsize=adigest[3];
                break;
            }
        }
        result_t.push(abook.concat([bldate,blsize]));
    }
    
    if (sortno==1 || sortno==2){
        result_t.sort(function (a,b){return zh_sort_b(a,b,digest_statistics_sort_asc_dec_global,sortno);});    
    } else {
        if (digest_statistics_sort_asc_dec_global){
            result_t.sort(function (a,b){return a[sortno]<b[sortno] ? 1 : -1});
        } else {
            result_t.sort(function (a,b){return a[sortno]>b[sortno] ? 1 : -1});    
        }
    }
    
    digest_statistics_sort_asc_dec_global=!digest_statistics_sort_asc_dec_global;
    
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        var arow='<td>'+(blxl+1)+'</td>';
        for (let col_no=0,lenb=result_t[blxl].length;col_no<lenb;col_no++){
            if (col_no<result_t[blxl].length-1){
                arow=arow+'<td>'+result_t[blxl][col_no]+'</td>';
            } else {
                arow=arow+'<td align=right>'+result_t[blxl][col_no]+'</td>';            
            }
        }
        result_t[blxl]='<tr>'+arow+'</tr>';
    }
    
    var arow='';
    var th_list=['no','id','name','tag','jsdoc','type','date','size'];
    for (let blxl=0,lent=th_list.length;blxl<lent;blxl++){
        arow=arow+'<th style="cursor:pointer;" onclick="date_size_digest('+without_digest+','+(blxl-1)+');">'+th_list[blxl]+'</th>';
    }
    result_t=['<tr>'+arow+'</tr>'].concat(result_t);    
        
    var bljg='<table class="table_common" id="table_statistics_digest" cellpadding=0 cellspacing=0>'+result_t.join('\n')+'</table>';
    
    var buttons='<input type="text" id="input_statistics_digest" onkeyup="if (event.key==\'Enter\'){tr_filter_digest(this.value);}" placeholder="filter" /> ';
    buttons=buttons+close_button_b('divhtml2','')+' ';
    
    var odiv=document.getElementById('divhtml2');
    odiv.innerHTML='<div style="margin:0.5rem;">'+bljg+'<p>'+buttons+'</p></div>';
    input_with_x_b('input_statistics_digest',11);    
    odiv.scrollIntoView();
}

function tr_filter_digest(cskey){    
    var otrs=document.querySelectorAll('#table_statistics_digest tr');
    obj_search_show_hide_b(otrs,'',cskey,false,true,false);

    for (let one_tr of otrs){
        if (one_tr.querySelector('th')){
            one_tr.style.display='';
        }
    }
}
