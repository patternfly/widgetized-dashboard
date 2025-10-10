module.exports = {
  '/design-guidelines': {
    id: "Widgetized dashboard",
    title: "Widgetized dashboard",
    toc: [{"text":"Header"},[{"text":"Sub-header"}]],
    section: "extensions",
    source: "design-guidelines",
    Component: () => import(/* webpackChunkName: "design-guidelines/index" */ './design-guidelines')
  },
  '/react': {
    id: "Widgetized dashboard",
    title: "Widgetized dashboard",
    toc: [{"text":"Basic usage"},[{"text":"Example"},{"text":"Fullscreen example"}]],
    examples: ["Example"],
    fullscreenExamples: ["Fullscreen example"],
    section: "extensions",
    source: "react",
    Component: () => import(/* webpackChunkName: "react/index" */ './react')
  }
};