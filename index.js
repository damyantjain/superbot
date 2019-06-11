'use strict'

const path = require('path');
const fs = require('fs');
fs.writeFileSync('key.json', process.env.GOOGLE_KEY);
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = path.join(`${__dirname}/key.json`);

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

//database  

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'db4free.net',
  user     : 'anotherbot',
  password : 'Damyant@580',
  database : 'anotherbot'
});

connection.connect();
// connection.query('SELECT * FROM `Name`', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//     console.log(results);
    
// });

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.send("hiiiiiiii")
})

let token = "EAAck6HVMCxYBAIGYF2vkoHPvdtFuiynas0KSehBya0TqDYmekFyf16eWoNhxQxjJt8ZBuTCitxygY30pZC71NZBLhgG5HwZA41GculRmmCdk4859S3ssJ7ItqRarGHLLtRcEhvWspCShmdxYdzMseSzNs0gppkj99str2nhrNgZDZD"


app.get('/webhook/', function(req, res){
    if (req.query['hub.verify_token']== "damyantjain"){
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token")
})

app.post('/webhook/',function(req, res){
    let messaging_events = req.body.entry[0].messaging
    for (let i =0; i < messaging_events.length; i++){
        let event = messaging_events[i]
        let sender = event.sender.id;
        connection.query(`SELECT * FROM users where id = ${sender}`, function (error, results) {
            if (error) throw error;
            console.log(results);
            if(results.length == 0) {
                request({
                    url:`https://graph.facebook.com/v2.6/${sender}`,
                    qs : {access_token : token, fields: 'first_name, last_name,locale,timezone,gender'},
                    method: "GET"
                  }, function(error, response, body) {
                    if (error) {
                        console.log("sending error")
                    }else if (response.body.error){
                        console.log("response body error")
                    }
                    const data = JSON.parse(body);
                    console.log(data);
    
                    const post  = [ [ [sender, data.first_name, data.last_name, data.locale, data.timezone, data.gender] ] ];
                    connection.query('INSERT INTO users (id, first_name, last_name, locale, timezone, gender) VALUES ?', post, function (error, results) {
                        if (error) throw error;
                        console.log("Number of records inserted: " + results.affectedRows);
                    });
                });
            }
            
        });
        if (event.message && event.message.text) {
            let text = event.message.text
            decideMessage(sender, text)

            /*if(text.includes("Happy")){
                sendText(sender, "Are you really " + text.substring(0,100) + "?")
            }
            else{
            sendText(sender, "Text echo: " + text.substring(0,100))
            }*/
        }
        if (event.postback){
            let text = JSON.stringify(event.postback)
            decideMessage(sender, text)
        }
    }
    res.sendStatus(200)
})



function decideMessage(sender, text1) {
    if (text1.includes("hey") || text1.includes("hi") || text1.includes("hello") || text1.includes("summer") || text1.includes("rainy") || text1.includes("fall")|| text1.includes("winter")|| text1.includes("fall") || text1.includes("receipt")|| text1.includes("happy") || text1.includes("mio"))
    {
    let text= text1.toLowerCase()
    if (text.includes("summer")) 
    {
        sendImageMessage(sender)
    }
    else if(text.includes("winter"))
    {
        sendGenericMessage(sender)
    }
    else if(text.includes("fall"))
    {
        sendVideoMessage(sender)
    }
    else if(text.includes("rainy"))
    {
        sendListMessage(sender)
    }
    else if(text.includes("happy"))
    {
        sendText(sender, "Are you really happy")
    }
    else if(text.includes("receipt"))
    {
        sendReceiptMessage(sender)
    }
    else if(text.includes("hey") || text.includes("hi") || text.includes("hello"))
    {
        sendText(sender, "Hey, I am just another bot. I can tell you about various seasons?. I like Fall.")
        sendButtonMessage(sender, "What is your favorite season?") 
    }
    else if(text.includes("mio"))
    {
        sendQuickReplies(sender)
    }
}
else{
    const sessionPath = sessionClient.sessionPath(process.env.GOOGLE_PROJECT_ID, sender);
  
    // The text query request.
    const request = {
    session: sessionPath,
        queryInput: {
            text: {
                text: text1,
                languageCode: 'en-US',
            },
        },
    };

    sessionClient
    .detectIntent(request).then((response)=> {
        console.log(response);
        sendText(sender, response[0].queryResult.fulfillmentText)
    })

}
}

function sendQuickReplies(sender){
    let messageData = {
        "text": "When some one calls 'mio' i fall !!! ",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Do you want to fall",
            "payload":"fall",
          },
        ]
    } 
    sendRequest(sender, messageData)
}

