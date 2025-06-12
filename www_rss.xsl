<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/rss">

<html>
<head>
<title><xsl:value-of select="channel/title" /></title>
<style type="text/css">
#div_head {font-size:6rem;font-weight:600;}
#div_head a{color:brown;}
#span_description{padding-left:1rem;font-weight:normal;font-size:2rem;color:grey;}
#span_date{font-size:1rem;padding-left:0.5rem;color:grey;}
#div_content{margin:1.5rem;word-break:normal;word-wrap:normal;}
.p_title{font-size:2rem;line-height:120%;}
.p_link{font-size:1rem;line-height:100%;margin-bottom:2rem;}
.p_link a{text-decoration:none;}
.p_link a:link{color:grey;}
.p_link a:visited{color:purple;}
.p_link a:hover{color:red;}
#div_content hr{border:0.1rem dashed grey;}
.span_number{font-size:1.5rem;}
</style>

</head>
<body>

<div id="div_head">
<xsl:element name="a">
<xsl:attribute name="href"><xsl:value-of select="channel/link" /></xsl:attribute>
<xsl:attribute name="target">new</xsl:attribute>
<xsl:value-of select="channel/title" />
</xsl:element>
<span id="span_description"><xsl:value-of select="channel/description" /></span>
</div>

<div>
<span id="span_date"><xsl:value-of select="channel/lastBuildDate" /></span>
</div>

<div id="div_content">
<xsl:for-each select="channel/item">
<p class="p_title">
<span class="span_number"><xsl:number value="position()" format="1" />. </span>
<xsl:value-of select="title"/>
</p>
<p class="p_link">
<xsl:element name="a">
<xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
<xsl:attribute name="target">new</xsl:attribute>
<xsl:value-of select="link"/>
</xsl:element>
</p>
<hr />
</xsl:for-each>
</div>

</body>
</html>

</xsl:template>
</xsl:stylesheet>
