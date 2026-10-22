import checkInput from "../utils/InputRulesHelper.js";
import readModel from "../utils/sucroseModelReader.js";
import searchLinear from "../utils/SearchObject.js";

export default async function glucoseChecker(glucose=null){
    const data = await readModel();
    if(glucose===null) return;
    if(await checkInput(null,null,glucose)) return;

    const limits = ()=>{
        let result=searchLinear(data.glucose_levels,glucose,"min_mg_dl","max_mg_dl");
        // let result = null;
        // data.glucose_levels.forEach((val,index)=>{
        //     if(glucose>val.min_mg_dl && glucose<=val.max_mg_dl){
        //         result =val.limits_per_100g;
        //     }
        // })
        return result.limits_per_100g;
    }
    const sugarLimit = searchLinear(data.glucose_levels,glucose,"min_mg_dl","max_mg_dl");

    const clinicalBands = ()=>{
        let result = searchLinear(data.clinical_bands,glucose,"min_mg_dl","max_mg_dl");
        // let result = null;
        // data.clinical_bands.forEach((val,index)=>{
        //     if(glucose>val.min_mg_dl && glucose<=val.max_mg_dl){
        //         result =val.band;
        //     }
        // })
        
        return result.band;
    }

    const clinicDiagnose = searchLinear(data.clinical_bands,glucose,"min_mg_dl","max_mg_dl");

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
        }else{
            return {
                note:"Blood sugar is normal",
                disclaimer:data.notes.disclaimer
            }
        }
        
    }

    return {
        clinicalBand:clinicDiagnose.band,
        limits:sugarLimit.limits_per_100g,
        note:notes()
    }
}

const test = async ()=>{
    console.log(`Test 1: ${JSON.stringify(await glucoseChecker())}`);
    console.log(`Test 2: ${JSON.stringify(await glucoseChecker(10))}`);
    console.log(`Test 3: ${JSON.stringify(await glucoseChecker(601))}`);
    console.log(`Test 4: ${JSON.stringify(await glucoseChecker(101))}`);
    console.log(`Test 5: ${JSON.stringify(await glucoseChecker(92))}`);
}

test()