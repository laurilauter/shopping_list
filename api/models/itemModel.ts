import { model, Schema } from "mongoose";

//interface
export interface IItem {
  name: string;
  active: boolean;
}
//schema
const ItemSchema: Schema = new Schema<IItem>({
  name: { type: String, required: true },
  active: { type: Boolean, required: true },
});
//model
export const Item = model<IItem>("Item", ItemSchema);
