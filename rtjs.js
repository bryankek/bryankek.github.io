var rangeParam =[];
var payout =[];
var disableChips = false;

payout.length = 37;
for(var c = 0; c<payout.length;c++){
payout[c] = 0;
};

function setRangeParam(){
rangeParam =[];
for(var x = 0; x < 37; x++){
    rangeParam.push(
        {
            from: Math.floor((Math.pow(2,32)*x)/37),
            to: Math.floor((Math.pow(2,32)*(x+1))/37),
            value: payout[x]
        }
    );
}
}


function convertRawToNumber(outcome){
for(var x = 0; x<rangeParam.length; x++){
if(outcome>=rangeParam[x].from && outcome<rangeParam[x].to){
var number = x;
}    
}
return number;    
}


function highlightChips(outcome, totalwagered, bonus){
var totalProfit = 0;
var totalLoss = 0;
var green = "green";
var red = "red";
var SVC = document.getElementsByClassName("SVchip");
var SHC = document.getElementsByClassName("SHchip");
var Chip = document.getElementsByClassName("chip");
var CNC = document.getElementsByClassName("cnChip");
var DZC = document.getElementsByClassName("dozenChip");
var HC = document.getElementsByClassName("halfChip");
    
for(var x = 0;x<SVC.length;x++){
if(SVC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == outcome ||SVC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == (outcome -3)){
SVC[x].style.background = green;
totalProfit += 17 * parseFloat(SVC[x].innerHTML);
}else{
SVC[x].style.background = red;
totalLoss += parseFloat(SVC[x].innerHTML);
}
};
 
for(var x = 0;x<SHC.length;x++){
if(SHC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == outcome ||SHC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == (outcome +1)){
SHC[x].style.background = green;
totalProfit += 17 * parseFloat(SHC[x].innerHTML);
}else{
SHC[x].style.background = red;
totalLoss += parseFloat(SHC[x].innerHTML);
}
};

for(var x = 0;x<Chip.length;x++){
if(Chip[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == outcome){
Chip[x].style.background = green;
totalProfit += 35 * parseFloat(Chip[x].innerHTML);
}else{
Chip[x].style.background = red;
totalLoss += parseFloat(Chip[x].innerHTML);
}
};    

for(var x = 0;x<CNC.length;x++){
if(CNC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == outcome ||CNC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == (outcome +1)||CNC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == (outcome -3)||CNC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == (outcome -2)){
CNC[x].style.background = green;
totalProfit += 8 * parseFloat(CNC[x].innerHTML);
}else{
CNC[x].style.background = red;
totalLoss += parseFloat(CNC[x].innerHTML);
}
};    

for(var x = 0;x<DZC.length;x++){
if(DZC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "1-12"){
if(outcome >= 1 && outcome <=12){    
DZC[x].style.background = green;
totalProfit += 2 * parseFloat(DZC[x].innerHTML);
}else{
DZC[x].style.background = red;
totalLoss += parseFloat(DZC[x].innerHTML);
}
}
    
if(DZC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "13-24"){
if(outcome >= 13 && outcome <=24){    
DZC[x].style.background = green;
totalProfit += 2 * parseFloat(DZC[x].innerHTML);
}else{
DZC[x].style.background = red;
totalLoss += parseFloat(DZC[x].innerHTML);
}
};
if(DZC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "25-36"){
if(outcome >= 25 && outcome <=36){    
DZC[x].style.background = green;
totalProfit += 2 * parseFloat(DZC[x].innerHTML);
}else{
DZC[x].style.background = red;
totalLoss += parseFloat(DZC[x].innerHTML);
}
};

if(DZC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "R1"){
if(outcome%3 == 0){    
DZC[x].style.background = green;
totalProfit += 2 * parseFloat(DZC[x].innerHTML);
}else{
DZC[x].style.background = red;
totalLoss += parseFloat(DZC[x].innerHTML);
}
};

if(DZC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "R2"){
if(outcome%3 == 2 || outcome == 2){    
DZC[x].style.background = green;
totalProfit += 2 * parseFloat(DZC[x].innerHTML);
}else{
DZC[x].style.background = red;
totalLoss += parseFloat(DZC[x].innerHTML);
}
};    

if(DZC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "R3"){
if(outcome%3 == 1 || outcome == 1){    
DZC[x].style.background = green;
totalProfit += 2 * parseFloat(DZC[x].innerHTML);
}else{
DZC[x].style.background = red;
totalLoss += parseFloat(DZC[x].innerHTML);
}
}; 
    
};
    
for(var x = 0;x<HC.length;x++){

if(HC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "1-18"){
if(outcome >=1 && outcome<=18){
HC[x].style.background = green;
totalProfit += parseFloat(HC[x].innerHTML);
}else{
HC[x].style.background = red;
totalLoss += parseFloat(HC[x].innerHTML);
}
};    

if(HC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "19-36"){
if(outcome >=19 && outcome<=36){
HC[x].style.background = green;
totalProfit += parseFloat(HC[x].innerHTML);
}else{
HC[x].style.background = red;
totalLoss += parseFloat(HC[x].innerHTML);
}
}; 

if(HC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "Odd"){
if(outcome%2 == 1){
HC[x].style.background = green;
totalProfit += parseFloat(HC[x].innerHTML);
}else{
HC[x].style.background = red;
totalLoss += parseFloat(HC[x].innerHTML);
}
}; 

if(HC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "Even"){
if(outcome%2 == 0){
HC[x].style.background = green;
totalProfit += parseFloat(HC[x].innerHTML);

}else{
HC[x].style.background = red;
totalLoss += parseFloat(HC[x].innerHTML);
}
};   
    
if(HC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "Red"){
if(outcome == 1||outcome == 3||outcome == 5||outcome == 7||outcome == 9||outcome == 12||outcome == 14||outcome == 16||outcome == 18||outcome == 19||outcome == 21||outcome == 23||outcome == 25||outcome == 27||outcome == 30||outcome == 32||outcome == 34||outcome == 36){
HC[x].style.background = green;
totalProfit += parseFloat(HC[x].innerHTML);
}else{
HC[x].style.background = red;
totalLoss += parseFloat(HC[x].innerHTML);
}
};      

if(HC[x].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML == "Black"){
if(outcome == 2||outcome == 4||outcome == 6||outcome == 8||outcome == 10||outcome == 11||outcome == 13||outcome == 15||outcome == 17||outcome == 20||outcome == 22||outcome == 24||outcome == 26||outcome == 28||outcome == 29||outcome == 31||outcome == 33||outcome == 35){
HC[x].style.background = green;
totalProfit += parseFloat(HC[x].innerHTML);
}else{
HC[x].style.background = red;
totalLoss += parseFloat(HC[x].innerHTML);
}
};       

};
    
if(outcome == 0){
totalProfit += (totalwagered/100) * bonus;
}

console.log("total profit: " + totalProfit);
console.log("total loss: " + totalLoss);
console.log("net profit: " + (totalProfit-totalLoss));

document.getElementById('bet-profit').innerHTML = totalProfit.toFixed(2) + " bits";    
if(totalProfit !=0){
    document.getElementById('bet-profit').style.color = "green";
}else{
 document.getElementById('bet-profit').style.color = "white";
}
document.getElementById('bet-loss').innerHTML = "-"+ totalLoss.toFixed(2) + " bits";    
if(totalLoss !=0){
    document.getElementById('bet-loss').style.color = "red";
}else{
 document.getElementById('bet-loss').style.color = "white";
}
    
};


var disableSingleBet = false;
var SBV = document.getElementsByClassName('split-betV');

for(var b = 0; b<33; b++){

SBV[b].onmouseover = function(){
disableSingleBet = true;
this.parentElement.classList.add("select");
this.parentElement.nextElementSibling.classList.add("select");
};

SBV[b].onmouseout = function(){
    disableSingleBet = false;
this.parentElement.classList.remove("select");
this.parentElement.nextElementSibling.classList.remove("select");
};
    
SBV[b].onclick = function(){
var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
var num2 = num1 +3;
var numbers = [num1, num2];
addChips(this, "SVchip", numbers,18);

};    
SBV[b].oncontextmenu = function(){
var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
var num2 = num1 +3;
var numbers = [num1, num2];
removeChips(this,numbers,18);
};    
    
};

var SBH = document.getElementsByClassName('split-betH');

for(var b = 0; b<24; b++){

SBH[b].onmouseover = function(){
disableSingleBet = true;
this.parentElement.classList.add("select");

for(var u = 0; u < this.parentElement.classList.length; u++){
switch(this.parentElement.classList[u]){
    case "3":
     case "6":
         case "9":
         case "12":
         case "15":
         case "18":
         case "21":
         case "24":
         case "27":
        case "30":
        case "33":
        case "36":
        case "2":
        case "5":
         case "8":
         case "11":
         case "14":
         case "17":
         case "20":
         case "23":
         case "26":
        case "29":
        case "32":
        case "35":
        var tmpIndex = parseInt(this.parentElement.classList[u]) - 1;
        document.getElementsByClassName(tmpIndex)[0].classList.add("select");
        break;
};
 
};
    
};
    
SBH[b].onmouseout = function(){
    disableSingleBet = false;
this.parentElement.classList.remove("select");
for(var u = 0; u < this.parentElement.classList.length; u++){
switch(this.parentElement.classList[u]){
    case "3":
     case "6":
         case "9":
         case "12":
         case "15":
         case "18":
         case "21":
         case "24":
         case "27":
        case "30":
        case "33":
        case "36":
        case "2":
        case "5":
         case "8":
         case "11":
         case "14":
         case "17":
         case "20":
         case "23":
         case "26":
        case "29":
        case "32":
        case "35":
        var tmpIndex = parseInt(this.parentElement.classList[u]) - 1;
        document.getElementsByClassName(tmpIndex)[0].classList.remove("select");
        break;
};
 
};
};
    
SBH[b].onclick = function(){

var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
var num2 = num1 -1;
var numbers = [num1, num2];
addChips(this, "SHchip", numbers,18);
};    
SBH[b].oncontextmenu = function(){
var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
var num2 = num1 -1;
var numbers = [num1, num2];    
removeChips(this, numbers,18);
};      
    
    
};

var CB = document.getElementsByClassName('corner-bet');

for(var t = 0; t<22; t++){
    CB[t].onmouseover = function(){
        disableSingleBet = true;
        this.parentElement.classList.add("select");
        for(var u = 0; u < this.parentElement.classList.length; u++){
switch(this.parentElement.classList[u]){
    case "3":
     case "6":
         case "9":
         case "12":
         case "15":
         case "18":
         case "21":
         case "24":
         case "27":
        case "30":
        case "33":
        case "2":
        case "5":
         case "8":
         case "11":
         case "14":
         case "17":
         case "20":
         case "23":
         case "26":
        case "29":
        case "32":
        var tmpIndex1 = parseInt(this.parentElement.classList[u]) - 1;
        var tmpIndex2 = parseInt(this.parentElement.classList[u]) +2;
        var tmpIndex3 = parseInt(this.parentElement.classList[u]) +3;
        document.getElementsByClassName(tmpIndex1)[0].classList.add("select");
        document.getElementsByClassName(tmpIndex2)[0].classList.add("select");
        document.getElementsByClassName(tmpIndex3)[0].classList.add("select");
        break;
};
 
};
        
        
    };
    CB[t].onmouseout = function(){
        disableSingleBet = false;
        this.parentElement.classList.remove("select");
                for(var u = 0; u < this.parentElement.classList.length; u++){
switch(this.parentElement.classList[u]){
    case "3":
     case "6":
         case "9":
         case "12":
         case "15":
         case "18":
         case "21":
         case "24":
         case "27":
        case "30":
        case "33":
        case "2":
        case "5":
         case "8":
         case "11":
         case "14":
         case "17":
         case "20":
         case "23":
         case "26":
        case "29":
        case "32":
        var tmpIndex1 = parseInt(this.parentElement.classList[u]) - 1;
        var tmpIndex2 = parseInt(this.parentElement.classList[u]) +2;
        var tmpIndex3 = parseInt(this.parentElement.classList[u]) +3;
        document.getElementsByClassName(tmpIndex1)[0].classList.remove("select");
        document.getElementsByClassName(tmpIndex2)[0].classList.remove("select");
        document.getElementsByClassName(tmpIndex3)[0].classList.remove("select");
        break;
};
 
};
       
    };
    
    CB[t].onclick = function(){
var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
var num2 = num1 +3;
var num3 = num1 -1;
var num4 = num1 +2;
var numbers = [num1, num2,num3, num4];
addChips(this, "cnChip", numbers,9);
};    
CB[t].oncontextmenu = function(){
var num1 = parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML);
var num2 = num1 +3;
var num3 = num1 -1;
var num4 = num1 +2;
var numbers = [num1, num2,num3, num4];
removeChips(this, numbers,9);
};  
};


