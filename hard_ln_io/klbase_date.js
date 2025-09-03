//-----------------------
//history
//0.0.1-20190125
//-----------------------
function day_of_year_b(theday=false){
    //返回指定日期为当年第几天 - 保留注释
	if (theday===false){
        theday = '';
    }
    theday=default_date_b(theday,true);
    
    var pre_year_last_date=new Date(theday.getFullYear()-1,11,31);   
    return (theday - pre_year_last_date) / 86400000;    //肯定是整数 - 保留注释
}

function number2datetime_b(cslist,include_old_item=false,time_sep=':',date_sep='-',join_str=' '){
    var result_t=[];
    for (let arow of cslist){
        var old_item=arow;
        blnums=arow.match(/\d{12,}/g) || [];    //至少12位数字 - 保留注释
        for (let blstr of blnums){
            try {
                let bldate=new Date(parseInt(blstr));
                if (bldate.toString()!=='Invalid Date'){
                    let date_str=now_time_str_b(time_sep,true,bldate,date_sep,join_str);
                    arow=arow.replace(blstr,date_str);
                }
            } catch (e){
                console.log(e);
            }
        }
        if (include_old_item){
            result_t.push([old_item,arow]);
        } else {
            result_t.push(arow);        
        }
    }
    return result_t;
}

function days_remained_of_year_b(theday=false){
    //返回指定日期之后的当年剩余天数 - 保留注释
	if (theday===false){
        var theday = new Date();
    }
    return Math.ceil((new Date(theday.getFullYear(),11,31) - theday) / 86400000);
}

function days_remained_of_month_b(theday=false){
    //返回指定日期之后的当月剩余天数 - 保留注释
	if (theday===false){
        var theday = new Date();
    }    
    return month_day_b(theday.getMonth()+1,theday.getFullYear(),false)-theday.getDate();
}

function prev_month_b(csstr='',csmonths=1){
    //csstr: 2018-11
	if (csstr==''){
        csstr=date2str_b('-').substring(0,7);
    }
    
    var list_t=csstr.split('-');
    if (list_t.length!==2){return '';}
    var blyear=parseInt(list_t[0]);
    
    if (csmonths>12){
        blyear=blyear-parseInt(csmonths/12);
        csmonths=csmonths-parseInt(csmonths/12)*12;
    }
    var blmonth=parseInt(list_t[1])-csmonths;
    
    if (blmonth<=0){
        blyear=blyear-1;
        blmonth=blmonth+12;
    }
    
    return blyear+'-'+('0'+blmonth).slice(-2);
}

function next_month_b(csstr='',csmonths=1){
    //csstr: 2018-11
	if (csstr==''){
        csstr=date2str_b('-').substring(0,7);
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
    } else {
        return theday.getFullYear()+sep+('0'+(theday.getMonth()+1)).slice(-2)+sep+('0'+theday.getDate()).slice(-2);
    }
}

function now_time_str_b(sep=':',withdate=false,theday=false,date_sep='-',join_str=' '){
    if (theday===false){
        var theday=new Date();
    }
    var bljg='';
    if (withdate){
        bljg=bljg+date2str_b(date_sep,theday)+join_str;
    }
    bljg=bljg+('0'+theday.getHours()).slice(-2)+sep+('0'+theday.getMinutes()).slice(-2)+sep+('0'+theday.getSeconds()).slice(-2);
    return bljg;
}

function day_2_week_b(csstr='',cstype=''){
    //2018-05-28
    if (typeof csstr == 'number'){
        var blweek=parseInt(csstr);
        if (blweek<0 || blweek>6){return '';}
    } else {
        var theday=default_date_b(csstr);
        if (theday==false){return '';}
        var blweek=theday.getDay();
    }
    
    switch (cstype){
        case '':
        case 'cn':
            return '星期'+['日','一','二','三','四','五','六'][blweek];
            break;
        case 'cnbrief':
            return ['日','一','二','三','四','五','六'][blweek];
            break;
        case 'en3':
            return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][blweek];
            break;
    }
}

