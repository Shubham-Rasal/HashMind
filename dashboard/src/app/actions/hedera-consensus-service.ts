"use server";

import {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from "@hashgraph/sdk";

export async function createTopic() {
  if (
    !process.env.HEDERA_ACCOUNT_ID ||
    !process.env.HEDERA_ACCOUNT_PRIVATE_KEY
  ) {
    throw new Error("Please set required keys in .env file.");
  }
  const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const accountKey = PrivateKey.fromStringECDSA(
    process.env.HEDERA_ACCOUNT_PRIVATE_KEY
  );
  const client = Client.forTestnet().setOperator(accountId, accountKey);

  const topicCreateTx = new TopicCreateTransaction().freezeWith(client);
  const topicCreateTxSigned = await topicCreateTx.sign(accountKey);
  const topicCreateTxResponse = await topicCreateTxSigned.execute(client);
  const topicCreateTxReceipt = await topicCreateTxResponse.getReceipt(client);
  console.log(topicCreateTxReceipt);
  const topicId = topicCreateTxReceipt.topicId;
  if (!topicId) {
    throw new Error("Failed to create topic: topicId is null.");
  }
  const topicExplorerUrl = `https://hashscan.io/testnet/topic/${topicId.toString()}`;
  return {
    topicId: topicId.toString(),
  };
}

interface SubmitMessageResult {
  transactionId: string;
  topicSequenceNumber: number;
}

export async function submitMessage(
  topicId: string,
  message: string
): Promise<SubmitMessageResult> {
  if (
    !process.env.HEDERA_ACCOUNT_ID ||
    !process.env.HEDERA_ACCOUNT_PRIVATE_KEY
  ) {
    throw new Error("Please set required keys in .env file.");
  }
  const accountId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const accountKey = PrivateKey.fromStringECDSA(
    process.env.HEDERA_ACCOUNT_PRIVATE_KEY
  );
  const client = Client.forTestnet().setOperator(accountId, accountKey);
  const topicMsgSubmitTx = new TopicMessageSubmitTransaction({
    topicId: topicId,
    message: message,
  }).freezeWith(client);
  const topicMsgSubmitTxSigned = await topicMsgSubmitTx.sign(accountKey);
  const topicMsgSubmitTxResponse = await topicMsgSubmitTxSigned.execute(client);
  const topicMsgSubmitTxReceipt = await topicMsgSubmitTxResponse.getReceipt(
    client
  );
  return {
    transactionId: topicMsgSubmitTx.transactionId
      ? topicMsgSubmitTx.transactionId.toString()
      : "",
    topicSequenceNumber: topicMsgSubmitTxReceipt.topicSequenceNumber.toNumber(),
  };
}
