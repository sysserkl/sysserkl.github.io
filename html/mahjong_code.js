function tile_short_mj(t) {
    if (t < 27) {
        return t % 9 + 1 + SUITS[t / 9 | 0];
    }
    return HONORS[t - 27];
}

function tile_emoji_mj(t) {
    if (t < 9) {
        return String.fromCodePoint(0x1F007 + t);
    }
    if (t < 18) {
        return String.fromCodePoint(0x1F019 + (t - 9));
    }
    if (t < 27) {
        return String.fromCodePoint(0x1F010 + (t - 18));
    }
    return String.fromCodePoint(0x1F000 + (t - 27));
}

function suit_of_mj(t) {
    return t < 27 ? t / 9 | 0 : 3;
}

function counts_from_tiles_mj(arr) {
    const c = new Array(34).fill(0);
    for (const t of arr) {
        c[t]++;
    }
    return c;
}

/* =========================================================
2. 胡牌 / 向听算法
========================================================= */
function can_form_sets_by_count_mj(c, setsLeft) {
    let i = 0;
    while (i < 34 && c[i] === 0) {
        i++;
    }
    if (i >= 34) {
        return setsLeft === 0;
    }
    if (setsLeft <= 0) {
        return false;
    }
    if (c[i] >= 3) {
        c[i] -= 3;
        const ok = can_form_sets_by_count_mj(c, setsLeft - 1);
        c[i] += 3;
        if (ok) {return true;}
    }
    if (i < 27 && i % 9 <= 6 && c[i + 1] > 0 && c[i + 2] > 0) {
        c[i]--;
        c[i + 1]--;
        c[i + 2]--;
        const ok = can_form_sets_by_count_mj(c, setsLeft - 1);
        c[i]++;
        c[i + 1]++;
        c[i + 2]++;
        if (ok) {return true;}
    }
    return false;
}

function is_standard_win_mj(c, meldCount) {
    const need = 4 - meldCount;
    if (need < 0) {return false;}
    for (let i = 0; i < 34; i++) {
        if (c[i] >= 2) {
            c[i] -= 2;
            const ok = can_form_sets_by_count_mj(c, need);
            c[i] += 2;
            if (ok) {return true;}
        }
    }
    return false;
}

function is_seven_pairs_mj(c) {
    let pairs = 0,
    total = 0;
    for (let i = 0; i < 34; i++) {
        total += c[i];
        if (c[i] % 2 !== 0) {return false;}
        pairs += c[i] / 2;
    }
    return total === 14 && pairs === 7;
}

function is_win_counts_mj(c, meldCount) {
    if (meldCount === 0 && is_seven_pairs_mj(c)) {return true;}
    return is_standard_win_mj(c, meldCount);
}

function shanten_normal_mj(c, meldCount) {
    let best = 8;
    const cc = c.slice();
    const target = 4 - meldCount;
    function dfs_mj(i, sets, partials, pair) {
        while (i < 34 && cc[i] === 0) {
            i++;
        }
        if (i >= 34) {
            const p = Math.min(partials, Math.max(0, target - sets));
            const s = 8 - 2 * (sets + meldCount) - p - (pair ? 1 : 0);
            if (s < best) {
                best = s;
            }
            return;
        }
        const n = cc[i];
        if (n >= 3) {
            cc[i] -= 3;
            dfs_mj(i, sets + 1, partials, pair);
            cc[i] += 3;
        }
        if (i < 27 && i % 9 <= 6 && cc[i + 1] > 0 && cc[i + 2] > 0) {
            cc[i]--;
            cc[i + 1]--;
            cc[i + 2]--;
            dfs_mj(i, sets + 1, partials, pair);
            cc[i]++;
            cc[i + 1]++;
            cc[i + 2]++;
        }
        if (!pair && n >= 2) {
            cc[i] -= 2;
            dfs_mj(i, sets, partials, true);
            cc[i] += 2;
        }
        if (n >= 2) {
            cc[i] -= 2;
            dfs_mj(i, sets, partials + 1, pair);
            cc[i] += 2;
        }
        if (i < 27 && i % 9 <= 7 && cc[i + 1] > 0) {
            cc[i]--;
            cc[i + 1]--;
            dfs_mj(i, sets, partials + 1, pair);
            cc[i]++;
            cc[i + 1]++;
        }
        if (i < 27 && i % 9 <= 6 && cc[i + 2] > 0) {
            cc[i]--;
            cc[i + 2]--;
            dfs_mj(i, sets, partials + 1, pair);
            cc[i]++;
            cc[i + 2]++;
        }
        cc[i]--;
        dfs_mj(i, sets, partials, pair);
        cc[i]++;
    }
    dfs_mj(0, 0, 0, false);
    return best;
}

