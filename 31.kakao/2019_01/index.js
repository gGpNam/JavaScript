var type = {
    Enter: "Enter",
    Leave: "Leave",
    Change: "Change"
}

function solution(record) {
    var events = [];
    var answer = [];
    // var answer = ["Prodo님이 들어왔습니다.", "Ryan님이 들어왔습니다.", "Prodo님이 나갔습니다.", "Prodo님이 들어왔습니다."];
    
    record.forEach(function(line) {
        var commands = line.split(' ');

        if(commands[0] === type.Enter || commands[0] === type.Leave) {
            events.push({
                method: commands[0],
                id: commands[1],
                nick: commands[2],
            });
        }
        else {
            var curUser = events.find(function(x) { return x.id == commands[1] });
            curUser.nick = commands[2];
        }
    });

    answer.forEach(function(line) {
        console.log(line); 
    });

    return answer;
}

var record = ["Enter uid1234 Muzi", "Enter uid4567 Prodo","Leave uid1234","Enter uid1234 Prodo","Change uid4567 Ryan"];
solution(record);

