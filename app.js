
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const documents = require('./routes/documents');

const app = express();
const httpServer = require("http").createServer(app);

const port = process.env.PORT || 8976;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/documents', documents);
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.sockets.on('connection', function(socket) {
    socket.on('create', function(room) {
        socket.join(room);
    });
    socket.on("doc", function(data) {
        socket.to(data["_id"]).emit("doc", data);
        socket.broadcast.emit("doc", data);
    });
});

const server = httpServer.listen(port, () => console.log(`Example API listening on port ${port}!`));

module.exports = server;
