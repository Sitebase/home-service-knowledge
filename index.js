var express = require('express');
var icloud = require('./icloud');
var info = require('./package.json');

// Express page
var app = express();
app.set('port', (process.env.PORT || 5000))
app.set('icloud-email', (process.env.ICLOUD_EMAIL || null))
app.set('icloud-password', (process.env.ICLOUD_PASSWORD || null))
app.use(express.static(__dirname + '/public'))


app.get('/', function(request, response) {
    response.send({
        name: info.name,
        version: info.version
    });
});

// icloud information endpoint
app.get('/icloud', function(request, response) {

    var email = app.get('icloud-email');
    var password = app.get('icloud-password');

    if(!email || !password)
        return response.send({error: "set ICLOUD_EMAIL and ICLOUD_PASSWORD environment variable"});

    // replace with external lib once I found a good one
    var instance = icloud();
    instance.login(email, password, function(err){

        if(err)
            return response.send({error: err});

        instance.findme(function(err, results) {
            if(err)
                return response.send({error: err});

            response.send(results);
        })

    })
})

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});

process.on('SIGINT', function() {
    process.exit();
});
