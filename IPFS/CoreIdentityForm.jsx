

/*THIS FILE IS ADDED TO GIVE CLARITY TO HOW IPFS CLASS IS RENDERED.

LOOK at the *CoreIdentity* class to see the 'file_attrs' state var and how the methods
getFileDetails and handleHideModal are defined before they are passed as prop to UploadIpfsFile

LOOK at the  *CoreIdentity* class and see how it uses the *UniqueIdAttributesForm class to gather ipfs hashes, sha hashes, and labels..

as we add more attributes, we end up shifting the state vars 'tmpFile' and 'inputs'

'showModal' is the boolean thats always checked, and if true, the UploadIpfsFile class is rendered.
**Remember anytime you need to execute javascript in the render methods return, (like to build a list with an array), put the js code in inside curly brackets. {} 

{this.state.showModal ? <UploadIpfsFile pubKey={this.state.pubKey} dataHandler={this.getFileDetails.bind(this)} handleHideModal={this.handleHideModal}/> : null}

    file_attrs looks like: [{key: "IPFS_hash | shaHash}]
        [{"input-0":"QmPcY8sJ8hSfWhzqX8iLzQEbgiESjqTaeEEoJUrZwhLNk5|9bb7e24956771c4f1bbfe5eceff9e9e1457fafa5d3af3a56f4d7cef0bdd509dc"},
        {"input-1":"QmUJGfdKUCFiL2cKE3dcVFL5Q6PsvcWJSPxff5snJ46tuk|28a6ce8b3c55a60f5923cb87e5fd1c47decb973d1973f047f722141460fdad71"},]

*/



import React from 'react';
import TagsInput from 'react-tagsinput';
import { keccak_256 } from 'js-sha3';
import UploadIpfsFile from './UploadIpfsFile.jsx'
var crypto = require('crypto');
var secp256k1 = require('secp256k1');

//TODO : Namespace validation 


// //form where we can add addtional labels (uniqueIDAttrs)
class UniqueIDAttributesForm extends React.Component {

	constructor(props){
		super(props);
		this.state = {
		file_attrs:[],
		inputs: ['input-0'],
		tmpFile:'',
		showModal: false,
		pubKey: localStorage.getItem("pubKey")
		};
	
	}
	
	handleShowModal(e){
		this.setState({showModal: true, tmpFile: $(e.target).attr('data-id')});
    }
	
	handleHideModal(){
		this.setState({showModal: false});
	}
	
	render(){
		
		return(
			<div className="form-group col-md-12">
				<div className="col-md-10">
				<label htmlFor="unique_id_attrs"> Official IDs e.g. SSN, Passport, Driver's License, Digital retinal scans and/or digital fingerprints </label>
					<input name={'label-'+this.props.labelref} className="form-control col-md-4" type="text" placeholder="Label"  />
				</div>
				<div className="col-md-2">
					<button type="button" data-id={this.props.labelref} onClick={this.props.handleShowModal} className="btn btn-warning pull-right"><span className="glyphicon glyphicon-upload"></span>Upload File</button>
				</div>	
			</div>	
		);
	}

};

// class TokenDistributionForm extends React.Component {
    
//     constructor(props){
//         super(props)
//         this.state = {
//             controltoken_quantity: [],
//             controltoken_list: [],
            
//             showModal: false
//         };
//         this.maxUniqAttr = 10;
//         //this.onFieldChange = this.onFieldChange.bind(this);
//         this.handleHideModal = this.handleHideModal.bind(this);
//     }
//     handleShowModal(e){
//         this.setState({showModal: true, tmpFile: $(e.target).attr('data-id')});
//     }
    
//     handleHideModal(){
//         this.setState({showModal: false});
//     }
//     render(){
//         var style = {
//             fontSize: '12.5px'
//         }
//         return(
//             <div className="form-group col-md-12">
//                 <div className="col-md-10">
//                 <table className="table table-striped table-hover" style={style}>
//                         <tbody>
//                         <tr>
//                         <th><b>Public Key of Controller</b></th>
// 						<th><b>Control Token Quantity</b></th>
//                         </tr>
//                         <tr>
//                         <td><input name={'label1-'+this.props.labelref} className="form-control col-md-4" type="text" placeholder="Public Key of Controller"  /></td>
//                         <td><input name={'label1-'+this.props.labelref} className="form-control col-md-4" type="text" placeholder="Control Token Quantity"  /></td>
//                         </tr>
//                         </tbody>
//                 </table>
                
//                 </div>
//             </div>    
//         );
//     }
// };

class CoreIdentity extends React.Component {
	
