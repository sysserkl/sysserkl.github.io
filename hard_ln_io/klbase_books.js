function book_makelist_b(cstag='all'){
    //cstag 支持如：“历史 幻想” 等表达式 - 保留注释
    var list_t=[];
    var blreg=false;
    if (cstag.slice(-4,)=='_reg'){
        cstag=cstag.substring(0,cstag.length-4);
        blreg=true;
    }
    if (csbookno_global>=0){
        var list_t=csbooklist_sub_global_b[csbookno_global];
    }
    var list2_t=[];
    if (csbookno2_global_b>=0){
        var list2_t=csbooklist_sub_global_b[csbookno2_global_b];
    }
    
    csbooklist_sub_global_b=[];
    if (cstag=='' || cstag=='all'){
        for (let item of csbooklist_source_global){
            csbooklist_sub_global_b.push(item);
        }
    }
    else {
        for (let item of csbooklist_source_global){
            search_t=str_reg_search_b(item,cstag,blreg);
            if (search_t==-1){break;}
            if (search_t){
                csbooklist_sub_global_b.push(item);
            }
        }
    }
    
    if (list_t.length>0){
        csbookno_global=csbooklist_sub_global_b.indexOf(list_t);
    }    
    if (list2_t.length>0){
        csbookno2_global_b=csbooklist_sub_global_b.indexOf(list2_t);
    }
}

function book_href_check_b(is_attach=true){
    var cshref=location.href;
    
    if ((cshref.includes('/klwebphp/') || cshref.includes('/klwebphp_backup/')) && !cshref.includes('/PythonTools/')){
        if (is_attach){
            return 'PythonTools/data/selenium_news/jsdoc_attachment/';
        }
        else {
            return 'PythonTools/data/selenium_news/jsdoc3/';
        }
    }
    else {
        if (is_attach){    
            return new URL('../',cshref)['href']+'jsdoc_attachment/';
        }
        else {
            return new URL('../',cshref)['href']+'jsdoc3/';
        }
    }
}

function book_path_py_b(csname,jsdoc_num){
    return book_href_check_b(true)+csname+jsdoc_num+'/';
}

function book_path_b(jsdoc_num,is_private=false){
    var blhref=location.href;
    var is_file=(blhref.substring(0,5)=='file:');
    if (jsdoc_num=='3'){
        return book_href_check_b(false);
    }
    else if (jsdoc_num.toString().includes('digest')){
        if (is_private){
            if (is_file){
                return blhref.split('/klwebphp/')[0]+'/jsdoc/jsdoc'+jsdoc_num.replace('digest','')+'/digest/';
            }
            else {
                return blhref.split('/klwebphp/')[0]+'/klwebphp/jsdoc'+jsdoc_num.replace('digest','')+'/digest/';
            }        
        }
        else {
            return book_href_check_b(true)+jsdoc_num+'/';
        }
    }
    else {
        if (blhref.includes('/klwebphp/')){
            if (is_file){
                blhref=blhref.split('/klwebphp/')[0]+'/jsdoc/jsdoc'+jsdoc_num+'/';
            }
            else {
                blhref=blhref.split('/klwebphp/')[0]+'/klwebphp/jsdoc'+jsdoc_num+'/';
            }
        }
        else if (blhref.includes('/klwebphp_backup/')){
            if (is_file){
                blhref=blhref.split('/klwebphp_backup/')[0]+'/jsdoc_backup/jsdoc'+jsdoc_num+'/'; //是 /jsdoc_backup/ 而不是 /jsdoc/ - 保留注释
            }
            else {
                blhref=blhref.split('/klwebphp_backup/')[0]+'/klwebphp_backup/jsdoc'+jsdoc_num+'/';
            }
        }
        else {
            blhref=new URL('../',blhref)['href']+'jsdoc'+jsdoc_num+'/';
        }    
        return blhref;
    }
}

function import_one_book_b(bookname,jsdoc_num,do_write=true){
    //bookname: klwiki_en.js - 保留注释
    filelist=[];    //全局变量 - 保留注释
    var blpath_name=book_path_b(jsdoc_num)+bookname+(is_local_b()?'?'+today_str_b('d',''):'');
    if (do_write){
        document.write('\n<script src="'+blpath_name+'"><\/script>\n');
        console.log(blpath_name);
    }
    return blpath_name;
}

