/* Match canvas real pixels to CSS size x devicePixelRatio, then map drawing back to logical grid coords */
function resize_canvas_tdgame() {
    const cssWidth = canvas.clientWidth;
    if (!cssWidth) return;
    const cssHeight = cssWidth * (ROWS * CELL) / (COLS * CELL);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    viewScale = canvas.width / (COLS * CELL);
    ctx.setTransform(viewScale, 0, 0, viewScale, 0, 0);
}

function play_sfx_tdgame(type) {
    play_sfx_sound_b(type);
}

/* ================= BFS pathfinding: ignoreBlock=true means towers are not obstacles (flying creeps) ================= */
function find_path_tdgame(ignoreBlock) {
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    const prev = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const q = [start];
    visited[start.y][start.x] = true;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length) {
        const cur = q.shift();
        if (cur.x === end.x && cur.y === end.y) break;
        for (const [dx, dy] of dirs) {
            const nx = cur.x + dx, ny = cur.y + dy;
            if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
            if (visited[ny][nx]) continue;
            if (!ignoreBlock && grid[ny][nx] === 1) continue; // ground creeps: towers block
            visited[ny][nx] = true;
            prev[ny][nx] = { x: cur.x, y: cur.y };
            q.push({ x: nx, y: ny });
        }
    }
    if (!visited[end.y][end.x]) return null;
    const path = [];
    let c = { ...end };
    while (c) { path.push(c); c = prev[c.y][c.x]; }
    path.reverse();
    return path;
}

function refresh_paths_tdgame() {
    const ground = find_path_tdgame(false), air = find_path_tdgame(true);
    for (const c of creeps) {
        const path = c.flying ? air : ground;
        if (path) { c.path = path; c.pi = Math.min(c.pi, path.length - 1); }
    }
}

/* ================= Spawning creeps ================= */
function spawn_creep_tdgame(type) {
    const cfg = CREEPS[type];
    const path = cfg.flying ? find_path_tdgame(true) : find_path_tdgame(false);
    if (!path) return;
    const hp = cfg.hp * (1 + wave * 0.18);
    creeps.push({
        type, flying: !!cfg.flying,
        x: start.x * CELL + CELL / 2, y: start.y * CELL + CELL / 2,
        hp, maxHp: hp, speed: cfg.speed * (1 + wave * 0.03),
        reward: cfg.reward, color: cfg.color, r: cfg.r,
        slowUntil: 0, slowFactor: 1,
        path, pi: 0, dead: false,
    });
}

function start_wave_tdgame() {
    if (gameOver) return;
    wave++;
    const count = 6 + wave * 2;
    spawnQueue = [];
    for (let i = 0; i < count; i++) {
        const r = Math.random();
        let type = 'normal';
        if (wave >= 2) {
            if (r < 0.25) type = 'fast';
            else if (r < 0.5) type = 'flying';
        }
        if (wave >= 3 && r > 0.88) type = 'boss';
        spawnQueue.push(type);
    }
    spawnTimer = 0;
    waveActive = true;
    play_sfx_tdgame('wave');
    refresh_hud_tdgame();
}

/* ================= Build / upgrade / sell ================= */
function build_tower_tdgame(gx, gy) {
    if (grid[gy][gx] !== 0) return;
    if ((gx === start.x && gy === start.y) || (gx === end.x && gy === end.y)) return;
    const cfg = TYPES[selectedType];
    if (gold < cfg.cost) { show_message_tdgame('Not enough gold'); return; }
    gold -= cfg.cost;
    towers.push({
        gx, gy, type: selectedType, level: 1,
        damage: cfg.damage, range: cfg.range, fireRate: cfg.fireRate,
        splash: cfg.splash || 0, slowFactor: cfg.slowFactor || 1, slowDur: cfg.slowDur || 0,
        cd: 0, color: cfg.color,
    });
    grid[gy][gx] = 1;
    refresh_paths_tdgame();
    play_sfx_tdgame('build');
    refresh_hud_tdgame();
}

