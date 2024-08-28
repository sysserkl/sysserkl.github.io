function menu_more_hospital_medicine_price(){
    var str_t=klmenu_hide_b('');
    
    switch (title_name_jscm_global){
        case 'yhzyy medicine price':
            table_th_jscm_global={'药品名称':'','产地':'','规格':'right','单价':'right'};
            break;
        case 'yhrmyy medicine price':
            table_th_jscm_global={'药品名称':'','规格':'','单位':'','产地':'','单价':'right','类别':''};
            break;
        default:
            table_th_jscm_global={};
    }
    
    var col_name_list=Object.keys(table_th_jscm_global);    
    var klmenu1=[
    klmenu_select_sort_b('select_sort_type_jsad_yzmp',col_name_list,str_t,'sort_hospital_medicine_price'),
    '<span class="span_menu" onclick="'+str_t+'statistics_supplier_hospital_medicine_price();">当前条件产地统计</span>',   
    '<span class="span_menu" onclick="'+str_t+'fraction_hospital_medicine_price();">当前条件单价小数点设置</span>',   

    ];
    return klmenu_b(klmenu1,'🏥','16rem','1rem','1rem','30rem');
}

function fraction_hospital_medicine_price(){
    var bllen=prompt('输入小数点后数字保留位数','2');
    if (bllen==null){return;}
    bllen=parseInt(bllen.trim());
    if (isNaN(bllen)){return;}
    if (bllen<0 || bllen>20){return;}
    
    switch (title_name_jscm_global){
        case 'yhzyy medicine price':
            for (let blxl=0,lent=js_data_current_common_search_global.length;blxl<lent;blxl++){
                var item=js_data_current_common_search_global[blxl][0];
                if (typeof item[3] == 'string'){break;}
                js_data_current_common_search_global[blxl][0]=[item[0],item[1],item[2],item[3].toFixed(bllen)];
            }
            break;
        case 'yhrmyy medicine price':
            for (let blxl=0,lent=js_data_current_common_search_global.length;blxl<lent;blxl++){
                var item=js_data_current_common_search_global[blxl][0];
                if (typeof item[4] == 'string'){break;}                
                js_data_current_common_search_global[blxl][0]=[item[0],item[1],item[2],item[3],item[4].toFixed(bllen),item[5]];
            }            
            break;
    }

    page_common(1);
}

function sort_hospital_medicine_price(csdesc=false){
    switch (title_name_jscm_global){
        case 'yhzyy medicine price':
            var col_num_no=3;
            break;
        case 'yhrmyy medicine price':
            var col_num_no=4;        
            break;
        default:
            return;
    }
    
    var csarray=eval(var_name_jscm_global);
    var blno=parseInt(document.getElementById('select_sort_type_jsad_yzmp').value);
    if (blno!==col_num_no){
        csarray.sort(function (a,b){return zh_sort_b(a,b,csdesc,blno)});
    } else {
        if (csdesc){
            csarray.sort(function (a,b){return a[col_num_no]<b[col_num_no] ? 1 : -1;});        
        } else {
            csarray.sort(function (a,b){return a[col_num_no]>b[col_num_no] ? 1 : -1;});                
        }
    }
    search_common();
}

function statistics_supplier_hospital_medicine_price(){
    function sub_statistics_supplier_hospital_medicine_price_init(arow){
        var blkey='s_'+arow[0][supplier_col_no];
        if (supplier_dict[blkey]==undefined){
            supplier_dict[blkey]=[arow[0][supplier_col_no],[]];
        }    
        return blkey;
    }
    //-----------------------
    var supplier_dict={};
    
    switch (title_name_jscm_global){
        case 'yhzyy medicine price':
            var supplier_col_no=1;
            
            for (let arow of js_data_current_common_search_global){
                var blkey=sub_statistics_supplier_hospital_medicine_price_init(arow);
                supplier_dict[blkey][1].push('<td>'+arow[0][0]+'</td><td align="right">'+arow[0][2]+'</td><td align="right">'+arow[0][3]+'</td>');
            }
            var th_str='<tr><th>'+['序号','药品名称','规格','单价'].join('</th><th>')+'</th></tr>';
            
            break;
        case 'yhrmyy medicine price':
            var supplier_col_no=3;
            
            for (let arow of js_data_current_common_search_global){
                var blkey=sub_statistics_supplier_hospital_medicine_price_init(arow);
                supplier_dict[blkey][1].push('<td>'+arow[0][0]+'</td><td>'+arow[0][1]+'</td><td>'+arow[0][2]+'</td><td>'+arow[0][4]+'</td><td>'+arow[0][5]+'</td>');
            }
            
            var th_str='<tr><th>'+['序号','药品名称','规格','单位','单价','类别'].join('</th><th>')+'</th></tr>';
                        
            break;
        default:
            return;
    }
        
    for (let akey in supplier_dict){
        for (let blxl=0,lent=supplier_dict[akey][1].length;blxl<lent;blxl++){
            supplier_dict[akey][1][blxl]='<tr><td>'+(blxl+1)+'</td>'+supplier_dict[akey][1][blxl]+'</tr>';
        }
    }
    
    supplier_dict=object2array_b(supplier_dict);
    supplier_dict.sort(function (a,b){return zh_sort_b(a,b,false,0)});    
    supplier_dict.sort(function (a,b){return a[1].length<b[1].length ? 1 : -1;});
    
    var blbutton='<p><span class="aclick" onclick="expand_hospital_medicine_price(this);">展开</span></p>';

    var current_len=js_data_current_common_search_global.length;
    
    var csarray=eval(var_name_jscm_global);    
    var raw_len=csarray.length;
    
    for (let blxl=0,lent=supplier_dict.length;blxl<lent;blxl++){
        var bllen=supplier_dict[blxl][1].length;
        if (current_len==raw_len){
            var blpercent=' ('+bllen+'/'+(bllen*100/raw_len).toFixed(2)+'%)';
        } else {
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

function expand_hospital_medicine_price(ospan){
    var odiv=ospan.parentNode.parentNode;
    var sub_div=odiv.querySelector('div.div_height_limited_jsad_yzmp');
    if (!sub_div){return;}
    if (sub_div.style.maxHeight==''){
        sub_div.style.maxHeight='40rem';
        ospan.innerText='展开';
    } else {
        sub_div.style.maxHeight='';
        ospan.innerText='折叠';        
    }
    ospan.scrollIntoView();
}


