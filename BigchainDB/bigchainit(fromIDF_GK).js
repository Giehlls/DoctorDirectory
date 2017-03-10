

/* calling BIGCHAINIT (FROM idf_gk */ 

// _this.bigchainIt(proposalId, formdataArray[index], coidGKAddr, coidAddr, dimensionCtrlAddr, blockNumber, blockHashVal, blockchainID, timestamp, validatorSigs, GKSig, function (result, theId, theHash) {
//     // console.log(result);
//     console.log("THE TXN ID: " + theId)
//     console.log("THE HASH: " + theHash)
//     console.log("GK ADDR: " + coidGKAddr)
//     console.log("COID ADDR: " + coidAddr)
//     console.log("DIM_CTRL ADDR: " + dimensionCtrlAddr)
//     theNotifier.notifyCoidCreation(formdataArray[index].pubKey, theId, theHash, coidGKAddr, coidAddr, dimensionCtrlAddr)

//     //makes the core identity
//     //CoidMaker(coidAddr, dimensionCtrlAddr, formdataArray[index])


// })




//this is for bigchain writing
//see the note (above var bigchainInput) for how to input data in this function
this.bigchainIt = function (proposalID, coidData, coidGKAddress, coidAddr, dimensionCtrlAddr, blockNumber, blockHash, blockchainID, timestamp, validatorSigs, gatekeeperSig, callback) {

    //get public key
    var thePubkey = this.ErisAddress;
    //var thePubkey = _this.ErisAddress;
    console.log("In function bigchainIt, pubKey of eris account is: " + thePubkey)

    var description = "Core Identity"

    //NOTE: signatures inputted to this object should include msg hash, signature and public key
    //NOTE: Coid_Data should include uniqueID and the signature of the one requesting a core identity
    var bigchainInput = {
        "Description": description,
        "proposalID": proposalID,
        "Coid_Data": coidData,
        "coidGK_Address": coidGKAddress,
        "coid_Address": coidAddr,
        "dimensionCtrlAddr": dimensionCtrlAddr,
        "blockNumber": blockNumber,
        "blockHash": blockHash,
        "blockchainID": blockchainID,
        "blockchain_timestamp": timestamp,
        "validator_signatures": validatorSigs,
        "GateKeeper_signature": gatekeeperSig
    };//end json struct


    bigchainInput = JSON.stringify({ "data": bigchainInput })
    console.log("In function bigchainIt, the input to be sent to bigchain is: " + bigchainInput)



    var bigchainEndpoint = 'addData/' + thePubkey + '/1'
    var theobj = { "method": "POST", "stringJsonData": bigchainInput, "endpoint": bigchainEndpoint }
    console.log("Bigchain Request: " + JSON.stringify(theobj))

    _this.bigchain_contract.BigChainQuery(JSON.stringify(theobj), function (error, result) {

        // console.log("A million stars ***************************************************************************************")
        var theEvent;
        _this.bigchain_contract.CallbackReady(function (error, result) {
            theEvent = result;
        },
            function (error, result) {

                if (thePubkey == result.args.addr) {

                    _this.bigchain_contract.myCallback(function (error, result) {

                        console.log("RESULT: " + result);
                        var bigchainID = JSON.parse(result).response;
                        console.log("Result.response: " + bigchainID)
                        bigchainID = JSON.parse(bigchainID).id;
                        var bigchainHash = keccak_256(JSON.parse(result).response);
                        console.log("************: " + JSON.parse(result).response);

                        var signature = JSON.parse(result).signature
                        var msg = JSON.parse(result).msg
                        var pubKey = JSON.parse(result).pubKey
                        console.log("pubkey returns is ......: " + pubKey)

                        //verify oraclizer signature
                        var logme = ed25519.Verify(new Buffer(msg), new Buffer(signature, "hex"), new Buffer(pubKey, "hex"))
                        console.log(logme)

                        //for debugging--ignore:
                        if (logme == true) {
                            console.log("logme is the bool true");
                        }
                        else {
                            console.log("logme is not bool true but if this says true, it is a string: " + logme)
                        }

                        callback(result, bigchainID, bigchainHash)

                        //stop event listening
                        theEvent.stop();

                    })//end calling of myCallback

                }//end if statement

            })//end callback listening


    })//end bigchain query
}