var tgRed = document.getElementsByClassName('tg-red');
var tgRedAlt = document.getElementsByClassName('tg-red-alt')[0];
tgRedAlt.onmouseover = function() {
  for (var i = 0; i < tgRed.length; i++) {
    tgRed[i].classList.add("select");

  }
}

tgRedAlt.onmouseout = function() {
  for (var j = 0; j < tgRed.length; j++) {
    tgRed[j].classList.remove("select");
  }
}

var tgBlack = document.getElementsByClassName('tg-black');
var tgBlackAlt = document.getElementsByClassName('tg-black-alt')[0];
tgBlackAlt.onmouseover = function() {
  for (var k = 0; k < tgBlack.length; k++) {
    tgBlack[k].classList.add("select");
  }
}

tgBlackAlt.onmouseout = function() {
  for (var l = 0; l < tgBlack.length; l++) {
    tgBlack[l].classList.remove("select");
  }
}
var tgOddElms = document.getElementsByClassName("odd");

var tgOddBet = document.getElementsByClassName("tg-blue-alt r3")[0];

tgOddBet.onmouseover = function() {
  for (var y = 0; y < tgOddElms.length; y++) {
    tgOddElms[y].classList.add("select");
  }
}

tgOddBet.onmouseout = function() {
  for (var y = 0; y < tgOddElms.length; y++) {
    tgOddElms[y].classList.remove("select");
  }
}

