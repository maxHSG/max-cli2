import { filterBy, filterFieldinSet, filterDate, like, listStringToArray } from "@/util/filters";
import {isNumber,isEmpty} from 'lodash';
export const gettersRef = {
	getBy:state => params => {
		
		let {{module}} = {...state};
		
		{% for field in fields -%}
			{% if field.Field == 'id' -%}	
			if (params.f_{{ field.Field }}) 
				{{ module }}.all = 
				gettersRef.{{ field.Field | nameGetter }}({{module}})(
							Array.isArray(params.f_{{ field.Field }}) 
								? params.f_{{ field.Field }}
								: [ params.f_{{ field.Field }} ]
						);
			{% else %}
			if (params.f_{{ field.Field }}) 
				{{ module }}.all = gettersRef.{{ field.Field | nameGetter }}({{module}})(params.f_{{ field.Field }});
			{%- endif %}
		{% endfor %}

		return {{module}}.all;
		
	},
	getBySearch:state => f_busca => {
		if (isEmpty(f_busca)) return state.all;
		
		const busca = f_busca.toString();

		return state.all.filter( item => {
			if (isNumber(busca)){
				return (
		{% for field in fields | listWithNumbersAndIds -%}
	
				{% if field.Field.indexOf('_ids') === -1 -%}
					item.{{ field.Field }} == busca {% if !loop.last %} || {% endif %}
				{% else -%}	
					listStringToArray(item.{{ field.Field }}).includes(busca) {% if !loop.last %} || {% endif %}
				{%- endif %}
				


		{%- endfor %}

				);
			}
		
			else  {
				
				const searchLike = like(busca);
				
				return (
					{% for field in fields | listWithoutNumbersAndIds -%}
						
						searchLike(item.{{field.Field}}) {% if !loop.last %} || {% endif %}
						
					{%- endfor %}

				);
				
			}							

		});
	},
{% for field in fields -%}

	{% if field.Field === 'id' %}			
		{{ field.Field | nameGetter }}: state => {{field.Field}} => {
			return filterBy(state.all, true)({ {{field.Field}} });
		},
	{% elseif field.Field.indexOf('_ids') !== -1 %}	
		{{ field.Field | nameGetter }}: state => {{field.Field}} => {
			return filterFieldinSet(state.all)({ {{field.Field}} });
		},
	{% elseif field.Type.indexOf("date") !== -1 %}	
		{{ field.Field | nameGetter }}: state => {{field.Field}} => {
			return filterBy(state.all)({ {{field.Field}} });
		},
	{% else %}	
		{{ field.Field | nameGetter }}: state => {{ field.Field }} => {
			return filterBy(state.all)({ {{ field.Field }} });
		},
	{% endif %}			
{%- endfor %}

};


export default gettersRef;