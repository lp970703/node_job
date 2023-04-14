// 选择排序
((arr = [8,9,7,6,4,7]) => {
    const len = arr.length;
    let minIndex;
    let temp;
    for (let i = 0; i < len; i++) {
        minIndex = i;  //选择当前下标为最小元素
        for (let j = i + 1; j < len; j++) {
            if (arr[minIndex] > arr[j]) {     //每一次从i+1个开始遍历找出比自身小的元素
                minIndex = j;                 //将最小数的索引保存
            }
        }
        //接下来的操作类似冒泡，都是互换元素位置
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    console.log(arr);
})();