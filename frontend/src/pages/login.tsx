import { Card, CardHeader, CardBody, CardFooter, Typography, Input, Button } from "@material-tailwind/react";
import { useState, useContext } from "react";
import { userLogin } from "../services/authService"
import { useNavigate } from "react-router-dom";
import UserContext from "../userContext"

const Login = () => {
    const { setUser } = useContext(UserContext);
    const [ login, setLogin ] = useState({ email: "", password: "", errors: {} });
    const [ alert, setAlert ] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        let newLoginInfo = structuredClone(login);
        newLoginInfo[input.name] = input.value;
        setLogin(newLoginInfo);
    };

    const hideAlert = () => {
        setAlert("");
    }
    
    const handleSignIn = async (event) => {
        event.preventDefault();

        try {
            const json = await userLogin(login.email, login.password);
            console.log("Login Component: " + json)
            if (json.error) {
                setAlert(json.error);
            } else {
                setUser({
                    email: json.email
                })
                navigate("/manager");
            }
        } catch (ex) {
            console.log(ex.error);
            setLogin({ email: "", password: "", errors: {} });
            setUser({ email: ""});;
        }
    };

    return (
        <>
            <Card className="w-96">
                <CardHeader variant="gradient" color="gray" className="mb-4 grid h-28 place-items-center">
                    <Typography variant="h3" color="white">
                        Sign In
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <Input label="Email" size="lg" name="email" value={login.email} onChange={handleChange} />
                    <Input label="Password" size="lg" name="password" type="password" value={login.password} onChange={handleChange} />
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" fullWidth onClick={handleSignIn}>
                        Sign In
                    </Button>
                    <Typography variant="small" className="mt-6 flex justify-center">
                        Don&apos;t have an account?
                        <Typography as="a" href="#signup" variant="small" color="blue-gray" className="ml-1 font-bold">
                            Sign up
                        </Typography>
                    </Typography>
                </CardFooter>
            </Card>
            {alert && (
                <div role="alert" className="mt-3 relative flex w-1/2 p-3 text-sm text-white bg-gray-800 rounded-md">
                    {alert}
                    <button
                        className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5"
                        type="button" onClick={hideAlert}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-5 w-5"
                            stroke-width="2"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            )}
        </>
    );
};

export default Login;
