function Lunar_klcalendar(objDate){
    //算出农历, 传入日期控件, 返回农历日期控件
    //该控件属性有 .year .month .day .isLeap
    function sub_Lunar_klcalendar_lYearDays(y){
        //返回农历 y年的总天数
        var sum = 348;
        for (let blxl=0x8000; blxl>0x8; blxl>>=1){
            sum += (lunarInfo_global[y-1900] & blxl)? 1: 0;
        }
        return sum+sub_Lunar_klcalendar_leapDays(y);
    }

    function sub_Lunar_klcalendar_monthDays(y,m){
        //返回农历 y年m月的总天数
        return (lunarInfo_global[y-1900] & (0x10000>>m))? 30: 29;
    }
    
    function sub_Lunar_klcalendar_leapDays(y){
        //返回农历 y年闰月的天数
        if (sub_Lunar_klcalendar_leapMonth(y)){
            return (lunarInfo_global[y-1899]&0xf)==0xf? 30: 29;
        } else {return 0;}
    }
    
    function sub_Lunar_klcalendar_leapMonth(y){
        //返回农历 y年闰哪个月 1-12 , 没闰返回 0
        var lm = lunarInfo_global[y-1900] & 0xf;
        return lm==0xf?0:lm;
    }    
    //-----------------------
    var i, leap=0, temp=0;
    var offset=(Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;

    for (i=1900; i<2100 && offset>0; i++){
        temp=sub_Lunar_klcalendar_lYearDays(i); 
        offset-=temp;
    }

    if (offset<0){
        offset+=temp; 
        i--;
    }

    this.year = i;

    leap = sub_Lunar_klcalendar_leapMonth(i); //闰哪个月
    this.isLeap = false;

    for (i=1; i<13 && offset>0; i++){
        //闰月
        if (leap>0 && i==(leap+1) && this.isLeap==false){
             --i; 
             this.isLeap = true; 
             temp = sub_Lunar_klcalendar_leapDays(this.year); 
        } else {
            temp = sub_Lunar_klcalendar_monthDays(this.year, i);
        }
        //解除闰月
        if (this.isLeap==true && i==(leap+1)){
            this.isLeap = false;
        }
        offset -= temp;
    }

    if (offset==0 && leap>0 && i==leap+1){
        if (this.isLeap){ 
            this.isLeap = false; 
        } else { 
            this.isLeap = true; 
            --i; 
        }
    }

    if (offset<0){
        offset += temp; 
        --i;
    }

    this.month = i;
    this.day = offset + 1;
   
   if (this.isLeap){
        this.days=sub_Lunar_klcalendar_leapDays(this.year);
    } else {
        this.days=sub_Lunar_klcalendar_monthDays(this.year,this.month);    
    }
}

function sTerm_klcalendar(y,n){
    //某年的第n个节气为几日(从0小寒起算)
    var sTermInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
	var offDate = new Date((31556925974.7*(y-1900) + sTermInfo[n]*60000) + Date.UTC(1900,0,6,2,5));
	return offDate.getUTCDate();
}

function oclass_klcalendar(y,m){
    //返回阴历控件 (y年,m+1月)
    function sub_calendar_calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,lmdays){
        //阴历属性
        this.isToday = false;
        //瓣句
        this.sYear = sYear; //公元年4位数字
        this.sMonth = sMonth; //公元月数字
        this.sDay = sDay; //公元日数字
        this.week = week; //星期, 1个中文
        this.odate=new Date(sYear+'-'+sMonth+'-'+sDay);
        //农历
        this.lYear = lYear; //公元年4位数字
        this.lMonth = lMonth; //农历月数字
        this.lDay = lDay; //农历日数字
        this.isLeap = isLeap; //是否为农历闰月?
        this.lmdays= lmdays; //农历月天数
        this.color = '';
        this.solarTerms = ''; //节气
    }
    //-----------------------
    var sDObj, lunar_obj, lY, lM, lD=1, lL, lX=0;
    //var cY, cM, cD; //年柱,月柱,日柱
    var lDPOS = new Array(3);
    var n = 0;
    var firstLM = 0;

    sDObj = new Date(y,m,1,0,0,0,0);    //当月一日日期

    this.length    = month_day_b(m+1,y); //sub_calendar_solarDays(y,m);    //公历当月天数
    this.firstWeek = sDObj.getDay();    //公历当月1日星期几

    var term2=sTerm_klcalendar(y,2); //立春日期

    ////////月柱 1900年1月小寒以前为 丙子月(60进制12)
    var firstNode = sTerm_klcalendar(y,m*2) //返回当月「节」为几日开始

    //当月一日与 1900/1/1 相差天数
    //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
    var dayCyclical = Date.UTC(y,m,1,0,0,0,0)/86400000+25567+10;
    var nStr1 = ['日','一','二','三','四','五','六','七','八','九','十','十一','十二'];
    
    for (let blxl=0,lent=this.length;blxl<lent;blxl++){
        if (lD>lX){
            sDObj = new Date(y,m,blxl+1);    //当月一日日期
            lunar_obj = new Lunar_klcalendar(sDObj);     //农历
            lY    = lunar_obj.year;           //农历年
            lM    = lunar_obj.month;          //农历月
            lD    = lunar_obj.day;            //农历日
            lL    = lunar_obj.isLeap;         //农历是否闰月
            lX    = lunar_obj.days;
            //lunar_obj.isLeap? sub_Lunar_klcalendar_leapDays(lunar_obj.year): sub_Lunar_klcalendar_monthDays(lunar_obj.year,lunar_obj.month); //农历当月最后一天

            if (n==0){
                firstLM = lM;
            }
            lDPOS[n++] = blxl-lD+1;
        }

        this[blxl] = new sub_calendar_calElement(y, m+1, blxl+1, nStr1[(blxl+this.firstWeek)%7], lY, lM, lD++, lL,lX);
    }

    //节气
    var solarTerm = ['小寒','大寒','立春','雨水','惊蛰','春分','清明','谷雨','立夏','小满','芒种','夏至','小暑','大暑','立秋','处暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至'];

    this[sTerm_klcalendar(y,m*2)-1].solarTerms = solarTerm[m*2];
    this[sTerm_klcalendar(y,m*2+1)-1].solarTerms = solarTerm[m*2+1];

    //今日
    var Today = new Date();
    if (y==Today.getFullYear() && m==Today.getMonth()){
        this[Today.getDate()-1].isToday = true;
    }
}

