import React from 'react';
import axios from 'axios';
import { Image } from 'cloudinary-react';
import arrow from './tail-right.svg';
import EQPlayButton from '../EQPlayButton';
import { baseUrl } from '../../config';
import './splash_banner.scss';

const Form = ({
  handleSubmit,
  email,
  updateEmail,
  setStyle,
  style,
  hideEmailForm
}) => (
  <div className="SplashBanner-form-container">
    <form
      className="SplashBanner-form"
      onSubmit={e => {
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
            setStyle({ background: '#e54ea3' });
          }}
          onBlur={() => setStyle({})}
        />
        {/* Fucking genius - https://chodounsky.net/2015/05/12/svg-as-a-submit-button/ */}
        <label className="SplashBanner-arrow-submit-group">
          <input type="submit" style={{ display: 'none' }} />
          <div className="SplashBanner-arrow-container" style={style}>
            <img
              src={arrow}
              className="SplashBanner-arrow"
              onFocus={() => this.setState({ style: { background: 'white' } })}
              onBlur={() => this.setState({})}
              alt="Submit Email Arrow"
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

const FormSubmitMessage = ({
 header, subheader, success, nextAction
}) => (
  <div className="SplashBanner-submit-message">
    <span> {header} </span>
    <br />
    <span> {subheader} </span>
    <br />
    <span onClick={nextAction} className="SplashBanner-next-action-msg">
      {' '}
      {success ? "Let's go!" : 'Try again'}{' '}
    </span>
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
    errorMessage: null,
    icon: 'eq'
  });

  componentDidMount() {
    if (
      window.localStorage.getItem('dontShowEmailForm') ||
      this.props.isFromEmail
    ) {
      this.setState({ submitStatus: SUBMIT_STATES.ALREADY_COMPLETED });
    } else {
      this.setState({ submitStatus: SUBMIT_STATES.UNSUBMITTED });
    }
  }

  hideEmailForm() {
    window.localStorage.setItem('dontShowEmailForm', true);
    this.setState({ submitStatus: SUBMIT_STATES.ALREADY_COMPLETED });
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

  generateCTA() {
    if (this.state.submitStatus === SUBMIT_STATES.ALREADY_COMPLETED) {
      return 'DIVE RIGHT INTO THE LATEST TRACKS';
    } else {
      return 'GET THE LATEST TRACKS WEEKLY';
    }
  }

  resetForm() {
    this.setState({ email: '', submitStatus: SUBMIT_STATES.UNSUBMITTED });
  }

  renderBannerContent() {
    switch (this.state.submitStatus) {
      case SUBMIT_STATES.ALREADY_COMPLETED:
        return <EQPlayButton {...this.props} />;
      case SUBMIT_STATES.UNSUBMITTED:
        return (
          <Form
            email={this.state.email}
            handleSubmit={() => this.handleSubmit()}
            updateEmail={e => this.updateEmail(e)}
            setStyle={style => this.setState({ style })}
            style={this.state.style}
            hideEmailForm={() => this.hideEmailForm()}
          />
        );
      case SUBMIT_STATES.FAIL:
        const header =
          this.state.errorMessage || "Something isn't working as expected.";
        return (
          <FormSubmitMessage
            header={header}
            subheader="Sorry, try again later!"
            success={false}
            nextAction={() => this.resetForm()}
          />
        );
      case SUBMIT_STATES.SUCCESS:
        return (
          <FormSubmitMessage
            header="Thanks for subscribing!"
            subheader="Watch your inbox for weekly 🔥!"
            success
            nextAction={() =>
              this.setState({ submitStatus: SUBMIT_STATES.ALREADY_COMPLETED })
            }
          />
        );
      default:
        return <FormSubmitMessage {...this.state} />;
    }
  }

  render() {
    return (
      <div className="SplashBanner">
        <div className="SplashBanner-image-container">
          <Image
            className="SplashBanner-image"
            alt="Burn Cartel Weekly Banner"
            crop="fit"
            quality="50"
            cloudName="burncartel"
            publicId="bc_header_1"
          />
        </div>

        <div className="SplashBanner-content">
          <div className="SplashBanner-message-container">
            <div className="SplashBanner-message-header">
              Music happens fast
            </div>
            <div className="SplashBanner-message-subheader">
              {' '}
              {this.generateCTA()}
            </div>
          </div>
          {this.renderBannerContent()}
        </div>
      </div>
    );
  }
}

export default SplashBanner;
