///
/// exampke 3-11 Call by Value 와 Call by Reference 차이
///

var a = 100;

var objA = {
    value: 100
}

function changeArgs(num, obj) {
    num = 200;
    obj.value = 200;

    console.log(num);
    console.log(obj);
}

changeArgs(a, objA);

console.log(a);
console.log(objA);
