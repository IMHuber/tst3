<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html ng-app="app">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Push App</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="resources/app.css">
</head>



<body>
<script src="/libs/angularjs/1.7.2/angular.js"></script>
<script src="/libs/angularjs/1.7.2/angular-resource.js"></script>
<script src="/libs/angularjs/1.7.2/angular-route.js"></script>
<script src="resources/app.js"></script>
<script src="resources/app/roles/rolesController.js"></script>
<script src="resources/app/roles/rolesDataService.js"></script>
<script src="resources/app/users/usersController.js"></script>
<link rel="stylesheet" href="libs/bootstrap/4.1.1/css/bootstrap.css">

<h2>Administrator Panel22</h2>
<div class="home-section">
    <ul class="menu-list">
        <li><a href="#!/users">Users</a></li>
        <li><a href="#!/roles">Roles</a></li>
    </ul>
</div>


<form ng-submit="registerSwMain()">
    <input type="submit" value="regSW">
</form>

<form ng-submit="askPermissionMain()">
    <input type="submit" value="askPermission">
</form>

<form ng-submit="subscribeMain()">
    <input type="submit" value="subscribe">
</form>

<form ng-submit="sendMsgMain()">
    <input type="submit" value="send">
</form>


<div ng-view></div>

</body>
</html>
