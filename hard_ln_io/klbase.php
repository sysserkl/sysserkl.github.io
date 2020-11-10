<?php
function strcmp_array_g($arr1,$arr2){
    //用法 $intersect = array_uintersect($moneydata2, $moneydata, 'strcmp_array_g');
    //用法 $intersect = array_udiff($moneydata2, $moneydata, 'comparevalue');
    $cmp1comma2=strcmp(implode("#@$", $arr1), implode("#@$", $arr2));
    $cmp12=strcmp(implode("*!~", $arr1), implode("*!~", $arr2));
    
    if ($cmp1comma2==0 and $cmp12==0){
        return 0;
    }
    elseif ($cmp12==0){
        return $cmp1comma2;
    }
    return $cmp12;
}

function js_alert_g($csstr,$id=''){
    echo "\n".'<script language="javascript">'."\n";
    if ($id===''){
        echo 'alert("'.$csstr.'");'."\n";
    }
    else {
        echo 'document.getElementById("'.$id.'").innerHTML=new Date().toLocaleTimeString()+" "+"'.$csstr.'";'."\n";
        echo 'setTimeout(function(){document.getElementById("'.$id.'").innerHTML="";},5000);'."\n";
    }
    echo '</script>'."\n";
}

function client_g(){
    $blclient=strtolower($_SERVER['HTTP_USER_AGENT']);
    $bljg='';
    $list_t=['chrome','chromium','firefox','safari'];
    foreach ($list_t as $item){
        if (false===strpos($blclient,$item)){
            continue;
        }
        $bljg=substr($item,0,2);
        break;
    }

    $list_t=['ubuntu','android','linux','win','bsd','unix'];
    foreach ($list_t as $item){
        if (false===strpos($blclient,$item)){
            continue;
        }
        $bljg=$bljg.substr($item,0,2);
        break;
    }
    if ($bljg==''){
        $bljg='other';
    }
    return $bljg;
}

function parentdir_g($csdir){
    $at=strrpos($csdir,'/');
    if ($at==false){
        return '';
    }
    $parentdir=substr($csdir,0,$at);
    return $parentdir;
}

function specialstr_g($csstr){
    //for "XXXXXXXXX"
    $bljg=$csstr;
    $bljg=str_replace('\\','&#92;',$bljg);
    $bljg=str_replace('"','&quot;',$bljg);
    $bljg=str_replace("'",'&#39;',$bljg);

    return $bljg;
}

function filelist_g($csdir,$cstype="",$csfilter='',$onlyname=false,$csmax=-1){
    //csfilter 格式如：/.*readlater_data.*/i' - 保留注释
    $file_list=[];
    if (!is_dir($csdir)){
        return [];
    }
    if (substr($csdir,-1)!=='/'){
        $csdir=$csdir.'/';
    }
    if ($cstype==''){
        $cstype='df';
    }
    if ($csmax==-1){
        $csmax=10000;
    }
    
    $include_dir=false;
    $include_file=false;
    if (strpos($cstype, 'd') !== false) {
        $include_dir=true;
    }
    if (strpos($cstype, 'f') !== false) {
        $include_file=true;
    }
    if ($include_dir==false and $include_file==false){
        return [];
    }
    
    if ($csfilter!==''){
        preg_match($csfilter, '');
        if (preg_last_error() !== PREG_NO_ERROR) {
            return [];
        }
    }
    
    if (false != ($handle = opendir ( $csdir ))) {
        $blxl=0;
        while ( false !== ($file = readdir ( $handle )) ) {
            //去掉"“.”、“..”以及带“.xxx”后缀的文件
            if ($file == "." or $file == "..") {
                continue;
            }

            $is_push=false;
            if (is_dir($csdir.$file)){
                if (substr($file,-1)!=='/'){
                    $file=$file.'/';
                }
                if ($include_dir){
                    $is_push=true;
                }
            }
            elseif ($include_file and is_file($csdir.$file)){
                $is_push=true;
            }

            if ($csfilter!==''){
                if (preg_match($csfilter, $csdir.$file)==0){
                    $is_push=false;
                }
            }
                
            if ($is_push){
                array_push($file_list,$csdir.$file);
                $blxl++;
                if($blxl>=$csmax){
                    break;
                }
            }
            
            //--------------
            if (is_dir($csdir.$file)){
                //返回含完整路径的结果 - 保留注释
                $templist=filelist_g($csdir.$file,$cstype,$csfilter,false,$csmax);
                $file_list=array_merge($file_list,$templist);
                $blxl=$blxl+count($templist);
                if($blxl>=$csmax){
                    break;
                }
            }
        }
        //关闭句柄
        closedir ( $handle );
    }
    if (count($file_list)>$csmax){
        $file_list=array_slice($file_list, 0, $csmax);
    }
    
    if ($onlyname){
        //去除 搜索目录 - 保留注释
        $blcount=count($file_list);
        $bllen=strlen($csdir);
        for ($blxl=0;$blxl<$blcount;$blxl++){
            $file_list[$blxl]=substr($file_list[$blxl],$bllen);
        }
    }
    return $file_list;
}

