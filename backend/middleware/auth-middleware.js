const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

const authenticateToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    else{
      userModel.findOne({_id:user._id}).then((user)=>{
       req.user = user;
         next();
      })
   }
    // Token is valid, set the user on the request object
  });
};

const authenticateAdminToken = async(req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    else{
       userModel.findOne({_id:user._id}).then((user)=>{
        if(!(user.userType=='admin')){
          return res.status(200).send({users:[]})
        }else{  
          req.user = user;
          next();
        }
       })
    }

    // Token is valid, set the user on the request object
    
  });
};
module.exports = {authenticateToken ,authenticateAdminToken};
