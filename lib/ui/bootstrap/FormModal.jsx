import React, { PropTypes } from "react";
import { Modal, Button, Alert } from "react-bootstrap";

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
		onFocus: PropTypes.func,
		onBlur: PropTypes.func,
		showValidationErrors: PropTypes.bool,
		readOnly: PropTypes.bool,
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
		onFocus: null,
		onBlur: null,
		showValidationErrors: false,
		readOnly: false,
	};

	inputRefArray = [];
	inputRefMap = new Map();

	constructor(props, ...args) {
		// We can't use this to pass methods to parent props
		// so create functions that close over injectedProps
		// and set the methods of injectedProps after the constructor

		// TODO fix this to get rid of warning:
		// Warning: Unknown props `show`, `onHide`, `backdrop`, `keyboard`, `enforceFocus`, `dialogComponentClass`, `dialogClassName` on <div> tag. Remove these props from the element. For details, see https://fb.me/react-unknown-prop
		//     in div (created by ModalDialog)
		//     in ModalDialog (created by Modal)

		const injectedProps = {
			onRef: null,
			onKeyUp: null,
		};
		const onRef = ref => injectedProps.onRef(ref);
		const onKeyUp = event => injectedProps.onKeyUp(event);

		super({...props, onRef, onKeyUp}, ...args);

		this.onSave = this.onSave.bind(this);
		this.onCancel = this.onCancel.bind(this);
		injectedProps.onRef = this.onRef.bind(this);
		injectedProps.onKeyUp= this.onKeyUp.bind(this);
	}

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
		if (!ref || !ref.refs || !ref.refs.input || this.inputRefMap.has(ref.refs.input)) {
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

	onSave() {
		this.props.onSave(this.state);
	}

	onCancel() {
		this.props.onCancel();
	}

	render() {
		const { show } = this.props;
		if (!show) {
			return null;
		}
		const { bsSize, dialogClassName, showValidationErrors } = this.props;
		const { title, cancelText, saveText, readOnly, onFocus, onBlur } = this.props;
		const mappedChildren = super.render();
		const validationError = this.validate();
		return (
			<Modal
				bsSize={bsSize}
				dialogClassName={dialogClassName}
				show={show}
				onHide={noop}
				onFocus={onFocus}
				onBlur={onBlur}
			>
				{title ? <Modal.Header><Modal.Title>{title}</Modal.Title></Modal.Header> : null}
				<Modal.Body>
					{mappedChildren}
					{showValidationErrors && validationError ? <Alert bsStyle="danger">{validationError.toString()}</Alert> : null}
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.onCancel}>{cancelText}</Button>
					{readOnly ? null : <Button bsStyle="primary" disabled={validationError !== null} onClick={this.onSave}>{saveText}</Button>}
				</Modal.Footer>
			</Modal>
		);
	}
}
