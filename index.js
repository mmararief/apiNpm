const express = require('express');
const scrapeTableData = require('./scraper');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.get('/api/mahasiswa/:npm', async (req, res) => {
  const npm = req.params.npm;

  try {
    const tableData = await scrapeTableData(npm);
    res.json(tableData);
  } catch (error) {
    res.status(500).json({ error: 'Gagal melakukan web scraping' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
