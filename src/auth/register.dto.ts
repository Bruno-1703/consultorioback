import { IsEmail, IsString, MinLength } from "class-validator";
//import { Transformer } from "class-transformer";

export class RegisterDto{
//@Transform(({value})=> value.trim())
@IsString()
@MinLength(5)
name: string;

@IsEmail()
email: string;

//@Transform(({value})=> value.trim())
@IsString()
@MinLength(8)
password: string;
}