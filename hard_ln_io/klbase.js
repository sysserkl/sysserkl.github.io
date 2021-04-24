function ismobile_b(getstr=false){
    var usera=navigator.userAgent.toLowerCase();
    if (usera.includes('android') || usera.includes('mobile')){
        if (getstr){
            return 'mobile';
        }
        else {return true;}
    }
    if (getstr){return 'pc';}
    else {return false;}
}

function is_local_b(){
    var blhost=location.host; 
    if (blhost.substring(0,4)=='192.' || blhost.substring(0,3)=='10.' || blhost.substring(0,9)=='127.0.0.1'){
        return true;
    }
    var blhref=location.href;
    if (blhref.substring(0,5)=='file:'){
        return true;
    }
    return false;
}

function is_firefox_b(check_isenabled=false){
    if (check_isenabled){
        if (local_storage_get_b('enable_klapps')!=='1'){
            var reactive_date=local_storage_get_b('reactive_klapps_date');
            var theday=new Date();
            var day_str=theday.getFullYear()+'-'+('0'+(theday.getMonth()+1)).slice(-2)+'-'+('0'+theday.getDate()).slice(-2);        
            if (reactive_date!=='' && day_str<=reactive_date){
                return false;
            }
        }
    }
    var blstr=navigator.userAgent.toLowerCase();
    if (blstr.includes('firefox')){
        return true;
    }
    return false;
}

function blank_page_b(redirect=true){
    if (redirect){
        location.href='about:blank';
        return;
    }
    document.querySelector('body').innerHTML='<span style="font-size:50rem;">👽👽</span>';
    document.title='🎎🎁🏆🤖 👾';
}

function client_b(){
    var blclient=navigator.userAgent.toLowerCase();
    var bljg='';
    var list_t=[
    ['chrome','chromium','firefox','safari'],
    ['ubuntu','android','linux','win','bsd','unix']
    ];
    for (let one_row of list_t){
        for (let one_column of one_row){
            if (blclient.includes(one_column)){
                bljg=bljg+one_column.substring(0,2);
                break;
            }
        }
    }
    if (bljg==''){
        bljg='other';
    }
    return bljg;
}

function remote_access_page_b(){
    if (is_local_b()){return;}
    document.querySelector('body').innerHTML='';
}

