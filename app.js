const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed', // 'pending' - send confirmation email
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const dataPost = JSON.stringify(data);

    const options = {
        url: 'https://us21.api.mailchimp.com/3.0/lists/b523be9fee', // 'https://<server(end of API key)>.api.mailchimp.com/3.0/lists/<list-id>'
        method: 'POST',
        headers: {
            Authorization: 'auth f70ebc3f9d0dc1c7b77b81ff4ac8e06b-us21'
        },
        body: dataPost
    }

    request(options, (err, response, body) => {
        if(err) { 
            res.sendFile(__dirname + '/failure.html');
        }
        else {
            if(response.statusCode == 200){
                res.sendFile(__dirname + '/success.html');
                console.log(response);
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        }
    })
});  

app.post('/failure', function(req, res) {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, function (){
    console.log('Server is running.');
});

// API Key
// f70ebc3f9d0dc1c7b77b81ff4ac8e06b-us21

// List ID
// b523be9fee
