function pie_data_study_flot(){
    return [
        { label: 'Series1',  data: 10},
        { label: 'Series2',  data: 30},
        { label: 'Series3',  data: 90},
        { label: 'Series4',  data: 70},
        { label: 'Series5',  data: 80},
    ];
}

function pie_simple_study_flot(){
    $.plot("#td_flot", pie_data_study_flot(), {
        series: {
            pie: { show: true }
        }
    });
}

function pie_rectangle_study_flot(){
    $.plot("#td_flot", pie_data_study_flot(), {
        series: {
            pie: { show: true, radius: 9999 }
        }
    });
}

function pie_donut_study_flot(){
    $.plot("#td_flot", pie_data_study_flot(), {
        series: {
            pie: { show: true, innerRadius: 0.8 }
        }
    });
}

function pie_interactive_study_flot(){
    $.plot("#td_flot", pie_data_study_flot(), {
        series: {
            pie: { show: true, innerRadius: 0.5 }
        },
        grid: { hoverable: true, clickable: true }
    });
    document.getElementById("td_interactive_info").setAttribute('align','center');

    $("#td_flot").bind("plothover", function(event, pos, obj){
        if (!obj){return;}
        var blpercent = parseFloat(obj.series.percent).toFixed(2);
        document.getElementById("td_interactive_info").innerHTML="<span style='font-weight:bold; color:" + obj.series.color + "'>" + obj.series.label + " (" + blpercent + "%)</span>";
    });
            
    $("#td_flot").bind("plotclick", function(event, pos, obj){
        if (!obj){return;}
        var blpercent = parseFloat(obj.series.percent).toFixed(2);
        alert(obj.series.label + ": " + blpercent + "%");
    });    
}

function line_sin_cos_study_flot(){
    var d1=[];
    var d2=[];
    for (let blxl=0; blxl<8;blxl += 0.1){
        d1.push([blxl, Math.sin(blxl)]);
        d2.push([blxl, Math.cos(blxl)]);
    }
    $.plot("#td_flot", [d1,d2]);
}

function line_two_axes_study_flot(){
    var cslist1=[[2019, 100],[2020, 300]];
    var cslist2=[[2019, 50],[2020, 50]];
    var cslist3=[[2019, 20],[2020, -30],[2021,80]];
    
    var dataset = [
        { label: 'AA', data: cslist1, lines: {show: true}, points: {show: true}},
        { label: 'BB', data: cslist2, lines: {show: true}, points: {show: true}},        
        { label: 'CC', data: cslist3, lines: {show: true}, points: {show: true}, yaxis: 2 },
    ];

    var oxaxis={};
    oxaxis['tickDecimals']=0;
    
    var blyaxes=[
    {
    'tickFormatter': function (v, axis){return v.toFixed(2) +'日元';},
    }, 
    {
    'tickFormatter': function (v, axis){return v.toFixed(1) + '美元';},
    'position': "right",
    }
    ];

    $.plot("#td_flot", dataset,{legend: { position: 'nw' },xaxis: oxaxis,yaxes:blyaxes});    
}

function without_xyaxis_study_flot(){
    var d1=[];
    var d2=[];
    for (let blxl=-1; blxl<=1;blxl += 0.01){
        d1.push([blxl, Math.asin(blxl)]);
        d2.push([blxl, Math.acos(blxl)]);
    }
    $.plot("#td_flot", [d1,d2],{
        xaxis: { ticks: [] },
        yaxis: { ticks: [] },
    });
}

function line_tan_study_flot(){
    var d1=[];
    for (let blxl=0; blxl<8;blxl += 0.1){
        d1.push([blxl, Math.tan(blxl)]);
    }
	$.plot("#td_flot", [d1], {
        series: {
            lines: { show: true, fill: true },
            points: { show: true },
        },
    });    
}

function line_interactive_study_flot(){
    var d1=[];
    for (let blxl=-1; blxl<5;blxl += 0.1){
        d1.push([blxl, Math.log1p(blxl)]);
    }
    
    var objplot=$.plot("#td_flot", [d1],{
        series: {
            label: "log1p(x)",
            lines: { show: true },
            points: { show: true },
        },
        grid: {hoverable: true, clickable: true }
    });    
    
    $("#td_flot").bind("plothover", function (event, pos, obj){
        var blstr = "x = " + pos.x.toFixed(2) + " y = " + pos.y.toFixed(2);
        document.getElementById("td_interactive_info").innerText=blstr;
        
        var odiv=document.getElementById("div_interactive_info");
        if (obj){
            var x = obj.datapoint[0].toFixed(2);
            var y = obj.datapoint[1].toFixed(2);
            odiv.innerHTML=" x = " + x + ' ' + obj.series.label+" = " + y;
            odiv.style.top=obj.pageY+5+'px';
            odiv.style.left=obj.pageX+5+'px';
            odiv.style.display='';
        } else {
            odiv.style.display='none';
        }
    });

    $("#td_flot").bind("plotclick", function (event, pos, obj){
        if (!obj){return;}
        document.getElementById("td_interactive_info").innerText="data index: " + obj.dataIndex + " in " + obj.series.label;
        objplot.highlight(obj.series, obj.datapoint);
    });    
}

