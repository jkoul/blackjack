//combine cards into deck array
var balance = 1000;
$("#balamt").html("$" + balance);
var playerCards = []
var playerValues = [];
var dealerValues = [];
var gamenum = 0;
$("#betbox").on("click", function() {
  $(this).css("background","white");
});
//instantiate global variables


$(document).ready(function () {
  renewDeck();
  setCardValues();
  $("#deal").on("click", entryCheck);
});

function entryCheck() {
  if ($("#betbox").val() == "") {
    $("#betbox").css("background", "red");
  } else if (balance == 0 || $("#betbox").val() > balance ) {
    $("#balamt").css("background", "red");
    addBalance();
  } else {
    startGame();
  };
};

function addBalance() {
  var newBalance = parseInt(prompt("Enter a Deposit Amount\n(minimum 10, suggested 1000)"));
  if(newBalance > 10) {
    balance += newBalance;
  } else {
    alert("Deposit not valid\nAdding Default Deposit of 1000");
    balance += 1000;
  };
  $("#balamt").html("$" + balance).css("background","#ccc");
  if (gamenum > 0) {
    if (bet <= balance) {
      $("#deal").on("click",entryCheck);
    } else {
      getBet();
    };
  };
}

function getBet() {
  bet = prompt("Enter Your Bet Amount\n (default 10)");
  if (bet > 10 && bet <= balance) {
    alert("Bet saved! You can change your bet amount anytime by clicking on the bet window.")
  } else {
    alert("Bet amount not valid\nEntering Default Bet of 10\nYou can change your bet amount anytime by clicking on the bet window.");
    bet = 10;
  };
  $("#betbox").val(bet).off("click");
}

function renewDeck() {
  //new deck
  if(gamenum == 0) {
    stackMakeDeck(6);
  //reset deck
  } else if (cards.length < 40) {
    stackMakeDeck(6);
  };
  //add values to cards
  setCardValues();

  //shuffle cards
  stackShuffle(2);
}

function setCardValues() {
  for(var i=0; i<cards.length;i++) {
    value = getValue(cards[i].rank);
    cards[i].value = value;
  }
}

//transform card "rank" into blackjack value. "cardrank" is a dummy var.
function getValue(cardrank) {
  if( cardrank == '2' || cardrank == '3' || cardrank == '4' || cardrank == '5' ||
  cardrank == '6' || cardrank == '7' || cardrank == '8' || cardrank == '9' || cardrank == '10') {
    return parseInt(cardrank);
  } else if (cardrank == 'J' || cardrank == 'Q' || cardrank == 'K') {
    return 10;
  } else if (cardrank == 'A') {
    return 11;
  } else {
    return 0;
  };
}

function addPlayerCard() {
  var nextCard = stackDeal();
  var node = nextCard.createNode();
  $("#pcards").append(node);
  playerValues.push(nextCard.value);
  playerCards.push(nextCard);
  updatePlayerScore();
}

function updatePlayerScore() {
  playerScore = 0;
  for (var i=0; i < playerValues.length; i++) {
    playerScore += playerValues[i];
  };
  if(playerScore > 21 && Math.max.apply(Math,playerValues) == 11) {
    aceFlexPlayer();
  };
  $("#playerscore").html(playerScore);
}

function aceFlexPlayer() {
  for (var i=0; i < playerValues.length; i++) {
    if (playerValues[i] == 11) {
      playerValues[i] = 1;
      break;
    };
  };
  updatePlayerScore();
}

function addDealerCard() {
  var nextCard = stackDeal();
  var node = nextCard.createNode();
  $("#dcards").append(node);
  dealerValues.push(nextCard.value);
  updateDealerScore();
}

function updateDealerScore() {
  dealerScore = 0;
  if (dealerValues.length < 2){
    dealerScore = 0;
  } else {
    for (var i=0; i < dealerValues.length; i++) {
      dealerScore += dealerValues[i];
    };
    if(dealerScore > 21 && Math.max.apply(Math,dealerValues) == 11) {
      aceFlexDealer();
    };
  };
  $("#dealerscore").html(dealerScore);
}

