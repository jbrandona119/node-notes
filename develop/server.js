const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", (res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/api/notes", (res) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    return res.json(JSON.parse(data));
  });
});
app.post("/api/notes", (req, res) => {
    let note = JSON.stringify(req.body);
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        var newData = JSON.parse(data);
        newData.push(JSON.parse(note));
        for(let i = 0; i < newData.length; i++) {
            newData[i].id = i + 1;
        }
        fs.writeFile("db/db.json", JSON.stringify(newData), (err) => {
            if (err) throw err;
            return res.json(JSON.parse(note));
        });
    });
});
app.delete("/api/notes/:id", (req, res) => {
    var target = req.params.id - 1;
    fs.readFile("db/db.json", "utf8", (err, data) => {
        if (err) throw err;
        var newData = JSON.parse(data);
        newData.splice(target, 1);
        for (let i = 0; i < newData.length; i++) {
            newData[i].id = i + 1;
        }
        fs.writeFile("db/db.json", JSON.stringify(newData), (err) => {
            if (err) throw err;
        });
    });
    res.send("Note Deleted");
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});