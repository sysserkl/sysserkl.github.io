function init_grid_maze_b(grid,maze_dict,border_color='grey',canvas=false,ctx=false) {
    function sub_init_grid_maze_b_cell(cell,r,c){
        const x = c * maze_dict['cell_size'];
        const y = r * maze_dict['cell_size'];
        
        //以下几行保留 - 保留注释
        //if (cell.walls.top) {
            //ctx.moveTo(x, y); 
            //ctx.lineTo(x + maze_dict['cell_size'], y);
        //}
        
        //if (cell.walls.left) {
            //ctx.moveTo(x, y); 
            //ctx.lineTo(x, y + maze_dict['cell_size']);
        //}
                
        if (cell.walls.right) {
            ctx.moveTo(x + maze_dict['cell_size'], y); 
            ctx.lineTo(x + maze_dict['cell_size'], y + maze_dict['cell_size']);
        }
        if (cell.walls.bottom) {
            ctx.moveTo(x, y + maze_dict['cell_size']); 
            ctx.lineTo(x + maze_dict['cell_size'], y + maze_dict['cell_size']);
        }
    }
    
    function sub_init_grid_maze_b_draw(){
        if (!canvas){return;}
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. 绘制内部墙壁
        ctx.lineWidth = 1;
        ctx.strokeStyle = border_color;
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                sub_init_grid_maze_b_cell(grid[r][c],r,c);
            }
        }

        // 补上最左侧的第一列左墙
        for (let r = 0; r < ROWS; r++) {
            if (grid[r][0].walls.left) {
                const x = 0;
                const y = r * maze_dict['cell_size'];
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + maze_dict['cell_size']);
            }
        }
        
        // 补上最上方的第一行上墙
        for (let c = 0; c < COLS; c++) {
            if (grid[0][c].walls.top) {
                const x = c * maze_dict['cell_size'];
                const y = 0;
                ctx.moveTo(x, y);
                ctx.lineTo(x + maze_dict['cell_size'], y);
            }
        }
        ctx.stroke();
    }

    function sub_init_grid_maze_b_get_unvisited_neighbors(cell) {
        const neighbors = [];
        const { row, col } = cell;
        if (row > 0 && !grid[row - 1][col].visited) neighbors.push(grid[row - 1][col]);
        if (col < COLS - 1 && !grid[row][col + 1].visited) neighbors.push(grid[row][col + 1]);
        if (row < ROWS - 1 && !grid[row + 1][col].visited) neighbors.push(grid[row + 1][col]);
        if (col > 0 && !grid[row][col - 1].visited) neighbors.push(grid[row][col - 1]);
        if (neighbors.length === 0){return null;}
        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }

    function sub_init_grid_maze_b_remove_walls(c1, c2) {
        const dx = c1.col - c2.col;
        const dy = c1.row - c2.row;
        if (dx === 1) { c1.walls.left = false; c2.walls.right = false; }
        if (dx === -1) { c1.walls.right = false; c2.walls.left = false; }
        if (dy === 1) { c1.walls.top = false; c2.walls.bottom = false; }
        if (dy === -1) { c1.walls.bottom = false; c2.walls.top = false; }
    }

    var ROWS=maze_dict['rows'];
    var COLS=maze_dict['cols'];
    
    for (let r = 0; r < ROWS; r++) {
        let row = [];
        for (let c = 0; c < COLS; c++) {
            row.push({
            'row': r,
            'col': c,
            'walls': { top: true, right: true, bottom: true, left: true },
            'visited': false,
            });
        }
        grid.push(row);
    }
    grid[0][0]['walls']['top']=false;
    grid[ROWS-1][COLS-1]['walls']['bottom']=false;
    
    // 核心生成算法：DFS 回溯
    const stack = [];
    const start = grid[0][0];
    start.visited = true;
    stack.push(start);

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const next = sub_init_grid_maze_b_get_unvisited_neighbors(current);
        if (next) {
            next.visited = true;
            sub_init_grid_maze_b_remove_walls(current, next);
            stack.push(next);
        } else {
            stack.pop();
        }
    }
    
    sub_init_grid_maze_b_draw(); // 生成时不显示路径
}

