/* 第一步：全局统计 token 频率（按空格和 - 拆分） */
function buildTokenFreq_aips() {
    const freq = {};
    ai_prompt_md_global.forEach(item => {
        const rawName = item[0] || '';
        // 按空格和 - 拆分为数组
        const tokens = rawName.split(/[\s-]+/).filter(t => t.length > 0);
        tokens.forEach(t => {
            freq[t] = (freq[t] || 0) + 1;
        });
    });
    return freq;
}

/* 获取按频率降序排列的 token 列表 */
function getSortedTokens_aips(freqMap) {
    return Object.keys(freqMap).sort((a, b) => freqMap[b] - freqMap[a]);
}

/* 解析条目：按空格和 - 拆分，统计出现次数最多的元素作为 unit 分组 */
function parseItem_aips(item, idx) {
    const [rawName, lines] = item || [];
    const text = (lines || []).join('\n');

    // 1. 按空格和 - 拆分字符串为数组
    const tokens = (rawName || '').split(/[\s-]+/).filter(t => t.length > 0);

    // 2. 提取编号（开头的纯数字，或 数字+｜ 格式）
    let no = '';
    let nameTokens = tokens;

    // 如果名称以"智能体"开头，也删除该部分
    // 情况1: "智能体"是独立的token（如 "智能体 公益诉讼..."）
    // 情况2: "智能体"是第一个token的前缀（如 "智能体公益诉讼..."）
    if (/^\d+$/.test(tokens[0] || '')) {
        // 情况A: "071 公益诉讼..." (数字+空格)
        no = tokens[0];
        nameTokens = tokens.slice(1);
    } else {
        // 情况B: "072｜生态环境..." (数字+｜)
        const m = (tokens[0] || '').match(/^(\d+)\s*[|｜]\s*(.+)$/);
        if (m) {
            no = m[1];
            nameTokens = [m[2], ...tokens.slice(1)];
        }
    }

    // 3. 按全局频率从高到低匹配，找到第一个出现在当前条目中的 token 作为 unit
    // 这样就不需要写死 UNITS，完全由数据驱动
    let unit = '其他';
    for (const freqToken of SORTED_TOKENS) {
        if (tokens.includes(freqToken)) {
            unit = freqToken;
            break;
        }
    }

    // 4. 名称 = 去掉编号和已匹配 unit token 后的剩余部分
    const nameTokensFiltered = nameTokens.filter(t => t !== unit);
    let name = nameTokensFiltered.join(' ');
    // 如果名称为空，说明 unit 把整个名字都吃掉了（如标题无分隔符"运动打卡监督员"），
    // 此时不应将该 token 视为分组 unit，恢复为"其他"并保留完整名称
    if (!name) {
        unit = '其他';
        name = nameTokens.join(' ');
    }

    // 5. 提取岗位
    const pm = text.match(/>\s*\*\*适用岗位\*\*[：:]\s*(.+)/);
    const post = pm ? pm[1].replace(/\*\*/g, '').trim() : '';

    return {rawName, name, no, unit, post, lines, text, _idx: idx,};
}

/* 处理重复标题：如有同名则在标题末尾添加(数字编号) */
function handleDuplicateNames(items) {
    const nameCount = {};
    const nameIndex = {};
    items.forEach(it => {
        const n = it.name || '';
        nameCount[n] = (nameCount[n] || 0) + 1;
    });
    items.forEach(it => {
        const n = it.name || '';
        if (nameCount[n] > 1) {
            nameIndex[n] = (nameIndex[n] || 0) + 1;
            it.name = n + '(' + nameIndex[n] + ')';
        }
    });
}

/* 分类树：按 unit 分组（不再有 field 子级） */
function buildTree_aips() {
    const root = {};
    ITEMS.forEach(it => {
        const u = it.unit || '其他';
        if (!root[u]) root[u] = [];
        root[u].push(it);
    });
    return root;
}

/* 单元素分类迁移：如果某分类只有1项，且该标题含有UNITS中某分类名，则移入该分类 */
function moveSingleItemToMatchingUnit_aips(tree) {
    // 取当前所有分类名快照（避免移动过程中集合变化）
    const initialUnits = Object.keys(tree);
    const movedItems = new Set();
    // 按分类名排序后依次处理，避免交叉移动
    initialUnits.sort().forEach(unit => {
        if (tree[unit] && tree[unit].length === 1) {
            const item = tree[unit][0];
            const itemName = item.name || '';
            // 检查标题是否包含其他分类名（排除自身）
            initialUnits.forEach(targetUnit => {
                if (targetUnit !== unit && !movedItems.has(item._idx) && itemName.includes(targetUnit)) {
                    // 从原分类移除
                    tree[unit] = tree[unit].filter(i => i !== item);
                    // 清理空分类
                    if (tree[unit].length === 0) delete tree[unit];
                    // 移入目标分类
                    if (!tree[targetUnit]) tree[targetUnit] = [];
                    tree[targetUnit].push(item);
                    // 更新 item 的 unit 属性
                    item.unit = targetUnit;
                    movedItems.add(item._idx);
                }
            });
        }
    });
}

