import React from 'react';
import axios from 'axios';
import EQPlayButton from '../EQPlayButton';
import styled from 'styled-components';
import { Form, FormSubmitMessage, SUBMIT_STATES } from "./Form";
import { baseUrl } from '../../config';
import './splash_banner.scss';

const SplashBannerContainer = styled.div`
  height: 200px;
  display: flex;
`;

class SplashBanner extends React.Component {
  state = Object.freeze({
    email: '',
    submitStatus: null,
    style: {},
    errorMessage: null,
    icon: 'eq'
  });

  componentWillMount() {
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
    window.logEvent('HIDE_EMAIL');
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

          window.logEvent('SUBMIT_EMAIL', {
            status: 'FAIL'
          });
        } else {
          // successful
          window.localStorage.setItem('dontShowEmailForm', true);
          this.setState({ submitStatus: SUBMIT_STATES.SUCCESS });

          window.logEvent('SUBMIT_EMAIL', {
            status: 'SUCCESS'
          });
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
      return 'A new world of music - updated everyday.';
    } else {
      return 'Get the latest tracks weekly';
    }
  }

  resetForm() {
    this.setState({ email: '', submitStatus: SUBMIT_STATES.UNSUBMITTED });
  }

  renderBannerContent() {
    switch (this.state.submitStatus) {
      case SUBMIT_STATES.ALREADY_COMPLETED:
        return <EQPlayButton {...this.props} isBannerButton />;
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
    const q = 50;

    return <div className="SplashBanner">
        {/* <div className="SplashBanner-image-container"> */}
        <SplashBannerContainer>
          <div className="SplashBanner-content">
            <div className="SplashBanner-message-container">
              <div className="SplashBanner-message-header">
                Welcome to Burn Cartel
              </div>
              <div className="SplashBanner-message-subheader">
                {" "}
                {this.generateCTA()}
              </div>
            </div>
            {this.renderBannerContent()}
          </div>
        </SplashBannerContainer>
      </div>;
  }
}

export default SplashBanner;