// 求解算法：BFS 寻找最短路径
function find_path_maze_b(grid,maze_dict,path_color='tomato',otable=false,canvas=false,ctx=false){
    function sub_find_path_maze_b_draw(path){
        if (!canvas){return;}
        
        ctx.strokeStyle = path_color;
        ctx.lineWidth = maze_dict['cell_size'] / 3; // 路径宽度
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        // 从入口中心开始
        ctx.moveTo(maze_dict['cell_size'] / 2, maze_dict['cell_size'] / 2);
        
        // 连接路径上的每个格子中心
        for (let i = 1; i < path.length; i++) {
            const x = path[i].col * maze_dict['cell_size'] + maze_dict['cell_size'] / 2;
            const y = path[i].row * maze_dict['cell_size'] + maze_dict['cell_size'] / 2;
            ctx.lineTo(x, y);
        }
        
        // 延伸到出口中心
        ctx.lineTo((COLS - 0.5) * maze_dict['cell_size'], (ROWS - 0.5) * maze_dict['cell_size']);
        ctx.stroke();
    }

    var ROWS=maze_dict['rows'];
    var COLS=maze_dict['cols'];
    
    if (grid.length==0){return [];}
    
    const start = grid[0][0];
    const end = grid[ROWS-1][COLS-1];
    
    const queue = [start];
    const visited = new Set([`${start.row},${start.col}`]);
    const parent = new Map(); // 记录路径来源

    while (queue.length > 0) {
        const current = queue.shift();

        // 到达终点
        if (current.row === end.row && current.col === end.col) {
            let path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = parent.get(`${temp.row},${temp.col}`);
            }
            table_maze_generate_b(maze_dict,grid,otable,path);
            sub_find_path_maze_b_draw(path.reverse());
            return path;
        }

        // 检查四个方向 (上、右、下、左)
        const directions = [
            { dr: -1, dc: 0, wall: 'top', opposite: 'bottom' },
            { dr: 0, dc: 1, wall: 'right', opposite: 'left' },
            { dr: 1, dc: 0, wall: 'bottom', opposite: 'top' },
            { dr: 0, dc: -1, wall: 'left', opposite: 'right' }
        ];

        for (const { dr, dc, wall, opposite } of directions) {
            const nr = current.row + dr;
            const nc = current.col + dc;
            const key = `${nr},${nc}`;

            // 检查边界、墙壁和是否已访问
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !current.walls[wall] && !visited.has(key)) {
                visited.add(key);
                parent.set(key, current);
                queue.push(grid[nr][nc]);
            }
        }
    }
    return []; // 理论上完美迷宫一定有解
}

