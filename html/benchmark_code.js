function init_bmark(){
    top_bottom_arrow_b('div_top_bottom','',false,(ismobile_b()?'1.8rem':'1.6rem'),false,false,2);
    character_2_icon_b('🔩');    
    menu_bmark();

    document.getElementById('p_process_buttons').insertAdjacentHTML('afterbegin',textarea_buttons_b('textarea_process_bmark','全选,清空,复制'));
    var postpath=postpath_b();
    document.getElementById('form_bmark').setAttribute('action',postpath+'temp_txt_share.php');
    document.getElementById('p_result_buttons').insertAdjacentHTML('afterbegin',textarea_buttons_b('textarea_result_bmark','全选,清空,复制,发送到临时记事本,发送地址'));
}

function menu_bmark(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'hash_bmark(\'crypto\');">hash测试(window.crypto)</span>',
    '<span class="span_menu" onclick="'+str_t+'hash_bmark(\'sha.js\',5000);">hash测试(sha.js)</span>',
    '<span class="span_menu" onclick="'+str_t+'measureFrame_bmark();">requestAnimationFrame测试</span>',
    '<span class="span_menu" onclick="'+str_t+'color_boxs_bmark();">color_boxs测试</span>',
    '<span class="span_menu" onclick="'+str_t+'prime_get_bmark();">质数测试</span>',
    '<span class="span_menu" onclick="'+str_t+'rnd_relative_maximum_deviation_bmark();">随机数相对最大偏差测试</span>',

    ];
    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🔩','18rem','1rem','1rem','30rem'),'','0rem')+' ');
}

function hash_bmark(cstype='crypto',csmax=2500){
    function sub_hash_bmark_one_step(){
        if (blxl>=csmax){
            otextarea_result.value=today_str_b()+' '+navigator.userAgent+' hash_bmark(\''+cstype+'\','+csmax+') 费时：'+milliseconds2hms_b(performance.now() - t0) + '\n'+otextarea_result.value;
            return;
        }
        
        var blstr=blxl.toString().padStart(5, '0');
        if (cstype=='crypto'){
            var inputArray=[blstr];
            hashArrayElements_bmark(inputArray)
            .then(hashedArray => {
                // 显示哈希结果
                hashedArray.forEach((hashedStr, index) => {
                    otextarea_process.value=inputArray[index]+': '+hashedStr+'\n'+otextarea_process.value;
                    blxl=blxl+1;
                    if (blxl % 50 == 0){
                        setTimeout(sub_hash_bmark_one_step,1);
                    } else {
                        sub_hash_bmark_one_step();
                    }
                });
            })
            .catch(error => {
                otextarea_result.value='An error occurred: '+error+'\n'+otextarea_result.value;
            });
        } else {
            otextarea_process.value=blstr+': '+SHA512(blstr)+'\n'+otextarea_process.value;
            blxl=blxl+1;
            if (blxl % 50 == 0){
                setTimeout(sub_hash_bmark_one_step,1);
            } else {
                sub_hash_bmark_one_step();
            }            
        }
    }
    
    var otextarea_process=document.getElementById('textarea_process_bmark');
    var otextarea_result=document.getElementById('textarea_result_bmark');
    var blxl=0;
    var blpad=5;

    var t0=performance.now();
    sub_hash_bmark_one_step();
}

async function hashStringWithSHA512_bmark(str){
    const encoder = new TextEncoder();  //用于将 Unicode 字符串编码为二进制数据（通常为 UTF-8 编码）。
    const data = encoder.encode(str);   //将输入字符串 str 转换为一个 Uint8Array 类型的二进制数据。
    const hashBuffer = await window.crypto.subtle.digest('SHA-512', data);  //浏览器提供的 Web Cryptography API 的一部分。
    const hashArray = Array.from(new Uint8Array(hashBuffer));   //将 hashBuffer 转换为 Uint8Array 类型，以便访问其中的各个字节。然后使用 Array.from() 将这个 Uint8Array 转换为普通 Array，便于后续操作。
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');   //将字节转换为其对应的十六进制字符串。确保每个十六进制字符串至少有两位，不足两位的前面补零。使用 join('') 将这些十六进制字符串连接成一个单一的、无分隔符的字符串（即 hashHex），这就是最终的 SHA-512 哈希值。
    //整个过程是异步的，确保在计算哈希时不会阻塞主线程。
    return hashHex;
}

