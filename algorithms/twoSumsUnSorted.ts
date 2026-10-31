function twoSums(nums:Array<number>,target:number):number[]{
    const lookup:Record<number,number> = {}

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i]
        const complement = target - num;

        if (complement in lookup) {
            return [lookup[complement],i]
        }
        lookup[num] = i

    }
    return []
}

console.log(twoSums([2,4,5,6],11))