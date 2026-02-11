function get_day_words_enwc_b(csday='',csmonth='',cstype='new',cs_write_html=true,cs_write_input=true){
    //cstype new:新单词 - 保留注释
    var blyear, bldate;
    [blyear,csmonth,csday,bldate]=get_month_day_enwc_b(csday,csmonth,cs_write_input);
    if (csmonth==0 || csday==0){return;}
    
    console.log('get_day_words_enwc_b',csmonth,csday);
    
    var csday2=months_b(csmonth-1)+csday; //当年第几天 - 保留注释
	var bljg='';
	words_searched_arr_global=[];

    //旧单词 - 保留注释
    var array_num_t=cstype.match(/\d/g);
    if (array_num_t==null){
        array_num_t=[0];
    } else {
        array_num_t=array_unique_b(array_num_t);
        //限定范围为0-2 - 保留注释
        for (let blxl in array_num_t){
            array_num_t[blxl]=Math.min(2,Math.max(0,parseInt(array_num_t[blxl])));
        }
        array_num_t=array_unique_b(array_num_t);
    }
    words_searched_arr_global=day_old_word_enwc_b(csday2,cstype,array_num_t,cs_write_html); //此处默认修改标题 - 保留注释

	bljg=bljg+enwords_array_to_html_b(words_searched_arr_global);
    bljg=bljg+'<p>'+pages_day_enwc_b('get_day_words_enwc_b',cstype,blyear,csmonth,csday)+'</p>';

    if (cs_write_html){
        bljg=bljg+'<p><span class="aclick" onclick="en_word_temp_batch_add_b();">批量添加当前条件下的单词为最近记忆单词</span></p>';
    	bljg=bljg+enwords_batch_div_b(words_searched_arr_global,'');
        bljg=bljg+enwords_js_wiki_textarea_b(words_searched_arr_global);
        document.getElementById('divhtml').innerHTML=bljg;
        en_words_show_check_b();
    }
    return words_searched_arr_global;
}

function get_month_day_enwc_b(csday='',csmonth='',cs_write_input=true){
    var today = new Date();
    var blyear=today.getFullYear();    
	
    if (csday=='' || csday==0){
        csday = parseInt(document.getElementById('input_day').value.trim());
    }
    
    if (csmonth=='' || csmonth==0){
        csmonth=parseInt(document.getElementById('input_month').value.trim());
        if (csmonth==''){
            csmonth=today.getMonth()+1;
        }
    }

    csmonth = Math.min(12,Math.max(1,parseInt(csmonth)));
    csday = Math.min(month_day_b(csmonth),Math.max(1,csday));

    if (cs_write_input){
        document.getElementById('input_month').value=csmonth;
        document.getElementById('input_day').value=csday;
    }
    
    var bldate_str=blyear+('0'+csmonth).slice(-2)+('0'+csday).slice(-2);    
    if (validdate_b(bldate_str)==false){
        return [0,0];
    }
    return [blyear,csmonth,csday,bldate_str];
}

function pages_day_enwc_b(jsname,cstype,csyear,csmonth,csday,use_asc=true){
    var list_t=day_range_in_one_month_b(csmonth,csday);
    var bljg='';
    for (let item of list_t){
        bljg=bljg+'<span class="aclick"'+(item==csday?' style="color:red;"':'');
        switch (jsname){
            case 'get_day_words_enwc_b':
                bljg=bljg+' onclick=\''+jsname+'('+item+',0,"'+cstype+'");\'>';
                break;
            case 'article_words_list_enwc_b':
                bljg=bljg+' onclick=\''+jsname+'('+csmonth+','+item+');\'>';        
                break;
        }
        if (jsname!=='get_day_words_enwc_b'){
            bljg=bljg+csmonth+'月';
        }
        bljg=bljg+item+'日/'+day_2_week_b(csyear+'-'+csmonth+'-'+item,'cnbrief');
        bljg=bljg+'</span> ';
    }
    return bljg;
}

