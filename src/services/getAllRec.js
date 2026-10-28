import readModel from "../utils/sucroseModelReader.js";
import extractFoodSugestion from "../utils/ObjectExtracter.js";
import getAgeRange from "../utils/AgeRange.js";
import getGlucoseRange from "../utils/GlucoseRange.js";
export default async function getRecommendation(data,glucose,age,gender){
    const recommendations = data.recommendations;
    const glucose_level = getGlucoseRange(data,glucose);
    const age_groups  = getAgeRange(data,age);
    const foodSuggestion = extractFoodSugestion(recommendations,glucose_level,age_groups,gender);
    return foodSuggestion;
}
