const express = require("express");
const request = require("request");
const https = require('https');

const client = require("@mailchimp/mailchimp_marketing");

// const client = require("mailchimp-marketing");

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const fName = req.body.firstInput;
  const lName = req.body.secondInput;
  const mail = req.body.mailInput;
  const data = {
    members: [
      {
        email_address: mail,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };

  const jasonData = JSON.stringify(data);
  

  // mailchimp config

  client.setConfig({
    apiKey: "dc3780243a06117e5d3bde2eacde0d17-us6",
    server: "us6",
  });
  
  const run = async () => {
    const response = await client.lists.batchListMembers("ec614c7bfd", {
      members: data.members,
    });
    console.log(response);
    if(response.error_count === 0) {
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }
  };
  
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("server is running");
});



// dc3780243a06117e5d3bde2eacde0d17-us6
// ec614c7bfd

