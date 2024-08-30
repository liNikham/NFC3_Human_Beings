import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import Home from "../pages/home/Home";
import Donation from "../pages/donation/Donation";
// import PetListing from "../pages/petListing/PetListing";
import Login from "../pages/login/Login";
import Registration from "../pages/registration/Registration";
import Dashboard from "../pages/dashboard/Dashboard";
import PetListNew from "../pages/petListing/PetListNew";
import PetDetails from "../pages/petDetails/PetDetails";
import AllUsers from "../pages/dashboard/admin/allUsers/AllUsers";
import PrivateRoute from "./PrivateRoute";
import AddPet from "../pages/dashboard/user/addPet/AddPet";
import AdoptionReq from "../pages/dashboard/user/adoptionReq/AdoptionReq";
// import MyAddPet from "../pages/dashboard/user/myAddPet/MyAddPet";
import MyDonationCamp from "../pages/dashboard/user/myDonationCamp/MyDonationCamp";
import UserHome from "../pages/dashboard/user/userHome/UserHome";
import UpdatePet from "../pages/dashboard/user/updatePet/UpdatePet";
import CreateDonation from "../pages/dashboard/user/createDonation/CreateDonation";
import DonationDetails from "../pages/donationDetails/DonationDetails";
import UpdateDonation from "../pages/dashboard/user/updateDonation.jsx/UpdateDonation";
import AllPets from "../pages/dashboard/admin/allPets/AllPets";
import AllDonation from "../pages/dashboard/admin/allDonations/AllDonation";
import ErrorPage from "../components/error/ErrorPage";
import AdminRoute from "./AdminRoute";
import MyDonation from "../pages/dashboard/user/myDonation/MyDonation";
import VetDoctor from "../pages/vetDoctor/VetDoctor";
import MyAddPetList from "../pages/dashboard/user/myAddPet/MyAddPetList";
import MyAddPetUpdate from "../pages/dashboard/user/myAddPet/MyAddPetUpdate";
import Blog from "../pages/blog/Blog";
import VideoCall from "../components/VideoCall/VideoCall";
import PetAdoptionQuiz from '../components/PetAdoptionQuiz/PetAdoptionQuiz';
import AdminVerify from "../pages/dashboard/admin/ShelterVerify/ShelterVerify";
import ShelterRegistration from "../components/Shelters/ShelterRegistration";
import Feedback from "../pages/feedback/Feedback";
import ApplicationStatus from "../pages/dashboard/user/applicationStatus/ApplicationStatus";

const MainRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      
      {
        path: "/petlisting",
        element: <PetListNew />,
      },
      {
        path: "/petlisting/:id",
        element: (
          <PrivateRoute>
            <PetDetails />
          </PrivateRoute>
        ),
        loader: ({ params }) =>
          fetch(`http://localhost:5000/api/petList/${params.id}`),
      },
      {
        path: "/donation",
        element: <Donation />,
      },
      {
        path: "/vetDoctor",
        element: <VetDoctor />,
      },
      {
        path: "/donation/:id",
        element: (
          <PrivateRoute>
            <DonationDetails />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          try {
            const response = await fetch(`http://localhost:5000/api/allDonationCamp/${params.id}`);
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        },
      },
      {
        path: "/feedback",
        element: (
          <PrivateRoute>
            <Feedback />
          </PrivateRoute>
        )
      },
      {
        path: "/quiz",
        element: (
          <PrivateRoute>
            <PetAdoptionQuiz />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/shelter-registration",
    element: <ShelterRegistration />,
  },
  {
    path: "/blog",
    element: (
      <PrivateRoute>
        <Blog />
      </PrivateRoute>
    ),
  },
  {
    path: "/videocall",
    element: (
      <PrivateRoute>
        <VideoCall />
      </PrivateRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      // Admin Route
      {
        path: "allUsers",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "allPets",
        element: (
          <AdminRoute>
            <AllPets />
          </AdminRoute>
        ),
      },
      {
        path: "allDonations",
        element: (
          <AdminRoute>
            <AllDonation />
          </AdminRoute>
        ),
      },

      // User Route
      {
        path: "userHome",
        element: (
          <PrivateRoute>
            <UserHome />
          </PrivateRoute>
        ),
      },
      {
        path: "addPet",
        element: (
          <PrivateRoute>
            <AddPet />
          </PrivateRoute>
        ),
      },
      {
        path: "verifyShelter",
        element: (
          <PrivateRoute>
            <AdminVerify />
          </PrivateRoute>
        ),
      },
      {
        path: "myDonation",
        element: <MyDonation />,
      },
      {
        path: "CreateDonation",
        element: (
          <PrivateRoute>
            <CreateDonation />
          </PrivateRoute>
        ),
      },
      {
        path: "myAddPet/:id",
        element: (
          <PrivateRoute>
            <MyAddPetUpdate />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          const Data = await fetch(`http://localhost:5000/api/petList/${params.id}`);
          return Data;
        },
      },
      {
        path: "adoptionReq",
        element: (
          <PrivateRoute>
            <AdoptionReq />
          </PrivateRoute>
        ),
      },
      {
        path: "adoptStatus",
        element: (
          <PrivateRoute>
            <ApplicationStatus />
          </PrivateRoute>
        ),
      },
      {
        path: "myAddPet",
        element: (
          <PrivateRoute>
            <MyAddPetList />
          </PrivateRoute>
        ),
      },
      {
        path: "updateDonation/:id",
        element: (
          <PrivateRoute>
            <UpdateDonation />
          </PrivateRoute>
        ),
        loader: async ({ params }) => {
          try {
            const response = await fetch(`http://localhost:5000/api/allDonationCamp/${params.id}`);
            const data = await response.json();
            return data;
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        },
      },
      {
        path: "myDonationCamp",
        element: (
          <PrivateRoute>
            <MyDonationCamp />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default MainRouter;
