// Imports
const bcrypt    = require('bcrypt');
const jwtUtils  = require('./jwtUtils.js');
const asyncLib  = require('async');
const fs = require('fs');

// Constants REGEX
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

// Routes
module.exports = {
  register: function(req, res) {
    
    // données utilisateurs
    let email    = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    if (email == null || username == null || password == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if (username.length >= 13 || username.length <= 4) {
      return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ 'error': 'email is not valid' });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
    }

    if(fs.existsSync('db.json')){
      const rawdata = fs.readFileSync('db.json');
      let result = false;
      let jsonData = JSON.parse(rawdata);
      jsonData.forEach((el) => {
        if(el.username === username) {
          result = true;
        }
      });
      if(result) {
        return res.status(409).json({ 'error': 'user already exist' });
      }else{
        bcrypt.hash(password, 5, function(_err, bcryptedPassword) {
            let myData = {
                "email":email,
                "username": username, 
                "password" : bcryptedPassword 
            }
            jsonData.push(myData);
            if(fs.writeFileSync('db.json',JSON.stringify(jsonData), 'utf8') === false){ 
                return res.status(500).json({ 'error': 'cannot add user' });
            }else{
                return res.status(200).json({ 'success': 'user added successfully' });
            }
        })
      }      
    }else{
      bcrypt.hash(password, 5, function(_err, bcryptedPassword) {
        let myData = [{
            "email":email,
            "username": username, 
            "password" : bcryptedPassword 
        }]

        if(fs.writeFileSync('db.json', JSON.stringify(myData), 'utf8') == false){ 
            return res.status(500).json({ 'error': 'cannot add user' });
        }else{
            return res.status(200).json({ 'success': 'user added successfully' });
        }
    })
    }
},
  login: function(req, res) {
    
    // données reçues du formulaire
    const email    = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (email == null ||  password == null || username == null) {
      return res.status(400).json({ 'error': 'missing parameters' });
    }

    if(fs.existsSync('db.json')){
      let rawdata = fs.readFileSync('db.json');
      let result = false;
      let jsonData = JSON.parse(rawdata);
      let user = '';
      jsonData.forEach((el) => {
        if(el.username === username) {
          user = el;
          result = true;
        }
      });
      if(result){
        bcrypt.compare(password, user.password, function(_err, resBycrypt) {
          if(resBycrypt) {
            if (user) {
              return res.status(201).json({
                'username': user.username,
                'token': jwtUtils.generateToken(user)
              });
            } else {
              return res.status(500).json({ 'error': 'cannot log on user' });
            }
          } else {
            return res.status(403).json({ 'error': 'invalid password' });
          }
        });
      }else{
        return res.status(404).json({ 'error': 'user not exist in DB' });
      }
    }else{
      return res.status(500).json({ 'error': 'unable to verify user' });
    }
  }
}