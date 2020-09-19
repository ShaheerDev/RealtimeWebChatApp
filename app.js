//Function for facebook login
function login() {
    var provider = new firebase.auth.FacebookAuthProvider();
    var profilepic = document.getElementById("profilepic")  //User profile picture
    var loginbtn = document.getElementById("loginbtn")  //Facebook login button
    var logintbtn = document.getElementById("logintbtn")  //Anonymous login button
    var nametitle = document.getElementById("nametitle")  //User display name
    var stepsdiv = document.getElementById("stepsdiv")  //Hidden
    firebase.auth().signInWithPopup(provider)
    .then(function (result){    //If it has successfully logged in the user
      document.getElementById("formchat").setAttribute("class", "formchat") 
      var user = result.user
      console.log(user)
      profilepic.src = user.photoURL
      nametitle.innerHTML = user.displayName
      loginbtn.setAttribute("class", "loginhidden")
      logintbtn.setAttribute("class", "loginhidden")
      stepsdiv.setAttribute("class","loginhidden")
    }).catch(function (error){   //If it fails and gives an error
        console.log(error.message)
    })
}

//Anonymous login
function logint(){   
    var loginbtn = document.getElementById("loginbtn") //Facebook login button
    var logintbtn = document.getElementById("logintbtn") //Anonymous login button
    var nametitle = document.getElementById("nametitle") //User display name
    var prompta = prompt("What is your name?") //Ask for user name
    nametitle.innerHTML = prompta + " (Anonymous)"  //User name equals to prompt
    loginbtn.setAttribute("class", "loginhidden")   //Make facebook login button hidden
    logintbtn.setAttribute("class", "loginhidden")  //Make anonymous login button hidden
    document.getElementById("formchat").setAttribute("class", "formchat") //Make chat area visible 
}

//Send message
function sendMessage() {
    var name = document.getElementById("nametitle").innerText //User display name
    var message = document.getElementById("message").value  //User message
    console.log(message)
    firebase.database().ref("messages").push().set({ //Save user name and message in reference "messages" in firebase database
        "sender": name,
        "message": message
    });
    return false;
}

//Identify which message is yours and which message is others
    firebase.database().ref("messages").on("child_added", function(snapshot){
        var name = document.getElementById("nametitle").innerText
        var li = document.createElement("li")
        li.setAttribute("class", "him")
        if(snapshot.val().sender == name){
            li.setAttribute("class", "me")
            li.innerHTML = snapshot.val().sender + ": " + snapshot.val().message;
            document.getElementById("messages").appendChild(li)
        }else{
            li.setAttribute("class", "him")
            li.innerHTML = snapshot.val().sender + ": " + snapshot.val().message;
            document.getElementById("messages").appendChild(li)
        }
     });

//Update/get messages after every second
setInterval(function(){
    firebase.database().ref("messages").limitToLast(1).on('child_added', function(childSnapshot) {  //Get the last reference node
        var snap = childSnapshot.val();
        var finalsnap = snap.sender + ": " + snap.message
        var lastnode = document.getElementById("messages").lastChild.innerHTML; //Get the last message
        //console.log(finalsnap)
        if(finalsnap == lastnode){}else{    //If a new message is added in the database, it will automattically update on the frontend
            var li = document.createElement("li")
            li.setAttribute("class", "him")
            li.innerHTML = finalsnap;
            document.getElementById("messages").appendChild(li)
        }
   })}, 1000);
