var express = require('express')
var nunjucks = require('nunjucks')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var User = require('./models/user')
var http = require('http')

app = express()

app.set('dbhost', process.env.IP || 'localhost')
app.set('dbname', 'choice')
mongoose.connect('mongodb://' + app.get('dbhost') + '/' + app.get('dbname'))

app.set('view engine', 'html')
app.set('views', __dirname + '/views')
nunjucks.configure('views', { //setting up our templating engine
  autoescape: true,
  express: app,
  watch: true
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ //make user input safe
  extended: false
}));
app.get('/', function(req, res, next){
  res.render('index', {
    title: 'Tell us about you! | Choices'
  })
})
app.post('/submit', function(req, res, next){
  if (!req.body.email){
    return res.status(400).json({description:'You forgot an email! Please try again'})
  }
  user = new User()
  user.set({
    email: req.body.email,
    flavors: req.body.flavors || [''],
    cola: req.body.cola
  })
  user.save(function(err) {
      if (err) {
        return res.status(500).json({description:"Server error"})
      }
      else {
        return res.render('thanks', {
          title: 'Thank you! | Choices'
        })
      }
  });
})

var server = http.createServer(app).listen(8080, function() {
  console.log("Running")
});
