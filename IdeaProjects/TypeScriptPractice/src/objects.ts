let student = {
    name: "Tayo",
    age: 27,
    occupation: "farmer",
    verification: function verifyDeails(name: string, age: number):string {
        if (!name.match(/^[A-Za-z]+$/)){
            throw Error ("input alphabet only")
        }
        if (age < 18) {
            throw Error ("must be 18 or above");
        }else{
            return "name and age verified suceesful";
        }


    }
}
console.log(student.verification(9, 19));