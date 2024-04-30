const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({server});
let client = [];
let nameClient = [];
wss.on('connection', function connection(ws) {
  //khi player joined
  //{"type": "joined","name" :"${this.nameLabel.string}", "isShared":"true"}
    ws.on('message', function message(data, isBinary) {
        try{
          data = JSON.parse(data);
          if(data.type=="joined"){
            let listPlayer = {
              listPlayer: [...nameClient],
              type:"server"
            }
            ws.send(JSON.stringify(listPlayer))
            client.push(ws);
            nameClient.push(data);
          }
          if(data.isShared){
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                let message = JSON.stringify(data)
                client.send(message, { binary: isBinary });
              }
            });
          }
        }catch{
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              
            }
          })
        }
    });

    ws.on('close', () =>{
       const index = client.indexOf(ws)
       wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          let clientExit = nameClient[index];
          clientExit.type = "exit"
          client.send(JSON.stringify(nameClient[index]));
        }
      });
       client.splice(index,1)
       nameClient.splice(index, 1)
       console.log(nameClient)
    });
  
  });

app.get("/", (req,res)=>res.send("Hello World"))
server.listen(3000, ()=>console.log("Server listening on port: 3000"))
