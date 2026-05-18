import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login.jsx';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import ProductDetail from './pages/product-detail.jsx';
import SearchPage from './pages/search.jsx';
import ProductManagement from './pages/admin/ProductManagement.jsx';
import BannerManagement from './pages/admin/BannerManagement.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import './styles/global.css';
import './index.css';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "admin/products",
        element: <ProductManagement />,
      },
      {
        path: "admin/banners",
        element: <BannerManagement />,
      },
      {
        path: "category/:categoryId",
        element: <CategoryPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "register",
    element: <RegisterPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)