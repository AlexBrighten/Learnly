"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

import CourseItem from "./card";


function CourseList() {
  const { user, isLoaded } = useUser();
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GetCourseList = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) return; // Guard: don't call API without a valid email

    try {
      const result = await axios.post("/api/courses/", {
        createdBy: email,
      });
      setCourseList(result.data.result);
    } catch (err) {
      console.error("Error fetching course list:", err.message);
      console.error("Server response:", err?.response?.status, err?.response?.data);
      setError(`Failed to load courses: ${err?.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      GetCourseList();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mt-10">
        <h2 className="font-bold text-2xl mb-5">Your Study Material</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {courseList.map((course, index) => (
                <CourseItem course={course} key={index}/>
            ))}
        </div>
    </div>
  );
}

export default CourseList;
