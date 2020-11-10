function load_data_zjedu(){
    var datadir='../jsdata/education/';
    var datalist=["2018","2019","2020"];
    var theyear=datalist[datalist.length-1];
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0){
        if (parseInt(cskeys[0])>=parseInt(datalist[0])){
            theyear=cskeys[0];
        }
    }

    var str_t='';
    for (let item of datalist){
        str_t=str_t+'<a href="?'+item+'" style="text-decoration:none;">';
        if (item==theyear){
            str_t=str_t+'<span style="color:red;">'+item+'年</span>';
        }
        else {
            str_t=str_t+item+'年';
        }
        str_t=str_t+'</a> ';
    }
    document.getElementById('span_years').innerHTML=str_t;

    document.write('\n<SCRIPT language=JavaScript src="'+datadir+'zj'+theyear+'_1_data.js"><\/SCRIPT>\n');
    document.title='💯 浙江省'+theyear+'年普通高校招生普通类平行投档（一段）分数线 查询';
    document.getElementById('span_h2').innerHTML='💯 浙江省'+theyear+'年普通高校招生普通类平行投档（一段）分数线 查询';
}

function mark_2_rank_zjedu(csmark){
    if ('m'+csmark in mark_rank_global){
        var blmiddle=Math.ceil((mark_rank_global['m'+csmark][0]+mark_rank_global['m'+csmark][1])/2);
        return mark_rank_global['m'+csmark].concat([blmiddle]);
    }
    var blmin=Math.floor(csmark);
    var blmax=Math.ceil(csmark);
    if ('m'+blmin in mark_rank_global && 'm'+blmax in mark_rank_global){
        var blmiddle=Math.ceil((mark_rank_global['m'+blmax][1]+mark_rank_global['m'+blmin][0])/2);
        return [mark_rank_global['m'+blmax][1],mark_rank_global['m'+blmin][0],blmiddle];
    }
    else {
        return [-1,-1,-1];
    }
}

function mark_rank_list_zjedu(){
    function sub_mark_rank_list_zjedu_fill_out(csmark){
        if ('m'+csmark in mark_rank_global){
            return mark_rank_global['m'+csmark];
        }
            
        var mark_min;
        var mark_max;
        [mark_min,mark_max]=mark_rank_global['range'];

        var rank_min=0;
        var rank_max=0;
        for (let blxl=mark_min;blxl<=mark_max;blxl++){
            if (!('m'+blxl in mark_rank_global)){continue;}
            if (blxl<csmark){
                if (mark_rank_global['m'+blxl][0]==mark_rank_global['m'+blxl][1]){
                    rank_max=mark_rank_global['m'+blxl][0]-1;
                }
                else {
                    rank_max=mark_rank_global['m'+blxl][0];
                }
            }
            if (blxl>csmark){
                if (mark_rank_global['m'+blxl][0]==mark_rank_global['m'+blxl][1]){
                    rank_min=mark_rank_global['m'+blxl][1]+1;
                }
                else {
                    rank_min=mark_rank_global['m'+blxl][1];
                }
                break;
            }        
        }
        return [rank_min,rank_max];
    }
    //---------------------
    var mark_min=0;
    var mark_max=0;
    for (let item of zj_education_data_global){
        if (item[6]<1){continue;}
        if (!('m'+item[5] in mark_rank_global)){
            mark_rank_global['m'+item[5]]=[0,0];
        }
        if (mark_rank_global['m'+item[5]][0]==0){
            mark_rank_global['m'+item[5]][0]=item[6];
        }
        else {
            mark_rank_global['m'+item[5]][0]=Math.min(item[6], mark_rank_global['m'+item[5]][0]);
        }
        if (mark_rank_global['m'+item[5]][1]==0){
            mark_rank_global['m'+item[5]][1]=item[6];
        }
        else {
            mark_rank_global['m'+item[5]][1]=Math.max(item[6], mark_rank_global['m'+item[5]][1]);
        }
        if (mark_min==0){
            mark_min=item[5];
        }
        else {
            mark_min=Math.min(item[5],mark_min);
        }
        if (mark_max==0){
            mark_max=item[5];
        }
        else {
            mark_max=Math.max(item[5],mark_max);
        }
    }    
    mark_rank_global['range']=[mark_min,mark_max];
    
    var list_t={};
    for (let blxl=mark_min;blxl<=mark_max;blxl++){
        list_t['m'+blxl]=[].concat(sub_mark_rank_list_zjedu_fill_out(blxl));
    }
    mark_rank_global=list_t;
    mark_rank_global['range']=[mark_min,mark_max];
}

