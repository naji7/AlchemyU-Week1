const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const {
  toHex,
  hexToBytes,
  utf8ToBytes,
} = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  df9e698af5380d3a43fcec1f23c1483cf9102fa9: 100,
  "7d3da48b36998554cb84a68301dfcc88acdc2cf2": 50,
  "2146a928d85d7878d074686b4a77f7826c25384f": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, signature } = req.body;
  const sig = new secp256k1.Signature(
    BigInt(signature.r),
    BigInt(signature.s),
    parseInt(signature.recovery)
  );
  const msgHash = keccak256(utf8ToBytes(amount.toString()));
  const publicKey = sig.recoverPublicKey(msgHash).toHex();
  const senderAddress = toHex(
    keccak256(hexToBytes(publicKey).slice(1)).slice(-20)
  );

  if (senderAddress !== sender) {
    res.status(400).send({ message: "Only owner is allowed to transfer!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
