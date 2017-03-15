'use strict'
var chainConfig = require('/home/onchackathon/.eris/ErisChainConfig.json') 
var erisContracts = require('eris-contracts')
var fs = require('fs')
var http = require('http')
var express = require('express')
var bodyParser = require('body-parser');
var morgan = require('morgan');

//for sending a notification
var superAgent = require("superagent");

//for verification
var crypto = require("crypto")
var ed25519 = require("ed25519")

//this library is needed to calculate hash of blockchain id (chain name) and bigchain response
var keccak_256 = require('js-sha3').keccak_256;

//These variables are for creating the server
var hostname = 'localhost';

var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.set('trust proxy', true);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, application/json-rpc");
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(morgan('dev'));


//this function is intended to send a notification
var notifier = function () {
    //location of webapp
    this.webappUrl = "http://52.168.36.72:5050";

    //for grabbing the appropriate scope
    var _this = this;

      //NOTE: THE webapp needs to reject it without a pubKey; updated send again
    this.notifyregistryCreation = function (registryID, pubKey, txnID, txnHash) {
        superAgent.post(this.webappUrl + "/notifications/setRegistration")
            .send({
                "RegistryID": registryID,
	            "PubKey": pubKey,
                "keys": ["DataPointer", "DataHash"],
                "values": [txnID, txnHash]
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                // if(res.status == 200){
                // do something
                // }
            });
    };
//AF: updated resend again
this.notifyendorser = function (pubKey_endorser, registryID, provider_firstname, provider_lastname, provider_public_key, claim, IPFS_Hash, File_Hash) {
        superAgent.post(this.WebAppUrl + "/notifications/EndorserNotification")
            .send({
                "Your_Public_Key": pubKey_endorser,
	            "RegistryID": registryID,
	            "Provider_FirstName": provider_firstname,
	            "Provider_LastName": provider_lastname,
	            "Provider_Public_Key": provider_public_key,
                "Provider_Claim": claim,
	            "Attesting_Institution": institution,
                "File_Pointer": IPFS_Hash,
                "File_Digital_Fingerprint": File_Hash,
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                // if(res.status == 200){
                // do something
                // }
            });
};


    this.createUpdateNotification = function (pubkey, registryID, txnID, txnHash, endorser, endorsement) {

        superAgent.post(this.WebAppUrl + "/notifications/updateNotify")
            .send({
                "pubKey": requester,
                "RegistryID": registryID,
                "Datapointer": txnID,
                "DataHash": txnHash,
	            "Endorser": endorser,
	            "Endorsement": endorsement,
                "message": "You received an Identity Endorsement!"
            })
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (res.status == 200) {
                    console.log("Registry update message sent successfully");
                }
            });
    };


} //end var notifier


var theNotifier = new notifier();

