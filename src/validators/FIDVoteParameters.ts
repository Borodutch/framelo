import { IsInt, Min } from 'amala'

export default class {
  @IsInt()
  @Min(0)
  aFID!: string
  @IsInt()
  @Min(0)
  bFID!: string
}
