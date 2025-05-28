function merge_rows_2_one_column_arr_analyze(){
    var interval_str=delimiter_get_arr_analyze();
    var cols=document.getElementById('input_row_count').value;
    var otextarea=document.getElementById('textarea_arrays');
    var list_t=otextarea.value.trim().split('\n');
    var bljg=[];
    var arow=[];
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        if (blxl%cols==0){
            if (arow.length>0){
                bljg.push(arow.join(interval_str));
                arow=[];
            }
        }
        arow.push(list_t[blxl]);
    }
    if (arow.length>0){
        bljg.push(arow.join(interval_str));        
    }
    otextarea.value=bljg.join('\n');
}

function list_arr_analyze(csarray=false){
	var bljg=[];
    var delimiter=delimiter_get_arr_analyze();
    
    if (csarray==false){
        csarray=table_array_global;
    }
    
	for (let arow of csarray){
        var row_str=[];
        if (Array.isArray(arow)){
            for (let acol of arow){
                if (typeof acol=='string'){
                    row_str.push(acol);
                } else {
                    row_str.push(acol?.toString()||'undefined');
                }
            }
        } else {
            row_str=[arow];
        }
        bljg.push(row_str.join(delimiter));
	}
	document.getElementById('textarea_arrays').value=bljg.join('\n');
}

function rename_col_analyze(csno){
    var otable=document.getElementById('table_arrays');
    var oths=otable.querySelectorAll('th button');
    if (csno>=0 && csno<oths.length){
        var blstr=oths[csno].innerText;
        var new_name=(prompt('输入新名称',blstr) || '').trim();
        if (new_name=='' || new_name==blstr){return;}
        oths[csno].innerText=new_name;
    }
}

function sort_arr_analyze(cstype,cskey){
	if (table_array_global.length<2){return;}
    
	if (Array.isArray(table_array_global[1])){
		if (cskey>table_array_global[1].length-1){return;}
		
		if (isNaN(table_array_global[1][cskey]) || table_array_global[1][cskey]=='' && table_array_global[1][cskey]!==0){
			if (cstype==1){
				table_array_global.sort(function(a,b){return zh_sort_b(a,b,true,cskey);});
			} else {
				table_array_global.sort(function(a,b){return zh_sort_b(a,b,false,cskey);});
			}
		} else {
			if (cstype==1){
				table_array_global.sort(function(a,b){return b[cskey]>a[cskey] ? 1 : -1;});
			} else {
				table_array_global.sort(function(a,b){return a[cskey]>b[cskey] ? 1 : -1;});
			}
		}
	} else {
		if (cskey>0){return;}
        
		if (isNaN(table_array_global[1]) || table_array_global[1]=='' && table_array_global[1]!==0){
			if (cstype==1){
				table_array_global.sort(function(a,b){return zh_sort_b(a,b,true);});
			} else {
				table_array_global.sort(function(a,b){return zh_sort_b(a,b,false);});
			}
		} else {
			if (cstype==1){
				table_array_global.sort(function(a,b){return b>a ? 1 : -1;});
			} else {
				table_array_global.sort(function(a,b){return a>b ? 1 : -1;});
			}
		}
	}
}

function str_filter_arr_analyze(){
	var cskeys=document.getElementById('input_filter').value.split(',');
	var csreg=document.getElementById('input_reg').checked;
	var newarr=[];
	for (let item of table_array_global){
		var blfound=str_reg_search_b(item,cskeys,csreg);
		if (blfound==-1){return;}
		if (blfound){
			newarr.push(item);
		}
	}
    list_arr_analyze(newarr);
}

function column2number_arr_analyze(cstype){
    function sub_column2number_arr_analyze_parse(csvalue,cstype){
        switch(cstype){
            case 'int':
                return parseInt(csvalue);
                break;
            case 'float':
                return parseFloat(csvalue);
                break;
            case 'fraction':
                return csvalue.toFixed(bllen);
                break;
            default:
                return csvalue;
                break;
        }
    }
    //---
    var cskey=Math.max(0,parseInt(document.getElementById('input_column1').value)-1);
    var bllen=parseInt(document.getElementById('input_fraction_length').value.trim());

    for (let blxl=0,lent=table_array_global.length;blxl<lent;blxl++){
        if (Array.isArray(table_array_global[blxl])==false){
            table_array_global[blxl]=sub_column2number_arr_analyze_parse(table_array_global[blxl],cstype);            
        } else {
            if (cskey>table_array_global[blxl].length-1){continue;}
                table_array_global[blxl][cskey]=sub_column2number_arr_analyze_parse(table_array_global[blxl][cskey],cstype);     
        }
    }
    list_arr_analyze();
}

