import checkInput from "../utils/InputRulesHelper.js";
import readModel from "../utils/sucroseModelReader.js";
import searchLinear from "../utils/SearchObject.js";

export default function glucoseChecker(data,glucose=null){
    const sugarLimit = searchLinear(data.glucose_levels,glucose,"min_mg_dl","max_mg_dl");

    
    const clinicDiagnose = searchLinear(data.clinical_bands,glucose,"min_mg_dl","max_mg_dl");
    
    const notes = () => {
        if (glucose < 70)   return { note: data.notes.low, disclaimer: data.notes.disclaimer };
        if (glucose >= 100) return { note: data.notes.high, disclaimer: data.notes.disclaimer };
        return { note: "Blood sugar is normal", disclaimer: data.notes.disclaimer };
    };

    return {
        clinicalBand:clinicDiagnose?.band ?? null,
        limits:sugarLimit?.limits_per_100g ?? null,
        note:notes() ?? null
    }
}

// const test = async ()=>{
//     console.log(`Test 1: ${JSON.stringify(await glucoseChecker())}`);
//     console.log(`Test 2: ${JSON.stringify(await glucoseChecker(10))}`);
//     console.log(`Test 3: ${JSON.stringify(await glucoseChecker(601))}`);
//     console.log(`Test 4: ${JSON.stringify(await glucoseChecker(101))}`);
//     console.log(`Test 5: ${JSON.stringify(await glucoseChecker(92))}`);
// }

// test()