function article_words_list_enwc_b(csmonth=0,csday=0){
    en_word_temp_get_b();
    
    var blyear, bldate;
    [blyear,csmonth,csday,bldate]=get_month_day_enwc_b(csday,csmonth);
    if (csmonth==0 || csday==0){return;}

    if (typeof enwords_article_global== 'undefined'){
        enwords_article_global=[];
        for (let item of en_sentence_global){
            if (Array.isArray(item[0])){
                var blstr=item[0].join('');
            } else {
                var blstr=item[0];
            }
            if (blstr.includes('&gt;&lt;/eword&gt;')){
                enwords_article_global.push(blstr);
            }
        }
    }
    
    words_searched_arr_global=en_lines_days_enwc_b(enwords_article_global,bldate);
	var bljg=enwords_array_to_html_b(words_searched_arr_global);
    var pages='<p>'+pages_day_enwc_b('article_words_list_enwc_b','',blyear,csmonth,csday)+'</p>';

	var odiv = document.getElementById('divhtml');
    odiv.innerHTML=bljg+pages+enwords_batch_div_b(words_searched_arr_global,'')+enwords_js_wiki_textarea_b(words_searched_arr_global);
}

function en_lines_days_enwc_b(csarray,cstheday=''){
    if (cstheday==''){
        var today_t=new Date();
    } else {
        var today_t=validdate_b(cstheday);
    }
    
    var year_days=isLeapYear_b(today_t.getFullYear(),0,true);
    var blday=day_of_year_b(today_t);

    var cscount=csarray.length/year_days;
    var blstart=Math.floor((blday-1)*cscount);
    var blend=Math.floor(blday*cscount);
    
	var bljg=[];
	for (let blxl=blstart;blxl<blend;blxl++){
        bljg.push(csarray[blxl]);
	}
    return enwords_b(bljg.join('\n'),'array');
}

function line_count_enwc_b(){
    function sub_line_count_enwc_b_one_p(){
        if (blxl>=plen){
            sup_kleng_words_b('');
            return;
        }
        var onep=ops[blxl];
        var ocontent=onep.querySelector('span.span_enwords_sentence');
        var osub=onep.querySelector('sub.sub_clicked_line_word_count');
        if (ocontent && osub){            
            osub.innerText=line_enword_count_b(odiv,ocontent);
        }
        blxl=blxl+1;
        setTimeout(sub_line_count_enwc_b_one_p,10);
    }
    //-----------------------
    var odiv = document.createElement('div');
    var ops=document.querySelectorAll('p.p_enwords_sentence');
    var plen=ops.length;
    var blxl=0;
    sub_line_count_enwc_b_one_p();
}

function day_old_word_enwc_b(daynumber,cstype,array_num_t,changetitle=true){
    if (cstype.includes('_OR')){
        if (changetitle){
            title_change_enwords_b('今日旧单词 (序号: '+array_num_t.toString()+'_OR)');
        }
    } else {
        if (changetitle){
            title_change_enwords_b('今日旧单词 (序号: '+array_num_t.toString()+')');
        }
    }
    return en_day_old_words_b(daynumber,cstype,array_num_t);
}

function getlines_location_enwc_b(cscount,cslines){
    var blno=page_location_b(cscount);
    if (blno!==false){
        getlines_enwc_b((blno-1)*cslines+1,cslines);
    }
}

