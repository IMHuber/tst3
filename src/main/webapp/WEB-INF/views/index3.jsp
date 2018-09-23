<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<html ng-app="app">
<head>
    <meta charset="UTF-8">
    <title>Settings | LetReach</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <link rel="shortcut icon" href="https://app.letreach.com/assets/letreach/img/Favicon-32.png">
    
    <link rel="stylesheet" href="libs/angular-material/1.1.5/angular-material.min.css"/>

    <%--<link rel="stylesheet" href="libs/bootstrap/4.1.1/css/bootstrap.min.css">--%>
    <%--<link rel="stylesheet" href="resources/css/core/bootstr336min.css">--%>
    <%--<link rel="stylesheet" href="resources/css/core/angmat115min.css">--%>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
          integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

    <link rel="stylesheet" href="resources/css/core/custom2.css">
    <link rel="stylesheet" href="resources/css/core/emojionearea.min.css">
    <%--<link rel="stylesheet" href="resources/css/core/languages.min.css">--%>
    <link rel="stylesheet" href="resources/css/core/push.css">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.1/animate.min.css">
    <link rel="stylesheet" href="https://app.letreach.com/assets/dashboard/css/emojionearea.min.css">
    
    <style>
        .optin-tile {
            cursor: pointer;
        }

        .shr7 {
            z-index: 9999999;
        }

        .shr6 {
            width: 400px;
        }

        .wnoti-settings {
            display: none;
        }

        .rss-feed-url {
            display: none;
        }

        .optin-settings-page {
            top: 0;
            left: 0;
            position: fixed;
            background: #f5f5f5;
            color: #000;
            width: 100%;
            height: 100%;
            display: none;
            z-index: 999999;
        }

        .show {
            display: block;
        }

        .optin-settings {
            padding: 50px 0 0 100px;
        }

        .optin-settings .title-pane {
            font-size: 21px;
            cursor: pointer;
            margin: 10px 0;
        }

        .sp-container {
            z-index: 9999999;
        }

        .sp-replacer {
            padding: 0;
            border: 2px solid #EEE;
            margin-bottom: 5px;
            z-index: 99999
        }

        .sp-cancel {
            display: none;
        }

        .sp-preview {
            border: none;
            margin-right: 0;
            width: 40px;
            height: 30px;
        }

        .sp-dd {
            display: none;
        }

        .input-group-addon {
            padding: 0 6px;
        }

        .input-group {
            margin: 10px 0;
        }

        .preview-column {
            padding: 150px
        }

        .preview-column .button-preview {
            padding-top: 20px;
            text-align: center;
        }

        .preview-column .button-preview .btn {
            color: #fff;
            background-color: #e03616;
            border-color: #ccc;
            font-size: 22px;
            padding: 6px 25px;
        }

        .switch input {
            display: none;
        }

        .switch i {
            display: inline-block;
            cursor: pointer;
            padding-right: 15px;
            transition: all ease 0.2s;
            -webkit-transition: all ease 0.2s;
            border-radius: 15px;
            box-shadow: inset 0 0 1px rgba(0, 0, 0, .5);
            margin-left: 10px;
            margin-top: 5px;
            margin-bottom: -4px;
        }

        .switch i:before {
            display: block;
            content: '';
            width: 20px;
            height: 20px;
            border-radius: 20px;
            background: white;
            box-shadow: 0 1px 2px rgba(0, 0, 0, .5);
        }

        .switch :checked + i {
            padding-right: 0;
            padding-left: 15px;
            box-shadow: inset 0 0 1px rgba(0, 0, 0, .5), inset 0 0 40px #1995AD;
            -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, .5), inset 0 0 40px #1995AD;
        }

        .on-off-btn label {
            background-color: #fff;
            border-color: #ccc;
        }

        .on-off-btn input:checked + label {
            color: #fff;
            background-color: #1995AD;
            border-color: #4cae4c;
        }

        .on-off-btn input {
            display: none;
        }

        .color-box {
            height: 25px;
            width: 25px;
            border-radius: 4px;
            cursor: pointer;
            display: inline-block;
            margin-right: 5px;
        }

        .popover {
            max-width: 500px !important;
        }

        .color-container {
            display: block;
            width: 270px;
        }

        .color-ffffff {
            background: #fff;
            border: 1px solid #000;
        }

        .color-333333 {
            background: #333333;
        }

        .color-888888 {
            background: #888888;
        }

        .color-24b58d {
            background: #24b58d;
        }

        .color-36afb2 {
            background: #36afb2;
        }

        .color-03658c {
            background: #03658c;
        }

        .color-ffc55f {
            background: #ffc55f;
        }

        .color-f2594b {
            background: #f2594b;
        }

        .color-eee {
            background: #eee;
            margin-right: 0;
        }

        .optin-settings > .row {
            padding-bottom: 80px;
        }

        .top-like-window {
            background: #fff;
            padding: 0 50px 50px 50px;
            width: 500px;
            border-radius: 4px;
        }

        .btn-blue {
            color: #fff;
            background-color: #1995AD;
            border-color: #1995AD;
            padding: 6px 16px;
            font-size: 20px;
            margin-left: 20px
        }

        .popup-demo {
            border-radius: 7px;
            box-shadow: 0 0 2px 2px #c5c5c5;
        }

        .popup-demo .header {
            height: 25px;
            background: #c5c5c5;
        }

        .popup-demo .main-window {
            background: #fff;
            text-align: center;
        }

        .popup-demo img {
            padding-top: 60px;
        }

        .popup-demo .popup-title {
            font-size: 20px;
        }

        .popup-demo .popup-subtitle {
            padding-bottom: 100px;
        }

        .enabled-tile {
            box-shadow: 0 0 3px 3px #0073D3;
        }

        .body-overlay {
            position: fixed;
            height: 100%;
            width: 100%;
            background: rgba(0, 0, 0, 0.75);
            top: 0;
            left: 0;
            transition-duration: 1s;
        }

        .fs13 {
            font-size: 13px;
        }

        .logo-img {
            max-width: 150px;
        }

        .panel a {
            text-decoration: none;
        }

        .panel a:hover {
            color: #337ab7;
        }

        .lr-red {
            background: #E55C3E;
        }

        .step-img {
            width: 50%;
        }

        .step {
            position: relative;
            text-align: center;
        }

        .relative-container {
            position: relative;
            cursor: pointer;
        }

        .copy-btn i {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 20px;
            color: #888;
        }

        .arrow-right {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 25px;
        }

        .arrow-right-2 {
            top: 45%;
        }

        .step img {
            box-shadow: 3px 3px 3px 3px #ddd;
        }

        .steps {
            margin-top: 14px;
        }

        .img-caption {
            margin-top: 20px;
        }

        .code-box {
            padding: 30px;
        }

        .code-box-container {
            transition-duration: 500ms;
        }

        .code-box-container:hover {
            box-shadow: 3px 3px 3px #ddd;
        }

        .optin-btn {
            text-decoration: none;
            color: #fff;
        }

        .optin-btn:hover, .optin-btn:active {
            text-decoration: none;
            color: #fff;
        }

        #developer-email {
            width: 40%;
            border-top-left-radius: 18px;
            border-bottom-left-radius: 18px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        #dev-send {
            line-height: 1.8;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-top-right-radius: 18px;
            border-bottom-right-radius: 18px;
        }

        #nextBtn {
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
            border-top-right-radius: 30px;
            border-bottom-right-radius: 30px;
        }

        #usersTable tr:not(:first-child) {
            cursor: pointer;
        }

        .ltr-branding-popup {
            font-size: 10px;
        }

        .ltr-branding-popup img {
            padding: 0;
            width: 12px;
        }

        .shr6 .ltr-txt .ltr-title {
            font-weight: bold;
            font-size: 14px;
            font-family: 'Lato', sans-serif;
            line-height: 18px !important;
            display: inline-block;
        }

        .popover-content {
            text-align: center;
        }

        .round-field {
            width: 40%;
            border-top-left-radius: 18px;
            border-bottom-left-radius: 18px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .rounded-btn {
            line-height: 1.8;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            border-top-right-radius: 18px;
            border-bottom-right-radius: 18px;
        }
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="libs/bootstrap/4.1.1/js/bootstrap.min.js"></script>
</head>


<body style="height: auto">

<script src="libs/angular/1.7.2/angular.js"></script>
<script src="libs/angular-ui-router/1.0.15/angular-ui-router.js"></script>
<script src="libs/angularjs/1.7.2/angular-resource.js"></script>
<script src="libs/angular-animate/1.7.2/angular-animate.js"></script>
<script src="libs/angular-material/1.1.5/angular-material.js"></script>
<script src="libs/angular-aria/1.6.9/angular-aria.min.js"></script>
<script src="libs/angular-base64-upload/0.1.22/src/angular-base64-upload.js"></script>

<script src="resources/app.js"></script>
<script src="resources/app/login/loginController.js"></script>
<script src="resources/app/login/loginDataService.js"></script>
<script src="resources/app/main/mainController.js"></script>
<script src="resources/app/main/mainDataService.js"></script>
<script src="resources/app/users/usersController.js"></script>
<script src="resources/app/notifications/notificationsController.js"></script>
<script src="resources/app/notifications/notificationsDataService.js"></script>
<script src="resources/app/menu/menuController.js"></script>
<script src="resources/app/dashboard/dashboardController.js"></script>
<script src="resources/app/campaigns/campaignsController.js"></script>
<script src="resources/app/subscribers/subscribersController.js"></script>
<script src="resources/app/filters/filtersController.js"></script>
<script src="resources/app/settings/settingsController.js"></script>
<script src="resources/app/notifications2/notifications2Controller.js"></script>



<link rel="stylesheet" href="resources/css/app.css">


<div class="navbar navbar-default">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="https://app.letreach.com/5b954f654cd56d382e8b5c19">
                <img src="https://app.letreach.com/assets/dashboard/images/logo-white.png">
            </a>
        </div>
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li class="item" ng-repeat="item in navDefItems" ng-click="toggleNavDef(item)" ng-class="{'active': item.active}" style="outline: none;">
                    <a ui-sref="{{item.state}}">
                        <span>
                            <i class="{{item.icon}}"></i>
                            {{item.title}}
                        </span>
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a class="user dropdown-toggle" role="button" data-toggle="dropdown" aria-expanded="false">
                        <span class="">LetReach <i class="fa fa-heart" style="color:#e03616; margin-left: 8px;"></i> Stanly</span>
                    </a>
                    <ul class="dropdown-menu" role="menu">
                        <li>
                            <div class="referral-section arrow-up">
                                SPREAD THE LOVE<br>
                                SHARE LETREACH WITH YOUR FRIENDS
                                <div class="facebook-share">
                                    <div class="input-group">
                                        <input type="text" class="form-control" value="https://letreach.com/?refid=tesorin">
                                        <span class="input-group-btn">
                                            <button class="btn btn-primary btn-facebook-share" type="button"
                                                    onclick="window.open('http://facebook.com/sharer/sharer.php?u=https://letreach.com/?refid=tesorin', '_blank', 'toolbar=yes, scrollbars=yes, resizable=no, top=150, left=300, width=400, height=400');">
                                                <i class="fa fa-facebook"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div class="google-share">
                                    <div class="input-group">
                                        <input type="text" class="form-control" value="https://letreach.com/?refid=tesorin">
                                        <span class="input-group-btn">
                                            <button class="btn btn-primary btn-google-share" type="button"
                                                    onclick="window.open('https://plus.google.com/share?url=https://letreach.com/?refid=tesorin', '_blank', 'toolbar=yes, scrollbars=yes, resizable=no, top=150, left=300, width=400, height=400');">
                                                <i class="fa fa-google"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div class="twitter-share">
                                    <div class="input-group">
                                        <input type="text" class="form-control" value="https://letreach.com/?refid=tesorin">
                                        <span class="input-group-btn">
                                            <button class="btn btn-primary btn-twitter-share" type="button"
                                                    onclick="window.open('https://twitter.com/intent/tweet/?text=Folks, I found an amazing tool called @letreach which lets one send push notifications from websites. https://letreach.com/?refid=tesorin', '_blank', 'toolbar=yes, scrollbars=yes, resizable=no, top=150, left=300, width=400, height=400');">
                                                <i class="fa fa-twitter"></i>
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
                <li class="item">
                    <a href="#" data-toggle="modal" data-target="#upgradeModal" id="navUpgrade">Upgrade</a>
                </li>
            </ul>
        </div>
    </div>
</div>


<div ui-view></div>

<footer>
    <div class="container">
        <div class="row">
            <div class="text-center">
                <h4>LetReach 2.0 (Beta)</h4>
                <h6>© 2015-2016 All rights reserved. <a href="https://letreach.com/privacy-policy">Privacy</a> and <a href="https://letreach.com/terms-conditions">Terms</a></h6>
            </div>
        </div>
    </div>
</footer>

</body>
</html>
