function book_makelist_b(cstag='all'){
    var list_t=[];
    var blreg=false;
    if (cstag.slice(-4,)=='_reg'){
        cstag=cstag.substring(0,cstag.length-4);
        blreg=true;
    }
    if (csbookno_global_b>=0){
        var list_t=csbooklist_sub_global_b[csbookno_global_b];
    }
    var list2_t=[];
    if (csbookno2_global_b>=0){
        var list2_t=csbooklist_sub_global_b[csbookno2_global_b];
    }    
    csbooklist_sub_global_b=[];
    for (let item of csbooklist_source_global_b){
        if (cstag=='' || cstag=='all'){
            csbooklist_sub_global_b.push(item);
            continue;
        }
        var search_t=str_reg_search_b(item,cstag,blreg);
        if (search_t==-1){
            break;
        }
        if (search_t){
            csbooklist_sub_global_b.push(item);
        }
    }
    
    if (list_t!==[]){
        csbookno_global_b=csbooklist_sub_global_b.indexOf(list_t);
    }    
    if (list2_t!==[]){
        csbookno2_global_b=csbooklist_sub_global_b.indexOf(list2_t);
    }
}

function book_path_py_b(csname,jsdoc_num){
    var blhref=location.href;
    if ((blhref.includes('/klwebphp/') || blhref.includes('/klwebphp_backup/')) && !blhref.includes('/PythonTools/')){
        return 'PythonTools/data/selenium_news/jsdoc_attachment/'+csname+jsdoc_num+'/';
    }
    else {
        return '../jsdoc_attachment/'+csname+jsdoc_num+'/';
    }
}

function book_path_b(jsdoc_num){
    var blhref=location.href;
    var is_file=(blhref.substring(0,5)=='file:');
    if (jsdoc_num=='3'){
        if ((blhref.includes('/klwebphp/') || blhref.includes('/klwebphp_backup/')) && !blhref.includes('/PythonTools/')){
            return 'PythonTools/data/selenium_news/jsdoc3/';
        }
        else {
            return '../jsdoc3/';
        }
    }
    else if (jsdoc_num.toString().includes('digest')){
        if ((blhref.includes('/klwebphp/') || blhref.includes('/klwebphp_backup/')) && !blhref.includes('/PythonTools/')){
            return 'PythonTools/data/selenium_news/jsdoc_attachment/'+jsdoc_num+'/';
        }
        else {
            return '../jsdoc_attachment/'+jsdoc_num+'/';
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
            blhref='../jsdoc'+jsdoc_num+'/';
        }    
        return blhref;
    }
}

function import_one_book_b(bookname,jsdoc_num){
    //bookname: klwiki_en.js - 保留注释
    document.write('\n<SCRIPT language=JavaScript src="'+book_path_b(jsdoc_num)+bookname+'"><\/SCRIPT\n>');
}

