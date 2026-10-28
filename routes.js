import express from 'express';


const router = express.Router();

// Controllers
import mealPlaner from './src/controller/mealController.js';
import foodListSuggestion from './src/controller/foodController.js';
import comboListSuggestion from './src/controller/comboController.js';
import glucoseController from './src/controller/glucoseCheckController.js';
//Helpers
import {handle,handleGlucose}from './src/utils/controllerHandler.js';

router.get("/food",handle(foodListSuggestion));

router.get('/combo',handle(comboListSuggestion));

router.get("/meal-plan",handle(mealPlaner));

router.get("/glucose-check", handleGlucose(glucoseController));


export default router;