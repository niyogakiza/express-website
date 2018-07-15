const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', ((req,res) => {
  res.render('index');
}));

app.get('/about', ((req,res) => {
    res.render('about');
}));

app.get('/contact', ((req,res) => {
    res.render('contact');
}));

app.post('/contact/send', ((req,res) => {
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'example@gmail.com',
          pass: ''
      }
  });
  const mailOptions = {
      from: 'Aima <niyoai@gmail.com>',
      to : 'example89@gmail.com',
      subject: 'Website  Submition',
      text: `You have a Submission with the following details... Name: ${req.body.name} Email: ${req.body.email}, Message:${req.body.message}`,
      html: `<p>You have a Submission with the following details...</p>
                <ul>
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body.Email}</li>
                <li>Message: ${req.body.message}</li>
                </ul>`
  }
  transporter.sendMail(mailOptions, ((err, info) =>{
    if(err){
      console.log(err);
      res.redirect('/');
    } else {
        console.log(`Message Sent: ${info.response}`);
        res.redirect('/');
    }
  }))
  // console.log('test')
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
