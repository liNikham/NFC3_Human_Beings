import React, { Fragment, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Container from "../../components/shared/Container";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";
import "./index.css";
import Slider from "../../components/slider/Slider";

const PetDetails = () => {
  const data = useLoaderData();
  console.log(data, "data");
  let [isOpen, setIsOpen] = useState(false);
  const { category, image, location, name, email, _id } = data || {};
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  if (!user) {
    return <div>Loading...</div>;  // Or some kind of loading indicator
  }
  console.log("hello");
  console.log(user , "user information");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const validateForm = (values) => {
    const errors = {};
    if (!values.user_number) {
      errors.user_number = "Phone Number is required";
    }
    if (!values.user_address) {
      errors.user_address = "Address is required";
    }
    return errors;
  };
  
  const initialValues = {
    petId: user.petId || "",  // Ensure defaults are in place
    userId: user.userId || "",
    email: data.email || "",
    status: "pending",
    user_name: user.displayName || "",
    user_email: user.email || "",
    user_number: "",
    user_address: "",
    adoptionDate: new Date().toISOString(), 
    additionalInfo: "",
  };

  const handleSubmit = async (values, actions) => {
    console.log(user, "user information  2");
    console.log("Submitting form", data);
    console.log("Submitting form", initialValues);
    console.log(values);
    actions.setSubmitting(false);
    try {
      const adoptRes = await axiosPrivate.post("/api/adopt", values);
      console.log(adoptRes);
      if (adoptRes.data.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${data.name} has received your adoption request.`,
          showConfirmButton: false,
          timer: 1500,
        });
        closeModal(); // Close the modal after successful submission
      }
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <div>
      <Container>
        <div className="backdrop-blur-xl bg-white/30 text-gray-700 lg:mt-32 mt-20 p-10 rounded-lg">
          <div className="container grid grid-cols-12 mx-auto">
            <div className="flex flex-col justify-center col-span-12 align-middle bg-no-repeat bg-cover lg:col-span-6 lg:h-screen">
              {data?.image_url ? (
                <img
                  className="lg:w-[95%] object-cover w-32 mx-auto rounded-lg lg:h-[600px]"
                  src={data.image_url}
                  alt=""
                />
              ) : (
                <Slider sliderImages={data?.image_urls} />
              )}

              <div className="flex justify-center mt-5">
                <div className="">
                  <button
                    type="button"
                    onClick={openModal}
                    className="rounded-md bg-indigo-700 px-10 py-2 text-lg font-medium text-white "
                  >
                    Adopt
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 col-span-12 overflow-hidden lg:col-span-6 lg:p-10 divide-gray-700 rounded-lg lg:h-[600px]">
              <div className="pt-6 pb-4 lg:text-xl text-lg space-y-2 flex flex-col lg:text-start text-center text-white">
                <span>Name: {data.name}</span>
                <p>Age: {data.age}</p>
                <p>Location: {data.location}</p>
                <p>Category: {data.category}</p>
                <p>Description: {data.shortDescription}</p>
                <p>Long Description: {data.longDescription}</p>
                <p>Breed:{data.breed}</p>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="p-8 rounded border border-gray-200">
                    <h1 className="font-medium text-3xl">
                      Be{" "}
                      <span className="text-indigo-600">
                        {data.name + `'s`}
                      </span>{" "}
                      friend
                    </h1>
                    <p className="text-gray-600 mt-6">
                      {data.description}
                    </p>
                    <Formik
                      initialValues={initialValues}
                      validate={validateForm}
                      onSubmit={handleSubmit}
                    >
                      <Form>
                        <div className="mt-8 grid lg:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="name"
                              className="text-sm text-gray-700 block mb-1 font-medium"
                            >
                              Name
                            </label>
                            <Field
                              type="text"
                              name="user_name"
                              id="name"
                              className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                              placeholder="Enter your name"
                              readOnly
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="text-sm text-gray-700 block mb-1 font-medium"
                            >
                              Email Address
                            </label>
                            <Field
                              type="text"
                              name="user_email"
                              id="email"
                              className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                              placeholder="yourmail@provider.com"
                              readOnly
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="number"
                              className="text-sm text-gray-700 block mb-1 font-medium"
                            >
                              Phone Number
                            </label>
                            <Field
                              type="number"
                              name="user_number"
                              id="number"
                              className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                              placeholder="your number"
                            />
                            <ErrorMessage
                              name="user_number"
                              component="div"
                              className="text-red-500"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="address"
                              className="text-sm text-gray-700 block mb-1 font-medium"
                            >
                              Address
                            </label>
                            <Field
                              type="text"
                              name="user_address"
                              id="address"
                              className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                              placeholder="your address"
                            />
                            <ErrorMessage
                              name="user_address"
                              component="div"
                              className="text-red-500"
                            />
                          </div>
                        </div>

                        <div className="space-x-4 mt-8">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-blue-100
                            hover:text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-800 px-4 py-2 text-sm font-medium text-blue-100
                            hover:text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                        </div>
                      </Form>
                    </Formik>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default PetDetails;
