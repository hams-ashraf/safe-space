import React from "react";
import "./Footer.css"

export default function Footer() {
  return (
   <>
    <footer className="text-white py-4 mt-5 h-25">
      <div className="container text-center">
        <p>&copy; 2026 Safe Space. All rights reserved.</p>
        <p>
          <a href="#" className="text-white me-3">Privacy Policy</a>
          <a href="#" className="text-white">Terms of Service</a>
        </p>
      </div>
    </footer>
    </>
  )
}