function specialstr92_g($csstr){
    $bljg=$csstr;
    $bljg=str_replace('\\','&#92;',htmlspecialchars(trim($bljg),ENT_QUOTES));
    return $bljg;
}

function filter_query_g($csstr){
    $list_t=explode(' ',$csstr);
    $filter_t=["query","select","drop","delete","where","limit","function","global","require_once","require","if","return","echo","foreach","as","insert","update","values","break","into","order","and","or","not","true","false"];
    $bljg=[];
    foreach ($list_t as $item){
        if (trim($item)==''){continue;}
        if (in_array(strtolower($item),$filter_t) or in_array('+'.strtolower($item),$filter_t) or in_array('-'.strtolower($item),$filter_t)){
            continue;
        }
        if (strpos($item,'(:')!==false){
            $tmp_t=explode('(:',$item)[0];
            if (in_array(strtolower($tmp_t),$filter_t) or in_array('+'.strtolower($tmp_t),$filter_t) or in_array('-'.strtolower($tmp_t),$filter_t)){
                continue;
            }
        }
        array_push($bljg, specialstr_g($item));
    }
    $and_t=false;
    foreach ($bljg as $item){
        if (substr($item,0,1)=='+' or substr($item,0,1)=='-') {
            $and_t=true;
            break;
        }
    }
    if ($and_t){
        $bljg2=[];
        foreach ($bljg as $item){
            if (substr($item,0,1)=='+' or substr($item,0,1)=='-') {
                array_push($bljg2, $item);
            }
        }
        if (count($bljg2)==0){
            return [''];
        }
        return $bljg2;
    }
    if (count($bljg)==0){
        return [''];
    }
    return $bljg;
}

function key_type_g($akey,$acol,$reg=false){
    //echo '<br />'.$akey.$acol;
    if ($reg){
        $middle=' REGEXP "';
        $end='"';
        $akey=str_replace('&#92;','\\',$akey);
    }
    else {
        $middle=' LIKE "%';
        $end='%"';
    }
    $is_like_t=true;

    $operations=[['&gt;=','>='],['&lt;=','<='],['&lt;&gt;','<>'],['=','='],['&gt;','>'],['&lt;','<']];
    foreach ($operations as $a_oper){
        $oper_len=strlen($a_oper[0]);
        if (substr($akey,0,$oper_len)==$a_oper[0]){
            $middle=$a_oper[1].'"';
            $end='"';
            $akey=substr($akey,$oper_len,strlen($akey)-$oper_len);
            $is_like_t=false;
            break;
        }
    }

    if (substr($acol,-3,3)=='(n)'){
            $acol=substr($acol,0,strlen($acol)-3);
            if ($is_like_t){
                $acol='CONVERT('.$acol.',char)';
            }
            elseif (is_numeric($akey)) {
                $middle=substr($middle,0,strlen($middle)-1);
                $end='';
            }
            else {return '';}
    }
    elseif (substr($acol,-3,3)=='(d)' or substr($acol,-3,3)=='(t)'){
            $acol=substr($acol,0,strlen($acol)-3);
            if ($is_like_t){
                $acol='CONVERT('.$acol.',char)';
            }
    }
        
    return $acol.$middle.$akey.$end;
}

