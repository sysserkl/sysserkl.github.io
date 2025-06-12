var recent_info_list=[
["https://www.addictivetips.com/ubuntu-linux-tips/generate-qr-codes-on-linux/","20190923 | How to generate QR codes on Linux",`
<syntaxhighlight lang="bash">
sudo apt install qrencode
qrencode -m 10 -o qrcode.png 'your-link-here'
</syntaxhighlight>
`],
["https://askubuntu.com/questions/22871/software-to-read-a-qr-code","20200603 | Software to read a QR code? - Ask Ubuntu",`
<syntaxhighlight lang="bash">
sudo apt install zbar-tools
zbarimg "image-file-name.jpg"
</syntaxhighlight>
`],
];
