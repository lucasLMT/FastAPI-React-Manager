import { Outlet } from "react-router-dom"
import MainNavbar from "../components/mainNavBar"

const Home = () => {
    return (
      <>
        <div className='w-full max-w-screen-xl mx-auto'>
          <MainNavbar />
          <div className="flex w-full flex-col max-w-screen-xl mx-auto items-center mt-32">
            <Outlet/>
          </div>
        </div>
      </>  
    )
}

export default Home