// This is where we import our contract ABI's,
// This makes them callable from redux state as a this.props
// Current under state.common.contracts in common.js

import PropertyManager from '../../truffle/build/contracts/PropertyManager.json';

export default {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:7545"
    }
  },
  contracts: {
    PropertyManager
  }
}