function getlines_enwc_b(csno,cslines){
	var csnum=arguments.length;
	if (csnum==0){
        var csno= Math.max(parseInt(document.getElementById('input_lineno').value.trim()),0);
    } else {
        csno=Math.max(0,csno);
    }
	if (csnum<=1){
        var cslines= Math.min(max_result_enwords_b(),Math.max(0,parseInt(document.getElementById('input_lines').value.trim())));
    }
	
	document.getElementById('input_lineno').value=csno;
	document.getElementById('input_lines').value=cslines;
	
	var bllength=enwords.length;

	if (csno==0){
		csno=Math.min(bllength-1,Math.max(1,(Math.random()*bllength).toFixed(0)));
		document.getElementById('input_lineno').value=csno;
	}
	if (cslines==0){
		cslines=Math.max(1,(Math.random()*500).toFixed(0));
		document.getElementById('input_lines').value=cslines;
	}

    var page_html=page_combination_b(bllength,cslines,csno,'getlines_enwc_b','getlines_location_enwc_b','',2,0,'','aclick');

	words_searched_arr_global=[];
	
	for (let blxl=csno-1;blxl<csno+cslines-1;blxl++){
		if (blxl>=bllength){break;}
		
		words_searched_arr_global.push(enwords[blxl]);
	}

    var bljg=page_html+enwords_array_to_html_b(words_searched_arr_global)+page_html;
    enwords_recent_search_b('');
	document.getElementById('divhtml').innerHTML=bljg+enwords_batch_div_b(words_searched_arr_global,'')+enwords_js_wiki_textarea_b(words_searched_arr_global);
    title_change_enwords_b('');
	document.location.href = '#content';
    
    en_words_show_check_b();
}

function show_sentence_enwc_b(maxlines=0,showcount=true,is_random=false,show_button=true,load_js=true){
    function sub_show_sentence_enwc_b_load(is_ok=true){
        if (!is_ok){return;}
        
        local_storage_today_b('enwords_sentence_rows',40,en_sentence_global.length,'/');
        show_sentence_enwc_b(maxlines,showcount,is_random,show_button,false);
    }
    
    function sub_show_sentence_enwc_b_count(){
        var odiv=document.querySelector('div.div_word_sentence_rank');
        if (!odiv){return;}
        word_sentence_rank=object2array_b(word_sentence_rank,false,2);
        var rank_dict={'K_0':[],'K_1':[],'K_0+1':[],'K_2':[],'K_3':[],'K_4':[],'K_5':[],'K_more':[]};
        for (let item of word_sentence_rank){
            if (rank_dict['K_'+item[0]]==undefined){
                rank_dict['K_more']=rank_dict['K_more'].concat(item[1]);
            } else {
                rank_dict['K_'+item[0]]=rank_dict['K_'+item[0]].concat(item[1]);
            }
        }
        
        rank_dict['K_0+1']=rank_dict['K_0'].concat(rank_dict['K_1']);        
        
        var bljg=[];
        for (let key in rank_dict){
            if (rank_dict[key].length==0){continue;}
            bljg.push('<p><b> '+rank_dict[key].length+' 个单词 '+key.slice(2,)+' 条例句</b></p>');
            bljg.push('<textarea style="height:5rem;">'+rank_dict[key].join('\n')+'</textarea>');
        }
        odiv.innerHTML='<hr />'+bljg.join('\n')+'<p>'+close_button_b('div.div_word_sentence_rank','','aclick',false)+'</p>';
    }    
    
    function sub_show_sentence_enwc_b_one_step(font_size,button_str){
        if (blxl>=oaslen){
            sub_show_sentence_enwc_b_count();
            setTimeout(en_sentence_mobile_b,10);
            console.log('show_sentence_enwc_b() 费时：'+(performance.now() - t0) + ' milliseconds');
            return;
        }
        var oword=oas[blxl];
        var bljg,blcount,no_next;
        var wordname=oword.innerText;
        [bljg,blcount,no_next]=sentence_set_path_and_get_b(wordname,csmax,font_size,remote_host,button_str);

        if (word_sentence_rank['c_'+blcount]==undefined){
            word_sentence_rank['c_'+blcount]=[blcount.toString(),[]];
        }
        word_sentence_rank['c_'+blcount][1].push(wordname);
        
        if (bljg!==''){
            if (showcount){
                bljg=bljg+'<p align=right style="color:'+scheme_global['shadow']+';">('+blcount+')</p>';
            }
            oword.parentNode.insertAdjacentHTML('afterend','<div class="div_sentence">'+bljg+'</div>');
        }
        
        blxl=blxl+1;
        if (blxl % 10==0){
            setTimeout(function (){sub_show_sentence_enwc_b_one_step(font_size,button_str);},1);
        } else {
            sub_show_sentence_enwc_b_one_step(font_size,button_str);
        }
    }
    //-----------------------
    if (typeof en_sentence_global == 'undefined'){
        console.log('en_sentence_global 未定义');
        if (load_js){    
            load_enword_file_b('en_sentence_global','enwords_sentence',sub_show_sentence_enwc_b_load,false);
        }
        return;
    }
    
    if (en_sentence_global.length==0){
        console.log('en_sentence_global 长度为 0');
        return;
    }
    
    var osen=document.getElementsByClassName('div_sentence');
    if (osen.length>0){
        console.log('已存在 .div_sentence');
        return;
    }

    var t0 = performance.now();
    if (is_random){
        en_sentence_global.sort(randomsort_b);
    }    

    var oas=document.querySelectorAll('span.a_word');
    var oaslen=oas.length;
    
    if (maxlines>0){
        var csmax=maxlines;
    } else {
        if (ismobile_b()){
            var csmax=(oaslen>10?5:10);
        } else {
            var csmax=(oaslen>10?10:20);
        }
    }
    //-----------------------
    var remote_host, button_str, font_size;
    [remote_host,button_str,font_size]=sentence_property_b(show_button);
    
    var blxl=0;
    var word_sentence_rank={};
    sub_show_sentence_enwc_b_one_step(font_size,button_str);
}

