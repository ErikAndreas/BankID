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
    console.log(req.connection.remoteAddress);
    let data = await fetch('https://appapi2.test.bankid.com/rp/v5/auth', {
        method: 'POST',
        body: JSON.stringify({
            "personalNumber":req.query.pnr,
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
    res.json('auth initiated, please open bankid to authenticate ' + orderRef);
});

app.get('/collect', async (req, res) => {
    //  RP should keep on calling collect every two seconds as long as status indicates pending. RP must abort if status indicates failed
    let orderRef = req.query.or;
    let data = await callCollect(orderRef);
    console.log(data);
    res.json({"status":data.status, "completionData": data.completionData})
})

const callCollect = async (orderRef) => {
    let data = await fetch('https://appapi2.test.bankid.com/rp/v5/collect', {
        method: 'POST',
        body: JSON.stringify({
            "orderRef": orderRef
        }),
        headers: {
            'content-type': 'application/json'
        },
        agent: ao
    });
    data = await data.json();
    console.log(data);
    if (data.hintCode) {
        // call again for non failed statuses
        if (data.hintCode != 'expiredTransaction' && // msg RFA8
            data.hintCode != 'certificateErr' && // msg RFA16
            data.hintCode != 'userCancel' && // msg RFA6
            data.hintCode != 'cancelled' && // msg RFA3
            data.hintCode != 'startFailed') { // msg RFA17
            console.log('set timeout');
            return await sleep(callCollect, orderRef);
            //console.log('after sleep', data);
        } else {
            // fail, return
            console.log('fail, return');
            return data;
        }
    } else {
        console.log('return data', data);
        return data;
    }
    
};

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
    await timeout(2000);
    return await fn(...args);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));