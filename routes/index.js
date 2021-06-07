var express = require('express');
const https = require('https');
const got = require('got');
const { HttpError } = require('http-errors');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("HELLO");
})

router.get('/linkedin/login', async function(req, res, next) {
  if(req.session.accessToken){
    res.send(req.session.accessToken);
  } else {
    const clientId = ".";
  const clientSecret = ".";
  const calbackURL = "http%3A%2F%2Flocalhost%3A3000%2Flinkedin%2Fcallback";
  res.redirect(`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${calbackURL}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`);
  }
});

router.get('/linkedin/callback', async function(req, res, next) {
  console.log(req);
  const clientId = ".";
  const clientSecret = ".";
  const authCode = req.query.code;
  const calbackURL = "http://localhost:3000/linkedin/callback";
  try {
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      form: {
        grant_type : 'authorization_code',
        code: authCode,
        redirect_uri: calbackURL,
        client_id: clientId,
        client_secret: clientSecret
      }
    };
    
    const {body, statusCode} = await got.post(
      `https://www.linkedin.com/oauth/v2/accessToken`, options);

    console.log(body);

    req.session.accessToken = JSON.parse(body).access_token;
  } catch (error) {
    console.log(error.response);
  }
  res.sendStatus(200);
});

module.exports = router;
