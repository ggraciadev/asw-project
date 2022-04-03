module.exports = class Comment {
    constructor (_id, _postID, _author, _creationTime, _parentID, _message, _likes) {
      this.id = _id;
      this.postID = _postID;
      this.author = _author;
      this.creationTime = _creationTime;
      this.parentID = _parentID;
      this.message = _message;
      this.likes = _likes;
    }
}