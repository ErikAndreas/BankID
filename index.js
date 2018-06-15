// @ts-check

const express = require('express');
const app = express();
const https = require('https');
const fetch = require('node-fetch');

const ao = new https.Agent({
    pfx: require('fs').readFileSync('./FPTestcert2_20150818_102329.pfx'),
    passphrase: 'qwerty123',
    ca: require('fs').readFileSync('./BankID.cer')
}); 

app.get('/auth', async (req, res) => {
    let data = await fetch('https://appapi2.test.bankid.com/rp/v5/auth', {
        method: 'POST',
        body: JSON.stringify({
            "personalNumber":"197905310517",
            "endUserIp": "10.56.40.158"
        }),
        headers: {
            'content-type': 'application/json'
        },
        agent: ao
    });
    data = await data.json();
    console.log(data);
    let orderRef;
    if (data.orderRef) orderRef = data.orderRef;
    res.json('auth initiated, please open bankid to authenticate');
});

app.get('/collect', async (req, res) => {
    let data = await fetch('https://appapi2.test.bankid.com/rp/v5/collect', {
        method: 'POST',
        body: JSON.stringify({
            "orderRef": req.query.or
        }),
        headers: {
            'content-type': 'application/json'
        },
        agent: ao
    });
    data = await data.json();
    console.log(data);
    res.json({"status":data.status, "completionData": data.completionData})
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));