async function hashArrayElements_bmark(arr){
    return Promise.all(arr.map(async (str) => {
        //对输入数组 arr 应用 map 方法，遍历数组中的每个元素并对其执行一个回调函数。这个回调函数是异步的，因为它前面有 async 关键字。
        //map 方法将为 arr 中的每个元素生成一个独立的、计算其 SHA-512 哈希值的 Promise。这些 Promise 会被收集到一个数组中，并作为参数传递给 Promise.all() 函数。
        //Promise.all() 接收一个包含多个 Promise 的数组作为参数。它返回一个新的 Promise，该 Promise 在所有传入的 Promise 都成功解析后解析为一个包含所有结果值的数组，或者在任何一个 Promise 失败时变为拒绝状态。
        //这样，当需要处理大量字符串时，可以利用异步并行计算提高效率。
        return await hashStringWithSHA512_bmark(str); //由于 hashStringWithSHA512_bmark 是异步的（由其返回 Promise 推断），我们使用 await 关键字等待其完成并返回结果。
    }));
}

function measureFrame_bmark(csend=1000){
    function sub_measureFrame_bmark(){
        //浏览器会在下一帧即将被渲染前调用注册的回调函数，这意味着回调函数执行的时间点总是与显示器的刷新周期保持一致。对于大多数现代显示器来说，刷新率通常是60Hz，即每秒刷新60次，所以回调函数大约每16.7毫秒（1000ms / 60Hz）会被调用一次。这样确保了动画的每一帧都能够恰当地与屏幕刷新结合，避免了因不同步导致的动画撕裂或卡顿。
        //当浏览器窗口不是当前活动窗口（例如用户切换到了另一个标签页或应用），或者页面元素不在可视区域时，浏览器会智能地暂停 requestAnimationFrame 回调的执行，直到页面重新变为可见。这有助于减少不必要的计算和渲染工作，进而节省CPU和GPU资源。
        //使用 requestAnimationFrame 制作动画时，开发者可以在每个动画帧的回调函数中修改 DOM 或 CSS 样式，浏览器会尽可能合并这些改动并在一次重排（layout）和重绘（paint）过程中完成更新，避免连续帧之间产生过多的布局和渲染工作，提高动画性能。
        //在高频触发的事件如滚动(scroll)或窗口大小变化(resize)中，使用 requestAnimationFrame 可以确保在一个刷新间隔内，动画相关的逻辑仅被执行一次，有助于避免过高的CPU占用以及提升用户体验。——通义千问
        requestAnimationFrame(function callback(){
            if (blxl>=csend){
                var otextarea_result=document.getElementById('textarea_result_bmark');
                otextarea_result.value='measureFrame_bmark('+csend+') 费时：'+milliseconds2hms_b(performance.now() - t0) + '\n'+otextarea_result.value;
            } else {
                if (blxl % 100 == 0){
                    otextarea_process.value=otextarea_process.value+blxl+' ';
                }
                ctx.fillStyle = 'rgb('+color_list[blxl%color_len]+')';
                ctx.fillRect(0,0,100,100);
                blxl=blxl+1;
                sub_measureFrame_bmark();
            }
        });    
    }
    
    var blxl=0;
    var otextarea_process=document.getElementById('textarea_process_bmark');
    
    var ocanvas = document.createElement('canvas');
    ocanvas.width=100;
    ocanvas.height=100;
    var ctx=ocanvas.getContext('2d');
    
    var color_list=color_list_bmark(20);
    var color_len=color_list.length;
    document.getElementById('divhtml').appendChild(ocanvas);

    var t0 = performance.now();
    sub_measureFrame_bmark();
}

