import getRecommendation from "../services/getAllRec.js";
import readModel from "../utils/sucroseModelReader.js";
import itemForLevel from "../utils/GroupItems.js";

// Fisher-Yates shuffle (returns a new array, doesn't mutate the original)
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const MEALS = ["breakfast", "lunch", "dinner"];
const GROUPS_PER_MEAL = 3;

// Some combo foods are missing from this level's foods list (e.g. Raw tomatoes),
// so build a code -> { food, net_carb_100g } lookup from the whole model.
function buildGroupLookup(model) {
    const lookup = new Map();
    for (const level of Object.values(model.recommendations))
        for (const grp of Object.values(level))
            for (const f of grp.foods)
                lookup.set(f.code, { food: f.food, code: f.code, net_carb_100g: f.net_carb_100g });
    return lookup;
}

export default async function mealPlaner(glucose, age, gender) {
    const model = await readModel();
    const data = await getRecommendation(model, glucose, age, gender);
    if (!data) return null;

    const lookup = buildGroupLookup(model);

    // Same shape as foodListSuggestion: { food, code, net_carb_100g, items }
    const buildEntry = (code) => {
        const g = lookup.get(code);
        if (!g) return null;
        const items = itemForLevel(model, code, glucose).map(v => ({
            code: v.code,
            name: v.name,
            net_carb_100g: v.net_carb_100g,
        }));
        return items.length ? { ...g, items } : null;   // skip groups with nothing allowed at this level
    };

    const foods = shuffle(data.foods.map(f => buildEntry(f.code)).filter(Boolean));
    const combos = shuffle(
        data.pairs
            .map(p => ({ names: p.foods, entries: p.codes.map(buildEntry) }))
            .filter(p => p.entries.every(Boolean))
    );

    const used = new Set();   // no food group repeated in the same day
    const plan = {};

    for (const meal of MEALS) {
        const entries = [];
        let combo = null;

        // 1) take the next combo whose groups are all still unused
        const pair = combos.find(p => p.entries.every(e => !used.has(e.code)));
        if (pair) {
            combo = pair.names;
            for (const e of pair.entries) { used.add(e.code); entries.push(e); }
        }

        // 2) fill the rest with the next shuffled food groups
        for (const e of foods) {
            if (entries.length >= GROUPS_PER_MEAL) break;
            if (used.has(e.code)) continue;
            used.add(e.code);
            entries.push(e);
        }

        plan[meal] = { combo, foods: entries };
    }
    return plan;
}