function run_txtsearch_zjedu(){
    document.getElementById('divhtml').innerHTML='<span style="font-size:2rem;">数据计算中...</span>';
    td_right_html_zjedu();
    setTimeout(txtsearch_zjedu,1);
}

function median_zjedu(blplan, median_line_list){
    //median_line_list: 计划数和分数线 - 保留注释
    if (blplan%2 == 1){
        var median_no=[[(blplan-1)/2,0]];
    }
    else {
        var median_no=[[blplan/2,0],[blplan/2+1,0]];
    }
    var median_value=0;
    if (median_line_list.length>0){
        if (median_line_list.length==1){
            median_value=median_line_list[0][1];
        }
        else {
            median_line_list.sort(function (a,b){return b[1]>a[1];});
            for (let blxl=0;blxl<median_line_list.length;blxl++){
                if (blxl>0){
                    median_line_list[blxl][0]=median_line_list[blxl][0]+median_line_list[blxl-1][0];
                }
                
                for (let blxl2=0;blxl2<median_no.length;blxl2++){
                    if (median_no[blxl2][0]==median_line_list[blxl][0]){
                        median_no[blxl2][1]=median_line_list[blxl][1];
                    }
                    else if (median_no[blxl2][0]<median_line_list[blxl][0]){
                        if (blxl==0){
                            median_no[blxl2][1]=median_line_list[blxl][1];
                        }
                        else if (median_no[blxl2][0]>median_line_list[blxl-1][0]) {
                            median_no[blxl2][1]=median_line_list[blxl][1];
                        }
                    }
                }
            }
            if (median_no.length==2){
                median_value=(median_no[0][1]+median_no[1][1])/2;
            }
            else {
                median_value=median_no[0][1];
            }
        }
    }
    return median_value;
}

function recent_search_zjedu(csstr=''){
    recent_search_b('recent_search_zjedu',csstr,'txtsearch_zjedu','div_recent_search',['浙江大学','(一流大学建设高校)','(一流学科建设高校)','北京大学|清华大学(:r)']);
}

function txtsearch_zjedu(csword,csreg){
	var csnum=arguments.length;
	if (csnum==0){
        var csword= document.getElementById('input_search').value.trim();
    }
	document.getElementById('input_search').value=csword;
    
	if (csnum<=1){
        var csreg=document.getElementById('input_reg').checked;
    }
    if (csword.slice(-4,)=='(:r)'){
        csreg=true;
        csword=csword.substring(0,csword.length-4);
    }
	document.getElementById('input_reg').checked=csreg;

    recent_search_b('recent_search_zjedu',csword+(csreg?'(:r)':''),'txtsearch_zjedu','div_recent_search');

	var blcount=0;
	var blplan=0;
    var blreal=0;
	var blline=0;
	var blminline=0;
	var blmaxline=0;
    
    //分数线 - 保留注释
    var min_max_line_list=[];
    
    //计划数和分数线 - 保留注释    
    var median_line_list=[];
    
    //计划数和位次 - 保留注释
    var position_list=[];
    
	blschool_public=[];
	jgarray_public=[];
	var blwordlist=csword.split(' ');

	for (let item of zj_education_data_global){
		var bltmp = ','+item[1]+','+item[3]+','+item[4]+','+item[5]+','+item[6]+',';
		
		var blfound=str_reg_search_b(bltmp,blwordlist,csreg);
		if (blfound==-1){
			break;
		}
				
		if (blfound || csword==''){
			blcount=blcount+1;
			blplan=blplan+item[4];
			blline=blline+item[4]*item[5];
            
            min_max_line_list.push(item[5]);
            median_line_list.push([item[4],item[5]]);
            
            if (item[6]>0){
                blreal=blreal+item[4];
                position_list.push([item[4],item[6]]);
            }
            
			blschool_public.push([item[1],item[3],item[4],item[5],item[6]]);
			
			jgarray_public.push(item);
		}
	}
    
    if (min_max_line_list.length>0){
        blmaxline=Math.max(...min_max_line_list);
        blminline=Math.min(...min_max_line_list);
    }

    //median - 保留注释
    var median_value=median_zjedu(blplan,median_line_list);
    
    //位次百分比 - 保留注释
    var position_percent_list=[];
    for (let blxl=0;blxl<=10;blxl++){
        position_percent_list.push([]);
    }
    
    position_list.sort(function (a,b){return a[1]>b[1];});
    for (let blxl=0;blxl<position_list.length;blxl++){
        if (blxl>0){
            position_list[blxl][0]=position_list[blxl][0]+position_list[blxl-1][0];
        }
        var blpercent=parseInt(position_list[blxl][0]*10/blreal);
        position_percent_list[blpercent]=[(position_list[blxl][0]*100/blreal).toFixed(2)+'%',position_list[blxl][1]];
    }

    var bljg='';
    bljg=bljg+'<h4>当前页面记录条数：'+blcount+'</h4>';
    bljg=bljg+'<h4>计划数：'+blplan+'</h4>';
    bljg=bljg+'<h4>实际数：'+blreal+'</h4>';
    bljg=bljg+'<h4>平均分数线：'+(blline/blplan).toFixed(2)+'</h4>';
    bljg=bljg+'<h4>中位数分数线：'+median_value.toFixed(2)+'</h4>';
    bljg=bljg+'<h4>最高分数线：'+blmaxline+'</h4>';
    bljg=bljg+'<h4>最低分数线：'+blminline+'</h4>';
    bljg=bljg+'<ul>';
    for (let item of position_percent_list){
        if (item.length==0){continue;}
        bljg=bljg+'<li>'+item[0]+'的实际录取考生位次在第 '+item[1]+' 名之上</li>';
    }
    bljg=bljg+'</ul>';
    
	document.getElementById('divcount').innerHTML=bljg;
		
	sortdata_zjedu(1,csorder_public);
	setTimeout(school_zjedu,10);
	return;
}

