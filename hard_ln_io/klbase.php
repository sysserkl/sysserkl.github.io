<?php
function origin_g($subdir_or_file=''){
    if (isset($_SERVER['HTTP_HOST'])){  #不能使用defined - 保留注释
        return 'http://'.$_SERVER['HTTP_HOST'].'/'.$subdir_or_file;
    }
    else {
        return 'http://127.0.0.1/'.$subdir_or_file;
    }
}

function file_check_g($file_path_name,$show_full_name=false,$check_write=false,$check_is_file=true,$max_size=50){   //$max_size 单位 MB - 保留注释
    if ($show_full_name){
        $bname=$file_path_name;
    } else {
        $bname = pathinfo($file_path_name)['basename'];
    }
    if ($check_is_file){
        $dirname=pathinfo($file_path_name)['dirname'];
        if (!is_dir($dirname)){
            return $dirname.' is not a path';
        }
        if (!is_file($file_path_name)){
            return $bname.' is not a file';
        }
    }
    if (!file_exists($file_path_name)){
        return $bname.' does not exists';
    }
    if (!is_readable($file_path_name)){
        return $bname.' is not readable';
    }
    if ($check_write and !is_writable($file_path_name)){
        return $bname.' is not writable';
    }
    if ($max_size>=0){
        $fsize=filesize($file_path_name)/1024/1024; //MB - 保留注释
        if ($fsize>$max_size){
            return $bname.' large than '.$max_size.' MB';
        }
    }
    return '';
}

function strcmp_array_g($arr1,$arr2){
    //用法 $intersect = array_uintersect($moneydata2, $moneydata, 'strcmp_array_g');
    //用法 $intersect = array_udiff($moneydata2, $moneydata, 'comparevalue');
    $cmp1comma2=strcmp(implode("#@$", $arr1), implode("#@$", $arr2));
    $cmp12=strcmp(implode("*!~", $arr1), implode("*!~", $arr2));
    
    if ($cmp1comma2==0 and $cmp12==0){
        return 0;
    } elseif ($cmp12==0){
        return $cmp1comma2;
    }
    return $cmp12;
}

function js_alert_g($csstr,$id=''){
    echo "\n".'<script>'."\n";
    echo 'js_alert_b("'.specialstr92_g($csstr).'","'.specialstr92_g($id).'")'."\n";
    echo '</script>'."\n";
}

function client_g(){
    $blclient=strtolower($_SERVER['HTTP_USER_AGENT']);
    $bljg='';
    $list_t=['chrome','chromium','firefox','safari'];
    foreach ($list_t as $item){
        if (false===strpos($blclient,$item)){continue;}
        $bljg=substr($item,0,2);
        break;
    }

    $list_t=['ubuntu','android','linux','win','bsd','unix'];
    foreach ($list_t as $item){
        if (false===strpos($blclient,$item)){continue;}
        $bljg=$bljg.substr($item,0,2);
        break;
    }
    if ($bljg==''){
        $bljg='other';
    }
    return $bljg;
}

