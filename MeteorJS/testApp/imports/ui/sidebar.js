import { Template } from 'meteor/templating';
import { Types } from '../api/data-types.js';
 
import './sidebar.html';

Template.sidebar.onCreated(function sidebarOnCreated() {
  this.Title = new ReactiveVar('Select Type');  
});

Template.sidebar.helpers({
  title() {
    return Template.instance().Title.get();
  },
  types(){
		return Types.find().fetch();
  }
});

Template.sidebar.events({
  'click a'(event, instance) {
    // switch the string value for the sidebar title
    instance.Title.set(event.target.innerText);
  },
});
