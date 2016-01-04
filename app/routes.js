// Dependencies
var mongoose        = require('mongoose');
var Site            = require('./model.js');

// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all sites in the db
    app.get('/sites', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Site.find({});
        query.exec(function(err, sites){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of all users
            res.json(sites);
        });
    });

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new users in the db
    app.post('/sites', function(req, res){

        // Creates a new User based on the Mongoose schema and the post bo.dy
        var newsite = new Site(req.body);

        // New User is saved in the db.
        newsite.save(function(err){
            if(err)
                res.send(err);

            // If no errors are found, it responds with a JSON of the new user
            res.json(req.body);
        });
    });

    // Query sites
    // --------------------------------------------------------

    // Retrieves JSON records for all users who meet a certain set of query conditions
    app.post('/query', function(req, res){

        // Grab all of the query parameters from the body.
        var siteName = req.body.siteName;

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
};