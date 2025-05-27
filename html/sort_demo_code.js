// 生成随机数组
function generate_array_sort_demo(){
    arr_raw_sort_demo_global = Array.from({length: len_sort_demo_global}, () => Math.floor(Math.random() * 380) + 20);
}

// 绘制柱状图
function draw_bars_sort_demo(highlight = []){
    ctx_sort_demo_global.clearRect(0, 0, ocanvas_sort_demo_global.width, ocanvas_sort_demo_global.height);
    const barWidth = ocanvas_sort_demo_global.width / len_sort_demo_global;
    
    arr_current_sort_demo_global.forEach((value, blxl) => {
        ctx_sort_demo_global.fillStyle = highlight.includes(blxl) ? '#ff4444' : '#4CAF50';
        ctx_sort_demo_global.fillRect(blxl * barWidth, ocanvas_sort_demo_global.height - value, barWidth - 2, value);
    });
    
    step_sort_demo_global=step_sort_demo_global+1;
    table_sort_demo();
    arr_old_sort_demo_global=[].concat(arr_current_sort_demo_global);
}

function table_sort_demo(){
    var result_t=[];
    for (let blxl=0;blxl<len_sort_demo_global;blxl++){
        if (arr_current_sort_demo_global[blxl]==arr_old_sort_demo_global[blxl]){
            result_t.push('<td align=right>'+arr_current_sort_demo_global[blxl]+'</td>');
        } else {
            result_t.push('<td align=right style="color:red;">'+arr_current_sort_demo_global[blxl]+'</td>');
        }
    }
    
    var blstr='<tr><td><b>'+step_sort_demo_global+'</b></td>'+result_t.join('')+'</tr>';
    otable_sort_demo_global.insertAdjacentHTML('beforeend',blstr);
}

async function bubble_sort_demo(){
    for (let blxl = 0; blxl < len_sort_demo_global; blxl++){
        for (let blno = 0; blno < len_sort_demo_global - blxl - 1; blno++){
            if (arr_current_sort_demo_global[blno] > arr_current_sort_demo_global[blno + 1]){
                // 如果当前元素大于后一个元素，则交换它们的位置（冒泡操作）
                [arr_current_sort_demo_global[blno], arr_current_sort_demo_global[blno + 1]] = [arr_current_sort_demo_global[blno + 1], arr_current_sort_demo_global[blno]];
                draw_bars_sort_demo([blno, blno + 1]);
                await new Promise(resolve => setTimeout(resolve, delay_sort_demo_global));
            }
        }
    }
}

async function selection_sort_demo(){
    //寻找最小值：从未排序部分找出最小值。
    //交换位置：将找到的最小值与未排序部分的第一个元素交换位置。

    for (let blxl = 0; blxl < len_sort_demo_global; blxl++){
        let minIdx = blxl;
        for (let blno = blxl + 1; blno < len_sort_demo_global; blno++){
            // 如果找到更小的值，更新 minIdx
            if (arr_current_sort_demo_global[blno] < arr_current_sort_demo_global[minIdx]){
                minIdx = blno;
            }
        }
        [arr_current_sort_demo_global[blxl], arr_current_sort_demo_global[minIdx]] = [arr_current_sort_demo_global[minIdx], arr_current_sort_demo_global[blxl]];
        draw_bars_sort_demo([blxl, minIdx]);
        await new Promise(resolve => setTimeout(resolve, delay_sort_demo_global));
    }
}

function statistics_sort_demo(){
    var result_t=mark_check_b('init_sort_demo','end',sub_fix_sort_demo_global,['start','end'],true);

    if (result_t[2]===false){
        document.getElementById('span_info').innerHTML='';
    } else {
        var list1=[].concat(arr_raw_sort_demo_global);
        list1.sort(function (a,b){return a<b?-1:1;});
        var list2=[].concat(arr_current_sort_demo_global);
        list2.sort(function (a,b){return a<b?-1:1;});
        if (list1.toString()==list2.toString()){
            var bljg='数组一致，';
        } else {
            var bljg='数组不一致，';
        }

        if (list2.toString()==arr_current_sort_demo_global.toString()){
            bljg=bljg+'结果正确';
        } else {
            bljg=bljg+'结果不正确';
        }
        
        document.getElementById('span_info').innerHTML='步骤：'+step_sort_demo_global+'，费时：'+result_t[2].duration+'毫秒，'+bljg;
    }
}

async function merge_run_sort_demo(start = 0, end = len_sort_demo_global - 1) {
    // 如果当前子数组只有一个元素或为空，则无需排序
    if (start >= end){return;}

    // 分割数组：找到中间位置
    let mid = Math.floor((start + end) / 2);

    // 分治：递归对左半部分和右半部分进行排序
    await merge_run_sort_demo(start, mid);
    await merge_run_sort_demo(mid + 1, end);

    // 合并两个有序子数组
    await merge_last_step_sort_demo(start, mid, end);
}

