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
    client.push(ws);
    ws.on('message', function message(data, isBinary) {
        try{
          data = JSON.parse(data);
          if(data.type=="joined"){
            nameClient.push(data.name);
          }
          if(data.isShared){
            wss.clients.forEach(function each(client) {
              if (client.readyState === WebSocket.OPEN) {
                let message = ""
                if(data.type=="joined"){
                  message = `${data.name} joined`
                }else if(data.type=="position"){
                  console.log("kkkkkk")
                  message = JSON.stringify(data)
                }
                client.send(message, { binary: isBinary });
              }
            });
          }
        }catch{
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send("llllmmm")
            }
          })
        }
    });

    ws.on('close', () =>{
       const index = client.indexOf(ws)
       wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(nameClient[index] + " exited");
        }
      });
       client.splice(index,1)
       nameClient.splice(index, 1)
       console.log(nameClient)
    });
  
  });

app.get("/", (req,res)=>res.send("Hello World"))
server.listen(3000, ()=>console.log("Server listening on port: 3000"))
