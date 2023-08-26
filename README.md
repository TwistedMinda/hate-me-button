### Usage

- Find yourself a unique slug 🎯 (ex: julius) 
- Create your bucket 🪣 at [HateMeButton](https://hate-me.vercel.app/)
- Share your link 🔗 : https://hate-me.vercel.app/julius
- Let people 😡 hate you or 💖 you, either way you win 👌
- Claim earnings 🌟 at any time

## Contract

```solidity
function createBucket(bytes memory slug) external; // Free

function hateMe(bytes memory slug) external payable; // Minimum 1 FTM
function kiddingILoveYou(bytes memory slug) external payable; // Minimum 1 FTM

function claim(bytes memory slug) external; // Free
```