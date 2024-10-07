function menu_more_cnbond(){
    var str_t=klmenu_hide_b('');
    table_th_jscm_global={'日期':'','3月':'right','6月':'right','1年':'right','2年':'right','3年':'right','5年':'right','7年':'right','10年':'right','30年':'right'};
    
    var klmenu1=[
    '<a href="https://yield.chinabond.com.cn/cbweb-czb-web/czb/showHistory?locale=cn_ZH&nameType=1" target=_blank>财政部中国国债收益率曲线</a>',
    '<span class="span_menu" onclick="'+str_t+'cols_select_cnbond();">当前结果指定列数据提取</span>',   
    '<span class="span_menu" onclick="'+str_t+'multi_year_compare_cnbond();">当前结果多年同日比较</span>',       
    '<span class="span_menu">legend: <input type="text" id="input_legend_jsad_cnbond" value="nw" size="3" /> ymd: <input type="text" id="input_ymd_jsad_cnbond" value="m" size="2" /></span>',
    '<span class="span_menu" onclick="'+str_t+'date_check_cnbond();">缺失日期检查</span>',       
    ];

    return klmenu_b(klmenu1,'💵','16rem','1rem','1rem','30rem');
}

function date_check_cnbond(){
    var list_t=array_split_by_col_b(cnbond_global,[0,1]);
    var date_t=[];
    var error_date=[];
    for (let item of list_t){
        var blvalue=validdate_b(item[0]);
        if (blvalue===false){
            error_date.push(item[0]);
        } else {
            date_t.push([blvalue,item[1]]);
        }
    }
    
    var inserted_t=date_list_insert_zero_b(date_t,false,false,[],[],0,true)[1];
    var not67=[];
    for (let item of inserted_t){
        if ([6,0].includes(item.getDay())){continue;}
        not67.push(date2str_b('-',item));
    }
    
    var bljg='<p>缺失天数：'+inserted_t.length+'，其中非周六周日：</p>';
    document.getElementById('divhtml').innerHTML=bljg+'<div style="column-count:'+(ismobile_b()?3:6)+';">'+array_2_li_b(not67)+'</div>';
}

function file_load_cnbond(){
    flot_load_common(['date','flot'],['time','symbol']);
}

function cols_select_cnbond(){
    var col_name=prompt('输入要提取的列名，（如日期 10年）：');
    if (col_name==null){return;}

    var isreg=klmenu_check_b('span_reg_common',false);
    [col_name,isreg]=str_reg_check_b(col_name,isreg,true);    
    
    var key_list=Object.keys(table_th_jscm_global);
    var result_t=common_search_b(col_name,isreg,key_list)[0];
    //result_t 每个元素形如：[ "日期", 1 ] 或 [ "10年", 9 ] - 保留注释
    var name_list=[];
    var flot_dict={};
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        name_list.push('"'+result_t[blxl][0]+'"');
        flot_dict['c'+(result_t[blxl][1]-1)]=[result_t[blxl][0]];
        result_t[blxl]=result_t[blxl][1]-1;
    }
    
    var bljg=['['+name_list+'],'];
    for (let arow of js_data_current_common_search_global){
        var one_tr=[];
        for (blxl=0,lent=arow[0].length;blxl<lent;blxl++){
            if (result_t.includes(blxl)){
                if (isNaN(arow[0][blxl])){
                    one_tr.push('"'+arow[0][blxl]+'"');
                } else {
                    one_tr.push(arow[0][blxl]);
                    flot_dict['c'+blxl].push([new Date(arow[0][0]),parseFloat(arow[0][blxl])]); 
                }
            }
        }
        bljg.push('['+one_tr+'],');
    }
    
    var odiv=document.getElementById('div_status_common');
    var blbutton=close_button_b('div_status_common','','aclick');
    var flot_dom='<div id="div_status_common_sub" style="width:100%; height:600px;"></div>';
    odiv.innerHTML='<textarea>'+bljg.join('\n')+'</textarea>'+flot_dom+'<p>'+blbutton+'</p>';
    odiv.scrollIntoView();
    
    delete flot_dict['c0'];
    
    var list_t=Object.values(flot_dict);
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        list_t[blxl][0]=list_t[blxl][0]+'#points:false#';
    }
    flot_lines_b(list_t,'div_status_common_sub',document.getElementById('input_legend_jsad_cnbond').value,true,'',document.getElementById('input_ymd_jsad_cnbond').value,'',2);
}

function col_rearrange_cnbond(){    
    var list_t=[];
    for (let arow of js_data_current_common_search_global){
        new_row=[arow[0][0]];
        for (let blxl=1,lent=arow[0].length;blxl<lent;blxl++){
            new_row.push(arow[0][blxl].toFixed(2));
        }
        list_t.push([new_row,arow[1]]);
    }
    return list_t;
}

function multi_year_compare_cnbond(){
    var col_names=Object.keys(table_th_jscm_global);
    var type_dict={};
    for (let item of col_names){
        type_dict['t_'+item]={};
    }
    
    for (let item of js_data_current_common_search_global){
        var bldate=item[0][0];
        var blyear=bldate.substring(0,4)+'年';
        
        for (let blxl=1,lent=item[0].length;blxl<lent;blxl++){
            if (type_dict['t_'+col_names[blxl]][blyear]==undefined){
                type_dict['t_'+col_names[blxl]][blyear]=[];
            }
            
            type_dict['t_'+col_names[blxl]][blyear].push([new Date('2000'+bldate.substring(4,)),parseFloat(item[0][blxl])]);
        }
    }
    
    var odiv=document.getElementById('div_status_common');
    var blbutton=close_button_b('div_status_common','','aclick');
    var flot_dom=[];
    for (let blxl=1,lent=col_names.length;blxl<lent;blxl++){
        flot_dom.push('<div>');
        flot_dom.push('<h4>'+col_names[blxl]+'期中国国债收益率</h4>');    
        flot_dom.push('<div id="div_status_common_sub_'+blxl+'" style="width:100%; height:600px;"></div>');
        flot_dom.push('</div>');        
    }
    odiv.innerHTML=flot_dom.join('\n')+'<p>'+blbutton+'</p>';
    odiv.scrollIntoView();
    
    var legend=document.getElementById('input_legend_jsad_cnbond').value;
    var ymd=document.getElementById('input_ymd_jsad_cnbond').value;

    for (let blxl=1,lent=col_names.length;blxl<lent;blxl++){
        var list_t=type_dict['t_'+col_names[blxl]];
        list_t=object2array_b(list_t,true);
        for (let blno=0,lenb=list_t.length;blno<lenb;blno++){
            list_t[blno][0]=list_t[blno][0]+'#points:false#';
        }
        flot_lines_b(list_t,'div_status_common_sub_'+blxl,legend,true,'',ymd,'',2);
    }
}
