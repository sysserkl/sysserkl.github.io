//-----------------------
//history
//0.0.1-20260923 腾讯元宝
//-----------------------
/**
 * 褶皱信纸组件
 * @param {Object} options - 配置参数
 * @param {string} options.text - 文字内容（支持 \n 分段）
 * @param {string} options.color - 文字颜色，默认 '#3a3327'
 * @param {string} options.bgColor - 纸底色，默认 '#f0e6d3'
 * @param {string} options.fontFamily - 字体，默认 'Kaiti, STKaiti, serif'
 * @param {string|number} options.fontWeight - 字重，默认 'normal'
 * @param {string|number} options.fontSize - 字号，默认 '30px'
 * @param {string|number} options.padding - 内边距，默认 '20px'
 * @param {string|number} options.lineHeight - 行高，默认 '1.8'
 * @param {string|number} options.width - 宽度，默认 '880px'
 * @param {boolean} options.vertical - 是否竖排，默认 false
 * @param {Object} options.seal - 印章配置，null 则不显示
 * @param {string} options.seal.text - 印章文字，默认 '印'
 * @param {string} options.seal.color - 印章颜色，默认 '#c0392b'
 * @param {string|number} options.seal.size - 印章大小，默认 '60px'
 * @param {string} options.seal.position - 位置 'bottom-right'|'bottom-left'|'inline'，默认 'bottom-right'
 * @param {number} options.seed - 褶皱随机种子，默认 3
 * @param {string} options.baseFrequency - 褶皱密度，默认 '0.025'
 * @param {number} options.surfaceScale - 褶皱深度，默认 4
 * @param {number} options.azimuth - 光照方向，默认 45
 * @param {number} options.elevation - 光照高度，默认 50
 */
function generate_letter_paper(options){
  // 默认值
  var opts = Object.assign({
    text: '',
    color: rndcolor_b(),
    bgColor: rndcolor_b(),
    fontFamily: 'HYJinKaiJ',
    fontWeight: 'normal',
    fontSize: '30px',
    padding: '20px',
    lineHeight: '1.8',
    width: '880px',
    vertical: false,
    seal: null,
    seed: 3,
    baseFrequency: '0.025',
    surfaceScale: 4,
    azimuth: 45,
    elevation: 50
  }, options);

  // 确保容器
  var container = typeof opts.container === 'string'
    ? document.querySelector(opts.container)
    : (opts.container || document.body);

  // 生成唯一滤镜 ID
  var filterId = 'crumple-' + Math.random().toString(36).slice(2, 9);

  // 处理文字：按 \n 分段
  var paragraphs = opts.text.split('\n').map(function(p) {
    return p.trim() ? '<p>' + p + '</p>' : '';
  }).join('');

  // 竖排样式
  var writingMode = opts.vertical ? 'writing-mode: vertical-rl;' : '';

  // 印章 HTML
  var sealHtml = '';
  if (opts.seal) {
    var s = Object.assign({ text: '印', color: '#c0392b', size: '60px', position: 'bottom-right', padding: '10px' }, opts.seal);
    var sealPositions = {
      'bottom-right': 'bottom: '+s.padding+'; right: '+s.padding+';',
      'bottom-left': 'bottom: '+s.padding+'; left: '+s.padding+';',
      'inline': 'display: inline-flex; vertical-align: middle; margin: 0 8px;'
    };
    var sealPos = sealPositions[s.position] || sealPositions['bottom-right'];
    var sealFontSize = parseInt(s.size) * 0.45 + 'px';

    var bldisplay=(s.position === 'inline'?'display:inline; ':'');
    var seal_mode = !opts.vertical ? 'writing-mode: vertical-rl; ' : '';
    sealHtml = '<div class="letter-seal" style="'+seal_mode+bldisplay+'font-size:' + sealFontSize + '; padding:' + Math.max(4, parseInt(s.size) * 0.1) + 'px; color:' + s.color + '; border-color:' + s.color + '; ' + sealPos + '">' + s.text + '</div>';
    //width 不能是 max-content - 保留注释
  }

  // SVG 滤镜
  var svgFilter = '<svg width="0" height="0" style="position:absolute; pointer-events:none;">' +
    '<defs>' +
    '<filter id="' + filterId + '" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="' + opts.baseFrequency + '" numOctaves="5" seed="' + opts.seed + '" result="noise"/>' +
    '<feDiffuseLighting in="noise" surfaceScale="' + opts.surfaceScale + '" diffuseConstant="1.2" lighting-color="#f5f0e5" result="light">' +
    '<feDistantLight azimuth="' + opts.azimuth + '" elevation="' + opts.elevation + '"/>' +
    '</feDiffuseLighting>' +
    '<feBlend mode="multiply" in="light" in2="SourceGraphic" result="blended"/>' +
    '<feColorMatrix type="matrix" values="1.05 0 0 0 -0.02  0 1.05 0 0 -0.02  0 0 1.05 0 -0.01  0 0 0 1 0" in="blended"/>' +
    '</filter>' +
    '</defs>' +
    '</svg>';

  // 信纸 HTML
  var html = svgFilter +
    '<div class="letter-wrapper" style="position:relative; display:inline-block; ' + writingMode + '">' +
    '<div class="letter" style="' +
    'position:relative;' +
    'color:' + opts.color + ';' +
    'background-color:' + opts.bgColor + ';' +
    'font-family:' + opts.fontFamily + ';' +
    'font-weight:' + opts.fontWeight + ';' +
    'font-size:' + opts.fontSize + ';' +
    'padding:' + opts.padding + ';' +
    'line-height:' + opts.lineHeight + ';' +
    'width:' + opts.width + ';' +
    'filter:url(#' + filterId + ');' +
    'box-shadow:0 20px 60px rgba(0,0,0,.3),0 4px 12px rgba(0,0,0,.15);' +
    'border-radius:2px;' +
    writingMode +
    '">' +
    paragraphs +
    sealHtml +
    '</div>' +
    '</div>';

  // 注入样式（只注入一次）
  if (!document.getElementById('crumple-letter-styles')) {
    var style = document.createElement('style');
    style.id = 'crumple-letter-styles';
    style.textContent = '' +
      '.letter p{text-shadow:0 0 1px rgba(0,0,0,.15);margin:0;}' +
      '.letter p+p{margin-top:0.6em;}' +
      '.letter::before{content:"";position:absolute;inset:0;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E");background-size:180px 180px;opacity:.05;mix-blend-mode:multiply;border-radius:2px;}' +
      '.letter::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 0% 0%,rgba(120,90,40,.15),transparent 50%),radial-gradient(ellipse at 100% 100%,rgba(120,90,40,.15),transparent 50%),radial-gradient(ellipse at 100% 0%,rgba(120,90,40,.08),transparent 40%),radial-gradient(ellipse at 0% 100%,rgba(120,90,40,.08),transparent 40%);border-radius:2px;}' +
      '.letter>*{position:relative;z-index:1;}' +
      '.letter-seal{position:absolute;display:flex;align-items:center;justify-content:center;font-family:"Kaiti","STKaiti",serif;font-weight:bold;border:3px solid; border-radius:8px;opacity:.85;mix-blend-mode:multiply;letter-spacing:2px;flex-wrap:wrap;padding:4px;line-height:1.1;text-align:center;pointer-events:none;}' +
      //'.letter-wrapper[style*="vertical"] .letter-seal{position:static!important;display:inline-flex!important;}' +
      '';
    document.head.appendChild(style);
  }

  // 渲染
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  container.appendChild(wrapper);

  return wrapper;
}
