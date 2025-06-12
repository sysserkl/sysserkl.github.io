function switch_columns_rank_b(table_id,tdclass1,tdclass2){
    //表格列对调 - 保留注释
    var otable=document.getElementById(table_id);
    if (!otable){return;}

    var otrs=otable.querySelectorAll('tr');
    for (let one_tr of otrs){
        var otds=one_tr.querySelectorAll('th,td');
        var result_t=[];
        for (let one_td of otds){
            if (one_td.classList.contains(tdclass1) || one_td.classList.contains(tdclass2)){
                result_t.push(one_td);
            }
        }
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl=blxl+2){
            var blstr=result_t[blxl].outerHTML;
            result_t[blxl].outerHTML=result_t[blxl+1].outerHTML;
            result_t[blxl+1].outerHTML=blstr;
        }
    }
}

function year_district_list_rank_b(csarray,year_no,district_no){
    //csarray 与 line_district_revenue_rank_b() 的 csarray 格式一致 - 保留注释
    var year_list=new Set();
    var district_list=new Set();
    for (let item of csarray){
        year_list.add(item[year_no]); //格式为 xxxx年 - 保留注释
        if (item[district_no]!==''){
            district_list.add(item[district_no]);
        }
    }
    
    year_list=Array.from(year_list).sort(); //形如 ["2009年", "2010年", "2011年",] - 保留注释
    district_list=Array.from(district_list).sort(function (a,b){return zh_sort_b(a,b);}); //形如 [ "爱尔兰", "奥地利", "澳大利亚", "巴西", "比利时", "波兰", ] - 保留注释
    return [year_list,district_list];
}

function show_hide_rank_b(table_id,cstype){
    //隐藏显示表格列 - 老板注释
    var otable=document.getElementById(table_id);
    if (!otable){return;}
    var otds=otable.querySelectorAll('th,td');
    for (let one_td of otds){
        if (!one_td.classList.contains(cstype)){continue;}
        one_td.style.display=(one_td.style.display==''?'none':'');
    }
}

function buttons_rank_b(caption,search_fn){
    var blstr='';
    blstr=blstr+'<h2 style="margin:0rem;font-size:1.35rem;"><span id="span_title">'+caption+'</span><span id="span_count" style="font-weight:normal;font-size:0.9rem;"></span></h2>\n';
    blstr=blstr+'<p style="margin-left:0.5rem;">';
    blstr=blstr+'<input type="text" id="input_search" onkeyup="if (event.key==\'Enter\'){'+search_fn+'}"> ';
    blstr=blstr+'<label><input type="checkbox" id="input_reg">正则</label>';    
    blstr=blstr+'</p>\n';
    blstr=blstr+'<div id="div_recent_search" style="margin-top:0.3rem;margin-left:0.5rem;line-height:180%;"></div>\n';

    document.getElementById('div_buttons').innerHTML=blstr;
    input_with_x_b('input_search',15);
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));    
}

function keys_rank_b(cskey,csreg,show_html){
	if (cskey===false){
        var cskey= document.getElementById('input_search').value.trim();
    }
    
	if (csreg===-1){
        var csreg=document.getElementById('input_reg').checked;
    }
    
    [cskey,csreg]=str_reg_check_b(cskey,csreg);
    
    if (cskey==''){
        cskey=(new Date().getFullYear()-1)+'年';
    }
    if (show_html){
	    document.getElementById('input_search').value=cskey;    
	    document.getElementById('input_reg').checked=csreg;
    }
    return [cskey,csreg];
}