function shanten7_mj(c) {
    let pairs = 0,
    kinds = 0;
    for (let i = 0; i < 34; i++) {
        if (c[i] >= 2) {
            pairs++;
        }
        if (c[i] > 0) {
            kinds++;
        }
    }
    return 6 - pairs + Math.max(0, 7 - kinds);
}

function shanten_mj(c, meldCount) {
    const key = c.join('') + '|' + meldCount;
    const hit = _shCache.get(key);
    if (hit !== undefined) {
        return hit;
    }
    let v = shanten_normal_mj(c, meldCount);
    if (meldCount === 0) {
        v = Math.min(v, shanten7_mj(c));
    }
    if (_shCache.size > 60000) {
        _shCache.clear();
    }
    _shCache.set(key, v);
    return v;
}

// 手牌向听（手牌为 3n+2 张时按"打出一张后"的最优值计算）
function hand_shanten_mj(p) {
    const base = counts_from_tiles_mj(p.hand);
    const mc = p.melds.length;
    if (p.hand.length % 3 === 2) {
        let best = 99;
        for (const t of new Set(p.hand)) {
            const c = base.slice();
            c[t]--;
            best = Math.min(best, shanten_mj(c, mc));
        }
        return best;
    }
    return shanten_mj(base, mc);
}

function beep_mj(freq, dur, type, vol) {
    if (!soundOn) {return;}
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = type || 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(vol || 0.07, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start();
        o.stop(audioCtx.currentTime + dur);
    } catch (e) {}
}

function sfx_mj(name) {
    if (!soundOn) {return;}
    if (useWav && !wavFailed[name] && WAV[name]) {
        try {
            const a = new Audio(WAV[name]);
            a.volume = 0.35;
            const p = a.play();
            if (p && p.catch) {
                p.catch(() => {
                    wavFailed[name] = true;
                });
            }
            return;
        } catch (e) {
            wavFailed[name] = true;
        }
    }
    const map = {
        click: [660, 0.05, 'triangle', 0.05],
        draw: [520, 0.06, 'sine', 0.05],
        discard: [380, 0.07, 'square', 0.035],
        win: [880, 0.5, 'sine', 0.09],
        peng: [300, 0.12, 'sawtooth', 0.05],
        error: [180, 0.1, 'square', 0.04]
    };
    const m = map[name] || map.click;
    beep_mj(m[0], m[1], m[2], m[3]);
    if (name === 'win') {
        setTimeout(() => beep_mj(1180, 0.35, 'sine', 0.08), 140);
    }
}

function make_wall_mj() {
    const w = [];
    for (let t = 0; t < 34; t++) {
        for (let k = 0; k < 4; k++) {
            w.push(t);
        }
    }
    for (let i = w.length - 1; i > 0; i--) {
        const j = Math.random() * (i + 1) | 0;
        [w[i], w[j]] = [w[j], w[i]];
    }
    return w;
}

function set_status_mj(s) {
    G.log = s;
    $_mj('status').textContent = s;
}

/* =========================================================
5. 渲染
========================================================= */
function tile_el_mj(t, cls) {
    const d = document.createElement('div');
    d.className = 'tile' + (cls ? ' ' + cls : '');
    const s = document.createElement('span');
    s.className = 'te';
    s.textContent = tile_emoji_mj(t);
    const l = document.createElement('span');
    l.className = 'tl';
    l.textContent = tile_short_mj(t);
    d.appendChild(s);
    d.appendChild(l);
    return d;
}

function render_seat_mj(i) {
    const p = G.players[i];
    const el = $_mj('seat' + i);
    if (!el || !p) {return;}
    el.className = 'seat ' + (i === 2 ? 'top' : 'side') + (G.turn === i && G.running ? ' active' : '');
    const sc = G.scores[i];
    el.innerHTML = '<div class="who"><span class="nm">' + NAMES[i] + '</span>' + '<span class="sc">' + (sc > 0 ? '+' + sc : sc) + '</span></div>' + '<div class="cnt">' + p.hand.length + '张</div>';
    const md = document.createElement('div');
    md.className = 'melds';
    for (const m of p.melds) {
        const g = document.createElement('div');
        g.className = 'grp';
        g.style.display = 'flex';
        g.style.gap = '1px';
        for (const t of m.tiles) {
            g.appendChild(tile_el_mj(t, 'sm'));
        }
        md.appendChild(g);
    }
    el.appendChild(md);
}

