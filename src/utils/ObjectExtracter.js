export default function extractFoodSugestion(obj, glucoseRange,ageRange,gender){
    if(glucoseRange ===null || ageRange===null || gender ===null) return;
    const data= obj[glucoseRange][`${ageRange} ${gender}`];
    return data;
}

