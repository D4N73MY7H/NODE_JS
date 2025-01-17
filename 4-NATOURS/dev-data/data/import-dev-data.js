// Always On Top
const mongoose = require('mongoose')
const fs = require('fs')
const Tour = require('../../mdoels/tourModel')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

// Connect DB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful!'))

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')

const importData = async () => {
    try {
        await Tour.create(JSON.parse(tours))
        console.log('Data successfully loaded!')
    } catch (error) {
        console.log(error)
    }
    process.exit()
} 


const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Data successfully deleted!')
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}