function search_rank_b(csarray,cskey,csreg,revenue_index=-1,rank_index=-1,year_index=-1,profit_index=-1,array_reverse=false){    
    //csarray 与 line_district_revenue_rank_b() 的 csarray 格式一致 - 保留注释
    var result_t=[];
    var blsum=0;
    for (let item of csarray){
		var blfound=str_reg_search_b(item,cskey,csreg);
		if (blfound==-1){break;}

		if (cskey=='' || blfound){        
            result_t.push([].concat(item)); //deepcopy，不能使用 resutl_t.concat() - 保留注释
            blsum=blsum+item[revenue_index];
        }
    }
    
    if (profit_index>=0){
        result_t.sort(function (a,b){return a[profit_index]<b[profit_index] ? 1 : -1;});//利润 - 保留注释        
    } else if (revenue_index>=0){ //收入、利润排序二选一 - 保留注释
        result_t.sort(function (a,b){return a[revenue_index]<b[revenue_index] ? 1 : -1;});//收入 - 保留注释
    }
    
    if (rank_index>=0){
        result_t.sort(function (a,b){return a[rank_index]>b[rank_index] ? 1 : -1;});//排名 - 保留注释
    }
    if (year_index>=0){
        result_t.sort(function (a,b){return a[year_index]<b[year_index] ? 1 : -1;});//年份 - 保留注释
    }
    //result_t 是 csarray 的子集 - 保留注释
    //blsum 是 收入 合计 - 保留注释
    if (array_reverse){
        result_t.reverse();
    }
    return [result_t,blsum];
}

function div_flot_css_rank_b(csid,csshow=true,fullscreen=false){
    var odiv=document.getElementById(csid);
    if (fullscreen){
        odiv.style.width='';
        odiv.style.height='';    
    } else {
        odiv.style.width='900px';
        odiv.style.height='700px';
    }
    odiv.style.display=(csshow?'':'none');
    return odiv;
}

function obj2array_rank_b(csarray,revenue_index=-1){
    //转换原始数据（以年份为dict，值为数组，每个元素也是数组，包含了企业名称 地区 收入 利润(可选)）为数组 ，并按收入排序，添加排名和年份- 保留注释
    var result_t=[];
    for (let key in csarray){
        if (revenue_index>=0){
            csarray[key].sort(function (a,b){return a[revenue_index]<b[revenue_index] ? 1 : -1;});
        }
        for (let blxl=0,lent=csarray[key].length;blxl<lent;blxl++){
            var arow=csarray[key][blxl];
            arow.push(blxl+1);
            arow.push(key+'年');
            result_t.push(arow);
        }
    }
    return result_t;
}

function data_check_rank_b(csarray,cslen,num_list=[]){
    var result_t=[];
    var blxl=0;
    for (let item of csarray){
        if (item.length!==cslen){
            result_t.push('列数错误：'+item.toString());
            blxl=blxl+1;
        }
        for (let one_no of num_list){
            if (!['','-'].includes(item[one_no]) && isNaN(item[one_no])){
                result_t.push('类型错误：'+item.toString());
                blxl=blxl+1;
                break;
            }        
        }
        if (blxl>100){break;}
    }
    if (result_t.length>0){
        document.getElementById('divhtml').innerHTML=array_2_li_b(result_t);
        return false;
    }
    return true;
}

function table_buttons_set_rank_b(table_id,td_list=[],show_default=true){
    //表格列隐藏显示、对调按钮 - 保留注释
    var bljg=[];
    if (show_default){
        td_list=[['td_rank','名次'],['td_year','年份'],['td_no','序号']].concat(td_list);
    }
    for (let item of td_list){
        bljg.push('<span class="aclick" onclick="show_hide_rank_b(\''+table_id+'\',\''+item[0]+'\');">'+item[1]+'</span>');
    }
    if (show_default){    
        bljg.push('<span class="aclick" onclick="switch_columns_rank_b(\''+table_id+'\',\'td_no\',\'td_rank\');">序号与名次对调</span>');       
        bljg.push('<span class="aclick" onclick="switch_columns_rank_b(\''+table_id+'\',\'td_district\',\'td_revenue\');">地区与收入对调</span>');      
    }
    return bljg.join('\n');  
}

