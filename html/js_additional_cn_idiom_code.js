function menu_more_cn_idiom(){
    var str_t=klmenu_hide_b('');
    var klmenu1=[
    '<span class="span_menu" onclick="'+str_t+'graph_relation_cn_idiom();">字词关系图</span>',   

    ];
    return klmenu_b(klmenu1,'↔','8rem','1rem','1rem','30rem');
}

function graph_relation_cn_idiom(){
    if (js_data_current_common_search_global.length==0){return;}
    var characters=[];
    var ids=[];
    for (let blxl=0,lent=js_data_current_common_search_global.length;blxl<lent;blxl++){
        var blvalue=js_data_current_common_search_global[blxl][0].trim();
        var blid='id'+blxl;
        ids.push(blid+' [label="'+blvalue+'",shape=circle];');
        var list_t=new Set(blvalue.split(''));
        for (let aword of list_t){
            characters.push(aword+' -> '+blid+' [arrowhead=none style=dotted];');
        }
    }
    var blhead=`digraph G {
	layout=neato
	node[width=0,height=0,fontsize=9, fillcolor="#EBEBEB", style="rounded,filled", shape=diamond]
`;
    var blstr=characters.join('\n')+'\n\n'+ids.join('\n')+'\n';
    document.getElementById('divhtml').innerHTML='<textarea>'+blstr+'</textarea>';
    
    if (confirm('是否保存？')){
        string_2_txt_file_b(blhead+blstr+'}','cn_idiom_relationship_'+js_data_current_common_search_global.length+'.gv','txt');
    }
}
