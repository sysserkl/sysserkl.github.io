function load_data_zjedu(){
    zj_current_year_global=zj_year_range_global[1].toString();
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0){
        var blyear=parseInt(cskeys[0]);
        if (!isNaN(blyear)){
            if (blyear>=zj_year_range_global[0] && blyear<=zj_year_range_global[1]){
                zj_current_year_global=blyear.toString();
            }
        }
    }
    
    klbase_addons_import_js_b([],[],['education/zj'+zj_current_year_global+'_university_data.js','education/zj_exam_range_data.js']);
    document.title='浙江省'+zj_current_year_global+'年普通高校招生普通类平行投档（一段）分数线 查询';
    document.getElementById('span_h2').innerHTML='浙江省'+zj_current_year_global+'年普通高校招生普通类平行投档（一段）分数线 查询';
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
    } else {
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
                } else {
                    rank_max=mark_rank_global['m'+blxl][0];
                }
            }
            if (blxl>csmark){
                if (mark_rank_global['m'+blxl][0]==mark_rank_global['m'+blxl][1]){
                    rank_min=mark_rank_global['m'+blxl][1]+1;
                } else {
                    rank_min=mark_rank_global['m'+blxl][1];
                }
                break;
            }        
        }
        return [rank_min,rank_max];
    }
    //-----------------------
    var mark_min=0;
    var mark_max=0;
    for (let item of zj_university_global){
        if (item[6]<1){continue;}
        if (!('m'+item[5] in mark_rank_global)){
            mark_rank_global['m'+item[5]]=[0,0];
        }
        if (mark_rank_global['m'+item[5]][0]==0){
            mark_rank_global['m'+item[5]][0]=item[6];
        } else {
            mark_rank_global['m'+item[5]][0]=Math.min(item[6], mark_rank_global['m'+item[5]][0]);
        }
        if (mark_rank_global['m'+item[5]][1]==0){
            mark_rank_global['m'+item[5]][1]=item[6];
        } else {
            mark_rank_global['m'+item[5]][1]=Math.max(item[6], mark_rank_global['m'+item[5]][1]);
        }
        if (mark_min==0){
            mark_min=item[5];
        } else {
            mark_min=Math.min(item[5],mark_min);
        }
        if (mark_max==0){
            mark_max=item[5];
        } else {
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

function run_txtsearch_zjedu(csstr=false){
    if (csstr!==false){
        document.getElementById('input_search').value=csstr;
    }
    document.getElementById('div_line_count_flot').innerHTML='';
    document.getElementById('divhtml').innerHTML='<span style="font-size:2rem;">数据计算中...</span>';
    td_right_html_zjedu();
    setTimeout(txtsearch_zjedu,1);
}

function num_change_zjedu(csvalue=false){
    if (csvalue===false){
        csvalue=document.getElementById('input_max_num_zjc').value.trim();
    }
    csvalue=parseInt(csvalue);
    if (isNaN(csvalue)){return;}
    if (csvalue>0){
        num_zjc_global=csvalue;
    }
}

function median_zjedu(blplan, median_line_list){
    //median_line_list: 计划数和分数线 - 保留注释
    if (blplan%2 == 1){
        var median_no=[[(blplan-1)/2,0]];
    } else {
        var median_no=[[blplan/2,0],[blplan/2+1,0]];
    }
    var median_value=0;
    if (median_line_list.length>0){
        if (median_line_list.length==1){
            median_value=median_line_list[0][1];
        } else {
            median_line_list.sort(function (a,b){return b[1]>a[1] ? 1 : -1;});
            for (let blxl=0,lent=median_line_list.length;blxl<lent;blxl++){
                if (blxl>0){
                    median_line_list[blxl][0]=median_line_list[blxl][0]+median_line_list[blxl-1][0];
                }
                
                for (let blxl2=0,lenb=median_no.length;blxl2<lenb;blxl2++){
                    if (median_no[blxl2][0]==median_line_list[blxl][0]){
                        median_no[blxl2][1]=median_line_list[blxl][1];
                    } else if (median_no[blxl2][0]<median_line_list[blxl][0]){
                        if (blxl==0){
                            median_no[blxl2][1]=median_line_list[blxl][1];
                        } else if (median_no[blxl2][0]>median_line_list[blxl-1][0]){
                            median_no[blxl2][1]=median_line_list[blxl][1];
                        }
                    }
                }
            }
            if (median_no.length==2){
                median_value=(median_no[0][1]+median_no[1][1])/2;
            } else {
                median_value=median_no[0][1];
            }
        }
    }
    return median_value;
}

function recent_search_zjedu(csstr=''){
    recent_search_b('recent_search_zjedu',csstr,'run_txtsearch_zjedu','div_recent_search',['浙江大学','(一流大学建设高校)','(一流学科建设高校)','北京大学|清华大学(:r)',',.+?,.*法学(:r)']);
}

function txtsearch_zjedu(csword=false){
	if (csword===false){
        csword= document.getElementById('input_search').value.trim();
    }
    num_change_zjedu();
    
    var csreg=klmenu_check_b('span_reg_zjedu',false);
    
    [csword,csreg]=str_reg_check_b(csword,csreg);

    recent_search_zjedu(csword);
    document.getElementById('input_search').value=csword;
    
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
    
	school_zjc_global=[];
	jgarray_zjc_global=[];
	var blwordlist=csword.split(' ');

	for (let item of zj_university_global){
        //item 形如：[ "0001", "浙江大学", "001", "人文科学试验班", 76, 672, 4221 ] - 保留注释
		var bltmp = ','+item[1]+','+item[3]+','+item[4]+','+item[5]+','+item[6]+',';
		
		var blfound=str_reg_search_b(bltmp,blwordlist,csreg);
		if (blfound==-1){break;}
				
		if (blfound || csword==''){
			blcount=blcount+1;
			blplan=blplan+item[4];  //计划数 - 保留注释
			blline=blline+item[4]*item[5];
            
            min_max_line_list.push(item[5]);
            median_line_list.push([item[4],item[5]]);   //计划数，分数线 - 保留注释
            
            if (item[6]>0){
                blreal=blreal+item[4];
                position_list.push([item[4],item[6]]);
            }
            
			school_zjc_global.push([item[1],item[3],item[4],item[5],item[6]]);
			
			jgarray_zjc_global.push(item);
		}
	}
    
    result_percent_b('span_array_count',jgarray_zjc_global.length,zj_university_global.length,2);
    
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
    
    position_list.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    for (let blxl=0,lent=position_list.length;blxl<lent;blxl++){
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
		
	sortdata_zjedu(1,csorder_zjc_global);
	setTimeout(school_zjedu,10);
}

function school_arr_zjedu(csarr,selected_key=[]){
    var data_dict={
    'school_speciality_sum':[],
    'speciality_popular':[],
    'school_sum_average':{},
    'school_median_rank':{},
    'school_last_number':{},
    'school_plan':{},
    'speciality_all_sum':{},
    'line_count':{},
    };

    var selected_len=selected_key.length;
    
	for (let item of csarr){
        if (selected_len==0 || selected_key.includes('school_speciality_sum')){
            if (!data_dict['school_speciality_sum'].includes(item[0])){
                data_dict['school_speciality_sum'].push(item[0]);
            }
        }
        //---
        if (selected_len==0 || selected_key.includes('speciality_popular')){
            if (!data_dict['speciality_popular'].includes(item[1])){
                data_dict['speciality_popular'].push(item[1]);
            }
        }
        //---
        var key='k_'+item[0];
        
        if (selected_len==0 || selected_key.includes('school_sum_average')){
            if (data_dict['school_sum_average'][key]==undefined){
                data_dict['school_sum_average'][key]=[item[0],0,0,0];
            }
            //计划数求和 - 保留注释
            data_dict['school_sum_average'][key][1]=data_dict['school_sum_average'][key][1]+item[2];
            //分数线*计划数，再求和 - 保留注释
            data_dict['school_sum_average'][key][2]=data_dict['school_sum_average'][key][2]+item[2]*item[3];
        }
        
        //---
        if (selected_len==0 || selected_key.includes('school_median_rank')){
            if (data_dict['school_median_rank'][key]==undefined){
                data_dict['school_median_rank'][key]=[item[0],[]];
            }
            //计划数 分数线 列表 - 保留注释
            data_dict['school_median_rank'][key][1].push([item[2],item[3]]);       
        }
        //---
        if (selected_len==0 || selected_key.includes('school_last_number')){
            if (data_dict['school_last_number'][key]==undefined){
                data_dict['school_last_number'][key]=[item[0],0];
            }
            data_dict['school_last_number'][key][1]=Math.max(data_dict['school_last_number'][key][1],item[4]);
        }
        //---
        if (selected_len==0 || selected_key.includes('school_plan')){
            if (data_dict['school_plan'][key]==undefined){
                //学校，完成计划专业数，未完成计划专业数 - 保留注释
                data_dict['school_plan'][key]=[item[0],0,0];
            }
            if (item[4]==0){
                data_dict['school_plan'][key][1]=data_dict['school_plan'][key][1]+1;
            } else {
                data_dict['school_plan'][key][2]=data_dict['school_plan'][key][2]+1;
            }    
        }
        //-----      
        var key='k_'+item[1];  
        if (selected_len==0 || selected_key.includes('speciality_all_sum')){
            if (data_dict['speciality_all_sum'][key]==undefined){
                data_dict['speciality_all_sum'][key]=[item[1],0,0,0] ;
            }
            data_dict['speciality_all_sum'][key][1]=data_dict['speciality_all_sum'][key][1]+item[2];
            data_dict['speciality_all_sum'][key][2]=data_dict['speciality_all_sum'][key][2]+item[2]*item[3];
        }
        //---
        var key='k_'+item[3];  
        if (selected_len==0 || selected_key.includes('line_count')){
            if (data_dict['line_count'][key]==undefined){
                data_dict['line_count'][key]=[item[3],0] ;
            }
            data_dict['line_count'][key][1]=data_dict['line_count'][key][1]+item[2];
        }
	}
    
    for (let key in data_dict['school_sum_average']){
        data_dict['school_sum_average'][key][3]=data_dict['school_sum_average'][key][2]/data_dict['school_sum_average'][key][1];
    }
    
    for (let key in data_dict['speciality_all_sum']){
        data_dict['speciality_all_sum'][key][3]=data_dict['speciality_all_sum'][key][2]/data_dict['speciality_all_sum'][key][1];
    }
    
    return data_dict;
}

function school_zjedu(){
    var data_dict=school_arr_zjedu(school_zjc_global);
    
    //专业最多的学校
    school_speciality_sum_zjedu(data_dict['school_speciality_sum']);
    //专业最少的学校
    school_speciality_sum_zjedu(data_dict['school_speciality_sum'],true);
    
    //流行专业
    speciality_popular_zjedu(data_dict['speciality_popular']);
    //罕见专业
    speciality_popular_zjedu(data_dict['speciality_popular'],true);
    
	//学校
    school_sum_average_zjedu(data_dict['school_sum_average']);
    school_sum_average_zjedu(data_dict['school_sum_average'],true);
    
    //中位数分数线排名
    school_median_rank_zjedu(data_dict['school_median_rank']);
    school_median_rank_zjedu(data_dict['school_median_rank'],true);
    
	//学校录取最低名次排名
    school_last_number_zjedu(data_dict['school_last_number']);
	//学校录取最低名次排名，倒数
    school_last_number_zjedu(data_dict['school_last_number'],true);    
    
    //未完成招生计划的学校(比例)
    school_plan_zjedu(data_dict['school_plan']);
    //未完成招生计划的学校(专业数量)
    school_plan_zjedu(data_dict['school_plan'],true);
    
	//专业
    speciality_all_sum_zjedu(data_dict['speciality_all_sum']);
    speciality_all_sum_zjedu(data_dict['speciality_all_sum'],true);
    
	//分数线人数
    line_count_zjedu(data_dict['line_count']);
    
    //---
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('td#td_right span.oblong_box'));
}

function school_speciality_sum_zjedu(data_school_speciality_sum,csreverse=false){
	var s_num_t=[];
	for (let one_school of data_school_speciality_sum){
		var blcount=0;
		for (let item of school_zjc_global){
			if (item[0]==one_school){
                blcount=blcount+1;
            }
		}
		s_num_t.push([one_school,blcount]);
	}
    s_num_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    if (csreverse){
        s_num_t.sort(function(a,b){return a[1]>b[1] ? 1 : -1;});
    } else {
	    s_num_t.sort(function(a,b){return b[1]>a[1] ? 1 : -1;});
    }
	var bljg='';
	for (let blxl=0,lent=Math.min(num_zjc_global,s_num_t.length);blxl<lent;blxl++){
		bljg=bljg+'<tr><td>'+s_num_t[blxl][0]+'</td><td nowrap align=right>'+s_num_t[blxl][1]+'</td></tr>';
	}
    
    var bltitle='当专业分类最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,s_num_t.length)+'个学校';
	document.getElementById('divschool'+(csreverse?'_reverse':'')).innerHTML='<h4>当前页面学校数：'+data_school_speciality_sum.length+'</h4>'+th_zjedu('divschool'+(csreverse?'_reverse':''),['学校','专业数'],bljg,bltitle);

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divschool'+(csreverse?'_reverse':'')+'">专业分类最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,s_num_t.length)+'个学校</a></li>');
}

function speciality_popular_zjedu(data_speciality_popular,csreverse=false){
	var s_num_t=[];
	for (let one_speciality of data_speciality_popular){
		var blcount=0;
		for (let item of school_zjc_global){
			if (item[1]==one_speciality){
                blcount=blcount+1;
            }
		}
		s_num_t.push([one_speciality,blcount]);
	}
    
    s_num_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    if (csreverse){
        s_num_t.sort(function(a,b){return a[1]>b[1] ? 1 : -1;});
    } else {
	    s_num_t.sort(function(a,b){return b[1]>a[1] ? 1 : -1;});
    }
	var bljg='';
	for (let blxl=0,lent=Math.min(num_zjc_global,s_num_t.length);blxl<lent;blxl++){
		bljg=bljg+'<tr><td>'+s_num_t[blxl][0]+'</td><td nowrap align=right>'+s_num_t[blxl][1]+'</td></tr>';
	}
    
    var bltitle='出现次数最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,s_num_t.length)+'个专业';
	document.getElementById('divmajor'+(csreverse?'_reverse':'')).innerHTML='<h4>当前页面专业数：'+data_speciality_popular.length+'</h4>'+th_zjedu('divmajor'+(csreverse?'_reverse':''),['专业','个数'],bljg,bltitle);

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divmajor'+(csreverse?'_reverse':'')+'">出现次数最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,s_num_t.length)+'个专业</a></li>');
}

function school_sum_average_zjedu(data_school_sum_average,csreverse=false,show_html=true,show_csv=true,add_table=true,title_prefix=''){
	var arr2_t=object2array_b(data_school_sum_average);
    arr2_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    if (csreverse){
        arr2_t.sort(function(a,b){return a[1]>b[1] ? 1 : -1;});
    } else {
	    arr2_t.sort(function(a,b){return b[1]>a[1] ? 1 : -1;});
    }
    
	var bljg1='';
    var value1_list=[];
	for (let blxl=0,lent=Math.min(num_zjc_global,arr2_t.length);blxl<lent;blxl++){
        value1_list.push([arr2_t[blxl][0],arr2_t[blxl][1]]);
		bljg1=bljg1+'<tr><td>'+arr2_t[blxl][0]+'</td><td nowrap align=right>'+arr2_t[blxl][1]+'</td></tr>';
	}
    
    var bltitle=title_prefix+'计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个学校';
    
    bljg1=th_zjedu('divnum'+(csreverse?'_reverse':''),['学校','计划数'],bljg1,bltitle,show_csv,add_table);
    if (show_html){
        document.getElementById('divnum'+(csreverse?'_reverse':'')).innerHTML=bljg1;

        document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divnum'+(csreverse?'_reverse':'')+'">计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个学校</a></li>');
    }
	//-----------------------
    //总的分数/计划数 - 保留注释
    if (csreverse){
        arr2_t.sort(function(a,b){return a[3]>b[3] ? 1 : -1;});
    } else {
	    arr2_t.sort(function(a,b){return b[3]>a[3] ? 1 : -1;});
    }
    
	var bljg2='';
    var value2_list=[];
	for (let blxl=0,lent=Math.min(num_zjc_global,arr2_t.length);blxl<lent;blxl++){
        var blrank=mark_2_rank_zjedu(arr2_t[blxl][3])[2];
        value2_list.push([arr2_t[blxl][0],arr2_t[blxl][3],blrank]);
		bljg2=bljg2+'<tr><td>'+arr2_t[blxl][0]+'</td><td nowrap align=right>'+arr2_t[blxl][3].toFixed(2)+'</td><td nowrap align=right>'+blrank+'</td></tr>';
	}
    
    var bltitle=title_prefix+'平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个学校';
    
    bljg2=th_zjedu('divaverage'+(csreverse?'_reverse':''),['学校','平均分数线','对应位次'],bljg2,bltitle,show_csv,add_table);
    if (show_html){
	    document.getElementById('divaverage'+(csreverse?'_reverse':'')).innerHTML=bljg2;
    
        document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divaverage'+(csreverse?'_reverse':'')+'">平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个学校</a></li>');
    }
    return [bljg1,value1_list,bljg2,value2_list];
}

function school_median_rank_zjedu(data_school_median_rank,csreverse=false){
    var arr2_t=[];
    //不能使用of - 保留注释
    for (let key in data_school_median_rank){
        var speciality_list=data_school_median_rank[key];
		var blplan=0;
        for (let arow of speciality_list[1]){
            blplan=blplan+arow[0];
        }
        var blmedian=median_zjedu(blplan,speciality_list[1]);
        arr2_t.push([speciality_list[0],blmedian]);
    }
    arr2_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    if (csreverse){
        arr2_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    } else {
        arr2_t.sort(function (a,b){return b[1]>a[1] ? 1 : -1;});
    }
    
    var bljg='';
	for (let blxl=0,lent=Math.min(num_zjc_global,arr2_t.length);blxl<lent;blxl++){
		bljg=bljg+'<tr><td>'+arr2_t[blxl][0]+'</td><td nowrap align=right>'+arr2_t[blxl][1].toFixed(2)+'</td><td nowrap align=right>'+mark_2_rank_zjedu(arr2_t[blxl][1])[2]+'</td></tr>';
	}
    
    var bltitle='中位数分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个学校';
	document.getElementById('divmedian'+(csreverse?'_reverse':'')).innerHTML=th_zjedu('divmedian'+(csreverse?'_reverse':''),['学校','中位数分数线','对应位次'],bljg,bltitle);
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divmedian'+(csreverse?'_reverse':'')+'">中位数分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个学校</a></li>');
}

function school_plan_zjedu(data_school_plan,sort_by_count=false){
	var arr2_t=[];
	for (let key in data_school_plan){
        var item=data_school_plan[key];
        arr2_t.push([item[0],item[1],item[2],item[1]*100/(item[1]+item[2])]);
	}
    
    arr2_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    if (sort_by_count){
        arr2_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    } else {
        arr2_t.sort(function (a,b){return a[3]<b[3] ? 1 : -1;});
    }
   
	var bljg='';
	for (let blxl=0,lent=Math.min(num_zjc_global,arr2_t.length);blxl<lent;blxl++){
		bljg=bljg+'<tr><td>'+arr2_t[blxl][0]+'</td><td nowrap align=right>'+arr2_t[blxl][3].toFixed(2)+'%</td><td nowrap align=right>'+arr2_t[blxl][1]+'</td><td nowrap align=right>'+(arr2_t[blxl][1]+arr2_t[blxl][2])+'</td></tr>';
	}
    
    var bltitle='未完成招生计划的前'+Math.min(num_zjc_global,arr2_t.length)+'个学校'+(sort_by_count?'(数量)':'(比例)');
	document.getElementById('divplan'+(sort_by_count?'_reverse':'')).innerHTML=th_zjedu('divplan'+(sort_by_count?'_reverse':''),['学校','未完成的专业比例','未完成的专业数','全部专业数'],bljg,bltitle);
    
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#divplan'+(sort_by_count?'_reverse':'')+'">未完成招生计划的前'+Math.min(num_zjc_global,arr2_t.length)+'个学校'+(sort_by_count?'(数量)':'(比例)')+'</a></li>');
}

function school_last_number_zjedu(data_school_last_number,csreverse=false){
	var arr2_t=[];
	for (let key in data_school_last_number){
        if (data_school_last_number[key][1]>0){
		    arr2_t.push(data_school_last_number[key]);
        }
	}
    arr2_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    if (csreverse){
        arr2_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    } else {
        arr2_t.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    }
    
	var bljg='';
	for (let blxl=0,lent=Math.min(num_zjc_global,arr2_t.length);blxl<lent;blxl++){
		bljg=bljg+'<tr><td>'+arr2_t[blxl][0]+'</td><td nowrap align=right>'+arr2_t[blxl][1]+'</td></tr>';
	}
    
    var bltitle='录取位次排名，'+(csreverse?'后':'前')+Math.min(num_zjc_global,arr2_t.length)+'个学校';
	document.getElementById('divposition'+(csreverse?'_reverse':'')).innerHTML=th_zjedu('divposition'+(csreverse?'_reverse':''),['学校','最低录取位次'],bljg,bltitle);
    
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divposition'+(csreverse?'_reverse':'')+'">录取位次排名，'+(csreverse?'后':'前')+Math.min(num_zjc_global,arr2_t.length)+'个学校</a></li>');
}

function speciality_all_sum_zjedu(data_speciality_all_sum,csreverse=false,show_csv=true){
	var arr2_t=object2array_b(data_speciality_all_sum);
    arr2_t.sort(function(a,b){return zh_sort_b(a,b,false,0);});
    if (csreverse){
        arr2_t.sort(function(a,b){return a[1]>b[1] ? 1 : -1;});
    } else {
	    arr2_t.sort(function(a,b){return b[1]>a[1] ? 1 : -1;});
    }
    
	var bljg='';
	for (let blxl=0,lent=Math.min(num_zjc_global,arr2_t.length);blxl<lent;blxl++){
		bljg=bljg+'<tr><td>'+arr2_t[blxl][0]+'</td><td nowrap align=right>'+arr2_t[blxl][1]+'</td></tr>';
	}
    
    var bltitle='计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个专业';
	document.getElementById('divnum2'+(csreverse?'_reverse':'')).innerHTML=th_zjedu('divnum2'+(csreverse?'_reverse':''),['专业','计划数'],bljg,bltitle,show_csv);

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divnum2'+(csreverse?'_reverse':'')+'">计划招收人数最'+(csreverse?'少':'多')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个专业</a></li>');

	//-----------------------
    if (csreverse){
        arr2_t.sort(function(a,b){return a[3]>b[3] ? 1 : -1;});
    } else {
	    arr2_t.sort(function(a,b){return b[3]>a[3] ? 1 : -1;});
    }
	var bljg='';
	for (let blxl=0,lent=Math.min(num_zjc_global,arr2_t.length);blxl<lent;blxl++){
		bljg=bljg+'<tr><td>'+arr2_t[blxl][0]+'</td><td nowrap align=right>'+arr2_t[blxl][3].toFixed(2)+'</td></tr>';
	}
    
    var bltitle='平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个专业';
	document.getElementById('divaverage2'+(csreverse?'_reverse':'')).innerHTML=th_zjedu('divaverage2'+(csreverse?'_reverse':''),['专业','平均分数线'],bljg,bltitle,show_csv);
    
    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#'+'divaverage2'+(csreverse?'_reverse':'')+'">平均分数线最'+(csreverse?'低':'高')+'的'+Math.min(num_zjc_global,arr2_t.length)+'个专业</a></li>');    
}

function line_count_zjedu(data_line_count){
    var arr2_t=object2array_b(data_line_count);
    arr2_t.sort(function(a,b){return b[0]>a[0] ? 1 : -1;});
	var bljg='';
	var blscore_t=0;
	for (let item of arr2_t){
		if (blscore_t>0){
			for (let blxl2=blscore_t+1;blxl2<item[0];blxl2++){
				bljg=bljg+'<tr><td>'+blxl2+'</td><td nowrap align=right>0</td></tr>';
			}
		}
		blscore_t=item[0];
		bljg=bljg+'<tr><td>'+item[0]+'</td><td nowrap align=right>'+item[1]+'</td></tr>';
	}
	document.getElementById('divnum3').innerHTML=th_zjedu('divnum3',['(最低)分数线','计划数'],bljg,'(最低)分数线和招收人数');

    document.getElementById('ol_anames').insertAdjacentHTML('beforeend','<li><a href="#divnum3">(最低)分数线和招收人数</a></li>');

    var list_t=[];
    for (let item of arr2_t){
        list_t.push(item[0]);
    }
    
    if (list_t.length==0){return;}
    
    var min_line=Math.min(...list_t);
    var max_line=Math.max(...list_t);
    var arr3_t=[];
    for (let blxl=min_line;blxl<=max_line;blxl++){
        arr3_t['l'+blxl]=[blxl,0];
    }
    for (let item of arr2_t){
        arr3_t['l'+item[0]][1]=item[1];
    }

    canvas_size_set_zjedu();
    arr3_t=object2array_b(arr3_t);
    //arr3_t 每个元素形如：[ 664, 254 ] - 保留注释
    var result_t=[];
    for (let arow of arr3_t){
        result_t.push('['+arow[0]+','+arow[1]+'],');
    }
    document.getElementById('div_status').innerHTML='<textarea>"'+zj_current_year_global+'",'+result_t.join('')+'</textarea>';
    flot_lines_b([['分数线和招收人数'].concat(arr3_t)],'div_line_count_flot','ne',false,'','m',y1unit='人');
}

function population_sum_arr_get_zjedu(csarr){
    var population=0;
    var blarr2=[];
    for (let item of csarr){
        population=population+item[1];
        blarr2.push(item.concat([population]));
    }
    return [population,blarr2];
}

function gini_index_zjedu(){
    var blrange=year_selected_zjedu();
    if (blrange.size==0){return;}
    
    var population,blarr2;
    var flot_list=[];
    var tr_list=[];
    var textarea_list=[];
    for (let one_year of blrange){
        var x_list=[0];
        var y_list=[0];
        var list_t=[one_year+'年#points:false#',[0,0]];

        var blarr=zj_exam_range_global[one_year.toString()];
        blarr.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});    //分数线从低到高排列 - 保留注释
        [population,blarr2]=population_sum_arr_get_zjedu(blarr);
        var score_total=0;
        for (let item of blarr2){
            score_total=score_total+item[0]*item[1];
        }
        tr_list.push('<tr><td>'+one_year+'</td><td align="right">'+population+'</td><td align="right">'+score_total+'</td></tr>');
        var current_sum=0;
        for (let item of blarr2){
            current_sum=current_sum+item[0]*item[1];
            list_t.push([item[2]*100/population,current_sum*100/score_total]);  //累计人数百分比,人数*分数累计/总分数 - 保留注释
            x_list.push(item[2]/population);
            y_list.push(current_sum/score_total);
        }
        flot_list.push(list_t);
        textarea_list.push('"'+one_year+'x":['+x_list.join(',')+'],');
        textarea_list.push('"'+one_year+'y":['+y_list.join(',')+'],');
    }
    flot_list.push(['y=x#points:false#',[0,0],[100,100]]);
    var bltable='<table class="table_common"><tr><th>年份</th><th>总人数</th><th>总分数</th></tr>'+tr_list.join('\n')+'</table>';
    document.getElementById('divhtml').innerHTML=bltable+'<textarea style="height:30rem;">zjdata={\n'+textarea_list.join('\n')+'\n}\n</textarea>';
    var odiv=canvas_size_set_zjedu(true);
    flot_lines_b(flot_list,'div_line_count_flot','nw',false,'','','%',-1,[],-1,0,100,true);
    odiv.scrollIntoView();    
}

