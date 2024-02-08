import { IsMongoId } from 'amala'

export default class {
  @IsMongoId()
  a!: string
  @IsMongoId()
  b!: string
}
