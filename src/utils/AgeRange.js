import searchLinear from "./SearchObject.js";

export default function getAgeRange(obj,age){
    const ageGroups = obj.age_groups;
    const find = searchLinear(ageGroups,age,"min_age","max_age");
    return find.group;
}