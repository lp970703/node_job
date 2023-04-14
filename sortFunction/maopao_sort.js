// 冒泡排序
((arr = [4, 3, 5, 4, 1, 3, 2, 0, 3, 88]) => {
    let length = arr.length;
    // 单层for循环
    for (let j = 0; j < length; j++) {
        if (arr[j] > arr[j + 1]) {
            let temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
        // 在循环到最大值时候重置j(j=-1到上面j++重置为0)这样可以省了外层for循环
        if (j == length - 1) {
            j = -1;
            length--;
        }
    }
    console.log(arr);
})();