function days_between_two_dates_b(csday_start='',csday_end='',return_type='d'){
    if (csday_start==''){
        csday_start=new Date();
    }
    if (csday_end==''){
        csday_end=new Date();
    }
    var day1 = validdate_b(csday_start);
    var day2 = validdate_b(csday_end);

    var blvalue=day2-day1;
    switch (return_type){
        case 's':
            return blvalue/1000;
            break;
        case 'm':
            return blvalue/(1000*60);
            break;
        case 'h':
            return blvalue/(1000*60*60);
            break;
        case 'd':
            return blvalue/(1000*60*60*24);
            break;
        case 'hms':
            return milliseconds2hms_b(blvalue);
            break;
        default:
            return blvalue;
            break;
    }
}

function milliseconds2hms_b(duration){
    var hours = Math.floor(duration / (1000 * 60 * 60));
    var minutes = Math.floor((duration-hours*60*60*1000)/(1000*60));
    var seconds = Math.floor((duration-hours*60*60*1000-minutes*60*1000)/1000);
    var milliseconds = duration-1000*(hours*60*60+minutes*60+seconds);

    hours = (hours < 10) ? '0' + hours : hours; //可能超过2位数，不能使用 ('00'+hours).slice(-2,) - 保留注释
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds + (milliseconds>0?('.' + ('000'+milliseconds).slice(-3,)):'');
}

function chinese_find_ymd_b(csstr){
    return csstr.match(/[一二三四五六七八九〇○]{1,}(\s+)?年[一二三四五六七八九十〇○]{1,}(\s+)?月[一二三四五六七八九十〇○]{1,}(\s+)?日/g) || [];
}

function chinese_ymd_2_number_b(csstr){
    csstr=csstr.replace(/三十一(\s+)?日/g,'31日');
    csstr=csstr.replace(/三十(\s+)?日/g,'30日');
    csstr=csstr.replace(/二十([一二三四五六七八九])(\s+)?日/g,'2$1日');    //非20 - 保留注释
    csstr=csstr.replace(/二十(\s+)?日/g,'20日');
    csstr=csstr.replace(/十([一二三四五六七八九])(\s+)?日/g,'1$1日');    //非10 - 保留注释
    csstr=csstr.replace(/十(\s+)?日/g,'10日');
    csstr=csstr.replace(/十([一二])(\s+)?月/g,'1$1月');    //非10 - 保留注释
    csstr=csstr.replace(/十(\s+)?月/g,'10月');
    
    var list_t={'一':1,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'〇':0,'○':0};
    for (let key in list_t){
        csstr=csstr.replace(new RegExp(key,'g'),list_t[key]);
    }
    return csstr;
}

function day_2_week_range_b(csstr,cstype='',delimiter='-',sunday_is_first_day=false){
    //日期返回所在周(周一——周日) - 保留注释
    //cstype pre:上周 next:下周 this:本周
    var theday=default_date_b(csstr,true);
    var theweek=theday.getDay();
    if (sunday_is_first_day){
        theday.setTime(theday.getTime()-theweek*24*60*60*1000);        
    } else {
        if (theweek==0){
            theweek=7;
        }
        theday.setTime(theday.getTime()-(theweek-1)*24*60*60*1000);        
    }
    
    if (cstype=='pre'){
        theday.setTime(theday.getTime()-7*24*60*60*1000);
    } else if (cstype=='next'){
        theday.setTime(theday.getTime()+7*24*60*60*1000);
    }
    var theday2 = new Date(theday.getTime());
    theday2.setTime(theday.getTime()+7*24*60*60*1000-1);    //差1毫秒 - 保留注释
    if (delimiter===false){
        return [theday,theday2];    
    } else {
        return [date2str_b(delimiter,theday),date2str_b(delimiter,theday2)];
    }
}

