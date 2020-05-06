export const ChevronDown = ({
  className,
  style = {},
  width = "24px",
  height = "24px",
  ...rest
}) => (
  <svg
    className={className}
    style={{ width, height, ...style }}
    viewBox="0 0 24 24"
    {...rest}
  >
    <path
      fill="currentColor"
      d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
    />
  </svg>
);

export const ChevronUp = ({
  className,
  style = {},
  width = "24px",
  height = "24px",
  ...rest
}) => (
  <svg
    className={className}
    style={{ width, height, ...style }}
    viewBox="0 0 24 24"
    {...rest}
  >
    <path
      fill="currentColor"
      d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"
    />
  </svg>
);