function company_rate_rank_b(csarray,district_index,year_index,revenue_index,denominator){
    //企业收入多年平均增长率，企业利润多年平均增长率 - 保留注释
    var flot_array={};
    for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
        var item=csarray[blxl];
        var key='k_'+item[0];
        if (flot_array[key]==undefined){
            flot_array[key]=[item[0],item[district_index],[]];
        }
        var blvalue=item[revenue_index];
        if (blvalue=='' || isNaN(blvalue)){continue;}
        var blyear=parseInt(item[year_index].substring(0,4));
        flot_array[key][2].push([blyear,blvalue/denominator]);
    }
    //-----------------------
    var list_t=[];
    for (let key in flot_array){
        if (flot_array[key][2].length==0){continue;}
        flot_array[key][2].sort();
        list_t.push(flot_array[key]);
    }

    var rate_list=[];
    for (let item of list_t){
        if (item[2].length<2){continue;}   //只有一年 - 保留注释
        var first_item=item[2][0];
        var last_item=item[2].slice(-1)[0];        
        var blpow=multiyear_average_growth_rate_b(first_item[0],first_item[1],last_item[0],last_item[1]);
        if (blvalue!==false){
            rate_list.push([item[0],item[1],first_item[0],last_item[0],blpow]);    //企业，地区，初始年分，结束年份，增长率 - 保留注释
        } else {
            console.log(item); //负数未计算 - 保留注释
        }
    }
    rate_list.sort(function (a,b){return a[4]<b[4] ? 1 : -1;});  //增长率逆序 - 保留注释
    rate_list.sort(function (a,b){return a[3]<b[3] ? 1 : -1;});  //结束年份逆序 - 保留注释
    
    for (let blxl=0,lent=rate_list.length;blxl<lent;blxl++){
        var item=rate_list[blxl];
        rate_list[blxl]='<tr><td align=right>'+(blxl+1)+'</td><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td>'+item[3]+'</td><td align=right>'+(item[4]*100).toFixed(2)+'%</td></tr>';
    }
    var blhead='<tr><th>No.</th><th>Company</th><th>District</th><th>First Year</th><th class="td_rank">Last Year</th><th>Percentage</th></tr>\n';
    return blhead+rate_list.join('\n');
}

function group_rank_b(csarray,group_district,group_year,district_index,year_index){
    function sub_group_rank_b_push(cskey,item){
        if (result_t[cskey]==undefined){
            result_t[cskey]=[];
        }
        result_t[cskey].push(item);            
    }
    //-----------------------
    //分组 - 保留注释
    var blkey='';
    var result_t=[];

    if (group_district && group_year){
        for (let item of csarray){
            blkey=item[district_index]+'_'+item[year_index];
            sub_group_rank_b_push(blkey,item);                
        }
    } else if (group_district){
        for (let item of csarray){
            blkey=item[district_index];
            sub_group_rank_b_push(blkey,item);               
        }            
    } else {
        for (let item of csarray){
            blkey=item[year_index];
            sub_group_rank_b_push(blkey,item);
        }            
    }

    return result_t;
}

function line_district_revenue_percent_rank_b(flot_array,fraction_len,denominator,caption){
    //flot_array 每个元素 形如 ['美国',[’2001‘,收入或利润],[’2002‘,收入或利润]...] - 保留注释
    var rate_list=[];
    for (let key in flot_array){
        if (flot_array[key].length<3){continue;}
        var first_item=flot_array[key][1];
        var last_item=flot_array[key].slice(-1)[0];
        rate_list.push([key,first_item[0],first_item[1],last_item[0],last_item[1],last_item[1]/first_item[1]]);
    }        

    rate_list.sort(function (a,b){return a[5]<b[5] ? 1 : -1;});  //增长率逆序 - 保留注释
    rate_list.sort(function (a,b){return a[3]<b[3] ? 1 : -1;});  //结束年份逆序 - 保留注释
    
    for (let blxl=0,lent=rate_list.length;blxl<lent;blxl++){
        var item=rate_list[blxl];
        rate_list[blxl]='<tr><td align=right>'+(blxl+1)+'</td><td>'+item[0]+'</td><td align=center>'+item[1]+'</td><td align=right>'+(item[2]*denominator).toFixed(fraction_len)+'</td><td align=center>'+item[3]+'</td><td align=right>'+(item[4]*denominator).toFixed(fraction_len)+'</td><td align=right>'+(item[5]*100).toFixed(2)+'%</td></tr>';
    }
    var blhead='<tr><th>No.</th><th>District</th><th>First Year</th><th>First Year '+caption+'</th><th>Last Year</th><th>Last Year '+caption+'</th><th>Percentage</th></tr>\n';
    return blhead+rate_list.join('\n');
}