function flot_lines_data_arr_analyze(){
    var cskey=Math.max(0,parseInt(document.getElementById('input_column1').value)-1);
    if (isNaN(cskey)){
        cskey=0;
    }
    var list_t={};
    for (let item of table_array_global){
        if (Array.isArray(item)==false){continue;}
        if (item.length<cskey){continue;}
        
        var str_t=item[cskey].toString();
        if (list_t['f_'+str_t]==undefined){
            list_t['f_'+str_t]=[str_t];
        }
        
        var temp_t=item.slice(0,cskey);
        for (let bly=cskey+1,lent=item.length;bly<lent;bly++){
            temp_t.push(item[bly]);
        }
        list_t['f_'+str_t].push(temp_t);
    }
    
    var flot_list=[document.getElementById('input_flot_legend_caption_aa').value,];
    for (let key in list_t){ //不能使用 of - 保留注释
        flot_list.push(list_t[key]);
    }
    list_arr_analyze();
    flot_lines_show_arr_analyze([flot_list]);
}

function lower_arr_analyze(){
	for (let blxl=0,lent=table_array_global.length;blxl<lent;blxl++){
		if (Array.isArray(table_array_global[blxl])){
			for (let bly=0,lenb=table_array_global[blxl].length;bly<lenb;bly++){
				if (isNaN(table_array_global[blxl][bly])){
					table_array_global[blxl][bly]=table_array_global[blxl][bly].toLowerCase();
				}
			}
		} else {
			if (isNaN(table_array_global[blxl])){
				table_array_global[blxl].toLowerCase();
			}
		}
	}
	list_arr_analyze();
}

function column_filter_arr_analyze(cssplit=false,do_update=true){
    if (cssplit===false){
	    var no_t=document.getElementById('input_column1').value.split(',');
    } else {
        var no_t=cssplit;
    }
	var nolist_t=[];
    var include_no=[];
    var exclude_no=[];
	for (let item of no_t){
		var left0_t=item.substring(0,1);
		if (left0_t=='+'){
            include_no.push(parseInt(item.substring(1,))-1);
        } else if (left0_t=='-'){
			exclude_no.push(parseInt(item.substring(1,))-1);
		}
	}
    
    console.log('include_no:',include_no,'exclude_no:',exclude_no);
	var list_t=[];
	for (let item_t of table_array_global){
		if (Array.isArray(item_t)){
			var tmp_t=[];
			for (let bly=0,lent=item_t.length;bly<lent;bly++){
                if (exclude_no.length==0){
                    var is_include=false; //当只有 + 项时，默认删除 - 保留注释
                } else {
                    var is_include=true;
                }
                if (include_no.length>0){
                    if (include_no.includes(bly)){
                        is_include=true;
                    }
                }
                if (exclude_no.length>0){
                    if (exclude_no.includes(bly)){
                        is_include=false;
                    }
                }
                if (is_include){
                    tmp_t.push(item_t[bly]);
                }
			}
			if (tmp_t!==[]){
				if (tmp_t.length==1){
					list_t.push(tmp_t[0]);
				} else {
					list_t.push(tmp_t);
				}
			}
		} else {
			list_t.push(item_t);
		}
	}
    
    if (do_update){
        table_array_global=[];
        for (let item of list_t){
            table_array_global.push(item);
        }
        list_arr_analyze();
    }
    return list_t;
}

function var_arr_analyze(csarray=false,show_html=true){
    function sub_var_arr_analyze_row_not_array(csrow){
        var bljg='';
        if (csrow=='' || typeof csrow == 'string'){
            bljg=bljg+'"'+specialstr_j(csrow)+'",';
        } else if (typeof csrow == 'undefined'){
            bljg=bljg+'undefined,';
        } else if (typeof csrow !== 'number'){
            bljg=bljg+'"'+specialstr_j(csrow.toString())+'",';
        } else {
            bljg=bljg+csrow+',';
        }
        return bljg;
    }
    //递归函数 - 保留注释
    function sub_var_arr_analyze_row_array(csrow){
        var bljg='';
        bljg=bljg+'[';
        for (let item of csrow){
            if (Array.isArray(item)){
                bljg=bljg+sub_var_arr_analyze_row_array(item);
            } else {
                bljg=bljg+sub_var_arr_analyze_row_not_array(item);
            }
        }
        bljg=bljg+'],';
        return bljg;
    }
    //-----------------------
	var bljg='';
    if (csarray===false){
        csarray=table_array_global;
    }
	for (let blrow of csarray){
        if (blrow == undefined){continue;}
        
		if (Array.isArray(blrow)){
			bljg=bljg+sub_var_arr_analyze_row_array(blrow);
		} else {
            bljg=bljg+sub_var_arr_analyze_row_not_array(blrow);
		}
        bljg=bljg+'\n';
	}
    
    bljg='var table_array_global=[\n'+bljg+'];\n';
    if (show_html){
	    document.getElementById('textarea_arrays').value=bljg;
	    document.getElementById('span_length').innerHTML=table_array_global.length;
    }
    return bljg;
}