function days_enwc_b(only_plan=false){
    function sub_days_enwc_b_plan(cseveryday,csint,csvalue,show_month_words=false){
        var this_month_words_count=Math.ceil(days_remained_of_month_b()*cseveryday);        
        var week_count=cseveryday*7;    

        var day_count=cseveryday;
        if (cseveryday!==Math.round(cseveryday)){
            day_count=day_count.toFixed(3);
            week_count=week_count.toFixed(1);
        }
        
        var blstr_tmp='按每日 '+day_count+' 计算，每周须记忆单词 '+week_count+' 个；';
        if (show_month_words){
            blstr_tmp=blstr_tmp+'<br />至本月底须完成 '+this_month_words_count+' 个单词，即累计达 '+(enwords.length+this_month_words_count) +' 个单词；';
        }
        
        var bldays_ceil=(csint-enwords.length)/cseveryday;
        blstr_tmp=blstr_tmp+'<br />达到 '+csint+' 需要 '+bldays_ceil.toFixed(1)+' 天，即 '+next_day_b('',bldays_ceil);
        
        if (csvalue!==csint){
            var bldays2_ceil=(csvalue-enwords.length)/cseveryday;
            blstr_tmp=blstr_tmp+'；<br />达到 '+csvalue+' 需要 '+bldays2_ceil.toFixed(1)+' 天，即 '+next_day_b('',bldays2_ceil);
        }
        blstr_tmp=blstr_tmp+'。<br />';    
        return blstr_tmp;
    }
    
    function sub_days_enwc_b_mintd(classname){
        var otable=document.getElementById('table_plan_count');
        if (otable){
            var tds=otable.getElementsByClassName(classname);
            var td_last_min=-1;
            var td_100_min=-1;
            var td_1000_min=-1;
            for (let item of tds){
                var value_t=parseInt(item.innerHTML.split('/')[0].trim());
                if (isNaN(value_t)){continue;}
                td_last_min=(td_last_min==-1?value_t:Math.min(td_last_min,value_t));
                if (value_t>=100 && value_t<1000){
                    td_100_min=(td_100_min==-1?value_t:Math.min(td_100_min,value_t));
                }
                if (value_t>=1000){
                    td_1000_min=(td_1000_min==-1?value_t:Math.min(td_1000_min,value_t));
                }
            }
            if (td_100_min==td_last_min){
                td_100_min=-1;
            }
            if (td_1000_min==td_last_min){
                td_1000_min=-1;
            }
            for (let item of tds){
                var value_t=parseInt(item.innerHTML.split('/')[0].trim());
                if (value_t==td_last_min){
                    item.style.color=scheme_global['a-hover'];
                    item.style.fontWeight='bold';
                } else if (value_t==td_100_min || value_t==td_1000_min){
                    item.style.color=scheme_global['a'];
                    item.style.fontWeight='bold';
                }
            }
        }    
    }
    //-----------------------
	var date1_tmp=default_date_b('',true);
	var year_tmp=date1_tmp.getFullYear();
	
    var wordscount=[2026,21200];
    var year_increment=2000;    //合适的数值可显示结果为万位整数 - 保留注释
    if (year_tmp>wordscount[0]){
        wordscount[1]=wordscount[1]+year_increment*(year_tmp-wordscount[0]);    //先修改wordscount[1] - 保留注释
        wordscount[0]=wordscount[0]+year_tmp-wordscount[0];
    }
    
    var not_this_year=false;
    var years_used=(enwords.length - wordscount[1])/year_increment;  //已完成的单词数>计划数 - 保留注释
    
    if (years_used>=year_tmp-wordscount[0]){
        if (years_used==Math.ceil(years_used)){
            years_used=years_used+1;
        } else {
            years_used=Math.ceil(years_used);
        }
        not_this_year=true;
    } else {
        years_used=year_tmp-wordscount[0];
    }
    
	var blstr_tmp='';
    var list_t=[];
    
    if (not_this_year==false){
	    var month_tmp=date1_tmp.getMonth()+1;    
        for (let blxl=3;blxl<10;blxl=blxl+3){
            if (month_tmp<=blxl){
                blstr_tmp='<tr><td>距'+blxl+'月底</td><td align=right>';
                blstr_tmp=blstr_tmp+days_between_two_dates_b(date1_tmp,year_tmp+'-'+(blxl+1)+'-01')+'</td>';

                blstr_tmp=blstr_tmp+'</tr>';
                list_t.push(blstr_tmp);
            }
        }
    }

    var scan_times=0;
    var max_everyday=0;
    var td_last2_value=-1;
    var mincount=(parseInt(wordscount[1].toString().slice(0,1))+1)*10000;
    var do_break=false;
	while (true){
        scan_times=scan_times+1;
        let words_sum=wordscount[1]+years_used*year_increment;
        if (scan_times>3){
            console.log(years_used,words_sum,mincount);
            if (words_sum>=70000 && words_sum>=wordscount[1]+20000){
                do_break=true;
            }
            else if ((wordscount[0]+years_used) % 15 !== 0 && words_sum<mincount){
                years_used=years_used+1;
                continue;
            } else if (words_sum>=mincount){
                mincount=mincount+10000;
            }
        }
        
		var ndays_t=days_between_two_dates_b(date1_tmp,new Date((wordscount[0]+years_used+1)+'-01-01'));
        
		blstr_tmp='<tr>';
        blstr_tmp=blstr_tmp+'<td>距'+(wordscount[0]+years_used)+'年底</td>';
        blstr_tmp=blstr_tmp+'<td align=right>'+ndays_t.toFixed(0)+'</td>';
        blstr_tmp=blstr_tmp+'<td align=right>'+words_sum+'</td>';

        blstr_tmp=blstr_tmp+'<td align=right>';
		var day_t=Math.max((ndays_t-1),1);
		var wcount_t=((wordscount[1]+years_used*year_increment)-enwords.length)/day_t;
        if (wcount_t>0){
            max_everyday=Math.max(max_everyday,wcount_t);
            blstr_tmp=blstr_tmp+wcount_t.toFixed(3);
            blstr_tmp=blstr_tmp+'</td>';
            
            blstr_tmp=blstr_tmp+'<td class="td_last1" align=right>';
            var zero_point_one=(wcount_t*10-Math.floor(wcount_t*10))/10;
            if (Math.round(zero_point_one*1000)==0){
                zero_point_one=zero_point_one+0.1;
            }

            blstr_tmp=blstr_tmp+Math.ceil(day_t*zero_point_one);
            blstr_tmp=blstr_tmp+' / -'+zero_point_one.toFixed(3)+'</td>';
            
            blstr_tmp=blstr_tmp+'<td class="td_last2" align=right>';
            td_last2_value=Math.ceil(day_t*(wcount_t-Math.floor(wcount_t)));

            blstr_tmp=blstr_tmp+td_last2_value;
            blstr_tmp=blstr_tmp+' / -'+(wcount_t-Math.floor(wcount_t)).toFixed(3)+'</td>';
        } else {
            blstr_tmp=blstr_tmp+'/</td><td class="td_last1" align=right>/</td><td class="td_last2" align=right>/</td>';
        }
        
        blstr_tmp=blstr_tmp+'</tr>';
        
        list_t.push(blstr_tmp);
        years_used=years_used+1;
        if (do_break){break;}
	}
   
    local_storage_today_b('enwords_days_last_row_minus_one',40,td_last2_value,'/',[15,0,0.5]);

    blstr_tmp='<table id="table_plan_count" class="table_common">';
    blstr_tmp=blstr_tmp+'<tr><th>时间段</th><th>剩余天数</th><th>计划累计<br />单词数</th><th>每日须记忆<br />单词数</th><th>-0.1所需的额外<br />记忆单词量</th><th>-1所需的额外<br />记忆单词量</th></tr>';
    blstr_tmp=blstr_tmp+list_t.join('\n');
    
    blstr_tmp=blstr_tmp+'<tr><td colspan=6>';    
    local_storage_today_b('enwords_plan_per_day',40,max_everyday.toFixed(3),'/',[15,0,0.5]);

    var blint=Math.ceil(enwords.length/1000)*1000;
    var blvalue=math_ceil10_enwc_b(blint);
    var blplan=sub_days_enwc_b_plan(max_everyday,blint,blvalue,true);
    
    var max_everyday_ceil=Math.max(2,Math.ceil(max_everyday));

    for (let blxl=Math.max(3,Math.min(4,max_everyday_ceil));blxl<=5;blxl++){    //按每日 5 计算，每周须记忆单词 - 保留注释
        if (blxl!==max_everyday){
            blplan=blplan+sub_days_enwc_b_plan(blxl,blint,blvalue);
        }
    }
        
    if (only_plan){
        return blplan;
    }
    blstr_tmp=blstr_tmp+blplan+'</td></tr></table>';
	document.getElementById('span_days').innerHTML='<b>'+quote_or_fav_b()+'</b>';
    document.getElementById('span_days').insertAdjacentHTML('afterend',popup_b('popup_eng_days',blstr_tmp,'','90%',(ismobile_b()?'0.5rem':'')));
   
    sub_days_enwc_b_mintd('td_last1');
    sub_days_enwc_b_mintd('td_last2');
}

