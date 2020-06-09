class TabRedirectCard extends HTMLElement {
	set hass(hass) {
		const homeAssistant = document.querySelector('home-assistant');
		const root = homeAssistant.shadowRoot.querySelector('home-assistant-main').shadowRoot;
		const sidebarRoot = root.querySelector('ha-sidebar').shadowRoot;
		const sidebarListbox = sidebarRoot.querySelector('paper-listbox');
		const overview = sidebarListbox.querySelector('[data-panel="lovelace"]');
		if(!overview) { return; }
		const panel = root.querySelector('ha-panel-lovelace')
		if(!panel) { return; }
		const uiRoot = panel.shadowRoot.querySelector('hui-root')
		if(!uiRoot) { return; }
		const header = uiRoot.shadowRoot.querySelector('app-header');
		const isEditing = header.classList.contains('edit-mode');
		if(isEditing) { return; }
		const tabs = uiRoot.shadowRoot.querySelector('paper-tabs');
		const tabList = tabs.querySelectorAll('paper-tab');

		const userConfigs = this.config.redirect.filter((item) => item.user === hass.user.name);
		userConfigs.forEach((config) => {
			const state = hass.states[config.entity_id].state;

			const keyId = `${config.user}-${config.entity_id}`;

			const lastSeenStateKey = `TabRedirectCard-LastSeenState-${keyId}`;
			const lastRedirectKey = `TabRedirectCard-LastRedirect-${keyId}`;

			// if previous recorded state is different, remove cache
			if(state !== sessionStorage.getItem(lastSeenStateKey)) {
				sessionStorage.removeItem(lastRedirectKey);
			}
			sessionStorage.setItem(lastSeenStateKey, state);

			// if we should redirect and cache is empty
			if(state === config.entity_state && !sessionStorage.getItem(lastRedirectKey)) {
				sessionStorage.setItem(lastRedirectKey, 'true');
				tabList[config.redirect_to_tab_index].click();
			}
		});
	}



	setConfig(config) {
		if (!config.redirect || !Array.isArray(config.redirect) || config.redirect.length === 0) {
			throw new Error('You need to define a redirect (array)');
		}
		config.redirect.forEach((redirect) => {
			if(!redirect) {
				throw new Error('You need to define a redirect (array)');
			}
			if(!redirect.user || typeof redirect.user !== 'string') {
				throw new Error('You need to define user (string)');
			}
			if(!redirect.entity_id || typeof redirect.entity_id !== 'string') {
				throw new Error('You need to define entity_id (string)');
			}
			if(!redirect.entity_state) {
				throw new Error('You need to define entity_state');
			}
			if(redirect.redirect_to_tab_index === undefined || typeof redirect.redirect_to_tab_index !== 'number' || !Number.isInteger(redirect.redirect_to_tab_index)) {
				throw new Error('You need to define redirect_to_tab_index (integer, starting from 0)');
			}
		});
		this.config = config;
	}
}
customElements.define('tab-redirect-card', TabRedirectCard);
