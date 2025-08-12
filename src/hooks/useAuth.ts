import { useAppSelector } from 'store/store';
import { User } from 'types/userTypes';

interface UseAuthReturn {
    isLoggedIn: boolean;
    user: User | null;
}

export const useAuth = (): UseAuthReturn => {
    const { user, accessToken } = useAppSelector(state => state.auth);

    return {
        isLoggedIn: Boolean(user && accessToken),
        user
    };
};