function import_book_js_b(book_no){
	var csnum=arguments.length;
	if (csnum==0){
        var book_no = csbookno_global_b;
    }
   //----
    if (csbookno2_global_b>=0){
        var jsdoc_num='';
        if (csbooklist_sub_global_b[csbookno2_global_b].length>=4){
            jsdoc_num=csbooklist_sub_global_b[csbookno2_global_b][3];
        }
        var jsdoc_path=book_path_b(jsdoc_num);
	    document.write('\n<SCRIPT language=JavaScript src="'+jsdoc_path+csbooklist_sub_global_b[csbookno2_global_b][0]+'.js"><\/SCRIPT>\n');
        //以下2行保留，第2本书忽略目录和摘要 - 保留注释
	    //document.write('\n<SCRIPT language=JavaScript src="'+jsdoc_path+'menu/'+csbooklist_sub_global_b[csbookno2_global_b][0]+'_menu.js"><\/SCRIPT>\n');
	    //document.write('\n<SCRIPT language=JavaScript src="'+jsdoc_path+'digest/'+csbooklist_sub_global_b[csbookno2_global_b][0]+'_digest.js"><\/SCRIPT>\n');

        document.write('\n<script type="text/javascript">\n');
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
        var jsdoc_path=book_path_b(jsdoc_num);
        var bookid=csbooklist_sub_global_b[book_no][0];
        document.write('\n<SCRIPT language=JavaScript src="'+jsdoc_path+bookid+'.js"><\/SCRIPT>\n');
        if (jsdoc_num.includes('digest')){
            document.write('\n<script type="text/javascript">\n');
            document.write('\nvar filelist=[];\n');
            document.write('\nfor (let item of digest_global) {\n');
            document.write('\n    filelist.push(item);\n');
            document.write('}\n');
            //document.write('digest_global=[];\n');
            document.write('</script>\n');        
        }
        else {
            if (csbooklist_sub_global_b[book_no][4].includes('P')){
                document.write('\n<SCRIPT language=JavaScript src="'+jsdoc_path+'menu/'+bookid+'_menu.js"><\/SCRIPT>\n');
            }
            else {
                document.write('\n<SCRIPT language=JavaScript src="'+book_path_py_b('menu',jsdoc_num)+bookid+'_menu.js"><\/SCRIPT>\n');
            }
            document.write('\n<SCRIPT language=JavaScript src="'+book_path_py_b('digest',jsdoc_num)+bookid+'_digest.js"><\/SCRIPT>\n');     
        }
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

    if (location.href.includes('txtlistsearch.htm')){
        var blsite='txtlistsearch.htm';
    }
    else if (location.href.includes('digest.htm')){
        var blsite='digest.htm';
    }    
    else {
        var blsite='reader.htm';
    }
    
    var blshow_no=(location.href.includes('/txtlistsearch.htm')?1:0);
	for (let blno=0;blno<csbooklist_sub_global_b.length;blno++){
        var item=csbooklist_sub_global_b[blno];
        var asc_t=asc_sum_b(item[0]+item[1]);
		if (csbooklist_sub_global_b.length<=5 || showall || blno==0 || Math.abs(csbookno_global_b-blno)<=blshow_no || csbooklist_sub_global_b.length-1==blno || csbookno_global_b==blno || asc_t%182+1==day_t2){
			if (csbookno_global_b==blno){
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

			if (csbookno_global_b==blno){
                bljg=bljg+'</font>';
            }
			if (cstype=='txt'){
                bljg=bljg+'<a class="a_oblong_box" '+(item[3]=='3'?'style="background-color:'+scheme_global['button']+';" ':'')+'href="'+blsite+'?'+item[0]+'_tag'+cstag;
                if (blword+blreg==''){
                    bljg=bljg+'&line=1';
                }
                else {
                    bljg=bljg+'&s='+blword+blreg;
                }
                bljg=bljg+'">';
            }
			else if (cstype=='eng'){
                bljg=bljg+'<a class="a_oblong_box" href="enwords_book.htm?book='+(parseInt(blno)+1)+'">';
            }
			if (csbookno_global_b==blno){
				bljg=bljg+'<font color=#ff0000>';
			}
			bljg=bljg+item[1];
			if (csbookno_global_b==blno){
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
            bljg=bljg+'. ';
        }
	}
    
	while (bljg.indexOf('. . . . ')>=0){
        bljg=bljg.replace(new RegExp(/(\. ){4}/g),". . . ");
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

function book_category_b(csid,otherlists=[],cstag=''){
    //全部书籍的分类
    var bljg='';
    for (let item of csbooklist_source_global_b){
        if (item.length>=3){
            bljg=bljg+item[2]+',';
        }
    }
    
    var list_t=bljg.split(',');
    for (let item of otherlists){
        list_t.push(item);    
    }
    list_t=array_unique_b(list_t);

    list_t.sort(function (a,b){return zh_sort_b(a,b,false);}); 

    bljg='';
    if (location.href.includes('txtlistsearch.htm')){
        var blsite='txtlistsearch.htm';
    }
    else if (location.href.includes('digest.htm')){
        var blsite='digest.htm';
    }    
    else {
        var blsite='reader.htm';
    }
    
    for (let item of list_t){
        if (item==''){continue;}
        if (item==cstag){
            bljg=bljg+'<a href="'+blsite+'?_tag'+item+'" style="color:red;">'+item+'</a> ';
        }
        else {
            bljg=bljg+'<a href="'+blsite+'?_tag'+item+'">'+item+'</a> ';
        }
    }
	var tmp_o=document.getElementById(csid);
	if (tmp_o){
        tmp_o.innerHTML=bljg;
    }
	else {
        return bljg;
    }
}

function books_id2name_b(bookid){
    var str_t='';
    for (let a_element of csbooklist_source_global_b){
        if (a_element[0]==bookid){
            str_t=a_element[1];
            break;
        }
    }
    return str_t;
}

function books_init_b(){
    csbookno_global_b=-1;
    csbookno2_global_b=-1;
    // csbooklist_sub_global_b 是 csbooklist_source_global_b 的子集 - 保留注释
    csbooklist_sub_global_b=[];
    //以下变量名若要更改，需要更改 jsdoc 目录下的所有 js 文件及 menu 子目录下的所有 js 文件 - 保留注释
    filelist=[];
    filelist2=[];
    menulist=[];
    //menulist2=[];
    digest_global=[];
    //digest2_global=[];
    //以上变量不加 var 或 let - 保留注释
    //for (let blxl=1;blxl<=4;blxl++){
        //csbooklist_source_global_b.push(["klwiki"+("0"+blxl).slice(-2),"KLWiki"+("0"+blxl).slice(-2)+"*","KLWiki0","2"]);
    //}

    csbooklist_source_global_b.sort(function(a,b){return zh_sort_b(a,b,false,1);});

    local_storage_today_b('booklist_statistics',40,csbooklist_source_global_b.length,'/');
    var list_t=local_storage_get_b('booklist_statistics',-1,true);
    if (list_t.length>30){
        local_storage_squash_b('booklist_statistics',list_t,8,0,0.5);
    }
}

function load_current_book_b(){
    var blhref=location.href;
    if (blhref.includes('/klwebphp/')){
        blhref=blhref.split('/klwebphp/')[0]+'/klwebphp/data/booklist_current_data.js';
    }
    else if (blhref.includes('/klwebphp_backup/')){
        blhref=blhref.split('/klwebphp_backup/')[0]+'/klwebphp_backup/data/booklist_current_data.js';
    }    
    else {
        blhref='../jsdata/booklist_current_data.js';
    }
    document.write('<SCRIPT language=JavaScript src="'+blhref+'"></script>\n');
} 