function import_book_js_b(import_digest=true){
    var book_no = csbookno_global;
    var today=(is_local_b()?'?'+today_str_b('d',''):'');
    if (csbookno2_global_b>=0){
        var jsdoc_num='';
        if (csbooklist_sub_global_b[csbookno2_global_b].length>=4){
            jsdoc_num=csbooklist_sub_global_b[csbookno2_global_b][3];
        }
        var jsdoc_path=book_path_b(jsdoc_num);
	    document.write('\n<script src="'+jsdoc_path+csbooklist_sub_global_b[csbookno2_global_b][0]+'.js'+today+'"><\/script>\n');
        console.log(jsdoc_path+csbooklist_sub_global_b[csbookno2_global_b][0]+'.js'+today);
        //以下2行保留，第2本书忽略目录和摘要 - 保留注释
	    //document.write('\n<script src="'+jsdoc_path+'menu/'+csbooklist_sub_global_b[csbookno2_global_b][0]+'_menu.js"><\/script>\n');
	    //document.write('\n<script src="'+jsdoc_path+'digest/'+csbooklist_sub_global_b[csbookno2_global_b][0]+'_digest.js"><\/script>\n');

        document.write('\n<script>\n');
        document.write('\nvar filelist2=[];\n');
        document.write('\nfor (let item of filelist) {\n');
        document.write('\n    filelist2.push(item);\n');
        document.write('}\n</script>\n');
    }
    //----
    var jsdoc_num='';
    if (csbooklist_sub_global_b.length>0 && csbooklist_sub_global_b[book_no].length>=4){
        jsdoc_num=csbooklist_sub_global_b[book_no][3];
    }
    if (csbooklist_sub_global_b.length>0){
        var book_type=book_type_b(csbooklist_sub_global_b[book_no]);

        var jsdoc_path=book_path_b(jsdoc_num,book_type.includes('P'));
        var bookid=csbooklist_sub_global_b[book_no][0];
        document.write('\n<script src="'+jsdoc_path+bookid+'.js'+today+'"><\/script>\n');
        console.log(jsdoc_path+bookid+'.js'+today);
        
        if (jsdoc_num.includes('digest')){
            document.write('\n<script>\n');
            document.write('var filelist=[];\n');
            document.write('for (let item of digest_global) {\n');
            document.write('    filelist.push(item);\n');
            document.write('}\n');
            document.write('</script>\n');        
        }
        else {
            menu_digest_file_full_name_b(book_no,jsdoc_num,bookid,jsdoc_path,import_digest,true);
        }
        
        txtbook_js_code_file_global='';
        if (book_type.includes('J')){
            txtbook_js_code_file_global=bookid;
        }
    }
}

function digest_get_enwords_b(is_set=true,is_lower=false){
    var result_t=[];
    for (let item of digest_global){
        if (item.substring(0,1)=='*'){
            if (is_lower){
                result_t.push(item.substring(1,).trim().toLowerCase());            
            }
            else {
                result_t.push(item.substring(1,).trim());
            }
        }
    }
    if (is_set){
        return new Set(result_t);
    }
    return result_t;
}

function menu_digest_file_full_name_b(book_no=false,jsdoc_num=false,bookid=false,jsdoc_path=false,import_digest=true,do_write=false){
    if (csbooklist_sub_global_b.length==0){
        return ['',''];
    }
    
    if (book_no==false){
        book_no=csbookno_global;
    }
    
    if (jsdoc_num==false){
        if (csbooklist_sub_global_b[book_no].length>=4){
            jsdoc_num=csbooklist_sub_global_b[book_no][3];    
        }
        else {
            jsdoc_num='';
        }
    }

    var book_type=book_type_b(csbooklist_sub_global_b[book_no]);

    if (jsdoc_path==false){
        jsdoc_path=book_path_b(jsdoc_num,book_type.includes('P'));
    }
    if (bookid==false){
        bookid=csbooklist_sub_global_b[book_no][0];
    }
    
    var result_t=[];
    var js_menu_file='';
    var js_digest_file='';

    if (book_type.includes('P')){
        js_menu_file=jsdoc_path+'menu/'+bookid+'_menu.js';
        result_t.push(['js',js_menu_file,'']);
        
        if (import_digest){
            js_digest_file=jsdoc_path+'digest/'+bookid+'_digest.js';
            result_t.push(['js',js_digest_file,'']);
        }
    }
    else {
        js_menu_file=book_path_py_b('menu',jsdoc_num)+bookid+'_menu.js';
        result_t.push(['js',js_menu_file,'']);

        if (import_digest){
            js_digest_file=book_path_py_b('digest',jsdoc_num)+bookid+'_digest.js';
            result_t.push(['js',js_digest_file,'']);
        }
    }
    
    if (do_write){
        write_js_css_b(result_t);
    }

    var today=(is_local_b()?'?'+today_str_b('d',''):'');    
    if (import_digest){
        return [js_menu_file+today,js_digest_file+today];
    }
    else {
        return [js_menu_file+today,''];
    }
}

