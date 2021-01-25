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

function next_month_b(csstr){
    //2018-11
    var list_t=csstr.split('-');
    if (list_t.length!==2){return '';}
    var blyear=parseInt(list_t[0]);
    var blmonth=parseInt(list_t[1]);
    if (blmonth<12){
        return blyear+'-'+('0'+(blmonth+1)).slice(-2);
    }
    else {
        return (blyear+1)+'-01';
    }
}

function date2str_b(sep='-',theday=false){
    if (theday===false){
        theday=new Date();
    }
    return theday.getFullYear()+sep+('0'+(theday.getMonth()+1)).slice(-2)+sep+('0'+theday.getDate()).slice(-2);
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
    if (theweek==0){theweek=7;}
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
    else if (ismonth_day){
        var blyear=new Date().getFullYear();
        if (datestr.length==4 || datestr.length==5){    //月日，月-日 - 保留注释
            var blmonth=datestr.slice(0,2);
            var blday=datestr.slice(-2,);
            datestr=blyear+'-'+blmonth+'-'+blday;
        }        
    }
    
	var datetmp=new Date(datestr);
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
    if (cstype=='y'){
        return csdate.getFullYear();
    }
    else if (cstype=='m'){
        return csdate.getMonth()+1;
    }
    else if (cstype=='d'){
        return csdate.getDate();
    }
    return -1;
}

function time_2_emoji_b(cstime=false){
    var blemoji=['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
    if (cstime===false){
        var cstime=new Date();
    }
    var blh='';
    if (Object.prototype.toString.call(cstime) === "[object Date]" && !isNaN(cstime)){
        blh=cstime.getHours().toString();
    }
    else {
        var list_t=cstime.toString().trim().split(' ').slice(-1)[0].split(':');
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