function group_sum_arr_analyze(){
	var group_no=Math.max(0,parseInt(document.getElementById('input_column1').value)-1);
	var sum_no=Math.max(0,parseInt(document.getElementById('input_column2').value)-1);

	var result_t=row_count_or_sum_arr_analyze(group_no,sum_no,false);

    var delimiter=delimiter_get_arr_analyze();
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        result_t[blxl]=result_t[blxl][0]+delimiter+result_t[blxl][1];
    }
            
    document.getElementById('divhtml').innerHTML=array_2_li_b(result_t);
}

function row_count_or_sum_arr_analyze(group_no,sum_col_no=-1,add_detail=true){
	var list_t=[];
	for (let item_t of table_array_global){
		if (typeof item_t=='string'){
			if (group_no!==0){continue;}
            
            var key_name='k_'+item_t;
			if (list_t[key_name]==undefined){
                list_t[key_name]=[item_t,0];
            }
            if (add_detail){
			    list_t[key_name].push(item_t);
            }
            list_t[key_name][1]=list_t[key_name][1]+1;  //每行非数组，则不考虑 sum，仅 count - 保留注释
		} else {
			if (group_no>item_t.length-1){continue;}
			
            var key_name='k_'+item_t[group_no];
			if (list_t[key_name]==undefined){
                list_t[key_name]=[item_t[group_no],0];
            }
            if (add_detail){
			    list_t[key_name].push(item_t);
            }
            if (sum_col_no==-1){
			    list_t[key_name][1]=list_t[key_name][1]+1;
            } else if (sum_col_no>=0 && sum_col_no<=item_t.length-1){
                list_t[key_name][1]=list_t[key_name][1]+parseFloat(item_t[sum_col_no]);
            }
		}
	}

    var list2_t=object2array_b(list_t);
    list2_t.sort(function (a,b){return zh_sort_b(a.toString(),b.toString());});
	list2_t.sort(function(a,b){return b[1]>a[1] ? 1 : -1;});
        
    return list2_t;
}

function group_arr_analyze(showlist){
	var no_t=Math.max(0,parseInt(document.getElementById('input_column1').value)-1);
	var list_t=row_count_or_sum_arr_analyze(no_t,-1);

	var bljg='';
    if (showlist){
        for (let item of list_t){
                bljg=bljg+'<h3>'+item[0]+' '+item[1]+'</h3>';
                bljg=bljg+'<p>';
                for (let bly=2,lent=item.length;bly<lent;bly++){
                    bljg=bljg+'<br />'+item[bly];
                }
                bljg=bljg+'</p>';
        }
    } else {
        var delimiter=delimiter_get_arr_analyze();
	    for (let item of list_t){
			bljg=bljg+'<br />'+item[0]+delimiter+item[1];
		}
	}
	document.getElementById('divhtml').innerHTML=bljg;
}

function time_value_cols_array_2_flot_lines_data_format_arr_analyze(){
    var col_list=document.getElementById('input_column1').value.trim().split(',');
    for (let blxl=0,lent=col_list.length;blxl<lent;blxl++){
        col_list[blxl]=parseInt(col_list[blxl])-1;
    }
    
    if (col_list.length!==2){return;}
    
    if (isNaN(col_list[0]) || isNaN(col_list[1])){return;}
    if (col_list[0]<0 || col_list[1]<0){return;}
    
    var result_t=[];
    for (let arow of table_array_global){
        if (arow.length>col_list[0] && arow.length>col_list[1]){
            result_t.push([arow[col_list[0]],arow[col_list[1]]]);
        }
    }
    var bljg=[];
    for (let arow of result_t){
        bljg.push('['+(!isNaN(arow[0])?arow[0]:'"'+arow[0]+'"')+','+arow[1]+']');
    }

    document.getElementById('divhtml').innerHTML='<textarea>'+'"XXX",'+bljg.join(', ')+'</textarea>';
}