function render_pools_mj() {
    for (let i = 0; i < 4; i++) {
        const box = $_mj('pool' + i);
        box.innerHTML = '';
        const pool = G.players[i].discards;
        const start = Math.max(0, pool.length - 30);
        for (let k = start; k < pool.length; k++) {
            const el = tile_el_mj(pool[k], 'sm');
            if (i === G.lastDiscardFrom && k === pool.length - 1 && G.lastDiscard !== null) {
                el.classList.add('drawn');
            }
            box.appendChild(el);
        }
    }
}

function render_my_hand_mj() {
    const p = G.players[0];
    const box = $_mj('myhand');
    box.innerHTML = '';
    const sorted = p.hand.slice().sort((a, b) => a - b);
    for (const t of sorted) {
        const el = tile_el_mj(t);
        if (t === G.lastDraw && G.turn === 0) {
            el.classList.add('drawn');
        }
        el.onclick = () => on_hand_click_mj(t);
        box.appendChild(el);
    }
    const md = $_mj('mymelds');
    md.innerHTML = '';
    for (const m of p.melds) {
        const g = document.createElement('div');
        g.className = 'grp';
        for (const t of m.tiles) {
            g.appendChild(tile_el_mj(t, 'sm'));
        }
        md.appendChild(g);
    }
}

function render_actions_mj() {
    const box = $_mj('actions');
    box.innerHTML = '';
    if (G.pendingAsk) {
        for (const o of G.pendingAsk.options) {
            const b = document.createElement('button');
            b.className = 'act' + (o.key === 'pass' ? ' pass' : '');
            b.textContent = o.label;
            b.onclick = () => choose_action_mj(o.key);
            box.appendChild(b);
        }
    } else if (G.waitDiscard) {
        const d = document.createElement('div');
        d.className = 'hint';
        let txt = '轮到你出牌 · 点击手牌打出';
        try {
            const sh = hand_shanten_mj(G.players[0]);
            if (sh <= 0) {
                txt = '🎯 已听牌 — 点击手牌打出';
            } else if (sh === 1) {
                txt = '差一步听牌 · 点击手牌打出';
            }
        } catch (e) {}
        d.textContent = txt;
        box.appendChild(d);
    }
}

function render_mj() {
    $_mj('wallCount').textContent = G.wall.length;
    $_mj('roundNo').textContent = G.round;
    $_mj('myScore').textContent = G.scores[0];
    $_mj('btnDiff').textContent = DIFF_CN[G.difficulty];
    $_mj('btnSound').textContent = soundOn ? '🔊' : '🔇';
    const lblBtn = $_mj('btnLabelToggle');
    if (lblBtn) {
        lblBtn.textContent = showLabel ? '显示' : '隐藏';
        lblBtn.classList[showLabel ? 'add' : 'remove']('on');
    }
    for (let i = 1; i <= 3; i++) {
        render_seat_mj(i);
    }
    render_pools_mj();
    render_my_hand_mj();
    render_actions_mj();
}

/* =========================================================
6. 人类交互
========================================================= */
function ask_human_mj(options) {
    return new Promise(res => {
        G.waitDiscard = null;
        G.pendingAsk = {
            options,
            res
        };
        render_mj();
    });
}

function choose_action_mj(key) {
    const ask = G.pendingAsk;
    if (!ask) {return;}
    G.pendingAsk = null;
    render_mj();
    sfx_mj('click');
    ask.res(key);
}

function human_discard_mj() {
    return new Promise(res => {
        G.pendingAsk = null;
        G.waitDiscard = res;
        render_mj();
    });
}

function on_hand_click_mj(t) {
    if (!G.waitDiscard) {return;}
    const p = G.players[0];
    if (p.hand.indexOf(t) < 0) {return;}
    const r = G.waitDiscard;
    G.waitDiscard = null;
    render_mj();
    sfx_mj('click');
    r(t);
}

/* =========================================================
7. 牌操作辅助
========================================================= */
function remove_tile_from_hand_mj(p, t, n) {
    n = n || 1;
    for (let k = 0; k < n; k++) {
        const idx = p.hand.indexOf(t);
        if (idx >= 0) {
            p.hand.splice(idx, 1);
        }
    }
}

function chi_options_mj(hand, tile) {
    if (tile >= 27) {
        return [];
    }
    const res = [];
    const c = counts_from_tiles_mj(hand);
    const n = tile % 9;
    const base = tile - n;
    const combos = [[-2, -1], [-1, 1], [1, 2]];
    for (const cb of combos) {
        const x = n + cb[0],
        y = n + cb[1];
        if (x < 0 || y > 8 || x > 8 || y < 0) {continue;}
        const t1 = base + x,
        t2 = base + y;
        if (c[t1] > 0 && c[t2] > 0) {
            res.push([t1, t2]);
        }
    }
    return res;
}

function can_win_tile_mj(i, tile) {
    const p = G.players[i];
    const c = counts_from_tiles_mj(p.hand);
    c[tile]++;
    return is_win_counts_mj(c, p.melds.length);
}

