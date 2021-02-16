// const { find } = require('../platforms/ios/www/cordova_plugins');

var http = require('http').createServer();
var io=require('socket.io')(http);


http.listen(3000, () => {
    console.log("server started");
});

var players = [];
var playersUsingRocket = [];


io.sockets.on('connection',function(socket){
    console.log('one player connected'); // server side
    socket.on('requestPlayers', () => {
        socket.emit('players', players);
    });

    socket.on('newPlayer', (data) => {
        players.push(data);
        io.emit('createNewPlayer', players);
    });

    socket.on('goDown', (name)=>{
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        if (playersUsingRocket.includes(name)){
            if (players[index]['location_y'] <= 80){
                players[index]['location_y'] += 10;
            } else {
                players[index]['location_y'] = 90;
            }
            io.emit('goDownRocket', name);
        } else {
            if (players[index]['location_y'] <= 85){
                players[index]['location_y'] += 5;
            } else {
                players[index]['location_y'] = 90;
            }
            io.emit('goDown', name);
        }
    });

    socket.on('goUp', (name)=>{
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        if (playersUsingRocket.includes(name)){
            if (players[index]['location_y'] >= 10){
                players[index]['location_y'] -= 10;
            } else {
                players[index]['location_y'] = 0;
            }
            io.emit('goUpRocket', name);
        } else {
            if (players[index]['location_y'] >= 5){
                players[index]['location_y'] -= 5;
            } else {
                players[index]['location_y'] = 0;
            }
            io.emit('goUp', name);
        }
    });

    socket.on('goLeft', (name)=>{
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        if (playersUsingRocket.includes(name)){
            if (players[index]['location_x'] >= 10){
                players[index]['location_x'] -= 10;
            } else {
                players[index]['location_x'] = 0;
            }
            io.emit('goLeftRocket', name);
        } else {
            if (players[index]['location_x'] >= 5){
                players[index]['location_x'] -= 5;
            } else {
                players[index]['location_x'] = 0;
            }
            io.emit('goLeft', name);
        }
    });
    socket.on('goRight', (name)=>{
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        if (playersUsingRocket.includes(name)){
            if (players[index]['location_x'] <= 80){
                players[index]['location_x'] += 10;
            } else {
                players[index]['location_x'] = 90;
            }
            io.emit('goRightRocket', name);
        } else {
            if (players[index]['location_x'] <= 85){
                players[index]['location_x'] += 5;
            } else {
                players[index]['location_x'] = 90;
            }
            io.emit('goRight', name);
        }
    });

    socket.on('caught', (name)=>{
        // inform other players to update players list
        io.emit('playerCaught', name);
        console.log('caught');
    });

    socket.on('playerQuit', (name) => {
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        players.splice(index, 1);
        io.emit('playerQuit', name);
    });

    socket.on('updatePlayer', (player) => {
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == player['name']){
                index = i;
                break;
            }
        }
        players[index] = player;
        socket.broadcast.emit('updatePlayer', player);
    });

    socket.on('useIceCube', (name) => {
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        players[index]['iceCube'] -= 1;
        socket.broadcast.emit('updatePlayer', players[index]);
    });

    socket.on('paralysePlayer', (data) => {
        io.emit('paralysePlayer', data);
    });

    socket.on('unfrozen', (data) => {
        io.emit('unfrozen', data);
    });

    socket.on('useShields', (name) => {
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        players[index]['shields'] -= 1;
        socket.broadcast.emit('useShields', players[index]);
    });

    socket.on('useRocket', (name) => {
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        players[index]['rocket'] -= 1;
        playersUsingRocket.push(name);
        socket.broadcast.emit('updatePlayer', players[index]);
    });

    socket.on('rocketStop', (name) => {
        for (let i = 0; i < playersUsingRocket.length; i++){
            if (playersUsingRocket[i] == name){
                playersUsingRocket.splice(i, 1);
                break;
            }
        }
    });

    socket.on('useCloak', (name) => {
        let index = 0;
        for (let i = 0; i < players.length; i++){
            if (players[i]['name'] == name){
                index = i;
                break;
            }
        }
        players[index]['invisibilityCloak'] -= 1;
        socket.broadcast.emit('invisible', name);
    });

    socket.on('invisibilityStop', (name) => {
        io.emit('invisibilityStop', name);
    });
});

io.sockets.on('disconnection', function(){
    console.log('player logged out')
});