var tgEvElms = document.getElementsByClassName("even");
var tgEvBet = document.getElementsByClassName("tg-blue-alt r3")[1];

tgEvBet.onmouseover = function() {
  for (var z = 0; z < tgEvElms.length; z++) {
    tgEvElms[z].classList.add("select");
  }
}

tgEvBet.onmouseout = function() {
  for (var z = 0; z < tgEvElms.length; z++) {
    tgEvElms[z].classList.remove("select");
  }
}

var tgFH = document.getElementsByClassName("tg-blue-alt r2")[0];
var tgFHElm = document.getElementsByClassName("fh");

tgFH.onmouseover = function() {
  for (var z = 0; z < tgFHElm.length; z++) {
    tgFHElm[z].classList.add("select");
  }
}

tgFH.onmouseout = function() {
  for (var z = 0; z < tgFHElm.length; z++) {
    tgFHElm[z].classList.remove("select");
  }
}
var tgSH = document.getElementsByClassName("tg-blue-alt r2")[1];
var tgSHElm = document.getElementsByClassName("sh");

tgSH.onmouseover = function() {
  for (var z = 0; z < tgSHElm.length; z++) {
    tgSHElm[z].classList.add("select");
  }
}

tgSH.onmouseout = function() {
  for (var z = 0; z < tgSHElm.length; z++) {
    tgSHElm[z].classList.remove("select");
  }
}

