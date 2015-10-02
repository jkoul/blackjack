# blackjack
WDI Project #1
Jeremy Koulish

Live at http://jkoul.github.io/blackjack/

*Steps Taken:*
- Create card objects
- Create blackjack "table" and place elements on initial table
    - game board with Dealer and Player sections
    - action buttons
    - money section
- Develop game features in JavaScript:
  - deal (create elements for card objects, place on "table", show as per initial blackjack  setup)
  - Event listeners for "hit", "stay", and "double down" buttons (didn't get to "split")
  - Once player busts or clicks either "double down" or "stay", run dealer logic
- Determine winner
- Add or subtract $ based on winner, if applicable

*Card Objects*
Creating objects representing the cards is a big challenge, and I found a workaround online. The complex code is represented in the cards.js, cards.css, and the four image files in my project folder. I integrated the cards.css into the main stylesheet, and the other files are linked as stand-alone files.

The key output is a series of functions that builds on an empty array named "cards". The stackMakeDeck function places "n" packs' worth of cards into the array, and the stackShuffle function randomizes the order of the elements in that array. At that point, the rank of any card can be accessed with a cards.rank[i-1] statement for the corresponding i element of the array. The cards can finally be linked to the game by selecting card objects one by one and placing them into a new row of the HTML with IDs "#dcards" or "#pcards", representing the space where the cards should appear on the board.

*Game "Table"*
I found an image of a blackjack table to use as the background for the area where the cards appear and set it as the background of that area within the CSS stylesheet. The money section and gameplay buttons are independent sections from the game board area.

*Game Play*
The "deal" button triggers a "startGame" function, doing the following:
  - deducts the user-specified bet amount from the account "balance"
  - creates objects for seven dealer cards and seven player cards, using the first 14 elements in the cards array.
  - places those objects on the game board using unique element IDs
  - includes the "cardback.gif" image as the background of those objects
  - shows the objects for one dealer card and two player cards, shows the background of one dealer card, and hides all other elements.
  - shows "dealerScore" and "playerScore" values on the board, corresponding to the sum of the values (drawn from the rank attribute) of each visible card.

The "hit" button triggers a function that shows a new card in the player section and adds its value to the playerScore, unless the player's score is greater than 21 (bust).

The "stand" button triggers a function that executes the dealer's AI logic, represented with a for loop that mimics the "hit" function for the dealer's cards as long as dealerScore is 16 or less. Once dealerScore is 17 or more, all buttons are deactivated and a winner becomes evident.

The "double" button shows exactly one card for the player and thereafter mimics the "stand" button. It also doubles the amount of the bet and deducts the original amount from the account balance a second time.

*Remaining Tasks*
- Integrate getWinner function into game so a winner is automatically declared based on final player and dealer scores. 
- Make the value of an Ace flexible depending upon circumstances. This is partially implemented but still is not fully functional.
- Add functionality for a "split" button.
- Allow the player to play multiple games in succession, resetting the game board but keeping the money section intact.