function table_maze_generate_b(maze_dict,grid,table,path = null,onclick_fn='') {
    if (!table){return;}

    var ROWS=maze_dict['rows'];
    var COLS=maze_dict['cols'];
    
    if (path) {
        for (let item of path){
            let td=table.querySelector('.td_maze_rc'+item.row+'_'+item.col);
            if (td){
                td.classList.add('td_maze_path');
            }
        }
    } else {
        table.innerHTML='';
        for (let r = 0; r < ROWS; r++) {
            const tr = document.createElement('tr');
            for (let c = 0; c < COLS; c++) {
                const cell = grid[r][c];
                const td = document.createElement('td');

                // 1. 设置四面墙壁的边框 (有墙=1px实线，无墙=0px透明)
                
                //以下几行保留 - 保留注释
                //td.style.borderLeft = cell.walls.left ? '1px solid #333' : '0';
                //td.style.borderTop = cell.walls.top ? '1px solid #333' : '0';
                
                td.style.borderRight = cell.walls.right ? '1px solid #333' : '0';
                td.style.borderBottom = cell.walls.bottom ? '1px solid #333' : '0';

                // 2. 补上最左侧的第一列左墙
               if (c === 0) {
                    td.style.borderLeft = cell.walls.left ? '1px solid #333' : '0';
                }
            
                // 3. 补上最上方的第一行上墙
                if (r === 0) {
                    td.style.borderTop = cell.walls.top ? '1px solid #333' : '0';
                }

                td.classList.add('td_maze_rc'+r+'_'+c);
                td.classList.add('td_maze_w'+(cell.walls.left?1:0)+(cell.walls.top?1:0)+(cell.walls.right?1:0)+(cell.walls.bottom?1:0));
                
                if (onclick_fn!==''){
                    td.setAttribute('onclick',onclick_fn+'(this)');
                }            
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
    }
}

function findPath_3d_maze_b(grid, ROWS, COLS){
    if (!grid.length){return [];}
    
    const start = grid[0][0];
    const end = grid[ROWS - 1][COLS - 1];
    
    const queue = [start];
    const visited = new Set([`${start.row},${start.col}`]);
    const parent = new Map();
    
    const dirs = [[-1, 0, 'top'], [0, 1, 'right'], [1, 0, 'bottom'], [0, -1, 'left']];
    
    while (queue.length){
        const cur = queue.shift();
        
        if (cur.row === end.row && cur.col === end.col){
            const path = []; 
            let t = cur;
            while (t){
                path.push(t); 
                t = parent.get(`${t.row},${t.col}`);
            }
            return path.reverse();
        }
        
        for (const [dr, dc, wall] of dirs){
            const nr = cur.row + dr;
            const nc = cur.col + dc
            const key = `${nr},${nc}`;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !cur.walls[wall] && !visited.has(key)){
                visited.add(key); 
                parent.set(key, cur); 
                queue.push(grid[nr][nc]);
            }
        }
    }
    return [];
}

function mark_3d_maze_b(THREE,maze_dict,color, x, z){
    const g = new THREE.Group();
    
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(maze_dict['cell'] * 0.3, 0.06, 10, 40),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9 })
    );
    
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.06;
    
    const ball = new THREE.Mesh(
        new THREE.SphereGeometry(maze_dict['cell'] * 0.13, 20, 16),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1 })
    );
    
    ball.position.y = maze_dict['wall_h'] * 0.6;
    g.add(ring, ball);
    g.position.set(x, 0, z);
    
    return g;
}

function reset_camera_3d_maze_b(camera,controls){
  const span = camera.userData.span || 20;
  camera.position.set(0, span * 1.15, span * 1.05);   // 俯视斜角
  controls.target.set(0, 0, 0);
  controls.update();
}

function init_3d_maze_b(THREE,OrbitControls,csw,csh,add_img=false){
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(csw, csh);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1020);
    scene.fog = new THREE.Fog(0x0b1020, 30, 140);

    var camera = new THREE.PerspectiveCamera(55, csw / csh, 0.1, 1000);

    // 视角与距离控制
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 0.5;
    controls.maxDistance = 400;
    controls.maxPolarAngle = Math.PI * 0.49;

    scene.add(new THREE.HemisphereLight(0x9fc4ff, 0x1a2033, 0.9));

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
    fillLight.position.set(-30, 40, -20);
    fillLight.castShadow = false;
    scene.add(fillLight);
    
    var sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(30, 60, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0006;
    scene.add(sun);

    if (add_img){
        // 补一盏暖光，让画面更有画廊感
        const spot = new THREE.PointLight(0xffd9a0, 40, 0, 2);
        spot.position.set(0, maze_dict['wall_h'] * 3, 0);
        scene.add(spot);
    }
    
    var mazeGroup = new THREE.Group();
    var artGroup  = new THREE.Group();
    scene.add(mazeGroup, artGroup);
    
    return [renderer,scene,camera,controls,sun,mazeGroup,artGroup];
}

