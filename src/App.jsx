import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header, PublicRoutes } from 'components';
// import { useDispatch, useSelector } from 'react-redux';
// import { refresh } from 'state/authOperations';
import { Main } from 'pages';

const Records = lazy(() => import('pages/Records'));
// const LoginPage = lazy(() => import('pages/LoginPage/LoginPage'));
// const Validate = lazy(() => import('pages/Validate/Validate'));
// const DashboardPage = lazy(() => import('pages/DashboardPage/DashboardPage'));
// const Pricing = lazy(() => import('pages/Pricing/Pricing'));
// const AdminPanel = lazy(() => import('pages/AdminPanel'));

const App = () => {
    // const { isFirst } = useSelector(state => state.auth);
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     // console.log('refresh');
    //     dispatch(refresh());
    // }, [dispatch]);

    // if (isFirst) return <Loader />;

    return (
        <>
            <Header />
            <main className="main">
                <Suspense fallback={null}>
                    <Routes>
                        <Route element={<PublicRoutes />}>
                            <Route path="/" element={<Main />} />
                            <Route path="/records" element={<Records />} />
                            {/* <Route path="/sign-up" element={<SignUpPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/validate" element={<Validate />} /> */}
                        </Route>

                        {/* <Route element={<PrivateRoutes />}>
                            <Route path="/dashboard" element={<DashboardPage />}>
                                <Route path="main" element={<Dashboard />} />
                                <Route path="projects" element={<Projects />} />
                                <Route path="uploads" element={<Uploads />} />
                              
                            </Route>
                            <Route path="/rooms" element={<Rooms />} />
                            <Route path="/render/:roomName" element={<Render />} />
                            <Route path="/admin" element={<AdminPanel />} />
                        </Route> */}
                        {/* <Route path="/test" element={<Test />} /> */}
                        <Route path="*" element={<Main />} />
                    </Routes>
                </Suspense>
            </main>
        </>
    );
};

export default App;