function shcool_arr_zjedu(){
    school_speciality_sum_arr_global=[];
    speciality_popular_arr_global=[];
    school_sum_average_arr_global=[];
    school_median_rank_arr_global=[];
    school_last_number_arr_global=[];
    school_plan_arr_global=[];
    speciality_all_sum_arr_global=[];
    line_count_arr_global=[];

	for (let item of blschool_public){
		if (!school_speciality_sum_arr_global.includes(item[0])){
			school_speciality_sum_arr_global.push(item[0]);
		}
        
        //-----
		if (speciality_popular_arr_global.indexOf(item[1])<0){
			speciality_popular_arr_global.push(item[1]);
		}
        
        //-----
		if (school_sum_average_arr_global[item[0]]==null){
            school_sum_average_arr_global[item[0]]=[item[0],0,0,0];
        }
        //计划数求和 - 保留注释
		school_sum_average_arr_global[item[0]][1]=school_sum_average_arr_global[item[0]][1]+item[2];
        //分数线*计划数，再求和 - 保留注释
		school_sum_average_arr_global[item[0]][2]=school_sum_average_arr_global[item[0]][2]+item[2]*item[3];
        
        //-----
		if (school_median_rank_arr_global[item[0]]==null){
            school_median_rank_arr_global[item[0]]=[item[0],[]];
        }
        //计划数 分数线 列表 - 保留注释
		school_median_rank_arr_global[item[0]][1].push([item[2],item[3]]);       

        //-----
        if (school_last_number_arr_global[item[0]]==null){
            school_last_number_arr_global[item[0]]=[item[0],0];
        }
        school_last_number_arr_global[item[0]][1]=Math.max(school_last_number_arr_global[item[0]][1],item[4]);
        
        //-----
        if (school_plan_arr_global[item[0]]==null){
            //学校，完成计划专业数，未完成计划专业数 - 保留注释
            school_plan_arr_global[item[0]]=[item[0],0,0];
        }
        if (item[4]==0){
            school_plan_arr_global[item[0]][1]=school_plan_arr_global[item[0]][1]+1;
        }
        else {
            school_plan_arr_global[item[0]][2]=school_plan_arr_global[item[0]][2]+1;
        }    

        //-----        
		if (speciality_all_sum_arr_global[item[1]]==null){
            speciality_all_sum_arr_global[item[1]]=[item[1],0,0,0] ;
        }
		speciality_all_sum_arr_global[item[1]][1]=speciality_all_sum_arr_global[item[1]][1]+item[2];
		speciality_all_sum_arr_global[item[1]][2]=speciality_all_sum_arr_global[item[1]][2]+item[2]*item[3];

        //-----
		if (line_count_arr_global['f'+item[3]]==null){
            line_count_arr_global['f'+item[3]]=[item[3],0] ;
        }
		line_count_arr_global['f'+item[3]][1]=line_count_arr_global['f'+item[3]][1]+item[2];
	}
    
    for (let blxl in school_sum_average_arr_global){
        school_sum_average_arr_global[blxl][3]=school_sum_average_arr_global[blxl][2]/school_sum_average_arr_global[blxl][1];
    }
    
    for (let blxl in speciality_all_sum_arr_global){
        speciality_all_sum_arr_global[blxl][3]=speciality_all_sum_arr_global[blxl][2]/speciality_all_sum_arr_global[blxl][1];
    }    
}

