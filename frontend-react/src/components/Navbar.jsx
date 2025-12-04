import { Link } from "react-router-dom";
import { FaMusic, FaPlus } from "react-icons/fa";
import { colors } from "../theme/colors";

const navStyle = {
  display: "flex",
  alignItems: "center",
  padding: "16px 24px",
  background: "#181818",
  borderBottom: "1px solid #222",
  gap: "20px"
};

export default function Navbar() {
  return (
    <div style={navStyle}>
      <Link to="/" style={{ color: colors.accent, fontSize: "22px" }}>
        <FaMusic />
      </Link>

      <Link to="/" style={{ color: "white", textDecoration: "none" }}>
        Tracks
      </Link>

      <Link
        to="/create"
        style={{
          marginLeft: "auto",
          background: colors.accent,
          color: "black",
          padding: "8px 16px",
          borderRadius: "6px",
        }}
      >
        <FaPlus style={{ marginRight: "6px" }} />
        Add Track
      </Link>
    </div>
  );
}
