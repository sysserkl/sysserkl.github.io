function str_convert_mermaid_b(csstr,wiki_format=true,return_str=true,cshead='graph TD',show_console=true){
    if (wiki_format){
        csstr=wiki_all_format_b(csstr); //依赖klbase_wiki.js
    }
    csstr=csstr.trim();
    var lines=str_expand_mermaid_b(csstr);
    var result_t=[];
    var name_list=[];

    for (let one_line of lines){
        var caption='';
        var prev_node='';
        var list_t=one_line.split(/\s*\-\s*/) || [];
        for (let acol of list_t){
            acol=acol.trim().replace(/\|/g,'¦');
            if (acol.match(/^[\(（].*[）\)]$/)){  //（打的|16.3公里|21分钟） - 保留注释
                caption=acol.slice(1,-1);
                continue;
            }

            var end_type=acol.endsWith('$');
            if (end_type){
                acol=acol.slice(0,-1);
            }
            
            if (!acol.match('^\{.*\}$')){   //{开始} - 保留注释
                acol='['+acol+']';
            }
            
            if (!name_list.includes(acol)){
                name_list.push(acol);
            }
            
            var blat=name_list.indexOf(acol);
            if (prev_node!==''){
                var blstr=prev_node+'-->|'+(caption==''?' ':caption)+'|step'+blat+acol;
                caption='';
                if (!result_t.includes(blstr)){
                    result_t.push(blstr);
                }
            }
            
            if (end_type){
                prev_node='';
            } else {
                prev_node='step'+blat+acol;
            }
        }
    }
    
    if (result_t.length>0 && cshead!==''){
        result_t=[cshead].concat(result_t);
    }
        
    if (return_str){
        result_t=result_t.join('\n');
    }

    if (show_console){
        console.log(result_t);
    }
    
    return result_t;
}

function str_expand_mermaid_b(str){
    // 辅助函数：从 "{a||b}" 提取 ["a", "b"]，不支持嵌套
    function sub_str_expand_mermaid_b_first(matchedStr){
        const inner = matchedStr.slice(1, -1);        // 去掉首尾的 { 和 }
        var result_t=inner.split('||').map(s => s.trim());
        return result_t;
    }

    // 如果没有匹配项，直接返回原字符串包裹在数组中
    var match_list = str.match(/\{[^}]+\|\|[^}]+\}/);
    if (!match_list){
        return [str];
    }

    const firstMatch = match_list[0]; // 如 "{子字符串1||子字符串2}"
    const options = sub_str_expand_mermaid_b_first(firstMatch); // ["子字符串1", "子字符串2"]

    const prefix = str.substring(0, str.indexOf(firstMatch));
    const suffix = str.substring(str.indexOf(firstMatch) + firstMatch.length);

    let results = [];
    for (const opt of options){
        const newStr = prefix + opt + suffix;
        // 递归处理剩下的部分（可能还有其他 {...||...}）
        results = results.concat(str_expand_mermaid_b(newStr));
    }
    return results; //多条线路 - 保留注释
}

function show_mermaid_b(cslist,odiv,show_no=true,add_hr=true){
    async function sub_show_mermaid_b_one(){
        if (blxl>=bllen){return;}
        
        var item=cslist[blxl];
        item=str_convert_mermaid_b(item);
        if (item!==''){
            line_no=line_no+1;
            
            var chartId = 'mermaid-' + crypto.randomUUID();   // 自动生成唯一 ID

            odiv.insertAdjacentHTML('beforeend',hr_str+'<h3 style="cursor:pointer;" onclick="export_mermaid_b(\''+chartId+'\');">'+(show_no?line_no:'⇩')+'</h3>');

            var result_t = await mermaid.render(chartId, item);
            var blsvg = result_t.svg;
            
            odiv.insertAdjacentHTML('beforeend',`<p style="text-align:center;">${blsvg}</p>`);

            //以下几行保留 - 保留注释
            //var osub=document.createElement('p');
            //osub.style.textAlign='center';
            //odiv.appendChild(osub);
            //osub.innerHTML=`${item}`;
            //mermaid.init(undefined, osub);
        }
        blxl=blxl+1;
        setTimeout(sub_show_mermaid_b_one,1);
    }
    
    var hr_str=(add_hr?'<hr />':'');
    var blxl=0;
    var line_no=0;
    var bllen=cslist.length;
    sub_show_mermaid_b_one();
}

function export_mermaid_b(csid){
    var osvg=document.getElementById(csid);
    if (!osvg){return;}
    export_svg_b(osvg,csid+'.svg');
}
