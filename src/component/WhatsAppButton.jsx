import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919876543210"
      target="_blank"
      rel="noopener noreferrer"
      className="
        position-absolute
        end-0
        top-50
        translate-middle-y
        me-3
        bg-success
        text-white
        d-flex
        align-items-center
        justify-content-center
        rounded-circle
        shadow-lg
        whatsapp-btn
      "
      style={{
        width: "60px",
        height: "60px",
        zIndex: 2000,
        marginTop: "210px", // 🔽 moves it a little down
      }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={30} />
    </a>
  );
};

export default WhatsAppButton;
