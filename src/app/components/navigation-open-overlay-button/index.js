'use strict';

import React from 'react';

import SVG from '../svg';

export default class NavigationOpenOverlayButton extends React.Component {
  render() {
    return (
      <button onClick={this.props.onOpen} className="nav__open-overlay-button">
        <SVG title="Open menu" spritemapID='menuopen' />
      </button>
    );
  }
};