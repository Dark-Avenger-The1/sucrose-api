import checkInput from "../utils/InputRulesHelper.js";
import readModel from "../utils/sucroseModelReader.js";


export default async function glucoseChecker(glucose=null){
    const data = await readModel();
    if(glucose===null) return;
    if(await checkInput(null,null,glucose)) return;

    const limits = ()=>{
        let result=null;
        data.glucose_levels.forEach((val,index)=>{
            if(glucose>val.min_mg_dl && glucose<=val.max_mg_dl){
                result =val.limits_per_100g;
            }
        })
        return result;
    }

    const clinicalBands = ()=>{
        let result = null;
        data.clinical_bands.forEach((val,index)=>{
            if(glucose>val.min_mg_dl && glucose<=val.max_mg_dl){
                result =val.band;
            }
        })
        return result;
    }

    const notes = ()=>{
        if(glucose<70){
            return {
                note:data.notes.low,
                disclaimer:data.notes.disclaimer
            }
        }else if(glucose>100){
             return {
                note:data.notes.high,
                disclaimer:data.notes.disclaimer
            }
        }
        
    }

    return {
        clinicalBand:clinicalBands(),
        limits:limits(),
        note:notes()
    }
}

const test = async ()=>{
    console.log(`Test 1: ${JSON.stringify(await glucoseChecker())}`);
    console.log(`Test 2: ${JSON.stringify(await glucoseChecker(10))}`);
    console.log(`Test 3: ${JSON.stringify(await glucoseChecker(601))}`);
    console.log(`Test 4: ${JSON.stringify(await glucoseChecker(101))}`);
    console.log(`Test 1: ${JSON.stringify(await glucoseChecker(92))}`);
}

test()