/* =========================================================
8. AI
========================================================= */
function is_dangerous_mj(tile, self) {
    let danger = 0;
    for (let k = 1; k <= 3; k++) {
        const j = (self + k) % 4;
        const pl = G.players[j];
        if (pl.discards.indexOf(tile) >= 0) {
            danger -= 10;
        } else if (tile < 27) {
            danger += Math.abs(tile % 9 - 4) <= 2 ? 5 : 1;
        } else {
            danger += 2;
        }
    }
    return danger;
}

function ai_choose_discard_mj(i) {
    const p = G.players[i];
    const mc = p.melds.length;
    const base = counts_from_tiles_mj(p.hand);
    const uniq = Array.from(new Set(p.hand));
    if (G.difficulty === 'easy' && Math.random() < 0.45) {
        return uniq[Math.random() * uniq.length | 0];
    }
    let best = null;
    for (const t of uniq) {
        const c = base.slice();
        c[t]--;
        const sh = shanten_mj(c, mc);
        let score = sh * 1000;

        // 孤张 / 搭子判断
        const cnt = base[t];
        let near = 0;
        if (t < 27) {
            if (t - 1 >= 0 && t % 9 > 0) {
                near += base[t - 1];
            }
            if (t + 1 < 27 && t % 9 < 8) {
                near += base[t + 1];
            }
            if (t - 2 >= 0 && t % 9 > 1) {
                near += base[t - 2];
            }
            if (t + 2 < 27 && t % 9 < 7) {
                near += base[t + 2];
            }
        } else {
            for (let k = 27; k < 34; k++) {
                if (k !== t && base[k]) {
                    near += 1;
                }
            }
        }
        if (cnt === 1 && near === 0) {
            score -= 40;
        }
        if (cnt >= 2) {
            score += 60;
        }
        if (near > 0) {
            score += 20;
        }

        // 困难模式防守
        if (G.difficulty === 'hard') {
            if (sh >= 1) {
                score += is_dangerous_mj(t, i) * (sh >= 2 ? 2.2 : 0.8);
            }
            // 避免拆散已完成的面子
            if (cnt === 3 && sh <= 1) {
                score += 200;
            }
        }
        if (G.difficulty === 'easy') {
            score += Math.random() * 300;
        } else {
            score += Math.random() * 8;
        }
        if (best === null || score < best.score) {
            best = {
                t,
                score
            };
        }
    }
    return best ? best.t : p.hand[0];
}

function ai_self_choice_mj(i, acts) {
    const hu = acts.find(a => a.key === 'hu');
    const gs = acts.filter(a => a.key.indexOf('gang') === 0 || a.key.indexOf('angang') === 0 || a.key.indexOf('bugang') === 0);
    if (hu) {
        if (G.difficulty === 'easy' && Math.random() < 0.06) {/* 偶尔放过 */} else {
            return 'hu';
        }
    }
    if (gs.length) {
        if (G.difficulty === 'easy') {
            return Math.random() < 0.5 ? gs[0].key : 'pass';
        }
        // 困难模式：听牌时不做无谓暗杠（保留变化），其余情况杠
        const p = G.players[i];
        const sh = shanten_mj(counts_from_tiles_mj(p.hand), p.melds.length);
        if (sh <= 0 && Math.random() < 0.35) {
            return 'pass';
        }
        return gs[0].key;
    }
    return 'pass';
}

function ai_want_gang_mj(i, tile) {
    if (G.difficulty === 'easy') {
        return Math.random() < 0.6;
    }
    return true;
}

function ai_want_peng_mj(i, tile) {
    const p = G.players[i];
    const before = shanten_mj(counts_from_tiles_mj(p.hand), p.melds.length);
    const c = counts_from_tiles_mj(p.hand);
    c[tile] -= 2;
    const after = shanten_mj(c, p.melds.length + 1);
    if (G.difficulty === 'easy') {
        return Math.random() < 0.45;
    }
    if (after < before) {return true;}
    if (after === before) {
        if (p.melds.length === 0 && before <= 1) {
            return Math.random() < 0.25;
        }
        return Math.random() < 0.55;
    }
    return false;
}

function ai_want_chi_mj(i, tile, chis) {
    if (!chis.length) {return null;}
    if (G.difficulty === 'easy') {
        return Math.random() < 0.3 ? chis[0] : null;
    }
    const p = G.players[i];
    const before = shanten_mj(counts_from_tiles_mj(p.hand), p.melds.length);
    for (const ch of chis) {
        const c = counts_from_tiles_mj(p.hand);
        c[ch[0]]--;
        c[ch[1]]--;
        const after = shanten_mj(c, p.melds.length + 1);
        if (after < before) {
            return ch;
        }
    }
    return null;
}

