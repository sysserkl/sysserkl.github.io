function ismobile_b(getstr=false,check_arm=false){
    var usera=navigator.userAgent.toLowerCase();
    if (usera.includes('android') || usera.includes('mobile') || check_arm && usera.includes('linux arm')){
        if (getstr){
            return 'mobile';
        } else {return true;}
    }
    if (getstr){
        return 'pc';
    } else {return false;}
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
    } else {return false;}
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
            if (reactive_date!=='' && day_str<=reactive_date){return false;}
        }
    }
    var blstr=navigator.userAgent;
    if (exclude_win && blstr.includes('Windows')){return false;}
    
    var machine_name=local_storage_get_b('machine_name');
    
    return  machine_name.match(/(\b|_|[0-9])firefox(\b|_|[0-9])/) || blstr.match(/Firefox\/\d{3,}\.\d+$/g)!==null || blstr.match(/Firefox\/[69]\d\.\d+$/g)!==null;  //不能使用[_\b]。60+ 或 90+ 或 100+ - 保留注释
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
    } else if (klbase_path.includes('/klwebphp_backup/')){
        return klbase_path.split('/klwebphp_backup/')[0]+'/klwebphp_backup/'+subdir_or_file;
    } else if (local_storage_get_b('use_klwebphp_path').trim()=='1' && (klbase_path+'/_').match(/:\d+\//)!==null){
        return '/'+subdir_or_file;
    } else if (klbase_path.includes('/wp_remote/')){
        return '../'+subdir_or_file;
    }
    
    var wikipath=is_wiki_path_b();
    if (wikipath!==''){
        return wikipath+'/klwebphp/'+subdir_or_file;
    } else {
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
    } else {
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
    } else {
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
        } else {
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
    //-----------------------
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
        for (let blxl=0,lent=csline.length;blxl<lent;blxl++){
            csline[blxl]=sub_path_conert_b_one(csline[blxl]);
        }
        return csline;
    } else {
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
    
function klbase_addons_import_js_b(klbase_list=[],module_list=[],jsdata_list=[],same_dir_file_list=[],import_jquery=false,do_write=true,only_file=false,major_current_dir=false,minor_current_dir=false){
    var klbase_path, sele_path;
    if (major_current_dir){
        klbase_path='./';
        sele_path='.';
    } else {
        [klbase_path,sele_path]=klbase_sele_path_b();
    }
    
    if (minor_current_dir){
        var module_path='./';
        var jsdata_path='./';
    } else {
        var module_path=sele_path+'/module/';
        var jsdata_path=sele_path+'/jsdata/';
    }
    
    var result_t=[[],[],[],[]];
    if (import_jquery){
        result_t[0].push(['js',module_path+'jquery.js','']);  //jquery 首先载入 - 保留注释
    }   

    var defer_str;
    klbase_list.sort(); //仅 klbase_list 执行 sort - 保留注释
    for (let item of klbase_list){
        [item,defer_str]=js_file_import_defer_b(item);
        result_t[0].push(['js',klbase_path+'klbase_'+item+'.js',defer_str]);
    }

    for (let item of module_list){
        [item,defer_str]=js_file_import_defer_b(item);
        if (item.slice(-3,)=='.js'){
            result_t[1].push(['js',module_path+item,defer_str]);
        } else if (item.slice(-4,)=='.css'){
            result_t[1].push(['css',module_path+item,'']);
        }        
    }

    for (let item of jsdata_list){
        [item,defer_str]=js_file_import_defer_b(item);
        if (item.slice(-3,)=='.js'){
            result_t[2].push(['js',jsdata_path+item,defer_str]);
        }    
    }
    
    if (major_current_dir){
        var same_dir='./';   
    } else {
        var same_dir=location_href_b();
    }
    
    for (let item of same_dir_file_list){
        [item,defer_str]=js_file_import_defer_b(item);
        if (item.match(/^https?:\/\//i)){
            if (item.slice(-3,)=='.js'){
                result_t[3].push(['js',item,defer_str]);
            } else if (item.slice(-4,)=='.css'){
                result_t[3].push(['css',item,'']);
            } else if (item.slice(-4,)=='.png'){
                result_t[3].push(['png',item,'']);
            }
        } else {
            if (item.slice(-3,)=='.js'){
                result_t[3].push(['js',same_dir+item,defer_str]);
            } else if (item.slice(-4,)=='.css'){
                result_t[3].push(['css',same_dir+item,'']);
            } else if (item.slice(-4,)=='.png'){
                result_t[3].push(['png',same_dir+item,'']);
            }
        }
    }
    
    if (do_write){
        for (let item of result_t){
            if (item.length==0){continue;}
            write_js_css_b(item);
        }
    }
    
    var bljg=result_t[0].concat(result_t[1]).concat(result_t[2]).concat(result_t[3]);
    if (only_file){
        for (let blxl=0,lent=bljg.length;blxl<lent;blxl++){
            bljg[blxl]=bljg[blxl][1];
        }
    }
    return bljg;
}

function file_date_parameter_b(){
    return is_local_b()?'?'+today_str_b('d','')+local_storage_get_b('file_date_paramter'):'';
}

function write_js_css_b(cslist,do_write=true){
    //元素形如：[ "js", "http://127.0.0.1/klwebphp/klbase_css.js", "" ] - 保留注释
    var links_t=[];
    var today=file_date_parameter_b();
    
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

function test_load_b(){
    var flist=klbase_addons_import_js_b(['test'],[],[],[],false,false);
    file_dom_create_b(flist);
}

function quote_load_b(csfn=false,do_echo=true,direct_from_bigfile=false){
    var fname='quote'+date_2_ymd_b(false,'m')+'_data.js';
    var flist=klbase_addons_import_js_b([],[],['bible_quote/'+fname],[],false,false);    
    load_js_var_file_b('quote31_global',flist,fname,csfn,do_echo,direct_from_bigfile);
}

function quote_attribute_b(csid){
    var do_confuse=klmenu_check_b(csid,false) && typeof quote31_global !== 'undefined';
    var quote_len=-1;
    if (do_confuse){
        quote31_global.sort(randomsort_b);
        quote_len=quote31_global.length;
    }
    return [do_confuse,quote_len];
}

function file_dom_create_b(file_list,in_head=true,cstype='js'){
    var today=file_date_parameter_b();

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
            } else {
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
        } else {
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
            } else {
		        list_t.push([].concat(cs_object_array[key])); //如果是数组直接添加会建立关联，所以需要concat - 保留注释
            }
        } else {
            if (add_key){
                list_t.push([key.substring(prefix_remove_len,),cs_object_array[key]]);            
            } else {        
                list_t.push(cs_object_array[key]);
            }
        }
	}
    return list_t;
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
            } else {
                o_div.parentNode.insertBefore(o_new, o_div);
            }
            return o_new;
        }
    } else {
        var o_new = document.createElement(cstype);
        o_new.style.cssText=csstyle;
        if (csafter){
            o_div.parentNode.insertBefore(o_new, o_div.nextSibling);
        } else {
            o_div.parentNode.insertBefore(o_new, o_div);
        }
        return o_new;
    }
    return false;
}

function list_join_2_reg_style_b(cslist,add_quote=true){
    var blstr=cslist.join('|').trim().replace(/\s/g,'\\s');
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
    //-----------------------
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
                } else {
                    blfound=true;
                } 
			} else if (word_t.substring(0,1)=='-'){
                var blfound2=sub_str_reg_search_b_normal(csinput,word_t.substring(1,));
                if (blfound2==true){
                    blfound=false;
                    break;
                } else {
                    blfound=true;
                }
			} else {
                var blfound2=sub_str_reg_search_b_normal(csinput,word_t);
                if (blfound2==true){
                    blfound=true;
                }
			}
		} else {
			try {
				if (word_t.substring(0,1)=='+'){
                    var blfound2=sub_str_reg_search_b_re(csinput,word_t.substring(1,));
                    if (blfound2==false){
                        blfound=false;
                        break;
                    } else {
                        blfound=true;
                    } 
				} else if (word_t.substring(0,1)=='-'){
                    var blfound2=sub_str_reg_search_b_re(csinput,word_t.substring(1,));
                    if (blfound2==true){
                        blfound=false;
                        break;
                    } else {
                        blfound=true;
                    } 
				} else {
                    var blfound2=sub_str_reg_search_b_re(csinput,word_t);
                    if (blfound2==true){
                        blfound=true;
                    }
				}
			} catch (error){
				alert(word_t+' '+error.message);
				return -1;
			}
		}
	}
	return blfound;
}

function str_reg_check_b(cskey,is_reg=false,do_trim=true,cstype='(:r)'){
    var bllen=cstype.length*-1;
    if (cskey.slice(bllen,)==cstype){
        is_reg=true;
        cskey=cskey.slice(0,bllen);
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
            } else {
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
        } else {
            if (array2desc){
                return b[arrayno2]-a[arrayno2];
            } else {
                return a[arrayno2]-b[arrayno2];
            }
        }
    }
    function sub_sort_by_date_b_sort_array(a,b,arrayno2){
        if (arrayno2>=0){
            if (a[arrayno]==b[arrayno]){
                return false;
            } else {
                return new Date(a[arrayno])-new Date(b[arrayno]);
            }
        } else {
            return new Date(a[arrayno])-new Date(b[arrayno]);
        }
    }
    //---
    if (arrayno<0){
        if (csdesc){
            return new Date(b)-new Date(a);
        } else {
            return new Date(a)-new Date(b);
        }
    } else {
        if (csdesc){
            var blvalue=sub_sort_by_date_b_sort_array(b,a,arrayno2);
        } else {
            var blvalue=sub_sort_by_date_b_sort_array(a,b,arrayno2);
        }
        if (blvalue==false){
            return sub_sort_by_date_b_sort_string(a,b,arrayno2,array2desc,cszh);
        } else {
            return blvalue;
        }
    }
}

function zh_sort_b(a, b, csdesc=false, arrayno=-1){
    //英文在前，中文在后 - 保留注释
    if (arrayno<0){
        if (a.toString().substring(0,1).match(/[^\x00-\xff]/g)==null || b.toString().substring(0,1).match(/[^\x00-\xff]/g)==null){
            if (csdesc){
                return b>a ? 1 : -1;
            } else {
                return a>b ? 1 : -1;
            }
        } else {
            if (csdesc){
                return b.localeCompare(a,'zh-CN', { sensitivity: 'accent' });   //{ sensitivity: 'accent' } 参数确保了比较时考虑到重音等细节，以实现更准确的排序 - 保留注释
            } else {
                return a.localeCompare(b,'zh-CN', { sensitivity: 'accent' });
            }
        }
    } else {
        if (a[arrayno].toString().substring(0,1).match(/[^\x00-\xff]/g)==null || b[arrayno].toString().substring(0,1).match(/[^\x00-\xff]/g)==null){
            if (csdesc){
                return b[arrayno]>a[arrayno] ? 1 : -1;
            } else {
                return a[arrayno]>b[arrayno] ? 1 : -1;
            }        
        } else {
            if (csdesc){
                return b[arrayno].localeCompare(a[arrayno],'zh-CN', { sensitivity: 'accent' });
            } else {
                return a[arrayno].localeCompare(b[arrayno],'zh-CN', { sensitivity: 'accent' });
            }
        }
    }
}

function radio_value_get_b(radio_name){
	var odomes = document.getElementsByName(radio_name);
    if (odomes.length==0){return '-1';}

    var cstype_t='0';
    for (let one_dom of odomes){
        if (one_dom.checked){
            cstype_t=one_dom.value;
            break;
        }
    }
    return cstype_t;
}

function radio_value_set_b(radio_name,csvalue){
    var blfound=false;
	var elements = document.getElementsByName(radio_name);
    for (let item of elements){
        if (item.value==csvalue){
            blfound=true;
        }
        item.checked=(item.value==csvalue); //选中指定 value 的 input，其他的 input 不选中 - 保留注释
    }
    //radio_name, csvalue, blfound 分别可能是：radio_type sha512 true - 保留注释
    return blfound;
}

function specialstr_j(csstr,ignore_single_quote=false){
    //var www='"do\\gl\\\\h\'ello';
    var bljg=csstr.toString().replace(/\\/g,'\\\\');
    bljg=bljg.replace(new RegExp('"','g'),'\\"');
    if (ignore_single_quote==false){
        bljg=bljg.replace(new RegExp("'",'g'),"\\'");
    }
    return bljg;
}