function changeCld_cDay_klcalendar(lunar_day){
    var nStr2 = ['初','十','廿','卅','□'];
    var blstr='';
    switch (lunar_day){
        case 10:
            blstr = '初十'; 
            break;
        case 20:
            blstr = '二十';
            break;
        case 30:
            blstr = '三十'; 
            break;
        default :
            blstr = nStr2[Math.floor(lunar_day/10)];
            var nStr1 = ['日','一','二','三','四','五','六','七','八','九','十','十一','十二'];
            blstr += nStr1[lunar_day%10];
    }
    return blstr;
}

function year_month_get_klcalendar(odom){
    var csyear=parseInt(odom.querySelector('.select_year').value);
    var csmonth=parseInt(odom.querySelector('.select_month').value)-1;
    return [csyear,csmonth];
}

function dict_generate_klcalendar(ymkey,csyear,csmonth){
    if (Object.keys(cld_global).length>50){
        cld_global={};
    }

    if (cld_global[ymkey]==undefined){
        cld_global[ymkey] = new oclass_klcalendar(csyear,csmonth);
    }
    return cld_global[ymkey];
}

function ldate_2_sdate_one_year_klcalendar(lunar_m,lunar_d,csisLeap,csyear){
    var result_t=[];
    for (let one_month=0;one_month<=11;one_month++){
        var odates=new oclass_klcalendar(csyear,one_month);
        for (let one_key in odates){
            if (odates[one_key].isLeap!==csisLeap){continue;}
            if (odates[one_key].lMonth==lunar_m && odates[one_key].lDay==lunar_d){
                result_t.push(odates[one_key]);
            }
        }
    }
    return result_t;
}

function ldate_2_sdate_batch_klcalendar(){
    function sub_ldate_2_sdate_batch_klcalendar_done(){
        var flot_md_list=[];
        var flot_week_list=[];
        var week_cn_no={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'日':7};

        for (let blno=0,lent=result_t.length;blno<lent;blno++){
            var blm=('00'+result_t[blno].sMonth).slice(-2,);
            var bld=('00'+result_t[blno].sDay).slice(-2,);
            var blw=result_t[blno].week;
            
            flot_md_list.push([result_t[blno].sYear,parseInt(blm+bld)]);   //flot_md_list 在 result_t 前，blm + bld 是字符串合并 - 保留注释
            flot_week_list.push([result_t[blno].sYear,week_cn_no[blw]+90]);

            result_t[blno]=result_t[blno].sYear+'-'+blm+'-'+bld+' '+blw;
            
            for (let akey of [blm,blm+bld,blw]){
                if (dict_t[akey]==undefined){
                    dict_t[akey]=0;
                }
                dict_t[akey]=dict_t[akey]+1;
            }
            md_set.add(blm+bld);
            //+' '+result_t[blno].lYear+'-'+(result_t[blno].isLeap?'闰':'')+('00'+result_t[blno].lMonth).slice(-2)+'-'+('00'+result_t[blno].lDay).slice(-2,); //此行保留 - 保留注释
        }
        //result_t 元素为字符串，形如："2015-02-19 四" - 保留注释
        
        dict_t=object2array_b(dict_t,true);
        dict_t.sort(function(a,b){return a[1]>b[1]?-1:1;});
        md_set=Array.from(md_set);
        md_set.sort();
        if (md_set.length>0){
            md_set=[md_set[0]].concat(md_set.slice(-1));
        }
        document.getElementById('div_memo').innerHTML='<div style="column-count:'+(ismobile_b()?3:6)+';"><h2>公历日期</h2>'+array_2_li_b(result_t)+'<h2>统计</h2>'+array_2_li_b(dict_t)+'<h2>日期范围</h2>'+md_set+'</div><div id="div_flot_calendar" style="width:100%; height:800px;"></div>';
        
        flot_md_list=['月日分布#points:true##show:false#'].concat(flot_md_list);
        flot_week_list=['星期分布#points:true##show:false#'].concat(flot_week_list);

        flot_lines_b([flot_md_list,flot_week_list],'div_flot_calendar','nw',false,'','m','',0);
    }
    
    function sub_ldate_2_sdate_batch_klcalendar_one(){
        if (blxl>=bllen){
            sub_ldate_2_sdate_batch_klcalendar_done();
            return;
        }
        
        result_t=result_t.concat(ldate_2_sdate_one_year_klcalendar(lunar_m,lunar_d,csisLeap,year_begin+blxl));
        blxl=blxl+1;
        if (blxl%10==0){
            setTimeout(sub_ldate_2_sdate_batch_klcalendar_one,1);
        } else {
            sub_ldate_2_sdate_batch_klcalendar_one();
        }
    }
    
    var year_range=document.getElementById('input_memo_range_klcalendar').value.trim().split('-');
    if (year_range.length==1){
        year_range.push(year_range[0]);
    }
    
    var year_begin=parseInt(year_range[0].slice(0,4));
    var year_end=parseInt(year_range[1].slice(0,4));

    var cslmd=(prompt('输入农历月日，以英文逗号间隔，闰月在末尾添加1，如 4,18,0 或 9,3,1：') || '').trim().split(',');
    if (cslmd.length<2){
        alert('格式错误');
        return;
    }
    
    if (cslmd.length==2){
        cslmd.push('0');
    }
    
    var lunar_m=parseInt(cslmd[0]);
    var lunar_d=parseInt(cslmd[1]);
    var csisLeap=(parseInt(cslmd[2])==1);
    
    var result_t=[];
    var dict_t={};
    var md_set=new Set();
    var blxl=0;
    var bllen=year_end-year_begin+1;
    sub_ldate_2_sdate_batch_klcalendar_one();
}

