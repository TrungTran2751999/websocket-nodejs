const express = require("express");
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({server});
let client = [];
let nameClient = [];
wss.on('connection', function connection(ws) {
    client.push(ws);
    // ws.on('message', function message(data) {
    //   try{
    //     let msg = JSON.parse(data)
    //   }catch{

    //   }
    // });
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data, { binary: isBinary });
          }
        });
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
    });
  
  });

app.get("/", (req,res)=>res.send("Hello World"))
server.listen(3000, ()=>console.log("Server listening on port: 3000"))
