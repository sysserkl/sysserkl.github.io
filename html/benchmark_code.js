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

function measureFrame_bmark(csend=500){
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
                blxl=blxl+1;
                sub_measureFrame_bmark();
            }
        });    
    }
    
    var blxl=0;
    var otextarea_process=document.getElementById('textarea_process_bmark');
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
    var list_t=[];
    for (let blr=0;blr<256;blr=blr+csstep){
        for (let blg=0;blg<256;blg=blg+csstep){
            for (let blb=0;blb<256;blb=blb+csstep){
                list_t.push(blr+','+blg+','+blb);
            }
        }    
    }
    var blxl=0;
    var bllen=list_t.length;

    var otextarea_process=document.getElementById('textarea_process_bmark');
    otextarea_process.value=otextarea_process.value+'Total: '+bllen+' ';
    var otextarea_result=document.getElementById('textarea_result_bmark');        

    var odiv=document.getElementById('divhtml');
    sub_color_boxs_bmark_one_color();
}
