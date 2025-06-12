var recent_info_list=[
["http://yongsun.me/2009/09/what%e2%80%99s-new-in-sunpinyin2-%e2%80%94-user-dictionary/","20090905 | What’s New in SunPinyin2 — User Dictionary – 素心如何天上月",`
<p>原先的SunPinyin没有用户词典，只是通过User History Cache纪录了用户近期输入的bi-gram信息。如果一个bi-gram，其概率比系统词典的某个uni-gram要低，这个bi-gram的组合就不会出现在用户的候选列表中。例如，虽然用户频繁的输入钥匙，但是它依然很难出现在候选列表中，因为“要是”这个unigram的概率要更高。如果“钥匙”出现在候选中，一定是第一候选，因为它是作为一个最佳候选句子来呈现给用户的。如果用户选择了“要是”，那么“钥匙”又不知道要过多久才能出现了。这个缺陷也是广受大家诟病的地方。其实，SunPinyin原先的架构是[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/slm/slm.cpp#265 支持将用户自定义词放到lattice上进行搜索的]。
<p>我们在SunPinyin2中，通过sqlite3来实现用户词典，目前我们的用户词典支持记录&lt;=6个的字符。
<p>CUserDict::[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/userdict.cpp#230 _createTable]/[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/userdict.cpp#256 _createIndexes]:
<p>这两个私有方法尝试创建一个table和index。这个表的结构是，首先词的ID（从1开始的）和长度，接下来是6个声母，然后是6个韵母，再其次是6个声调。然后我们为长度＋6个声母建立了一个索引。sqlite的[http://www.sqlite.org/optoverview.html query对搜索条件和index有一些限制]，要求条件的次序和index的次序相同，并且一旦某个条件是非相等性的（例如&gt;），则该条件及其之后的条件都无法用index来加速。另外，每个from子句只能使用一个index。
<p>因为我们经常会有不完整拼音的查询，或者换句话说用户经常会输入不完整拼音，所以table和index就被设计成了这个样子。
<p>CUserDict::[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/userdict.cpp#64 addWord] (syllables, word):
<p>使用了sqlite中的prepared statement来进行插入。最后，在插入成功的情况下，调用sqlite3_last_insert_rowid得到上一次插入记录的row id，加上一个offset并返回。如果失败，就返回0。
<p>CUserDict::[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/userdict.cpp#104 removeWord] (wid):
<p>这个相对简单，按照wid将记录从数据库中删除。
<p>CUserDict::[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/userdict.cpp#117 getWords] (syllables, result):
<p>这个方法将syllables在数据库中对应的记录，放到result中。我们返回的词id类型，和系统词典的保持一致，都是CPinyinTrie::TWordIdInfo。这里再解释一下，用户词典的最大容量为什么是6万多个。这个就是由于CPinyinTrie::TWordIdInfo的[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/lexicon/pytrie.h#29 m_id]的长度决定的，是2^18-1。
<p>我们按照sqlite的限制，小心翼翼地组织好查询的where子句，查询，然后迭代结果，填充results，最后返回。
<p>CUserDict::[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/userdict.cpp#188 operator []] (wid):
<p>这个方法也相对简单，就是返回wid对应的字符串。因为sqlite只支持utf8和utf16，而且utf16还要使用一套不同的接口，所以我们还是使用utf8作为数据库内的字符串编码。而sunpinyin-ime要求的是ucs-4编码的字符串，所以还要进行一个编码转换。同时把(wid, wstr)这个pair加入到m_dict中。wstr是动态分配的，由m_dict在析构时释放。这里还利用了这样一个事实，std::basic_string是COW的。[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/userdict.cpp#221 我们在m_dict中保存的其实是wstr的拷贝]，不过这个拷贝和wstr共享同一个C string的buffer。
<p>接下来，我会介绍SunPinyin2中另一个比较复杂和tricky的部分——用户配置（[http://src.opensolaris.org/source/xref/nv-g11n/inputmethod/sunpinyin2/src/ime-core/imi_options.h imi_options.h]），这一部分到目前还没有完全定型，非常欢迎大家多提宝贵意见。
<p>`],
];
