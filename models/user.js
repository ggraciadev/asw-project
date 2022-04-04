module.exports = class User {
    constructor (_username, _password) {
      this.username = _username;
      this.password = _password;
      this.likedComments = [];
      this.likedPosts = [];
    }
}