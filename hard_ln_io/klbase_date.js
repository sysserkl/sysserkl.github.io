//csver:0.0.1-20190125
function day_of_year_b(theday){
    //返回指定日期为当年第几天 - 保留注释
	var csnum=arguments.length;
	if (csnum<1){
        var theday = new Date();
    }
    return Math.ceil((theday - new Date(theday.getFullYear(),0,1)) / 86400000);
}

function days_remained_of_year_b(theday){
    //返回指定日期之后的当年剩余天数 - 保留注释
	var csnum=arguments.length;
	if (csnum<1){
        var theday = new Date();
    }
    return Math.ceil((new Date(theday.getFullYear(),11,31) - theday) / 86400000);
}

function prev_month_b(csstr){
    //csstr: 2018-11
	var csnum=arguments.length;
	if (csnum<1){
        var csstr=date2str_b('-').substring(0,7);
    }
    
    var list_t=csstr.split('-');
    if (list_t.length!==2){
        return '';
    }
    var blyear=parseInt(list_t[0]);
    var blmonth=parseInt(list_t[1]);
    if (blmonth>1){
        return blyear+'-'+('0'+(blmonth-1)).slice(-2);
    }
    else {
        return (blyear-1)+'-12';
    }
}

function next_month_b(csstr,csmonths=1){
    //csstr: 2018-11
	var csnum=arguments.length;
	if (csnum<1){
        var csstr=date2str_b('-').substring(0,7);
    }
    
    var list_t=csstr.split('-');
    if (list_t.length!==2){return '';}
    var blyear=parseInt(list_t[0]);
    if (csmonths>12){
        blyear=blyear+parseInt(csmonths/12);
        csmonths=csmonths-parseInt(csmonths/12)*12;
    }
    var blmonth=parseInt(list_t[1])+csmonths;
    
    if (blmonth>12){
        blyear=blyear+1;
        blmonth=blmonth-12;
    }
    return blyear+'-'+('0'+blmonth).slice(-2);
}

function date2str_b(sep='-',theday=false){
    if (theday===false){
        theday=new Date();
    }
    if (sep.length==3){
        return theday.getFullYear()+sep.substring(0,1)+('0'+(theday.getMonth()+1)).slice(-2)+sep.substring(1,2)+('0'+theday.getDate()).slice(-2)+sep.substring(2,);    
    }
    else {
        return theday.getFullYear()+sep+('0'+(theday.getMonth()+1)).slice(-2)+sep+('0'+theday.getDate()).slice(-2);
    }
}

function now_time_str_b(sep=":",withdate=false,theday=false){
    if (theday===false){
        var theday=new Date();
    }
    var bljg='';
    if (withdate){
        bljg=bljg+date2str_b('-',theday)+' ';
    }
    bljg=bljg+('0'+theday.getHours()).slice(-2)+sep+('0'+theday.getMinutes()).slice(-2)+sep+('0'+theday.getSeconds()).slice(-2);
    return bljg;
}

function day_2_week_b(csstr='',csbrief=false){
    //2018-05-28
    if (csstr==''){
        var theday=new Date();
    }
    else {
        var theday=validdate_b(csstr);
    }
    if (theday==false){return '';}
    if (csbrief){
        var str_t='';
    }
    else {
        str_t='星期';
    }
    return str_t+['日','一','二','三','四','五','六'][theday.getDay()];
}

function days_between_two_days_b(csday_start='',csday_end='',return_days=true){
    if (csday_start==''){
        csday_start=new Date();
    }
    if (csday_end==''){
        csday_end=new Date();
    }
    var day1 = validdate_b(csday_start);
    var day2 = validdate_b(csday_end);

    var blvalue=day2-day1;
    if (return_days){
        return blvalue/(1000*3600*24);
    }
    else {
        return blvalue;
    }
}

function chinese_find_ymd_b(csstr){
    return csstr.match(/[一二三四五六七八九〇○]{1,}(\s+)?年[一二三四五六七八九十〇○]{1,}(\s+)?月[一二三四五六七八九十〇○]{1,}(\s+)?日/g) || [];
}

function chinese_ymd_2_number_b(csstr){
    csstr=csstr.replace(new RegExp(/三十一(\s+)?日/,'g'),'31日');
    csstr=csstr.replace(new RegExp(/三十(\s+)?日/,'g'),'30日');
    csstr=csstr.replace(new RegExp(/二十([一二三四五六七八九])(\s+)?日/,'g'),'2$1日');    //非20 - 保留注释
    csstr=csstr.replace(new RegExp(/二十(\s+)?日/,'g'),'20日');
    csstr=csstr.replace(new RegExp(/十([一二三四五六七八九])(\s+)?日/,'g'),'1$1日');    //非10 - 保留注释
    csstr=csstr.replace(new RegExp(/十(\s+)?日/,'g'),'10日');
    csstr=csstr.replace(new RegExp(/十([一二])(\s+)?月/,'g'),'1$1月');    //非10 - 保留注释
    csstr=csstr.replace(new RegExp(/十(\s+)?月/,'g'),'10月');
    
    var list_t={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'〇':0,'○':0};
    for (let key in list_t){
        csstr=csstr.replace(new RegExp(key,'g'),list_t[key]);
    }
    return csstr;
}

