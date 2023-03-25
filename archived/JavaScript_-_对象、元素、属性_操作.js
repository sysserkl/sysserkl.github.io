var recent_info_list=[
["https://stackoverflow.com/questions/610336/retrieving-the-text-of-the-selected-option-in-select-element","20090304 | javascript - Retrieving the text of the selected &lt;option&gt; in &lt;select&gt; element - Stack Overflow",`
<syntaxhighlight lang="javascript">
function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}

var text = getSelectedText('test');
</syntaxhighlight>
`],
["https://stackoverflow.com/questions/2920150/insert-text-at-cursor-in-a-content-editable-div","20100527 | javascript - Insert text at cursor in a content editable div - Stack Overflow",`
<syntaxhighlight lang="javascript">
function insertTextAtCaret(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}
</syntaxhighlight>

<syntaxhighlight lang="javascript">
function saveSelection() {
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection && document.selection.createRange) {
        return document.selection.createRange();
    }
    return null;
}

function restoreSelection(range) {
    if (range) {
        if (window.getSelection) {
            sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.selection && range.select) {
            range.select();
        }
    }
}
</syntaxhighlight>
`],
["https://stackoverflow.com/questions/5222814/window-getselection-return-html","20110307 | javascript - window.getSelection return html - Stack Overflow",`
<syntaxhighlight lang="javascript">
function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
</syntaxhighlight>
`],
];
