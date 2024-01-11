//-----------------------
//history
//0.0.1-20180908
//-----------------------
function random_chs_b(cslength,return_list=false){
	var csnum=arguments.length;
	if (csnum==0){
        var cslength= 1;
    }
    var bljg=[];
    for (let blxl=0;blxl<cslength;blxl++){
        bljg.push(String.fromCodePoint(Math.round(Math.random()*20901+19968)));
    }
    if (return_list){
        return bljg;
    } else {
        return bljg.join('');
    }
}

function characters_b(cstype){
    var str = '';
    if (cstype.includes('A')){
        for (let blxl=65;blxl<91;blxl++){
            str=str+String.fromCharCode(blxl);
        }
    }
    if (cstype.includes('a')){
        for (let blxl=97;blxl<123;blxl++){
            str=str+String.fromCharCode(blxl);
        }
    }
    if (cstype.includes('0') || cstype.includes('1')){
        str=str+'0123456789';
    }
    return str;    
}

function number_tw_b(csnumber){
    //csnumber 0-9
    csnumber=Math.max(0,Math.min(9,parseInt(csnumber)));
    return ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖','拾'][csnumber];
}

function randint_b(csmin,csmax){
    return Math.floor(Math.random()*(csmin - (csmax+1)) +csmax+1);
}

function randint_list_b(csmin,csmax,cscount){
    var range=csmax-(csmin-1);
    if (range<1){return [];}

    var result_t=[];    
    for (let blxl=csmin;blxl<=csmax;blxl++){       
        if (cscount==0){break;}
        var percent=cscount/(csmax-(blxl-1));
        if (Math.random()<=percent){
            result_t.push(blxl);
            cscount=cscount-1;
        }
    }
    result_t.sort(randomsort_b);
    return result_t;
}

