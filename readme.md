# OBJECT-UPDATE

Library to manipulate javascript object

## Commands
- {Object}.find(conditions)
- {Object}.merge(data)
- {Object}.update(conditions, data)

## Examples
```js
const state = {
  data: {
    users: {
      123456: {
        _id: 123456,
        active: true,
        status: true,
        info: {
          name: 'Alessandro',
          age: 24,
          links: {
            blog: 'https://aloisio.work',
          },
        },
      },
    },
    favourites: {
      234567: {
        _id: 234567,
        active: true,
        status: true,
        info: {
          name: 'Alicia',
          age: 24,
        },
      },
    },
  },
  loading: false,
  error: null,
};
```


# License

MIT © Aloisio Alessandro
