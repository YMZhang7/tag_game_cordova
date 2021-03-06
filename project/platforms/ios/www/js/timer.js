let no_timer = 1;
let one_minute_timer = 2;
let two_minutes_timer = 3;
let three_minutes_timer = 4;
let rocket_timer = 5;
let one_minute_and_frozen = 6;
let two_minute_and_frozen = 7;
let three_minute_and_frozen = 8;
let three_minute_and_frozen_and_invisible = 9;
let three_minute_and_invisible = 10;

let current_timer = no_timer;

var levelUpTime = 60;
const second = rxjs.interval(1000);
var levelUpTimer;

var timerSubscription;
var frozenSubscription;
var invisibilitySubscription;
var rocketSubscription;

function timerHideLevel1Start(){
    switch(current_timer){
        case no_timer:
        {
            current_timer = one_minute_timer;
            // create time bar
            const time = document.createElement("div");
            time.id = "time";
            time.classList.add('time');
            document.getElementById('bar').appendChild(time);
            // set subscription
            levelUpTime = 60;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == levelUpTime-1){
                        alert('level up!');
                        upgradeToLevel2(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                    }
                },
            );
            break;
        }
    }
}

function timerHideLevelUp(){
    switch(current_timer){
        case one_minute_timer:
        {
            current_timer = two_minutes_timer;
            // set subscription
            levelUpTime = 120;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == levelUpTime-1){
                        alert('level up!');
                        upgradeToLevel2(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                    }
                },
            );
            break;
        }
        case two_minutes_timer:
        {
            current_timer = three_minutes_timer;
            // set subscription
            levelUpTime = 180;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == (levelUpTime - 1)){
                        // alert("You've gained 2 more invisibility cloaks!");
                        // players[getIndex(playerName)]['invisibilityCloak'] += 2;
                        // document.getElementById('tools').innerHTML = "Invisibility cloak: " + players[getIndex(playerName)]['invisibilityCloak'];
                        upgradeToLevel3(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                        // level3Timer();
                        // timerHideLevelUp();
                    }
                },
            );
            break;
        }
        case three_minutes_timer:
        case three_minute_and_frozen:
        case three_minute_and_frozen_and_invisible:
        case three_minute_and_invisible:
        {
            // set subscription
            levelUpTime = 180;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == (levelUpTime - 1)){
                        alert("You've gained 2 more invisibility cloaks!");
                        players[getIndex(playerName)]['invisibilityCloak'] += 2;
                        document.getElementById('tools').innerHTML = "Invisibility cloak: " + players[getIndex(playerName)]['invisibilityCloak'];
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                        // level3Timer();
                        timerHideLevelUp();
                    }
                },
            );
            break;
        }
        case one_minute_and_frozen:
        {
            current_timer = two_minute_and_frozen;
            // set subscription
            levelUpTime = 120;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == levelUpTime-1){
                        alert('level up!');
                        upgradeToLevel3(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                    }
                },
            );
            break;
        }
        case two_minute_and_frozen:
        {
            current_timer = three_minute_and_frozen;
            // set subscription
            levelUpTime = 180;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == (levelUpTime - 1)){
                        // alert("You've gained 2 more invisibility cloaks!");
                        // players[getIndex(playerName)]['invisibilityCloak'] += 2;
                        // document.getElementById('tools').innerHTML = "Invisibility cloak: " + players[getIndex(playerName)]['invisibilityCloak'];
                        upgradeToLevel3(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                        timerHideLevelUp();
                    }
                },
            );
            break;
        }
    }
}

