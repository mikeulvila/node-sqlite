'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');

const PORT = 3000;

const app = express();
const db = new sqlite3.Database('./db/chinook.sqlite');


console.log('# of invoices per country');

app.get('/', (req, res) => {
  db.all(`
  SELECT   COUNT(*) AS count,
           BillingCountry AS country
  FROM     Invoice
  GROUP BY BillingCountry
  ORDER BY count DESC`,
    (err, data) => {
      if (err) throw err;

      res.send(data);
    }
  );

});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