function canvas_size_set_zjedu(is_square){
    var odiv=document.getElementById('div_line_count_flot');
    if (is_square){
        odiv.style.cssText='width:35rem;height:30rem';  //宽度略宽 - 保留注释
    } else {
        odiv.style.cssText='width:100%;height:30rem';    
    }
    return odiv;
}

function median_value_get_zjedu(csyear,csarr,half_list=false,range_col=true){
    var population,blarr2;
    [population,blarr2]=population_sum_arr_get_zjedu(csarr);
    
    if (half_list===false){
        half_list=[0.25,0.5,0.75];
    }

    var median_str_list=[];
    var median_value_dict={};
    var blmedian, the_row;    
    for (let one_half of half_list){
        var sub_population=Math.round(population*one_half);
        [blmedian, the_row]=row_and_value_get_zjedu(-1,blarr2,sub_population,range_col,true);
        median_str_list.push(the_row);
        median_value_dict[one_half.toString()]=blmedian;
    }

    var status_list=['<tr><td>'+csyear+'</td><td>'+population+'</td>'+median_str_list.join('')+'</tr>'];
    return [blarr2,median_value_dict,status_list];
}

function row_and_value_get_zjedu(population,csarr,csvalue,range_col,show_value_in_td=true,compare_col=2,value_col=0){
    var found_value=0;
    var the_row='';
    for (let blno=0,lent=csarr.length-1;blno<lent;blno++){
        if (csarr[blno][compare_col]==csvalue){
            the_row=csarr[blno].toString();
            found_value=csarr[blno][value_col];
            break;
        } else if (csarr[blno][compare_col]<csvalue && csarr[blno+1][compare_col]>csvalue){
            the_row=csarr[blno].toString()+'<hr />'+csarr[blno+1].toString();
            found_value=csarr[blno+1][value_col];
            break;
        }
    }
    
    if (range_col){
        if (show_value_in_td){
            var result_t=[csvalue,the_row,found_value];
        } else {
            var result_t=[the_row,found_value];
        }
    } else {
        if (show_value_in_td){
            var result_t=[csvalue,found_value];
        } else {
            var result_t=[found_value];
        }    
    }
    
    if (population>0){
        result_t.push((found_value*100/population).toFixed(2)+'%');
    }
    return [found_value,'<td align="right">'+result_t.join('</td><td align="right">')+'</td>'];
}