function klwebphp_path_b(subdir_or_file=''){
    var klbase_path=location.href;
    if (klbase_path.includes('/klwebphp/')){
        return klbase_path.split('/klwebphp/')[0]+'/klwebphp/'+subdir_or_file;
    }
    else if (klbase_path.includes('/klwebphp_backup/')){
        return klbase_path.split('/klwebphp_backup/')[0]+'/klwebphp_backup/'+subdir_or_file;
    }
    else if (local_storage_get_b('use_klwebphp_path').trim()=='1' && (klbase_path+'/_').match(/:\d+\//)!==null){
        return '/'+subdir_or_file;
    }
    else if (klbase_path.includes('/wp_remote/')){
        return '../'+subdir_or_file;
    }    
    else {
        return false;
    }
}

function base_path_set_b(cstype){
    localStorage.setItem('use_klwebphp_path',(cstype=='k'?'1':'0'));
}

function klbase_sele_path_b(){
    var blhref=location.href.trim();
    if (blhref.includes('/index.htm')){
        if (blhref.slice(-7,-1)=='?path='){
            base_path_set_b(blhref.slice(-1));
        }
    }
    
    var klbase_path=klwebphp_path_b();
    var sele_path='';
    
    if (klbase_path===false){
        sele_path=location.href.split('//')[0]+'//'+location.host;
        klbase_path=sele_path+'/hard_ln_io/';
    }
    else {
        sele_path=klbase_path+'PythonTools/data/selenium_news';
    }

    return [klbase_path,sele_path]; //sele_path 末尾无/ - 保留注释
}

function klbase_addons_import_js_b(klbase_list=[],module_list=[],jsdata_list=[]){
    var klbase_path='';
    var sele_path='';
    [klbase_path,sele_path]=klbase_sele_path_b();
    var module_path=sele_path+'/module/';
    var jsdata_path=sele_path+'/jsdata/';        
    
    var result_t=[];
    for (let item of klbase_list){
        var defer_str='';
        if (item.slice(-6,)==',defer'){
            item=item.slice(0,-6);
            defer_str=' defer';
        }
        result_t.push(['js',klbase_path+'klbase_'+item+'.js',defer_str]);
        //document.write('\n<script language="javascript" type="text/javascript" src="'+klbase_path+'klbase_'+item+'.js"'+defer_str+'></script>\n');
    }
    for (let item of module_list){
        var defer_str='';
        if (item.slice(-6,)==',defer'){
            item=item.slice(0,-6);
            defer_str=' defer';
        }    
        if (item.slice(-3,)=='.js'){
            result_t.push(['js',module_path+item,defer_str]);
        }
        else if (item.slice(-4,)=='.css'){
            result_t.push(['css',module_path+item,'']);
        }        
    }
    for (let item of jsdata_list){
        var defer_str='';
        if (item.slice(-6,)==',defer'){
            item=item.slice(0,-6);
            defer_str=' defer';
        }    
        if (item.slice(-3,)=='.js'){
            result_t.push(['js',jsdata_path+item,defer_str]);
        }    
    }
    
    var links_t=[];
    for (let item of result_t){//不能sort - 保留注释
        if (item[0]=='js'){
            document.write('\n<script language="javascript" type="text/javascript" src="'+item[1]+'"'+item[2]+'></script>\n');
        }
        else if (item[0]=='css'){
            document.write('<link href="'+item[1]+'" type="text/css" rel="stylesheet">\n');
        }
        links_t.push(item[1]);
    }
    console.log(links_t.join('\n')); //此行保留 - 保留注释
}

function object2array_b(cs_object_array){
	var list_t=[];
	for (let key in cs_object_array){
        if (Array.isArray(cs_object_array[key])){
		    list_t.push([].concat(cs_object_array[key])); //如果是数组直接添加会建立关联，所以需要concat - 保留注释
        }
        else {
            list_t.push(cs_object_array[key]);
        }
	}
    return list_t;
}

function create_element_b(cstype,csidname,csstyle,o_div,csafter=true){
    if (csidname!==''){
        var o_new = document.getElementById(csidname);
        if (!o_new){
            var o_new = document.createElement(cstype);
            o_new.setAttribute("id", csidname);
            o_new.style.cssText=csstyle;
            if (csafter){
                o_div.parentNode.insertBefore(o_new, o_div.nextSibling);
            }
            else {
                o_div.parentNode.insertBefore(o_new, o_div);
            }
            return o_new;
        }
    }
    else {
        var o_new = document.createElement(cstype);
        o_new.style.cssText=csstyle;
        if (csafter){
            o_div.parentNode.insertBefore(o_new, o_div.nextSibling);
        }
        else {
            o_div.parentNode.insertBefore(o_new, o_div);
        }
        return o_new;
    }
    return false;
}

function str_reg_search_b(csinput,cskeys,csreg){
    //csinput 和 cskeys 可以是字符串，也可以是数组 - 保留注释
    //如果返回 -1 ，表示正则表达式出错 - 保留注释
    function sub_str_reg_search_b_array(csinput,word_t){
        var blfound2=false;
        for (let blx=0; blx<csinput.length;blx++){
            if ((csinput[blx]+'').includes(word_t)){
                blfound2=true;
                break;
            }
        }
        return blfound2;
    }
    
    function sub_sort_by_date_b_sort_array_reg(csinput,word_t){
        var blfound2=false;
        for (let blx=0; blx<csinput.length;blx++){
            if ((csinput[blx]+'').search(new RegExp(word_t,"i"))>=0){
                blfound2=true;
                break;
            }
        }
        return blfound2;
    }
    //---------
	var blfound=false;
	var csarray=Array.isArray(csinput);
	if (csarray==false && typeof csinput!=="string"){
		csinput=''+csinput;
	}
    //如果 查询关键字 是 字符串，则转换为数组 - 保留注释
    if (typeof cskeys=='string'){
        cskeys=cskeys.split(' ');
    }

	for (var blno=0;blno<cskeys.length;blno++){
		var word_t=cskeys[blno];
		if (word_t=="" || word_t=="+" || word_t=="-"){
			continue;
		}
		if (csreg==false){
			if (word_t.substring(0,1)=='+'){
				if (csarray){
                    var blfound2=sub_str_reg_search_b_array(csinput,word_t.substring(1,));
                    
					if (blfound2==false){
						blfound=false;
						break;
					}
					else{blfound=true;}	 
				}
				else {
					if (csinput.indexOf(word_t.substring(1,))<0){
						blfound=false;
						break;
					}
					else{blfound=true;}
				}
			}
			else if (word_t.substring(0,1)=='-'){
				if (csarray){
                    var blfound2=sub_str_reg_search_b_array(csinput,word_t.substring(1,));
					if (blfound2==true){
						blfound=false;
						break;
					}
					else{blfound=true;}	 
				}
				else {
					if (csinput.includes(word_t.substring(1,))){
						blfound=false;
						break;
					}
					else{blfound=true;}
				}
			}
			else {
				if (csarray){
                    var blfound2=sub_str_reg_search_b_array(csinput,word_t);
					if (blfound2==true){
						blfound=true;
					}
				}
				else {
					if (csinput.includes(word_t)){
						blfound=true;
					}
				}
			}
		}
		else{
			try{
				if (word_t.substring(0,1)=='+'){
					if (csarray){
                        var blfound2=sub_sort_by_date_b_sort_array_reg(csinput,word_t.substring(1,));
						if (blfound2==false){
							blfound=false;
							break;
						}
						else{blfound=true;}	 
					}
					else {
						if (csinput.search(new RegExp(word_t.substring(1,),"i"))<0){
							blfound=false;
							break;
						}
						else{blfound=true;}
					}
				}
				else if (word_t.substring(0,1)=='-'){
					if (csarray){
                        var blfound2=sub_sort_by_date_b_sort_array_reg(csinput,word_t.substring(1,));
						if (blfound2==true){
							blfound=false;
							break;
						}
						else{blfound=true;}	 
					}
					else {
						if (csinput.search(new RegExp(word_t.substring(1,),"i"))>=0){
							blfound=false;
							break;
						}
						else{blfound=true;}
					}
				}
				else {
					if (csarray){
                        var blfound2=sub_sort_by_date_b_sort_array_reg(csinput,word_t);
						if (blfound2==true){
							blfound=true;
						}
					}
					else {
						if (csinput.search(new RegExp(word_t,"i"))>=0){
							blfound=true;
						}
					}
				}
			}
			catch (error){
				alert(word_t+' '+error.message);
				return -1;
			}
		}
	}
	return blfound;
}

function search_r_key_b(inputid,checkboxid,csstr){
    var isreg=false;
    if (csstr.slice(-4)=='(:r)'){
        csstr=csstr.substring(0,csstr.length-4);
        isreg=true;
    }
    var o_tmp=document.getElementById(inputid);
	if (o_tmp){
		o_tmp.value=csstr;
	}
    if (checkboxid!==''){
        var o_tmp=document.getElementById(checkboxid);
        if (o_tmp){
            if (o_tmp.tagName=='SPAN'){
                checkbox_kl_color_b(checkboxid,isreg);//此函数在 klbase_css.js 中 - 保留注释
            }
            else {
                o_tmp.checked=isreg;
            }
        }
    }
}

function randomsort_b(a, b) {
   return Math.random()>.5 ? -1 : 1;
}

function sort_by_date_b(a,b,csdesc=false,arrayno=-1,arrayno2=-1,array2desc=false,cszh=false){
    function sub_sort_by_date_b_sort_string(a,b,arrayno2,array2desc,cszh){
        if (cszh){
            return zh_sort_b(a[arrayno2],b[arrayno2],array2desc);
        }
        else {
            if (array2desc){
                return b[arrayno2]-a[arrayno2];
            }
            else {
                return a[arrayno2]-b[arrayno2];
            }
        }
    }
    function sub_sort_by_date_b_sort_array(a,b,arrayno2){
        if (arrayno2>=0){
            if (a[arrayno]==b[arrayno]){
                return false;
            }
            else {return new Date(a[arrayno])-new Date(b[arrayno]);}
        }
        else {
            return new Date(a[arrayno])-new Date(b[arrayno]);
        }
    }
    //-------
    if (arrayno<0){
        if (csdesc){
            return new Date(b)-new Date(a);
        }
        else {
            return new Date(a)-new Date(b);
        }
    }
    else {
        if (csdesc){
            var blvalue=sub_sort_by_date_b_sort_array(b,a,arrayno2);
        }
        else {
            var blvalue=sub_sort_by_date_b_sort_array(a,b,arrayno2);
        }
        if (blvalue==false){
            return sub_sort_by_date_b_sort_string(a,b,arrayno2,array2desc,cszh);
        }
        else {return blvalue;}
    }
}

function bible_en_cn_b(csstr){
    var ben=["The First Book of Moses: Called Genesis","The Second Book of Moses: Called Exodus","The Third Book of Moses: Called Leviticus","The Fourth Book of Moses: Called Numbers","The Fifth Book of Moses: Called Deuteronomy","The Book of Joshua","The Book of Judges","The Book of Ruth","The First Book of Samuel","The Second Book of Samuel","The First Book of the Kings","The Second Book of the Kings","The First Book of the Chronicles","The Second Book of the Chronicles","Ezra","The Book of Nehemiah","The Book of Esther","The Book of Job","The Book of Psalms","The Proverbs","Ecclesiastes","The Song of Solomon","The Book of the Prophet Isaiah","The Book of the Prophet Jeremiah","The Lamentations of Jeremiah","The Book of the Prophet Ezekiel","The Book of Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","The Gospel According to Saint Matthew","The Gospel According to Saint Mark","The Gospel According to Saint Luke","The Gospel According to Saint John","The Acts of the Apostles","The Epistle of Paul the Apostle to the Romans","The First Epistle of Paul the Apostle to the Corinthians","The Second Epistle of Paul the Apostle to the Corinthians","The Epistle of Paul the Apostle to the Galatians","The Epistle of Paul the Apostle to the Ephesians","The Epistle of Paul the Apostle to the Philippians","The Epistle of Paul the Apostle to the Colossians","The First Epistle of Paul the Apostle to the Thessalonians","The Second Epistle of Paul the Apostle to the Thessalonians","The First Epistle of Paul the Apostle to Timothy","The Second Epistle of Paul the Apostle to Timothy","The Epistle of Paul the Apostle to Titus","The Epistle of Paul the Apostle to Philemon","The Epistle of Paul the Apostle to the Hebrews","The General Epistle of James","The First Epistle General of Peter","The Second General Epistle of Peter","The First Epistle General of John","The Second Epistle General of John","The Third Epistle General of John","The General Epistle of Jude","The Revelation of Saint John the Devine",];
    var bcn=["创世记","出埃及记","利未记","民数记","申命记","约书亚记","士师记","路得记","撒母耳记上","撒母耳记下","列王记上","列王记下","历代志上","历代志下","以斯拉记","尼希米记","以斯帖记","约伯记","诗篇","箴言","传道书","雅歌","以赛亚书","耶利米书","耶利米哀歌","以西结书","但以理书","何西阿书","约珥书","阿摩司书","俄巴底亚书","约拿书","弥迦书","那鸿书","哈巴谷书","西番雅书","哈该书","撒迦利亚书","玛拉基书","马太福音","马可福音","路加福音","约翰福音","使徒行传","罗马书","哥林多前书","哥林多后书","加拉太书","以弗所书","腓立比书","歌罗西书","帖撒罗尼迦前书","帖撒罗尼迦后书","提摩太前书","提摩太后书","提多书","腓利门书","希伯来书","雅各书","彼得前书","彼得后书","约翰一书","约翰二书","约翰三书","犹大书","启示录",];
    
    var at_t=ben.indexOf(csstr);
    if (at_t>=0){
        return bcn[at_t];
    }
    var at_t=bcn.indexOf(csstr);
    if (at_t>=0){
        return ben[at_t];
    }
    return '';
}
function zh_sort_b(a,b,csdesc=false,arrayno=-1){
    if (arrayno<0){
        if (a.toString().substring(0,1).match(/[^\x00-\xff]/g)==null || b.toString().substring(0,1).match(/[^\x00-\xff]/g)==null){
            if (csdesc){
                return b>a;
            }
            else {
                return a>b;
            }
        }
        else {
            if (csdesc){
                return b.localeCompare(a,"zh");
            }
            else {
                return a.localeCompare(b,"zh");
            }
        }
    }
    else {
        if (a[arrayno].toString().substring(0,1).match(/[^\x00-\xff]/g)==null || b[arrayno].toString().substring(0,1).match(/[^\x00-\xff]/g)==null){
            if (csdesc){
                return b[arrayno]>a[arrayno];
            }
            else {
                return a[arrayno]>b[arrayno];
            }        
        }
        else {
            if (csdesc){
                return b[arrayno].localeCompare(a[arrayno],"zh");
            }
            else {
                return a[arrayno].localeCompare(b[arrayno],"zh");
            }
        }
    }
}

function radio_value_get_b(radio_name){
	var elements = document.getElementsByName(radio_name);
    if (elements){
        var cstype_t='0';
        for (var i=0;i<elements.length; i++){
            if (elements[i].checked){
                cstype_t=elements[i].value;
                break;
            }
        }
        return cstype_t;
    }
    else {return '-1';}
}

function radio_value_set_b(radio_name,csvalue){
	var elements = document.getElementsByName(radio_name);
    if (elements){
        for (var i=0;i<elements.length; i++){
            if (elements[i].value==csvalue){
                elements[i].checked=true;
            }
            else {elements[i].checked=false;}
        }
        return i;
    }
    else {return -1;}
}

function specialstr_j(csstr,ignore_single_quote=false){
    //var www='"do\\gl\\\\h\'ello';
    var bljg=csstr.toString().replace(new RegExp(/\\/,"g"),'\\\\');
    bljg=bljg.replace(new RegExp('"',"g"),'\\"');
    if (ignore_single_quote==false){
        bljg=bljg.replace(new RegExp("'","g"),"\\'");
    }
    return bljg;
}

function specialstr_lt_gt_j(csstr,csand=false){
    //var www='"do\\gl\\\\h\'ello';
    csstr=csstr.toString();
    if (csand){
        csstr=csstr.replace(new RegExp(/&/,"g"),'&amp;');
    }
    csstr=csstr.replace(new RegExp(/</,"g"),'&lt;');
    csstr=csstr.replace(new RegExp('>',"g"),'&gt;');
    return csstr;
}

function href_split_b(cshref){
    if (cshref.includes("#")){
        var cshref=cshref.substring(0,cshref.indexOf("#"));
    }
    if (cshref.includes("?")){
        cshref=cshref.substring(cshref.indexOf("?")+1);
    }
    else {
        cshref='';
    }
    var cskeys=decodeURIComponent(cshref).split('&');
    return cskeys;
}

function restore_str_b(csstr){
    var bljg=csstr.toString();
    bljg=bljg.replace(new RegExp("&#39;","g"),"'");   
    bljg=bljg.replace(new RegExp('&quot;',"g"),'"');
    bljg=bljg.replace(new RegExp('&#92;',"g"),'\\');
    
    bljg=bljg.replace(new RegExp('&gt;',"g"),'>');
    bljg=bljg.replace(new RegExp('&lt;',"g"),'<');
    bljg=bljg.replace(new RegExp('&amp;',"g"),'&');
    return bljg;
}

function specialstr92_b(csstr){
    //和 php 的 specialstr92_g() 等效 - 保留注释
    return specialstr_html_b(specialstr_lt_gt_j(csstr,true));
}

function specialstr_html_b(csstr){
    //var www='"do\\gl\\\\h\'ello';
    var bljg=csstr.toString().replace(new RegExp(/\\/,"g"),'&#92;');
    bljg=bljg.replace(new RegExp('"',"g"),'&quot;');
    bljg=bljg.replace(new RegExp("'","g"),"&#39;");
    return bljg;
}

function quote_2_cn_character(csstr){
    return csstr.replace(new RegExp("'",'g'),'’').replace(new RegExp('"','g'),'”').replace(new RegExp(/\\/,'g'),'＼');
}

function asc_sum_b(csstr){
    var asc_t=0;
    var length_t=csstr.length;
    for (let blxl=0;blxl<length_t;blxl++){
        asc_t=asc_t+csstr.substring(blxl,blxl+1).charCodeAt(0);
    }
    return asc_t;
}

function string_difference_b(str1,str2){
    for (let item of str1){
        str2=str2.replace(item,'');
    }
    return str2;
}

function array_unique_b(listname,isset=false){
    if (isset){
        return new Set(listname);
    }
    return Array.from(new Set(listname));
}

function array_intersection_b(array1,array2,isset=false){
    //交集
    if (isset){
        return new Set([...array1].filter(x => array2.has(x)));
    }
    var en_source1 = new Set(array1);
    var en_source2 = new Set(array2);
    var en_intersection = new Set([...en_source1].filter(x => en_source2.has(x)));

    return Array.from(en_intersection);
}

function array_difference_b(array1,array2,isset=false){
    //差集，array1 有 但 array2 没有
    if (isset){
        return new Set([...array1].filter(x => !array2.has(x)));
    }
    
    var en_source1 = new Set(array1);
    var en_source2 = new Set(array2);
    var en_intersection = new Set([...en_source1].filter(x => !en_source2.has(x)));

    return Array.from(en_intersection);
}

function array_union_b(array1,array2,isset=false){
    //并集
    if (isset){
        return new Set([...array1, ...array2]);
    }
    
    var en_source1 = new Set(array1);
    var en_source2 = new Set(array2);
    var en_union = new Set([...en_source1, ...en_source2]);
    return Array.from(en_union);
}

function array_numbers_b(csmax,randomsort_times=-1){
    var list_t=Array.from(Array(csmax).keys()); //形如[0,1,2,...,csmax-1]，不含csmax - 保留注释
    if (randomsort_times>0){
        for (let blxl=0;blxl<randomsort_times;blxl++){
            list_t.sort(randomsort_b);
        }    
    }
    return list_t;
}

function kbmbgb_b(cssize,afterpoint=2){
    var bldw='';
    if (cssize>=1000){
        cssize=cssize/1024;
        bldw='KB';
    }
    if (cssize>=1000){
        cssize=cssize/1024;
        bldw='MB';
    }
    if (cssize>=1000){
        cssize=cssize/1024;
        bldw='GB';
    }
    if (cssize>=1000){
        cssize=cssize/1024;
        bldw='TB';
    }    
    if (bldw==''){
        return cssize;
    }
    return cssize.toFixed(afterpoint)+bldw;
}

function href2host_b(cshref,cswithhttp=false){
    var str_t=cshref.trim().replace(new RegExp('^https?://(.*)','g'),'$1');
    if (cswithhttp){
        var head=cshref.trim().replace(new RegExp('^(https?://).*','g'),'$1');
    }
    else {
       var head=''
    }
    return head+str_t.split('/')[0].trim();    
}

function english_punctuation_b(csstr){
    var arr_t=[
    ['‘([\x00-\xff])',"'$1"],
    ['([\x00-\xff])’',"$1'"],
    ['“([\x00-\xff])','"$1'],
    ['([\x00-\xff])”','$1"'],
    ];
    
    for (let item of arr_t){
        csstr = csstr.replace(new RegExp(item[0],"gm"),item[1]);
    }
    return csstr;
}

function chinese_punctuation_b(csstr){
    for (var blxl=1;blxl<3;blxl++){
        csstr=csstr.replace(new RegExp(/([^\x00-\xff])\?/,"g"),"$1？");
        csstr=csstr.replace(new RegExp(/([^\x00-\xff])!/,"g"),"$1！");
        csstr=csstr.replace(new RegExp(/([^\x00-\xff]),/,"g"),"$1，");
        
        csstr=csstr.replace(new RegExp(/([^\x00-\xff]): /,"g"),"$1：");
        csstr=csstr.replace(new RegExp(/([^\x00-\xff]):/,"g"),"$1：");
        csstr=csstr.replace(new RegExp(/([^\x00-\xff]); /,"g"),"$1；");
        csstr=csstr.replace(new RegExp(/([^\x00-\xff]);/,"g"),"$1；");    
        
        csstr=csstr.replace(new RegExp(/^\'([^\x00-\xff][^\'‘’\n]*?[^\x00-\xff]?)\'/,"g"),"‘$1’");
        csstr=csstr.replace(new RegExp(/([^\'])\'([^\x00-\xff][^\'‘’\n]*?[^\x00-\xff]?)\'/,"g"),"$1‘$2’");
        csstr=csstr.replace(new RegExp(/\"([^\x00-\xff][^\"”“\n]*?[^\x00-\xff]?)\"/,"g"),"“$1”");
        csstr=csstr.replace(new RegExp(/\(([^\x00-\xff][^\(\)（）\n]*?[^\x00-\xff]?)\)/,"g"),"（$1）");
        
        csstr=csstr.replace(new RegExp(/([^\x00-\xff])\.{6}/,"g"),"$1……");
        csstr=csstr.replace(new RegExp(/([^\x00-\xff])\.{3}/,"g"),"$1…");
        csstr=csstr.replace(new RegExp(/([^\x00-\xff])\./,"g"),"$1。");
    }
    return csstr;
}

function local_storage_all_b(cstype='',key_list=[]){
    if (typeof key_list == 'string' ){
        switch (key_list){
            case 'PIM':
                key_list=['list_long_term_plans','list_klmemo','list_routines','list_todolist'];
                break;
            case 'done_PIM':
                key_list=['done_routines','done_todolist'];
                break;                
            default:
                key_list=[];
        }
    }
    var key_list_len=key_list.length;
    if (cstype=='name'){
        var blcontent=[];
        for (let blxl = 0; blxl < localStorage.length; blxl++){
            blcontent.push(localStorage.key(blxl));
        }
        blcontent.sort();
        return [blcontent.join('\n'),0];
    }
    else if (cstype=='name_length'){
        var blcontent=[];
        var total_len=0;
        for (let blxl = 0; blxl < localStorage.length; blxl++){
            if (key_list_len>0 && !key_list.includes(localStorage.key(blxl))){continue;}
            var bllen=localStorage.getItem(localStorage.key(blxl)).length;
            blcontent.push([localStorage.key(blxl),bllen]);
            total_len=total_len+bllen;
        }
        blcontent.sort(function (a,b){return a[1]<b[1];});
        return [blcontent,total_len];
    }
    
    var blcontent='';
    for (let blxl = 0; blxl < localStorage.length; blxl++){
        if (key_list_len>0 && !key_list.includes(localStorage.key(blxl))){continue;}
        blcontent=blcontent+localStorage.key(blxl)+'\n'+localStorage.getItem(localStorage.key(blxl))+'\n';
    }
    var randstr='== 分隔行 '+parseInt(Math.random()*9999999)+' ==\n';
    while (true){
        if (blcontent.includes(randstr)){
            randstr='== 分隔行 '+parseInt(Math.random()*9999999)+' ==\n';
        }
        else {break;}
    }
    
    var bljg=[];
    var bllen=0;
    for (let blxl = 0; blxl < localStorage.length; blxl++){
        if (key_list_len>0 && !key_list.includes(localStorage.key(blxl))){continue;}

        var blstr=localStorage.getItem(localStorage.key(blxl));
        bllen=bllen+blstr.length;
        blstr=randstr+localStorage.key(blxl)+'\n'+blstr;
        bljg.push(blstr);
    }
    bljg.sort();
    console.log(bljg);
    console.log(bllen);
    return [bljg.join('\n'),bllen];
}

function local_storage_squash_b(csid,csarray,top_left=10,bottom_left=10,cspercent=0.5){
    var bllen=csarray.length;
    if (bllen>top_left+bottom_left){
        var arr_left=csarray.slice(0,top_left);
        if (bottom_left>0){
            var arr_right=csarray.slice(-1*bottom_left,);
            var arr_middle=csarray.slice(top_left,-1*bottom_left);
        }
        else {
            var arr_right=[];
            var arr_middle=csarray.slice(top_left,);
        }
        arr_middle=array_squash_b(arr_middle,cspercent);
        var blresult=arr_left.concat(arr_middle);
        blresult=blresult.concat(arr_right);
        localStorage.setItem(csid,blresult.join('\n'));
    }
}

function local_storage_insert_unique_b(csid,csvalue,cscount=-1){
    //将新的值写入到第一行，并删除其他相同值的行 - 保留注释
    if (csvalue==''){return;}
    
    var list_t=local_storage_get_b(csid,cscount,true);
    var result_t=[csvalue];
    for (let item of list_t){
        if (item==csvalue){continue;}
        result_t.push(item);
    }
    localStorage.setItem(csid,result_t.join('\n'));
}

function local_storage_get_b(csid,csmax=-1,return_list=false,remove_item=''){
    var bljg=localStorage.getItem(csid) || '';
    while (bljg.includes('\n\n')){
        bljg=bljg.replace(new RegExp(/\n\n/,'g'),'\n');
    }
    bljg=bljg.trim();
    if (csmax<=0 && return_list===false && remove_item.length==0){
        return bljg;
    }
    var list_t=bljg.split('\n');
    if (csmax>0){
        list_t=list_t.slice(0,csmax);
    }
    if (remove_item.length>0){
        if (Array.isArray(remove_item)){
            for (let item of remove_item){
                if (item==''){continue;}
                while (true){
                    var blat=list_t.indexOf(item);
                    if (blat>=0){
                        list_t.splice(blat,1);
                    }
                    else {break;}
                }
            }
        }
        else {
            while (true){
                var blat=list_t.indexOf(remove_item);
                if (blat>=0){
                    list_t.splice(blat,1);
                }
                else {break;}
            }
        }
    }
    if (return_list){
        return list_t;
    }
    return list_t.join('\n');
}

function array_squash_b(csarray,csmax=0.5){
    //保留第一个和最后一个元素，若 csmax>1，则其他元素按 csmax-2 个数筛选，否则按 元素总数*csmax - 2 筛选 - 保留注释
    var bllen=csarray.length;
    if (bllen<3){return csarray;}
    if (csmax<1){
        csmax=Math.round(bllen*csmax);
    }
    if (csmax<3){
        return [csarray[0],csarray[bllen-1]];
    }
    if (csmax>=bllen){return csarray;}
    
    var blstep=Math.max(1,Math.round((bllen-2)/(csmax-2)));
    var bljg=[csarray[0]];
    for (let blxl=blstep;blxl<bllen-1;blxl=blxl+blstep){
        bljg.push(csarray[blxl]);
    }
    bljg.push(csarray[bllen-1]);
    return bljg;
}

function local_storage_today_b(csid,csmax=-1,csnewcontent='',cssplit='',cstype='d'){
    if (csnewcontent==''){return;}
    var list_t=local_storage_get_b(csid,csmax,true);
    var theday=new Date();
    var today='';
    if (cstype.includes('d')){
        today=today+theday.getFullYear()+'-'+('0'+(theday.getMonth()+1)).slice(-2)+'-'+('0'+theday.getDate()).slice(-2);
    }
    if (cstype.includes('t')){
        today=today+' '+('0'+theday.getHours()).slice(-2)+':'+('0'+theday.getMinutes()).slice(-2)+':'+('0'+theday.getSeconds()).slice(-2);
        today=today.trim();
    }
    
    //日期+英文冒号+间隔标记
    csnewcontent=csnewcontent+'';
    if (csnewcontent.slice(-1)!=='\n'){
        csnewcontent=csnewcontent+'\n';
    }
    
    var remove_xl_list=[];
    if (cssplit!=='' && list_t.length>=1+3){
        for (let blxl=1;blxl<list_t.length-2;blxl++){
            var right_part_0=list_t[blxl].substring(list_t[blxl].indexOf(cssplit),);
            var right_part_1=list_t[blxl+1].substring(list_t[blxl+1].indexOf(cssplit),);
            var right_part_2=list_t[blxl+2].substring(list_t[blxl+2].indexOf(cssplit),);
            if (right_part_0==right_part_1 && right_part_1==right_part_2){
                remove_xl_list.push(blxl+1);
            }
        }
    }

    var bljg='';
    for (let blxl=0;blxl<list_t.length;blxl++){
        //去除连续3行值相同的行中的倒数第2行 - 保留注释
        if (remove_xl_list.includes(blxl)){
            continue;
        }
            
        var item=list_t[blxl];
        //忽略日期相同的行 - 保留注释
        if (item.match('^'+today+cssplit)!==null){
            continue;
        }
        bljg=bljg+item+'\n';
    }
    
    bljg=bljg.trim();
    localStorage.setItem(csid,today+cssplit+csnewcontent+bljg);
}

function track_source_b(cskey,include_local=true,count_per_day=1){
    if (include_local==false && is_local_b()){return;}
    var theday=new Date();
    var daystr=theday.getFullYear()+'-'+('0'+(theday.getMonth()+1)).slice(-2)+'-'+('0'+theday.getDate()).slice(-2);    
    var blcount=0;
    var list_t=local_storage_get_b('track_source_count_per_day',-1,true);
    if (list_t.length>=2){
        if (list_t[0]==daystr){
            blcount=parseInt(list_t[1]);
            if (!isNaN(blcount)){
                if (count_per_day>=0 && blcount>=count_per_day){return;}
            }
            else {
                blcount=0;
            }
        }
    }
    localStorage.setItem('track_source_count_per_day',daystr+'\n'+(blcount+1));
    document.write('\n<ifra'+'me src="ht'+'tps:\/\/gla'+'cial-re'+'treat-38'+'863'+'.'+'her'+'oku'+'ap'+'p.c'+'om\/pg?key='+specialstr_html_b(cskey)+'" style="display:none;"><\/ifra'+'me>\n');
}

function math_ceil10_b(csnum){
    //8339 -> 9000 - 保留注释
    //1002 -> 2000 - 保留注释
    //只支持正数 - 保留注释
    if (csnum<0){
        return csnum;
    }
    var blstr=csnum.toString();
    var bllen=blstr.length;
    return (parseInt(blstr.substring(0,1))+1)*(10**(bllen-1));
}

function character_single_2_double_b(str){
    var result = "";
    var len = str.length;
    for(let blxl=0;blxl<len;blxl++){
        var cCode = str.charCodeAt(blxl);
        //全角与半角相差（除空格外）：65248(十进制)
        cCode = (cCode>=0x0021 && cCode<=0x007E)?(cCode + 65248) : cCode;
        //处理空格
        cCode = (cCode==0x0020)?0x03000:cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
}

function character_double_b(){
    return 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９';
}

function character_double_2_single_b(str,only_az09=false){
    var result = "";
    var len = str.length;
    var double_az09='';
    if (only_az09){
        double_az09=character_double_b();
    }
    
    for(let blxl=0;blxl<len;blxl++){
        if (only_az09 && !double_az09.includes(str[blxl])){
            result=result+str[blxl];
            continue;
        }
        var cCode = str.charCodeAt(blxl);
        //全角与半角相差（除空格外）：65248（十进制）
        cCode = (cCode>=0xFF01 && cCode<=0xFF5E)?(cCode - 65248) : cCode;
        //处理空格
        cCode = (cCode==0x03000)?0x0020:cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
}

function permutator_b(inputArr) {
    //https://stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979 - 保留注释
    var length = inputArr.length,
    result = [inputArr.slice()],
    c = new Array(length).fill(0),
    i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = inputArr[i];
            inputArr[i] = inputArr[k];
            inputArr[k] = p;
            ++c[i];
            i = 1;
            result.push(inputArr.slice());
        } 
        else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

function reverse_str_b(csstr){
    return csstr.split("").reverse().join("");
}

function service_worker_delete_b(appname){
    var keyname='pwa_'+appname+'_store';
    var fname=appname+'_service_worker.js';
    
    caches.delete(keyname);
    console.log('caches.delete',keyname); //此行保留 - 保留注释
    if(window.navigator && navigator.serviceWorker) {
        navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
            for(let one_registration of registrations) {
                if (one_registration.active['scriptURL'].includes(fname)){
                    one_registration.unregister();
                    console.log('one_registration.unregister',fname); //此行保留 - 保留注释
                }
            }
        });
    }
}

function pwa_clear_cache_all_b(){
    if (confirm('是否清空全部 PWA Cache？')){
        var service_list=[
        "bible",
        "calculator",
        "gps_points",
        "long_term_plans",
        "lsm",
        "memo",
        "rnd_english_words",
        "routines",
        "screen_clock",
        "screen_colorful_boxes",
        "screen_matrix",
        "sticker_mobile",
        "todolist",
        "websites",
        ];
        for (let item of service_list){
            service_worker_delete_b(item);
        }
    }
}

function array_repeated_column_value_b(cslist,checknum=0){
    //cslist 形如 
    //[
    //[value1,value2,value3],
    //[value1,value2,value3],
    //]；
    var list_t=[];
    var repeated=[];
    for (let item of cslist){
        if (list_t.includes(item[checknum])){
            if (!repeated.includes(item[checknum])){
                repeated.push(item[checknum]);
            }
        }
        else {
            list_t.push(item[checknum]);
        }
    }
    if (repeated.length==0){
        return [];
    }
    
    var bljg=[];
    for (let item of cslist){
        if (repeated.includes(item[checknum])){
            bljg.push(item);
        }
    }
    return bljg;
}

function kl_remote_host_address_b(){
    var old_address=local_storage_get_b('kl_remote_host',-1,false);
    var bladdress=prompt('输入 form 发送远程服务器地址(形如：http://123.456.789.023)\n如只输入23，则自动补全为 http://192.168.0.23，\n未输入 http:// 则自动补全：',old_address);
    if (bladdress==null){
        return;
    }
    bladdress=bladdress.trim();
    if (bladdress.match(/^\d{1,3}$/)!==null){
        bladdress='http://192.168.0.'+bladdress;
    }
    if (bladdress.substring(0,7)!=='http://'){
        bladdress='http://'+bladdress;
    }
    if (bladdress.slice(-1)=='/'){
        bladdress=bladdress.slice(0,-1);
    }
    localStorage.setItem('kl_remote_host',bladdress);
}

function local_storage_view_form_b(keytype='',csid=''){
	var bljg='<form method="POST" action="'+postpath_b()+'temp_txt_share.php" name="form_backup_localstorage" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_backup_localstorage" id="textarea_backup_localstorage" style="height:20rem;">'+local_storage_all_b('',keytype)[0]+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="javascript:document.getElementById(\''+csid+'\').innerHTML=\'\';">Close</span> ';
    bljg=bljg+'<span class="aclick" onclick="javascript:local_storage_import_b(\'textarea_backup_localstorage\',true);">导入 localStorage</span> ';
    bljg=bljg+textarea_buttons_b('textarea_backup_localstorage','清空,复制,发送到临时记事本,发送地址');
    bljg=bljg+'</form>';
    var obj=document.getElementById(csid);
    if (obj){
        obj.innerHTML=bljg;
    }
}

function local_storage_import_b(textarea_id,sucess_alert=false){
    var otextarea=document.getElementById(textarea_id);
    if (!otextarea){return false;}
    
    var blstr=otextarea.value.trim();
    var split_str=blstr.split('\n')[0].trim();
    if (split_str==''){
        alert('未发现分隔行');
        return false;
    }
    if (split_str.substring(0,7)!=='== 分隔行 ' || split_str.slice(-3,)!==' =='){
        alert('分隔行格式错误');
        return false;
    }     
    var list_t=('\n'+blstr).split('\n'+split_str+'\n');
    var name_list=[];
    var name_value_list=[];
    for (let item of list_t){
        var rows=item.trim().split('\n');
        var blname=rows[0];
        if (blname==''){continue;}
        name_list.push(blname);
        rows.splice(0,1);
        name_value_list.push([blname,rows.join('\n')]);
    }

    if (!confirm('是否批量导入\n\n'+name_list.slice(0,5).join('\n')+'\n\n'+(name_list.length>5?'等 ':'')+name_list.length+' 个 localStorage(同名变量被覆盖更新，不同名的变量保留不变)？')){
        return false;
    }
    
    for (let item of name_value_list){
        localStorage.setItem(item[0],item[1]);
    }
    if (sucess_alert){
        alert('批量导入 localStorage 完成');
    }
    return true;
}

function postpath_b(){
    return local_storage_get_b('kl_remote_host',-1,false)+'/klwebphp/';
}

function textarea_buttons_b(textarea_name,csbuttons,cstype='',csstyle='',span_class="aclick"){
    //csstyle: ' style="font-size:1rem;"' - 保留注释
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var postpath=remote_host+'/klwebphp/';
    
    var bljg='';
    if (csbuttons.includes('全选')){
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="javascript:document.getElementById(\''+textarea_name+'\').select();">全选</span> ';
    }
    if (csbuttons.includes('清空编辑框')){    
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="javascript:document.getElementById(\''+textarea_name+'\').value=\'\';">清空编辑框</span> ';
    }    
    else if (csbuttons.includes('清空')){    
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="javascript:document.getElementById(\''+textarea_name+'\').value=\'\';">清空</span> ';
    }
    if (csbuttons.includes('复制')){
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="javascript:document.getElementById(\''+textarea_name+'\').select();document.execCommand(\'copy\');">复制</span> ';
    }
    if (csbuttons.includes('发送到临时记事本')){
        bljg=bljg+'<input type="submit" value="发送到临时记事本"'+csstyle+' /> ';
    }
    if (csbuttons.includes('打开临时记事本')){
        bljg=bljg+'<a'+csstyle+' href="'+postpath+'temp_txt_share.php'+(cstype==''?'':'?type='+cstype)+'" class="a_oblong_box" target=_blank>打开临时记事本('+remote_host.slice(-3,)+')</a> ';
    }
    if (csbuttons.includes('发送地址')){
        var bladdress=postpath+'temp_txt_share.php'+(cstype==''?'':'?type='+cstype);
        bljg=bljg+'<span class="span_link"'+csstyle+' onclick="javascript:kl_remote_host_address_b();" title="设置发送地址">发送地址</span>：<a'+csstyle+' href="'+bladdress+'" target=_blank>'+bladdress+'</a>';
    }
    return bljg;
}

function klsofts_list_b(cstype='all'){
    var isfile=(location.href.substring(0,5)=='file:');
    var ismobile=ismobile_b();
    var divlist=local_storage_get_b('common_softs',-1,true);
    for (let blxl=0;blxl<divlist.length;blxl++){
        divlist[blxl]=divlist[blxl].trim().split(',');
        if (divlist[blxl].length==4 && divlist[blxl][3].includes('_')){
            var list_t=divlist[blxl][3].split('_');
            divlist[blxl][3]=(ismobile?list_t[1]:list_t[0]);
        }
    }
    
    divlist.sort(function(a,b){return a[1].toLowerCase()>b[1].toLowerCase();});
    if (cstype=='all' || cstype==''){
        return divlist;
    }
    
    var selected_t=[];
    if (['0','1','2','3'].includes(cstype)){
        for (let item of divlist){
            if (cstype.includes(item[3])){
                selected_t.push(item);
            }
        }
    }
    else {
        for (let item of divlist){
            var blfound=str_reg_search_b(item,cstype,true);
            if (blfound==-1){break;}   
            if (blfound){
                selected_t.push(item);
            }              
        }    
    }
    return selected_t;
}

function klsofts_one_b(csitem,fontsize=2.5,addp=true,cshref='',jsstr=''){
    if (csitem.length<4){return '';}
    if (fontsize.toString().slice(-3,)!=='rem'){
        fontsize=fontsize+'rem';
    }
    var bljg='<div style="font-size:'+fontsize+';"><a style="text-decoration:none;';
    if (addp){
        bljg=bljg+(csitem[0].slice(-1)=='/'?'color:green;':'color:blue;')+'" ';
    }
    else {
        bljg=bljg+'color:black;" onmouseover="javascript:this.style.backgroundColor=\'white\';"  onmouseout="javascript:this.style.backgroundColor=\'\';" ';
    }
    
    bljg=bljg+' href="'+(csitem[0].substring(0,4)=='http'?'':cshref)+csitem[0]+'"'+jsstr+(addp?'':' target=_blank')+'>';
    if (csitem[2]!==''){
        if (csitem[2].includes('.')){
            bljg=bljg+'<img src="'+cshref+'icos/'+csitem[2]+'" style="max-width:'+fontsize+';max-height:'+fontsize+';" />';
        }
        else {
            bljg=bljg+csitem[2];
        }
        if (addp){
            var blname=csitem[1];
            blname=blname.replace(RegExp(/^(.*?)(\s)(.*?)(\s)(.*?)$/,'g'),'$1$2$3<br />$4$5');
            if (csitem[0].slice(-1)=='/'){
                bljg=bljg+'<p style="color:green;">'+blname+'</p>';
            }
            else {
                bljg=bljg+'<p>'+blname+'</p>';
            }
        }
        else {
            bljg=bljg+' '+csitem[1];
        }
    }
    else {
        bljg=bljg+csitem[1];
    }
    bljg=bljg+'</a></div> ';
    return bljg;
}

function klsofts_div_b(divid,font_size,padding=0,autoclose=true){
    var blhref=location.href;
    if (blhref.includes('/klwebphp/')){
        blhref=blhref.split('/klwebphp/')[0]+'/klwebphp/';
    }
    else if (blhref.includes('/klwebphp_backup/')){
        blhref=blhref.split('/klwebphp_backup/')[0]+'/klwebphp_backup/';
    }    
    else if (blhref.includes('/wiki/')){
        blhref=blhref.split('/wiki/')[0]+'/klwebphp/';
    }
    var soft_str='<div id="'+divid+'" style="display:none;font-weight:normal;padding:'+padding+'rem;">';
    var soft_list=klsofts_list_b('0');
    soft_list=[["index.htm","KL Apps","klwebphp.ico",0]].concat(soft_list);
    
    if (autoclose){
        var jsstr=' onclick="javascript:popup_show_hide_b(\''+divid+'\');"'
    }
    else {
        var jsstr='';
    }
    for (let item of soft_list){
        soft_str=soft_str+klsofts_one_b(item,font_size,false,blhref,jsstr);
    }
    soft_str=soft_str+'</div>';
    return soft_str;
}

function canvas2img_b(ocanvas,cstype='jpeg'){
    var ctx=ocanvas.getContext("2d");
    if (cstype=='png'){
        return ocanvas.toDataURL("image/png");
    }
    else {
        return ocanvas.toDataURL("image/jpeg");
    }   
}

function read_txt_file_b(fullname){
    var allText='';
    var rawFile = new XMLHttpRequest(); //不支持 file:// - 保留注释
    rawFile.open("GET", fullname, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

function array_2_li_b(csarray,row_type='li',container_type='ol',container_id='',row_classname=''){
    var bljg='<'+row_type+(row_classname==''?'':' class="'+row_classname+'"')+'>'+csarray.join('</'+row_type+'><'+row_type+(row_classname==''?'':' class="'+row_classname+'"')+'>')+'</'+row_type+'>';
    if (container_type===false){
        return bljg;
    }
    bljg='<'+container_type+(container_id==''?'':' id="'+container_id+'"')+'>'+bljg+'</'+container_type+'>';
    return bljg;
}

function string_2_txt_file_b(csstr,savename,cstype='csv'){
    var pom = document.createElement('a');
    var blob = new Blob([csstr],{type: 'text/'+cstype+';charset=utf-8;'});
    pom.href = URL.createObjectURL(blob);
    pom.setAttribute('download', savename);
    document.body.appendChild(pom); 
    pom.click();    
    document.body.removeChild(pom); 
}

function web_href_key_b(cskey,cstype,encode=false){
    switch (cstype){
        case 1:
        case '1':
        case '+':
            if (cskey.includes(' ')){
                cskey='+'+cskey.split(' ').join(' +');
            }
            break;
        case 2:
        case '2':
        case '-':
            if (cskey.includes(' ')){
                cskey=cskey.split(' ').join('-');
            }
            break;
        case 3:
        case '3':
        case 's':
            cskey=cskey.replace(new RegExp(' ','g'),'\\s');
            break;
    }
    if (encode){
        return encodeURIComponent(cskey);
    }
    else {
        return cskey;
    }
}

function int_number_list_insert_zero_b(cslist,csmin=false,csmax=false){
    //[
    //[int_number1,value1],
    //[int_number,value2],    
    //];
    cslist.sort(function (a,b){return a[0]>b[0];});
    if (cslist.length<2){
        return cslist;
    }
    var num_set=new Set();
    for (let item of cslist){
        num_set.add(item[0]);
    }
    
    if (csmin===false){
        csmin=cslist[0][0];
    }
    if (csmax===false){
        csmax=cslist[cslist.length-1][0];
    }
    
    var blxl=0;    
    var blcurrent=csmin;
    while (true){
        if (blcurrent>=csmax){break;}
        if (!num_set.has(blcurrent)){
            cslist.push([blcurrent,0]);
        }
        blcurrent=blcurrent+1;
        blxl=blxl+1;
        if (blxl>100000){break};
    }
    cslist.sort(function (a,b){return a[0]>b[0];});
    return cslist;
}

function array_count_b(csarray,quote=true,ignore_1=false,obj2array=true){
    var result_t=[];
    for (let item of csarray){
        if (result_t['a'+item]==null){
            result_t['a'+item]=[item,0];
        }
        result_t['a'+item][1]=result_t['a'+item][1]+1;
    }
    if (quote){
        for (let key in result_t){
            if (ignore_1 && result_t[key][1]==1){
                result_t[key]=result_t[key][0];
            }
            else {
                result_t[key]=result_t[key][0]+'('+result_t[key][1]+')';
            }
        }    
    }
        
    if (obj2array){
        result_t=object2array_b(result_t);
    }
    return result_t;
}
