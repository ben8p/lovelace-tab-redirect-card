[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)  

# tab-redirect-card
Custom [Lovelace](https://www.home-assistant.io/lovelace) card to use in [Home assistant](https://www.home-assistant.io/) allowing you to redirect a user to certain view based on entity states.  
You can see it as a way to set the default tab based on entity states.  

A common use-case is to put the card on the default view and have it redirecting you under some conditions.  

For instance:
- if sun is below_horizon you want the default view to be the tab controlling the light
- but when you are outside, you want the default view to be tab with the cameras
- rest of the time, the default view should be the regular default view (aka no redirect)

### Installation
Use [HACS](https://hacs.xyz/) or follow this [guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins)

```
resources:
  url: /local/tab-redirect-card.js
  type: module
```

### Configuration example:
Note: `redirect_to_tab` starts at 0 (first tab)  

 - Redirect user "foo" to the 2nd tab if `input.binary.is_home` is `on`:
```yaml
type: 'custom:tab-redirect-card'
redirect:
 - user: 'foo'
   entity_id: 'input.binary.is_home'
   entity_state: 'on'
   redirect_to_tab_index: 1
```

 - Redirect user "foo" to the 2nd tab if `input.binary.is_home` is `on`  
   And redirect user "bar" to the 3rd tab if `input.binary.is_home` is `on`  
```yaml
type: 'custom:tab-redirect-card'
redirect:
 - user: 'foo'
   entity_id: 'input.binary.is_home'
   entity_state: 'on'
   redirect_to_tab: 1
 - user: 'bar'
   entity_id: 'input.binary.is_home'
   entity_state: 'on'
   redirect_to_tab_index: 2
```

 - Redirect every user by not setting the user option:
```yaml
type: 'custom:tab-redirect-card'
redirect:
 - entity_id: 'input.binary.is_home'
   entity_state: 'on'
   redirect_to_tab_index: 1
```

 - Always redirect with the force option.
   This will ignore the cache and will always redirect if the card is rendered.
```yaml
type: 'custom:tab-redirect-card'
redirect:
 - user: 'foo'
   entity_id: 'input.binary.is_home'
   entity_state: 'on'
   redirect_to_tab_index: 1
   force: true
```

### Tips: Panel Mode
When using panel mode, the redirect card needs to be in the 1st row of each tab otherwise it won't work.  
If the panel has only one entity, wrap it into an horizontal stack and add the redirect card in the second column.  
