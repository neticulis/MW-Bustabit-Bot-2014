// Bustabit BIT BET BOT BASIC VERSION 1.61 BY MathWins
// DISCLAIMER: I AM NOT RESPONSIBLE FOR ANY LOSSES YOU INCUR
// THIS SCRYPT IS OFFERED FREE, I CANNOT HELP WITH SUPPORT ISSUES

//        INSTRUCTIONS:
// 1. IN Bustabit, OPEN "AUTO" TAB
// 2  CHANGE THE DROPDOWN BOX AT THE BOTTOM FROM "AUTOBET" TO "CUSTOM"
// 3. REPLACE THE TEXT IN THE STRATEGY BOX WITH THIS SCRYPT (COPY/PASTE it all)
// 4. PRESS THE RUN BUTTON AND WATCH YOUR BOT BET!

//          OPTIONAL:
// TO SEE WHAT THE BOT IS DOING:
// 1. PRESS CTRL+SHIFT+J (in firefox or chrome) to open the javascript console log
// 2. WATCH AND ENJOY THE BETTING MAGIC

//      EVEN MORE OPTIONAL:
// The few variables below can be edited to experiment.
// maximumPercentOfBankrollToBet is the maximum percent of your bankroll the bot will bet at a time
// multiplierIncreaseWhenLosing the amount your crash multiplier will increase every time you lose
// multiplierIncreaseWhenWinning the amount your crash multiplier will increase every time you win
var maximumPercentOfBankrollToBet=0.1; // 0.1 Recommended (if you have 50,000 bits, bot bets up to 50 at a time)
var baseMultiplier=138; // DO NOT SET BELOW 101
var multiplierIncreaseWhenLosing=77; // 50-90 
var multiplierIncreaseWhenWinning=7; // 0-50 

// DO NOT CHANGE ANYTHING BELOW THIS LINE 
// UNLESS YOU KNOW WHAT YOU ARE DOING

var ourBet=0;
var ourMultiplier=0;
var currentBet=0; 
var currentMultiplier=0;
var gameNumber=0;
var gamesPlayed=0;
var gamesWon=0;  
var gamesLost=0;  
var bitsWon=0;
var currentGamesProfits=0;
var areWePlaying=0;
var losingStreak=0;
var winningStreak=0;
var balanceInSatoshis=engine.getBalance();
var currentPlayer=engine.getUsername();
var wasLastGameWon="Not Played";
var ourStatus="";

console.clear();
console.log("MONEYPOT BIT BET BOT BASIC VERSION 1.61 BY MathWins ~ Good luck, "+currentPlayer);
console.log("            ~~~ Maximum percentage of bankroll to bet: "+maximumPercentOfBankrollToBet+"% ~~~");
console.log("                      ~~~ Base multiplier: "+baseMultiplier/100+"x ~~~");
console.log("           ~~~ For every loss, increasing multiplier by: "+multiplierIncreaseWhenLosing/100+"x ~~~");
console.log("           ~~~ For every win, increasing multiplier by: "+multiplierIncreaseWhenWinning/100+"x ~~~");
console.log("~~~~~~~~~~~~~~ BOT STARTED, WAITING FOR NEXT GAME TO START ~~~~~~~~~~~~~~");



// GAME IS STARTING:
engine.on('game_starting', function(info) {
  init(); // Every time a game starts we need to clear the variables
  if (gameNumber>0){
    strategy(); // Execute the strategy to obtain our multiplier and bet amounts
    createBet(); // Place the bet
  }
});

function strategy(){
  ourMultiplier=baseMultiplier+((multiplierIncreaseWhenWinning*winningStreak)+((multiplierIncreaseWhenLosing*losingStreak)));
  ourBet=balanceInSatoshis*(maximumPercentOfBankrollToBet/(200-(losingStreak+winningStreak))); 
}

function createBet(){
  if (ourBet > 0){

    areWePlaying=1;
    balanceInSatoshis=engine.getBalance();

    // Keep our bet at or below the maximum we specified in maximumPercentOfBankrollToBet
    if (ourBet > (balanceInSatoshis*(maximumPercentOfBankrollToBet/100))){ourBet=balanceInSatoshis*(maximumPercentOfBankrollToBet/100);};

    // Convert bet from satoshis to bits, round the number, and convert back to satoshis to get a bet divisible by 100
    currentBet=Math.floor(ourBet/100)*100; 

    // Remove any decimals from our multiplier
    currentMultiplier=Math.floor(ourMultiplier); 

    // If our bet is higher than the moneypot maximum allowed, change it to the maximum
    if (currentBet > engine.getMaxBet()){currentBet=engine.getMaxBet();};

    // If our bet is below the minimum, bet 1 bit.
    if (currentBet < 100){currentBet=100;};

    // If our multiplier is lower then 1x, make it 1.01x
    if (currentMultiplier < 101){currentMultiplier=101;}

    // Place our bet
    engine.placeBet(currentBet, currentMultiplier, false);  

    // Update our status      
    ourStatus=currentPlayer+" bet "+addCommas(currentBet/100)+" bits @ "+currentMultiplier/100+"x ~ Won/Played: "+gamesWon+"/"+gamesPlayed+" ~ Total Profit: "+addCommas(Math.floor(bitsWon*100)/100)+" bits";

  } else {
    areWePlaying=0;    
    ourStatus="GAME STARTING! "+currentPlayer+" is sitting out, either due to not betting, or a bug.";
  }
  if (gameNumber>0){
    console.log(ourStatus);
  }
}





engine.on('game_crash', function(data) {

  if (areWePlaying==1){
    gamesPlayed++;
    if (data.game_crash>=currentMultiplier){
      wasLastGameWon="yes";
      winningStreak++; 
      losingStreak=0;
      gamesWon++;   
      currentGamesProfits=((currentBet*(currentMultiplier/100))-currentBet)/100;
      bitsWon+=currentGamesProfits;
      bitsWon=Math.floor(bitsWon*100)/100
      ourStatus=currentPlayer+" WON "+addCommas(Math.floor(currentGamesProfits*100)/100)+" BITS! :)";
    } else {
      wasLastGameWon="no";
      losingStreak++;
      winningStreak=0;
      bitsWon-=currentBet/100;
      bitsWon=Math.floor(bitsWon);   
      ourStatus=currentPlayer+" LOST "+addCommas(currentBet/100)+" BITS! :(";
    }
  } 
  console.log(ourStatus);
  gameNumber++;
});

 
function addCommas(mathwins) {
    return mathwins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function init (){
  areWePlaying=0;
  ourStatus="";
  balanceInSatoshis=engine.getBalance();
  ourBet=0;
  ourMultiplier=0;    
  currentBet=0;
  currentMultiplier=0;  
  currentGamesProfits=0;
}
