import React from 'react';
import './BCLoading.scss';
import loading from './assets/loading.svg';

const BCLoading = () => (
    <div className="BCLoading">
    <div className="BCLoading-icon-container">
        <img src={loading} className="BCLoading-icon" alt="bc-loading-icon" />
    </div>
    </div>
);

export default BCLoading;