/* =========================================================
9. 得分
========================================================= */
function pay_all_mj(to, v) {
    for (let i = 0; i < 4; i++) {
        if (i === to) {continue;}
        G.scores[i] -= v;
        G.scores[to] += v;
    }
}

function transfer_mj(from, to, v) {
    if (from === to) {return;}
    G.scores[from] -= v;
    G.scores[to] += v;
}

function compute_fan_mj(p, fullTiles, isSelfDraw, gangFlag) {
    const melds = p.melds;
    const counts = counts_from_tiles_mj(fullTiles);
    const allTiles = fullTiles.concat(melds.reduce((a, m) => a.concat(m.tiles), []));
    const list = [];
    let fan = 1;
    list.push('平胡 +1');
    if (isSelfDraw) {
        fan++;
        list.push('自摸 +1');
    }
    if (gangFlag) {
        fan++;
        list.push('杠上开花 +1');
    }
    const seven = melds.length === 0 && is_seven_pairs_mj(counts);
    if (seven) {
        fan += 2;
        list.push('七对 +2');
    }

    // 门清：没有吃/碰/明杠（暗杠仍算门清）
    if (melds.every(m => m.concealed)) {
        fan++;
        list.push('门清 +1');
    }

    // 花色
    const suits = new Set(allTiles.map(suit_of_mj));
    const numSuits = Array.from(suits).filter(s => s !== 3);
    const hasHonor = suits.has(3);
    if (!hasHonor && numSuits.length === 1) {
        fan += 3;
        list.push('清一色 +3');
    } else if (hasHonor && numSuits.length === 1) {
        fan += 1;
        list.push('混一色 +1');
    } else if (hasHonor && numSuits.length === 0) {
        fan += 3;
        list.push('字一色 +3');
    }

    // 碰碰胡
    let allTriplets = true;
    for (const m of melds) {
        if (m.type === 'chi') {
            allTriplets = false;
        }
    }
    if (allTriplets && !seven) {
        let pairCount = 0,
        ok = true;
        for (let i = 0; i < 34; i++) {
            const n = counts[i];
            if (n === 0) {continue;}
            if (n === 2) {
                pairCount++;
                continue;
            }
            if (n === 3 || n === 4) {continue;}
            ok = false;
            break;
        }
        if (ok && pairCount === 1) {
            fan += 1;
            list.push('碰碰胡 +1');
        }
    }
    const score = Math.min(Math.pow(2, fan - 1), 32);
    return {
        fan,
        list,
        score
    };
}

/* =========================================================
10. 出牌后的响应（吃碰杠胡）
========================================================= */
async function resolve_claim_mj(tile, from) {
    const order = [];
    for (let k = 1; k <= 3; k++) {
        order.push((from + k) % 4);
    }

    // ---- 人类选项 ----
    const humanOpts = [];
    const me = G.players[0];
    if (from !== 0) {
        if (can_win_tile_mj(0, tile)) {
            humanOpts.push({
                key: 'hu',
                label: '胡'
            });
        }
        const c = counts_from_tiles_mj(me.hand);
        if (c[tile] >= 3) {
            humanOpts.push({
                key: 'gang',
                label: '杠'
            });
        }
        if (c[tile] >= 2) {
            humanOpts.push({
                key: 'peng',
                label: '碰'
            });
        }
        if (from === 3) {
            const chis = chi_options_mj(me.hand, tile);
            chis.forEach((ch, idx) => {
                humanOpts.push({
                    key: 'chi:' + idx,
                    label: '吃 ' + ch.map(tile_short_mj).join('·')
                });
            });
        }
    }
    let humanChoice = null;
    if (humanOpts.length) {
        humanOpts.push({
            key: 'pass',
            label: '过'
        });
        humanChoice = await ask_human_mj(humanOpts);
        if (!G.running) {return null;}
    }
    if (humanChoice === 'hu') {
        return {
            type: 'hu',
            player: 0
        };
    }

    // ---- AI 胡（优先级最高）----
    for (const p of order) {
        if (p === 0) {continue;}
        if (can_win_tile_mj(p, tile)) {
            return {
                type: 'hu',
                player: p
            };
        }
    }

    // ---- 人类碰杠（人类已主动选择，优先于 AI 的吃）----
    if (humanChoice === 'gang') {
        return {
            type: 'gang',
            player: 0
        };
    }
    if (humanChoice === 'peng') {
        return {
            type: 'peng',
            player: 0
        };
    }

    // ---- AI 碰杠 ----
    for (const p of order) {
        if (p === 0) {continue;}
        const pl = G.players[p];
        const c = counts_from_tiles_mj(pl.hand);
        if (c[tile] >= 3 && ai_want_gang_mj(p, tile)) {
            return {
                type: 'gang',
                player: p
            };
        }
        if (c[tile] >= 2 && ai_want_peng_mj(p, tile)) {
            return {
                type: 'peng',
                player: p
            };
        }
    }

    // ---- 人类吃 ----
    if (humanChoice && humanChoice.indexOf('chi:') === 0) {
        const idx = +humanChoice.split(':')[1];
        const chis = chi_options_mj(me.hand, tile);
        if (chis[idx]) {
            return {
                type: 'chi',
                player: 0,
                pair: chis[idx]
            };
        }
    }

    // ---- AI 吃（仅下家）----
    const nx = (from + 1) % 4;
    if (nx !== 0) {
        const pl = G.players[nx];
        const chis = chi_options_mj(pl.hand, tile);
        const pick = ai_want_chi_mj(nx, tile, chis);
        if (pick) {
            return {
                type: 'chi',
                player: nx,
                pair: pick
            };
        }
    }
    return null;
}

