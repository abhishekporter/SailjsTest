module.exports = {


  friendlyName: 'Process row',


  description: '',


  inputs: {
    row: {
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
    let row=JSON.parse(inputs.row)
    const response = await sails.helpers.getData.with({
      id: JSON.stringify(row),
    });
    if (response.status === "complete") {
      await CSVRow.update({ id: row.id }).set({
        isProcressed: true,
      });
    }
  }


};

