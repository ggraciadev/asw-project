module.exports = class Post {
    constructor (_id, _title, _url, _msg, _likes, _username, _creationTime, _commentsNum, _userLiked) {
      this.id = _id;
      this.title = _title;
      this.url = _url;
      this.msg = _msg;
      this.likes = _likes;
      this.username = _username;
      this.creationTime = _creationTime;
      this.commentsNum = _commentsNum;
      this.userLiked = _userLiked;
      this.comments = [];
    }
}