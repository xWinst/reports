// import { Navigate, Outlet } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';

const PublicRoutes = () => {
    // const { accessToken, user } = useSelector(state => state.auth);
    // const isLogin = accessToken && user.name;

    // return <>{isLogin ? <Navigate to="/" /> : <Outlet />}</>;

    return <Outlet />;
};

export default PublicRoutes;
