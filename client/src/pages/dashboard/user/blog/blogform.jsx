import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Swal from "sweetalert2";
import { imageUpload } from "../../../../utils/imageUpload";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";

const BlogForm = () => {
  const axiosPrivate = useAxiosPrivate();

  const formik = useFormik({
    initialValues: {
      title: "",
      author: "",
      category: "",
      content: "",
      coverImage: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      author: Yup.string().required("Author is required"),
      category: Yup.string().required("Category is required"),
      content: Yup.string().required("Content is required"),
      coverImage: Yup.mixed().required("Cover image is required"),
    }),
    onSubmit: async (values, actions) => {
      actions.setSubmitting(false);
      try {
        const coverImageUrl = await imageUpload(values.coverImage);
        const blogData = {
          ...values,
          coverImageUrl: coverImageUrl?.data?.display_url,
        };
        const res = await axiosPrivate.post("/api/blogs", blogData);
        if (res.data.acknowledged) {
          Swal.fire({
            title: "Blog added!",
            text: "Your blog has been added successfully.",
            icon: "success",
          });
        }
      } catch (error) {
        console.error("Error uploading blog:", error);
        Swal.fire({
          title: "Error",
          text: "There was an issue adding your blog. Please try again.",
          icon: "error",
        });
      }
    },
  });

  const categoryOptions = [
    { value: "Tech", label: "Tech" },
    { value: "Lifestyle", label: "Lifestyle" },
    { value: "Travel", label: "Travel" },
    { value: "Food", label: "Food" },
    { value: "Business", label: "Business" },
  ];

  const handleCategoryChange = (selectedOption) => {
    formik.setFieldValue("category", selectedOption ? selectedOption.value : "");
  };

  const handleImageUpload = (event) => {
    formik.setFieldValue("coverImage", event.target.files[0]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4">
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            className="bg-white border border-gray-300 rounded-lg py-2 px-3 block w-full"
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            name="author"
            onChange={formik.handleChange}
            value={formik.values.author}
            className="bg-white border border-gray-300 rounded-lg py-2 px-3 block w-full"
          />
          {formik.touched.author && formik.errors.author ? (
            <div className="text-red-500 text-sm">{formik.errors.author}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="category">Category:</label>
          <Select
            id="category"
            name="category"
            options={categoryOptions}
            onChange={handleCategoryChange}
            value={categoryOptions.find(
              (option) => option.value === formik.values.category
            )}
            className="mb-2"
          />
          {formik.touched.category && formik.errors.category ? (
            <div className="text-red-500 text-sm">{formik.errors.category}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            rows="10"
            onChange={formik.handleChange}
            value={formik.values.content}
            className="bg-white border border-gray-300 rounded-lg py-2 px-3 block w-full"
          />
          {formik.touched.content && formik.errors.content ? (
            <div className="text-red-500 text-sm">{formik.errors.content}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="coverImage">Cover Image:</label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleImageUpload}
            className="bg-white border border-gray-300 rounded-lg py-2 px-3 block w-full"
          />
          {formik.touched.coverImage && formik.errors.coverImage ? (
            <div className="text-red-500 text-sm">{formik.errors.coverImage}</div>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
      >
        Submit
      </button>
    </form>
  );
};

export default BlogForm;