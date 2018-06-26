var someArray = [{name:"Kristian", lines:"2,5,10"},
             {name:"John", lines:"1,19,26,96"},
             {name:"Brian",lines:"3,9,62,36" }];
var johnRemoved = someArray.filter(function(el) {
    return el.name !== "John";
});

console.log(JSON.stringify(johnRemoved, null, ' '));



// var myobject={
//
//     a: 1,
//     b: 3,
//     d: 4,
//     e:5,
//     f:6
// };
// // console.log(myobject);
// // var x = myobject.find(
// //     item => {item > 5}
// // )
// console.log(Object.getOwnPropertyNames(myobject));
//
// delete myobject.a
// console.log(myobject);
//
// var someArray=[
//     {
//         a: 1,
//         b: 3
//     },
//     {   d: 4,
//         e:5,
//         f:6
//     }
// ];
// console.log(someArray);
// someArray.forEach(object=>{
// //     return delete myobject.a
//     // console.log("object",object);
//     if(object.a){
//         console.log('yey!');
//         delete object.a
//     }
//     // console.log(object.indexOf(1));
//     // delete object.a
// })
// console.log(someArray);
//
// console.log("index",index);
// var words = ['one', 'two', 'three', 'four'];
// words.forEach(function(word) {
//   console.log(word);
//   if (word !== 'two') {
//     words.shift();
//   }
// });
//
// console.log(words);
