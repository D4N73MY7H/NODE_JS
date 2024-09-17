const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')
const slugify = require('slugify')


const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')

const data = fs.readFileSync('./dev-data/data.json', 'utf-8')
const productData = JSON.parse(data)

const slugs = productData.map(el => slugify(el.productName, {lower: true}))

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true)
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = productData.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        
        res.end(output)

    } else if (pathname === '/product') {

        const product = productData[query.id]

        res.writeHead(200, {'Content-type': 'text/html'})

        const output = replaceTemplate(tempProduct, product)

        res.end(output)

    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)



    } else {
        res.writeHead(404, {'Content-type': 'text/html', 'my-own-header': 'hello-world'})
        res.end('<h1>Page not found</h1>')
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log(`Listening to request on port 8000`)
})