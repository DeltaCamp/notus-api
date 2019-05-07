import { Block } from "ethers/providers";
import { formatWei } from "../utils/formatWei";

export class BlockView {
  constructor (
    private readonly block: Block
  ) {}

  number = () => {
    return this.block.number
  }

  difficulty = () => {
    return this.block.difficulty
  }

  timestamp = () => {
    return new Date(this.block.timestamp).toString()
  }

  gasLimit = () => {
    return formatWei(this.block.gasLimit)
  }

  gasUsed = () => {
    return formatWei(this.block.gasUsed)
  }

  miner = () => {
    return this.block.miner
  }
}