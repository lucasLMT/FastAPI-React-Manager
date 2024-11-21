import {
  Navbar,
  Typography,
  Button
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../userContext"
import { logout } from "../services/authService"
 
const MainNavbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const exit = () => {
    setUser({
      email: ""
    })
    logout()
    navigate("/login")
  }
 
  return (
      <Navbar className="fixed top-0 max-w-screen-xl rounded-none p-3 mx-auto items-center">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            Project Manager
          </Typography>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-x-1">
              { user.email ? 
                (
                  <Button
                    variant="gradient"
                    size="sm"
                    className="inline-block"
                    onClick={exit}
                  >
                    Logout
                  </Button>
                ) : 
                (
                  <>
                    <Button
                      variant="text"
                      size="sm"
                      className="inline-block"
                    >
                      <Link to="/login"><span>Log In</span></Link>
                    </Button>
                    <Button
                      variant="gradient"
                      size="sm"
                      className="inline-block"
                    >
                      <Link to="/signup"><span>Sign in</span></Link>
                    </Button>
                  </>
                )
              }
              
            </div>
          </div>
        </div>
      </Navbar>
  );
}

export default MainNavbar