var recent_info_list=[
["https://www.jb51.net/article/54015.htm","20140820 | PHP命令行脚本接收传入参数的三种方式_php实例_脚本之家",`

<syntaxhighlight lang="php">
echo "接收到{$argc}个参数";
print_r($argv);
</syntaxhighlight>

<syntaxhighlight lang="bash">
[root@DELL113 lee]# /usr/local/php/bin/php test.php
接收到1个参数Array
(
    [0] => test.php
)
[root@DELL113 lee]# /usr/local/php/bin/php test.php a b c d
接收到5个参数Array
(
    [0] => test.php
    [1] => a
    [2] => b
    [3] => c
    [4] => d
)
</syntaxhighlight>
`],
["https://stackoverflow.com/questions/9612166/how-do-i-pass-parameters-into-a-php-script-through-a-webpage","20150612 | How do I pass parameters into a PHP script through a webpage? - Stack Overflow",`
<syntaxhighlight lang="php">
// $argv[0] is '/path/to/wwwpublic/path/to/script.php'
$argument1 = $argv[1];
$argument2 = $argv[2];
</syntaxhighlight>
`],
];
