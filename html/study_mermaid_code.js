function flowchart_study_mermaid(cstyle='LR'){
    //cstyle: TD LR RL
    const data=`
    graph ${cstyle}
    A[开始] --> B{条件判断}
    B -->|是| C[执行操作甲]
    B -->|否| D[执行操作<b>乙</b>]
    C --> step4[结束]
    D --> step4
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style step4 fill:#ccf,stroke:#333,stroke-width:2px
    `;
    
    graph_generate_study_mermaid(data);
}

function sequence_diagram_study_mermaid(){
    const data=`
    sequenceDiagram
    participant 用户
    participant 前端应用
    participant 后端服务
    participant 数据库

    用户->>前端应用: 提交请求
    前端应用->>后端服务: API调用
    后端服务->>数据库: 查询数据
    数据库-->>后端服务: 返回结果
    后端服务-->>前端应用: 处理响应
    前端应用-->>用户: 显示结果
    `;
    graph_generate_study_mermaid(data);
}

function pie_study_mermaid(){
    const data=`
    pie title 编程语言使用分布
    "JavaScript" : 35
    "Python" : 25
    "Java" : 20
    "其他" : 20
    `;
    graph_generate_study_mermaid(data);
}

function gantt_study_mermaid(){
    const data=`
    gantt
    title 项目开发计划
    dateFormat YYYY-MM-DD

    section 设计阶段
    需求分析 :done, des1, 2024-01-01, 7d
    技术设计 :active, des2, after des1, 5d

    section 开发阶段
    前端开发 :dev1, after des2, 10d
    后端开发 :dev2, after des2, 12d

    section 测试阶段
    单元测试 :test1, after dev1, 5d
    集成测试 :test2, after dev2, 7d
    `;
    graph_generate_study_mermaid(data);
}

function graph_generate_study_mermaid(data){
    var otd=document.getElementById('td_mermaid');
    otd.innerHTML='';
    
    var osub=document.createElement('div'); //需要添加div，否则 td_mermaid 会被修改 - 保留注释
    osub.innerHTML=`${data}`;
    otd.appendChild(osub);
    // 重新渲染图表
    mermaid.init(undefined, osub);
}

function li_filter_study_mermaid(cskey){
    var olis=document.querySelectorAll('ol#ol_menu li');
    obj_search_show_hide_b(olis,'',cskey,klmenu_check_b('span_reg_study',false),true);
}

function menu_study_mermaid(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<a href="https://github.com/mermaid-js/mermaid" onclick="'+str_t+'" target=_blank>mermaid-js</a>',  
    '<span id="span_reg_study" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ reg</span>',
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🧜‍♀','8rem','1rem','1rem','60rem'),'','0rem')+' ');
    klmenu_check_b('span_reg_study',true);
}

function li_show_study_mermaid(){    
    study_mermaid_type_dict_global={   //全局变量，*表示显示源代码但不执行 - 保留注释
    //study_dict_start
    'flowchar':['flowchart_study_mermaid','*graph_generate_study_mermaid'],
    'gantt':['gantt_study_mermaid','*graph_generate_study_mermaid'],
    'pie':['pie_study_mermaid','*graph_generate_study_mermaid'],
    'sequence_diagram':['sequence_diagram_study_mermaid','*graph_generate_study_mermaid'],
    //study_dict_end
    }
    
    var bljg=[];
    for (let item in study_mermaid_type_dict_global){
        bljg.push('<li><span class="span_link" onclick="run_source_study_mermaid(\''+item+'\');">'+item+'</span></li>');
    }
    document.getElementById('ol_menu').innerHTML=bljg.join('\n');
    current_li_value_mermaid_global=Object.keys(study_mermaid_type_dict_global)[0];
}

function run_source_study_mermaid(cstype,view_source=false){
    var otd=document.getElementById('td_interactive_info');
    otd.innerHTML='';
    otd.setAttribute('align','');
    document.getElementById('div_interactive_info').style.display='none';
    
    if (! cstype in study_mermaid_type_dict_global){return;}
    current_li_value_mermaid_global=cstype;
    var fun_list=study_mermaid_type_dict_global[cstype];

    var otd=document.getElementById('td_mermaid');
    otd.innerHTML='';

    run_or_view_source_klh_b(view_source,fun_list,otd);
}

function init_study_mermaid(){
    document.getElementById('td_mermaid').style.height=body_height_mermaid_global*0.9+'px';
    input_with_x_b('input_search',8);        
    mouseover_mouseout_oblong_span_b(document.querySelectorAll('td#td_study_list span.oblong_box'));        
    menu_study_mermaid();
    li_show_study_mermaid();
}
