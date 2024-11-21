import { createContext } from 'react';

type User = {
    email: string
}

// Create a ThemeContext
const userContext = createContext({
    user: { 
        email: "" 
    },
    setUser: (user: User): void => {}
});

export default userContext;