function mobile_style_enwc_b(mobile_more='',pc_more=''){
	var mobile_t=[
	'ul,ol,li{font-size:1.2rem;line-height:120%;margin-bottom:0.5rem;}',
	'p.article{font-size:1rem;line-height:120%;}',
	'#divhtml {margin:0 0.5rem;}',
    '#table_plan_count{font-size:0.5rem;}',
    mobile_more,
    ];

	var pc_t=[
	'ul,ol,li{font-size:1rem;line-height:150%;padding:0px;}',
	'p.article{font-size:1rem;line-height:150%;}',
	'#divhtml {margin-left:3rem; max-width:900px;font-family:Noto Sans;}',
    '#table_plan_count{font-size:0.9rem;}',
    pc_more,
    ];
    
	mobile_style_b(mobile_t, pc_t);
}

function showhide_enwc_b(){
	var odiv=document.getElementById('div_show_hide');
	if (odiv.style.display=='none'){
        odiv.style.display='block';
    } else {
        odiv.style.display='none';
    }
}

function menu_base_enwc_b(){
    var str_t=klmenu_hide_b('#top');
    var str2_t=klmenu_hide_b('#a_recent_bookmark');
    var blhost=local_storage_get_b('kl_remote_host',-1,false);
    var sele_path=klbase_sele_path_b()[1];
    
    var menu1=[
    '<a href="'+sele_path+'/html/enwords_exam.htm?n=100&type=recent" onclick="'+str_t+'" target=_blank>单词填空</a>',
    '<span class="span_menu" onclick="'+'getlines_rnd_enwc_b(\'\',true,false);'+str_t+'">随机旧单词</span>',    
    '<span class="span_menu" onclick="'+str_t+'rnd_cn_search_enwc_b();">随机中文词汇搜索</span>',
    '<a href="'+sele_path+'/html/enwords_today.htm" onclick="'+str_t+'" target=_blank>Today Words</a>',
    ];
    
    var group_list=[
    ['0','get_day_words_enwc_b(\'\',\'\',\'old\');',true],
    ['2','get_day_words_enwc_b(\'\',\'\',\'old2\');',true],
    ['0和2','get_day_words_enwc_b(0,\'\',\'old02_OR\');',true],
    ];    
    menu1.push(menu_container_b(str_t,group_list,'今日旧单词：'));
    
    var menu2=['<span class="span_menu" onclick="'+str_t+'en_words_temp_textarea_b(\'divhtml\',true); words_count_enwords_b();">临时词库</span>',    
    '<a href="'+blhost+'/klwebphp/temp_txt_share.php?type=enwords_temp" onclick="'+str_t+'" target=_blank>打开临时记事本('+blhost.slice(-3,)+')</a>',    
    ];
    
    var menu3=menu_recent_enwc_b(str2_t,'show_recent_words_enwc_b');
    menu3=menu3.concat([ 
    '<span class="span_menu" onclick="'+'en_word_recent_bookmark_b();'+str2_t+'">设置书签</span>',
    '<span class="span_menu" onclick="'+'recent_words_dead_enwc_b();'+str2_t+'">失效的最近记忆单词</span>',    
    ]);
    return [menu1,menu2,menu3];
}

