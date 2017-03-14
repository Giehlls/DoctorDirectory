# DoctorDirectory
snippets for creating a medical directory

Curve library:
https://github.com/cryptocoinjs/secp256k1-node

Keccak256 (from js-sha3):
https://github.com/emn178/js-sha3


TO CHECK IF A PROCESS IS RUNNING:

    ps -ef | grep $app
    
    (ex:)
    
    ps -ef | grep bigchain



If rethinkDB stops,
    sudo /etc/init.d/rethinkdb restart
    
If you need to start bigchain:
    nohup bigchaindb start &

    (nohup is no hangup and so you will not have to start it again)
