import getRecommendation from "../services/getAllRec.js";

export default async function foodListSuggestion(glucose,age,gender){
    
    const data = await getRecommendation(glucose,age,gender);
    
    const foodList=data.foods.map((val)=>{
        return {
            food: val.food,
            net_carb_100g:val.net_carb_100g
        }
    })
    return foodList;
}