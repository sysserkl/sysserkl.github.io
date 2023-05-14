function get_day_words_enwc_b(csday='',csmonth='',cstype='new',cs_write_html=true,cs_write_input=true){
    //cstype new:新单词 - 保留注释
    var blyear;
	var bldate;

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
    }
    else {
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
    var list_t=[];
	for (let blxl=5;blxl>0;blxl--){
		if (csday-blxl>=1){
            list_t.push(csday-blxl);
		}
	}
    list_t.push(csday);

    var the_month_day=month_day_b(csmonth);
	for (let blxl=1;blxl<=5;blxl++){
		if (csday+blxl<=the_month_day){
            list_t.push(csday+blxl);
		}
	}

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
            case 'get_day_sentences_enwc_b':
                bljg=bljg+' onclick=\''+jsname+'('+item+','+csmonth+','+(use_asc?'true':'false')+');\'>';        
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
    
    var blyear;
    var bldate;
    
    [blyear,csmonth,csday,bldate]=get_month_day_enwc_b(csday,csmonth);
    if (csmonth==0 || csday==0){return;}
        
	var blhtml = document.getElementById('divhtml');
    words_searched_arr_global=en_lines_days_b(enwords_article,bldate);
	var bljg=enwords_array_to_html_b(words_searched_arr_global);
    
    bljg=bljg+'<p>'+pages_day_enwc_b('article_words_list_enwc_b','',blyear,csmonth,csday)+'</p>';
    
    blhtml.innerHTML=bljg+enwords_batch_div_b(words_searched_arr_global,'')+enwords_js_wiki_textarea_b(words_searched_arr_global);
}

function get_day_sentences_enwc_b(csday='',csmonth='',use_asc=true){
    var blyear;
	var bldate;

    [blyear,csmonth,csday,bldate]=get_month_day_enwc_b(csday,csmonth);

    var csdays=months_b(csmonth-1)+csday;

    var list_t=[];
    if (use_asc){
        for (let blno=0;blno<en_sentence_global.length;blno++){
            var aline=en_sentence_global[blno];    
            var line_split=sentence_split_b(aline[0],blno);
            for (let arow of line_split){
                var asc_t=asc_sum_b(arow);            
                if ((1+asc_t%365)==csdays){
                    list_t.push([arow].concat(aline.slice(1,)));
                }
            }
        }
        list_t.sort(function (a,b){return a[3]>b[3];}); //按 编号 排序 - 保留注释
        list_t.sort(function (a,b){return a[2]>b[2];}); //按 KLWiki title名 或 书名 排序 - 保留注释
    }
    else {
        en_sentence_to_default_order_b();    
        var blsection=en_sentence_global.length/365;
        var blstart=Math.floor((csdays-1)*blsection);
        var blend=Math.min(en_sentence_global.length,Math.floor(csdays*blsection));
        for (let blno=blstart;blno<blend;blno++){
            var aline=en_sentence_global[blno];    
            var line_split=sentence_split_b(aline[0],blno);
            var arow=line_split.join('');
            list_t.push([arow].concat(aline.slice(1,)));
        }
    }
    
    var bljg=sentence_list_2_html_b(list_t,[''],500,true,false,!use_asc,!use_asc);    
    var pages='<p>'+pages_day_enwc_b('get_day_sentences_enwc_b','',blyear,csmonth,csday,use_asc)+'</p>';
    if (use_asc){
        bljg='<div class="div_sentence">'+bljg.join('\n')+pages+'</div><p><i>('+bljg.length+')</i></p>';
    }
    else {
        var result_t=[];
        var source='';
        var p_style=en_sentence_p_style_b();
        for (let item of bljg){
            if (item[1]+item[2]!==source){
                result_t.push('<hr />\n<h3>'+item[1]+item[2]+'</h3>');
                source=item[1]+item[2];
            }
            result_t.push(p_style+item[0]+' <sub class="sub_clicked_line_word_count" style="cursor:pointer;" onclick="lines_enword_total_b(this);"></sub></p>');
        }
        bljg='<div class="div_sentence">'+result_t.join('\n')+pages+'</div><p><i>('+bljg.length+'/<span id="span_clicked_line_word_total">0</span>)</i></p>';
    }
	document.getElementById('divhtml').innerHTML=bljg;
    line_count_enwc_b();
    setTimeout(en_sentence_mobile_b,10);
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
    //-------------------------------------------
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
    }
    else {
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
    }
	else{
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

    var page_html='';
    var pages_count=Math.ceil(bllength/cslines);
    var blpageno=(csno-1)/cslines+1;
    if (pages_count>=1){
        for (let blxl=1;blxl<=pages_count;blxl++){
            page_html=page_html+page_one_b(pages_count,blpageno,blxl,'onclick="getlines_enwc_b('+((blxl-1)*cslines+1)+','+cslines+');"',2,0);
        }
        var blfound;
        [page_html,blfound]=page_remove_dot_b(page_html);
        if (blfound){
            page_html=page_html+page_prev_next_b(pages_count,blpageno,'onclick="getlines_enwc_b('+((blpageno-1-1)*cslines+1)+','+cslines+');"','onclick="getlines_enwc_b('+((blpageno-1+1)*cslines+1)+','+cslines+');"','onclick="getlines_location_enwc_b('+pages_count+','+cslines+');"');
        }
        page_html='<p>'+page_html+'</p>';
    }
    
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
}