function year_week_range_b(csyear='',sunday_is_first_day=false){
    if (csyear==''){
        csyear=new Date().getFullYear();
    }
    var firstweek=day_2_week_range_b(csyear+'-01-01','this',false,sunday_is_first_day);
    var result_t=[];
    var theday=validdate_b(csyear+'-01-01');
    while (theday<=firstweek[1]){
        //result_t.push([new Date(theday.getTime()),1]); // - 此行检验用 - 保留注释
        result_t.push(1);
        theday.setTime(theday.getTime()+24*60*60*1000);
    }

    var day_remained=days_remained_of_year_b(firstweek[1]);
    for (let blxl=0;blxl<day_remained;blxl++){
        //result_t.push([new Date(theday.getTime()),1+1+Math.floor(blxl/7)]); // - 此行检验用 - 保留注释
        result_t.push(1+1+Math.floor(blxl/7));
        theday.setTime(theday.getTime()+24*60*60*1000);
    }
    return result_t;
}

function preweekday_b(csstr='',weekno=0){
    //上一个星期几日期 - 保留注释
    var theday=default_date_b(csstr);
    if (theday==false){return '';}
    
    if (weekno==0){
        weekno=7;
    }
    weekno=Math.min(7,Math.max(1,weekno));
    now_weekday=theday.getDay();
    now_weekday=(now_weekday==0?7:now_weekday);
    if (weekno<now_weekday){
        theday.setTime(theday.getTime()-(now_weekday-weekno)*24*60*60*1000);
    } else {
        theday.setTime(theday.getTime()-(now_weekday+7-weekno)*24*60*60*1000);
    }
    return theday;
}

function previous_year_b(csstr,csyears=1,return_str=true,sep='-'){
    //2018-05-28
    var theday=default_date_b(csstr);
    if (theday==false){return '';}
    
    var blyear=theday.getFullYear()-csyears;

    var date_str=now_time_str_b(':',true,theday,'-');
    var blat=date_str.indexOf('-');
    date_str=blyear+date_str.substring(blat,);
    
    if (!isLeapYear_b(blyear)){
        var blstr=blyear+'-02-29';
        if (date_str.substring(0,blstr.length)==blstr){
            date_str=blyear+'-02-28'+date_str.substring(blstr.length,);
        }
    }
    
    var bljg=validdate_b(date_str);
    if (bljg===false){return '';}
    
    if (return_str){
        return date2str_b(sep,bljg);
    } else {
        return bljg;
    }
}

function next_year_b(csstr='',csyears=1,return_str=true,sep='-'){
    //2018-05-28
    return previous_year_b(csstr,csyears*-1,return_str,sep);
}

function next_day_b(csstr='',csdays=1,return_str=true,sep='-'){
    //2018-05-28
    return previous_day_b(csstr,csdays*-1,return_str,sep);
}

function next_days_b(csstr='',csdays=1,return_str=true,sep='-',interval=1,interval_type='d'){
    return previous_days_b(csstr,csdays*-1,return_str,sep,interval,interval_type);
}

function previous_day_b(csstr='',csdays=1,return_str=true,sep='-'){
    //2018-05-28
    var theday=default_date_b(csstr);
    if (theday==false){return '';}
    
    theday.setTime(theday.getTime()-csdays*24*60*60*1000);
    if (return_str){
        return date2str_b(sep,theday);
    } else {
        return theday;
    }
}

function previous_days_b(csstr='',csdays=1,return_str=true,sep='-',interval=1,interval_type='d'){
    function sub_previous_days_b_one_date(csstep){
        switch (interval_type){
            case 'd':
                theday.setTime(theday.getTime()-csstep*24*60*60*1000);
                break;
            case 'm':
                theday=new Date(theday.getFullYear(), theday.getMonth()-csstep,theday.getDate());
                break;
            case 'y':
                theday=new Date(theday.getFullYear()-csstep, theday.getMonth(),theday.getDate());
                break;
        }
        
        if (return_str){
            result_t.push(date2str_b(sep,theday));
        } else {
            var theday2 = new Date(theday.getTime()); //deepcopy - 保留注释
            result_t.push(theday2);
        }    
    }
    //-----------------------
    var theday=default_date_b(csstr);
    if (theday==false){return [];}
    
    var result_t=[];
    if (csdays>=0){
        for (let blxl=0;blxl<csdays;blxl++){
            sub_previous_days_b_one_date(1*interval);
        }
    } else {
        for (let blxl=0;blxl>csdays;blxl--){
            sub_previous_days_b_one_date(-1*interval);
        }    
    }
    return result_t;
}

