const { createObjectCsvWriter } = require("csv-writer");

module.exports = {


  friendlyName: 'Process file',


  description: '',


  inputs: {

    file: {
      type: 'string',
      required: true,
      description: 'The ID of the data to be fetched.'
    }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
    let file=JSON.parse(inputs.file)
    const response = await CSVRow.count({
      isProcressed: false,
      fileUniqueId: file.uniqueId,
    });
  
    if (response == 0) {
      let csvRows = await CSVRow.find({
        where: { fileUniqueId: file.uniqueId },
        sort: "id",
      });
  
      for (let i = 0; i < csvRows.length; i++) {
        delete csvRows[i].id;
        delete csvRows[i].updatedAt;
        delete csvRows[i].createdAt;
        delete csvRows[i].isProcressed;
      }
      await writeProcessedDataToCsv(csvRows, file.processedFilePath);
  
      await CSVFile.update({ id: file.id }).set({
        isProcressed: true,
      });
    }
  }


};

async function writeProcessedDataToCsv(data, filePath) {
  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
  });

  await csvWriter.writeRecords(data);
}