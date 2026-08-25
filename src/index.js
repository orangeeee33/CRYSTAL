import "./reset.css";
import "./navbar.css";
import "./hero.css";
import "./home.css";
import "./section.css";
import "./eyelook.css";
import "./eyemarker.css";
import "./hoverimage.css";
import "./product.css";
import "./about.css";
import "./contact.css";
import "./media.css";

import "./cart.js";
import "./products-slider.js";
import "./checkout.js";
import "./contact.js"


import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


// ==========================================
// ELEMENTS
// ==========================================

const body = document.body;

const introScreen =
  document.querySelector(".intro-screen");

const makeupVideo =
  document.querySelector("#makeupVideo");

const eyeMarker =
  document.querySelector("#eyeMarker");


// ==========================================
// START MAIN EXPERIENCE
// ==========================================

function startExperience() {

  body.classList.add("experience-ready");

  window.scrollTo(0, 0);

  setupVideoScroll();
}
startExperience();


// ==========================================
// VIDEO SCROLL + EYE ZOOM
// ==========================================

function setupVideoScroll() {

  if (!makeupVideo) {
    return;
  }

  let targetTime = 0;
  let smoothTime = 0;


  function createScroll() {

    const duration = makeupVideo.duration;

    const lastSafeFrame = duration;

    makeupVideo.pause();
    makeupVideo.currentTime = 0;


    // مكان العين

    const eyePosition =
      window.innerWidth <= 768
        ? "65% 43%"
        : "58% 43%";


    // بداية الفيديو بدون زوم

    gsap.set(
      makeupVideo,
      {
        scale: 1,
        transformOrigin: eyePosition
      }
    );


    ScrollTrigger.create({

      trigger:
        ".video-scroll-space",

      start:
        "top top",

      end:
        "bottom bottom",

      scrub:
        true,

      invalidateOnRefresh:
        true,


      onUpdate(self) {

        const progress =
          self.progress;


        // ==================================
        // VIDEO
        // أول 70% من السكرول
        // ==================================

        const videoProgress =
          Math.min(
            progress / 0.7,
            1
          );


        targetTime =
          videoProgress *
          lastSafeFrame;


        // ==================================
        // ZOOM
        // يبدأ بعد انتهاء الفيديو
        // ==================================

        const zoomProgress =
          gsap.utils.clamp(
            0,
            1,
            (progress - 0.7) / 0.3
          );


        gsap.set(
          makeupVideo,
          {
            scale:
              1 +
              zoomProgress * 0.25,

            transformOrigin:
              eyePosition
          }
        );


        // ==================================
        // EYE MARKER
        // ==================================

        if (progress >= 0.80) {

          eyeMarker?.classList.add(
            "show"
          );

        } else {

          eyeMarker?.classList.remove(
            "show"
          );

        }

      },
      onLeave :()=> {eyeMarker?.classList.remove("show");

      },
      onLeaveBack: ()=>{
        eyeMarker?.classList.remove("show");
      }

    });

    // ======================================
    // SMOOTH VIDEO
    // ======================================

    function smoothVideo() {

      smoothTime +=
        (targetTime - smoothTime) *
        0.25;


      if (
        Math.abs(
          makeupVideo.currentTime -
          smoothTime
        ) > 0.016
      ) {

        makeupVideo.currentTime =
          smoothTime;

      }


      requestAnimationFrame(
        smoothVideo
      );

    }


    smoothVideo();

    ScrollTrigger.refresh();

  }


  // إذا الفيديو جاهز

  if (
    makeupVideo.readyState >= 1
  ) {

    createScroll();

  } else {

    makeupVideo.addEventListener(
      "loadedmetadata",
      createScroll,
      {
        once: true
      }
    );

  }

}