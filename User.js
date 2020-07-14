import apiRequest from "./api.js";

/* A small class to represent a Post */
export class Post {
  constructor(data) {
    this.user = data.user;
    this.time = new Date(data.time);
    this.text = data.text;
  }
}

export default class User {
  /* Returns an array of user IDs */
  static async listUsers() {
    let [status, data] = await apiRequest("GET", "/users");
    if (status !== 200) throw new Error("Couldn't get list of users");
    return data.users;
  }

  /* Returns a User object, creating the user if necessary */
  static async loadOrCreate(id) {
    let [status, data] = await apiRequest("GET", "/users/" + id);
    if(status === 404){
      [status, data] = await apiRequest("POST", "/users", {id});
    }
    return new User(data);
  }

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = data.avatarURL;
    this.following = data.following;
  }

  async save() {
    let name = this.name;
    let avatarURL = this.avatarURL;
    let id = this.id;
    let [status, data] = await apiRequest("PATCH", "/users/" + id, {id, name, avatarURL});
    return new User(data);
  }

  /* Returns an array of Post objects */
  async getFeed() {
    let id = this.id;
    let posts = await apiRequest("GET", "/users/" + id + "/feed");
    let arrayofVal = Object.values(posts);
    let objPosts = arrayofVal[1];
    let arrPosts = objPosts.posts;
    let arrayofObjPost = [];
    for(let i = 0; i < arrPosts.length; i++){
      let post = new Post({"text": arrPosts[i].text, "time": arrPosts[i].time, "user": arrPosts[i].user});
      arrayofObjPost.push(post);
    }
    return arrayofObjPost;
  }

  async makePost(text) {
    let id = this.id;
    let effective = await apiRequest("POST", "/users/" + id + "/posts", {"text":text});
  }

  async addFollow(id) {
    let myId = this.id;
    let effective = await apiRequest("POST", "/users/" + myId + "/follow?target=" + id);
    console.log(effective);
    let [status, data] = await apiRequest("GET", "/users/" + myId);
    console.log("post add follow" + data);
    this.following = data.following;
    console.log("this post follow" + this);
  }

  async deleteFollow(id) {
    let myId = this.id;
    let effective = await apiRequest("DELETE", "/users/" + myId + "/follow?target=" + id);
    let [status, data] = await apiRequest("GET", "/users/" + myId);
    this.following = data.following;
  }
}