function changeCld_klcalendar(odom,hide_empty_row=true,append_mode=false){
    odom=table_find_klcalendar(odom,'select','select.select_year, select.select_month');
    var csyear, csmonth;
    [csyear, csmonth]=year_month_get_klcalendar(odom);
    var ymkey=csyear+'_'+csmonth;

    var yDisplay='';
    if (memo_mg_enabled_klcalendar_global){
        if (csyear<=1874){
            //
        } else if (csyear<=1908){
            yDisplay = '光绪' + (((csyear-1874)==1)?'元':csyear-1874)+'年';
        } else if (csyear<=1911){
            yDisplay = '宣统' + (((csyear-1908)==1)?'元':csyear-1908)+'年';
        } else {
            yDisplay = '民国' + (((csyear-1911)==1)?'元':csyear-1911)+'年';
            if (csyear>2017){
                yDisplay = yDisplay + ' <font color=pink>新冷战' + (((csyear-2017)==1)?'元':csyear-2017)+'年</font>';
            }
        }
    }

    odom.querySelector('.span_year_name').innerHTML = yDisplay +' '; 
    var otoday=odom.querySelector('.todayColor');
    if (otoday){
        otoday.classList.remove('todayColor');
    }

    var ymkey=csyear+'_'+csmonth;
    dict_generate_klcalendar(ymkey,csyear,csmonth);
    
    var theday=new Date(csyear+'-'+(csmonth+1)+'-01');

    if (!append_mode){
        colored_otds_global=[];
    }
    
    for (let blxl=0;blxl<42;blxl++){    //6rows*7cols - 保留注释
        var sObj=odom.querySelector('.span_td_day'+ blxl);
        var lObj=odom.querySelector('.span_td_lunar_day'+ blxl);
        sObj.style.borderBottom='';
        sObj.style.backgroundColor='';
        
        var sD = blxl - cld_global[ymkey].firstWeek;
        if (sD>=0 && sD<cld_global[ymkey].length){ //日期内
            sObj.innerHTML = sD+1;
            
            var check_important=true;
            if (memo_range_klcalendar_global[0]!==false && memo_range_klcalendar_global[1]!==false){
                if (theday<memo_range_klcalendar_global[0] || theday>memo_range_klcalendar_global[1]){
                    check_important=false;
                }
            }
            if (check_important){
                var important_list=memo_theday_klcalendar(theday,true,false);
                if (sObj.innerText.trim()!=='' && important_list.length>0){
                    var legend_key='m_'+important_list[0];
                    if (legend_dict_klcalendar_global[legend_key]==undefined){
                        var bgcolor=bgcolor_klcalendar_global[bgcolor_index_klcalendar_global];
                        bgcolor_index_klcalendar_global=bgcolor_index_klcalendar_global+1;
                        if (bgcolor_index_klcalendar_global>=bgcolor_klcalendar_global.length){
                            bgcolor_index_klcalendar_global=0;
                        }
                        legend_dict_klcalendar_global[legend_key]=[bgcolor,important_list[0],1];
                    } else {
                        var bgcolor=legend_dict_klcalendar_global[legend_key][0];
                        legend_dict_klcalendar_global[legend_key][2]=legend_dict_klcalendar_global[legend_key][2]+1;
                    }
                    if (memo_bg_enabled_klcalendar_global){
                        sObj.style.backgroundColor=bgcolor;
                    } else {
                        sObj.style.borderBottom='0.2rem dotted '+bgcolor;
                    }
                    colored_otds_global.push([sObj,bgcolor]);
                }
            }
            theday.setTime(theday.getTime()+24*60*60*1000);

            var date_obj=dict_generate_klcalendar(ymkey,csyear,csmonth)[sD];

            if (date_obj.isToday){
                sObj.classList.add('todayColor');
            } //今日颜色

            sObj.style.color = date_obj.color; //法定假日颜色

            if (date_obj.lDay==1){
                lObj.innerHTML = '<b>'+(date_obj.isLeap?'闰':'') + date_obj.lMonth + '月<small>' + (date_obj.lmdays==29?'小':'大')+'</small></b>'; //显示农历月
            } else {
                lObj.innerHTML = changeCld_cDay_klcalendar(date_obj.lDay);  //显示农历日
            }

            var blstr='';
            if (date_obj.solarTerms!==''){
                blstr = date_obj.solarTerms.fontcolor('blue');
            }

            if (blstr.length>0){
                lObj.innerHTML = blstr;
            }
        } else { //非日期
            sObj.innerHTML = '&nbsp;';
            lObj.innerHTML = '&nbsp;';   
        }
    }
    
    var otrs=odom.querySelectorAll('tr');
    for (let one_tr of otrs){
        if (hide_empty_row && one_tr.innerText.trim()==''){
            one_tr.style.display='none';
        } else {
            one_tr.style.display='';
        }
    }
    td_onclick_klcalendar(current_td_global);
}

function table_find_klcalendar(odom,cstagname,querystr,table_class='table_one_month'){
    if (odom.tagName.toLowerCase()==cstagname){
        var otables=document.querySelectorAll('table.'+table_class);
        for (let one_table of otables){
            var osubs=one_table.querySelectorAll(querystr);
            var blfound=false;
            for (let one_sub of osubs){
                if (one_sub==odom){
                    blfound=true;
                    odom=one_table;
                    break;
                }
            }
            if (blfound){break;}
        }
    }
    return odom;
}

function display_date_info_klcalendar(odom,csday){
    var ospans=odom.querySelectorAll('span.span_td_day');
    for (let blxl=0,lent=ospans.length;blxl<lent;blxl++){
        if (ospans[blxl].innerText==csday){
            day_info_klcalendar(blxl,odom);
            break;
        }
    }
}
    
function pushBtn_klcalendar(cstype,odom){
    odom=table_find_klcalendar(odom,'span','span.span_calendar_button');
    
    var blyselect=odom.querySelector('.select_year');
    var blmselect=odom.querySelector('.select_month');
    var Today = new Date();
    switch (cstype){
        case 'year-':
            if (blyselect.selectedIndex>0){
                blyselect.selectedIndex--;
            }
            break;
        case 'year+':
            if (blyselect.selectedIndex<blyselect.length-1){
                blyselect.selectedIndex++;
            }
            break;
        case 'month-':
            if (blmselect.selectedIndex>0){
                blmselect.selectedIndex--;
            } else {
                blmselect.selectedIndex=11;
                if (blyselect.selectedIndex>0){
                    blyselect.selectedIndex--;
                }
            }
            break;
        case 'month+':
            if (blmselect.selectedIndex<blmselect.length-1){
                blmselect.selectedIndex++;
            } else {
                blmselect.selectedIndex=0;
                if (blyselect.selectedIndex<blyselect.length-1){
                    blyselect.selectedIndex++;
                }
            }
            break;
        case 'today':
            blyselect.value=Today.getFullYear();
            blmselect.value=('0'+(Today.getMonth()+1)).slice(-2,);
    }
    changeCld_klcalendar(odom);
    if (cstype=='today'){
        display_date_info_klcalendar(odom,Today.getDate().toString());
    } else {
        display_date_info_klcalendar(odom,'1');    
    }
}

