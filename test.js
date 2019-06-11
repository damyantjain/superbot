
// // const path = require('path');
// // const fs = require('fs');
// // require('dotenv').config();

// // // console.log(process.env.GOOGLE_KEY);

// // fs.writeFileSync('key.json', process.env.GOOGLE_KEY);
// // process.env['GOOGLE_APPLICATION_CREDENTIALS'] = path.join(`${__dirname}/key.json`);

// // const dialogflow = require('dialogflow');
// // const sessionClient = new dialogflow.SessionsClient();


// // const sessionPath = sessionClient.sessionPath(process.env.GOOGLE_PROJECT_ID, '123456');
  
// //     // The text query request.
// //     const request = {
// //     session: sessionPath,
// //         queryInput: {
// //             text: {
// //                 text: "bye",
// //                 languageCode: 'en-US',
// //             },
// //         },
// //     };

// //     sessionClient
// //         .detectIntent(request).then((response)=> {
// //             console.log(response[0].queryResult.fulfillmentText);
// //         })
// //   

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'db4free.net',
//   user     : 'anotherbot',
//   password : 'Damyant@580',
//   database : 'anotherbot'
// });

// const sender = 2;
// connection.query(`SELECT * FROM users where id = ${sender}`, function (error, results, fields) {
//   if (error) throw error;
//   console.log(results);
//   if(results.length == 0) {
//       const post  = [ [ [2, 'Hello MySQL'] ] ];
//       connection.query('INSERT INTO users (id, name) VALUES ?', post, function (error, results) {
//           if (error) throw error;
//           console.log("Number of records inserted: " + results.affectedRows);
//       });

//   }
  
// });


// connection.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
    // var sql = "INSERT INTO customers (name, address) VALUES ?";
    // var values = [
    //   ['John', 'Highway 71'],
    //   ['Peter', 'Lowstreet 4'],
    //   ['Amy', 'Apple st 652'],
    //   ['Hannah', 'Mountain 21'],
    //   ['Michael', 'Valley 345'],
    //   ['Sandy', 'Ocean blvd 2'],
    //   ['Betty', 'Green Grass 1'],
    //   ['Richard', 'Sky st 331'],
    //   ['Susan', 'One way 98'],
    //   ['Vicky', 'Yellow Garden 2'],
    //   ['Ben', 'Park Lane 38'],
    //   ['William', 'Central st 954'],
    //   ['Chuck', 'Main Road 989'],
    //   ['Viola', 'Sideway 1633']
    // ];
//     connection.query(sql, [values], function (err, result) {
//       if (err) throw err;
//       console.log("Number of records inserted: " + result.affectedRows);
//     });
//   });
  


// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://damyant:damyant580@ds125331.mlab.com:25331/anotherbot";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("anotherbot");
//   var myobj = { name: "Company Inc", address: "Highway 37" };
//   dbo.collection("customers").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
// });





const request = require('request');
let token = "EAAck6HVMCxYBAARL5kTT62fxPHUgMUTZAgessatN86qiaWodTTIyejb5gGR02dxKPLuCEhmza02XZCrZAyUzTjuR0kDZAYNIEmbZAOtgmIU3pWu3B7aXZB9wgY1r1AYSGZBIcK6LTZAd0f9wOZCRpjE88E8sDUUNo0ZCpDZAoRc5fjSFgZDZD"
const sender = 1792492524130199;
request({
  url:`https://graph.facebook.com/v2.6/${sender}`,
  qs : {access_token : token, fields: 'first_name'},
  method: "GET"
}, function(error, response, body) {
  if (error) {
      console.log("sending error")
  }else if (response.body.error){
      console.log("response body error")
  }
  console.log(response);
})