function data_2_flot_arr_analyze(is_demo=false){
    function sub_data_2_flot_arr_analyze_row2arr(cslist){
        var row1=['Item'];
        var row2=[cslist[0]];
        for (blno=1,lent=cslist.length;blno<lent;blno++){
            if (Array.isArray(cslist[blno]) && cslist[blno].length==2){
                row1.push(cslist[blno][0]);
                row2.push(cslist[blno][1]);
            }
        }    
        return [row1,row2];    
    }

    function sub_data_2_flot_arr_analyze_str2date(cslist){
        for (blno=1,lent=cslist.length;blno<lent;blno++){
            if (Array.isArray(cslist[blno]) && cslist[blno].length==2){
                cslist[blno][0]=validdate_b(cslist[blno][0]);
            }
        }
        return cslist;
    }
    //-----------------------
    var otextarea=document.getElementById('textarea_arrays');
    var blvalue=otextarea.value;
    var bltype=document.getElementById('select_flot_aa').value;
    
    var blcontent='';
    if (is_demo){
        switch (bltype){
            case 'flot lines':    
                blcontent=`
//"成都#points:false#", [2012,300], [2014,400]
//"苏州#show:false#", [2012,500], [2014,600]
`;            
                break;
            case 'flot lines date':    
                blcontent=`
//"成都", ["2012-01-01",300], ["2014-05-01",400]
//"苏州", ["2012-01-01",500], ["2014-05-01",600]
`;            
                break;
            case 'pie':
                blcontent=`
//label: '男性', data: 30
//label: '女性', data: 40
`;
                break;       
            case 'two lines':
                blcontent=`
//"人数", "万人",[ 2021, 0 ], [ 2022, 60 ], [ 2023, 60 ]
//"金额", "亿元",[ 2021, 0 ], [ 2022, 0.1 ], [ 2023, 0.22 ]
`;
                break;            
            case 'two lines date':
                blcontent=`
//"《book》阅读行数", "行",[ "2021-10-02", 0 ], [ "2021-10-12", 60 ], [ "2021-10-22", 60 ]
//"《book》已读比例", "%",[ "2021-10-02", 0 ], [ "2021-10-12", 0.1 ], [ "2021-10-22", 0.22 ]
`;
                break;
        }
        
        if (blcontent=='' || blvalue.includes(blcontent)){return;}
        otextarea.value=blvalue+'\n'+blcontent;        
    } else {
        var list_t=blvalue.trim().split('\n');
        try {
            switch (bltype){
                case 'flot lines':
                case 'flot lines date':
                    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                        list_t[blxl]=eval('['+list_t[blxl]+']');
                        if (bltype=='flot lines date'){
                            list_t[blxl]=sub_data_2_flot_arr_analyze_str2date(list_t[blxl]);
                        }
                    }
                    
                    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){      
                        if (list_t[blxl].length>=2){
                            var value_list=list_t[blxl].slice(1,).sort(function (a,b){return a[0]>b[0]?-1:1;});
                            list_t[blxl]=[list_t[blxl][0]].concat(value_list);                        
                        }
                    }
                    
                    flot_lines_show_arr_analyze(list_t,(bltype=='flot lines date'));
                    break;
                case 'flot lines data format 2 array':
                    var result_t=[];
                    for (let item of list_t){
                        item=eval('['+item+']');
                        result_t=result_t.concat(sub_data_2_flot_arr_analyze_row2arr(item));
                    }
                    document.getElementById('divhtml').innerHTML='<textarea>'+result_t.join('\n')+'</textarea>';
                    break;
                case '根据指定两个列号（time value cols）转换数组为 flot lines data format':
                    time_value_cols_array_2_flot_lines_data_format_arr_analyze();
                    break;
                case 'pie':
                    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                        list_t[blxl]='{'+list_t[blxl]+'},'
                    }
                    list_t=eval('['+list_t.join('\n')+']');
                    document.getElementById('div_flot').style.display='';
                    flot_pie_b(list_t,'div_flot');
                    break;
                case 'two lines':
                case 'two lines date':
                    list_t=list_t.slice(0,2);
                    unit_list=[];
                    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                        list_t[blxl]=eval('['+list_t[blxl]+']');
                        if (list_t[blxl].length>=3){
                            unit_list.push(list_t[blxl][1]);
                            list_t[blxl].splice(1,1);
                        }
                        if (bltype=='two lines date'){
                            list_t[blxl]=sub_data_2_flot_arr_analyze_str2date(list_t[blxl]);
                        }
                    }
                    if (unit_list.length==2){
                        document.getElementById('div_flot').style.display='';
                        flot_two_lines_two_yaxis_b(list_t,'div_flot',unit_list[0],unit_list[1],document.getElementById('select_flot_legend_position_aa').value,(bltype=='two lines date'),document.getElementById('select_flot_date_type_aa').value,parseInt(document.getElementById('input_flot_y1_fraction_length').value),parseInt(document.getElementById('input_flot_y2_fraction_length').value));
                    }
                    break;                
            }
        } catch (error){
            alert(error);
        }           
    }
}

