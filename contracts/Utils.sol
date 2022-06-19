// contracts/Utils.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Utils {
    // function to check if element is in an array
    function isIn(string memory _element, string[] memory _array)
        public
        pure
        returns (bool)
    {
        bool isMatch = false;
        uint256 length = _array.length;
        for (uint256 i = 0; i < length; i++) {
            if (compareStrings(_array[i], _element)) {
                isMatch = true;
            }
        }
        return isMatch;
    }

    // function to check if item is the last item in an array
    function isLast(string memory _element, string[] memory _array)
        public
        pure
        returns (bool)
    {
        uint256 length = _array.length;
        string memory lastElement = _array[length - 1];
        return compareStrings(lastElement, _element);
    }

    // function used to compare two strings
    function compareStrings(string memory _str1, string memory _str2)
        public
        pure
        returns (bool)
    {
        return
            keccak256(abi.encodePacked(_str1)) ==
            keccak256(abi.encodePacked(_str2));
    }

    // function used to get an elements index in an array
    function indexOf(string memory _element, string[] memory _array)
        public
        pure
        returns (uint256)
    {
        uint256 length = _array.length;
        uint256 index = 0;
        for (uint256 i = 0; i < length; i++) {
            if (compareStrings(_element, _array[i])) {
                index = i;
                break;
            }
        }
        return index;
    }
}
