function variance_b(cslist){
    var sum=0;
    for (let item of cslist){
        sum=sum+item;          
    }
    var ave=sum/cslist.length;
    var variance=0;
    for (let item of cslist){
        variance=variance+Math.pow((ave-item),2);   
    }
    return variance/cslist.length;  //结果和Python等不一致 - 保留注释
}

function length_angle_2_xy_b(cslen,csangle){
    //指定长度和角度，求坐标
    var radians = csangle * Math.PI / 180; // 将角度转换为弧度
    var x = cslen * Math.cos(radians); // 计算余弦值并乘以长度
    var y = cslen * Math.sin(radians);
    return [x,y];
}

function triangle_third_side_b(line_a, line_b, angleC){
    //已知两边和夹角度数，求第三边长度
    var rad = angleC * Math.PI / 180; // 将角度转换为弧度    
    var line_c = Math.sqrt(line_a**2 + line_b**2 - 2*line_a*line_b*Math.cos(rad));
    return line_c;
}

function triangle_angles_b(line_a, line_b, line_c){
    //已知三角形三边长度，求三个角度数
    var cosA = (line_b**2 + line_c**2 - line_a**2) / (2 * line_b * line_c);
    var cosB = (line_a**2 + line_c**2 - line_b**2) / (2 * line_a * line_c);
    var cosC = (line_a**2 + line_b**2 - line_c**2) / (2 * line_a * line_b);
    
    var radiansA = Math.acos(cosA); // 计算cosA的反余弦值（弧度）
    var radiansB = Math.acos(cosB);
    var radiansC = Math.acos(cosC);

    var angleA = radiansA * 180 / Math.PI; // 将弧度转换为角度
    var angleB = radiansB * 180 / Math.PI;
    var angleC = radiansC * 180 / Math.PI;

    return [angleA, angleB, angleC];
}

function two_lines_intersection_b(x1, y1, x2, y2, x3, y3, x4, y4){
    if (x1==x2 || x3==x4){return [false,false];}
    
    var k1 = (y2 - y1) / (x2 - x1);
    var b1 = y1 - k1 * x1;
    var k2 = (y4 - y3) / (x4 - x3);
    var b2 = y3 - k2 * x3;

    if (k1==k2){return [false,false];}
    var x = (b2 - b1) / (k1 - k2);
    var y = k1 * x + b1;
    return [x, y];
}

function trangle_the_third_xy_b(A, B, angle,distance){
    // 计算AB线段的向量
    const vectorAB = { 'x': B[0] - A[0], 'y': B[1] - A[1] };

    // 计算旋转角度（弧度）
    const radians = (angle * Math.PI) / 180;

    // 计算旋转后的向量
    const rotatedVector = {
    'x': vectorAB.x * Math.cos(radians) - vectorAB.y * Math.sin(radians),
    'y': vectorAB.x * Math.sin(radians) + vectorAB.y * Math.cos(radians),
    };

    // 计算旋转后向量的长度
    const rotatedVectorLength = Math.sqrt(rotatedVector.x * rotatedVector.x + rotatedVector.y * rotatedVector.y);

    // 将旋转后的向量缩放为所需长度
    const scaleFactor = distance / rotatedVectorLength;
    const scaledVector = { 'x': rotatedVector.x * scaleFactor, 'y': rotatedVector.y * scaleFactor};

    // 计算点C的坐标
    return [A[0]+scaledVector.x, A[1]+scaledVector.y];
}

function  distance_b(pointA,pointB){
    return Math.sqrt((pointB[0] - pointA[0])**2 + (pointB[1] - pointA[1])**2);
}

function canvas_draw_line_b(pointA,pointB,ctx,cscolor='',dash_style=[]){
    //canvas_draw_line_b([0,0],pointB,ctx,'black',[3,3]); - 保留注释
    if (cscolor!==''){
        ctx.strokeStyle = cscolor;
    }
    if (dash_style.length==2){
        ctx.setLineDash(dash_style);
    }
    ctx.beginPath();    
    ctx.moveTo(pointA[0], pointA[1]);
    ctx.lineTo(pointB[0], pointB[1]);
    ctx.stroke();
    if (dash_style.length==2){
        ctx.setLineDash([]);        
    }    
}

