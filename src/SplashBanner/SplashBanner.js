import React from "react";
import axios from "axios";
import arrow from "./tail-right.svg";
import { baseUrl } from "../config";
import "./splash_banner.scss";

const Form = ({ handleSubmit, email, updateEmail, setStyle, style }) => (
  <div className="SplashBanner-form-container">
    <form className="SplashBanner-form" onSubmit={() => handleSubmit()}>
      <div className="SplashBanner-email-container">
        <input
          type="email"
          value={email}
          placeholder="Insert your email..."
          className="SplashBanner-email"
          onChange={updateEmail}
          onFocus={() => {
            setStyle({ background: "#e54ea3" });
          }}
          onBlur={() => setStyle({})}
        />
        <div className="SplashBanner-arrow-container" style={style}>
          <img
            src={arrow}
            className="SplashBanner-arrow"
            onFocus={() => this.setState({ style: { background: "white" } })}
            onBlur={() => this.setState({})}
            alt="Submit Email Arrow"
            onClick={() => {
              // why doesnt this work
              handleSubmit();
              // const el = document.getElementsByClassName('SplashBanner-form')[0];
              // el.submit();
            }}
          />
        </div>
      </div>
    </form>
  </div>
);

const FormSubmitMessage = ({ header, subheader }) => (
  <div className="SplashBanner-submit-message">
    <span> {header} </span>
    <br />
    <span> {subheader} </span>
  </div>
);

class SplashBanner extends React.Component {
  state = {
    email: "",
    submitted: false,
    header: "Thanks for subscribing!",
    subheader: "Watch your inbox for weekly 🔥!",
    style: {}
  };

  handleSubmit() {
    axios
      .post(`${baseUrl}/emails`, {
        email: this.state.email
      })
      .then(({ data }) => {
        const { message } = data.error;

        if (message) {
          this.setState({
            submitted: true,
            header: message,
            subheader: ""
          });
        } else {
          this.setState({ submitted: true });
        }
      })
      .catch(error => {
        this.setState({
          submitted: true,
          header: "Something isnt working as expecteed.",
          subheader: " Sorry, try again later!"
        });
      });
  }

  updateEmail(e) {
    this.setState({ email: e.target.value });
  }

  render() {
    return (
      <div className="SplashBanner">
        <div className="SplashBanner-image-container">
          <img
            src="https://source.unsplash.com/FhdC7RGb5Yg/"
            alt="Burn Cartel Weekly Banner"
            className="SplashBanner-image"
          />
        </div>

        <div className="SplashBanner-content">
          <div className="SplashBanner-message-container">
            <div className="SplashBanner-message-header">
              Music happens fast
            </div>
            <div className="SplashBanner-message-subheader">
              {" "}
              GET THE LATEST TRACKS WEEKLY
            </div>
          </div>
          {this.state.submitted ? (
            <FormSubmitMessage {...this.state} />
          ) : (
            <Form
              email={this.state.email}
              handleSubmit={() => this.handleSubmit()}
              updateEmail={e => this.updateEmail(e)}
              setStyle={style => this.setState({ style })}
              style={this.state.style}
            />
          )}
        </div>
      </div>
    );
  }
}

export default SplashBanner;
