function init_dpr(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'));
    document.getElementById('span_textarea_buttons').innerHTML=textarea_buttons_b('textarea_document_proofreader','全选,清空,复制');
    menu_dpr();
}

function show_hide_dpr(show_textarea=true){
    var odiv=document.getElementById('div_content_dpr');
    var otextarea=document.getElementById('textarea_document_proofreader');
    var obuttons=document.getElementById('span_textarea_buttons');
    if (show_textarea){
        odiv.style.display='none';
        otextarea.style.display='';
        obuttons.style.display='';
    } else {
        odiv.style.display='';
        otextarea.style.display='none';
        obuttons.style.display='none';
        var list_t=otextarea.value.split('\n');
        odiv.innerHTML='<p>'+list_t.join('</p>\n<p>')+'</p>\n';
    }
}

function array_sort_count_dpr(csarray,sort_type='num'){
    var list_t=array_count_b(csarray,true,true);
    switch (sort_type){
        case 'num':
            list_t.sort(function (a,b){return parseInt(a)>parseInt(b) ? 1 : -1;});
            break;
        case 'str':
            list_t.sort();
        case 'cn':
            list_t.sort(function (a,b){return zh_sort_b(a,b);});
    }
    
    var blstr=list_t.join(' ◽ ');
    blstr=blstr.replace(/(\(.*?\))/g,'<span style="color:grey;"><small>$1</small></span>');
    return blstr;
}

function html_replace_dpr(csarray){
    //csarray [[find_str1,replace_str1], [find_str2,replace_str2]] - 保留注释
    var odiv=document.getElementById('div_content_dpr');
    var oldtxt=odiv.innerText;  //不变 - 保留注释
    var oldhtml=odiv.innerHTML;
    var newhtml=oldhtml;
    
    for (let item of csarray){
        if (!newhtml.includes(item[0])){continue;}
        try {
            newhtml=newhtml.replace(item[0],item[1]);
            odiv.innerHTML=newhtml;
            if (odiv.innerText!==oldtxt){
                odiv.innerHTML=oldhtml;
            }
        } catch (error){
            console.log('html_replace_dpr','error:',item);
        }    
    }
}

function high_light_dpr(csarray,csstyle='',csclass=''){
    if (csstyle=='' && csclass==''){return;}

    var odiv=document.getElementById('div_content_dpr');
    var oldtxt=odiv.innerText;  //不变 - 保留注释
    var oldhtml=odiv.innerHTML;
    var newhtml=oldhtml;
    var span_str='<span';
    if (csstyle!==''){
        span_str=span_str+' style="'+csstyle+'"';
    }    
    if (csclass!==''){
        span_str=span_str+' class="'+csclass+'"';
    }      
    span_str=span_str+'>';

    for (let item of csarray){
        if (!newhtml.includes(item)){continue;}
        try {
            newhtml=newhtml.replace(new RegExp(item,'g'),span_str+item+'</span>');
            odiv.innerHTML=newhtml;
            if (odiv.innerText!==oldtxt){
                odiv.innerHTML=oldhtml;
            }
        } catch (error){
            console.log('high_light_dpr','error:',item);
        }
    }    
}

