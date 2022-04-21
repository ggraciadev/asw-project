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
const redirect_uris = 'https://proyecto-asw.herokuapp.com/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris
);

const GetGoogleURL = () => {
  return oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: SCOPES
  });
}

const GetGoogleUserInfo = async (code) => {
  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);

  const service = google.people({version: 'v1', auth: oauth2Client});
  const temp = await service.people.get(
    {resourceName: 'people/me', 
    key: 'AIzaSyDyjTayR6QFthi_DNywOqVIUcpE4AZOavc',
    personFields: "emailAddresses"
  });
  return temp.data.emailAddresses[0].value;
};

module.exports = {
  GetGoogleURL,
  GetGoogleUserInfo
};