// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;
    console.log('Add control in use');

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 54.1772743;
    $scope.formData.longitude = -4.656563;

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(5);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(5);
            $scope.formData.htmlverified = "Site selected";
        });
    });

    // Functions
    // ----------------------------------------------------------------------------
    // Creates a new site based on the form fields
    $scope.createSite = function() {
        var jsonDate = JSON.stringify({date: $scope.formData.dateVisited});
        var dateObj = JSON.parse(jsonDate);

        dateObj.date = new Date(dateObj.date);
        // Grabs all of the text box fields
        var siteData = {
            siteName: $scope.formData.siteName,
            siteDesc: $scope.formData.siteDesc,
            dateVisited: dateObj.date,
            siteCoords: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };

        // Saves the user data to the db
        $http.post('/sites', siteData)
            .success(function (data) {

                // Once complete, clear the form (except location)
                $scope.formData.siteName = "";
                $scope.formData.siteDesc = "";
                $scope.formData.dateVisited = "";
                $scope.formData.siteCoords = "";

                // Refresh the map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);


            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
    $scope.resetForm = function(){
                        // Once complete, clear the form (except location)
                $scope.formData.siteName = "";
                $scope.formData.siteDesc = "";
                $scope.formData.dateVisited = "";
                $scope.formData.longitude = "";
                $scope.formData.latitude = "";
                $scope.formData.htmlverified = "";
    };
});