function school_zjedu(){
    shcool_arr_zjedu();
    
    //专业最多的学校
    school_speciality_sum_zjedu();
    //专业最少的学校
    school_speciality_sum_zjedu(true);
    
    //流行专业
    speciality_popular_zjedu();
    //罕见专业
    speciality_popular_zjedu(true);
    
	//学校
    school_sum_average_zjedu();
    school_sum_average_zjedu(true);
    
    //中位数分数线排名
    school_median_rank_zjedu();
    school_median_rank_zjedu(true);
    
	//学校录取最低名次排名
    school_last_number_zjedu();
	//学校录取最低名次排名，倒数
    school_last_number_zjedu(true);    
    
    //未完成招生计划的学校(比例)
    school_plan_zjedu();
    //未完成招生计划的学校(专业数量)
    school_plan_zjedu(true);
    
	//专业
    speciality_all_sum_zjedu();
    speciality_all_sum_zjedu(true);
    
	//分数线人数
    line_count_zjedu();        
}

function school_speciality_sum_zjedu(csreverse=false){
	var s_num_t=[];
	for (let one_school of school_speciality_sum_arr_global){
		var blcount=0;
		for (let item of blschool_public){
			if (item[0]==one_school){
                blcount=blcount+1;
            }
		}
		s_num_t.push([one_school,blcount]);
	}
    s_num_t.sort(function(a,b){return a[0].localeCompare(b[0],"zh");});
    if (csreverse){
        s_num_t.sort(function(a,b){return a[1]-b[1];});
    }
    else {
	    s_num_t.sort(function(a,b){return b[1]-a[1];});
    }
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,s_num_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+s_num_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+s_num_t[blxl][1]+'</td></tr>';
	}
	document.getElementById('divschool'+(csreverse?'_reverse':'')).innerHTML='<h4>当前页面学校数：'+school_speciality_sum_arr_global.length+'</h4><h5>专业分类最'+(csreverse?'少':'多')+'的'+Math.min(num_public,s_num_t.length)+'个学校</h5><table>'+th_zjedu(['学校','专业数'])+bljg+'</table>';
    
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divschool'+(csreverse?'_reverse':'')+'">专业分类最'+(csreverse?'少':'多')+'的'+Math.min(num_public,s_num_t.length)+'个学校</a></li>');
}

function speciality_popular_zjedu(csreverse=false){
	var s_num_t=[];
	for (let one_speciality of speciality_popular_arr_global){
		var blcount=0;
		for (let item of blschool_public){
			if (item[1]==one_speciality){
                blcount=blcount+1;
            }
		}
		s_num_t.push([one_speciality,blcount]);
	}
    
    s_num_t.sort(function(a,b){return a[0].localeCompare(b[0],"zh");});
    if (csreverse){
        s_num_t.sort(function(a,b){return a[1]-b[1];});
    }
    else {
	    s_num_t.sort(function(a,b){return b[1]-a[1];});
    }
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,s_num_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+s_num_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+s_num_t[blxl][1]+'</td></tr>';
	}	
	document.getElementById('divmajor'+(csreverse?'_reverse':'')).innerHTML='<h4>当前页面专业数：'+speciality_popular_arr_global.length+'</h4><h5>出现次数最'+(csreverse?'少':'多')+'的'+Math.min(num_public,s_num_t.length)+'个专业</h5><table>'+th_zjedu(['专业','个数'])+bljg+'</table>';

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divmajor'+(csreverse?'_reverse':'')+'">出现次数最'+(csreverse?'少':'多')+'的'+Math.min(num_public,s_num_t.length)+'个专业</a></li>');
}

