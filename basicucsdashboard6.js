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

app.use(express.static(__dirname + '/public'));

//(kind of) reads in json, assigns it to a vars
let treejson = require('./copytreedata.json');

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
    //console log that key went down //%d is fixed decimal like matlab notation??
    console.log('key %d down', keyIndex)
})

//if stmdk key goes up, console log that key # up
myStreamDeck.on('up', keyIndex => {
    console.log('key %d up', keyIndex)
    console.log('-------------------------------')
})

myStreamDeck.on('error', error => {
    console.error(error)
})

//GENERAL CODE TO HAVE JS REGISTER THE KEYINDEX, USE SOCKET TO SEND TO HTML, HAVE HTML DISPLAY WHICH STMDK KEY WAS PRESSED 
// //when have connection with port (event)
io.on('connection', function(socket){

    //RESET THE VALUE OF K EVERY TIME REFRESH THE HTML PAGE (USER DISCONNECTS+CONNECTS)
    //use k to navigate between diff depths
    k=0;
    n=0;

    //Can't use therow(0,0,0,0) to replace this bc should have first node display before pushing any buttons
    //LEVEL ONE
    //turns key red
    if (treejson.progress <= 60)
        myStreamDeck.fillColor(0, 255, 0, 0)

    //turns key yellow
    else if (treejson.progress <= 99)
        myStreamDeck.fillColor(0, 255, 255, 0)

    //turns key green
    else
        myStreamDeck.fillColor(0, 0, 120, 0)

    //clear all buttons except home
    clearexcept();

    //clearexcept clears all stmdk keys except first button (#0) and last four buttons (#10-14)
    function clearexcept()
    {
        //use j as a counter to clear all keys except for key representing home node
        j=1;
        while (j != 15)
        {
            //clear all keys except for key #0 and 11-14
            if (j > 9 && j < 15)
                j++;
            
            else {
                myStreamDeck.clearKey(j);
                j++;
            }
        }
    }

    //DOWN COMMANDS HERE RELY ON HAVING A CONNECTION WITH SOCKET MESSAGE!!!
    myStreamDeck.on('down', keyIndex => 
    {
        //increment k every time key (#0 - 9) is pressed
        if (keyIndex < 10){
            k++;
        }
        
        //use to keep track of k every time a key is pressed
        console.log('this is k: ' + k);

        //if k is 0 (by using previous button), show home node
        //IF PRESS HOME/RESET BUTTON, CLEAR EVERYTHING AND ONLY DISPLAY TOP MOST NODE
        if (keyIndex==12 || k == 0)
        {
            k=0;

            //turns key red
            if (treejson.progress <= 60)
                myStreamDeck.fillColor(0, 255, 0, 0)
            
            //turns key yellow
            else if (treejson.progress <= 99)
                myStreamDeck.fillColor(0, 255, 255, 0)
            
            //turns key green
            else
                myStreamDeck.fillColor(0, 0, 120, 0)

            clearexcept();
        }

        if (keyIndex == 11)
        {
            console.log('here????')
            reverse(keyIndex, 0, 0); //THIS WORKS!! (just going between home node and sites)
        }

        //go up previous level
        function reverse(keyIndex, olderkey, oldkey)
        {
            k = k-1;
            console.log('k!!!: ' + k)

            if (k <= 0)
            {
                k = 0;

                console.log('k!!!2: ' + k)

                //turns key red
                if (treejson.progress <= 60)
                    myStreamDeck.fillColor(0, 255, 0, 0)
        
                //turns key yellow
                else if (treejson.progress <= 99)
                    myStreamDeck.fillColor(0, 255, 255, 0)
                
                //turns key green
                else
                    myStreamDeck.fillColor(0, 0, 120, 0)

                clearexcept();
            }

            //northrop sites
            else if (k==1)
            {
                therow(1,0,0,0);
                n=1;
            }
        }

        //northrop sites
        if (keyIndex==0 && k==1) {
            therow(1,0,0,0);
        }

        //projects
        if (k == 2 && keyIndex <= 2)
        {
            therow(2, keyIndex,0,0);

            m=keyIndex;    
        }

        //colors the nodes of the group within that level
        function colornodes(thelevel, count){
            i = 0;

            while(i != count)
            {
                //turns key red
                if (thelevel[i].progress <= 60)
                    myStreamDeck.fillColor(i, 255, 0, 0)
                
                //turns key yellow
                else if (thelevel[i].progress <= 99)
                    myStreamDeck.fillColor(i, 255, 255, 0)
                
                //turns key green
                else
                    myStreamDeck.fillColor(i, 0, 120, 0)
                
                console.log('the progress: ' + thelevel[i].progress)
                //increment i to go to next node (through dot notation)
                i++;
            }
        }

        //COMBINES PROJECTS AND NORTHROP SITES FUNCTIONS TO CREATE GENERALIZED ROW FUNCTION TO ACCESS ELEMENTS OF EACH ROW
        function therow(rownum, keyIndex, component, part)
        {
            //top level (home/parent node)
            if (rownum == 0)
            {
                thelevel = treejson;
                //USED FOR EVERY ROW 
                count = Object.keys(thelevel).length;
                colornodes(thelevel, count);
            }

            //northrop sites
            else if (rownum == 1)
            {
                thelevel = treejson.children;
                //USED FOR EVERY ROW 
                count = Object.keys(thelevel).length;
                colornodes(thelevel, count);
            }

            //projects
            else if (rownum == 2)
            {
                thelevel = treejson.children[keyIndex].children;
                const olderkey = keyIndex;

            //USED FOR EVERY ROW 
            count = Object.keys(thelevel).length;
            colornodes(thelevel, count);

            myStreamDeck.on('down', keyIndex =>
            {
                //recursive function :) :) calls function therow again using old node level values, jumps to next else if for (rownum==3), changes color of stmdk keys

                const oldkey = keyIndex;

                if (keyIndex < 10)
                {
                    console.log('')

                    if (k==3){
                        console.log('k is 3')
                        therow(3, olderkey, keyIndex, 0);
                    }
                }

                else if (keyIndex == 11)
                {
                    if (n== 1){
                        console.log('made it')
                        console.log('this is k3: ' + k)
                        return;
                    }

                    console.log('will return1!')
                    therow (2, m, 0,0);
                }

                else if (keyIndex == 12)
                {
                    k=0;

                    //turns key red
                    if (treejson.progress <= 60)
                        myStreamDeck.fillColor(0, 255, 0, 0)
                    
                    //turns key yellow
                    else if (treejson.progress <= 99)
                        myStreamDeck.fillColor(0, 255, 255, 0)
                    
                    //turns key green
                    else
                        myStreamDeck.fillColor(0, 0, 120, 0)
        
                    clearexcept();

                    return;
                }

                myStreamDeck.on('down', keyIndex =>
                {
                    if (keyIndex == 11)
                    {
                        k = k-1;
                        console.log('will return2!')

                        therow(3, olderkey, oldkey, 0);

                        return;
                    }

                    else if (keyIndex < 10)
                    {
                        therow(4,olderkey, oldkey, keyIndex);
                    }
    
                    else if (keyIndex == 12)
                    {
                        k=0;

                        //turns key red
                        if (treejson.progress <= 60)
                            myStreamDeck.fillColor(0, 255, 0, 0)
                        
                        //turns key yellow
                        else if (treejson.progress <= 99)
                            myStreamDeck.fillColor(0, 255, 255, 0)
                        
                        //turns key green
                        else
                            myStreamDeck.fillColor(0, 0, 120, 0)
            
                        clearexcept();

                        return;
                    }    
                })
            })
            }
            
            //components
            else if (rownum == 3)
            {
                console.log('at rownum == 3')

                thelevel = treejson.children[keyIndex].children[component].children;

                //USED FOR EVERY ROW 
                count = Object.keys(thelevel).length;
                colornodes(thelevel, count);
            }

            //parts 
            else if (rownum == 4)
            {
                thelevel = treejson.children[keyIndex].children[component].children[part].children;
                
                //USED FOR EVERY ROW 
                count = Object.keys(thelevel).length;
                colornodes(thelevel, count);
            }

            else {
                return;
            }
        }
    })


//------------------------------------------------------------------------------------------------------------------------

//BELOW CODE IS FOR WHEN SEND CHAT MESSAGES EITHER MANUALLY THROUGH WEB APP OR BY PRESSING CERTAIN STMDK KEYS TO SEND HARDCODED MESSAGES (NODE IDs)

//when have chat message (event with socket)
socket.on('chat message', function(msg){

    //console log the message
    console.log('message: ' + msg)

    //IF STMDK KEY NOT PRESSED, HAVE CHAT FUNCTION NORMALLY
    io.emit('chat message', msg);

    //IF CHAT MESSAGE ENTERED ON THE CHAT BAR IS FOUR, TURN KEY #10 TO GREEN
    if (msg == 4)
        myStreamDeck.fillColor(10, 0, 255, 0)

    //for when chat is connected+press stmdk keys
    myStreamDeck.on('down', keyIndex => {
        //IF STMDK KEY IS PRESSED, SEND OUT THE MESSAGE (THAT NODE VALUE (OR THAT PARTICULAR KEY INDEX) AS MESSAGE TO EVERYONE)

        //FOR FIRST TWO ROWS (FIRST TWO DEPTHS), USE KEYS 0, 5, 6, 7 TO REFLECT THEM;
        //EMIT CHAT MESSAGE WITH VALUE OF THE NODE.ID FOR THAT PARTICULAR NODE
        //USE WHEN ATTEMPTING TO OPENCLOSENODE BY PRESSING STMDK BUTTON
        if (keyIndex == 0)
            io.emit('chat message', 73);

        else if (keyIndex == 5)
            io.emit('chat message', 72);

        else if (keyIndex == 6)
            io.emit('chat message', 49);

        else if (keyIndex == 7)
            io.emit('chat message', 22);

        //FOR OTHER STMDK KEYS ASIDE FROM HARDCODED FIRST TWO DEPTHS/LEVELS
        //SENDS OUT THE KEYINDEX AS THE MESSAGE TO EVERYONE (INSTEAD OF HARDCODED NODE ID)
        else
            io.emit('chat message', keyIndex);
        })
    })
});