function books_b(showall=false,cstype='txt',cstag='all'){   //书目生成，category - 保留注释
	var blword = '';
	var tmp_o=document.getElementById('input_search');
	if (tmp_o){
        blword = specialstr_html_b(tmp_o.value.trim());
    }
    
	var blreg='';
	tmp_o=document.getElementById('input_reg');
	if (tmp_o){
		if (tmp_o.checked==true){blreg='_reg';}
	}
	
	var bljg='';
	var left1str1_tmp='';
	var left1str2_tmp='';
    
    var today = new Date();
    var day_t=today.getDate();
    var month_t=today.getMonth()+1;
    var day_t2=months_b(month_t-1)+day_t;
    if (day_t2>182){
        day_t2=day_t2-182;
    }
    var today_xl=1;
    
    var blshow_no=(location.href.includes('/txtlistsearch.htm')?1:0);
	for (let blno=0;blno<csbooklist_sub_global_b.length;blno++){
        var item=csbooklist_sub_global_b[blno];
        var asc_t=asc_sum_b(item[0]+item[1]);
		if (csbooklist_sub_global_b.length<=5 || showall || blno==0 || Math.abs(csbookno_global-blno)<=blshow_no || csbooklist_sub_global_b.length-1==blno || csbookno_global==blno || asc_t%182+1==day_t2){
			if (csbookno_global==blno){
                bljg=bljg+'<font color=#ff0000>';
            }
            //#dfdf7f 棕青色 - 保留注释
			if (asc_t%182+1==day_t2){
				bljg=bljg+'<span style="border-bottom:3px solid #ff0000;margin-right:2px;">('+today_xl+')-';
                today_xl=today_xl+1;
			}
			bljg=bljg+(parseInt(blno)+1)+'. ';

			if (asc_t%182+1==day_t2){
				bljg=bljg+'</span>';
			}

			if (csbookno_global==blno){
                bljg=bljg+'</font>';
            }
			if (cstype=='txt'){
                bljg=bljg+'<a class="a_oblong_box" '+(item[3]=='3'?'style="background-color:'+scheme_global['button']+';" ':'')+'href="?'+item[0]+'_tag'+cstag;
                if (blword+blreg==''){
                    bljg=bljg+'&line=1';
                }
                else {
                    bljg=bljg+'&s='+blword+blreg;
                }
                bljg=bljg+'">';
            }
			else if (cstype=='eng'){
                bljg=bljg+'<a class="a_oblong_box" href="?book='+(parseInt(blno)+1)+'">';
            }
			if (csbookno_global==blno){
				bljg=bljg+'<font color=#ff0000>';
			}
			bljg=bljg+item[1];
			if (csbookno_global==blno){
                bljg=bljg+'</font>';
            }
            if (item[2].includes('已整理')){   //待完成整理后，删除
                bljg=bljg+'✔';
            }
			if (cstype=='txt' || cstype=='eng'){
                bljg=bljg+'</a> ';
            }
		}
		else {
            bljg=bljg+'. . . ';
        }
	}
    
	while (bljg.indexOf('. . . . ')>=0){
        bljg=bljg.replace(new RegExp(/(\. ){4}/g),'. . . ');
    }
	
	tmp_o=document.getElementById('booklinks');
	if (tmp_o){
        tmp_o.innerHTML=bljg;
    }
	else {
        return bljg;
    }
	return '';
}

function book_category_b(csid='',otherlists=[],cstag='',cstype=''){
    //全部书籍的分类
    var list_t=[].concat(otherlists);
    for (let item of csbooklist_source_global){
        if (item.length>=3){
            list_t=list_t.concat(item[2].split(','));  //item[2] 可能含有多个, - 保留注释
        }
    }
    list_t=array_unique_b(list_t);
    list_t.sort(function (a,b){return zh_sort_b(a,b,false);}); 
    if (cstype=='list'){
        return list_t;
    }
    
    var blstr=local_storage_get_b('digest_temp_txtlistsearch').trim();
    var bljg=[];
    for (let blxl=1;blxl<=3;blxl++){
        bljg.push('<a class="a_book_category" href="?_tag^'+blxl+'$_reg">'+blxl+'</a> ');
    }
    for (let item of list_t){
        if (item==''){continue;}
        if (item=='📝' && blstr==''){continue;} //无临时摘要则不显示临时摘要图标，但 csbooklist_source_global 中书籍的 tag 中还有 📝 标记 - 保留注释
        if ((' '+cstag+' ').includes(' +'+item+' ') || (' '+cstag+' ').includes(' '+item+' ') && !cstag.includes('+')){
            var redstr=' style="color:red;"';
        }
        else {
            var redstr='';
        }
        bljg.push('<a class="a_book_category" href="?_tag'+item+'"'+redstr+'>'+item+'</a> ');
    }
	var tmp_o=document.getElementById(csid);
	if (tmp_o){
        tmp_o.innerHTML=bljg.join('\n');
    }
    return bljg;
}

