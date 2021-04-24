function init_dpr(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
}

function show_hide_dpr(show_textarea=true){
    var odiv=document.getElementById('div_content_dpr');
    var otextarea=document.getElementById('textarea_document_proofreader');
    if (show_textarea){
        odiv.style.display='none';
        otextarea.style.display='';
    }
    else {
        odiv.style.display='';
        otextarea.style.display='none';
        var list_t=otextarea.value.split('\n');
        odiv.innerHTML='<p>'+list_t.join('</p>\n<p>')+'</p>\n';
    }
}

function array_sort_count_dpr(csarray,sort_type='num'){
    var list_t=array_count_b(csarray,true,true);
    switch (sort_type){
        case 'num':
            list_t.sort(function (a,b){return parseInt(a)>parseInt(b);});
            break;
        case 'str':
            list_t.sort();
    }
    
    var blstr=list_t.join(' ◽ ');
    blstr=blstr.replace(new RegExp(/(\(.*?\))/,'g'),'<span style="color:grey;"><small>$1</small></span>');
    return blstr;
}

function high_light_dpr(csarray,csstyle){
    var odiv=document.getElementById('div_content_dpr');
    var oldtxt=odiv.innerText;
    var oldhtml=odiv.innerHTML;
    var newhtml=oldhtml;
    for (let item of csarray){
        if (!newhtml.includes(item)){continue;}
        try{
            newhtml=newhtml.replace(new RegExp(item,'g'),'<span style="'+csstyle+'">'+item+'</span>');
            odiv.innerHTML=newhtml;
            if (odiv.innerText!==oldtxt){
                odiv.innerHTML=oldhtml;
            }
        }
        catch (error) {
            console.log('high_light_dpr','error:',item);
        }
    }
}

