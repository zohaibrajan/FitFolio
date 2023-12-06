import React from "react";
import './LandingPage.css'
import { useHistory } from "react-router-dom";


function LandingPage() {
    const history = useHistory()

    function onClick(e) {
        e.preventDefault()

        history.replace('/signup')
    }

    return (
      <section className="landing-page-section">
        <div className="landing-page">
          <div className="landing-page-text">
            <span style={{ opacity: "0.6" }}>A nutrition tracking app</span>
            <h1 className="landing-page-title">
              <span style={{ fontSize: "65px" }}>Reach your goals</span>
              <span style={{ fontWeight: "400", fontSize: "65px" }}>
                with FitFolio
              </span>
            </h1>
            <span style={{ opacity: "0.8", marginTop: "10px" }}>
              Build healthy habits with the all-in-one food, exercise, and
              calorie tracker
            </span>
            <button onClick={onClick} id="get-started-button">
              START TODAY <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        </div>
      </section>
    );
}

export default LandingPage
