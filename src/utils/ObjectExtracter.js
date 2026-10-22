export default function extractFoodSugestion(obj, glucoseRange,ageRange,gender){
    if(glucoseRange ===null || ageRange===null || gender ===null) return;
    const data= obj[glucoseRange][`${ageRange} ${gender}`];
    return data;
}

import readModel from "./sucroseModelReader.js";

const test = async ()=>{
    const data = await readModel();
    const obj = data.recommendations;
    const result = await extractFoodSuugestion(obj,"100-119","18-39","male");
    console.log(result);
}