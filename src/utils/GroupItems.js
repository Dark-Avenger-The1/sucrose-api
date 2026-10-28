import readModel from "./sucroseModelReader.js";
import getGlucoseRange from "./GlucoseRange.js";
import searchLinear from "./SearchObject.js";
export default function itemForLevel(model,groupCode,glucose){
    const item = model.group_items?.[String(groupCode)] ?? [];
    const level = searchLinear(model.glucose_levels,glucose,"min_mg_dl","max_mg_dl");
    if(!level) return [];
    const lim = level.limits_per_100g;
    const fib = model.fiber_exception ?? {min_fiber:1.5,max_sugar:12};
    return item.filter((val)=>{
        const sugarOK = val.sugar_100g <=lim.sugar || (val.fiber_100g >= fib.min_fiber && val.fiber_100g <= fib.max_sugar);
        return sugarOK && val.net_carb_100g <= lim.net_carb && val.sat_fat_100g <= lim.sat_fat;
    })
}

const test = async (num=null,groupCode,glucose)=>{
    const model = await readModel();
    const range = getGlucoseRange(model,glucose);

    const data = itemForLevel(model,groupCode,glucose);
    console.log(data.length);
}