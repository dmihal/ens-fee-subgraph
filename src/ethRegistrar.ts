// Import types and APIs from graph-ts
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

import {
  createEventID, ROOT_NODE, EMPTY_ADDRESS,
  uint256ToByteArray, byteArrayFromHex, concat
} from './utils'

import { Chainlink } from "./types/EthRegistrarController/Chainlink"

import {
  NameRegistered as ControllerNameRegisteredEvent,
  NameRenewed as ControllerNameRenewedEvent
} from './types/EthRegistrarController/EthRegistrarController'

// Import entity types generated from the GraphQL schema
import { ENS } from './types/schema'

let EIGHT_DECIMALS = BigInt.fromI32(10).pow(8).toBigDecimal()
let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()

function getSingleton(): ENS {
  let ens = ENS.load('ens')
  if (!ens) {
    ens = new ENS('ens')
    ens.ethCollected = BigInt.fromI32(0).toBigDecimal()
    ens.usdCollected = BigInt.fromI32(0).toBigDecimal()
  }
  return ens!
}

function getETHPrice(): BigDecimal {
  let chainlink = Chainlink.bind(Address.fromString('0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'))
  return chainlink.latestAnswer().divDecimal(EIGHT_DECIMALS)
}

export function handleNameRegisteredByController(event: ControllerNameRegisteredEvent): void {
  let ens = getSingleton()
  let cost = event.params.cost.divDecimal(EIGHTEEN_DECIMALS)
  ens.ethCollected += cost
  // ens.usdCollected += cost * getETHPrice()
  ens.save()
}

export function handleNameRenewedByController(event: ControllerNameRenewedEvent): void {
  let ens = getSingleton()
  let cost = event.params.cost.divDecimal(EIGHTEEN_DECIMALS)
  ens.ethCollected += cost
  // ens.usdCollected += cost * getETHPrice()
  ens.save()
}
