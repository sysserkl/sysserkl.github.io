//csver: 0.0.1-20180908
function random_chs_b(cslength){
	var csnum=arguments.length;
	if (csnum==0){var cslength= 1;}
    var bljg='';
    for (let blxl=0;blxl<cslength;blxl++){
        bljg=bljg+String.fromCodePoint(Math.round(Math.random()*20901+19968));
    }
    return bljg;
}

function characters_b(cstype){
    var str = '';
    if (cstype.indexOf('A')>=0){
        for(let blxl=65;blxl<91;blxl++){
            str=str+String.fromCharCode(blxl);
        }
    }
    if (cstype.indexOf('a')>=0){
        for(let blxl=97;blxl<123;blxl++){
            str=str+String.fromCharCode(blxl);
        }
     }
    if (cstype.indexOf('0')>=0 || cstype.indexOf('1')>=0){
        str=str+'0123456789';
    }
    return str;    
}

function number_tw_b(csnumber){
    //csnumber 0-9
    csnumber=Math.max(0,Math.min(9,parseInt(csnumber)));
    return ["零","壹","贰","叁","肆","伍","陆","柒","捌","玖","拾"][csnumber];
}

function randint_b(m,n){
    return Math.floor(Math.random()*(m - (n+1)) + n+1);
}