function day_info_klcalendar(td_number=false,odom=false){
    //显示详细日期资料        
    if (odom===false){
        if (current_td_global===false){return;}
        odom=current_td_global;
    }
    
    if (odom.tagName.toLowerCase()=='span'){
        var tagname='span';
        var query_str='span.span_td_day';    
    } else {
        var tagname='td';
        var query_str='td.td_one_day';    
    }
    odom=table_find_klcalendar(odom,tagname,query_str);
    var ocontainer=table_find_klcalendar(odom,'table','table','table_container');
    
    var osection=ocontainer.querySelector('.section_history');
    if (!osection){return;}
    
    var csyear, csmonth;
    [csyear, csmonth]=year_month_get_klcalendar(odom);
    var ymkey=csyear+'_'+csmonth;
    
    if (td_number===false){
        if (current_td_global===false){return;}
        var sObj=current_td_global;
    } else {
        var sObj=odom.querySelector('.span_td_day'+ td_number);
    }
    
    var festival='';
    var d=parseInt(sObj.innerHTML)-1;
    
    if (sObj.innerText.trim()==''){return;}
    
    sObj.style.cursor = 'hand';

    var date_obj=dict_generate_klcalendar(ymkey,csyear,csmonth)[d];
    
    if (date_obj.solarTerms !== ''){
        festival='<p><font color=blue>'+date_obj.solarTerms+'</font></p>';
    }
    
    var blstr='<p><span class="span_box" ondblclick="day_info_klcalendar(false);"><b>'+date_obj.sYear+'年'+date_obj.sMonth+'月'+date_obj.sDay+'日</b></span>';
    
    var memo_list=memo_theday_klcalendar(validdate_b(date_obj.sYear+'-'+date_obj.sMonth+'-'+date_obj.sDay));
    
    blstr=blstr+'<small>(第'+day_of_year_b(date_obj.odate)+'天)</small></p>';
    blstr=blstr+'<p><font color=blue>农历'+(date_obj.isLeap?'闰':'')+date_obj.lMonth+'月'+date_obj.lDay+'日</font></p><p>'+festival; 

    var theyear=parseInt(odom.querySelector('.select_year').value);
    var bigday_list=big_day_b(date_obj.odate);
    
    for (let blxl=0,lent=bigday_list.length;blxl<lent;blxl++){
        var item=bigday_list[blxl];
        if (item.match(/^\d{4}年/)==null){continue;}
        bigday_list[blxl]=bigday_list[blxl]+'<small style="color:grey;">('+(theyear-parseInt(item.substring(0,4)))+')</small>';
    }
    
    osection.innerHTML=blstr+array_2_li_b(bigday_list,'p',false)+array_2_li_b(memo_list,'p',false);
}

function td_onclick_klcalendar(otd_clicked){
    function sub_td_onclick_klcalendar_current(){
        var blcolor='';
        for (let one_dom of colored_otds_global){
            if (one_dom[0]==current_td_global){
                blcolor=one_dom[1];
                break;
            }
        }
        return blcolor;    
    }
    //-----------------------
    if (otd_clicked===false){return;}
    if (otd_clicked.innerText.trim()==''){return;}
    
    if (current_td_global){
        var blcolor=sub_td_onclick_klcalendar_current();
        current_td_global.style.backgroundColor=blcolor;
    }
    
    if (current_td_global==otd_clicked){   //取消加亮 - 保留注释
        current_td_global=false;
        return;
    }
    
    current_td_global=otd_clicked;

    var blcolor=sub_td_onclick_klcalendar_current();

    if (current_td_global.style.backgroundColor==blcolor){
        current_td_global.style.backgroundColor=bgcolor_klcalendar_global[0];
    } else {
        current_td_global.style.backgroundColor=blcolor;
    }
}

function tr_days_klcalendar(otable){
    var gNum;
    var bljg='';
    for (let row=0;row<6;row++){
        bljg=bljg+'<tr align=center>';
        for (let col=0;col<7;col++){
            gNum = row*7+col;
            //公历
            bljg=bljg+'<td class="td_one_day" nowrap><span onmouseover="day_info_klcalendar(' + gNum +',this);" onclick="td_onclick_klcalendar(this);" class="span_td_day' + gNum +' span_td_day"';
            if (col==0){
                bljg=bljg+' color=red';
            } else if (col==6){
                bljg=bljg+' color=#00D900';
            }
            //农历
            bljg=bljg+'> </span><br /><span class="span_td_lunar_day' + gNum + ' span_td_lunar_day"> </span></td>';
        }
        bljg=bljg+'</tr>\n';
    }
    otable.querySelector('tr.tr_week_name').insertAdjacentHTML('afterend',bljg);
}

function memo_form_klcalendar(){
    var memo_list=local_storage_get_b('memo_klcalendar',-1,true);

    var left_strings='<p>';
    left_strings=left_strings+'<span class="aclick" style="font-size:1.5rem;" onclick="document.getElementById(\'div_memo\').innerHTML=\'\';">Close</span> ';    
    left_strings=left_strings+'<span class="aclick" style="font-size:1.5rem;" onclick="memo_update_klcalendar();">Update</span> ';    
    var right_strings=' 行数：<span id="span_line_count">'+memo_list.length+'</span>';
    right_strings=right_strings+'</p>';
    
    var blstr=textarea_with_form_generate_b('textarea_memo_klcalendar','height:20rem;font-size:1.1rem;',left_strings,'清空,复制,发送到临时记事本,发送地址',right_strings,'','form_memo_klcalendar',false,memo_list.join('\n'),false,' style="font-size:1.5rem;"');

    var omemo=document.getElementById('div_memo');
    omemo.innerHTML=blstr;
    omemo.scrollIntoView();
}

