const fs = require('fs');
const http = require('http');

// // const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// // console.log(textIn)

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('Your file has been written!')
//             })
//         })
//     })
// })


// console.log(`Reading Data`);

// // const textOut = `This is what we know about the avocado: ${textIn} \nCreated on ${Date.now()}`
// // fs.writeFileSync('./txt/output.txt', textOut)
// // console.log('File written!')

// /////////////////////////////////// SERVER /////////////////////////////////

const server = http.createServer((req, res) => {
    res.end('Serving Content')
})

server.listen(8000, '127.0.0.1', () => {
    console.log(`Listening to request on port 8000`)
})