var tgFT = document.getElementsByClassName("tg-blue-alt r1")[0];
var tgFTElm = document.getElementsByClassName("ft");

tgFT.onmouseover = function() {
  for (var z = 0; z < tgFTElm.length; z++) {
    tgFTElm[z].classList.add("select");
  }
}

tgFT.onmouseout = function() {
  for (var z = 0; z < tgFTElm.length; z++) {
    tgFTElm[z].classList.remove("select");
  }
}

var tgST = document.getElementsByClassName("tg-blue-alt r1")[1];
var tgSTElm = document.getElementsByClassName("st");

tgST.onmouseover = function() {
  for (var z = 0; z < tgSTElm.length; z++) {
    tgSTElm[z].classList.add("select");
  }
}

tgST.onmouseout = function() {
  for (var z = 0; z < tgSTElm.length; z++) {
    tgSTElm[z].classList.remove("select");
  }
}

var tgTT = document.getElementsByClassName("tg-blue-alt r1")[2];
var tgTTElm = document.getElementsByClassName("tt");

tgTT.onmouseover = function() {
  for (var z = 0; z < tgTTElm.length; z++) {
    tgTTElm[z].classList.add("select");
  }
}

tgTT.onmouseout = function() {
  for (var z = 0; z < tgTTElm.length; z++) {
    tgTTElm[z].classList.remove("select");
  }
}

