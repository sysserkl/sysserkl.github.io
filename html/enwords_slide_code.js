function auto_enslide(csno){
    slide_type_global=[csno,(klmenu_check_b('span_random_en_slide',false)?2:1)];

	document.getElementById('div_slide').style.display='block';
    document.getElementById('div_transparent').style.display='block';
	document.getElementById('div_top_bottom').style.display='none';

    var cstype_t=slide_type_global[0];
    var csorder_t=slide_type_global[1];

	switch (cstype_t){
		case 1:
			if (csorder_t==2){
                enwords_sort_b('r');
            }
			break;
		case 3:
			if (csorder_t==2){
                words_searched_arr.sort(randomsort_b);
            }
			break;
		case 4:
			cocktail_enslide();
			if (csorder_t==2){
                words_searched_arr.sort(randomsort_b);
            }
			break;
	}

	show_enslide();
	
	var inter_t=Math.min(60*60*1000, Math.max(500,parseInt(document.getElementById('input_slide_interval').value)));
	slideshow=setInterval(show_enslide,inter_t);
}

function menu_enslide(){
    var str_t=klmenu_hide_b('#top');
    var klmenu_old;
    var klmenu1;
    var klmenu_brain;    
    [klmenu_old,klmenu1,klmenu_brain]=menu_base_enwc_b();
    klmenu1=klmenu1.concat([
    '<span class="span_menu" onclick="'+str_t+'window.open(location.href,\'\',\'width=500, height=200\');">新窗口</span>',
    ]);

    var klmenu4=[];
    var menu_t=['已背单词','生词库','条件结果','鸡尾酒'];
    for (let blxl=0;blxl<menu_t.length;blxl++){
        klmenu4.push('<span class="span_menu" onclick="'+str_t+'auto_enslide('+(blxl+1)+');">'+menu_t[blxl]+'</span>');
    }

    klmenu4.push('<span class="span_menu" onclick="'+str_t+'recent_words_list_enwords_b(-1);auto_enslide(3);">最近记忆的单词(全部)</span>');
    klmenu4.push('<span class="span_menu" onclick="'+str_t+'recent_words_list_enwords_b(0);auto_enslide(3);">最近记忆的单词(recent)</span>');
    klmenu4.push('<span class="span_menu" onclick="'+str_t+'recent_words_list_enwords_b(1);auto_enslide(3);">最近记忆的单词(top)</span>');    
    klmenu4.push('<span class="span_menu" onclick="'+str_t+'recent_words_list_enwords_b(0,500,true);auto_enslide(3);">最近记忆的单词(随机500)</span>');
    klmenu4.push('<span class="span_menu" onclick="'+str_t+'recent_words_list_enwords_b(-1,500,true);auto_enslide(3);">最近记忆的单词(全部随机500)</span>');
    klmenu4.push('<span id="span_random_en_slide" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 随机排序</span>');

    var bljg=klmenu_multi_button_div_b(klmenu_b(klmenu1,'','14rem','1rem','1rem','60rem')+klmenu_b(klmenu_old,'旧','12rem','1rem','1rem','60rem')+klmenu_b(klmenu_brain,'🧠','17rem','1rem','1rem')+klmenu_b(klmenu4,'💡','17rem','1rem','1rem'),'','0rem')+' ';
    
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',bljg);
}

function show_enslide(csxl){
	var csnum=arguments.length;
	if (csnum==0){
        var csxl = slide_num;
    }
	
    var cstype_t=slide_type_global[0];
    var csorder_t=slide_type_global[1];
    
	switch (cstype_t){
		case 1:
			if (csorder_t==1){
				if (csxl>enwords.length-1){
					csxl=0;
				}
				if (csxl==0){
                    csxl=Math.max(0,parseInt(document.getElementById('input_lineno').value-1));
                }
				var bljg=en_one_word_b(enwords[csxl],[-1,0,true]);
			}
			else{
				if (csxl>enwords.length-1){
					csxl=0;
					enwords_sort_b('r');
				}
				var bljg=en_one_word_b(enwords[csxl],[-1,0,true]);
			}
			break;
		case 3:
			if (words_searched_arr.length==0){
				hide_enslide();
				return;
			}
			if (csxl>words_searched_arr.length-1){
				csxl=0;
				if (csorder_t==2){
                    words_searched_arr.sort(randomsort_b);
                }
			}
			var bljg=en_one_word_b(words_searched_arr[csxl],[-1,0,true]);
			break;
		case 4:
			if (words_searched_arr.length==0){
				hide_enslide();
				return;
			}
			if (csxl>words_searched_arr.length-1){
				csxl=0;
				cocktail_enslide();
				if (csorder_t==2){
                    words_searched_arr.sort(randomsort_b);
                }
			}
			var bljg=en_one_word_b(words_searched_arr[csxl],[-1,0,true]);
			break;
	}
		
	document.getElementById("div_slide").innerHTML='<table width=100% height=100% style="border:10px #c0c0c0 solid;background-color:#f0f0f0;"><tr><td align=center valign=center style="padding:0px 30px;font-size:'+slide_font_size+'rem;">'+bljg+'</td></tr></table>';

	slide_num=csxl+1;
}

