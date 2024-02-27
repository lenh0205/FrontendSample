_https://thomas-rubattel.medium.com/function-composition-vs-function-decorator-6ec9efc000c2_-

# Function Composition
* -> kết hợp nhiều function với tính chất khác nhau; vậy nên sẽ cần có 1 số ràng buộc
* -> have a strong constrain - the **`type of the output`** of **`the nested function`** has to match with the **`type of the input`** of the **`next outer function`** and so on
* -> is used in different areas of mathematics, such as **`calculus`**, **`category theory`**, **`lambda calculus`** and **`combinatory logic`**

```js - VD: xét điểm trung bình của 1 học sinh để tặng thưởng
const student = {
  name: "Yoko",
  grades: [3, 6, 4, 3],
};

const hasPassed = (average) => average >= 4;
const getAverage = (grades) => grades.length ?
  grades.reduce((acc, grade) => grade + acc, 0) / grades.length : 0;

// compose function
const isPromoted = (student) => hasPassed(getAverage(student.grades));
isPromoted(student); // true
```

```js - VD: tìm danh sách học sinh được tặng thưởng
// chaining "filter" with "map" is also a case of function composition

const students = [
 { name: "Yoko", grades: [3, 6, 4, 3] },
 { name: "Masamune", grades: [3, 6, 4, 2] },
 { name: "Ryouko", grades: [3, 6, 4, 5] },
];

const hasPassed = (student) => student.average >= 4;
const getAverage = (grades) => {
    return grades.length ? grades.reduce((acc, grade) => grade + acc, 0) / grades.length : 0;
} 
const withAverage = (student) => ({
  ...student,
  average: getAverage(student.grades)
});

// compose function
const arePromoted = students.map(withAverage).filter(hasPassed);
/* [
 { name: "Yoko", grades: [3, 6, 4, 3], average: 4 },
 { name: "Ryouko", grades: [3, 6, 4, 5], average: 4.5 },
]
*/
```