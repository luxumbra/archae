// Dependencies
var mongoose        = require('mongoose');
var Site            = require('./model.js');
// var ma              = require('jquery');
// Opens App Routes
module.exports = function(app) {
    // ma.console.log('routes...');
    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all sites in the db
    app.get('/sites', function(req, res){
        console.log('Route: /sites - Get all sites');
        console.log('-------------------------');
        // Uses Mongoose schema to run the search (empty conditions)
        var query = Site.find({});
        query.exec(function(err, sites){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(sites);
        });
    });

    // Retrieve records for the typeahead functionality
    app.get('/typeahead-query', function(req, res){
        var input = req.body;
        // res.json(input);
        // var jsonInput = angular.toJson(input);
        // res.send('input: ' + input);
        // Opens a generic Mongoose Query. Depending on the post body we will...
        // var query = Site.find({});


        // ... Other queries will go here ...
        if(input) {
            var query = Site.find({})
            .select('siteName')
            .limit(8);
                // res.send(query);
                // Execute Query and Return the Query Results
                query.exec(function(err, output){
                    if(err)
                        res.send(err);

                    // If no errors, respond with a JSON of all users that meet the criteria
                    res.json(output);
                });
        }


    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/sites', function(req, res){

        // Creates a new User based on the Mongoose schema and the post body
        var newsite = new Site(req.body);

        // New User is saved in the db.
        newsite.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });

    app.post('/site-edit', function(req, res){
        var site = req.body;

        console.log('site for editing: ' + site.siteName);

        // Uses Mongoose schema to run the search (empty conditions)
        var siteedit = Site.update({'siteName': ''+site.siteName+''}, {$set: {'dateVisited': site.dateVisited, 'siteDesc': ''+site.siteDesc+''}});

        siteedit.exec(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(req.body);
        });
    });

    // Query sites
    // --------------------------------------------------------

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query', function(req, res){

        // Grab all of the query parameters from the body.
        var siteName = req.body.siteName;
        var siteDesc = req.body.siteDesc

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = Site.find({});

        // ... Other queries will go here ...
        if(siteName) {
            query = Site.find({siteName:{$regex:siteName,$options:"$i"}});
        }
        if(siteDesc) {
            query = Site.find({siteDesc:{$regex:siteDesc,$options:"$i"}});
        }

        // Execute Query and Return the Query Results
        query.exec(function(err, sites){
            if(err)
                res.send(err);

            // If no errors, respond with a JSON of all users that meet the criteria
            res.json(sites);
        });
    });
    app.post('/site-query', function(req, res){
        var _id = req.body._id;
        console.log('site query: ' + _id);
        // Uses Mongoose schema to run the search (empty conditions)
        var query = Site.find({'_id': _id});

        query.exec(function(err, sites){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(sites);
        });
    });
    app.post('/site-edit-query', function(req, res){
        var siteName = req.body.siteName;
        // Uses Mongoose schema to run the search (empty conditions)
        var query = Site.find({'siteName': ''+siteName+''});

        query.exec(function(err, site){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(site);
        });
    });

};