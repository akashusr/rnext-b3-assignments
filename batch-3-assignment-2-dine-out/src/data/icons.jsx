class Icon {
  constructor(innerSVG, attributes) {
    this.innerSVG = innerSVG;
    this.attributes = attributes;
  }
}

export const icons = {
  increase: new Icon(
    (
      <path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
      />
    ),
    { width: 20, height: 20, viewBox: "0 0 20 20", fill: "currentColor" },
  ),
  decrease: new Icon(
    (
      <path
        fillRule="evenodd"
        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    ),
    { width: 20, height: 20, viewBox: "0 0 20 20", fill: "currentColor" },
  ),
  filter: new Icon(
    (
      <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
    ),
    {
      width: 18,
      height: 18,
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
  ),
};
