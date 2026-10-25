import readModel from "./sucroseModelReader.js";

export default async function checkInput(age = null, gender = null, glucose = null) {
    const { input_rules: rules } = await readModel();
    const [minG, maxG] = rules.glucose_range_mg_dl;

    if (age != null && age < rules.min_age)
        return `age must be ${rules.min_age} or older`;
    if (gender != null && !rules.genders.includes(gender))
        return `gender must be one of: ${rules.genders.join(", ")}`;
    if (glucose != null && (glucose < minG || glucose > maxG))
        return `glucose must be between ${minG} and ${maxG} mg/dL`;

    return null;
}