	constructor(props){
		super(props);
		this.state = {
			file_attrs:[],
			inputs: ['input-0'], //removed input-1
			inputs_name:['input1-0'],
			official_id:[],		//first official ID is name (see identity spec v1.3)
			owner_id:[],
			control_id:[],
			recovery_id:[],
			recoveryCondition:[],
			isHuman:[],
			owner_token_id:[],
			owner_token_desc:[],
			owner_token_quantity:[],
			control_token_id:[],
			control_token_desc:[],
			control_token_quantity:[],
			showModal: false,
			tmpFile:'',
			pubKey: localStorage.getItem("pubKey"),
			privKey: localStorage.getItem("privKey"),
			signature:''
		};
		
		this.maxUniqAttr = 10;
		this.onFieldChange = this.onFieldChange.bind(this);
		this.handleHideModal = this.handleHideModal.bind(this);
	}
	
	onFieldChange(inputField, e){
		var multipleValues = {};
		if(inputField == "name" || inputField == "signature" || inputField =="message"){
			this.setState({[inputField]: e.target.value});
		} else {
			multipleValues[inputField] = e;
			this.setState(multipleValues);
		}
	}
	
	getHash(input){
		var input = $.trim(input);
		if(input){
			var hash = keccak_256(input)
			return hash;
		}
		return input;
	}
	
	getFileDetails(filedata){
		var obj = {[this.state.tmpFile]:filedata};
		this.setState({file_attrs: this.state.file_attrs.concat([obj])});
	}
	
	//used for uniqueID attributes
	getLabelValues(){
		var labelVals = []
		var _this = this;
		$.each($("input[name^='label-']"), function(obj){
			var value = $.trim($(this).val());
			if(value.length > 0){
				labelVals.push({
					//replace the 'label' with the entered unique attribute descriptor, for example 'Name' or 'US SSN'
					[$(this).attr('name').replace("label-","")] : value
				});
			}
		});
		return labelVals;
	}
	
	//used in token form class for control token distribution list.. is called by appendInput2()
	getLabelValues1(){
        var labelVals1 = []
		$.each($("input[name^='label1-']"), function(obj){
			var value = $.trim($(this).val());
			if(value.length > 0){
				labelVals1.push({
					//replace the 'label' with the entered unique attribute descriptor, for example 'Name' or 'US SSN'
					[$(this).attr('name').replace("label1-","")] : value
				});
			}
			console.log("obj: " + JSON.stringify(obj))
		});
        return labelVals1;
    }
	

	//TODO:
	//1)NEED TO DISTINGUISH COID for person or thing---DONE
	//2)CONTROLLERS need to be able to upload documents---LATER
	
	prepareJsonToSubmit(){
		console.log();
		this.prepareControlTokenDistribution();
		var inputObj = {
				"pubKey": this.refs.pubKey.value,
				//"sig": this.refs.signature.value,
				
				//"msg": this.refs.message.value,
				//"name": this.refs.nameReg.value,		no longer standalone part of JSON object (it is part of unique attributes)

				"uniqueId": this.createHashAttribute(this.state.file_attrs),
				"uniqueIdAttributes": this.prepareUniqueIdAttrs(),
				
				"ownershipId": this.createHashAttribute(this.state.owner_id),	//calculated from ownerIDlist
				"ownerIdList":this.valueIntoHash(this.state.owner_id),
				"controlId": this.createHashAttribute(this.state.control_id),
				"controlIdList": this.valueIntoHash(this.state.control_id),
				
				//calculated. should be one time hashing of ownershipTokenAttributes and ownership token quantity
				"ownershipTokenId": this.getHash(this.joinValuesOwnership()),	
				
				"ownershipTokenAttributes": this.state.owner_token_desc,					
				"ownershipTokenQuantity": this.state.owner_token_quantity,
				
				//calculated. should be one time hashing of controlTokenAttributes and control token quantity
				"controlTokenId": this.getHash(this.joinValuesControl()),
				
				"controlTokenAttributes": this.state.control_token_desc,
				"controlTokenQuantity": this.state.control_token_quantity,
				
				//pubkeys used for recovery in the event COID is lost or stolen			
				"identityRecoveryIdList": this.valueIntoHash(this.state.recovery_id),
				"recoveryCondition": this.state.recoveryCondition,
				"yesVotesRequiredToPass": 2,	//needs to be taken out and hardcoded in app
				
				"isHuman": true,
				"timestamp": "",
				"assetID": "MyCOID",
				"Type": "non_cash",
				"bigchainHash":  "",
				"bigchainID": "",
				"coidAddr": "",
				"gatekeeperAddr": "",
				"dimensions": ""

		};
		return inputObj;
	}
	
