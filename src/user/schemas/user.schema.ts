import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  user_name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: false })
  created_at: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// import * as mongoose from 'mongoose';

// export const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     unique: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
//   created_at: {
//     type: Number,
//   },
// });
