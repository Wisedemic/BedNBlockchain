import Eth from 'ethjs';

/*
  -- Production --
  If web3 already exists, return it
  else, don't return anything.
  -- Development --
  If web3 already exists, return it.
  else, fallback to a defined localhost

*/

/* --- PORTS ----
  8545: Ganache (ganache-cli)
  9545: Truffle (truffle develop)
*/

const PORT = 7545;
const fallbackUrl = `http://127.0.0.1:${PORT}`;
let eth = undefined;

const getEth = () => {
  return eth;
};

const setupEth = (provider) => {
  eth = new Eth(provider);
};

const logEthObjectVersion = (ethObject) => {
  // Check which network metamask is connected to.
  ethObject.version.getNetwork((err, netId) => {
    switch (netId) {
      case "1":
      console.log('This is mainnet')
      break
      case "2":
      console.log('This is the deprecated Morden test network.')
      break
      case "3":
      console.log('This is the ropsten test network.')
      break
      case "4":
      console.log('This is the Rinkeby test network.')
      break
      case "42":
      console.log('This is the Kovan test network.')
      break
      default:
      console.log(netId, err);
      console.log('This is an unknown network.')
    }
  });
};

/*
* This returns a new instance of web3.
* -- It checks for a browser window.
* -- It checks for MetaMask
* -- It also supports development and production builds.
* -- It waits for the browser to resolve when called in React SSR.
* -- @returns web3 instance
*/
const initEth = new Promise((resolve, reject) => {
  // Is the browser window available?
  if (process.env.BROWSER === true) {
    console.log(window);
    // Remove any browser race conditions
    window.addEventListener('load', () => {
      // If there was already a web3 object (MetaMask, or other)
      if (window.web3 !== undefined && typeof window.web3.currentProvider !== undefined) {
        // Check if it was MetaMask
        if (window.web3.currentProvider.isMetaMask !== true) {
          // What provider is this?
          console.log('who is dis?', window.web3.currentProvider);
          // Return a web3 instance using the current provider
          eth = window.web3;
          resolve(eth);
        } else {
          // Setup the MetaMask provider
          setupEth(window.web3.currentProvider)
          logEthObjectVersion(window.web3);
          resolve(eth);
        }
      } else { // web3 was undefined or no provider was found.
        // Setup Web3 with our fallbackUrl
        setupEth(new Eth.HttpProvider(fallbackUrl));
        resolve(eth);
      }
    });
  } else { // No Window found
    if (process.env.NODE_ENV === 'production') {
      // This is the only time we tell web3 to set Ethereum as the provider.
      // web3 = new Eth(Eth.providers.HttpProvider('https://mainnet.infura.io/your-api-key'));
      // resolve(web3);
      // this won't be called yet
    }
    if (process.env.NODE_ENV === 'development') {
      // Setup Web3 w/ our fallbackUrl)
      setupEth(new Eth.HttpProvider(fallbackUrl));
      resolve(eth);
    }
    reject('No Browser window and no known "NODE_ENV" environment variable found');
  }
});

export default initEth;
