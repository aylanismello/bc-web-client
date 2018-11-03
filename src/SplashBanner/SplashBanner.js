import React from 'react';
import arrow from './tail-right.svg';
import './splash_banner.scss';

const Form = ({ handleSubmit, email, updateEmail }) => (
  <div className="SplashBanner-form-container">
    <form className="SplashBanner-form" id="1" onSubmit={() => handleSubmit()}>
      <div className="SplashBanner-email-container">
        <input
          type="email"
          value={email}
          placeholder="Insert your email..."
          className="SplashBanner-email"
          onChange={updateEmail}
        />
        <div className="SplashBanner-arrow-container">
          <img
            src={arrow}
            className="SplashBanner-arrow"
            onClick={() => {
              // why doesnt this work
              const el = document.getElementById('1');
              el.submit();
            }}
          />
        </div>
      </div>
    </form>
  </div>
);

const FormSubmitMessage = () => (
  <div className="SplashBanner-submit-message">
    <span> Thanks for subscribing! </span>
    <br />
    <span> Watch your inbox for weekly 🔥! </span>
  </div>
);

class SplashBanner extends React.Component {
  state = {
    email: '',
    submitted: false
  };

  handleSubmit() {
    this.setState({ submitted: true });
  }

  updateEmail(e) {
    this.setState({ email: e.target.value });
  }

  render() {
    return (
      <div className="SplashBanner">
        <div className="SplashBanner-image-container">
          <img src="https://source.unsplash.com/FhdC7RGb5Yg/" className="SplashBanner-image" />
        </div>

        <div className="SplashBanner-content">
          <div className="SplashBanner-message-container">
            <div className="SplashBanner-message-header">Music happens fast</div>
            <div className="SplashBanner-message-subheader"> GET THE LATEST TRACKS WEEKLY</div>
          </div>
          {this.state.submitted ? (
            <FormSubmitMessage />
          ) : (
            <Form
              email={this.state.email}
              handleSubmit={() => this.handleSubmit()}
              updateEmail={e => this.updateEmail(e)}
            />
          )}
        </div>
      </div>
    );
  }
}

export default SplashBanner;
