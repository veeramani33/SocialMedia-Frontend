import { useSelector } from 'react-redux'
import { selectCurrentToken } from "../features/auth/authSlice"
import { jwtDecode } from 'jwt-decode'


const useAuth = () => {
    const token = useSelector(selectCurrentToken)

    if (token) {
        const decoded = jwtDecode(token)
        const { id, username, email } = decoded.UserInfo

        return { username, id, email}
    }

    return {id: '', username: '', email:'' }
}
export default useAuth