function filename_2_bookname_b(filename){
    var bookname_t=filename;
    for (let item of csbooklist_source_global){
        if (item[0]==filename){
            bookname_t=item[1];
            break;
        }
    }
    return bookname_t;
}

function booklist_source_config_b(is_digest=false){
    var last_book=local_storage_get_b('reader_lastbook',-1,true);
    var marked_set=new Set();
    for (let item of last_book){
        var list_t=item.split('&');
        if (list_t.length>=2){
            marked_set.add(list_t[1]);
        }
    }
    
    var temp_digest_set=new Set();
    var list_t=local_storage_get_b('digest_temp_txtlistsearch',-1,true);
    for (let item of list_t){
        temp_digest_set.add(item.split(':')[0]);
    }

    var type_list=[['P','🏳P'],['L','🏳L'],['*','🏳E']];
    for (let blxl=0;blxl<csbooklist_source_global.length;blxl++){
        var item=csbooklist_source_global[blxl];
        var book_type=book_type_b(item);
        if (marked_set.has(item[0])){
            csbooklist_source_global[blxl][2]=csbooklist_source_global[blxl][2]+',🔖';
        }
        if (temp_digest_set.has(item[0])){
            csbooklist_source_global[blxl][2]=csbooklist_source_global[blxl][2]+',📝';
        }
        for (let one_type of type_list){
            if (book_type.includes(one_type[0])){
                csbooklist_source_global[blxl][2]=csbooklist_source_global[blxl][2]+','+one_type[1];
            }
        }
    }
    
    if (is_digest){
        var list_t=[];
        without_digest_book_list_global=[];
        for (let one_book of csbooklist_source_global){
            var blfound=false;
            for (let one_digest of digest_list_source_global){
                if (one_book[0]+'_digest'==one_digest[0]){
                    one_book[0]=one_book[0]+'_digest';
                    one_book[3]='digest'+one_digest[1];
                    list_t.push(one_book);
                    blfound=true;
                    break;
                }
            }
            if (!blfound){
                without_digest_book_list_global.push(one_book);
            }
        }
        csbooklist_source_global=[].concat(list_t);    
    }
    
    csbooklist_source_global.sort(function(a,b){return zh_sort_b(a,b,false,1);});
    
    if (is_digest===false){
        local_storage_today_b('booklist_statistics',40,csbooklist_source_global.length,'/');
        var list_t=local_storage_get_b('booklist_statistics',-1,true);
        if (list_t.length>30){
            local_storage_squash_b('booklist_statistics',list_t,8,0,0.5);
        }
    }
}

function book_type_b(arow,includes_character=false){
    if (includes_character===false){
        return arow[4];
    }
    else {
        return arow[4].includes(includes_character);
    }
}

function books_global_value_init_b(){        
    //以下变量为全局变量，不加 var 或 let - 保留注释
    csbookno_global=-1;
    csbookno2_global_b=-1;
    // csbooklist_sub_global_b 是 csbooklist_source_global 的子集 - 保留注释
    csbooklist_sub_global_b=[];
    //以下变量名若要更改，需要更改 jsdoc 目录下的所有 js 文件及 menu 子目录下的所有 js 文件 - 保留注释
    filelist=[];
    filelist2=[];
    menulist=[];
    digest_global=[];
}

function load_current_book_b(load_digest_file=false,do_write=true){
    var blhref=location.href;
    if (blhref.includes('/klwebphp/')){
        blhref=blhref.split('/klwebphp/')[0]+'/klwebphp/data/';
    }
    else if (blhref.includes('/klwebphp_backup/')){
        blhref=blhref.split('/klwebphp_backup/')[0]+'/klwebphp_backup/data/';
    }    
    else {
        blhref=new URL('../',blhref)['href']+'jsdata/';
    }
    
    var today=(is_local_b()?'?'+today_str_b('d',''):'');
    
    var file_list=[];
    var book_list_js=blhref+'booklist_current_data.js';
    file_list.push(['js',book_list_js,'']);
    
    var digest_js='';
    if (load_digest_file){
        digest_js=blhref+'digest_list_data.js';
        file_list.push(['js',digest_js,'']);
    }
    if (do_write){
        write_js_css_b(file_list);
    }
    return [book_list_js+today,(digest_js==''?'':digest_js+today)];
} 
