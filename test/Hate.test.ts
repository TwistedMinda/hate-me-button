import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers" 
import { expect } from "chai";
import { deployContract } from "../artifacts/contracts/src/tools";
import { HateMe } from "../typechain-types";
import { ethers } from "hardhat";

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractRunner } from "ethers";

/*

const amountValue = ethers.parseUnits(amount.toString(), decimals)
const amountTxt = ethers.formatUnits(amountValue, decimals)

*/

let contract: HateMe

const getBalance = async (address: string) =>
  await ethers.provider.getBalance(address)

const getFormattedBalance = async (address: string) =>
  ethers.formatUnits(await getBalance(address))

let steps: any = []

const log = async (action?: string) => {
  const [owner, user2] = await ethers.getSigners()
  const state = {
    User1: await getFormattedBalance(owner.address),
    User1_Claimable: ethers.formatUnits(await contract.gains(owner.address)),
    _: '----------------',
    User2: await getFormattedBalance(user2.address),
    User2_Claimable: ethers.formatUnits(await contract.gains(user2.address)),
  }
  console.log(action)
  console.table(state)
}

describe("HateMe", function () {
  it("hate someone", async function () {
    const [owner, user2] = await ethers.getSigners()

    contract = await deployContract()
    const contractAddr = await contract.getAddress()

    const amount = ethers.parseUnits("5", 18)
    const bucketSlug = ethers.toUtf8Bytes("julius")
   
    await expect(
      contract.connect(owner).createBucket(bucketSlug)
    ).to.emit(contract, "BucketCreated")

    await expect(
      contract.connect(owner).createBucket(bucketSlug)
    ).to.revertedWith("Bucket already exists")

    await expect(
      contract.connect(user2).hateMe(bucketSlug, { value: amount })
    ).to.changeEtherBalance(contractAddr, amount)

    await expect(
      contract.connect(user2).kiddingILoveYou(bucketSlug, { value: amount })
    ).to.changeEtherBalance(contractAddr, amount)
    
    await expect(
      contract.connect(user2).claim(bucketSlug)
    ).to.revertedWith("You're not the owner")
    
    await expect(
      contract.connect(owner).claim(bucketSlug)
    ).to.changeEtherBalance(owner, amount + amount)
    
    await expect(
      contract.connect(owner).claim(bucketSlug)
    ).to.revertedWith('Nothing to claim')
  })

  it("can't create bad slugs", async function () {

    const tooShort = ethers.toUtf8Bytes("ju")
    const tooLong = ethers.toUtf8Bytes(Array(50).fill(0).toString())
    
    await expect(
      contract.createBucket(tooShort)
    ).to.reverted

    await expect(
      contract.createBucket(tooLong)
    ).to.reverted
  })
})
