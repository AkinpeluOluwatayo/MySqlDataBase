class Principal{
    private _name: string;
    private _age: number;
    private _gender: string;

    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }
    get age(): number {
        return this._age;
    }
    set age(value: number) {
        this._age = value;
    }
    get gender(): string {
        return this._gender;
    }
    set gender(value: string) {
        this._gender = value;
    }

    register(name: string, age: number, email: string): string {
        try {
            if (!name.match("[a-zA-Z]+")) throw new Error("Enter alphabet only");
            if (!name.match("[a-zA-Z]+")) throw new Error("Enter alphabet only");
            if (!name.match("[a-zA-Z]+")) throw new Error("Enter alphabet only");
        }catch (error){
            throw error;
        }
            return "registration successfull";
    }






}