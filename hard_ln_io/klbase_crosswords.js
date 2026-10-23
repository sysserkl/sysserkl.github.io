//-----------------------
//history
//0.0.1-20251126 通过 千问+腾讯元宝 生成
//0.0.1-20251126
//-----------------------
function crosswords_b(csarr, csw, csh, is_random,show_status) {
    // 填字游戏生成器 - 前缀和变量名优化版
    
    /**
     * 创建填字游戏生成器实例
     * @param {number} width - 游戏网格宽度
     * @param {number} height - 游戏网格高度
     * @returns {Object} 生成器对象，包含网格和已放置单词信息
     */
    function sub_crosswords_b_create_generator(width = 15, height = 15) {
        const grid = sub_crosswords_b_create_grid(width, height);
        const placed_words = [];

        return {
            width: width,
            height: height,
            grid: grid,
            placed_words: placed_words
        };
    }

    /**
     * 创建指定大小的空白网格
     * @param {number} grid_width - 网格宽度
     * @param {number} grid_height - 网格高度  
     * @returns {Array} 二维数组表示的网格，初始填充空格
     */
    function sub_crosswords_b_create_grid(grid_width, grid_height) {
        const new_grid = [];
        for (let row_index = 0; row_index < grid_height; row_index++) {
            new_grid.push(Array(grid_width).fill(' '));
        }
        return new_grid;
    }

    /**
     * 对单词列表按长度进行降序排序（长单词优先放置）
     * @param {Array} word_list - 待排序的单词数组
     * @returns {Array} 按长度降序排列的单词数组
     */
    function sub_crosswords_b_sort_words(word_list) {
        return word_list.slice().sort((word_a, word_b) => word_b.length - word_a.length);
    }

    /**
     * 验证单词列表的有效性
     * @param {Array} word_list - 待验证的单词数组
     * @returns {Array} 有效的、去重且大写的单词数组
     * @throws {Error} 当单词列表为空或没有有效单词时抛出错误
     */
    function sub_crosswords_b_validate_words(word_list) {
        // 检查单词列表是否为空
        if (!word_list || word_list.length === 0) {
            throw new Error('单词列表不能为空');
        }

        // 过滤出只包含字母的有效单词
        const valid_words = word_list.filter(word => /^[A-Za-z]+$/.test(word));
        if (valid_words.length === 0) {
            throw new Error('没有有效的单词（应只包含字母）');
        }

        // 去重并转换为大写
        const unique_words = [...new Set(valid_words.map(word => word.toUpperCase()))];
        return unique_words;
    }

    /**
     * 检查坐标是否在网格范围内
     * @param {Object} generator - 生成器实例
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @returns {boolean} 坐标是否有效
     */
    function sub_crosswords_b_is_valid_pos(generator, row, col) {
        return row >= 0 && row < generator.height && col >= 0 && col < generator.width;
    }

    /**
     * 检查是否可以在指定位置水平放置单词
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @param {number} row - 起始行坐标
     * @param {number} col - 起始列坐标
     * @returns {boolean} 是否可以放置
     */
    function sub_crosswords_b_can_place_h(generator, word, row, col) {
        const { width, height, grid, placed_words } = generator;

        // 检查边界条件：确保单词不会超出网格
        if (col < 0 || row < 0 || col + word.length > width || row >= height) return false;

        // 检查单词前后的空格：确保单词前后有边界或空格
        if (col > 0 && grid[row][col - 1] !== ' ') return false;
        if (col + word.length < width && grid[row][col + word.length] !== ' ') return false;

        // 遍历单词的每个字符位置
        for (let char_index = 0; char_index < word.length; char_index++) {
            const current_col = col + char_index;
            const cell = grid[row][current_col];

            // 检查单元格是否为空或与当前字符匹配
            if (cell !== ' ' && cell !== word[char_index]) return false;

            // 检查上方单元格：如果有字符，必须与垂直单词交叉
            if (row > 0) {
                const up = grid[row - 1][current_col];
                if (up !== ' ') {
                    const is_crossed = placed_words.some(placed =>
                        placed.direction === 'vertical' &&
                        placed.col === current_col &&
                        placed.row <= row && row < placed.row + placed.word.length
                    );
                    if (!is_crossed) return false;
                }
            }

            // 检查下方单元格：如果有字符，必须与垂直单词交叉
            if (row < height - 1) {
                const down = grid[row + 1][current_col];
                if (down !== ' ') {
                    const is_crossed = placed_words.some(placed =>
                        placed.direction === 'vertical' &&
                        placed.col === current_col &&
                        placed.row <= row && row < placed.row + placed.word.length
                    );
                    if (!is_crossed) return false;
                }
            }
        }

        return true;
    }

    /**
     * 检查是否可以在指定位置垂直放置单词
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @param {number} row - 起始行坐标
     * @param {number} col - 起始列坐标
     * @returns {boolean} 是否可以放置
     */
    function sub_crosswords_b_can_place_v(generator, word, row, col) {
        const { width, height, grid, placed_words } = generator;

        // 检查边界条件
        if (col < 0 || row < 0 || row + word.length > height || col >= width) return false;

        // 检查单词上下的空格
        if (row > 0 && grid[row - 1][col] !== ' ') return false;
        if (row + word.length < height && grid[row + word.length][col] !== ' ') return false;

        // 遍历单词的每个字符位置
        for (let char_index = 0; char_index < word.length; char_index++) {
            const current_row = row + char_index;
            const cell = grid[current_row][col];

            // 检查单元格匹配情况
            if (cell !== ' ' && cell !== word[char_index]) return false;

            // 检查左侧单元格：如果有字符，必须与水平单词交叉
            if (col > 0) {
                const left = grid[current_row][col - 1];
                if (left !== ' ') {
                    const is_crossed = placed_words.some(placed =>
                        placed.direction === 'horizontal' &&
                        placed.row === current_row &&
                        placed.col <= col && col < placed.col + placed.word.length
                    );
                    if (!is_crossed) return false;
                }
            }

            // 检查右侧单元格：如果有字符，必须与水平单词交叉
            if (col < width - 1) {
                const right = grid[current_row][col + 1];
                if (right !== ' ') {
                    const is_crossed = placed_words.some(placed =>
                        placed.direction === 'horizontal' &&
                        placed.row === current_row &&
                        placed.col <= col && col < placed.col + placed.word.length
                    );
                    if (!is_crossed) return false;
                }
            }
        }

        return true;
    }

    /**
     * 在网格上水平放置单词
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @param {number} row - 起始行坐标
     * @param {number} col - 起始列坐标
     * @returns {Object} 放置的单词信息对象
     */
    function sub_crosswords_b_place_h(generator, word, row, col) {
        // 将单词的每个字符写入网格
        for (let char_index = 0; char_index < word.length; char_index++) {
            if (col + char_index < generator.width) {
                generator.grid[row][col + char_index] = word[char_index];
            }
        }
        return {
            word: word,
            row: row,
            col: col,
            direction: 'horizontal'
        };
    }

    /**
     * 在网格上垂直放置单词
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @param {number} row - 起始行坐标
     * @param {number} col - 起始列坐标
     * @returns {Object} 放置的单词信息对象
     */
    function sub_crosswords_b_place_v(generator, word, row, col) {
        for (let char_index = 0; char_index < word.length; char_index++) {
            if (row + char_index < generator.height) {
                generator.grid[row + char_index][col] = word[char_index];
            }
        }
        return {
            word: word,
            row: row,
            col: col,
            direction: 'vertical'
        };
    }

    /**
     * 计算第一个单词的起始位置（尽量放在网格中心）
     * @param {Object} generator - 生成器实例
     * @param {string} word - 第一个单词
     * @returns {Object} 推荐的位置坐标 {row, col}
     */
    function sub_crosswords_b_first_word_pos(generator, word) {
        const center_row = Math.floor(generator.height / 2);
        const center_col = Math.max(0, Math.floor((generator.width - word.length) / 2));
        return { row: center_row, col: center_col };
    }

    /**
     * 放置第一个单词（尝试中心和周围位置）
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @returns {Object} 放置的单词信息
     * @throws {Error} 当无法放置第一个单词时抛出错误
     */
    function sub_crosswords_b_place_first(generator, word) {
        // 尝试中心位置
        const position = sub_crosswords_b_first_word_pos(generator, word);

        // 优先尝试水平放置
        if (sub_crosswords_b_can_place_h(generator, word, position.row, position.col)) {
            return sub_crosswords_b_place_h(generator, word, position.row, position.col);
        }

        // 尝试垂直放置
        if (sub_crosswords_b_can_place_v(generator, word, position.row, position.col)) {
            return sub_crosswords_b_place_v(generator, word, position.row, position.col);
        }

        // 如果中心位置不可用，尝试周围的偏移位置
        for (let offset = 1; offset <= 5; offset++) {
            const positions = [
                { row: position.row - offset, col: position.col, dir: 'horizontal' },
                { row: position.row + offset, col: position.col, dir: 'horizontal' },
                { row: position.row, col: position.col - offset, dir: 'horizontal' },
                { row: position.row, col: position.col + offset, dir: 'horizontal' },
                { row: position.row - offset, col: position.col, dir: 'vertical' },
                { row: position.row + offset, col: position.col, dir: 'vertical' },
                { row: position.row, col: position.col - offset, dir: 'vertical' },
                { row: position.row, col: position.col + offset, dir: 'vertical' }
            ];

            // 尝试所有偏移位置
            for (const pos of positions) {
                if (pos.dir === 'horizontal' && sub_crosswords_b_can_place_h(generator, word, pos.row, pos.col)) {
                    return sub_crosswords_b_place_h(generator, word, pos.row, pos.col);
                }
                if (pos.dir === 'vertical' && sub_crosswords_b_can_place_v(generator, word, pos.row, pos.col)) {
                    return sub_crosswords_b_place_v(generator, word, pos.row, pos.col);
                }
            }
        }

        throw new Error(`无法放置第一个单词: ${word}`);
    }

    /**
     * 计算位置得分（用于选择最佳交叉位置）
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @param {number} row - 行坐标
     * @param {number} col - 列坐标
     * @param {string} direction - 放置方向
     * @returns {number} 位置得分（越高越好）
     */
    function sub_crosswords_b_calc_score(generator, word, row, col, direction) {
        let score = 0;

        // 距离中心越近得分越高
        const center_row = Math.floor(generator.height / 2);
        const center_col = Math.floor(generator.width / 2);
        const distance = Math.abs(row - center_row) + Math.abs(col - center_col);
        score += Math.max(0, 10 - distance);

        // 长单词得分更高
        score += word.length * 0.5;

        // 平衡水平单词和垂直单词的数量
        const horizontal_count = generator.placed_words.filter(w => w.direction === 'horizontal').length;
        const vertical_count = generator.placed_words.filter(w => w.direction === 'vertical').length;

        if (direction === 'horizontal' && vertical_count > horizontal_count) {
            score += 2; // 如果垂直单词多，鼓励放置水平单词
        } else if (direction === 'vertical' && horizontal_count > vertical_count) {
            score += 2; // 如果水平单词多，鼓励放置垂直单词
        }

        return score;
    }

    /**
     * 查找可以与已放置单词交叉的位置
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @returns {Object|null} 最佳交叉位置信息，如果没有找到返回null
     */
    function sub_crosswords_b_find_cross(generator, word) {
        const possible_positions = [];

        // 遍历所有已放置的单词，寻找交叉点
        for (const placed_word of generator.placed_words) {
            for (let word_index = 0; word_index < word.length; word_index++) {
                for (let placed_index = 0; placed_index < placed_word.word.length; placed_index++) {
                    // 找到字符匹配的位置
                    if (word[word_index] === placed_word.word[placed_index]) {
                        if (placed_word.direction === 'horizontal') {
                            // 水平单词与垂直单词交叉
                            const cross_row = placed_word.row;
                            const cross_col = placed_word.col + placed_index;
                            const start_row = cross_row - word_index;

                            if (sub_crosswords_b_can_place_v(generator, word, start_row, cross_col)) {
                                possible_positions.push({
                                    row: start_row,
                                    col: cross_col,
                                    direction: 'vertical',
                                    crossing_word: placed_word.word,
                                    score: sub_crosswords_b_calc_score(generator, word, start_row, cross_col, 'vertical')
                                });
                            }
                        } else {
                            // 垂直单词与水平单词交叉
                            const cross_row = placed_word.row + placed_index;
                            const cross_col = placed_word.col;
                            const start_col = cross_col - word_index;

                            if (sub_crosswords_b_can_place_h(generator, word, cross_row, start_col)) {
                                possible_positions.push({
                                    row: cross_row,
                                    col: start_col,
                                    direction: 'horizontal',
                                    crossing_word: placed_word.word,
                                    score: sub_crosswords_b_calc_score(generator, word, cross_row, start_col, 'horizontal')
                                });
                            }
                        }
                    }
                }
            }
        }

        // 按得分排序，选择最佳位置
        if (possible_positions.length > 0) {
            possible_positions.sort((pos_a, pos_b) => pos_b.score - pos_a.score);
            return possible_positions[0];
        }

        return null;
    }

    /**
     * 尝试在空白区域放置单词
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @returns {Object|null} 可放置的位置信息，如果没有返回null
     */
    function sub_crosswords_b_try_empty(generator, word) {
        // 遍历网格中的所有位置
        for (let row_index = 0; row_index < generator.height; row_index++) {
            for (let col_index = 0; col_index < generator.width; col_index++) {
                // 尝试水平放置
                if (sub_crosswords_b_can_place_h(generator, word, row_index, col_index)) {
                    return {
                        row: row_index,
                        col: col_index,
                        direction: 'horizontal',
                        type: 'empty_area'
                    };
                }
                // 尝试垂直放置
                if (sub_crosswords_b_can_place_v(generator, word, row_index, col_index)) {
                    return {
                        row: row_index,
                        col: col_index,
                        direction: 'vertical',
                        type: 'empty_area'
                    };
                }
            }
        }
        return null;
    }

    /**
     * 尝试放置单个单词
     * @param {Object} generator - 生成器实例
     * @param {string} word - 要放置的单词
     * @returns {boolean} 是否成功放置
     */
    function sub_crosswords_b_place_word(generator, word) {
        // 检查单词是否已经放置
        if (generator.placed_words.some(placed_word => placed_word.word === word)) {
            return false;
        }

        // 如果是第一个单词，使用特殊放置逻辑
        if (generator.placed_words.length === 0) {
            try {
                const placed_word = sub_crosswords_b_place_first(generator, word);
                generator.placed_words.push(placed_word);
                return true;
            } catch (error) {
                console.warn(error.message);
                return false;
            }
        }

        // 优先尝试交叉放置
        let position = sub_crosswords_b_find_cross(generator, word);
        if (position) {
            const placed_word = position.direction === 'horizontal'
                ? sub_crosswords_b_place_h(generator, word, position.row, position.col)
                : sub_crosswords_b_place_v(generator, word, position.row, position.col);
            generator.placed_words.push(placed_word);
            return true;
        }

        // 如果没有交叉位置，尝试空白区域
        position = sub_crosswords_b_try_empty(generator, word);
        if (position) {
            const placed_word = position.direction === 'horizontal'
                ? sub_crosswords_b_place_h(generator, word, position.row, position.col)
                : sub_crosswords_b_place_v(generator, word, position.row, position.col);
            generator.placed_words.push(placed_word);
            return true;
        }

        return false;
    }

    /**
     * 生成填字游戏的主要逻辑
     * @param {Object} generator - 生成器实例
     * @param {Array} words - 单词列表
     * @returns {Object} 生成结果，包含网格和统计信息
     */
    function sub_crosswords_b_generate(generator, words) {
        // 验证和预处理单词
        const valid_words = sub_crosswords_b_validate_words(words);
        const sorted_words = sub_crosswords_b_sort_words(valid_words);

        if (sorted_words.length === 0) {
            return sub_crosswords_b_get_result(generator, valid_words.length);
        }

        let placed_count = 0;
        let max_attempts = sorted_words.length * 3; // 最大尝试次数
        let attempts = 0;

        const working_list = [...sorted_words]; // 工作副本

        // 尝试放置所有单词
        while (working_list.length > 0 && attempts < max_attempts) {
            const word = working_list[0];

            if (sub_crosswords_b_place_word(generator, word)) {
                working_list.shift(); // 成功放置，从列表中移除
                placed_count++;
            } else {
                working_list.push(working_list.shift()); // 无法放置，移到列表末尾
            }

            attempts++;
        }

        return sub_crosswords_b_get_result(generator, valid_words.length);
    }

    /**
     * 获取生成结果
     * @param {Object} generator - 生成器实例
     * @param {number} total_words - 总单词数
     * @returns {Object} 包含网格、单词列表和统计信息的结果对象
     */
    function sub_crosswords_b_get_result(generator, total_words) {
        const success_rate = total_words > 0 ? (generator.placed_words.length / total_words) * 100 : 0;

        return {
            grid: generator.grid,
            placed_words: generator.placed_words,
            success_rate: success_rate,
            total_words: total_words,
            placed_count: generator.placed_words.length
        };
    }

    /**
     * 获取生成统计信息
     * @param {Object} generator - 生成器实例
     * @param {number} total_words - 总单词数
     * @returns {Object} 统计信息对象
     */
    function sub_crosswords_b_get_stats(generator, total_words) {
        const success_rate = total_words > 0 ? (generator.placed_words.length / total_words) * 100 : 0;

        return {
            placed: generator.placed_words.length,
            total: total_words,
            success_rate: success_rate.toFixed(1) + '%',
            words: generator.placed_words.map((word_info, index) => ({
                number: index + 1,
                word: word_info.word,
                position: `(${word_info.row + 1}, ${word_info.col + 1})`,
                direction: word_info.direction
            }))
        };
    }

    /**
     * 获取连通的单词（确保所有单词都相互连接）
     * @param {Object} generator - 生成器实例
     * @returns {Array} 连通的单词列表
     */
    function sub_crosswords_b_get_connected(generator) {
        const words = generator.placed_words;
        const word_count = words.length;
        if (word_count==0){return [];}
        
        // 构建图结构表示单词之间的连接关系
        const graph = Array(word_count).fill().map(() => []);

        // 为每个单词创建单元格位置集合
        const word_cells = words.map((word_obj, word_index) => {
            const cells = new Set();
            if (word_obj.direction === 'horizontal') {
                for (let char_index = 0; char_index < word_obj.word.length; char_index++) {
                    cells.add(`${word_obj.row},${word_obj.col + char_index}`);
                }
            } else {
                for (let char_index = 0; char_index < word_obj.word.length; char_index++) {
                    cells.add(`${word_obj.row + char_index},${word_obj.col}`);
                }
            }
            return cells;
        });

        // 构建连接图：如果两个单词共享单元格，则它们相连
        for (let first_index = 0; first_index < word_count; first_index++) {
            for (let second_index = first_index + 1; second_index < word_count; second_index++) {
                for (const cell of word_cells[first_index]) {
                    if (word_cells[second_index].has(cell)) {
                        graph[first_index].push(second_index);
                        graph[second_index].push(first_index);
                        break;
                    }
                }
            }
        }

        // 使用BFS查找所有连通的单词
        const visited = new Array(word_count).fill(false);
        const queue = [0];
        visited[0] = true;
        const connected_indices = new Set([0]);

        while (queue.length) {
            const current_index = queue.shift();
            for (const neighbor_index of graph[current_index]) {
                if (!visited[neighbor_index]) {
                    visited[neighbor_index] = true;
                    connected_indices.add(neighbor_index);
                    queue.push(neighbor_index);
                }
            }
        }

        return words.filter((_, word_index) => connected_indices.has(word_index));
    }

    // ========================= 主执行逻辑 =========================
    
    // 随机打乱单词数组以获得不同的布局
    if (is_random){
        csarr.sort(() => Math.random() > 0.5 ? -1 : 1);
    }
    if (show_status){
        console.log('输入单词:', csarr);
    }

    // 创建生成器并生成填字游戏
    const generator = sub_crosswords_b_create_generator(csw, csh);
    const result = sub_crosswords_b_generate(generator, csarr);

    // 确保所有单词都相互连接（移除孤立的单词）
    const connected_words = sub_crosswords_b_get_connected(generator);

    if (connected_words.length > 0) {
        // 清空网格，只保留连通的单词
        for (let row_index = 0; row_index < generator.height; row_index++) {
            for (let col_index = 0; col_index < generator.width; col_index++) {
                generator.grid[row_index][col_index] = ' ';
            }
        }

        // 重新放置连通的单词
        for (const word_obj of connected_words) {
            if (word_obj.direction === 'horizontal') {
                for (let char_index = 0; char_index < word_obj.word.length; char_index++) {
                    if (word_obj.row >= 0 && word_obj.col + char_index >= 0 && 
                        word_obj.row < generator.height && word_obj.col + char_index < generator.width) {
                        generator.grid[word_obj.row][word_obj.col + char_index] = word_obj.word[char_index];
                    }
                }
            } else {
                for (let char_index = 0; char_index < word_obj.word.length; char_index++) {
                    if (word_obj.row + char_index >= 0 && word_obj.col >= 0 && 
                        word_obj.row + char_index < generator.height && word_obj.col < generator.width) {
                        generator.grid[word_obj.row + char_index][word_obj.col] = word_obj.word[char_index];
                    }
                }
            }
        }

        // 更新生成器状态
        generator.placed_words = connected_words;
        result.placed_words = connected_words;
        result.placed_count = connected_words.length;
        result.success_rate = result.total_words > 0 ? (result.placed_count / result.total_words) * 100 : 0;
    }

    // 输出结果    
    if (show_status){
        console.log('\n统计信息:');
        const stats = sub_crosswords_b_get_stats(generator, result.total_words);
        console.log(`成功放置: ${stats.placed}/${stats.total} 个单词`);
        console.log(`成功率: ${stats.success_rate}`);

        // 输出每个单词的详细信息
        if (stats.words.length > 0) {
            console.log('\n单词详情:');
            stats.words.forEach(info => {
                console.log(`${info.number}. ${info.word} - 位置: ${info.position}, 方向: ${info.direction}`);
            });
        }

        // 检查单词重复放置情况
        const word_counts = {};
        let has_duplicates = false;

        result.placed_words.forEach(word_info => {
            word_counts[word_info.word] = (word_counts[word_info.word] || 0) + 1;
        });

        console.log('\n单词出现次数统计:');
        for (const [word, count] of Object.entries(word_counts)) {
            console.log(`${word}: ${count} 次`);
            if (count > 1) {
                console.warn(`⚠️ 单词 "${word}" 被重复放置了 ${count} 次!`);
                has_duplicates = true;
            }
        }

        if (!has_duplicates) {
            console.log('✅ 没有检测到单词重复放置问题');
        }
    }
    return result;
}
