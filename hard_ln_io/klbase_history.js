//大事记
function big_day_week_b(csdate){
    var theweek=csdate.getDay();
    var themonth=csdate.getMonth();
    var blxl=1;
    var bldate=new Date(csdate.getTime());
    while (true){
        bldate.setTime(bldate.getTime()-7*24*60*60*1000);
        if (bldate.getMonth()==themonth){
            blxl=blxl+1;
        } else {break;}
    }
    
    var blxl2=1;
    var bldate=new Date(csdate.getTime());
    while (true){
        bldate.setTime(bldate.getTime()+7*24*60*60*1000);
        if (bldate.getMonth()==themonth){
            blxl2=blxl2+1;
        } else {break;}
    }

    //节日名称 月份 星期0-6 第几个星期0-6 倒数第几个星期0-6
    var days_t=[
    ['马丁路德金日',1,1,3,-1],
    ['美国总统日',2,1,3,-1],
    ['美国劳工节',9,1,1,-1],
    ['哥伦布日',10,1,2,-1],
    ['母亲节',5,0,2,-1],
    ['美国阵亡将士纪念日',5,1,-1,1],
    ['父亲节',6,0,3,-1],
    ['感恩节',11,4,4,-1],
    ['被奴役国家周',7,0,3,-1],
    ];
    
    var bljg='';
    for (let item of days_t){
        if (themonth+1==item[1] && theweek==item[2] && (blxl==item[3] || blxl2==item[4])){
            bljg=(themonth+1)+'月'+csdate.getDate()+'日，'+item[0];
            break;
        }
    }    
    return [themonth+1,theweek,blxl,blxl2,bljg];
}

function big_day_imgs_b(csdate=false,imgpath=''){
    var bigday_imgpath=location.origin+imgpath;

    if (csdate==false){
        csdate=new Date();
    }
	var cmonth=('0'+(csdate.getMonth()+1)).slice(-2);
    var cday=('0'+csdate.getDate()).slice(-2);

    var weekday_t=big_day_week_b(csdate)[4];
    if (weekday_t.includes('，')){
        weekday_t=weekday_t.split('，')[1];
    }
	var bljg=[];
	for (let item of bigday_img_global){
		if (item.substring(0,4)==cmonth+cday || item.substring(4,8)==cmonth+cday || weekday_t!=='' && item.substring(0,weekday_t.length)==weekday_t){
			bljg.push([bigday_imgpath,item,'']);
		}
	}
	return bljg;
}

function big_day_b(csdate=false){
    if (csdate==false){
        csdate=new Date();
    }
    
	var cmonth=csdate.getMonth()+1;
    var cday=csdate.getDate();

    var list_t=bigday_history_pb_global['m'+cmonth+'d'+cday];
    if (typeof bigday_history_kl_global == 'object' && 'm'+cmonth+'d'+cday in bigday_history_kl_global){
        list_t=list_t.concat(bigday_history_kl_global['m'+cmonth+'d'+cday]);
    }
    list_t.sort();
    
    var weekday_t=big_day_week_b(csdate)[4];
    if (weekday_t!==''){
        list_t=[weekday_t].concat(list_t);
    }
    return list_t;
}
