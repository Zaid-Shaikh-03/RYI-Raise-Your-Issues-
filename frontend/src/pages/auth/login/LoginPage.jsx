import { useState } from "react";
import { Link } from "react-router-dom";

import RYISvg from "../../../components/svg/RYI";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        // navigate("/login");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      //refetch the authUser
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row h-screen justify-start ">
      <div className="md:flex-1 md:flex items-center justify-center h-[30%] md:h-full">
        <img
          className="w-full h-full object-cover object-center"
          src="./SignUpPage.png"
          alt=""
        />
      </div>
      <div className="flex-1 flex flex-col  items-center justify-start md:justify-center mt-10 md:mt-0">
        <form className="lg:w-2/3 flex gap-4 flex-col" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold tracking-wide text-white">
            {"Welcome back!"}{" "}
          </h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-lg btn-primary text-white">
            {isPending ? "Loading..." : "Login"}
          </button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col  lg:w-2/3  gap-2 mt-4">
          <p className="text-white text-center text-lg">
            {"Don't"} have an account?
          </p>
          <Link to="/signup">
            <button className="btn w-full rounded-lg btn-primary text-black btn-outline ">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
