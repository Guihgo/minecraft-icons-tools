# Minecraft Icon Tools

https://guihgo.github.io/minecraft-icons-tools/

## Steps to reload data

1. Go go https://minecraft-ids.grahamedgecombe.com/ and https://minecraft-ids.grahamedgecombe.com/entities

2. Run `web_crawler.js`

3. Save raw data files at `public/api/assets`

4. Reload data

```bash
npm run build
npm run reload-data
```

5. Commit changes

6. Run local web server to view and download data

```bash
npm run start
```

Open at http://localhost:3000


### Sprites download

- Items: https://minecraft-ids.grahamedgecombe.com/images/sprites/items-28.png
- Entities: https://minecraft-ids.grahamedgecombe.com/images/sprites/entities-28.png
- Potions: https://minecraft-ids.grahamedgecombe.com/images/sprites/potions-28.png

Put all them on `./assets/<category>-28.png`