import http from "@/api/http";

const URL = "/api/{{module}}/";

import showMessage from "@/util/showMessage";

export default {
	async get({ commit, dispatch }, params = {}) {
		try {
			dispatch("setLoading", true, { root: true });

			const { data, status } = await http.get(URL, { params });

			if (status === 200) {
				const total = parseInt(data.total);

				delete data.total;

				const dados = {
					items: Object.values(data),
					total
				};

				commit("SET_{{module|upper}}", dados);
			}

			return data;
		} catch (error) {
			commit("API_FAILURE", error.message);
		} finally {
			dispatch("setLoading", false, { root: true });
		}
	},
	async getAll({ commit, dispatch }, params = {}) {
		try {
			dispatch("setLoading", true, { root: true });

			const { data, status } = await http.get(URL, { params });

			if (status === 200) {
				const total = parseInt(data.total);

				delete data.total;

				const dados = {
					items: Object.values(data),
					total
				};

				commit("SET_ALL_{{module|upper}}", dados);
			}

			return data;
		} catch (error) {
			commit("API_FAILURE", error.message);
		} finally {
			dispatch("setLoading", false, { root: true });
		}
	},

	async update({ commit, dispatch }, dados) {
		try {
			dispatch("setLoading", true, { root: true });

			const { data, status } = await http.patch(URL, { ...dados });

			const msg = data.msg || data.erro;
			if (msg) showMessage(msg);

			if (status === 200) commit("UPDATE_{{moduleSingular|upper}}", data.dados);

			return data;
		} catch (error) {
			commit("API_FAILURE", error.message);
		} finally {
			dispatch("setLoading", false, { root: true });
		}
	},

	async add({ commit, dispatch }, dados) {
		try {
			dispatch("setLoading", true, { root: true });
			const { data, status } = await http.post(URL, dados);

			const msg = data.msg || data.erro;
			if (msg) showMessage(msg);

			if (status === 200 && data.dados)
				commit("ADD_{{moduleSingular|upper}}", data.dados);

			return data;
		} catch (error) {
			commit("API_FAILURE", error.message);
		} finally {
			dispatch("setLoading", false, { root: true });
		}
	},
	async delete({ commit, dispatch }, id) {
		try {
			dispatch("setLoading", true, { root: true });
			const { data, status } = await http.delete(`${URL}/${id}`);

			const msg = data.msg || data.erro;
			if (msg) showMessage(msg);

			if (status === 200) commit("DELETE_{{moduleSingular|upper}}", id);

			return data;
		} catch (error) {
			commit("API_FAILURE", error.message);
		} finally {
			dispatch("setLoading", false, { root: true });
		}
	}
};
