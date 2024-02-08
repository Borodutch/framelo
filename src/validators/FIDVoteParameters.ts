import { IsInt, Min } from 'amala'

export default class {
  @IsInt()
  @Min(0)
  aFID!: number
  @IsInt()
  @Min(0)
  bFID!: number
}
