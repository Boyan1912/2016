import { Meteor } from 'meteor/meteor';

import { Examples } from '../imports/api/data-examples.js';
import { Types } from '../imports/api/data-types.js';

Meteor.methods({
	addExample: function(example){
		// if(!Meteor.userId()){
		// 	throw new Meteor.Error('not-authoized');
		// }

		var type = example.type || 'Unknown',
			description = example.description || 'N.A.';

		Examples.insert({
			content: example.content,
			type: type,
			name: example.name,
			description: description,
			createdAt: new Date().toString().slice(10)
			// username: Meteor.userId().username
		});
	},
	addCategories: function(){
		Types.remove({});

		Types.insert({
  			name: 'Navbar'
  		});
  		Types.insert({
  			name: 'Sidebar',
  		});
  		Types.insert({
  			name: 'Images',
  		});
  		Types.insert({
  			name: 'Video',
  		});
  		Types.insert({
  			name: 'Audio',
  		});
  		Types.insert({
  			name: 'Header',
  		});
  		Types.insert({
  			name: 'Footer',
  		});
  		Types.insert({
  			name: 'Collection',
  		});
  		Types.insert({
  			name: 'Form',
  		});
  		Types.insert({
  			name: 'Unknown'
  		});
	}
});


Meteor.startup(() => {
  // code to run on server at startup

});

Meteor.call('addCategories');
Examples.remove({});