function population_value_get_zjedu(csyear,csarr,half_list,range_col=true){
    var population,blarr2;
    [population,blarr2]=population_sum_arr_get_zjedu(csarr);

    var median_str_list=[];
    for (let one_half of half_list){
        median_str_list.push(row_and_value_get_zjedu(-1,blarr2,one_half,range_col,false)[1]);
    }

    var status_list=['<tr><td>'+csyear+'</td><td>'+population+'</td>'+median_str_list.join('')+'</tr>'];
    return status_list;
}

function score_value_get_zjedu(csyear,csarr,half_list,range_col=true){
    var population,blarr2;
    [population,blarr2]=population_sum_arr_get_zjedu(csarr);

    var median_str_list=[];
    for (let one_half of half_list){
        median_str_list.push(row_and_value_get_zjedu(population,blarr2,one_half,range_col,false,0,2)[1]);
    }

    var status_list=['<tr><td>'+csyear+'</td><td>'+population+'</td>'+median_str_list.join('')+'</tr>'];
    return status_list;
}

function year_selected_zjedu(){    
    var keys=Object.keys(zj_exam_range_global);
    keys.sort();
    var blmin=parseInt(keys[0]);
    var blmax=parseInt(keys[keys.length-1]);
        
    var blrange=prompt('输入年份范围，如'+blmin+'-'+blmax+'，或 '+(blmin-2)+','+blmin+','+(blmin+2)+'：',blmin+'-'+blmax);
    if (blrange==null){return new Set();}
    return str2num_range_b(blrange);
}