function hide_enslide(){
	var odiv=document.getElementById('div_slide');
    if (odiv){
        odiv.style.display='none';
    }
    odiv=document.getElementById('div_transparent');
    if (odiv){
        odiv.style.display='none';
    }
	odiv=document.getElementById('div_top_bottom');
    if (odiv){
        odiv.style.display='block';
    }
	clearInterval(slideshow);
	slide_num=0;
    enwords_sort_b();
}

function args_enslide(){
    var cskeys=href_split_b(location.href);
    if (cskeys.length>0 && cskeys[0]!==''){
        //形如：enwords_slide.htm?s=english& - 保留注释
        for (let bltmpstr of cskeys){
            bltmpstr=bltmpstr.trim();
            if (bltmpstr.substring(0,9)=='cocktail='){
                //形如 cocktail=20,1:0.5:0.6 - 保留注释
                let list_t=bltmpstr.substring(9).split(',');
                if (list_t.length>1){
                    cocktail_enslide(list_t[0],list_t[1]);
                }
                else {
                    cocktail_enslide(list_t[0]);
                }
                break;
            }
        }
    }
    else{
        getlines_enwc_b(1,40);
    }
}

function cocktail_enslide(cslines='',cspercent=''){
    input_date_set_enwords_b();
    
	if (cslines==''){
	    cslines=document.getElementById('input_lines').value;
    }
	document.getElementById('input_lines').value=cslines;
    
    if (cspercent==''){
	    cspercent=document.getElementById('input_cocktail_percent').value;
    }
    cspercent=cspercent.trim().replace(new RegExp("[:：,，、]","g"),' ')
    cspercent=cspercent.replace(new RegExp(":","g"),' ')
	while (cspercent.includes('  ')){
		cspercent=cspercent.replace(/  /,' ');
	}
	cspercent=cspercent.trim().split(' ');
	var percent_recent_t=1;
	var percent_random_old_t=0.2;
    
	if (cspercent.length>=1){
        percent_recent_t=parseFloat(cspercent[0]);
    }
	if (cspercent.length>=2){
        percent_random_old_t=parseFloat(cspercent[1]);
    }
    
	percent_recent_t=Math.max(0,percent_recent_t);
	percent_random_old_t=Math.max(0,percent_random_old_t);
    
	percent_recent_t=Math.min(1,percent_recent_t);
	percent_random_old_t=Math.min(1,percent_random_old_t);

	document.getElementById('input_cocktail_percent').value=percent_recent_t+':'+percent_random_old_t;
	
	wordsarr_t=[];
    wordsarr2_t=[];
    
	//随机旧单词
    enwords_sort_b('r');
	
	var bllength=Math.min(Math.floor(cslines*percent_random_old_t),enwords.length);
	for (var blxl=0;blxl<bllength;blxl++){
        if (!wordsarr2_t.includes(enwords[blxl][0])){
		    wordsarr_t.push(enwords[blxl]);
            wordsarr2_t.push(enwords[blxl][0]);
        }
	}
    enwords_sort_b();
	//--------------
	// var bllength=Math.min(Math.floor(cslines*percent_recent_t),enwords.length); - 保留注释   
    //指定日期旧单词0或2，除非 percent_recent_t 为 0 ，否则数量不受比例限制
    if (percent_recent_t>0){
        var today_word_t=get_day_words_enwc_b(0,0,'old02_OR',false);
        for (let aword of today_word_t){
            if (!wordsarr2_t.includes(aword[0])){
                wordsarr_t.push(aword);
                wordsarr2_t.push(aword[0]);
            }
        }
    }
	//--------------
    words_searched_arr=[];
    for (let item of wordsarr_t){
        words_searched_arr.push(item);
    }
    wordsarr_t=[];
    document.getElementById('divhtml').innerHTML=enwords_array_to_html_b(words_searched_arr);
    
    title_change_enwords_b('鸡尾酒');
}

function init_enslide(){
    input_with_x_b('input_search',11,'',false,'input_reg',true);
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.4rem'),true,false,2);
    //---
    slide_control_table_b('div_transparent');
    document.getElementById('div_transparent_td_l').setAttribute('onclick','slide_num=Math.max(0,slide_num-2);show_enslide();');
    document.getElementById('div_transparent_td_r').setAttribute('onclick','show_enslide();');
    document.getElementById('div_transparent_td_m1').setAttribute('onclick','slide_font_size=Math.min(100,slide_font_size+0.5);slide_num=Math.max(0,slide_num-1);show_enslide();');
    document.getElementById('div_transparent_td_m2').setAttribute('onclick','slide_font_size=Math.max(0.5,slide_font_size-0.5);slide_num=Math.max(0,slide_num-1);show_enslide();');
    document.getElementById('div_transparent_td_m3').setAttribute('onclick','hide_enslide();');
    //---
    var today = new Date();
    if (document.getElementById('input_day').value==''){
        document.getElementById('input_day').value=today.getDate();
    }
    if (document.getElementById('input_month').value==''){
        document.getElementById('input_month').value=today.getMonth()+1;
    }    
    //---
    enwords_init_b();
    menu_enslide();
    local_storage_today_b('enwords_statistics',40,enwords.length,'/');
    args_enslide();
    words_count_enwords_b();
    hide_enslide();    
}
