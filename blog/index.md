---
layout: blog
title: Blog
permalink: /blog/
description: Latest posts
---

## Blog

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a> — {{ post.date | date: "%B %e, %Y" }}
  </li>
{% endfor %}
</ul>
