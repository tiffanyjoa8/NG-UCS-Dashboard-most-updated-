//USE THIS TO BUILD FINAL(??) PRODUCT!!!
//HTML FILE I'M USING/FOR THE APP.USE IS IN DOWNLOADS -> PUBLIC -> UCSDASHBOARD.HTML

const express = require('express');
const app = express();
const port = 4000;

// var http = require ('http').createServer(app);
// var io = require ('socket.io')(http);

app.get('/', function(req, res){

 res.send('Hello World! UCS Dashboard ><><><');
});

//when go to localhost:4000/ bring up the page with the socket chat
// app.get('/', function (req, res){
//     res.sendFile(__dirname + '/socketindex.html');
// });

// io.on('connection', function(socket){
//     console.log('a user connected')
//     socket.on('disconnect', function()
//     {
//         console.log('a user disconnected');
//     });
// });


// io.emit('some event', {for: 'everyone'});

// io.on('connection', function(socket){
//     socket.on('chat message', function(msg){
//         io.emit('chat message', msg);
//     });
// });

// http.listen(3000, function(){
//     console.log('listening to 3000');
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//ALTERNATE NOTATION FOR GET AND LISTEN FUNCTIONS ABOVE
// app.get('/', function(req, res) {
//     res.send('Hello World!');
//   });
//   app.listen(3000, function() {
//     console.log('Example app listening on port 3000!');
//   });




//go to http://localhost:4000/ucsdashboard.html
app.use(express.static(__dirname + '/public'));






app.listen(process.env.PORT || 3000)

//------------------------------------------------------------------------------------------

//STREAMDECK COMMANDS:
const path = require('path')
const{openStreamDeck} = require('elgato-stream-deck')

const myStreamDeck = openStreamDeck()

    //if stmdk key goes down, console log that key # down
    myStreamDeck.on('down', keyIndex => 
    {
        //IF PRESS DOWN KEY #2, THEN CHANGE KEY #14 TO GREEN
        if (keyIndex == 2)
        {
        //change key #14 to green
        myStreamDeck.fillColor(14, 0, 255, 0)
        console.log('Successfully wrote a green square to key 14')
        }

        //console log that key went down //%d is fixed decimal like matlab notation??
        console.log('key %d down', keyIndex)
    })

    //if stmdk key goes up, console log that key # up
    myStreamDeck.on('up', keyIndex => {
        console.log('key %d up', keyIndex)
        myStreamDeck.clearKey(14)
    })

myStreamDeck.on('error', error => {
    console.error(error)
})

//TURNS KEY #4 RED
myStreamDeck.fillColor(4, 255, 0,0)
console.log('Successfully wrote a red square to key 4')

//------------------------------------------------------------------------------------------


//FIRST ATTEMPT TO OPEN THE NODE (the combo function)
myStreamDeck.on('down', keyIndex => 
{
    // server.send({keyIndex: 7});
    if (keyIndex == 7)
    {
        function click(d) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            update(d);
          }
    }
    console.log('key %d down', keyIndex)
})

