export default function searchLinear(obj,search,min,max){
    let result = null;
    obj.forEach((val,index)=>{
        if(search>val[min] && search<=(val[max])){
            result=val;
        }
        if(index===obj.length-1) result =val;
    })
    return result;
}