function memo_update_klcalendar(){
    if (!confirm('是否更新Memo？')){return;}
    var list_t=document.getElementById('textarea_memo_klcalendar').value.trim().split('\n');
    var result_t=[];
    for (let item of list_t){
        if (item.substring(0,1)=='#'){
            result_t.push(item);
            continue;
        }
        
        var raw_str=item;
        try {
            if (item.match(/^\d+,\s*\d+,\s*"/)==null){  //如果数字之后不含英文双引号 - 保留注释
                item=item.replace(/^(\d+,\s*\d+,\s*)(.*)$/g,'$1"$2"');
            }
            item=eval('['+item+']');    
        } catch (err){
            result_t.push('#'+raw_str);
            continue;
        }
        
        if (item.length<3){
            result_t.push('#'+raw_str);
            continue;
        }
        
        if (item.length>=8){
            period='(s,'+item[4]+','+item[5]+'-'+item[6]+'-'+item[7]+')';
        } else {
            period='';
        }
        
        //item[2]=item[2].replace(/\(l\d+\)/g,''); //去掉持续时间 - 保留注释
        if (item[2].substring(0,1)=='*' && item[2].slice(-1)=='*'){
            item[2]=item[2].slice(0,-1);
        }
        result_t.push(item[0]+','+item[1]+','+item[2]+period);                        
    }
    document.getElementById('span_line_count').innerText=result_t.length;
    localStorage.setItem('memo_klcalendar',result_t.join('\n'));
    memo_read_klcalendar();
    memo_form_klcalendar();
}

function memo_help_klcalendar(){
    var odiv=document.getElementById('div_memo');
    var list_t=[
    '8,45,起床',
    '9,15,跑步(d,24,25,26)',
    '10,10,烧饭(m,2,6-7,11)(d,3,29-30)',
    '16,30,维生素(m,1,2,12)',
    '18,20,学习(s,10,2020-10-08)',
    '22,0,关机(w,1,3-5)',
    ];

    var bljg='<p>每一行格式为：小时,分钟,备忘内容(m,xxx)(d,xxx)(w,xxx)</p><p>其中 m d w 分别表示 月 日 星期</p><p>(s,10,2020-10-08) 表示从2020年10月08日起，每10天重复一次</p>'
    bljg=bljg+array_2_li_b(list_t,'li','ol');
    bljg=bljg+'<p><span class="aclick" style="font-size:1.5rem;" onclick="document.getElementById(\'div_memo\').innerHTML=\'\';">关闭</span></p>';    
    odiv.innerHTML=bljg;

}

function menu_klcalendar(otable=false,query_str='td.td_head',cscaption='公元'){
    var str_t=klmenu_hide_b('');
    var parent_str=menu_parent_node_b(str_t);
    
    var klmenu1=[
    '<span id="span_memo_bg_klcalendar" class="span_menu" onclick="'+str_t+'memo_bg_enabled_klcalendar_global=klmenu_check_b(this.id,true);">⚪ Memo标注背景色</span>',
    '<span id="span_memo_mg_klcalendar" class="span_menu" onclick="'+str_t+'memo_mg_enabled_klcalendar_global=klmenu_check_b(this.id,true);">⚪ 显示民国纪年</span>',
    '<span class="span_menu" onclick="'+str_t+'memo_form_klcalendar();">Memo 编辑</span>',    
    '<span class="span_menu" onclick="'+str_t+'memo_help_klcalendar();">Memo Demo</span>',
    '<span class="span_menu" onclick="'+str_t+'year_klcalendar();">年历</span>',
    '<span class="span_menu">背景色系列：<input type="text" id="input_bgcolor_klcalendar" value="'+bgcolor_klcalendar_global.join(',')+'" /> <span class="aclick" onclick="'+parent_str+'bgcolor_set_klcalendar();">设置</span></span>',
    '<span class="span_menu">Memo起止日期：<input type="text" id="input_memo_range_klcalendar" value="'+date2str_b('',memo_range_klcalendar_global[0])+'-'+date2str_b('',memo_range_klcalendar_global[1])+'" /> <span class="aclick" onclick="'+parent_str+'memo_range_set_klcalendar();">设置</span></span>',    
    '<span class="span_menu" onclick="'+str_t+'ldate_2_sdate_batch_klcalendar();">批量计算指定农历的对应公历日期</span>',
    
    ];
    
    var group_list=[
    ['Bing','window.open(\'https://cn.bing.com/search?q=%E6%97%A5%E5%8E%86\');',true],
    ['百度','window.open(\'https://www.baidu.com/s?cl=3&wd=%C8%D5%C0%FA\');',true],   //网址不能使用双引号 - 保留注释
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));    
    
    var bljg=klmenu_b(klmenu1,cscaption,'18rem')+' ';
    if (otable){
        otable.querySelector(query_str).insertAdjacentHTML('afterbegin',bljg);
    } else {
        document.querySelector(query_str).insertAdjacentHTML('afterbegin',bljg);    
    }
    
    if (memo_bg_enabled_klcalendar_global){
        klmenu_check_b('span_memo_bg_klcalendar',true);
    }
    
    if (memo_mg_enabled_klcalendar_global){
        klmenu_check_b('span_memo_mg_klcalendar',true);    
    }
}

function bgcolor_set_klcalendar(){
    var oinput=document.getElementById('input_bgcolor_klcalendar');
    if (!oinput){return;}
    var blstr=oinput.value.trim();
    if (blstr==''){return;}
    bgcolor_klcalendar_global=blstr.split(',');
}

function memo_range_set_klcalendar(is_init=false){
    if (is_init){
        var list_t=memo_range_klcalendar_global;
    } else {
        var oinput=document.getElementById('input_memo_range_klcalendar');
        if (!oinput){return;}
        var blstr=oinput.value.trim();
        if (blstr==''){return;}
        var list_t=blstr.split('-');
    }
    
    list_t[0]=validdate_b(list_t[0]);

    if (list_t.length==1){
        list_t.push(next_day_b(list_t[0],365,false));
    }
        
    list_t[1]=validdate_b(list_t[1]);
    memo_range_klcalendar_global=list_t;
}

function memo_read_klcalendar(){
    var memo_list=local_storage_get_b('memo_klcalendar',-1,true);
    memo_list_global=[];
    memo_list_important_global=[];
    for (let item of memo_list){
        item=item.trim();
        if (item=='' || item.substring(0,1)=='#'){continue;}
        var list_t=item.split(',');
        if (list_t.length<3){continue;}
        
        list_t[0]=parseInt(list_t[0].trim());
        list_t[1]=parseInt(list_t[1].trim());
        if (isNaN(list_t[0]) || isNaN(list_t[1])){continue;}
        
        blstr=list_t.slice(2,).join(',');   //避免 (w,5-7) 之类被分割 - 保留注释
        memo_list_global.push([list_t[0],list_t[1],blstr]);
        if (list_t[2].substring(0,1)=='*'){
            memo_list_important_global.push([list_t[0],list_t[1],blstr]);   
        }
    }
}