function get_upgrade_cost_tdgame(t) {
    return Math.round(TYPES[t.type].cost * 0.8);
}

function upgrade_tower_tdgame(t) {
    if (t.level >= 2) return;
    const cost = get_upgrade_cost_tdgame(t);
    if (gold < cost) { show_message_tdgame('Not enough gold'); return; }
    gold -= cost;
    t.level++;
    t.damage = Math.round(t.damage * 1.5);
    t.range += 0.3;
    t.fireRate *= 0.85;
    if (t.splash) t.splash += 0.2;
    if (t.slowDur) t.slowDur += 0.8;
    play_sfx_tdgame('upgrade');
    refresh_hud_tdgame(); refresh_panel_tdgame();
}

function get_refund_value_tdgame(t) {
    return Math.round(TYPES[t.type].cost * SELL_REFUND_RATE);
}

function sell_tower_tdgame(t) {
    gold += get_refund_value_tdgame(t);
    grid[t.gy][t.gx] = 0;
    towers = towers.filter(x => x !== t);
    selectedTower = null;
    refresh_paths_tdgame();
    play_sfx_tdgame('sell');
    refresh_hud_tdgame(); refresh_panel_tdgame();
}

/* ================= Damage resolution (kill grants gold + sound) ================= */
function damage_creep_tdgame(c, dmg) {
    if (c.dead) return;
    c.hp -= dmg;
    if (c.hp <= 0) {
        c.dead = true;
        gold += c.reward;
        play_sfx_tdgame('kill');
        refresh_hud_tdgame();
    } else {
        play_sfx_tdgame('hit');
    }
}

/* ================= Update logic ================= */
function update_game_tdgame(dt) {
    const now = performance.now() / 1000;

    // Spawn creeps
    if (waveActive && spawnQueue.length) {
        spawnTimer -= dt;
        if (spawnTimer <= 0) { spawn_creep_tdgame(spawnQueue.shift()); spawnTimer = 0.8; }
    }

    // Auto wave loop: current wave cleared -> countdown -> next wave
    if (waveActive && !spawnQueue.length && creeps.length === 0 && !gameOver) {
        waveActive = false;
        nextWaveTimer = 4;
    }
    if (!waveActive && wave > 0 && !gameOver) {
        nextWaveTimer -= dt;
        if (nextWaveTimer <= 0) start_wave_tdgame();
    }

    // Move creeps (with slow effect)
    for (const c of creeps) {
        if (c.dead) continue;
        if (c.pi >= c.path.length) {
            c.dead = true; lives--; play_sfx_tdgame('leak'); refresh_hud_tdgame();
            if (lives <= 0) { lives = 0; gameOver = true; waveActive = false; }
            continue;
        }
        const slowed = c.slowUntil > now;
        const factor = slowed ? c.slowFactor : 1;
        const tgt = c.path[c.pi];
        const tx = tgt.x * CELL + CELL / 2, ty = tgt.y * CELL + CELL / 2;
        const dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy);
        const step = c.speed * factor * dt * 60;
        if (d <= step) { c.x = tx; c.y = ty; c.pi++; }
        else { c.x += dx / d * step; c.y += dy / d * step; }
    }

    // Towers attack: pick the creep furthest along in range
    for (const t of towers) {
        t.cd -= dt;
        if (t.cd > 0) continue;
        const cx = t.gx * CELL + CELL / 2, cy = t.gy * CELL + CELL / 2;
        let target = null, best = -1;
        for (const c of creeps) {
            if (c.dead) continue;
            const d = Math.hypot(c.x - cx, c.y - cy);
            if (d <= t.range * CELL && c.pi > best) { best = c.pi; target = c; }
        }
        if (target) {
            t.cd = t.fireRate;
            bullets.push({
                x: cx, y: cy, target, dmg: t.damage, color: t.color, speed: 7,
                splash: t.splash, slowFactor: t.slowFactor, slowDur: t.slowDur, now,
            });
            play_sfx_tdgame('shoot');
        }
    }

    // Bullets: single target / splash / slow
    for (const b of bullets) {
        if (!b.target || b.target.dead) { b.dead = true; continue; }
        const dx = b.target.x - b.x, dy = b.target.y - b.y, d = Math.hypot(dx, dy);
        const step = b.speed * dt * 60;
        if (d <= step) {
            if (b.splash) {
                // Splash: damage everyone in range, main target full, others half
                for (const other of creeps) {
                    if (other.dead) continue;
                    const od = Math.hypot(other.x - b.x, other.y - b.y);
                    if (od <= b.splash * CELL) {
                        damage_creep_tdgame(other, other === b.target ? b.dmg : b.dmg * 0.5);
                    }
                }
            } else {
                damage_creep_tdgame(b.target, b.dmg);
                if (b.slowDur) { b.target.slowUntil = b.now + b.slowDur; b.target.slowFactor = b.slowFactor; }
            }
            b.dead = true;
        } else { b.x += dx / d * step; b.y += dy / d * step; }
    }

    creeps = creeps.filter(c => !c.dead);
    bullets = bullets.filter(b => !b.dead);
    refresh_status_tdgame();
}

