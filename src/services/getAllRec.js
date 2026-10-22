import readModel from "../utils/sucroseModelReader.js";
import extractFoodSuugestion from "../utils/ObjectExtracter.js";

export default async function getRecommendation(){
    const data = await readModel();
    const recommendations = data.recommendations;
}