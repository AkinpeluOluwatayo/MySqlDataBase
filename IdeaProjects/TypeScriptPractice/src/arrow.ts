// const add = (x:number ,y:number): number => {
//     let number: number = x;
//     let number2: number = y;
//     return number + number2;
// }
//
// console.log(add(10,19));
//

    const people = [
        {name: "Tayo", age: 20},
        { name: "Tosin",age: 17},
        {name:  "Ayo", age:28},
    ];

    const filtredPeople = ():{name:string, age:number}[] => {
        const adults = [];
        for (let peoples of people){
            if (peoples.age >= 18){
                adults.push(people);
            }

        }
        return adults;
    }

    console.log(filtredPeople())