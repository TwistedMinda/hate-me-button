### Usage

- Find yourself a unique slug 🎯 (ex: julius) 
- Create your bucket 🪣 at [hateYouButton](https://hate-me-button.vercel.app)
- Share your link 🔗 : https://hate-me-button.vercel.app/julius
- Let people 😡 hate you or 💖 you, either way you win 👌
- Claim earnings 🌟 at any time

## Contract

```solidity
function createBucket(bytes memory slug) external; // Free

function hateYou(bytes memory slug) external payable; // Minimum 1 FTM
function kiddingILoveYou(bytes memory slug) external payable; // Minimum 1 FTM

function claim(bytes memory slug) external; // Free
```