function memo_theday_klcalendar(csdate=false,is_important=false,with_hm=true){
    if (csdate===false){
        csdate=new Date();
    }
    var blpd;
    var result_t=[];
    if (is_important){
        var list_t=memo_list_important_global;
    } else {
        var list_t=memo_list_global;
    }
    
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        var item=list_t[blxl];
        blstr=item[2];
        while (true){
            [blstr,blpd]=memo_mdw_str_klcalendar(blstr,csdate);
            if (blpd===false){break;}
            
            if (blpd===null){
                if (blstr.substring(0,1)=='*'){
                    blstr='<b>'+blstr.substring(1,)+'</b>';
                }
                if (with_hm){
                    blstr=('00'+item[0]).slice(-2,)+':'+('00'+item[1]).slice(-2,)+' '+blstr;
                }
                result_t.push(blstr);
                break;
            }
        }
    }
    return result_t;
    //以下几行保留 - 保留注释
    //if (result_t.length>0){
        //console.log(date2str_b('-',csdate),result_t.length);
        //for (let item of result_t){
            //console.log(item.join(' '));
        //}
    //}
    //csdate.setTime(csdate.getTime()+24*60*60*1000);   
}

function memo_mdw_str_klcalendar(csstr,csdate=false){
    //AAA(l33)(m,10-12,1-3)(w,1-3,5) - 保留注释
    //XXXXXX(d,24,25,26) - 保留注释
    function sub_memo_mdw_str_klcalendar_min_max(date_list,date_value){
        var blmin, blmax;
        for (let one_element of date_list){
            if (!one_element.includes('-')){continue;}
            [blmin,blmax]=one_element.split('-').slice(0,2);
            if (isNaN(blmin) || isNaN(blmax)){continue;}
            if (date_value>=parseInt(blmin) && date_value<=parseInt(blmax)){
                return true;
            }
        }
        return false;
    }
    //-----------------------
    var s_list=csstr.match(/,s,(\-?\d+),(\d+)[,\-]\s*(\d+)[,\-]\s*(\d+)$/) || [];  //,s,21,2023,1,5 或 ,s,21,2023-1-5 - 保留注释
    if (s_list.length==5){
        csstr=csstr.replace(/,s,(\-?\d+),(\d+)[,\-]\s*(\d+)[,\-]\s*(\d+)$/,'(s,$1,$2-$3-$4)');
    }
    var list_t=csstr.match(/\([ywdms],\-?\d+.*?\)/g);
    //list_t 形如 [ "(m,2)", "(d,5-10)" ] 或 [ "(s,28,2024-01-01)" ] - 保留注释
    if (list_t==null){
        return [csstr,null];
    }
    if (csdate===false){
        csdate=new Date();
    }
    var date_str=date2str_b('-',csdate);
    
    var blpd={'y':null,'d':null,'m':null,'w':null,'s':null};
    for (let item of list_t){
        csstr=csstr.replace(item,'');
        date_list=item.slice(1,-1).split(',');
        //date_list 形如：[ "d", "5-10" ] 或 [ "s", "28", "2023-12-31" ] - 保留注释
        switch (date_list[0]){
            case 'y':
                var theyear=csdate.getFullYear();
                blpd['y']=date_list.includes(theyear.toString()) || sub_memo_mdw_str_klcalendar_min_max(date_list,theyear);
                break;
            case 'd':
                var theday=csdate.getDate();
                blpd['d']=date_list.includes(theday.toString()) || sub_memo_mdw_str_klcalendar_min_max(date_list,theday);
                break;
            case 'm':
                var themonth=(csdate.getMonth()+1);
                blpd['m']=date_list.includes(themonth.toString()) || sub_memo_mdw_str_klcalendar_min_max(date_list,themonth);
                break;
            case 'w':
                var theweek=csdate.getDay();
                if (theweek==0){
                    theweek=7;
                }
                blpd['w']=date_list.includes(theweek.toString()) || sub_memo_mdw_str_klcalendar_min_max(date_list,theweek);
                break;
            case 's':
                blpd['s']=false;
                if (date_list.length==3){
                    var interval_days=date_list[1];
                    if (!isNaN(interval_days)){
                        interval_days=parseInt(interval_days);
                        var startday=validdate_b(date_list[2]);
                        if (startday!==false){
                            if (interval_days>=1){
                                blpd['s']=(0==Math.floor((csdate-startday)/86400000) % interval_days);
                            } else {
                                blpd['s']=(date_str==date_list[2]); //<1时相当于指定年月日，只出现一次，不循环 - 保留注释
                            }
                        }
                    }
                }
                break;
        }
    }
    
    var is_all_null=false;
    var blfound_false=false;
    for (let key in blpd){
        if (blpd[key]!==null){
            is_all_null=false;
        }
        
        if (blpd[key]===false){
            blfound_false=true;
            break;
        }
    }
    return [csstr,(!blfound_false && !is_all_null)];
}