function code_lines_read_arr_analyze(){
    var list_t=read_txt_file_b('../../../../data/klwiki/dir_line_count.csv').split('\n');
    var result_t={};
    var total_dict={};
    table_array_global=[];
    for (let item of list_t){
        item=item.trim();
        row_list=item.split(',');
        if (row_list.length!==3){continue;}
        if (result_t[row_list[0]]==undefined){
            result_t[row_list[0]]=[];
        }
        row_list[2]=parseInt(row_list[2]);
        var bldate=validdate_b(row_list[1]);
        if (bldate==false){continue;}
        
        result_t[row_list[0]].push([bldate,row_list[2]]);
                
        if (total_dict[row_list[1]]==undefined){
            total_dict[row_list[1]]=0;
        }
        total_dict[row_list[1]]=total_dict[row_list[1]]+row_list[2];
        
        table_array_global.push(row_list);
    }
    
    var flot_list=[];
    for (let key in result_t){
        result_t[key].sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
        if (result_t[key].length<2){continue;}//只有一个记录的忽略 - 保留注释
        flot_list.push([key].concat(result_t[key]));
    }
    
    var total_list=[];
    for (let key in total_dict){
        total_list.push([validdate_b(key),total_dict[key]]);
        table_array_global.push(['Total',key,total_dict[key]]);
    }
    
    table_array_global.sort();

    total_list.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    total_list=['Total'].concat(total_list);
    
    flot_lines_show_arr_analyze([total_list].concat(flot_list),true);
    list_arr_analyze();
}

function flot_lines_show_arr_analyze(cslist,istime=false){
    document.getElementById('div_flot').style.display='';
    flot_lines_b(cslist,'div_flot',document.getElementById('select_flot_legend_position_aa').value,istime,'',document.getElementById('select_flot_date_type_aa').value,document.getElementById('input_flot_y1unit_aa').value,parseInt(document.getElementById('input_flot_y1_fraction_length').value));
}

function menu_arr_analyze(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'table2csv_arr_analyze();">table 2 csv</span>',
    '<span class="span_menu" onclick="'+str_t+'ascii_table_arr_analyze();">ascii table</span>',
    '<span class="span_menu" onclick="'+str_t+'batch_print_form_arr_analyze();">列数据嵌入批量打印</span>',

    ];
    if (is_local_b()){
        klmenu1.push('<a href="../../../../data/klwiki/dir_line_count.csv" onclick="'+str_t+'" target=_blank>下载 dir_line_count.csv</a>');
        if (!is_file_type_b()){
            klmenu1.push('<span class="span_menu" onclick="'+str_t+'code_lines_read_arr_analyze();">code files line count</span>');
        }
    }
    
    var vertical_list=[];
    var horizontal_list=[];
    for (let blxl=2;blxl<=9;blxl++){
        vertical_list.push([blxl+'段','split_table_arr_analyze(\'rows\','+blxl+');',true]);    
        horizontal_list.push([blxl+'段','split_table_arr_analyze(\'cols\','+blxl+');',true]);
    }
    klmenu1.push(menu_container_b(str_t,vertical_list,'rows分割：'));    
    klmenu1.push(menu_container_b(str_t,horizontal_list,'cols分割：'));    

    var klmenu2=root_font_size_menu_b(str_t);
    klmenu2=klmenu2.concat([
    '<span class="span_menu" onclick="'+str_t+'import_arr_analyze();">以数组形式直接载入记录</span>',
    '<span class="span_menu" onclick="'+str_t+'import_arr_analyze(true);">csv数据添加[],再载入</span>',    
    '<span class="span_menu" onclick="'+str_t+'split_arr_by_cols_form_analyze();">数组批量列分割</span>',
    '<span class="span_menu" onclick="'+str_t+'table_title_arr_analyze();">设置标题</span>',    
    ]);

    var group_list=[
    ['获取','setTimeout(th_name_get_arr_analyze,1);',true],
    ['设置','setTimeout(th_name_set_arr_analyze,1);',true],   ////避免菜单还显示 - 保留注释
    ];    
    klmenu2.push(menu_container_b(str_t,group_list,'表格列名称: '));

    var group_list=[
    ['添加','table_title_arr_analyze();',true],
    ['移除','table_title_arr_analyze(true);',true],
    ];    
    klmenu2.push(menu_container_b(str_t,group_list,'表格标题: '));
        
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'','22rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','20rem','1rem','1rem','60rem'),'','0rem')+' ');
}

