//-----------------------
//history
//0.0.1-20260430 from: 千问
//-----------------------
function image_2_dots_b(originalImg,threshold,dotSize,gap,canvas,ctx,maxWidth=800,bgcolor='#000000'){
    if (!originalImg.src) {return};

    // 1. 准备画布
    const scale = Math.min(1, maxWidth / originalImg.width);
    const blw = Math.floor(originalImg.width * scale);
    const blh = Math.floor(originalImg.height * scale);
    
    canvas.width = blw;
    canvas.height = blh;
    
    // 填充黑色背景
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, blw, blh);

    // 2. 获取图像数据用于边缘检测
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = blw;
    tempCanvas.height = blh;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(originalImg, 0, 0, blw, blh);
    
    const imgData = tempCtx.getImageData(0, 0, blw, blh);
    const data = imgData.data; // RGBA 数据
    const width = imgData.width;
    const height = imgData.height;

    // 3. 简单的 Sobel 边缘检测 (灰度)
    const edges = new Uint8Array(width * height);

    for (let bly = 1; bly < height - 1; bly++){
        for (let blx = 1; blx < width - 1; blx++){
            // 获取周围像素的灰度值
            // 简化版：只计算水平和垂直方向的差异
            const left = data[(bly * width + (blx-1)) * 4]; //乘以 4 是因为每个像素占 4 个位置（红、绿、蓝、透明度）。
            const right = data[(bly * width + (blx+1)) * 4];
            const up = data[((bly-1) * width + blx) * 4];
            const down = data[((bly+1) * width + blx) * 4];

            // 梯度近似值
            const gradX = Math.abs(right - left);   // 水平方向的差异
            const gradY = Math.abs(down - up);  // 垂直方向的差异
            const gradient = gradX + gradY; // 总差异值

            // 如果差异大于阈值，认为是边缘
            if (gradient > threshold){
                edges[bly * width + blx] = 1;
            }
        }
    }

    // 4. 绘制点阵
    const step = dotSize + gap;
    const blr = dotSize / 2;

    for (let bly = 0; bly < height; bly += step){
        for (let blx = 0; blx < width; blx += step){
            // 检查该点是否是边缘
            if (edges[bly * width + blx] === 1){
                const bli = (bly * width + blx) * 4;
                const r_val = data[bli];
                const g_val = data[bli+1];
                const b_val = data[bli+2];
                
                ctx.beginPath();
                ctx.arc(blx, bly, blr, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${r_val},${g_val},${b_val})`;
                ctx.fill();
            }
        }
    }
}
