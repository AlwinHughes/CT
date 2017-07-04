var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var config = require('./config');

require('./server/models').connect(config.dbUri);

var app = express();

app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize());

const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);

// const authCheckMiddleware = require('./server/middleware/auth-check');
// app.use('/api', authCheckMiddleware);

const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);


// app.get('/', function(req, res){
//   res.send('meme');
// })

app.get('/s', function(req, res) {
  res.redirect('/?p=s');
});

app.get('/l', function(req, res) {
  res.redirect('/?p=l');
});

app.get('/a', function(req, res) {
  res.redirect('/?p=a');
});

app.listen(8080, function(err) {
  if(err)
    console.log('err: ', err);

  console.log('listening on 8080');
});
