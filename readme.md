# Sample implementation of BankID v5 (REST/json instead of SOAP) in nodejs
Based on BankID relying party guidelines v3.0
## Setup
* Create .cer file from test server certificate ([7 Test Environment](https://www.bankid.com/assets/bankid/rp/bankid-relying-party-guidelines-v3.0.pdf))
* Download SSL cert (RP cert for test *.pfx)
## Run
* endpoint /auth?pnr=19YYMMDDNNNN initiates authentication and outputs orderRef
* endpoint /collect?or=orderRef (output from /auth) checks status and returns completionData on complete