function cirminal_law_dpr(){
    var otextarea=document.getElementById('textarea_document_proofreader');
    var blstr=otextarea.value;
    show_hide_dpr(false);
    
    var result_t=[];
    //中文日期
    var ymd_cn_list=chinese_find_ymd_b(blstr);
    var ymd_cn_varified_list=[];
    for (let item of ymd_cn_list){
        var bldate=validdate_b(chinese_ymd_2_number_b(item));
        if (bldate===false){
            result_t.push('🔴 日期格式错误：'+item);
        }
        else {
            ymd_cn_varified_list.push([item,date2str_b(bldate)]);
        }
    }
    result_t.push('⚪ 中文日期格式：'+array_sort_count_dpr(ymd_cn_list,'str'));
    high_light_dpr(ymd_cn_list,'border-bottom:0.2rem solid blue;');
    
    //阿拉伯数字日期
    var ymd_num_list=blstr.match(/\d{1,}年\d{1,}月\d{1,}日/g) || [];
    var ymd_num_varified_list=[];
    for (let item of ymd_num_list){
        var bldate=validdate_b(item);
        if (bldate===false){
            result_t.push('🔴 日期格式错误：'+item);
        }
        else {
            ymd_num_varified_list.push([item,date2str_b(bldate)]);        
        }
    }
    result_t.push('⚪ 数字日期格式：'+array_sort_count_dpr(ymd_num_list,'str'));
    high_light_dpr(ymd_num_list,'border-bottom:0.2rem solid green;');


    //中文日期与阿拉伯数字日期对应
    var date_double_equal_set=new Set();
    var date_double_single_set=new Set();
    for (let item_cn of ymd_cn_varified_list){
        for (let item_num of ymd_num_varified_list){
            if (item_cn[1]==item_num[1]){
                date_double_equal_set.add(item_cn[0]+' == ' +item_num[0]);
                date_double_single_set.add(item_cn[0]);
                date_double_single_set.add(item_num[0]);
            }
        }
    }
    if (date_double_equal_set.size==0){
        result_t.push('⚪ 未发现成对日期');
    }
    else {
        result_t.push('⚪ 成对日期：'+Array.from(date_double_equal_set).join(' ◽ '));
    }
    high_light_dpr(Array.from(date_double_single_set),'background-color:skyblue;');

    //多个小数点
    var points_list=blstr.match(/\d+\.\d+\.|\d+\.{2,}\d+/g) || [];
    for (let item of points_list){
        result_t.push('❓ 多个小数点：'+item);
    }
    high_light_dpr(points_list,'background-color:pink;');

    //0
    var zero_list=blstr.match(/[〇○零]/g) || [];
    zero_list=array_unique_b(zero_list);
    if (zero_list.length>1){
        result_t.push('❓ 几种0写法：'+zero_list.join(' ◽ '));
    }

    //超过4位的连续数字
    var num5_list=blstr.match(/[0-9\-\.]{5,}/g) || [];
    if (num5_list.length>0){
        result_t.push('❓ 超过4位的连续数字：'+array_sort_count_dpr(num5_list));
    }
    
    //小于4位的连续数字
    var num1_3_list=blstr.match(/\b[0-9\-\.]{1,3}\b/g) || [];
    if (num1_3_list.length>0){
        result_t.push('⚪ 小于4位的连续数字：'+array_sort_count_dpr(num1_3_list));
    }
    
    //4位的连续数字
    var num4_list=blstr.match(/\b[0-9\-\.]{4}\b/g) || [];
    if (num4_list.length>0){
        result_t.push('⚪ 4位的连续数字：'+array_sort_count_dpr(num4_list));
    }
    
    //英文标点符号
    var en_punctuation_list=blstr.match(/[^\x00-\xff][\.,\?!"']/g) || [];
    if (en_punctuation_list.length>0){
        result_t.push('❓ 英文标点符号：'+en_punctuation_list.join(' ◽ '));
        high_light_dpr(en_punctuation_list,'background-color:pink;');
    }
    
    //刑期
    var duration_list=blstr.match(/自.*起至.*止/g) || [];
    if (duration_list.length==0){
        result_t.push('❓ 未发现刑期起止日期');
    }
    else {
        for (let one_duration of duration_list){
            var blfound=false;
            var from_to_date_list=chinese_find_ymd_b(one_duration);
            for (let blxl=0;blxl<from_to_date_list.length;blxl++){
                var bldate=validdate_b(chinese_ymd_2_number_b(from_to_date_list[blxl]));
                if (bldate===false){
                    result_t.push('🔴 刑期起止日期格式错误：'+from_to_date_list[blxl]);
                    blfound=true;
                    break;
                }
                from_to_date_list[blxl]=[from_to_date_list[blxl],bldate];
            }
            result_t.push('⚪ 刑期起止日期：'+one_duration);
            if (blfound===false){
                if (from_to_date_list.length!==2){
                    result_t.push('🔴 刑期起止日期不完整');
                }
                else {
                    if (from_to_date_list[1][1]<=from_to_date_list[0][1]){
                        result_t.push('🔴 刑期起始日期小于等于结束日期：'+one_duration);
                    }
                    else {
                        var days=(from_to_date_list[1][1]-from_to_date_list[0][1])/86400000;
                        var next_month=next_month_b(date2str_b('-',from_to_date_list[0][1]).substring(0,7),Math.ceil(days/30));
                        result_t.push('⚪ 刑期('+one_duration+')：'+days+'天≈'+(days/30).toFixed(1)+'月。');
                        result_t.push('⚪ '+from_to_date_list[0][0]+' 加 '+Math.round(days/30)+' 个月 是：'+next_month.replace('-','年')+'月');
                    }
                }
            }
        }
    }
    
    //character double
    var cdouble_list=character_double_b().split('');
    var cdouble_found_list=[];
    for (let item of cdouble_list){
        if (blstr.includes(item)){
            cdouble_found_list.push(item);
        }
    }
    if (cdouble_found_list.length>0){
        result_t.push('❓ 发现全角字符：'+cdouble_found_list.join(' ◽ '));
        high_light_dpr(cdouble_found_list,'background-color:pink;');
    }
    
    //x*
    var asterisk_list=array_unique_b(blstr.match(/[x\*×]{2,}/g) || []); 
    for (let one_asterisk of asterisk_list){
        if (array_unique_b(one_asterisk.split('')).length>1){
            result_t.push('❓ 发现Xx*中至少两个字符同时使用：'+one_asterisk);    
            high_light_dpr(one_asterisk,'background-color:#ff9900;');
        }
    }
    
    //标点符号配对
    var punctuation_quotation_list=['《》','（）','“”','’‘'];
    for (let one_quotation of punctuation_quotation_list){
        var punctuation1_length=(blstr.match(new RegExp(one_quotation.substring(0,1),'g')) || []).length; 
        var punctuation2_length=(blstr.match(new RegExp(one_quotation.substring(1),'g')) || []).length; 
        if (punctuation1_length!==punctuation2_length){
            result_t.push('❓ 标点符号'+one_quotation+'不成对：'+punctuation1_length+'-'+punctuation2_length+'个');
        }    
    }
    
    //被告人加亮
    var defendant_list=blstr.match(/(被告人[^\x00-\xff]{2,4}?)，/g) || []; 
    for (let blxl=0;blxl<defendant_list.length;blxl++){
        if (defendant_list[blxl].slice(-1)=='，'){
            defendant_list[blxl]=defendant_list[blxl].slice(0,-1);
        }
    }
    defendant_list=array_unique_b(defendant_list);
    if (defendant_list.length==0){
        result_t.push('🔴 未发现被告人');    
    }
    else {
        result_t.push('⚪ 被告人：'+array_sort_count_dpr(defendant_list,'str'));
        high_light_dpr(defendant_list,'background-color:#afeeee;');
    }

    //---
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=array_2_li_b(result_t);
    odiv.scrollIntoView();
}