function sendText(sender, text) {
    let messageData = {text: text}
    sendRequest(sender, messageData)
}


function sendButtonMessage(sender, text){
    let messageData={
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":text,
              "buttons":[
                {
                    "type":"postback",
                    "title":"Summer",
                    "payload":"summer"
                },
                {
                    "type":"postback",
                    "title":"Winter",
                    "payload":"winter"
                },
             /*   {
                    "type":"postback",
                    "title":"Fall",
                    "payload":"fall"
                },*/
                {
                    "type":"postback",
                    "title":"Rainy",
                    "payload":"rainy"
                }
              ]
            }
          }
    }
    sendRequest(sender, messageData)
}


function sendImageMessage(sender){
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
               "template_type": "media",
               "elements": [
                  {
                     "media_type": "image",
                     "url": "https://www.facebook.com/photo.php?fbid=10154995201067788&set=basw.Abo8tFg0xfH-kgSa3vURzMCJOb02W2VuZXv5bkIU_vaxNNe0zTlplpr6uTDlwfNV4gcweEwe8Ku4RR8dFTsA43KB6u9bwqrBOQCuEbcpS6uIYAVDjro8OWICTLRTijbZR6AL0G8CaXAg6VpqvgMvEnaM.1721738948104276.10154995200512788.1631622686917401.1605997856122075.83365891478.837404456352533.1708855852740314.10154995201067788.790734197674704&type=1&opaqueCursor=AbpJ73Fv6WeItpNfQiAe6UGw0Wc2U13ei8osaOhES4-Hw_MbH6HSMcB8c-U13VaSqNguTm3r8PeyiS-XDYv9V_mTBMnbU9tE7k0lvDnrY0A9DSjGTi9Hw0oE72mhp1TpbhjCbruYFdf4Ko5AYqeQLnt17CejH3vb-jigqhIZYJMxZc4XPTM0eBzB8RqK4oAbB0Je1YB82cCpZvGscC8iZ-Nbv_7I2RIpODbDR4B0nM7iL9SgzdrFVEsFNu1F9DnO-SlpW2b6xQH8LjCTftisFq4DdMSi9i4qsKg5aC5kF0sQ26NyeDLnOMLfgagA8rgpsqMdCzL8kZ1qQKiz41ruGVmgB1V94Fxz-fDERH2BY80X1rXWRh71hQ6wYl_IM3GMrD1rfkDCUzvXpdTizuKVIwpq57fTwUfekf1PxUxxq7Vxffy4PoNrO3dllij532IjK4_wHxT7Yv-7kMFrFt-8s-rxlwCgOXsul3n3S-3kU3R_RBZu4R6a0z5ekBpM3aedJQ4&theater",
                     "buttons": [
                        {
                           "type": "web_url",
                           "url": "https://en.wikipedia.org/wiki/Summer",
                           "title": "More about summer",
                        }
                     ]
                    }
               ]
            }
          } 
    }
    sendRequest(sender, messageData)
}


function sendGenericMessage(sender){
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"generic",
              "elements":[
                 {
                  "title":"Welcome!",
                  "image_url":"http://images6.fanpop.com/image/photos/36200000/snow-image-snow-36241624-500-375.png",
                  "subtitle":"Winter is love.",
                  "default_action": {
                    "type": "web_url",
                    "url": "https://petersfancybrownhats.com/view?item=103",
                    "webview_height_ratio": "tall",
                  },
                  "buttons":[
                    {
                      "type":"phone_number",
                      "payload":"+917708883722",
                      "title":"Call Representative"
                    },
                               
                  ]      
                },
                {
                    "title":"Welcome!",
                    "image_url":"http://images6.fanpop.com/image/photos/36200000/snow-image-snow-36241624-500-375.png",
                    "subtitle":"Winter is love.",
                    "buttons":[
                      {
                        "type":"postback",
                        "payload":"receipt",
                        "title":"Buy"
                      },
                                 
                    ]      
                  }
              ]
            }
          }
    }
    sendRequest(sender, messageData)
}


