//-----------------------
//history
//0.0.1-20261022 ima (copilot)
//-----------------------
class Scale_engine_rdrank {

  constructor() {
    if (typeof CFG_rdrank === 'undefined' || typeof SCALES_rdrank === 'undefined') return;
    this.constructor_rdrank();
  }

  constructor_rdrank() {
    this.cfg_rdrank = CFG_rdrank;
    this.scales_rdrank = SCALES_rdrank;
    this.mm_seq_rdrank = 0;
    this.state_rdrank = {
      scale_key_rdrank: CFG_rdrank.default_scale,
      people_rdrank: [this.new_person_rdrank(''), this.new_person_rdrank('')],
      cur_rdrank: 0,
      idx_rdrank: 0,
      view_rdrank: ''
    };
  }

  /* ---------- 基础工具 ---------- */
  q_rdrank(sel, root) { return (root || document).querySelector(sel); }
  qa_rdrank(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  new_person_rdrank(name) { return { id_rdrank: UTIL_rdrank.pid_rdrank(), name_rdrank: name || '', ans_rdrank: {} }; }

  scale_rdrank() { return this.scales_rdrank[this.state_rdrank.scale_key_rdrank] || this.scales_rdrank[this.cfg_rdrank.default_scale]; }
  questions_rdrank() {
    const scale = this.scale_rdrank();
    const dims = (scale && scale.dims) || [];
    const flat = [];
    dims.forEach(d => {
      (d.questions || []).forEach(q => flat.push(Object.assign({}, q, { dim: d.id, dim_name: d.name })));
    });
    // 兼容：题目写在顶层 questions 数组的旧写法
    if (!flat.length && Array.isArray(scale.questions)) {
      return scale.questions.map(q => Object.assign({}, q));
    }
    return flat;
  }

  weight_of_rdrank(item) {
    const cfg = this.cfg_rdrank || {};
    let w = item && item.weight != null ? Number(item.weight) : 1;
    if (!isFinite(w) || w <= 0) w = 1;
    return UTIL_rdrank.clamp_rdrank(w, cfg.weight_floor || 0.1, cfg.weight_ceil || 5);
  }
  dims_rdrank() { return this.scale_rdrank().dims || []; }

  name_of_rdrank(i) {
    const p = this.state_rdrank.people_rdrank[i];
    const n = p && (p.name_rdrank || '').trim();
    return n || (i === 0 ? '我' : i === 1 ? 'TA' : '第 ' + (i + 1) + ' 人');
  }
  color_of_rdrank(i) { return this.cfg_rdrank.palette[i % this.cfg_rdrank.palette.length]; }

  answered_count_rdrank(p) {
    const ans = p.ans_rdrank || {};
    return this.questions_rdrank().filter(q => ans[q.id] != null).length;
  }

  scale_name_rdrank() { return this.scale_rdrank().name || ''; }

  /* ---------- 存储 ---------- */
  save_rdrank() {
    try { localStorage.setItem(this.cfg_rdrank.ls_key, JSON.stringify(this.state_rdrank)); } catch (e) {}
  }
  load_rdrank() {
    try {
      const raw = localStorage.getItem(this.cfg_rdrank.ls_key);
      if (!raw) return false;
      const o = JSON.parse(raw);
      if (!o || !Array.isArray(o.people_rdrank) || !o.people_rdrank.length) return false;
      if (!this.scales_rdrank[o.scale_key_rdrank]) return false;
      this.state_rdrank = {
        scale_key_rdrank: o.scale_key_rdrank,
        people_rdrank: o.people_rdrank.slice(0, this.cfg_rdrank.max_people).map(p => ({
          id_rdrank: p.id_rdrank || UTIL_rdrank.pid_rdrank(),
          name_rdrank: p.name_rdrank || '',
          ans_rdrank: p.ans_rdrank || {}
        })),
        cur_rdrank: o.cur_rdrank || 0,
        idx_rdrank: o.idx_rdrank || 0,
        view_rdrank: o.view_rdrank || ''
      };
      return true;
    } catch (e) { return false; }
  }

  /* ---------- 屏幕 ---------- */
  show_screen_rdrank(key) {
    ['setup', 'quiz', 'result'].forEach(k => this.q_rdrank('#scr-' + k).classList.toggle('on', k === key));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- 计分 ---------- */
  compute_rdrank(person) {
    const scale = this.scale_rdrank();
    const qs = this.questions_rdrank();
    const ans = (person && person.ans_rdrank) || {};
    const answered = qs.filter(q => ans[q.id] != null);
    const anchor = this.cfg_rdrank.full_score;

    const self = this;
    const dims = (scale.dims || []).map(d => {
      const dq = answered.filter(q => q.dim === d.id);
      let pct = null;
      if (dq.length) {
        let num = 0, den = 0;
        dq.forEach(q => {
          const w = self.weight_of_rdrank(q);
          num += (q.rev ? anchor - ans[q.id] : ans[q.id]) * w;
          den += w;
        });
        pct = den ? num / den / anchor * 100 : null;
      }
      return { id: d.id, name: d.name, short: d.short, pct: pct, n: dq.length, w: self.weight_of_rdrank(d) };
    });

    const valid = dims.filter(d => d.pct != null);
    let t_num = 0, t_den = 0;
    valid.forEach(d => { t_num += d.pct * d.w; t_den += d.w; });
    const total = t_den ? t_num / t_den : 0;
    const levels = scale.levels || [];
    const level = levels.find(l => total >= l.min) || levels[levels.length - 1] || { code: '—', name: '—', line: '' };

    const revs = answered.filter(q => q.rev).map(q => anchor - ans[q.id]);
    const rev_avg = revs.length ? UTIL_rdrank.avg_rdrank(revs) : null;

    return { dims: dims, total: total, level: level, answered: answered.length, total_q: qs.length, rev_avg: rev_avg };
  }

  /* ---------- 设置屏 ---------- */
  render_scale_picker_rdrank() {
    const keys = Object.keys(this.scales_rdrank || {});
    const field = this.q_rdrank('#scaleField');
    const box = this.q_rdrank('#scaleChips');
    if (!box) return;
    // 只有一个量表时不显示选择器
    if (keys.length <= 1) {
      box.innerHTML = '';
      if (field) field.hidden = true;
      return;
    }
    if (field) field.hidden = false;
    const cur = this.state_rdrank.scale_key_rdrank;
    box.innerHTML = Object.keys(this.scales_rdrank).map(k => {
      const s = this.scales_rdrank[k];
      const qn = (s.dims || []).reduce((n, d) => n + ((d.questions || []).length), 0) || (s.questions || []).length;
      return '<div class="chip' + (k === cur ? ' on' : '') + '" data-scale="' + k + '">' + UTIL_rdrank.esc_rdrank(s.name) +
        '<small>' + (s.dims || []).length + ' 维 · ' + qn + ' 题</small></div>';
    }).join('');
    this.qa_rdrank('[data-scale]', box).forEach(el => {
      el.onclick = () => this.switch_scale_rdrank(el.dataset.scale);
    });
  }

  switch_scale_rdrank(key) {
    if (!this.scales_rdrank[key] || key === this.state_rdrank.scale_key_rdrank) return;
    const done = this.state_rdrank.people_rdrank.some(p => this.answered_count_rdrank(p) > 0);
    if (done && !confirm('切换量表会清空当前名单中的作答记录（题目不同），继续？')) return;
    this.state_rdrank.scale_key_rdrank = key;
    this.state_rdrank.people_rdrank.forEach(p => { p.ans_rdrank = {}; });
    this.state_rdrank.cur_rdrank = 0;
    this.state_rdrank.idx_rdrank = 0;
    this.state_rdrank.view_rdrank = '';
    this.save_rdrank();
    this.render_scale_picker_rdrank();
    this.refresh_setup_rdrank();
  }

  render_people_rdrank() {
    const box = this.q_rdrank('#people');
    const total = this.questions_rdrank().length;
    const people = this.state_rdrank.people_rdrank;
    box.innerHTML = people.map((p, i) => {
      const done = this.answered_count_rdrank(p);
      const label = done === 0 ? '作答' : (done >= total ? '重答' : '继续');
      return '<div class="prow">' +
        '<span class="pdot" style="background:' + this.color_of_rdrank(i) + '"></span>' +
        '<input type="text" data-i="' + i + '" class="pname" value="' + UTIL_rdrank.esc_rdrank(p.name_rdrank) + '" placeholder="' + (i === 0 ? '我' : i === 1 ? 'TA' : '第 ' + (i + 1) + ' 人') + '" maxlength="12">' +
        '<span class="pstat">' + done + '/' + total + '</span>' +
        '<button class="mini-btn" data-act="go" data-i="' + i + '">' + label + '</button>' +
        (people.length > 2 ? '<button class="mini-btn del" data-act="del" data-i="' + i + '">×</button>' : '') +
        '</div>';
    }).join('');

    this.qa_rdrank('.pname', box).forEach(el => {
      el.oninput = e => { people[+el.dataset.i].name_rdrank = e.target.value; this.save_rdrank(); };
      el.onkeydown = e => { if (e.key === 'Enter') e.target.blur(); };
    });
    this.qa_rdrank('[data-act="go"]', box).forEach(el => {
      el.onclick = () => this.start_quiz_rdrank(+el.dataset.i);
    });
    this.qa_rdrank('[data-act="del"]', box).forEach(el => {
      el.onclick = () => {
        const i = +el.dataset.i;
        if (!confirm('删除「' + this.name_of_rdrank(i) + '」的作答记录？')) return;
        this.state_rdrank.people_rdrank.splice(i, 1);
        this.save_rdrank();
        this.refresh_setup_rdrank();
      };
    });
  }

  add_person_rdrank() {
    const inp = this.q_rdrank('#inNewName');
    const nm = inp.value.trim();
    if (this.state_rdrank.people_rdrank.length >= this.cfg_rdrank.max_people) {
      alert('最多支持 ' + this.cfg_rdrank.max_people + ' 人');
      return;
    }
    this.state_rdrank.people_rdrank.push(this.new_person_rdrank(nm));
    inp.value = '';
    this.save_rdrank();
    this.refresh_setup_rdrank();
  }

  refresh_setup_rdrank() {
    const scale = this.scale_rdrank();
    const total = this.questions_rdrank().length;
    this.q_rdrank('#pageTitle').textContent = scale.title || scale.name;
    this.q_rdrank('#pageLead').textContent = scale.lead || '';
    this.q_rdrank('#peopleLabel').firstChild.textContent = (scale.respondent_label || '参与评估的人') + ' ';
    this.q_rdrank('#qTotal').textContent = total;
    this.q_rdrank('#qMin').textContent = Math.max(2, Math.round(total * 0.12));

    this.render_people_rdrank();
    const any = this.state_rdrank.people_rdrank.some(p => this.answered_count_rdrank(p) > 0);
    this.q_rdrank('#btnView').hidden = !any;
    this.q_rdrank('#btnReset').hidden = !any;
    const next = this.state_rdrank.people_rdrank.findIndex(p => this.answered_count_rdrank(p) < total);
    const btn = this.q_rdrank('#btnStart');
    btn.textContent = next >= 0
      ? (any ? '继续作答（' + this.name_of_rdrank(next) + '）' : '开始答题')
      : '查看结果';
  }

  /* ---------- 答题屏 ---------- */
  start_quiz_rdrank(i) {
    if (i == null || i < 0 || i >= this.state_rdrank.people_rdrank.length) i = 0;
    this.state_rdrank.cur_rdrank = i;
    const qs = this.questions_rdrank();
    const ans = this.state_rdrank.people_rdrank[i].ans_rdrank;
    const first = qs.findIndex(q => ans[q.id] == null);
    this.state_rdrank.idx_rdrank = first < 0 ? 0 : first;
    this.save_rdrank();
    this.show_screen_rdrank('quiz');
    this.render_question_rdrank();
  }

  render_question_rdrank() {
    const scale = this.scale_rdrank();
    const qs = this.questions_rdrank();
    this.state_rdrank.idx_rdrank = UTIL_rdrank.clamp_rdrank(this.state_rdrank.idx_rdrank, 0, qs.length - 1);
    const idx = this.state_rdrank.idx_rdrank;
    const q = qs[idx];
    const person = this.state_rdrank.people_rdrank[this.state_rdrank.cur_rdrank];
    const ans = person.ans_rdrank || {};
    const color = this.color_of_rdrank(this.state_rdrank.cur_rdrank);

    this.q_rdrank('#quizWho').innerHTML = '<span style="color:' + color + '">●</span> ' + UTIL_rdrank.esc_rdrank(this.name_of_rdrank(this.state_rdrank.cur_rdrank));
    this.q_rdrank('#qDim').textContent = q.dim;
    const dim = this.dims_rdrank().find(d => d.id === q.dim);
    this.q_rdrank('#qSub').textContent = (dim ? dim.name : '') + (q.rev ? ' · 反向计分' : '');
    this.q_rdrank('#qTxt').textContent = q.text;
    this.q_rdrank('#qHint').textContent = q.hint || scale.anchor_hint || '';

    const labels = scale.anchors || ['0', '1', '2', '3', '4', '5'];
    const cur = ans[q.id];
    this.q_rdrank('#opts').innerHTML = labels.map((label, i) =>
      '<div class="opt' + (cur === i ? ' on' : '') + '" data-v="' + i + '"><b>' + i + '</b><small>' + UTIL_rdrank.esc_rdrank(label) + '</small></div>'
    ).join('');
    this.qa_rdrank('.opt', this.q_rdrank('#opts')).forEach(el => {
      el.onclick = () => this.answer_rdrank(+el.dataset.v);
    });

    const done = qs.filter(x => ans[x.id] != null).length;
    this.q_rdrank('#pbar').style.width = (done / qs.length * 100).toFixed(1) + '%';
    this.q_rdrank('#pCur').textContent = idx + 1;
    this.q_rdrank('#pAll').textContent = qs.length;
    this.q_rdrank('#btnDone').textContent = done === qs.length ? '看结果' : '看结果（已答 ' + done + '/' + qs.length + '）';
  }

  answer_rdrank(v) {
    const qs = this.questions_rdrank();
    const person = this.state_rdrank.people_rdrank[this.state_rdrank.cur_rdrank];
    person.ans_rdrank[qs[this.state_rdrank.idx_rdrank].id] = v;
    this.save_rdrank();
    this.render_question_rdrank();
    if (this.state_rdrank.idx_rdrank < qs.length - 1) {
      setTimeout(() => { this.state_rdrank.idx_rdrank++; this.render_question_rdrank(); }, 160);
    }
  }

  prev_question_rdrank() {
    this.state_rdrank.idx_rdrank = Math.max(0, this.state_rdrank.idx_rdrank - 1);
    this.render_question_rdrank();
  }
  next_question_rdrank() {
    const qs = this.questions_rdrank();
    if (this.state_rdrank.idx_rdrank < qs.length - 1) {
      this.state_rdrank.idx_rdrank++;
      this.render_question_rdrank();
    } else {
      this.q_rdrank('#btnDone').click();
    }
  }
  /* ================= 结果屏 ================= */
  render_tabs_rdrank() {
    const people = this.state_rdrank.people_rdrank;
    const cur = this.state_rdrank.view_rdrank;
    const tabs = people.map((p, i) => {
      const sc = this.compute_rdrank(p);
      const ok = this.answered_count_rdrank(p) > 0;
      return '<div class="ptab' + (cur === 'p' + i ? ' on' : '') + '" data-v="p' + i + '">' +
        '<i style="background:' + this.color_of_rdrank(i) + '"></i>' + UTIL_rdrank.esc_rdrank(this.name_of_rdrank(i)) +
        '<span style="opacity:.65;font-weight:400">' + (ok ? sc.total.toFixed(0) : '—') + '</span></div>';
    });
    if (people.length >= 2) tabs.push('<div class="ptab' + (cur === 'all' ? ' on' : '') + '" data-v="all">横向对比</div>');
    this.q_rdrank('#resTabs').innerHTML = tabs.join('');
    this.qa_rdrank('#resTabs .ptab').forEach(el => {
      el.onclick = () => {
        this.state_rdrank.view_rdrank = el.dataset.v;
        this.save_rdrank();
        this.render_tabs_rdrank();
        this.render_body_rdrank();
      };
    });
  }

  show_result_rdrank(view) {
    const any = this.state_rdrank.people_rdrank.some(p => this.answered_count_rdrank(p) > 0);
    if (!any) { alert('还没有作答，先答几题吧。'); return; }
    let v = view || this.state_rdrank.view_rdrank || 'p0';
    if (v.indexOf('p') === 0 && !this.state_rdrank.people_rdrank[+v.slice(1)]) v = 'p0';
    if (v === 'all' && this.state_rdrank.people_rdrank.length < 2) v = 'p0';
    this.state_rdrank.view_rdrank = v;
    this.save_rdrank();
    this.render_tabs_rdrank();
    this.render_body_rdrank();
    this.show_screen_rdrank('result');
  }

  render_body_rdrank() {
    if (this.state_rdrank.view_rdrank === 'all') return this.render_all_rdrank();
    return this.render_one_rdrank(+this.state_rdrank.view_rdrank.slice(1));
  }

  render_one_rdrank(i) {
    const scale = this.scale_rdrank();
    const person = this.state_rdrank.people_rdrank[i];
    const sc = this.compute_rdrank(person);
    const nm = this.name_of_rdrank(i);
    const body = this.q_rdrank('#resBody');

    if (!this.answered_count_rdrank(person)) {
      body.innerHTML = '<div class="note info">「' + UTIL_rdrank.esc_rdrank(nm) + '」还没有作答。<br><br>' +
        '<button class="btn ghost" id="btnGoAnswer">让 ' + UTIL_rdrank.esc_rdrank(nm) + ' 作答</button></div>';
      const b = this.q_rdrank('#btnGoAnswer');
      if (b) b.onclick = () => this.start_quiz_rdrank(i);
      return;
    }

    const cards = sc.dims.map(d => {
      const v = d.pct == null ? 0 : d.pct;
      return '<div class="dcard"><div class="n"><span>' + d.id + ' ' + UTIL_rdrank.esc_rdrank(d.name) + '</span></div>' +
        '<div class="v">' + (d.pct == null ? '—' : v.toFixed(0)) + '</div>' +
        '<div class="mini"><i style="width:' + v + '%"></i></div></div>';
    }).join('');

    body.innerHTML =
      '<div class="hero">' +
        '<div class="score">' + sc.total.toFixed(1) + '<small> /100</small></div>' +
        '<div class="herotxt">' +
          '<div class="lv"><span>' + sc.level.code + '</span>' + UTIL_rdrank.esc_rdrank(sc.level.name) + '</div>' +
          '<p>' + UTIL_rdrank.esc_rdrank(sc.level.line) + '</p>' +
          '<p class="muted">' + UTIL_rdrank.esc_rdrank(nm) + ' ' + (scale.self_label || '自评') +
            ' · 已答 ' + sc.answered + '/' + sc.total_q + ' 题 · ' + UTIL_rdrank.esc_rdrank(scale.name) +
            (scale.total_label ? ' · ' + UTIL_rdrank.esc_rdrank(scale.total_label) : '') + '</p>' +
          (scale.total_note ? '<p class="muted">' + UTIL_rdrank.esc_rdrank(scale.total_note) + '</p>' : '') +
        '</div>' +
      '</div>' +
      '<div class="sec-title">各维度得分</div>' +
      '<div class="cards">' + cards + '</div>' +
      '<div class="sec-title">雷达</div>' +
      '<div class="chart" id="chartRadar"><div class="loading">渲染中…</div></div>' +
      (this.state_rdrank.people_rdrank.length >= 2
        ? '<div class="note info">想和别人对比？切到顶部的「横向对比」，可以看到多人雷达、维度矩阵和分歧榜。</div>' : '');

    const series = [{ name_rdrank: nm, vals_rdrank: sc.dims.map(d => d.pct == null ? 0 : d.pct), color_rdrank: this.color_of_rdrank(i) }];
    this.draw_chart_rdrank(this.q_rdrank('#chartRadar'),
      this.radar_code_rdrank(series, nm + ' · ' + (scale.total_label || '得分')),
      () => this.fallback_radar_rdrank(this.q_rdrank('#chartRadar'), sc.dims, series));
  }

  render_all_rdrank() {
    const scale = this.scale_rdrank();
    const body = this.q_rdrank('#resBody');
    const all = this.state_rdrank.people_rdrank.map((p, i) => ({
      i: i, p: p, sc: this.compute_rdrank(p), name: this.name_of_rdrank(i), ok: this.answered_count_rdrank(p) > 0
    }));
    const ready = all.filter(x => x.ok);

    if (ready.length < 2) {
      body.innerHTML = '<div class="note info">至少需要两人完成作答才能横向对比。当前只有「' +
        UTIL_rdrank.esc_rdrank(ready[0] ? ready[0].name : '—') + '」有数据。<br><br>' +
        '<button class="btn ghost" id="btnGoAnswer">继续作答</button></div>';
      const b = this.q_rdrank('#btnGoAnswer');
      if (b) b.onclick = () => {
        const total = this.questions_rdrank().length;
        const idx = this.state_rdrank.people_rdrank.findIndex(p => this.answered_count_rdrank(p) < total);
        this.start_quiz_rdrank(idx < 0 ? 0 : idx);
      };
      return;
    }

    const totals = ready.map(x => x.sc.total);
    const avg_total = UTIL_rdrank.avg_rdrank(totals);
    const spread = Math.max.apply(null, totals) - Math.min.apply(null, totals);
    const highest = ready.reduce((a, b) => a.sc.total < b.sc.total ? b : a);
    const lowest = ready.reduce((a, b) => a.sc.total > b.sc.total ? b : a);

    const rows = this.dims_rdrank().map(d => {
      const vals = all.map(x => { const f = x.sc.dims.find(k => k.id === d.id); return f && f.pct != null ? f.pct : null; });
      const ok = vals.filter(v => v != null);
      return { id: d.id, name: d.name, vals: vals, w: this.weight_of_rdrank(d), gap: ok.length > 1 ? Math.max.apply(null, ok) - Math.min.apply(null, ok) : null };
    });
    const gap_list = rows.filter(r => r.gap != null).sort((a, b) => b.gap - a.gap);

    let verdict;
    if (spread <= 8) verdict = '几个人给出的总体评分几乎一致（极差 ' + spread.toFixed(1) + ' 分），说明对这个对象的判断有共识。';
    else if (spread <= 20) verdict = '总分极差 ' + spread.toFixed(1) + ' 分，存在轻度错位：' + UTIL_rdrank.esc_rdrank(highest.name) + ' 给分最高，' + UTIL_rdrank.esc_rdrank(lowest.name) + ' 相对保守。';
    else verdict = '总分极差 ' + spread.toFixed(1) + ' 分，分歧明显：' + UTIL_rdrank.esc_rdrank(highest.name) + ' ' + highest.sc.total.toFixed(0) + ' 分，' + UTIL_rdrank.esc_rdrank(lowest.name) + ' ' + lowest.sc.total.toFixed(0) + ' 分。';

    body.innerHTML =
      '<div class="hero">' +
        '<div class="score">' + avg_total.toFixed(1) + '<small> /100</small></div>' +
        '<div class="herotxt">' +
          '<div class="lv"><span>' + ready.length + '</span>人平均</div>' +
          '<p>' + verdict + '</p>' +
          '<p class="muted">最高 ' + highest.sc.total.toFixed(1) + '（' + UTIL_rdrank.esc_rdrank(highest.name) + '）· 最低 ' +
            lowest.sc.total.toFixed(1) + '（' + UTIL_rdrank.esc_rdrank(lowest.name) + '）· ' + UTIL_rdrank.esc_rdrank(scale.name) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="sec-title">各人总分</div>' +
      '<div class="chart" id="chartPeople"><div class="loading">渲染中…</div></div>' +
      '<div class="sec-title">多人雷达</div>' +
      '<div class="chart" id="chartRadar"><div class="loading">渲染中…</div></div>' +
      '<div class="legend">' + ready.map(x => '<span><i style="background:' + this.color_of_rdrank(x.i) + '"></i>' + UTIL_rdrank.esc_rdrank(x.name) + '</span>').join('') + '</div>' +
      '<div class="sec-title">维度矩阵</div>' +
      '<div class="scrollx"><table class="mtx"><thead><tr><th>维度</th>' +
        all.map(x => '<th>' + UTIL_rdrank.esc_rdrank(x.name) + '</th>').join('') + '<th>极差</th></tr></thead><tbody>' +
        rows.map(r => '<tr><td>' + r.id + ' ' + UTIL_rdrank.esc_rdrank(r.name) +
          (r.w !== 1 ? ' <span style="color:#8b949e;font-size:11px">×' + r.w + '</span>' : '') + '</td>' +
          r.vals.map(v => '<td>' + (v == null ? '—' : v.toFixed(0)) + '</td>').join('') +
          '<td class="rng" style="color:' + (r.gap != null && r.gap >= 30 ? '#b45309' : '#8b949e') + '">' + (r.gap == null ? '—' : r.gap.toFixed(0)) + '</td></tr>').join('') +
        '</tbody></table></div>' +
      '<div class="sec-title">分歧榜</div>' +
      gap_list.slice(0, 3).map((r, k) => {
        const vals_txt = ready.map(x => {
          const v = x.sc.dims.find(d => d.id === r.id).pct;
          return UTIL_rdrank.esc_rdrank(x.name) + ' ' + (v == null ? '—' : v.toFixed(0));
        }).join(' · ');
        return '<div class="note ' + (k === 0 ? 'warn' : 'info') + ' gapitem">' +
          '<div class="gaphead" data-dim="' + r.id + '">' +
            '<b>' + (k + 1) + '. ' + r.id + ' ' + UTIL_rdrank.esc_rdrank(r.name) + '</b>　极差 ' + r.gap.toFixed(0) + ' 分<br>' +
            vals_txt + '<br>' +
            '<span style="opacity:.8">' + (k === 0 ? '这是看法最不一致的一维——分歧常常不是"感受不同"，而是"看到的事实不同"。' : '同一件事在不同人眼里的重量不一样，值得单独核对一次。') + '</span>' +
            '<span class="gaptoggle">逐题对照 <i>▾</i></span>' +
          '</div>' +
          '<div class="gapdetail" hidden>' + this.render_dim_compare_rdrank(r.id) + '</div>' +
        '</div>';
      }).join('') +
      (ready.length === 2 ? (
        '<div class="sec-title">差值明细</div>' +
        '<table class="diff"><thead><tr><th>维度</th><th>' + UTIL_rdrank.esc_rdrank(ready[0].name) + '</th><th>' + UTIL_rdrank.esc_rdrank(ready[1].name) + '</th><th>差</th></tr></thead><tbody>' +
        rows.map(r => {
          const a = r.vals[ready[0].i], b = r.vals[ready[1].i];
          if (a == null || b == null) return '';
          const df = a - b;
          const cls = Math.abs(df) < 6 ? 'eq' : (df > 0 ? 'up' : 'dn');
          const txt = Math.abs(df) < 6 ? '≈' : (df > 0 ? '+' + df.toFixed(0) : df.toFixed(0));
          return '<tr><td>' + r.id + ' ' + UTIL_rdrank.esc_rdrank(r.name) + '</td><td>' + a.toFixed(0) + '</td><td>' + b.toFixed(0) + '</td><td><span class="pill ' + cls + '">' + txt + '</span></td></tr>';
        }).join('') + '</tbody></table>' +
        '<div class="sec-title">定位象限</div>' +
        '<div class="chart" id="chartQuad"><div class="loading">渲染中…</div></div>'
      ) : '');

    // 各人总分
    this.draw_chart_rdrank(this.q_rdrank('#chartPeople'),
      this.people_bar_code_rdrank(ready.map(x => x.name), totals),
      () => {
        this.q_rdrank('#chartPeople').innerHTML = '<div style="padding:14px 8px">' + ready.map(x =>
          '<div style="display:flex;align-items:center;gap:10px;margin:9px 0;font:13px system-ui">' +
          '<span style="width:64px;color:#5c6670">' + UTIL_rdrank.esc_rdrank(x.name) + '</span>' +
          '<span style="flex:1;height:9px;background:#eceef0;border-radius:2px;overflow:hidden"><i style="display:block;height:100%;width:' + x.sc.total + '%;background:' + this.color_of_rdrank(x.i) + '"></i></span>' +
          '<span style="width:38px;text-align:right;color:#1f2328;font-weight:600">' + x.sc.total.toFixed(0) + '</span></div>').join('') + '</div>';
      });

    // 多人雷达
    const series = ready.map(x => ({
      name_rdrank: x.name,
      vals_rdrank: this.dims_rdrank().map(d => {
        const f = x.sc.dims.find(k => k.id === d.id);
        return f && f.pct != null ? f.pct : 0;
      }),
      color_rdrank: this.color_of_rdrank(x.i)
    }));
    this.draw_chart_rdrank(this.q_rdrank('#chartRadar'),
      this.radar_code_rdrank(series, ready.length + ' 人对比'),
      () => this.fallback_radar_rdrank(this.q_rdrank('#chartRadar'), this.dims_rdrank(), series));

    // 象限（仅两人）
    if (ready.length === 2) {
      const A = ready[0], B = ready[1];
      this.draw_chart_rdrank(this.q_rdrank('#chartQuad'),
        this.quadrant_code_rdrank((A.sc.total + B.sc.total) / 2, A.sc.total - B.sc.total, A.name, B.name),
        () => {
          this.q_rdrank('#chartQuad').innerHTML = '<div style="padding:20px;text-align:center;color:#5c6670;font:13px system-ui">' +
            '<b style="font-size:15px;color:#1f2328">' + UTIL_rdrank.esc_rdrank(A.name) + ' × ' + UTIL_rdrank.esc_rdrank(B.name) + '</b><br><br>' +
            '平均 ' + ((A.sc.total + B.sc.total) / 2).toFixed(1) + '　|　差值 ' + (A.sc.total - B.sc.total).toFixed(1) + '</div>';
        });
    }

    // 分歧榜展开
    this.qa_rdrank('#resBody .gaphead').forEach(h => {
      h.onclick = () => {
        const item = h.closest('.gapitem');
        const det = item.querySelector('.gapdetail');
        det.hidden = !det.hidden;
        item.classList.toggle('open', !det.hidden);
      };
    });
  }

  render_dim_compare_rdrank(dim_id) {
    const people = this.state_rdrank.people_rdrank
      .map((p, i) => ({ i: i, p: p, name: this.name_of_rdrank(i), ok: this.answered_count_rdrank(p) > 0 }))
      .filter(x => x.ok);
    const dim = this.dims_rdrank().find(d => d.id === dim_id);
    const qs = this.questions_rdrank().filter(q => q.dim === dim_id);
    const anchor = this.cfg_rdrank.full_score;

    const rows = qs.map(q => {
      const vals = people.map(x => (x.p.ans_rdrank[q.id] != null ? (q.rev ? anchor - x.p.ans_rdrank[q.id] : x.p.ans_rdrank[q.id]) : null));
      const ok = vals.filter(v => v != null);
      return { q: q, vals: vals, gap: ok.length > 1 ? Math.max.apply(null, ok) - Math.min.apply(null, ok) : null };
    }).sort((a, b) => (b.gap == null ? -1 : b.gap) - (a.gap == null ? -1 : a.gap));

    const gaps = rows.map(r => r.gap == null ? 0 : r.gap);
    const max_gap = gaps.length ? Math.max.apply(null, gaps) : 0;
    const hot = rows.filter(r => r.gap != null && r.gap >= 3).length;

    return '<div class="scrollx"><table class="mtx qcmp"><thead><tr><th>题目（' + UTIL_rdrank.esc_rdrank(dim ? dim.name : dim_id) + ' · 按分歧从大到小）</th>' +
      people.map(x => '<th>' + UTIL_rdrank.esc_rdrank(x.name) + '</th>').join('') + '<th>极差</th></tr></thead><tbody>' +
      rows.map(r => '<tr class="' + (r.gap != null && r.gap >= 3 ? 'hi' : '') + '">' +
        '<td class="qt">' + UTIL_rdrank.esc_rdrank(r.q.text) + (r.q.rev ? '<em>(R)</em>' : '') +
          (this.weight_of_rdrank(r.q) !== 1 ? '<em>×' + this.weight_of_rdrank(r.q) + '</em>' : '') + '</td>' +
        r.vals.map(v => '<td>' + (v == null ? '—' : v) + '</td>').join('') +
        '<td class="rng">' + (r.gap == null ? '—' : r.gap) + '</td></tr>').join('') +
      '</tbody></table></div>' +
      '<div class="qnote">分值为 0–' + anchor + ' 的有效分' + (rows.some(r => r.q.rev) ? '（标 (R) 的反向题已翻转）' : '') +
      '。本维度最大分歧 ' + max_gap + ' 分' + (hot ? '，有 ' + hot + ' 题差距达 3 分以上（高亮行）' : '') + '。</div>';
  }

  /* ================= mermaid 代码 ================= */
  radar_code_rdrank(series, title) {
    const dims = this.dims_rdrank();
    const axes = dims.map((d, i) => 'a' + i + '["' + d.id + ' ' + d.short + '"]').join(', ');
    const curves = series.map((s, i) =>
      'curve c' + i + '["' + UTIL_rdrank.mm_safe_rdrank(s.name_rdrank) + '"]{' +
      s.vals_rdrank.map(v => Number(v || 0).toFixed(1)).join(', ') + '}'
    ).join('\n    ');
    return 'radar-beta\n    title ' + UTIL_rdrank.mm_safe_rdrank(title) + '\n    axis ' + axes + '\n    ' + curves + '\n    max 100\n    min 0';
  }

  bar_code_rdrank(dims, series) {
    const labels = dims.map(d => '"' + d.short + '"').join(', ');
    const bars = series.map((s, i) => (i === 0 ? 'bar' : 'line') + ' [' + s.vals_rdrank.map(v => Number(v || 0).toFixed(1)).join(', ') + ']').join('\n    ');
    return 'xychart-beta\n    title "各维度得分（百分制）"\n    x-axis [' + labels + ']\n    y-axis "得分" 0 --> 100\n    ' + bars;
  }

  people_bar_code_rdrank(names, totals) {
    return 'xychart-beta\n    title "各人总分"\n    x-axis [' + names.map(n => '"' + UTIL_rdrank.mm_safe_rdrank(n) + '"').join(', ') +
      ']\n    y-axis "百分制" 0 --> 100\n    bar [' + totals.map(v => v.toFixed(1)).join(', ') + ']';
  }

  quadrant_code_rdrank(total, diff, na, nb) {
    const x = UTIL_rdrank.clamp_rdrank(total / 100, 0.02, 0.98);
    const y = UTIL_rdrank.clamp_rdrank(Math.abs(diff) / 40, 0.02, 0.98);
    return 'quadrantChart\n    title 定位：横轴=平均分 纵轴=差值\n    x-axis "低 0 分" --> "高 100 分"\n    y-axis "一致" --> "分歧大"\n' +
      '    quadrant-1 "高分且分歧"\n    quadrant-2 "低分且分歧"\n    quadrant-3 "低分但一致"\n    quadrant-4 "高分且一致"\n' +
      '    "' + UTIL_rdrank.mm_safe_rdrank(na) + '×' + UTIL_rdrank.mm_safe_rdrank(nb) + '": [' + x.toFixed(2) + ', ' + y.toFixed(2) + ']';
  }

  /* ================= 绘图（含降级） ================= */
  draw_chart_rdrank(el, code, fb) {
    const self = this;
    const fallback = () => {
      try { el.innerHTML = ''; if (fb) fb(); }
      catch (e) { el.innerHTML = '<div class="loading">图形不可用（缺少绘图环境）</div>'; }
    };
    if (!el) return;
    if (!window.mermaid) { fallback(); return; }
    const id = 'mm_' + self.cfg_rdrank.ls_key + '_' + (++self.mm_seq_rdrank);
    window.mermaid.render(id, code).then(out => {
      el.innerHTML = out.svg || out;
    }).catch(e => {
      console.warn('[mermaid] 渲染失败，使用降级绘图', e);
      fallback();
    });
  }

  fallback_radar_rdrank(el, dims, series) {
    const S = 400, R = S * 0.30, cx = S / 2, cy = S / 2, n = dims.length;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = document.createElement('canvas');
    cv.width = S * dpr; cv.height = S * dpr;
    cv.style.cssText = 'width:100%;max-width:430px;height:auto;display:block;margin:0 auto';
    el.innerHTML = ''; el.appendChild(cv);
    const g = cv.getContext('2d');
    if (!g) return;
    g.scale(dpr, dpr);
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    for (let k = 1; k <= 4; k++) {
      g.beginPath();
      for (let i = 0; i < n; i++) { const p = pt(i, R * k / 4); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
      g.closePath(); g.strokeStyle = '#e6e8eb'; g.lineWidth = 1; g.stroke();
    }
    g.strokeStyle = '#f0f1f3';
    for (let i = 0; i < n; i++) { const p = pt(i, R); g.beginPath(); g.moveTo(cx, cy); g.lineTo(p[0], p[1]); g.stroke(); }
    series.forEach(s => {
      g.beginPath();
      dims.forEach((d, i) => {
        const v = UTIL_rdrank.clamp_rdrank(s.vals_rdrank[i] || 0, 0, 100);
        const p = pt(i, R * v / 100);
        i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
      });
      g.closePath();
      g.fillStyle = s.color_rdrank + '22';
      g.strokeStyle = s.color_rdrank;
      g.lineWidth = 2; g.fill(); g.stroke();
    });
    g.font = '11px system-ui,-apple-system,sans-serif';
    g.fillStyle = '#5c6670'; g.textAlign = 'center'; g.textBaseline = 'middle';
    dims.forEach((d, i) => { const p = pt(i, R * 1.20); g.fillText(d.id + ' ' + d.short, p[0], p[1]); });
  }

  fallback_bar_rdrank(el, dims, series) {
    el.innerHTML = '<div style="padding:8px 6px">' + dims.map(d => {
      const v = d.pct == null ? 0 : d.pct;
      return '<div style="display:flex;align-items:center;gap:10px;margin:9px 0;font:12px system-ui">' +
        '<span style="width:70px;color:#5c6670;flex:none">' + d.id + ' ' + d.short + '</span>' +
        '<span style="flex:1;height:9px;background:#eceef0;border-radius:2px;overflow:hidden">' +
        '<i style="display:block;height:100%;width:' + v + '%;background:' + (series[0] ? series[0].color_rdrank : '#0b6bcb') + '"></i></span>' +
        '<span style="width:34px;text-align:right;color:#1f2328;font-weight:600;flex:none">' + v.toFixed(0) + '</span></div>';
    }).join('') + '</div>';
  }
  /* ================= 分享长图（白底黑字） ================= */
  card_font_rdrank() { return 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'; }

  round_rect_rdrank(g, x, y, w, h, r) {
    r = Math.min(r, h / 2, Math.max(1, w / 2));
    g.beginPath();
    g.moveTo(x + r, y);
    g.lineTo(x + w - r, y); g.arcTo(x + w, y, x + w, y + r, r);
    g.lineTo(x + w, y + h - r); g.arcTo(x + w, y + h, x + w - r, y + h, r);
    g.lineTo(x + r, y + h); g.arcTo(x, y + h, x, y + h - r, r);
    g.lineTo(x, y + r); g.arcTo(x, y, x + r, y, r);
    g.closePath();
  }

  wrap_text_rdrank(g, text, max_w) {
    const lines = [];
    let cur = '';
    for (const ch of String(text)) {
      if (g.measureText(cur + ch).width > max_w && cur) { lines.push(cur); cur = ch; }
      else cur += ch;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  draw_radar_rdrank(g, cx, cy, R, dims, series) {
    const n = dims.length;
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
    for (let k = 1; k <= 4; k++) {
      g.beginPath();
      for (let i = 0; i < n; i++) { const p = pt(i, R * k / 4); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }
      g.closePath(); g.strokeStyle = '#e9ebee'; g.lineWidth = 1; g.stroke();
    }
    g.strokeStyle = '#f2f3f5';
    for (let i = 0; i < n; i++) { const p = pt(i, R); g.beginPath(); g.moveTo(cx, cy); g.lineTo(p[0], p[1]); g.stroke(); }

    series.forEach(s => {
      g.beginPath();
      dims.forEach((d, i) => {
        const v = UTIL_rdrank.clamp_rdrank(s.vals_rdrank[i] || 0, 0, 100);
        const p = pt(i, R * v / 100);
        i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
      });
      g.closePath();
      g.fillStyle = s.color_rdrank + '20';
      g.strokeStyle = s.color_rdrank;
      g.lineWidth = 2.5; g.fill(); g.stroke();
      dims.forEach((d, i) => {
        const v = UTIL_rdrank.clamp_rdrank(s.vals_rdrank[i] || 0, 0, 100);
        const p = pt(i, R * v / 100);
        g.beginPath(); g.arc(p[0], p[1], 3.2, 0, Math.PI * 2); g.fillStyle = s.color_rdrank; g.fill();
      });
    });

    g.font = '500 19px ' + this.card_font_rdrank();
    g.fillStyle = '#666f78'; g.textAlign = 'center'; g.textBaseline = 'middle';
    dims.forEach((d, i) => { const p = pt(i, R * 1.19); g.fillText(d.id + ' ' + d.short, p[0], p[1]); });
  }

  build_card_rdrank() {
    const self = this;
    const is_all = this.state_rdrank.view_rdrank === 'all';
    const scale = this.scale_rdrank();
    const dims = this.dims_rdrank();
    const all = this.state_rdrank.people_rdrank.map((p, i) => ({
      i: i, p: p, sc: this.compute_rdrank(p), name: this.name_of_rdrank(i), ok: this.answered_count_rdrank(p) > 0,
      color: this.color_of_rdrank(i)
    }));
    const self_idx = is_all ? -1 : +this.state_rdrank.view_rdrank.slice(1);
    const ready = is_all ? all.filter(x => x.ok) : all.filter(x => x.ok && x.i === self_idx);
    if (!ready.length) return null;

    const W = 1080;
    const n_dim = dims.length;
    const H = is_all
      ? (236 + ready.length * 74 + 30 + 520 + 60 + 3 * 46 + 40 + 110)
      : (1031 + 34 + n_dim * 56 + 130);

    return {
      W_rdrank: W, H_rdrank: H, is_all_rdrank: is_all, ready_rdrank: ready,
      draw_rdrank: function (g) { self.draw_card_rdrank(g, W, H, is_all, ready, dims, scale); }
    };
  }

  draw_card_rdrank(g, W, H, is_all, ready, dims, scale) {
    const PAD = 66;
    const dstr = new Date().toLocaleDateString('zh-CN');

    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, W, H);

    g.fillStyle = '#111111';
    g.fillRect(PAD, 46, W - PAD * 2, 3);

    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.font = '600 19px ' + this.card_font_rdrank(); g.fillStyle = '#999999';
    g.fillText((scale.title || scale.name || '量表') + '  ·  REPORT', PAD, 88);

    g.font = '700 44px ' + this.card_font_rdrank(); g.fillStyle = '#111111';
    g.fillText(is_all ? (ready.length + ' 人对比') : (ready[0].name + ' · ' + (scale.self_label || '自评')), PAD, 150);

    g.font = '400 20px ' + this.card_font_rdrank(); g.fillStyle = '#888888';
    g.fillText((scale.name || '') + ' · ' + this.questions_rdrank().length + ' 题 · ' + dims.length + ' 维 · ' + dstr, PAD, 188);

    if (is_all) this.draw_card_all_rdrank(g, W, H, ready, dims);
    else this.draw_card_one_rdrank(g, W, H, ready[0], dims, scale);

    g.strokeStyle = '#e5e7ea'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(PAD, H - 78); g.lineTo(W - PAD, H - 78); g.stroke();
    g.font = '400 19px ' + this.card_font_rdrank(); g.fillStyle = '#aaaaaa'; g.textAlign = 'left';
    g.fillText('通用量表引擎 · ' + (scale.name || ''), PAD, H - 38);
    g.textAlign = 'right';
    g.fillText('分数不代表好坏，只说明位置', W - PAD, H - 38);
    g.textAlign = 'left';
  }

  draw_card_one_rdrank(g, W, H, x, dims, scale) {
    const PAD = 66;
    let y = 236;

    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.font = '700 128px ' + this.card_font_rdrank();
    g.fillStyle = '#111111';
    const score_txt = x.sc.total.toFixed(1);
    g.fillText(score_txt, PAD, y + 104);
    const tw = g.measureText(score_txt).width;
    g.font = '400 26px ' + this.card_font_rdrank(); g.fillStyle = '#999999';
    g.fillText('/ 100', PAD + tw + 14, y + 96);

    g.font = '600 25px ' + this.card_font_rdrank();
    const badge = (x.sc.level.code || '') + '  ' + (x.sc.level.name || '');
    const bw = g.measureText(badge).width + 40;
    g.fillStyle = '#f4f5f6';
    this.round_rect_rdrank(g, PAD, y + 134, bw, 50, 4); g.fill();
    g.strokeStyle = '#dddddd'; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#333333';
    g.fillText(badge, PAD + 20, y + 168);

    g.font = '400 23px ' + this.card_font_rdrank(); g.fillStyle = '#555555';
    const lines = this.wrap_text_rdrank(g, x.sc.level.line || '', W - PAD * 2).slice(0, 2);
    lines.forEach((ln, i) => g.fillText(ln, PAD, y + 234 + i * 36));

    this.draw_radar_rdrank(g, W / 2, y + 234 + 90 + 268, 230, dims,
      [{ vals_rdrank: x.sc.dims.map(d => d.pct == null ? 0 : d.pct), color_rdrank: '#111111' }]);

    g.textBaseline = 'alphabetic';
    let by = 1031 + 34;
    dims.forEach((d, i) => {
      const item = x.sc.dims.find(k => k.id === d.id);
      const v = item && item.pct != null ? item.pct : 0;
      const yy = by + i * 56;
      g.font = '500 22px ' + this.card_font_rdrank(); g.fillStyle = '#333333'; g.textAlign = 'left';
      g.fillText(d.id + ' ' + d.name, PAD, yy + 8);

      const bx = PAD + 360, bw2 = 480, bh = 12;
      g.fillStyle = '#eef0f2';
      this.round_rect_rdrank(g, bx, yy - 6, bw2, bh, 2); g.fill();
      g.fillStyle = '#111111';
      if (v > 0) { this.round_rect_rdrank(g, bx, yy - 6, Math.max(4, bw2 * v / 100), bh, 2); g.fill(); }

      g.font = '700 24px ' + this.card_font_rdrank(); g.fillStyle = '#111111'; g.textAlign = 'right';
      g.fillText(v.toFixed(0), W - PAD, yy + 9);
    });

  }

  draw_card_all_rdrank(g, W, H, ready, dims) {
    const PAD = 66;
    let y = 236;
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';

    ready.forEach((x, k) => {
      const yy = y + k * 74;
      g.beginPath(); g.arc(PAD + 4, yy - 8, 6, 0, Math.PI * 2);
      g.fillStyle = x.color; g.fill();
      g.font = '600 23px ' + this.card_font_rdrank(); g.fillStyle = '#111111';
      g.fillText(x.name, PAD + 22, yy);
      const bx = PAD + 220, bw2 = 620;
      g.fillStyle = '#eef0f2';
      this.round_rect_rdrank(g, bx, yy - 16, bw2, 14, 2); g.fill();
      g.fillStyle = x.color;
      this.round_rect_rdrank(g, bx, yy - 16, Math.max(4, bw2 * x.sc.total / 100), 14, 2); g.fill();
      g.font = '700 25px ' + this.card_font_rdrank(); g.fillStyle = '#111111'; g.textAlign = 'right';
      g.fillText(x.sc.total.toFixed(1), W - PAD, yy + 2); g.textAlign = 'left';
    });

    const ry = y + ready.length * 74 + 30;
    this.draw_radar_rdrank(g, W / 2, ry + 250, 220, dims,
      ready.map(x => ({
        vals_rdrank: dims.map(d => { const f = x.sc.dims.find(k => k.id === d.id); return f && f.pct != null ? f.pct : 0; }),
        color_rdrank: x.color
      })));

    const gaps = dims.map(d => {
      const vals = ready.map(x => { const f = x.sc.dims.find(k => k.id === d.id); return f && f.pct != null ? f.pct : null; }).filter(v => v != null);
      return { id: d.id, name: d.name, gap: vals.length > 1 ? Math.max.apply(null, vals) - Math.min.apply(null, vals) : null };
    }).filter(x => x.gap != null).sort((a, b) => b.gap - a.gap);

    let ty = ry + 520;
    g.textBaseline = 'alphabetic';
    g.font = '700 25px ' + this.card_font_rdrank(); g.fillStyle = '#111111';
    g.fillText('看法最不一致的三处', PAD, ty); ty += 44;
    gaps.slice(0, 3).forEach((r, k) => {
      g.font = '500 21px ' + this.card_font_rdrank(); g.fillStyle = '#333333';
      g.fillText((k + 1) + '. ' + r.id + ' ' + r.name, PAD, ty);
      g.textAlign = 'right'; g.font = '700 21px ' + this.card_font_rdrank();
      g.fillText('极差 ' + r.gap.toFixed(0), W - PAD, ty); g.textAlign = 'left';
      ty += 46;
    });
  }

  export_image_rdrank() {
    const self = this;
    const card = this.build_card_rdrank();
    if (!card) { alert('还没有可导出的结果'); return; }
    const scale = 2;
    const cv = document.createElement('canvas');
    cv.width = card.W_rdrank * scale;
    cv.height = card.H_rdrank * scale;
    const g = cv.getContext('2d');
    if (!g) { alert('当前环境不支持绘图'); return; }
    g.scale(scale, scale);
    card.draw_rdrank(g);

    const nm = card.is_all_rdrank
      ? this.state_rdrank.people_rdrank.length + '人对比'
      : this.name_of_rdrank(+this.state_rdrank.view_rdrank.slice(1));

    cv.toBlob(b => {
      if (!b) { alert('导出失败，请换用 Chrome / Safari 打开'); return; }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = (self.scale_name_rdrank() || '量表') + '_' + nm + '_' + new Date().toISOString().slice(0, 10) + '.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, 'image/png');
  }

  /* ================= 绑定 / 启动 ================= */
  bind_rdrank() {
    const self = this;

    self.q_rdrank('#btnStart').onclick = () => {
      const total = self.questions_rdrank().length;
      const next = self.state_rdrank.people_rdrank.findIndex(p => self.answered_count_rdrank(p) < total);
      if (next < 0) { self.show_result_rdrank(self.state_rdrank.people_rdrank.length >= 2 ? 'all' : 'p0'); return; }
      self.start_quiz_rdrank(next);
    };

    self.q_rdrank('#btnView').onclick = () => {
      const with_data = self.state_rdrank.people_rdrank.findIndex(p => self.answered_count_rdrank(p) > 0);
      self.show_result_rdrank(self.state_rdrank.people_rdrank.length >= 2 ? 'all' : 'p' + Math.max(0, with_data));
    };

    self.q_rdrank('#btnReset').onclick = () => {
      if (!confirm('清空所有人的作答记录？此操作不可撤销。')) return;
      try { localStorage.removeItem(self.cfg_rdrank.ls_key); } catch (e) {}
      self.state_rdrank.people_rdrank = [self.new_person_rdrank(''), self.new_person_rdrank('')];
      self.state_rdrank.idx_rdrank = 0;
      self.state_rdrank.view_rdrank = '';
      self.render_scale_picker_rdrank();
      self.refresh_setup_rdrank();
      self.show_screen_rdrank('setup');
    };

    self.q_rdrank('#btnAddPerson').onclick = () => self.add_person_rdrank();
    self.q_rdrank('#inNewName').onkeydown = e => { if (e.key === 'Enter') self.add_person_rdrank(); };

    self.q_rdrank('#btnPrev').onclick = () => self.prev_question_rdrank();
    self.q_rdrank('#btnSkip').onclick = () => {
      const qs = self.questions_rdrank();
      self.state_rdrank.idx_rdrank = Math.min(qs.length - 1, self.state_rdrank.idx_rdrank + 1);
      self.render_question_rdrank();
    };
    self.q_rdrank('#btnQuit').onclick = () => { self.refresh_setup_rdrank(); self.show_screen_rdrank('setup'); };
    self.q_rdrank('#btnDone').onclick = () => self.show_result_rdrank('p' + self.state_rdrank.cur_rdrank);

    self.q_rdrank('#btnImg').onclick = () => self.export_image_rdrank();

    const open_guide = () => { self.q_rdrank('#guideModal').hidden = false; };
    const close_guide = () => { self.q_rdrank('#guideModal').hidden = true; };
    if (self.q_rdrank('#btnGuide')) self.q_rdrank('#btnGuide').onclick = open_guide;
    if (self.q_rdrank('#btnGuideClose')) self.q_rdrank('#btnGuideClose').onclick = close_guide;
    if (self.q_rdrank('#guideMask')) self.q_rdrank('#guideMask').onclick = close_guide;
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && self.q_rdrank('#guideModal') && !self.q_rdrank('#guideModal').hidden) close_guide();
    });
    self.q_rdrank('#btnAgain').onclick = () => { self.refresh_setup_rdrank(); self.show_screen_rdrank('setup'); };

    document.addEventListener('keydown', e => {
      if (!self.q_rdrank('#scr-quiz').classList.contains('on')) return;
      if (e.target.tagName === 'INPUT') return;
      const anchor = self.cfg_rdrank.full_score;
      if (/^[0-9]$/.test(e.key) && +e.key <= anchor) { e.preventDefault(); self.answer_rdrank(+e.key); }
      else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); self.next_question_rdrank(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); self.prev_question_rdrank(); }
    });
  }

  render_missing_rdrank() {
    document.body.innerHTML = '<div style="max-width:620px;margin:90px auto;padding:0 20px;font:14px/1.9 system-ui,-apple-system,\"PingFang SC\",\"Microsoft YaHei\",sans-serif;color:#1f2328">' +
      '<h2 style="font-size:18px;margin:0 0 12px">未找到数据文件</h2>' +
      '<p style="color:#5c6670">页面的量表定义在 <code style="background:#f4f5f6;padding:1px 4px">scales_data_rdrank.js</code> 中，需要与「量表引擎.html」放在同一个文件夹、文件名完全一致。</p>' +
      '<p style="color:#5c6670">如果你是发送方：请把两个文件一起打包发送。</p></div>';
  }

  init_rdrank() {
    modal_body_content_rdrank();
    if (typeof CFG_rdrank === 'undefined' || typeof SCALES_rdrank === 'undefined' || !SCALES_rdrank[CFG_rdrank.default_scale]) {
      this.render_missing_rdrank();
      return;
    }
    if (window.mermaid) {
      window.mermaid.initialize({
        startOnLoad: false, theme: 'default', securityLevel: 'loose',
        fontFamily: 'system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'
      });
    }
    this.load_rdrank();
    if (!this.state_rdrank.people_rdrank.length) {
      this.state_rdrank.people_rdrank = [this.new_person_rdrank(''), this.new_person_rdrank('')];
    }
    this.bind_rdrank();
    this.render_scale_picker_rdrank();
    this.refresh_setup_rdrank();
    this.show_screen_rdrank('setup');
  }
}

function modal_body_content_rdrank(){
    document.querySelector('div.modal-body').innerHTML=`
      <h4>1 · 最小结构</h4>
      <pre>const SCALES_rdrank = {
  量表key: {
    key: 'my_scale',                    // 唯一标识
    name: '短名',                        // 选择器上显示
    title: '完整标题',                   // 页面大标题
    lead: '一句话说明测什么、怎么答',
    respondent_label: '参与评估的人',
    self_label: '自评',
    total_label: '总分',                 // 分数旁的名称
    total_note: '分数含义的说明',
    anchors: ['…','…','…','…','…','…'],  // 0–5 六个选项标签
    anchor_hint: '0 = … · 5 = …',
    dims: [ … ], levels: [ … ]
  }
};</pre>

      <h4>2 · 维度与题目（题目写在维度里）</h4>
      <pre>dims: [
  {
    id: 'D1', name: '维度名', short: '雷达短名',
    desc: '这个维度测什么',
    subs: [['1.1', '子维度名']],     // 仅用于展示，可省略
    weight: 1,                       // 维度权重，可省略
    questions: [
      { id: 'd1-1', sub: '1.1', text: '题目文本' },
      { id: 'd1-2', sub: '1.1', text: '重要题可加权', weight: 2 },
      { id: 'd1-3', sub: '1.1', text: '反向表述的题目', rev: true }
    ]
  }
]</pre>
      <p>题目挂在哪个维度下就属于哪个维度，<b>不需要再写 dim 字段</b>，引擎会自动补上。也兼容把题目写在顶层 <code>questions</code> 的旧写法。</p>

      <h4>3 · 权重</h4>
      <table>
        <tr><th>字段</th><th>作用</th><th>默认</th></tr>
        <tr><td><code>question.weight</code></td><td>该题在本维度内的相对权重</td><td>1</td></tr>
        <tr><td><code>dimension.weight</code></td><td>该维度在总分中的相对权重</td><td>1</td></tr>
      </table>
      <p>不写就是 1，也就是等权。有效范围 0.1–5（由 <code>CFG_rdrank.weight_floor / weight_ceil</code> 控制），超出会被截断；写 0 或非数字按 1 处理。</p>
      <pre>维度分 = Σ(有效分 × 题目权重) ÷ Σ题目权重 ÷ 5 × 100
总分   = Σ(维度分 × 维度权重) ÷ Σ维度权重</pre>

      <h4>4 · 反向题</h4>
      <p><code>rev: true</code> 表示该题是反向表述，计分时按 <code>5 − 原始分</code> 翻转。适合"我常常中途放弃"这类句子。逐题对照里会标 <b>(R)</b>。</p>

      <h4>5 · 分级 levels</h4>
      <p>按 <code>min</code> 从高到低排列，<b>最后一项必须是 <code>min: 0</code></b>。引擎取第一个满足 <code>总分 ≥ min</code> 的档位；没有 levels 也能跑，只是不显示分级。</p>

      <h4>6 · 注意事项</h4>
      <ul>
        <li>题目 <code>id</code> 必须全局唯一——作答记录按 id 存储，改 id 等于清空该题历史。</li>
        <li>改动结构后建议把 <code>CFG_rdrank.ls_key</code> 的版本号 +1，强制所有人重新作答。</li>
        <li><code>id</code> 不要用重复值或空值，否则该题会覆盖同 id 的答案。</li>
        <li>一页最多 6 人（<code>CFG_rdrank.max_people</code>），配色也只有 6 种，加人会自动循环取色。</li>
        <li><code>short</code> 建议 2–3 个字，太长会让雷达图的轴标签重叠。</li>
        <li>数据文件是普通 <code>&lt;script&gt;</code>，本地双击打开即可加载，不需要起服务器。</li>
      </ul>
`;
}

