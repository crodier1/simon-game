//variables//
userSeq = [];
simonSeq = [];
const NUM_OF_LEVELS = 20;
var id,
  color,
  level = 0,
  gameOn = false,
  strict = false;
var boardSound = [
  "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3", //green//
  "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3", //red//
  "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3", //yellow//
  "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3" //blue//
];

//1. start board sequence//
$(document).ready(function() {
  $(".start").click(function() {
    level = 0;
    userSeq = [];
    simonSeq = [];
    strict = false;
    level++;
    simonSequence();
  });

  //strict mode//
  $(".strict").click(function() {
    strict = true;
    simonSeq = [];
    userSeq = [];
    level = 0;
    level++;
    simonSequence();
  });

  //switch toggle//
  $(".switch").click(function() {
    gameOn = !gameOn ? true : false;
    if (gameOn) {
      $(".outer-switch").addClass("outer-active");
      $(".inner-switch").addClass("inner-active");
      $(".display").text("00");
    } else {
      $(".outer-switch").removeClass("outer-active");
      $(".inner-switch").removeClass("inner-active");
      $(".display").text("");
      level = 0;
      userSeq = [];
      simonSeq = [];
    }
  });

  //user pad listener//
  $(".pad").click(function() {
    id = $(this).attr("id");
    color = $(this)
      .attr("class")
      .split(" ")[1];
    userSeq.push(id);
    console.log(id + " " + color);
    addClassSound(id, color);

    //check user sequence//
    if (!checkUserSeq()) {
      if (strict) {
        level = 0;
        simonSeq = [];
        userSeq = [];
      }
      displayError();
      userSeq = [];
    }
    //check end of sequence//

    if (userSeq.length == simonSeq.length && userSeq.length < NUM_OF_LEVELS) {
      level++;
      userSeq = [];
      simonSequence();
    }
    //checking for winners//
    if (userSeq.length == NUM_OF_LEVELS) {
      $(".display").text("WIN");
    }
  });
});

//check user sequence against simon's//
function checkUserSeq() {
  for (var i = 0; i < userSeq.length; i++) {
    if (userSeq[i] != simonSeq[i]) {
      return false;
    }
  }
  return true;
}

//display error//
function displayError() {
  counter = 0;
  var myError = setInterval(function() {
    $(".display").text("!!");
    counter++;
    if (counter == 3) {
      $(".display").text(level);
      clearInterval(myError);
      userSeq = [];
      counter = 0;
    }
  }, 1000);
}

//simon sequence//
function simonSequence() {
  $(".display").text(level);
  getRandomNum();
  var i = 0;
  var myInterval = setInterval(function() {
    id = simonSeq[i];
    color = $("#" + id)
      .attr("class")
      .split(" ")[1];
    addClassSound(id, color);
    i++;
    if (i == simonSeq.length) {
      clearInterval(myInterval);
    }
  }, 1000);
}

//generate random number//
function getRandomNum() {
  var random = Math.floor(Math.random() * 4);
  simonSeq.push(random);
}

//add temporary class and play sound//
function addClassSound(id, color) {
  $("#" + id).addClass(color + "-active");
  playSound(id);
  setTimeout(function() {
    $("#" + id).removeClass(color + "-active");
  }, 1000);
}

//play board sound//
function playSound(id) {
  var sound = new Audio(boardSound[id]);
  sound.play();
}

//2. user replicates sequence//