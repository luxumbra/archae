// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('archaeologyApp', ['addCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute', 'flow']);
// Configures Angular routing -- showing the relevant view and controller when needed.
app.config(function($routeProvider){

    // Join Team Control Panel
    $routeProvider.when('/add-site', {
        controller: 'addCtrl',
        templateUrl: 'partials/addForm.html',

        // Find Teammates Control Panel
    }).when('/', {
        controller: 'queryCtrl',
        templateUrl: 'partials/queryForm.html',

        // All else forward to the Join Team Control Panel
    }).otherwise({redirectTo:'/'});
});