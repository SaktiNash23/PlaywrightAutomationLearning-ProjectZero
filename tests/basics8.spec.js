const Person = require("./basics7.spec");//To ensure that the child class can access the properties and methods of the parent class, we need to import the parent class in the child class file.
class Pet extends Person //"extends" keyword is needed to inherit the properties and methods of the parent class. In this case, Pet class inherits from Person class.
{
    //If Parent class has a Constructor, then the child class MUST HAVE a constructor as well.
    constructor(firstName, lastName)
    {
        //Rule: You MUST call the Parent class constructor as the FIRST STEP in your child class constructor. This is done using the "super" keyword.
        super(firstName, lastName)
    }

   
    get location()//This overrides the Parent Class getter method. This is called Method Overriding. The child class can override the methods of the parent class. In this case, the location getter method of the Pet class overrides the location getter method of the Person class.
    {
        return "Blue Cross"
    }

}

let doge = new Pet("Torgal", "Fenrir")
console.log(doge.fullName())//Here it needs a () because it is a method. It is used like a function.
console.log(doge.location)//Here it does not need (), because it is a getter method. It is used like a property. This will output "Blue Cross" because the location getter method of the Pet class overrides the location getter method of the Person class.    