// api/controllers/CsvProcessorController.js
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

module.exports = {
  fileStatus: async function (req, res) {
    try {
      let uniqueId = req.query.uniqueId;
      let csvFile = (await CSVFile.find({ uniqueId: uniqueId }))[0];

      if (csvFile.isUploaded == false || csvFile.isProcressed == false)
        return res.ok({
          message: "processing CSV File. File uniqueId " + uniqueId,
        });

      return res.ok({
        message: "CSV processed successfully",
        processedFilePath: csvFile.processedFilePath,
      });
    } catch (err) {
      return res.badRequest("No file was uploaded");
    }
  },

  uploadCsv: async function (req, res) {
    // Handle file upload
    req.file("csvFile").upload(
      {
        // Set a temporary upload directory
        dirname: path.resolve(sails.config.appPath, "assets/uploads"),
      },
      async function (err, uploadedFiles) {
        if (err) {
          return res.serverError(err);
        }

        if (uploadedFiles.length === 0) {
          return res.badRequest("No file was uploaded");
        }

        let uniqueId = uuidv4();

        const processedCsvPath = path.resolve(
          sails.config.appPath,
          "assets/uploads/processed_data.csv"
        );

        procressCSVFile(uniqueId, uploadedFiles);

        await CSVFile.create({
          uniqueId: uniqueId,

          isUploaded: false,

          isProcressed: false,

          processedFilePath: processedCsvPath,
        });

        return res.ok({
          message: "processing CSV File. File uniqueId " + uniqueId,
        });
      }
    );
  },
};

function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c^(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

async function procressCSVFile(uniqueId, uploadedFiles) {
  const csvFilePath = uploadedFiles[0].fd;

  // Read and process CSV file
  const rows = [];
  const processedRows = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      try {
        saveCSVRow(row, uniqueId);
      } catch (error) {
        console.log(error);
      }
    })
    .on("end", async () => {
      await CSVFile.update({ uniqueId: uniqueId }).set({
        isUploaded: true,
      });
    });
}

async function saveCSVRow(row, uniqueId) {
  await CSVRow.create({
    dealerID: row.DealerID,

    fileUniqueId: uniqueId,

    type: row.Type,

    vin: row.VIN,

    year: row.Year,

    stock: row.Stock,

    make: row.Make,

    model: row.Model,

    trim: row.Trim,

    imageList: row.ImageList,

    isProcressed: false,
  });

  await sails.helpers.sendForProcessing(row);
}
