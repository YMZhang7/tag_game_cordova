let players = []; // retrieve from server
let playerName = "";
let playersCaught = 0;
var catchButtonClicked = false;


document.addEventListener('deviceready', onDeviceReady, false);
const start_button = document.getElementById('startButton')
const goUp_button = document.getElementById('up-key');
const goDown_button = document.getElementById('down-key');
const goLeft_button = document.getElementById('left-key');
const goRight_button = document.getElementById('right-key');
const catch_button = document.getElementById('catch-button')

function getIndex(name){
    for (var i = 0; i < players.length; i++){
        if (players[i]['name'] == name){
            return i;
        }
    }
}

rxjs.fromEvent(goDown_button, 'click').subscribe(() => {
    socket.emit('goDown', playerName);
});

rxjs.fromEvent(goUp_button, 'click').subscribe(()=>{
    socket.emit('goUp', playerName);
});

rxjs.fromEvent(goLeft_button, 'click').subscribe(()=>{
    socket.emit('goLeft', playerName);
});

rxjs.fromEvent(goRight_button, 'click').subscribe(()=>{
    socket.emit('goRight', playerName);
});

rxjs.fromEvent(catch_button, 'click').subscribe(() => {
    for (var i = 0; i < players.length; i++){
        if (!players[i]['toChase'] && getIndex(playerName) != i && canCatch(players[i], players[getIndex(playerName)])){
            catchButtonClicked = true;
            socket.emit('caught', players[i]['name']);
        }
    }
});

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    navigator.notification.prompt(
        'Please enter the server address (example: 192.168.0.13)',
        onPrompt,
        'Server Connection',
        ['Ok','Exit']
    );
}

let serverAddress = "";
var socket;

