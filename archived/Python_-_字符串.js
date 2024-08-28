var recent_info_list=[
["https://stackoverflow.com/questions/2147701/serializing-list-to-json","20100127 | python - Serializing list to JSON - Stack Overflow",`
<syntaxhighlight lang="python">
import json
list = [1, 2, (3, 4)] # Note that the 3rd element is a tuple (3, 4)
json.dumps(list) # '[1, 2, [3, 4]]'
</syntaxhighlight>
`],
["http://stackoverflow.com/questions/22058048/hashing-a-file-in-python","20140227 | hash - Hashing a file in Python - Stack Overflow",`
<syntaxhighlight lang="python">
import sys
import hashlib

# BUF_SIZE is totally arbitrary, change for your app!
BUF_SIZE = 65536  # lets read stuff in 64kb chunks!

md5 = hashlib.md5()
sha1 = hashlib.sha1()

with open(sys.argv[1], 'rb') as f:
    while True:
        data = f.read(BUF_SIZE)
        if not data:
            break
        md5.update(data)
        sha1.update(data)

print("MD5: {0}".format(md5.hexdigest()))
print("SHA1: {0}".format(sha1.hexdigest()))
</syntaxhighlight>
`],
["http://blog.csdn.net/zzzmmy2003/article/details/54837838","20170202 | Python：一句话生成字母表 - zzzmmy2003的博客 - CSDN博客",`
<syntaxhighlight lang="python">
>>> [chr(i) for i in range(97,123)]
['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

>>> ''.join([chr(i) for i in range(97,123)])
'abcdefghijklmnopqrstuvwxyz'

>>> import string
>>> string.ascii_lowercase
'abcdefghijklmnopqrstuvwxyz'

>>> dict.fromkeys(string.ascii_lowercase, 0)
{'a': 0, 'b': 0, 'c': 0, 'd': 0, 'e': 0, 'f': 0, 'g': 0, 'h': 0, 'i': 0, 'j': 0, 'k': 0, 'l': 0, 'm': 0, 'n': 0, 'o': 0, 'p': 0, 'q': 0, 'r': 0, 's': 0, 't': 0, 'u': 0, 'v': 0, 'w': 0, 'x': 0, 'y': 0, 'z': 0}
</syntaxhighlight>
`],
];
