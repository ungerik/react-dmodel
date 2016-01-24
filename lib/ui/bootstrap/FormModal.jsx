import React, { PropTypes } from "react";
import ReactDOM from "react-dom";
import { Modal, Button } from "react-bootstrap";

import DataModel from "../../DataModel";
import mapDefault from "./mapDefault";


export default class FormModal extends DataModel {
	static displayName = "FormModal";
	static dataModelType = "DataModel";

	static propTypes = {
		children: PropTypes.node,
		bsSize: PropTypes.string,
		dialogClassName: PropTypes.string,
		show: PropTypes.bool.isRequired,
		title: PropTypes.string,

		onCancel: PropTypes.func.isRequired,
		cancelText: PropTypes.string,
		onSave: PropTypes.func.isRequired,
		saveText: PropTypes.string,
		data: PropTypes.object.isRequired,
		mapFunc: PropTypes.func,
		style: React.PropTypes.object,
	};

	static defaultProps = {
		title: null,
		bsSize: null,
		dialogClassName: "",
		cancelText: "Cancel",
		saveText: "Save",
		mapFunc: mapDefault,
		style: {},
	};

	inputRefs = [];

	componentDidMount() {
		if (this.props.show) {
			this.onShow();
		}
	}

	componentWillUpdate(nextProps) {
		if (nextProps.show !== this.props.show) {
			this.inputRefs = [];
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.show && this.props.show) {
			this.onShow();
		}
	}

	focusRefInput(ref) {
		if (ref.refs.input) {
			const input = ReactDOM.findDOMNode(ref.refs.input);
			input.focus();
			input.scrollIntoView();
		}
	}

	onShow() {
		if (this.inputRefs.length > 0) {
			this.focusRefInput(this.inputRefs[0]);
		}
	}

	onRef(ref) {
		if (ref) {
			this.inputRefs.push(ref);

			const next = this.inputRefs.length;
			ref.onKeyUp = event => {
				if (event.keyCode === 13 && next < this.inputRefs.length) {
					this.focusRefInput(this.inputRefs[next]);
				}
			};
		}
	}

	render() {
		const { bsSize, dialogClassName, show} = this.props;
		const { title, cancelText, saveText } = this.props;
		const { onCancel, onSave } = this.props;
		const mappedChildren = super.render();
		return (
			<Modal bsSize={bsSize} dialogClassName={dialogClassName} show={show} onHide={() => undefined}>
				<Modal.Header>
					{title ? <Modal.Title>{title}</Modal.Title> : null}
				</Modal.Header>
				<Modal.Body>
					{mappedChildren}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => onCancel()}>{cancelText}</Button>
					<Button bsStyle="primary" onClick={() => onSave(this.state)}>{saveText}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
