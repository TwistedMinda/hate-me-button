// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract HateMe {

  event BucketCreated(bytes, address);
  event Loved(bytes, uint amount);
  event Hated(bytes, uint amount);
  event Claimed(address, uint amount);

  struct Bucket {
    bytes slug;
    bool exists;
    uint hated;
    uint loved;
    uint gains;
    uint claimable;
    address owner;
  }

  struct Stats {
    uint totalGains;
    uint totalLoved;
    uint totalHated;
  }

  mapping (bytes => Bucket) public buckets;
  Stats public stats;

  modifier checkLowerCase(bytes memory str) {
    _;
    for (uint i = 0; i < str.length; i++) {
      if (str[i] >= 0x41 && str[i] <= 0x5A) {
        revert("String must be lowercase");
      }
    }
  }

  /**
   * Create bucket
   */
  function createBucket(bytes memory slug) external checkLowerCase(slug) {
    require(slug.length >= 3, "slug must be at least 3 characters");
    require(slug.length <= 50, "slug must be a maximum of 50 characters");
    if (buckets[slug].exists) {
      revert("Bucket already exists");
    }
    buckets[slug] = Bucket(slug, true, 0, 0, 0, 0, msg.sender);
    emit BucketCreated(slug, msg.sender);
  }

  /**
   * Hate someone
   */
  function hateMe(bytes memory slug) external payable {
    require(buckets[slug].exists, "Bucket does not exist");
    require(msg.value >= 1 ether, "You must send some ether");
    buckets[slug].hated += 1;
    buckets[slug].gains += msg.value;
    buckets[slug].claimable += msg.value;
    stats.totalGains += msg.value;
    stats.totalHated += 1;
    emit Hated(slug, msg.value);
  }

  /**
   * Kidding, love someone
   */
  function kiddingILoveYou(bytes memory slug) external payable {
    require(buckets[slug].exists, "Bucket does not exist");
    require(msg.value >= 1 ether, "You must send some ether");
    buckets[slug].loved += 1;
    buckets[slug].gains += msg.value;
    buckets[slug].claimable += msg.value;
    stats.totalGains += msg.value;
    stats.totalLoved += 1;
    emit Loved(slug, msg.value);
  }

  /**
   * Claim gains for slug
   */
  function claim(bytes memory slug) external {
    require(buckets[slug].owner == msg.sender, "You're not the owner");
    uint amount = buckets[slug].claimable;
    require(amount > 0, "Nothing to claim");
    payable(msg.sender).transfer(amount);
    buckets[slug].claimable = 0;
    emit Claimed(msg.sender, amount);
  }

}