function menu_recent_enwc_b(str_t,fn_name){
    return [
    '<span class="span_menu" onclick="'+str_t+fn_name+'(\'全部\');">最近记忆单词(全部)</span>',
    '<span class="span_menu" onclick="'+str_t+fn_name+'(\'recent\');">最近记忆单词(recent)</span>',
    '<span class="span_menu" onclick="'+str_t+fn_name+'(\'top\');">最近记忆单词(top)</span>',    
    '<span class="span_menu" onclick="'+str_t+fn_name+'(\'随机500\');">最近记忆单词(随机500)</span>',
    '<span class="span_menu" onclick="'+str_t+fn_name+'(\'全部随机500\');">最近记忆单词(全部随机500)</span>',
    ];
}

function show_recent_words_enwc_b(cstype,add_date_line=true,fn_name=false,fn_para=false){
    switch (cstype){
        case '全部':
            recent_words_list_enwords_b(-1,100,false,true,add_date_line);
            break;
        case 'recent':
            recent_words_list_enwords_b(0,100,false,true,add_date_line);
            break;
        case 'top':
            recent_words_list_enwords_b(1,100,false,true,add_date_line);        
            break;
        case '随机500':
            recent_words_list_enwords_b(0,500,true,true,add_date_line);        
            break;
        case '全部随机500':        
            recent_words_list_enwords_b(-1,500,true,true,add_date_line);                        
            break;
    }
    if (fn_name!==false){
        fn_name(fn_para);    
    }
}