function color_boxs_bmark(csstep=10){
    function sub_color_boxs_bmark_one_color(){
        if (blxl>=bllen){
            otextarea_result.value='color_boxs_bmark('+csstep+') 费时：'+milliseconds2hms_b(performance.now() - t0) + '\n'+otextarea_result.value;    
        
            odiv.insertAdjacentHTML('afterbegin',close_button_b('divhtml'));
            return;
        }
        
        odiv.insertAdjacentHTML('afterbegin','<div style="position:relative;float:left;width:1rem;height:1rem;margin:0.1rem;background-color:rgb('+list_t[blxl]+');"></div>');
        blxl=blxl+1;
        try {
            if (blxl % 500 == 0){   //这个数值不能太大 - 保留注释
                otextarea_process.value=otextarea_process.value+blxl+' ';
                setTimeout(sub_color_boxs_bmark_one_color,1);
            } else {
                sub_color_boxs_bmark_one_color();
            }
        } catch (error){
            otextarea_result.value='color_boxs_bmark('+csstep+') error：'+error.message + '\n'+otextarea_result.value;
        }
    }
    
    var t0 = performance.now();
    var list_t=color_list_bmark(csstep);

    var blxl=0;
    var bllen=list_t.length;

    var otextarea_process=document.getElementById('textarea_process_bmark');
    otextarea_process.value=otextarea_process.value+'Total: '+bllen+' ';
    var otextarea_result=document.getElementById('textarea_result_bmark');        

    var odiv=document.getElementById('divhtml');
    sub_color_boxs_bmark_one_color();
}

function color_list_bmark(csstep){
    var list_t=[];
    for (let blr=0;blr<256;blr=blr+csstep){
        for (let blg=0;blg<256;blg=blg+csstep){
            for (let blb=0;blb<256;blb=blb+csstep){
                list_t.push(blr+','+blg+','+blb);
            }
        }    
    }
    return list_t;
}

function prime_get_bmark(csno=500000){
    //10000 104729
    //100000 1299709
    function sub_prime_get_bmark_one_number(){
        var blfound=true;
        
        //任何大于 sqrt(n) 的因子都必然有一个对应的小于等于 sqrt(n) 的因子。如果 n 在循环到这个点之前都没有被任何数整除，那么它不可能被大于 sqrt(n) 的数整除，因此我们可以提前结束循环，判断 n 是质数。 - 文心一言
        for (let blxl=2;blxl*blxl<=current_value;blxl++){
            if (current_value % blxl == 0){
                blfound=false;
                break;
            }
        }
        
        if (blfound){
            blcount=blcount+1;
        }

        if (blcount>=csno){
            otextarea_result.value='prime_get_bmark('+csno+') '+current_value+' 费时：'+milliseconds2hms_b(performance.now() - t0) + '\n'+otextarea_result.value;        
            return;
        }
        
        current_value=current_value+1;
        try {        
            if (current_value % 5000 == 0){ //10000 时 chromium 会 Maximum call stack size exceeded - 保留注释
                setTimeout(sub_prime_get_bmark_one_number,1);
                if (current_value % 500000 == 0){
                    otextarea_process.value=otextarea_process.value+current_value+' ';
                }
            } else {
                sub_prime_get_bmark_one_number();
            }
        } catch (error){
            otextarea_result.value='prime_get_bmark('+csno+') error：'+error.message + '\n'+otextarea_result.value;
        }        
    }

    var t0 = performance.now();
    var blcount=0;
    var current_value=2;
    var otextarea_process=document.getElementById('textarea_process_bmark');
    var otextarea_result=document.getElementById('textarea_result_bmark');            
    sub_prime_get_bmark_one_number();
}

