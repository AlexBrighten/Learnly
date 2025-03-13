import { Button } from "../../../components/ui/button";
import Link from "next/link";
import SpotlightCard from "./NewCourseCardItem";
import Loader from "./Loader";

function CourseItem({ course }) {
  console.log("course", course.status);

  return (

    <SpotlightCard className="custom-spotlight-card mt-5    " spotlightColor="rgba(0, 229, 255, 0.2)">
        <h5 className="text-2xl font-bold tracking-tight text-White dark:text-white mb-2">
            {course.courseLayout.courseTitle}
        </h5>
        <p className="font-normal text-white dark:text-gray-400 mb-4">
            {course.courseLayout.courseSummary}
        </p>

        <div className="flex justify-end items-center">
            {course.status === "Generating" ? (
            <div className="flex justify-center items-center">
                <Loader />
            </div>
        ) : (
            <Link href={`/course/${course.courseId}`} passHref>
                <Button variant="primary" size="lg">
                <span className="truncate font-sm">Continue !</span>
                </Button>
            </Link>
        )}
        </div>
    </SpotlightCard>

  );
}

export default CourseItem;