function line_district_statistics_percent_rank_b(flot_revenue_data){
    var year_sum=[];
    for (let item of flot_revenue_data){
        for (let blxl=1,lent=item.length;blxl<lent;blxl++){
            var blyear=item[blxl][0]+'年';
            if (year_sum[blyear]==undefined){
                year_sum[blyear]=0;
            }
            year_sum[blyear]=year_sum[blyear]+item[blxl][1];
        }        
    }

    var flot_percent_data=[];
    for (let blxl=0,lent=flot_revenue_data.length;blxl<lent;blxl++){
        var arr_p=[flot_revenue_data[blxl][0]]; 
        for (let one_year=1,lenb=flot_revenue_data[blxl].length;one_year<lenb;one_year++){
            var blpercent=flot_revenue_data[blxl][one_year][1]*100/year_sum[flot_revenue_data[blxl][one_year][0]+'年'];
            arr_p.push([flot_revenue_data[blxl][one_year][0],blpercent]);
        }
        flot_percent_data.push(arr_p);
    }
    return flot_percent_data;
}

function line_district_statistics_flot_array_rank_b(csarray,cskey,csreg,district_index,year_index,revenue_index,denominator){
    var list_t=[];//全局变量 - 保留注释
    for (let item of csarray){
        var blcity=item[district_index];
        var blyear=item[year_index].substring(0,4);
        if (list_t[blcity+'_'+blyear]==undefined){
            list_t[blcity+'_'+blyear]=[blcity,parseInt(blyear),0];  //地区，年份，营收(或个数) - 保留注释
        }
        list_t[blcity+'_'+blyear][2]=list_t[blcity+'_'+blyear][2]+(revenue_index==-1?1:item[revenue_index]);
    }
    list_t=object2array_b(list_t);
    
    var result_t=[];
    for (let item of list_t){
        if (result_t[item[0]]==undefined){
            result_t[item[0]]=[];
        }
        result_t[item[0]].push([item[1],(revenue_index==-1?item[2]:item[2]/denominator)]);    //年份,营收 - 保留注释
    }
    
    for (let key in result_t){
        result_t[key]=int_number_list_insert_zero_b(result_t[key]);
        result_t[key]=[key].concat(result_t[key]);  //添加地区，形成 [ 地区,[年份1,营收1(或个数1)],[年份2,营收2(或个数2)] ] - 保留注释
    }
    result_t=object2array_b(result_t);
    //---

    var flot_revenue_data=[];
    for (let item of result_t){
		var blfound=str_reg_search_b(item,cskey,csreg); 
		if (blfound==-1){break;}

		if (cskey=='' || blfound){        
            flot_revenue_data.push(item);
        }
    }
    return flot_revenue_data;
}

function pie_district_statistics_array_rank_b(csarray,district_index,revenue_index){
    //csarray 与 line_district_revenue_rank_b() 的 csarray 格式一致 - 保留注释
    var list_t={};

    for (let item of csarray){
        if (list_t[item[district_index]]==undefined){
            list_t[item[district_index]]=[item[district_index],0];
        }
        var blvalue=(revenue_index==-1?1:item[revenue_index]);
        if (blvalue=='' || isNaN(blvalue)){continue;}
        list_t[item[district_index]][1]=list_t[item[district_index]][1]+blvalue;
    }
    
    var list_t=object2array_b(list_t);
    list_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    return list_t;
    //list_t 每个元素形如 ['地区', 收入] - 保留注释
}

