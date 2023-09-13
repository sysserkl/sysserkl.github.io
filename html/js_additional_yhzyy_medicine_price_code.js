function menu_more_yhzyy_medicine_price(){
    var str_t=klmenu_hide_b('');
    
    table_th_jscm_global={'药品名称':'','产地':'','规格':'right','单价':'right'};
    var col_name_list=Object.keys(table_th_jscm_global);
    for (let blxl=0;blxl<col_name_list.length;blxl++){
        col_name_list[blxl]='<option value="'+blxl+'">'+col_name_list[blxl]+'</option>';
    }
    
    var blparent=menu_parent_node_b(str_t);
    var klmenu1=[
    '<span class="span_menu"><select id="select_sort_type_jsad_yzmp" style="height:2rem;">'+col_name_list.join('')+'</select> <span class="aclick" onclick="'+blparent+'sort_yhzyy_medicine_price();">↑</span><span class="aclick" onclick="'+blparent+'sort_yhzyy_medicine_price(true);">↓</span></span>',

    '<span class="span_menu" onclick="'+str_t+'statistics_supplier_yhzyy_medicine_price();">当前条件产地统计</span>',   
    ];
    return klmenu_b(klmenu1,'🏥','16rem','1rem','1rem','30rem');
}

function sort_yhzyy_medicine_price(csdesc=false){
    var blno=parseInt(document.getElementById('select_sort_type_jsad_yzmp').value);
    if (blno!==3){
        yhzyy_medicine_price_global.sort(function (a,b){return zh_sort_b(a,b,csdesc,blno)});
    }
    else {
        if (csdesc){
            yhzyy_medicine_price_global.sort(function (a,b){return a[3]<b[3];});        
        }
        else {
            yhzyy_medicine_price_global.sort(function (a,b){return a[3]>b[3];});                
        }
    }
}

function statistics_supplier_yhzyy_medicine_price(){
    var supplier_dict={};
    for (let arow of js_data_current_common_search_global){
        var blkey='s_'+arow[0][1];
        if (supplier_dict[blkey]==undefined){
            supplier_dict[blkey]=[arow[0][1],[]];
        }
        supplier_dict[blkey][1].push('<td>'+arow[0][0]+'</td><td align="right">'+arow[0][2]+'<td align="right">'+arow[0][3]+'</td>');
    }
    
    for (let akey in supplier_dict){
        for (let blxl=0;blxl<supplier_dict[akey][1].length;blxl++){
            supplier_dict[akey][1][blxl]='<tr><td>'+(blxl+1)+'</td>'+supplier_dict[akey][1][blxl]+'</tr>';
        }
    }
    
    supplier_dict=object2array_b(supplier_dict);
    supplier_dict.sort(function (a,b){return zh_sort_b(a,b,false,0)});    
    supplier_dict.sort(function (a,b){return a[1].length<b[1].length;});
    
    var th_str='<tr><th>'+['序号','药品名称','规格','单价'].join('</th><th>')+'</th></tr>';
    var blbutton='<p><span class="aclick" onclick="expand_yhzyy_medicine_price(this);">展开</span></p>';
    var current_len=js_data_current_common_search_global.length;
    var raw_len=yhzyy_medicine_price_global.length;
    
    for (let blxl=0;blxl<supplier_dict.length;blxl++){
        var bllen=supplier_dict[blxl][1].length;
        if (current_len==raw_len){
            var blpercent=' ('+bllen+'/'+(bllen*100/raw_len).toFixed(2)+'%)';
        }
        else {
            var blpercent=' ('+bllen+'/'+(bllen*100/current_len).toFixed(2)+'%/'+(bllen*100/raw_len).toFixed(2)+'%)';
        }
        var supplier_str='<tr><th class="th_supplier_jsad_yzmp" colspan=4>'+(blxl+1)+'. '+supplier_dict[blxl][0]+blpercent+'</th></tr>';
        supplier_dict[blxl]='<table class="table_common">'+supplier_str+th_str+supplier_dict[blxl][1].join('')+'</table>';
        if (bllen>100){
            supplier_dict[blxl]='<div><div class="div_height_limited_jsad_yzmp" style="max-height:40rem; overflow:hidden;">'+supplier_dict[blxl]+'</div>'+blbutton+'</div>';
        }        
    }
    document.getElementById('divhtml').innerHTML='<div style="column-count:'+(ismobile_b()?1:3)+';">'+supplier_dict.join('\n')+'</div>';
}

function expand_yhzyy_medicine_price(ospan){
    var odiv=ospan.parentNode.parentNode;
    var sub_div=odiv.querySelector('div.div_height_limited_jsad_yzmp');
    if (!sub_div){return;}
    if (sub_div.style.maxHeight==''){
        sub_div.style.maxHeight='40rem';
        ospan.innerText='展开';
    }
    else {
        sub_div.style.maxHeight='';
        ospan.innerText='折叠';        
    }
    ospan.scrollIntoView();
}


