function infer_role_mpg(goal){
    var r = document.getElementById('input_role_mpg').value.trim();
    if (r){
        return r;
    }
    
    var map = {
    '资深内容策划与文案编辑':['写','文案','文章','稿','故事',],
    '资深软件工程师':['代码','程序','函数','bug','重构','SQL',],
    '数据分析师':['数据','图表','统计','分析','指标',],
    '专业译者':['翻译','本地化',],
    '学科领域研究员':['论文','摘要','学术','文献',],
    '职业规划与招聘专家':['简历','面试','求职',],
    '增长营销专家':['营销','投放','增长',],
    '资深设计师':['设计','配色','排版','UI',],
    '法务顾问':['合同','法务','合规','法律',],
    '财务与投研分析师':['理财','投资','基金','财报',],
    '资深教师':['教案','讲解','启蒙','辅导','孩子',],
    '用户研究员':['调研','问卷','访谈','用户',],
    };
    
    var result_t=[];
    for (let k in map){
        for (let acol of map[k]){
            if (goal.includes(acol)){
                result_t.push([k,acol.length]);
            }
        }
    }
    result_t.sort(function (a,b){return a[1]>b[1]?-1:1;});
    if (result_t.length>0){
        return result_t[0][0];
    }
    return '该领域的资深从业者';
}

function val_mpg(id){
    return document.getElementById(id).value.trim();
}

function render_mpg(){
    var goal = val_mpg('textarea_goal_mpg');
    if (!goal){
        alert('请先填写「我想让 AI 做什么」');
        return;
    }

    var domain = val_mpg('input_domain_mpg');
    var role = infer_role_mpg(goal);
    var aud = val_mpg('input_audience_mpg') || '目标读者';
    var tone = document.getElementById('select_tone_mpg').value;
    var format = document.getElementById('select_format_mpg').value;
    var len = document.getElementById('select_len_mpg').value;

    var constr = [];
    document.querySelectorAll('.span_chips_mpg.on').forEach(function (c){
        if (c.dataset.v !== undefined){
            constr.push(c.dataset.v); 
        }
    });
    
    if (val_mpg('input_extra_mpg')){
        constr.push(val_mpg('input_extra_mpg'));
    }
    constr.push('语气风格：' + tone);
    constr.push('篇幅：' + len);
    constr.push('输出语言：中文（专有名词可保留英文）');
    
    var neg = [
    '不要堆砌空洞套话，每条观点都要有依据或示例支撑。',
    '不要偏离用户真实意图过度发挥；先澄清关键歧义，再作答。',
    '不要输出与请求无关的背景科普、免责声明或客套寒暄。',
    '不要编造具体数据、人名、引文；不确定处标注「待核实」。',
    '不要使用「以下是一些建议」这类无效开头，直接给结论与内容。'
    ];

    var lines = [];
    lines.push('# 角色');
    lines.push('你是' + role + (domain ? '，长期深耕「' + domain + '」方向' : '') + '。你具备扎实的专业知识与丰富的实操经验，表达精准、逻辑清晰。');
    lines.push('');
    lines.push('# 任务');
    lines.push('请完成以下工作：' + goal);
    lines.push('');
    lines.push('# 上下文与受众');
    lines.push('- 使用场景：' + (domain || '通用'));
    lines.push('- 目标受众：' + aud);
    lines.push('- 受众已有认知：' + '【受众背景，如：具备基础常识，不需从零科普】');
    lines.push('');
    lines.push('# 执行步骤');
    lines.push('1. 复述并确认任务：用一句话重述目标，标出不确定项。');
    lines.push('2. 拆解要求：把目标拆成 3-5 个可执行子任务。');
    lines.push('3. 执行产出：按指定格式逐条完成，保证事实准确、逻辑连贯。');
    lines.push('4. 自检：检查是否遗漏约束、是否违反负面约束，必要时补正。');
    lines.push('');
    lines.push('# 约束条件');
    constr.forEach(function (c, i) { lines.push((i + 1) + '. ' + c); });
    lines.push('');
    lines.push('# 输出格式');
    lines.push('请以「' + format + '」形式组织回答，结构层次清晰、标题与要点分明，可直接交付使用。');
    lines.push('');
    lines.push('# 负面约束（禁止项）');
    neg.forEach(function (n, i) { lines.push((i + 1) + '. ' + n); });
    lines.push('');
    lines.push('---');
    lines.push('现在开始。若任务存在关键歧义（如范围、对象、时间点不明确），请先提出不超过 3 个澄清问题，再作答。');

    document.getElementById('pre_out_mpg').textContent = lines.join('\n');
}

function copy_mpg(){
    var t = document.getElementById('pre_out_mpg').textContent;
    copy_2_clipboard_b(t);
}

function reset_mpg(){
    ['textarea_goal_mpg', 'input_domain_mpg', 'input_role_mpg', 'input_audience_mpg', 'input_extra_mpg'].forEach(function (id) { document.getElementById(id).value = ''; });
    document.getElementById('select_tone_mpg').value = '专业严谨';
    document.getElementById('select_format_mpg').value = '分条要点';
    document.getElementById('select_len_mpg').value = '适中（500 字左右）';
    document.querySelectorAll('.span_chips_mpg').forEach(function (c) { c.classList.remove('on'); });
    document.getElementById('pre_out_mpg').textContent = '（填写上方需求后点击「生成提示词」）';
}

// 示例被点击时，随机化语气、输出结构、篇幅与补充约束，再生成
function ex_mpg(el){
    reset_mpg();
    
    var tones = ['专业严谨', '通俗易懂', '简洁干练', '生动有趣', '学术规范'];
    var fmts = ['分条要点', 'Markdown 报告', '表格对比', '步骤清单', '邮件 / 公文', '代码'];
    var lens = ['精简（200 字内）', '适中（500 字左右）', '详尽（1000 字以上）'];

    document.getElementById('select_tone_mpg').value = pick_mpg(tones);
    document.getElementById('select_format_mpg').value = pick_mpg(fmts);
    document.getElementById('select_len_mpg').value = pick_mpg(lens);

    document.querySelectorAll('.span_chips_mpg').forEach(function (c){
        c.classList.toggle('on', Math.random() < 0.4);
    });

    document.getElementById('textarea_goal_mpg').value = el.textContent;
    render_mpg();
}

function pick_mpg(arr){
    if (!arr || !arr.length){return '';}
    return arr[Math.floor(Math.random() * arr.length)];
}