var tgFR = document.getElementsByClassName("tg-blue")[0];
var tgFRElm = document.getElementsByClassName("fr");

tgFR.onmouseover = function() {
  for (var z = 0; z < tgFRElm.length; z++) {
    tgFRElm[z].classList.add("select");
  }
}

tgFR.onmouseout = function() {
  for (var z = 0; z < tgFRElm.length; z++) {
    tgFRElm[z].classList.remove("select");
  }
}

var tgSR = document.getElementsByClassName("tg-blue")[1];
var tgSRElm = document.getElementsByClassName("sr");

tgSR.onmouseover = function() {
  for (var z = 0; z < tgSRElm.length; z++) {
    tgSRElm[z].classList.add("select");
  }
}

tgSR.onmouseout = function() {
  for (var z = 0; z < tgSRElm.length; z++) {
    tgSRElm[z].classList.remove("select");
  }
}

var tgTR = document.getElementsByClassName("tg-blue")[2];
var tgTRElm = document.getElementsByClassName("tr");

tgTR.onmouseover = function() {
  for (var z = 0; z < tgTRElm.length; z++) {
    tgTRElm[z].classList.add("select");
  }
}

tgTR.onmouseout = function() {
  for (var z = 0; z < tgTRElm.length; z++) {
    tgTRElm[z].classList.remove("select");
  }
}

var TWWagered = 0;

function checkAverageBet(){

var averageBet = (worldStore.state.user.betted_wager/worldStore.state.user.betted_count)/100;
    
    if(averageBet > 0 && averageBet <101){
        var ratio = 10;
    };
    
    if(averageBet > 100 && averageBet < 151){
        var ratio = 15;
    };
    
    if(averageBet > 150 && averageBet < 201){
        var ratio = 20;
    };
    if(averageBet > 200 && averageBet < 351){
        var ratio = 25;
    };
    if(averageBet > 350 && averageBet < 501){
        var ratio = 30;
    };
    
    if(averageBet > 500 && averageBet < 751){
        var ratio = 40;
    };
    
    
    if(averageBet > 750 && averageBet < 1001){
        var ratio = 50;
    };
    
    if(averageBet > 1000 && averageBet < 1501){
        var ratio = 60;
    };
    
    if(averageBet > 1500 && averageBet < 2001){
        var ratio = 70;
    };
    
    if(averageBet > 2000 && averageBet < 3501){
        var ratio = 80;
    };
    
    if(averageBet > 3500 && averageBet < 5001){
        var ratio = 80;
    };
    
    if(averageBet > 5000){
        var ratio = 90;
    };

    
    
return ratio;    
};



