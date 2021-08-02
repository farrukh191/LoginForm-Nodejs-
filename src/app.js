const express =  require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    res.send("this is login form");
});

app.listen(port, ()=>{
    console.log(`this app is run on port no. ${port}`);
});

// test test