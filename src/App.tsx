import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  AddBrand,
  AddCategory,
  AddComplaintForm,
  AddCondition,
  AddUser,
  BrandView,
  CategoryView,
  ConditionView,
  EditBrand,
  EditCategory,
  EditListing,
  EditUser,
  ProductDetails,
  ProductView,
  ProtectedRoute,
  UserProductView,
  UserView
} from "./components/index";

import {
  AccountLayout,
  AddListing,
  AdminDashboard,
  CartPage,
  Categories,
  Checkout,
  CheckoutForm,
  Complaint,
  Dashboard,
  ErrorPage,
  Landing,
  Login,
  PaymentConfirmation,
  Register,
  Sell,
  SellerPayout,
  SharedLayout,
  Shipment,
  Shop,
  WishList,
} from "./pages/index";
import { store } from "./store";

//loaders

import { loader as accountLoader } from "./pages/AccountLayout";
import { loader as adminLoader } from "./pages/AdminDashboard";
import AdminOrderView from "./pages/AdminOrderView";
import ContactForm from "./pages/ContactForm";
import { loader as dashboardLoader } from "./pages/Dashboard";
import { loader as landingLoader } from "./pages/Landing";
import Orders from "./pages/Orders";
import { loader as shopLoader } from "./pages/Shop";
import { loader as wishlistLoader } from "./pages/WishList";

//action

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SharedLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Landing />,
          loader: landingLoader(store),
        },
        {
          path: "shop",
          element: <Shop />,
          loader: shopLoader(store),
        },
        {
          path: "shop/listing/:listingId",
          element: <ProductDetails />,
        },
        {
          path: "shop/categories",
          element: <Categories />,
        },

        {
          path: "category/:slug",
          element: "<Category />",
        },

        {
          path: "product/:id",
          element: "<Product />",
        },

        {
          path: "cart",
          element: (
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <CheckoutForm />
            </ProtectedRoute>
          ),
        },
        {
          path: "return",
          element: (
            <ProtectedRoute>
              <PaymentConfirmation />
            </ProtectedRoute>
          ),
        },
        {
          path: "/checkout",
          element: (
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/account",
      loader: accountLoader(store),
      element: (
        <ProtectedRoute>
          <AccountLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "user",
          element: <Dashboard />,
          loader: dashboardLoader(store),
        },

        {
          path: "listings/me",
          element: <UserProductView />,
        },
        {
          path: "wishlist",
          loader: wishlistLoader(store),
          element: <WishList />,
        },

        {
          path: "listings/new",
          element: <AddListing />,
        },
          {
          path: "complaints/new/:id",
          element: <AddComplaintForm/>,
        },

        {
          path: "listings/:listingId/edit",
          element: <EditListing />,
        },

        {
          path: "orders",
          element: <Orders/>,
        },

        {
          path: "shipments",
          element: <Shipment />,
        },

        {
          path: "payouts",
          element: <SellerPayout />,
        },
        {
          path: "admin/shipments",
          element: <Shipment/>,
        },
        {
          path: "admin/listings",
          element: <ProductView />,
        },
          {
          path: "admin/payouts",
          element: <SellerPayout />,
        },
        {
          path: "admin/users",
          element: <UserView />,
        },
         {
          path: "admin/reports",
          element: <Complaint/>,
        },
        {
          path: "admin/user/new",
          element: <AddUser />,
        },
        {
          path: "admin/user/:userId/edit",
          element: <EditUser />,
        },
        {
          path: "admin/brands",
          element: <BrandView />,
        },
        {
          path: "admin/brand/new",
          element: <AddBrand />,
        },
     {
          path: "admin/orders",
          element: <AdminOrderView/>,
        },

        {
          path: "admin",
          element: <AdminDashboard />,
          loader: adminLoader(store),
        },
        {
          path: "admin/categories",
          element: <CategoryView />,
        },
        {
          path: "admin/conditions",
          element: <ConditionView />,
        },
        {
          path: "admin/condition/new",
          element: <AddCondition />,
        },
        {
          path: "admin/categories/new",
          element: <AddCategory />,
        },
        {
          path: "admin/categories/:id/edit",
          element: <EditCategory />,
        },
        {
          path: "admin/brand/:id/edit",
          element: <EditBrand />,
        },
      ],
    },

    {
      path: "/sell",
      element: <Sell />,
    },

    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/contact",
      element: <ContactForm />,
    },

    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/checkout",
      element: <CheckoutForm />,
    },
    {
      path: "/checkout/success",
      element: <PaymentConfirmation />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