function createChips(chipType, numbers, multiplier) {

var baseBet = parseInt(document.getElementById("cs-Input").value);
    for(s = 0; s < numbers.length; s++){
        payout[numbers[s]] += baseBet*multiplier;
    };

    var div = document.createElement('div');
            TWWagered += baseBet;
            
    document.getElementById("total-wagered").innerHTML = TWWagered + " bits"; 
          div.className = chipType;
    div.style.background = "#FFB84D";
  div.innerHTML = baseBet;
    
  return div;
}

function addChips(parent, chipType, numbers, multiplier) {
    if(disableChips == false){
    multiplier = multiplier *100;
var baseBet = parseInt(document.getElementById("cs-Input").value);
  if (parent.children.length == 0) {
    parent.appendChild(createChips(chipType, numbers, multiplier));
  } else {
    for(s = 0; s < numbers.length; s++){
        payout[numbers[s]] += baseBet*multiplier;
    };  

    var newVal = parseInt(parent.children[0].innerHTML) + baseBet;
     TWWagered += baseBet;
          document.getElementById("total-wagered").innerHTML = TWWagered + " bits"; 
    parent.children[0].innerHTML = newVal.toString();
    parent.children[0].style.background = "#FFB84D";
  }
    }
}

function removeChips(parent, numbers, multiplier) {
    if(disableChips == false){
    multiplier = multiplier *100;
    var baseBet = parseInt(document.getElementById("cs-Input").value);
  if (parent.children.length == 1) {
    var newVal = parseInt(parent.children[0].innerHTML) - baseBet;
      if (newVal<1){
        for(s = 0; s < numbers.length; s++){
        payout[numbers[s]] -= (baseBet+newVal)*multiplier;
        };  

          
       TWWagered -= (baseBet + newVal);
      } else if (newVal > 0){
          for(s = 0; s < numbers.length; s++){
        payout[numbers[s]] -= baseBet*multiplier;
        };  

          TWWagered -= (baseBet);
      
      
      
      }
          document.getElementById("total-wagered").innerHTML = TWWagered + " bits"; 
    parent.children[0].innerHTML = newVal.toString();
    parent.children[0].style.background = "#FFB84D";

    if (newVal < 1) {
        
      parent.removeChild(parent.children[0]);
        
    }

  }
    }
}


var singleBetCV = document.getElementsByClassName("chipCV");

for(var y = 0; y < singleBetCV.length; y++){
singleBetCV[y].onclick = function(){
      if(disableSingleBet != true){      
        if(this.parentElement.className == "tg-blue-alt r2" || this.parentElement.className == "tg-blue-alt r3"||this.parentElement.className == "tg-red-alt r3" || this.parentElement.className == "tg-black-alt r3" ){
                switch(this.parentElement.getElementsByTagName('P')[0].innerHTML){
            case "1-18":
            var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
            addChips(this,"halfChip", numbers, 2);
            break;
            case "19-36":
            var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
            addChips(this,"halfChip", numbers, 2);
            break;
            case "Odd":
            var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
            addChips(this,"halfChip", numbers, 2);
            break;
            case "Even":
            var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
            addChips(this,"halfChip", numbers, 2);
            break;
            case "Red":
            var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
            addChips(this,"halfChip", numbers, 2);
            break;
            case "Black":
            var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
            addChips(this,"halfChip", numbers, 2);
            break;

        }
   
        }else{
        if(this.parentElement.className == "tg-blue-alt r1" || this.parentElement.className == "tg-blue"){
        switch(this.parentElement.getElementsByTagName('P')[0].innerHTML){
            case "R1":
            var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
            addChips(this,"dozenChip", numbers, 3);
            break;
            case "R2":
            var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
            addChips(this, "dozenChip", numbers, 3);
            break;
            case "R3":
            var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
            addChips(this, "dozenChip", numbers, 3);
            break;
            case "1-12":
            var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
            addChips(this, "dozenChip", numbers, 3);
            break;
            case "13-24":
            var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
            addChips(this, "dozenChip", numbers, 3);
            break;
            case "25-36":
            var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
            addChips(this, "dozenChip", numbers, 3);
            break;
        }
        }else{
            var numbers = [parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML)]
            addChips(this, "chip", numbers, 36);
        }
        }
    
    }
};
    
