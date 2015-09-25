//combine cards into deck array
var balance = 1000;
var blackjack;
var playerCards = [];
var dealerCards = [];

//instantiate global variables

$(document).ready(function () {
  renewDeck();
  $("#balamt").html("$" + balance);

  //initialize game
  $("#deal").on("click",startGame);

  setCardValues();
});


function renewDeck(cards) {
  //new deck
  if(cards == undefined) {
    stackMakeDeck(6);
  //reset deck
  } else if (cards.length < 40) {
    stackMakeDeck(6);
  }
  //add values to cards
  setCardValues();

  //shuffle cards
  stackShuffle(2);
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

function setCardValues() {
  for(var i=0; i<cards.length;i++) {
    value = getValue(cards[i].rank);
    cards[i].value = value;
  }
}

function addPlayerCard() {
  var nextCard = stackDeal();
  var node = nextCard.createNode();
  $("#pcards").append(node);
  playerCards.push(nextCard);
  updatePlayerScore();
}

function updatePlayerScore() {
  playerScore = 0;
  for (var i=0; i < playerCards.length; i++) {
    playerScore += playerCards[i].value;
  };
  $("#playerscore").html(playerScore);
}

function addDealerCard() {
  var nextCard = stackDeal();
  var node = nextCard.createNode();
  $("#dcards").append(node);
  dealerCards.push(nextCard);
  updateDealerScore();
}

function updateDealerScore() {
  dealerScore = 0;
  if (dealerCards.length < 2){
    dealerScore = 0;
  } else if (dealerCards.length == 2){
    dealerScore = dealerCards[1].value;
  } else {
    for (var i=0; i < dealerCards.length; i++) {
      dealerScore += dealerCards[i].value;
    };
  };
  $("#dealerscore").html(dealerScore);
}



function startGame(){
  bet = $("#betbox").val()
  balance -= bet;
  $("#balamt").html("$" + balance);
  $("#deal").off("click");

  //deal cards
  addDealerCard();
  $("#dcards div:first-child.front").hide();
  addPlayerCard();
  addDealerCard();
  addPlayerCard();
  if(playerScore == 21) {
    blackjack = true;
    getWinner();
  };
  // if(playerScore>21) {aceFlexPlayer();}

  //hit functionality
  $("#hit").on("click", hitPlayer);

  //double down
  $("#double").on("click", doubleDown);

  //stand functionality
  $("#stand").on("click", dealerPlay);

}

// function aceFlexPlayer () {
//   for (var i=7; i < ($(".activepcards").length)+7; i++) {
//     if(cards[i].value == 11) {
//       cards[i].value = 1;
//       break;
//     };
//   }; updatePlayerScore();
// };
//
// function aceFlexDealer () {
//   for (var i=0; i < ($(".activedcards").length); i++) {
//     if(cards[i].value == 11) {
//       cards[i].value = 1;
//       break;
//     };
//   }; updateDealerScore();
// };

function hitPlayer (){
  $("#double").off("click");
  if(playerScore<21) {
    addPlayerCard();
    if (playerScore==21) {
      dealerPlay();
    } else if (playerScore>21) {
        // aceFlexPlayer();
        // if(playerScore>21) {
          getWinner();
      // }
    };
  };
};

function doubleDown () {
  balance -= bet;
  bet *= 2
  $("#balamt").html("$" + balance);
  addPlayerCard();
  // if (playerScore>21) {
  //   aceFlexPlayer();
  //   dealerPlay();
  // } else {
    dealerPlay();
  // };
}

function dealerPlay() {
 $("#hit").off("click");
 $("#stand").off("click");
 $("#double").off("click");
 $("#dcards div:first-child.front").show();
  dealerScore = dealerCards[0].value + dealerCards[1].value;
  $("#dealerscore").html(dealerScore);
  while(dealerScore<=16){
    addDealerCard();
  };
  getWinner();
};
  // if (dealerScore==21) {
    // break;
      // } else if (dealerScore>21) {
      //   // aceFlexDealer();
      //   if(dealerScore>21) {getWinner();}
    //   };
    // } else {getWinner();
    //   break;
    // };


function getWinner () {
  $("#stand").off("click");
  if(playerScore > dealerScore) {
    if(playerScore <= 21) {
      if(blackjack == true) {
        alert("Blackjack!!! Player Wins!")
        balance += bet*2.5;
      } else {
        alert("Player Wins!");
        balance += bet*2;
      } $("#balamt").html("$" + balance);
    } else {
      alert("Player Bust! Dealer Wins!");
    };
  } else if (dealerScore > playerScore) {
    if (dealerScore <= 21) {
      alert("Dealer Wins!");
    } else {
      alert("Dealer Bust! Player Wins!");
      balance += bet*2;
      $("#balamt").html("$" + balance);
    };
  } else if (dealerScore == playerScore) {
    alert("Push!");
    balance += bet*1;
    $("#balamt").html("$" + balance);
  };
  resetGame();
};

function resetGame(){
  $("#dcards").empty();
  $("#pcards").empty();
  playerScore = "";
  dealerScore = "";
  blackjack = "";
  $("#dealerscore").empty();
  $("#playerscore").empty();
  playerCards = [];
  dealerCards = [];
  renewDeck();
  $("#deal").on("click", startGame);
}
