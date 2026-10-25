import getRecommendation from "../services/getAllRec.js";

// Fisher-Yates shuffle (returns a new array, doesn't mutate the original)
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const ITEMS_PER_MEAL = 3;

export default async function mealPlaner(glucose, age, gender) {
    const data = await getRecommendation(glucose, age, gender);
    if (!data) return null;

    const foods = shuffle(data.foods.map(v => v.food));
    const pairs = shuffle(data.pairs.map(v => v.foods));

    const used = new Set();          // no food repeated in the same day
    const plan = {};

    for (const meal of ["breakfast", "lunch", "dinner"]) {
        const items = [];
        let combo = null;

        // 1) take the next combo whose foods are all still unused
        const pair = pairs.find(p => p.every(f => !used.has(f)));
        if (pair) {
            combo = pair;
            pair.forEach(f => { used.add(f); items.push(f); });
        }

        // 2) fill the rest with the next shuffled foods
        for (const f of foods) {
            if (items.length >= ITEMS_PER_MEAL) break;
            if (used.has(f)) continue;
            used.add(f);
            items.push(f);
        }

        plan[meal] = { items, combo };
    }
    return plan; // { breakfast: {items, combo}, lunch: {...}, dinner: {...} }
}
