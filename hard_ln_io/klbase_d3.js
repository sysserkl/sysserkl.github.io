function import_wordcloud_js_d3_b(do_write=true){
    klbase_addons_import_js_b([],['d3/d3.min.js','d3/d3.layout.cloud.min.js'],[],[],false,do_write);
}

function wordcloud_generate_d3_b(dom_string,cswidth,csheight,csdata,csfont='',csbgcolor='',csrotate=90){
    // 绘制词云函数
    //csdata 形如：
    //const wordData = [
    //{ text: 'AA', size: 60},
    //{ text: 'BB', size: 50},
    //];
    function sub_wordcloud_generate_d3_b_draw(words){
        const container = d3.select(dom_string);
        container.html(''); // 清空容器

        // 创建SVG元素
        const svg = container.append('svg')
        .attr('width', cswidth)
        .attr('height', csheight)
        .style('background-color',csbgcolor)
        .append('g')
        .attr('transform', `translate(${cswidth/2},${csheight/2})`);

        // 创建词云文本元素
        const text = svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .attr('class', 'd3_wordcloud')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', csfont)
        .style('fill', (d, i) => colorScale(d.text))
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text);
    }
    
    // 创建颜色比例尺
    const colorScale = d3.scaleOrdinal()
    .domain(csdata.map(d => d.text))
    .range(d3.schemeCategory10);    //10种预先定义好的颜色

    // 创建词云布局 [1,3](@ref)
    const layout = d3.layout.cloud()
    .size([cswidth, csheight])
    .words(csdata.map(d => ({ 
        text: d.text, 
        size: d.size,
    })))
    .padding(5)
    .rotate(() => ~~(Math.random() * 2) * csrotate) // 0° 或 90° 旋转
    //.font('impact')
    .fontSize(d => d.size)
    .on('end', sub_wordcloud_generate_d3_b_draw);

    layout.start();
}