function range_sort_high_2_low_zjedu(){
    for (let key in zj_exam_range_global){
        zj_exam_range_global[key].sort(function (a,b){return a[0]<b[0] ? 1 : -1;});    //分数线从高到低排列 - 保留注释
    }
}

function range_status_type_zjedu(cstype){
    document.getElementById('div_line_count_flot').innerHTML='';
    var range_col=klmenu_check_b('span_median_range_show',false);

    var year_range=year_selected_zjedu();
    if (year_range.size==0){return;}
        
    if (typeof range_list_zjedu_global=='undefined'){
        range_list_zjedu_global='25,50,75';
    }

    var new_range=prompt('输入取值范围，如25,50,75或10000-10000;500，分号后的500表示step',range_list_zjedu_global);
    if (new_range==null){return;}
    var list_t=new_range.trim().split(';');
    var blstep=1;
    if (list_t.length>1){
        blstep=parseInt(list_t[1]);
    }
    var half_list=Array.from(str2num_range_b(list_t[0],blstep,100));
    half_list.sort(function (a,b){return a>b ? 1 : -1;});
    
    var found_positive=false;
    for (let blxl=0,lent=half_list.length;blxl<lent;blxl++){
        if (half_list[blxl]>0){
            half_list=half_list.slice(blxl,);
            found_positive=true;
            break;
        }
    }
    if (!found_positive){return;}
    
    range_sort_high_2_low_zjedu();
    
    range_list_zjedu_global=new_range;
    switch (cstype){
        case 'percent':
            for (let blxl=0,lent=half_list.length;blxl<lent;blxl++){
                half_list[blxl]=half_list[blxl]/100;
            }
            var status_list=[];
            for (let one_year of year_range){
                var blarr=zj_exam_range_global[one_year.toString()];
                status_list=status_list.concat(median_value_get_zjedu(one_year,blarr,half_list,range_col)[2]);
            }
            document.getElementById('divhtml').innerHTML=range_status_table_zjedu(status_list,half_list,range_col);
            break;
        case 'population':
            var status_list=[];
            for (let one_year of year_range){
                var blarr=zj_exam_range_global[one_year.toString()];
                status_list=status_list.concat(population_value_get_zjedu(one_year,blarr,half_list,range_col));
            }
            document.getElementById('divhtml').innerHTML=range_status_table_zjedu(status_list,half_list,range_col,'population');
            break;
        case 'score':
            var status_list=[];
            for (let one_year of year_range){
                var blarr=zj_exam_range_global[one_year.toString()];
                status_list=status_list.concat(score_value_get_zjedu(one_year,blarr,half_list,range_col));
            }
            document.getElementById('divhtml').innerHTML=range_status_table_zjedu(status_list,half_list,range_col,'score');
            break;
    }
}

