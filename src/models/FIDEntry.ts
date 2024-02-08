import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class FIDEntry {
  @prop({ index: true, required: true })
  fid!: number
  @prop({ index: true, required: true, default: 1200 })
  score!: number
  @prop({ index: true, required: true, default: 0 })
  votes!: number
}

export const FIDEntryModel = getModelForClass(FIDEntry)
