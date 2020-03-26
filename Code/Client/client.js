var socket = io();

var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');

var w = canvas.width;
var h = canvas.height;

window.onload = function () {
  console.log("client.js successfully loaded!");
};

const addButtonListeners = () => {
  const button = getElementById(id);
  button.addEventListener('click', () => {
    socket.emit('startGame');
  });
}
