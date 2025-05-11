import {pixi} from "../../../../utils/imports/pixiGame/import-pixi.ts";

export async function customGsap(spaceId) {
  const {default: gsap} = await import("gsap");

  window.gsap = gsap;

  if (typeof spaceId !== "string") return;

  const {default: LocalTimeline} = await import ("../../../utils/gsap/LocalTimeline");

  const localTimeline = gsap.localTimeline = new LocalTimeline();

  localTimeline.createSpace(spaceId);
}

export async function gamePixiImports(spaceId) {
  await customGsap(spaceId);
  await pixi();
}
