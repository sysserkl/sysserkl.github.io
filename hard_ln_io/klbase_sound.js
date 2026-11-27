/**
 * 【工具】创建音频上下文，自动resume
 * @returns {AudioContext}
 */
function create_audio_ctx_b() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

/**
 * 【工具】生成白噪音Buffer
 * @param {AudioContext} ctx
 * @param {number} [durationSec=2] 缓冲区时长，默认2秒
 * @returns {AudioBuffer}
 */
function create_noise_buffer_b(ctx, durationSec = 2) {
    const bufferSize = durationSec * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

/**
 * 【工具】安全限制音量范围
 * @param {number} volume
 * @returns {number}
 */
function safe_volume_clamp_b(volume) {
    return Math.max(0.001, Math.min(volume, 1.0));
}

/**
 * 【工具】创建主Gain节点+淡入效果
 * @param {AudioContext} ctx
 * @param {number} targetVol 目标音量
 * @param {number} fadeTime 淡入时长秒
 * @returns {GainNode}
 */
function create_fade_in_master_gain_b(ctx, targetVol, fadeTime) {
    const t = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, t);
    gainNode.gain.exponentialRampToValueAtTime(targetVol, t + fadeTime);
    return gainNode;
}

/**
 * 【工具】生成停止函数工厂
 * @param {AudioContext} ctx
 * @param {GainNode} masterGain 主音量节点
 * @param {Array<AudioNode>} activeNodes 需要stop/disconnect的音频节点
 * @param {Array<number>} activeIntervals 定时器id数组
 * @param {number} fadeTime 淡出时长秒
 * @returns {()=>void} stopFn 停止函数
 */
function create_stop_function_b(ctx, masterGain, activeNodes, activeIntervals, fadeTime) {
    let isStopped = false;
    const stopFn = () => {
        if (isStopped) return;
        isStopped = true;
        const now = ctx.currentTime;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(masterGain.gain.value, now);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + fadeTime);

        // 清理定时器
        activeIntervals.forEach(id => clearInterval(id));

        setTimeout(() => {
            activeNodes.forEach(node => {
                if (node.stop) node.stop();
                node.disconnect();
            });
            masterGain.disconnect();
            ctx.close();
        }, fadeTime * 1000);
    };
    return stopFn;
}

/**
 * 【工具】处理duration定时自动停止
 * @param {Function} stopFn
 * @param {number} duration
 * @param {number} fadeTime
 */
function setup_auto_stop_b(stopFn, duration, fadeTime) {
    if (duration > 0 && duration !== Infinity) {
        setTimeout(stopFn, (duration - fadeTime) * 1000);
    }
}

// ============ 业务函数：播放有色噪音（白/粉/棕） ============
/**
 * 播放有色噪音（白/粉/棕）
 * @param {string} type - 噪音类型: 'white'(白噪音), 'pink'(粉红噪音), 'brown'(棕噪音)
 * @param {number} volume - 音量大小 (0.0 到 1.0 之间)
 * @param {number} duration - 播放时长（秒），传入 Infinity 表示无限循环
 * @returns {Function} 返回一个停止函数，可随时手动调用以提前停止播放
 */
function white_noise_b(type = 'white', volume = 0.5, duration = Infinity) {
    const ctx = create_audio_ctx_b();
    const t = ctx.currentTime;
    const safeVol = safe_volume_clamp_b(volume);
    const fadeTime = 0.5;

    const buffer = create_noise_buffer_b(ctx, 2);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    switch (type){
        case 'pink':
            filter.type = 'lowpass';
            filter.frequency.value = 1000;
            filter.Q.value = 1;
            break;
        case 'brown':
            filter.type = 'lowpass';
            filter.frequency.value = 400;
            filter.Q.value = 1;
            break;
        case 'white':
            filter.type = 'allpass';
            break;
    }

    const gainNode = create_fade_in_master_gain_b(ctx, safeVol, fadeTime);

    // 音频链路
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start(t);

    const activeNodes = [noiseSource, filter, gainNode];
    const activeIntervals = [];

    const stopNoise = create_stop_function_b(ctx, gainNode, activeNodes, activeIntervals, fadeTime);
    setup_auto_stop_b(stopNoise, duration, fadeTime);

    return stopNoise;
}