function render_3d_maze_b(THREE,maze_dict,sun,scene,controls,camera,pathMesh,mazeGroup,grid,renderer,texLoader=false,PICTURES=[],artGroup=false,has_in_out=true){
    const ROWS = grid.length;
    const COLS = grid[0].length;
    const cx = c => (c - (COLS - 1) / 2) * maze_dict['cell'];   // 列 → x
    const cz = r => (r - (ROWS - 1) / 2) * maze_dict['cell'];   // 行 → z

    dispose_group_3d_maze_b(mazeGroup);
    if (artGroup){
        dispose_group_3d_maze_b(artGroup);
    }

    /* ① 地板 */
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(COLS * maze_dict['cell'], ROWS * maze_dict['cell']),
        new THREE.MeshStandardMaterial({ color: 0x1a2233, roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    mazeGroup.add(floor);

    /* ── ② 墙体：同时收集「可挂画的墙面」 ── */
    const walls = [];     // 墙实体
    const slots = [];     // 挂画位：{ x, z, nx, nz, face:[r,c] }
    const addWall = (x, z, sx, sz) => walls.push({ x, z, sx, sz });
    // 竖墙：位于 c 与 c+1 之间，沿 z 延伸
    const addVSlot = (x, z, r, c, nSign) => {
        // nSign = -1 面朝左边的格 (r,c)；+1 面朝右边的格 (r,c+1)
        const fc = nSign < 0 ? c : c + 1;
        if (fc >= 0 && fc < COLS) slots.push({ x, z, nx: nSign, nz: 0, face: [r, fc], axis: 'z' });
    };
    const addHSlot = (x, z, r, c, nSign) => {
        const fr = nSign < 0 ? r : r + 1;
        if (fr >= 0 && fr < ROWS) slots.push({ x, z, nx: 0, nz: nSign, face: [fr, c], axis: 'x' });
    };

    for (let r = 0; r < ROWS; r++){
        for (let c = 0; c < COLS; c++){
            const w = grid[r][c].walls;
            const hasRight = c < COLS - 1 ? (w.right || grid[r][c + 1].walls.left) : w.right;
            const hasBottom = r < ROWS - 1 ? (w.bottom || grid[r + 1][c].walls.top) : w.bottom;
            if (hasRight) {
                addWall(cx(c) + maze_dict['cell'] / 2, cz(r), maze_dict['wall_t'], maze_dict['cell'] + maze_dict['wall_t']);
                addVSlot(cx(c) + maze_dict['cell'] / 2, cz(r), r, c, -1);   // 朝左格
                addVSlot(cx(c) + maze_dict['cell'] / 2, cz(r), r, c, +1);   // 朝右格
            }
            if (hasBottom) {
                addWall(cx(c), cz(r) + maze_dict['cell'] / 2, maze_dict['cell'] + maze_dict['wall_t'], maze_dict['wall_t']);
                addHSlot(cx(c), cz(r) + maze_dict['cell'] / 2, r, c, -1);   // 朝上格
                addHSlot(cx(c), cz(r) + maze_dict['cell'] / 2, r, c, +1);   // 朝下格
            }
            if (c === 0 && w.left) {                          // 最左列外墙
                addWall(cx(c) - maze_dict['cell'] / 2, cz(r), maze_dict['wall_t'], maze_dict['cell'] + maze_dict['wall_t']);
                slots.push({ x: cx(c) - maze_dict['cell'] / 2, z: cz(r), nx: +1, nz: 0, face: [r, c], axis: 'z' });
            }
            if (r === 0 && w.top) {                           // 最上排外墙
                addWall(cx(c), cz(r) - maze_dict['cell'] / 2, maze_dict['cell'] + maze_dict['wall_t'], maze_dict['wall_t']);
                slots.push({ x: cx(c), z: cz(r) - maze_dict['cell'] / 2, nx: 0, nz: +1, face: [r, c], axis: 'x' });
            }
        }
    }

    const wallMesh = new THREE.InstancedMesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x7d8ba6, roughness: 0.78 }),
        walls.length
    );
    wallMesh.castShadow = wallMesh.receiveShadow = true;
    const d = new THREE.Object3D();
    walls.forEach((w, i) => {
        d.position.set(w.x, maze_dict['wall_h'] / 2, w.z);
        d.scale.set(w.sx, maze_dict['wall_h'], w.sz);
        d.updateMatrix();
        wallMesh.setMatrixAt(i, d.matrix);
    });
    wallMesh.instanceMatrix.needsUpdate = true;
    mazeGroup.add(wallMesh);

    /* ── ③ 路径管道 ── */
    const path = findPath_3d_maze_b(grid, ROWS, COLS);
    pathMesh = null;
    
    if (path.length > 1){
        const y = 0.4;
        const pts = path.map(c => new THREE.Vector3(cx(c.col), y, cz(c.row)));
        pathMesh = new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.4),
            Math.max(64, pts.length * 8), maze_dict['cell'] * 0.13, 12, false),
            new THREE.MeshStandardMaterial({ color: 0xff6347, emissive: 0xff6347, emissiveIntensity: 0.5, roughness: 0.35 })
        );
        pathMesh.visible = document.getElementById('ckPath').checked;
        mazeGroup.add(pathMesh);
    }

    /* ── ④ 起点 / 终点 ── */
    if (has_in_out){
        mazeGroup.add(mark_3d_maze_b(THREE,maze_dict,0x35e08a, cx(0), cz(0)), mark_3d_maze_b(THREE,maze_dict,0x4aa3ff, cx(COLS - 1), cz(ROWS - 1)));
    }
    /* ── ⑤ 挂画 ── */
    const placed = place_pictures_3d_maze_b(THREE,camera,maze_dict,renderer,texLoader,PICTURES,artGroup,slots, ROWS, COLS);
       
    /* ── ⑥ 光照 / 阴影 / 雾自适应 ── */
    const span = Math.max(ROWS, COLS) * maze_dict['cell'];
    sun.position.set(span * 0.6, span * 1.3, span * 0.5);
    Object.assign(sun.shadow.camera, {
        left: -span * 0.75, right: span * 0.75, top: span * 0.75, bottom: -span * 0.75, near: 1, far: span * 3
    });
    sun.shadow.camera.updateProjectionMatrix();
    scene.fog.near = span * 0.9; 
    scene.fog.far = span * 3.2;
    controls.target.set(0, 0, 0);
    controls.maxDistance = span * 4;
    camera.userData.span = span;
    reset_camera_3d_maze_b(camera,controls);
    return [pathMesh,placed];
}

