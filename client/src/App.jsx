import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

//private key :  8d5ea24f098b88fcb7d08a9717a56fe8613e333e24fe28527dfc3f24a3d08acd
// public key :  0216bad57568e721cf4fa8906175846fdcc8eded09a6d15c584ddf2c2a3dc2601c
// address : df9e698af5380d3a43fcec1f23c1483cf9102fa9

// private key :  dab38cf3559d89528e94bdf5cebd8b5077ca98da8d7d82d3f121d2e7984a228b
// public key :  0386b7c4ed4359c34c2926eadd59cc30733f48b435ffda393c0132a8be4b7e9dc8
// address : 7d3da48b36998554cb84a68301dfcc88acdc2cf2

// private key :  1fba3e2c27e93a679eabf94bcb2c0898d34d4c31695c03f44b906fc54cfc9c18
// public key :  02ec0cbdc6ace976c52802c5b6133b6f13eb472cd53ec2e0c15c10760e17d4203c
// address : 2146a928d85d7878d074686b4a77f7826c25384f

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
    </div>
  );
}

export default App;
