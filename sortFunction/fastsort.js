// 快速排序(二分法)
const arrSortFast = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }
    const leftArr = [];
    const rightArr = [];
    //每次删除一个数组元素并获得返回值当作基数，直到数组被删除到只剩下一个时，直接返回
    //Math.round 向上取整 3.5取4 3.3取3
    const baseNumber = arr.splice(Math.round(arr.length / 2), 1)[0];
    arr.forEach(v => {
        if (v < baseNumber) {
            leftArr.push(v);
        } else {
            rightArr.push(v);
        }
    });
    // 取完该数组中间的数据之后,让其他数字跟左右两边对比
    const value = arrSortFast(leftArr).concat([baseNumber], arrSortFast(rightArr));
    return value;
};

console.log(arrSortFast([2,3,1,4,3,7,5,1]));
