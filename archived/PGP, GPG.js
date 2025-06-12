var recent_info_list=[
["https://www.techrepublic.com/article/how-to-work-with-pgp-keys-using-gnupg/","20160814 | How to work with PGP keys using GnuPG - TechRepublic",`
<syntaxhighlight lang="bash">
gpg --list-keys
gpg --armor --export EMAIL_ADDRESS > public_key.asc #(EMAIL_ADDRESS is the actual email address associated with the key)
gpg --import PUBLIC_KEY #(PUBLIC_KEY is the filename of the public key to be imported)
</syntaxhighlight>
`],
];