function table_title_arr_analyze(is_remove=false){
    var otable=document.getElementById('table_arrays');
    if (!otable){
        alert('未发现表格');
        return;
    }
    
    var otitle=otable.querySelector('tr.tr_title_array');
    if (is_remove){
        if (otitle){
            otitle.outerHTML='';
        }    
    } else {
        if (!otitle){
            var otr=otable.querySelector('tr');
            if (!otr){
                alert('未发现表格行');
                return;
            }
            var bllen=otr.querySelectorAll('td,th').length;
            if (bllen==0){
                alert('未发现表格列');
                return;
            }
            otr.insertAdjacentHTML('beforebegin','<tr class="tr_title_array"><th colspan='+bllen+' contenteditable="true">输入标题</th></tr>');
        }
    }
}

function split_arr_by_cols_form_analyze(){
    var blclose=close_button_b('divhtml','');
    var blstr=`<p><b>按一行一个分组条件输入：</b></p>
<textarea id="textarea_split_analyze" style="height:20rem;"></textarea>
<p><span class="aclick" onclick="split_arr_by_cols_result_analyze();">执行</span>
`+blclose+'</p><div id="div_split_result_analyze"></div>';
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=blstr;
    odiv.scrollIntoView();
}

function split_arr_by_cols_result_analyze(){
    var list_t=document.getElementById('textarea_split_analyze').value.trim().split('\n');
    var odiv=document.getElementById('div_split_result_analyze');

    for (let item of list_t){
        arr_t=column_filter_arr_analyze(item.trim().split(','),false);
        var blstr='<p><b>'+item+'</b></p><textarea style="height:15rem;" onclick="this.select();document.execCommand(\'copy\');">'+var_arr_analyze(arr_t,false)+'</textarea>';
        odiv.insertAdjacentHTML('beforeend',blstr);
    }    
    odiv.scrollIntoView();
}

function th_name_get_arr_analyze(do_alert=true){
    var obuttons=document.querySelectorAll('#table_arrays th button');
    var result_t=[];
    for (let one_button of obuttons){
        result_t.push(one_button.innerText);
    }
    if (do_alert){
        alert(result_t);
    }
    return result_t;
}

function th_name_set_arr_analyze(){
    var old_name=th_name_get_arr_analyze(false).join(' | ');
    var new_name=prompt('批量输入表格列名称',old_name);
    if (new_name==null){return;}
    new_name=new_name.trim();
    if (new_name==''){return;}
    new_name=new_name.split(' | ');
    var obuttons=document.querySelectorAll('#table_arrays th button');
    var bllen=Math.min(new_name.length,obuttons.length);
    for (let blxl=0;blxl<bllen;blxl++){
        obuttons[blxl].innerText=new_name[blxl];
    }
}

function batch_print_form_arr_analyze(){
    var left_str='<p>'+'<span class="aclick" onclick="batch_print_show_arr_analyze();">生成</span>';
    var right_str='</p><div id="div_batch_print_arr_analyze"></div>';
    var blstr=textarea_with_form_generate_b('textarea_template_arr_analyze','height:10rem;',left_str,'清空,复制,发送到临时记事本,发送地址',right_str);
    document.getElementById('divhtml').innerHTML=blstr;
    document.getElementById('textarea_template_arr_analyze').setAttribute('placeholder','应该嵌入如：${item[0]}&lt;br /&gt;');
}

function batch_print_show_arr_analyze(){
    var odiv=document.getElementById('div_batch_print_arr_analyze');
    odiv.innerHTML='';
    var blcontent=document.getElementById('textarea_template_arr_analyze').value;

    for (let item of table_array_global){
        var list_t=eval('`'+blcontent+'`').split('\n');
        odiv.insertAdjacentHTML('beforeend',list_t.join(''));
    }
}

function split_table_arr_analyze(split_type,cscount){
    window.scrollTo(0, 0);
    var otable=document.getElementById('table_arrays');
    if (!otable){return;}
    var rect_table=otable.getBoundingClientRect();
    var otrs=otable.querySelectorAll('tr');
    split_table_by_rows_or_cols_b(otrs,cscount,split_type,rect_table);
}

