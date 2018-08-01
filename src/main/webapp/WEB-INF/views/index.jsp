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



<body onload="registerSw()">
<script src="/libs/angularjs/1.7.2/angular.js"></script>
<script src="/libs/angularjs/1.7.2/angular-resource.js"></script>
<script src="/libs/angularjs/1.7.2/angular-route.js"></script>
<script src="resources/app.js"></script>
<script src="resources/app/roles/rolesController.js"></script>
<script src="resources/app/roles/rolesDataService.js"></script>
<script src="resources/app/users/usersController.js"></script>
<link rel="stylesheet" href="libs/bootstrap/4.1.1/css/bootstrap.css">

<script>
    function send() {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "/api/send", false );
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
</script>


<h2>Administrator Panel22</h2>
<div class="home-section">
    <ul class="menu-list">
        <li><a href="#!/users">Users</a></li>
        <li><a href="#!/roles">Roles</a></li>
    </ul>
</div>

<button onclick="send()">send</button>

<div ng-view></div>

</body>
</html>
