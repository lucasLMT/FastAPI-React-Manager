import React, { useState } from 'react';
import UserContext from "./userContext"

// interface UserContextProps {
//     user: {
//         email: string
//     },
//     setUser: () => void;
// }

const UserProvider = ({ children }: { children: React.ReactNode }):JSX.Element => {
    const [user, setUser] = useState({});

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;