function day_2_week_range_b(csstr,cstype='',returnstr=true){
    //日期返回所在周(周一——周日) - 保留注释
    //cstype pre:上周 next:下周 this:本周
    if (csstr==''){
        var theday=new Date();
    }
    else {
        var theday=validdate_b(csstr);
    }
    var theweek=theday.getDay();
    if (theweek==0){
        theweek=7;
    }
    theday.setTime(theday.getTime()-(theweek-1)*24*60*60*1000);
    if (cstype=='pre'){
        theday.setTime(theday.getTime()-7*24*60*60*1000);
    }
    else if (cstype=='next'){
        theday.setTime(theday.getTime()+7*24*60*60*1000);
    }
    var theday2 = new Date(theday.getTime());
    theday2.setTime(theday.getTime()+6*24*60*60*1000);    
    if (returnstr){
        return [date2str_b('-',theday),date2str_b('-',theday2)];
    }
    else {
        return [theday,theday2];
    }
}

function preweekday_b(csstr='',weekno=0){
    //上一个星期几日期 - 保留注释
    if (csstr==''){
        var theday=new Date();
    }
    else {
        var theday=validdate_b(csstr);
    }
    if (theday==false){return '';}
    if (weekno==0){
        weekno=7;
    }
    weekno=Math.min(7,Math.max(1,weekno));
    now_weekday=theday.getDay();
    now_weekday=now_weekday==0?7:now_weekday;
    if (weekno<now_weekday){
        theday.setTime(theday.getTime()-(now_weekday-weekno)*24*60*60*1000);
    }
    else {
        theday.setTime(theday.getTime()-(now_weekday+7-weekno)*24*60*60*1000);
    }
    return theday;
}

function next_day_b(csstr='',csdays=1){
    //2018-05-28
    if (csstr==''){
        var theday=new Date();
    }
    else {
        var theday=validdate_b(csstr);
    }
    if (theday==false){return '';}
    
    theday.setTime(theday.getTime()+csdays*24*60*60*1000);
    return date2str_b('-',theday);
}

function previous_day_b(csstr='',csdays=1){
    //2018-05-28
    if (csstr==''){
        var theday=new Date();
    }
    else {    
        var theday=validdate_b(csstr);
    }
    if (theday==false){return '';}
    
    theday.setTime(theday.getTime()-csdays*24*60*60*1000);
    return date2str_b('-',theday);
}

function month_day_b(csmonth=0,csyear=0,returnlist=false){
    //返回指定月份天数
	var date1_tmp=new Date();
    if (csmonth<=0){
        csmonth=date1_tmp.getMonth()+1;
    }
    csmonth=Math.min(12,Math.max(csmonth,1));
    if (csyear==0){
	    csyear=date1_tmp.getFullYear();
    }
    var list_t=[31,28,31,30,31,30,31,31,30,31,30,31];
    if (isLeapYear_b(csyear)){
        list_t[1]=29;
    }
    var bljg=list_t[csmonth-1];
    //if (csmonth==2 && isLeapYear_b(csyear)){bljg=bljg+1;}
    if (returnlist){
        return list_t;
    }
    return bljg;
}

function year365_b(csyear=0,returndate=false){
	var date1_tmp=new Date();
    if (csyear==0){
	    csyear=date1_tmp.getFullYear();
    }
    var blresult=[];
    var list_m=month_day_b(csmonth=0,csyear,true);
    for (let blxl=0;blxl<list_m.length;blxl++){
        for (let blday=1;blday<=list_m[blxl];blday++){
            if (returndate){
                blresult.push(new Date(csyear+'-'+(blxl+1)+'-'+blday));
            }
            else {
                blresult.push(csyear+'-'+(blxl+1)+'-'+blday);
            }
        }
    }
    return blresult;
}

