pragma solidity ^0.4.4;

contract PropertyManager {


  // An event for when a property is marked as booked;
  event PropertyBooked();

  // An event for when a new property is added
  event NewProperty();

  // Create a list of properties
  Property[] public propertyList;

  // Assigns a property to an address
  mapping (uint => address) propertyToOwner;

  // A count of how many properties an owner has
  mapping (address => uint) ownerPropertyCount;

  // The object structure of a property
  struct Property {
    uint price;
  }

  // Adding a property
  function addProperty(uint _price) public {
    propertyList.push(Property(_price));
    emit NewProperty();
  }
}
