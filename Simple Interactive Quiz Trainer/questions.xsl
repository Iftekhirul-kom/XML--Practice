<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes" encoding="UTF-8"/>

<xsl:template match="/">
    <html>
    <head>
        <title>XML/XSLT Interview Prep</title>
        <style>
        body   { font-family: sans-serif; max-width: 900px; margin: 1.5rem auto; }
        h1     { color: #2c3e50; text-align:center; }
        .topic { margin: 2rem 0; border-top: 1px solid #ddd; padding-top: 1rem; }
        .card  { 
            border: 1px solid #aaa; 
            border-radius: 8px; 
            padding: 1.2rem; 
            margin: 1rem 0; 
            background: #f9f9f9; 
        }
        .question { font-weight: bold; color: #2980b9; }
        .answer   { 
            display: none; 
            margin-top: 0.8rem; 
            padding: 0.8rem; 
            background: #e8f4ff; 
            border-left: 4px solid #3498db; 
        }
        .show-btn { 
            background: #3498db; 
            color: white; 
            border: none; 
            padding: 0.5rem 1rem; 
            border-radius: 4px; 
            cursor: pointer; 
        }
        .difficulty-easy   { color: #27ae60; }
        .difficulty-medium { color: #e67e22; }
        .difficulty-hard   { color: #c0392b; }
        </style>
    </head>
    <body>
        <h1>XML / XSLT / XPath Interview Trainer</h1>
        
        <xsl:for-each select="interview/topic">
            <div class="topic">
                <h2><xsl:value-of select="@name"/></h2>
                
                <xsl:for-each select="question">
                <div class="card">
                    <div class="question">
                    <xsl:value-of select="text"/>
                    </div>
                    
                    <div class="meta">
                    Difficulty: 
                    <span class="difficulty-{difficulty}">
                        <xsl:value-of select="difficulty"/>
                    </span>
                    </div>
                    
                    <button class="show-btn" 
                            onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
                    Show Answer
                    </button>
                    
                    <div class="answer">
                    <strong>Answer:</strong> <xsl:value-of select="answer"/>
                    </div>
                </div>
                </xsl:for-each>
            </div>
        </xsl:for-each>

        <p style="text-align:center; color:#777; margin-top:3rem;">
            Small XSLT + JS training project — good luck with your interview! 🚀
        </p>
    </body>
    </html>
</xsl:template>

</xsl:stylesheet>