function default_date_b(csstr='',ignore_time=false){
    if (csstr==''){
        var theday=new Date();
    } else {    
        var theday=validdate_b(csstr);  //已经deepcopy - 保留注释
    }
    if (ignore_time){
        theday=validdate_b(date2str_b('-',theday));
    }    
    return theday;
}

function month_day_b(csmonth=0,csyear=0,returnlist=false,current_day=false){
    //返回指定月份天数
	var date1_tmp=new Date();
    var current_year=date1_tmp.getFullYear();
    var current_month=date1_tmp.getMonth();
    
    if (csmonth<=0){
        csmonth=current_month+1;
    }
    csmonth=Math.min(12,Math.max(csmonth,1));
    if (csyear==0){
	    csyear=current_year;
    }
    var list_t=[31,28,31,30,31,30,31,31,30,31,30,31];
    if (isLeapYear_b(csyear)){
        list_t[1]=29;
    }
    
    if (current_day && csyear==current_year){
        list_t[current_month]=date1_tmp.getDate();
    }
    
    if (returnlist){
        return list_t;
    }
    
    var bljg=list_t[csmonth-1];    
    return bljg;
}

function day_range_in_one_month_b(csmonth,csday,csrange=5){
    var list_t=[];
    
    var blstart=Math.max(1,csday-csrange);
    for (let blxl=blstart;blxl<=csday;blxl++){
        list_t.push(blxl);
    }

    var the_month_day=month_day_b(csmonth);
    var blmax=Math.min(csday+csrange,the_month_day);
    for (let blxl=csday+1;blxl<=blmax;blxl++){
        list_t.push(blxl);
    }
    return list_t;
}

function year365_b(csyear=0, returndate=false,month_list=[]){
    //返回一年份的日期列表数组 - 保留注释
    if (csyear==0){
	    var date1_tmp=new Date();
	    csyear=date1_tmp.getFullYear();
    }
    var blresult=[];
    var list_m=month_day_b(0,csyear,true);
    for (let blxl=0,lent=list_m.length;blxl<lent;blxl++){
        if (month_list.length>0 && !month_list.includes(blxl)){continue;}
        
        for (let blday=1;blday<=list_m[blxl];blday++){
            if (returndate){
                blresult.push(new Date(csyear+'-'+(blxl+1)+'-'+blday));
            } else {
                blresult.push(csyear+'-'+('00'+(blxl+1)).slice(-2,)+'-'+('00'+blday).slice(-2,));
            }
        }
    }
    return blresult;
}

