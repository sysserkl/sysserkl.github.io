//依赖 klbase_date.js - 保留注释
function flot_two_lines_two_yaxis_b(cslist,csid,y1unit='',y2unit='',label_position='nw',cstime=false,cstype='m',y1dec=2,y2dec=2,cstimeformat='',cstickSize=[],csmin_data_length=-1,csymin1=false,csymax1=false,csymin2=false,csymax2=false,right_group_count=1){
    function sub_flot_two_lines_two_yaxis_b_date_set(cslist,isright=false){
        var label_str=cslist.shift();
        if (isright){
            return { label: label_str, data: cslist, lines: {show: true}, points: {show: true, symbol: flot_rand_flot_symbol_b()},yaxis: 2};        
        } else {
            return { label: label_str, data: cslist, lines: {show: true}, points: {show: true, symbol: flot_rand_flot_symbol_b()}};
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
        for (let blxl=0,lent=left_group.length;blxl<lent;blxl++){
            left_group[blxl][1][0]=date_2_ymd_b(left_group[blxl][1][0],cstype);
        }
        for (let blxl=0,lent=right_group.length;blxl<lent;blxl++){
            right_group[blxl][1][0]=date_2_ymd_b(right_group[blxl][1][0],cstype);
        }
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
        dataset.push(sub_flot_two_lines_two_yaxis_b_date_set(one_array,false));
    }
    for (let one_array of right_group){
        dataset.push(sub_flot_two_lines_two_yaxis_b_date_set(one_array,true));
    }    
    
    if (list1_t.length==1 && list2_t.length==1){
        var blyaxes=[
            {
                'tickFormatter': function (v, axis){return v.toFixed(axis.tickDecimals) + y1unit;}
            }, 
            { 
                'position': 'right',
                'tickFormatter': function (v, axis){return v.toFixed(axis.tickDecimals) + y2unit;}
            }
        ];
    } else {
        var blyaxes=[
            {
                'tickFormatter': function (v, axis){return v.toFixed(y1dec==-1?axis.tickDecimals:y1dec) + y1unit;}
            }, 
            { 
                'position': 'right',
                'tickFormatter': function (v, axis){return v.toFixed(y2dec==-1?axis.tickDecimals:y2dec) + y2unit;}
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
            oyxaxis2['tickFormatter']=function (v, axis){return v.toFixed(axis.tickDecimals) + y2unit;}
        } else {
            oyxaxis2['tickFormatter']=function (v, axis){return v.toFixed(y2dec==-1?axis.tickDecimals:y2dec) + y2unit;}
        }
    }

    if (cstime){
        var oneyear, oneyear2, onemonth, onemonth2;
        
        [oneyear,onemonth]=isoneyear_isonemonth_b(list1_t);
        [oneyear2,onemonth2]=isoneyear_isonemonth_b(list2_t);
        cstimeformat=flot_timeformat_b(cstimeformat,cstype, oneyear && oneyear2,onemonth && onemonth2);
        
        if (cstimeformat!==''){
            oxaxis['timeformat']=cstimeformat;
        }
    }
    if (csymin1==false && csymax1==false && csymin2==false && csymax2==false){
        $.plot('#'+csid, dataset,{legend: { position: label_position }, xaxis: oxaxis,yaxes:blyaxes});    
    } else {
        $.plot('#'+csid, dataset,{legend: { position: label_position }, xaxis: oxaxis,yaxis:oyxaxis1,y2axis:oyxaxis2,yaxes:blyaxes});
    }
}

function flot_timeformat_b(cstimeformat,cstype,isoneyear,isonemonth){
    if (cstimeformat!==''){
        return cstimeformat;
    }
    if (cstype=='y'){
        cstimeformat='%Y年';
        //cstickSize: [1, 'year']; - 保留注释
    } else if (cstype=='m'){
        if (isoneyear){
            cstimeformat='%m月';
        } else {
            cstimeformat='%Y/%m';
        }
        //cstickSize: [1, 'month']; - 保留注释
    } else if (cstype=='d'){
        if (isonemonth){
            cstimeformat='%d日';
        } else if (isoneyear){
            cstimeformat='%m/%d';
        } else {
            cstimeformat='%Y/%m/%d';
        }
        //cstickSize: [1, 'day']; - 保留注释
    }
    return cstimeformat;
}

function isoneyear_isonemonth_b(cslist){
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

function flot_lines_b(cslist,csid,label_position='nw',cstime=false,cstimeformat='',cstype='m',y1unit='',y1dec=-1,cstickSize=[],csmin_data_length=-1,csymin=false,csymax=false,csshowline=true){
   //[
   //[ "成都", [2012,300], [2014,400] ], 
   //[ "苏州", [2012,500], [2014,600] ],
   //]; - 保留注释
   //其中的 元素 不是 [ "成都", [ [2012,300], [2014,400] ] ], 
   //cstype y:getFullYear m: getMonth; d: getDate; - 保留注释
    
    if (cslist.length==0){return;}

    var is_ok=true;
    for (let arow of cslist){
        if (typeof arow[0]!=='string'){
            console.log('error','第一个元素不是字符串',arow);
            is_ok=false;
        }
        
        if (arow.length<2){ //内容为空，或者只有名称 - 保留注释
            console.log('error','元素至少要2个',arow);
            is_ok=false;
        }
        for (let blxl=1,lent=arow.length;blxl<lent;blxl++){
            if (Array.isArray(arow[blxl])){
                if (arow[blxl].length!==2){
                    console.log('error','要求2个元素',arow,arow[blxl]);
                    is_ok=false;
                }
            } else {
                console.log('error','含有非数组元素',arow,arow[blxl]);
                is_ok=false;
            }
        }
    }
    
    if (is_ok){
        console.log('检验无误');
    }

    if (label_position==''){
        label_position='nw';
    }
    if (cstime){
        for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
            if (Array.isArray(cslist[blxl]) && cslist[blxl].length==2){    //如果只有两个元素，第一个是名称，第二个是年份和数值，则与其他含有更多记录的线条同时出现时，日期格式失效 - 保留注释
                //只能是数字，不能加年份和字符 - 保留注释
                cslist[blxl][1][0]=date_2_ymd_b(cslist[blxl][1][0],cstype);
                cstime=false;
            }
        }
    }
    var only_one_data=true;
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
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
    for (let blxl=0,lent=cslist.length;blxl<lent;blxl++){
        var label_t=cslist[blxl].shift();
        var label_showline=csshowline;
        var label_showpoints=true;
        if (label_t.includes('#show:true#')){
            label_showline=true;
            label_t=label_t.replace('#show:true#','');
        } else if (label_t.includes('#show:false#')){
            label_showline=false;
            label_t=label_t.replace('#show:false#','');
        }
        if (label_t.includes('#points:true#')){
            label_showpoints=true;
            label_t=label_t.replace('#points:true#','');
        } else if (label_t.includes('#points:false#')){
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
                symbol: flot_rand_flot_symbol_b() 
            }
        });
    }
    
    if (y1dec==-1 || only_one_data){
        var blyaxes=[
            {
                tickFormatter: function (v, axis){return v.toFixed(axis.tickDecimals) + y1unit;}
            }, 
        ];
    } else {
        var blyaxes=[
            {
                tickFormatter: function (v, axis){return v.toFixed(y1dec) + y1unit;}
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
            [oneyear2,onemonth2]=isoneyear_isonemonth_b(item);
            oneyear=oneyear && oneyear2;
            onemonth=onemonth && onemonth2;
        }
        
        cstimeformat=flot_timeformat_b(cstimeformat,cstype,oneyear,onemonth);
        
        oxaxis['mode']='time';
        if (cstimeformat!==''){
            oxaxis['timeformat']=cstimeformat;
        }
        if (cstickSize.length!==0){
            oxaxis['tickSize']=cstickSize;
        }
        
        $.plot('#'+csid, chart_data,{legend: { position: label_position }, xaxis: oxaxis, yaxis:oyxaxis, yaxes:blyaxes});
    } else {
        $.plot('#'+csid, chart_data,{legend: { position: label_position }, xaxis: oxaxis, yaxis:oyxaxis, yaxes:blyaxes});
    }
}

function flot_rand_flot_symbol_b(){
    var sym_t=['circle', 'square', 'diamond', 'triangle', 'cross', ];
    sym_t.sort(randomsort_b);
    return sym_t[0];
}

function flot_pie_b(chart_data,csid,label_radius=11/15){
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
                    formatter: flot_labelFormatter_b,
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

function flot_labelFormatter_b(label, series){
    return "<div class='div_flot_pie_label'>" + label + "<br/>" + (series.percent).toFixed(2) + "%</div>";
}

function flot_import_js_b(cslist=[],isdefer=false,write_or_dom='write'){
    var blpath=location.href;
    if (blpath.includes('/klwebphp/')){
        blpath=blpath.split('/klwebphp/')[0];
        blpath=blpath+'/klwebphp/PythonTools/data/selenium_news/module/flot/';
    } else {
        blpath=location.href.split('//')[0]+'//'+location.host+'/module/flot/';
    }
    var defer_str=(isdefer?'defer':'');

    var result_t=[];
    result_t.push(['js',blpath+'jquery.flot.min.js',defer_str]);
    for (let item of cslist){
        result_t.push(['js',blpath+'jquery.flot.'+item+'.min.js',defer_str]);
    }
    if (write_or_dom=='write'){
        write_js_css_b(result_t);
    } else if (write_or_dom=='dom'){
        file_dom_create_b([result_t[0]],true,'js');
        if (result_t.length>1){        
            load_var_b('$.plot.plugins',function (){file_dom_create_b(result_t.slice(1,),true,'js');});
        }
    }
    return result_t;
}

function statistics_dir_file_count_b(){
    if (is_local_b(false)==false){return [];}
    var fname=klwebphp_path_b('data/klwiki/dir_file_count.csv');
    if (fname==false){return [];}

    var category_list={'klmusic':'klmusic','待整理照片':'photos_to_do','album':'album','gpx_pb':'gpx_pb','jsdoc3':'jsdoc3'};
    var result_t=[];
    for (let key in category_list){
        var list_t=read_txt_file_b(fname).match(new RegExp('\\/'+key+'\\/,\\d{4}-\\d{2}-\\d{2},\\d+,\\d+$','mg')) || [];
        
        var dir_file_count_list=[];
        for (let item of list_t){
            var bldate=item.replace(/^.*,(\d{4}-\d{2}-\d{2}),.*$/g,'$1');
            var blcount=item.replace(/^.*,\d{4}-\d{2}-\d{2},(\d+),.*$/g,'$1');
            if (!dir_file_count_list.includes(bldate+'/'+blcount)){
                dir_file_count_list.push(bldate+'/'+blcount);
            }
        }
        dir_file_count_list.sort().reverse();
        result_t.push([key,category_list[key],dir_file_count_list]);
    }
    return result_t;
}

function statistics_old_code_b(){
    if (is_local_b(false)==false){return [];}
    var fname=klwebphp_path_b('PythonTools/data/code_search/old_code_file_data.txt');
    if (fname==false){return [];}
    var list_t=read_txt_file_b(fname).match(/^.*?全部代码文件个数：\d+；行数：\d+；/mg) || [];
    var result_t=[];
    
    for (let item of list_t){
        var bldate=item.trim().split(' ')[0];
        var blcount=item.replace(/^.*?全部代码文件个数：(\d+)；.*$/g,'$1');
        var bllines=item.replace(/^.*?行数：(\d+)；.*$/g,'$1');
        if (!result_t.includes(bldate+'/'+blcount+'/'+bllines)){
            result_t.push(bldate+'/'+blcount+'/'+bllines);
        }
    }
    result_t.sort().reverse();
    return result_t;
}

function statistics_data_type_b(data_type,selected_items_filter=''){
    var idlist=[];
    switch (data_type){
        case 'enwords':
            idlist=[
            ['enwords_statistics','单词累计',0,'/'],
            ['enwords_recent_statistics','最近记忆单词',0,'/'],
            ['enwords_plan_per_day','每日须记忆单词',3,'/'],   //小数点3位 - 保留注释
            ['enwords_days_last_row_minus_one','-1所需的额外记忆单词量',0,'/'],
            ['enwords_recent_bookmark_position','最近记忆单词bookmark位置',0,'/'],
            ['enwords_non_ensentence','无例句单词',0,'/'],
            ['enwords_rare_ensentence','当前例句最少单词',0,'/'],
            ['estimated_rare_words_count','例句最少单词年内预估',0,'/'],
            ['words_in_sentence_set_global_count','例句words_in_sentence_set_global元素个数',0,'/'],
            ['all_def_new_words_count','全部释义中的新单词数',0,'/'],
            ['rare_words_in_old_words_percent','例句最少单词占比',2,'/'],
            ['estimated_rare_words_percent','例句最少单词占比年内预估',2,'/'],
            ['enwords_one_source_ensentence','例句出处唯一的单词',0,'/'],
            ['selenium_enwords_articles','selenium英语单词文章链接数',0,'/'],
            ['enwords_selenium_new_words','selenium 新单词数',0,'/'],
            ['all_new_words_statistics','全部新单词',0,'/'],
            ['new_hot_words_count_statistics','常见新单词',0,'/'],
            ['enwords_sentence_rows','例句行数',0,'/'],
            ['new_words_in_sentences','例句中的新单词',0,'/'],
            ['en_article_statistics','文章数',0,': '],
            ['klwiki_en2_rows','klwiki_en2 行数',0,'/'],
            ['enwords_articles_without_eword','无eword的KLWiki文章数',0,'/'],            
            ['enwords_articles_avg_new_words','KLWiki文章平均生词数',0,'/'],            
            ['enwords_has_phrase','有词组的旧单词',0,'/'],
            ];
            break;
        case 'miscellaneous':
            idlist=[
            ['readlater_statistics','ReadLater 信息条数',0,': '],
            ['booklist_statistics','txt书籍数',0,'/'],
            ['offline_file_browser_statistics','移动硬盘文件数',0,' / ',1],    //末尾是列号 - 保留注释
            ['offline_file_browser_statistics','移动硬盘文件大小(GB)',2,' / ',2],
            ['offline_file_browser_statistics','移动硬盘文件时长(小时)',3,' / ',3],
            ['gpx_file_statistics','GPX文件数',0,'/',2],
            ['local_storage_used_length','local storage 使用量(KiB)',2,':'],
            ['klwiki_submit_failure','KLWiki submit 失败次数',0,':'],
            ];
            
            var old_code_list=statistics_old_code_b();
            if (old_code_list.length>0){
                idlist.push([old_code_list,'全部代码文件个数',0,'/',1,'old_code_count']);
                idlist.push([old_code_list,'全部代码行数',0,'/',2,'old_code_lines']);
            }
            
            var dir_file_count_list=statistics_dir_file_count_b();
            for (let item of dir_file_count_list){
                if (item[2].length>0){
                    idlist.push([item[2],item[0]+'文件数',0,'/',1,item[1]]);
                }
            }
            break;
    }
    
    if (selected_items_filter!==''){
        var is_reg=false;
        [selected_items_filter,is_reg]=str_reg_check_b(selected_items_filter,is_reg);
        var result_t=[];
        for (let item of idlist){
            var blfound=str_reg_search_b(item,selected_items_filter,is_reg);
            if (blfound==-1){break;}
            
            if (blfound){
                result_t.push(item);
            }
        }
        return result_t;
    }
    return idlist;
}

function statistics_idlist_format_b(idlist){
    var result_t=[];
    for (let item of idlist){
        bllen=item.length;
        if (bllen==0){continue;}
        var is_arr=Array.isArray(item[0]);
        
        if (bllen<2){
            if (is_arr){
                item.push('unnamed');
            } else {
                item.push(item[0]);
            }
        }
        if (bllen<3){
            item.push(0);
        }
        if (bllen<4){
            item.push('/');
        }
        if (bllen<5){
            item.push(1);
        }
        if (bllen<6){
            if (is_arr){
                item.push('unnamed');
            } else {
                item.push(item[0]);
            }
        }
        result_t.push(item);
    }
    return result_t;
}

function statistics_div_idname_b(item,csxl){
    return 'div_progress_'+item[5]+'_'+csxl;
}

function statistics_mini_b(cskey='',csreg=false,csmax=-1){
    [cskey,csreg]=str_reg_check_b(cskey,csreg);

    var data_type=['enwords','miscellaneous'];
    
    var idlist=[];
    for (let one_type of data_type){
        idlist=idlist.concat(statistics_data_type_b(one_type));
    }
    
    idlist=statistics_idlist_format_b(idlist);
    idlist.sort(function (a,b){return zh_sort_b(a,b,false,1);});
    
    var result_t=[];
    for (let blxl=0,lent=idlist.length;blxl<lent;blxl++){
        var item=idlist[blxl];
        var blfound=str_reg_search_b(item,cskey,csreg);
        if (blfound==-1){break;}
        if (blfound==false){continue;}

        if (Array.isArray(item[0])){
            var list_t=item[0];
            if (csmax>0){
                list_t=list_t.slice(0,csmax);
            }
        } else {
            var list_t=local_storage_get_b(item[0],csmax,true);
        }
        
        var value_col=(item.length>=5?item[4]:1);

        var date_value_list=[];
        for (let arow of list_t){
            arow=arow.split(item[3]);
            if (arow.length<value_col+1){continue;}
            arow[value_col]=parseFloat(arow[value_col]);
            date_value_list.push([arow[0],arow[value_col],'']);
        }
        
        for (let blno=0,lenb=date_value_list.length;blno<lenb-1;blno++){
            date_value_list[blno][2]=(date_value_list[blno][1]-date_value_list[blno+1][1]).toFixed(item[2]);
        }
        
        for (let blno=0,lenb=date_value_list.length;blno<lenb;blno++){        
            date_value_list[blno]='<tr><td>'+date_value_list[blno][0]+'</td><td align=right>'+date_value_list[blno][1]+'</td><td align=right>'+date_value_list[blno][2]+'</td></tr>';
        }
        
        result_t.push('<tr><td colspan=3><b>'+item[1]+'</b></td></tr>\n'+date_value_list.join('\n'));
    }
    return '<table class="table_common">'+result_t.join('')+'</table>';
}

function statistics_draw_b(data_type,idname='divhtml',show_table=false,date_min=false,date_max=false,max_lines=false,cols=2,section_w='810px',table_w='125%',div_h='500px',add_today=false,selected_items_filter='',flot_type=''){
    function sub_statistics_draw_b_oneline(arow){
        var csname=arow[0];
        var cscaption=arow[1];
        var fraction_len=arow[2];
        var delimiter=arow[3];
        var value_col=(arow.length>=5?arow[4]:1);
        
        var result_t=[];
        var flot_list=[];
        [result_t,flot_list]=date_rows_tr_generate_b(csname,100,[15,0,0.5],fraction_len,delimiter,value_col,date_min,date_max,max_lines,add_today).slice(1,3);

        var bljg='';
        if (result_t.length>0){
            bljg='<table border=1 cellspacing=0 cellpadding=0 style="margin:1rem 0rem;"><tr><th  style="padding:0.2rem;" nowrap>日期</th><th  style="padding:0.2rem;" nowrap>'+cscaption+'</th><th style="padding:0.2rem;" nowrap>Δ</th></tr>'+result_t.join('\n')+'</table>';
        }
        return [bljg,[cscaption].concat(flot_list)];
    }
    
    function sub_statistics_draw_b_flot_div(item,csxl,cswidth,csheight,is_relative=false){
        return '<div style="'+(is_relative?'position:relative;float:left;':'')+'width:'+cswidth+';height:'+csheight+';" id="'+statistics_div_idname_b(item,csxl)+'" class="div_statistics_plot_b"></div>';
    }
    //-----------------------
    var t0=performance.now();    
    var bljg='';
    var str_t, oneline_list;
    var lines_list=[];
    var ismobile=ismobile_b();
    
    var odiv=document.getElementById(idname);
    var orect=odiv.getBoundingClientRect();
    var blwidth=(ismobile?orect.width:orect.width/cols);
    var blheight=blwidth*2/3;
    
    if (Array.isArray(data_type)){
        var idlist=data_type;
    } else {
        var idlist=statistics_data_type_b(data_type,selected_items_filter);
    }
    
    idlist=statistics_idlist_format_b(idlist);
    //idlist 元素形如：[ [ "2021-07-04/543/100640", "2021-07-11/555/100954", … ], "全部代码文件个数", 0, "/", 1, "old_code_count" ] - 保留注释
    //或形如：[ "local_storage_used_length", "local storage 使用量(KiB)", 2, ":", 1, "local_storage_used_length" ] - 保留注释

    var lent=idlist.length;
    if (show_table){
        for (let blxl=0;blxl<lent;blxl++){
            var item=idlist[blxl];
            [str_t,oneline_list]=sub_statistics_draw_b_oneline(item);
            if (ismobile){
                bljg=bljg+'<section style="width:'+section_w+';overflow:auto;">';
            }
            bljg=bljg+'<table width='+table_w+'><tr><td valign=top width=1 height=50%>'+str_t+'</td><td valign=top width=99%>'+sub_statistics_draw_b_flot_div(item,blxl,'100%',div_h,false)+'</td></tr></table>';//table 的 width 可以大于 100% - 保留注释
            if (ismobile){
                bljg=bljg+'</section>';
            }
            lines_list.push(oneline_list);
        }
    } else {
        for (let blxl=0;blxl<lent;blxl++){
            var item=idlist[blxl];
            [str_t,oneline_list]=sub_statistics_draw_b_oneline(item);
            bljg=bljg+sub_statistics_draw_b_flot_div(item,blxl,blwidth+'px',blheight+'px',true);
            lines_list.push(oneline_list);
        }
    }

    if (flot_type!==''){
        if (show_table){
            bljg=bljg+sub_statistics_draw_b_flot_div(['','','','','',flot_type],-1,'100%',div_h,false);
        } else {
            bljg=bljg+sub_statistics_draw_b_flot_div(['','','','','',flot_type],-1,blwidth+'px',blheight+'px',true);
        }
    }
    
    odiv.innerHTML=bljg;
    
    var flot_1y_2y=[];
    for (let blxl=0,lent=idlist.length;blxl<lent;blxl++){
        var item=idlist[blxl];
        flot_1y_2y.push([].concat(lines_list[blxl]));
        flot_lines_b([lines_list[blxl]],statistics_div_idname_b(item,blxl),'nw',true,'','d','',item[2],[1, 'day'],7);
    }
    
    switch (flot_type){
        case '1y':
            flot_lines_b(flot_1y_2y,statistics_div_idname_b(['','','','','',flot_type],-1),'nw',true,'','d','',item[2],[1, 'day'],7);
            break;
        case '2y':
            flot_two_lines_two_yaxis_b(flot_1y_2y.slice(0,2),statistics_div_idname_b(['','','','','',flot_type],-1),'','','nw',true,'d');
            break;
    }
    console.log('statistics_draw_b() 费时：'+(performance.now() - t0) + ' milliseconds');    
    return idlist;
}

function flot_legend_select_b(id_name){
    return '<select id="'+id_name+'"><option>nw</option><option>ne</option><option>sw</option><option>se</option></select> '        
}

function canvas_lines_color_get_b(){
    return ['dodgerblue','pink','green','purple','tomato','red'];
}

function canvas_lines_chart_b(cslines,popup_id){
    var min_data,max_data;
    [min_data,max_data]=arr_max_min_get_b(cslines,0,0,false,true);
    console.log('min_data',min_data,'max_data',max_data);
    var minValue,maxValue;
    [minValue,maxValue]=arr_max_min_get_b(cslines,0,1);
    console.log('minValue',minValue,'maxValue',maxValue);
    
    var bljg='<canvas width=200 height=100></canvas>';
    popup_event_div_b(event,popup_id,bljg);
    
    var ocanvas = document.querySelector('#'+popup_id+' canvas');
    var ctx = ocanvas.getContext('2d');
    
    for (let one_line of cslines){
        if (one_line[0][0][0]>min_data){
            one_line[0]=[[min_data,null]].concat(one_line[0]);
        }
        if (one_line[0][one_line[0].length-1][0]<max_data){
            one_line[0].push([max_data,null]);
        }
        canvas_one_line_chart_b(ocanvas,ctx,one_line[0],true,minValue,maxValue,2,one_line[1],1.5);
    }
}

function canvas_one_line_chart_b(ocanvas,ctx=false,csdata=[],str2date=true,minValue=false,maxValue=false,csmargin=2,csline_color='blue',csline_width=1.5){
    function sub_canvas_one_line_chart_b_point(csxl){
        var blvalue=result_t[csxl][1];
        if (blvalue==null || isNaN(blvalue)){return [false,false];}
        
        var x = csmargin + csxl * (graphWidth / (lent - 1));
        var y = csmargin+graphHeight - (blvalue / maxValue) * graphHeight;    
        //用 margin+graphHeight 作为Y轴的起点，是因为Y轴是从顶部向下增加的 - 通义千问
        return [x,y];
    }
    
    //csdata 元素形如：['2023-01-01', 20] - 保留注释
    //多次执行 canvas_one_line_chart_b 函数，则 csdata 元素个数应当一样 - 保留注释
    if (csdata.length==0){return;}
    
    if (typeof ocanvas == 'string'){
        ocanvas=document.querySelector(ocanvas);
    }
    if (!ocanvas){return;}
    
    if (ctx==false){
        ctx = ocanvas.getContext('2d');
    }

    // 定义一些变量
    var graphWidth = ocanvas.width - 2 * csmargin;
    var graphHeight = ocanvas.height - 2 * csmargin;

    var result_t=[].concat(csdata);
    if (str2date){
        for (let blxl = 0, lent=result_t.length; blxl < lent; blxl++){
            result_t[blxl][0]=validdate_b(result_t[blxl][0]);
        }
    }
    
    result_t=date_list_insert_zero_b(result_t,false,false,[],[],null);
    var lent=result_t.length;
    if (minValue===false || maxValue===false){
        var value_list=arr_max_min_get_b([result_t]);
        if (value_list[0]===false){return;}
        
        if (minValue===false){
            minValue = value_list[0];//Math.min(...value_list); // 最小值
        }
        if (maxValue===false){
            maxValue = value_list[1];//Math.max(...value_list); // 最大值用于比例计算
        }
    }
    
    if (minValue<0){
        for (let blxl = 0; blxl < lent; blxl++){
            if (result_t[blxl][1]==null || isNaN(result_t[blxl][1])){continue;}        
            result_t[blxl][1]=result_t[blxl][1]-minValue;
        }
        maxValue=maxValue-minValue;
    }
    
    //如果 maxValue 为 0，则会导致除法运算中的 NaN - 保留注释
    if (maxValue==0){return;}

    // 清空画布
    //ctx.clearRect(0, 0, ocanvas.width, ocanvas.height);

    // 绘制折线图
    ctx.beginPath();
    
    var blstart=0;
    var x,y;
    for (let blxl = 0; blxl < lent; blxl++){
        [x,y]=sub_canvas_one_line_chart_b_point(blxl);
        if (x===false){continue;}
        ctx.moveTo(x,y);
        blstart=blxl+1;
        break;
    }
    
    for (let blxl = blstart; blxl < lent; blxl++){
        [x,y]=sub_canvas_one_line_chart_b_point(blxl);
        if (x===false){continue;}        
        ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = csline_color;
    ctx.lineWidth = csline_width;
    ctx.stroke();
}

function year_dict_2_2000_b(year_t,cscaption='',line_type=''){
    var flot_arr=[];
    for (let key in year_t){
        var lent=year_t[key].length;
        if (lent<=1){continue;}
        for (let blxl=0;blxl<lent;blxl++){
            year_t[key][blxl][0].setFullYear(2000);
        }
        
        year_t[key]=[key.substring(2,)+'年'+cscaption+line_type].concat(year_t[key]);
        //key 形如 'y_2023' - 保留注释
        flot_arr.push(year_t[key]);
    }
    flot_arr.sort(function (a,b){return a[0]<b[0]?-1:1;});
    return flot_arr;
}

function multi_dots_b(ocanvas,cscount,border_color='black',bg_color='white',dot_color='blue',csradius=1){
    //以下2行保留，用法：
    //<canvas id="canvas" width="450" height="150"></canvas>
    //<script>multi_dots_b(document.getElementById('canvas'),56,'blue','green','ivory',3);</script>
    
    const ctx = ocanvas.getContext('2d');

    if (bg_color!==false){
        ctx.fillStyle = bg_color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (border_color!==false){    
        ctx.strokeStyle = border_color;
        ctx.strokeRect(0, 0, ocanvas.width, ocanvas.height);
    }
    
    // Calculate the positions of cscount points
    const points = [];
    const rows = Math.ceil(Math.sqrt(cscount));
    const cols = Math.ceil(cscount / rows);
    
    for (let blx = 0; blx < rows; blx++){
        for (let bly = 0; bly < cols; bly++){
            if (points.length >= cscount){break;}
            
            const px = (bly + 0.5) * (ocanvas.width / cols); 
            //如果不加 0.5 ，点的坐标会直接对齐到网格的左上角
            //这样会导致所有点集中在每个网格单元的左上角，分布不均匀。
            //0.5 表示网格单元的一半。通过偏移半个单元，可以确保点位于网格的正中心，从而实现均匀分布。
            const py = (blx + 0.5) * (ocanvas.height / rows);
            points.push([px, py]);
        }
    }
    
    // Draw the points
    ctx.fillStyle = dot_color;
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], csradius, 0, Math.PI * 2); //绘制半径为2的圆 - 保留注释
        ctx.fill();
    });
}

