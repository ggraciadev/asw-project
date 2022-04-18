module.exports = class User {
    constructor (_username, _email, _password, _creationTime, _aboutMe, _phone, _linUsername, _ghUsername) {
      this.username = _username;
      this.email = _email
      this.password = _password;
      this.creationTime = _creationTime;
      this.aboutMe = _aboutMe;
      this.phone = _phone;
      this.linUsername = _linUsername;
      this.ghUsername = _ghUsername;
      this.likedComments = [];
      this.likedPosts = [];
    }
}