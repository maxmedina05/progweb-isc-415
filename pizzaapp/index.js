require('dotenv').config();
const express       = require('express');
const bodyParser    = require('body-parser');
const path          = require("path");
const helpers       = require(__dirname + '/lib/helpers');
const exphbs        = require('express-handlebars');
const PORT          = process.env.PORT;

// Custom Components
const APIModule = require(__dirname + '/api/api.module');
const routes    = require(__dirname + '/components/app.routes');

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use('/static', express.static(__dirname + '/public'));
app.use('/vendors', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    helpers: helpers
  }
));
app.set('view engine', '.hbs');

APIModule(app);

app.get('/', function (req, res) {
    // res.render('home');
    res.redirect('/pizza');
});

app.use('/', routes);

app.listen(PORT, function () {
  console.log('Example app listening on port ', PORT);
});