function zoom_study_flot(){
    var d1=[];
    for (let blxl=-10; blxl<=10;blxl +=0.5){
        d1.push([blxl, Math.sinh(blxl)]);
    }
	$.plot("#td_flot", [d1], {
        series: {
            lines: { show: true },
            points: { show: true },
        },
        zoom: {interactive: true},
        pan: {interactive: true}
    });    
}

function line_steps_study_flot(){
    var d1=[];
    for (let blxl=0; blxl<200;blxl += 10){
        d1.push([blxl, Math.log10(blxl)]);
    }
	$.plot('#td_flot', [d1],{
        series:{
            lines: { show: true, steps: true },
        },
    });    
}

function bars_simple_study_flot(){
    var d1 = [[0,8],[1,-10],[4,3],[5,12],[6,18],[9,3]]; //第一个元素为数值序号 - 保留注释
	$.plot('#td_flot', [d1],{
        series: {
            label:'bars_simple',
            bars: { show: true },
        },
        xaxis: { ticks: [],},   //不显示x坐标的直 - 保留注释
    });    
}

function bars_with_name_study_flot(){
    var d1 = [ ['January', 10], ['February', -8], ['March', 4], ['April', 13], ['May', 17], ['June', 9] ];
    var d2 = [ ['January', 20], ['February', 0], ['March', 14], ['April', 3], ['May', 7], ['June', 19] ];

    $.plot('#td_flot', [ d1,d2 ], {
        series: {
            bars: {show: true, barWidth: 0.3, align: 'center'},
        },
        xaxis: {mode: 'categories', tickLength: 0}
    });
}

function line_points_study_flot(){
    var d1=[];
    var d2=[];
    for (let blxl=-20; blxl<20;blxl+=0.4){
        d1.push([blxl, blxl*blxl]);
    }
	$.plot("#td_flot", [d1],{
        series:{
            points: { show: true },
        },
    });    
}

function line_null_study_flot(){
    // A null signifies separate line segments
    var d1 = [[0, 12], [7, 10],null, [7, 2.5], [12, 5.5],null,[20,10],[30,15]];
    $.plot("#td_flot", [d1]);
}

function line_triangle_study_flot(){
    var d1 = [[2,8],[6,10],[4,3],[2,8]];
    $.plot("#td_flot", [d1]);
}

function li_filter_study_flot(cskey){
    var olis=document.querySelectorAll('ol#ol_menu li');
    obj_search_show_hide_b(olis,'',cskey,klmenu_check_b('span_reg_study',false),true);
}

function menu_study_flot(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="../module/flot/examples/index.html" onclick="'+str_t+'" target=_blank>Examples</a>',  
    '<span id="span_reg_study" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'📊','8rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_study',true);
}

function li_show_study_flot(){    
    study_flot_type_dict_global={   //全局变量，*表示显示源代码但不执行 - 保留注释
    //study_dict_start
    'bars_simple':['bars_simple_study_flot'],
    'bars_with_name':['bars_with_name_study_flot'],
    'line_interactive':['line_interactive_study_flot'],
    'line_null': ['line_null_study_flot'],    
    'line_points':['line_points_study_flot'],
    'line_sin_cos': ['line_sin_cos_study_flot'],
    'line_steps':['line_steps_study_flot'],
    'line_tan':['line_tan_study_flot'],
    'line_triangle': ['line_triangle_study_flot'],  
    'line_two_axes':['line_two_axes_study_flot'],
    'pie_donut':['pie_donut_study_flot','*pie_data_study_flot'],
    'pie_interactive':['pie_interactive_study_flot','*pie_data_study_flot'],
    'pie_rectangle':['pie_rectangle_study_flot','*pie_data_study_flot'],
    'pie_simple':['pie_simple_study_flot','*pie_data_study_flot'],
    'without_xyaxis':['without_xyaxis_study_flot'],
    'zoom':['zoom_study_flot'],
    //study_dict_end
    }
    
    var bljg=[];
    for (let item in study_flot_type_dict_global){
        bljg.push('<li><span class="span_link" onclick="run_source_study_flot(\''+item+'\');">'+item+'</span></li>');
    }
    document.getElementById('ol_menu').innerHTML=bljg.join('\n');
    current_li_value_flot_global=Object.keys(study_flot_type_dict_global)[0];
}

function run_source_study_flot(cstype,view_source=false){
    var otd=document.getElementById('td_interactive_info');
    otd.innerHTML='';
    otd.setAttribute('align','');
    $('#td_flot').unbind('plothover');
    $('#td_flot').unbind('plotclick');
    document.getElementById('div_interactive_info').style.display='none';
    
    if (! cstype in study_flot_type_dict_global){return;}
    current_li_value_flot_global=cstype;
    var fun_list=study_flot_type_dict_global[cstype];

    var otd=document.getElementById('td_flot');
    otd.innerHTML='';

    run_or_view_source_klh_b(view_source,fun_list,otd);
}

function init_study_flot(){
    document.getElementById('td_flot').style.height=body_height_flot_global*0.9+'px';
    input_with_x_b('input_search',8);        
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('td#td_study_list span.oblong_box'));        
    menu_study_flot();
    li_show_study_flot();
}
