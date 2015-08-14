var rangeParam =[];

function dzRangeHelper(type, wager){

switch(type){
    case "1-12":
        var from = Math.floor((1/37)*(Math.pow(2,32)));
        var to = Math.floor(((13)/37)*(Math.pow(2,32)));
        var param = {
            from: from,
            to: to,
            value: wager * 3 * 100
        };
        rangeParam.push(param);
        break;
    case "13-24":
        var from = Math.floor((13/37)*(Math.pow(2,32)));
        var to = Math.floor(((25)/37)*(Math.pow(2,32)));
        var param = {
            from: from,
            to: to,
            value: wager * 3 * 100
        };
        rangeParam.push(param);
        break;
    case "25-36":
        var from = Math.floor((25/37)*(Math.pow(2,32)));
        var to = Math.floor(((37)/37)*(Math.pow(2,32)));
        var param = {
            from: from,
            to: to,
            value: wager * 3 * 100
        };
        rangeParam.push(param);
        break;
    case "R1":   
  
        snRangeHelper(3,wager,3);
        snRangeHelper(6,wager,3);
        snRangeHelper(9,wager,3);
        snRangeHelper(12,wager,3);
        snRangeHelper(15,wager,3);
        snRangeHelper(18,wager,3);
        snRangeHelper(21,wager,3);
        snRangeHelper(24,wager,3);
        snRangeHelper(27,wager,3);
        snRangeHelper(30,wager,3);
        snRangeHelper(33,wager,3);
        snRangeHelper(36,wager,3);
        break;
    case "R2":   
        snRangeHelper(2,wager,3);
        snRangeHelper(5,wager,3);
        snRangeHelper(8,wager,3);
        snRangeHelper(11,wager,3);
        snRangeHelper(14,wager,3);
        snRangeHelper(17,wager,3);
        snRangeHelper(20,wager,3);
        snRangeHelper(23,wager,3);
        snRangeHelper(26,wager,3);
        snRangeHelper(29,wager,3);
        snRangeHelper(32,wager,3);
        snRangeHelper(35,wager,3);
        break;
    case "R3":   
        snRangeHelper(1,wager,3);
        snRangeHelper(4,wager,3);
        snRangeHelper(7,wager,3);
        snRangeHelper(10,wager,3);
        snRangeHelper(13,wager,3);
        snRangeHelper(16,wager,3);
        snRangeHelper(19,wager,3);
        snRangeHelper(22,wager,3);
        snRangeHelper(25,wager,3);
        snRangeHelper(28,wager,3);
        snRangeHelper(31,wager,3);
        snRangeHelper(34,wager,3);
        break;
    
};
};

function hcRangeHelper(type, wager){
switch(type){
    case "1-18":
        var from = Math.floor((1/37)*(Math.pow(2,32)));
        var to = Math.floor(((19)/37)*(Math.pow(2,32)));
        var param = {
            from: from,
            to: to,
            value: wager * 2 * 100
        };
        rangeParam.push(param);
        break;
    case "19-36":
        var from = Math.floor((19/37)*(Math.pow(2,32)));
        var to = Math.floor((37/37)*(Math.pow(2,32)));
        var param = {
            from: from,
            to: to,
            value: wager * 2 * 100
        };
        rangeParam.push(param);
        break;
    case "Even":
        for(d=1; d < 37;d++){
            if(d%2 == 0){
            snRangeHelper(d,wager,2);
            }
        }
        break;
    case "Odd":
        for(d=1; d < 37;d++){
            if(d%2 == 1){
            snRangeHelper(d,wager,2);
            }
        }
        break;
    case "Red":
        snRangeHelper(1,wager,2);
        snRangeHelper(3,wager,2);
        snRangeHelper(5,wager,2);
        snRangeHelper(7,wager,2);
        snRangeHelper(9,wager,2);
        snRangeHelper(12,wager,2);
        snRangeHelper(14,wager,2);
        snRangeHelper(16,wager,2);
        snRangeHelper(18,wager,2);
        snRangeHelper(19,wager,2);
        snRangeHelper(21,wager,2);
        snRangeHelper(23,wager,2);
        snRangeHelper(25,wager,2);
        snRangeHelper(27,wager,2);
        snRangeHelper(30,wager,2);
        snRangeHelper(32,wager,2);
        snRangeHelper(34,wager,2);
        snRangeHelper(36,wager,2);
        break;
    case "Black":
        snRangeHelper(2,wager,2);
        snRangeHelper(4,wager,2);
        snRangeHelper(6,wager,2);
        snRangeHelper(8,wager,2);
        snRangeHelper(10,wager,2);
        snRangeHelper(11,wager,2);
        snRangeHelper(13,wager,2);
        snRangeHelper(15,wager,2);
        snRangeHelper(17,wager,2);
        snRangeHelper(20,wager,2);
        snRangeHelper(22,wager,2);
        snRangeHelper(24,wager,2);
        snRangeHelper(26,wager,2);
        snRangeHelper(28,wager,2);
        snRangeHelper(29,wager,2);
        snRangeHelper(31,wager,2);
        snRangeHelper(33,wager,2);
        snRangeHelper(35,wager,2);
        break;  



}

}

