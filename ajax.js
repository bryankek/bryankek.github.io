
function sendAllBets(button) {
    checkBet();
   document.getElementById('bet-button').disabled = true;

    var payouts = rangeParam;
    var wager = TWWagered *100;
    var hash = betStore.state.nextHash;
    
    var bodyParams = {
    client_seed:0,
    hash: hash,
    payouts: payouts,
    wager: wager,
    max_subsidy:0
}

MoneyPot.placeCustomBet(bodyParams, {
        success: function(bet) {
            Dispatcher.sendAction('NEW_BET', bet);
          // Update next bet hash
            Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
            var target = Math.floor((bet.outcome/Math.pow(2,32))*36);
            animateRoll(target, bet.profit);
        
        },
        error: function(xhr) {
              document.getElementById('bet-button').disabled = false;    
            
          console.log('Error');
          if (xhr.responseJSON && xhr.responseJSON) {
            alert(xhr.responseJSON.error);
          } else {
            alert('Internal Error');
          
          }
        },
        complete: function() {
           
          // Force re-validation of wager
          Dispatcher.sendAction('UPDATE_WAGER', {
            str: betStore.state.wager.str
          });
        }
      }); 
}



var config = {
  // - Your app's id on moneypot.com
  app_id: 529,                             // <----------------------------- EDIT ME!
  // - Displayed in the navbar
  app_name: 'BitPot Roulette',
  // - For your faucet to work, you must register your site at Recaptcha
  // - https://www.google.com/recaptcha/intro/index.html
  recaptcha_sitekey: '6LdNvggTAAAAANd3cn-AD54gQFOYFu4Si3FYSPq0',  // <----- EDIT ME!
  redirect_uri: 'http://bryankek.github.io',
  mp_browser_uri: 'https://www.moneypot.com',
  mp_api_uri: 'https://api.moneypot.com',
  chat_uri: 'https://a-chat-server.herokuapp.com',
  // - Show debug output only if running on localhost
  debug: isRunningLocally(),
  // - Set this to true if you want users that come to http:// to be redirected
  //   to https://
  //force_https_redirect: !isRunningLocally()
};



//Auto bet global variables
var toggle = true;
var RenderNow = function(){
if(toggle == true){
clearInterval(refreshBet);
setInterval(refreshBet, 5000);
React.createElement(AllBetsTabContent, null); 
}else{};

};

//refresh bet
var refreshBet =  function(){
    setTimeout(function(){
    if(getAllBetData(lastBetID,10).length != 0 ){
        
        
        FirstBuffer.push(getAllBetData(lastBetID ,10));
        SecondBuffer.reverse();
        ThirdBuffer = new CBuffer(100);
        
        for (j = (FirstBuffer.toArray()[0].length-1); j > -1; j--) { 
            SecondBuffer.push(FirstBuffer.toArray()[0][j]);
            ThirdBuffer.push(FirstBuffer.toArray()[0][j]);
            
        };
        SecondBuffer.reverse();
 
   lastBetID = SecondBuffer.first().id;
        
    
        if(document.getElementById('ABTable') != null){
           for (k =0; k < ThirdBuffer.toArray().length; k++) { 
            var row = document.createElement("TR");
            var playercol = document.createElement("TD");
            playercol.innerHTML = ThirdBuffer.toArray()[k].uname;
            var betidcol = document.createElement("TD");
               var a = document.createElement("a");
               a.href = "https://www.moneypot.com/bets/" + ThirdBuffer.toArray()[k].id;
            betidcol.appendChild(a);
               a.innerHTML = ThirdBuffer.toArray()[k].id;
               a.style.color = 'white';
               
            var wagercol = document.createElement("TD");
               wagercol.innerHTML = ThirdBuffer.toArray()[k].wager/100 + ' bits';
           
               
            var profitcol = document.createElement("TD");
               profitcol.innerHTML = ThirdBuffer.toArray()[k].profit/100 + ' bits';
            
                 var multipliercol = document.createElement("TD");
              multipliercol.innerHTML = ((ThirdBuffer.toArray()[k].wager + (ThirdBuffer.toArray()[k].profit > 0? ThirdBuffer.toArray()[k].profit : ThirdBuffer.toArray()[k].profit*-1 )      )/ThirdBuffer.toArray()[k].wager).toFixed(2) + 'x'
               
               
               if(ThirdBuffer.toArray()[k].profit < 0){
               profitcol.style.color = 'rgb(204, 0, 0)';
               }else{profitcol.style.color = 'rgb(0, 255, 51)'; };
           
               row.appendChild(playercol);  
               row.appendChild(betidcol); 
               row.appendChild(wagercol); 
               row.appendChild(profitcol); 
               row.appendChild(multipliercol); 
               document.getElementById('ABTable').insertBefore(row, document.getElementById('ABTable').childNodes[0]);
               
           };
        };
        
        
      }else{};
    
}, 1000)


};


    var FirstBuffer = new CBuffer(1);
    var SecondBuffer = new CBuffer(100);
    var lastBetID = 0;



////////////////////////////////////////////////////////////
// You shouldn't have to edit anything below this line
////////////////////////////////////////////////////////////

if (config.force_https_redirect && window.location.protocol !== "https:") {
  window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
}

// Hoist it. It's impl'd at bottom of page.
var socket;

// :: Bool
function isRunningLocally() {
  return /^localhost/.test(window.location.host);
}

var el = React.DOM;

// Generates UUID for uniquely tagging components
var genUuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

var helpers = {};

helpers.randomHouseEdge = function(multiplier,wager){
     console.assert(typeof multiplier === 'number');
     console.assert(typeof wager === 'number');
  
    if (multiplier*wager <= 20000){
        return 0.5 + (0.5*Math.random());
    }
    
    if (multiplier*wager < 200000 && multiplier*wager > 20000){
        return 0.1 + (0.4*Math.random());
    }
    
    if (multiplier*wager <2000000 && multiplier*wager > 200000){
        return 0.01 + (0.09*Math.random());
    
    }

};

// Number -> Number in range (0, 1)
helpers.multiplierToWinProb = function(multiplier, edge) {
  console.assert(typeof multiplier === 'number');
  console.assert(multiplier > 0);
    var advantage = (Math.random()*1) / 100;
    
    if (advantage == 0){
    advantage = 0.0001;
    }
    
    if (advantage > 0.01){
    advantage = 0.01;
    }
    
    var winNum = (1/multiplier)
    var result = winNum - (winNum*advantage);
    var resultString = result.toString();
    resultString = resultString.substring(0,6);
    result = parseFloat(resultString);
    
    if(multiplier>9999||multiplier<1.01){
        result = 0;
    }
    
    
    return result;
  //return (1 - (0.1*edge)) / multiplier;
    
    
};

helpers.calcNumber = function(cond, winProb) {
  console.assert(cond === '<' || cond === '>');
  console.assert(typeof winProb === 'number');

  if (cond === '<') {
    var target = winProb * 100; 
    document.getElementById('targetoutcome').innerHTML = '< ' + target.toFixed(2); 
    return target;  
  } else {
    var target = 99.99 - (winProb * 100);
    document.getElementById('targetoutcome').innerHTML = '> ' + target.toFixed(2); 
    return target;
  }
};

helpers.roleToLabelElement = function(role) {
  switch(role) {
    case 'admin':
      return el.span({style:{
        border: 'solid 1px',
        'borderRadius':  '6px'
      }}, 'MP Staff');
    case 'mod':
      return el.span({style:{
        border: 'solid 1px',
        'borderRadius':  '6px'
      }}, 'Mod');
    case 'owner':
      return el.span({style:{
        border: 'solid 1px',
        'borderRadius':  '6px'
      }}, 'Owner');
    default:
      return '';
  }
};

// -> Object
helpers.getHashParams = function() {
  var hashParams = {};
  var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&;=]+)=?([^&;]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.hash.substring(1);
  while (e = r.exec(q))
    hashParams[d(e[1])] = d(e[2]);
  return hashParams;
};

// getPrecision('1') -> 0
// getPrecision('.05') -> 2
// getPrecision('25e-100') -> 100
// getPrecision('2.5e-99') -> 100
helpers.getPrecision = function(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
    0,
    // Number of digits right of decimal point.
    (match[1] ? match[1].length : 0) -
    // Adjust for scientific notation.
    (match[2] ? +match[2] : 0));
};

////////////////////////////////////////////////////////////
var getAllBetData = function(lastBetID, limit, betData) {
   var betData = null;

    
    var url = 'https://api.moneypot.com/v1/list-bets?access_token=' + worldStore.state.accessToken + '&&limit=' + limit + '&&app_id=' + config.app_id + '&&greater_than=' + lastBetID;
    
  $.ajax({
      url:      url,
      dataType: 'json', // data type of response
      async: false, 
      method:   'GET',
      headers: {
        'Content-Type': 'text/plain'
      },
      
      success: function(data){
       betData = data;
      }

    });
    
    return betData;
    
  };




