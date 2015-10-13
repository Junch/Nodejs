/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	signup: function(req, res){
		console.log('Backend Signup');

		var Passwords = require('machinepack-passwords');

		Passwords.encryptPassword({
			password: req.param('password'),
			difficulty: 10
		}).exec({
			error: function(err){
				return res.negotiate(err);
			},
			success: function(encryptPassword){
				// Create User
				User.create({
					name: req.param('name'),
					email: req.param('email'),
					password: encryptPassword,
					lastLoggedIn: new Date()
				}, function userCreated(err, newUser){
					if (err) {
						console.log('Error:'+err);
						return res.negotiate(err);
					}

					console.log('User Added');
					return res.json({
						id: newUser.id
					});
				})
			}
		})
	},

	login: function(req, res) {
		User.findOne({
			email: req.param('email')
		}, function foundUser(err, user){
			if (err) {
				return res.negotiate(err);
			}
			if (!user) {
				return res.notFound();
			}	

			var Passwords = require('machinepack-passwords');
			Passwords.checkPassword({
				passwordAttempt: req.param('password'),
				encryptedPassword: user.password
			}).exec({
				error: function(err) {
					console.log('Password Error'+err);
					return res.negotiate();
				},
				incorrect: function() {
					console.log('Password incorrect');
					return res.notFound();
				},
				success: function() {
					//req.session.me = user.id;
					console.log('SUCCESS');
					return res.ok();
				}
			});
		});
	}

};

