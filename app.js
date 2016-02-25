'use strict';

const express = require('express');
const sqlite3 = require('sqlite3');
const _ = require('lodash');

const PORT = 3000;

const app = express();
const db = new sqlite3.Database('./db/chinook.sqlite');

app.get('/invoices-per-country', (req, res) => {
  db.all(`
  SELECT   COUNT(*) AS count,
           BillingCountry AS country
  FROM     Invoice
  GROUP BY BillingCountry
  ORDER BY count DESC`,
    (err, data) => {
      if (err) throw err;

      res.send({
        data: data,
        info: '# of invoices per country'
      });
    }
  );
});

app.get('/sales-per-year', (req, res) => {
  db.all(`
    SELECT count(*) as invoices,
           sum(Total) as total,
           substr(InvoiceDate, 1, 4) as year
    FROM   Invoice
    GROUP BY year;
    `, (err, data) => {
      if (err) throw err;

      const roundedData = data.map(function(obj) {
        return {
            invoices: obj.invoices,
            year: +obj.year,
            total: +obj.total.toFixed(2)
          }
      });

      res.send({
          data: roundedData,
          info: '# of invoices and sales per year'
        });

    })
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