function randwrongstr_b(cslen){
    var list_t=['`', '_', '^', '÷', '×', '≠', '≤', '≥', '_', '_', '_', '-', '_', '-', '¡', '¿', '‘', '⁻', '⁺', '§', '¶', '©', '®', '™', '@', '¤', '£', '¥', '₠', '₡', '₢', '₣', '₤', '₥', '₦', '₧', '₨', '₩', '₪', '₫', '€', '₭', '₮', '₯', '±', '←', '←', '_', '←', '→', '→', '_', '→', '↑', '↓', '♪', '◢', '◣', '؟', 'ɐ', '￥', '╰', '_', '╯', '╯', '#', '-', '_', '-', '╯', '╧', '═', '╧', '—', '—', '▔', '＾', '▔', '╮', '╯', '▽', '╰', '╭', '৳', '⁰', '⅛', '¼', '⅜', '½', '⅝', '⅞', '¹', '¹', '⁰', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', 'á', 'à', 'ă', 'ắ', 'ằ', 'ẵ', 'ẳ', 'ặ', 'â', 'ấ', 'ầ', 'ẫ', 'ẩ', 'ậ', 'ǎ', 'å', 'ǻ', 'Å', 'ä', 'ǟ', 'ã', 'ȧ', 'ǡ', 'ą', 'ā', 'ả', 'ȁ', 'ȃ', 'ạ', 'ḁ', 'ẚ', 'ª', 'ḃ', 'ḅ', 'ḇ', 'ɓ', 'ć', 'ĉ', 'č', 'ċ', 'ç', 'ḉ', 'ƈ', 'ď', 'ḋ', 'đ', 'ḑ', 'ḍ', 'ḓ', 'ḏ', 'ɗ', 'ð', 'ǳ', 'ǆ', 'é', 'è', 'ĕ', 'ê', 'ế', 'ề', 'ễ', 'ể', 'ệ', 'ě', 'ë', 'ẽ', 'ė', 'ȩ', 'ḝ', 'ę', 'ē', 'ḗ', 'ḕ', 'ẻ', 'ȅ', 'ȇ', 'ẹ', 'ḙ', 'ḛ', 'ɛ', 'ḟ', 'ǵ', 'ğ', 'ĝ', 'ǧ', 'ġ', 'ǥ', 'ģ', 'ḡ', 'ɠ', 'ĥ', 'ȟ', 'ḧ', 'ḣ', 'ħ', 'ḩ', 'ḥ', 'ḫ', 'ẖ', 'ƕ', 'í', 'ì', 'ĭ', 'î', 'ǐ', 'ï', 'ḯ', 'ĩ', 'į', 'ī', 'ỉ', 'ȉ', 'ȋ', 'ị', 'ḭ', 'ı', 'ĳ', 'ĵ', 'ǰ', 'ḱ', 'ǩ', 'ķ', 'ḳ', 'ḵ', 'ƙ', 'ĺ', 'ľ', 'ŀ', 'ł', 'ļ', 'ḷ', 'ḹ', 'ḽ', 'ḻ', 'ǉ', 'ḿ', 'ṁ', 'ṃ', 'ń', 'ǹ', 'ň', 'ñ', 'ṅ', 'ņ', 'ṇ', 'ṋ', 'ṉ', 'ŉ', 'ó', 'ò', 'ŏ', 'ô', 'ố', 'ồ', 'ổ', 'ộ', 'ǒ', 'ö', 'ȫ', 'ő', 'õ', 'ṍ', 'ȯ', 'ȱ', 'ø', 'ǫ', 'ō', 'ṓ', 'ṑ', 'ọ', 'ớ', 'ờ', 'ỡ', 'ở', 'ợ', 'ɔ', 'º', 'œ', 'ṕ', 'ṗ', 'ŕ', 'ř', 'ṙ', 'ŗ', 'ȑ', 'ȓ', 'ṛ', 'ṝ', 'ṟ', 'ś', 'ṥ', 'ŝ', 'š', 'ṧ', 'ṡ', 'ş', 'ṣ', 'ṩ', 'ẛ', 'ß', 'ť', 'ṫ', 'ŧ', 'ţ', 'ṭ', 'ṱ', 'ṯ', 'ú', 'ù', 'ŭ', 'û', 'ǔ', 'ů', 'ü', 'ǘ', 'ǜ', 'ǚ', 'ǖ', 'ű', 'ũ', 'ṹ', 'ų', 'ū', 'ṻ', 'ủ', 'ȕ', 'ȗ', 'ụ', 'ṳ', 'ṷ', 'ṵ', 'ư', 'ứ', 'ừ', 'ữ', 'ử', 'ự', 'ṽ', 'ṿ', 'ẃ', 'ẁ', 'ŵ', 'ẘ', 'ẅ', 'ẇ', 'ẉ', 'ƿ', 'ý', 'ỳ', 'ŷ', 'ẙ', 'ÿ', 'ỹ', 'ẏ', 'ȳ', 'ỷ', 'ỵ', 'ƴ', 'ȝ', 'ź', 'ẑ', 'ž', 'ż', 'ƶ', 'ẓ', 'ẕ', 'ȥ', 'ʒ', 'Α', 'α', 'Β', 'β', 'Γ', 'γ', 'Δ', 'δ', 'Ε', 'ε', '￣', 'ε', '￣', 'Ζ', 'ζ', 'Η', 'η', 'Θ', 'θ', 'Ι', 'ι', 'Κ', 'κ', 'Λ', 'λ', 'Μ', 'μ', 'Ν', 'ν', 'Ξ', 'ξ', 'Ο', 'ο', 'Π', 'π', 'ρ', 'Σ', 'σ', 'ς', 'Τ', 'τ', 'Υ', 'υ', 'Φ', 'φ', 'Χ', 'χ', 'Ψ', 'ψ', 'ψ', '￣', '︶', '￣', 'ψ', 'Ω', 'ω', 'а', 'А', 'б', 'Б', 'в', 'В', 'г', 'Г', 'д', 'Д', 'е', 'Е', 'ё', 'Ё', 'ж', 'Ж', 'з', 'З', 'и', 'И', 'й', 'Й', 'к', 'К', 'л', 'Л', 'м', 'М', 'н', 'Н', 'о', 'О', 'п', 'П', 'р', 'Р', 'с', 'С', 'т', 'Т', 'у', 'У', 'ф', 'Ф', 'х', 'Х', 'ц', 'Ц', 'ч', 'Ч', 'ш', 'Ш', 'щ', 'Щ', 'ъ', 'Ъ', 'ы', 'Ы', 'ь', 'Ь', 'э', 'Э', 'ю', 'Ю', 'я', 'Я', '☬', '勹', '賁', '灬', '髟', '冫', '癶', '卜', '歺', '艸', '艹', '镸', '鬯', '屮', '牜', '彳', '巛', '疒', '辵', '辶', '隹', '刂', '弍', '弐', '貮', '匚', '阝', '罓', '鬲', '廾', '夬', '龜', '巜', '丨', '虍', '㗊', '亼', '己', '彐', '彑', '旡', '卩', '钅', '井', '冂', '臼', '㠪', '亅', '凵', '卝', '爫', '耒', '離', '㸚', '叕', '㒳', '臨', '〇', '冃', '芈', '冖', '糸', '纟', '宀', '丬', '爿', '疋', '丿', '攴', '攵', '菐', '靑', '犭', '冄', '亻', '禸', '彡', '飠', '饣', '矢', '豕', '丗', '士', '礻', '扌', '殳', '氵', '氺', '厶', '糹', '亖', '巳', '夊', '亠', '尢', '尣', '㓁', '罒', '囗', '㐅', '夕', '覀', '匸', '心', '忄', '吅', '穴', '襾', '訁', '讠', '幺', '爻', '弌', '衤', '廴', '酉', '兂', '㠭', '夂', '黹', '豸', '丶', '丵',];
    
    var bljg='';
    for (var blxl=1;blxl<=cslen;blxl++){
        list_t.sort(function (a,b){return Math.random()>.5 ? -1 : 1;});
        bljg=bljg+list_t[0];
    }
    return bljg;
}

function randstr_b(cslen=8,csnumber=true,csletter=true) {
    var bljg='';
    if (csnumber==true && csletter==true){
        var list_t=characters_b('aA1').split('');
        for (var blxl=1;blxl<=cslen;blxl++){
            bljg=bljg+list_t[randint_b(0,61)];
        }
    }
    else if (csletter==true){
        var list_t=characters_b('aA').split('');
        for (var blxl=1;blxl<=cslen;blxl++){
            bljg=bljg+list_t[randint_b(0,51)];
        }
    }
    else {
        for (var blxl=1;blxl<=cslen;blxl++){
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

function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function confuse_str_b(csstr,cssegments){
    if (csstr.length==0){
        return csstr;
    }
    csstr=reverse_str_b(csstr); //依赖 klbase.js
    var len_t=csstr.length;

	var csnum=arguments.length;
	if (csnum<=1){
        var cssegments= Math.max(8,Math.round(len_t/4));
    }

    var lenlist=[];
    
    cssegments=Math.min(cssegments,len_t);
    
    for (var blxl=0;blxl<len_t;blxl++){
        lenlist[blxl]=blxl;
    }
    lenlist=getRandomSubarray(lenlist,cssegments).sort(function(a,b){return a-b;});

    var bljg=csstr.substring(0,lenlist[0]);
    
    for (var blxl=0;blxl<lenlist.length;blxl++) {
        if (blxl<lenlist.length-1){
            bljg=bljg+random_strs_b()+csstr.substring(lenlist[blxl],lenlist[blxl+1]);
        }
        else {
            bljg=bljg+random_strs_b()+csstr.substring(lenlist[blxl]);
        }
    }

    return bljg;
}

function de_confuse_str_b(csstr){
    if (csstr==''){return '';}
    return (csstr.replace(new RegExp(/~[^\x00-\xff]{3,5}[}\)\]]{2}([a-zA-Z0-9]){3,5}~~[^\x00-\xff]{3,5}[{\(\[]{2}~/,"g"),"")).split("").reverse().join(""); 
}

function odd_str_b(csstr){
    if (csstr.length<=1){return csstr;}
    var list_t=csstr.split('');
    if (list_t.length % 2 == 1){
        list_t.push("");
    }
    var bljg='';
    for (var blxl=1;blxl<list_t.length;blxl=blxl+2){
        bljg=bljg+list_t[blxl]+list_t[blxl-1];
    }
    return bljg;
}

function en_interval_str_b(csstr){
    if (csstr.length<2){return csstr;}
    var list_t=csstr.match(/(.|\n)(.|\n)?/mg);
    if (list_t==null){return csstr;}
    var bljg='';
    for (var item of list_t){
        if (item.length==2){
            if (Math.random()>0.667){
                bljg=bljg+item+randwrongstr_b(1);
            }
            else if (Math.random()>0.5){
                bljg=bljg+item+randstr_b(1);
            }
            else {
                bljg=bljg+item+random_chs_b(1);
            }
        }
        else {
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
        }
        else {
            bljg=bljg+item;
        }
    }
    return bljg;
}

function en_double_str_b(csstr){
    return en_interval_str_b(odd_str_b(en_interval_str_b(csstr)));
}

function de_double_str_b(csstr){
    return de_interval_str_b(odd_str_b(de_interval_str_b(csstr)));
}

function split_words_b(csstr,cscombine=false){
    //依赖 jieba_kl_dict_data.js - 保留注释
    try{
        var bllen=jieba_dict_global.length;
    }
    catch (error){
        console.log('未载入：data/jieba_kl_dict_data.js');
        if (cscombine){
            return [];
        }
        else {
            return [[],[]];
        }
    }    
    //------------------
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
            return [list_cn.join(' '),array_unique_b(list_t)];
        }
        return [csstr,[]];
    }
    
    //------------------
    var t0 = performance.now();
    var list_t=[];
    var list_t2=[];
    csstr=csstr.replace(new RegExp("[—、；：。，？！【】（）《》“”‘’…ɑəŋɔʒθ]",'g'),' ');
    if (list_cn!==null){
        [csstr,list_t2]=sub_split_words_b_two(csstr); 
        list_t=list_t.concat(list_t2);
        
        for (let blxl=8;blxl>=5;blxl--){
            for (let item of jieba_dict_global['l'+blxl]){
                if (csstr.includes(item)){
                    csstr=csstr.replace(new RegExp(item,'g'),' ').trim();
                    list_t.push(item);
                }
            }
            if (csstr.match(/[^\x00-\xff]{3,}/g)==null){
                break;
            }
            [csstr,list_t2]=sub_split_words_b_two(csstr); 
            list_t=list_t.concat(list_t2);
            console.log('split_words_b() ',blxl,'费时：'+(performance.now() - t0) + " milliseconds");
        }
        
        for (let blxl=4;blxl>=2;blxl--){
            for (let key in jieba_dict_global['l'+blxl]){
                if (!csstr.includes(key)){
                    continue;
                }
                for (let item of jieba_dict_global['l'+blxl][key]){
                    if (csstr.includes(item)){
                        csstr=csstr.replace(new RegExp(item,'g'),' ').trim();
                        list_t.push(item);
                    }
                }
            }
            [csstr,list_t2]=sub_split_words_b_two(csstr); 
            list_t=list_t.concat(list_t2);
            console.log('split_words_b() ',blxl,'费时：'+(performance.now() - t0) + " milliseconds");
        }

    }
    if (list_t.length>0){
        for (let item of list_t){
            csstr=csstr.replace(new RegExp(item,'g'),' ');
        }
        var list_cn=csstr.match(/[^\x00-\xff]{2,}/g);
        list_t=array_union_b(list_t,list_cn);
    }
    list_t=array_unique_b(list_t);
    var list_en=csstr.match(/[a-zA-Z'\-_]{2,}/g);
    if (list_en==null){
        list_en=[];
    }
    if (cscombine){
        return array_union_b(list_en,list_t);
    }
    else {
        return [list_en,list_t];
    }
}

function count_words_b(csstr,words_list,csmin=1){
    var list_t=[];
    for (var item of words_list){
        if (item==''){continue;}
        var blcount=csstr.split(item).length-1;
        if (blcount>=csmin){
            list_t.push([item,blcount]);
        }
    }
    list_t.sort(function (a,b){return b[1]-a[1];});
    return list_t;
}


function ChineseToNumber_b(chnStr){
    //JavaScript实现阿拉伯数字和中文数字互相转换 https://www.jb51.net/article/86391.htm - 保留注释
    var chnNumChar = { '〇':0, '○':0, '零':0, '一':1, '二':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9 };
    var chnNameValue = { '十': {'value':10, 'secUnit':false}, '百': {'value':100, 'secUnit':false}, '千': {'value':1000, 'secUnit':false}, '万': {'value':10000, 'secUnit':true}, '亿': {'value':100000000, 'secUnit':true} };
    var rtn = 0;
    var section = 0;
    var number = 0;
    var secUnit = false;
    var str = chnStr.split('');

    try{
        for (let blxl = 0; blxl < str.length; blxl++){
            var num = chnNumChar[str[blxl]];
                if (typeof num !== 'undefined'){
                    number = num;
                    if (blxl === str.length - 1){
                        section += number;
                    }
            }
            else {
                var unit = chnNameValue[str[blxl]].value;
                secUnit = chnNameValue[str[blxl]].secUnit;
                if (secUnit){
                    section = (section + number) * unit;
                    rtn += section;
                    section = 0;
                }
                else {
                    section += (number * unit);
                }
                number = 0;
            }
        }
        return rtn + section;
    }
    catch (error){
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
            }
            else {
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
    //-------------------
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

    return chnStr;
}
