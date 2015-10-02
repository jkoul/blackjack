function splitHand() {
  $("#split").off("click");
  betA = bet;
  betB = bet;
  outcomeA = "";
  outcomeB = "";
  playerScoreA = 0;
  playerScoreB = 0;
  balance -= bet;
  $("#balamt").html("$" + balance);
  $("#pcards").attr("id", "pcardsA").remove("id", "pcards");
  $("#pcardsA").after("<div id='pcardsB'></div>");
  if(playerValues.length == 2) {
    var playerCardsB = $("#pcardsA .card:last-child");
    $("#pcardsA .card:last-child").remove();
    $("#pcardsB").append(playerCardsB);
    if (playerValues[0] == 1) {
      playerValues = [[11],[11]];
    } else {
      playerValues = [[playerValues[0]],[playerValues[1]]];
    };
    $("#player .score").addClass("split-a").after("<div class='score split-b'></div>");
    $(".split-b").append("<p>Player Score:</p>");
    $(".split-b").append("<p id='playerscoreB'></p>");
    $("#playerscore").html(playerValues[0]);
    $("#playerscoreB").html(playerValues[1]);
    addSplitCardA();
    addSplitCardB();
    if (playerScoreA == 21) {
      alert("Blackjack!!! First Hand Wins!");
      outcomeA = "Blackjack";
      balance += betA*2.5;
      $("#balamt").html("$" + balance);
      handB();
    } else {
      alert("Play Your First Hand");
      //hit functionality
      $("#hit").off("click");
      $("#hit").on("click", hitPlayerA);
      //double down
      $("#double").off("click");
      $("#double").on("click", doubleDownA);
      //stand functionality
      $("#stand").off("click");
      $("#stand").on("click", handB);
    };
  }
}

function addSplitCardA() {
  var nextCard = stackDeal();
  var node = nextCard.createNode();
  $("#pcardsA").append(node);
  playerValues[0].push(nextCard.value);
  updateSplitScoreA();
}



function updateSplitScoreA() {
  playerScoreA = 0;
  for (var i=0; i < playerValues[0].length; i++) {
    playerScoreA += playerValues[0][i];
  };
  if(playerScoreA > 21 && Math.max.apply(Math,playerValues[0]) == 11) {
    aceFlexSplitA();
  };
  $("#playerscore").html(playerScoreA);
}

function aceFlexSplitA() {
  for (var i=0; i < playerValues[0].length; i++) {
    if (playerValues[0][i] == 11) {
      playerValues[0][i] = 1;
      break;
    };
  };
  updateSplitScoreA();
}

function addSplitCardB() {
  var nextCard = stackDeal();
  var node = nextCard.createNode();
  $("#pcardsB").append(node);
  playerValues[1].push(nextCard.value);
  updateSplitScoreB();
}

function updateSplitScoreB() {
  playerScoreB = 0;
  for (var i=0; i < playerValues[1].length; i++) {
    playerScoreB += playerValues[1][i];
  };
  if(playerScoreB > 21 && Math.max.apply(Math,playerValues[1]) == 11) {
    aceFlexSplitB();
  };
  $("#playerscoreB").html(playerScoreB);
}

function aceFlexSplitB() {
  for (var i=0; i < playerValues[1].length; i++) {
    if (playerValues[1][i] == 11) {
      playerValues[1][i] = 1;
      break;
    };
  };
  updateSplitScoreB();
}


function hitPlayerA(){
  $("#double").off("click");
  if(playerScoreA < 21) {
    addSplitCardA();
  };
  if (playerScoreA >= 21) {
    handB();
  };
};

function doubleDownA() {
  balance -= bet;
  betA *= 2
  $("#balamt").html("$" + balance);
  addSplitCardA();
  handB();
}

function handB() {
  if (playerScoreB == 21) {
    alert("Blackjack!!! Second Hand Wins!");
    outcomeB = "Blackjack";
    balance += betB*2.5;
    if(outcomeA == outcomeB == "Blackjack") {
      alert("First Hand Result: " + outcomeA +"\nSecond Hand Result: " + outcomeB);
      restoreGame();
    } else {
      dealerPlaySplit();
    };
  } else {
    alert("Play Your Second Hand");
    $("#hit").off("click");
    $("#hit").on("click", hitPlayerB);
    $("#double").off("click");
    $("#double").on("click", doubleDownB);
    //stand functionality
    $("#stand").off("click");
    $("#stand").on("click", dealerPlaySplit);
  };
}

function hitPlayerB(){
  $("#double").off("click");
  if(playerScoreB < 21) {
    addSplitCardB();
  };
  if ((playerScoreB > 21) && (playerScoreA > 21)) {
    getSplitWinner();
  } else if (playerScoreB == 21) {
    dealerPlaySplit();
  };
}

function doubleDownB() {
  balance -= bet;
  betB *= 2
  $("#balamt").html("$" + balance);
  addSplitCardB();
  dealerPlaySplit();
}

function dealerPlaySplit() {
  $("#hit").off("click");
  $("#stand").off("click");
  $("#double").off("click");
  $("#dcards div:first-child.front").show();
  updateDealerScore();
  $("#dealerscore").html(dealerScore);
  while(dealerScore<=16){
    addDealerCard();
  };
  getSplitWinner();
};

function getSplitWinner() {
  $("#hit").off("click");
  $("#stand").off("click");
  $("#double").off("click");
  if(outcomeA != "Blackjack") {
    if (playerScoreA > 21) {
      outcomeA = "Lose"
      balance += 0;
    } else if (dealerScore == playerScoreA) {
      outcomeA = "Push";
      balance += betA*1;
    } else if (playerScoreA > dealerScore) {
      outcomeA = "Win";
      balance += betA*2;
      $("#balamt").html("$" + balance);
    } else if (dealerScore <= 21) {
      outcomeA = "Lose";
      balance += 0;
    } else {
      outcomeA = "Win";
      balance += betA*2;
    };
    $("#balamt").html("$" + balance);
  };
  if (outcomeB != "Blackjack") {
    if (playerScoreB > 21) {
      outcomeB = "Lose";
      balance += 0;
    } else if (dealerScore == playerScoreB) {
      outcomeB = "Push";
      balance += betB*1;
    } else if (playerScoreB > dealerScore) {
      outcomeB = "Win";
      balance += betB*2;
      $("#balamt").html("$" + balance);
    } else if (dealerScore <= 21) {
      outcomeB = "Lose";
      balance += 0;
    } else {
      outcomeB = "Win";
      balance += betB*2;
    };
    $("#balamt").html("$" + balance);
  };
  alert("First Hand Result: " + outcomeA +"\nSecond Hand Result: " + outcomeB);
  restoreGame();
}

function restoreGame() {
  outcomeA = "";
  outcomeB = "";
  playerScoreA = 0;
  playerScoreB = 0;
  betA = 0;
  betB = 0;
  $("#pcardsA").attr("id","pcards").remove("id", "pcardsA");
  $("#pcardsB").remove();
  $(".score").removeClass("split-a");
  $(".split-b").remove();
  resetGame();
}
