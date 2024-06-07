module.exports.cron = {
  rowProcessCompletedCheckCron: {
    schedule: "*/5 * * * * *",
    onTick: async function () {
      console.log("I am triggering every five seconds for row");
      let csvRows = await CSVRow.find({ isProcressed: false });
      for (let i = 0; i < csvRows.length; i++) {
        triggerProcessRow(csvRows[i])
      }
    },
  },

  fileProcessCompletedCheckCron: {
    schedule: "*/10 * * * * *",
    onTick: async function () {
      console.log("I am triggering every ten seconds for file");
      let csvFiles = await CSVFile.find({
        isProcressed: false,
        isUploaded: true,
      });
      for (let i = 0; i < csvFiles.length; i++) {
        triggerProcessFile(csvFiles[i]);
      }
    },
  },
};

async function triggerProcessRow(row){
    await sails.helpers.processRow.with({
        row: JSON.stringify(row),
      });
}

async function triggerProcessFile(file){
    await sails.helpers.processFile.with({
        file: JSON.stringify(file),
      });
}