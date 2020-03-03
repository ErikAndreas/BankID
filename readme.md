# Sample implementation of BankID v5 (REST/json instead of SOAP) in nodejs
Based on BankID relying party guidelines v3.0
## Setup
* Order code from https://demo.bankid.com/
* You need to use BankID on file if you have "real" Mobile BankID on your device since the Test BankID client can't be installed in parallell (Android)
* Install BankID client (Swedbank) https://install.bankid.com/?track=bank&ref=close&lText=Swedbank
* Configure BankID client https://demo.bankid.com/Konfigurera.aspx
* Login with code (from email)
* Issue bankid for test  
* Create .cer file from test server certificate ([7 Test Environment](https://www.bankid.com/assets/bankid/rp/bankid-relying-party-guidelines-v3.2.2.pdf))
* Download SSL cert (RP cert for test *.pfx)
* .cer and .pfx are included in this repo, no real need to do the two points above really
* >npm install
## Run
* endpoint /auth?pnr=19YYMMDDNNNN initiates authentication and outputs orderRef
* endpoint /collect?or=orderRef (output from /auth) checks status and returns completionData on complete
