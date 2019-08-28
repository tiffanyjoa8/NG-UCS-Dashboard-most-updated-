//USE THIS TO BUILD FINAL(??) PRODUCT!!!
//HTML FILE I'M USING/FOR THE APP.USE IS IN DOWNLOADS -> PUBLIC -> UCSDASHBOARD.HTML

const express = require('express');
const app = express();
const port = 1419;

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.get('/', function(req, res){

    res.send('Hello World! BASIC UCS Dashboard');
   });

//move chat page stuff to ucsdashboard.html in public folder
app.get('/chat', function(req, res){
 res.sendFile(__dirname + '/basicucsdashboard.html');
});

http.listen(port, function(){
    console.log('listening to 1419');
});

//go to http://localhost:1419/ucsdashboard.html to see d3 dendrogram
app.use(express.static(__dirname + '/public'));



io.on('connection', function(socket){
    console.log('a user connected');
socket.on('disconnect', function(){
    console.log('user disconnected');
});
});

//send out event (chat message) to everyone
io.emit('some event', {for: 'everyone'});


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

        //after press one key, clear all keys
        // myStreamDeck.clearAllKeys()
    })

myStreamDeck.on('error', error => {
    console.error(error)
})

//TURNS KEY #4 RED
myStreamDeck.fillColor(4, 0, 0, 255)
console.log('Successfully wrote a blue square to key 4')


//CODE TO HAVE JS REGISTER THE KEYINDEX, USE SOCKET TO SEND TO HTML, HAVE HTML DISPLAY WHICH STMDK KEY WAS PRESSED 

// //when have connection with port (event)
io.on('connection', function(socket){

    //when have chat message (event with socket)
    socket.on('chat message', function(msg){

        //console log the message
        console.log('message: ' + msg)

        //IF STMDK KEY NOT PRESSED, HAVE CHAT FUNCTION NORMALLY
        io.emit('chat message', msg);

        //IF CHAT MESSAGE ENTERED IS FOUR, TURN KEY #12 TO GREEN
        if (msg == 4)
        {
            myStreamDeck.fillColor(12, 0, 255, 0)
        }

        myStreamDeck.on('down', keyIndex => 
        {
            //IF PRESS DOWN KEY #2, THEN CHANGE KEY #14 TO GREEN
            if (keyIndex == 2)
            {
            //change key #14 to green
            myStreamDeck.fillColor(14, 0, 255, 0)
            console.log('Successfully wrote a green square to key 14')
            }                                                         

        // //IF STMDK KEY IS PRESSED, SEND OUT KEYINDEX AS MESSAGE
        // //send out the message (vars) (to everyone)
        // io.emit('chat message', keyIndex );


//FOR FIRST TWO ROWS (FIRST TWO DEPTHS), USE KEYS 0, 5, 6, 7 TO REFLECT THEM;
//EMIT CHAT MESSAGE WITH VALUE OF THE NODE.ID FOR THAT PARTICULAR NODE
//USE WHEN ATTEMPTING TO OPENCLOSENODE BY PRESSING STMDK BUTTON
if (keyIndex == 0)
{
    io.emit('chat message', 73);
}
else if (keyIndex == 5)
{
    io.emit('chat message', 72);
}
else if (keyIndex == 6)
{
    io.emit('chat message', 49);
}
else if (keyIndex == 7)
{
    io.emit('chat message', 22);
}

//FOR OTHER STMDK KEYS ASIDE FROM HARDCODED FIRST TWO DEPTHS/LEVELS
else
{
    io.emit('chat message', keyIndex);
}

           })
    });
});

//(kind of) reads in json, assigns it to a vars
let treejson = require('./copytreedata.json');

//contents of the parenthesis is what is being evaluated to find length
var count = Object.keys(treejson.children[0].children).length;
// var count = Object.keys(treejson.children[1].children[0].children[2].children).length;

//improved while loop: display color status of each component/node while displaying correct # of keys for that level 
//------> NEED TO FIND A WAY TO GENERALIZE THIS FOR ENTIRE SYSTEM
//while loop to display # of elements = # of green keys on streamdeck

//i is just a counter
i=0;

//following doesn't work bc can't iterate through i
// var level = treejson.children[0].children[i].progress

    while(i != count)
    {
        //experimenting accessing another part of the dendrogram
        // if (treejson.children[1].children[0].children[2].children < 60)

        //turns key red
        if (treejson.children[0].children[i].progress < 60)
        {myStreamDeck.fillColor(i, 255, 0, 0)
        }

        //turns key yellow
        else if (treejson.children[0].children[i].progress < 99)
        {myStreamDeck.fillColor(i, 255, 255, 0)
        }

        //turns key green
        else
        {myStreamDeck.fillColor(i, 0, 120, 0)
        }

        //increment i to go to next node (through dot notation)
        i++;
    }

//output to console the size of whatever is being evaluated
console.log('Number of Nodes: ' + count)


//------------------------------------------------------------------------------------------


// //FIRST ATTEMPT TO OPEN THE NODE (the combo function)
// myStreamDeck.on('down', keyIndex => 
// {
//     // server.send({keyIndex: 7});
//     if (keyIndex == 7)
//     {
//         function click(d) {
//             if (d.children) {
//               d._children = d.children;
//               d.children = null;
//             } else {
//               d.children = d._children;
//               d._children = null;
//             }
//             update(d);
//           }
//     }
//     console.log('key %d down', keyIndex)
// })




