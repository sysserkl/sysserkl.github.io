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
        for (let blxl=0;blxl<result_t.length;blxl=blxl+2){
            var blstr=result_t[blxl].outerHTML;
            result_t[blxl].outerHTML=result_t[blxl+1].outerHTML;
            result_t[blxl+1].outerHTML=blstr;
        }
    }
}

function year_district_list_rank_b(csarray,year_no,district_no,is_all=true){
    //csarray 与 line_district_revenue_rank_b() 的 csarray 格式一致 - 保留注释
    var year_list=new Set();
    var district_list=new Set();
    if (is_all){
        for (let item of csarray){
            year_list.add(item[year_no]); //格式为 xxxx年 - 保留注释
            district_list.add(item[district_no]);
        }
    }
    else {
        for (let item of csarray){
            year_list.add(item[year_no]);
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

function search_rank_b(csarray,cskey,csreg,revenue_index,rank_index,year_index){    
    //csarray 与 line_district_revenue_rank_b() 的 csarray 格式一致 - 保留注释
    var result_t=[];
    var blsum=0;
    for (let item of csarray){
		var blfound=str_reg_search_b(item,cskey,csreg);
		if (blfound==-1){
			break;
		}

		if (cskey=='' || blfound){        
            result_t.push(item);
            blsum=blsum+item[revenue_index];
        }
    }

    result_t.sort(function (a,b){return a[revenue_index]<b[revenue_index];});//收入 - 保留注释
    result_t.sort(function (a,b){return a[rank_index]>b[rank_index];});//排名 - 保留注释
    result_t.sort(function (a,b){return a[year_index]<b[year_index];});//年份 - 保留注释
    //result_t 是 csarray 的子集 - 保留注释
    //blsum 是 收入 合计 - 保留注释
    return [result_t,blsum];
}

function div_flot_css_rank_b(csid,csshow=true,fullscreen=false){
    var odiv=document.getElementById(csid);
    if (fullscreen){
        odiv.style.width='';
        odiv.style.height='';    
    }
    else {
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
            csarray[key].sort(function (a,b){return a[revenue_index]<b[revenue_index];});
        }
        for (let blxl=0;blxl<csarray[key].length;blxl++){
            var arow=csarray[key][blxl];
            arow.push(blxl+1);
            arow.push(key+'年');
            result_t.push(arow);
        }
    }
    return result_t;
}

function table_buttons_rank_b(table_id){
    //表格列隐藏显示、对调按钮 - 保留注释
    var bljg='';
    bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_rank_b(\''+table_id+'\',\'td_rank\');">名次</span>\n';
    bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_rank_b(\''+table_id+'\',\'td_year\');">年份</span>\n';
    bljg=bljg+'<span class="aclick" onclick="javascript:show_hide_rank_b(\''+table_id+'\',\'td_no\');">序号</span>\n';        
    bljg=bljg+'<span class="aclick" onclick="javascript:switch_columns_rank_b(\''+table_id+'\',\'td_no\',\'td_rank\');">序号与名次对调</span>\n';       
    bljg=bljg+'<span class="aclick" onclick="javascript:switch_columns_rank_b(\''+table_id+'\',\'td_district\',\'td_revenue\');">地区与收入对调</span>\n';      
    return bljg;  
}

function company_rate_rank_b(csarray,district_index,year_index,revenue_index,denominator){
    //企业收入多年平均增长率，企业利润多年平均增长率 - 保留注释
    var flot_array={};
    for (let blxl=0;blxl<csarray.length;blxl++){
        var item=csarray[blxl];
        if (flot_array[item[0]]==null){
            flot_array[item[0]]=[item[0],item[district_index],[]];
        }
        var blvalue=item[revenue_index];
        if (blvalue=='' || isNaN(blvalue)){continue;}
        var blyear=parseInt(item[year_index].substring(0,4));
        flot_array[item[0]][2].push([blyear,blvalue/denominator]);
    }
    
    //------------------
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
        var bldivide=last_item[1]/first_item[1];
        if (bldivide>=0){
            var blpow=Math.pow(bldivide,1/(last_item[0]-first_item[0]))-1;
            rate_list.push([item[0],item[1],first_item[0],last_item[0],blpow]);    //企业，初始年分，结束年份，增长率 - 保留注释
        }
        else {
            console.log(item); //负数未计算 - 保留注释
        }
    }
    rate_list.sort(function (a,b){return a[4]<b[4];});  //增长率逆序 - 保留注释
    rate_list.sort(function (a,b){return a[3]<b[3];});  //结束年份逆序 - 保留注释
    
    for (let blxl=0;blxl<rate_list.length;blxl++){
        var item=rate_list[blxl];
        rate_list[blxl]='<tr><td align=right>'+(blxl+1)+'</td><td>'+item[0]+'</td><td>'+item[1]+'</td><td>'+item[2]+'</td><td>'+item[3]+'</td><td align=right>'+(item[4]*100).toFixed(2)+'%</td></tr>';
    }
    var blhead='<tr><th>No.</th><th>Company</th><th>District</th><th>First Year</th><th class="td_rank">Last Year</th><th>Percentage</th></tr>\n';
    return blhead+rate_list.join('\n');
}

function group_rank_b(csarray,group_district,group_year,district_index,year_index){
    function sub_group_rank_b_push(cskey,item){
        if (result_t[cskey]==null){
            result_t[cskey]=[];
        }
        result_t[cskey].push(item);            
    }
    //------------------------------------------------------
    //分组 - 保留注释
    var blkey='';
    var result_t=[];

    if (group_district && group_year){
        for (let item of csarray){
            blkey=item[district_index]+'_'+item[year_index];
            sub_group_rank_b_push(blkey,item);                
        }
    }
    else if (group_district){
        for (let item of csarray){
            blkey=item[district_index];
            sub_group_rank_b_push(blkey,item);               
        }            
    }        
    else {
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

    rate_list.sort(function (a,b){return a[5]<b[5];});  //增长率逆序 - 保留注释
    rate_list.sort(function (a,b){return a[3]<b[3];});  //结束年份逆序 - 保留注释
    
    for (let blxl=0;blxl<rate_list.length;blxl++){
        var item=rate_list[blxl];
        rate_list[blxl]='<tr><td align=right>'+(blxl+1)+'</td><td>'+item[0]+'</td><td align=center>'+item[1]+'</td><td align=right>'+(item[2]*denominator).toFixed(fraction_len)+'</td><td align=center>'+item[3]+'</td><td align=right>'+(item[4]*denominator).toFixed(fraction_len)+'</td><td align=right>'+(item[5]*100).toFixed(2)+'%</td></tr>';
    }
    var blhead='<tr><th>No.</th><th>District</th><th>First Year</th><th>First Year '+caption+'</th><th>Last Year</th><th>Last Year '+caption+'</th><th>Percentage</th></tr>\n';
    return blhead+rate_list.join('\n');
}

function line_district_statistics_percent_rank_b(flot_revenue_data){
    var year_sum=[];
    for (let item of flot_revenue_data){
        for (let blxl=1;blxl<item.length;blxl++){
            var blyear=item[blxl][0]+'年';
            if (year_sum[blyear]==null){
                year_sum[blyear]=0;
            }
            year_sum[blyear]=year_sum[blyear]+item[blxl][1];
        }        
    }

    var flot_percent_data=[];
    for (let blxl=0;blxl<flot_revenue_data.length;blxl++){
        var arr_p=[flot_revenue_data[blxl][0]]; 
        for (let one_year=1;one_year<flot_revenue_data[blxl].length;one_year++){
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
        if (list_t[blcity+'_'+blyear]==null){
            list_t[blcity+'_'+blyear]=[blcity,parseInt(blyear),0];  //地区，年份，营收(或个数) - 保留注释
        }
        list_t[blcity+'_'+blyear][2]=list_t[blcity+'_'+blyear][2]+(revenue_index==-1?1:item[revenue_index]);
    }
    list_t=object2array_b(list_t);
    
    var result_t=[];
    for (let item of list_t){
        if (result_t[item[0]]==null){
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
		if (blfound==-1){
			break;
		}

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
        if (list_t[item[district_index]]==null){
            list_t[item[district_index]]=[item[district_index],0];
        }
        var blvalue=(revenue_index==-1?1:item[revenue_index]);
        if (blvalue=='' || isNaN(blvalue)){continue;}
        list_t[item[district_index]][1]=list_t[item[district_index]][1]+blvalue;
    }
    
    var list_t=object2array_b(list_t);
    list_t.sort(function (a,b){return a[1]<b[1];});
    return list_t;
    //list_t 每个元素形如 ['地区', 收入] - 保留注释
}

function pie_district_statistics_string_rank_b(csarray,fraction_len,caption,denominator,revenue_index){
    //csarray 每个元素形如 ['地区', 收入] - 保留注释
    var bljg=[].concat(csarray);
    var blsum=0;
    for (let blxl=0;blxl<csarray.length;blxl++){
        blsum=blsum+csarray[blxl][1];
        var blvalue=(revenue_index==-1?csarray[blxl][1]:csarray[blxl][1]/denominator);
        if (blvalue=='' || isNaN(blvalue)){continue;}
        csarray[blxl]={'label': csarray[blxl][0],'data': blvalue};
    }
    bljg.push(['合计',blsum]);

    for (let blxl=0;blxl<bljg.length;blxl++){
        bljg[blxl]=bljg[blxl][0]+': '+(revenue_index==-1?bljg[blxl][1]+'家，':(bljg[blxl][1]/denominator).toFixed(fraction_len)+caption+'，')+(bljg[blxl][1]*100/blsum).toFixed(2)+'%';
    }
    
    //csarray 每个元素形如 { label: "地区", data: 收入 } - 保留注释
    //bljg 每个元素为字符串，形如 "美国: 86952891.5百万美元，58.35%" - 保留注释
    return [csarray,bljg];
}

function line_company_revenue_rank_b(csarray,year_index,revenue_index,denominator){
    //csarray 与 line_district_revenue_rank_b() 的 csarray 格式一致 - 保留注释
    var flot_array={};
    for (let item of csarray){
        if (flot_array[item[0]]==null){
            flot_array[item[0]]=[];
        }
        flot_array[item[0]].push([parseInt(item[year_index].substring(0,4)),item[revenue_index]/denominator]);
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
    var list_t=[];
    var flot_array=[];
    
    for (let item of csarray){
        var key_name=item[district_index]+'_'+item[year_index];
        if (list_t[key_name]==null){
            list_t[key_name]=[item[district_index],item[year_index].substring(0,4),0];
        }
        if (flot_array[item[district_index]]==null){
            flot_array[item[district_index]]=[];
        }
        list_t[key_name][2]=list_t[key_name][2]+item[revenue_index]/denominator;
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