function cnRangeHelper(num, wager){
var from1 = Math.floor((num/37)*(Math.pow(2,32)));
var to1 = Math.floor(((num + 1)/37)*(Math.pow(2,32)));
var from2 = Math.floor(((num+3)/37)*(Math.pow(2,32)));
var to2 = Math.floor(((num + 4)/37)*(Math.pow(2,32)));
var from3 = Math.floor(((num+2)/37)*(Math.pow(2,32)));
var to3 = Math.floor(((num + 3)/37)*(Math.pow(2,32))); 
var from4 = Math.floor(((num-1)/37)*(Math.pow(2,32)));
var to4 = Math.floor(((num)/37)*(Math.pow(2,32))); 
var param1 = {
from: from1,
to: to1,
value: wager * 9 * 100
};
var param2 = {
from: from2,
to: to2,
value: wager * 9 * 100
};
var param3 = {
from: from3,
to: to3,
value: wager * 9 * 100
};
var param4 = {
from: from4,
to: to4,
value: wager * 9 * 100
};
    
rangeParam.push(param1);
rangeParam.push(param2);
rangeParam.push(param3);
rangeParam.push(param4);
};



function sbhRangeHelper(num, wager){
var from = Math.floor(((num-1)/37)*(Math.pow(2,32)));
var to = Math.floor(((num + 1)/37)*(Math.pow(2,32)));

var param = {
from: from,
to: to,
value: wager * 18 * 100
};
rangeParam.push(param);
};


function sbvRangeHelper(num, wager){
var from1 = Math.floor((num/37)*(Math.pow(2,32)));
var to1 = Math.floor(((num + 1)/37)*(Math.pow(2,32)));
var from2 = Math.floor(((num+3)/37)*(Math.pow(2,32)));
var to2 = Math.floor(((num + 4)/37)*(Math.pow(2,32)));   
var param1 = {
from: from1,
to: to1,
value: wager * 18 * 100
};
var param2 = {
from: from2,
to: to2,
value: wager * 18 * 100
};
rangeParam.push(param1);
rangeParam.push(param2);
};


function snRangeHelper(num, wager, multi){
var from = Math.floor((num/37)*(Math.pow(2,32)));
var to = Math.floor(((num + 1)/37)*(Math.pow(2,32)));
var param = {
from: from,
to: to,
value: wager * multi * 100
};
rangeParam.push(param);
};