function timerCaught(){
    switch(current_timer){
        case one_minute_timer:
        case one_minute_and_frozen:
        {
            // set subscription
            levelUpTime = 60;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription.unsubscribe();
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == levelUpTime-1){
                        alert('level up!');
                        upgradeToLevel2(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                    }
                },
            );
            break;
        }
        case two_minutes_timer:
        case two_minute_and_frozen:
        {
            // set subscription
            levelUpTime = 120;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription.unsubscribe();
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == levelUpTime-1){
                        alert('level up!');
                        upgradeToLevel3(getIndex(playerName));
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                    }
                },
            );
            break;
        }
        case three_minutes_timer:
        case three_minute_and_frozen:
        case three_minute_and_frozen_and_invisible:
        case three_minute_and_frozen_and_invisible:
        {
            // set subscription
            levelUpTime = 180;
            levelUpTimer = second.pipe(rxjs.operators.take(levelUpTime));
            timerSubscription.unsubscribe();
            timerSubscription = levelUpTimer.subscribe(
                (sec) => {
                    var newWidth = 100 * (levelUpTime - sec - 1) / levelUpTime;
                    document.getElementById('time').style.width = newWidth + "%";
                    if (sec == levelUpTime-1){
                        alert("You've gained 2 more invisibility cloaks!");
                        players[getIndex(playerName)]['invisibilityCloak'] += 2;
                        document.getElementById('tools').innerHTML = "Invisibility cloak: " + players[getIndex(playerName)]['invisibilityCloak'];
                        socket.emit('updatePlayer', players[getIndex(playerName)]);
                        // level3Timer();
                        timerHideLevelUp();
                    }
                },
            );
            break;
        }
    }
}

function timerQuit(){

    switch(current_timer){
        case rocket_timer:
        {
            rocketSubscription.unsubscribe();
            document.getElementById('rocketTime').remove();
            current_timer = no_timer;
            break;
        }
        case one_minute_and_frozen:
        {
            current_timer = no_timer;
            frozenSubscription.unsubscribe();
            timerSubscription.unsubscribe();
            document.getElementById('time').remove();
            break;
        }
        case two_minute_and_frozen:
        {
            current_timer = no_timer;
            frozenSubscription.unsubscribe();
            timerSubscription.unsubscribe();
            document.getElementById('time').remove();
            break;
        }
        case three_minute_and_frozen:
        {
            current_timer = no_timer;
            frozenSubscription.unsubscribe();
            timerSubscription.unsubscribe();
            document.getElementById('time').remove();
            break;
        }
        case three_minute_and_invisible:
        {
            current_timer = no_timer;
            timerSubscription.unsubscribe();
            document.getElementById('time').remove();
            break;
            invisibilitySubscription.unsubscribe();
        }
        case three_minute_and_frozen_and_invisible:
        {
            current_timer = no_timer;
            frozenSubscription.unsubscribe();
            timerSubscription.unsubscribe();
            document.getElementById('time').remove();
            invisibilitySubscription.unsubscribe();
            break;
        }
        case one_minute_timer:
        case two_minutes_timer:
        case three_minutes_timer:
        {
            current_timer = no_timer;
            timerSubscription.unsubscribe();
            document.getElementById('time').remove();
        }
    }
}

function timerRocketStart(){
    switch(current_timer){
        case no_timer:
        {
            current_timer = rocket_timer;
            if (document.getElementById('rocketTime') == null){
                const rocketTime = document.createElement("div");
                rocketTime.id = "rocketTime";
                rocketTime.classList.add('time');
                document.getElementById('bar').appendChild(rocketTime);
            } else {
                document.getElementById('rocketTime').style.width = "100%";
            }
            var rocketSeconds = 10;
            rocketSubscription = rxjs.interval(1000).pipe(rxjs.operators.take(rocketSeconds)).subscribe(
                (sec) => {
                    var newWidth = 100 * (10 - sec - 1) / 10;
                    document.getElementById('rocketTime').style.width = newWidth + "%";
                    if (sec == 9){
                        alert('rocket times up');
                        socket.emit('rocketStop', playerName);
                        current_timer = no_timer;
                    }
                },
            );
        }
    }
}

