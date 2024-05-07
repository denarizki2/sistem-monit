const { SerialPort } = require("serialport")
const { ReadlineParser } = require("@serialport/parser-readline")
const express = require("express")
const {Server} = require("socket.io")
const http = require("http");


const app = express()
const server = http.createServer(app);

const io = new Server(server)

app.use(express.json())
app.get("/", (req,res) => {
    res.sendFile(__dirname + "/views/index.html")
})

io.on("connection", (Socket) => {
    console.log("Connected..")
    Socket.on("disconnect", () => {
        console.log("Disconnect..")
    })
})

app.listen(3000, ()=>{
    console.log('server on!')
});

const port = new SerialPort({
       path: 'COM17',
        // baudRate: 19200,
        baudRate: 9600,
        // parser: new ReadlineParser({delimiter: "\r\n"}),
    });

const parser = port.pipe(new ReadlineParser({delimiter: "\r\n"}));

parser.on("data", (result)=>{
    console.log("data => ", result)
    io.emit("data", {data: result})
});

app.post("/arduinoApi", (req,res)=>{
    const data = req.body.data
    port.write(data,(err)=>{
        if (err) {
            console.log(err)
            res.status(500).json({error: "error"})
        }

        console.log("berhasil mengirim =>",data)
        res.end();
    })
})

app.post("/connectWifi", (req,res)=>{
    const {ssid, password} = req.body;
    // console.log(ssid)
    // console.log(password)
    port.write(JSON.stringify({"ssid": ssid,"password": password}),(err) =>{
        if(err){
            console.log(err);
            res.status(500).json({error:"error"})
        }

        console.log("success", ssid)
     
    })
    

    // port.
    
    res.end();
    // console.log(JSON.stringify(req.body.data));
})

app.post("/sendData", ({body},res)=>{
//   console.log(body);
  res.end();
    
})