singleBetCV[y].oncontextmenu = function(){
     if(disableSingleBet != true){      
   if(this.parentElement.className == "tg-blue-alt r2" || this.parentElement.className == "tg-blue-alt r3"||this.parentElement.className == "tg-red-alt r3" || this.parentElement.className == "tg-black-alt r3" ){
                switch(this.parentElement.getElementsByTagName('P')[0].innerHTML){
            case "1-18":
            var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
            removeChips(this, numbers, 2);
            break;
            case "19-36":
            var numbers = [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36];
                 removeChips(this, numbers, 2);
            break;
            case "Odd":
            var numbers = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35];
                 removeChips(this, numbers, 2);
            break;
            case "Even":
            var numbers = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36];
                 removeChips(this, numbers, 2);
            break;
            case "Red":
            var numbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
                 removeChips(this, numbers, 2);
            break;
            case "Black":
            var numbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];
                 removeChips(this, numbers, 2);
            break;

        }
   
        }else{
        if(this.parentElement.className == "tg-blue-alt r1" || this.parentElement.className == "tg-blue"){
        switch(this.parentElement.getElementsByTagName('P')[0].innerHTML){
            case "R1":
            var numbers = [3,6,9,12,15,18,21,24,27,30,33,36];
                 removeChips(this, numbers, 3);
            break;
            case "R2":
            var numbers = [2,5,8,11,14,17,20,23,26,29,32,35];
            removeChips(this, numbers, 3);
            break;
            case "R3":
            var numbers = [1,4,7,10,13,16,19,22,25,28,31,34];
            removeChips(this, numbers, 3);
            break;
            case "1-12":
            var numbers = [1,2,3,4,5,6,7,8,9,10,11,12];
           removeChips(this, numbers, 3);
            break;
            case "13-24":
            var numbers = [13,14,15,16,17,18,19,20,21,22,23,24];
            removeChips(this, numbers, 3);
            break;
            case "25-36":
            var numbers = [25,26,27,28,29,30,31,32,33,34,35,36];
          removeChips(this, numbers, 3);
            break;
        }
        }else{
            var numbers = [parseInt(this.parentElement.getElementsByTagName('P')[0].innerHTML)]
            removeChips(this, numbers, 36);
        }
        }
     }
};
    
};

/*

$(window).mousedown(function(e) {
  var x = e.pageX,
    y = e.pageY;
  var res = [];
  var desiredTG = [];
  var ele = document.elementFromPoint(x, y);
  while (ele && ele.tagName != "BODY" && ele.tagName != "HTML") {
 if(ele.className == "chipCV" && desiredTG.length < 1){
      desiredTG.push(ele);
    } else{
    res.push(ele);
    ele.style.display = "none";
    ele = document.elementFromPoint(x, y);  
    }
  }

  for (var i = 0; i < res.length; i++) {
    res[i].style.display = "";
  }
 


  switch (event.which) {
    case 1:
    if(disableSingleBet != true){      
        if(desiredTG[0].parentElement.className == "tg-blue-alt r2" || desiredTG[0].parentElement.className == "tg-blue-alt r3"||desiredTG[0].parentElement.className == "tg-red-alt r3" || desiredTG[0].parentElement.className == "tg-black-alt r3" ){
        addChips(desiredTG[0], "halfChip");
        }else{
        if(desiredTG[0].parentElement.className == "tg-blue-alt r1" || desiredTG[0].parentElement.className == "tg-blue"){
        addChips(desiredTG[0], "dozenChip");
        }else{
            addChips(desiredTG[0], "chip");
        }
        }
    
    }
      break;
    case 3:
            if(disableSingleBet != true){      
   
      removeChips(desiredTG[0]);
            }
      break;
  }

});

*/