function proofread_dpr(){
    var otextarea=document.getElementById('textarea_document_proofreader');
    var content_str=otextarea.value;
    if (content_str.trim()==''){return;}
    show_hide_dpr(false);
    
    var result_t=[];
    //中文日期
    var ymd_cn_list=chinese_find_ymd_b(content_str);
    var ymd_cn_varified_list=[];
    for (let item of ymd_cn_list){
        var bldate=validdate_b(chinese_ymd_2_number_b(item));
        if (bldate===false){
            result_t.push('🔴 日期格式错误：'+item);
        } else {
            ymd_cn_varified_list.push([item,date2str_b(bldate)]);
        }
    }
    result_t.push('⚪ 中文日期：'+array_sort_count_dpr(ymd_cn_list,'cn'));
    if (klmenu_check_b('span_highlight_date_dpr',false)){
        high_light_dpr(ymd_cn_list,'border-bottom:0.2rem solid blue;');
    }
    
    //阿拉伯数字日期
    var ymd_num_list=content_str.match(/\d{1,}年\d{1,}月\d{1,}日/g) || [];
    var ymd_num_varified_list=[];
    for (let item of ymd_num_list){
        var bldate=validdate_b(item);
        if (bldate===false){
            result_t.push('🔴 日期格式错误：'+item);
        } else {
            ymd_num_varified_list.push([item,date2str_b(bldate)]);        
        }
    }
    result_t.push('⚪ 数字日期：'+array_sort_count_dpr(ymd_num_list,'str'));
    if (klmenu_check_b('span_highlight_date_dpr',false)){
        high_light_dpr(ymd_num_list,'border-bottom:0.2rem solid green;');
    }

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
    } else {
        result_t.push('⚪ 成对日期：'+Array.from(date_double_equal_set).join(' ◽ '));
    }
    if (klmenu_check_b('span_highlight_date_dpr',false)){
        high_light_dpr(Array.from(date_double_single_set),'background-color:skyblue;');
    }

    //多个小数点
    var points_list=content_str.match(/\d+\.\d+\.|\d+\.{2,}\d+/g) || [];
    for (let item of points_list){
        result_t.push('❓ 多个小数点：'+item);
    }
    high_light_dpr(points_list,'background-color:pink;');

    //0
    var zero_list=content_str.match(/[〇○零]/g) || [];
    zero_list=array_unique_b(zero_list);
    if (zero_list.length>1){
        result_t.push('❓ 几种0写法：'+zero_list.join(' ◽ '));
    }

    //超过4位的连续数字
    var num5_list=content_str.match(/[0-9\-\.]{5,}/g) || [];
    if (num5_list.length>0){
        result_t.push('❓ 超过4位的连续数字：'+array_sort_count_dpr(num5_list));
    }
    
    //小于4位的连续数字
    var num1_3_list=content_str.match(/\b[0-9\-\.]{1,3}\b/g) || [];
    if (num1_3_list.length>0){
        result_t.push('⚪ 小于4位的连续数字：'+array_sort_count_dpr(num1_3_list));
    }
    
    //4位的连续数字
    var num4_list=content_str.match(/\b[0-9\-\.]{4}\b/g) || [];
    if (num4_list.length>0){
        result_t.push('⚪ 4位的连续数字：'+array_sort_count_dpr(num4_list));
    }
    
    //英文标点符号
    var en_punctuation_list=content_str.match(/[^\x00-\xff][\.,\?!"']/g) || [];
    if (en_punctuation_list.length>0){
        result_t.push('❓ 英文标点符号：'+en_punctuation_list.join(' ◽ '));
        high_light_dpr(en_punctuation_list,'background-color:pink;');
    }
    
    //刑期
    var duration_list=content_str.match(/自.*起至.*止/g) || [];
    if (duration_list.length==0){
        result_t.push('❓ 未发现刑期起止日期');
    } else {
        for (let one_duration of duration_list){
            var blfound=false;
            var from_to_date_list=chinese_find_ymd_b(one_duration);
            for (let blxl=0,lent=from_to_date_list.length;blxl<lent;blxl++){
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
                } else {
                    if (from_to_date_list[1][1]<=from_to_date_list[0][1]){
                        result_t.push('🔴 刑期起始日期小于等于结束日期：'+one_duration);
                    } else {
                        var days=(from_to_date_list[1][1]-from_to_date_list[0][1])/86400000;
                        var next_month=next_month_b(date2str_b('-',from_to_date_list[0][1]).substring(0,7),Math.ceil(days/30));
                        result_t.push('⚪ 刑期('+one_duration+')：'+days.toFixed(1)+'天≈'+(days/30).toFixed(1)+'月。');
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
        if (content_str.includes(item)){
            cdouble_found_list.push(item);
        }
    }
    if (cdouble_found_list.length>0){
        result_t.push('❓ 发现全角字符：'+cdouble_found_list.join(' ◽ '));
        high_light_dpr(cdouble_found_list,'background-color:pink;');
    }
    
    //x*
    var asterisk_list=array_unique_b(content_str.match(/[x\*×]{2,}/g) || []); 
    for (let one_asterisk of asterisk_list){
        if (array_unique_b(one_asterisk.split('')).length>1){
            result_t.push('❓ 发现Xx*中至少两个字符同时使用：'+one_asterisk);    
            high_light_dpr(one_asterisk,'background-color:#ff9900;');
        }
    }
    
    //标点符号个数和同行配对
    var punctuation_quotation_list=['《》','（）','“”','’‘'];
    for (let one_quotation of punctuation_quotation_list){
        var punctuation1_length=(content_str.match(new RegExp(one_quotation.substring(0,1),'g')) || []).length; 
        var punctuation2_length=(content_str.match(new RegExp(one_quotation.substring(1),'g')) || []).length; 
        var punctuation3_length=(content_str.match(new RegExp(one_quotation.substring(0,1)+'.*?'+one_quotation.substring(1),'g')) || []).length; 
        
        if (punctuation1_length!==punctuation2_length || punctuation1_length!==punctuation3_length){
            result_t.push('❓ 标点符号'+one_quotation+'个数不一致：'+punctuation1_length+'-'+punctuation2_length+'个');
        }    
    }
    
    //被告人
    var defendant_list=content_str.match(/(被告人[^\x00-\xff]{2,4}?)，/g) || []; 
    for (let blxl=0,lent=defendant_list.length;blxl<lent;blxl++){
        if (defendant_list[blxl].slice(-1)=='，'){
            defendant_list[blxl]=defendant_list[blxl].slice(0,-1);
        }
    }
    defendant_list=array_unique_b(defendant_list);
    if (defendant_list.length==0){
        result_t.push('🔴 未发现被告人');    
    } else {
        result_t.push('⚪ 被告人：'+array_sort_count_dpr(defendant_list,'cn'));
        if (klmenu_check_b('span_highlight_defendant_dpr',false)){
            high_light_dpr(defendant_list,'background-color:#afeeee;');
        }
    }

    //中文金额
    var money_cn_list=content_str.match(/[一二三四五六七八九十百千万亿〇○]{1,}(\s+)?余?元/g) || [];
    result_t.push('⚪ 中文金额：'+array_sort_count_dpr(money_cn_list,'cn'));
    if (klmenu_check_b('span_highlight_money_dpr',false)){
        high_light_dpr(money_cn_list,'background-color:#00cc99;');
    }

    //数字金额
    var money_num_list=content_str.match(/[0-9\.\-\,]{1,}(\s+)?元/g) || [];
    result_t.push('⚪ 数字金额：'+array_sort_count_dpr(money_num_list,'cn'));
    if (klmenu_check_b('span_highlight_money_dpr',false)){
        high_light_dpr(money_num_list,'background-color:#33ccff;');
    }

    //男女
    var male_female_list=content_str.match(/[男女]/g) || []; 
    if (male_female_list.length==0){
        result_t.push('🔴 未发现男女');    
    } else {
        result_t.push('⚪ 男女：'+array_sort_count_dpr(male_female_list,'cn'));
    }
    
    //职位
    var position_list=['人民陪审员','代理书记员','代书记员','书记员','审判员','法官助理','审判长'];
    var position_not_foun_list=[];
    for (let item of position_list){
        var regstr='^(\\s+)?'+item.split('').join('(\\s+)?')+'\\s';
        if (content_str.match(new RegExp(regstr,'m'))){continue;}
        position_not_foun_list.push(item);
    }
    if (position_not_foun_list.length>0){
        result_t.push('❓ 未发现：'+position_not_foun_list.join(' ◽ '));    
    }
    
   //罪名
    var criminal_name_list=content_str.match(/犯([^，]{1,}罪)/g) || []; 
    for (let blxl=0,lent=criminal_name_list.length;blxl<lent;blxl++){
        if (criminal_name_list[blxl].substring(0,1)=='犯'){
            criminal_name_list[blxl]=criminal_name_list[blxl].substring(1,);
        }
    }
    if (criminal_name_list.length==0){
        result_t.push('🔴 未发现罪名');    
    } else {
        result_t.push('⚪ 罪名：'+array_sort_count_dpr(criminal_name_list,'cn'));
        if (klmenu_check_b('span_highlight_criminal_name_dpr',false)){
            high_light_dpr(array_unique_b(criminal_name_list),'background-color:#66aaff;');
        }
    }
    
    //书名号 条款
    if (klmenu_check_b('span_add_book_link_dpr',false)){
        var bookname_list=content_str.match(/(《[^《》]+》[^《》。]*条)/g) || []; 
        for (let blxl=0,lent=bookname_list.length;blxl<lent;blxl++){
            var one_book=bookname_list[blxl];
            var bookname_str=(one_book.match(/《.*?》/) || [''])[0];
            if (bookname_str==''){continue;}
            var paragraph_list=one_book.match(/第[^第]*?条/g) || [];
            
            var new_str=one_book;
            for (let one_num of paragraph_list){
                new_str=new_str.replace(one_num,'<a href="https://www.baidu.com/baidu?wd='+encodeURIComponent(bookname_str+one_num)+'" target=_blank>'+one_num+'</a>');
            }
            bookname_list[blxl]=[one_book,new_str]
        }
        html_replace_dpr(bookname_list);
    }
    
    //出现次数最少的非汉字字符
    var character_en_list=content_str.match(/[\x00-\xff]/g) || [];
    character_en_list=(array_count_b(character_en_list,false,false,true));
    character_en_list.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    var character_en_rare_list=[];
    for (let item of character_en_list){
        if (item[1]<=2){
            character_en_rare_list.push(item[0]);
        } else {break;}
    }
    result_t.push('⚪ 出现次数最少的非汉字字符：'+array_sort_count_dpr(character_en_rare_list,''));
    
    //---
    var odiv=document.getElementById('divhtml');
    odiv.innerHTML=array_2_li_b(result_t);
}

function menu_dpr(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://wenshu.court.gov.cn/" target=_blank>裁判文书网</a>',   
    '<a href="http://www.npc.gov.cn/" target=_blank>中国人大</a>',   
    '<a href="http://www.court.gov.cn/" target=_blank>最高人民法院</a>',   
    '<a href="https://www.spp.gov.cn/" target=_blank>最高人民检察院</a>', 
    '<a href="http://www.cnki.net/" target=_blank>知网</a>',       
    ];

    var klmenu2=[
    '<span id="span_highlight_date_dpr" class="span_menu" onclick="klmenu_check_b(this.id,true);proofread_dpr();">⚪ 高亮日期</span>',        
    '<span id="span_highlight_defendant_dpr" class="span_menu" onclick="klmenu_check_b(this.id,true);proofread_dpr();">⚪ 高亮被告人</span>',        
    '<span id="span_highlight_money_dpr" class="span_menu" onclick="klmenu_check_b(this.id,true);proofread_dpr();">⚪ 高亮金额</span>',        
    '<span id="span_highlight_criminal_name_dpr" class="span_menu" onclick="klmenu_check_b(this.id,true);proofread_dpr();">⚪ 高亮罪名</span>',        
    '<span id="span_add_book_link_dpr" class="span_menu" onclick="klmenu_check_b(this.id,true);proofread_dpr();">⚪ 条款链接</span>',
    '<span class="span_menu" onclick="'+str_t+'pwa_clear_cache_all_b();">更新版本</span>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'✒','10rem','1rem','1rem','60rem')+klmenu_b(klmenu2,'⚙','10rem','1rem','1rem','60rem'),'','0rem')+' ');
    
    klmenu_check_b('span_highlight_date_dpr',true);
    klmenu_check_b('span_highlight_defendant_dpr',true);
    klmenu_check_b('span_highlight_money_dpr',true);
    klmenu_check_b('span_highlight_criminal_name_dpr',true);
    klmenu_check_b('span_add_book_link_dpr',true);
}