function table2csv_arr_analyze(){
    if (table_array_global.length==0){return;}
    var list_t=[];
    for (let blxl=0,lent=table_array_global[0].length;blxl<lent;blxl++){
        list_t.push(blxl+1);     //忽略第一列的序号 - 保留注释
    }
    table_2_csv_b('#table_arrays',list_t);
}

function import_arr_analyze(is_csv=false){
    var blstr=document.getElementById('textarea_arrays').value.trim();
    import_arr_b(blstr,'table_array_global',is_csv,list_arr_analyze);
}

function init_arr_analyze(){
    var input_list=[
    ['input_column1',3,0.5],
    ['input_column2',3,0.5],
    ['input_interval',2,0.5],
    ['input_row_count',4,0.5],
    ['input_filter',12,0.5],
    ['input_flot_legend_caption_aa',11,0.95],
    ['input_flot_y1unit_aa',3,0.95],
    ['input_fraction_length',3,0.5],
    ['input_flot_y1_fraction_length',3,0.5],
    ['input_flot_y2_fraction_length',3,0.5],

    ];
    input_size_b(input_list,'id');
    
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    menu_arr_analyze();
}

function show_source_arr_anaylze(show_source){
    document.getElementById('textarea_arrays').style.display=(show_source?'':'none');
    var otable=document.getElementById('table_arrays');
    otable.style.display=(show_source?'none':'');
    if (otable.innerHTML==''){
        table_refresh_arr_analyze();
    }
}

function delimiter_get_arr_analyze(){
    return delimiter_get_b(document.getElementById('input_interval').value);
}

function table_refresh_arr_analyze(cstype='reload'){
    if (table_array_global.length==0){
        cstype=='reload';
    }
    
    if (cstype=='reload' || cstype=='add_col'){
        var list_t=document.getElementById('textarea_arrays').value.split('\n');
        var delimiter=delimiter_get_arr_analyze();
        var arr_t=[];
        for (let item of list_t){
            if (item.trim()==''){continue;}
            if (delimiter==''){
                arr_t.push([item]);
            } else {
                arr_t.push(item.split(delimiter));
            }
        }
        
        if (cstype=='reload'){
            table_array_global=arr_t;
        } else {
            if (table_array_global.length!==arr_t.length){
                alert('行数不一致（'+table_array_global.length+':'+arr_t.length+'），操作取消');
                return;
            }
            
            for (let blxl=0,lent=table_array_global.length;blxl<lent;blxl++){
                table_array_global[blxl]=table_array_global[blxl].concat(arr_t[blxl]);
            }
        }
    }
    
    var otable=document.getElementById('table_arrays');
    var oths=otable.querySelectorAll('th button');
    
    var maxcol=0;
    var result_t=[];
    var row_no=1;
    for (let item of table_array_global){
        maxcol=Math.max(maxcol,item.length);
        var arow=['<td align="right" style="background-color:'+scheme_global['button']+';">'+row_no+'</td>'];
        row_no=row_no+1;
        for (let acol of item){
            if (!isNaN(acol) || acol.slice(-1)=='%' && !isNaN(acol.slice(0,1))){
                arow.push('<td align="right">'+acol+'</td>');
            } else {
                arow.push('<td>'+acol+'</td>');            
            }
        }
        result_t.push('<tr>'+arow.join('')+'</tr>');    
    }
    
    var blth='<tr><th style="line-height:2rem;">&nbsp;</th>';
    for (let bly=0;bly<maxcol;bly++){
        var thname=(bly<oths.length?oths[bly].innerText:false);
        blth=blth+'<th style="line-height:2rem;">'+th_menu_arr_analyze(bly,thname)+'</th>';
    }
    blth=blth+'</tr>\n';
    otable.innerHTML=blth+result_t.join('\n');
}

function th_menu_arr_analyze(csno,thname=false){
    var str_t=klmenu_hide_b('');
    var klmenu1=[];

    var sort_list=[
    ['⬆','sort_arr_analyze(0,'+csno+');table_refresh_arr_analyze(\'\');',true],
    ['⬇','sort_arr_analyze(1,'+csno+');table_refresh_arr_analyze(\'\');',true],
    ['ℹ','line_chart_show_analyze(event,'+csno+');',true],
    ['select','line_chart_select_analyze(this,'+csno+');',true],
    ];
    klmenu1.push(menu_container_b(str_t,sort_list,'sort: '));    
    
    if (thname==false){
        thname=num_2_xls_colnum_letter_arr_analyze(csno+1);
    }
    return klmenu_b(klmenu1,thname,'8rem','1rem','1rem','60rem');
}

