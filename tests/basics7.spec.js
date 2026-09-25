module.exports = class Person //module.exports makes the Parent Class Public so that it can be used in other files.
{
     //Constructor is method that executes by default everytime an object is created.
    constructor(firstName, lastName)
    {
        //Propeties defined in the constructor are called Instance properties. They are unique to each object.
        this.firstName = firstName
        this.lastName = lastName
    }

    //Properties defined outside the constructor are called Class properties.
    age = 20

    //Getter
    get location()
    {
        return "Malaysia"
    }


    //Methods
    fullName()
    {
        return this.firstName + " " + this.lastName
    } 
}

/*
let person = new Person("Sativel", "Thamilvanan")
let person1 = new Person("John", "Doe")
console.log(person.fullName())//Here it needs a () because it is a method. It is used like a function.
person1.age = 30
console.log(person.age)
console.log(person1.age)
console.log(person.location)//Here it does not need (), because it is a getter method. It is used like a property.
*/
