import { IProcessor } from 'typeorm-fixtures-cli'
import { RecipeEntity } from '../src/entities'

export default class RecipeProcessor implements IProcessor<RecipeEntity> {
  postProcess(name: string, object: { [key: string]: any }): void {
    // console.log(name)
    // console.log(object)
    // console.log(typeof object)
  }
}
