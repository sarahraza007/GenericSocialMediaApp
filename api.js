/* Fill this in with the URL you get from the web page linked in the assignment spec. */
let API_URL = "https://pointer-dev.cs.stanford.edu/cs193x_api/sraza007";

/* Uncomment this line to point requests at your local server. The server only supports a couple of
   hardcoded routes, but it should still allow you to do most of part 3 offline, if necessary. */
//API_URL = "/api";

/* Do not modify or remove this line. It allows us to redirect the API for grading */
if (window.API_URL) API_URL = window.API_URL;

/* Make an API request.
   - method is the HTTP method
   - path is the path to the resource (must start with a /)
   - body is the request body. Assume that it will only supplied if the method isn't GET.
   Returns a pair (array with two elements) [status, data]:
   - status is the HTTP status (number)
   - data is the data from the server (assumed to be JSON)
   If the request fails or is not in JSON format, alert() the Error's message and then rethrow it. No exception should
   be generated for a non-OK HTTP status, as the client may wish to handle this case themselves. */
const apiRequest = async (method, path, body = null) => {
  try{
    let opts = {
      method: method,
    };
    if(body != null){
      //console.log(body);
      opts.headers = {"Content-Type": "application/json"};
      opts.body = JSON.stringify(body);
      //console.log(opts.body);
    }
    let res = await fetch(API_URL + path, opts);
    let data = await res.json();
    let returnArr = [res.status, data];
    return returnArr;
  } catch(error) {
    alert(error.message);
    throw(error);
  }
};

/* This line exposes the apiRequest function in the console, so you can call it for testing */
window.apiRequest = apiRequest;

export default apiRequest;
