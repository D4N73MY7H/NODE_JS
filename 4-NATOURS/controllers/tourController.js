const fs = require('fs')

const Tour = require('../mdoels/tourModel')
const APIFeatures = require('../utils/apiFeatures')

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))


// exports.checkID = (req, res, next, val) => {
//     const id = req.params.id * 1
//     next()
// }


// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }
//     next()
// }
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'.trim();
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty'.trim()
    next()
}


exports.getAllTours = async (req, res) => {

    try {

        // 1) BUILD QUERY
        // const queryObj = { ...req.query }
        // const excludedFields = ['page', 'sort', 'limit', 'fields']
        // excludedFields.forEach(el => delete queryObj[el])

        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        // let query = Tour.find(JSON.parse(queryStr))

        // // 2) SORTING
        // if(req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortBy)
        // } else {
        //     query = query.sort('-createdAt')
        // }

        // // 3) FIELD LIMITING
        // if(req.query.fields) {
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields)
        // } else {
        //     query = query.select('-__v')
        // }

        // // 4) PAGINATION
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = (page - 1) * limit
        // query = query.skip(skip).limit(limit)

        // if(req.query.page) {
        //     const numTours = await Tour.countDocuments()
        //     if(skip >= numTours) throw 'This page does not exist'
        // }
        
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
        const tours = await features.query

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }

}

exports.getTour = async (req, res) => {

    try {

        const tour = await Tour.findById(req.params.id)

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }

}

exports.createTour = async (req, res) => {

    try {
        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: "Invalid data sent"
        })
    }
}

exports.updateTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}

exports.deleteTour = async (req, res) => {

    try {

        await Tour.findByIdAndDelete(req.params.id)

        res.status(204).json({
            status: 'success',
            data: null
        })

    } catch (error) {

        res.status(404).json({
            status: 'fail',
            message: error
        })
    }
}

// Aggregations

exports.getTourStats = async (req, res) => {

    try {

        const stats = await Tour.aggregate([

            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    _id: { $toUpper :'$difficulty'},
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: -1 }
            },
            // {
            //     $match: { _id: { $ne: 'EASY' }}
            // }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        })

    } catch (error) {

        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {

    try {

        const year = req.params.year * 1

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { numTourStarts: -1 }
            },
            {
                $limit: 12
            }
        ])

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        })

    } catch (error) {

        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}