function dispose_group_3d_maze_b(g){
    g.traverse(o => {
        if (o.geometry){
            o.geometry.dispose();
        }
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
            if (m.map){
                m.map.dispose();
            }
            m.dispose();
        });
    });
    g.clear();
}

function place_pictures_3d_maze_b(THREE,camera,maze_dict,renderer,texLoader,PICTURES,artGroup,slots, ROWS, COLS){
    if (!PICTURES.length){return 0;}

    // 洗牌，保证每次分布不同
    const pool = slots.slice();
    for (let i = pool.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const usedCell = new Set();
    let n = 0;
    for (const s of pool){
        if (n >= PICTURES.length){break;}
        const key = s.face[0] + ',' + s.face[1];
        if (usedCell.has(key)){continue;}     // 同一个格子只挂一张，分布更均匀
        usedCell.add(key);
        artGroup.add(make_picture_3d_maze_b(THREE,camera,maze_dict,renderer,texLoader,s, PICTURES[n], n));
        n++;
    }
    return n;
}
 
function make_picture_3d_maze_b(THREE,camera,maze_dict,renderer,texLoader,slot, pic, index){
    // ★ 画表面到墙段中心的偏移（统一用这一个值）
    const FWD = maze_dict['wall_t'] / 2 + 0.02 + 0.09;  // 0.175 + 0.02 + 0.09 = 0.285
    //const FWD = maze_dict['cell'] / 2 + maze_dict['wall_t'] / 2 + 0.02 + 0.09;
    
    function updateView(bw, bh){
        const k = 2 * Math.tan(camera.fov * Math.PI / 360);
        const ideal = Math.max((bh / 0.78) / k, (bw / 0.78) / (k * camera.aspect));
        
        // ★ 画表面位置（用统一偏移）
        const surfaceX = slot.x + slot.nx * FWD;
        const surfaceZ = slot.z + slot.nz * FWD;

        // 从画表面往后退
        const maxDist = maze_dict['cell'] * 0.35;  // 直接用语义清晰的"格子内 35%"
        const dist = Math.min(Math.max(ideal, maze_dict['cell'] * 0.15), maxDist);

        g.userData.pic.viewPos = new THREE.Vector3(
            surfaceX + slot.nx * dist,
            maze_dict['art_y'],
            surfaceZ + slot.nz * dist
        );

        // ★ viewTarget 也看画表面（不是 g.position）
        g.userData.pic.viewTarget = new THREE.Vector3(surfaceX, maze_dict['art_y'], surfaceZ);
    }
    
    const g = new THREE.Group();
    g.userData.pic = {
        url: pic.url, title: pic.title, full: null,
        obj: g,
        anchor: { x: slot.x, z: slot.z },
        normal: { x: slot.nx, z: slot.nz },
        face: slot.face,
        viewPos: null, viewTarget: null
    };

    const rotY = slot.nz > 0 ? 0 : slot.nz < 0 ? Math.PI : (slot.nx > 0 ? Math.PI / 2 : -Math.PI / 2);
    g.rotation.y = rotY;
    
    // ★ g.position 也用同一个 FWD
    g.position.set(
        slot.x + slot.nx * FWD,
        maze_dict['art_y'],
        slot.z + slot.nz * FWD
    );

    const back = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x232b3d, roughness: 0.55, metalness: 0.25 })
    );
    back.position.z = 0.04;
    back.castShadow = true;

    const canvas = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45 })    
    );
    canvas.position.z = 0.09;

    const applyAspect = a => {
        const k = 2 * Math.tan(camera.fov * Math.PI / 360);
        const safeMaxDist = maze_dict['cell'] * 0.35;
        const maxW = Math.max(maze_dict['cell'] * 0.15, Math.min(maze_dict['art_max_w'], 0.78 * k * safeMaxDist * camera.aspect - 0.22));
        let w = maze_dict['art_h'] * a, h = maze_dict['art_h'];
        if (w > maxW) { w = maxW; h = maxW / a; }
        back.scale.set(w + 0.22, h + 0.22, 0.08);
        canvas.scale.set(w, h, 1);
        updateView(back.scale.x, back.scale.y);
    };

    applyAspect(1);

    g.add(back, canvas);
    g.userData.pic.frame = back;
    g.userData.pic.canvas = canvas;

    texture_thumb_3d_maze_b(THREE, pic.url, renderer, maze_dict,(tex, ratio) => {
        if (!tex){
            const t = placeholder_texture_3d_maze_b(THREE);
            applyAspect(1);
            canvas.material.map = t;
            canvas.material.needsUpdate = true;
            return;
        }
        applyAspect(ratio);                    // 真实宽高比 → 顺带算好 viewPos
        canvas.material.map = tex;
        canvas.material.needsUpdate = true;
    });

    return g;
}

