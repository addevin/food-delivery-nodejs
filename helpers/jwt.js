const jwt = require('jsonwebtoken');

module.exports = {
    sign:(uData, expiresIn=process.env.JWT_DEFAULT_SESSION_TIMEOUT)=>{
        const jwtAccessSecret = process.env.JWT_ACCESS_SECRET_TOKEN; 
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET_TOKEN;
        const jwtRefreshToken = jwt.sign(uData, jwtRefreshSecret, { expiresIn }); //1h = 10000
        const jwtAccessToken = jwt.sign(uData, jwtAccessSecret, { expiresIn:'15m' }); //15 minutes
        return {
          token:{
            accessToken:jwtAccessToken, 
            refreshToken:jwtRefreshToken
          },
          expire:{
            time:jwt.decode(jwtAccessToken).exp*1000,
            timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        };
    },
    verify:(req,res,next)=>{
        let apiRes = {
            status:401,
            message:'Login required!',
            authorization:false,
            data:{}
        }
        let jwtSecret = process.env.JWT_ACCESS_SECRET_TOKEN;
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            apiRes.message = 'Missing authorization header'
          return res.status(200).json(apiRes);
        }
      
        try {
          const decoded = jwt.verify(token, jwtSecret);
          res.locals.jwtUSER = decoded;
          if(decoded) next()
        } catch (err) {
            console.log(err);
            apiRes.message = 'Invalid token'
            res.status(200).json(apiRes);
        }
    },
    verifySocketUserToken_forSocketIo : (socket, next) => {
      let apiRes = {
        status: 401,
        message: 'Login required!',
        authorization: false,
        data: {
          isAgent:false
        }
      };

      if(socket.handshake.auth.token){
        const jwtSecret = process.env.JWT_ACCESS_SECRET_TOKEN;
        const token = socket.handshake.auth.token;
        try {
          const decoded = jwt.verify(token, jwtSecret);
          socket.jwtUSER = decoded;
          apiRes.authorization = true;
          apiRes.status = 'ok';
          apiRes.message = 'token verified!';
          apiRes.data.isAgent = true;
          socket.apiRes = apiRes;
          return next();
        } catch (err) {
          console.log(err);
          apiRes.message = 'Invalid token';
          socket.apiRes = apiRes;
          return socket.emit('error',apiRes.message)
          
        }
      }else{
        apiRes.authorization = true;  
        socket.apiRes = apiRes;
        return next()
      }
    },
    generateAccessTkn:(req)=>{
      let resObj = {
        error:true,
        data:'Unknown Error!'
      }
      const authHeader = req.headers.authorization;
      const jwtRefreshToken = authHeader && authHeader.split(' ')[1];
      if (!jwtRefreshToken) {
        resObj.data = 'Missing authorization token!';
        return resObj;
      }
    
      try {
        const decoded = jwt.verify(jwtRefreshToken, process.env.JWT_REFRESH_SECRET_TOKEN);
        if(decoded){
          const jwtAccessToken = jwt.sign({_id:decoded._id,username:decoded.username,dashboard:decoded.dashboard}, process.env.JWT_ACCESS_SECRET_TOKEN, { expiresIn:'15m' }); //15 minutes
          resObj.data = jwtAccessToken;
          resObj.data = {
             token:{
                accessToken:jwtAccessToken, 
                refreshToken:jwtRefreshToken
              },
              expire:{
                time:jwt.decode(jwtAccessToken).exp*1000,
                timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone
              }
            }
          resObj.error = false;
        }
        return resObj
      } catch (err) {
        console.log(err);
        resObj.data = 'Invalid token!'
        return resObj;
      }
    }
}