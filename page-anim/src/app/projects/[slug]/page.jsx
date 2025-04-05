import projects from "@/projects"; // Ensure the correct import path
import ProjectClient from "./project-client";

export default function ProjectPage({ params }) {
  const { slug } = params;

  // Find the project by its slug
  const project = projects.find((p) => p.slug === slug);

  // Find current index
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextIndex = (currentIndex + 1) % projects.length;
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;

  const nextProject = projects[nextIndex];
  const prevProject = projects[prevIndex];

  return (
    <ProjectClient
      project={project}
      nextProject={projects[nextIndex]}
      prevProject={projects[prevIndex]}
    />
  );
}
