import searchLinear from "./SearchObject.js";
export default function getGlucoseRange(obj,glucose){
    const glucoseLevel = obj.glucose_levels;
    const find = searchLinear(glucoseLevel,glucose,"min_mg_dl","max_mg_dl");
    return find.level;
}