function checkBet(){
    rangeParam=[];
var chip = document.getElementsByClassName("chip");
for(var w = 0; w < chip.length; w++){
var wager = parseInt(chip[w].innerHTML);
var val = parseInt(chip[w].parentElement.previousElementSibling.innerHTML);
snRangeHelper(val, wager, 36);
};
var SVchip = document.getElementsByClassName("SVchip");
for(var w = 0; w < SVchip.length; w++){
var wager = parseInt(SVchip[w].innerHTML);
var val = parseInt(SVchip[w].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML);
sbvRangeHelper(val, wager);
};
var SHchip = document.getElementsByClassName("SHchip");
for(var w = 0; w < SHchip.length; w++){
var wager = parseInt(SHchip[w].innerHTML);
var val = parseInt(SHchip[w].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML);
sbhRangeHelper(val, wager);
};   
var cnChip = document.getElementsByClassName("cnChip");
for(var w = 0; w < cnChip.length; w++){
var wager = parseInt(cnChip[w].innerHTML);
var val = parseInt(cnChip[w].parentElement.parentElement.getElementsByTagName('p')[0].innerHTML);
cnRangeHelper(val, wager);
};      
    
var hChip = document.getElementsByClassName("halfChip");
for(var w = 0; w<hChip.length; w++){
var type = document.getElementsByClassName("halfChip")[w].parentElement.parentElement.children[0].innerHTML;
var wager = parseInt(hChip[w].innerHTML);
hcRangeHelper(type,wager);
};
var dChip = document.getElementsByClassName("dozenChip");
for(var w = 0; w < dChip.length; w++){
var type = document.getElementsByClassName("dozenChip")[w].parentElement.parentElement.children[0].innerHTML;
var wager = parseInt(dChip[w].innerHTML);
dzRangeHelper(type,wager);
};
    
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
addChips(this, "SVchip");
};    
SBV[b].oncontextmenu = function(){
removeChips(this);
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
addChips(this, "SHchip");
};    
SBH[b].oncontextmenu = function(){
removeChips(this);
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
addChips(this, "cnChip");
};    
CB[t].oncontextmenu = function(){
removeChips(this);
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

function createChips(chipType) {
var baseBet = parseInt(document.getElementById("cs-Input").value);
  var div = document.createElement('div');
            TWWagered += baseBet;
    document.getElementById("total-wagered").innerHTML = TWWagered + " bits"; 
          div.className = chipType;
  div.innerHTML = baseBet;
  return div;
}

function addChips(parent, chipType) {
var baseBet = parseInt(document.getElementById("cs-Input").value);
  if (parent.children.length == 0) {
    parent.appendChild(createChips(chipType));
  } else {
    var newVal = parseInt(parent.children[0].innerHTML) + baseBet;
     TWWagered += baseBet;
          document.getElementById("total-wagered").innerHTML = TWWagered + " bits"; 
    parent.children[0].innerHTML = newVal.toString();
  }

}

function removeChips(parent) {
    var baseBet = parseInt(document.getElementById("cs-Input").value);
  if (parent.children.length == 1) {
    var newVal = parseInt(parent.children[0].innerHTML) - baseBet;
      if (newval<1){
       TWWagered -= (baseBet + newVal);
      } else if (newVal > 0){
      TWWagered -= (baseBet);
      }
          document.getElementById("total-wagered").innerHTML = TWWagered + " bits"; 
    parent.children[0].innerHTML = newVal.toString();

    if (newVal < 1) {

      parent.removeChild(parent.children[0]);
        
    }

  }

}


var singleBetCV = document.getElementsByClassName("chipCV");

for(var y = 0; y < singleBetCV.length; y++){
singleBetCV[y].onclick = function(){
      if(disableSingleBet != true){      
        if(this.parentElement.className == "tg-blue-alt r2" || this.parentElement.className == "tg-blue-alt r3"||this.parentElement.className == "tg-red-alt r3" || this.parentElement.className == "tg-black-alt r3" ){
        addChips(this, "halfChip");
        }else{
        if(this.parentElement.className == "tg-blue-alt r1" || this.parentElement.className == "tg-blue"){
        addChips(this, "dozenChip");
        }else{
            addChips(this, "chip");
        }
        }
    
    }
};
singleBetCV[y].oncontextmenu = function(){
     if(disableSingleBet != true){      
    removeChips(this);
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