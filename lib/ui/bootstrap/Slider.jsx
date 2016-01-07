import React from "react";
import BaseSlider from "../Slider";


export default class Slider extends React.Component {
	static displayName = "Slider";

	static propTypes = {
		...BaseSlider.propTypes,
		label: React.PropTypes.string,
	};

	static defaultProps = {
		...BaseSlider.defaultProps,
		label: null,
	};

	render() {
		const { label } = this.props;
		return (
			<div className="form-group">
				{label ? <label className="control-label">{label}</label> : null}
				<div className="input-group">
					<BaseSlider {...this.props} />
				</div>
			</div>
		);
	}
}
