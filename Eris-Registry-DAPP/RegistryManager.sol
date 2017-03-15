import "Registry.sol";
contract RegistryManager{
    registry reg;
    bytes32 chairperson;
    bytes32[10] registeredArray;
    event registeredEvent(bytes32[10] array);
    event updateEvent();
    event createEvent();
    event getEvent(bytes32[10] retArray0,bytes32[10] retArray1,bytes32[10] retArray2,bytes32[10] retarray3,bool[10] retArray4);
    event getBcDataEvent(bytes32 txid , bytes32 pubkey);
    function RegistryManagerInstantiation(){
        if(chairperson == 0x0){
            chairperson = sha3(msg.sender);
            reg = new registry();
        }
    }
    function isRegistered( bytes32[10] registrants )  returns (bytes32[10] array, bytes32 regId){
        bytes32[10] memory areRegistered;
        uint j=0;
        for(uint k=0;k<10;k++){
            for(uint i=0;i<10;i++){
                if(registeredArray[i] == registrants[k]){
                    areRegistered[j] = registrants[i];
                    j++;
                }
            }
            i=0;
        }
        registeredEvent(areRegistered);
    }
    function updateEntry(bytes32 RegistryID,bytes32 entityPublicKey,bytes32 BCTrxnID,bytes32 BCTrxnHash,bool active) returns (bool ret){
        ret=reg.updateEntry(RegistryID,entityPublicKey,BCTrxnID,BCTrxnHash,active);
        updateEvent();
    }//TODO:create regID
    function createEntry(bytes32 RegistryID,bytes32 entityPublicKey,bytes32 BCTrxnID,bytes32 BCTrxnHash,bool active) returns (bool ret){
        ret=reg.createEntry(RegistryID,entityPublicKey,BCTrxnID,BCTrxnHash,active);
        createEvent();
    }
    function getEntry(bytes32[10] array) returns (bool ret){
        bytes32[10] memory retArray3;
        bytes32[10] memory retArray0;
        bytes32[10] memory retArray1;
        bytes32[10] memory retArray2;
        bool[10] memory retArray4;
        (retArray0,retArray1,retArray2,retArray3,retArray4)=reg.getEntry(array);
        if(retArray0[0] !=""){ret=true;}
        getEvent(retArray0,retArray1,retArray2,retArray3,retArray4);
    }
    function getBcData(bytes32 RegistryID) returns(bool ret){
        bytes32 txid;
        bytes32 pubkey;
        (txid,pubkey,ret)=reg.getBCData(RegistryID);
        getBcDataEvent(txid,pubkey);
    }
}