function specialstr_lt_gt_j(csstr,csand=false){
    //var www='"do\\gl\\\\h\'ello';
    csstr=csstr.toString();
    if (csand){
        csstr=csstr.replace(/&/g,'&amp;');
    }
    csstr=csstr.replace(/</g,'&lt;');
    csstr=csstr.replace(/>/g,'&gt;');
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
    if (cshref.includes('#')){
        var cshref=cshref.substring(0,cshref.indexOf('#'));
    }
    if (cshref.includes('?')){
        cshref=cshref.substring(cshref.indexOf('?')+1);
    } else {
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
    var bljg=csstr.toString().replace(/\\/g,'&#92;');
    bljg=bljg.replace(new RegExp('"',"g"),'&quot;');
    bljg=bljg.replace(new RegExp("'","g"),"&#39;");
    return bljg;
}

function quote_2_cn_character_b(csstr,change_2_one_line=' '){
    if (typeof change_2_one_line == 'string'){
        csstr=csstr.replace(/\r?\n/g,change_2_one_line);
    }
    return csstr.replace(new RegExp("'",'g'),'’').replace(new RegExp('"','g'),'”').replace(/\\/g,'＼').replace(/</g,'＜').replace(/>/g,'＞');
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
        if (bidirectional){
            var en_intersection1 = new Set([...array1].filter(x => !array2.has(x)));
            var en_intersection2 = new Set([...array2].filter(x => !array1.has(x)));
            return [en_intersection1,en_intersection2];
        } else {
            return new Set([...array1].filter(x => !array2.has(x)));
        }
    }
    //---
    var en_source1 = new Set(array1);
    var en_source2 = new Set(array2);
    var en_intersection1 = new Set([...en_source1].filter(x => !en_source2.has(x)));

    if (bidirectional){
        var en_intersection2 = new Set([...en_source2].filter(x => !en_source1.has(x)));
        return [Array.from(en_intersection1),Array.from(en_intersection2)];
    } else {
        return Array.from(en_intersection1);
    }
}

function array_union_b(array1,array2,isset=false,do_console=false){
    //并集
    if (isset){
        result_t=new Set([...array1, ...array2]);
        if (do_console){
            console.log(array1.size,array2.size,result_t.size);
        }
        return result_t;
    }
        
    var en_source1 = new Set(array1);
    var en_source2 = new Set(array2);
    var en_union = new Set([...en_source1, ...en_source2]);
    
    if (do_console){
        console.log('arr1: ',array1.length,en_source1.size,'arr2:',array2.length,en_source2.size,'union:',en_union.size);
    }
    
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
    } else {
       var head=''
    }
    return head+str_t.split('/')[0].trim();    
}

function href2date_b(cshref){
    return (cshref.match(/\b\d{4}[\/\-_]\d{1,2}[\/\-_]\d{1,2}\b/) || [''])[0];    //添加 href 中的 年月日 日期，不支持 /17-Jul-2024/ - 保留注释
}

function local_storage_key_name_list_b(){
    var result_t=Object.keys(localStorage);
    result_t.sort();
    return result_t;
}

function local_storage_key_length_b(key_list,is_reverse=true){
    var blcontent=[];
    var total_len=0;
    var key_list_len=key_list.length;
    for (let blxl = 0,lent= localStorage.length; blxl <lent; blxl++){
        if (key_list_len>0 && !key_list.includes(localStorage.key(blxl))){continue;}
        var bllen=localStorage.getItem(localStorage.key(blxl)).length;
        blcontent.push([localStorage.key(blxl),bllen]);
        total_len=total_len+bllen;
    }
    
    blcontent.sort();
    if (is_reverse){
        blcontent.sort(function (a,b){return a[1]<b[1] ? 1 : -1;});
    } else {
        blcontent.sort(function (a,b){return a[1]>b[1] ? 1 : -1;});
    }
    
    for (let blxl=0,lent=blcontent.length;blxl<lent;blxl++){
        blcontent[blxl].push((blcontent[blxl][1]*100/total_len).toFixed(2)+'%');
    }
    return [blcontent,total_len];
}

function local_storage_all_b(cstype='',key_list=[],add_delimiter=true){
    if (cstype=='name'){    //不考虑 key_list - 保留注释
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
    for (let blxl = 0,lent= localStorage.length; blxl <lent; blxl++){
        var keyname=localStorage.key(blxl);
        if (key_list_len>0 && !key_list.includes(keyname)){continue;}

        var blstr=keyname+'\n'+localStorage.getItem(keyname)+'\n';
        if (blstr.includes('== 分隔行 ') && blstr.includes(' ==')){    //以此减少 blcontent 的长度 - 保留注释
            blcontent=blcontent+blstr;
        }
    }
    
    if (add_delimiter){
        var affix=(cstype=='brief'?'--':'==');
        var separation=affix+' 分隔行 '+parseInt(Math.random()*9999999)+' '+affix+'\n';
        while (true){
            if (blcontent.includes(separation)){
                separation=affix+' 分隔行 '+parseInt(Math.random()*9999999)+' '+affix+'\n';
            } else {break;}
        }
    } else {
        separation='';
    }

    blcontent='';
    //---

    var bljg=[];
    var bllen=0;
    var blstr='';
    var is_ok=false;
    var list_t;
    for (let blxl = 0,lent= localStorage.length; blxl <lent; blxl++){
        var keyname=localStorage.key(blxl);
        if (key_list_len>0 && !key_list.includes(keyname)){continue;}

        var line_count=0;
        if (keyname == 'list_long_term_plans'){
            line_count=7;
        } else if (keyname =='list_klmemo'){
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
        } else {
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
    } else {
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
    } else if (csmin!==false){
        for (let item of cslist){
            if (item>=csmin){
                result_t.push(item);
            }
        }
    } else {
        for (let item of cslist){
            if (item<=csmax){
                result_t.push(item);
            }
        }
    }
    return result_t;
}

function local_storage_list_split_b(csid,csmax=-1,row_delimiter=',',min_cols=-1,max_cols=-1){
    var result_t=[];
    var list_t=local_storage_get_b(csid,csmax,true);
    for (let arow of list_t){
        arow=arow.split(row_delimiter);
        if (min_cols>0 && arow.length<min_cols){continue;}
        if (max_cols>0 && arow.length>max_cols){continue;}
        result_t.push(arow);
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
                    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
                        if (list_t[blxl].match(item)==null){continue;}
                        list_t.splice(blxl,1);
                        blfound=true;
                        break;
                    }
                    
                    if (blfound==false){break;}
                }            
            } catch (error){return;}
        } else {
            while (true){
                var blat=list_t.indexOf(item);
                if (blat>=0){
                    list_t.splice(blat,1);
                } else {break;}
            }
        }
    }
    //-----------------------
    var bljg=localStorage.getItem(csid) || '';
    while (bljg.includes('\n\n')){
        bljg=bljg.replace(/\n\n/g,'\n');
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
        } else {
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

function local_storage_today_b(csid,csmax=-1,csnewcontent='',cssplit='',squash=[],cstype='d',add_mode=false){
    if (csnewcontent==''){return;}
    if (squash.length==3){  //否则不执行压缩，仅截取 - 保留注释
        var list_t=local_storage_get_b(csid,-1,true);
        if (list_t.length>csmax*0.9){
            local_storage_squash_b(csid,list_t,squash[0],squash[1],squash[2]);
        }
    }
    var list_t=local_storage_get_b(csid,csmax,true);

    var remove_xl_list=[];
    if (cssplit!=='' && list_t.length>=1+3){
        for (let blxl=1,lent=list_t.length-2;blxl<lent;blxl++){
            var right_part_0=list_t[blxl].substring(list_t[blxl].indexOf(cssplit),);
            var right_part_1=list_t[blxl+1].substring(list_t[blxl+1].indexOf(cssplit),);
            var right_part_2=list_t[blxl+2].substring(list_t[blxl+2].indexOf(cssplit),);
            if (right_part_0==right_part_1 && right_part_1==right_part_2){
                remove_xl_list.push(blxl+1);
            }
        }
    }

    var today=today_str_b(cstype);
    var bljg='';
    var old_value=0;
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        //去除连续3行值相同的行中的倒数第2行 - 保留注释
        if (remove_xl_list.includes(blxl)){continue;}
            
        var item=list_t[blxl];
        //忽略日期相同的行 - 保留注释
        if (item.match('^'+today+cssplit)!==null){
            if (add_mode){
                old_value=parseFloat(item.replace(today+cssplit,'').trim());
                if (isNaN(old_value)){
                    old_value=0;
                }
            }
            continue;
        }
        bljg=bljg+item+'\n';
    }
    
    bljg=bljg.trim();

    if (add_mode){
        csnewcontent=parseFloat(csnewcontent);
        if (isNaN(csnewcontent)){
            csnewcontent=0;
        }        
        csnewcontent=csnewcontent+old_value;
    }
    
    csnewcontent=csnewcontent+'';
    if (csnewcontent.slice(-1)!=='\n'){
        csnewcontent=csnewcontent+'\n';
    }
    var result_t=today+cssplit+csnewcontent;
    localStorage.setItem(csid,result_t+bljg);
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
            } else {
                blcount=0;
            }
        }
    }
    localStorage.setItem('track_source_count_per_day',daystr+'\n'+(blcount+1));
    document.write('\n<ifra'+'me src="ht'+'tps:\/\/gla'+'cial-re'+'treat-38'+'863'+'.'+'her'+'oku'+'ap'+'p.c'+'om\/pg?key='+specialstr_html_b(cskey)+'" style="display:none;"><\/ifra'+'me>\n');
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

function reverse_str_b(csstr){
    return csstr.split('').reverse().join('');
}

