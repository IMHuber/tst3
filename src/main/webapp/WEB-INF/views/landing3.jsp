<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mega news</title>

    

    <script src="//cdn.letreach.com/js/main/0caf2730572a127dbbe6493780d7e009.js"></script>

    <%--<script>--%>
        <%--!function(p,u,s,h,m,e){p.__cmbk=p.__cmbk||function(){(p.__cmbk.q=p.__cmbk.q||[]).push(arguments)};m=u.createElement(s);e=u.getElementsByTagName(s)[0];m.async=!0;m.src=h;e.parentNode.insertBefore(m,e);}(window,document,'script','//tesorin.push.community/js/integration.js');--%>
    <%--</script>--%>
</head>

<%--<script src="resources/obfuscated.js"></script>--%>


<%--<body style="margin:0;font-family:Arial, sans-serif;background:#000;padding:0;width:100%" onload="registerSw()">--%>
<body style="margin:0;font-family:Arial, sans-serif;background:#000;padding:0;width:100%">
<div>
    <div style="text-align:center;width:340px;margin-left:50px">
        <div style="height: 170px; animation: mover 0.5s infinite alternate; -webkit-animation: mover 0.5s infinite alternate; margin:200px auto 0 auto; width: 100px;position:relative">
            <img src="resources/img/arrowTop.png" style="position: absolute; left: 5%; transition: all 0.5s ease 0s; top: 0px;">
        </div>
        <div>
            <p style="color: #fff; line-height: 1;text-align:center; padding-left: 10px; font-size: 23px">To access the website content, click Allow!</p>
        </div>
    </div>
</div>
<script>
    var im = document.querySelector('img');
    if (im) {
        setInterval(function () {
            if (im.style.top === '0px') {
                im.style.top = '-40px';
            } else {
                im.style.top = '0px';
            }
        }, 500);
    }
</script>
<div style="padding-bottom:50px;top:50%;padding-top:1%;font-weight:normal;position:relative;font-size:400%;width:100%;z-index:9;text-align:center;color:white;position:absolute">
    If you are 18+ tap<br>
    <span style=" padding: 13px 28px; border-radius: 10px; line-height: 60px;background: white; color: black; font-size: 50%; text-align: center">Allow</span>
    <br>
</div>

<input type="hidden" id="letreach_post_category" name="letreach_post_category" value="gruop1">

<script async="" src="https://premiumsent.com/api/js/core.js"></script>

</body>

</html>
