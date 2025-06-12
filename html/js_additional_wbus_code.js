function data_load_wbus(array_name){
    var result_t=[];
    for (let adata of eval(array_name)){
        adata[1]='<!--'+specialstr_lt_gt_j(adata[1])+'--><a class="a_user_wbus" href="https://weibo.com/u/'+adata[0]+'" target=_blank>'+adata[1]+'</a>';
        result_t.push(adata.slice(1,));
    }
    eval(array_name+'=result_t');
    sort_wbus(true,2);
}

function style_load_wbus(){
    var blstr='a.a_user_wbus:visited {color:'+scheme_global['memo']+';}';
    style_generate_b(blstr,true);
}

function col_rearrange_wbus(){
    var result_t=[];
    for (let item of js_data_current_common_search_global){
        var list_t=[].concat(item[0]);
        for (let blxl=1;blxl<5;blxl++){
            list_t[blxl]='<small>'+list_t[blxl]+'</small>';
        }
        result_t.push([list_t,item[1]]);
    }
    return result_t;
}

function menu_more_wbus(){
    var str_t=klmenu_hide_b('');

    table_th_jscm_global={'name':'','follower':'right','tweet1':'','tweet2':'','tweet3':''};
    
    var col_name_list=Object.keys(table_th_jscm_global);    
    var klmenu1=[    
    klmenu_select_sort_b('select_sort_type_jsad_wbus',col_name_list,str_t,'sort_wbus'),
    '<span class="span_menu" onclick="'+str_t+'search_common(\'^[0-9]{1,4}$\');">小众</span>',    
    '<span class="span_menu" onclick="'+str_t+'statistus_follower_wbus();">当前条件follower累计数</span>',    
    '<span class="span_menu" onclick="'+str_t+'jieba_keys_wbus();">当前条件（2000条以内）热词</span>',    
    ];
    return klmenu_b(klmenu1,'🐦','16rem','1rem','1rem','30rem');
}

function sort_wbus(is_desc=false,rank_no=false){
    if (rank_no===false){
        rank_no=parseInt(document.getElementById('select_sort_type_jsad_wbus').value);
    }
        
    if (rank_no!==0){
        if (is_desc){
            wbus_global.sort(function (a,b){return a[rank_no]<b[rank_no] ? 1 : -1;});
        } else {
            wbus_global.sort(function (a,b){return a[rank_no]>b[rank_no] ? 1 : -1;});    
        }
    } else {
        wbus_global.sort(function (a,b){return zh_sort_b(a[rank_no].slice(4,),b[rank_no].slice(4,),is_desc);});
    }
}

function file_load_wbus(){
    flot_load_common(['flot','en_de_str'],['time','symbol'],[],['jieba_pb_dict_data.js']);
}

function jieba_keys_wbus(){
    var list_t=[];
    var lent=Math.min(2000,js_data_current_common_search_global.length);
    for (let blxl=0;blxl<lent;blxl++){
        list_t.push(js_data_current_common_search_global[blxl][0].slice(-3,));
    }
    
    var blstr=list_t.toString();
    var arr_t = count_words_b(blstr,split_words_b(blstr,true),2);
    arr_t=arr_t.slice(0,200);
    
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML = '<textarea>'+arr_t+'</textarea>';
}

function statistus_follower_wbus(){
    var result_t={};
    for (let item of js_data_current_common_search_global){
        var blvalue=(item[0][1].match(/<small>(.*)<\/small>/) || [false,false])[1];
        if (blvalue===false){continue;}
        blvalue=Math.floor(blvalue/10000);
        if (result_t['f_'+blvalue]==undefined){
            result_t['f_'+blvalue]=0;
        }
        result_t['f_'+blvalue]=result_t['f_'+blvalue]+1;
    }
    result_t=object2array_b(result_t,true,2);
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl][0]=parseInt(result_t[blxl][0]);
    }
    result_t.sort(function (a,b){return a[0]<b[0]?-1:1;});  //由少到多 - 保留注释
    
    var blsum=0;
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        blsum=blsum+result_t[blxl][1];
        result_t[blxl][1]=blsum;
    }

    var odiv=document.getElementById('div_status_common');
    var blbutton=close_button_b('div_status_common','','aclick');
    var flot_dom='<div id="div_status_common_sub" style="width:100%; height:600px;"></div>';
    odiv.innerHTML=flot_dom+'<p>'+blbutton+'</p>';
    odiv.scrollIntoView();
    flot_lines_b([['微博follower人数每万人累计（x轴单位为万人，小于1万人归为0；y轴单位为个账号）#points:false#'].concat(result_t)],'div_status_common_sub','se',false);
}
