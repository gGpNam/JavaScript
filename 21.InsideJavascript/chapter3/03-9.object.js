///
/// exampke 3-9 객체 프로퍼티 삭제
///

var foo = {
    name: "foo",
    nickname: "babo"
}

console.log(foo.nickname);          // (출력값 ) babo
delete foo.nickname;                // nickname 프로퍼티 삭제
console.log(foo.nickname);          // (출력값 ) undefined
console.log("=============================");

delete foo;                         // (출력값 ) foo 객체 삭제 시도
console.log(foo.name)               // (출력값 ) foo
