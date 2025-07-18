// import React from "react";
// import Feed from "./Feed";
// import { Outlet } from "react-router-dom";
// import RightSidebar from "./RightSidebar";
// import useGetAllPost from "@/Hooks/useGetAllPost";


// const Home = () => {
//   useGetAllPost();
//   return (
//     <div className="flex ">
      
//       <div className="flex-grow">
//         <Feed /> 
//         <Outlet />
//       </div>
//       <RightSidebar />
//     </div>
//   );
// };

// export default Home;

import React from "react";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/Hooks/useGetAllPost";

const Home = () => {
  useGetAllPost();
  return (
    <div className="flex">
      <Feed />
      <RightSidebar />
    </div>
  );
};

export default Home;

