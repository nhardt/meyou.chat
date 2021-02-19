var s = new WebSocket("ws://127.0.0.1:3031/");
function sendMessage() {
  var message = {
    type: "message",
    to: document.getElementById("friends").value,
    text: document.getElementById("message").value,
    date: Date.now(),
  };
  s.send(JSON.stringify(message));
  //document.getElementById("message").value = "";
}

s.onmessage = function (event) {
  console.log("got ws message:", event.data);
  let response = JSON.parse(event.data);
  if (response.message == "friendsResponse") {
    console.log(response.friends);
    let dropdown = document.getElementById("friends");
    response.friends.forEach((friend) => {
      console.log(friend);
      let opt = document.createElement("option");
      opt.text = friend.displayName;
      opt.value = friend.publicKeyBase64;
      dropdown.add(opt, null);
    });
  } else {
    console.log("received unknown message:", response);
  }
};

s.onopen = (_ev) => {
  s.send(
    JSON.stringify({
      type: "friends",
      action: "get",
    })
  );
};
