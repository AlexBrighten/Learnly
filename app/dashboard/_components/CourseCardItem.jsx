import React from "react";
import Loader from "./Loader";
import Link from "next/link";
import SpotlightCard from './NewCourseCardItem';

function CourseCardItem({ course }) {
  console.log("course", course.status);

  return (
      <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
        <div className="flex items-center mb-5 gap-2">
          <h2 className="text-lg font-semibold">
            {course.courseLayout.courseTitle}
          </h2>
        </div>

        <div className="text-sm text-gray-600 py-5 px-3 rounded-lg">
          <p className="line-clamp-4">{course.courseLayout.courseSummary}</p>
        </div>

        <div className="mt-5 flex justify-end items-center">
          {course.status === "Generating" ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <Link href={`course/${course.courseId}`}>
              <button className="btn btn-outline-primary px-4 py-2">
                View
              </button>
            </Link>
          )}
        </div>
        </SpotlightCard>

  );
}

export default CourseCardItem;
