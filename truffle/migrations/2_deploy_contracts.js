var PropertyManager = artifacts.require("./PropertyManager.sol");

module.exports = function(deployer, network, accounts) {
  if (network == "live") {
    // Do something specific to the network named "live".
  } else {
    // Perform a different step otherwise.
  }
  deployer.deploy(PropertyManager);
};