function onPrompt(results){
    if (results.buttonIndex == 1){
        serverAddress = results.input1;
        socket = io.connect("http://" + serverAddress + ":3000");
        // socket = io.connect("http://edcsystem.hopto.org:3000");

        rxjs.fromEvent(socket, 'connect').subscribe(() => {
            console.log('one player joined');
            alert("Connected!");
            socket.emit('requestPlayers');
        });

        rxjs.fromEvent(socket, 'error').subscribe(() => {
            alert("Connection Error!")
            navigator.app.exitApp();
        });

        rxjs.fromEvent(socket, 'disconnect').subscribe(() =>{
            alert('Something went wrong... You are disconnected');
            timerQuit();
            current_screen = homepage_screen;
            loadScreen();
            socket.open();
            socket.emit('playerQuit', playerName);
        });
    
        rxjs.fromEvent(socket, 'players').subscribe((data) => {
            players = data;
        });
    
        rxjs.fromEvent(socket, 'createNewPlayer').subscribe((data)=> {
            // alert('new player joined!');
            for (var i = 0; i < data.length; i++){
                if (document.getElementById(data[i]['name']) == null){
                    createPlayer(data[i]);
                }
            }
            players = data;
        });
    
        rxjs.fromEvent(socket, 'goDown').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_y'] <= 85){
                    players[index]['location_y'] += 5;
                } else {
                    players[index]['location_y'] = 90;
                }
                document.getElementById(name).style.top = players[index]['location_y'] + "%";
                updateCatchAlert();
            }
        });
    
        rxjs.fromEvent(socket, 'goDownRocket').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_y'] <= 80){
                    players[index]['location_y'] += 10;
                } else {
                    players[index]['location_y'] = 90;
                }
                document.getElementById(name).style.top = players[index]['location_y'] + "%";
                updateCatchAlert();
            }
        });
    
        rxjs.fromEvent(socket, 'goUp').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_y'] >= 5){
                    players[index]['location_y'] -= 5;
                } else {
                    players[index]['location_y'] = 0;
                }
                document.getElementById(name).style.top = players[index]['location_y'] + "%";
                updateCatchAlert();
            }
        });
    
        rxjs.fromEvent(socket, 'goUpRocket').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_y'] >= 10){
                    players[index]['location_y'] -= 10;
                } else {
                    players[index]['location_y'] = 0;
                }
                document.getElementById(name).style.top = players[index]['location_y'] + "%";
                updateCatchAlert();
            }
        });
    
        rxjs.fromEvent(socket, 'goLeft').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_x'] >= 5){
                    players[index]['location_x'] -= 5;
                } else {
                    players[index]['location_x'] = 0;
                }
                document.getElementById(name).style.left = players[index]['location_x'] + "%";
                updateCatchAlert();
            }
        });
    
        rxjs.fromEvent(socket, 'goLeftRocket').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_x'] >= 10){
                    players[index]['location_x'] -= 10;
                } else {
                    players[index]['location_x'] = 0;
                }
                document.getElementById(name).style.left = players[index]['location_x'] + "%";
                updateCatchAlert();
            }
        });
    
        rxjs.fromEvent(socket, 'goRight').subscribe((name)=>{ 
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_x'] <= 85){
                    players[index]['location_x'] += 5;
                } else {
                    players[index]['location_x'] = 90;
                }
                document.getElementById(name).style.left = players[index]['location_x'] + "%";
                updateCatchAlert(); 
            }
        });
    
        rxjs.fromEvent(socket, 'goRightRocket').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                let index = getIndex(name);
                if(players[index]['location_x'] <= 80){
                    players[index]['location_x'] += 10;
                } else {
                    players[index]['location_x'] = 90;
                }
                document.getElementById(name).style.left = players[index]['location_x'] + "%";
                updateCatchAlert();
            }
        });
    
        rxjs.fromEvent(socket, 'playerCaught').subscribe((name)=>{
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                if (playerName == name){
                    alert('You are caught!');
                    timerCaught();
                } else if(catchButtonClicked){
                    catchButtonClicked = false;
                    playersCaught++;
                    // level up
                    if (players[getIndex(playerName)]['level'] == 1){
                        alert('Level up!');
                        upgradeToLevel2(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                    } else if(players[getIndex(playerName)]['level'] == 2){
                        if (playersCaught == 2){
                            // level up
                            alert('Level up!');
                            upgradeToLevel3(getIndex(playerName));
                            socket.emit('updatePlayer', players[getIndex(playerName)]);
                        }
                    } else {
                        if (playersCaught == 3){
                            alert("You've gained two more rockets!");
                            players[getIndex(playerName)]['rocket'] += 2;
                            document.getElementById('tools').innerHTML = "Rocket (10s): " + players[getIndex(playerName)]['rocket'];
                            socket.emit('updatePlayer', players[getIndex(playerName)]);
                        }
                    }
                }
            }
        });
    
        rxjs.fromEvent(socket, 'updatePlayer').subscribe(
            (data) => {
                if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                    let index = getIndex(data['name']);
                    players[index] = data;
                    updatePlayerCircle(data['name'], data["level"]);
                }
            }
        );
    
        rxjs.fromEvent(socket, 'playerQuit').subscribe((name) => {
            if (name == playerName){
                for (let i = 0; i < players.length; i++){
                    document.getElementById(players[i]['name']).remove();
                }
                players = [];
            } else {
                players.splice(getIndex(name), 1);
                document.getElementById(name).remove();
            }
        });
    
        rxjs.fromEvent(socket, 'paralysePlayer').subscribe((data) => {
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                if (playerName == data['name']){
                    alert('You are frozen!');
                    document.getElementById('controller').style.display = "none";
                    document.getElementById('paralysed').style.display = "flex";
                    timerFrozenStart();
                }
                players[getIndex(data['name'])] = data;
                document.getElementById(data['name']).style.borderRadius = "0%";
            }
        });
    
        rxjs.fromEvent(socket, 'unfrozen').subscribe((data) => {
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                if (data['name'] == players[getIndex(playerName)]['name']){
                    document.getElementById('paralysed').style.display = "none";
                    document.getElementById('controller').style.display = "grid";
                }
                players[getIndex(data['name'])] = data;
                document.getElementById(data['name']).style.borderRadius = "50%";
            }
        });
    
        rxjs.fromEvent(socket, 'useShields').subscribe((data) => {
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                players[getIndex(data['name'])] = data;
                document.getElementById(data['name']).style.borderRadius = "50%";
            }
        });
    
        rxjs.fromEvent(socket, 'invisible').subscribe((data) => {
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                document.getElementById(data).style.display = "none";
            }
        });
    
        rxjs.fromEvent(socket, 'invisibilityStop').subscribe((name) => {
            if (current_screen == game_screan_catch || current_screen == game_screan_hide){
                if (playerName == name){
                    document.getElementById(name).style.backgroundColor = "rgb(255, 255, 0)";
                } else {
                    document.getElementById(name).style.display = "flex";
                }
            }
        });
    } else {
        navigator.app.exitApp();
    }
}

