const {google} = require('googleapis');
const fs = require('fs');
const readline = require('readline');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/user.emails.read', 
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/contacts.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const client_secret = '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';
  const client_id = '212663848106-c3tqnh4i0ikpputa9189i63l0dnd28tg.apps.googleusercontent.com';
  const redirect_uris = 'http://localhost:5000/auth/google/callback';

  var oAuth2Client;

const GetGoogleUserInfo = async (res) =>  {
  const service = google.people({version: 'v1', auth: oAuth2Client});
  /*const temp = await service.people.get(
    {resourceName: 'people/me', 
    key: 'AIzaSyDyjTayR6QFthi_DNywOqVIUcpE4AZOavc',
    personFields: "emailAddresses"
  });
  console.log(temp);*/
  
  service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const connections = res.data.connections;
    if (connections) {
      console.log('Connections:');
      connections.forEach((person) => {
        if (person.names && person.names.length > 0) {
          console.log(person.names[0].displayName);
        } else {
          console.log('No display name found for connection.');
        }
      });
    } else {
      console.log('No connections found.');
    }
  });
};

const GetGoogleURL = () => {
  oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris);
    

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return authUrl;

  /*fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });*/
};

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

module.exports = {
  GetGoogleURL,
  GetGoogleUserInfo
};