//-----------------------
//history
//0.0.1-20260430 from: 千问
//-----------------------
function generate_i2d(originalImg,threshold,dotSize,gap,canvas,ctx,maxWidth=800,bgcolor='#000000'){
    if (!originalImg.src){return;}

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
    
    var odiv=document.getElementById('divhtml');
    console.clear();
    var console_list=[];
    var mark_list=[];
    var html_list=[];    
    var color_dict={};
    var blcount=0;
    var is_same_color=klmenu_check_b('span_same_color_i2d',false);     
    var div_style=document.getElementById('input_div_style_i2d').value.trim();
    var blstr='';

    for (let bly = 0; bly < height; bly += step){
        var row_list=[];
        for (let blx = 0; blx < width; blx += step){
            let color_value='';
            // 检查该点是否是边缘
            if (edges[bly * width + blx] === 1){
                const bli = (bly * width + blx) * 4;
                const r_val = data[bli];
                const g_val = data[bli+1];
                const b_val = data[bli+2];
                
                color_value=`rgb(${r_val}, ${g_val}, ${b_val})`;
                
                ctx.beginPath();
                ctx.arc(blx, bly, blr, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${r_val},${g_val},${b_val})`;
                ctx.fill();
            } else {
                color_value=`${bgcolor}`;
            }
            
            console_list.push(`color: ${color_value}; font-size: 1rem;`);
            blstr=(is_same_color?`<span style="color: ${color_value}; background-color: ${color_value};${div_style}">◯</span>`:`<span style="background-color: ${color_value};${div_style}">◯</span>`);
            row_list.push(blstr);
            
            if (color_dict['c_'+color_value]==undefined){
                color_dict['c_'+color_value]=0;
            }
            color_dict['c_'+color_value]=color_dict['c_'+color_value]+1;
                        
            mark_list.push('%c●');
            blcount=blcount+1;
        }
        mark_list.push('\n');
        html_list.push('<p style="font-size:0.5rem;padding:0;margin:0;">'+row_list.join('')+'</p>');
    }

    var bllimit=parseInt(document.getElementById('input_max_size_i2d').value.trim());
    if (bllimit==-1 || blcount<=bllimit){
        console_list=[' '+mark_list.join(' ')].concat(console_list);    //console.log 多行显示，第一个字符添加空格以便于对齐
        //不是 width - 保留注释
        console.log(...console_list);  
        
        odiv.innerHTML=html_list.join('\n');
    } else {
        odiv.innerHTML='';
    }
    
    color_dict=object2array_b(color_dict,true,2);
    color_dict.sort(function (a,b){return a[1]>b[1]?-1:1;});
    
    var ostatus=document.getElementById('div_status');
    ostatus.innerHTML='显示个数有 '+blcount + '个，颜色数：'+color_dict.length;
    console.log(color_dict);
}

function init_i2d(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),true,false,2);
    var input_list=[
    ['input_bgcolor_img_dot',5,0.5],
    ['input_isize_img_dot',5,0.5],
    ];
    input_size_b(input_list,'id');
    character_2_icon_b('▓');
    menu_i2d();
}

function menu_i2d(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu">显示DIV的最大尺寸：<input type="number" id="input_max_size_i2d" value=20000 style="width:6rem;" /></span>',    
    '<span class="span_menu">DIV style：<input type="text" id="input_div_style_i2d" value="border:0.1px solid white;" style="width:16rem;" /></span>',    
    '<span id="span_same_color_i2d" class="span_menu" onclick="'+str_t+'klmenu_check_b(this.id,true);">⚪ 字符前后颜色一致</span>',        
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'▓','14rem','1rem','1rem','30rem'),'','0rem')+' ');
}


function upload_i2d(){
    const file = document.getElementById('image_upload').files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        original_img_dot_global.src = event.target.result;
        original_img_dot_global.onload = () => process_i2d();
    };
    reader.readAsDataURL(file);
}

function process_i2d(){
    let maxWidth=parseInt(document.getElementById('input_isize_img_dot').value.trim());
    let bgcolor=document.getElementById('input_bgcolor_img_dot').value.trim();
    let threshold=parseInt(document.getElementById('input_threshold_img_dot').value);
    let dotSize = parseInt(document.getElementById('input_dsize_img_dot').value);
    let gap = parseInt(document.getElementById('input_gap_img_dot').value);    
    let ocanvas = document.getElementById('canvas_img_dot');
    let ctx = ocanvas.getContext('2d');
    generate_i2d(original_img_dot_global,threshold,dotSize,gap,ocanvas,ctx,maxWidth,bgcolor);
}