function service_worker_unregister_b(appname){
    function sub_service_worker_unregister_b_scan(registrations){
        var blfound=false;
        for (let one_registration of registrations){
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
    }
    //-----------------------
    var fname=appname+'_service_worker.js';
    if (window.navigator && navigator.serviceWorker){
        navigator.serviceWorker.getRegistrations().then(sub_service_worker_unregister_b_scan);
    }
}

function service_worker_delete_b(appname='',file_key='',confirm_str='是否更新版本？',show_type='',show_id='',check_remote=true){
    function sub_service_worker_delete_b_message(current_str){
        console.log(current_str);
        show_str=show_str+current_str+delimiter;
        message_show_b(show_str,show_type,show_id,'',0,false);    
    }
    
    function sub_service_worker_delete_b_one_file(request, index, array, one_key, cache, csxl){
        if (file_key==''){
            if (csxl % 100 == 0){
                var current_str=key_no+'.'+csxl+' '+one_key+' delete'+del_caption+' url: '+array[index]['url'];
                sub_service_worker_delete_b_message(current_str);
            }
            if (!is_dry_run){
                cache.delete(request);
            }
            csxl=csxl+1;
        } else if (array[index]['url'].includes(file_key)){
            var current_str=key_no+'.'+csxl+' '+one_key+' delete'+del_caption+' url: '+array[index]['url'];
            sub_service_worker_delete_b_message(current_str);
            if (!is_dry_run){
                cache.delete(request);         
            }
            csxl=csxl+1;
        }
        return csxl;
    }
    
    function sub_service_worker_delete_b_one_key(){
        if (key_no>=key_len){
            if (!is_all && file_key==''){   //在删除app后，再删除base - 保留注释
                service_worker_delete_b('','base','是否清理base函数？',show_type,show_id,false);
            }
            return;
        }
        
        var one_key=key_list[key_no];
        key_no=key_no+1;
        
        var is_match=(is_all || one_key==keyname || one_key.substring(0,keyname.length+2)==keyname+'_v');
        if (!is_match){
            setTimeout(sub_service_worker_delete_b_one_key,10);
            return;
        }
        
        caches.open(one_key).then(function(cache){
            cache.keys().then(function(keys){
                var blxl=1;
                keys.forEach(function (request, index, array){
                    blxl=sub_service_worker_delete_b_one_file(request, index, array,one_key,cache,blxl);
                });
                
                if (file_key==''){
                    if (!is_dry_run){
                        caches.delete(one_key);
                    }
                    var current_str='caches.delete'+del_caption+' '+one_key;
                    sub_service_worker_delete_b_message(current_str);
          
                    appname=one_key.replace(/^pwa_(.*?)_store.*$/g,'$1');
                    service_worker_unregister_b(appname);
                }
                setTimeout(sub_service_worker_delete_b_one_key,10);
            });
        });
    }
    //-----------------------
    console.log('service_worker_delete_b() 参数：',appname,file_key,confirm_str,show_type,show_id,check_remote);
    if (confirm_str=='DRY'){
        var is_dry_run=true;
        var del_caption='(DRY)';
    } else {
        var is_dry_run=false;
        var del_caption='';
    }

    var is_all=(appname=='');
    var keyname='pwa_'+appname+'_store'; //keyname 支持如 pwa_xxx_store_v任意字符 - 保留注释

    var show_str='';
    var delimiter=(show_type=='value'?'\n':'<br />');
    
    var key_len=0;
    var key_no=0;
    var key_list=[];

    if (!is_dry_run){
        if (confirm_str!==''){
            if (!confirm(confirm_str)){return;}
        }
        if (check_remote){
            remote_server_check_b(function (is_ok=true){
                console.log(is_ok);
                if (is_ok){
                    console.log(appname,file_key,'',show_type,show_id);
                    service_worker_delete_b(appname,file_key,'',show_type,show_id,false);
                } else {
                    alert('未能连接到远程服务器，取消更新');
                    return;
                }
            });
            return;
        }
    }
    
    console.log('service_worker_delete_b()',typeof remote_server_check_global);

    caches.keys().then(function(cskeys){
        key_list=cskeys;
        key_len=key_list.length;
        sub_service_worker_delete_b_one_key();
    });   
}

function remote_server_check_b(csfn){
    function sub_remote_server_check_b_one_file(request, index, array, one_key, cache, csxl){
        if (array[index]['url'].includes('remote_server_check_data.js')){
            var current_str=key_no+'.'+csxl+' '+one_key+' delete url: '+array[index]['url'];

            console.log(current_str);
            show_str=show_str+current_str+'<br />';
            message_show_b(show_str,'','','',0,false);    
        
            cache.delete(request);
            csxl=csxl+1;
        }
        return csxl;
    }
    
    function sub_remote_server_check_b_one_key(){
        if (key_no>=key_len){
            var file_list=klbase_addons_import_js_b([],[],['remote_server_check_data.js'],[],false,false);
            load_js_var_file_b('remote_server_check_global',file_list,'remote_server_check_data.js',csfn,true,false);
            return;
        }
        
        var one_key=key_list[key_no];
        key_no=key_no+1;

        caches.open(one_key).then(function(cache){
            cache.keys().then(function(keys){
                var blxl=1;
                keys.forEach(function (request, index, array){
                    blxl=sub_remote_server_check_b_one_file(request, index, array,one_key,cache,blxl);
                });

                setTimeout(sub_remote_server_check_b_one_key,10);
            });
        });
    }
    //-----------------------
    var show_str='';
    var key_len=0;
    var key_no=0;
    var key_list=[];
    
    remote_server_check_global=undefined;
    console.log('remote_server_check_b()',typeof remote_server_check_global);
    
    caches.keys().then(function(cskeys){
        key_list=cskeys;
        key_len=key_list.length;
        sub_remote_server_check_b_one_key();
    });    
}

function pwa_clear_cache_all_b(){
    if (confirm('是否清空全部 PWA Cache？')==false){return;}
    service_worker_delete_b('','','');
}

function pwa_register_b(jsfile,cscaption,csid,cstype,autohide=-1){
    //Register service worker to control making site work offline
    var check_is_local=(local_storage_get_b('enable_local_pwa_register')!=='1'?true:false);
    
    if ((!check_is_local || !is_local_b()) && 'serviceWorker' in navigator){
        navigator.serviceWorker.register(jsfile).then(function(){
            message_show_b(cscaption+' Service Worker Registered',cstype,csid,scheme_global['a'],autohide);
        });
    } else {
        message_show_b(cscaption+' Service Worker not work',cstype,csid,scheme_global['color'],autohide);
    }
}

function message_show_b(csstr,cstype,csid='',cscolor='',autohide=0,show_in_console=true){
    function sub_message_show_b_clear(){
        document.getElementById(csid).innerHTML='';
    }
    //-----------------------
    if (csid!==''){
        var odom=document.getElementById(csid);
        switch (cstype){
            case 'color':    
                odom.style.color=cscolor;
                break;
            case 'html':
                odom.innerHTML=csstr;
                if (autohide>0){
                    setTimeout(sub_message_show_b_clear,autohide);
                }
                break;
            case 'value':
                odom.value=csstr;         
                break;
        }
    }
    if (show_in_console){
        console.log(csstr);
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
        } else {
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

function kl_remote_host_address_b(new_address=null,do_ask=false,odom=false){
    var old_address=local_storage_get_b('kl_remote_host',-1,false);
    
    if (new_address===null){
        var bladdress=prompt('输入 form 发送远程服务器地址(形如：http://123.456.789.023)\n如只输入23，则自动补全为 http://192.168.0.23，\n未输入 http:// 则自动补全；如果输入如101-105，或192.168.1.101-105，或：192.168.1.101-192.168.1.105，则进行扫描处理',old_address);
    } else {
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
    
    if (odom!==false){
        var oa=odom.parentNode.querySelector('a.a_remote_host_address');
        if (oa){
            var list_t=oa.href.split('?');
            var cstype=(list_t.length==2?list_t[1]:'');
            var blhref,bltitle;
            [blhref,bltitle]=remote_host_link_generate_b(bladdress,cstype);
            oa.href=blhref;
            oa.innerHTML=bltitle;
            //-----------------------
            var oform=oa.parentNode.parentNode;
            if (oform && oform.tagName.toLowerCase()=='form'){
                blaction=oform.getAttribute('action');
                if (blaction){
                    oform.setAttribute('action',blaction.replace(/^.*\/\/.*?\//,bladdress+'/'));            
                }
            }
        }
        
        var oa2=odom.parentNode.querySelector('a.a_temp_txt_append');
        if (oa2){
            oa2.href=oa2.href.replace(/^.*\/\/.*?\//,bladdress+'/');
        }        
    }
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
    //-----------------------
    var t0 = performance.now();    
    var bllen=Math.min(256,csmax-csmin);
    var blxl=-1;
    you_found_me_global=undefined;
    sub_remote_ip_detector_b_one_step(false);
}

function textarea_with_form_generate_b(textarea_id,textarea_style='',left_strings='',common_buttons='',right_strings='',form_type='',form_name='',enable_copy=false,textarea_value='',button_first=false,button_style='',span_class='aclick',add_form=true,form_style=''){
    var bljg='';
    if (add_form){
        bljg=bljg+'<form method="POST" action="'+postpath_b()+'temp_txt_share.php'+(form_type==''?'':'?type='+form_type)+'"'+(form_name==''?'':' name="'+form_name+'"')+(form_style==''?'':' style="'+form_style+'"')+' target=_blank>\n';
    }
    
    var textarea_str='<textarea name="'+textarea_id+'" id="'+textarea_id+'" style="'+textarea_style+'"'+(enable_copy?' onclick="this.select();document.execCommand(\'copy\');"':'')+'>'+textarea_value+'</textarea>';
    
    var buttons_str=left_strings;
    buttons_str=buttons_str+textarea_buttons_b(textarea_id,common_buttons,form_type,button_style,span_class);
    buttons_str=buttons_str+right_strings;
    
    if (button_first){
        bljg=bljg+buttons_str+textarea_str;
    } else {
        bljg=bljg+textarea_str+buttons_str;
    }

    if (add_form){
        bljg=bljg+'</form>';
    }
    return bljg;
}

function local_storage_view_form_b(keytype='',csid=''){    
    var left_strings='<p>';
    left_strings=left_strings+'<span class="aclick" onclick="document.getElementById(\''+csid+'\').innerHTML=\'\';">Close</span> ';
    left_strings=left_strings+'<span class="aclick" onclick="local_storage_import_b(\'textarea_backup_localstorage\',true);">导入 localStorage</span> ';

    var blstr=textarea_with_form_generate_b('textarea_backup_localstorage','height:20rem;',left_strings,'清空,复制,发送到临时记事本,发送地址',right_strings,'','form_backup_localstorage');

    var right_strings='</p>';
    '</form>';
    var obj=document.getElementById(csid);
    if (obj){
        obj.innerHTML=blstr;
        obj.querySelector('#textarea_backup_localstorage').value=local_storage_all_b('',keytype)[0];
    }
}

function local_storage_import_b(textarea_id,sucess_alert=false){
    if (typeof textarea_id == 'string'){
        var otextarea=document.getElementById(textarea_id);
    } else {
        otextarea=textarea_id;
    }
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

function textarea_top_bottom_b(textareaId, csposition=0,csstart=0){
    var otextarea = document.getElementById(textareaId);
    var pos_start=0;
    var pos_end=-1;
    
    if (csstart===-1){
        csstart=otextarea.selectionEnd;
    }
    
    if (csstart>=otextarea.value.length){
        csstart=0;
    }
    
    if (csposition===0){    //必要判断 - 保留注释
        pos_start=0;
    } else if (csposition===1){
        pos_start=otextarea.value.length;
    } else {
        var blleft='';
        var blkey=csposition.toString();
        var blat = otextarea.value.indexOf(blkey,csstart);
        if (blat !== -1){
            pos_start=blat;
            pos_end=blat+blkey.length;
        }
    }
    
    if (pos_end===-1){
        pos_end=pos_start;
    }
    otextarea.focus();
    otextarea.setSelectionRange(pos_start, pos_end);
}

function textarea_buttons_b(textarea_id,csbuttons,cstype='',csstyle='',span_class='aclick'){
    //csstyle: ' style="font-size:1rem;"' - 保留注释
    var isfile=is_file_type_b();

    if (span_class=='button'){
        var button_left='<button type="button"'+csstyle;
        var button_right='</button> ';    
    } else {
        var button_left='<span class="'+span_class+'"'+csstyle;
        var button_right='</span> ';
    }
    
    var bljg='';
    if (csbuttons.includes('全选') || csbuttons.includes('select all')){
        bljg=bljg+button_left+' onclick="document.getElementById(\''+textarea_id+'\').select();">Select All'+button_right;
    }
    
    if (csbuttons.includes('clear textarea')){    
        bljg=bljg+button_left+' onclick="document.getElementById(\''+textarea_id+'\').value=\'\';">Clear textarea'+button_right;
    } else if (csbuttons.includes('清空') || csbuttons.includes('clear')){    
        bljg=bljg+button_left+' onclick="document.getElementById(\''+textarea_id+'\').value=\'\';">Clear'+button_right;
    }
    
    if (csbuttons.includes('复制') || csbuttons.includes('copy')){
        bljg=bljg+button_left+' onclick="document.getElementById(\''+textarea_id+'\').select();document.execCommand(\'copy\');">Copy'+button_right;
    }
    
    if (csbuttons.includes('↑')){
        bljg=bljg+button_left+' onclick="textarea_top_bottom_b(\''+textarea_id+'\',0);">⤴'+button_right;        
    }

    if (csbuttons.includes('↓')){
        bljg=bljg+button_left+' onclick="textarea_top_bottom_b(\''+textarea_id+'\',1);">⤵'+button_right;
    }
    
    var fext=csbuttons.match(/save as (.*?) file/);
    if (Array.isArray(fext) && fext.length==2){
        if (cstype==''){
            var savename='';
        } else {
            var web_type=(is_file_type_b()?'local':location.host);
            var savename=cstype+'_'+local_storage_get_b('machine_name')+'_'+(navigator.platform || '').replace(/\s/g,'_')+'_'+web_type+'_'+today_str_b('dt','','','_')+'.'+fext[1];
        }
        bljg=bljg+button_left+' onclick="dom_value_2_txt_file_b(\''+textarea_id+'\',\''+specialstr_j(savename)+'\',\''+specialstr_j(fext[1])+'\');">'+fext[0]+button_right;
    }    
    
    if (!isfile && csbuttons.includes('导入temp_txt_share')){
        bljg=bljg+button_left+' onclick="import_temp_txt_share_content_b(\''+textarea_id+'\');">导入temp_txt_share'+button_right;
    }
        
    if (csbuttons.includes('发送到临时记事本') || csbuttons.includes('send to remote temp memo')){
        bljg=bljg+'<input type="submit" value="📤"'+csstyle+' title="send to remote temp memo" /> ';
    }
    if (csbuttons.includes('打开临时记事本') || csbuttons.includes('open remote temp memo')){
        bljg=bljg+'<a'+csstyle+' href="'+postpath+'temp_txt_share.php'+(cstype==''?'':'?type='+cstype)+'" class="a_oblong_box" target=_blank>open remote temp memo('+remote_host.slice(-3,)+')</a> ';
    }
    if (csbuttons.includes('从 bigfile 导入文件内容') || csbuttons.includes('import file content from bigfile')){
        bljg=bljg+button_left+' onclick="import_bigfile_content_b(false,\''+textarea_id+'\');">从 bigfile 导入文件内容'+button_right;
    }
    
    var remote_host=local_storage_get_b('kl_remote_host',-1,false);
        
    if (csbuttons.includes('➕')){
        var bladdress=remote_host+'/klwebphp/temp_txt_append.php';
        bljg=bljg+'<a class="a_temp_txt_append '+span_class+'"'+csstyle+' href="'+bladdress+'" title="'+bladdress+'" target=_blank">➕</a> ';
    }
        
    if (csbuttons.includes('发送地址') || csbuttons.includes('set remote address')){
        var blhref,bltitle;
        [blhref,bltitle]=remote_host_link_generate_b(remote_host,cstype);
        bljg=bljg+button_left+' onclick="kl_remote_host_address_b(null,false,this);" title="set remote address">⛓'+button_right+'：<a'+csstyle+' href="'+blhref+'" class="a_remote_host_address" target=_blank>'+bltitle+'</a>';
    }
    
    return bljg;
}

function remote_host_link_generate_b(remote_host,cstype){
    var blhref=remote_host+'/klwebphp/temp_txt_share.php'+(cstype==''?'':'?type='+cstype);
    var bltitle=(remote_host.includes('//')?remote_host.split('//')[1]:remote_host)+' | temp_txt_share.php '+(cstype==''?'':' | '+cstype);
    return [blhref,bltitle];
}

function import_temp_txt_share_content_b(csid){
    if (!confirm('是否导入temp_text_share_data.txt内容？')){return;}
    var blstr=read_txt_file_b(klwebphp_path_b('/data/php_writable/temp_txt_share_data.txt'));
    document.getElementById(csid).value=blstr;  //不能使用 specialstr92_b(blstr) - 保留注释
}

function klsofts_cols_count_b(){
    return ismobile_b()?4:9;
}

function klsofts_ingore_php_b(divlist,ignore_php=false,do_sort=true){
    //divlist 元素形如：
    //[
    //"http://127.0.0.1/klwebphp/PythonTools/data/selenium_news/html/screen_matrix.htm",
    //"Matrix",
    //"http://127.0.0.1/klwebphp/PythonTools/data/selenium_news/html/screen_matrix_ico/screen_matrix256.png",
    //"2",
    //"PWA"
    //];

    if (do_sort){
        divlist.sort(function(a,b){
            if (a[3]=='-1'){return -1;}   //0不排序 - 保留注释        
            if (a[1]=='KL Apps'){return -1;}   //0不排序 - 保留注释
            return a[1].toLowerCase()>b[1].toLowerCase() ? 1 : -1;
        });
        //divlist.sort(function (a,b){return ['remote','local'].includes(a[1]) ? 1 : -1;});
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
    for (let blxl=0,lent=divlist.length;blxl<lent;blxl++){
        if (divlist[blxl].length>=4 && divlist[blxl][3].includes('_')){
            var list_t=divlist[blxl][3].split('_');
            divlist[blxl][3]=(ismobile?list_t[1]:list_t[0]);
            if (is_local_file && list_t.length>=3){ // 如1_1_f - 保留注释
                if (list_t[2]=='f'){
                    blfound=true;
                    continue;
                }
            }
        }
        if (divlist[blxl][2].includes('.')){
            if (divlist[blxl][0].substring(0,sele_html_len)==sele_html){
                divlist[blxl][2]=sele_html+file_path_name_b(divlist[blxl][0])[1]+'_ico/'+divlist[blxl][2];
            } else {
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
        for (let blxl=0,lent=recent_find.length;blxl<lent;blxl++){
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
    } else {
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
            } else {return;}
        } catch (error){
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
        if (confirm('是否清空？')==false){
            return;
        } else {
            localStorage.removeItem('common_softs');
        }
    } else {
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
    var list_t=Array.from(ops).filter(one_p => one_p.innerText=='remote');  //对数组中的每个元素 one_p 进行检查，看其 innerText 属性是否等于字符串 'remote'，符合的元素会被包含到新生成的数组 list_t 中 - 保留注释
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
    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
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
    var is_remote_site=false;
    if (local_str===false){ //远程网站 - 保留注释
        local_str=location_host_b(false)+'/';
        is_remote_site=true;
    }
    
    var local_len=local_str.length;
    
    var remote_str=location_host_b(true);
    if (remote_str==''){
        remote_str=local_str;
    } else {
        if (is_remote_site){
            remote_str=klbase_sele_path_b(true)[1]+'/';
        } else {
            remote_str=remote_str+'/klwebphp/';
        }
    }
    
    var remote_len=remote_str.length;

    console.log('local:',local_str,'remote:',remote_str); //此行保留 - 保留注释
    if (only_popup){
        var oas=document.querySelectorAll('div#div_common_softs div.div_klsofts_one a');    
    } else {
        var oas=document.querySelectorAll('div.div_klsofts_one a');
    }
    
    for (let one_a of oas){
        var blhref=one_a.href;
        if (!blhref){continue;}
        if (!is_local && blhref.substring(0,local_len)==local_str){
            blhref=blhref.replace(local_str,remote_str);
            one_a.setAttribute('href',blhref);
        } else if (is_local && blhref.substring(0,remote_len)==remote_str){
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
    } else {
        bljg=bljg+'<a style="text-decoration:none;';
    }
    
    if (addp){
        bljg=bljg+(csitem[0].slice(-1)=='/'?'color:green;':'color:black;')+'" ';
    } else {
        bljg=bljg+'color:black;" onmouseover="this.style.backgroundColor=\'white\';"  onmouseout="this.style.backgroundColor=\'\';" ';
    }

    if (is_js){
        if (jsstr.substring(0,' onclick="'.length)==' onclick="'){
            bljg=bljg+' onclick="'+csitem[0]+jsstr.substring(' onclick="'.length,)+'>';    
        } else {
            bljg=bljg+' onclick="'+csitem[0]+'"'+jsstr+'>';    
        }
    } else {
        bljg=bljg+' href="'+(csitem[0].substring(0,4)=='http' || csitem[0].substring(0,5)=='file:'?'':cshref)+csitem[0]+'"'+jsstr+(addp?'':new_tab)+'>';
    }
    
    if (csitem[2]!==''){
        if (csitem[2].includes('.')){
            bljg=bljg+'<img src="'+csitem[2]+'" style="max-width:'+fontsize+';max-height:'+fontsize+';" />';
        } else {
            bljg=bljg+csitem[2];
        }
        if (addp){
            var blname=csitem[1];
            blname=blname.replace(/([^\s]{4,}) ([^\s]{3,})/g,'$1<br />$2');
            if (csitem[0].slice(-1)=='/'){
                bljg=bljg+'<p style="color:green;">'+blname+'</p>';
            } else {
                bljg=bljg+'<p>'+blname+'</p>';
            }
        } else {
            bljg=bljg+' '+csitem[1];
        }
    } else {
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
    if (items[0]==''){return '';}
    var blat=items[0].indexOf(' /// ');
    var blcategory='(<span class="span_category">'+items[0].substring(0,blat)+'</span>)';
    var blname=items[0].substring(blat+5,);
    if (blname.length>15){
        return blcategory+'<span class="span_todolist_name" title="'+specialstr_j(blname)+'">'+blname.substring(0,15)+'...</span>';
    } else {
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
    } else {
        ospan.innerHTML='♾ '+new_item;
    }
}

function klsofts_div_b(divid,font_size,padding=0,filter_str='0',diy_list=[],autoclose=true,add_head=true,add_todolist=true){
    var blhref=klwebphp_path_b();
    if (blhref===false){
        blhref='';
    }
    
    var soft_str='<div id="'+divid+'" class="div_top_bottom_menu" style="display:none;font-weight:normal;padding:'+padding+'rem;">';
    var head_part=(add_head?['{{selenium_news}}/html/klapps.htm,KL Apps,klapps512.png,0']:[]);
    head_part=head_part.concat(diy_list);
    var soft_list=klsofts_list_b(filter_str,head_part);
    
    if (add_todolist){
        var bltodolist=klsofts_routines_random_b();
        if (bltodolist!==''){
            soft_list.push(['javascript:klsofts_routines_ignore_or_done_b(this)',bltodolist,'♾',0]);
        }
    }
    
    var jsstr=(autoclose?' onclick="popup_show_hide_b(\''+divid+'\');"':'');

    for (let item of soft_list){
        if (item[0].substring(0,11)=='javascript:' || item[0].substring(0,6)=='popup:'){
            soft_str=soft_str+klsofts_one_b(item,font_size,false,blhref,'');    
        } else {
            soft_str=soft_str+klsofts_one_b(item,font_size,false,blhref,jsstr);            
        }
    }
    soft_str=soft_str+'</div>';
    return soft_str;
}

function canvas2img_b(ocanvas,cstype='jpeg'){
    if (cstype=='png'){
        return ocanvas.toDataURL('image/png');
    } else {
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
    var odom = document.createElement('a');
    var blob = new Blob([csstr],{type: 'text/'+cstype+';charset=utf-8;'});
    odom.href = URL.createObjectURL(blob);
    odom.setAttribute('download', savename);
    document.body.appendChild(odom); 
    odom.click();
    document.body.removeChild(odom);
    blob='';
}

function dom_value_2_txt_file_b(csid,savename='',csext='txt'){
    var odom=document.getElementById(csid);
    if (!odom){return;}
    if (savename==''){
        savename='save_'+today_str_b('dt','','','_')+'.'+csext;
    }
    string_2_txt_file_b(odom.value,savename,csext);
}

function table_2_csv_b(table_querystring,colno_list=[],suffix=''){
    var otable=document.querySelector(table_querystring);
    if (!otable){return;}
    var otrs=otable.querySelectorAll('tr');
    var result_t=[];
    for (let one_tr of otrs){
        var arow=[];
        var otds=one_tr.querySelectorAll('th,td');
        for (let blxl=0,lent=otds.length;blxl<lent;blxl++){
            if (colno_list.length>0 && !colno_list.includes(blxl)){continue;}
            var one_td=otds[blxl];
            var blvalue=one_td.innerText.trim();
            if (blvalue=='' || isNaN(blvalue)){
                arow.push('"'+specialstr_j(blvalue)+'"');
            } else {
                arow.push(blvalue);
            }
        }
        result_t.push(arow.join(','));
    }
    string_2_txt_file_b(result_t.join('\n'),'table2csv_export'+suffix+'.csv','csv');
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
    } else {
        return cskey;
    }
}

function int_number_list_insert_zero_b(cslist,csmin=false,csmax=false,minlen=1){
    //[
    //[int_number1,value1],
    //[int_number,value2],    
    //];
    //年份补全 - 保留注释
    if (cslist.length<=minlen){
        return cslist;
    }
    
    cslist.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    
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
        if (blcurrent>csmax){break;}    //不能用 >= ，会忽略无最大值的数组 - 保留注释

        if (!num_set.has(blcurrent)){
            cslist.push([blcurrent,0]);
        }
        blcurrent=blcurrent+1;
        blxl=blxl+1;
        if (blxl>100000){break};
    }
    cslist.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
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
            } else {
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
    } else if (Array.isArray(idname)){
        var items=idname;
    } else {
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
        } else {
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
        result_t.sort(function (a,b){return a.join()>b.join() ? 1 : -1;});
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

function temp_save_local_b(local_id,csmax,blvalue=[],do_add=false,do_save=false){
    var split_str='\n-----\n';
    var old_str=localStorage.getItem(local_id) || '';    //需要保留空格，而 local_storage_get_b 会删除空格 - 保留注释
    var old_len=0;
    if (old_str==''){
        var old_list=[];
    } else {
        var old_list=old_str.split(split_str);
        old_len=old_list.length;
        old_list=old_list.slice(0,csmax);
    }
    
    if (typeof blvalue == 'string'){
        blvalue=blvalue.split(split_str);
    }
    
    var blfound=false;
    for (let blxl=0,lent=blvalue.length;blxl<lent;blxl++){
        blvalue[blxl]=blvalue[blxl].replace(/^\n+/g,'');    //清除开始的空行 - 保留注释
        if (blvalue[blxl]==''){continue;}
        var blat=old_list.indexOf(blvalue[blxl]);
        if (blat>=0){
            old_list.splice(blat,1);
            blfound=true;
        }
    }
        
    if (do_add){
        old_list=blvalue.concat(old_list);
    }
    
    if (do_save){
        localStorage.setItem(local_id,old_list.join(split_str));
    }
    return [old_list,old_len];
}

function temp_save_table_b(cstype='',local_id,read_textarea_id,div_id,csmax=20,paste_textarea_id='',override=true){
    var blstr='';
    var old_list,old_len;

    if (cstype=='write'){    
        if (!override){
            old_len=temp_save_local_b(local_id,csmax,blstr,false,false)[1]; //先读取 - 保留注释
            if (old_len>=csmax){return false;}
        }
        var otextarea=document.getElementById(read_textarea_id);
        blstr=otextarea.value;
    }

    [old_list,old_len]=temp_save_local_b(local_id,csmax,blstr,(cstype=='write'),(cstype=='write'));
    if (old_list.length==0){return old_len;}
    
    if (paste_textarea_id==''){
        paste_textarea_id=read_textarea_id;
    }
    //read
    var rndint=parseInt(Math.random()*1000000);
    var line_total_count=0;
    var length_total_count=0;
    for (let blxl=0,lent=old_list.length;blxl<lent;blxl++){
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
        if (old_len>csmax){
            bottom_buttons=bottom_buttons+' <font color="'+scheme_global['a-hover']+'">现有条数：'+old_len+' 超出最大合并数：'+csmax+'</font>';
        }
        bottom_buttons=bottom_buttons+'</td></tr>\n';
    }
    
    document.getElementById(div_id).innerHTML='<table id="table_temp_save_'+rndint+'" class="table_common" width=90%>'+old_list.join('\n')+bottom_buttons+'</table>';  
    return old_len;
}

function temp_save_empty_b(table_id,local_id,csmax){
    var old_list,old_len;
    [old_list,old_len]=temp_save_local_b(local_id,csmax,'',false,false);
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
    var old_list,old_len;
    [old_list,old_len]=temp_save_local_b(local_id,csmax,'',false,false);
    var delimiter=prompt('合并'+old_list.length+'条记录到编辑框，输入间隔标记','\\n-----\\n');
    if (delimiter==null){return;}
    delimiter=delimiter.replace(/(\\n)/g,'\n');
        
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
    } else {
        var odom=document.getElementById(id);
        if (odom){
            odom.innerHTML=new Date().toLocaleTimeString()+' '+csstr;
            setTimeout(function(){odom.innerHTML='';},duration);
        }
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
        } catch (err){
            alert(err.message);
            break;
        }        
    }
    if (add_js){
        return '<script>\n'+result_t.join('\n\n')+'\n</script>';
    } else {
        return result_t.join('\n\n');
    }
}

function scheme_list_for_standalone_b(){
    var scheme_list=[];
    for (let key in scheme_global){
        scheme_list.push('"'+specialstr_j(key)+'": "'+specialstr_j(scheme_global[key])+'",');
    }
    return scheme_list;
}

function standalone_search_funs_b(cstitle='Search Standalone',cscontent='',diy_fn_list=[],add_li=true,csth='',rows_per_page=100,show_jump=true,bottom_pages=true,diy_style='',on_data_load_run_js='',on_page_show_fn_name=''){
    function search_standalone(cskey=false){
        data_current_standalone_global=[];    //全局变量 - 保留注释
        if (cskey==false){
            cskey=document.getElementById('input_search').value;
        }
        var is_reg=false;
        [cskey,is_reg]=str_reg_check_b(cskey,is_reg);
        if (cskey=='' || ['.','.*'].includes(cskey) && is_reg){
            data_current_standalone_global=false;  //无关键词时直接调用不显示行号 - 保留注释
        } else {
            for (let blxl=0,lent=data_raw_standalone_global.length;blxl<lent;blxl++){
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
            } else if (data_raw_standalone_global[0].slice(-5,)=='</li>'){
                type_standalone_global='li';
            }            
        }   
    }
    
    function page_standalone(csno,row_index=-1){
        if (data_current_standalone_global===false){
            var cslen=data_raw_standalone_global.length;
        } else {
            var cslen=data_current_standalone_global.length;
        }
        
        //if (rows_per_page===false){
            //rows_per_page=Math.max(100,Math.ceil(cslen/100));
        //}
        
        var bljg=page_combination_b(cslen,rows_per_page_global,csno,'page_standalone','locate_standalone');
        //-----------------------
        var result_t=[];
        var blend=Math.min(csno-1+rows_per_page_global,cslen);
        var row_no_range=[-1,-1];
        var raw_len=data_raw_standalone_global.length;
        var is_raw=true;
        if (data_current_standalone_global===false){
            var current_len=raw_len;
            for (let blxl=csno-1;blxl<blend;blxl++){
                result_t.push(data_raw_standalone_global[blxl]);
            }    
            row_no_range=[csno-1,blend-1];    
        } else {
            var current_len=data_current_standalone_global.length;
            is_raw=(raw_len==current_len);
            if (csno-1>=0 && blend-1>=0){
                row_no_range=[data_current_standalone_global[csno-1][1],data_current_standalone_global[blend-1][1]];
            }
            for (let blxl=csno-1;blxl<blend;blxl++){
                var jump_str=(show_jump_global?'<span class="span_row_no_standalone" onclick="jump_standalone('+data_current_standalone_global[blxl][1]+');">('+data_current_standalone_global[blxl][1]+')</span>':'');
                
                switch (type_standalone_global){
                    case '':
                        result_t.push(data_current_standalone_global[blxl][0]+' '+jump_str);    //rows_per_page
                        break;
                    case 'tr':
                        if (is_raw){
                            var jump_td='';
                        } else {
                            var jump_td='<td>'+jump_str+'</td>';
                        }
                        result_t.push(data_current_standalone_global[blxl][0].slice(0,-5)+jump_td+'</tr>');
                        break;                    
                    case 'li':
                        result_t.push(data_current_standalone_global[blxl][0].slice(0,-5)+' '+jump_str+'</li>');
                        break;
                }
            }
        }
        
        document.getElementById('span_count_standalone').innerText=' ('+row_no_range[0]+'~'+row_no_range[1]+'/'+result_t.length+'/'+current_len+'/'+raw_len+'/'+(current_len*100/raw_len).toFixed(2)+'%)';
        if (result_t.length==0){
            document.getElementById('divhtml').innerHTML='';
            return;
        }
        
        var odiv=document.getElementById('divhtml');
        if (add_li_standalone_global){
            odiv.innerHTML=bljg+'<ol id="ol_result_standalone">\n<li>'+result_t.join('</li>\n<li>')+'</li>\n</ol>'+(bottom_pages_global?bljg:'');
        } else {
            if (type_standalone_global=='tr'){
                if (is_raw){
                    var th_str=table_th_global;
                } else {
                    var th_str=table_th_global.slice(0,-5);
                    if (th_str==''){
                        th_str='<tr id="tr_th_columns_set">';
                    } else {
                        th_str=th_str+'<th>row no</th></tr>';
                    }
                }
                odiv.innerHTML=bljg+'<table class="table_common" id="ol_result_standalone">'+th_str+result_t.join('\n')+'</table>\n'+(bottom_pages_global?bljg:'');
                setTimeout(th_columns_set_standalone,100);
            } else {
                odiv.innerHTML=bljg+'<ol id="ol_result_standalone">\n'+result_t.join('\n')+'\n</ol>'+(bottom_pages_global?bljg:'');
            }
        }
        
        mouseover_mouseout_oblong_span_b(odiv.querySelectorAll('span.oblong_box'));
        highlight_standalone();
        
        var jumped=false;
        if (row_index>=1 && row_index<=rows_per_page_global){
            if (type_standalone_global=='tr'){
                var olis=document.querySelectorAll('table#ol_result_standalone tr');
                if (table_th_global!==''){
                    var new_trs=[];
                    for (let blxl=1,lenb=olis.length;blxl<lenb;blxl++){
                        new_trs.push(olis[blxl]);
                    }
                    olis=new_trs;
                    //不能使用 olis=olis.slice(1,); 或 olis.shift() - 保留注释
                }
            } else {
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
        
        if (on_page_show_fn_name_global!==''){
            eval(on_page_show_fn_name_global);
        }
    }
    
    function th_columns_set_standalone(){
        var otr=document.getElementById('tr_th_columns_set');
        if (!otr){return;}
        
        var otable=document.getElementById('ol_result_standalone');
        if (!otable){return;}
        var otrs=otable.querySelectorAll('tr');
        if (otrs.length<2){return;}
        var otds=otrs[1].querySelectorAll('td');
        
        var result_t=[];
        for (let blxl=0,lent=otds.length-1;blxl<lent;blxl++){
            if (blxl<26){
                result_t.push('<th>'+String.fromCharCode(65+blxl)+'</th>');
            } else {
                result_t.push('<th>Col '+(blxl+1)+'</th>');
            }
        }
        result_t.push('<th>row no</th></tr>');
        otr.innerHTML=result_t.join('');
    }
    
    function locate_standalone(pages){
        var blno=page_location_b(pages);
        if (blno!==false){
            page_standalone((blno-1)*rows_per_page_global+1);
        }
    }
    
    function jump_standalone(csno){
        //var rows_per_page=Math.max(100,Math.ceil(data_raw_standalone_global.length/100));
        data_current_standalone_global=false;
        var pageno=Math.ceil(csno/rows_per_page_global);
        var row_index=csno%rows_per_page_global;
        if (row_index==0){
            row_index=rows_per_page_global;
        }
        page_standalone((pageno-1)*rows_per_page_global+1,row_index);
    }
    
    function highlight_standalone(){
        var cskeys=document.getElementById('input_search').value.replace(/[\+\s\|\^\$]/g,' ').trim().split(' ');
        cskeys=Array.from(new Set(cskeys));
        
        var is_ok;
        if (type_standalone_global=='tr'){
            var olis=document.querySelectorAll('table#ol_result_standalone td');
        } else {
            var olis=document.querySelectorAll('ol#ol_result_standalone li');
        }
        for (let one_li of olis){
            for (let blxl=0,lent=cskeys.length;blxl<lent;blxl++){
                var one_key=cskeys[blxl];
                is_ok=highlight_obj_b(one_li,one_key,'<span style="background-color:'+highlight_color_b(blxl)+';">'+one_key+'</span>');
                if (is_ok===-1){break;} 
            }
        }
    }
    //-----------------------
    var fns=['ismobile_b','css_root_style_b','css_root_size_b','style_generate_b','str_reg_search_b','str_reg_check_b','page_one_b','page_prev_next_b','page_location_b','page_remove_dot_b','page_combination_b','mouseover_mouseout_oblong_span_b','highlight_obj_b','highlight_oblong_span_b','highlight_color_b'];
    //fns=fns.concat(diy_fn_list);
    fns=array_union_b(fns,diy_fn_list,false,true);
    
    var blcontent=`<!DOCTYPE html>
<html>
<head>`
+'<title>🔎 '+cstitle+'</title>'
+`<meta charset="UTF-8" />
<script>
//js函数插入处
`+fun_2_string_b(fns)+'\n\n'+search_standalone.toString()+'\n\n'+page_standalone.toString()+'\n\n'+locate_standalone.toString()+'\n\n'+highlight_standalone.toString()+'\n\n'+jump_standalone.toString()+'\n\n'+type_standalone.toString()+'\n\n'+th_columns_set_standalone.toString()
+`
</script>
<script>
`+'var add_li_standalone_global='+add_li+';\nvar table_th_global="'+specialstr_j(csth)+'";\nvar on_page_show_fn_name_global="'+on_page_show_fn_name+'";\nvar rows_per_page_global='+rows_per_page+';\nshow_jump_global='+show_jump.toString()+';\nbottom_pages_global='+bottom_pages.toString()+';'+`
scheme_global={
`
+scheme_list_for_standalone_b().join('\n')
+`
};
css_root_style_b(18,13,['base'],[],3,0);
</script>
<style>
ol#ol_result_standalone li{margin-bottom:0.5rem;}
ol#ol_result_standalone li:hover {background-color: #E9EEF2;}
span.span_row_no_standalone{font-size:0.8rem;color:grey;font-style:italic;cursor:pointer;}
`+diy_style+`
</style>
<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
</head>
<body style="margin:0.5rem;">
<a name=top></a>
`
+'<h2>🔎 '+cstitle+'<span id="span_count_standalone" style="font-weight:normal;font-size:0.85rem;"></span></h2>'
+`
<p><input type="text" id="input_search" placeholder="search" onkeyup="if (event.key=='Enter'){search_standalone();}" style="width:90%;" /></p>
<div id="divhtml"></div>
<script>
var data_raw_standalone_global=[
`
+cscontent
+`
];
`+on_data_load_run_js+`
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

function dom_insert_str_b(odom,str1,str2,check_selected=false,every_line=false,run_fn=false){
    var st=odom.selectionStart;
    var ed=odom.selectionEnd;
    if (check_selected && st==ed){return;}
    
    var blvalue=odom.value;
    var selected_str=blvalue.substring(st,ed);

    if (typeof run_fn == 'function'){
        selected_str=run_fn(selected_str);
    }
                
    if (every_line){
        var list_t=selected_str.split('\n');
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            list_t[blxl]=str1+list_t[blxl]+str2;
        }
        selected_str=list_t.join('\n');
    } else {
        selected_str=str1+selected_str+str2;
    }
    odom.value=blvalue.substring(0,st)+selected_str+blvalue.substring(ed,);
}

function textarea_shift_b(idname1,idname2,cstype='',merge_delimiter='',do_ask=true){
    var otextarea1=document.getElementById(idname1);
    var otextarea2=document.getElementById(idname2);
    var blstr1=otextarea1.value;
    var blstr2=otextarea2.value;
    
    switch (cstype){
        case 'merge':
            if (blstr2==''){return;}
            if (do_ask && !confirm('是否合并？')){return;}
            
            otextarea1.value=blstr1+merge_delimiter+blstr2;
            otextarea2.value='';
            break;
        default:
            otextarea1.value=blstr2;
            otextarea2.value=blstr1;
            break;
    }
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
        } else {
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
    } else {
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
    flot_list.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});
    
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
            if (typeof run_fn_onsuccess == 'function'){
                run_fn_onsuccess();
            }
        } else {
            if (blxl>=csmax){
                console.log('未发现 '+fn_name+' ，扫描次数：'+blxl);
                return;
            }
            setTimeout(sub_load_fn_b_wait,cswait);
        }
    }
    //-----------------------
    if (csmax==-1){
        csmax=(is_local_b()?20:50);    
    }
    var blxl=0;
    setTimeout(sub_load_fn_b_wait,cswait);
}

function load_var_b(var_name,csmax,cswait,run_fn,fail_fn=false){
    function sub_load_var_b_wait(){
        blxl=blxl+1;
        
        if (eval('typeof '+var_name) !== 'undefined'){
            console.log('发现 '+var_name+' ，扫描次数：'+blxl);       
            if (typeof run_fn == 'function'){            
                run_fn(true);     
            }
        } else {
            if (blxl>=csmax){
                console.log('未发现 '+var_name+' ，扫描次数：'+blxl);
                if (typeof run_fn == 'function'){
                    run_fn(false);
                }
                
                if (typeof fail_fn == 'function'){
                    fail_fn();
                }
                return;
            }
            setTimeout(sub_load_var_b_wait,cswait);
        }
    }
    //-----------------------
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
        for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
            result_t.push([csarray[blxl],blxl+1]);  
            blcount=blcount+1;
            if (csmax>0 && blcount>=csmax){break;}            
        }
    } else {
        for (let blxl=0,lent=csarray.length;blxl<lent;blxl++){
            var item=csarray[blxl];
            var blfound=str_reg_search_b(item,cskey,isreg);
            if (blfound==-1){break;}
            
            if (blfound){
                result_t.push([item,blxl+1]);
                blcount=blcount+1;
                if (csmax>0 && blcount>=csmax){break;}                
            } else {
                is_all_result=false;            
            }
        }
    }
    return [result_t,is_all_result];
}

function result_percent_b(id_str,len1,len2,fraction=2){ 
    //span_count - 保留注释
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

function window_is_closed_b(owindow,wait_times,csmax=10,do_close=true){
    if (wait_times>csmax){
        if (do_close){
            console.log(new Date().toLocaleString(), '强制关闭窗口，等待次数',wait_times);
            owindow.close();
        } else {
            return [-1,wait_times];
        }
    }
    
    if (owindow===false || owindow.closed){
        return [true,wait_times];
    } else {
        wait_times=wait_times+1;
        return [false,wait_times];
    }    
}

function window_list_init_b(max_result){
    var window_list=[];
    for (let blxl=0;blxl<max_result;blxl++){
        window_list.push(false);
    }    
    return window_list;
}
    
function copy_2_clipboard_b(csstr,nav_mode=false){
    if (nav_mode==false){
        var otextarea=document.createElement('textarea');
        otextarea.value=csstr;
        document.body.appendChild(otextarea);
        otextarea.select();
        document.execCommand('copy');
        otextarea.parentNode.removeChild(otextarea);
    } else {
        navigator.clipboard.writeText(csstr)
        .then(() => {console.log('文本已成功复制到剪贴板');})
        .catch((error) => {console.log(error);});
    }
}

function split_dom_vertical_or_horizontal_b(odom,cscount,split_type,adjust_by_p=false){
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

    //形如：[ 0, 7578.516927083333, 15157.033854166666 ] - 保留注释
    if (adjust_by_p){
        var p_position=[];
        var ops=odom.querySelectorAll('p, h2, h3, h4, h5, li, tr');
        for (let one_p of ops){
            var osub=one_p.querySelector('p, h2, h3, h4, h5, li, tr');
            if (osub){continue;}    //忽略含有子对象的对象 - 保留注释
            var p_rect=one_p.getBoundingClientRect();
            if (split_type=='rows'){
                p_position.push([p_rect.top,p_rect.top+p_rect.height]);
            } else {
                p_position.push([p_rect.left,p_rect.left+p_rect.width]);            
            }
        }
        
        for (let blx=1,lent=split_list.length;blx<lent;blx++){    //忽略第一个 0 元素 - 保留注释
            for (let bly=0,lenb=p_position.length-1;bly<lenb;bly++){
                if (p_position[bly+1][0]>=split_list[blx]){ //段落有可能太长，调整后，每份截图长度不一致 - 保留注释
                    split_list[blx]=(p_position[bly][1]+p_position[bly+1][0])/2;
                    break;
                }
            }
        }
    }

    for (let blxl=0,lent=split_list.length;blxl<lent;blxl++){
        var odiv_split=document.createElement('div');
        document.body.appendChild(odiv_split);
        odiv_split.style.cssText='position:absolute;';
        odiv_split.classList.add('div_split_dom_vertical_or_horizontal_b');

        split_div_position_wh_b(split_type,split_list,blxl,odiv_split,rect);

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
            } else {
                console.log('error:',blvalue);
            }
            split_list.push(blvalue);
        }
    } else {
        var otds=otrs[0].querySelectorAll('th,td');
        split_len=otds.length;
        if (split_len==0){return [];}
        
        for (let blxl=0;blxl<cscount;blxl++){
            var blvalue=Math.round(split_len*blxl/cscount);
            if (blvalue>=0 && blvalue<=split_len-1){
                var rect_td=otds[blvalue].getBoundingClientRect();   
                blvalue=rect_td.left;
            } else {
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
    
    for (let blxl=0,lent=split_list.length;blxl<lent;blxl++){
        var odiv_split=document.createElement('div');
        document.body.appendChild(odiv_split);
        odiv_split.classList.add('div_split_dom_vertical_or_horizontal_b');
        odiv_split.style.cssText='position:absolute;';
        
        split_div_position_wh_b(cstype,split_list,blxl,odiv_split,rect_table);
        odiv_split.setAttribute('ondblclick',"this.outerHTML='';");
    }
    return split_list;    
}

function split_div_position_wh_b(cstype,split_list,csxl,odiv_split,orect){
    if (cstype=='rows'){
        odiv_split.style.left=orect.left+'px';
        odiv_split.style.width=orect.width+'px';
            
        odiv_split.style.top=split_list[csxl]+'px';
        if (csxl<split_list.length-1){
            odiv_split.style.height=(split_list[csxl+1]-split_list[csxl])+'px';
        } else {
            odiv_split.style.height=(orect.top+orect.height-split_list[csxl])+'px';
        }
    } else {
        odiv_split.style.top=orect.top+'px';
        odiv_split.style.height=orect.height+'px';
                
        odiv_split.style.left=split_list[csxl]+'px';
        if (csxl<split_list.length-1){
            odiv_split.style.width=(split_list[csxl+1]-split_list[csxl])+'px';
        } else {
            odiv_split.style.width=(orect.left+orect.width-split_list[csxl])+'px';
        }
    }
}

function percent_calculation_b(starting_value,final_value,current_value){
    var blcount=final_value-starting_value;
    if (blcount==0){return [false,false];}

    var blcurrent=current_value-starting_value;
    var blremain=blcount-blcurrent;
    return [Math.abs(blcurrent/blcount),blremain];
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
    } catch (error){
        return current;
    }
    return '';
}

function list_category_count_b(cslist,col_no=-1,return_dict=false,is_sum=false){
    var key_dict={};
    if (col_no===-1){
        if (is_sum){
            for (let item of cslist){
                var blkey='k_'+item;
                if (key_dict[blkey]==undefined){
                    key_dict[blkey]=0;
                }
                key_dict[blkey]=key_dict[blkey]+item;
            }        
        } else {
            for (let item of cslist){
                var blkey='k_'+item;
                if (key_dict[blkey]==undefined){
                    key_dict[blkey]=0;
                }
                key_dict[blkey]=key_dict[blkey]+1;
            }
        }
    } else {
        if (is_sum){
            for (let item of cslist){
                var blkey='k_'+item[col_no];
                if (key_dict[blkey]==undefined){
                    key_dict[blkey]=0;
                }
                key_dict[blkey]=key_dict[blkey]+item[col_no];
            } 
        } else {    
            for (let item of cslist){
                var blkey='k_'+item[col_no];
                if (key_dict[blkey]==undefined){
                    key_dict[blkey]=0;
                }
                key_dict[blkey]=key_dict[blkey]+1;
            }
        }
    }
    
    if (return_dict){
        return key_dict;
    }
    return object2array_b(key_dict,true,2);
}

function merge_js_data_files_in_one_b(varname,jsfile_list,run_fn,merge_current=false){
    function sub_merge_js_data_files_in_one_b(){
        console.log(eval(varname).length);    //此行保留 - 保留注释
        for (let item of eval(varname)){
            merge_t.push(item);
        }
            
        blxl=blxl+1;
        if (blxl>=bllen){
            eval(varname+'=merge_t');
            if (typeof run_fn == 'function'){            
                run_fn();
            }
            return;
        }
        eval(varname+'=undefined');
        file_dom_create_b([jsfile_list[blxl]],true,'js');    
        load_var_b(varname,-1,1000,sub_merge_js_data_files_in_one_b);        
    }
    //-----------------------
    var blxl=0;
    var bllen=jsfile_list.length;
    var merge_t=[];
    
    if (merge_current){
        for (let item of eval(varname)){
            merge_t.push(item);
        }
    }
    
    eval(varname+'=undefined');
    file_dom_create_b([jsfile_list[blxl]],true,'js');    
    load_var_b(varname,-1,1000,sub_merge_js_data_files_in_one_b);
}

function array_remove_item_b(csarr,csitem){
    if (typeof csitem == 'string'){
        csitem=[csitem];
    }
    for (let akey of csitem){
        var blat=csarr.indexOf(akey);
        if (blat>=0){
            csarr.splice(blat,1);
        }
    }
    return csarr;
}

function wiki_page_title_link_generate_b(cspage,cstitle=''){    
    function sub_wiki_page_title_link_generate_b_punctuation(csstr){
        //csstr=csstr.replace(/&amp;/g,'.26');
        //csstr=csstr.replace(/&/g,'.26');
        //csstr=csstr.replace(/'/g,'.27');
        //csstr=csstr.replace(/=/g,'.3D');
        //csstr=csstr.replace(/\?/g,'.3F');
        //csstr=csstr.replace(/~/g,'.7E');
        //csstr=csstr.replace(/!/g,'.21');
        //csstr=csstr.replace(/\(/g,'.28');
        //csstr=csstr.replace(/\)/g,'.29');
        //csstr=csstr.replace(/\$/g,'.24');
        //csstr=csstr.replace(/\//g,'.2F');

        csstr=csstr.replace(/\s+/g,'_'); //合并多个空格 - 保留注释

        //console.log(encodeURI(csstr).replace(/\.7C/g,'|'));
        return encodeURI(csstr);
    }
    //-----------------------
    if (cstitle==''){
        var bllink=sub_wiki_page_title_link_generate_b_punctuation(cspage);
    } else {
        var bllink=sub_wiki_page_title_link_generate_b_punctuation(cspage)+'#'+sub_wiki_page_title_link_generate_b_punctuation(cstitle);//.replace(/%/g,'.');
    }
    
    return bllink;    
}

function array_col_value_get_b(csarr,col_no,default_value=false,cstype='int'){
    var blvalue=default_value;
    if (col_no<csarr.length){
        var bltmp=csarr[col_no];
        switch (cstype){
            case 'int':
                bltmp=parseInt(bltmp);
                if (!isNaN(bltmp)){
                    blvalue=bltmp;
                }
                break;
            case 'float':
                bltmp=parseFloat(bltmp);   
                if (!isNaN(bltmp)){
                    blvalue=bltmp;
                }
                break;
            case 'str':
                blvalue=bltmp.toString();
                break;
            default:
                blvalue=bltmp;
        }
    }
    return blvalue;
}

function array_batch_value_get_b(csarr,default_list){
    var result_t=[];
    for (let blxl=0,lent=default_list.length;blxl<lent;blxl++){
        var default_value=default_list[blxl][0];
        var cstype=default_list[blxl][1];
        result_t.push(array_col_value_get_b(csarr,blxl,default_value,cstype));
    }
    return result_t;
}

function array_split_by_col_b(csarr,col_no_list,ignore_empty=true){
    var result_t=[];
    if (col_no_list.length==1){
        var blno=col_no_list[0];
        if (blno<0){return [];}
        
        for (let arow of csarr){
            if (blno<arow.length){
                result_t.push(arow[blno]);
            }
        }
    } else {
        for (let arow of csarr){
            var new_row=[];
            var bllen=arow.length;
            for (let one_no of col_no_list){
                if (one_no>=0 && one_no<bllen){
                    new_row.push(arow[one_no]);
                }
            }
            if (new_row.length==0 && ignore_empty){continue;}
            result_t.push(new_row);
        }
    }
    return result_t;
}

function document_title_key_word_b(csstr,replaced_words=''){
    if (csstr.length>15 && csstr.includes(' ')){
        csstr=csstr.split(' ')[0];
    }
    if (csstr.length>15){
        csstr=csstr.substring(0,15)+'...';
    }
    if (csstr!=='' && replaced_words!==''){
        document.title=document.title.replace(replaced_words,specialstr_lt_gt_j(csstr)+' - '+replaced_words);
    }
    return csstr;
}

function longest_fraction_b(csarr,cstype='col',str2float=false){
    function sub_longest_fraction_b_max(csvalue,csresult){
        if (str2float && typeof csvalue == 'string'){
            csvalue=parseFloat(csvalue);
        }
        if (typeof csvalue == 'number' && !isNaN(csvalue)){
            var num_t=csvalue.toString().split('.');
            if (num_t.length==2){
                csresult=Math.max(csresult,num_t[1].length);
            }
        }
        return csresult;
    }
    //-----------------------
    switch (cstype){
        case 'col':
            //当 cstype 为 col 时：csarr 形如 [
            //['a',23.1,45,'22.22'],
            //['b',-2.1,25,'aaa'],
            //['c',2.123,4.5,'aaa'],
            //['d',8.11,4,'aaa'],
            //] - 保留注释
            var decimal_t=[];
            for (let arow of csarr){
                for (let blcol=0,lent=arow.length;blcol<lent;blcol++){
                    if (decimal_t[blcol]==undefined){
                        decimal_t[blcol]=0;
                    }
                    decimal_t[blcol]=sub_longest_fraction_b_max(arow[blcol],decimal_t[blcol]);
                }
            }
            break;
        case 'arr':
            var decimal_t=0;
            for (let arow of csarr){
                decimal_t=sub_longest_fraction_b_max(arow,decimal_t);
            } 
            break;
    }
    return decimal_t;
}

function dicts_2_value_list_b(dicts_list,cskeys=false){
    //dicts_list 为数组，每个元素为 dict，如 {'name': '阿华田酷脆心情夹心饼干','price': 7.9,'protein': 6.5,'sodium': 0.3,}；返回 每行按 cskeys 顺序排列的 数组们组成的数组。#table #th - 保留注释
    
    if (cskeys===false){
        cskeys=new Set();
        for (let arow of dicts_list){
            for (let one_key in arow){
                cskeys.add(one_key);
            }
        }
    }

    var result_t=[];
    for (let arow of dicts_list){
        var row_list=[];
        for (let akey of cskeys){
            row_list.push(arow[akey]);
        }
        result_t.push(row_list);
    }
    return [result_t,cskeys];
}

function list_2_dicts_b(cslist,cskeys=false,prefix='k_'){
    //将如表格般排列的数组，转换为每行是 dict 的 数组 - 保留注释
    if (cslist.length==0){return [];}
    
    if (cskeys===false){
        cskeys=cslist[0]; //第一行为 th 行 - 保留注释
        cslist=cslist.slice(1,);
    }
    
    var bllen=cskeys.length;
    
    var result_t=[];
    for (let arow of cslist){
        var list_t={};
        for (let blxl=0,lent=Math.min(bllen,arow.length);blxl<lent;blxl++){
            list_t[prefix+cskeys[blxl]]=arow[blxl];
        }
        result_t.push(list_t);
    }
    return result_t;
}

function character_num_sort_b(compared_a,compared_b,csdesc=false,is_cn=false){
    //如：TFA1, TFA12, TFA9, SSD1 排序。不考虑小数点和负数 - 保留注释
    let sa=(compared_a.match(/^[^\d]+/i) || [''])[0];
    let sb=(compared_b.match(/^[^\d]+/i) || [''])[0];
    if (sa==sb){
        if (csdesc){
            return parseInt((compared_a.match(/\d+/) || ['0'])[0]) < parseInt((compared_b.match(/\d+/) || ['0'])[0]) ? 1 : -1;
        } else {
            return parseInt((compared_a.match(/\d+/) || ['0'])[0]) > parseInt((compared_b.match(/\d+/) || ['0'])[0]) ? 1 : -1;
        }
    } else {
        if (is_cn){
            return zh_sort_b(sa,sb,csdesc);
        } else {
            if (csdesc){
                return sa<sb ? 1 : -1;
            } else {    
                return sa>sb ? 1 : -1;
            }
        }
    }
}

function selection_dict_get_b(){
    const selection = window.getSelection();
    if (selection.rangeCount > 0){
        const range = selection.getRangeAt(0);
        var dict_t={
        'startContainer': range.startContainer,
        'startOffset': range.startOffset,
        'endContainer': range.endContainer,
        'endOffset': range.endOffset,
        };
    } else {
        var dict_t = {
            'startContainer': false,
            'startOffset': -1,
            'endContainer': false,
            'endOffset': -1,    
        };
    }
    
    return dict_t;
}

function selection_generate_b(csdict){
    const range = document.createRange();
    try {
        range.setStart(csdict.startContainer, csdict.startOffset);
        range.setEnd(csdict.endContainer, csdict.endOffset);
    } catch (e){
        console.log(e);
        return false;
    }
    
    const newSelection = window.getSelection();
    newSelection.removeAllRanges();
    newSelection.addRange(range);
    return true;
}

function selection_content_b(){
    var oselection = window.getSelection();
    if (oselection.rangeCount == 0){return '';}
    
    var range = oselection.getRangeAt(0);
    var selectedText = range.cloneContents();

    var tempElement = document.createElement('div');
    tempElement.appendChild(selectedText);

    return tempElement.innerText;
}

function selection_expand_b(){
    // 获取当前选区
    var oselection = window.getSelection();
    
    if (oselection.rangeCount == 0){return;}

    // 获取当前选区的第一个范围
    var range = oselection.getRangeAt(0);

    // 确保容器是一个节点类型为 TEXT_NODE 的元素
    var ostart= range.startContainer;
    if (ostart.nodeType !== Node.TEXT_NODE){
        console.log('ostart 非文本节点');
        return;
    }

    var oend = range.endContainer;
    if (oend.nodeType !== Node.TEXT_NODE){
        console.log('oend 非文本节点');
        return;
    }
    
    var blstart = range.startOffset;
    var blend = range.endOffset;
        
    var blreg=/[。，；？！]|[\.,;\?\!]\s/g;
    var punctuation_list=[];
    var result_t;
    while (result = blreg.exec(ostart.data)){
        var blat=blreg.lastIndex;
        if (blat>blstart){break;}   //不能使用 >= - 保留注释
        punctuation_list.push(blat);        
    }

    if (punctuation_list.length>0){
        range.setStart(ostart, punctuation_list.slice(-1)[0]);
    }
    //-----
    var blreg=/[。，；？！]|[\.,;\?\!]\s/g;  //必须重新定义 - 保留注释
    var punctuation_list=[];
    while (result = blreg.exec(oend.data)){
        var blat=blreg.lastIndex;
        if (blat<=blend){continue;}
        punctuation_list.push(blat);     
        break;   
    }
    
    if (punctuation_list.length>0){    
        range.setEnd(oend, punctuation_list[0]-1);
    }
    // 更新选区
    oselection.removeAllRanges();
    oselection.addRange(range);
    //手机浏览器自身负责渲染文本选区，并且通常不会直接响应JavaScript创建的Range对象而显示选择图标。某些移动浏览器可能对JavaScript修改文本选区的支持有限，尤其是在没有用户交互的情况下。此外，为了用户体验和安全原因，现代浏览器可能会限制非用户触发的文本选区更改行为。
}

function import_bigfile_content_b(filename=false,csid=false,run_fn=false){
    function sub_import_bigfile_content_b(cscontent){
        if (csid!==false){
            var otextarea=document.getElementById(csid);
            if (otextarea){
                otextarea.value=cscontent;
            }
            if (typeof run_fn == 'function'){
                run_fn(cscontent);
            }
        }
    }
    
    if (typeof idb_bigfile_b !== 'function'){
        console.log('未发现函数 idb_bigfile_b');
        return;
    }
    
    if (filename===false){
        filename=prompt('输入要读取的文件名称');
        if (filename==null){return;}
    }
    
    idb_bigfile_b('read','content',filename,sub_import_bigfile_content_b);
}

function load_js_var_file_b(varname,file_list,filename='',csfn=false,do_echo=true,direct_from_bigfile=false,csmax=-1,cswait=2000){
    function sub_load_js_var_file_b_bigfile_test(cslist){
        if (cslist.length>0){
            if (filename!==''){
                idb_bigfile_b('read','eval',filename);
                load_var_b(varname,csmax,cswait,csfn);        
            } else {
                conosole.log('filename 为空');
            }
        } else {
            if (typeof csfn == 'function'){
                csfn(false);
            }
        }
    }
    
    function sub_load_js_var_file_b_bigfile_eval(){
        if (eval('typeof '+varname) == 'undefined'){
            if (typeof idb_bigfile_b !== 'function'){
                console.log('未发现函数 idb_bigfile_b');
                return;
            }
            if (filename!==''){
                console.log('尝试从bigfile载入',varname);
                idb_bigfile_b('read','',filename,sub_load_js_var_file_b_bigfile_test);
            } else {
                conosole.log('filename 为空');
            }
        }
    }
    //-----------------------
    //file_list 每个元素形如：[ "js", "http://aaa/bbb.js", "" ] - 保留注释
    if (eval('typeof '+varname) == 'undefined'){
        if (do_echo){
            console.log(varname+' 未定义');
        }
        if (varname!=='remote_server_check_global' && (direct_from_bigfile || local_storage_get_b('first_source_bigfile')=='1')){
            sub_load_js_var_file_b_bigfile_eval();
        } else {
            file_dom_create_b(file_list,true,'js');
            load_var_b(varname,csmax,cswait,csfn,sub_load_js_var_file_b_bigfile_eval);
        }
    } else {
        if (do_echo){
            console.log(varname+' 已存在');        
        }
    }
}

function prompt_from_local_storage_b(cscaption,csid){
    var old_value=local_storage_get_b(csid);
    var current_value=prompt(cscaption,old_value);
    if (current_value==null){return current_value;}
    if (current_value!==old_value){
        localStorage.setItem(csid,current_value);
    }
    return current_value;
}

function tf_page_count_b(prefix='',suffix=''){
    //光盘柜
    //注意：${HOME}/klwebphp/data/klwiki/mediawiki_pagelist.txt - 保留注释
    var blcount=3;   //只能是个位数 - 保留注释
    if (prefix=='' && suffix==''){
        return blcount;
    } else {
        var list_t=[];
        for (let blxl=1;blxl<=blcount;blxl++){
            list_t.push(prefix+'0'+blxl+suffix);
        }
        return list_t;
    }
}

function lines_split_b(cslist,cskey,is_reg=false,include_head=false,show_test=false){
    var no_list=[];
    var bllen=cslist.length;
    if (is_reg){
        for (let blxl=0;blxl<bllen;blxl++){
            if (cslist[blxl].match(cskey)){
                no_list.push(blxl);
            }
        }
    } else {
        for (let blxl=0;blxl<bllen;blxl++){
            if (cslist[blxl]==cskey){
                no_list.push(blxl);
            }
        }    
    }
    
    no_list.push(bllen);
    
    var result_t=[];
    if (include_head){
        for (let blxl=0,lent=no_list.length-1;blxl<lent;blxl++){
            result_t.push(cslist.slice(no_list[blxl],no_list[blxl+1]));
        }
    } else {
        for (let blxl=0,lent=no_list.length-1;blxl<lent;blxl++){
            result_t.push(cslist.slice(no_list[blxl]+1,no_list[blxl+1]));
        }
    }
    
    var top_part=[];
    if (no_list[0]!==0){
        top_part=cslist.slice(0,no_list[0]);
    }
    
    if (show_test){
        var bljg=[].concat(top_part);
        for (let item of result_t){
            bljg=bljg.concat(item);
        }
        console.log(array_difference_b(bljg,cslist,false,true),bljg.join('\n')==cslist.join('\n'));
    }
    return [result_t,top_part];
}

function close_window_alert_b(){
    window.addEventListener('beforeunload', function (event){
        event.preventDefault(); // 阻止默认的卸载行为（如果需要用户确认后才决定是否离开页面）
        event.returnValue = '您确定要离开此页面吗？'; // 弹出的提示信息，部分浏览器可能不显示自定义信息
    });    
}

function two_list_diff_b(list1=false,list2=false,textarea_id1='textarea_old_diff_b',textarea_id2='textarea_new_diff_b',more_buttons1='',more_buttons2='',caption1='左侧',caption2='右侧'){
    function sub_two_list_diff_b_compare(list1,list2,unit='行'){
        var diff_str='<p>';
        var diff1_str='';
        var diff2_str='';
        var is_ok=false;
        if (list1.join('\n')==list2.join('\n')){
            diff_str=diff_str+'两者一致。';
            is_ok=true;
        } else {
            diff_str=diff_str+'两者不一致。';
            list1.sort();
            list2.sort();
            if (list1.join('\n')==list2.join('\n')){
                diff_str=diff_str+'两者排序后一致。';
                is_ok=true;
            } else {
                diff_str=diff_str+'两者排序后不一致。';        
                list1=array_unique_b(list1);    //不会修改作为参数传入的原始的 list1 - 保留注释
                list2=array_unique_b(list2);
                list1.sort();
                list2.sort();
                if (list1.join('\n')==list2.join('\n')){
                    diff_str=diff_str+'去除重复'+unit+'并排序后两者一致。';
                } else {
                    diff_str=diff_str+'去除重复'+unit+'并排序后两者不一致。';
                    
                    var diff_row1,diff_row2;
                    [diff_row1,diff_row2]=array_difference_b(list1,list2,false,true);
                    if (diff_row2.length==0){
                        diff_str=diff_str+'去除重复'+unit+'后'+caption2+'是'+caption1+'的子集。';
                    } else if (diff_row1.length==0){
                        diff_str=diff_str+'去除重复'+unit+'后'+caption1+'是'+caption2+'的子集。';
                    } else {
                        diff_str=diff_str+'去除重复'+unit+'后两者无包含关系。';
                    }
                    if (diff_row1.length>0){
                        diff1_str='<p>去除重复'+unit+'后'+caption1+'含有'+caption2+'不含有 '+diff_row1.length+' 行。前几'+unit+'：</p><div class="div_two_list_diff_1">';
                        diff1_str=diff1_str+array_2_li_b(diff_row1);
                        diff1_str=diff1_str+'</div>';
                    }
                    if (diff_row2.length>0){
                        diff2_str='<p>去除重复'+unit+'后'+caption2+'含有'+caption1+'不含有 '+diff_row2.length+' 行。前几'+unit+'：</p><div class="div_two_list_diff_2">';
                        diff2_str=diff2_str+array_2_li_b(diff_row2);
                        diff2_str=diff2_str+'</div>';
                    }
                }
            }
        }
        return [diff_str+diff1_str+diff2_str,is_ok];
    }
    
    if (list1===false){
        list1=document.getElementById(textarea_id1).value.split('\n');
    }
    if (list2===false){
        list2=document.getElementById(textarea_id2).value.split('\n');
    }

    var bljg='<table width=100%><tr>';
    bljg=bljg+'<td valign=top width=50%>';
    bljg=bljg+'<p><b>删除行</b>('+list1.length+') ';
    if (textarea_id1!==false){
        bljg=bljg+'<button type="button" onclick="document.getElementById(\''+textarea_id1+'\').select();document.execCommand(\'copy\');">Copy</button>';
    }
    bljg=bljg+(more_buttons1==''?'':more_buttons1)+'</p>';
    if (textarea_id1!==false){
        bljg=bljg+'<textarea id="'+textarea_id1+'" style="height:15rem;">'+list1.join('\n')+'</textarea>';
    }
    bljg=bljg+'</td>';
    bljg=bljg+'<td valign=top width=50%>';
    bljg=bljg+'<p><b>添加行</b>('+list2.length+') ';
    if (textarea_id2!==false){
        bljg=bljg+'<button type="button" onclick="document.getElementById(\''+textarea_id2+'\').select();document.execCommand(\'copy\');">Copy</button>';
    }
    bljg=bljg+(more_buttons2==''?'':more_buttons2)+'</p>';
    if (textarea_id2!==false){    
        bljg=bljg+'<textarea id="'+textarea_id2+'" style="height:15rem;">'+list2.join('\n')+'</textarea>';
    }
    bljg=bljg+'</td>';
    bljg=bljg+'</tr></table>';

    var diff_row_str='';
    var diff_word_str='';
    var is_ok=true;
    
    [diff_row_str,is_ok]=sub_two_list_diff_b_compare(list1,list2,'行');
    if (!is_ok){
        var words1=list1.join(' ').split(/\s+/g);
        var words2=list2.join(' ').split(/\s+/g);
        [diff_word_str,is_ok]=sub_two_list_diff_b_compare(words1,words2,'单词');
        diff_word_str='<h4>单词比较</h4>'+diff_word_str;
    }
    
    return [bljg,'<h4>行比较</h4>'+diff_row_str+diff_word_str];
}

function key_location_diff_b(csarr){
    //csarr 形如 [[1,'textarea_diff_1'],[2,'textarea_diff_2']]; - 保留注释
    for (let item of csarr){
        var olis=document.querySelectorAll('.div_two_list_diff_'+item[0]+' li');
        for (let one_li of olis){
            one_li.style.cursor='pointer';
            one_li.addEventListener('click',
                function(e){
                    document.getElementById(item[1]).scrollIntoView();
                    textarea_top_bottom_b(item[1],this.innerHTML);
                },false
            );
        }
    }
}

function readlater_start_year_b(){
    return 2019;
}

function delimiter_get_b(csdelimiter){
    csdelimiter=csdelimiter.replace(/\\n/g,'\n').replace(/\\t/g,'\t');
    return csdelimiter;
}

function arr_max_min_get_b(csarr,arr_in_col=-1,value_in_col=1,ignore_nan=true,ignore_null=true){
    var value_list=[];
    for (let arow of csarr){
        var blarray=(arr_in_col==-1?arow:arow[arr_in_col]);
        for (let item of blarray){
            var blvalue=item[value_in_col];
            if (ignore_null && blvalue==null || ignore_nan && isNaN(blvalue)){continue;}
            value_list.push(blvalue);
        }
    }
    
    if (value_list.length==0){return [false,false];}
    
    value_list.sort(function (a,b){return a<b?-1:1;});
    minValue = value_list[0];
    maxValue = value_list[value_list.length-1];
    
    return [minValue,maxValue];
}

function zero_prefix_b(csnum,prefix='0'){
    var bllen=csnum.toString().length;
    return [-1*bllen,prefix.repeat(bllen)];
}

function upload_files_to_list_b(input_id,run_fn=false,csext='',csmax_count=10,csmax_size=false){
    function sub_upload_files_to_list_b_check(one_file){
        var error='';
        if (!one_file){
            error='未发现文件';
        }
        if (one_file.size>csmax_size){
            error='文件太大：'+one_file.name+' '+one_file.size;  
        }
        
        var blext=one_file.name.substring(one_file.name.toLowerCase().lastIndexOf('.'),).toLowerCase();
        console.log(blext);
        
        if (error!==''){
            alert(error);
        }        
        return error;    
    }
    
    function sub_upload_files_to_list_b_2_arr(){
        if (typeof run_fn == 'function'){
            result_t.sort(function (a,b){return a[0]>b[0] ? 1 : -1;});  //文件名 - 保留注释        
            run_fn(result_t);
        }
    }
    
    function sub_upload_files_to_list_b_one_step(){
        if (blxl>=bllen){return;}
        if (sub_upload_files_to_list_b_check(ofiles[blxl])!==''){return;}
                
        var textFileReader = new FileReader();
        textFileReader.readAsText(ofiles[blxl]);
        textFileReader.onload = function (){
            result_t.push([ofiles[blxl].name,this.result]);
            if (blxl==bllen-1){
                document.title=old_title;            
                sub_upload_files_to_list_b_2_arr();
            } else {
                blxl=blxl+1;
                document.title=blxl+'/'+bllen+' - '+old_title;
                setTimeout(sub_upload_files_to_list_b_one_step,1);
            }
        }
    }
    
    if (csmax_size===false){
        csmax_size=100*1024*1024;
    }
    
    var ofiles=document.getElementById(input_id).files;
    var bllen=ofiles.length;
    if (bllen>csmax_count){
        alert('文件超过'+csmax_count+'个');
        return;
    }

    for (let one_file of ofiles){
        if (sub_upload_files_to_list_b_check(one_file)!==''){return;}
    }

    if (!confirm('是否上传 '+bllen+' 个文件？')){return;}
    var blxl=0;
    var old_title=document.title;
    var result_t=[];
    sub_upload_files_to_list_b_one_step();
}

function search_key_split_b(cswordlist=[]){
    var reg_error=false;

    if (cswordlist.length==0){
        var oinput=document.getElementById('input_search');
        if (!oinput){return [reg_error,[]];}
        
        var cswordlist=oinput.value.trim();
    }
    
    if (typeof cswordlist == 'string'){
        if (cswordlist.slice(-4,)=='(:r)'){
            cswordlist=cswordlist.slice(0,-4);
        }
        if (cswordlist==''){return [reg_error,[]];}
        cswordlist=cswordlist.split(' ');
    }

    var blkey=[];
    for (let item of cswordlist){
        if (Array.isArray(item)){
            blkey=blkey.concat(item);
            continue;
        }
        if (item.substring(0,1)=='-'){continue;}
        
        if (item.substring(0,1)=='+'){
            item=item.substring(1,);
        }
        if (item.substring(0,1)=='(' && item.slice(-1)==')'){
            item=item.slice(1,-1);
        }
        item=item.replace(/\.\*|\||\.\+|\[|\]/g,' ');
        blkey=blkey.concat(item.split(' '));
    }
    blkey=array_unique_b(blkey);
    
    var blkey2=[];
    for (let item of blkey){
        if (item.trim()==''){continue;}
        item=item.replace(/\\s/g,' ');
        if (item.includes('\\') || item.includes('(') || item.includes(')')){
            console.log('忽略',item);
            continue;
        }
        blkey2.push(item);
    }
    
    for (let one_key of blkey2){
        try {
            var bltmp=''.replace(new RegExp(one_key,'g'),'');
        } catch (error){
            console.log(error.message); //此行保留 - 保留注释
            reg_error=true;
            break;
        }
    }
    return [reg_error,blkey2];
}

function arr_key_includes_sort_b(csarr,key_list,colno=-1){
    var t0 = performance.now();

    if (key_list.length==0){return csarr;}

    var result_t=[];
    for (let arow of csarr){
        if (colno==-1){
            var bltext=arow.toString();
        } else {
            var bltext=arow[colno].toString();
        }
        var blcount=0;
        for (let one_key of key_list){
            if (bltext.includes(one_key)){
                blcount=blcount+1;
            }
        }
        result_t.push([arow,blcount]);
    }
    result_t.sort(function(a,b){return a[1]<b[1]?1:-1;});   //逆序 - 保留注释
    result_t=array_split_by_col_b(result_t,[0]);
    console.log('arr_key_includes_sort_b()',key_list,'费时：'+(performance.now() - t0) + ' milliseconds');
    return result_t;
}

function urllib_parse_quote_b(csstr){
    csstr=encodeURIComponent(csstr);
    csstr = csstr.replace(/%2F/g, '/');

    csstr = csstr.replace(/!/g, '%2F');
    csstr = csstr.replace(/\*/g, '%2A');
    csstr = csstr.replace(/'/g, '%27');
    csstr = csstr.replace(/\(/g, '%28');
    csstr = csstr.replace(/\)/g, '%29');
    return csstr;
}

function import_arr_b(csstr,var_name,is_csv=false,run_fn_onsuccess=false,run_fn_onfailure=false){
    var list_t=csstr.split('\n');
    if (is_csv){
        if (!confirm('是否每行添加[],，再载入'+list_t.length+'条记录？')){return;}
        for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
            list_t[blxl]='['+list_t[blxl]+'],';
        }
        csstr=list_t.join('\n');
    } else {
        if (!confirm('是否以数组形式直接载入'+list_t.length+'条记录？')){return;}
    }
    
    try {
        eval(var_name+'=['+csstr+']');
        alert('载入完成');
        if (typeof run_fn_onsuccess == 'function'){
            run_fn_onsuccess();
        }
    } catch (error){
        var info=array_check_b(csstr);
        if (info==''){
            alert(error);
        } else {
            alert(info);
        }
        console.log(error);
        if (typeof run_fn_onfailure == 'function'){
            run_fn_onfailure();
        }
    }
}
