import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class Entry {
  @prop({ index: true, required: true })
  title!: string
  @prop({ index: true, required: true })
  imageURL!: string
  @prop({ index: true, required: true, default: 1300 })
  score!: number
}

export const EntryModel = getModelForClass(Entry)
