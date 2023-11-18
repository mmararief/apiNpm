const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTableData(npm) {
  const url = `https://baak.gunadarma.ac.id/cariKelasBaru?tipeKelasBaru=NPM&teks=${npm}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const tableData = {};
    
    // Scraping data tabel
    $('tbody tr').each((index, element) => {
      const columns = $(element).find('td');

      // Cek apakah data tidak kosong
      if (columns.length > 0) {
        const npm = columns.eq(1).text().trim();

        // Cek apakah npm sudah ada di objek
        if (!tableData[npm]) {
          tableData[npm] = {
            npm,
            nama: columns.eq(2).text().trim(),
            kelasBaru: columns.eq(4).text().trim(),
          };
        }
      }
    });

    // Convert objek ke array
    const result = Object.values(tableData);

    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = scrapeTableData;
