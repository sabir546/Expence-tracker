const mongoose = require('mongoose')
const expenseScheme = new mongoose.Schema({

    amount: Number,

    remark: String,

    categories:
    {
        type: String,
        // enum:['food','groceries','beaverages','travel','shopping','medical','']
    },

    paymentMode: {
        type: String,
        enum: ['Cash', 'Online', 'chek']
    },


    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'

    }],
}
    ,
    { timestamps: true },
)

module.exports = mongoose.model('expence', expenseScheme)