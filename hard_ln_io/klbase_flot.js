//依赖 klbase_date.js - 保留注释
function flot_two_lines_two_yaxis_k(cslist,csid,y1unit,y2unit,label_position='nw',cstime=false,cstype='m',y1dec=2,y2dec=2,cstimeformat='',cstickSize=[],csmin_data_length=-1,csymin1=false,csymax1=false,csymin2=false,csymax2=false,right_group_count=1){
    function sub_flot_two_lines_two_yaxis_k_date_set(cslist,isright=false){
        var label_str=cslist.shift();
        if (isright){
            return { label: label_str, data: cslist, lines: {show: true}, points: {show: true, symbol: flot_rand_flot_symbol_k()},yaxis: 2};        
        }
        else {
            return { label: label_str, data: cslist, lines: {show: true}, points: {show: true, symbol: flot_rand_flot_symbol_k()}};
        }
    }
    //----------------------------------------------------------------------------
    //list1_t: [ '次数',[2019-08-01, 100],[2019-08-02, 300] ];    
    //不支持一边多条线 - 保留注释
    
    if (cslist.length<2){return;}
    if (cslist[0].length<2){return;} //内容为空，或者只有名称 - 保留注释
    
    var left_group=cslist.slice(0,-1*right_group_count);
    var right_group=cslist.slice(-1*right_group_count,);
    var list1_t=left_group[0];
    var list2_t=right_group[0];
    
    if (label_position==''){
        label_position='nw';
    }
    if (cstime && list1_t.length==2 && list2_t.length==2){
        //只能是数字，不能加年份和字符 - 保留注释
        for (let blxl=0;blxl<left_group.length;blxl++){
            left_group[blxl][1][0]=date_2_ymd_b(left_group[blxl][1][0],cstype);
        }
        for (let blxl=0;blxl<right_group.length;blxl++){
            right_group[blxl][1][0]=date_2_ymd_b(right_group[blxl][1][0],cstype);
        }        
        
        //list1_t[1][0]=date_2_ymd_b(list1_t[1][0],cstype);
        //list2_t[1][0]=date_2_ymd_b(list2_t[1][0],cstype);
        cstime=false;
    }
    
    //指定 csmin_data_length 时，则当数据量少于 csmin_data_length 时，使用用户定义的 cstickSize，否则使用自动的cstickSize - 保留注释
    if (csmin_data_length>0 && cstickSize.length>0){
        if (list1_t.length>csmin_data_length && list2_t.length>csmin_data_length){
            cstickSize=[];
        }
    }
    
    if (csmin_data_length>0){
        if (list1_t.length<=csmin_data_length && list2_t.length<=csmin_data_length){
            if (y1dec==0){
                y1dec=-1;
            }
            if (y2dec==0){
                y2dec=-1;
            }
        }
    }
       
    var dataset = [];
    for (let one_array of left_group){
        dataset.push(sub_flot_two_lines_two_yaxis_k_date_set(one_array,false));
    }
    for (let one_array of right_group){
        dataset.push(sub_flot_two_lines_two_yaxis_k_date_set(one_array,true));
    }    
    
    if (list1_t.length==1 && list2_t.length==1){
        var blyaxes=[
            {
                'tickFormatter': function (v, axis) {return v.toFixed(axis.tickDecimals) + y1unit;}
            }, 
            { 
                'position': "right",
                'tickFormatter': function (v, axis) {return v.toFixed(axis.tickDecimals) + y2unit;}
            }
        ];
    }
    else {
        var blyaxes=[
            {
                'tickFormatter': function (v, axis) {return v.toFixed(y1dec==-1?axis.tickDecimals:y1dec) + y1unit;}
            }, 
            { 
                'position': "right",
                'tickFormatter': function (v, axis) {return v.toFixed(y2dec==-1?axis.tickDecimals:y2dec) + y2unit;}
            }
        ];
    }

    var oxaxis={};
    oxaxis['tickDecimals']=0;
    if (cstime){
        oxaxis['mode']='time';
    }

    if (cstickSize.length!==0){
        oxaxis['tickSize']=cstickSize;
    }

    var oyxaxis1={};
    if (csymin1!==false){
        oyxaxis1['min']=csymin1;
    }
    if (csymax1!==false){
        oyxaxis1['max']=csymax1;
    }
    
    var oyxaxis2={};
    if (csymin2!==false){
        oyxaxis2['min']=csymin2;
    }
    if (csymax2!==false){
        oyxaxis2['max']=csymax2;
    }
    if (csymin2!==false || csymax2!==false){
        if (list1_t.length==1 && list2_t.length==1){
            oyxaxis2['tickFormatter']=function (v, axis) {return v.toFixed(axis.tickDecimals) + y2unit;}
        }
        else {
            oyxaxis2['tickFormatter']=function (v, axis) {return v.toFixed(y2dec==-1?axis.tickDecimals:y2dec) + y2unit;}
        }
    }

    if (cstime){
        var oneyear;
        var oneyear2;
        var onemonth;        
        var onemonth2;
        [oneyear,onemonth]=isoneyear_isonemonth_k(list1_t);
        [oneyear2,onemonth2]=isoneyear_isonemonth_k(list2_t);
        cstimeformat=flot_timeformat_k(cstimeformat,cstype, oneyear && oneyear2,onemonth && onemonth2);
        
        if (cstimeformat!==''){
            oxaxis['timeformat']=cstimeformat;
        }
    }
    if (csymin1==false && csymax1==false && csymin2==false && csymax2==false){
        $.plot("#"+csid, dataset,{legend: { position: label_position }, xaxis: oxaxis,yaxes:blyaxes});    
    }
    else {
        $.plot("#"+csid, dataset,{legend: { position: label_position }, xaxis: oxaxis,yaxis:oyxaxis1,y2axis:oyxaxis2,yaxes:blyaxes});
    }
}

