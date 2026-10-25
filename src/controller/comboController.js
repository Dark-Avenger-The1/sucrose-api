import getRecommendation from "../services/getAllRec.js";

export default async function comboListSuggestion(glucose,age,gender){
    
    const data = await getRecommendation(glucose,age,gender);
    
    const foodList=data.pairs.map((val)=>{
        return {
            food: val.foods
        }
    })
    return foodList;
}