// Extract info and start the game
function getRegistrationInfo(){
    let this_player = {};
    let name = document.getElementById('nickname').value;
    if (nameUsed(name)){
        alert("This name is invalid. Please choose another one.");
    } else if (name == "") {
        alert("Name cannot be empty!");
    } else {
        this_player['name'] = name;
        playerName = name;
        
        this_player['level'] = 1;
        let toChase;
        if (document.getElementById('chase').checked){
            toChase = true;
            this_player['location_x'] = 0;
            this_player['location_y'] = 0;
        } else {
            toChase = false;
            this_player['location_x'] = 90;
            this_player['location_y'] = 90;
        }
        this_player['toChase'] = toChase;
        
        socket.emit('newPlayer', this_player);
        return this_player;
    }
}

// To create HTML elements for a player
function createPlayer(player){
    // create circle and set content
    const player_circle = document.createElement('div');
    player_circle.id = player['name'];
    const name = document.createTextNode(player['name']);
    player_circle.appendChild(name);
    player_circle.className = "player";
    // set background colour
    if (player['level'] == 1){
        player_circle.style.backgroundColor = "rgb(128, 255, 128)";
    } else if (player['level'] == 2){
        player_circle.style.backgroundColor = "rgb(51, 51, 255)";
        // change font colour
        player_circle.style.color = "white";
    } else {
        player_circle.style.backgroundColor = "rgb(255, 255, 0)";
    }
    // set border
    if (player['toChase']){
        player_circle.style.border = "4px solid orange";
    } 
    player_circle.style.top = player['location_y'] + "%";
    player_circle.style.left = player['location_x'] + "%";
    // add circle to playground
    document.getElementsByClassName('playground')[0].appendChild(player_circle);
}

function upgradeToLevel2(index){
    document.getElementById('backpack').style.visibility = "visible";
    if (players[index]['toChase']){
        players[index]['iceCube'] = 2;
        document.getElementById('tools').innerHTML = "Ice cube (randomly freeze one player): " + players[getIndex(playerName)]['iceCube'];
        playersCaught = 0;
    } else {
        players[index]['shields'] = 2;
        document.getElementById('tools').innerHTML = "Shields (stop being frozen): " + players[getIndex(playerName)]['shields'];
        timerHideLevelUp();
    }
    players[index]['level'] = 2;
    document.getElementById('level').innerHTML = "Level 2";
    updatePlayerCircle(players[index]["name"], 2);
}

function upgradeToLevel3(index){
    if (players[index]['toChase']){
        delete players[index].iceCube;
        players[index]['rocket'] = 2;
        document.getElementById('tools').innerHTML = "Rocket (10s): " + players[index]['rocket'];
        playersCaught = 0;
    } else {
        delete players[index].shields;
        players[index]['invisibilityCloak'] = 2;
        document.getElementById('tools').innerHTML = "Invisibility cloak (10s): " + players[index]['invisibilityCloak'];
        // level3Timer();
        timerHideLevelUp();
    }
    players[index]['level'] = 3;
    document.getElementById('level').innerHTML = "Level 3";
    updatePlayerCircle(players[index]["name"], 3);
}

function canCatch(player1, player2){
    let x1 = player1['location_x'];
    let x2 = player2['location_x'];
    let y1 = player1['location_y'];
    let y2 = player2['location_y'];
    let distance_x = Math.abs(x1 - x2);
    let distance_y = Math.abs(y1 - y2);
    if (distance_x <= 5 && distance_y <= 5){
        return true;
    } else {
        return false;
    }
}

