///
/// exampke 3-8 for in 문을 통한 객체 프로퍼티 출력
///

var foo = {
    name: "foo",
    age: 30,
    major: "computer science"
}

var prop;
for(prop in foo) {
    console.log(prop, foo[prop]);
}