function flot_timeformat_k(cstimeformat,cstype,isoneyear,isonemonth){
    if (cstimeformat!==''){
        return cstimeformat;
    }
    if (cstype=='y'){
        cstimeformat="%Y年";
        //cstickSize: [1, 'year']; - 保留注释
    }
    else if (cstype=='m'){
        if (isoneyear){
            cstimeformat="%m月";
        }
        else {
            cstimeformat="%Y/%m";
        }
        //cstickSize: [1, 'month']; - 保留注释
    }
    else if (cstype=='d'){
        if (isonemonth){
            cstimeformat="%d日";
        }
        else if (isoneyear){
            cstimeformat="%m/%d";
        }
        else {
            cstimeformat="%Y/%m/%d";
        }
        //cstickSize: [1, 'day']; - 保留注释
    }
    return cstimeformat;
}

function isoneyear_isonemonth_k(cslist){
    var list_y=new Set();
    var list_m=new Set();
    for (let item of cslist){
        if (Array.isArray(item)){
            if (item.length>0){
                list_y.add(item[0].getFullYear());
                list_m.add(item[0].getMonth());
                
                if (list_y.size>1){
                    return [false,false];
                }
            }
        }
    }
    return [list_y.size>1?false:true,list_m.size>1?false:true];
}

function flot_lines_k(cslist,csid,label_position='nw',cstime=false,cstimeformat='',cstype='m',y1unit='',y1dec=-1,cstickSize=[],csmin_data_length=-1,csymin=false,csymax=false,csshowline=true){
   //[
   //[ "成都", [2012,300], [2014,400] ], 
   //[ "苏州", [2012,500], [2014,600] ],
   //]; - 保留注释
   //其中的 元素 不是 [ "成都", [ [2012,300], [2014,400] ] ], 
   //cstype y:getFullYear m: getMonth; d: getDate; - 保留注释
   
   //以下5行保留注释
    //for (let item of cslist){
        //for (let acol of item){
            //console.log(Array.isArray(acol),acol);
        //}
    //}
    if (cslist.length==0){return;}
    if (cslist[0].length<2){return;}    //内容为空，或者只有名称 - 保留注释
        
    if (label_position==''){
        label_position='nw';
    }
    if (cstime){
        for (let blxl=0;blxl<cslist.length;blxl++){
            if (cslist[blxl].length==2){
                //只能是数字，不能加年份和字符 - 保留注释
                cslist[blxl][1][0]=date_2_ymd_b(cslist[blxl][1][0],cstype);
                cstime=false;
            }
        }
    }
    var only_one_data=true;
    for (let blxl=0;blxl<cslist.length;blxl++){
        if (cslist[blxl].length>2){
            only_one_data=false;
            break;
        }
    }
    
    //指定 csmin_data_length 时，则当数据量少于 csmin_data_length 时，使用用户定义的 cstickSize，否则使用自动的cstickSize - 保留注释
    var maxdatalength=0;
    for (let item of cslist){
        maxdatalength=Math.max(maxdatalength,item.length);
    }
    
    if (csmin_data_length>0 && cstickSize.length>0){
        if (maxdatalength>csmin_data_length){
            cstickSize=[];
        }
    }
    
    //数据量不够时，纵轴间隔改为默认设置 - 保留注释
    if (csmin_data_length>0){
        if (maxdatalength<=csmin_data_length){
            if (y1dec==0){
                y1dec=-1;
            }
        }
    }
        
    var chart_data=[];
    for (let blxl=0;blxl<cslist.length;blxl++){
        var label_t=cslist[blxl].shift();
        var label_showline=csshowline;
        var label_showpoints=true;
        if (label_t.includes('#show:true#')){
            label_showline=true;
            label_t=label_t.replace('#show:true#','');
        }
        else if (label_t.includes('#show:false#')){
            label_showline=true;
            label_t=label_t.replace('#show:false#','');
        }
        if (label_t.includes('#points:true#')){
            label_showpoints=true;
            label_t=label_t.replace('#points:true#','');
        }
        else if (label_t.includes('#points:false#')){
            label_showpoints=false;
            label_t=label_t.replace('#points:false#','');
        }
        
        chart_data.push({
            data: cslist[blxl], 
            label: label_t, 
            lines: { 
                show: label_showline 
            }, 
            points: {
                show: label_showpoints,
                symbol: flot_rand_flot_symbol_k() 
            }
        });
    }
    
    if (y1dec==-1 || only_one_data){
        var blyaxes=[
            {
                tickFormatter: function (v, axis) {return v.toFixed(axis.tickDecimals) + y1unit;}
            }, 
        ];
    }
    else {
        var blyaxes=[
            {
                tickFormatter: function (v, axis) {return v.toFixed(y1dec) + y1unit;}
            }, 
        ];
    }

    var oxaxis={};
    oxaxis['tickDecimals']=0;
    
    var oyxaxis={};
    if (csymin!==false){
        oyxaxis['min']=csymin;
    }
    if (csymax!==false){
        oyxaxis['max']=csymax;
    }
    
    if (cstime){
        var oneyear=true;
        var onemonth=true;
        var oneyear2=true;
        var onemonth2=true;        
        for (let item of cslist){
            [oneyear2,onemonth2]=isoneyear_isonemonth_k(item);
            oneyear=oneyear && oneyear2;
            onemonth=onemonth && onemonth2;
        }
        
        cstimeformat=flot_timeformat_k(cstimeformat,cstype,oneyear,onemonth);
        
        oxaxis['mode']="time";
        if (cstimeformat!==''){
            oxaxis['timeformat']=cstimeformat;
        }
        if (cstickSize.length!==0){
            oxaxis['tickSize']=cstickSize;
        }
        
        $.plot("#"+csid, chart_data,{legend: { position: label_position }, xaxis: oxaxis, yaxis:oyxaxis, yaxes:blyaxes});
    }
    else {
        $.plot("#"+csid, chart_data,{legend: { position: label_position }, xaxis: oxaxis, yaxis:oyxaxis, yaxes:blyaxes});
    }
}

