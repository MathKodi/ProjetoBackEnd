const swaggerAutogen = require('swagger-autogen')()

output = './swagger_doc.json'
endpoints = ['./app.js']

swaggerAutogen(output, endpoints)