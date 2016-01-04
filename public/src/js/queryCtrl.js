// queryCtrl.js

// Creates the addCtrl Module and Controller. Note that it depends on 'geolocation' and 'gservice' modules.
var queryCtrl = angular.module('queryCtrl', ['geolocation', 'gservice', 'vAccordion']);
queryCtrl.controller('queryCtrl', function($scope, $log, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var queryBody = {};
    var queryResults;

    // Functions
    // ----------------------------------------------------------------------------

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Set the latitude and longitude equal to the HTML5 coordinates
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
        });
    });

    // Take query parameters and incorporate into a JSON queryBody
    $scope.querySites = function(){

        // Assemble Query Body
        queryBody = {
            // longitude: parseFloat($scope.formData.longitude),
            // latitude: parseFloat($scope.formData.latitude),
            // distance: parseFloat($scope.formData.distance),
            // male: $scope.formData.male,
            // female: $scope.formData.female,
            // other: $scope.formData.other,
            // minAge: $scope.formData.minage,
            // maxAge: $scope.formData.maxage,
            siteName: $scope.formData.siteName,
            siteDesc: $scope.formData.siteDesc
        };

        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/query', queryBody)

            // Store the filtered results in queryResults
            .success(function(queryResults){

                // Query Body and Result Logging
                // console.log("QueryBody:");
                // console.log(queryBody);
                // console.log("QueryResults:");
                // console.log(queryResults);

                // Pass the filtered results to the Google Map Service and refresh the map
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude, queryResults);
                // Count the number of records retrieved for the panel-footer
                $scope.queryCount = queryResults.length;
            })
            .error(function(queryResults){
                console.log('Error ' + queryResults);
            });

            // return gservice;
    };
    // Take query parameters and incorporate into a JSON queryBody
    $scope.selectSite = function(data){

        var siteID = data;
        // var siteReturned;
        console.log('Site clicked: ' + siteID);

        queryBody = {
            _id: siteID
        };
        // Post the queryBody to the /query POST route to retrieve the filtered results
        $http.post('/site-query', queryBody)

            // Store the filtered results in queryResults
            .success(function(queryResults){

                // Query Body and Result Logging
                console.log("QueryBody:");
                console.log(queryResults);

                // Pass the filtered results to the Google Map Service and refresh the map
                gservice.refresh(queryResults[0].siteCoords[1], queryResults[0].siteCoords[0], queryResults);
                // Count the number of records retrieved for the panel-footer
                // $scope.queryCount = queryResults.length;
            });

            // return gservice;
    };
    $http.get('/sites')
        .success(function(data) {
            $scope.sites = data;
            console.log(data);
        });
});