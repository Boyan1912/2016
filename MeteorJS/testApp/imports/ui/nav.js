import { Template } from 'meteor/templating';
 
import './nav.html';

Template.nav.helpers({
	nameApp(){
		return "UI Examples";
	}
});