function recent_words_dead_enwc_b(){
    var list_t=en_words_temp_list_b(true,true);
    words_searched_arr_global=[];
    for (let item of list_t){
        if (item.includes('===')){continue;}
        words_searched_arr_global.push([item,'[null]','']);
    }    
    document.getElementById('divhtml').innerHTML=enwords_array_to_html_b(words_searched_arr_global,true);
    show_sentence_enwc_b();                
}

function show_new_words_enwc_b(querystr,ew=true){
    var ospans=document.querySelectorAll(querystr);
    var list_t=[];
    for (let item of ospans){
        list_t.push(item.innerText);
    }
    get_new_words_arr_obj_enbook_b(2,list_t.join('\n'),ospans,true,true,'',ew);
}

function word_doms_txt_get_enwc_b(){
    var oas=document.querySelectorAll('div#divhtml span.a_word');
    var result_t=[];
    for (let odom of oas){
        result_t.push(odom.innerText);
    }
    return result_t;
}

function sls_search_link_generate_enwc_b(cslist){
    if (cslist.length==0){return;}
    var blstr='^('+cslist.join('|').replace(new RegExp(' ','g'),'\\s')+')$_reg';
    temp_search_link_value_set_b(blstr);
    window.open('enwords.htm?sls');
}

function getlines_rnd_enwc_b(cslines='',showhtml=true,without_textarea=true){
	if (cslines===''){
        var cslines= document.getElementById('input_lines').value.trim();
    }
    cslines= Math.min(max_result_enwords_b(),Math.max(0,parseInt(cslines)));
	document.getElementById('input_lines').value=cslines;

	enwords_sort_b('r');
    
	var bllength=enwords.length;
	
	words_searched_arr_global=[];
	var bllink_t='';
	for (let blxl=0;blxl<cslines;blxl++){
		if (blxl>=bllength){break;}
		
		words_searched_arr_global.push(enwords[blxl]);
		bllink_t=bllink_t+enwords[blxl][0]+'|';
	}
	var blhtml = document.getElementById('divhtml');
	var bljg=enwords_array_to_html_b(words_searched_arr_global)+'<p>';
    
    if (bllink_t.slice(-1)=='|'){
        bllink_t=bllink_t.substring(0,bllink_t.length-1);
    }
    if (showhtml){
        var bltextarea=(without_textarea?'':enwords_js_wiki_textarea_b(words_searched_arr_global));

	    blhtml.innerHTML=bljg+'<p><span class="aclick" onclick="sls_search_link_generate_enwc_b(word_doms_txt_get_enwc_b());">link</span> <span class="aclick" onclick="en_word_temp_batch_add_b();">批量添加当前条件下的单词为最近记忆单词</span></p>'+enwords_batch_div_b(words_searched_arr_global,'')+bltextarea;
        title_change_enwords_b('随机单词');
        en_words_show_check_b();
    }
    enwords_sort_b();
}

