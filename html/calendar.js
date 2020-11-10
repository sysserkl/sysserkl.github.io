function Lunar_klcalendar(objDate) {
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

    function sub_Lunar_klcalendar_monthDays(y,m) {
        //返回农历 y年m月的总天数
        return (lunarInfo_global[y-1900] & (0x10000>>m))? 30: 29;
    }
    
    function sub_Lunar_klcalendar_leapDays(y){
        //返回农历 y年闰月的天数
        if(sub_Lunar_klcalendar_leapMonth(y)){
            return (lunarInfo_global[y-1899]&0xf)==0xf? 30: 29;
        }
        else {return 0;}
    }
    
    function sub_Lunar_klcalendar_leapMonth(y) {
        //返回农历 y年闰哪个月 1-12 , 没闰返回 0
        var lm = lunarInfo_global[y-1900] & 0xf;
        return lm==0xf?0:lm;
    }    
    //----------
    var i, leap=0, temp=0;
    var offset=(Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;

    for (i=1900; i<2100 && offset>0; i++) {
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
        if(leap>0 && i==(leap+1) && this.isLeap==false){
             --i; 
             this.isLeap = true; 
             temp = sub_Lunar_klcalendar_leapDays(this.year); 
        }
        else {
            temp = sub_Lunar_klcalendar_monthDays(this.year, i);
        }
        //解除闰月
        if(this.isLeap==true && i==(leap+1)){
            this.isLeap = false;
        }
        offset -= temp;
    }

    if (offset==0 && leap>0 && i==leap+1){
        if (this.isLeap){ 
            this.isLeap = false; 
        }
        else { 
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
    }
    else {
        this.days=sub_Lunar_klcalendar_monthDays(this.year,this.month);    
    }
}

function sTerm_klcalendar(y,n) {
    //某年的第n个节气为几日(从0小寒起算)
    var sTermInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
	var offDate = new Date((31556925974.7*(y-1900) + sTermInfo[n]*60000) + Date.UTC(1900,0,6,2,5));
	return offDate.getUTCDate();
}

function oclass_klcalendar(y,m){
    //返回阴历控件 (y年,m+1月)
    function sub_calendar_calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,lmdays){
        //阴历属性
        this.isToday    = false;
        //瓣句
        this.sYear      = sYear;   //公元年4位数字
        this.sMonth     = sMonth;  //公元月数字
        this.sDay       = sDay;    //公元日数字
        this.week       = week;    //星期, 1个中文
        this.odate=new Date(sYear+'-'+sMonth+'-'+sDay);
        //农历
        this.lYear      = lYear;   //公元年4位数字
        this.lMonth     = lMonth;  //农历月数字
        this.lDay       = lDay;    //农历日数字
        this.isLeap     = isLeap;  //是否为农历闰月?
        this.lmdays= lmdays; //农历月天数
        this.color      = '';
        this.solarTerms    = ''; //节气
    }
    //--------
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
    
    for (let blxl=0;blxl<this.length;blxl++){
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
    var solarTerm = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];

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
    
function changeCld_klcalendar(){
    var csyear=document.querySelector('#selectyear').selectedIndex+1900;
    var csmonth=document.querySelector('#selectmonth').selectedIndex;

    var yDisplay="";
    if (csyear<=1874){}
    else if (csyear<=1908){
        yDisplay = '光绪' + (((csyear-1874)==1)?'元':csyear-1874)+'年';
    }
    else if (csyear<=1911){
        yDisplay = '宣统' + (((csyear-1908)==1)?'元':csyear-1908)+'年';
    }
    else {
        yDisplay = '民国' + (((csyear-1911)==1)?'元':csyear-1911)+'年';
        if(csyear>2017){
            yDisplay = yDisplay + ' <font color=pink>新冷战' + (((csyear-2017)==1)?'元':csyear-2017)+'年</font>';
        }
    }
    document.querySelector('#span_year_name').innerHTML = yDisplay +' '; 

    var otoday=document.querySelector('.todayColor');
    if (otoday){
        otoday.classList.remove('todayColor');
    }

    cld_global = new oclass_klcalendar(csyear,csmonth);   
    
    var theday=new Date(csyear+'-'+(csmonth+1)+'-01');

    for (let blxl=0;blxl<42;blxl++){
        var sObj=document.getElementById('span_td_day'+ blxl);
        var lObj=document.getElementById('span_td_lunar_day'+ blxl);
        sObj.style.borderBottom='';
        
        var sD = blxl - cld_global.firstWeek;
        if (sD>=0 && sD<cld_global.length) { //日期内
            sObj.innerHTML = sD+1;

            var important_list=memo_theday_klcalendar(theday,true);
            if (important_list.length>0){
                sObj.style.borderBottom='0.2rem dotted red';
            }
            theday.setTime(theday.getTime()+24*60*60*1000);

            if (cld_global[sD].isToday){
                sObj.classList.add('todayColor');
            } //今日颜色

            sObj.style.color = cld_global[sD].color; //法定假日颜色

            if (cld_global[sD].lDay==1){
                lObj.innerHTML = '<b>'+(cld_global[sD].isLeap?'闰':'') + cld_global[sD].lMonth + '月<small>' + (cld_global[sD].lmdays==29?'小':'大')+'</small></b>';
//sub_Lunar_klcalendar_monthDays(cld_global[sD].lYear,cld_global[sD].lMonth)
            }//显示农历月
            else {
                lObj.innerHTML = changeCld_cDay_klcalendar(cld_global[sD].lDay);
            }//显示农历日

            var blstr='';
            if (cld_global[sD].solarTerms!==''){
                blstr = cld_global[sD].solarTerms.fontcolor('blue');
            }

            if(blstr.length>0){
                lObj.innerHTML = blstr;
            }
      }
      else { //非日期
         sObj.innerHTML = '';
         lObj.innerHTML = '';   
        }
    }
    var otrs=document.querySelectorAll('table#table_one_month tr');
    for (let one_tr of otrs){
        if (one_tr.innerText.trim()==''){
            one_tr.style.display='none';
        }
        else {
            one_tr.style.display='';
        }
    }
    td_onclick_klcalendar(current_td_global);
}

function pushBtn_klcalendar(cstype){
    function sub_pushBtn_klcalendar_klinittip(csday){
        var blelement=document.querySelectorAll('span[id^="span_td_day"]');
        for (let blxl=0;blxl<blelement.length;blxl++){
            if (blelement[blxl].innerText==csday){
                day_info_klcalendar(blxl);
                break;
            }
        }
    }
    //---------
    var blyselect=document.querySelector('#selectyear');
    var blmselect=document.querySelector('#selectmonth');
    var Today = new Date();
    switch (cstype){
        case 'year-' :
            if (blyselect.selectedIndex>0){
                blyselect.selectedIndex--;
            }
            break;
        case 'year+' :
            if (blyselect.selectedIndex<200){
                blyselect.selectedIndex++;
            }
            break;
        case 'month-' :
            if (blmselect.selectedIndex>0) {
                blmselect.selectedIndex--;
            }
            else {
                blmselect.selectedIndex=11;
                if(blyselect.selectedIndex>0){
                    blyselect.selectedIndex--;
                }
            }
            break;
        case 'month+' :
            if (blmselect.selectedIndex<11) {
                blmselect.selectedIndex++;
            }
            else {
                blmselect.selectedIndex=0;
                if(blyselect.selectedIndex<200){
                    blyselect.selectedIndex++;
                }
            }
            break;
        default:
            blyselect.selectedIndex=Today.getFullYear()-1900;
            blmselect.selectedIndex=Today.getMonth();
    }
    changeCld_klcalendar();
    if (!cstype==""){
        sub_pushBtn_klcalendar_klinittip('1');
    }
    else{
        sub_pushBtn_klcalendar_klinittip(Today.getDate().toString());
    }
}

function day_info_klcalendar(td_number){
    //显示详细日期资料
    var blstr='';
    var festival='';
    var sObj=document.getElementById('span_td_day'+ td_number);
    var d=sObj.innerHTML-1;

    if (sObj.innerHTML==''){
        return;
    }
    
    sObj.style.cursor = 'hand';

    if (cld_global[d].solarTerms !== ''){
        festival='<p><font color=blue>'+cld_global[d].solarTerms+'</font></p>';
    }
    
    blstr=blstr+'<p><b>'+cld_global[d].sYear+'年'+cld_global[d].sMonth+'月'+cld_global[d].sDay+'日</b>';
    
    var memo_list=memo_theday_klcalendar(validdate_b(cld_global[d].sYear+'-'+cld_global[d].sMonth+'-'+cld_global[d].sDay));
    
    blstr=blstr+'<small>(第'+day_of_year_b(cld_global[d].odate)+'天)</small></p>';//validdate_b(cld_global[d].sYear+'-'+cld_global[d].sMonth+'-'+cld_global[d].sDay)
    blstr=blstr+'<p><font color=blue>农历'+(cld_global[d].isLeap?'闰':'')+cld_global[d].lMonth+'月'+cld_global[d].lDay+'日</font></p><p>'+festival; 

    var theyear=parseInt(document.getElementById('selectyear').value);
    var bigday_list=big_day_b(cld_global[d].odate,true);  //new Date(cld_global[d].sYear+'-'+cld_global[d].sMonth+'-'+cld_global[d].sDay),true);
    for (let blxl=0;blxl<bigday_list.length;blxl++){
        var item=bigday_list[blxl];
        if (item.match(/^\d{4}年/)==null){continue;}
        bigday_list[blxl]=bigday_list[blxl]+'<small style="color:grey;">('+(theyear-parseInt(item.substring(0,4)))+')</small>';
    }
    document.getElementById('section_history').innerHTML=blstr+array_2_li_b(bigday_list,'p',false)+array_2_li_b(memo_list,'p',false);
}

function td_onclick_klcalendar(csid){
    if (csid==null || csid==''){return;}
    var otd=document.getElementById(csid);
    if (!otd){return;}
    
    var old_td=document.getElementById(current_td_global);
    if (old_td){
        old_td.style.backgroundColor='';
    }
    
    if (current_td_global==csid){   //取消加亮 - 保留注释
        current_td_global='';
        return;
    }
    
    current_td_global=csid;
    
    if (otd.style.backgroundColor==''){
        otd.style.backgroundColor='skyblue';
    }
    else {
        otd.style.backgroundColor='';
    }
}

function tr_days_klcalendar(){
    var gNum;
    var bljg='';
    for (let row=0;row<6;row++){
        bljg=bljg+'<tr align=center>';
        for (let col=0;col<7;col++){
            gNum = row*7+col;
            //公历
            bljg=bljg+'<td class="td_one_day" nowrap><span onmouseover="javascript:day_info_klcalendar(' + gNum +');" onclick="javascript:td_onclick_klcalendar(this.id);" id="span_td_day' + gNum +'" class="span_td_day"';
            if(col==0){
                bljg=bljg+' color=red';
            }
            if(col==6){
                bljg=bljg+' color=#00D900';
            }
            //农历
            bljg=bljg+'> </span><br><span id="span_td_lunar_day' + gNum + '" class="span_td_lunar_day"> </span></td>';
        }
        bljg=bljg+'</tr>\n';
    }
    document.getElementById('tr_week_name').insertAdjacentHTML('afterend',bljg);
}

function memo_form_klcalendar(){
    var memo_list=local_storage_get_b('memo_klcalendar',-1,true);
    var postpath=postpath_b();
	var bljg='<form method="POST" action="'+postpath+'temp_txt_share.php" name="form_memo_klcalendar" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_memo_klcalendar" id="textarea_memo_klcalendar" style="height:20rem;font-size:1.1rem;">'+memo_list.join('\n')+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" style="font-size:1.5rem;" onclick="javascript:document.getElementById(\'div_memo\').innerHTML=\'\';">关闭</span> ';    
    bljg=bljg+'<span class="aclick" style="font-size:1.5rem;" onclick="javascript:memo_update_klcalendar();">更新</span> ';    
    bljg=bljg+textarea_buttons_b('textarea_memo_klcalendar','清空,复制,发送到临时记事本,发送地址','',' style="font-size:1.5rem;"');
    bljg=bljg+' 行数：'+memo_list.length;
    bljg=bljg+'</p>';
    bljg=bljg+'</form>';
    document.getElementById('div_memo').innerHTML=bljg;
}

function memo_update_klcalendar(){
    if (confirm("是否更新Memo？")){
        localStorage.setItem('memo_klcalendar',document.getElementById('textarea_memo_klcalendar').value.trim());
        memo_read_klcalendar();
        memo_form_klcalendar();
    }
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
    bljg=bljg+'<p><span class="aclick" style="font-size:1.5rem;" onclick="javascript:document.getElementById(\'div_memo\').innerHTML=\'\';">关闭</span></p>';    
    odiv.innerHTML=bljg;

}

function menu_klcalendar(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="javascript:'+str_t+'memo_form_klcalendar();">Memo 编辑</span>',    
    '<span class="span_menu" onclick="javascript:'+str_t+'memo_help_klcalendar();">Memo Demo</span>',
    ];

    document.getElementById('td_head').insertAdjacentHTML('afterbegin',klmenu_b(klmenu1,'公元','14rem'));
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
        list_t[0]=list_t[0].trim();
        list_t[1]=list_t[1].trim();
        if (isNaN(list_t[0]) || isNaN(list_t[1])){continue;}
        blstr=list_t.slice(2,).join(',');
        memo_list_global.push([parseInt(list_t[0]),parseInt(list_t[1]),blstr]);
        if (blstr.substring(0,1)=='*'){
            memo_list_important_global.push([parseInt(list_t[0]),parseInt(list_t[1]),blstr]);
        }
    }
}

function memo_theday_klcalendar(csdate=false,is_important=false){
    if (csdate===false){
        csdate=new Date();
    }
    var blpd;
    var result_t=[];
    if (is_important){
        var list_t=memo_list_important_global;
    }
    else {
        var list_t=memo_list_global;
    }
    for (let item of list_t){
        blstr=item[2];
        while (true){
            [blstr,blpd]=mdw_str_klcalendar(blstr,csdate);
            if (blpd===false){
                break;
            }
            else if (blpd===null){
                if (blstr.substring(0,1)=='*'){
                    blstr='<b>'+blstr.substring(1,)+'</b>';
                }
                result_t.push(('00'+item[0]).slice(-2,)+':'+('00'+item[1]).slice(-2,)+' '+blstr);
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

function mdw_str_klcalendar(csstr,csdate=false){
    //AAA(l33)(m,10-12,1-3)(w,1-3,5) - 保留注释
    //XXXXXX(d,24,25,26) - 保留注释
    function sub_mdw_str_klcalendar_min_max(date_list,date_value){
        var blmin;
        var blmax;    
        for (let one_element of date_list){
            if (!one_element.includes('-')){continue;}
            [blmin,blmax]=one_element.split('-').slice(0,2);
            if (isNaN(blmin) || isNaN(blmax)){
                continue;
            }
            if (date_value>=parseInt(blmin) && date_value<=parseInt(blmax)){
                return true;
            }
        }
        return false;
    }
    //--------------------------------
    var list_t=csstr.match(/\([wdms],\d+.*?\)/g);
    if (list_t==null){
        return [csstr,null];
    }
    if (csdate===false){
        csdate=new Date();
    }
    for (let item of list_t){
        csstr=csstr.replace(item,'');
        date_list=item.slice(1,-1).split(',');
        switch (date_list[0]){
            case 'd':
                var theday=csdate.getDate();
                if (date_list.includes(theday.toString())){
                    return [csstr,true];
                }
                if (sub_mdw_str_klcalendar_min_max(date_list,theday)){
                    return [csstr,true];
                }
                break;
            case 'm':
                var themonth=(csdate.getMonth()+1);
                if (date_list.includes(themonth.toString())){
                    return [csstr,true];
                }               
                if (sub_mdw_str_klcalendar_min_max(date_list,themonth)){
                    return [csstr,true];
                }                 
                break;
            case 'w':
                var theweek=csdate.getDay();
                if (date_list.includes(theweek.toString())){
                    return [csstr,true];
                }   
                if (sub_mdw_str_klcalendar_min_max(date_list,theweek)){
                    return [csstr,true];
                }
                
                if (theweek==0){
                    theweek=7;
                }
                if (date_list.includes(theweek.toString())){
                    return [csstr,true];
                }   
                if (sub_mdw_str_klcalendar_min_max(date_list,theweek)){
                    return [csstr,true];
                }                
                break;
            case 's':
                if (date_list.length==3){
                    var interval_days=date_list[1];
                    if (!isNaN(interval_days)){
                        interval_days=parseInt(interval_days);
                        var startday=validdate_b(date_list[2]);
                        if (interval_days>0 && startday!==false){
                            if (0==Math.floor((csdate-startday)/86400000) % interval_days){
                                return [csstr,true];
                            }
                        }
                    }
                }
                break;
        }
    }
    return [csstr,false];
}

function init_klcalendar(){
    menu_klcalendar();
    memo_read_klcalendar();
    if (!ismobile_b()){
        var section_height=document.getElementById('td_section').getBoundingClientRect().height;
        document.getElementById('section_history').style.maxHeight=section_height+'px';
        document.getElementById('section_history').style.width='45rem';
    }
}