function flot_rand_flot_symbol_k(){
    var sym_t=["circle", "square", "diamond", "triangle", "cross", ];
    sym_t.sort(function (a, b) {return Math.random()>0.5 ? -1 : 1;});
    return sym_t[0];
}

function flot_pie_k(chart_data,csid,label_radius=11/15){
    //chart_data 类型如下：
    //[
    //{label: '杭州', data: 30},
    //{label: '宁波', data: 40},
    //];
    if (chart_data.length==0){return;}
    
    $.plot('#'+csid, chart_data, {
        series: {
            pie: {
                show: true,
                radius: 1,
                label: {
                    show: true,
                    radius: label_radius,
                    formatter: flot_labelFormatter_k,
                    background: {
                        opacity: 0.5
                    }
                }
            }
        },
        legend: {
        show: false
        }
    });
}

function flot_labelFormatter_k(label, series) {
    return "<div class='div_flot_pie_label'>" + label + "<br/>" + (series.percent).toFixed(2) + "%</div>";
}

function flot_import_js_k(cslist=[],isdefer=false){
    var blpath=location.href;
    if (blpath.includes('/klwebphp/')){
        blpath=blpath.split('/klwebphp/')[0];
        blpath=blpath+'/klwebphp/PythonTools/data/selenium_news/module/flot/';
    }
    else {
        blpath=location.href.split('//')[0]+'//'+location.host+'/module/flot/';
    }
    var defer_str=(isdefer?' defer':'');

    var result_t=[];
    result_t.push(blpath+'jquery.flot.min.js');
    for (let item of cslist){
        result_t.push(blpath+'jquery.flot.'+item+'.min.js');
    }
    
    for (let item of result_t){
        document.write('\n<script language="javascript" type="text/javascript" src="'+item+'"'+defer_str+'></script>\n');
    }
    console.log(result_t.join('\n')); //此行保留 -保留注释
}
