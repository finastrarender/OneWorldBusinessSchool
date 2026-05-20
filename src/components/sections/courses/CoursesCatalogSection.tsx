/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import type { z } from "zod";
import type { coursesCatalogDataSchema } from "@/schemas/sections";

type CoursesCatalogContent = z.infer<typeof coursesCatalogDataSchema>;

function resolveCourseImage(course: Record<string, unknown>) {
  const direct = typeof course.image === "string" ? course.image.trim() : "";
  if (direct) return direct;
  const legacy = typeof course.iconImage === "string" ? course.iconImage.trim() : "";
  if (legacy) return legacy;
  return "/home/headquarters.png";
}

export default function CoursesCatalogSection({ content }: { content: CoursesCatalogContent }) {
  const allCategoryLabel = content.categories[0] ?? "All";
  const allLevelLabel = content.levels[0] ?? "All Levels";
  const allDurationLabel = content.durations[0] ?? "Any Duration";

  const [selectedCategory, setSelectedCategory] = useState(allCategoryLabel);
  const [selectedLevel, setSelectedLevel] = useState(allLevelLabel);
  const [selectedDuration, setSelectedDuration] = useState(allDurationLabel);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filteredCourses = useMemo(() => {
    const matchesDuration = (weeksLabel: string) => {
      if (selectedDuration === allDurationLabel) return true;
      const numericWeeks = Number.parseInt(weeksLabel, 10);
      if (Number.isNaN(numericWeeks)) return false;
      if (selectedDuration === "4-8 Weeks") return numericWeeks >= 4 && numericWeeks <= 8;
      if (selectedDuration === "8-12 Weeks") return numericWeeks >= 8 && numericWeeks <= 12;
      if (selectedDuration === "12+ Weeks") return numericWeeks >= 12;
      return true;
    };

    return content.courses.filter((course) => {
      const courseCategory = (course.category ?? "").trim();
      const courseLevel = (course.level ?? course.badge ?? "").trim();
      const categoryOk = selectedCategory === allCategoryLabel || courseCategory === selectedCategory;
      const levelOk = selectedLevel === allLevelLabel || courseLevel === selectedLevel;
      return categoryOk && levelOk && matchesDuration(course.weeks);
    });
  }, [
    allCategoryLabel,
    allDurationLabel,
    allLevelLabel,
    content.courses,
    selectedCategory,
    selectedDuration,
    selectedLevel,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pageCourses = filteredCourses.slice((safePage - 1) * pageSize, safePage * pageSize);

  function applyAndReset(setter: (value: string) => void, value: string) {
    setter(value);
    setCurrentPage(1);
  }

  return (
    <section className="courses-catalog">
      <div >
        <div className="courses-catalog__hero">
          <h1 className="courses-catalog__title">{content.title}</h1>
          <p className="courses-catalog__description">{content.description}</p>
        </div>

        <div className="courses-catalog__layout">
          <aside className="courses-filters">
            <div className="courses-filters__group">
              <h3 className="courses-filters__title">Category</h3>
              <ul className="courses-filters__list">
                {content.categories.map((item) => (
                  <li
                    key={item}
                    className={selectedCategory === item ? "is-active" : ""}
                    onClick={() => applyAndReset(setSelectedCategory, item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        applyAndReset(setSelectedCategory, item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="courses-filters__bullet" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="courses-filters__group">
              <h3 className="courses-filters__title">Level</h3>
              <ul className="courses-filters__list">
                {content.levels.map((item) => (
                  <li
                    key={item}
                    className={selectedLevel === item ? "is-active" : ""}
                    onClick={() => applyAndReset(setSelectedLevel, item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        applyAndReset(setSelectedLevel, item);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="courses-filters__bullet" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="courses-filters__group">
              <h3 className="courses-filters__title">Duration</h3>
              <select
                className="courses-filters__select"
                value={selectedDuration}
                onChange={(event) => applyAndReset(setSelectedDuration, event.target.value)}
              >
                {content.durations.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          <div className="courses-grid">
            {pageCourses.map((course) => (
              <article key={course.title} className="course-card">
                <div className="course-card__media">
                  <img
                    src={resolveCourseImage(course as unknown as Record<string, unknown>)}
                    alt={course.title}
                    className="course-card__image"
                  />
                  <span className="course-card__badge">{course.badge}</span>
                </div>
                <div className="course-card__body">
                  <h3 className="course-card__title">{course.title}</h3>
                  <p className="course-card__description">{course.description}</p>
                  <p className="course-card__skills-label">KEY SKILLS:</p>
                  <div className="course-card__skills">
                    {course.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                  <div className="course-card__meta">
                    <span className="course-card__weeks">
                      <svg
                        className="course-card__weeks-icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M12 7.5V12L15.5 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                      {course.weeks}
                    </span>
                    <a href="?apply=1">Enroll Now -&gt;</a>
                  </div>
                </div>
              </article>
            ))}

            <div className="courses-pagination">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={safePage === page ? "is-active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
