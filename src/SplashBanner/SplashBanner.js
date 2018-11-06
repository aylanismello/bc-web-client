import React from 'react';
import axios from 'axios';
import arrow from './tail-right.svg';
import { baseUrl } from '../config';
import './splash_banner.scss';

const Form = ({
 handleSubmit, email, updateEmail, setStyle, style
}) => (
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
            setStyle({ background: '#e54ea3' });
          }}
          onBlur={() => setStyle({})}
        />
        <div className="SplashBanner-arrow-container" style={style}>
          <img
            src={arrow}
            className="SplashBanner-arrow"
            onFocus={() => this.setState({ style: { background: 'white' } })}
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

const SUBMIT_STATES = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  ALREADY_COMPLETED: 'ALREADY_COMPLETED',
  UNSUBMITTED: 'UNSUBMITTED'
};

class SplashBanner extends React.Component {
  state = Object.freeze({
    email: '',
    submitStatus: null,
    style: {},
    errorMessage: null
  });

  componentDidMount() {
    if (window.localStorage.getItem('dontShowEmailForm')) {
      this.setState({ submitStatus: SUBMIT_STATES.ALREADY_COMPLETED });
    } else {
      this.setState({ submitStatus: SUBMIT_STATES.UNSUBMITTED });
    }
  }

  handleSubmit() {
    axios
      .post(`${baseUrl}/emails`, {
        email: this.state.email
      })
      .then(({ data }) => {
        const { message } = data.error;

        if (message) {
          this.setState({
            submitStatus: SUBMIT_STATES.FAIL,
            errorMessage: message
          });
        } else {
          // successful
          window.localStorage.setItem('dontShowEmailForm', true);
          this.setState({ submitStatus: SUBMIT_STATES.SUCCESS });
        }
      })
      .catch(error => {
        this.setState({
          submitStatus: SUBMIT_STATES.FAIL,
          errorMessage: error
        });
      });
  }

  updateEmail(e) {
    this.setState({ email: e.target.value });
  }

  renderBannerContent() {
    switch (this.state.submitStatus) {
      case SUBMIT_STATES.ALREADY_COMPLETED:
        return <div />;
      case SUBMIT_STATES.UNSUBMITTED:
        return (
          <Form
            email={this.state.email}
            handleSubmit={() => this.handleSubmit()}
            updateEmail={e => this.updateEmail(e)}
            setStyle={style => this.setState({ style })}
            style={this.state.style}
          />
        );
      case SUBMIT_STATES.FAIL:
        const header = this.state.errorMessage || "Something isn't working as expected.";
        return <FormSubmitMessage header={header} subheader="Sorry, try again later!" />;
      case SUBMIT_STATES.SUCCESS:
        return <FormSubmitMessage header="Thanks for subscribing!" subheader="Watch your inbox for weekly 🔥!" />;
      default:
        return <FormSubmitMessage {...this.state} />;
    }
  }

  render() {
    return (
      <div className="SplashBanner">
        <div className="SplashBanner-image-container">

          {/* <img
            src="https://source.unsplash.com/FhdC7RGb5Yg/"
            alt="Burn Cartel Weekly Banner"
            className="SplashBanner-image"
          /> */}
        </div>

        <div className="SplashBanner-content">
          <div className="SplashBanner-message-container">
            <div className="SplashBanner-message-header">
              Music happens fast
            </div>
            <div className="SplashBanner-message-subheader">
              {' '}
              GET THE LATEST TRACKS WEEKLY
            </div>
          </div>
          {this.renderBannerContent()}
        </div>
      </div>
    );
  }
}

export default SplashBanner;
