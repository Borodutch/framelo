import { IsMongoId, IsOptional } from 'amala'

export default class {
  @IsOptional()
  @IsMongoId()
  aId?: string
  @IsOptional()
  @IsMongoId()
  bId?: string
}
