📢 Use this project, [contribute](https://github.com/vtex-apps/product-highlights) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Product Highlights

<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

The Product Highlights app provides blocks to display highlight badges on products according to the collection or promotion they are linked to.

![Product Highlights Example](https://cdn.jsdelivr.net/gh/vtexdocs/dev-portal-content@main/images/vtex-product-highlights-0.png)

_In the image above, the product has a `Top Seller` highlight._

## Configuring Product Highlights

### Step 1 - Adding the Product Highlights app to your theme dependencies

In your theme `manifest.json` file, add the Product Highlights app as a dependency:

```diff
 "dependencies": {
+  "vtex.product-highlights": "2.x"
}
```

Now, you can use all the blocks exported by the `product-highlights` app. See the full list below:

| Block name                  | Description                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `product-highlights`        | Parent block for defining how the Product Highlights component will be displayed, based on its children blocks (`product-highlight-text` and `product-highlight-wrapper`) and props. |
| `product-highlight-text`    | Renders a `span` HTML tag with the highlight name. It also provides data attributes and CSS handles for style customizations.                                                        |
| `product-highlight-wrapper` | You may use this block if you need to render other blocks alongside the highlight name. It renders a `div` HTML tag and its children blocks, if any.                                 |

### Step 2 - Adding the Product Highlights blocks to your theme templates

Copy one of the examples stated below and paste it into your desired theme template, making the necessary changes. If needed, add the `product-highlights` block to the template block list.

- Simple example:

```json
{
  "vtex.product-highlights@2.x:product-highlights": {
    "children": ["product-highlight-text"]
  },
  "product-highlight-text": {
    "props": {
      "message": "{highlightName}"
    }
  }
}
```

- Example using the `link` prop:

```json
{
  "vtex.product-highlights@2.x:product-highlights": {
    "children": ["product-highlight-text"]
  },
  "product-highlight-text": {
    "props": {
      "message": "{highlightName}",
      "link": "/collection/{highlightId}"
    }
  }
}
```

- Example using `product-highlight-wrapper`:

```jsonc
{
  "vtex.product-highlights@2.x:product-highlights": {
    "children": ["product-highlight-wrapper"]
  },
  "product-highlight-wrapper": {
    "children": [
      "icon-star", // You can add anything inside a product-highlight-wrapper
      "product-highlight-text"
    ]
  },
  "product-highlight-text": {
    "props": {
      "message": "{highlightName}"
    }
  }
}
```

- Example using the prop `filter` and the prop `type`:

```jsonc
{
  "vtex.product-highlights@2.x:product-highlights": {
    "props": {
      "type": "teaser",
      "filter": {
        "type": "show",
        "highlightNames": ["10% Boleto"]
      }
    },
    "children": ["product-highlight-text"]
  },
  "product-highlight-text": {
    "props": {
      "message": "{highlightName}",
      "blockClass": "boleto"
    }
  }
}
```

> ⚠️ warning
>
> Note that **the Product Highlights blocks require a Product context to work properly, as they handle product data**. Therefore, when declaring these blocks, ensure that they are in a theme template or block where this context is available, such as the `store.product` and `product-summary.shelf`.

### `product-highlights` props

| Prop name | Type     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Default value |
| --------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `type`    | `enum`   | The desired type of product highlight to be displayed. Possible values are: `collection`, `promotion`, and `teaser`. `collection` highlights the product's collection, so it must be used with the [Collection Highlight](https://help.vtex.com/en/tutorial/collection-highlight-control--1tGdb2ndjqy6yWsk2YwKMu?locale=en) feature. `promotion` and `teaser` should be used when the product is configured with a [promotion that includes highlights](https://help.vtex.com/en/tutorial/configuring-promotions-with-a-highlightflag--tutorials_2295?locale=en). It can be used even if the promotion does not have any restrictions. On the other hand, the `teaser` must only be used when the promotion has restrictions.   ⚠️* Note that nominal promotions will only be displayed in the cart, not on the shelf or product page.* | `collection`  |
| `filter`  | `object` | Defines which highlights should and should not be displayed by the block.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `undefined`   |

> ⚠️ warning  
> Technically, the `collection` highlight maps to the [`clusterHighlights`](https://github.com/vtex-apps/search-graphql/blob/ea1d7e244e6b00b58e5aa4272fbb16987c483468/graphql/types/Product.graphql#L29)  property; the `promotion` highlight maps to the [`discountHighlights`](https://github.com/vtex-apps/search-graphql/blob/ea1d7e244e6b00b58e5aa4272fbb16987c483468/graphql/types/Product.graphql#L283) property; and the `teaser` highlight maps to the [`teasers`](https://github.com/vtex-apps/search-graphql/blob/ea1d7e244e6b00b58e5aa4272fbb16987c483468/graphql/types/Product.graphql#L284) property.

- **`filter` object:**

| Prop name        | Type       | Description                                                                                                                                                                                                                                                                | Default value |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `highlightNames` | `[string]` | An array of highlight names that determine which highlights should be hidden or shown based on the `type` property defined in the `product-highlights` block.                                                                                                              | `undefined`   |
| `type`           | `enum`     | Determines whether the highlights for the `highlightNames` prop should be displayed or hidden on the UI. Possible values are: `hide` (hides highlights declared in the `highlightNames` prop) or `show` (only shows the highlights declared in the `highlightNames` prop). | `undefined`   |

#### `product-highlight-text` props

| Prop name    | Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                             | Default value |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `blockClass` | `string`   | The block ID you chose to be used for [CSS customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization#using-the-blockclass-property).                                                                                                                                                                                                                       | `undefined`   |
| `message`    | `string`   | Defines the block default text message to be rendered in the UI. You can also use the Admin Site Editor and the `markers` prop to specify the text message that the block will render on the UI.                                                                                                                                                                                                                        | `undefined`   |
| `markers`    | `[string]` | IDs you chose to identify the block's rendered text message and customize it using the Admin Site Editor. Learn how to use them in [Using the Markers prop to customize a block message](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-the-markers-prop-to-customize-a-blocks-message). Note that a block message can also be customized in the Store Theme source code using the `message` prop. | `[]`          |
| `link`       | `string`   | If this prop is set, it creates a link to the string passed. You can interpolate the variables `highlightText` and `highlightId`. Example: `/collection/{highlightId}`.                                                                                                                                                                                                                                                 | `undefined`   |

#### `product-highlight-wrapper` props

| Prop name    | Type     | Description                                                                                                                                                                                      | Default value |
| ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- |
| `blockClass` | `string` | The block ID you chose to be used in [CSS customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization#using-the-blockclass-property). | `undefined`   |

### Step 3 - Editing the `product-highlight-text` messages

The `product-highlight-text` block uses the [ICU Message Format](https://format-message.github.io/icu-message-format-for-translators/), enabling comprehensive customization of the rendered text messages.

When using the `message` prop, you will not need to create an advanced configuration: declare the prop directly in your Store Theme app and pass to it the desired text value to be rendered with the block.

The `markers` prop, in turn, requires you to add an extra configuration in the Site Editor of the Admin to properly work. When using this prop, do not forget to check out the block's message variables (shown in the table below) and the [Using the Markers prop to customize a block's message](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-the-markers-prop-to-customize-a-blocks-message) documentation.

| Message variable | Type     | Description          |
| ---------------- | -------- | -------------------- |
| `highlightName`  | `string` | Highlights the name. |

## Customization

To apply CSS customizations to this and other blocks, follow the instructions in [Using CSS handles for store customizations](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

| CSS handles               |
| ------------------------- |
| `productHighlightText`    |
| `productHighlightWrapper` |

| Data attributes       |
| --------------------- |
| `data-highlight-name` |
| `data-highlight-id`   |
| `data-highlight-type` |

<!-- DOCS-IGNORE:start -->

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/igor-becker-73b7901a3/"><img src="https://avatars.githubusercontent.com/u/57180581?v=4?s=100" width="100px;" alt=""/><br /><sub><b>proudynyu</b></sub></a><br /><a href="https://github.com/vtex-apps/product-highlights/commits?author=proudynyu" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
