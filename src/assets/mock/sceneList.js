const arr = [];
for (let i = 0; i< 8; i++) {
    let obj = {
        json: '',
        isSelect: false
    }
    obj.id = i;
    obj.name = i;
    arr.push(obj);
}
export default arr;