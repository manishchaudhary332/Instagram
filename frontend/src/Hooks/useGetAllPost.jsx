import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPosts } from "@/Redux/postSlice";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(
          "Error fetching posts:",
          error?.response?.data?.message || error.message
        );
      }
    };

    fetchAllPost();
  }, [dispatch]);
};

export default useGetAllPost;
