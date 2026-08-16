import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <>
      <a
        href="https://wa.me/923254555681"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="whatsapp-floating-btn"
      >
        {/* Pulse Effect */}
        <span className="whatsapp-pulse"></span>

        {/* Icon */}
        <span className="whatsapp-icon">
          <FaWhatsapp size={30} />
        </span>

        {/* Tooltip */}
        <span className="whatsapp-tooltip">Chat with us</span>
      </a>

      <style>{`
        .whatsapp-floating-btn {
          position: fixed;
          right: 22px;
          bottom: 25px;

          width: 62px;
          height: 62px;

          background: #25D366;
          color: #fff;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          text-decoration: none;

          z-index: 2000;

          box-shadow:
            0 8px 25px rgba(37, 211, 102, 0.35),
            0 4px 10px rgba(0, 0, 0, 0.18);

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            background 0.25s ease;
        }

        .whatsapp-icon {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Hover */
        .whatsapp-floating-btn:hover {
          transform: translateY(-5px) scale(1.06);

          background: #20bd5a;

          color: #fff;

          box-shadow:
            0 12px 30px rgba(37, 211, 102, 0.45),
            0 6px 15px rgba(0, 0, 0, 0.2);
        }

        /* Pulse */
        .whatsapp-pulse {
          position: absolute;

          width: 100%;
          height: 100%;

          border-radius: 50%;

          background: rgba(37, 211, 102, 0.45);

          animation: whatsappPulse 2s infinite;

          z-index: 0;
        }

        @keyframes whatsappPulse {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }

          70% {
            transform: scale(1.35);
            opacity: 0;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        /* Tooltip */
        .whatsapp-tooltip {
          position: absolute;

          right: 75px;

          top: 50%;

          transform: translateY(-50%) translateX(5px);

          background: #111827;
          color: #fff;

          padding: 8px 13px;

          border-radius: 8px;

          font-size: 13px;
          font-weight: 600;

          white-space: nowrap;

          opacity: 0;
          visibility: hidden;

          transition:
            opacity 0.2s ease,
            transform 0.2s ease;

          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.18);
        }

        /* Tooltip arrow */
        .whatsapp-tooltip::after {
          content: "";

          position: absolute;

          right: -6px;
          top: 50%;

          transform: translateY(-50%);

          border-width: 6px 0 6px 6px;
          border-style: solid;

          border-color: transparent transparent transparent #111827;
        }

        .whatsapp-floating-btn:hover .whatsapp-tooltip {
          opacity: 1;
          visibility: visible;

          transform: translateY(-50%) translateX(0);
        }

        /* Mobile */
        @media (max-width: 576px) {
          .whatsapp-floating-btn {
            width: 56px;
            height: 56px;

            right: 16px;
            bottom: 18px;
          }

          .whatsapp-icon svg {
            width: 27px;
            height: 27px;
          }

          .whatsapp-tooltip {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default WhatsAppButton;