function init_klcalendar(){
    //全局变量 - 保留注释
    lunarInfo_global=[
    0x4bd8,0x4ae0,0xa570,0x54d5,0xd260,0xd950,0x5554,0x56af,0x9ad0,0x55d2,
    0x4ae0,0xa5b6,0xa4d0,0xd250,0xd255,0xb54f,0xd6a0,0xada2,0x95b0,0x4977,
    0x497f,0xa4b0,0xb4b5,0x6a50,0x6d40,0xab54,0x2b6f,0x9570,0x52f2,0x4970,
    0x6566,0xd4a0,0xea50,0x6a95,0x5adf,0x2b60,0x86e3,0x92ef,0xc8d7,0xc95f,
    0xd4a0,0xd8a6,0xb55f,0x56a0,0xa5b4,0x25df,0x92d0,0xd2b2,0xa950,0xb557,
    0x6ca0,0xb550,0x5355,0x4daf,0xa5b0,0x4573,0x52bf,0xa9a8,0xe950,0x6aa0,
    0xaea6,0xab50,0x4b60,0xaae4,0xa570,0x5260,0xf263,0xd950,0x5b57,0x56a0,
    0x96d0,0x4dd5,0x4ad0,0xa4d0,0xd4d4,0xd250,0xd558,0xb540,0xb6a0,0x95a6,
    0x95bf,0x49b0,0xa974,0xa4b0,0xb27a,0x6a50,0x6d40,0xaf46,0xab60,0x9570,
    0x4af5,0x4970,0x64b0,0x74a3,0xea50,0x6b58,0x5ac0,0xab60,0x96d5,0x92e0,
    0xc960,0xd954,0xd4a0,0xda50,0x7552,0x56a0,0xabb7,0x25d0,0x92d0,0xcab5,
    0xa950,0xb4a0,0xbaa4,0xad50,0x55d9,0x4ba0,0xa5b0,0x5176,0x52bf,0xa930,
    0x7954,0x6aa0,0xad50,0x5b52,0x4b60,0xa6e6,0xa4e0,0xd260,0xea65,0xd530,
    0x5aa0,0x76a3,0x96d0,0x4afb,0x4ad0,0xa4d0,0xd0b6,0xd25f,0xd520,0xdd45,
    0xb5a0,0x56d0,0x55b2,0x49b0,0xa577,0xa4b0,0xaa50,0xb255,0x6d2f,0xada0,
    0x4b63,0x937f,0x49f8,0x4970,0x64b0,0x68a6,0xea5f,0x6b20,0xa6c4,0xaaef,
    0x92e0,0xd2e3,0xc960,0xd557,0xd4a0,0xda50,0x5d55,0x56a0,0xa6d0,0x55d4,
    0x52d0,0xa9b8,0xa950,0xb4a0,0xb6a6,0xad50,0x55a0,0xaba4,0xa5b0,0x52b0,
    0xb273,0x6930,0x7337,0x6aa0,0xad50,0x4b55,0x4b6f,0xa570,0x54e4,0xd260,
    0xe968,0xd520,0xdaa0,0x6aa6,0x56df,0x4ae0,0xa9d4,0xa4d0,0xd150,0xf252,
    0xd520];
    cld_global={};
    current_td_global=false;
    memo_list_global=[];
    memo_list_important_global=[];
    memo_bg_enabled_klcalendar_global=true;
    memo_mg_enabled_klcalendar_global=true;
    bgcolor_klcalendar_global=['skyblue','tomato','cadetblue','pink','olivedrab'];
    bgcolor_index_klcalendar_global=1;  //0留给选中时的颜色 - 保留注释
    legend_dict_klcalendar_global={};
    memo_range_klcalendar_global=[''];
    ym_range_klcalendar_global='';
    bigday_img_global=[];   //在 klbase_history.js 中使用 - 保留注释
    colored_otds_global=[];    
    //-----------------------
    var style_list=[
    '.todayColor{background-color:#FFFFAC;padding:0rem 0.1rem 0rrem 0.1rem;}',
    '.section_history{overflow:auto;padding:0.3rem;}',
    '.section_history p{font-size:1.35rem;line-height:150%;}',
    'p{font-size:1.5rem;line-height:150%;}',
    '.tdweek{font-size:2.5rem;min-width:3.5rem;height:2rem;}',
    '.span_calendar_button{margin-left:0.25rem;padding-left:1rem;padding-right:1rem;}',
    'td.td_one_day{font-size:2.5rem;min-width:4rem;}',
    'td.td_xx p{font-size:1.2rem;}',
    '.span_td_day{cursor:pointer;}',
    '.span_td_lunar_day{font-size:1.5rem;}',
    'select{font-size:1.5rem;}',
    'li{font-size:1.5rem;}',
    ];
    style_generate_b(style_list,true);
    
    memo_read_klcalendar();
    memo_range_set_klcalendar(true);
    
    var odiv=document.getElementById('divhtml');
    var ocontainer,otable;
    [ocontainer,otable]=month_generate_klcalendar(odiv);
    
    pushBtn_klcalendar('today',otable);
    menu_klcalendar(otable);
}

function year_klcalendar(){
    if (ym_range_klcalendar_global==''){
        var ym_start=date2str_b('-').substring(0,4)+'-01';
        var ym_end=next_month_b(ym_start,11);
        ym_range_klcalendar_global=ym_start+' '+ym_end;
    }
    var blrange=(prompt('输入起止年月',ym_range_klcalendar_global) || '').trim();
    if (blrange==''){return;}
    ym_range_klcalendar_global=blrange;
    
    var list_t=blrange.split(' ');
    if (list_t.length==1){
        list_t.push(list_t[0]);
    }
    
    var section_info=confirm('是否显示信息栏？');
    document.getElementById('divhtml').innerHTML='';
    var ohead=document.getElementById('div_head');
    ohead.innerHTML='';
    menu_klcalendar(false,'#div_head','Legends');
    
    var legend_set=new Set();
    legend_dict_klcalendar_global={};
    months_klcalendar(list_t[0],list_t[1],section_info);    
    for (let key in legend_dict_klcalendar_global){
        legend_set.add('<span style="border: 0.5rem solid '+legend_dict_klcalendar_global[key][0]+'">'+legend_dict_klcalendar_global[key][1]+'('+legend_dict_klcalendar_global[key][2]+')</span>');
    }
    
    ohead.insertAdjacentHTML('beforeend','<span style="font-size:1.35rem;">'+Array.from(legend_set).join(' ')+'</span>');
}

function months_klcalendar(start_ym,end_ym,section_info=true){
    //start_ym, end_ym: 2018-11 - 保留注释
    bgcolor_index_klcalendar_global=0;  //初始化背景色序号 - 保留注释
    var current_ym=start_ym;
    var blxl=0;
    var odiv=document.getElementById('divhtml');
    var ocontainer,otable;
    var ocontainer_list=[];
    colored_otds_global=[];
    while (true){
        if (current_ym>end_ym || blxl>2400){break;}
        var list_t=current_ym.split('-');
        if (list_t.length!==2){break;}
        
        var blyear=parseInt(list_t[0]);
        var blmonth=parseInt(list_t[1]);
        if (isNaN(blyear) || isNaN(blmonth)){break;}
        
        [ocontainer,otable]=month_generate_klcalendar(odiv,blyear,blyear,blmonth,blmonth,false,false,section_info);
        ocontainer_list.push(ocontainer);
        changeCld_klcalendar(otable,false,true);
        
        display_date_info_klcalendar(otable,'1');    
        
        current_ym=next_month_b(current_ym);
        blxl=blxl+1;
    }
    
    for (let one_container of ocontainer_list){
        one_container.style.position='relative';
        one_container.style.float='left';
        one_container.minWidth='';
    }
    
    //---
    var otds=document.querySelectorAll('td.td_head');
    var width_set=new Set();
    for (let one_td of otds){
        width_set.add(one_td.getBoundingClientRect().width);
    }
    var blmax=Math.max(...width_set);
    for (let one_td of otds){
        one_td.style.minWidth=blmax+'px';   //统一宽度 - 保留注释
    }
}