function range_status_table_zjedu(status_list,half_list,range_show,cstype='percent'){
    if (status_list.length==0){return '';}
    var th='<tr><th>年份</th><th>总人数</th>';
    switch (cstype){
        case 'percent':
            for (let item of half_list){
                item=(item*100)+'%';
                
                if (range_show){
                    th=th+'<th nowrap>'+[item+'<br />人数',item+'取值区间：<br />分数,人数,累计人数',item+'<br />分数'].join('</th><th nowrap>')+'</th>';
                } else {
                    th=th+'<th nowrap>'+[item+'<br />人数',item+'<br />分数'].join('</th><th nowrap>')+'</th>';
                }
            }
            th=th+'</tr>';
            break;
        case 'population':
            for (let item of half_list){
                if (range_show){
                    th=th+'<th nowrap>'+['第'+item+'名取值区间：<br />分数,人数,累计人数','第'+item+'名<br />分数'].join('</th><th nowrap>')+'</th>';
                } else {
                    th=th+'<th nowrap>'+['第'+item+'名<br />分数'].join('</th><th nowrap>')+'</th>';
                }
            }
            th=th+'</tr>';        
            break;
        case 'score':
            for (let item of half_list){
                if (range_show){
                    th=th+'<th nowrap>'+[item+'分取值区间：<br />分数,人数,累计人数',item+'分<br />及以上人数','占比'].join('</th><th nowrap>')+'</th>';
                } else {
                    th=th+'<th nowrap>'+[item+'分<br />及以上人数','占比'].join('</th><th nowrap>')+'</th>';
                }
            }
            th=th+'</tr>';
            break;
    }
    
    return '<table class="table_common">'+th+status_list.join('\n')+'</table>';
}

function exam_range_flot_zjedu(){
    var blrange=year_selected_zjedu();
    if (blrange.size==0){return;}

    var median_type=klmenu_check_b('span_median_mark',false);
    var range_show=klmenu_check_b('span_median_range_show',false);

    range_sort_high_2_low_zjedu();
    var flot_list=[];
    for (let one_year of blrange){
        var list_t=[one_year+'年#points:false#'];

        var blarr=zj_exam_range_global[one_year.toString()];
        if (median_type){
            var blarr2, median_value_dict;
            [blarr2,median_value_dict]=median_value_get_zjedu(one_year,blarr,[0.5],range_show).slice(0,2);
            for (let item of blarr2){
                list_t.push([item[0]-median_value_dict['0.5'],item[1]]);
            }
        } else {
            for (let item of blarr){
                list_t.push([item[0],item[1]]);
            }            
        }
        flot_list.push(list_t);  
    }
    
    document.getElementById('divhtml').innerHTML='';
    var odiv=canvas_size_set_zjedu();    
    flot_lines_b(flot_list,'div_line_count_flot','nw',false,'','m','人',-1,[],-1,false,false,true);
    odiv.scrollIntoView();
}

function same_record_data_zjedu(){
    var year_range=prompt('输入年份范围，如2018,2020,2022-2024');
    if (year_range==null){return;}
    var year_list=Array.from(str2num_range_b(year_range,1,50));

    range_sort_high_2_low_zjedu();

    var common_arr=[];
    for (let key in zj_exam_range_global){
        if (year_list.includes(parseInt(key))){
            common_arr.push([key,zj_exam_range_global[key].slice(1,)]); //去掉第一个分数档 - 保留注释
        }
    }
    
    if (common_arr.length<2){
        alert('未发现2个及以上的年份：'+year_list);
        return;
    }

    var score_max=[];
    var score_min=[];
    for (let item of common_arr){
        score_max.push(item[1][0][0]);
        score_min.push(item[1][item[1].length-1][0]);
    }
    
    if (score_max.length==0 || score_min.length==0){return;}
    score_max=Math.min(...score_max);   //最大值数组中取最小的 - 保留注释
    score_min=Math.max(...score_min);

    for (let blno=0,lent=common_arr.length;blno<lent;blno++){
        var item=common_arr[blno];
        var blat_range=[];
        for (let blxl=0,lenb=item[1].length;blxl<lenb;blxl++){
            if (item[1][blxl][0]==score_max || item[1][blxl][0]==score_min){
                blat_range.push(blxl);
                if (blat_range.length==2){break;}
            }
        }
        blat_range.sort();
        if (blat_range.length==2){
            common_arr[blno][1]=common_arr[blno][1].slice(blat_range[0],blat_range[1]+1);   //假设分数段是连续的 - 保留注释
        }
    }
    var textarea_list=[];
    
    var x_list=[];
    for (let arow of common_arr[0][1]){
        x_list.push(arow[0]);
    }
    textarea_list.push('"common_x":['+x_list.join(',')+'],');
        
    for (let item of common_arr){
        var x_list=[];
        var y_list=[];
        for (let arow of item[1]){
            x_list.push(arow[0]);
            y_list.push(arow[1]);
        }
        textarea_list.push('"'+item[0]+'y":['+y_list.join(',')+'],');        
    }

    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='<div style="margin-left:0.5rem;"><textarea style="height:30rem;">zjdata={\n'+textarea_list.join('\n')+'\n}\n</textarea></div>';
}

