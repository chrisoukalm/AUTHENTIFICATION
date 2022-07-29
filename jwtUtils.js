// Imports
const jwt = require('jsonwebtoken');
const fs = require('fs');
const JWT_SIGN_SECRET = 'ZKV6565c8seOvfbgVLESpdV8O8wLJP1yhxh/PyNDeu';


// Exported functions
module.exports = {
  generateToken: function(userData) {
    return jwt.sign({
      username: userData.username
    },
    JWT_SIGN_SECRET,
    {
      expiresIn: '48h'
    })
  },
  parseAuthorization: function(authorization) {
    return (authorization != null) ? authorization.replace('Bearer ', '') : null;
  },
  getUserId: function(authorization) {
    const token = module.exports.parseAuthorization(authorization);
    if(token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if(jwtToken != null)
          username = jwtToken.username;
      } catch(err) { }
    }
    return username;
  }
}