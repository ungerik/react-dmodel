import React, { PropTypes } from "react";
import { Modal, Button } from "react-bootstrap";

import DataModel from "../../DataModel";
import mapDefault from "./mapDefault";


function noop() {
}


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
		data: PropTypes.object,
		mapFunc: PropTypes.func,
		style: React.PropTypes.object,
		focusFirstInput: PropTypes.bool,
	};

	static defaultProps = {
		title: null,
		bsSize: null,
		dialogClassName: "",
		cancelText: "Cancel",
		saveText: "Save",
		data: {},
		mapFunc: mapDefault,
		style: {},
		focusFirstInput: true,
	};

	inputRefArray = [];
	inputRefMap = new Map();

	componentDidMount() {
		if (this.props.show) {
			this.onShow();
		}
	}

	componentWillUpdate(nextProps) {
		if (nextProps.show && !this.props.show) {
			this.inputRefArray = [];
			this.inputRefMap.clear();
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.show && this.props.show) {
			this.onShow();
		}
	}

	focusRefInput(index) {
		const input = this.inputRefArray[index];
		input.focus();
		input.scrollIntoView();
	}

	onShow() {
		if (this.inputRefArray.length > 0 && this.props.focusFirstInput) {
			this.focusRefInput(0);
		}
	}

	onRef(ref) {
		if (!ref || !ref.refs || this.inputRefMap.has(ref.refs.input)) {
			// Ignore null or refs we already have
			return;
		}

		const inputIndex = this.inputRefArray.length;

		this.inputRefArray.push(ref.refs.input);
		this.inputRefMap.set(ref.refs.input, inputIndex);
	}

	onKeyUp(event) {
		if (event.keyCode !== 13) {
			return;
		}
		const inputIndex = this.inputRefMap.get(event.target);
		if (inputIndex === undefined) {
			return;
		}

		const nextInputIndex = inputIndex + 1;
		if (nextInputIndex < this.inputRefArray.length) {
			this.focusRefInput(nextInputIndex);
		} else if (nextInputIndex === this.inputRefArray.length) {
			if (this.validate() === null) {
				this.props.onSave(this.state);
			}
		}
	}

	render() {
		const { bsSize, dialogClassName, show} = this.props;
		const { title, cancelText, saveText } = this.props;
		const { onCancel, onSave } = this.props;
		const mappedChildren = super.render();
		const validationError = this.validate();
		return (
			<Modal bsSize={bsSize} dialogClassName={dialogClassName} show={show} onHide={noop}>
				<Modal.Header>
					{title ? <Modal.Title>{title}</Modal.Title> : null}
				</Modal.Header>
				<Modal.Body>
					{mappedChildren}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => onCancel()}>{cancelText}</Button>
					<Button bsStyle="primary" disabled={validationError !== null} onClick={() => onSave(this.state)}>{saveText}</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}