function exam_range_check_zjedu(){
    function sub_exam_range_check_zjedu_array(csarr,range_compare=true,show_lost=false,show_sum=false){
        if (csarr.length==0){return '';}
        var blmin=Math.min(...csarr);
        var blmax=Math.max(...csarr);
        
        var blsum=0;
        for (let item of csarr){
            blsum=blsum+item;
        }
        
        var lost_number_list=[];
        for (let blxl=blmin;blxl<blmax;blxl++){
            if (csarr.includes(blxl)){continue;}
            lost_number_list.push(blxl);
        }
        
        var len1=csarr.length;
        var len2=array_unique_b(csarr).length;
        var bljg='length: '+len1+', 无重复长度: '+len2+', ';
        if (range_compare){
            bljg=bljg+(len1==len2?'一致':'<font color="'+scheme_global['a-hover']+'">不一致</font>')+', ';
        }
        bljg=bljg+'range: '+(blmin<=0?'<font color="'+scheme_global['a-hover']+'">'+blmin+'</font>':blmin)+' - '+blmax+', 相差: '+(blmax-blmin);
        if (range_compare){
            bljg=bljg+', '+(blmax-blmin+1==len1?'正常':'<font color="'+scheme_global['a-hover']+'">不正常</font>');    
        }
        
        if (show_lost && lost_number_list.length>0){
            bljg=bljg+', 缺少: '+lost_number_list.join(', ');
        }
        
        if (show_sum){
            bljg=bljg+',合计: '+blsum;
        }        
        return bljg;
    }
    //-----------------------
    range_sort_high_2_low_zjedu();
    var result_t=[];
    var textarea_list=[];
    for (let key in zj_exam_range_global){
        var x_list=[];
        var y_list=[];
        var list_score=[];
        var list_count=[];
        var table_list=[];
        var total=0;
        for (let item of zj_exam_range_global[key]){
            list_score.push(item[0]);
            list_count.push(item[1]);
            total=total+item[1];
            table_list.push('<tr><td align="right">'+item[0]+'</td><td align="right">'+item[1]+'</td><td align="right">'+total+'</td></tr>');
            x_list.push(item[0]);
            y_list.push(item[1]);
        }
        result_t.push('<h3>'+key+' <span class="oblong_box" style="font-size:0.85rem; font-weight:normal;" onclick="popup_show_hide_b(\'table_range_check_'+key+'\');">显示/隐藏</span></h3>');        
        result_t.push('<p><b>score</b> '+sub_exam_range_check_zjedu_array(list_score,true,true)+'</p>');
        result_t.push('<p><b>count</b> '+sub_exam_range_check_zjedu_array(list_count,false,false,true)+'</p>');
        result_t.push('<section style="max-height:25rem;overflow:auto;"><table class="table_common" style="display:none;" id="table_range_check_'+key+'"><tr><th>分数</th><th>人数</th><th>累计人数</th></tr>');
        result_t=result_t.concat(table_list);
        result_t.push('</table></section>');
        
        textarea_list.push('"'+key+'x":['+x_list.join(',')+'],');
        textarea_list.push('"'+key+'y":['+y_list.join(',')+'],');        
    }
    
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='<div style="margin-left:0.5rem;">'+result_t.join('\n')+'<textarea style="height:30rem;">zjdata={\n'+textarea_list.join('\n')+'\n}\n</textarea></div>';
    mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));    
}

function th_zjedu(divid,cslist,cstr_string,cstitle='',show_csv=true,add_table=true){
    if (cstitle!==''){
        cstitle='<tr class="tr_title_zjedu"><th colspan='+cslist.length+'>'+cstitle+'</th></tr>';
    }
    var bljg=cstitle+'<tr><th nowrap>'+cslist.join('</th><th nowrap>')+'</th></tr>'+cstr_string;
    
    if (add_table){
        bljg='<table class="table_common">'+bljg+'</table>\n';
    }
    if (show_csv){
        bljg=bljg+'<p style="margin-top:0.5rem;font-size:0.8rem;"><span class="oblong_box" onclick="table_2_csv_b(\'div#'+divid+' table\');">CSV</span></p>\n';
    }
    return bljg;
}

function sortdata_zjedu(cstype){
    function sub_sortdata_zjedu_tr(csxl,item){
        return ['<tr><td align=right nowrap>'+(parseInt(csxl)+1)+'</td><td>'+item[1]+'</td><td>'+item[3]+'</td><td nowrap align=right>'+item[4]+'</td><td nowrap align=right>'+item[5]+'</td><td nowrap align=right>'+item[6]+'</td></tr>',item[cstype]];
    }
    
    function sub_sortdata_zjedu_sort(csarr,col_no){
        switch (col_no){
            case 1:
            case 3:
                if (csorder_zjc_global==-1){
                    csarr.sort(function(a,b){return zh_sort_b(a,b,false,col_no);});
                } else {
                    csarr.sort(function(a,b){return zh_sort_b(a,b,true,col_no);});
                }
                break;
            case 4:
            case 5:
            case 6:
                if (csorder_zjc_global==-1){
                    csarr.sort(function(a,b){return a[col_no]>b[col_no] ? 1 : -1;});
                } else {
                    csarr.sort(function(a,b){return b[col_no]>a[col_no] ? 1 : -1;});
                }
                break;
        }
        return csarr;
    }
    
    jgarray_zjc_global=sub_sortdata_zjedu_sort(jgarray_zjc_global,cstype);
    
    var show_type=document.getElementById('select_table_rows_show_type_zjedu').value;
	var bljg=[];
    switch (show_type){
        case '1':
        case '1_1':
            jgarray_zjc_global=sub_sortdata_zjedu_sort(jgarray_zjc_global,1);
            var csarr=[];
            var school_name='';
            var used_row_no=new Set();
            var last_row_no=-1;
            for (let blno=0,lent=jgarray_zjc_global.length;blno<lent;blno++){
                var item=jgarray_zjc_global[blno];
                if (item[0]==school_name){
                    if (show_type=='1_1'){
                        last_row_no=blno;
                    }
                    continue;
                } else {
                    if (last_row_no!==-1 && !used_row_no.has(last_row_no)){
                        csarr.push(jgarray_zjc_global[last_row_no]);
                        used_row_no.add(last_row_no);
                        last_row_no=-1;
                    }
                }
                csarr.push(item);
                used_row_no.add(blno);
                school_name=item[0];
            }
            
            if (last_row_no!==-1 && !used_row_no.has(last_row_no)){
                csarr.push(jgarray_zjc_global[last_row_no]);
            }
                                
            csarr=sub_sortdata_zjedu_sort(csarr,cstype);
            
            for (let blxl=0,lent=csarr.length;blxl<lent;blxl++){
                bljg.push(sub_sortdata_zjedu_tr(blxl,csarr[blxl])[0]);
            }
            break;
        default:
            for (let blxl=0,lent=jgarray_zjc_global.length;blxl<lent;blxl++){
                var item=jgarray_zjc_global[blxl];
                bljg.push(sub_sortdata_zjedu_tr(blxl,item)[0]);
            }
            break;
    }
    
	var blhtml = document.getElementById('divhtml');
    var blths='<tr><th nowrap>序号</th>';
    blths=blths+'<th style="cursor:pointer;" onclick="csorder_zjc_global=csorder_zjc_global*-1;sortdata_zjedu(1);" nowrap>学校名称</th>';
    blths=blths+'<th style="cursor:pointer;" onclick="csorder_zjc_global=csorder_zjc_global*-1;sortdata_zjedu(3);" nowrap>专业名称</th>';
    blths=blths+'<th style="cursor:pointer;" onclick="csorder_zjc_global=csorder_zjc_global*-1;sortdata_zjedu(4);" nowrap>计划数</th>';
    blths=blths+'<th style="cursor:pointer;" onclick="csorder_zjc_global=csorder_zjc_global*-1;sortdata_zjedu(5);" nowrap nowrap>分数线</th>';
    blths=blths+'<th style="cursor:pointer;" onclick="csorder_zjc_global=csorder_zjc_global*-1;sortdata_zjedu(6);" nowrap>位次</th></tr>';
    blhtml.innerHTML='<table class="table_common" id="table_main_zjc">'+blths+bljg.join('\n')+'</table>';
}

