import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import recipeRoute from "./routes/recipe.route.js";
import Recipe from "./models/Recipes.model.js";

const app = express();
const corsOptions = {
  origin: ['http://localhost:4000', 'https://my-recipes-liart.vercel.app/', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
};
app.use(cors(corsOptions));

app.get('/api', (req, res) => {});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", authRoutes);
app.use('/api/Recipe', recipeRoute)
app.post('/api/recipe/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { user, comment } = req.body;

    try {
        // Verificar si el ID de receta es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid recipe ID' });
        }

        // Crear un nuevo comentario
        const newComment = { user, comment };

        // Actualizar la receta con el nuevo comentario
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            id,
            { $push: { comments: newComment } },
            { new: true }
        );

        // Verificar si la receta existe
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Enviar la receta actualizada como respuesta
        res.json(updatedRecipe);
    } catch (error) {
        // Manejar errores
        console.error("Error adding comment:", error);
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
});


export default app;