// A weak MoneyPot API abstraction
var MoneyPot = (function() {

  var o = {};

  o.apiVersion = 'v1';

  // method: 'GET' | 'POST' | ...
  // endpoint: '/tokens/abcd-efgh-...'
  var noop = function() {};
  var makeMPRequest = function(method, bodyParams, endpoint, callbacks) {

    if (!worldStore.state.accessToken)
      throw new Error('Must have accessToken set to call MoneyPot API');

    var url = config.mp_api_uri + '/' + o.apiVersion + endpoint +
              '?access_token=' + worldStore.state.accessToken + '&&app_id=' + config.app_id;
  
    $.ajax({
      url:      url,
      dataType: 'json', // data type of response
      method:   method,
      data:     bodyParams ? JSON.stringify(bodyParams) : undefined,
      headers: {
        'Content-Type': 'text/plain'
      },
      // Callbacks
      success:  callbacks.success  || noop,
      error:    callbacks.error    || noop,
      complete: callbacks.complete || noop
    });
  };



  


  o.getTokenInfo = function(callbacks) {
    var endpoint = '/token';
    makeMPRequest('GET', undefined, endpoint, callbacks);
  };



  o.generateBetHash = function(callbacks) {
    var endpoint = '/hashes';
    makeMPRequest('POST', undefined, endpoint, callbacks);
  };

  o.getDepositAddress = function(callbacks) {
    var endpoint = '/deposit-address';
    makeMPRequest('GET', undefined, endpoint, callbacks);
  };

  // gRecaptchaResponse is string response from google server
  // `callbacks.success` signature	is fn({ claim_id: Int, amoutn: Satoshis })
  o.claimFaucet = function(gRecaptchaResponse, callbacks) {
    console.log('Hitting POST /claim-faucet');
    var endpoint = '/claim-faucet';
    var body = { response: gRecaptchaResponse };
    makeMPRequest('POST', body, endpoint, callbacks);
  };




  // bodyParams is an object:
  // - wager: Int in satoshis
  // - client_seed: Int in range [0, 0^32)
  // - hash: BetHash
  // - cond: '<' | '>'
  // - number: Int in range [0, 99.99] that cond applies to
  // - payout: how many satoshis to pay out total on win (wager * multiplier)
  o.placeSimpleDiceBet = function(bodyParams, callbacks) {
    var endpoint = '/bets/simple-dice';
    makeMPRequest('POST', bodyParams, endpoint, callbacks);
  };
    
    o.placeCustomBet = function(bodyParams, callbacks) {
    var endpoint = '/bets/custom';
    makeMPRequest('POST', bodyParams, endpoint, callbacks);
  };

  return o;
})();

////////////////////////////////////////////////////////////

var Dispatcher = new (function() {
  // Map of actionName -> [Callback]
  this.callbacks = {};

  var self = this;

  // Hook up a store's callback to receive dispatched actions from dispatcher
  //
  // Ex: Dispatcher.registerCallback('NEW_MESSAGE', function(message) {
  //       console.log('store received new message');
  //       self.state.messages.push(message);
  //       self.emitter.emit('change', self.state);
  //     });
  this.registerCallback = function(actionName, cb) {
    console.log('[Dispatcher] registering callback for:', actionName);

    if (!self.callbacks[actionName]) {
      self.callbacks[actionName] = [cb];
    } else {
      self.callbacks[actionName].push(cb);
    }
  };

  this.sendAction = function(actionName, payload) {
    console.log('[Dispatcher] received action:', actionName, payload);

    // Ensure this action has 1+ registered callbacks
    if (!self.callbacks[actionName]) {
      throw new Error('Unsupported actionName: ' + actionName);
    }

    // Dispatch payload to each registered callback for this action
    self.callbacks[actionName].forEach(function(cb) {
      cb(payload);
    });
  };
});

////////////////////////////////////////////////////////////

var Store = function(storeName, initState, initCallback) {

  this.state = initState;
  this.emitter = new EventEmitter();

  // Execute callback immediately once store (above state) is setup
  // This callback should be used by the store to register its callbacks
  // to the dispatcher upon initialization
  initCallback.call(this);

  var self = this;

  // Allow components to listen to store events (i.e. its 'change' event)
  this.on = function(eventName, cb) {
    self.emitter.on(eventName, cb);
  };

  this.off = function(eventName, cb) {
    self.emitter.off(eventName, cb);
  };
};

////////////////////////////////////////////////////////////

// Manage access_token //////////////////////////////////////
//
// - If access_token is in url, save it into localStorage.
//   `expires_in` (seconds until expiration) will also exist in url
//   so turn it into a date that we can compare

var access_token, expires_in, expires_at;

if (helpers.getHashParams().access_token) {
  console.log('[token manager] access_token in hash params');
  access_token = helpers.getHashParams().access_token;
  expires_in = helpers.getHashParams().expires_in;
  expires_at = new Date(Date.now() + (expires_in * 1000));

  localStorage.setItem('access_token', access_token);
  localStorage.setItem('expires_at', expires_at);
} else if (localStorage.access_token) {
  console.log('[token manager] access_token in localStorage');
  expires_at = localStorage.expires_at;
  // Only get access_token from localStorage if it expires
  // in a week or more. access_tokens are valid for two weeks
  if (expires_at && new Date(expires_at) > new Date(Date.now() + (1000 * 60 * 60 * 24 * 7))) {
    access_token = localStorage.access_token;
  } else {
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
  }
} else {
  console.log('[token manager] no access token');
}

// Scrub fragment params from url.
if (window.history && window.history.replaceState) {
  window.history.replaceState({}, document.title, "/");
} else {
  // For browsers that don't support html5 history api, just do it the old
  // fashioned way that leaves a trailing '#' in the url
  window.location.hash = '#';
}

////////////////////////////////////////////////////////////

