// http://www.cnblogs.com/Chen-xy/p/4466460.html

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
	service: '163',
	auth: {
		user: 'chenjun_76@163.com',
		pass: 'xxxxxx'
	}
}));

transporter.sendMail({
    from: 'chenjun_76@163.com',
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
