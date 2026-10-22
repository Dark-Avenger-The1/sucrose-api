import readModel from "./sucroseModelReader.js";

export default async function checkInput(age=null,genders=null,glucose=null){
    const data = await readModel();
    const rules = data.input_rules;
    if(age!=null && age<rules.min_age){
        return true;
    }
    if(genders!=null && (genders!=rules.genders[0] && genders!=rules.genders[1])){
        return true;
    }
    if(glucose!=null && glucose<rules.glucose_range_mg_dl[0] || glucose>rules.glucose_range_mg_dl[1]){
        return true;
    }
    
    

    return false;
}

// const test = async ()=>{
//     console.log(`Test 1: ${await checkInput()}`);
//     console.log(`Test 2: ${await checkInput(17)}`);
//     console.log(`Test 3: ${await checkInput(20,"gae")}`);
//     console.log(`Test 4: ${await checkInput(19,"lesbian")}`);
//     console.log(`Test 5: ${await checkInput(19,"male",19)}`);
//     console.log(`Test 6: ${await checkInput(19,"male",601)}`);
//     console.log(`Test 7: ${await checkInput(19)}`);
//     console.log(`Test 8: ${await checkInput(20,"male")}`);
//     console.log(`Test 9: ${await checkInput(19,"male",100)}`);
//     console.log(`Test 10: ${await checkInput(null,"male",100)}`);
//     console.log(`Test 11: ${await checkInput(null,null,100)}`);

// }

// test();