function parentdir_g($csdir){
    //如果 $csdir 是文件，则返回目录，末尾不含 / - 保留注释
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

function txt2jsarray_g($csstr,$remove_r=false,$replace_n=false){
    #str2js - 保留注释
    if ($remove_r){
        $csstr=str_replace("\r",'',$csstr);
    }
    
    if (strpos($csstr, "\\") !== false){
        $csstr=str_replace("\\",'\\\\',$csstr);
    }
    if (strpos($csstr, '"') !== false){
        $csstr=str_replace('"','\"',$csstr);
    }

    if ($replace_n){
        $csstr=str_replace("\n",'\n',$csstr);   //放在后部 - 保留注释
    }    
    return '"'.$csstr.'"';
}

function filelist_g($csdir,$cstype='',$csfilter='',$onlyname=false,$csmax=-1){
    //cstype: f d - 保留注释
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
    if (strpos($cstype, 'd') !== false){
        $include_dir=true;
    }
    if (strpos($cstype, 'f') !== false){
        $include_file=true;
    }
    if ($include_dir==false and $include_file==false){
        return [];
    }
    
    if ($csfilter!==''){
        preg_match($csfilter, '');
        if (preg_last_error() !== PREG_NO_ERROR){
            return [];
        }
    }
    
    if (false != ($handle = opendir ( $csdir ))){
        $blxl=0;
        while ( false !== ($file = readdir ( $handle )) ){
            //去掉"“.”、“..”以及带“.xxx”后缀的文件
            if ($file == '.' or $file == '..'){continue;}
            if (!is_readable($csdir.$file)){continue;}
            
            $is_push=false;
            if (is_dir($csdir.$file)){
                if (substr($file,-1)!=='/'){
                    $file=$file.'/';
                }
                if ($include_dir){
                    $is_push=true;
                }
            } elseif ($include_file and is_file($csdir.$file)){
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
                if ($blxl>=$csmax){break;}
            }
            
            //-----------------------
            if (is_dir($csdir.$file)){
                //返回含完整路径的结果 - 保留注释
                $templist=filelist_g($csdir.$file,$cstype,$csfilter,false,$csmax);
                $file_list=array_merge($file_list,$templist);
                $blxl=$blxl+count($templist);
                if ($blxl>=$csmax){break;}
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

function regexp_g($pattern, $subject){
    return preg_match("/{$pattern}/i", $subject);
}

function testre_g($cskey,$do_echo=false){
    $do_reg=false;
    if ($do_echo){
        echo '`'."\n";
    }
    preg_match('/'.$cskey.'/i', 'some words');
    if ($do_echo){
        echo "\n";
    }    
    if (preg_last_error()==PREG_NO_ERROR){
        $do_reg=true;
    }
    if ($do_echo){
        echo '`;'."\n";
    }    
    return $do_reg;
}

function str_reg_check_g($cskey,$is_reg=false,$do_trim=true,$cstype='(:r)'){
    $bllen=strlen($cstype)*-1;
    if (substr($cskey,$bllen)==$cstype){
        $is_reg=true;
        $cskey=substr($cskey,0,$bllen);
    }
    if ($do_trim){
        $cskey=rtrim($cskey);
    }
    return [$cskey,$is_reg];
}

function str_reg_search_g($csinput,$cskeys,$csreg){
    //$csinput 和 $cskeys 可以是字符串，也可以是数组 - 保留注释
    //如果返回 -1 ，表示正则表达式出错 - 保留注释
    $sub_str_reg_search_g_normal=function ($csinput,$word_t){
        $blfound_t2=false;
        foreach ($csinput as $item_t){
            if (strpos($item_t.'',$word_t)!==false){
                $blfound_t2=true;
                break;
            }
        }
        return $blfound_t2;
    };
    
    $sub_str_reg_search_g_re=function ($csinput,$word_t){
        $blfound_t2=false;
        foreach ($csinput as $item_t){
            if (preg_match("/{$word_t}/i", $item_t.'')){
                $blfound_t2=true;
                break;
            }
        }
        return $blfound_t2;
    };
    //-----------------------
	$blfound_t=false;
	if (is_array($csinput)==false){
		$csinput=[''.$csinput];   //可能不是字符串，typeof $csinput!=='string' - 保留注释
	}
    //如果 查询关键字 是 字符串，则转换为数组 - 保留注释
    if (is_string($cskeys)){
        $cskeys=explode(' ',$cskeys);
    }

    foreach ($cskeys as $word_t){
		if ($word_t=='' or $word_t=='+' or $word_t=='-'){continue;}
        
		if ($csreg==false){
			if (substr($word_t,0,1)=='+'){
                $blfound_t2=$sub_str_reg_search_g_normal($csinput,substr($word_t,1,));
                if ($blfound_t2==false){
                    $blfound_t=false;
                    break;
                } else {
                    $blfound_t=true;
                } 
			} else if (substr($word_t,0,1)=='-'){
                $blfound_t2=$sub_str_reg_search_g_normal($csinput,substr($word_t,1,));
                if ($blfound_t2==true){
                    $blfound_t=false;
                    break;
                } else {
                    $blfound_t=true;
                }
			} else {
                $blfound_t2=$sub_str_reg_search_g_normal($csinput,$word_t);
                if ($blfound_t2==true){
                    $blfound_t=true;
                }
			}
		} else {
			try {
				if (substr($word_t,0,1)=='+'){
                    $blfound_t2=$sub_str_reg_search_g_re($csinput,substr($word_t,1,));
                    if ($blfound_t2==false){
                        $blfound_t=false;
                        break;
                    } else {
                        $blfound_t=true;
                    } 
				} else if (substr($word_t,0,1)=='-'){
                    $blfound_t2=$sub_str_reg_search_g_re($csinput,substr($word_t,1,));
                    if ($blfound_t2==true){
                        $blfound_t=false;
                        break;
                    } else {
                        $blfound_t=true;
                    } 
				} else {
                    $blfound_t2=$sub_str_reg_search_g_re($csinput,$word_t);
                    if ($blfound_t2==true){
                        $blfound_t=true;
                    }
				}
			} catch (Exception $err){
                echo '#error: ',  $word_t.' '.$err->getMessage(), "\n";
				return -1;
			}
		}
	}
	return $blfound_t;
}

function memory_used_g(){
    $mem_usage = memory_get_usage(true);
    return kbmbgb_g($mem_usage,2);
}

function kbmbgb_g($cssize,$afterpoint=2){
    $bldw='';
    if ($cssize>=1000){
        $cssize=$cssize/1024;
        $bldw='KB';
    }
    if ($cssize>=1000){
        $cssize=$cssize/1024;
        $bldw='MB';
    }
    if ($cssize>=1000){
        $cssize=$cssize/1024;
        $bldw='GB';
    }
    if ($cssize>=1000){
        $cssize=$cssize/1024;
        $bldw='TB';
    }    
    if ($bldw==''){
        return $cssize;
    }
    return round($cssize,$afterpoint).$bldw;
}

function getcsv_g($fname){
    $list_t=[];
    if (file_exists($fname) and strtolower(substr($fname,-4))=='.csv'){
        if (($handle = fopen($fname, "r")) !== FALSE){
            while (($data = fgetcsv($handle)) !== FALSE){
                array_push($list_t,$data);
            }
            fclose($handle);
        }
    }
    return $list_t;
}

function str_replace_once_g($find, $replace, $csstr){
    $pos = strpos($csstr, $find);
    if ($pos !== false){
        $csstr = substr_replace($csstr, $replace, $pos, strlen($find));
    }
    return $csstr;
}

function array_sort_by_length_g($a, $b){
    if (strlen($a) == strlen($b)){
        return 0;
    }
    return (strlen($a) < strlen($b)) ? -1 : 1;
}

function img_ext_g(){
    return ['avif','bmp','gif','jfif','jpeg','jpg','png','webp'];
}

function post_get_str_get_g($post_name,$get_name='',$default_value='',$cstype='',$ignore_empty=true){
    $key=$default_value;
    
    $post_or_get='';
    
    if (($cstype=='' or $cstype=='post') and isset($_POST[$post_name]) and ($ignore_empty==false or $_POST[$post_name]!=='')){
        $key=$_POST[$post_name];
        $post_or_get='post';
    }
    
    if (($cstype=='' or $cstype=='get') and isset($_GET[$get_name]) and ($ignore_empty==false or $_GET[$get_name]!=='')){
        $key=$_GET[$get_name];
        $post_or_get='get';
    }
    
    return [$key,$post_or_get];
}

function post_get_boolean_get_g($post_name,$get_name='',$default_value=false,$cstype=''){
    $key=$default_value;
    
    $post_or_get='';
    
    if ($cstype=='' or $cstype=='post'){
        $key=isset($_POST[$post_name]);
        $post_or_get='post';
    }
    
    if ($cstype=='' or $cstype=='get'){
        $key=isset($_GET[$get_name]);
        $post_or_get='get';
    }
    
    return [$key,$post_or_get];
}

function str_reg_post_g($cskey,$post_or_get='',$post_name='',$is_reg=false){
    if ($post_or_get=='post' and $post_name!==''){    
        $is_reg=isset($_POST[$post_name]);
    }
    
    [$cskey,$is_reg]=str_reg_check_g($cskey,$is_reg);
    
    if ($is_reg){
        $is_reg=testre_g($cskey,true);
    }
    return [$cskey,$is_reg];
}

function asc_sum_g($csstr){
    $asc_t=0;
    $length_t=strlen($csstr);
    for ($blxl = 0; $blxl < $length_t; $blxl++){    
        $asc_t=$asc_t+ord($csstr[$blxl]);
    }
    return $asc_t;
}
?>
