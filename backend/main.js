const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const { connectDatabase } = require('./database/db')
const model = require('./database/model')
const app = express()
dotenv.config()
app.use(cors())
app.use(express.json())
connectDatabase();
app.get("/todos", async (req, res) => {
    try {
        const items = await model.find()
        res.status(200).json(items)
    }
    catch (err) {
        res.status(404).json({ message: err.message })
    }

})
app.post("/todos", async (req, res) => {
    const todo = new model({
        title: req.body.title,
        description: req.body.description,
    })
    try {
        const newTodo = await todo.save()
        res.status(201).json(newTodo)
    }
    catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message })
    }
})
app.put("/todos/:id", async (req, res) => {
    const id = req.params.id
    try {
        const item = await model.findByIdAndUpdate(id, {
            title: req.body.title,
            description: req.body.description
        }, {
            new: true
        })
        res.json(item)
        console.log(item)
    }
    catch (err) {
        res.status(404).json({ message: "no such item" })
    }
})
app.delete("/todos/:id", async (req, res) => {
    const id = req.params.id
    try {
        const deletedItem = await model.findByIdAndDelete(id)
        res.json(deletedItem)
    }
    catch (err) {
        res.status(500).json({ message: "no such item" })
    }

})
app.listen(process.env.PORT, () => {
    console.log(`The server is running at port ${process.env.PORT}`)
})
