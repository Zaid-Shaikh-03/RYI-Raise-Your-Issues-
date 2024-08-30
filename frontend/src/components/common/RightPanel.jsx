import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useFollow from "../../hooks/useFollow";

import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState } from "react";

const RightPanel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [top5Users, setTop5Users] = useState([]);

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/all");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (!users) return;

    const filteredUsers = users
      .filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
    setTop5Users(filteredUsers);
  }, [searchQuery, users]);

  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { follow, isPending } = useFollow();

  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;

  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="dropdown p-4 rounded-lg sticky top-2 mb-3 z-30">
        <label
          tabIndex={0}
          role="button"
          className="input input-bordered flex items-center gap-2 rounded-lg relative"
        >
          <input
            type="text"
            className="grow "
            placeholder="Search"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-zinc-800 rounded-lg z-[1] w-60 p-0 shadow top-14 left-0"
          >
            {top5Users &&
              top5Users.map((user) => (
                <li>
                  <Link
                    to={`/profile/${user.username}`}
                    className="mt-auto mb-3 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-lg"
                  >
                    <div className="avatar hidden md:inline-flex">
                      <div className="w-8 rounded-full">
                        <img
                          src={user?.profileImg || "/avatar-placeholder.png"}
                        />
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-white font-bold text-sm w-36 truncate">
                        {user?.fullName}
                      </p>
                      <p className="text-slate-500 text-sm">
                        @{user?.username}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </label>
      </div>
      <div className="bg-[#16181C] p-4 rounded-md sticky top-24 ">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullName}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size="sm" /> : "Follow"}
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
