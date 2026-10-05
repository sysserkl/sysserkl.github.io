/* Markdown 轻量渲染 */
function md2html_light_md_b(lines) {
    let html = '', i = 0;
    //const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 去掉首行标题（已在标题栏显示）
    if (/^#\s/.test(lines[0] || '')){
        i = 1;
    }
    let buf = [];
    
    const sub_md2html_light_md_b_flush = () => {
        if (buf.length) {
            html += '<p>' + sub_md2html_light_md_b_inline(buf.join(' ')) + '</p>';
            buf = [];
        }
    };
    
    const sub_md2html_light_md_b_inline = s => {
        s = specialstr_lt_gt_j(s,true);
        s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
        return s;
    };
    
    for (; i < lines.length; i++) {
        let l = lines[i];
        if (l === '---') {
            sub_md2html_light_md_b_flush();
            html += '<hr>';
            continue;
        }
        if (l === '') {
            sub_md2html_light_md_b_flush();
            continue;
        }
        if (l.startsWith('### ')) {
            sub_md2html_light_md_b_flush();
            html += `<h3>${sub_md2html_light_md_b_inline(l.slice(4))}</h3>`;
            continue;
        }
        if (l.startsWith('## ')) {
            sub_md2html_light_md_b_flush();
            html += `<h2>${sub_md2html_light_md_b_inline(l.slice(3))}</h2>`;
            continue;
        }
        if (l.startsWith('# ')) {
            sub_md2html_light_md_b_flush();
            html += `<h1>${sub_md2html_light_md_b_inline(l.slice(2))}</h1>`;
            continue;
        }
        if (l.startsWith('> ')) {
            sub_md2html_light_md_b_flush();
            html += `<blockquote><p>${sub_md2html_light_md_b_inline(l.slice(2))}</p></blockquote>`;
            continue;
        }
        if (/^\d+\.\s/.test(l)) {
            sub_md2html_light_md_b_flush();
            html += `<ol><li>${sub_md2html_light_md_b_inline(l.replace(/^\d+\.\s/,''))}</li></ol>`;
            continue;
        }
        if (l.startsWith('- ')) {
            sub_md2html_light_md_b_flush();
            html += `<ul><li>${sub_md2html_light_md_b_inline(l.slice(2))}</li></ul>`;
            continue;
        }
        if (/^\|.*\|$/.test(l) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1])) {
            sub_md2html_light_md_b_flush();
            const rows = [];
            rows.push(l);
            i++;
            rows.push(l); // header + separator
            while (i + 1 < lines.length && /^\|.*\|$/.test(lines[i + 1])) {
                i++;
                rows.push(lines[i]);
            }
            const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
            const hc = cells(rows[0]);
            html += '<table><thead><tr>' + hc.map(c => `<th>${sub_md2html_light_md_b_inline(c)}</th>`).join('') + '</tr></thead><tbody>';
            for (let k = 2; k < rows.length; k++) {
                html += '<tr>' + cells(rows[k]).map(c => `<td>${sub_md2html_light_md_b_inline(c)}</td>`).join('') + '</tr>';
            }
            html += '</tbody></table>';
            continue;
        }
        buf.push(l);
    }
    sub_md2html_light_md_b_flush();
    return html;
}
