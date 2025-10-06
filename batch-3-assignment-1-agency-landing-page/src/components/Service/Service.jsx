import ImgFeatureA from "../../assets/images/features/feature-1.png";
import ImgFeatureB from "../../assets/images/features/feature-2.png";
import SubService from "./SubService";

export default function Service() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl space-y-12 px-4 py-8 lg:space-y-20 lg:px-6 lg:py-24">
        <SubService
          reversedLayout={false}
          title="Work with tools you already use"
          description="Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease."
          summary="Deliver great service experiences fast - without the complexity of traditional ITSM solutions."
          img={ImgFeatureA}
          serviceList={[
            "Continuous integration and deployment",
            "Development workflow",
            "Knowledge management",
          ]}
        />

        <SubService
          reversedLayout={true}
          title=" We invest in the world’s potential"
          description=" Deliver great service experiences fast - without the complexity of traditional ITSM solutions. Accelerate critical development work, eliminate toil, and deploy changes with ease."
          summary="Deliver great service experiences fast - without the complexity of traditional ITSM solutions."
          img={ImgFeatureB}
          serviceList={[
            "Dynamic reports and dashboards",
            "Templates for everyone",
            "Development workflow",
            "Limitless business automation",
            "Knowledge management",
          ]}
        />
      </div>
    </section>
  );
}