function placeholder_texture_3d_maze_b(THREE){
    if (SHARED_PLACEHOLDER){ return SHARED_PLACEHOLDER; }
    const cv = document.createElement('canvas');
    cv.width = cv.height = 128;                    // 512 → 128
    const g = cv.getContext('2d');
    g.fillStyle = '#2a3348'; g.fillRect(0, 0, 128, 128);
    g.strokeStyle = 'rgba(255,255,255,.3)'; g.lineWidth = 3;
    g.strokeRect(8, 8, 112, 112);
    SHARED_PLACEHOLDER = new THREE.CanvasTexture(cv);
    SHARED_PLACEHOLDER.colorSpace = THREE.SRGBColorSpace;
    SHARED_PLACEHOLDER.generateMipmaps = false;
    SHARED_PLACEHOLDER.minFilter = THREE.LinearFilter;
    return SHARED_PLACEHOLDER;
}

function pick_art_3d_maze_b(ev, artGroup, pointer, raycaster, camera, r){
    if (!artGroup.visible){ return null; }

    pointer.x =  ((ev.clientX - r.left) / r.width)  * 2 - 1;
    pointer.y = -((ev.clientY - r.top)  / r.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(artGroup.children, true);
    const dir = raycaster.ray.direction;          // 世界空间射线方向（已归一化）

    for (const h of hits){
        let o = h.object;
        while (o && !o.userData.pic){ o = o.parent; }
        if (!o){ continue; }

        const pic = o.userData.pic;
        // ★ 背面剔除：射线必须与画面法线相反（dot < 0）才算从正面看
        const n = pic.normal;
        if (n && (dir.x * n.x + dir.z * n.z) >= -0.02){ continue; }

        return pic;
    }
    return null;
}

function on_hover_3d_maze_b(ev,renderer,artGroup,pointer,raycaster,camera){
    const r = renderer.domElement.getBoundingClientRect();
    renderer.domElement.style.cursor = pick_art_3d_maze_b(ev,artGroup,pointer,raycaster,camera,r) ? 'pointer' : 'default';
}

function pointerup_3d_maze_b(ev,downXY,renderer,artGroup,pointer,raycaster,camera,controls,camAnim,img_id,cap_id,box_id,r,is_frontal,show_big_photo){
    function sub_pointerup_3d_maze_b_fly_to(pos, target, dur = 800){
        camAnim = { fp: camera.position.clone(), ft: controls.target.clone(), tp: pos, tt: target, t: 0, dur };
    }

    const moved = Math.hypot(ev.clientX - downXY.x, ev.clientY - downXY.y);
    downXY = null;
    if (moved > 5){
        return [downXY,camAnim];
    }             // 拖动旋转视角时不触发点击
    
    const pic = pick_art_3d_maze_b(ev,artGroup,pointer,raycaster,camera,r);
    if (pic){
        if (show_big_photo){
            document.getElementById(img_id).src='';
            //document.getElementById(img_id).src = pic.full || pic.url;
            document.getElementById(img_id).src = pic.url;
            document.getElementById(cap_id).textContent = pic.title || '';
            document.getElementById(box_id).style.display='flex';
        }
        if (is_frontal && pic.viewPos){
            sub_pointerup_3d_maze_b_fly_to(pic.viewPos, pic.viewTarget, 800);   // 视角切到画的正前方
        }
    }
    return [downXY,camAnim];
}

function texture_thumb_3d_maze_b(THREE, url, renderer, maze_dict, cb){
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        let w = img.width, h = img.height;
        const s = maze_dict['tex_max_side'] / Math.max(w, h);
        if (s < 1){
            w = Math.max(1, Math.round(w * s)); 
            h = Math.max(1, Math.round(h * s));
        }
        let tex = null;
        try {
            const cv = document.createElement('canvas');
            cv.width = w; cv.height = h;
            cv.getContext('2d').drawImage(img, 0, 0, w, h);
            tex = new THREE.CanvasTexture(cv);
        } catch(e){
            tex = null;
        }              // 跨域无 CORS → fallback
        
        if (!tex){
            tex = new THREE.Texture(img); 
            tex.needsUpdate = true; 
        }
        
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = false;           // ★ 省 33%
        tex.minFilter = THREE.LinearFilter;    // ★ 关 mipmap 必须配对
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        cb(tex, img.width / img.height);
    };
    img.onerror = () => cb(null, 1);
    img.src = url;
}
