declare global {
  interface Window {
    THREE: typeof import("three");
    THREEAddons: typeof import("three/addons")
    GSAP: typeof import("gsap").gsap;
  }
}

export {};
