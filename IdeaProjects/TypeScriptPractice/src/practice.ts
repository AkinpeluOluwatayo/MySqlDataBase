
function registerStudent():string[] {
    let nurses:string[] = [];
    let names: string[] = ["Omoyeni","tope","ayo"]
    for(let name of names) {
        nurses.push(name);
    }
    return nurses;
}

function displayNurses(nurses:string[]):void{
    console.log("Registered nurses");
    for(let nurse of nurses){
        console.log(nurse)
    }
}

let registerNurses = registerStudent();
    displayNurses(registerNurses);


function calculateTax(income:number):string{
    if (income < 50000){
        return "u poor";
    }else{
        return"wow";
    }

}
console.log(calculateTax(20000));