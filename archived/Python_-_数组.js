var recent_info_list=[
["https://stackoverflow.com/questions/613183/how-do-i-sort-a-dictionary-by-value","20090305 | python - How do I sort a dictionary by value? - Stack Overflow",`
<syntaxhighlight lang="python">
x = {1: 2, 3: 4, 4: 3, 2: 1, 0: 0}
{k: v for k, v in sorted(x.items(), key=lambda item: item[1])}
{0: 0, 2: 1, 1: 2, 4: 3, 3: 4}
</syntaxhighlight>
`],
["https://www.cnblogs.com/sysu-blackbear/p/3283993.html","20130826 | Python中sorted函数的用法 - 中大黑熊 - 博客园",`
<syntaxhighlight lang="python">
L = [{1:5,3:4},{1:3,6:3},{1:1,2:4,5:6},{1:9}]
def f(x):
    return len(x)
sort(key=f)
print(L)
</syntaxhighlight>
<p>输出: [{1: 9}, {1: 5, 3: 4}, {1: 3, 6: 3}, {1: 1, 2: 4, 5: 6}]
<syntaxhighlight lang="python">L = [{1:5,3:4},{1:3,6:3},{1:1,2:4,5:6},{1:9}]
def f2(a,b):
    return a[1]-b[1]
L.sort(cmp=f2)
print(L)
</syntaxhighlight>
<syntaxhighlight lang="python">
students = [('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10),]
sorted(students, key=lambda student : student[2])   # sort by age
sorted(students, cmp=lambda x,y : cmp(x[2], y[2])) # sort by age

from operator import itemgetter, attrgetter
sorted(students, key=itemgetter(2))

sorted(students, key=itemgetter(1,2))  # sort by grade then by age
</syntaxhighlight>
<syntaxhighlight lang="python">
d = {'data1':3, 'data2':1, 'data3':2, 'data4':4}
sorted(d.iteritems(), key=itemgetter(1), reverse=True)
</syntaxhighlight>
`],
];
