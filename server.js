"use strict";

const express = require('express');
const mongo = require('mongodb').MongoClient;

mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/url-shortener', (err, db) => {
  if (err) {
    throw new Error('Database failed to connect!');
  }
  console.log('Successfully connected to MongoDB on port 27017.');
  
  const app = express();
  
  app.get('/:id', redirectToUrl);
  app.get('/new/(*)', generateNewUrlShortener);
  
  const collection = db.collection('urls');
  
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
  
  function redirectToUrl(req, res) {
    collection.findOne({ id: req.params['id'] }, (err, doc) => {
      if (err) return res.status(500).json({ error: 'Something wrong happend in our server. Try later.'});
      
      if (doc) {
        console.log(`Found ${JSON.stringify(doc)}`);
        console.log(`Redirecting to ${doc.url}`);
        res.redirect(doc.url);
      }
      else {
        res.status(404).json({ error: "Not found." });
      }
    });
  }
  
  function generateNewUrlShortener(req, res) {
    res.setHeader('Content-Type', 'application/json');
    
    const url = req.params[0];
    
    if (!validUrl(url)) {
      res.status(400).json({ url: 'Wrong url format, make sure you have a valid protocol and real site.'})
    }
    
    getShortUrl(url, collection, (err, id) => {
      if (err) return res.status(500).json({ error: 'Something wrong happend in our server. Try later.'});
      
      res.json({
        original_url: url,
        short_url: req.get('host') + '/' + id
      });
    });
  };
});

const validUrl = url => {
  var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return regex.test(url); 
};

const getShortUrl = (url, collection, callback) => {
  collection.find({ url }).toArray((err, documents) => {
    if (err) return callback(err);
    
    if (documents.length !== 0) {
      return callback(null, documents[0].id);
    }
    
    collection.find().toArray((err, documents) => {
      if (err) return callback(err);
      
      const ids = documents.map(doc => doc.id);

      let id;
      do {
        id = Math.floor(100000 + Math.random() * 900000).toString().substring(0, 4);
      } while (ids.indexOf(id) != -1);
      
      collection.save({ url, id}, (err, documents) => {
        if (err) return callback(err);
        
        callback(null, id);
      });
    });
  });
};