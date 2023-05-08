require("dotenv").config();
const {
  Client,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
  PrivateKey,
} = require("@hashgraph/sdk");

// Grab the OPERATOR_ID and OPERATOR_KEY from the .env file
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

// Build Hedera testnet and mirror node client
const client = Client.forTestnet();

// Set the operator account ID and operator private key
client.setOperator(myAccountId, myPrivateKey);

require("dotenv").config();

async function main() {
  //Create the transaction
  const transaction = await new TopicCreateTransaction()
    .setAdminKey(myPrivateKey)
    .setSubmitKey(myPrivateKey)
    .setTopicMemo("this is My memo")
    .execute(client);

  console.log("the message is created ", transaction.toString());


  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the topic ID
  const newTopicId = receipt.topicId;

  console.log("The new topic ID is " + newTopicId);

  //v2.0.0

  //Create the transaction
  await new TopicMessageSubmitTransaction({
    topicId: receipt.topicId,
    message: "Hello Hedera !",
  })
    .addSignature(myPrivateKey)
    .freezeWith(client);

  //v2.0.0

  //Create the query
  setTimeout(() => {
    new TopicMessageQuery()
      .setTopicId(newTopicId)
      .setStartTime(0)
      .subscribe(client, (message) =>
        console.log(Buffer.from(message.contents, "utf8").toString())
      );
  }, 5000);

  //v1.4.4

  //Create a transaction to add a submit key
  const newtransaction = await new ConsensusTopicUpdateTransaction();
  setTopicMemo("Hello Everyone").build(client);

  //Get submit key
  transaction.getTopicMemo();

  //v2.0.0
}

main();
