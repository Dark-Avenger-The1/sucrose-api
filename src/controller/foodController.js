import getRecommendation from "../services/getAllRec.js";
import getFoodItem from "../services/ExtractFoodGroup.js";
import readModel from "../utils/sucroseModelReader.js";
import itemForLevel from "../utils/GroupItems.js";
export default async function foodListSuggestion(glucose,age,gender){
    const model = await readModel();
    const data = await getRecommendation(model,glucose,age,gender);
    
    const foodList=await data.foods.map((val)=>{
        const food= val.food;
        const code = val.code;
        return {
            food: food,
            code:code,
            net_carb_100g:val.net_carb_100g,
            items:itemForLevel(model,code,glucose).map((val)=>{
                return {
                    code:val.code,
                    name:val.name,
                    net_carb_100g: val.net_carb_100g
                }
            })
        }
    })
    return await foodList;
}