// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('archaeologyApp', ['addCtrl', 'editCtrl', 'queryCtrl', 'geolocation', 'gservice', 'ngRoute', 'flow', 'ngAnimate']);
// Configures Angular routing -- showing the relevant view and controller when needed.
app.config(function($routeProvider){

    // Join Team Control Panel
    $routeProvider.when('/add-site', {
        controller: 'addCtrl',
        templateUrl: 'partials/addForm.html'

        // Find Teammates Control Panel
    }).when('/', {
        controller: 'queryCtrl',
        templateUrl: 'partials/queryForm.html'

        // All else forward to the Join Team Control Panel
    }).when('/edit-site', {
        controller: 'editCtrl',
        templateUrl: 'partials/editForm.html'
    }).otherwise({redirectTo:'/'});
});