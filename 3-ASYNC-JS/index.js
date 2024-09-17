const fs = require('fs')
const superagent = require('superagent')

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject('I could not find that file')
            resolve(data)
        })
    })
}

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) reject('Could not write file')
            resolve('Success')
        })
    })
}

// readFilePro(`${__dirname}/dog.txt`).then(data => {
//     console.log(`Breed: ${data}`)
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
// }).then(res => {
//     console.log(res.body.message)
//     return writeFilePro('dog-img.txt', res.body.message)
// }).catch(err => {
//     console.log(err.message)
// })

const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`)
        console.log(`Breed: ${data}`)

        const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
        console.log(res.body.message)

        await writeFilePro('dog-img.txt', res.body.message)
        console.log('Random dog image saved to file')
    } catch (err) {
        console.log(err.message)
    }
}

getDogPic()


// fs.readFile(`${__dirname}/dog.txt`, 'utf8', (err, data) => {
//     console.log(`Breed: ${data}`)

//     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then(res => {
//         console.log(res.body.message)

//         fs.writeFile('dog-img.txt', res.body.message, err => {
//             if(err) return console.log(err.message)
//             console.log('Random dog image saved to file')
//         })
//     }).catch(err => console.log(err.message))
// })