function timerFrozenStart(){
    switch(current_timer){
        case one_minute_timer:
        {
            current_timer = one_minute_and_frozen;
            frozenSubscription = rxjs.interval(1000).pipe(rxjs.operators.take(10)).subscribe(
                (sec) => {
                    var newWidth = 100 * (10 - sec - 1) / 10;
                    document.getElementById('paralysedTime').style.width = newWidth + "%";
                    if (sec == 9){
                        socket.emit('unfrozen', players[getIndex(playerName)]);
                        // current_timer = one_minute_timer;
                        frozenTimeUp();
                    }
                }
            );
            break;
        }
        case two_minutes_timer:
        {
            current_timer = two_minute_and_frozen;
            frozenSubscription = rxjs.interval(1000).pipe(rxjs.operators.take(10)).subscribe(
                (sec) => {
                    var newWidth = 100 * (10 - sec - 1) / 10;
                    document.getElementById('paralysedTime').style.width = newWidth + "%";
                    if (sec == 9){
                        socket.emit('unfrozen', players[getIndex(playerName)]);
                        frozenTimeUp();
                    }
                }
            );
            break;
        }
        case three_minutes_timer:
        {
            current_timer = three_minute_and_frozen;
            frozenSubscription = rxjs.interval(1000).pipe(rxjs.operators.take(10)).subscribe(
                (sec) => {
                    var newWidth = 100 * (10 - sec - 1) / 10;
                    document.getElementById('paralysedTime').style.width = newWidth + "%";
                    if (sec == 9){
                        socket.emit('unfrozen', players[getIndex(playerName)]);
                        // current_timer = three_minute_and_frozen;
                        frozenTimeUp();
                    }
                }
            );
            break;
        }
        case three_minute_and_invisible:
        {
            current_timer = three_minute_and_frozen_and_invisible;
            frozenSubscription = rxjs.interval(1000).pipe(rxjs.operators.take(10)).subscribe(
                (sec) => {
                    var newWidth = 100 * (10 - sec - 1) / 10;
                    document.getElementById('paralysedTime').style.width = newWidth + "%";
                    if (sec == 9){
                        socket.emit('unfrozen', players[getIndex(playerName)]);
                        frozenTimeUp();
                    }
                }
            );
            break;
        }
    }
}

function timerInvisibleStart(){
    switch(current_timer){
        case three_minutes_timer:
        {
            current_timer = three_minute_and_invisible;
            var invisibleSeconds = 10;
            invisibilitySubscription = rxjs.interval(1000).pipe(rxjs.operators.take(invisibleSeconds)).subscribe(
                (sec) => {
                    if (sec == 9){
                        alert('times up');
                        socket.emit('invisibilityStop', playerName);
                        // current_timer = three_minutes_timer;
                        invisibilityTimeUp();
                    }
                },
            );
            break;
        }
        case three_minute_and_frozen:
        {
            current_timer = three_minute_and_frozen_and_invisible;
            var invisibleSeconds = 10;
            invisibilitySubscription = rxjs.interval(1000).pipe(rxjs.operators.take(invisibleSeconds)).subscribe(
                (sec) => {
                    if (sec == 9){
                        alert('times up');
                        socket.emit('invisibilityStop', playerName);
                        // current_timer = three_minute_and_frozen;
                        // if (frozenSubscription.isStopped){
                        //     current_timer = three_minutes_timer;
                        // } else {
                        //     current_timer = three_minute_and_frozen;
                        // }
                        invisibilityTimeUp();
                    }
                },
            );
            break;
        }
    }
}

function invisibilityTimeUp(){
    switch(current_timer){
        case three_minute_and_invisible:
        {
            current_timer = three_minutes_timer;
            break;
        }
        case three_minute_and_frozen_and_invisible:
        {
            current_timer = three_minute_and_frozen;
            break;
        }
    }
}

function frozenTimeUp(){
    switch(current_timer){
        case one_minute_and_frozen:
        {
            current_timer = one_minute_timer;
            break;
        }
        case two_minute_and_frozen:
        {
            current_timer = two_minutes_timer;
            break;
        }
        case three_minute_and_frozen:
        {
            current_timer = three_minutes_timer;
            break;
        }
        case three_minute_and_frozen_and_invisible:
        {
            current_timer = three_minute_and_invisible;
            break;
        }
    }
}