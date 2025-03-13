import { UnitBanner } from "../../../../dashboard/_components/UnitBanner";
import CourseList from "../../../../dashboard/_components/CourseList";
import WelcomeBanner from "../../../../dashboard/_components/WelcomeBanner";

export default function Learn() {
  return (
    <div>
      <WelcomeBanner />
      <div className="mt-5">
        <CourseList />
      </div>

    </div>
  )
}