/* =========================================================
11. 自身回合动作（自摸 / 暗杠 / 补杠）
========================================================= */
function self_actions_mj(i) {
    const p = G.players[i];
    const c = counts_from_tiles_mj(p.hand);
    const acts = [];
    if (is_win_counts_mj(c, p.melds.length)) {
        acts.push({
            key: 'hu',
            label: '胡'
        });
    }
    for (let t = 0; t < 34; t++) {
        if (c[t] === 4) {
            acts.push({
                key: 'angang:' + t,
                label: '暗杠 ' + tile_short_mj(t)
            });
        }
    }
    for (const m of p.melds) {
        if (m.type === 'peng' && c[m.tiles[0]] > 0) {
            acts.push({
                key: 'bugang:' + m.tiles[0],
                label: '补杠 ' + tile_short_mj(m.tiles[0])
            });
        }
    }
    return acts;
}

/* =========================================================
12. 结算
========================================================= */
function show_modal_mj(html) {
    $_mj('modalCard').innerHTML = html;
    $_mj('modal').classList.add('show');
}

function hide_modal_mj() {
    $_mj('modal').classList.remove('show');
}

function settle_win_mj(winner, winTile, isSelfDraw, gangFlag, loser) {
    G.running = false;
    const p = G.players[winner];
    const full = isSelfDraw ? p.hand.slice() : p.hand.concat([winTile]);
    const r = compute_fan_mj(p, full, isSelfDraw, gangFlag);
    let delta = [];
    if (isSelfDraw) {
        for (let i = 0; i < 4; i++) {
            if (i === winner) {continue;}
            transfer_mj(i, winner, r.score);
            delta.push({
                i,
                v: -r.score
            });
        }
    } else {
        transfer_mj(loser, winner, r.score);
        delta.push({
            i: loser,
            v: -r.score
        });
    }
    delta.push({
        i: winner,
        v: isSelfDraw ? r.score * 3 : r.score
    });
    sfx_mj('win');
    set_status_mj(NAMES[winner] + (isSelfDraw ? ' 自摸' : ' 胡了 ' + NAMES[loser] + ' 的牌'));
    const tilesHtml = full.slice().sort((a, b) => a - b).map(t => '<div class="tile md"><span class="te">' + tile_emoji_mj(t) + '</span></div>').join('');
    let rows = '';
    for (const d of delta) {
        rows += '<div class="r"><span>' + NAMES[d.i] + '</span><span class="' + (d.v > 0 ? 'pos' : 'neg') + '">' + (d.v > 0 ? '+' : '') + d.v + '</span></div>';
    }
    for (let i = 0; i < 4; i++) {
        rows += '<div class="r" style="border-top:1px dashed rgba(255,255,255,.12);margin-top:4px;padding-top:4px">' + '<span style="color:#8fb8a4">' + NAMES[i] + ' 总分</span><span>' + G.scores[i] + '</span></div>';
    }
    let meldsHtml = '';
    if (p.melds.length) {
        meldsHtml = '<div style="font-size:calc(11px * var(--fs));color:#8fb8a4;margin-bottom:4px">副露</div><div class="winhand">' + p.melds.map(m => m.tiles.map(t => '<div class="tile md"><span class="te">' + tile_emoji_mj(t) + '</span></div>').join('')).join('<span style="width:8px;display:inline-block"></span>') + '</div>';
    }
    show_modal_mj('<h2>' + NAMES[winner] + (isSelfDraw ? ' 自摸！' : ' 胡牌！') + '</h2>' + '<div class="sub">' + r.fan + ' 番 · 底分 ' + r.score + '</div>' + '<div class="winhand">' + tilesHtml + '</div>' + meldsHtml + '<div class="fan">' + r.list.map(s => '<span>' + s + '</span>').join('') + '</div>' + '<div class="rows">' + rows + '</div>' + '<button onclick="start_game_mj()">再来一局</button>');
    render_mj();
}

