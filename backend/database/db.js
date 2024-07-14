const mongoose = require('mongoose')
exports.connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("mongodb connected")
    }
    catch (err) {
        console.log(err.message)
    }
}