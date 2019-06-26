import { uniqBy } from 'lodash';

export default {
	
	SET_{{module|upper}}(state, {total,items}) {
		state.items = items;
		state.all = uniqBy([...state.all,...items], "id").filter(e => e);
		state.total = total;
	},
	SET_ALL_{{module|upper}}(state, {total,items}) {
		state.all = uniqBy([...state.all,...items], "id").filter(e => e);
		state.total = total;
	},
	DELETE_{{moduleSingular|upper}}(state, id) {		
		state.items = state.items.filter(item => item.id != id);
		state.all = state.all.filter(item => item.id != id);
		state.total--;
	},
	ADD_{{moduleSingular|upper}}(state, payload) {
		state.items.push(payload);
		state.all = uniqBy([...state.all,payload], "id").filter(e => e);
		state.total++;
	},
	UPDATE_{{moduleSingular|upper}}(state, payload) {	
		const updateMap = item => payload.id == item.id ? {...item,...payload} : item;
		state.items = state.items.map(updateMap);
		state.all = state.all.map(updateMap);
	},
	API_FAILURE(state, payload) {
		state.errors = payload;
	}
};
