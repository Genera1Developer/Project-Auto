## File Structure

- `adblocker/ublock.js`
- `adblocker/ublock.worker.js`
- `service-worker.js`
- `package.json`
- `README.md`

## Raw Code for `config.js`

```javascript
export const filterLists = [
  'https://easylist.to/easylist/easylist.txt',
  'https://easylist.to/easylist/easyprivacy.txt',
  'https://filterlists.com/subscription.php?address=adblock-plus-subscriptions',
  'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts'
];

export const debug = false;

export const proxyPatterns = ['.*'];
```