import Link from "next/link";
import projects from "@/projects";

export default function Projects() {
  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id}>
          <div className="link">
            <span>&#8594;</span>
            <Link href={`/projects/${project.slug}`}>{project.title}</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
