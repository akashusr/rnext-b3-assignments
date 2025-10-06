import React from "react";
import IconCheckCircle from "../UI/Icons/IconCheckCircle";

export default function SubService({
  reversedLayout,
  title,
  description,
  serviceList,
  summary,
  img,
}) {
  return (
    <div className={`items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16`}>
      <div
        className={`text-gray-500 sm:text-lg dark:text-gray-400 ${reversedLayout && "order-2"}`}
      >
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-8 font-light lg:text-xl">{description}</p>

        <ul
          role="list"
          className="my-7 space-y-5 border-t border-gray-200 pt-8 dark:border-gray-700"
        >
          {serviceList.map((service) => (
            <li className="flex space-x-3" key={service.toLowerCase()}>
              <IconCheckCircle className="h-5 w-5 flex-shrink-0 text-purple-500 dark:text-purple-400" />
              <span className="text-base leading-tight font-medium text-gray-900 dark:text-white">
                {service}
              </span>
            </li>
          ))}
        </ul>

        <p className="mb-8 font-light lg:text-xl">{summary}</p>
      </div>

      <img
        className={`mb-4 hidden w-full rounded-lg lg:mb-0 lg:flex ${reversedLayout && "order-1"}`}
        src={img}
        alt="dashboard feature image"
      />
    </div>
  );
}
