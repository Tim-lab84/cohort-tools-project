const { expressjwt: jwt } = require('express-jwt');
const secret = process.env.JWT_SECRET || 'Kappa'; 


const auth = jwt({
  secret: secret, 
  algorithms: ['HS256'], 
  userProperty: 'auth',  
});

module.exports = auth;
