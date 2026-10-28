import glucoseChecker from "../services/CheckGlucose.js";
import readModel from "../utils/sucroseModelReader.js";
export default async function glucoseController(glucose){
    const model = await readModel();
    const inputRules = model.input_rules.glucose_range_mg_dl;
    if(glucose === null) throw new Error("Input must not be empty.")
    if(inputRules[0]>glucose || glucose>inputRules[1]) throw new Error("Value given is absurd");

    const data = glucoseChecker(model,glucose);

    return data;
}