function settle_draw_mj() {
    G.running = false;
    sfx_mj('error');
    set_status_mj('流局 · 牌墙摸完');
    let rows = '';
    for (let i = 0; i < 4; i++) {
        rows += '<div class="r"><span>' + NAMES[i] + '</span><span>' + G.scores[i] + '</span></div>';
    }
    show_modal_mj('<h2>流局</h2><div class="sub">牌墙已摸完，本局平分</div>' + '<div class="rows">' + rows + '</div>' + '<button onclick="start_game_mj()">再来一局</button>');
    render_mj();
}

/* =========================================================
13. 主循环
========================================================= */
async function game_loop_mj() {
    const mySeq = ++G.seq;
    let cur = G.dealer;
    let needDraw = true;
    let gangFlag = false;
    while (G.running && G.seq === mySeq) {
        const p = G.players[cur];
        G.turn = cur;
        if (needDraw) {
            if (G.wall.length === 0) {
                settle_draw_mj();
                return;
            }
            const t = G.wall.pop();
            p.hand.push(t);
            G.lastDraw = t;
            render_mj();
            sfx_mj('draw');
            set_status_mj(NAMES[cur] + ' 摸牌');
            await sleep_mj(cur === 0 ? 90 : 260);
            if (G.seq !== mySeq || !G.running) {
                return;
            }

            // 自身动作
            const acts = self_actions_mj(cur);
            let choice = 'pass';
            if (acts.length) {
                if (cur === 0) {
                    choice = await ask_human_mj(acts.concat([{
                        key: 'pass',
                        label: '过'
                    }]));
                    if (G.seq !== mySeq || !G.running) {return;}
                } else {
                    await sleep_mj(220);
                    choice = ai_self_choice_mj(cur, acts);
                }
            }
            if (choice === 'hu') {
                settle_win_mj(cur, t, true, gangFlag, -1);
                return;
            }
            if (choice.indexOf('angang:') === 0) {
                const gt = +choice.split(':')[1];
                remove_tile_from_hand_mj(p, gt, 4);
                p.melds.push({
                    type: 'gang',
                    tiles: [gt, gt, gt, gt],
                    concealed: true
                });
                pay_all_mj(cur, 2);
                sfx_mj('peng');
                set_status_mj(NAMES[cur] + ' 暗杠 ' + tile_short_mj(gt) + ' (+6)');
                render_mj();
                await sleep_mj(320);
                needDraw = true;
                gangFlag = true;
                continue;
            }
            if (choice.indexOf('bugang:') === 0) {
                const gt = +choice.split(':')[1];
                remove_tile_from_hand_mj(p, gt, 1);
                const m = p.melds.find(mm => mm.type === 'peng' && mm.tiles[0] === gt);
                if (m) {
                    m.type = 'gang';
                    m.tiles.push(gt);
                }
                pay_all_mj(cur, 1);
                sfx_mj('peng');
                set_status_mj(NAMES[cur] + ' 补杠 ' + tile_short_mj(gt));
                render_mj();
                await sleep_mj(320);
                needDraw = true;
                gangFlag = true;
                continue;
            }

            // 胡不了且不打牌时，取消高亮
            if (cur !== 0) {
                G.lastDraw = null;
            }
        }

        // ---- 出牌 ----
        G.pendingAsk = null;
        let discard;
        if (cur === 0) {
            set_status_mj('轮到你出牌');
            render_mj();
            discard = await human_discard_mj();
            if (G.seq !== mySeq || !G.running) {return;}
        } else {
            await sleep_mj(G.difficulty === 'easy' ? 520 : 400);
            if (G.seq !== mySeq || !G.running) {return;}
            discard = ai_choose_discard_mj(cur);
        }
        remove_tile_from_hand_mj(p, discard, 1);
        p.discards.push(discard);
        G.lastDraw = null;
        G.lastDiscard = discard;
        G.lastDiscardFrom = cur;
        G.turn = -1;
        render_mj();
        sfx_mj('discard');
        set_status_mj(NAMES[cur] + ' 打出 ' + tile_short_mj(discard));
        await sleep_mj(140);
        if (G.seq !== mySeq || !G.running) {return;}

        // ---- 其他玩家响应 ----
        const claim = await resolve_claim_mj(discard, cur);
        if (G.seq !== mySeq || !G.running) {return;}
        let jumped = false;
        if (claim) {
            const cp = G.players[claim.player];
            if (claim.type === 'hu') {
                p.discards.pop();
                G.lastDiscard = null;
                settle_win_mj(claim.player, discard, false, false, cur);
                return;
            }
            if (claim.type === 'peng') {
                p.discards.pop();
                G.lastDiscard = null;
                remove_tile_from_hand_mj(cp, discard, 2);
                cp.melds.push({
                    type: 'peng',
                    tiles: [discard, discard, discard],
                    from: cur
                });
                sfx_mj('peng');
                set_status_mj(NAMES[claim.player] + ' 碰 ' + tile_short_mj(discard));
                render_mj();
                await sleep_mj(300);
                cur = claim.player;
                needDraw = false;
                gangFlag = false;
                jumped = true;
            } else if (claim.type === 'chi') {
                p.discards.pop();
                G.lastDiscard = null;
                remove_tile_from_hand_mj(cp, claim.pair[0], 1);
                remove_tile_from_hand_mj(cp, claim.pair[1], 1);
                const tiles = [claim.pair[0], claim.pair[1], discard].sort((a, b) => a - b);
                cp.melds.push({
                    type: 'chi',
                    tiles: tiles,
                    from: cur
                });
                sfx_mj('peng');
                set_status_mj(NAMES[claim.player] + ' 吃 ' + tile_short_mj(discard));
                render_mj();
                await sleep_mj(300);
                cur = claim.player;
                needDraw = false;
                gangFlag = false;
                jumped = true;
            } else if (claim.type === 'gang') {
                p.discards.pop();
                G.lastDiscard = null;
                remove_tile_from_hand_mj(cp, discard, 3);
                cp.melds.push({
                    type: 'gang',
                    tiles: [discard, discard, discard, discard],
                    from: cur
                });
                transfer_mj(cur, claim.player, 3);
                sfx_mj('peng');
                set_status_mj(NAMES[claim.player] + ' 明杠 ' + tile_short_mj(discard) + ' (放杠者付3)');
                render_mj();
                await sleep_mj(320);
                cur = claim.player;
                needDraw = true;
                gangFlag = true;
                jumped = true;
            }
        }
        if (jumped) {continue;}
        cur = (cur + 1) % 4;
        needDraw = true;
        gangFlag = false;
    }
}

