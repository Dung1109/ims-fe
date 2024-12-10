import {createContext, ReactNode, useContext} from 'react';
import {useLocalStorage} from "./useLocalStorage";

type Props = {
    children: ReactNode;
}

type AuthContextType = {
    authenticated: boolean;
    username: string,
    setAuthenticated: (value: boolean) => void;
    setUsername: (value: string) => void;
}

const initialAuthContext: AuthContextType = {
    authenticated: false,
    setAuthenticated: () => {},
    username: '',
    setUsername: () => {}
}

const AuthContext = createContext<AuthContextType>(initialAuthContext);

const AuthProvider = ({ children }: Props) => {

    const [authenticated, setAuthenticated] = useLocalStorage('authenticated', false)
    const [username, setUsername] = useLocalStorage('username', '')

    const value = {
        authenticated,
        setAuthenticated,
        username,
        setUsername
    };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuth };