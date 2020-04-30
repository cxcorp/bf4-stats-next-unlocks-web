import { Button, Spinner } from "react-bootstrap";

const LoadingButton = ({ text = "Loading", ...props }) => (
  <Button disabled variant="primary" {...props}>
    <span className="pr-2">{text}</span>
    <Spinner
      as="span"
      animation="border"
      size="sm"
      role="status"
      aria-hidden="true"
    />
  </Button>
);

export default LoadingButton;
