import User from "./User.js";
import EditableText from "./EditableText.js";
import DynamicList from "./DynamicList.js";

let FOLLOWERS = [];
let INDEX_FOLLOW = 0;

class App {
  constructor() {
    this._user = null;

    this._loginForm = null;
    this._postForm = null;

    this._onListUsers = this._onListUsers.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._onPost = this._onPost.bind(this);

    //instance variables for editableList and Dynamic
    this._text1 = new EditableText("text1");
    this._text2 = new EditableText("text2");
    this._follower = new DynamicList("Follow user");

    //additional binding
    this._onNameChange = this._onNameChange.bind(this);
    this._onAvatarChange = this._onAvatarChange.bind(this);
    this._onFollow = this._onFollow.bind(this);
    this._onDelete = this._onDelete.bind(this);
  }

  setup() {
    this._loginForm = document.querySelector("#loginForm");
    this._loginForm.login.addEventListener("click", this._onLogin);
    this._loginForm.listUsers.addEventListener("click", this._onListUsers);

    //IMplementation of post
    this._postForm = document.querySelector("#postForm");
    this._postButton = document.querySelector("#postButton");
    this._postButton.addEventListener("click", this._onPost);

    //Setting user to null
    this._user = {};

    //Editable text for Name, Avatar Change, and Follow
    this._text1.addToDOM(document.querySelector("#nameContainer"), this._onNameChange);
    this._text2.addToDOM(document.querySelector("#avatarContainer"), this._onAvatarChange);
    this._follower.addToDOM(document.querySelector("#followContainer"), this._onFollow, this._onDelete);

  }

  _getAvatar(user) {
    let url = user.avatarURL;
    if (!url) url = "images/default.png";
    return url;
  }

  _displayPost(post) {
    let node = document.querySelector("#templatePost").cloneNode(true);
    node.id = "";

    let avatar = node.querySelector(".avatar");
    avatar.src = this._getAvatar(post.user);
    avatar.alt = `${post.user.name}'s avatar`;

    node.querySelector(".name").textContent = post.user.name;
    node.querySelector(".userid").textContent = post.user.id;
    node.querySelector(".time").textContent = post.time.toLocaleString();
    node.querySelector(".text").textContent = post.text;

    document.querySelector("#feed").appendChild(node);
  }

  async _loadProfile() {
    document.querySelector("#welcome").classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
    document.querySelector("#idContainer").textContent = this._user.id;

    /* Reset the feed */
    document.querySelector("#feed").textContent = "";

    /* Update the avatar, name, and user ID in the new post form */
    this._postForm.querySelector(".avatar").src = this._getAvatar(this._user);
    this._postForm.querySelector(".name").textContent = this._user.name;
    this._postForm.querySelector(".userid").textContent = this._user.id;

    //Updates name and avatarURL editor
    this._text1.setValue(this._user.name);
    this._text2.setValue(this._user.avatarURL);

    //Updates follower list
    this._follower.setList(this._user.following);

    //Loads feed
    let arrayofPosts = await this._user.getFeed();
    console.log(arrayofPosts);
    for(let i = 0; i < arrayofPosts.length; i++){
      this._displayPost(arrayofPosts[i]);
    }
  }

  /*** Event Handlers ***/

  async _onListUsers() {
    let users = await User.listUsers();
    let usersStr = users.join("\n");
    alert(`List of users:\n\n${usersStr}`);
  }

  async _onNameChange(editableText) {
      let name = editableText.value;
      this._user.name = name;
      this._user = await this._user.save();
      this._loadProfile();
  }

  async _onAvatarChange(editableText){
    let avatarURL = editableText.value;
    this._user.avatarURL = avatarURL;
    this._user = await this._user.save();
    this._loadProfile();
  }

  async _onLogin(event) {
    event.preventDefault();
    //TODO: Complete this function. You should set this._user and call loadProfile
    this._user.id = this._loginForm.userid.value;
    this._user = await User.loadOrCreate(this._user.id);
    this._loadProfile();
  }

  async _onPost(event){
    event.preventDefault();
    let postContent = document.querySelector("#newPost").value;
    await this._user.makePost(postContent);
    this._loadProfile();
  }

  async _onFollow(followId){
    await this._user.addFollow(followId);
    this._loadProfile();
  }

  async _onDelete(followId){
    let removalIndex = this._user.following.indexOf(followId);
    await this._user.deleteFollow(followId);
    this._loadProfile();
  }

}

let app = new App();
app.setup();