function pie_district_statistics_string_rank_b(csarray,fraction_len,caption,denominator,revenue_index){
    //csarray 每个元素形如 ['地区', 收入] - 保留注释
    var bljg=[].concat(csarray);
    var blsum=0;
    for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
        blsum=blsum+csarray[blxl][1];
        var blvalue=(revenue_index==-1?csarray[blxl][1]:csarray[blxl][1]/denominator);
        if (blvalue=='' || isNaN(blvalue)){continue;}
        csarray[blxl]={'label': csarray[blxl][0],'data': blvalue};
    }
    bljg.push(['合计',blsum]);

    for (let blxl=0,lent=bljg.length;blxl<lent;blxl++){
        bljg[blxl]=bljg[blxl][0]+': '+(revenue_index==-1?bljg[blxl][1]+'家，':(bljg[blxl][1]/denominator).toFixed(fraction_len)+caption+'，')+(bljg[blxl][1]*100/blsum).toFixed(2)+'%';
    }
    
    //csarray 每个元素形如 { label: "地区", data: 收入 } - 保留注释
    //bljg 每个元素为字符串，形如 "美国: 86952891.5百万美元，58.35%" - 保留注释
    return [csarray,bljg];
}

function line_company_revenue_rank_b(csarray,year_index,revenue_index,denominator,category_col=0){
    //csarray 与 line_district_revenue_rank_b() 的 csarray 格式一致 - 保留注释
    var flot_array={};
    for (let item of csarray){
        if (flot_array[item[category_col]]==undefined){
            flot_array[item[category_col]]=[];
        }
        flot_array[item[category_col]].push([parseInt(item[year_index].substring(0,4)),item[revenue_index]/denominator]);
    }
    var list_t=[];
    for (let key in flot_array){
        flot_array[key].sort();
        list_t.push([key].concat(flot_array[key])); //不是 list_t.push([key],flot_array[key]);
    }
    return list_t;
    //返回结果每个元素形如：['企业名称',[2018,收入],[2019,收入]...] - 保留注释    
}

function line_district_revenue_rank_b(csarray,district_index,year_index,revenue_index,denominator){
    //csarray 每一个元素为数组，形如 ['Company', 'City', Revenue, 当年名次,'2020年'] - 保留注释
    //或者 形如 ['Company', 营收(百万美元), 利润(百万美元), 'Country', 当年名次,'2020年'] - 保留注释
    var list_t={};
    var flot_array={};
    
    if (!Array.isArray(revenue_index)){
        revenue_index=[revenue_index];
    }
    var bllen=revenue_index.length;
    
    for (let item of csarray){
        var key_name=item[district_index]+'_'+item[year_index];
        if (list_t[key_name]==undefined){
            list_t[key_name]=[item[district_index],item[year_index].substring(0,4)];
            for (let blxl=0;blxl<bllen;blxl++){
                list_t[key_name].push(0);
            }
        }
        if (flot_array[item[district_index]]==undefined){
            flot_array[item[district_index]]=[];
        }
        for (let blxl=0;blxl<bllen;blxl++){
            list_t[key_name][2+blxl]=list_t[key_name][2+blxl]+item[revenue_index[blxl]]/denominator;
        }
    }

    for (let key in list_t){
        var district_str=list_t[key][0];
        list_t[key].splice(0,1);
        flot_array[district_str].push(list_t[key]);
    }
    for (let key in flot_array){
        flot_array[key].sort();
        flot_array[key]=[key].concat(flot_array[key]);
    }
    return flot_array;
    //返回结果每个元素形如：['中国',['2018',收入],['2019',收入]...] - 保留注释
}

function simple_name_rank_b(cskey,csarray,csno=0){
    var name_list=cskey.replace(/[\(\)\|\,\s\+\-]/g,' ').trim().split(' ');
    for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
        for (let one_name of name_list){
            if (csarray[blxl][csno].includes(one_name)){
                csarray[blxl][csno]=one_name;
                break;
            }
        }
    }
    return csarray;
}

