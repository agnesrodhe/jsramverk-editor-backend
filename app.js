const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const documents = require('./routes/documents');
const app = express();
const port = process.env.PORT || 1337;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/documents', documents);
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
});


app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

// app.get("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a GET request, sending back default 200"
//         }
//     });
// });

// app.get("/hello/:msg", (req, res) => {
//     const data = {
//         data: {
//             msg: req.params.msg
//         }
//     };
//     res.json(data);
// });
// app.post("/user", (req, res) => {
//     res.status(201).json({
//         data: {
//             msg: "Got a POST request, sending back 201 created"
//         }
//     });
// });

// app.put("/user", (req, res) => {
//     res.status(204).send();
// });

// app.delete("/user", (req, res) => {
//     res.status(204).send();
// });

app.listen(port, () => console.log(`Example API listening on port ${port}!`));