var recent_info_list=[
["https://www.tuicool.com/articles/Er2eye","20140221 | JavaScript: 实现简单的中文分词 - 推酷",`<p>在实际应用中，字典可能包含了足够多的词，而且字典中很多词是有共同前缀的。比如上述代码中的"松花"和"松花江"就有共同的前缀"松花"，存储重复的前缀将导致字典占用大量的内存，而这部分其实是可以优化的。还记得我之前的一篇介绍Trie树的文章吗？如果您忘了，那请看：[http://my.oschina.net/goal/blog/200596 Python: Trie树实现字典排序]。事实上还是有不同之处的，因为之前只是针对26个字母的Trie树。对于需要支持中文的Trie树来说，如果直接用一个字符(这个字符可能是ASCII码字符，也可能是中文字符或其它多字节字符)来表示一个节点，则是不可取的。大家知道最常用的汉字有将近一万个，如果每一个节点都要用一个数组来保存将近一万个子节点，那就太吓人了。所以我这里选择Object的方式来保存，这样的好处是查找时间复杂度为O(1)。但即使这样，这个Object还将容纳将近一万个key，所以我这里将结合另外一种方案来实现。 `],
["https://www.jb51.net/article/59560.htm","20150107 | javascript实现全角与半角字符的转换_脚本之家",`
<syntaxhighlight lang="javascript">
/**
 * 转全角字符
 */
function toDBC(str){
    var result = "";
    var len = str.length;
    for(var i=0;i<len;i++)
    {
        var cCode = str.charCodeAt(i);
        //全角与半角相差（除空格外）：65248(十进制)
        cCode = (cCode>=0x0021 && cCode<=0x007E)?(cCode + 65248) : cCode;
        //处理空格
        cCode = (cCode==0x0020)?0x03000:cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
}
/**
 * 转半角字符
 */
function toSBC(str){
    var result = "";
    var len = str.length;
    for(var i=0;i<len;i++)
    {
        var cCode = str.charCodeAt(i);
        //全角与半角相差（除空格外）：65248（十进制）
        cCode = (cCode>=0xFF01 && cCode<=0xFF5E)?(cCode - 65248) : cCode;
        //处理空格
        cCode = (cCode==0x03000)?0x0020:cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
}
</syntaxhighlight>
<p>拥有全角与半角之分的ASCII字符范围：0x20~0x7E。
<p>除了空格外，其他的字符中，全角与半角均相差：0xFFE0
<p>全角 = 半角 + 0xFEE0
<p>半角 = 全角  - 0xFFE0
`],
["https://stackoverflow.com/questions/2676178/joining-relative-urls","20180704 | javascript - joining relative urls? - Stack Overflow",`
<syntaxhighlight lang="javascript">
> new URL('../address', 'http://www.adress.com/more/evenmore/').href
"http://www.adress.com/more/address"
> new URL('../../address', 'http://www.adress.com/more/evenmore/').href
"http://www.adress.com/address"
</syntaxhighlight>
`],
];