function line_chart_select_analyze(odom,csno){
    if (typeof selected_col_no_analyze_global=='undefined'){
        selected_col_no_analyze_global=new Set();
    }
    var blstr=odom.innerText;
    if (blstr=='select'){
        selected_col_no_analyze_global.add(csno);
        odom.innerText='selected';
    } else {
        selected_col_no_analyze_global.delete(csno);
        odom.innerText='select';
    }
}

function line_chart_show_analyze(event,csno){
    function sub_line_chart_show_analyze_format(line_no){
        let cslist=array_split_by_col_b(table_array_global,[line_no]);
        let lent=cslist.length;
        if (lent>date_len){
            alert('数据行数比日期行数长');
            return false;
        }
        
        let new_list=[];
        for (let blxl=0;blxl<lent;blxl++){
            new_list.push([date_list[blxl],parseFloat(cslist[blxl])]);
        }
        return new_list;
    }
    
    var date_list=[];
    for (let arow of table_array_global){
        var bldate=validdate_b(arow[0]);
        if (bldate===false){
            alert('发现非日期项：'+arow[0]);
            return;
        }
        date_list.push(date2str_b('-',bldate));
    }
    var date_len=date_list.length;
    
    var color_list=canvas_lines_color_get_b();
    var color_len=color_list.length;

    if (typeof selected_col_no_analyze_global=='undefined'){
        selected_col_no_analyze_global=new Set();
    }
    
    var current_is_selected=selected_col_no_analyze_global.has(csno);
    selected_col_no_analyze_global.add(csno);
    
    var result_t=[];
    var color_no=0;
    for (let one_no of selected_col_no_analyze_global){
        var list_t=sub_line_chart_show_analyze_format(one_no);
        if (list_t===false){return;}
        var color_name=color_list[color_no%color_len];
        result_t.push([list_t,color_name]);
        color_no=color_no+1;
    }
    
    canvas_lines_chart_b(result_t,'div_line_chart_analyze');
    
    if (!current_is_selected){
        selected_col_no_analyze_global.delete(csno);
    }
}

function remove_arr_analyze(cstype){
    if (table_array_global.length==0){return;}
    var colno=parseInt(document.getElementById('input_column1').value.trim())-1;
    for (let blxl=0,lent=table_array_global.length;blxl<lent;blxl++){
        if (colno<0 || colno>=table_array_global[blxl].length){continue;}
        if (typeof table_array_global[blxl][colno] == 'string'){
            table_array_global[blxl][colno]=table_array_global[blxl][colno].replace(new RegExp(cstype,'g'),'');
        }
    }
    list_arr_analyze();
}

function num_2_xls_colnum_letter_arr_analyze(csnum){
    //n>0 - 保留注释
    var string = '';
    while (csnum > 0){
        var remainder = (csnum-1) % 26;    
        var csnum = Math.floor((csnum-1)/26);
        
        string = String.fromCharCode(65 + remainder) + string;
    }
    return string;
}

function ascii_table_arr_analyze(){
    //由于不同字体，一个中文未必在宽度上是2个英文字母宽，不适合中英文混杂 - 保留注释
    var bllen_list=[];
    var blmax_col=0;
    for (let arow of table_array_global){
        for (let blxl=0,lent=arow.length;blxl<lent;blxl++){
            if (bllen_list['c'+blxl]==undefined){
                bllen_list['c'+blxl]=0;
            }
            var bllen=arow[blxl].replace(/[^\x00-\xff]/g,'01').length;  
            bllen_list['c'+blxl]=Math.max(bllen_list['c'+blxl],bllen);
            blmax_col=Math.max(blmax_col,blxl);
        }
    }
    
    var hr_str=[];
    for (let blxl=0;blxl<=blmax_col;blxl++){
        hr_str.push('-'.repeat(bllen_list['c'+blxl]));
    }
    hr_str='+-'+hr_str.join('-+-')+'-+';
    
    var result_t=[];
    result_t.push(hr_str);
    for (let arow of table_array_global){
        var row_str=[];
        for (let blxl=0,lent=arow.length;blxl<lent;blxl++){
            var bllen=bllen_list['c'+blxl]-arow[blxl].replace(/[^\x00-\xff]/g,'01').length;
            row_str.push(' '.repeat(bllen)+arow[blxl]);
        }
        result_t.push('| '+row_str.join(' | ')+' |');
        result_t.push(hr_str);        
    }
    console.log(result_t.join('\n'));  //此行保留 - 保留注释
    var bljg=result_t.join('<br>');
    document.getElementById('divhtml').innerHTML=bljg.replace(/ /g,'&nbsp;');
}