/* =========================================================
14. 开局
========================================================= */
function start_game_mj() {
    hide_modal_mj();
    G.seq++;
    G.running = false;
    G.pendingAsk = null;
    G.waitDiscard = null;
    _shCache.clear();
    G.wall = make_wall_mj();
    G.players = [0, 1, 2, 3].map(i => ({
        idx: i,
        hand: [],
        melds: [],
        discards: []
    }));
    for (let i = 0; i < 4; i++) {
        for (let k = 0; k < 13; k++) {
            G.players[i].hand.push(G.wall.pop());
        }
    }
    for (const p of G.players) {
        p.hand.sort((a, b) => a - b);
    }
    G.dealer = (G.round - 1) % 4;
    G.turn = G.dealer;
    G.lastDraw = null;
    G.lastDiscard = null;
    G.lastDiscardFrom = -1;
    G.running = true;
    set_status_mj('第 ' + G.round + ' 局开始 · ' + NAMES[G.dealer] + '坐庄');
    render_mj();
    setTimeout(() => {
        game_loop_mj().catch(e => {
            console.error(e);
            set_status_mj('出错：' + e.message);
        });
    }, 300);
    G.round++;
}

/* =========================================================
15. 绑定
========================================================= */
function apply_label_mode_mj() {
    document.body.classList[showLabel ? 'remove' : 'add']('no-label');
}

function apply_zoom_mj() {
    try {
        document.documentElement.style.setProperty('--s', String(zoom));
        document.documentElement.style.setProperty('--fs', String(fontZoom));
    } catch (e) {}
    const a = $_mj('zoomVal'),
    b = $_mj('fontVal');
    if (a) {
        a.textContent = Math.round(zoom * 100) + '%';
    }
    if (b) {
        b.textContent = Math.round(fontZoom * 100) + '%';
    }
}

function save_prefs_mj() {
    try {
        localStorage.setItem('mj_label', showLabel ? '1' : '0');
        localStorage.setItem('mj_zoom', String(zoom));
        localStorage.setItem('mj_fs', String(fontZoom));
    } catch (e) {}
}

function auto_zoom_mj() {
    return typeof window !== 'undefined' && window.innerWidth >= 900 ? 1.3 : 1;
}

function toggle_settings_mj(force) {
    const on = force === undefined ? !$_mj('settings').classList.contains('show') : force;
    $_mj('settings').classList[on ? 'add' : 'remove']('show');
    $_mj('setMask').classList[on ? 'add' : 'remove']('show');
}

