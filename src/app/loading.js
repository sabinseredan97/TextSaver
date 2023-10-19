import { Spinner } from "react-bootstrap";

export default function Loading() {
  return (
    <div className="mt-5 text-center">
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="danger" />
    </div>
  );
}
