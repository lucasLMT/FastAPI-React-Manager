import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
  } from "@material-tailwind/react";
import { useState } from "react";
import { createUser } from "../services/authService"

const SignUp = () => {
    const [user, setUser] = useState({ email: "", password: "", passwordCheck: ""});

    const clearUser = () => {
        setUser({
          email: "",
          password: "",
          passwordCheck: ""
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (user.password !== user.passwordCheck) {
            console.log("Wrong Password!")
        } else {
            try {
                const json = createUser(user.email, user.password);
                if (json.error) {
                    console.log(json.error);
                    clearUser();
                } else if (json.consoleError) {
                    clearUser();
                } else {
                    console.log(json.message);
                }
            } catch (ex) {
                clearUser();
            }
        }
    };

    const handleChange = ({ currentTarget: input }) => {
        let newUser = structuredClone(user);
        newUser[input.name] = input.value;
        setUser(newUser);
    };

    return (
        <>
            <Card className="w-96">
            <CardHeader
                variant="gradient"
                color="gray"
                className="mb-4 grid h-28 place-items-center"
            >
                <Typography variant="h3" color="white">
                Register
                </Typography>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
                <Input name="email" label="Email" size="lg" value={user.email} onChange={handleChange}/>
                <Input name="password" label="Password" type="password" size="lg" value={user.password} onChange={handleChange}/>
                <Input name="passwordCheck" label="Confirm Password" type="password" size="lg" value={user.passwordCheck} onChange={handleChange}/>
            </CardBody>
            <CardFooter className="pt-0">
                <Button variant="gradient" fullWidth onClick={handleSubmit}>
                Register
                </Button>
            </CardFooter>
            </Card>
        </>
    )
}

export default SignUp