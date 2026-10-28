import checkInput from "./InputRulesHelper.js";
import glucoseChecker from "../services/CheckGlucose.js";
function parseInput(query) {
    const glucose = Number(query.glucose);
    const age = Number(query.age);
    const gender = String(query.gender ?? "").toLowerCase();

    if (query.glucose === undefined || !Number.isFinite(glucose))
        return { error: "glucose is required and must be a number" };
    if (query.age === undefined || !Number.isFinite(age))
        return { error: "age is required and must be a number" };
    if (!gender)
        return { error: "gender is required" };

    return { glucose, age, gender };
}

const handle = (service) => async (req, res, next) => {
    try {
        const { glucose, age, gender, error } = parseInput(req.query);
        if (error) return res.status(400).json({ error });

        const ruleError = await checkInput(age, gender, glucose);
        if (ruleError) return res.status(400).json({ error: ruleError });

        const result = await service(glucose, age, gender);
        if (!result)
            return res.status(404).json({ error: "No recommendation found for this input" });

        res.json({
            data: result,
            disclaimer: "Educational prototype, not medical advice.",
        });
    } catch (err) {
        next(err);   // real failures become a 500, not a 400
    }
};

const handleGlucose = (service)=>async(req,res,next)=>{
    try {
        const glucose = Number(req.query.glucose);

        const result = await service(glucose);
        if (!result)
            return res.status(404).json({ error: "No recommendation found for this input" });

        res.json(result);
    } catch (error) {
        next(error.message); 
    }
}
export {handle,handleGlucose};