var chatStore = new Store('chat', {
  messages: new CBuffer(250),
  waitingForServer: false,
  userList: {},
  showUserList: false,
  loadingInitialMessages: true
}, function() {
  var self = this;

  // `data` is object received from socket auth
  Dispatcher.registerCallback('INIT_CHAT', function(data) {
    console.log('[ChatStore] received INIT_CHAT');
    // Give each one unique id
    var messages = data.room.history.map(function(message) {
      message.id = genUuid();
      return message;
    });

    self.state.messages.push.apply(self.state.messages, messages);

    // Indicate that we're done with initial fetch
    self.state.loadingInitialMessages = false;

    // Load userList
    self.state.userList = data.room.users;
    self.emitter.emit('change', self.state);
    self.emitter.emit('init');
  });

  Dispatcher.registerCallback('NEW_MESSAGE', function(message) {
    console.log('[ChatStore] received NEW_MESSAGE');
    message.id = genUuid();
    self.state.messages.push(message);

    self.emitter.emit('change', self.state);
    self.emitter.emit('new_message');
  });

  Dispatcher.registerCallback('TOGGLE_CHAT_USERLIST', function() {
    console.log('[ChatStore] received TOGGLE_CHAT_USERLIST');
    self.state.showUserList = !self.state.showUserList;
    self.emitter.emit('change', self.state);
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_JOINED', function(user) {
    console.log('[ChatStore] received USER_JOINED:', user);
    self.state.userList[user.uname] = user;
    self.emitter.emit('change', self.state);
  });

  // user is { id: Int, uname: String, role: 'admin' | 'mod' | 'owner' | 'member' }
  Dispatcher.registerCallback('USER_LEFT', function(user) {
    console.log('[ChatStore] received USER_LEFT:', user);
    delete self.state.userList[user.uname];
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('NEW_SYSTEM_MESSAGE', function(text) {
    console.log('[ChatStore] received NEW_SYSTEM_MESSAGE');
    self.state.messages.push({
      id: genUuid(),
      text: text,
      user: {uname: '[SYSTEM]'}
    });
    self.emitter.emit('change', self.state);
    self.emitter.emit('new_message');
  });

  // Message is { text: String }
  Dispatcher.registerCallback('SEND_MESSAGE', function(text) {
    console.log('[ChatStore] received SEND_MESSAGE');
    self.state.waitingForServer = true;
    self.emitter.emit('change', self.state);
    socket.emit('new_message', text);
  });
});

var betStore = new Store('bet', {
  nextHash: undefined,
clientSeed: undefined,
  wager: {
    str: '1',
    num: 1,
    error: undefined
  },
  multiplier: {
    str: '2.00',
    num: 2.00,
    error: undefined
  },
  hotkeysEnabled: false
}, function() {
  var self = this;

  Dispatcher.registerCallback('SET_NEXT_HASH', function(hexString) {
    
    self.state.nextHash = hexString;
    document.getElementById("ServerHash").innerHTML = hexString;
    document.getElementById("ClientSeed").value = (Math.floor(Math.random()*4294967296)).toString();
    self.emitter.emit('change', self.state);
   
  });

  Dispatcher.registerCallback('UPDATE_WAGER', function(newWager) {
    self.state.wager = _.merge({}, self.state.wager, newWager);

    var n = parseInt(self.state.wager.str, 10);

    // If n is a number, ensure it's at least 1 bit
    if (isFinite(n)) {
      n = Math.max(n, 1);
      self.state.wager.str = n.toString();
    }

    // Ensure wagerString is a number
    if (isNaN(n) || /[^\d]/.test(n.toString())) {
      self.state.wager.error = 'INVALID_WAGER';
    // Ensure user can afford balance
    } else if (n * 100 > worldStore.state.user.balance) {
      self.state.wager.error = 'CANNOT_AFFORD_WAGER';
      self.state.wager.num = n;
    } else {
      // wagerString is valid
      self.state.wager.error = null;
      self.state.wager.str = n.toString();
      self.state.wager.num = n;
    }

    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('UPDATE_MULTIPLIER', function(newMult) {
    self.state.multiplier = _.merge({}, self.state.multiplier, newMult);
    self.emitter.emit('change', self.state);
  });
});

// The general store that holds all things until they are separated
// into smaller stores for performance.
var worldStore = new Store('world', {
  isLoading: true,
  user: undefined,
  accessToken: access_token,
  isRefreshingUser: false,
  hotkeysEnabled: false,
  currTab: 'MY_BETS',
  bets: new CBuffer(25),
  allBets: new CBuffer(25),
  grecaptcha: undefined
}, function() {
  var self = this;

  // TODO: Consider making these emit events unique to each callback
  // for more granular reaction.

  // data is object, note, assumes user is already an object
  Dispatcher.registerCallback('UPDATE_USER', function(data) {
    self.state.user = _.merge({}, self.state.user, data);
    self.emitter.emit('change', self.state);
    
  });

    
    
  // deprecate in favor of SET_USER
  Dispatcher.registerCallback('USER_LOGIN', function(user) {
    self.state.user = user;
    self.emitter.emit('change', self.state);
    self.emitter.emit('user_update');
  });

  // Replace with CLEAR_USER
  Dispatcher.registerCallback('USER_LOGOUT', function() {
    self.state.user = undefined;
    self.state.accessToken = undefined;
    localStorage.removeItem('expires_at');
    localStorage.removeItem('access_token');
    self.state.bets.empty();
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('START_LOADING', function() {
    self.state.isLoading = true;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('STOP_LOADING', function() {
    self.state.isLoading = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('CHANGE_TAB', function(tabName) {
    console.assert(typeof tabName === 'string');
    self.state.currTab = tabName;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('NEW_BET', function(bet) {
    console.assert(typeof bet === 'object');
    self.state.bets.push(bet);
    prevBetStats.push(bet);
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('TOGGLE_HOTKEYS', function() {
    self.state.hotkeysEnabled = !self.state.hotkeysEnabled;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('DISABLE_HOTKEYS', function() {
    self.state.hotkeysEnabled = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('START_REFRESHING_USER', function() {
    self.state.isRefreshingUser = true;
    self.emitter.emit('change', self.state);
    MoneyPot.getTokenInfo({
      success: function(data) {
        console.log('Successfully loaded user from tokens endpoint', data);
        var user = data.auth.user;
        self.state.user = user;
        self.emitter.emit('change', self.state);
        self.emitter.emit('user_update');
      },
      error: function(err) {
        console.log('Error:', err);
      },
      complete: function() {
        Dispatcher.sendAction('STOP_REFRESHING_USER');
      }
    });
  });

  Dispatcher.registerCallback('STOP_REFRESHING_USER', function() {
    self.state.isRefreshingUser = false;
    self.emitter.emit('change', self.state);
  });

  Dispatcher.registerCallback('GRECAPTCHA_LOADED', function(_grecaptcha) {
    self.state.grecaptcha = _grecaptcha;
    self.emitter.emit('grecaptcha_loaded');
  });

});

////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////

var UserBox = React.createClass({
  displayName: 'UserBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },
  _onLogout: function() {
    Dispatcher.sendAction('USER_LOGOUT');
  },
  _onRefreshUser: function() {
    Dispatcher.sendAction('START_REFRESHING_USER');
  },
  _openWithdrawPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/withdraw?app_id=' + config.app_id;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=450',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
  },
  _openDepositPopup: function() {
    var windowUrl = config.mp_browser_uri + '/dialog/deposit?app_id=' + config.app_id;
    var windowName = 'manage-auth';
    var windowOpts = [
      'width=420',
      'height=450',
      'left=100',
      'top=100'
    ].join(',');
    var windowRef = window.open(windowUrl, windowName, windowOpts);
    windowRef.focus();
    return false;
     

      
  },
  render: function() {

    var innerNode;
    if (worldStore.state.isLoading) {

      innerNode = el.span(
          {className: ''},
        'Loading...'
      );
    } else if (worldStore.state.user) {

      innerNode = 
        // Logged in as...
        el.div(
          {onClick:this._onRefreshUser},
          el.span(null,'Logged in as '),
          el.span(null, worldStore.state.user.uname),
     
        el.span(
            {style:{marginLeft:'15px'}},
        ' Balance: ' + (worldStore.state.user.balance / 100).toFixed(2) + ' bits'
        ), 
          
          
          
          el.ul(
         null,
        el.li(null,el.a({onClick:this._openDepositPopup},'Deposit')),el.li(null,el.a({onClick:this._openWithdrawPopup},'Withdraw')),el.li(null,el.a({onClick:this._onLogout},'Logout'))
            
            
            
        )
     );
          
          
          
          
          
    } else {
      // User needs to login
    document.getElementById('bet-button').disabled = true;
      innerNode =     el.a(
          {
         
            href: config.mp_browser_uri + '/oauth/authorize' +
              '?app_id=' + config.app_id +
              '&redirect_uri=' + config.redirect_uri,
            className: '',
            style:{}
          },
          el.span(null,'Login with Moneypot')
        )}

    return innerNode;
  
  }
});

var Navbar = React.createClass({
  displayName: 'Navbar',
  render: function() {
    return React.createElement(UserBox, null);
 
  }
});

var ChatBoxInput = React.createClass({
  displayName: 'ChatBoxInput',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    chatStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    chatStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  getInitialState: function() {
    return { text: '' };
  },
  // Whenever input changes
  _onChange: function(e) {
    this.setState({ text: e.target.value });
  },
  // When input contents are submitted to chat server
  _onSend: function() {
    var self = this;
    Dispatcher.sendAction('SEND_MESSAGE', this.state.text);
    this.setState({ text: '' });
  },
  _onFocus: function() {
    // When users click the chat input, turn off bet hotkeys so they
    // don't accidentally bet
    if (worldStore.state.hotkeysEnabled) {
      Dispatcher.sendAction('DISABLE_HOTKEYS');
    }
  },
  _onKeyPress: function(e) {
    var ENTER = 13;
    if (e.which === ENTER) {
      if (this.state.text.trim().length > 0) {
        this._onSend();
      }
    }
  },
  render: function() {
    return (
      el.div(
        {    style: {
               
                width:'100%',
                borderTop: 'solid 1px',
                borderBottom: 'solid 1px',
                marginLeft:'0px',
                paddingTop:'2px',
                paddingBottom:'2px'
                
         
                
                },className: 'row'},
        el.div(
          {className: 'col-md-9',style:{width:'70%',paddingLeft:'10px'}},
          chatStore.state.loadingInitialMessages ?
            el.div(
              {
                style: {marginTop: '7px'},
                className: 'text-muted'
              },
              el.span(
                {className: 'glyphicon glyphicon-refresh rotate'}
              ),
              ' Loading...'
            )
          :
            el.input(
              {
                id: 'chat-input',
                className: 'form-control',
                style: {
                width: '100%',
                paddingLeft:'0px'
                },
                
                style:{color:'white'},
                type: 'text',
                value: this.state.text,
                placeholder: worldStore.state.user ?
                  'Click here and begin typing...' :
                  'Login to chat',
                onChange: this._onChange,
                onKeyPress: this._onKeyPress,
                onFocus: this._onFocus,
                ref: 'input',
                // TODO: disable while fetching messages
                disabled: !worldStore.state.user || chatStore.state.loadingInitialMessages
              }
            )
        ),
        el.div(
          {className: 'col-md-3', style:{
                paddingLeft: '0px'}},
          el.button(
            {
                style: {
                'marginTop':  '4px',
                border:'solid 1px'
                },
              type: 'button',
              className: 'button large',
              /*disabled: !worldStore.state.user ||
                chatStore.state.waitingForServer ||
                this.state.text.trim().length === 0,*/
              onClick: this._onSend
            },
            'Send'
          )
        )
      )
    );
  }
});

var ChatUserList = React.createClass({
  displayName: 'ChatUserList',
  render: function() {
    return (
      el.div(
        {className: 'panel panel-default align-left'},
        el.div(
          {className: 'panel-heading', style:{'listStyle':'none'    }},
          'UserList'
        ),
        el.div(
          {className: 'panel-body'},
          el.ul(
            {},
            _.values(chatStore.state.userList).map(function(u) {
              return el.li(
                {
                  key: u.uname
                },
                helpers.roleToLabelElement(u.role),
                ' ' + u.uname
              );
            })
          )
        )
      )
    );
  }
});

var ChatBox = React.createClass({
  displayName: 'ChatBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  // New messages should only force scroll if user is scrolled near the bottom
  // already. This allows users to scroll back to earlier convo without being
  // forced to scroll to bottom when new messages arrive
  _onNewMessage: function() {
    var node = this.refs.chatListRef.getDOMNode();

    // Only scroll if user is within 100 pixels of last message
    var shouldScroll = function() {
      var distanceFromBottom = node.scrollHeight - ($(node).scrollTop() + $(node).innerHeight());
      console.log('DistanceFromBottom:', distanceFromBottom);
      return distanceFromBottom <= 100;
    };

    if (shouldScroll()) {
      this._scrollChat();
    }
  },
  _scrollChat: function() {
    var node = this.refs.chatListRef.getDOMNode();
    $(node).scrollTop(node.scrollHeight);
  },
  componentDidMount: function() {
    chatStore.on('change', this._onStoreChange);
    chatStore.on('new_message', this._onNewMessage);
    chatStore.on('init', this._scrollChat);
  },
  componentWillUnmount: function() {
    chatStore.off('change', this._onStoreChange);
    chatStore.off('new_message', this._onNewMessage);
    chatStore.off('init', this._scrollChat);
  },
  //
  _onUserListToggle: function() {
    Dispatcher.sendAction('TOGGLE_CHAT_USERLIST');
  },
  render: function() {
    return el.div(
      {id: 'chat-box'},
      el.div(
        {className: 'align-left panel panel-default',style:{width:'115%'}},
        el.div(
          {className: 'panel-body',style:{ overflow: 'hidden', width:'100%',height:'250px', }},
          el.ul(
            {className: 'chat-list list-unstyled', 
             style: {
            paddingLeft:'0px',
             'listStyle': 'none',
             overflowY: 'auto',
              overflowX: 'hidden',
                 overflowWrap:'break-word',
            
                 height: '240px',
                 width:'100%'
             },
                ref: 'chatListRef'},
            chatStore.state.messages.toArray().map(function(m) {
              return el.li(
                {
                  // Use message id as unique key
                  key: m.id,
                    style:{
                fontSize:'14px'}
                   
                },
                helpers.roleToLabelElement(m.user.role),
                ' ',
                el.code({style:{
                    fontSize:'14px',
                 border: 'solid 1px',
                'borderRadius':  '6px'
                
                }}, m.user.uname + ':'),
                el.div({style:{
                    fontSize:'16px',
                'marginLeft':  '6px'
                
                }}, ' ' + m.text)
              );
            })
          )
        ),
        el.div(
          {className: 'panel-footer'},
          React.createElement(ChatBoxInput, null)
        )
      ),
      // After the chatbox panel
      el.h1(
        {
          className: 'align-left text-right text-muted',
          style: { marginTop: '15px' }
        },
        'Users online: ' + Object.keys(chatStore.state.userList).length + ' ',
        // Show/Hide userlist button
        el.button(
          {
            className: 'button small',
            style:{'marginLeft':'15px', border:'solid 1px'},
            onClick: this._onUserListToggle
          },
          chatStore.state.showUserList ? 'Hide' : 'Show'
        )
      ),
      // Show userlist
      chatStore.state.showUserList ? React.createElement(ChatUserList, null) : ''
    );
  }
});

var BetBoxChance = React.createClass({
  displayName: 'BetBoxChance',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {
    // 0.00 to 1.00
    var houseEdge = helpers.randomHouseEdge(betStore.state.multiplier.num, betStore.state.wager.num);
    
    var winProb = helpers.multiplierToWinProb(betStore.state.multiplier.num, houseEdge);
    
    var baseProb = 1/betStore.state.multiplier.num; 
    var minProb = baseProb - (baseProb*0.01);
    var minString = minProb.toString();
    minString = minString.substring(0,6);
    minProb = 100* parseFloat(minString);
    minProb = minProb.toFixed(2);
      
    var maxProb = baseProb - (baseProb*0.0001);
    var maxString = maxProb.toString();
    maxString = maxString.substring(0,6);
    maxProb = 100 * parseFloat(maxString);  
    maxProb = maxProb.toFixed(2);
      
    var isError = betStore.state.multiplier.error || betStore.state.wager.error;

    // Just show '--' if chance can't be calculated
    var innerNode;
    if (isError) {
        
        innerNode = el.span(
        {className: 'h1'},
        ' ' + minProb + '% - ' + maxProb + '%'
      );
      /*innerNode = el.span(
        {className: 'lead'},
        ' --'
      );*/
    } else {
      innerNode = el.span(
        {className: 'h1'},
       ' ' + minProb + '% - ' + maxProb + '%'
      );
    }

    return el.div(
      {},
      el.span(
        {className: 'h1', style: { 
            'marginRight': '5px',
            fontWeight: 'bold' }},
        'Chance:'
      ),
      innerNode
    );
  }
});

var BetBoxProfit = React.createClass({
  displayName: 'BetBoxProfit',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  render: function() {
    var profit = betStore.state.wager.num * (betStore.state.multiplier.num - 1);

    var innerNode;
    if (betStore.state.multiplier.error || betStore.state.wager.error) {
        innerNode = el.span(
        {
          className: 'h1',
        },
        profit.toFixed(2) + ' bits'
      );
        
        /*innerNode = el.span(
        {className: 'lead'},
        '--'
      );*/
    } else {
      innerNode = el.span(
        {
          className: 'h1',
        },
       profit.toFixed(2) + ' bits'
      );
    }

    return el.div(
      null,
      el.span(
        {className: 'h1', style: { 
            'marginRight': '20px',
            fontWeight: 'bold' }},
        'Profit: '
      ),
      innerNode
    );
  }
});

var BetBoxMultiplier = React.createClass({
  displayName: 'BetBoxMultiplier',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
  },
  //
  _validateMultiplier: function(newStr) {
    var num = parseFloat(newStr, 10);

    // If num is a number, ensure it's at least 0.01x
    // if (Number.isFinite(num)) {
    //   num = Math.max(num, 0.01);
    //   this.props.currBet.setIn(['multiplier', 'str'], num.toString());
    // }

    var isFloatRegexp = /^(\d*\.)?\d+$/;

    // Ensure str is a number
    if (isNaN(num) || !isFloatRegexp.test(newStr)) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'INVALID_MULTIPLIER' });
      // Ensure multiplier is >= 1.00x
    } else if (num < 1.01) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_LOW' });
      // Ensure multiplier is <= max allowed multiplier (100x for now)
    } else if (num > 9999) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_HIGH' });
      // Ensure no more than 2 decimal places of precision
    } else if (helpers.getPrecision(num) > 2) {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', { error: 'MULTIPLIER_TOO_PRECISE' });
      // multiplier str is valid
    } else {
      Dispatcher.sendAction('UPDATE_MULTIPLIER', {
        num: num,
        error: null
      });
    }
  },
  _onMultiplierChange: function(e) {
    console.log('Multiplier changed');
    var str = e.target.value;
    console.log('You entered', str, 'as your multiplier');
    Dispatcher.sendAction('UPDATE_MULTIPLIER', { str: str });
    this._validateMultiplier(str);
  },
  render: function() {
    return el.div(
      {className: 'align-left form-group'},
    
        el.h2(
          {
            style: betStore.state.multiplier.error ? { color: 'rgb(204, 0, 0)' } : {}
          },
          'Multiplier'),
     

        el.input(
          {
            type: 'text',
            value: betStore.state.multiplier.str,
            className: 'align-left form-control input-lg',
            style: {
            width: '50%',
          
            'marginBottom': '25px',
            //'backgroundColor': 'transparent',
            //'border': '1px solid #ffffff',
            'fontWeight': '300'
          
          },
            onChange: this._onMultiplierChange,
            disabled: !!worldStore.state.isLoading
          }
        )
    );
  }
});

var BetBoxWager = React.createClass({
  displayName: 'BetBoxWager',
  // Hookup to stores
  _onStoreChange: function() {
    this.forceUpdate();
  },
  _onBalanceChange: function() {
    // Force validation when user logs in
    // TODO: Re-force it when user refreshes
    Dispatcher.sendAction('UPDATE_WAGER', {});
  },
  componentDidMount: function() {
    betStore.on('change', this._onStoreChange);
    worldStore.on('change', this._onStoreChange);
    worldStore.on('user_update', this._onBalanceChange);
  },
  componentWillUnmount: function() {
    betStore.off('change', this._onStoreChange);
    worldStore.off('change', this._onStoreChange);
    worldStore.off('user_update', this._onBalanceChange);
  },
  _onWagerChange: function(e) {
    var str = e.target.value;
    Dispatcher.sendAction('UPDATE_WAGER', { str: str });
  },
  _onHalveWager: function() {
    var newWager = Math.round(betStore.state.wager.num / 2);
    Dispatcher.sendAction('UPDATE_WAGER', { str: newWager.toString() });
  },
  _onDoubleWager: function() {
    var n = betStore.state.wager.num * 2;
    Dispatcher.sendAction('UPDATE_WAGER', { str: n.toString() });

  },
  _onMaxWager: function() {
    // If user is logged in, use their balance as max wager
    var balanceBits;
    if (worldStore.state.user) {
      balanceBits = Math.floor(worldStore.state.user.balance / 100);
    } else {
      balanceBits = 42000;
    }
    Dispatcher.sendAction('UPDATE_WAGER', { str: balanceBits.toString() });
  },
  //
  render: function() {
   
    return el.div(
      {className: 'align-right form-group', style:{}},
   
        el.h2(
          // If wagerError, make the label red
          betStore.state.wager.error ? { style: {color: 'rgb(204, 0, 0)'} } : '#444',
          'Wager')
      ,
      el.input(
        {
          value: betStore.state.wager.str,
          type: 'text',
          className: 'align-right form-control input-lg',
          style: {
              'marginLeft': '50%',
            'marginBottom': '25px',
         //   'backgroundColor': 'transparent',
           // 'border': '1px solid #ffffff',
            'fontWeight': '300',
            width:'50%'
          
          },
          onChange: this._onWagerChange,
          disabled: !!worldStore.state.isLoading,
          placeholder: 'Bits'
        }
      ),
      el.div(
        {className: 'align-right ', style:{marginLeft:'40%'}},
        el.div(
          {className: 'btn-group',style: {paddingLeft:'16%',marginBottom: '10%' }},
          el.button(
            {
            
                className: 'button big',
              type: 'button',
              style: {border:'solid 1px white', width:'120px', paddingLeft:'5px', paddingRight:'5px'},
              onClick: this._onHalveWager
            },
            '1/2x', worldStore.state.hotkeysEnabled ? el.kbd(null, '(X)') : ''
          )
        ),
        el.div(
          {className: 'btn-group',style: {paddingLeft:'4%',marginBottom: '10%'}},
          el.button(
            {
                style: {border:'solid 1px white', width:'120px', paddingLeft:'5px', paddingRight:'5px'},
              className: 'button big',
              type: 'button',
              onClick: this._onDoubleWager
            },
            '2x ', worldStore.state.hotkeysEnabled ? el.kbd(null, '(C)') : ''
          )
        ),
        el.div(
          {className: 'btn-group',style: {paddingLeft:'4%',marginBottom: '10%'}},
          el.button(
            {style: {border:'solid 1px white', width:'120px',paddingLeft:'5px', paddingRight:'5px'},
              className: 'button big',
              type: 'button',
              onClick: this._onMaxWager
            },
            'Max', worldStore.state.hotkeysEnabled ? el.kbd(null, '(V)') : ''
          )
        )
      )
    
       
                 
                 
                 
                 );
  }
});

var BetBoxButton = React.createClass({
  displayName: 'BetBoxButton',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
    betStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
    betStore.off('change', this._onStoreChange);
  },
  getInitialState: function() {
    return { waitingForServer: false };
  },
  // cond is '>' or '<'
  _makeBetHandler: function(cond) {
    var self = this;

    console.assert(cond === '<' || cond === '>');

    return function(e) {
      console.log('Placing bet...');

      // Indicate that we are waiting for server response
      self.setState({ waitingForServer: true });

      var hash = betStore.state.nextHash;
      console.assert(typeof hash === 'string');
        
    var clientSeed = parseInt(document.getElementById("ClientSeed").value);

      var wagerSatoshis = betStore.state.wager.num * 100;
      var multiplier = betStore.state.multiplier.num;
      var payoutSatoshis = wagerSatoshis * multiplier;

      var number = helpers.calcNumber(
        cond, helpers.multiplierToWinProb(multiplier)
      );

      var params = {
        wager: wagerSatoshis,
        client_seed: clientSeed, // TODO
        hash: hash,
        cond: cond,
        target: number,
        payout: payoutSatoshis
      };

      MoneyPot.placeSimpleDiceBet(params, {
        success: function(bet) {
            bet.meta = {
            wager:wagerSatoshis/100,
            multiplier:payoutSatoshis/wagerSatoshis,
            cond: cond,
            number: number,
            hash: hash,
            isFair: CryptoJS.SHA256(bet.secret + '|' + bet.salt).toString() === hash
          };
        var numAnim = new CountUp(bet.profit,bet.meta.cond, bet.meta.number, "outcomeanim", 0.00, 99.99, 2, 0.4);
        numAnim.update(bet.outcome.toFixed(2));  
        document.getElementById("PrevBetID").children[0].innerHTML = bet.bet_id;
        document.getElementById("PrevBetID").children[0].href = "https://www.moneypot.com/bets/" + parseInt(bet.bet_id);
        document.getElementById("PrevBetID").children[0].innerHTML = bet.bet_id;
         document.getElementById("PrevServerHash").innerHTML = bet.meta.hash;
             document.getElementById("PrevClientSeed").innerHTML = clientSeed;
            
             document.getElementById("PrevBetFair").innerHTML = Math.floor(10000*(((bet.secret + clientSeed)%Math.pow(2,32))/4294967296))/100 === bet.outcome ? "Verified" : "Something went wrong, please check on the detailed ";
          console.log('Successfully placed bet:', bet);
          // Append to bet list
            Dispatcher.sendAction('NEW_BET', bet);
            
            
          // Update next bet hash
          Dispatcher.sendAction('SET_NEXT_HASH', bet.next_hash);
            
            
            
          setTimeout(function(){
    // We don't get this info from the API, so assoc it for our use
        

           
        
          // Update user balance
            
            
          Dispatcher.sendAction('UPDATE_USER', {
            balance: worldStore.state.user.balance + bet.profit
          });
        
}, 100); 
            
            
            
        
        
        
        
        
        
        },
        error: function(xhr) {
          console.log('Error');
          if (xhr.responseJSON && xhr.responseJSON) {
            alert(xhr.responseJSON.error);
          } else {
            alert('Internal Error');
          }
        },
        complete: function() {
          self.setState({ waitingForServer: false });
          // Force re-validation of wager
          Dispatcher.sendAction('UPDATE_WAGER', {
            str: betStore.state.wager.str
          });
        }
      });
    };
  },
  render: function() {
    var innerNode;

    // TODO: Create error prop for each input
    var error = betStore.state.wager.error || betStore.state.multiplier.error;

    if (worldStore.state.isLoading) {
      // If app is loading, then just disable button until state change
      innerNode = el.button(
        {type: 'button', disabled: true, className: 'button big'},
        'Loading...'
      );
    } else if (error) {
      // If there's a betbox error, then render button in error state

      var errorTranslations = {
        'CANNOT_AFFORD_WAGER': 'You cannot afford wager',
        'INVALID_WAGER': 'Invalid wager',
        'INVALID_MULTIPLIER': 'Invalid multiplier',
        'MULTIPLIER_TOO_PRECISE': 'Multiplier too precise',
        'MULTIPLIER_TOO_HIGH': 'Multiplier too high',
        'MULTIPLIER_TOO_LOW': 'Multiplier too low'
      };

      innerNode = el.button(
        {type: 'button',
         disabled: true,
         className: 'button small',
        style:{marginBottom:'5%'}},
        errorTranslations[error] || 'Invalid bet'
      );
    } else if (worldStore.state.user) {
      // If user is logged in, let them submit bet
      innerNode =
        el.div(
          {className: 'row', style:{width:'50%'}},
          // bet hi
          el.div(
            {className: 'col-xs-6'},
            el.button(
              {
                id: 'bet-hi',
                type: 'button',
                className: 'button big',
               style:{
                                       paddingLeft:'20%',
               'marginLeft':'0px',
                border:'solid 1px white',
                width:'120px',
                   height:'80px'
               },
                  
                  
                onClick: this._makeBetHandler('>'),
                disabled: !!this.state.waitingForServer
              },
              'High ', worldStore.state.hotkeysEnabled ? el.kbd(null, '(H)') : ''
            )
          ),
          // bet lo
          el.div(
            {className: 'col-xs-6'},
            el.button(
              {
                id: 'bet-lo',
                type: 'button',
                className: 'button big', 
                style:{
                    marginTop:'15%',
                     marginBottom:'15%',
                    paddingLeft:'20%',
               'marginLeft':'0px',
                border:'solid 1px white',
                    width:'120px',
                    height:'80px'
               },
                onClick: this._makeBetHandler('<'),
                disabled: !!this.state.waitingForServer
              },
              'Low ', worldStore.state.hotkeysEnabled ? el.kbd(null, '(L)') : ''
            )
          )
        );
    } else {
      // If user isn't logged in, give them link to /oauth/authorize
      innerNode = el.a(
        {
          href: config.mp_browser_uri + '/oauth/authorize' +
            '?app_id=' + config.app_id +
            '&redirect_uri=' + config.redirect_uri,
          className: 'button small',
            style: {
            border:'solid 1px',
            marginBottom:'5%'
                
            }
        },
        'Login with MoneyPot'
      );
    }

    return   el.div(
        {className: 'align-left'},
      el.div(
        {className: 'col-md-2',style: { marginTop: '15px' }},
        (this.state.waitingForServer) ?
          el.span(
            {
              className: 'glyphicon glyphicon-refresh rotate',
              style: { marginTop: '15px' }
            }
          ) : ''
      ),
      el.div(
        {className: 'col-md-8'},
        innerNode
      ), el.div(
        {className:'align-left'},
              el.div(
                {className: 'col-sm-6'},
                React.createElement(BetBoxProfit, null)
              ),
              el.div(
                {className: 'col-sm-6'},
                React.createElement(BetBoxChance, null)
              ),
                 el.h1( null,
                worldStore.state.user?'Balance: ' + (worldStore.state.user.balance / 100).toFixed(2) + ' bits':'')
               
            )
        
        
        
        
    );
  }
});

var HotkeyToggle = React.createClass({
  displayName: 'HotkeyToggle',
  _onClick: function() {
    Dispatcher.sendAction('TOGGLE_HOTKEYS');
  },
    
_onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
    
  render: function() {
    return (
      el.div(
        {className: 'align-left',   style: { paddingLeft: '4.6%' }},
        el.button(
          {
            type: 'button',
            className: 'button small',
            onClick: this._onClick,
            style: { }
          },
          'Hotkeys: ',
          worldStore.state.hotkeysEnabled ?
            el.span({className: 'label label-success'}, 'ON') :
          el.span({className: 'label label-default'}, 'OFF')
        )
      )
    );
  }
});

var BetBox = React.createClass({
  displayName: 'BetBox',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    return el.div(
      null,
      el.div(
        {
        style:{

        marginRight: '7%'

            
        },    
        className: '',
       
        
        },
        el.div(
          {className: 'panel-body',            style:{
    width: '100%',          
    paddingLeft: '5%',
    paddingRight: '5%'

               }},
          
          el.div(
            {className: 'row',  style:{
    width: '100%'
               }},
            el.div(
              {className: 'col-xs-6',style:{
    width: '100%'
               }
              
              },
                React.createElement(BetBoxWager, null),
                React.createElement(BetBoxMultiplier, null)
            ),
        
            // HR
            el.div(
              {className: 'row'},
              el.div(
                {className: 'col-xs-12'},
                el.hr(null)
              )
            )
        
          )
        ),
        el.div(
          {className: 'panel-footer clearfix', style:{paddingLeft:'5%'}},
          React.createElement(BetBoxButton, null)
        )
      ),
      React.createElement(HotkeyToggle, null)
    );
  }
});

var Tabs = React.createClass({
  displayName: 'Tabs',
  _onStoreChange: function() {
    this.forceUpdate();
  },


  _makeTabChangeHandler: function(tabName) {
    var self = this;
    return function() {
      Dispatcher.sendAction('CHANGE_TAB', tabName);
    };
  },
  render: function() {
    return el.ul(
      {className: 'row nav nav-tabs',
       style: {
       'listStyle': 'none',

        'marginLeft': '15px',
        'paddingLeft': '0px'
           
           
       }
      
      
      },
      el.li(
        {
    
            
            className: worldStore.state.currTab === 'ALL_BETS' ? 'active' : ''},
        el.a(
          {
             style:{
            border:'solid 1px'
            },
            className: 'button small',
            id: 'abbutton',
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('ALL_BETS')
              
              
              
          },
          'All Bets'
        )
      ),
      el.li(
        {className: worldStore.state.currTab === 'MY_BETS' ? 'active' : ''},
        el.a(
          {
            style:{
            border:'solid 1px'
            },
              className: 'button small',  
               id: 'mbbutton',
            href: 'javascript:void(0)',
            onClick: this._makeTabChangeHandler('MY_BETS')
          },
          'My Bets'
        )
      ),
      !config.recaptcha_sitekey ? '' :
        el.li(
          {className: worldStore.state.currTab === 'FAUCET' ? 'active' : ''},
          el.a(
            {
                 style:{
            border:'solid 1px'
            },
                className: 'button small',  
                 id: 'fbutton',
              href: 'javascript:void(0)',
              onClick: this._makeTabChangeHandler('FAUCET')
            },
            el.span(null, 'Faucet ')
          )
        )
    );
  }
});





var AllBetsTabContent = React.createClass({
  displayName: 'AllBetsTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
 componentDidMount: function() {
    if(worldStore.state.accessToken != undefined){
    this.interval = setInterval(refreshBet, 2000); 
    }
 
  },
  componentWillUnmount: function() {
     clearInterval(this.interval);
  },
 


    
  render: function() {
toggle = false;
console.log('rendered once');
    if(worldStore.state.accessToken != undefined){
      if(getAllBetData(lastBetID,10).length != 0 ){
        //console.log('update ' + lastBetID);  
        
        FirstBuffer.push(getAllBetData(lastBetID ,10));
        SecondBuffer.reverse();
        for (j = (FirstBuffer.toArray()[0].length-1); j > -1; j--) { 
            SecondBuffer.push(FirstBuffer.toArray()[0][j]);
        };
        SecondBuffer.reverse();
 
   lastBetID = SecondBuffer.first().id;
        
        
        
      } else{};
      
             return el.div(
          {style:{
          
           'overflowY': 'auto',
            height: '400px',
            width:'100%'
          
          }}
          
          
          ,
      el.table(
        {className: 'table',
         style:{
           color: 'white',
           'marginLeft':'0px'
          
          }
        
        
        
        
        },
        el.thead(
          null,
          el.tr(
            null,
            el.th({style:{
            color: 'white'
          
          }}, 'Player'),
            el.th({style:{
            color: 'white'
          
          }}, 'Bet ID'),
            el.th({style:{
            color: 'white'
          
          }}, 'Wager'),
            el.th({style:{
            color: 'white'
          
          }}, 'Profit'), el.th({style:{
            color: 'white'
          
          }}, 'Multiplier'),
           
            config.debug ? el.th(null, 'Dump') : ''
          )
        ),
        
        el.tbody(
            {id:'ABTable'},
       
           SecondBuffer.toArray().map(function(bet) {
          return  el.tr({key:bet.id}, 
          
            el.td(null, bet.uname),
               
                        
            el.td(null, 
                 
                  el.a(
                  {href: 'https://www.moneypot.com/bets/' + bet.id,
                   style:{
                     color: '#FFFFFF'
                   }
                  
                  
                  
                  },
                  bet.id
                )
                 
                 
                 ),
            el.td(null, bet.wager/100 + ' bits'), 
                        
            el.td(
                {style: {color: bet.profit > 0 ? 'rgb(0, 255, 51)' : 'rgb(204, 0, 0)'}},
                bet.profit > 0 ?
                  '+' + bet.profit/100  + ' bits' :
                  bet.profit/100  + ' bits'
              ),
                         el.td(null,
               ((bet.wager + (bet.profit > 0? bet.profit : bet.profit*-1 )      )/bet.wager).toFixed(2) + 'x'
              )
   
            
            )
      
      
      
            })
            
        )
      )
    );
      
 
  }
      else{
          return el.h1(null, 'Log in first to view All Bets')
      
      }
  
  
  
  }
});










var MyBetsTabContent = React.createClass({
  displayName: 'MyBetsTabContent',
  _onStoreChange: function() {
    this.forceUpdate();
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
    
  render: function() {
      toggle = true;
    return el.div(
      {style:{
          
           'overflowY': 'auto',
            height: '400px',
            width:'100%'
          
          }},
      el.table(
        {className: 'table',
        
        style:{
            color: 'white',
           'marginLeft':'0px'
          
          }
        
        },
        el.thead(
          null,
          el.tr(
            null,
            el.th({style:{
            color: 'white'
          
          }}, 'ID'),    
            el.th({style:{
            color: 'white'
          
          }}, 'Wager'),
            el.th({style:{
            color: 'white'
          
          }}, 'Profit'),    
            el.th({style:{
            color: 'white'
          
          }}, 'Multiplier'),
            el.th({style:{
            color: 'white'
          
          }}, 'Outcome'),
            el.th({style:{
            color: 'white'
          
          }}, 'Target'),
            config.debug ? el.th(null, 'Dump') : ''
          )
        ),
        el.tbody(
          null,
          worldStore.state.bets.toArray().map(function(bet) {
            return el.tr(
              {
                key: bet.bet_id
              },
              // bet id
              el.td(
                null,
                el.a(
                  {href: config.mp_browser_uri + '/bets/' + bet.bet_id,
                  style:{
                     color: '#FFFFFF'
                   }
                  },
                  bet.bet_id
                )
              ),
                
                el.td(
                null,bet.meta.wager + ' bits'),
                
              // profit
              el.td(
                {style: {color: bet.profit > 0 ? 'rgb(0, 255, 51)' : 'rgb(204, 0, 0)'}},
                bet.profit > 0 ?
                  '+' + bet.profit/100 + ' bits' :
                  bet.profit/100 + ' bits'
              ),
                
                el.td(
                null,bet.meta.multiplier.toFixed(2) + 'x'),
              // outcome
              el.td(
                null,
                bet.outcome + ' '
                
              ),
              // target
              el.td(
                null,
                bet.meta.cond + ' ' + bet.meta.number.toFixed(2)
              ),
              // dump
              !config.debug ? '' :
                el.td(
                  null,
                  el.pre(
                    {
                      style: {
                        maxHeight: '75px',
                        overflowY: 'auto'
                      }
                    },
                    JSON.stringify(bet, null, '  ')
                  )
                )
            );
          }).reverse()
        )
      )
    );
  }
});

var FaucetTabContent = React.createClass({
  displayName: 'FaucetTabContent',
  getInitialState: function() {
    return {
      // SHOW_RECAPTCHA | SUCCESSFULLY_CLAIM | ALREADY_CLAIMED | WAITING_FOR_SERVER
      faucetState: 'SHOW_RECAPTCHA',
      // :: Integer that's updated after the claim from the server so we
      // can show user how much the claim was worth without hardcoding it
      // - It will be in satoshis
      claimAmount: undefined
    };
  },
  // This function is extracted so that we can call it on update and mount
  // when the window.grecaptcha instance loads
  _renderRecaptcha: function() {
    worldStore.state.grecaptcha.render(
      'recaptcha-target',
      {
        sitekey: config.recaptcha_sitekey,
        callback: this._onRecaptchaSubmit
      }
    );
  },
  // `response` is the g-recaptcha-response returned from google
  _onRecaptchaSubmit: function(response) {
    var self = this;
    console.log('recaptcha submitted: ', response);

    self.setState({ faucetState: 'WAITING_FOR_SERVER' });

    MoneyPot.claimFaucet(response, {
      // `data` is { claim_id: Int, amount: Satoshis }
      success: function(data) {
        Dispatcher.sendAction('UPDATE_USER', {
          balance: worldStore.state.user.balance + data.amount
        });
        self.setState({
          faucetState: 'SUCCESSFULLY_CLAIMED',
          claimAmount: data.amount
        });
        // self.props.faucetClaimedAt.update(function() {
        //   return new Date();
        // });
      },
      error: function(xhr, textStatus, errorThrown) {
        if (xhr.responseJSON && xhr.responseJSON.error === 'FAUCET_ALREADY_CLAIMED') {
          self.setState({ faucetState: 'ALREADY_CLAIMED' });
        }
      }
    });
  },
  // This component will mount before window.grecaptcha is loaded if user
  // clicks the Faucet tab before the recaptcha.js script loads, so don't assume
  // we have a grecaptcha instance
  componentDidMount: function() {
    if (worldStore.state.grecaptcha) {
      this._renderRecaptcha();
    }

    worldStore.on('grecaptcha_loaded', this._renderRecaptcha);
  },
  componentWillUnmount: function() {
    worldStore.off('grecaptcha_loaded', this._renderRecaptcha);
  },
  render: function() {
      toggle = true;

    // If user is not logged in, let them know only logged-in users can claim
    if (!worldStore.state.user) {
      return el.p(
        {className: 'lead'},
        'You must login to claim faucet'
      );
    }

    var innerNode;
    // SHOW_RECAPTCHA | SUCCESSFULLY_CLAIMED | ALREADY_CLAIMED | WAITING_FOR_SERVER
    switch(this.state.faucetState) {
    case 'SHOW_RECAPTCHA':
      innerNode = el.div(
        { id: 'recaptcha-target' },
        !!worldStore.state.grecaptcha ? '' : 'Loading...'
      );
      break;
    case 'SUCCESSFULLY_CLAIMED':
      innerNode = el.div(
          {style:{
          'marginLeft': '0px'
          
          
          
          }},
        'Successfully claimed ' + this.state.claimAmount/100 + ' bits.' +
          // TODO: What's the real interval?
          ' You can claim again in 5 minutes.'
      );
      break;
    case 'ALREADY_CLAIMED':
      innerNode = el.div(
        null,
        'ALREADY_CLAIMED'
      );
      break;
    case 'WAITING_FOR_SERVER':
      innerNode = el.div(
        null,
        'WAITING_FOR_SERVER'
      );
      break;
    default:
      alert('Unhandled faucet state');
      return;
    }

    return el.div(
      null,
      innerNode
    );
  }
});

var TabContent = React.createClass({
  displayName: 'TabContent',
  _onStoreChange: function() {
      if(worldStore.state.currTab === 'ALL_BETS' && toggle === true){
    this.forceUpdate();
      }
      
      if(worldStore.state.currTab != 'ALL_BETS'){
    this.forceUpdate();
      }
      
  },
  componentDidMount: function() {
    worldStore.on('change', this._onStoreChange);
  },
  componentWillUnmount: function() {
    worldStore.off('change', this._onStoreChange);
  },
  render: function() {
    switch(worldStore.state.currTab) {
       case 'ALL_BETS':
            
        document.getElementById('abbutton').style.backgroundColor = 'rgb(122, 191, 122)';
                   document.getElementById('fbutton').style.backgroundColor = ' #3BA666';
                document.getElementById('mbbutton').style.backgroundColor = ' #3BA666';
         return React.createElement(AllBetsTabContent, null);
        
        
        case 'FAUCET':
        toggle = true;
              document.getElementById('fbutton').style.backgroundColor = 'rgb(122, 191, 122)';
                   document.getElementById('mbbutton').style.backgroundColor = ' #3BA666';
                document.getElementById('abbutton').style.backgroundColor = ' #3BA666';
        return React.createElement(FaucetTabContent, null);
      case 'MY_BETS':
         toggle = true;
              document.getElementById('mbbutton').style.backgroundColor = 'rgb(122, 191, 122)';
                document.getElementById('fbutton').style.backgroundColor = ' #3BA666';
                document.getElementById('abbutton').style.backgroundColor = ' #3BA666';
        return React.createElement(MyBetsTabContent, null);
      
      default:
        alert('Unsupported currTab value: ', worldStore.state.currTab);
        break;
    }
  }
});

var Footer = React.createClass({
  displayName: 'Footer',
  render: function() {
    return el.div(
      {
        className: 'text-center text-muted',
        style: {
          marginTop: '200px'
         
        }
        
      },
      
     
      'Powered by ',
      
      
      el.a(
        {
          href: 'https://www.moneypot.com'
        },
        'Moneypot'
      )
    );
  }
});


// If not accessToken,
// If accessToken, then
if (!worldStore.state.accessToken) {
  Dispatcher.sendAction('STOP_LOADING');
  connectToChatServer();
} else {
  // Load user from accessToken
  MoneyPot.getTokenInfo({
    success: function(data) {
      console.log('Successfully loaded user from tokens endpoint', data);
      var user = data.auth.user;
      Dispatcher.sendAction('USER_LOGIN', user);
    },
    error: function(err) {
      console.log('Error:', err);
    },
    complete: function() {
      Dispatcher.sendAction('STOP_LOADING');
      connectToChatServer();
    }
  });
  // Get next bet hash
  MoneyPot.generateBetHash({
    success: function(data) {
      Dispatcher.sendAction('SET_NEXT_HASH', data.hash);
    }
  });
}

////////////////////////////////////////////////////////////
// Hook up to chat server

function connectToChatServer() {
  console.log('Connecting to chat server. AccessToken:',
              worldStore.state.accessToken);

  socket = io(config.chat_uri);

  socket.on('connect', function() {
    console.log('[socket] Connected');

    socket.on('disconnect', function() {
      console.log('[socket] Disconnected');
    });

    socket.on('system_message', function(text) {
      console.log('[socket] Received system message:', text);
      Dispatcher.sendAction('NEW_SYSTEM_MESSAGE', text);
    });

    // message is { text: String, user: { role: String, uname: String} }
    socket.on('new_message', function(message) {
      console.log('[socket] Received chat message:', message);
      Dispatcher.sendAction('NEW_MESSAGE', message);
    });

    socket.on('user_muted', function(data) {
      console.log('[socket] User muted:', data);
    });

    socket.on('user_unmuted', function(data) {
      console.log('[socket] User unmuted:', data);
    });

    socket.on('user_joined', function(user) {
      console.log('[socket] User joined:', user);
      Dispatcher.sendAction('USER_JOINED', user);
    });

    socket.on('user_left', function(user) {
      console.log('[socket] User left:', user);
      Dispatcher.sendAction('USER_LEFT', user);
    });

    // Received when your client doesn't comply with chat-server api
    socket.on('client_error', function(text) {
      console.warn('[socket] Client error:', text);
    });

    // Once we connect to chat server, we send an auth message to join
    // this app's lobby channel.

    // A hash of the current user's accessToken is only sent if you have one
    var hashedToken;
    if (worldStore.state.accessToken) {
      hashedToken =  CryptoJS.SHA256(worldStore.state.accessToken).toString();
    }
    var authPayload = { app_id: config.app_id, hashed_token: hashedToken};
    socket.emit('auth', authPayload, function(err, data) {
      if (err) {
        console.log('[socket] Auth failure:', err);
        return;
      }
      console.log('[socket] Auth success:', data);
      Dispatcher.sendAction('INIT_CHAT', data);
    });
  });
}

// This function is passed to the recaptcha.js script and called when
// the script loads and exposes the window.grecaptcha object. We pass it
// as a prop into the faucet component so that the faucet can update when
// when grecaptcha is loaded.
function onRecaptchaLoad() {
  Dispatcher.sendAction('GRECAPTCHA_LOADED', grecaptcha);
}

$(document).on('keydown', function(e) {
  var H = 72, L = 76, C = 67, X = 88, V=86, keyCode = e.which;

  // Bail is hotkeys aren't currently enabled to prevent accidental bets
  if (!worldStore.state.hotkeysEnabled) {
    return;
  }

  // Bail if it's not a key we care about
  if (keyCode !== H && keyCode !== L && keyCode !== X && keyCode !== C && keyCode !== V) {
    return;
  }

  // TODO: Remind self which one I need and what they do ^_^;;
  e.stopPropagation();
  e.preventDefault();

  switch(keyCode) {
    case C:  // Increase wager
      var upWager = betStore.state.wager.num * 2;
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: upWager,
        str: upWager.toString()
      });
      break;
    case X:  // Decrease wager
      var downWager = Math.floor(betStore.state.wager.num / 2);
      Dispatcher.sendAction('UPDATE_WAGER', {
        num: downWager,
        str: downWager.toString()
          
      });
           break;
     case V:  // Decrease wager
      var maxWager = Math.floor(worldStore.state.user.balance / 100);

          
          Dispatcher.sendAction('UPDATE_WAGER', {
        num: maxWager,
        str: maxWager.toString()
      });

      break;
    case L:  // Bet lo
      $('#bet-lo').click();
      break;
    case H:  // Bet hi
      $('#bet-hi').click();
      break;
    default:
      return;
  }
});

window.addEventListener('message', function(event) {
  if (event.origin === config.mp_browser_uri && event.data === 'UPDATE_BALANCE') {
    Dispatcher.sendAction('START_REFRESHING_USER');
  }
}, false);


var OutcomeStats = React.createClass({
    displayName: 'OutcomeStats',
    render: function() {
    return el.div(
    {className: 'OCcontainer'}, 
        el.h2({id:'outcomeanim', style:{ 'marginTop':'40px', 'font-size':'100px' }},'--')
    
    );
  }
});

var App = React.createClass({
  displayName: 'App',
  render: function() {
    return el.div(
      {className: 'container'},
      // Navbar
      React.createElement(Navbar, null),
      // BetBox & ChatBox
      el.div(
        {className: 'row'},
        el.div(
          {className: 'col-sm-5'},
          React.createElement(BetBox, null)
        ),
        el.div(
          {className: 'col-sm-7'},
          React.createElement(ChatBox, null)
        )
      ),
      // Tabs
      el.div(
        {style: {marginTop: '15px'}},
        React.createElement(Tabs, null)
      ),
      // Tab Contents
      React.createElement(TabContent, null),
      // Footer
      React.createElement(Footer, null)
    );
  }
});
/*
 $('html').addClass('hidden');
        $(document).ready(function() {
        $('html').show();  // EDIT: Can also use $('html').removeClass('hidden'); 
        }); 
*/

React.render(
React.createElement(Navbar, null),
  document.getElementById('userBox')
);

/*
React.render(
React.createElement(BetBoxWager, null),
  document.getElementById('betboxwager')
);

React.render(
React.createElement(BetBoxMultiplier, null),
  document.getElementById('betboxmultiplier')
);

React.render(
React.createElement(BetBoxButton, null),
  document.getElementById('betboxbutton')
);

React.render(
React.createElement(HotkeyToggle, null),
  document.getElementById('hotkeyToggle')
);

React.render(
React.createElement(ChatBox, null),
  document.getElementById('chatbox')
);

React.render(
React.createElement(Tabs, null),
  document.getElementById('table')
);


React.render(
React.createElement(TabContent, null),
  document.getElementById('tablecontent')
);




/*

React.render(
React.createElement(ChatBox, null),
  document.getElementById('chatbox')
);*/





var takeProfitMultiplier;         //set the value in %. Stop after winning a percentage of initial balance size.
var stopLossMultiplier;            //set the value in %. Stop after losing a percentage of initial balance size.
var initialBetSize;                 //initial bet size in bits.
var multiWagerOnLoss;               //multiply previous bet size by how many times on loss.
var maxMultiplierOnLossTimes;       //set the frequency for how many times to multiply by factor above on loss.
var multiWagerOnWin;                //multiply previous bet size by how many times on win.
var maxMultiplierOnWinTimes;        //set the frequency for how many times to multiply by factor above on win.
var resetToInitialOnLossStreak;    //reset to initial bet size after exceeding this loss streak.
var resetToInitialOnWinStreak;      //reset to initial bet size after exceeding this win streak.
var betMode;                   //1 = high only, 2 = low only, 3 = alternate hi-lo.

var wager = 0;
var initialBal;
var maxMultiLoss;
var maxMultiWin;

var prevBetStats = new CBuffer(1);


var prevWagerSize = 0;
var autoBetLoop;
var toggleHi = 0;
var winStreak;
var loseStreak;


var autoBet = function(){
//config
prevBetStats = new CBuffer(1);   
initialBal = worldStore.state.user.balance;
takeProfitMultiplier =  parseFloat(document.getElementById('maxTP').value);        
stopLossMultiplier =  parseFloat(document.getElementById('maxSL').value);            
initialBetSize =  parseFloat(document.getElementById('betSize').value);                
multiWagerOnLoss =  parseFloat(document.getElementById('xLoss').value);              
maxMultiplierOnLossTimes =  parseFloat(document.getElementById('fLoss').value);      
multiWagerOnWin =  parseFloat(document.getElementById('xWin').value);                
maxMultiplierOnWinTimes =  parseFloat(document.getElementById('fWin').value);       
resetToInitialOnLossStreak =  parseFloat(document.getElementById('sLoss').value);     
resetToInitialOnWinStreak =  parseFloat(document.getElementById('sWin').value);      
betMode = parseFloat(document.getElementById('betMode').value);                   
maxMultiLoss = maxMultiplierOnLossTimes;
maxMultiWin = maxMultiplierOnWinTimes;
winStreak=0;
loseStreak=0;

var takeProfit = initialBal * (takeProfitMultiplier/100);
var stopLoss = initialBal * (stopLossMultiplier/100);

    
autoBetLoop = setInterval(function(){clicknow(initialBal, takeProfit,stopLoss)},100);

};




var clicknow = function(initialBal, takeProfit,stopLoss){


    


    
if(worldStore.state.user.balance > takeProfit|| worldStore.state.user.balance < stopLoss){
//initialBal = worldStore.state.user.balance;
clearInterval(autoBetLoop);

alert('profit = ' + (worldStore.state.user.balance - initialBal)/100 + ' bits');
    
}
else{
    
if(document.getElementById('bet-lo') != null){
 
if(document.getElementById('bet-lo').disabled == false){

    
if(prevBetStats.last() == null){
wager = initialBetSize;
}
    
else{


    
if(prevBetStats.last().profit < 0 ){
maxMultiWin = maxMultiplierOnWinTimes;
if(maxMultiLoss != 0){    
wager = prevWagerSize * multiWagerOnLoss;
maxMultiLoss = maxMultiLoss - 1;

}
    
else{
wager = prevWagerSize;  

};
loseStreak++;
winStreak = 0;
};

if(prevBetStats.last().profit > 0 ){
maxMultiLoss = maxMultiplierOnLossTimes;
if(maxMultiWin != 0){    
wager = prevWagerSize * multiWagerOnWin;
maxMultiWin = maxMultiWin -1;
}else{
wager = prevWagerSize;

};
winStreak++;
loseStreak = 0;
};
};
    


    
if(winStreak > resetToInitialOnWinStreak){
wager = initialBetSize;
maxMultiLoss = maxMultiplierOnLossTimes;
maxMultiWin = maxMultiplierOnWinTimes;
};
    
    
if(loseStreak > resetToInitialOnLossStreak){
wager = initialBetSize;
maxMultiLoss = maxMultiplierOnLossTimes;
maxMultiWin = maxMultiplierOnWinTimes;
};

    
if(wager>worldStore.state.user.balance){
wager = worldStore.state.user.balance;
};
    
    prevWagerSize = wager;


    
    
    
//var wager = (Math.random()*0.25*(worldStore.state.user.balance/100)).toFixed(2);
//var wager = (Math.random()*0.05*(initialBal/100)).toFixed(2);
//var multi =  2 + parseFloat((1*Math.random()).toFixed(2));
//var multi =  1.9;



Dispatcher.sendAction('UPDATE_WAGER', {
            str: wager
          });
/*
document.getElementById('betboxmultiplier').children[0].children[1].value = multi;
Dispatcher.sendAction('UPDATE_MULTIPLIER', {
        num: multi,
        error: null
      });
      */
    
if(betMode == 1){
document.getElementById('bet-hi').click();  

};
if(betMode == 2){
    
document.getElementById('bet-lo').click();  

};
    
if(betMode == 3){

    
if(toggleHi == 0){
document.getElementById('bet-lo').click();  

};

if(toggleHi == 1){
document.getElementById('bet-hi').click();  
};    
  
};

    toggleHi++;
    if(toggleHi == 2){
    toggleHi = 0;
    };
    
    
}else{
};
}
    else{
clearInterval(autoBetLoop);

alert('profit = ' + (worldStore.state.user.balance - initialBal)/100 + ' bits');
    
    
    };
};

}



function animateRoll(target, profit){
document.getElementById("outcome").innerHTML = parseInt(Math.random() * 36);
var duration = 1;
var countLoop;
var startCount = setInterval(function(){ 
duration = duration +5;
if(duration > 149){
  duration = 149;
}  
clearInterval(countLoop);
countLoop = setInterval(countup, duration);
if(duration > 148 && parseInt(document.getElementById("outcome").innerHTML) == target){
clearInterval(countLoop);
clearInterval(startCount);
    
document.getElementById('bet-button').disabled = false;
            Dispatcher.sendAction('UPDATE_USER', {
            balance: worldStore.state.user.balance + profit
          }); 
    
    document.getElementById('bet-profit').innerHTML = profit/100 + " bits";
        if(profit > 0){
         document.getElementById('bet-profit').style.color = "green";
        }
        if(profit <0){
        document.getElementById('bet-profit').style.color = "red";
        }
    
    
    
}
  
}, 150);
};


function countup(){
  var outcome = parseInt(document.getElementById("outcome").innerHTML);
  outcome++;
  if(outcome > 36){
    outcome = 0;
  }
    
  document.getElementById("outcome").innerHTML = outcome;
document.getElementById("outcome").style.backgroundColor = "black";
  switch(outcome){
      case 0:
          document.getElementById("outcome").style.backgroundColor = "#009901";
          break;
    case 1:
    case 3:
    case 5:
    case 6:
    case 9:
    case 12:
    case 14:
    case 16:
    case 18:
    case 19:
    case 21:
    case 23:
    case 25:
    case 27:
    case 30:
    case 32:
    case 34:
    case 36:
           document.getElementById("outcome").style.backgroundColor = "#a90329";
          break;
  }
    
}
