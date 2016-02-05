import React from "react";
import { Button } from "react-bootstrap";
import FormModal from "react-dmodel/lib/ui/bootstrap/FormModal";
import Int from "react-dmodel/lib/Int";
import Uint from "react-dmodel/lib/Uint";
import Float from "react-dmodel/lib/Float";
import Text from "react-dmodel/lib/Text";
import Group from "react-dmodel/lib/Group";
import DataModel from "react-dmodel/lib/DataModel";
import Enum from "react-dmodel/lib/Enum";


const dm = (
	<DataModel>
		<Int name="Int"/>
		<Float name="Float"/>
		<Text name="Text"/>
	</DataModel>
);


export default class Start extends React.Component {
	static displayName = "Start";

	state = {
		showFormModal: false,
		showFormModalSimple: false,

		dataSimple: {},

		dataComplex: {
			enum: "two",
			text: "Hallo World!",
			multiLineText: "Line 1\nLine 2",
			intPercent: 0,
			int: 1500,
			sliderValue: 5,
			float: 0.05,
		},
	};

	render() {
		console.log(dm);

		return (
			<div>
				<FormModal
					title="Simple FormModal"
					show={this.state.showFormModalSimple}
					data={this.state.dataSimple}
					onCancel={() => this.setState({showFormModalSimple: false})}
					onSave={dataSimple => this.setState({dataSimple, showFormModalSimple: false})}
					showValidationErrors
				>
					<Int name="int2" label="Int [-10..+10]" defaultValue={0} min={-10} max={10}/>
				</FormModal>

				<FormModal
					title="Complex FormModal"
					show={this.state.showFormModal}
					data={this.state.dataComplex}
					onCancel={() => this.setState({showFormModal: false})}
					onSave={dataComplex => this.setState({dataComplex, showFormModal: false})}
				>
					<ul>
						<li>My own markup</li>
						<li>mixed with the dmodel</li>
					</ul>
					<Group style={{columns: 2}}>
						<Text name="text" label="Single line text"/>
						<Text name="multiLineText" label="Multi line text" multiLine style={{height: 100}}/>
						<Uint name="intPercent" label="Uint" max={100} unit="%"/>
						<Int name="int" label="Int [1000..2000]" min={1000} max={2000} unit="kg"/>
						<Float name="sliderValue" label="Slider for float value" min={0} max={10} style={{slider: {width: 200, tickSpacing: 2, snapToTicks: true}}}/>
						<Float name="float" label="Float" decimals={2}/>
						<Enum name="enum" options={["one", "two", "tree", "four"]}/>
					</Group>
				</FormModal>


				<h2>github.com/ungerik/react-dmodel</h2>
				<br/>
				<Button bsStyle="primary" onClick={() => this.setState({showFormModalSimple: true})}>Simple FormModal</Button>
				<br/><br/>
				<pre style={{fontSize: "20px"}}>{JSON.stringify(this.state.dataSimple, null, 2)}</pre>
				<br/><br/>
				<Button bsStyle="primary" onClick={() => this.setState({showFormModal: true})}>Complex FormModal</Button>
				<br/><br/>
				<pre style={{fontSize: "20px"}}>{JSON.stringify(this.state.dataComplex, null, 2)}</pre>
			</div>
		);
	}
}