function nameUsed(name){
    for (var i = 0; i < players.length; i++){
        if (players[i]['name'] == name){
            return true;
        }
    }
    return false;
}

function updatePlayerCircle(name, level){
    var player = document.getElementById(name);
    if (level == 2){
        player.style.backgroundColor = "rgb(51, 51, 255)";
        player.style.color = "white";
    } else if(level == 3){
        player.style.backgroundColor = "rgb(255, 255, 0)";
        player.style.color = "black";
    }
}

function randomlySelectHidingPlayer(){
    var list = [];
    for (let i = 0; i < players.length; i++){
        if (!players[i]['toChase']){
            list.push(players[i]);
        }
    }
    let ind = Math.floor(Math.random() * list.length); 
    return list[ind];
}

function useTool(){
    if (players[getIndex(playerName)]['toChase']){
        if (players[getIndex(playerName)]['level'] == 2){
            if (players[getIndex(playerName)]['iceCube'] > 0){
                players[getIndex(playerName)]['iceCube'] -= 1;
                document.getElementById('tools').innerHTML = "Ice cube (randomly freeze one player): " + players[getIndex(playerName)]['iceCube'];
                socket.emit('useIceCube', playerName); // tell server to delete one icecube
                let randomHidngPlayer = randomlySelectHidingPlayer();
                socket.emit('paralysePlayer', randomHidngPlayer);
            }
        } else if (players[getIndex(playerName)]['level'] == 3){
            if (players[getIndex(playerName)]['rocket'] > 0){
                players[getIndex(playerName)]['rocket'] -= 1;
                document.getElementById('tools').innerHTML = "Rocket (10s): " + players[getIndex(playerName)]['rocket'];
                socket.emit('useRocket', playerName);
                timerRocketStart();
            }
        }
    } else {
        if (players[getIndex(playerName)]['level'] == 2){
            if (players[getIndex(playerName)]['shields'] > 0){
                players[getIndex(playerName)]['shields'] -= 1;
                document.getElementById('tools').innerHTML = "Shields (stop being frozen): " + players[getIndex(playerName)]['shields'];
                document.getElementById('paralysed').style.display = "none";
                document.getElementById('controller').style.display = "grid";
                document.getElementById(players[getIndex(playerName)]['name']).style.borderRadius = "50%";
                // document.getElementById('tools').innerHTML = "Shields: " + data['shields'];
                socket.emit('useShields', playerName); // tell server to delete one shield
            }
        } else if (players[getIndex(playerName)]['level'] == 3){
            if (players[getIndex(playerName)]['invisibilityCloak'] > 0){
                players[getIndex(playerName)]['invisibilityCloak'] -= 1;
                document.getElementById('tools').innerHTML = "Invisibility cloak (10s): " + players[getIndex(playerName)]['invisibilityCloak'];
                socket.emit('useCloak', playerName);
                document.getElementById(players[getIndex(playerName)]['name']).style.backgroundColor = "white";
                timerInvisibleStart();
            }
        }
    }
}

function updateCatchAlert(){
    if (players[getIndex(playerName)]['toChase']){
        var catching = false;
        for (let i = 0; i < players.length; i++){
                if (!players[i]['toChase']){
                    if (canCatch(players[i], players[getIndex(playerName)])){
                        catching = true;
                        break;
                    }
                }
        }
        if (catching){
            catch_button.style.backgroundColor = "rgb(113, 218, 113)";
        } else {
            catch_button.style.backgroundColor = "gray";
        }
    } else {
        var danger = false;
        for (let i = 0; i < players.length; i++){
            if (players[i]['toChase']){
                if (canCatch(players[i], players[getIndex(playerName)])){
                    danger = true;
                    break;
                }
            }
        }
        if (danger){
            document.getElementById('status-check').style.backgroundColor = "red";
            document.getElementById('status-check').innerHTML = "danger";
        } else {
            document.getElementById('status-check').style.backgroundColor = "rgb(113, 218, 113)";
            document.getElementById('status-check').innerHTML = "safe";
        }
    }
}