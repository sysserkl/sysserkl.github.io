<?php
//csver: 0.0.1-20180919
function randstr_g($len,$csnumber=true,$csletter=true){
    if ($csnumber==true and $csletter==true){
        $charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } elseif ($csletter==true){
        $charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } else {
        $charset = '0123456789';
    }
    $charset_len_t = strlen($charset);
    $result = '';

    for ($blxl=1;$blxl<=$len;$blxl++){
        $result=$result.substr($charset,rand(0,$charset_len_t-1),1);
    }

    return $result;
}

function random_chs_g($num){
    $blstr = '';
    for ($blxl=0; $blxl<$num; $blxl++){
        // 使用chr()函数拼接双字节汉字，前一个chr()为高位字节，后一个为低位字节
        $bltmp = chr(mt_rand(0xB0,0xD0)).chr(mt_rand(0xA1, 0xF0));
        // 转码
        $blstr .= iconv('GB2312', 'UTF-8', $bltmp);
    }
    return $blstr;
}

function getRandomSubarray_g($arr, $size){
    shuffle($arr);
    return array_slice($arr, 0, $size);
}

function random_strs_g(){
    $blquote1=['{','[','('];
    $blquote2=[')',']','}'];
    
    $bljg=$blquote2[rand(0,2)].$blquote2[rand(0,2)].randstr_g(rand(3,5));
    $bljg='~'.random_chs_g(rand(3,5)).$bljg.'~~'.random_chs_g(rand(3,5));
    return $bljg.$blquote1[rand(0,2)].$blquote1[rand(0,2)].'~';
}

function utf8_strrev_g($str){
    $r = '';
    for ($i = mb_strlen($str); $i>=0; $i--){
        $r .= mb_substr($str, $i, 1);
    }
    return $r;
}

function confuse_str_g($csstr,$cssegments=-1){
    if (strlen($csstr)==0){
        return $csstr;
    }
    $csstr=utf8_strrev_g($csstr);
    $len_t=mb_strlen($csstr);

	if ($cssegments<0){
        $cssegments= max(8,round($len_t/4));
    }

    $lenlist=[];
    
    $cssegments=min($cssegments,$len_t);
    
    for ($blxl=0;$blxl<$len_t;$blxl++){
        $lenlist[$blxl]=$blxl;
    }
    $lenlist=getRandomSubarray_g($lenlist,$cssegments);
    sort($lenlist);
    
    $bljg=mb_substr($csstr,0,$lenlist[0]);
    for ($blxl=0;$blxl<count($lenlist);$blxl++){
        if ($blxl<count($lenlist)-1){
            $bljg=$bljg.random_strs_g().mb_substr($csstr,$lenlist[$blxl],$lenlist[$blxl+1]-$lenlist[$blxl]);
        } else {
            $bljg=$bljg.random_strs_g().mb_substr($csstr,$lenlist[$blxl]);
        }
    }
    
    $bljg=str_replace("'",'\\\'',$bljg) ; 
    return $bljg;
}

function de_confuse_str_g($csstr){
    if ($csstr==''){return '';}
    return utf8_strrev_g(preg_replace('/~[\x{4e00}-\x{9fa5}]{3,5}[}\)\]]{2}([a-zA-Z0-9]){3,5}~~[\x{4e00}-\x{9fa5}]{3,5}[{\(\[]{2}~/u','',$csstr)); 
}

function caesar_encrypt_g($text, $shift=7){
    // 确保 shift 在 0 到 25 的范围内（处理负数和大于26的情况）
    $shift = (($shift % 26) + 26) % 26;

    try {
        $new_str = '';
        $length = strlen($text);

        for ($blxl = 0; $blxl < $length; $blxl++){
            $char = $text[$blxl];
            #使用 ctype_lower() 和 ctype_upper() 来判断字符是否为小写或大写字母，这比正则更高效且符合 PHP 风格
            if (ctype_lower($char)){
                // 小写字母：'a' = 97
                $new_char = chr((ord($char) - 97 + $shift) % 26 + 97);
                $new_str .= $new_char;
            } elseif (ctype_upper($char)){
                // 大写字母：'A' = 65
                $new_char = chr((ord($char) - 65 + $shift) % 26 + 65);
                $new_str .= $new_char;
            } else {
                // 非字母字符保持不变
                $new_str .= $char;
            }
        }

        return [$new_str, ''];
    } catch (Exception $e){
        return [$text, $e->getMessage()];
    }
}

function caesar_decrypt_g($encryptedText, $shift=7){
    // 解密实际上是用负数位移量进行加密
    $shift = (($shift % 26) + 26) % 26;
    return caesar_encrypt_g($encryptedText, 26 - $shift);
}

function base64_encode_g($str){
    try {
        // 确保字符串是 UTF-8（通常已经是）
        // JavaScript 的 encodeURIComponent + byte conversion 等价于 UTF-8 字节序列
        // PHP 的 base64_encode 直接对原始字节编码，所以直接使用即可
        $new_str = base64_encode($str);
        return [$new_str, ''];
    } catch (Exception $e) {
        return [$str, $e->getMessage()];
    }
}

function base64_decode_g($base64Str){
    try {
        // strict mode: 第二个参数设为 true，无效 Base64 时返回 false
        $binary = base64_decode($base64Str, true);

        if ($binary === false){
            throw new Exception("Invalid base64 string");
        }

        // $binary 已是 UTF-8 编码的字符串
        return [$binary, ''];
    } catch (Exception $e){
        return [$base64Str, $e->getMessage()];
    }
}

function bc_encode_g($csstr,$shift=7){
    [$new_str,$is_ok]=base64_encode_g($csstr);
    if ($is_ok!==''){
        return [$csstr,$is_ok];
    }
    
    [$new_str,$is_ok]=caesar_encrypt_g($new_str, $shift);
    if ($is_ok!==''){
        return [$csstr,$is_ok];
    }
    return [$new_str,''];
}

function bc_decode_g($csstr,$shift=7){
    [$new_str,$is_ok]=caesar_decrypt_g($csstr, $shift);
    if ($is_ok!==''){
        return [$csstr,$is_ok];
    }
    [$new_str,$is_ok]=base64_decode_g($new_str);
    if ($is_ok!==''){
        return [$csstr,$is_ok];
    }
    return [$new_str,''];
}
?>

