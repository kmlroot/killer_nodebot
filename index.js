/*
 * Module dependencies
*/

var keypress = require("keypress");
var Imp      = require("imp-io");
var five     = require("johnny-five");
var Sumobot  = require("sumobot")(five);

keypress(process.stdin);

var board = new five.Board({
  io: new Imp({
    agent: 'Grggb5HJjYOg'
  })
});

board.on("ready", function() {

  console.log("Welcome to Sumobot Jr!");

  // Initialize a new Sumobot.
  // - Left Servo is attached to pin 1
  // - Right Servo is attached to pin 2
  // - Speed set to 0.50 (half of max speed)

  var bot = new Sumobot({
     left: 1,
    right: 2,
    speed: 0.50
  });

  /*
   * Leds
  */

  var red   = new five.Led(5);
  var green = new five.Led(9);
  var leds  = new five.Leds([red, green]);

  // Maps key names to bot methods
  var actions = {
       up:  "fwd",
     down:  "rev",
     left:  "left",
    right:  "right",
    space:  "stop"
  };

  // Ensure the bot is stopped

  bot.stop();
  leds.off();

  // A bit of keypress ceremony ;)
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {
    var action;

    if (!key) {
      return ;
    }

    leds.off();

    action = actions[key.name] || key.name;

    if (action === "q") {
      console.log("Quitting");
      bot.stop();
      setTimeout(process.exit, 500);
    }

    if (bot[action]) {
      bot[action]();

      console.log(actions[key.name]);

      if (action === "stop") {
        console.log("Stop");
        red.on();
      } else {
        green.on();
      }
    }
  });
});