//makes a registry entry
var RegistryProvider = function () {
//Debugging Comment:
    console.log("A RegistryEntry object has just been instantiated")
    this.chain = 'primaryAccount';
    this.erisdburl = chainConfig.chainURL;
    this.contractData = require("./epm.json");
    this.contractAddress = this.contractData['RegistryManagerr'];
    this.erisAbi = JSON.parse(fs.readFileSync("./abi/" + this.contractAddress));
    this.accountData = require("./accounts.json");
    this.contractMgr = erisContracts.newContractManagerDev(this.erisdburl, chainConfig[this.chain]);
    this.RegistryManagerContract = this.contractMgr.newContractFactory(this.erisAbi).at(this.contractAddress);

    //use this to have the registry scope inside functions
    var _this = this;
    //for verification
    _this.verifyIt = function (formdata) {
        var msg = formdata.msg;
        var sig = formdata.sig;
        var pubKey = formdata.pubKey;
        var sync = true;
        var isValidResult = false;
        console.log("you have reached verifyIt internal function")
        console.log(msg)
        console.log(sig)
        console.log(pubKey)

        var theResponse = verify(msg, signature, pubKey).toString();

        if (theResponse == true) {
            isValidResult = true;
        }
        while (sync) { require('deasync').sleep(100); }
        return isValidResult;
    } //end verification

    this.bigchainIt = function (formdata){
        var ErisAddress = chainConfig['primaryAccount'].address;
        var thePubkey = ErisAddress;
        var bigchainServer = 'http://40.74.254.216:4080/'
        var bigchainEndpoint = 'addData/' + thePubkey + '/1'
        formdata.RegistrationHash = sha3(formdata);
        superAgent.post(bigchainServer + bigchainEndpoint)
                .send({
                    "data": formdata
                })
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log("RES : "+res);
                    // if(res.status == 200){
                    // do something
                    // }
                });
    }

    function verify(msg, signature, pubKey) {
    //INPUT msg: This is a hex string of the message hash from wallet
    //INPUT signature: This is a hex string of the signature from wallet
    //INPUT pubKey: This is a hex string of the public key from wallet
    //convert all to buffers:
    msg = new Buffer(msg, "hex");
    signature = new Buffer(signature, "hex");
    pubKey = new Buffer(pubKey, "hex");
    var verified = secp256k1.verify(msg, signature, pubKey)
    return verified;
    }

    this.RegistryEntry = function (formdata, res, callback) {
        var registryID = keccak_256(concat(formdata.pubkey,Number(new Date())));
        this.bigchainit(formdata,res1);
        var BCtrxnID = res1.BCtrxn;
        Var BCtrxnHash = res1.Bchash;
        var sync = true;
        var formdata1 = formdata;

        this.RegistryManager.createEntry(registryID, formdata.pubkey, BCtrxnID, BCtrxnHash, formdata.status, function (error, result) {

            if (error) {
                console.log(err);
            }
            else {
                sync = false;
                console.log("Result is: " + result);
                //New code
                if(result) {

                    theNotifier.notifyregistryCreation (formdata.pubKey, registryID, BCtrxnID, BCtrxnHash);

                    for (var i = 0; i < formdata.network.length; i++) {

                    theNotifier.notifyendorser(formdata.network.pubKey_payor[i], registryID, formdata.provider.firstname, formdata.provider.lastname, formdata.provider.provider_public_key, formdata.network.payor[i],formdata.network.payor[i], formdata.network.IPFS_Hash[i], formdata.network.File_Hash[i]);

                    }

                    for (var j = 0; j < formdata.edu.length; j++) {

                    theNotifier.notifyendorser(formdata.edu.pubKey_institution[j], registryID, formdata.provider.firstname, formdata.provider.lastname, formdata.provider.provider_public_key, formdata.edu.degree[j],formdata.edu.institution[j], formdata.edu.IPFS_Hash[j], formdata.edu.File_Hash[j]);

                    }

                    for (var k = 0; k < formdata.edu.length; k++) {

                    theNotifier.notifyendorser(formdata.edu.pubKey_institution[k], registryID, formdata.provider.firstname, formdata.provider.lastname, formdata.provider.provider_public_key, formdata.edu.degree[k],formdata.edu.institution[k], formdata.edu.IPFS_Hash[k], formdata.edu.File_Hash[k]);

                    }
                }
            }
            //

        }) // end of callback
        while (sync) { require('deasync').sleep(100); }
    } //end of function

    //new function to endorse

    this.ProviderEndorsement = function (formdata, res, callback) {
        var registryID = formdata.registryID;
        var sync = true;
        this.RegistryManager.getBcData(registryID, function(error,result){
            if (error) {
                console.log(err);
            }
            else {
                sync = false;
                console.log("Result is: " + result);
                var oldBCtrxnID = result;
            }
        }) // end of callback
            while (sync) { require('deasync').sleep(100); }
    }; //end of function
        
    this.bigchainupdate(formdata, oldBCtrxnID, res1);
    var  BCtrxnID = res1.BCtrxn;
    Var BCtrxnHash = res1.Bchash;
    var sync = true;

    var pubkey1 =  keccak_256(formdata.pubkey_provider);

    this.RegistryManager.updateEntry(registryID, pubkey1, BCtrxnID, BCtrxnHash, true, function (error, result) {
        if (error) {
            console.log(err);
        }
        else {
            sync = false;
            console.log("Result is: " + result);
        }
        if(result) {
            theNotifier.createUpdateNotification (formdata.pubkey_provider, registryID, BCtrxnID, BCtrxnHash, formdata.endorser, formdata.endorsement);
        }
        while (sync) { require('deasync').sleep(100); }
    }) // end of callback
        



    app.post("/register", function (req, res) {
        console.log("Just transacted a POST Request to endpoint: /register")
        var formdata = req.body;
        console.log("Form data from register ===> ", formdata);
        var RegisterProviderApp = new RegisterProvider();
        var isValid = RegisterProviderApp.verifyIt(formdata);
        console.log('before is valid check...')
        //console.log(req.body)
        console.log("isValid is: " + isValid);
        if (isValid) {
        // console.log("Is valid value: " + (isValid == true))
            RegisterProviderApp.RegistryEntry(formdata, res, function (err, res) {
                if (err) {
                    res.json({ "error": err });
                    console.log("Error");
                }
                else {
                    res.json({ "Method": "POST", "msg": "Registry submitted successfully" });
                }
            });
        }
        else {
        res.send("The signature is not valid....check that your public key, signature and message hash are correct.")
        }
    });

    //getting the endorsement

    app.post("/vote", function (req, res) {
        console.log("Just transacted a POST Request to endpoint: /vote")
        var formdata = req.body;
        console.log("Form data from vote ===> ", formdata);
        var RegisterProviderApp = new RegisterProvider();
        var isValid = RegisterProviderApp.verifyIt(formdata);
        console.log('before is valid check...')
        //console.log(req.body)
        console.log("isValid is: " + isValid);
        if (isValid) {
        // console.log("Is valid value: " + (isValid == true)) 
            RegisterProviderApp.ProviderEndorsement(formdata, res, function (err, res) {
                if (err) {
                    res.json({ "error": err });
                    console.log("Error");
                }
                else {
                    res.json({ "Method": "POST", "msg": "Vote submitted successfully" });
                }
            })
        }
        else {
            res.send("The signature is not valid....check that your public key, signature and message hash are correct.")
        }
    });
}//end RegisterProvider
app.listen(3000, function () {
    console.log("Connected to contract http://52.168.84.86:1337/rpc"); 
    console.log("Listening on port 3000");
})