function sendReceiptMessage(sender){
    let messageData = {
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"receipt",
              "recipient_name":"Stephane Crozatier",
              "order_number":"12345678902",
              "currency":"USD",
              "payment_method":"Visa 2345",        
              "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
              "timestamp":"1428444852",
              "address":{
                "street_1":"1 Hacker Way",
                "street_2":"",
                "city":"Menlo Park",
                "postal_code":"94025",
                "state":"CA",
                "country":"US"
              },
              "summary":{
                "subtotal":75.00,
                "shipping_cost":4.95,
                "total_tax":6.19,
                "total_cost":56.14
              },
              "adjustments":[
                {
                  "name":"New Customer Discount",
                  "amount":20
                },
                {
                  "name":"$10 Off Coupon",
                  "amount":10
                }
              ],
              "elements":[
                {
                  "title":"Classic White T-Shirt",
                  "subtitle":"100% Soft and Luxurious Cotton",
                  "quantity":2,
                  "price":50,
                  "currency":"USD",
                  "image_url":"http://petersapparel.parseapp.com/img/whiteshirt.png"
                },
                {
                  "title":"Classic Gray T-Shirt",
                  "subtitle":"100% Soft and Luxurious Cotton",
                  "quantity":1,
                  "price":25,
                  "currency":"USD",
                  "image_url":"http://petersapparel.parseapp.com/img/grayshirt.png"
                }
              ]
            }
          }
    }
    sendRequest(sender, messageData)
}


function sendListMessage(sender){
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "list",
                "top_element_style": "compact",
                "elements": [
                {
                  "title": "Scarf",
                    "subtitle": "$100",
                    "image_url": "https://cdn.shopify.com/s/files/1/0923/0916/products/scarf_grande.png?v=1470769109",
                    
                  "default_action": {
                    "type": "web_url",
                    "url": "https://petersfancybrownhats.com/view?item=103",
                    "webview_height_ratio": "tall",
                    },
                    "buttons": [
                        {
                        "type": "postback",
                        "title": "Buy",
                        "payload":"receipt", 
                    }
                ]
                },
                //
                {
                  "title": "Acrylic Cashmere Scarf",
                "subtitle": "$125",
                    "image_url": "https://cdn.shopify.com/s/files/1/0923/0916/products/4195500_medium_3126d8ed-8d2c-4989-9e91-e2b18dafe6d7_grande.png?v=1470770727",
                    
                    "default_action": {
                        "type": "web_url",
                        "url": "https://petersfancybrownhats.com/view?item=103",
                        "webview_height_ratio": "tall",
                    },
                    "buttons": [
                        {
                        "type": "postback",
                        "title": "Buy",
                        "payload":"receipt"
                    }
                ]
                }, 
                {
                    "title": "Acrylic Cashmere Scarf",
                      "subtitle": "$125",
                      "image_url": "https://cdn.shopify.com/s/files/1/0923/0916/products/4195500_medium_3126d8ed-8d2c-4989-9e91-e2b18dafe6d7_grande.png?v=1470770727",
                      "buttons": [
                          {
                          "type": "postback",
                          "title": "Buy",
                          "payload":JSON.stringify({
                            "title":"Fancy Hat",
                            "url": "https://www.atticandbutton.com/products/scarf",
                            "subtitle": "$100",
                            "image_url": "https://cdn.optimizely.com/img/8177152216/e08ccf450e88408f94002ded2e877f2b.jpg"
                        })
                      }
                  ]
                  }, 
            ]
        }
    }
    }    
    sendRequest(sender, messageData)
}


function sendVideoMessage(sender){
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
               "template_type": "media",
               "elements": [
                  {
                     "media_type": "video",
                     "url": "https://www.facebook.com/smosh/videos/404945563247669/",
                
                     //share button   
                
                     "buttons": [
                        {
                          "type": "element_share",
                          "share_contents": { 
                            "attachment": {
                              "type": "template",
                              "payload": {
                                "template_type": "generic",
                                "elements": [
                                  {
                                    "title": "I took the hat quiz",
                                    "subtitle": "My result: Fez",
                                    "image_url": "https://bot.peters-hats.com/img/hats/fez.jpg",
                                    "default_action": {
                                      "type": "web_url",
                                      "url": "http://m.me/petershats?ref=invited_by_24601"
                                    },
                                    "buttons": [
                                      {
                                        "type": "web_url",
                                        "url": "http://m.me/petershats?ref=invited_by_24601", 
                                        "title": "Take Quiz"
                                      }
                                    ]
                                  }
                                ]
                              }
                            }
                          }
                        }
                    ],

                   /*  "buttons": [
                        {
                           "type": "web_url",
                           "url": "https://en.wikipedia.org/wiki/Fall",
                           "title": "More about fall",
                        }
                     ]*/
                    }
               ]
            }
          } 
    }
    sendRequest(sender, messageData)
}


function sendRequest(sender, messageData){
    request({
        url:"https://graph.facebook.com/v2.6/me/messages",
        qs : {access_token : token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message : messageData
        }
    }, function(error, response, body) {
        if (error) {
            console.log("sending error")
        }else if (response.body.error){
            console.log("response body error")
        }
    })
}

app.listen(app.get('port'), function(){
    console.log("running: port")
})