async function merge_last_step_sort_demo(start, mid, end){
    // 创建两个临时数组来保存左右两部分
    const left = arr_current_sort_demo_global.slice(start, mid + 1);
    const right = arr_current_sort_demo_global.slice(mid + 1, end + 1);

    let blxl = 0; // 遍历 left 的指针
    let blno = 0; // 遍历 right 的指针
    let blk = start; // 主数组写入位置

    // 合并 left 和 right 到主数组中，哪个更小就放到主数组中，并移动相应指针。
    while (blxl < left.length && blno < right.length){
        if (left[blxl] <= right[blno]){
            arr_current_sort_demo_global[blk++] = left[blxl++];
        } else {
            arr_current_sort_demo_global[blk++] = right[blno++];
        }

        // 每次更新一个位置后调用 draw_bars_sort_demo 进行高亮显示
        draw_bars_sort_demo([blk - 1]); // 高亮当前正在设置的位置

        // 延迟以实现动画效果
        await new Promise(resolve => setTimeout(resolve, delay_sort_demo_global));
    }

    // 处理 left 中剩余元素
    while (blxl < left.length){
        arr_current_sort_demo_global[blk++] = left[blxl++];
        draw_bars_sort_demo([blk - 1]);
        await new Promise(resolve => setTimeout(resolve, delay_sort_demo_global));
    }

    // 处理 right 中剩余元素
    while (blno < right.length){
        arr_current_sort_demo_global[blk++] = right[blno++];
        draw_bars_sort_demo([blk - 1]);
        await new Promise(resolve => setTimeout(resolve, delay_sort_demo_global));
    }
}

function load_sort_demo(){
    ocanvas_sort_demo_global = document.getElementById('canvas');
    ctx_sort_demo_global = canvas.getContext('2d');
    
    arr_raw_sort_demo_global = [];
    arr_current_sort_demo_global = [];
    arr_old_sort_demo_global = [];
    len_sort_demo_global = 15; // 数组长度
    delay_sort_demo_global=50;
    otable_sort_demo_global=document.getElementById('table_steps_sort_demo');
    step_sort_demo_global=0;
    sub_fix_sort_demo_global='';

    generate_array_sort_demo();
}

async function init_sort_demo(algorithm){
    draw_bars_sort_demo();
    
    arr_current_sort_demo_global=[].concat(arr_raw_sort_demo_global);
    arr_old_sort_demo_global=[].concat(arr_current_sort_demo_global);
    otable_sort_demo_global.innerHTML='';
    document.getElementById('span_info').innerHTML='';
    step_sort_demo_global=0;
    table_sort_demo();
    
    sub_fix_sort_demo_global=mark_check_b('init_sort_demo','start')[0];
    switch (algorithm){
        case 'bubble': 
            await bubble_sort_demo(); 
            break;
        case 'selection': 
            await selection_sort_demo(); 
            break;
        case 'merge': 
            await merge_run_sort_demo(); 
            break;
        case 'insertion': 
            await insertion_sort_demo(); 
            break;
    }
    draw_bars_sort_demo();
    statistics_sort_demo();
}

async function insertion_sort_demo(){
    //插入排序的基本思想

    //将数组分为两个部分：
    /* 已排序部分（初始时只有第一个元素） */
    /* 未排序部分 */
    
    //# 每次从未排序部分取出一个元素（称为“当前元素”），从后向前扫描已排序部分。
    //# 如果已排序部分中有比当前元素大的值，则将它们向后移动一位，腾出空间。
    //# 找到合适位置后，将当前元素插入进去。
    //# 重复这个过程，直到所有元素都被插入到正确位置。

    for (let blxl = 1; blxl < arr_current_sort_demo_global.length; blxl++){
        let current = arr_current_sort_demo_global[blxl];
        let blno = blxl - 1;
        
        // 将当前元素与已排序部分比较
        while (blno >= 0 && arr_current_sort_demo_global[blno] > current){
            // 如果前面的元素比当前元素大，则将其向右移动一位
            arr_current_sort_demo_global[blno + 1] = arr_current_sort_demo_global[blno];  // 向右移动元素
            draw_bars_sort_demo([blno, blno+1]);   // 高亮移动的柱体
            await new Promise(resolve => setTimeout(resolve, delay_sort_demo_global)); // 添加延时
            blno--;
        }
        arr_current_sort_demo_global[blno + 1] = current;     // 插入到正确位置
        draw_bars_sort_demo([blno+1]);          // 更新当前插入位置
    }
}