function school_sum_average_zjedu(csreverse=false){
	var arr2_t=object2array_b(school_sum_average_arr_global);
    if (csreverse){
        arr2_t.sort(function(a,b){return a[1]-b[1];});
    }
    else {
	    arr2_t.sort(function(a,b){return b[1]-a[1];});
    }
    
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,arr2_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+arr2_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][1]+'</td></tr>';
	}
	document.getElementById('divnum'+(csreverse?'_reverse':'')).innerHTML='<h5>计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_public,arr2_t.length)+'个学校</h5><table>'+th_zjedu(['学校','计划数'])+bljg+'</table>';

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divnum'+(csreverse?'_reverse':'')+'">计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_public,arr2_t.length)+'个学校</a></li>');

	//------------------
    //总的分数/计划数 - 保留注释
    if (csreverse){
        arr2_t.sort(function(a,b){return a[3]-b[3];});
    }
    else {
	    arr2_t.sort(function(a,b){return b[3]-a[3];});
    }
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,arr2_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+arr2_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][3].toFixed(2)+'</td><td class=blackline0 nowrap align=right>'+mark_2_rank_zjedu(arr2_t[blxl][3])[2]+'</td></tr>';
	}
	document.getElementById('divaverage'+(csreverse?'_reverse':'')).innerHTML='<h5>平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_public,arr2_t.length)+'个学校</h5><table>'+th_zjedu(['学校','平均分数线','对应位次'])+bljg+'</table>';
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divaverage'+(csreverse?'_reverse':'')+'">平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_public,arr2_t.length)+'个学校</a></li>');
}

function school_median_rank_zjedu(csreverse=false){
    var arr2_t=[];
    //不能使用of - 保留注释
    for (let blxl in school_median_rank_arr_global){
        var speciality_list=school_median_rank_arr_global[blxl];
		var blplan=0;
        for (let arow of speciality_list[1]){
            blplan=blplan+arow[0];
        }
        var blmedian=median_zjedu(blplan,speciality_list[1]);
        arr2_t.push([speciality_list[0],blmedian]);
    }
    if (csreverse){
        arr2_t.sort(function (a,b){return a[1]>b[1];});
    }
    else {
        arr2_t.sort(function (a,b){return b[1]>a[1];});
    }
    
    var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,arr2_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+arr2_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][1].toFixed(2)+'</td><td class=blackline0 nowrap align=right>'+mark_2_rank_zjedu(arr2_t[blxl][1])[2]+'</td></tr>';
	}
	document.getElementById('divmedian'+(csreverse?'_reverse':'')).innerHTML='<h5>中位数分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_public,arr2_t.length)+'个学校</h5><table>'+th_zjedu(['学校','中位数分数线','对应位次'])+bljg+'</table>';
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divmedian'+(csreverse?'_reverse':'')+'">中位数分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_public,arr2_t.length)+'个学校</a></li>');
}

function school_plan_zjedu(sort_by_count=false){
	var arr2_t=[];
	for (let blxl in school_plan_arr_global){
        var item=school_plan_arr_global[blxl];
        arr2_t.push([item[0],item[1],item[2],item[1]*100/(item[1]+item[2])]);
	}
    if (sort_by_count){
        arr2_t.sort(function (a,b){return a[1]<b[1];});
    }
    else {
        arr2_t.sort(function (a,b){return a[3]<b[3];});
    }
   
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,arr2_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+arr2_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][3].toFixed(2)+'%</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][1]+'</td><td class=blackline0 nowrap align=right>'+(arr2_t[blxl][1]+arr2_t[blxl][2])+'</td></tr>';
	}
	document.getElementById('divplan'+(sort_by_count?'_reverse':'')).innerHTML='<h5>未完成招生计划的前'+Math.min(num_public,arr2_t.length)+'个学校'+(sort_by_count?'(数量)':'(比例)')+'</h5><table>'+th_zjedu(['学校','未完成的专业比例','未完成的专业数','全部专业数'])+bljg+'</table>';
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#divplan'+(sort_by_count?'_reverse':'')+'">未完成招生计划的前'+Math.min(num_public,arr2_t.length)+'个学校'+(sort_by_count?'(数量)':'(比例)')+'</a></li>');
}