	joinValuesOwnership(){
		var value1 = this.state.owner_token_desc;
		var value2 = this.state.owner_token_quantity;
        var tempArr = [];
		tempArr.push(value1);
		tempArr.push(value2);
		tempArr = tempArr.join();
        return tempArr;
		}
		
	joinValuesControl(){
		var value1 = this.state.control_token_desc;
		var value2 = this.state.control_token_quantity;
        var tempArr = [];
		tempArr.push(value1);
		tempArr.push(value2);
		tempArr = tempArr.join();
        return tempArr;
		}
		
	createHashAttribute(values){
		if($.isArray(values) && values.length > 0){
			if($.isPlainObject(values[0])){
				var str = "";
				for(var i=0; i<values.length; i++){
					for(var key in values[i]){
						var hash, filehash;
						[hash,filehash] = values[i][key].split("|");
						if((values.length-1) == i)
							str += hash;
						else 
							str += hash+"|";
					}
				}
				return this.getHash(str);
				
				//if only one value in 'values'
			} else {
				var valStr = values.join("|");
				return this.getHash(valStr);
			}
			
		}
		return '';
	}
	
	//hashes arrays (no delimiter)
	valueIntoHash(values){
		var newArr = [];
		var _this = this;
		if($.isArray(values)){
			values.map((value) => {
				newArr.push(_this.getHash(value));
			});
		};
		return newArr;
	}
	
	prepareUniqueIdAttrs(){
		var newArr = [],
			labels = this.getLabelValues();
		for(var i=0; i<labels.length; i++){
			var tmpArr = [];
			for(var key in labels[i]){
				tmpArr.push(labels[i][key]);
				var ipfsHash, fileHash;
				[ipfsHash, fileHash] = this.state.file_attrs[i][key].split("|");
				tmpArr.push(fileHash);
				tmpArr.push(ipfsHash);
			}
			newArr.push(tmpArr);
		}
		return newArr;
	}
	
	prepareControlTokenDistribution(){
		var labels = this.getLabelValues1();
		for(var i=0; i<labels.length; i+=2){	
			for(var key in labels[i]){
				this.state.control_id.push(labels[i][key]);
				this.state.control_token_quantity.push(labels[i+1][key]);
			}	
		}
	}
	
	//hashing the pubkeys
	prepareTokenDistribution(value){
		var tempArr = value;
		for(var i=0; i<tempArr.length; i+=2){
			tempArr[i] = this.getHash(tempArr[i]);
		}
		return tempArr;
	}
	
	submitCoid(e){
		e.preventDefault();
		var json = this.prepareJsonToSubmit();
		var privKey1 = new Buffer(this.state.privKey,"hex");
		var msg_hash = keccak_256(JSON.stringify(json));
		var msg_hash_buffer = new Buffer(msg_hash,"hex");
		var signature1 = JSON.stringify(secp256k1.sign(msg_hash_buffer, privKey1))
		
		signature1 = JSON.parse(signature1).signature;
		signature1 = JSON.stringify(signature1);
		signature1 = JSON.parse(signature1).data;
		signature1 = new Buffer(signature1,"hex");
		signature1 = signature1.toString("hex");
		
		console.log("sig" + signature1)
		console.log(typeof(signature1))
		
		json.sig = signature1;
		json.msg = msg_hash_buffer.toString("hex");
		
		console.log(json)
		$.ajax({
			url: twinUrl + 'requestCOID',
			type: 'POST',
			data: json,
			success: function(res){
                console.log(JSON.stringify(json))
                var sendMe = {};
                sendMe.flag = 0; //owned core identity
                sendMe.fileName = "MyCOID.json" //
                sendMe.updateFlag = 0; //new identity
                sendMe.data = json;
                sendMe.pubKey = localStorage.getItem("pubKey");
                
				$.ajax({
					url: twinUrl + 'setAsset',
					type: 'POST',
					data: sendMe,
                    success: function(res)
                    {
                        console.log("response from setAsset: " + res)
                    }
				})
			},
			complete: function(){
				// do something
			}
		});
	}

	handleHideModal(){
		this.setState({showModal: false});
	}

	handleShowModal(e){
        this.setState({showModal: true, tmpFile: $(e.target).attr('data-id')});
    }

	appendInput() {
		var inputLen = this.state.inputs.length;
		if(inputLen < this.maxUniqAttr){
			var newInput = `input-${inputLen}`;
        	this.setState({ inputs: this.state.inputs.concat([newInput]) });
		}
    }
	
