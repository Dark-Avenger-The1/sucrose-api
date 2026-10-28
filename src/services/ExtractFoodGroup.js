import itemForLevel from "../utils/GroupItems.js";
import readModel from "../utils/sucroseModelReader.js";

export default function getFoodItem(groupCode,glucose){
    const data = itemForLevel(model,groupCode,glucose).map((val)=>{
        return {
            code:val.code,
            name:val.name,
            net_carb_100g: val.net_carb_100g
        }
    });
    return data
}