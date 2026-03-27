# Famealy Landing Page

## Design Theme

### Typography
| Role | Font | Usage |
|------|------|-------|
| Headings (h1–h3, section titles, footer title, FAQ section title) | **Playfair Display** (serif, 400/700) | Editorial, literary feel — suits a reading app |
| Body, navigation, FAQ questions, buttons, UI text | **Inter** (sans-serif, 400/500/600/700) | Modern, clean, highly legible at all sizes |

Both fonts are loaded via Google Fonts CDN in `_layouts/default.html`.

Font variables are defined in `assets/css/style.scss`:
```scss
$font-family-base:    'Inter', system-ui, -apple-system, sans-serif;
$font-family-heading: "Playfair Display", serif;
```

### Colours
| Variable | Hex | Role |
|----------|-----|------|
| `$primary` | `#c8962a` | Golden accent — links, buttons, borders |
| `$primary-dark` | `#9a7020` | Hover states |
| `$secondary` | `#e0b86a` | Secondary accent |
| `$black` | `#2c2a26` | Charcoal — main text |
| `$white` | `#f5efe6` | Sepia — page background |
| `$white-offset` | `#ede6d8` | Deeper sepia — borders, footer background |
| `$steel` | `#5a5248` | Warm mid-tone — secondary/muted text |

---

## Installation

### Installing Ruby & Jekyll

If this is your first time using Jekyll, please follow the [Jekyll docs](https://jekyllrb.com/docs/installation/) and make sure your local environment (including Ruby) is setup correctly.

### Installing Theme

Download or clone the theme.

To run the theme locally, navigate to the theme directory and run:

```
bundle install
```

To start the Jekyll local development server.

```
bundle exec jekyll serve

export $(cat .env | xargs) && bundle exec jekyll serve

```

To build the theme.

```
bundle exec jekyll build
```

## Deployment

### Github Pages

This theme has been tested to work with Github Pages (and Github Project Pages). When using Github Pages you will need to update the `baseurl` in the `_config.yml` otherwise all the css, images and paths will be broken.

For example the site https://zerostaticthemes.github.io/jekyll-serif-theme would have `baseurl: "/jekyll-serif-theme/"`
