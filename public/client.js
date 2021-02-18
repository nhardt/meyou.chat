var s = new WebSocket("ws://127.0.0.1:3001/");
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
  console.log(event.data);
};
