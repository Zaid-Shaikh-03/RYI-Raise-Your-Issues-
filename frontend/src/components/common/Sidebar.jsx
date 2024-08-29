import RYISvg from "../svg/RYI";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaVolumeUp } from "react-icons/fa";

import toast from "react-hot-toast";

const Sidebar = () => {
  const { pathname } = useLocation();

  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        // navigate("/logout");
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logout successful!");
    },
    onError: () => {
      toast.error("Logout Failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52 pl-5 pt-4">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link
          to="/"
          className="flex flex-col justify-center md:justify-start pt-2"
        >
          {/* <RYISvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" /> */}
          <FaVolumeUp className="w-8 h-8 self-center" />
          <h1 className="w-full text-lg text-yellow-300 py-1">
            <span className="text-yellow-300 md:text-white text-center block md:inline">
              RYI
            </span>{" "}
            <span className="hidden md:inline">:Raise Your Issue</span>
          </h1>
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start ">
            <Link
              acti
              to="/"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-lg duration-300 py-2 pl-2 pr-4  cursor-pointer  w-full mr-3 relative overflow-hidden"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
              <div
                className={`bg-white w-1 h-full  absolute right-0 ${
                  pathname.split("/")[1] === "" ? "bg-white" : "bg-black"
                }`}
              ></div>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-lg duration-300 py-2 pl-2 pr-4  cursor-pointer  w-full mr-3 relative overflow-hidden"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
              <div
                className={`bg-white w-1 h-full  absolute right-0 ${
                  pathname.split("/")[1] === "notifications"
                    ? "bg-white"
                    : "bg-black"
                }`}
              ></div>
            </Link>
          </li>

          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-lg duration-300 py-2 pl-2 pr-4 mr-3 cursor-pointer  w-[100%] relative overflow-hidden"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
              <div
                className={`bg-white w-1 h-full  absolute right-0 ${
                  pathname.split("/")[1] === "profile" ? "bg-white" : "bg-black"
                }`}
              ></div>
            </Link>
          </li>
        </ul>
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1 gap-2">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer self-center"
                onClick={(e) => {
                  e.preventDefault();
                  logoutMutation();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