function canvas_nn_line_chart_b(canvas,dataX,dataY,padding=30){
    // 缩放x轴坐标到canvas尺寸
    function sub_canvas_nn_line_chart_scale_x(x){
        var max = Math.max(...dataX);
        return (x / max) * width;
    }

    // 缩放y轴坐标到canvas尺寸，并且因为canvas的y轴向下为正方向，所以需要做相应的调整
    function sub_canvas_nn_line_chart_scale_y(y){
        return height - ((y - minY) / (maxY - minY)) * height + padding;
    }

    var ctx = canvas.getContext('2d');

    // 找到y轴的最大值和最小值以确定比例
    var maxY = Math.max(...dataY);
    var minY = Math.min(...dataY);
    
    // 定义一些用于缩放和平移的变量
    var width = canvas.width - 2 * padding;
    var height = canvas.height - 2 * padding;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

    // 开始路径
    ctx.beginPath();
    ctx.moveTo(padding + sub_canvas_nn_line_chart_scale_x(dataX[0]), sub_canvas_nn_line_chart_scale_y(dataY[0]));

    for (let blxl = 1; blxl < dataX.length; blxl++){
        ctx.lineTo(padding + sub_canvas_nn_line_chart_scale_x(dataX[blxl]), sub_canvas_nn_line_chart_scale_y(dataY[blxl]));
    }

    // 设置线条样式并绘制
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#007bff';
    ctx.stroke();
}
