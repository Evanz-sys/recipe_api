import Recipe from "../models/Recipes.model.js";
import { uploadImage, deleteImage } from "../Cloudinary.js";
import fs from "fs/promises";
import { RecipesSchema } from "../schemas/recipe.schema.js";
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from "../config.js";



// Function to get all recipes
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get a recipe by its ID
export const getRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to create a new recipe
export const createRecipe = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);

    // Obtener el `userId` del token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    const decodedToken = jwt.verify(token, TOKEN_SECRET);
    const userId = decodedToken.id;

    // Validar el cuerpo de la solicitud usando Zod
    const validatedData = RecipesSchema.parse({
      name: req.body.name,
      ingredients: req.body.ingredients.split(','),
      instructions: req.body.instructions,
      preparationTime: parseInt(req.body.preparationTime, 10),
      calories: parseInt(req.body.calories, 10),
      userId, // Asignar el `userId` obtenido
    });

    // Crear una nueva receta con los datos validados
    const recipe = new Recipe(validatedData);

    if (req.files?.image) {
      try {
        console.log('Uploading image:', req.files.image.tempFilePath);
        const result = await uploadImage(req.files.image.tempFilePath);
        recipe.image = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };

        // Eliminar el archivo temporal después de la subida
        await fs.unlink(req.files.image.tempFilePath);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    }

    // Guardar la receta en la base de datos
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Function to add a comment to a recipe
export const addCommentToRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const user = req.user;
    console.log(user)

    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await Recipe.updateOne({userId: user._id}, {
      $push: {
        comment: {
          user: user._id,
          username: user.username,
          comment: comment.comment
        }
      }
    })

    /*
    // Add the comment to the recipe's comments array
    recipe.comments.push({
      user: user._id, // Save the user's ID
      username: user.username, // Save the author's username
      comment,
      createdAt: new Date(),
    });
    */

    await recipe.save();

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to get recipes of a user by their user ID
export const getUserRecipes = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verifica si userId es un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    console.log('Fetching recipes for user:', userId); // Añadir registro para depuración
    const recipes = await Recipe.find({ userId: mongoose.Types.ObjectId(userId) });
    console.log('Found recipes:', recipes); // Añadir registro para depuración
    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Function to update a user's recipe by their user ID and recipe ID
export const updateUserRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const reqUserId = req.user._id;

    if (reqUserId !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this recipe" });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Function to delete a user's recipe by their user ID and recipe ID
export const deleteUserRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: recipeId, userId });
    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (deletedRecipe.image.public_id) {
      await deleteImage(deletedRecipe.image.public_id);
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};