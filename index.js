var express = require('express');
var bodyparser = require('body-parser');
var mysql = require('mysql');
var fs = require('fs');

var conn = mysql.createConnection({
    host:'sql12.freemysqlhosting.net',
    user:'sql12326269',
    password:'XnxQs4Xxdr',
    database:'sql12326269'
});

conn.connect((err)=>{
    if(!err)
    console.log("DB Connected")
    else
    console.log(err)
});

var app = express();

app.use(bodyparser.urlencoded({
    extended: true
  }));

app.use(bodyparser.json());

app.listen(8080,()=>console.log("Express Server Started"));

app.get('/api',(req,res)=>{

	res.sendStatus(200);
});

app.post('/api/score',(req,res)=>{
    
    var values = [req.body.playerID, req.body.playerTeam, req.body.playerSession, req.body.scoreShot, req.body.scoreX, req.body.scoreY];
    var sql = 'INSERT INTO score(playerID, playerTeam, playerSession, scoreShot, scoreX, scoreY) VALUES (?)';

    conn.query(sql,[values],(err,rows,fields)=>{
        if(!err){
            res.sendStatus(201);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

app.post('/api/player',(req,res)=>{
    
    var values = [req.body.playerName, req.body.playerTeam];
    var sql = 'INSERT INTO player(playerName, playerTeam) VALUES (?)';

    conn.query(sql,[values],(err,rows,fields)=>{
        if(!err){
            res.sendStatus(201);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

app.get('/api/player/:team',(req,res)=>{

    var sql = 'SELECT * FROM player WHERE playerTeam = ?';
    conn.query(sql,[req.params.team],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

app.get('/api/score/team/:team',(req,res)=>{

    var sql = 'SELECT * FROM score WHERE playerTeam = ?';
    conn.query(sql,[req.params.team],(err,rows,fields)=>{
        if(!err){
            writeJSON(rows);
            res.download(`${__dirname}/myjsonfile.json`);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

app.get('/api/score/team/boundary/:team',(req,res)=>{

    var sql = 'SELECT * FROM score WHERE playerTeam = ? AND scoreShot = 4 OR scoreShot = 6';
    conn.query(sql,[req.params.team],(err,rows,fields)=>{
        if(!err){
            writeJSON(rows);
            res.download(`${__dirname}/myjsonfile.json`);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

app.get('/api/score/team/:team/:inning',(req,res)=>{

    var sql = 'SELECT * FROM score WHERE playerTeam = ? AND playerSession = ?';
    conn.query(sql,[req.params.team, req.params.inning],(err,rows,fields)=>{
        if(!err){
            writeJSON(rows);
            res.download(`${__dirname}/myjsonfile.json`);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

app.get('/api/score/team/boundary/:team/:inning',(req,res)=>{

    var sql = 'SELECT * FROM score WHERE playerTeam = ? AND playerSession = ? AND scoreShot = 4 OR scoreShot = 6';
    conn.query(sql,[req.params.team, req.params.inning],(err,rows,fields)=>{
        if(!err){
            writeJSON(rows);
            res.download(`${__dirname}/myjsonfile.json`);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

app.get('/api/score/player/:player/:inning',(req,res)=>{

    var sql = 'SELECT * FROM score WHERE playerID = ? AND playerSession = ?';
    conn.query(sql,[req.params.player, req.params.inning],(err,rows,fields)=>{
        if(!err){
            writeJSON(rows);
            res.download(`${__dirname}/myjsonfile.json`);
        }else{
            res.sendStatus(500);
            console.log(err)
        }
    })
})

  function writeJSON(rows){

    jsonArray = []
    for(i = 0; i<100; i++){
        jsonArray.push({'x1':0,'y1':0,"InsideColor": "#ff00ff","OutsideColor": "#ff00ff"})
    }

    var i = 0;
    rows.forEach(element => {
        
        switch (element.scoreShot){

            case 1:
                color = '#000000';
                break;
            case 2:
                color = '#1f3a93';
                break;
            case 3:
                color = '#019875';
                break;
            case 4:
                color = '#f7ca18';
                break;
            case 6:
                color = '#cf000f'
        }
        jsonArray[i] = {'x1':element.scoreX,'y1':element.scoreY,"InsideColor":color,"OutsideColor": color}
    });


      writeData = Object.assign({}, jsonArray);
    fs.writeFile('myjsonfile.json', JSON.stringify(writeData, null, 4), 'utf8', function (err) {
        if (err) throw err;
        console.log('Replaced!');
      });
  }