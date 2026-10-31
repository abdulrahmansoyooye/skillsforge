function two_sum_descending(array:Array<number>,target:number):number []{
    let left = 0 
    let right = array.length -1
     while(left < right){
       const total = array[left] + array[right]
        if (total === target) {
            return [left,right]
        }else if(total > target){
            left +=1
        }else if(total < target){
            right -=1
        }
        
     }
     return []
}

console.log(two_sum_descending([10, 8, 5, 3, 2, 1],10))