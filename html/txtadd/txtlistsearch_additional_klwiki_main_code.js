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

    var group_list=[
    ['批量打开','title_batch_open_klwiki_main();',true],
    ['复制10个','title_batch_open_klwiki_main(true,10);',true],
    ['复制全部','title_batch_open_klwiki_main(true,-1);',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,'指定title：'));
    
    var group_list=[
    ['IMDb片名和链接','absearch_kltxt_b(\'<title>;.imdb.com/title/\');',true],    
    ['IMDB','absearch_kltxt_b(\'<title>;IMDB\');',true],
    ['http://','absearch_kltxt_b(\'<title>;http://www.imdb.com/\');',true],
    ];    
    klmenu1.push(menu_container_b(str_t,group_list,''));
    
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

function title_batch_open_klwiki_main(just_copy=false,csmax=10){
    function sub_title_batch_open_klwiki_main_open(){
        if (blxl>=bllen){return;}
        
        klwiki_link_b(result_t[blxl],true);
        blxl=blxl+1;
        setTimeout(sub_title_batch_open_klwiki_main_open,1000);
    }
    //-----------------------
    var ospans=document.querySelectorAll('div#divhtml span.txt_content');
    var result_t=[];
    for (let one_span of ospans){
        var blstr=one_span.innerText.trim();
        if (blstr.substring(0,7)=='<title>' && blstr.slice(-8,)=='</title>'){
            result_t.push(blstr.slice(7,-8));
        }
    }
    
    var blkey=prompt('输入起始 title 包含的关键字，输入数字表示起始序列号（1～'+result_t.length+'）（可选）');
    if (blkey==null){return;}
    blkey=blkey.trim();

    var blat=0;
    if (blkey.match(/^[0-9]+$/)){
        var blat=Math.max(1,parseInt(blkey)-1);
    } else {
        for (let blxl=0,lent=result_t.length;blxl<lent;blxl++){
            if (result_t[blxl].includes(blkey)){
                blat=blxl;
                break;
            }
        }
    }
    
    if (csmax>0){
        result_t=result_t.slice(blat,blat+csmax);
    }
    if (result_t.length==0){return;}
    
    if (just_copy){
        copy_2_clipboard_b(result_t.join('\n'));
        alert('已复制到剪贴板('+result_t.length+')：\n'+result_t.join('\n'));
        return;
    }
    
    if (!confirm('是否从编号 '+(blat+1)+' 开始，批量打开以下 '+result_t.length+' 个 title：\n'+result_t.join('\n')+'\n？')){return;}

    var blxl=0;
    var bllen=result_t.length;
    sub_title_batch_open_klwiki_main_open();
}
