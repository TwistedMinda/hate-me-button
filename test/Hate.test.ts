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
  ethers.formatUnits(await ethers.provider.getBalance(address))

let steps: any = []

const log = async (action?: string) => {
  const [owner] = await ethers.getSigners()
  console.clear()
  if (!steps) {
    steps = []
  }
  if (action) {
    steps.push({
      ACTION: action,
    })
  }
  const state = {
    ETH: await getBalance(owner.address),
  }
  steps.push(state)
  let baseKey = ''
  const transformed = steps.reduce((acc: any, {ACTION = baseKey, ...x}) => {
    baseKey += '.'
    acc[ACTION] = x;
    return acc
  }, {})
  console.table(transformed)
}

describe("HateMe", function () {
  it("Generate number", async function () {
    await log('Startup')

    contract = await deployContract()

    await log('Deploy')

    await contract.test()
    
    await log('End')
  })
})