function jump_to_tr_zjedu(jump_to_end=false){
    var otable=document.getElementById('table_main_zjc');   
    if (!otable){return;}
    var otrs=otable.querySelectorAll('tr');
    if (otrs.length==0){return;}
    if (jump_to_end){
        otrs[otrs.length-1].scrollIntoView();
        return;
    }
    
    var blno=prompt('输入要跳转的指定行号');
    if (blno==null){return;}
    blno=blno.trim();
    if (isNaN(blno)){return;}
    
    for (let one_tr of otrs){
        var otds=one_tr.querySelectorAll('td');
        if (otds.length==0){continue;}
        var blstr=otds[0].innerText.trim();
        if (blstr==blno){
            one_tr.scrollIntoView();
            break;
        }
    }
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
        var divs=['divcount','divschool','divmajor','divnum','divaverage','divmedian','divposition','divnum2','divaverage2','divplan','divnum3'];
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
    for (let blxl=0,lent=zj_university_global.length;blxl<lent;blxl++){
        var item=zj_university_global[blxl];
        if (item.length==6){
            zj_university_global[blxl].push(0); //位次，没招满 - 保留注释
            item=zj_university_global[blxl];
        }
        list_t[0]=list_t[0]+item[4];
        list_t[1]=list_t[1]+item[5];
        list_t[2]=list_t[2]+item[6];
    }
    console.log('记录数：',zj_university_global.length);
    console.log('计划数求和：',list_t[0]);
    console.log('分数线求和：',list_t[1]);
    console.log('位次求和：',list_t[2]);
}

function export_csv_zjedu(){
    var col_dict={'学校名称':1,'专业名称':3,'计划数':4,'分数线':5,'位次':6};
    var blths=Object.keys(col_dict);
    var blselected_cols=prompt('选择输出的列（默认'+blths+'）：',blths);
    if (blselected_cols==null){return;}
    blselected_cols=blselected_cols.trim();
    if (blselected_cols==''){
        blselected_cols=blths;
    } else {
        blselected_cols=blselected_cols.split(',');
    }
    
    var col_no_list=[];
    var blhead_list=[];
    for (let item of blselected_cols){
        item=item.trim();
        if (col_dict[item]==undefined){continue;}
        
        col_no_list.push(col_dict[item]);
        blhead_list.push('"'+item+'"');
    }
    
    var result_t=[];
    for (let item of jgarray_zjc_global){
        var arow=[];
        for (let acol of col_no_list){
            if ([1,3].includes(acol)){
                arow.push('"'+specialstr_j(item[acol])+'"');
            } else {
                arow.push(item[acol]);
            }
        }
        result_t.push(arow.join(','));
    }

    if (result_t.length==0){return;}

    var blhead=blhead_list.join(',')+'\n';
    string_2_txt_file_b(blhead+result_t.join('\n'),'zj_edu_export_'+zj_current_year_global+'_'+now_time_str_b('-',true)+'.csv','csv');
}

function batch_links_zjedu(){
    function sub_batch_links_zjedu_one(){
        if (blxl>=bllen){
            document.title=old_title;
            return;
        }
        
        window.open('?'+year_list[blxl]+'&s='+blkey);
        blxl=blxl+1;
        setTimeout(sub_batch_links_zjedu_one,2500);
    }
    
    var year_list=Array.from(year_selected_zjedu());
    if (year_list.length==0){return;}
    
    var blkey=document.getElementById('input_search').value;
    if (!confirm('是否批量打开'+year_list+'的搜索链接？')){return;}
    var blxl=0;
    var bllen=year_list.length;
    var old_title=document.title;
    sub_batch_links_zjedu_one();
}

function menu_zjedu(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://www.zjzs.net/" target=_blank>浙江省教育考试院</a>',    
    '<span class="span_menu" onclick="'+str_t+'export_csv_zjedu();">导出当前记录为csv</span>',    
    ];

    var group_list=[
    ['分数人数分布表及检验','exam_range_check_zjedu();',true],
    ['相同分数数据','same_record_data_zjedu();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));    
    
    var group_list=[
    ['分数人数分布图','exam_range_flot_zjedu();',true],
    ['基尼系数','gini_index_zjedu();',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));    

    var group_list=[
    ['累计人数比例','range_status_type_zjedu(\'percent\');',true],
    ['累计人数','range_status_type_zjedu(\'population\');',true],
    ['分数线','range_status_type_zjedu(\'score\');',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'分数人数分布表：'));   
    
    var group_list=[
    ['⚪ 中位分数','klmenu_check_b(this.id,true);',true,'span_median_mark'],
    ['⚪ 区间显示','klmenu_check_b(this.id,true);',true,'span_median_range_show'],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));    
    
    var klmenu_year=[
    '<span class="span_menu" onclick="'+str_t+'batch_links_zjedu();">跨年批量搜索</span>',      
    ];
    for (let item=zj_year_range_global[0];item<=zj_year_range_global[1];item++){
        klmenu_year.push('<a href="?'+item+'">'+item+'年</a>');
    }

    var klmenu_statistics=[
    '<span class="span_menu" onclick="'+str_t+'search_type_zjedu(\'10000\');">最低录取位次前10000名的专业</span>',    
    '<span class="span_menu" onclick="'+str_t+'search_type_zjedu(\'50000\');">最低录取位次前50000名的专业</span>',    
    '<span class="span_menu" onclick="'+str_t+'search_type_zjedu(\'700\');">700分</span>',    
    '<span class="span_menu" onclick="'+str_t+'speciality_status_zjedu();">在全部数据中统计当前专业名称平均分数线分布</span>',        
    '<span class="span_menu" onclick="'+str_t+'speciality_simple_count_zjedu();">在当前结果中统计简化专业计划数</span>',        
    ];    
    
    var group_list=[
    ['学校','current_names_zjedu(0);',true],
    ['专业','current_names_zjedu(1);',true],
    ];    
    klmenu_statistics.push(menu_container_b(str_t,group_list,'当前名称集：'));    

    var klmenu_config=root_font_size_menu_b(str_t);
    klmenu_config=klmenu_config.concat([
    '<span id="span_reg_zjedu" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',       
    '<span class="span_menu"><select id="select_table_rows_show_type_zjedu"><option value=""></option><option value="1">相同学校记录排序后仅显示第1条</option><option value="1_1">相同学校记录排序后仅显示首尾2条</option></select></span>',
    '<span class="span_menu" onclick="'+str_t+'search_demo_zjedu();">语法示例</span>',
    ]);
    
    var group_list=[
    ['指定行号','jump_to_tr_zjedu();',true],
    ['表格末尾','jump_to_tr_zjedu(true);',true],
    ];    
    klmenu_config.push(menu_container_b(str_t,group_list,'跳转到：'));    

    document.getElementById('span_h2').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu_year,'💯','9rem','1rem','1rem','60rem')+klmenu_b(klmenu1,'','24rem','1rem','1rem','60rem')+klmenu_b(klmenu_statistics,'🧮','25rem','1rem','1rem','60rem')+klmenu_b(klmenu_config,'⚙','15rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_zjedu',true);        
}

function args_zjedu(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        for (let one_key of cskeys){
            one_key=one_key.trim();
            if (one_key.substring(0,2)=='s='){
                run_txtsearch_zjedu(one_key.substring(2,));
                break;
            }
        }
    } else {
        run_txtsearch_zjedu();
    }
}

function init_zjedu(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'));
    recent_search_zjedu();
    menu_zjedu();    
    
    check_data_zjedu();
    
    var input_list=[
    ['input_max_num_zjc',5,0.5],
    ];
    input_size_b(input_list,'id');    
    input_with_x_b('input_search',15);
    mark_rank_list_zjedu();
    td_right_html_zjedu();
    document.getElementById('span_array_count').innerHTML='<i>('+zj_university_global.length+'条)</i>';
    args_zjedu();
}

