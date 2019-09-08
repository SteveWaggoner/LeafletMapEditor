export
class Person {
    public personid: number; //primarykey

    public givenname: string;
    public surname: string;
    public age: string;

    public constructor(personid: number, givenname: string, surname: string, age: string) {
        this.personid = personid;
        this.givenname = givenname;
        this.surname = surname;
        this.age = age;
    }
}