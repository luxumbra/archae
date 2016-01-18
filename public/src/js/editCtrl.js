// Creates the addCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var editCtrl = angular.module('editCtrl', ['geolocation', 'gservice']);
editCtrl.controller('editCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.editFormData = {};
    var queryBody = {};
    var queryResults = {};
    var taInitial = {};
    $scope.searchData = {};
    $scope.searchResults = [];
    // $scope.sitesByName = function();
    console.log('Edit controller in use');

    // var coords = {};
    // var lat = 0;
    // var long = 0;

    // // Set initial coordinates to the center of the US
    // $scope.formData.latitude = 54.1772743;
    // $scope.formData.longitude = -4.656563;

    // // Get User's actual coordinates based on HTML5 at window load
    // geolocation.getLocation().then(function(data){

    //     // Set the latitude and longitude equal to the HTML5 coordinates
    //     coords = {lat:data.coords.latitude, long:data.coords.longitude};

    //     // Display coordinates in location textboxes rounded to three decimal points
    //     $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
    //     $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

    //     // Display message confirming that the coordinates verified.
    //     $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

    //     gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    // });

    // // Get coordinates based on mouse click. When a click event is detected....
    // $rootScope.$on("clicked", function(){

    //     // Run the gservice functions associated with identifying coordinates
    //     $scope.$apply(function(){
    //         $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
    //         $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
    //         $scope.formData.htmlverified = "Site selected";
    //     });
    // });

    // Functions
    // ----------------------------------------------------------------------------

    // $scope.sitesByName = function(output){

    //     $scope.sites = {};

    //     $http.get('/typeahead-query')
    //     .then(function(output){
    //         $scope.sites = output.data;
    //         console.log('sitesByName: '+ $scope.sites);
    //     });
    // };
    // sitesByName(output);
    // Does the typeahead and plugs it in to the db.
    $scope.typeAhead = function(val) {

        $scope.entered = val;

        return $http.get('/typeahead-query', $scope.entered)
        .then(function(output){

            // define the search results
            $scope.searchData = output.data;
            var sites = $scope.searchData;
            $scope.siteNames = [];

            sites.forEach(function(site){

                $scope.siteNames.push(site.siteName);

            });
            return $scope.siteNames;

        });

    };
    // $scope.taModelOptions = {
    //   debounce: {
    //     default: 500,
    //     blur: 250
    //   },
    //   getterSetter: true
    // };

    // Get an existing site based on the text input
    $scope.getSite = function(data) {
        console.log('function: getSite()');
        // console.log('Data: ' + data);
        var siteToEdit = {};
        queryBody = {
                siteName: data
            };

        // console.log('Search data: ' + angular.toJson(queryBody));

        $http.post('/site-edit-query', queryBody)
            .success(function (queryResults) {
                // console.log('Site to edit query:-');
                // console.log(queryResults);
                siteToEdit = queryResults[0];
                console.log('Site to edit: ' + angular.toJson(siteToEdit));
                if(!siteToEdit){
                    console.log('not enough info to select a site.');
                } else {
                    // console.log('Site to edit json:-');
                    // console.log(siteToEdit);

                     var dateVisited = new Date(siteToEdit.dateVisited);
                     console.log('Date we visited: ' + dateVisited);
                     // Once complete, clear the form (except location)
                     $scope.formData.siteName = siteToEdit.siteName;
                     $scope.formData.siteDesc = siteToEdit.siteDesc;
                     $scope.formData.dateVisited = dateVisited;
                     $scope.formData.latitude = siteToEdit.siteCoords[1];
                     $scope.formData.longitude = siteToEdit.siteCoords[0];
                     $scope.formData.htmlverified = siteToEdit.htmlverified;

                     gservice.refresh($scope.formData.latitude, $scope.formData.longitude, queryResults[0]);
                 }

            })
            .error(function (queryResults) {
                console.log('Error: ' + queryResults);
            });
    };

    $scope.editSite = function() {

        var jsonDate = JSON.stringify({date: $scope.formData.dateVisited});
        var dateObj = JSON.parse(jsonDate);
        console.log('jsonDate: ' + jsonDate);
        console.log('dateObj: ' + dateObj.date);
        dateObj.date = new Date(dateObj.date);
        console.log('new date for saving: ' + dateObj.date);
        // Grabs all of the text box fields
        var siteData = {
            siteName: $scope.formData.siteName,
            siteDesc: $scope.formData.siteDesc,
            dateVisited: new Date(dateObj.date),
            siteCoords: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };
        console.log('Date visited: ' + siteData.dateVisited);
        // Saves the user data to the db
        $http.post('/site-edit', siteData)
            .success(function (data) {
                console.log('siteData posted');
                // Once complete, clear the form (except location)
                // $scope.formData.siteName = "";
                // $scope.formData.siteDesc = "";
                // $scope.formData.dateVisited = "";
                // $scope.formData.siteCoords = "";

                // Refresh the map with new data
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);


            })
            .error(function (data) {
                console.log('Error: ' + data);
            });
    };
});