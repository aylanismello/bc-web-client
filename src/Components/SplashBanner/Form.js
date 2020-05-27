import React from 'react';
import arrow from "./tail-right.svg";


const SUBMIT_STATES = {
  SUCCESS: "SUCCESS",
  FAIL: "FAIL",
  ALREADY_COMPLETED: "ALREADY_COMPLETED",
  UNSUBMITTED: "UNSUBMITTED",
};


const Form = ({
  handleSubmit,
  email,
  updateEmail,
  setStyle,
  style,
  hideEmailForm,
}) => (
  <div className="SplashBanner-form-container">
    <form
      className="SplashBanner-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <div className="SplashBanner-email-container">
        <input
          type="email"
          value={email}
          placeholder="Insert your email"
          className="SplashBanner-email"
          onChange={updateEmail}
          onFocus={() => {
            setStyle({ background: "#e54ea3" });
            window.logEvent("FOCUS_EMAIL");
          }}
          onBlur={() => setStyle({})}
        />
        {/* Fucking genius - https://chodounsky.net/2015/05/12/svg-as-a-submit-button/ */}
        <label className="SplashBanner-arrow-submit-group">
          <input type="submit" style={{ display: "none" }} />
          <div className="SplashBanner-arrow-container" style={style}>
            <img
              src={arrow}
              className="SplashBanner-arrow"
              alt="Submit Email Arrow"
              draggable={false}
            />
          </div>
        </label>
      </div>
    </form>
    <div
      className="SplashBanner-close-message-container"
      onClick={hideEmailForm}
    >
      <span className="SplashBanner-close-message"> I'm good, thanks. </span>
    </div>
  </div>
);

const FormSubmitMessage = ({ header, subheader, success, nextAction }) => (
  <div className="SplashBanner-submit-message">
    <span> {header} </span>
    <br />
    <span> {subheader} </span>
    <br />
    <span onClick={nextAction} className="SplashBanner-next-action-msg">
      {" "}
      {success ? "Let's go!" : "Try again"}{" "}
    </span>
  </div>
);

export { Form, FormSubmitMessage, SUBMIT_STATES };