function current_names_zjedu(col_no,simplify=false,show_html=true){
    var result_t=array_unique_b(array_split_by_col_b(school_zjc_global,[col_no],true));
    var ignore_list=[];
    
    if (simplify){
        var list_t=new Set();
        for (let item of result_t){
            item=item.replace(/[\(（].+$/,'').replace(/类$/,'');
            list_t.add(item.trim());
        }
        
        result_t=[];
        for (let item1 of list_t){
            var len1=item1.length;
            var is_ignore=false;
            for (let item2 of list_t){
                if (item1==item2 || len1<=item2.length){continue;}
                if (item1.includes(item2)){
                    is_ignore=true;
                    break;
                }
            }
            if (is_ignore){
                ignore_list.push(item1);
            } else {
                result_t.push(item1);
            }
        }
        result_t.sort(zh_sort_b);   //function (a,b){return a.length>b.length?1:-1;});    //长度短的排前 - 保留注释        
        ignore_list.sort(zh_sort_b);   
    }

    if (show_html){
        var odiv=document.getElementById('div_status');
        odiv.innerHTML='<h4>结果（'+result_t.length+'）：</h4><textarea>'+result_t+'</textarea>'+(simplify?'<h4>忽略（'+ignore_list.length+'）：</h4><textarea>'+ignore_list+'</textarea>':'');
        odiv.scrollIntoView();
    }
    return [result_t,ignore_list];
}

function speciality_simple_count_zjedu(){
    var name_list=current_names_zjedu(1,true,false)[0];    //获取专业的简化名称 - 保留注释
    var result_t={};
    for (let one_name of name_list){
        result_t['n_'+one_name]=0;
    }

    for (let item of school_zjc_global){
        //item 形如：[ "浙江大学", "人文科学试验班", 76, 672, 4221 ] - 保留注释
        for (let one_name of name_list){
            var blfound=str_reg_search_b(item[1],one_name,false);
            if (blfound==-1){break;}
            if (blfound){
                result_t['n_'+one_name]=result_t['n_'+one_name]+item[2];
                break;
            }
        }
    }
    
    result_t=object2array_b(result_t,true,2);
    result_t.sort(function(a,b){return zh_sort_b(a,b,true,0);});    //逆序 - 保留注释
    result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});
    
    var hot_list=[];
    var blsum=0;
    for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
        hot_list.push(result_t[blxl][0]+','+result_t[blxl][1]);
        blsum=blsum+result_t[blxl][1];
            
        result_t[blxl]='<tr><td>'+(blxl+1)+'</td><td>'+result_t[blxl][0]+'</td><td align=right>'+result_t[blxl][1]+'</td></tr>';
    }
    
    hot_list=hot_list.slice(0,num_zjc_global);
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML='<table class="table_common"><tr><th>No.</th><th>专业</th><th>计划数</th></tr>'+result_t.join('\n')+'</table><textarea>'+hot_list.join('\n')+'</textarea><p>合计：'+blsum+'</p>';
}

function speciality_status_zjedu(){
    function sub_speciality_status_zjedu_school_html(){
        var table_t=[];
        for (let key in school_dict){
            var blno=key.slice(2,);
            if (!['1','2','3'].includes(blno)){continue;}
            table_t.push('<table class="table_common">');
            table_t.push('<tr class="tr_title_zjedu"><th colspan=3>平均分数线排名第 <span style="color:'+scheme_global['a-hover']+';">'+blno+'</span> 的学校及专业<span style="font-size:small; font-weight: normal;">（忽略相同专业只有一个学校的情况）</span></th></tr>');
            table_t.push('<tr class="tr_title_zjedu"><th>学校</th><th nowrap>专业数</th><th>专业名称</th></tr>');
            school_dict[key]=object2array_b(school_dict[key]);
            school_dict[key].sort(function(a,b){return zh_sort_b(a,b,false,0);});
            school_dict[key].sort(function (a,b){return a[1].length<b[1].length?1:-1;});
            for (let blno=0,lent=school_dict[key].length;blno<lent;blno++){
                table_t.push('<tr><td nowrap>'+school_dict[key][blno][0]+'</td><td align=right>'+school_dict[key][blno][1].length+'</td><td>'+school_dict[key][blno][1].join('・')+'</td></tr>');
            }
            table_t.push('</table>');
        }
        return table_t.join('\n');
    }
    
    function sub_speciality_status_zjedu_school_arr(cslist,speciality_name){
        //cslist 每个元素为数组，内容为学校名称，分数线，对应位次；形如：[ "厦门大学", 665, 6287 ] - 保留注释
        var lent=cslist.length;
        if (lent<2){return;}    //忽略相同专业只有一个学校的情况 - 保留注释
        for (let blno=0;blno<lent;blno++){
            var key_no='n_'+(blno+1);
            if (blno>0){
                for (let bly=0;bly<blno;bly++){
                    if (cslist[bly][1]==cslist[blno][1]){   //如果分数线相同 - 保留注释
                        key_no='n_'+(bly+1);
                        break;
                    }
                }
            }
            if (school_dict[key_no]==undefined){
                school_dict[key_no]=[];
            }            
            var key_name='s_'+cslist[blno][0];
            if (school_dict[key_no][key_name]==undefined){
                school_dict[key_no][key_name]=[cslist[blno][0],[]];
            }                        
            school_dict[key_no][key_name][1].push(speciality_name);
        }
    }
    
    function sub_speciality_status_zjedu_one(){
        if (blxl>=bllen){
            document.title=old_title;
            var odiv=document.getElementById('divhtml');
            odiv.innerHTML='<table class="table_common">'+bljg.join('\n')+'</table>'+sub_speciality_status_zjedu_school_html();

            var oths=odiv.querySelectorAll('tr.tr_title_zjedu th');
            for (let one_th of oths){
                if (one_th.getAttribute('colspan')=='3'){
                    one_th.setAttribute('align','left');
                }
                one_th.style.borderTop='0.2rem double black';
                one_th.style.padding='0.5rem';
                one_th.style.backgroundColor=scheme_global['button'];
            }
            
            console.log('speciality_status_zjedu() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
    
        var result_t=[];
        for (let item of zj_university_global){
            var blfound=str_reg_search_b(item[3],name_list[blxl],false);
            if (blfound==-1){break;}
            if (blfound){
                result_t.push([item[1],item[3],item[4],item[5],item[6]]);
            }
        }
        var data_dict=school_arr_zjedu(result_t,['school_sum_average']);
        var result_t=school_sum_average_zjedu(data_dict['school_sum_average'],false,false,false,false,(blxl+1).toString().padStart(zero_len, '0')+'. 【'+name_list[blxl]+'】');
        bljg.push(result_t[2]);
        sub_speciality_status_zjedu_school_arr(result_t[3],name_list[blxl]);
        blxl=blxl+1;
        document.title=blxl+'/'+bllen+'/'+name_list[blxl]+' - '+old_title;
        if (blxl % 20 == 0){
            setTimeout(sub_speciality_status_zjedu_one,1);
        } else {
            sub_speciality_status_zjedu_one();
        }
    }

    var t0 = performance.now();
    num_change_zjedu();
    var name_list=current_names_zjedu(1,true,false)[0];    //获取专业的简化名称 - 保留注释
    var blxl=0;
    var bllen=name_list.length;
    var zero_len=bllen.toString().length;
    var bljg=[];
    var school_dict={};
    var old_title=document.title;
    sub_speciality_status_zjedu_one();
}

function search_type_zjedu(cstype){
    var oinput=document.getElementById('input_search');
    switch (cstype){
        case '50000':
            oinput.value=',([1-9]|\\d{2,4}|[1-4]\\d{4}|50000),$';   //要忽略 0 - 保留注释
            break;
        case '10000':
            oinput.value=',([1-9]|\\d{2,4}|10000),$';
            break;
        case '700':
            oinput.value=',(7\\d{2}|699),.+';
            break;
    }
    run_txtsearch_zjedu();
}
