import { useState } from "react";
import server from "./server";
import { useRef } from "react";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey, setPrivateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const inputKey = useRef();

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const onChange = (e) => {
    e.preventDefault();
    const inputData = e.target.value;
    setPrivateKey(inputData);
  };

  async function transfer(evt) {
    evt.preventDefault();
    const privateKey = inputKey.current.value;
    const msg = sendAmount.toString();
    const hashedMsg = keccak256(utf8ToBytes(msg));
    const sig = secp256k1.sign(hashedMsg, privateKey);
    sig.addRecoveryBit();
    // const publicKey = toHex(secp256k1.getPublicKey(privateKey));
    // console.log('public key ', publicKey);

    // const ownerAddress = toHex(keccak256(hexToBytes(publicKey).slice(1)).slice(-20));
    // console.log('address for : ', ownerAddress);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: {
          r: sig.r.toString(),
          s: sig.s.toString(),
          recovery: sig.recovery.toString(),
        },
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Wallet Address
        <input
          type="password"
          ref={inputKey}
          placeholder="Type your private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
