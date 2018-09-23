<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<html ng-app="app">
<head>
    <title>Push App</title>
</head>



<body style="min-height:100%; height:auto;">

<script src="libs/angularjs/1.7.2/angular.js"></script>
<script src="libs/angular-ui-router/1.0.15/angular-ui-router.js"></script>
<script src="libs/angularjs/1.7.2/angular-resource.js"></script>
<script src="libs/angular-animate/1.7.2/angular-animate.js"></script>
<script src="libs/angular-material/1.1.5/angular-material.js"></script>
<script src="libs/angular-aria/1.6.9/angular-aria.min.js"></script>
<script src="resources/app.js"></script>
<script src="resources/app/login/loginController.js"></script>
<script src="resources/app/login/loginDataService.js"></script>
<script src="resources/app/main/mainController.js"></script>
<script src="resources/app/main/mainDataService.js"></script>
<script src="resources/app/users/usersController.js"></script>
<script src="resources/app/notifications/notificationsController.js"></script>
<script src="resources/app/notifications/notificationsDataService.js"></script>
<script src="resources/app/menu/menuController.js"></script>

<link rel="stylesheet" href="libs/bootstrap/4.1.1/css/bootstrap.css">
<link rel="stylesheet" href="libs/angular-material/1.1.5/angular-material.min.css"/>
<link rel="stylesheet" href="resources/css/app.css">


<header style="background-color: white">
    <nav class="navbar navbar-default">
        <div class="container" style="min-width: 100%">
            <div class="navbar-header" style="color: #007bff; margin-left: -15px;">
                <a class="navbar-brand">Push The Tempo</a>
            </div>

            <div class="nav navbar-nav navbar-right" style="color: #007bff;" ng-if="isAuthenticated">
                <a class="navbar-brand" ng-click="logout()" style="cursor: pointer; padding-right: 0; margin-right: 0">Logout</a>
            </div>
        </div>
    </nav>
</header>

<section layout="row" flex style="height: 100%">
    <md-sidenav class="md-sidenav-left" md-component-id="left" md-is-locked-open="$mdMedia('gt-md')" md-whiteframe="4">
        <md-toolbar class="md-theme-indigo">
            <h1 class="md-toolbar-tools">Console</h1>
        </md-toolbar>

        <div ng-controller="menuController" ng-if="isAuthenticated">
            <div class="menu-item" ng-repeat="menuItem in menuItems" style="font: 1.2rem 'AmstelvarAlpha', sans-serif; padding: 40px 20px 0px 20px;">
                <%--<img ng-src="{{menuItem.img}}">--%>
                <a ng-click="toggleSidenav('leftSidenav', 'leftHumbButt')" ui-sref="{{menuItem.state}}" ui-sref-active="active">
                    {{menuItem.title}}
                </a>
            </div>
        </div>
    </md-sidenav>

    <md-content flex layout-padding>
        <div ui-view></div>
    </md-content>
</section>

</body>
</html>
