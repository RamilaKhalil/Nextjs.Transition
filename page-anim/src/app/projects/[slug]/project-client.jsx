
"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "@studio-freight/react-lenis";
import { useRouter } from "next/navigation";

export default function ProjectClient({ project, nextProject, prevProject }) {
  const projectNavRef = useRef(null);
  const progressBarRef = useRef(null);
  const projectDescriptionRef = useRef(null);
  const projectTitleRef = useRef(null); // Title animation ref
  const footerRef = useRef(null);
  const nextProjectProgressBarRef = useRef(null);
  const imagesRef = useRef([]);
const footerTextLeftRef = useRef(null);
const footerTextRightRef = useRef(null);



  const router = useRouter(); // ✅ Router declared at top level

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shouldUpdateProgress, setShouldUpdateProgress] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
       //Project Title Animation
    gsap.set(projectTitleRef.current, { opacity: 0, y: 50 });
    gsap.to(projectTitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      delay: 1.8,
      ease: "power3.out",
    });


    // Navbar Animation
    gsap.set(projectNavRef.current, { opacity: 0, y: -100 });
    gsap.to(projectNavRef.current, { opacity: 1, y: 0, duration: 1, delay: 1, ease: "power3.out" });

    // Description Animation
    // gsap.to(projectDescriptionRef.current, { opacity: 1, duration: 1.5, delay: 1.3, ease: "power3.out" });
    gsap.set(projectDescriptionRef.current, { opacity: 0, y: 50 });
    gsap.to(projectDescriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      delay: 1.8,
      ease: "power3.out",
    });

    // Scroll Progress Animation
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (progressBarRef.current) {
          gsap.set(progressBarRef.current, { scaleX: self.progress });
        }
      },
    });
    // Image Scroll Animation
  imagesRef.current.forEach((img, index) => {
    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.1 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: img,
          start: "top 90%",
          end: "top 50%",
          scrub: 1,
        },
      }
    );
  });
  
  // Footer Text Animation
  gsap.set(footerTextLeftRef.current, { x: "-100%", opacity: 0 });
  gsap.set(footerTextRightRef.current, { x: "100%", opacity: 0 });

  gsap.to([footerTextLeftRef.current, footerTextRightRef.current], {
    x: "0%",
    opacity: 1,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: footerRef.current,
      start: "top 80%",
      end: "top 50%",
      scrub: 1,
    },
  });


    // Footer & Next Project Animation
    ScrollTrigger.create({
      trigger: footerRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 3}px`,
      pin: true,
      pinSpacing: true,
      onEnter: () => {
        if (projectNavRef.current && !isTransitioning) {
          gsap.to(projectNavRef.current, { y: -100, delay:1, duration: 1, ease: "power2.inOut" });
        }
      },
      onLeaveBack: () => {
        if (projectNavRef.current && !isTransitioning) {
          gsap.to(projectNavRef.current, { y: 0, duration: 0.5, ease: "power2.inOut" });
        }
      },
      onUpdate: (self) => {
        if (nextProjectProgressBarRef.current && shouldUpdateProgress) {
          gsap.set(nextProjectProgressBarRef.current, { scaleX: self.progress });
        }
        if (self.progress > 1 && !isTransitioning) {
          handleTransition(nextProject.slug);
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [nextProject.slug, isTransitioning, shouldUpdateProgress]);

  // ✅ Page Transition Function
  const handleTransition = (slug) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const tl = gsap.timeline();
    tl.to(".project-page", { opacity: 0, scale: 0.9, duration: 0.6, ease: "power2.inOut" })
      .call(() => {
        router.push(`/projects/${slug}`);
      })
      .set(".project-page", { opacity: 1, scale: 1 });
  };

  return (
    <ReactLenis root>
      <div className="project-page">
        <div className="project-nav" ref={projectNavRef}>
          <div className="link">
            <span>&#8592; &nbsp;</span>
            <Link href={`/projects/${prevProject.slug}`} onClick={(e) => { e.preventDefault(); handleTransition(prevProject.slug); }}>Previous</Link>
          </div>

          <div className="project-page-scroll-progress">
            <p>{project.title}</p>
            <div className="project-page-scroll-progress-bar" ref={progressBarRef}></div>
          </div>

          <div className="link">
            <Link href={`/projects/${nextProject.slug}`} onClick={(e) => { e.preventDefault(); handleTransition(nextProject.slug); }}>Next</Link>
            <span>&#8594; &nbsp; </span>
          </div>
        </div>

        <div className="project-hero">
          <h1 ref={projectTitleRef}>{project.title} </h1>
          <p id="project-description" ref={projectDescriptionRef}>{project.description}</p>
        </div>

        <div className="project-images">
          {project.images && project.images.map((image, index) => (
            <div className="project-img" key={index} ref={(el) => (imagesRef.current[index] = el)}>
              <img src={image} alt="" />
            </div>
          ))}
        </div>

        <div className="project-footer" ref={footerRef}>
          <h1>{nextProject.title}</h1>
          {/* <div className="project-footer-copy">
            <p>Next Project</p>
          </div> */}
      <div className="project-footer-copy">
    <p ref={footerTextLeftRef} className="footer-text-left">Next Project</p>
    <p ref={footerTextRightRef} className="footer-text-right">Next Project</p>
  </div>
          <div className="next-project-progress">
            <div className="next-project-progress-bar" ref={nextProjectProgressBarRef}></div>
          </div>
        </div>
      </div>
    </ReactLenis>
  );
}
