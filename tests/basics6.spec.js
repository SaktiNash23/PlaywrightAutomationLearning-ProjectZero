const Person = require("./basics7.spec") //This is how you import a class from another file. You can use the class in this file now.

//Javascript object is a collection of properties

/*
let person = 
{
    firstName: "Sativel",
    lastName: "Thamilvanan",
    age: 24,
    fullName: function()
    {
        /*
        In JavaScript, the this expression (commonly referred to as the this keyword) implicitly references the object context currently executing the code. 
        Think of this like a pronoun in English; instead of hardcoding an object's exact name over and over, this lets a function know which object it is currently operating on.
        Its core purpose is to enable code reusability and flexible, context-aware functions. 
        The exact value of this is not fixed; instead, it is determined dynamically at runtime based entirely on how a function is invoked
        */
        //console.log(this.firstName + " " + this.lastName);
    //}
//}


/*
console.log(person.fullName()) 
console.log(person.lastName)
console.log(person["lastName"]) //For array notation need to use string quotes ""
person.firstName = "Jack"
console.log(person.firstName)
person.gender = "Male" //You can add new properties at run time like this. This is called dynamic property addition
console.log(person.gender)  
delete person.gender //You can delete properties at run time like this
console.log(person.gender) //This will output undefined since the property has been deleted

console.log("gender" in person) //This will return true or false depending on whether the property exists or not. This is called the "in" operator

for(let key in person)//To iterate through the properties of an object & print the values of the properties
{
    console.log("Key: " + person[key])
}
*/



let personFF16 = new Person("Clive", "Rosfield")
console.log(personFF16.fullName())//Here it needs a () because it is a method. It is used like a function.
