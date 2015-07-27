var ldap = require('ldapjs');
var server = 'ldap://ldap.berkeley.edu';
var searchBase = 'ou=people,dc=berkeley,dc=edu';

var client = ldap.createClient({
  url: server
});

var opts = {
  filter: '(objectclass=*)',
  scope: 'base'
}; 

client.search(searchBase, opts, function(err, res) {
  res.on('searchEntry', function (entry) {
    console.log(entry.toString());
  });

   res.on('end', function (entry) {
     client.unbind();
  });
});
