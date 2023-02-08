//Install express server
const express = require('express');

let app=express();


// Serve only the static files form the dist directory
app.use(express.static(__dirname+'/dist/distribuidora-web'));

app.get('/*', (req, res) =>
    res.sendFile(__dirname+'/dist/distribuidora-web/index.html'),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);