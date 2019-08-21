//USE THIS TO BUILD FINAL(??) PRODUCT!!!
//HTML FILE I'M USING/FOR THE APP.USE IS IN DOWNLOADS -> PUBLIC -> UCSDASHBOARD.HTML

const express = require('express');
const app = express();
const port = 1419;

var http = require('http').createServer(app);

var io = require('socket.io')(http);

// var http = require ('http').createServer(app);
// var io = require ('socket.io')(http);

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




//when go to localhost:4000/ bring up the page with the socket chat
// app.get('/', function (req, res){
//     res.sendFile(__dirname + '/socketindex.html');
// });

io.on('connection', function(socket){
    console.log('a user connected??');
socket.on('disconnect', function(){
    console.log('user disconnected');
});

});

//send out event (chat message) to everyone
io.emit('some event', {for: 'everyone'});



//===============================================================

//(OG PLACE)
// //when have connection with port (event)
// io.on('connection', function(socket){

//     //when have chat message (event with socket)
//     socket.on('chat message', function(msg){

//         //console log the message
//         console.log('message: ' +msg)

//         //send out the message (vars) (to everyone)
//         io.emit('chat message', msg);
//     });
// });

//===============================================================



//--------------------------------------------------------------------------------------------
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
        io.emit('chat message', keyIndex );

           })
    });
});

//------------------------------------------------------------------------------------------

//line below didn't work
let treejson = require('./copytreedata.json');


//could copy+paste json after (copytreedatajson =) but want to find a way to read in json file as vars and then use dot notation with length



// var copytreedatajson = (function()
// {
//     var thejson = null;
//     $.ajax({
//         'async': false,
//         'global': false,
//         'url': "copytreedata.json",
//         'dataType': "json",
//         'success': function(data){
//             thejson = data;
//         }
//     });
//     return thejson;
// });

//contents of the parenthesis is what is being evaluated to find length
var count = Object.keys(treejson.children[0].children).length;


//example of using array notation to access diff parts of json file to find lengths of diff things
// var count = Object.keys(copytreedatajson.children[0].children).length;


//improved while loop: display color status of each component/node while displaying correct # of keys for that level 
//------> NEED TO FIND A WAY TO GENERALIZE THIS FOR ENTIRE SYSTEM
//while loop to display # of elements = # of green keys on streamdeck
//i is just a counter
i=0;

    while(i != count)
    {
        if (treejson.children[0].children[i].progress < 60)
        {myStreamDeck.fillColor(i, 255, 0, 0)
        }

        else if (treejson.children[0].children[i].progress < 99)
        {myStreamDeck.fillColor(i, 255, 255, 0)
        }

        else
        {myStreamDeck.fillColor(i, 0, 120, 0)
        }

        //without if statements, generic command to turn # keys green = # elements on that level
        // myStreamDeck.fillColor(i, 0, 255, 0)
        i++;
    }

//output to console the size of whatever is being evaluated
console.log('size: ' + count)


//clears what is displayed on the key (makes it black)
// myStreamDeck.fillColor(keyIndex, 0, 0, 0)

theprogress = {
    "name" : "a",
    "last" : "b",
    "progress" : "52"

};

console.log('the progress: ' + theprogress.progress)

console.log('this?' + treejson.progress)


//four test buttons with sample colors (red, yellow, green, blue)
// myStreamDeck.fillColor(10, 255, 0, 0)
// myStreamDeck.fillColor(11, 255, 255, 0)
// myStreamDeck.fillColor(12, 0, 255, 0)
// myStreamDeck.fillColor(13, 0, 0, 255)

// var thecount = Object.keys(treejson.children[0].children.progress);

// console.log('the count: ' + thecount)





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


