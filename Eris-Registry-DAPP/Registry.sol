contract registry
{
struct registryentry {
bytes32 registryID;
bytes32 hashentitypubkey;
bytes32 BCtrxnID;
bytes32 BChash;
bool active;
 }
address chairperson;
mapping (bytes32 => registryentry) register;
function registry () {
chairperson = 0x35D5D5325FDFE125E01D05C4C7FBEBB080234B1C; //needs to be replaced by actual contract address of registry manager once redployed
        }
function createEntry (bytes32 newregistryID, bytes32 newhashentitypubkey, bytes32 newBCtrxnID, bytes32 newBChash, bool newactive) returns (bool result)
{
        if (msg.sender == chairperson) {
        register[newregistryID].registryID = newregistryID;
        register[newregistryID].hashentitypubkey = newhashentitypubkey;
        register[newregistryID].BCtrxnID = newBCtrxnID;
        register[newregistryID].BChash = newBChash;
        register[newregistryID].active = newactive;
        result = true;}
        result = false;
}
function updateEntry (bytes32 currentregistryID, bytes32 currenthashentitypubkey, bytes32 newBCtrxnID, bytes32 newBChash, bool newactive) returns (bool result)
{
        if (msg.sender == chairperson && currentregistryID == register[currentregistryID].registryID  && currenthashentitypubkey == register[currentregistryID].hashentitypubkey) {
        register[currentregistryID].BCtrxnID = newBCtrxnID;
        register[currentregistryID].BChash = newBChash;
        if (newactive != register[currentregistryID].active) {
        register[currentregistryID].active = newactive;
        }
        result = true;}
        result = false;
}
function getEntry (bytes32[10] registryID) returns (bytes32[10] result0,bytes32[10] result1,bytes32[10] result2,bytes32[10] result3,bool[10] active) {
        for (uint i = 0; i < 10; i++) {
        if (registryID[i] != "") {
        bytes32 Aregister = registryID[i];
        result0[i] = register[Aregister].registryID;
        result1[i] = register[Aregister].hashentitypubkey;
        result2[i] = register[Aregister].BCtrxnID;
        result3[i] = register[Aregister].BChash;
        active[i] = register[Aregister].active;
        }
        else {throw;}
    }
}
function getBCData (bytes32 currentregistryID) returns (bytes32 RetBCtrxnID, bytes32 Rethashentitypubkey, bool success) {
        if (currentregistryID == register[currentregistryID].registryID) {
                RetBCtrxnID = register[currentregistryID].BCtrxnID;
                Rethashentitypubkey = register[currentregistryID].hashentitypubkey;
                success = true;
                }
                else {
                RetBCtrxnID = "";
                Rethashentitypubkey = "";
                success = false;
                }
        }
}
