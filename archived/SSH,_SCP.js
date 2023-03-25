var recent_info_list=[
["https://stackoverflow.com/questions/1662948/a-script-to-ssh-into-a-remote-folder-and-check-all-files","20091102 | bash - A script to ssh into a remote folder and check all files? - Stack Overflow",`
<syntaxhighlight lang="bash">
for file in `+'`'+`ssh myname@example.com 'ls -d dir/*/'`+'`'+`
do
    echo $file;
done
</syntaxhighlight>
`],
];
