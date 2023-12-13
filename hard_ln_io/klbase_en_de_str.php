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
    //echo $csstr;
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
?>