function month_generate_klcalendar(odiv,year_min=1900,year_max=2100,month_min=1,month_max=12,ym_buttons=true,td_xx=true,section_info=true){
    var ocontainer=table_container_generate_klcalendar(odiv);
    var otable=table_one_month_klcalendar(ocontainer);

    week_head_klcalendar(otable);
    tr_days_klcalendar(otable);

    table_head_klcalendar(otable,year_min,year_max,month_min,month_max);
    
    if (ym_buttons){
        ym_buttons_klcalendar(otable);
    }
    if (td_xx){
        td_xx_klcalendar(ocontainer);
    }
    if (section_info){
        section_klcalendar(ocontainer);
    }
    
    mouseover_mouseout_oblong_span_b(otable.querySelectorAll('span.oblong_box'));
    return [ocontainer,otable];
}

function ym_buttons_klcalendar(otable){
    var blstr=`<tr>
<td colspan=7 nowrap align=right style="background-color:#e0e0e0;font-size:2rem;padding:0.5rem;">
年<span class="oblong_box span_calendar_button" onclick="pushBtn_klcalendar('year+',this);">+</span>
<span class="oblong_box span_calendar_button" onclick="pushBtn_klcalendar('year-',this);">-</span>
月<span class="oblong_box span_calendar_button" onclick="pushBtn_klcalendar('month+',this);">+</span>
<span class="oblong_box span_calendar_button" onclick="pushBtn_klcalendar('month-',this);">-</span>
<span class="oblong_box span_calendar_button" onclick="pushBtn_klcalendar('today',this);">本月</span>
</td>
</tr>`;
    otable.insertAdjacentHTML('beforeend',blstr);
}

function table_head_klcalendar(otable,year_min=1900,year_max=2100,month_min=1,month_max=12){
    var blstr='<tr>';
    blstr=blstr+'<td class="td_head" colspan=7 align=left nowrap style="font-size:2rem;color:#ffffff;background-color:#4e81bb;padding:0 0.5rem 0.5rem 0.5rem;'+(ismobile_b()?'':'min-width: 460px;')+'">';
    blstr=blstr+'<select class="select_year" onchange="changeCld_klcalendar(this);" style="max-width:6.5rem;">';
    var year_list=[];
    for (let blyear=year_min; blyear<=year_max; blyear++){
        year_list.push('<option>'+blyear+'</option>');
    }
    blstr=blstr+year_list.join('\n');
    blstr=blstr+'</select> 年 ';
    
    blstr=blstr+'<select class="select_month" onchange="changeCld_klcalendar(this);" style="max-width:5rem;">';
    var month_list=[];
    for (let blmonth=month_min; blmonth<=month_max; blmonth++){
        month_list.push('<option>'+('0'+blmonth).slice(-2,)+'</option>');
    }
    blstr=blstr+month_list.join('\n');
    blstr=blstr+'</select> 月 <span class="span_year_name"></span>';
    blstr=blstr+'</td>';
    blstr=blstr+'</tr>';
    otable.insertAdjacentHTML('afterbegin',blstr);    
}

function week_head_klcalendar(otable){
    var blstr=`<tr class="tr_week_name" align=center bgcolor=#e0e0e0>
<td class="tdweek" nowrap><font color=red><b>日</b></font></td>
<td class="tdweek" nowrap><b>一</b></td>
<td class="tdweek" nowrap><b>二</b></td>
<td class="tdweek" nowrap><b>三</b></td>
<td class="tdweek" nowrap><b>四</b></td>
<td class="tdweek" nowrap><b>五</b></td>
<td class="tdweek" nowrap><font color=#00d900><b>六</b></font></td>
</tr>`;
    otable.insertAdjacentHTML('afterbegin',blstr);    
}

function td_xx_klcalendar(ocontainer){
    var blstr='<tr>';
    if (ismobile_b()){
        blstr=blstr+'<td class="td_xx">';
    } else {
        blstr=blstr+'<td colspan=2 class="td_xx">';
    }
    blstr=blstr+'</td>';
    blstr=blstr+'</tr>';
    ocontainer.insertAdjacentHTML('beforeend',blstr);    
}

function section_klcalendar(ocontainer){
    var blstr=`<td class="td_section" valign=top style="background-color:#CFFDCF;border:0.05rem dashed #4E81BB;">
<section class="section_history"></section>
</td>`;

    var is_mobile=ismobile_b();
    if (is_mobile){
        ocontainer.style.width='100%';
        var bltype='afterend';
        blstr='<tr>'+blstr+'</tr>';
    } else {
        var bltype='beforeend';
    }
    ocontainer.querySelector('tr').insertAdjacentHTML(bltype,blstr);

    if (!is_mobile){
        var section_height=ocontainer.querySelector('.td_section').getBoundingClientRect().height;
        var ohistory=ocontainer.querySelector('.section_history');
        ohistory.style.maxHeight=section_height+'px';
        ohistory.style.width='45rem';
    }    
}

function table_one_month_klcalendar(ocontainer){
    var otable = document.createElement('table');
    otable.setAttribute('class','table_one_month');
    otable.border = 0;
    otable.width='100%';
    otable.height='100%';
    otable.cellpadding=0;
    otable.cellspacing=0;
    otable.style.cssText='margin:0';
    
    var otr=document.createElement('tr');
    ocontainer.appendChild(otr);
    
    var otd=document.createElement('td');
    otd.valign='top';
    otr.appendChild(otd);
    
    otd.appendChild(otable);
    return otable;
}

function table_container_generate_klcalendar(odiv){
    var ocontainer = document.createElement('table');
    ocontainer.setAttribute('class','table_container');
    ocontainer.border = 0;
    ocontainer.width=1;
    ocontainer.height=1;
    ocontainer.cellpadding=0;
    ocontainer.cellspacing=0;
    ocontainer.style.cssText='min-width:10rem;background-color:#EBEBEB;margin:0';
    
    odiv.appendChild(ocontainer);    
    return ocontainer;
}
