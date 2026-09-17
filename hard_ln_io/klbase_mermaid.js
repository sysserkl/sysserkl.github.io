function str_convert_mermaid_b(csstr,cshead='flowchart TD',wiki_format=true,return_str=true,show_console=true){
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

function steps_batch_sort_mermaid_b(textaread_id){
    var otextarea=document.getElementById(textaread_id);
    var blstr=otextarea.value.trim();
    if (blstr==''){return;}
    
    var list_t,is_raw;
    [list_t,is_raw]=flowchart_list_get_mermaid_b(blstr,false);

    for (let blxl=0,lent=list_t.length;blxl<lent;blxl++){
        if (!Array.isArray(list_t[blxl])){continue;}
        list_t[blxl]=[list_t[blxl][0]].concat(steps_sort_one_mermaid_b(list_t[blxl].slice(1,)));
        list_t[blxl]=list_t[blxl].join('\n');
    }
    otextarea.value=list_t.join('\n\n');
}

function steps_sort_one_mermaid_b(cslist,remove_step=false){
    cslist.sort(function (a,b){return a.replace(/^step\d+/)>b.replace(/^step\d+/)?1:-1;});
    if (remove_step){
        var blstr=cslist.join('\n');
        var blmax=0;
        var no_list=array_unique_b(blstr.match(/^step(\d+)/mg) || []);
        if (no_list.length>0){
            no_list.sort(function (a,b){return a.length>b.length?-1:1;});   //按长度逆序 - 保留注释
            for (let item of no_list){
                blstr=blstr.replace(new RegExp(item,'g'),'');
            }
            cslist=blstr.split('\n');
        }
    }
    return cslist;
}

function flowchart_list_get_mermaid_b(csstr,do_join=true){
    function sub_flowchart_list_get_mermaid_b_join(){
        if (parts.length>0){
            if (do_join){
                result_t.push(parts.join('\n'));
            } else {
                result_t.push(parts);
            }
            parts=[];
        }    
    }
    
    var is_raw=csstr.match(/^flowchart /mg) ? true:false;
    var list_t=csstr.split('\n');
    var result_t=[];    
    var parts=[];
    
    if (is_raw){
        for (let arow of list_t){
            if (arow.trim().startsWith('flowchart ')){
                sub_flowchart_list_get_mermaid_b_join();
            }
            if (arow.trim()!==''){
                parts.push(arow);
            }
        }
        sub_flowchart_list_get_mermaid_b_join();
        list_t=result_t;
    }
    return [list_t,is_raw];
}

function textarea_2_html_mermaid_b(textaread_id,div_id){
    var blstr=document.getElementById(textaread_id).value.trim();
    if (blstr==''){return;}
    
    var list_t,is_raw;
    [list_t,is_raw]=flowchart_list_get_mermaid_b(blstr);

    var odiv=document.getElementById(div_id);
    odiv.innerHTML='';

    show_mermaid_b(list_t,odiv,is_raw);
}

function show_mermaid_b(cslist,odiv,is_raw=false,show_no=true,add_hr=true,remove_hashtag=true,cshead='flowchart TD'){
    async function sub_show_mermaid_b_one(){
        if (blxl>=bllen){return;}
        
        var item=cslist[blxl];
        //item 形如：# 杭州东-义乌站-（打的|21公里|40分钟）-里兆村-'''凉帽尖'''-里兆村-（步行|4.8公里|69分钟）-廿三里南站-（823路|17:35|18:10|57分钟）-义乌站
        if (!is_raw){
            if (remove_hashtag && (item.startsWith('# ') || item.startsWith('* '))){
                item=item.slice(2,).trimLeft();
            }
            
            if (item.startsWith('LR$-')){
                cshead='flowchart LR';
                item=item.slice(4,);
            } else {
                cshead='flowchart TD';
            }
            
            var hash_value=(has_sha1?'<p style="font-size:small;">'+str_insert_delimiter(SHA1(item).toUpperCase(),4,'-')+'</p>':'');

            item=str_convert_mermaid_b(item,cshead);
        } else {
            var hash_value=(has_sha1?'<p style="font-size:small;">'+str_insert_delimiter(SHA1(item).toUpperCase(),4,'-')+'</p>':'');
        }
        
        if (item!==''){
            line_no=line_no+1;
            
            var chartId = 'mermaid-' + crypto.randomUUID();   // 自动生成唯一 ID

            odiv.insertAdjacentHTML('beforeend',hr_str+'<h3 style="cursor:pointer;" onclick="export_mermaid_b(\''+chartId+'\');">'+(show_no?line_no:'⇩')+'</h3>');

            var result_t = await mermaid.render(chartId, item);
            var blsvg = result_t.svg;
            
            odiv.insertAdjacentHTML('beforeend',`<div style="text-align:center;">${hash_value}${blsvg}</div>`);

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
    var has_sha1=(typeof SHA1=='function');
    sub_show_mermaid_b_one();
}

function export_mermaid_b(csid){
    var osvg=document.getElementById(csid);
    if (!osvg){return;}
    export_svg_b(osvg,csid+'.svg');
}

// ===== 新增：Mermaid -> 紧凑文本（str_convert_mermaid_b 的逆转换）=====
// 用法：mermaid_2_str_b(mermaid字符串, return_str=true, show_console=true)
// 说明：紧凑文本 -> Mermaid 是多对一的（同一张图可写出多种紧凑写法），
//       本函数还原出的是其中一种等价写法；用 str_convert_mermaid_b 转回去
//       可得到完全相同的节点与带标签的边集合（已通过往返校验）。
function mermaid_2_str_b(csstr, return_str = true, show_console = true){
    function sub_mermaid_2_str_b_rep(s){
        return s.replace(/¦/g, '|');
    }               // ¦ 还原成 |
    
    function sub_mermaid_2_str_b_has_cap(c){
        return c && c.trim() !== '' && c.trim() !== ' ';
    } // 空标签不写括号
    
    csstr = csstr.trim();

    // 1. 解析表头（flowchart LR 时还原成 LR$- 前缀）
    var lines = csstr.split('\n');
    var cshead = (lines[0].trim().startsWith('flowchart LR')) ? 'flowchart LR' : 'flowchart TD';

    // 2. 解析节点与边：stepN[标签]-->|标签|stepM[标签]
    var nodes = {};     // id -> 标签
    var edges = [];     // {from,to,label}
    var outList = {};   // from -> [边下标]
    var edgeRe = /step(\d+)\[([^\]]*)\]\s*-->\s*\|(.*?)\|\s*step(\d+)\[([^\]]*)\]/;

    for (var line of lines){
        var m = line.match(edgeRe);
        if (!m){continue;}
        nodes[m[1]] = m[2];
        nodes[m[4]] = m[5];
        var idx = edges.length;
        edges.push({ from: m[1], to: m[4], label: m[3] });
        (outList[m[1]] = outList[m[1]] || []).push(idx);
    }

    var used = new Array(edges.length).fill(false);
    var chains = [];

    // 3. 不断取第一条未使用的边，从它的起点串出一条链
    while (true){
        var firstUnused = -1;
        for (var i = 0; i < edges.length; i++){
            if (!used[i]){
                firstUnused = i;
                break;
            }
        }
        if (firstUnused === -1){break;}

        var cur = edges[firstUnused].from;
        var parts = [nodes[cur]];

        while (true){
            var outs = (outList[cur] || []).filter(function (x) { return !used[x]; });
            if (outs.length === 0){break;}

            // 3.1 只有一条出边：线性前进（无标签则只写 -节点）
            if (outs.length === 1){
                var e = edges[outs[0]];
                used[outs[0]] = true;
                if (sub_mermaid_2_str_b_has_cap(e.label)){
                    parts.push('-（' + sub_mermaid_2_str_b_rep(e.label) + '）');
                }
                parts.push('-' + nodes[e.to]);
                cur = e.to;
                continue;
            }

            // 3.2 多条出边：尝试聚合成 {分支1||分支2...}
            //     依次以各出边的终点作为候选汇合点 S，找到能汇聚 >=2 条分支的 S
            var chosenS = null;
            var chosenBranches = null;
            var seen = {};
            
            for (var ci = 0; ci < outs.length; ci++){
                var S = edges[outs[ci]].to;
                if (seen[S]){continue;}
                seen[S] = 1;
                var bs = [];
                for (var k = 0; k < outs.length; k++){
                    var oi = outs[k];
                    var path = [oi];
                    var t = edges[oi].to;
                    var ok = (t === S);
                    var guard = 0;
                    while (t !== S){                       // 沿未使用出边向 S 延伸
                        var to = (outList[t] || []).filter(function (x) { return !used[x]; });
                        if (to.length === 0){
                            ok = false; 
                            break;
                        }
                        var ni = to[0];
                        path.push(ni);
                        t = edges[ni].to;
                        if (++guard > 100) {
                            ok = false; 
                            break;
                        }
                    }
                    if (ok && t === S){
                        bs.push(path);
                    }
                }
                
                if (bs.length >= 2){
                    chosenS = S; 
                    chosenBranches = bs; 
                    break;
                }
            }

            // 3.3 汇合不了就退化为走第一条出边
            if (chosenS === null){
                var e0 = edges[outs[0]];
                used[outs[0]] = true;
                if (sub_mermaid_2_str_b_has_cap(e0.label)){
                    parts.push('-（' + sub_mermaid_2_str_b_rep(e0.label) + '）');
                }
                parts.push('-' + nodes[e0.to]);
                cur = e0.to;
                continue;
            }

            // 3.4 标记这些边已用，并拼出 {..||..}
            chosenBranches.forEach(function (b){
                b.forEach(function (x) { used[x] = true; });
            });

            var brStrs = chosenBranches.map(function (path) {
                var ps = [];
                for (var k = 0; k < path.length; k++){
                    var ed = edges[path[k]];
                    if (sub_mermaid_2_str_b_has_cap(ed.label)){
                        ps.push('（' + sub_mermaid_2_str_b_rep(ed.label) + '）');
                    }
                    if (k < path.length - 1){
                        ps.push(nodes[ed.to]); // 最后一条边通向 S，节点写在 } 外
                    }
                }
                return ps.join('-');
            });

            parts.push('-{' + brStrs.join('||') + '}');
            parts.push('-' + nodes[chosenS]);
            cur = chosenS;
        }

        chains.push(parts.join(''));
    }

    // 4. 多条链用 $ 断开、以 - 相连；flowchart LR 补回 LR$- 前缀
    var result = chains.map(function (c, i){
        return i < chains.length - 1 ? c + '$' : c;
    }).join('-');
    
    if (cshead === 'flowchart LR'){
        result = 'LR$-' + result;
    }

    if (show_console){
        console.log(result);
    }
    return result;
}