function school_last_number_zjedu(csreverse=false){
	var arr2_t=[];
	for (let blxl in school_last_number_arr_global){
        if (school_last_number_arr_global[blxl][1]>0){
		    arr2_t.push(school_last_number_arr_global[blxl]);
        }
	}
    if (csreverse){
        arr2_t.sort(function (a,b){return a[1]<b[1];});
    }
    else {
        arr2_t.sort(function (a,b){return a[1]>b[1];});
    }
    
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,arr2_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+arr2_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][1]+'</td></tr>';
	}
	document.getElementById('divposition'+(csreverse?'_reverse':'')).innerHTML='<h5>录取位次排名，'+(csreverse?'后':'前')+Math.min(num_public,arr2_t.length)+'个学校</h5><table>'+th_zjedu(['学校','最低录取位次'])+bljg+'</table>';
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divposition'+(csreverse?'_reverse':'')+'">录取位次排名，'+(csreverse?'后':'前')+Math.min(num_public,arr2_t.length)+'个学校</a></li>');
}

function speciality_all_sum_zjedu(csreverse=false){
	var arr2_t=object2array_b(speciality_all_sum_arr_global);
    arr2_t.sort(function(a,b){return a[0].localeCompare(b[0],"zh");});
    if (csreverse){
        arr2_t.sort(function(a,b){return a[1]-b[1];});
    }
    else {
	    arr2_t.sort(function(a,b){return b[1]-a[1];});
    }
    
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,arr2_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+arr2_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][1]+'</td></tr>';
	}
	document.getElementById('divnum2'+(csreverse?'_reverse':'')).innerHTML='<h5>计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_public,arr2_t.length)+'个专业</h5><table>'+th_zjedu(['专业','计划数'])+bljg+'</table>';

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divnum2'+(csreverse?'_reverse':'')+'">计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_public,arr2_t.length)+'个专业</a></li>');

	//------------------
    if (csreverse){
        arr2_t.sort(function(a,b){return a[3]-b[3];});
    }
    else {
	    arr2_t.sort(function(a,b){return b[3]-a[3];});
    }
	var bljg='';
	for (let blxl=0;blxl<Math.min(num_public,arr2_t.length);blxl++){
		bljg=bljg+'<tr class=odd><td class=blackline0>'+arr2_t[blxl][0]+'</td><td class=blackline0 nowrap align=right>'+arr2_t[blxl][3].toFixed(2)+'</td></tr>';
	}
	document.getElementById('divaverage2'+(csreverse?'_reverse':'')).innerHTML='<h5>平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_public,arr2_t.length)+'个专业</h5><table>'+th_zjedu(['专业','平均分数线'])+bljg+'</table>';
    
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divaverage2'+(csreverse?'_reverse':'')+'">平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_public,arr2_t.length)+'个专业</a></li>');    
}

function line_count_zjedu(){
    var arr2_t=object2array_b(line_count_arr_global);
    arr2_t.sort(function(a,b){return b[0]-a[0];});
	var bljg='';
	var blscore_t=0;
	for (let item of arr2_t){
		if (blscore_t>0){
			for (let blxl2=blscore_t+1;blxl2<item[0];blxl2++){
				bljg=bljg+'<tr class=odd><td class=blackline0>'+blxl2+'</td><td class=blackline0 nowrap align=right>0</td></tr>';
			}
		}
		blscore_t=item[0];
		bljg=bljg+'<tr class=odd><td class=blackline0>'+item[0]+'</td><td class=blackline0 nowrap align=right>'+item[1]+'</td></tr>';
	}
	document.getElementById('divnum3').innerHTML='<h5>(最低)分数线和招收人数</h5><table>'+th_zjedu(['(最低)分数线','计划数'])+bljg+'</table>';

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#divnum3">(最低)分数线和招收人数</a></li>');

    var list_t=[];
    for (let item of arr2_t){
        list_t.push(item[0]);
    }
    var min_line=Math.min(...list_t);
    var max_line=Math.max(...list_t);
    var arr3_t=[];
    for (let blxl=min_line;blxl<=max_line;blxl++){
        arr3_t['l'+blxl]=[blxl,0];
    }
    for (let item of arr2_t){
        arr3_t['l'+item[0]][1]=item[1];
    }
    
    flot_lines_k([['分数线和招收人数'].concat(object2array_b(arr3_t))],'div_line_count_flot','ne',false,"",'m',y1unit='人');
}

function th_zjedu(cslist){
    return '<tr><th class=blackline nowrap>'+cslist.join('</th><th class=blackline nowrap>')+'</th></tr>';
}

