var recent_info_list=[
["http://www.tuicool.com/articles/vIRryi","20140122 | 几个有用的python函数 (笛卡尔积, 排列, 组合) - 推酷",`
* product 笛卡尔积
* permutations 排列
* combinations 组合,没有重复
* combinations_with_replacement 组合,有重复
<p>[http://docs.python.org/2/library/itertools.html http://docs.python.org/2/library/itertools.html]
<syntaxhighlight lang="python">
import itertools
for i in itertools.product('ABCD', repeat = 2):
	print (i)
</syntaxhighlight>
<p>('A', 'A') ('A', 'B') ('A', 'C') ('A', 'D') ('B', 'A') ('B', 'B') ('B', 'C') ('B', 'D') ('C', 'A') ('C', 'B') ('C', 'C') ('C', 'D') ('D', 'A') ('D', 'B') ('D', 'C') ('D', 'D')
<syntaxhighlight lang="python">
for i in itertools.permutations('ABCD', 2):
	print (i)
</syntaxhighlight>
<p>('A', 'B') ('A', 'C') ('A', 'D') ('B', 'A') ('B', 'C') ('B', 'D') ('C', 'A') ('C', 'B') ('C', 'D') ('D', 'A') ('D', 'B') ('D', 'C')
<syntaxhighlight lang="python">
for i in itertools.combinations('ABCD', 2):
	print (i)
</syntaxhighlight>
<p>('A', 'B') ('A', 'C') ('A', 'D') ('B', 'C') ('B', 'D') ('C', 'D')
<syntaxhighlight lang="python">
for i in itertools.combinations_with_replacement('ABCD', 2):
	print (i)
</syntaxhighlight>
<p>('A', 'A') ('A', 'B') ('A', 'C') ('A', 'D') ('B', 'B') ('B', 'C') ('B', 'D') ('C', 'C') ('C', 'D') ('D', 'D')
`],
["http://www.iplaypy.com/module/random.html","20170217 | Python random模块sample、randint、shuffle、choice随机函数 - 玩蛇网",`
<p>random.random()函数是这个模块中最常用的方法了，它会生成一个随机的浮点数，范围是在0.0~1.0之间。
<p>random.uniform()正好弥补了上面函数的不足，它可以设定浮点数的范围，一个是上限，一个是下限。
<p>random.randint()随机生一个整数int类型，可以指定这个整数的范围，同样有上限和下限值，python random.randint。
<p>random.choice()可以从任何序列，比如list列表中，选取一个随机的元素返回，可以用于字符串、列表、元组等。
<p>random.shuffle()如果你想将一个序列中的元素，随机打乱的话可以用这个函数方法。
<p>random.sample()可以从指定的序列中，随机的截取指定长度的片断，不作原地修改。
`],
];