/* ================= Render ================= */
function render_game_tdgame() {
    ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

    // Grid
    ctx.strokeStyle = '#d1d5db';
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }

    // Start / End
    ctx.fillStyle = '#2e7d32'; ctx.fillRect(start.x * CELL, start.y * CELL, CELL, CELL);
    ctx.fillStyle = '#c62828'; ctx.fillRect(end.x * CELL, end.y * CELL, CELL, CELL);
    ctx.fillStyle = '#ffffff'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('S', start.x * CELL + CELL / 2, start.y * CELL + CELL / 2);
    ctx.fillText('E', end.x * CELL + CELL / 2, end.y * CELL + CELL / 2);

    // Hover range preview
    if (mouse.gx >= 0 && grid[mouse.gy] && grid[mouse.gy][mouse.gx] === 0) {
        const cfg = TYPES[selectedType];
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.beginPath();
        ctx.arc(mouse.gx * CELL + CELL / 2, mouse.gy * CELL + CELL / 2, cfg.range * CELL, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Towers
    for (const t of towers) {
        const cx = t.gx * CELL + CELL / 2, cy = t.gy * CELL + CELL / 2;
        ctx.fillStyle = t.color;
        ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#1f2937'; ctx.font = 'bold 11px sans-serif';
        ctx.fillText(t.level, cx, cy);
        if (t === selectedTower) {
            ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, t.range * CELL, 0, Math.PI * 2); ctx.stroke();
            ctx.lineWidth = 1;
        }
    }

    // Creeps + health bar
    const now = performance.now() / 1000;
    for (const c of creeps) {
        // Flying creep wings
        if (c.flying) {
            ctx.strokeStyle = c.color; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(c.x - c.r - 3, c.y); ctx.lineTo(c.x - c.r + 2, c.y - 5); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(c.x + c.r + 3, c.y); ctx.lineTo(c.x + c.r - 2, c.y - 5); ctx.stroke();
            ctx.lineWidth = 1;
        }
        ctx.fillStyle = c.color;
        ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); ctx.fill();
        // Slow marker
        if (c.slowUntil > now) {
            ctx.strokeStyle = '#80deea'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(c.x, c.y, c.r + 3, 0, Math.PI * 2); ctx.stroke();
            ctx.lineWidth = 1;
        }
        const w = 22;
        ctx.fillStyle = '#000000'; ctx.fillRect(c.x - w / 2, c.y - c.r - 8, w, 4);
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(c.x - w / 2, c.y - c.r - 8, w * Math.max(0, c.hp / c.maxHp), 4);
    }

    // Bullets
    for (const b of bullets) {
        ctx.fillStyle = b.color;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.splash ? 6 : 4, 0, Math.PI * 2); ctx.fill();
    }

    // Game over overlay
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'; ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
        ctx.fillStyle = '#dc2626'; ctx.font = 'bold 24px sans-serif';
        ctx.fillText('Game Over', (COLS * CELL) / 2, (ROWS * CELL) / 2);
    }
}