function show_sentence_enwc_b(maxlines=0,showcount=true,is_random=false,show_button=true){
    function sub_show_sentence_enwc_b_count(){
        var odiv=document.querySelector('div.div_word_sentence_rank');
        if (!odiv){return;}
        word_sentence_rank=object2array_b(word_sentence_rank,false,2);
        var rank_dict={'0':[],'1':[],'2':[],'more':[]};
        for (let item of word_sentence_rank){
            if (rank_dict[item[0]]==undefined){
                rank_dict['more']=rank_dict['more'].concat(item[1]);
            }
            else {
                rank_dict[item[0]]=rank_dict[item[0]].concat(item[1]);
            }
        }
        var bljg=[];
        for (let key in rank_dict){
            if (rank_dict[key].length==0){continue;}
            bljg.push('<p><b> '+rank_dict[key].length+' 个单词 '+key+' 条例句</b></p>');
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
        }
        else {
            sub_show_sentence_enwc_b_one_step(font_size,button_str);
        }
    }
    //--------------------------
    var t0 = performance.now();
    if (is_random){
        en_sentence_global.sort(randomsort_b);
    }
    var osen=document.getElementsByClassName('div_sentence');
    if (osen.length>0 || en_sentence_global.length==0){
        console.log('已存在 .div_sentence 或 en_sentence_global 长度为 0');
        return;
    }

    var oas=document.querySelectorAll('span.a_word');
    var oaslen=oas.length;
    
    if (maxlines>0){
        var csmax=maxlines;
    }
    else {
        if (ismobile_b()){
            var csmax=10;
            if (oaslen>10){
                csmax=5;
            }
        }
        else {
            var csmax=20;
            if (oaslen>10){
                csmax=10;
            }
        }
    }
    //-------------------
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
            blstr_tmp=blstr_tmp+'；<br />达到 20000 需要 '+bldays2_ceil.toFixed(1)+' 天，即 '+next_day_b('',bldays2_ceil);
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
                }
                else if (value_t==td_100_min || value_t==td_1000_min){
                    item.style.color=scheme_global['a'];
                    item.style.fontWeight='bold';
                }
            }
        }    
    }
    //------------
	var date1_tmp=default_date_b('',true);
	var year_tmp=date1_tmp.getFullYear();
	
    var wordscount=[2020,10000];
    var year_increment=1250;

    var not_this_year=false;
    var years_used=(enwords.length - wordscount[1])/year_increment;  //已完成的单词数>计划数 - 保留注释
    
    if (years_used>=year_tmp-wordscount[0]){
        if (years_used==Math.ceil(years_used)){
            years_used=years_used+1;
        }
        else {
            years_used=Math.ceil(years_used);
        }
        not_this_year=true;
    }
    else {
        years_used=year_tmp-wordscount[0];
    }
    
	var blstr_tmp='';
    var list_t=[];
    
    if (not_this_year==false){
	    var month_tmp=date1_tmp.getMonth()+1;    
        for (let blxl=3;blxl<10;blxl=blxl+3){
            if (month_tmp<=blxl){
                blstr_tmp='<tr><td style="border-bottom:black solid 0.1rem;">距'+blxl+'月底</td><td align=right>';
                blstr_tmp=blstr_tmp+days_between_two_dates_b(date1_tmp,year_tmp+'-'+(blxl+1)+'-01')+'</td>';

                blstr_tmp=blstr_tmp+'</tr>';
                list_t.push(blstr_tmp);
            }
        }
    }

    var scan_times=0;
    var max_everyday=0;
    var td_last2_value=-1;
	while (true){
        if (scan_times>=5){break;}        
        scan_times=scan_times+1;
		var ndays_t=days_between_two_dates_b(date1_tmp,new Date((wordscount[0]+years_used+1)+'-01-01'));
        
		blstr_tmp='<tr>';
        blstr_tmp=blstr_tmp+'<td>距'+(wordscount[0]+years_used)+'年底</td>';
        blstr_tmp=blstr_tmp+'<td align=right>'+ndays_t.toFixed(0)+'</td>';
        blstr_tmp=blstr_tmp+'<td align=right>'+(wordscount[1]+years_used*year_increment)+'</td>';

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
        }
        else {
            blstr_tmp=blstr_tmp+'/</td><td class="td_last1" align=right>/</td><td class="td_last2" align=right>/</td>';
        }
        
        blstr_tmp=blstr_tmp+'</tr>';
        
        list_t.push(blstr_tmp);
        years_used=years_used+1;
	}
   
    local_storage_today_b('enwords_days_last_row_minus_one',40,td_last2_value,'/',[15,0,0.5]);

    blstr_tmp='<table id="table_plan_count" cellpadding=0 cellspacing=0>';
    blstr_tmp=blstr_tmp+'<tr><td align=center>时间段</td><td align=center>剩余天数</td><td align=center>计划累计<br />单词数</td><td align=center>每日须记忆<br />单词数</td><td align=center>-0.1所需的额外<br />记忆单词量</td><td align=center>-1所需的额外<br />记忆单词量</td></tr>';
    blstr_tmp=blstr_tmp+list_t.join('\n');
    
    blstr_tmp=blstr_tmp+'<tr><td colspan=6>';    
    local_storage_today_b('enwords_plan_per_day',40,max_everyday.toFixed(3),'/',[15,0,0.5]);

    var blint=Math.ceil(enwords.length/1000)*1000;
    var blvalue=math_ceil10_b(blint);    
    var blplan=sub_days_enwc_b_plan(max_everyday,blint,blvalue,true);
    
    var max_everyday_ceil=Math.max(2,Math.ceil(max_everyday));
    for (let blxl=max_everyday_ceil;blxl<5;blxl++){
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

function mobile_style_enwc_b(){
	var mobile_t='\n<style>\n';
	mobile_t=mobile_t+'ul,ol,li{font-size:1.2rem;line-height:120%;margin-bottom:0.5rem;}\n';
	mobile_t=mobile_t+'p.article{font-size:1rem;line-height:120%;}\n';
	mobile_t=mobile_t+'#divhtml {margin:0 0.5rem;}\n';
    mobile_t=mobile_t+'#table_plan_count{font-size:0.6rem;}\n';
    mobile_t=mobile_t+'#table_plan_count td{border-bottom:black solid 0.1rem;padding:0.2rem;}\n';
	mobile_t=mobile_t+'</style>\n';

	var pc_t='\n<style>\n';
	pc_t=pc_t+'ul,ol,li{font-size:1rem;line-height:150%;padding:0px;}\n';
	pc_t=pc_t+'p.article{font-size:1rem;line-height:150%;}\n';
	pc_t=pc_t+'#divhtml {margin-left:3rem; max-width:900px;font-family:Noto Sans;}\n';
    pc_t=pc_t+'#table_plan_count{font-size:1rem;font-family:Noto Sans}\n';  
    pc_t=pc_t+'#table_plan_count td{border-bottom:black solid 0.1rem;padding:0.2rem;}\n';
	pc_t=pc_t+'</style>\n';
	mobile_style_b(mobile_t, pc_t);
}

function showhide_enwc_b(){
	var odiv=document.getElementById('div_show_hide');
	if (odiv.style.display=='none'){
        odiv.style.display='block';
    }
	else {
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
    '<span class="span_menu" onclick="'+str_t+'get_day_words_enwc_b(\'\',\'\',\'old\');">今日旧单词0</span>',
    '<span class="span_menu" onclick="'+str_t+'get_day_words_enwc_b(\'\',\'\',\'old2\');">今日旧单词2</span>',
    '<span class="span_menu" onclick="'+str_t+'get_day_words_enwc_b(0,\'\',\'old02_OR\');">今日旧单词0和2</span>',
    '<span class="span_menu" onclick="'+str_t+'rnd_cn_search_enwc_b();">随机中文词汇搜索</span>',
    '<a href="'+sele_path+'/html/enwords_today.htm" onclick="'+str_t+'" target=_blank>Today Words</a>',
    '<a href="'+sele_path+'/html/enwords_article.htm" onclick="'+str_t+'" target=_blank>文章和单词</a>',
    
    ];
    
    var menu2=['<span class="span_menu" onclick="'+str_t+'en_words_temp_textarea_b(\'divhtml\',\'words_count_enwords_b\'); words_count_enwords_b();">临时词库</span>',    
    '<a href="'+blhost+'/klwebphp/temp_txt_share.php?type=enwords_temp" onclick="'+str_t+'" target=_blank>打开临时记事本('+blhost.slice(-3,)+')</a>',    
    ];
    var menu3=[
    '<span class="span_menu" onclick="'+'recent_words_list_enwords_b(-1);'+str2_t+'">最近记忆的单词(全部)</span>',
    '<span class="span_menu" onclick="'+'recent_words_list_enwords_b(0);'+str2_t+'">最近记忆的单词(recent)</span>',
    '<span class="span_menu" onclick="'+'recent_words_list_enwords_b(1);'+str2_t+'">最近记忆的单词(top)</span>',
    '<span class="span_menu" onclick="'+'recent_words_list_enwords_b(0,500,true);'+str2_t+'">最近记忆的单词(随机500)</span>',
    '<span class="span_menu" onclick="'+'recent_words_list_enwords_b(-1,500,true);'+str2_t+'">最近记忆的单词(全部随机500)</span>',    
    '<span class="span_menu" onclick="'+'en_word_recent_bookmark_b();'+str2_t+'">设置书签</span>',
    '<span class="span_menu" onclick="'+'recent_words_dead_enwc_b();'+str2_t+'">失效的最近记忆的单词</span>',    
    ];
    return [menu1,menu2,menu3];
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
    get_new_words_arr_enbook_b(2,list_t.join('\n'),ospans,4,true,true,'',ew);
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

    enwords_sort_b('r');
    for (let bly=0;bly<10;bly++){
        var str_t=enwords[Math.max(0,parseInt(Math.random()*enwords.length))][2];
        str_t=str_t.replace(/[；，。！？”“‘、《》【】（）—…📋]/mg,' ');
        var list_t=array_unique_b(str_t.match(/[^\x00-\xff]{2,5}/g) || []);
        
        document.getElementById('input_search').value=list_t.join(' ');
        wordsearch_enwords_b('',-1,[],false,showhtml);
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
