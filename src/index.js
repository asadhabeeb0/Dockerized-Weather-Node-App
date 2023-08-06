const fs = require("fs");
const request = require("request");
const path = require('path');
const express = require("express");
const app = express();
const port = 3000;
const ejs = require("ejs");

const staticpath = (path.join(__dirname,'../public'));
const templatepath = path.join(__dirname,'../public/template/views');

app.set('view engine','ejs');
app.set('views', templatepath);
app.use(express.static(staticpath));
const homeFile = fs.readFileSync(`./public/template/views/home.ejs`, "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);  
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);  
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);  
    temperature = temperature.replace("{%location%}", orgVal.name);  
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
    return temperature;   
}

app.get("/",(req,res)=> {
    request ( 
        `https://api.openweathermap.org/data/2.5/weather?q=Lahore&appid=85056aff43325746087771b1c984bcc6`
    )
    .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        console.log(arrData[0]);
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val));
        const joinedData = realTimeData.join();
        console.log(joinedData); 
        res.write(joinedData);
    })
    .on("end", (err) => {
        if (err) 
            return console.log("Connection closed due to errors", err);
    });   
});

app.get("*", (req, res) => {
    res.send("Page not found");
});

app.listen(port, () => { 
    console.log(`Listening to the port number ${port}`);
});

