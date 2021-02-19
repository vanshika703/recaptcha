const express = require('express')
const app = express()

const request = require('request')

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/submit', (req,res) => {
    if(
        req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null
    ){
        return res.json({"success":false, "msg":"Please select captcha"})
    }

    const secretKey = '6Lfie_kUAAAAAAYZM0z0uetf7cs8pFQ4_e567GmN'

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body)

        if(body.success !== undefined && !body.success){
            return res.json({"success":false, "msg":"Failed captcha verification"})
        }

        return res.json({"success": true, "msg":"captcha passed"})
    })
})

app.listen(3000, (err)=>{
    if(err) throw err
    console.log("App running on 3000") 
})