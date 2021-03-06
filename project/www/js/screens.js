let homepage_screen = 1;
let registration_screen = 2;
let game_screan_catch = 3;
let game_screan_hide = 4;

let current_screen = 1;

document.addEventListener('backbutton', onBackKeyDown, false);

function onBackKeyDown() {
    if (current_screen != homepage_screen){
        if (current_screen == game_screan_catch || current_screen == game_screan_hide){
            document.getElementById('backpack').style.visibility = "hidden";
            socket.emit('playerQuit', playerName);
        }
        timerQuit();
        current_screen = homepage_screen;
        loadScreen();
    } else {
        navigator.app.exitApp();
    }
}

// Go to registration page
function startButton(){
    current_screen = registration_screen;
    loadScreen();
}

function submitButton(){
    var result = getRegistrationInfo();
    if (result != null){
        if (result['toChase']){
            current_screen = game_screan_catch; 
            
        } else {
            current_screen = game_screan_hide;
        }
        loadScreen(result);
    }
}

function exitButton(){
    document.getElementById('backpack').style.visibility = "hidden";
    socket.emit('playerQuit', playerName);
    current_screen = homepage_screen;
    timerQuit();
    // on click: delete from players (server + client)
    loadScreen();
}

function loadScreen(this_player){
    if (current_screen == homepage_screen){
        document.getElementById('homepage').style.visibility = "visible";
        document.getElementById('registration-page').style.visibility = "hidden";
        document.getElementById('gameroom-page').style.visibility = "hidden";
        document.getElementById('backpack').style.visibility = "hidden";
    } else if(current_screen == registration_screen){
        document.getElementById('homepage').style.visibility = "hidden";
        document.getElementById('registration-page').style.visibility = "visible";
        document.getElementById('gameroom-page').style.visibility = "hidden";
        document.getElementById('backpack').style.visibility = "hidden";
    } else if(current_screen == game_screan_catch){
        document.getElementById('homepage').style.visibility = "hidden";
        document.getElementById('registration-page').style.visibility = "hidden";
        document.getElementById('gameroom-page').style.visibility = "visible";
        document.getElementById('catch-button').style.display = "flex";
        document.getElementById('status-check').style.display = "none";
        document.getElementById('level').innerHTML = "Level " + this_player['level'];
    } else if(current_screen == game_screan_hide){
        document.getElementById('homepage').style.visibility = "hidden";
        document.getElementById('registration-page').style.visibility = "hidden";
        document.getElementById('gameroom-page').style.visibility = "visible";
        document.getElementById('catch-button').style.display = "none";
        document.getElementById('status-check').style.display = "flex";
        document.getElementById('level').innerHTML = "Level " + this_player['level'];
        timerHideLevel1Start();
    }
}