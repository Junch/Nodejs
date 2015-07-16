// http://www.lellansin.com/node-js-%E4%BD%BF%E7%94%A8-qq%E9%82%AE%E7%AE%B1%E5%8F%91%E9%80%81%E9%82%AE%E4%BB%B6.html

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
	// Option 1: use host, secure, port
	//host: 'smtp.qq.com',
	//secure: true,
	//port: 465,
	// Option 2: use service directly
	service: "qq",
	auth: {
		user: '2829397@qq.com',
		pass: 'xxxxxxxx'
	}
}));

transporter.sendMail({
    from: '2829397@qq.com',
    to: 'jun.chen@autodesk.com',
    subject: 'hello',
    text: 'hello world!'
}, function(error, response){
	if (error){
		console.log(error);
	}else{
		console.log("Message sent: " + response.Message);
	}

	transporter.close();
});
