function str_convert_mermaid_b(csstr){
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
            if (acol.match(/^[\(（].*[）\)]$/)){
                caption=acol.slice(1,-1);
                continue;
            }
            
            if (!acol.match('^\{.*\}$')){
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
            prev_node='step'+blat+acol;
        }
    }
    return result_t;
}

function str_expand_mermaid_b(str){
    // 辅助函数：从 "{a||b}" 提取 ["a", "b"]，不支持嵌套
    function str_expand_mermaid_b_first_map(matchedStr){
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
    const options = str_expand_mermaid_b_first_map(firstMatch); // ["子字符串1", "子字符串2"]

    const prefix = str.substring(0, str.indexOf(firstMatch));
    const suffix = str.substring(str.indexOf(firstMatch) + firstMatch.length);

    let results = [];
    for (const opt of options){
        const newStr = prefix + opt + suffix;
        // 递归处理剩下的部分（可能还有其他 {...||...}）
        results = results.concat(str_expand_mermaid_b(newStr));
    }

    return results;
}

