import { Template } from 'meteor/templating';
import { Examples } from '../api/data-examples.js';

import './example.html';


Template.example.helpers({
	latest: function(){
		return Examples.find({}, {sort: {createdAt: -1}, limit: 5});
	}	
});
