const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");
require("dotenv").config();
// Grab your Hedera testnet account ID and private key from your .env file
  const myAccountId = process.env.MY_ACCOUNT_ID;
  const myPrivateKey = process.env.MY_PRIVATE_KEY;

  // If we weren't able to grab it, we should throw a new error
  if (myAccountId == null || myPrivateKey == null) {
    throw new Error(
      "Environment variables myAccountId and myPrivateKey must be present"
    );
  }

  // Create our connection to the Hedera network
  // The Hedera JS SDK makes this really easy!
  const client = Client.forTestnet();

  client.setOperator(myAccountId, myPrivateKey);



async function createNFT() {
  console.log("CreateNFT---------------------");
  let tokenCreateTx = await new TokenCreateTransaction()
    .setTokenName("MyNFT")
    .setTokenSymbol("FT")
    .setTokenType(TokenType.NonFungibleUnique)
    .setInitialSupply(0)
    .setCustomFees(0.5)
    .setTreasuryAccountId(myAccountId)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(myPrivateKey)
    .setFreezeKey(myPrivateKey)
    .setPauseKey(myPrivateKey)
    .setAdminKey(myPrivateKey)
    .setWipeKey(myPrivateKey)
    .freezeWith(client);

  let tokenCreateSign = await tokenCreateTx.sign(myPrivateKey);
  let tokenCreateSubmit = await tokenCreateSign.execute(client);
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
  let tokenId = tokenCreateRx.tokenId;
  console.log(`- Created token with ID: ${tokenId}`);
  console.log("-----------------------------------");
  return tokenId;
}

async function mintNFT(tokenId) {
  console.log("MintNFT--------------------------");

  // Mint new NFT
  let mintTx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata([
      Buffer.from("ipfs://QmTzWcVfk88JRqjTpVwHzBeULRTNzHY7mnBSG42CpwHmPa"),
      Buffer.from("secondToken"),
    ])
    .execute(client);
  let mintRx = await mintTx.getReceipt(client);
  //Log the serial number
  console.log(`- Created NFT ${tokenId} with serial: ${mintRx.serials} \n`);

  console.log("-----------------------------------");
}




async function Token() {
  
  // Create new keys for compte A
  const newAccountPrivateKey = PrivateKey.generateED25519();
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  // Create new keys for compte B
  const newAccountPrivateKeyb = PrivateKey.generateED25519();
  const newAccountPublicKeyb = newAccountPrivateKey.publicKey;

  // Create a new account with 1,000 tinybar starting balance
  const AccountA = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

  // Get the new account ID
  const getReceipta = await AccountA.getReceipt(client);
  const AccountIdA = getReceipta.accountId;

  // Create a new account with 1,000 tinybar starting balance
  const AccountB = await new AccountCreateTransaction()
    .setKey(newAccountPublicKeyb)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client);

  // Get the new account ID
  const getReceiptb = await AccountB.getReceipt(client);
  const AccountIdB = getReceiptb.accountId;

  console.log("The new account ID is: " + AccountIdB, AccountIdA);

  const tokenId = await createNFT();
   await mintNFT(tokenId);




}

// Call the async main function
Token();
