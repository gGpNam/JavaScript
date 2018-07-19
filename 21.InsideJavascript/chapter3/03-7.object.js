///
/// exampke 3-7 객체의 프로퍼티 접근하기
///

// 객체 리터럴 방식을 통한 foo 객체 생성
var foo = {
    name: "foo",
    major: "computer science"
}

// 객체 프로퍼티 읽기
console.log(foo.name);          // (출력값 ) foo
console.log(foo['name']);       // (출력값 ) foo
console.log(foo.nickname);      // (출력값 ) undefined
console.log(foo['nickname']);   // (출력값 ) undefined
console.log("=============================");

// 객체 프로퍼티 갱신
foo.major = "electronics engineering";
console.log(foo.major);         // (출력값 ) electronics engineering
console.log(foo['major']);      // (출력값 ) electronics engineering
console.log("=============================");

// 객체 프로퍼티 동적 생성
// 자바스크립트 객체의 프로퍼티에 값을 할당할 때, 프로퍼티가 이미 있을 경우는 해당 프로퍼티의 값이 갱신되지만,
// 객체의 해당 프로퍼티가 없을 경우에는 새로운 프로퍼티가 동적으로 생성된후 값이 할당된다.
foo.age = 30
console.log(foo.age)            // (출력값 ) 30
console.log("=============================");

// 대괄호 표기법만을 사용해야 할 경우(프로퍼티가 표현식이거나 예약어일 경우)
foo['full-name'] = 'foo bar';
console.log(foo['full-name']);  // (출력값 ) foo bar
console.log(foo.full-name);     // (출력값 ) NaN
console.log(foo.full);          // (출력값 ) undefined
console.log(name);              // (출력값 ) undefined
console.log("=============================");


foo['fullName'] = 'foo bar';
console.log(foo['fullName']);   // (출력값 ) foo bar
console.log(foo.fullName);      // (출력값 ) foo bar
console.log(foo.full);          // (출력값 ) undefined
console.log(name);              // (출력값 ) undefined
console.log("=============================");