/* ================= UI refresh ================= */
function refresh_hud_tdgame() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('lives').textContent = lives;
    document.getElementById('wave').textContent = wave;
}

function refresh_status_tdgame() {
    const s = document.getElementById('status');
    if (gameOver) { s.textContent = 'Over'; s.style.color = '#dc2626'; }
    else if (waveActive) { s.textContent = 'In battle'; s.style.color = '#2563eb'; }
    else if (wave > 0) { s.textContent = `Next wave ${Math.max(0, nextWaveTimer).toFixed(1)}s`; s.style.color = '#4b5563'; }
    else { s.textContent = 'Ready'; s.style.color = '#4b5563'; }
}

function refresh_panel_tdgame() {
    const info = document.getElementById('towerInfo');
    const up = document.getElementById('upgradeBtn'), sell = document.getElementById('sellBtn');
    if (!selectedTower) { info.innerHTML = ''; up.style.display = 'none'; sell.style.display = 'none'; return; }
    const t = selectedTower, cfg = TYPES[t.type];
    const refund = get_refund_value_tdgame(t);
    let extra = '';
    if (t.splash) extra = `<div class="row"><span>Splash</span><span>${t.splash.toFixed(1)}</span></div>`;
    if (t.slowDur) extra = `<div class="row"><span>Slow</span><span>${Math.round((1 - t.slowFactor) * 100)}% / ${t.slowDur.toFixed(1)}s</span></div>`;
    info.innerHTML =
        `<div class="row"><span>${cfg.name}</span><span>Level ${t.level}</span></div>
         <div class="row"><span>Damage</span><span>${t.damage}</span></div>
         <div class="row"><span>Range</span><span>${t.range.toFixed(1)}</span></div>
         <div class="row"><span>Rate</span><span>${t.fireRate.toFixed(2)}s</span></div>
         <div class="row"><span>Refund</span><span>+${refund}g</span></div>
         ${extra}`;
    sell.style.display = 'block';
    sell.textContent = `Demolish · +${refund}g`;
    if (t.level < 2) { up.style.display = 'block'; up.textContent = `Upgrade · ${get_upgrade_cost_tdgame(t)}g`; }
    else { up.style.display = 'none'; }
}

function show_message_tdgame(text) {
    const m = document.getElementById('msg');
    m.textContent = text;
    clearTimeout(msgTimer); msgTimer = setTimeout(() => m.textContent = '', 1500);
}

/* ================= Reset ================= */
function reset_game_tdgame() {
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    gold = 120; lives = 20; wave = 0;
    towers = []; creeps = []; bullets = [];
    spawnQueue = []; waveActive = false; nextWaveTimer = 0; gameOver = false;
    selectedTower = null;
    refresh_paths_tdgame(); refresh_hud_tdgame(); refresh_panel_tdgame(); refresh_status_tdgame();
}

/* ================= Interaction ================= */
function get_cell_from_point_tdgame(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const logicW = COLS * CELL, logicH = ROWS * CELL;
    const lx = (clientX - rect.left) / rect.width * logicW;
    const ly = (clientY - rect.top) / rect.height * logicH;
    return { gx: Math.floor(lx / CELL), gy: Math.floor(ly / CELL) };
}

function handle_canvas_pick_tdgame(clientX, clientY) {
    const { gx, gy } = get_cell_from_point_tdgame(clientX, clientY);
    if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return;

    const t = towers.find(t => t.gx === gx && t.gy === gy);
    if (t) { selectedTower = t; refresh_panel_tdgame(); return; }

    selectedTower = null;
    build_tower_tdgame(gx, gy);
    refresh_panel_tdgame();
}

/* ================= Main loop ================= */
function game_loop_tdgame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update_game_tdgame(dt);
    render_game_tdgame();
    requestAnimationFrame(game_loop_tdgame);
}
