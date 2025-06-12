var recent_info_list=[
["https://stackoverflow.com/questions/2388488/select-a-random-item-from-an-array","20100305 | shell - Select a random item from an array - Stack Overflow",`
<syntaxhighlight lang="bash">
expressions=("Ploink Poink" "I Need Oil" "Some Bytes are Missing!" "Poink Poink" "Piiiip Beeeep!!" "Hello" "Whoops! I'm out of memmory!")
echo $\{expressions[$RANDOM % $\{#expressions[@]\} ]\}
</syntaxhighlight>
`],
["https://blog.csdn.net/xrdks/article/details/7759305","20120718 | bash shell 获取数组中给定元素的下标 - xrdks的专栏 - CSDN博客",`<syntaxhighlight lang="bash">
#获取数组中给定元素的下标
#参数：1 数组; 2 元素
#返回：元素在数组中的下标，从 0 开始；-1 表示未找到
#例子：
#    获取数组 xrsh_array 中元素 i3 的下标
#    xrsh_array=(i1,i2,i3)
#    xrsh_tmp=`+'`'+`echo $\{xrsh_array[*]\}`+'`'+`
#    xrsh_arritemidx "$xrsh_tmp" "i3"
#    返回 2
#注意：数组作为参数使用时需要先转换
function xrsh_arritemidx() \{
    local _xrsh_tmp
    local _xrsh_cnt=0
    local _xrsh_array=`+'`'+`echo "$1"`+'`'+`
    for _xrsh_tmp in $\{_xrsh_array[*]\}
    do
        if test "$2" = "$_xrsh_tmp"
        then
            echo $_xrsh_cnt
            return
        fi
        _xrsh_cnt=$(( $_xrsh_cnt + 1 ))
    done
    echo "-1"
\}
</syntaxhighlight>
`],
["https://blog.csdn.net/baidu_35757025/article/details/64439508","20170321 | 在shell中把ls的输出存进一个数组变量中 - baidu_35757025的博客 - CSDN博客",`
<syntaxhighlight lang="bash">
c=0
for file in *
do
    filelist[$c]="$file"  
    ((c++))
done

#把filelist数组内容输出到屏幕上：

b=0
while [ $b -lt $c ]
do
    echo $\{filelist[$b]\}
    ((b++))
done

#或者

for value in $\{filelist[*]\}
do 
    echo $value
done

#在屏幕上输出filelist数组长度：

echo $\{#filelist[*]\}

#注：用$\{#数组名[@或*]\} 可以得到数组长度
</syntaxhighlight>
`],
];
