---
layout: default
title: Blog
permalink: /blog/
description: Latest posts
---

<div class="container">
  <div class="row justify-content-start">
    <div class="col-12 col-md-8">
      <div class="content">

## Blog

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a> — {{ post.date | date: "%B %e, %Y" }}
  </li>
{% endfor %}
</ul>

      </div>
    </div>
  </div>
</div>
