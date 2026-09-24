import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  AccountLayout,
  AdminDashboard,
  CartPage,
  Categories,
  CheckoutForm,
  Complaint,
  Dashboard,
  DeliveryConfirmation,
  ErrorPage,
  Help,
  Landing,
  Login,
  PaymentConfirmation,
  Register,
  Sell,
  SellerPayout,
  SharedLayout,
  Shipment,
  Shop,
  TermsAndConditions,
  UserProfile,
  WishList,
} from "./pages/index";

import {
  AddBrand,
  AddCategory,
  AddComplaintForm,
  AddCondition,
  AddListing,
  AddUser,
  BrandView,
  CategoryView,
  ConditionView,
  EditBrand,
  EditCategory,
  EditListing,
  OrderDetails,
  ProductDetails,
  ProductView,
  ProtectedRoute,
  UserProductView,
  UserView,
} from "./components";
import AdminOrderView from "./pages/AdminOrderView";
import ContactForm from "./pages/ContactForm";
import Orders from "./pages/Orders";
import { store } from "./store";

import EditCondition from "./components/EditCondition";
import { loader as landingLoader } from "./pages/Landing";

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
        },
        {
          path: "sell", 
          element: <Sell />,
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
          element: <Categories />,
        },
           {
        path:'checkout/success',
        element:<PaymentConfirmation/>
    },
     {
        path:'confirmation',
        element:<DeliveryConfirmation/>
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
      path: "/help",
      element: <Help/>,
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
      ],
    },
    {
      path: "/account",
      element: (
        <ProtectedRoute>
          <AccountLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "user",
          element: <Dashboard />,
        },
        {
          path: "listings/me",
          element: <UserProductView />,
        },
        {
          path: "wishlist",
          element: <WishList />,
        },
          {
          path: "me",
          element: <UserProfile/>,
        },
        {
          path: "listings/new",
          element: <AddListing />,
        },
        {
          path: "complaints/new/:id",
          element: <AddComplaintForm />,
        },
        {
          path: "listings/:listingId/edit",
          element: <EditListing />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
        {
          path: "orders/:id/details",
          element: <OrderDetails />,
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
          element: <Shipment />,
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
          element: <Complaint />,
        },
        {
          path: "admin/user/new",
          element: <AddUser />,
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
          element: <AdminOrderView />,
        },
        {
          path: "admin",
          element: <AdminDashboard />,
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
          path: "admin/condition/:id/edit",
          element: <EditCondition/>,
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
      path: "/terms",
      element: <TermsAndConditions/>,
    },
 
  ]);
  return <RouterProvider router={router} />;
}

export default App;
