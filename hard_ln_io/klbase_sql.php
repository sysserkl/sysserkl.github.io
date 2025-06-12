<?php
require_once "klbase.php";
#-----------------------
#history
#0.0.1-20230808
#-----------------------
function filter_query_g($csstr){    
    $list_t=explode(' ',$csstr);
    $filter_t=["query","select","drop","delete","where","limit","function","global","require_once","require","if","return","echo","foreach","as","insert","update","values","break","into","order","and","or","not","true","false","\\"];
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
        if (substr($item,0,1)=='+' or substr($item,0,1)=='-'){
            $and_t=true;
            break;
        }
    }
    if ($and_t){
        $bljg2=[];
        foreach ($bljg as $item){
            if (substr($item,0,1)=='+' or substr($item,0,1)=='-'){
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

function query_make_g($keys,$columns,$reg=false){
    //query_make_g($key,["title","href(n)"]);
    //query_make_g($key,["title,标题","href(n),链接"]);
    $bljg='';
    if (count($keys)==1 and $keys[0]==''){return '';}
    foreach ($keys as $akey){
        if ($keys==''){continue;}
        $pre=' or ';
        if (substr($akey,0,1)=='+'){
            $pre=' and ';
            $akey=substr($akey,1,strlen($akey)-1);
        } elseif (substr($akey,0,1)=='-'){
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
                    if ($tmp2_t!=='(:'.$acol_list_t[0].')' and $tmp2_t!=='(:'.$acol_list_t[1].')'){continue;}
                } else {
                    if ($tmp2_t!=='(:'.$acol_list_t[0].')'){continue;}
                }
                $akey=$tmp1_t;
                
                $akey_and_acol=key_type_g($akey,$acol_list_t[0],$reg);
                if ($akey_and_acol!==''){
                    if ($blstr_t==''){
                        $blstr_t=$akey_and_acol.' ';
                    } else {
                        $blstr_t=$blstr_t.' or '.$akey_and_acol.' ';
                    }
                }
                break;
            }

            $akey_and_acol=key_type_g($akey,$acol_list_t[0],$reg);
            if ($akey_and_acol!==''){
                if ($blstr_t==''){
                    $blstr_t=$akey_and_acol.' ';
                } else {
                    $blstr_t=$blstr_t.' or '.$akey_and_acol.' ';
                }
            }
        }
        if (substr($blstr_t,-1)==' '){
            $blstr_t=substr($blstr_t,0,strlen($blstr_t)-1);
        }
        if ($blstr_t!==''){
            $blstr_t='('.$blstr_t.')';

            if ($bljg==''){
                if ($pre==' and not '){
                    $bljg='not '.$blstr_t.' ';
                } else {
                    $bljg=$blstr_t;
                }
            } else {
                $bljg=$bljg.$pre.$blstr_t.' ';
            }  
        }
    }
    if (count($keys)==1 and substr($bljg,0,4)!=='not '){
        $bljg=substr($bljg,1,strlen($bljg)-2);
    }

    return $bljg;
}

function key_type_g($akey,$acol,$reg=false){
    //echo '<br />'.$akey.$acol;
    if ($reg){
        $middle=' REGEXP "';
        $end='"';
        $akey=str_replace('&#92;','\\',$akey);
    } else {
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
        } elseif (is_numeric($akey)){
            $middle=substr($middle,0,strlen($middle)-1);
            $end='';
        } else {
            return '';
        }
    } elseif (substr($acol,-3,3)=='(d)' or substr($acol,-3,3)=='(t)'){
        $acol=substr($acol,0,strlen($acol)-3);
        
        if ($is_like_t){
            $acol='CONVERT('.$acol.',char)';
        } else {
            //echo '<br />'.$acol, ' | ', $middle, ' || ', $akey, ' ||| ', $end; //此行用于检查错误 - 保留注释
            //日期大小或等于判断只支持完整的日期形式 - 保留注释
            $pattern = '/^\d{4}-\d{2}-\d{2}$/';
            // 检查字符串是否匹配正则表达式
            if (!preg_match($pattern, $akey)){
                return '';
            }        
        }
    }
        
    return $acol.$middle.$akey.$end;
}

function dbc_structure_g($dbc_name,$dbsize=50){
    $error=file_check_g($dbc_name,false,false,true,$dbsize);
    if ($error !== ''){
        echo $error."\n";
        return [];
    }

    $db = new SQLite3($dbc_name);
    $q='select name from sqlite_master where type="table"';
    $oTableNames=$db->query($q);
    $result_t=[];
    while ($row =$oTableNames->fetchArray(SQLITE3_ASSOC) ){
        foreach ($row as $tablename){
            if ($tablename !== 'sqlite_sequence'){
                $col_name=[];
                $oTableinfo=$db->query("PRAGMA table_info({$tablename})");
                while ($row1=$oTableinfo->fetchArray(SQLITE3_ASSOC)){
                    array_push($col_name,$row1['name']);
                }
                $result_t['t_'.$tablename]=$col_name;
            }
        }
    }
    $db->close(); 
    return $result_t;
}

function dbf_column_get_g($dbc_name='',$table_name='',$dbsize=50){
    $col_list=dbc_structure_g($dbc_name,$dbsize);
    if (count($col_list)==0){return [$table_name,[]];}

    $columns=[];    
    if ($table_name==''){
        foreach ($col_list as $key => $val){
            $table_name=substr($key,2,);
            $columns=$val;
            break;
        }
    } elseif (array_key_exists('t_'.$table_name, $col_list)){
        $columns=$col_list['t_'.$table_name];
    }
    return [$table_name,$columns];
}

function key_generate_g($columns,$search_str=''){
    $reg=false;
    $search_str=htmlspecialchars($search_str);
    if (substr($search_str,-4,4) == '(:r)'){
        $reg=true;
        $search_str=query_make_g(filter_query_g(substr($search_str,0,-4)),$columns,$reg);
    } else {
        $search_str=query_make_g(filter_query_g($search_str),$columns,$reg);
    }

    return SQLite3::escapeString($search_str);
}

function dbc_search_g($dbc_name='',$table_name='',$search_str='',$dbsize=50,$max_rows=10000){
    if ($search_str==''){return;}

    [$table_name,$columns]=dbf_column_get_g($dbc_name,$table_name,$dbsize);
    if (count($columns)==0){return;}
    
    $search_str=key_generate_g($columns,$search_str);
    if ($search_str==''){return;}

    $database = new SQLite3($dbc_name);
    $database->createFunction('REGEXP', 'regexp_g');

    $querystr='select * from '.$table_name.' where '.$search_str.' LIMIT '.$max_rows;

    $datas = $database->query($querystr);
    
    while ($row = $datas->fetchArray(SQLITE3_ASSOC) ){
        echo '[';
        foreach ($row as $key => $val){
            echo ''.txt2jsarray_g($val,true,true).',';
        }
        echo "],\n";
    }
    $database->close();
}
?>