function number_td_range_rank_b(otables,td_classname,caption='',default_value=''){
    var blrange=prompt('输入'+caption+'显示范围，如10-45：',default_value);
    if (blrange==null){return;}
    blrange=str2num_range_b(blrange);
    var bllen=blrange.size;
    for (let one_table of otables){
        var otrs=one_table.querySelectorAll('tr');
        for (let one_tr of otrs){
            var otd=one_tr.querySelector('td.'+td_classname);
            if (!otd){continue;}
            var blvalue=parseInt(otd.innerText.trim());
            if (isNaN(blvalue)){continue;}
            if (bllen==0 || blrange.has(blvalue)){
                one_tr.style.display='';
            } else {
                one_tr.style.display='none';
            }
        }
    }
}

function year_name_set_get_ranke_b(csarr,year_no,name_no,head_name){
    var year_dict={};
    var year_set=new Set();
    var name_set=new Set();
    for (let item of csarr){
        var key_y=item[year_no];
        if (year_dict[key_y]==undefined){
            year_dict[key_y]={};
        }
        year_set.add(key_y);
        
        var key_n='n_'+item[name_no];
        year_dict[key_y][key_n]=[].concat(item);
        name_set.add(item[name_no]);
    }

    if (year_set.size==0){return [{},[],[]];}

    year_set=Array.from(year_set);
    year_set.sort();
       
    name_set=Array.from(name_set);
    name_set.sort(zh_sort_b);
    name_set.sort(function (a,b){return b==head_name;}); 
    
    return [year_dict,year_set,name_set];
}

function compare_ranke_b(year_dict,year_set,name_set,head_name,table_names,odiv){
    function sub_compare_ranke_b_one_col(col_no){
        var result_t=[];
        var flot_data=[];
        for (let one_name of name_set){
            var tr_list=[one_name];
            var one_flot=[one_name];
            for (let one_year of year_set){
                var blvalue=year_dict[one_year]['n_'+one_name];
                if (blvalue==undefined){
                    tr_list.push(null);
                    tr_list.push(null);
                    one_flot.push([parseInt(one_year.split('年')[0]),null]);
                } else {
                    tr_list.push(blvalue[col_no]);
                    var blvalue0=year_dict[one_year]['n_'+name_set[0]];         
                    if (blvalue0==null){
                        tr_list.push(null);
                        one_flot.push([parseInt(one_year.split('年')[0]),null]);                        
                    } else {
                        var percent=blvalue[col_no]/blvalue0[col_no]*100;
                        tr_list.push(percent);
                        one_flot.push([parseInt(one_year.split('年')[0]),percent]);
                    }
                }
            }
            result_t.push(tr_list);
            flot_data.push(one_flot);
        }
        return [result_t,flot_data];
    }
    //-----------------------
    if (year_set.size==0){return;}

    var th_list=['<th>名称</th>'];    
    for (let one_year of year_set){
        th_list.push('<th colspan=2>'+one_year+'</th>');
    }
    
    var result_t,flot_data;
    var blwidth=document.body.clientWidth*0.7;
    var blheight=blwidth*0.6;
    for (let key in table_names){
        var bljg=[];    
        bljg.push('<h3>'+key+'及占'+head_name+'的比例</h3>\n');
        bljg.push('<table class="table_common">');
        bljg.push('<tr>'+th_list.join('')+'</tr>');
        [result_t,flot_data]=sub_compare_ranke_b_one_col(table_names[key]);
        for (let arow of result_t){
            bljg.push('<tr>');        
            bljg.push('<td nowrap>'+arow[0]+'</td>');
            for (let blxl=1,lent=arow.length;blxl<lent;blxl++){
                bljg.push('<td align="right" nowrap>'+(arow[blxl]==null?'/':arow[blxl].toFixed(1))+'</td>');                
            }
            bljg.push('</tr>');
        }
        bljg.push('</table>');
        var flot_id='flot_percent_'+table_names[key]+'fortune';
        bljg.push('<div id="'+flot_id+'" style="width:'+blwidth+'px;height:'+blheight+'px;"></div>');
        odiv.insertAdjacentHTML('beforeend',bljg.join(''));
        flot_lines_b(flot_data,flot_id,'nw',false,'','','%');
    }
}