function rnd_relative_maximum_deviation_bmark(){
    function sub_rnd_relative_maximum_deviation_bmark_one(){
        if (blxl>=TRIALS){
            if (is_within_005 == 0){
                console.log("⚠️ 警告：可能存在显著偏置（某个结果出现的频率明显偏离了理论上的期望值，且这种偏离不太可能是由随机波动造成的）！");
            }
            
            otextarea_result.value='rnd_relative_maximum_deviation_bmark() 费时：'+(performance.now() - t0)/1000 + ' seconds';
            return;
        }

        let is_continue=false;
        let val=randint_b(MIN,MAX);
        //校验值是否在范围内
        if (val < MIN || val > MAX){
            console.log('警告：生成了范围外的值:',val);
            is_continue=true;
        } else {
            count_dict['c_'+val]=count_dict['c_'+val]+1;
        }
        
        if (is_progressive == 0 && blxl < TRIALS-1){
            is_continue=true;
        }
        
        if (is_continue){
            blxl=blxl+1;
            setTimeout(sub_rnd_relative_maximum_deviation_bmark_one,1);        
        }
        
        let is_in_step=0;
        if (is_progressive == 1 && show_every_round == 0){
            if ((blxl+1) % blstep == 0 ){
                if (show_in_step == 0){
                    console.log((blxl+1) / TRIALS);
                }
                is_in_step=1;
            }
        }
        
        // 计算期望值
        let expected=(blxl + 1) / (MAX - MIN + 1);
        // $MAX - $MIN + 1：可能的取值个数

        let print_arr=[['值','出现次数','偏差']];
        let max_deviation=0;
        for (let blno=MIN; blno<=MAX; blno++){
            let count_value=count_dict['c_'+blno];
            let dev=count_value - expected;
            //实际出现的次数 - 在理想均匀分布下，该值应该出现的次数
            
            // 计算绝对偏差
            let abs_dev=Math.abs(dev);
            if (abs_dev > max_deviation){
                max_deviation=abs_dev;
            }
            print_arr.push([blno,count_value,(dev>=0?'+':'')+dev.toFixed(2)]);
        }
            
        is_within_005=(max_deviation / expected < 0.05);
        if (is_in_step==1 && show_in_step==1 || show_every_round==1 || is_within_005==1 || is_progressive==0 || blxl==TRIALS-1){
            let summary_list=[
            ['采样',blxl+1,'次'],
            ['期望频率',expected.toFixed(2),''],
            ['最大绝对偏差',max_deviation.toFixed(2),''],
            ['相对最大偏差',(100 * max_deviation / expected).toFixed(3),'%'],
            ];
            
            if (is_within_005 == 1){
                summary_list.push('✅ 通过：分布基本均匀（偏差 < 5%）');
            }
            
            console.log(summary_list.join('\n'));
            otextarea_process.value=summary_list.join('\n');
            
            if (show_detail == 1){
                console.log(print_arr.join('\n'));
                otextarea_process.value=otextarea_process.value+print_arr.join('\n');
            }
        }
        
        if (do_break == 1 && is_within_005 == 1 && is_progressive == 1){
            blxl=TRIALS;
        } else {
            blxl=blxl+1;
        }
        
        if (blxl % 100 == 0){
            setTimeout(sub_rnd_relative_maximum_deviation_bmark_one,1);
        } else {
            sub_rnd_relative_maximum_deviation_bmark_one();
        }
    }
    
    let MIN=0;
    let MAX=9;
    let TRIALS=100000;
    let is_progressive=1;
    let show_every_round=0;
    let blstep=1;
    let show_in_step=1;
    let show_detail=1;
    let do_break=0;
    
    let t0 = performance.now();
    
    let count_dict={};
    for (let blxl=MIN; blxl<=MAX; blxl++){
        count_dict['c_'+blxl]=0;
    }
    
    let is_within_005=0;
    
    let otextarea_process=document.getElementById('textarea_process_bmark');
    let otextarea_result=document.getElementById('textarea_result_bmark');

    let blxl=0;
    sub_rnd_relative_maximum_deviation_bmark_one();
}