function query_make_g($keys,$columns,$reg=false){
    //query_make_g($key,["title","href(n)"]);
    //query_make_g($key,["title,标题","href(n),链接"]);
    $bljg='';
    foreach ($keys as $akey){
        if ($keys==''){continue;}
        $pre=' or ';
        if (substr($akey,0,1)=='+'){
            $pre=' and ';
            $akey=substr($akey,1,strlen($akey)-1);
        }
        elseif (substr($akey,0,1)=='-'){
            $pre=' and not ';
            $akey=substr($akey,1,strlen($akey)-1);
        }

        $blstr_t='';
        foreach ($columns as $acol){ 
            $acol_list_t=explode(',',$acol);

            if (substr($akey,-1)==')' and strpos($akey,'(:')!==false){
                $tmp1_t=substr($akey,0,strrpos($akey,'(:'));
                $tmp2_t=substr($akey,strrpos($akey,'(:'));
                
                if (count($acol_list_t)>1){
                    if ($tmp2_t!=='(:'.$acol_list_t[0].')' and $tmp2_t!=='(:'.$acol_list_t[1].')'){
                        continue;
                    }
                }
                else {
                    if ($tmp2_t!=='(:'.$acol_list_t[0].')'){
                        continue;
                    }
                }
                $akey=$tmp1_t;
                
                $akey_and_acol=key_type_g($akey,$acol_list_t[0],$reg);
                if ($akey_and_acol!==''){
                    if ($blstr_t=='') {
                        $blstr_t=$akey_and_acol.' ';
                    }
                    else {
                        $blstr_t=$blstr_t.' or '.$akey_and_acol.' ';
                    }
                }
                break;
            }

            $akey_and_acol=key_type_g($akey,$acol_list_t[0],$reg);
            if ($akey_and_acol!==''){
                if ($blstr_t=='') {
                    $blstr_t=$akey_and_acol.' ';
                }
                else {
                    $blstr_t=$blstr_t.' or '.$akey_and_acol.' ';
                }
            }
        }
        if (substr($blstr_t,-1)==' '){
            $blstr_t=substr($blstr_t,0,strlen($blstr_t)-1);
        }
        if ($blstr_t!==''){
            $blstr_t='('.$blstr_t.')';

            if ($bljg=='') {
                if ($pre==' and not '){$bljg='not '.$blstr_t.' ';}
                else {$bljg=$blstr_t;}
            }
            else {
                $bljg=$bljg.$pre.$blstr_t.' ';
            }  
        }
    }
    if (count($keys)==1 and substr($bljg,0,4)!=='not '){
        $bljg=substr($bljg,1,strlen($bljg)-2);
    }

    return $bljg;
}

function regexp_g($pattern, $subject) {
    return preg_match("/{$pattern}/", $subject);
}

function memory_used_g() {
    $mem_usage = memory_get_usage(true);
    if ($mem_usage < 1024) {
        $mem_usage .= ' B';
    } elseif ($mem_usage < 1048576) {
        $mem_usage = round($mem_usage/1024,2) . ' KB';
    } else {
        $mem_usage = round($mem_usage/1048576,2) . ' MB';
    }
    return $mem_usage;
}

function getcsv_g($fname){
    $list_t=[];
    if (file_exists($fname) and strtolower(substr($fname,-4))=='.csv'){
        if (($handle = fopen($fname, "r")) !== FALSE) {
            while (($data = fgetcsv($handle)) !== FALSE) {
                array_push($list_t,$data);
            }
            fclose($handle);
        }
    }
    return $list_t;
}

function str_replace_once_g($find, $replace, $csstr){
    $pos = strpos($csstr, $find);
    if ($pos !== false) {
        $csstr = substr_replace($csstr, $replace, $pos, strlen($find));
    }
    return $csstr;
}
?>