function validdate_b(datestr,first_day_of_month=false,ismonth_day=false){
    if (Object.prototype.toString.call(datestr) === "[object Date]" && !isNaN(datestr)){
        var theday2 = new Date(datestr.getTime()); //deepcopy - 保留注释
        return theday2;
    }
    
    if (datestr.length==8 && !datestr.includes('-')){   //年月日 - 保留注释
		datestr=datestr.slice(0,4)+'-'+datestr.slice(4,6)+'-'+datestr.slice(-2,);
	}
    else if (datestr.length==6 && !datestr.includes('-')){  //年月 - 保留注释
        var blyear=datestr.slice(0,4);
        var blmonth=datestr.slice(4,6);
        if (first_day_of_month){
            datestr=blyear+'-'+blmonth+'-01';
        }
        else {
            datestr=blyear+'-'+blmonth+'-'+month_day_b(parseInt(blmonth),parseInt(blyear));
        }
    }
    else if (datestr.length==7){    //年-月 - 保留注释
        var blyear=datestr.slice(0,4);
        var blmonth=datestr.slice(-2,);
        if (first_day_of_month){
            datestr=blyear+'-'+blmonth+'-01';
        }
        else {
            datestr=blyear+'-'+blmonth+'-'+month_day_b(parseInt(blmonth),parseInt(blyear));
        }
    }
    else if (datestr.match(/^\d{4}年\d{1,2}月\d{1,2}日$/)){
        datestr=datestr.replace(new RegExp(/[年月]/,'g'),'-').slice(0,-1);
    }
    else if (ismonth_day){
        var blyear=new Date().getFullYear();
        if (datestr.length==4 || datestr.length==5){    //月日，月-日 - 保留注释
            var blmonth=datestr.slice(0,2);
            var blday=datestr.slice(-2,);
            datestr=blyear+'-'+blmonth+'-'+blday;
        }        
    }

    var bltime=(datestr.includes(':')?'':' 00:00:00');
	var datetmp=new Date(datestr+bltime);
	if ( Object.prototype.toString.call(datetmp) === "[object Date]" ) {
		if ( isNaN( datetmp.getTime() ) ) {
            return false;
        }
		else {
            return datetmp;
        }
	}
	else {
        return false;
    }
}

function months_b(csmonth=0,csyear=0){
    //返回指定年份1月至指定月份的累计天数
    if (csmonth==0){return 0;}
    csmonth=Math.min(12,Math.max(csmonth,1));
	var date1_tmp=new Date();
    if (csmonth<=0){
        csmonth=date1_tmp.getMonth()+1;
    }
    if (csyear==0){
	    csyear=date1_tmp.getFullYear();
    }

	var list_t=[31,28,31,30,31,30,31,31,30,31,30,31];
    var bljg=0;
    for (let blxl=0;blxl<csmonth;blxl++){
        bljg=bljg+list_t[blxl];
    }
    if (csmonth>=2 && isLeapYear_b(csyear)){
        bljg=bljg+1;
    }
    return bljg;
}

function isLeapYear_b(csyear) {
	var csnum=arguments.length;
	if (csnum<1){
        csyear= new Date().getFullYear();
    }
    
    if (csyear % 4==0 && csyear % 100!=0 || csyear % 400==0) {
        return true;
    } 
    return false;
}

function date_2_ymd_b(csdate,cstype){
    if (csdate===false){
        csdate=new Date();
    }
    switch (cstype){
        case 'y':
            return csdate.getFullYear();
            break;
        case 'm':
            return csdate.getMonth()+1;
            break;
        case 'd':
            return csdate.getDate();
            break;
        case 'h':
            return csdate.getHours();
            break;
        case 'M':
            return csdate.getMinutes();
            break;
        case 's':
            return csdate.getSeconds();
            break;        
    }
    return -1;
}

function time_2_emoji_b(cstime=false){
    var blemoji=['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
    if (cstime===false){
        cstime=new Date();
    }
    var blh='';
    if (Object.prototype.toString.call(cstime) === "[object Date]" && !isNaN(cstime)){
        blh=cstime.getHours().toString();
    }
    else {
        //形如 2021-04-28 12:21:19 - 保留注释
        var list_t=cstime.toString().trim().split(' ').slice(-1)[0].split(':');//分割年月日与时间，再提取小时 - 保留注释
        if (list_t.length==0){
            return '';
        }
        blh=list_t[0];
    }
    if (blh==''){return '';}
    blh=parseInt(blh.trim()) % 12;
    return blemoji[blh];
}

function date_list_insert_zero_b(cslist){
    //[
    //[date1,value1],
    //[date2,value2],    
    //];
    cslist.sort(function (a,b){return a[0]>b[0];});
    if (cslist.length<2){
        return cslist;
    }
    var days=new Set();
    for (let item of cslist){
        days.add(date2str_b('-',item[0]));
    }
    var mindate=new Date(cslist[0][0].getTime());
    var maxdate=new Date(cslist[cslist.length-1][0].getTime());
    while (true){
        if (mindate>=maxdate){break;}
        mindate.setTime(mindate.getTime()+24*60*60*1000);
        if (!days.has(date2str_b('-',mindate))){
            cslist.push([new Date(mindate.getTime()),0]);
        }
    }
    cslist.sort(function (a,b){return a[0]>b[0];});
    return cslist;
}