function rnd_cn_search_enwc_b(cslines='',showhtml=true){
	if (cslines===''){
        var cslines = document.getElementById('input_lines').value.trim();
    }
    cslines = Math.min(max_result_enwords_b(),Math.max(0,parseInt(cslines)));
    if (isNaN(cslines)){
        cslines=20;
    }
	document.getElementById('input_lines').value=cslines;
    
    words_searched_arr_global=[];
    
    enwords_sort_b('r');
    for (let bly=0;bly<10;bly++){
        var str_t=enwords[Math.max(0,parseInt(Math.random()*enwords.length))][2];
        str_t=str_t.replace(/[；，。！？”“‘、《》【】（）—…📋]/mg,' ');
        var list_t=array_unique_b(str_t.match(/[^\x00-\xff]{2,5}/g) || []);
        
        document.getElementById('input_search').value=list_t.join(' ');
        wordsearch_enwords_b('',-1,[],false,showhtml);  //有可能 words_searched_arr_global 未重新赋值 - 保留注释
        //即便如此，也有可能返回只有1个的结果 - 保留注释
        if (words_searched_arr_global.length>=cslines){break;}
    }
    
    words_searched_arr_global=words_searched_arr_global.slice(0,cslines);
    if (showhtml){
        var blhtml = document.getElementById('divhtml');
        var bljg=enwords_array_to_html_b(words_searched_arr_global);
        bljg=bljg+'<p><span class="aclick" onclick="en_word_temp_batch_add_b();">批量添加当前条件下的单词为最近记忆单词</span></p>';
        bljg=bljg+enwords_batch_div_b(words_searched_arr_global,'')+enwords_js_wiki_textarea_b(words_searched_arr_global);
        blhtml.innerHTML=bljg;
        title_change_enwords_b('随机中文词汇');
    }
    enwords_sort_b();
}

function math_ceil10_enwc_b(csnum){
    //8339 -> 9000 - 保留注释
    //1002 -> 2000 - 保留注释
    //只支持正数 - 保留注释
    if (csnum<0){
        return csnum;
    }
    var blstr=csnum.toString();
    var bllen=blstr.length;
    return (parseInt(blstr.substring(0,1))+1)*(10**(bllen-1));
}
