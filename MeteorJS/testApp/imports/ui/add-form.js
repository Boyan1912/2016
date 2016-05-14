import { Template } from 'meteor/templating';
import { Types } from '../api/data-types.js';
import { Examples } from '../api/data-examples.js';
import { Meteor } from 'meteor/meteor';

import './add-form.html';


Template.add.helpers({
	types: function(){
		return Types.find({});
	}	
});

Template.add.events({
	'submit .new-example'(event){
		event.preventDefault();

		const target = event.target;

		Examples.insert({
			name: target.name.value,
			type: target.type.value,
			description: target.description.value,
			content: target.content.value,
			createdAt: new Date().toString().slice(0, 10)
		});

		// Meteor.call('addExample', newExample);
	}
})