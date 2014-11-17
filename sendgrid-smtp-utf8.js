var dotenv = require('dotenv');
dotenv.load();

var sendgrid_username   = process.env.SENDGRID_USERNAME;
var sendgrid_password   = process.env.SENDGRID_PASSWORD;
var from                = process.env.FROM;
var tos                 = process.env.TOS.split(',');

var nodemailer = require('nodemailer');
var setting = {
  host: 'smtp.sendgrid.net',
  port: 587,
  requiresAuth: true,
  auth: {
    user: sendgrid_username,
    pass: sendgrid_password
  }
};
var mailer = nodemailer.createTransport(setting);

var smtpapi = require('smtpapi');
var header = new smtpapi();
header.setTos(tos);
header.addSubstitution('fullname', ['田中 太郎', '佐藤 次郎', '鈴木 三郎']);
header.addSubstitution('familyname', ['田中', '佐藤', '鈴木']);
header.addSubstitution('place', ['office', 'home', 'office']);
header.addSection('office', '中野');
header.addSection('home', '目黒');
header.addCategory('Category1');

var email = {
  from:     from,
  to:       tos,
  subject:  '[sendgrid-nodemailer-example] フクロウのお名前はfullnameさん',
  text:     'familynameさんは何をしていますか？\r\n 彼はplaceにいます。',
  html:     '<strong>familynameさんは何をしていますか？</strong><br />彼はplaceにいます。',
  headers:  {"x-smtpapi": header.jsonString()},
  attachments: [{
    path: './gif.gif'
  }]
};

mailer.sendMail(email, function(err, res) {
  mailer.close();
  if (err) {
    console.log(err);
  }
  console.log(res);
});