function canvas_center_axis_b(canvas,ctx,centerX=false,centerY=false){
    // 获取图形的中心坐标
    if (centerX===false){
        centerX=0.5;
    }
    if (centerY===false){    
        centerY = 0.5;
    }
    
    if (centerX<1){
        centerX = canvas.width * centerX;    
    }
    if (centerY<1){
        centerY = canvas.height * centerY;
    }

    // 将坐标系原点移动到图形的中心
    ctx.translate(centerX, centerY);

    // 将 y 轴进行翻转
    ctx.scale(1, -1);
}

function median_b(csarr,cstype=0.5,do_sort=true){  
    //https://snippets.bentasker.co.uk/page-1907020841-Calculating-Mean,-Median,-Mode,-Range-and-Percentiles-with-Javascript-Javascript.html - 保留注释
    if (do_sort){
        csarr.sort(function (a,b){return a>b ? 1 : -1;});    
    }
 
    var p = (csarr.length - 1) * cstype;
    var b = Math.floor(p);

    var remainder = p - b;

    if (csarr[b+1]!==undefined){
        return parseFloat(csarr[b]) + remainder * (parseFloat(csarr[b+1]) - parseFloat(csarr[b]));
    } else {
        return parseFloat(csarr[b]);
    }
}

function describe_b(csarr,cstype=''){  
    cstype=cstype.toLowerCase();
    
    let count = csarr.length;  
    let sum = csarr.reduce((a, b) => a + b, 0);
    let mean = sum / count;
    let deviations=csarr.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
    let std = Math.sqrt(deviations / csarr.length);
    if (['std','stdp','std.p','std_p','stdevp','stdev.p','stdev_p'].includes(cstype)){ //总体标准差 - 保留注释
        return std;
    }

    let std_s = Math.sqrt(deviations / (csarr.length-1));
    if (['stds','std.s','std_s','stdevs','stdev.s','stdev_s'].includes(cstype)){ //样本标准差 - 保留注释
        return std_s;
    }
    
    let min = Math.min(...csarr);
    let max = Math.max(...csarr);

    csarr.sort(function (a,b){return a>b ? 1 : -1;});

    let p25 = median_b(csarr,0.25,false);
    let median = median_b(csarr,0.5,false);
    let p75 = median_b(csarr,0.75,false);

    return {  
        'count': count,  
        'sum': sum,
        'mean': mean,  
        'std_p': std,  
        'std_s': std_s,
        'min': min,  
        '25%': p25,  
        '50%': median,  
        '75%': p75,  
        'max': max,
    };  
}  


function arrary_remove_empty_rows_columns_b(matrix, placeholder = ' '){
    //删除全部是指定字符串的行列
    if (!matrix.length) return [];
    
    // 步骤1: 检查并标记全为占位符的行
    const rowsToDelete = [];
    for (let rowIndex = 0, lent= matrix.length;  rowIndex < lent; rowIndex++){
        if (matrix[rowIndex].every(cell => cell === placeholder)){
            rowsToDelete.push(rowIndex);
        }
    }
    
    // 步骤2: 从后往前删除标记的行
    for (let deleteIndex = rowsToDelete.length - 1; deleteIndex >= 0; deleteIndex--){
        matrix.splice(rowsToDelete[deleteIndex], 1);
    }
    
    // 如果行被删光了，直接返回空数组
    if (matrix.length === 0) return [];
    
    // 步骤3: 在删除空行后的新矩阵上，检查并标记全为占位符的列
    const colsToDelete = [];
    const colCount = matrix[0].length;
    for (let colIndex = 0; colIndex < colCount; colIndex++){
        let isColumnEmpty = true;
        for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++){
            if (matrix[rowIndex][colIndex] !== placeholder){
                isColumnEmpty = false;
                break;
            }
        }
        if (isColumnEmpty){
            colsToDelete.push(colIndex);
        }
    }
    
    // 步骤4: 从后往前删除标记的列（优化版：使用map和filter）
    return matrix.map(row => 
        row.filter((_, colIndex) => !colsToDelete.includes(colIndex))
    );
}

function array_find_replace_b(csarr,find_str=' ',replace_to='.'){
    //替换二维数组元素
    let result = [];
    for (let arow of csarr){
        let line = [];
        for (let acol of arow){
            // 使用占位符显示空格
            line.push(acol === find_str ? replace_to : acol);
        }
        result.push(line);
    }
    return result;
}
