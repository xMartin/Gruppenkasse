define([
	"gka/_View",
	"dijit/form/RadioButton",
	"dijit/form/ValidationTextBox",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/text!./templates/BoxView.html"
], function(_View, RadioButton, ValidationTextBox, domQuery, domConstruct, template){

return dojo.declare(_View, {
	
	templateString: template,
	
	name: "box",
	
	constructor: function(){
		this._boxOptionsConnects = []
	},
	
	postCreate: function(){
		this._createBoxChooser()
	},
	
	refresh: function(){
		this.getChildren().forEach(function(w){
			if(w.id.indexOf("boxRadioButton_") === 0){
				w.destroy()
			}
		})
		this._boxOptionsConnects.forEach(function(c){
			dojo.disconnect(c)
		})
		domQuery(".row._dynamic").forEach(function(n){
			domConstruct.destroy(n)
		})
		this._createBoxChooser()
	},
	
	_createBoxChooser: function(){
		this._boxOptionInsertNode = this.boxChooserHeadingNode
		this._boxOptionCount = 0
		this._getBoxes().forEach(this._addBoxOption, this)
	},
	
	_addBoxOption: function(boxName){
		var rowNode = dojo.create("div", {"class": "row _dynamic"})
		var radioButton = new dijit.form.RadioButton({id: "boxRadioButton_" + this._boxOptionCount, name: "box", value: boxName}).placeAt(rowNode)
		this.app.box == boxName && radioButton.set("checked", true)
		dojo.create("label", {"for": "boxRadioButton_" + this._boxOptionCount, innerHTML: boxName}, rowNode)
		dojo.place(rowNode, this._boxOptionInsertNode, "after")
		this._boxOptionsConnects.push(
			dojo.connect(rowNode, "onclick", function(evt){
				radioButton._onClick(evt)
			})
		)
		this._boxOptionInsertNode = rowNode
		this._boxOptionCount++
	},
	
	_selectNewBox: function(){
		dijit.byId("newBoxOption").set("checked", true)
	},
	
	_getBoxes: function(){
		var boxes = []
		this.app.store.query(function(){return true}).forEach(function(t){
			if(typeof(t)=='string'){
				try{
					t = JSON.parse(t)
				}catch (e){
					console.log('unparseable string transaction!')
				}
			}
			if(t.box && boxes.indexOf(t.box) === -1){
				boxes.push(t.box)
			}
		})
		return this._boxes = boxes
	},
	
	_addBox: function(boxName){
		this._boxes.push(boxName)
	},
	
	_setBox: function(boxName){
		this.app.setBox(boxName)
	},
	
	_onOkClick: function(){
		var values = this.getValues()
		if(values.box == "newBox"){
			this._addBoxOption(values.newBoxName)
			this._setBox(values.newBoxName)
			dijit.byId("boxRadioButton_" + (this._boxOptionCount - 1)).set("checked", true)
			dijit.byId("newBoxInput").set("value", "")
		}else{
			this._setBox(values.box)
		}
		this.close(this, "main")
	}
})

})