function randwrongstr_b(cslen){
    var list_t=['`', '_', '^', '÷', '×', '≠', '≤', '≥', '_', '_', '_', '-', '_', '-', '¡', '¿', '‘', '⁻', '⁺', '§', '¶', '©', '®', '™', '@', '¤', '£', '¥', '₠', '₡', '₢', '₣', '₤', '₥', '₦', '₧', '₨', '₩', '₪', '₫', '€', '₭', '₮', '₯', '±', '←', '←', '_', '←', '→', '→', '_', '→', '↑', '↓', '♪', '◢', '◣', '؟', 'ɐ', '￥', '╰', '_', '╯', '╯', '#', '-', '_', '-', '╯', '╧', '═', '╧', '—', '—', '▔', '＾', '▔', '╮', '╯', '▽', '╰', '╭', '৳', '⁰', '⅛', '¼', '⅜', '½', '⅝', '⅞', '¹', '¹', '⁰', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', 'á', 'à', 'ă', 'ắ', 'ằ', 'ẵ', 'ẳ', 'ặ', 'â', 'ấ', 'ầ', 'ẫ', 'ẩ', 'ậ', 'ǎ', 'å', 'ǻ', 'Å', 'ä', 'ǟ', 'ã', 'ȧ', 'ǡ', 'ą', 'ā', 'ả', 'ȁ', 'ȃ', 'ạ', 'ḁ', 'ẚ', 'ª', 'ḃ', 'ḅ', 'ḇ', 'ɓ', 'ć', 'ĉ', 'č', 'ċ', 'ç', 'ḉ', 'ƈ', 'ď', 'ḋ', 'đ', 'ḑ', 'ḍ', 'ḓ', 'ḏ', 'ɗ', 'ð', 'ǳ', 'ǆ', 'é', 'è', 'ĕ', 'ê', 'ế', 'ề', 'ễ', 'ể', 'ệ', 'ě', 'ë', 'ẽ', 'ė', 'ȩ', 'ḝ', 'ę', 'ē', 'ḗ', 'ḕ', 'ẻ', 'ȅ', 'ȇ', 'ẹ', 'ḙ', 'ḛ', 'ɛ', 'ḟ', 'ǵ', 'ğ', 'ĝ', 'ǧ', 'ġ', 'ǥ', 'ģ', 'ḡ', 'ɠ', 'ĥ', 'ȟ', 'ḧ', 'ḣ', 'ħ', 'ḩ', 'ḥ', 'ḫ', 'ẖ', 'ƕ', 'í', 'ì', 'ĭ', 'î', 'ǐ', 'ï', 'ḯ', 'ĩ', 'į', 'ī', 'ỉ', 'ȉ', 'ȋ', 'ị', 'ḭ', 'ı', 'ĳ', 'ĵ', 'ǰ', 'ḱ', 'ǩ', 'ķ', 'ḳ', 'ḵ', 'ƙ', 'ĺ', 'ľ', 'ŀ', 'ł', 'ļ', 'ḷ', 'ḹ', 'ḽ', 'ḻ', 'ǉ', 'ḿ', 'ṁ', 'ṃ', 'ń', 'ǹ', 'ň', 'ñ', 'ṅ', 'ņ', 'ṇ', 'ṋ', 'ṉ', 'ŉ', 'ó', 'ò', 'ŏ', 'ô', 'ố', 'ồ', 'ổ', 'ộ', 'ǒ', 'ö', 'ȫ', 'ő', 'õ', 'ṍ', 'ȯ', 'ȱ', 'ø', 'ǫ', 'ō', 'ṓ', 'ṑ', 'ọ', 'ớ', 'ờ', 'ỡ', 'ở', 'ợ', 'ɔ', 'º', 'œ', 'ṕ', 'ṗ', 'ŕ', 'ř', 'ṙ', 'ŗ', 'ȑ', 'ȓ', 'ṛ', 'ṝ', 'ṟ', 'ś', 'ṥ', 'ŝ', 'š', 'ṧ', 'ṡ', 'ş', 'ṣ', 'ṩ', 'ẛ', 'ß', 'ť', 'ṫ', 'ŧ', 'ţ', 'ṭ', 'ṱ', 'ṯ', 'ú', 'ù', 'ŭ', 'û', 'ǔ', 'ů', 'ü', 'ǘ', 'ǜ', 'ǚ', 'ǖ', 'ű', 'ũ', 'ṹ', 'ų', 'ū', 'ṻ', 'ủ', 'ȕ', 'ȗ', 'ụ', 'ṳ', 'ṷ', 'ṵ', 'ư', 'ứ', 'ừ', 'ữ', 'ử', 'ự', 'ṽ', 'ṿ', 'ẃ', 'ẁ', 'ŵ', 'ẘ', 'ẅ', 'ẇ', 'ẉ', 'ƿ', 'ý', 'ỳ', 'ŷ', 'ẙ', 'ÿ', 'ỹ', 'ẏ', 'ȳ', 'ỷ', 'ỵ', 'ƴ', 'ȝ', 'ź', 'ẑ', 'ž', 'ż', 'ƶ', 'ẓ', 'ẕ', 'ȥ', 'ʒ', 'Α', 'α', 'Β', 'β', 'Γ', 'γ', 'Δ', 'δ', 'Ε', 'ε', '￣', 'ε', '￣', 'Ζ', 'ζ', 'Η', 'η', 'Θ', 'θ', 'Ι', 'ι', 'Κ', 'κ', 'Λ', 'λ', 'Μ', 'μ', 'Ν', 'ν', 'Ξ', 'ξ', 'Ο', 'ο', 'Π', 'π', 'ρ', 'Σ', 'σ', 'ς', 'Τ', 'τ', 'Υ', 'υ', 'Φ', 'φ', 'Χ', 'χ', 'Ψ', 'ψ', 'ψ', '￣', '︶', '￣', 'ψ', 'Ω', 'ω', 'а', 'А', 'б', 'Б', 'в', 'В', 'г', 'Г', 'д', 'Д', 'е', 'Е', 'ё', 'Ё', 'ж', 'Ж', 'з', 'З', 'и', 'И', 'й', 'Й', 'к', 'К', 'л', 'Л', 'м', 'М', 'н', 'Н', 'о', 'О', 'п', 'П', 'р', 'Р', 'с', 'С', 'т', 'Т', 'у', 'У', 'ф', 'Ф', 'х', 'Х', 'ц', 'Ц', 'ч', 'Ч', 'ш', 'Ш', 'щ', 'Щ', 'ъ', 'Ъ', 'ы', 'Ы', 'ь', 'Ь', 'э', 'Э', 'ю', 'Ю', 'я', 'Я', '☬', '勹', '賁', '灬', '髟', '冫', '癶', '卜', '歺', '艸', '艹', '镸', '鬯', '屮', '牜', '彳', '巛', '疒', '辵', '辶', '隹', '刂', '弍', '弐', '貮', '匚', '阝', '罓', '鬲', '廾', '夬', '龜', '巜', '丨', '虍', '㗊', '亼', '己', '彐', '彑', '旡', '卩', '钅', '井', '冂', '臼', '㠪', '亅', '凵', '卝', '爫', '耒', '離', '㸚', '叕', '㒳', '臨', '〇', '冃', '芈', '冖', '糸', '纟', '宀', '丬', '爿', '疋', '丿', '攴', '攵', '菐', '靑', '犭', '冄', '亻', '禸', '彡', '飠', '饣', '矢', '豕', '丗', '士', '礻', '扌', '殳', '氵', '氺', '厶', '糹', '亖', '巳', '夊', '亠', '尢', '尣', '㓁', '罒', '囗', '㐅', '夕', '覀', '匸', '心', '忄', '吅', '穴', '襾', '訁', '讠', '幺', '爻', '弌', '衤', '廴', '酉', '兂', '㠭', '夂', '黹', '豸', '丶', '丵',];
    
    var bljg='';
    for (let blxl=1;blxl<=cslen;blxl++){
        list_t.sort(function (a,b){return Math.random()>0.5 ? 1 : -1;});
        bljg=bljg+list_t[0];
    }
    return bljg;
}

function randstr_b(cslen=8,csnumber=true,csletter=true){
    var bljg='';
    if (csnumber==true && csletter==true){
        var list_t=characters_b('aA1').split('');
        for (let blxl=1;blxl<=cslen;blxl++){
            bljg=bljg+list_t[randint_b(0,61)];
        }
    } else if (csletter==true){
        var list_t=characters_b('aA').split('');
        for (let blxl=1;blxl<=cslen;blxl++){
            bljg=bljg+list_t[randint_b(0,51)];
        }
    } else {
        for (let blxl=1;blxl<=cslen;blxl++){
            bljg=bljg+randint_b(0,9);
        }        
    }
    return bljg;
}

function random_strs_b(){
    var blquote1='{[('.split('');
    var blquote2=')]}'.split('');
    var bljg=blquote2[randint_b(0,2)]+blquote2[randint_b(0,2)]+randstr_b(randint_b(3,5));
    bljg='~'+random_chs_b(randint_b(3,5))+bljg+'~~'+random_chs_b(randint_b(3,5));
    return bljg+blquote1[randint_b(0,2)]+blquote1[randint_b(0,2)]+'~';
}

function en_confuse_str_b(csstr,cssegments=-1){
    function sub_en_confuse_str_b_getRandomSubarray(arr, size){
        var shuffled = arr.slice(0);
        var bllen = arr.length;
        var temp;
        var index;
        
        while (bllen--){
            index = Math.floor((bllen + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[bllen];
            shuffled[bllen] = temp;
        }
        return shuffled.slice(0, size);
    }
    //-----------------------
    if (csstr.length==0){
        return csstr;
    }
    csstr=reverse_str_b(csstr); //依赖 klbase.js
    var len_t=csstr.length;

	if (cssegments==-1){
        cssegments= Math.max(8,Math.round(len_t/4));
    }
    cssegments=Math.min(parseInt(cssegments),len_t);
    
    var lenlist=[];
    for (let blxl=0;blxl<len_t;blxl++){
        lenlist[blxl]=blxl;
    }
    lenlist=sub_en_confuse_str_b_getRandomSubarray(lenlist,cssegments).sort(function(a,b){return a>b ? 1 : -1;});

    var bljg=csstr.substring(0,lenlist[0]);
    
    for (let blxl=0;blxl<lenlist.length;blxl++){
        if (blxl<lenlist.length-1){
            bljg=bljg+random_strs_b()+csstr.substring(lenlist[blxl],lenlist[blxl+1]);
        } else {
            bljg=bljg+random_strs_b()+csstr.substring(lenlist[blxl]);
        }
    }

    return bljg;
}

function de_confuse_str_b(csstr){
    if (csstr==''){
        return '';
    }
    return (csstr.replace(/~[^\x00-\xff]{3,5}[}\)\]]{2}([a-zA-Z0-9]){3,5}~~[^\x00-\xff]{3,5}[{\(\[]{2}~/g,'')).split('').reverse().join(''); 
}

function odd_str_b(csstr){
    if (csstr.length<=1){
        return csstr;
    }
    var list_t=csstr.split('');
    if (list_t.length % 2 == 1){
        list_t.push('');
    }
    var bljg='';
    for (let blxl=1;blxl<list_t.length;blxl=blxl+2){
        bljg=bljg+list_t[blxl]+list_t[blxl-1];
    }
    return bljg;
}

function en_interval_str_b(csstr){
    if (csstr.length<2){
        return csstr;
    }
    var list_t=csstr.match(/(.|\n)(.|\n)?/mg);
    if (list_t==null){
        return csstr;
    }
    var bljg='';
    for (let item of list_t){
        if (item.length==2){
            if (Math.random()>0.667){
                bljg=bljg+item+randwrongstr_b(1);
            } else if (Math.random()>0.5){
                bljg=bljg+item+randstr_b(1);
            } else {
                bljg=bljg+item+random_chs_b(1);
            }
        } else {
            bljg=bljg+item;
        }
    }
    return bljg;
}

function de_interval_str_b(csstr){
    if (csstr.length<=2){
        return csstr;
    }
    var list_t=csstr.match(/(.|\n)(.|\n)?(.|\n)?/mg);
    if (list_t==null){
        return csstr;
    }
    var bljg='';
    for (let item of list_t){
        if (item.length==3){
            bljg=bljg+item.substring(0,2);
        } else {
            bljg=bljg+item;
        }
    }
    return bljg;
}

function en_double_str_b(csstr,split_lines=false){
    var t0 = performance.now();
    var result_value=en_interval_str_b(odd_str_b(en_interval_str_b(csstr)));
    console.log('en_double_str_b() 编码 费时：'+(performance.now() - t0) + ' milliseconds');
    
    if (split_lines){
        var list_t=result_value.split('\n');  //必须先加密再分段 - 保留注释
        //以下部分，emoji字符可能显示错误 - 保留注释
        for (let blxl=0;blxl<list_t.length;blxl++){
            var blstr=list_t[blxl];
            if (!blstr.includes("'")){
                blstr="'"+blstr+"',";
            } else if (!blstr.includes('"')){
                blstr='"'+blstr+'",';
            } else if (!blstr.includes("`")){
                blstr="`"+blstr+"`,";
            } else {
                blstr='`'+blstr.replace(new RegExp('`','g'),'`+"`"+`')+'`,';
            }
            list_t[blxl]=blstr;
        }    
        return list_t;
    } else {
        return result_value;
    }
}

function de_double_str_b(csstr){
    return de_interval_str_b(odd_str_b(de_interval_str_b(csstr)));
}

function split_words_b(csstr,cscombine=false){
    //依赖 jieba_pb_dict_data.js - 保留注释
    function sub_split_words_b_two(csstr){
        var list_cn=csstr.match(/[^\x00-\xff]{2,}/g);
        if (list_cn!==null){
            list_cn=array_unique_b(list_cn);

            for (let blxl=0;blxl<list_cn.length;blxl++){
                if (list_cn[blxl].length==2){
                    list_t.push(list_cn[blxl]);
                    list_cn[blxl]='';
                }
            }
            //待进一步处理的，已发现的2个汉字长度的词组 - 保留注释
            return [list_cn.join(' '),array_unique_b(list_t)];  //需要 array_unique_b - 保留注释
        }
        return [csstr,[]];
    }
    
    //-----------------------
    if (typeof jieba_pb_dict_global == 'undefined'){
        console.log('未载入：jieba_pb_dict_data.js');
        if (cscombine){
            return [];
        } else {
            return [[],[]];
        }
    }
    //------------------    
    var t0 = performance.now();
    var list_done=[];
    csstr=csstr.replace(new RegExp("[—、；：。，？！【】（）《》“”‘’…ɑəŋɔʒθ〈〉「」〔〕『』〜～・．－]",'g'),' ');  //〜～ 这两个不一样 - 保留注释
    
    var list_en=csstr.match(/\b[a-zA-Z'\-_]{2,}\b/g);   //英文分词简单处理 - 保留注释
    if (list_en==null){
        list_en=[];
    }
    
    var list_t=[];
    [csstr,list_done]=sub_split_words_b_two(csstr); //其中调用了 list_t - 保留注释
    list_t=list_t.concat(list_done);
    
    for (let blxl=8;blxl>=5;blxl--){
        for (let item of jieba_pb_dict_global['l'+blxl]){
            if (csstr.includes(item)){
                csstr=csstr.replace(new RegExp(item,'g'),' ').trim();
                list_t.push(item);
            }
        }
        if (csstr.match(/[^\x00-\xff]{3,}/g)==null){break;}
        
        [csstr,list_done]=sub_split_words_b_two(csstr); 
        list_t=list_t.concat(list_done);
        console.log('split_words_b() ',blxl,'费时：'+(performance.now() - t0) + ' milliseconds');
    }
    
    for (let blxl=4;blxl>=2;blxl--){
        for (let key in jieba_pb_dict_global['l'+blxl]){
            if (!csstr.includes(key)){continue;}
            
            for (let item of jieba_pb_dict_global['l'+blxl][key]){
                if (csstr.includes(item)){
                    csstr=csstr.replace(new RegExp(item,'g'),' ').trim();
                    list_t.push(item);
                }
            }
        }
        [csstr,list_done]=sub_split_words_b_two(csstr); 
        list_t=list_t.concat(list_done);
        console.log('split_words_b() ',blxl,'费时：'+(performance.now() - t0) + ' milliseconds');
    }
    
    if (list_t.length>0){
        for (let item of list_t){
            csstr=csstr.replace(new RegExp(item,'g'),' ');
        }
        var list_cn=csstr.match(/[^\x00-\xff]{2,}/g);
        list_t=array_union_b(list_t,list_cn);
    }
    list_t=array_unique_b(list_t);
    
    if (cscombine){
        return array_union_b(list_en,list_t);
    } else {
        return [list_en,list_t];
    }
}

function count_words_b(csstr,words_list,csmin=1,csmax=-1){
    var list_t=[];
    for (let item of words_list){
        if (item==''){continue;}
        var blcount=csstr.split(item).length-1;
        if (blcount<csmin){continue;}
        if (csmax>0 && blcount>csmax){continue;}
        list_t.push([item,blcount]);
    }
    list_t.sort();
    list_t.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    return list_t;
}

function number_2_emoji_b(csnum){
    var emoji_list={'🗽':10000, '👑':5000, '💎':1000, '🏆':500, '🏅':100, '🗿':50, '💡':10, '⭐':5, '🛡':1};
    var list_t=[];
    for (let key in emoji_list){
        var quotient=Math.floor(csnum/emoji_list[key]);
        list_t.push([key,quotient]);
        csnum=csnum-quotient*emoji_list[key];
    }
    var bljg='';
    for (let item of list_t){
        for (let blxl=0;blxl<item[1];blxl++){
            bljg=bljg+item[0];
        }
    }
    return bljg;
}

function ChineseToNumber_b(chnStr){
    //阿拉伯数字和中文数字互相转换 https://www.jb51.net/article/86391.htm - 保留注释
    var chnNumChar = { '〇':0, '○':0, '零':0, '一':1, '二':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9 };
    var chnNameValue = { '十': {'value':10, 'secUnit':false}, '百': {'value':100, 'secUnit':false}, '千': {'value':1000, 'secUnit':false}, '万': {'value':10000, 'secUnit':true}, '亿': {'value':100000000, 'secUnit':true} };
    var rtn = 0;
    var section = 0;
    var number = 0;
    var secUnit = false;
    var str = chnStr.split('');

    try {
        for (let blxl = 0; blxl < str.length; blxl++){
            var num = chnNumChar[str[blxl]];
                if (typeof num !== 'undefined'){
                    number = num;
                    if (blxl === str.length - 1){
                        section += number;
                    }
            } else {
                var unit = chnNameValue[str[blxl]].value;
                secUnit = chnNameValue[str[blxl]].secUnit;
                if (secUnit){
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                } else {
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    } catch (error){
        return false;
    }
}

function NumberToChinese_b(csnum){//只支持大于等于0的整数 - 保留注释
    function sub_NumberToChinese_b_Section(section){
        var strIns = '';
        var chnStr = '';
        var unitPos = 0;
        var zero = true;
        while (section > 0){
            var v = section % 10;
            if (v === 0){
                if (!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
            } else {
                zero = false;
                strIns = chnNumChar[v];
                strIns += chnUnitChar[unitPos];
                chnStr = strIns + chnStr;
            }
            unitPos++;
            section = Math.floor(section / 10);
        }
        return chnStr;
    }
    //-----------------------
    var chnNumChar = ['零','一','二','三','四','五','六','七','八','九'];
    var chnUnitSection = ['','万','亿','万亿','亿亿'];
    var chnUnitChar = ['','十','百','千'];
    var unitPos = 0;
    var strIns = '';
    var chnStr = '';
    var needZero = false;

    if (csnum === false || csnum < 0){
        return false;
    }
    if (csnum === 0){
        return chnNumChar[0];
    }

    var is10_19=(csnum>=10 && csnum<20);
    
    while (csnum > 0){
        var section = csnum % 10000;
        if (needZero){
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = sub_NumberToChinese_b_Section(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        csnum = Math.floor(csnum / 10000);
        unitPos++;
    }
    
    if (is10_19){
        //一十四 改为 十四 - 保留注释
        chnStr=chnStr.substring(1,);
    }
    return chnStr;
}

function letters52_style_list_b(){
    return [
    ['𝐴','𝐵','𝐶','𝐷','𝐸','𝐹','𝐺','𝐻','𝐼','𝐽','𝐾','𝐿','𝑀','𝑁','𝑂','𝑃','𝑄','𝑅','𝑆','𝑇','𝑈','𝑉','𝑊','𝑋','𝑌','𝑍','𝑎','𝑏','𝑐','𝑑','𝑒','𝑓','𝑔','ℎ','𝑖','𝑗','𝑘','𝑙','𝑚','𝑛','𝑜','𝑝','𝑞','𝑟','𝑠','𝑡','𝑢','𝑣','𝑤','𝑥','𝑦','𝑧',],    
    ['𝑨','𝑩','𝑪','𝑫','𝑬','𝑭','𝑮','𝑯','𝑰','𝑱','𝑲','𝑳','𝑴','𝑵','𝑶','𝑷','𝑸','𝑹','𝑺','𝑻','𝑼','𝑽','𝑾','𝑿','𝒀','𝒁','𝒂','𝒃','𝒄','𝒅','𝒆','𝒇','𝒈','𝒉','𝒊','𝒋','𝒌','𝒍','𝒎','𝒏','𝒐','𝒑','𝒒','𝒓','𝒔','𝒕','𝒖','𝒗','𝒘','𝒙','𝒚','𝒛',],    
    ['𝘈','𝘉','𝘊','𝘋','𝘌','𝘍','𝘎','𝘏','𝘐','𝘑','𝘒','𝘓','𝘔','𝘕','𝘖','𝘗','𝘘','𝘙','𝘚','𝘛','𝘜','𝘝','𝘞','𝘟','𝘠','𝘡','𝘢','𝘣','𝘤','𝘥','𝘦','𝘧','𝘨','𝘩','𝘪','𝘫','𝘬','𝘭','𝘮','𝘯','𝘰','𝘱','𝘲','𝘳','𝘴','𝘵','𝘶','𝘷','𝘸','𝘹','𝘺','𝘻',],    
    ['Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ','Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ','ａ','ｂ','ｃ','ｄ','ｅ','ｆ','ｇ','ｈ','ｉ','ｊ','ｋ','ｌ','ｍ','ｎ','ｏ','ｐ','ｑ','ｒ','ｓ','ｔ','ｕ','ｖ','ｗ','ｘ','ｙ','ｚ',],
    ['𝖠','𝖡','𝖢','𝖣','𝖤','𝖥','𝖦','𝖧','𝖨','𝖩','𝖪','𝖫','𝖬','𝖭','𝖮','𝖯','𝖰','𝖱','𝖲','𝖳','𝖴','𝖵','𝖶','𝖷','𝖸','𝖹','𝖺','𝖻','𝖼','𝖽','𝖾','𝖿','𝗀','𝗁','𝗂','𝗃','𝗄','𝗅','𝗆','𝗇','𝗈','𝗉','𝗊','𝗋','𝗌','𝗍','𝗎','𝗏','𝗐','𝗑','𝗒','𝗓','𝟢','𝟣','𝟤','𝟥','𝟦','𝟧','𝟨','𝟩','𝟪','𝟫',],
    ['𝐀','𝐁','𝐂','𝐃','𝐄','𝐅','𝐆','𝐇','𝐈','𝐉','𝐊','𝐋','𝐌','𝐍','𝐎','𝐏','𝐐','𝐑','𝐒','𝐓','𝐔','𝐕','𝐖','𝐗','𝐘','𝐙','𝐚','𝐛','𝐜','𝐝','𝐞','𝐟','𝐠','𝐡','𝐢','𝐣','𝐤','𝐥','𝐦','𝐧','𝐨','𝐩','𝐪','𝐫','𝐬','𝐭','𝐮','𝐯','𝐰','𝐱','𝐲','𝐳','𝟎','𝟏','𝟐','𝟑','𝟒','𝟓','𝟔','𝟕','𝟖','𝟗',],
    ['𝒜','ℬ','𝒞','𝒟','ℰ','ℱ','𝒢','ℋ','ℐ','𝒥','𝒦','ℒ','ℳ','𝒩','𝒪','𝒫','𝒬','ℛ','𝒮','𝒯','𝒰','𝒱','𝒲','𝒳','𝒴','𝒵','𝒶','𝒷','𝒸','𝒹','ℯ','𝒻','ℊ','𝒽','𝒾','𝒿','𝓀','𝓁','𝓂','𝓃','ℴ','𝓅','𝓆','𝓇','𝓈','𝓉','𝓊','𝓋','𝓌','𝓍','𝓎','𝓏',],
    ['𝓐','𝓑','𝓒','𝓓','𝓔','𝓕','𝓖','𝓗','𝓘','𝓙','𝓚','𝓛','𝓜','𝓝','𝓞','𝓟','𝓠','𝓡','𝓢','𝓣','𝓤','𝓥','𝓦','𝓧','𝓨','𝓩','𝓪','𝓫','𝓬','𝓭','𝓮','𝓯','𝓰','𝓱','𝓲','𝓳','𝓴','𝓵','𝓶','𝓷','𝓸','𝓹','𝓺','𝓻','𝓼','𝓽','𝓾','𝓿','𝔀','𝔁','𝔂','𝔃',],
    ['𝔄','𝔅','ℭ','𝔇','𝔈','𝔉','𝔊','ℌ','ℑ','𝔍','𝔎','𝔏','𝔐','𝔑','𝔒','𝔓','𝔔','ℜ','𝔖','𝔗','𝔘','𝔙','𝔚','𝔛','𝔜','ℨ','𝔞','𝔟','𝔠','𝔡','𝔢','𝔣','𝔤','𝔥','𝔦','𝔧','𝔨','𝔩','𝔪','𝔫','𝔬','𝔭','𝔮','𝔯','𝔰','𝔱','𝔲','𝔳','𝔴','𝔵','𝔶','𝔷',],
    ['𝔸','𝔹','ℂ','𝔻','𝔼','𝔽','𝔾','ℍ','𝕀','𝕁','𝕂','𝕃','𝕄','ℕ','𝕆','ℙ','ℚ','ℝ','𝕊','𝕋','𝕌','𝕍','𝕎','𝕏','𝕐','ℤ','𝕒','𝕓','𝕔','𝕕','𝕖','𝕗','𝕘','𝕙','𝕚','𝕛','𝕜','𝕝','𝕞','𝕟','𝕠','𝕡','𝕢','𝕣','𝕤','𝕥','𝕦','𝕧','𝕨','𝕩','𝕪','𝕫','𝟘','𝟙','𝟚','𝟛','𝟜','𝟝','𝟞','𝟟','𝟠','𝟡',],
    ['𝕬','𝕭','𝕮','𝕯','𝕰','𝕱','𝕲','𝕳','𝕴','𝕵','𝕶','𝕷','𝕸','𝕹','𝕺','𝕻','𝕼','𝕽','𝕾','𝕿','𝖀','𝖁','𝖂','𝖃','𝖄','𝖅','𝖆','𝖇','𝖈','𝖉','𝖊','𝖋','𝖌','𝖍','𝖎','𝖏','𝖐','𝖑','𝖒','𝖓','𝖔','𝖕','𝖖','𝖗','𝖘','𝖙','𝖚','𝖛','𝖜','𝖝','𝖞','𝖟',],
    ['𝗔','𝗕','𝗖','𝗗','𝗘','𝗙','𝗚','𝗛','𝗜','𝗝','𝗞','𝗟','𝗠','𝗡','𝗢','𝗣','𝗤','𝗥','𝗦','𝗧','𝗨','𝗩','𝗪','𝗫','𝗬','𝗭','𝗮','𝗯','𝗰','𝗱','𝗲','𝗳','𝗴','𝗵','𝗶','𝗷','𝗸','𝗹','𝗺','𝗻','𝗼','𝗽','𝗾','𝗿','𝘀','𝘁','𝘂','𝘃','𝘄','𝘅','𝘆','𝘇','𝟬','𝟭','𝟮','𝟯','𝟰','𝟱','𝟲','𝟳','𝟴','𝟵',],    
    ['𝘼','𝘽','𝘾','𝘿','𝙀','𝙁','𝙂','𝙃','𝙄','𝙅','𝙆','𝙇','𝙈','𝙉','𝙊','𝙋','𝙌','𝙍','𝙎','𝙏','𝙐','𝙑','𝙒','𝙓','𝙔','𝙕','𝙖','𝙗','𝙘','𝙙','𝙚','𝙛','𝙜','𝙝','𝙞','𝙟','𝙠','𝙡','𝙢','𝙣','𝙤','𝙥','𝙦','𝙧','𝙨','𝙩','𝙪','𝙫','𝙬','𝙭','𝙮','𝙯',],
    ['𝙰','𝙱','𝙲','𝙳','𝙴','𝙵','𝙶','𝙷','𝙸','𝙹','𝙺','𝙻','𝙼','𝙽','𝙾','𝙿','𝚀','𝚁','𝚂','𝚃','𝚄','𝚅','𝚆','𝚇','𝚈','𝚉','𝚊','𝚋','𝚌','𝚍','𝚎','𝚏','𝚐','𝚑','𝚒','𝚓','𝚔','𝚕','𝚖','𝚗','𝚘','𝚙','𝚚','𝚛','𝚜','𝚝','𝚞','𝚟','𝚠','𝚡','𝚢','𝚣','𝟶','𝟷','𝟸','𝟹','𝟺','𝟻','𝟼','𝟽','𝟾','𝟿',],   
    ['Ⓐ','Ⓑ','Ⓒ','Ⓓ','Ⓔ','Ⓕ','Ⓖ','Ⓗ','Ⓘ','Ⓙ','Ⓚ','Ⓛ','Ⓜ','Ⓝ','Ⓞ','Ⓟ','Ⓠ','Ⓡ','Ⓢ','Ⓣ','Ⓤ','Ⓥ','Ⓦ','Ⓧ','Ⓨ','Ⓩ','ⓐ','ⓑ','ⓒ','ⓓ','ⓔ','ⓕ','ⓖ','ⓗ','ⓘ','ⓙ','ⓚ','ⓛ','ⓜ','ⓝ','ⓞ','ⓟ','ⓠ','ⓡ','ⓢ','ⓣ','ⓤ','ⓥ','ⓦ','ⓧ','ⓨ','ⓩ','⓪','🄋','➀','➁','➂','➃','➄','➅','➆','➇','➈',],   
    ['🄐','🄑','🄒','🄓','🄔','🄕','🄖','🄗','🄘','🄙','🄚','🄛','🄜','🄝','🄞','🄟','🄠','🄡','🄢','🄣','🄤','🄥','🄦','🄧','🄨','🄩','⒜','⒝','⒞','⒟','⒠','⒡','⒢','⒣','⒤','⒥','⒦','⒧','⒨','⒩','⒪','⒫','⒬','⒭','⒮','⒯','⒰','⒱','⒲','⒳','⒴','⒵','⑴','⑵','⑶','⑷','⑸','⑹','⑺','⑻','⑼',],
    ];
}

function letters52_style_transform_b(csstr,csno=0,csarray=[]){
    csno=Math.floor(csno);
    if (csno>=0){
        if (csarray.length>0){
            list_t=csarray;
        } else {
            var list_t=letters52_style_list_b();    
            if (csno<list_t.length){
                list_t=list_t[csno];
            } else {
                return csstr;
            }
        }
        
        for (let blxl=65;blxl<91;blxl++){
            var blchar=String.fromCharCode(blxl);
            csstr=csstr.replace(new RegExp(blchar,'g'),list_t[blxl-65]);
        }
        for (let blxl=97;blxl<123;blxl++){
            var blchar=String.fromCharCode(blxl);
            csstr=csstr.replace(new RegExp(blchar,'g'),list_t[blxl-97+26]);
        }
        if (list_t.length==62){
            for (let blxl=0;blxl<=9;blxl++){
                var blchar=blxl.toString();
                csstr=csstr.replace(new RegExp(blchar,'g'),list_t[blxl+52]);            
            }        
        }
    } else if (csno==-1){    //decode - 保留注释
        var list_t=letters52_style_list_b();    
        for (let arow of list_t){
            for (let blxl=0;blxl<26;blxl++){
                var blchar=String.fromCharCode(65+blxl);
                csstr=csstr.replace(new RegExp(arow[blxl],'g'),blchar);            

                var blchar=String.fromCharCode(97+blxl);
                csstr=csstr.replace(new RegExp(arow[blxl+26],'g'),blchar);      
            }
            if (arow.length==62){
                for (let blxl=0;blxl<=9;blxl++){
                    var blchar=blxl.toString();
                    csstr=csstr.replace(new RegExp(arow[blxl+52],'g'),blchar);                      
                }
            }
        }
    }
    return csstr;
}

function letters52_style_test_b(){
    var blstr=characters_b('aA');
    var result_t=new Set();
    var letters=letters52_style_list_b();
    for (let arow of letters){
        for (let aletter of arow){
            if (blstr.includes(aletter)){
                console.log('normal:',aletter);
            }
            if (result_t.has(aletter)){
                console.log('duplicate:',aletter);
            }
            result_t.add(aletter);
        }
    }
    console.log(result_t.size/letters.length);
    console.log('done');
}

function braille_list_b(){
    return {'0':'⠼⠚', '1':'⠼⠁', '2':'⠼⠃', '3':'⠼⠉', '4':'⠼⠙', '5':'⠼⠑', '6':'⠼⠋', '7':'⠼⠛', '8':'⠼⠓', '9':'⠼⠊', 'a':'⠁', 'b':'⠃', 'c':'⠉', 'd':'⠙', 'e':'⠑', 'f':'⠋', 'g':'⠛', 'h':'⠓', 'i':'⠊', 'j':'⠚', 'k':'⠅', 'l':'⠇', 'm':'⠍', 'n':'⠝', 'o':'⠕', 'p':'⠏', 'q':'⠟', 'r':'⠗', 's':'⠎', 't':'⠞', 'u':'⠥', 'v':'⠧', 'w':'⠺', 'x':'⠭', 'y':'⠽', 'z':'⠵'}
}

function braille_transform_b(csstr,csencode=true){
    var list_t=braille_list_b();
    if (csencode){
        for (let key in list_t){
            var blvalue=list_t[key];
            csstr=csstr.replace(new RegExp(key,'g'),blvalue);
            csstr=csstr.replace(new RegExp(key.toUpperCase(),'g'),blvalue);
        }
    } else {
        for (let key in list_t){
            var blvalue=list_t[key];
            csstr=csstr.replace(new RegExp(blvalue,'g'),key);
        }    
    }
    return csstr;
}

function morse_list_b(){
    return {"a":".-", "b":"-...", "c":"-.-.", "d":"-..", "e":".", "f":"..-.", "g":"--.", "h":"....", "i":"..",
    "j":".---", "k":"-.-", "l":".-..", "m":"--", "n":"-.", "o":"---", "p":".--.", "q":"--.-", "r":".-.",
    "s":"...", "t":"-", "u":"..-", "v":"...-", "w":".--", "x":"-..-", "y":"-.--", "z":"--..",
    //Numbers
    "0":"-----", "1":".----", "2":"..---", "3":"...--", "4":"....-",
    "5":".....", "6":"-....", "7":"--...", "8":"---..", "9":"----.",
    //Punctuation
    "&":".-...", "'":".----.", "@":".--.-.", ")":"-.--.-", "(":"-.--.", ":":"---...", ",":"--..--",
    "=":"-...-", "!":"-.-.--", ".":".-.-.-", "-":"-....-", "+":".-.-.",'"':".-..-.", "?":"..--..", "/":"-..-.",
    };
}

function morse_transform_b(csstr,csencode=true){
    function sub_morse_transform_b_a_row(arow,morse_dict,csencode){
        if (csencode){
            var translation = [];
            var words_list = arow.split(' ');
            for (let aword of words_list){
                var list_t = [];
                //aword=aword.split(''); //此行可忽略 - 保留注释
                for (let char of aword){
                    if (char.toLowerCase() in morse_dict){
                        list_t.push(morse_dict[char.toLowerCase()]);
                    }
                }
                translation.push(list_t.join(' '));
            }
            return translation.join(' / ');
        } else {
            var morse_dict=morse_list_b();
            var translation = [];
            var words = arow.split(' / ');

            for (let morse_word of words){
                var chars = morse_word.split(' ');
                var blstr='';
                for (let achar of chars){
                    for (let key in morse_dict){
                        if (achar == morse_dict[key]){
                            blstr = blstr + key;
                        }
                    }
                }
                translation.push(blstr);
            }
            return translation.join(' ');
        }
        return arow;    
    }
    //-----------------------
    if (csstr==''){return ''};
    var morse_dict=morse_list_b();
    var row_list=csstr.split('\n');
    var result_t=[];
    for (let arow of row_list){
        result_t.push(sub_morse_transform_b_a_row(arow,morse_dict,csencode));
    }
    return result_t.join('\n');
}

function invisible_character_list_b(cstype='',restrict=false){
    if (restrict){
        var list_t=['034F','180E','200B','200D'];
    } else {
        var list_t=['00AD','034F','17B4','17B5','180E','200B','200C','200D','200E','2060','2061','2062','2063','2064','206A','206B','206C','206D','206E','206F','FEFF','1D173','1D174','1D175','1D176','1D177','1D178','1D179','1D17A'];    //需要测试PC/Mobile 浏览器、微信群、朋友圈、微博效果 - 保留注释
    }
    switch (cstype){
        case '':
        case 'html':
            for (let blxl=0;blxl<list_t.length;blxl++){
                list_t[blxl]='&#x'+list_t[blxl];
            }
            break;
        case 'js':
            for (let blxl=0;blxl<list_t.length;blxl++){
                list_t[blxl]=String.fromCodePoint('0x'+list_t[blxl]);
                //eval('"\\u{'+list_t[blxl]+'}"'); 此行保留 - 保留注释
            }        
            break;
    }
    return list_t;
}

function invisible_character_add_or_remove_b(csstr,cstype='',restrict=false){
    var list_t=invisible_character_list_b('js',restrict);
    
    switch (cstype){
        case '':
        case 'add':
        case 'all':
            var strings=csstr.match(/[^\x00-\xff]|[a-zA-Z0-9]/mg) || [];      
            for (let item of strings){
                list_t.sort(randomsort_b);
                csstr=csstr.replace(new RegExp(item,'mg'),item+list_t[0]);
            }
            break;
        case 'cn':
            var strings=csstr.match(/[^\x00-\xff]/mg) || [];      
            for (let item of strings){
                list_t.sort(randomsort_b);
                csstr=csstr.replace(new RegExp(item,'mg'),item+list_t[0]);
            }
            break;    
        case 'cn_phrase':
            var included_strings=split_words_b(csstr,false)[1];
            for (let item of included_strings){
                list_t.sort(randomsort_b);
                var cn_list=item.split('');
                csstr=csstr.replace(new RegExp(item,'mg'),cn_list.join(list_t[0]));
            }
            break;
        case 'remove':
            for (let item of list_t){
                csstr=csstr.replace(new RegExp(item,'g'),'');
            }
            break;        
        case 'test':
            csstr=invisible_character_test_b().join('\n');
    }
    return csstr;
}

function invisible_character_test_b(){
    var list_t=invisible_character_list_b('js');
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=(blxl+'.['+list_t[blxl]+']:'+list_t[blxl].charCodeAt().toString(16));
    } 
    return list_t;
}

function random_false_list_b(cskey=0){
    if (cskey===0){
        cskey=new Date().getFullYear();
    }
    cskey=Math.min(10000,Math.max(10,cskey));
    var result_t=[];
    for (let blxl=0;blxl<=cskey;blxl++){
        var laststr='0.'+(blxl/cskey).toString().slice(-1);
        result_t.push(parseFloat(laststr));
    }
    return result_t;
}

function emoji_2_num_b(csstr){
    var emoji_list=emoji_find_b(csstr);
    for (let item of emoji_list){
        var blnum=item.codePointAt();
        csstr=csstr.replace(new RegExp(item,'g'),'&#'+blnum+';');
    }
    return csstr;
}

function emoji_find_b(csstr){
    var list_t=new Set(Array.from(csstr));   //不支持重叠的emoji，需要改进 - 保留注释
    var result_t=[];
    for (let item of list_t){
        if (item.charCodeAt()==item.codePointAt()){continue;}
        result_t.push(item);
    }
    return result_t;
}

function s2t_t2s_pair_b(){
    //依赖：'words/cn_s2t_data.js','words/cn_t2s_data.js' - 保留注释
    var result_s2t={};
    var result_t2s={};

    for (let key in cn_s2t_global){
        var blvalue=cn_s2t_global[key];
        if (blvalue.length!==1){continue;}
        if (cn_t2s_global[blvalue]==undefined){continue;}
        if (cn_t2s_global[blvalue].length!==1){continue;}
        if (key==blvalue){continue;}
        result_s2t[key]=blvalue;
        result_t2s[blvalue]=key;
    }
    return [result_s2t,result_t2s];
}

function s2t_t2s_search_b(csstr){
    var result_t=[];
    
    if (Array.isArray(csstr)){
        var list_t=csstr;
    } else {
        var list_t=new Set(csstr.match(/[^\x00-\xff]/g) || []);
    }
    
    for (let item of list_t){
        if (item in cn_t2s_global){
            result_t.push([item,cn_t2s_global[item]]);
        }
        if (item in cn_s2t_global){
            result_t.push([item,cn_s2t_global[item]]);
        }        
    }
    return result_t;
}

function decode_quoted_printable_b(data){
    //from: https://codereview.stackexchange.com/questions/181017/decoder-for-content-transfer-encoding-and-quoted-printable
    var replacer = function (match, p1){
        // handle escape sequence
        if (p1.trim().length === 2){
            // decode byte (for example: "=20" ends up as " ")
            var code = parseInt(p1.trim(), 16);
            return String.fromCharCode(code);
        }
        // handle soft line breaks
        return '';
    };
    // remove soft line breaks and convert escape sequences
    data = data.replace(/=([0-9A-F]{2}|\r\n|\n)/gi, replacer);
    // decode escape sequences
    try {
        return decodeURIComponent(escape(data));
    } catch (dummy){
        return null;
    }
};
