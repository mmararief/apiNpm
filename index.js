const express = require('express');
const scrapeTableData = require('./scraper');
const bodyParser = require("body-parser")
const cors = require('cors');
const app = express();
const port =  process.env.PORT || 5000;
const PaymentRoutes = require("./routes/PaymentRoutes.js")
const notification = require("./routes/notification.js")
const getemail = require("./routes/emailRoutes.js")
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.get('/api/mahasiswa/:npm', async (req, res) => {
  const npm = req.params.npm;
  try {
    const tableData = await scrapeTableData(npm);
    res.json(tableData);
  } catch (error) {
    res.status(500).json({ error: 'Gagal melakukan web scraping' });
  }
});
app.use("/api/payment", PaymentRoutes)
app.use("/api/midtrans", notification )
app.use("/api/email", getemail )
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
