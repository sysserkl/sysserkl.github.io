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
    ];

    document.getElementById('span_title').insertAdjacentHTML('beforebegin',klmenu_multi_button_div_b(klmenu_b(klmenu1,'🔩','16rem','1rem','1rem','30rem'),'','0rem')+' ');
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
