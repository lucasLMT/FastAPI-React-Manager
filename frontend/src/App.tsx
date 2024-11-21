import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route, RouterProvider 
} from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import SignUp from './pages/signup'
import Manager from './pages/manager'
import UserProvider from './userProvider'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Home />}>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='manager' element={<Manager />} />
      </Route>
    )
  )

  return (
    <div className='App'>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </div>
  )
}

export default App