/* 关键词筛选 */
function kwMatch_aips(it) {
    const q = state.kw.trim().toLowerCase();
    if (!q) return true;
    const hay = (it.rawName + '\n' + it.text).toLowerCase();
    return q.split(/\s+/).every(k => hay.includes(k));
}

function flattened_aips() {
    const list = [];
    UNITS.forEach(u => TREE[u].forEach(it => list.push({
        it,
        u
    })));
    return list;
}

/* 最近使用 */
function getRecent_aips() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function pushRecent_aips(it) {
    let r = getRecent_aips().filter(x => x._idx !== it._idx);
    r.unshift({
        _idx: it._idx,
        no: it.no,
        name: it.name,
        unit: it.unit,
        at: Date.now()
    });
    r = r.slice(0, MAX_RECENT);
    try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(r));
    } catch (e) {}
}

/* 渲染侧栏 */
function renderList_aips() {
    const box = document.getElementById('list');
    if (state.tab === 'recent') return renderRecent_aips(box);
    const q = state.kw.trim();
    let html = '';
    if (!q) {
        html += '<div class="group-title">分类</div>';
        UNITS.forEach(u => {
            const ucount = TREE[u] ? TREE[u].length : 0;
            const open = state.openCats.has(u);
            html += `<div class="cat${open?' on':''}" data-unit="${u}"><span class="name">${specialstr_lt_gt_j(u,true)}</span><span class="num">${ucount}</span></div>`;
            if (open) {
                // 直接渲染条目，不再渲染 field 级别的 cat 行
                TREE[u].forEach(it => {
                    html += leafHTML_aips(it);
                });
            }
        });
    } else {
        const hits = flattened_aips().filter(({
            it
        }) => kwMatch_aips(it));
        html += `<div class="group-title">关键词筛选：${hits.length} 条匹配</div>`;
        if (hits.length === 0) {
            html += `<div class="empty">未找到匹配的提示词<br><br>试试更短的关键词，如"公益诉讼""起诉书""检察建议"</div>`;
        } else {
            hits.forEach(({
                it
            }) => {
                html += leafHTML_aips(it);
            });
        }
    }
    box.innerHTML = html;
}

function leafHTML_aips(it) {
    return `<div class="leaf${state.sel===it._idx?' on':''}" data-idx="${it._idx}">
    <div class="t">${specialstr_lt_gt_j(it.name,true)}</div>
  </div>`;
}

function renderRecent_aips(box) {
    let r = getRecent_aips();
    let html = `<div class="group-title">最近选择的提示词（本地记录，最多 ${MAX_RECENT} 条）</div>`;
    if (r.length === 0) {
        html += `<div class="empty">还没有选择记录<br><br>点击左侧任意条目即可生成"最近使用"</div>`;
    } else {
        r.forEach(rx => {
            const it = ITEMS.find(x => x._idx === rx._idx) || {};
            const t = timeAgo_aips(rx.at);
            html += `<div class="recent-item" data-idx="${rx._idx}">
        <div class="t">${specialstr_lt_gt_j(rx.name || it.name, true)}<span class="hot">${t}</span></div>
        <div class="path">${specialstr_lt_gt_j(rx.unit || it.unit, true)}</div>
      </div>`;
        });
    }
    box.innerHTML = html;
}

function show_aips(idx) {
    const it = ITEMS.find(x => x._idx == idx);
    if (!it){return;}
    
    state.sel = it._idx;
    pushRecent_aips(it);
    const main = document.getElementById('main');
    main.innerHTML = `<div class="card">
    <div class="title-bar">
      <h2>${specialstr_lt_gt_j(it.name,true)}</h2>
      <button class="copy" id="copyBtn">复制提示词</button>
    </div>
    <div class="tags">
      <span>编号 ${specialstr_lt_gt_j(it.no,true)}</span>
      <span>${specialstr_lt_gt_j(it.unit,true)}</span>
      ${it.post?`<span>${specialstr_lt_gt_j(it.post, true)}</span>`:''}
    </div>
    <div class="path-line">分类路径：${specialstr_lt_gt_j(it.unit,true)}  ·  来源：${specialstr_lt_gt_j(it.rawName,true)}</div>
    <div class="markdown">${highlight_simple_b(md2html_light_md_b(it.lines), state.kw)}</div>
  </div>`;
    document.getElementById('copyBtn').onclick = () => copy_2_clipboard_b(it.lines.join('\n'),false,document.getElementById('copyBtn'),'done','复制提示词');
    // 移动端：选中后切到详情
    if (window.innerWidth <= 860){
        document.body.classList.add('split');
    }
    document.getElementById('list').querySelectorAll('.leaf').forEach(el => {
        el.classList.toggle('on', el.dataset.idx == it._idx);
    });
}

function timeAgo_aips(ts) {
    const d = Math.floor((Date.now() - ts) / 1000);
    if (d < 60) return '刚刚';
    if (d < 3600) return Math.floor(d / 60) + ' 分钟前';
    if (d < 86400) return Math.floor(d / 3600) + ' 小时前';
    if (d < 604800) return Math.floor(d / 86400) + ' 天前';
    return new Date(ts).toLocaleDateString('zh-CN');
}


