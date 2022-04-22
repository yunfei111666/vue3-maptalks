/**
 * canvas转图片
 * id: string
 * selfIsCanvas: Boolean
 */
export const getCanvasBase64 = (id, selfIsCanvas = false) => {
    const node = document.getElementById(id);
    if (selfIsCanvas) {
        return node.toDataURL();
    }
    else {
        const canvas = node.getElementsByTagName('canvas')[0];
        return canvas.toDataURL();
    }
}
/**
 * 数组对象搜索过滤
 */
export const filterArr = (str, targetArr, attribute) => {
    const result = targetArr.filter(item => {
        if (str) {
            return item[attribute].indexOf(str) > -1;
        }
        else {
            return item;
        }
    })
    return result;
}
/**
 * 两个数组对象合并去重
 */
export const concatArray = (arr1, arr2, key) => {
    let newArr = arr1.concat(arr2);
    let result = []
    for (let item1 of newArr) {
        let flag = true;
        for(let item2 of result) {
            if (item1[key] === item2[key]) {
                flag = false;
            }
        }
        if (flag) {
            result.push(item1);
        }
    }
    return result;
}
