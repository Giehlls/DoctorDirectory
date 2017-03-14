from bigchaindb_driver import BigchainDB
bdb = BigchainDB('http://bdb-server:9984/api/v1')
from bigchaindb_driver.crypto import generate_keypair

bicycle = {'data': {'msg': 'hi'}}

alice, bob = generate_keypair(), generate_keypair()

metadata = {'planet': 'earth'}

prepared_creation_tx = bdb.transactions.prepare(
   operation='CREATE',
   owners_before=alice.verifying_key,
    asset=bicycle,
    metadata=metadata,
   )

