class TabRedirectCard extends HTMLElement {
	set hass(hass) {
		this.style.display = 'none';
		
		const homeAssistant = document.querySelector('home-assistant');
		const root = homeAssistant.shadowRoot.querySelector('home-assistant-main').shadowRoot;
		const sidebarRoot = root.querySelector('ha-sidebar').shadowRoot;
		const sidebarListbox = sidebarRoot.querySelector('paper-listbox');
		const panel = root.querySelector('ha-panel-lovelace')
		if(!panel) { return; }
		const uiRoot = panel.shadowRoot.querySelector('hui-root')
		if(!uiRoot) { return; }
		const isEditing = uiRoot.shadowRoot.querySelector('.edit-mode');
		if(isEditing) { return; }

		let tabs = uiRoot.shadowRoot.querySelector('sl-tab-group');
		const tabList = tabs.tabs;

		const userConfigs = this.config.redirect.filter((item) => !item.user || item.user === hass.user.name);
		userConfigs.forEach((config) => {
			const state = hass.states[config.entity_id].state;

			const keyId = `${config.user ?? "any"}-${config.entity_id}`;

			const lastSeenStateKey = `TabRedirectCard-LastSeenState-${keyId}`;
			const lastRedirectKey = `TabRedirectCard-LastRedirect-${keyId}`;

			// if previous recorded state is different, remove cache
			if(state !== sessionStorage.getItem(lastSeenStateKey)) {
				sessionStorage.removeItem(lastRedirectKey);
			}
			sessionStorage.setItem(lastSeenStateKey, state);

			// if we should redirect and cache is empty
			if(state === config.entity_state && (config.force === true || !sessionStorage.getItem(lastRedirectKey))) {
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
			if(redirect.user && typeof redirect.user !== 'string') {
				throw new Error('The type of user is not string');
			}
			if(redirect.force && typeof redirect.force !== 'boolean') {
				throw new Error('The type of force is not boolean');
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
