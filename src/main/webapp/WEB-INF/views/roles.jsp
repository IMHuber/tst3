<div class="section">
    <h3>{{headingTitle}}</h3>
    <div>
        <ul type="square">
            <li>Administrator</li>
            <li>Super Admin</li>
            <li>User</li>
            <li>View-Only</li>
        </ul>
    </div>
</div>


<form ng-submit="registerSw()">
    <input type="submit" value="regSW">
</form>

<form ng-submit="askPermission()">
    <input type="submit" value="askPermission">
</form>

<form ng-submit="subscribe()">
    <input type="submit" value="subscribe">
</form>

<form ng-submit="sendMsg()">
    <input type="submit" value="send">
</form>