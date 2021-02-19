var s = new WebSocket("ws://127.0.0.1:3031/");
var dataModel = {
  friends: [],
};

function render() {
  let dropdown = document.getElementById("friends");
  if (dropdown.options.length == 0) {
    dataModel.friends.forEach((friend) => {
      let opt = document.createElement("option");
      opt.text = friend.displayName;
      opt.value = friend.publicKeyBase64;
      dropdown.add(opt, null);
    });
  }

  let messages = "";
  dataModel.friends[dropdown.selectedIndex].messages.forEach((m) => {
    messages += m + "<br />";
  });
  let divMessages = document.getElementById("messages");
  divMessages.innerHTML = messages;
}

function sendMessage() {
  var message = {
    type: "message",
    to: document.getElementById("friends").value,
    text: document.getElementById("message").value,
    date: Date.now(),
  };
  s.send(JSON.stringify(message));
  document.getElementById("message").value = "";
}

s.onmessage = function (event) {
  let response = JSON.parse(event.data);
  if (response.message == "friendsResponse") {
    console.log("friends response", response.friends);
    dataModel.friends = response.friends;
    render();
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
