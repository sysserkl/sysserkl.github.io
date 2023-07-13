function ismobile_b(getstr=false,check_arm=false){
    var usera=navigator.userAgent.toLowerCase();
    if (usera.includes('android') || usera.includes('mobile') || check_arm && usera.includes('linux arm')){
        if (getstr){
            return 'mobile';
        }
        else {return true;}
    }
    if (getstr){
        return 'pc';
    }
    else {return false;}
}

function is_file_type_b(){
    return location.href.substring(0,5)=='file:';
}

function is_local_b(check_is_file=true){
    var blhost=location.host; 
    if (blhost.substring(0,4)=='192.' || blhost.substring(0,3)=='10.' || blhost.substring(0,9)=='127.0.0.1'){
        return true;
    }
    if (check_is_file){
        return is_file_type_b();
    }
    else {return false;}
}

function temp_search_link_value_set_b(csvalue){
    localStorage.setItem('temp_search_link',csvalue);
}

function temp_search_link_value_get_b(){
    return local_storage_get_b('temp_search_link');
}

function is_firefox_b(check_isenabled=false,exclude_win=true){
    if (check_isenabled){
        if (local_storage_get_b('enable_klapps')!=='1'){
            var reactive_date=local_storage_get_b('reactive_klapps_date');
            var day_str=today_str_b();
            if (reactive_date!=='' && day_str<=reactive_date){
                return false;
            }
        }
    }
    var blstr=navigator.userAgent;
    if (exclude_win && blstr.includes('Windows')){
        return false;
    }
    
    return  blstr.match(/Firefox\/\d{3,}\.\d+$/g)!==null || blstr.match(/Firefox\/[69]\d\.\d+$/g)!==null;  //60+ 或 90+ 或 100+ - 保留注释
}

function is_old_firefox_b(){
    return navigator.userAgent.match(/Firefox\/[6-8]\d\./)!==null;
}

function blank_page_b(check_firefox=false,check_local=false,redirect=true){
    if (check_firefox && check_local){
        if (is_firefox_b() && is_local_b()){return;}
    }

    if (check_firefox && is_firefox_b()){return;}   
    if (check_local && is_local_b()){return;}

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
    
    var wikipath=is_wiki_path_b();
    if (wikipath!==''){
        return wikipath+'/klwebphp/'+subdir_or_file;
    }
    else {
        return false;
    }
}

function location_host_b(use_remote_host=false){
    if (use_remote_host){
        return local_storage_get_b('kl_remote_host');
    }
    
    var blhref=location.href;
    if (blhref.substring(0,8)=='file:///'){
        return 'file:///'+location.host;    //location.host 为 空 - 保留注释
    }
    else {
        return location.origin; //blhref.split('//')[0]+'//'+location.host;
    }
}

function is_wiki_path_b(){
    var klbase_path=location.href.split('?')[0];
    if (klbase_path.includes('/wiki/')){
        if (klbase_path.split('/wiki/')[0]==location_host_b()){
            return klbase_path.split('/wiki/')[0];
        }
    }
    return '';
}

function base_path_set_b(cstype){
    localStorage.setItem('use_klwebphp_path',(cstype=='k'?'1':'0'));
}

function klbase_sele_path_b(use_remote_host=false){
    var blhref=location.href.trim();
    if (blhref.includes('/klapps.htm')){ //index
        if (blhref.slice(-7,-1)=='?path='){
            base_path_set_b(blhref.slice(-1));
        }
    }
    
    var klbase_path=(use_remote_host?local_storage_get_b('kl_remote_host')+'/klwebphp/':klwebphp_path_b());
    var sele_path='';
    
    if (klbase_path===false){
        sele_path=location_host_b(use_remote_host);
        klbase_path=sele_path+'/hard_ln_io/';
    }
    else {
        sele_path=klbase_path+'PythonTools/data/selenium_news';
    }

    return [klbase_path,sele_path]; //sele_path 末尾无/ - 保留注释
}

function path_convert_b(csline,decode=-1,use_remote_host=false){
    function sub_path_conert_b_one(arow){
        if (arow.substring(0,2)=='{{'){
            if (decode===false){
                return arow;
            }
            for (let item of path_list){
                if (arow.substring(0,item[1].length)==item[1]){
                    arow=item[0]+arow.substring(item[1].length,);
                    break;
                }
            }
        }
        else {
            if (decode===true){
                return arow;
            }
            for (let item of path_list){
                if (arow.substring(0,item[0].length)==item[0]){
                    arow=item[1]+arow.substring(item[0].length,);
                    break;
                }
            }
        }
        
        return arow;    
    }
    //---------------------------------------------------------
    var klwebphp=klwebphp_path_b();  //末尾有/ - 保留注释
    var sele_path=klbase_sele_path_b(use_remote_host)[1];  //末尾无/ - 保留注释
    var blhost=location_host_b(use_remote_host);   //均末尾不含/ - 保留注释
    var path_list=[ //长路径在前 - 保留注释
    [sele_path+'/jsdoc_attachment/','{{jsdoc_attachment}}'],
    [sele_path,'{{selenium_news}}'],
    [klwebphp+'jsdoc1/','{{jsdoc1}}'],
    [klwebphp+'jsdoc2/','{{jsdoc2}}'],
    [klwebphp,'{{klwebphp}}'],
    [blhost+'/wikiuploads/','{{wikiuploads}}'],
    [blhost+'/wiki/','{{klwiki}}'],
    ];

    if (Array.isArray(csline)){
        for (let blxl=0;blxl<csline.length;blxl++){
            csline[blxl]=sub_path_conert_b_one(csline[blxl]);
        }
        return csline;
    }
    else {
        return sub_path_conert_b_one(csline);
    }
}

function js_file_import_defer_b(item){
    var defer_str='';
    if (item.slice(-6,)==',defer'){
        item=item.slice(0,-6);
        defer_str=' defer';
    }
    return [item,defer_str];     
}
    
function klbase_addons_import_js_b(klbase_list=[],module_list=[],jsdata_list=[],same_dir_file_list=[],import_jquery=false,do_write=true){
    var klbase_path='';
    var sele_path='';
    [klbase_path,sele_path]=klbase_sele_path_b();
    var module_path=sele_path+'/module/';
    var jsdata_path=sele_path+'/jsdata/';
    
    var result_t=[[],[],[],[]];
    if (import_jquery){
        result_t[0].push(['js',module_path+'jquery.js','']);  //jquery 首先载入 - 保留注释
    }   

    var defer_str;
    for (let item of klbase_list){
        [item,defer_str]=js_file_import_defer_b(item);
        result_t[0].push(['js',klbase_path+'klbase_'+item+'.js',defer_str]);
    }

    for (let item of module_list){
        [item,defer_str]=js_file_import_defer_b(item);
        if (item.slice(-3,)=='.js'){
            result_t[1].push(['js',module_path+item,defer_str]);
        }
        else if (item.slice(-4,)=='.css'){
            result_t[1].push(['css',module_path+item,'']);
        }        
    }

    for (let item of jsdata_list){
        [item,defer_str]=js_file_import_defer_b(item);
        if (item.slice(-3,)=='.js'){
            result_t[2].push(['js',jsdata_path+item,defer_str]);
        }    
    }

    var same_dir=location_href_b();
    for (let item of same_dir_file_list){
        [item,defer_str]=js_file_import_defer_b(item);
        if (item.slice(-3,)=='.js'){
            result_t[3].push(['js',same_dir+item,defer_str]);
        }
        else if (item.slice(-4,)=='.css'){
            result_t[3].push(['css',same_dir+item,'']);
        }
        else if (item.slice(-4,)=='.png'){
            result_t[3].push(['png',same_dir+item,'']);
        }        
    }
    
    if (do_write){
        for (let item of result_t){
            if (item.length==0){continue;}
            write_js_css_b(item);
        }
    }
    return result_t[0].concat(result_t[1]).concat(result_t[2]).concat(result_t[3]);
}

function write_js_css_b(cslist,do_write=true){
    //元素形如：[ "js", "http://127.0.0.1/klwebphp/klbase_css.js", "" ] - 保留注释
    var links_t=[];
    var today=(is_local_b()?'?'+today_str_b('d',''):'');
    
    for (let item of cslist){   //不能sort - 保留注释
        if (['js','css'].includes(item[0])){
            item[1]=item[1]+today;
        }
        links_t.push(item[1]);
        if (!do_write){continue;}
                
        switch (item[0]){
            case 'js':
                document.write('\n<script src="'+item[1]+'"'+item[2]+'><\/script>\n');
                break;
            case 'css':
                document.write('<link href="'+item[1]+'" type="text/css" rel="stylesheet" />\n');
                break;
            case 'png':
                document.write('<link rel="shortcut icon" href="'+item[1]+'" />\n');
                break;
        }
    }
    if (do_write){
        console.log(links_t.join('\n')); //此行保留 - 保留注释
    }
    return links_t;
}

function file_dom_create_b(file_list,in_head=true,cstype='js'){
    var today=(is_local_b()?'?'+today_str_b('d',''):'');

    var blurl=location.pathname;
    var blat=blurl.lastIndexOf('/');
    if (blat>=0){
        blurl=blurl.substring(0,blat+1);
    }
    blurl=location.origin+blurl;
                
    for (let afile of file_list){
        if (Array.isArray(afile)){
            if (afile.length==3){   //[ "js", "http://xxx/module/jquery.js", "" ] - 保留注释
                cstype=afile[0];
                afile=afile[1]; 
            }
            else {
                console.log('error',afile);
                continue;
            }
        }
        if (afile==''){continue;}
        switch (cstype){
            case 'js':
                var odom = document.createElement('script');
                odom.setAttribute('src',afile+today);
                break;
            case 'css':
                var odom = document.createElement('link');
                odom.setAttribute('type','text/css');
                odom.setAttribute('rel','stylesheet');
                odom.setAttribute('href',afile+today);
                break;
            case 'png':
                var odom = document.createElement('link');
                odom.setAttribute('rel','shortcut icon');
                odom.setAttribute('href',afile);
                break;
        }
        if (afile.substring(0,4).toLowerCase()!=='http'){
            afile=blurl+afile;
        }
        console.log(afile+today);
        if (in_head){
            document.head.appendChild(odom);    
        }
        else {
            document.body.appendChild(odom);
        }
    }
}

function klwiki_link_b(cstitle,open_window=false){
    var blhref=location_host_b()+'/wiki/index.php/'+encodeURIComponent(cstitle);
    if (open_window){
        window.open(blhref);
    }
    return blhref;
}