function sortdata_zjedu(cstype){
	switch (cstype){
		case 1:
		case 3:
			if (csorder_public==-1){
				jgarray_public.sort(function(a,b){return a[cstype].localeCompare(b[cstype],"zh");});
			}
			else{
				jgarray_public.sort(function(a,b){return b[cstype].localeCompare(a[cstype],"zh");});
			}
			break;
		case 4:
		case 5:
		case 6:
			if (csorder_public==-1){
				jgarray_public.sort(function(a,b){return a[cstype]-b[cstype];});
			}
			else{
				jgarray_public.sort(function(a,b){return b[cstype]-a[cstype];});
			}
			break;
	}
	var bljg='';
	for (let blxl=0;blxl<jgarray_public.length;blxl++){
        var item=jgarray_public[blxl];
		bljg=bljg+'<tr class=odd><td class=blackline0 align=right nowrap>'+(parseInt(blxl)+1)+'</td><td class=blackline0>'+item[1]+'</td><td class=blackline0>'+item[3]+'</td><td class=blackline0 nowrap align=right>'+item[4]+'</td><td class=blackline0 nowrap align=right>'+item[5]+'</td><td class=blackline0 nowrap align=right>'+item[6]+'</td></tr>';
	}

	var blhtml = document.getElementById('divhtml');
    var blths='<tr><th class=blackline nowrap>序号</th>';
    blths=blths+'<th class=blackline2 onclick="javascript:csorder_public=csorder_public*-1;sortdata_zjedu(1);" nowrap>学校名称</th>';
    blths=blths+'<th class=blackline2 onclick="javascript:csorder_public=csorder_public*-1;sortdata_zjedu(3);" nowrap>专业名称</th>';
    blths=blths+'<th class=blackline2 onclick="javascript:csorder_public=csorder_public*-1;sortdata_zjedu(4);" nowrap>计划数</th>';
    blths=blths+'<th class=blackline2 onclick="javascript:csorder_public=csorder_public*-1;sortdata_zjedu(5);" nowrap nowrap>分数线</th>';
    blths=blths+'<th class=blackline2 onclick="javascript:csorder_public=csorder_public*-1;sortdata_zjedu(6);" nowrap>位次</th></tr>';
    blhtml.innerHTML='<table>'+blths+bljg+'</table>';
}

function search_demo_zjedu(){
	var bljg='<p>搜索语法示例：</p>\n';
	bljg=bljg+'<ol>\n';
	bljg=bljg+'<li>必须含有宝玉，并且必须含有林黛玉（<b>+宝玉 +林黛玉</b>）</li>\n';
	bljg=bljg+'<li>或者含有宝玉，或者含有林黛玉（<b>宝玉 林黛玉</b>）</li>\n';
	bljg=bljg+'<li>必须含有宝玉，并且必须不含有林黛玉（<b>+宝玉 -林黛玉</b>）</li>\n';
	bljg=bljg+'<li>或者含有宝玉，并且必须含有林黛玉（<b>宝玉 +林黛玉</b>）</li>\n';
	bljg=bljg+'<li>查询分数线 588 分（<b>,588,</b>）</li>\n';
	bljg=bljg+'<li>用正则表达式查询分数线 600 分及以上（<b>,6\\d\\d,</b>）</li>\n';
	bljg=bljg+'<li>用正则表达式查询分数线 621 分及以上（<b>,6[2-9][1-9],</b>）</li>\n';
	bljg=bljg+'</ol>\n';
	document.getElementById('divhtml').innerHTML=bljg;
	
	return;
}

function td_right_html_zjedu(){
    var otd=document.getElementById('td_right');
    if (otd){
        var divs=["divcount","divschool","divmajor","divnum","divaverage","divmedian","divposition","divnum2","divaverage2","divplan","divnum3"];
        var bljg='<ol id="ol_anames"></ol>';
        for (let item of divs){
            bljg=bljg+'<div id="'+item+'"></div>';
            bljg=bljg+'<div id="'+item+'_reverse"></div>';
        }
        otd.innerHTML=bljg;
    }
}

function check_data_zjedu(){
    var list_t=[0,0,0];
    for (let item of zj_education_data_global){
        list_t[0]=list_t[0]+item[4];
        list_t[1]=list_t[1]+item[5];
        list_t[2]=list_t[2]+item[6];
    }
    console.log('记录数：',zj_education_data_global.length);
    console.log('计划数求和：',list_t[0]);
    console.log('分数线求和：',list_t[1]);
    console.log('位次求和：',list_t[2]);
}
