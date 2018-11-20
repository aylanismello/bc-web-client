import React from 'react';
import './AnimatedIcon.scss';

// https://stackoverflow.com/questions/35614809/react-script-tag-not-working-when-inserted-using-dangerouslysetinnerhtml
class AnimatedIcon extends React.Component {
  constructor(props) {
    super(props);
    this.svgIcon = props.svgIcon;
    this.svgScript = /<script>(.+)<\/script>/gi.exec(this.svgIcon);

    if (this.svgScript) {
      this.svgIcon = this.svgIcon.replace(this.svgScript[0], '');
    }
  }

  componentDidMount() {
    if (this.svgScript) window.eval(this.svgScript[1]);
  }

  render() {
    return (
      <div
        className="AnimatedIcon"
        dangerouslySetInnerHTML={{ __html: this.svgIcon }}
      />
    );
  }
}

export default AnimatedIcon;
