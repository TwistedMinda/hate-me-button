import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers" 
import { expect } from "chai";
import { deployContract } from "../artifacts/contracts/src/tools";
import { HateMe } from "../typechain-types";
import { ethers } from "hardhat";

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractRunner, ContractTransactionReceipt, ContractTransactionResponse, TransactionReceipt } from "ethers";
const { network } = require('hardhat');

const toWei = (val: number) => ethers.parseUnits(val.toString(), 18)
const displayEther = (val: number | bigint) => ethers.formatUnits(val, 18)

let contract: HateMe

const bucketSlug = ethers.toUtf8Bytes("julius")
const amount = ethers.parseUnits("0.001", 18)

const getBalance = async (address: string) =>
  await ethers.provider.getBalance(address)

const getFormattedBalance = async (address: string) =>
  displayEther(await getBalance(address))

const log = async (action?: string) => {
  const [owner, user2] = await ethers.getSigners()
  const state = {
    User1: await getFormattedBalance(owner.address),
    User1_Claimable: displayEther((await contract.buckets(bucketSlug)).claimable),
    _: '----------------',
    User2: await getFormattedBalance(user2.address),
  }
  console.log(action)
  console.table(state)
}

const waitFor = async (receipt: Promise<ContractTransactionResponse>) =>
  await (await receipt).wait(1)

describe("HateMe", function () {
  
  it("create bucket", async function () {
    const [owner] = await ethers.getSigners()
    contract = await deployContract()

    await expect(
      waitFor(contract.connect(owner).createBucket(bucketSlug))
    ).to.emit(contract, "BucketCreated")
  })

  it("bucket already exists", async function () {
    const [owner] = await ethers.getSigners()

    await expect(
      waitFor(contract.connect(owner).createBucket(bucketSlug))
    ).to.revertedWithCustomError(contract, "BucketAlreadyExists")
  })

  it("hate someone", async function () {
    const [_, user2] = await ethers.getSigners()
    const contractAddr = await contract.getAddress()   

    await expect(
      contract.connect(user2).hateMe(bucketSlug, { value: amount })
    ).to.changeEtherBalance(contractAddr, amount)
  })

  it("love someone", async function () {
    const [_, user2] = await ethers.getSigners()
    const contractAddr = await contract.getAddress() 

    await expect(
      contract.connect(user2).kiddingILoveYou(bucketSlug, { value: amount })
    ).to.changeEtherBalance(contractAddr, amount)
  })

  it("non-owner can't claim", async function () {
    const [_, user2] = await ethers.getSigners()

    await expect(
      waitFor(contract.connect(user2).claim(bucketSlug))
    ).to.revertedWithCustomError(contract, "YouAreNotTheOwner")
  })
  
  it("owner can claim", async function () {
    const [owner] = await ethers.getSigners()
    
    await expect(
      contract.connect(owner).claim(bucketSlug)
    ).to.changeEtherBalance(owner, amount + amount)
  })

  it("can't claim twice", async function () {
    const [owner] = await ethers.getSigners()
    
    await expect(
      waitFor(contract.connect(owner).claim(bucketSlug))
    ).to.revertedWithCustomError(contract, "NothingToClaim")
  })

  it("can't create bad slugs", async function () {
    const tooShort = ethers.toUtf8Bytes("ju")
    const tooLong = ethers.toUtf8Bytes(Array(50).fill(0).toString())
    
    await expect(
      waitFor(contract.createBucket(tooShort))
    ).to.revertedWithCustomError(contract, "SlugMustBeAtLeast3Characters")

    await expect(
      waitFor(contract.createBucket(tooLong))
    ).to.revertedWithCustomError(contract, "SlugMustBeAMaximumOf50Characters")
  })
})
