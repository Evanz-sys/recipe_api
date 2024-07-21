import express from 'express';
import { auth } from '../middlewares/auth.middleware.js';
import fileUpload from "express-fileupload";
import {
  getRecipes,
  getRecipe,
  createRecipe,
  addCommentToRecipe,
  getUserRecipes,
  updateUserRecipe,
  deleteUserRecipe
} from '../controllers/recipes.controller.js';

const router = express.Router();

router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.post('/', auth, fileUpload({
  useTempFiles : true,
  tempFileDir : './images'
}),createRecipe);

router.post('/:id/comments', auth, addCommentToRecipe);

router.get('/api/Recipe/user/:userId/recipes', auth, getUserRecipes); // Get user recipes
router.put('/user/:userId/recipes/:recipeId', auth, updateUserRecipe); // Update user recipe
router.delete('/user/:userId/recipes/:recipeId', auth, deleteUserRecipe); // Delete user recipe

export default router;
