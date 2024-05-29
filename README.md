# Minecraft Icon Tools

## Steps to update

1. Go go https://minecraft-ids.grahamedgecombe.com/

2. Get bundles stylesheet css file: 

https://minecraft-ids.grahamedgecombe.com/stylesheets/bundles/all/1644090399.css

3. Copy css class keys

```css
.items-28-0-0 {
    width: 32px;
    height: 32px;
    background: url(/images/sprites/items-28.png) 0 0 no-repeat
}

.items-28-1-0 {
    width: 32px;
    height: 32px;
    background: url(/images/sprites/items-28.png) -32px 0 no-repeat
}

.....

.entities-28-200 {
    width: 32px;
    height: 32px;
    background: url(/images/sprites/entities-28.png) 0 -128px no-repeat
}
.....


.potions-28-9-1 {
    width: 32px;
    height: 32px;
    background: url(/images/sprites/potions-28.png) -160px -64px no-repeat
}

```

4. Paste to data.txt

5. Use Visual Studio Code for editing as following way 

```txt
items-28-0-0 0 0
items-28-1-0 -32px 0
entities-28-25 -160px 0
entities-28-26 -160px -32px
entities-28-27 -160px -64px
entities-28-28 -160px -96px
potions-28-8-1 -160px 0
potions-28-9-0 -160px -32px
potions-28-9-1 -160px -64px
```

6. Transform .txt to .json

```bash
node items_data_txt_to_json.js
```

7. Run local web server to view and download data

```bash
npm run start
```

Open at http://localhost:3000


8. Download & Update each category on api directory


### Sprites download

- Items: https://minecraft-ids.grahamedgecombe.com/images/sprites/items-28.png
- Entities: https://minecraft-ids.grahamedgecombe.com/images/sprites/entities-28.png
- Potions: https://minecraft-ids.grahamedgecombe.com/images/sprites/potions-28.png

Put all them on `./assets/<category>-28.png`