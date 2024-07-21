import mongoose from "mongoose";

const RecipesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true 
    },
    image: {
      public_id: String,
      secure_url: String
    },
    ingredients: {
      type: [String], 
      required: true,
      index: true
    },
    instructions: {
      type: String,
      required: true
    },
    preparationTime: {
      type: Number, 
      min: 0
    },
    calories: {
      type: Number,
      required: true,
      min: 0
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      comment: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now 
    }
  },
  {
    timestamps: true,
    index: true 
  }
);

export default mongoose.model('Recipe', RecipesSchema);