function validdate_b(datestr,first_day_of_month=false,ismonth_day=false){    
    if (Object.prototype.toString.call(datestr) === '[object Date]' && !isNaN(datestr)){
        var theday2 = new Date(datestr.getTime()); //deepcopy - 保留注释
        return theday2;
    }
    
    if (datestr.length==8 && !datestr.includes('-')){   //年月日 - 保留注释
		datestr=datestr.slice(0,4)+'-'+datestr.slice(4,6)+'-'+datestr.slice(-2,);
	} else if (datestr.length==6 && !datestr.includes('-')){  //年月 - 保留注释
        var blyear=datestr.slice(0,4);
        var blmonth=datestr.slice(4,6);
        if (first_day_of_month){
            datestr=blyear+'-'+blmonth+'-01';
        } else {
            datestr=blyear+'-'+blmonth+'-'+month_day_b(parseInt(blmonth),parseInt(blyear));
        }
    } else if (datestr.length==7){    //年-月 - 保留注释
        var blyear=datestr.slice(0,4);
        var blmonth=datestr.slice(-2,);
        if (first_day_of_month){
            datestr=blyear+'-'+blmonth+'-01';
        } else {
            datestr=blyear+'-'+blmonth+'-'+month_day_b(parseInt(blmonth),parseInt(blyear));
        }
    } else if (datestr.match(/^\d{4}年\d{1,2}月\d{1,2}日$/)){
        datestr=datestr.replace(/[年月]/g,'-').slice(0,-1);
    } else if (ismonth_day){
        var blyear=new Date().getFullYear();
        if (datestr.length==4 || datestr.length==5){    //月日，月-日 - 保留注释
            var blmonth=datestr.slice(0,2);
            var blday=datestr.slice(-2,);
            datestr=blyear+'-'+blmonth+'-'+blday;
        }        
    }

    var bltime=(datestr.includes(':')?'':' 00:00:00');
	var datetmp=new Date(datestr+bltime);
	if ( Object.prototype.toString.call(datetmp) === '[object Date]' ){
		if ( isNaN( datetmp.getTime() ) ){
            return false;
        } else {
            return datetmp;
        }
	} else {
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

function isLeapYear_b(csyear=false,prev_or_next=0,return_number=false){
	if (csyear===false){
        csyear= new Date().getFullYear();
    }
    csyear=csyear+prev_or_next;
    
    if (csyear % 4==0 && csyear % 100!=0 || csyear % 400==0){
        if (return_number){
            return 366;
        } else {
            return true;
        }
    }
    if (return_number){
        return 365;
    } else {
        return false;
    }
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
        case 'w':
            return csdate.getDay();
            break;
        case 'list':
            return [csdate.getFullYear(),csdate.getMonth()+1,csdate.getDate(),csdate.getHours(),csdate.getMinutes(),csdate.getSeconds(),csdate.getDay()];
            break;
        case 'dict':
            var bldict={
            'y':csdate.getFullYear(),   //不能使用 yy - 保留注释
            'm':csdate.getMonth()+1,
            '2m':('0'+(csdate.getMonth()+1)).slice(-2,),    //不能使用 mm - 保留注释
            'd':csdate.getDate(),
            '2d':('0'+csdate.getDate()).slice(-2,),
            'h':csdate.getHours(),
            'M':csdate.getMinutes(),
            's':csdate.getSeconds(),
            'w':csdate.getDay(),
            'cnbrief':day_2_week_b(csdate.getDay(),'cnbrief'),
            'en3':day_2_week_b(csdate.getDay(),'en3'),
            };
            return bldict;
            break;
    }
    return -1;
}

function date_2_str_format_b(csdate,str_format,cstype='date'){
    switch (cstype){
        case 'date':
            var date_dict=date_2_ymd_b(csdate,'dict');
            break;
        case 'str':
        case 'string':
            var bldate=validdate_b(csdate);
            if (bldate===false){
                return str_format;
            };
            var date_dict=date_2_ymd_b(bldate,'dict');
            break;
        case 'dict':
            var date_dict=csdate;
            break;
        default:
            return str_format;
    }
    
    for (let key in date_dict){
        str_format=str_format.replace(new RegExp('%'+key,'g'),date_dict[key]);
    }
    return str_format;
}

function time_2_emoji_b(cstime=false){
    var blemoji=['🕛','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚'];
    if (cstime===false){
        cstime=new Date();
    }
    var blh='';
    if (Object.prototype.toString.call(cstime) === '[object Date]' && !isNaN(cstime)){
        blh=cstime.getHours().toString();
    } else {
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

function date_list_insert_zero_b(cslist,add0101=false,add1231=false,months_list=[],days_list=[],default_value=0,return_inserted=false){   //日期补全 - 保留注释
    //[
    //[date1,value1],
    //[date2,value2],    
    //];
    //另：int_number_list_insert_zero_b
    //days_list 形如 ['01','02']
    var inserted_list=[];
    cslist.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    if (cslist.length==0){
        if (return_inserted){
            return [cslist,inserted_list];
        } else {
            return cslist;
        }
    }

    if (add0101){
        var day_begin_str=date2str_b('-',cslist[0][0]);
        if (day_begin_str.slice(-6,)!=='-01-01'){
            var day_begin_date=validdate_b(day_begin_str.substring(0,4)+'-01-01');
            cslist=[[day_begin_date,default_value]].concat(cslist);
            inserted_list.push(day_begin_date);
        }
    }
    
    if (add1231){
        var day_end_str=date2str_b('-',cslist.slice(-1)[0][0]);
        if (day_end_str.slice(-6,)!=='-12-31'){
            var day_end_date=validdate_b(day_end_str.substring(0,4)+'-12-31');
            cslist.push([day_end_date,default_value]);
            inserted_list.push(day_end_date);            
        }
    }

    if (cslist.length<2){
        if (return_inserted){    
            return [cslist,inserted_list];        
        } else {
            return cslist;
        }
    }
    
    var days=new Set();
    for (let item of cslist){
        days.add(date2str_b('-',item[0]));
    }
    
    var list_t=Array.from(days);
    list_t.sort();
    var minstr=list_t[0];
    var maxstr=list_t.slice(-1)[0];

    var mindate=new Date(cslist[0][0].getTime());
    var maxdate=new Date(cslist[cslist.length-1][0].getTime());
    while (true){
        if (mindate>=maxdate){break;}   //此处 maxdate 已经存在于数组中 - 保留注释
        mindate.setTime(mindate.getTime()+24*60*60*1000);
        var blstr=date2str_b('-',mindate);
        if (months_list.length>0 && !months_list.includes(blstr.slice(5,7))){continue;}        
        if (days_list.length>0 && !days_list.includes(blstr.slice(-2,))){continue;}
        
        if (!days.has(blstr) && blstr>=minstr && blstr<=maxstr){
            var the_date=new Date(mindate.getTime());
            cslist.push([the_date,default_value]);
            inserted_list.push(the_date);
        }
    }
    cslist.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});

    if (return_inserted){    
        return [cslist,inserted_list];        
    } else {
        return cslist;
    }
}

function days_between_firstday_to_sunday_b(csdate){
    var theday=validdate_b(csdate);
    if (theday==false){return -1;}
    now_weekday=theday.getDay();
    return (now_weekday==0?0:7-now_weekday);    
}

function is_sunday_b(days_to_sunday,day_no,csstr=' ╎ '){
    return (day_no-days_to_sunday)%7==0?('<span style="color:'+scheme_global['memo']+';">'+csstr+'</span>'):'';   
}

function month01_day_b(the_day){
    var border_bottom=(the_day.slice(-2,)=='01'?'border-bottom:0.1rem dotted '+scheme_global['memo']+';':'');
    return border_bottom;
}

function parse_relative_date_b(datestr){
    datestr=datestr.replace(/\b(one|a|an)\b/g,'1');
    //const date = parseRelativeDate("2 day ago"); // 输出2天前的日期 - 保留注释
    var now = new Date();
    var blnumber = datestr.match(/\d+/g); // 提取数字
    if (blnumber==null){return false;}
    blnumber=parseInt(blnumber);
    var unitString = datestr.replace(/\d+/g, '').trim(); // 提取单位

    var seconds=-1;
    switch (unitString){
        case 'day ago':
        case 'days ago':
            seconds=86400000;
            break;
        case 'hour ago':
        case 'hours ago':
            seconds=3600000;
            break;
        case 'minute ago':
        case 'minutes ago':
            seconds=60000;
            break;
    }
    if (seconds>-1){
         return new Date(now - blnumber * seconds);
    } else {
        return false;
    }
}
