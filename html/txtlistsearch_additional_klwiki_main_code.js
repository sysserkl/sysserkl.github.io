function menu_more_kltxt_klwiki_main(){
    var ospan=document.getElementById('span_for_more_menu_kltxt');
    if (!ospan){return;}

    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'yymmdd_kltxt_klwiki_main();">联合早报yymmdd不一致检索</span>',    
    '<span class="span_menu" onclick="'+str_t+'weixin_kltxt_klwiki_main();">微信sharer_shareid</span>',    
    '<span class="span_menu" onclick="'+str_t+'theregister_without_r_kltxt_klwiki_main();">当前范围 theregister without ® and Sponsor</span>',
    '<span class="span_menu" onclick="'+str_t+'eword_duplicate_kltxt_klwiki_main();">行内重复 eword 检索</span>',
    
    ];

    var blstr=klmenu_b(klmenu1,'W','25rem','1rem','1rem','30rem');
    ospan.outerHTML=blstr;
}

function yymmdd_kltxt_klwiki_main(){
    txtsearch_kltxt_b('+zaobao +\\d{8}.*\\d{8}\\s*\\| -(\\d{8})-[^\\s]*\\s*\\1\\s*\\|',true,false,false);
}

function weixin_kltxt_klwiki_main(){
    txtsearch_kltxt_b('sharer_shareid',false,false,false);
}

function eword_duplicate_kltxt_klwiki_main(){
    txtsearch_kltxt_b('&lt;eword.*&lt;eword',true,false,false,function (){menu_insert_kltxt_b(1);});
}

function theregister_without_r_kltxt_klwiki_main(){
    var start_lineno,end_lineno,blmax;
    [start_lineno,end_lineno,blmax]=start_end_lineno_kltxt_b();
    var result_t=[];
    
    var bltitle=['',-1];
    var title_added=new Set();
    var h3=[];
    var found_r=false;
	for (let blxl=start_lineno;blxl<end_lineno;blxl++){
        if (filelist[blxl].match(/^<title>.*<\/title>$/)){
            bltitle=[filelist[blxl],blxl];
        }

        if (filelist[blxl].endsWith('®') || filelist[blxl].startsWith("''Sponsored by") || filelist[blxl].startsWith("'''Sponsored Feature''' ")){
            if (h3.length>0){
                found_r=true;
            }
        }
        
        if (filelist[blxl].match(/^==.*==$/) || filelist[blxl].match(/^<title>.*<\/title>$/)){
            if (found_r==false && h3.length>0){
                if (!title_added.has(bltitle[0])){
                    result_t.push(bltitle);
                    title_added.add(bltitle[0]);
                }
                result_t.push(h3);
            }
            found_r=false;
            
            h3=[];            
            if (filelist[blxl].match(/^===.*theregister\.com\/.*===$/)){
                h3=[filelist[blxl],blxl];
            }
        }
    }
    lines_2_html_kltxt_b(result_t);
}