	//used in tokendistrubtionform
	appendInput2() {
		var inputLen = this.state.inputs_name.length;
		if(inputLen < this.maxUniqAttr){
			var newInput1 = `input1-${inputLen}`;
        	this.setState({ inputs_name: this.state.inputs_name.concat([newInput1]) });
		}
	}
	
	render () {
		var inputAttrs = {
			addKeys: [13,188],	// Enter and comma
			inputProps: {
				placeholder: "use comma(,) to add multiple values",
				style:{width:'30%'}
			}
		};
		var syle = {
			marginRight:'15px'
		}
	    return (
	    	<div id="SubmitContainer">
	    		<h1>Core Identity Submission Form</h1>
	    		<form method="POST" id="register" role="form">
					<div className="form-group">
						<label htmlFor="unique_id">Enter Unique ID Attributes. The first Attribute has to be name (first, last). Then add any official identification such as SSN or national ID number(s). Make sure to add the supporting file(s) through "Upload File".</label>
						{this.state.inputs.map(input => <UniqueIDAttributesForm handleShowModal={this.handleShowModal.bind(this)} min={this.state.subform_cont} max="10" key={input} labelref={input} />)}
					</div>
					<div className="form-group"> 
						<div className="col-md-offset-6 col-md-6 "> 
							<p></p>
							<button type="button" className="btn btn-info pull-right" style={syle} onClick={this.appendInput.bind(this)}>
								<span className="glyphicon glyphicon-plus"></span>Add More
							</button>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="owner_token_id">Enter Ownership Token Description. For example, 'Spencer tokens'.</label>
						<TagsInput {...inputAttrs} value={this.state.owner_token_desc} onChange={(e)=>{ this.onFieldChange("owner_token_desc", e) } } />
					</div>				
					<div className="form-group">
						<label htmlFor="owner_id">Enter Owner IDs. Owner IDs are the public keys of the identity owners. Only one owner for an individual (self).</label>
						<TagsInput {...inputAttrs} value={this.state.owner_id} onChange={(e)=>{ this.onFieldChange("owner_id", e) } } />
					</div>
					<div className="form-group">
						<label htmlFor="owner_token_id">Enter Ownership Token Quantity. For example, 1 token for an individual.</label>
						<TagsInput {...inputAttrs} value={this.state.owner_token_quantity} onChange={(e)=>{ this.onFieldChange("owner_token_quantity", e) } } />
					</div>
					<div className="form-group">
						<label htmlFor="control_token_id">Control Token ID Description. For example, 'Spencer tokens'.</label>
						<TagsInput {...inputAttrs} value={this.state.control_token_desc} onChange={(e)=>{ this.onFieldChange("control_token_desc", e) } } />
					</div>
					<div className="form-group">
						<label htmlFor="control_dist">Enter Controllers and their control token(s).</label>
						{this.state.inputs_name.map(input => <TokenDistributionForm handleShowModal={this.handleShowModal.bind(this)} min={this.state.subform_cont} max="10" key={input} labelref={input} />)}
					</div>
					<div className="form-group"> 
						<div className="col-md-offset-6 col-md-6 "> 
							<p></p>
							<button type="button" className="btn btn-info pull-right" style={syle} onClick={this.appendInput2.bind(this)}>
								<span className="glyphicon glyphicon-plus"></span>Add More
							</button>
						</div>
					</div>
					<div className="form-group">
						<label htmlFor="recovery_id">Recovery IDs (public keys of individuals who will attest to lost/stolen identity)</label>
						<TagsInput {...inputAttrs} value={this.state.recovery_id} onChange={(e)=>{ this.onFieldChange("recovery_id", e) } } />
					</div>
					<div className="form-group">
						<label htmlFor="recovery_id">Recovery Condition (# of digital signatures of recovery ID owners needed to recover identity)</label>
						<TagsInput {...inputAttrs} value={this.state.recoveryCondition} onChange={(e)=>{ this.onFieldChange("recoveryCondition", e) } } />
					</div>
					<div className="form-group">
					  <div className="col-sm-6">
					  <br/>
						<input className="form-control" ref="signature" type="hidden" value={this.state.signature} />
						<input type="hidden" name="pubkey" ref="pubKey" value={localStorage.getItem("pubKey")} />
						<button className="btn btn-primary" data-loading-text="Submit Identity" name="submit-form" type="button" onClick={this.submitCoid.bind(this)}>Submit Identity</button>
					  </div>
					</div>
				</form>
				{this.state.showModal ? <UploadIpfsFile pubKey={this.state.pubKey} dataHandler={this.getFileDetails.bind(this)} handleHideModal={this.handleHideModal}/> : null}
        </div>
    );
   }
}
export default CoreIdentity;
