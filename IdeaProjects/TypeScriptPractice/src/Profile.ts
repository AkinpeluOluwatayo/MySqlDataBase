import promptSync from "prompt-sync";
const prompt = promptSync();

function collectDetails(names: string ,phoneNumber:number, emails: string){
   const name: string = prompt("what is your name");
   const phone: number = prompt("what is your number");
   const email: string = prompt("Enter your email");


   return "Your name is" + name + "and your number is" + phone + "your emails is " + email;
}


function validateLogin(name: string, ID: number, email: string){
    if(!name.match("[a-zA-Z]+")) throw new Error("Enter alphabets only");
}