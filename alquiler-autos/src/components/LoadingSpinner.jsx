import { ClipLoader } from "react-spinners";

export default function LoadingSpinner() {
    return (
        <div
        className="flex justify-content-center align-items-center"
        style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
        }}
        >
        <ClipLoader color="#007bff" size={50} />
        </div>
    );
}
