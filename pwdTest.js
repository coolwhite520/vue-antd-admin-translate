// var passwordValidator = require('password-validator');
//
// // Create a schema
// var schema = new passwordValidator();
//
// // Add properties to it
// schema
//     .is().min(12, "最小输入12个字符")                                    // Minimum length 8
//     .is().max(100, "最大100个字符")                                  // Maximum length 100
//     .has().uppercase(1, "至少包含一个大写字母")                              // Must have uppercase letters
//     .has().lowercase(1, "至少包含一个小写字母")                              // Must have lowercase letters
//     .has().digits(1, "必须包含一个数字")                                // Must have at least 2 digits
//     .has().not().spaces(1, "不能包含空格")
//     .has().symbols(1, "至少包含一个特殊符号")
//     .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
//
//
// // Get a full list of rules which failed
// console.log(schema.validate('jo  ke', { details: true }));
//
var rows={
    "1":{
        column:4,
    },
    "0":{
        column:4,
    },
    "2":[{"a": "b"}, 1,2,4],
    "科目": {
        column: 3,
    },
    "期初数": {
        column: 1,
    }
}

var s = JSON.stringify(rows);
console.log(s)

// var cc = Object.keys(rows).sort((a,b)=> a - b)
// let arr = []
// for(let item of cc) {
//     arr.push(`${item}=${rows[item]}`);
// }
// console.log(arr)
