const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const exphbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 3000;

// Serve static content for the app from the 'public' directory in the application directory.
app.use(express.static(path.join(__dirname, '/public')));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false,
}));
// Override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
// register the .handlebars extension with express and set the main layout page
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
// Use handlebars to render the website
app.set('view engine', 'handlebars');

// Import routes from the controller
require('./controllers/burgers_controller')(app);

// Start listening for connections
app.listen(port);