// ============ 业务函数：播放自然环境音效 ============
/**
 * 播放自然环境音效
 * @param {string} type - 音效类型: 'wind'(风), 'rain'(雨), 'birds'(鸟), 'ocean'(海浪), 'fire'(篝火), 'cafe'(咖啡馆)
 * @param {number} volume - 音量大小 (0.0 到 1.0 之间)
 * @param {number} duration - 播放时长（秒），传入 Infinity 表示无限循环
 * @returns {Function} 返回一个停止函数，可随时手动调用以提前停止播放
 */
function nature_sound_b(type = 'bird', volume = 0.5, duration = Infinity) {
    const ctx = create_audio_ctx_b();
    const t = ctx.currentTime;
    const safeVol = safe_volume_clamp_b(volume);
    const fadeTime = 1.0;

    const noiseBuffer = create_noise_buffer_b(ctx, 2);
    const masterGain = create_fade_in_master_gain_b(ctx, safeVol, fadeTime);
    masterGain.connect(ctx.destination);

    const activeNodes = [];
    const activeIntervals = [];

    switch (type) {
        //为每个 case 添加一对大括号 {}，为每个分支创建独立的块级作用域
        //由于在多个 case 中都使用了 const 声明了同名的变量（如 noise、filter、lfo、lfoGain），如果没有大括号，会导致 SyntaxError: Identifier 'xxx' has already been declared
        case 'downpour': {
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer; noise.loop = true;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass'; filter.frequency.value = 400; filter.Q.value = 0.5;
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.2;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 200;
            lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
            noise.connect(filter); filter.connect(masterGain);
            noise.start(t); lfo.start(t);
            activeNodes.push(noise, filter, lfo, lfoGain);
            break;
        }
        case 'birds': {
            const playChirp = () => {
                const osc = ctx.createOscillator();
                osc.type = 'sine';
                const baseFreq = 1500 + Math.random() * 1500;
                const now = ctx.currentTime;
                osc.frequency.setValueAtTime(baseFreq, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * (1 + Math.random()), now + 0.1);
                osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.2);
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.exponentialRampToValueAtTime(0.2 * safeVol, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.connect(gain); gain.connect(ctx.destination);
                osc.start(now); osc.stop(now + 0.3);
            };
            const birdInterval = setInterval(() => {
                if (Math.random() > 0.5) playChirp();
            }, 800);
            activeIntervals.push(birdInterval);
            break;
        }
        case 'waterfall': {
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer; noise.loop = true;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass'; filter.frequency.value = 800;
            noise.connect(filter); filter.connect(masterGain);
            noise.start(t);
            activeNodes.push(noise, filter);
            break;
        }
        case 'rain': {
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer; noise.loop = true;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass'; filter.frequency.value = 600; filter.Q.value = 0.8;
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 15;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 50;
            lfo.connect(lfoGain); lfoGain.connect(filter.frequency);
            noise.connect(filter); filter.connect(masterGain);
            noise.start(t); lfo.start(t);
            activeNodes.push(noise, filter, lfo, lfoGain);
            break;
        }
        case 'thunder': {
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer; noise.loop = true;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass'; filter.frequency.value = 200;
            noise.connect(filter); filter.connect(masterGain);
            noise.start(t);
            activeNodes.push(noise, filter);

            const playBoom = () => {
                const boomNoise = ctx.createBufferSource();
                boomNoise.buffer = noiseBuffer;
                const boomFilter = ctx.createBiquadFilter();
                boomFilter.type = 'lowpass';
                boomFilter.frequency.value = 150;
                const boomGain = ctx.createGain();
                const now = ctx.currentTime;
                boomGain.gain.setValueAtTime(0.001, now);
                boomGain.gain.exponentialRampToValueAtTime(0.6 * safeVol, now + 0.1);
                boomGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
                boomNoise.connect(boomFilter); boomFilter.connect(boomGain); boomGain.connect(ctx.destination);
                boomNoise.start(now); boomNoise.stop(now + 2.5);
            };
            const thunderInterval = setInterval(() => {
                if (Math.random() > 0.8) playBoom();
            }, 3000);
            activeIntervals.push(thunderInterval);
            break;
        }
    }

    const stopSound = create_stop_function_b(ctx, masterGain, activeNodes, activeIntervals, fadeTime);
    setup_auto_stop_b(stopSound, duration, fadeTime);
    return stopSound;
}

function sound_type_get_b(){   
    let result_t=switch_case_get_b('white_noise_b',white_noise_b.toString());
    result_t=result_t.concat(switch_case_get_b('nature_sound_b',nature_sound_b.toString()));
    return result_t;
}