function aceFlexDealer() {
  for(var i=0; i<dealerValues.length; i++) {
    if(dealerValues[i] == 11) {
      dealerValues[i] = 1;
      break;
    };
  };
  updateDealerScore();
}

function startGame(){
  bet = $("#betbox").val();
  balance -= bet;
  $("#balamt").html("$" + balance);
  $("#deal").off("click");
  gamenum ++;

  //deal cards
  addDealerCard();
  $("#dcards div:first-child.front").hide();
  addPlayerCard();
  addDealerCard();
  dealerScore = dealerValues[1];
  $("#dealerscore").html(dealerScore);
  addPlayerCard();
  if (dealerScore == 11) {
    aceInsurance();
  };
  if (playerScore == 21) {
    blackjack();
  } else if (dealerValues[1] == 11 && dealerValues[0] == 10) {
      dealerPlay();
  } else {
    //hit functionality
    $("#hit").on("click", hitPlayer);
    //double down
    $("#double").on("click", doubleDown);
    //stand functionality
    $("#stand").on("click", dealerPlay);
    if (playerCards[0].rank == playerCards[1].rank) {
      //split
      $("#split").on("click", splitHand);
    };
  };
}

var aceInsurance = function(insurance) {
  var choice = confirm("Dealer has a face-up Ace.\nDo you want to buy insurance?");
  if (choice == true) {
    insurance = bet*0.5;
    balance -= insurance;
  } else {
    insurance = 0;
  };
  $("#balamt").html("$" + balance);
  if (dealerValues[0] == 10) {
    balance += insurance*3;
  };
}


function blackjack() {
  if (dealerValues[1] == 11 && dealerValues[0] == 10) {
    dealerPlay();
  } else {
    alert("Blackjack!!! Player Wins!")
    balance += bet*2.5;
    $("#balamt").html("$" + balance);
    resetGame();
  };
}


function hitPlayer(){
  $("#double").off("click");
  if(playerScore < 21) {
    addPlayerCard();
  };
  if (playerScore > 21) {
    getWinner();
  } else if (playerScore == 21) {
    dealerPlay();
  };
}

function doubleDown() {
  balance -= bet;
  bet *= 2
  $("#balamt").html("$" + balance);
  addPlayerCard();
  if (playerScore > 21) {
    getWinner();
  } else {
    dealerPlay();
  };
}

function dealerPlay() {
  $("#hit").off("click");
  $("#stand").off("click");
  $("#double").off("click");
  $("#dcards div:first-child.front").show();
  updateDealerScore();
  $("#dealerscore").html(dealerScore);
  while(dealerScore<=16){
    addDealerCard();
  };
  getWinner();
};


function getWinner() {
  $("#hit").off("click");
  $("#stand").off("click");
  $("#double").off("click");
  if (playerScore > 21) {
    alert("Player Bust! Dealer Wins!");
    balance += 0;
  } else if (dealerScore == playerScore) {
    alert("Push!");
    balance += bet*1;
  } else if (playerScore > dealerScore) {
    alert("Player Wins!");
    balance += bet*2;
    $("#balamt").html("$" + balance);
  } else if (dealerScore <= 21) {
    alert("Dealer Wins!");
    balance += 0;
  } else {
    alert("Dealer Bust! Player Wins!");
    balance += bet*2;
  };
  $("#balamt").html("$" + balance);
    resetGame();
};

function resetGame(){
  console.log(gamenum)
  $("#dcards").empty();
  $("#pcards").empty();
  playerScore = "";
  dealerScore = "";
  $("#dealerscore").empty();
  $("#playerscore").empty();
  playerValues = [];
  dealerValues = [];
  playerCards = [];
  renewDeck();
  bet = $("#betbox").val();
  if(balance < bet){
    addBalance();
  } else {
    $("#deal").on("click", entryCheck);
  };
}
