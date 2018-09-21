///
/// exampke 3-9 동일한 객체를 참조하는 두 변수 objA와 objB
///

var objA = {
    var: 40
}

var objB = objA;

console.log(objA.var);              // (출력값 ) 40
console.log(objB.var);              // (출력값 ) 40

objB.var = 50;
console.log(objA.var);              // (출력값 ) 50
console.log(objB.var);              // (출력값 ) 50