function object2array_b(cs_object_array,add_key=false,prefix_remove_len=0){
	var list_t=[];
	for (let key in cs_object_array){
        if (Array.isArray(cs_object_array[key])){
            if (add_key){
		        list_t.push([key.substring(prefix_remove_len,)].concat(cs_object_array[key])); //如果是数组直接添加会建立关联，所以需要concat - 保留注释            
            }
            else {
		        list_t.push([].concat(cs_object_array[key])); //如果是数组直接添加会建立关联，所以需要concat - 保留注释
            }
        }
        else {
            if (add_key){
                list_t.push([key.substring(prefix_remove_len,),cs_object_array[key]]);            
            }
            else {        
                list_t.push(cs_object_array[key]);
            }
        }
	}
    return list_t;
}

function bible_en_cn_b(csstr){
    //Python调用：KLfuns_txtbook_enwords.bible_book_name_list() - 保留注释
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

function create_element_b(cstype,csidname,csstyle,o_div,csafter=true){
    if (csidname!==''){
        var o_new = document.getElementById(csidname);
        if (!o_new){
            var o_new = document.createElement(cstype);
            o_new.setAttribute('id', csidname);
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

function list_join_2_reg_style_b(cslist,add_quote=true){
    var blstr=cslist.join('|').trim().replace(new RegExp(/\s/,'g'),'\\s');
    if (add_quote){
        blstr='('+blstr+')';
    }
    return blstr;
}

function str_reg_search_b(csinput,cskeys,csreg){
    //csinput 和 cskeys 可以是字符串，也可以是数组 - 保留注释
    //如果返回 -1 ，表示正则表达式出错 - 保留注释
    function sub_str_reg_search_b_normal(csinput,word_t){
        var blfound2=false;
        for (let item of csinput){
            if ((item+'').includes(word_t)){
                blfound2=true;
                break;
            }
        }
        return blfound2;
    }
    
    function sub_str_reg_search_b_re(csinput,word_t){
        var blfound2=false;
        for (let item of csinput){
            if ((item+'').search(new RegExp(word_t,'i'))>=0){
                blfound2=true;
                break;
            }
        }
        return blfound2;
    }
    //---------
	var blfound=false;
	if (Array.isArray(csinput)==false){
		csinput=[''+csinput];   //可能不是字符串，typeof csinput!=='string' - 保留注释
	}
    //如果 查询关键字 是 字符串，则转换为数组 - 保留注释
    if (typeof cskeys=='string'){
        cskeys=cskeys.split(' ');
    }

	for (let word_t of cskeys){
		if (word_t=='' || word_t=='+' || word_t=='-'){continue;}
        
		if (csreg==false){
			if (word_t.substring(0,1)=='+'){
                var blfound2=sub_str_reg_search_b_normal(csinput,word_t.substring(1,));
                if (blfound2==false){
                    blfound=false;
                    break;
                }
                else{
                    blfound=true;
                } 
			}
			else if (word_t.substring(0,1)=='-'){
                var blfound2=sub_str_reg_search_b_normal(csinput,word_t.substring(1,));
                if (blfound2==true){
                    blfound=false;
                    break;
                }
                else{
                    blfound=true;
                }
			}
			else {
                var blfound2=sub_str_reg_search_b_normal(csinput,word_t);
                if (blfound2==true){
                    blfound=true;
                }
			}
		}
		else{
			try{
				if (word_t.substring(0,1)=='+'){
                    var blfound2=sub_str_reg_search_b_re(csinput,word_t.substring(1,));
                    if (blfound2==false){
                        blfound=false;
                        break;
                    }
                    else{
                        blfound=true;
                    } 
				}
				else if (word_t.substring(0,1)=='-'){
                    var blfound2=sub_str_reg_search_b_re(csinput,word_t.substring(1,));
                    if (blfound2==true){
                        blfound=false;
                        break;
                    }
                    else{
                        blfound=true;
                    } 
				}
				else {
                    var blfound2=sub_str_reg_search_b_re(csinput,word_t);
                    if (blfound2==true){
                        blfound=true;
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

function str_reg_check_b(cskey,is_reg=false,do_trim=true){
    if (cskey.slice(-4,)=='(:r)'){
        is_reg=true;
        cskey=cskey.slice(0,-4);
    }
    if (do_trim){
        cskey=cskey.trimRight();
    }
    return [cskey,is_reg];
}

function search_r_key_b(inputid,checkboxid,csstr){
    var isreg=false;    
    [csstr,isreg]=str_reg_check_b(csstr,isreg,false);
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

function randomsort_b(a, b,value=0.5){
   return Math.random()>value ? -1 : 1;
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
                return b.localeCompare(a,'zh-CN');
            }
            else {
                return a.localeCompare(b,'zh-CN');
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
                return b[arrayno].localeCompare(a[arrayno],'zh-CN');
            }
            else {
                return a[arrayno].localeCompare(b[arrayno],'zh-CN');
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
    else {
        return '-1';
    }
}

function radio_value_set_b(radio_name,csvalue){
    var blfound=false;
	var elements = document.getElementsByName(radio_name);
    if (elements){
        for (let item of elements){
            if (item.value==csvalue){
                blfound=true;
            }
            item.checked=(item.value==csvalue);
        }
    }
    return blfound;
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

function location_href_b(){
    var same_path=location.href.split('?')[0];
    if (same_path.slice(-1)!=='/'){
        var blat=same_path.lastIndexOf('/');
        same_path=same_path.substring(0,blat+1);
    }
    return same_path;
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
    var bljg=csstr.toString().replace(new RegExp(/\\/,"g"),'&#92;');
    bljg=bljg.replace(new RegExp('"',"g"),'&quot;');
    bljg=bljg.replace(new RegExp("'","g"),"&#39;");
    return bljg;
}

function quote_2_cn_character_b(csstr,change_2_one_line=' '){
    if (typeof change_2_one_line == 'string'){
        csstr=csstr.replace(new RegExp(/\r?\n/,'g'),change_2_one_line);
    }
    return csstr.replace(new RegExp("'",'g'),'’').replace(new RegExp('"','g'),'”').replace(new RegExp(/\\/,'g'),'＼').replace(new RegExp(/</,'g'),'＜').replace(new RegExp(/>/,'g'),'＞');
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

function array_difference_b(array1,array2,isset=false,bidirectional=false){
    //差集，array1 有 但 array2 没有
    if (isset){
        return new Set([...array1].filter(x => !array2.has(x)));
    }
    
    var en_source1 = new Set(array1);
    var en_source2 = new Set(array2);
    var en_intersection1 = new Set([...en_source1].filter(x => !en_source2.has(x)));

    if (bidirectional){
        var en_intersection2 = new Set([...en_source2].filter(x => !en_source1.has(x)));
        return [Array.from(en_intersection1),Array.from(en_intersection2)];
    }
    else {
        return Array.from(en_intersection1);
    }
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
    csmax=Math.max(0,csmax);
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

function local_storage_key_name_list_b(){
    var result_t=[];
    for (let blxl = 0; blxl < localStorage.length; blxl++){
        result_t.push(localStorage.key(blxl));
    }
    result_t.sort();
    return result_t;
}

function local_storage_key_length_b(key_list,is_reverse=true){
    var blcontent=[];
    var total_len=0;
    var key_list_len=key_list.length;
    for (let blxl = 0; blxl < localStorage.length; blxl++){
        if (key_list_len>0 && !key_list.includes(localStorage.key(blxl))){continue;}
        var bllen=localStorage.getItem(localStorage.key(blxl)).length;
        blcontent.push([localStorage.key(blxl),bllen]);
        total_len=total_len+bllen;
    }
    
    blcontent.sort();
    if (is_reverse){
        blcontent.sort(function (a,b){return a[1]<b[1];});
    }
    else {
        blcontent.sort(function (a,b){return a[1]>b[1];});
    }
    
    for (let blxl=0;blxl<blcontent.length;blxl++){
        blcontent[blxl].push((blcontent[blxl][1]*100/total_len).toFixed(2)+'%');
    }
    return [blcontent,total_len];
}

function local_storage_all_b(cstype='',key_list=[]){
    if (cstype=='name'){//不考虑 key_list - 保留注释
        return [local_storage_key_name_list_b().join('\n'),0];
    }
    
    if (typeof key_list == 'string'){
        switch (key_list){
            case 'PIM':
                key_list=['list_long_term_plans','list_klmemo','list_routines','list_todolist','list_f2f'];
                break;
            case 'done_PIM':
                key_list=['done_routines','done_todolist'];
                break;                
            default:
                key_list=[];
        }
    }
    var key_list_len=key_list.length;

    if (cstype=='name_length'){
        return local_storage_key_length_b(key_list);
    }
    
    //---
    var blcontent='';
    for (let blxl = 0; blxl < localStorage.length; blxl++){
        var keyname=localStorage.key(blxl);
        if (key_list_len>0 && !key_list.includes(keyname)){continue;}

        var blstr=keyname+'\n'+localStorage.getItem(keyname)+'\n';
        if (blstr.includes('== 分隔行 ') && blstr.includes(' ==')){    //以此减少 blcontent 的长度 - 保留注释
            blcontent=blcontent+blstr;
        }
    }
    var affix=(cstype=='brief'?'--':'==');
    var separation=affix+' 分隔行 '+parseInt(Math.random()*9999999)+' '+affix+'\n';
    while (true){
        if (blcontent.includes(separation)){
            separation=affix+' 分隔行 '+parseInt(Math.random()*9999999)+' '+affix+'\n';
        }
        else {break;}
    }

    blcontent='';
    //---

    var bljg=[];
    var bllen=0;
    var blstr='';
    var is_ok=false;
    var list_t;
    for (let blxl = 0; blxl < localStorage.length; blxl++){
        var keyname=localStorage.key(blxl);
        if (key_list_len>0 && !key_list.includes(keyname)){continue;}

        var line_count=0;
        if (keyname == 'list_long_term_plans'){
            line_count=7;
        }
        else if (keyname =='list_klmemo'){
            line_count=3;
        }
        
        var get_content=false;
        if (line_count>0){
            [is_ok,list_t]=local_storage_2_array_b(keyname,line_count,true);
            if (is_ok){
                blstr=array_2_local_storage_b('',list_t);
                get_content=true;
            }
        }
        
        if (get_content==false){
            blstr=localStorage.getItem(keyname);
        }
        
        bllen=bllen+blstr.length;
        
        if (cstype=='brief'){
            blstr=blstr.split('\n').slice(0,3).join('\n');
        }
        blstr=separation+keyname+'\n'+blstr;
        bljg.push(blstr);
    }
    bljg.sort();
    return [bljg.join('\n'),bllen];
}

function local_storage_squash_b(csid,csarray,top_left=10,bottom_left=10,cspercent=0.5){
    var bllen=csarray.length;
    if (bllen>top_left+bottom_left){
        var arr_left=csarray.slice(0,top_left);
        if (bottom_left>0){
            var arr_right=csarray.slice(-1*bottom_left,);   //不会重复 - 保留注释
            var arr_middle=csarray.slice(top_left,-1*bottom_left);
        }
        else {
            var arr_right=[];
            var arr_middle=csarray.slice(top_left,);
        }
        arr_middle=array_squash_b(arr_middle,cspercent);
        var blresult=arr_left.concat(arr_middle);
        blresult=blresult.concat(arr_right);
        if (csid!==false){
            localStorage.setItem(csid,blresult.join('\n'));
        }
        return blresult;
    }
    else {
        return csarray;
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

function lines_range_b(cslist,csmin=false,csmax=false){
    if (csmin==false && csmax==false){return cslist;}
    var result_t=[];
    if (csmin!==false && csmax!==false){
        for (let item of cslist){
            if (item>=csmin && item<=csmax){
                result_t.push(item);
            }
        }
    }
    else if (csmin!==false){
        for (let item of cslist){
            if (item>=csmin){
                result_t.push(item);
            }
        }
    }    
    else {
        for (let item of cslist){
            if (item<=csmax){
                result_t.push(item);
            }
        }
    }
    return result_t;
}

function local_storage_get_b(csid,csmax=-1,return_list=false,remove_item='',isreg=false){
    function sub_local_storage_get_b_remove_item(item){ //参数不要使用 remove_item - 保留注释
        if (isreg){
            try {
                ''.match(item);  //先测试正则表达式 - 保留注释
                while (true){
                    var blfound=false;
                    for (let blxl=0;blxl<list_t.length;blxl++){
                        if (list_t[blxl].match(item)==null){continue;}
                        list_t.splice(blxl,1);
                        blfound=true;
                        break;
                    }
                    
                    if (blfound==false){break;}
                }            
            }
			catch (error){return;}
        }
        else {
            while (true){
                var blat=list_t.indexOf(item);
                if (blat>=0){
                    list_t.splice(blat,1);
                }
                else {break;}
            }
        }
    }
    //--------------------------------
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
    if (remove_item.length>0){  //只修改数组，未保存到 localStorage - 保留注释
        if (Array.isArray(remove_item)){
            for (let item of remove_item){
                if (item==''){continue;}
                sub_local_storage_get_b_remove_item(item);
            }
        }
        else {
            sub_local_storage_get_b_remove_item(remove_item);
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

function today_str_b(cstype='d',delimiter1='-',delimiter2=':',delimiter3=' '){
    var theday=new Date();
    var today='';
    if (cstype.includes('d')){
        today=today+theday.getFullYear()+delimiter1+('0'+(theday.getMonth()+1)).slice(-2)+delimiter1+('0'+theday.getDate()).slice(-2);
    }
    if (cstype.includes('t')){
        today=today+(today==''?'':delimiter3)+('0'+theday.getHours()).slice(-2)+delimiter2+('0'+theday.getMinutes()).slice(-2)+delimiter2+('0'+theday.getSeconds()).slice(-2);
        today=today.trim();
    }
    return today;
}

function local_storage_list_in_one_day_b(csid){
    //格式是：第一行，日期；第二行开始：各种值 - 保留注释
    var list_t=(localStorage.getItem(csid) || '').trim().split('\n');
    var today_str=today_str_b();
    if (list_t[0]!==today_str){
        list_t=[today_str];
    }
    return list_t;
}

function local_storage_today_b(csid,csmax=-1,csnewcontent='',cssplit='',squash=[],cstype='d'){
    if (csnewcontent==''){return;}
    if (squash.length==3){  //否则不执行压缩，仅截取 - 保留注释
        var list_t=local_storage_get_b(csid,-1,true);
        if (list_t.length>csmax*0.9){
            local_storage_squash_b(csid,list_t,squash[0],squash[1],squash[2]);
        }
    }
    var list_t=local_storage_get_b(csid,csmax,true);
    var today=today_str_b(cstype);
    
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
        if (remove_xl_list.includes(blxl)){continue;}
            
        var item=list_t[blxl];
        //忽略日期相同的行 - 保留注释
        if (item.match('^'+today+cssplit)!==null){continue;}
        bljg=bljg+item+'\n';
    }
    
    bljg=bljg.trim();
    localStorage.setItem(csid,today+cssplit+csnewcontent+bljg);
}

function track_source_b(cskey,include_local=true,count_per_day=1){
    if (include_local==false && is_local_b()){return;}
    var daystr=today_str_b();
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
    var result = '';
    var len = str.length;
    for (let blxl=0;blxl<len;blxl++){
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
    var result = '';
    var len = str.length;
    var double_az09='';
    if (only_az09){
        double_az09=character_double_b();
    }
    
    for (let blxl=0;blxl<len;blxl++){
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

function permutator_b(inputArr){
    //https://stackoverflow.com/questions/9960908/permutations-in-javascript/37580979#37580979 - 保留注释
    var length = inputArr.length;
    var result = [inputArr.slice()];
    var c = new Array(length).fill(0);
    var i = 1, k, p;

    while (i < length){
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
    return csstr.split('').reverse().join('');
}

function service_worker_unregister_b(appname){
    var fname=appname+'_service_worker.js';
    if (window.navigator && navigator.serviceWorker){        
        navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
            var blfound=false;
            for (let one_registration of registrations) {
                if (one_registration.active['scriptURL'].includes(fname) || one_registration.waiting && one_registration.waiting['scriptURL'].includes(fname)){
                    one_registration.unregister();
                    console.log('unregister',fname); //此行保留 - 保留注释
                    blfound=true;
                }
            }
            if (blfound===false){
                console.log('not found',fname);
            }
            console.log('==========');
        });
    }
}

function service_worker_delete_b(appname=''){
    var is_all=(appname=='');

    var keyname='pwa_'+appname+'_store'; //keyname 支持如 pwa_xxx_store_v任意字符 - 保留注释

    var app_list=[];
    caches.keys().then(function(keyList) {
        for (let one_key of keyList){
            if (is_all || one_key==keyname || one_key.substring(0,keyname.length+2)==keyname+'_v'){
                caches.open(one_key).then(function(cache) {
                    cache.keys().then(function(keys) {
                        var blxl=1;
                        keys.forEach(function(request, index, array) {
                            if (blxl % 100 == 0){
                                console.log(blxl,one_key,'delete url:',array[index]['url']);
                            }
                            blxl=blxl+1;
                            cache.delete(request);
                        });
                        console.log('----------');
                        caches.delete(one_key);
                        console.log('caches.delete',one_key); //此行保留 - 保留注释   
                        console.log('----------');
                        
                        appname=one_key.replace(new RegExp(/^pwa_(.*?)_store.*$/,'g'),'$1');
                        app_list.push(appname);
                        service_worker_unregister_b(appname);
                    });
                });
            }
        }
    });
}

function pwa_clear_cache_all_b(){
    if (confirm('是否清空全部 PWA Cache？')==false){return;}
    service_worker_delete_b();
}

function pwa_register_b(jsfile,cscaption,csid,cstype,autohide=-1){
    function sub_pwa_register_b_clear(){
        document.getElementById(csid).innerHTML='';
    }
    //------------------------------------
    // Register service worker to control making site work offline
    if (!is_local_b() && 'serviceWorker' in navigator){
        navigator.serviceWorker
            .register(jsfile)
            .then(function(){
                switch (cstype){
                    case 'color':
                        document.getElementById(csid).style.color=scheme_global['a'];
                        break;
                    case 'html':
                        document.getElementById(csid).innerHTML=cscaption+' Service Worker Registered';
                        if (autohide>0){
                            setTimeout(sub_pwa_register_b_clear,autohide);
                        }
                        break;
                    case 'value':
                        document.getElementById(csid).value=cscaption+' Service Worker Registered';
                        break;
                }
                console.log(cscaption+' Service Worker Registered');
            });
    }
    else {
        switch (cstype){
            case 'color':    
                document.getElementById(csid).style.color=scheme_global['color']; //Service Worker not work - 保留注释;
                break;
            case 'html':
                document.getElementById(csid).innerHTML=cscaption+' Service Worker not work';
                if (autohide>0){
                    setTimeout(sub_pwa_register_b_clear,autohide);
                }
                break;
            case 'value':
                document.getElementById(csid).value=cscaption+' Service Worker not work';            
                break;
        }
        console.log(cscaption+' Service Worker not work');
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

function ip_address_autocomplete_b(csip){
    csip=csip.trim();
    if (csip!==''){
        if (csip.match(/^\d{1,3}$/)!==null){
            csip='http://192.168.0.'+csip;
        }
        if (csip.substring(0,7)!=='http://'){
            csip='http://'+csip;
        }
        if (csip.slice(-1)=='/'){
            csip=csip.slice(0,-1);
        }
    }
    return csip;
}

function kl_remote_host_address_b(new_address=null,do_ask=false){
    var old_address=local_storage_get_b('kl_remote_host',-1,false);
    
    if (new_address===null){
        var bladdress=prompt('输入 form 发送远程服务器地址(形如：http://123.456.789.023)\n如只输入23，则自动补全为 http://192.168.0.23，\n未输入 http:// 则自动补全；如果输入如101-105，或192.168.1.101-105，或：192.168.1.101-192.168.1.105，则进行扫描处理',old_address);
    }
    else {
        bladdress=new_address;
    }
    
    if (bladdress==null){return;}

    var list_t=bladdress.split('-');
    if (list_t.length==2){
        list_t[0]=ip_address_autocomplete_b(list_t[0]);
        list_t[1]=ip_address_autocomplete_b(list_t[1]);
        if (!list_t[0].includes('.') || !list_t[1].includes('.')){
            alert('ip地址格式错误，未发现.号：'+list_t.toString());
            return;
        }
        var blat=list_t[0].lastIndexOf('.');
        var host_left_part=list_t[0].substring(0,blat+1);
        var blmin=parseInt(list_t[0].substring(blat+1,));
        
        blat=list_t[1].lastIndexOf('.');
        var blmax=parseInt(list_t[1].substring(blat+1,));
        
        if (isNaN(blmin) || isNaN(blmax)){
            alert('ip地址格式错误，非数值：'+list_t.toString()+'，'+blmin+','+blmax);
            return;
        }
        remote_ip_detector_b(host_left_part,blmin,blmax,true);
        return;
    }

    bladdress=ip_address_autocomplete_b(bladdress);
    
    if (do_ask){
        if (old_address==bladdress){
            alert('远程 ip 为 '+old_address+' ，与原有设置一致，未修改');
            return;
        }
    
        if (!confirm('是否修改远程 ip '+old_address+' 为 '+bladdress+'？')){return;}
    }
    
    if (old_address==bladdress){return;}
    localStorage.setItem('kl_remote_host',bladdress);
}

function remote_ip_detector_b(host_left_part,csmin,csmax,do_alert=false){
    function sub_remote_ip_detector_b_one_step(is_loaded=true){
        if (is_loaded){
            console.log('remote_ip_detector_b() 发现 ip: '+host_left_part+(csmin+blxl)+'，循环次数：'+(blxl+1)+'，费时：'+(performance.now() - t0) + ' milliseconds');
            kl_remote_host_address_b(host_left_part+(csmin+blxl),true);
            return;
        }

        if (blxl>=bllen){
            var blstr='remote_ip_detector_b() 未发现 ip，循环次数：'+(blxl+1)+'，费时：'+(performance.now() - t0) + ' milliseconds';
            console.log(blstr);
            if (do_alert){
                alert(blstr);
            }
            return;
        }
        
        //eval('typeof you_found_me_global') == 'undefined' - 肯定成立 - 保留注释
        blxl=blxl+1;
        file_dom_create_b([host_left_part+(csmin+blxl)+'/klwebphp/klbase_you_found_me.js']);
        load_var_b('you_found_me_global',(is_local_b()?10:50),500,sub_remote_ip_detector_b_one_step);
    }
    //-------------------
    var t0 = performance.now();    
    var bllen=Math.min(256,csmax-csmin);
    var blxl=-1;
    you_found_me_global=undefined;
    sub_remote_ip_detector_b_one_step(false);
}

function local_storage_view_form_b(keytype='',csid=''){
	var bljg='<form method="POST" action="'+postpath_b()+'temp_txt_share.php" name="form_backup_localstorage" target=_blank>\n';
    bljg=bljg+'<textarea name="textarea_backup_localstorage" id="textarea_backup_localstorage" style="height:20rem;">'+local_storage_all_b('',keytype)[0]+'</textarea>';
    bljg=bljg+'<p>';
    bljg=bljg+'<span class="aclick" onclick="document.getElementById(\''+csid+'\').innerHTML=\'\';">Close</span> ';
    bljg=bljg+'<span class="aclick" onclick="local_storage_import_b(\'textarea_backup_localstorage\',true);">导入 localStorage</span> ';
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

function textarea_buttons_b(textarea_id,csbuttons,cstype='',csstyle='',span_class='aclick'){
    //csstyle: ' style="font-size:1rem;"' - 保留注释
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
    var postpath=remote_host+'/klwebphp/';
    
    var bljg='';
    if (csbuttons.includes('全选') || csbuttons.includes('select all')){
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="document.getElementById(\''+textarea_id+'\').select();">Select All</span> ';
    }
    if (csbuttons.includes('clear textarea')){    
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="document.getElementById(\''+textarea_id+'\').value=\'\';">Clear textarea</span> ';
    }    
    else if (csbuttons.includes('清空') || csbuttons.includes('clear')){    
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="document.getElementById(\''+textarea_id+'\').value=\'\';">Clear</span> ';
    }
    if (csbuttons.includes('复制') || csbuttons.includes('copy')){
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="document.getElementById(\''+textarea_id+'\').select();document.execCommand(\'copy\');">Copy</span> ';
    }
    
    var fext=csbuttons.match(/save as (.*?) file/);
    if (Array.isArray(fext) && fext.length==2){
        if (cstype==''){
            var savename='';
        }
        else {
            var web_type=(is_file_type_b()?'local':location.host);
            var savename=cstype+'_'+(navigator.platform || '').replace(/\s/g,'_')+'_'+web_type+'_'+today_str_b('dt','','','_')+'.'+fext[1];
        }
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="dom_value_2_txt_file_b(\''+textarea_id+'\',\''+specialstr_j(savename)+'\',\''+specialstr_j(fext[1])+'\');">'+fext[0]+'</span> ';
    }    
    
    if (csbuttons.includes('发送到临时记事本') || csbuttons.includes('send to remote temp memo')){
        bljg=bljg+'<input type="submit" value="📤"'+csstyle+' title="send to remote temp memo" /> ';
    }
    if (csbuttons.includes('打开临时记事本') || csbuttons.includes('open remote temp memo')){
        bljg=bljg+'<a'+csstyle+' href="'+postpath+'temp_txt_share.php'+(cstype==''?'':'?type='+cstype)+'" class="a_oblong_box" target=_blank>open remote temp memo('+remote_host.slice(-3,)+')</a> ';
    }
    if (csbuttons.includes('➕')){
        var bladdress=postpath+'temp_txt_append.php';
        bljg=bljg+'<a class="'+span_class+'"'+csstyle+' href="'+bladdress+'" title="'+bladdress+'" target=_blank">➕</a> ';
    }
        
    if (csbuttons.includes('发送地址') || csbuttons.includes('set remote address')){
        var bladdress=postpath+'temp_txt_share.php'+(cstype==''?'':'?type='+cstype);
        bljg=bljg+'<span class="'+span_class+'"'+csstyle+' onclick="kl_remote_host_address_b();" title="set remote address">⛓</span>：<a'+csstyle+' href="'+bladdress+'" target=_blank>'+(remote_host.includes('//')?remote_host.split('//')[1]:remote_host)+' | temp_txt_share.php '+(cstype==''?'':' | '+cstype)+'</a>';
    }
    return bljg;
}

function klsofts_cols_count_b(){
    return ismobile_b()?4:9;
}

function klsofts_ingore_php_b(divlist,ignore_php=false,do_sort=true){
    if (do_sort){
        divlist.sort(function(a,b){
            if (a[3]=='-1'){return false;}   //不排序 - 保留注释        
            if (a[1]=='KL Apps'){return false;}   //不排序 - 保留注释
            return a[1].toLowerCase()>b[1].toLowerCase();
        });
        divlist.sort(function (a,b){return ['remote','local'].includes(a[1]);});
    }
    if (!ignore_php){return divlist;}
    
    var isfile=is_file_type_b();
    var result_t=[];
    for (let item of divlist){
        if (isfile && item[0].slice(-4,)=='.php' && item[0].substring(0,4)!=='http'){
            console.log(item[0]);   //此行保留 - 保留注释
            continue;
        }
        result_t.push(item);
    }
    return result_t;
}

function klsofts_list_b(cstype='all',diy_list=[],ignore_popup=false,ignore_php=true,do_sort=true){
    var ismobile=ismobile_b();
    
    var list_t=diy_list.concat(local_storage_get_b('common_softs',-1,true));
    
    var raw_list=path_convert_b(list_t,true);
    var divlist=[];
    for (let item of raw_list){
        if (item==''){continue;}
        if (ignore_popup){
            if (item.substring(0,6)=='popup:'){continue;}
        }       
        item=item.trim().split(',');          
        divlist.push(item);
    }
    
    var sele_html=path_convert_b('{{selenium_news}}/html/',true);
    var sele_html_len=sele_html.length;
    var klwebphp_path=klwebphp_path_b();
    if (klwebphp_path==false){
        klwebphp_path='../' //selenium_news/ - 保留注释
    }
    var ico_path=klwebphp_path+'icos/';
    
    var selected_t=[];
    var is_local_file=is_file_type_b();
    var blfound=false;
    for (let blxl=0;blxl<divlist.length;blxl++){
        if (divlist[blxl].length==4 && divlist[blxl][3].includes('_')){
            var list_t=divlist[blxl][3].split('_');
            divlist[blxl][3]=(ismobile?list_t[1]:list_t[0]);
            if (is_local_file && list_t.length>=3){
                if (list_t[2]=='f'){
                    blfound=true;
                    continue;
                }
            }
        }
        if (divlist[blxl][2].includes('.')){
            if (divlist[blxl][0].substring(0,sele_html_len)==sele_html){
                divlist[blxl][2]=sele_html+file_path_name_b(divlist[blxl][0])[1]+'_ico/'+divlist[blxl][2];
            }        
            else {
                divlist[blxl][2]=ico_path+divlist[blxl][2];                
            }
        }
        selected_t.push(divlist[blxl]); //此处不能添加 if (blfound)，会忽略 blfound true 之前的元素 - 保留注释
    }
    if (blfound){
        divlist=[].concat(selected_t);
    }

    divlist=klsofts_ingore_php_b(divlist,ignore_php,do_sort);    
    
    if (is_local_file && !location.href.includes('/klapps.htm')){
        divlist.push(['javascript:klsofts_config_b();','config','⚙','0']);
    }

    if (cstype=='all' || cstype==''){
        var recent_list=klsofts_recent_b();
        var recent_find=[];
        for (let item of recent_list){
            for (let arow of divlist){
                if (arow[0]==item){
                    recent_find.push([].concat(arow));  //不含concat则会修改divlist的元素值 - 保留注释
                }
            }
        }
        for (let blxl=0;blxl<recent_find.length;blxl++){
            recent_find[blxl][3]='-1';
        }
        
        divlist=recent_find.concat(divlist);
        return divlist;
    }
    
    selected_t=[];
    if (cstype.match(/^\d+$/g)!==null){
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

function klsofts_recent_b(cshref=''){
    if (typeof cshref == 'object'){
        try {
            if (cshref.tagName.toLowerCase()=='a'){
                cshref=decodeURIComponent(cshref.href);
            }
            else {return;}
        }
        catch (error){
            alert(error);
            return;
        }
    }
    
    var blmax=klsofts_cols_count_b();
    if (cshref==''){
        return local_storage_get_b('recent_click_app',blmax,true,'',false);
    }
    var list_t=local_storage_get_b('recent_click_app',blmax,true,cshref,false);
    list_t=[cshref].concat(list_t);
    localStorage.setItem('recent_click_app',list_t.join('\n'));
}

function klsofts_import_b(){    //针对 firefox 读取 file:///****.htm 时不同路径下，localStorage 不共享的问题 - 保留注释
    var otextarea=document.querySelector('#div_top_bottom_menu textarea');
    if (!otextarea){return;}
    var blstr=otextarea.value.trim();
    var bllen=blstr.length;
    if (bllen==0){
        if (confirm('是否清空？')==false){return;}
        else {
            localStorage.removeItem('common_softs');
        }
    }
    else {
        if (confirm('是否导入('+bllen+')？')==false){return;}
        localStorage.setItem('common_softs',blstr);
    }
    location.reload();    
}

function klsofts_config_b(){
    var odiv=document.getElementById('div_top_bottom_menu');
    if (!odiv){return;}
    var bljg='<textarea style="width:90%;">'+local_storage_get_b('common_softs')+'</textarea>\n';
    bljg=bljg+'<p style="font-size:0.9rem;"><span class="aclick" onclick="klsofts_import_b();">import</span></p>\n';
    odiv.innerHTML=bljg;
}

function klsofts_is_local_p(){
    var ops = document.querySelectorAll('div.div_klsofts_one p'); 
    var list_t=Array.from(ops).filter(one_p => one_p.innerText=='remote'); 
    return (list_t.length==1?false:true);
}

function klsofts_popup_b(event=false,odom=false,csstr='',fontsize=1){
    var ogrand=false;
    var blfound=false;
    if (odom!==false){
        if (odom.parentNode){
            ogrand=odom.parentNode.parentNode;
            if (ogrand){
                var blid=ogrand.getAttribute('id');
                if (blid){
                    if (blid=='div_top_bottom_menu'){
                        blfound=true;
                    }
                }
            }
        }
    }

    var is_local=klsofts_is_local_p();
    var list_t=klsofts_list_b(csstr,[],true,is_local);
    for (let blxl=0;blxl<list_t.length;blxl++){
        list_t[blxl]=klsofts_one_b(list_t[blxl],fontsize,false,'','',(blfound?' target=_blank':''));
    }
        
    var odiv=popup_event_div_b(event,'div_common_softs',list_t.join(' '),'top_right','',1,'',scheme_global['button']);   //依赖klase_css.js - 保留注释
    if (odiv && blfound){
        var blrect1=ogrand.getBoundingClientRect();
        var blrect2=odiv.getBoundingClientRect();
        odiv.style.top=(blrect1.top+blrect1.height/2-blrect2.height/2)+'px';
        odiv.style.position='fixed';
        if (ogrand.parentNode){
            var zindex=parseInt(ogrand.parentNode.style.zIndex || '0');
            odiv.style.zIndex=zindex+1;
        }
    }
    klsofts_recent_b('popup:'+csstr);    
    klsofts_local_or_remote_b(is_local,true);
}

function klsofts_local_or_remote_b(is_local,only_popup=false){
    var local_str=klwebphp_path_b();    //仅考虑当前host为 file 或 127.0.0.1 - 保留注释
    var local_len=local_str.length;
    
    var remote_str=location_host_b(true);
    if (remote_str==''){
        remote_str=local_str;
    }
    else {
        remote_str=remote_str+'/klwebphp/';
    }

    var remote_len=remote_str.length;

    if (only_popup){
        var oas=document.querySelectorAll('div#div_common_softs div.div_klsofts_one a');    
    }
    else {
        var oas=document.querySelectorAll('div.div_klsofts_one a');
    }
    
    for (let one_a of oas){
        var blhref=one_a.href;
        if (!blhref){continue;}
        if (!is_local && blhref.substring(0,local_len)==local_str){
            blhref=blhref.replace(local_str,remote_str);
            one_a.setAttribute('href',blhref);
        }
        else if (is_local && blhref.substring(0,remote_len)==remote_str){
            blhref=blhref.replace(remote_str,local_str);
            one_a.setAttribute('href',blhref);
        }
    }
}

function klsofts_one_b(csitem,fontsize=2.5,addp=true,cshref='',jsstr='',new_tab=' target=_blank',popup_fsize=false){
    if (csitem.length<4){
        return '';
    }
    if (fontsize.toString().slice(-3,)!=='rem'){
        fontsize=fontsize+'rem';
    }
    
    if (popup_fsize==false){
        popup_fsize=fontsize;
    }
    
    if (csitem[0].substring(0,6)=='popup:'){
        var bltmp=specialstr_j(csitem[0]);
        csitem[0]='javascript:klsofts_popup_b(event,this,\''+specialstr_j(csitem[0].substring(6,).trim())+'\','+parseFloat(popup_fsize.toString().split('rem')[0])+');';
    }
    
    var is_js=(csitem[0].substring(0,11)=='javascript:');
    
    var bljg='<div class="div_klsofts_one" style="font-size:'+fontsize+';">';
    if (is_js){
        bljg=bljg+'<span class="span_box" style="';    
    }
    else {
        bljg=bljg+'<a style="text-decoration:none;';
    }
    
    if (addp){
        bljg=bljg+(csitem[0].slice(-1)=='/'?'color:green;':'color:black;')+'" ';
    }
    else {
        bljg=bljg+'color:black;" onmouseover="this.style.backgroundColor=\'white\';"  onmouseout="this.style.backgroundColor=\'\';" ';
    }

    if (is_js){
        if (jsstr.substring(0,' onclick="'.length)==' onclick="'){
            bljg=bljg+' onclick="'+csitem[0]+jsstr.substring(' onclick="'.length,)+'>';    
        }
        else {
            bljg=bljg+' onclick="'+csitem[0]+'"'+jsstr+'>';    
        }
    }
    else {
        bljg=bljg+' href="'+(csitem[0].substring(0,4)=='http' || csitem[0].substring(0,5)=='file:'?'':cshref)+csitem[0]+'"'+jsstr+(addp?'':new_tab)+'>';
    }
    
    if (csitem[2]!==''){
        if (csitem[2].includes('.')){
            bljg=bljg+'<img src="'+csitem[2]+'" style="max-width:'+fontsize+';max-height:'+fontsize+';" />';
        }
        else {
            bljg=bljg+csitem[2];
        }
        if (addp){
            var blname=csitem[1];
            blname=blname.replace(new RegExp(/([^\s]{4,}) ([^\s]{3,})/,'g'),'$1<br />$2');
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
    
    bljg=bljg+(is_js?'</span>':'</a>');
    bljg=bljg+'</div> ';
    return bljg;
}

function klsofts_routines_random_b(){
    var items=new Set(local_storage_get_b('list_routines',-1,false).replace(/^.*?\s(.*?)\s(.*)$/mg,'$1 /// $2').split('\n'));  //去掉前面的 id - 保留注释
    if (items.size==0){return '';}
    
    var list_t=new Set(local_storage_list_in_one_day_b('klsofts_routines'));
    items=array_difference_b(items,list_t,true);
    if (items.size==0){return '';}
    
    items=Array.from(items);
    items.sort(randomsort_b);
    
    var blat=items[0].indexOf(' /// ');
    var blcategory='(<span class="span_category">'+items[0].substring(0,blat)+'</span>)';
    var blname=items[0].substring(blat+5,);
    if (blname.length>15){
        return blcategory+'<span class="span_todolist_name" title="'+specialstr_j(blname)+'">'+blname.substring(0,15)+'...</span>';
    }
    else {
        return blcategory+'<span class="span_todolist_name">'+blname+'</span>';    
    }
}

function klsofts_routines_ignore_or_done_b(ospan){
    var blcategory=ospan.querySelector('span.span_category').innerText;
    var oname=ospan.querySelector('span.span_todolist_name');
    var blname=oname.getAttribute('title');
    if (!blname){
        blname=oname.innerText;
    }
    
    var list_t=local_storage_list_in_one_day_b('klsofts_routines');
    list_t.push(blcategory +' /// '+ blname);
    localStorage.setItem('klsofts_routines',list_t.join('\n'));
    var new_item=klsofts_routines_random_b();
    if (new_item==''){
        ospan.parentNode.outerHTML='';
    }
    else {
        ospan.innerHTML='♾ '+new_item;
    }
}

function klsofts_div_b(divid,font_size,padding=0,autoclose=true){
    var blhref=klwebphp_path_b();
    if (blhref===false){
        blhref='';
    }
    
    var soft_str='<div id="'+divid+'" style="display:none;font-weight:normal;padding:'+padding+'rem;">';
    var head_part='{{selenium_news}}/html/klapps.htm,KL Apps,klapps512.png,0';
    var soft_list=klsofts_list_b('0',[head_part]);
    
    var bltodolist=klsofts_routines_random_b();
    if (bltodolist!==''){
        soft_list.push(['javascript:klsofts_routines_ignore_or_done_b(this)',bltodolist,'♾',0]);
    }
    
    if (autoclose){
        var jsstr=' onclick="popup_show_hide_b(\''+divid+'\');"'
    }
    else {
        var jsstr='';
    }
    for (let item of soft_list){
        if (item[0].substring(0,11)=='javascript:' || item[0].substring(0,6)=='popup:'){
            soft_str=soft_str+klsofts_one_b(item,font_size,false,blhref,'');    
        }
        else {
            soft_str=soft_str+klsofts_one_b(item,font_size,false,blhref,jsstr);            
        }
    }
    soft_str=soft_str+'</div>';
    return soft_str;
}

function canvas2img_b(ocanvas,cstype='jpeg'){
    if (cstype=='png'){
        return ocanvas.toDataURL('image/png');
    }
    else {
        return ocanvas.toDataURL('image/jpeg');
    }   
}

function read_txt_file_b(fullname){
    var allText='';
    var rawFile = new XMLHttpRequest(); //不支持 file:// - 保留注释
    rawFile.open('GET', fullname, false);
    rawFile.onreadystatechange = function (){
        if (rawFile.readyState === 4){
            if (rawFile.status === 200 || rawFile.status == 0){
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

function fetch_file_data_b(cshttp,odom,cstype=''){
    fetch(cshttp)
    .then(respone => respone.blob())    // 将响应体转换成blob格式数据
    .then(blob => {
        let reader = new FileReader(); 
        reader.onloadend = function(){
            switch (cstype){
                case '':
                    console.log(reader.result);
                    break;
                case 'value':
                    odom.value=reader.result;
                    break;
                case 'innerHTML':
                    odom.innerHTML=reader.result;
                    break;
                case 'innerText':
                    odom.innerText=reader.result;
                    break;
                default:    //attribute:
                    odom.setAttribute(cstype,reader.result);
                    break;
            }
        };
        reader.readAsDataURL(blob);     // 将blob数据转换成DataURL数据
    })
    //.catch((err) => {alert(err);});    //此行调试用 - 此行保留
    .catch(console.error);
}

function array_2_li_b(csarray,row_type='li',container_type='ol',container_id='',row_classname='',row_style=''){ //olli - 保留注释
    row_classname=(row_classname==''?'':' class="'+row_classname+'"');
    row_style=(row_style==''?'':' style="'+row_style+'"');

    var row_html_start='<'+row_type+row_classname+row_style+'>';
    var row_html_end='</'+row_type+'>';
    var bljg=row_html_start+csarray.join(row_html_end+row_html_start)+row_html_end;
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

function dom_value_2_txt_file_b(csid,savename='',csext='txt'){
    var odom=document.getElementById(csid);
    if (!odom){return;}
    if (savename==''){
        savename='save_'+today_str_b('dt','','','_')+'.'+csext;
    }
    string_2_txt_file_b(odom.value,savename,csext);
}

function table_2_csv_b(table_querystring,colno_list=[]){
    var otable=document.querySelector(table_querystring);
    if (!otable){return;}
    var otrs=otable.querySelectorAll('tr');
    var result_t=[];
    for (let one_tr of otrs){
        var arow=[];
        var otds=one_tr.querySelectorAll('th,td');
        for (let blxl=0;blxl<otds.length;blxl++){
            if (colno_list.length>0 && !colno_list.includes(blxl)){continue;}
            var one_td=otds[blxl];
            var blvalue=one_td.innerText.trim();
            if (blvalue=='' || isNaN(blvalue)){
                arow.push('"'+specialstr_j(blvalue)+'"');
            }
            else {
                arow.push(blvalue);
            }
        }
        result_t.push(arow.join(','));
    }
    string_2_txt_file_b(result_t.join('\n'),'table2csv_export'+'.csv','csv');
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
    if (csarray==null){return [];}
    var result_t=[];
    for (let item of csarray){
        if (result_t['a'+item]==undefined){
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

function file_path_name_b(csfilename=''){
    //['/media/temp/', '论反对日本帝国主义的策略', 'js', '论反对日本帝国主义的策略.js'] - 保留注释
    var blat=Math.max(csfilename.lastIndexOf('/'),csfilename.lastIndexOf('\\'));
    var blpath='';
    var fullname=csfilename;
    if (blat>=0){
        blpath=csfilename.substring(0,blat+1);
        fullname=csfilename.substring(blat+1,);
    }
    
    blat=fullname.lastIndexOf('.');
    var basename=fullname;
    var blext='';
    if (blat>=0){
        basename=fullname.substring(0,blat);    //不含. - 保留注释
        blext=fullname.substring(blat+1,);
    }    
   
    return [blpath, basename, blext, fullname];
}

function local_storage_2_array_b(idname,elements_count=-1,do_join_sort=false,join_list_as_id=false,filter_str=''){
    //支持以---分隔的行 - 保留注释
    if (typeof idname == 'string'){
        var items=('\n'+local_storage_get_b(idname,-1,false)).split('\n---\n');
    }
    else if (Array.isArray(idname)){
        var items=idname;
    }
    else {
        return [false,'type error'];
    }
    
    var ids=new Set();
    var result_t=[];
    
    var is_reg=false;
    [filter_str,is_reg]=str_reg_check_b(filter_str);
    
    for (let one_item of items){
        var list_t=one_item.trim().split('\n');
        var bllen=list_t.length;
        if (elements_count>0 && bllen<elements_count){continue;}
        
        if (join_list_as_id===false){
            if (ids.has(list_t[0])){
                return [false,list_t[0]];
            }
            ids.add(list_t[0]);        
        }
        else {
            if (ids.has(list_t.join(join_list_as_id))){
                return [false,list_t.join(join_list_as_id)];
            }
            ids.add(list_t.join(join_list_as_id));                
        }
        
        if (filter_str!==''){
            var blfound=str_reg_search_b(list_t,filter_str,is_reg);
            if (blfound===-1){
                return [false,'reg error'];
            }
            if (!blfound){continue;}
        }
        result_t.push(list_t);
    }
    
    if (do_join_sort){
        result_t.sort(function (a,b){return a.join()>b.join();});
    }
    
    return [true,result_t];
}

function array_2_local_storage_b(idname,csarray){    
    var bljg='';
    for (let one_row of csarray){
        bljg=bljg+'---\n';
        for (let one_col of one_row){
            bljg=bljg+one_col+'\n';
        }
    }
    bljg=bljg.trim();
    if (idname!==''){
        localStorage.setItem(idname,bljg);
    }
    return bljg;
}

function wiki_link_punctuation_b(csstr){
    csstr=csstr.replace(/&amp;/g,'.26');
    csstr=csstr.replace(/&/g,'.26');
    csstr=csstr.replace(/'/g,'.27');
    csstr=csstr.replace(/=/g,'.3D');
    csstr=csstr.replace(/\?/g,'.3F');
    csstr=csstr.replace(/~/g,'.7E');
    csstr=csstr.replace(/!/g,'.21');
    csstr=csstr.replace(/,/g,'.2C');
    csstr=csstr.replace(/\(/g,'.28');
    csstr=csstr.replace(/\)/g,'.29');
    csstr=csstr.replace(/\$/g,'.24');
    csstr=csstr.replace(/\//g,'.2F');

    csstr=csstr.replace(/\s+/g,'_'); //合并多个空格 - 保留注释
    
    return encodeURI(csstr);
}

function temp_save_local_b(local_id,csmax,blvalue=[],do_add=false,do_save=false){
    var split_str='\n-----\n';
    var old_str=localStorage.getItem(local_id) || '';    //需要保留空格，而 local_storage_get_b 会删除空格 - 保留注释
    if (old_str==''){
        var old_list=[];
    }
    else {
        var old_list=old_str.split(split_str).slice(0,csmax);
    }
    
    if (typeof blvalue == 'string'){
        blvalue=blvalue.split(split_str);
    }
    for (let item of blvalue){
        if (item==''){continue;}
        var blat=old_list.indexOf(item);
        if (blat>=0){
            old_list.splice(blat,1);
        }
    }
    
    if (do_add){
        old_list=blvalue.concat(old_list);
    }
    
    if (do_save){
        localStorage.setItem(local_id,old_list.join(split_str));
    }
    return old_list;
}

function temp_save_table_b(cstype='',local_id,read_textarea_id,div_id,csmax=20,paste_textarea_id=''){
    var blstr='';
    if (cstype=='write'){
        var otextarea=document.getElementById(read_textarea_id);
        blstr=otextarea.value;
    }

    var old_list=temp_save_local_b(local_id,csmax,blstr,(cstype=='write'),(cstype=='write'));
    if (old_list.length==0){return;}
    
    if (paste_textarea_id==''){
        paste_textarea_id=read_textarea_id;
    }
    //read
    var rndint=parseInt(Math.random()*1000000);
    var line_total_count=0;
    var length_total_count=0;
    for (let blxl=0;blxl<old_list.length;blxl++){
        var line_count=old_list[blxl].split('\n').length;
        var length_count=old_list[blxl].length;
        line_total_count=line_total_count+line_count;
        length_total_count=length_total_count+length_count;
        
        var right_buttons='<p>'+line_count+'/'+length_count+'</p>';
        right_buttons=right_buttons+'<p>';
        right_buttons=right_buttons+'<span class="span_box" onclick=" temp_save_copy_b(this.parentNode.parentNode,\''+paste_textarea_id+'\');">copy</span> ';
        right_buttons=right_buttons+'<span class="span_box" onclick=" temp_save_del_b(this.parentNode.parentNode,\''+local_id+'\','+csmax+');">del</span>';
        right_buttons=right_buttons+'</p>';
        old_list[blxl]='<tr><td width=1 nowrap>'+(blxl+1)+'</td><td><textarea class="textarea_temp_save_content" style="width:100%;">'+old_list[blxl]+'</textarea></td><td nowrap align=right style="color:'+scheme_global['memo']+';">'+right_buttons+'</td></tr>';
    }
    
    var bottom_buttons='';
    if (old_list.length>1){
        bottom_buttons=bottom_buttons+'\n<tr><td colspan=3 align=right style="color:'+scheme_global['memo']+';font-weight:bold;">'; 
        bottom_buttons=bottom_buttons+line_total_count+'/'+length_total_count+' ';
        bottom_buttons=bottom_buttons+'<span class="span_box" onclick=" temp_save_merge_b(\''+paste_textarea_id+'\',\''+local_id+'\','+csmax+');">merge all</span> ';
        bottom_buttons=bottom_buttons+'<span class="span_box" onclick=" temp_save_empty_b(\'table_temp_save_'+rndint+'\',\''+local_id+'\','+csmax+');">delete all</span>';
        bottom_buttons=bottom_buttons+'</td></tr>\n';
    }
    
    document.getElementById(div_id).innerHTML='<table id="table_temp_save_'+rndint+'" class="table_common" width=90%>'+old_list.join('\n')+bottom_buttons+'</table>';  
}

function temp_save_empty_b(table_id,local_id,csmax){
    var old_list=temp_save_local_b(local_id,csmax,'',false,false);
    var rndstr=randstr_b(4,true,false);
    if ((prompt('输入 '+rndstr+' 确认全部清除'+old_list.length+'条记录') || '').trim()==rndstr){    
        localStorage.setItem(local_id,'');
        var otable=document.getElementById(table_id);
        if (otable){
            otable.innerHTML='';    //保留table本身 - 保留注释
        }
    }
}

function temp_save_merge_b(textarea_id,local_id,csmax){
    var otextarea=document.getElementById(textarea_id);
    if (!otextarea){return;}
    var old_list=temp_save_local_b(local_id,csmax,'',false,false);
    var delimiter=prompt('合并'+old_list.length+'条记录到编辑框，输入间隔标记','\\n-----\\n');
    if (delimiter==null){return;}
    delimiter=delimiter.replace(new RegExp(/(\\n)/,'g'),'\n');
        
    otextarea.value=old_list.join(delimiter);
    otextarea.scrollIntoView();
}

function temp_save_copy_b(otd,textarea_id){
    var ocontent=otd.parentNode.querySelector('textarea.textarea_temp_save_content');
    if (!ocontent){return;}

    var otextarea=document.getElementById(textarea_id);
    if (!otextarea){return;}
    var blstr=ocontent.value;
    if (confirm('是否粘贴：\n'+(blstr.length>100?blstr.slice(0,100)+'...':blstr))){
        otextarea.value=blstr;
        otextarea.scrollIntoView();
    }
}

function temp_save_del_b(otd,local_id,csmax){
    var ocontent=otd.parentNode.querySelector('textarea.textarea_temp_save_content');
    if (!ocontent){return;}
    
    var blstr=ocontent.value;
    if (confirm('是否删除：\n'+(blstr.length>100?blstr.slice(0,100)+'...':blstr))){
        otd.parentNode.outerHTML='';
        temp_save_local_b(local_id,csmax,blstr,false,true);
    }
}

function quote_or_fav_b(){
    if (typeof klquotes_global == 'undefined'){
        klquotes_global=[];
    }
    if (typeof bible_fav_global == 'undefined'){
        bible_fav_global=[];
    }
    
    klquotes_global.sort(randomsort_b);
    klquotes_global.push('');
    bible_fav_global.sort(randomsort_b);
    bible_fav_global.push('');
    
    if (klquotes_global[0]==''){
        return bible_fav_global[0];
    }
    return (Math.random()>0.5?bible_fav_global[0]:klquotes_global[0]);
}

function js_alert_b(csstr,id='',duration=5000){
    if (id===''){
        alert(csstr);
    }
    else {
        document.getElementById(id).innerHTML=new Date().toLocaleTimeString()+' '+csstr;
        setTimeout(function(){document.getElementById(id).innerHTML='';},duration);
    }
}

function fun_2_string_b(cslist,add_js=false){
    var result_t=[];
    for (let item of cslist){
        item=item.trim();
        if (item==''){continue;}
        
        item=item+'.toString()';
        try {
            var blstr=eval(item);
            result_t.push(blstr);
        }
        catch (err){
            alert(err.message);
            break;
        }        
    }
    if (add_js){
        return '<script>\n'+result_t.join('\n\n')+'\n</script>';
    }
    else {
        return result_t.join('\n\n');
    }
}

function standalone_search_funs_b(cstitle='Search Standalone',cscontent='',diy_fn_list=[],add_li=true,csth=''){
    function search_standalone(cskey=false){
        data_current_standalone_global=[];    //全局变量 - 保留注释
        if (cskey==false){
            cskey=document.getElementById('input_search').value;
        }
        var is_reg=false;
        [cskey,is_reg]=str_reg_check_b(cskey,is_reg);
        if (cskey=='' || ['.','.*'].includes(cskey) && is_reg){
            data_current_standalone_global=false;  //无关键词时直接调用不显示行号 - 保留注释
        }
        else{
            for (let blxl=0;blxl<data_raw_standalone_global.length;blxl++){
                var item=data_raw_standalone_global[blxl];
                var blfound=str_reg_search_b(item,cskey,true);
                if (blfound===-1){break;}
                if (blfound){
                    data_current_standalone_global.push([item,blxl+1]);
                }
            }
        }
        page_standalone(1);
    }
    
    function type_standalone(){
        type_standalone_global='';  //全局变量 - 保留注释
        if (data_raw_standalone_global.length>0 && !add_li_standalone_global){        
            if (data_raw_standalone_global[0].slice(-5,)=='</tr>'){
                type_standalone_global='tr';
            }          
            else if (data_raw_standalone_global[0].slice(-5,)=='</li>'){
                type_standalone_global='li';
            }            
        }   
    }
    
    function page_standalone(csno,rows_per_page=100,row_index=-1){
        if (data_current_standalone_global===false){
            var cslen=data_raw_standalone_global.length;
        }
        else {
            var cslen=data_current_standalone_global.length;
        }
        var bljg=page_combination_b(cslen,rows_per_page,csno,'page_standalone','locate_standalone');
        //-------------
        var result_t=[];
        var blend=Math.min(csno-1+rows_per_page,cslen);
        var blno=0;
        if (data_current_standalone_global===false){
            for (let blxl=csno-1;blxl<blend;blxl++){
                result_t.push(data_raw_standalone_global[blxl]);
            }        
        }
        else {            
            for (let blxl=csno-1;blxl<blend;blxl++){
                switch (type_standalone_global){
                    case '':
                        result_t.push(data_current_standalone_global[blxl][0]+' <span class="span_row_no_standalone" onclick="jump_standalone('+data_current_standalone_global[blxl][1]+','+rows_per_page+');">('+data_current_standalone_global[blxl][1]+')</span>');
                        break;
                    case 'tr':
                        result_t.push(data_current_standalone_global[blxl][0].slice(0,-5)+'<td><span class="span_row_no_standalone" onclick="jump_standalone('+data_current_standalone_global[blxl][1]+','+rows_per_page+');">('+data_current_standalone_global[blxl][1]+')</span></td></tr>');
                        break;                    
                    case 'li':
                        result_t.push(data_current_standalone_global[blxl][0].slice(0,-5)+' <span class="span_row_no_standalone" onclick="jump_standalone('+data_current_standalone_global[blxl][1]+','+rows_per_page+');">('+data_current_standalone_global[blxl][1]+')</span></li>');
                        break;
                }
            }
        }
        if (result_t.length==0){
            document.getElementById('divhtml').innerHTML='';
        }
        else {
            var odiv=document.getElementById('divhtml');
            if (add_li_standalone_global){
                odiv.innerHTML=bljg+'<ol id="ol_result_standalone">\n<li>'+result_t.join('</li>\n<li>')+'</li>\n</ol>'+bljg;
            }
            else {
                if (type_standalone_global=='tr'){
                    odiv.innerHTML=bljg+'<table class="table_common" id="ol_result_standalone">'+table_th_global+result_t.join('\n')+'</table>\n'+bljg;
                }          
                else {
                    odiv.innerHTML=bljg+'<ol id="ol_result_standalone">\n'+result_t.join('\n')+'\n</ol>'+bljg;
                }
            }
            
            mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
            highlight_standalone();
            
            var jumped=false;
            if (row_index>=1 && row_index<=rows_per_page){
                if (type_standalone_global=='tr'){
                    var olis=document.querySelectorAll('table#ol_result_standalone tr');
                    if (table_th_global!==''){
                        olis=olis.slice(1,);
                    }
                }
                else {
                    var olis=document.querySelectorAll('ol#ol_result_standalone li');
                }
                if (olis.length>=row_index){
                    olis[row_index-1].scrollIntoView();
                    jumped=true;
                }
            }
            
            if (jumped==false){
                location.href='#top';
            }
        }
    }
    
    function locate_standalone(pages,rows_per_page){
        var blno=page_location_b(pages);
        if (blno!==false){
            page_standalone((blno-1)*rows_per_page+1,rows_per_page);
        }
    }
    
    function jump_standalone(csno,rows_per_page){
        data_current_standalone_global=false;
        var pageno=Math.ceil(csno/rows_per_page);
        var row_index=csno%rows_per_page;
        if (row_index==0){
            row_index=rows_per_page;
        }
        page_standalone((pageno-1)*rows_per_page+1,rows_per_page,row_index);
    }
    
    function highlight_standalone(){
        var cskeys=document.getElementById('input_search').value.replace(new RegExp(/[\+\s\|\^\$]/,'g'),' ').trim().split(' ');
        cskeys=Array.from(new Set(cskeys));
        
        var is_ok;
        if (type_standalone_global=='tr'){
            var olis=document.querySelectorAll('table#ol_result_standalone td');
        }
        else {
            var olis=document.querySelectorAll('ol#ol_result_standalone li');
        }
        for (let one_li of olis){
            for (let blxl=0;blxl<cskeys.length;blxl++){
                var one_key=cskeys[blxl];
                is_ok=highlight_obj_b(one_li,one_key,'<span style="background-color:'+highlight_color_b(blxl)+';">'+one_key+'</span>');
                if (is_ok===-1){break;} 
            }
        }
    }
    //----------------------
    var fns=['ismobile_b','css_root_style_b','css_root_size_b','str_reg_search_b','str_reg_check_b','page_one_b','page_prev_next_b','page_location_b','page_remove_dot_b','page_combination_b','mouseover_mouseout_oblong_span_b','highlight_obj_b','highlight_oblong_span_b','highlight_color_b'];
    fns=fns.concat(diy_fn_list);
    
    var scheme_list=[];
    for (let key in scheme_global){
        scheme_list.push('"'+specialstr_j(key)+'": "'+specialstr_j(scheme_global[key])+'",');
    }
    var blcontent=`<!DOCTYPE html>
<html>
<head>`
+'<title>🔎 '+cstitle+'</title>'
+`<meta charset="UTF-8" />
<script>
`+fun_2_string_b(fns)+'\n\n'+search_standalone.toString()+'\n\n'+page_standalone.toString()+'\n\n'+locate_standalone.toString()+'\n\n'+highlight_standalone.toString()+'\n\n'+jump_standalone.toString()+type_standalone.toString()
+`
</script>
<script>
`+'var add_li_standalone_global='+add_li+';\nvar table_th_global="'+specialstr_j(csth)+'"'+`
scheme_global={
`
+scheme_list.join('\n')
+`
};
css_root_style_b(18,13,['base'],[],3,0);
</script>
<style>
ol#ol_result_standalone li{margin-bottom:0.5rem;}
ol#ol_result_standalone li:hover {background-color: #E9EEF2;}
span.span_row_no_standalone{font-size:0.8rem;color:grey;font-style:italic;cursor:pointer;}
</style>
<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
</head>
<body style="margin:0.5rem;">
<a name=top></a>
`
+'<h2>🔎 '+cstitle+'</h2>'
+`
<p><input type="text" id="input_search" placeholder="search" onkeyup="if (event.key=='Enter'){search_standalone();}" style="width:90%;" /></p>
<div id="divhtml"></div>
<script>
var data_raw_standalone_global=[
`
+cscontent
+`
];
type_standalone();
search_standalone();
</script>
</body>
</html>    
`
    string_2_txt_file_b(blcontent,cstitle+'.htm','htm');
}

function fun_soruce_show_b(csid){
    var otextarea=document.getElementById(csid);
    if (!otextarea){return;}
    var fn_names=prompt('输入function 名称，以英文逗号间隔');
    if (fn_names==null){return;}
    fn_names=fn_names.trim().split(',');
    var blstr=fun_2_string_b(fn_names);
    if (blstr!==''){
        otextarea.value=blstr;
    }
}

function dom_insert_str_b(odom,str1,str2,check_selected=false){
    var st=odom.selectionStart;
    var ed=odom.selectionEnd;
    if (check_selected && st==ed){return;}
    
    var blvalue=odom.value;
    odom.value=blvalue.substring(0,st)+str1+blvalue.substring(st,ed)+str2+blvalue.substring(ed,);    
}

function textarea_shift_b(idname1,idname2){
    var otextarea1=document.getElementById(idname1);
    var otextarea2=document.getElementById(idname2);
    var blstr1=otextarea1.value;
    var blstr2=otextarea2.value;
    otextarea1.value=blstr2;
    otextarea2.value=blstr1;
}

function str2num_range_b(csstr,csstep=1,maxlen=-1){ //numinrange。csstep仅对-有效 - 保留注释
    var result_t=new Set();
    var list_t=csstr.trim().split(',');
    for (let item of list_t){
        var blat=item.lastIndexOf('-');
        if (blat>0){   //非负数 - 保留注释
            var blmin=parseInt(item.substring(0,blat).trim());
            var blmax=parseInt(item.substring(blat+1,).trim());
            if (isNaN(blmin) || isNaN(blmax)){continue;}
            if (blmin>blmax){continue;}
            for (let blxl=blmin;blxl<=blmax;blxl=blxl+csstep){
                result_t.add(blxl);
                if (maxlen>0 && result_t.size>=maxlen){break;}
            }
        }
        else {
            item=parseInt(item);
            if (isNaN(item)){continue;}
            result_t.add(item);
        }
    }
    return result_t;
}

function date_rows_tr_generate_b(csname,max_rows=40,cssquash=false,fraction_len=0,delimiter='/',value_col=1,date_min=false,date_max=false,max_lines=false,add_today=false){
    if (cssquash==false){
        cssquash=[15,0,0.5]; //保留前15天 - 保留注释
    }
    
    if (Array.isArray(csname)){
        var list_t=csname;
        if (list_t.length>=max_rows){
            list_t=local_storage_squash_b(false,list_t,cssquash[0],cssquash[1],cssquash[2]);
        }
    }
    else {
        var list_t=local_storage_get_b(csname,-1,true);
        if (list_t.length>=max_rows){
            local_storage_squash_b(csname,list_t,cssquash[0],cssquash[1],cssquash[2]);
            list_t=local_storage_get_b(csname,-1,true);
        }
    }

    var date_list=[];    
    var tr_list=[];
    var flot_list=[];
    list_t.sort();
    if (add_today){
        var bltoday=today_str_b();
        if (list_t.length>0){
            var last_item=list_t.slice(-1,)[0].split(delimiter);
            if (last_item[0]<bltoday){
                list_t.push([bltoday].concat(last_item.slice(1,)).join(delimiter));
            }
        }
    }
    list_t=lines_range_b(list_t,date_min,date_max);
    if (max_lines!==false){
        list_t=list_t.slice(0,max_lines);
    }
    
    var old_value=false;
    for (let item of list_t){
        var day_count=item.split(delimiter);
        if (day_count.length<value_col+1){continue;}
        var blweek='('+day_2_week_b(day_count[0],'cnbrief')+')';    //klbase_date.js - 保留注释
        if (blweek=='(日)'){
            blweek='<span style="color:'+scheme_global['a-hover']+';">'+blweek+'</span>';
        }
        var blstr='<tr>';
        blstr=blstr+'<td style="padding:0.2rem;" nowrap>'+day_count[0]+' '+blweek+'</td>';
        blstr=blstr+'<td align=right style="padding:0.2rem;" nowrap>'+day_count[value_col]+'</td>';
        blstr=blstr+'<td align=right style="padding:0.2rem;" nowrap>'+(old_value==false?'':(day_count[value_col]-old_value).toFixed(fraction_len))+'</td>';
        blstr=blstr+'</tr>';

        date_list.push([day_count[0],day_count[value_col],(old_value==false?'':day_count[value_col]-old_value)]);
        tr_list.push(blstr);
        flot_list.push([new Date(day_count[0]),parseFloat(day_count[value_col])]);
        
        old_value=day_count[value_col];
    }
    
    tr_list.reverse();
    date_list.reverse();
    flot_list.sort(function (a,b){return a[0]>b[0];});
    
    //date_list 每个元素形如：[ "2022-09-29", "561", 0 ] 第3个元素是增量 - 保留注释
    //tr_list 每个元素形如："<tr><td style=\"padding:0.2rem;\" nowrap>2022-09-29 (四)</td><td align=right style=\"padding:0.2rem;\" nowrap>561</td><td align=right style=\"padding:0.2rem;\" nowrap>0</td></tr>" - 保留注释
    //flot_list 每个元素形如：[ Date Tue Dec 10 2019 08:00:00 GMT+0800 (China Standard Time), 345 ] - 保留注释
    return [date_list,tr_list,flot_list];
}

function load_fn_b(fn_name,csmax,cswait,run_fn_onsuccess){
    function sub_load_fn_b_wait(){
        blxl=blxl+1;
        if (eval('typeof '+fn_name) == 'function'){
            console.log('发现 '+fn_name+' ，扫描次数：'+blxl);       
            run_fn_onsuccess();
        }
        else {
            if (blxl>=csmax){
                console.log('未发现 '+fn_name+' ，扫描次数：'+blxl);
                return;
            }
            setTimeout(sub_load_fn_b_wait,cswait);
        }
    }
    //-------------------
    if (csmax==-1){
        csmax=(is_local_b()?20:50);    
    }
    var blxl=0;
    setTimeout(sub_load_fn_b_wait,cswait);
}

function load_var_b(var_name,csmax,cswait,run_fn){
    function sub_load_var_b_wait(){
        blxl=blxl+1;
        
        if (eval('typeof '+var_name) !== 'undefined'){
            console.log('发现 '+var_name+' ，扫描次数：'+blxl);       
            run_fn(true);     
        }
        else {
            if (blxl>=csmax){
                console.log('未发现 '+var_name+' ，扫描次数：'+blxl);
                run_fn(false);
                return;
            }
            setTimeout(sub_load_var_b_wait,cswait);
        }
    }
    //-------------------
    if (csmax==-1){
        csmax=(is_local_b()?20:50);    
    }
    var blxl=0;
    setTimeout(sub_load_var_b_wait,cswait);
}

function common_search_b(cskey,isreg,csarray,csmax=-1){
    var is_all_result=true;
    var result_t=[];
    var blcount=0;
    if (cskey==''){
        for (let blxl=0;blxl<csarray.length;blxl++){
            result_t.push([csarray[blxl],blxl+1]);  
            blcount=blcount+1;
            if (csmax>0 && blcount>=csmax){break;}            
        }
    }
    else {
        for (let blxl=0;blxl<csarray.length;blxl++){
            var item=csarray[blxl];
            var blfound=str_reg_search_b(item,cskey,isreg);
            if (blfound==-1){break;}
            
            if (blfound){
                result_t.push([item,blxl+1]);
                blcount=blcount+1;
                if (csmax>0 && blcount>=csmax){break;}                
            }
            else {
                is_all_result=false;            
            }
        }
    }
    return [result_t,is_all_result];
}

function result_percent_b(id_str,len1,len2,fraction=2){
    document.getElementById(id_str).innerHTML='('+len1+'/'+len2+'/'+(100*len1/len2).toFixed(fraction)+'%)';
}

function checkbox_value_get_b(csid,default_value=false){
    var ocheck=document.getElementById(csid);
    return (ocheck?ocheck.checked:default_value);
}

function multiyear_average_growth_rate_b(first_year,first_value,last_year,last_value){
    var bldivide=last_value/first_value;
    if (bldivide>=0){
        return blpow=Math.pow(bldivide,1/(last_year-first_year))-1;
    }
    return false;
}

function window_is_closed_b(owindow,wait_times,csmax=10){
    if (wait_times>csmax){
        console.log(new Date().toLocaleString(), '强制关闭窗口，等待次数',wait_times);
        owindow.close();
    }
    
    if (owindow===false || owindow.closed){
        return [true,wait_times];
    }
    else {
        wait_times=wait_times+1;
        return [false,wait_times];
    }    
}

function copy_2_clipboard_b(csstr){
    var otextarea=document.createElement('textarea');
    otextarea.value=csstr;
    document.body.appendChild(otextarea);
    otextarea.select();
    document.execCommand('copy');
    otextarea.parentNode.removeChild(otextarea);
}

function split_dom_vertical_or_horizontal_b(odom,cscount,split_type){
    var rect=odom.getBoundingClientRect();

    var odiv_splits=document.querySelectorAll('div.div_split_dom_vertical_or_horizontal_b');
    for (let item of odiv_splits){
        item.parentNode.removeChild(item);
    }
   
    var split_len=(split_type=='rows'?rect.height:rect.width);
    
    var split_list=[];
    for (let blxl=0;blxl<cscount;blxl++){
        split_list.push(split_len*blxl/cscount);
    }
    
    for (let blxl=0;blxl<split_list.length;blxl++){        
        var odiv_split=document.createElement('div');
        document.body.appendChild(odiv_split);
        odiv_split.style.cssText='position:absolute;';
        odiv_split.classList.add('div_split_dom_vertical_or_horizontal_b');

        if (split_type=='rows'){
            odiv_split.style.left=rect.left+'px';
            odiv_split.style.width=rect.width+'px';  
            odiv_split.style.height=rect.height/split_list.length+'px';
            odiv_split.style.top=split_list[blxl]+'px';
        }
        else {
            odiv_split.style.top=rect.top+'px';
            odiv_split.style.height=rect.height+'px';  
            odiv_split.style.width=rect.width/split_list.length+'px';
            odiv_split.style.left=split_list[blxl]+'px';
        }
        odiv_split.setAttribute('ondblclick',"this.outerHTML='';");
    }
}

function split_table_by_rows_or_cols_b(otrs,cscount,cstype='rows',rect_table=false){
    var split_len=otrs.length;
    if (split_len==0){return [];}

    var split_list=[];
    if (cstype=='rows'){
        for (let blxl=0;blxl<cscount;blxl++){
            var blvalue=Math.round(split_len*blxl/cscount);
            if (blvalue>=0 && blvalue<=split_len-1){
                var rect_tr=otrs[blvalue].getBoundingClientRect();   
                blvalue=rect_tr.top;
            }
            else {
                console.log('error:',blvalue);
            }
            split_list.push(blvalue);
        }
    }
    else {
        var otds=otrs[0].querySelectorAll('th,td');
        split_len=otds.length;
        if (split_len==0){return [];}
        
        for (let blxl=0;blxl<cscount;blxl++){
            var blvalue=Math.round(split_len*blxl/cscount);
            if (blvalue>=0 && blvalue<=split_len-1){
                var rect_td=otds[blvalue].getBoundingClientRect();   
                blvalue=rect_td.left;
            }
            else {
                console.log('error:',blvalue);
            }
            split_list.push(blvalue);
        }
    }
    
    if (rect_table===false){
        return split_list;
    }

    var odiv_splits=document.querySelectorAll('div.div_split_dom_vertical_or_horizontal_b');
    for (let item of odiv_splits){
        item.parentNode.removeChild(item);
    }
    
    for (let blxl=0;blxl<split_list.length;blxl++){
        var odiv_split=document.createElement('div');
        document.body.appendChild(odiv_split);
        odiv_split.classList.add('div_split_dom_vertical_or_horizontal_b');
        odiv_split.style.cssText='position:absolute;';
        
        if (cstype=='rows'){
            odiv_split.style.left=rect_table.left+'px';
            odiv_split.style.top=split_list[blxl]+'px';        
            odiv_split.style.width=rect_table.width+'px';
        
            if (blxl<split_list.length-1){
                odiv_split.style.height=(split_list[blxl+1]-split_list[blxl])+'px';
            }
            else {
                odiv_split.style.height=(rect_table.top+rect_table.height-split_list[blxl])+'px';
            }
        }
        else {
            odiv_split.style.top=rect_table.top+'px';
            odiv_split.style.left=split_list[blxl]+'px';        
            odiv_split.style.height=rect_table.height+'px';
        
            if (blxl<split_list.length-1){
                odiv_split.style.width=(split_list[blxl+1]-split_list[blxl])+'px';
            }
            else {
                odiv_split.style.width=(rect_table.left+rect_table.width-split_list[blxl])+'px';
            }
        }
        odiv_split.setAttribute('ondblclick',"this.outerHTML='';");
    }
    return split_list;    
}

function percent_calculation_b(starting_value,final_value,current_value){
    var blcount=final_value-starting_value;
    if (blcount==0){return false;}
    var blcurrent=current_value-starting_value;

    return Math.abs(blcurrent/blcount);
}

function array_check_b(cslist){
    if (typeof cslist == 'string'){
        cslist=cslist.split('\n');
    }
    var current='';
    try {
        for (let arow of cslist){
            current=arow;
            eval('['+arow+']');
        }
    }
    catch (error){
        return current;
    }
    return '';
}

function list_category_count_b(cslist,return_dict=false){
    var key_dict={};
    for (let item of cslist){
        var blkey='k_'+item;
        if (key_dict[blkey]==undefined){
            key_dict[blkey]=0;
        }
        key_dict[blkey]=key_dict[blkey]+1;
    }
    if (return_dict){
        return key_dict;
    }
    return object2array_b(key_dict,true,2);
}
