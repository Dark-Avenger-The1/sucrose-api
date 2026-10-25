import express from 'express';


const router = express.Router();

// Controllers
import mealPlaner from './src/controller/mealController.js';
import foodListSuggestion from './src/controller/foodController.js';
import comboListSuggestion from './src/controller/comboController.js';

//Helpers
import handle from './src/utils/controllerHandler.js';

router.get("/food",handle(foodListSuggestion));

router.get('/combo',handle(comboListSuggestion));

router.get("/meal-plan",handle(mealPlaner));

router.get("/glucose-check", (req, res) => {
    res.status(501).json({ error: "Not implemented yet" });
});


export default router;